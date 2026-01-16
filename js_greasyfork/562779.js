// ==UserScript==
// @name         KIRA NEXUS
// @namespace    Gemini.Torn
// @version      1.1.0
// @description  Airstrip Prediction + Maximum Layer Priority + UI Recovery
// @author       Kira
// @license      MIT
// @match        *://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562779/KIRA%20NEXUS.user.js
// @updateURL https://update.greasyfork.org/scripts/562779/KIRA%20NEXUS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Airstrip Flight Times (Total Seconds)
    const FLIGHT_SECONDS = {
        "Mexico": 1080, "Cayman Islands": 1500, "Canada": 1740,
        "Hawaii": 5640, "United Kingdom": 6660, "Switzerland": 7380,
        "Argentina": 7020, "Japan": 9480, "China": 10140,
        "UAE": 11400, "South Africa": 12480
    };

    const AIRSTRIP_DATA = {
        "Mexico": 600000, "Cayman Islands": 500000, "Canada": 550000,
        "Hawaii": 700000, "United Kingdom": 600000, "Argentina": 650000,
        "Switzerland": 1200000, "Japan": 800000, "China": 1100000,
        "UAE": 1000000, "South Africa": 1300000
    };

    const DEFAULTS = { apiKey: "", dayName: "United Kingdom", sleepName: "China", profitMode: "market", traderRate: 98 };
    let config = JSON.parse(GM_getValue("kira_config", JSON.stringify(DEFAULTS)));
    let stats = JSON.parse(GM_getValue("kira_stats", `{"date":"${new Date().toLocaleDateString()}", "dailyProfit":0}`));
    let isMinimized = GM_getValue("kira_minimized", false);
    
    const savedPos = JSON.parse(GM_getValue("boxPos", '{"top":"150px", "left":"10px"}'));
    const savedSize = JSON.parse(GM_getValue("boxSize", '{"width":"260px", "height":"auto"}'));
    
    let cachedTimeLeft = 0;
    let lastSync = Date.now();
    let currentLoc = "Syncing...";

    // MAXIMIZED Z-INDEX AND LAYER FIXES
    GM_addStyle(`
        #kira-tracker { 
            position: fixed !important; 
            top: ${savedPos.top}; left: ${savedPos.left}; 
            width: ${isMinimized ? '140px' : savedSize.width}; 
            min-width: ${isMinimized ? '140px' : '220px'}; 
            background: #121212; color: #e0e0e0; padding: ${isMinimized ? '10px 15px' : '20px'}; 
            border-radius: ${isMinimized ? '30px' : '20px'}; 
            font-family: 'Inter', -apple-system, sans-serif; 
            z-index: 999999999 !important; /* Maximum safe z-index */
            border: 1px solid rgba(255, 255, 255, 0.15); 
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
            overflow: hidden; display: flex; flex-direction: column;
            opacity: 1 !important;
            touch-action: none;
            pointer-events: auto !important;
            -webkit-transform: translate3d(0,0,0); /* Force Hardware Acceleration for layering */
        }
        #top-bar { display: flex; align-items: center; margin-bottom: ${isMinimized ? '0' : '18px'}; cursor: grab; user-select: none; padding: 5px 0; }
        #status-dot { 
            width: 10px; height: 10px; border-radius: 50%; 
            background: #00ff9f; margin-right: 12px; 
            box-shadow: 0 0 12px #00ff9f;
            animation: kira-pulse 2s infinite ease-in-out;
        }
        @keyframes kira-pulse {
            0% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px #00ff9f; }
            50% { opacity: 0.7; transform: scale(0.95); box-shadow: 0 0 18px #00ff9f; }
            100% { opacity: 1; transform: scale(1); box-shadow: 0 0 12px #00ff9f; }
        }
        #title-text { flex-grow: 1; font-weight: 700; font-size: 13px; letter-spacing: 1px; color: #fff; text-transform: uppercase; display: ${isMinimized ? 'none' : 'block'}; }
        .nav-icons { display: flex; gap: 8px; }
        .nav-btn { cursor: pointer; color: #666; font-size: 18px; transition: color 0.2s; padding: 5px; font-weight: bold; }
        #tracker-body { display: ${isMinimized ? 'none' : 'block'}; }
        #mini-timer { display: ${isMinimized ? 'block' : 'none'}; font-size: 14px; font-weight: 700; color: #fff; margin-right: 10px; }
        .stat-group { margin-bottom: 15px; }
        .stat-label { font-size: 9px; text-transform: uppercase; color: #888; letter-spacing: 1px; margin-bottom: 4px; display: block; }
        .stat-value { font-size: 18px; font-weight: 600; color: #fff; }
        .stat-sub { font-size: 10px; color: #555; margin-left: 8px; cursor: pointer; text-transform: uppercase; padding: 5px; }
        #loc-display { color: #00d4ff; font-size: 12px; font-weight: 800; }
        #profit-display { color: #00ff9f; font-size: 20px; }
        .action-btn { 
            width: 100%; font-size: 10px; margin-top: 8px; cursor: pointer; 
            background: #1a1a1a; color: #aaa; border: 1px solid #333; 
            padding: 12px; border-radius: 10px; font-weight: 700; text-transform: uppercase;
        }
        #settings-menu { display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #333; }
        .kira-input { background: #000; color: #fff; border: 1px solid #444; width: 100%; margin-bottom: 10px; font-size: 16px; padding: 10px; border-radius: 8px; }
    `);

    async function syncAPI() {
        if (!config.apiKey) return;
        try {
            const res = await fetch(`https://api.torn.com/user/?selections=travel&key=${config.apiKey}`);
            const data = await res.json();
            if (data && data.travel) {
                cachedTimeLeft = data.travel.time_left;
                currentLoc = data.travel.destination || "Torn City";
                lastSync = Date.now();
                GM_setValue("last_travel_state", {time: cachedTimeLeft, stamp: lastSync, loc: currentLoc});
            }
        } catch (e) {}
    }

    function setupUI() {
        if (document.getElementById('kira-tracker')) return;
        const box = document.createElement('div');
        box.id = 'kira-tracker';
        const getOptions = (sel) => Object.keys(AIRSTRIP_DATA).map(l => `<option value="${l}" ${l===sel?'selected':''}>${l}</option>`).join('');

        box.innerHTML = `
            <div id="top-bar">
                <div id="status-dot"></div>
                <div id="mini-timer">00:00:00</div>
                <div id="title-text">Kira Nexus</div>
                <div class="nav-icons">
                    <div id="toggle-mini" class="nav-btn">${isMinimized ? '+' : '−'}</div>
                    <div id="open-settings" class="nav-btn">⚙</div>
                </div>
            </div>
            <div id="tracker-body">
                <div class="stat-group"><span class="stat-label">Timer</span><div id="time-display" class="stat-value">00:00:00</div><span id="manual-sync" class="stat-sub">Sync</span></div>
                <div class="stat-group"><span class="stat-label">Arrival Window</span><div id="land-display" style="font-size: 14px; color: #bfef45;">--:--:--</div></div>
                <div class="stat-group" style="background: #1a1a1a; padding: 10px; border-radius: 10px; border-left: 3px solid #00d4ff;"><span class="stat-label" style="color: #00d4ff;">Current Sector</span><div id="loc-display">SYNCING...</div></div>
                <div class="stat-group"><span class="stat-label" id="profit-mode-label">Session Profit</span><div id="profit-display" class="stat-value">$0.00M</div></div>
                <button id="add-profit" class="action-btn">Log Transaction</button>
                <button id="mode-swap" class="action-btn">Switch Route</button>
            </div>
            <div id="settings-menu">
                <span class="stat-label">API Key</span><input id="set-api" class="kira-input" value="${config.apiKey}">
                <span class="stat-label">Standard</span><select id="set-day" class="kira-input">${getOptions(config.dayName)}</select>
                <span class="stat-label">Extended</span><select id="set-sleep" class="kira-input">${getOptions(config.sleepName)}</select>
                <span class="stat-label">Valuation</span>
                <select id="set-method" class="kira-input">
                    <option value="market" ${config.profitMode === 'market' ? 'selected' : ''}>Market (-5%)</option>
                    <option value="trader" ${config.profitMode === 'trader' ? 'selected' : ''}>Trader (%)</option>
                </select>
                <div id="trader-rate-wrap"><span class="stat-label">Trader Ratio %</span><input id="set-rate" type="number" class="kira-input" value="${config.traderRate}"></div>
                <button id="save-settings" class="action-btn" style="background: #fff; color: #000;">Save & Apply</button>
                <button id="reset-ui" class="action-btn" style="background: #ff4444; color: #fff; margin-top: 20px;">Emergency UI Reset</button>
            </div>
        `;
        document.body.appendChild(box);

        // Movement logic
        const topBar = document.getElementById('top-bar');
        topBar.addEventListener('pointerdown', (e) => {
            if (e.target.closest('.nav-btn')) return;
            box.setPointerCapture(e.pointerId);
            let shiftX = e.clientX - box.getBoundingClientRect().left, shiftY = e.clientY - box.getBoundingClientRect().top;
            const onMove = (ev) => {
                let newX = Math.max(0, Math.min(window.innerWidth - box.offsetWidth, ev.clientX - shiftX));
                let newY = Math.max(0, Math.min(window.innerHeight - box.offsetHeight, ev.clientY - shiftY));
                box.style.left = newX + 'px'; box.style.top = newY + 'px'; 
            };
            const onUp = () => {
                window.removeEventListener('pointermove', onMove);
                GM_setValue("boxPos", JSON.stringify({top: box.style.top, left: box.style.left}));
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp, {once: true});
        });

        // UI Controls
        document.getElementById('toggle-mini').onclick = () => { isMinimized = !isMinimized; GM_setValue("kira_minimized", isMinimized); location.reload(); };
        document.getElementById('open-settings').onclick = () => { const m = document.getElementById('settings-menu'); m.style.display = (m.style.display === 'block') ? 'none' : 'block'; };
        document.getElementById('reset-ui').onclick = () => { GM_setValue("boxPos", '{"top":"150px", "left":"10px"}'); location.reload(); };
        document.getElementById('save-settings').onclick = () => {
            config.apiKey = document.getElementById('set-api').value;
            config.dayName = document.getElementById('set-day').value;
            config.sleepName = document.getElementById('set-sleep').value;
            config.profitMode = document.getElementById('set-method').value;
            config.traderRate = parseFloat(document.getElementById('set-rate').value) || 98;
            GM_setValue("kira_config", JSON.stringify(config)); location.reload();
        };

        document.getElementById('add-profit').onclick = async () => {
            if (!config.apiKey) return alert("API Key Required");
            try {
                const res = await fetch(`https://api.torn.com/user/?selections=basic&key=${config.apiKey}`);
                const data = await res.json();
                if (data.level < 15) return alert("International Deals are locked until Level 15.");
                const dest = GM_getValue("isSleep", false) ? config.sleepName : config.dayName;
                let finalProfit = config.profitMode === 'market' ? (AIRSTRIP_DATA[dest] || 0) * 0.95 : (AIRSTRIP_DATA[dest] || 0) * (config.traderRate / 100);
                stats.dailyProfit += finalProfit;
                GM_setValue("kira_stats", JSON.stringify(stats));
            } catch (e) { alert("API Error."); }
        };

        document.getElementById('mode-swap').onclick = () => { GM_setValue("isSleep", !GM_getValue("isSleep", false)); render(); };
        document.getElementById('manual-sync').onclick = () => syncAPI();
    }

    function render() {
        if (!document.getElementById('kira-tracker')) setupUI();
        const globalState = GM_getValue("last_travel_state", {time: 0, stamp: Date.now(), loc: "SYNCING..."});
        const isFlying = globalState.time > 0;
        const currentRoute = GM_getValue("isSleep", false) ? config.sleepName : config.dayName;
        
        let remaining = isFlying ? Math.max(0, globalState.time - Math.floor((Date.now() - globalState.stamp) / 1000)) : (FLIGHT_SECONDS[currentRoute] || 0);
        let arrivalTimestamp = isFlying ? globalState.stamp + (globalState.time * 1000) : Date.now() + (remaining * 1000);

        const pad = (n) => n.toString().padStart(2, '0');
        const timeStr = `${pad(Math.floor(remaining / 3600))}:${pad(Math.floor((remaining % 3600) / 60))}:${pad(remaining % 60)}`;
        
        if (document.getElementById('time-display')) document.getElementById('time-display').innerText = timeStr;
        if (document.getElementById('mini-timer')) document.getElementById('mini-timer').innerText = timeStr;
        if (document.getElementById('land-display')) document.getElementById('land-display').innerText = new Date(arrivalTimestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
        if (document.getElementById('loc-display')) document.getElementById('loc-display').innerText = globalState.loc.toUpperCase();
        if (document.getElementById('profit-display')) document.getElementById('profit-display').innerText = `$${(stats.dailyProfit / 1000000).toFixed(2)}M`;
        if (document.getElementById('mode-swap')) document.getElementById('mode-swap').innerText = `ROUTE: ${currentRoute}`.toUpperCase();
    }

    // High-frequency observer to fight Torn's dynamic UI refreshes
    const observer = new MutationObserver(() => { if (!document.getElementById('kira-tracker')) setupUI(); });
    observer.observe(document.body, { childList: true, subtree: true });

    setupUI(); syncAPI();
    setInterval(syncAPI, 30000); setInterval(render, 1000);
})();