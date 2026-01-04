// ==UserScript==
// @name:en      Linux.do Like Counter
// @name         Linux.do 点赞计数器
// @namespace    https://linux.do/
// @version      1.4
// @description:en  Tracks available likes/reactions on linux.do.
// @description     显示 linux.do 上的可用点赞数。
// @author       ChiGamma
// @license      Fair License
// @match        https://linux.do/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560764/Linuxdo%20%E7%82%B9%E8%B5%9E%E8%AE%A1%E6%95%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560764/Linuxdo%20%E7%82%B9%E8%B5%9E%E8%AE%A1%E6%95%B0%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HOST: window.location.origin,
        SYNC_INTERVAL: 30 * 60 * 1000,
        STORAGE_KEY: 'linuxdo_likes_history',
        LIMITS: { 0: 50, 1: 50, 2: 75, 3: 100, 4: 150 },
        MAX_STORED_ITEMS: 500
    };

    const console = unsafeWindow.console || window.console;
    let state = { timestamps: [], cooldownUntil: 0, lastSync: 0, matched: false };
    let currentUser = null;
    let uiUpdateTimer = null;
    let cooldownTicker = null;

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
                // Heuristic: If we just came out of cooldown, re-verify mismatch
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
        getCurrentUser(); // Ensure user is loaded
        const limit = (currentUser && CONFIG.LIMITS[currentUser.trust_level]) || 50;
        const count = state.timestamps.length;
        state.matched = (count >= limit) || (count === 0 && state.lastSync === 0);
    }

    // --- Helper: Get User Safely ---
    function getCurrentUser() {
        if (currentUser) return currentUser;
        try {
            // Try standard Discourse module
            if (window.require) {
                const User = window.require("discourse/models/user").default;
                if (User) currentUser = User.current();
            }
            // Fallback to global Discourse object
            if (!currentUser && unsafeWindow.Discourse && unsafeWindow.Discourse.User) {
                currentUser = unsafeWindow.Discourse.User.current();
            }
        } catch (e) {
            // User might not be logged in or app not ready
        }
        return currentUser;
    }

    // --- Core Logic ---
    function processToggleResponse(url, data) {
        loadState();
        getCurrentUser();
        const now = Date.now();

        // Handle Rate Limit Error
        if (data.errors && data.error_type === "rate_limit") {
            let waitSeconds = data.extras?.wait_seconds || 0;
            if (waitSeconds) state.cooldownUntil = now + (waitSeconds * 1000);

            let limit = (currentUser && CONFIG.LIMITS[currentUser.trust_level]) || 50;
            const currentCount = state.timestamps.length;

            state.matched = (currentCount >= limit);

            // Fill placeholders if we hit limit but local count is low
            if (currentCount < limit && waitSeconds > 0) {
                const needed = limit - currentCount;
                const placeholderBaseTime = (now + waitSeconds * 1000) - (24 * 60 * 60 * 1000);
                const safeNeeded = Math.min(needed, 200);
                for (let i = 0; i < safeNeeded; i++) {
                    state.timestamps.push(placeholderBaseTime + i);
                }
                state.timestamps.sort((a, b) => b - a);
            }
        } 
        // Handle Successful Like/Unlike
        else if (data.id || data.resource_post_id) {
            // Check if it's an "add" or "remove" action based on payload or response
            // data.current_user_reaction is usually present in response
            const isLike = !!data.current_user_reaction; 
            
            if (isLike) {
                state.timestamps.push(now);
            } else {
                // Unlike: Remove one timestamp (the oldest one usually, or most recent? 
                // FIFO is safer to not break the sliding window logic too much)
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
        .ld-picker-counter { 
            width: auto !important; 
            box-sizing: border-box !important; 
            text-align: center; 
            margin: 0 3.5px !important; 
            padding: 6px 0 4px 0; 
            font-size: 0.85em; 
            font-weight: 600; 
            border-bottom: 1px solid var(--primary-low, #e9e9e9); 
            border-top-left-radius: 8px; 
            border-top-right-radius: 8px; 
            display: flex !important; 
            align-items: center !important; 
            justify-content: center !important; 
        }
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
        
        // If picker is gone, stop updating but keep timer logic ready
        if (!picker) return;

        getCurrentUser();
        cleanOldEntries();

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
            displayText = `剩余：${Math.max(0, dailyLimit - count)} / ${dailyLimit}`;
        }

        // --- DOM Injection ---
        
        let counter = picker.querySelector('.ld-picker-counter');
        
        // Fix: If counter exists but is not the first child (Discourse rendered something above it), move it up
        if (counter && picker.firstChild !== counter) {
            picker.insertBefore(counter, picker.firstChild);
        }

        if (!counter) {
            counter = document.createElement('div');
            counter.className = finalClassName;
            picker.insertBefore(counter, picker.firstChild);
        } else if (counter.className !== finalClassName) {
            counter.className = finalClassName;
        }

        // Wrapper
        let wrapper = counter.querySelector('.ld-content-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'ld-content-wrapper';
            counter.appendChild(wrapper);
        }

        // Tooltip
        let tooltipSpan = wrapper.querySelector('.ld-mismatch-tooltip');
        const shouldShowTooltip = !state.matched && !isCooldown;

        if (shouldShowTooltip) {
            if (!tooltipSpan) {
                tooltipSpan = document.createElement('span');
                tooltipSpan.className = 'ld-mismatch-tooltip';
                tooltipSpan.dataset.tooltip = "计数可能不准确 (点击校准)";
                tooltipSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';
                tooltipSpan.onclick = (e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); // Stop click from closing picker
                    syncRemote(); 
                };
                wrapper.prepend(tooltipSpan);
            }
        } else if (tooltipSpan) {
            tooltipSpan.remove();
        }

        // Text
        let textSpan = wrapper.querySelector('.ld-text-span');
        if (!textSpan) {
            textSpan = document.createElement('span');
            textSpan.className = 'ld-text-span';
            wrapper.appendChild(textSpan);
        }
        if (textSpan.textContent !== displayText) {
            textSpan.textContent = displayText;
        }

        // Timer Recurse
        if (cooldownTicker) clearTimeout(cooldownTicker);
        if (isCooldown) {
            const diff = state.cooldownUntil - Date.now();
            const h = Math.floor(diff / 3600000);
            // Update every second if close to 0, otherwise every 30s
            cooldownTicker = setTimeout(() => requestUiUpdate(true), h === 0 ? 1000 : 30 * 1000);
        }
    }

    // --- Sync Logic ---
    async function fetchUserActions(username) {
        let offset = 0, limit = 50, allItems = [], keepFetching = true, pages = 0;
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;

        while (keepFetching && pages < 5) {
            try {
                const url = `${CONFIG.HOST}/user_actions.json?limit=${limit}&username=${username}&filter=1&offset=${offset}`;
                const res = await fetch(url).then(r => r.json());
                const items = res.user_actions || [];
                if (!items.length) break;

                let hasOld = false;
                for (const item of items) {
                    const t = new Date(item.created_at).getTime();
                    if (t > cutoff) allItems.push({ post_id: item.post_id, timestamp: t });
                    else hasOld = true;
                }
                if (hasOld || items.length < limit) keepFetching = false;
                offset += limit;
                pages++;
            } catch (e) { keepFetching = false; }
        }
        return allItems;
    }

    async function fetchReactions(username) {
        let beforeId = null, allItems = [], keepFetching = true, pages = 0;
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;

        while (keepFetching && pages < 10) {
            try {
                let url = `${CONFIG.HOST}/discourse-reactions/posts/reactions.json?username=${username}`;
                if (beforeId) url += `&before_reaction_user_id=${beforeId}`;

                const items = await fetch(url).then(r => r.json());
                if (!Array.isArray(items) || !items.length) break;

                let hasOld = false;
                for (const item of items) {
                    const t = new Date(item.created_at).getTime();
                    if (t > cutoff) allItems.push({ post_id: item.post_id, timestamp: t });
                    else hasOld = true;
                }
                beforeId = items[items.length - 1].id;
                if (hasOld || items.length < 20) keepFetching = false;
                pages++;
            } catch (e) { keepFetching = false; }
        }
        return allItems;
    }

    async function syncRemote() {
        getCurrentUser();
        if(!currentUser) {
            // Retry once after short delay if user not found (page load race condition)
            setTimeout(() => {
                getCurrentUser();
                if (currentUser) syncRemote();
            }, 2000);
            return;
        }

        const savedCooldown = state.cooldownUntil;
        const savedMatched = state.matched;
        cleanOldEntries();
        const username = currentUser.username;

        try {
            const [likes, reactions] = await Promise.all([fetchUserActions(username), fetchReactions(username)]);
            const combined = [...likes, ...reactions];
            const postMap = new Map();
            for (const item of combined) {
                if (!postMap.has(item.post_id) || postMap.get(item.post_id) < item.timestamp) {
                    postMap.set(item.post_id, item.timestamp);
                }
            }
            const dedupedTimestamps = Array.from(postMap.values());
            const maxRemote = Math.max(...dedupedTimestamps, 0);

            // Keep local timestamps that are newer than remote (optimistic UI updates)
            const localNewer = state.timestamps.filter(ts => ts > maxRemote + 5000);
            
            // Keep placeholders related to rate limit cooldowns
            let placeholders = [];
            if (savedCooldown > Date.now()) {
                const expectedBase = savedCooldown - (24*60*60*1000);
                placeholders = state.timestamps.filter(ts => ts >= expectedBase && ts < expectedBase + 5000);
            }

            state.timestamps = Array.from(new Set([...dedupedTimestamps, ...localNewer, ...placeholders]));
            state.lastSync = Date.now();

            const limit = CONFIG.LIMITS[currentUser.trust_level] || 50;
            const apiCount = dedupedTimestamps.length;
            
            // Logic to determine if our count matches reality
            // If previously matched, only unmatch if apiCount > limit (weird)
            // Generally we assume sync is truth
            state.matched = (apiCount <= limit); 

            if (savedCooldown > Date.now()) {
                state.cooldownUntil = savedCooldown;
            }

            cleanOldEntries();
            
            // Infer cooldown from history if full
            if (state.timestamps.length >= limit && state.cooldownUntil === 0) {
                const oldestTs = Math.min(...state.timestamps);
                const estimatedCooldown = oldestTs + 24 * 60 * 60 * 1000;
                if (estimatedCooldown > Date.now()) {
                    state.cooldownUntil = estimatedCooldown;
                }
            }

            saveState();
            requestUiUpdate(true);
        } catch (e) { console.error("[LikeCounter] Sync failed", e); }
    }

    // --- Init ---
    installInterceptors();
    loadState();

    // Use a more aggressive observation strategy for the picker
    const observer = new MutationObserver(() => {
        // Just always try to update if the picker exists. 
        // requestUiUpdate is debounced via requestAnimationFrame/timer, so this is cheap.
        const picker = document.querySelector('.discourse-reactions-picker');
        if (picker) {
            requestUiUpdate();
        }
    });

    // Also listen for Discourse page changes (SPA navigation)
    // This helps re-trigger checks when moving between topics
    try {
        const appEvents = unsafeWindow.Discourse && unsafeWindow.Discourse.appEvents;
        if (appEvents) {
            appEvents.on('page:changed', () => requestUiUpdate(true));
            appEvents.on('component:loading', () => requestUiUpdate(true));
        }
    } catch(e) {}

    window.addEventListener('load', () => {
        getCurrentUser();
        // Delay sync slightly to let Ember settle
        setTimeout(syncRemote, 3000);
        setInterval(syncRemote, CONFIG.SYNC_INTERVAL);
        
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
