// ==UserScript==
// @name          Bazaar Ultimate Suite by srsbsns
// @namespace     http://torn.com/
// @version       50.0
// @description   Combined bazaar tool: Listed/Unlisted tracker + Bulk pricing helper with API sync
// @author        srsbsns
// @match         *://www.torn.com/bazaar.php*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @connect       api.torn.com
// @connect       weav3r.dev
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/562175/Bazaar%20Ultimate%20Suite%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/562175/Bazaar%20Ultimate%20Suite%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // STORAGE KEYS
    // ============================================================================
    const S = {
        apiKey:         'tm_api_key',
        pct:            'torn.sellPct',
        rounding:       'torn.rounding',
        cat:            'torn.items.catalog',
        catTs:          'torn.items.catalog.ts',
        blockIds:       'torn.items.blockIds',
        marketDiscount: 'torn.marketDiscount',
        undercutPos:    'torn.undercutPos',
        bazaarStorage:  'bazaar_api_storage',
        lastSyncTime:   'tm_last_sync_time'
    };

    const BASE = 'https://api.torn.com';

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================
    let cat = null;
    let busy = false;
    let lastFocusedInput = null;
    let currentBazaarStock = null;
    let lastStockFetch = 0;
    let globalClickHandlerSetup = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // ============================================================================
    // API KEY MANAGEMENT
    // ============================================================================
    let apiKey = GM_getValue(S.apiKey, '');
    if (!apiKey) {
        apiKey = prompt("Please enter your Torn API Key for Bazaar Suite:");
        if (apiKey) GM_setValue(S.apiKey, apiKey.trim());
    }

    // ============================================================================
    // GETTER/SETTER HELPERS
    // ============================================================================
    const getApiKey = () => GM_getValue(S.apiKey, '');
    const setApiKey = v => GM_setValue(S.apiKey, String(v || '').trim());

    const getSellPct = () => {
        const n = Number(GM_getValue(S.pct, 95));
        return (isFinite(n) && n > 0) ? n : 95;
    };
    const setSellPct = n => GM_setValue(S.pct, Number(n) || 95);

    const getMarketDiscount = () => {
        const n = Number(GM_getValue(S.marketDiscount, 1));
        return (isFinite(n) && n >= 0) ? n : 1;
    };
    const setMarketDiscount = n => GM_setValue(S.marketDiscount, Number(n) || 1);

    const getUndercutPos = () => {
        const n = parseInt(GM_getValue(S.undercutPos, 1));
        return (n >= 1 && n <= 5) ? n : 1;
    };
    const setUndercutPos = n => GM_setValue(S.undercutPos, parseInt(n) || 1);

    const getRounding = () => {
        const v = GM_getValue(S.rounding, 'nearest');
        return ['nearest', 'up', 'down'].includes(v) ? v : 'nearest';
    };
    const setRounding = v =>
        GM_setValue(S.rounding, ['nearest', 'up', 'down'].includes(v) ? v : 'nearest');

    function parseIdList(s) {
        return new Set(
            String(s || '')
                .split(/[\s,;]+/)
                .map(x => Number(x))
                .filter(n => Number.isInteger(n) && n > 0)
        );
    }
    function getBlockedSet() { return parseIdList(GM_getValue(S.blockIds, '')); }

    // ============================================================================
    // MENU COMMANDS
    // ============================================================================
    GM_registerMenuCommand('Set API key', () => {
        const v = prompt('Enter your Torn API key', getApiKey() || '');
        if (v !== null) { setApiKey(v); alert('Saved.'); }
    });

    GM_registerMenuCommand('Set rounding (nearest/up/down)', () => {
        const v = prompt('Choose rounding: nearest | up | down', getRounding());
        if (v !== null) setRounding(v.toLowerCase());
    });

    GM_registerMenuCommand('Set market undercut amount ($)', () => {
        const v = prompt('Enter dollar amount to undercut lowest market price:', getMarketDiscount());
        if (v !== null) {
            const num = Number(v);
            if (num >= 0) {
                setMarketDiscount(num);
                alert('Saved market undercut: $' + num);
            }
        }
    });

    GM_registerMenuCommand('Set undercut position (1-5)', () => {
        const v = prompt('Enter which listing to undercut (1=lowest, 2=second, etc.):', getUndercutPos());
        if (v !== null) {
            const num = parseInt(v);
            if (num >= 1 && num <= 5) {
                setUndercutPos(num);
                alert('Saved undercut position: ' + num);
            }
        }
    });

    GM_registerMenuCommand('Reset price popup position', () => {
        GM_setValue('jp.popup.position', null);
        alert('Popup position reset. It will reposition near items on next open.');
    });

    // ============================================================================
    // STYLES
    // ============================================================================
    GM_addStyle(`
        /* Sync Timer */
        #tm-sync-timer {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: #77dd77;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-family: Tahoma, sans-serif;
            font-weight: normal;
            z-index: 9999;
            border: 1px solid rgba(255, 255, 255, 0.1);
            pointer-events: none;
            display: none;
        }

        /* Percentage Box */
        .jp-pct-box {
            position: fixed !important;
            top: 135px !important;
            right: 80px !important;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: rgba(50,50,50,0.95);
            padding: 5px 10px;
            border-radius: 4px;
            border: 1px solid #666;
            z-index: 10000;
        }
        .jp-pct-box label { color: #ddd; font-size: 12px; }
        .jp-pct-box input {
            width: 50px;
            background: #2a2a2a;
            color: #fff;
            border: 1px solid #777;
            text-align: center;
        }

        /* Action Row */
        .jp-action-row {
            position: fixed !important;
            top: 170px !important;
            right: 5px !important;
            display: flex;
            gap: 4px;
            align-items: center;
            background: rgba(40,40,40,0.95);
            padding: 6px;
            border-radius: 4px;
            border: 1px solid #666;
            z-index: 10000;
        }

        .jp-action-btn {
            padding: 8px 12px;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
        }

        .jp-apply-pct-btn { background: linear-gradient(135deg, #1565c0, #1976d2); }
        .jp-apply-dollar-btn { background: linear-gradient(135deg, #c2185b, #d81b60); }
        .jp-apply-market-btn { background: linear-gradient(135deg, #e65100, #f57c00); }

        /* Checkbox Wrapper */
        .jp-checkbox-wrap {
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
            position: relative;
            z-index: 10;
            gap: 0px;
        }

        .jp-checkbox-wrap-manage {
            margin-left: 1px;
            margin-right: 0px;
            gap: 0px;
            display: inline-flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        .jp-checkbox-wrap-add {
            margin-left: -20px;
            margin-right: 0px;
        }

        .jp-item-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        /* Price Icon Button */
        .jp-price-icon-btn {
            width: 24px;
            height: 24px;
            margin-left: 1px;
            background: #2a2a2a;
            color: #ffde00;
            border: 1px solid #666;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
            font-size: 12px;
            transition: background 0.2s;
        }
        .jp-price-icon-btn:hover {
            background: #3a3a3a;
        }

        /* Select All Wrapper */
        .jp-select-all-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 5px;
            border-right: 1px solid #555;
            padding-right: 8px;
        }
        .jp-select-all-wrap label {
            font-size: 9px;
            color: #aaa;
            font-weight: bold;
        }

        /* Item Height Adjustments */
        .bazaar-item, li[class*="item"], div[class*="row_"] {
            min-height: auto !important;
        }

        /* Blocked Items */
        .jpx {
            margin-left: 8px;
            color: #fff;
            background: #c62828;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 700;
        }
        .jp-blocked-row {
            box-shadow: inset 0 0 5px rgba(198,40,40,0.4);
        }

        /* Price Popup */
        .jp-price-popup {
            position: fixed;
            background: rgba(26, 26, 26, 0.98);
            border: 2px solid #666;
            border-radius: 8px;
            padding: 15px;
            z-index: 100000;
            display: none;
            min-width: 280px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.9);
        }

        .jp-price-header {
            font-weight: bold;
            color: #ffde00;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #444;
            font-size: 13px;
            padding-right: 30px;
            cursor: move;
            user-select: none;
        }

        .jp-stock-banner {
            background: #2a2a2a;
            color: #ffde00;
            padding: 8px;
            margin-bottom: 10px;
            border-radius: 4px;
            font-size: 11px;
            text-align: center;
            font-weight: bold;
        }

        .jp-price-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }

        .jp-price-table th {
            background: #222;
            color: #888;
            font-size: 10px;
            text-transform: uppercase;
            padding: 8px 4px;
            border-bottom: 1px solid #444;
            font-weight: bold;
        }

        .jp-price-table td {
            padding: 10px 6px;
            text-align: center;
            border-bottom: 1px solid #333;
            cursor: pointer;
            font-size: 11px;
            transition: background 0.2s;
        }

        .jp-price-table td:hover {
            background: #333;
        }

        .jp-price-table .market-col {
            color: #7cfc00;
            font-weight: bold;
            border-right: 1px solid #333;
        }

        .jp-price-table .bazaar-col {
            color: #00aaff;
            font-weight: bold;
        }

        .jp-qty-label {
            color: #888;
            font-size: 9px;
            margin-right: 4px;
        }

        .jp-popup-close {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            color: #888;
            font-size: 20px;
            font-weight: bold;
            line-height: 1;
            padding: 5px;
        }

        .jp-popup-close:hover {
            color: #fff;
        }

        /* Price Percentage Badge */
        .jp-price-pct {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 5px;
            white-space: nowrap;
        }

        .jp-price-pct.positive {
            color: #7cfc00;
        }

        .jp-price-pct.negative {
            color: #ff4444;
        }

        .jp-price-pct.neutral {
            color: #aaa;
        }

        /* Input Alignment */
        .input-money-group input.input-money {
            text-align: left !important;
            padding-left: 8px !important;
        }

        /* Manage Page Input Adjustments */
        [data-testid="legacy-money-input"] {
            padding-top: 4px !important;
            padding-bottom: 4px !important;
            padding-left: 5px !important;
            padding-right: 5px !important;
        }

        .input-money-group {
            padding-left: 0px !important;
            padding-right: 0px !important;
            margin-right: -15px !important;
        }

        div[class*="DoKP7"] {
            padding-right: 0px !important;
        }

        /* Bazaar Status Label (from first script) */
        .bazaar-status-label {
            position: absolute;
            bottom: 4px;
            right: 4px;
            color: #ffffff;
            font-style: italic;
            font-size: 11px;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
            background: rgba(30, 30, 30, 0.8);
            padding: 1px 5px;
            border-radius: 3px;
            pointer-events: none;
            z-index: 999;
            line-height: 1;
            border: 1px solid rgba(255,255,255,0.2);
        }
    `);

    // ============================================================================
    // SYNC TIMER UI (FROM FIRST SCRIPT)
    // ============================================================================
    const syncLabel = document.createElement('div');
    syncLabel.id = 'tm-sync-timer';
    syncLabel.innerText = "Bazaar Sync: Initializing...";
    document.body.appendChild(syncLabel);

    function updateTimerDisplay() {
        const hash = window.location.hash;
        if (!hash.includes('/add')) {
            syncLabel.style.display = 'none';
            return;
        } else {
            syncLabel.style.display = 'block';
        }

        const lastSync = GM_getValue(S.lastSyncTime, 0);
        if (lastSync === 0) return;

        const secondsAgo = Math.floor((Date.now() - lastSync) / 1000);
        syncLabel.innerText = `Bazaar Sync: ${secondsAgo}s ago`;

        // Change color to orange if data is older than 2 minutes
        syncLabel.style.color = secondsAgo > 120 ? '#ffb347' : '#77dd77';
    }

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    const onBazaar = () => /\/bazaar\.php$/i.test(location.pathname);
    const onManage = () => onBazaar() && /^#\/manage\b/i.test(location.hash || '');
    const onAdd = () => onBazaar() && /^#\/add\b/i.test(location.hash || '');
    const selPriceInputs = 'input.input-money, input[class*="price" i]';

    const sanitize = s => String(s || '').replace(/\(x?\d+\)$/i, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const num = v => Number(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0;

    function dollars(n, mode = getRounding()) {
        if (!isFinite(n)) return 0;
        if (mode === 'up') return Math.ceil(n);
        if (mode === 'down') return Math.floor(n);
        return Math.round(n);
    }

    const JGet = (k) => {
        try {
            const v = GM_getValue(k, null);
            return v ? JSON.parse(v) : null;
        } catch {
            return null;
        }
    };
    const JSet = (k, o) => GM_setValue(k, JSON.stringify(o || null));

    async function xfetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: r => {
                    try {
                        const j = JSON.parse(r.responseText);
                        if (j?.error) return reject(new Error(j.error.error_desc || j.error.error));
                        resolve(j);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: e => reject(e)
            });
        });
    }

    // ============================================================================
    // API FETCH FUNCTIONS
    // ============================================================================
    async function fetchCatalog(force = false) {
        const cached = JGet(S.cat), ts = GM_getValue(S.catTs, 0);
        if (!force && cached && (Date.now() - ts) < 12 * 3600 * 1000) return cached;
        const key = getApiKey();
        if (!key) return { byId: {}, byName: {} };
        const data = await xfetch(`${BASE}/torn/?selections=items&key=${encodeURIComponent(key)}`);
        const items = data.items || {};
        const out = { byId: {}, byName: {} };
        for (const id in items) {
            const it = items[id];
            const rec = {
                id: Number(id),
                name: it.name,
                mv: Number(it.market_value) || 0,
                sell: Number(it.sell_price) || 0
            };
            out.byId[rec.id] = rec;
            out.byName[sanitize(it.name)] = rec;
        }
        JSet(S.cat, out);
        GM_setValue(S.catTs, Date.now());
        return out;
    }

    async function fetchMarketPrice(itemId) {
        const key = getApiKey();
        if (!key) return null;
        const data = await xfetch(`${BASE}/v2/market/${itemId}?selections=itemmarket&key=${encodeURIComponent(key)}`);
        const listings = data.itemmarket?.listings || data.itemmarket || [];

        // Get the price at the specified position
        const position = getUndercutPos();
        const targetIndex = Math.min(position - 1, listings.length - 1);

        if (Array.isArray(listings) && listings.length > 0) {
            return Number(listings[targetIndex].price || listings[targetIndex].cost);
        }
        return null;
    }

    async function fetchBazaarStock(force = false) {
        const key = getApiKey();
        if (!key) return null;

        // Cache for 15 seconds
        if (!force && currentBazaarStock && (Date.now() - lastStockFetch) < 15000) {
            return currentBazaarStock;
        }

        try {
            const data = await xfetch(`${BASE}/user/?selections=bazaar&key=${encodeURIComponent(key)}`);
            currentBazaarStock = {};

            // Handle both array and object formats
            const bazaarItems = Array.isArray(data.bazaar) ? data.bazaar : Object.values(data.bazaar || {});

            bazaarItems.forEach(item => {
                const id = item.ID || item.item_id;
                currentBazaarStock[id] = {
                    quantity: item.quantity,
                    price: item.price
                };
            });

            lastStockFetch = Date.now();
            return currentBazaarStock;
        } catch (e) {
            console.error('Failed to fetch bazaar stock:', e);
            return null;
        }
    }

    // Sync with API (from first script)
    function syncWithAPI() {
        const key = getApiKey();
        if (!key) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=bazaar&key=${key}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        syncLabel.innerText = "Bazaar Sync: API Error";
                        syncLabel.style.color = "#ff4444";
                        return;
                    }

                    const bazaarItems = data.bazaar || [];
                    const newStorage = {};

                    bazaarItems.forEach(item => {
                        const id = item.ID || item.item_id;
                        if (id) newStorage[id] = item.quantity || item.amount;
                    });

                    GM_setValue(S.bazaarStorage, JSON.stringify(newStorage));
                    GM_setValue(S.lastSyncTime, Date.now());
                    updateTimerDisplay();

                } catch (e) {
                    console.error("Bazaar Sync Error", e);
                }
            }
        });
    }

    // ============================================================================
    // ITEM RESOLUTION
    // ============================================================================
    function resolveItemForPriceInput(input, catObj) {
        const row = input.closest('li, [class*="row"], .bazaar-item, .item-li, [class*="item"]');
        if (!row) return null;

        // 1. Try to find ID in image URLs first (most reliable)
        const img = row.querySelector('img[src*="items/"], img[src*="/images/items/"]');
        if (img) {
            const match = img.src.match(/items\/(\d+)/);
            if (match && catObj.byId[match[1]]) {
                return catObj.byId[match[1]];
            }
        }

        // 2. Try to find ID in data attributes
        const idHolder = row.querySelector('[data-item-id],[data-itemid],[data-item],[data-id]');
        if (idHolder) {
            let id = idHolder.getAttribute('data-item-id') ||
                     idHolder.getAttribute('data-itemid') ||
                     idHolder.getAttribute('data-item') ||
                     idHolder.getAttribute('data-id');
            if (id && catObj.byId[id]) {
                return catObj.byId[id];
            }
        }

        // 3. Try to find by Name
        const nameEl = row.querySelector('.name, .item-name, .title, b, [class*="name"]');
        if (nameEl) {
            const cleaned = sanitize(nameEl.textContent);
            if (catObj.byName[cleaned]) {
                return catObj.byName[cleaned];
            }
        }

        return null;
    }

    // ============================================================================
    // PRICE APPLICATION
    // ============================================================================
    function applyPrice(input, price) {
        if (!input) return;
        const nativeSet = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        nativeSet ? nativeSet.call(input, String(price)) : (input.value = String(price));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function updateNpcWarning(priceInput, item) {
        if (!item || !priceInput) return;
        const price = num(priceInput.value);
        if (price > 0 && price < item.sell && price !== 1) {
            priceInput.style.color = '#ff4444';
            priceInput.style.fontWeight = '700';
        } else {
            priceInput.style.color = '';
            priceInput.style.fontWeight = '';
        }
    }

    function getTargetInputs() {
        const checked = document.querySelectorAll('.jp-item-checkbox:checked');
        if (checked.length > 0) {
            return Array.from(checked)
                .map(cb => cb.closest('li, [class*="row"], .bazaar-item, .item-li')
                    .querySelector(selPriceInputs))
                .filter(i => i);
        }
        return lastFocusedInput ? [lastFocusedInput] : [];
    }

    // ============================================================================
    // POPUP POSITION MANAGEMENT
    // ============================================================================
    const getPopupPosition = () => {
        const saved = GM_getValue('jp.popup.position', null);
        return saved ? JSON.parse(saved) : null;
    };

    const savePopupPosition = (top, left) => {
        GM_setValue('jp.popup.position', JSON.stringify({ top, left }));
    };

    // ============================================================================
    // POPUP DRAGGABLE
    // ============================================================================
    function makePopupDraggable(popup) {
        const header = popup.querySelector('.jp-price-header');
        if (!header) return;

        const startDrag = (e) => {
            if (e.target.classList.contains('jp-popup-close')) return;

            isDragging = true;
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            dragOffset.x = touch.clientX - popup.offsetLeft;
            dragOffset.y = touch.clientY - popup.offsetTop;

            popup.style.transition = 'none';

            if (e.type === 'mousedown') {
                document.addEventListener('mousemove', doDrag);
                document.addEventListener('mouseup', stopDrag);
            } else {
                document.addEventListener('touchmove', doDrag, { passive: false });
                document.addEventListener('touchend', stopDrag);
            }

            e.preventDefault();
        };

        const doDrag = (e) => {
            if (!isDragging) return;

            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            const newLeft = touch.clientX - dragOffset.x;
            const newTop = touch.clientY - dragOffset.y;

            // Keep popup within viewport
            const maxLeft = window.innerWidth - popup.offsetWidth;
            const maxTop = window.innerHeight - popup.offsetHeight;

            popup.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            popup.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';

            if (e.type === 'touchmove') e.preventDefault();
        };

        const stopDrag = () => {
            if (isDragging) {
                isDragging = false;
                savePopupPosition(popup.style.top, popup.style.left);
                popup.style.transition = '';

                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
                document.removeEventListener('touchmove', doDrag);
                document.removeEventListener('touchend', stopDrag);
            }
        };

        header.addEventListener('mousedown', startDrag);
        header.addEventListener('touchstart', startDrag);
    }

    // ============================================================================
    // PRICE POPUP
    // ============================================================================
    async function showPricePopup(input, row) {
        try {
            if (!cat) cat = await fetchCatalog();
            const item = resolveItemForPriceInput(input, cat);
            if (!item?.id) {
                console.log('No item found for price input');
                return;
            }

            // Create or get popup
            let popup = document.querySelector('.jp-price-popup');

            if (!popup) {
                popup = document.createElement('div');
                popup.className = 'jp-price-popup';
                document.body.appendChild(popup);
            }

            // Position popup - use saved position if available, otherwise position near button
            const savedPos = getPopupPosition();
            if (savedPos) {
                popup.style.top = savedPos.top;
                popup.style.left = savedPos.left;
            } else {
                const rect = row.getBoundingClientRect();
                popup.style.top = Math.max(10, rect.top + window.scrollY - 50) + 'px';
                popup.style.left = Math.max(10, rect.left + window.scrollX - 340) + 'px';
            }

            popup.style.display = 'block';

            // Show loading state
            popup.innerHTML = `
                <span class="jp-popup-close">&times;</span>
                <div class="jp-price-header">${item.name}</div>
                <div class="jp-stock-banner">Loading stock info...</div>
                <table class="jp-price-table">
                    <thead>
                        <tr>
                            <th>Item Market</th>
                            <th>Bazaar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="market-col">Loading...</td><td class="bazaar-col">Loading...</td></tr>
                        <tr><td class="market-col">Loading...</td><td class="bazaar-col">Loading...</td></tr>
                        <tr><td class="market-col">Loading...</td><td class="bazaar-col">Loading...</td></tr>
                        <tr><td class="market-col">Loading...</td><td class="bazaar-col">Loading...</td></tr>
                        <tr><td class="market-col">Loading...</td><td class="bazaar-col">Loading...</td></tr>
                    </tbody>
                </table>
            `;

            // Make popup draggable
            makePopupDraggable(popup);

            // Close button handler
            const closeBtn = popup.querySelector('.jp-popup-close');
            closeBtn.onclick = function(e) {
                e.stopPropagation();
                popup.style.display = 'none';
            };

            // Setup global click handler only once
            if (!globalClickHandlerSetup) {
                globalClickHandlerSetup = true;
                document.addEventListener('click', function(e) {
                    const popup = document.querySelector('.jp-price-popup');
                    if (popup && popup.style.display === 'block') {
                        if (!popup.contains(e.target) && !e.target.classList.contains('jp-price-icon-btn')) {
                            popup.style.display = 'none';
                        }
                    }
                }, true);
            }

            // Fetch stock info
            try {
                const stock = await fetchBazaarStock();
                const stockBanner = popup.querySelector('.jp-stock-banner');
                if (stock && stock[item.id]) {
                    stockBanner.textContent = `On Bazaar: ${stock[item.id].quantity.toLocaleString()} @ $${stock[item.id].price.toLocaleString()}`;
                } else {
                    stockBanner.textContent = 'On Bazaar: 0 (Not listed)';
                }
            } catch (e) {
                console.error('Failed to fetch stock:', e);
            }

            // Helper function to apply price with undercut
            const applyPriceWithUndercut = function(price) {
                const undercut = getMarketDiscount();
                const final = Math.max(1, price - undercut);
                applyPrice(input, final);
                updateNpcWarning(input, item);

                // Also fill quantity on Add page only
                if (onAdd()) {
                    const qtyText = row.querySelector('[class*="amount"], .amount, .count')?.textContent;
                    if (qtyText) {
                        const qty = qtyText.replace(/[^0-9]/g, '');
                        const qtyInput = row.querySelector('input[name="amount"], input[placeholder*="Qty" i], input[placeholder*="Amount" i]');
                        if (qtyInput && qty) {
                            applyPrice(qtyInput, qty);
                        }
                    }
                }

                popup.style.display = 'none';
            };

            // Fetch Item Market prices
            try {
                const marketData = await xfetch(`${BASE}/v2/market/${item.id}?selections=itemmarket&key=${encodeURIComponent(getApiKey())}`);
                const marketListings = marketData.itemmarket?.listings || [];

                const rows = popup.querySelectorAll('.jp-price-table tbody tr');
                marketListings.slice(0, 5).forEach((listing, i) => {
                    if (rows[i]) {
                        const cell = rows[i].querySelector('.market-col');
                        cell.innerHTML = `<span class="jp-qty-label">${listing.amount?.toLocaleString() || '?'} x</span>$${listing.price?.toLocaleString() || '?'}`;
                        cell.style.cursor = 'pointer';
                        cell.onclick = function(e) {
                            e.stopPropagation();
                            applyPriceWithUndercut(listing.price);
                        };
                    }
                });
            } catch (e) {
                console.error('Failed to fetch market prices:', e);
            }

            // Fetch Bazaar prices (from external API)
            try {
                const bazaarData = await xfetch(`https://weav3r.dev/api/marketplace/${item.id}`);
                const bazaarListings = bazaarData.listings || [];

                const rows = popup.querySelectorAll('.jp-price-table tbody tr');
                bazaarListings.slice(0, 5).forEach((listing, i) => {
                    if (rows[i]) {
                        const cell = rows[i].querySelector('.bazaar-col');
                        cell.innerHTML = `<span class="jp-qty-label">${listing.quantity?.toLocaleString() || '?'} x</span>$${listing.price?.toLocaleString() || '?'}`;
                        cell.style.cursor = 'pointer';
                        cell.onclick = function(e) {
                            e.stopPropagation();
                            applyPriceWithUndercut(listing.price);
                        };
                    }
                });
            } catch (e) {
                console.error('Failed to fetch bazaar prices:', e);
            }
        } catch (error) {
            console.error('Error in showPricePopup:', error);
        }
    }

    // ============================================================================
    // UI CREATION FUNCTIONS
    // ============================================================================
    function createActionRow() {
        if (document.querySelector('.jp-action-row')) return;
        if (!onAdd() && !onManage()) return;

        const row = document.createElement('div');
        row.className = 'jp-action-row';

        const selectAllWrap = document.createElement('div');
        selectAllWrap.className = 'jp-select-all-wrap';
        const saCb = document.createElement('input');
        saCb.type = 'checkbox';
        saCb.id = 'jp-master-toggle';
        saCb.addEventListener('change', (e) => {
            document.querySelectorAll('.jp-item-checkbox').forEach(cb => cb.checked = e.target.checked);
        });
        const saLb = document.createElement('label');
        saLb.textContent = 'ALL';
        selectAllWrap.append(saCb, saLb);
        row.appendChild(selectAllWrap);

        const btnPct = document.createElement('button');
        btnPct.className = 'jp-action-btn jp-apply-pct-btn';
        btnPct.textContent = '% MV';
        btnPct.onclick = async () => {
            const targets = getTargetInputs();
            if (!targets.length) return;
            if (!cat) cat = await fetchCatalog();
            targets.forEach(input => {
                const item = resolveItemForPriceInput(input, cat);
                if (item?.mv) {
                    applyPrice(input, dollars(item.mv * (getSellPct() / 100)));
                    updateNpcWarning(input, item);
                }
            });
        };

        const btnDollar = document.createElement('button');
        btnDollar.className = 'jp-action-btn jp-apply-dollar-btn';
        btnDollar.textContent = '$1';
        btnDollar.onclick = () => {
            getTargetInputs().forEach(input => {
                applyPrice(input, 1);
                if (cat) updateNpcWarning(input, resolveItemForPriceInput(input, cat));

                // Only on Add page: set quantity to 1
                if (onAdd()) {
                    const row = input.closest('li, [class*="row"], .bazaar-item, .item-li');
                    if (row) {
                        const qtyInput = row.querySelector('input[name="amount"], input[placeholder*="Qty" i]');
                        if (qtyInput) {
                            applyPrice(qtyInput, 1);
                        }
                    }
                }
            });
        };

        const btnMarket = document.createElement('button');
        btnMarket.className = 'jp-action-btn jp-apply-market-btn';
        btnMarket.textContent = 'Beat';
        btnMarket.onclick = async () => {
            const targets = getTargetInputs();
            if (!targets.length) return;
            btnMarket.disabled = true;
            btnMarket.textContent = '...';
            if (!cat) cat = await fetchCatalog();

            for (const input of targets) {
                const item = resolveItemForPriceInput(input, cat);
                if (item?.id) {
                    const low = await fetchMarketPrice(item.id);
                    if (low) {
                        applyPrice(input, Math.max(1, low - getMarketDiscount()));
                        updateNpcWarning(input, item);
                    }
                }
            }
            btnMarket.disabled = false;
            btnMarket.textContent = 'Beat';
        };

        row.append(btnPct, btnDollar, btnMarket);
        document.body.appendChild(row);
    }

    function createPctInput() {
        if (document.querySelector('.jp-pct-box') || (!onAdd() && !onManage())) return;
        const box = document.createElement('div');
        box.className = 'jp-pct-box';
        box.innerHTML = `<label>%</label><input type="number" value="${getSellPct()}">`;
        box.querySelector('input').onchange = (e) => setSellPct(e.target.value);
        document.body.appendChild(box);
    }

    function ensureCheckboxes() {
        const inputs = document.querySelectorAll(selPriceInputs);
        const isAddPage = onAdd();

        inputs.forEach(input => {
            const row = input.closest('li, [class*="row"], .bazaar-item, .item-li');
            if (row && !row.querySelector('.jp-checkbox-wrap')) {
                const wrap = document.createElement('div');
                wrap.className = isAddPage ? 'jp-checkbox-wrap jp-checkbox-wrap-add' : 'jp-checkbox-wrap jp-checkbox-wrap-manage';

                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.className = 'jp-item-checkbox';
                wrap.appendChild(cb);

                // Price icon button - on BOTH Add and Manage pages
                const priceBtn = document.createElement('button');
                priceBtn.className = 'jp-price-icon-btn';
                priceBtn.innerHTML = '$';
                wrap.appendChild(priceBtn);

                // Add click handler for price button
                priceBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showPricePopup(input, row);
                });

                if (isAddPage) {
                    // On Add page: place checkbox wrap AFTER the price input
                    input.parentElement.insertBefore(wrap, input.nextSibling);

                    // Add double-click handler to quantity input (Add page only)
                    const qtyInput = row.querySelector('input[name="amount"], input[placeholder*="Qty" i], input[placeholder*="Amount" i]');
                    if (qtyInput && !qtyInput.classList.contains('jp-qty-dblclick-added')) {
                        qtyInput.classList.add('jp-qty-dblclick-added');
                        qtyInput.addEventListener('dblclick', (e) => {
                            e.preventDefault();
                            const amountText = row.querySelector('[class*="amount"], .amount, .count')?.textContent;
                            if (amountText) {
                                const maxQty = amountText.replace(/[^0-9]/g, '');
                                if (maxQty) {
                                    applyPrice(qtyInput, maxQty);
                                    // Visual feedback - flash the input
                                    qtyInput.style.background = '#2a5a2a';
                                    setTimeout(() => {
                                        qtyInput.style.background = '';
                                    }, 200);
                                }
                            }
                        });
                    }
                } else {
                    // On Manage page: place after the input-money-group container
                    const moneyGroup = input.closest('.input-money-group, [class*="input-money-group"]');
                    if (moneyGroup && moneyGroup.parentElement) {
                        moneyGroup.parentElement.insertBefore(wrap, moneyGroup.nextSibling);
                    } else {
                        // Fallback: place after price input
                        input.parentElement.insertBefore(wrap, input.nextSibling);
                    }
                }
            }
        });
    }

    function addPricePctBadge(priceInput, item) {
        const row = priceInput.closest('li, [class*="row"], .bazaar-item, .item-li');
        if (!row) return;

        // Find the bonuses div
        const bonusesDiv = row.querySelector('[class*="bonuses___"]');
        if (!bonusesDiv) return;

        // Don't add if already exists
        if (bonusesDiv.querySelector('.jp-price-pct')) return;

        const currentPrice = num(priceInput.value);
        if (!currentPrice || !item.mv || currentPrice === 1) return;

        // Calculate percentage difference from MV
        const pctDiff = ((currentPrice - item.mv) / item.mv) * 100;
        const pctRounded = Math.round(pctDiff);

        // Create badge
        const badge = document.createElement('span');
        badge.className = 'jp-price-pct';

        // Determine color based on percentage
        if (pctRounded > 0) {
            badge.classList.add('negative'); // Above MV = red
            badge.innerHTML = `▲${pctRounded}%`;
        } else if (pctRounded < 0) {
            badge.classList.add('positive'); // Below MV = green
            badge.innerHTML = `▼${Math.abs(pctRounded)}%`;
        } else {
            badge.classList.add('neutral');
            badge.innerHTML = `●0%`;
        }

        // Insert into bonuses div
        bonusesDiv.appendChild(badge);

        // Update badge when price changes
        priceInput.addEventListener('input', () => {
            const newPrice = num(priceInput.value);
            if (!newPrice) return;

            const newPct = ((newPrice - item.mv) / item.mv) * 100;
            const newRounded = Math.round(newPct);

            badge.className = 'jp-price-pct';

            if (newRounded > 0) {
                badge.classList.add('negative');
                badge.innerHTML = `▲${newRounded}%`;
            } else if (newRounded < 0) {
                badge.classList.add('positive');
                badge.innerHTML = `▼${Math.abs(newRounded)}%`;
            } else {
                badge.classList.add('neutral');
                badge.innerHTML = `●0%`;
            }
        });
    }

    // ============================================================================
    // INVENTORY HIGHLIGHT (FROM FIRST SCRIPT)
    // ============================================================================
    function scanAndHighlight() {
        const hash = window.location.hash;
        if (!hash.includes('/add')) return;

        const storedData = JSON.parse(GM_getValue(S.bazaarStorage, '{}'));
        const inventoryImgs = document.querySelectorAll('img[src*="/items/"]');

        inventoryImgs.forEach(img => {
            const idMatch = img.src.match(/\/items\/(\d+)\//);
            if (!idMatch) return;

            const id = idMatch[1];
            const isListed = !!storedData[id];

            const color = isListed ? 'rgba(0, 100, 200, 0.7)' : 'rgba(220, 40, 40, 0.7)';
            const glowColor = isListed ? 'rgba(0, 100, 200, 0.5)' : 'rgba(220, 40, 40, 0.5)';

            if (!img.dataset.processed || img.dataset.listedStatus !== String(isListed)) {
                const oldLabel = img.parentElement.querySelector('.bazaar-status-label');
                if (oldLabel) oldLabel.remove();

                img.style.setProperty('filter', `drop-shadow(0 0 5px ${glowColor})`, 'important');
                img.style.setProperty('outline', `2px solid ${color}`, 'important');
                img.style.setProperty('border-radius', '4px', 'important');

                if (isListed) {
                    const label = document.createElement('div');
                    label.className = 'bazaar-status-label';
                    label.innerText = `x${storedData[id]}`;
                    if (img.parentElement) {
                        img.parentElement.style.position = 'relative';
                        img.parentElement.appendChild(label);
                    }
                }
                img.dataset.processed = "true";
                img.dataset.listedStatus = String(isListed);
            }
        });
    }

    // ============================================================================
    // MAIN ANNOTATION FUNCTION
    // ============================================================================
    async function annotate() {
        if (!onBazaar() || busy) return;
        busy = true;
        try {
            if (!cat) cat = await fetchCatalog();
            createPctInput();
            createActionRow();
            ensureCheckboxes();

            const blocked = getBlockedSet();
            document.querySelectorAll(selPriceInputs).forEach(input => {
                const item = resolveItemForPriceInput(input, cat);
                if (item) {
                    updateNpcWarning(input, item);

                    // Add percentage badge on Manage page
                    if (onManage()) {
                        addPricePctBadge(input, item);
                    }

                    if (blocked.has(item.id) && !input.parentElement.querySelector('.jpx')) {
                        const span = document.createElement('span');
                        span.className = 'jpx';
                        span.textContent = '✖';
                        input.after(span);
                        input.closest('li, [class*="row"]')?.classList.add('jp-blocked-row');
                    }
                }
            });
        } finally {
            busy = false;
        }
    }

    // ============================================================================
    // EVENT LISTENERS
    // ============================================================================
    document.addEventListener('focus', (e) => {
        if (e.target.classList?.contains('input-money')) lastFocusedInput = e.target;
    }, true);

    const mo = new MutationObserver(() => {
        annotate();
        scanAndHighlight(); // Highlight inventory items
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    window.addEventListener('hashchange', () => {
        document.querySelector('.jp-action-row')?.remove();
        document.querySelector('.jp-pct-box')?.remove();
        annotate();
    });

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    // Initial Sync and Loops
    syncWithAPI();
    setInterval(syncWithAPI, 60000);        // API Sync every 60s
    setInterval(updateTimerDisplay, 1000);  // UI Timer update every 1s
    setInterval(scanAndHighlight, 1000);    // Visual Highlight check every 1s

    setTimeout(() => {
        annotate();
        scanAndHighlight();
    }, 800);
})();