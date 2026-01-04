// ==UserScript==
// @name         XJTLU utalk tweaks (Low-End Device Optimizer)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes animations, hot threads, and legal confirm when clicking reply button on utalk.xjtlu.edu.cn for better performance.
// @author       wujinjun
// @license      MIT
// @match        *://utalk.xjtlu.edu.cn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558935/XJTLU%20utalk%20tweaks%20%28Low-End%20Device%20Optimizer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558935/XJTLU%20utalk%20tweaks%20%28Low-End%20Device%20Optimizer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Optimization Functions ---

    /**
     * 1. Auto detect and remove animations in real-time.
     * @param {Node} targetNode The node to check for animation classes.
     */
    function removeAnimations(targetNode) {
        // Selector 1: Matches "el-loading-mask" or anything ending in "-loading-mask"
        const loadingMaskSelectors = [
            '.el-loading-mask',
            '[class*="-loading-mask"]',
            '.loader-box'
        ].join(', ');

        targetNode.querySelectorAll(loadingMaskSelectors).forEach(el => {
            if (el.style.display !== 'none') {
                // Remove the element or hide it completely
                console.log('Optimizer: Removing/Hiding animation element:', el);
                el.style.display = 'none';
                // Optional: For absolute removal
                // el.remove();
            }
        });
    }

    /**
     * 2. Remove hot thread view in real-time: <div class="post-right"> -> <div class="top10">
     * This targets the inner "top10" element within "post-right" to remove the hot thread content.
     */
    function removeHotThreads() {
        // Find all containers that might hold the hot thread view
        document.querySelectorAll('.post-right').forEach(postRightContainer => {
            // Find the specific hot thread element inside the container
            const top10 = postRightContainer.querySelector('.top10');
            if (top10 && top10.parentNode) {
                console.log('Optimizer: Removing hot thread view:', top10);
                // Remove the hot thread element to save resources
                top10.parentNode.removeChild(top10);
            }
        });
    }

    /**
     * 3. Auto click confirm button in legal confirm popup when replying.
      "请自觉遵守中华人民共和国宪法和法律法规，严格把控回帖内容，不得发布法律法规和国家有关规定禁止的信息内容。"
     */
    function clickAdSkipButton() {
        const skipButtonSelector = 'body > div.el-overlay.is-message-box > div > div > div.el-message-box__btns > button.el-button.el-button--primary';
        const skipButton = document.querySelector(skipButtonSelector);

        if (skipButton) {
            console.log('Optimizer: Clicking advertisement skip button.');
            // Use .click() to simulate a user click
            skipButton.click();
            return true; // Return true if clicked
        }
        return false; // Return false if not found
    }

    // --- Main Logic: Applying Optimizations ---

    /**
     * The main function to run all optimizations on page load and during DOM changes.
     * @param {Node} targetNode The node where changes occurred (or the initial document body).
     */
    function applyOptimizations(targetNode) {
        // Optimization 1: Remove animations immediately
        removeAnimations(targetNode);

        // Optimization 2: Remove hot threads (run less frequently, maybe only on initial load or a specific area)
        // We run this on every change for completeness, but could be optimized if necessary.
        removeHotThreads();

        // Optimization 3: Click the ad skip button (usually a one-time action)
        // This is called on every change because the ad message box is usually added dynamically.
        clickAdSkipButton();
    }


    // --- Setup MutationObserver for Real-Time Detection ---

    // Configuration for the observer: watch for child additions/removals and attribute changes
    const config = { childList: true, subtree: true, attributes: false };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Iterate over all added nodes and apply optimizations to them
                mutation.addedNodes.forEach(node => {
                    // Only process element nodes (type 1)
                    if (node.nodeType === 1) {
                        applyOptimizations(node);
                    }
                });
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node (the entire document body) for configured mutations
    // The script waits until the DOM is loaded before starting the observer.
    window.addEventListener('load', () => {
        const targetNode = document.body;
        if (targetNode) {
            console.log('Optimizer: Initializing MutationObserver.');
            observer.observe(targetNode, config);

            // Run optimizations once on initial load as well
            applyOptimizations(targetNode);
        }
    });

})();
