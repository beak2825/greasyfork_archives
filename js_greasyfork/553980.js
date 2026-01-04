// ==UserScript==
// @name         Google Search Plus
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Google搜索增强
// @author       ChenXu
// @license      MIT
// @include      *://www.google.com*/search*
// @include      *://scholar.google.com*/scholar*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553980/Google%20Search%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/553980/Google%20Search%20Plus.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const isSearchPage = () => /^https?:\/\/(www|scholar)\.google\.[^\/]+\/(search|scholar)\?/.test(location.href);
    const isGoogleLink = (href) => /^https?:\/\/(www|scholar)\.google\.[^\/]+\/(search|scholar)\?/.test(href);

    function addFilterParam() {
        if (!isSearchPage()) return;

        const url = new URL(location.href);
        if (!url.searchParams.has('filter')) {
            url.searchParams.set('filter', '0');
            if (url.href !== location.href) {
                location.replace(url.href);
                return;
            }
        }
    }

    function processLinks() {
        document.querySelectorAll('a[href]:not([data-processed])').forEach(link => {
            const href = link.href;
            if (href && !isGoogleLink(href) && !href.toLowerCase().startsWith('javascript:')) {
                link.dataset.processed = 'true';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                processLinks();
                break;
            }
        }
    });

    addFilterParam();
    if (isSearchPage()) {
        processLinks();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
})();
