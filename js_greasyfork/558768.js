// ==UserScript==
// @name         Torn Director Pro - Ultimate (v14.2)
// @namespace    http://tampermonkey.net/
// @version      14.2
// @description  Syncs with Master Sheet v24. Fixed Races Won & UI alignment.
// @author       You
// @match        https://www.torn.com/companies.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/558768/Torn%20Director%20Pro%20-%20Ultimate%20%28v142%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558768/Torn%20Director%20Pro%20-%20Ultimate%20%28v142%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CSS STYLES ---
    GM_addStyle(`
        #director-panel {
            position: fixed; top: 80px; right: 5px; width: 350px; max-width: 98vw;
            background-color: #1a1a1a; border: 2px solid #FFD700; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.8); z-index: 2147483647;
            font-family: monospace; font-size: 11px; color: #E0E0E0;
            display: block !important; touch-action: none; overflow: hidden;
            transition: width 0.3s, height 0.3s, opacity 0.3s;
        }
        #director-panel.minimized {
            top: 15vh !important; left: 0 !important; right: auto !important;
            width: 42px !important; height: 42px !important;
            border-radius: 0 8px 8px 0; border: 1px solid #FFD700; border-left: none;
            background: #111; cursor: pointer; overflow: hidden;
            display: flex !important; align-items: center; justify-content: center;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
        }
        #director-panel.minimized > * { display: none !important; }
        #director-panel.minimized::after { content: "♠️"; color: #FFD700; font-size: 24px; }

        #director-header {
            background-color: #222; padding: 10px; font-weight: bold; font-size: 12px;
            border-bottom: 1px solid #333; display: flex; justify-content: space-between;
            align-items: center; cursor: move; color: #FFD700; user-select: none;
        }
        .header-btn { cursor: pointer; margin-left: 10px; font-size: 14px; color: #aaa; pointer-events: auto; }
        .header-btn:hover { color: #fff; }

        #director-tabs { display: flex; background: #222; padding: 4px; gap: 2px; border-bottom: 1px solid #333; }
        .dir-tab {
            flex: 1; text-align: center; padding: 8px; cursor: pointer;
            background: #333; border: 1px solid #444; color: #FFD700;
            border-radius: 4px; font-weight: bold; text-transform: uppercase;
            transition: 0.1s;
        }
        .dir-tab.active { background: #FFD700; color: #000; border-color: #FFD700; }
        .dir-tab.disabled { opacity: 0.3; pointer-events: none; }
        
        #director-content { max-height: 500px; overflow-y: auto; background: #1a1a1a; min-height: 150px; }

        .profile-header { background: #222; padding: 10px; border-bottom: 1px solid #444; display: flex; align-items: center; gap: 10px; }
        .profile-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid #FFD700; background: #000; object-fit: cover; }
        .profile-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .profile-top-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .profile-name { font-size: 14px; font-weight: bold; color: #FFD700; }
        .profile-sub { font-size: 10px; color: #aaa; margin-top: 2px; }
        .dir-back-btn { background: #333; border: 1px solid #555; color: #ccc; padding: 4px 10px; cursor: pointer; border-radius: 4px; font-size: 10px; text-transform: uppercase; pointer-events: auto; }
        .dir-back-btn:hover { background: #444; color: #fff; border-color: #fff; }

        .prof-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px; }
        .prof-box { background: #222; padding: 8px; border: 1px solid #333; border-radius: 4px; position: relative; }
        .prof-label { font-size: 9px; color: #888; text-transform: uppercase; display: block; margin-bottom: 3px; }
        .prof-val { font-size: 12px; color: #fff; font-weight: bold; }
        .prof-val.gold { color: #FFD700; font-size: 14px; }
        
        .name-cell { color: #fff; font-weight: bold; font-size: 12px; display: flex; align-items: center; cursor: pointer; transition: color 0.2s; pointer-events: auto; }
        .name-cell:hover { color: #FFD700; text-decoration: underline; background-color: #2a2a2a; }
        .dir-table { width: 100%; border-collapse: collapse; }
        .dir-table th { text-align: left; padding: 8px 6px; background: #222; color: #FFD700; position: sticky; top: 0; z-index: 2; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #444; }
        .dir-table td { padding: 8px 6px; border-bottom: 1px solid #333; vertical-align: middle; color: #ccc; }
        .dir-table tr:nth-child(even) { background: #222; }
        
        .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px; flex-shrink: 0; }
        .online-dot { background-color: #4CAF50; box-shadow: 0 0 5px #4CAF50; }
        .idle-dot { background-color: #FFC107; }
        .offline-dot { background-color: #444; border: 1px solid #666; }

        .addict-safe { color: #4CAF50; font-weight: bold; }       
        .addict-warn { color: #FFD700; font-weight: bold; }    
        .addict-danger { color: #FF6F69; font-weight: bold; } 
        .ghost-val { color: #00ffff; font-size: 0.9em; margin-left: 3px; }
        .pill-badge { background: #333; padding: 2px 5px; border-radius: 4px; border: 1px solid #555; font-size: 10px; color: #FFD700; }
        .pill-alert { background: #444; border-color: #FF6F69; color: #FF6F69; }
        .rehab-switz { font-size: 12px; font-weight: bold; }
        .rehab-r { color: #4CAF50; font-weight: 900; font-size: 14px; text-shadow: 0 0 5px rgba(76, 175, 80, 0.4); }
        .dot-ok { display: inline-block; width: 8px; height: 8px; background-color: #4CAF50; border-radius: 50%; margin-right: 5px; }
        .stat-hosp { color: #FF6F69 !important; font-weight: bold; font-size: 14px; } 
        .stat-jail { color: #FFD700; font-size: 14px; } 
        .stat-trav { color: #fff; font-size: 14px; }
        .stat-off { filter: grayscale(100%); opacity: 0.5; }
        .arrow-mirror { display: inline-block; transform: rotate(180deg); }

        .settings-container { padding: 10px; }
        .dir-label { display: block; color: #888; font-size: 10px; font-weight: bold; margin-bottom: 4px; }
        .dir-input { width: 100%; padding: 8px; margin-bottom: 12px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; font-family: monospace; box-sizing: border-box; }
        .time-row { display: flex; gap: 10px; }
        .time-col { flex: 1; }
        .dir-toggle-container { margin-bottom: 15px; display: flex; align-items: center; }
        .dir-toggle-label { color: #E0E0E0; font-size: 11px; margin-left: 8px; cursor: pointer; }
        .dir-toggle-input { cursor: pointer; }
        .dir-save-btn { width: 100%; padding: 10px; background: #333; border: 1px solid #FFD700; color: #FFD700; font-weight: bold; border-radius: 4px; text-transform: uppercase; cursor: pointer; }
        .dir-reset-btn { width: 100%; padding: 8px; margin-top:10px; background: #422; border: 1px solid #FF6F69; color: #FF6F69; border-radius: 4px; cursor: pointer; font-weight:bold; }
        .dir-debug-btn { width: 100%; padding: 8px; margin-top:5px; background: #222; border: 1px solid #666; color: #ccc; border-radius: 4px; cursor: pointer; }
        
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; padding: 10px; border-bottom: 1px solid #333; }
        .stat-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 10px; border-bottom: 1px solid #333; }
        .stat-box { background: #222; padding: 8px; border-radius: 4px; text-align: center; border: 1px solid #333; position: relative; }
        .stat-val { font-size: 14px; font-weight: bold; color: #fff; display: block; }
        .stat-lbl { font-size: 9px; color: #888; text-transform: uppercase; margin-top: 2px; display: block; }
        .stat-sub { font-size: 9px; color: #666; margin-top: 3px; display: block; border-top: 1px solid #333; padding-top:2px; }
        .graph-container { padding: 10px; border-bottom: 1px solid #333; }
        .graph-title { font-size: 10px; color: #FFD700; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; display: flex; justify-content: space-between; }
        .bar-wrapper { display: flex; align-items: center; margin-bottom: 6px; }
        .bar-label { width: 50px; font-size: 10px; color: #aaa; }
        .bar-track { flex: 1; background: #333; height: 12px; border-radius: 2px; overflow: hidden; position: relative; }
        .bar-fill { height: 100%; background: #4CAF50; transition: width 0.5s; }
        .bar-fill.yesterday { background: #555; }
        .bar-value { position: absolute; right: 4px; top: 0; font-size: 11px; font-weight: bold; color: #FFD700; line-height: 12px; text-shadow: 0 0 2px #000; }
        .fin-table { width: 100%; margin-top: 5px; margin-bottom: 15px; font-size: 11px; border-collapse: separate; border-spacing: 0 4px; }
        .fin-table td { padding: 4px; border-bottom: 1px solid #222; }
        .fin-table td:first-child { width: 1%; white-space: nowrap; color: #aaa; padding-right: 15px; } 
        .fin-table td:last-child { font-weight: bold; font-size: 12px; color: #FFD700; text-align: left; }
        .mk-table { width: 100%; font-size: 10px; border-collapse: collapse; margin-top: 10px; }
        .mk-table th { text-align: left; border-bottom: 1px solid #444; color: #FFD700; padding: 4px; }
        .mk-table td { padding: 4px; border-bottom: 1px solid #333; color: #ccc; }
        .mk-summary { background: #222; padding: 10px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #333; }
    `);

    // --- STATE ---
    let currentTab = 'live'; 
    let cacheData = { offline: null, live: null, company: null, marketing: null, director: null };
    let isOfflineDisabled = GM_getValue("disableOffline", false);

    // --- HELPER FUNCTIONS ---
    function parseTornNum(input) {
        if (input === undefined || input === null) return 0;
        if (typeof input === 'number') return input;
        let cleaned = input.toString().replace(/[^0-9.-]+/g, "");
        return parseFloat(cleaned) || 0;
    }
    
    function formatMoney(n) {
        n = parseTornNum(n);
        if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'b'; 
        if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'm'; 
        if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'k'; 
        return '$' + n;
    }
    
    function formatNum(n) { return parseTornNum(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    function getTravelData(statusDesc) {
        let icon = '✈️'; let abbrev = 'TRAV'; let direction = 'out'; 
        let dest = statusDesc.replace('Returning to Torn from ', '').replace('Returning from ', '').replace('Traveling to ', '').replace('In ', '').trim();
        const countries = { 'Switzerland': 'SWI', 'Cayman Islands': 'CAY', 'South Africa': 'SA', 'Mexico': 'MEX', 'United Kingdom': 'UK', 'Argentina': 'ARG', 'Canada': 'CAN', 'China': 'CHN', 'Japan': 'JPN', 'UAE': 'UAE', 'Hawaii': 'HAW' };
        abbrev = countries[dest] || dest.substring(0, 3).toUpperCase();
        if (statusDesc.includes('Traveling to')) { icon = '➡'; direction = 'out'; } 
        else if (statusDesc.includes('Returning')) { icon = '➡'; direction = 'in'; } 
        else if (statusDesc.includes('In ')) { icon = '📍'; direction = 'stay'; }
        return { icon, abbrev, direction };
    }
    function getLastRehabResetTime() {
        const now = new Date(); const reset = new Date();
        if (now.getUTCHours() < 18) { reset.setUTCDate(now.getUTCDate() - 1); }
        reset.setUTCHours(18, 0, 0, 0); return reset.getTime() / 1000;
    }
    function getMarketingCycleDate() {
        const now = new Date();
        const resetHour = parseInt(GM_getValue("reset_local_hour", "13"));
        const resetMin = parseInt(GM_getValue("reset_local_min", "0"));
        const currentTotalMins = (now.getHours() * 60) + now.getMinutes();
        const resetTotalMins = (resetHour * 60) + resetMin;
        if (currentTotalMins < resetTotalMins) { now.setDate(now.getDate() - 1); }
        return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    function updateBankHistory(currentBank) {
        const dateKey = getMarketingCycleDate();
        const storedDate = GM_getValue("last_seen_torn_date", "");
        const storedRunning = GM_getValue("current_day_last_bank", 0);
        let yesterdayBank = GM_getValue("yesterday_bank_val", 0);
        if (storedDate !== dateKey) {
            if (storedDate !== "") { yesterdayBank = storedRunning; GM_setValue("yesterday_bank_val", yesterdayBank); }
            GM_setValue("last_seen_torn_date", dateKey);
        }
        GM_setValue("current_day_last_bank", currentBank);
        return yesterdayBank;
    }
    function updateMarketingHistory(adBudget, customers) {
        const dateKey = getMarketingCycleDate();
        let history = GM_getValue("marketing_history", []);
        const existingIndex = history.findIndex(entry => entry.date === dateKey);
        if (existingIndex !== -1) {
            if (customers >= history[existingIndex].customers) {
                history[existingIndex].customers = customers; history[existingIndex].budget = adBudget;
                history[existingIndex].cpc = customers > 0 ? Math.round(adBudget / customers) : 0;
            }
        } else {
            const cpc = customers > 0 ? Math.round(adBudget / customers) : 0;
            history.push({ date: dateKey, budget: adBudget, customers: customers, cpc: cpc });
        }
        if (history.length > 7) history.shift();
        GM_setValue("marketing_history", history);
        return history.slice().reverse();
    }

    // --- UI BUILDER ---
    function createPanel() {
        if (document.getElementById('director-panel')) return;
        const div = document.createElement('div');
        div.id = 'director-panel';
        div.classList.add('minimized');
        isOfflineDisabled = GM_getValue("disableOffline", false);
        const offlineClass = isOfflineDisabled ? 'disabled' : '';

        div.innerHTML = `
            <div id="director-header">
                <span>♠️ Director Pro v14.2</span>
                <div>
                    <span class="header-btn" data-action="setup" title="Setup">⚙️</span>
                    <span class="header-btn" data-action="refresh" title="Refresh">↻</span>
                    <span class="header-btn" data-action="minimize" title="Minimize">[-]</span>
                </div>
            </div>
            <div id="director-tabs">
                <div class="dir-tab ${offlineClass}" data-tab="offline" id="tab-offline">Offline</div>
                <div class="dir-tab active" data-tab="live" id="tab-live">Live</div>
                <div class="dir-tab" data-tab="director" id="tab-director">Director</div>
                <div class="dir-tab" data-tab="stats" id="tab-stats">Stats</div>
                <div class="dir-tab" data-tab="marketing" id="tab-marketing">Mktg</div>
            </div>
            <div id="director-content"><div style="padding:20px; text-align:center; color:#888;">Initializing...</div></div>
        `;
        document.body.appendChild(div);

        div.addEventListener('click', function(e) { 
            if (div.classList.contains('minimized')) { toggleMinimize(); return; }
            
            const action = e.target.dataset.action;
            if (action === 'minimize') { e.stopPropagation(); toggleMinimize(); return; }
            if (action === 'refresh') { loadData(); return; }
            if (action === 'setup') { switchTab('setup'); return; }

            const tabTarget = e.target.closest('.dir-tab');
            if (tabTarget) {
                const tab = tabTarget.dataset.tab;
                if (tab === 'offline' && GM_getValue("disableOffline", false)) return;
                switchTab(tab);
                return;
            }

            const nameTarget = e.target.closest('.name-cell');
            if (nameTarget) {
                const pid = nameTarget.dataset.id;
                const pname = nameTarget.dataset.name;
                if(pid && pname) openPlayerProfile(pid, pname);
                return;
            }

            if (e.target.classList.contains('dir-back-btn')) { goBack(); return; }
            if (e.target.id === 'dir-save-btn') { saveSettings(); return; }
            if (e.target.id === 'dir-reset-btn') { resetData(); return; }
            if (e.target.id === 'dir-test-btn') { runDebug(); return; }
        });

        makeDraggable(document.getElementById('director-header'), div);

        const savedUrl = GM_getValue("googleScriptUrl", "");
        const savedKey = GM_getValue("tornApiKey", "");
        let startTab = isOfflineDisabled ? 'live' : 'offline';
        if (savedUrl || savedKey) { switchTab(startTab); if (!cacheData.live) loadData(); } else { switchTab('setup'); }
    }

    function switchTab(tab) {
        if (tab === 'offline' && GM_getValue("disableOffline", false)) return;
        currentTab = tab;
        document.querySelectorAll('.dir-tab').forEach(el => el.classList.remove('active'));
        const tabId = `tab-${tab}`;
        const tabEl = document.getElementById(tabId);
        if(tabEl) tabEl.classList.add('active');

        if (tab === 'setup') renderSetup();
        else if (tab === 'offline') { if (cacheData.offline) renderOffline(cacheData.offline); else loadData(); } 
        else if (tab === 'live') { if (cacheData.live) renderLive(cacheData.live); else loadData(); }
        else if (tab === 'director') { if (cacheData.director) renderDirector(cacheData.director); else loadDirector(); }
        else if (tab === 'stats') { if (cacheData.company) renderStats(cacheData.company); else loadData(); }
        else if (tab === 'marketing') { if (cacheData.marketing) renderMarketing(cacheData.marketing); else loadData(); }
    }

    function toggleMinimize() { document.getElementById('director-panel').classList.toggle('minimized'); }

    function makeDraggable(header, element) {
        let isDragging = false, startX, startY, initialLeft, initialTop;
        const startDrag = (e) => {
            if (e.target.classList.contains('header-btn') || element.classList.contains('minimized')) return;
            isDragging = true;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            const rect = element.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', onDrag, { passive: false }); document.addEventListener('touchend', stopDrag);
        };
        const onDrag = (e) => {
            if (!isDragging) return;
            if (e.type === 'touchmove') e.preventDefault();
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            let newLeft = initialLeft + (clientX - startX);
            let newTop = initialTop + (clientY - startY);
            element.style.left = `${Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth))}px`;
            element.style.top = `${Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight))}px`;
        };
        const stopDrag = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDrag); document.removeEventListener('touchend', stopDrag);
        };
        header.addEventListener('mousedown', startDrag); header.addEventListener('touchstart', startDrag);
    }

    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try { resolve(JSON.parse(response.responseText)); } catch (e) { reject("Invalid JSON"); }
                    } else { reject("Error " + response.status); }
                },
                onerror: () => reject("Connection Failed")
            });
        });
    }

    async function loadData() {
        const sheetUrl = GM_getValue("googleScriptUrl", "");
        const apiKey = GM_getValue("tornApiKey", "");
        const disableOffline = GM_getValue("disableOffline", false);
        const contentDiv = document.getElementById('director-content');
        
        if (!apiKey) { switchTab('setup'); return; }
        if (currentTab !== 'setup' && currentTab !== 'director') contentDiv.innerHTML = '<div style="padding:20px; text-align:center;">📡 Syncing...</div>';

        try {
            const promises = [];
            const apiRequestUrl = `https://api.torn.com/company/?selections=profile,detailed,employees,stock&key=${apiKey}`;
            promises.push(gmFetch(apiRequestUrl));
            if (!disableOffline && sheetUrl) { promises.push(gmFetch(sheetUrl)); }

            const results = await Promise.all(promises);
            const apiData = results[0];
            const sheetData = (results.length > 1) ? results[1] : [];

            if (apiData.error) throw new Error("Torn API Error: " + apiData.error.error);

            const liveMap = {};
            let totalDailyWages = 0;
            if(apiData.company_employees) {
                Object.entries(apiData.company_employees).forEach(([id, emp]) => { 
                    emp.id = id; 
                    liveMap[emp.name] = emp; 
                    totalDailyWages += parseTornNum(emp.wage);
                });
            }

            if (sheetData.length > 0) {
                const mergedList = sheetData.map(sheetEmp => {
                    const liveEmp = liveMap[sheetEmp.name];
                    return liveEmp ? { 
                        ...sheetEmp, id: liveEmp.id, status: liveEmp.status.description, 
                        state: liveEmp.status.state, last_action: liveEmp.last_action.relative 
                    } : sheetEmp;
                });
                cacheData.offline = mergedList;
            } else { cacheData.offline = []; }

            const comp = apiData.company || {};
            const detailed = apiData.company_detailed || {}; 
            const dailyInc = detailed.daily_income !== undefined ? detailed.daily_income : comp.daily_income;
            const dailyCust = detailed.daily_customers !== undefined ? detailed.daily_customers : comp.daily_customers;
            const weeklyInc = detailed.weekly_income !== undefined ? detailed.weekly_income : comp.weekly_income;
            const weeklyCust = detailed.weekly_customers !== undefined ? detailed.weekly_customers : comp.weekly_customers;
            const bankVal = detailed.company_bank || detailed.company_funds || comp.daily_balance || 0;
            const trainsVal = detailed.trains_available || comp.trains_available || 0;
            const adBudget = parseTornNum(detailed.advertising_budget);
            
            let totalStockValue = 0;
            if (apiData.company_stock) {
                 Object.values(apiData.company_stock).forEach(item => {
                     totalStockValue += (parseTornNum(item.price) * parseTornNum(item.in_stock));
                 });
            }
            const runwayDays = dailyInc > 0 ? (totalStockValue / dailyInc).toFixed(1) : "0";
            const cashflow = dailyInc - totalDailyWages - adBudget;

            const yesterdayBank = updateBankHistory(parseTornNum(bankVal));
            const marketingHistory = updateMarketingHistory(adBudget, dailyCust);

            const companyStats = {
                trains: parseTornNum(trainsVal),
                employees: parseTornNum(comp.employees_number) || Object.keys(liveMap).length,
                capacity: parseTornNum(comp.employees_capacity),
                bank: parseTornNum(bankVal),
                prev_bank: yesterdayBank,
                daily_income: parseTornNum(dailyInc),
                daily_customers: parseTornNum(dailyCust),
                weekly_income: parseTornNum(weeklyInc),
                weekly_customers: parseTornNum(weeklyCust),
                runway: runwayDays,
                cashflow: cashflow,
                ad_budget: adBudget,
                cpc: dailyCust > 0 ? Math.round(adBudget / dailyCust) : 0
            };

            cacheData.live = apiData.company_employees ? Object.values(apiData.company_employees) : [];
            cacheData.company = companyStats;
            cacheData.marketing = marketingHistory;

            if (currentTab === 'offline') { if (disableOffline) switchTab('live'); else renderOffline(cacheData.offline); }
            else if (currentTab === 'live') renderLive(cacheData.live);
            else if (currentTab === 'stats') renderStats(cacheData.company);
            else if (currentTab === 'marketing') renderMarketing(cacheData.marketing);

        } catch (e) {
            contentDiv.innerHTML = `<div style="padding:15px; color:#FF6F69; text-align:center;">❌ Error:<br>${e}</div>`;
        }
    }

    async function loadDirector() {
        const apiKey = GM_getValue("tornApiKey", "");
        const contentDiv = document.getElementById('director-content');
        if (!apiKey) { switchTab('setup'); return; }
        
        contentDiv.innerHTML = '<div style="padding:20px; text-align:center;">📡 Fetching Director Info...</div>';
        
        try {
            const apiRequestUrl = `https://api.torn.com/user/?selections=profile,personalstats,networth,log&key=${apiKey}`;
            const apiData = await gmFetch(apiRequestUrl);
            
            if (apiData.error) throw new Error(apiData.error.error);
            
            cacheData.director = apiData;
            renderDirector(cacheData.director);
            
        } catch (e) {
            contentDiv.innerHTML = `<div style="padding:15px; color:#FF6F69; text-align:center;">❌ Error:<br>${e}</div>`;
        }
    }

    function renderDirector(data) {
        const p = data.personalstats || {};
        let avatarUrl = data.profile_image;
        if (!avatarUrl || avatarUrl.length < 5) avatarUrl = 'https://www.torn.com/images/profile_man.jpg';
        
        // FIXED raceswon key
        const racingSkill = p.racingskill || 0;
        const racesWon = p.raceswon || 0;
        const racesEnt = p.racesentered || 0;
        const racingPoints = p.racingpointsearned || 0;
        
        const networth = data.networth ? formatMoney(data.networth.total) : "N/A";

        const html = `
            <div>
                <div class="profile-header">
                    <img src="${avatarUrl}" class="profile-avatar">
                    <div class="profile-info">
                        <div class="profile-top-row">
                            <span class="profile-name">${data.name} [${data.player_id}]</span>
                        </div>
                        <span class="profile-sub">${data.rank} • Lvl ${data.level}</span>
                    </div>
                </div>
                
                <div class="prof-grid">
                    <div class="prof-box" style="border-color:#FFD700;">
                        <span class="prof-label" style="color:#FFD700;">💰 Networth</span>
                        <span class="prof-val gold">${networth}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">🏁 Racing Skill</span>
                        <span class="prof-val">${formatNum(racingSkill)}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">🏆 Races Won</span>
                        <span class="prof-val">${formatNum(racesWon)}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">🏎 Races Entered</span>
                        <span class="prof-val">${formatNum(racesEnt)}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">⭐ Racing Points</span>
                        <span class="prof-val">${formatNum(racingPoints)}</span>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('director-content').innerHTML = html;
    }

    function openPlayerProfile(id, name) {
        if (!id) { alert("ID not found for this user."); return; }
        const apiKey = GM_getValue("tornApiKey", "");
        const contentDiv = document.getElementById('director-content');
        contentDiv.innerHTML = '<div style="padding:20px; text-align:center; color:#FFD700;">Fetching Profile...</div>';
        
        GM_xmlhttpRequest({
            method: "GET", 
            url: `https://api.torn.com/user/${id}?selections=profile,personalstats&key=${apiKey}`,
            onload: (response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) throw new Error(data.error.error);
                    renderPlayerDetail(data, name, id);
                } catch (e) {
                    contentDiv.innerHTML = `<div style="padding:15px; color:#FF6F69;">Error: ${e}</div><div style="text-align:center;"><button class="dir-back-btn">Back</button></div>`;
                }
            }
        });
    }
    
    function goBack() {
        const disableOffline = GM_getValue("disableOffline", false);
        if (currentTab === 'offline' && !disableOffline) renderOffline(cacheData.offline);
        else if (currentTab === 'live') renderLive(cacheData.live);
        else { renderLive(cacheData.live); switchTab('live'); }
    }

    function renderPlayerDetail(data, name, id) {
        const p = data.personalstats || {};
        const prof = data.profile || {};
        
        let avatarUrl = prof.image || 'https://www.torn.com/images/profile_man.jpg';
        const userName = data.name || name;
        const level = data.level || "N/A";
        const status = data.status ? data.status.description : "Unknown";
        const role = data.job ? data.job.position : "Employee";
        
        // Match Director Layout stats
        const racingSkill = p.racingskill || 0;
        const racesWon = p.raceswon || 0;
        const racesEnt = p.racesentered || 0;
        const racingPoints = p.racingpointsearned || 0;
        
        function displayStat(val) {
             return (val === undefined || val === null) ? `<span style="color:#666;">--</span>` : formatNum(val);
        }

        let networth = data.networth ? formatMoney(data.networth) : (p.networth ? formatMoney(p.networth) : `<span style="color:#666;">--</span>`);

        const html = `
            <div>
                <div class="profile-header">
                    <img src="${avatarUrl}" class="profile-avatar">
                    <div class="profile-info">
                        <div class="profile-top-row">
                            <span class="profile-name">${userName} [${id}]</span>
                            <button class="dir-back-btn">Back</button>
                        </div>
                        <span class="profile-sub">${role} • Lvl ${level}</span>
                        <div style="font-size:10px; color:#ccc; margin-top:2px;">${status}</div>
                    </div>
                </div>
                
                <div class="prof-grid">
                    <div class="prof-box" style="border-color:#FFD700;">
                        <span class="prof-label" style="color:#FFD700;">💰 Networth</span>
                        <span class="prof-val gold">${networth}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">🏁 Racing Skill</span>
                        <span class="prof-val">${displayStat(racingSkill)}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">🏆 Races Won</span>
                        <span class="prof-val">${displayStat(racesWon)}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">🏎 Races Entered</span>
                        <span class="prof-val">${displayStat(racesEnt)}</span>
                    </div>
                    <div class="prof-box">
                        <span class="prof-label">⭐ Racing Points</span>
                        <span class="prof-val">${displayStat(racingPoints)}</span>
                    </div>
                </div>
                <div style="padding:10px; text-align:center;">
                    <a href="https://www.torn.com/profiles.php?XID=${id}" target="_blank" style="color:#aaa; font-size:10px; text-decoration:underline;">Open Official Profile ↗</a>
                </div>
            </div>
        `;
        document.getElementById('director-content').innerHTML = html;
    }

    function renderStats(data) {
        const avgDailyIncome = data.weekly_income > 0 ? Math.round(data.weekly_income / 7) : 0;
        const avgDailyCust = data.weekly_customers > 0 ? Math.round(data.weekly_customers / 7) : 0;
        const maxInc = Math.max(data.daily_income, avgDailyIncome);
        const pctIncToday = maxInc > 0 ? (data.daily_income / maxInc) * 100 : 0;
        const pctIncAvg = maxInc > 0 ? (avgDailyIncome / maxInc) * 100 : 0;
        const maxCust = Math.max(data.daily_customers, avgDailyCust);
        const pctCustToday = maxCust > 0 ? (data.daily_customers / maxCust) * 100 : 0;
        const pctCustAvg = maxCust > 0 ? (avgDailyCust / maxCust) * 100 : 0;
        const prevBankDisplay = data.prev_bank > 0 ? formatMoney(data.prev_bank) : "--";
        const cfColor = data.cashflow >= 0 ? '#4CAF50' : '#FF6F69';
        const rwColor = data.runway < 2 ? '#FF6F69' : (data.runway < 4 ? '#FFD700' : '#4CAF50');

        const html = `
            <div class="stat-grid">
                <div class="stat-box"><span class="stat-val" style="color:#4CAF50;">${data.trains}</span><span class="stat-lbl">Trains</span></div>
                <div class="stat-box"><span class="stat-val">${formatMoney(data.bank)}</span><span class="stat-lbl">Bank</span><span class="stat-sub">Prev: ${prevBankDisplay}</span></div>
                <div class="stat-box"><span class="stat-val">${data.employees} / ${data.capacity}</span><span class="stat-lbl">Staff</span></div>
            </div>
            <div class="stat-grid-2">
                 <div class="stat-box" style="border-color:${rwColor}"><span class="stat-val" style="color:${rwColor}">${data.runway} Days</span><span class="stat-lbl">Stock Runway</span></div>
                 <div class="stat-box" style="border-color:${cfColor}"><span class="stat-val" style="color:${cfColor}">${formatMoney(data.cashflow)}</span><span class="stat-lbl">Est. Cashflow</span></div>
            </div>
            <div class="graph-container">
                <div class="graph-title">Income (Today vs Avg)</div>
                <div class="bar-wrapper"><span class="bar-label">Today</span><div class="bar-track"><div class="bar-fill" style="width:${pctIncToday}%"></div><span class="bar-value">${formatMoney(data.daily_income)}</span></div></div>
                <div class="bar-wrapper"><span class="bar-label">Avg</span><div class="bar-track"><div class="bar-fill yesterday" style="width:${pctIncAvg}%"></div><span class="bar-value">${formatMoney(avgDailyIncome)}</span></div></div>
            </div>
            <div class="graph-container">
                <div class="graph-title">Customers (Today vs Avg)</div>
                <div class="bar-wrapper"><span class="bar-label">Today</span><div class="bar-track"><div class="bar-fill" style="width:${pctCustToday}%"></div><span class="bar-value">${formatNum(data.daily_customers)}</span></div></div>
                <div class="bar-wrapper"><span class="bar-label">Avg</span><div class="bar-track"><div class="bar-fill yesterday" style="width:${pctCustAvg}%"></div><span class="bar-value">${formatNum(avgDailyCust)}</span></div></div>
            </div>
            <table class="fin-table"><tr><td>Weekly Income</td><td>${formatMoney(data.weekly_income)}</td></tr><tr><td>Weekly Customers</td><td>${formatNum(data.weekly_customers)}</td></tr></table>
        `;
        document.getElementById('director-content').innerHTML = html;
    }

    function renderMarketing(history) {
        if (!history || history.length === 0) { document.getElementById('director-content').innerHTML = '<div style="padding:20px; text-align:center;">No history yet.</div>'; return; }
        const latest = history[0];
        let html = `<div style="padding:10px;"><div class="mk-summary"><div style="font-size:10px; color:#888;">TODAY'S CPC</div><div style="font-size:18px; font-weight:bold; color:#FFD700;">$${latest.cpc}</div><div style="font-size:10px; color:#666;">Budget: ${formatMoney(latest.budget)}</div></div><table class="mk-table"><thead><tr><th>Date</th><th>Budget</th><th>Cust</th><th>CPC</th></tr></thead><tbody>`;
        history.forEach(day => { html += `<tr><td>${day.date}</td><td>${formatMoney(day.budget)}</td><td>${formatNum(day.customers)}</td><td style="font-weight:bold;">$${day.cpc}</td></tr>`; });
        html += `</tbody></table></div>`;
        document.getElementById('director-content').innerHTML = html;
    }

    function renderOffline(data) {
        if (!data || data.length === 0) { document.getElementById('director-content').innerHTML = '<div style="padding:20px;text-align:center;">No Offline Data Found.</div>'; return; }
        data.sort((a, b) => (a.est_addiction || 0) - (b.est_addiction || 0));
        const lastReset = getLastRehabResetTime(); 
        let html = `<table class="dir-table"><thead><tr><th>Name</th><th style="text-align:center;">Rehab</th><th>Addict</th><th style="text-align:center;">💊</th></tr></thead><tbody>`;
        data.forEach(emp => {
            let rehabHtml = '';
            const status = (emp.status || "").toLowerCase();
            if (status.includes('switzerland')) {
                 const tInfo = getTravelData(emp.status);
                 let iconDisplay = tInfo.icon;
                 if (tInfo.direction === 'in') iconDisplay = `<span class="arrow-mirror">${tInfo.icon}</span>`;
                 rehabHtml = `<span class="rehab-switz">${iconDisplay} 🇨🇭</span>`;
            } else if (emp.last_rehab > lastReset) { rehabHtml = `<span class="rehab-r">R</span>`; }
            let colorClass = emp.est_addiction <= -10 ? 'addict-danger' : (emp.est_addiction <= -5 ? 'addict-warn' : 'addict-safe');
            let displayAddict = `<span class="${colorClass}">${emp.addiction || 0}</span>`;
            if (Math.round(emp.est_addiction) !== (emp.addiction || 0)) displayAddict += `<span class="ghost-val">(${Math.round(emp.est_addiction)})</span>`;
            let pillClass = emp.drugs_today > 0 ? 'pill-badge pill-alert' : 'pill-badge';
            
            html += `<tr><td class="name-cell" data-id="${emp.id}" data-name="${emp.name}">${emp.name.substring(0, 10)}</td><td style="text-align:center;">${rehabHtml}</td><td>${displayAddict}</td><td style="text-align:center;"><span class="${pillClass}">${emp.drugs_today || 0}</span></td></tr>`;
        });
        html += `</tbody></table>`;
        document.getElementById('director-content').innerHTML = html;
    }

    function renderLive(data) {
        const priority = { 'Hospital': 1, 'Jail': 2, 'Traveling': 3, 'Okay': 4 };
        data.sort((a, b) => (priority[a.status.state] || 5) - (priority[b.status.state] || 5));
        let html = `<table class="dir-table"><thead><tr><th>Name</th><th>Status</th><th>Time</th></tr></thead><tbody>`;
        data.forEach(emp => {
            let iconHtml = '<span class="dot-ok"></span>'; let displayStatus = ''; let state = emp.status.state;
            if (state === 'Hospital') { iconHtml = '<span class="stat-hosp">✚</span>'; }
            else if (state === 'Jail') { iconHtml = '<span class="stat-jail">🚔</span>'; displayStatus = 'Jail'; }
            else if (state === 'Traveling') { 
                const tInfo = getTravelData(emp.status.description);
                let tIcon = tInfo.icon; if (tInfo.direction === 'in') tIcon = `<span class="arrow-mirror">${tIcon}</span>`;
                iconHtml = `<span class="stat-trav">${tIcon}</span>`; displayStatus = tInfo.abbrev; 
            }
            else if (emp.last_action.relative.includes('days')) { iconHtml = '<span class="stat-off">💤</span>'; displayStatus = 'Idle'; }
            let dotClass = 'offline-dot';
            if (emp.last_action.status === 'Online') dotClass = 'online-dot';
            else if (emp.last_action.status === 'Idle') dotClass = 'idle-dot';
            
            html += `<tr><td class="name-cell" data-id="${emp.id}" data-name="${emp.name}"><span class="status-dot ${dotClass}"></span>${emp.name.substring(0, 12)}</td><td title="${emp.status.description}">${iconHtml}<span style="color:#aaa; font-size:11px;">${displayStatus}</span></td><td style="color:#888; font-size:11px;">${emp.last_action.relative}</td></tr>`;
        });
        html += `</tbody></table>`;
        document.getElementById('director-content').innerHTML = html;
    }

    function renderSetup() {
        const url = GM_getValue("googleScriptUrl", "");
        const key = GM_getValue("tornApiKey", "");
        const resetHour = GM_getValue("reset_local_hour", "13");
        const resetMin = GM_getValue("reset_local_min", "0");
        const disableOffline = GM_getValue("disableOffline", false);
        const checked = disableOffline ? 'checked' : '';
        
        const html = `
            <div class="settings-container">
                <span class="dir-label">Google Web App URL</span><input type="text" id="dir-url-input" class="dir-input" value="${url}" placeholder="Paste Script URL...">
                <span class="dir-label">Torn API Key</span><input type="text" id="dir-key-input" class="dir-input" value="${key}" placeholder="Paste API Key...">
                <div class="dir-toggle-container"><input type="checkbox" id="dir-disable-offline" class="dir-toggle-input" ${checked}><label for="dir-disable-offline" class="dir-toggle-label">Disable Offline Panel</label></div>
                <span class="dir-label">Reset Local Time (24h)</span><div class="time-row"><div class="time-col"><span class="dir-label" style="font-size:9px;">Hour (0-23)</span><input type="number" id="dir-hour-input" class="dir-input" value="${resetHour}" min="0" max="23"></div><div class="time-col"><span class="dir-label" style="font-size:9px;">Minute (0-59)</span><input type="number" id="dir-min-input" class="dir-input" value="${resetMin}" min="0" max="59"></div></div>
                <button id="dir-save-btn" class="dir-save-btn">Save Configuration</button><button id="dir-reset-btn" class="dir-reset-btn">⚠ Reset History</button><button id="dir-test-btn" class="dir-debug-btn">🛠 Test API (Debug)</button>
            </div>`;
        document.getElementById('director-content').innerHTML = html;
    }

    function saveSettings() {
        const url = document.getElementById('dir-url-input').value.trim();
        const key = document.getElementById('dir-key-input').value.trim();
        const hr = document.getElementById('dir-hour-input').value.trim();
        const min = document.getElementById('dir-min-input').value.trim();
        const disableOffline = document.getElementById('dir-disable-offline').checked;
        if (key) { 
            GM_setValue("googleScriptUrl", url); GM_setValue("tornApiKey", key); 
            GM_setValue("reset_local_hour", hr); GM_setValue("reset_local_min", min);
            GM_setValue("disableOffline", disableOffline);
            isOfflineDisabled = disableOffline;
            if (disableOffline) { document.getElementById('tab-offline').classList.add('disabled'); switchTab('live'); } 
            else { document.getElementById('tab-offline').classList.remove('disabled'); switchTab('offline'); }
            alert("Settings Saved!");
        } else { alert("API Key is required."); }
    }

    function resetData() { if (confirm("⚠ ARE YOU SURE?")) { GM_deleteValue("marketing_history"); GM_deleteValue("yesterday_bank_val"); GM_deleteValue("last_seen_torn_date"); GM_deleteValue("current_day_last_bank"); alert("History reset."); location.reload(); } }
    
    function runDebug() {
        const k = GM_getValue("tornApiKey", "");
        if(!k) return alert("Save Key.");
        const btn = document.getElementById('dir-test-btn');
        btn.innerHTML = "Fetching...";
        GM_xmlhttpRequest({
            method: "GET", url: `https://api.torn.com/user/?selections=profile,personalstats,log,networth&key=${k}`,
            onload: (r) => {
                btn.innerHTML = "🛠 Test API (Debug)";
                try {
                    const json = JSON.parse(r.responseText);
                    console.log("🔥 FULL DEBUG DATA 🔥", json);
                    let msg = "✅ DATA LOGGED TO CONSOLE (F12)\n\n";
                    msg += "--- RACING CANDIDATES ---\n";
                    if (json.personalstats) {
                        const raceKeys = Object.keys(json.personalstats).filter(k => k.includes('race') || k.includes('racing') || k.includes('won'));
                        raceKeys.forEach(key => { msg += `${key}: ${json.personalstats[key]}\n`; });
                    }
                    alert(msg);
                } catch (e) { alert("Error: " + e); }
            },
            onerror: () => alert("Connection Failed")
        });
    }

    createPanel();
})();