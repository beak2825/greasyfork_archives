// ==UserScript==
// @name         YouTube Auto-Click Gemini Ask + Summarize
// @namespace    https://yourdomain.example
// @version      2.0
// @description  Auto-clicks the Gemini Ask button, then auto-clicks "Summarize the video" when the panel loads
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559990/YouTube%20Auto-Click%20Gemini%20Ask%20%2B%20Summarize.user.js
// @updateURL https://update.greasyfork.org/scripts/559990/YouTube%20Auto-Click%20Gemini%20Ask%20%2B%20Summarize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility: wait for an element to appear
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;

            const check = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(check);
                    resolve(el);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(check);
                    reject("Timeout waiting for: " + selector);
                }
            }, interval);
        });
    }

    // Step 1: Click the Ask button
    async function clickAskButton() {
        try {
            const selector = 'button[aria-label="Ask"]';
            const askButton = await waitForElement(selector);

            if (!askButton.dataset.clicked) {
                askButton.dataset.clicked = "true";
                console.log("Auto-clicking Gemini Ask button…");
                askButton.click();

                // After Ask is clicked, begin waiting for the panel
                waitForPanelAndSummarize();
            }
        } catch (e) {
            console.warn(e);
        }
    }

    // Step 2: Wait for the Gemini panel to expand, then click "Summarize the video"
    async function waitForPanelAndSummarize() {
        try {
            // Wait for the engagement panel to expand
            const panelSelector =
                'ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"][visibility="ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"]';

            console.log("Waiting for Gemini panel to expand…");
            await waitForElement(panelSelector, 15000);

            // Step 3: Click the "Summarize the video" chip
            const summarizeSelector =
                'button.ytwYouChatChipsDataChip:not([data-disabled="true"])';

            console.log("Waiting for 'Summarize the video' chip…");
            const summarizeButton = await waitForElement(summarizeSelector, 15000);

            if (!summarizeButton.dataset.clicked) {
                summarizeButton.dataset.clicked = "true";
                console.log("Auto-clicking 'Summarize the video'…");
                summarizeButton.click();
            }
        } catch (e) {
            console.warn("Panel or summarize chip not found:", e);
        }
    }

    // Handle YouTube SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            clickAskButton();
        }
    }).observe(document, { subtree: true, childList: true });

    // Initial load
    clickAskButton();
})();