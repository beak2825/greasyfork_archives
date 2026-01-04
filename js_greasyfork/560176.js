// ==UserScript==
// @name:en      Linux.do Like Counter
// @name         Linux.do 点赞计数器
// @namespace    https://linux.do/
// @version      1.4
// @description:en  Tracks available likes/reactions on linux.do.
// @description     显示 linux.do 上的可用点赞数。
// @author       ChiGamma
// @license      Fair License
// @match        https://linux.do/t/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560176/Linuxdo%20%E7%82%B9%E8%B5%9E%E8%AE%A1%E6%95%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560176/Linuxdo%20%E7%82%B9%E8%B5%9E%E8%AE%A1%E6%95%B0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HOST: window.location.origin,
        SYNC_INTERVAL: 30 * 60 * 1000,
        STORAGE_KEY: 'linuxdo_likes_history',
        LIMITS: { 0: 50, 1: 50, 2: 75, 3: 100, 4: 150 },
        MAX_STORED_ITEMS: 500,
        FETCH_TIMEOUT: 5000,
        MAX_RETRIES: 2,
        RETRY_DELAY: 30 * 1000
    };

    const console = unsafeWindow.console;
    let state = { timestamps: [], cooldownUntil: 0, lastSync: 0, matched: false };
    let currentUser = null;
    let uiUpdateTimer = null;
    let cooldownTicker = null;
    let isSyncing = false;
    let isInitialized = false;

    // --- Persistence ---
    function loadState() {
        const stored = GM_getValue(CONFIG.STORAGE_KEY, "{}");
        try {
            const parsed = JSON.parse(stored);
            state = { ...state, ...parsed };
            if (state.timestamps.length > CONFIG.MAX_STORED_ITEMS) {
                state.timestamps = state.timestamps.slice(0, CONFIG.MAX_STORED_ITEMS);
            }
        } catch (e) {
            state = { timestamps: [], cooldownUntil: 0, lastSync: 0, matched: false };
        }
        cleanOldEntries();
    }

    function saveState() {
        GM_setValue(CONFIG.STORAGE_KEY, JSON.stringify(state));
    }

    function cleanOldEntries() {
        const now = Date.now();
        const cutoff = now - 24 * 60 * 60 * 1000;
        state.timestamps = state.timestamps.filter(ts => ts > cutoff);
        state.timestamps.sort((a, b) => b - a);

        if (state.cooldownUntil < now) {
            if (state.cooldownUntil > 0) {
                const expectedBase = state.cooldownUntil - (24 * 60 * 60 * 1000);
                const beforeCount = state.timestamps.length;
                state.timestamps = state.timestamps.filter(ts => ts < expectedBase || ts >= expectedBase + 5000);
                if (state.timestamps.length < beforeCount) {
                    checkAndUpdateMismatch();
                }
            }
            state.cooldownUntil = 0;
        }
    }

    function checkAndUpdateMismatch() {
        const limit = (currentUser && CONFIG.LIMITS[currentUser.trust_level]) || 50;
        const count = state.timestamps.length;
        state.matched = (count >= limit) || (count === 0 && state.lastSync === 0);
    }

    // --- Core Logic ---
    function processToggleResponse(url, data) {
        loadState();
        const now = Date.now();

        if (data.errors && data.error_type === "rate_limit") {
            let waitSeconds = data.extras?.wait_seconds || 0;
            if (waitSeconds) state.cooldownUntil = now + (waitSeconds * 1000);

            let limit = (currentUser && CONFIG.LIMITS[currentUser.trust_level]) || 50;
            const currentCount = state.timestamps.length;

            state.matched = (currentCount >= limit);

            if (currentCount < limit && waitSeconds > 0) {
                const needed = limit - currentCount;
                const placeholderBaseTime = (now + waitSeconds * 1000) - (24 * 60 * 60 * 1000);
                const safeNeeded = Math.min(needed, 200);
                for (let i = 0; i < safeNeeded; i++) {
                    state.timestamps.push(placeholderBaseTime + i);
                }
                state.timestamps.sort((a, b) => b - a);
            }

        } else if (data.id || data.resource_post_id) {
            const isLike = !!data.current_user_reaction;
            if (isLike) {
                state.timestamps.push(now);
            } else {
                if (state.timestamps.length > 0) state.timestamps.shift();
                if (state.cooldownUntil > now) state.cooldownUntil = 0;
            }
        }

        saveState();
        requestUiUpdate(true);
    }

    // --- Interceptors ---
    function installInterceptors() {
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function(...args) {
            let url = (typeof args[0] === "string") ? args[0] : (args[0]?.url || "");
            const response = await originalFetch.apply(this, args);
            if (url && (url.includes("/toggle.json") || url.includes("/custom-reactions/"))) {
                response.clone().json().then(data => processToggleResponse(url, data)).catch(() => {});
            }
            return response;
        };

        const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
            this._interceptUrl = url;
            return originalOpen.apply(this, arguments);
        };

        const originalSend = unsafeWindow.XMLHttpRequest.prototype.send;
        unsafeWindow.XMLHttpRequest.prototype.send = function() {
            const url = this._interceptUrl;
            if (url && (url.includes("/toggle.json") || url.includes("/custom-reactions/"))) {
                this.addEventListener('load', function() {
                    try { processToggleResponse(url, JSON.parse(this.responseText)); } catch (e) {}
                });
            }
            return originalSend.apply(this, arguments);
        };
    }

    // --- UI Rendering ---
    GM_addStyle(`
        .ld-picker-counter { width: auto !important; box-sizing: border-box !important; text-align: center; margin: 0 3.5px !important; padding: 6px 0 4px 0; font-size: 0.85em; font-weight: 600; border-bottom: 1px solid var(--primary-low, #e9e9e9); border-top-left-radius: 8px; border-top-right-radius: 8px; display: flex !important; align-items: center !important; justify-content: center !important; }
        .ld-picker-counter.bg-ok { background-color: color-mix(in srgb, var(--secondary), #00F2FF 15%) !important; }
        .ld-picker-counter.bg-cooldown { background-color: color-mix(in srgb, var(--secondary), #FF3131 15%) !important; }
        .ld-picker-counter.bg-mismatch { background-color: color-mix(in srgb, var(--secondary), #4D00FF 15%) !important; }
        .discourse-reactions-picker .discourse-reactions-picker-container { margin-top: 0 !important; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; }
        .ld-content-wrapper { display: flex !important; margin: 0 !important; align-items: center !important; gap: 6px !important; flex: 0 1 auto !important; }

        .ld-mismatch-tooltip { display: inline-flex; align-items: center; margin-right: 6px; cursor: help; position: relative; }
        .ld-mismatch-tooltip svg { width: 14px; height: 14px; fill: currentColor; }

        .ld-mismatch-tooltip::after { content: attr(data-tooltip); position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.85); color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.75em; white-space: nowrap; opacity: 0; visibility: hidden; transition: opacity 0.2s; pointer-events: none; z-index: 9999; }
        .ld-mismatch-tooltip:hover::after { opacity: 1; visibility: visible; }
    `);

    function requestUiUpdate(immediate = false) {
        if (immediate) {
            if (uiUpdateTimer) cancelAnimationFrame(uiUpdateTimer);
            updateUI();
            uiUpdateTimer = null;
        } else {
            if (uiUpdateTimer) return;
            uiUpdateTimer = requestAnimationFrame(() => {
                updateUI();
                uiUpdateTimer = null;
            });
        }
    }

    function updateUI() {
        const picker = document.querySelector('.discourse-reactions-picker');

        // 1. Auto-cleanup Timer
        if (cooldownTicker) {
            clearTimeout(cooldownTicker);
            cooldownTicker = null;
        }

        if (!picker) return;

        loadState();
        const count = state.timestamps.length;
        const now = Date.now();
        const isCooldown = state.cooldownUntil > now;
        const dailyLimit = (currentUser && CONFIG.LIMITS[currentUser.trust_level]) || 50;

        let statusClass = "bg-ok";
        if (isCooldown) {
            statusClass = "bg-cooldown";
        } else if (!state.matched) {
            statusClass = "bg-mismatch";
        }

        const finalClassName = `ld-picker-counter ${statusClass}`;

        let displayText = "";
        if (isCooldown) {
            const diff = Math.max(0, state.cooldownUntil - now);
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            displayText = `冷却：${h > 0 ? `${h}h ${String(m).padStart(2,'0')}m` : `${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`}`;
        } else {
            displayText = `剩余：${dailyLimit - count} / ${dailyLimit}`;
        }

        // 2. Get/Create Main Counter Div
        let counter = picker.querySelector('.ld-picker-counter') || document.createElement('div');
        if (!counter.parentNode) {
            counter.className = finalClassName;
            picker.insertBefore(counter, picker.firstChild);
        } else if (counter.className !== finalClassName)
            counter.className = finalClassName;

        // 3. Get/Create Wrapper Div
        let wrapper = counter.querySelector('.ld-content-wrapper') || document.createElement('div');
        if (!wrapper.parentNode) {
            wrapper.className = 'ld-content-wrapper';
            counter.appendChild(wrapper);
        }

        // 4. Handle Tooltip INSIDE Wrapper
        let tooltipSpan = wrapper.querySelector('.ld-mismatch-tooltip');
        if (!isCooldown && !state.matched) {
            if (!tooltipSpan) {
                tooltipSpan = document.createElement('span');
                tooltipSpan.className = 'ld-mismatch-tooltip';
                tooltipSpan.dataset.tooltip = "计数可能不准确";
                tooltipSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';
                tooltipSpan.onclick = (e) => { e.preventDefault(); syncRemote(); };
                wrapper.prepend(tooltipSpan);
            }
        } else if (tooltipSpan) {
            tooltipSpan.remove();
        }

        // 5. Handle Text INSIDE Wrapper
        let textSpan = wrapper.querySelector('.ld-text-span') || document.createElement('span');
        if (!textSpan.parentNode) {
            textSpan.className = 'ld-text-span';
            wrapper.appendChild(textSpan);
        }
        if (textSpan.textContent !== displayText) {
            textSpan.textContent = displayText;
        }

        if (isCooldown) {
            const diff = state.cooldownUntil - Date.now();
            cooldownTicker = setTimeout(() => requestUiUpdate(true), Math.floor(diff / 3600000) === 0 ? 1000 : 30000);
        }
    }

    // --- Sync Logic ---
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), CONFIG.FETCH_TIMEOUT);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (e) { clearTimeout(id); throw e; }
    }

    async function fetchUserActions(username) {
        let offset = 0, limit = 50, allItems = [], keepFetching = true, pages = 0;
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        while (keepFetching && pages < 5) {
            try {
                const res = await fetchWithTimeout(`${CONFIG.HOST}/user_actions.json?limit=${limit}&username=${username}&filter=1&offset=${offset}`);
                if (!res.ok || res.status !== 200) throw new Error(`HTTP error ${res.status}`);
                const data = await res.json();
                const items = data.user_actions || [];
                if (!items.length) { keepFetching = false; break; }
                let hasOld = false;
                for (const item of items) {
                    const t = new Date(item.created_at).getTime();
                    if (t > cutoff) allItems.push({ post_id: item.post_id, timestamp: t });
                    else hasOld = true;
                }
                if (hasOld || items.length < limit) keepFetching = false;
                offset += limit; pages++;
            } catch (e) {
                console.warn('[LikeCounter] fetchUserActions error:', e.message);
                throw e;
            }
        }
        return allItems;
    }

    async function fetchReactions(username) {
        let beforeId = null, allItems = [], keepFetching = true, pages = 0;
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        while (keepFetching && pages < 10) {
            try {
                let url = `${CONFIG.HOST}/discourse-reactions/posts/reactions.json?username=${username}${beforeId ? `&before_reaction_user_id=${beforeId}` : ''}`;
                const res = await fetchWithTimeout(url);
                if (!res.ok || res.status !== 200) throw new Error(`HTTP error ${res.status}`);
                const items = await res.json();
                if (!Array.isArray(items) || !items.length) { keepFetching = false; break; }

                let hasOld = false;
                for (const item of items) {
                    const t = new Date(item.created_at).getTime();
                    if (t > cutoff) allItems.push({ post_id: item.post_id, timestamp: t });
                    else hasOld = true;
                }
                beforeId = items[items.length - 1].id;
                if (hasOld || items.length < 20) keepFetching = false;
                pages++;
            } catch (e) {
                console.warn('[LikeCounter] fetchReactions error:', e.message);
                throw e;
            }
        }
        return allItems;
    }

    async function syncRemote() {
        if (isSyncing || !isInitialized) return;
        loadState();
        if (Date.now() - state.lastSync < 30000) return;
        if (!currentUser) {
            try { currentUser = require("discourse/models/user").default.current(); } catch(e) {}
            if(!currentUser) return;
        }

        isSyncing = true;
        const savedCooldown = state.cooldownUntil;
        const savedMatched = state.matched;
        const username = currentUser.username;
        try {
            const [likes, reactions] = await Promise.all([fetchUserActions(username), fetchReactions(username)]);
            const postMap = new Map();
            [...likes, ...reactions].forEach(item => { if (!postMap.has(item.post_id) || postMap.get(item.post_id) < item.timestamp) postMap.set(item.post_id, item.timestamp); });
            const dedupedTimestamps = Array.from(postMap.values());
            const maxRemote = Math.max(...dedupedTimestamps, 0);
            const localNewer = state.timestamps.filter(ts => ts > maxRemote + 2000);
            let placeholders = [];
            if (savedCooldown > Date.now()) {
                const expectedBase = savedCooldown - (24*60*60*1000);
                placeholders = state.timestamps.filter(ts => ts >= expectedBase && ts < expectedBase + 5000);
            }

            state.timestamps = Array.from(new Set([...dedupedTimestamps, ...localNewer, ...placeholders]));
            state.lastSync = Date.now();
            const limit = CONFIG.LIMITS[currentUser.trust_level] || 50;
            state.matched = savedMatched ? (dedupedTimestamps.length <= limit) : (dedupedTimestamps.length === limit);
            if (savedCooldown > Date.now()) state.cooldownUntil = savedCooldown;
            cleanOldEntries();
            if (state.timestamps.length >= limit && state.cooldownUntil === 0) {
                const est = Math.min(...state.timestamps) + 24*60*60*1000;
                if (est > Date.now()) state.cooldownUntil = est;
            }
            saveState();
            requestUiUpdate(true);
        } catch (e) {
            console.warn('[LikeCounter] Sync cancelled due to error, keeping current data:', e.message);
        } finally { isSyncing = false; }
    }

    // --- Init ---
    function initialize() {
        if (isInitialized) return;
        installInterceptors();
        loadState();
        isInitialized = true;
    }

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => Array.from(m.addedNodes).some(n => n.nodeType === 1 && (n.classList.contains('discourse-reactions-picker') || n.querySelector('.discourse-reactions-picker'))))) {
            requestUiUpdate(true);
        }
    });

    window.addEventListener('load', () => {
        initialize();
        try { currentUser = require("discourse/models/user").default.current(); } catch (e) {}
        setTimeout(syncRemote, 3000);
        setInterval(syncRemote, CONFIG.SYNC_INTERVAL);
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
