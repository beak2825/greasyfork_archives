// ==UserScript==
// @name         Faction Vault - Member & Management Dev
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Faction vault requests with management dashboard for bankers.
// @author       Deviyl[3722358]
// @icon         https://deviyl.github.io/icons/moneybag-green.png
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @license      CC-BY-NC-ND-4.0
// @connect      api.torn.com
// @connect      firebaseio.com
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/562750/Faction%20Vault%20-%20Member%20%20Management%20Dev.user.js
// @updateURL https://update.greasyfork.org/scripts/562750/Faction%20Vault%20-%20Member%20%20Management%20Dev.meta.js
// ==/UserScript==


/* TERMS OF USE:
     This script is provided under the Creative Commons Attribution-NonCommercial-NoDerivs 4.0
     International License.
       1. AUTHORIZATION: Use of this script is restricted to factions authorized by the developer.
          Unauthorized use is blocked by built-in security features.
       2. COMMERCIAL USE: This script may not be redistributed or used for commercial purposes.
          Authorization is granted solely by the author and may involve in-game (Torn) currency.
       3. MODIFICATION: You may view the source code for security auditing, but redistribution
          of modified versions ("cracks" or forks) is strictly prohibited.
    To request authorization for your faction, please contact Deviyl[3722358] in-game.
 */

/* TORN API DISCLOSURE & USAGE:
     1. KEY STORAGE: Your API key is stored LOCALLY in your browser. It is never sent to the developer or the database.
     2. DATA STORAGE: Vault requests (Username, ID, and Amount) are stored in the faction's Firebase database until fulfilled or deleted.
     3. DATA SHARING: Request data is shared with Faction Bankers and sent via Webhook to the Faction's Discord channel.
     4. ACCESS: This script requires a 'Limited Access' key to function.
        By using this script, you consent to this data flow for the purpose of faction vault management.
*/

//
// Special thanks to Wolfylein[3913421] for the amazing support.
//
// ** This script took many, many hours and, as you can see, a lot of coding. It is for sale and will require a small bit of initial setup, which I am happy to walk faction leadership through as part of the cost.
// ** If you see this floating around and would like to make it work for your faction, please contact Deviyl[3722358]. =)
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
// Members can request money in torn through the faction armory, while traveling, and when in other cities.
//
// I hope everyone who uses this finds it useful and helps ease their journey through Torn.
// Always here to help, Deviyl[3722358]. <3
//


