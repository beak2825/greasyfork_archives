// ==UserScript==
// @name         Unlock "Ctrl+Left click" trick for downloadyoutubesubtitles.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Optimize subtitle download buttons to allow "Ctrl+Left click" trick
// @author       wujinjun
// @license      MIT
// @match        *://*.downloadyoutubesubtitles.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556294/Unlock%20%22Ctrl%2BLeft%20click%22%20trick%20for%20downloadyoutubesubtitlescom.user.js
// @updateURL https://update.greasyfork.org/scripts/556294/Unlock%20%22Ctrl%2BLeft%20click%22%20trick%20for%20downloadyoutubesubtitlescom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const VOLATILE_CONTAINER_SELECTOR = "#volatile_content"; // The top-level container to wait for
    const PARENT_SELECTOR = "#left_pane"; // The parent element containing the buttons
    const CLASS_TO_REMOVE = "volatile"; // The class token to remove from the buttons

    // List of child selectors to check within PARENT_SELECTOR (used to build precise queries)
    const CHILD_SELECTORS = [
        "", // For buttons directly under PARENT_SELECTOR
        //" > div:nth-child(2)",
        //" > div:nth-child(3)",
        // To match ALL div children, you can simplify the array and adjust the logic in applyOptimization
    ];
    // -------------

    /**
     * Executes the button link optimization logic and cleans up the class attribute.
     * @param {Node} targetNode - The DOM node to search for buttons within.
     */
    function applyOptimization(targetNode) {
        if (!targetNode || targetNode.nodeType !== 1) {
            return;
        }

        const leftPane = targetNode.matches(PARENT_SELECTOR) ? targetNode : targetNode.querySelector(PARENT_SELECTOR);

        if (!leftPane) {
            return;
        }

        let optimizationCount = 0;
        let cleanupCount = 0;

        CHILD_SELECTORS.forEach(child => {
            // Selector targets <a> elements that meet the href/data-href condition
            const fullSelector = `${child.trim() || ''} a[href="javascript:void(0)"][data-href]`;

            const buttons = leftPane.querySelectorAll(fullSelector);

            buttons.forEach(button => {
                if (leftPane.contains(button)) {

                    // 1. Link Optimization (if data-href exists)
                    const dataHref = button.getAttribute('data-href');
                    if (dataHref) {
                        button.setAttribute('href', dataHref);
                        optimizationCount++;
                    }

                    // 2. Class Cleanup
                    // Check if the class list contains the target class
                    if (button.classList.contains(CLASS_TO_REMOVE)) {
                        button.classList.remove(CLASS_TO_REMOVE);
                        cleanupCount++;
                    }
                }
            });
        });

        if (optimizationCount > 0 || cleanupCount > 0) {
            console.log(`[TM Dynamic] Optimized ${optimizationCount} link(s) and cleaned ${cleanupCount} class attribute(s).`);
        }
    }


    /**
     * MutationObserver callback for dynamic changes within the #volatile_content area.
     */
    const contentObserverCallback = function(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        applyOptimization(node);
                    }
                });
            }
        });
    };

    /**
     * MutationObserver callback dedicated to waiting for the #volatile_content to appear.
     */
    const startupObserverCallback = function(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches(VOLATILE_CONTAINER_SELECTOR)) {

                        // --- Step 1: Target found, disconnect the startup observer ---
                        console.log(`[TM Startup] Found container ${VOLATILE_CONTAINER_SELECTOR}, stopping startup observer...`);
                        observer.disconnect();

                        // --- Step 2: Perform initial optimization on existing content ---
                        const targetContainer = node;
                        console.log(`[TM Startup] Performing initial optimization and class cleanup...`);
                        applyOptimization(targetContainer);

                        // --- Step 3: Start dynamic content listener ---
                        console.log(`[TM Startup] Starting dynamic observer within ${VOLATILE_CONTAINER_SELECTOR}...`);
                        const contentObserver = new MutationObserver(contentObserverCallback);
                        const contentConfig = {
                            childList: true,
                            subtree: true
                        };
                        contentObserver.observe(targetContainer, contentConfig);
                    }
                });
            }
        });
    };

    // --- Startup Logic ---

    // 1. Check if #volatile_content already exists on page load
    const volatileContainer = document.querySelector(VOLATILE_CONTAINER_SELECTOR);

    if (volatileContainer) {
        // If the container exists, skip the waiting step and start listening immediately
        console.log(`[TM Startup] Container ${VOLATILE_CONTAINER_SELECTOR} already exists. Immediately starting optimization and listening...`);
        applyOptimization(volatileContainer);
        const contentObserver = new MutationObserver(contentObserverCallback);
        contentObserver.observe(volatileContainer, { childList: true, subtree: true });

    } else {
        // 2. If the container does not exist, start the startup Observer, listening on document.body
        console.log(`[TM Startup] Container ${VOLATILE_CONTAINER_SELECTOR} not found yet. Starting wait observer on document.body...`);
        const startupObserver = new MutationObserver(startupObserverCallback);
        const startupConfig = {
            childList: true,
            subtree: true
        };
        startupObserver.observe(document.body, startupConfig);
    }
})();
