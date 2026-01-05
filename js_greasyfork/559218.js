// ==UserScript==
// @name         知乎清除段落划线
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  去除知乎段落高亮划线，保留原文
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559218/%E7%9F%A5%E4%B9%8E%E6%B8%85%E9%99%A4%E6%AE%B5%E8%90%BD%E5%88%92%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/559218/%E7%9F%A5%E4%B9%8E%E6%B8%85%E9%99%A4%E6%AE%B5%E8%90%BD%E5%88%92%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unwrapHighlights() {
        const list = document.querySelectorAll('.highlight-wrap');

        list.forEach(el => {
            const parent = el.parentNode;
            if (!parent) return;

            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }

            parent.removeChild(el);
        });
    }

    const observer = new MutationObserver(() => {
        unwrapHighlights();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    unwrapHighlights();
})();
