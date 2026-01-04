// ==UserScript==
// @name         Anti Popup (Enhanced 90%+ Block)
// @namespace    ryza-no-popup-strong
// @version      2.5
// @description  Block almost all popups, popunders, and unwanted redirects for a cleaner and safer browsing experience.
// @license      Ryza License
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551687/Anti%20Popup%20%28Enhanced%2090%25%2B%20Block%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551687/Anti%20Popup%20%28Enhanced%2090%25%2B%20Block%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const WHITELIST = [
    'accounts.google.com',
    'paypal.com'
  ];

  const isWhite = (url) => {
    try {
      const u = new URL(url, location.href);
      return WHITELIST.includes(u.hostname);
    } catch { return false; }
  };

  // ---- Block window.open globally and inside iframes ----
  const blockOpen = () => {
    const trap = new Proxy(window.open, {
      apply(_, __, args) {
        const url = args?.[0];
        if (!url || isWhite(url)) return null;
        console.warn('[AntiPopup] Blocked:', url);
        return null;
      }
    });
    Object.defineProperty(window, 'open', {
      configurable: true,
      writable: true,
      value: trap
    });
  };

  blockOpen();

  const origCreateEl = Document.prototype.createElement;
  Document.prototype.createElement = function (...a) {
    const el = origCreateEl.apply(this, a);
    if (a[0].toLowerCase() === 'iframe') {
      setTimeout(() => {
        try { el.contentWindow.open = () => null; } catch {}
      }, 1000);
    }
    return el;
  };

  // ---- Clean malicious links ----
  const cleanLink = (a) => {
    if (!(a instanceof HTMLAnchorElement)) return;
    const oc = (a.getAttribute('onclick') || '').toLowerCase();
    if (oc.includes('window.open')) a.removeAttribute('onclick');
    if (!isWhite(a.href)) a.removeAttribute('target');
  };

  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a) cleanLink(a);
  }, true);

  // ---- Observe dynamic ads ----
  new MutationObserver(m => {
    for (const rec of m) {
      for (const n of rec.addedNodes) {
        if (n.querySelectorAll) {
          n.querySelectorAll('a[target], a[onclick]').forEach(cleanLink);
          n.querySelectorAll('iframe').forEach(i => {
            try { i.contentWindow.open = () => null; } catch {}
          });
        }
      }
    }
  }).observe(document.documentElement, {childList:true,subtree:true});

  // ---- Block forced redirects ----
  const origAssign = window.location.assign;
  window.location.assign = function(url){
    if (!isWhite(url)) {
      console.warn('[AntiPopup] Block redirect ->', url);
      return;
    }
    return origAssign.call(window.location, url);
  };

  const origReplace = window.location.replace;
  window.location.replace = function(url){
    if (!isWhite(url)) {
      console.warn('[AntiPopup] Block replace ->', url);
      return;
    }
    return origReplace.call(window.location, url);
  };

  // ---- Prevent popup hijack via focus ----
  ['focus', 'blur'].forEach(ev=>{
    window.addEventListener(ev, e=>{
      const active = document.activeElement;
      if (active && active.tagName === 'IFRAME') {
        try { active.contentWindow.open = () => null; } catch {}
      }
    }, true);
  });

  console.log('[AntiPopup+] Active ✅');
})();