// ==UserScript==
// @name         icons8 SVG Embed Paywall Bypass
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  ONLY removes paywall overlay + makes native button work
// @author       InternetNinja
// @match        *://icons8.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558287/icons8%20SVG%20Embed%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/558287/icons8%20SVG%20Embed%20Paywall%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .i8-code__locked {
            display: none !important;
        }
        .i8-code__code-text {
            filter: none !important;
            -webkit-filter: none !important;
            user-select: text !important;
            -webkit-user-select: text !important;
        }
    `;
    document.head.appendChild(style);

    function fixPaywall() {
        document.querySelectorAll('.i8-code__code-text').forEach(codeEl => {
            // Remove overlay if present
            const overlay = codeEl.closest('.i8-code__wrapper')?.querySelector('.i8-code__locked');
            if (overlay) overlay.remove();

            // Only add button if no native button exists
            if (!codeEl.querySelector('.i8-code__copy-btn')) {
                const btn = document.createElement('button');
                btn.className = 'i8-code__copy-btn';
                btn.innerHTML = `<img src="https://maxst.icons8.com/vue-static/icon/svg/copy.svg" alt="copy">`;
                btn.onclick = () => navigator.clipboard.writeText(codeEl.textContent);
                codeEl.appendChild(btn);
            }
        });
    }

    // Run multiple times to catch dynamic content
    const runFix = () => setTimeout(fixPaywall, 100);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFix);
    } else {
        runFix();
    }

    new MutationObserver(runFix).observe(document.body, { childList: true, subtree: true });

    // Run periodically for SPA sites
    setInterval(runFix, 2000);
})();
