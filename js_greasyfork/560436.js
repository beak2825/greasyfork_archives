// ==UserScript==
// @name         Notion 风格的 ChatGPT / Gemini / Claude 导航目录（增强版）
// @namespace    prompt-nav-enhanced
// @version      1.0.0
// @description  右侧浮动导航：快速跳转用户提问；支持点击展开/收起、拖拽与位置记忆、搜索过滤、SPA 保活与性能优化。
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://claude.ai/chat/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560436/Notion%20%E9%A3%8E%E6%A0%BC%E7%9A%84%20ChatGPT%20%20Gemini%20%20Claude%20%E5%AF%BC%E8%88%AA%E7%9B%AE%E5%BD%95%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560436/Notion%20%E9%A3%8E%E6%A0%BC%E7%9A%84%20ChatGPT%20%20Gemini%20%20Claude%20%E5%AF%BC%E8%88%AA%E7%9B%AE%E5%BD%95%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const PLATFORMS = [
    {
      name: "ChatGPT",
      hosts: ["chat.openai.com", "chatgpt.com"],
      getMessages() {
        // Prefer legacy selector (matches original script) because it scrolls reliably
        const legacy = document.querySelectorAll('.user-message-bubble-color');
        if (legacy && legacy.length) return Array.from(legacy);

        // Fallback for newer DOM
        const roleNodes = document.querySelectorAll(
          'article[data-testid^="conversation-turn"] [data-message-author-role="user"]'
        );
        return Array.from(roleNodes);
      },
      getScrollRoot() {
        const candidates = ['main', '[data-testid="conversation-content"]', 'div[role="main"]'];
        for (const sel of candidates) {
          const el = document.querySelector(sel);
          if (!el) continue;
          const p = findScrollableParent(el);
          if (p) return p;
        }
        return document.scrollingElement || document.documentElement;
      },
    },
    {
      name: "Gemini",
      hosts: ["gemini.google.com"],
      messageSelector: ".user-query-bubble-with-background",
      getMessages() { return Array.from(document.querySelectorAll(this.messageSelector)); },
      getScrollRoot() { return document.scrollingElement || document.documentElement; },
    },
    {
      name: "Claude",
      hosts: ["claude.ai"],
      messageSelector: ".bg-bg-300",
      getMessages() { return Array.from(document.querySelectorAll(this.messageSelector)); },
      getScrollRoot() { return document.scrollingElement || document.documentElement; },
    }
  ];

  const C = {
    CONTAINER_ID: "prompt-nav-enhanced-container",
    INDICATOR_ID: "prompt-nav-enhanced-indicator",
    PANEL_ID: "prompt-nav-enhanced-panel",
    LIST_ID: "prompt-nav-enhanced-list",
    ACTIVE_CLASS: "pne-active",
    ITEM_ID_PREFIX: "pne-item-",
    SCROLL_OFFSET: 26,
    INIT_DELAY_MS: 900,
    BUILD_DEBOUNCE_MS: 350,
    ACTIVE_THROTTLE_MS: 80,
    JIGGLE_MS: 350,
    MAX_ITEMS_DEFAULT: 250,
    TRIM_DEFAULT: 60,
  };

  const LS = {
    pos: (host) => `pne_pos_${host}_v1`,
    open: (host) => `pne_open_${host}_v1`,
    width: (host) => `pne_width_${host}_v1`,
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const safeGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

  function findPlatform() {
    const host = location.host;
    return PLATFORMS.find(p => p.hosts?.some(h => host.includes(h)));
  }

  function findScrollableParent(element) {
    let el = element?.parentElement;
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return el;
      }
      el = el.parentElement;
    }
    return document.documentElement;
  }


  function debounce(fn, wait) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function throttle(fn, wait) {
    let last = 0;
    let pending = null;
    return (...args) => {
      const now = Date.now();
      const left = wait - (now - last);
      if (left <= 0) {
        last = now;
        fn(...args);
      } else {
        clearTimeout(pending);
        pending = setTimeout(() => {
          last = Date.now();
          fn(...args);
        }, left);
      }
    };
  }

  function txt(el) {
    const t = (el?.innerText || el?.textContent || "").trim();
    return t.replace(/\s+/g, " ");
  }

  function jiggle(node) {
    if (!node) return;
    node.classList.add("pne-jiggle");
    setTimeout(() => node.classList.remove("pne-jiggle"), C.JIGGLE_MS);
  }

  function ensureMessageAnchors(nodes) {
    const list = [];
    let idx = 0;
    for (const n of nodes) {
      if (!n || !n.isConnected) continue;
      const id = `${C.ITEM_ID_PREFIX}${idx++}`;
      n.dataset.pneId = id;
      list.push({ id, el: n });
    }
    return list;
  }

  function getBestPreview(text, maxLen) {
    if (!text) return "…";
    const t = text.trim();
    if (!t) return "…";
    return t.length > maxLen ? `${t.slice(0, maxLen)}…` : t;
  }

  function createUI(platform) {
    document.getElementById(C.CONTAINER_ID)?.remove();

    const host = document.createElement("div");
    host.id = C.CONTAINER_ID;
    host.style.position = "fixed";
    host.style.zIndex = "999999";
    host.style.pointerEvents = "auto";

    const posRaw = safeGet(LS.pos(location.host));
    let pos = { right: 18, top: 140 };
    if (posRaw) {
      try {
        const p = JSON.parse(posRaw);
        if (typeof p.right === "number") pos.right = p.right;
        if (typeof p.top === "number") pos.top = p.top;
      } catch {}
    }
    host.style.right = `${pos.right}px`;
    host.style.top = `${pos.top}px`;

    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });

    const width = (() => {
      const w = parseInt(safeGet(LS.width(location.host)) || "", 10);
      return Number.isFinite(w) ? clamp(w, 220, 520) : 320;
    })();

    const openDefault = safeGet(LS.open(location.host));
    const isOpenInit = openDefault === null ? true : openDefault === "1";

    shadow.innerHTML = `
      <style>
        :host, * { box-sizing: border-box; }
        @keyframes pne-jiggle {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
        .pne-jiggle { animation: pne-jiggle ${C.JIGGLE_MS}ms ease-in-out; }

        .wrap { display:flex; flex-direction:row; align-items:stretch; gap: 10px; }

        .indicator {
          width: 22px;
          max-height: calc(100vh - 80px);
          display:flex;
          flex-direction:column;
          align-items:flex-end;
          gap: 10px;
          padding: 8px 6px;
          border-radius: 12px;
          background: rgba(0,0,0,.03);
          border: 1px solid rgba(0,0,0,.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          cursor: pointer;
          user-select:none;
        }
        .line { width: 14px; height: 2px; border-radius: 2px; background: rgba(0,0,0,.30); transition: all .18s ease; }
        .line.${C.ACTIVE_CLASS} { width: 18px; background: rgba(0,0,0,.72); box-shadow: 0 0 0 2px rgba(0,0,0,.05); }

        .panel {
          width: ${width}px;
          max-height: calc(100vh - 80px);
          overflow: hidden;
          border-radius: 14px;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 12px 34px rgba(0,0,0,.20);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display:flex;
          flex-direction:column;
        }

        .topbar{
          display:flex; align-items:center; justify-content:space-between;
          gap: 10px; padding: 10px 10px 8px 10px;
          border-bottom: 1px solid rgba(0,0,0,.06);
          cursor: grab; user-select:none;
        }
        .topbar:active{ cursor: grabbing; }

        .title{
          display:flex; align-items:center; gap: 8px;
          font: 800 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;
          color: rgba(17,24,39,.92);
        }
        .dot{ width: 8px; height: 8px; border-radius: 999px; background: rgba(17,24,39,.75); }
        .btns{ display:flex; align-items:center; gap: 6px; }
        .btn{
          border-radius: 10px; padding: 6px 9px;
          border: 1px solid rgba(0,0,0,.10);
          background: rgba(0,0,0,.04);
          font: 750 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;
          cursor:pointer; user-select:none;
        }
        .btn:hover{ background: rgba(0,0,0,.07); }

        .searchWrap{ padding: 8px 10px 10px 10px; border-bottom: 1px solid rgba(0,0,0,.06); }
        .search{
          width:100%; padding: 8px 10px;
          border-radius: 12px; border: 1px solid rgba(0,0,0,.10);
          background: rgba(255,255,255,.85);
          font: 650 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;
          outline: none;
        }

        .list{ overflow:auto; padding: 8px; display:flex; flex-direction:column; gap: 4px; }
        .item a{
          display:block; padding: 8px 10px; border-radius: 10px;
          color: rgba(55,65,81,.92); text-decoration:none;
          font: 650 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial;
          white-space: nowrap; overflow:hidden; text-overflow: ellipsis;
          border: 1px solid transparent;
        }
        .item a:hover{ background: rgba(0,0,0,.05); border-color: rgba(0,0,0,.06); }
        .item a.${C.ACTIVE_CLASS}{
          background: rgba(0,0,0,.07); border-color: rgba(0,0,0,.10);
          color: rgba(17,24,39,.95); font-weight: 800;
        }

        .collapsed .panel{ display:none; }
        .collapsed .indicator{ background: rgba(0,0,0,.04); }

        @media (prefers-color-scheme: dark){
          .indicator{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.10); }
          .line{ background: rgba(255,255,255,.35); }
          .line.${C.ACTIVE_CLASS}{ background: rgba(255,255,255,.78); box-shadow: 0 0 0 2px rgba(255,255,255,.06); }
          .panel{
            background: rgba(17,17,17,.72);
            border-color: rgba(255,255,255,.10);
            box-shadow: 0 16px 46px rgba(0,0,0,.45);
          }
          .topbar{ border-bottom-color: rgba(255,255,255,.08); }
          .title{ color: rgba(255,255,255,.92); }
          .dot{ background: rgba(255,255,255,.70); }
          .btn{ border-color: rgba(255,255,255,.12); background: rgba(255,255,255,.08); color: rgba(255,255,255,.92); }
          .btn:hover{ background: rgba(255,255,255,.12); }
          .searchWrap{ border-bottom-color: rgba(255,255,255,.08); }
          .search{ border-color: rgba(255,255,255,.14); background: rgba(255,255,255,.08); color: rgba(255,255,255,.92); }
          .item a{ color: rgba(229,231,235,.92); }
          .item a:hover{ background: rgba(255,255,255,.10); border-color: rgba(255,255,255,.10); }
          .item a.${C.ACTIVE_CLASS}{ background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.14); color: rgba(255,255,255,.96); }
        }
      </style>

      <div class="wrap ${isOpenInit ? "" : "collapsed"}" id="wrap">
        <div class="indicator" id="${C.INDICATOR_ID}" title="点击展开/收起；点线条跳转">
          <div class="line"></div>
        </div>

        <div class="panel" id="${C.PANEL_ID}">
          <div class="topbar" id="drag">
            <div class="title"><span class="dot"></span><span>${platform.name} 目录</span></div>
            <div class="btns">
              <div class="btn" id="btnRefresh" data-no-drag="1" title="重建目录">R</div>
              <div class="btn" id="btnCollapse" data-no-drag="1" title="收起/展开">–</div>
            </div>
          </div>

          <div class="searchWrap">
            <input class="search" id="q" placeholder="搜索提问…" />
          </div>

          <div class="list" id="${C.LIST_ID}"></div>
        </div>
      </div>
    `;

    const $ = (id) => shadow.getElementById(id);
    const ui = {
      host,
      shadow,
      wrap: $("wrap"),
      indicator: $(C.INDICATOR_ID),
      panel: $(C.PANEL_ID),
      list: $(C.LIST_ID),
      drag: $("drag"),
      q: $("q"),
      btnRefresh: $("btnRefresh"),
      btnCollapse: $("btnCollapse"),
      onManualRefresh: null,
    };

    const isOpen = () => !ui.wrap.classList.contains("collapsed");
    const setOpen = (open) => {
      ui.wrap.classList.toggle("collapsed", !open);
      safeSet(LS.open(location.host), open ? "1" : "0");
    };

    ui.indicator.addEventListener("click", () => {
      if (ui._suppressIndicatorClick) { ui._suppressIndicatorClick = false; return; }
      setOpen(!isOpen());
    });
    ui.btnCollapse.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!isOpen()); });
    ui.btnRefresh.addEventListener("click", (e) => { e.stopPropagation(); ui.onManualRefresh?.(); });

    enableDrag(ui);
    enableResize(ui);

    return ui;
  }

  function enableDrag(ui) {
    let active = false;
    let startX = 0, startY = 0, startRight = 0, startTop = 0;
    let moved = false;

    const shouldIgnore = (target) => !!target?.closest?.('[data-no-drag="1"]');

    const begin = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (shouldIgnore(e.target)) return;

      active = true;
      moved = false;

      const rect = ui.host.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startRight = window.innerWidth - rect.right;
      startTop = rect.top;

      try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
      e.preventDefault();
    };

    const move = (e) => {
      if (!active) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // small threshold to distinguish click vs drag on indicator
      if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        moved = true;
        ui._suppressIndicatorClick = true;
      }

      const right = clamp(startRight - dx, 8, window.innerWidth - 40);
      const top = clamp(startTop + dy, 8, window.innerHeight - 60);

      ui.host.style.right = `${right}px`;
      ui.host.style.top = `${top}px`;
    };

    const end = () => {
      if (!active) return;
      active = false;

      const right = parseFloat(ui.host.style.right) || 18;
      const top = parseFloat(ui.host.style.top) || 140;
      safeSet(LS.pos(location.host), JSON.stringify({ right, top }));
    };

    // Drag from titlebar (expanded) and indicator (collapsed)
    ui.drag.addEventListener("pointerdown", begin, { passive: false });
    ui.indicator.addEventListener("pointerdown", begin, { passive: false });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", end, { passive: true });

    ui.indicator.style.cursor = "grab";
  }


  function enableResize(ui) {
    ui.panel.addEventListener("wheel", (e) => {
      if (!e.altKey) return;
      e.preventDefault();
      const cur = ui.panel.getBoundingClientRect().width;
      const next = clamp(cur + (e.deltaY > 0 ? -20 : 20), 220, 520);
      ui.panel.style.width = `${next}px`;
      safeSet(LS.width(location.host), String(Math.round(next)));
    }, { passive: false });
  }

  class PromptNavigatorEnhanced {
    constructor() {
      this.platform = findPlatform();
      if (!this.platform) return;

      this.ui = null;
      this.scrollRoot = null;

      this.idToEl = new Map();
      this.navItems = [];
      this.filter = "";

      this.buildNavDebounced = debounce(() => this.buildNav(), C.BUILD_DEBOUNCE_MS);
      this.updateActiveThrottled = throttle(() => this.updateActive(), C.ACTIVE_THROTTLE_MS);
    }

    init() {
      if (!this.platform) return;

      setTimeout(() => {
        this.ui = createUI(this.platform);
        this.ui.onManualRefresh = () => this.buildNav(true);

        this.ui.q.addEventListener("input", () => {
          this.filter = this.ui.q.value.trim().toLowerCase();
          this.renderList();
          this.renderIndicator();
        });

        this.scrollRoot = null; // cached scroll container (detected on first jump)

        this.setupObservers();
        this.setupListeners();
        this.buildNav(true);
      }, C.INIT_DELAY_MS);
    }

    setupObservers() {
      const mo = new MutationObserver(() => this.buildNavDebounced());
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true });

      const keep = new MutationObserver(() => {
        if (this.ui?.host && !this.ui.host.isConnected) {
          this.ui = createUI(this.platform);
          this.ui.onManualRefresh = () => this.buildNav(true);
          this.buildNav(true);
        }
      });
      keep.observe(document.documentElement, { childList: true, subtree: true });
    }

    setupListeners() {
      window.addEventListener("scroll", this.updateActiveThrottled, { capture: true, passive: true });
      window.addEventListener("resize", this.updateActiveThrottled, { passive: true });

      window.addEventListener("keydown", (e) => {
        if (e.altKey && (e.key === "n" || e.key === "N")) {
          e.preventDefault();
          this.ui.wrap.classList.toggle("collapsed");
          safeSet(LS.open(location.host), this.ui.wrap.classList.contains("collapsed") ? "0" : "1");
        }
        if (e.altKey && (e.key === "f" || e.key === "F")) {
          e.preventDefault();
          this.ui.wrap.classList.remove("collapsed");
          safeSet(LS.open(location.host), "1");
          this.ui.q.focus();
          this.ui.q.select();
        }
      }, { capture: true });
    }

    buildNav(force = false) {
      const nodes = this.platform.getMessages();
      if (!force && nodes.length === this.navItems.length && nodes.length > 0) {
        let ok = true;
        for (let i = 0; i < nodes.length; i++) {
          const id = `${C.ITEM_ID_PREFIX}${i}`;
          const mapped = this.idToEl.get(id);
          if (mapped !== nodes[i]) { ok = false; break; }
        }
        if (ok) return;
      }

      const anchors = ensureMessageAnchors(nodes);
      this.idToEl.clear();
      anchors.forEach(({ id, el }) => this.idToEl.set(id, el));

      const start = Math.max(0, anchors.length - C.MAX_ITEMS_DEFAULT);

      this.navItems = anchors.slice(start).map(({ id, el }, idx) => {
        const raw = txt(el);
        return { id, text: getBestPreview(raw, C.TRIM_DEFAULT), idx: start + idx };
      });

      this.renderList();
      this.renderIndicator();
      this.updateActive();
    }

    renderList() {
      if (!this.ui) return;
      const list = this.ui.list;
      list.textContent = "";

      const q = this.filter;
      const items = q ? this.navItems.filter(it => it.text.toLowerCase().includes(q)) : this.navItems;

      const frag = document.createDocumentFragment();
      for (const it of items) {
        const row = document.createElement("div");
        row.className = "item";

        const a = document.createElement("a");
        a.href = `#${it.id}`;
        a.textContent = it.text;
        a.dataset.targetId = it.id;
        a.addEventListener("click", (e) => this.onClick(e));

        row.appendChild(a);
        frag.appendChild(row);
      }
      list.appendChild(frag);
    }

    renderIndicator() {
      if (!this.ui) return;
      const ind = this.ui.indicator;
      while (ind.firstChild) ind.removeChild(ind.firstChild);

      const q = this.filter;
      const items = q ? this.navItems.filter(it => it.text.toLowerCase().includes(q)) : this.navItems;

      const step = items.length <= 60 ? 1 : Math.ceil(items.length / 60);
      const visible = Math.max(1, Math.min(60, Math.ceil(items.length / step)));

      for (let k = 0; k < visible; k++) {
        const i = Math.min(items.length - 1, k * step);
        const line = document.createElement("div");
        line.className = "line";
        line.dataset.targetId = items[i].id;
        line.addEventListener("click", (e) => { e.stopPropagation(); this.scrollTo(items[i].id); });
        ind.appendChild(line);
      }
    }

    onClick(e) {
      e.preventDefault();
      const id = e.currentTarget.dataset.targetId;
      this.scrollTo(id);
    }

    scrollTo(id) {
      const messageElement = this.idToEl.get(id);
      if (!messageElement || !messageElement.isConnected) return;

      // Use original scroll logic: compute the correct scroll parent once, then scrollTop math.
      const scrollParent = this.scrollRoot || findScrollableParent(messageElement);
      if (!this.scrollRoot) this.scrollRoot = scrollParent;

      let scrollTimeout;
      const scrollEndListener = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          jiggle(messageElement);
          scrollParent.removeEventListener("scroll", scrollEndListener);
        }, 150);
      };
      scrollParent.addEventListener("scroll", scrollEndListener, { passive: true });

      const parentTop = (scrollParent === document.documentElement) ? 0 : scrollParent.getBoundingClientRect().top;
      const msgTop = messageElement.getBoundingClientRect().top;
      const scrollTop = scrollParent.scrollTop + msgTop - parentTop - C.SCROLL_OFFSET;

      scrollParent.scrollTo({ top: scrollTop, behavior: "smooth" });
    }

    updateActive() {
      if (!this.ui) return;

      let lastId = null;
      const threshold = window.innerHeight * 0.42;

      for (const it of this.navItems) {
        const el = this.idToEl.get(it.id);
        if (!el || !el.isConnected) continue;
        if (el.getBoundingClientRect().top < threshold) lastId = it.id;
        else break;
      }

      const links = this.ui.shadow.querySelectorAll(`#${C.LIST_ID} a`);
      links.forEach(a => a.classList.toggle(C.ACTIVE_CLASS, a.dataset.targetId === lastId));

      const lines = this.ui.shadow.querySelectorAll(`#${C.INDICATOR_ID} .line`);
      lines.forEach(l => l.classList.toggle(C.ACTIVE_CLASS, l.dataset.targetId === lastId));
    }
  }

  new PromptNavigatorEnhanced().init();
})();
