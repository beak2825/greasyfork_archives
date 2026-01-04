// ==UserScript==
// @name         Google AI Studio | Clear Chat Button
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.8
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Automates clicking chat turn options and delete buttons in Gemini.
// @match        https://aistudio.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/548206/Google%20AI%20Studio%20%7C%20Clear%20Chat%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548206/Google%20AI%20Studio%20%7C%20Clear%20Chat%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Exit if running in an iframe to avoid duplicate script execution
    if (window.self !== window.top) {
        console.log('[Gemini Chat Cleaner] Exiting script in iframe.');
        return;
    }

    console.log('[Gemini Chat Cleaner] Script loaded and starting...');
    console.log('[Gemini Chat Cleaner] Current URL:', window.location.href);

    //================================================================================
    // CONFIGURATION - All settings, selectors, and values that might need to be changed.
    //================================================================================
    const CHAT_TURN_OPTIONS_SELECTOR = 'ms-chat-turn-options span[class="material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted"]';
    const DELETE_BUTTON_MENU_SELECTOR = 'div.mat-mdc-menu-content > button:first-of-type';
    const DELETE_BUTTON_TEXT = "delete Delete";

    //================================================================================
    // STYLES - CSS for the toolbar button (minimal, uses existing toolbar styles)
    //================================================================================
    GM_addStyle(`
        #gemini-cleaner-button {
            margin: 0 4px;
            color: red !important;
        }

        /* Custom tooltip - Material Design style */
        .gcc-tooltip {
            position: fixed;
            background: #303134;
            border: 1px solid #5f6368;
            border-radius: 4px;
            padding: 6px 10px;
            font-family: 'Google Sans', Roboto, sans-serif;
            font-size: 11px;
            font-weight: 500;
            color: #e8eaed;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            pointer-events: none;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.1s ease, visibility 0.1s ease;
            white-space: pre-line;
            text-align: center;
            line-height: 1.4;
            max-width: 250px;
        }

        .gcc-tooltip.visible {
            opacity: 1;
            visibility: visible;
        }

        /* Tooltip arrow positioning */
        .gcc-tooltip::before,
        .gcc-tooltip::after {
            content: '';
            position: absolute;
            left: var(--gcc-arrow-left, 50%);
            transform: translateX(-50%);
            width: 0;
            height: 0;
        }

        /* Tooltip ABOVE button -> arrow points DOWN */
        .gcc-tooltip.pos-top::before {
            bottom: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #5f6368;
        }
        .gcc-tooltip.pos-top::after {
            bottom: -5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #303134;
        }

        /* Tooltip BELOW button -> arrow points UP */
        .gcc-tooltip.pos-bottom::before {
            top: -6px;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid #5f6368;
        }
        .gcc-tooltip.pos-bottom::after {
            top: -5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #303134;
        }
    `);

    //================================================================================
    // TOOLTIP
    //================================================================================

    let gccTooltip = null;
    let tooltipOwner = null;

    function getTooltip() {
        if (gccTooltip && document.body.contains(gccTooltip)) {
            return gccTooltip;
        }
        gccTooltip = document.createElement('div');
        gccTooltip.className = 'gcc-tooltip';
        document.body.appendChild(gccTooltip);
        return gccTooltip;
    }

    function showTooltip(btn, message) {
        if (tooltipOwner && tooltipOwner !== btn) {
            hideTooltip(tooltipOwner);
        }

        const tooltip = getTooltip();
        tooltip.textContent = message;
        tooltipOwner = btn;

        tooltip.classList.remove('pos-top', 'pos-bottom');

        const btnRect = btn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;

        tooltip.style.display = 'block';
        tooltip.style.visibility = 'hidden';
        tooltip.classList.remove('visible');

        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        const MARGIN = 8;
        const GAP = 12;

        let left = btnCenterX - (tooltipWidth / 2);
        left = Math.max(MARGIN, Math.min(window.innerWidth - tooltipWidth - MARGIN, left));

        const topCandidate = btnRect.top - tooltipHeight - GAP;
        const bottomCandidate = btnRect.bottom + GAP;

        let top;
        let placement;

        if (topCandidate >= MARGIN) {
            top = topCandidate;
            placement = 'pos-top';
        } else {
            top = bottomCandidate;
            placement = 'pos-bottom';
        }

        tooltip.classList.add(placement);

        const arrowX = btnCenterX - left;
        const arrowClamped = Math.max(10, Math.min(tooltipWidth - 10, arrowX));
        tooltip.style.setProperty('--gcc-arrow-left', `${arrowClamped}px`);

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        tooltip.style.visibility = '';
        tooltip.offsetHeight;
        tooltip.classList.add('visible');
    }

    function hideTooltip(owner = null) {
        if (owner && tooltipOwner && owner !== tooltipOwner) return;
        if (gccTooltip) {
            gccTooltip.classList.remove('visible');
        }
        tooltipOwner = null;
    }

    //================================================================================
    // HELPER FUNCTIONS - Reusable utility functions
    //================================================================================

    /**
     * Clicks all elements matching a given CSS selector.
     * @param {string} selector The CSS selector for the elements to click.
     */
    function clickAllElements(selector) {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`[Gemini Chat Cleaner] No elements found for selector: ${selector}`);
                return;
            }
            elements.forEach(element => {
                element.click();
            });
            console.log(`[Gemini Chat Cleaner] Clicked ${elements.length} elements for selector: ${selector}`);
        } catch (error) {
            console.error(`[Gemini Chat Cleaner] Error clicking elements for selector ${selector}:`, error);
        }
    }

    /**
     * Clicks delete buttons within a menu content, identified by specific text.
     * @param {string} selector The CSS selector for the menu buttons.
     * @param {string} text The text content to match for the delete button.
     */
    function clickDeleteButtonsInMenu(selector, text) {
        try {
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                console.warn(`[Gemini Chat Cleaner] No menu elements found for selector: ${selector}`);
                return;
            }
            elements.forEach(element => {
                if (element.textContent.trim() === text) {
                    element.click();
                    console.log(`[Gemini Chat Cleaner] Clicked delete button with text: "${text}"`);
                }
            });
        } catch (error) {
            console.error(`[Gemini Chat Cleaner] Error clicking delete buttons in menu for selector ${selector}:`, error);
        }
    }

    /**
     * Creates and appends a floating button to trigger the cleaning functionality.
     */
    function createToolbarButton(toolbarRight = document.querySelector('ms-toolbar .toolbar-right')) {

        // If the toolbar isn't ready, or the button already exists, do nothing.
        if (!toolbarRight || document.getElementById('gemini-cleaner-button')) {
            return;
        }

        console.log('[Gemini Chat Cleaner] Toolbar found, creating button...');

        const button = document.createElement('button');
        button.id = 'gemini-cleaner-button';
        button.setAttribute('ms-button', '');
        button.setAttribute('variant', 'icon-borderless');
        button.setAttribute('iconname', 'refresh');
        button.className = 'mat-mdc-tooltip-trigger ms-button-borderless ms-button-icon ng-star-inserted';
        button.setAttribute('aria-label', 'Clear Chat Turns');
        button.setAttribute('aria-disabled', 'false');
        button.addEventListener('click', main);

        button.addEventListener('mouseenter', () => {
            showTooltip(button, 'Clear Chat Turns');
        });

        button.addEventListener('mouseleave', () => {
            hideTooltip(button);
        });

        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined notranslate ms-button-icon-symbol ng-star-inserted';
        iconSpan.setAttribute('aria-hidden', 'true');
        iconSpan.textContent = 'refresh';

        button.appendChild(iconSpan);

        const moreButton = toolbarRight.querySelector('button[iconname="more_vert"]');
        if (moreButton) {
            toolbarRight.insertBefore(button, moreButton);
            console.log('[Gemini Chat Cleaner] Button inserted before more_vert button.');
        } else {
            toolbarRight.appendChild(button);
            console.log('[Gemini Chat Cleaner] Button appended to toolbar.');
        }

        // Verify button is in DOM
        setTimeout(() => {
            if (document.getElementById('gemini-cleaner-button')) {
                console.log('[Gemini Chat Cleaner] Button successfully added to toolbar.');
            } else {
                console.error('[Gemini Chat Cleaner] Button not found in toolbar after append.');
            }
        }, 100);
    }

    //================================================================================
    // MAIN EXECUTION - Core logic of the script
    //================================================================================
    function main() {
        console.log('[Gemini Chat Cleaner] Main function triggered');
        // Click all chat turn option icons
        clickAllElements(CHAT_TURN_OPTIONS_SELECTOR);

        // Click delete buttons in menu content
        clickDeleteButtonsInMenu(DELETE_BUTTON_MENU_SELECTOR, DELETE_BUTTON_TEXT);
    }

    // --- MutationObserver to watch for toolbar changes ---
    const observer = new MutationObserver(() => {
        // If our button already exists, nothing to do.
        if (document.getElementById('gemini-cleaner-button')) return;

        const toolbarRight = document.querySelector('ms-toolbar .toolbar-right');
        if (toolbarRight) {
            createToolbarButton(toolbarRight);
        }
    });

    // --- Initial Execution ---
    function initialize() {
        // Try to add the button immediately in case the toolbar is already there.
        createToolbarButton();

        // Start observing the body for changes.
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[Gemini Chat Cleaner] MutationObserver started.');
    }

    initialize();

})();