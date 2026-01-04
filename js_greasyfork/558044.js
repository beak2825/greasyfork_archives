// ==UserScript==
// @name         ChatGPT Multiverse Exporter Draggable Linked Badge+Button (Keep On Screen)
// @namespace    https://yourdomain.example
// @version      8.3
// @description  Draggable linked badge + export button. Drag either element and both move. Always kept inside viewport.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558044/ChatGPT%20Multiverse%20Exporter%20Draggable%20Linked%20Badge%2BButton%20%28Keep%20On%20Screen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558044/ChatGPT%20Multiverse%20Exporter%20Draggable%20Linked%20Badge%2BButton%20%28Keep%20On%20Screen%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const VERSION = "8.3";
  const GLOBAL_FLAG = "__MV_EXP_83__";
  if (window[GLOBAL_FLAG]) return;
  window[GLOBAL_FLAG] = true;

  // IDs / keys
  const HOST_ID = "mv_host_83";
  const STYLE_ID = "mv_style_83";
  const CONTAINER_ID = "mv_container_83";
  const BADGE_ID = "mv_badge_83";
  const BTN_ID = "mv_btn_83";
  const POS_KEY = "mv_pos_83";
  const SAFE_PAD = 16; // px margin so UI never touches/escapes viewport

  // state
  let state = {
    payload: null,
    nodeCount: 0,
    lastSource: "none",
    convoId: null
  };

  // ui refs
  let shadow, host, container, badge, btn, titleEl, metaEl;

  // -------------------------
  // Helpers
  // -------------------------
  function log(...a) { console.log(`%c[Exp v${VERSION}]`, "color:#0a7;font-weight:bold;", ...a); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function savePos(l,t) { try { localStorage.setItem(POS_KEY, JSON.stringify({ l, t })); } catch {} }
  function loadPos() { try { return JSON.parse(localStorage.getItem(POS_KEY)); } catch { return null; } }
  function getConvoIdFromURL() {
    const m = location.pathname.match(/\/c\/([a-f0-9-]{20,})/i);
    return m ? m[1] : null;
  }
  function looksLikePayload(o) { return !!(o && typeof o === "object" && o.mapping && typeof o.mapping === "object"); }
  function countNodes(p) { return p && p.mapping ? Object.keys(p.mapping).length : 0; }
  function timestamp() {
    const d = new Date(); const p = n => String(n).padStart(2,"0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  }
  function downloadJSON(obj, filename) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = shadow.createElement ? shadow.createElement('a') : document.createElement('a'); // fallback
    // We must append anchor to regular DOM for some browsers; append into host (not page body) to avoid interference
    host.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // -------------------------
  // Shadow + UI
  // -------------------------
  function ensureShadow() {
    host = document.getElementById(HOST_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = HOST_ID;
      host.style.position = "fixed";
      host.style.top = "0";
      host.style.left = "0";
      host.style.zIndex = "2147483647";
      host.style.pointerEvents = "none"; // container will be pointer-events:auto
      document.documentElement.appendChild(host);
    }
    shadow = host.shadowRoot || host.attachShadow({ mode: "open" });
    return shadow;
  }

  function injectStyles() {
    if (shadow.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
      #${CONTAINER_ID} {
        position: fixed;
        left: 20px;
        top: 20px;
        display:flex;
        flex-direction: column;
        gap:8px;
        pointer-events:auto;
        user-select:none;
        width: auto;
        max-width: 300px;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      }
      #${BADGE_ID} {
        background: rgba(20,20,20,0.92);
        color: white;
        padding: 10px 12px;
        border-radius: 12px;
        box-shadow: 0 8px 22px rgba(0,0,0,0.22);
        cursor: grab;
        font-size: 13px;
        width: 260px;
      }
      #${BADGE_ID}:active { cursor: grabbing; }
      #${BADGE_ID} .t { font-weight:800; margin-bottom:6px; }
      #${BADGE_ID} .m { white-space: pre-line; opacity:0.92; font-size:12px; }
      #${BADGE_ID} .h { opacity:0.7; margin-top:6px; font-size:11px; }

      #${BTN_ID} {
        background: #10a37f;
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 12px;
        box-shadow: 0 8px 22px rgba(0,0,0,0.22);
        font-weight:700;
        cursor: grab;
        font-size: 14px;
      }
      #${BTN_ID}:active { cursor: grabbing; }

      /* small responsiveness */
      @media (max-width: 420px) {
        #${BADGE_ID} { width: calc(100vw - ${SAFE_PAD*2}px); }
        #${BTN_ID} { width: calc(100vw - ${SAFE_PAD*2}px); }
      }
    `;
    shadow.appendChild(s);
  }

  function buildUI() {
    ensureShadow();
    injectStyles();

    container = shadow.getElementById(CONTAINER_ID) || document.createElement("div");
    container.id = CONTAINER_ID;
    container.style.pointerEvents = "auto";
    if (!shadow.getElementById(CONTAINER_ID)) shadow.appendChild(container);

    // set saved pos (but clamp after measuring)
    const saved = loadPos();
    if (saved && typeof saved.l === "number" && typeof saved.t === "number") {
      container.style.left = saved.l + "px";
      container.style.top = saved.t + "px";
    } else {
      container.style.left = "20px";
      container.style.top = "20px";
    }

    // badge
    if (!shadow.getElementById(BADGE_ID)) {
      badge = document.createElement("div");
      badge.id = BADGE_ID;
      badge.innerHTML = `<div class="t">Multiverse: Not captured</div><div class="m">Nodes: 0</div><div class="h">Click to refresh snapshot</div>`;
      container.appendChild(badge);
    } else badge = shadow.getElementById(BADGE_ID);

    // button
    if (!shadow.getElementById(BTN_ID)) {
      btn = document.createElement("button");
      btn.id = BTN_ID;
      btn.textContent = "Export Multiverse";
      container.appendChild(btn);
    } else btn = shadow.getElementById(BTN_ID);

    // cache title/meta elements
    titleEl = badge.querySelector(".t");
    metaEl = badge.querySelector(".m");

    // wire simple interactions
    badge.addEventListener("click", async (ev) => {
      if (dragState.moved) { /* click suppressed due to drag */ return; }
      await refreshSnapshot("badge_click");
    });

    btn.addEventListener("click", (ev) => {
      if (dragState.moved) return;
      if (!state.payload) { alert("No multiverse captured yet. Click badge to refresh"); return; }
      const fname = `multiverse-${(state.payload.title||document.title).replace(/[\/\\?%*:|"<>\s]+/g,'_').slice(0,90)}-${timestamp()}.json`;
      const out = { ...state.payload, _exporter_version: VERSION, _exported_at: new Date().toISOString() };
      // download
      const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fname;
      // append anchor to host so it doesn't get intercepted by page styles
      host.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    // clamp to viewport immediately
    requestAnimationFrame(() => clampContainerToViewport());
  }

  // -------------------------
  // Drag: dragging either badge OR button moves container
  // -------------------------
  const dragState = {
    dragging: false,
    startX: 0,
    startY: 0,
    startL: 0,
    startT: 0,
    moved: false,
    pointerId: null,
  };

  function clampContainerToViewport() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const w = rect.width || (btn ? btn.offsetWidth : 200);
    const h = rect.height || (badge ? badge.offsetHeight + btn.offsetHeight + 8 : 80);

    let left = parseFloat(container.style.left || 20);
    let top = parseFloat(container.style.top || 20);
    if (Number.isNaN(left)) left = 20;
    if (Number.isNaN(top)) top = 20;

    const maxLeft = Math.max(SAFE_PAD, window.innerWidth - w - SAFE_PAD);
    const maxTop = Math.max(SAFE_PAD, window.innerHeight - h - SAFE_PAD);

    left = clamp(left, SAFE_PAD, maxLeft);
    top = clamp(top, SAFE_PAD, maxTop);

    container.style.left = left + "px";
    container.style.top = top + "px";
    savePos(left, top);
  }

  function startDrag(e) {
    // only left button/pointer
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragState.dragging = true;
    dragState.pointerId = e.pointerId;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    const rect = container.getBoundingClientRect();
    dragState.startL = rect.left;
    dragState.startT = rect.top;
    dragState.moved = false;
    try { e.target.setPointerCapture(e.pointerId); } catch {}
    // temporarily make cursor grabbing on both elements
    badge.style.cursor = btn.style.cursor = "grabbing";
  }

  function onPointerMove(e) {
    if (!dragState.dragging) return;
    if (e.pointerId !== dragState.pointerId) return;

    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(dx, dy) > 4) dragState.moved = true;

    let left = dragState.startL + dx;
    let top = dragState.startT + dy;

    // compute width/height of container then clamp
    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const maxLeft = Math.max(SAFE_PAD, window.innerWidth - w - SAFE_PAD);
    const maxTop = Math.max(SAFE_PAD, window.innerHeight - h - SAFE_PAD);
    left = clamp(left, SAFE_PAD, maxLeft);
    top = clamp(top, SAFE_PAD, maxTop);

    container.style.left = left + "px";
    container.style.top = top + "px";
    savePos(left, top);
  }

  function endDrag(e) {
    if (!dragState.dragging) return;
    if (e.pointerId !== dragState.pointerId) {
      // some browsers may call pointerup without matching id; allow end regardless
    }
    dragState.dragging = false;
    dragState.pointerId = null;
    // restore cursor
    badge.style.cursor = btn.style.cursor = "grab";
    // tiny timeout to prevent immediate click after drag
    setTimeout(() => { dragState.moved = false; }, 150);
  }

  function installDragHandlers() {
    // attach pointerdown to both badge and button — either will drag the shared container
    [badge, btn].forEach(el => {
      el.addEventListener("pointerdown", startDrag, { passive: true });
    });
    // global pointermove/up so we continue tracking outside element bounds
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", endDrag, { passive: true });
    window.addEventListener("pointercancel", endDrag, { passive: true });
    // ensure container always remains onscreen on resize
    window.addEventListener("resize", clampContainerToViewport, { passive: true });
  }

  // -------------------------
  // Interceptors & snapshot fetch
  // -------------------------
  function installFetchInterceptor() {
    if (!window.fetch) return;
    const orig = window.fetch;
    if (orig.__mv_patched_83) return;
    window.fetch = async function (input, init) {
      const res = await orig.apply(this, arguments);
      try {
        const url = (typeof input === "string") ? input : input && input.url;
        if (String(url).includes("/backend-api/conversation")) {
          const ct = (res.headers && res.headers.get && res.headers.get("content-type")) || "";
          if (ct.includes("application/json")) {
            const clone = res.clone();
            const data = await clone.json().catch(()=>null);
            if (looksLikePayload(data)) updateCapture(data, "fetch_intercept");
          }
        }
      } catch (err) { /* ignore */ }
      return res;
    };
    window.fetch.__mv_patched_83 = true;
  }

  function installXHRInterceptor() {
    const XHR = window.XMLHttpRequest;
    if (!XHR) return;
    if (XHR.prototype.__mv_patched_83) return;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;
    XHR.prototype.open = function (m, url) { this.__mv_url = String(url || ""); return origOpen.apply(this, arguments); };
    XHR.prototype.send = function () {
      this.addEventListener("load", () => {
        try {
          if (this.__mv_url && this.__mv_url.includes("/backend-api/conversation")) {
            const ct = (this.getResponseHeader && this.getResponseHeader("content-type")) || "";
            if (!ct.includes("application/json")) return;
            const text = this.responseText;
            if (!text) return;
            const data = JSON.parse(text);
            if (looksLikePayload(data)) updateCapture(data, "xhr_intercept");
          }
        } catch (err) { /* ignore */ }
      });
      return origSend.apply(this, arguments);
    };
    XHR.prototype.__mv_patched_83 = true;
  }

  async function getAccessToken() {
    try {
      const r = await fetch(`${location.origin}/api/auth/session`, { credentials: "include" });
      if (!r.ok) throw new Error("auth session failed");
      const j = await r.json();
      return j?.accessToken || j?.access_token;
    } catch (e) { throw e; }
  }

  async function fetchSnapshot(convoId) {
    const token = await getAccessToken();
    const url = `${location.origin}/backend-api/conversation/${convoId}`;
    const r = await fetch(url, { headers: { "Authorization": `Bearer ${token}` }, credentials: "include" });
    if (!r.ok) throw new Error("snapshot HTTP " + r.status);
    return await r.json();
  }

  async function refreshSnapshot(source) {
    const convoId = getConvoIdFromURL() || state.convoId;
    if (!convoId) { alert("Open a chat at /c/<id> first."); return; }
    titleEl.textContent = "Refreshing…";
    try {
      const payload = await fetchSnapshot(convoId);
      if (looksLikePayload(payload)) updateCapture(payload, source || "manual");
      else { titleEl.textContent = "No mapping in snapshot"; }
    } catch (err) {
      titleEl.textContent = "Refresh error";
      console.error(err);
    }
  }

  // -------------------------
  // Update capture UI
  // -------------------------
  function updateCapture(payload, source) {
    if (!looksLikePayload(payload)) return;
    state.payload = payload;
    state.nodeCount = countNodes(payload);
    state.lastSource = source || "unknown";
    state.convoId = state.convoId || payload.conversation_id || getConvoIdFromURL();

    titleEl.textContent = `Multiverse: Captured (${state.nodeCount} nodes)`;
    metaEl.textContent = `New: ${0}\nSource: ${state.lastSource}`;
    log("Captured mapping for convo", state.convoId, "nodes:", state.nodeCount, "source:", state.lastSource);
  }

  // -------------------------
  // Boot
  // -------------------------
  function boot() {
    ensureShadow();
    buildUI();
    installFetchInterceptor();
    installXHRInterceptor();
    installDragHandlers();

    // if we have a convo id, try initial snapshot after a short delay
    const id = getConvoIdFromURL();
    if (id) {
      setTimeout(() => {
        if (!state.payload) refreshSnapshot("auto_initial");
      }, 700);
    }

    // make sure UI stays on-screen if window resizes or zoom changes
    window.addEventListener("resize", clampContainerToViewport, { passive: true });
  }

  // run
  boot();

})();
