// ==UserScript==
// @name         Neopets Red Badge (Bell Notification) Icon Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Comments out the permanent red badge notification alert icon across all Neopets pages
// @author       Luna
// @match        https://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558822/Neopets%20Red%20Badge%20%28Bell%20Notification%29%20Icon%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/558822/Neopets%20Red%20Badge%20%28Bell%20Notification%29%20Icon%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const commentOutElement = (el) => {
        if (!el) {
            console.warn('NavAlertsNotif element not found.');
            return;
        }

        try {
            const commentContent = el.outerHTML;
            const commentNode = document.createComment(commentContent);
            el.replaceWith(commentNode);
            console.log('NavAlertsNotif element commented out successfully.');
        } catch (error) {
            console.error('Error commenting out NavAlertsNotif:', error);
        }
    };

    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;

            const check = () => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (elapsed >= timeout) {
                    reject(new Error(`Element ${selector} not found after ${timeout}ms`));
                } else {
                    elapsed += interval;
                    setTimeout(check, interval);
                }
            };

            check();
        });
    };

    waitForElement('#NavAlertsNotif')
        .then(commentOutElement)
        .catch(err => console.warn(err.message));
})();
