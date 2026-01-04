// ==UserScript==
// @name         Kongregate UI Cleaner
// @namespace    http://tampermonkey.net/
// @match        *://www.kongregate.com/games/*
// @match        *://www.kongregate.com/en/games/*
// @run-at       document-start
// @grant        none
// @version      1.4
// @description  Removes the adblock warning and suggested games
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559265/Kongregate%20UI%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/559265/Kongregate%20UI%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        document.querySelectorAll('img[src*="warning_amber"]').forEach(img => {
            const container = img.closest('div[style*="position: fixed"], div[style*="position:fixed"]');
            container?.remove();
        });

        const elementsToRemove = [
            document.querySelector('.hidden.lg\\:block.w-\\[350px\\].flex-shrink-0.self-start'),
            document.querySelector('.mt-8.mb-8'),
            document.querySelector('.lg\\:hidden.mt-4'),
        ];

        elementsToRemove.forEach(el => el?.remove());
    }

    new MutationObserver(removeElements).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();