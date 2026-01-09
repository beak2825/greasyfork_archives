// ==UserScript==
// @name         KFC Faction Vault - Member
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Add vault request interface to faction armory page.
// @author       Deviyl[3722358]
// @icon         https://wolftimer.com/Leaderboard/favicon.png
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      torn-faction-vault-default-rtdb.firebaseio.com
// @downloadURL https://update.greasyfork.org/scripts/561756/KFC%20Faction%20Vault%20-%20Member.user.js
// @updateURL https://update.greasyfork.org/scripts/561756/KFC%20Faction%20Vault%20-%20Member.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const FACTION_NAME = "Kentucky Fried Criminals";
    const dbURL = "https://torn-faction-vault-default-rtdb.firebaseio.com";
    let pollInterval = null, timerInterval = null;

    const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const parseMoney = (val) => parseInt(val.toString().replace(/[^0-9]/g, "")) || 0;

    function getVaultBalance() {
        const balanceElem = document.querySelector('.money-balance');
        return balanceElem ? parseMoney(balanceElem.innerText) : 0;
    }

    function isArmouryPage() { return window.location.href.includes('tab=armoury'); }
    function isMemberOfFaction() {
        const factionLink = document.querySelector('a[href*="factions.php?step=your"][aria-label*="of "]');
        return factionLink ? factionLink.getAttribute('aria-label').includes(`of ${FACTION_NAME}`) : false;
    }

    function getPlayerData() {
        const monScript = document.querySelector('script[src*="mon.js"]');
        if (!monScript) return null;
        const id = monScript.getAttribute('playerid');
        const name = monScript.getAttribute('playername');
        return (id && name) ? { id, name } : null;
    }

    function toggleCollapse() {
        const content = document.getElementById('vault-collapsible-content');
        const arrow = document.getElementById('vault-collapse-arrow');
        const isCollapsed = content.style.display === 'none';
        content.style.display = isCollapsed ? 'block' : 'none';
        arrow.innerText = isCollapsed ? '▼' : '▶';
        localStorage.setItem('torn_vault_collapsed', !isCollapsed);
    }

    function injectUI() {
        const existing = document.getElementById('vault-request-container');
        if (!isArmouryPage() || !isMemberOfFaction()) { if (existing) existing.remove(); return; }
        if (existing) {
            const span = document.getElementById('balance-amount-span');
            if (span) span.innerText = formatMoney(getVaultBalance());
            return;
        }

        const isCollapsed = localStorage.getItem('torn_vault_collapsed') === 'true';
        const prefOnline = localStorage.getItem('torn_vault_pref_online') === 'true';
        const savedTimeout = localStorage.getItem('torn_vault_timeout_mins') || "10";

        const container = document.createElement('div');
        container.id = 'vault-request-container';
        container.style = "background: #333; border: 1px solid #444; border-radius: 5px; padding: 12px; margin: 10px 0; color: #fff; font-family: Arial, sans-serif;";

        const style = document.createElement('style');
        style.innerHTML = `
            #vault-timeout-mins::-webkit-outer-spin-button,
            #vault-timeout-mins::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            #vault-timeout-mins { -moz-appearance: textfield; }
        `;
        document.head.appendChild(style);

        container.innerHTML = `
            <div id="vault-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                <b id="vault-title-text" style="font-size: 13px; color: #ddd; letter-spacing: 0.5px; font-weight: bold; text-transform: uppercase;">VAULT BALANCE REQUEST</b>
                <span id="vault-collapse-arrow" style="font-size: 12px; color: #aaa;">${isCollapsed ? '▶' : '▼'}</span>
            </div>
            <div id="vault-collapsible-content" style="display: ${isCollapsed ? 'none' : 'block'}; margin-top: 12px;">
                <div id="vault-input-area">
                    <div style="display: flex; gap: 5px; margin-bottom: 12px; flex-wrap: wrap;">
                        ${[1, 2, 5, 10, 15].map(n => `<button class="q-btn" data-amt="${n*1000000}" style="background:#444; color:white; border:1px solid #555; padding:4px 10px; border-radius:3px; cursor:pointer; font-size:11px;">${n}m</button>`).join('')}
                        <button id="btn-full" style="background:#444; color:white; border:1px solid #555; padding:4px 10px; border-radius:3px; cursor:pointer; font-size:11px;">FULL</button>
                    </div>
                    <div style="position: relative; width: 100%; margin-bottom: 10px;">
                        <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #888; font-weight: bold;">$</span>
                        <input type="text" id="vault-amount" placeholder="0" style="width: 100%; box-sizing: border-box; padding: 8px 10px 8px 25px; border: 1px solid #555; background: #222; color: #fff; border-radius: 3px; font-size: 16px;">
                    </div>

                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px; height: 24px;">
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #ccc;">
                            <input type="checkbox" id="vault-pref-online" ${prefOnline ? 'checked' : ''} style="cursor:pointer;">
                            <label for="vault-pref-online" style="cursor:pointer; user-select:none;">Request Fulfillment when Online</label>
                        </div>

                        <div id="timeout-input-wrapper" style="display: ${prefOnline ? 'flex' : 'none'}; align-items: center; gap: 6px; font-size: 12px; color: #ccc;">
                            <span>Timeout in:</span>
                            <input type="number" id="vault-timeout-mins" value="${savedTimeout}" style="width: 35px; background: #222; color: #fff; border: 1px solid #555; border-radius: 3px; padding: 2px 4px; font-size: 11px; text-align: center;">
                            <span>minutes</span>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                        <p style="color: #aaa; font-size: 12px; margin: 0;">Your current balance: <span style="color: #fff; font-weight: bold;">$<span id="balance-amount-span">${formatMoney(getVaultBalance())}</span></span></p>
                        <button id="vault-submit" style="padding: 6px 15px; cursor: pointer; background: #3777ce; color: #fff; border: none; border-radius: 3px; font-weight: bold; font-size: 12px;">Submit Request</button>
                        <p id="vault-error" style="color: #ff4444; font-size: 11px; margin: 0; display: none;">⚠ Amount exceeds balance!</p>
                    </div>
                </div>
                <div id="vault-status-area" style="display:none;">
                    <p id="vault-status-text" style="margin-bottom: 10px; line-height: 1.5; font-size: 13px;"></p>
                    <button id="vault-cancel" style="padding: 6px 15px; cursor: pointer; background: #b32d2d; color: #fff; border: none; border-radius: 3px; font-size: 11px;">Cancel Request</button>
                </div>
            </div>
        `;
        document.querySelector('li.clear').after(container);
        document.getElementById('vault-header').addEventListener('click', toggleCollapse);

        const prefCheck = document.getElementById('vault-pref-online');
        const timeoutWrapper = document.getElementById('timeout-input-wrapper');

        prefCheck.addEventListener('change', (e) => {
            localStorage.setItem('torn_vault_pref_online', e.target.checked);
            timeoutWrapper.style.display = e.target.checked ? 'flex' : 'none';
        });

        document.getElementById('vault-timeout-mins').addEventListener('input', (e) => {
            localStorage.setItem('torn_vault_timeout_mins', e.target.value);
        });

        document.getElementById('vault-amount').addEventListener('input', (e) => { e.target.value = formatMoney(parseMoney(e.target.value)); validateAmount(parseMoney(e.target.value)); });
        container.querySelectorAll('.q-btn').forEach(btn => btn.addEventListener('click', () => { document.getElementById('vault-amount').value = formatMoney(btn.dataset.amt); validateAmount(parseMoney(btn.dataset.amt)); }));
        document.getElementById('btn-full').addEventListener('click', () => { const b = getVaultBalance(); document.getElementById('vault-amount').value = formatMoney(b); validateAmount(b); });
        document.getElementById('vault-submit').addEventListener('click', submitRequest);
        document.getElementById('vault-cancel').addEventListener('click', cancelRequest);
        checkExistingRequest();
    }

    function validateAmount(amt) {
        const bal = getVaultBalance(), sub = document.getElementById('vault-submit'), err = document.getElementById('vault-error');
        if (amt > bal) { err.style.display = 'inline-block'; sub.disabled = true; sub.style.opacity = '0.5'; }
        else { err.style.display = 'none'; sub.disabled = false; sub.style.opacity = '1'; }
    }

    function submitRequest() {
        const player = getPlayerData();
        if (!player) return;
        const id = player.id;
        const name = player.name;
        const amt = parseMoney(document.getElementById('vault-amount').value);
        const isOnlinePref = document.getElementById('vault-pref-online').checked;
        const timeoutMins = isOnlinePref ? parseInt(document.getElementById('vault-timeout-mins').value) || 10 : 0;

        if (amt > getVaultBalance() || amt <= 0) return;
        const data = { name, id, amount: amt, pref: isOnlinePref ? 1 : 0, timeout: timeoutMins, timestamp: Date.now() };

        GM_xmlhttpRequest({
            method: "POST",
            url: `${dbURL}/vaultRequests/${id}.json`,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "X-HTTP-Method-Override": "PUT"
            },
            onload: (res) => { if (res.status === 200) updateUI(data); }
        });
    }

    function cancelRequest() {
        const player = getPlayerData();
        if (!player) return;
        const id = player.id;

        GM_xmlhttpRequest({
            method: "POST",
            url: `${dbURL}/vaultRequests/${id}.json`,
            headers: { "X-HTTP-Method-Override": "DELETE" },
            onload: () => { resetUI(); }
        });
    }

    function checkExistingRequest() {
        const player = getPlayerData();
        if (!player) return;
        const id = player.id;
        GM_xmlhttpRequest({ method: "GET", url: `${dbURL}/vaultRequests/${id}.json`, onload: (res) => {
            try {
                const data = JSON.parse(res.responseText);
                if (data) {
                    const limit = (data.timeout || 0) * 60 * 1000;
                    if (limit === 0 || (Date.now() - data.timestamp < limit)) { updateUI(data); } else { cancelRequest(); }
                } else { resetUI(); }
            } catch(e) {}
        }});
    }

    function resetUI() {
        if(pollInterval) clearInterval(pollInterval); if(timerInterval) clearInterval(timerInterval);
        const ia = document.getElementById('vault-input-area'), sa = document.getElementById('vault-status-area');
        if (ia && sa) { ia.style.display = 'block'; sa.style.display = 'none'; document.getElementById('vault-amount').value = ''; }
    }

    function updateUI(data) {
        const ia = document.getElementById('vault-input-area'), sa = document.getElementById('vault-status-area');
        if (!ia || !sa) return;
        ia.style.display = 'none'; sa.style.display = 'block';
        const timer = () => {
            const limit = (data.timeout || 0) * 60 * 1000;
            const elapsed = Date.now() - data.timestamp;
            if (limit !== 0 && elapsed >= limit) { cancelRequest(); } else {
                let timeText = limit === 0 ? "No expiration" : "";
                if (limit !== 0) {
                    const rem = limit - elapsed;
                    const m = Math.floor(rem / 60000), s = Math.floor((rem % 60000) / 1000);
                    timeText = `Expires in: ${m}m ${s}s`;
                }
                const statusText = document.getElementById('vault-status-text');
                if (statusText) statusText.innerHTML = `Requesting: <span style="color: #6fb33d; font-weight: bold; font-size: 15px;">$${formatMoney(data.amount)}</span><br><span style="color: #aaa; font-size: 11px;">${timeText}</span>`;
            }
        };
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(() => { GM_xmlhttpRequest({ method: "GET", url: `${dbURL}/vaultRequests/${data.id}.json`, onload: (res) => { if (res.responseText === "null") resetUI(); }}); }, 5000);
        if (timerInterval) clearInterval(timerInterval); timer(); timerInterval = setInterval(timer, 1000);
    }

    setInterval(injectUI, 1000);
})();