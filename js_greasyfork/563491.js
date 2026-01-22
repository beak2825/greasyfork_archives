// ==UserScript==
// @name         Torn Bazaar Turret (Grand Total Check)
// @namespace    http://tampermonkey.net/
// @version      38.0
// @description  Checks the cost of the ENTIRE queue when you click start. Alerts you of the total deficit if you are short.
// @author       Dirt-Fairy, Gemini
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563491/Torn%20Bazaar%20Turret%20%28Grand%20Total%20Check%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563491/Torn%20Bazaar%20Turret%20%28Grand%20Total%20Check%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const SETTINGS = {
        buyBtn: 'button[aria-label^="Buy:"]',
        qtyInput: 'input[class*="buyAmountInput"]',
        confirmBtn: 'button[aria-label="Yes"]',
        successMsg: '.msg-wrap.success, .message-container.success, div[class*="success-msg"]',

        // SELECTORS
        itemPrice: '[data-testid="price"]',
        itemStock: '[data-testid="amount-value"]',
        userMoney: '#user-money', // Sidebar money

        clickCooldown: 50,
        primeAttack: true,
        triggerKeys: ['Space', 'Enter', 'NumpadEnter']
    };

    const STORAGE_KEY = 'torn_turret_v38_queue';
    const POS_KEY = 'torn_turret_v38_pos';
    const LOCK_KEY = 'torn_turret_v38_locked';

    let queue = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let savedPos = JSON.parse(localStorage.getItem(POS_KEY)) || { top: '50px', left: '', right: '20px' };
    let isLocked = JSON.parse(localStorage.getItem(LOCK_KEY)) || false;

    let lastActionTime = 0;
    let loopInterval = null;
    let primedTab = null;

    let state = {
        waitingForClose: false,
        confirmClickTime: 0
    };

    // --- STYLES ---
    GM_addStyle(`
        #bq-overlay {
            position: fixed; z-index: 9999999; font-family: Arial, sans-serif; width: 280px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        #bq-header {
            background: #222; color: #00bfff; padding: 10px; border: 1px solid #444; border-radius: 4px 4px 0 0;
            font-weight: bold; font-size: 13px;
            user-select: none;
            display: flex; justify-content: space-between; align-items: center;
        }
        .bq-draggable { cursor: move; }
        .bq-locked { cursor: default; }

        #bq-panel { background: #111; color: #ccc; border: 1px solid #444; border-top: none; padding: 10px; }

        #bq-action-btn {
            width: 100%; height: 80px; background: #333; color: #777;
            border: 2px dashed #555; font-weight: bold; font-size: 14px;
            cursor: not-allowed; display: flex; align-items: center; justify-content: center;
            text-align: center; margin-bottom: 10px; transition: all 0.05s;
            white-space: pre-wrap; user-select: none;
        }
        .bq-ready {
            background: #28a745 !important; color: #fff !important;
            border: 2px solid #fff !important; cursor: pointer !important;
            box-shadow: 0 0 15px #28a745;
        }
        .bq-blue {
            background: #007bff !important; color: #fff !important;
            border: 2px solid #fff !important; cursor: pointer !important;
            box-shadow: 0 0 15px #007bff;
        }
        .bq-confirm {
            background: #dc3545 !important; color: #fff !important;
            cursor: pointer !important;
            box-shadow: 0 0 15px #dc3545; animation: pulse 0.2s infinite alternate;
        }
        .bq-attack {
            background: #8b0000 !important; color: #fff !important;
            border: 2px solid #ff4444 !important; cursor: pointer !important;
            box-shadow: 0 0 15px #ff0000;
        }
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.02); } }

        #bq-list { max-height: 200px; overflow-y: auto; margin-bottom: 8px; border: 1px solid #333; background: #222; }
        .bq-item { border-bottom: 1px solid #333; padding: 4px; display: flex; justify-content: space-between; align-items: center; }

        .bq-link { color: #8cf; text-decoration: none; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; margin-right: 5px;}
        .bq-meta { font-size: 9px; color: #888; display: block; }

        .bq-qty-input { width: 45px; background: #333; border: 1px solid #555; color: #ffeb3b; text-align: center; font-size: 11px; margin: 0 2px; -moz-appearance: textfield; }
        .bq-qty-input::-webkit-outer-spin-button, .bq-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .bq-max-btn { color: #00bfff; cursor: pointer; font-size: 10px; font-weight: bold; padding: 2px 4px; border: 1px solid #444; background: #222; margin-right: 5px; }
        .bq-max-btn:hover { background: #00bfff; color: #000; }
        .bq-del { color: #f44; cursor: pointer; padding: 0 5px; }
        .bq-btn { width: 100%; padding: 6px; cursor: pointer; margin-top: 5px; background: #444; color: #fff; border: 1px solid #666; }
        .bq-inject-btn { position: absolute; top:0; right:0; z-index:10; background:#007bff; color:#fff; border:none; padding:2px 5px; font-size:10px; cursor:pointer; }
        .bq-wrapper { position: relative; display: inline-block; }
        .hidden { display: none !important; }

        .bq-ctrl-grp { display:flex; gap: 5px; }
        .bq-mini-btn { font-size: 12px; padding: 2px 6px; cursor: pointer; background: #333; border: 1px solid #555; color: #fff; min-width: 25px; }
        .bq-mini-btn:hover { background: #555; }
    `);

    function setNativeValue(element, value) {
        const lastValue = element.value;
        element.value = value;
        const event = new Event("input", { target: element, bubbles: true });
        const tracker = element._valueTracker;
        if (tracker) { tracker.setValue(lastValue); }
        element.dispatchEvent(event);
    }

    // --- MONEY HELPER ---
    function getCashOnHand() {
        const moneyEl = document.querySelector(SETTINGS.userMoney);
        if (moneyEl) {
            return parseInt(moneyEl.innerText.replace(/[$,]/g, '')) || 0;
        }
        return Infinity;
    }

    // --- QUEUE TOTAL HELPER ---
    function getQueueTotal() {
        return queue.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    // --- GUI & DRAGGABLE LOGIC ---
    function createGUI() {
        if (document.getElementById('bq-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'bq-overlay';
        overlay.style.top = savedPos.top;
        if(savedPos.left) overlay.style.left = savedPos.left;
        if(savedPos.right) overlay.style.right = savedPos.right;

        const lockIcon = isLocked ? '🔒' : '🔓';
        const dragClass = isLocked ? 'bq-locked' : 'bq-draggable';

        overlay.innerHTML = `
            <div id="bq-header" class="${dragClass}">
                <span id="bq-title-text">▼ Turret</span>
                <div class="bq-ctrl-grp">
                    <button class="bq-mini-btn" id="bq-lock-btn" title="Lock Position">${lockIcon}</button>
                    <button class="bq-mini-btn" id="bq-toggle-btn" title="Minimize">-</button>
                </div>
            </div>
            <div id="bq-panel">
                <div id="bq-action-btn">WAITING...</div>
                <div id="bq-controls">
                    <button id="bq-scan" class="bq-btn">Scan & Inject (+Q)</button>
                    <button id="bq-clear" class="bq-btn">Clear Queue</button>
                    <button id="bq-skip" class="bq-btn hidden" style="background:#d63384;">Skip Item</button>
                </div>
                <div id="bq-list"></div>
                <div style="font-size:10px; color:#555; margin-top:5px; text-align:center;">
                    Spacebar = Buy
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const lockBtn = document.getElementById('bq-lock-btn');
        const header = document.getElementById('bq-header');

        lockBtn.onclick = (e) => {
            e.stopPropagation();
            isLocked = !isLocked;
            localStorage.setItem(LOCK_KEY, JSON.stringify(isLocked));
            lockBtn.innerText = isLocked ? '🔒' : '🔓';
            header.className = isLocked ? 'bq-locked' : 'bq-draggable';
        };

        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            if (isLocked) return;
            if (e.target.tagName === 'BUTTON') return;

            isDragging = true;
            offsetX = e.clientX - overlay.getBoundingClientRect().left;
            offsetY = e.clientY - overlay.getBoundingClientRect().top;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            overlay.style.left = `${x}px`;
            overlay.style.top = `${y}px`;
            overlay.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                const rect = overlay.getBoundingClientRect();
                savedPos = { top: `${rect.top}px`, left: `${rect.left}px`, right: '' };
                localStorage.setItem(POS_KEY, JSON.stringify(savedPos));
            }
        });

        document.getElementById('bq-toggle-btn').onclick = (e) => {
            e.stopPropagation();
            const panel = document.getElementById('bq-panel');
            panel.classList.toggle('hidden');
            e.target.innerText = panel.classList.contains('hidden') ? '+' : '-';
        };

        document.getElementById('bq-scan').onclick = scanAndInject;
        document.getElementById('bq-clear').onclick = () => { queue=[]; save(); render(); };
        document.getElementById('bq-skip').onclick = skipItem;

        const actionBtn = document.getElementById('bq-action-btn');
        actionBtn.onclick = (e) => {
            if (isActionable(actionBtn)) executeProxyClick();
        };

        render();
        loopInterval = setInterval(turretLoop, 50);

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (SETTINGS.triggerKeys.includes(e.code)) {
                e.preventDefault();
                const btn = document.getElementById('bq-action-btn');
                if (isActionable(btn)) {
                    btn.style.transform = "scale(0.95)";
                    setTimeout(() => btn.style.transform = "scale(1)", 100);
                    executeProxyClick();
                }
            }
        });
    }

    function isActionable(btn) {
        return btn.classList.contains('bq-ready') ||
               btn.classList.contains('bq-blue') ||
               btn.classList.contains('bq-confirm') ||
               btn.classList.contains('bq-attack');
    }

    // --- SCANNER ---
    function scanAndInject() {
        if (primedTab) { try{ primedTab.close(); } catch(e){} primedTab = null; }

        if (SETTINGS.primeAttack) {
            const params = new URLSearchParams(window.location.search);
            const userId = params.get('userId');
            if (userId) {
                const url = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
                primedTab = GM_openInTab(url, { active: false, insert: true });
            }
        }

        const buttons = document.querySelectorAll(SETTINGS.buyBtn);
        let count = 0;
        buttons.forEach(btn => {
            let wrapper = btn.closest('.bq-wrapper');
            if (!wrapper) {
                wrapper = document.createElement('span');
                wrapper.className = 'bq-wrapper';
                btn.parentNode.insertBefore(wrapper, btn);
                wrapper.appendChild(btn);
            }
            if (wrapper.querySelector('.bq-inject-btn')) return;

            let name = (btn.getAttribute('aria-label')||'').replace('Buy: ','').trim();
            if(!name) return;

            // --- DATA SCRAPING ---
            let price = 0;
            let avail = 1;
            const itemContainer = btn.closest('div[class*="item"]') || btn.closest('li');

            if (itemContainer) {
                const priceEl = itemContainer.querySelector(SETTINGS.itemPrice);
                const stockEl = itemContainer.querySelector(SETTINGS.itemStock);

                if (priceEl) {
                    const text = priceEl.innerText;
                    const match = text.match(/\$?([0-9,]+)/);
                    if (match) {
                        price = parseInt(match[1].replace(/,/g, '')) || 0;
                    }
                }

                if (stockEl) {
                    const val = parseInt(stockEl.innerText.replace(/,/g, '')) || 1;
                    avail = val;
                }
            }

            const q = document.createElement('button');
            q.innerText = '+Q'; q.className = 'bq-inject-btn';
            q.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                addQueue(name, window.location.href, 1, price, avail);
                q.innerText = '✔';
            };
            wrapper.appendChild(q);
            count++;
        });
        const b = document.getElementById('bq-scan');
        b.innerText = count>0 ? `Found ${count}` : 'None';
        setTimeout(()=>b.innerText='Scan & Inject (+Q)', 2000);
    }

    function addQueue(name, url, qty, price, avail) {
        queue.push({name, url, qty, price, avail});
        save();
        render();
    }

    function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(queue)); }

    // --- RENDER ---
    function render() {
        const list = document.getElementById('bq-list'); list.innerHTML = '';
        const title = document.getElementById('bq-title-text');

        let grandTotal = 0;
        let queueCount = queue.length;

        queue.forEach((item, index) => {
            let itemTotal = item.price * item.qty;
            grandTotal += itemTotal;

            const row = document.createElement('div'); row.className = 'bq-item';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'bq-link';
            nameDiv.innerHTML = `
                <div>${index+1}. ${item.name}</div>
                <span class="bq-meta">Stock: ${item.avail.toLocaleString()} | $${item.price.toLocaleString()}</span>
            `;

            const maxBtn = document.createElement('span');
            maxBtn.className = 'bq-max-btn';
            maxBtn.innerText = 'M';
            maxBtn.title = "Set Max to Available";
            maxBtn.onclick = () => {
                queue[index].qty = item.avail > 0 ? item.avail : 999999;
                save(); render();
            };

            const qtyInput = document.createElement('input');
            qtyInput.type = 'number';
            qtyInput.className = 'bq-qty-input';
            qtyInput.value = item.qty;
            qtyInput.onchange = (e) => { queue[index].qty = e.target.value; save(); render(); };

            const delBtn = document.createElement('div');
            delBtn.className = 'bq-del';
            delBtn.innerText = '×';
            delBtn.onclick = () => { queue.splice(index,1); save(); render(); };

            row.appendChild(nameDiv);
            row.appendChild(maxBtn);
            row.appendChild(qtyInput);
            row.appendChild(delBtn);
            list.appendChild(row);
        });

        if (grandTotal > 0) {
            const formattedTotal = grandTotal.toLocaleString();
            title.innerText = `▼ Turret ($${formattedTotal})`;
        } else {
            title.innerText = `▼ Turret (${queueCount})`;
        }
    }

    // --- MAIN LOOP ---
    function turretLoop() {
        const btn = document.getElementById('bq-action-btn');
        const skipBtn = document.getElementById('bq-skip');

        if (queue.length === 0) {
            skipBtn.classList.add('hidden');

            const params = new URLSearchParams(window.location.search);
            const userId = params.get('userId');

            if (userId) {
                btn.className = 'bq-attack';
                if (primedTab) {
                     btn.innerText = `ATTACK (READY)\nSPACE TO SWITCH`;
                } else {
                     btn.innerText = `ATTACK SELLER\n(ID: ${userId})`;
                }
                btn.dataset.target = "attack";
                btn.dataset.attackId = userId;
            } else {
                btn.className = '';
                btn.innerText = "QUEUE EMPTY";
            }
            return;
        }

        const item = queue[0];
        const now = Date.now();
        skipBtn.classList.remove('hidden');

        if (now - lastActionTime < SETTINGS.clickCooldown) return;

        const success = document.querySelector(SETTINGS.successMsg);
        if (success && success.offsetParent !== null) {
            handleSuccess(btn);
            return;
        }

        if (state.waitingForClose) {
            const confirmBtn = document.querySelector(SETTINGS.confirmBtn);
            const qtyInput = document.querySelector(SETTINGS.qtyInput);
            if (!confirmBtn && !qtyInput) {
                if (now - state.confirmClickTime > 100) {
                    handleSuccess(btn);
                    return;
                } else {
                    btn.innerText = "PROCESSING...";
                    btn.className = '';
                    return;
                }
            }
        }

        const confirmBtn = document.querySelector(SETTINGS.confirmBtn);
        if (confirmBtn && confirmBtn.offsetParent !== null) {
            btn.className = 'bq-confirm';
            btn.innerText = `CONFIRM (x${item.qty})`;
            btn.dataset.target = "confirm";
            state.waitingForClose = false;
            return;
        }

        const qtyInput = document.querySelector(SETTINGS.qtyInput);
        if (qtyInput && qtyInput.offsetParent !== null) {
            if (qtyInput.value != item.qty) {
                qtyInput.focus();
                setNativeValue(qtyInput, item.qty);
            }
            btn.className = 'bq-blue';
            btn.innerText = `CLICK TO BUY\n(x${item.qty})`;
            btn.dataset.target = "qty-buy";
            state.waitingForClose = false;
            return;
        }

        const buyButtons = document.querySelectorAll(SETTINGS.buyBtn);
        let targetBtn = null;
        for (let b of buyButtons) {
            const label = b.getAttribute('aria-label') || '';
            if (label.includes(item.name)) {
                targetBtn = b;
                break;
            }
        }

        if (targetBtn) {
            btn.className = 'bq-ready';
            btn.innerText = `START: OPEN CART\n${item.name}`;
            btn.dataset.target = "open";
            state.waitingForClose = false;
        } else {
            if (!state.waitingForClose) {
                btn.className = '';
                btn.innerText = `SEARCHING...\n(${item.name})`;
            }
        }
    }

    function handleSuccess(btn) {
        queue.shift();
        save();
        render();
        state.waitingForClose = false;
        state.lastClicked = null;
        const success = document.querySelector(SETTINGS.successMsg);
        if (success) success.style.display = 'none';
        btn.innerText = "NEXT...";
        lastActionTime = 0;
    }

    function executeProxyClick() {
        const btn = document.getElementById('bq-action-btn');
        const mode = btn.dataset.target;
        const item = queue[0];

        if (mode === 'attack') {
            const userId = btn.dataset.attackId;
            const url = `https://www.torn.com/loader.php?sid=attack&user2ID=${userId}`;
            try { window.close(); } catch (e) { console.log("Window close blocked"); }
            setTimeout(() => {
                if (primedTab) { try { primedTab.close(); } catch(e){} primedTab = null; }
                window.location.href = url;
            }, 50);
            return;
        }

        // --- CASH CHECK (TOTAL QUEUE HARD STOP) ---
        if (mode === 'open') {
            const cash = getCashOnHand();
            const totalCost = getQueueTotal();

            // Check if user has enough for the ENTIRE Remaining Queue
            if (cash < totalCost) {
                const deficit = totalCost - cash;
                alert(`STOP! You don't have enough money for the FULL queue.\n\nTotal Queue Cost: $${totalCost.toLocaleString()}\nYour Cash: $${cash.toLocaleString()}\n\nYOU NEED: $${deficit.toLocaleString()} more.`);
                return; // STOP EXECUTION
            }
        }

        if (mode === 'confirm') {
            const confirmBtn = document.querySelector(SETTINGS.confirmBtn);
            if (confirmBtn) {
                confirmBtn.click();
                lastActionTime = Date.now();
                btn.innerText = "...";
                btn.className = '';
                state.waitingForClose = true;
                state.confirmClickTime = Date.now();
            }
        }
        else if (mode === 'qty-buy') {
            const input = document.querySelector(SETTINGS.qtyInput);
            if (input) {
                setNativeValue(input, item.qty);
                input.dispatchEvent(new Event('change', { bubbles: true }));

                const container = input.closest('li') || input.closest('div[class*="item"]');
                if (container) {
                    const buttons = container.querySelectorAll('button');
                    let popupBtn = null;
                    for (let b of buttons) {
                        if (b.innerText.trim().toUpperCase() === 'BUY') {
                            popupBtn = b;
                            break;
                        }
                    }
                    if (popupBtn) {
                        popupBtn.click();
                        lastActionTime = Date.now();
                        btn.innerText = "...";
                        btn.className = '';
                    }
                }
            }
        }
        else if (mode === 'open') {
            const buyButtons = document.querySelectorAll(SETTINGS.buyBtn);
            for (let b of buyButtons) {
                if ((b.getAttribute('aria-label')||'').includes(item.name)) {
                    b.click();
                    lastActionTime = Date.now();
                    btn.innerText = "...";
                    btn.className = '';
                    break;
                }
            }
        }
    }

    function skipItem() { if(queue.length>0) { queue.shift(); save(); render(); state.waitingForClose = false; } }
    createGUI();
})();