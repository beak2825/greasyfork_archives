// ==UserScript==
// @name         Torn Quick Items + Armoury (Glass UI + Fac Use)
// @namespace    https://torn.com/
// @version      1.3.8
// @description  Torns Quick Items Script
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561853/Torn%20Quick%20Items%20%2B%20Armoury%20%28Glass%20UI%20%2B%20Fac%20Use%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561853/Torn%20Quick%20Items%20%2B%20Armoury%20%28Glass%20UI%20%2B%20Fac%20Use%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STARTUP_TOKEN = "TT_QI_GLASS_FAC_ACTIVE";
  if (window[STARTUP_TOKEN]) return;
  window[STARTUP_TOKEN] = true;

  const IS_IOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const ITEMS_KEY = "tt_qi_items_v1";
  const ARM_KEY = "tt_arm_items_v1";
  const LEGACY_ITEMS_KEY = "tt_quick_items_v1";
  const LEGACY_ARM_KEY = "tt_armoury_quick_items_v1";

  // --------------- Storage helpers ---------------
  function gmGet(key, def) {
    try {
      if (typeof GM_getValue === "function") return GM_getValue(key, def);
    } catch {}
    const raw = localStorage.getItem(key);
    return raw == null ? def : raw;
  }

  function gmSet(key, val) {
    try {
      if (typeof GM_setValue === "function") return GM_setValue(key, val);
    } catch {}
    localStorage.setItem(key, val);
  }

  function safeJsonParse(s, fallback) {
    try { return JSON.parse(s); } catch { return fallback; }
  }

  function normalizeText(s) {
    return String(s || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  function stripTags(s) {
    return normalizeText(String(s || "").replace(/<[^>]*>/g, " "));
  }

  function toId(x) {
    const n = parseInt(String(x || ""), 10);
    return Number.isFinite(n) ? n : null;
  }

  function isBadName(name) {
    const n = normalizeText(name);
    const low = n.toLowerCase();
    if (!n) return true;
    if (low === "items" || low === "torn") return true;
    if (low === "items | torn") return true;
    if (low.includes("items | torn")) return true;
    return false;
  }

  function isArmouryTab() {
    return (
      location.pathname.includes("/factions.php") &&
      normalizeText(location.hash || "").toLowerCase().includes("armoury")
    );
  }

  function loadState(primaryKey, legacyKey) {
    const primaryRaw = gmGet(primaryKey, "");
    if (primaryRaw) {
      const s = safeJsonParse(primaryRaw, null);
      if (s && typeof s === "object" && Array.isArray(s.items)) return s;
    }
    const legacyRaw = gmGet(legacyKey, "");
    if (legacyRaw) {
      const s = safeJsonParse(legacyRaw, null);
      if (s && typeof s === "object" && Array.isArray(s.items)) return s;
    }
    return { items: [] };
  }

  function normalizeState(state) {
    const out = { items: [] };
    const seen = new Set();
    for (const it of (state && Array.isArray(state.items) ? state.items : [])) {
      const id = toId(it && it.id);
      if (id == null) continue;
      if (seen.has(id)) continue;
      seen.add(id);
      const name = isBadName(it && it.name) ? `Item #${id}` : String((it && it.name) || `Item #${id}`);
      out.items.push({ id, name });
    }
    return out;
  }

  let itemsState = normalizeState(loadState(ITEMS_KEY, LEGACY_ITEMS_KEY));
  let armState = normalizeState(loadState(ARM_KEY, LEGACY_ARM_KEY));

  function saveState() {
    itemsState = normalizeState(itemsState);
    armState = normalizeState(armState);
    gmSet(ITEMS_KEY, JSON.stringify(itemsState));
    gmSet(ARM_KEY, JSON.stringify(armState));
  }

  saveState();

  let itemsEditing = false;
  let armEditing = false;

  // --------------- UI styles (Glass) ---------------
  function ensureStyles() {
    if (document.getElementById("tt-qi-glass-style")) return;
    const style = document.createElement("style");
    style.id = "tt-qi-glass-style";
    style.textContent = `
      .tt-qi-card {
        margin-top: 8px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.25);
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
        padding: 10px;
        color: #fff;
        font-family: Arial, sans-serif;
      }
      .tt-qi-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        gap: 10px;
      }
      .tt-qi-title { font-weight: 800; font-size: 14px; }
      .tt-qi-btn {
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.06);
        color: #fff;
        padding: 6px 10px;
        cursor: pointer;
        font-size: 12px;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }
      .tt-qi-controls {
        display: flex;
        align-items: center;
        gap: 10px; /* space between button and caret */
      }
      .tt-qi-caret {
        cursor: pointer;
        transition: transform 0.75s
        ease; font-size: 14px; /* match your UI scale */
        opacity: 0.7; /* subtle like your other icons */
      }
      .tt-qi-header.collapsed .tt-qi-caret {
        transform: rotate(-90deg);
      }
      .tt-qi-inner {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        gap: 12px;
      }
      .tt-qi-content {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.5s ease;
      }
      .tt-qi-content.open {
        max-height: 600px; /* or auto with JS measurement */
        padding-top: 5px;
        transition: max-height 1.0s ease;
      }
      .tt-qi-item {
        position: relative;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.04);
        padding: 6px;
        cursor: pointer;
        text-align: center;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }
      .tt-qi-pic {
        height: 20vw; /* scales with screen width */
        max-height: 52px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-bottom: 4px;
      }
      .tt-qi-text {
        font-size: 10px;
        font-weight: 700;
        height: 2.4em;
        overflow: hidden;
        line-height: 1.2;
        
      }
      .tt-qi-remove {
        position: absolute;
        top: -5px;
        right: -5px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #c00;
        color: #fff;
        border: none;
        font-size: 12px;
        display: none;
        cursor: pointer;
        line-height: 18px;
        padding: 0;
        overflow: visible;
      }
      .tt-qi-editing .tt-qi-remove { display: block; }

      .tt-qi-response-wrap {
        margin-top: 10px;
        padding: 10px;
        background: rgba(0,0,0,0.3);
        border-radius: 8px;
        border-left: 3px solid #75a832;
        font-size: 13px;
        display: none;
      }
      .tt-qi-response-head {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        margin-bottom: 8px;
      }
      .tt-qi-response-head a { text-decoration: none; }

      .tt-qi-toast {
        position: fixed;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        z-index: 2147483647;
        background: rgba(0,0,0,0.82);
        border: 1px solid rgba(255,255,255,0.16);
        border-left: 3px solid #75a832;
        border-radius: 12px;
        padding: 10px 12px;
        color: #fff;
        font-family: Arial, sans-serif;
        font-size: 13px;
        max-width: 92vw;
        box-shadow: 0 12px 35px rgba(0,0,0,0.4);
      }
    `;
    document.head.appendChild(style);
  }

  function showToast(message) {
    ensureStyles();
    const existing = document.getElementById("tt-qi-toast");
    if (existing) existing.remove();

    const t = document.createElement("div");
    t.id = "tt-qi-toast";
    t.className = "tt-qi-toast";
    t.textContent = message;
    document.body.appendChild(t);

    setTimeout(() => {
      if (t && t.parentNode) t.remove();
    }, 1800);
  }

  // --------------- Timer support in response ---------------
  const TIMER_CLASS = "tt-qi-modified";

  function formatTimer(totalSeconds) {
    totalSeconds = Math.max(0, totalSeconds | 0);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) return `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function activateTimers(container) {
    container.querySelectorAll(".counter-wrap").forEach((el) => {
      if (el.classList.contains(TIMER_CLASS)) return;
      const seconds = parseInt(el.getAttribute("data-time") || el.getAttribute("data-seconds-left") || "NaN", 10);
      if (!Number.isFinite(seconds)) return;
      el.classList.add(TIMER_CLASS);
      el.setAttribute("data-seconds-left", String(seconds));
      el.textContent = formatTimer(seconds);
    });
  }

  setInterval(() => {
    document.querySelectorAll(`.${TIMER_CLASS}`).forEach((el) => {
      let s = parseInt(el.getAttribute("data-seconds-left") || "NaN", 10);
      if (!Number.isFinite(s) || s <= 0) return;
      s--;
      el.setAttribute("data-seconds-left", String(s));
      el.textContent = formatTimer(s);
    });
  }, 1000);

  // --------------- RFCV token (optional) ---------------
  let cachedRFCV = null;

  function findRFCVInScripts() {
    try {
      for (const s of Array.from(document.scripts)) {
        const txt = s && s.textContent ? s.textContent : "";
        if (!txt || txt.indexOf("rfcv") === -1) continue;
        const m =
          txt.match(/rfcv\s*[:=]\s*["']([a-f0-9]{8,})["']/i) ||
          txt.match(/["']rfcv["']\s*[:=]\s*["']([a-f0-9]{8,})["']/i);
        if (m && m[1]) return m[1];
      }
    } catch {}
    return null;
  }

  function getRFCV() {
    if (cachedRFCV) return cachedRFCV;

    try {
      if (window.rfcv && typeof window.rfcv === "string") {
        cachedRFCV = window.rfcv;
        return cachedRFCV;
      }
    } catch {}

    try {
      const meta = document.querySelector('meta[name="rfcv"], meta[property="rfcv"]');
      if (meta) {
        const v = meta.getAttribute("content");
        if (v) {
          cachedRFCV = v;
          return cachedRFCV;
        }
      }
    } catch {}

    const fromScripts = findRFCVInScripts();
    if (fromScripts) {
      cachedRFCV = fromScripts;
      return cachedRFCV;
    }

    cachedRFCV = null;
    return null;
  }

  function itemPhpUrl() {
    const r = getRFCV();
    if (r) return `/item.php?rfcv=${encodeURIComponent(r)}`;
    return "/item.php";
  }

  // --------------- Name improvement from response ---------------
  function updateNameFromResponse(stateObj, id, htmlText) {
    const clean = String(htmlText || "");
    const m = clean.match(/<b[^>]*>([\s\S]*?)<\/b>/i);
    if (!m || !m[1]) return;

    const name = stripTags(m[1]);
    if (!name || isBadName(name)) return;

    const it = stateObj.items.find((x) => x.id === id);
    if (it && (isBadName(it.name) || it.name === `Item #${id}`)) {
      it.name = name;
      saveState();
      // Update any visible panels
      render("items");
      render("arm");
    }
  }

  // --------------- Response rendering ---------------
  function renderResponse(responseWrap, id, source, payload) {
    // payload: { html, links: [...] }
    responseWrap.style.display = "block";

    const links = Array.isArray(payload.links) ? payload.links : [];
    const bodyHtml = String(payload.html || "").replace(/<\\\//g, "</").replace(/\\"/g, '"');

    const headLinks = [];
    
    //headLinks.push(`<a href="#" class="tt-qi-use-another t-blue h" data-item="${id}" data-source="${source}">Use another</a>`);
    //headLinks.push(`<a href="#" class="tt-qi-use-faction t-blue h" data-item="${id}">Use from armory</a>`);

    // Also render any server-provided "next-act" links (Drink another / Drink another from faction)
    const linkHtml = [];
    linkHtml.push(`<a href="#" class="tt-qi-close-btn t-blue h">Close</a>`);
    for (const l of links) {
      const title = normalizeText(l && l.title);
      const cls = normalizeText(l && l.class);
      const attr = String((l && l.attr) || "");
      // Keep only a subset of attributes, but preserve data-item/data-fac
      const dataItem = (attr.match(/data-item\s*=\s*([0-9]+)/i) || [])[1];
      const dataFac = (attr.match(/data-fac\s*=\s*([01])/i) || [])[1];
      if (title && (cls.includes("next-act") || /another/i.test(title))) {
        const di = dataItem ? `data-item="${dataItem}"` : `data-item="${id}"`;
        const df = dataFac ? `data-fac="${dataFac}"` : `data-fac="0"`;
        linkHtml.push(`<a href="#" class="tt-qi-next-act t-blue h" ${di} ${df}>${title}</a>`);
      }
    }

    responseWrap.innerHTML = `
      <div class="tt-qi-response-inner">
        <div class="tt-qi-response-head">${headLinks.join("")}</div>
        ${linkHtml.length ? `<div class="tt-qi-response-head" style="margin-top:-2px;">${linkHtml.join("")}</div>` : ""}
        <div class="tt-qi-response-body">${bodyHtml}</div>
      </div>
    `;

    const closeBtn = responseWrap.querySelector(".tt-qi-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          responseWrap.style.display = "none";
        },
        true
      );
    }

    const useAnotherBtn = responseWrap.querySelector(".tt-qi-use-another");
    if (useAnotherBtn) {
      useAnotherBtn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          const item = toId(useAnotherBtn.getAttribute("data-item"));
          const src = useAnotherBtn.getAttribute("data-source");
          if (item == null) return;
          if (src === "arm") armUse(item, responseWrap);
          else itemsUse(item, responseWrap);
        },
        true
      );
    }

    const useFactionBtn = responseWrap.querySelector(".tt-qi-use-faction");
    if (useFactionBtn) {
      useFactionBtn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          armUse(id, responseWrap);
        },
        true
      );
    }

    // Server "next-act" links
    responseWrap.querySelectorAll(".tt-qi-next-act").forEach((a) => {
      a.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          const item = toId(a.getAttribute("data-item")) || id;
          const fac = toId(a.getAttribute("data-fac")) || 0;
          if (fac === 1) armUse(item, responseWrap);
          else itemsUse(item, responseWrap);
        },
        true
      );
    });

    activateTimers(responseWrap);
  }

  // --------------- API calls ---------------
  async function itemsUse(id, responseWrap) {
    if (!responseWrap) return;
    responseWrap.style.display = "block";
    responseWrap.innerHTML = `<div class="tt-qi-response-inner"><p>Working…</p></div>`;

    try {
      const res = await fetch(itemPhpUrl(), {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ step: "useItem", id: String(id), itemID: String(id) }),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "application/json, text/html;q=0.9, */*;q=0.8",
        },
      });

      const ct = (res.headers.get("content-type") || "").toLowerCase();
      let json = null;
      let htmlContent = "";
      let links = [];

      if (ct.includes("application/json")) {
        json = await res.json();
      } else {
        const raw = await res.text();
        const t = raw.trim();
        if (t.startsWith("{") && t.endsWith("}")) json = safeJsonParse(t, null);
        if (!json) htmlContent = raw;
      }

      if (json) {
        htmlContent = json.text || json.msg || json.message || json.html || "Done.";
        links = Array.isArray(json.links) ? json.links : [];
      }

      renderResponse(responseWrap, id, "items", { html: htmlContent, links });
      updateNameFromResponse(itemsState, id, htmlContent);
    } catch {
      responseWrap.innerHTML = "Request failed.";
    }
  }

  async function armUse(id, responseWrap) {
    if (!responseWrap) return;
    responseWrap.style.display = "block";
    responseWrap.innerHTML = `<div class="tt-qi-response-inner"><p>Working…</p></div>`;

    try {
      // Payload seen in inspector: step=useItem, fac=1, itemID=<id> (+ optional rfcv query param)
      const res = await fetch(itemPhpUrl(), {
        method: "POST",
        credentials: "include",
        body: new URLSearchParams({ step: "useItem", fac: "1", itemID: String(id) }),
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Accept": "application/json, text/html;q=0.9, */*;q=0.8",
        },
      });

      const ct = (res.headers.get("content-type") || "").toLowerCase();
      let json = null;
      let htmlContent = "";
      let links = [];

      if (ct.includes("application/json")) {
        json = await res.json();
      } else {
        const raw = await res.text();
        const t = raw.trim();
        if (t.startsWith("{") && t.endsWith("}")) json = safeJsonParse(t, null);
        if (!json) htmlContent = raw;
      }

      if (json) {
        htmlContent = json.text || json.msg || json.message || json.html || "Done.";
        links = Array.isArray(json.links) ? json.links : [];
      }

      renderResponse(responseWrap, id, "arm", { html: htmlContent, links });
      updateNameFromResponse(armState, id, htmlContent);
    } catch {
      responseWrap.innerHTML = "Request failed.";
    }
  }

  // --------------- Panel Injection / Rendering ---------------
  function injectPanel(anchor, id, title, type) {
    if (!anchor || document.getElementById(id)) return;

    ensureStyles();

    const panel = document.createElement("section");
    panel.id = id;
    panel.className = "tt-qi-card";
    panel.innerHTML = `
  <div class="tt-qi-header">
    <div class="tt-qi-title">${title}</div>

    <div class="tt-qi-controls">
      <button class="tt-qi-btn" type="button">
        ${type === "items" ? (itemsEditing ? "Done" : "Edit") : (armEditing ? "Done" : "Edit")}
      </button>
      <i class="icon fa-solid fa-caret-down tt-qi-caret"></i>
    </div>
  </div>

  <div class="tt-qi-content open">
    <div class="tt-qi-inner" id="tt-qi"></div>
    <div class="tt-qi-response-wrap"></div>
  </div>
`;




    const btn = panel.querySelector(".tt-qi-btn");
    const header = panel.querySelector(".tt-qi-header");
    const content = panel.querySelector(".tt-qi-content");

// Edit mode toggle
btn.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (type === "items") itemsEditing = !itemsEditing;
  else armEditing = !armEditing;

  btn.textContent =
    type === "items"
      ? itemsEditing ? "Done" : "Edit"
      : armEditing ? "Done" : "Edit";

  render(type);
  showToast((type === "items" ? itemsEditing : armEditing)
    ? "Edit mode enabled"
    : "Edit mode disabled"
  );
}, true);
const caret = panel.querySelector(".tt-qi-caret");
header.addEventListener("click", function (e) {
    if (e.target.closest(".tt-qi-btn")) return;
    // ignore button clicks
    e.preventDefault();
    e.stopPropagation();
    const isOpen = content.classList.toggle("open");
    showToast(isOpen ? "Opened" : "Closed");
    if (isOpen) {
        caret.classList.remove("fa-caret-right");
        caret.classList.add("fa-caret-down");
    }
    else {
        caret.classList.remove("fa-caret-down");
        caret.classList.add("fa-caret-right");
    }
    }, true);


    anchor.parentNode.insertBefore(panel, anchor);

    render(type);
  }

  function render(type) {
    const isItems = type === "items";
    const panelId = isItems ? "tt-quick-items-panel" : "tt-armoury-quick-items-panel";
    const panel = document.getElementById(panelId);
    if (!panel) return;

    const inner = panel.querySelector(".tt-qi-inner");
    const responseWrap = panel.querySelector(".tt-qi-response-wrap");

    const data = isItems ? itemsState.items : armState.items;
    const editing = isItems ? itemsEditing : armEditing;

    inner.innerHTML = "";
    if (!data.length) {
      const empty = document.createElement("div");
      empty.style.cssText = "font-size:12px; opacity:0.7;";
      empty.textContent = "No items. Click Edit, then tap an item on the page to add it.";
      inner.appendChild(empty);
      return;
    }

    for (const it of data) {
      const box = document.createElement("div");
      box.className = "tt-qi-item" + (editing ? " tt-qi-editing" : "");
      box.innerHTML = `
        <div class="tt-qi-pic" style="background-image:url(/images/items/${it.id}/medium.png)"></div>
        <div class="tt-qi-text">${isBadName(it.name) ? `Item #${it.id}` : it.name}</div>
        <button class="tt-qi-remove" type="button" title="Remove">×</button>
      `;

      const removeBtn = box.querySelector(".tt-qi-remove");
      removeBtn.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (!editing) return;
          if (isItems) itemsState.items = itemsState.items.filter((x) => x.id !== it.id);
          else armState.items = armState.items.filter((x) => x.id !== it.id);
          saveState();
          render(type);
          showToast("Removed");
        },
        true
      );

      box.addEventListener(
        "click",
        function (e) {
          e.preventDefault();
          e.stopPropagation();

          if (editing) {
            if (isItems) itemsState.items = itemsState.items.filter((x) => x.id !== it.id);
            else armState.items = armState.items.filter((x) => x.id !== it.id);
            saveState();
            render(type);
            showToast("Removed");
            return;
          }

          if (isItems) {
            itemsUse(it.id, responseWrap);
          } else {
            // Faction use via API (fac=1)
            armUse(it.id, responseWrap);
          }
        },
        true
      );

      inner.appendChild(box);
    }
  }

  // --------------- Edit-mode "add item" click handler (no alerts) ---------------
  function extractItemInfoFromNode(node) {
    if (!node || !(node instanceof Element)) return null;

    let id =
      toId(node.getAttribute("data-item")) ||
      toId(node.getAttribute("data-id")) ||
      toId(node.getAttribute("data-itemid")) ||
      toId(node.getAttribute("data-item-id")) ||
      (node.dataset ? toId(node.dataset.item) : null) ||
      (node.dataset ? toId(node.dataset.id) : null);

    if (id == null) {
      const img = node.querySelector("img");
      const src = img ? String(img.getAttribute("src") || img.getAttribute("data-src") || "") : "";
      const m = src.match(/\/images\/items\/(\d+)\//);
      if (m) id = toId(m[1]);
    }
    if (id == null) return null;

    let name = "";

    const img = node.querySelector("img");
    if (img) {
      name = normalizeText(img.getAttribute("alt") || "") || normalizeText(img.getAttribute("title") || "");
    }

    if (!name) {
      const el = node.querySelector(".name, .title, .item-name, .itemTitle, .item-title, [data-title], [title], [aria-label]");
      if (el) {
        name = normalizeText(
          el.textContent ||
            el.getAttribute("data-title") ||
            el.getAttribute("title") ||
            el.getAttribute("aria-label") ||
            ""
        );
      }
    }
     name = name.replace(/\sx\d+$/, "").trim();

    if (isBadName(name) || !name) name = `Item #${id}`;

    return { id, name };
  }

  document.addEventListener(
    "click",
    function (e) {
      if (!itemsEditing && !armEditing) return;

      const t = e.target;
      if (!t || !(t instanceof Element)) return;

      // Don't treat clicks inside our panels as "add"
      if (t.closest("#tt-quick-items-panel") || t.closest("#tt-armoury-quick-items-panel") || t.closest("#tt-qi-toast")) return;

      const row =
        t.closest("li[data-item], tr[data-item], [data-item], .armoury-item, .item") ||
        t.closest("ul.items-cont > li") ||
        t.closest("li");

      if (!row) return;

      const info = extractItemInfoFromNode(row);
      if (!info) return;

      const pageIsArm = isArmouryTab();

      // In edit mode, stop Torn's own click behavior
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

      if (pageIsArm && armEditing) {
        if (!armState.items.find((x) => x.id === info.id)) {
          armState.items.push(info);
          saveState();
          render("arm");
          showToast("Added to Armory: " + info.name);
        } else {
          showToast("Already added");
        }
      } else if (!pageIsArm && itemsEditing) {
        if (!itemsState.items.find((x) => x.id === info.id)) {
          itemsState.items.push(info);
          saveState();
          render("items");
          showToast("Added: " + info.name);
        } else {
          showToast("Already added");
        }
      }
    },
    true
  );

  // --------------- Mount panels ---------------
  function mount() {
    ensureStyles();

    const invAnchor = document.querySelector(".equipped-items-wrap");
    const armAnchor = document.querySelector("#faction-armoury, .armoury-wrap");

    if (invAnchor && !document.getElementById("tt-quick-items-panel")) {
      injectPanel(invAnchor, "tt-quick-items-panel", "Quick Items", "items");
    }
    if (armAnchor && !document.getElementById("tt-armoury-quick-items-panel")) {
      injectPanel(armAnchor, "tt-armoury-quick-items-panel", "Armory Quick Items", "arm");
    }
  }

  mount();
  setInterval(mount, 1000);
})();