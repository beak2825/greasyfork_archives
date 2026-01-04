// ==UserScript==
// @name         CompanyCam Timeline - Download All Full-Size Images
// @namespace    cc-downloader
// @version      1.0.0
// @description  Adds a button to download all full-size images from CompanyCam timeline/gallery pages.
// @author       you
// @match        https://api.companycam.com/timeline/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=companycam.com
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      img.companycam.com
// @connect      companycam-pending.s3.amazonaws.com
// @connect      *.amazonaws.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550993/CompanyCam%20Timeline%20-%20Download%20All%20Full-Size%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/550993/CompanyCam%20Timeline%20-%20Download%20All%20Full-Size%20Images.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** Why: Consistent UI placement regardless of site CSS */
  GM_addStyle(`
    #ccdlr-wrap { position: fixed; z-index: 999999; bottom: 16px; right: 16px; display:flex; flex-direction:column; gap:8px; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    #ccdlr-panel { background: #111a; backdrop-filter: blur(6px); color: #fff; padding: 10px 12px; border-radius: 12px; min-width: 280px; box-shadow: 0 6px 24px rgba(0,0,0,0.25); }
    #ccdlr-row { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px; }
    #ccdlr-btns { display:flex; gap:8px; }
    .ccdlr-btn { cursor:pointer; border:0; border-radius:10px; padding:8px 10px; font-weight:600; }
    .ccdlr-primary { background:#4f46e5; color:#fff; }
    .ccdlr-secondary { background:#334155; color:#fff; }
    .ccdlr-danger { background:#b91c1c; color:#fff; }
    #ccdlr-list { max-height: 220px; overflow:auto; margin-top:6px; font-size:12px; background:#0006; padding:6px; border-radius:8px; }
    #ccdlr-meta { font-size:12px; opacity:0.85; }
    #ccdlr-toggle { display:flex; align-items:center; gap:6px; font-size:12px; margin-bottom:6px; }
    #ccdlr-toggle input { transform: translateY(1px); }
  `);

  const state = {
    urls: new Map(),        // key -> { url, originUrl?, file }
    queue: [],
    active: 0,
    maxConcurrent: 3,
    canceled: false,
    started: false,
    preferOriginal: false,
    retries: new Map(),     // url -> count
    counters: { total: 0, done: 0, failed: 0 },
    index: 0,
  };

  const UI = {
    wrap: null, panel: null, list: null, meta: null,
    btnDownload: null, btnCancel: null, btnRescan: null, toggleOriginal: null,
  };

  init();

  function init() {
    buildUI();
    harvestLoop();              // initial harvest + MutationObserver
    GM_registerMenuCommand("Download All Images (CompanyCam)", startDownloads);
  }

  function buildUI() {
    UI.wrap = el("div", { id: "ccdlr-wrap" });
    UI.panel = el("div", { id: "ccdlr-panel" });

    const head = el("div", { id: "ccdlr-row" },
      el("div", { style: "font-weight:700" }, "CompanyCam Downloader"),
      el("div", { id: "ccdlr-meta" }, "0 found"),
    );

    UI.toggleOriginal = el("label", { id: "ccdlr-toggle", title: "Decode Base64 in URL to hit original S3 object" },
      el("input", { type: "checkbox", id: "ccdlr-pref-orig" }),
      el("span", {}, "Prefer original S3 URL"),
    );

    const btnRow = el("div", { id: "ccdlr-btns" });
    UI.btnDownload = el("button", { class: "ccdlr-btn ccdlr-primary" }, "Download All");
    UI.btnCancel = el("button", { class: "ccdlr-btn ccdlr-danger", disabled: "true" }, "Cancel");
    UI.btnRescan = el("button", { class: "ccdlr-btn ccdlr-secondary" }, "Rescan");
    btnRow.append(UI.btnDownload, UI.btnCancel, UI.btnRescan);

    UI.list = el("div", { id: "ccdlr-list" });
    UI.panel.append(head, UI.toggleOriginal, btnRow, UI.list);
    UI.wrap.append(UI.panel);
    document.body.appendChild(UI.wrap);

    UI.meta = head.querySelector("#ccdlr-meta");

    UI.btnDownload.addEventListener("click", startDownloads);
    UI.btnCancel.addEventListener("click", () => state.canceled = true);
    UI.btnRescan.addEventListener("click", () => {
      scanOnce();
      flash("Rescanned.");
    });
    UI.toggleOriginal.querySelector("input").addEventListener("change", (e) => {
      state.preferOriginal = !!e.target.checked;
      // Recompute targets
      recomputeFiles();
      renderList();
    });
  }

  function flash(msg) {
    UI.meta.textContent = `${msg} • ${state.urls.size} found`;
  }

  /** Why: Pages are dynamic; this keeps finding new images as you scroll */
  function harvestLoop() {
    scanOnce(); // initial
    const mo = new MutationObserver(debounce(scanOnce, 400));
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
    window.addEventListener("scroll", debounce(scanOnce, 300), { passive: true });
    setInterval(scanOnce, 4000); // periodic safety
  }

  function scanOnce() {
    // IMG elements (current + lazy)
    document.querySelectorAll("img[src], img[data-src], img[data-original], img[data-lazy-src]").forEach(img => {
      const cand = img.getAttribute("src")
        || img.getAttribute("data-src")
        || img.getAttribute("data-original")
        || img.getAttribute("data-lazy-src");
      if (cand) addCandidateUrl(cand);
      // srcset (choose largest)
      const ss = img.getAttribute("srcset");
      if (ss) {
        const best = pickLargestFromSrcset(ss);
        if (best) addCandidateUrl(best);
      }
    });

    // Direct anchors to images
    document.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href");
      if (isLikelyImageUrl(href)) addCandidateUrl(href);
    });

    recomputeFiles();
    renderList();
  }

  function pickLargestFromSrcset(srcset) {
    const parts = srcset.split(",").map(s => s.trim());
    let best = null, max = -1;
    for (const p of parts) {
      const [u, d] = p.split(/\s+/);
      const n = d?.endsWith("w") ? parseInt(d) : (d?.endsWith("x") ? parseFloat(d) : 0);
      if (n > max) { max = n; best = u; }
    }
    return best;
  }

  function isLikelyImageUrl(u) {
    if (!u) return false;
    try {
      const url = new URL(u, location.href);
      return /img\.companycam\.com/.test(url.hostname) || /\.(jpg|jpeg|png|webp)(\?|$)/i.test(url.pathname);
    } catch { return false; }
  }

  function addCandidateUrl(u) {
    try {
      const url = new URL(u, location.href).toString();
      const key = stableKey(url);
      if (!state.urls.has(key)) {
        state.urls.set(key, { url });
      }
    } catch { /* ignore invalid */ }
  }

  function stableKey(url) {
    try {
      const u = new URL(url, location.href);
      u.hash = "";
      u.search = "";
      return u.toString();
    } catch { return url; }
  }

  function recomputeFiles() {
    let idx = 1;
    for (const entry of state.urls.values()) {
      const targetUrl = state.preferOriginal ? (decodeOriginalUrl(entry.url) || entry.url) : entry.url;
      const filename = buildFilename(targetUrl, idx++);
      entry.originUrl = targetUrl;
      entry.file = filename;
    }
    state.counters.total = state.urls.size;
  }

  /** Why: The CompanyCam CDN URL often embeds a Base64 of the original S3 object path */
  function decodeOriginalUrl(url) {
    try {
      const u = new URL(url, location.href);
      if (!/img\.companycam\.com/.test(u.hostname)) return null;
      const path = u.pathname; // contains ".../aHR0cHM6Ly9.../more/segments.jpg"
      const segs = path.split("/");
      const start = segs.findIndex(s => /^aHR0/.test(s)); // Base64 starts with "aHR0" for "http"
      if (start === -1) return null;

      // Re-join all segments from start until one ending with .jpg|.jpeg|.png|webp (since Base64 may include extension)
      const collected = [];
      for (let i = start; i < segs.length; i++) collected.push(segs[i]);
      // Remove trailing extension duplication if present (keep Base64 only)
      let base = collected.join("");
      // Strip any known trailing proxy extensions not part of base64
      base = base.replace(/(\.jpg|\.jpeg|\.png|\.webp)$/i, "");

      // URL-safe base64 fix (not always needed)
      base = base.replace(/-/g, "+").replace(/_/g, "/");

      const decoded = atob(base);
      if (!/^https?:\/\//i.test(decoded)) return null;
      return decoded;
    } catch {
      return null;
    }
  }

  function buildFilename(rawUrl, index) {
    try {
      const u = new URL(rawUrl, location.href);
      const name = u.pathname.split("/").pop() || "image";
      const clean = name.replace(/[%?#].*$/, "");
      const safe = clean.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 140);
      const pad = String(index).padStart(4, "0");
      return `${pad}__${safe}`;
    } catch {
      const pad = String(index).padStart(4, "0");
      return `${pad}__image.jpg`;
    }
  }

  function renderList() {
    UI.list.innerHTML = "";
    const frag = document.createDocumentFragment();
    let i = 0;
    for (const { originUrl, url, file } of state.urls.values()) {
      i++;
      const row = el("div", {}, `${i}. `, el("a", { href: originUrl || url, target: "_blank", rel: "noreferrer noopener" }, file));
      frag.appendChild(row);
    }
    UI.list.appendChild(frag);
    UI.meta.textContent = `${state.urls.size} found • ${state.counters.done} done • ${state.counters.failed} failed`;
  }

  async function startDownloads() {
    if (state.started) return;
    state.started = true;
    state.canceled = false;
    UI.btnDownload.disabled = true;
    UI.btnCancel.disabled = false;

    state.queue = Array.from(state.urls.values()).map(x => ({ url: x.originUrl || x.url, file: x.file }));
    pumpQueue();
  }

  function pumpQueue() {
    while (state.active < state.maxConcurrent && state.queue.length && !state.canceled) {
      const job = state.queue.shift();
      state.active++;
      downloadOne(job)
        .finally(() => {
          state.active--;
          if (state.canceled) {
            UI.meta.textContent = `Canceled • ${state.counters.done} done • ${state.counters.failed} failed`;
            return;
          }
          renderList();
          if (state.queue.length === 0 && state.active === 0) {
            UI.btnCancel.disabled = true;
            UI.meta.textContent = `All done • ${state.counters.done} done • ${state.counters.failed} failed`;
          } else {
            setTimeout(pumpQueue, 120); // small pacing
          }
        });
    }
  }

  function downloadOne({ url, file }) {
    return new Promise((resolve) => {
      const tries = state.retries.get(url) || 0;

      GM_download({
        url,
        name: file,
        saveAs: false,
        onload: () => {
          state.counters.done++;
          resolve();
        },
        onerror: () => {
          if (tries < 2 && !state.canceled) {
            state.retries.set(url, tries + 1);
            // Backoff to avoid hammering CDN
            setTimeout(() => {
              state.queue.unshift({ url, file });
              resolve();
            }, 500 * (tries + 1));
          } else {
            state.counters.failed++;
            resolve();
          }
        }
      });
    });
  }

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (k === "style") node.setAttribute("style", v);
      else if (k in node) node[k] = v;
      else node.setAttribute(k, v);
    });
    for (const c of children) {
      node.append(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }
})();
