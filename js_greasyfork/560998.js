// ==UserScript==
// @name         Holotower Sidecar Mini
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Embeds a Hololive stream monitor. Mini-Version: Compact UI, Full Features.
// @author       hlggdev
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      holodex.net
// @downloadURL https://update.greasyfork.org/scripts/560998/Holotower%20Sidecar%20Mini.user.js
// @updateURL https://update.greasyfork.org/scripts/560998/Holotower%20Sidecar%20Mini.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Holotower Sidecar v3.8: Initializing...");

    // --- 1. Safe Data Loading ---
    let savedFavs = [];
    try {
        const raw = GM_getValue('holo_favorites', '[]');
        savedFavs = JSON.parse(raw);
    } catch (e) {
        console.error("Sidecar: Resetting corrupted favorites.", e);
        savedFavs = [];
        GM_setValue('holo_favorites', '[]');
    }

    const STATE = {
        apiKey: GM_getValue('holodex_key', ''),
        favorites: savedFavs,
        favoritesOnly: GM_getValue('favorites_only', false),
        activeTab: 'live',
        org: 'Hololive'
    };

    // --- 2. Styles ---
    GM_addStyle(`
        #holo-sidecar-btn {
            position: fixed !important;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            background: #2cb4ff;
            color: white;
            padding: 10px 5px;
            cursor: pointer;
            z-index: 2147483647 !important;
            border-radius: 5px 0 0 5px;
            font-family: sans-serif;
            writing-mode: vertical-rl;
            text-orientation: mixed;
            box-shadow: -2px 0 5px rgba(0,0,0,0.3);
            font-weight: bold;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            width: 25px;
            height: 90px;
            text-align: center;
            line-height: 20px;
            font-size: 12px;
        }

        #holo-sidecar-panel {
            position: fixed !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            right: -320px;
            width: 300px;
            height: 550px;
            max-height: 90vh;
            background: #1e1e1e;
            color: #ddd;
            z-index: 2147483647 !important;
            transition: right 0.3s cubic-bezier(0.25, 1, 0.5, 1);
            box-shadow: -4px 0 15px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            font-family: 'Segoe UI', sans-serif;
            font-size: 12px;
            border-radius: 8px 0 0 8px;
            border-left: 1px solid #333;
        }
        #holo-sidecar-panel.open { right: 0; }

        .holo-header {
            padding: 8px 10px;
            background: #2cb4ff;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            border-radius: 8px 0 0 0;
        }
        .holo-controls { display: flex; gap: 10px; }

        /* Interactive Star Button */
        .holo-fav-toggle {
            cursor: pointer;
            opacity: 0.5;
            transition: all 0.2s ease-in-out;
            font-size: 18px; /* Slightly larger for easier clicking */
            user-select: none;
            padding: 0 2px;
        }
        .holo-fav-toggle:hover {
            transform: scale(1.2);
            opacity: 1;
            text-shadow: 0 0 8px white;
        }
        .holo-fav-toggle.active {
            opacity: 1;
            text-shadow: 0 0 5px gold;
            color: #fff700;
        }

        .holo-tabs {
            display: flex;
            background: #252525;
            border-bottom: 1px solid #333;
        }
        .holo-tab {
            flex: 1;
            text-align: center;
            padding: 6px 0;
            cursor: pointer;
            color: #888;
            font-weight: bold;
            font-size: 11px;
            transition: color 0.2s;
            user-select: none;
        }
        .holo-tab:hover { color: #ccc; }
        .holo-tab.active {
            color: #2cb4ff;
            border-bottom: 2px solid #2cb4ff;
            background: #2a2a2a;
        }

        .holo-content { flex: 1; overflow-y: auto; padding: 8px; }

        .holo-stream-card {
            display: flex;
            background: #2a2a2a;
            margin-bottom: 6px;
            border-radius: 4px;
            overflow: hidden;
            cursor: pointer;
            transition: background 0.2s;
            height: 48px;
        }
        .holo-stream-card:hover { background: #3a3a3a; }
        .holo-thumb {
            width: 85px;
            height: 48px;
            object-fit: cover;
            flex-shrink: 0;
        }
        .holo-info {
            padding: 2px 6px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            overflow: hidden;
            width: 100%;
        }
        .holo-title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bold;
            color: #fff;
            font-size: 11px;
            line-height: 1.2;
        }
        .holo-channel { font-size: 10px; color: #bbb; line-height: 1.2; }
        .holo-meta { font-size: 9px; margin-top: 2px; }
        .meta-live { color: #ff6b6b; }
        .meta-upcoming { color: #4cd137; }

        .holo-settings { padding: 10px; }
        .holo-input {
            width: 100%;
            padding: 6px;
            margin: 5px 0;
            background: #333;
            border: 1px solid #555;
            color: white;
            box-sizing: border-box;
            font-size: 11px;
        }
        .holo-btn {
            background: #2cb4ff;
            border: none;
            color: white;
            padding: 4px 8px;
            cursor: pointer;
            border-radius: 3px;
            width: 100%;
            margin-top: 5px;
            font-size: 11px;
        }
        .holo-btn.secondary { background: #444; }
        .holo-btn.delete { background: #ff4444; width: auto; font-size: 9px; padding: 2px 6px; margin: 0; }

        .fav-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px;
            background: #252525;
            border-bottom: 1px solid #333;
            font-size: 11px;
        }
        .search-result {
            padding: 6px;
            background: #333;
            border-bottom: 1px solid #444;
            cursor: pointer;
            font-size: 11px;
        }
        .search-result:hover { background: #444; }

        .holo-footer {
            padding: 8px;
            display: flex;
            gap: 5px;
            background: #1e1e1e;
            border-top: 1px solid #333;
            border-radius: 0 0 0 8px;
        }
        .close-btn { cursor: pointer; }
    `);

    // --- 3. UI Persistence ---
    function ensureUI() {
        if (!document.body) return;
        let btn = document.getElementById('holo-sidecar-btn');
        if (!btn) {
            btn = document.createElement('div');
            btn.id = 'holo-sidecar-btn';
            btn.innerText = 'HOLODEX';
            document.body.appendChild(btn);
            btn.addEventListener('click', togglePanel);
        }
        let panel = document.getElementById('holo-sidecar-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'holo-sidecar-panel';
            document.body.appendChild(panel);
            // Single Master Listener (No Duplicates)
            panel.addEventListener('click', handlePanelClick);
            renderMainUI(panel);
        }
    }

    // --- 4. Event Handling (Clean Delegation) ---
    function handlePanelClick(e) {
        // Find closest element matching selector to handle clicks on icons/text
        const target = e.target;

        // 1. Close Button
        if (target.closest('.close-btn')) {
            togglePanel(e);
            return;
        }

        // 2. Favorites Toggle (The problematic one)
        const favBtn = target.closest('#holo-fav-toggle');
        if (favBtn) {
            console.log("Sidecar: Fav toggle clicked");
            toggleFavorites(e);
            return;
        }

        // 3. Tabs
        if (target.closest('#tab-live')) { switchTab('live'); return; }
        if (target.closest('#tab-upcoming')) { switchTab('upcoming'); return; }

        // 4. Footer & Settings
        if (target.closest('#holo-refresh')) { loadStreams(); return; }
        if (target.closest('#holo-settings-btn')) { renderSettingsUI(); return; }
        if (target.closest('#holo-back-btn')) {
            renderMainUI(document.getElementById('holo-sidecar-panel'));
            loadStreams();
            return;
        }
        if (target.closest('#holo-save-key')) {
            const val = document.getElementById('holo-api-input').value.trim();
            if(val) { GM_setValue('holodex_key', val); STATE.apiKey = val; alert('Key Saved!'); }
            return;
        }
    }

    // --- Core Functions ---
    function togglePanel(e) {
        if(e) e.stopPropagation();
        const panel = document.getElementById('holo-sidecar-panel');
        if(!panel) return;
        if (panel.classList.contains('open')) {
            panel.classList.remove('open');
        } else {
            panel.classList.add('open');
            renderMainUI(panel);
            loadStreams();
        }
    }

    function switchTab(tabName) {
        STATE.activeTab = tabName;
        const panel = document.getElementById('holo-sidecar-panel');
        renderMainUI(panel);
        loadStreams();
    }

    function renderMainUI(panel) {
        if(!panel) panel = document.getElementById('holo-sidecar-panel');
        if(!panel) return;

        const titleText = STATE.favoritesOnly ? 'Sidecar (Favs)' : `Sidecar (${STATE.org})`;
        const favClass = STATE.favoritesOnly ? 'active' : '';
        const liveTabClass = STATE.activeTab === 'live' ? 'active' : '';
        const upTabClass = STATE.activeTab === 'upcoming' ? 'active' : '';

        // Clean Render: We DO NOT attach event listeners here anymore.
        // They are all handled by handlePanelClick attached in ensureUI.
        if(!panel.innerHTML.trim()) {
             panel.innerHTML = `
                <div class="holo-header">
                    <span id="holo-header-title">${titleText}</span>
                    <div class="holo-controls">
                        <span id="holo-fav-toggle" class="holo-fav-toggle ${favClass}" title="Toggle Favorites Only">★</span>
                        <span class="close-btn">✖</span>
                    </div>
                </div>
                <div class="holo-tabs">
                    <div id="tab-live" class="holo-tab ${liveTabClass}">LIVE NOW</div>
                    <div id="tab-upcoming" class="holo-tab ${upTabClass}">UPCOMING</div>
                </div>
                <div class="holo-content" id="holo-list">
                    <div style="text-align:center; padding: 20px;">Loading...</div>
                </div>
                <div class="holo-footer">
                    <button id="holo-refresh" class="holo-btn secondary">Refresh</button>
                    <button id="holo-settings-btn" class="holo-btn secondary">Settings</button>
                </div>
            `;
        } else {
            // Update Existing Elements
            const titleEl = document.getElementById('holo-header-title');
            if(titleEl) titleEl.innerText = titleText;

            const starEl = document.getElementById('holo-fav-toggle');
            if(starEl) {
                if(STATE.favoritesOnly) {
                    if(!starEl.classList.contains('active')) starEl.classList.add('active');
                } else {
                    if(starEl.classList.contains('active')) starEl.classList.remove('active');
                }
            }

            const tabL = document.getElementById('tab-live');
            const tabU = document.getElementById('tab-upcoming');
            if(tabL && tabU) {
                tabL.className = `holo-tab ${liveTabClass}`;
                tabU.className = `holo-tab ${upTabClass}`;
            }
        }
    }

    function renderSettingsUI() {
        const list = document.getElementById('holo-list');
        list.innerHTML = `
            <div class="holo-settings">
                <h4>API Key</h4>
                <input type="text" id="holo-api-input" class="holo-input" placeholder="Holodex API Key" value="${STATE.apiKey}">
                <button id="holo-save-key" class="holo-btn">Save Key</button>
                <hr style="border-color:#333; margin: 10px 0;">
                <h4>Manage Favorites</h4>
                <input type="text" id="holo-search-input" class="holo-input" placeholder="Search (e.g. Pekora)">
                <div id="holo-search-results"></div>
                <h5 style="margin-top:10px;">Your List (${STATE.favorites.length})</h5>
                <div id="holo-fav-list"></div>
                <button id="holo-back-btn" class="holo-btn secondary" style="margin-top:15px;">Back to Streams</button>
            </div>
        `;

        let searchTimeout;
        const searchInput = document.getElementById('holo-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                if(query.length < 2) return;
                searchTimeout = setTimeout(() => { doChannelSearch(query); }, 500);
            });
        }
        renderFavList();
    }

    function renderFavList() {
        const container = document.getElementById('holo-fav-list');
        if(!container) return;
        container.innerHTML = '';
        if(STATE.favorites.length === 0) {
            container.innerHTML = '<div style="font-size:10px; color:#666; font-style:italic;">No favorites added yet.</div>';
            return;
        }
        STATE.favorites.forEach((chan, idx) => {
            const div = document.createElement('div');
            div.className = 'fav-item';
            div.innerHTML = `<span>${chan.name}</span><button class="holo-btn delete">Remove</button>`;
            div.querySelector('button').addEventListener('click', () => {
                STATE.favorites.splice(idx, 1);
                GM_setValue('holo_favorites', JSON.stringify(STATE.favorites));
                renderFavList();
            });
            container.appendChild(div);
        });
    }

    function doChannelSearch(query) {
        if(!STATE.apiKey) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://holodex.net/api/v2/search/autocomplete?q=${encodeURIComponent(query)}`,
            headers: { "X-APIKEY": STATE.apiKey },
            onload: function(res) {
                try {
                    const data = JSON.parse(res.responseText);
                    const resultsDiv = document.getElementById('holo-search-results');
                    resultsDiv.innerHTML = '';
                    const channels = data.filter(item => item.type === 'channel').slice(0, 5);
                    if(channels.length === 0) { resultsDiv.innerHTML = 'No channels found.'; return; }
                    channels.forEach(ch => {
                        const row = document.createElement('div');
                        row.className = 'search-result';
                        row.innerHTML = `+ ${ch.text || ch.name}`;
                        row.addEventListener('click', () => {
                            addFavorite(ch.value || ch.id, ch.text || ch.name);
                            document.getElementById('holo-search-input').value = '';
                            resultsDiv.innerHTML = '';
                        });
                        resultsDiv.appendChild(row);
                    });
                } catch(e) {}
            }
        });
    }

    function addFavorite(id, name) {
        if(STATE.favorites.some(f => f.id === id)) return;
        STATE.favorites.push({ id, name });
        GM_setValue('holo_favorites', JSON.stringify(STATE.favorites));
        renderFavList();
    }

    // --- FETCHING LOGIC ---
    function loadStreams() {
        if (!STATE.apiKey) { renderSettingsUI(); return; }
        const list = document.getElementById('holo-list');
        if(!list) return;
        list.innerHTML = '<div style="text-align:center; padding: 20px;">Fetching streams...</div>';

        if (STATE.favoritesOnly) fetchFavoritesOnly(list);
        else fetchGlobal(list);
    }

    function fetchGlobal(listElement) {
        const status = STATE.activeTab === 'upcoming' ? 'upcoming' : 'live';
        const url = `https://holodex.net/api/v2/live?org=${STATE.org}&status=${status}&type=stream&limit=50`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { "X-APIKEY": STATE.apiKey },
            onload: function(response) {
                if (response.status === 200) {
                    try { renderStreams(JSON.parse(response.responseText)); }
                    catch(e) { listElement.innerHTML = 'Error parsing JSON'; }
                } else listElement.innerHTML = `API Error: ${response.status}`;
            }
        });
    }

    function fetchFavoritesOnly(listElement) {
        if(STATE.favorites.length === 0) {
            listElement.innerHTML = '<div style="text-align:center; padding:20px;">Your favorites list is empty!</div>';
            return;
        }
        const status = STATE.activeTab === 'upcoming' ? 'upcoming' : 'live';
        let completedRequests = 0;
        let allStreams = [];
        const totalRequests = STATE.favorites.length;
        STATE.favorites.forEach(fav => {
            const url = `https://holodex.net/api/v2/live?channel_id=${fav.id}&status=${status}&type=stream`;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "X-APIKEY": STATE.apiKey },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if(Array.isArray(data)) allStreams = allStreams.concat(data);
                        } catch(e) {}
                    }
                },
                onloadend: function() {
                    completedRequests++;
                    if(completedRequests === totalRequests) {
                        const uniqueStreams = Array.from(new Map(allStreams.map(item => [item.id, item])).values());
                        renderStreams(uniqueStreams);
                    }
                }
            });
        });
    }

    // --- FILTERS (JAPANESE NAMES INCLUDED) ---
    const HOLOSTARS_BLACKLIST = [
        "HOLOSTARS", "UPROAR", "TEMPUS", "ARMIS",
        "MIYABI", "HANASAKI", "花咲みやび", "みやび",
        "IZURU", "KANADE", "奏手イヅル", "イヅル",
        "ARURAN", "ARURANDEISU", "アルランディス", "アルラン",
        "RIKKA", "律可",
        "ASTEL", "LEDA", "アステル", "レダ",
        "TEMMA", "KISHIDO", "岸堂天真", "天真",
        "ROBERU", "YUKOKU", "夕刻ロベル", "ロベル",
        "SHIEN", "KAGEYAMA", "影山シエン", "シエン",
        "OGA", "ARAGAMI", "荒咬オウガ", "オウガ",
        "FUMA", "YATOGAMI", "夜十神封魔", "封魔",
        "UYU", "UTSUGI", "羽継烏有", "烏有",
        "GAMMA", "HIZAKI", "緋崎ガンマ", "ガンマ",
        "RIO", "MINASE", "水無世燐央", "燐央",
        "ALTARE", "AXEL", "HAKKA", "SHINRI", "BETTEL", "FLAYON",
        "JURARD", "GOLDBULLET", "OCTAVIO", "CRIMZON"
    ];

    function isFreeChat(title) {
        if (!title) return false;
        return /free\s*chat|chat\s*room|フリーチャット|ふりーちゃっと|待機所/i.test(title);
    }

    function isHolostars(stream) {
        if (!stream.channel) return false;
        if (stream.channel.org === 'Holostars') return true;
        if (stream.channel.group && stream.channel.group.toLowerCase().includes('holostars')) return true;
        const channelName = (stream.channel.name || "").toUpperCase();
        for (const keyword of HOLOSTARS_BLACKLIST) {
            if (channelName.includes(keyword)) return true;
        }
        return false;
    }

    function formatStartTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const diffMs = date - now;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        let relative = "";
        if (diffMins < 0) relative = "Started";
        else if (diffMins < 60) relative = `in ${diffMins} min`;
        else relative = `in ${diffHours}h ${diffMins % 60}m`;
        return `${timeStr} <span style="color:#888;">(${relative})</span>`;
    }

    function renderStreams(streams) {
        const list = document.getElementById('holo-list');
        if(!list) return;
        list.innerHTML = '';
        if (!Array.isArray(streams) || streams.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:20px;">Nothing found here :(</div>`;
            return;
        }
        const filteredStreams = streams.filter(s => !isFreeChat(s.title) && !isHolostars(s));
        if (filteredStreams.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding:20px;">No streams found (All hidden by filters)</div>`;
            return;
        }

        if (STATE.activeTab === 'live') {
            filteredStreams.sort((a, b) => (b.live_viewers || 0) - (a.live_viewers || 0));
        } else {
            filteredStreams.sort((a, b) => new Date(a.start_scheduled) - new Date(b.start_scheduled));
        }

        filteredStreams.forEach(stream => {
            const card = document.createElement('div');
            card.className = 'holo-stream-card';
            const thumbUrl = `https://i.ytimg.com/vi/${stream.id}/mqdefault.jpg`;
            let metaHtml = "";
            if (STATE.activeTab === 'live') {
                const viewers = stream.live_viewers
                    ? (stream.live_viewers > 1000 ? (stream.live_viewers / 1000).toFixed(1) + 'k' : stream.live_viewers)
                    : 'WAIT';
                metaHtml = `<div class="holo-meta meta-live">● ${viewers} Viewers</div>`;
            } else {
                const timeDisplay = formatStartTime(stream.start_scheduled);
                metaHtml = `<div class="holo-meta meta-upcoming">▶ ${timeDisplay}</div>`;
            }

            card.innerHTML = `
                <img src="${thumbUrl}" class="holo-thumb" loading="lazy">
                <div class="holo-info">
                    <div class="holo-title" title="${stream.title}">${stream.title}</div>
                    <div class="holo-channel">${stream.channel.name}</div>
                    ${metaHtml}
                </div>
            `;
            card.addEventListener('click', () => { window.open(`https://www.youtube.com/watch?v=${stream.id}`, '_blank'); });
            list.appendChild(card);
        });
    }

    function toggleFavorites(e) {
        if(e) e.stopPropagation();
        STATE.favoritesOnly = !STATE.favoritesOnly;
        GM_setValue('favorites_only', STATE.favoritesOnly);
        const panel = document.getElementById('holo-sidecar-panel');
        // Force header update immediately
        renderMainUI(panel);
        loadStreams();
    }

    // --- GLOBAL Click Outside (To Close) ---
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('holo-sidecar-panel');
        const btn = document.getElementById('holo-sidecar-btn');
        if (!panel || !btn || !panel.classList.contains('open')) return;
        // Fix for removed elements (e.g. clicking something that disappears instantly)
        if (!document.body.contains(event.target)) return;

        if (!panel.contains(event.target) && !btn.contains(event.target)) {
            panel.classList.remove('open');
        }
    });

    setInterval(ensureUI, 2000);
    ensureUI();

})();