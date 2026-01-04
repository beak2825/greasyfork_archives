// ==UserScript==
// @name         Neopets Fishing Cooldown Timer
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Tracks and displays the time since the 'Reel In Your Line' button was last clicked.
// @author       Logan Bell
// @match        https://www.neopets.com/water/fishing.phtml
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558274/Neopets%20Fishing%20Cooldown%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/558274/Neopets%20Fishing%20Cooldown%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Key for storing the timestamp in Tampermonkey storage
    const LAST_CLICK_KEY = 'lastFishingClickTime';

    // Selectors for key elements
    // The form containing the button
    const FISHING_FORM_SELECTOR = 'form[action="/water/fishing.phtml"]';
    // The submit button itself
    const BUTTON_SELECTOR = FISHING_FORM_SELECTOR + ' input[type="submit"][value="Reel In Your Line"]';

    /**
     * Finds a suitable element (like the skill text) to place the timer after.
     * @returns {HTMLElement | null} The skill element, or null if not found.
     */
    function findSkillElement() {
        // Look for common HTML tags that contain the skill text
        const potentialElements = document.querySelectorAll('p, div, b, span');
        for (const element of potentialElements) {
            if (element.textContent && element.textContent.includes('Your current fishing skill is')) {
                return element;
            }
        }
        return null;
    }

    /**
     * Converts a time difference in milliseconds into a formatted string (D H M).
     * @param {number} ms - The time difference in milliseconds.
     * @returns {string} The formatted time string.
     */
    function formatTimeDifference(ms) {
        if (ms < 0) ms = 0;

        const totalSeconds = Math.floor(ms / 1000);
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

        return `${days}d, ${hours}h, ${minutes}m`;
    }

    /**
     * Renders the time since the last click onto the page.
     * @param {HTMLElement} placementAnchor - The element to insert the time display *after*.
     */
    function displayLastClickTime(placementAnchor) {
        const lastClickTime = GM_getValue(LAST_CLICK_KEY, 0);
        const now = Date.now();
        let displayHTML = '';
        let timeDiffMs = now - lastClickTime;

        if (lastClickTime === 0) {
            displayHTML = '<strong>First Time?</strong> Click the button below to start tracking!';
        } else {
            const timeDiffFormatted = formatTimeDifference(timeDiffMs);
            const oneDayMs = 24 * 60 * 60 * 1000;
            const statusClass = timeDiffMs >= oneDayMs ? 'cooldown-ready' : 'cooldown-waiting';

            let remainingText = '';
            if (timeDiffMs < oneDayMs) {
                const remainingMs = oneDayMs - timeDiffMs;
                const remainingFormatted = formatTimeDifference(remainingMs);
                remainingText = `<br>(${remainingFormatted} remaining)`;
            }

            displayHTML = `
                <span class="${statusClass}">
                    Last Fished:
                    <strong>${timeDiffFormatted} ago</strong>
                    ${remainingText}
                </span>
            `;
        }

        // Create or find the display element
        let timerDisplay = document.getElementById('fishingCooldownTimer');
        if (!timerDisplay) {
            timerDisplay = document.createElement('div');
            timerDisplay.id = 'fishingCooldownTimer';
            timerDisplay.style.cssText = 'font-size: 16px; margin: 10px 0; padding: 8px; border: 1px solid #000; background-color: #f7f7f7; text-align: center; color: black; font-weight: bold;';

            // Insert the timer *after* the anchor element
            placementAnchor.parentNode.insertBefore(timerDisplay, placementAnchor.nextSibling);
        }

        timerDisplay.innerHTML = displayHTML;

        // Apply specific color styles
        let style = document.getElementById('fishingCooldownStyles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'fishingCooldownStyles';
            style.textContent = `
                #fishingCooldownTimer .cooldown-ready { color: green; font-weight: bold; }
                #fishingCooldownTimer .cooldown-waiting { color: black; font-weight: bold; }
            `;
            document.head.appendChild(style);
        }

        // Update the time every second
        if (lastClickTime !== 0) {
            setTimeout(() => displayLastClickTime(placementAnchor), 1000);
        }
    }


    // --- Main Execution ---

    const reelInButton = document.querySelector(BUTTON_SELECTOR);
    const fishingForm = document.querySelector(FISHING_FORM_SELECTOR);
    const skillElement = findSkillElement();

    // 1. Determine the insertion point
    let insertionAnchor = null;

    if (skillElement) {
        // If the specific skill element is found, use it for perfect placement.
        insertionAnchor = skillElement;
    } else if (fishingForm) {
        // If the skill element is missing, use the entire <form> as the anchor.
        // The timer will be placed right after the form, which is still right above the button.
        insertionAnchor = fishingForm;
    } else if (reelInButton) {
        // Fallback: If for some reason we only find the button, use its parent container.
        insertionAnchor = reelInButton.parentNode;
    }

    if (insertionAnchor) {
        // 2. Attach the click handler to save the current time (must be on the button)
        if (reelInButton) {
            reelInButton.addEventListener('click', function() {
                GM_setValue(LAST_CLICK_KEY, Date.now());
                console.log('Fishing click timestamp saved.');
            });
        }

        // 3. Display the time since the last click
        displayLastClickTime(insertionAnchor);

    } else {
        console.warn('Kiko Lake Fishing Timer Script: Could not find a suitable placement anchor (Skill Text or Form). Timer will not display.');
    }

})();