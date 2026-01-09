// ==UserScript==
// @name         Torn Quick Deposit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quick Deposit cash to Ghost Trade / Faction Vault
// @author       e7cf09 [3441977]
// @icon         https://editor.torn.com/cd385b6f-7625-47bf-88d4-911ee9661b52-3441977.png
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562003/Torn%20Quick%20Deposit.user.js
// @updateURL https://update.greasyfork.org/scripts/562003/Torn%20Quick%20Deposit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= CONFIGURATION =================
    const ENABLE_PANIC_MODE = true; // Enable red shield Panic Mode
    const PANIC_THRESHOLD = 10000000; // Panic Threshold: Only triggers if balance exceeds this
    const STRICT_GHOST_MODE = true; // Relaxed matching for Ghost trades (if false, any trade found is used)

    // Shortcut Configuration (Use KeyboardEvent.code)
    // Common codes: "Space", "KeyG", "KeyD", "Enter", "ControlLeft", etc.
    const DEPOSIT_KEY = "Space";
    const GHOST_KEY = "KeyG";
    const RESET_KEY = "KeyR";

    // ================= CORE STATE =================
    const STORAGE_KEY = 'torn_tactical_ghost_id';
    const GHOST_KEYWORD = 'ghost';
    const DEAD_SIGNALS = [
        "no trade was found", "trade has been accepted",
        "trade has been declined", "trade has been cancelled","this trade is currently locked",
    ];

    let currentBalance = 0;
    let isPanicLocked = false;
    let isSending = false;
    let panicOverlay = null;
    let clickSequence = 0;
    let isTradeDeadOnCurrentPage = false; // Flag: Whether the trade is confirmed dead on current page

    // ==========================================
    // === 1. SAFETY START & UTILITIES ===
    // ==========================================
    const getRfcv = () => document.cookie.match(/(?:^|; )rfc_id=([^;]*)/)?.[1];
    const getGhostID = () => localStorage.getItem(STORAGE_KEY);
    const formatMoney = (num) => "$" + parseInt(num).toLocaleString('en-US');

    // ==========================================
    // === 2. NETWORK INTERCEPTION ===
    // ==========================================
    // Intercept XHR to detect trade expiration
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) { this._url = url; return originalOpen.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            if (this._url && this._url.includes('trade.php')) analyzeNetworkResponse(this.responseText);
        });
        return originalSend.apply(this, arguments);
    };

    // Intercept Fetch to get Balance
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0] ? args[0].toString() : '';
        if (url.includes('sidebar') || url.includes('user')) {
            try {
                const clone = response.clone();
                clone.json().then(data => {
                    const money = data?.user?.money || data?.sidebarData?.user?.money;
                    if (money) updateBalance(money);
                }).catch(() => {});
            } catch(e) {}
        }
        return response;
    };

    function analyzeNetworkResponse(text) {
        if (!text || text.length < 20) return;
        const lower = text.toLowerCase();
        for (const signal of DEAD_SIGNALS) {
            if (lower.includes(signal)) {
                if (localStorage.getItem(STORAGE_KEY)) {
                    console.log(`💀 Trade Dead: ${signal}`);
                    localStorage.removeItem(STORAGE_KEY);
                    safeInjectButton(); // Refresh button status
                }
                break;
            }
        }
    }

    // ==========================================
    // === 3. PANIC SYSTEM (WebSocket) ===
    // ==========================================
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        ws.addEventListener('message', function(event) {
            const data = event.data;
            if (typeof data === 'string') {
                if (data.includes('attack-effects')) {
                    console.log("Debug: WS detected attack-effects! Triggering Panic.");
                    triggerPanicMode();
                }
                if (data.includes('updateMoney')) {
                    try {
                        const match = data.match(/"money"\s*:\s*(\d+)/);
                        if (match) {
                             updateBalance(match[1]);
                        }
                    } catch(e) {}
                }
            }
        });
        return ws;
    };
    window.WebSocket.prototype = OriginalWebSocket.prototype;
    ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(prop => {
        window.WebSocket[prop] = OriginalWebSocket[prop];
    });

    // ==========================================
    // === 4. TACTICAL LOGIC ===
    // ==========================================
    function getExistingTradeMoney() {
        try {
            let leftUser = document.querySelector('.user.left') || document.querySelector('.user.left.tt-modified');
            if (!leftUser) return 0;
            let nameElem = leftUser.querySelector('.name.left');
            if (!nameElem) return 0;
            const text = nameElem.innerText;
            const match = text.match(/\$([\d,]+)/);
            if (match) {
                return parseInt(match[1].replace(/,/g, ''));
            }
        } catch (e) {
            console.error("Error parsing trade money:", e);
        }
        return 0;
    }

    // Mode: 'auto' (priority), 'faction' (force faction), 'ghost' (force G-Bank)
    async function executeTacticalDeposit(mode = 'auto') {
        // Allow execution even if balance is 0 to ensure feedback, checks will happen inside
        if (isSending) return;

        const ghostID = getGhostID();
        let useGhost = false;

        if (mode === 'faction') {
            useGhost = false;
        } else if (mode === 'ghost') {
            useGhost = !!ghostID;
        } else {
            // mode === 'auto' -> Priority: Ghost > Faction
            useGhost = !!ghostID;
        }

        const rfcv = getRfcv();
        if (!rfcv) {
            console.error("Torn Tactical: No RFCV token found!");
            if (panicOverlay) panicOverlay.innerHTML = "ERROR:<br>NO RFCV";
            return;
        }

        if (useGhost) {
            // Loose Location Check: Match step=addmoney and ID=[GhostID] in either hash or search
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const searchParams = new URLSearchParams(window.location.search);

            const currentStep = hashParams.get('step') || searchParams.get('step');
            const currentID = hashParams.get('ID') || searchParams.get('ID');

            const onTargetPage = window.location.href.includes('trade.php') &&
                                 currentStep === 'addmoney' &&
                                 currentID === ghostID;

            if (!onTargetPage) {
                if (panicOverlay) panicOverlay.innerHTML = "JUMPING TO<br>GHOST TRADE!";
                // Use replace to avoid history pollution if just switching params, but href assignment is safer for navigation
                window.location.href = `https://www.torn.com/trade.php#step=addmoney&ID=${ghostID}`;
                return;
            }

            // On the correct page, grab the total money from DOM
            const amountInput = document.querySelector('input[name="amount"]');
            const totalMoney = amountInput ? amountInput.getAttribute('data-money') : null;

            if (!totalMoney) {
                console.error("Torn Tactical: Could not find data-money attribute on input field.");
                if (panicOverlay) panicOverlay.innerHTML = "ERROR:<br>NO INPUT";
                return;
            }

            isSending = true;
            if (panicOverlay) panicOverlay.innerHTML = "EXECUTING<br>GHOST TRADE";

            console.log(`Torn Tactical: Auto-filling and clicking Change for Ghost ${ghostID}, Amount: ${totalMoney}`);

            // 1. Fill the input with the total amount
            amountInput.value = totalMoney;
            // Dispatch events to ensure any JS listeners pick up the change
            amountInput.dispatchEvent(new Event('input', { bubbles: true }));
            amountInput.dispatchEvent(new Event('change', { bubbles: true }));
            amountInput.dispatchEvent(new Event('blur', { bubbles: true })); // Some frameworks validate on blur

            // 2. Find and click the native 'Change' button
            const form = amountInput.form;
            const submitBtn = form ? form.querySelector('input[type="submit"], button[type="submit"]') : document.querySelector('input[type="submit"][value="Change"], button[type="submit"][value="Change"]');

            if (submitBtn) {
                // Check if button is disabled (Torn UI often disables buttons until validation passes)
                if (submitBtn.disabled || submitBtn.classList.contains('disabled')) {
                    console.log("Torn Tactical: Button is disabled, attempting to enable...");
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('disabled');
                }

                // Immediate execution: No artificial delay
                // The disabled check and removal happens synchronously above
                submitBtn.click();
                isSending = false;
            } else {
                console.error("Torn Tactical: Change button not found!");
                if (panicOverlay) panicOverlay.innerHTML = "ERROR:<br>NO BUTTON";
                isSending = false; // Reset if we couldn't click
            }

        } else {
            // Deposit to Faction
            if (currentBalance <= 0) {
                 if (panicOverlay) panicOverlay.innerHTML = "NO MONEY";
                 setTimeout(manualDismiss, 1000);
                 return;
            }

            // Strict Location Check: https://www.torn.com/factions.php?step=your&type=1#/tab=armoury
            const current = window.location.href;
            const onTargetPage = current.includes('factions.php') && current.includes('step=your') && current.includes('type=1') && current.includes('tab=armoury');

            if (!onTargetPage) {
                if (panicOverlay) panicOverlay.innerHTML = "JUMPING TO<br>FACTION!";
                window.location.href = `https://www.torn.com/factions.php?step=your&type=1#/tab=armoury`;
                return;
            }

            isSending = true;
            if (panicOverlay) panicOverlay.innerHTML = "SENDING TO<br>FACTION...";

            const formData = new FormData();
            formData.append('ajax', 'true');
            formData.append('step', 'armouryDonate');
            formData.append('type', 'cash');
            formData.append('amount', currentBalance);

            try {
                const response = await fetch(`https://www.torn.com/factions.php?rfcv=${rfcv}`, {
                    method: 'POST',
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                    body: formData
                });
                if (!response.redirected) {
                    const data = await response.json();
                    if (data.success) {
                        updateBalance(0);
                        if (panicOverlay) panicOverlay.innerHTML = "SAFE";
                        setTimeout(manualDismiss, 1000);
                    }
                }
            } catch (e) {
                console.error(e);
                if (panicOverlay) panicOverlay.innerHTML = "FAILED!";
            } finally {
                isSending = false;
                if (panicOverlay && currentBalance > 0) updatePanicOverlay();
                safeInjectButton();
            }
        }
    }

    // ==========================================
    // === 5. UI INJECTION ===
    // ==========================================

    let injectTimeout;
    function safeInjectButton() {
        if (injectTimeout) clearTimeout(injectTimeout);
        injectTimeout = setTimeout(realInjectButton, 100);
    }

    function realInjectButton() {
        const moneyEl = document.getElementById('user-money');
        if (!moneyEl) return;

        const container = moneyEl.closest('p') || moneyEl.parentElement;
        if (!container) return;

        let btn = document.getElementById('torn-tactical-deposit');
        if (!btn) {
            btn = document.createElement('a');
            btn.id = 'torn-tactical-deposit';
            btn.href = '#';

            const refLink = document.querySelector('a[aria-label*="Use"], a[href*="sid=points"], a[href*="sid=awards"]');
            if (refLink) {
                btn.className = refLink.className;
            } else {
                btn.style.cssText = 'margin-left: 10px; cursor: pointer; color: #999; text-decoration: none; font-size: 11px;';
            }
            btn.style.marginLeft = '8px';

            btn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                executeTacticalDeposit('ghost');
            });
        }

        if (moneyEl && moneyEl.parentNode) {
            if (moneyEl.nextSibling !== btn) {
                 moneyEl.parentNode.insertBefore(btn, moneyEl.nextSibling);
            }
        }

        const ghostID = getGhostID();
        if (ghostID) {
            btn.innerText = '[deposit]';
            btn.title = `Ghost Trade Ready (ID: ${ghostID})`;
            btn.style.color = '';
        } else {
            btn.innerText = '[deposit]';
            btn.style.color = '';
            btn.title = "Faction Deposit Only";
        }
    }

    function scanActiveTrades() {
        if (!window.location.href.includes('trade.php')) return;
        if (isTradeDeadOnCurrentPage) return;

        if (window.location.href.includes('ID=')) {
             const params = new URLSearchParams(window.location.hash.substring(1) || window.location.search);
             const id = params.get('ID');
             if (id) saveGhostID(id);
        }

        const trades = document.querySelectorAll('ul.trade-list-container > li');
        if (trades.length === 0) return;
        trades.forEach(trade => {
            const userEl = trade.querySelector('.user.name');
            const linkEl = trade.querySelector('a.btn-wrap');
            if (userEl && linkEl) {
                const name = userEl.innerText.toLowerCase();
                const isGhost = name.includes(GHOST_KEYWORD);
                const isValid = STRICT_GHOST_MODE ? isGhost : true;
                if (isValid) {
                    const match = linkEl.href.match(/ID=(\d+)/);
                    if (match) saveGhostID(match[1]);
                }
            }
        });
    }

    function saveGhostID(id) {
        if (localStorage.getItem(STORAGE_KEY) !== id) {
            localStorage.setItem(STORAGE_KEY, id);
            safeInjectButton();
        }
    }

    // ==========================================
    // === 6. PANIC UI ===
    // ==========================================
    function triggerPanicMode() {
        if (!ENABLE_PANIC_MODE || currentBalance < PANIC_THRESHOLD) return;
        isPanicLocked = true;
        updatePanicOverlay();
    }

    function manualDismiss() {
        isPanicLocked = false;
        disablePanicOverlay();
    }

    function updatePanicOverlay() {
        if (!isPanicLocked || currentBalance <= 0) {
            disablePanicOverlay(); return;
        }
        if (!panicOverlay) {
            panicOverlay = document.createElement('div');
            panicOverlay.id = 'torn-panic-overlay';
            let css = `position: fixed; z-index: 2147483647; background: rgba(255, 0, 0, 0.9); color: white;
                font-family: 'Arial Black', sans-serif; font-size: 14px; text-align: center;
                padding: 10px 20px; border-radius: 30px; border: 3px solid white;
                box-shadow: 0 0 20px red; pointer-events: none; white-space: nowrap;`;

            // Default to off-screen, will be moved by mousemove
            css += `top: -999px; left: -999px; transform: translate(-50%, -50%);`;

            panicOverlay.style.cssText = css;
            document.body.appendChild(panicOverlay);

            document.addEventListener('mousemove', (e) => {
                if (isPanicLocked && panicOverlay) {
                    panicOverlay.style.left = e.clientX + 'px';
                    panicOverlay.style.top = e.clientY + 'px';
                }
            });
        }
        panicOverlay.style.display = 'block';
        if (!isSending) {
            const ghostID = getGhostID();
            const actionText = ghostID ? "GHOST" : "FACTION";
            panicOverlay.innerHTML = `DEPOSIT<br>${formatMoney(currentBalance)}<br><span style='font-size:10px'>${actionText}</span>`;
        }
    }

    function disablePanicOverlay() { if (panicOverlay) panicOverlay.style.display = 'none'; }

    // ==========================================
    // === 7. INITIALIZATION ===
    // ==========================================

    function updateBalance(rawMoney) {
        let val = rawMoney;
        if (typeof rawMoney === 'object' && rawMoney?.value) val = rawMoney.value;
        const num = parseInt(val);
        if (!isNaN(num)) {
            currentBalance = num;
            if (currentBalance >= PANIC_THRESHOLD) {
                triggerPanicMode();
            } else {
                if (isPanicLocked) manualDismiss();
            }
            if (isPanicLocked) updatePanicOverlay();
            if (currentBalance <= 0) manualDismiss();
        }
    }

    function handleGlobalInteraction(e) {
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable) return;

        if (isPanicLocked && currentBalance > 0) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            if (e.type === 'mousedown' || (e.type === 'keydown' && !e.repeat)) executeTacticalDeposit('auto');
            return;
        }

        if (e.type === 'keydown' && !e.repeat) {
            const code = e.code;
            if (code === DEPOSIT_KEY || code === GHOST_KEY) {
                e.preventDefault();
                if (DEPOSIT_KEY === GHOST_KEY) executeTacticalDeposit('auto');
                else if (code === DEPOSIT_KEY) executeTacticalDeposit('faction');
                else if (code === GHOST_KEY) executeTacticalDeposit('ghost');
            } else if (code === RESET_KEY) {
                e.preventDefault();
                if (localStorage.getItem(STORAGE_KEY)) {
                    localStorage.removeItem(STORAGE_KEY);
                    console.log("Torn Tactical: Ghost ID cleared via shortcut.");
                    if (panicOverlay) {
                        panicOverlay.innerHTML = "GHOST ID<br>CLEARED";
                        panicOverlay.style.display = 'block';
                        setTimeout(manualDismiss, 1000);
                    }
                    safeInjectButton(); // Refresh UI
                }
            }
        }
    }

    ['click', 'mousedown', 'mouseup', 'keydown', 'keypress', 'keyup'].forEach(evt => {
        window.addEventListener(evt, handleGlobalInteraction, true);
    });

    function scanPageForDeadSignals() {
        const msgElements = document.querySelectorAll('.info-msg, .error-msg, .confirm-risk-list, .msg-wrap, .alert-box');
        let combinedText = "";
        msgElements.forEach(el => combinedText += el.innerText + " ");

        if (combinedText.length < 10) {
             combinedText = document.title + " " + (document.querySelector('h4')?.innerText || "");
        }

        const lower = combinedText.toLowerCase();
        for (const signal of DEAD_SIGNALS) {
            if (lower.includes(signal)) {
                isTradeDeadOnCurrentPage = true;
                if (localStorage.getItem(STORAGE_KEY)) {
                    console.log(`💀 Trade Dead (Page Scan): ${signal}`);
                    localStorage.removeItem(STORAGE_KEY);
                    safeInjectButton();
                }
                return true;
            }
        }
        return false;
    }

    function initUI() {
        try { if (typeof sidebarData !== 'undefined') updateBalance(sidebarData?.user?.money); } catch(e){}
        try {
            const moneyEl = document.getElementById('user-money');
            if (moneyEl && moneyEl.getAttribute('data-money')) {
                updateBalance(moneyEl.getAttribute('data-money'));
            }
        } catch(e) {}

        const observer = new MutationObserver(() => {
            safeInjectButton();
            scanActiveTrades();
            scanPageForDeadSignals();
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            safeInjectButton();
            scanPageForDeadSignals();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
    } else {
        initUI();
    }

})();