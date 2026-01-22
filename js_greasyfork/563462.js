// ==UserScript==
// @name         Torn Global Watchlist Master
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Watchlist with priority sorting and Bridge support.
// @author       Dirt-Fairy and Gemini
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563462/Torn%20Global%20Watchlist%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/563462/Torn%20Global%20Watchlist%20Master.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE = "TornWatchlist_GlobalAPIKey";
    const STORAGE_KEY = "TornGlobalWatchlist";
    const POS_KEY = "TornWatchlistPos";
    const BRIDGE_KEY = "TornWatchlist_Bridge"; // Shared Mailbox

   const BASE_FLIGHT_TIMES = {
        "Mexico": 26, "Cayman Islands": 35, "Canada": 41, "Hawaii": 134,
        "United Kingdom": 159, "Argentina": 167, "Switzerland": 175,
        "Japan": 225, "China": 242, "UAE": 271, "South Africa": 297
    };

    let watchlist = GM_getValue(STORAGE_KEY, []);
    let pos = GM_getValue(POS_KEY, { top: "15%", left: "50%", width: "350px", height: "auto" });

    function getApiKey() { return localStorage.getItem(API_KEY_STORAGE); }
    function saveWatchlist() { GM_setValue(STORAGE_KEY, watchlist); renderWatchlist(); }

    function getStatusColor(status) {
        if (!status) return '#808080';
        const s = status.toLowerCase();
        if (s === 'online' || s === 'green') return '#00ff00';
        if (s === 'idle' || s === 'orange' || s === 'blue') return '#ff8c00';
        return '#808080';
    }

    function formatTimeElapsed(ms) {
        const seconds = Math.floor(Math.abs(ms) / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        let parts = [];
        if (h > 0) parts.push(h + "h");
        if (m > 0 || h > 0) parts.push(m + "m");
        parts.push(s + "s");
        return parts.join(" ");
    }

    // --- Market Map Configuration & Helpers ---
    const ITEMS_MAX_AGE = 60 * 60 * 1000; // 1 hour cache

    function itemsCacheFresh() {
        const ts = Number(localStorage.getItem('mug_market_ts') || 0);
        return ts && (Date.now() - ts) < ITEMS_MAX_AGE;
    }

    async function getMarketMap(apiKey) {
        const cacheRaw = localStorage.getItem('mug_market_cache');
        if (cacheRaw && itemsCacheFresh()) {
            try { return JSON.parse(cacheRaw) || {}; } catch (e) { console.error("Failed to parse Market Map cache", e); }
        }
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/torn/?selections=items&key=${apiKey}`,
                onload: (r) => {
                    try {
                        const data = JSON.parse(r.responseText);
                        if (data.error) return resolve({});
                        const map = {};
                        for (const id in data.items) map[id] = data.items[id].market_value || 0;
                        localStorage.setItem('mug_market_cache', JSON.stringify(map));
                        localStorage.setItem('mug_market_ts', String(Date.now()));
                        resolve(map);
                    } catch (e) { resolve({}); }
                },
                onerror: (err) => resolve({})
            });
        });
    }

    async function syncUser(id) {
        const apiKey = getApiKey();
        if (!apiKey) return;
        const marketMap = await getMarketMap(apiKey);

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${id}?selections=profile,bazaar&key=${apiKey}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const idx = watchlist.findIndex(u => u.id == id);
                    if (idx === -1 || data.error) return;

                    const now = Math.floor(Date.now() / 1000);
                    watchlist[idx].name = data.name || watchlist[idx].name;
                    watchlist[idx].last_sync = Date.now();
                    watchlist[idx].last_action = data.last_action.relative;
                    watchlist[idx].state = data.status.state;
                    watchlist[idx].until = data.status.until || 0;
                    watchlist[idx].revivable = data.revivable === 1;
                    watchlist[idx].status_color = data.last_action.status;

                    const fullStatus = data.status.description || "Okay";
                    watchlist[idx].status = (data.status.state === "Hospital" || data.status.state === "Jail")
                        ? fullStatus.replace(/\sfor\s.*$/i, "").trim() : fullStatus;

                    const travelMatch = fullStatus.match(/(Traveling to|Returning to Torn from)\s+([A-Za-z\s]+)/i);
// Check for flight type icons on the current page to verify speed
                    const statusContainer = document.querySelector('.profile-status');
                    if (statusContainer) {
                        const classList = statusContainer.className.toLowerCase();
                        let detectedSpeed = null;
                        let detectedIcon = "";

                        if (classList.includes('private')) {
                            detectedSpeed = 0.501; detectedIcon = "🛩️";
                        } else if (classList.includes('airstrip')) {
                            detectedSpeed = 0.700; detectedIcon = "🏝️";
                        } else if (classList.includes('airliner')) {
                            detectedSpeed = 0.300; detectedIcon = "✈️";
                        }

                        if (detectedSpeed) {
                            watchlist[idx].saved_speed = detectedSpeed;
                            watchlist[idx].current_tier = detectedSpeed;
                            watchlist[idx].travel_icon = detectedIcon;
                        }
                    }
                    if (travelMatch) {
                        const direction = travelMatch[1].toLowerCase();
                        const country = travelMatch[2].trim();
                        const baseMins = BASE_FLIGHT_TIMES[country] || 0;
                        const lastActionTS = data.last_action.timestamp;
                        const directionChanged = watchlist[idx].last_direction && watchlist[idx].last_direction !== direction;
                        const maxStandardSeconds = (baseMins * 60) + 300;
                        const hasLikelyLandedAndRestarted = (now - (watchlist[idx].travel_start_ts || 0)) > maxStandardSeconds;

                        if (watchlist[idx].destination !== country || directionChanged || hasLikelyLandedAndRestarted || !watchlist[idx].estimated_land_time) {
                            watchlist[idx].destination = country;
                            watchlist[idx].last_direction = direction;
                            watchlist[idx].travel_start_ts = lastActionTS;
                            const speed = watchlist[idx].saved_speed || 0.300;
                            watchlist[idx].current_tier = speed;
                            let landTime = lastActionTS + (baseMins * 60 * speed);
                            watchlist[idx].estimated_land_time = (landTime < now) ? (now + 60) : landTime;
                        }
                    } else {
                        watchlist[idx].destination = data.status.destination || "Torn";
                        watchlist[idx].last_direction = null;
                        watchlist[idx].estimated_land_time = 0;
                        if (data.status.state === "Okay" && watchlist[idx].destination === "Torn") watchlist[idx].saved_speed = null;
                    }

                    let bVal = 0;
                    if (data.bazaar) {
                        const items = Array.isArray(data.bazaar) ? data.bazaar : Object.values(data.bazaar || {});
                        items.forEach(item => {
                            const officialPrice = marketMap[item.ID] || item.market_value || 0;
                            const qty = Number(item.quantity || 1);
                            bVal += (officialPrice * qty);
                        });
                    }

                    watchlist[idx].bazaar_val = bVal;
                    watchlist[idx].bazaar_open = (bVal > 0) || (fullStatus.toLowerCase().includes("bazaar"));

                    const row = document.querySelector(`.watchlist-item-${id}`);
                    if (row) { row.classList.add("sync-flash"); setTimeout(() => row.classList.remove("sync-flash"), 1000); }
                    saveWatchlist();
                } catch (e) { console.error("Sync error", e); }
            }
        });
    }

    // --- BRIDGE LISTENER (NEW) ---
    // Checks the mailbox every 2 seconds for data from the Mugger script
    setInterval(function() {
        const bridgeData = localStorage.getItem(BRIDGE_KEY);
        if (bridgeData) {
            try {
                const queue = JSON.parse(bridgeData);
                if (Array.isArray(queue)) {
                    queue.forEach(item => {
                        if (item && item.id) addToWatchlist(item.id, item.name || "User " + item.id);
                    });
                }
                localStorage.removeItem(BRIDGE_KEY); // Clear mailbox
            } catch(e) {}
        }
    }, 2000);
    // -----------------------------

    setInterval(function() {
        const now = Math.floor(Date.now() / 1000);
        watchlist.forEach(function(u) {
            if ((u.state === "Hospital" || u.state === "Jail") && u.until > 0) {
                const rem = u.until - now;
                const el = document.querySelector(".hosp-timer-" + u.id);
                if (el) el.textContent = rem > 0 ? " (" + formatTimeElapsed(rem * 1000) + " left)" : " (Out now)";
            }
            if (u.estimated_land_time > 0) {
                const baseMins = BASE_FLIGHT_TIMES[u.destination] || 0;
                const now = Math.floor(Date.now() / 1000);
                if (!u.saved_speed) {
                    const busTime = u.travel_start_ts + (baseMins * 60 * 0.300);
                    if (u.current_tier === 0.300 && now > (busTime + 600)) {
                        u.current_tier = 1.000;
                        u.estimated_land_time = u.travel_start_ts + (baseMins * 60 * 1.000);
                    }
                }
                const rem = u.estimated_land_time - now;
                const el = document.querySelector(".travel-timer-" + u.id);
                const row = document.querySelector(".travel-line-" + u.id);
                if (el) {
                    const s = u.current_tier;
                    let tierName = (s === 0.3) ? "Business" : (s === 0.501 ? "Private" : (s === 0.7 ? "Airstrip" : "Standard"));
                    const tierLabel = u.saved_speed ? `[Verified]` : `[Assuming - ${tierName}]`;
                    if (rem > 0) {
                        el.textContent = ` (Est. ${formatTimeElapsed(rem * 1000)} left ${tierLabel})`;
                        if (row) row.classList.remove("alert-pulse");
                    } else {
                        el.innerHTML = ` <button class="check-arrival-btn" data-id="${u.id}">Check Arrival</button>`;
                        if (row) row.classList.add("alert-pulse");
                    }
                }
            }
            if (u.last_sync > 0) {
                const elapsed = Date.now() - u.last_sync;
                const el = document.querySelector(".sync-timer-" + u.id);
                if (el) el.textContent = "Synced " + formatTimeElapsed(elapsed) + " ago";
            }
        });
    }, 1000);

    function renderWatchlist() {
        const list = document.getElementById('gwl-list');
        if (!list) return;
        watchlist.sort((a, b) => {
            const timeA = a.estimated_land_time > 0 ? a.estimated_land_time : (a.until > 0 ? a.until : 9999999999);
            const timeB = b.estimated_land_time > 0 ? b.estimated_land_time : (b.until > 0 ? b.until : 9999999999);
            if (timeA !== timeB) return timeA - timeB;
            return a.name.localeCompare(b.name);
        });
        list.innerHTML = watchlist.length ? "" : "<li style='padding:10px; text-align:center;'>List Empty</li>";
        watchlist.forEach(function(u) {
            const li = document.createElement('li');
            li.className = `watchlist-item watchlist-item-${u.id}`;
            const canAttack = u.state === "Okay" || u.state === "Abroad";
            const dotColor = getStatusColor(u.status_color);
            const heartColor = u.revivable ? "#ffff00" : "#ff4444";
            li.innerHTML = `
                <div class="user-row">
                    <div class="user-main"><span class="status-dot" style="background:${dotColor}"></span><strong>${u.name}</strong> [${u.id}]<span style="color:${heartColor}">♥</span></div>
                    <div class="user-actions"><span class="gwl-sync" data-id="${u.id}">🔄</span><span class="gwl-remove" data-id="${u.id}">✖</span></div>
                </div>
                <div class="info-grid">
                    <div class="status-line ${u.state === 'Hospital' ? 'danger' : ''}">${u.status || "Okay"}<span class="hosp-timer-${u.id}"></span></div>
                    <div class="link-row"><a href="/profiles.php?XID=${u.id}" target="_blank">Profile</a> | <a href="/loader.php?sid=attack&user2ID=${u.id}" target="_blank" class="${!canAttack ? 'disabled-link' : ''}">Attack</a>${u.bazaar_val > 0 ? ` | <a href="/bazaar.php?userId=${u.id}" target="_blank">Bazaar</a>` : ''}</div>
                    <div class="extra-line"><span>Activity: ${u.last_action}</span><span class="sync-timer-${u.id} sync-subtext"></span></div>
                    ${u.bazaar_val > 0 ? `<div class="bazaar-line">Bazaar: <span style="color:${u.bazaar_open ? '#0f0' : '#f44'}">${u.bazaar_open ? 'Open' : 'Closed'}</span> ($${u.bazaar_val.toLocaleString()})</div>` : ''}
                    ${u.destination !== "Torn" || u.estimated_land_time > 0 ? `<div class="travel-line travel-line-${u.id}">Loc: ${u.travel_icon || ""} ${u.destination} <span class="travel-timer-${u.id}" style="color:#aaa;"></span></div>` : ''}
                </div>`;
            list.appendChild(li);
        });
        document.querySelectorAll('.gwl-sync, .check-arrival-btn').forEach(b => { b.onclick = (e) => { e.preventDefault(); syncUser(b.getAttribute('data-id')); }; });
        document.querySelectorAll('.gwl-remove').forEach(b => b.onclick = () => { watchlist = watchlist.filter(x => x.id != b.getAttribute('data-id')); saveWatchlist(); });
    }

    function addToWatchlist(id, name) {
        const cleanId = id.toString().replace(/\D/g, '');
        if (!watchlist.some(u => u.id == cleanId)) {
            const statusContainer = document.querySelector('.profile-status');
            let speed = null, icon = "";
            if (statusContainer) {
                const classList = statusContainer.className.toLowerCase();
                if (classList.includes('private')) { speed = 0.501; icon = "🛩️"; }
                else if (classList.includes('airstrip')) { speed = 0.700; icon = "🏝️"; }
                else { speed = 0.300; icon = "✈️"; }
            }
            watchlist.push({ id: cleanId, name: name.trim(), destination: "Torn", bazaar_val: 0, estimated_land_time: 0, current_tier: speed || 0.300, saved_speed: speed, travel_icon: icon, last_direction: null, last_sync: 0 });
            saveWatchlist();
            syncUser(cleanId);
            return true;
        }
        return false;
    }

    function instantGrab() {
        const idMatch = window.location.href.match(/(?:XID|userId)=(\d+)/i);
        if (idMatch) {
            let name = "";
            const selectors = ['.profile-wrapper .title-container .name', '.bazaar-title .name', '.bazaar-wrapper .name'];
            for (let s of selectors) { const el = document.querySelector(s); if (el) { name = el.textContent.trim(); break; } }
            addToWatchlist(idMatch[1], name.replace(/\s*Profile\s*$/i, "").trim() || "User " + idMatch[1]);
        }
    }

    function setupGuiInteractions(el) {
        const handles = el.querySelectorAll('.gwl-drag-handle'), resizer = el.querySelector('#gwl-resizer');
        let p1, p2, p3, p4;
        handles.forEach(h => {
            h.onmousedown = e => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'A' || e.target.classList.contains('gwl-sync')) return;
                e.preventDefault(); p3 = e.clientX; p4 = e.clientY;
                document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; GM_setValue(POS_KEY, { top: el.style.top, left: el.style.left, width: el.style.width, height: el.style.height }); };
                document.onmousemove = e => { p1 = p3 - e.clientX; p2 = p4 - e.clientY; p3 = e.clientX; p4 = e.clientY; el.style.top = (el.offsetTop - p2) + "px"; el.style.left = (el.offsetLeft - p1) + "px"; el.style.transform = "none"; };
            };
        });
        resizer.onmousedown = e => {
            e.preventDefault(); const startW = el.offsetWidth, startH = el.offsetHeight, startX = e.clientX, startY = e.clientY;
            const onMove = ee => { el.style.width = (startW + ee.clientX - startX) + 'px'; el.style.height = (startH + ee.clientY - startY) + 'px'; };
            const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); GM_setValue(POS_KEY, { top: el.style.top, left: el.style.left, width: el.style.width, height: el.style.height }); };
            window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
        };
    }

    function createMainGui() {
        if (document.getElementById('gwl-main-container')) return;
        const guiHtml = `<div id="gwl-main-container" style="display: none; top: ${pos.top}; left: ${pos.left}; width: ${pos.width}; height: ${pos.height};">
            <div class="gwl-header gwl-drag-handle"><span>Watchlist Master</span><span id="gwl-close">✖</span></div>
            <div class="gwl-section"><div class="gwl-dropdown"><div id="gwl-api-trigger">Settings ▼</div><div id="gwl-api-content" style="display: none;"><input type="text" id="gwl-api-input" class="no-autofill" placeholder="API Key" autocomplete="off"><button id="gwl-save-api">Save</button></div></div></div>
            <div class="gwl-section"><button id="gwl-instant-btn" class="add-btn grab-btn">Quick Grab & Add</button>
            <div class="manual-row"><input type="text" id="gwl-manual-name" placeholder="Name" autocomplete="off"><input type="text" id="gwl-manual-id" placeholder="ID" autocomplete="off"></div><button id="gwl-manual-btn" class="add-btn">Manual Add</button></div>
            <div class="gwl-list-container"><ul id="gwl-list"></ul></div>
            <div id="gwl-drag-bottom-left" class="gwl-drag-handle">⠿</div><div id="gwl-resizer"></div></div>`;
        document.body.insertAdjacentHTML('beforeend', guiHtml);
        const container = document.getElementById('gwl-main-container');
        setupGuiInteractions(container);
        document.getElementById('gwl-close').onclick = () => container.style.display = 'none';
        document.getElementById('gwl-api-trigger').onclick = () => { const c = document.getElementById('gwl-api-content'); c.style.display = c.style.display === 'none' ? 'flex' : 'none'; };
        document.getElementById('gwl-instant-btn').onclick = instantGrab;
        document.getElementById('gwl-save-api').onclick = () => { localStorage.setItem(API_KEY_STORAGE, document.getElementById('gwl-api-input').value); alert("Saved."); };
        document.getElementById('gwl-manual-btn').onclick = () => { const n = document.getElementById('gwl-manual-name'), i = document.getElementById('gwl-manual-id'); if(n.value && i.value) { addToWatchlist(i.value, n.value); n.value = ""; i.value = ""; } };
        renderWatchlist();
    }

    const init = setInterval(() => { if (document.querySelector('ul[class*="status-icons"]')) {
        const statusList = document.querySelector('ul[class*="status-icons"]');
        if (!document.getElementById('gwl-sidebar-icon-wrapper')) {
            const li = document.createElement('li'); li.id = 'gwl-sidebar-icon-wrapper';
            li.innerHTML = `<a id="gwl-sidebar-icon" href="#" title="Watchlist">👁️</a>`;
            li.onclick = (e) => { e.preventDefault(); const g = document.getElementById('gwl-main-container'); g.style.display = g.style.display === 'none' ? 'block' : 'none'; };
            statusList.appendChild(li);
        }
        createMainGui(); clearInterval(init);
    } }, 1000);

    GM_addStyle(`
        #gwl-main-container { position: fixed; background: #222; border: 1px solid #444; border-radius: 4px; z-index: 10001; color: #fff; font-family: Arial; display: flex; flex-direction: column; overflow: hidden; min-width: 250px; }
        .status-dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .sync-flash { background: rgba(52, 152, 219, 0.3) !important; transition: background 0.5s ease; }
        .alert-pulse { animation: pulse-red 1s infinite; border-left: 3px solid #ff4444; padding-left: 5px; }
        @keyframes pulse-red { 0% { background: transparent; } 50% { background: rgba(255, 68, 68, 0.2); } 100% { background: transparent; } }
        .gwl-header { background: #111; padding: 8px 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #444; cursor: move; font-weight: bold; }
        .gwl-section { padding: 10px; border-bottom: 1px solid #333; }
        .grab-btn { background: #28a745 !important; margin-bottom: 8px; width: 100%; color: #fff; border: none; padding: 6px; cursor: pointer; border-radius: 2px; font-weight: bold; }
        .check-arrival-btn { background: #007bff; color: white; border: none; font-size: 10px; padding: 2px 5px; cursor: pointer; border-radius: 3px; margin-left: 5px; }
        .gwl-list-container { flex-grow: 1; overflow-y: auto; background: #1a1a1a; margin-bottom: 20px; max-height: 400px; }
        .watchlist-item { padding: 10px; border-bottom: 1px solid #333; font-size: 12px; }
        .user-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .link-row { margin-bottom: 5px; font-size: 11px; }
        .link-row a { color: #3498db; text-decoration: none; }
        .extra-line { display: flex; justify-content: space-between; font-size: 10px; color: #aaa; }
        .danger { color: #ff4444; }
        .gwl-sync, .gwl-remove { cursor: pointer; }
        input { background: #000; color: #fff; border: 1px solid #444; padding: 5px; font-size: 12px; }
        .add-btn { color: #fff; border: none; padding: 6px; cursor: pointer; border-radius: 2px; background: #444; font-weight: bold; width: 100%; }
        #gwl-resizer { width: 15px; height: 15px; position: absolute; right: 0; bottom: 0; cursor: se-resize; background: linear-gradient(135deg, transparent 50%, #444 50%); }
    `);
})();