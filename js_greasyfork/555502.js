// ==UserScript==
// @name         Pornhub Banner Remover
// @version      1.0
// @description  Removes those pesky ad banners on everyones favorite Hub.
// @author       nereids
// @namespace    http://tampermonkey.net/
// @match        https://*.pornhub.com/*
// @match        https://*.pornhubpremium.com/*
// @icon         https://icons.duckduckgo.com/ip3/www.pornhub.com.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555502/Pornhub%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/555502/Pornhub%20Banner%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const css = `
        body, .homepage, .pcVideoList { display: block !important; }
        div:has(> .tj-inban-container)
        }
    `;
    const styleElement = document.createElement('style');
    styleElement.textContent = css;
    (document.head || document.documentElement).appendChild(styleElement);

    // Function removes ad dynamically.
    function removeAd() {
        const labels = document.querySelectorAll('.tj-inban-container');
        labels.forEach(label => {
            const adContainer = label.parentElement;
            if (adContainer && !adContainer.classList.contains('homepage')) {
                adContainer.style.display = 'none';
                adContainer.innerHTML = '';
            }
        });
    }

    const observer = new MutationObserver(removeAd);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    removeAd();
    setInterval(removeAd, 500);
})();