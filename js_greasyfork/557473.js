// ==UserScript==
// @name         Gemini Sexy 3-Way Power Switcher
// @namespace    http://gemini.google.com/
// @version      3.5
// @description  Sexy & modern model switcher
// @author       owhs
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557473/Gemini%20Sexy%203-Way%20Power%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/557473/Gemini%20Sexy%203-Way%20Power%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    //              CONFIGURATION
    // ==========================================

    const PREFERRED_MODEL = 'pro';
    const ENABLE_AUTO_DEFAULT = true;

    const MODES = {
        'fast': { label: 'Fast', icon: '⚡', color: '#00D1FF', testId: 'bard-mode-option-fast', keywords: ['fast'] },
        'thinking': { label: 'Thinking', icon: '🧠', color: '#7000FF', testId: 'bard-mode-option-thinking', keywords: ['thinking', 'reasoning'] },
        'pro': { label: 'Pro', icon: '💎', color: '#FFAB00', testId: 'bard-mode-option-pro', keywords: ['pro', 'advanced'] }
    };

    const SELECTORS = {
        triggerBtn: 'div[data-test-id="bard-mode-menu-button"]',
        originalLabel: '.input-area-switch-label',
        menuOverlay: '.cdk-overlay-container'
    };

    // ==========================================
    //            THE STYLING ENGINE
    // ==========================================

    const ITEM_WIDTH = 90; // Pixels. Hard coded to prevent squashing.

    const CSS = `
        /* 1. HIDE MENU FLASHES */
        .cdk-overlay-pane:has(.gds-mode-switch-menu),
        .cdk-overlay-container:has(.gds-mode-switch-menu) {
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        /* 2. HIDE ORIGINAL COMPONENT */
        bard-mode-switcher {
            display: none !important;
        }

        /* 3. SEXY SEGMENTED CONTROL */
        #gemini-sexy-wrapper {
            display: inline-flex;
            align-items: center;
            padding: 4px;
            background: rgba(240, 244, 249, 0.7);
            backdrop-filter: blur(12px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            margin-right: 16px;
            vertical-align: middle;
            font-family: "Google Sans", "Product Sans", Roboto, Helvetica, Arial, sans-serif !important;
            /* CRITICAL FIX: Prevent container from being squashed by flex parent */
            flex-shrink: 0;
            min-width: fit-content;
        }

        body.dark-theme #gemini-sexy-wrapper,
        [data-theme="dark"] #gemini-sexy-wrapper {
            background: rgba(30, 31, 32, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }

        .sexy-control {
            display: flex;
            position: relative;
            /* Explicit width = 3 items * 90px */
            width: ${ITEM_WIDTH * 3}px;
        }

        .sexy-slider {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: ${ITEM_WIDTH}px;
            border-radius: 20px;
            transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 1;
        }

        /* Fixed Pixel Transforms */
        [data-selected="fast"] .sexy-slider { transform: translateX(0px); background: #00D1FF; box-shadow: 0 0 15px rgba(0, 209, 255, 0.3); }
        [data-selected="thinking"] .sexy-slider { transform: translateX(${ITEM_WIDTH}px); background: #7000FF; box-shadow: 0 0 15px rgba(112, 0, 255, 0.3); }
        [data-selected="pro"] .sexy-slider { transform: translateX(${ITEM_WIDTH * 2}px); background: #FFAB00; box-shadow: 0 0 15px rgba(255, 171, 0, 0.3); }

        .sexy-item {
            position: relative;
            z-index: 2;
            /* CRITICAL FIX: Force width, disable shrinking */
            width: ${ITEM_WIDTH}px;
            min-width: ${ITEM_WIDTH}px;
            flex: 0 0 ${ITEM_WIDTH}px;

            height: 28px;
            user-select:none;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            letter-spacing: 0.2px;
            color: #444746;
            transition: color 0.3s ease;
            border-radius: 20px;
            white-space: nowrap;
        }

        body.dark-theme .sexy-item,
        [data-theme="dark"] .sexy-item { color: #c4c7c5; }

        .sexy-item.active {
            color: #FFFFFF !important;
            font-weight: 600;
        }

        .sexy-icon {
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .sexy-label {
            line-height: 1;
        }

        .sexy-item:not(.active):hover {
            background: rgba(0,0,0,0.04);
        }

        body.dark-theme .sexy-item:not(.active):hover {
            background: rgba(255,255,255,0.05);
        }
    `;

    GM_addStyle(CSS);

    // ==========================================
    //               THE ENGINE
    // ==========================================

    let hasAutoSwitched = false;

    function waitForElement(selector) {
        return new Promise(resolve => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const target = document.querySelector(selector);
                if (target) { observer.disconnect(); resolve(target); }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    function getCurrentModeFromUI() {
        const labelEl = document.querySelector(SELECTORS.originalLabel);
        if (!labelEl) return null;
        const text = labelEl.innerText.toLowerCase();
        for (const [key, config] of Object.entries(MODES)) {
            if (config.keywords.some(k => text.includes(k))) return key;
        }
        return 'fast';
    }

    async function performSwitch(targetModeKey) {
        const trigger = document.querySelector(SELECTORS.triggerBtn);
        if (!trigger) return;

        trigger.click();
        await waitForElement(SELECTORS.menuOverlay);
        const targetTestId = MODES[targetModeKey].testId;

        let attempts = 0;
        const interval = setInterval(() => {
            const btn = document.querySelector(`button[data-test-id="${targetTestId}"]`);
            if (btn) {
                btn.click();
                clearInterval(interval);
                setTimeout(() => document.body.click(), 50);
            } else if (++attempts > 30) {
                clearInterval(interval);
                document.body.click();
            }
        }, 30);
    }

    function createSexyUI(initialMode) {
        const wrapper = document.createElement('div');
        wrapper.id = 'gemini-sexy-wrapper';
        const control = document.createElement('div');
        control.className = 'sexy-control';
        control.dataset.selected = initialMode;

        const slider = document.createElement('div');
        slider.className = 'sexy-slider';
        control.appendChild(slider);

        Object.keys(MODES).forEach(modeKey => {
            const mode = MODES[modeKey];
            const item = document.createElement('div');
            item.className = `sexy-item ${modeKey === initialMode ? 'active' : ''}`;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'sexy-icon';
            iconSpan.textContent = mode.icon;

            const labelSpan = document.createElement('span');
            labelSpan.className = 'sexy-label';
            labelSpan.textContent = mode.label;

            item.appendChild(iconSpan);
            item.appendChild(labelSpan);

            item.onclick = async (e) => {
                e.preventDefault(); e.stopPropagation();
                if (control.dataset.selected === modeKey) return;
                control.dataset.selected = modeKey;
                control.querySelectorAll('.sexy-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                await performSwitch(modeKey);
            };
            control.appendChild(item);
        });
        wrapper.appendChild(control);
        return wrapper;
    }

    function init() {
        const observer = new MutationObserver(() => {
            const triggerBtn = document.querySelector(SELECTORS.triggerBtn);
            const wrapper = document.getElementById('gemini-sexy-wrapper');

            if (triggerBtn && !wrapper) {
                const switcher = triggerBtn.closest('bard-mode-switcher');
                if (switcher && switcher.parentElement) {
                    const parent = switcher.parentElement;
                    const currentMode = getCurrentModeFromUI() || 'fast';
                    const sexyUI = createSexyUI(currentMode);
                    parent.insertBefore(sexyUI, parent.firstChild);

                    if (ENABLE_AUTO_DEFAULT && PREFERRED_MODEL && !hasAutoSwitched) {
                        hasAutoSwitched = true;
                        setTimeout(() => {
                            if (getCurrentModeFromUI() !== PREFERRED_MODEL) {
                                const target = sexyUI.querySelectorAll('.sexy-item')[Object.keys(MODES).indexOf(PREFERRED_MODEL)];
                                if (target) target.click();
                            }
                        }, 500);
                    }
                }
            }

            if (wrapper) {
                const currentRealMode = getCurrentModeFromUI();
                const control = wrapper.querySelector('.sexy-control');
                if (currentRealMode && control.dataset.selected !== currentRealMode) {
                    control.dataset.selected = currentRealMode;
                    control.querySelectorAll('.sexy-item').forEach((item, idx) => {
                         item.classList.toggle('active', Object.keys(MODES)[idx] === currentRealMode);
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();