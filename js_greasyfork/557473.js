// ==UserScript==
// @name         Gemini Fast/Thinking Toggle
// @namespace    http://gemini.google.com/
// @version      1.1
// @description  Replaces the Gemini model dropdown with a quick toggle slider, styled for Dark Mode
// @author       owhs
// @match        https://gemini.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557473/Gemini%20FastThinking%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/557473/Gemini%20FastThinking%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SELECTORS = {
        container: '.model-picker-container',
        triggerButton: 'div[data-test-id="bard-mode-menu-button"] button',
        triggerLabel: '.input-area-switch-label span',
        menuOverlay: '.cdk-overlay-container',
        optionFast: 'button[data-test-id="bard-mode-option-fast"]',
        optionThinking: 'button[data-test-id^="bard-mode-option-thinking"]'
    };

    // Using the specific colors provided in the prompt for a perfect match
    const STYLES = `
        /* HIDE the original overlay menu so it doesn't flash when switching */
        .cdk-overlay-container .gds-mode-switch-menu {
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .gemini-toggle-wrapper {
            display: flex;
            align-items: center;
            margin-left: 12px;
            font-family: "Google Sans", sans-serif;
            font-size: 13px;
            font-weight: 500;

            /* Pill styling to match the "Canvas" or "Visual Layout" chips */
            background-color: #1e1f20; /* --bard-color-skeleton-loader-background-1 */
            border: 1px solid #37393b; /* --bard-color-neutral-90 */
            border-radius: 100px;
            padding: 4px 12px;
            height: 32px;
            box-sizing: border-box;
            transition: border-color 0.2s;
        }

        .gemini-toggle-wrapper:hover {
            border-color: #5c5f5e; /* --bard-color-bot-logo-border-default */
            background-color: #2a2a2a; /* Slightly lighter on hover */
        }

        /* Hide the original button */
        .model-picker-container button.input-area-switch {
            display: none !important;
        }

        .gt-switch {
            position: relative;
            display: inline-block;
            width: 32px;
            height: 18px;
            margin: 0 10px;
        }

        .gt-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* The Slider Background */
        .gt-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #444746; /* Inactive Grey */
            -webkit-transition: .3s;
            transition: .3s;
            border-radius: 34px;
        }

        /* The Knob */
        .gt-slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 12px;
            left: 3px;
            bottom: 3px;
            background-color: #e3e3e3; /* --bard-color-on-new-conversation-button */
            -webkit-transition: .3s;
            transition: .3s;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        /* Active State (Thinking) */
        input:checked + .gt-slider {
            background-color: #a8c7fa; /* --bard-color-share-link (Google Blue/Lilac) */
        }

        input:checked + .gt-slider:before {
            -webkit-transform: translateX(14px);
            -ms-transform: translateX(14px);
            transform: translateX(14px);
            background-color: #0e0e0f; /* --bard-color-neutral-96 (Dark text on light bg) */
        }

        /* Focus rings for accessibility */
        input:focus + .gt-slider {
            box-shadow: 0 0 0 2px rgba(168, 199, 250, 0.3);
        }

        /* Labels */
        .gt-label {
            cursor: pointer;
            user-select: none;
            color: #80868b; /* --bard-color-sentence-words-color (Inactive text) */
            transition: color 0.2s;
            letter-spacing: 0.2px;
        }

        .gt-label.active {
            color: #e3e3e3; /* --bard-color-get-app-banner-text (Active White/Grey) */
            font-weight: 500;
        }

        /* Sparkle/Icon placeholder for Thinking (Optional visual flare) */
        .gt-label.active.thinking-label {
            background: linear-gradient(90deg, #4285f4, #9b72cb); /* Brand gradient */
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
        }
    `;

    // --- Utilities ---

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    function waitForElement(selector, root = document) {
        return new Promise(resolve => {
            if (root.querySelector(selector)) {
                return resolve(root.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (root.querySelector(selector)) {
                    observer.disconnect();
                    resolve(root.querySelector(selector));
                }
            });
            observer.observe(root, { childList: true, subtree: true });
        });
    }

    // --- Core Logic ---

    async function performSwitch(targetMode) {
        const triggerBtn = document.querySelector(SELECTORS.triggerButton);
        if (!triggerBtn) return;

        triggerBtn.click(); // Opens the menu (now hidden by CSS)

        const overlayContainer = await waitForElement(SELECTORS.menuOverlay, document.body);
        const selector = targetMode === 'thinking' ? SELECTORS.optionThinking : SELECTORS.optionFast;
        const targetOption = await waitForElement(selector, overlayContainer);

        if (targetOption) {
            targetOption.click();
            console.log(`Gemini Toggle: Switched to ${targetMode}`);
        } else {
            // Cleanup if something goes wrong
            triggerBtn.click();
        }
    }

    function createToggleUI(container) {
        if (container.querySelector('.gemini-toggle-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'gemini-toggle-wrapper';

        const labelFast = document.createElement('span');
        labelFast.className = 'gt-label';
        labelFast.textContent = 'Fast';

        const labelSwitch = document.createElement('label');
        labelSwitch.className = 'gt-switch';

        const input = document.createElement('input');
        input.type = 'checkbox';

        const slider = document.createElement('span');
        slider.className = 'gt-slider';

        const labelThink = document.createElement('span');
        labelThink.className = 'gt-label thinking-label'; // Added class for gradient text
        labelThink.textContent = 'Thinking';
        labelThink.textContent = 'Thinking';

        labelSwitch.appendChild(input);
        labelSwitch.appendChild(slider);

        wrapper.appendChild(labelFast);
        wrapper.appendChild(labelSwitch);
        wrapper.appendChild(labelThink);

        // State Sync
        const currentLabel = container.querySelector(SELECTORS.triggerLabel);
        let isThinking = false;
        if (currentLabel) {
            const text = currentLabel.innerText.toLowerCase();
            if (text.includes('thinking')) isThinking = true;
        }

        input.checked = isThinking;
        updateLabelStyles(isThinking, labelFast, labelThink);

        // Listeners
        input.addEventListener('change', (e) => {
            const newStateIsThinking = e.target.checked;
            updateLabelStyles(newStateIsThinking, labelFast, labelThink);
            performSwitch(newStateIsThinking ? 'thinking' : 'fast');
        });

        labelFast.addEventListener('click', () => {
            if(input.checked) {
                input.checked = false;
                input.dispatchEvent(new Event('change'));
            }
        });

        labelThink.addEventListener('click', () => {
            if(!input.checked) {
                input.checked = true;
                input.dispatchEvent(new Event('change'));
            }
        });

        // External Change Observer
        const obs = new MutationObserver(() => {
            const freshLabel = container.querySelector(SELECTORS.triggerLabel);
            if(freshLabel) {
                const text = freshLabel.innerText.toLowerCase();
                const domIsThinking = text.includes('thinking');
                if (domIsThinking !== input.checked) {
                    input.checked = domIsThinking;
                    updateLabelStyles(domIsThinking, labelFast, labelThink);
                }
            }
        });

        const labelEl = container.querySelector('.logo-pill-label-container') || container;
        obs.observe(labelEl, { subtree: true, characterData: true, childList: true });

        // Insert
        const switcher = container.querySelector('bard-mode-switcher');
        if (switcher) {
            switcher.appendChild(wrapper);
        } else {
            container.appendChild(wrapper);
        }
    }

    function updateLabelStyles(isThinking, labelFast, labelThink) {
        if (isThinking) {
            labelThink.classList.add('active');
            labelFast.classList.remove('active');
        } else {
            labelFast.classList.add('active');
            labelThink.classList.remove('active');
        }
    }

    // --- Init ---

    function init() {
        addStyles();
        const observer = new MutationObserver((mutations) => {
            const container = document.querySelector(SELECTORS.container);
            if (container) {
                if (!container.querySelector('.gemini-toggle-wrapper')) {
                    createToggleUI(container);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();

})();