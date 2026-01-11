// ==UserScript==
// @name         Torn Quick Deposit
// @namespace    http://tampermonkey.net/
// @version      1.2
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
    const PANIC_THRESHOLD = 20000000; // Panic Threshold: Only triggers if balance exceeds this
    const STRICT_GHOST_MODE = true; // Relaxed matching for Ghost trades (if false, any trade found is used)

    // Shortcut Configuration (Use KeyboardEvent.code)
    // Common codes: "Space", "KeyG", "KeyD", "Enter", "ControlLeft", etc.
    const DEPOSIT_KEY = "Space";
    const GHOST_KEY = "KeyG";
    const RESET_KEY = "KeyR";
    const PANIC_TOGGLE_KEY = "KeyP";

    // ================= CORE STATE =================
    const STORAGE_KEY = 'torn_tactical_ghost_id';
    const PANIC_STATE_KEY = 'torn_tactical_panic_enabled';
    const GHOST_KEYWORD = 'ghost';
    const DEAD_SIGNALS = [
        "no trade was found", "trade has been accepted",
        "trade has been declined", "trade has been cancelled","this trade is currently locked",
    ];

    let currentBalance = 0;
    let isPanicLocked = false;
    let isSending = false;
    let isJumping = false; // Separate lock for page jumps
    let panicOverlay = null;
    let isTradeDeadOnCurrentPage = false; // Flag: Whether the trade is confirmed dead on current page

    // Initialize Panic State (Default: ON)
    let isPanicEnabled = localStorage.getItem(PANIC_STATE_KEY) !== 'false';


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
                    localStorage.removeItem(STORAGE_KEY);
                    safeInjectButton(); // Refresh button status
                }
                break;
            }
        }
    }

    // ==========================================
    // === 3. PANIC SYSTEM (WebSocket & UI) ===
    // ==========================================
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        ws.addEventListener('message', function(event) {
            const data = event.data;
            if (typeof data === 'string') {
                if (data.includes('attack-effects')) {
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

    // --- Status Check Helpers ---
    function checkStatusRestrictions() {
        const icons = document.querySelectorAll('ul[class*="status-icons"] > li');

        // Safety First: If status icons are not loaded yet, assume OK (Aggressive Mode)
        // We prefer to try and fail rather than blocking the user if the DOM is lagging
        if (icons.length === 0) {
            return {
                canFaction: true,
                canGhost: true,
                reason: "NO_ICONS"
            };
        }

        let status = {
            canFaction: true,
            canGhost: true,
            reason: ""
        };

        icons.forEach(li => {
            const className = li.className;
            const ariaLabel = li.querySelector('a')?.getAttribute('aria-label') || "";

            // Check for Hospital (icon15) or Jail (icon16)
            if (className.includes('icon15') || className.includes('icon16')) {
                status.canFaction = false;
                status.reason = "HOSP/JAIL";
            }

            // Check for Traveling
            // The class name for traveling can vary (e.g. icon71 in user input),
            // but checking aria-label "Traveling" is more robust based on provided HTML
            if (ariaLabel.includes('Traveling')) {
                status.canFaction = false;
                status.canGhost = false;
                status.reason = "TRAVELING";
            }
        });

        return status;
    }

    function triggerPanicMode() {
        if (!isPanicEnabled || currentBalance < PANIC_THRESHOLD) {
             if (isPanicLocked) manualDismiss();
             return;
        }

        // Check restrictions before triggering panic
        const status = checkStatusRestrictions();
        const ghostID = getGhostID();

        // If we have Ghost ID, we only care if Ghost is allowed
        // If we don't have Ghost ID, we default to Faction, so Faction must be allowed
        const canExecute = ghostID ? status.canGhost : status.canFaction;

        if (!canExecute) {
            return;
        }

        isPanicLocked = true;
        updatePanicOverlay();
    }
    // ==========================================
    // === 4. TACTICAL LOGIC ===
    // ==========================================

    // Mode: 'auto' (priority), 'faction' (force faction), 'ghost' (force G-Bank)
    async function executeTacticalDeposit(mode = 'auto') {
        // 1. Priority Check: Existing Confirmation Box
        // This must happen BEFORE isSending check to allow immediate confirmation
        const confirmBoxes = document.querySelectorAll('.cash-confirm');
        for (const box of confirmBoxes) {
            if (box.offsetParent !== null && box.style.display !== 'none') {
                const yesBtn = box.querySelector('.yes');
                if (yesBtn) {
                    if (panicOverlay) panicOverlay.innerHTML = "DEPOSITING...";
                    yesBtn.click();
                    isSending = false;
                    return;
                }
            }
        }

        // Allow execution even if balance is 0 to ensure feedback, checks will happen inside
        if (isSending) return;

        // Check Status Restrictions
        const status = checkStatusRestrictions();
        if (!status.canFaction && !status.canGhost) {
            // If loading, silent fail to allow retry once loaded
            if (status.reason === "LOADING...") {
                return;
            }
            return;
        }

        const ghostID = getGhostID();
        let useGhost = false;

        if (mode === 'faction') {
            useGhost = false;
        } else if (mode === 'ghost') {
            useGhost = true; // Strict Ghost Mode: If ID is missing, it should fail
        } else {
            // mode === 'auto' -> Priority: Ghost > Faction
            useGhost = !!ghostID;
        }

        // Apply restrictions
        if (useGhost) {
             if (!ghostID) {
                 if (mode === 'ghost') {
                      return;
                 }
                 useGhost = false; // Auto fallback
             } else if (!status.canGhost) {
                 if (mode === 'ghost') {
                      return;
                 }
                 useGhost = false;
             }
        }
        if (!useGhost && !status.canFaction) {
             return;
        }

        const rfcv = getRfcv();
        if (!rfcv) {
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
                // Prevent multiple jump attempts
                if (isJumping) return;
                isJumping = true;
                if (panicOverlay) panicOverlay.innerHTML = "JUMPING<br>TO GHOST";
                setTimeout(() => { isJumping = false; }, 1500); // Safety unlock if page doesn't reload

                // Use replace to avoid history pollution if just switching params, but href assignment is safer for navigation
                window.location.href = `https://www.torn.com/trade.php#step=addmoney&ID=${ghostID}`;
                return;
            }

            // On the correct page, grab the total money from DOM
            const amountInput = document.querySelector('input[name="amount"]');
            const totalMoney = amountInput ? amountInput.getAttribute('data-money') : null;

            if (!totalMoney) {
                // Silent fail to allow retry
                return;
            }

            isSending = true;
            if (panicOverlay) panicOverlay.innerHTML = "DEPOSITING<br>TO GHOST";

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
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('disabled');
                }

                // Immediate execution: No artificial delay
                // The disabled check and removal happens synchronously above
                submitBtn.click();
                isJumping = false;

                // isSending remains true until balance update clears it
            } else {
                // Silent fail to allow retry
                isSending = false; // Reset if we couldn't click
            }

        } else {
            // Deposit to Faction

            // Note: We check if the donation form is present first.
            const donationForm = document.querySelector('.give-money-form') || (document.querySelector('.input-money') ? document.querySelector('.input-money').closest('form') || document.querySelector('.input-money').closest('ul') : null);

            if (!donationForm) {
                const current = window.location.href;
                const onTargetPage = current.includes('factions.php') && current.includes('step=your') && current.includes('type=1') && current.includes('tab=armoury');

                if (!onTargetPage) {
                    // Prevent multiple jump attempts
                    if (isJumping) return;
                    isJumping = true;
                    if (panicOverlay) panicOverlay.innerHTML = "JUMPING<br>TO FACTION";
                    setTimeout(() => { isJumping = false; }, 1500); // Safety unlock if page doesn't reload

                    window.location.href = `https://www.torn.com/factions.php?step=your&type=1#/tab=armoury`;
                    return;
                } else {
                     // We are on the target page URL, but form is missing.
                     // Try to click the Armoury tab just in case it's not active or needs refresh
                     const armouryTab = document.querySelector('a[href*="tab=armoury"]');
                     if (armouryTab) {
                         armouryTab.click();
                         return;
                     }

                     // Silent fail to allow retry
                     return;
                }
            }

            if (currentBalance <= 0) {
                 // Do not dismiss panic overlay here
                 return;
            }

            isSending = true;

            // 1. Find Input and Determine Amount
            const amountInput = donationForm.querySelector('.input-money[type="text"]');
            if (!amountInput) {
                 // Silent fail to allow retry
                 isSending = false;
                 return;
            }

            // Determine Amount to Deposit
            let depositAmount = currentBalance;

            // Try to get from data-money on input (most reliable for max amount)
            const dataMoney = amountInput.getAttribute('data-money');
            if (dataMoney) {
                depositAmount = dataMoney;
            } else {
                // Fallback: Try to read from "You have $X" text
                const iHaveEl = donationForm.querySelector('.i-have');
                if (iHaveEl) {
                    const text = iHaveEl.innerText.replace(/[$,]/g, '');
                    if (text && !isNaN(text)) {
                        depositAmount = text;
                    }
                }
            }

            if (!depositAmount || depositAmount <= 0) {
                 isSending = false;
                 return;
            }

            // 2. Set Value
            amountInput.value = depositAmount;
            amountInput.dispatchEvent(new Event('input', { bubbles: true }));
            amountInput.dispatchEvent(new Event('change', { bubbles: true }));
            amountInput.dispatchEvent(new Event('blur', { bubbles: true }));

            // 3. Find Button
            const submitBtn = donationForm.querySelector('button.torn-btn');
            if (submitBtn) {
                 if (submitBtn.disabled || submitBtn.classList.contains('disabled')) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('disabled');
                }

                if (panicOverlay) panicOverlay.innerHTML = "DEPOSITING<br>TO FACTION";
                submitBtn.click();
                // isSending remains true until balance update clears it
            } else {
                // Silent fail to allow retry
                isSending = false;
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
                executeTacticalDeposit('auto');
            });
        }

        if (moneyEl && moneyEl.parentNode) {
            if (moneyEl.nextSibling !== btn) {
                 moneyEl.parentNode.insertBefore(btn, moneyEl.nextSibling);
            }
        }

        const ghostID = getGhostID();
        if (ghostID) {
            btn.innerText = '[ghost]';
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

    function manualDismiss() {
        isPanicLocked = false;
        disablePanicOverlay();
    }

    // Toggle Panic Mode via Shortcut
    function togglePanicMode() {
        isPanicEnabled = !isPanicEnabled;
        localStorage.setItem(PANIC_STATE_KEY, isPanicEnabled);

        // Show Toast Feedback
        showToast(`PANIC MODE <span style="color:${isPanicEnabled ? '#4dff4d' : '#ff4d4d'}">${isPanicEnabled ? 'ON' : 'OFF'}</span>`);

        if (isPanicEnabled) {
            // Re-evaluate if we should trigger panic immediately
            if (currentBalance >= PANIC_THRESHOLD) {
                setTimeout(() => {
                    const status = checkStatusRestrictions();
                    const ghostID = getGhostID();
                    const canExecute = ghostID ? status.canGhost : status.canFaction;
                    if (canExecute) triggerPanicMode();
                }, 200);
            }
        } else {
            manualDismiss();
        }
    }

    function showToast(html) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 15%; left: 50%; transform: translate(-50%, -50%);
            z-index: 2147483647; background: rgba(0, 0, 0, 0.85); color: white;
            font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold;
            padding: 12px 24px; border-radius: 8px; pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            opacity: 0; transition: opacity 0.3s ease-in-out;
            text-align: center; border: 1px solid rgba(255,255,255,0.2);
        `;
        toast.innerHTML = `<div style="font-size:11px; color:#aaa; margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">Quick Deposit</div>${html}`;

        document.body.appendChild(toast);

        // Fade In
        requestAnimationFrame(() => toast.style.opacity = '1');

        // Fade Out
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
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
                box-shadow: 0 0 20px red; cursor: pointer; white-space: nowrap; user-select: none;`;

            // Default to off-screen, will be moved by mousemove
            css += `top: -999px; left: -999px; transform: translate(-50%, -50%);`;

            panicOverlay.style.cssText = css;
            document.body.appendChild(panicOverlay);

            // Click listener for the Panic Button
            panicOverlay.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                executeTacticalDeposit('auto');
            });

            document.addEventListener('mousemove', (e) => {
                if (isPanicLocked && panicOverlay) {
                    panicOverlay.style.left = e.clientX + 'px';
                    panicOverlay.style.top = e.clientY + 'px';
                }
            });
        }
        panicOverlay.style.display = 'block';
        if (!isSending && !isJumping) {
            // Predict action based on current state

            // 1. Check for Confirmation Box
            let hasConfirm = false;
            const confirmBoxes = document.querySelectorAll('.cash-confirm');
            for (const box of confirmBoxes) {
                if (box.offsetParent !== null && box.style.display !== 'none' && box.querySelector('.yes')) {
                    hasConfirm = true;
                    break;
                }
            }
            if (hasConfirm) {
                panicOverlay.innerHTML = "CONFIRM<br>DEPOSIT";
                return;
            }

            const ghostID = getGhostID();
            if (ghostID) {
                // Ghost Mode
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const searchParams = new URLSearchParams(window.location.search);
                const currentStep = hashParams.get('step') || searchParams.get('step');
                const currentID = hashParams.get('ID') || searchParams.get('ID');

                const onGhostPage = window.location.href.includes('trade.php') &&
                                    currentStep === 'addmoney' &&
                                    currentID === ghostID;

                if (onGhostPage) {
                    panicOverlay.innerHTML = `DEPOSIT<br>${formatMoney(currentBalance)}<br><span style='font-size:10px'>GHOST</span>`;
                } else {
                    panicOverlay.innerHTML = `JUMP TO<br>GHOST`;
                }
            } else {
                // Faction Mode
                // Check if we are ready to deposit (form exists)
                const donationForm = document.querySelector('.give-money-form') ||
                                   (document.querySelector('.input-money') ?
                                    document.querySelector('.input-money').closest('form') ||
                                    document.querySelector('.input-money').closest('ul') : null);

                // Also check if we are on the target URL (even if form is loading/missing)
                // This prevents "JUMP TO FACTION" from showing when we are already there
                const current = window.location.href;
                const onTargetPage = current.includes('factions.php') && current.includes('step=your') && current.includes('type=1') && current.includes('tab=armoury');

                if (donationForm || onTargetPage) {
                    panicOverlay.innerHTML = `DEPOSIT<br>${formatMoney(currentBalance)}`;
                } else {
                    panicOverlay.innerHTML = `JUMP TO<br>FACTION`;
                }
            }
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

            // Check restrictions again on balance update to auto-dismiss if status changed
            const status = checkStatusRestrictions();
            const ghostID = getGhostID();
            const canExecute = ghostID ? status.canGhost : status.canFaction;

            if (currentBalance >= PANIC_THRESHOLD && canExecute) {
                triggerPanicMode();
            } else {
                if (isPanicLocked) manualDismiss();
                // If balance drops below threshold, we assume deposit succeeded or user spent money.
                // Reset sending state so we don't get stuck in "DEPOSITING" if user somehow gets money again quickly.
                isSending = false;
            }
            if (isPanicLocked) updatePanicOverlay();
            if (currentBalance <= 0) {
                manualDismiss();
                isSending = false;
            }
        }
    }

    function handleGlobalInteraction(e) {
        if (!e.isTrusted) return; // Allow script-generated events

        // Exclude interaction with specific UI elements to prevent blocking valid clicks
        if (e.target.closest('#torn-tactical-deposit') ||
            e.target.closest('button') ||
            e.target.closest('input[type="submit"]') ||
            e.target.closest('a.torn-btn')) {
            return;
        }

        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement.isContentEditable) return;

        if (e.type === 'keydown' && !e.repeat) {
            const code = e.code;
            if (code === DEPOSIT_KEY || code === GHOST_KEY) {
                e.preventDefault();
                if (DEPOSIT_KEY === GHOST_KEY) executeTacticalDeposit('auto');
                else if (code === DEPOSIT_KEY) executeTacticalDeposit('faction');
                else if (code === GHOST_KEY) {
                     if (!getGhostID()) return; // Strict Ghost Shortcut: Do nothing if no ID
                     executeTacticalDeposit('ghost');
                }
            } else if (code === RESET_KEY) {
                e.preventDefault();
                if (localStorage.getItem(STORAGE_KEY)) {
                    localStorage.removeItem(STORAGE_KEY);
                    if (panicOverlay) {
                        panicOverlay.innerHTML = "GHOST ID<br>CLEARED";
                        panicOverlay.style.display = 'block';
                        setTimeout(manualDismiss, 1000);
                    }
                    safeInjectButton(); // Refresh UI
                }
            } else if (code === PANIC_TOGGLE_KEY) {
                e.preventDefault();
                togglePanicMode();
            }
        }
    }

    ['click', 'mousedown', 'mouseup', 'keydown', 'keypress', 'keyup'].forEach(evt => {
        window.addEventListener(evt, handleGlobalInteraction, true);
    });

    // Listen for storage changes to sync Panic Mode state across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === PANIC_STATE_KEY) {
            isPanicEnabled = e.newValue !== 'false';
            if (!isPanicEnabled) {
                manualDismiss();
            } else {
                // If enabled, check if we should trigger immediately
                if (currentBalance >= PANIC_THRESHOLD) {
                    const status = checkStatusRestrictions();
                    const ghostID = getGhostID();
                    const canExecute = ghostID ? status.canGhost : status.canFaction;
                    if (canExecute) triggerPanicMode();
                }
            }
        }
    });

    // Monitor URL changes for SPA navigation (Hash changes) to clear Jump Lock immediately
    function handleUrlChange() {
        const ghostID = getGhostID();

        // If we are locked in "JUMPING" state, check if we arrived
        if (isJumping && ghostID) {
             const hashParams = new URLSearchParams(window.location.hash.substring(1));
             const searchParams = new URLSearchParams(window.location.search);
             const currentStep = hashParams.get('step') || searchParams.get('step');
             const currentID = hashParams.get('ID') || searchParams.get('ID');

             const onGhostPage = window.location.href.includes('trade.php') &&
                                 currentStep === 'addmoney' &&
                                 currentID === ghostID;

             if (onGhostPage) {
                 isJumping = false;
             }
        }

        // Always update overlay to reflect new URL state
        if (isPanicLocked) updatePanicOverlay();
    }

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

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
                    localStorage.removeItem(STORAGE_KEY);
                    safeInjectButton();
                }
                return true;
            }
        }
        return false;
    }

    // Use MutationObserver to speed up confirmation box detection
    // Instead of waiting for intervals, we listen for the box appearing
    const confirmObserver = new MutationObserver((mutations) => {
        if (!isSending) return; // Only relevant if we are in a deposit flow

        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const boxes = document.querySelectorAll('.cash-confirm');
                for (const box of boxes) {
                    if (box.offsetParent !== null && box.style.display !== 'none') {
                        // Box is visible!
                        // We don't auto-click anymore, just update internal state if needed
                        return;
                    }
                }
            }
        }
    });

    function initUI() {
        try { if (typeof sidebarData !== 'undefined') updateBalance(sidebarData?.user?.money); } catch(e){ }
        try {
            const moneyEl = document.getElementById('user-money');
            if (moneyEl && moneyEl.getAttribute('data-money')) {
                updateBalance(moneyEl.getAttribute('data-money'));
            }
        } catch(e) { }

        const observer = new MutationObserver(() => {
            if (injectTimeout) clearTimeout(injectTimeout);
            injectTimeout = setTimeout(() => {
                safeInjectButton();
                scanActiveTrades();
                scanPageForDeadSignals();

                // Re-check panic eligibility when DOM changes (e.g. status icons update)
                if (currentBalance >= PANIC_THRESHOLD) {
                    const status = checkStatusRestrictions();
                    const ghostID = getGhostID();
                    const canExecute = ghostID ? status.canGhost : status.canFaction;

                    if (canExecute) {
                        if (!isPanicLocked) triggerPanicMode();
                    } else {
                        // Only dismiss if NOT loading, to avoid flashing off during page transitions
                        if (status.reason !== "LOADING..." && isPanicLocked) manualDismiss();
                    }
                }
            }, 200); // Debounce all heavy DOM scans
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            confirmObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
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
