// ==UserScript==
// @name         LMS Playback Speed Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  .
// @match        https://lms.ump.edu.pl/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551785/LMS%20Playback%20Speed%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/551785/LMS%20Playback%20Speed%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET_BUTTON_ID = 'playback-speed';
    const TARGET_BUTTON_SELECTOR = `#${TARGET_BUTTON_ID}`;
    const SPEED_MENU_SELECTOR = 'ul[data-ref="playbackSpeedWrapper"]';

    const SPEED_MAPPING = {
        '0.25': { speed: 3, label: '3x' },
        '0.5': { speed: 4, label: '4x' },
        '0.75': { speed: 100, label: '100x' }
    };

    const CHECKMARK_SVG = `
        <div class="selected-icon" style="fill:rgb(0, 101, 164);">
          <svg width="12" height="9" viewBox="0 0 12 9">
            <path d="M10 0.3 L11.5 1.7 L4.3 8.9 L0 4.7 L1.4 3.2 L4.3 6.1 L10 0.3 Z" stroke="none"></path>
          </svg>
        </div>
    `;

    GM_addStyle(`
        ${TARGET_BUTTON_SELECTOR} {
            display: block !important;
            visibility: visible !important;
        }
    `);

    function replaceExistingSpeedOptions() {
        const speedWrapper = document.querySelector(SPEED_MENU_SELECTOR);

        if (!speedWrapper) {
            return;
        }

        if (speedWrapper.dataset.speedsReplaced === 'true') {
            return;
        }

        Object.keys(SPEED_MAPPING).forEach(oldSpeed => {
            const replacement = SPEED_MAPPING[oldSpeed];

            const existingChoice = speedWrapper.querySelector(`.menu-choice[data-speed="${oldSpeed}"]`);

            if (existingChoice) {
                existingChoice.setAttribute('data-speed', replacement.speed);

                const labelElement = existingChoice.querySelector('.label');
                if (labelElement) {
                    labelElement.textContent = replacement.label;
                }

                existingChoice.setAttribute('aria-label', replacement.label);

                console.log(`Tampermonkey: Replaced speed ${oldSpeed} with ${replacement.label}.`);
            }
        });

        speedWrapper.dataset.speedsReplaced = 'true';
    }

    function monitorElementVisibilityAndMenu() {

        let playbackSpeedElement = document.querySelector(TARGET_BUTTON_SELECTOR);
        const speedMenuElement = document.querySelector(SPEED_MENU_SELECTOR);

        if (playbackSpeedElement) {
            const styleObserver = new MutationObserver((mutationsList) => {
                let needsCorrection = false;

                mutationsList.forEach(mutation => {
                    if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                        needsCorrection = true;
                    }
                });

                if (needsCorrection) {
                    styleObserver.disconnect();
                    playbackSpeedElement.style.setProperty('display', 'block', 'important');
                    playbackSpeedElement.classList.remove('d-none', 'hidden', 'invisible');
                    styleObserver.observe(playbackSpeedElement, { attributes: true });
                }
            });

            styleObserver.observe(playbackSpeedElement, { attributes: true });
            playbackSpeedElement.style.setProperty('display', 'block', 'important');
            playbackSpeedElement.classList.remove('d-none', 'hidden', 'invisible');
        }

        if (speedMenuElement) {
            replaceExistingSpeedOptions();
        }

        const bodyObserver = new MutationObserver((mutationsList, observer) => {
            const buttonFound = document.querySelector(TARGET_BUTTON_SELECTOR);
            const menuFound = document.querySelector(SPEED_MENU_SELECTOR);

            if (buttonFound || menuFound) {

                if (menuFound) {
                    replaceExistingSpeedOptions();
                }

                if (buttonFound && !playbackSpeedElement) {
                    monitorElementVisibilityAndMenu();
                    playbackSpeedElement = buttonFound;
                }
            }
        });

        bodyObserver.observe(document.body, { childList: true, subtree: true });

        if (playbackSpeedElement) {
            console.log(`Tampermonkey: Persistent monitoring activated for '${TARGET_BUTTON_ID}'.`);
        }
    }

    monitorElementVisibilityAndMenu();

})();
