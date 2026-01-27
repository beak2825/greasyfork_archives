// ==UserScript==
// @name         Torn Revive Status Indicator (Dedicated Column)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a dedicated Revive Status column to faction member lists
// @author       blacksmithop
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561266/Torn%20Revive%20Status%20Indicator%20%28Dedicated%20Column%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561266/Torn%20Revive%20Status%20Indicator%20%28Dedicated%20Column%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MIN_REFRESH_INTERVAL = 2 * 60 * 1000;
    const AUTO_REFRESH_INTERVAL = 60 * 1000;

    let API_KEY = GM_getValue("torn_revive_api_key", null);
    let lastApiCallTime = GM_getValue("last_api_call_time", {}) || {};
    let reviveDataCache = GM_getValue("revive_data_cache", { data: {}, timestamp: 0 });
    let autoRefreshTimer = null;

    const reviveIcons = {
        revivable: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" style="fill: #4CAF50;"><circle cx="8" cy="8" r="7" stroke="#2E7D32" stroke-width="1"/><path d="M5 8L7 10L11 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
        notRevivable: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" style="fill: #F44336;"><circle cx="8" cy="8" r="7" stroke="#C62828" stroke-width="1"/><path d="M5 5L11 11M5 11L11 5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
        unknown: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16" style="fill: #9E9E9E;"><circle cx="8" cy="8" r="7" stroke="#757575" stroke-width="1"/><text x="8" y="11.5" text-anchor="middle" font-family="Arial" font-size="9" font-weight="bold" fill="#fff">?</text></svg>`
    };

    GM_registerMenuCommand("Set Torn API Key", () => {
        let userInput = prompt("Enter Public API Key:", API_KEY || "");
        if (userInput) {
            API_KEY = userInput;
            GM_setValue("torn_revive_api_key", API_KEY);
            location.reload();
        }
    });

    const styles = `
        .revive__section-class { padding: 0 10px; margin-bottom: 10px; }
        .revive__section-class strong { display: block; color: #fff; font-size: 13px; font-weight: 700; margin-bottom: 5px; text-shadow: 0 1px 0 rgba(0,0,0,0.5); }
        .revive-status-separator { border: none; border-top: 1px solid #444; margin: 8px 0; opacity: 0.5; }
        .revive-refresh-btn {
            background: linear-gradient(180deg, #444 0%, #222 100%);
            border: 1px solid #111; border-radius: 4px; color: #ccc;
            cursor: pointer; font-size: 10px; font-weight: 700; padding: 3px 10px;
            text-transform: uppercase;
        }
        .revive-refresh-btn:hover { background: linear-gradient(180deg, #555 0%, #333 100%); color: #fff; }
        .revive-cache-info { color: #888; font-size: 11px; margin-left: 8px; }

        /* Column Specific Styles */
        .tt-revive-col { width: 45px; display: flex; justify-content: center; align-items: center; }
        li.table-cell.tt-revive-header { width: 45px; text-align: center; justify-content: center; }
    `;

    function getFactionId() {
        const match = window.location.href.match(/[?&](?:ID|id|XID)=(\d+)/i);
        return match ? match[1] : null;
    }

    async function fetchFactionData(factionId, force = false) {
        if (!API_KEY) return null;
        const now = Date.now();
        if (!force && (now - (lastApiCallTime[factionId] || 0) < MIN_REFRESH_INTERVAL)) {
            return reviveDataCache.data[factionId] || null;
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/v2/faction/${factionId}/members?key=${API_KEY}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        const reviveMap = {};
                        data.members.forEach(m => reviveMap[m.id] = m.is_revivable);
                        reviveDataCache.data[factionId] = reviveMap;
                        reviveDataCache.timestamp = now;
                        lastApiCallTime[factionId] = now;
                        GM_setValue("revive_data_cache", reviveDataCache);
                        GM_setValue("last_api_call_time", lastApiCallTime);
                        resolve(reviveMap);
                    } catch (e) { resolve(null); }
                }
            });
        });
    }

    function injectHeader() {
        const header = document.querySelector('.table-header');
        if (!header || header.querySelector('.tt-revive-header')) return;

        const reviveHeader = document.createElement('li');
        reviveHeader.className = 'table-cell tt-revive-header torn-divider divider-vertical';
        reviveHeader.textContent = 'Rev';
        reviveHeader.title = 'Revive Status';

        const iconsHeader = header.querySelector('.member-icons');
        if (iconsHeader) iconsHeader.before(reviveHeader);
    }

    function injectReviveFilter() {
        const filterContent = document.querySelector('#memberFilter .content');
        if (!filterContent || filterContent.querySelector('.revive__section-class')) return;

        const section = document.createElement('div');
        section.className = 'revive__section-class';
        section.innerHTML = `
            <hr class="revive-status-separator">
            <strong>Revive Status</strong>
            <div class="tt-checkbox-list-wrapper tt-checkbox-list-column">
                <div class="tt-checkbox-wrapper">
                    <label style="color:#ccc; cursor:pointer;"><input type="checkbox" id="revivable-only"> Hide non-revivable</label>
                </div>
                <div class="tt-checkbox-wrapper">
                    <label style="color:#ccc; cursor:pointer;"><input type="checkbox" id="auto-refresh-revive"> Auto-Refresh (1m)</label>
                </div>
            </div>
            <div style="margin-top:8px; display:flex; align-items:center;">
                <button class="revive-refresh-btn">Refresh</button>
                <span class="revive-cache-info"></span>
            </div>
        `;

        const activitySection = filterContent.querySelector('.activity__section-class');
        if (activitySection) activitySection.after(section);
        else filterContent.prepend(section);

        section.querySelector('#revivable-only').onchange = (e) => {
            GM_setValue("hide_non_revivable", e.target.checked);
            applyFilter();
        };
        section.querySelector('#revivable-only').checked = GM_getValue("hide_non_revivable", false);

        const autoCb = section.querySelector('#auto-refresh-revive');
        autoCb.checked = GM_getValue("auto_refresh_enabled", false);
        autoCb.onchange = (e) => {
            GM_setValue("auto_refresh_enabled", e.target.checked);
            toggleAutoRefresh(e.target.checked);
        };

        section.querySelector('.revive-refresh-btn').onclick = () => processRows(true);
        toggleAutoRefresh(autoCb.checked);
    }

    function toggleAutoRefresh(enabled) {
        clearInterval(autoRefreshTimer);
        if (enabled) autoRefreshTimer = setInterval(() => processRows(true), AUTO_REFRESH_INTERVAL);
    }

    function applyFilter() {
        const hide = GM_getValue("hide_non_revivable", false);
        document.querySelectorAll('.table-row').forEach(row => {
            const status = row.getAttribute('data-revivable');
            row.style.display = (hide && status === 'false') ? 'none' : '';
        });
    }

    async function processRows(force = false) {
        const fid = getFactionId();
        if (!fid) return;

        const data = await fetchFactionData(fid, force);
        if (!data) return;

        injectHeader();

        document.querySelectorAll('.table-row').forEach(row => {
            const link = row.querySelector('a[href*="XID="]');
            if (!link) return;
            const id = link.href.match(/XID=(\d+)/)[1];
            const status = data[id];

            row.setAttribute('data-revivable', status);

            let reviveCell = row.querySelector('.tt-revive-col');
            if (!reviveCell) {
                reviveCell = document.createElement('div');
                reviveCell.className = 'table-cell tt-revive-col';
                const iconsCell = row.querySelector('.member-icons');
                if (iconsCell) iconsCell.before(reviveCell);
            }
            reviveCell.innerHTML = status === true ? reviveIcons.revivable :
                                   status === false ? reviveIcons.notRevivable : reviveIcons.unknown;
        });

        injectReviveFilter();
        applyFilter();
        const info = document.querySelector('.revive-cache-info');
        if (info) {
            const age = Math.round((Date.now() - reviveDataCache.timestamp) / 1000);
            info.textContent = age < 60 ? `${age}s ago` : `${Math.floor(age/60)}m ago`;
        }
    }

    const init = () => {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        setTimeout(() => processRows(false), 500);
        let debounce;
        new MutationObserver(() => {
            clearTimeout(debounce);
            debounce = setTimeout(() => processRows(false), 1000);
        }).observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();