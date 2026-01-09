// ==UserScript==
// @name         [USING] Torn Faction OC 2.0 Item Manager (v2.2 - 09/01/2026)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  OC 2.0 Manager with Item Names, Market Links, Phase Indicators, and Precision Retrieval.
// @author       LOKaa [2834316]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561985/%5BUSING%5D%20Torn%20Faction%20OC%2020%20Item%20Manager%20%28v22%20-%2009012026%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561985/%5BUSING%5D%20Torn%20Faction%20OC%2020%20Item%20Manager%20%28v22%20-%2009012026%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    const STORAGE_PREFIX = 'TORN_OC_MGR_V2_';
    let apiKey = GM_getValue(STORAGE_PREFIX + 'APIKEY', '');
    let refreshRate = GM_getValue(STORAGE_PREFIX + 'REFRESH', 30);
    let isMinimized = GM_getValue(STORAGE_PREFIX + 'MINIMIZED', false);
    let itemCache = GM_getValue(STORAGE_PREFIX + 'ITEM_CACHE', {});

    let autoRefreshInterval = null;
    let isRenderPending = false;

    let factionData = {
        members: {},
        crimes: [],
        armory: [],
        needs: {},
        loans: {}
    };

    // --- Styles ---
    GM_addStyle(`
        :root {
            --oc-bg: #1a1a1a;
            --oc-panel: #242424;
            --oc-border: #333;
            --oc-text: #ddd;
            --oc-accent: #00c0ff;
            --oc-red: #ff4444;
            --oc-green: #00cc66;
            --oc-yellow: #ffcc00;
            --oc-header-bg: linear-gradient(90deg, #111, #222);
        }

        #oc-manager-dashboard {
            margin-bottom: 15px;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            color: var(--oc-text);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid var(--oc-border);
            background: var(--oc-bg);
            display: block !important;
        }

        .oc-dash-header {
            background: var(--oc-header-bg);
            padding: 10px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--oc-border);
        }
        .oc-title { font-weight: 700; font-size: 14px; letter-spacing: 0.5px; color: var(--oc-accent); }
        .oc-controls { display: flex; gap: 15px; align-items: center; }
        .oc-status { font-size: 11px; color: #888; font-style: italic; }
        .oc-icon-btn { cursor: pointer; color: #aaa; transition: 0.2s; font-size: 14px; font-weight: bold; }
        .oc-icon-btn:hover { color: #fff; text-shadow: 0 0 5px var(--oc-accent); }

        .oc-dash-content {
            display: flex;
            flex-wrap: wrap;
            padding: 10px;
            gap: 10px;
            background: var(--oc-bg);
            transition: max-height 0.3s ease-in-out, opacity 0.3s;
            max-height: 2000px;
            opacity: 1;
        }
        .oc-dash-content.minimized {
            max-height: 0;
            padding: 0 10px;
            opacity: 0;
            overflow: hidden;
        }

        .oc-area {
            flex: 1 1 300px;
            background: var(--oc-panel);
            border: 1px solid var(--oc-border);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
        }
        .oc-area h4 {
            margin: 0;
            padding: 8px 12px;
            background: rgba(0,0,0,0.2);
            border-bottom: 1px solid var(--oc-border);
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ccc;
            font-weight: 600;
        }
        .oc-scroll-area {
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
        }

        .oc-item-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .oc-item-row:last-child { border-bottom: none; }
        .oc-item-name { color: var(--oc-text); font-weight: 600; font-size: 12px; }
        .oc-item-details { display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; max-width: 70%; }

        .oc-market-link { color: var(--oc-accent); text-decoration: none; }
        .oc-market-link:hover { text-decoration: underline; color: #fff; }

        .oc-pill {
            background: #333;
            border: 1px solid #555;
            color: #eee;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            cursor: pointer;
            transition: 0.2s;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
        }
        .oc-pill:hover { background: #444; border-color: #777; }

        .oc-pill-level {
            background: #444;
            color: #fff;
            padding: 0 4px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 9px;
        }

        .oc-status-icon { font-weight: bold; font-size: 10px; padding-right: 2px; }
        .status-recruiting { color: var(--oc-yellow); }
        .status-planning { color: var(--oc-green); }

        .oc-btn-action {
            background: rgba(255, 68, 68, 0.1);
            border: 1px solid var(--oc-red);
            color: var(--oc-red);
            padding: 2px 8px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 10px;
            text-transform: uppercase;
            cursor: pointer;
        }
        .oc-btn-action:hover { background: var(--oc-red); color: #fff; }

        .oc-missing-count { color: var(--oc-red); font-weight: bold; }

        .oc-injector-area {
            background: rgba(0, 192, 255, 0.05);
            border-top: 1px solid rgba(0, 192, 255, 0.2);
            padding: 5px;
            margin-top: 5px;
            text-align: center;
        }

        .oc-modal {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 99999;
            align-items: center; justify-content: center;
        }
        .oc-modal-box {
            background: var(--oc-panel); border: 1px solid var(--oc-accent);
            padding: 20px; border-radius: 8px; width: 300px; color: #fff;
            box-shadow: 0 0 20px rgba(0, 192, 255, 0.2);
        }
        .oc-input { width: 100%; background: #111; border: 1px solid #444; color: #fff; padding: 5px; margin: 5px 0 15px 0; border-radius: 4px; }
        .oc-modal-btn { width: 100%; padding: 8px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-bottom: 5px; }
        .oc-btn-save { background: var(--oc-accent); color: #000; }
        .oc-btn-cancel { background: transparent; border: 1px solid #555; color: #888; }

        .oc-scroll-area::-webkit-scrollbar { width: 6px; }
        .oc-scroll-area::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
        .oc-scroll-area::-webkit-scrollbar-track { background: #222; }

        /* Highlight Animation for Retrieval Row */
        @keyframes oc-flash {
            0% { background-color: rgba(255, 255, 0, 0.3); box-shadow: 0 0 10px rgba(255,255,0,0.5); }
            100% { background-color: transparent; }
        }
        .oc-highlighted-row { animation: oc-flash 2.5s ease-out; border: 1px solid var(--oc-yellow); }

        @media (max-width: 600px) {
            .oc-dash-content { flex-direction: column; }
            .oc-area { width: 100%; }
        }
    `);

    // --- Core Logic ---

    async function fetchAllData() {
        if (!apiKey) {
            updateStatus('Missing API Key');
            return;
        }
        updateStatus('Refreshing...');

        try {
            const membersPromise = fetch(`https://api.torn.com/v2/faction/members?striptags=true`, {headers: {Authorization: `ApiKey ${apiKey}`}}).then(r => r.json());
            const crimesPromise = fetch(`https://api.torn.com/v2/faction/crimes?cat=all&offset=0&sort=DESC`, {headers: {Authorization: `ApiKey ${apiKey}`}}).then(r => r.json());
            const armoryPromise = fetch(`https://api.torn.com/faction/?selections=utilities&key=${apiKey}&comment=OCItemMgr`).then(r => r.json());

            const [memData, crimeData, armData] = await Promise.all([membersPromise, crimesPromise, armoryPromise]);
            await processData(memData, crimeData, armData);
            updateStatus('Updated: ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
        } catch (e) {
            console.error(e);
            updateStatus('API Error');
        }
    }

    async function processData(memData, crimeData, armData) {
        factionData.members = {};
        factionData.crimes = crimeData.crimes || [];
        factionData.armory = armData.utilities || [];
        factionData.needs = {};
        factionData.loans = {};

        // 1. Map Members
        memData.members.forEach(m => { factionData.members[m.id] = m.name; });

        // 2. Map Active Loans
        if (armData.utilities) {
            armData.utilities.forEach(item => {
                if (item.ID && item.name) {
                    itemCache[item.ID] = item.name;
                }
                if (item.loaned_to) {
                    let loanString = String(item.loaned_to);
                    let ids = loanString.split(',').map(s => s.trim()).filter(s => s !== "null" && s !== "");
                    ids.forEach(uid => {
                        if (!factionData.loans[uid]) factionData.loans[uid] = [];
                        factionData.loans[uid].push(item.ID);
                    });
                }
            });
        }
        GM_setValue(STORAGE_PREFIX + 'ITEM_CACHE', itemCache);

        // 3. Map Needs
        let missingItemIds = new Set();
        const activeCrimes = factionData.crimes.filter(c => c.status === 'Recruiting' || c.status === 'Planning');

        activeCrimes.forEach(crime => {
            crime.slots.forEach(slot => {
                if (slot.user && slot.item_requirement && !slot.item_requirement.is_available) {
                    const uid = slot.user.id;
                    const itemId = slot.item_requirement.id;

                    if (!factionData.needs[itemId]) factionData.needs[itemId] = [];

                    factionData.needs[itemId].push({
                        id: uid,
                        name: factionData.members[uid] || uid,
                        level: crime.difficulty,
                        crimeName: crime.name,
                        status: crime.status
                    });

                    if (!itemCache[itemId]) {
                        missingItemIds.add(itemId);
                    }
                }
            });
        });

        // 4. Batch Fetch Names
        if (missingItemIds.size > 0) {
            updateStatus('Fetching Names...');
            await resolveItemNames(Array.from(missingItemIds));
        }

        renderDashboardContent();
        injectArmoryButtons();
    }

    // --- Helpers ---

    async function resolveItemNames(ids) {
        const idString = ids.join(',');
        try {
            const url = `https://api.torn.com/torn/${idString}?selections=items&key=${apiKey}&comment=OCNameFetch`;
            const response = await fetch(url).then(r => r.json());
            if (response.items) {
                for (const [id, itemData] of Object.entries(response.items)) {
                    itemCache[id] = itemData.name;
                }
                GM_setValue(STORAGE_PREFIX + 'ITEM_CACHE', itemCache);
            }
        } catch (e) {
            console.error("Failed to fetch item names", e);
        }
    }

    function getName(itemId) {
        if (itemCache[itemId]) return itemCache[itemId];
        const armoryItem = factionData.armory.find(i => i.ID == itemId);
        if (armoryItem) return armoryItem.name;
        return `Item #${itemId}`;
    }

    function getArmoryCount(itemId) {
        const item = factionData.armory.find(i => i.ID == itemId);
        return item ? item.available : 0;
    }

    function shouldRetrieve(uid, itemId) {
        const activeCrimes = factionData.crimes.filter(c => c.status === 'Recruiting' || c.status === 'Planning');
        for (const crime of activeCrimes) {
            for (const slot of crime.slots) {
                if (slot.user && String(slot.user.id) === String(uid)) {
                    if (slot.item_requirement && String(slot.item_requirement.id) === String(itemId)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function scrollToSpecificLoan(itemId, memberId) {
        const listItems = document.querySelectorAll('#armoury-utilities .item-list > li');
        let found = false;

        for (let li of listItems) {
            // 1. Check Item ID
            const imgWrap = li.querySelector('.img-wrap');
            if (!imgWrap) continue;

            const currentItemId = imgWrap.getAttribute('data-itemid');
            if (currentItemId !== String(itemId)) continue;

            // 2. Check Member ID inside the .loaned div
            // The HTML is <div class="loaned ..."><a href="...XID=123">Name</a></div>
            // We search for the specific XID in the href
            const loanLink = li.querySelector(`.loaned a[href*="XID=${memberId}"]`);

            if (loanLink) {
                // Found the exact row!
                li.scrollIntoView({ behavior: 'smooth', block: 'center' });
                li.classList.add('oc-highlighted-row');
                setTimeout(() => li.classList.remove('oc-highlighted-row'), 2500);
                found = true;
                break;
            }
        }

        if (!found) {
            alert('Could not find the specific loan row for this member. They might be on a different page (pagination) or the loan was returned.');
        }
    }

    // --- UI Creation ---

    function createDashboardUI() {
        const dashboard = document.createElement('div');
        dashboard.id = 'oc-manager-dashboard';
        dashboard.innerHTML = `
            <div class="oc-dash-header">
                <span class="oc-title">OC 2.0 Manager</span>
                <div class="oc-controls">
                    <span id="oc-status" class="oc-status">Idle</span>
                    <span class="oc-icon-btn" id="oc-refresh" title="Refresh">↻</span>
                    <span class="oc-icon-btn" id="oc-toggle-min" title="Minimize/Maximize">${isMinimized ? '+' : '_'}</span>
                    <span class="oc-icon-btn" id="oc-settings" title="Settings">⚙</span>
                </div>
            </div>
            <div class="oc-dash-content ${isMinimized ? 'minimized' : ''}">
                <div class="oc-area" id="area-dist"><h4>Distribution</h4><div class="oc-scroll-area content">Loading...</div></div>
                <div class="oc-area" id="area-retrieval"><h4>Retrieval</h4><div class="oc-scroll-area content">Loading...</div></div>
                <div class="oc-area" id="area-missing"><h4>Missing Stock</h4><div class="oc-scroll-area content">Loading...</div></div>
            </div>

            <div id="oc-settings-modal" class="oc-modal">
                <div class="oc-modal-box">
                    <h3 style="margin-top:0">Settings</h3>
                    <label>API Key (Custom+):</label>
                    <input type="text" id="oc-apikey-input" class="oc-input">
                    <label>Auto-Refresh (seconds):</label>
                    <input type="number" id="oc-refresh-input" min="10" class="oc-input">
                    <button class="oc-modal-btn oc-btn-save" id="oc-save-settings">Save</button>
                    <button class="oc-modal-btn oc-btn-cancel" id="oc-cancel-settings">Cancel</button>
                </div>
            </div>
        `;

        dashboard.querySelector('#oc-refresh').onclick = fetchAllData;

        dashboard.querySelector('#oc-toggle-min').onclick = function() {
            const content = dashboard.querySelector('.oc-dash-content');
            content.classList.toggle('minimized');
            isMinimized = content.classList.contains('minimized');
            this.textContent = isMinimized ? '+' : '_';
            GM_setValue(STORAGE_PREFIX + 'MINIMIZED', isMinimized);
        };

        dashboard.querySelector('#oc-settings').onclick = () => {
            document.getElementById('oc-settings-modal').style.display = 'flex';
            document.getElementById('oc-apikey-input').value = apiKey;
            document.getElementById('oc-refresh-input').value = refreshRate;
        };
        dashboard.querySelector('#oc-cancel-settings').onclick = () => {
            document.getElementById('oc-settings-modal').style.display = 'none';
        };
        dashboard.querySelector('#oc-save-settings').onclick = () => {
            apiKey = document.getElementById('oc-apikey-input').value.trim();
            refreshRate = parseInt(document.getElementById('oc-refresh-input').value);
            GM_setValue(STORAGE_PREFIX + 'APIKEY', apiKey);
            GM_setValue(STORAGE_PREFIX + 'REFRESH', refreshRate);
            document.getElementById('oc-settings-modal').style.display = 'none';
            setupAutoRefresh();
            fetchAllData();
        };

        return dashboard;
    }

    function renderDashboardContent() {
        const dashboard = document.getElementById('oc-manager-dashboard');
        if (!dashboard) return;

        // 1. Distribution
        const distDiv = dashboard.querySelector('#area-dist .content');
        if (distDiv) {
            distDiv.innerHTML = '';
            if (Object.keys(factionData.needs).length === 0) {
                distDiv.innerHTML = '<div style="padding:10px; color:#888;">No items needed currently.</div>';
            } else {
                for (const [itemId, members] of Object.entries(factionData.needs)) {
                    const itemName = getName(itemId);
                    let html = `
                        <div class="oc-item-row">
                            <div class="oc-item-name">${itemName}</div>
                            <div class="oc-item-details">
                    `;
                    members.forEach(m => {
                        const dataStr = JSON.stringify({id: m.id, name: m.name, itemId: itemId});
                        let phaseIcon = '';
                        if (m.status === 'Recruiting') phaseIcon = `<span class="oc-status-icon status-recruiting">[R]</span>`;
                        else if (m.status === 'Planning') phaseIcon = `<span class="oc-status-icon status-planning">[P]</span>`;

                        html += `
                            <span class="oc-pill" data-oc-fill='${dataStr}'>
                                ${phaseIcon}
                                <span class="oc-pill-level">Lv${m.level}</span>
                                ${m.name}
                            </span>
                        `;
                    });
                    html += `</div></div>`;
                    distDiv.innerHTML += html;
                }
            }
        }

        // 2. Retrieval
        const retDiv = dashboard.querySelector('#area-retrieval .content');
        if (retDiv) {
            retDiv.innerHTML = '';
            let count = 0;
            for (const [uid, itemIds] of Object.entries(factionData.loans)) {
                itemIds.forEach(itemId => {
                    if (shouldRetrieve(uid, itemId)) {
                        const itemName = getName(itemId);
                        const memName = factionData.members[uid] || uid;
                        // Button holds both ItemID and MemberID for precision scrolling
                        const retrieveData = JSON.stringify({itemId: itemId, memberId: uid});

                        retDiv.innerHTML += `
                            <div class="oc-item-row">
                                <div>
                                    <span style="color:#aaa;">${memName}</span>
                                    <div style="font-size:10px; color:#666;">Has: <span style="color:#ddd">${itemName}</span></div>
                                </div>
                                <div>
                                    <span class="oc-btn-action" data-oc-retrieve='${retrieveData}'>Retrieve</span>
                                </div>
                            </div>`;
                        count++;
                    }
                });
            }
            if (count === 0) retDiv.innerHTML = '<div style="padding:10px; color:#888;">No unused items to retrieve.</div>';
        }

        // 3. Missing Stock
        const missDiv = dashboard.querySelector('#area-missing .content');
        if (missDiv) {
            missDiv.innerHTML = '';
            let count = 0;
            for (const [itemId, members] of Object.entries(factionData.needs)) {
                const available = getArmoryCount(itemId);
                const required = members.length;
                if (available < required) {
                    const itemName = getName(itemId);
                    const marketLink = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}`;
                    missDiv.innerHTML += `
                        <div class="oc-item-row">
                            <a href="${marketLink}" target="_blank" class="oc-market-link oc-item-name">${itemName} ↗</a>
                            <span class="oc-missing-count">Missing: ${required - available}</span>
                        </div>`;
                    count++;
                }
            }
            if (count === 0) missDiv.innerHTML = '<div style="padding:10px; color:#888;">Armory fully stocked for needs.</div>';
        }

        // Bind Listeners
        dashboard.querySelectorAll('.oc-pill').forEach(btn => {
            btn.onclick = function() {
                const data = JSON.parse(this.getAttribute('data-oc-fill'));
                fillItemAction(data.itemId, data.name, data.id);
            };
        });

        // Precision Retrieval Listener
        dashboard.querySelectorAll('span[data-oc-retrieve]').forEach(btn => {
            btn.onclick = function() {
                const data = JSON.parse(this.getAttribute('data-oc-retrieve'));
                scrollToSpecificLoan(data.itemId, data.memberId);
            };
        });
    }

    // --- Injections & Actions ---

    function injectArmoryButtons() {
        const listItems = document.querySelectorAll('#armoury-utilities .item-list > li');
        listItems.forEach(li => {
            if (li.querySelector('.oc-injector-area')) return;

            const imgWrap = li.querySelector('.img-wrap');
            if (!imgWrap) return;
            const itemId = imgWrap.getAttribute('data-itemid');
            const needs = factionData.needs[itemId];

            if (needs && needs.length > 0) {
                const injectDiv = document.createElement('div');
                injectDiv.className = 'oc-injector-area';
                injectDiv.innerHTML = `<span class="oc-injector-title" style="color:var(--oc-accent)">OC Needs (${needs.length})</span>`;

                const btnContainer = document.createElement('div');
                btnContainer.style.display = 'flex';
                btnContainer.style.flexWrap = 'wrap';
                btnContainer.style.justifyContent = 'center';
                btnContainer.style.gap = '4px';

                needs.forEach(mem => {
                    const btn = document.createElement('span');
                    btn.className = 'oc-pill';
                    let phaseIcon = '';
                    if (mem.status === 'Recruiting') phaseIcon = `<span class="oc-status-icon status-recruiting">[R]</span>`;
                    else if (mem.status === 'Planning') phaseIcon = `<span class="oc-status-icon status-planning">[P]</span>`;

                    btn.innerHTML = `${phaseIcon} <span class="oc-pill-level">Lv${mem.level}</span> ${mem.name}`;
                    btn.onclick = (e) => {
                        e.preventDefault(); e.stopPropagation();
                        fillLoanForm(li, mem.name, mem.id);
                    };
                    btnContainer.appendChild(btn);
                });

                injectDiv.appendChild(btnContainer);
                const nameWrap = li.querySelector('.name');
                if(nameWrap) nameWrap.parentNode.insertBefore(injectDiv, nameWrap.nextSibling);
            }
        });
    }

    function fillLoanForm(li, name, id) {
        const loanBtn = li.querySelector('.loan');
        if (loanBtn) loanBtn.click();

        setTimeout(() => {
            const input = li.querySelector('input[name="user"]');
            if (input) {
                input.focus();
                input.value = `${name} [${id}]`;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                input.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
            }
        }, 50);
    }

    function fillItemAction(itemId, name, id) {
        // Generic fill when clicking from dashboard, searches first instance
        const selector = `#armoury-utilities .img-wrap[data-itemid="${itemId}"]`;
        const imgWrap = document.querySelector(selector);
        if(imgWrap) {
            const li = imgWrap.closest('li');
            li.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fillLoanForm(li, name, id);
        } else {
            alert('Item not visible on current page. Check pagination.');
        }
    }

    function updateStatus(msg) {
        const el = document.getElementById('oc-status');
        if(el) el.textContent = msg;
    }

    function setupAutoRefresh() {
        if(autoRefreshInterval) clearInterval(autoRefreshInterval);
        if(refreshRate > 0) autoRefreshInterval = setInterval(fetchAllData, refreshRate * 1000);
    }

    function handleDomChange() {
        if (isRenderPending) return;
        isRenderPending = true;
        requestAnimationFrame(() => {
            const container = document.getElementById('armoury-utilities');
            if (container && window.location.hash.includes('sub=utilities')) {
                const existingDash = document.getElementById('oc-manager-dashboard');
                if (!existingDash) {
                    const newDash = createDashboardUI();
                    container.prepend(newDash);
                    if (Object.keys(factionData.members).length > 0) {
                        renderDashboardContent();
                        injectArmoryButtons();
                    } else if (apiKey) {
                        fetchAllData();
                    }
                } else {
                    injectArmoryButtons();
                }
            }
            isRenderPending = false;
        });
    }

    const observer = new MutationObserver(handleDomChange);
    observer.observe(document.body, { childList: true, subtree: true });
    setupAutoRefresh();
    handleDomChange();

})();