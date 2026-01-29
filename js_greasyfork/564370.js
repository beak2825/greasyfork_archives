// ==UserScript==
// @name         Torn Shop & Bazaar Manager (Infrastructure + Item Search + Exclusion List + Disabler + UI)
// @namespace    torn.shop.manager
// @version      1.0.0
// @description  Manage shop/bazaar exclusions (Gear Icon + API Key + Item Search + Saved List + Disabling)
// @author       Hasoth [4042954]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/564370/Torn%20Shop%20%20Bazaar%20Manager%20%28Infrastructure%20%2B%20Item%20Search%20%2B%20Exclusion%20List%20%2B%20Disabler%20%2B%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564370/Torn%20Shop%20%20Bazaar%20Manager%20%28Infrastructure%20%2B%20Item%20Search%20%2B%20Exclusion%20List%20%2B%20Disabler%20%2B%20UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- PAGE FILTERING ---
    const fullUrl = window.location.href.toLowerCase();
    const keywords = ['bazaar', 'bazar', 'market', 'shop', 'itemmarket', 'sid=itemmarket'];
    const isRelevant = keywords.some(kw => fullUrl.includes(kw));
    if (!isRelevant) return;

    // --- CONFIGURATION ---
    const STORAGE_KEY_API = 'torn_shop_manager_apikey';
    const STORAGE_KEY_POS = 'torn_shop_manager_pos';
    const STORAGE_KEY_ITEMS_CACHE = 'torn_shop_manager_items_cache';
    const STORAGE_KEY_EXCLUDED = 'torn_shop_manager_excluded_items';
    const CACHE_DURATION = 24 * 60 * 60 * 1000;

    // --- STATE ---
    let apiKey = GM_getValue(STORAGE_KEY_API, '');
    let widgetPos = JSON.parse(GM_getValue(STORAGE_KEY_POS, '{"top":"100px","left":"100px"}'));
    let allItems = [];
    let excludedItems = JSON.parse(GM_getValue(STORAGE_KEY_EXCLUDED, '[]'));

    // --- CORE LOGIC: SCANNER & DISABLER ---
    function scanForItems() {
        if (excludedItems.length === 0) return;
        const excludedIds = new Set(excludedItems.map(i => i.id));

        excludedIds.forEach(id => {
            const dataItems = document.querySelectorAll(`li[data-item="${id}"], div[data-item="${id}"], tr[data-item="${id}"]`);
            dataItems.forEach(el => disableElement(el, id));
        });

        const images = document.querySelectorAll('img[src*="/images/items/"]');
        images.forEach(img => {
            const match = img.src.match(/\/images\/items\/(\d+)\//);
            if (!match) return;
            const itemId = parseInt(match[1]);

            if (excludedIds.has(itemId)) {
                let wrapper = img.closest('[class*="itemRowWrapper"]');
                if (!wrapper) wrapper = img.closest('li');
                if (!wrapper) wrapper = img.closest('tr');
                if (wrapper) disableElement(wrapper, itemId);
            }
        });
    }

    function disableElement(el, id) {
        if (el.classList.contains('tsm-excluded-disabled')) return;

        el.classList.add('tsm-excluded-disabled');
        el.dataset.tsmItemId = id;

        el.style.opacity = '0.3';
        el.style.pointerEvents = 'none';
        el.style.filter = 'grayscale(100%)';

        const inputs = el.querySelectorAll('input, button, select, textarea');
        inputs.forEach(inp => {
            inp.disabled = true;
            if (inp.type === 'checkbox') inp.checked = false;
        });
    }

    function restoreItem(itemId) {
        const rows = document.querySelectorAll(`.tsm-excluded-disabled[data-tsm-item-id="${itemId}"]`);
        rows.forEach(el => {
            el.classList.remove('tsm-excluded-disabled');
            el.style.opacity = '';
            el.style.pointerEvents = '';
            el.style.filter = '';
            const inputs = el.querySelectorAll('input, button, select, textarea');
            inputs.forEach(inp => inp.disabled = false);
        });
    }

    // --- OBSERVER ---
    const observer = new MutationObserver(() => scanForItems());
    const startObserver = setInterval(() => {
        if (document.body) {
            clearInterval(startObserver);
            observer.observe(document.body, { childList: true, subtree: true });
            scanForItems();
            createWidget();
        }
    }, 200);

    // --- UI BUILDER ---
    function createWidget() {
        if (document.getElementById('tsm-widget')) return;
        const btn = document.createElement('div');
        btn.id = 'tsm-widget';
        // CHANGED: Added text label next to icon
        btn.innerHTML = '<span class="tsm-icon">⚙️</span><span class="tsm-label">Disable for Sell</span>';
        btn.title = 'Shop Manager Settings';
        btn.style.top = widgetPos.top; btn.style.left = widgetPos.left;
        document.body.appendChild(btn);
        setupDrag(btn);
        btn.addEventListener('click', (e) => {
            if (!btn.classList.contains('is-dragging')) openSettingsModal();
        });
    }

    function createSettingsModal() {
        if (document.getElementById('tsm-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tsm-modal'; modal.style.display = 'none';
        modal.innerHTML = `
            <div class="tsm-modal-content">
                <h3>Shop Manager Settings</h3>
                <div class="tsm-section">
                    <label>Torn API Key:</label>
                    <div style="display:flex; gap:5px;">
                        <input type="text" id="tsm-api-input" placeholder="Enter Public API Key" value="${apiKey}" />
                        <button id="tsm-save-btn" class="tsm-btn-small">Save</button>
                    </div>
                    <div id="tsm-status"></div>
                </div>
                <hr style="border:0; border-top:1px solid #444; margin: 10px 0;">
                <div class="tsm-section">
                    <label>Excluded Items (Saved):</label>
                    <div id="tsm-excluded-list"></div>
                    <div style="display:flex; gap:5px; margin-top:5px;">
                        <input type="number" id="tsm-manual-id" placeholder="ID" style="width:60px;" />
                        <button id="tsm-add-manual-btn" class="tsm-btn-small" style="background:#555;">Add ID</button>
                    </div>
                </div>
                <hr style="border:0; border-top:1px solid #444; margin: 10px 0;">
                <div class="tsm-section" style="flex-grow:1; display:flex; flex-direction:column;">
                    <label>Search to Add:</label>
                    <input type="text" id="tsm-item-search" placeholder="Type item name..." disabled />
                    <div id="tsm-search-results"><div style="color:#666; font-style:italic; padding:5px;">Enter API Key to enable search</div></div>
                </div>
                <div class="tsm-footer"><button id="tsm-close-btn">Close</button></div>
            </div>`;
        document.body.appendChild(modal);

        document.getElementById('tsm-close-btn').onclick = () => { modal.style.display = 'none'; };
        document.getElementById('tsm-save-btn').onclick = async () => {
            const inputVal = document.getElementById('tsm-api-input').value.trim();
            if (inputVal.length < 16) { setStatus('Invalid Key Length', 'red'); return; }
            setStatus('Verifying...', 'blue');
            const isValid = await verifyApiKey(inputVal);
            if (isValid) {
                apiKey = inputVal; GM_setValue(STORAGE_KEY_API, apiKey);
                setStatus('Key Verified & Saved!', 'green'); enableSearchInput(); loadItems();
            } else { setStatus('Invalid Key', 'red'); }
        };
        document.getElementById('tsm-add-manual-btn').onclick = () => {
            const idVal = parseInt(document.getElementById('tsm-manual-id').value);
            if (idVal) {
                const found = allItems.find(i => i.id === idVal);
                const name = found ? found.name : `Item #${idVal}`;
                addItemToExcluded(idVal, name);
                document.getElementById('tsm-manual-id').value = '';
            }
        };
        document.getElementById('tsm-item-search').addEventListener('input', (e) => handleSearch(e.target.value));
        document.getElementById('tsm-search-results').addEventListener('click', (e) => {
            const row = e.target.closest('.tsm-result-row');
            if (row && !row.classList.contains('tsm-added')) {
                addItemToExcluded(parseInt(row.dataset.id), row.dataset.name);
                handleSearch(document.getElementById('tsm-item-search').value);
            }
        });
    }

    function openSettingsModal() {
        createSettingsModal();
        const modal = document.getElementById('tsm-modal');
        document.getElementById('tsm-api-input').value = apiKey;
        document.getElementById('tsm-status').textContent = '';
        renderExcludedList();
        if (apiKey) { enableSearchInput(); if (allItems.length === 0) loadItems(); }
        modal.style.display = 'flex';
    }

    function renderExcludedList() {
        const listEl = document.getElementById('tsm-excluded-list');
        if (!listEl) return;
        if (excludedItems.length === 0) { listEl.innerHTML = '<div style="color:#666; font-style:italic; padding:5px;">No items excluded yet.</div>'; return; }
        let html = '';
        excludedItems.forEach(item => {
            html += `<div class="tsm-excluded-row"><span class="tsm-ex-name"><b>[${item.id}]</b> ${item.name}</span><span class="tsm-remove-btn" data-id="${item.id}">✕</span></div>`;
        });
        listEl.innerHTML = html;
        listEl.querySelectorAll('.tsm-remove-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const idToRemove = parseInt(btn.getAttribute('data-id'));
                excludedItems = excludedItems.filter(i => i.id !== idToRemove);
                GM_setValue(STORAGE_KEY_EXCLUDED, JSON.stringify(excludedItems));
                restoreItem(idToRemove);
                renderExcludedList();
                if(document.getElementById('tsm-item-search').value) handleSearch(document.getElementById('tsm-item-search').value);
            };
        });
    }

    function addItemToExcluded(id, name) {
        if (excludedItems.some(i => i.id === id)) return;
        excludedItems.push({ id: id, name: name });
        excludedItems.sort((a,b) => a.name.localeCompare(b.name));
        GM_setValue(STORAGE_KEY_EXCLUDED, JSON.stringify(excludedItems));
        renderExcludedList();
        scanForItems();
    }

    function handleSearch(query) {
        const resultsDiv = document.getElementById('tsm-search-results');
        if (!query || query.length < 2) { resultsDiv.innerHTML = ''; return; }
        const lowerQ = query.toLowerCase();
        const matches = allItems.filter(item => item.name.toLowerCase().includes(lowerQ)).slice(0, 20);
        if (matches.length === 0) { resultsDiv.innerHTML = '<div style="padding:5px; color:#999;">No matches found</div>'; return; }
        let html = '';
        matches.forEach(item => {
            const isAdded = excludedItems.some(e => e.id === item.id);
            const style = isAdded ? 'opacity:0.5; cursor:default;' : 'cursor:pointer;';
            const extraClass = isAdded ? 'tsm-added' : '';
            html += `<div class="tsm-result-row ${extraClass}" style="${style}" data-id="${item.id}" data-name="${item.name.replace(/"/g, '&quot;')}"><span class="tsm-id">[${item.id}]</span><span class="tsm-name">${item.name}</span>${isAdded ? '<span style="margin-left:auto; font-size:10px;">(Added)</span>' : ''}</div>`;
        });
        resultsDiv.innerHTML = html;
    }

    function enableSearchInput() {
        const inp = document.getElementById('tsm-item-search');
        if(inp) { inp.disabled = false; inp.placeholder = "Type item name..."; if(document.getElementById('tsm-search-results').innerText.includes('Enter API Key')) document.getElementById('tsm-search-results').innerHTML = ''; }
    }

    function setStatus(msg, color) { const el = document.getElementById('tsm-status'); if (el) { el.textContent = msg; el.style.color = color || '#888'; } }

    async function loadItems() {
        const resultsDiv = document.getElementById('tsm-search-results');
        const cached = JSON.parse(GM_getValue(STORAGE_KEY_ITEMS_CACHE, 'null'));
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) { allItems = cached.data; return; }
        if (!apiKey) return;
        resultsDiv.innerHTML = '<div style="color:#aaa;">Loading item list...</div>';
        try {
            const response = await fetch(`https://api.torn.com/v2/torn/items?key=${apiKey}`);
            const data = await response.json();
            if (data.items) {
                allItems = data.items.map(i => ({ id: i.id, name: i.name }));
                GM_setValue(STORAGE_KEY_ITEMS_CACHE, JSON.stringify({ timestamp: Date.now(), data: allItems }));
                resultsDiv.innerHTML = '<div style="color:green;">Items Loaded! Type to search.</div>';
            }
        } catch (e) { resultsDiv.innerHTML = '<div style="color:red;">Network Error.</div>'; }
    }

    function setupDrag(el) {
        let isDown = false, startX, startY;
        el.addEventListener('mousedown', (e) => { if(e.button!==0) return; isDown=true; startX=e.clientX-el.offsetLeft; startY=e.clientY-el.offsetTop; el.style.cursor='grabbing'; e.preventDefault(); });
        document.addEventListener('mouseup', () => { if(isDown) { isDown=false; el.style.cursor='pointer'; setTimeout(()=>el.classList.remove('is-dragging'),0); GM_setValue(STORAGE_KEY_POS, JSON.stringify({top:el.style.top, left:el.style.left})); } });
        document.addEventListener('mousemove', (e) => { if(!isDown) return; e.preventDefault(); el.classList.add('is-dragging'); el.style.left=(e.clientX-startX)+'px'; el.style.top=(e.clientY-startY)+'px'; });
    }

    async function verifyApiKey(key) { try { const r = await fetch(`https://api.torn.com/user/?selections=basic&key=${key}`); const d = await r.json(); return !d.error; } catch { return false; } }

    GM_addStyle(`
        #tsm-widget {
            position: fixed; width: auto; height: 34px; padding: 0 12px;
            background: #333; color: #fff; border-radius: 20px;
            display: flex; align-items: center; justify-content: center; gap: 8px;
            cursor: pointer; z-index: 999999;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid #555;
            user-select: none; font-family: Arial, sans-serif;
        }
        #tsm-widget:hover { background: #444; border-color: #777; }
        .tsm-icon { font-size: 18px; }
        .tsm-label { font-size: 12px; font-weight: bold; white-space: nowrap; }

        #tsm-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.7); z-index: 1000000; display: flex; align-items: center; justify-content: center; }
        .tsm-modal-content { background: #222; padding: 20px; border-radius: 8px; width: 350px; color: #eee; border: 1px solid #444; font-family: Arial, sans-serif; max-height: 85vh; display: flex; flex-direction: column; }
        .tsm-modal-content h3 { margin-top: 0; color: #fff; border-bottom: 1px solid #444; padding-bottom: 10px; }
        .tsm-section { margin-bottom: 10px; flex-shrink: 0; }
        .tsm-section label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 12px; color:#aaa; }
        input[type="text"], input[type="number"] {
            padding: 8px; background: #444; border: 1px solid #555; color: #fff; border-radius: 4px; box-sizing: border-box; width: 100%;
            -moz-appearance: textfield;
        }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input:disabled { background: #333; color: #666; cursor: not-allowed; }
        .tsm-btn-small { padding: 0 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; flex-shrink: 0; }
        .tsm-btn-small:hover { background: #45a049; }
        #tsm-excluded-list { background: #1a1a1a; border: 1px solid #333; border-radius: 4px; height: 120px; overflow-y: auto; padding: 5px; margin-bottom: 5px; }
        .tsm-excluded-row { display: flex; justify-content: space-between; align-items: center; padding: 4px; border-bottom: 1px solid #333; font-size: 12px; }
        .tsm-excluded-row:last-child { border-bottom: none; }
        .tsm-remove-btn { color: #f44336; cursor: pointer; font-weight: bold; padding: 0 5px; }
        .tsm-remove-btn:hover { color: #d32f2f; }
        #tsm-search-results { margin-top: 10px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px; flex-grow: 1; overflow-y: auto; min-height: 100px; max-height: 200px; }
        .tsm-result-row { padding: 6px 8px; border-bottom: 1px solid #333; font-size: 12px; display: flex; align-items: center; }
        .tsm-result-row:hover { background: #333; }
        .tsm-id { color: #4CAF50; font-weight: bold; margin-right: 8px; min-width: 35px; }
        .tsm-footer { margin-top: 15px; text-align: right; }
        #tsm-close-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; background: #555; color: white; }
        #tsm-close-btn:hover { background: #666; }
    `);

    const initInterval = setInterval(() => { if (document.body) { clearInterval(initInterval); createWidget(); } }, 100);
})();
