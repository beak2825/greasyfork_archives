// ==UserScript==
// @name          Blackjack ToolKit V6.3
// @version       6.3
// @description   Result shows immediately when Dealer has 2 cards. Auto-bet waits 2s. Fixed card counting.
// @author        M7TEM
// @match         https://www.torn.com/page.php?sid=blackjack*
// @match         https://www.torn.com/pda.php*step=blackjack*
// @grant         GM.xmlHttpRequest
// @connect       api.torn.com
// @license       MIT
// @namespace     blackjack.toolkit
// @downloadURL https://update.greasyfork.org/scripts/556052/Blackjack%20ToolKit%20V63.user.js
// @updateURL https://update.greasyfork.org/scripts/556052/Blackjack%20ToolKit%20V63.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================== PART 1: CONSTANTS ==============================
    const PANEL_ID = 'bj-tracker-panel';
    const STORAGE = 'torn_bj_tracker_results_v2';
    const PROFIT_STORAGE = 'torn_bj_total_profit_v2';
    const API_KEY_STORAGE = 'bj_tracker_api_key';
    const LAST_SYNC_KEY = 'bj_tracker_last_sync';
    const LAST_SCANNED_TIMESTAMP = 'bj_tracker_last_scanned';
    const PANEL_POS_KEY = 'bj_tracker_pos';
    const SESSION_ACTIVE_KEY = 'bj_session_active';
    const SESSION_PROFIT_KEY = 'bj_session_profit';
    const SESSION_START_KEY = 'bj_session_start';
    const UI_MINIMIZED = 'UI_MINIMIZED';
    const RISK_LOCK_KEY = 'bj_risk_lock_target';
    const AUTO_BET_KEY = 'bj_auto_bet_settings';

    const LOG_ID_WIN = 8355;
    const LOG_ID_LOSE = 8354;
    const LOG_ID_PUSH = 8358;
    const RESULT_LOG_IDS = [LOG_ID_WIN, LOG_ID_LOSE, LOG_ID_PUSH];
    const API_SYNC_INTERVAL_MS = 15 * 1000;

    // --- State Variables ---
    let apiKey = '';
    let results = [];
    let totalProfit = 0;
    let isTrackerDragging = false;
    let isSessionActive = false;
    let sessionProfit = 0;
    let sessionStartDate = 0;
    let isSyncing = false;
    let isProcessingAction = false;
    let currentView = 'main';
    let currentStatsTimeframe = 7;
    let lastScannedTime = 0;
    let isHandActive = false;
    let helperUpdateTimeout = null;
    let isMinimized = false;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let lastRenderedState = '';
    let lastSyncTime = 0;
    let cachedDealerHand = { cards: [], cardTexts: [], total: 0 };
    let lastPlayerCardCount = 0;
    let shiftKeyHeld = false;
    let lockedParam = localStorage.getItem(RISK_LOCK_KEY) || 'capital';

    // Auto-Bet State
    let isRoundInProgress = false;
    let isDoubleActive = false;
    let autoBetTimer = null;
    let countdownValue = 0;
    let autoBetSettings = { resetWin: false, multLoss: false, multPush: false };

    function initializeTrackerState() {
        apiKey = localStorage.getItem(API_KEY_STORAGE) || '';
        results = JSON.parse(localStorage.getItem(STORAGE) || '[]');
        totalProfit = parseFloat(localStorage.getItem(PROFIT_STORAGE) || '0');
        isMinimized = localStorage.getItem(UI_MINIMIZED) === 'true';
        isSessionActive = JSON.parse(localStorage.getItem(SESSION_ACTIVE_KEY) || 'false');
        sessionProfit = parseFloat(localStorage.getItem(SESSION_PROFIT_KEY) || '0');
        sessionStartDate = parseInt(localStorage.getItem(SESSION_START_KEY) || '0', 10);
        lastScannedTime = parseInt(localStorage.getItem(LAST_SCANNED_TIMESTAMP) || '0', 10);

        try {
            const savedAuto = JSON.parse(localStorage.getItem(AUTO_BET_KEY));
            if(savedAuto) autoBetSettings = savedAuto;
        } catch(e){}

        if (results.length > 0) {
            setTimeout(() => {
                results.sort((a,b) => b.timestamp - a.timestamp);
                refreshTrackerUI();
            }, 0);
        }
    }

    initializeTrackerState();

    // --- Utility Functions ---
    function formatNumberToKMB(num) {
        if (typeof num !== 'number' || !isFinite(num)) return 'NaN';
        if (num === 0) return '0';
        const abs = Math.abs(num);
        const sign = num < 0 ? '-' : '';
        if (abs >= 1e9) return sign + (abs / 1e9).toFixed(2) + 'b';
        if (abs >= 1e6) return sign + (abs / 1e6).toFixed(2) + 'm';
        if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + 'k';
        return sign + abs.toLocaleString();
    }

    function safeSetBet(amount) {
        const input = document.querySelector('.input-money') || document.querySelector('input.bet');
        if (input) {
            input.value = String(amount);
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function safeGetBet() {
        const input = document.querySelector('.input-money') || document.querySelector('input.bet');
        return input ? parseInt(input.value.replace(/,/g, ''), 10) || 0 : 0;
    }

    function getCurrentBet() { return safeGetBet(); }

    // --- UI Construction ---
    function createTrackerPanel() {
        if (document.getElementById(PANEL_ID)) return;

        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            #${PANEL_ID} {
                position: fixed; top: 10px; right: 10px; z-index: 2147483647;
                background-color: #1a1a1a; border: 2px solid #FFD700; border-radius: 8px;
                padding: 8px; width: 230px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                font-family: monospace; color: #E0E0E0; line-height: 1.4;
            }
            .bj-green { color: #4CAF50; font-weight: bold; }
            .bj-red { color: #FF6F69; font-weight: bold; }
            .bj-grey { color: #AAAAAA; font-weight: normal; }
            .bj-gold { color: #FFD700; font-weight: bold; }

            .bj-trk-btn {
                background: #333; border: 1px solid #555; color: #FFD700; cursor: pointer;
                border-radius: 4px; padding: 5px; font-size: 11px; font-weight: bold; text-transform: uppercase;
            }
            .bj-trk-btn:hover { background: #444; border-color: #FFD700; }

            /* Helper Buttons */
            .bj-helper-button {
                flex-grow: 1; padding: 6px 4px; font-size: 12px; font-weight: 700;
                cursor: pointer; color: #E0E0E0; background-color: #2a2a2a;
                border: 1px solid #555; border-radius: 4px; text-transform: uppercase;
            }
            .bj-helper-button:hover { background-color: #444; }
            .bj-hit { border-color: #FF5722 !important; background-color: rgba(255, 87, 34, 0.4) !important; color: white !important; }
            .bj-stand, .bj-double { border-color: #4CAF50 !important; background-color: rgba(76, 175, 80, 0.4) !important; color: white !important; }
            .bj-split { border-color: #2196F3 !important; background-color: rgba(33, 150, 243, 0.4) !important; color: white !important; }

            /* Risk Panel & Inputs */
            .bj-risk-display {
                background: #111; border: 1px solid #333; padding: 5px; margin-top: 5px;
                font-size: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
            }
            .bj-risk-label { color: #888; text-align: left; }
            .bj-risk-val { text-align: right; font-weight: bold; }

            .bj-input-group { display:flex; align-items:center; gap:2px; }
            .bj-input { width: 100%; box-sizing: border-box; background: #333; color: white; border: 1px solid #555; padding: 3px; text-align: right; font-family:monospace;}
            .bj-lock-btn { cursor:pointer; font-size:12px; opacity:0.3; user-select:none; }
            .bj-lock-btn.locked { opacity:1; color:#4CAF50; }
            .bj-input-label { font-size: 10px; color: #aaa; display: block; margin-bottom: 2px; }

            /* History */
            .bj-history-row {
                display: grid; grid-template-columns: 35px 70px 1fr 1fr; gap: 2px;
                font-size: 10px; border-bottom: 1px solid #222; padding: 2px 0;
            }
            .bj-view { display: none; flex-direction: column; gap: 8px; }
            .bj-view.active { display: flex; }
        `;
        document.head.appendChild(styleSheet);

        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style.display = 'flex'; panel.style.flexDirection = 'column'; panel.style.gap = '8px';
        document.body.appendChild(panel);

        try {
            const pos = JSON.parse(localStorage.getItem(PANEL_POS_KEY));
            if (pos) { panel.style.top = pos.top; panel.style.left = pos.left; }
        } catch(e){}

        const header = document.createElement('div');
        Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'move', borderBottom: '1px solid #333', paddingBottom: '5px' });
        header.innerHTML = '<span style="font-weight:bold; color: #FFD700;">♠️ BJ ToolKit V6.3</span>';
        const minimizeBtn = document.createElement('span');
        minimizeBtn.textContent = isMinimized ? '[+]' : '[-]'; minimizeBtn.style.cursor = 'pointer';
        // ADD THIS LINE: Increase padding to expand the tap area
        minimizeBtn.style.padding = '10px';
        // ADD THIS LINE: Ensure it doesn't trigger drag when touched
        minimizeBtn.addEventListener('touchstart', (e) => e.stopPropagation(), {passive: false});
        minimizeBtn.onclick = () => {
            isMinimized = !isMinimized;
            minimizeBtn.textContent = isMinimized ? '[+]' : '[-]';
            document.getElementById('bj-trk-content-wrap').style.display = isMinimized ? 'none' : 'block';
            localStorage.setItem(UI_MINIMIZED, isMinimized);
        };
        header.appendChild(minimizeBtn);
        panel.appendChild(header);

        const contentWrap = document.createElement('div');
        contentWrap.id = 'bj-trk-content-wrap';
        if(isMinimized) contentWrap.style.display = 'none';
        panel.appendChild(contentWrap);

        // ================= VIEW 1: MAIN DASHBOARD =================
        const mainView = document.createElement('div');
        mainView.id = 'bj-view-main';
        mainView.className = 'bj-view active';
        contentWrap.appendChild(mainView);

        mainView.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; font-size:12px;">
                <div id="bj-total-profit">Life: <span class="bj-grey">...</span></div>
                <div id="bj-daily-profit">Daily: <span class="bj-grey">...</span></div>
            </div>
            <div id="bj-session-profit" style="font-size:12px;">Session: <span class="bj-grey">...</span></div>
            <div id="bj-real-bet-display" style="text-align:center; font-size:13px; font-weight:bold; color:#FFD700; margin: 4px 0; border: 1px solid #333; background:rgba(255,215,0,0.1); border-radius:4px; padding:3px;">Bet: $0</div>
            <div id="bj-sync-status" style="font-size: 9px; color: #666; margin-top:2px;">Sync: --</div>
        `;

        const actionRow = document.createElement('div');
        Object.assign(actionRow.style, { display: 'flex', gap: '5px' });
        actionRow.innerHTML = `
            <button id="nav-session" class="bj-trk-btn" style="flex:1">▶</button>
            <button id="nav-stats" class="bj-trk-btn" style="flex:1">📊</button>
            <button id="nav-settings" class="bj-trk-btn" style="flex:1">⚙️</button>
            <button id="nav-sync" class="bj-trk-btn" style="flex:1">🔄</button>
        `;
        mainView.appendChild(actionRow);

        const riskDisplay = document.createElement('div');
        riskDisplay.className = 'bj-risk-display';
        riskDisplay.innerHTML = `
            <span class="bj-risk-label">Streak:</span> <span id="rk-streak" class="bj-risk-val">0</span>
            <span class="bj-risk-label">Total Loss:</span> <span id="rk-tot-loss" class="bj-risk-val" style="color:#FF6F69">$0</span>
            <span class="bj-risk-label">Pot. Loss:</span> <span id="rk-pot-loss" class="bj-risk-val" style="color:#FF6F69">$0</span>
            <span class="bj-risk-label">Pot. Profit:</span> <span id="rk-pot-prof" class="bj-risk-val" style="color:#4CAF50">$0</span>
        `;
        mainView.appendChild(riskDisplay);

        const bettingControls = document.createElement('div');
        bettingControls.id = 'bj-betting-controls';
        mainView.appendChild(bettingControls);

        const dynamicContent = document.createElement('div');
        dynamicContent.id = 'bj-dynamic-content';
        dynamicContent.innerHTML = `<div id="bj-recent-games" style="max-height: 120px; overflow-y: auto; border: 1px solid #333; padding: 2px; background: rgba(0,0,0,0.3);"></div>`;
        mainView.appendChild(dynamicContent);
        // ================= VIEW 2: SETTINGS PAGE =================
        const settingsView = document.createElement('div');
        settingsView.id = 'bj-view-settings';
        settingsView.className = 'bj-view';
        settingsView.innerHTML = `
            <button class="bj-trk-btn" id="sets-back" style="width:100%">« Back to Game</button>

            <div style="background:#111; padding:5px; border:1px solid #333;">
                <h4 style="margin:0 0 5px 0; color:#FFD700; font-size:11px;">Risk Calculator</h4>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
                        <div><span class="bj-input-label">Streak</span><input id="bj-risk-streak" class="bj-input" value="${localStorage.getItem('bj_risk_streak')||'10'}"></div>
                        <div><span class="bj-input-label">Mult (x)</span><input id="bj-multiplier-input" class="bj-input" value="${localStorage.getItem('bj_multiplier_value')||'2.2'}" step="0.1"></div>
                    </div>
                    <div>
                        <span class="bj-input-label">Total Capital</span>
                        <div class="bj-input-group">
                            <span class="bj-lock-btn" id="lock-cap" title="Lock Capital">🔒</span>
                            <input id="bj-risk-capital" class="bj-input" value="${localStorage.getItem('bj_risk_capital')||'10000000'}">
                        </div>
                    </div>
                    <div>
                        <span class="bj-input-label">Starting Bet</span>
                        <div class="bj-input-group">
                            <span class="bj-lock-btn" id="lock-bet" title="Lock Bet">🔒</span>
                            <input id="bj-start-bet-input" class="bj-input" value="${localStorage.getItem('bj_start_bet_value')||'20000'}">
                        </div>
                    </div>
                </div>
            </div>

            <div style="background:#111; padding:5px; border:1px solid #333;">
                <h4 style="margin:0 0 5px 0; color:#FFD700; font-size:11px;">Auto-Betting (2s Delay)</h4>
                <div style="display:flex; flex-direction:column; gap:4px;">
                    <label style="font-size:11px; cursor:pointer;"><input type="checkbox" id="ab-reset-win"> Reset after Win</label>
                    <label style="font-size:11px; cursor:pointer;"><input type="checkbox" id="ab-mult-loss"> Multiply after Loss</label>
                    <label style="font-size:11px; cursor:pointer;"><input type="checkbox" id="ab-mult-push"> Multiply after Push</label>
                </div>
            </div>

            <div style="background:#111; padding:5px; border:1px solid #333;">
                <h4 style="margin:0 0 5px 0; color:#FFD700; font-size:11px;">API Data</h4>
                <input type="password" id="bj-api-input" class="bj-input" value="${apiKey}" placeholder="API Key">
                <div style="display:flex; gap:5px; margin-top:5px;">
                    <button id="bj-save-api" class="bj-trk-btn" style="flex:1">Save</button>
                    <button id="bj-reset-data" class="bj-trk-btn" style="flex:1; color:tomato; border-color:tomato">Reset</button>
                </div>
            </div>
        `;
        contentWrap.appendChild(settingsView);

        // ================= VIEW 3: STATS PAGE =================
        const statsView = document.createElement('div');
        statsView.id = 'bj-view-stats';
        statsView.className = 'bj-view';
        statsView.innerHTML = `
            <button class="bj-trk-btn" id="stats-back" style="width:100%">« Back to Game</button>
            <div style="background:#1a1a1a; padding:5px; border:1px solid #444;">
                <canvas id="bj-graph-canvas" width="200" height="150"></canvas>
                <div style="display:flex; gap:2px; justify-content:center; margin-top:5px;">
                    <button class="bj-trk-btn" data-days="1">1D</button>
                    <button class="bj-trk-btn" data-days="7">7D</button>
                    <button class="bj-trk-btn" data-days="30">30D</button>
                    <button class="bj-trk-btn" data-days="365">All</button>
                </div>
            </div>
            <div id="bj-winrate" style="text-align:center; font-size:10px; margin-top:5px; color:#aaa;"></div>
        `;
        contentWrap.appendChild(statsView);

        // --- Event Wiring ---
        document.getElementById('nav-session').onclick = toggleSession;
        document.getElementById('nav-sync').onclick = () => importApiData(false);
        document.getElementById('nav-settings').onclick = () => switchView('settings');
        document.getElementById('nav-stats').onclick = () => switchView('stats');
        document.getElementById('sets-back').onclick = () => switchView('main');
        document.getElementById('stats-back').onclick = () => switchView('main');

        statsView.querySelectorAll('[data-days]').forEach(btn => {
            btn.onclick = () => { currentStatsTimeframe = parseInt(btn.getAttribute('data-days')); updateGraph(); };
        });

        setupSettingsEvents();
        setupPersistentControls();


    }

    function switchView(viewName) {
        currentView = viewName;
        document.querySelectorAll('.bj-view').forEach(el => el.classList.remove('active'));
        document.getElementById(`bj-view-${viewName}`).classList.add('active');
        refreshTrackerUI();
        if(viewName === 'stats') setTimeout(updateGraph, 50);
    }

    function setupSettingsEvents() {
        document.getElementById('bj-save-api').onclick = () => {
            apiKey = document.getElementById('bj-api-input').value.trim();
            localStorage.setItem(API_KEY_STORAGE, apiKey);
            localStorage.setItem(LAST_SCANNED_TIMESTAMP, '0');
            lastScannedTime = 0;
            importApiData(false);
        };
        document.getElementById('bj-reset-data').onclick = () => {
            if(confirm("Reset all data?")) { localStorage.clear(); location.reload(); }
        };

        const elCap = document.getElementById('bj-risk-capital');
        const elStreak = document.getElementById('bj-risk-streak');
        const elMult = document.getElementById('bj-multiplier-input');
        const elBet = document.getElementById('bj-start-bet-input');
        const lCap = document.getElementById('lock-cap');
        const lBet = document.getElementById('lock-bet');

        // Auto-Bet Checkboxes
        const abReset = document.getElementById('ab-reset-win');
        const abMultLoss = document.getElementById('ab-mult-loss');
        const abMultPush = document.getElementById('ab-mult-push');

        abReset.checked = autoBetSettings.resetWin;
        abMultLoss.checked = autoBetSettings.multLoss;
        abMultPush.checked = autoBetSettings.multPush;

        const saveAutoBet = () => {
            autoBetSettings = { resetWin: abReset.checked, multLoss: abMultLoss.checked, multPush: abMultPush.checked };
            localStorage.setItem(AUTO_BET_KEY, JSON.stringify(autoBetSettings));
        };
        abReset.onchange = saveAutoBet;
        abMultLoss.onchange = saveAutoBet;
        abMultPush.onchange = saveAutoBet;

        const clean = (val) => parseFloat(String(val).replace(/,/g, '')) || 0;

        function updateLockUI() {
            lCap.classList.toggle('locked', lockedParam === 'capital');
            lBet.classList.toggle('locked', lockedParam === 'bet');
            elCap.style.borderColor = lockedParam === 'capital' ? '#4CAF50' : '#555';
            elBet.style.borderColor = lockedParam === 'bet' ? '#4CAF50' : '#555';
        }

        updateLockUI();

        lCap.onclick = () => { lockedParam = 'capital'; localStorage.setItem(RISK_LOCK_KEY, lockedParam); updateLockUI(); };
        lBet.onclick = () => { lockedParam = 'bet'; localStorage.setItem(RISK_LOCK_KEY, lockedParam); updateLockUI(); };

        function calculateRisk(source) {
            const streak = clean(elStreak.value);
            const mult = clean(elMult.value);
            if (mult <= 1 || streak <= 0) return;

            const factor = (1 - Math.pow(mult, streak)) / (1 - mult);

            if (source === 'capital') {
                lockedParam = 'capital';
                const cap = clean(elCap.value);
                const newBet = Math.floor(cap / factor);
                elBet.value = newBet;
                localStorage.setItem('bj_start_bet_value', newBet);
                localStorage.setItem('bj_risk_capital', cap);
            }
            else if (source === 'bet') {
                lockedParam = 'bet';
                const bet = clean(elBet.value);
                const newCap = Math.ceil(bet * factor);
                elCap.value = newCap;
                localStorage.setItem('bj_risk_capital', newCap);
                localStorage.setItem('bj_start_bet_value', bet);
            }
            else if (source === 'calc') {
                if (lockedParam === 'capital') {
                    const cap = clean(elCap.value);
                    const newBet = Math.floor(cap / factor);
                    elBet.value = newBet;
                    localStorage.setItem('bj_start_bet_value', newBet);
                } else {
                    const bet = clean(elBet.value);
                    const newCap = Math.ceil(bet * factor);
                    elCap.value = newCap;
                    localStorage.setItem('bj_risk_capital', newCap);
                }
            }

            localStorage.setItem(RISK_LOCK_KEY, lockedParam);
            localStorage.setItem('bj_risk_streak', streak);
            localStorage.setItem('bj_multiplier_value', mult);
            updateLockUI();
        }

        elCap.addEventListener('keyup', () => calculateRisk('capital'));
        elBet.addEventListener('keyup', () => calculateRisk('bet'));
        elStreak.addEventListener('keyup', () => calculateRisk('calc'));
        elMult.addEventListener('keyup', () => calculateRisk('calc'));
    }
    function setupPersistentControls() {
        const controls = document.getElementById('bj-betting-controls');
        if(!controls) return;
        controls.innerHTML = '';

        const row = document.createElement('div');
        row.style.display = 'flex'; row.style.gap = '5px'; row.style.marginTop = '5px';
        const btnStart = document.createElement('button'); btnStart.textContent = 'Deal'; btnStart.className = 'bj-helper-button'; btnStart.style.backgroundColor = '#F9A825'; btnStart.style.color='#333';
        const btnReset = document.createElement('button'); btnReset.textContent = 'Reset'; btnReset.className = 'bj-helper-button';
        const btnMult = document.createElement('button'); btnMult.id = 'bj-ctrl-mult'; btnMult.className = 'bj-helper-button';
        const btnDiv = document.createElement('button'); btnDiv.id = 'bj-ctrl-div'; btnDiv.className = 'bj-helper-button';

        const mult = parseFloat(localStorage.getItem('bj_multiplier_value') || '2.2').toFixed(1);
        btnMult.textContent = `x${mult}`; btnDiv.textContent = `/${mult}`;
        row.append(btnStart, btnReset, btnMult, btnDiv);
        controls.appendChild(row);

        setupHelperButtonEvents(btnStart, btnReset, btnMult, btnDiv, null, null, null, null);
    }

    function renderHelperContent(advice, handInfo, actionColor) {
        const container = document.createElement('div');
        Object.assign(container.style, { padding: '5px', background: '#1a1a1a', border: '1px solid #444', borderRadius: '4px', display:'flex', flexDirection:'column', gap:'5px'});

        container.innerHTML = `
            <div class="bj-trk-advice" style="--bj-border-color:${actionColor}">${advice}</div>
            <div id="bj-helper-hand-total" style="font-size:12px; text-align:center; color:#ccc;">${handInfo}</div>
        `;

        const row = document.createElement('div');
        row.style.display = 'flex'; row.style.gap = '5px';
        const bHit = document.createElement('button'); bHit.textContent='HIT'; bHit.className='bj-helper-button';
        const bStd = document.createElement('button'); bStd.textContent='STAND'; bStd.className='bj-helper-button';
        const bDbl = document.createElement('button'); bDbl.textContent='DBL'; bDbl.className='bj-helper-button';
        const bSpl = document.createElement('button'); bSpl.textContent='SPLIT'; bSpl.className='bj-helper-button';

        row.append(bHit, bStd, bDbl, bSpl);
        container.appendChild(row);

        bHit.style.display = 'none';
        bStd.style.display = 'none';
        bDbl.style.display = 'none';
        bSpl.style.display = 'none';

        let visibleBtn = null;
        if(advice === 'Hit') { bHit.style.display = 'block'; bHit.classList.add('bj-hit'); visibleBtn = bHit; }
        else if(advice === 'Stand') { bStd.style.display = 'block'; bStd.classList.add('bj-stand'); visibleBtn = bStd; }
        else if(advice === 'Double') { bDbl.style.display = 'block'; bDbl.classList.add('bj-double'); visibleBtn = bDbl; }
        else if(advice === 'Split') { bSpl.style.display = 'block'; bSpl.classList.add('bj-split'); visibleBtn = bSpl; }

        if (visibleBtn) {
            visibleBtn.style.width = '100%';
            visibleBtn.style.padding = '10px';
            visibleBtn.style.fontSize = '14px';
        }

        setupHelperButtonEvents(null,null,null,null, bHit, bStd, bDbl, bSpl);
        return container;
    }

    function updateRiskDisplay() {
        const elStreak = document.getElementById('rk-streak');
        const elTotLoss = document.getElementById('rk-tot-loss');
        const elPotLoss = document.getElementById('rk-pot-loss');
        const elPotProf = document.getElementById('rk-pot-prof');
        if (!elStreak) return;

        const sorted = results.slice().sort((a,b) => b.timestamp - a.timestamp);
        let streak = 0;
        let totalLoss = 0;
        for (let r of sorted) {
            if (r.result === 'lose') { streak++; totalLoss += Math.abs(r.profit); }
            else if (r.result === 'push') { continue; }
            else { break; }
        }

        const currentBet = getCurrentBet();
        const potentialLoss = totalLoss + currentBet;
        const potentialProfit = currentBet - totalLoss;

        elStreak.textContent = streak;
        elTotLoss.textContent = '$' + formatNumberToKMB(totalLoss);
        elPotLoss.textContent = '$' + formatNumberToKMB(potentialLoss);
        elPotProf.textContent = (potentialProfit >= 0 ? '+' : '-') + '$' + formatNumberToKMB(Math.abs(potentialProfit));
        elPotProf.style.color = potentialProfit >= 0 ? '#4CAF50' : '#FF6F69';
    }

    function renderRecentGamesList() {
        const container = document.getElementById('bj-recent-games');
        if (!container) return;

        let chronological = results.slice().sort((a,b) => a.timestamp - b.timestamp);
        let runningTotal = 0;
        const processed = chronological.map(r => {
            runningTotal += r.profit;
            return { ...r, accumulated: runningTotal };
        });

        const display = processed.sort((a,b) => b.timestamp - a.timestamp).slice(0, 100);
        let html = '';
        display.forEach((r, idx) => {
            let color = '#888'; let sign = '';
            let outcome = r.result.toUpperCase();
            if (r.isNatural) outcome = 'NATURAL';
            else if (r.isDouble && r.result==='win') outcome = 'WIN DBL';
            else if (r.isDouble && r.result==='lose') outcome = 'LOSE DBL';

            if (r.result === 'win') { color = '#4CAF50'; sign = '+'; }
            else if (r.result === 'lose') { color = '#E53935'; sign = '-'; }
            else if (r.result === 'push') { color = '#FFC107'; sign = ''; }

            let accColor = r.accumulated >= 0 ? '#4CAF50' : '#E53935';

            html += `
             <div class="bj-history-row">
                 <span style="color:#666; text-align:left;">#${results.length - idx}</span>
                 <span style="color:${color}; text-align:left; font-weight:bold; white-space:nowrap; overflow:hidden;">${outcome}</span>
                 <span style="color:${color}; text-align:right;">${sign}${formatNumberToKMB(Math.abs(r.profit))}</span>
                 <span style="color:${accColor}; text-align:right;">${formatNumberToKMB(r.accumulated)}</span>
             </div>`;
        });
        container.innerHTML = html;
    }

    function setupHelperButtonEvents(btnStart, btnResetBet, btnMult, btnDiv, btnHit, btnStand, btnDouble, btnSplit) {
        if (typeof window.isProcessingAction === 'undefined') window.isProcessingAction = false;

        // 1. EXACT MAPPING based on your HTML
        // We target the 'area' tag specifically.
        const selectorMap = {
            'hit': 'area[data-step="hit"]',
            'stand': 'area[data-step="stand"]',
            'doubleDown': 'area[data-step="doubleDown"]', // Note the capital 'D' from your HTML
            'split': 'area[data-step="split"]'
        };

        const clickAction = (scriptAction, confirm) => {
            // Global Safety Lock
            if (window.isProcessingAction) return;
            window.isProcessingAction = true;

            // Visual feedback
            document.querySelectorAll('.bj-helper-button').forEach(b => b.style.opacity = '0.5');

            // Set Double Active state for betting calculations
            if (scriptAction === 'doubleDown') isDoubleActive = true;
            else if (['hit', 'stand', 'split'].includes(scriptAction)) isDoubleActive = false;

            // 2. FIND THE EXACT AREA ELEMENT
            const selector = selectorMap[scriptAction];
            const area = document.querySelector(selector);

            if (area) {
                // Click the specific coordinate area
                area.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                // 3. HANDLE CONFIRMATION POPUP (Only for Double & Split)
                if (confirm) {
                    setTimeout(() => {
                        // Torn usually uses .confirm-action.yes or .btn.yes for modals
                        const yesBtn = document.querySelector('.confirm-action.yes') ||
                              document.querySelector('.action-yes') ||
                              document.querySelector('.btn.yes');
                        if (yesBtn) yesBtn.click();
                    }, 150);
                }
            } else {
                console.warn(`BJ Toolkit: Button not found for ${scriptAction}`);
            }

            // 4. RESET LOCK (1 second safety)
            setTimeout(() => {
                window.isProcessingAction = false;
                document.querySelectorAll('.bj-helper-button').forEach(b => b.style.opacity = '1');
            }, 1000);
        };

        // UI Button Event Listeners
        if (btnHit) btnHit.onclick = (e) => { e.stopPropagation(); clickAction('hit'); };
        if (btnStand) btnStand.onclick = (e) => { e.stopPropagation(); clickAction('stand'); };
        if (btnDouble) btnDouble.onclick = (e) => { e.stopPropagation(); clickAction('doubleDown', true); };
        if (btnSplit) btnSplit.onclick = (e) => { e.stopPropagation(); clickAction('split', true); };

        // --- DEAL BUTTON LOGIC ---
        if (btnStart) btnStart.onclick = (e) => {
            e.stopPropagation();
            if (window.isProcessingAction) return;
            window.isProcessingAction = true;
            btnStart.style.opacity = '0.5';

            // Look for the Start Game area/button
            // Usually data-step="startGame" based on standard Torn patterns
            const dealBtn = document.querySelector('[data-step="startGame"]');

            if (dealBtn) {
                isDoubleActive = false;
                dealBtn.click();

                // Handle "Confirm Bet" modal if it appears
                setTimeout(() => {
                    const yes = document.querySelector('.bet-confirm .yes') || document.querySelector('.confirm-yes');
                    if (yes) yes.click();
                }, 100);
            }

            setTimeout(() => {
                window.isProcessingAction = false;
                btnStart.style.opacity = '1';
            }, 1000);
        };

        // --- BETTING CONTROLS ---
        if (btnResetBet) btnResetBet.onclick = () => {
            const val = document.getElementById('bj-start-bet-input').value;
            safeSetBet(parseInt(val.replace(/,/g, ''), 10));
        };
        if (btnMult) btnMult.onclick = () => {
            const mult = parseFloat(document.getElementById('bj-multiplier-input').value) || 2.2;
            safeSetBet(Math.round(safeGetBet() * mult));
        };
        if (btnDiv) btnDiv.onclick = () => {
            const mult = parseFloat(document.getElementById('bj-multiplier-input').value) || 2.2;
            safeSetBet(Math.max(100, Math.round(safeGetBet() / mult)));
        };
    }

    function refreshTrackerUI() {
        if(currentView === 'main') {
            const totalEl = document.getElementById('bj-total-profit');
            if (totalEl) totalEl.innerHTML = `Life: <span class="${totalProfit >= 0 ? 'bj-green' : 'bj-red'}">$${formatNumberToKMB(totalProfit)}</span>`;
            const sessionEl = document.getElementById('bj-session-profit');
            if (sessionEl) sessionEl.innerHTML = `Session: <span class="${isSessionActive ? (sessionProfit >= 0 ? 'bj-green' : 'bj-red') : 'bj-grey'}">${isSessionActive ? '$' + formatNumberToKMB(sessionProfit) : 'Inactive'}</span>`;

            const today = new Date();
            today.setHours(0,0,0,0);
            const startDay = Math.floor(today.getTime()/1000);
            let dailyProfit = results.filter(r => r.timestamp >= startDay).reduce((acc, r) => acc + r.profit, 0);
            const dailyEl = document.getElementById('bj-daily-profit');
            if (dailyEl) dailyEl.innerHTML = `Daily: <span class="${dailyProfit >= 0 ? 'bj-green' : 'bj-red'}">$${formatNumberToKMB(dailyProfit)}</span>`;

            const btnSess = document.getElementById('nav-session');
            if(btnSess) btnSess.textContent = isSessionActive ? '⏹' : '▶';

            const status = document.getElementById('bj-sync-status');
            if (status) {
                const last = parseInt(localStorage.getItem(LAST_SYNC_KEY) || 0);
                const next = last + API_SYNC_INTERVAL_MS;
                const now = Date.now();

                if (isSyncing) {
                    status.textContent = 'Syncing...';
                } else {
                    const diff = Math.ceil((next - now) / 1000);
                    const secondsLeft = diff > 0 ? diff : 0;
                    // Toggle "Scanned" / "Partial" based on your logic, or just show timer
                    const scanText = lastScannedTime > 0 ? 'Scanned' : 'Partial';
                    status.textContent = `${scanText} | Next: ${secondsLeft}s`;
                }
            }
            const mult = parseFloat(localStorage.getItem('bj_multiplier_value') || '2.2').toFixed(1);
            const bm = document.getElementById('bj-ctrl-mult'); if(bm) bm.textContent=`x${mult}`;
            const bd = document.getElementById('bj-ctrl-div'); if(bd) bd.textContent=`/${mult}`;

            updateRiskDisplay();
            renderRecentGamesList();
        }
        else if (currentView === 'stats') {
            const wins = results.filter(r => r.result === 'win').length;
            const losses = results.filter(r => r.result === 'lose').length;
            const pushes = results.filter(r => r.result === 'push').length;
            const wr = document.getElementById('bj-winrate');
            if(wr) wr.innerHTML = `<span class="bj-green">W:${wins}</span> <span class="bj-red">L:${losses}</span> <span class="bj-gold">P:${pushes}</span>`;
        }
    }

    function toggleSession() {
        isSessionActive = !isSessionActive;
        if (isSessionActive) {
            sessionProfit = 0;
            sessionStartDate = Date.now();
            sessionProfit = results.filter(r => r.timestamp * 1000 >= sessionStartDate).reduce((sum, r) => sum + r.profit, 0);
        } else {
            sessionStartDate = 0;
        }
        localStorage.setItem(SESSION_ACTIVE_KEY, JSON.stringify(isSessionActive));
        localStorage.setItem(SESSION_PROFIT_KEY, sessionProfit.toString());
        localStorage.setItem(SESSION_START_KEY, sessionStartDate.toString());
        refreshTrackerUI();
    }

    async function importApiData(silent = true) {
        // 1. Safety Checks
        if (isSyncing || !apiKey) return;

        // 2. TIME CHECK (The Fix)
        // If we are running automatically (silent=true), checks if 5 seconds have passed.
        // If not enough time has passed, we EXIT immediately.
        if (silent && (Date.now() - lastSyncTime < API_SYNC_INTERVAL_MS)) {
            return;
        }

        isSyncing = true;

        try {
            const forward = await fetchLogs((results[0]?.timestamp || (Date.now()/1000)-86400));
            if(forward.length) processLogs(forward);

            if(!lastScannedTime) {
                let scanning=true, pt=results[results.length-1]?.timestamp || Math.floor(Date.now()/1000);
                while(scanning) {
                    const back = await fetchLogs(null, pt);
                    if(back.length) {
                        processLogs(back);
                        pt = Math.min(...back.map(l=>l.timestamp))-1;
                        if(back.length<100) { scanning=false; lastScannedTime=1; }
                    } else { scanning=false; lastScannedTime=1; }
                }
                localStorage.setItem(LAST_SCANNED_TIMESTAMP, lastScannedTime);
            }

            totalProfit = results.reduce((s,r)=>s+r.profit,0);
            sessionProfit = results.filter(r=>r.timestamp*1000 >= sessionStartDate).reduce((s,r)=>s+r.profit,0);
            localStorage.setItem(STORAGE, JSON.stringify(results));
            localStorage.setItem(PROFIT_STORAGE, totalProfit);
            localStorage.setItem(SESSION_PROFIT_KEY, sessionProfit);

            // Update the last sync time to NOW
            lastSyncTime = Date.now();
            localStorage.setItem(LAST_SYNC_KEY, lastSyncTime.toString());

            refreshTrackerUI();
            if(currentView === 'stats') updateGraph();

        } catch(e) { console.error(e); } finally { isSyncing=false; refreshTrackerUI(); }
    }
    async function fetchLogs(from, to) {
        let url = `https://api.torn.com/user/?selections=log&log=${RESULT_LOG_IDS.join(',')}&key=${apiKey}`;
        if(from) url+=`&from=${from+1}`; if(to) url+=`&to=${to}`;
        return new Promise(res => GM.xmlHttpRequest({method:"GET", url, onload:r=>{
            try{ res(Object.values(JSON.parse(r.responseText).log||{})); }catch{res([]);}
        }}));
    }
    function processLogs(logs) {
        const exist = new Set(results.map(r=>r.timestamp));
        for(let l of logs) {
            if(exist.has(l.timestamp)) continue;
            let res, prof=0, isNat=(l.data.win_state||'').includes('natural');
            if(l.log===LOG_ID_WIN) { prof=l.data.winnings-(l.data.winnings/(isNat?2.5:2)); res='win'; }
            else if(l.log===LOG_ID_LOSE) { prof=-(l.data.losses||0); res='lose'; }
            else if(l.log===LOG_ID_PUSH) { res='push'; }
            if(res) results.push({result:res, profit:prof, timestamp:l.timestamp, isNatural:isNat, isDouble: (l.data.winnings/(isNat?2.5:2)) > 10000000 });
        }
        results.sort((a,b)=>b.timestamp-a.timestamp);
    }

    function updateGraph() {
        const c = document.getElementById('bj-graph-canvas'); if(!c) return;
        const ctx = c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
        const pts = results.filter(r=>r.timestamp >= (Date.now()/1000)-(currentStatsTimeframe*86400)).sort((a,b)=>a.timestamp-b.timestamp);
        if(pts.length<2) return;
        let acc=0; const data=pts.map(p=>{acc+=p.profit; return {t:p.timestamp, v:acc};});
        const p=20, W=c.width-p*2, H=c.height-p*2;
        const minV=Math.min(0,...data.map(d=>d.v)), maxV=Math.max(0,...data.map(d=>d.v));
        const minT=data[0].t, rangeT=data[data.length-1].t-minT, rangeV=maxV-minV||1;
        ctx.strokeStyle='#444'; const zY = (c.height-p) - ((0-minV)/rangeV)*H;
        ctx.beginPath(); ctx.moveTo(p, zY); ctx.lineTo(c.width-p, zY); ctx.stroke();
        ctx.strokeStyle='#FFD700'; ctx.lineWidth=1.5; ctx.beginPath();
        data.forEach((d,i)=>{
            const x = p + ((d.t-minT)/rangeT)*W;
            const y = (c.height-p) - ((d.v-minV)/rangeV)*H;
            if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        });
        ctx.stroke();
    }

    function updateHelper() {
        if (currentView !== 'main') return;
        const dc = document.getElementById('bj-dynamic-content');
        if (!dc) return;
        const panel = document.getElementById(PANEL_ID);

        // 1. Get Fresh Data
        const pHand = getHandInfo('.player-cards');
        let dHand = getHandInfo('.dealer-cards');

        // --- RESET LOGIC (Based on card-back) ---
        const dealerHasHiddenCard = document.querySelector('.dealer-cards .card-back');

        if (dealerHasHiddenCard) {
            // NEW ROUND DETECTED: Reset the memory
            cachedDealerHand = { cards: [], cardTexts: [], total: 0 };
        } else {
            // END GAME PHASE: Use Cache to prevent "Disappearing Card" glitch
            if (dHand.cards.length >= cachedDealerHand.cards.length) {
                cachedDealerHand = dHand;
            } else if (dHand.cards.length < cachedDealerHand.cards.length) {
                if (cachedDealerHand.cards.length > 0) {
                    dHand = cachedDealerHand;
                }
            }
        }

        // --- REAL-TIME BET DISPLAY UPDATE ---
        const realBet = getCurrentBet();
        const betEl = document.getElementById('bj-real-bet-display');
        if (betEl) betEl.innerText = `Bet: $${formatNumberToKMB(realBet)}`;

        // --- GAME STATE LOGIC ---
        let gameState = 'waiting';

        if (dealerHasHiddenCard && pHand.cards.length > 0) {
            gameState = 'active';
        } else if (pHand.cards.length >= 2) {
            if (pHand.total > 21) {
                gameState = 'over'; // Player Bust
            } else if (dHand.cards.length === 1) {
                gameState = 'active'; // Dealer 1 Up card
            } else if (dHand.cards.length >= 2) {
                gameState = 'over'; // Dealer played
            }
        }

        updateRiskDisplay();

        const stateKey = `${gameState}_${pHand.total}_${dHand.total}_${results.length}`;
        if (stateKey === lastRenderedState && !autoBetTimer) return;
        lastRenderedState = stateKey;

        if (gameState === 'active') {
            // --- ACTIVE: SHOW STRATEGY ---
            isRoundInProgress = true;

            if (autoBetTimer) { clearInterval(autoBetTimer); autoBetTimer = null; }

            const dVal = dHand.cards[0] === 11 ? 1 : dHand.cards[0];
            let strat = getStrategyAction(pHand, dVal);
            if (pHand.total === 21) strat = 'Stand';

            const color = strat.includes('Hit') ? '#FF5722' : (strat.includes('Stand') ? '#4CAF50' : '#2196F3');
            const pTxt = `[${pHand.cardTexts.join(',')}]`;
            const dTxt = `[${dHand.cardTexts.join(',')}]`;

            dc.innerHTML = '';
            dc.appendChild(renderHelperContent(strat, `P: ${pHand.total} ${pTxt} | D: ${dHand.total} ${dTxt}`, color));
            panel.style.border = `2px solid ${color}`;

        } else if (gameState === 'over') {
            // --- OVER: RESULT & COUNTDOWN ---
            panel.style.border = '2px solid #FFD700';

            let resText = "Processing Result...", resColor = "#888";
            let outcome = null;

            const pTxt = `[${pHand.cardTexts.join(',')}]`;
            const dTxt = `[${dHand.cardTexts.join(',')}]`;

            // --- FIX: DETECT NATURAL BLACKJACK ---
            const pNatural = pHand.total === 21 && pHand.cards.length === 2;
            const dNatural = dHand.total === 21 && dHand.cards.length === 2;

            if (pHand.total > 0) {
                if (pHand.total > 21) {
                    resText = `YOU LOSE (BUST ${pHand.total} ${pTxt})`;
                    resColor = "#E53935";
                    outcome = 'lose';
                } else if (dHand.total > 21) {
                    resText = `YOU WIN (DEALER BUST ${dHand.total} ${dTxt})`;
                    resColor = "#4CAF50";
                    outcome = 'win';
                } else if (pHand.total > dHand.total) {
                    resText = `YOU WIN (${pHand.total} ${pTxt} > ${dHand.total} ${dTxt})`;
                    resColor = "#4CAF50";
                    outcome = 'win';
                } else if (dHand.total > pHand.total) {
                    resText = `YOU LOSE (DEALER ${dHand.total} ${dTxt} > YOU ${pHand.total} ${pTxt})`;
                    resColor = "#E53935";
                    outcome = 'lose';
                } else {
                    // --- FIX: TIE-BREAKER LOGIC (Natural beats 3-card 21) ---
                    if (pNatural && !dNatural) {
                        resText = `YOU WIN (NATURAL BJ ${pTxt} > ${dHand.total})`;
                        resColor = "#4CAF50";
                        outcome = 'win';
                    } else if (!pNatural && dNatural) {
                        resText = `YOU LOSE (DEALER NATURAL ${dTxt})`;
                        resColor = "#E53935";
                        outcome = 'lose';
                    } else {
                        // Truly a tie (Both Natural or Both Regular 21)
                        resText = `PUSH (${pHand.total} ${pTxt} = ${dHand.total} ${dTxt})`;
                        resColor = "#FFC107";
                        outcome = 'push';
                    }
                }
            }

            const timerHtml = autoBetTimer ? `<br><span style="color:#FFD700; font-size:10px; font-weight:normal; display:block; margin-top:3px;">Auto-betting in ${countdownValue}s...</span>` : '';

            dc.innerHTML = `<div id="bj-result-message" style="text-align:center; padding:5px; font-weight:bold; color:${resColor}; font-size:11px; border-bottom:1px solid #333; text-transform:uppercase;">${resText}${timerHtml}</div><div id="bj-recent-games" style="max-height:120px; overflow-y:auto; border:1px solid #333; padding:2px; background:rgba(0,0,0,0.3);"></div>`;
            renderRecentGamesList();

            // --- AUTO BET TRIGGER ---
            if (isRoundInProgress && outcome && !autoBetTimer) {
                isRoundInProgress = false;
                const mult = parseFloat(document.getElementById('bj-multiplier-input').value) || 2.0;
                const startBetVal = parseInt(document.getElementById('bj-start-bet-input').value.replace(/,/g, '')) || 0;

                const shouldBet = (outcome === 'win' && autoBetSettings.resetWin) ||
                      (outcome === 'lose' && autoBetSettings.multLoss) ||
                      (outcome === 'push' && autoBetSettings.multPush);

                if (shouldBet) {
                    countdownValue = 1; // Timer set to 1s as per your provided code
                    const el = document.getElementById('bj-result-message');
                    if (el) el.innerHTML = `${resText}<br><span style="color:#FFD700; font-size:10px; font-weight:normal; display:block; margin-top:3px;">Auto-betting in ${countdownValue}s...</span>`;

                    autoBetTimer = setInterval(() => {
                        countdownValue--;
                        const elUpdate = document.getElementById('bj-result-message');
                        if (elUpdate) elUpdate.innerHTML = `${resText}<br><span style="color:#FFD700; font-size:10px; font-weight:normal; display:block; margin-top:3px;">Auto-betting in ${countdownValue}s...</span>`;

                        if (countdownValue <= 0) {
                            clearInterval(autoBetTimer);
                            autoBetTimer = null;

                            if (outcome === 'win') safeSetBet(startBetVal);
                            else if (outcome === 'lose') {
                                if (isDoubleActive) safeSetBet(Math.round(safeGetBet() * mult * mult));
                                else safeSetBet(Math.round(safeGetBet() * mult));
                            } else if (outcome === 'push') safeSetBet(Math.round(safeGetBet() * mult));

                            if (elUpdate) elUpdate.innerHTML = resText;
                        }
                    }, 1000);
                }
            }
        } else {
            // --- WAITING ---
            panel.style.border = '2px solid #FFD700';
            dc.innerHTML = `<div id="bj-result-message" style="text-align:center; padding:5px; font-weight:bold; color:#888; font-size:12px; border-bottom:1px solid #333;">Waiting for Deal...</div><div id="bj-recent-games" style="max-height:120px; overflow-y:auto; border:1px solid #333; padding:2px; background:rgba(0,0,0,0.3);"></div>`;
            renderRecentGamesList();
        }
    }

    function getStrategyAction(p, d) {
        const dIdx = d===1?11:d;
        let action = 'Hit';
        if(p.isPair && p.cards.length === 2) {
            const v = p.cards[0]===11?11:p.cards[0];
            if(v===11||v===8) action = 'Split';
            else if(v===5) action = (dIdx<10)?'Double':'Hit';
            else if(v===10) action = 'Stand';
            else if(v===9) action = (dIdx!==7 && dIdx!==10 && dIdx!==11)?'Split':'Stand';
            else if(v===7) action = (dIdx<=7)?'Split':'Hit';
            else if(v===6) action = (dIdx<=6)?'Split':'Hit';
            else if(v===4) action = (dIdx===5||dIdx===6)?'Split':'Hit';
            else if(v===3||v===2) action = (dIdx<=7)?'Split':'Hit';
            else action = 'Hit';
        }
        else if(p.isSoft) {
            if(p.total>=19) action = 'Stand';
            else if(p.total===18) {
                if (p.cards.length > 2) action = (dIdx <= 8) ? 'Stand' : 'Hit';
                else action = (dIdx>=3 && dIdx<=6)?'Double':(dIdx<=8?'Stand':'Hit');
            }
            else {
                if (p.cards.length > 2) action = 'Hit';
                else action = (dIdx>=3 && dIdx<=6)?'Double':'Hit';
            }
        }
        else {
            if(p.total>=17) action = 'Stand';
            else if(p.total>=13) action = (dIdx<=6)?'Stand':'Hit';
            else if(p.total===12) action = (dIdx>=4&&dIdx<=6)?'Stand':'Hit';
            else if(p.total===11) action = 'Double';
            else if(p.total===10) action = (dIdx<10)?'Double':'Hit';
            else if(p.total===9) action = (dIdx>=3&&dIdx<=6)?'Double':'Hit';
            else action = 'Hit';
        }
        if (action === 'Double' && p.cards.length > 2) action = 'Hit';
        return action;
    }

    // --- UPDATED CARD PARSER (Fixes sum errors & extracts string) ---
    function getHandInfo(selector) {
        const container = document.querySelector(selector);
        if (!container) return { cards: [], cardTexts: [], total: 0, isSoft: false, isPair: false };

        // 1. Get raw HTML to find cards regardless of nesting
        const html = container.innerHTML;

        // 2. Regex to find patterns like "card-spade-10"
        const regex = /card-(?:spade|heart|diamond|club)s?-([2-9]|10|[ajqk])/gi;

        const values = [];
        const texts = [];

        let match;
        while ((match = regex.exec(html)) !== null) {
            const rank = match[1].toUpperCase();
            texts.push(rank);

            let val = 0;
            if (['J', 'Q', 'K', '10'].includes(rank)) val = 10;
            else if (rank === 'A') val = 11;
            else val = parseInt(rank, 10);

            if(!isNaN(val)) values.push(val);
        }

        let sum = values.reduce((a, b) => a + b, 0);
        let aces = values.filter(v => v === 11).length;

        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }

        return {
            cards: values,
            cardTexts: texts,
            total: sum,
            isSoft: aces > 0,
            isPair: values.length === 2 && values[0] === values[1]
        };
    }
    // --- DRAGGING FUNCTIONS ---
    function startDragHeader(e) {
        // PC: Left click only
        if (e.type === 'mousedown' && e.button !== 0) return;
        // Mobile: 1 finger
        if (e.type === 'touchstart' && e.touches.length !== 1) return;

        isDragging = true;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const panel = document.getElementById(PANEL_ID);
        if(panel) {
            const rect = panel.getBoundingClientRect();
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;
        }
        e.preventDefault();
    }

    function startDragPanel(e) {
        // PC: Shift + Left Click
        if (e.type === 'mousedown' && (e.button !== 0 || !e.shiftKey)) return;
        // Mobile: 2 fingers
        if (e.type === 'touchstart' && e.touches.length !== 2) return;

        isDragging = true;
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const panel = document.getElementById(PANEL_ID);
        if(panel) {
            const rect = panel.getBoundingClientRect();
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;
        }
        e.preventDefault();
    }

    function doDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const panel = document.getElementById(PANEL_ID);
        if(panel) {
            let newX = clientX - dragOffsetX;
            let newY = clientY - dragOffsetY;
            // Bounds check
            newX = Math.max(0, Math.min(newX, window.innerWidth - panel.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - panel.offsetHeight));
            panel.style.left = newX + 'px';
            panel.style.top = newY + 'px';
        }
    }

    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            const panel = document.getElementById(PANEL_ID);
            if (panel) localStorage.setItem(PANEL_POS_KEY, JSON.stringify({ top: panel.style.top, left: panel.style.left }));
        }
    }

    function initialize() {
        createTrackerPanel();
        refreshTrackerUI();

        // Auto-Sync
        // Run every 1 second to update UI timer, but importApiData handles its own 5s throttle
        setInterval(() => {
            if(apiKey) importApiData(true); // This attempts sync (but respects the 5s limit now)
            if(currentView === 'main') refreshTrackerUI(); // This updates the text "Next: 4s", "Next: 3s"...
        }, 1000);

        new MutationObserver(() => { if(helperUpdateTimeout) clearTimeout(helperUpdateTimeout); helperUpdateTimeout=setTimeout(updateHelper,200); })
            .observe(document.body, {childList:true, subtree:true, attributes:true});
        // DOM Observer
        new MutationObserver(() => {
            if(helperUpdateTimeout) clearTimeout(helperUpdateTimeout);
            helperUpdateTimeout=setTimeout(updateHelper,200);
        }).observe(document.body, {childList:true, subtree:true, attributes:true});

        // --- NEW DRAGGING SETUP ---
        // We re-select the header here to attach the new listeners
        const header = document.querySelector('#' + PANEL_ID + ' > div:first-child');
        const panel = document.getElementById(PANEL_ID);

        // 1. Header Drag (PC: Left Click / Mobile: 1 Finger)
        if(header) {
            header.addEventListener('mousedown', startDragHeader);
            header.addEventListener('touchstart', startDragHeader);
        }

        // 2. Panel Drag (PC: Shift+Click / Mobile: 2 Fingers)
        if(panel) {
            panel.addEventListener('mousedown', startDragPanel);
            panel.addEventListener('touchstart', startDragPanel);
        }

        // 3. Global Movement Listeners
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('touchmove', doDrag, {passive: false});
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);

        // 4. Shift Key Listener (for PC Panel Dragging)
        document.addEventListener('keydown', (e) => { if (e.key === 'Shift') shiftKeyHeld = true; });
        document.addEventListener('keyup', (e) => { if (e.key === 'Shift') shiftKeyHeld = false; if (isDragging) stopDrag(); });
    }

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', initialize);
    else initialize();
})();