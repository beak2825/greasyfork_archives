// ==UserScript==
// @name         Comick Tracking Site Banner Remover
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Removes the tracking site warning banner from comick.dev
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550488/Comick%20Tracking%20Site%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/550488/Comick%20Tracking%20Site%20Banner%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBanner() {
        const selectors = [
            'div.rounded.p-2.flex.border-l-8.shadow.items-center[class*="border-red-400"][class*="bg-red-100"]',
            'div.rounded.p-2.flex.border-l-8.shadow.items-center[class*="border-yellow-400"][class*="bg-yellow-100"]'
        ];

        selectors.forEach(function(selector) {
            const banner = document.querySelector(selector);
            if (banner) {
                const textContent = banner.textContent;
                if (textContent.includes('Comick is becoming a tracking site') &&
                    textContent.includes('Read First')) {
                    banner.remove();
                }
            }
        });
    }

    function observeAndRemove() {
        removeBanner();

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    removeBanner();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeAndRemove);
    } else {
        observeAndRemove();
    }
})();