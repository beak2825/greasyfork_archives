// ==UserScript==
// @name         Auto Meshtastic Traceroute Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0a
// @description  Automated traceroute testing for Meshtastic web interface with hotkey control, visual status, and URL change detection
// @author       @gregsonar
// @license      MIT
// @match        http*://*/*
// @grant        none
// @homepageURL  https://github.com/gregsonar/meshtastic-tracebot
// @supportURL   https://github.com/gregsonar/meshtastic-tracebot/issues
// @downloadURL https://update.greasyfork.org/scripts/564176/Auto%20Meshtastic%20Traceroute%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/564176/Auto%20Meshtastic%20Traceroute%20Clicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ========================================
     * CONFIGURATION
     * ========================================
     * Language for UI messages
     * Options: "en" (English), "ru" (Russian)
     */
    const LANGUAGE = "en";

    /**
     * Target node LONG NAME to search for in 'Nodes' list
     * Change to the long name of the node for which you want to obtain a route trace
     */
    const DEFAULT_TARGET_H1_TEXT = "Target Node";  // <--- Enter the name of the target node here!

    /*
    * Probably, you don't need to edit anything below this line
    * ========================================
    */

    /**
     * Hotkey configuration for starting/stopping the bot
     * Default: Ctrl + Alt + T
     */
    const HOTKEY = {
        ctrl: true,
        alt: true,
        shift: false,
        key: 't',
        code: 'KeyT'
    };

    const INDICATOR_PREFIX = "TraceBot: "; // UI indicator text prefix
    const LOG_PREFIX = "[TraceBot] ";  // Console log prefix

    /**
     * Time intervals (in milliseconds)
     * Do NOT change until you are absolutely sure of what you are doing (nobody likes spam).
     */
    const TIMING = {
        WAIT_FOR_RESULT: 3 * 60 * 1000,   // Wait at least 3 minutes for traceroute result
        LOOP_DELAY: 3300,                 // Delay before starting new cycle
        POLLING_INTERVAL: 500,            // Polling frequency for DOM elements
        UI_UPDATE_DELAY: 630,             // Delay after UI interactions
        BUTTON_WAIT: 2000                 // Wait before searching for trace button
    };

    /**
     * Indicator colors for different states
     */
    const COLORS = {
        OFF: '#64748b',
        TEXT: '#fff',
        RUNNING: '#2563eb',
        SUCCESS: '#16a34a',
        STOPPED: '#f59e0b',
        ERROR: '#dc2626',
        URL_CHANGED: '#dc2626',
        INPUT_BG: '#1e293b',
        INPUT_BORDER: '#475569'
    };

    /**
     * Indicator position on screen
     */
    const INDICATOR_POSITION = {
        bottom: '20px',
        right: '20px'
    };

    /**
     * DOM selectors for elements
     */
    const SELECTORS = {
        dialog: 'div[role="dialog"][data-state="open"]',
        h1: 'h1',
        traceButton: 'button[name="traceRoute"]'
    };

    /**
     * Localized messages
     */
    const MESSAGES = {
        'ru': {
            successDialogFound: "Найдено сообщение об успешном traceroute до ",
            hotkeyStop: "Остановка по горячей клавише",
            hotkeyStart: "Запуск по горячей клавише",
            urlChangeStop: "URL изменился - остановка",
            waitingHotkey: "Ожидание горячей клавиши (Ctrl + Alt + T)",
            searchingH1: "Ищу H1 с текстом ",
            clickingH1: "Кликаю H1",
            searchingTrace: "Ищу Trace Route",
            clickingTrace: "Нажимаю Trace Route",
            waitingResult: "Ожидание результата трассировки до ",
            loopRestart: "Цикл без результата, повтор",
            processStarted: "Автоматическая трассировка запущена",
            processCompleted: "Завершено успешно",
            processUrlStopped: "Остановлено из-за смены URL",
            elementFound: "Найдено: ",
            targetNode: "Целевая нода",
            inputPlaceholder: "Имя ноды (по умолчанию: ",
            targetUpdated: "Цель обновлена: ",
            invalidInput: "Некорректное имя ноды",
            clickToExpand: "Нажмите для настройки"
        },
        'en': {
            successDialogFound: "Found successful traceroute message to ",
            hotkeyStop: "Stopped by hotkey",
            hotkeyStart: "Started by hotkey",
            urlChangeStop: "URL changed - stopping",
            waitingHotkey: "Waiting for hotkey (Ctrl + Alt + T)",
            searchingH1: "Searching for H1 with text ",
            clickingH1: "Clicking H1",
            searchingTrace: "Searching for Trace Route button",
            clickingTrace: "Clicking Trace Route",
            waitingResult: "Waiting for trace result to ",
            loopRestart: "No result, restarting cycle",
            processStarted: "Automatic tracing started",
            processCompleted: "Completed successfully",
            processUrlStopped: "Stopped due to URL change",
            elementFound: "Found: ",
            targetNode: "Target Node",
            inputPlaceholder: "Node name (default: ",
            targetUpdated: "Target updated: ",
            invalidInput: "Invalid node name",
            clickToExpand: "Click to configure"
        }
    };

    /* ========================================
     * GLOBAL STATE
     * ======================================== */

    let isRunning = false;
    let stoppedByUrlChange = false;
    let currentTarget = DEFAULT_TARGET_H1_TEXT;
    let isExpanded = false;
    const MSG = MESSAGES[LANGUAGE];

    /* ========================================
     * UTILITY FUNCTIONS
     * ======================================== */

    /**
     * Log message to console with prefix
     */
    const log = (msg) => console.log(`${LOG_PREFIX}${msg}`);

    /**
     * Sleep for specified milliseconds
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Validate node name
     * Node names in Meshtastic can contain Unicode characters and emojis
     */
    function isValidNodeName(name) {
        if (!name || typeof name !== 'string') return false;

        // Trim whitespace
        const trimmed = name.trim();

        // Check if not empty after trim
        if (trimmed.length === 0) return false;

        // Check length (Meshtastic long names are typically up to 40 chars)
        if (trimmed.length > 100) return false;

        // Allow any Unicode characters including emojis
        // Just check that it's not only whitespace or control characters
        return /\S/.test(trimmed);
    }

    /**
     * Get current target (from input or default)
     */
    function getCurrentTarget() {
        return currentTarget || DEFAULT_TARGET_H1_TEXT;
    }

    /* ========================================
     * UI COMPONENTS
     * ======================================== */

    // Main container
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        zIndex: '999999',
        bottom: INDICATOR_POSITION.bottom,
        right: INDICATOR_POSITION.right,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'all 0.3s ease'
    });

    // Status indicator
    const indicator = document.createElement('div');
    Object.assign(indicator.style, {
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxShadow: '0 2px 8px rgba(0,0,0,.3)',
        cursor: 'default',
        background: COLORS.OFF,
        color: COLORS.TEXT,
        userSelect: 'none',
        transition: 'all 0.2s ease'
    });

    indicator.textContent = `${INDICATOR_PREFIX}OFF`;
    updateIndicatorTitle();

    // Expanded panel
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        display: 'none',
        padding: '12px',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxShadow: '0 2px 8px rgba(0,0,0,.3)',
        background: COLORS.INPUT_BG,
        color: COLORS.TEXT,
        minWidth: '200px'
    });

    // Label
    const label = document.createElement('div');
    label.textContent = MSG.targetNode + ':';
    label.style.marginBottom = '6px';
    label.style.fontSize = '11px';
    label.style.opacity = '0.8';

    // Input field
    const input = document.createElement('input');
    Object.assign(input.style, {
        width: '100%',
        padding: '6px 8px',
        borderRadius: '4px',
        border: `1px solid ${COLORS.INPUT_BORDER}`,
        background: '#0f172a',
        color: COLORS.TEXT,
        fontSize: '12px',
        fontFamily: 'monospace',
        outline: 'none',
        boxSizing: 'border-box'
    });
    input.type = 'text';
    input.placeholder = `${MSG.inputPlaceholder}${DEFAULT_TARGET_H1_TEXT})`;
    input.value = currentTarget === DEFAULT_TARGET_H1_TEXT ? '' : currentTarget;

    // Help text
    const helpText = document.createElement('div');
    helpText.textContent = MSG.clickToExpand;
    helpText.style.marginTop = '4px';
    helpText.style.fontSize = '10px';
    helpText.style.opacity = '0.6';

    panel.appendChild(label);
    panel.appendChild(input);
    panel.appendChild(helpText);

    container.appendChild(indicator);
    container.appendChild(panel);
    document.body.appendChild(container);

    /**
     * Update indicator tooltip
     */
    function updateIndicatorTitle() {
        const target = getCurrentTarget();
        indicator.title = `Ctrl + Alt + ${HOTKEY.key.toUpperCase()}\n${MSG.hotkeyStart}/${MSG.hotkeyStop}\n${MSG.targetNode}: ${target}`;
    }

    /**
     * Update indicator state and color
     */
    function setIndicator(state, color) {
        indicator.textContent = `${INDICATOR_PREFIX}${state}`;
        indicator.style.background = color;
    }

    /**
     * Toggle panel visibility
     */
    function togglePanel() {
        isExpanded = !isExpanded;
        panel.style.display = isExpanded ? 'block' : 'none';

        if (isExpanded) {
            input.focus();
            input.select();
        }
    }

    /* ========================================
     * EVENT HANDLERS
     * ======================================== */

    // Click on indicator to toggle panel
    indicator.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
    });

    // Handle input changes
    input.addEventListener('input', (e) => {
        const value = e.target.value.trim();

        // Visual feedback for validation
        if (value && !isValidNodeName(value)) {
            input.style.borderColor = COLORS.ERROR;
            helpText.textContent = MSG.invalidInput;
            helpText.style.color = COLORS.ERROR;
        } else {
            input.style.borderColor = COLORS.INPUT_BORDER;
            helpText.textContent = MSG.clickToExpand;
            helpText.style.color = COLORS.TEXT;
        }
    });

    // Handle input submission (Enter or blur)
    function handleInputSubmit() {
        const value = input.value.trim();

        // Stop current cycle if running
        if (isRunning) {
            log(MSG.hotkeyStop);
            isRunning = false;
            setIndicator('STOPPED', COLORS.STOPPED);
        }

        // Update target
        if (value && isValidNodeName(value)) {
            currentTarget = value;
            log(`${MSG.targetUpdated}${currentTarget}`);
        } else {
            currentTarget = DEFAULT_TARGET_H1_TEXT;
            input.value = '';
        }

        updateIndicatorTitle();
        togglePanel();
    }

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInputSubmit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            togglePanel();
        }
    });

    input.addEventListener('blur', () => {
        // Delay to allow click events to process
        setTimeout(() => {
            if (isExpanded) {
                handleInputSubmit();
            }
        }, 200);
    });

    // Click outside to close panel
    document.addEventListener('click', (e) => {
        if (isExpanded && !container.contains(e.target)) {
            togglePanel();
        }
    });

    /* ========================================
     * SUCCESS DETECTION
     * ======================================== */

    // Check if success dialog exists
    function successDialogExists() {
        const dialog = document.querySelector(SELECTORS.dialog);
        return dialog && dialog.innerText.includes("Traceroute:");
    }

    // Check for success and abort if found
    function abortIfSuccess() {
        if (successDialogExists()) {
            setIndicator('SUCCESS', COLORS.SUCCESS);
            log(`${MSG.successDialogFound}${getCurrentTarget()}`);
            isRunning = false;
            throw new Error("SUCCESS");
        }
    }

    /* ========================================
     * DOM ELEMENT SEARCH
     * ======================================== */

    function findH1() {
        const target = getCurrentTarget();
        return [...document.querySelectorAll(SELECTORS.h1)]
            .find(h => h.textContent.trim() === target);
    }

    function findTraceButton() {
        return document.querySelector(SELECTORS.traceButton);
    }

    // Simulate human-like click on element (to avoid compatibility issues)
    function humanClick(el) {
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        el.scrollIntoView({ block: "center", behavior: "instant" });
        if (el.focus) el.focus();

        const events = [
            new PointerEvent("pointerover", { bubbles: true, clientX: x, clientY: y }),
            new PointerEvent("pointerdown", { bubbles: true, clientX: x, clientY: y, isPrimary: true }),
            new MouseEvent("mousedown", { bubbles: true, clientX: x, clientY: y }),
            new MouseEvent("mouseup", { bubbles: true, clientX: x, clientY: y }), // 🐁
            new MouseEvent("click", { bubbles: true, clientX: x, clientY: y })
        ];

        events.forEach(e => el.dispatchEvent(e));
    }

    // Wait for element to appear with timeout
    async function waitFor(searchFn, label, timeout = 30000) {
        const start = Date.now();
        while (Date.now() - start < timeout && isRunning) {
            abortIfSuccess();
            const el = searchFn();
            if (el) {
                log(`${MSG.elementFound}${label}`);
                return el;
            }
            await sleep(TIMING.POLLING_INTERVAL);
        }
        return null;
    }

    /* ========================================
     * MAIN AUTOMATION LOOP
     * ======================================== */

    async function main() {
        const target = getCurrentTarget();
        log(`${MSG.processStarted} (${MSG.targetNode}: ${target})`);
        setIndicator('RUNNING', COLORS.RUNNING);

        try {
            while (isRunning) {
                abortIfSuccess();

                // Find and click H1
                log(`${MSG.searchingH1}${target}`);
                const h1 = await waitFor(findH1, "H1");
                if (!h1 || !isRunning) break;

                abortIfSuccess();
                log(MSG.clickingH1);
                humanClick(h1);
                await sleep(TIMING.UI_UPDATE_DELAY);
                await sleep(TIMING.BUTTON_WAIT);

                // Find and click trace button
                abortIfSuccess();
                log(MSG.searchingTrace);
                const btn = await waitFor(findTraceButton, "Trace Route");
                if (!btn || !isRunning) break;

                abortIfSuccess();
                log(MSG.clickingTrace);
                btn.click();

                // Wait for result
                log(`${MSG.waitingResult}${target}`);
                const start = Date.now();
                while (Date.now() - start < TIMING.WAIT_FOR_RESULT && isRunning) {
                    abortIfSuccess();
                    await sleep(TIMING.POLLING_INTERVAL);
                }

                // Restart cycle if no result
                log(MSG.loopRestart);
                await sleep(TIMING.LOOP_DELAY);
            }
        } catch (e) {
            if (e.message === "SUCCESS") {
                log(MSG.processCompleted);
            } else if (stoppedByUrlChange) {
                setIndicator('URL CHANGED', COLORS.URL_CHANGED);
                log(MSG.processUrlStopped);
            } else {
                setIndicator('ERROR', COLORS.ERROR);
                console.error(e);
            }
        } finally {
            if (!successDialogExists() && !isRunning) {
                setIndicator('STOPPED', COLORS.STOPPED);
            } else if (!successDialogExists()) {
                setIndicator('OFF', COLORS.OFF);
            }
        }
    }

    /* ========================================
     * HOTKEY HANDLER
     * ======================================== */

    document.addEventListener('keydown', (e) => {
        if (
            e.ctrlKey === HOTKEY.ctrl &&
            e.altKey === HOTKEY.alt &&
            e.shiftKey === HOTKEY.shift &&
            e.code === HOTKEY.code
        ) {
            e.preventDefault();

            if (isRunning) {
                log(MSG.hotkeyStop);
                isRunning = false;
                setIndicator('STOPPED', COLORS.STOPPED);
            } else {
                log(MSG.hotkeyStart);
                stoppedByUrlChange = false;
                isRunning = true;
                main();
            }
        }
    });

    /* ========================================
     * URL CHANGE DETECTION
     * ======================================== */

    function handleUrlChange() {
        if (isRunning) {
            stoppedByUrlChange = true;
            isRunning = false;
            log(MSG.urlChangeStop);
        }
    }

    // Modern browsers
    if ('onurlchange' in window) {
        window.addEventListener('urlchange', handleUrlChange);
    }

    // History API interception
    const pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(this, arguments);
        handleUrlChange();
    };

    const replaceState = history.replaceState;
    history.replaceState = function () {
        replaceState.apply(this, arguments);
        handleUrlChange();
    };

    window.addEventListener('popstate', handleUrlChange);

    // INITIALIZATION
    log(MSG.waitingHotkey);
})();