// ==UserScript==
// @name         Duolingo Streak Extender
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  GUI to extend streaks
// @author       apersongithub
// @match       *://*.duolingo.com/*
// @match       *://*.duolingo.cn/*
// @run-at       document-start
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/556847/Duolingo%20Streak%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/556847/Duolingo%20Streak%20Extender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Styles (Shared Design Language) ---
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
            --duo-border: #e5e5e5;
            --duo-input-bg: #f0f0f0;
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

        #duo-st-root {
            position: fixed;
            bottom: 20px;
            left: 180px; /* Offset to not overlap with Quest Tool if both installed */
            z-index: 9999;
            font-family: 'DIN Next Rounded LT Pro', 'Nunito', sans-serif;
        }

        #duo-st-toggle {
            background: var(--duo-red); /* Distinct color */
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 16px;
            font-weight: 800;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 0 #b01b1b;
            transition: transform 0.1s, filter 0.2s;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #duo-st-toggle:hover { filter: brightness(1.1); }
        #duo-st-toggle:active { transform: translateY(4px); box-shadow: none; }

        #duo-st-panel {
            display: none;
            position: fixed;
            bottom: 80px;
            left: 180px;
            width: 380px;
            height: 550px;
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

        .st-header {
            padding: 15px 20px;
            background: var(--duo-panel-bg);
            border-bottom: 2px solid var(--duo-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        }
        .st-header h3 { margin: 0; font-size: 18px; font-weight: 800; }
        .st-close { cursor: pointer; color: var(--duo-text-sub); font-weight: bold; font-size: 20px; }
        .st-close:hover { color: var(--duo-text-main); }

        /* Progress Bar */
        .st-progress-bar {
            height: 6px;
            width: 100%;
            background: var(--duo-border);
            position: relative;
        }
        .st-progress-fill {
            height: 100%;
            background: var(--duo-green);
            width: 0%;
            transition: width 0.2s ease;
        }

        .st-controls {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .st-info-box {
            background: var(--duo-input-bg);
            padding: 10px;
            border-radius: 12px;
            font-size: 11px;
            color: var(--duo-text-sub);
            border: 1px solid var(--duo-border);
        }
        .st-info-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .st-info-val { font-weight: 700; color: var(--duo-text-main); }

        .st-input-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .st-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--duo-text-sub);
            text-transform: uppercase;
        }
        .st-input {
            padding: 10px;
            border-radius: 12px;
            border: 2px solid var(--duo-border);
            background: var(--duo-input-bg);
            color: var(--duo-text-main);
            font-family: inherit;
            font-weight: 600;
        }

        .st-btn {
            padding: 12px;
            border-radius: 12px;
            border: none;
            font-weight: 800;
            text-transform: uppercase;
            cursor: pointer;
            background: var(--duo-green);
            color: white;
            box-shadow: 0 4px 0 #46a302;
            transition: filter 0.2s;
        }
        .st-btn:hover { filter: brightness(1.1); }
        .st-btn:active { transform: translateY(4px); box-shadow: none; }
        .st-btn:disabled { background: var(--duo-gray); box-shadow: none; cursor: not-allowed; transform: none; }

        .st-log {
            flex: 1;
            background: var(--duo-bg);
            padding: 15px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 11px;
            color: var(--duo-text-sub);
            border-top: 2px solid var(--duo-border);
        }
        .log-entry { margin-bottom: 5px; border-bottom: 1px solid var(--duo-border); padding-bottom: 2px; }
        .log-entry.success { color: var(--duo-green); }
        .log-entry.error { color: var(--duo-red); }
        .log-entry.skip { color: var(--duo-yellow); }
        
        .st-footer {
            padding: 10px;
            text-align: center;
            font-size: 11px;
            color: var(--duo-text-sub);
            background: var(--duo-panel-bg);
            border-top: 1px solid var(--duo-border);
        }
        .st-footer a { color: var(--duo-blue); text-decoration: none; font-weight: bold; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- State ---
    let state = {
        userId: null,
        token: null,
        userInfo: null,
        streakLength: 0,
        creationDate: null,
        isRunning: false
    };

    // --- Interceptor (For Credentials) ---
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const fetchPromise = originalFetch.apply(this, args);
        try {
            const [resource, config] = args;
            const url = typeof resource === 'string' ? resource : (resource?.url || String(resource));
            
            if (config && config.headers && config.headers.Authorization) {
                const token = config.headers.Authorization.replace('Bearer ', '');
                if (token) state.token = token;
            }
            if (url.includes('/users/')) {
                const match = url.match(/\/users\/(\d+)/);
                if (match) state.userId = match[1];
            }
            updateUIStatus();
        } catch (e) {}
        return fetchPromise;
    };

    // --- Core Logic ---

    async function getUserInfo() {
        if (!state.userId || !state.token) return null;
        if (state.userInfo) return state.userInfo;

        try {
            const res = await originalFetch(`https://www.duolingo.com/2017-06-30/users/${state.userId}`, {
                headers: { 'Authorization': `Bearer ${state.token}` }
            });
            if (res.ok) {
                state.userInfo = await res.json();
                return state.userInfo;
            }
        } catch (e) { log(`Error fetching user info: ${e.message}`, 'error'); }
        return null;
    }

    async function fetchUserData() {
        if (!state.userId || !state.token) return;
        try {
            const res = await originalFetch(`https://www.duolingo.com/2017-06-30/users/${state.userId}?fields=trackingProperties`, {
                headers: { 'Authorization': `Bearer ${state.token}` }
            });
            if(res.ok) {
                const data = await res.json();
                if(data.trackingProperties) {
                    // Streak
                    state.streakLength = data.trackingProperties.streak || 0;
                    // Creation Date
                    if(data.trackingProperties.creation_date_new) {
                        state.creationDate = new Date(data.trackingProperties.creation_date_new);
                    }
                    updateInfoBox();
                    log(`Data loaded. Streak: ${state.streakLength}, Created: ${state.creationDate?.toLocaleDateString()}`, 'success');
                }
            }
        } catch(e) {
            log("Could not fetch user data.", 'error');
        }
    }

    async function performLesson(dateObj) {
        const dateString = dateObj.toISOString().split('T')[0];
        const targetDate = new Date(dateString + "T12:00:00");
        const endTime = Math.floor(targetDate.getTime() / 1000);
        const startTime = endTime - 100; 

        const user = await getUserInfo();
        if (!user) return false;

        const headers = { 
            'Authorization': `Bearer ${state.token}`, 
            'Content-Type': 'application/json' 
        };

        try {
            const sessionRes = await originalFetch('https://www.duolingo.com/2017-06-30/sessions', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    challengeTypes: ["definition", "translate", "select", "assist", "listen"], 
                    fromLanguage: user.fromLanguage,
                    learningLanguage: user.learningLanguage,
                    type: "GLOBAL_PRACTICE"
                })
            });
            
            if (!sessionRes.ok) return false;
            const session = await sessionRes.json();

            const finishRes = await originalFetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    ...session,
                    failed: false,
                    heartsLeft: 0,
                    maxInLessonStreak: 10,
                    shouldLearnThings: true,
                    startTime: startTime,
                    endTime: endTime
                })
            });

            if (!finishRes.ok) return false;
            const result = await finishRes.json();

            log(`✅ ${dateString}: Success`, 'success');
            return true;

        } catch (e) {
            log(`❌ ${dateString}: Error`, 'error');
            return false;
        }
    }

    async function startTravel() {
        const startVal = document.getElementById('st-start-date').value;
        const endVal = document.getElementById('st-end-date').value;

        if (!startVal || !endVal) return alert("Please select range.");
        if (!state.userId || !state.token) return alert("Credentials not found.");

        const startDate = new Date(startVal);
        const endDate = new Date(endVal);

        if (startDate > endDate) return alert("Start date must be before End date.");
        
        // Safety Check: Creation Date
        if (state.creationDate && startDate < state.creationDate) {
            alert(`Error: Start date (${startDate.toLocaleDateString()}) is older than your account creation date (${state.creationDate.toLocaleDateString()}).\n\nThis prevents bans. Please adjust start date.`);
            return;
        }

        state.isRunning = true;
        updateUIStatus();
        
        await fetchUserData();
        
        const today = new Date();
        today.setHours(0,0,0,0);
        const streakCutoff = new Date(today);
        streakCutoff.setDate(today.getDate() - state.streakLength); // Dates covered by streak

        // Generate list of needed dates
        let datesToProcess = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const currentTs = currentDate.getTime();
            const cutoffTs = streakCutoff.getTime();
            const todayTs = today.getTime();

            // Check if covered by streak
            // We assume streak covers [streakCutoff, today)
            if (currentTs >= cutoffTs && currentTs < todayTs) {
                 log(`⏭️ ${currentDate.toISOString().split('T')[0]}: Active Streak (Skipped)`, 'skip');
            } else {
                datesToProcess.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        if(datesToProcess.length === 0) {
            state.isRunning = false;
            updateUIStatus();
            document.getElementById('st-progress-fill').style.width = '100%';
            return alert("All selected dates are already covered by your streak!");
        }

        log(`Starting batch for ${datesToProcess.length} days...`);
        
        // SEQUENTIAL PROCESSING (1 at a time)
        const BATCH_SIZE = 1;
        const DELAY = 1500; // 1.5s Delay
        
        for (let i = 0; i < datesToProcess.length; i += BATCH_SIZE) {
            const batch = datesToProcess.slice(i, i + BATCH_SIZE);
            
            // Execute batch in parallel
            await Promise.all(batch.map(date => performLesson(date)));
            
            // Update Progress Bar
            const progress = Math.min(100, ((i + batch.length) / datesToProcess.length) * 100);
            document.getElementById('st-progress-fill').style.width = `${progress}%`;

            // Tiny breather for the browser/network
            if(DELAY > 0) await new Promise(r => setTimeout(r, DELAY));
        }
        
        // Auto-refresh info to update UI with new streak
        await fetchUserData();

        state.isRunning = false;
        updateUIStatus();
        alert("Sequence Complete!");
    }

    // --- UI ---

    function log(msg, type = 'normal') {
        const box = document.getElementById('st-log-box');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerText = msg;
        box.appendChild(entry);
        box.scrollTop = box.scrollHeight;
    }

    function createUI() {
        const container = document.createElement('div');
        container.id = 'duo-st-root';
        
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        container.innerHTML = `
            <button id="duo-st-toggle">🔥 Streak Tool</button>
            <div id="duo-st-panel">
                <div class="st-header">
                    <h3>Streak Doctor</h3>
                    <span class="st-close">✕</span>
                </div>
                <div class="st-progress-bar">
                     <div id="st-progress-fill" class="st-progress-fill"></div>
                </div>
                <div class="st-controls">
                    <div id="st-status" style="font-size:12px; color:var(--duo-text-sub);">Waiting for connection...</div>
                    
                    <div class="st-info-box">
                         <div class="st-info-row">
                            <span>Account Created:</span>
                            <span class="st-info-val" id="st-info-created">---</span>
                         </div>
                         <div class="st-info-row">
                            <span>Current Streak:</span>
                            <span class="st-info-val" id="st-info-streak">---</span>
                         </div>
                         <div class="st-info-row">
                            <span>Streak Started:</span>
                            <span class="st-info-val" id="st-info-start">---</span>
                         </div>
                    </div>

                    <div class="st-input-group">
                        <label class="st-label">Start Date</label>
                        <input type="date" id="st-start-date" class="st-input" value="${yesterday}">
                    </div>
                    
                    <div class="st-input-group">
                        <label class="st-label">End Date</label>
                        <input type="date" id="st-end-date" class="st-input" value="${today}">
                    </div>

                    <button id="st-run-btn" class="st-btn">Start Time Travel</button>
                </div>
                <div id="st-log-box" class="st-log"></div>
                <div class="st-footer">
                    Credits: <a href="https://github.com/apersongithub/" target="_blank">apersongithub</a>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        const panel = document.getElementById('duo-st-panel');
        const toggle = document.getElementById('duo-st-toggle');
        const close = panel.querySelector('.st-close');
        const runBtn = document.getElementById('st-run-btn');

        toggle.onclick = () => {
            panel.style.display = (panel.style.display === 'flex' ? 'none' : 'flex');
            if (panel.style.display === 'flex') fetchUserData();
        };
        close.onclick = () => panel.style.display = 'none';
        runBtn.onclick = startTravel;

        // Draggable
        const header = panel.querySelector('.st-header');
        let isDragging = false, offsetX = 0, offsetY = 0;
        header.onmousedown = (e) => {
            if(e.target.classList.contains('st-close')) return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
            panel.style.bottom = 'auto';
        };
        document.onmouseup = () => isDragging = false;
    }

    function updateInfoBox() {
        if(state.creationDate) {
            document.getElementById('st-info-created').innerText = state.creationDate.toLocaleDateString();
        }
        if(state.streakLength !== undefined) {
            document.getElementById('st-info-streak').innerText = `${state.streakLength} Days`;
            
            const today = new Date();
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - state.streakLength);
            document.getElementById('st-info-start').innerText = startDate.toLocaleDateString();
        }
    }

    function updateUIStatus() {
        const el = document.getElementById('st-status');
        const btn = document.getElementById('st-run-btn');
        if(!el || !btn) return;

        if (state.isRunning) {
            el.innerText = "Running... Please wait.";
            el.style.color = "var(--duo-blue)";
            btn.disabled = true;
            btn.innerText = "Traveling...";
        } else if (state.userId && state.token) {
            el.innerText = "Connected! Ready.";
            el.style.color = "var(--duo-green)";
            btn.disabled = false;
            btn.innerText = "Start Time Travel";
            fetchUserData(); // Auto fetch info on connect
        } else {
            el.innerText = "Not connected. Browse Duolingo first.";
            el.style.color = "var(--duo-red)";
            btn.disabled = true;
        }
    }

    setTimeout(createUI, 1000);

})();