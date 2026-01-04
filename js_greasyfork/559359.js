// ==UserScript==
// @name          Popmundo Auto Offer 👔
// @namespace     http://tampermonkey.net/
// @version       2.6.4
// @description   Offer selected items one by one with smooth UI, base-type group multi-select, robust sync, and compact controls on ItemsOffered (manual + loop: Stop offering, Accept + Pay, Accept gift). Delay between offers survives page reloads.
// @author        anon
// @match         https://*.popmundo.com/World/Popmundo.aspx/Character/OfferItem/*
// @match         https://*.popmundo.com/World/Popmundo.aspx/Character/ItemsOffered*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/559359/Popmundo%20Auto%20Offer%20%F0%9F%91%94.user.js
// @updateURL https://update.greasyfork.org/scripts/559359/Popmundo%20Auto%20Offer%20%F0%9F%91%94.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DDL_ID = 'ctl00_cphLeftColumn_ctl00_ddlItem';
    const OFFER_BTN_ID = 'ctl00_cphLeftColumn_ctl00_btnGive';
    const CONTAINER_ID = 'ctl00_cphLeftColumn_ctl00_updMain';
    const QUEUE_KEY = 'offerQueuePopmundo';
    const INITIAL_START_KEY = 'offerInitialStart';

    // ItemsOffered loop flags
    const GIFT_LOOP_KEY = 'pmGiftLoopAction'; // 'stop' | 'acceptPay' | 'purchasePay' | 'acceptGift' | 'reject'
    const GIFT_LOOP_DELAY = 600; // ms delay before each loop click on ItemsOffered

    const ddl = document.getElementById(DDL_ID);
    const offerButton = document.getElementById(OFFER_BTN_ID);
    const container = document.getElementById(CONTAINER_ID);

    const POSTBACK_DELAY = 500;
    const CLICK_DELAY = 300;
    const OFFER_DELAY = 800; // delay in ms between offers

    function getQueue() {
        try {
            const raw = localStorage.getItem(QUEUE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            clearQueue();
            return [];
        }
    }
    function setQueue(queue) {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
    function clearQueue() {
        localStorage.removeItem(QUEUE_KEY);
        localStorage.removeItem(INITIAL_START_KEY);
    }

    function injectStyles() {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const style = document.createElement('style');
        style.textContent = `
            #autoOfferListContainer { font-family:"Inter","Bahnschrift",sans-serif!important; background:#fff; border:1px solid #e0e0e0; border-radius:10px; padding:14px; margin-bottom:14px; box-shadow:0 4px 12px rgba(0,0,0,0.08); animation:fadeIn 0.4s ease; }
            @keyframes fadeIn { from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:none;} }
            #autoOfferListContainer h3 { color:#333; font-size:1.15rem; margin-bottom:8px; font-weight:700; border-bottom:1px solid #d2bbf8; padding-bottom:6px; }
            #autoOfferListContainer label { font-size:1rem; color:#444; display:flex; align-items:center; padding:4px 0; cursor:pointer; transition:color 0.2s ease; }
            #autoOfferListContainer label:hover { color:#1976d2; }
            .offer-item-checkbox { accent-color:#42a5f5; margin-right:8px; transition:transform 0.2s ease; }
            .offer-item-checkbox:checked { transform:scale(1.1); }
            .group-item-checkbox { accent-color:#7e57c2; margin-right:8px; }
            .group-label { background:#f3e5f5; border:1px solid #ce93d8; border-radius:6px; padding:4px 6px; margin:6px 0; font-weight:700; color:#4a148c; }
            #selectAllItems { accent-color:#29b6f6; }
            #autoOfferTriggerBtn { font-family:"Inter","Bahnschrift",sans-serif!important; background:linear-gradient(135deg,#838ce1,#adbceb); color:white; border:none; border-radius:6px; padding:8px 0; font-weight:700; font-size:1rem; cursor:pointer; width:100%; margin-top:12px; transition:transform 0.2s ease, background 0.3s ease; }
            #autoOfferTriggerBtn:hover:not(:disabled) { transform:translateY(-2px); background:linear-gradient(135deg,#6d77d9,#8b9dd7); }
            #autoOfferTriggerBtn:disabled { background:#ffc107!important; cursor:default; }
            #autoOfferTriggerBtn.done { background:#4CAF50!important; }
            #autoOfferStatus { margin-bottom:10px; padding:8px; background:#f1f8ff; border-radius:6px; color:#333; font-size:0.9rem; text-align:center; transition:background 0.3s ease,color 0.3s ease; }

            /* Compact ItemsOffered Panel - Bottom Right */
            #giftControlsPanel {
                position: fixed;
                bottom: 10px;
                right: 10px;
                z-index: 9999;
                font-family: "Inter", "Segoe UI", sans-serif;
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 8px;
                width: 210px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                animation: slideInUp 0.3s ease;
            }
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            #giftControlsPanel h3 {
                color: #333;
                font-size: 0.85rem;
                margin: 0 0 6px 0;
                font-weight: 700;
                text-align: center;
                padding-bottom: 4px;
                border-bottom: 1px solid #e0e0e0;
            }
            .gift-loop-btn {
                font-family: "Inter", sans-serif;
                background: linear-gradient(135deg, #9fa8da, #c5cae9);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 4px;
                margin: 2px 0;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                width: 100%;
                transition: all 0.2s ease;
                text-align: center;
            }
            .gift-loop-btn:hover {
                transform: translateY(-1px);
                background: linear-gradient(135deg, #7986cb, #9fa8da);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .gift-loop-btn.active {
                background: linear-gradient(135deg, #42a5f5, #64b5f6) !important;
                box-shadow: 0 0 0 1px rgba(66,165,245,0.5);
            }
            #stopLoopBtn {
                font-family: "Inter", sans-serif;
                background: linear-gradient(135deg, #ef5350, #e57373);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 4px;
                margin: 4px 0 0 0;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                width: 100%;
                transition: all 0.2s ease;
            }
            #stopLoopBtn:hover {
                transform: translateY(-1px);
                background: linear-gradient(135deg, #e53935, #ef5350);
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            #loopStatus {
                margin-top: 6px;
                padding: 4px;
                background: #f5f5f5;
                border-radius: 3px;
                color: #555;
                font-size: 0.8rem;
                text-align: center;
                font-weight: 500;
                min-height: 20px;
                word-break: break-word;
            }
            #loopStatus.active {
                background: #e8f5e9;
                color: #2e7d32;
            }
        `;
        document.head.appendChild(style);
    }

    function createSelectionInterface() {
        ddl.parentElement.style.display = 'none';
        const itemOptions = Array.from(ddl.options).filter(opt => opt.value);
        const parent = ddl.parentNode.parentNode;

        if (document.getElementById('autoOfferListContainer')) {
            document.getElementById('autoOfferListContainer').style.display = 'block';
            return;
        }

        const listContainer = document.createElement('div');
        listContainer.id = 'autoOfferListContainer';

        const header = document.createElement('h3');
        header.textContent = 'Offer Items Panel';
        listContainer.appendChild(header);

        const selectAllLabel = document.createElement('label');
        selectAllLabel.style.fontWeight = 'bold';
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'selectAllItems';
        selectAllCheckbox.addEventListener('change', e => {
            document.querySelectorAll('.offer-item-checkbox').forEach(cb => cb.checked = e.target.checked);
            document.querySelectorAll('.group-item-checkbox').forEach(cb => cb.checked = e.target.checked);
        });
        selectAllLabel.appendChild(selectAllCheckbox);
        selectAllLabel.appendChild(document.createTextNode('Select/Deselect All'));
        listContainer.appendChild(selectAllLabel);

        const groups = {};
        itemOptions.forEach(option => {
            const fullText = option.textContent.trim();
            const baseName = fullText.split('(')[0].trim();
            if (!groups[baseName]) groups[baseName] = [];
            groups[baseName].push(option.value);
        });

        Object.keys(groups).forEach(baseName => {
            if (groups[baseName].length > 1) {
                const groupLabel = document.createElement('label');
                groupLabel.className = 'group-label';
                const groupCheckbox = document.createElement('input');
                groupCheckbox.type = 'checkbox';
                groupCheckbox.className = 'group-item-checkbox';
                groupCheckbox.dataset.ids = JSON.stringify(groups[baseName]);
                groupCheckbox.addEventListener('change', e => {
                    const ids = JSON.parse(groupCheckbox.dataset.ids);
                    ids.forEach(id => {
                        const cb = document.getElementById(`item-cb-${id}`);
                        if (cb) cb.checked = e.target.checked;
                    });
                });
                groupLabel.appendChild(groupCheckbox);
                groupLabel.appendChild(document.createTextNode(`Group: ${baseName} [x${groups[baseName].length}]`));
                listContainer.appendChild(groupLabel);
            }
        });

        itemOptions.forEach(option => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = option.value;
            checkbox.id = `item-cb-${option.value}`;
            checkbox.className = 'offer-item-checkbox';
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(option.textContent));
            listContainer.appendChild(label);
        });

        parent.insertBefore(listContainer, ddl.parentNode);
        createTriggerButton(listContainer);
    }

    function createTriggerButton(attachPoint) {
        if (document.getElementById('autoOfferTriggerBtn')) return;
        const btn = document.createElement('button');
        btn.id = 'autoOfferTriggerBtn';
        btn.textContent = '⚡ Offer Selected Items ⚡';
        btn.addEventListener('click', e => {
            e.preventDefault();
            const selectedItems = new Set();
            document.querySelectorAll('.offer-item-checkbox:checked').forEach(cb => selectedItems.add(cb.value));
            document.querySelectorAll('.group-item-checkbox:checked').forEach(cb => {
                const ids = JSON.parse(cb.dataset.ids);
                ids.forEach(id => selectedItems.add(id));
            });
            if (!selectedItems.size) return alert('Please select at least one item.');
            setQueue(Array.from(selectedItems));
            localStorage.setItem(INITIAL_START_KEY, 'TRUE');
            document.getElementById('autoOfferListContainer').style.display = 'none';
            btn.textContent = 'Initializing...';
            btn.disabled = true;
            startObservationLoop(true);
        });
        attachPoint.parentNode.insertBefore(btn, attachPoint.nextSibling);

        const statusBox = document.createElement('div');
        statusBox.id = 'autoOfferStatus';
        statusBox.textContent = 'Ready to start offering...';
        attachPoint.parentNode.insertBefore(statusBox, btn.nextSibling);
    }

    function ensureStableSelection(nextItemId) {
        if (ddl.value !== nextItemId) {
            ddl.value = nextItemId;
            ddl.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function processQueue() {
        const queue = getQueue();
        const btn = document.getElementById('autoOfferTriggerBtn');
        const statusBox = document.getElementById('autoOfferStatus');

        if (!queue.length) {
            clearQueue();
            if (btn) {
                btn.textContent = '✅ DONE!';
                btn.disabled = true;
                btn.classList.add('done');
            }
            if (statusBox) {
                statusBox.textContent = 'All items offered!';
                statusBox.style.background = '#e8f5e9';
            }
            ddl.parentElement.style.display = 'none';
            return;
        }

        const nextItemId = queue[0];
        ensureStableSelection(nextItemId);

        if (ddl.value !== nextItemId) {
            if (statusBox) statusBox.textContent = 'Waiting for item selection...';
            setTimeout(processQueue, POSTBACK_DELAY);
            return;
        }

        if (statusBox) statusBox.textContent = `Offering: ${ddl.options[ddl.selectedIndex].text}`;
        setTimeout(() => {
            if (ddl.value === nextItemId) {
                queue.shift();
                setQueue(queue);
                ddl.parentElement.style.display = 'none';
                offerButton.click();
            } else {
                if (statusBox) statusBox.textContent = 'Re-checking selection...';
                setTimeout(processQueue, 200);
            }
        }, CLICK_DELAY);
    }

    function startObservationLoop(isInitialStart) {
        ddl.parentElement.style.display = 'block';

        const queue = getQueue();
        const nextItemId = queue[0];
        const btn = document.getElementById('autoOfferTriggerBtn');

        const observer = new MutationObserver(() => {
            observer.disconnect();
            if (btn) btn.textContent = 'Processing...';
            // apply OFFER_DELAY after each page update
            setTimeout(processQueue, OFFER_DELAY);
        });
        observer.observe(container, { childList: true, subtree: true, attributes: true });

        if (!isInitialStart) {
            setTimeout(processQueue, OFFER_DELAY);
            return;
        }

        let attempts = 0;
        const maxAttempts = 20;
        if (btn) btn.textContent = 'Initializing Page State...';

        const checkReady = setInterval(() => {
            if (ddl.value === nextItemId) {
                clearInterval(checkReady);
                localStorage.removeItem(INITIAL_START_KEY);
                processQueue();
                return;
            }
            if (ddl.options.length > 1) {
                selectItemAndTriggerPostback(nextItemId);
            }
            if (attempts++ >= maxAttempts) {
                clearInterval(checkReady);
                alert("Auto Offer failed to initialize page state. Please refresh and try again.");
                clearQueue();
            }
        }, 100);
    }

    function selectItemAndTriggerPostback(value) {
        const option = ddl.querySelector(`option[value="${value}"]`);
        if (!option) {
            const queue = getQueue();
            queue.shift();
            setQueue(queue);
            setTimeout(processQueue, POSTBACK_DELAY / 2);
            return;
        }
        ddl.parentElement.style.display = 'block';
        ddl.value = value;
        ddl.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function observeContainer() {
        const observer = new MutationObserver(() => {
            const ddlEl = document.getElementById(DDL_ID);
            if (ddlEl && !document.getElementById('autoOfferListContainer') && getQueue().length === 0) {
                createSelectionInterface();
            }
        });
        observer.observe(container, { childList: true, subtree: true });
    }

    // -------- ItemsOffered compact controls with Turkish support --------

    function giftSelectorFor(action) {
        switch (action) {
            case 'stop':
                // English and Turkish for stop offering
                return 'input[type="submit"][value="Stop offering this item"], input[type="submit"][value*="Stop offering"], input[type="submit"][value="Bu eşyayı teklif etmekten vazgeç"], input[type="submit"][value*="vazgeç"]';
            case 'acceptPay':
                // English and Turkish for accept and pay
                return 'input[type="submit"][value="Accept, and pay delivery"], input[type="submit"][value*="Accept, and pay"], input[type="submit"][value="Kabul et ve kargo ücretini öde"], input[type="submit"][value*="Kabul et ve"]';
            case 'purchasePay':
                // English and Turkish for purchase and pay
                return 'input[type="submit"][value="Purchase, and pay delivery"], input[type="submit"][value*="Purchase, and pay"], input[type="submit"][value="Satın al ve kargo ücretini öde"], input[type="submit"][value*="Satın al ve"]';
            case 'acceptGift':
                // English and Turkish for accept gift
                return 'input[type="submit"][value="Accept gift"], input[type="submit"][value*="Accept gift"], input[type="submit"][value="Hediyeyi kabul et"], input[type="submit"][value*="Hediyeyi kabul"]';
            case 'reject':
                // English and Turkish for reject
                return 'input[type="submit"][value="Reject"], input[type="submit"][value*="Reject"], input[type="submit"][value="Reddet"], input[type="submit"][value*="Reddet"]';
            default: return '';
        }
    }

    function runGiftLoopStep() {
        const action = localStorage.getItem(GIFT_LOOP_KEY);
        if (!action) {
            updateLoopStatus('No active loop');
            updateButtonStates(null);
            return;
        }

        const selector = giftSelectorFor(action);
        if (!selector) return;

        const btns = document.querySelectorAll(selector);
        if (!btns.length) {
            localStorage.removeItem(GIFT_LOOP_KEY);
            updateLoopStatus('Loop complete');
            updateButtonStates(null);
            return;
        }

        updateLoopStatus(`${btns.length} remaining`);
        updateButtonStates(action);

        setTimeout(() => {
            btns[0].click();
        }, GIFT_LOOP_DELAY);
    }

    function updateLoopStatus(message) {
        let statusEl = document.getElementById('loopStatus');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.id = 'loopStatus';
            statusEl.className = 'loop-status';
            const panel = document.getElementById('giftControlsPanel');
            if (panel) panel.appendChild(statusEl);
        }
        statusEl.textContent = message;
        statusEl.classList.toggle('active', !!localStorage.getItem(GIFT_LOOP_KEY));
    }

    function updateButtonStates(activeAction) {
        const buttons = document.querySelectorAll('.gift-loop-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.action === activeAction);
        });
    }

    function injectGiftControls() {
        if (!location.href.includes('/Character/ItemsOffered')) return;
        if (document.getElementById('giftControlsPanel')) return;

        // Always create a fixed panel at bottom right
        const panel = document.createElement('div');
        panel.id = 'giftControlsPanel';

        const header = document.createElement('h3');
        header.textContent = 'Gift Loop';
        panel.appendChild(header);

        // Loop buttons with all actions including purchase and reject
        const loopActions = [
            { label: 'Stop Offering', action: 'stop' },
            { label: 'Accept + Pay', action: 'acceptPay' },
            { label: 'Purchase + Pay', action: 'purchasePay' },
            { label: 'Accept Gift', action: 'acceptGift' },
            { label: 'Reject', action: 'reject' }
        ];

        loopActions.forEach(({ label, action }) => {
            const btn = document.createElement('button');
            btn.className = 'gift-loop-btn';
            btn.dataset.action = action;
            btn.textContent = label;
            btn.addEventListener('click', () => {
                localStorage.setItem(GIFT_LOOP_KEY, action);
                runGiftLoopStep();
            });
            panel.appendChild(btn);
        });

        // Stop loop button
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stopLoopBtn';
        stopBtn.textContent = '⏹️ Stop Loop';
        stopBtn.addEventListener('click', () => {
            localStorage.removeItem(GIFT_LOOP_KEY);
            updateLoopStatus('Loop stopped');
            updateButtonStates(null);
        });
        panel.appendChild(stopBtn);

        // Status display
        const statusEl = document.createElement('div');
        statusEl.id = 'loopStatus';
        statusEl.className = 'loop-status';
        statusEl.textContent = 'Ready';
        panel.appendChild(statusEl);

        document.body.appendChild(panel);

        // If a loop is active (from a prior reload), continue
        runGiftLoopStep();
    }

    // -------- Initialization --------

    injectStyles();

    if (location.href.includes('/Character/ItemsOffered')) {
        // Compact loop-only panel on ItemsOffered
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', injectGiftControls);
        } else {
            injectGiftControls();
        }
    } else {
        // OfferItem automation
        if (!ddl || !offerButton || !container) return;

        const queueActive = getQueue().length > 0;
        const initialStartPending = localStorage.getItem(INITIAL_START_KEY) === 'TRUE';

        if (queueActive || initialStartPending) {
            startObservationLoop(initialStartPending);
        } else {
            createSelectionInterface();
            observeContainer();
        }
    }
})();