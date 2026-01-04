// ==UserScript==
// @name         Torn Christmas Pot helper
// @namespace    https://torn.com
// @version      6.1
// @description  Pot helper with spam clicking, item triggers, and win tracking
// @author       Jayden
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559866/Torn%20Christmas%20Pot%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/559866/Torn%20Christmas%20Pot%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================

    const CONFIG = {
        candyMaxLeft: 280,
        triggerCount: 11,
        itemCountTrigger: 35,
        clicksPerSecond: 5,
        storageKey: 'tornPotClicker_v6'
    };

    // ============================================
    // ITEM DATABASE
    // ============================================

    const ITEMS = {
        energyDrinks: [
            { id: 985, name: "Can of Goose Juice", price: 267000 },
            { id: 986, name: "Can of Damp Valley", price: 470000 },
            { id: 987, name: "Can of Crocozade", price: 789000 },
            { id: 553, name: "Can of Santa Shooters", price: 1191000 },
            { id: 530, name: "Can of Munster", price: 1220000 },
            { id: 554, name: "Can of Rockstar Rudolph", price: 1719000 },
            { id: 532, name: "Can of Red Cow", price: 1813000 },
            { id: 555, name: "Can of X-MASS", price: 3120000 },
            { id: 533, name: "Can of Taurine Elite", price: 3365000 }
        ],
        alcohol: [
            { id: 426, name: "Bottle of Tequila", price: 565 },
            { id: 180, name: "Bottle of Beer", price: 650 },
            { id: 294, name: "Bottle of Sake", price: 2909 },
            { id: 181, name: "Bottle of Champagne", price: 2941 },
            { id: 550, name: "Bottle of Kandy Kane", price: 52000 },
            { id: 531, name: "Bottle of Pumpkin Brew", price: 57000 },
            { id: 551, name: "Bottle of Minty Mayhem", price: 120000 },
            { id: 638, name: "Bottle of Christmas Cocktail", price: 120000 },
            { id: 542, name: "Bottle of Wicked Witch", price: 126000 },
            { id: 552, name: "Bottle of Mistletoe Madness", price: 240000 },
            { id: 541, name: "Bottle of Stinky Swamp Punch", price: 250000 },
            { id: 984, name: "Bottle of Moonshine", price: 1000000 },
            { id: 873, name: "Bottle of Green Stout", price: 1020000 },
            { id: 924, name: "Bottle of Christmas Spirit", price: 1600000 }
        ],
        candy: [
            { id: 35, name: "Box of Chocolate Bars", price: 568 },
            { id: 210, name: "Bag of Chocolate Kisses", price: 600 },
            { id: 310, name: "Lollipop", price: 611 },
            { id: 39, name: "Box of Extra Strong Mints", price: 640 },
            { id: 38, name: "Box of Bon Bons", price: 868 },
            { id: 37, name: "Bag of Bon Bons", price: 879 },
            { id: 209, name: "Box of Sweet Hearts", price: 880 },
            { id: 527, name: "Bag of Candy Kisses", price: 39000 },
            { id: 36, name: "Big Box of Chocolate Bars", price: 44618 },
            { id: 528, name: "Bag of Tootsie Rolls", price: 55000 },
            { id: 634, name: "Bag of Bloody Eyeballs", price: 64419 },
            { id: 529, name: "Bag of Chocolate Truffles", price: 102000 },
            { id: 556, name: "Bag of Reindeer Droppings", price: 103000 },
            { id: 586, name: "Jawbreaker", price: 312000 },
            { id: 587, name: "Bag of Sherbet", price: 319000 },
            { id: 151, name: "Pixie Sticks", price: 333000 },
            { id: 1039, name: "Bag of Humbugs", price: 381000 },
            { id: 1312, name: "Chocolate Egg", price: 1000000 },
            { id: 1028, name: "Birthday Cupcake", price: 3380000 }
        ]
    };

    function formatPrice(price) {
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
        return `$${price}`;
    }

    // ============================================
    // DATA MANAGEMENT
    // ============================================

    let appData = loadData();

    function loadData() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                if (data.clicksPerSecond === undefined) data.clicksPerSecond = 10;
                if (data.itemCountTrigger === undefined) data.itemCountTrigger = 35;
                if (data.triggerCount === undefined) data.triggerCount = 9;
                if (data.username === undefined) data.username = '';
                if (data.roundsSinceWin === undefined) data.roundsSinceWin = 0;
                if (data.totalWins === undefined) data.totalWins = 0;
                if (data.lastWinItems === undefined) data.lastWinItems = 0;
                return data;
            }
        } catch (e) {
            console.error('[PotClicker] Error loading data:', e);
        }
        return {
            safeItems: {},
            enablePriceCheck: true,
            clicksPerSecond: 10,
            itemCountTrigger: 35,
            triggerCount: 9,
            username: '',
            roundsSinceWin: 0,
            totalWins: 0,
            lastWinItems: 0
        };
    }

    function saveData() {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(appData));
        } catch (e) {
            console.error('[PotClicker] Error saving data:', e);
        }
    }

    function isItemSafe(itemId) {
        if (!appData.enablePriceCheck) return true;
        return appData.safeItems[itemId] === true;
    }

    // ============================================
    // STATE
    // ============================================

    let statusPanel = null;
    let logEntries = [];
    let isClicking = false;
    let currentEnergyCount = 0;
    let currentPotCount = 0;
    let clickInterval = null;
    let totalClicks = 0;
    let lastWinnerName = null;
    let hasCheckedThisRound = false;
    let checkTimeout = null;

    // ============================================
    // SAFE DOM HELPERS
    // ============================================

    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            return null;
        }
    }

    function safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (e) {
            return [];
        }
    }

    // ============================================
    // STATUS PANEL UI
    // ============================================

    function createStatusPanel() {
        if (document.getElementById('pot-clicker-status')) return;

        statusPanel = document.createElement('div');
        statusPanel.id = 'pot-clicker-status';
        statusPanel.innerHTML = `
            <div class="pcs-header">
                <span class="pcs-dot"></span>
                <span class="pcs-title">Pot Clicker v6.1</span>
                <button class="pcs-settings-btn" title="Settings">⚙️</button>
                <button class="pcs-minimize">−</button>
            </div>
            <div class="pcs-body">
                <div class="pcs-stat pcs-win-tracker">
                    <span class="pcs-label">🏆 Last Win:</span>
                    <span class="pcs-value" id="pcs-last-win">--</span>
                </div>
                <div class="pcs-stat">
                    <span class="pcs-label">Energy Drinks:</span>
                    <span class="pcs-value" id="pcs-edrink-count">0 / ${appData.triggerCount}</span>
                </div>
                <div class="pcs-stat">
                    <span class="pcs-label">Pot Items:</span>
                    <span class="pcs-value" id="pcs-pot-count">0 / ${appData.itemCountTrigger || '∞'}</span>
                </div>
                <div class="pcs-stat">
                    <span class="pcs-label">Selected Item:</span>
                    <span class="pcs-value" id="pcs-selected-item">--</span>
                </div>
                <div class="pcs-stat">
                    <span class="pcs-label">Safe to Click:</span>
                    <span class="pcs-value" id="pcs-safe-status">--</span>
                </div>
                <div class="pcs-stat">
                    <span class="pcs-label">Status:</span>
                    <span class="pcs-value" id="pcs-status">Monitoring...</span>
                </div>
                <div class="pcs-log-header">Activity Log:</div>
                <div class="pcs-log" id="pcs-log"></div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            #pot-clicker-status {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 280px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 10px;
                font-family: Arial, sans-serif;
                font-size: 13px;
                color: #e8e8e8;
                z-index: 999999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            }
            #pot-clicker-status.minimized .pcs-body { display: none; }
            #pot-clicker-status.triggered { border-color: #00ff88; box-shadow: 0 0 20px rgba(0,255,136,0.5); }
            #pot-clicker-status.clicking { animation: clicking-pulse 0.1s ease-in-out infinite; border-color: #ffeb3b; box-shadow: 0 0 20px rgba(255,235,59,0.5); }
            #pot-clicker-status.winner { animation: winner-glow 0.5s ease-in-out 3; border-color: #ffd700; box-shadow: 0 0 30px rgba(255,215,0,0.8); }
            @keyframes clicking-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
            @keyframes winner-glow { 0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.5); } 50% { box-shadow: 0 0 40px rgba(255,215,0,1); } }
            .pcs-header { display: flex; align-items: center; padding: 10px 12px; background: rgba(0,0,0,0.3); border-bottom: 1px solid #0f3460; cursor: move; }
            .pcs-dot { width: 10px; height: 10px; background: #00ff88; border-radius: 50%; margin-right: 10px; animation: dot-pulse 2s ease-in-out infinite; }
            @keyframes dot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            .pcs-title { flex: 1; font-weight: bold; color: #fff; }
            .pcs-settings-btn { background: none; border: none; font-size: 16px; cursor: pointer; margin-right: 8px; opacity: 0.7; }
            .pcs-settings-btn:hover { opacity: 1; }
            .pcs-minimize { background: none; border: 1px solid #444; color: #888; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 16px; line-height: 1; }
            .pcs-minimize:hover { background: #333; color: #fff; }
            .pcs-body { padding: 12px; }
            .pcs-stat { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 6px 8px; background: rgba(0,0,0,0.2); border-radius: 4px; }
            .pcs-stat.pcs-win-tracker { background: linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,165,0,0.1) 100%); border: 1px solid rgba(255,215,0,0.3); }
            .pcs-label { color: #888; }
            .pcs-value { font-weight: bold; color: #4fc3f7; }
            .pcs-value.safe { color: #00ff88; }
            .pcs-value.unsafe { color: #ff5252; }
            .pcs-value.clicking { color: #ffeb3b; }
            .pcs-value.trigger { color: #00ff88; }
            .pcs-value.warn { color: #ffeb3b; }
            .pcs-value.winner { color: #ffd700; }
            .pcs-log-header { color: #888; font-size: 11px; margin-top: 10px; margin-bottom: 5px; }
            .pcs-log { max-height: 100px; overflow-y: auto; background: rgba(0,0,0,0.3); border-radius: 4px; padding: 8px; font-size: 11px; font-family: monospace; }
            .pcs-log-entry { margin-bottom: 4px; padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .pcs-log-entry:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .pcs-log-time { color: #666; }
            .pcs-log-msg { color: #aaa; }
            .pcs-log-msg.trigger { color: #00ff88; }
            .pcs-log-msg.warn { color: #ffeb3b; }
            .pcs-log-msg.click { color: #4fc3f7; }
            .pcs-log-msg.win { color: #ffd700; font-weight: bold; }
            #pcs-settings-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 9999999; display: flex; align-items: center; justify-content: center; }
            .pcs-modal-content { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid #0f3460; border-radius: 10px; width: 550px; max-height: 80vh; display: flex; flex-direction: column; }
            .pcs-modal-header { padding: 15px 20px; background: rgba(0,0,0,0.3); border-bottom: 1px solid #0f3460; display: flex; justify-content: space-between; align-items: center; }
            .pcs-modal-header h2 { margin: 0; color: #fff; font-size: 18px; }
            .pcs-modal-close { background: none; border: none; color: #888; font-size: 24px; cursor: pointer; }
            .pcs-modal-close:hover { color: #fff; }
            .pcs-modal-body { padding: 20px; overflow-y: auto; flex: 1; }
            .pcs-toggle-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 6px; }
            .pcs-toggle-label { color: #fff; }
            .pcs-toggle { position: relative; width: 50px; height: 26px; }
            .pcs-toggle input { opacity: 0; width: 0; height: 0; }
            .pcs-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: 0.3s; border-radius: 26px; }
            .pcs-toggle-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: #fff; transition: 0.3s; border-radius: 50%; }
            .pcs-toggle input:checked + .pcs-toggle-slider { background-color: #00ff88; }
            .pcs-toggle input:checked + .pcs-toggle-slider:before { transform: translateX(24px); }
            .pcs-input-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 6px; }
            .pcs-input-row input[type="number"], .pcs-input-row input[type="text"] { width: 150px; padding: 6px 10px; border: 1px solid #444; border-radius: 4px; background: #222; color: #fff; font-size: 14px; }
            .pcs-input-row input:focus { outline: none; border-color: #00ff88; }
            .pcs-category { margin-bottom: 20px; }
            .pcs-category-header { font-size: 14px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #0f3460; display: flex; justify-content: space-between; align-items: center; }
            .pcs-category-header.alcohol { color: #ff6b6b; }
            .pcs-category-header.candy { color: #ffd93d; }
            .pcs-category-header.energy { color: #6bcb77; }
            .pcs-check-all { font-size: 11px; cursor: pointer; padding: 4px 8px; background: rgba(255,255,255,0.1); border-radius: 4px; }
            .pcs-check-all:hover { background: rgba(255,255,255,0.2); }
            .pcs-item-list { display: flex; flex-direction: column; gap: 4px; }
            .pcs-item-row { display: flex; align-items: center; padding: 6px 10px; background: rgba(0,0,0,0.2); border-radius: 4px; }
            .pcs-item-row img { width: 28px; height: 28px; margin-right: 10px; border-radius: 4px; }
            .pcs-item-name { flex: 1; color: #ddd; font-size: 12px; }
            .pcs-item-price { color: #888; font-size: 11px; margin-right: 10px; min-width: 50px; text-align: right; }
            .pcs-item-checkbox { width: 18px; height: 18px; cursor: pointer; accent-color: #00ff88; }
            .pcs-modal-footer { padding: 15px 20px; background: rgba(0,0,0,0.3); border-top: 1px solid #0f3460; display: flex; justify-content: space-between; }
            .pcs-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; }
            .pcs-btn-primary { background: #00ff88; color: #000; }
            .pcs-btn-primary:hover { background: #00cc6a; }
            .pcs-btn-danger { background: #ff5252; color: #fff; }
            .pcs-btn-danger:hover { background: #cc4242; }
            .pcs-section-title { color: #888; font-size: 12px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
            .pcs-stats-box { background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); border-radius: 6px; padding: 12px; margin-bottom: 15px; }
            .pcs-stats-box .pcs-stat-line { display: flex; justify-content: space-between; color: #ddd; margin-bottom: 6px; }
            .pcs-stats-box .pcs-stat-line:last-child { margin-bottom: 0; }
            .pcs-stats-box .pcs-stat-value { color: #ffd700; font-weight: bold; }
        `;
        document.head.appendChild(style);
        document.body.appendChild(statusPanel);

        statusPanel.querySelector('.pcs-minimize').addEventListener('click', () => {
            statusPanel.classList.toggle('minimized');
        });
        statusPanel.querySelector('.pcs-settings-btn').addEventListener('click', openSettings);
        makeDraggable(statusPanel, statusPanel.querySelector('.pcs-header'));

        addLog('Script initialized (v6.1)', 'msg');
        updateWinDisplay();
    }

    function makeDraggable(element, handle) {
        let offsetX, offsetY, isDragging = false;
        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
            element.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => { isDragging = false; });
    }

    function addLog(message, type = 'msg') {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        logEntries.unshift({ time, message, type });
        if (logEntries.length > 20) logEntries.pop();
        const logEl = document.getElementById('pcs-log');
        if (logEl) {
            logEl.innerHTML = logEntries.map(e =>
                `<div class="pcs-log-entry"><span class="pcs-log-time">[${e.time}]</span> <span class="pcs-log-msg ${e.type}">${e.message}</span></div>`
            ).join('');
        }
    }

    function updateWinDisplay() {
        const lastWinEl = document.getElementById('pcs-last-win');
        if (!lastWinEl) return;

        if (!appData.username) {
            lastWinEl.textContent = 'Set username in ⚙️';
            lastWinEl.className = 'pcs-value';
        } else if (appData.roundsSinceWin === 0 && appData.totalWins === 0) {
            lastWinEl.textContent = 'No wins yet';
            lastWinEl.className = 'pcs-value';
        } else if (appData.roundsSinceWin === 0 && appData.totalWins > 0) {
            lastWinEl.textContent = `Just won! (${appData.lastWinItems} items)`;
            lastWinEl.className = 'pcs-value winner';
        } else {
            lastWinEl.textContent = `${appData.roundsSinceWin} rounds ago`;
            lastWinEl.className = 'pcs-value';
        }
    }

    function updateStatus(energyCount, potCount, selectedItem, isSafe) {
        const countEl = document.getElementById('pcs-edrink-count');
        const potCountEl = document.getElementById('pcs-pot-count');
        const itemEl = document.getElementById('pcs-selected-item');
        const safeEl = document.getElementById('pcs-safe-status');
        const statusEl = document.getElementById('pcs-status');

        const energyTriggerMet = energyCount >= appData.triggerCount;
        const itemTriggerMet = appData.itemCountTrigger > 0 && potCount >= appData.itemCountTrigger;

        if (countEl) {
            countEl.textContent = `${energyCount} / ${appData.triggerCount}`;
            countEl.style.color = energyTriggerMet ? '#00ff88' : '#4fc3f7';
        }
        if (potCountEl) {
            const triggerDisplay = appData.itemCountTrigger > 0 ? appData.itemCountTrigger : '∞';
            potCountEl.textContent = `${potCount} / ${triggerDisplay}`;
            potCountEl.style.color = itemTriggerMet ? '#00ff88' : '#4fc3f7';
        }
        if (itemEl) itemEl.textContent = selectedItem || '--';
        if (safeEl) {
            if (!appData.enablePriceCheck) {
                safeEl.textContent = 'Check OFF';
                safeEl.className = 'pcs-value';
            } else {
                safeEl.textContent = isSafe ? 'YES ✓' : 'NO ✗';
                safeEl.className = 'pcs-value ' + (isSafe ? 'safe' : 'unsafe');
            }
        }
        if (statusEl && !isClicking) {
            if (energyTriggerMet || itemTriggerMet) {
                const canClick = isSafe || !appData.enablePriceCheck;
                statusEl.textContent = canClick ? 'READY!' : 'Blocked (unsafe)';
                statusEl.className = 'pcs-value ' + (canClick ? 'trigger' : 'warn');
            } else {
                statusEl.textContent = 'Monitoring...';
                statusEl.className = 'pcs-value';
            }
        }
    }

    // ============================================
    // WIN TRACKING
    // ============================================

    function checkForWin() {
        if (!appData.username) return;

        const messageEl = safeQuerySelector('.message___qMgwh');
        if (!messageEl) return;

        const messageText = messageEl.textContent || '';
        const winMatch = messageText.trim().match(/^(.+?)\s+has won\s+(\d+)\s+items?!$/i);

        if (!winMatch) return;

        const winnerName = winMatch[1];
        const itemsWon = parseInt(winMatch[2]);

        if (winnerName !== lastWinnerName) {
            lastWinnerName = winnerName;
            hasCheckedThisRound = false;
        }

        if (hasCheckedThisRound) return;
        hasCheckedThisRound = true;

        const isUs = winnerName.toLowerCase() === appData.username.toLowerCase();

        if (isUs) {
            appData.roundsSinceWin = 0;
            appData.totalWins++;
            appData.lastWinItems = itemsWon;
            saveData();

            addLog(`🏆 YOU WON ${itemsWon} ITEMS!`, 'win');
            playWinSound();

            if (statusPanel) {
                statusPanel.classList.add('winner');
                setTimeout(() => statusPanel.classList.remove('winner'), 3000);
            }
        } else {
            appData.roundsSinceWin++;
            saveData();
            addLog(`${winnerName} won ${itemsWon} items (${appData.roundsSinceWin} rounds)`, 'msg');
        }

        updateWinDisplay();
    }

    // ============================================
    // SETTINGS MODAL
    // ============================================

    function openSettings() {
        if (document.getElementById('pcs-settings-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'pcs-settings-modal';
        modal.innerHTML = `
            <div class="pcs-modal-content">
                <div class="pcs-modal-header">
                    <h2>⚙️ Pot Clicker Settings</h2>
                    <button class="pcs-modal-close">&times;</button>
                </div>
                <div class="pcs-modal-body">
                    <div class="pcs-section-title">🏆 Win Tracking</div>
                    <div class="pcs-input-row">
                        <span class="pcs-toggle-label">Your Torn Username</span>
                        <input type="text" id="pcs-username" value="${appData.username}" placeholder="Enter username">
                    </div>
                    <div class="pcs-stats-box">
                        <div class="pcs-stat-line"><span>Total Wins:</span><span class="pcs-stat-value">${appData.totalWins}</span></div>
                        <div class="pcs-stat-line"><span>Rounds Since Win:</span><span class="pcs-stat-value">${appData.roundsSinceWin}</span></div>
                        <div class="pcs-stat-line"><span>Last Win Items:</span><span class="pcs-stat-value">${appData.lastWinItems || '--'}</span></div>
                    </div>
                    <button class="pcs-btn pcs-btn-danger" id="pcs-reset-wins" style="margin-bottom: 20px;">Reset Win Stats</button>

                    <div class="pcs-section-title">Trigger Settings</div>
                    <div class="pcs-input-row">
                        <span class="pcs-toggle-label">Energy Drink Trigger</span>
                        <input type="number" id="pcs-trigger-count" value="${appData.triggerCount}" min="1" max="20">
                    </div>
                    <div class="pcs-input-row">
                        <span class="pcs-toggle-label">Pot Item Trigger (0=off)</span>
                        <input type="number" id="pcs-item-trigger" value="${appData.itemCountTrigger}" min="0" max="100">
                    </div>
                    <div class="pcs-input-row">
                        <span class="pcs-toggle-label">Clicks Per Second</span>
                        <input type="number" id="pcs-clicks-per-sec" value="${appData.clicksPerSecond}" min="1" max="50">
                    </div>

                    <div class="pcs-section-title">Safety Settings</div>
                    <div class="pcs-toggle-row">
                        <span class="pcs-toggle-label">Enable Item Safety Check</span>
                        <label class="pcs-toggle">
                            <input type="checkbox" id="pcs-enable-check" ${appData.enablePriceCheck ? 'checked' : ''}>
                            <span class="pcs-toggle-slider"></span>
                        </label>
                    </div>
                    <p style="color: #888; font-size: 12px; margin-bottom: 20px;">✓ Check items you're OK with auto-clicking.</p>

                    <div class="pcs-category">
                        <div class="pcs-category-header alcohol"><span>🍺 Alcohol</span><span class="pcs-check-all" data-category="alcohol">Check Cheap</span></div>
                        <div class="pcs-item-list" id="pcs-alcohol-list"></div>
                    </div>
                    <div class="pcs-category">
                        <div class="pcs-category-header candy"><span>🍬 Candy</span><span class="pcs-check-all" data-category="candy">Check Cheap</span></div>
                        <div class="pcs-item-list" id="pcs-candy-list"></div>
                    </div>
                    <div class="pcs-category">
                        <div class="pcs-category-header energy"><span>⚡ Energy Drinks</span><span class="pcs-check-all" data-category="energyDrinks">Check Cheap</span></div>
                        <div class="pcs-item-list" id="pcs-energy-list"></div>
                    </div>
                </div>
                <div class="pcs-modal-footer">
                    <button class="pcs-btn pcs-btn-danger" id="pcs-reset-data">Uncheck All</button>
                    <button class="pcs-btn pcs-btn-primary" id="pcs-close-settings">Done</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        populateItemList('pcs-alcohol-list', ITEMS.alcohol);
        populateItemList('pcs-candy-list', ITEMS.candy);
        populateItemList('pcs-energy-list', ITEMS.energyDrinks);

        modal.querySelector('.pcs-modal-close').addEventListener('click', closeSettings);
        modal.querySelector('#pcs-close-settings').addEventListener('click', closeSettings);

        modal.querySelector('#pcs-username').addEventListener('change', (e) => {
            appData.username = e.target.value.trim();
            saveData();
            updateWinDisplay();
            addLog(`Username: ${appData.username || '(none)'}`, 'msg');
        });

        modal.querySelector('#pcs-reset-wins').addEventListener('click', () => {
            appData.roundsSinceWin = 0;
            appData.totalWins = 0;
            appData.lastWinItems = 0;
            saveData();
            updateWinDisplay();
            modal.querySelector('.pcs-stats-box').innerHTML = `
                <div class="pcs-stat-line"><span>Total Wins:</span><span class="pcs-stat-value">0</span></div>
                <div class="pcs-stat-line"><span>Rounds Since Win:</span><span class="pcs-stat-value">0</span></div>
                <div class="pcs-stat-line"><span>Last Win Items:</span><span class="pcs-stat-value">--</span></div>
            `;
            addLog('Win stats reset', 'warn');
        });

        modal.querySelector('#pcs-enable-check').addEventListener('change', (e) => {
            appData.enablePriceCheck = e.target.checked;
            saveData();
        });

        modal.querySelector('#pcs-trigger-count').addEventListener('change', (e) => {
            appData.triggerCount = Math.max(1, Math.min(20, parseInt(e.target.value) || 9));
            e.target.value = appData.triggerCount;
            saveData();
        });

        modal.querySelector('#pcs-item-trigger').addEventListener('change', (e) => {
            appData.itemCountTrigger = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
            e.target.value = appData.itemCountTrigger;
            saveData();
        });

        modal.querySelector('#pcs-clicks-per-sec').addEventListener('change', (e) => {
            appData.clicksPerSecond = Math.max(1, Math.min(50, parseInt(e.target.value) || 10));
            e.target.value = appData.clicksPerSecond;
            saveData();
        });

        modal.querySelector('#pcs-reset-data').addEventListener('click', () => {
            appData.safeItems = {};
            saveData();
            modal.querySelectorAll('.pcs-item-checkbox').forEach(cb => cb.checked = false);
            addLog('All items unchecked', 'warn');
        });

        modal.querySelectorAll('.pcs-check-all').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                ITEMS[category].forEach(item => {
                    if (item.price < 10000) {
                        appData.safeItems[item.id] = true;
                        const cb = modal.querySelector(`[data-item-id="${item.id}"]`);
                        if (cb) cb.checked = true;
                    }
                });
                saveData();
            });
        });

        modal.addEventListener('click', (e) => { if (e.target === modal) closeSettings(); });
    }

    function populateItemList(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="pcs-item-row">
                <img src="https://www.torn.com/images/items/${item.id}/small.png" onerror="this.style.display='none'">
                <span class="pcs-item-name">${item.name}</span>
                <span class="pcs-item-price">${formatPrice(item.price)}</span>
                <input type="checkbox" class="pcs-item-checkbox" data-item-id="${item.id}" ${appData.safeItems[item.id] ? 'checked' : ''}>
            </div>
        `).join('');
        container.querySelectorAll('.pcs-item-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                appData.safeItems[e.target.dataset.itemId] = e.target.checked;
                saveData();
            });
        });
    }

    function closeSettings() {
        const modal = document.getElementById('pcs-settings-modal');
        if (modal) modal.remove();
    }

    // ============================================
    // CORE FUNCTIONALITY
    // ============================================

    function countEnergyDrinks() {
        const itemsWrap = safeQuerySelector('.items-wrap____FstM');
        if (!itemsWrap) return 0;

        let count = 0;
        const items = itemsWrap.querySelectorAll('.item___FVjkZ');
        items.forEach(item => {
            const style = item.getAttribute('style') || '';
            const leftMatch = style.match(/left:\s*([\d.]+)px/);
            if (leftMatch && parseFloat(leftMatch[1]) > CONFIG.candyMaxLeft) count++;
        });
        return count;
    }

    function getPotItemCount() {
        const itemsWrap = safeQuerySelector('.items-wrap____FstM');
        if (!itemsWrap) return 0;
        return itemsWrap.querySelectorAll('.item___FVjkZ').length;
    }

    function getSelectedItem() {
        // Try the specific pot dropdown first
        const dropdowns = safeQuerySelectorAll('.react-dropdown-default, [data-testid="react-dropdown-default"]');

        for (const dropdown of dropdowns) {
            const input = dropdown.querySelector('input[data-testid="dropdown-input"]');
            const button = dropdown.querySelector('button[data-testid="dropdown-toggler"]');

            if (input && button) {
                const buttonText = (button.textContent || '').trim();

                // Must match pattern: "Item Name x123"
                if (buttonText && /\sx\d+$/i.test(buttonText)) {
                    const itemId = parseInt(input.value);
                    if (!isNaN(itemId) && itemId > 0 && itemId < 10000) {
                        const itemName = buttonText.replace(/\s*x\d+$/i, '').trim();
                        return { id: input.value, name: itemName };
                    }
                }
            }
        }
        return null;
    }

    function getAddButton() {
        const gameArea = safeQuerySelector('.ctMiniGameWrapper___ZYVGA');
        const searchArea = gameArea || document;

        const buttons = searchArea.querySelectorAll('button');
        for (const btn of buttons) {
            if (btn.textContent.trim() === 'Add' && !btn.disabled && btn.offsetParent !== null) {
                return btn;
            }
        }
        return null;
    }

    // ============================================
    // SOUNDS
    // ============================================

    function playSound(freq = 800) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    }

    function playWinSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523, 659, 784, 1047];
            let time = ctx.currentTime;

            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = freq;
                osc.type = 'square';
                gain.gain.setValueAtTime(0.12, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
                osc.start(time);
                osc.stop(time + 0.15);
                time += 0.12;
            });

            // Final chord
            setTimeout(() => {
                [523, 659, 784, 1047].forEach(freq => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.4);
                });
            }, 350);
        } catch (e) {}
    }

    // ============================================
    // AUTO-CLICK
    // ============================================

    function stopClicking(reason = 'Complete') {
        if (clickInterval) {
            clearInterval(clickInterval);
            clickInterval = null;
        }

        isClicking = false;
        if (statusPanel) statusPanel.classList.remove('clicking');

        const statusEl = document.getElementById('pcs-status');
        if (statusEl) {
            statusEl.textContent = reason;
            statusEl.className = 'pcs-value trigger';
        }

        addLog(`${reason} (${totalClicks} clicks)`, 'trigger');
        playSound(1200);
        totalClicks = 0;

        scheduleCheck(500);
    }

    function startAutoClick(triggerReason) {
        if (isClicking) return;

        const addBtn = getAddButton();
        if (!addBtn) {
            addLog('Add button not found!', 'warn');
            return;
        }

        isClicking = true;
        totalClicks = 0;
        if (statusPanel) statusPanel.classList.add('clicking');

        const statusEl = document.getElementById('pcs-status');
        if (statusEl) {
            statusEl.textContent = 'SPAMMING!';
            statusEl.className = 'pcs-value clicking';
        }

        addLog(`${triggerReason} - ${appData.clicksPerSecond}/sec`, 'click');
        playSound(1000);

        const intervalMs = Math.floor(1000 / appData.clicksPerSecond);

        clickInterval = setInterval(() => {
            const btn = getAddButton();

            if (!btn || btn.disabled || btn.offsetParent === null) {
                stopClicking('Done!');
                return;
            }

            if (totalClicks >= 100) {
                stopClicking('Max clicks');
                return;
            }

            btn.click();
            totalClicks++;

            if (statusEl) statusEl.textContent = `CLICKING (${totalClicks})`;
            if (totalClicks % 5 === 0) playSound(600 + (totalClicks % 20) * 20);
        }, intervalMs);
    }

    // ============================================
    // MAIN CHECK - Debounced
    // ============================================

    function scheduleCheck(delay = 100) {
        if (checkTimeout) clearTimeout(checkTimeout);
        checkTimeout = setTimeout(checkPot, delay);
    }

    function checkPot() {
        if (isClicking) return;

        try {
            checkForWin();

            const energyCount = countEnergyDrinks();
            const potCount = getPotItemCount();
            const selectedItem = getSelectedItem();
            const isSafe = selectedItem ? isItemSafe(selectedItem.id) : false;

            if (energyCount !== currentEnergyCount) {
                addLog(`Energy: ${energyCount}`, energyCount >= appData.triggerCount ? 'trigger' : 'msg');
                currentEnergyCount = energyCount;
            }

            if (potCount !== currentPotCount && appData.itemCountTrigger > 0) {
                addLog(`Pot: ${potCount}`, potCount >= appData.itemCountTrigger ? 'trigger' : 'msg');
                currentPotCount = potCount;
            } else {
                currentPotCount = potCount;
            }

            updateStatus(energyCount, potCount, selectedItem?.name || '--', isSafe);

            const energyTriggerMet = energyCount >= appData.triggerCount;
            const itemTriggerMet = appData.itemCountTrigger > 0 && potCount >= appData.itemCountTrigger;
            const canClick = !appData.enablePriceCheck || isSafe;

            if ((energyTriggerMet || itemTriggerMet) && canClick) {
                const reason = energyTriggerMet ? `${energyCount} energy` : `${potCount} items`;
                addLog(`TRIGGER: ${reason}!`, 'trigger');
                if (statusPanel) {
                    statusPanel.classList.add('triggered');
                    setTimeout(() => statusPanel.classList.remove('triggered'), 2000);
                }
                startAutoClick(reason);
            } else if ((energyTriggerMet || itemTriggerMet) && !canClick) {
                addLog(`Blocked: ${selectedItem?.name}`, 'warn');
            }
        } catch (e) {
            console.error('[PotClicker] Check error:', e);
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        console.log('[PotClicker] Initializing...');

        // Wait for page to be fully ready
        const waitForGame = setInterval(() => {
            const gameArea = safeQuerySelector('.ctMiniGameWrapper___ZYVGA');
            const scoreBoard = safeQuerySelector('.score-board___JGMeY');
            const board = safeQuerySelector('.board___kTVX5');

            if (gameArea || scoreBoard || board) {
                clearInterval(waitForGame);
                console.log('[PotClicker] Game found, starting...');

                // Small delay to let React finish rendering
                setTimeout(() => {
                    createStatusPanel();
                    checkPot();

                    // Use a gentler observer - only watch specific container
                    const observeTarget = gameArea || document.body;
                    const observer = new MutationObserver(() => {
                        if (!isClicking) scheduleCheck(100);
                    });

                    observer.observe(observeTarget, {
                        childList: true,
                        subtree: true,
                        attributes: false // Don't watch attributes - too noisy
                    });

                    // Backup interval check
                    setInterval(() => {
                        if (!isClicking) scheduleCheck(0);
                    }, 1000);

                    addLog('Watching for triggers...', 'msg');
                    if (appData.username) {
                        addLog(`Tracking: ${appData.username}`, 'msg');
                    }
                }, 500);
            }
        }, 500);

        // Safety timeout - give up after 30 seconds
        setTimeout(() => {
            clearInterval(waitForGame);
        }, 30000);
    }

    // Start after a short delay to let Torn's scripts run first
    if (document.readyState === 'complete') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1000));
    }

})();