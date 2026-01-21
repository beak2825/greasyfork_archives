// ==UserScript==
// @name         Torn Faction OC 2.0 Item Manager (20-01-2026)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  OC 2.0 Manager with premium UI, smart retrieval, and item filling fixes.
// @author       LOKaa [2834316]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/561985/Torn%20Faction%20OC%2020%20Item%20Manager%20%2820-01-2026%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561985/Torn%20Faction%20OC%2020%20Item%20Manager%20%2820-01-2026%29.meta.js
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

    // --- CSS (Premium UI) ---
    GM_addStyle(`
        :root {
            /* Palette */
            --oc-bg-main: #121212;
            --oc-bg-panel: #1e1e1e;
            --oc-bg-row: #252525;
            --oc-bg-row-hover: #2a2a2a;
            --oc-border: #333;
            --oc-text-main: #e0e0e0;
            --oc-text-sub: #9e9e9e;

            /* Accents */
            --oc-primary: #00bcd4; /* Cyan */
            --oc-primary-dark: #0097a7;
            --oc-success: #00e676; /* Green */
            --oc-warning: #ffca28; /* Amber */
            --oc-danger: #ef5350; /* Red */

            /* Shadows */
            --oc-shadow-card: 0 4px 6px rgba(0,0,0,0.3);
            --oc-shadow-float: 0 10px 15px rgba(0,0,0,0.5);
        }

        /* Container */
        #oc-manager-dashboard {
            margin: 15px 0;
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 13px;
            color: var(--oc-text-main);
            background: var(--oc-bg-main);
            border: 1px solid var(--oc-border);
            border-radius: 8px;
            box-shadow: var(--oc-shadow-float);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Header */
        .oc-header {
            background: linear-gradient(145deg, #1f2937, #111827);
            padding: 12px 20px;
            border-bottom: 1px solid var(--oc-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .oc-title {
            font-weight: 700; font-size: 15px; color: var(--oc-primary);
            text-transform: uppercase; letter-spacing: 1px;
            display: flex; align-items: center; gap: 8px;
        }
        .oc-controls { display: flex; align-items: center; gap: 15px; }
        .oc-status { font-size: 11px; color: var(--oc-text-sub); font-style: italic; }

        .oc-btn-icon {
            background: rgba(255,255,255,0.05); border: 1px solid transparent;
            color: var(--oc-text-sub); border-radius: 4px;
            width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s;
        }
        .oc-btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: #555; }

        /* Grid Layout */
        .oc-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            padding: 15px;
            background: var(--oc-bg-main);
            transition: all 0.3s ease;
            max-height: 2000px;
            opacity: 1;
        }
        .oc-content.minimized { max-height: 0; padding: 0 15px; opacity: 0; pointer-events: none; }

        /* Panels */
        .oc-panel {
            background: var(--oc-bg-panel);
            border: 1px solid var(--oc-border);
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: var(--oc-shadow-card);
        }
        .oc-panel-head {
            background: rgba(0,0,0,0.2);
            padding: 10px 15px;
            border-bottom: 1px solid var(--oc-border);
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--oc-text-sub);
            display: flex; justify-content: space-between;
        }

        /* Specific Header Colors */
        #panel-dist .oc-panel-head { border-left: 3px solid var(--oc-primary); }
        #panel-retrieval .oc-panel-head { border-left: 3px solid var(--oc-warning); }
        #panel-missing .oc-panel-head { border-left: 3px solid var(--oc-danger); }

        .oc-scroll {
            padding: 0; margin: 0;
            max-height: 320px;
            overflow-y: auto;
        }

        /* List Rows */
        .oc-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid rgba(255,255,255,0.03);
            background: var(--oc-bg-row);
            transition: background 0.1s;
        }
        .oc-row:hover { background: var(--oc-bg-row-hover); }
        .oc-row:last-child { border-bottom: none; }

        .oc-col-left { display: flex; flex-direction: column; justify-content: center; }
        .oc-col-right { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; max-width: 60%; align-items: center; }

        .oc-txt-main { font-weight: 600; color: #fff; font-size: 13px; }
        .oc-txt-sub { font-size: 11px; color: var(--oc-text-sub); margin-top: 2px; }
        .oc-link { color: var(--oc-primary); text-decoration: none; transition: color 0.2s; }
        .oc-link:hover { color: #fff; text-decoration: underline; }

        /* Badges (Pills) */
        .oc-pill {
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            color: #ccc;
            cursor: pointer;
            display: flex; align-items: center; gap: 5px;
            transition: all 0.2s;
        }
        .oc-pill:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); color: #fff; transform: translateY(-1px); }

        .oc-phase-r { color: var(--oc-warning); font-weight: 800; font-size: 10px; }
        .oc-phase-p { color: var(--oc-success); font-weight: 800; font-size: 10px; }

        .oc-lvl {
            background: #333; color: #fff;
            padding: 1px 4px; border-radius: 3px;
            font-size: 10px; font-weight: 700;
        }

        /* Action Buttons */
        .oc-btn {
            padding: 5px 12px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            cursor: pointer;
            border: 1px solid transparent;
            transition: all 0.2s;
        }
        .oc-btn-retrieve {
            background: rgba(239, 83, 80, 0.1);
            border-color: rgba(239, 83, 80, 0.5);
            color: var(--oc-danger);
        }
        .oc-btn-retrieve:hover { background: var(--oc-danger); color: #fff; border-color: var(--oc-danger); }

        .oc-missing-tag {
            color: var(--oc-danger);
            font-weight: 700;
            background: rgba(239, 83, 80, 0.1);
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
        }

        /* Scrollbar */
        .oc-scroll::-webkit-scrollbar { width: 5px; }
        .oc-scroll::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
        .oc-scroll::-webkit-scrollbar-track { background: transparent; }

        /* Armory Injector */
        .oc-injector {
            margin-top: 5px;
            padding: 8px;
            background: rgba(0, 188, 212, 0.05);
            border-top: 1px solid rgba(0, 188, 212, 0.2);
            text-align: center;
        }
        .oc-injector-head { font-weight: 700; font-size: 10px; color: var(--oc-primary); text-transform: uppercase; margin-bottom: 5px; display: block; }
        .oc-injector-wrap { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; }

        /* Settings Modal */
        .oc-modal-overlay {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 99999; backdrop-filter: blur(2px);
            align-items: center; justify-content: center;
        }
        .oc-modal {
            background: var(--oc-bg-panel); border: 1px solid var(--oc-border);
            padding: 25px; border-radius: 12px; width: 350px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
        }
        .oc-modal h3 { margin: 0 0 15px 0; color: #fff; border-bottom: 1px solid var(--oc-border); padding-bottom: 10px; }
        .oc-label { display: block; margin-bottom: 5px; font-size: 12px; color: #aaa; }
        .oc-input { width: 100%; background: #121212; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 6px; margin-bottom: 15px; box-sizing: border-box; }
        .oc-input:focus { border-color: var(--oc-primary); outline: none; }

        .oc-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
        .oc-modal-btn { padding: 8px 16px; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
        .btn-primary { background: var(--oc-primary-dark); color: #fff; }
        .btn-primary:hover { background: var(--oc-primary); }
        .btn-ghost { background: transparent; color: #aaa; border: 1px solid #444; }
        .btn-ghost:hover { border-color: #777; color: #fff; }

        /* Animations */
        @keyframes oc-pulse {
            0% { background-color: rgba(255, 202, 40, 0.4); }
            100% { background-color: transparent; }
        }
        .oc-highlight { animation: oc-pulse 2s ease-out; border: 1px solid var(--oc-warning) !important; }
    `);

    // --- Core Logic ---

    async function fetchAllData() {
        if (!apiKey) {
            updateStatus('Set API Key ⚙');
            return;
        }
        updateStatus('Refreshing...');

        try {
            const membersPromise = fetch(`https://api.torn.com/v2/faction/members?striptags=true`, {headers: {Authorization: `ApiKey ${apiKey}`}}).then(r => r.json());
            const crimesPromise = fetch(`https://api.torn.com/v2/faction/crimes?cat=all&offset=0&sort=DESC`, {headers: {Authorization: `ApiKey ${apiKey}`}}).then(r => r.json());
            const armoryPromise = fetch(`https://api.torn.com/faction/?selections=utilities&key=${apiKey}&comment=OCItemMgr`).then(r => r.json());

            const [memData, crimeData, armData] = await Promise.all([membersPromise, crimesPromise, armoryPromise]);
            await processData(memData, crimeData, armData);
            updateStatus('Updated ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
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
                if (item.ID && item.name) itemCache[item.ID] = item.name;

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

                    if (!itemCache[itemId]) missingItemIds.add(itemId);
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

    // --- Actions ---

    // 1. Fill Loan (Fixed for "Give" conflict)
    function fillLoanForm(li, name, id) {
        const loanBtn = li.querySelector('.loan');
        if (loanBtn) loanBtn.click();

        setTimeout(() => {
            // STRICT SELECTOR: Only look inside .loan-cont to avoid the Give form
            const input = li.querySelector('.loan-cont input[name="user"]');

            if (input) {
                input.focus();
                input.value = `${name} [${id}]`;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

                // Visual confirmation
                input.style.transition = "background 0.3s";
                input.style.backgroundColor = "rgba(0, 230, 118, 0.2)";
                setTimeout(() => input.style.backgroundColor = "", 500);
            } else {
                console.warn("OC Manager: Loan input not found. Item might be unavailable.");
            }
        }, 50);
    }

    // 2. Auto-Retrieve (Scroll + Click)
    function performRetrieval(itemId, memberId) {
        const listItems = document.querySelectorAll('#armoury-utilities .item-list > li');
        let found = false;

        for (let li of listItems) {
            // Check Item ID
            const imgWrap = li.querySelector('.img-wrap');
            if (!imgWrap) continue;
            if (imgWrap.getAttribute('data-itemid') !== String(itemId)) continue;

            // Check Member ID in .loaned column
            const loanLink = li.querySelector(`.loaned a[href*="XID=${memberId}"]`);

            if (loanLink) {
                found = true;
                li.scrollIntoView({ behavior: 'smooth', block: 'center' });
                li.classList.add('oc-highlight');
                setTimeout(() => li.classList.remove('oc-highlight'), 2000);

                // Auto Click
                const retrieveBtn = li.querySelector('.item-action [data-role="retrieve"]');
                if (retrieveBtn) {
                    setTimeout(() => retrieveBtn.click(), 300); // Short delay after scroll
                } else {
                    alert("Retrieve button missing.");
                }
                break;
            }
        }

        if (!found) alert('Row not found. User may have returned item or is on another page.');
    }

    // 3. Generic Item Fill
    function fillItemAction(itemId, name, id) {
        const selector = `#armoury-utilities .img-wrap[data-itemid="${itemId}"]`;
        const imgWrap = document.querySelector(selector);
        if(imgWrap) {
            const li = imgWrap.closest('li');
            li.scrollIntoView({ behavior: 'smooth', block: 'center' });
            fillLoanForm(li, name, id);
        } else {
            alert('Item not in current list view.');
        }
    }

    // --- UI Creation ---

    function createDashboardUI() {
        const dashboard = document.createElement('div');
        dashboard.id = 'oc-manager-dashboard';
        dashboard.innerHTML = `
            <div class="oc-header">
                <div class="oc-title">
                    <span style="font-size:18px">💠</span> OC 2.0 Items Manager
                </div>
                <div class="oc-controls">
                    <span id="oc-status" class="oc-status">Idle</span>
                    <button class="oc-btn-icon" id="oc-refresh" title="Refresh">↻</button>
                    <button class="oc-btn-icon" id="oc-toggle-min" title="Toggle">${isMinimized ? '➕' : '➖'}</button>
                    <button class="oc-btn-icon" id="oc-settings" title="Settings">⚙</button>
                </div>
            </div>
            <div class="oc-content ${isMinimized ? 'minimized' : ''}">
                <div class="oc-panel" id="panel-dist">
                    <div class="oc-panel-head">Distribution (Needs)</div>
                    <div class="oc-scroll content">Loading...</div>
                </div>
                <div class="oc-panel" id="panel-retrieval">
                    <div class="oc-panel-head">Retrieval (Unused)</div>
                    <div class="oc-scroll content">Loading...</div>
                </div>
                <div class="oc-panel" id="panel-missing">
                    <div class="oc-panel-head">Missing Stock</div>
                    <div class="oc-scroll content">Loading...</div>
                </div>
            </div>

            <div id="oc-settings-modal" class="oc-modal-overlay">
                <div class="oc-modal">
                    <h3>Settings</h3>
                    <label class="oc-label">Faction API Key (Custom+)</label>
                    <input type="text" id="oc-apikey-input" class="oc-input" placeholder="Enter API Key">

                    <label class="oc-label">Auto-Refresh Interval (sec)</label>
                    <input type="number" id="oc-refresh-input" min="10" class="oc-input" value="30">

                    <div class="oc-modal-actions">
                        <button class="oc-modal-btn btn-ghost" id="oc-cancel-settings">Cancel</button>
                        <button class="oc-modal-btn btn-primary" id="oc-save-settings">Save</button>
                    </div>
                </div>
            </div>
        `;

        // Listeners
        dashboard.querySelector('#oc-refresh').onclick = fetchAllData;
        dashboard.querySelector('#oc-toggle-min').onclick = function() {
            const content = dashboard.querySelector('.oc-content');
            content.classList.toggle('minimized');
            isMinimized = content.classList.contains('minimized');
            this.textContent = isMinimized ? '➕' : '➖';
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
        const distDiv = dashboard.querySelector('#panel-dist .content');
        if (distDiv) {
            distDiv.innerHTML = '';
            if (Object.keys(factionData.needs).length === 0) {
                distDiv.innerHTML = '<div style="padding:20px; color:#666; text-align:center;">All needs fulfilled.</div>';
            } else {
                for (const [itemId, members] of Object.entries(factionData.needs)) {
                    const itemName = getName(itemId);
                    let html = `
                        <div class="oc-row">
                            <div class="oc-col-left">
                                <div class="oc-txt-main">${itemName}</div>
                            </div>
                            <div class="oc-col-right">
                    `;
                    members.forEach(m => {
                        const dataStr = JSON.stringify({id: m.id, name: m.name, itemId: itemId});
                        const phaseClass = m.status === 'Recruiting' ? 'oc-phase-r' : 'oc-phase-p';
                        const phaseText = m.status === 'Recruiting' ? '[R]' : '[P]';

                        html += `
                            <span class="oc-pill" data-oc-fill='${dataStr}' title="Fill for ${m.name}">
                                <span class="${phaseClass}">${phaseText}</span>
                                <span class="oc-lvl">Lv${m.level}</span>
                                <span>${m.name}</span>
                            </span>
                        `;
                    });
                    html += `</div></div>`;
                    distDiv.innerHTML += html;
                }
            }
        }

        // 2. Retrieval
        const retDiv = dashboard.querySelector('#panel-retrieval .content');
        if (retDiv) {
            retDiv.innerHTML = '';
            let count = 0;
            for (const [uid, itemIds] of Object.entries(factionData.loans)) {
                itemIds.forEach(itemId => {
                    if (shouldRetrieve(uid, itemId)) {
                        const itemName = getName(itemId);
                        const memName = factionData.members[uid] || uid;
                        const dataStr = JSON.stringify({itemId: itemId, memberId: uid});

                        retDiv.innerHTML += `
                            <div class="oc-row">
                                <div class="oc-col-left">
                                    <div class="oc-txt-main">${memName}</div>
                                    <div class="oc-txt-sub">Has: <span style="color:#eee">${itemName}</span></div>
                                </div>
                                <div class="oc-col-right">
                                    <button class="oc-btn oc-btn-retrieve" data-oc-retrieve='${dataStr}'>Retrieve</button>
                                </div>
                            </div>`;
                        count++;
                    }
                });
            }
            if (count === 0) retDiv.innerHTML = '<div style="padding:20px; color:#666; text-align:center;">No unused items.</div>';
        }

        // 3. Missing
        const missDiv = dashboard.querySelector('#panel-missing .content');
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
                        <div class="oc-row">
                            <div class="oc-col-left">
                                <a href="${marketLink}" target="_blank" class="oc-link oc-txt-main">${itemName} ↗</a>
                            </div>
                            <div class="oc-col-right">
                                <span class="oc-missing-tag">-${required - available}</span>
                            </div>
                        </div>`;
                    count++;
                }
            }
            if (count === 0) missDiv.innerHTML = '<div style="padding:20px; color:#666; text-align:center;">Stock missing nothing, Good Work Squirrel <3</div>';
        }

        // Re-bind
        dashboard.querySelectorAll('.oc-pill').forEach(btn => {
            btn.onclick = function() {
                const data = JSON.parse(this.getAttribute('data-oc-fill'));
                fillItemAction(data.itemId, data.name, data.id);
            };
        });
        dashboard.querySelectorAll('.oc-btn-retrieve').forEach(btn => {
            btn.onclick = function() {
                const data = JSON.parse(this.getAttribute('data-oc-retrieve'));
                performRetrieval(data.itemId, data.memberId);
            };
        });
    }

    function injectArmoryButtons() {
        const listItems = document.querySelectorAll('#armoury-utilities .item-list > li');
        listItems.forEach(li => {
            if (li.querySelector('.oc-injector')) return;

            const imgWrap = li.querySelector('.img-wrap');
            if (!imgWrap) return;
            const itemId = imgWrap.getAttribute('data-itemid');
            const needs = factionData.needs[itemId];

            if (needs && needs.length > 0) {
                const injectDiv = document.createElement('div');
                injectDiv.className = 'oc-injector';
                injectDiv.innerHTML = `<span class="oc-injector-head">Needs (${needs.length})</span>`;

                const wrap = document.createElement('div');
                wrap.className = 'oc-injector-wrap';

                needs.forEach(m => {
                    const btn = document.createElement('span');
                    btn.className = 'oc-pill';
                    btn.style.fontSize = '10px';
                    const phase = m.status === 'Recruiting' ? '<span class="oc-phase-r">[R]</span>' : '<span class="oc-phase-p">[P]</span>';
                    btn.innerHTML = `${phase} ${m.name}`;
                    btn.onclick = (e) => {
                        e.preventDefault(); e.stopPropagation();
                        fillLoanForm(li, m.name, m.id);
                    };
                    wrap.appendChild(btn);
                });

                injectDiv.appendChild(wrap);
                const nameWrap = li.querySelector('.name');
                if(nameWrap) nameWrap.parentNode.insertBefore(injectDiv, nameWrap.nextSibling);
            }
        });
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