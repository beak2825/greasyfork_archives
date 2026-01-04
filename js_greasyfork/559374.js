// ==UserScript==
// @name         Monarch Loadout Spies
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  testinggg
// @author       aquagloop
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559374/Monarch%20Loadout%20Spies.user.js
// @updateURL https://update.greasyfork.org/scripts/559374/Monarch%20Loadout%20Spies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DB_KEY = 'TORN_LOADOUT_SPIES_CACHE_V11';
    const SYNC_TIMER_KEY = 'TORN_LOADOUT_SPIES_LAST_SYNC';

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzb8gyTiSwk8Tzx5_Z3GX4D6GbHyXQ8CGR-5_q1Vojjviee3H0QHPiN_nalSZQnldQ/exec";

    let intercepted_rfcv = null;

    const sniffToken = (url, type) => {
        if (!url || typeof url !== 'string') return;
        const match = url.match(/[?&]rfcv=([^&]+)/);
        if (match && match[1]) {
            if (intercepted_rfcv !== match[1]) {
                 console.log(`[Loadout Spies] [Network] Captured new token via ${type}:`, match[1]);
                 intercepted_rfcv = match[1];
                 localStorage.setItem('torn_chat_rfcv_cache', intercepted_rfcv);
            }
        }
    };

    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const originalOpen = targetWindow.XMLHttpRequest.prototype.open;
    targetWindow.XMLHttpRequest.prototype.open = function(method, url) {
        sniffToken(url, 'XHR');
        return originalOpen.apply(this, arguments);
    };

    const originalFetch = targetWindow.fetch;
    targetWindow.fetch = function(input, init) {
        let url = input;
        if (input instanceof Request) url = input.url;
        sniffToken(url, 'Fetch');
        return originalFetch.apply(this, arguments);
    };



    const getRFCV = () => {
        if (intercepted_rfcv) return intercepted_rfcv;
        if (window.rfc_v) return window.rfc_v;
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.rfc_v) return unsafeWindow.rfc_v;
        return localStorage.getItem('torn_chat_rfcv_cache');
    };

    const cleanJSON = (text) => {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        return (start !== -1 && end !== -1) ? text.substring(start, end + 1) : text;
    };

    const shortenDesc = (text) => {
        let s = text;
        s = s.replace(/decreased incoming bullet damage/gi, 'Decr Bullet Dmg');
        s = s.replace(/increased EXP upon final hit/gi, 'Incr EXP');
        s = s.replace(/increased ammo conservation/gi, 'Incr Ammo Save');
        s = s.replace(/chance to Slow opponent/gi, 'Chance Slow');
        s = s.replace(/critical hit rate/gi, 'Crit Rate');
        s = s.replace(/(\d+%?)/g, '<b>$1</b>');
        return s;
    };

    const Cloud = {
        getUrl: () => GOOGLE_SCRIPT_URL,
        checkAutoSync: () => {
            const lastSync = GM_getValue(SYNC_TIMER_KEY, 0);
            if (Date.now() - lastSync > 12 * 60 * 60 * 1000) Cloud.syncChain();
        },
        syncChain: () => Cloud.pull(true),
        push: (isAuto = false) => {
            const players = DB.getAll();
            if (players.length === 0) return;
            if(!isAuto) renderHUDStatus("Pushing to Cloud...");

            GM_xmlhttpRequest({
                method: "POST", url: Cloud.getUrl(),
                data: JSON.stringify(players),
                headers: { "Content-Type": "application/json" },
                onload: () => {
                    if(!isAuto) {

                        renderHUDStatus("Cloud Updated");
                        const btn = document.getElementById('spy-sync-btn');
                        if(btn) { btn.innerText = "Synced"; setTimeout(()=>btn.innerText="Force Sync", 2000); }
                    }
                    GM_setValue(SYNC_TIMER_KEY, Date.now());
                }
            });
        },
        pull: (chainPush = false) => {
            const btn = document.getElementById('spy-sync-btn');
            if(btn) { btn.innerText = "Syncing..."; btn.disabled = true; }
            if(!chainPush) renderHUDStatus("Pulling from Cloud...");

            GM_xmlhttpRequest({
                method: "GET", url: Cloud.getUrl(),
                onload: (response) => {
                    try {
                        const rows = JSON.parse(response.responseText);
                        let updated = 0;
                        const db = DB.load();
                        rows.forEach(row => {
                            const id = String(row[0]);
                            const ts = parseInt(row[2]);
                            if (!db[id] || ts > db[id].ts) {
                                db[id] = { name: row[1], ts: ts, gear: JSON.parse(row[3]) };
                                updated++;
                            }
                        });
                        DB.save(db);
                        console.log(`[Loadout Spies] Synced. Updated: ${updated}`);

                        if (document.getElementById('spy-db-modal')) renderDBList();

                        if(!chainPush) {

                            renderHUDStatus("Ready");
                            if(btn) { btn.innerText = "Done"; setTimeout(()=> { btn.innerText="Force Sync"; btn.disabled=false; }, 2000); }
                        } else {
                            Cloud.push(true);
                        }
                    } catch (e) {
                        console.error("Cloud Parse Error", e);
                        if(btn) { btn.innerText = "Error"; btn.disabled=false; }
                    }
                }
            });
        }
    };

    const DB = {
        load: () => JSON.parse(localStorage.getItem(DB_KEY) || '{}'),
        save: (db) => localStorage.setItem(DB_KEY, JSON.stringify(db)),
        clear: () => localStorage.removeItem(DB_KEY),

        update: (id, userData, items) => {
            const db = DB.load();

            // Process items first
            const cleanItems = items.map(slotData => {
                if (!slotData || !slotData.item || !Array.isArray(slotData.item) || slotData.item.length === 0) return null;
                const item = slotData.item[0];
                const bonuses = Object.values(item.currentBonuses || slotData.currentBonuses || {}).map(b => `${b.title}: ${shortenDesc(b.desc)}`);
                const mods = Object.values(item.currentUpgrades || slotData.currentUpgrades || {}).map(m => m.title);

                let q = 'grey';
                if (item.glowClass) {
                    if (item.glowClass.includes('red')) q = 'red';
                    else if (item.glowClass.includes('orange')) q = 'orange';
                    else if (item.glowClass.includes('yellow')) q = 'yellow';
                }

                return {
                    n: item.name, q: q, s: parseInt(item.equipSlot),
                    d: item.dmg, a: item.acc, b: bonuses, m: mods
                };
            }).filter(i => i !== null && (i.s <= 3 || i.b.length > 0));

            if (cleanItems.length === 0) {
                console.log("[Loadout Spies] Data was empty. Ignoring update.");
                return;
            }

            let entry = db[id] || { name: userData.playername, ts: 0, gear: { latest: [], history: {} } };

            const oldFingerprint = JSON.stringify((entry.gear.latest || []).map(i => i.n).sort());
            const newFingerprint = JSON.stringify(cleanItems.map(i => i.n).sort());
            const isChanged = (oldFingerprint !== newFingerprint);


            if (Array.isArray(entry.gear)) {
                entry.gear = { latest: entry.gear, history: { "legacy": { ts: entry.ts, count: 1, items: entry.gear } } };
            }

            const loadoutFingerprint = JSON.stringify(cleanItems.map(i => i.n + (i.m.length ? i.m.join('') : '')).sort());

            if (!entry.gear.history) entry.gear.history = {};

            if (entry.gear.history[loadoutFingerprint]) {
                entry.gear.history[loadoutFingerprint].ts = Date.now();
                entry.gear.history[loadoutFingerprint].count++;
                entry.gear.history[loadoutFingerprint].items = cleanItems;
            } else {
                entry.gear.history[loadoutFingerprint] = { ts: Date.now(), count: 1, items: cleanItems };
            }

            entry.name = userData.playername;
            entry.ts = Date.now();
            entry.gear.latest = cleanItems;

            db[id] = entry;
            DB.save(db);


            if (isChanged) {
                console.log(`[Loadout Spies] Loadout changed for ${userData.playername}. Triggering instant push.`);
                Cloud.push(true); // 'true' means silent/auto push
            }
        },

        getAll: () => {
            const db = DB.load();
            return Object.entries(db).map(([id, data]) => ({id, ...data})).sort((a,b) => b.ts - a.ts);
        },
        get: (id) => {
            const db = DB.load();
            let entry = db[id];
            if (entry && Array.isArray(entry.gear)) {
                entry.gear = { latest: entry.gear, history: { "legacy": { ts: entry.ts, count: 1, items: entry.gear } } };
            }
            return entry;
        }
    };

    async function fetchAttackData(user2ID) {
        const rfcv = getRFCV();
        if (!rfcv) return renderHUDStatus("No Token");
        try {
            const formData = new FormData();
            formData.append('user2ID', user2ID);
            formData.append('step', 'poll');
            const response = await fetch(`/loader.php?sid=attackData&mode=json&rfcv=${rfcv}`, { method: 'POST', body: formData });
            const text = await response.text();
            const json = JSON.parse(cleanJSON(text));
            const data = json.DB ? json.DB : json;


            if (data.attackStatus === 'notStarted') {
                const cached = DB.get(user2ID);
                if (cached) {
                    console.log("[Loadout Spies] Attack not started. Showing Cached View.");

                    renderCachedHUD(cached);
                } else {
                    renderHUDStatus("Waiting to join...");
                }
                return;
            }
            // ---------------------------

            if (data.defenderItems) {
                DB.update(user2ID, data.defenderUser, Object.values(data.defenderItems));
                renderLiveHUD(data);
            }
        } catch (e) { console.error("[Loadout Spies] Fetch Error:", e); }
    }

    function renderHUDStatus(msg) {
        const el = document.getElementById('spy-list');
        if (el) el.innerHTML = `<div style="padding:15px; text-align:center; color:#777;">${msg}</div>`;
    }

    function renderGearList(gear) {
        if (!gear || gear.length === 0) return `<div style="padding:10px; text-align:center; color:#666;">Loadout Empty</div>`;
        let html = '';
        const weapons = gear.filter(g => g.s <= 3);
        const armor = gear.filter(g => g.s > 3);
        const qMap = { red: '#e74c3c', orange: '#e67e22', yellow: '#f1c40f', grey: '#bbb' };
        const qBorderMap = { red: '#e74c3c', orange: '#e67e22', yellow: '#f1c40f', grey: '#3498db', wep: '#888' };

        const renderRow = (g, type) => {
            let border = (type === 'weapon') ? qBorderMap.wep : qBorderMap.grey;
            if (g.q !== 'grey') border = qBorderMap[g.q];
            let details = '';
            if (type === 'weapon') details += `<div class="spy-stat-row">DMG <span style="color:#fff">${g.d}</span> - ACC <span style="color:#fff">${g.a}</span></div>`;
            g.m.forEach(mod => details += `<div class="spy-mod">M: ${mod}</div>`);
            g.b.forEach(bonus => details += `<div class="spy-bonus">B: ${bonus}</div>`);
            return `
                <div class="spy-row" style="border-left: 3px solid ${border};">
                    <div class="spy-name" style="color:${qMap[g.q]}">${g.n}</div>
                    ${details}
                </div>
            `;
        };
        weapons.forEach(w => html += renderRow(w, 'weapon'));
        armor.forEach(a => html += renderRow(a, 'armor'));
        return html;
    }

    function renderLiveHUD(data) {
        document.getElementById('spy-header-text').innerHTML = `LIVE INTEL <span style="color:#4caf50; font-size:9px;">(Active)</span>`;
        const items = Object.values(data.defenderItems);
        const processed = items.map(slotData => {
            if (!slotData || !slotData.item || !Array.isArray(slotData.item) || slotData.item.length === 0) return null;
            const item = slotData.item[0];
            const bonuses = Object.values(item.currentBonuses || slotData.currentBonuses || {}).map(b => `${b.title}: ${shortenDesc(b.desc)}`);
            const mods = Object.values(item.currentUpgrades || slotData.currentUpgrades || {}).map(m => m.title);
            let q = 'grey';
            if (item.glowClass && item.glowClass.includes('red')) q = 'red';
            else if (item.glowClass && item.glowClass.includes('orange')) q = 'orange';
            else if (item.glowClass && item.glowClass.includes('yellow')) q = 'yellow';
            return { n: item.name, q: q, s: parseInt(item.equipSlot), d: item.dmg, a: item.acc, b: bonuses, m: mods };
        }).filter(i => i !== null && (i.s <= 3 || i.b.length > 0));

        document.getElementById('spy-list').innerHTML = renderGearList(processed);
    }

    function renderCachedHUD(data) {
        const timeAgo = Math.floor((Date.now() - data.ts) / (1000 * 60 * 60 * 24));
        const timeText = timeAgo === 0 ? "Today" : `${timeAgo}d ago`;
        const histSize = Object.keys(data.gear.history || {}).length;
        const badge = histSize > 1 ? `<span style="color:#3498db; margin-left:5px;">(Swap)</span>` : '';
        document.getElementById('spy-header-text').innerHTML = `CACHED ${badge} <span style="color:#aaa; font-size:9px;">${timeText}</span>`;
        document.getElementById('spy-list').innerHTML = renderGearList(data.gear.latest);
    }

    function createHUD() {
        if (document.getElementById('torn-spy-hud')) return;
        const hud = document.createElement('div');
        hud.id = 'torn-spy-hud';
        hud.innerHTML = `
            <div id="spy-drag-bar">
                <div id="spy-header-text">LOADOUT SPIES</div>
                <div style="display:flex; gap:10px;">
                    <div id="spy-db-btn" title="DB">DB</div>
                    <div id="spy-close" title="Close">X</div>
                </div>
            </div>
            <div id="spy-list"></div>
        `;
        document.body.appendChild(hud);
        document.getElementById('spy-close').onclick = () => hud.style.display = 'none';
        document.getElementById('spy-db-btn').onclick = openDatabase;

        const dragBar = document.getElementById('spy-drag-bar');
        let isDown = false, offset = [0, 0];
        const startDrag = (clientX, clientY) => { isDown = true; offset = [hud.offsetLeft - clientX, hud.offsetTop - clientY]; };
        const moveDrag = (clientX, clientY) => { if (isDown) { hud.style.left = (clientX + offset[0]) + 'px'; hud.style.top = (clientY + offset[1]) + 'px'; } };

        dragBar.addEventListener('mousedown', (e) => { if(e.target.id === 'spy-db-btn' || e.target.id === 'spy-close') return; startDrag(e.clientX, e.clientY); });
        document.addEventListener('mouseup', () => isDown = false);
        document.addEventListener('mousemove', (e) => { if(isDown) moveDrag(e.clientX, e.clientY); });
        dragBar.addEventListener('touchstart', (e) => { if(e.target.id === 'spy-db-btn' || e.target.id === 'spy-close') return; const touch = e.touches[0]; startDrag(touch.clientX, touch.clientY); }, {passive: false});
        document.addEventListener('touchend', () => isDown = false);
        document.addEventListener('touchmove', (e) => { if (isDown) { e.preventDefault(); const touch = e.touches[0]; moveDrag(touch.clientX, touch.clientY); } }, {passive: false});
    }

    function renderDBList() {
        const players = DB.getAll();
        const headerTitle = document.getElementById('db-header-title');
        if(headerTitle) headerTitle.innerText = `LOADOUT SPIES DB (${players.length})`;

        const tbody = document.getElementById('db-table-body');
        if(!tbody) return;

        let rows = players.map(p => {
            const date = new Date(p.ts).toLocaleDateString();
            const topWeapon = p.gear.latest.find(g => g.s <= 3) || {n:'-', q:'grey'};
            const qMap = { red: '#e74c3c', orange: '#e67e22', yellow: '#f1c40f', grey: '#888' };
            const histSize = Object.keys(p.gear.history || {}).length;
            const badge = histSize > 1 ? `<span style="color:#3498db; font-size:9px; font-weight:bold;">(S)</span>` : '';
            return `
                <tr>
                    <td>
                        <button class="db-view-btn" data-id="${p.id}">View</button>
                        <a href="/profiles.php?XID=${p.id}" target="_blank" style="color:#3498db; font-weight:bold;">${p.name}</a> ${badge}
                    </td>
                    <td style="color:${qMap[topWeapon.q]}">${topWeapon.n}</td>
                    <td style="color:#666; font-size:10px;">${date}</td>
                </tr>
            `;
        }).join('');
        if(!rows) rows = '<tr><td colspan="3" style="padding:20px; text-align:center;">No targets.</td></tr>';

        tbody.innerHTML = rows;
        document.querySelectorAll('.db-view-btn').forEach(btn => btn.addEventListener('click', (e) => openInspector(e.target.getAttribute('data-id'))));
    }

    function openDatabase() {
        if (document.getElementById('spy-db-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'spy-db-modal';
        modal.innerHTML = `
            <div class="db-container">
                <div class="db-header">
                    <span id="db-header-title">LOADOUT SPIES DB (0)</span>
                    <div style="display:flex; gap:10px;">
                        <button id="spy-clear-btn" style="border:1px solid #c0392b; color:#e74c3c; margin-right:5px;">Clear DB</button>
                        <button id="spy-sync-btn" style="border:1px solid #4CAF50; color:#4CAF50;">Force Sync</button>
                        <span class="db-close" id="db-close-btn">X</span>
                    </div>
                </div>
                <div class="db-body">
                    <div class="db-list-panel">
                        <table class="db-table">
                            <thead><tr><th>Name</th><th>Top Wep</th><th>Date</th></tr></thead>
                            <tbody id="db-table-body"></tbody>
                        </table>
                    </div>
                    <div class="db-inspector-panel" id="db-inspector">
                        <div style="padding:50px; text-align:center; color:#555;">Select a player</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        renderDBList();

        document.getElementById('db-close-btn').addEventListener('click', () => document.getElementById('spy-db-modal').remove());
        document.getElementById('spy-sync-btn').addEventListener('click', () => Cloud.syncChain());

        document.getElementById('spy-clear-btn').addEventListener('click', () => {
            if (confirm("Are you sure you want to delete all saved loadout data? This cannot be undone.")) {
                DB.clear();
                alert("Database cleared.");
                renderDBList();
                document.getElementById('db-inspector').innerHTML = '<div style="padding:50px; text-align:center; color:#555;">Select a player</div>';
            }
        });
    }

    window.spyInspectorState = { id: null, mode: 'latest' };

    function openInspector(id) {
        const p = DB.get(id);
        let initialMode = 'latest';

        if (p && (!p.gear.latest || p.gear.latest.length === 0)) {
            const historyList = Object.values(p.gear.history || {});
            const hasRealHistory = historyList.some(h => h.items && h.items.length > 0);
            if (hasRealHistory) {
                initialMode = 'common';
            }
        }

        window.spyInspectorState = { id: id, mode: initialMode };
        renderInspector();
    }

    function renderInspector() {
        const { id, mode } = window.spyInspectorState;
        const p = DB.get(id);
        const container = document.getElementById('db-inspector');
        if(!p || !container) return;

        let gearToShow = p.gear.latest;
        let infoText = `Last Scanned: ${new Date(p.ts).toLocaleDateString()}`;

        const historyList = Object.values(p.gear.history || {});
        historyList.sort((a,b) => b.count - a.count);

        let mostCommon = historyList.find(h => h.items && h.items.length > 0);
        if (!mostCommon) mostCommon = historyList[0];

        const latestHash = JSON.stringify((p.gear.latest || []).map(i=>i.n).sort());
        const commonHash = mostCommon ? JSON.stringify(mostCommon.items.map(i=>i.n).sort()) : "";
        const isSame = (latestHash === commonHash);

        if (mode === 'common' && mostCommon) {
            gearToShow = mostCommon.items;
            infoText = `Seen ${mostCommon.count} times (Most Common)`;
        } else if (mode === 'latest') {
            infoText = `Last Scanned: ${new Date(p.ts).toLocaleDateString()} (Latest)`;
        }

        let tabs = '';
        if (!isSame && historyList.length > 0) {
            const btnStyle = (active) => `border:1px solid #444; padding:5px 10px; cursor:pointer; font-size:11px; border-radius:3px; background:${active?'#333':'transparent'}; color:${active?'#fff':'#666'}; font-weight:${active?'bold':'normal'};`;
            tabs = `
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <button class="spy-mode-btn" data-mode="latest" style="${btnStyle(mode==='latest')}">LATEST</button>
                    <button class="spy-mode-btn" data-mode="common" style="${btnStyle(mode==='common')}">MOST COMMON</button>
                </div>
            `;
        } else {
             infoText = `Standard Loadout (Seen ${mostCommon ? mostCommon.count : 1} times)`;
        }

        const html = `
            <div class="insp-header">
                <div style="font-size:16px; font-weight:bold; color:#fff;">${p.name}</div>
                ${tabs}
                <div style="margin-top:8px; font-size:10px; color:#888;">${infoText}</div>
            </div>
            <div class="insp-content">
                ${renderGearList(gearToShow)}
            </div>
        `;

        container.innerHTML = html;

        container.querySelectorAll('.spy-mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const newMode = e.target.getAttribute('data-mode');
                window.spyInspectorState.mode = newMode;
                renderInspector();
            });
        });
    }

    Cloud.checkAutoSync();
    GM_registerMenuCommand("Open Loadout Spies Database", openDatabase);

    if (window.location.href.includes('sid=attack')) {
        const params = new URLSearchParams(window.location.search);
        const user2ID = params.get('user2ID');
        if (user2ID) {
            createHUD();
            const cachedData = DB.get(user2ID);
            if (cachedData) renderCachedHUD(cachedData);
            setTimeout(() => fetchAttackData(user2ID), 500);
        }
    }

    GM_addStyle(`
        #torn-spy-hud { position: fixed; top: 120px; right: 20px; width: 250px; background: rgba(12, 12, 12, 0.98); border: 1px solid #444; border-radius: 4px; box-shadow: 0 5px 15px rgba(0,0,0,0.8); z-index: 999990; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; }
        #spy-drag-bar { background: #1f1f1f; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center; cursor: move; border-bottom: 1px solid #333; }
        #spy-header-text { font-weight: 800; font-size: 12px; display:flex; gap:10px; color:#ddd; }
        #spy-close, #spy-db-btn { cursor: pointer; color: #888; font-size: 14px; font-weight:bold; } #spy-close:hover, #spy-db-btn:hover { color: #fff; transform: scale(1.1); }
        #spy-list { padding: 4px 0; max-height: 80vh; overflow-y:auto; }
        .spy-row { padding: 5px 10px; border-bottom: 1px solid #222; background: linear-gradient(90deg, rgba(255,255,255,0.02), transparent); }
        .spy-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; text-shadow: 0 0 5px rgba(0,0,0,0.5); }
        .spy-stat-row { color: #888; font-size: 11px; margin-bottom: 3px; }
        .spy-bonus { color: #2ecc71; font-size: 11px; margin-top: 2px; padding-left: 6px; border-left: 1px solid #2ecc71; line-height: 1.2; }
        .spy-bonus b { color:#fff; }
        .spy-mod { color: #3498db; font-size: 11px; margin-top: 2px; padding-left: 6px; border-left: 1px solid #3498db; }
        .spy-subhead { font-size: 10px; font-weight: 800; color: #555; padding: 8px 10px 2px; letter-spacing: 1px; }

        #spy-db-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 999999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); font-family: 'Segoe UI', sans-serif; }
        .db-container { width: min(900px, 95vw); height: min(600px, 85vh); background: #151515; border: 1px solid #444; border-radius: 6px; display: flex; flex-direction: column; box-shadow: 0 0 40px rgba(0,0,0,1); overflow: hidden; }
        .db-header { padding: 15px; background: #222; border-bottom: 1px solid #333; color: #fff; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .db-close { cursor: pointer; color: #888; margin-left: 15px; } .db-close:hover { color: #fff; }
        .db-body { display: flex; flex: 1; overflow: hidden; }
        .db-list-panel { width: 60%; border-right: 1px solid #333; overflow-y: auto; background:#111; }
        .db-table { width: 100%; border-collapse: collapse; font-size: 12px; color: #ddd; }
        .db-table th { background: #1a1a1a; padding: 12px 10px; text-align: left; position: sticky; top: 0; border-bottom: 1px solid #333; z-index: 10; font-weight:600; color:#888; }
        .db-table td { padding: 8px 10px; border-bottom: 1px solid #222; }
        .db-table tr:hover { background: #252525; }
        .db-view-btn { background: none; border: none; cursor: pointer; font-size: 11px; color:#aaa; margin-right: 5px; opacity: 0.6; transition: 0.2s; }
        .db-view-btn:hover { opacity: 1; color:#fff; }
        .db-inspector-panel { width: 40%; background: #0f0f0f; display: flex; flex-direction: column; border-left: 1px solid #000; }
        .insp-header { padding: 20px; background: #181818; border-bottom: 1px solid #333; }
        .insp-content { padding: 0; overflow-y: auto; flex: 1; }
        #spy-sync-btn, #spy-clear-btn { background: #333; color: #fff; border: 1px solid #555; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; }
        #spy-sync-btn:hover, #spy-clear-btn:hover { background: #444; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }

        @media (max-width: 600px) {
            .db-container { flex-direction: column; }
            .db-list-panel { width: 100%; height: 50%; border-right: none; border-bottom: 1px solid #333; }
            .db-inspector-panel { width: 100%; height: 50%; border-left: none; }
            #torn-spy-hud { top: 60px; right: 10px; width: 220px; }
        }
    `);
})();