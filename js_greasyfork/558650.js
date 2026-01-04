// ==UserScript==
// @name         Clear site data and reload (Alt+Shift+D)
// @namespace    https://example.com/
// @version      1.1
// @description  Clear cookies & storage for current site, then reload. Hotkey + menu + optional button.
// @author       RB
// @match        *://*/*
// @run-at       document-idle
// @license      MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/558650/Clear%20site%20data%20and%20reload%20%28Alt%2BShift%2BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558650/Clear%20site%20data%20and%20reload%20%28Alt%2BShift%2BD%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Only run in top frame
  if (window.top !== window.self) return;

  // ---------- Config ----------
  const SHOW_FLOATING_BUTTON = false; // set true to show a button on each page
  const REQUIRE_CONFIRMATION = true;  // set false if you later want no prompt
  const SHOW_TOAST = true;            // set false to disable toast
  const TOAST_DURATION_MS = 1200;
  const RELOAD_DELAY_MS = 500;        // wait a bit so user can see toast

  // ---------- Core clear + reload ----------
  async function clearSiteDataAndReload() {
    try {
      await clearSiteData();
    } catch (e) {
      console.error('Error while clearing site data', e);
    }
    location.reload();
  }

  // Delete non-HttpOnly cookies for this origin (best-effort)
  function clearCookies() {
    const raw = document.cookie;
    if (!raw) return;

    const cookies = raw.split(';');
    const hostnameParts = location.hostname.split('.');
    const domains = [undefined];

    // Try various domain scopes: .example.com, .sub.example.com, etc.
    if (hostnameParts.length > 1) {
      for (let i = 0; i < hostnameParts.length - 1; i++) {
        domains.push('.' + hostnameParts.slice(i).join('.'));
      }
    }

    const paths = ['/', location.pathname || '/'];

    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = (eqPos > -1 ? cookie.substr(0, eqPos) : cookie).trim();
      if (!name) continue;

      domains.forEach(domain => {
        paths.forEach(path => {
          let cookieStr = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
          if (domain) cookieStr += ` domain=${domain};`;
          document.cookie = cookieStr;
        });
      });
    }
  }

  async function clearSiteData() {
    // Cookies
    try { clearCookies(); } catch (e) {}

    // Web Storage
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); } catch (e) {}

    const tasks = [];

    // Cache Storage
    if ('caches' in window) {
      tasks.push(
        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      );
    }

    // Service Workers
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      tasks.push(
        navigator.serviceWorker.getRegistrations()
          .then(regs => Promise.all(regs.map(r => r.unregister())))
      );
    }

    // IndexedDB (where supported)
    if (window.indexedDB && typeof indexedDB.databases === 'function') {
      tasks.push(
        indexedDB.databases()
          .then(dbs => Promise.all(
            dbs.map(db => db && db.name && indexedDB.deleteDatabase(db.name))
          ))
      );
    }

    if (tasks.length) {
      await Promise.allSettled(tasks);
    }
  }

  // ---------- UI helpers ----------
  function showToast(msg) {
    if (!document.body) return;
    const el = document.createElement('div');
    el.textContent = msg;
    Object.assign(el.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      padding: '8px 14px',
      borderRadius: '4px',
      zIndex: '2147483647',
      fontSize: '12px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), TOAST_DURATION_MS);
  }

  // Unified entry point used by hotkey, menu, and button
  function triggerClearSiteData() {
    if (REQUIRE_CONFIRMATION) {
      const ok = window.confirm('Clear this site’s data and reload?');
      if (!ok) return;
    }

    if (SHOW_TOAST) {
      showToast('Clearing site data and reloading…');
    }

    // Give the toast a moment to show before reload
    setTimeout(clearSiteDataAndReload, RELOAD_DELAY_MS);
  }

  // ---------- Hotkey: Alt+Shift+D ----------
  function registerHotkey() {
    window.addEventListener('keydown', e => {
      // Alt+Shift+D, no Ctrl, no Meta
      if (!e.ctrlKey && e.altKey && e.shiftKey && !e.metaKey &&
          e.key && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        e.stopPropagation();
        triggerClearSiteData();
      }
    }, true);
  }

  // ---------- Tampermonkey menu ----------
  function registerMenu() {
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand(
        'Clear this site data & reload (Alt+Shift+D)',
        triggerClearSiteData
      );
    }
  }

  // ---------- Optional floating button ----------
  function addFloatingButton() {
    if (!SHOW_FLOATING_BUTTON) return;
    if (!document.body) return;

    const btn = document.createElement('button');
    btn.textContent = 'Clear site data';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: '2147483647',
      padding: '6px 10px',
      fontSize: '12px',
      background: '#c00',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      opacity: '0.7',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    });

    btn.addEventListener('mouseenter', () => { btn.style.opacity = '1'; });
    btn.addEventListener('mouseleave', () => { btn.style.opacity = '0.7'; });
    btn.addEventListener('click', triggerClearSiteData);

    document.body.appendChild(btn);
  }

  // ---------- Init ----------
  function init() {
    registerHotkey();
    registerMenu();

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      addFloatingButton();
    } else {
      window.addEventListener('DOMContentLoaded', addFloatingButton);
    }
  }

  init();
})();