(function() {
    'use strict';

    // -------------------------------------------------------------------------
    // URLS
    // -------------------------------------------------------------------------
    const TORN_API_BASE = "https://api.torn.com";
    const ICON_STATUS = "https://deviyl.github.io/icons/moneybag-green_.png";
    const ICON_STATUS_R = "https://deviyl.github.io/icons/moneybag-red_.png";

    // -------------------------------------------------------------------------
    // GLOBAL VARIABLES AND STATE
    // -------------------------------------------------------------------------
    const currentTabId = Date.now() + Math.random();
    const SETTINGS_KEY = "torn_vault_settings";
    const ACTIVE_REQ_KEY = "torn_vault_has_active";
    const DEBUG_MODE = false;
    const SCRIPT_VERSION = 7.0;
    const API_COMMENT = "&comment=Vault_Request";
    GM_setValue("current_tab_id_temp", currentTabId);

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

    let cachedApiData = GM_getValue("global_user_data") || {
        name: "",
        user_id: "",
        faction_name: "",
        faction_id: "",
        faction_position: "",
        isbanker: 0,
        faction_money_balance: 0,
        last_action: 0,
        status: "Okay"
    };

    let tornValid = !!settings.tornApiKey;
    let firebaseValid = !!(settings.firebaseUrl && settings.firebaseApiKey);
    let hasActiveRequest = GM_getValue(ACTIVE_REQ_KEY, false);
    let authorizedFactionId = "PENDING";
    let isAuthorized = GM_getValue('V_AUTH_STATUS', true);
    let hasDenied = false;
    let discordAvailable = false;
    let activeData = null;
    let pollInterval = null;
    let timerInterval = null;
    let mgmtPollInterval = null;
    let lastApiCall = 0;
    let mgmtTimerInterval = null;
    let isFetchingQueue = false;
    let isSyncing = false;

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

        .vault-version-footnote { font-size: 9px; color: #666; text-align: right; margin-top: 5px; padding-right: 5px; }
        .vault-update-link { color: #3777ce; font-weight: bold; text-decoration: underline; cursor: pointer; }

        /* Management Styles */
        .mgmt-card { background: #222; border: 1px solid #444; border-radius: 4px; padding: 8px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
        .mgmt-user { font-weight: bold; font-size: 13px; color: #fff; text-decoration: none; }
        .mgmt-user:hover { text-decoration: underline; }
        .mgmt-amt { color: #6fb33d; font-weight: bold; font-size: 13px; }
        .mgmt-status-dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .status-online { background-color: #6fb33d; }
        .status-idle { background-color: #f2b33d; }
        .status-offline { background-color: #b32d2d; }
        .mgmt-pay-btn { background: #3777ce; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 11px; font-weight: bold; }
        .mgmt-pay-btn:disabled { background: #444 !important; color: #888 !important; cursor: not-allowed !important; opacity: 0.5; }
        .vault-lock-notice { background: rgba(179, 45, 45, 0.1); border: 1px solid #b32d2d; color: #ff8888; padding: 8px; margin-bottom: 12px; border-radius: 4px; font-size: 11px; text-align: center; line-height: 1.4; }
    `;
    document.head.appendChild(style);

    // -------------------------------------------------------------------------
    // UTILITY FUNCTIONS
    // -------------------------------------------------------------------------
    function vLog(message, style = null, type = 'log', data = null) {
        if (!DEBUG_MODE) return;
        const now = new Date();
        const timestamp = `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        const prefix = '[Vault Script] | ' + timestamp + ' - ';
        if (style) {
            if (data) {
                console.log('%c' + prefix + message, style, data);
            } else {
                console.log('%c' + prefix + message, style);
            }
            return;
        }
        if (type === 'error') {
            data ? console.error(prefix + message, data) : console.error(prefix + message);
        } else if (type === 'warn') {
            data ? console.warn(prefix + message, data) : console.warn(prefix + message);
        } else {
            data ? console.log(prefix + message, data) : console.log(prefix + message);
        }
    }

    const formatMoney = (val) => {
        if (val === undefined || val === null) return "0";
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    const parseMoney = (val) => parseInt(val.toString().replace(/[^0-9]/g, "")) || 0;

    function handleAmountInput(e) {
        const input = e.target;
        const rawValue = input.value;
        const selectionStart = input.selectionStart;
        const numericVal = parseMoney(rawValue);
        const formatted = formatMoney(numericVal);
        input.value = formatted;
        const textBeforeCursor = rawValue.substring(0, selectionStart).replace(/,/g, '');
        let newPos = 0;
        let foundTextCount = 0;

        for (let i = 0; i < formatted.length; i++) {
            if (foundTextCount === textBeforeCursor.length) break;
            if (formatted[i] !== ',') foundTextCount++;
            newPos = i + 1;
        }

        input.setSelectionRange(newPos, newPos);
        validateAmount(numericVal);
    }

    function validateAmount(amt) {
        const bal = cachedApiData.faction_money_balance, sub = document.getElementById('vault-submit'), err = document.getElementById('vault-error');
        if (!sub || !err) return;
        if (amt > bal || amt <= 0) {
            err.style.display = amt > bal ? 'inline-block' : 'none';
            sub.disabled = true; sub.style.opacity = '0.5'; sub.style.cursor = 'not-allowed';
        } else {
            err.style.display = 'none'; sub.disabled = false; sub.style.opacity = '1'; sub.style.cursor = 'pointer';
        }
    }

    function getDbUrl(path, overrideMethod = null) {
        if (!settings.firebaseUrl || !settings.firebaseApiKey) return "";
        const base = settings.firebaseUrl.replace(/\/$/, "");
        let url = `${base}${path}.json?auth=${settings.firebaseApiKey}`;

        if (overrideMethod) {
            url += `&x-http-method-override=${overrideMethod}`;
        }
        return url;
    }

    function isTargetPage() {
        const url = window.location.href;
        return (url.includes('factions.php?step=your') && url.includes('tab=armoury')) || url.includes('sid=travel');
    }

    function getOnlineStatus(lastActionTs) {
        const diff = (Date.now() / 1000) - lastActionTs;
        if (diff < 300) return { class: 'status-online', label: 'Online' };
        if (diff < 1800) return { class: 'status-idle', label: 'Idle' };
        return { class: 'status-offline', label: 'Offline' };
    }

    function refreshUIDisplay() {
        const balSpan = document.getElementById('balance-amount-span');
        if (balSpan) {
            balSpan.innerText = formatMoney(cachedApiData.faction_money_balance);
        }
        const mgmt = document.getElementById('vault-management-container');
        if (mgmt) {
            mgmt.style.display = cachedApiData.isbanker ? 'block' : 'none';
        }
        updateStatusIcon();
    }

    function resetUI() {
        if(pollInterval) clearInterval(pollInterval); if(timerInterval) clearInterval(timerInterval);
        const ia = document.getElementById('vault-input-area'), sa = document.getElementById('vault-status-area');
        if (ia && sa) { ia.style.display = 'block'; sa.style.display = 'none'; }
        updateShieldUI();
    }

    function refreshSettingsUI() {
        const webhookInput = document.getElementById('set-discord-webhook');
        const idInput = document.getElementById('set-discord-id');
        const typeToggle = document.getElementById('set-discord-type');
        const dot = document.getElementById('discord-status-dot');
        const testBtn = document.getElementById('vault-test-discord');
        const keyInput = document.getElementById('set-torn-key');
        const keyHelper = document.getElementById('vault-key-helper');

        if (keyInput && keyHelper) {
            if (!keyInput.value.trim()) {
                keyHelper.innerHTML = `<a href="https://www.torn.com/preferences.php#tab=api?&step=addNewKey&title=Vault%20Request&type=3" target="_blank" style="color: #3777ce; font-size: 10px; text-decoration: underline;">Click here to generate a Limited API Key</a>`;
            } else {
                keyHelper.innerHTML = '';
            }
        }

        if (webhookInput) {
            webhookInput.value = settings.discordWebhook || "";
            webhookInput.dispatchEvent(new Event('input'));
        }

        if (idInput) idInput.value = settings.discordPingID || "";
        if (typeToggle) typeToggle.checked = (settings.discordPingType === 'user');

        if (dot) {
            dot.style.color = discordAvailable ? '#5cb85c' : '#d9534f';
            dot.innerHTML = `● ${discordAvailable ? 'Discord Config Synced' : 'No Discord Config Found'}`;
        }

        if (testBtn) {
            testBtn.style.display = settings.discordWebhook ? 'block' : 'none';
        }
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
        if (!data || !data.id) {
            vLog("No active request data, skipping poll interval setup.");
            return;
        }
        pollInterval = setInterval(() => {
            if (!data || !data.id) {
                clearInterval(pollInterval);
                return;
            }
            const dbUrl = getDbUrl(`/vaultRequests/${data.id}`);
            if (dbUrl) {
                GM_xmlhttpRequest({ method: "GET", url: dbUrl, onload: (res) => {
                    if (res.responseText === "null") {
                        hasActiveRequest = false; GM_setValue(ACTIVE_REQ_KEY, false); activeData = null; resetUI(); updateStatusIcon(); clearInterval(pollInterval);
                    }
                }});
            }
        }, 20000);
        if (timerInterval) clearInterval(timerInterval); timer(); timerInterval = setInterval(timer, 1000);
    }

    function trackApiUsage() {
        const now = Date.now();
        let timestamps = GM_getValue("api_usage_timestamps", []);
        const rollingList = timestamps.filter(ts => now - ts < 60000);
        rollingList.push(now);
        GM_setValue("api_usage_timestamps", rollingList);
        const color = rollingList.length > 80 ? 'color: #ff4444; font-weight: bold;' : 'color: #6fb33d;';
        vLog(`Global API Calls (60s): ${rollingList.length}`, color, 'log', null);
    }

    function isLeader() {
        // sets one tab as the leader so every tab doesn't poll api
        const now = Date.now();
        const lastHeartbeat = GM_getValue("leader_heartbeat", 0);
        const leaderTabId = String(GM_getValue("leader_tab_id", 0));
        const myId = String(currentTabId);
        if (leaderTabId === myId) {
            const color = 'color: #f39c12; font-weight: bold;'
            vLog(`I am the Leader. Tab ID - ${myId}`, color, 'log', null);
            return true;
        }
        if (now - lastHeartbeat > 5000) {
            GM_setValue("leader_heartbeat", now);
            GM_setValue("leader_tab_id", myId);
            const color = 'color: #f39c12; font-weight: bold;'
            vLog(`Leader switched to - ${myId}.`, color, 'log', null);
            return true;
        }
        const color = 'color: #f39c12; font-weight: bold;'
        vLog(`I am a follower. Leader Tab - ${myId}.`, color, 'log', null);
        return false;
    }

    async function checkAuthorization() {
        if (!cachedApiData || !cachedApiData.faction_id) return;

        return new Promise((resolve) => {
            const authUrl = "https://authorizedfactions-default-rtdb.firebaseio.com/authorizedFactions.json";
            GM_xmlhttpRequest({
                method: "GET",
                url: authUrl,
                timeout: 5000,
                onload: (res) => {
                    try {
                        const authorized = JSON.parse(res.responseText);
                        const fid = cachedApiData.faction_id.toString();

                        if (authorized && authorized[fid] === true) {
                            isAuthorized = true;
                            GM_setValue('V_AUTH_STATUS', true);
                        } else {
                            isAuthorized = false;
                            GM_setValue('V_AUTH_STATUS', false);
                            if (!hasDenied) { logDeniedFaction(); hasDenied = true; }
                        }
                        vLog(`Auth | Status: ${isAuthorized ? 'Authorized' : 'DENIED'}`);
                        resolve(isAuthorized);
                    } catch (e) {
                        vLog("Auth | Parse error, using last known status.");
                        resolve(isAuthorized);
                    }
                },
                onerror: () => {
                    vLog("Auth | Network failure, skipping check.");
                    resolve(isAuthorized);
                },
                ontimeout: () => {
                    vLog("Auth | Timeout, skipping check.");
                    resolve(isAuthorized);
                }
            });
        });
    }

    async function logDeniedFaction() {
        if (!cachedApiData || !cachedApiData.faction_id) return;

        const fid = String(cachedApiData.faction_id);
        const fname = String(cachedApiData.faction_name);
        const url = `https://authorizedfactions-default-rtdb.firebaseio.com/deniedRequests/${fname}.json`;

        const data = {
            name: cachedApiData.name,
            userId: cachedApiData.user_id,
            factionID: fid,
            timestamp: new Date().toISOString(),
            version: GM_info.script.version || "1.0.0"
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "X-HTTP-Method-Override": "PUT"
            },
            data: JSON.stringify(data),
            onload: (res) => {
                if (res.status === 200) {
                    vLog(`Security | Denied access logged for Faction ${fid}`);
                }
            }
        });
    }

    async function registerUserInDatabase() {
        if (!cachedApiData || !cachedApiData.user_id) return;
        const baseUrl = `${settings.firebaseUrl.replace(/\/$/, "")}/Management/RegisteredUsers/${cachedApiData.name}.json?auth=${settings.firebaseApiKey}`;
        const data = {
            name: cachedApiData.user_id,
            version: SCRIPT_VERSION,
            lastSeen: new Date().toISOString()
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: baseUrl,
            headers: {
                "Content-Type": "application/json",
                "X-HTTP-Method-Override": "PUT"
            },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status === 200) vLog(`Firebase | Member ${cachedApiData.name} successfully registered.`);
            }
        });
    }

    function checkScriptVersion() {
        const versionUrl = "https://authorizedfactions-default-rtdb.firebaseio.com/version.json";

        GM_xmlhttpRequest({
            method: "GET",
            url: versionUrl,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    const latestVersion = parseFloat(data.rev);
                    const display = document.getElementById('vault-version-display');

                    if (display && latestVersion > SCRIPT_VERSION) {
                        const updateUrl = "https://greasyfork.org/en/scripts/562127-faction-vault-member-management";
                        display.innerHTML = `
                        <a href="${updateUrl}" target="_blank" class="vault-update-link">
                            Update: v${latestVersion.toFixed(1)} Available
                        </a>
                    `;
                        display.style.color = "#ffb33d";
                    }
                } catch (e) {
                    vLog("Version check failed", null, 'error', e);
                }
            }
        });
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
        const profileLink = `[${cachedApiData.name} [${cachedApiData.user_id}]](https://www.torn.com/profiles.php?XID=${cachedApiData.user_id})`;
        const armoryLink = `[Fulfill](https://www.torn.com/factions.php?step=your#/tab=armoury)`;

        if (isTest) content = `${header}\n > ⚙️ **TEST PING** — ${customMsg} — Sent by ${profileLink}`;
        else if (isCanceled) content = `${header}\n > 🔴 **CANCELED** — ${profileLink} cancelled their request.`;
        else if (isExpired) content = `${header}\n > 🟡 **EXPIRED** — ${profileLink} - the request expired.`;
        else if (isFilled) content = `${header}\n > 🟢 **FILLED** — **${filledUser}'s** request for **$${formatMoney(filledAmount)}** is being filled by ${profileLink}`;
        else if (customMsg) content = `${header}\n > ${customMsg}`;
        else { //new request
            const amountStr = document.getElementById('vault-amount')?.value || "0";
            const isPrefOnline = document.getElementById('vault-pref-online')?.checked;
            const timeoutMins = isPrefOnline ? (document.getElementById('vault-timeout-mins')?.value || "0") : "0";
            const timeoutText = timeoutMins !== "0" ? ` (Expires in: ${timeoutMins}m)` : " (No Expiration)";
            content = `${header}\n > 🔵 **NEW REQUEST** — ${ping} — ${profileLink} requested **$${amountStr}**${timeoutText}. ${armoryLink}`;
        }

        const performSend = () => {
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
        };

        // debounce for expired message (so doesn't send twice if pda and pc open)
        if (isExpired) {
            const baseUrl = `${settings.firebaseUrl.replace(/\/$/, "")}/Management/last_ping.json?auth=${settings.firebaseApiKey}`;
            const jitter = Math.floor(Math.random() * 1000) + 500;

            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: baseUrl,
                    onload: function(response) {
                        try {
                            const lastPing = response.responseText ? JSON.parse(response.responseText) : null;
                            const now = Date.now();

                            if (lastPing && lastPing.content === content && Math.abs(now - lastPing.time) < 15000) {
                                vLog("Discord | Duplicate Expired ping blocked (Firebase).", 'color: orange;');
                                return;
                            }
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: baseUrl,
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-HTTP-Method-Override": "PUT"
                                },
                                data: JSON.stringify({ content: content, time: now }),
                                onload: function() {
                                    vLog("Firebase | Ping timestamp updated. Sending to Discord...");
                                    performSend();
                                },
                                onerror: performSend
                            });
                        } catch (e) {
                            vLog("Discord | Debounce parse error, sending anyway.", 'warn', e);
                            performSend();
                        }
                    },
                    onerror: performSend
                });
            }, jitter);
        } else {
            performSend();
        }
    }

    // -------------------------------------------------------------------------
    // API AND DATA FETCHING AND UPDATES
    // -------------------------------------------------------------------------
    async function syncAllData(force = false) {
        if (!settings.tornApiKey) tornValid = false;
        if (!settings.firebaseUrl || !settings.firebaseApiKey) firebaseValid = false;

        if (!settings.tornApiKey) {
            if (typeof updateShieldUI === "function") updateShieldUI();
            return;
        }
        const lastAction = cachedApiData.last_action || 0;
        const isInactive = ((Date.now() / 1000) - lastAction) > 1800;

        if (isInactive && !force) {
            vLog("User is Offline. Sleep Mode to save API calls.");
            return;
        }

        if (!isLeader() && !force) {
            const globalData = GM_getValue("global_user_data");
            if (globalData) {
                Object.assign(cachedApiData, globalData);
                if (typeof updateShieldUI === "function") updateShieldUI();

                const balSpan = document.getElementById('balance-amount-span');
                if (balSpan) balSpan.innerText = formatMoney(cachedApiData.faction_money_balance);
            }
            return;
        }
        if (isSyncing) return;

        try {
            isSyncing = true;
            vLog("Syncing all data...");

            const authRes = await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${settings.firebaseUrl.replace(/\/$/, "")}/Management/authorized.json?auth=${settings.firebaseApiKey}`,
                    onload: (r) => resolve(r.status === 200 ? JSON.parse(r.responseText) : null),
                    onerror: () => resolve(null)
                });
            });
            authorizedFactionId = authRes?.faction_id || null;

            // sync user info (name,id,factionname,factionid,position,isbanker,lastaction)
            const userRes = await new Promise((resolve) => {
                trackApiUsage();
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${TORN_API_BASE}/user/?key=${settings.tornApiKey}${API_COMMENT}`,
                    onload: (r) => resolve(JSON.parse(r.responseText))
                });
            });
            if (userRes.error) throw new Error(userRes.error.error);
            tornValid = true;


            const userPosition = userRes.faction?.position || "Member";
            const isManagement = userPosition === "Leader" || userPosition === "Co-leader";

            if (isManagement) {
                const lastMgtSync = GM_getValue("last_mgt_sync", 0);
                const now = Date.now();

                // update faction_id in db for member auth
                if (!authorizedFactionId || authorizedFactionId === "PENDING" || userRes.faction?.faction_id !== authorizedFactionId || (now - lastMgtSync > 3600000)) {
                    vLog(`Management | Database is empty or expired. Establishing Faction Lock with faction ID ${userRes.faction?.faction_id}`);
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: `${settings.firebaseUrl.replace(/\/$/, "")}/Management/authorized.json?auth=${settings.firebaseApiKey}`,
                        headers: {
                            "Content-Type": "application/json",
                            "X-HTTP-Method-Override": "PUT"
                        },
                        data: JSON.stringify({
                            faction_id: userRes.faction?.faction_id || 0,
                            updated_by: userRes.name,
                            timestamp: now
                        }),
                        onload: () => {
                            GM_setValue("last_mgt_sync", now);
                            authorizedFactionId = userRes.faction?.faction_id;
                            vLog(`Management | Authorized Faction ID updated to ${userRes.faction?.faction_id}.`);
                        }
                    });
                }
            }

            // sync faction vault balance (only ping if on armory page with vault request)
            let moneyRes = null;
            const isArmouryTab = window.location.hash.includes('tab=armoury');
            if (isArmouryTab || !cachedApiData.faction_money_balance) {
                moneyRes = await new Promise((resolve) => {
                    trackApiUsage();
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${TORN_API_BASE}/v2/user/money/?key=${settings.tornApiKey}${API_COMMENT}`,
                        onload: (r) => resolve(JSON.parse(r.responseText))
                    });
                });
                vLog("Faction balance updated from API.");
            } else {
                moneyRes = {
                    money: {
                        faction: {
                            money: cachedApiData.faction_money_balance
                        }
                    }
                };
                vLog("Using cached faction balance.");
            }

            // position check (only check once every 5m or is blank value)
            const lastPosSync = GM_getValue("last_position_sync", 0);
            const now = Date.now();
            let factionRes;

            if (now - lastPosSync > 300000 || !GM_getValue("cached_faction_positions")) {
                factionRes = await new Promise((resolve) => {
                    trackApiUsage();
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${TORN_API_BASE}/faction/?selections=positions&key=${settings.tornApiKey}${API_COMMENT}`,
                        onload: (r) => {
                            const data = JSON.parse(r.responseText);
                            GM_setValue("cached_faction_positions", data);
                            GM_setValue("last_position_sync", now);
                            resolve(data);
                        }
                    });
                });
                vLog("Faction positions refreshed from API.");
            } else {
                factionRes = GM_getValue("cached_faction_positions");
                vLog("Using cached faction positions.");
            }

            let isbanker = 0;
            if (isManagement) {
                isbanker = 1; //default management to banker
            } else if (factionRes.positions && factionRes.positions[userPosition]) {
                //isbanker = factionRes.positions[userPosition].canGiveMoney || 0;
                isbanker = factionRes.positions[userPosition].canUseMedicalItem || 0;
            }

            const updatedData = {
                name: userRes.name,
                user_id: userRes.player_id,
                faction_name: userRes.faction?.faction_name,
                faction_id: userRes.faction?.faction_id || 0,
                faction_position: userPosition,
                isbanker,
                faction_money_balance: moneyRes?.money?.faction?.money || 0,
                last_action: userRes.last_action?.timestamp || 0,
                status: userRes.status?.state || "Okay"
            };

            GM_setValue("global_user_data", updatedData);
            Object.assign(cachedApiData, updatedData);

            // check firebase connectivity
            const fbCheck = await new Promise((resolve) => {
                if (!settings.firebaseUrl || !settings.firebaseApiKey) resolve(false);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${settings.firebaseUrl.replace(/\/$/, "")}/.json?auth=${settings.firebaseApiKey}&shallow=true`,
                    onload: (res) => resolve(res.status === 200),
                    onerror: () => resolve(false)
                });
            });
            firebaseValid = fbCheck;

            // auto sync discord settings to db values
            if (firebaseValid) {
                const discordRes = await new Promise((resolve) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `${settings.firebaseUrl.replace(/\/$/, "")}/Management/discord.json?auth=${settings.firebaseApiKey}`,
                        onload: (r) => resolve(r.status === 200 ? JSON.parse(r.responseText) : null),
                        onerror: () => resolve(null)
                    });
                });

                if (discordRes && discordRes.webhook) {
                    discordAvailable = true;
                    if (!settings.discordWebhook || settings.discordWebhook !== discordRes.webhook) {
                        settings.discordWebhook = discordRes.webhook;
                        settings.discordPingID = discordRes.pingID || "";
                        settings.discordPingType = discordRes.pingType || "role";
                        GM_setValue(SETTINGS_KEY, settings);
                        vLog("Discord | Settings auto-imported from Database.");
                    }
                } else {
                    discordAvailable = false;
                    if (!cachedApiData.isbanker && settings.discordWebhook) {
                        settings.discordWebhook = "";
                        settings.discordPingID = "";
                        GM_setValue(SETTINGS_KEY, settings);
                        vLog("Discord | Database is empty. Local settings cleared.");
                    }
                }
                const dot = document.getElementById('discord-status-dot');
                if (dot) {
                    dot.style.color = discordAvailable ? '#5cb85c' : '#d9534f';
                    dot.innerHTML = `● ${discordAvailable ? 'Discord Config Synced' : 'No Discord Config Found'}`;
                }
                const testBtn = document.getElementById('vault-test-discord');
                if (testBtn) testBtn.style.display = settings.discordWebhook ? 'block' : 'none';
                refreshSettingsUI();
            }

            // pull any active requests
            const dbRes = await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${settings.firebaseUrl.replace(/\/$/, "")}/vaultRequests/${updatedData.user_id}.json?auth=${settings.firebaseApiKey}`,
                    onload: (r) => resolve(r.status === 200 ? JSON.parse(r.responseText) : null),
                    onerror: () => resolve(null)
                });
            });

            if (dbRes && dbRes.amount) {
                activeData = dbRes;
                hasActiveRequest = true;
                GM_setValue(ACTIVE_REQ_KEY, true);
                GM_setValue("global_active_request_data", dbRes);

                // push last active timestamp if active request
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `${settings.firebaseUrl.replace(/\/$/, "")}/vaultRequests/${updatedData.user_id}.json?auth=${settings.firebaseApiKey}`,
                    headers: {
                        "Content-Type": "application/json",
                        "X-HTTP-Method-Override": "PATCH"
                    },
                    data: JSON.stringify({
                        lastAction: updatedData.last_action,
                        name: updatedData.name
                    }),
                    onload: (res) => {
                        if (res.status === 200) vLog("Activity timestamp updated.");
                    }
                });

                if (typeof updateUI === "function") {
                    updateUI(activeData);
                }
            } else {
                activeData = null;
                hasActiveRequest = false;
                GM_setValue(ACTIVE_REQ_KEY, false);
                GM_setValue("global_active_request_data", null);
                vLog("No active request found.");
            }

            const balSpan = document.getElementById('balance-amount-span');
            if (balSpan) balSpan.innerText = formatMoney(updatedData.faction_money_balance);

            const mgmt = document.getElementById('vault-management-container');
            if (mgmt) mgmt.style.display = updatedData.isbanker ? 'block' : 'none';

            vLog("Sync Complete", null, 'log', updatedData);

        } catch (e) {
            vLog("Sync Failed:", null, 'error', e);
            if (e.message.includes('code: 2') || e.message.includes('key')) tornValid = false;
        } finally {
            isSyncing = false;
            if (typeof updateShieldUI === "function") updateShieldUI();
        }
        if (hasActiveRequest) {
            isFulfilled();
        }
    }

    function updateManagementList() {
        if (!settings.firebaseUrl || !settings.firebaseApiKey) {
            const listContainer = document.getElementById('vault-mgmt-list');
            if (listContainer) {
                listContainer.innerHTML = '<p style="color:#ff4444; font-size:11px; text-align:center; padding: 10px;">Database connection required.</p>';
            }
            return;
        }

        const listContainer = document.getElementById('vault-mgmt-list');
        if (!listContainer || !isTargetPage()) return;
        const baseUrl = getDbUrl("/vaultRequests");
        if (!baseUrl) return;

        const requestUrl = baseUrl + (baseUrl.includes('?') ? '&' : '?') + 't=' + Date.now();

        GM_xmlhttpRequest({
            method: "GET",
            url: requestUrl,
            onload: (res) => {
                try {
                    if (!res || res.status !== 200) return;
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

                    const currentStatus = (cachedApiData.status || "").trim();
                    const canPay = (currentStatus === "Okay");

                    let html = '';
                    if (!canPay) {
                        html += `
                            <div class="vault-lock-notice">
                                ⚠️ You cannot currently fulfill payments because your status is not Okay -- (<b>${currentStatus})</b>
                            </div>
                        `;
                    }

                    keys.sort((a, b) => (allReqs[a].timestamp || 0) - (allReqs[b].timestamp || 0))
                        .forEach(uid => {
                        const r = allReqs[uid];
                        const status = getOnlineStatus(r.lastAction || 0);
                        const isOnlinePref = (r.pref == 1 || r.pref === true || r.pref === "true");
                        const prefText = isOnlinePref ? '<span style="color:#00ff00;">Send when Online</span>' : '<span style="color:#ff4444;">Send Anytime</span>';

                        const startTime = parseInt(r.timestamp);
                        const timeoutMins = parseInt(r.timeout) || 0;
                        const expiryTime = startTime + (timeoutMins * 60 * 1000);


                        html += `
                            <div class="mgmt-card" style="display: flex; align-items: center; justify-content: space-between; background: #222; padding: 8px; border-radius: 3px; margin-bottom: 5px; border-left: 3px solid #444;">
                                <div style="flex: 2;">
                                    <span class="mgmt-status-dot ${status.class}" title="${status.label}" style="cursor: pointer;"></span>
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
                                <div style="flex: 1.5; text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
                                    <button class="mgmt-pay-btn"
                                        data-id="${r.id}"
                                        data-name="${r.name}"
                                        data-amt="${r.amount}"
                                        ${!canPay ? 'disabled' : ''}>PAY</button>
                                    <button class="mgmt-del-btn"
                                        data-id="${r.id}"
                                        data-name="${r.name}"
                                        style="background:transparent; color:#ff4444; border:1px solid #ff4444; padding:2px 6px; border-radius:3px; cursor:pointer; font-size:11px; font-weight:bold;">X</button>
                                </div>
                            </div>
                        `;
                    });

                    listContainer.innerHTML = html;
                    listContainer.querySelectorAll('.mgmt-pay-btn').forEach(btn => {
                        btn.addEventListener('click', () => fulfillRequest(btn.dataset.id, btn.dataset.name, btn.dataset.amt));
                    });

                    listContainer.querySelectorAll('.mgmt-del-btn').forEach(btn => {
                        btn.addEventListener('click', async () => {
                            const userId = btn.dataset.id;
                            const userName = btn.dataset.name;
                            const deleteUrl = getDbUrl(`/vaultRequests/${userId}`, "DELETE");
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: deleteUrl,
                                headers: { "X-HTTP-Method-Override": "DELETE" },
                                onload: (res) => {
                                    if (res.status === 200) {
                                        vLog(`Management | Manually removed request for ${userName}.`);
                                        updateManagementList();
                                    }
                                }
                            });

                        });
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
                    vLog("Management Refresh Error:", null, 'error', e);
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
                const a = document.createElement('a');
                a.href = "/factions.php?step=your#/tab=armoury";
                a.setAttribute('aria-label', tooltipText);
                a.style = "display: block; width: 100%; height: 100%;";
                vaultIcon.appendChild(a);
                enableTornStyleTooltip(a);
                iconList.appendChild(vaultIcon);
            } else {
                const a = vaultIcon.querySelector('a');
                if (a && a.__updateTip) a.__updateTip(tooltipText);
            }
        } else if (vaultIcon) {
            vaultIcon.remove();
        }

        if (!settings.firebaseUrl || !settings.firebaseApiKey) {
            let bIcon = document.getElementById('mgmt-banker-queue-icon');
            if (bIcon) bIcon.remove();
            return;
        }

        if (isFetchingQueue) return;

        if (cachedApiData.isbanker) {
            isFetchingQueue = true;
            const requestUrl = getDbUrl("/vaultRequests");
            if (!requestUrl) {
                isFetchingQueue = false;
                return;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: requestUrl,
                onload: (res) => {
                    isFetchingQueue = false;
                    try {
                        if (res.status !== 200) throw new Error("DB Error");
                        const allReqs = JSON.parse(res.responseText);
                        const count = (allReqs && res.responseText !== "null") ? Object.keys(allReqs).length : 0;
                        let bankerIcon = document.getElementById('mgmt-banker-queue-icon');

                        if (count > 0) {
                            const tooltipText = `Requests in Queue — ${count}`;
                            if (!bankerIcon) {
                                bankerIcon = document.createElement('li');
                                bankerIcon.id = 'mgmt-banker-queue-icon';
                                bankerIcon.style = `background-image: url('${ICON_STATUS_R}'); cursor: pointer;`;
                                const a = document.createElement('a');
                                a.href = "/factions.php?step=your#/tab=armoury";
                                a.setAttribute('aria-label', tooltipText);
                                a.style = "display: block; width: 100%; height: 100%;";
                                bankerIcon.appendChild(a);
                                enableTornStyleTooltip(a);
                                iconList.appendChild(bankerIcon);
                            } else {
                                const a = bankerIcon.querySelector('a');
                                if (a) {
                                    if (a.__updateTip) a.__updateTip(tooltipText);
                                    else a.setAttribute('aria-label', tooltipText);
                                }
                            }
                        } else if (bankerIcon) {
                            bankerIcon.remove();
                        }
                    } catch (e) {
                        let bIcon = document.getElementById('mgmt-banker-queue-icon');
                        if (bIcon) bIcon.remove();
                    }
                },
                onerror: () => {
                    isFetchingQueue = false;
                    let bIcon = document.getElementById('mgmt-banker-queue-icon');
                    if (bIcon) bIcon.remove();
                }
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
            titleEl.innerText = `Vault Balance Request`;
        } else {
            titleEl.innerText = 'Member Dashboard';
        }
    }

    function updateShieldUI() {
        const inputArea = document.getElementById('vault-input-area'), shield = document.getElementById('vault-shield'), statusArea = document.getElementById('vault-status-area');
        const memberDiscord = document.getElementById('member-discord-section');
        const syncDiscordBtn = document.getElementById('vault-sync-discord');
        const testDiscordBtn = document.getElementById('vault-test-discord');
        const bankerDiscord = document.getElementById('banker-discord-section');

        if (!inputArea || !shield || !statusArea) return;
        settings = getSettings();
        if (!settings.tornApiKey) tornValid = false;
        if (!settings.firebaseUrl || !settings.firebaseApiKey) firebaseValid = false;

        shield.innerHTML = "";
        const tornIssues = !settings.tornApiKey || tornValid === false;
        const firebaseIssues = !settings.firebaseUrl || !settings.firebaseApiKey || firebaseValid === false;
        const authIssues = (isAuthorized === false);
        const factionIssues = (!tornIssues && !firebaseIssues && authorizedFactionId !== "PENDING" && authorizedFactionId !== null && cachedApiData.faction_id !== authorizedFactionId);

        const hideDiscord = tornIssues || firebaseIssues || authIssues;
        const discordDisplay = hideDiscord ? 'none' : 'block';
        if (memberDiscord) memberDiscord.style.display = hideDiscord ? 'none' : (!cachedApiData.isbanker ? 'block' : 'none');
        if (bankerDiscord) bankerDiscord.style.display = hideDiscord ? 'none' : (cachedApiData.isbanker ? 'block' : 'none');
        if (syncDiscordBtn) syncDiscordBtn.style.display = discordDisplay;
        if (testDiscordBtn) {
            testDiscordBtn.style.display = (hideDiscord || !settings.discordWebhook) ? 'none' : 'block';
        }

        if (!tornIssues && !firebaseIssues && !authIssues && !factionIssues) {
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
        if (authIssues) {
            const div = document.createElement('div'); div.className = 'vault-shield-msg';
            div.innerHTML = `<span style="color: #ff4444; font-weight: bold;">Access Denied:</span><br>Faction [${cachedApiData.faction_id || '???'}] is not authorized to use this script.`;
            shield.appendChild(div);
        }
        if (factionIssues) {
            const div = document.createElement('div'); div.className = 'vault-shield-msg';
            div.innerHTML = `<span style="color: #ff4444; font-weight: bold;">Security Error:</span><br>Incorrect Faction Database Information.`;
            shield.appendChild(div);
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
        checkScriptVersion();
        const existingReq = document.getElementById('vault-request-container');
        const existingMgmt = document.getElementById('vault-management-container');

        if (!isTargetPage()) {
            if (existingReq) existingReq.remove();
            if (existingMgmt) existingMgmt.remove();
            return;
        } else {
            updateManagementList();
            if (typeof fetchTornData === "function") syncAllData(false);
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
                <div id="vault-key-helper" style="margin-bottom: 8px;"></div>
                <div style="font-size: 9px; color: #888; margin-bottom: 12px; padding-left: 2px;">
                    By providing your key, you agree to the <span id="view-tos" style="color: #3777ce; cursor: pointer; text-decoration: underline;">API Disclosure & Terms</span>.
                </div>
                <label class="vault-setting-label">Firebase URL:</label>
                <input type="text" id="set-fb-url" placeholder="Firebase URL" value="${settings.firebaseUrl}" style="width:100%; margin-bottom:8px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                <label class="vault-setting-label">Firebase Secret Key:</label>
                <input type="text" id="set-fb-key" placeholder="Firebase Secret Key" value="${settings.firebaseApiKey}" style="width:100%; margin-bottom:12px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">

                <hr style="border: 0; border-top: 1px solid #444; margin: 10px 0;">

                <div id="banker-discord-section" style="display: ${cachedApiData.isbanker ? 'block' : 'none'};">
                    <label class="vault-setting-label">Discord Webhook (Faction Wide):</label>
                    <input type="text" id="set-discord-webhook" placeholder="https://discord.com/api/webhooks/..." value="${settings.discordWebhook || ''}" style="width:100%; margin-bottom:8px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                    <div id="discord-extra-settings" style="display: ${settings.discordWebhook ? 'block' : 'none'};">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <label class="vault-setting-label" style="margin: 0;">Ping User/Role ID:</label>
                            <label class="vault-switch">
                               <input type="checkbox" id="set-discord-type" ${settings.discordPingType === 'user' ? 'checked' : ''}>
                               <span class="vault-slider"></span>
                               <div class="vault-switch-text"><span>ROLE</span><span>USER</span></div>
                            </label>
                        </div>
                        <input type="text" id="set-discord-id" placeholder="ID Number" value="${settings.discordPingID || ''}" style="width:100%; margin-bottom:12px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                    </div>
                </div>

                <div id="member-discord-section" style="display: ${!cachedApiData.isbanker ? 'block' : 'none'}; margin-bottom: 12px; padding: 5px; background: #1a1a1a; border-radius: 3px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span id="discord-status-dot" style="color: #aaa; font-size: 11px;">
                            ● Checking Discord Config...
                        </span>
                    </div>
                </div>
                <button id="vault-test-discord" style="display: ${settings.discordWebhook ? 'block' : 'none'}; width: 100%; background: #444; color: #fff; border: 1px solid #555; padding: 4px; border-radius: 2px; cursor: pointer; margin-bottom: 12px; font-size: 10px;">TEST PING</button>
                <button id="vault-sync-discord" style="width: 100%; background: #444; color: #fff; border: 1px solid #555; padding: 5px; border-radius: 2px; cursor: pointer; margin-bottom: 8px; font-size: 10px;">FETCH DISCORD SETTINGS</button>
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
                        <p style="color: #aaa; font-size: 12px; margin: 0;">Balance: <span style="color: #fff; font-weight: bold;">$<span id="balance-amount-span">${formatMoney(cachedApiData.faction_money_balance)}</span></span></p>
                        <button id="vault-submit" style="padding: 6px 15px; cursor: pointer; background: #3777ce; color: #fff; border: none; border-radius: 3px; font-weight: bold;">Submit Request</button>
                        <p id="vault-error" style="color: #ff4444; font-size: 11px; margin: 0; display: none; margin-left: 5px;">⚠ Over balance!</p>
                    </div>
                </div>
                <div id="vault-status-area" style="display: none;">
                    <p id="vault-status-text" style="margin-bottom: 10px; font-size: 13px;"></p>
                    <button id="vault-cancel" style="padding: 6px 15px; cursor: pointer; background: #b32d2d; color: #fff; border: none; border-radius: 3px;">Cancel Request</button>
                </div>
                <div id="vault-version-display" class="vault-version-footnote">
                    Version ${SCRIPT_VERSION.toFixed(1)}
                </div>
            </div>
        `;

        // MANAGEMENT CONTAINER
        const mgmtContainer = document.createElement('div');
        mgmtContainer.id = 'vault-management-container';
        mgmtContainer.style = `background: #333; border: 1px solid #444; border-radius: 5px; padding: 12px; margin: 10px 0; color: #fff; font-family: Arial, sans-serif; display: ${cachedApiData.isbanker ? 'block' : 'none'};`;
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
        document.getElementById('view-tos')?.addEventListener('click', () => {
            const tosMsg = `TORN API DISCLOSURE & USAGE:\n\n` +
                  `1. KEY STORAGE: Your API key is stored LOCALLY in your browser. It is never sent to the developer or the database.\n\n` +
                  `2. DATA STORAGE: Vault requests (Username, ID, and Amount) are stored in the faction's Firebase database until fulfilled or deleted.\n\n` +
                  `3. DATA SHARING: Request data is shared with Faction Bankers and sent via Webhook to the Faction's Discord channel.\n\n` +
                  `4. ACCESS: This script requires a 'Limited Access' key to function.\n\n` +
                  `By using this script, you consent to this data flow for the purpose of faction vault management.`;

            alert(tosMsg);
        });
        const keyInput = document.getElementById('set-torn-key');
        if (keyInput) {
            keyInput.addEventListener('input', () => {
                const helper = document.getElementById('vault-key-helper');
                if (helper) {
                    helper.innerHTML = keyInput.value.trim() ? '' : `<a href="https://www.torn.com/preferences.php#tab=api?&step=addNewKey&title=Vault%20Request&type=3" target="_blank" style="color: #3777ce; font-size: 10px; text-decoration: underline;">Click here to generate a Limited API Key</a>`;
                }
            });
        }
        document.getElementById('vault-save-settings').addEventListener('click', () => {
            const btn = document.getElementById('vault-save-settings');
            btn.innerText = "VALIDATING...";

            const newTornKey = document.getElementById('set-torn-key').value.trim();
            const newFbUrl = document.getElementById('set-fb-url').value.trim();
            const newFbKey = document.getElementById('set-fb-key').value.trim();

            settings.tornApiKey = newTornKey;
            settings.firebaseUrl = newFbUrl;
            settings.firebaseApiKey = newFbKey;
            settings.discordWebhook = document.getElementById('set-discord-webhook').value.trim();
            settings.discordPingID = document.getElementById('set-discord-id').value.trim();
            settings.discordPingType = document.getElementById('set-discord-type').checked ? 'user' : 'role';

            GM_setValue(SETTINGS_KEY, settings);

            // if banker, upload discord settings to db
            if (cachedApiData.isbanker && settings.discordWebhook && firebaseValid) {
                vLog("Discord | Pushing Discord settings to Database...");
                GM_xmlhttpRequest({
                    method: "POST",
                    url: `${settings.firebaseUrl.replace(/\/$/, "")}/Management/discord.json?auth=${settings.firebaseApiKey}`,
                    headers: {
                        "Content-Type": "application/json",
                        "X-HTTP-Method-Override": "PUT"
                    },
                    data: JSON.stringify({
                        webhook: settings.discordWebhook,
                        pingID: settings.discordPingID,
                        pingType: settings.discordPingType,
                        updatedBy: cachedApiData.name,
                        timestamp: Date.now()
                    })
                });
            }

            syncAllData(true).then(async () => {
                await checkAuthorization();
                if (tornValid && firebaseValid && isAuthorized) {
                    registerUserInDatabase();
                }
                btn.innerText = "SAVE & VALIDATE";
                const testBtn = document.getElementById('vault-test-discord');
                if (testBtn) testBtn.style.display = settings.discordWebhook ? 'block' : 'none';

                const factionValid = !authorizedFactionId || cachedApiData.faction_id === authorizedFactionId;
                if (tornValid && firebaseValid && factionValid) {
                    document.getElementById('vault-settings-modal').style.display = 'none';
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
        document.getElementById('vault-amount').addEventListener('input', handleAmountInput);
        container.querySelectorAll('.q-btn').forEach(btn => btn.addEventListener('click', () => {
            const val = parseMoney(btn.dataset.amt); document.getElementById('vault-amount').value = formatMoney(val); validateAmount(val);
        }));
        document.getElementById('btn-full').addEventListener('click', () => {
            const val = cachedApiData.faction_money_balance; document.getElementById('vault-amount').value = formatMoney(val); validateAmount(val);
        });
        validateAmount(0);

        // manual fetch discord settings
        const syncDiscordBtn = document.getElementById('vault-sync-discord');
        if (syncDiscordBtn) {
            syncDiscordBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const originalText = syncDiscordBtn.innerText;
                syncDiscordBtn.innerText = "FETCHING...";
                settings.discordWebhook = "";
                settings.discordPingID = "";
                settings.discordPingType = "role";
                refreshSettingsUI();
                await syncAllData(true);
                syncDiscordBtn.innerText = "SYNC COMPLETE!";

                setTimeout(() => {
                    syncDiscordBtn.innerText = originalText;
                    refreshSettingsUI();
                }, 1500);
            });
        }
    }

    // -------------------------------------------------------------------------
    // REQUEST HANDLING
    // -------------------------------------------------------------------------
    async function submitRequest() {
        const amt = parseMoney(document.getElementById('vault-amount').value);
        if (amt <= 0) return;

        const btn = document.getElementById('vault-submit');
        if (btn) { btn.innerText = "Submitting..."; btn.disabled = true; }
        await syncAllData(true);

        // check user faction_id matches the db auth
        if (authorizedFactionId && cachedApiData.faction_id !== authorizedFactionId) {
            vLog("SECURITY | Submission blocked: Faction ID mismatch!", null, 'error');
            if (btn) {
                btn.innerText = "LOCKED";
                btn.disabled = true;
            }
            const formContainer = document.getElementById('vault-input-area');
            if (formContainer) formContainer.style.display = 'none';
            return;
        }

        const isPrefOnline = document.getElementById('vault-pref-online').checked;
        const timeoutVal = isPrefOnline ? (parseInt(document.getElementById('vault-timeout-mins').value) || 0) : 0;
        const data = {
            name: cachedApiData.name,
            id: cachedApiData.user_id,
            amount: amt,
            startingBalance: cachedApiData.faction_money_balance,
            pref: isPrefOnline ? 1 : 0,
            timeout: timeoutVal,
            timestamp: Date.now(),
            lastAction: cachedApiData.last_action
        };

        hasActiveRequest = true;
        GM_setValue(ACTIVE_REQ_KEY, true);
        activeData = data;

        updateStatusIcon();

        GM_xmlhttpRequest({
            method: "POST",
            url: getDbUrl(`/vaultRequests/${cachedApiData.user_id}`, "PUT"),
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "X-HTTP-Method-Override": "PUT"
            },
            onload: (res) => {
                if (res.status === 200) {
                    updateUI(data);
                    sendDiscordPing();
                    registerUserInDatabase();
                    vLog(`Request submitted. Starting balance: ${formatMoney(data.startingBalance)}`);
                } else {
                    vLog("Firebase Error:", null, 'error', res.responseText);
                }
                if (btn) { btn.innerText = "Submit Request"; btn.disabled = false; }
            },
            onerror: () => {
                if (btn) { btn.innerText = "Submit Request"; btn.disabled = false; }
                vLog("Firebase Error: Failed to submit.", null, 'error');
            }
        });
    }

    function cancelRequest(isManual = false, isTimeout = false) {
        const userId = cachedApiData.user_id;
        if (!userId) {
            vLog("Cannot cancel: No User ID found.", null, 'error');
            return;
        }
        hasActiveRequest = false;
        GM_setValue(ACTIVE_REQ_KEY, false);
        activeData = null;

        updateStatusIcon();
        resetUI();

        if (isManual) sendDiscordPing(null, false, true, false);
        if (isTimeout) sendDiscordPing(null, false, false, true);
        registerUserInDatabase();

        GM_xmlhttpRequest({
            method: "POST",
            url: `${settings.firebaseUrl.replace(/\/$/, "")}/vaultRequests/${userId}.json?auth=${settings.firebaseApiKey}`,
            headers: {
                "X-HTTP-Method-Override": "DELETE"
            },
            onload: (res) => {
                if (res.status === 200) {
                    vLog("Request deleted from Firebase.");
                } else {
                    vLog("Delete failed:", null, 'error', res.responseText);
                }
                updateStatusIcon();
            }
        });
    }

    async function fulfillRequest(userId, userName, amount) {
        sendDiscordPing(null, false, false, false, true, userName, amount);
        registerUserInDatabase();
        vLog(`Initiating payment for ${userName}. Redirecting to vault...`);
        const deleteUrl = getDbUrl(`/vaultRequests/${userId}`, "DELETE");
        if (!deleteUrl) return;

        await new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: deleteUrl,
                headers: { "X-HTTP-Method-Override": "DELETE" },
                onload: () => resolve(),
                onerror: () => resolve()
            });
        });
        window.location.assign(`https://www.torn.com/factions.php?step=your#/tab=controls&option=give-to-user&giveMoneyTo=${userId}&money=${amount}`);
    }

    function isFulfilled() {
        if (!hasActiveRequest || !activeData || !activeData.startingBalance) return;
        const currentBal = cachedApiData.faction_money_balance;
        const startBal = activeData.startingBalance;
        const amountRequested = activeData.amount;
        const difference = startBal - currentBal;
        const profileLink = `[${cachedApiData.name} [${cachedApiData.user_id}]](https://www.torn.com/profiles.php?XID=${cachedApiData.user_id})`;
        vLog(`Start Balance - ${startBal}. Current Balance - ${currentBal}. Difference - ${difference}`);

        if (difference >= amountRequested) {
            vLog(`Payment detected for ($${difference.toLocaleString()}). Clearing local request.`);

            const deleteUrl = getDbUrl(`/vaultRequests/${cachedApiData.user_id}`, "DELETE");
            GM_xmlhttpRequest({
                method: "POST",
                url: deleteUrl,
                headers: { "X-HTTP-Method-Override": "DELETE" },
                onload: (res) => {
                    if (res.status === 200) {
                        vLog("Firebase | Request cleared successfully.");
                        sendDiscordPing(`✅ **Request Auto Verified** -- ${profileLink} (**$${formatMoney(amountRequested)}**)-- Filled by someone not using the [Vault Script](https://greasyfork.org/en/scripts/562127-faction-vault-member-management)`);
                        hasActiveRequest = false;
                        activeData = null;
                        GM_setValue(ACTIVE_REQ_KEY, false);
                        updateStatusIcon();
                        updateUI(null);
                    }
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
                                        vLog(`Failed to delete request for ${userId}`, null, 'warn');
                                        resolve();
                                    }
                                });
                            });
                            deleteExpired.push(action);
                        }
                    });

                    if (deleteExpired.length > 0) {
                        Promise.all(deleteExpired).then(() => {
                            const bankerLink = `[${cachedApiData.name} [${cachedApiData.user_id}]](https://www.torn.com/profiles.php?XID=${cachedApiData.user_id})`;
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
                    vLog("Purge failed", null, 'error', e);
                    btn.innerText = "PURGE EXPIRED";
                    btn.style.opacity = "1";
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------------------

    if (typeof GM_addValueChangeListener !== "undefined") {
        GM_addValueChangeListener("global_user_data", (key, oldValue, newValue, remote) => {
            if (remote) {
                Object.assign(cachedApiData, newValue);
                if (typeof updateShieldUI === "function") updateShieldUI();

                const balSpan = document.getElementById('balance-amount-span');
                if (balSpan) balSpan.innerText = formatMoney(newValue.faction_money_balance);
                if (newValue.isbanker && typeof updateManagementList === "function") {
                    updateManagementList();
                }
            }
        });
    } else {
        vLog("GM_addValueChangeListener not supported (Mobile/PDA).", null, 'warn');
    }

    if (typeof GM_addValueChangeListener !== "undefined") {
        GM_addValueChangeListener("global_active_request_data", (key, oldVal, newVal, remote) => {
            if (remote) {
                activeData = newVal;
                hasActiveRequest = !!newVal;
                if (typeof updateUI === "function") updateUI(newVal);
            }
        });
    } else {
        vLog("GM_addValueChangeListener not supported (Mobile/PDA).", null, 'warn');
    }

    window.addEventListener('hashchange', () => {
        injectUI();
        syncAllData(true).then(() => checkAuthorization().then(() => updateShieldUI()));
    });
    window.addEventListener('popstate', injectUI);

    injectUI();
    syncAllData(true).then(() => {
        checkAuthorization().then(() => {
            updateShieldUI();
        });
    });

    setInterval(() => {
        const myId = String(currentTabId);
        const leaderId = String(GM_getValue("leader_tab_id"));

        if (leaderId === myId) {
            GM_setValue("leader_heartbeat", Date.now());
        } else if (Date.now() - GM_getValue("leader_heartbeat", 0) > 5000) {
            isLeader();
            syncAllData();
        }
    }, 1000);
    setInterval(injectUI, 2000);
    setInterval(() => {
        syncAllData().then(() => {
            checkAuthorization().then(() => {
                updateShieldUI();
            });
        });
    }, 30000);
    setInterval(updateManagementList, 10000);

})();