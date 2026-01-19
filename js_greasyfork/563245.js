// ==UserScript==
// @name         ChatGPT Temp Chat Reload Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a reload page button at the end of ChatGPT responses on temporary chat pages
// @author       You
// @match        https://chatgpt.com/?temporary-chat=true
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563245/ChatGPT%20Temp%20Chat%20Reload%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/563245/ChatGPT%20Temp%20Chat%20Reload%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add reload button
    function addReloadButton(messageElement) {
        // Check if button already exists
        if (messageElement.querySelector('.reload-page-btn')) {
            return;
        }

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'margin-top: 12px; padding-top: 8px;';

        // Create reload button
        const reloadBtn = document.createElement('button');
        reloadBtn.className = 'reload-page-btn';
        reloadBtn.textContent = '🔄 Reload Page';
        reloadBtn.style.cssText = `
            background-color: #10a37f;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        `;

        // Hover effect
        reloadBtn.onmouseover = function() {
            this.style.backgroundColor = '#0d8c6d';
        };
        reloadBtn.onmouseout = function() {
            this.style.backgroundColor = '#10a37f';
        };

        // Click handler
        reloadBtn.onclick = function() {
            location.reload();
        };

        buttonContainer.appendChild(reloadBtn);
        messageElement.appendChild(buttonContainer);
    }

    // Function to find and process assistant messages
    function processMessages() {
        // Find all assistant message containers
        const messages = document.querySelectorAll('[data-message-author-role="assistant"]');

        messages.forEach(message => {
            // Check if this is a complete message (not streaming)
            const streamingIndicator = message.querySelector('[class*="result-streaming"]');
            if (!streamingIndicator) {
                addReloadButton(message);
            }
        });
    }

    // Initial processing
    setTimeout(processMessages, 1000);

    // Observer to watch for new messages
    const observer = new MutationObserver(function(mutations) {
        processMessages();
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Periodic check as fallback
    setInterval(processMessages, 2000);
})();