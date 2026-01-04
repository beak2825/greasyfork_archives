// ==UserScript==
// @name         Roleplay Indentation Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the left indentation (margin/padding) from specific message elements to make them flush left.
// @author       anechointhedark
// @match        https://www.aiuncensored.info/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552686/Roleplay%20Indentation%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/552686/Roleplay%20Indentation%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION: You will likely need to adjust these two lines. ---

    // 1. **MAIN CHAT CONTAINER:**
    // This selector should point to the main <div> or container that holds ALL the messages.
    // If you don't know it, 'body' is a safe but less efficient default.
    // *Example better options:* '#chat-history', '.message-list', or '[role="log"]'
    const CONTAINER_SELECTOR = 'body'; 

    // 2. **MESSAGE ELEMENT SELECTOR:**
    // This selector targets the element that actually contains the text you want to fix (usually a <p> or <div>).
    // *Example better options:* 'p', 'div.message-content', '.text-block'
    const POTENTIAL_MESSAGE_SELECTOR = 'p, div'; 

    // --- END CONFIGURATION ---

    // This class is created by the script and forces the margin/padding to zero.
    const FIX_CLASS = 'gemini-indentation-fix'; 

    // Inject CSS to override the site's original indentation styles.
    // We use !important to ensure this fix takes priority.
    GM_addStyle(`
        .${FIX_CLASS} {
            margin-left: 0px !important;
            padding-left: 0px !important;
            /* You can add more styles here if needed, like text-indent: 0 !important; */
        }
    `);

    /**
     * Checks if an element is indented (based on a heuristic) and applies the fix class.
     * @param {Node} targetNode The node (or its children) to check.
     */
    function applyIndentationFix(targetNode) {
        // We use querySelectorAll on the node itself if it matches, or its children.
        const potentialMessages = targetNode.matches(POTENTIAL_MESSAGE_SELECTOR) 
            ? [targetNode] 
            : targetNode.querySelectorAll(POTENTIAL_MESSAGE_SELECTOR);
        
        potentialMessages.forEach(el => {
            // Skip elements that are already flush (or are not visible)
            if (el.classList.contains(FIX_CLASS) || el.offsetHeight === 0) return;
            
            // Get computed styles for the element to check for indentation
            const style = window.getComputedStyle(el);
            
            const marginLeft = parseFloat(style.marginLeft);
            const paddingLeft = parseFloat(style.paddingLeft);
            
            // HEURISTIC CHECK: If the element has a left margin or padding greater than 20 pixels,
            // we assume it is the indented block we want to fix.
            if (marginLeft > 20 || paddingLeft > 20) {
                el.classList.add(FIX_CLASS);
                console.log('Indentation Fix Applied to:', el);
            }
        });
    }

    // Set up the MutationObserver to watch for new content (messages) being added
    function setupObserver() {
        const targetNode = document.querySelector(CONTAINER_SELECTOR);

        if (!targetNode) {
            console.error('Indentation Remover: Could not find the container element. Retrying in 1s...');
            setTimeout(setupObserver, 1000);
            return;
        }

        // 1. Apply fix to existing content on initial load
        applyIndentationFix(targetNode);

        // 2. Watch for future changes (new messages being added)
        const observer = new MutationObserver((mutationsList, observer) => {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // When new nodes are added (a new message is sent)
                    mutation.addedNodes.forEach(node => {
                        // Check the node and its subtree for indented elements
                        if (node.nodeType === 1) { // Element node
                            applyIndentationFix(node);
                        }
                    });
                }
            }
        });

        // Watch for direct children changes and changes in the entire subtree
        const config = { childList: true, subtree: true };
        observer.observe(targetNode, config);
        console.log('Indentation Remover: MutationObserver initialized.');
    }

    // Start the setup after the whole page loads
    window.addEventListener('load', setupObserver);

})();
