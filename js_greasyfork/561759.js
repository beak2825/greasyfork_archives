// ==UserScript==
// @name         KFC Faction Vault - Management
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Add management vault request interface to faction armory page.
// @author       Deviyl[3722358]
// @author       Special thanks to Wolfylein[3913421] for the amazing support.
// @icon         https://wolftimer.com/Leaderboard/favicon.png
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      torn-faction-vault-default-rtdb.firebaseio.com
// @downloadURL https://update.greasyfork.org/scripts/561759/KFC%20Faction%20Vault%20-%20Management.user.js
// @updateURL https://update.greasyfork.org/scripts/561759/KFC%20Faction%20Vault%20-%20Management.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const dbURL = "https://torn-faction-vault-default-rtdb.firebaseio.com";
    const formatMoney = (val) => val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    function isArmouryPage() { return window.location.href.includes('factions.php?step=your') && window.location.href.includes('tab=armoury'); }

    function timeSince(timeStamp) {
        const now = new Date(), secondsPast = Math.floor((now.getTime() - timeStamp) / 1000);
        if (secondsPast < 60) return `${secondsPast}s`;
        if (secondsPast < 3600) return `${Math.floor(secondsPast / 60)}m ${secondsPast % 60}s`;
        return `${Math.floor(secondsPast / 3600)}h ${Math.floor((secondsPast % 3600) / 60)}m`;
    }

    function updateStatusIcon(requestCount) {
        const iconList = document.querySelector('ul[class*="status-icons"]');
        if (!iconList) return;
        let vaultIcon = document.getElementById('mgmt-vault-notification-icon');

        if (requestCount > 0) {
            const tooltipText = `Vault Requests — ${requestCount} pending`;

            if (!vaultIcon) {
                vaultIcon = document.createElement('li');
                vaultIcon.id = 'mgmt-vault-notification-icon';
                vaultIcon.style = "background-image: url('https://www.wolftimer.com/images/vault.png'); cursor: pointer;";

                const a = document.createElement('a');
                a.href = "/factions.php?step=your#/tab=armoury";
                a.setAttribute('aria-label', tooltipText);
                a.style = "display: block; width: 100%; height: 100%;";

                vaultIcon.appendChild(a);
                iconList.appendChild(vaultIcon);
                enableTornStyleTooltip(a);
            } else {
                const a = vaultIcon.querySelector('a');
                if (a) {
                    a.setAttribute('aria-label', tooltipText);
                    if (typeof a.__updateTip === 'function') a.__updateTip(tooltipText);
                }
            }
        } else if (vaultIcon) {
            vaultIcon.remove();
        }

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
                if (tipEl) {
                    const [title, subtitle] = text.split(' — ');
                    const b = tipEl.querySelector('b');
                    if (b) b.textContent = title;
                    const subDiv = tipEl.querySelector('div');
                    if (subDiv && subtitle) subDiv.textContent = subtitle;
                }
            };
        }
    }

    function toggleMgmtCollapse() {
        const content = document.getElementById('mgmt-collapsible-content');
        const arrow = document.getElementById('mgmt-collapse-arrow');
        const title = document.getElementById('mgmt-title-text');
        const isCollapsed = content.style.display === 'none';
        content.style.display = isCollapsed ? 'block' : 'none';
        arrow.innerText = isCollapsed ? '▼' : '▶';
        title.innerText = isCollapsed ? 'MANAGEMENT: PENDING PAYOUTS' : 'Management Vault Requests';
        localStorage.setItem('torn_mgmt_collapsed', !isCollapsed);
    }

    function injectManagementUI() {
        if (!isArmouryPage()) { const e = document.getElementById('vault-mgmt-container'); if (e) e.remove(); return; }
        const memberUI = document.getElementById('vault-request-container');
        const mgmtUI = document.getElementById('vault-mgmt-container');
        const targetPoint = document.querySelector('li.clear');
        if (!targetPoint) return;
        if (!mgmtUI) {
            const isCollapsed = localStorage.getItem('torn_mgmt_collapsed') === 'true';
            const container = document.createElement('div');
            container.id = 'vault-mgmt-container';
            container.style = "background: #333; border: 1px solid #444; border-radius: 5px; padding: 12px; margin: 10px 0; color: #fff; font-family: Arial, sans-serif;";
            container.innerHTML = `
                <div id="mgmt-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
                    <b id="mgmt-title-text" style="font-size: 13px; color: #ff8800; letter-spacing: 0.5px; font-weight: bold; text-transform: uppercase;">${isCollapsed ? 'Management Vault Requests' : 'MANAGEMENT: PENDING PAYOUTS'}</b>
                    <span id="mgmt-collapse-arrow" style="font-size: 12px; color: #aaa;">${isCollapsed ? '▶' : '▼'}</span>
                </div>
                <div id="mgmt-collapsible-content" style="display: ${isCollapsed ? 'none' : 'block'}; margin-top: 12px;">
                    <div id="mgmt-request-list" style="display: flex; flex-direction: column; gap: 8px;">
                        <p style="font-size: 12px; color: #aaa;">Syncing...</p>
                    </div>
                    <div id="mgmt-footer-note" style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #444; font-size: 11px; color: #aaa; font-style: italic; line-height: 1.4;">
                        Note: This marks the request complete. <b>Click "Give" on the next page.</b>
                    </div>
                </div>
            `;
            if (memberUI) memberUI.after(container); else targetPoint.after(container);
            document.getElementById('mgmt-header').addEventListener('click', toggleMgmtCollapse);
            fetchRequests();
        } else if (memberUI && mgmtUI.previousSibling !== memberUI) {
            memberUI.after(mgmtUI);
        }
    }

    function fetchRequests() {
        const listContainer = document.getElementById('mgmt-request-list');
        GM_xmlhttpRequest({
            method: "GET",
            url: `${dbURL}/vaultRequests.json`,
            onload: (res) => {
                try {
                    let data = JSON.parse(res.responseText);
                    if (!data || data === "null") data = {};

                    const now = Date.now();
                    const filteredData = {};

                    Object.entries(data).forEach(([userId, req]) => {
                        const limit = (req.timeout || 0) * 60 * 1000;
                        if (limit !== 0 && (now - req.timestamp >= limit)) {
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: `${dbURL}/vaultRequests/${userId}.json`,
                                headers: { "X-HTTP-Method-Override": "DELETE" }
                            });
                        } else {
                            filteredData[userId] = req;
                        }
                    });

                    const count = Object.keys(filteredData).length;
                    sessionStorage.setItem('torn_mgmt_vault_count', count);
                    updateStatusIcon(count);

                    if (listContainer) {
                        if (count === 0) { listContainer.innerHTML = '<p style="font-size: 12px; color: #aaa;">No pending requests.</p>'; }
                        else { renderRequests(filteredData); }
                    }
                } catch (e) { updateStatusIcon(0); }
            }
        });
    }

    function renderRequests(requests) {
        const listContainer = document.getElementById('mgmt-request-list');
        if (!listContainer) return;
        let html = '';
        Object.entries(requests).forEach(([userId, data]) => {
            if (data && data.name) {
                const prefLabel = data.pref === 1 ? '<span style="color: #6fb33d;">Send when Online</span>' : '<span style="color: #888;">Send Anytime</span>';
                html += `
                <div style="display: flex; flex-wrap: wrap; align-items: center; background: #222; padding: 10px; border-radius: 3px; border-left: 4px solid #ff8800; row-gap: 8px;">
                    <div style="display: flex; align-items: center; flex-grow: 1; min-width: 280px;">
                        <div style="width: 110px; flex-shrink: 0; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            <a href="https://www.torn.com/profiles.php?XID=${data.id}" style="color: #3777ce; font-weight: bold; text-decoration: none;">${data.name}</a>
                        </div>
                        <div style="width: 105px; flex-shrink: 0; font-size: 10px; font-weight: bold;">
                            ${prefLabel}
                        </div>
                        <div style="width: 65px; flex-shrink: 0; font-size: 11px; color: #aaa;">
                            <span class="mgmt-timer" data-start="${data.timestamp}">${timeSince(data.timestamp)}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; flex-grow: 1; justify-content: space-between; min-width: 180px;">
                        <div style="font-size: 13px; color: #fff; font-weight: bold;">
                            $${formatMoney(data.amount)}
                        </div>
                        <div style="text-align: right;">
                            <button class="payout-btn" data-id="${data.id}" data-amt="${data.amount}" style="background: #3777ce; color: #fff; border: none; padding: 6px 14px; border-radius: 3px; cursor: pointer; font-weight: bold; font-size: 11px;">PAYOUT</button>
                        </div>
                    </div>
                </div>`;
            }
        });
        listContainer.innerHTML = html;
        listContainer.querySelectorAll('.payout-btn').forEach(btn => { btn.onclick = function() { handlePayout(this.dataset.id, this.dataset.amt); }; });
    }

    function handlePayout(userId, amount) {
        GM_xmlhttpRequest({ method: "GET", url: `${dbURL}/vaultRequests/${userId}.json`, onload: (res) => {
            if (!JSON.parse(res.responseText)) { alert("⚠️ Already handled!"); fetchRequests(); return; }

            GM_xmlhttpRequest({
                method: "POST",
                url: `${dbURL}/vaultRequests/${userId}.json`,
                headers: { "X-HTTP-Method-Override": "DELETE" },
                onload: () => { window.location.assign(`https://www.torn.com/factions.php?step=your#/tab=controls&option=give-to-user&giveMoneyTo=${userId}&money=${amount}`); }
            });
        }});
    }

    setInterval(() => {
        document.querySelectorAll('.mgmt-timer').forEach(span => {
            span.innerText = timeSince(parseInt(span.dataset.start));
        });
    }, 1000);

    injectManagementUI();
    setInterval(injectManagementUI, 1000);

    const cachedCount = sessionStorage.getItem('torn_mgmt_vault_count');
    if (cachedCount !== null) {
        updateStatusIcon(parseInt(cachedCount));
    }

    fetchRequests();
    setInterval(fetchRequests, 5000);
})();