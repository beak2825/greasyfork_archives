// ==UserScript==
// @name         Reddit Subreddit Top All Time Button (XPath Fixed)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a button on subreddit pages to quickly navigate to the "Top - All Time" posts. Uses MutationObserver to wait for the target element.
// @author       Gemini (via Google)
// @match        https://www.reddit.com/r/*
// @match        https://new.reddit.com/r/*
// @match        https://old.reddit.com/r/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559078/Reddit%20Subreddit%20Top%20All%20Time%20Button%20%28XPath%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559078/Reddit%20Subreddit%20Top%20All%20Time%20Button%20%28XPath%20Fixed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Target XPath provided by the user (the container for the sort/view options)
    const TARGET_XPATH = '/html/body/shreddit-app/div[3]/div/div[2]/main/div[1]/shreddit-async-loader/div';
    const BUTTON_ID = 'top-all-time-button';

    /**
     * Finds an element using an XPath expression.
     * @param {string} path - The XPath expression.
     * @returns {Element | null} The found element or null.
     */
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    /**
     * Extracts the subreddit name from the current URL.
     * @returns {string | null} The subreddit name or null if not on a subreddit page.
     */
    function getSubredditName() {
        // Regex to capture the subreddit name, ensuring we are not on a /comments/ page.
        const path = window.location.pathname;
        if (path.includes('/comments/')) {
            return null;
        }
        const match = path.match(/\/r\/([^/]+)/);
        return match ? match[1] : null;
    }

    /**
     * Creates and injects the "Top All Time" button into the target container.
     * @param {Element} targetElement - The container where the button should be placed.
     */
    function createAndInjectButton(targetElement) {
        const subredditName = getSubredditName();
        if (!subredditName) return;

        // Check if the button already exists to prevent duplicates
        if (document.getElementById(BUTTON_ID)) {
             document.getElementById(BUTTON_ID).querySelector('a').href = `${window.location.origin}/r/${subredditName}/top/?t=all`;
             return;
        }

        const topAllTimeUrl = `${window.location.origin}/r/${subredditName}/top/?t=all`;

        // --- Create Button Elements ---
        const buttonWrapper = document.createElement('div');
        buttonWrapper.id = BUTTON_ID;
        buttonWrapper.className = 'subreddit-top-all-time-wrapper'; // Use a class for easier styling if needed

        const buttonLink = document.createElement('a');
        buttonLink.href = topAllTimeUrl;
        buttonLink.textContent = '🏆 Top All Time';

        // --- Styling for the New UI ---
        // This styling tries to mimic the look of the 'Best'/'New'/'Top' filter buttons
        buttonLink.style.cssText = `
            display: flex;
            align-items: center;
            height: 32px; /* Match filter button height */
            padding: 0 12px;
            background-color: #FF4500; /* Reddit Orange/Red */
            color: white !important;
            border-radius: 9999px; /* Pill shape */
            font-size: 14px;
            font-weight: 700;
            text-decoration: none !important;
            margin-left: 8px; /* Spacing from adjacent elements */
            transition: background-color 0.1s ease;
        `;

        buttonLink.onmouseover = function() {
            this.style.backgroundColor = '#E53E00'; // Darker red on hover
        };
        buttonLink.onmouseout = function() {
            this.style.backgroundColor = '#FF4500';
        };

        buttonWrapper.appendChild(buttonLink);

        // --- Injection ---
        // Insert the new button *before* the first element in the container (often the sort dropdown)
        if (targetElement.firstChild) {
            targetElement.insertBefore(buttonWrapper, targetElement.firstChild);
        } else {
            targetElement.appendChild(buttonWrapper);
        }
    }

    /**
     * Core function to find the target and run the injection.
     */
    function initializeButtonLogic() {
        const targetElement = getElementByXpath(TARGET_XPATH);

        if (targetElement) {
            // Found the element, now inject the button
            createAndInjectButton(targetElement);
            return true; // Indicate success
        }
        return false; // Indicate failure
    }

    // --- Main Execution Logic (The Watcher) ---

    // We need to continuously observe the body because:
    // 1. The script runs before <shreddit-app> is rendered.
    // 2. Reddit is an SPA (Single-Page Application) and navigating to a different subreddit won't cause a full page reload.

    let observer;

    const observerCallback = (mutations, obs) => {
        // Run the injection logic. If it succeeds, the element has been found.
        if (initializeButtonLogic()) {
            // Successfully injected the button on the initial load.
            // We can stop this specific observer, but need a new one for SPA navigation.
            if (observer) {
                observer.disconnect();
                // Start the URL watcher for SPA navigation
                startUrlWatcher();
            }
        }
    };

    // Use a robust observer to wait for the target element to be created.
    observer = new MutationObserver(observerCallback);

    // Start observing the main body for any changes (subtree is important for dynamic loading)
    observer.observe(document.body, { childList: true, subtree: true });

    // --- SPA Navigation Watcher (Handles subreddit-to-subreddit changes) ---
    function startUrlWatcher() {
        let lastUrl = window.location.href;
        const urlObserver = new MutationObserver(() => {
            const currentUrl = window.location.href;
            const subredditName = getSubredditName();
            // Only trigger if the URL actually changed AND we are on a subreddit page
            if (currentUrl !== lastUrl && subredditName) {
                lastUrl = currentUrl;
                // Give the elements a brief moment to load before re-injecting
                setTimeout(() => {
                    const targetElement = getElementByXpath(TARGET_XPATH);
                    if (targetElement) {
                        createAndInjectButton(targetElement);
                    }
                }, 300);
            }
        });
        // Watch a stable element (like the body) for changes indicative of a page update
        urlObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Attempt the initial run immediately in case the elements were fast to load
    if (!initializeButtonLogic()) {
        // If the element wasn't immediately found, the MutationObserver will handle it.
    }
})();