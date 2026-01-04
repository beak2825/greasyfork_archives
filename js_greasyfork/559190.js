// ==UserScript==
// @name         Google Slides: Open/Download selected images
// @namespace    https://github.com/austinpresley/scripts
// @version      1.8.0
// @description  Adds Open/Download items to the image right-click menu in Google Slides (multi-select, cached before right-click).
// @match        https://docs.google.com/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/559190/Google%20Slides%3A%20OpenDownload%20selected%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/559190/Google%20Slides%3A%20OpenDownload%20selected%20images.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if (!location.pathname.startsWith("/presentation/")) return;

  let lastContext = { x: 0, y: 0, path: [] };

  // Cache selection BEFORE Slides potentially changes it on right-click
  let cachedUrls = null;
  let cachedAt = 0;

  const ICON_OPEN_IN = svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#5f6368" viewBox="0 0 24 24">
      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
      <path d="M19 19H5V5h8V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8h-2v8z"/>
    </svg>
  `);

  const ICON_DOWNLOAD = svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#5f6368" viewBox="0 0 24 24">
      <path d="M5 20h14v-2H5v2z"/>
      <path d="M12 2v12l4-4 1.41 1.41L12 17.83l-5.41-5.42L8 10l4 4V2z"/>
    </svg>
  `);

  GM_addStyle(`
    .tm-menuitem .goog-menuitem-icon{
      width:16px !important;
      height:16px !important;
      background-repeat:no-repeat !important;
      background-position:center !important;
      background-size:16px 16px !important;
      flex: 0 0 16px;
    }

    .goog-menu .tm-menuitem:hover,
    .goog-menu .tm-menuitem.goog-menuitem-highlight{
      background: #f1f3f4 !important;
    }

    .tm-menuitem .goog-menuitem-content{
      display:flex;
      align-items:center;
      gap: 10px;
    }
  `);

  function svgToDataUri(svg) {
    const cleaned = svg.replace(/\s+/g, " ").trim();
    return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleaned)}")`;
  }

  function plural(n, singular, pluralWord) {
    return n === 1 ? singular : pluralWord;
  }

  function isProbablyUrl(s) {
    return typeof s === "string" && (
      s.startsWith("http://") ||
      s.startsWith("https://") ||
      s.startsWith("data:image/") ||
      s.startsWith("blob:")
    );
  }

  function getHrefFromSvgImage(imgEl) {
    if (!imgEl) return null;
    const href =
      (imgEl.href && imgEl.href.baseVal) ||
      imgEl.getAttribute("href") ||
      imgEl.getAttribute("xlink:href");
    return isProbablyUrl(href) ? href : null;
  }

  function elementContainsPoint(el, x, y) {
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }

  function rectArea(r) {
    const w = Math.max(0, r.right - r.left);
    const h = Math.max(0, r.bottom - r.top);
    return w * h;
  }

  function overlapRatio(a, b) {
    const left = Math.max(a.left, b.left);
    const right = Math.min(a.right, b.right);
    const top = Math.max(a.top, b.top);
    const bottom = Math.min(a.bottom, b.bottom);
    const w = Math.max(0, right - left);
    const h = Math.max(0, bottom - top);
    const inter = w * h;
    if (inter <= 0) return 0;
    const denom = Math.min(rectArea(a), rectArea(b)) || 1;
    return inter / denom;
  }

  function findImageUrlAtPoint(x, y) {
    // try event path first
    for (const n of lastContext.path || []) {
      if (!n || !n.tagName) continue;
      if (n.tagName === "IMG" && isProbablyUrl(n.src)) return n.src;
      if (n.tagName.toLowerCase() === "image") {
        const u = getHrefFromSvgImage(n);
        if (u) return u;
      }
    }

    // scan SVG images top-most last
    const svgImages = Array.from(document.querySelectorAll("svg image"));
    for (let i = svgImages.length - 1; i >= 0; i--) {
      const img = svgImages[i];
      try {
        if (!img.isConnected) continue;
        if (!elementContainsPoint(img, x, y)) continue;
      } catch {
        continue;
      }
      const u = getHrefFromSvgImage(img);
      if (u) return u;
    }

    return null;
  }

  // Find blue selection outlines (SVG strokes OR div borders) and match to images by bounding boxes
  function findSelectionRects() {
    const BLUE = "26, 115, 232";
    const rects = [];

    // SVG selection outlines
    for (const el of Array.from(document.querySelectorAll("svg rect, svg path"))) {
      try {
        const cs = getComputedStyle(el);
        const stroke = String(cs.stroke || "");
        if (!stroke.includes(BLUE)) continue;

        const r = el.getBoundingClientRect();
        if ((r.right - r.left) < 20 || (r.bottom - r.top) < 20) continue;
        rects.push(r);
      } catch {}
    }

    // DIV border selection outlines (some builds)
    for (const el of Array.from(document.querySelectorAll("div"))) {
      try {
        const cs = getComputedStyle(el);
        const bw = parseFloat(cs.borderWidth || "0");
        const bs = String(cs.borderStyle || "");
        const bc = String(cs.borderColor || "");
        if (bw <= 0 || bs === "none") continue;
        if (!bc.includes(BLUE)) continue;

        const r = el.getBoundingClientRect();
        if ((r.right - r.left) < 20 || (r.bottom - r.top) < 20) continue;
        rects.push(r);
      } catch {}
    }

    // Dedup-ish
    rects.sort((a, b) => rectArea(b) - rectArea(a));
    const out = [];
    for (const r of rects) {
      const dup = out.some(o => overlapRatio(o, r) > 0.9);
      if (!dup) out.push(r);
      if (out.length > 50) break;
    }
    return out;
  }

  function getSelectedImageUrlsNoFallback() {
    const selectionRects = findSelectionRects();
    if (!selectionRects.length) return [];

    const svgImages = Array.from(document.querySelectorAll("svg image"));
    const selected = [];

    for (const img of svgImages) {
      let r;
      try { r = img.getBoundingClientRect(); } catch { continue; }
      if ((r.right - r.left) < 5 || (r.bottom - r.top) < 5) continue;

      const matched = selectionRects.some(sr => overlapRatio(sr, r) > 0.75);
      if (!matched) continue;

      const u = getHrefFromSvgImage(img);
      if (u) selected.push(u);
    }

    return Array.from(new Set(selected));
  }

  function getImageUrlsForAction() {
    // Use cache if it’s fresh
    if (cachedUrls && (Date.now() - cachedAt) < 1500 && cachedUrls.length) {
      return cachedUrls;
    }

    // Otherwise compute now (selection first, then cursor fallback)
    const sel = getSelectedImageUrlsNoFallback();
    if (sel.length) return sel;

    const single = findImageUrlAtPoint(lastContext.x, lastContext.y);
    return single ? [single] : [];
  }

  function isVisible(el) {
    if (!el) return false;
    const r = el.getClientRects();
    if (!r || r.length === 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden" && cs.opacity !== "0";
  }

  function findOpenContextMenu() {
    const menus = Array.from(document.querySelectorAll(".goog-menu, [role='menu']")).filter(isVisible);
    for (const m of menus) {
      const t = (m.innerText || "").toLowerCase();
      if (t.includes("crop image") && (t.includes("replace image") || t.includes("reset image"))) return m;
    }
    return null;
  }

  function closeMenu() {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  }

  function inferExtensionFromMime(mime) {
    if (!mime) return "png";
    if (mime.includes("jpeg")) return "jpg";
    if (mime.includes("png")) return "png";
    if (mime.includes("webp")) return "webp";
    if (mime.includes("gif")) return "gif";
    if (mime.includes("bmp")) return "bmp";
    if (mime.includes("tiff")) return "tif";
    return "png";
  }

  function removeIds(item) {
    if (item.id) item.removeAttribute("id");
    for (const el of item.querySelectorAll("[id]")) el.removeAttribute("id");
  }

  function stripAccelerator(item) {
    const accel = item.querySelector(".goog-menuitem-accel");
    if (accel) accel.remove();
  }

  function setMenuItemLabel(item, labelText) {
    const label = item.querySelector(".goog-menuitem-label");
    if (label) label.textContent = labelText;
    else (item.querySelector(".goog-menuitem-content") || item).textContent = labelText;
  }

  function replaceMenuItemIcon(item, bgImageCss) {
    for (const icon of Array.from(item.querySelectorAll(".goog-menuitem-icon"))) icon.remove();
    const content = item.querySelector(".goog-menuitem-content") || item;
    const icon = document.createElement("div");
    icon.className = "goog-menuitem-icon";
    icon.style.backgroundImage = bgImageCss;
    content.insertBefore(icon, content.firstChild);
  }

  function makeMenuItemFromTemplate(template, iconCss, labelText, onClick) {
    const item = template.cloneNode(true);
    item.classList.add("tm-menuitem");
    item.setAttribute("data-tm-custom", "1");
    item.setAttribute("aria-disabled", "false");
    item.setAttribute("role", "menuitem");
    item.tabIndex = -1;

    removeIds(item);
    stripAccelerator(item);
    setMenuItemLabel(item, labelText);
    replaceMenuItemIcon(item, iconCss);

    item.addEventListener("mousedown", (e) => { e.preventDefault(); e.stopPropagation(); }, true);
    item.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      closeMenu();
      setTimeout(onClick, 0);
    }, true);

    return item;
  }

  function makeSeparatorFromMenu(menu) {
    const existing = menu.querySelector(".goog-menuseparator, [role='separator']");
    if (existing) {
      const sep = existing.cloneNode(true);
      removeIds(sep);
      sep.setAttribute("data-tm-custom-sep", "1");
      return sep;
    }
    const sep = document.createElement("div");
    sep.className = "goog-menuseparator";
    sep.setAttribute("role", "separator");
    sep.setAttribute("data-tm-custom-sep", "1");
    return sep;
  }

  function openSelectedInTabs() {
    const urls = getImageUrlsForAction();
    if (!urls.length) return;

    GM_openInTab(urls[0], { active: true, insert: true, setParent: true });
    for (let i = 1; i < urls.length; i++) {
      GM_openInTab(urls[i], { active: false, insert: true, setParent: true });
    }
  }

  async function downloadSelected() {
    const urls = getImageUrlsForAction();
    if (!urls.length) return;

    let i = 1;
    for (const url of urls) {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const ext = inferExtensionFromMime(blob.type);

        const filename = `slides-image-${String(i).padStart(2, "0")}.${ext}`;
        const objectUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
      } catch {
        GM_openInTab(url, { active: true, insert: true, setParent: true });
      }
      i++;
    }
  }

  function injectMenuItems(menu) {
    if (!menu) return;
    if (menu.querySelector("[data-tm-custom='1']")) return;

    const txt = (menu.innerText || "").toLowerCase();
    if (!(txt.includes("crop image") && (txt.includes("replace image") || txt.includes("reset image")))) return;

    // Only show if at least 1 image is selected (or under cursor)
    const urls = getImageUrlsForAction();
    if (!urls.length) return;

    const menuItems = Array.from(menu.querySelectorAll(".goog-menuitem"));
    if (!menuItems.length) return;

    const template =
      menuItems.find(i => (i.innerText || "").toLowerCase().includes("copy")) ||
      menuItems.find(i => (i.innerText || "").toLowerCase().includes("cut")) ||
      menuItems[0];

    const n = urls.length;

    const openLabel = n === 1
      ? "Open image in new tab"
      : `Open ${n} images in new tabs`;

    const dlLabel = n === 1
      ? "Download image"
      : `Download ${n} images`;

    const openItem = makeMenuItemFromTemplate(template, ICON_OPEN_IN, openLabel, openSelectedInTabs);
    const dlItem   = makeMenuItemFromTemplate(template, ICON_DOWNLOAD, dlLabel, downloadSelected);
    const sep      = makeSeparatorFromMenu(menu);

    const first = menu.querySelector(".goog-menuitem, .goog-menuseparator, [role='menuitem'], [role='separator']");
    if (first && first.parentNode === menu) {
      menu.insertBefore(openItem, first);
      menu.insertBefore(dlItem, first);
      menu.insertBefore(sep, first);
    } else {
      menu.prepend(sep);
      menu.prepend(dlItem);
      menu.prepend(openItem);
    }
  }

  // Cache selection on right mouse down (before Slides changes it)
  document.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return; // right click
    try {
      cachedUrls = getSelectedImageUrlsNoFallback();
      cachedAt = Date.now();
    } catch {
      cachedUrls = null;
      cachedAt = 0;
    }
  }, true);

  // Context menu: record pointer + inject menu items
  document.addEventListener("contextmenu", (e) => {
    lastContext = {
      x: e.clientX,
      y: e.clientY,
      path: (typeof e.composedPath === "function") ? e.composedPath() : []
    };

    setTimeout(() => injectMenuItems(findOpenContextMenu()), 0);
    setTimeout(() => injectMenuItems(findOpenContextMenu()), 80);
  }, true);

})();