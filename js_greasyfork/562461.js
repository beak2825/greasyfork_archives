// ==UserScript==
// @name         Torn OC 2.0 Completed Payout Status
// @namespace    torn.oc2.payout.floating
// @version      1.1
// @description  Floating box showing completed OCs waiting for payout 
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/562461/Torn%20OC%2020%20Completed%20Payout%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/562461/Torn%20OC%2020%20Completed%20Payout%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE    = 'https://api.torn.com/v2';
    const STORAGE_KEY = 'oc2_payout_api_key_v2';
    const POS_KEY     = 'oc2_payout_panel_pos';
    const color       = '#8abeef';

    let crimeData = null;
    let memberNames = {};
    let panelClosed = false;

    const style = document.createElement('style');
    style.textContent = `
.oc2-payout-panel {
  position: fixed;
  z-index: 999999;
  background: rgba(11, 15, 25, 0.95);
  border: 1px solid ${color};
  border-radius: 6px;
  padding: 0;
  color: ${color};
  font-size: 12px;
  font-family: Verdana, Arial, sans-serif;
  max-width: 340px;
  max-height: 70vh;
  box-shadow: 0 0 6px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
}
.oc2-payout-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 4px 6px;
  cursor: move;
  border-bottom: 1px solid ${color};
}
.oc2-payout-title-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.oc2-payout-buttons {
  flex-shrink: 0;
  cursor: default;
  display: flex;
  gap: 2px;
}
.oc2-payout-btn {
  padding: 0 4px;
  font-size: 10px;
  background: transparent;
  color: ${color};
  border: 1px solid ${color};
  border-radius: 3px;
  cursor: pointer;
  min-width: 30px;
}
.oc2-payout-btn:hover {
  background: rgba(138, 190, 239, 0.1);
}
.oc2-payout-body {
  padding: 4px 6px;
  line-height: 1.4;
  overflow-y: auto;
  flex: 1;
}
.oc2-payout-status {
  font-size: 10px;
  opacity: 0.8;
  margin-bottom: 4px;
  color: #9f9;
}
.oc2-payout-crime-card {
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(138, 190, 239, 0.2);
}
.oc2-payout-crime-title {
  font-weight: bold;
  font-size: 11px;
  margin-bottom: 2px;
  color: ${color};
}
.oc2-payout-role-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3px;
  padding: 2px 4px;
  background: rgba(138, 190, 239, 0.05);
  border-radius: 3px;
  font-size: 10px;
}
.oc2-payout-role-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.oc2-payout-role-position {
  font-weight: bold;
  color: ${color};
}
.oc2-payout-role-player {
  color: #aaa;
  font-size: 9px;
}
.oc2-payout-role-status {
  color: #ff8888;
  font-size: 9px;
  margin-top: 1px;
}
`;
    document.head.appendChild(style);

    async function getApiKey() {
        let key = await GM_getValue(STORAGE_KEY, '');
        if (!key) {
            key = window.prompt('Enter Torn API v2 key (faction crimes/members) for OC 2.0 payout tracker:');
            if (key) {
                key = key.trim();
                await GM_setValue(STORAGE_KEY, key);
            }
        }
        return key || null;
    }

    function onCrimesTab() {
        const href = window.location.href;
        return href.includes('factions.php?step=your') && href.includes('#/tab=crimes');
    }

    function apiV2(path, query) {
        return new Promise(async (resolve, reject) => {
            const key = await getApiKey();
            if (!key) {
                reject(new Error('Missing API key'));
                return;
            }
            const params = new URLSearchParams(Object.assign({}, query || {}));
            const url = `${API_BASE}${path}?${params.toString()}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: { 'Authorization': `ApiKey ${key}` },
                responseType: 'json',
                onload: res => {
                    try {
                        const data = res.response || JSON.parse(res.responseText);
                        if (data.error) reject(new Error(`API error ${data.error.code}: ${data.error.error}`));
                        else resolve(data);
                    } catch (e) {
                        reject(new Error('Parse error'));
                    }
                },
                onerror: () => reject(new Error('Network error'))
            });
        });
    }

    async function loadCrimes() {
        if (crimeData) return crimeData;

        const data = await apiV2('/faction/basic,crimes,members', {
            cat: 'available,completed',
            offset: '0',
            striptags: 'true',
            comment: 'oc2-payout-status-box'
        });

        crimeData = data;

        if (Array.isArray(data.members)) {
            for (const member of data.members) {
                memberNames[member.id] = member.name;
            }
        }

        return crimeData;
    }

    function createPanel() {
        if (document.getElementById('oc2-payout-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'oc2-payout-panel';
        panel.className = 'oc2-payout-panel';

        try {
            const saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
            if (saved && typeof saved.top === 'number' && typeof saved.left === 'number') {
                panel.style.top = saved.top + 'px';
                panel.style.left = saved.left + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            } else {
                panel.style.top = 'auto';
                panel.style.bottom = '20px';
                panel.style.right = '20px';
                panel.style.left = 'auto';
            }
        } catch(e) {
            panel.style.top = 'auto';
            panel.style.bottom = '20px';
            panel.style.right = '20px';
            panel.style.left = 'auto';
        }

        panel.innerHTML = `
            <div class="oc2-payout-title">
                <span class="oc2-payout-title-text">OC Payout Status</span>
                <span class="oc2-payout-buttons">
                    <button id="oc2-payout-refresh-btn" class="oc2-payout-btn" title="Refresh">↻</button>
                    <button id="oc2-payout-close-btn" class="oc2-payout-btn" title="Close">✖</button>
                </span>
            </div>
            <div class="oc2-payout-body">
                <div id="oc2-payout-status" class="oc2-payout-status">Loading...</div>
                <div id="oc2-payout-crimes"></div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel, panel.querySelector('.oc2-payout-title'));
        wirePanel(panel);
    }

    function makeDraggable(panel, handle) {
        let offsetX = 0, offsetY = 0, dragging = false;

        handle.addEventListener('mousedown', e => {
            if (e.target.classList.contains('oc2-payout-btn')) return;
            dragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
            e.preventDefault();
        });

        function onMove(e) {
            if (!dragging) return;
            const newLeft = e.clientX - offsetX;
            const newTop  = e.clientY - offsetY;
            panel.style.left = newLeft + 'px';
            panel.style.top  = newTop + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }

        function onUp() {
            if (!dragging) return;
            dragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            const rect = panel.getBoundingClientRect();
            localStorage.setItem(POS_KEY, JSON.stringify({ top: rect.top, left: rect.left }));
        }
    }

    function wirePanel(panel) {
        const closeBtn   = panel.querySelector('#oc2-payout-close-btn');
        const refreshBtn = panel.querySelector('#oc2-payout-refresh-btn');
        const statusDiv  = panel.querySelector('#oc2-payout-status');
        const crimesDiv  = panel.querySelector('#oc2-payout-crimes');

        closeBtn.addEventListener('click', () => {
            panel.remove();
            panelClosed = true;
        });

        async function reload(force) {
            statusDiv.textContent = 'Loading...';
            crimesDiv.innerHTML = '';
            if (force) {
                crimeData = null;
                memberNames = {};
            }
            try {
                const data = await loadCrimes();
                renderCompletedCrimes(crimesDiv, data, statusDiv);
            } catch (e) {
                statusDiv.textContent = `Error: ${e.message}`;
            }
        }

        refreshBtn.addEventListener('click', () => reload(true));
        reload(false);
    }

    function renderCompletedCrimes(container, data, statusDiv) {
        if (!data || !Array.isArray(data.crimes)) {
            statusDiv.textContent = 'No OC data available.';
            return;
        }

        const completedUnpaid = data.crimes.filter(crime => crime.status === 'Completed' && !crime.payout_issued);

        if (!completedUnpaid.length) {
            statusDiv.textContent = 'All completed OCs paid out!';
            return;
        }

        statusDiv.textContent = `${completedUnpaid.length} crime${completedUnpaid.length !== 1 ? 's' : ''} pending payout`;

        completedUnpaid.sort((a, b) => a.difficulty - b.difficulty);

        const frag = document.createDocumentFragment();

        for (const crime of completedUnpaid) {
            const card = document.createElement('div');
            card.className = 'oc2-payout-crime-card';

            const header = document.createElement('div');
            header.className = 'oc2-payout-crime-title';
            header.textContent = `${crime.name} (Lvl ${crime.difficulty})`;
            card.appendChild(header);

            if (crime.participants && Array.isArray(crime.participants)) {
                for (const participant of crime.participants) {
                    const row = document.createElement('div');
                    row.className = 'oc2-payout-role-row';

                    const left = document.createElement('div');
                    left.className = 'oc2-payout-role-left';

                    const role = document.createElement('div');
                    role.className = 'oc2-payout-role-position';
                    role.textContent = participant.position || 'Member';
                    left.appendChild(role);

                    const playerDiv = document.createElement('div');
                    playerDiv.className = 'oc2-payout-role-player';
                    const memberName = memberNames[participant.user_id] || participant.user_name || '';
                    playerDiv.textContent = memberName ? `${memberName} [${participant.user_id}]` : `[${participant.user_id}]`;
                    left.appendChild(playerDiv);

                    row.appendChild(left);
                    card.appendChild(row);
                }
            } else {
                const row = document.createElement('div');
                row.className = 'oc2-payout-role-row';

                const left = document.createElement('div');
                left.className = 'oc2-payout-role-left';

                const status = document.createElement('div');
                status.className = 'oc2-payout-role-status';
                status.textContent = 'Awaiting Payout Distribution';
                left.appendChild(status);

                row.appendChild(left);
                card.appendChild(row);
            }

            frag.appendChild(card);
        }

        container.appendChild(frag);
    }

    function checkAndCreatePanel() {
        if (onCrimesTab()) {
            if (!panelClosed && !document.getElementById('oc2-payout-panel')) {
                createPanel();
            }
        } else {
            const existing = document.getElementById('oc2-payout-panel');
            if (existing) existing.remove();
            panelClosed = false;
        }
    }

    function init() {
        checkAndCreatePanel();

        window.addEventListener('hashchange', () => {
            setTimeout(checkAndCreatePanel, 100);
        });

        const observer = new MutationObserver(() => {
            if (onCrimesTab() && !panelClosed && !document.getElementById('oc2-payout-panel')) {
                createPanel();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
    }
})();
