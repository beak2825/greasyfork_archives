// ==UserScript==
// @name         ZOZOTOWN New Tab
// @namespace    https://greasyfork.org/ja/users/1492018-sino087
// @version      1.0.0
// @description  ZOZOTOWNで、商品ページを新しいタブで開くようにするスクリプト
// @author       sino
// @match        https://zozo.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558427/ZOZOTOWN%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/558427/ZOZOTOWN%20New%20Tab.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isTargetUrl(href) {
        if (!href) return false;
        try {
            const url = new URL(href, window.location.origin);

            if (url.pathname.includes('/goods/') || url.pathname.includes('/goods-sale/')) {
                return true;
            }

            if (url.hostname.endsWith('zozo.jp') && url.searchParams.has('c')) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    function applyNewTab() {
        const elements = document.querySelectorAll('a');
        elements.forEach(element => {
            if (element.dataset.zntProcessed) return;

            if (isTargetUrl(element.href)) {
                element.setAttribute('target', '_blank');
                element.setAttribute('rel', 'noopener noreferrer');
            }

            element.dataset.zntProcessed = "true";
        });
    }

    applyNewTab();

    const observer = new MutationObserver((mutations) => {
        applyNewTab();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
