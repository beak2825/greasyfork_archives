// ==UserScript==
// @name         TORN Auction Price Checker
// @namespace    https://torn.com/
// @version      2.28.0
// @description  Check historical prices for similar auction items
// @author       WinterValor [3945658]
// @match        https://www.torn.com/amarket.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/displaycase.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      btrmmuuoofbonmuwrkzg.supabase.co
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564049/TORN%20Auction%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/564049/TORN%20Auction%20Price%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        SUPABASE_URL: 'https://btrmmuuoofbonmuwrkzg.supabase.co',
        SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cm1tdXVvb2Zib25tdXdya3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTEzMTgsImV4cCI6MjA4NDQyNzMxOH0.E-s0k46BORXLICAvxtEpqoM3Qmh4-TRLaJAwXO6wJTY',
        CACHE_TTL: 5 * 60 * 1000,
        CACHE_KEY: 'ah_search_cache',
        MAX_CACHE_ENTRIES: 50
    };

    // Client-side cache using localStorage
    const searchCache = {
        _getStore() {
            try {
                return JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || '{}');
            } catch { return {}; }
        },
        _setStore(store) {
            try {
                localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(store));
            } catch { /* quota exceeded - ignore */ }
        },
        get(key) {
            const store = this._getStore();
            const entry = store[key];
            if (entry && Date.now() - entry.ts < CONFIG.CACHE_TTL) {
                console.log('[AH] Cache hit');
                return entry.data;
            }
            if (entry) delete store[key]; // expired
            return null;
        },
        set(key, data) {
            const store = this._getStore();
            // Evict oldest if full
            const keys = Object.keys(store);
            if (keys.length >= CONFIG.MAX_CACHE_ENTRIES) {
                const sorted = keys.sort((a, b) => store[a].ts - store[b].ts);
                sorted.slice(0, 10).forEach(k => delete store[k]);
            }
            store[key] = { data, ts: Date.now() };
            this._setStore(store);
        },
        clear() {
            localStorage.removeItem(CONFIG.CACHE_KEY);
        }
    };

    GM_addStyle(`
        .ah-btn {
            position: absolute;
            top: 28px;
            right: 0;
            padding: 4px 10px;
            background: #1a1a1a;
            border: 1px solid #444;
            border-radius: 3px;
            color: #aaa;
            cursor: pointer;
            font-size: 11px;
            font-family: Arial, sans-serif;
            transition: background 0.15s, color 0.15s;
        }
        .ah-btn:hover {
            background: #333;
            color: #fff;
        }

        .ah-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            z-index: 99998;
            display: none;
        }
        .ah-overlay.open { display: block; }

        .ah-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 650px;
            max-width: 95vw;
            max-height: 85vh;
            background: #0a0a0a;
            border: 1px solid #262626;
            border-radius: 8px;
            z-index: 99999;
            display: none;
            flex-direction: column;
            color: #fafafa;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .ah-modal.open { display: flex; }

        .ah-header {
            padding: 16px;
            border-bottom: 1px solid #262626;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .ah-title { font-size: 14px; font-weight: 600; margin: 0 !important; margin-top: 0 !important; margin-bottom: 0 !important; }
        .ah-close {
            background: none;
            border: none;
            color: #737373;
            cursor: pointer;
            font-size: 18px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
        }
        .ah-close:hover { color: #fff; }

        .ah-filters {
            padding: 12px 16px;
            background: #171717;
            border-bottom: 1px solid #262626;
        }
        .ah-filter-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 8px;
            align-items: flex-end;
        }
        .ah-filter-row:last-child { margin-bottom: 0; }
        .ah-field {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .ah-field.wide { flex: 1; min-width: 200px; }
        .ah-field.medium { width: 130px; }
        .ah-field.small { width: 60px; }
        .ah-field label {
            font-size: 10px;
            color: #737373;
            text-transform: uppercase;
        }
        .ah-field input, .ah-field select {
            padding: 6px 8px;
            background: #0a0a0a;
            border: 1px solid #333;
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
        }
        .ah-field input:focus, .ah-field select:focus {
            outline: none;
            border-color: #525252;
        }
        .ah-search-btn {
            padding: 8px 20px;
            background: #fff;
            border: none;
            border-radius: 4px;
            color: #000;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            align-self: flex-end;
            margin-top: auto;
        }
        .ah-search-btn:hover { background: #e5e5e5; }

        .ah-bonus-row {
            display: flex;
            gap: 6px;
            align-items: flex-end;
            padding: 6px 8px;
            background: #0d0d0d;
            border-radius: 4px;
            flex: 1;
        }
        .ah-bonus-row .ah-field { gap: 2px; }
        .ah-bonus-row .ah-field.bonus-select { width: 110px; }
        .ah-bonus-row .ah-field.bonus-val { width: 50px; }
        .ah-bonus-row label { font-size: 9px; }
        .ah-bonus-row input, .ah-bonus-row select { padding: 4px 6px; font-size: 11px; }
        .ah-bonus-row.quality { flex: none; }

        .ah-results {
            flex: 1;
            overflow-y: auto;
            padding: 8px;
            max-height: 300px;
            min-height: 120px;
        }

        .ah-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            background: #171717;
            border: 1px solid #262626;
            border-radius: 6px;
            margin-bottom: 6px;
        }
        .ah-item:hover { border-color: #404040; }
        .ah-item-left { flex: 1; }
        .ah-item-name { font-size: 13px; font-weight: 500; margin: 0 0 2px; }
        .ah-item-meta { font-size: 11px; color: #737373; margin: 0; }
        .ah-item-bonuses { margin-top: 4px; }
        .ah-bonus {
            display: inline-block;
            padding: 2px 6px;
            background: #262626;
            border-radius: 3px;
            font-size: 10px;
            color: #a3a3a3;
            margin-right: 4px;
        }
        .ah-item-right { text-align: right; }
        .ah-price { font-size: 14px; font-weight: 600; color: #22c55e; margin: 0; }
        .ah-date { font-size: 10px; color: #525252; margin: 2px 0 0; }
        .ah-players { font-size: 10px; color: #737373; margin: 3px 0 0; }
        .ah-players a { color: #60a5fa; text-decoration: none; }
        .ah-players a:hover { text-decoration: underline; }

        .ah-loading, .ah-empty, .ah-error {
            padding: 40px;
            text-align: center;
            color: #737373;
            font-size: 13px;
        }
        .ah-error { color: #ef4444; }
        .ah-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #262626;
            border-top-color: #fff;
            border-radius: 50%;
            animation: ah-spin 0.6s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes ah-spin { to { transform: rotate(360deg); } }

        .ah-footer {
            padding: 10px 16px;
            border-top: 1px solid #262626;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #737373;
        }
        .ah-nav { display: flex; gap: 4px; }
        .ah-nav-btn {
            padding: 4px 10px;
            background: #171717;
            border: 1px solid #262626;
            border-radius: 4px;
            color: #a3a3a3;
            font-size: 11px;
            cursor: pointer;
        }
        .ah-nav-btn:hover:not(:disabled) { background: #262626; color: #fff; }
        .ah-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    `);

    let state = {
        open: false,
        loading: false,
        error: null,
        results: [],
        total: 0,
        offset: 0,
        filters: {
            itemName: '',
            bonus1Id: '',
            bonus1Min: '',
            bonus1Max: '',
            bonus2Id: '',
            bonus2Min: '',
            bonus2Max: '',
            qualityMin: '',
            qualityMax: ''
        },
        bonusList: [],
        bonusMap: {}
    };

    function createModal() {
        const overlay = document.createElement('div');
        overlay.id = 'ah-overlay';
        overlay.className = 'ah-overlay';
        overlay.onclick = closeModal;

        const modal = document.createElement('div');
        modal.id = 'ah-modal';
        modal.className = 'ah-modal';

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }

    function apiRequest(endpoint, method, body) {
        return new Promise((resolve, reject) => {
            const url = `${CONFIG.SUPABASE_URL}/functions/v1/${endpoint}`;
            console.log('[AH] Request:', method, url, body);

            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': CONFIG.SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + CONFIG.SUPABASE_ANON_KEY
                },
                data: body ? JSON.stringify(body) : undefined,
                timeout: 15000,
                onload: function(response) {
                    console.log('[AH] Response:', response.status);
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status >= 200 && response.status < 300) {
                            resolve(data);
                        } else {
                            reject(new Error(data.error || 'API error'));
                        }
                    } catch (e) {
                        reject(new Error('Parse error'));
                    }
                },
                onerror: () => reject(new Error('Network error')),
                ontimeout: () => reject(new Error('Request timeout'))
            });
        });
    }

    async function loadBonuses() {
        try {
            const data = await apiRequest('get-bonuses?type=bonuses', 'GET');
            if (data.bonuses) {
                state.bonusList = data.bonuses.sort((a, b) => a.title.localeCompare(b.title));
                data.bonuses.forEach(b => {
                    state.bonusMap[b.id] = b.title;
                    state.bonusMap[b.title.toLowerCase()] = b.id;
                    state.bonusMap[b.title.toLowerCase().replace(/[\s-]/g, '')] = b.id;
                });
            }
            console.log('[AH] Loaded', state.bonusList.length, 'bonuses');
        } catch (e) {
            console.error('[AH] Failed to load bonuses:', e);
        }
    }

    function formatPrice(p) {
        if (p >= 1e9) return '$' + (p/1e9).toFixed(2) + 'B';
        if (p >= 1e6) return '$' + (p/1e6).toFixed(2) + 'M';
        if (p >= 1e3) return '$' + (p/1e3).toFixed(1) + 'K';
        return '$' + p.toLocaleString();
    }

    function formatDate(ts) {
        const d = new Date(ts * 1000);
        const now = new Date();
        const diff = Math.floor((now - d) / 86400000);
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return diff + 'd ago';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function getBonusName(id) {
        return state.bonusMap[id] || 'Bonus #' + id;
    }

    async function doSearch() {
        state.loading = true;
        state.error = null;
        render();

        try {
            const body = {
                limit: 20,
                offset: state.offset,
                sort_by: 'timestamp',
                sort_order: 'desc'
            };

            const f = state.filters;
            if (f.itemName) body.item_name = f.itemName;

            // Bonus 1 with its own value range
            if (f.bonus1Id) {
                body.bonus1_id = parseInt(f.bonus1Id);
                if (f.bonus1Min) body.bonus1_value_min = parseFloat(f.bonus1Min);
                if (f.bonus1Max) body.bonus1_value_max = parseFloat(f.bonus1Max);
            }

            // Bonus 2 with its own value range
            if (f.bonus2Id) {
                body.bonus2_id = parseInt(f.bonus2Id);
                if (f.bonus2Min) body.bonus2_value_min = parseFloat(f.bonus2Min);
                if (f.bonus2Max) body.bonus2_value_max = parseFloat(f.bonus2Max);
            }

            if (f.qualityMin) body.quality_min = parseFloat(f.qualityMin);
            if (f.qualityMax) body.quality_max = parseFloat(f.qualityMax);

            // Check client-side cache first
            const cacheKey = JSON.stringify(body);
            const cached = searchCache.get(cacheKey);
            if (cached) {
                state.results = cached.auctions || [];
                state.total = cached.total || 0;
            } else {
                const data = await apiRequest('search-auctions', 'POST', body);
                state.results = data.auctions || [];
                state.total = data.total || 0;
                searchCache.set(cacheKey, data);
            }
        } catch (e) {
            console.error('[AH] Search error:', e);
            state.error = e.message;
            state.results = [];
            state.total = 0;
        }

        state.loading = false;
        render();
    }

    function render() {
        const overlay = document.getElementById('ah-overlay');
        const modal = document.getElementById('ah-modal');

        overlay.className = state.open ? 'ah-overlay open' : 'ah-overlay';
        modal.className = state.open ? 'ah-modal open' : 'ah-modal';

        if (!state.open) return;

        const f = state.filters;
        const bonusOptions = state.bonusList.map(b =>
            `<option value="${b.id}">${b.title}</option>`
        ).join('');

        modal.innerHTML = `
            <div class="ah-header">
                <h3 class="ah-title">Price History</h3>
                <button class="ah-close" id="ah-close">&times;</button>
            </div>
            <div class="ah-filters">
                <div class="ah-filter-row">
                    <div class="ah-field wide">
                        <label>Item Name</label>
                        <input type="text" id="ah-item-name" value="${f.itemName}" placeholder="e.g. Kodachi, AK-47">
                    </div>
                    <button class="ah-search-btn" id="ah-do-search">Search</button>
                </div>
                <div class="ah-filter-row">
                    <div class="ah-bonus-row">
                        <div class="ah-field bonus-select">
                            <label>Bonus 1</label>
                            <select id="ah-bonus1">
                                <option value="">Any</option>
                                ${bonusOptions}
                            </select>
                        </div>
                        <div class="ah-field bonus-val">
                            <label>Min</label>
                            <input type="number" id="ah-bonus1-min" value="${f.bonus1Min}" placeholder="0">
                        </div>
                        <div class="ah-field bonus-val">
                            <label>Max</label>
                            <input type="number" id="ah-bonus1-max" value="${f.bonus1Max}" placeholder="200">
                        </div>
                    </div>
                    <div class="ah-bonus-row">
                        <div class="ah-field bonus-select">
                            <label>Bonus 2</label>
                            <select id="ah-bonus2">
                                <option value="">Any</option>
                                ${bonusOptions}
                            </select>
                        </div>
                        <div class="ah-field bonus-val">
                            <label>Min</label>
                            <input type="number" id="ah-bonus2-min" value="${f.bonus2Min}" placeholder="0">
                        </div>
                        <div class="ah-field bonus-val">
                            <label>Max</label>
                            <input type="number" id="ah-bonus2-max" value="${f.bonus2Max}" placeholder="200">
                        </div>
                    </div>
                    <div class="ah-bonus-row quality">
                        <div class="ah-field bonus-val">
                            <label>Quality</label>
                            <input type="number" id="ah-quality-min" value="${f.qualityMin}" placeholder="0">
                        </div>
                        <div class="ah-field bonus-val">
                            <label>Max</label>
                            <input type="number" id="ah-quality-max" value="${f.qualityMax}" placeholder="200">
                        </div>
                    </div>
                </div>
            </div>
            <div class="ah-results">
                ${state.loading ? `
                    <div class="ah-loading"><div class="ah-spinner"></div>Searching...</div>
                ` : state.error ? `
                    <div class="ah-error">Error: ${state.error}</div>
                ` : state.results.length === 0 ? `
                    <div class="ah-empty">No matching sales found</div>
                ` : state.results.map(a => {
                    let bonusHtml = '';
                    if (a.bonus_values && a.bonus_values.length > 0) {
                        bonusHtml = a.bonus_values.map(bv =>
                            `<span class="ah-bonus">${bv.bonus_value}% ${getBonusName(bv.bonus_id)}</span>`
                        ).join('');
                    } else if (a.bonus_ids?.length) {
                        bonusHtml = a.bonus_ids.map(id => `<span class="ah-bonus">${getBonusName(id)}</span>`).join('');
                    }
                    const sellerLink = a.seller_id ? `<a href="https://www.torn.com/profiles.php?XID=${a.seller_id}" target="_blank">${a.seller_name || a.seller_id}</a>` : 'Unknown';
                    const buyerLink = a.buyer_id ? `<a href="https://www.torn.com/profiles.php?XID=${a.buyer_id}" target="_blank">${a.buyer_name || a.buyer_id}</a>` : 'Unknown';
                    return `
                    <div class="ah-item">
                        <div class="ah-item-left">
                            <p class="ah-item-name">${a.item_name}</p>
                            <p class="ah-item-meta">
                                Quality: ${a.stat_quality?.toFixed(1) || '?'}%
                                ${a.stat_damage ? ' · DMG: ' + a.stat_damage.toFixed(1) : ''}
                                ${a.stat_accuracy ? ' · ACC: ' + a.stat_accuracy.toFixed(1) : ''}
                                ${a.stat_armor ? ' · Armor: ' + a.stat_armor.toFixed(1) : ''}
                            </p>
                            ${bonusHtml ? `<div class="ah-item-bonuses">${bonusHtml}</div>` : ''}
                            <p class="ah-players">Seller: ${sellerLink} · Buyer: ${buyerLink}</p>
                        </div>
                        <div class="ah-item-right">
                            <p class="ah-price">${formatPrice(a.price)}</p>
                            <p class="ah-date">${formatDate(a.timestamp)}</p>
                        </div>
                    </div>
                `}).join('')}
            </div>
            <div class="ah-footer">
                <span>${state.total.toLocaleString()} results</span>
                <div class="ah-nav">
                    <button class="ah-nav-btn" id="ah-prev" ${state.offset === 0 ? 'disabled' : ''}>Prev</button>
                    <button class="ah-nav-btn" id="ah-next" ${state.offset + 20 >= state.total ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        `;

        // Set select values
        const bonus1El = document.getElementById('ah-bonus1');
        const bonus2El = document.getElementById('ah-bonus2');
        if (bonus1El) bonus1El.value = f.bonus1Id;
        if (bonus2El) bonus2El.value = f.bonus2Id;

        // Event listeners
        document.getElementById('ah-close').onclick = closeModal;
        document.getElementById('ah-do-search').onclick = () => {
            state.filters.itemName = document.getElementById('ah-item-name').value.trim();
            state.filters.bonus1Id = document.getElementById('ah-bonus1').value;
            state.filters.bonus1Min = document.getElementById('ah-bonus1-min').value;
            state.filters.bonus1Max = document.getElementById('ah-bonus1-max').value;
            state.filters.bonus2Id = document.getElementById('ah-bonus2').value;
            state.filters.bonus2Min = document.getElementById('ah-bonus2-min').value;
            state.filters.bonus2Max = document.getElementById('ah-bonus2-max').value;
            state.filters.qualityMin = document.getElementById('ah-quality-min').value;
            state.filters.qualityMax = document.getElementById('ah-quality-max').value;
            state.offset = 0;
            doSearch();
        };
        document.getElementById('ah-prev').onclick = () => {
            state.offset = Math.max(0, state.offset - 20);
            doSearch();
        };
        document.getElementById('ah-next').onclick = () => {
            state.offset += 20;
            doSearch();
        };
        document.getElementById('ah-item-name').onkeypress = (e) => {
            if (e.key === 'Enter') document.getElementById('ah-do-search').click();
        };
    }

    function openModal(itemName, parsedBonuses, quality) {
        console.log('[AH] Opening:', { itemName, parsedBonuses, quality });
        state.open = true;
        state.offset = 0;
        state.filters.itemName = itemName || '';

        // Set bonus 1 with its value range
        if (parsedBonuses?.[0]) {
            state.filters.bonus1Id = parsedBonuses[0].id?.toString() || '';
            const val = parsedBonuses[0].value;
            state.filters.bonus1Min = val ? Math.floor(val * 0.9).toString() : '';
            state.filters.bonus1Max = val ? Math.ceil(val * 1.1).toString() : '';
        } else {
            state.filters.bonus1Id = '';
            state.filters.bonus1Min = '';
            state.filters.bonus1Max = '';
        }

        // Set bonus 2 with its value range
        if (parsedBonuses?.[1]) {
            state.filters.bonus2Id = parsedBonuses[1].id?.toString() || '';
            const val = parsedBonuses[1].value;
            state.filters.bonus2Min = val ? Math.floor(val * 0.9).toString() : '';
            state.filters.bonus2Max = val ? Math.ceil(val * 1.1).toString() : '';
        } else {
            state.filters.bonus2Id = '';
            state.filters.bonus2Min = '';
            state.filters.bonus2Max = '';
        }

        // Quality ±10%
        state.filters.qualityMin = quality ? Math.floor(quality * 0.9).toString() : '';
        state.filters.qualityMax = quality ? Math.ceil(quality * 1.1).toString() : '';

        state.results = [];
        state.total = 0;
        render();
        doSearch();
    }

    function closeModal() {
        state.open = false;
        render();
    }

    // Detect current page type
    function getPageType() {
        const url = window.location.href;
        if (url.includes('amarket.php')) return 'auction';
        if (url.includes('sid=ItemMarket')) return 'itemmarket';
        if (url.includes('item.php')) return 'inventory';
        if (url.includes('bazaar.php')) return 'bazaar';
        if (url.includes('displaycase.php')) return 'displaycase';
        return 'unknown';
    }

    // Check if item has auction-eligible rarity (Yellow, Orange, Red quality OR extraordinary circulation rarity)
    function hasAuctionRarity(container) {
        // Check for quality rarity (Yellow, Orange, Red)
        const rarityEl = container.querySelector('[class*="rarity___"]');
        if (rarityEl) {
            const className = rarityEl.className.toLowerCase();
            const text = rarityEl.textContent.toLowerCase();
            if (className.includes('yellow') || className.includes('orange') || className.includes('red') ||
                text.includes('yellow') || text.includes('orange') || text.includes('red')) {
                return true;
            }
        }

        // Check for rare circulation rarity (very rare items that can be auctioned)
        const rareIcon = container.querySelector('.extraordinary-rarity-icon, .extremely-rare-rarity-icon, [class*="extraordinary"], [class*="extremely-rare"]');
        if (rareIcon) {
            return true;
        }

        return false;
    }

    // Parse item data from auction house row
    function parseAuctionRow(row) {
        let itemName = '';
        let parsedBonuses = [];
        let quality = null;

        const nameEl = row.querySelector('.item-name');
        if (nameEl) {
            itemName = nameEl.textContent.trim();
        }

        const bonusTextEl = row.querySelector('.title p.t-gray-6');
        if (bonusTextEl) {
            const bonusLines = bonusTextEl.innerHTML.split(/<br\s*\/?>/i);
            for (const line of bonusLines) {
                const text = line.trim();
                let bonusValue = null;
                let bonusName = null;

                // Try to match with numeric value: "22% Specialist" or "3 T Disarm"
                const matchWithValue = text.match(/([\d.]+)\s*(%|T)\s+(.+)/i);
                if (matchWithValue) {
                    bonusValue = parseFloat(matchWithValue[1]);
                    bonusName = matchWithValue[3].trim();
                } else if (text && !text.match(/^\d/)) {
                    // No number at start - treat whole text as bonus name (e.g., "Irradiate")
                    bonusName = text;
                }

                if (bonusName) {
                    const bonusNameKey = bonusName.toLowerCase().replace(/[\s-]/g, '');
                    let bonusId = state.bonusMap[bonusNameKey];
                    if (!bonusId) {
                        bonusId = state.bonusMap[bonusName.toLowerCase()];
                    }
                    if (bonusId) {
                        parsedBonuses.push({ id: bonusId, value: bonusValue });
                    }
                }
            }
        }

        const expandedInfo = row.querySelector('.show-item-info');
        if (expandedInfo) {
            const qualitySpan = expandedInfo.querySelector('span[aria-label*="Quality"]');
            if (qualitySpan) {
                const ariaLabel = qualitySpan.getAttribute('aria-label') || '';
                const match = ariaLabel.match(/([\d.]+)%?\s*Quality/i);
                if (match) {
                    quality = parseFloat(match[1]);
                }
            }

            if (!quality) {
                const titles = expandedInfo.querySelectorAll('.title___DbORn, [class*="title"]');
                for (const title of titles) {
                    if (title.textContent.trim() === 'Quality:') {
                        const valueEl = title.parentElement?.querySelector('[aria-label*="Quality"], span[aria-hidden="true"]');
                        if (valueEl) {
                            const text = valueEl.textContent || valueEl.getAttribute('aria-label') || '';
                            const match = text.match(/([\d.]+)%/);
                            if (match) {
                                quality = parseFloat(match[1]);
                            }
                        }
                        break;
                    }
                }
            }
        }

        console.log('[AH] Parsed auction:', { itemName, parsedBonuses, quality });
        return { itemName, parsedBonuses, quality };
    }

    // Parse item data from item market
    function parseItemMarketRow(container) {
        let itemName = '';
        let parsedBonuses = [];
        let quality = null;

        // Get item name from description bold text
        const nameEl = container.querySelector('.description___xJ1N5 .bold');
        if (nameEl) {
            itemName = nameEl.textContent.trim();
            // Remove "The " prefix if present (e.g., "The Riot Body" -> "Riot Body")
            itemName = itemName.replace(/^The\s+/i, '');
        }

        // Get all property wrappers (use li elements to avoid duplicates)
        const properties = container.querySelectorAll('li.propertyWrapper___xSOH1');
        for (const prop of properties) {
            const titleEl = prop.querySelector('.title___DbORn');
            if (!titleEl) continue;
            const title = titleEl.textContent.trim();

            if (title === 'Quality:') {
                const valueEl = prop.querySelector('[aria-label*="Quality"]');
                if (valueEl) {
                    const match = valueEl.getAttribute('aria-label')?.match(/([\d.]+)%?\s*Quality/i);
                    if (match) {
                        quality = parseFloat(match[1]);
                    }
                }
            }

            if (title === 'Bonus:') {
                const valueEl = prop.querySelector('[aria-label*="Bonus"]');
                if (valueEl) {
                    const ariaLabel = valueEl.getAttribute('aria-label') || '';
                    // Parse bonuses with values: "20% Impregnable Bonus" or "3 T Disarm Bonus"
                    // Also parse bonuses without values: " Irradiate Bonus"
                    let bonusValue = null;
                    let bonusName = null;

                    // Try to match with numeric value first
                    const matchWithValue = ariaLabel.match(/([\d.]+)\s*(%|T)?\s*(.+?)\s*Bonus/i);
                    if (matchWithValue) {
                        bonusValue = parseFloat(matchWithValue[1]);
                        bonusName = matchWithValue[3].trim();
                    } else {
                        // Try to match without numeric value (e.g., " Irradiate Bonus")
                        const matchNoValue = ariaLabel.match(/^\s*(.+?)\s*Bonus/i);
                        if (matchNoValue) {
                            bonusName = matchNoValue[1].trim();
                        }
                    }

                    if (bonusName) {
                        const bonusNameKey = bonusName.toLowerCase().replace(/[\s-]/g, '');
                        let bonusId = state.bonusMap[bonusNameKey];
                        if (!bonusId) {
                            bonusId = state.bonusMap[bonusName.toLowerCase()];
                        }
                        if (bonusId) {
                            parsedBonuses.push({ id: bonusId, value: bonusValue });
                        }
                        console.log('[AH] Found bonus:', bonusName, bonusValue, bonusId);
                    }
                }
            }
        }

        console.log('[AH] Parsed item market:', { itemName, parsedBonuses, quality });
        return { itemName, parsedBonuses, quality };
    }

    function injectButtons() {
        const pageType = getPageType();

        if (pageType === 'auction') {
            injectAuctionButtons();
        } else if (pageType === 'itemmarket') {
            injectItemMarketButtons();
        } else if (pageType === 'inventory' || pageType === 'displaycase') {
            // Inventory and display case have identical DOM structure
            injectInventoryButtons();
        } else if (pageType === 'bazaar') {
            injectBazaarButtons();
        }
    }

    function injectAuctionButtons() {
        const allLis = document.querySelectorAll('li');
        Array.from(allLis).forEach(li => {
            if (!li.querySelector('.item-cont-wrap')) return;

            const expandedInfo = li.querySelector('.show-item-info');
            if (!expandedInfo || expandedInfo.style.display === 'none') {
                const existingBtn = li.querySelector('.ah-btn');
                if (existingBtn) existingBtn.remove();
                return;
            }

            if (li.querySelector('.ah-btn')) return;

            const btn = document.createElement('button');
            btn.className = 'ah-btn';
            btn.textContent = 'Price Check';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const data = parseAuctionRow(li);
                openModal(data.itemName, data.parsedBonuses, data.quality);
            };

            const descWrapper = expandedInfo.querySelector('.descriptionWrapper___Lh0y0');
            if (descWrapper) {
                descWrapper.style.position = 'relative';
                descWrapper.appendChild(btn);
            } else {
                expandedInfo.appendChild(btn);
            }
        });
    }

    function injectItemMarketButtons() {
        // Find item info containers in the item market
        const containers = document.querySelectorAll('.itemInfoWrapper___nA_eu, [class*="itemInfo___"]');
        Array.from(containers).forEach(container => {
            // Skip if button already exists
            if (container.querySelector('.ah-btn')) return;

            // Only show button for Yellow, Orange, Red rarity items
            if (!hasAuctionRarity(container)) return;

            const btn = document.createElement('button');
            btn.className = 'ah-btn';
            btn.textContent = 'Price Check';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const data = parseItemMarketRow(container);
                openModal(data.itemName, data.parsedBonuses, data.quality);
            };

            // Place button in description wrapper
            const descWrapper = container.querySelector('.descriptionWrapper___Lh0y0');
            if (descWrapper) {
                descWrapper.style.position = 'relative';
                descWrapper.appendChild(btn);
            } else {
                // Fallback: place in item-info div
                const itemInfo = container.querySelector('[class*="itemInfo___"]') || container;
                itemInfo.style.position = 'relative';
                itemInfo.appendChild(btn);
            }
        });
    }

    function injectInventoryButtons() {
        // Find expanded item info in inventory (li.show-item-info)
        const containers = document.querySelectorAll('li.show-item-info');
        Array.from(containers).forEach(container => {
            // Skip if button already exists
            if (container.querySelector('.ah-btn')) return;

            // Only show button for Yellow, Orange, Red rarity items
            if (!hasAuctionRarity(container)) return;

            const btn = document.createElement('button');
            btn.className = 'ah-btn';
            btn.textContent = 'Price Check';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Reuse item market parser - same DOM structure
                const data = parseItemMarketRow(container);
                openModal(data.itemName, data.parsedBonuses, data.quality);
            };

            // Place button in description wrapper
            const descWrapper = container.querySelector('.descriptionWrapper___Lh0y0');
            if (descWrapper) {
                descWrapper.style.position = 'relative';
                descWrapper.appendChild(btn);
            } else {
                const itemInfo = container.querySelector('[class*="itemInfo___"]') || container;
                itemInfo.style.position = 'relative';
                itemInfo.appendChild(btn);
            }
        });
    }

    function injectBazaarButtons() {
        // Find expanded item info in bazaar (div.info___liccG.show-item-info or div.show-item-info)
        const containers = document.querySelectorAll('div.show-item-info, [class*="info___"].show-item-info');
        Array.from(containers).forEach(container => {
            // Skip if button already exists
            if (container.querySelector('.ah-btn')) return;

            // Only show button for Yellow, Orange, Red rarity items
            if (!hasAuctionRarity(container)) return;

            const btn = document.createElement('button');
            btn.className = 'ah-btn';
            btn.textContent = 'Price Check';
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Reuse item market parser - same DOM structure
                const data = parseItemMarketRow(container);
                openModal(data.itemName, data.parsedBonuses, data.quality);
            };

            // Place button in description wrapper
            const descWrapper = container.querySelector('.descriptionWrapper___Lh0y0');
            if (descWrapper) {
                descWrapper.style.position = 'relative';
                descWrapper.appendChild(btn);
            } else {
                const itemInfo = container.querySelector('[class*="itemInfo___"]') || container;
                itemInfo.style.position = 'relative';
                itemInfo.appendChild(btn);
            }
        });
    }

    function observe() {
        const observer = new MutationObserver(() => setTimeout(injectButtons, 200));
        observer.observe(document.body, { childList: true, subtree: true });
    }

    async function init() {
        console.log('[AH] Initializing...');
        createModal();
        await loadBonuses();
        injectButtons();
        observe();
        setInterval(injectButtons, 2000);
        console.log('[AH] Ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
