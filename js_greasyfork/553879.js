// ==UserScript==
// @name         Google AI Studio Width Fix
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sets style="max-width: 100%;" on some elements and unsets max-width on .chat-session-content.
// @author       Ȼaptain Jøhn “Søap” MacTavish
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553879/Google%20AI%20Studio%20Width%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/553879/Google%20AI%20Studio%20Width%20Fix.meta.js
// ==/UserScript==

(
    function()
    {
        'use strict';

        // Selector for elements to have max-width set to 100%.
        const setSelector = '.ng-star-inserted, .mat-mdc-tooltip-trigger.prompt-input-wrapper';
        // Selector for elements to have max-width unset.
        const unsetSelector = '.chat-session-content';

        /**
         * Applies 'max-width: 100%' to all matching elements.
         *
         * @param {Node} rootElement The element to search within.
         */
        const applySetStyles =
        (
            rootElement = document
        ) =>
        {
            const elements = rootElement.querySelectorAll(setSelector);
            elements.forEach
            (
                (element) =>
                {
                    if (element.style.maxWidth !== '100%')
                    {
                        element.style.maxWidth = '100%';
                    }
                }
            );
        };

        /**
         * Unsets 'max-width' (sets to 'none') on all matching elements.
         *
         * @param {Node} rootElement The element to search within.
         */
        const applyUnsetStyles =
        (
            rootElement = document
        ) =>
        {
            // The [_ngcontent-ng-{anything}] is a dynamic attribute, so we select by the static class.
            const elements = rootElement.querySelectorAll(unsetSelector);
            elements.forEach
            (
                (element) =>
                {
                    if (element.style.maxWidth !== 'none')
                    {
                        element.style.maxWidth = 'none';
                    }
                }
            );
        };

        /**
         * The callback function for the MutationObserver.
         * Applies styles to newly added nodes.
         *
         * @param {Array<MutationRecord>} mutationsList The list of mutations.
         * @param {MutationObserver} observer The observer instance.
         */
        const observerCallback =
        (
            mutationsList,
            observer
        ) =>
        {
            for (const mutation of mutationsList)
            {
                if (mutation.type === 'childList')
                {
                    mutation.addedNodes.forEach
                    (
                        (node) =>
                        {
                            // Ensure the node is an Element (nodeType 1)
                            if (node.nodeType === 1)
                            {
                                // Apply styles to the new node and its descendants
                                applySetStyles(node);
                                applyUnsetStyles(node);

                                // Check if the node itself matches the selectors
                                if (node.matches(setSelector))
                                {
                                    node.style.maxWidth = '100%';
                                }
                                if (node.matches(unsetSelector))
                                {
                                    node.style.maxWidth = 'none';
                                }
                            }
                        }
                    );
                }
            }
        };

        // --- Initialization ---

        // 1. Apply styles to elements present on initial load
        applySetStyles();
        applyUnsetStyles();

        // 2. Observe the DOM for dynamically added content
        const observer = new MutationObserver(observerCallback);
        const observerConfig =
        {
            childList: true,
            subtree: true
        };
        observer.observe(document.body, observerConfig);
    }
)();