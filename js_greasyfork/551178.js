// ==UserScript==
// @name         Open Links in Background Tabs One-Button Toggle
// @version      2.1
// @description  A movable semi-transparent toggle appears in the corner. ON: links open in background tabs, Alt=current, Shift=foreground. Master enable/disable applies per HOSTNAME.
// @author       Te55eract
// @namespace    te55eract.page
// @match        http*://*/*
// @grant        GM_openInTab
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551178/Open%20Links%20in%20Background%20Tabs%20One-Button%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/551178/Open%20Links%20in%20Background%20Tabs%20One-Button%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Key granularity for per-page persistence (unchanged) ---
  const INCLUDE_QUERY = false;
  const INCLUDE_HASH  = false;

  const STORAGE_PREFIX         = 'toggleBgTabs:page:';           // per-page enabled state
  const POS_STORAGE_PREFIX     = 'toggleBgTabs:pos:';            // per-page button position
  const MASTER_DISABLED_PREFIX = 'toggleBgTabs:masterDisabled:'; // now keyed by HOSTNAME

  // --- State Variables ---
  let wrap = null;
  let btn = null;
  let enabled = false;

  // Keys
  let pageKey = currentPageKey();                 // per-page key (origin + normalized path [+ search/hash opt-in])
  let hostKey = currentHostKey();                 // NEW: per-hostname key
  let isMasterDisabled = !!GM_getValue(MASTER_DISABLED_PREFIX + hostKey, false);

  // Menu command id (for live text updates)
  let masterMenuCommand = null;

  // --- Helpers to compute keys ---
  function normalizePathname(pathname) {
    let p = pathname.replace(/\/index\.[a-z0-9]+$/i, '/');
    p = p.replace(/\/+$/, '/') || '/';
    return p;
  }

  function currentPageKey() {
    const u = new URL(location.href);
    let key = u.origin + normalizePathname(u.pathname);
    if (INCLUDE_QUERY && u.search) key += u.search;
    if (INCLUDE_HASH  && u.hash)   key += u.hash;
    return key;
  }

  // Per-hostname (case-insensitive). If you prefer per-origin (incl. port), use: new URL(location.href).origin
  function currentHostKey() {
    return location.hostname.toLowerCase();
  }

  // --- Master Toggle via Menu Command (HOSTNAME-BASED) ---
  function updateMasterMenuCommand() {
    if (masterMenuCommand) {
      GM_unregisterMenuCommand(masterMenuCommand);
    }
    const menuText = isMasterDisabled
      ? '✅ Enable Script on this Host'
      : '❌ Disable Script on this Host';
    masterMenuCommand = GM_registerMenuCommand(menuText, toggleMasterState);
  }

  function toggleMasterState() {
    isMasterDisabled = !isMasterDisabled;
    GM_setValue(MASTER_DISABLED_PREFIX + hostKey, isMasterDisabled);

    if (isMasterDisabled) {
      if (wrap) wrap.style.display = 'none';
      console.log('[BG Tabs Toggle] Script disabled for host:', hostKey);
    } else {
      if (wrap) {
        wrap.style.display = '';
      } else {
        initializeUI();
      }
      console.log('[BG Tabs Toggle] Script enabled for host:', hostKey);
    }
    updateMasterMenuCommand();
  }

  // Initialize the menu command when the script first runs
  updateMasterMenuCommand();

  // --- Main Initialization Function ---
  function initializeUI() {
    // Prevent re-initialization
    if (document.querySelector('.bgTabsToggle-wrap')) return;

    enabled = !!GM_getValue(STORAGE_PREFIX + pageKey, false);

    // --- UI: hover-to-reveal corner button ---
    const styles = `
      .bgTabsToggle-wrap {
        position: fixed;
        z-index: 2147483647;
        pointer-events: none;
      }
      .bgTabsToggle-btn {
        pointer-events: auto; opacity: 0.4; transform: translateY(6px);
        transition: opacity 120ms ease, transform 120ms ease, background 120ms ease, color 120ms ease, border-color 120ms ease;
        font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
        padding: 6px 10px; border-radius: 999px; border: 1px solid; cursor: pointer; user-select: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.25);
      }
      .bgTabsToggle-wrap:hover .bgTabsToggle-btn { opacity: 1; transform: translateY(0); }
      .bgTabsToggle-btn.off { background: #ffefef; color: #a40000; border-color: #ff8a8a; }
      .bgTabsToggle-btn.off:hover { background: #ffd9d9; }
      .bgTabsToggle-btn.on  { background: #eefbee; color: #0a6b00; border-color: #85e485; }
      .bgTabsToggle-btn.on:hover { background: #d9f8d9; }
      .bgTabsToggle-btn:active { cursor: grabbing; }
    `;
    if (typeof GM_addStyle === 'function') GM_addStyle(styles);
    else {
      const st = document.createElement('style');
      st.textContent = styles;
      document.documentElement.appendChild(st);
    }

    wrap = document.createElement('div');
    wrap.className = 'bgTabsToggle-wrap';

    btn = document.createElement('button');
    btn.className = 'bgTabsToggle-btn';
    updateButton();

    document.documentElement.appendChild(wrap);
    wrap.appendChild(btn);

    // --- Draggable & Persistence Logic (per-page) ---
    const DEFAULT_POS = { x: null, y: null };
    const getStoredPos = () => {
      try {
        return JSON.parse(GM_getValue(POS_STORAGE_PREFIX + pageKey, null)) || DEFAULT_POS;
      } catch {
        return DEFAULT_POS;
      }
    };

    const savePos = (x, y) => {
      GM_setValue(POS_STORAGE_PREFIX + pageKey, JSON.stringify({ x, y }));
    };

    const resetPos = () => {
      GM_setValue(POS_STORAGE_PREFIX + pageKey, null);
      setDefaultPosition();
    };

    function setDefaultPosition() {
      wrap.style.top = 'auto';
      wrap.style.left = 'auto';
      wrap.style.bottom = '8px';
      wrap.style.right = '8px';
    }

    let dragging = false;
    let hasMoved = false;
    let offsetX = 0;
    let offsetY = 0;

    btn.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      hasMoved = false;
      const rect = wrap.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      wrap.style.transition = 'none';
      wrap.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      hasMoved = true;
      const rawX = e.clientX - offsetX;
      const rawY = e.clientY - offsetY;

      const { x: newX, y: newY } = clampPosition(rawX, rawY);

      wrap.style.left = `${newX}px`;
      wrap.style.top = `${newY}px`;
      wrap.style.bottom = 'auto';
      wrap.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      wrap.style.transition = '';
      wrap.style.cursor = '';
      const rect = wrap.getBoundingClientRect();
      savePos(rect.left, rect.top);
    });

    btn.addEventListener('dblclick', (e) => {
      e.preventDefault();
      resetPos();
    });

    // --- Position Clamping & Window Resize ---
    function clampPosition(x, y) {
      if (!wrap || !btn) return { x, y };
      const rect = btn.getBoundingClientRect();
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      const clampedX = Math.max(0, Math.min(x, winWidth - rect.width));
      const clampedY = Math.max(0, Math.min(y, winHeight - rect.height));
      return { x: clampedX, y: clampedY };
    }

    function keepButtonInBounds() {
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const { x, y } = clampPosition(rect.left, rect.top);

      if (x !== rect.left || y !== rect.top) {
        wrap.style.left = `${x}px`;
        wrap.style.top = `${y}px`;
        savePos(x, y);
      }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(keepButtonInBounds, 100);
    });

    // --- Set Initial Position ---
    const pos = getStoredPos();
    if (pos.x !== null && pos.y !== null) {
      wrap.style.top = `${pos.y}px`;
      wrap.style.left = `${pos.x}px`;
      wrap.style.bottom = 'auto';
      wrap.style.right = 'auto';
    } else {
      setDefaultPosition();
    }
    setTimeout(keepButtonInBounds, 100);

    // --- Toggle button (per-page) ---
    btn.addEventListener('click', () => {
      if (hasMoved) return;
      enabled = !enabled;
      GM_setValue(STORAGE_PREFIX + pageKey, enabled);
      updateButton();
    });

    // --- Core behavior: intercept clicks when enabled ---
    document.addEventListener('click', function (e) {
      if (isMasterDisabled || !enabled) return;
      if (e.defaultPrevented) return;
      if (wrap.contains(e.target)) return;

      const b = 'button' in e ? e.button : 0;
      if (b !== 0 && b !== 1) return;

      const anchor = findAnchor(e.target);
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      const url = resolveUrl(anchor, href);

      if (e.altKey) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        navigateSameTab(url);
        return;
      }
      if (e.shiftKey) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        openInTab(url, true);
        return;
      }

      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      openInTab(url, false);
    }, true);

    // --- SPA awareness: update per-page state on URL changes ---
    hookLocationChanges(() => {
      const newKey = currentPageKey();
      if (newKey === pageKey) return;

      pageKey = newKey;
      hostKey = currentHostKey(); // in case host changes within same tab (rare without full reload)

      isMasterDisabled = !!GM_getValue(MASTER_DISABLED_PREFIX + hostKey, false);
      updateMasterMenuCommand();

      if (isMasterDisabled) {
        wrap.style.display = 'none';
      } else {
        wrap.style.display = '';
        enabled = !!GM_getValue(STORAGE_PREFIX + pageKey, false);

        const pos = JSON.parse(GM_getValue(POS_STORAGE_PREFIX + pageKey, null) || 'null');
        if (pos && pos.x !== null && pos.y !== null) {
          wrap.style.top = `${pos.y}px`;
          wrap.style.left = `${pos.x}px`;
          wrap.style.bottom = 'auto';
          wrap.style.right = 'auto';
        } else {
          setDefaultPosition();
        }
        updateButton();
        setTimeout(keepButtonInBounds, 100);
      }
    });
  } // --- End of initializeUI ---

  function updateButton() {
    if (!btn) return;
    if (enabled) {
      btn.classList.remove('off'); btn.classList.add('on');
      btn.textContent = 'BG Tabs: ON';
      btn.title = 'Click to turn OFF. Drag to move. Dbl-click to reset position. Modifiers: Alt=current, Shift=foreground.';
    } else {
      btn.classList.remove('on'); btn.classList.add('off');
      btn.textContent = 'BG Tabs: OFF';
      btn.title = 'Click to turn ON. Drag to move. Dbl-click to reset position.';
    }
  }

  function findAnchor(node) {
    let el = node;
    while (el && el !== document && el !== document.documentElement) {
      if (el.tagName === 'A' && el.href) return el;
      el = el.parentNode;
    }
    return null;
  }

  function resolveUrl(anchor, href) {
    try { return new URL(href, anchor.baseURI || document.baseURI).toString(); }
    catch { return href; }
  }

  function navigateSameTab(url) {
    location.assign(url);
  }

  function openInTab(url, active) {
    try {
      GM_openInTab(url, { active, insert: true, setParent: true });
    } catch (_) {
      try { GM_openInTab(url, !active ? true : false); }
      catch { window.open(url, '_blank', 'noopener,noreferrer'); }
    }
  }

  function hookLocationChanges(onChange) {
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    function fire() { setTimeout(() => window.dispatchEvent(new Event('locationchange')), 0); }
    history.pushState = function () { const r = origPush.apply(this, arguments); fire(); return r; };
    history.replaceState = function () { const r = origReplace.apply(this, arguments); fire(); return r; };
    window.addEventListener('popstate', fire);
    window.addEventListener('hashchange', fire);
    window.addEventListener('locationchange', onChange);
  }

  // --- Initial Script Execution ---
  if (!isMasterDisabled) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
      initializeUI();
    }
  } else {
    console.log('[BG Tabs Toggle] Script is disabled for this host via menu command:', hostKey);
  }
})();
