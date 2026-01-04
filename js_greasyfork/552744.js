// ==UserScript==
// @name         Auto Expander
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically expands expandable entities. User specify target entity then automatically expand all entities that have same class with the user specified entity.
// @author       sh0510
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552744/Auto%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/552744/Auto%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Create and Style the Button ---

    // Create a button element that will trigger the recording mode.
    const recordButton = document.createElement('button');
    recordButton.id = 'tm-recorder-button'; // Give it a unique ID for styling.
    recordButton.textContent = '▶️ Record Click'; // Initial text.

    // Add CSS styles for the button using Tampermonkey's GM_addStyle function.
    // This keeps it fixed on the screen and looking clean.
    GM_addStyle(`
        #tm-recorder-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        #tm-recorder-button:hover {
            background-color: #0056b3;
        }
        #tm-recorder-button:disabled {
            background-color: #555;
            cursor: not-allowed;
        }
    `);

    // Add the button to the page's body.
    document.body.appendChild(recordButton);

    // --- 2. Define Core Functions ---

    /**
     * Resets the button and cursor to their initial state.
     */
    function resetToInitialState() {
        document.body.style.cursor = 'default';
        recordButton.textContent = '▶️ Record Click';
        recordButton.disabled = false;
        // Clean up the main event listener.
        document.removeEventListener('click', captureAndExpand, true);
    }

    /**
     * Main function: captures the click, learns the classes, and expands all similar elements.
     * @param {MouseEvent} e - The click event object.
     */
    function captureAndExpand(e) {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target;
        const classList = target.classList;

        if (classList.length === 0) {
            alert('The clicked element has no CSS classes to learn from.');
            resetToInitialState(); // Reset state on failure.
            return;
        }

        const selector = '.' + Array.from(classList).join('.');
        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) {
            alert('Could not find any other elements with the same classes.');
            resetToInitialState(); // Reset state on failure.
            return;
        }

        let count = 0;
        elements.forEach(el => {
            if (typeof el.click === 'function') {
                el.click();
                count++;
            }
        });

        alert(`${count} elements were expanded based on the selector:\n${selector}`);
        resetToInitialState(); // Reset state on success.
    }

    /**
     * Initiates the "capture mode" when the button is clicked.
     */
    function initiateCaptureMode() {
        // Update button to show it's in recording mode and disable it.
        recordButton.textContent = '...Recording (Click an element)';
        recordButton.disabled = true;

        // Change the mouse cursor to a crosshair to indicate the special mode.
        document.body.style.cursor = 'crosshair';

        // Add a global click listener to intercept the user's next click.
        document.addEventListener('click', captureAndExpand, true);
    }

    // --- 3. Attach the Event Listener ---

    // When the record button is clicked, start the capture mode.
    recordButton.addEventListener('click', initiateCaptureMode);

})();