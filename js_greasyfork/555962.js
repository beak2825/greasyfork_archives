// ==UserScript==
// @name         Gemini Thoughts-to-Input (Toggle + Auto-Click)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license MIT
// @description  Adds a toggle button to auto-click "Show thinking" and copy text to the chat input.
// @author       You
// @match        https://gemini.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/555962/Gemini%20Thoughts-to-Input%20%28Toggle%20%2B%20Auto-Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555962/Gemini%20Thoughts-to-Input%20%28Toggle%20%2B%20Auto-Click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- [ 1. CONFIGURATION ] ---
    
    const TOGGLE_STATE_KEY = 'geminiAutoThoughtsToggle';
    const CHAT_INPUT_SELECTOR = 'rich-textarea > div:first-of-type';
    const THOUGHTS_HEADER_SELECTOR = 'div.thoughts-header';
    const THOUGHTS_BUTTON_SELECTOR = 'button[data-test-id="thoughts-header-button"]';
    const THOUGHTS_CONTENT_CLASS = 'markdown-main-panel';

    // --- [ 2. HELPER FUNCTIONS ] ---

    function isToggleOn() {
        return GM_getValue(TOGGLE_STATE_KEY, false);
    }

    function setToggleState(isOn) {
        GM_setValue(TOGGLE_STATE_KEY, isOn);
    }

    function updateToggleButtonVisuals(button, isOn) {
        if (isOn) {
            button.innerText = 'Auto: ON';
            button.style.backgroundColor = '#34a853'; // Google Green
            button.style.color = 'white';
        } else {
            button.innerText = 'Auto: OFF';
            button.style.backgroundColor = '#5f6368'; // Google Grey
            button.style.color = 'white';
        }
    }

    /**
     * This function is called when "Show thinking" is clicked.
     * It handles the copy-pasting.
     */
    function handleThoughtsClick(event) {
        const button = event.currentTarget;
        
        setTimeout(() => {
            const thoughtsElement = button.closest('model-thoughts');
            if (!thoughtsElement) {
                console.error('Thoughts-to-Input: Could not find parent <model-thoughts> element.');
                return;
            }

            const contentPanel = thoughtsElement.querySelector(`.${THOUGHTS_CONTENT_CLASS}`);
            const chatInput = document.querySelector(CHAT_INPUT_SELECTOR);

            if (contentPanel && chatInput) {
                const thoughtsText = contentPanel.innerText;
                chatInput.innerText = thoughtsText;
                chatInput.focus();
                chatInput.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
            } else {
                if (!contentPanel) console.error(`Thoughts-to-Input: Could not find content panel with class: ${THOUGHTS_CONTENT_CLASS}`);
                if (!chatInput) console.error(`Thoughts-to-Input: Could not find chat input with selector: ${CHAT_INPUT_SELECTOR}`);
            }
        }, 300);
    }
    
    /**
     * Creates the new "Auto: ON/OFF" toggle button.
     */
    function createToggleButton(thoughtsButton) {
        const toggleButton = document.createElement('button');
        
        toggleButton.style.marginLeft = '8px';
        toggleButton.style.padding = '4px 8px';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '8px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontSize = '12px';
        toggleButton.style.fontWeight = '500';
        
        updateToggleButtonVisuals(toggleButton, isToggleOn());

        // --- THIS IS THE CORRECTED CLICK LOGIC ---
        toggleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const newState = !isToggleOn();
            setToggleState(newState);
            updateToggleButtonVisuals(toggleButton, newState);

            // If the user just turned the toggle ON, click the adjacent
            // "Show thinking" button *now*.
            if (newState) {
                thoughtsButton.click();
            }
        });
        // --- END CORRECTION ---

        return toggleButton;
    }

    /**
     * This function runs every time a new "Show thinking" header appears.
     */
    function processThoughtsHeader(headerElement) {
        if (headerElement.dataset.processed) return;
        headerElement.dataset.processed = 'true';

        const thoughtsButton = headerElement.querySelector(THOUGHTS_BUTTON_SELECTOR);
        if (!thoughtsButton) return;

        // 1. Add the main copy/paste listener to the "Show thinking" button
        thoughtsButton.addEventListener('click', handleThoughtsClick);

        // 2. Create our toggle button
        const toggleButton = createToggleButton(thoughtsButton);

        // 3. Add the toggle button to the page
        thoughtsButton.parentNode.insertBefore(toggleButton, thoughtsButton.nextSibling);

        // 4. Check toggle state on load and auto-click if ON
        if (isToggleOn()) {
            // Use a short delay to make sure the page is ready
            setTimeout(() => {
                thoughtsButton.click();
            }, 100);
        }
    }

    // --- [ 3. OBSERVER LOGIC ] ---

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.matches(THOUGHTS_HEADER_SELECTOR)) {
                        processThoughtsHeader(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll(THOUGHTS_HEADER_SELECTOR).forEach(processThoughtsHeader);
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll(THOUGHTS_HEADER_SELECTOR).forEach(processThoughtsHeader);

})();