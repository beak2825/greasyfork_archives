// ==UserScript==
// @name         Destiny.gg Chat - Hide New User Messages
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide chat messages from users with the "New User" flair because they aren't even considered
//               humans and don't deserve respect.
// @author       Torrniquet
// @match        https://destiny.gg/bigscreen
// @match        https://destiny.gg/embed/chat
// @match        https://www.destiny.gg/bigscreen
// @match        https://www.destiny.gg/embed/chat
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558237/Destinygg%20Chat%20-%20Hide%20New%20User%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/558237/Destinygg%20Chat%20-%20Hide%20New%20User%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the author of a message is a loser star name.
    function hasNewUserFlair(messageElement) {
        const flairElement = messageElement.querySelector('i[data-flair="flair58"].flair.flair58');
        return flairElement !== null;
    }

    // Hide a loser star name's message in the DOM.
    function hideMessage(messageElement) {
        messageElement.style.display = 'none';
    }

    // Process a single message in the DOM.
    function processMessage(messageElement) {
        if (hasNewUserFlair(messageElement)) {
            hideMessage(messageElement);
        }
    }

    // Process the messages already embedded in chat.
    function processExistingMessages(chatContainer) {
        // Common selectors for chat messages on destiny.gg
        const messageSelectors = [
            '.msg-chat',
            '.chat-line',
            '[class*="message"]',
            '[class*="msg"]'
        ];

        for (const selector of messageSelectors) {
            const messages = chatContainer.querySelectorAll(selector);
            if (messages.length > 0) {
                messages.forEach(processMessage);
                return selector; // Return the working selector
            }
        }
        return null;
    }

    // Initialize the chat polling observer.
    function initObserver() {
        // Search for the chat container element in the DOM.
        const chatSelectors = [
            '#chat-output-frame',
            '.chat-output',
            '#chat',
            '.chat-lines',
            '[class*="chat"]'
        ];

        let chatContainer = null;
        for (const selector of chatSelectors) {
            chatContainer = document.querySelector(selector);
            if (chatContainer) {
                console.log(`[New User Filter] Found chat container: ${selector}`);
                break;
            }
        }

        if (!chatContainer) {
            console.warn('[New User Filter] Chat container not found, retrying...');
            setTimeout(initObserver, 1000);
            return;
        }

        // Process the messages already embedded in chat.
        const workingSelector = processExistingMessages(chatContainer);
        console.log(`[New User Filter] Processed existing messages with selector: ${workingSelector}`);

        // Watch for new messages persistently.
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    // Check if the added node is an element
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Process the node itself
                        processMessage(node);

                        // Also check child elements in case messages are nested
                        const childMessages = node.querySelectorAll('[class*="msg"], [class*="message"], .chat-line');
                        childMessages.forEach(processMessage);
                    }
                });
            });
        });

        // Start the persistent chat observer.
        observer.observe(chatContainer, {
            childList: true,
            subtree: true
        });

        console.log('[New User Filter] Observer initialized and watching for new messages');
    }

    // Wait until DOM is initialized fully.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initObserver);
    } else {
        initObserver();
    }
})();