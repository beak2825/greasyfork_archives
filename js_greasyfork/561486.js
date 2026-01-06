// ==UserScript==
// @name          Bazaar Scanner Holy grail by srsbsns
// @namespace     https://weav3r.dev/
// @version       4.0.0
// @description   Shows bazaar deals with NPC profit - click item eye button to see profitable deals
// @author        Modified for NPC Profit
// @match         https://www.torn.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @connect       weav3r.dev
// @connect       tornexchange.com
// @connect       api.torn.com
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/561486/Bazaar%20Scanner%20Holy%20grail%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/561486/Bazaar%20Scanner%20Holy%20grail%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global State
    window._visitedBazaars = new Set();
    window._cachedListings = {};
    window._marketValueCache = {};

    // NPC Price Storage
    const S_KEY = 'torn_arbiter_api_key';
    const S_CAT = 'torn_arbiter_catalog';
    let npcPrices = {};

    GM_addStyle(`
        /* Sidebar Container */
        #bazaar-sidebar {
            position: fixed;
            left: 10px;
            top: 80px;
            width: 180px;
            background: #1a1a1a;
            border: 2px solid #1E3078;
            border-radius: 8px;
            padding: 12px;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        #bazaar-sidebar.dragging {
            cursor: grabbing;
            user-select: none;
        }

        #bazaar-sidebar::-webkit-scrollbar {
            width: 8px;
        }

        #bazaar-sidebar::-webkit-scrollbar-thumb {
            background: #1E078A;
            border-radius: 4px;
        }

        /* Header */
        .bz-header {
            font-size: 16px;
            font-weight: bold;
            color: #FFD700;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid #FFD700;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: grab;
            user-select: none;
        }

        .bz-header:active {
            cursor: grabbing;
        }

        .bz-item-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #FFF;
        }

        .bz-close-btn {
            background: #d9534f;
            border: none;
            color: white;
            padding: 4px 10px;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            margin-left: 8px;
        }

        .bz-close-btn:hover {
            background: #c9302c;
        }

        /* NPC Info */
        .bz-npc-info {
            font-size: 13px;
            color: #aaa;
            margin-bottom: 10px;
            padding: 8px;
            background: #252525;
            border-radius: 4px;
            border: 1px solid #FFD700;
        }

        .bz-npc-price {
            color: #FFD700;
            font-weight: bold;
        }

        .bz-profit-notice {
            color: #00FF00;
            font-weight: bold;
            margin-top: 4px;
            font-size: 12px;
        }

        /* Market Info */
        .bz-market-info {
            font-size: 13px;
            color: #aaa;
            margin-bottom: 10px;
            padding: 6px;
            background: #252525;
            border-radius: 4px;
        }

        .bz-market-value {
            color: #87CEEB;
            font-weight: bold;
        }

        .bz-best-trader {
            color: #FFA500;
            font-weight: bold;
            margin-top: 4px;
        }

        .bz-best-price {
            color: #00FF00;
            font-weight: bold;
        }

        /* Listings */
        .bz-listings-title {
            font-size: 14px;
            font-weight: bold;
            color: #FFF;
            margin: 12px 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #FFD700;
        }

        .bz-listing {
            background: #252525;
            border: 2px solid #444;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .bz-listing.profitable {
            border-color: #3A1CD4;
            background: linear-gradient(135deg, #1a3d1a 0%, #252525 100%);
        }

        .bz-listing:hover {
            background: #2a2a2a;
            border-color: #FFD700;
            transform: translateX(4px);
        }

        .bz-listing.visited {
            opacity: 0.6;
        }

        .bz-listing.visited a {
            color: #800080 !important;
        }

        .bz-player-name {
            font-weight: bold;
            color: #1E90FF;
            font-size: 14px;
            text-decoration: none;
            display: block;
            margin-bottom: 4px;
        }

        .bz-player-name:hover {
            text-decoration: underline;
        }

        .bz-listing-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
        }

        .bz-price {
            color: #00FF00;
            font-weight: bold;
            font-size: 15px;
        }

        .bz-qty {
            color: #aaa;
        }

        .bz-profit {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 12px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            background: rgba(0,0,0,0.5);
        }

        .bz-profit.npc-profit {
            background: linear-gradient(135deg, #00FF00 0%, #00AA00 100%);
            color: #000;
            box-shadow: 0 2px 6px rgba(0, 255, 0, 0.4);
            animation: pulse 1.5s infinite;
        }

        .bz-profit.npc-profit.big {
            background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%);
            color: #FFF;
            animation: pulse 1s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }

        .bz-profit.positive {
            color: #00FF00;
        }

        .bz-profit.negative {
            color: #FF4444;
        }

        .bz-profit.neutral {
            color: #FFD700;
        }

        /* Loading */
        .bz-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #aaa;
        }

        .bz-spinner {
            border: 3px solid #333;
            border-top: 3px solid #FFD700;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Empty State */
        .bz-empty {
            text-align: center;
            padding: 20px;
            color: #888;
            font-style: italic;
        }

        .bz-no-profit {
            text-align: center;
            padding: 20px;
            color: #FFA500;
            background: #2a2a1a;
            border-radius: 6px;
            border: 1px solid #FFA500;
        }

        /* TE Link */
        .bz-te-link {
            display: block;
            text-align: center;
            margin-top: 10px;
            padding: 8px;
            background: #1a4d6f;
            border-radius: 4px;
            color: #00BFFF;
            text-decoration: none;
            font-weight: bold;
            font-size: 13px;
        }

        .bz-te-link:hover {
            background: #2a5d7f;
        }
    `);

    // Fetch NPC prices from Torn API
    async function fetchNPCCatalog() {
        const key = GM_getValue(S_KEY, '');
        if (!key) {
            const inputKey = prompt('Enter your Torn API Key for NPC Profit tracking:');
            if (inputKey) {
                GM_setValue(S_KEY, inputKey.trim());
                return fetchNPCCatalog();
            }
            return null;
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/torn/?selections=items&key=${key}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.items) {
                            const catalog = {};
                            for (const id in data.items) {
                                catalog[id] = data.items[id].sell_price || 0;
                            }
                            GM_setValue(S_CAT, JSON.stringify(catalog));
                            resolve(catalog);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                }
            });
        });
    }

    // Fetch Torn Exchange data
    async function fetchTornExchangeData(itemId) {
        return new Promise((resolve) => {
            const cached = window._marketValueCache[itemId];
            if (cached) {
                resolve(cached);
                return;
            }

            // Fetch both price and best listing
            Promise.all([
                new Promise(res => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://tornexchange.com/api/te_price?item_id=${itemId}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.status === 'success' && data.data && data.data.te_price) {
                                    res(parseFloat(data.data.te_price));
                                } else {
                                    res(null);
                                }
                            } catch (e) {
                                res(null);
                            }
                        },
                        onerror: () => res(null)
                    });
                }),
                new Promise(res => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://tornexchange.com/api/best_listing?item_id=${itemId}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.status === 'success' && data.data) {
                                    res(data.data);
                                } else {
                                    res(null);
                                }
                            } catch (e) {
                                res(null);
                            }
                        },
                        onerror: () => res(null)
                    });
                })
            ]).then(([marketValue, bestBuyer]) => {
                const result = { marketValue, bestBuyer };
                window._marketValueCache[itemId] = result;
                resolve(result);
            });
        });
    }

    // Fetch bazaar listings
    async function fetchBazaarListings(itemId) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://weav3r.dev/api/marketplace/${itemId}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data && data.listings) {
                            resolve(data.listings);
                        } else {
                            resolve([]);
                        }
                    } catch (e) {
                        console.error('Error parsing bazaar data:', e);
                        resolve([]);
                    }
                },
                onerror: () => {
                    console.error('Error fetching bazaar listings');
                    resolve([]);
                }
            });
        });
    }

    // Create sidebar
    function createSidebar() {
        let sidebar = document.getElementById('bazaar-sidebar');
        if (!sidebar) {
            sidebar = document.createElement('div');
            sidebar.id = 'bazaar-sidebar';
            document.body.appendChild(sidebar);
            makeDraggable(sidebar);
        }
        return sidebar;
    }

    // Make sidebar draggable
    function makeDraggable(sidebar) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        sidebar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.closest('.bz-header') && !e.target.closest('.bz-close-btn')) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                sidebar.classList.add('dragging');
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;

                const rect = sidebar.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                xOffset = Math.max(0, Math.min(xOffset, maxX));
                yOffset = Math.max(0, Math.min(yOffset, maxY));

                sidebar.style.left = xOffset + 'px';
                sidebar.style.top = yOffset + 'px';
            }
        }

        function dragEnd() {
            if (isDragging) {
                isDragging = false;
                sidebar.classList.remove('dragging');
            }
        }
    }

    function showLoading(sidebar) {
        sidebar.innerHTML = `
            <div class="bz-header">
                <span class="bz-item-name">Loading...</span>
            </div>
            <div class="bz-loading">
                <div class="bz-spinner"></div>
                Fetching deals...
            </div>
        `;
    }

    function renderSidebar(itemName, itemId, marketValue, bestBuyer, listings) {
        const sidebar = createSidebar();

        // Get NPC price - handle both object format and number format
        const npcData = npcPrices[itemId];
        let npcPrice = 0;

        if (typeof npcData === 'object' && npcData !== null) {
            // Old format: {name: "Item", npcPrice: 123}
            npcPrice = npcData.npcPrice || 0;
        } else if (typeof npcData === 'number') {
            // New format: just the number
            npcPrice = npcData;
        }

        console.log('NPC Profit:', itemName, '- NPC Price:', npcPrice);

        // Filter and sort by NPC profit
        const profitableListings = [];
        const otherListings = [];

        listings.forEach(listing => {
            const price = parseFloat(listing.price.toString().replace(/,/g, ''));
            const profit = npcPrice - price;

            if (profit > 0 && npcPrice > 0) {
                profitableListings.push({ ...listing, npcProfit: profit });
            } else {
                otherListings.push(listing);
            }
        });

        // Sort profitable by highest profit first
        profitableListings.sort((a, b) => b.npcProfit - a.npcProfit);

        // Sort other listings by lowest price
        otherListings.sort((a, b) => {
            const priceA = parseFloat(a.price.toString().replace(/,/g, ''));
            const priceB = parseFloat(b.price.toString().replace(/,/g, ''));
            return priceA - priceB;
        });

        // Combine: profitable deals first, then cheapest regular deals
        const sortedListings = [...profitableListings.slice(0, 5), ...otherListings.slice(0, 5)];
        const top5 = sortedListings.slice(0, 5);

        // NPC Info - Always show if we have NPC prices loaded
        let npcInfoHTML = '';
        if (Object.keys(npcPrices).length > 0) {
            if (npcPrice > 0) {
                const profitCount = profitableListings.length;
                npcInfoHTML = `
                    <div class="bz-npc-info">
                        NPC Sell Price: <span class="bz-npc-price">$${npcPrice.toLocaleString()}</span>
                        ${profitCount > 0 ? `<div class="bz-profit-notice">🎉 ${profitCount} profitable deal(s) found!</div>` : ''}
                    </div>
                `;
            } else {
                npcInfoHTML = `
                    <div class="bz-npc-info" style="border-color: #888; color: #888;">
                        ℹ️ No NPC price available for this item
                    </div>
                `;
            }
        } else {
            npcInfoHTML = `
                <div class="bz-npc-info" style="border-color: #FF4444; color: #FF4444;">
                    ⚠️ NPC prices not loaded. Please refresh the page or check your API key.
                </div>
            `;
        }

        // Market Info
        let marketInfoHTML = '';
        if (marketValue) {
            marketInfoHTML = `
                <div class="bz-market-info">
                    Market Value: <span class="bz-market-value">$${marketValue.toLocaleString()}</span>
            `;

            if (bestBuyer && bestBuyer.trader) {
                marketInfoHTML += `
                    <div class="bz-best-trader">
                        Best Trader: <span class="bz-best-price">$${Math.round(bestBuyer.price).toLocaleString()}</span> by ${bestBuyer.trader}
                    </div>
                `;
            }

            marketInfoHTML += `</div>`;
        }

        let listingsHTML = '';
        if (top5.length > 0) {
            const title = profitableListings.length > 0 ?
                '💰 NPC Profitable Deals First' :
                '📊 Best Bazaar Deals';

            listingsHTML = `<div class="bz-listings-title">${title}</div>`;

            top5.forEach(listing => {
                const priceNum = parseFloat(listing.price.toString().replace(/,/g, ''));
                const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
                const isVisited = window._visitedBazaars.has(listing.player_id);
                const visitedClass = isVisited ? 'visited' : '';

                const isProfitable = listing.npcProfit && listing.npcProfit > 0;
                const profitableClass = isProfitable ? 'profitable' : '';

                let profitHTML = '';
                if (isProfitable) {
                    const tierClass = listing.npcProfit >= 500 ? 'big' : '';
                    profitHTML = `<span class="bz-profit npc-profit ${tierClass}">NPC +$${listing.npcProfit.toLocaleString()}</span>`;
                } else if (marketValue) {
                    const diff = priceNum - marketValue;
                    const percent = ((diff / marketValue) * 100).toFixed(1);
                    const sign = diff > 0 ? '+' : '';
                    let profitClass = 'neutral';
                    if (percent < -0.5) profitClass = 'positive';
                    else if (percent > 0.5) profitClass = 'negative';

                    profitHTML = `<span class="bz-profit ${profitClass}">${sign}${percent}%</span>`;
                }

                const bazaarLink = `https://www.torn.com/bazaar.php?userId=${listing.player_id}&highlightItem=${itemId}#/`;

                listingsHTML += `
                    <div class="bz-listing ${visitedClass} ${profitableClass}" data-player-id="${listing.player_id}" data-url="${bazaarLink}">
                        ${profitHTML}
                        <a href="${bazaarLink}" target="_blank" class="bz-player-name" onclick="event.stopPropagation()">
                            ${listing.player_name || 'Unknown'}
                        </a>
                        <div class="bz-listing-details">
                            <span class="bz-price">${formattedPrice}</span>
                            <span class="bz-qty">Qty: ${listing.quantity}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            listingsHTML = '<div class="bz-empty">No bazaar listings found</div>';
        }

        // Show notice if no profitable deals
        if (npcPrice > 0 && profitableListings.length === 0 && listings.length > 0) {
            listingsHTML += `
                <div class="bz-no-profit">
                    ℹ️ No deals below NPC price found.<br>
                    <small>Showing cheapest bazaar listings instead.</small>
                </div>
            `;
        }

        const encodedItemName = encodeURIComponent(itemName);
        const teLink = `https://tornexchange.com/listings?model_name_contains=${encodedItemName}&order_by=&status=`;

        sidebar.innerHTML = `
            <div class="bz-header">
                <span class="bz-item-name">${itemName}</span>
                <button class="bz-close-btn">✕</button>
            </div>
            ${npcInfoHTML}
            ${marketInfoHTML}
            ${listingsHTML}
            <a href="${teLink}" target="_blank" class="bz-te-link">View All TE Listings</a>
        `;

        // Add click handlers
        sidebar.querySelectorAll('.bz-listing').forEach(listing => {
            listing.addEventListener('click', function() {
                const playerId = this.dataset.playerId;
                const url = this.dataset.url;
                if (playerId) {
                    window._visitedBazaars.add(playerId);
                    this.classList.add('visited');
                    const link = this.querySelector('a');
                    if (link) link.style.color = '#800080';
                }
                window.open(url, '_blank');
            });
        });

        sidebar.querySelector('.bz-close-btn').addEventListener('click', () => {
            sidebar.remove();
        });
    }

    // Main Process
    async function processItem(itemName, itemId) {
        const sidebar = createSidebar();
        showLoading(sidebar);

        const [teData, listings] = await Promise.all([
            fetchTornExchangeData(itemId),
            fetchBazaarListings(itemId)
        ]);

        window._cachedListings[itemId] = listings;

        renderSidebar(
            itemName,
            itemId,
            teData.marketValue,
            teData.bestBuyer,
            listings
        );
    }

    // Hook into item clicks
    function attachListeners() {
        const observer = new MutationObserver(() => {
            // Look for item tiles
            document.querySelectorAll('[class*="itemTile"]').forEach(tile => {
                if (tile.dataset.bazaarHooked) return;
                tile.dataset.bazaarHooked = 'true';

                const btn = tile.querySelector('button[aria-controls*="itemInfo"]');
                if (!btn) return;

                btn.addEventListener('click', () => {
                    setTimeout(() => {
                        const nameEl = tile.querySelector('div[class*="name"]');
                        if (!nameEl) return;

                        const itemName = nameEl.textContent.trim();
                        const idParts = btn.getAttribute('aria-controls').split('-');
                        const itemId = idParts[idParts.length - 1];
                        if (window.BZ_FAVOURITES && typeof window.BZ_FAVOURITES.save === 'function') {
                        window.BZ_FAVOURITES.save(itemId, itemName);
}

                        processItem(itemName, itemId);
                    }, 100);
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    setTimeout(async () => {
        // Load NPC catalog
        const cachedCatalog = GM_getValue(S_CAT, '');
        if (cachedCatalog) {
            npcPrices = JSON.parse(cachedCatalog);
            console.log('NPC Profit: Loaded', Object.keys(npcPrices).length, 'items from cache');
        } else {
            console.log('NPC Profit: Fetching catalog from API...');
            const catalog = await fetchNPCCatalog();
            if (catalog) {
                npcPrices = catalog;
                console.log('NPC Profit: Loaded', Object.keys(npcPrices).length, 'items from API');
            } else {
                console.error('NPC Profit: Failed to load catalog');
            }
        }

        attachListeners();
    }, 2000);
    window.processItem = processItem;

})();

// Green Highlight (unchanged)
(function() {
    const params = new URLSearchParams(window.location.search);
    const itemIdToHighlight = params.get('highlightItem');
    if (!itemIdToHighlight) return;

    const observer = new MutationObserver(() => {
        const imgs = document.querySelectorAll('img');
        imgs.forEach(img => {
            if (img.src.includes(`/images/items/${itemIdToHighlight}/`)) {
                img.closest('div')?.style.setProperty('outline', '3px solid green', 'important');
                img.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
// =====================================================
// BAZAAR FAVOURITES MODULE (ESLint-clean, additive only)
// =====================================================
(function () {
    'use strict';

    const FAV_KEY = 'bz_favourite_items';

    function getAll() {
        return GM_getValue(FAV_KEY, {});
    }

    function save(id, name) {
        const favs = getAll();
        if (!favs[id]) {
            favs[id] = { id, name };
            GM_setValue(FAV_KEY, favs);
            render();
        }
    }

    function remove(id) {
        const favs = getAll();
        delete favs[id];
        GM_setValue(FAV_KEY, favs);
        render();
    }

    // ---------- UI ----------
    function createUI() {
        if (document.getElementById('bz-fav-btn')) return;

        GM_addStyle(`
            #bz-fav-btn {
                position: fixed;
                right: 10px;
                top: 80px;
                width: 44px;
                height: 44px;
                background: #FFD700;
                color: #000;
                font-weight: bold;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
            }

            #bz-fav-panel {
                position: fixed;
                right: 50px;
                top: 10px;
                width: 144px;
                background: #1a1a1a;
                border: 2px solid #FFD700;
                border-radius: 8px;
                padding: 10px;
                color: #fff;
                display: none;
                z-index: 9999;
                max-height: 575px;        /* Limits the height of the box */
                overflow-y: auto;         /* Adds a vertical scrollbar when needed */
                overflow-x: hidden;       /* Prevents accidental horizontal shifting */

#bz-fav-panel::-webkit-scrollbar {
    width: 6px;
}

#bz-fav-panel::-webkit-scrollbar-thumb {
    background: #FFD700;
    border-radius: 3px;
}

#bz-fav-panel::-webkit-scrollbar-track {
    background: #1a1a1a;
}
            }

            .bz-fav-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px;
                border-bottom: 1px solid #333;
                cursor: pointer;
            }

            .bz-fav-item:hover {
                background: #2a2a2a;
            }

            .bz-fav-remove {
                color: #FF4444;
                font-weight: bold;
                cursor: pointer;
                margin-left: 8px;
            }
        `);

        const btn = document.createElement('div');
        btn.id = 'bz-fav-btn';
        btn.textContent = '⭐';

        const panel = document.createElement('div');
        panel.id = 'bz-fav-panel';

        btn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
            render();
        });

        document.body.appendChild(btn);
        document.body.appendChild(panel);
    }

    function render() {
        const panel = document.getElementById('bz-fav-panel');
        if (!panel) return;

        const favs = Object.values(getAll());
        if (favs.length === 0) {
            panel.innerHTML = `<div style="text-align:center;color:#888;">No favourites saved</div>`;
            return;
        }

        panel.innerHTML = favs.map(f =>
            `<div class="bz-fav-item" data-id="${f.id}">
                <span>${f.name}</span>
                <span class="bz-fav-remove">✕</span>
            </div>`
        ).join('');

        panel.querySelectorAll('.bz-fav-item').forEach(el => {
            const id = el.dataset.id;
            const name = el.querySelector('span').textContent;

            el.addEventListener('click', e => {
                if (e.target.classList.contains('bz-fav-remove')) {
                    remove(id);
                    e.stopPropagation();
                    return;
                }

                if (typeof window.processItem === 'function') {
                    window.processItem(name, id);
                }
            });
        });
    }

    // ---------- INIT ----------
   function waitForBodyAndInit() {
    if (document.body) {
        createUI();
    } else {
        setTimeout(waitForBodyAndInit, 250);
    }
}

waitForBodyAndInit();



    // ---------- PUBLIC API ----------
    window.BZ_FAVOURITES = {
        save,
        remove
    };

})();
