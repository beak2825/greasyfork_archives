// ==UserScript==
// @name         Paccurate Images In ShipHawk (Tag reader + SPA-aware iframe)
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Open Paccurate Config Editor in a separate popup; remembers position/size (even on a second monitor). SPA-aware; hotkeys.
// @author       Jeff Liang
// @match        https://shiphawk.com/*
// @match        https://fswtu.tms.myshiphawk.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shiphawk.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554919/Paccurate%20Images%20In%20ShipHawk%20%28Tag%20reader%20%2B%20SPA-aware%20iframe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554919/Paccurate%20Images%20In%20ShipHawk%20%28Tag%20reader%20%2B%20SPA-aware%20iframe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
    console.log("RAN PACCURATE")

  // ---------- Config ----------
  const POP_NAME   = 'paccurate_config_editor_popup';
  const URL_BASE   = 'https://inspector.manage.paccurate.io/config-editor';
  const AUTO_OPEN  = true;
  const AUTO_FOCUS = true;
  const HOTKEY_OPEN = { altKey: true, key: 'p' }; // Alt+P
  const HOTKEY_SAVE = { altKey: true, key: 's' }; // Alt+S

  const DEFAULTS = { width: 1100, height: 800, left: 80, top: 60 };

  // ---------- Storage keys ----------
  const SIZE_KEY = 'tmPaccuratePopupSize'; // {w,h,left,top}
  const LAST_UUID_KEY = 'tmPaccurateLastUuid';

  // ---------- Utils ----------
  function waitFor(fn, { timeout = 15000, interval = 100 } = {}) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function tick() {
        try {
          const v = fn();
          if (v) return resolve(v);
          if (Date.now() - start >= timeout) return reject(new Error('waitFor timeout'));
          setTimeout(tick, interval);
        } catch (e) { reject(e); }
      })();
    });
  }

  function getSavedRect() {
    try {
      const v = JSON.parse(localStorage.getItem(SIZE_KEY) || 'null');
      if (!v) return { ...DEFAULTS };
      const scrW = (window.screen?.availWidth || 1920);
      const scrH = (window.screen?.availHeight || 1080);
      const w = Math.max(600, Math.min(scrW - 40, v.w || DEFAULTS.width));
      const h = Math.max(400, Math.min(scrH - 60, v.h || DEFAULTS.height));
      // NOTE: left/top can be negative on multi-monitor setups; allow it
      const left = (typeof v.left === 'number') ? v.left : DEFAULTS.left;
      const top  = (typeof v.top  === 'number') ? v.top  : DEFAULTS.top;
      return { width: w, height: h, left, top };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function saveRect(w, h, left, top) {
    const payload = {
      w: Math.round(w ?? DEFAULTS.width),
      h: Math.round(h ?? DEFAULTS.height),
      left: Math.round(left ?? DEFAULTS.left),
      top: Math.round(top  ?? DEFAULTS.top),
    };
    localStorage.setItem(SIZE_KEY, JSON.stringify(payload));
  }

  function makeUrl(uuid) {
    const u = new URL(URL_BASE);
    u.searchParams.set('packUuid', uuid);
    u.searchParams.set('embed', 'true');
    return u.toString();
  }

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
    } catch { /* ignore */ }
  }

  // ---------- Tag extraction ----------
  function getTagsFromSvgs(root = document) {
    const svgs = Array.from(root.querySelectorAll('svg[data-test-id^="remove-tag-icon-"]'));
    const tags = svgs.map(svg => {
      const dt = svg.getAttribute('data-test-id') || '';
      const prefix = 'remove-tag-icon-';
      if (!dt.startsWith(prefix)) return null;
      const rest = dt.slice(prefix.length);  // "<TAG>-<index>"
      const cut = rest.lastIndexOf('-');
      return cut > 0 ? rest.slice(0, cut) : rest;
    }).filter(Boolean);
    return [...new Set(tags)];
  }
  function getTagsFromLabels(root = document) {
    return Array.from(root.querySelectorAll('.react-tagsinput .MuiChip-label'))
      .map(el => (el.textContent || '').trim())
      .filter(Boolean);
  }
  function readTags() {
    let tags = getTagsFromSvgs();
    if (!tags.length) tags = getTagsFromLabels();
    return tags;
  }

  // ---------- Popup management ----------
  let popupRef = null;
  let currentUuid = null;
  let geomTimer = null;
  let lastGeom = null;

  function startGeometryWatcher() {
    stopGeometryWatcher();
    // Try to sample geometry every 500ms while the popup is open.
    geomTimer = setInterval(() => {
      try {
        if (!popupRef || popupRef.closed) return;
        // These are usually readable for a window you opened (even cross-origin), but we guard with try/catch.
        const w  = popupRef.outerWidth;
        const h  = popupRef.outerHeight;
        const lx = (typeof popupRef.screenX === 'number') ? popupRef.screenX : (typeof popupRef.screenLeft === 'number' ? popupRef.screenLeft : undefined);
        const ty = (typeof popupRef.screenY === 'number') ? popupRef.screenY : (typeof popupRef.screenTop  === 'number' ? popupRef.screenTop  : undefined);
        if ([w,h,lx,ty].every(v => typeof v === 'number')) {
          const key = `${w}x${h}@${lx},${ty}`;
          if (key !== lastGeom) {
            lastGeom = key;
            saveRect(w, h, lx, ty);
          }
        }
      } catch {
        // Ignore; some browsers block cross-origin geometry reads
      }
      if (!popupRef || popupRef.closed) stopGeometryWatcher();
    }, 500);
  }

  function stopGeometryWatcher() {
    if (geomTimer) clearInterval(geomTimer);
    geomTimer = null;
  }

  function nudgeToSavedRect() {
    try {
      if (!popupRef || popupRef.closed) return;
      const r = getSavedRect();
      // A small delay improves reliability after navigation
      setTimeout(() => {
        try {
          if (typeof popupRef.moveTo === 'function') popupRef.moveTo(r.left, r.top);
          if (typeof popupRef.resizeTo === 'function') popupRef.resizeTo(r.width, r.height);
        } catch { /* ignore */ }
      }, 200);
    } catch { /* ignore */ }
  }

  function openOrUpdatePopup(uuid, { focus = AUTO_FOCUS } = {}) {
    if (!uuid) return;
    const url = makeUrl(uuid);
    const r = getSavedRect();

    const features = [
      `width=${r.width}`, `height=${r.height}`,
      `left=${r.left}`, `top=${r.top}`,
      'resizable=yes', 'scrollbars=yes', 'toolbar=no', 'location=no', 'status=no', 'menubar=no'
    ].join(',');

    try {
      if (!popupRef || popupRef.closed) {
        popupRef = window.open(url, POP_NAME, features);
      } else {
        try { popupRef.location.href = url; }
        catch { popupRef = window.open(url, POP_NAME, features); }
      }
      if (popupRef && focus) popupRef.focus();
      // Try to enforce saved geometry even if the browser ignored window.open’s features
      nudgeToSavedRect();
      startGeometryWatcher();
    } catch (e) {
      alert('Popup was blocked. Click OK to copy the URL, then paste it into a new tab:\n\n' + url);
      copyToClipboard(url);
      return;
    }

    // Save an initial snapshot shortly after opening in case the browser gave us actual values
    setTimeout(() => {
      try {
        if (!popupRef || popupRef.closed) return;
        const ow = popupRef.outerWidth, oh = popupRef.outerHeight;
        const ox = (typeof popupRef.screenX === 'number' ? popupRef.screenX : popupRef.screenLeft);
        const oy = (typeof popupRef.screenY === 'number' ? popupRef.screenY : popupRef.screenTop);
        if ([ow,oh,ox,oy].every(v => typeof v === 'number')) saveRect(ow, oh, ox, oy);
      } catch { /* ignore */ }
    }, 500);
  }

  function setPopupForUuid(uuid) {
    if (!uuid) return;
    if (uuid === currentUuid) return;
    currentUuid = uuid;
    localStorage.setItem(LAST_UUID_KEY, uuid);
    if (AUTO_OPEN) openOrUpdatePopup(uuid);
  }

  // ---------- Hotkeys ----------
  window.addEventListener('keydown', (e) => {
    const k = e.key?.toLowerCase();
    // Alt+P -> open/focus last popup
    if (e.altKey === !!HOTKEY_OPEN.altKey && k === HOTKEY_OPEN.key) {
      e.preventDefault();
      const last = currentUuid || localStorage.getItem(LAST_UUID_KEY);
      if (last) openOrUpdatePopup(last, { focus: true });
      else alert('No tag UUID found yet on this page.');
    }
    // Alt+S -> force-save current geometry (useful if live sampling is blocked)
    if (e.altKey === !!HOTKEY_SAVE.altKey && k === HOTKEY_SAVE.key) {
      e.preventDefault();
      try {
        if (popupRef && !popupRef.closed) {
          const ow = popupRef.outerWidth, oh = popupRef.outerHeight;
          const ox = (typeof popupRef.screenX === 'number' ? popupRef.screenX : popupRef.screenLeft);
          const oy = (typeof popupRef.screenY === 'number' ? popupRef.screenY : popupRef.screenTop);
          if ([ow,oh,ox,oy].every(v => typeof v === 'number')) {
            saveRect(ow, oh, ox, oy);
            alert(`Saved popup position: ${ow}×${oh} @ ${ox},${oy}`);
          } else {
            alert('Could not read popup geometry in this browser.');
          }
        } else {
          alert('Popup not open.');
        }
      } catch {
        alert('Browser blocked reading popup geometry.');
      }
    }
  }, true);

  // ---------- DOM + SPA hooks ----------
  function readTags() {
    let tags = getTagsFromSvgs();
    if (!tags.length) tags = getTagsFromLabels();
    return tags;
  }
  function refreshFromDom() {
    const tags = readTags();
    const uuid = tags[0] || null;
    setPopupForUuid(uuid);
  }

  let tagObserver;
  function observeTagArea() {
    if (tagObserver) tagObserver.disconnect();
    const container =
      document.querySelector('[data-test-id="tags-select"]')?.parentElement?.parentElement ||
      document.querySelector('.react-tagsinput') ||
      document.body;

    tagObserver = new MutationObserver(() => {
      clearTimeout(observeTagArea._t);
      observeTagArea._t = setTimeout(refreshFromDom, 60);
    });
    tagObserver.observe(container, { childList: true, subtree: true, characterData: true });
  }

  function installRouteHooks() {
    let lastPath = location.pathname + location.search;
    const onRoute = () => {
      const now = location.pathname + location.search;
      if (now === lastPath) return;
      lastPath = now;
      setTimeout(() => {
        refreshFromDom();
        observeTagArea();
      }, 150);
    };
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function () { const r = push.apply(this, arguments); onRoute(); return r; };
    history.replaceState = function () { const r = replace.apply(this, arguments); onRoute(); return r; };
    window.addEventListener('popstate', onRoute);
    setInterval(onRoute, 800); // fallback
  }

  function boot() {
    waitFor(() =>
      document.querySelector('svg[data-test-id^="remove-tag-icon-"]') ||
      document.querySelector('.react-tagsinput') ||
      document.body
    ).catch(() => null).then(() => {
      refreshFromDom();
      observeTagArea();
      installRouteHooks();
    });
  }

  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, { once: true });
})();
