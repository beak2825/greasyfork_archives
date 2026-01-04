// ==UserScript==
// @name         Codeforces 政治正确化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Make Codeforces politically correct.
// @match        *://codeforces.com/*
// @match        *://*.codeforces.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549589/Codeforces%20%E6%94%BF%E6%B2%BB%E6%AD%A3%E7%A1%AE%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/549589/Codeforces%20%E6%94%BF%E6%B2%BB%E6%AD%A3%E7%A1%AE%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newFlagUrl = 'https://codeforces.org/s/94047/images/flags-16/cn.png';
    const targetImgKeyword = 'tw.png';
    const replaceFlagImages = (scope) => {
        const images = scope.querySelectorAll(`img[src*="${targetImgKeyword}"]:not([data-flag-replaced])`);

        images.forEach(img => {
            const style = window.getComputedStyle(img);
            const originalWidth = parseFloat(style.width);
            const originalHeight = parseFloat(style.height);
            img.src = newFlagUrl;
            if (originalWidth > 0 && originalHeight > 0) {
                 img.style.width = `${originalWidth}px`;
                 img.style.height = `${originalHeight}px`;
            } else {
                 img.style.width = '16px';
                 img.style.height = '11px';
            }
            img.setAttribute('data-flag-replaced', 'true');
        });
    };
    replaceFlagImages(document);
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        replaceFlagImages(node);
                    }
                });
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();