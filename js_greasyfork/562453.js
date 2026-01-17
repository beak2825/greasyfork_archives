// ==UserScript==
// @name         Torn OC 2.0 Missing Item Roles
// @namespace    torn.oc2.items.floating
// @version      2.3.2
// @description  Floating box listing only OC 2.0 Planning crimes with roles missing items
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/562453/Torn%20OC%2020%20Missing%20Item%20Roles.user.js
// @updateURL https://update.greasyfork.org/scripts/562453/Torn%20OC%2020%20Missing%20Item%20Roles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE    = 'https://api.torn.com/v2';
    const STORAGE_KEY = 'oc2_items_api_key_v2';
    const POS_KEY     = 'oc2_items_panel_pos'; // stores {left, top}
    const color       = '#8abeef';

    let crimeData = null;
    let itemNames = {};
    let memberNames = {};
    let panelClosed = false;

    const style = document.createElement('style');
    style.textContent = `
.oc2-items-panel {
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
.oc2-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 4px 6px;
  cursor: move;
  border-bottom: 1px solid ${color};
  position: relative;
  z-index: 1000000;
  pointer-events: auto;
}
.oc2-title-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.oc2-buttons {
  flex-shrink: 0;
  cursor: default;
  display: flex;
  gap: 2px;
}
.oc2-btn {
  padding: 0 4px;
  font-size: 10px;
  background: transparent;
  color: ${color};
  border: 1px solid ${color};
  border-radius: 3px;
  cursor: pointer;
  min-width: 30px;
}
.oc2-btn:hover {
  background: rgba(138, 190, 239, 0.1);
}
.oc2-body {
  padding: 4px 6px;
  line-height: 1.4;
  overflow-y: auto;
  flex: 1;
}
.oc2-status {
  font-size: 10px;
  opacity: 0.8;
  margin-bottom: 4px;
  color: #9f9;
}
.oc2-crime-card {
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(138, 190, 239, 0.2);
}
.oc2-crime-title {
  font-weight: bold;
  font-size: 11px;
  margin-bottom: 2px;
  color: ${color};
}
.oc2-role-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3px;
  padding: 2px 4px;
  background: rgba(138, 190, 239, 0.05);
  border-radius: 3px;
  font-size: 10px;
}
.oc2-role-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.oc2-role-position {
  font-weight: bold;
  color: ${color};
}
.oc2-role-player {
  color: #aaa;
  font-size: 9px;
}
.oc2-role-item {
  color: #ff8888;
  font-size: 9px;
  margin-top: 1px;
}
`;
    document.head.appendChild(style);

    // -------- API key handling --------
    async function getApiKey() {
        let key = await GM_getValue(STORAGE_KEY, '');
        if (!key) {
            key = window.prompt('Enter Torn API v2 key (faction crimes/members) for OC 2.0 items:');
            if (key) {
                key = key.trim();
                await GM_setValue(STORAGE_KEY, key);
            }
        }
        return key || null;
    }

    // -------- OC 2.0 tab detection --------
    function onCrimesTab() {
        const href = window.location.href;
        return href.includes('factions.php?step=your') && href.includes('#/tab=crimes');
    }

    // -------- API calls --------
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

    function apiItemsByIds(idArray) {
        return new Promise(async (resolve, reject) => {
            const key = await getApiKey();
            if (!key) {
                reject(new Error('Missing API key'));
                return;
            }
            const idsStr = idArray.join(',');
            const url = `https://api.torn.com/torn/${idsStr}?selections=items&key=${key}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'json',
                onload: res => {
                    try {
                        const data = res.response || JSON.parse(res.responseText);
                        if (data.error) reject(new Error(`Items API error ${data.error.code}: ${data.error.error}`));
                        else resolve(data);
                    } catch (e) {
                        reject(new Error('Parse error (items)'));
                    }
                },
                onerror: () => reject(new Error('Network error (items)'))
            });
        });
    }

    async function loadCrimesAndItems() {
        if (crimeData) return crimeData;

        const data = await apiV2('/faction/basic,crimes,members', {
            cat: 'available,completed',
            offset: '0',
            striptags: 'true',
            comment: 'oc2-missing-items-box'
        });

        crimeData = data;

        if (Array.isArray(data.members)) {
            for (const member of data.members) {
                memberNames[member.id] = member.name;
            }
        }

        const idSet = new Set();
        if (Array.isArray(data.crimes)) {
            for (const crime of data.crimes) {
                if (!crime.slots) continue;
                if (crime.status !== 'Planning') continue;
                for (const slot of crime.slots) {
                    const req = slot.item_requirement;
                    if (req && req.id && req.is_available === false) {
                        idSet.add(req.id);
                    }
                }
            }
        }

        const ids = Array.from(idSet);
        if (!ids.length) return crimeData;

        const itemsData = await apiItemsByIds(ids);
        if (itemsData && itemsData.items) {
            for (const [id, info] of Object.entries(itemsData.items)) {
                itemNames[Number(id)] = { name: info.name };
            }
        }

        return crimeData;
    }

    // -------- floating panel --------
    function createPanel() {
        if (document.getElementById('oc2-items-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'oc2-items-panel';
        panel.className = 'oc2-items-panel';

        try {
            const saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
            if (saved && typeof saved.top === 'number' && typeof saved.left === 'number') {
                panel.style.left = saved.left + 'px';
                panel.style.top  = saved.top + 'px';
            } else {
                panel.style.top = '90px';
                panel.style.right = '20px';
            }
        } catch(e) {
            panel.style.top = '90px';
            panel.style.right = '20px';
        }

        panel.innerHTML = `
            <div class="oc2-title">
                <span class="oc2-title-text">OC 2.0 Missing Items</span>
                <span class="oc2-buttons">
                    <button id="oc2-refresh-btn" class="oc2-btn" title="Refresh">↻</button>
                    <button id="oc2-close-btn" class="oc2-btn" title="Close">✖</button>
                </span>
            </div>
            <div class="oc2-body">
                <div id="oc2-status" class="oc2-status">Loading...</div>
                <div id="oc2-crimes"></div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggableOC(panel, panel.querySelector('.oc2-title'));
        wirePanel(panel);
    }

    // -------- draggable --------
    function makeDraggableOC(element, handle) {
        let isDown = false;
        let startX = 0, startY = 0;
        let startLeft = 0, startTop = 0;

        function startDrag(clientX, clientY) {
            isDown = true;

            const rect = element.getBoundingClientRect();
            element.style.left   = rect.left + 'px';
            element.style.top    = rect.top + 'px';
            element.style.right  = 'auto';
            element.style.bottom = 'auto';

            startX = clientX;
            startY = clientY;
            startLeft = rect.left;
            startTop  = rect.top;

            document.body.style.userSelect = 'none';
            document.body.style.overflow  = 'hidden';
        }

        function moveDrag(clientX, clientY) {
            const dx = clientX - startX;
            const dy = clientY - startY;

            element.style.left = (startLeft + dx) + 'px';
            element.style.top  = (startTop  + dy) + 'px';
        }

        function endDrag() {
            isDown = false;
            document.body.style.userSelect = '';
            document.body.style.overflow  = '';

            try {
                const rect = element.getBoundingClientRect();
                const pos = { left: rect.left, top: rect.top };
                localStorage.setItem(POS_KEY, JSON.stringify(pos));
            } catch (e) {
                console.error('Error saving OC panel position', e);
            }
        }

        handle.addEventListener('mousedown', (e) => {
            if (e.target && e.target.classList.contains('oc2-btn')) return;
            e.preventDefault();
            startDrag(e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            moveDrag(e.clientX, e.clientY);
        }, { passive: false });

        document.addEventListener('mouseup', () => {
            if (!isDown) return;
            endDrag();
        });

        handle.addEventListener('touchstart', (e) => {
            if (e.target && e.target.classList.contains('oc2-btn')) return;
            const t = e.touches[0];
            if (!t) return;
            e.preventDefault();
            startDrag(t.clientX, t.clientY);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const t = e.touches[0];
            if (!t) return;
            e.preventDefault();
            moveDrag(t.clientX, t.clientY);
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (!isDown) return;
            endDrag();
        });
    }

    function wirePanel(panel) {
        const closeBtn   = panel.querySelector('#oc2-close-btn');
        const refreshBtn = panel.querySelector('#oc2-refresh-btn');
        const statusDiv  = panel.querySelector('#oc2-status');
        const crimesDiv  = panel.querySelector('#oc2-crimes');

        closeBtn.addEventListener('click', () => {
            panel.remove();
            panelClosed = true;
        });

        async function reload(force) {
            statusDiv.textContent = 'Loading...';
            crimesDiv.innerHTML = '';
            if (force) {
                crimeData = null;
                itemNames = {};
                memberNames = {};
            }
            try {
                const data = await loadCrimesAndItems();
                renderMissingOnly(crimesDiv, data, statusDiv);
            } catch (e) {
                statusDiv.textContent = `Error: ${e.message}`;
            }
        }

        refreshBtn.addEventListener('click', () => reload(true));
        reload(false);
    }

    function renderMissingOnly(container, data, statusDiv) {
        if (!data || !Array.isArray(data.crimes)) {
            statusDiv.textContent = 'No OC data available.';
            return;
        }

        const crimesWithMissing = data.crimes
            .map(crime => {
                if (crime.status !== 'Planning') return null;
                if (!crime.slots || !crime.slots.length) return null;

                const missingSlots = crime.slots.filter(s =>
                    s.item_requirement &&
                    s.item_requirement.id &&
                    s.item_requirement.is_available === false
                );

                if (!missingSlots.length) return null;

                return Object.assign({}, crime, { slots: missingSlots });
            })
            .filter(Boolean);

        if (!crimesWithMissing.length) {
            statusDiv.textContent = 'No Planning crimes missing items.';
            return;
        }

        statusDiv.textContent = `${crimesWithMissing.length} crime${crimesWithMissing.length !== 1 ? 's' : ''} need items`;

        crimesWithMissing.sort((a,b) => a.difficulty - b.difficulty);

        const frag = document.createDocumentFragment();

        for (const crime of crimesWithMissing) {
            const card = document.createElement('div');
            card.className = 'oc2-crime-card';

            const header = document.createElement('div');
            header.className = 'oc2-crime-title';
            header.textContent = `${crime.name} (Lvl ${crime.difficulty})`;
            card.appendChild(header);

            for (const slot of crime.slots) {
                const req = slot.item_requirement;
                if (!req || !req.id || req.is_available !== false) continue;

                const row = document.createElement('div');
                row.className = 'oc2-role-row';

                const left = document.createElement('div');
                left.className = 'oc2-role-left';

                const position = document.createElement('div');
                position.className = 'oc2-role-position';
                position.textContent = slot.position || 'Role';
                left.appendChild(position);

                const playerDiv = document.createElement('div');
                playerDiv.className = 'oc2-role-player';

                let userId = '';
                if (slot.user) {
                    userId = slot.user.id ?? slot.user.user_id ?? '';
                }

                let displayText = 'Unfilled';
                if (userId) {
                    const memberName = memberNames[userId] || (slot.user && slot.user.name) || '';
                    if (memberName) {
                        displayText = `${memberName} [${userId}]`;
                    } else {
                        displayText = `[${userId}]`;
                    }
                }
                playerDiv.textContent = displayText;
                left.appendChild(playerDiv);

                const itemDiv = document.createElement('div');
                itemDiv.className = 'oc2-role-item';
                const itemName = (itemNames[req.id] && itemNames[req.id].name) || `<#${req.id}>`;
                itemDiv.textContent = `Missing: ${itemName}`;
                left.appendChild(itemDiv);

                row.appendChild(left);
                card.appendChild(row);
            }

            frag.appendChild(card);
        }

        container.appendChild(frag);
    }

    function checkAndCreatePanel() {
        if (onCrimesTab()) {
            if (!panelClosed && !document.getElementById('oc2-items-panel')) {
                createPanel();
            }
        } else {
            const existing = document.getElementById('oc2-items-panel');
            if (existing) existing.remove();
            panelClosed = false;
        }
    }

    // ---- Panic reset button for panel position (only on crimes tab, top-right) ----
    function addOc2PanelResetButton() {
        if (!onCrimesTab()) return; // only on faction crimes page

        if (document.getElementById('oc2-reset-btn')) return;

        function resetOcPanelPosition() {
            try { localStorage.removeItem(POS_KEY); } catch (e) {}
            location.reload();
        }

        const btn = document.createElement('button');
        btn.id = 'oc2-reset-btn';
        btn.textContent = 'Reset OC Box';
        btn.style.position = 'fixed';
        btn.style.top = '5px';      // moved to top
        btn.style.right = '5px';
        btn.style.zIndex = '9999';
        btn.style.fontSize = '10px';
        btn.style.padding = '3px 6px';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '0.7';
        btn.onmouseenter = () => btn.style.opacity = '1';
        btn.onmouseleave = () => btn.style.opacity = '0.7';

        btn.addEventListener('click', resetOcPanelPosition);
        document.body.appendChild(btn);
    }

    function init() {
        checkAndCreatePanel();
        addOc2PanelResetButton();

        window.addEventListener('hashchange', () => {
            setTimeout(() => {
                checkAndCreatePanel();
                addOc2PanelResetButton();
            }, 150);
        });

        const observer = new MutationObserver(() => {
            if (onCrimesTab() && !panelClosed && !document.getElementById('oc2-items-panel')) {
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
