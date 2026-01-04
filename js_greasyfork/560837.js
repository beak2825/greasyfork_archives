// ==UserScript==
// @name         Gemini - Dynamic Tab Title
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @date         2025.12.17
// @description  Automatically updates the browser tab title to the name of the current conversation. Reliably handles new chats, switching, and page reloads.
// @author       Te55eract, JonathanLU, and Gemini
// @match        *://gemini.google.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/1/1d/Google_Gemini_icon_2025.svg
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560837/Gemini%20-%20Dynamic%20Tab%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/560837/Gemini%20-%20Dynamic%20Tab%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants ---
    // Selector for the active chat in the sidebar history
    const SELECTED_CHAT_ITEM_SELECTOR = 'div[data-test-id="conversation"].selected .conversation-title';
    // Regex to determine if we are currently inside a specific chat ID URL
    const CHAT_PAGE_REGEX = /^\/app\/[a-zA-Z0-9]+$/;
    // Polling settings (Gemini is an SPA, titles load asynchronously)
    const TITLE_POLL_MAX_ATTEMPTS = 50;
    const TITLE_POLL_INTERVAL_MS = 200;

    // --- Globals ---
    let originalDocTitle = 'Gemini';
    let activeTitlePollInterval = null;

    // --- Helper Functions ---

    // Check if the current URL path looks like a chat conversation
    function isChatPage() {
        return CHAT_PAGE_REGEX.test(location.pathname);
    }

    // Stop the currently running poll to prevent overlap
    function stopActiveTitlePoll() {
        if (activeTitlePollInterval) {
            clearInterval(activeTitlePollInterval);
            activeTitlePollInterval = null;
        }
    }

    // Main logic: Poll the DOM to find the sidebar title and update the tab
    function startNavigationPoll() {
        stopActiveTitlePoll();

        let pollAttempts = 0;
        let lastKnownTitle = '';

        activeTitlePollInterval = setInterval(() => {
            pollAttempts++;
            const selectedTitleElement = document.querySelector(SELECTED_CHAT_ITEM_SELECTOR);

            if (isChatPage() && selectedTitleElement) {
                const currentTitleText = selectedTitleElement.textContent.trim();

                // Only update if the title is valid and different from what we last saw
                if (currentTitleText && currentTitleText !== lastKnownTitle) {
                    lastKnownTitle = currentTitleText;
                    const newTitle = `${lastKnownTitle} - ${originalDocTitle}`;

                    if (document.title !== newTitle) {
                        document.title = newTitle;
                    }
                }
            }

            // Stop polling if we exceed attempts or leave the chat page
            if (pollAttempts >= TITLE_POLL_MAX_ATTEMPTS || !isChatPage()) {
                // If we left the chat page, ensure the title is reset to "Gemini"
                if (!isChatPage() && document.title !== originalDocTitle) {
                    document.title = originalDocTitle;
                }
                stopActiveTitlePoll();
            }
        }, TITLE_POLL_INTERVAL_MS);
    }

    // Watches for the initial page load to determine when to start polling
    function startInitialLoadWatcher() {
        stopActiveTitlePoll();
        activeTitlePollInterval = setInterval(() => {
            if (isChatPage()) {
                startNavigationPoll();
            }
        }, 500);
    }

    // Hooks into the History API (pushState/replaceState) to detect SPA navigation
    // This is required because Gemini changes URL without reloading the page
    function setupHistoryHookForTitle() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        const navigationEventHandler = () => {
            startNavigationPoll();
        };

        history.pushState = function(...args) {
            const result = originalPushState.apply(this, args);
            navigationEventHandler();
            return result;
        };

        history.replaceState = function(...args) {
            const result = originalReplaceState.apply(this, args);
            navigationEventHandler();
            return result;
        };

        window.addEventListener('popstate', () => navigationEventHandler());
    }

    // --- Initialization ---
    function initialize() {
        // Save the default title (usually "Gemini")
        originalDocTitle = document.title || 'Gemini';

        // Set up the listeners for navigation
        setupHistoryHookForTitle();

        // Determine immediate state
        if (isChatPage()) {
            startNavigationPoll();
        } else {
            startInitialLoadWatcher();
        }
    }

    initialize();
})();