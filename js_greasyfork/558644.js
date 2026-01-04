// ==UserScript==
// @name         Agoda <-> Citi Silent Checker
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Opens Citi in background, checks price, and reports back to Agoda
// @author       soffit
// @license      MIT
// @match        https://www.agoda.com/*
// @match        https://search.travel.citi.com/*
// @match        https://online.citi.com/*
// @match        https://portal.citi.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/558644/Agoda%20%3C-%3E%20Citi%20Silent%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/558644/Agoda%20%3C-%3E%20Citi%20Silent%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const AGODA_DOMAIN = "agoda.com";
    const CITI_TRAVEL_DOMAIN = "search.travel.citi.com";
    const HEARTBEAT_URL = "https://online.citi.com/US/ag/dashboard/summary?keepAlive=1";
    const HEARTBEAT_WINDOW_NAME = "CitiSessionGuardWindow";
    const SESSION_GRACE_PERIOD_MS = 6 * 60 * 1000;

    // --- STYLES ---
    const MAIN_STYLE = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 320px;
        padding: 20px;
        background: white;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        border-radius: 12px;
        z-index: 2147483647 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        border: 2px solid #002D72;
        color: #333;
    `;

    const BUBBLE_STYLE = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #002D72;
        color: white;
        border-radius: 50%;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 2147483647 !important;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        border: 2px solid white;
    `;

    // Helper: Open Named Window
    function openHeartbeatTab() {
        const win = window.open(HEARTBEAT_URL, HEARTBEAT_WINDOW_NAME);
        if (win) {
            window.focus();
            document.body.click();
        }
    }

    // ========================================================================
    // PART 1: AGODA TAB LOGIC
    // ========================================================================
    if (window.location.hostname.includes(AGODA_DOMAIN)) {
        setInterval(createFloatingWindow, 2000);

        function createFloatingWindow() {
            // Check if Main or Bubble already exists
            if (document.getElementById('citi-float-window') || document.getElementById('citi-minimized-bubble')) return;

            // Check Preference (Default: Not Minimized)
            const isMinimized = sessionStorage.getItem('citi_ui_minimized') === 'true';

            // 1. Create Main Window
            const box = document.createElement('div');
            box.id = 'citi-float-window';
            box.style.cssText = MAIN_STYLE;
            box.style.display = isMinimized ? 'none' : 'block'; // Apply state
            box.innerHTML = `
                <div style="font-weight:bold; color:#002D72; margin-bottom:15px; font-size:18px; border-bottom:1px solid #eee; padding-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span>🏦 Citi Travel Check</span>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <span id="citi-status-icon" title="Refresh" style="cursor:pointer; font-size:18px;">🔄</span>
                        <span id="citi-minimize-btn" title="Minimize" style="cursor:pointer; font-size:24px; line-height:18px; font-weight:bold;">&minus;</span>
                    </div>
                </div>
                <div id="citi-result-content" style="font-size:15px; text-align:center;">
                    <button id="citi-scan-btn" style="width:100%; padding:12px; background:#002D72; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:15px; transition: background 0.2s;">
                        Check Availability
                    </button>
                    <div style="margin-top:10px; font-size:12px; color:#999;">Click to scan Citi in background</div>
                </div>
            `;
            document.body.appendChild(box);

            // 2. Create Minimized Bubble
            const bubble = document.createElement('div');
            bubble.id = 'citi-minimized-bubble';
            bubble.style.cssText = BUBBLE_STYLE;
            bubble.style.display = isMinimized ? 'flex' : 'none'; // Apply state
            bubble.innerHTML = '🏦';
            bubble.title = "Show Citi Checker";
            document.body.appendChild(bubble);

            // 3. Logic: Minimize
            document.getElementById('citi-minimize-btn').onclick = () => {
                box.style.display = 'none';
                bubble.style.display = 'flex';
                sessionStorage.setItem('citi_ui_minimized', 'true');
            };

            // 4. Logic: Restore
            bubble.onclick = () => {
                bubble.style.display = 'none';
                box.style.display = 'block';
                sessionStorage.setItem('citi_ui_minimized', 'false');
            };

            document.getElementById('citi-scan-btn').onclick = startBackgroundCheck;
            document.getElementById('citi-status-icon').onclick = startBackgroundCheck;
        }

        function startBackgroundCheck() {
            const contentDiv = document.getElementById('citi-result-content');
            contentDiv.innerHTML = '<div style="color:#666; margin-top:10px; font-weight:bold;">⏳ Scanning background...</div>';
            const currentUrl = new URL(window.location.href);
            const path = currentUrl.pathname;
            const params = currentUrl.searchParams;
            const newParams = new URLSearchParams();
            ['checkIn', 'los', 'adults', 'rooms', 'children', 'childAges'].forEach(p => {
                if (params.has(p)) newParams.set(p, params.get(p));
            });
            const searchId = Date.now();
            GM_setValue('citi_search_id', searchId);
            GM_setValue('citi_result', 'PENDING');
            const targetUrl = `https://${CITI_TRAVEL_DOMAIN}${path}?${newParams.toString()}&autoCheck=${searchId}`;
            GM_openInTab(targetUrl, { active: false, insert: true });
            pollForResult(searchId);
        }

        function pollForResult(searchId) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                const result = GM_getValue('citi_result');
                const storedId = GM_getValue('citi_search_id');
                if (result !== 'PENDING' && storedId === searchId) {
                    clearInterval(interval);
                    displayResult(result);
                }
                if (attempts > 30) {
                    clearInterval(interval);
                    displayResult({ error: "Timeout. Hotel likely filtered." });
                }
            }, 1000);
        }

        function displayResult(data) {
            const div = document.getElementById('citi-result-content');
            if (data.error) {
                div.innerHTML = `<div style="color:#D32F2F; font-weight:bold; margin-top:10px; font-size:16px;">❌ ${data.error}</div>`;
            } else if (data.found) {
                 div.innerHTML = `
                    <div style="color:#2E7D32; font-weight:bold; font-size:16px; margin-top:5px;">✅ Available!</div>
                    <div style="font-size:22px; margin:10px 0; font-weight:bold; color:#333;">${data.price}</div>
                    <a href="${data.url}" target="_blank" style="display:block; margin-top:10px; background:#2E7D32; color:white; padding:12px; text-decoration:none; border-radius:8px; font-weight:bold;">Open Citi Tab ↗</a>
                `;
            } else {
                div.innerHTML = `<div style="color:#F57C00; font-weight:bold; margin-top:10px; font-size:16px;">⚠️ Not Found / Empty</div>`;
            }
        }
    }

    // ========================================================================
    // PART 2: CITI TRAVEL PORTAL LOGIC
    // ========================================================================
    if (window.location.hostname.includes(CITI_TRAVEL_DOMAIN)) {
        const urlParams = new URLSearchParams(window.location.search);

        // --- A. WORKER MODE ---
        if (urlParams.has('autoCheck')) {
            const searchId = parseInt(urlParams.get('autoCheck'));
            let attempts = 0;
            const checker = setInterval(() => {
                attempts++;
                const priceEl = document.querySelector('[data-element-name="final-price"], .Price-box, .DisplayPrice, [data-selenium="display-price"]');
                const bodyText = document.body.innerText;
                const soldOut = bodyText.includes("Sold Out") || bodyText.includes("No rooms available") || bodyText.includes("We couldn't find");
                const isBlank = (document.readyState === 'complete') && (attempts > 4) && !priceEl;

                if (priceEl) {
                    reportAndClose(searchId, { found: true, price: priceEl.innerText });
                    clearInterval(checker);
                } else if (soldOut) {
                    reportAndClose(searchId, { found: false, reason: "Sold Out" });
                    clearInterval(checker);
                } else if (isBlank) {
                    reportAndClose(searchId, { found: false, reason: "Blank" });
                    clearInterval(checker);
                }
                if (attempts > 15) {
                    reportAndClose(searchId, { error: "Timeout" });
                    clearInterval(checker);
                }
            }, 1000);

            function reportAndClose(id, data) {
                if (GM_getValue('citi_search_id') === id) {
                    const cleanUrl = new URL(window.location.href);
                    cleanUrl.searchParams.delete('autoCheck');
                    data.url = cleanUrl.toString();
                    GM_setValue('citi_result', data);
                    window.close();
                }
            }
        }
        // --- B. MASTER MODE ---
        else {
            const lastSeen = GM_getValue('citi_tab_last_seen', 0);
            const now = Date.now();
            if (now - lastSeen > SESSION_GRACE_PERIOD_MS) {
                 console.log(`Pulse older than 6 mins. Resetting Keep-Alive.`);
                 GM_setValue('citi_keep_alive_enabled', false);
            }

            setInterval(() => { GM_setValue('citi_tab_last_seen', Date.now()); }, 1000);
            setInterval(createKeepAlivePanel, 2000);
            createKeepAlivePanel();
        }

        function createKeepAlivePanel() {
            // Check if exists
            if (document.getElementById('citi-keep-alive-panel') || document.getElementById('citi-minimized-bubble')) return;
            if (!document.body) return;

            // Check States
            const isEnabled = GM_getValue('citi_keep_alive_enabled', false);
            const isMinimized = sessionStorage.getItem('citi_ui_minimized') === 'true';

            // 1. Create Main Panel
            const panel = document.createElement('div');
            panel.id = 'citi-keep-alive-panel';
            panel.style.cssText = MAIN_STYLE;
            panel.style.display = isMinimized ? 'none' : 'block';

            panel.innerHTML = `
                <div style="font-weight:bold; color:#002D72; margin-bottom:15px; font-size:18px; border-bottom:1px solid #eee; padding-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                    <span>🛡️ Citi Session Guard</span>
                    <span id="citi-minimize-btn" title="Minimize" style="cursor:pointer; font-size:24px; line-height:18px; font-weight:bold;">&minus;</span>
                </div>
                <label style="display:flex; align-items:center; cursor:pointer; background:#f5f5f5; padding:15px; border-radius:10px;">
                    <input type="checkbox" id="citi-ka-toggle" ${isEnabled ? 'checked' : ''} style="transform:scale(1.5); margin-right:15px; cursor:pointer;">
                    <span style="font-size:16px; font-weight:bold; color:#333;">Keep Session Alive</span>
                </label>
                <div id="citi-ka-status" style="font-size:14px; color:#666; margin-top:15px; text-align:center; font-weight:bold;">
                    ${isEnabled ? '🟢 Heartbeat running in background' : '⚪ Disabled (Session may expire)'}
                </div>
                <div style="font-size:12px; color:#999; margin-top:10px; text-align:center;">
                   Detects Popups on Dashboard & Travel
                </div>
            `;
            document.body.appendChild(panel);

            // 2. Create Minimized Bubble
            const bubble = document.createElement('div');
            bubble.id = 'citi-minimized-bubble';
            bubble.style.cssText = BUBBLE_STYLE;
            bubble.style.display = isMinimized ? 'flex' : 'none';
            bubble.innerHTML = '🛡️';
            bubble.title = "Show Session Guard";
            document.body.appendChild(bubble);

            // 3. Logic: Minimize/Restore
            document.getElementById('citi-minimize-btn').onclick = () => {
                panel.style.display = 'none';
                bubble.style.display = 'flex';
                sessionStorage.setItem('citi_ui_minimized', 'true');
            };
            bubble.onclick = () => {
                bubble.style.display = 'none';
                panel.style.display = 'block';
                sessionStorage.setItem('citi_ui_minimized', 'false');
            };

            // 4. Logic: Toggle Heartbeat
            const toggle = document.getElementById('citi-ka-toggle');
            const status = document.getElementById('citi-ka-status');

            toggle.addEventListener('change', (e) => {
                const checked = e.target.checked;
                GM_setValue('citi_keep_alive_enabled', checked);
                if (checked) {
                    status.innerHTML = '🟢 Starting heartbeat...';
                    status.style.color = 'green';
                    openHeartbeatTab();
                    setTimeout(() => { status.innerHTML = '🟢 Heartbeat running in background'; }, 2000);
                } else {
                    status.innerHTML = '🔴 Stopping...';
                    status.style.color = 'red';
                    setTimeout(() => { status.innerHTML = '⚪ Disabled (Session may expire)'; status.style.color = '#666'; }, 2000);
                }
            });

            if (isEnabled) checkHeartbeatHealth();

            function checkHeartbeatHealth() {
                const lastPulse = GM_getValue('citi_heartbeat_last_seen', 0);
                const now = Date.now();
                if (now - lastPulse > 6 * 60 * 1000) {
                    console.log("Heartbeat stale. Restarting/Reconnecting...");
                    openHeartbeatTab();
                }
            }
        }
    }

    // ========================================================================
    // PART 3: UNIVERSAL POPUP DETECTOR & REFRESHER
    // ========================================================================
    if (window.location.href.includes("keepAlive=1") || window.location.hostname.includes("citi.com")) {

        if (window.location.href.includes("keepAlive=1")) {
             console.log("💓 Heartbeat Tab Active - Monitoring for Timeout...");
             document.title = "💓 Citi Heartbeat";
        }

        const shouldRun = GM_getValue('citi_keep_alive_enabled', false);
        const lastMainPulse = GM_getValue('citi_tab_last_seen', 0);
        const tabsDied = (Date.now() - lastMainPulse > (SESSION_GRACE_PERIOD_MS + 5000));

        if (window.location.href.includes("keepAlive=1")) {
            if (!shouldRun || tabsDied) {
                console.log("Stopping heartbeat.");
                GM_setValue('citi_keep_alive_enabled', false);
                window.close();
                return;
            }
            GM_setValue('citi_heartbeat_last_seen', Date.now());
        }

        setInterval(() => {
             if (!GM_getValue('citi_keep_alive_enabled', false)) return;

             // DASHBOARD DETECTOR
             const dashboardModal = document.querySelector('.citi-modal[style*="block"]');
             const dashboardHeader = document.querySelector('h1[level="2"]');
             const isDashboardTimeout = (dashboardModal) || (dashboardHeader && dashboardHeader.innerText.includes("Session Time-Out"));

             // TRAVEL PORTAL DETECTOR
             const travelPopup = document.querySelector('.SessionTimeout__Popup') ||
                                 document.getElementById('session-modal-title') ||
                                 document.querySelector('button[data-selenium="continue-session-button"]');

             if (isDashboardTimeout || travelPopup) {
                 console.log("⚠️ TIMEOUT POPUP DETECTED! PREPARING RANDOMIZED REFRESH...");

                 const minDelay = 5000;
                 const maxDelay = 20000;
                 const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);

                 console.log(`Refreshing in ${Math.round(randomDelay/1000)} seconds.`);

                 setTimeout(() => {
                     window.location.reload();
                 }, randomDelay);

                 GM_setValue('citi_heartbeat_last_seen', Date.now());
             }
        }, 2000);

        if (window.location.href.includes("keepAlive=1")) {
            setTimeout(() => {
                console.log("Failsafe refresh (18 mins).");
                window.location.reload();
            }, 18 * 60 * 1000);
        }
    }

})();