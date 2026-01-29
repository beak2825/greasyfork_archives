// ==UserScript==
// @name         Archive.org | Click All Reviews' "More..." Buttons
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.6
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Finds and clicks all buttons with the text "More...".
// @match        *://*.archive.org/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive.org
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564326/Archiveorg%20%7C%20Click%20All%20Reviews%27%20%22More%22%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/564326/Archiveorg%20%7C%20Click%20All%20Reviews%27%20%22More%22%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //================================================================================
    // CONFIGURATION - All settings, selectors, and values that might need to be changed.
    //================================================================================
    const MORE_BUTTON_SELECTOR = 'button.simple-link.more-btn';
    const LESS_BUTTON_SELECTOR = 'button.simple-link.less-btn';



    //================================================================================
    // HELPER FUNCTIONS - Reusable utility functions
    //================================================================================

    /**
     * Recursively searches for elements matching a selector, piercing through Shadow DOM.
     * @param {string} selector - The CSS selector to search for.
     * @param {Element|ShadowRoot} [root=document] - The root element to start the search from.
     * @returns {Element[]} - An array of found elements.
     */
    function deepQuerySelectorAll(selector, root = document) {
        let results = [];

        // 1. Query the current root
        const found = root.querySelectorAll(selector);
        found.forEach(el => results.push(el));

        // 2. Recursively search in all shadow roots within the current root
        const allElements = root.querySelectorAll('*');
        allElements.forEach(el => {
            if (el.shadowRoot) {
                results = results.concat(deepQuerySelectorAll(selector, el.shadowRoot));
            }
        });

        return results;
    }

    //================================================================================
    // CORE FUNCTIONS - Main business logic
    //================================================================================
    /**
     * Finds and clicks all "More..." buttons, including those in Shadow DOM.
     * @returns {number} - The number of buttons clicked.
     */
    function clickAllMoreButtons() {
        const buttons = deepQuerySelectorAll(MORE_BUTTON_SELECTOR);
        console.log(`[Userscript] Found ${buttons.length} "More..." button(s).`);

        let clickedCount = 0;
        buttons.forEach((button, index) => {
            if (button.textContent.trim() === 'More...') {
                console.log(`[Userscript] Clicking "More..." button #${index + 1}.`);
                button.click();
                clickedCount++;
            }
        });

        console.log(`[Userscript] Expanded ${clickedCount} reviews.`);
        return clickedCount;
    }

    /**
     * Finds and clicks all "...Less" buttons, including those in Shadow DOM.
     * @returns {number} - The number of buttons clicked.
     */
    function clickAllLessButtons() {
        const buttons = deepQuerySelectorAll(LESS_BUTTON_SELECTOR);
        console.log(`[Userscript] Found ${buttons.length} "...Less" button(s).`);

        let clickedCount = 0;
        buttons.forEach((button, index) => {
            if (button.textContent.trim() === '...Less') {
                console.log(`[Userscript] Clicking "...Less" button #${index + 1}.`);
                button.click();
                clickedCount++;
            }
        });

        console.log(`[Userscript] Collapsed ${clickedCount} reviews.`);
        return clickedCount;
    }

    /**
     * Toggles all reviews: expands if any "More..." exist, otherwise collapses.
     */
    function toggleAllReviews() {
        const moreButtons = deepQuerySelectorAll(MORE_BUTTON_SELECTOR).filter(
            btn => btn.textContent.trim() === 'More...'
        );

        if (moreButtons.length > 0) {
            clickAllMoreButtons();
        } else {
            clickAllLessButtons();
        }
    }

    /**
     * Creates and injects the UI elements onto the page.
     */
    function addTriggerButton() {
        // 1. Style the buttons using GM_addStyle for robustness
        GM_addStyle(`
            #archive-review-controls {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: row;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                border-radius: 8px;
                overflow: hidden;
            }

            #toggle-reviews-btn {
                padding: 8px 12px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                color: #e8e8e8;
                border: 1px solid #3a3a5c;
                border-right: none;
                border-radius: 8px 0 0 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.3;
                transition: all 0.2s ease;
                text-align: center;
            }

            #toggle-reviews-btn:hover {
                background: linear-gradient(135deg, #2a2a4e 0%, #1e2a4e 100%);
                border-color: #5a5a8c;
            }

            #toggle-reviews-btn:active {
                background: linear-gradient(135deg, #151525 0%, #101830 100%);
            }

            #kofi-support-link {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 36px;
                padding: 8px 0;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                color: #888;
                border: 1px solid #3a3a5c;
                border-left: 1px solid #3a3a5c;
                border-radius: 0 8px 8px 0;
                font-size: 14px;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            #kofi-support-link:hover {
                background: linear-gradient(135deg, #2a1a1a 0%, #2e1616 100%);
                color: #ff5f5f;
            }
        `);

        // 2. Create the container
        const container = document.createElement('div');
        container.id = 'archive-review-controls';

        // 3. Create the main toggle button
        const triggerButton = document.createElement('button');
        triggerButton.id = 'toggle-reviews-btn';
        triggerButton.innerHTML = '📖 Expand/Collapse<br>All Reviews';
        triggerButton.title = 'Expand or collapse all reviews';

        // 4. Add event listener
        triggerButton.addEventListener('click', toggleAllReviews);

        // 5. Create the Ko-Fi support link
        const supportLink = document.createElement('a');
        supportLink.id = 'kofi-support-link';
        supportLink.href = 'https://ko-fi.com/piknockyou';
        supportLink.target = '_blank';
        supportLink.rel = 'noopener noreferrer';
        supportLink.title = 'Support this script on Ko-Fi';
        supportLink.textContent = '☕';
        supportLink.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 6. Append elements
        container.appendChild(triggerButton);
        container.appendChild(supportLink);
        document.body.appendChild(container);
        console.log('[Userscript] Control panel added to page.');
    }


    //================================================================================
    // MAIN EXECUTION - Core logic of the script
    //================================================================================
    /**
     * The main entry point for the userscript.
     */
    function main() {
        console.log('Userscript "Archive.org Review Expander" started.');
        addTriggerButton();
    }

    // Run the main function.
    main();

})();