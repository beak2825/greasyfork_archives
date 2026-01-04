// ==UserScript==
// @name         Google Search - Remove AI Overview
// @version      1.0.7
// @description  This removes the AI Overview section at the top of Google Search.
// @author       makewebsitesbetter
// @namespace    userscripts
// @icon         https://i.postimg.cc/3NMLffrh/greenbox.png
// @include      *://*.google.*/search?*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556287/Google%20Search%20-%20Remove%20AI%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/556287/Google%20Search%20-%20Remove%20AI%20Overview.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Configuration.
    const AI_OVERVIEW_TEXT = ['AI Overview']; // Text to look for in the headers.
    const AI_TAB_TEXT = 'AI Mode';
    const TARGET_TAB_TEXT = 'More';

    // Function to hide the AI Overview.
    function handleAiOverview(element) {
        // Look for H1 or H2 elements that contain the words 'AI Overview'.
        const header = element.querySelector('h1, h2');
        if (header && AI_OVERVIEW_TEXT.some(text => header.textContent.includes(text))) {
            // Find the closest main div container and hide it.
            const container = header.closest('div');
            if (container) {
                container.style.display = 'none';
                // Mark it as hidden so it doesn't get processed again, for better optimization.
                container.dataset.aiRemoved = 'true';
            }
        }
    }

    // Function to move the 'AI Mode' tab before the 'More' tab.
    function handleTabs(element) {
        // Look for the 'AI Mode' tab inside of the added element.
        // Check if the element itself is the tab, or if it contains it.
        let aiTab = null;
        if (element.role === 'listitem' && element.textContent.includes(AI_TAB_TEXT)) {
            aiTab = element;
        } else if (element.querySelector) {
            aiTab = element.querySelector(`div[role='listitem']`);
            if (aiTab && !aiTab.textContent.includes(AI_TAB_TEXT)) aiTab = null;
        }

        if (aiTab && !aiTab.dataset.aiMoved) {
            // Find the 'More' tab to insert the 'AI Mode' tab before it.
            // Search the entire document because 'More' might already be there.
            const allTabs = document.querySelectorAll("div[role='listitem']");
            let targetTab = null;

            for (const tab of allTabs) {
                if (tab.textContent.includes(TARGET_TAB_TEXT)) {
                    targetTab = tab;
                    break;
                }
            }

            if (targetTab) {
                targetTab.parentNode.insertBefore(aiTab, targetTab);
                aiTab.dataset.aiMoved = 'true';
            }
        }
    }

    // Main Observer Callback.
    const observerCallback = (mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) { // Ensure it is an element node and not text.
                    handleAiOverview(node);
                    handleTabs(node);
                }
            }
        }
    };

    // Start the observer.
    const observer = new MutationObserver(observerCallback);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Initial check in case the script runs after elements are already loaded.
    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('h1, h2').forEach(h => {
             if (AI_OVERVIEW_TEXT.some(text => h.textContent.includes(text))) {
                 const container = h.closest('div');
                 if (container) container.style.display = 'none';
             }
        });
    });

})();
