// ==UserScript==
// @name         Hide "Search with Google" on Google Translate (all locales)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the "Search with Google" button on Google Translate across all language versions and TLDs.
// @author       Zlodiy
// @match        https://translate.google.com/*
// @match        https://translate.google.com.ua/*
// @match        https://translate.google.*/*
// @run-at       document-start
// @grant        none
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/548270/Hide%20%22Search%20with%20Google%22%20on%20Google%20Translate%20%28all%20locales%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548270/Hide%20%22Search%20with%20Google%22%20on%20Google%20Translate%20%28all%20locales%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS-first: 
    const css = `
      [jsname="GADNLb"] [jsname="vLv7Lb"],
      [jsname="GADNLb"] button[jslog^="220557"] {
        display: none !important;
      }
    `;
    const style = document.createElement('style');
    style.setAttribute('data-hide-gtranslate-search-with-google', '1');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    // JS fallback  DOM
    function hideButtons() {
        const candidates = document.querySelectorAll('[jsname="vLv7Lb"], button[jslog^="220557"]');
        for (const node of candidates) {
            const btn = node.closest('button') || node;
            if (!btn || btn.dataset.__hiddenByUserscript) continue;
            btn.style.display = 'none';
            btn.setAttribute('aria-hidden', 'true');
            btn.dataset.__hiddenByUserscript = '1';

            
            const wrapper = btn.parentElement;
            if (wrapper && wrapper.hasAttribute('data-is-tooltip-wrapper')) {
                wrapper.style.display = 'none';
                const tip = wrapper.querySelector('[role="tooltip"]');
                if (tip) tip.style.display = 'none';
            }
        }
    }

    hideButtons();
    document.addEventListener('DOMContentLoaded', hideButtons);
    new MutationObserver(hideButtons).observe(document.documentElement, { childList: true, subtree: true });
})();
