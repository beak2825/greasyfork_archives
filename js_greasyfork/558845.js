// ==UserScript==
// @name         Torn Bookie Tracker V4.1
// @namespace    http://tampermonkey.net/
// @version      4.1 (Sticky Pagination & Compact UI)
// @description  Compact multi-tab UI with fixed bottom pagination and toggleable percentages.
// @author       M7TEM
// @match        https://www.torn.com/page.php?sid=bookie*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558845/Torn%20Bookie%20Tracker%20V41.user.js
// @updateURL https://update.greasyfork.org/scripts/558845/Torn%20Bookie%20Tracker%20V41.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOG_IDS = { PLACE: 8460, LOSE: 8461, WIN: 8462, REFUND: 8463 };

    let state = {
        apiKey: GM_getValue('apiKey', ''),
        capital: GM_getValue('capital', 1000000000),
        showPerc: GM_getValue('showPerc', true),
        logs: GM_getValue('bookieLogs', []),
        pendingLogs: GM_getValue('pendingLogs', []),
        lastSync: GM_getValue('lastSync', 0),
        isMinimized: GM_getValue('isMinimized', false),
        activeTab: 'stats',
        isSyncing: false,
        fullSyncMode: false,
        currentPage: 0,
        pos: GM_getValue('panelPos', { top: 100, left: 50 })
    };

    GM_addStyle(`
        #m7tem-bookie-panel {
            position: fixed; width: 380px; max-height: 420px;
            background: #1a1f26 !important; color: #e0e0e0 !important;
            border: 1px solid #3d4450; border-radius: 10px; z-index: 999999;
            box-shadow: 0 8px 24px rgba(0,0,0,0.7); font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 11px; display: flex; flex-direction: column; overflow: hidden;
            touch-action: none;
        }
        #m7tem-bookie-panel.m7tem-minimized { height: 34px; width: 180px; }
        
        #m7tem-header {
            padding: 10px; background: #0f1217 !important; cursor: move;
            border-bottom: 1px solid #3d4450; font-weight: bold;
            display: flex; justify-content: space-between; align-items: center;
            color: #2ecc71; text-transform: uppercase; letter-spacing: 1px;
        }
        
        #m7tem-nav { display: flex; background: #13171c; border-bottom: 1px solid #3d4450; }
        .m7tem-nav-btn {
            flex: 1; padding: 10px; border: none; background: transparent; color: #888;
            cursor: pointer; font-size: 10px; font-weight: bold; text-transform: uppercase;
            transition: all 0.2s;
        }
        .m7tem-nav-btn.active { color: #fff; background: #1a1f26; border-bottom: 2px solid #2ecc71; }
        .m7tem-nav-btn:hover:not(.active) { color: #ccc; background: #1a1f26; }

        #m7tem-body { padding: 8px; overflow: hidden; flex: 1; display: flex; flex-direction: column; }
        
        .m7tem-section { display: none; flex-direction: column; height: 100%; overflow: hidden; }
        .m7tem-section.active { display: flex; }

        #m7tem-lifetime-stats {
            background: #0f1217; padding: 8px 12px; border-radius: 6px;
            margin-bottom: 8px; border: 1px solid #3d4450;
            display: flex; justify-content: space-between; font-weight: bold; font-size: 13px;
        }

        #m7tem-table-wrapper { 
            flex: 1; overflow-y: auto; border: 1px solid #3d4450; 
            background: #13171c; margin-bottom: 4px; border-radius: 4px; 
        }
        #m7tem-table { width: 100%; border-collapse: collapse; color: #d1d1d1 !important; }
        #m7tem-table th { 
            background: #242b35; position: sticky; top: 0; z-index: 5; 
            font-weight: bold; padding: 6px; border-bottom: 2px solid #3d4450;
        }
        #m7tem-table td { border-bottom: 1px solid #242b35; padding: 6px; text-align: center; }
        
        /* White text for Bet and Odds columns */
        #m7tem-table td:nth-child(1), 
        #m7tem-table td:nth-child(2) { color: #ffffff !important; }

        #m7tem-table tr:hover { background: #1a1f26; }

        .m7tem-day-header { 
            background: #0f1217; color: #2ecc71; text-align: left !important; 
            font-size: 10px; padding: 6px 10px !important; border-bottom: 1px solid #3d4450 !important;
        }
        
        #m7tem-pagination { 
            display: flex; justify-content: space-between; align-items: center; 
            padding: 8px; background: #0f1217; border-top: 1px solid #3d4450;
            margin: 0 -8px -8px -8px; 
        }

        .m7tem-btn {
            background: linear-gradient(180deg, #2ecc71 0%, #27ae60 100%); 
            border: none; color: white; padding: 6px;
            cursor: pointer; border-radius: 4px; flex: 1; font-size: 10px; font-weight: bold;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3); transition: filter 0.2s;
        }
        .m7tem-btn:hover { filter: brightness(1.1); }
        .m7tem-btn:active { transform: translateY(1px); }
        .m7tem-btn:disabled { background: #444; cursor: default; filter: grayscale(1); }

        .m7tem-input {
            padding: 6px; border-radius: 4px; border: 1px solid #3d4450;
            background: #13171c; color: #fff; flex: 1; box-sizing: border-box;
        }
        .m7tem-perc { font-size: 9px; opacity: 0.6; margin-left: 2px; }
        .m7tem-win { color: #2ecc71 !important; font-weight: bold; }
        .m7tem-loss { color: #e74c3c !important; font-weight: bold; }
        .m7tem-profit-pos { color: #2ecc71 !important; }
        .m7tem-profit-neg { color: #e74c3c !important; }
    `);

    function formatMoney(n) { return '$' + Math.floor(n).toLocaleString(); }
    function getPerc(val) { 
        if (!state.showPerc || !state.capital || state.capital <= 0) return "";
        let p = (val / state.capital) * 100;
        return ` (${p.toFixed(p < 1 ? 2 : 1)}%)`;
    }

    function createUI() {
        if (document.getElementById('m7tem-bookie-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'm7tem-bookie-panel';
        panel.style.top = state.pos.top + 'px';
        panel.style.left = state.pos.left + 'px';
        if (state.isMinimized) panel.classList.add('m7tem-minimized');

        panel.innerHTML = `
            <div id="m7tem-header">
                <span>Bookies Tracker</span>
                <button id="m7tem-min-btn" style="background:none; border:1px solid #3d4450; color:white; cursor:pointer; padding: 0 6px; border-radius:3px;">${state.isMinimized ? '+' : '-'}</button>
            </div>
            <div id="m7tem-nav">
                <button class="m7tem-nav-btn active" data-tab="stats">Stats</button>
                <button class="m7tem-nav-btn" data-tab="settings">Settings</button>
            </div>
            <div id="m7tem-body">
                <div id="m7tem-tab-stats" class="m7tem-section active">
                    <div id="m7tem-lifetime-stats">
                        <span style="color:#888">LIFETIME</span>
                        <span id="m7tem-lifetime-val">$--</span>
                    </div>
                    <div id="m7tem-table-wrapper">
                        <table id="m7tem-table">
                            <thead><tr><th>Bet</th><th>Odds</th><th>Res</th><th>Profit</th></tr></thead>
                            <tbody id="m7tem-table-body"></tbody>
                        </table>
                    </div>
                    <div id="m7tem-pagination"></div>
                </div>

                <div id="m7tem-tab-settings" class="m7tem-section" style="overflow-y:auto; padding-top:4px;">
                    <div style="display:flex; flex-direction:column; gap:8px; padding-bottom:10px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:10px; width:70px; color:#aaa;">API Key:</span>
                            <input type="password" id="m7tem-api-input" class="m7tem-input" value="${state.apiKey}">
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:10px; width:70px; color:#aaa;">Capital:</span>
                            <input type="text" id="m7tem-cap-input" class="m7tem-input" value="${state.capital}">
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:10px; width:70px; color:#aaa;">Show %:</span>
                            <input type="checkbox" id="m7tem-perc-toggle" ${state.showPerc ? 'checked' : ''}>
                        </div>
                        <hr style="border:0; border-top:1px solid #3d4450; margin: 4px 0;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px;">
                            <button id="m7tem-sync-btn" class="m7tem-btn">Sync</button>
                            <button id="m7tem-resync-btn" class="m7tem-btn" style="background:linear-gradient(180deg, #9b59b6 0%, #8e44ad 100%)">Full Re-Sync</button>
                            <button id="m7tem-gen-btn" class="m7tem-btn" style="background:linear-gradient(180deg, #3498db 0%, #2980b9 100%)">Gen Key</button>
                            <button id="m7tem-clear-btn" class="m7tem-btn" style="background:linear-gradient(180deg, #e67e22 0%, #d35400 100%)">Clear Data</button>
                        </div>
                        <div id="m7tem-status" style="font-size:10px; color: #888; text-align:center; margin-top:5px;">Ready</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        const navBtns = panel.querySelectorAll('.m7tem-nav-btn');
        navBtns.forEach(btn => {
            btn.onclick = () => {
                navBtns.forEach(b => b.classList.remove('active'));
                panel.querySelectorAll('.m7tem-section').forEach(s => s.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`m7tem-tab-${btn.dataset.tab}`).classList.add('active');
                state.activeTab = btn.dataset.tab;
                if (state.activeTab === 'stats') renderTable();
            };
        });

        const apiIn = document.getElementById('m7tem-api-input');
        apiIn.onchange = (e) => { state.apiKey = e.target.value.trim(); GM_setValue('apiKey', state.apiKey); };
        apiIn.onfocus = () => apiIn.type = 'text';
        apiIn.onblur = () => apiIn.type = 'password';

        const capIn = document.getElementById('m7tem-cap-input');
        capIn.onchange = (e) => { state.capital = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0; GM_setValue('capital', state.capital); };

        const percToggle = document.getElementById('m7tem-perc-toggle');
        percToggle.onchange = (e) => { state.showPerc = e.target.checked; GM_setValue('showPerc', state.showPerc); };

        document.getElementById('m7tem-sync-btn').onclick = () => manualSync(state.lastSync);
        document.getElementById('m7tem-resync-btn').onclick = () => { if(confirm("Full re-sync?")) { clearData(false); state.fullSyncMode=true; manualSync(0); } };
        document.getElementById('m7tem-clear-btn').onclick = () => { if(confirm("Clear data?")) clearData(true); };
        document.getElementById('m7tem-gen-btn').onclick = () => window.open('https://www.torn.com/preferences.php#tab=api?step=addNewKey&user=log&title=BookiesTracker', '_blank');
        document.getElementById('m7tem-min-btn').onclick = toggleMinimize;

        setupDragging(panel);
        renderTable();

        setInterval(() => { if (!state.isSyncing && !state.isMinimized && state.apiKey) manualSync(state.lastSync); }, 30000);
    }

    function setupDragging(panel) {
        const header = document.getElementById('m7tem-header');
        let isDragging = false, startX, startY, initialTop, initialLeft;
        const onStart = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
            isDragging = true;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startX = clientX; startY = clientY;
            initialTop = panel.offsetTop; initialLeft = panel.offsetLeft;
            if (!e.type.includes('touch')) e.preventDefault();
        };
        const onMove = (e) => {
            if (!isDragging) return;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            panel.style.top = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, initialTop + (clientY - startY))) + "px";
            panel.style.left = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, initialLeft + (clientX - startX))) + "px";
        };
        const onEnd = () => { if (isDragging) { isDragging = false; state.pos = { top: panel.offsetTop, left: panel.offsetLeft }; GM_setValue('panelPos', state.pos); } };
        header.addEventListener('mousedown', onStart);
        header.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }

    function toggleMinimize() {
        state.isMinimized = !state.isMinimized; GM_setValue('isMinimized', state.isMinimized);
        const panel = document.getElementById('m7tem-bookie-panel');
        state.isMinimized ? panel.classList.add('m7tem-minimized') : panel.classList.remove('m7tem-minimized');
        document.getElementById('m7tem-min-btn').innerText = state.isMinimized ? '+' : '-';
    }

    function renderTable() {
        const tbody = document.getElementById('m7tem-table-body');
        const lifeVal = document.getElementById('m7tem-lifetime-val');
        const pag = document.getElementById('m7tem-pagination');
        if (!tbody || state.activeTab !== 'stats' || state.isMinimized) return;
        
        tbody.innerHTML = '';
        const totalLife = state.logs.reduce((s, l) => s + l.profit, 0);
        lifeVal.innerText = (totalLife >= 0 ? '+' : '') + formatMoney(totalLife) + getPerc(totalLife);
        lifeVal.className = totalLife >= 0 ? 'm7tem-profit-pos' : 'm7tem-profit-neg';

        let combined = [...state.pendingLogs.map(l => ({ ...l, type: 'Pending', profit: 0 })), ...state.logs].sort((a, b) => b.timestamp - a.timestamp);
        const start = state.currentPage * 50;
        const pageLogs = combined.slice(start, start + 50);

        let lastDate = "";
        pageLogs.forEach(log => {
            const d = new Date(log.timestamp * 1000);
            const dateStr = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            if (dateStr !== lastDate) {
                const dayTotal = state.logs.filter(l => new Date(l.timestamp * 1000).toLocaleDateString() === d.toLocaleDateString()).reduce((s, l) => s + l.profit, 0);
                const dayRow = document.createElement('tr');
                dayRow.innerHTML = `<td colspan="4" class="m7tem-day-header">${dateStr} <span style="float:right" class="${dayTotal>=0?'m7tem-profit-pos':'m7tem-profit-neg'}">Day: ${dayTotal>=0?'+':''}${formatMoney(dayTotal)}${getPerc(dayTotal)}</span></td>`;
                tbody.appendChild(dayRow);
                lastDate = dateStr;
            }
            const tr = document.createElement('tr');
            const betStr = `${formatMoney(log.bet)}${state.showPerc ? `<br><span class="m7tem-perc">${getPerc(log.bet)}</span>` : ''}`;
            if (log.type === 'Pending') {
                tr.innerHTML = `<td>${betStr}</td><td>${log.odds}</td><td style="color:#3498db; font-weight:bold;">Pending</td><td>-</td>`;
            } else if (log.type === 'Refund') {
                tr.innerHTML = `<td>${betStr}</td><td>${log.odds}</td><td style="color:#f1c40f; font-weight:bold;">Refund</td><td>$0</td>`;
            } else {
                tr.innerHTML = `<td>${betStr}</td><td>${log.odds}</td><td class="${log.type==='Win'?'m7tem-win':'m7tem-loss'}">${log.type}</td><td class="${log.profit>=0?'m7tem-profit-pos':'m7tem-profit-neg'}">${log.profit>=0?'+':''}${formatMoney(log.profit)}${state.showPerc ? `<br><span class="m7tem-perc">${getPerc(log.profit)}</span>` : ''}</td>`;
            }
            tbody.appendChild(tr);
        });

        const totalPages = Math.ceil(combined.length / 50);
        pag.innerHTML = '';
        if (totalPages > 1) {
            const b = document.createElement('button'); b.innerText = 'Back'; b.className='m7tem-btn'; b.disabled = state.currentPage === 0; b.onclick = () => { state.currentPage--; renderTable(); };
            const n = document.createElement('button'); n.innerText = 'Next'; n.className='m7tem-btn'; n.disabled = state.currentPage >= totalPages - 1; n.onclick = () => { state.currentPage++; renderTable(); };
            
            const span = document.createElement('span');
            span.style.color = "#888";
            span.innerText = ` Page ${state.currentPage + 1} / ${totalPages} `;
            
            pag.append(b, span, n);
        }
    }

    function processLogData(apiLogs) {
        let processed = [...state.logs], pending = [...state.pendingLogs];
        apiLogs.forEach(log => {
            const data = log.data, sKey = Array.isArray(data.selection) ? data.selection.slice().sort().join(',') : null;
            if ([LOG_IDS.WIN, LOG_IDS.LOSE, LOG_IDS.REFUND].includes(log.log)) {
                if (processed.some(p => p.id === log.id)) return;
                const orig = pending.find(p => p.selectionKey === sKey) || { timestamp: log.timestamp };
                processed.push({ id: log.id, timestamp: orig.timestamp, selectionKey: sKey, type: log.log === LOG_IDS.WIN ? 'Win' : (log.log === LOG_IDS.LOSE ? 'Loss' : 'Refund'), bet: parseInt(data.bet), odds: parseFloat(data.odds), profit: log.log === LOG_IDS.WIN ? (parseInt(data.winnings) - parseInt(data.bet)) : (log.log === LOG_IDS.LOSE ? -parseInt(data.bet) : 0) });
                const idx = pending.findIndex(p => p.selectionKey === sKey); if (idx !== -1) pending.splice(idx, 1);
            } else if (log.log === LOG_IDS.PLACE && sKey) {
                if (!pending.some(p => p.selectionKey === sKey) && !processed.some(p => p.selectionKey === sKey)) pending.push({ id: log.id, timestamp: log.timestamp, selectionKey: sKey, bet: parseInt(data.bet), odds: parseFloat(data.odds) });
            }
        });
        state.logs = processed.sort((a, b) => b.timestamp - a.timestamp); state.pendingLogs = pending;
        GM_setValue('bookieLogs', state.logs); GM_setValue('pendingLogs', state.pendingLogs); if (state.activeTab === 'stats') renderTable();
    }

    function fetchLogs(from, to) {
        if (!state.apiKey || state.isSyncing) return;
        state.isSyncing = true; updateStatus('Syncing...');
        GM_xmlhttpRequest({
            method: "GET", url: `https://api.torn.com/user/?selections=log&key=${state.apiKey}&log=8460,8461,8462,8463${from?`&from=${from}`:''}${to?`&to=${to}`:''}`,
            onload: (res) => {
                state.isSyncing = false;
                try {
                    const json = JSON.parse(res.responseText);
                    if (json.log) {
                        const logs = Object.keys(json.log).map(id => ({ id, ...json.log[id] }));
                        processLogData(logs);
                        if (state.fullSyncMode && logs.length >= 100) setTimeout(() => fetchLogs(0, Math.min(...logs.map(l => l.timestamp)) - 1), 1250);
                        else { state.fullSyncMode = false; updateStatus('Sync Done'); if(logs.length > 0) state.lastSync = Math.max(...logs.map(l => l.timestamp)); GM_setValue('lastSync', state.lastSync); }
                    } else { updateStatus('Up to date'); state.fullSyncMode = false; }
                } catch(e) { updateStatus('Error'); }
            }
        });
    }

    function manualSync(ts) { fetchLogs(ts, 0); }
    function clearData(reload) { state.logs = []; state.pendingLogs = []; state.lastSync = 0; GM_setValue('bookieLogs', []); GM_setValue('pendingLogs', []); GM_setValue('lastSync', 0); if(reload) renderTable(); }
    function updateStatus(msg) { const el = document.getElementById('m7tem-status'); if (el) el.innerText = msg; }

    createUI();
})();
