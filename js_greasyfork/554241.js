// ==UserScript==
// @name         Stack Protect
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Overlays a configurable element to prevent accidental clicks, with a persistent toggle.
// @author       Your Name
// @match        https://www.torn.com/gym.php
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/554241/Stack%20Protect.user.js
// @updateURL https://update.greasyfork.org/scripts/554241/Stack%20Protect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const TARGET_ELEMENT_SELECTOR = '#gymroot';
    const LOCAL_STORAGE_KEY = 'elementLockerState_v1_stackProtect';
    const ENABLE_LOGGING = false; // Set to false to disable all console logs from this script.
    // --- END CONFIGURATION ---

    // --- UTILITIES ---
    const log = (...args) => {
        if (ENABLE_LOGGING) console.log('[Stack Protect]', ...args);
    };
    const warn = (...args) => {
        if (ENABLE_LOGGING) console.warn('[Stack Protect]', ...args);
    };

    log('Script starting...');

    // Apply styles for the overlay and toggle button using Tampermonkey's GM_addStyle
    GM_addStyle(`
        .element-locker-overlay {
            position: absolute;
            background-color: rgba(255, 0, 0, 0.4);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99998;
            border-radius: 8px;
            box-sizing: border-box;
            border: 2px dashed rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(2px);
            pointer-events: all; /* This is crucial to block clicks */
            transition: opacity 0.2s ease-in-out;
        }

        .element-locker-toggle-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: background-color 0.2s ease;
        }

        .element-locker-toggle-button:hover {
            background-color: #0056b3;
        }

        .element-locker-toggle-button.is-unlocked {
             background-color: #28a745;
        }

        .element-locker-toggle-button.is-unlocked:hover {
            background-color: #218838;
        }
    `);

    function initializeLocker() {
        log('Initializing locker...');
        const targetElement = document.querySelector(TARGET_ELEMENT_SELECTOR);

        if (!targetElement) {
            // This should not happen if waitForElement works correctly, but it's a good safeguard.
            warn(`Target element with selector "${TARGET_ELEMENT_SELECTOR}" not found on this page.`);
            return;
        }
        log(`Found target element:`, targetElement);

        // Create the overlay div
        const overlay = document.createElement('div');
        overlay.textContent = 'LOCKED';
        overlay.className = 'element-locker-overlay';
        document.body.appendChild(overlay);

        // Create the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'element-locker-toggle-button';
        document.body.appendChild(toggleButton);
        log('Overlay and toggle button added to the DOM.');


        // Function to update the overlay's position and size to match the target
        const repositionOverlay = () => {
            if (!document.body.contains(targetElement)) {
                // Target element was removed from DOM, clean up.
                warn('Target element removed from DOM. Cleaning up.');
                cleanup();
                return;
            }
            const rect = targetElement.getBoundingClientRect();
            overlay.style.top = `${rect.top + window.scrollY}px`;
            overlay.style.left = `${rect.left + window.scrollX}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;
            log('Overlay repositioned to:', rect);
        };

        // Function to update the UI based on the lock state
        const setLockState = (isLocked) => {
            log(`Setting lock state to: ${isLocked ? 'LOCKED' : 'UNLOCKED'}`);
            if (isLocked) {
                overlay.style.display = 'flex';
                toggleButton.textContent = 'Unlock Element';
                toggleButton.classList.remove('is-unlocked');
                repositionOverlay();
            } else {
                overlay.style.display = 'none';
                toggleButton.textContent = 'Lock Element';
                toggleButton.classList.add('is-unlocked');
            }
        };

        // Event listener for the toggle button
        toggleButton.addEventListener('click', () => {
            const currentState = GM_getValue(LOCAL_STORAGE_KEY, true);
            const newState = !currentState;
            log(`Toggle button clicked. Current state: ${currentState}, New state: ${newState}`);
            GM_setValue(LOCAL_STORAGE_KEY, newState);
            setLockState(newState);
        });

        // Use ResizeObserver to automatically reposition the overlay if the target element or page layout changes
        const observer = new ResizeObserver(repositionOverlay);
        observer.observe(targetElement);
        observer.observe(document.body);
        log('ResizeObserver attached to target and body.');


        // Function to clean up when the script is disabled or the element is removed
        const cleanup = () => {
             log('Cleaning up: removing observers and elements.');
             observer.disconnect();
             if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
             if (toggleButton.parentNode) toggleButton.parentNode.removeChild(toggleButton);
        };

        // Initial setup
        const initialState = GM_getValue(LOCAL_STORAGE_KEY, true); // Default to locked
        log(`Initial state loaded from storage: ${initialState ? 'LOCKED' : 'UNLOCKED'}`);
        setLockState(initialState);
    }

    /**
     * Waits for an element to appear in the DOM and then executes a callback.
     * @param {string} selector - The CSS selector of the element to wait for.
     * @param {function} callback - The function to execute once the element is found.
     */
    function waitForElement(selector, callback) {
        log(`Waiting for element "${selector}" to appear...`);
        // Check if the element already exists
        if (document.querySelector(selector)) {
            log('Element found immediately.');
            callback();
            return;
        }

        // If not, wait for it to be added to the DOM
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(selector)) {
                log('Element found after a DOM mutation.');
                obs.disconnect(); // Stop observing once found
                callback();
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Wait for the target element to appear on the page, then run the main function.
    waitForElement(TARGET_ELEMENT_SELECTOR, initializeLocker);

})();
