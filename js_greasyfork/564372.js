// ==UserScript==
// @name         testscript
// @namespace    test
// @version      1.1.2
// @description  test
// @author       Hasoth [4042954]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/564372/testscript.user.js
// @updateURL https://update.greasyfork.org/scripts/564372/testscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONSTANTS ---
    const STORAGE_KEY_API = 'torn_shop_manager_apikey';
    const STORAGE_KEY_POS = 'torn_shop_manager_pos';
    const STORAGE_KEY_ITEMS_CACHE = 'torn_shop_manager_items_cache';
    const STORAGE_KEY_EXCLUDED = 'torn_shop_manager_excluded_items';

    // --- STATE ---
    let apiKey = GM_getValue(STORAGE_KEY_API, '');
    let widgetPos = JSON.parse(GM_getValue(STORAGE_KEY_POS, '{"top":"150px","left":"20px"}'));
    let excludedItems = JSON.parse(GM_getValue(STORAGE_KEY_EXCLUDED, '[]'));
    let allItems = [];

    // --- INITIALIZATION ---
    // We try to render immediately since we are running at document-idle
    createWidget();

    // --- WIDGET (BUTTON) ---
    function createWidget() {
        if (document.getElementById('tsm-widget')) return;

        const btn = document.createElement('div');
        btn.id = 'tsm-widget';
        btn.innerHTML = '<span class="tsm-icon">⚙️</span><span class="tsm-label">Disable for Sell</span>';
        
        // Apply saved position
        btn.style.top = widgetPos.top;
        btn.style.left = widgetPos.left;

        document.body.appendChild(btn);

        // --- SIMPLE MOBILE/DESKTOP DRAG & CLICK ---
        // This is a simplified version of the logic to ensure maximum compatibility
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const onStart = (e) => {
            // If it's a touch event, use the first touch
            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;
            initialLeft = btn.offsetLeft;
            initialTop = btn.offsetTop;
            isDragging = false; // Assume click initially
        };

        const onMove = (e) => {
            if (!startX) return; // Not started
            const point = e.touches ? e.touches[0] : e;
            const dx = point.clientX - startX;
            const dy = point.clientY - startY;

            // If moved more than 5 pixels, treat as drag
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                isDragging = true;
                e.preventDefault(); // Stop scrolling on mobile
                btn.style.left = (initialLeft + dx) + 'px';
                btn.style.top = (initialTop + dy) + 'px';
            }
        };

        const onEnd = (e) => {
            if (!startX) return;
            
            if (isDragging) {
                // Save new position
                GM_setValue(STORAGE_KEY_POS, JSON.stringify({top: btn.style.top, left: btn.style.left}));
            } else {
                // It was a click/tap
                openSettingsModal();
            }
            
            // Reset
            startX = null;
            startY = null;
            isDragging = false;
        };

        // Attach Events
        btn.addEventListener('mousedown', onStart);
        btn.addEventListener('touchstart', onStart, {passive: false});

        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, {passive: false});

        document.addEventListener('mouseup', onEnd);
        btn.addEventListener('touchend', onEnd); // Touchend often fires on the element
    }

    // --- MODAL (POPUP) ---
    function createSettingsModal() {
        if (document.getElementById('tsm-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'tsm-modal';
        modal.style.display = 'none';
        
        modal.innerHTML = `
            <div class="tsm-modal-content">
                <h3>Shop Manager (UI Test)</h3>
                
                <!-- API KEY -->
                <div class="tsm-section">
                    <label>API Key:</label>
                    <div style="display:flex; gap:5px;">
                        <input type="text" id="tsm-api-input" value="${apiKey}" />
                        <button id="tsm-save-btn" class="tsm-btn-small">Save</button>
                    </div>
                    <div id="tsm-status"></div>
                </div>

                <hr style="border:0; border-top:1px solid #444; margin: 10px 0;">

                <!-- EXCLUDED LIST -->
                <div class="tsm-section">
                    <label>Excluded Items:</label>
                    <div id="tsm-excluded-list"></div>
                    <div style="display:flex; gap:5px; margin-top:5px;">
                        <input type="number" id="tsm-manual-id" placeholder="ID" />
                        <button id="tsm-add-manual-btn" class="tsm-btn-small" style="background:#555;">Add</button>
                    </div>
                </div>

                <!-- SEARCH -->
                <div class="tsm-section" style="flex-grow:1; display:flex; flex-direction:column; min-height:150px;">
                    <label>Search Item:</label>
                    <input type="text" id="tsm-item-search" placeholder="Type name..." disabled />
                    <div id="tsm-search-results">
                        <div style="color:#666; font-style:italic; padding:5px;">Save API Key to enable</div>
                    </div>
                </div>

                <div class="tsm-footer">
                    <button id="tsm-close-btn">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // --- BIND EVENTS ---
        
        // Close
        const closeBtn = document.getElementById('tsm-close-btn');
        const closeModal = () => { modal.style.display = 'none'; };
        closeBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('touchend', (e) => { e.preventDefault(); closeModal(); });

        // Save API
        document.getElementById('tsm-save-btn').onclick = async () => {
            const val = document.getElementById('tsm-api-input').value.trim();
            if(val.length < 16) { setStatus('Invalid Key', 'red'); return; }
            setStatus('Checking...', 'blue');
            const ok = await verifyApiKey(val);
            if(ok) {
                apiKey = val;
                GM_setValue(STORAGE_KEY_API, apiKey);
                setStatus('Saved!', 'green');
                enableSearchInput();
                loadItems();
            } else {
                setStatus('Error / Invalid Key', 'red');
            }
        };

        // Add Manual ID
        document.getElementById('tsm-add-manual-btn').onclick = () => {
            const id = parseInt(document.getElementById('tsm-manual-id').value);
            if(id) {
                const item = allItems.find(i => i.id === id);
                addItemToExcluded(id, item ? item.name : `Item #${id}`);
                document.getElementById('tsm-manual-id').value = '';
            }
        };

        // Search Type
        document.getElementById('tsm-item-search').addEventListener('input', (e) => {
            handleSearch(e.target.value);
        });

        // Click Search Result
        // Delegated event for better performance
        const resultsDiv = document.getElementById('tsm-search-results');
        const onResultClick = (e) => {
            const row = e.target.closest('.tsm-result-row');
            if(row && !row.classList.contains('tsm-added')) {
                const id = parseInt(row.dataset.id);
                const name = row.dataset.name;
                addItemToExcluded(id, name);
                handleSearch(document.getElementById('tsm-item-search').value);
            }
        };
        resultsDiv.addEventListener('click', onResultClick);
        resultsDiv.addEventListener('touchend', (e) => {
            // Small prevent default to avoid double firing on some devices
            // But we must allow scrolling.
            // Simplified: usually click fires after touchend. 
            // If this double-adds, we have checks in addItemToExcluded to prevent duplicates.
        });
    }

    function openSettingsModal() {
        createSettingsModal();
        const modal = document.getElementById('tsm-modal');
        document.getElementById('tsm-api-input').value = apiKey;
        document.getElementById('tsm-status').innerText = '';
        renderExcludedList();
        
        if(apiKey) {
            enableSearchInput();
            if(allItems.length === 0) loadItems();
        }
        
        modal.style.display = 'flex';
    }

    // --- LOGIC FUNCTIONS ---

    function addItemToExcluded(id, name) {
        if(excludedItems.some(i => i.id === id)) return;
        
        excludedItems.push({id: id, name: name});
        excludedItems.sort((a,b) => a.name.localeCompare(b.name));
        
        GM_setValue(STORAGE_KEY_EXCLUDED, JSON.stringify(excludedItems));
        renderExcludedList();
    }

    function renderExcludedList() {
        const div = document.getElementById('tsm-excluded-list');
        if(!div) return;
        
        if(excludedItems.length === 0) {
            div.innerHTML = '<div style="color:#666; font-style:italic;">List is empty</div>';
            return;
        }

        let html = '';
        excludedItems.forEach(i => {
            html += `
                <div class="tsm-excluded-row">
                    <span><b>[${i.id}]</b> ${i.name}</span>
                    <span class="tsm-remove-btn" data-id="${i.id}">X</span>
                </div>
            `;
        });
        div.innerHTML = html;

        // Bind Remove
        div.querySelectorAll('.tsm-remove-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                excludedItems = excludedItems.filter(x => x.id !== id);
                GM_setValue(STORAGE_KEY_EXCLUDED, JSON.stringify(excludedItems));
                renderExcludedList();
                // Refresh search if visible
                const searchVal = document.getElementById('tsm-item-search').value;
                if(searchVal) handleSearch(searchVal);
            };
        });
    }

    function handleSearch(q) {
        const div = document.getElementById('tsm-search-results');
        if(!q || q.length < 2) { div.innerHTML = ''; return; }
        
        const matches = allItems.filter(i => i.name.toLowerCase().includes(q.toLowerCase())).slice(0, 20);
        
        if(matches.length === 0) { div.innerHTML = '<div style="padding:5px; color:#999;">No matches</div>'; return; }

        let html = '';
        matches.forEach(i => {
            const isAdded = excludedItems.some(x => x.id === i.id);
            const style = isAdded ? 'opacity:0.5' : '';
            const status = isAdded ? '(Added)' : '';
            
            html += `
                <div class="tsm-result-row ${isAdded?'tsm-added':''}" style="${style}" data-id="${i.id}" data-name="${i.name.replace(/"/g, '&quot;')}">
                    <span style="color:#4CAF50; font-weight:bold; margin-right:5px;">[${i.id}]</span>
                    <span>${i.name}</span>
                    <span style="margin-left:auto; font-size:10px;">${status}</span>
                </div>
            `;
        });
        div.innerHTML = html;
    }

    function enableSearchInput() {
        const inp = document.getElementById('tsm-item-search');
        if(inp) {
            inp.disabled = false;
            if(document.getElementById('tsm-search-results').innerText.includes('Save API')) {
                document.getElementById('tsm-search-results').innerHTML = '';
            }
        }
    }

    function setStatus(msg, color) {
        const el = document.getElementById('tsm-status');
        if(el) { el.innerText = msg; el.style.color = color; }
    }

    async function verifyApiKey(key) {
        try {
            const res = await fetch(`https://api.torn.com/user/?selections=basic&key=${key}`);
            const data = await res.json();
            return !data.error;
        } catch(e) { return false; }
    }

    async function loadItems() {
        const div = document.getElementById('tsm-search-results');
        
        // Cache Check
        let cached = null;
        try { cached = JSON.parse(GM_getValue(STORAGE_KEY_ITEMS_CACHE, null)); } catch(e){}

        if(cached && (Date.now() - cached.timestamp < 24*60*60*1000)) {
            allItems = cached.data;
            return;
        }

        if(!apiKey) return;

        div.innerHTML = '<div style="color:#aaa;">Loading Items from API...</div>';
        try {
            const res = await fetch(`https://api.torn.com/v2/torn/items?key=${apiKey}`);
            const data = await res.json();
            if(data.items) {
                allItems = data.items.map(x => ({id: x.id, name: x.name}));
                GM_setValue(STORAGE_KEY_ITEMS_CACHE, JSON.stringify({timestamp: Date.now(), data: allItems}));
                div.innerHTML = '<div style="color:green;">Items Loaded!</div>';
            }
        } catch(e) {
            div.innerHTML = '<div style="color:red;">Error loading items</div>';
        }
    }

    // --- STYLES ---
    GM_addStyle(`
        #tsm-widget {
            position: fixed; z-index: 999999;
            background: #333; color: white;
            padding: 8px 12px; border-radius: 20px;
            display: flex; align-items: center; gap: 8px;
            border: 2px solid #555;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
            cursor: pointer; user-select: none;
            font-family: Arial, sans-serif;
        }
        .tsm-icon { font-size: 18px; }
        .tsm-label { font-size: 12px; font-weight: bold; }
        
        #tsm-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 1000000;
            display: flex; justify-content: center; align-items: center;
        }
        .tsm-modal-content {
            background: #222; color: #eee;
            width: 90%; max-width: 350px;
            max-height: 80vh;
            display: flex; flex-direction: column;
            padding: 15px; border-radius: 8px; border: 1px solid #444;
            font-family: Arial, sans-serif;
        }
        .tsm-modal-content h3 { margin: 0 0 10px 0; border-bottom: 1px solid #444; padding-bottom: 5px; }
        
        .tsm-section { margin-bottom: 10px; }
        label { font-size: 11px; color: #aaa; font-weight: bold; display: block; margin-bottom: 3px; }
        
        input { 
            background: #444; color: white; border: 1px solid #555; 
            padding: 6px; border-radius: 4px; width: 100%; box-sizing: border-box;
        }
        input:disabled { background: #333; color: #555; }
        
        button {
            padding: 6px 12px; border: none; border-radius: 4px;
            cursor: pointer; font-weight: bold; color: white;
        }
        .tsm-btn-small { background: #4CAF50; flex-shrink: 0; }
        #tsm-close-btn { background: #555; width: 100%; margin-top: 10px; }

        #tsm-excluded-list {
            background: #111; border: 1px solid #333; height: 100px;
            overflow-y: auto; padding: 5px; border-radius: 4px;
        }
        .tsm-excluded-row {
            display: flex; justify-content: space-between;
            font-size: 12px; padding: 4px 0; border-bottom: 1px solid #333;
        }
        .tsm-remove-btn { color: red; font-weight: bold; cursor: pointer; padding: 0 5px; }
        
        #tsm-search-results {
            background: #111; border: 1px solid #333; flex-grow: 1;
            overflow-y: auto; margin-top: 5px; border-radius: 4px;
        }
        .tsm-result-row {
            padding: 8px; border-bottom: 1px solid #333; font-size: 12px; display: flex; align-items: center;
        }
        .tsm-result-row:active { background: #333; }
    `);

})();
