// ==UserScript==
// @name         Gemini Model Switcher Buttons
// @description  Replaces Gemini model selection dropdown with easily accessible buttons
// @namespace    http://tampermonkey.net/
// @version      1.8
// @author       treescandal & Gemini 3.0 Pro
// @match        https://gemini.google.com/*
// @license      MIT
// @grant        none
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/564251/Gemini%20Model%20Switcher%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/564251/Gemini%20Model%20Switcher%20Buttons.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // ============ CONFIGURATION  ============
// Replace the labels if you want. 
// The emojis are needed for the buttons to be clickable at all times.

    const MODE_CONFIG = {
        modes: [
            { icon: '⚡', label: 'Flash', index: 0 },
            { icon: '🧠', label: 'Think', index: 1 },
            { icon: '✨', label: 'Pro', index: 2 }
        ],
        containerSelector: '.leading-actions-wrapper',
        checkInterval: 1000,
        compactBreakpoint: 620
    };

    // ============ STYLES ============

    const styles = `
        #gemini-quick-switch-bar {
            display: flex;
            gap: 6px;
            align-items: center;
            margin-left: auto;
            margin-right: 8px;
            height: 40px;
            z-index: 999;
        }

        .gqs-btn {
            background: rgba(0,0,0,0.05);
            border: 1px solid transparent;
            border-radius: 100px;
            padding: 0 14px 0 10px;
            height: 32px;
            font-size: 13px;
            font-weight: 500;
            color: #444746;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .gqs-btn:hover {
            background: rgba(0,0,0,0.1);
        }

        .gqs-btn.active {
            background: #c2e7ff;
            color: #001d35;
        }

        .gqs-btn.compact {
            padding: 0 8px;
            min-width: 32px;
            justify-content: center;
        }

        .gqs-btn.compact .gqs-label {
            display: none;
        }

        .gqs-btn .gqs-icon {
            font-size: 16px;
            line-height: 1;
        }

        .gqs-btn .gqs-label {
            font-size: 13px;
        }

        @media (prefers-color-scheme: dark) {
            .gqs-btn { background: rgba(255,255,255,0.1); color: #e3e3e3; }
            .gqs-btn:hover { background: rgba(255,255,255,0.2); }
            .gqs-btn.active { background: #004a77; color: #c2e7ff; }
        }

        .model-picker-container {
            width: 0 !important;
            height: 0 !important;
            opacity: 0 !important;
            overflow: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
        }

        .gds-mode-switch-menu {
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        .cdk-overlay-pane:has(> .gds-mode-switch-menu),
        .cdk-overlay-pane:has(> * > .gds-mode-switch-menu) {
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        .mat-bottom-sheet-container.gds-mode-switch-menu,
        .mat-bottom-sheet-container:has(.gds-mode-switch-menu) {
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        .mat-bottom-sheet-container:has([data-test-id^="bard-mode-option"]) {
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        .cdk-overlay-backdrop {
            transition: none !important;
        }

        .cdk-overlay-container:has(.gds-mode-switch-menu) .cdk-overlay-backdrop,
        .cdk-overlay-container:has([data-test-id^="bard-mode-option"]) .cdk-overlay-backdrop {
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
        }

        @supports not (selector(:has(*))) {
            .gds-mode-switch-menu * {
                opacity: 0 !important;
                pointer-events: none !important;
            }
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;

    if (document.head.firstChild) {
        document.head.insertBefore(styleSheet, document.head.firstChild);
    } else {
        document.head.appendChild(styleSheet);
    }

// ============ MENU TRIGGER DETECTION ============

    function findMenuTrigger() {
        let trigger = document.querySelector('[data-test-id*="mode-menu"]');
        if (trigger) return { element: trigger, strategy: 'test-id' };

        const candidates = Array.from(document.querySelectorAll('button[aria-haspopup="true"]'));

        trigger = candidates.find(btn => {
            const rect = btn.getBoundingClientRect();
            const isBottom = rect.bottom > window.innerHeight - 200;
            const hasRelevantContent = btn.querySelector('svg') ||
                                      btn.className.includes('model') ||
                                      btn.className.includes('mode');
            return isBottom && hasRelevantContent;
        });

        if (trigger) return { element: trigger, strategy: 'aria-haspopup' };

        const structureMatch = Array.from(document.querySelectorAll('button')).find(btn => {
            const hasChevron = btn.querySelector('svg[viewBox*="24"]');
            const rect = btn.getBoundingClientRect();
            const isBottom = rect.bottom > window.innerHeight - 200;
            return hasChevron && isBottom;
        });

        if (structureMatch) return { element: structureMatch, strategy: 'structure' };

        return null;
    }

    // ============ MENU ITEMS DETECTION ============

    function findMenuItems() {
        const menuSelectors = [
            '[data-test-id^="bard-mode-option"]',
            '.gds-mode-switch-menu [role="menuitem"]',
            '.mat-bottom-sheet-container [role="menuitem"]',
            '[role="menu"] [role="menuitem"]',
            '[role="listbox"] [role="option"]',
        ];

        for (const selector of menuSelectors) {
            const items = Array.from(document.querySelectorAll(selector));
            if (items.length >= 2) {
                return items;
            }
        }

        const overlays = Array.from(document.querySelectorAll('.cdk-overlay-pane'));
        for (const overlay of overlays) {
            const rect = overlay.getBoundingClientRect();
            if (rect.height > 0) {
                const buttons = Array.from(overlay.querySelectorAll('button, [role="menuitem"], [role="option"]'));
                const validItems = buttons.filter(btn => {
                    const text = btn.innerText?.trim();
                    const btnRect = btn.getBoundingClientRect();
                    return text && text.length > 0 && btnRect.height > 20;
                });

                if (validItems.length >= 2) {
                    return validItems;
                }
            }
        }

        return [];
    }

    // ============ ACTIVE MODE DETECTION (INDEX-BASED) ============

    async function detectActiveMode() {
        const triggerResult = findMenuTrigger();
        if (!triggerResult) return -1;

        const trigger = triggerResult.element;

        const scrollPos = window.scrollY;

        trigger.click();

        return new Promise((resolve) => {
            setTimeout(() => {
                const menuItems = findMenuItems();
                let activeIndex = -1;

                menuItems.forEach((item, index) => {
                    // Check multiple indicators of selection
                    const isActive =
                        item.getAttribute('aria-selected') === 'true' ||
                        item.getAttribute('aria-checked') === 'true' ||
                        item.classList.contains('mat-mdc-menu-item-highlighted') ||
                        item.classList.contains('mdc-list-item--selected') ||
                        item.classList.contains('active') ||
                        item.classList.contains('selected') ||
                        item.hasAttribute('data-selected') ||
                        item.querySelector('[aria-checked="true"]') !== null ||
                        item.querySelector('.selected') !== null ||
                        item.querySelector('[data-selected="true"]') !== null;

                    if (isActive) {
                        activeIndex = index;
                    }
                });

                document.body.click();

                window.scrollTo(0, scrollPos);

                resolve(activeIndex);
            }, 100);
        });
    }

    // ============ RESPONSIVE LAYOUT ============

    function updateButtonLayout() {
        const container = document.querySelector(MODE_CONFIG.containerSelector);
        const buttons = document.querySelectorAll('.gqs-btn');

        if (!container || buttons.length === 0) return;

        const containerWidth = container.offsetWidth;
        const isCompact = containerWidth < MODE_CONFIG.compactBreakpoint;

        buttons.forEach(btn => {
            if (isCompact) {
                btn.classList.add('compact');
                btn.title = btn.querySelector('.gqs-label')?.textContent || '';
            } else {
                btn.classList.remove('compact');
                btn.removeAttribute('title');
            }
        });
    }

    // ============ UI INJECTION ============

    function injectButtons(container) {
        const bar = document.createElement('div');
        bar.id = 'gemini-quick-switch-bar';

        MODE_CONFIG.modes.forEach((mode, idx) => {
            const btn = document.createElement('button');
            btn.className = 'gqs-btn';

            const icon = document.createElement('span');
            icon.className = 'gqs-icon';
            icon.textContent = mode.icon;

            const label = document.createElement('span');
            label.className = 'gqs-label';
            label.textContent = mode.label;

            btn.appendChild(icon);
            btn.appendChild(label);
            btn.dataset.modeIndex = idx;
            btn.onclick = (e) => handleModeClick(e, mode.index);
            bar.appendChild(btn);
        });

        container.appendChild(bar);

        setTimeout(() => {
            updateButtonLayout();
            updateActiveState();
        }, 100);
    }

    async function updateActiveState() {
        const activeIndex = await detectActiveMode();

        document.querySelectorAll('.gqs-btn').forEach((btn, idx) => {
            if (idx === activeIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // ============ MODE SWITCHING (INDEX-BASED) ============

    function handleModeClick(e, modeIndex) {
        e.preventDefault();

        // Immediately update UI for responsiveness
        document.querySelectorAll('.gqs-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const triggerResult = findMenuTrigger();
        if (!triggerResult) {
            console.error("Gemini Switcher: Trigger not found");
            alert("Could not find mode menu. Google may have updated the interface.");
            return;
        }

        triggerResult.element.click();

        setTimeout(() => {
            const menuItems = findMenuItems();

            if (menuItems.length > modeIndex) {
                menuItems[modeIndex].click();

                setTimeout(() => updateActiveState(), 500);
            } else {
                console.error(`Gemini Switcher: Only found ${menuItems.length} menu items, cannot select index ${modeIndex}`);
                document.body.click();
                // Restore correct active state if switch failed
                updateActiveState();
            }
        }, 200);
    }

    // ============ INITIALIZATION & MONITORING ============

    let lastContainerCheck = null;
    let resizeObserver = null;

    setInterval(() => {
        const container = document.querySelector(MODE_CONFIG.containerSelector);
        const existingBar = document.getElementById('gemini-quick-switch-bar');

        if (container && !existingBar) {
            injectButtons(container);
            lastContainerCheck = container;

            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            resizeObserver = new ResizeObserver(updateButtonLayout);
            resizeObserver.observe(container);
        }

        if (existingBar && !document.body.contains(existingBar)) {
            lastContainerCheck = null;
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        }

        if (existingBar && Math.random() < 0.1) {
            updateActiveState();
        }
    }, MODE_CONFIG.checkInterval);

    window.addEventListener('resize', updateButtonLayout);

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            lastContainerCheck = null;
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

})();