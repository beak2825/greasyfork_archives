// ==UserScript==
// @name         AI Studio 增强器 - 自动启用谷歌搜索和 URL 上下文
// @name:en      AI Studio Enhancer - Auto-enable Google Search and URL Context
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AI Studio 增强脚本。可自动启用谷歌搜索和"URL 上下文"等功能。
// @description:en  A script to automatically enable features like Grounding and URL Context in AI Studio.
// @author       fleey
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548046/AI%20Studio%20%E5%A2%9E%E5%BC%BA%E5%99%A8%20-%20%E8%87%AA%E5%8A%A8%E5%90%AF%E7%94%A8%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%92%8C%20URL%20%E4%B8%8A%E4%B8%8B%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/548046/AI%20Studio%20%E5%A2%9E%E5%BC%BA%E5%99%A8%20-%20%E8%87%AA%E5%8A%A8%E5%90%AF%E7%94%A8%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E5%92%8C%20URL%20%E4%B8%8A%E4%B8%8B%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @class AIStudioEnhancer
     * @description Encapsulates all logic for observing and interacting with the AI Studio UI.
     * This class-based approach improves maintainability, scalability, and organization.
     */
    class AIStudioEnhancer {
        /**
         * The configuration for the enhancer script.
         * @private
         */
        config = {
            // Set to `false` to disable all console logs for a cleaner experience.
            DEBUG: true,
            // Debounce delay in milliseconds. Prevents excessive checks during rapid DOM changes.
            DEBOUNCE_DELAY: 150,
            // A collection of UI elements to target for automatic activation.
            // This structure makes it easy to add more targets in the future.
            TARGETS: [
                {
                    name: 'Grounding with Google Search',
                    selector: 'button[aria-label*="Grounding with Google Search"][aria-checked="false"]',
                },
                {
                    name: 'URL Context',
                    selector: 'button[aria-label*="url context"][aria-checked="false"]',
                },
            ],
        };

        /**
         * The MutationObserver instance watching for DOM changes.
         * @private
         */
        observer = null;
        
        /**
         * A debounced version of the `processTargets` method for performance optimization.
         * @private
         */
        debouncedProcessTargets;

        constructor() {
            this.debouncedProcessTargets = this.debounce(this.processTargets, this.config.DEBOUNCE_DELAY);
            this.log('Initializing...');
        }
        
        /**
         * A simple logger that respects the DEBUG flag.
         * @param {...any} args - Arguments to log.
         */
        log(...args) {
            if (this.config.DEBUG) {
                console.log('[AI Studio Enhancer] - ai_studio_enhancer_v4.js:70', ...args);
            }
        }

        /**
         * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
         * have elapsed since the last time the debounced function was invoked.
         * @param {Function} func The function to debounce.
         * @param {number} wait The number of milliseconds to delay.
         * @returns {Function} Returns the new debounced function.
         */
        debounce(func, wait) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
        
        /**
         * The core logic to find and click target buttons.
         * It iterates through configured targets and activates them if found.
         */
        processTargets() {
            this.log('Running target processing...');
            for (const target of this.config.TARGETS) {
                // Query the DOM for each specific target.
                const button = document.querySelector(target.selector);
                if (button) {
                    this.log(`Target found: "${target.name}". Attempting to enable...`);
                    button.click();
                    this.log(`Successfully enabled "${target.name}".`);
                }
            }
        }

        /**
         * The callback function for the MutationObserver.
         * This is optimized to only check relevant node additions.
         * @param {MutationRecord[]} mutationsList - A list of mutations that occurred.
         */
        handleMutations = (mutationsList) => {
            let relevantChangeDetected = false;
            for (const mutation of mutationsList) {
                // We are only interested in mutations where new nodes are added.
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // This is a crucial optimization:
                    // Instead of re-querying the whole document on any change,
                    // we check if the *newly added nodes* could contain our targets.
                    // A simple check is to see if any added node is an Element.
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                           relevantChangeDetected = true;
                           break;
                        }
                    }
                }
                if(relevantChangeDetected) break;
            }

            if(relevantChangeDetected) {
                this.log('Relevant DOM change detected. Debouncing target processing.');
                this.debouncedProcessTargets();
            }
        };

        /**
         * Starts the script by performing an initial check and setting up the observer.
         */
        start() {
            // Perform an initial check shortly after the script loads.
            // requestAnimationFrame is often smoother than a fixed setTimeout.
            requestAnimationFrame(() => this.processTargets());

            // Set up the observer to watch for dynamic content loading.
            this.observer = new MutationObserver(this.handleMutations);
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            this.log('Observer is now active. Waiting for DOM changes.');
        }

        /**
         * Disconnects the observer to clean up resources.
         */
        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.log('Observer disconnected.');
            }
        }
    }

    // --- SCRIPT EXECUTION ---
    const enhancer = new AIStudioEnhancer();
    enhancer.start();

})();