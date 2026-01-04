// ==UserScript==
// @name         Iwara NeoUI
// @namespace    neoUI-iwara
// @version      0.2.2
// @description  Enhanced UI for Iwara with tabbed layout, theater mode, customizable sections, and improved video page experience.
// @author       Piperun
// @license      LGPL-3.0-or-later
// @match        https://www.iwara.tv/*
// @match        https://iwara.tv/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547960/Iwara%20NeoUI.user.js
// @updateURL https://update.greasyfork.org/scripts/547960/Iwara%20NeoUI.meta.js
// ==/UserScript==

(() => {
  'use strict';
  if (window.__IWARA_NEOUI_ACTIVE) return;
  window.__IWARA_NEOUI_ACTIVE = true;

  // ---- Constants ----
  const TIMEOUTS = {
    WAIT_FOR: 20000,
    POLL_INTERVAL: 250,
    SLEEP_SHORT: 500,
    ASYNC_WAIT: 1000
  };

  const SELECTORS = {
    VIDEO_COL: '.col-12.col-md-9',
    PAGE_VIDEO_CONTENT: '.page-video__content',
    COL_MD_9: '[class*="col-"][class*="md-9"]',
    SIDEBAR: '.page-video__sidebar',
    LIKES_LIST: '.likesList',
    LIKED_BY: '.itw-liked-by',
    RECS: '.itw-recs',
    PLAYER_WRAP: '.itw-player-wrap',
    TABBAR: '.itw-tabbar',
    PANELS: '.itw-panels',
    COIN_INDICATOR: '.navbar__coin'
  };

  const CSS_CLASSES = {
    TABS_ACTIVE: 'itw-tabs-active',
    THEATER: 'itw-theater',
    ACTIVE: 'active'
  };

  // ---- DOM Cache ----
  const domCache = {
    cache: new Map(),
    get(selector, root = document) {
      const key = `${selector}:${root === document ? 'doc' : 'custom'}`;
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        // Verify element is still in DOM
        if (cached && cached.isConnected) {
          return cached;
        }
        this.cache.delete(key);
      }
      const element = root.querySelector(selector);
      if (element) {
        this.cache.set(key, element);
      }
      return element;
    },
    clear() {
      this.cache.clear();
    },
    invalidate(selector) {
      const keysToDelete = [];
      for (const key of this.cache.keys()) {
        if (key.startsWith(selector + ':')) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => this.cache.delete(key));
    }
  };

  // ---- Observer Manager ----
  const observerManager = {
    observers: new Map(),
    
    create(name, callback, options = { childList: true, subtree: true }) {
      if (this.observers.has(name)) {
        this.disconnect(name);
      }
      
      const observer = new MutationObserver(callback);
      this.observers.set(name, observer);
      return observer;
    },
    
    observe(name, target = document.documentElement, options = { childList: true, subtree: true }) {
      const observer = this.observers.get(name);
      if (observer) {
        observer.observe(target, options);
      }
    },
    
    disconnect(name) {
      const observer = this.observers.get(name);
      if (observer) {
        observer.disconnect();
        this.observers.delete(name);
      }
    },
    
    disconnectAll() {
      for (const [name, observer] of this.observers) {
        observer.disconnect();
      }
      this.observers.clear();
    }
  };

  // ---- Utilities ----
  const dom = {
    el(html) {
      const t = document.createElement('template');
      t.innerHTML = html.trim();
      return t.content.firstElementChild;
    },
    on(el, evt, cb) { el && el.addEventListener(evt, cb, { passive: true }); },
    qs(sel, root = document) { return root.querySelector(sel); },
    qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; },
  };

  const sleep = (ms = TIMEOUTS.SLEEP_SHORT) => new Promise(r => setTimeout(r, ms));

  const waitFor = async (selector, { root = document, timeout = TIMEOUTS.WAIT_FOR, interval = TIMEOUTS.POLL_INTERVAL } = {}) => {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
      const node = root.querySelector(selector);
      if (node) return node;
      await sleep(interval);
    }
    return null;
  };

  const addStyle = (css) => {
    const s = document.createElement('style');
    s.textContent = css;
    document.documentElement.appendChild(s);
    return s;
  };

  // Persistent observer for Likes relocation (initialized only when new UI is active)
  let __itwLikesObserver = null;

  // ---- Storage (GM or localStorage fallback) ----
  const store = {
    async get(key, def) {
      try { if (typeof GM?.getValue === 'function') return await GM.getValue(key, def); } catch {}
      try { const v = localStorage.getItem(`itw:${key}`); return v == null ? def : JSON.parse(v); } catch { return def; }
    },
    async set(key, val) {
      try { if (typeof GM?.setValue === 'function') return await GM.setValue(key, val); } catch {}
      try { localStorage.setItem(`itw:${key}`, JSON.stringify(val)); } catch {}
    }
  };

  // ---- Defaults ----
  const DEFAULTS = Object.freeze({
    hideLikedBy: true,
    theaterMode: false,
    newUI: false,
    showLikesTab: true,
    showRecsTab: true,
  });

  let settings = { ...DEFAULTS };

  const loadSettings = async () => {
    try {
      const saved = await store.get('settings', {});
      
      // Validate saved settings
      if (typeof saved !== 'object' || saved === null) {
        console.warn('[Iwara NeoUI] Invalid settings format, using defaults');
        settings = { ...DEFAULTS };
        return;
      }
      
      // Validate individual setting types
      const validatedSettings = { ...DEFAULTS };
      for (const [key, value] of Object.entries(saved)) {
        if (key in DEFAULTS) {
          const expectedType = typeof DEFAULTS[key];
          if (typeof value === expectedType) {
            validatedSettings[key] = value;
          } else {
            console.warn(`[Iwara NeoUI] Invalid type for setting '${key}', expected ${expectedType}, got ${typeof value}`);
          }
        }
      }
      
      settings = validatedSettings;
      
      // Migration: if legacy hideLikedBy was true and showLikesTab not explicitly set, hide the Likes tab by default
      if (saved && 'hideLikedBy' in saved && !('showLikesTab' in saved)) {
        settings.showLikesTab = !saved.hideLikedBy;
      }
    } catch (e) {
      console.warn('[Iwara NeoUI] loadSettings failed:', e);
      settings = { ...DEFAULTS };
    }
  };

  const saveSettings = async () => {
    try {
      await store.set('settings', settings);
    } catch (e) {
      console.warn('[Iwara NeoUI] saveSettings failed:', e);
    }
  };

  // ---- CSS for features ----
  addStyle(`
    /* Header button */
    .itw-btn { display:inline-flex; align-items:center; gap:.35rem; padding:.35rem .55rem; border-radius:.5rem; border:1px solid rgba(255,255,255,.12); color:inherit; background:rgba(255,255,255,.06); cursor:pointer; font:600 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    .itw-btn:hover { background:rgba(255,255,255,.12); }
    .itw-gear { width:16px; height:16px; fill:currentColor; }
    .itw-btn.itw-float { position: fixed; top: 12px; right: 12px; z-index: 2147483646; }
    .itw-btn.itw-in-header { margin-left: 8px; }

    /* Modal */
    .itw-modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.5); display:none; z-index: 99999; }
    .itw-modal { position:fixed; inset:auto auto 0 0; left:50%; top:50%; transform:translate(-50%,-50%); width:min(520px, calc(100vw - 24px)); background:#16181d; color:#e6e6e6; border:1px solid #2a2f36; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,.45); padding:16px; display:none; z-index: 100000; }
    .itw-modal h3 { margin:0 0 12px; font:600 16px/1.3 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; }
    .itw-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-top:1px solid #232831; }
    .itw-row:first-of-type { border-top:none; }
    .itw-actions { display:flex; gap:8px; justify-content:flex-end; padding-top:12px; }
    .itw-switch { position:relative; width:44px; height:26px; border-radius:999px; background:#3a404b; transition:.2s; flex:0 0 auto; }
    .itw-switch input { position:absolute; inset:0; opacity:0; }
    .itw-knob { position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#c9c9c9; transition:.2s; }
    .itw-switch input:checked + .itw-knob { left:21px; background:#64d36d; }

    /* Feature styles */
    .itw-hide-liked-by .itw-liked-by, .itw-hide-liked-by section:has(> h2.itw-liked-by-title) { display:none !important; }
    /* Hide the likes block used by iwara.tv preview/site as well */
    .itw-hide-liked-by .block:has(.likesList), .itw-hide-liked-by .likesList { display:none !important; }
    /* Hide Recommended (More like this) when its tab is disabled in new UI */
    .itw-hide-recs .itw-recs, .itw-hide-recs .moreLikeThis { display:none !important; }
    /* When tabs UI is active, ensure any stray Recommended blocks are hidden outside the Recommended panel */
    body.itw-tabs-active .moreLikeThis { display:none !important; }
    body.itw-tabs-active .itw-panel-recs .moreLikeThis { display:block !important; }

    /* Theater Mode */
    .itw-theater body, body.itw-theater { overflow-y:auto; }
    .itw-theater .itw-player-wrap, body.itw-theater .itw-player-wrap { width: 100% !important; max-width: 100% !important; margin: 0 auto !important; }
    .itw-theater video, body.itw-theater video, .itw-theater .plyr, .itw-theater .jwplayer, .itw-theater .vjs-tech { width: 100% !important; height: 75vh !important; max-height: 86vh !important; }
    .itw-theater aside, body.itw-theater aside { display: none !important; }
    .itw-theater main, body.itw-theater main, .itw-theater .container, body.itw-theater .container { max-width: 100% !important; width: 100% !important; }

    /* Tabs layout for video page */
    body.itw-tabs-active .col-12.col-md-9 { max-width: 100% !important; flex: 0 0 100% !important; }
    body.itw-tabs-active .page-video__sidebar { display: none !important; }
    body.itw-tabs-active .page-video__player, body.itw-tabs-active .video-js, body.itw-tabs-active .vjs_video_3-dimensions { width: 100% !important; }

    .itw-tabbar { display:flex; align-items:center; gap:8px; border-bottom:1px solid #2a2f36; margin-top:12px; }
    .itw-tabbar .itw-tab { appearance:none; background:none; border:none; color:#e6e6e6; cursor:pointer; padding:10px 12px; font:600 13px/1 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; border-bottom:2px solid transparent; opacity:.85; }
    .itw-tabbar .itw-tab:hover { opacity:1; }
    .itw-tabbar .itw-tab[aria-selected="true"] { color:#ff4b4b; border-color:#ff4b4b; opacity:1; }

    .itw-panels { padding-top:12px; }
    .itw-panel { display:none; }
    .itw-panel.active { display:block; }
    /* Safety: if for any reason tabs markup lingers but layout class is absent, hide the UI */
    body:not(.itw-tabs-active) .itw-tabbar, body:not(.itw-tabs-active) .itw-panels { display:none !important; }

    /* Force visibility for Likes content inside the Likes panel */
    body.itw-tabs-active .itw-panel-likes .itw-liked-by,
    body.itw-tabs-active .itw-panel-likes .block,
    body.itw-tabs-active .itw-panel-likes .block__content,
    body.itw-tabs-active .itw-panel-likes .likesList { display:block !important; visibility:visible !important; opacity:1 !important; height:auto !important; max-height:none !important; min-height:auto !important; width:auto !important; min-width:0 !important; }
    /* Two-row layout: users row + pagination row */
    body.itw-tabs-active .itw-panel-likes .block { display:flex !important; flex-direction:column !important; gap:16px !important; }
    /* Override Bootstrap row layout for horizontal scrolling */
    body.itw-tabs-active .itw-panel-likes .likesList .row { display:flex !important; flex-direction:row !important; flex-wrap:nowrap !important; gap:16px !important; overflow-x:auto !important; padding:8px 0 !important; margin:0 !important; }
    /* Override Bootstrap columns to become flex items */
    body.itw-tabs-active .itw-panel-likes .likesList .row > [class*="col-"] { flex:0 0 auto !important; width:160px !important; max-width:160px !important; min-width:160px !important; padding:0 !important; }
    /* Individual user items - compact horizontal cards */
    body.itw-tabs-active .itw-panel-likes .likesList__item { display:block !important; width:100% !important; height:100% !important; padding:8px 12px !important; background:rgba(255,255,255,0.05) !important; border-radius:8px !important; text-decoration:none !important; box-sizing:border-box !important; }
    /* Inner content layout for anchor elements */
    body.itw-tabs-active .itw-panel-likes .likesList__item > * { display:flex !important; }
    /* Pagination row - centered below users */
    body.itw-tabs-active .itw-panel-likes .pagination { display:flex !important; justify-content:center !important; margin-top:8px !important; }
    /* Ensure user avatars are properly sized */
    body.itw-tabs-active .itw-panel-likes .likesList img { width:60px !important; height:60px !important; border-radius:50% !important; object-fit:cover !important; }
    /* Username styling for horizontal scrolling layout */
    body.itw-tabs-active .itw-panel-likes .likesList .username,
    body.itw-tabs-active .itw-panel-likes .likesList a,
    body.itw-tabs-active .itw-panel-likes .likesList [class*="name"] { }
  `);

  // ---- Modal creation ----
  let modalBackdrop, modalEl;

  const createSwitch = (id, checked, label) => dom.el(`
    <div class="itw-row">
      <div>${label}</div>
      <label class="itw-switch" for="${id}">
        <input id="${id}" type="checkbox" ${checked ? 'checked' : ''} />
        <span class="itw-knob"></span>
      </label>
    </div>
  `);

  const ensureModal = () => {
    try {
      if (modalEl) return modalEl;
      modalBackdrop = dom.el('<div class="itw-modal-backdrop"></div>');
      modalEl = dom.el('<div class="itw-modal" role="dialog" aria-modal="true"></div>');

      const content = dom.el('<div></div>');
      content.appendChild(dom.el('<h3>Iwara NeoUI — Settings</h3>'));

      // Tabs visibility
      const likesTabRow = createSwitch('itw-show-likes', settings.showLikesTab, 'Show "Likes" tab');
      const recsTabRow = createSwitch('itw-show-recs', settings.showRecsTab, 'Show "Recommended" tab');

      const theaterRow = createSwitch('itw-theater', settings.theaterMode, 'Enable Theater Mode');
      const newUiRow = createSwitch('itw-new-ui', settings.newUI, 'Enable new UI (tabs + full-width video)');

      const actions = dom.el('<div class="itw-actions"></div>');
      const closeBtn = dom.el('<button class="itw-btn" type="button">Close</button>');
      const saveBtn = dom.el('<button class="itw-btn" type="button">Save</button>');
      actions.append(closeBtn, saveBtn);

      content.append(likesTabRow, recsTabRow, theaterRow, newUiRow, actions);
      modalEl.append(content);

      document.body.append(modalBackdrop, modalEl);

      dom.on(closeBtn, 'click', () => toggleModal(false));
      dom.on(modalBackdrop, 'click', () => toggleModal(false));
      dom.on(saveBtn, 'click', async () => {
        const prev = { newUI: settings.newUI, showLikesTab: settings.showLikesTab, showRecsTab: settings.showRecsTab };
        settings.showLikesTab = modalEl.querySelector('#itw-show-likes')?.checked ?? settings.showLikesTab;
        settings.showRecsTab = modalEl.querySelector('#itw-show-recs')?.checked ?? settings.showRecsTab;
        settings.theaterMode = modalEl.querySelector('#itw-theater')?.checked ?? settings.theaterMode;
        settings.newUI = modalEl.querySelector('#itw-new-ui')?.checked ?? settings.newUI;
        const hadTabs = !!document.querySelector('.itw-tabbar');
        const newUiChanged = prev.newUI !== settings.newUI;
        await saveSettings();
        applySettings();
        // If staying in New UI and tab composition changed, rebuild tabs
        const tabsChanged = prev.showLikesTab !== settings.showLikesTab || prev.showRecsTab !== settings.showRecsTab;
        if (!newUiChanged && hadTabs && settings.newUI && tabsChanged) {
          teardownVideoTabs();
        }
        if (newUiChanged) {
          // Force a single reload to guarantee full revert/apply of layout across SPA hydration
          location.reload();
          return;
        }
        applyUiMode();
        toggleModal(false);
      });

      return modalEl;
    } catch (e) {
      console.warn('[Iwara NeoUI] ensureModal failed:', e);
      return null;
    }
  };

  const toggleModal = (show) => {
    ensureModal();
    modalBackdrop.style.display = show ? 'block' : 'none';
    modalEl.style.display = show ? 'block' : 'none';
  };

  // ---- Insert header button (before coin indicator when possible) ----
  const GEAR_SVG = '<svg class="itw-gear" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14,12.94a7.43,7.43,0,0,0,.05-.94,7.43,7.43,0,0,0-.05-.94l2-1.56a.5.5,0,0,0,.12-.64l-1.9-3.29a.5.5,0,0,0-.6-.22l-2.36,1a7.39,7.39,0,0,0-1.63-.94l-.36-2.5A.5.5,0,0,0,12.47,2H9.53a.5.5,0,0,0-.5.42l-.36,2.5a7.39,7.39,0,0,0-1.63.94l-2.36-1a.5.5,0,0,0-.6.22L2.22,8.88a.5.5,0,0,0,.12.64l2,1.56a7.43,7.43,0,0,0-.05.94,7.43,7.43,0,0,0,.05.94l-2,1.56a.5.5,0,0,0-.12.64l1.9,3.29a.5.5,0,0,0,.6.22l2.36-1a7.39,7.39,0,0,0,1.63.94l.36,2.5a.5.5,0,0,0,.5.42h2.94a.5.5,0,0,0,.5-.42l.36-2.5a7.39,7.39,0,0,0,1.63-.94l2.36,1a.5.5,0,0,0,.6-.22l1.9-3.29a.5.5,0,0,0-.12-.64ZM11,15.5A3.5,3.5,0,1,1,14.5,12,3.5,3.5,0,0,1,11,15.5Z"/></svg>';

  const makeHeaderBtn = () => dom.el(`<button id="itw-settings-btn" class="itw-btn" type="button" title="Iwara NeoUI">${GEAR_SVG}<span>Options</span></button>`);

  const insertNextToSearch = (btn) => {
    const header = document.querySelector('header, nav[role="navigation"], .header, [class*="header"]');
    if (!header) return { placed: false, anchorEl: null };

    // Prefer the container that wraps the search UI
    const searchContainer = header.querySelector('.header__content__items__search, [class*="items__search" i], .header__search, [role="search"]');

    if (searchContainer?.parentElement) {
      // Already placed correctly?
      if (btn.previousElementSibling === searchContainer) {
        return { placed: true, anchorEl: searchContainer };
      }
      searchContainer.insertAdjacentElement('afterend', btn);
      return { placed: true, anchorEl: searchContainer };
    }

    // Fallback: try to locate a search form and place after it
    const searchForm = header.querySelector('form.header__search, form[action*="search" i]') || header.querySelector('input[type="search"]')?.closest('form');
    if (searchForm?.parentElement) {
      searchForm.insertAdjacentElement('afterend', btn);
      return { placed: true, anchorEl: searchForm };
    }

    // Final fallback: append into a central items container or header
    const items = header.querySelector('.header__content__items, [class*="content__items" i]') || header;
    if (btn.parentElement !== items) items.appendChild(btn);
    return { placed: false, anchorEl: items };
  };

  const ensureHeaderButton = async () => {
    try {
      let btn = document.getElementById('itw-settings-btn');
      if (!btn) {
        btn = makeHeaderBtn();
        dom.on(btn, 'click', () => { ensureModal(); toggleModal(true); });
        btn.classList.add('itw-float');
        document.body.appendChild(btn);
      }

      let debounce = null;

      const reanchor = () => {
        // Ensure the button exists in the DOM
        if (!btn.isConnected) document.body.appendChild(btn);

        const { placed } = insertNextToSearch(btn);
        if (placed) {
          btn.classList.remove('itw-float');
          btn.classList.add('itw-in-header');
        } else {
          btn.classList.add('itw-float');
          btn.classList.remove('itw-in-header');
        }
      };

      // Initial attempt
      reanchor();

      // Observe DOM continuously (SPA hydration or header rerenders)
      const mo = new MutationObserver(() => {
        if (debounce) return;
        debounce = setTimeout(() => { debounce = null; reanchor(); }, 300);
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });

      // Handle SPA route changes (URL swap without full reload)
        let lastUrl = location.href;
        setInterval(() => {
          const now = location.href;
          if (now !== lastUrl) {
            lastUrl = now;
            domCache.clear(); // Clear cache on navigation
            observerManager.disconnect('likes'); // Clean up page-specific observers
            reanchor();
            // Ensure UI mode matches current settings and page type on route change
            applyUiMode();
          }
        }, 700);

      // Additional safety hooks
      window.addEventListener('load', reanchor, { once: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) reanchor(); });
    } catch (e) {
      console.warn('[Iwara NeoUI] ensureHeaderButton failed:', e);
    }
  };

  // ---- Liked by detection and toggle ----
  const LIKED_BY_TEXTS = [
    'liked by','likes by','liked-by','liked',
    '喜欢', '赞过',
    'いいね',
    '좋아요',
  ];

  const findLikedBySection = () => {
    try {
      // Prefer a structural hook used on iwara: the likes list grid
      const likesList = dom.qs('.likesList');
      if (likesList) {
        const container = likesList.closest('.block, .contentBlock, .block--padding, .card, .panel') || likesList.parentElement;
        if (container) {
          container.classList.add('itw-liked-by');
          // If tabs are active and Likes tab is shown, move into the Likes panel
          const likesPanel = settings.newUI && document.querySelector('.itw-panel-likes');
          if (likesPanel && settings.showLikesTab && !likesPanel.contains(container)) {
            likesPanel.append(container);
          }
          return container;
        }
      }

      // Generic fallback: scan typical containers and look for a heading-like element
      const candidates = dom.qsa('section, .section, .block, .card, .panel, div');
      for (const el of candidates) {
        const title = el.querySelector('h2, h3, header, .title, [class*="title"], .text--h3, .text.text--h3');
        const text = (title?.textContent || '').trim().toLowerCase();
        if (text && LIKED_BY_TEXTS.some(t => text.includes(t))) {
          el.classList.add('itw-liked-by');
          const likesPanel = settings.newUI && document.querySelector('.itw-panel-likes');
          if (likesPanel && settings.showLikesTab && !likesPanel.contains(el)) {
            likesPanel.append(el);
          }
          return el;
        }
        const avatars = el.querySelectorAll('img[alt*="avatar" i], img[alt*="user" i], img[referrerpolicy], .avatar');
        if (avatars.length >= 6 && el.querySelectorAll('button, a').length < 6) {
          el.classList.add('itw-liked-by');
          const likesPanel = settings.newUI && document.querySelector('.itw-panel-likes');
          if (likesPanel && settings.showLikesTab && !likesPanel.contains(el)) {
            likesPanel.append(el);
          }
          return el;
        }
      }
      return null;
    } catch (e) {
      console.warn('[Iwara NeoUI] findLikedBySection failed:', e);
      return null;
    }
  };

  const applyHideLikedBy = () => {
    const root = document.documentElement;
    // Vanilla mode should be vanilla: never hide on newUI=false
    const hide = settings.newUI ? !settings.showLikesTab : false;
    root.classList.toggle('itw-hide-liked-by', hide);
  };

  // Tag and hide Recommended (More like this)
  const findRecsSection = () => {
    try {
      const el = dom.qs('.moreLikeThis') || [...document.querySelectorAll('.text--h3, h2, h3')].find(h => /more like this|recommended|related/i.test(h.textContent || ''))?.closest('.block, .contentBlock, .panel, .card, .section, .moreLikeThis');
      if (el) { el.classList.add('itw-recs'); return el; }
      return null;
    } catch (e) {
      console.warn('[Iwara NeoUI] findRecsSection failed:', e);
      return null;
    }
  };

  const applyHideRecs = () => {
    const root = document.documentElement;
    const hide = settings.newUI ? !settings.showRecsTab : false;
    root.classList.toggle('itw-hide-recs', hide);
  };

  // ---- Theater Mode ----
  const applyTheater = () => {
    try {
      const root = document.body || document.documentElement;
      root.classList.toggle('itw-theater', !!settings.theaterMode);

      const knownPlayerWrap = dom.qs('.plyr__video-wrapper, .jwplayer, .video-js, .vjs, #player, .video-player, [class*="player"]');
      if (knownPlayerWrap) knownPlayerWrap.classList.add('itw-player-wrap');
      else {
        const video = dom.qs('video');
        if (video) video.closest('div')?.classList.add('itw-player-wrap');
      }
    } catch (e) {
      console.warn('[Iwara NeoUI] applyTheater failed:', e);
    }
  };

  const toggleTheater = () => { settings.theaterMode = !settings.theaterMode; applyTheater(); saveSettings(); };

  // ---- Keyboard shortcut (T) for Theater Mode ----
  dom.on(document, 'keydown', (e) => {
    if (e.key.toLowerCase?.() === 't' && !/input|textarea|select/i.test(e.target.tagName)) {
      toggleTheater();
    }
  });

  // ---- Apply settings helpers ----
  const applySettings = () => {
    applyHideLikedBy();
    applyHideRecs();
    applyTheater();
  };

  // ---- Page type detection ----
  const isVideoPage = () => {
    // Quick route-based hint
    const path = location.pathname;
    if (/^\/(video|videos)\//i.test(path)) return true;
    if (/^\/(search|users|image|images|posts|forums|messages|notifications|settings|login|register)\b/i.test(path)) return false;
    // Structural markers: presence of a player and typical video-page sections
    const hasPlayer = !!document.querySelector('.page-video__player, .plyr__video-wrapper, .video-js, .jwplayer, [data-plyr], video');
    const hasMarkers = !!document.querySelector('.page-video__details, .moreFromUser, .moreLikeThis, .page-video__bottom, .page-video__tags, #comments, .comments');
    return hasPlayer && hasMarkers;
  };

  // ---- Tabs: About / Uploads / Recommended / Likes / Comments ----
  const setupVideoTabs = () => {
    try {
      // Do not build tabs in vanilla mode
      if (!settings.newUI) return;
      // Safety: if previous class lingered but no UI is present, clear it
      if (!document.querySelector('.itw-tabbar') && !document.querySelector('.itw-panels')) {
        document.body.classList.remove(CSS_CLASSES.TABS_ACTIVE);
      }
      if (document.querySelector('.itw-tabbar')) return; // already set up
      if (!isVideoPage()) return; // only on actual video pages

      const mainCol = domCache.get(SELECTORS.VIDEO_COL) || domCache.get(SELECTORS.PAGE_VIDEO_CONTENT) || domCache.get(SELECTORS.COL_MD_9);
      if (!mainCol) return;
      // Require a real player host; do not fall back to arbitrary first child
      const playerHost = mainCol.querySelector('.page-video__player') ||
                         mainCol.querySelector('.video-js, .plyr__video-wrapper, .jwplayer, [data-plyr]')?.closest('.page-video__player') ||
                         mainCol.querySelector('.video-js, .plyr__video-wrapper, .jwplayer, [data-plyr]');
      if (!playerHost) return;

      // Panels
      const panels = dom.el('<div class="itw-panels"></div>');
      const aboutPanel = dom.el('<section class="itw-panel itw-panel-about" role="tabpanel" aria-labelledby="itw-tab-about"></section>');
      const aboutBody = dom.el('<div class="itw-panel-body itw-about-body"></div>');
      aboutPanel.append(aboutBody);
      const uploadsPanel = dom.el('<section class="itw-panel itw-panel-uploads" role="tabpanel" aria-labelledby="itw-tab-uploads"></section>');
      const recsPanel = dom.el('<section class="itw-panel itw-panel-recs" role="tabpanel" aria-labelledby="itw-tab-recs"></section>');
      const likesPanel = dom.el('<section class="itw-panel itw-panel-likes" role="tabpanel" aria-labelledby="itw-tab-likes"></section>');
      const commentsPanel = dom.el('<section class="itw-panel itw-panel-comments" role="tabpanel" aria-labelledby="itw-tab-comments"></section>');
      panels.append(aboutPanel, uploadsPanel, recsPanel, likesPanel, commentsPanel);

      // Tab bar
      const tabbar = dom.el('<div class="itw-tabbar" role="tablist" aria-label="Iwara NeoUI Tabs"></div>');
      const makeTab = (id, text, selected=false) => dom.el(`<button class="itw-tab" role="tab" id="itw-tab-${id}" aria-selected="${selected}" aria-controls="itw-panel-${id}">${text}</button>`);
      const aboutTab = makeTab('about', 'About', true);
      const uploadsTab = makeTab('uploads', 'Uploads');
      const recsTab = makeTab('recs', 'Recommended');
      const likesTab = makeTab('likes', 'Likes');
      const commentsTab = makeTab('comments', 'Comments');

      tabbar.append(aboutTab);
      tabbar.append(uploadsTab);
      if (settings.showRecsTab) tabbar.append(recsTab);
      if (settings.showLikesTab) tabbar.append(likesTab);
      tabbar.append(commentsTab);

      // Mount tab UI before moving content to avoid ancestor insertion errors
      if (playerHost && playerHost.parentElement === mainCol) {
        mainCol.insertBefore(tabbar, playerHost.nextSibling);
      } else {
        mainCol.appendChild(tabbar);
      }
      mainCol.insertBefore(panels, tabbar.nextSibling);

      // Move content into About panel in the desired order:
      // 1) the main details div, 2) description, 3) tags, 4) bottom
      const details = mainCol.querySelector('.page-video__details');
      if (details) aboutBody.append(details);

      // Description (prefer the full wrapper within details)
      const descEl = (details?.querySelector('.showMore, .page-video__description, .description, .markdown')) ||
                     ([...mainCol.querySelectorAll('.showMore, .page-video__description, .description, .markdown')].find(el => !el.closest('.comments')));
      if (descEl) aboutBody.append(descEl.closest('.contentBlock') || descEl);

      // Tags (prefer the wrapper within details)
      const tagsWrap = (details?.querySelector('.page-video__tags')?.closest('.mt-4')) ||
                       mainCol.querySelector('.page-video__tags')?.closest('.mt-4') ||
                       mainCol.querySelector('.page-video__tags');
      if (tagsWrap) aboutBody.append(tagsWrap);

      // Bottom actions/stats row
      const bottom = mainCol.querySelector('.page-video__bottom');
      if (bottom) aboutBody.append(bottom);

      const comments = mainCol.querySelector('.comments');
      if (comments) commentsPanel.append(comments);

      // Uploads from sidebar
      const moreFrom = document.querySelector('.page-video__sidebar .moreFromUser');
      if (moreFrom) {
        const block = moreFrom.closest('.block, .contentBlock, .panel, .card') || moreFrom;
        uploadsPanel.append(block);
      }

      // Recommended
      const moreLike = dom.qs('.itw-recs') || dom.qs('.moreLikeThis') || [...document.querySelectorAll('.text--h3, h2, h3')].find(h => /more like this|recommended|related/i.test(h.textContent || ''))?.closest('.block, .contentBlock, .panel, .card, .section, .moreLikeThis');
      if (moreLike && settings.showRecsTab) {
        const block = moreLike.closest('.block, .contentBlock, .panel, .card, .section') || moreLike;
        recsPanel.append(block);
      }

      // Likes: robust relocation (title + list) with persistent watcher
      const nearestCommonAncestor = (a, b) => {
        if (!a || !b) return null;
        const aChain = new Set();
        for (let n = a; n; n = n.parentElement) aChain.add(n);
        for (let n = b; n; n = n.parentElement) if (aChain.has(n)) return n;
        return null;
      };
      const moveLikesIntoPanel = () => {
        if (!settings.showLikesTab) return;
        const likesPanelNow = document.querySelector('.itw-panel-likes');
        if (!likesPanelNow) return;
        // Prefer structural hook
        const list = document.querySelector('.likesList');
        const title = [...document.querySelectorAll('.text--h3, .text.text--h3, h2, h3, .text.mb-2.text--h3.text--bold')]
          .find(el => /liked by/i.test(el.textContent || ''));
        let block = null;
        // 1) If title and list share a .block__content ancestor, move that
        const listBC = list?.closest('.block__content') || null;
        const titleBC = title?.closest('.block__content') || null;
        if (listBC && titleBC && listBC === titleBC) block = listBC;
        // 2) Else, use nearest common ancestor if reasonable
        if (!block && list && title) {
          const nca = nearestCommonAncestor(list, title);
          if (nca && !nca.classList.contains('itw-panels') && nca !== document.body) block = nca;
        }
        // 3) Else, prefer .block__content of either node
        if (!block && listBC) block = listBC;
        if (!block && titleBC) block = titleBC;
        // 4) Else, fall back to typical blocks
        if (!block && list) {
          block = list.closest('.block, .contentBlock, .block--padding, .card, .panel')
               || (title ? title.parentElement : null)
               || list.parentElement
               || list;
        }
        if (!block && title) {
          block = title.closest('.block, .contentBlock, .block--padding, .card, .panel') || title.parentElement || title;
        }
        // If we ended up at an inner .block__content, prefer its outer block/card container
        if (block && block.matches('.block__content') && block.parentElement && block.parentElement.matches('.block, .contentBlock, .block--padding, .card, .panel, .section')) {
          block = block.parentElement;
        }
        // If list exists but is empty, defer move until populated (site may lazy-render)
        const hasListContent = !!list && (list.childElementCount > 0 || list.querySelector('*'));
        if (!likesPanelNow.contains(block || document.createElement('div')) && list && !hasListContent) return;
        if (block) {
          try { block.classList.add('itw-liked-by'); } catch {}
          const unhideDeep = (rootEl) => {
            const stack = [rootEl];
            while (stack.length) {
              const el = stack.pop();
              if (!el || el.nodeType !== 1) continue;
              if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
              if (el.style) {
                if (el.style.display === 'none') el.style.display = '';
                if (el.style.visibility === 'hidden') el.style.visibility = '';
                if (el.style.opacity === '0') el.style.opacity = '';
                if (el.style.height === '0px') el.style.height = '';
                if (el.style.maxHeight === '0px') el.style.maxHeight = '';
              }
              stack.push(...el.children);
            }
          };
          unhideDeep(block);
          if (!likesPanelNow.contains(block)) likesPanelNow.append(block);
        }
      };

      // Initial attempts
      moveLikesIntoPanel();
      // Keep trying as site re-renders/paginates the Likes block
      if (__itwLikesObserver) { try { __itwLikesObserver.disconnect(); } catch {} }
      __itwLikesObserver = new MutationObserver(() => moveLikesIntoPanel());
      __itwLikesObserver.observe(document.body, { childList: true, subtree: true });

      // Ensure late-loaded Likes populate into the panel as soon as they appear
      if (settings.showLikesTab) {
        (async () => {
          const node = await waitFor(`${SELECTORS.LIKES_LIST}, ${SELECTORS.LIKED_BY}`, { timeout: TIMEOUTS.WAIT_FOR, interval: TIMEOUTS.POLL_INTERVAL });
          if (!node) return;
          moveLikesIntoPanel();
        })();
      }

      // Mount (already mounted above)
      // playerHost.insertAdjacentElement('afterend', tabbar);
      // tabbar.insertAdjacentElement('afterend', panels);

      // Activate About by default
      const activate = (which) => {
        const btns = [aboutTab, uploadsTab];
        if (settings.showRecsTab) btns.push(recsTab);
        if (settings.showLikesTab) btns.push(likesTab);
        btns.push(commentsTab);
        for (const btn of btns) btn.setAttribute('aria-selected', String(btn === which));

        const allPanels = [aboutPanel, uploadsPanel, recsPanel, likesPanel, commentsPanel];
        for (const p of allPanels) p.classList.remove('active');
        if (which === aboutTab) aboutPanel.classList.add('active');
        else if (which === uploadsTab) uploadsPanel.classList.add('active');
        else if (which === recsTab) recsPanel.classList.add('active');
        else if (which === likesTab) likesPanel.classList.add('active');
        else if (which === commentsTab) commentsPanel.classList.add('active');
      };
      activate(aboutTab);

      dom.on(aboutTab, 'click', () => activate(aboutTab));
      dom.on(uploadsTab, 'click', () => activate(uploadsTab));
      if (settings.showRecsTab) dom.on(recsTab, 'click', () => activate(recsTab));
      if (settings.showLikesTab) dom.on(likesTab, 'click', () => { moveLikesIntoPanel(); activate(likesTab); });
      dom.on(commentsTab, 'click', () => activate(commentsTab));

      document.body.classList.add(CSS_CLASSES.TABS_ACTIVE);
    } catch (e) {
      console.warn('[Iwara NeoUI] Tabs setup skipped:', e);
    }
  };

  const teardownVideoTabs = () => {
    try {
      // Clean up observers
      observerManager.disconnect('likes');
      
      const tabbar = document.querySelector(SELECTORS.TABBAR);
      const panels = document.querySelector(SELECTORS.PANELS);
      // Do NOT return early — always ensure we clear layout class below

      const mainCol = domCache.get(SELECTORS.VIDEO_COL) || domCache.get(SELECTORS.PAGE_VIDEO_CONTENT) || domCache.get(SELECTORS.COL_MD_9) || document.body;
      const sidebar = domCache.get(SELECTORS.SIDEBAR);

      if (panels) {
        const aboutBody = panels.querySelector('.itw-about-body');
        if (aboutBody) {
          [...aboutBody.children].forEach(node => mainCol.appendChild(node));
        }
        const uploadsPanel = panels.querySelector('.itw-panel-uploads');
        if (uploadsPanel && uploadsPanel.children.length) {
          [...uploadsPanel.children].forEach(node => mainCol.appendChild(node));
        }
        const recsPanel = panels.querySelector('.itw-panel-recs');
        if (recsPanel && recsPanel.children.length) {
          const block = recsPanel.querySelector('.itw-recs');
          if (block && sidebar) sidebar.appendChild(block);
          else if (recsPanel.children.length) {
            [...recsPanel.children].forEach(node => (sidebar || mainCol).appendChild(node));
          }
        }
        const likesPanel = panels.querySelector('.itw-panel-likes');
        if (likesPanel && likesPanel.children.length) {
          const block = likesPanel.querySelector('.itw-liked-by');
          if (block && sidebar) sidebar.appendChild(block);
          else if (likesPanel.children.length) {
            [...likesPanel.children].forEach(node => (sidebar || mainCol).appendChild(node));
          }
        }
        const commentsPanel = panels.querySelector('.itw-panel-comments');
        if (commentsPanel && commentsPanel.children.length) {
          [...commentsPanel.children].forEach(node => mainCol.appendChild(node));
        }
        panels.remove();
      }
      if (tabbar) tabbar.remove();
      // Always clear the layout class to avoid full-width/hidden-sidebar in vanilla mode
      document.body.classList.remove(CSS_CLASSES.TABS_ACTIVE);
    } catch (e) {
      console.warn('[Iwara NeoUI] Tabs teardown skipped:', e);
      // Still ensure layout class is not left behind on error paths
      document.body.classList.remove('itw-tabs-active');
    }
  };

  const applyUiMode = () => {
    if (settings.newUI && isVideoPage()) {
      setupVideoTabs();
    } else {
      teardownVideoTabs();
      // Safety: explicitly ensure classes are removed when new UI is disabled
      document.body.classList.remove('itw-tabs-active');
      document.body.classList.remove('itw-theater');
      // Ensure Likes observer is stopped in vanilla mode
      if (__itwLikesObserver) { try { __itwLikesObserver.disconnect(); } catch {} __itwLikesObserver = null; }
    }
  };

  // ---- Initialize ----
  (async () => {
    await loadSettings();
    ensureModal();
    await ensureHeaderButton();
    findLikedBySection();
    findRecsSection();
    applySettings();
    applyUiMode();

    observerManager.create('main', () => {
        // Clear cache periodically to avoid stale references
        domCache.clear();
        
        // Always correct stray class if UI not present
        if (!document.querySelector(SELECTORS.TABBAR) && !document.querySelector(SELECTORS.PANELS)) {
          document.body.classList.remove(CSS_CLASSES.TABS_ACTIVE);
        }
        // If we navigated away from a video page, ensure tabs are removed
        if (!isVideoPage() && document.querySelector('.itw-tabbar')) teardownVideoTabs();

      if (isVideoPage()) {
        if (!document.querySelector(SELECTORS.LIKED_BY)) findLikedBySection();
        if (!document.querySelector(SELECTORS.RECS)) findRecsSection();
        if (!document.querySelector(SELECTORS.PLAYER_WRAP)) applyTheater();
        if (settings.newUI && !document.querySelector(SELECTORS.TABBAR)) setupVideoTabs();
        // Late-arriving Likes: move it into panel when it appears
        if (settings.newUI && settings.showLikesTab) {
          const likesPanel = domCache.get('.itw-panel-likes');
        const likedNode = domCache.get(SELECTORS.LIKED_BY) || domCache.get(SELECTORS.LIKES_LIST);
          if (likesPanel && likedNode) {
            const block = likedNode.classList?.contains('itw-liked-by') ? likedNode : (likedNode.closest('.block, .contentBlock, .block--padding, .card, .panel') || likedNode);
            if (!likesPanel.contains(block)) likesPanel.append(block);
          }
        }
      }
      // In vanilla mode, ensure no tabs or theater layout persist
      if (!settings.newUI) {
        if (document.querySelector('.itw-tabbar')) teardownVideoTabs();
        document.body.classList.remove(CSS_CLASSES.THEATER);
      }
    });
    observerManager.observe('main');
  })();
})();