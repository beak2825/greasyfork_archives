// ==UserScript==
// @name         Faction Vault - Member & Management
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Faction vault requests with management dashboard for bankers.
// @author       Deviyl[3722358]
// @icon         https://deviyl.github.io/icons/moneybag-green.png
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @connect      api.torn.com
// @connect      firebaseio.com
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/562127/Faction%20Vault%20-%20Member%20%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/562127/Faction%20Vault%20-%20Member%20%20Management.meta.js
// ==/UserScript==

// Special thanks to Wolfylein[3913421] for the amazing support.
//
// ** This script took many, many hours and, as you can see, a lot of coding. It is for sale and will require a small bit of initial setup, which I am happy to walk faction leadership through as part of the cost.
// ** If you see this floating around and would like to make it work for your faction, please contact Deviyl[3722358]. =)
//
// API KEY USAGE
// Your API key, and all other settings inputs, are not submitted to the database and are not stored anywhere outside of your local GM storage.
// The only thing submitted to the database is your user id, request amount, lastaction timestamp, user name, online preference, request expiration, and submit timestamp.
//
// MEMBERS
// If you are a faction member, this script will inject a UI for you to submit requests to your leadership team for money from your faction vault and sync to a database visible by any banker.
// This submits your request to an external database so that it can sync to management and track fulfillment.
//
// BANKERS
// If you have banker status in your faction, the script will inject another UI for you to view any submitted requests and fulfill them.
// This will sync across all bankers and delete requests once fulfilled.
//
// DISCORD
// There is an optional Discord webhook integration that can send messages to your Discord channel as well (and even ping a user or a role).
//
// NOTES
// Please always be mindful of the clicks you make to ensure nothing crazy has happened.
// TornPDA has stressed me out more than it should have during this project.
// Most things should feel pretty snappy, but in order to keep API requests to a minimum, some things are on a timer.
//
// PAGES
// Currently this vault request/fulfillment container injects into the armory page, the travel page, and the destination page.
// So members can request money in torn through the faction armory, while traveling, and when in other cities.
//
// I hope everyone who uses this finds it useful and helps ease their journey through Torn. Always here to help, Deviyl[3722358]. <3


