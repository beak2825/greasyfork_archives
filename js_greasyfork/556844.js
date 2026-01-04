// ==UserScript==
// @name         Get Any Duolingo Monthly Badge/Daily Quests
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  GUI to complete any duolingo monthly badges and quests in seconds!
// @author       apersongithub
// @match       *://*.duolingo.com/*
// @match       *://*.duolingo.cn/*
// @run-at       document-start
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/556844/Get%20Any%20Duolingo%20Monthly%20BadgeDaily%20Quests.user.js
// @updateURL https://update.greasyfork.org/scripts/556844/Get%20Any%20Duolingo%20Monthly%20BadgeDaily%20Quests.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Styles ---
    const styles = `
        :root {
            --duo-green: #58cc02;
            --duo-blue: #1cb0f6;
            --duo-yellow: #ffc800;
            --duo-red: #ff4b4b;
            --duo-gray: #e5e5e5;
            --duo-dark: #3c3c3c;
            --duo-light: #ffffff;
            --duo-bg: #f7f7f7;
            --duo-text-main: #3c3c3c;
            --duo-text-sub: #999999;
            --duo-panel-bg: #ffffff;
            --duo-item-bg: #ffffff;
            --duo-border: #e5e5e5;
            --duo-input-bg: #ffffff;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --duo-gray: #373737;
                --duo-dark: #e5e5e5;
                --duo-light: #181818;
                --duo-bg: #121212;
                --duo-text-main: #e5e5e5;
                --duo-text-sub: #888888;
                --duo-panel-bg: #181818;
                --duo-item-bg: #222222;
                --duo-border: #373737;
                --duo-input-bg: #2b2b2b;
            }
        }

        @keyframes slideIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        #duo-quest-tool {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            font-family: 'DIN Next Rounded LT Pro', 'Nunito', sans-serif;
        }
        #duo-qt-toggle {
            background: var(--duo-green);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 16px;
            font-weight: 800;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 0 #46a302;
            transition: transform 0.1s, filter 0.2s;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #duo-qt-toggle:hover { filter: brightness(1.1); }
        #duo-qt-toggle:active {
            transform: translateY(4px);
            box-shadow: none;
        }
        #duo-qt-panel {
            display: none;
            position: fixed;
            bottom: 80px;
            left: 20px;
            width: 420px;
            height: 640px;
            background: var(--duo-panel-bg);
            border-radius: 20px;
            border: 2px solid var(--duo-border);
            box-shadow: 0 15px 40px rgba(0,0,0,0.25);
            flex-direction: column;
            overflow: hidden;
            font-family: inherit;
            color: var(--duo-text-main);
            animation: slideIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .qt-header {
            padding: 15px 20px;
            background: var(--duo-panel-bg);
            border-bottom: 2px solid var(--duo-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }
        .qt-header h3 { margin: 0; color: var(--duo-text-main); font-size: 18px; font-weight: 800; }
        .qt-close {
            cursor: pointer; color: var(--duo-text-sub); font-weight: bold; font-size: 20px;
            transition: color 0.2s, transform 0.2s;
        }
        .qt-close:hover { color: var(--duo-text-main); transform: rotate(90deg); }

        .qt-status-bar {
            padding: 8px 20px;
            background: var(--duo-panel-bg);
            border-bottom: 2px solid var(--duo-border);
            font-size: 11px;
            color: var(--duo-text-sub);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .qt-status-dot {
            display: inline-block; width: 8px; height: 8px; border-radius: 50%;
            background: var(--duo-red); margin-right: 5px;
            transition: background-color 0.3s;
        }
        .qt-status-dot.connected { background: var(--duo-green); box-shadow: 0 0 8px var(--duo-green); }

        .qt-controls {
            padding: 15px 20px;
            background: var(--duo-panel-bg);
            border-bottom: 2px solid var(--duo-border);
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .qt-filters-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        .qt-filters {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 5px;
            flex: 1;
        }
        .qt-filters::-webkit-scrollbar { height: 0; }

        .qt-pill {
            padding: 6px 16px;
            border-radius: 20px;
            border: 2px solid var(--duo-border);
            background: transparent;
            color: var(--duo-text-sub);
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .qt-pill:hover { background: var(--duo-border); }
        .qt-pill.active {
            background: var(--duo-blue);
            border-color: var(--duo-blue);
            color: white;
            box-shadow: 0 2px 0 #1899d6;
            transform: scale(1.05);
        }

        /* Toggle Switch */
        .qt-toggle-wrapper {
            display: flex;
            align-items: center;
            font-size: 12px;
            color: var(--duo-text-sub);
            font-weight: 700;
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
        }
        .qt-toggle-input { display: none; }
        .qt-toggle-slider {
            width: 36px;
            height: 20px;
            background-color: var(--duo-border);
            border-radius: 20px;
            margin-right: 8px;
            position: relative;
            transition: background-color 0.2s;
        }
        .qt-toggle-slider::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            background: white;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .qt-toggle-input:checked + .qt-toggle-slider {
            background-color: var(--duo-green);
        }
        .qt-toggle-input:checked + .qt-toggle-slider::after {
            transform: translateX(16px);
        }

        .qt-primary-actions {
            display: flex;
            gap: 10px;
        }
        .qt-action-btn {
            flex: 1;
            padding: 10px;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: transform 0.1s, filter 0.2s;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }
        .qt-action-btn:hover { filter: brightness(1.1); }
        .qt-btn-load { background: var(--duo-green); color: white; box-shadow: 0 4px 0 #46a302; }
        .qt-btn-claim-all { background: var(--duo-yellow); color: #735900; box-shadow: 0 4px 0 #d9aa00; }
        .qt-action-btn:active { transform: translateY(4px); box-shadow: none; }

        /* Loading Spinner */
        .qt-spinner {
            width: 14px;
            height: 14px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 0.8s linear infinite;
            display: none;
        }
        .qt-action-btn.loading .qt-spinner { display: block; }
        .qt-action-btn.loading span { opacity: 0.7; }

        .qt-content {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: var(--duo-bg);
        }
        .qt-item {
            display: flex;
            align-items: center;
            background: var(--duo-item-bg);
            border: 2px solid var(--duo-border);
            border-radius: 16px;
            padding: 12px;
            margin-bottom: 12px;
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            animation: slideIn 0.3s ease-out forwards;
            opacity: 0;
        }
        .qt-item:nth-child(1) { animation-delay: 0.05s; }
        .qt-item:nth-child(2) { animation-delay: 0.1s; }
        .qt-item:nth-child(3) { animation-delay: 0.15s; }
        .qt-item:nth-child(4) { animation-delay: 0.2s; }
        .qt-item:nth-child(5) { animation-delay: 0.25s; }

        .qt-item:hover { border-color: var(--duo-blue); transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
        .qt-item.warning { border-left: 4px solid #ff9600; }
        .qt-item.completed { border-left: 4px solid var(--duo-green); }

        .qt-warning-icon {
            position: absolute;
            top: 5px;
            left: 5px;
            font-size: 14px;
            cursor: help;
        }

        .qt-icon {
            width: 56px;
            height: 56px;
            margin-right: 15px;
            object-fit: contain;
            transition: transform 0.2s;
        }
        .qt-item:hover .qt-icon { transform: scale(1.1) rotate(-5deg); }

        .qt-info { flex: 1; overflow: hidden; }
        .qt-name { font-weight: 700; color: var(--duo-text-main); margin-bottom: 4px; font-size: 15px; }
        .qt-meta { font-size: 11px; color: var(--duo-text-sub); margin-bottom: 6px; font-family: monospace;}
        .qt-progress-bar-bg {
            height: 10px;
            background: var(--duo-border);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }
        .qt-progress-bar-fill {
            height: 100%;
            background: var(--duo-yellow);
            width: 0%;
            border-radius: 10px;
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .qt-progress-bar-fill.full {
            background: var(--duo-green);
        }

        .qt-item-actions {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-left: 12px;
        }
        .qt-mini-btn {
            background: var(--duo-blue);
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 10px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 3px 0 #1899d6;
            font-size: 11px;
            text-align: center;
            width: 50px;
            transition: transform 0.1s, background-color 0.2s;
        }
        .qt-mini-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        .qt-mini-btn:active { transform: translateY(3px) scale(0.95); box-shadow: none; }
        .qt-mini-btn.gold { background: var(--duo-yellow); color: #735900; box-shadow: 0 3px 0 #d9aa00; }

        .qt-footer {
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: var(--duo-text-sub);
            background: var(--duo-panel-bg);
            border-top: 1px solid var(--duo-border);
        }
        .qt-footer a {
            color: var(--duo-blue);
            text-decoration: none;
            font-weight: bold;
            transition: color 0.2s;
        }
        .qt-footer a:hover { color: var(--duo-green); }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- State & Config ---
    let state = {
        userId: null,
        token: null,
        creationDate: null,
        schema: { goals: [], badges: [] },
        progress: {},
        earnedBadges: new Set(),
        filter: 'MONTHLY',
        hasAutoLoaded: false,
        hideCompleted: false,
        loading: false
    };

    // --- Network Interceptor ---
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const fetchPromise = originalFetch.apply(this, args);
        try {
            const [resource, config] = args;
            const url = typeof resource === 'string' ? resource : (resource?.url || String(resource));

            if (config && config.headers && config.headers.Authorization) {
                const token = config.headers.Authorization.replace('Bearer ', '');
                if (token && token !== state.token) {
                    state.token = token;
                    updateStatusUI();
                    tryAutoLoad();
                }
            }

            if (url.includes('/users/')) {
                const userMatch = url.match(/\/users\/(\d+)/);
                if (userMatch && userMatch[1]) {
                    if (state.userId !== userMatch[1]) {
                        state.userId = userMatch[1];
                        updateStatusUI();
                        tryAutoLoad();
                    }
                }
            }
        } catch (e) {}
        return fetchPromise;
    };

    // --- Helper Functions ---

    function log(msg) {
        console.log(`[DuoQuest] ${msg}`);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function checkStoredCredentials() {
        const jwt = getCookie('jwt_token');
        if (jwt) state.token = jwt;

        if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.user) {
            state.userId = window.__PRELOADED_STATE__.user.id;
        } else {
            const localState = localStorage.getItem('reduxPersist:user');
            if (localState) {
                try {
                    const parsed = JSON.parse(localState);
                    if (parsed.id) state.userId = parsed.id;
                } catch(e) {}
            }
        }
        updateStatusUI();
        tryAutoLoad();
    }

    function tryAutoLoad() {
        if (state.userId && state.token && !state.hasAutoLoaded) {
            state.hasAutoLoaded = true;
            setTimeout(loadData, 1000);
        }
    }

    // SMART TIMESTAMP LOGIC (ALWAYS FORCE HISTORIC)
    function getQuestTimestamp(goalId) {
        const regex = /^(\d{4})_(\d{2})_monthly/;
        const match = goalId.match(regex);
        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const date = new Date(Date.UTC(year, month, 15, 12, 0, 0));
            return date.toISOString();
        }
        return new Date().toISOString();
    }

    function setButtonLoading(btnId, isLoading) {
        const btn = document.getElementById(btnId);
        if(btn) {
            if(isLoading) {
                btn.classList.add('loading');
                btn.disabled = true;
            } else {
                btn.classList.remove('loading');
                btn.disabled = false;
            }
        }
    }

    // --- API Interactions ---

    function getCommonHeaders() {
        return {
            "Content-Type": "application/json",
            "x-requested-with": "XMLHttpRequest",
            "accept": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${state.token}`
        };
    }

    async function fetchAccountCreationDate() {
        if (!state.userId || !state.token) return;
        try {
            const url = `https://www.duolingo.com/2017-06-30/users/${state.userId}?fields=trackingProperties`;
            const res = await originalFetch(url, {
                method: "GET",
                headers: getCommonHeaders()
            });
            const data = await res.json();
            if (data.trackingProperties && data.trackingProperties.creation_date_new) {
                state.creationDate = new Date(data.trackingProperties.creation_date_new);
                const dateStr = state.creationDate.toLocaleDateString();
                const userDisplay = document.getElementById('qt-user-display');
                if(userDisplay) userDisplay.innerText = `ID: ${state.userId} (Since ${state.creationDate.getFullYear()})`;
            }
        } catch (e) {
            log("Warning: Could not fetch account age.");
        }
    }

    async function loadData() {
        if(!state.userId || !state.token) return;

        setButtonLoading('qt-load-btn', true);
        await fetchAccountCreationDate();

        try {
            const schemaRes = await originalFetch(`https://goals-api.duolingo.com/schema?ui_language=en&_=${Date.now()}`, {
                method: "GET",
                headers: getCommonHeaders(),
                credentials: "include"
            });
            const schemaData = await schemaRes.json();
            state.schema = schemaData;
        } catch (e) { console.error(e); }

        try {
            const progressRes = await originalFetch(`https://goals-api.duolingo.com/users/${state.userId}/progress?timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}&ui_language=en`, {
                method: "GET",
                headers: getCommonHeaders(),
                credentials: "include"
            });
            const progressData = await progressRes.json();
            state.progress = progressData.goals?.progress || {};

            if (progressData.badges && progressData.badges.earned) {
                state.earnedBadges = new Set(progressData.badges.earned);
            } else {
                state.earnedBadges = new Set();
            }
        } catch (e) { console.error(e); }

        setButtonLoading('qt-load-btn', false);
        renderGoals();
    }

    async function completeMetric(metricName, amount, goalId) {
        if(!state.userId) return;

        if (metricName === 'XP' && amount >= 50) {
            amount = 1000; // Safe limit for XP
        }

        const timestamp = getQuestTimestamp(goalId);
        const url = `https://goals-api.duolingo.com/users/${state.userId}/progress/batch`;
        const body = {
            "metric_updates": [
                {
                    "metric": metricName,
                    "quantity": amount
                }
            ],
            "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
            "timestamp": timestamp
        };

        try {
            const response = await originalFetch(url, {
                method: "POST",
                headers: getCommonHeaders(),
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                if (response.status === 500) {
                    alert("Server Error (500): The server rejected the request (likely due to the timestamp being too old/archived).");
                } else {
                    alert(`Error ${response.status}: Request failed.`);
                }
                return;
            }

            log(`✅ Updated ${metricName}!`);
            loadData();
        } catch (e) { console.error(e); }
    }

    async function claimAll() {
        if (!state.schema.goals) return;
        if (!state.creationDate && !confirm("Account age unknown. Continue?")) return;

        setButtonLoading('qt-claim-all-btn', true);

        // Filter Goals (ALL goals now, not just monthly)
        const filteredGoals = getFilteredGoals();
        const safeGoals = filteredGoals.filter(g => {
            // We no longer check for 'MONTHLY' here. We take everything valid.
            return !isQuestOlderThanAccount(g.goalId);
        });

        const batches = {};
        safeGoals.forEach(g => {
            const ts = getQuestTimestamp(g.goalId);
            if (!batches[ts]) batches[ts] = new Set();
            batches[ts].add(g.metric);
        });

        const timestamps = Object.keys(batches);
        let errorCount = 0;

        for (const ts of timestamps) {
            const uniqueMetrics = Array.from(batches[ts]);
            const metricUpdates = uniqueMetrics.map(metric => ({
                "metric": metric,
                "quantity": metric === 'XP' ? 1000 : 50
            }));

            const url = `https://goals-api.duolingo.com/users/${state.userId}/progress/batch`;
            const body = {
                "metric_updates": metricUpdates,
                "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
                "timestamp": ts
            };

            try {
                const res = await originalFetch(url, {
                    method: "POST",
                    headers: getCommonHeaders(),
                    body: JSON.stringify(body)
                });
                if(!res.ok) errorCount++;
            } catch (e) { errorCount++; }
        }

        setButtonLoading('qt-claim-all-btn', false);
        if(errorCount > 0) {
            alert(`Done. ${errorCount} batches failed (likely due to historic timestamps).`);
        } else {
            alert("All Quests Completed Successfully!");
        }
        loadData();
    }

    // --- Logic Helpers ---

    function isQuestOlderThanAccount(goalId) {
        if(!state.creationDate) return false;
        const match = goalId.match(/^(\d{4})_(\d{2})_monthly/);
        if (match) {
            const year = parseInt(match[1]);
            const month = parseInt(match[2]) - 1;
            const creationYear = state.creationDate.getFullYear();
            const creationMonth = state.creationDate.getMonth();
            if (year < creationYear) return true;
            if (year === creationYear && month < creationMonth) return true;
        }
        return false;
    }

    function getFilteredGoals() {
        if (!state.schema.goals) return [];

        const map = new Map();
        const monthlyRegex = /^(\d{4}_\d{2})_monthly/;

        const monthlyGoals = [];
        const otherGoals = [];

        state.schema.goals.forEach(g => {
            const match = g.goalId.match(monthlyRegex);
            if (match) {
                monthlyGoals.push({ key: match[1], goal: g });
            } else {
                otherGoals.push(g);
            }
        });

        monthlyGoals.forEach(item => {
            const existing = map.get(item.key);
            if (!existing) {
                map.set(item.key, item.goal);
            } else {
                const existingIsChallenge = existing.category.includes('CHALLENGE');
                const newIsChallenge = item.goal.category.includes('CHALLENGE');

                if (!existingIsChallenge && newIsChallenge) {
                    map.set(item.key, item.goal);
                }
            }
        });

        return [...otherGoals, ...map.values()];
    }

    // --- UI Rendering ---

    function createUI() {
        const container = document.createElement('div');
        container.id = 'duo-quest-tool';
        container.innerHTML = `
            <button id="duo-qt-toggle">⚔️ Quest Tool</button>
            <div id="duo-qt-panel">
                <div class="qt-header">
                    <h3>Duolingo Quest Tool</h3>
                    <span class="qt-close" id="qt-close-btn">✕</span>
                </div>
                <div class="qt-status-bar">
                    <div>
                        <span class="qt-status-dot" id="qt-dot"></span>
                        <span id="qt-status-text">Waiting...</span>
                    </div>
                    <span id="qt-user-display">ID: ---</span>
                </div>
                <div class="qt-controls">
                    <div class="qt-primary-actions">
                        <button class="qt-action-btn qt-btn-load" id="qt-load-btn">
                            <div class="qt-spinner"></div><span>Refresh Data</span>
                        </button>
                        <button class="qt-action-btn qt-btn-claim-all" id="qt-claim-all-btn">
                            <div class="qt-spinner"></div><span>Claim All</span>
                        </button>
                    </div>
                    <div class="qt-filters-row">
                        <div class="qt-filters">
                            <button class="qt-pill active" data-filter="MONTHLY">Monthly</button>
                            <button class="qt-pill" data-filter="DAILY">Daily</button>
                            <button class="qt-pill" data-filter="FRIENDS">Friends</button>
                            <button class="qt-pill" data-filter="WEEKLY">Weekly</button>
                            <button class="qt-pill" data-filter="ALL">All</button>
                        </div>
                    </div>
                    <label class="qt-toggle-wrapper">
                        <input type="checkbox" class="qt-toggle-input" id="qt-hide-completed">
                        <span class="qt-toggle-slider"></span>
                        <span>Hide Done</span>
                    </label>
                </div>
                <div id="qt-content-area" class="qt-content">
                    <div style="text-align:center; color:var(--duo-text-sub); margin-top:50px; font-weight:600;">
                        1. Browse Duolingo.<br>2. Wait for "Connected".<br>3. Data loads automatically.
                    </div>
                </div>
                <div class="qt-footer">
                    Credits: <a href="https://github.com/apersongithub/" target="_blank">apersongithub</a>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Drag & Event Logic
        const panel = document.getElementById('duo-qt-panel');
        const header = panel.querySelector('.qt-header');
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        header.onmousedown = (e) => {
            if(e.target.classList.contains('qt-close')) return;
            isDragging = true;
            offset.x = e.clientX - panel.getBoundingClientRect().left;
            offset.y = e.clientY - panel.getBoundingClientRect().top;
            panel.style.transition = 'none';
        };

        document.onmousemove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            panel.style.bottom = 'auto';
            panel.style.left = (e.clientX - offset.x) + 'px';
            panel.style.top = (e.clientY - offset.y) + 'px';
        };

        document.onmouseup = () => {
            if(isDragging) {
                isDragging = false;
                panel.style.transition = 'transform 0.1s';
            }
        };

        document.getElementById('duo-qt-toggle').onclick = () => {
            panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
            updateStatusUI();
        };
        document.getElementById('qt-close-btn').onclick = () => panel.style.display = 'none';
        document.getElementById('qt-load-btn').onclick = loadData;

        // Changed function reference here
        document.getElementById('qt-claim-all-btn').onclick = claimAll;

        document.getElementById('qt-hide-completed').onchange = (e) => {
            state.hideCompleted = e.target.checked;
            renderGoals();
        };

        document.querySelectorAll('.qt-pill').forEach(btn => {
            btn.onclick = (e) => {
                document.querySelectorAll('.qt-pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                state.filter = e.target.dataset.filter;
                renderGoals();
            };
        });
    }

    function updateStatusUI() {
        const dot = document.getElementById('qt-dot');
        const text = document.getElementById('qt-status-text');
        const userDisplay = document.getElementById('qt-user-display');

        if (state.userId && state.token) {
            dot.classList.add('connected');
            text.innerText = "Connected";
            if(state.creationDate) {
                 userDisplay.innerText = `ID: ${state.userId} (${state.creationDate.getFullYear()})`;
            } else {
                 userDisplay.innerText = `ID: ${state.userId}`;
            }
        } else {
            dot.classList.remove('connected');
            text.innerText = "Scanning network...";
            userDisplay.innerText = "ID: ---";
        }
    }

    function renderGoals() {
        const container = document.getElementById('qt-content-area');
        container.innerHTML = '';

        // Use deduplicated goals list
        const filteredSchemaGoals = getFilteredGoals();

        if (!filteredSchemaGoals || filteredSchemaGoals.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:var(--duo-text-sub);">No goals loaded.</div>';
            return;
        }

        const isCategoryMatch = (cat) => {
            if (!cat) return false;
            if (state.filter === 'ALL') return true;
            if (state.filter === 'MONTHLY' && (cat.includes('MONTHLY'))) return true;
            if (state.filter === 'DAILY' && cat.includes('DAILY')) return true;
            if (state.filter === 'FRIENDS' && cat.includes('FRIENDS')) return true;
            if (state.filter === 'WEEKLY' && cat.includes('WEEKLY')) return true;
            return false;
        };

        const reversedGoals = [...filteredSchemaGoals].reverse();

        reversedGoals.forEach(goal => {
            if (!isCategoryMatch(goal.category)) return;

            let isEarned = false;
            if (state.earnedBadges.has(goal.badgeId) || state.earnedBadges.has(goal.goalId)) {
                isEarned = true;
            }

            if (state.hideCompleted && isEarned) return;

            let isOlder = isQuestOlderThanAccount(goal.goalId);

            let iconUrl = "https://d35aaqx5ub95lt.cloudfront.net/images/goals/2b5a21198336f3246eb61c5670868eb2.svg";
            const badge = state.schema.badges.find(b => b.badgeId === goal.badgeId);
            if (badge && badge.icon && badge.icon.enabled && badge.icon.enabled.lightMode) {
                iconUrl = badge.icon.enabled.lightMode.svg || badge.icon.enabled.lightMode.url || iconUrl;
            }

            let currentProgress = 0;
            let rawProgress = state.progress[goal.goalId];
            if (typeof rawProgress === 'number') {
                currentProgress = rawProgress;
            } else if (rawProgress && typeof rawProgress === 'object') {
                currentProgress = rawProgress.progress || 0;
            }

            const target = goal.threshold || 10;
            let percentage = Math.min(100, (currentProgress / target) * 100);
            const metric = goal.metric;

            let progressText = `${currentProgress} / ${target}`;
            let progressColor = "var(--duo-text-sub)";
            if (isEarned) {
                percentage = 100;
                progressText = "COMPLETED";
                progressColor = "var(--duo-green)";
            }

            const el = document.createElement('div');
            el.className = 'qt-item' + (isOlder ? ' warning' : '') + (isEarned ? ' completed' : '');
            el.innerHTML = `
                ${isOlder ? '<span class="qt-warning-icon" title="This quest is older than your account. Finishing it is risky.">⚠️</span>' : ''}
                <img src="${iconUrl}" class="qt-icon" onerror="this.style.display='none'">
                <div class="qt-info">
                    <div class="qt-name">${goal.title?.uiString || goal.goalId}</div>
                    <div class="qt-meta">Metric: ${metric}</div>
                    <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold; color:${progressColor}; margin-bottom:2px;">
                        <span>${progressText}</span>
                        <span>${Math.round(percentage)}%</span>
                    </div>
                    <div class="qt-progress-bar-bg">
                        <div class="qt-progress-bar-fill ${isEarned ? 'full' : ''}" style="width: ${percentage}%"></div>
                    </div>
                </div>
                <div class="qt-item-actions">
                    <button class="qt-mini-btn" data-metric="${metric}" data-amt="1">+1</button>
                    <button class="qt-mini-btn" data-metric="${metric}" data-amt="10">+10</button>
                    <button class="qt-mini-btn gold" data-metric="${metric}" data-amt="50">Claim</button>
                </div>
            `;

            const buttons = el.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.onclick = () => {
                    if (isOlder && !confirm("This quest is dated BEFORE your account was created. Completing it may flag your account. Are you sure?")) return;
                    completeMetric(btn.dataset.metric, parseInt(btn.dataset.amt), goal.goalId);
                };
            });

            container.appendChild(el);
        });
    }

    setTimeout(() => {
        createUI();
        checkStoredCredentials();
    }, 1000);

})();