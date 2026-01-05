// ==UserScript==
// @name         Torn Ghost Trades
// @namespace    https://github.com/Rosti-dev
// @version      1.0
// @description  Trade helper: adds a sticky floating Trade Fill button, adds Paste + P&S buttons (moved to bottom), removes initial text, and supports safe Enter/Space hotkey (keyup only)
// @author       Rosti
// @license      MIT License
// @match        https://www.torn.com/trade.php*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559242/Torn%20Ghost%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/559242/Torn%20Ghost%20Trades.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /***************************************************************************
     * CONFIG
     ***************************************************************************/
    const DEBUG = false;

    // IDs
    const FILL_BUTTON_ID = 'torn-trade-fill-button';
    const FILL_WRAP_ID = `${FILL_BUTTON_ID}-wrap`;
    const PASTE_BUTTON_ID = 'paste-button';
    const PASTE_SEND_BUTTON_ID = 'paste-send-button';

    // Hotkeys
    const activationKeys = ['Enter', ' ', 'Spacebar'];

    // Optional: keep a light safety timer (MutationObserver + events should be enough)
    const SAFETY_INTERVAL_MS = 800;

    // Variable containing the array of texts to randomly select from
    const textOptions = [
        'Thanks for trading! Have a nice day :)',
        'Thanks for trading'
    ];

    /***************************************************************************
     * STATE
     ***************************************************************************/
    let fillButtonRef = null;
    let globalKeyHandlersAttached = false;
    let lastUrl = location.href;

    let ensureQueued = false;

    /***************************************************************************
     * UTILS
     ***************************************************************************/
    function log(...args) {
        if (DEBUG) console.log('[GhostTrades]', ...args);
    }

    function scheduleEnsureAll() {
        if (ensureQueued) return;
        ensureQueued = true;
        requestAnimationFrame(() => {
            ensureQueued = false;
            ensureFillButtonExists();
            ensurePasteButtonsExist();
            removeInitialText();
        });
    }

    function injectCss() {
        if (document.getElementById('torn-ghost-trades-css')) return;

        const style = document.createElement('style');
        style.id = 'torn-ghost-trades-css';
        style.textContent = `
            /* Sticky floating Trade Fill button container */
            #${FILL_WRAP_ID} {
                position: sticky;
                top: 8px;
                z-index: 9999;
                margin: 10px 0 12px;
                display: flex;
                gap: 10px;
                align-items: center;
                flex-wrap: wrap;
            }

            /* Button look */
            #${FILL_BUTTON_ID} {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 220px;
                height: 74px;
                padding: 0 22px;
                background: #2d8cff !important;
                color: #ffffff !important;
                border: none !important;
                border-radius: 10px;
                cursor: pointer;
                font-size: 16px;
                font-family: inherit;
                font-weight: 700;
                letter-spacing: 0.2px;
                box-shadow: 0 4px 10px rgba(45, 140, 255, 0.28);
            }

            /* Optional “icon” without being too bulky */
            #${FILL_BUTTON_ID}::before {
                content: "⇪";
                margin-right: 10px;
                font-size: 18px;
                font-weight: 900;
                line-height: 1;
                opacity: 0.95;
            }

            /* Paste buttons style (keep yours, but normalize + consistent) */
            #${PASTE_BUTTON_ID}, #${PASTE_SEND_BUTTON_ID} {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 44px;
                padding: 0 16px;
                border: none !important;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-family: inherit;
                font-weight: 700;
                color: #ffffff !important;
                background: #2d8cff !important;
                box-shadow: 0 4px 10px rgba(45, 140, 255, 0.18);
                margin-left: 10px;
            }
        `;

        const parent = document.head || document.documentElement;
        parent.appendChild(style);
    }

    function isEditableElement(el) {
        if (!el) return false;
        const tag = (el.tagName || '').toUpperCase();
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
        return !!el.isContentEditable;
    }

    function isChatFocused(activeEl) {
        if (!activeEl) return false;
        return !!activeEl.closest(
            '#chat, #chatRoot, #chatContainer, .chat, .chat-root, .chat-container, .chat-box, [id*="chat" i], [class*="chat" i]'
        );
    }

    function isFocusBlocked() {
        if (!document.hasFocus()) return true;

        const activeElement = document.activeElement;
        if (!activeElement || activeElement === document.body || activeElement === document.documentElement) {
            return false;
        }

        // Allow if focus is on our fill button
        if (fillButtonRef && activeElement === fillButtonRef) return false;

        // Block for chat or other text entry
        if (isChatFocused(activeElement)) return true;

        // Block for typical editables
        if (isEditableElement(activeElement)) return true;

        // ARIA textbox-like roles
        const role = (activeElement.getAttribute('role') || '').toLowerCase();
        if (role === 'textbox' || role === 'combobox' || role === 'searchbox') return true;

        return false;
    }

    /***************************************************************************
     * CORE: Trade fill operation (unchanged logic, safer guards)
     ***************************************************************************/
    function handleFillOperation() {
        const currentUrl = window.location.href;

        // Special case: init step with inserter
        if (currentUrl.includes('#/step=initiateTrade') || currentUrl.includes('step=initiateTrade&inserter=')) {
            const addLink = document.querySelector('.add a[href*="ID="]');
            if (addLink) {
                const href = addLink.getAttribute('href') || '';
                const idMatch = href.match(/ID=(\d+)/);
                if (idMatch) {
                    window.location.href = `https://www.torn.com/trade.php#step=view&ID=${idMatch[1]}`;
                }
            }
            return;
        }

        const idMatch = currentUrl.match(/ID=(\d+)/);
        if (!idMatch) return;
        const tradeID = idMatch[1];

        const moneyElement = document.getElementById('user-money');
        if (!moneyElement) return;

        const moneyOnHand = parseInt(moneyElement.getAttribute('data-money'), 10);
        if (!Number.isFinite(moneyOnHand) || moneyOnHand <= 0) return;

        // Get current money in trade (best-effort; keep your selector)
        const tradeMoneyElement = document.querySelector('.cont .color1 .desc .name');
        let moneyInTrade = 0;
        if (tradeMoneyElement) {
            const moneyText = tradeMoneyElement.textContent.trim();
            const parsed = parseInt(moneyText.replace(/\D/g, ''), 10);
            moneyInTrade = Number.isFinite(parsed) ? parsed : 0;
        }

        const amountToAdd = moneyInTrade > 0 ? (moneyOnHand + moneyInTrade) : moneyOnHand;
        window.location.href = `trade.php#step=view&sub_step=addmoney2&ID=${tradeID}&amount=${amountToAdd}`;
    }

    /***************************************************************************
     * UI: Fill button (sticky/floating)
     ***************************************************************************/
    function getInsertionPoint() {
        // Prefer the Trade title container
        const tradeHeader =
            document.querySelector('.content-title h4#skip-to-content') ||
            document.querySelector('.content-title h4') ||
            document.querySelector('.trades');

        const titleContainer = tradeHeader ? tradeHeader.closest('.content-title') : null;
        return titleContainer || tradeHeader || null;
    }

    function addFillButton() {
        const insertionPoint = getInsertionPoint();
        if (!insertionPoint) return;

        let wrap = document.getElementById(FILL_WRAP_ID);
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.id = FILL_WRAP_ID;
        }

        let fillButton = document.getElementById(FILL_BUTTON_ID);
        if (!fillButton) {
            fillButton = document.createElement('button');
            fillButton.type = 'button';
            fillButton.id = FILL_BUTTON_ID;
            fillButton.className = 'torn-btn';
            fillButton.textContent = 'Trade Fill';
            fillButton.setAttribute('aria-label', 'Trade Fill');

            fillButton.addEventListener('click', (e) => {
                e.preventDefault();
                fillButton.focus();
                handleFillOperation();
            });

            wrap.appendChild(fillButton);
        }

        if (!wrap.isConnected) {
            insertionPoint.insertAdjacentElement('afterend', wrap);
        }

        fillButtonRef = fillButton;

        attachGlobalKeyHandlers();
    }

    function ensureFillButtonExists() {
        if (!document.getElementById(FILL_BUTTON_ID)) {
            addFillButton();
        } else {
            fillButtonRef = document.getElementById(FILL_BUTTON_ID);
            attachGlobalKeyHandlers();
        }
    }

    /***************************************************************************
     * UI: Paste + P&S buttons (moved to bottom)
     ***************************************************************************/
    function removeInitialText() {
        const descElement = document.querySelector('.trade-cancel .desc p');
        if (descElement && descElement.textContent) {
            descElement.textContent = '';
        }
    }

    function movePasteButtonsToBottom() {
        const pasteButton = document.getElementById(PASTE_BUTTON_ID);
        const pasteSendButton = document.getElementById(PASTE_SEND_BUTTON_ID);
        if (!pasteButton || !pasteSendButton) return;

        const textarea = document.getElementById('postTradeMessage');
        if (!textarea) return;

        const addButton = document.querySelector('input[type="submit"][value="ADD"]');

        // Prefer inserting after the ADD button row/container if we can find it
        const container = addButton?.parentNode?.parentNode || addButton?.parentNode || null;
        const insertionPoint = container || textarea;

        insertionPoint.insertAdjacentElement('afterend', pasteButton);
        pasteButton.insertAdjacentElement('afterend', pasteSendButton);
    }

    function addPasteButtons() {
        const textarea = document.getElementById('postTradeMessage');
        if (!textarea) return;

        // avoid dupes
        if (document.getElementById(PASTE_BUTTON_ID) || document.getElementById(PASTE_SEND_BUTTON_ID)) return;

        const addButton = document.querySelector('input[type="submit"][value="ADD"]');

        const pasteButton = document.createElement('button');
        pasteButton.type = 'button';
        pasteButton.textContent = 'Paste';
        pasteButton.id = PASTE_BUTTON_ID;
        pasteButton.className = 'torn-btn';

        const pasteSendButton = document.createElement('button');
        pasteSendButton.type = 'button';
        pasteSendButton.textContent = 'P&S';
        pasteSendButton.id = PASTE_SEND_BUTTON_ID;
        pasteSendButton.className = 'torn-btn';

        function triggerInputEvent() {
            if (addButton) addButton.disabled = false;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        pasteButton.addEventListener('click', () => {
            const randomText = textOptions[Math.floor(Math.random() * textOptions.length)];
            textarea.value = `${randomText} ${textarea.value || ''}`.trimStart();
            triggerInputEvent();
        });

        pasteSendButton.addEventListener('click', () => {
            const randomText = textOptions[Math.floor(Math.random() * textOptions.length)];
            textarea.value = `${randomText} ${textarea.value || ''}`.trimStart();
            triggerInputEvent();
            if (addButton) addButton.click();
        });

        // Always place them near the textarea / ADD button area (bottom), not in the sticky wrap
        if (addButton) {
            const buttonContainer = addButton.parentNode?.parentNode;
            if (buttonContainer) {
                buttonContainer.insertAdjacentElement('afterend', pasteButton);
                pasteButton.insertAdjacentElement('afterend', pasteSendButton);
            } else {
                textarea.insertAdjacentElement('afterend', pasteButton);
                pasteButton.insertAdjacentElement('afterend', pasteSendButton);
            }
        } else {
            textarea.insertAdjacentElement('afterend', pasteButton);
            pasteButton.insertAdjacentElement('afterend', pasteSendButton);
        }

        if (addButton) addButton.disabled = false;
    }

    function ensurePasteButtonsExist() {
        if (!document.getElementById(PASTE_BUTTON_ID) || !document.getElementById(PASTE_SEND_BUTTON_ID)) {
            addPasteButtons();
        }
        // Always force them to the bottom even if Torn re-renders the UI
        movePasteButtonsToBottom();
    }

    /***************************************************************************
     * HOTKEYS: keyup triggers, keydown only prevents scroll when allowed
     ***************************************************************************/
    function attachGlobalKeyHandlers() {
        if (globalKeyHandlersAttached) return;

        // Prevent space scroll ONLY when we would accept the hotkey
        window.addEventListener('keydown', (event) => {
            if (event.key !== ' ' && event.key !== 'Spacebar') return;
            if (!fillButtonRef) return;
            if (isFocusBlocked()) return;
            event.preventDefault();
        }, true);

        // Trigger on keyup only (never keydown)
        window.addEventListener('keyup', (event) => {
            if (!fillButtonRef) return;
            if (!activationKeys.includes(event.key) || event.repeat) return;
            if (isFocusBlocked()) return;

            event.preventDefault();
            event.stopPropagation();

            fillButtonRef.focus();
            handleFillOperation();
        }, true);

        globalKeyHandlersAttached = true;
    }

    /***************************************************************************
     * OBSERVERS + URL CHANGE HOOKS
     ***************************************************************************/
    function observeDocumentChanges() {
        const obs = new MutationObserver(() => scheduleEnsureAll());
        obs.observe(document.documentElement, { childList: true, subtree: true });
    }

    function onUrlMaybeChanged() {
        const now = location.href;
        if (now === lastUrl) return;
        lastUrl = now;
        scheduleEnsureAll();
    }

    function hookUrlEvents() {
        window.addEventListener('hashchange', onUrlMaybeChanged, true);
        window.addEventListener('popstate', onUrlMaybeChanged, true);

        // Torn sometimes pushes history without firing popstate consistently; patch pushState/replaceState
        const _push = history.pushState;
        const _replace = history.replaceState;
        history.pushState = function () {
            const r = _push.apply(this, arguments);
            onUrlMaybeChanged();
            return r;
        };
        history.replaceState = function () {
            const r = _replace.apply(this, arguments);
            onUrlMaybeChanged();
            return r;
        };
    }

    /***************************************************************************
     * INIT
     ***************************************************************************/
    function init() {
        injectCss();
        hookUrlEvents();
        observeDocumentChanges();

        // Initial
        scheduleEnsureAll();

        // Lightweight safety loop
        setInterval(() => {
            scheduleEnsureAll();
        }, SAFETY_INTERVAL_MS);
    }

    // document-start safe init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
