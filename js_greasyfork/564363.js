// ==UserScript==
// @name         Renown Auto Accept
// @namespace    https://renown.gg/
// @version      1.0
// @description  Automatically accepts match when found on Renown.gg (CS2)
// @author       lonesome
// @match        https://renown.gg/*
// @icon         https://renown.gg/favicon.ico
// @license      MIT; https://opensource.org/licenses/MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564363/Renown%20Auto%20Accept.user.js
// @updateURL https://update.greasyfork.org/scripts/564363/Renown%20Auto%20Accept.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const checkInterval = setInterval(() => {
        const modal = document.querySelector('.confirm-match-modal');
        if (modal) {
            const acceptButton = modal.querySelector('button.primary-button');
            if (acceptButton && acceptButton.textContent.trim() === 'Accept') {
                console.log('[Renown Auto Accept] Match found! Clicking accept...');
                acceptButton.click();
            }
        }
    }, 500);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    const modal = node.classList?.contains('confirm-match-modal')
                        ? node
                        : node.querySelector?.('.confirm-match-modal');

                    if (modal) {
                        const acceptButton = modal.querySelector('button.primary-button');
                        if (acceptButton) {
                            console.log('[Renown Auto Accept] Match found! Auto-accepting...');
                            setTimeout(() => acceptButton.click(), 100);
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log('[Renown Auto Accept] Script loaded and watching for matches...');
})();
