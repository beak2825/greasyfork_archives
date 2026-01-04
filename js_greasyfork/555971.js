// ==UserScript==
// @name         Advanced Random Background Color
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Changes the background color of the body to a random color, shows a notification, and provides controls.
// @author       Maverick Johnson
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/555971/Advanced%20Random%20Background%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/555971/Advanced%20Random%20Background%20Color.meta.js
// ==/UserScript==

/*
 * This work is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/ or send a letter to
 * Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 *
 * You are free to:
 * - Share — copy and redistribute the material in any medium or format
 * - Adapt — remix, transform, and build upon the material
 *
 * Under the following terms:
 * - Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
 *   You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
 * - NonCommercial — You may not use the material for commercial purposes.
 * - ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions
 *   under the same license as the original.
 *
 * No additional restrictions — You may not apply legal terms or technological measures that legally restrict others
 * from doing anything the license permits.
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'advancedRandomBackgroundColor';
    const DEFAULT_BACKGROUND_COLOR = 'initial'; // Use 'initial' to revert to browser default or website's CSS

    // Function to generate a random hex color
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to apply the background color and show notification
    function applyBackgroundColor(color) {
        document.body.style.backgroundColor = color;
        showNotification(`Background Color: ${color.toUpperCase()}`);
        GM_setValue(STORAGE_KEY, color); // Save the color
    }

    // Function to show a temporary notification
    function showNotification(message) {
        let notification = document.getElementById('rbc-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'rbc-notification';
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.style.opacity = '1';

        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000); // Notification disappears after 3 seconds
    }

    // Function to reset the background color
    function resetBackgroundColor() {
        document.body.style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
        showNotification('Background Color Reset');
        GM_setValue(STORAGE_KEY, DEFAULT_BACKGROUND_COLOR); // Save the reset state
    }

    // Initialize UI controls
    function initializeUI() {
        GM_addStyle(`
            #rbc-controls {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.7);
                border-radius: 8px;
                padding: 10px;
                display: flex;
                gap: 10px;
                z-index: 99999;
                font-family: Arial, sans-serif;
            }
            #rbc-controls button {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s ease;
            }
            #rbc-controls button:hover {
                background-color: #45a049;
            }
            #rbc-controls button.reset {
                background-color: #f44336;
            }
            #rbc-controls button.reset:hover {
                background-color: #da190b;
            }
            #rbc-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 100000;
                font-family: Arial, sans-serif;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }
        `);

        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'rbc-controls';

        const changeButton = document.createElement('button');
        changeButton.textContent = 'Random Color';
        changeButton.addEventListener('click', () => applyBackgroundColor(getRandomColor()));
        controlsDiv.appendChild(changeButton);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Color';
        resetButton.classList.add('reset');
        resetButton.addEventListener('click', resetBackgroundColor);
        controlsDiv.appendChild(resetButton);

        document.body.appendChild(controlsDiv);
    }

    // Main execution
    function main() {
        const storedColor = GM_getValue(STORAGE_KEY, DEFAULT_BACKGROUND_COLOR);

        if (storedColor && storedColor !== DEFAULT_BACKGROUND_COLOR) {
            applyBackgroundColor(storedColor);
        } else {
            // Apply a random color on first load if no color is stored or it's default
            applyBackgroundColor(getRandomColor());
        }

        initializeUI();
    }

    // Run the main function when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();