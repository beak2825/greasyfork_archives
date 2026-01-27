// ==UserScript==
// @name         Gemini Model Switcher Buttons
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Replaces Gemini model selection dropdown with easily accessible buttons
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

    // ============ CONFIGURATION ============
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

    let languageMap = null;
    let lastActiveIndex = -1;

    try {
        const savedMap = localStorage.getItem('gqs_language_map');
        if (savedMap) languageMap = JSON.parse(savedMap);

        const savedIndex = localStorage.getItem('gqs_last_index');
        if (savedIndex !== null) lastActiveIndex = parseInt(savedIndex, 10);
    } catch (e) {
        console.warn("Gemini Switcher: Could not load saved state", e);
    }
    // -----------------------------------------------------------

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

    // ============ POLLING HELPER ============

    function waitForMenu(callback, maxWait = 500) {
        const startTime = Date.now();

        const check = () => {
            const items = findMenuItems();

            if (items.length >= 3) {
                callback(items);
            } else if (Date.now() - startTime < maxWait) {
                requestAnimationFrame(check);
            } else {
                console.warn("Gemini Switcher: Menu timeout");
                callback([]);
            }
        };

        requestAnimationFrame(check);
    }

    function waitForTriggerUpdate(callback, maxWait = 300) {
        const startTime = Date.now();

        const check = () => {
            const triggerResult = findMenuTrigger();
            if (!triggerResult) {
                callback();
                return;
            }

            const text = triggerResult.element.innerText.toLowerCase().trim();

            if (text && text.length >= 2 && languageMap) {
                for (const keyword of Object.keys(languageMap)) {
                    if (text.includes(keyword)) {
                        callback();
                        return;
                    }
                }
            }

            if (Date.now() - startTime < maxWait) {
                requestAnimationFrame(check);
            } else {
                callback();
            }
        };

        requestAnimationFrame(check);
    }

    // ============ LANGUAGE MAP  ============

    function buildLanguageMapFromMenu(menuItems) {
        // We allow rebuilding if null, or just to update
        const tempMap = {};
        menuItems.forEach((item, index) => {
            const titleElement = item.querySelector('.gds-title-m, [class*="title"]');
            if (titleElement) {
                const text = titleElement.innerText.trim().toLowerCase();
                if (text) {
                    tempMap[text] = index;
                }
            }
        });

        if (Object.keys(tempMap).length > 0) {
            languageMap = tempMap;
            localStorage.setItem('gqs_language_map', JSON.stringify(languageMap));
            console.log("Gemini Switcher: Language map built and saved", languageMap);
        }
    }

    // ============ ACTIVE MODE DETECTION (NON-INVASIVE) ============

    function detectActiveMode() {
        const triggerResult = findMenuTrigger();
        if (!triggerResult) return lastActiveIndex;

        const trigger = triggerResult.element;
        const text = trigger.innerText.toLowerCase().trim();

        if (!text || text.length < 2) {
            return lastActiveIndex;
        }

        // If map was loaded from LocalStorage, this will work immediately on refresh
        if (!languageMap) {
            return lastActiveIndex;
        }

        for (const [keyword, index] of Object.entries(languageMap)) {
            if (text.includes(keyword)) {
                // We don't save index to storage here to avoid excessive writes,
                // we rely on the map for the active state usually.
                return index;
            }
        }

        return lastActiveIndex;
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

    function updateActiveState(retryCount = 0) {
        const activeIndex = detectActiveMode();

        if (activeIndex === -1 && retryCount < 5 && languageMap) {
            setTimeout(() => updateActiveState(retryCount + 1), 200);
            return;
        }

        document.querySelectorAll('.gqs-btn').forEach((btn, idx) => {
            if (idx === activeIndex) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }


    // ============ MODE SWITCHING ============

    function handleModeClick(e, modeIndex) {
        e.preventDefault();

        document.querySelectorAll('.gqs-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        lastActiveIndex = modeIndex;
        localStorage.setItem('gqs_last_index', modeIndex.toString());

        const triggerResult = findMenuTrigger();
        if (!triggerResult) {
            console.error("Gemini Switcher: Trigger not found");
            return;
        }

        triggerResult.element.click();

        waitForMenu((menuItems) => {
            if (menuItems.length === 0) {
                console.error("Gemini Switcher: Menu not found");
                return;
            }

            // Always try to build map if possible to keep it fresh
            if (menuItems.length >= 3) {
                buildLanguageMapFromMenu(menuItems);
            }

            if (menuItems.length > modeIndex) {
                menuItems[modeIndex].click();

                waitForTriggerUpdate(() => {
                    updateActiveState();
                });
            } else {
                console.error(`Gemini Switcher: Only found ${menuItems.length} menu items`);
            }
        });
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

        if (existingBar) {
            updateActiveState();
        }
    }, MODE_CONFIG.checkInterval);

    window.addEventListener('resize', updateButtonLayout);

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            lastContainerCheck = null;
            // We do NOT clear languageMap here anymore,
            // so settings persist across navigation
            // languageMap = null;
            lastActiveIndex = -1;
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

})();