(function() {
    'use strict';

    // -------------------------------------------------------------------------
    // URLS
    // -------------------------------------------------------------------------
    const TORN_API_BASE = "https://api.torn.com";
    const ICON_STATUS = "https://deviyl.github.io/icons/moneybag-green_.png"; // request icon
    const ICON_STATUS_R = "https://deviyl.github.io/icons/moneybag-red_.png"; // banker queue icon

    // -------------------------------------------------------------------------
    // GLOBAL VARIABLES AND STATE
    // -------------------------------------------------------------------------
    const SETTINGS_KEY = "torn_vault_settings";
    const ACTIVE_REQ_KEY = "torn_vault_has_active";

    function getSettings() {
        return GM_getValue(SETTINGS_KEY, {
            tornApiKey: "",
            firebaseUrl: "",
            firebaseApiKey: "",
            discordWebhook: "",
            discordPingID: "",
            discordPingType: "role"
        });
    }

    let settings = getSettings();
    let cachedApiData = {
        name: "",
        id: GM_getValue("last_known_player_id", ""),
        position: GM_getValue("last_known_position", ""),
        isBanker: GM_getValue("last_known_is_banker", 0),
        vaultBalance: 0,
        lastAction: 0
    };

    let tornValid = !!settings.tornApiKey;
    let firebaseValid = !!(settings.firebaseUrl && settings.firebaseApiKey);
    let hasActiveRequest = GM_getValue(ACTIVE_REQ_KEY, false);
    let activeData = null;
    let pollInterval = null;
    let timerInterval = null;
    let mgmtPollInterval = null;
    let lastApiCall = 0;
    let mgmtTimerInterval = null;
    let isFetchingQueue = false;

    // -------------------------------------------------------------------------
    // STYLES
    // -------------------------------------------------------------------------
    const style = document.createElement('style');
    style.innerHTML = `
        #vault-timeout-mins::-webkit-outer-spin-button, #vault-timeout-mins::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        #vault-timeout-mins { -moz-appearance: textfield; }
        .vault-error-link { color: #3777ce; text-decoration: underline; cursor: pointer; font-weight: bold; }
        .vault-shield-msg { font-size: 12px; color: #bbb; line-height: 1.5; margin-bottom: 8px; border-left: 2px solid #b32d2d; padding-left: 8px; }
        .vault-setting-label { display: block; font-size: 10px; color: #888; margin-bottom: 2px; text-transform: uppercase; font-weight: bold; }

        .vault-switch { position: relative; display: inline-block; width: 80px; height: 20px; }
        .vault-switch input { opacity: 0; width: 0; height: 0; }
        .vault-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .4s; border-radius: 20px; border: 1px solid #555; }
        .vault-slider:before { position: absolute; content: ""; height: 14px; width: 34px; left: 3px; bottom: 2px; background-color: #3777ce; transition: .4s; border-radius: 10px; }
        input:checked + .vault-slider:before { transform: translateX(38px); }
        .vault-switch-text { position: absolute; width: 100%; height: 100%; font-size: 9px; line-height: 20px; color: #fff; font-weight: bold; pointer-events: none; display: flex; justify-content: space-around; padding: 0 4px; box-sizing: border-box; }

        .q-btn:hover { background: #555 !important; }
        #vault-submit:hover:not(:disabled) { background: #4a8ce2 !important; }
        #vault-cancel:hover { background: #d63636 !important; }

        /* Management Styles */
        .mgmt-card { background: #222; border: 1px solid #444; border-radius: 4px; padding: 8px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
        .mgmt-user { font-weight: bold; font-size: 13px; color: #fff; text-decoration: none; }
        .mgmt-user:hover { text-decoration: underline; }
        .mgmt-amt { color: #6fb33d; font-weight: bold; font-size: 13px; }
        .mgmt-status-dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .status-online { background-color: #6fb33d; }
        .status-idle { background-color: #f2b33d; }
        .status-offline { background-color: #b32d2d; }
    `;
    document.head.appendChild(style);

    // -------------------------------------------------------------------------
    // UTILITY FUNCTIONS
    // -------------------------------------------------------------------------
    const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const parseMoney = (val) => parseInt(val.toString().replace(/[^0-9]/g, "")) || 0;

    function getDbUrl(path, overrideMethod = null) {
        if (!settings.firebaseUrl || !settings.firebaseApiKey) return null;
        const base = settings.firebaseUrl.replace(/\/$/, "");
        let url = `${base}${path}.json?auth=${settings.firebaseApiKey}`;
        if (overrideMethod) url += `&x-http-method-override=${overrideMethod}`;
        return url;
    }

    function isTargetPage() {
        const url = window.location.href;
        return (url.includes('factions.php?step=your') && url.includes('tab=armoury')) || url.includes('sid=travel');
    }

    function getStatusClass(lastActionTs) {
        const diff = (Date.now() / 1000) - lastActionTs;
        if (diff < 300) return 'status-online';
        if (diff < 1800) return 'status-idle';
        return 'status-offline';
    }

    // -------------------------------------------------------------------------
    // DISCORD FUNCTIONALITY
    // -------------------------------------------------------------------------
    function sendDiscordPing(customMsg = null, isTest = false, isCanceled = false, isExpired = false, isFilled = false, filledUser = null, filledAmount = null) {
        if (!settings.discordWebhook) return;

        let content = "";
        let pingPrefix = settings.discordPingType === 'role' ? '<@&' : '<@';
        let ping = settings.discordPingID ? `${pingPrefix}${settings.discordPingID}>` : '';

        const header = `### --- Vault Bot ---`;
        const profileLink = `[${cachedApiData.name} [${cachedApiData.id}]](https://www.torn.com/profiles.php?XID=${cachedApiData.id})`;
        const armoryLink = `[Fulfill](https://www.torn.com/factions.php?step=your#/tab=armoury)`;

        if (isTest) {
            content = `${header}\n > ⚙️ **TEST PING** — ${customMsg}`;
        }
        else if (isCanceled) {
            content = `${header}\n > 🔴 **CANCELED** — ${profileLink} cancelled their request.`;
        }
        else if (isExpired) {
            content = `${header}\n > 🟡 **EXPIRED** — ${profileLink} - the request expired.`;
        }
        else if (isFilled) {
            content = `${header}\n > 🟢 **FILLED** — **${filledUser}'s** request for $${formatMoney(filledAmount)} was filled by ${profileLink}`;
        }
        else if (customMsg) {
            content = `${header}\n > ${customMsg}`;
        }
        else { //new request
            const amountStr = document.getElementById('vault-amount')?.value || "0";
            const isPrefOnline = document.getElementById('vault-pref-online')?.checked;
            const timeoutMins = isPrefOnline ? (document.getElementById('vault-timeout-mins')?.value || "0") : "0";
            const timeoutText = timeoutMins !== "0" ? ` (Expires in: ${timeoutMins}m)` : " (No Expiration)";
            content = `${header}\n > 🔵 **NEW REQUEST** — ${ping} — ${profileLink} requested **$${amountStr}**${timeoutText}. ${armoryLink}`;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: settings.discordWebhook,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ "content": content }),
            onload: function(r) {
                if (isTest) {
                    const testBtn = document.getElementById('vault-test-discord');
                    if (testBtn) {
                        testBtn.innerText = "SENT!";
                        setTimeout(() => { testBtn.innerText = "TEST PING"; }, 2000);
                    }
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // API AND DATA FETCHING
    // -------------------------------------------------------------------------
    async function fetchFactionRankInfo(apiKey, playerId) {
        if (!apiKey || !playerId) return;
        GM_xmlhttpRequest({
            method: "GET", url: `${TORN_API_BASE}/faction/?selections=&key=${apiKey}`,
            onload: (r) => {
                try {
                    const data = JSON.parse(r.responseText);
                    if (data.members && data.members[playerId]) {
                        const posName = data.members[playerId].position;
                        cachedApiData.position = posName;
                        GM_setValue("last_known_position", posName);
                        GM_xmlhttpRequest({
                            method: "GET", url: `${TORN_API_BASE}/faction/?selections=positions&key=${apiKey}`,
                            onload: (pr) => {
                                try {
                                    const posMap = JSON.parse(pr.responseText);
                                    if (posMap.positions && posMap.positions[posName]) {
                                        const isBanker = posMap.positions[posName].canGiveMoney || 0;
                                        cachedApiData.isBanker = isBanker;
                                        GM_setValue("last_known_is_banker", isBanker);
                                        updateHeaderTitle();
                                        const mgmt = document.getElementById('vault-management-container');
                                        if (mgmt) mgmt.style.display = isBanker ? 'block' : 'none';
                                    }
                                } catch (e) {}
                            }
                        });
                    }
                } catch (e) {}
            }
        });
    }

    async function fetchTornData(force = false) {
        const now = Date.now();
        if (!force && (now - lastApiCall < 30000)) return;
        if (!settings.tornApiKey) return;
        lastApiCall = now;
        GM_xmlhttpRequest({
            method: "GET", url: `${TORN_API_BASE}/v2/user/money/?key=${settings.tornApiKey}`,
            onload: (r) => {
                try {
                    const m = JSON.parse(r.responseText);
                    if (m.error && [2, 10, 13].includes(m.error.code)) { tornValid = false; updateShieldUI(); }
                    if (m?.money?.faction) {
                        cachedApiData.vaultBalance = m.money.faction.money || 0;
                        const span = document.getElementById('balance-amount-span');
                        if (span) span.innerText = formatMoney(cachedApiData.vaultBalance);
                    }
                } catch (e) {}
            }
        });
    }

    function runHeartbeat() {
        if (!GM_getValue(ACTIVE_REQ_KEY, false) || !activeData) return;
        settings = getSettings();
        if (!settings.tornApiKey) { tornValid = false; updateShieldUI(); return; }
        GM_xmlhttpRequest({
            method: "GET", url: `${TORN_API_BASE}/user/?key=${settings.tornApiKey}&selections=`,
            onload: (r) => {
                try {
                    const j = JSON.parse(r.responseText);
                    if (!(j.error && j.error.code === 2)) {
                        cachedApiData.name = j.name;
                        cachedApiData.id = j.player_id;
                        cachedApiData.lastAction = j.last_action.timestamp;
                        GM_setValue("last_known_player_id", j.player_id);

                        const dbUrl = getDbUrl(`/vaultRequests/${cachedApiData.id}`);
                        if (dbUrl) {
                            GM_xmlhttpRequest({
                                method: "GET", url: dbUrl, onload: (res) => {
                                    if (!activeData || !hasActiveRequest) return;
                                    const data = JSON.parse(res.responseText);
                                    if (data && data.name) {
                                        hasActiveRequest = true; GM_setValue(ACTIVE_REQ_KEY, true); activeData = data;
                                        GM_xmlhttpRequest({
                                            method: "POST", url: getDbUrl(`/vaultRequests/${cachedApiData.id}`, "PATCH"),
                                            data: JSON.stringify({ lastAction: cachedApiData.lastAction }),
                                            headers: { "Content-Type": "application/json", "X-HTTP-Method-Override": "PATCH" }
                                        });
                                        if (isTargetPage()) updateUI(data);
                                    } else {
                                        hasActiveRequest = false; GM_setValue(ACTIVE_REQ_KEY, false); activeData = null;
                                        if (isTargetPage()) resetUI();
                                    }
                                    updateStatusIcon();
                                }
                            });
                        }
                    }
                } catch(e) {}
            }
        });
    }

    function updateManagementList() {
        if (!settings.firebaseUrl || settings.firebaseUrl === "") return;
        const listContainer = document.getElementById('vault-mgmt-list');
        if (!listContainer || !isTargetPage()) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: getDbUrl("/vaultRequests") + (getDbUrl("/vaultRequests").includes('?') ? '&' : '?') + 't=' + Date.now(),
            onload: (res) => {
                try {
                    if (!res) return;
                    const raw = res.responseText || res.response || res.responseData;
                    let allReqs = {};

                    if (raw) {
                        if (typeof raw === 'object') {
                            allReqs = raw;
                        } else if (typeof raw === 'string' && raw.trim() !== "" && raw !== "null") {
                            allReqs = JSON.parse(raw);
                        }
                    }
                    if (!allReqs || typeof allReqs !== 'object') allReqs = {};

                    const purgeBtn = document.getElementById('vault-mgmt-purge');
                    const keys = Object.keys(allReqs);

                    if (keys.length === 0) {
                        listContainer.innerHTML = '<p style="color:#888; font-size:11px; text-align:center; padding: 10px;">No active requests.</p>';
                        if (mgmtTimerInterval) clearInterval(mgmtTimerInterval);
                        if (purgeBtn) purgeBtn.style.display = 'none';
                        return;
                    }

                    const formatDuration = (ms) => {
                        const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
                        const h = Math.floor(totalSeconds / 3600);
                        const m = Math.floor((totalSeconds % 3600) / 60);
                        const s = totalSeconds % 60;
                        return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
                    };

                    let html = '';
                    keys.sort((a, b) => (allReqs[a].timestamp || 0) - (allReqs[b].timestamp || 0))
                        .forEach(uid => {
                        const r = allReqs[uid];
                        const statusClass = getStatusClass(r.lastAction || 0);
                        const isOnlinePref = (r.pref == 1 || r.pref === true || r.pref === "true");
                        const prefText = isOnlinePref ? '<span style="color:#00ff00;">Online</span>' : '<span style="color:#ff4444;">Anytime</span>';

                        const startTime = parseInt(r.timestamp);
                        const timeoutMins = parseInt(r.timeout) || 0;
                        const expiryTime = startTime + (timeoutMins * 60 * 1000);

                        html += `
                            <div class="mgmt-card" style="display: flex; align-items: center; justify-content: space-between; background: #222; padding: 8px; border-radius: 3px; margin-bottom: 5px; border-left: 3px solid #444;">
                                <div style="flex: 2;">
                                    <span class="mgmt-status-dot ${statusClass}"></span>
                                    <a href="/profiles.php?XID=${r.id}" class="mgmt-user" style="color:#fff; text-decoration:none; font-size:12px; font-weight: bold;">${r.name} [${r.id}]</a>
                                    <div style="font-size:10px; color:#888; margin-top:2px; padding-left:13px;">$${formatMoney(r.amount)}</div>
                                </div>
                                <div style="flex: 2; text-align: center; font-size: 11px;">
                                    <div style="font-weight: 500; font-size: 10px;">${prefText}</div>
                                    <div class="mgmt-timer"
                                         data-start="${startTime}"
                                         data-expiry="${expiryTime}"
                                         data-pref="${isOnlinePref}"
                                         style="font-size:10px; color:#aaa; margin-top:2px; font-family: monospace;">--:--:--</div>
                                </div>
                                <div style="flex: 1; text-align: right;">
                                    <button class="mgmt-pay-btn"
                                        data-id="${r.id}"
                                        data-name="${r.name}"
                                        data-amt="${r.amount}"
                                        style="background:#3777ce; color:white; border:none; padding:4px 8px; border-radius:3px; cursor:pointer; font-size:11px; font-weight:bold;">PAY</button>
                                </div>
                            </div>
                        `;
                    });

                    listContainer.innerHTML = html;
                    listContainer.querySelectorAll('.mgmt-pay-btn').forEach(btn => {
                        btn.addEventListener('click', () => fulfillRequest(btn.dataset.id, btn.dataset.name, btn.dataset.amt));
                    });

                    const runTick = () => {
                        let anyExpired = false;
                        const timers = listContainer.querySelectorAll('.mgmt-timer');

                        timers.forEach(t => {
                            const isOnlinePref = t.dataset.pref === "true";
                            const now = Date.now();

                            if (isOnlinePref) {
                                const remaining = parseInt(t.dataset.expiry) - now;
                                t.innerText = formatDuration(remaining);

                                if (remaining <= 0) {
                                    t.style.color = "#ff4444";
                                    t.style.fontWeight = "bold";
                                    anyExpired = true;
                                }
                            } else {
                                const elapsed = now - parseInt(t.dataset.start);
                                t.innerText = formatDuration(elapsed);
                            }
                        });
                        if (purgeBtn) {
                            purgeBtn.style.display = anyExpired ? 'inline-block' : 'none';
                        }
                    };

                    if (mgmtTimerInterval) clearInterval(mgmtTimerInterval);
                    runTick();
                    mgmtTimerInterval = setInterval(runTick, 1000);

                } catch(e) {
                    console.error("Vault Management Refresh Error:", e);
                }
            }
        });
    }

    async function fulfillRequest(userId, userName, amount) {
        sendDiscordPing(null, false, false, false, true, userName, amount);

        const deleteUrl = getDbUrl(`/vaultRequests/${userId}`, "DELETE");
        if (deleteUrl) {
            GM_xmlhttpRequest({
                method: "POST",
                url: deleteUrl,
                headers: { "X-HTTP-Method-Override": "DELETE" },
                onload: () => {
                    window.location.href = `https://www.torn.com/factions.php?step=your#/tab=controls&option=give-to-user&giveMoneyTo=${userId}&money=${amount}`;
                }
            });
        }
    }

    function purgeExpiredRequests() {
        const btn = document.getElementById('vault-mgmt-purge');
        if (!btn || btn.innerText === "PURGING...") return;

        btn.innerText = "PURGING...";
        btn.style.opacity = "0.7";

        GM_xmlhttpRequest({
            method: "GET",
            url: getDbUrl("/vaultRequests"),
            onload: (res) => {
                try {
                    const allReqs = JSON.parse(res.responseText);
                    if (!allReqs) {
                        btn.innerText = "PURGE EXPIRED";
                        btn.style.opacity = "1";
                        return;
                    }

                    const now = Date.now();
                    const expiredUserLinks = [];
                    const deleteExpired = [];

                    Object.keys(allReqs).forEach(userId => {
                        const data = allReqs[userId];
                        const limit = (data.timeout || 0) * 60 * 1000;

                        if (data.pref == 1 && limit > 0 && (now - data.timestamp) >= limit) {
                            const profileLink = `[${data.name} [${data.id}]](https://www.torn.com/profiles.php?XID=${data.id})`;
                            expiredUserLinks.push(profileLink);

                            const action = new Promise((resolve) => {
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: getDbUrl(`/vaultRequests/${userId}`),
                                    headers: { "X-HTTP-Method-Override": "DELETE" },
                                    onload: () => resolve(),
                                    onerror: () => {
                                        console.warn(`Failed to delete request for ${userId}`);
                                        resolve();
                                    }
                                });
                            });
                            deleteExpired.push(action);
                        }
                    });

                    if (deleteExpired.length > 0) {
                        Promise.all(deleteExpired).then(() => {
                            const bankerLink = `[${cachedApiData.name} [${cachedApiData.id}]](https://www.torn.com/profiles.php?XID=${cachedApiData.id})`;
                            const userList = expiredUserLinks.join(', ');
                            const msg = `❌ **PURGED** — ${bankerLink} cleared ${expiredUserLinks.length} expired request(s): ${userList}`;

                            sendDiscordPing(msg);

                            btn.innerText = "PURGE EXPIRED";
                            btn.style.opacity = "1";
                            updateManagementList();
                        });
                    } else {
                        btn.innerText = "PURGE EXPIRED";
                        btn.style.opacity = "1";
                        updateManagementList();
                    }
                } catch (e) {
                    console.error("Purge failed", e);
                    btn.innerText = "PURGE EXPIRED";
                    btn.style.opacity = "1";
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // TOOLTIP AND ICON INJECTION
    // -------------------------------------------------------------------------
    function enableTornStyleTooltip(anchor) {
        let tipEl = null;
        function buildTooltip(text) {
            const el = document.createElement('div');
            el.className = 'tooltip___aWICR tooltipCustomClass___gbI4V';
            el.style = "position: absolute; z-index: 999999; opacity: 0; transition: opacity 0.2s; pointer-events: none;";
            const [title, subtitle] = text.split(' — ');
            el.innerHTML = `<b>${title}</b>${subtitle ? `<div>${subtitle}</div>` : ''}<div class="arrow___yUDKb top___klE_Y" style="left: 50%; transform: translateX(-50%);"><div class="arrowIcon___KHyjw"></div></div>`;
            return el;
        }
        function positionTooltip() {
            if (!tipEl) return;
            const r = anchor.getBoundingClientRect();
            document.body.appendChild(tipEl);
            const left = Math.round(r.left + (r.width - tipEl.offsetWidth) / 2);
            const top = Math.round(r.top - tipEl.offsetHeight - 10);
            tipEl.style.left = `${left + window.scrollX}px`;
            tipEl.style.top = `${top + window.scrollY}px`;
            tipEl.style.opacity = '1';
        }
        anchor.addEventListener('mouseenter', () => { tipEl = buildTooltip(anchor.getAttribute('aria-label')); positionTooltip(); });
        anchor.addEventListener('mouseleave', () => { if (tipEl) { tipEl.remove(); tipEl = null; } });
        anchor.__updateTip = (text) => {
            anchor.setAttribute('aria-label', text);
            if (tipEl) positionTooltip();
        };
    }

    function updateStatusIcon() {
        const iconList = document.querySelector('ul[class*="status-icons"]');
        if (!iconList) return;

        let vaultIcon = document.getElementById('mgmt-vault-notification-icon');
        hasActiveRequest = GM_getValue(ACTIVE_REQ_KEY, false);

        if (hasActiveRequest) {
            let tooltipText = "Current Vault Request";
            if (activeData) {
                const limit = (activeData.timeout || 0) * 60 * 1000,
                      elapsed = Date.now() - activeData.timestamp;
                let timeText = "";
                if (limit !== 0) {
                    const rem = Math.max(0, limit - elapsed),
                          m = Math.floor(rem / 60000),
                          s = Math.floor((rem % 60000) / 1000);
                    timeText = ` (Expires in: ${m}m ${s}s)`;
                }
                tooltipText = `Current Vault Request — $${formatMoney(activeData.amount)}${timeText}`;
            }
            if (!vaultIcon) {
                vaultIcon = document.createElement('li');
                vaultIcon.id = 'mgmt-vault-notification-icon';
                vaultIcon.style = `background-image: url('${ICON_STATUS}'); cursor: pointer;`;
                const a = document.createElement('a'); a.href = "/factions.php?step=your#/tab=armoury";
                a.setAttribute('aria-label', tooltipText); a.style = "display: block; width: 100%; height: 100%;";
                vaultIcon.appendChild(a); enableTornStyleTooltip(a); iconList.appendChild(vaultIcon);
            } else {
                const a = vaultIcon.querySelector('a'); if (a && a.__updateTip) a.__updateTip(tooltipText);
            }
        } else if (vaultIcon) { vaultIcon.remove(); }

        if (isFetchingQueue) return;

        if (cachedApiData.isBanker) {
            isFetchingQueue = true;
            GM_xmlhttpRequest({
                method: "GET",
                url: getDbUrl("/vaultRequests"),
                onload: (res) => {
                    isFetchingQueue = false;
                    try {
                        const allReqs = JSON.parse(res.responseText);
                        const count = (allReqs && res.responseText !== "null") ? Object.keys(allReqs).length : 0;
                        let bankerIcon = document.getElementById('mgmt-banker-queue-icon');

                        if (count > 0) {
                            const tooltipText = `Requests in Queue — ${count}`;
                            if (!bankerIcon) {
                                bankerIcon = document.createElement('li');
                                bankerIcon.id = 'mgmt-banker-queue-icon';
                                bankerIcon.style = `background-image: url('${ICON_STATUS_R}'); cursor: pointer;`;
                                const a = document.createElement('a'); a.href = "/factions.php?step=your#/tab=armoury";
                                a.setAttribute('aria-label', tooltipText); a.style = "display: block; width: 100%; height: 100%;";
                                bankerIcon.appendChild(a); enableTornStyleTooltip(a); iconList.appendChild(bankerIcon);
                            } else {
                                const a = bankerIcon.querySelector('a');
                                if (a && a.__updateTip) a.__updateTip(tooltipText);
                                else a.setAttribute('aria-label', tooltipText);
                            }
                        } else if (bankerIcon) {
                            bankerIcon.remove();
                        }
                    } catch (e) {
                        let bIcon = document.getElementById('mgmt-banker-queue-icon');
                        if (bIcon) bIcon.remove();
                    }
                },
                onerror: () => { isFetchingQueue = false; }
            });
        } else {
            let bIcon = document.getElementById('mgmt-banker-queue-icon');
            if (bIcon) bIcon.remove();
        }
    }

    // -------------------------------------------------------------------------
    // UI CONSTRUCTION AND SHIELD LOGIC
    // -------------------------------------------------------------------------
    function updateHeaderTitle() {
        const titleEl = document.getElementById('vault-title-click');
        if (!titleEl) return;
        const isCollapsed = localStorage.getItem('torn_vault_collapsed') === 'true';
        if (!isCollapsed) {
            //position verification test
            //const posSuffix = cachedApiData.position ? ` - ${cachedApiData.position.toUpperCase()}` : "";
            //const bankerSuffix = ` - ${cachedApiData.isBanker}`;
            //titleEl.innerText = `VAULT BALANCE REQUEST${posSuffix}${bankerSuffix}`;
            titleEl.innerText = `VAULT BALANCE REQUEST`;
        } else {
            titleEl.innerText = 'Member Vault Requests';
        }
    }

    function updateShieldUI() {
        const inputArea = document.getElementById('vault-input-area'), shield = document.getElementById('vault-shield'), statusArea = document.getElementById('vault-status-area');
        if (!inputArea || !shield || !statusArea) return;
        settings = getSettings();
        shield.innerHTML = "";
        const tornIssues = !settings.tornApiKey || tornValid === false;
        const firebaseIssues = !settings.firebaseUrl || !settings.firebaseApiKey || firebaseValid === false;
        if (!tornIssues && !firebaseIssues) {
            shield.style.display = 'none';
            if (hasActiveRequest) { inputArea.style.display = 'none'; statusArea.style.display = 'block'; }
            else { inputArea.style.display = 'block'; statusArea.style.display = 'none'; }
            return;
        }
        inputArea.style.display = 'none'; statusArea.style.display = 'none'; shield.style.display = 'block';
        if (tornIssues) {
            const div = document.createElement('div'); div.className = 'vault-shield-msg';
            div.innerHTML = `Please enter a valid limited API Key in <span class="vault-error-link" id="link-set-1">Settings</span>.`;
            shield.appendChild(div); document.getElementById('link-set-1')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('vault-settings-trigger').click(); });
        }
        if (firebaseIssues) {
            const div = document.createElement('div'); div.className = 'vault-shield-msg';
            div.innerHTML = `Please enter a valid Firebase URL and Secret Key in <span class="vault-error-link" id="link-set-2">Settings</span>.`;
            shield.appendChild(div); document.getElementById('link-set-2')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('vault-settings-trigger').click(); });
        }
    }

    function toggleCollapse() {
        const content = document.getElementById('vault-collapsible-content'), arrow = document.getElementById('vault-collapse-arrow');
        const hidden = content.style.display === 'none';
        content.style.display = hidden ? 'block' : 'none';
        arrow.innerText = hidden ? '▼' : '▶';
        localStorage.setItem('torn_vault_collapsed', hidden ? 'false' : 'true');
        updateHeaderTitle();
    }

    function toggleMgmtCollapse() {
        const content = document.getElementById('vault-mgmt-content'), arrow = document.getElementById('vault-mgmt-arrow');
        const hidden = content.style.display === 'none';
        content.style.display = hidden ? 'block' : 'none';
        arrow.innerText = hidden ? '▼' : '▶';
        localStorage.setItem('torn_vault_mgmt_collapsed', hidden ? 'false' : 'true');
    }

    function injectUI() {
        updateStatusIcon();
        const existingReq = document.getElementById('vault-request-container');
        const existingMgmt = document.getElementById('vault-management-container');

        if (!isTargetPage()) {
            if (existingReq) existingReq.remove();
            if (existingMgmt) existingMgmt.remove();
            return;
        } else {
            updateManagementList();
            if (typeof fetchTornData === "function") fetchTornData(false);
            if (existingReq && existingMgmt) {
                updateManagementList();
                return;
            }
        }

        const isCollapsed = localStorage.getItem('torn_vault_collapsed') === 'true';
        const isMgmtCollapsed = localStorage.getItem('torn_vault_mgmt_collapsed') === 'true';
        const prefOnline = localStorage.getItem('torn_vault_pref_online') === 'true';
        const savedTimeout = localStorage.getItem('torn_vault_timeout_mins') || "10";

        const container = document.createElement('div');
        container.id = 'vault-request-container';
        container.style = "background: #333; border: 1px solid #444; border-radius: 5px; padding: 12px; margin: 10px 0; color: #fff; font-family: Arial, sans-serif;";

        container.innerHTML = `
            <div id="vault-header-row" style="display: flex; align-items: center; justify-content: space-between; user-select: none;">
                <b id="vault-title-click" style="font-size: 13px; color: #ddd; letter-spacing: 0.5px; font-weight: bold; cursor: pointer; flex-grow: 1;"></b>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span id="vault-settings-trigger" style="cursor: pointer; font-size: 16px; color: #aaa; line-height: 1;">⚙</span>
                    <span id="vault-collapse-arrow" style="cursor: pointer; font-size: 12px; color: #aaa;">${isCollapsed ? '▶' : '▼'}</span>
                </div>
            </div>
            <div id="vault-settings-modal" style="display:none; background: #222; border: 1px solid #555; padding: 10px; margin-top: 10px; border-radius: 3px;">
                <label class="vault-setting-label">Torn Limited API Key:</label>
                <input type="text" id="set-torn-key" placeholder="Torn Limited API Key" value="${settings.tornApiKey}" style="width:100%; margin-bottom:8px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                <label class="vault-setting-label">Firebase URL:</label>
                <input type="text" id="set-fb-url" placeholder="Firebase URL" value="${settings.firebaseUrl}" style="width:100%; margin-bottom:8px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                <label class="vault-setting-label">Firebase Secret Key:</label>
                <input type="text" id="set-fb-key" placeholder="Firebase Secret Key" value="${settings.firebaseApiKey}" style="width:100%; margin-bottom:12px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                <hr style="border: 0; border-top: 1px solid #444; margin: 10px 0;">
                <label class="vault-setting-label">Discord Webhook (Optional):</label>
                <input type="text" id="set-discord-webhook" placeholder="https://discord.com/api/webhooks/..." value="${settings.discordWebhook || ''}" style="width:100%; margin-bottom:8px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                <div id="discord-extra-settings" style="display: ${settings.discordWebhook ? 'block' : 'none'};">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                        <label class="vault-setting-label" style="margin: 0;">Ping User/Role ID (optional):</label>
                        <label class="vault-switch">
                            <input type="checkbox" id="set-discord-type" ${settings.discordPingType === 'user' ? 'checked' : ''}>
                            <span class="vault-slider"></span>
                            <div class="vault-switch-text"><span>ROLE</span><span>USER</span></div>
                        </label>
                    </div>
                    <input type="text" id="set-discord-id" placeholder="ID Number" value="${settings.discordPingID || ''}" style="width:100%; margin-bottom:12px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                    <button id="vault-test-discord" style="width: 100%; background: #444; color: #fff; border: 1px solid #555; padding: 4px; border-radius: 2px; cursor: pointer; margin-bottom: 12px; font-size: 10px;">TEST PING</button>
                </div>
                <button id="vault-save-settings" style="width: 100%; background: #3777ce; color: #fff; border: none; padding: 5px; border-radius: 2px; cursor: pointer;">SAVE & VALIDATE</button>
            </div>
            <div id="vault-collapsible-content" style="display: ${isCollapsed ? 'none' : 'block'}; margin-top: 12px;">
                <div id="vault-shield" style="display: none;"></div>
                <div id="vault-input-area" style="display: none;">
                    <div style="display: flex; gap: 5px; margin-bottom: 12px; flex-wrap: wrap;">
                        ${[1, 2, 5, 10, 15].map(n => `<button class="q-btn" data-amt="${n*1000000}" style="background:#444; color:white; border:1px solid #555; padding:4px 10px; border-radius:3px; cursor:pointer; font-size:11px;">${n}m</button>`).join('')}
                        <button id="btn-full" style="background:#444; color:white; border:1px solid #555; padding:4px 10px; border-radius:3px; cursor:pointer; font-size:11px;">FULL</button>
                    </div>
                    <div style="position: relative; width: 100%; margin-bottom: 10px;">
                        <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #888; font-weight: bold;">$</span>
                        <input type="text" id="vault-amount" placeholder="0" style="width: 100%; box-sizing: border-box; padding: 8px 10px 8px 25px; border: 1px solid #555; background: #222; color: #fff; border-radius: 3px; font-size: 16px;">
                    </div>
                    <div style="display: flex; align-items: center; min-height: 24px; font-size: 12px; color: #ccc; margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <input type="checkbox" id="vault-pref-online" ${prefOnline ? 'checked' : ''}>
                            <label for="vault-pref-online" style="cursor:pointer; white-space: nowrap;">Request Fulfillment when Online</label>
                        </div>
                        <div id="timeout-input-wrapper" style="display: ${prefOnline ? 'flex' : 'none'}; align-items: center; gap: 6px; margin-left: 15px;">
                            <span style="color: #888; white-space: nowrap;">Timeout in:</span>
                            <input type="number" id="vault-timeout-mins" value="${savedTimeout}" style="width: 38px; background: #222; color: #fff; border: 1px solid #555; text-align: center; border-radius: 2px;">
                            <span style="color: #888; white-space: nowrap;">minutes</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <p style="color: #aaa; font-size: 12px; margin: 0;">Balance: <span style="color: #fff; font-weight: bold;">$<span id="balance-amount-span">${formatMoney(cachedApiData.vaultBalance)}</span></span></p>
                        <button id="vault-submit" style="padding: 6px 15px; cursor: pointer; background: #3777ce; color: #fff; border: none; border-radius: 3px; font-weight: bold;">Submit Request</button>
                        <p id="vault-error" style="color: #ff4444; font-size: 11px; margin: 0; display: none; margin-left: 5px;">⚠ Over balance!</p>
                    </div>
                </div>
                <div id="vault-status-area" style="display: none;">
                    <p id="vault-status-text" style="margin-bottom: 10px; font-size: 13px;"></p>
                    <button id="vault-cancel" style="padding: 6px 15px; cursor: pointer; background: #b32d2d; color: #fff; border: none; border-radius: 3px;">Cancel Request</button>
                </div>
            </div>
        `;

        // MANAGEMENT CONTAINER
        const mgmtContainer = document.createElement('div');
        mgmtContainer.id = 'vault-management-container';
        mgmtContainer.style = `background: #333; border: 1px solid #444; border-radius: 5px; padding: 12px; margin: 10px 0; color: #fff; font-family: Arial, sans-serif; display: ${cachedApiData.isBanker ? 'block' : 'none'};`;
        mgmtContainer.innerHTML = `
            <div id="vault-mgmt-header" style="display: flex; align-items: center; justify-content: space-between; user-select: none; cursor: pointer;">
                <div id="vault-mgmt-title-click" style="display: flex; align-items: center; gap: 10px; flex-grow: 1;">
                    <b style="font-size: 13px; color: #ddd; letter-spacing: 0.5px; font-weight: bold;">Banker Dashboard</b>
                    <span id="vault-mgmt-refresh" style="cursor: pointer; font-size: 16px; color: #aaa; line-height: 1; transition: transform 0.3s ease;">⟳</span>
                    <button id="vault-mgmt-purge" style="background: #b32d2d; color: #fff; border: none; padding: 2px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; margin-left: 10px; display: none;">PURGE EXPIRED</button>
                </div>
                <span id="vault-mgmt-arrow" style="font-size: 12px; color: #aaa;">${isMgmtCollapsed ? '▶' : '▼'}</span>
            </div>
            <div id="vault-mgmt-content" style="display: ${isMgmtCollapsed ? 'none' : 'block'}; margin-top: 12px;">
                <div id="vault-mgmt-list">
                    <p style="color:#888; font-size:11px; text-align:center;">Loading requests...</p>
                </div>
            </div>
        `;

        const armoryAnchor = document.querySelector('li.clear');
        const delimiters = document.querySelectorAll('hr.delimiter-999');
        const travelFlightAnchor = delimiters[delimiters.length - 1];
        const travelLandedAnchor = document.querySelector('hr.page-head-delimiter.m-top10.m-bottom10');

        if (armoryAnchor) {
            armoryAnchor.after(container);
            container.after(mgmtContainer);
        } else if (travelLandedAnchor) {
            travelLandedAnchor.after(container);
            container.after(mgmtContainer);
        } else if (travelFlightAnchor) {
            travelFlightAnchor.after(container);
            container.after(mgmtContainer);
        }

        updateHeaderTitle();
        if (hasActiveRequest && activeData) updateUI(activeData);
        updateShieldUI();
        updateManagementList();

        document.getElementById('vault-title-click').addEventListener('click', toggleCollapse);
        document.getElementById('vault-collapse-arrow').addEventListener('click', toggleCollapse);
        document.getElementById('vault-mgmt-header').addEventListener('click', toggleMgmtCollapse);
        document.getElementById('vault-mgmt-refresh').addEventListener('click', (e) => {
             e.stopPropagation();
             const icon = e.target;
             icon.style.transform = 'rotate(360deg)';
             updateManagementList();
             setTimeout(() => { icon.style.transform = 'rotate(0deg)'; }, 300);
        });
        document.getElementById('vault-mgmt-purge').addEventListener('click', (e) => {
            e.stopPropagation();
            purgeExpiredRequests();
        });
        document.getElementById('vault-settings-trigger').addEventListener('click', (e) => {
             e.stopPropagation();
             const m = document.getElementById('vault-settings-modal');
             m.style.display = m.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('vault-save-settings').addEventListener('click', () => {
            const btn = document.getElementById('vault-save-settings'); btn.innerText = "VALIDATING...";
            const newTornKey = document.getElementById('set-torn-key').value.trim(), newFbUrl = document.getElementById('set-fb-url').value.trim(), newFbKey = document.getElementById('set-fb-key').value.trim();
            GM_xmlhttpRequest({
                method: "GET", url: `${TORN_API_BASE}/user/?key=${newTornKey}&selections=`,
                onload: (r) => {
                    const j = JSON.parse(r.responseText);
                    tornValid = !(j.error && [2, 10, 13].includes(j.error.code));
                    if (tornValid && j.player_id) fetchFactionRankInfo(newTornKey, j.player_id);
                    GM_xmlhttpRequest({
                        method: "GET", url: `${newFbUrl.replace(/\/$/, "")}/.json?auth=${newFbKey}&shallow=true`,
                        onload: (res) => {
                            firebaseValid = (res.status === 200);
                            settings.tornApiKey = newTornKey; settings.firebaseUrl = newFbUrl; settings.firebaseApiKey = newFbKey;
                            settings.discordWebhook = document.getElementById('set-discord-webhook').value.trim();
                            settings.discordPingID = document.getElementById('set-discord-id').value.trim();
                            settings.discordPingType = document.getElementById('set-discord-type').checked ? 'user' : 'role';
                            GM_setValue(SETTINGS_KEY, settings);
                            btn.innerText = "SAVE & VALIDATE";
                            if (tornValid && firebaseValid) document.getElementById('vault-settings-modal').style.display = 'none';
                            updateShieldUI(); fetchTornData(true);
                        },
                        onerror: () => { firebaseValid = false; btn.innerText = "SAVE & VALIDATE"; updateShieldUI(); }
                    });
                }
            });
        });
        const webhookInput = document.getElementById('set-discord-webhook');
        const discordExtra = document.getElementById('discord-extra-settings');
        if (webhookInput && discordExtra) {
            webhookInput.addEventListener('input', () => {
                discordExtra.style.display = webhookInput.value.trim() ? 'block' : 'none';
            });
        }

        const testPingBtn = document.getElementById('vault-test-discord');
        if (testPingBtn) {
            testPingBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const liveWebhook = document.getElementById('set-discord-webhook').value.trim();
                const liveID = document.getElementById('set-discord-id').value.trim();
                const liveType = document.getElementById('set-discord-type').checked ? 'user' : 'role';

                if (!liveWebhook) {
                    alert("Please enter a webhook URL first!");
                    return;
                }
                const oldSettings = {
                    url: settings.discordWebhook,
                    id: settings.discordPingID,
                    type: settings.discordPingType
                };
                settings.discordWebhook = liveWebhook;
                settings.discordPingID = liveID;
                settings.discordPingType = liveType;
                sendDiscordPing("Webhook is active and working!", true);
                settings.discordWebhook = oldSettings.url;
                settings.discordPingID = oldSettings.id;
                settings.discordPingType = oldSettings.type;
            });
        }

        document.getElementById('vault-submit').addEventListener('click', submitRequest);
        document.getElementById('vault-cancel').addEventListener('click', () => cancelRequest(true));
        document.getElementById('vault-pref-online').addEventListener('change', (e) => {
            localStorage.setItem('torn_vault_pref_online', e.target.checked);
            document.getElementById('timeout-input-wrapper').style.display = e.target.checked ? 'flex' : 'none';
        });
        document.getElementById('vault-timeout-mins').addEventListener('input', (e) => {
            localStorage.setItem('torn_vault_timeout_mins', e.target.value);
        });
        document.getElementById('vault-amount').addEventListener('input', (e) => {
            const val = parseMoney(e.target.value); e.target.value = formatMoney(val); validateAmount(val);
        });
        container.querySelectorAll('.q-btn').forEach(btn => btn.addEventListener('click', () => {
            const val = parseMoney(btn.dataset.amt); document.getElementById('vault-amount').value = formatMoney(val); validateAmount(val);
        }));
        document.getElementById('btn-full').addEventListener('click', () => {
            const val = cachedApiData.vaultBalance; document.getElementById('vault-amount').value = formatMoney(val); validateAmount(val);
        });
        validateAmount(0);
    }

    // -------------------------------------------------------------------------
    // REQUEST HANDLING
    // -------------------------------------------------------------------------
    function validateAmount(amt) {
        const bal = cachedApiData.vaultBalance, sub = document.getElementById('vault-submit'), err = document.getElementById('vault-error');
        if (!sub || !err) return;
        if (amt > bal || amt <= 0) {
            err.style.display = amt > bal ? 'inline-block' : 'none';
            sub.disabled = true; sub.style.opacity = '0.5'; sub.style.cursor = 'not-allowed';
        } else {
            err.style.display = 'none'; sub.disabled = false; sub.style.opacity = '1'; sub.style.cursor = 'pointer';
        }
    }

    function submitRequest() {
        const amt = parseMoney(document.getElementById('vault-amount').value);
        if (amt <= 0) return;
        const btn = document.getElementById('vault-submit');
        if (btn) { btn.innerText = "Submitting..."; btn.disabled = true; }
        const isPrefOnline = document.getElementById('vault-pref-online').checked;
        const timeoutVal = isPrefOnline ? (parseInt(document.getElementById('vault-timeout-mins').value) || 0) : 0;
        const data = { name: cachedApiData.name, id: cachedApiData.id, amount: amt, pref: isPrefOnline ? 1 : 0, timeout: timeoutVal, timestamp: Date.now(), lastAction: cachedApiData.lastAction };
        hasActiveRequest = true; GM_setValue(ACTIVE_REQ_KEY, true); activeData = data;
        updateStatusIcon();
        GM_xmlhttpRequest({
            method: "POST", url: getDbUrl(`/vaultRequests/${cachedApiData.id}`, "PUT"),
            data: JSON.stringify(data), headers: { "Content-Type": "application/json", "X-HTTP-Method-Override": "PUT" },
            onload: (res) => {
                if (res.status === 200) { updateUI(data); sendDiscordPing(); }
                if (btn) { btn.innerText = "Submit Request"; btn.disabled = false; }
            }
        });
    }

    function cancelRequest(isManual = false, isTimeout = false) {
        hasActiveRequest = false;
        GM_setValue(ACTIVE_REQ_KEY, false);
        activeData = null;
        updateStatusIcon();
        resetUI();
        if (isManual) sendDiscordPing(null, false, true, false);
        if (isTimeout) sendDiscordPing(null, false, false, true);
        GM_xmlhttpRequest({
            method: "POST", url: getDbUrl(`/vaultRequests/${cachedApiData.id}`, "DELETE"),
            headers: { "X-HTTP-Method-Override": "DELETE" }, onload: () => { updateStatusIcon(); }
        });
    }

    function resetUI() {
        if(pollInterval) clearInterval(pollInterval); if(timerInterval) clearInterval(timerInterval);
        const ia = document.getElementById('vault-input-area'), sa = document.getElementById('vault-status-area');
        if (ia && sa) { ia.style.display = 'block'; sa.style.display = 'none'; }
        updateShieldUI();
    }

    function updateUI(data) {
        const ia = document.getElementById('vault-input-area'), sa = document.getElementById('vault-status-area');
        if (!ia || !sa) return;
        ia.style.display = 'none'; sa.style.display = 'block';
        const timer = () => {
            const limit = (data.timeout || 0) * 60 * 1000, elapsed = Date.now() - data.timestamp;
            if (limit !== 0 && elapsed >= limit) { cancelRequest(false, true); } else {
                let timeText = limit === 0 ? "No expiration" : "";
                if (limit !== 0) {
                    const rem = limit - elapsed, m = Math.floor(rem / 60000), s = Math.floor((rem % 60000) / 1000);
                    timeText = `Expires in: ${m}m ${s}s`;
                }
                const st = document.getElementById('vault-status-text');
                if (st) st.innerHTML = `Requesting: <span style="color: #6fb33d; font-weight: bold;">$${formatMoney(data.amount)}</span><br><span style="color: #aaa; font-size: 11px;">${timeText}</span>`;
                updateStatusIcon();
            }
        };
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(() => {
            const dbUrl = getDbUrl(`/vaultRequests/${data.id}`);
            if (dbUrl) {
                GM_xmlhttpRequest({ method: "GET", url: dbUrl, onload: (res) => {
                    if (res.responseText === "null") {
                        hasActiveRequest = false; GM_setValue(ACTIVE_REQ_KEY, false); activeData = null; resetUI(); updateStatusIcon();
                    }
                }});
            }
        }, 20000);
        if (timerInterval) clearInterval(timerInterval); timer(); timerInterval = setInterval(timer, 1000);
    }

    // -------------------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------------------
    runHeartbeat();
    fetchTornData(true);
    setInterval(injectUI, 2000);
    setInterval(runHeartbeat, 30000);
    setInterval(fetchTornData, 60000);
    setInterval(updateManagementList, 10000);
    window.addEventListener('hashchange', injectUI);
    window.addEventListener('popstate', injectUI);

})();