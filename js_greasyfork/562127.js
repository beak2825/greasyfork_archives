// ==UserScript==
// @name         Faction Vault - Member
// @namespace    http://tampermonkey.net/
// @version      3.7.5
// @description  Injects custom faction vault request into armory page.
// @author       Deviyl[3722358]
// @icon         https://deviyl.github.io/icons/moneybag-green.png
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect      api.torn.com
// @connect      firebaseio.com
// @downloadURL https://update.greasyfork.org/scripts/562127/Faction%20Vault%20-%20Member.user.js
// @updateURL https://update.greasyfork.org/scripts/562127/Faction%20Vault%20-%20Member.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -------------------------------------------------------------------------
    // GLOBAL VARIABLES & SETTINGS
    // -------------------------------------------------------------------------
    const SETTINGS_KEY = "torn_vault_settings";
    const ACTIVE_REQ_KEY = "torn_vault_has_active";

    function getSettings() {
        return GM_getValue(SETTINGS_KEY, { tornApiKey: "", firebaseUrl: "", firebaseApiKey: "" });
    }
    let settings = getSettings();

    let cachedApiData = {
        name: "",
        id: GM_getValue("last_known_player_id", ""),
        vaultBalance: 0,
        lastAction: 0
    };

    let tornValid = !!settings.tornApiKey;
    let firebaseValid = !!(settings.firebaseUrl && settings.firebaseApiKey);

    let hasActiveRequest = GM_getValue(ACTIVE_REQ_KEY, false);
    let activeData = null;

    let pollInterval = null;
    let timerInterval = null;
    let lastApiCall = 0;

    // -------------------------------------------------------------------------
    // STYLING
    // -------------------------------------------------------------------------
    const style = document.createElement('style');
    style.innerHTML = `
        #vault-timeout-mins::-webkit-outer-spin-button, #vault-timeout-mins::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        #vault-timeout-mins { -moz-appearance: textfield; }
        .vault-error-link { color: #3777ce; text-decoration: underline; cursor: pointer; font-weight: bold; }
        .vault-shield-msg { font-size: 12px; color: #bbb; line-height: 1.5; margin-bottom: 8px; border-left: 2px solid #b32d2d; padding-left: 8px; }
    `;
    document.head.appendChild(style);

    const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const parseMoney = (val) => parseInt(val.toString().replace(/[^0-9]/g, "")) || 0;

    function getDbUrl(path, overrideMethod = null) {
        if (!settings.firebaseUrl || !settings.firebaseApiKey) return null;
        const base = settings.firebaseUrl.replace(/\/$/, "");
        let url = `${base}${path}.json?auth=${settings.firebaseApiKey}`;
        if (overrideMethod) url += `&x-http-method-override=${overrideMethod}`;
        return url;
    }

    // -------------------------------------------------------------------------
    // TOOLTIP
    // -------------------------------------------------------------------------
    function enableTornStyleTooltip(anchor) {
        let tipEl = null;

        function buildTooltip(text) {
            const el = document.createElement('div');
            el.className = 'tooltip___aWICR tooltipCustomClass___gbI4V';
            el.style = "position: absolute; z-index: 999999; opacity: 0; transition: opacity 0.2s; pointer-events: none;";

            const [title, subtitle] = text.split(' — ');
            el.innerHTML = `
                <b>${title}</b>
                ${subtitle ? `<div>${subtitle}</div>` : ''}
                <div class="arrow___yUDKb top___klE_Y" style="left: 50%; transform: translateX(-50%);">
                    <div class="arrowIcon___KHyjw"></div>
                </div>
            `;
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

        anchor.addEventListener('mouseenter', () => {
            const text = anchor.getAttribute('aria-label');
            tipEl = buildTooltip(text);
            positionTooltip();
        });

        anchor.addEventListener('mouseleave', () => {
            if (tipEl) { tipEl.remove(); tipEl = null; }
        });

        anchor.__updateTip = (text) => {
            anchor.setAttribute('aria-label', text);
            if (tipEl) {
                const [title, subtitle] = text.split(' — ');
                const b = tipEl.querySelector('b');
                if (b) b.textContent = title;
                const subDiv = tipEl.querySelector('div');
                if (subDiv) {
                    if (subtitle) subDiv.textContent = subtitle;
                    else subDiv.remove();
                } else if (subtitle) {
                    const newSub = document.createElement('div');
                    newSub.textContent = subtitle;
                    tipEl.insertBefore(newSub, tipEl.querySelector('.arrow___yUDKb'));
                }
                positionTooltip();
            }
        };
    }

    // -------------------------------------------------------------------------
    // ICON INJECTION
    // -------------------------------------------------------------------------
    function updateStatusIcon() {
        const iconList = document.querySelector('ul[class*="status-icons"]');
        if (!iconList) return;
        let vaultIcon = document.getElementById('mgmt-vault-notification-icon');

        hasActiveRequest = GM_getValue(ACTIVE_REQ_KEY, false);

        if (hasActiveRequest) {
            let tooltipText = "Current Vault Request";
            if (activeData) {
                const limit = (activeData.timeout || 0) * 60 * 1000;
                const elapsed = Date.now() - activeData.timestamp;
                let timeText = "";
                if (limit !== 0) {
                    const rem = Math.max(0, limit - elapsed);
                    const m = Math.floor(rem / 60000), s = Math.floor((rem % 60000) / 1000);
                    timeText = ` (Expires in: ${m}m ${s}s)`;
                }
                tooltipText = `Current Vault Request — $${formatMoney(activeData.amount)}${timeText}`;
            }

            if (!vaultIcon) {
                vaultIcon = document.createElement('li');
                vaultIcon.id = 'mgmt-vault-notification-icon';
                vaultIcon.style = "background-image: url('https://deviyl.github.io/icons/moneybag-green_.png'); cursor: pointer; background-repeat: no-repeat; background-position: center;";

                const a = document.createElement('a');
                a.href = "/factions.php?step=your#/tab=armoury";
                a.setAttribute('aria-label', tooltipText);
                a.style = "display: block; width: 100%; height: 100%;";

                vaultIcon.appendChild(a);
                enableTornStyleTooltip(a);
                iconList.appendChild(vaultIcon);
            } else {
                const a = vaultIcon.querySelector('a');
                if (a && a.__updateTip) {
                    a.__updateTip(tooltipText);
                }
            }
        } else if (vaultIcon) {
            vaultIcon.remove();
        }
    }

    // -------------------------------------------------------------------------
    // BALANCE FETCHING
    // -------------------------------------------------------------------------
    async function fetchTornData(force = false) {
        const now = Date.now();
        if (!force && (now - lastApiCall < 30000)) return;
        if (!settings.tornApiKey) return;
        lastApiCall = now;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/user/money/?key=${settings.tornApiKey}`,
            onload: (r) => {
                try {
                    const m = JSON.parse(r.responseText);
                    if (m.error && (m.error.code === 2 || m.error.code === 10 || m.error.code === 13)) {
                        tornValid = false;
                        updateShieldUI();
                    }
                    if (m?.money?.faction) {
                        cachedApiData.vaultBalance = m.money.faction.money || 0;
                        const span = document.getElementById('balance-amount-span');
                        if (span) span.innerText = formatMoney(cachedApiData.vaultBalance);
                    }
                } catch (e) { console.error("Vault: Failed to parse balance", e); }
            }
        });
    }

    // -------------------------------------------------------------------------
    // SHIELD / ERROR UI
    // -------------------------------------------------------------------------
    function updateShieldUI() {
        const inputArea = document.getElementById('vault-input-area');
        const shield = document.getElementById('vault-shield');
        const statusArea = document.getElementById('vault-status-area');
        if (!inputArea || !shield || !statusArea) return;

        settings = getSettings();
        shield.innerHTML = "";

        // Logical check for visibility
        const tornIssues = !settings.tornApiKey || tornValid === false;
        const firebaseIssues = !settings.firebaseUrl || !settings.firebaseApiKey || firebaseValid === false;

        if (!tornIssues && !firebaseIssues) {
            shield.style.display = 'none';
            if (hasActiveRequest) {
                inputArea.style.display = 'none';
                statusArea.style.display = 'block';
            } else {
                inputArea.style.display = 'block';
                statusArea.style.display = 'none';
            }
            return;
        }

        inputArea.style.display = 'none';
        statusArea.style.display = 'none';
        shield.style.display = 'block';

        if (tornIssues) {
            const div = document.createElement('div');
            div.className = 'vault-shield-msg';
            div.innerHTML = `Please enter a valid limited API Key in <span class="vault-error-link" id="link-set-1">Settings</span>.`;
            shield.appendChild(div);
        }
        if (firebaseIssues) {
            const div = document.createElement('div');
            div.className = 'vault-shield-msg';
            div.innerHTML = `Please enter a valid Firebase URL and Secret Key in <span class="vault-error-link" id="link-set-2">Settings</span>.`;
            shield.appendChild(div);
        }

        document.getElementById('link-set-1')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('vault-settings-trigger').click(); });
        document.getElementById('link-set-2')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('vault-settings-trigger').click(); });
    }

    // -------------------------------------------------------------------------
    // HEARTBEAT
    // -------------------------------------------------------------------------
    async function runHeartbeat() {
        settings = getSettings();
        if (!settings.tornApiKey) { tornValid = false; updateShieldUI(); return; }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?key=${settings.tornApiKey}&selections=`,
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
                                method: "GET",
                                url: dbUrl,
                                onload: (res) => {
                                    const data = JSON.parse(res.responseText);
                                    if (data && data.name) {
                                        hasActiveRequest = true;
                                        GM_setValue(ACTIVE_REQ_KEY, true);
                                        activeData = data;
                                        GM_xmlhttpRequest({
                                            method: "POST",
                                            url: getDbUrl(`/vaultRequests/${cachedApiData.id}`, "PATCH"),
                                            data: JSON.stringify({ lastAction: cachedApiData.lastAction }),
                                            headers: { "Content-Type": "application/json", "X-HTTP-Method-Override": "PATCH" }
                                        });
                                        if (isArmouryPage()) updateUI(data);
                                    } else {
                                        hasActiveRequest = false;
                                        GM_setValue(ACTIVE_REQ_KEY, false);
                                        activeData = null;
                                        if (isArmouryPage()) resetUI();
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

    // -------------------------------------------------------------------------
    // UI INJECTION
    // -------------------------------------------------------------------------
    function isArmouryPage() { return window.location.href.includes('factions.php?step=your') && window.location.href.includes('tab=armoury'); }

    function injectUI() {
        updateStatusIcon();
        const existing = document.getElementById('vault-request-container');
        if (!isArmouryPage()) { if (existing) existing.remove(); return; }
        if (existing) return;

        const isCollapsed = localStorage.getItem('torn_vault_collapsed') === 'true';
        const prefOnline = localStorage.getItem('torn_vault_pref_online') === 'true';
        const savedTimeout = localStorage.getItem('torn_vault_timeout_mins') || "10";

        const container = document.createElement('div');
        container.id = 'vault-request-container';
        container.style = "background: #333; border: 1px solid #444; border-radius: 5px; padding: 12px; margin: 10px 0; color: #fff; font-family: Arial, sans-serif;";

        container.innerHTML = `
            <div id="vault-header-row" style="display: flex; align-items: center; justify-content: space-between; user-select: none;">
                <b id="vault-title-click" style="font-size: 13px; color: #ddd; letter-spacing: 0.5px; font-weight: bold; cursor: pointer; flex-grow: 1;">${isCollapsed ? 'Member Vault Requests' : 'VAULT BALANCE REQUEST'}</b>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span id="vault-settings-trigger" style="cursor: pointer; font-size: 16px; color: #aaa; line-height: 1;">⚙</span>
                    <span id="vault-collapse-arrow" style="cursor: pointer; font-size: 12px; color: #aaa;">${isCollapsed ? '▶' : '▼'}</span>
                </div>
            </div>
            <div id="vault-settings-modal" style="display:none; background: #222; border: 1px solid #555; padding: 10px; margin-top: 10px; border-radius: 3px;">
                <input type="text" id="set-torn-key" placeholder="Torn API Key" value="${settings.tornApiKey}" style="width:100%; margin-bottom:5px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                <input type="text" id="set-fb-url" placeholder="Firebase URL" value="${settings.firebaseUrl}" style="width:100%; margin-bottom:5px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
                <input type="text" id="set-fb-key" placeholder="Firebase Secret Key" value="${settings.firebaseApiKey}" style="width:100%; margin-bottom:8px; background: #111; color: #fff; border: 1px solid #444; padding: 4px;">
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
        document.querySelector('li.clear')?.after(container);

        if (hasActiveRequest && activeData) updateUI(activeData);
        updateShieldUI();

        document.getElementById('vault-title-click').addEventListener('click', toggleCollapse);
        document.getElementById('vault-collapse-arrow').addEventListener('click', toggleCollapse);
        document.getElementById('vault-settings-trigger').addEventListener('click', (e) => {
             e.stopPropagation();
             const m = document.getElementById('vault-settings-modal');
             m.style.display = m.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('vault-save-settings').addEventListener('click', () => {
            const btn = document.getElementById('vault-save-settings');
            btn.innerText = "VALIDATING...";

            const newTornKey = document.getElementById('set-torn-key').value.trim();
            const newFbUrl = document.getElementById('set-fb-url').value.trim();
            const newFbKey = document.getElementById('set-fb-key').value.trim();

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/user/?key=${newTornKey}&selections=`,
                onload: (r) => {
                    const j = JSON.parse(r.responseText);
                    tornValid = !(j.error && (j.error.code === 2 || j.error.code === 10 || j.error.code === 13));

                    const testUrl = `${newFbUrl.replace(/\/$/, "")}/.json?auth=${newFbKey}&shallow=true`;
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: testUrl,
                        onload: (res) => {
                            firebaseValid = (res.status === 200);

                            settings.tornApiKey = newTornKey;
                            settings.firebaseUrl = newFbUrl;
                            settings.firebaseApiKey = newFbKey;
                            GM_setValue(SETTINGS_KEY, settings);

                            btn.innerText = "SAVE & VALIDATE";
                            if (tornValid && firebaseValid) document.getElementById('vault-settings-modal').style.display = 'none';
                            updateShieldUI();
                            fetchTornData(true);
                        },
                        onerror: () => {
                            firebaseValid = false;
                            btn.innerText = "SAVE & VALIDATE";
                            updateShieldUI();
                        }
                    });
                }
            });
        });

        document.getElementById('vault-submit').addEventListener('click', submitRequest);
        document.getElementById('vault-cancel').addEventListener('click', cancelRequest);
        document.getElementById('vault-pref-online').addEventListener('change', (e) => {
            localStorage.setItem('torn_vault_pref_online', e.target.checked);
            document.getElementById('timeout-input-wrapper').style.display = e.target.checked ? 'flex' : 'none';
        });
        document.getElementById('vault-amount').addEventListener('input', (e) => {
            const val = parseMoney(e.target.value);
            e.target.value = formatMoney(val);
            validateAmount(val);
        });
        container.querySelectorAll('.q-btn').forEach(btn => btn.addEventListener('click', () => {
            const val = parseMoney(btn.dataset.amt);
            document.getElementById('vault-amount').value = formatMoney(val);
            validateAmount(val);
        }));
        document.getElementById('btn-full').addEventListener('click', () => {
            const val = cachedApiData.vaultBalance;
            document.getElementById('vault-amount').value = formatMoney(val);
            validateAmount(val);
        });
        validateAmount(0);
    }

    function toggleCollapse() {
        const content = document.getElementById('vault-collapsible-content'), arrow = document.getElementById('vault-collapse-arrow'), title = document.getElementById('vault-title-click');
        const hidden = content.style.display === 'none';
        content.style.display = hidden ? 'block' : 'none';
        arrow.innerText = hidden ? '▼' : '▶';
        title.innerText = hidden ? 'VAULT BALANCE REQUEST' : 'Member Vault Requests';
        localStorage.setItem('torn_vault_collapsed', hidden ? 'false' : 'true');
    }

    function validateAmount(amt) {
        const bal = cachedApiData.vaultBalance, sub = document.getElementById('vault-submit'), err = document.getElementById('vault-error');
        if (!sub || !err) return;

        if (amt > bal || amt <= 0) {
            if (amt > bal) err.style.display = 'inline-block';
            else err.style.display = 'none';
            sub.disabled = true;
            sub.style.opacity = '0.5';
            sub.style.cursor = 'not-allowed';
        } else {
            err.style.display = 'none';
            sub.disabled = false;
            sub.style.opacity = '1';
            sub.style.cursor = 'pointer';
        }
    }

    async function submitRequest() {
        const amt = parseMoney(document.getElementById('vault-amount').value);
        if (amt <= 0) return;
        const btn = document.getElementById('vault-submit');
        if (btn) { btn.innerText = "Submitting..."; btn.disabled = true; }

        const isPrefOnline = document.getElementById('vault-pref-online').checked;
        const timeoutVal = isPrefOnline ? (parseInt(document.getElementById('vault-timeout-mins').value) || 0) : 0;
        const data = {
            name: cachedApiData.name,
            id: cachedApiData.id,
            amount: amt,
            pref: isPrefOnline ? 1 : 0,
            timeout: timeoutVal,
            timestamp: Date.now(),
            lastAction: cachedApiData.lastAction
        };

        hasActiveRequest = true;
        GM_setValue(ACTIVE_REQ_KEY, true);
        activeData = data;
        updateStatusIcon();

        GM_xmlhttpRequest({
            method: "POST",
            url: getDbUrl(`/vaultRequests/${cachedApiData.id}`, "PUT"),
            data: JSON.stringify(data),
            headers: { "Content-Type": "application/json", "X-HTTP-Method-Override": "PUT" },
            onload: (res) => {
                if (res.status === 200) {
                    updateUI(data);
                }
                if (btn) { btn.innerText = "Submit Request"; btn.disabled = false; }
            }
        });
    }

    function cancelRequest() {
        hasActiveRequest = false;
        GM_setValue(ACTIVE_REQ_KEY, false);
        activeData = null;
        updateStatusIcon();
        resetUI();

        GM_xmlhttpRequest({
            method: "POST",
            url: getDbUrl(`/vaultRequests/${cachedApiData.id}`, "DELETE"),
            headers: { "X-HTTP-Method-Override": "DELETE" },
            onload: () => {
                updateStatusIcon();
            }
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
            if (limit !== 0 && elapsed >= limit) { cancelRequest(); } else {
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
                        hasActiveRequest = false;
                        GM_setValue(ACTIVE_REQ_KEY, false);
                        activeData = null;
                        resetUI();
                        updateStatusIcon();
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

    setInterval(injectUI, 500);
    setInterval(runHeartbeat, 30000);
    setInterval(fetchTornData, 60000);

    window.addEventListener('hashchange', injectUI);
    window.addEventListener('popstate', injectUI);
})();