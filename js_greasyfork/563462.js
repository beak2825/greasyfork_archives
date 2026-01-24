// ==UserScript==
// @name         Torn Global Watchlist Flight tracking complete
// @namespace    http://tampermonkey.net/
// @version      8.2
// @description  Watchlist with improved flight state logic and Bridge support.
// @author       Gemini
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/563462/Torn%20Global%20Watchlist%20Flight%20tracking%20complete.user.js
// @updateURL https://update.greasyfork.org/scripts/563462/Torn%20Global%20Watchlist%20Flight%20tracking%20complete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY_STORAGE = "TornWatchlist_GlobalAPIKey";
    const STORAGE_KEY = "TornGlobalWatchlist";
    const POS_KEY = "TornWatchlistPos";
    const BRIDGE_KEY = "TornWatchlist_Bridge";

    const BASE_FLIGHT_TIMES = {
        "Mexico": 26, "Cayman Islands": 35, "Canada": 41, "Hawaii": 134,
        "United Kingdom": 159, "Argentina": 167, "Switzerland": 175,
        "Japan": 225, "China": 242, "UAE": 271, "South Africa": 297
    };

    let watchlist = GM_getValue(STORAGE_KEY, []);
    let pos = GM_getValue(POS_KEY, { top: "15%", left: "50%", width: "350px", height: "auto" });

    function getApiKey() { return localStorage.getItem(API_KEY_STORAGE); }
    function saveWatchlist() {
    GM_setValue(STORAGE_KEY, watchlist);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist)); // This line triggers the update in other tabs
    renderWatchlist();
}

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
function getTravelIcon(speed) {
    if (speed === 0.501) return "🛩️"; // Private
    if (speed === 0.700) return "🏝️"; // Airstrip
    if (speed === 0.300) return "✈️"; // Business/Airliner
    return "🛫"; // Standard/Default
}
    async function getMarketMap(apiKey) {
        const cacheRaw = localStorage.getItem('mug_market_cache');
        const ts = Number(localStorage.getItem('mug_market_ts') || 0);
        if (cacheRaw && (Date.now() - ts) < 3600000) {
            try { return JSON.parse(cacheRaw); } catch (e) {}
        }
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/torn/?selections=items&key=${apiKey}`,
                onload: (r) => {
                    try {
                        const data = JSON.parse(r.responseText);
                        const map = {};
                        for (const id in data.items) map[id] = data.items[id].market_value || 0;
                        localStorage.setItem('mug_market_cache', JSON.stringify(map));
                        localStorage.setItem('mug_market_ts', String(Date.now()));
                        resolve(map);
                    } catch (e) { resolve({}); }
                }
            });
        });
    }

async function syncUser(id) {
    const apiKey = getApiKey();
    if (!apiKey) return;

    // --- Clinical Scraper: Detect tier from profile classes ---
    let verifiedSpeed = null;
    const statusContainer = document.querySelector('.profile-status');
    if (statusContainer && window.location.href.includes(`XID=${id}`)) {
        const cls = statusContainer.className.toLowerCase();
        if (cls.includes('private')) verifiedSpeed = 0.501;
        else if (cls.includes('airstrip')) verifiedSpeed = 0.700;
        else if (cls.includes('airliner')) verifiedSpeed = 0.300;
    }

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
                const u = watchlist[idx];

                // Lock verified speed
                if (verifiedSpeed) u.saved_speed = verifiedSpeed;

                u.name = data.name || u.name;
                u.last_sync = Date.now(); // Captured for the "Synced X ago" timer
                u.last_action_relative = data.last_action.relative; // Vague string (e.g. 1hr ago)
                u.last_action_ts = data.last_action.timestamp; // Precise Unix heartbeat
                u.state = data.status.state;
                u.until = data.status.until || 0;
                u.revivable = data.revivable === 1;
                u.status_color = data.last_action.status;
                u.status = (u.state === "Hospital" || u.state === "Jail")
                    ? (data.status.description || "Okay").replace(/\sfor\s.*$/i, "").trim()
                    : (data.status.description || "Okay");

                const travelMatch = u.status.match(/(Traveling to|Returning to Torn from)\s+([A-Za-z\s]+)/i);
                if (travelMatch) {
                    const direction = travelMatch[1].toLowerCase();
                    const country = travelMatch[2].trim();
                    const baseMins = BASE_FLIGHT_TIMES[country] || 0;

                    const isNewFlight = (u.destination !== country) || (u.last_direction !== direction);
                    const isExpired = u.estimated_land_time > 0 && (now > (u.estimated_land_time + 300));

                    // NEW: Force update if we just verified a speed that differs from the current estimation
                    const needsSpeedCorrection = verifiedSpeed && (u.current_tier !== verifiedSpeed);

                    if (isNewFlight || isExpired || !u.estimated_land_time || needsSpeedCorrection) {
                        u.destination = country;
                        u.last_direction = direction;
                        // Only use current timestamp if it's a brand new flight, otherwise keep the original start
                        if (!u.travel_start_ts || isNewFlight) u.travel_start_ts = data.last_action.timestamp;

                        u.current_tier = verifiedSpeed || u.saved_speed || 0.300;
                        u.estimated_land_time = u.travel_start_ts + (baseMins * 60 * u.current_tier);
                    }
                } else {
                    u.destination = "Torn";
                    u.last_direction = null;
                    u.estimated_land_time = 0;
                    u.travel_start_ts = 0;
                }

                let bVal = 0;
                const bItems = Array.isArray(data.bazaar) ? data.bazaar : Object.values(data.bazaar || {});
                bItems.forEach(item => bVal += ((marketMap[item.ID] || 0) * (item.quantity || 1)));
                u.bazaar_val = bVal;
                u.bazaar_open = (bVal > 0) || u.status.toLowerCase().includes("bazaar");

                saveWatchlist();
            } catch (e) { console.error("Sync error", e); }
        }
    });
}
    // --- Bridge Listener ---
    setInterval(() => {
        const bridgeData = localStorage.getItem(BRIDGE_KEY);
        if (bridgeData) {
            try {
                const queue = JSON.parse(bridgeData);
                if (Array.isArray(queue)) queue.forEach(item => item.id && addToWatchlist(item.id, item.name));
                localStorage.removeItem(BRIDGE_KEY);
            } catch(e) {}
        }
    }, 2000);

setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        watchlist.forEach(u => {
            // Hospital/Jail Timer
            if ((u.state === "Hospital" || u.state === "Jail") && u.until > now) {
                const el = document.querySelector(".hosp-timer-" + u.id);
                if (el) el.textContent = " (" + formatTimeElapsed((u.until - now) * 1000) + " left)";
            }

            // Flight Timer & Auto Step-Up
            if (u.estimated_land_time > 0) {
                const baseMins = BASE_FLIGHT_TIMES[u.destination] || 0;

                // AUTO STEP-UP: If Business time + 10m passes, assume Standard (1.0)
                if (u.current_tier === 0.300 && now > (u.estimated_land_time + 600)) {
                    u.current_tier = 1.000;
                    u.estimated_land_time = u.travel_start_ts + (baseMins * 60 * 1.000);
                    saveWatchlist();
                }

                const rem = u.estimated_land_time - now;
                const el = document.querySelector(".travel-timer-" + u.id);
                const row = document.querySelector(".travel-line-" + u.id);

                if (el) {
                    const s = u.current_tier;
                    const tierName = (s === 0.3) ? "Business" : (s === 0.501 ? "Private" : (s === 0.7 ? "Airstrip" : "Standard"));
                    const verTag = u.saved_speed ? "[Verified]" : "[Estimated]";

                    if (rem > 0) {
                        el.textContent = ` (Est. ${formatTimeElapsed(rem * 1000)} left - ${tierName} ${verTag})`;
                        if (row) row.classList.remove("alert-pulse");
                    } else {
                        el.innerHTML = ` <button class="check-arrival-btn" data-id="${u.id}">Check Arrival</button>`;
                        if (row) row.classList.add("alert-pulse");
                    }
               if (u.last_sync > 0) {
                    const elapsed = Date.now() - u.last_sync;
                    const syncEl = document.querySelector(".sync-timer-" + u.id);
               if (syncEl) syncEl.textContent = "Synced " + formatTimeElapsed(elapsed) + " ago";
                }
                }
            }

            // Sync Age Timer
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
    const now = Math.floor(Date.now() / 1000);

    const getTier = (u) => {
        const inTorn = u.destination === "Torn";
        const isOkay = u.state === "Okay"; // Explicitly checking for 'Okay' status
        const hasTimers = (u.estimated_land_time > 0 || u.state === "Hospital" || u.state === "Jail");
        const hasMoney = (u.bazaar_val > 0 || (u.cash_on_hand || 0) > 0);

        // Tier 1: In Torn + Okay + Bazaar Open
        if (inTorn && isOkay && u.bazaar_open) return 4;

        // Tier 2: Active Timers (includes those in Hospital with open bazaars)
        if (hasTimers) return 3;

        // Tier 3: Idle targets with accumulated cash or stock
        if (hasMoney) return 2;

        // Tier 4: Zero activity/value
        return 1;
    };

    const tierA = getTier(a);
    const tierB = getTier(b);

    if (tierA !== tierB) return tierB - tierA;

    // Secondary Sorts
    if (tierA === 4 || tierA === 2) {
        // Tiers 1 & 3: Highest Cash on Hand first
        return (b.cash_on_hand || 0) - (a.cash_on_hand || 0);
    }

    if (tierA === 3) {
        // Tier 2: Soonest arrival/release first
        const timeA = a.estimated_land_time > 0 ? a.estimated_land_time : a.until;
        const timeB = b.estimated_land_time > 0 ? b.estimated_land_time : b.until;
        return (timeA || 9999999999) - (timeB || 9999999999);
    }

    return (a.last_sync || 0) - (b.last_sync || 0);
});
        list.innerHTML = watchlist.length ? "" : "<li style='padding:10px; text-align:center;'>List Empty</li>";
        watchlist.forEach(u => {
            const li = document.createElement('li');
            li.className = `watchlist-item watchlist-item-${u.id}`;
            const dotColor = getStatusColor(u.status_color);
            li.innerHTML = `
                <div class="user-row">
                    <div class="user-main"><span class="status-dot" style="background:${dotColor}"></span><strong>${u.name}</strong> [${u.id}] <span style="color:${u.revivable ? '#ffff00' : '#ff4444'}">♥</span></div>
                    <div class="user-actions"><span class="gwl-sync" data-id="${u.id}">🔄</span><span class="gwl-remove" data-id="${u.id}">✖</span></div>
                </div>
                <div class="info-grid">
                    <div class="status-line ${u.state === 'Hospital' ? 'danger' : ''}">${u.status}<span class="hosp-timer-${u.id}"></span></div>
                    <div class="link-row">
                        <a href="/profiles.php?XID=${u.id}" target="_blank">Profile</a> |
                        <a href="/loader.php?sid=attack&user2ID=${u.id}" target="_blank">Attack</a>
                        ${u.bazaar_val > 0 ? ` | <a href="/bazaar.php?userId=${u.id}" target="_blank">Bazaar</a>` : ''}
                    </div>
                   <div class="extra-line" style="display: flex; justify-content: space-between;">
                        <span>Activity: ${formatTimeElapsed(Date.now() - (u.last_action_ts * 1000))} ago</span>
                        <span class="sync-timer-${u.id}" style="color: #888; font-size: 10px; text-align: right;"></span>
                   </div>
                    ${u.bazaar_val > 0 ? `<div class="bazaar-line">Bazaar: <span style="color:${u.bazaar_open ? '#0f0' : '#f44'}">${u.bazaar_open ? 'Open' : 'Closed'}</span> ($${u.bazaar_val.toLocaleString()})</div>` : ''}
                   ${u.destination !== "Torn" || u.estimated_land_time > 0 ?
    `<div class="travel-line travel-line-${u.id}">
        Loc: ${getTravelIcon(u.current_tier)} ${u.destination}
        <span class="travel-timer-${u.id}" style="color:#aaa;"></span>
    </div>` : ''}
                </div>`;
            list.appendChild(li);
        });
        document.querySelectorAll('.gwl-sync, .check-arrival-btn').forEach(b => b.onclick = () => syncUser(b.getAttribute('data-id')));
        document.querySelectorAll('.gwl-remove').forEach(b => b.onclick = () => { watchlist = watchlist.filter(x => x.id != b.getAttribute('data-id')); saveWatchlist(); });
    }

    function addToWatchlist(id, name) {
        const cleanId = id.toString().replace(/\D/g, '');
        if (!watchlist.some(u => u.id == cleanId)) {
            watchlist.push({ id: cleanId, name: (name || "User " + id).trim(), destination: "Torn", bazaar_val: 0, estimated_land_time: 0, last_sync: 0 });
            saveWatchlist();
            syncUser(cleanId);
        }
    }

    function createMainGui() {
        if (document.getElementById('gwl-main-container')) return;
        const guiHtml = `<div id="gwl-main-container" style="display: none; top: ${pos.top}; left: ${pos.left}; width: ${pos.width}; height: ${pos.height};">
            <div class="gwl-header gwl-drag-handle"><span>Watchlist Master</span><span id="gwl-close">✖</span></div>
            <div class="gwl-section">
                <div class="gwl-dropdown">
                    <div id="gwl-api-trigger" style="cursor:pointer; font-size:12px; margin-bottom:5px;">Settings ▼</div>
                    <div id="gwl-api-content" style="display: none; flex-direction:column; gap:5px;">
                        <input type="text" id="gwl-api-input" placeholder="API Key" autocomplete="off" style="width:100%; box-sizing:border-box;">
                        <button id="gwl-save-api" class="add-btn">Save API</button>
                    </div>
                </div>
            </div>
            <div class="gwl-section">
                <button id="gwl-instant-btn" class="grab-btn">Quick Grab & Add</button>
                <div class="manual-row" style="display:flex; gap:5px; margin-top:5px;">
                    <input type="text" id="gwl-manual-name" placeholder="Name" autocomplete="off" style="width:50%;">
                    <input type="text" id="gwl-manual-id" placeholder="ID" autocomplete="off" style="width:50%;">
                </div>
                <button id="gwl-manual-btn" class="add-btn" style="margin-top:5px;">Manual Add</button>
            </div>
            <div class="gwl-list-container"><ul id="gwl-list"></ul></div>
            <div id="gwl-drag-bottom-left" class="gwl-drag-handle" style="position: absolute; bottom: 0; left: 0; padding: 0 5px; cursor: move; color: #444; font-size: 14px;">⠿</div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', guiHtml);
        const container = document.getElementById('gwl-main-container');

        // Close & Dropdown
        document.getElementById('gwl-close').onclick = () => container.style.display = 'none';
        document.getElementById('gwl-api-trigger').onclick = () => {
            const c = document.getElementById('gwl-api-content');
            c.style.display = c.style.display === 'none' ? 'flex' : 'none';
        };
        document.getElementById('gwl-save-api').onclick = () => {
            localStorage.setItem(API_KEY_STORAGE, document.getElementById('gwl-api-input').value);
            alert("API Key Saved locally.");
        };

        // Add Functions
        document.getElementById('gwl-instant-btn').onclick = () => {
            const idMatch = window.location.href.match(/(?:XID|userId)=(\d+)/i);
            if (idMatch) {
                const nameEl = document.querySelector('.profile-wrapper .title-container .name');
                addToWatchlist(idMatch[1], nameEl ? nameEl.textContent : "User " + idMatch[1]);
            }
        };
        document.getElementById('gwl-manual-btn').onclick = () => {
            const n = document.getElementById('gwl-manual-name'), i = document.getElementById('gwl-manual-id');
            if (n.value && i.value) { addToWatchlist(i.value, n.value); n.value = ""; i.value = ""; }
        };

        // Dragging & Resizing
        const handles = container.querySelectorAll('.gwl-drag-handle');
        handles.forEach(h => {
            h.onmousedown = e => {
        // Prevent dragging if clicking buttons/inputs
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'A') return;

        let px = e.clientX, py = e.clientY;
        document.onmousemove = ev => {
            container.style.left = (container.offsetLeft + (ev.clientX - px)) + "px";
            container.style.top = (container.offsetTop + (ev.clientY - py)) + "px";
            px = ev.clientX; py = ev.clientY;
            container.style.transform = "none"; // Clean up any centering transforms
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            GM_setValue(POS_KEY, { top: container.style.top, left: container.style.left, width: container.style.width, height: container.style.height });
        };
    };
});

        renderWatchlist();
    }

    const init = setInterval(() => {
        if (document.querySelector('ul[class*="status-icons"]')) {
            const statusList = document.querySelector('ul[class*="status-icons"]');
            if (!document.getElementById('gwl-sidebar-icon-wrapper')) {
                const li = document.createElement('li'); li.id = 'gwl-sidebar-icon-wrapper';
                li.innerHTML = `<a id="gwl-sidebar-icon" href="#" title="Watchlist" style="font-size:18px;">👁️</a>`;
                li.onclick = (e) => { e.preventDefault(); const g = document.getElementById('gwl-main-container'); g.style.display = g.style.display === 'none' ? 'flex' : 'none'; };
                statusList.appendChild(li);
                createMainGui();
            }
            clearInterval(init);
        }
    }, 1000);

    GM_addStyle(`
        #gwl-main-container { position: fixed; background: #222; border: 1px solid #444; border-radius: 4px; z-index: 10001; color: #fff; font-family: Arial; display: flex; flex-direction: column; overflow: hidden; min-width: 250px; }
        .status-dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .alert-pulse { animation: pulse-red 1s infinite; border-left: 3px solid #ff4444; padding-left: 5px; }
        @keyframes pulse-red { 0% { background: transparent; } 50% { background: rgba(255, 68, 68, 0.2); } 100% { background: transparent; } }
        .gwl-header { background: #111; padding: 8px 12px; display: flex; justify-content: space-between; border-bottom: 1px solid #444; cursor: move; font-weight: bold; }
        .gwl-section { padding: 10px; border-bottom: 1px solid #333; }
        .grab-btn { background: #28a745 !important; width: 100%; color: #fff; border: none; padding: 6px; cursor: pointer; border-radius: 2px; font-weight: bold; }
        .add-btn { background: #444; color: #fff; border: none; padding: 6px; cursor: pointer; border-radius: 2px; width: 100%; }
        .gwl-list-container { flex-grow: 1; overflow-y: auto; background: #1a1a1a; max-height: 400px; }
        .watchlist-item { padding: 10px; border-bottom: 1px solid #333; font-size: 12px; }
        .user-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .link-row a { color: #3498db; text-decoration: none; font-size: 11px; }
        .extra-line { font-size: 10px; color: #aaa; }
        .danger { color: #ff4444; }
        .gwl-sync, .gwl-remove { cursor: pointer; margin-left: 5px; }
        input { background: #000; color: #fff; border: 1px solid #444; padding: 5px; font-size: 12px; }
        #gwl-drag-bottom-left {
            user-select: none;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        #gwl-drag-bottom-left:hover {
            opacity: 1;
        }
        #gwl-resizer { width: 15px; height: 15px; position: absolute; right: 0; bottom: 0; cursor: se-resize; background: linear-gradient(135deg, transparent 50%, #444 50%); }
        .check-arrival-btn { background: #007bff; color: white; border: none; font-size: 10px; padding: 2px 5px; cursor: pointer; border-radius: 3px; }
    `);
    window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
        watchlist = JSON.parse(e.newValue || "[]");
        renderWatchlist(); // Refresh the list view in this tab
    }
});
})();