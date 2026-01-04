// ==UserScript==
// @name         AliExpress auto-load more orders
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  When viewing past Aliexpress orders, auto-click the "View orders" button when it comes into view.
// @author       mjd+greasyfork.org@afork.com
// @license      CC0
// @match        https://www.aliexpress.com/p/order/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559652/AliExpress%20auto-load%20more%20orders.user.js
// @updateURL https://update.greasyfork.org/scripts/559652/AliExpress%20auto-load%20more%20orders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isWaitingForLoad = false;
    let lastClickTime = 0;
    const CLICK_DELAY = 2000; // 2 second delay between clicks

    function findAndClickViewOrdersButton() {
        // Look for the button with the specific span content
        const buttons = document.querySelectorAll('button.comet-btn.comet-btn-large.comet-btn-borderless');

        for (let button of buttons) {
            const span = button.querySelector('span');
            if (span && span.textContent.includes('View orders')) {
                return button;
            }
        }
        return null;
    }

    function clickWhenVisible() {
        // Don't click if we're waiting for previous load to complete or too soon since last click
        if (isWaitingForLoad) return;
        if (Date.now() - lastClickTime < CLICK_DELAY) return;

        const button = findAndClickViewOrdersButton();
        if (!button) return;

        const rect = button.getBoundingClientRect();
        // Check if button is in viewport (with some threshold)
        if (rect.top < (window.innerHeight + 300)) {
            button.click();
            lastClickTime = Date.now();
            isWaitingForLoad = true;

            // Reset after content should have loaded
            setTimeout(() => {
                isWaitingForLoad = false;
                // Check again after load in case we need to load even more
                setTimeout(clickWhenVisible, 500);
            }, 2500);
        }
    }

    function init() {
        // Initial check in case button is already visible
        setTimeout(clickWhenVisible, 1000);

        // Set up scroll listener with throttling
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(clickWhenVisible, 100);
        });

        // Also set up MutationObserver to handle dynamic content changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    // Check for new content after a short delay
                    setTimeout(clickWhenVisible, 500);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();