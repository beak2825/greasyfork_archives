// ==UserScript==
// @name         Twitch Auto Point Collector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the point claim button on Twitch
// @author       HyakuAr
// @match        https://www.twitch.tv/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559908/Twitch%20Auto%20Point%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/559908/Twitch%20Auto%20Point%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasClicked = false;

    function findAndClickButton() {
        // Find button using multiple language-independent selectors
        let button = null;

        // Method 1: Look for the specific icon structure
        const icons = document.querySelectorAll('.claimable-bonus__icon');
        for (const icon of icons) {
            const btn = icon.closest('button');
            if (btn) {
                button = btn;
                break;
            }
        }

        // Method 2: Look for button with the specific SVG path (gift box icon)
        if (!button) {
            const svgs = document.querySelectorAll('svg path[d*="M13 12h-2v2h2v-2"]');
            for (const svg of svgs) {
                const btn = svg.closest('button');
                if (btn) {
                    button = btn;
                    break;
                }
            }
        }

        if (!button) {
            hasClicked = false;
            return;
        }

        // Check if button is visible
        const isVisible = button.offsetParent !== null;

        if (isVisible && !hasClicked) {
            console.log('Bonus button found');
            hasClicked = true;

            setTimeout(() => {
                button.click();
                console.log('Bonus button clicked');
            }, 1000);
        }
    }

    // Check for the button every 2 seconds
    setInterval(findAndClickButton, 2000);

    // Also observe DOM changes for faster detection
    const observer = new MutationObserver(() => {
        findAndClickButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Twitch Auto Point Collector activated');
})();