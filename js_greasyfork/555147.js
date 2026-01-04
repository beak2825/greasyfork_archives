// ==UserScript==
// @name        FileCR Premium
// @namespace   https://github.com/Warrior-dev0
// @license     Unlicense
// @match       *://filecr.com/*
// @match       https://anygame.net/downloads/*
// @icon        https://filecr.com/favicon.png
// @grant       none
// @version     0.7
// @author      WarriOr
// @homepageURL https://github.com/Warrior-dev0
// @supportURL  https://t.me/Xiaomi_EU_Ports
// @description Unlocks FileCR Premium 
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/555147/FileCR%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/555147/FileCR%20Premium.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('message', (event) => {
    const data = {
      direction: 'from-content-script',
      responseFor: event.data.id,
      type: 'response',
    };

    if (event.data && event.data.action === 'app.info') {
      data.data = {
        id: 'cgdlgjfaminolmljfokbbienpoibhknp',
        version: '9.9.9',
      };
      window.postMessage(data);
      return;
    }
    if (event.data && event.data.id === "install-check") {
      window.postMessage(data);
      return;
    }
    if (event.data && event.data.action === "downloads.extractLink") {
      data.data = event.data.data && event.data.data.url;
      // navigate immediately to the URL if present
      if (data.data) {
        try { window.location.href = data.data; } catch (e) { /* ignore */ }
      }
      window.postMessage(data);
      return;
    }
  });

  try {
    if (!document.cookie.includes("extensionIsInstalled")) {
      document.cookie = "extensionIsInstalled=1; path=/; max-age=" + (30 * 24 * 60 * 60);
    }
  } catch (e) {
    // ignore cookie errors
  }

  const RELOAD_COOLDOWN_MS = 30 * 1000;
  function canReloadNow() {
    try {
      const last = sessionStorage.getItem('filecr_bypass_last_reload') || 0;
      return (Date.now() - Number(last)) > RELOAD_COOLDOWN_MS;
    } catch (e) {
      return true;
    }
  }
  function markReloadNow() {
    try { sessionStorage.setItem('filecr_bypass_last_reload', String(Date.now())); } catch (e) {}
  }

  let reloading = false;

  function checkAndMaybeReload() {
    try {
      const nextScript = document.querySelector('script#\\_\\_NEXT_DATA__') || document.getElementById('__NEXT_DATA__') || document.querySelector('script#__NEXT_DATA__');
      const has404 = !!document.querySelector('.e-404');

      if (nextScript && has404 && !reloading && canReloadNow()) {
        reloading = true;
        markReloadNow();
        setTimeout(() => {
          try {
            location.reload();
          } catch (e) {
            location.href = location.href;
          }
        }, 150);
        return true;
      }
    } catch (e) {
      // ignore detection errors
    }
    return false;
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (checkAndMaybeReload()) break;
      }
    }
  });

  try {
    observer.observe(document.documentElement || document, {
      childList: true,
      subtree: true
    });
  } catch (e) {
    window.addEventListener('DOMContentLoaded', () => {
      try {
        observer.observe(document.documentElement, { childList: true, subtree: true });
      } catch (err) {}
    }, { once: true });
  }

  let pollCount = 0;
  const POLL_INTERVAL = 500;
  const MAX_POLLS = 20; // 20 * 500ms = 10s
  const poller = setInterval(() => {
    pollCount++;
    checkAndMaybeReload();
    if (pollCount >= MAX_POLLS) {
      clearInterval(poller);
    }
  }, POLL_INTERVAL);

  function runOnNavigation() {
    setTimeout(() => { checkAndMaybeReload(); }, 200);
  }

  (function hijackHistoryMethods() {
    const _push = history.pushState;
    history.pushState = function () {
      const res = _push.apply(this, arguments);
      window.dispatchEvent(new Event('filecr-bypass-navigation'));
      return res;
    };
    const _replace = history.replaceState;
    history.replaceState = function () {
      const res = _replace.apply(this, arguments);
      window.dispatchEvent(new Event('filecr-bypass-navigation'));
      return res;
    };
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('filecr-bypass-navigation')));
    window.addEventListener('filecr-bypass-navigation', runOnNavigation);
  })();

  try { checkAndMaybeReload(); } catch (e) {}

})();
