// ==UserScript==
// @name         DeepSeek Conversation Search
// @namespace    http://fiverr.com/web_coder_nsd
// @version      1.2
// @description  Search and click DeepSeek conversations by URL parameter with loading delay
// @author       Noushad Bhuiyan
// @match        https://chat.deepseek.com/*
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/DeepSeek-icon.svg/1200px-DeepSeek-icon.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552158/DeepSeek%20Conversation%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/552158/DeepSeek%20Conversation%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function searchAndClickConversation() {
        // Get search parameter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');

        if (!searchTerm) {
            console.log('No search parameter found in URL');
            return;
        }

        console.log('Searching for conversation:', searchTerm);

        // Wait 3 seconds for DOM to properly load
        setTimeout(() => {
            // Find the scroll area container
            const scrollArea = document.querySelector('.ds-scroll-area');
            if (!scrollArea) {
                console.log('Scroll area not found after 3 seconds');
                return;
            }

            // Find all conversation links within the scroll area
            const conversationLinks = scrollArea.querySelectorAll('a[href*="/a/chat/s/"]');

            if (conversationLinks.length === 0) {
                console.log('No conversation links found in scroll area');
                return;
            }

            console.log(`Found ${conversationLinks.length} conversation links`);

            // Search for matching conversation
            let foundConversation = null;

            for (const link of conversationLinks) {
                // Find the conversation title element
                const titleElement = link.querySelector('.c08e6e93');

                if (titleElement && titleElement.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                    foundConversation = link;
                    break;
                }
            }

            if (foundConversation) {
                console.log('Found matching conversation:', foundConversation.querySelector('.c08e6e93').textContent);
                // Click the conversation
                foundConversation.click();
                console.log('Clicked on conversation');
            } else {
                console.log('No matching conversation found for:', searchTerm);
                // Log available conversation titles for debugging
                console.log('Available conversations:');
                conversationLinks.forEach(link => {
                    const title = link.querySelector('.c08e6e93');
                    if (title) {
                        console.log('-', title.textContent);
                    }
                });
            }
        }, 3000); // 3 second delay
    }

    // Wait for page to load and then search
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', searchAndClickConversation);
    } else {
        // If DOM is already loaded, search immediately (with delay)
        searchAndClickConversation();
    }

    // Also search when URL changes (for SPA navigation)
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            // Wait 3 seconds after URL change to ensure content is loaded
            setTimeout(searchAndClickConversation, 3000);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();