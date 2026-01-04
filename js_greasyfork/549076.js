// ==UserScript==
// @name         Reddit Redirect (Bypass age verification)
// @namespace    https://https://www.tampermonkey.net/
// @version      1.0
// @description  Redirect all links from Reddit to red.artemislena.eu if the 'verify your birthday' popup is shown
// @author       zy
// @icon         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
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://reddit.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549076/Reddit%20Redirect%20%28Bypass%20age%20verification%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549076/Reddit%20Redirect%20%28Bypass%20age%20verification%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const redirectHost = 'red.artemislena.eu';
  const phrases = [
    /verify your birthday to continue/i,
    /add your birthday/i
  ];

  function isGatePresent() {
    try {
      const slotEls = document.querySelectorAll('[slot="title"]');
      for (const el of slotEls) {
        const txt = (el.innerText || el.textContent || '').trim();
        if (!txt) continue;
        for (const rx of phrases) if (rx.test(txt)) return true;
      }

      if (document.body && document.body.innerText) {
        const bodyText = document.body.innerText;
        for (const rx of phrases) if (rx.test(bodyText)) return true;
      }
    } catch (e) {
    }
    return false;
  }

  function doRedirect() {
    try {
      const u = new URL(window.location.href);
      u.hostname = redirectHost;
      u.search = '';
      u.hash = '';
      window.location.assign(u.toString());
    } catch (err) {
      const hrefNoQuery = window.location.href.split('?')[0];
      window.location.assign(hrefNoQuery.replace(window.location.hostname, redirectHost));
    }
  }

  function checkAndRedirectOnce() {
    if (isGatePresent()) {
      console.log('[Userscript] Birthday gate detected — redirecting to', redirectHost);
      doRedirect();
    } else {
      console.log('[Userscript] No birthday gate detected (checked).');
    }
  }

  setTimeout(checkAndRedirectOnce, 50);

  (function hookHistoryEvents() {
    const wrap = (orig) => function () {
      const rv = orig.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return rv;
    };
    if (history.pushState) history.pushState = wrap(history.pushState);
    if (history.replaceState) history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', () => setTimeout(checkAndRedirectOnce, 500));
  })();

  const observer = new MutationObserver((mutations) => {
    if (isGatePresent()) {
      observer.disconnect();
      doRedirect();
    }
  });

  observer.observe(document.documentElement || document, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 5000);
})();

