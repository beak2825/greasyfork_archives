// ==UserScript==
// @name          Bazaar Scanner GOD MODE
// @namespace     https://weav3r.dev/
// @version       5.4
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
// @downloadURL https://update.greasyfork.org/scripts/562043/Bazaar%20Scanner%20GOD%20MODE.user.js
// @updateURL https://update.greasyfork.org/scripts/562043/Bazaar%20Scanner%20GOD%20MODE.meta.js
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
            top: 20px;
            width: 180px;
            background: #1a1a1a;
            border: 2px solid #696969;
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
            background: #292929;
            border-radius: 4px;
        }

        /* Header */
        .bz-header {
            font-size: 16px;
            font-weight: bold;
            color: #001975;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid #6E6E6E;
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
            background: #A33C39;
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
            background: #9E2724;
        }

        /* NPC Info */
        .bz-npc-info {
            font-size: 13px;
            color: #aaa;
            margin-bottom: 10px;
            padding: 8px;
            background: #252525;
            border-radius: 4px;
            border: 1px solid #6E6E6E;
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

        /* Toggle switch container */
        .bz-toggle-container {
            padding: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 10px;
            background: #252525;
            border-radius: 4px;
            border: 1px solid #6E6E6E;
        }

        .bz-toggle-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            user-select: none;
        }

        .bz-toggle-input {
            display: none;
        }

        .bz-toggle-slider {
            position: relative;
            width: 40px;
            height: 20px;
            background-color: #555;
            border-radius: 10px;
            transition: background-color 0.3s;
        }

        .bz-toggle-slider::before {
            content: '';
            position: absolute;
            width: 14px;
            height: 14px;
            left: 3px;
            top: 3px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }

        .bz-toggle-input:checked + .bz-toggle-slider {
            background-color: #4CAF50;
        }

        .bz-toggle-input:checked + .bz-toggle-slider::before {
            transform: translateX(20px);
        }

        .bz-toggle-text {
            font-size: 12px;
            font-weight: 500;
            color: #fff;
            min-width: 80px;
        }

        /* Listings */
        .bz-listings-title {
            font-size: 14px;
            font-weight: bold;
            color: #FFF;
            margin: 12px 0 8px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #6E6E6E;
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

        /* Scan All Results Styles */
        .bz-scan-item-header {
            background: #202966;
            color: #FFD700;
            padding: 6px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 8px;
            border-radius: 4px;
            border-left: 3px solid #FFD700;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .bz-scan-item-header:hover {
            background: #2a3476;
        }

        .bz-scan-item-name {
            flex: 1;
        }

        .bz-scan-best-profit {
            color: #00FF00;
            font-size: 11px;
            margin-left: 8px;
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
            npcPrice = npcData.npcPrice || 0;
        } else if (typeof npcData === 'number') {
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

        // Initialize with default view (NPC deals)
        let showNPCDeals = true;

        function updateListings() {
            let sortedListings;
            if (showNPCDeals) {
                // Combine: profitable deals first, then cheapest regular deals
                sortedListings = [...profitableListings.slice(0, 20), ...otherListings.slice(0, 20)];
            } else {
                // Just show all by price (market value comparison)
                sortedListings = otherListings.slice(0, 20);
            }
            const top5 = sortedListings.slice(0, 20);

            let listingsHTML = '';
            if (top5.length > 0) {
                const title = showNPCDeals && profitableListings.length > 0 ?
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
                    if (showNPCDeals && isProfitable) {
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

                    const bazaarLink = `https://www.torn.com/bazaar.php?userId=${listing.player_id}#/`;

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

            // Show notice if no profitable deals when in NPC mode
            if (showNPCDeals && npcPrice > 0 && profitableListings.length === 0 && listings.length > 0) {
                listingsHTML += `
                    <div class="bz-no-profit">
                        ℹ️ No deals below NPC price found.<br>
                        <small>Showing cheapest bazaar listings instead.</small>
                    </div>
                `;
            }

            // Update the listings container
            const listingsContainer = sidebar.querySelector('.bz-listings-container');
            if (listingsContainer) {
                listingsContainer.innerHTML = listingsHTML;

                // Re-attach click handlers to new listings
                listingsContainer.querySelectorAll('.bz-listing').forEach(listing => {
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
            }
        }

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

        // Toggle switch HTML
        const toggleHTML = `
            <div class="bz-toggle-container">
                <label class="bz-toggle-label">
                    <input type="checkbox" class="bz-toggle-input" ${showNPCDeals ? 'checked' : ''}>
                    <span class="bz-toggle-slider"></span>
                    <span class="bz-toggle-text">${showNPCDeals ? 'NPC Deals' : 'Market Deals'}</span>
                </label>
            </div>
        `;

        const encodedItemName = encodeURIComponent(itemName);
        const teLink = `https://tornexchange.com/listings?model_name_contains=${encodedItemName}&order_by=&status=`;

        sidebar.innerHTML = `
            <div class="bz-header">
                <span class="bz-item-name">${itemName}</span>
                <button class="bz-close-btn">✕</button>
            </div>
            ${npcInfoHTML}
            ${marketInfoHTML}
            ${toggleHTML}
            <div class="bz-listings-container"></div>
            <a href="${teLink}" target="_blank" class="bz-te-link">View All TE Listings</a>
        `;

        // Initial render
        updateListings();

        // Add toggle handler
        const toggleInput = sidebar.querySelector('.bz-toggle-input');
        const toggleText = sidebar.querySelector('.bz-toggle-text');

        toggleInput.addEventListener('change', function() {
            showNPCDeals = this.checked;
            toggleText.textContent = showNPCDeals ? 'NPC Deals' : 'Market Deals';
            updateListings();
        });

        // Add close button handler
        sidebar.querySelector('.bz-close-btn').addEventListener('click', () => {
            sidebar.remove();
        });
    }

    // NEW: Render scan all results
    function renderScanAllResults(dealsData) {
        const sidebar = createSidebar();

        let html = `
            <div class="bz-header">
                <span class="bz-item-name">Top 10 NPC Deals</span>
                <button class="bz-close-btn">✕</button>
            </div>
        `;

        if (dealsData.length === 0) {
            html += '<div class="bz-empty">No profitable deals found in favorites</div>';
        } else {
            html += `<div class="bz-listings-title">💰 Best Profits Available</div>`;

            dealsData.forEach(deal => {
                const priceNum = parseFloat(deal.listing.price.toString().replace(/,/g, ''));
                const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
                const isVisited = window._visitedBazaars.has(deal.listing.player_id);
                const visitedClass = isVisited ? 'visited' : '';
                const bazaarLink = `https://www.torn.com/bazaar.php?userId=${deal.listing.player_id}#/`;

                html += `
                    <div class="bz-scan-item-header" data-item-id="${deal.itemId}" data-item-name="${deal.itemName}">
                        <span class="bz-scan-item-name">${deal.itemName}</span>
                        <span class="bz-scan-best-profit">+$${deal.profit.toLocaleString()}</span>
                    </div>
                    <div class="bz-listing ${visitedClass} profitable" data-player-id="${deal.listing.player_id}" data-url="${bazaarLink}">
                        <span class="bz-profit npc-profit ${deal.profit >= 500 ? 'big' : ''}">NPC +$${deal.profit.toLocaleString()}</span>
                        <a href="${bazaarLink}" target="_blank" class="bz-player-name" onclick="event.stopPropagation()">
                            ${deal.listing.player_name || 'Unknown'}
                        </a>
                        <div class="bz-listing-details">
                            <span class="bz-price">${formattedPrice}</span>
                            <span class="bz-qty">Qty: ${deal.listing.quantity}</span>
                        </div>
                    </div>
                `;
            });
        }

        sidebar.innerHTML = html;

        // Add click handlers for item headers
        sidebar.querySelectorAll('.bz-scan-item-header').forEach(header => {
            header.addEventListener('click', function() {
                const itemId = this.dataset.itemId;
                const itemName = this.dataset.itemName;
                processItem(itemName, itemId);
            });
        });

        // Add click handlers for listings
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

    // NEW: Scan all favorites function with category filtering
    async function scanAllFavorites(specificCategory = null) {
        const sidebar = createSidebar();
        showLoading(sidebar);

        const favs = window.BZ_FAVOURITES ? window.BZ_FAVOURITES.getAll() : {};
        const selectedCategories = window.BZ_FAVOURITES ? window.BZ_FAVOURITES.getSelectedCategories() : new Set();

        let favItems = Object.values(favs);

        // Filter by specific category if provided, otherwise use selected categories
        if (specificCategory) {
            favItems = favItems.filter(item => item.category === specificCategory);
        } else if (selectedCategories.size > 0) {
            favItems = favItems.filter(item => selectedCategories.has(item.category));
        }

        if (favItems.length === 0) {
            sidebar.innerHTML = `
                <div class="bz-header">
                    <span class="bz-item-name">Scan Results</span>
                    <button class="bz-close-btn">✕</button>
                </div>
                <div class="bz-empty">No favorites to scan${specificCategory ? ` in ${specificCategory}` : selectedCategories.size > 0 ? ' in selected categories' : ''}</div>
            `;
            sidebar.querySelector('.bz-close-btn').addEventListener('click', () => {
                sidebar.remove();
            });
            return;
        }

        const allDeals = [];

        // Fetch listings for each favorite
        for (const item of favItems) {
            const listings = await fetchBazaarListings(item.id);

            const npcData = npcPrices[item.id];
            let npcPrice = 0;

            if (typeof npcData === 'object' && npcData !== null) {
                npcPrice = npcData.npcPrice || 0;
            } else if (typeof npcData === 'number') {
                npcPrice = npcData;
            }

            if (npcPrice > 0 && listings.length > 0) {
                // Find best profitable listing for this item
                let bestListing = null;
                let bestProfit = 0;

                listings.forEach(listing => {
                    const price = parseFloat(listing.price.toString().replace(/,/g, ''));
                    const profit = npcPrice - price;

                    if (profit > bestProfit) {
                        bestProfit = profit;
                        bestListing = listing;
                    }
                });

                if (bestListing && bestProfit > 0) {
                    allDeals.push({
                        itemId: item.id,
                        itemName: item.name,
                        profit: bestProfit,
                        listing: bestListing
                    });
                }
            }
        }

        // Sort by profit (highest first) and take top 10
        allDeals.sort((a, b) => b.profit - a.profit);
        const top10 = allDeals.slice(0, 10);

        renderScanAllResults(top10);
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
    window.scanAllFavorites = scanAllFavorites; // Expose for favorites module

})();

// =====================================================
// BAZAAR FAVOURITES MODULE (With Lock Toggle)
// =====================================================
(function () {
    'use strict';

    const FAV_KEY = 'bz_favourite_items';
    const LOCK_KEY = 'bz_favourite_lock';
    const CATEGORY_SELECTION_KEY = 'bz_category_selection';

    const ITEM_CATEGORIES = {
        'Primary': [
            'Sawed-Off Shotgun', 'Benelli M1 Tactical', 'MP5 Navy', 'P90', 'M4A1 Colt Carbine',
            'Benelli M4 Super', 'M16 A2 Rifle', 'Steyr AUG', 'M249 SAW', '9mm Uzi', 'XM8 Rifle',
            'Enfield SA-80', 'Mag 7', 'Vektor CR-21', 'Heckler & Koch SL8', 'SIG 550',
            'Bushmaster Carbon 15', 'Ithaca 37', 'Negev NG-5', 'AK-47',
           ],
        'Secondary': [
            'Raven MP25', 'Beretta M9', 'USP', 'Fiveseven', 'Magnum', 'Desert Eagle', 'Taser',
            'Cobra Derringer', 'S&W Revolver', 'Qsz-92', 'Skorpion', 'Harpoon', 'BT MP9',
           ],
        'Melee': [
            'Knuckle Dusters', 'Kitchen Knife', 'Axe', 'Scimitar', 'Chainsaw', 'Samurai Sword',
            'Ninja Claws', 'Butterfly Knife', 'Claymore Sword', 'Swiss Army Knife', 'Kama',
            'Katana', 'Twin Tiger Hooks', 'Wushu Double Axes', 'Guandao', 'Ice Pick',
            'Cricket Bat', 'Golf Club', 'Kodachi', 'Macana'
            ],
        'Cars': [
            'Alpha Milano 156', 'Bavaria M5', 'Bavaria X5', 'Bavaria Z8', 'Bedford Nova',
            'Bedford Racer', 'Coche Basurero', 'Chevalier CVR', 'Chevalier CZ06', 'Colina Tanprice',
            'Cosmos EX', 'Çagoutte 10-6', 'Dart Rampager', 'Echo Quadrato', 'Echo R8',
            'Echo S3', 'Echo S4', 'Edomondo ACD', 'Edomondo IR', 'Edomondo Localé',
            'Edomondo NSX', 'Edomondo S2', 'Invader H3', 'Knight Firebrand', 'Lambrini Torobravo',
            'Limoen Saxon', 'Lolo 458', 'Mercia SLR', 'Nano Cavalier', 'Nano Pioneer',
            'Oceania SS', 'Papani Colé', 'Stålhög 860', 'Sturmfahrt 111', 'Tabata RM2',
            'Trident', 'Tsubasa Impressor', 'Veloria LFA', 'Verpestung Insecta', 'Verpestung Sport',
            'Vita Bravo', 'Volt GT', 'Volt MNG', 'Volt RS', 'Weston Marlin 177',
            'Wington GGU', 'Yotsuhada EVX', 'Zaibatsu GT-R', 'Zaibatsu Macro'
        ],
        'Clothing': [
            'Bikini', 'Coconut Bra', 'Diving Gloves', 'Flippers', 'Mountie Hat',
            'Proda Sunglasses', 'Snorkel', 'Speedo', 'Sports Shades', 'Trench Coat', 'Wetsuit'
        ],
        'Armor': [
            'Bulletproof Vest', 'Chain Mail', 'Construction Helmet', 'Flak Jacket', 'Full Body Armor',
            'Hiking Boots', 'Kevlar Gloves', 'Leather Boots', 'Leather Helmet', 'Leather Gloves',
            'Leather Vest', 'Leather Pants', 'Outer Tactical Vest', 'Police Vest', 'Safety Boots',
            'WWII Helmet'
        ],
        'Miscellaneous': [
            'Afro Comb', 'Ambergris Lump', 'Bank Check', 'Bear Gall', 'Bearer Bond',
            'Big Al\'s Gun Oil', 'Birth Certificate', 'Boat Engine', 'Counterfeit Manga',
            'Diploma', 'Donator Pack', 'Driver\'s License', 'Drug Pack', 'Ephedrine Powder',
            'Ergotamine Ampoule', 'Fire Hydrant', 'Fishing Rod', 'Jade Buddha', 'Insulin',
            'Lawyer Business Card', 'License Plate', 'Machine Part', 'Maneki Neko',
            'Medical Supply Pack', 'Natural Pearls', 'Pangolin Scales', 'Parking Permit',
            'Passport', 'Perfume', 'Points', 'Prescription', 'Raw Ivory', 'Safrole Oil',
            'Shark Fin', 'Small Explosive Device', 'Snowboard', 'Subway Pass',
            'Tailor\'s Dummy', 'Tiger Bone Powder', 'Tractor Part', 'Travel Visa',
            'Turtle Shell', 'Whale Meat', 'Wind-up Toy', 'Travel Mug'
        ],
        'Consumables': [
            'Blood Bag', 'Can of Red Bull', 'Can of Rockstar Rudolph', 'Can of Santa Shooters',
            'Empty Blood Bag', 'Energy Drink', 'Erotic DVD', 'Feathery Hotel Coupon',
            'FHC', 'First Aid Kit', 'LSD', 'Morphine', 'Small Medkit', 'Speed', 'Vicodin', 'Xanax'
        ]
    };

    function getAll() { return GM_getValue(FAV_KEY, {}); }
    function isLocked() { return GM_getValue(LOCK_KEY, false); }

    function getSelectedCategories() {
        const saved = GM_getValue(CATEGORY_SELECTION_KEY, []);
        return new Set(saved);
    }

    function saveSelectedCategories(categories) {
        GM_setValue(CATEGORY_SELECTION_KEY, Array.from(categories));
    }

    function save(id, name) {
        if (isLocked()) return; // BLOCK SAVING IF LOCKED
        const favs = getAll();
        if (!favs[id]) {
            let category = 'Uncategorized';
            for (const [catName, items] of Object.entries(ITEM_CATEGORIES)) {
                if (items.includes(name)) {
                    category = catName;
                    break;
                }
            }
            favs[id] = { id, name, category };
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

    function createUI() {
        if (document.getElementById('bz-fav-btn')) return;

        GM_addStyle(`
    /* The main container - Added Shadow and consistent padding */
    #bz-fav-panel {
        position: fixed;
        right: 50px;
        top: 10px;
        width: 144px;
        background: #1a1a1a;
        border: 2px solid #696969; /* Outline matching Sidebar 1 */
        border-radius: 8px;
        padding: 12px; /* Increased to match Sidebar 1 padding */
        color: #fff;
        display: none;
        z-index: 9999;
        max-height: 575px;
        overflow-y: auto;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4); /* The gold glow from Sidebar 1 */
    }

    /* Scrollbar Styling - Copied directly from Sidebar 1 */
    #bz-fav-panel::-webkit-scrollbar {
        width: 8px;
    }

    #bz-fav-panel::-webkit-scrollbar-thumb {
        background: #292929;
        border-radius: 4px;
    }

    /* Floating Button - Added subtle glow to match theme */
    #bz-fav-btn {
    position: fixed;
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;

    /* Matching the Sidebar 1 Background and Border */
    background: #1a1a1a;
    border: 2px solid #696969;
    border-radius: 8px; /* Square with rounded corners */

    /* Matching the Gold theme */
    color: #FFD700;
    font-weight: bold;
    font-size: 18px;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999;

    /* Matching the Sidebar 1 Glow */
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
    transition: all 0.2s ease;
}

#bz-fav-btn:hover {
    /* Subtle highlight effect from the sidebar items */
    background: #252525;
    border-color: #FFD700;
    transform: scale(1.05);
}

    .bz-header-controls { display: flex; gap: 4px; margin-bottom: 8px; }

    .bz-ctrl-btn {
        flex: 1; text-align: center; padding: 4px;
        border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;
        border: 1px solid #444; /* Added outline to buttons */
    }

    #bz-clear-all { background: #434C66; color: white; }
    #bz-lock-btn.locked { background: #992b2b; color: white; }
    #bz-lock-btn.unlocked { background: #2b9943; color: white; }
    #bz-scan-all { background: #1a4d6f; color: #00BFFF; }
    #bz-scan-all:hover { background: #2a5d7f; }

    /* Category Headers - Matched border-bottom style */
    .bz-fav-category-header {
        background: #202966;
        color: #FFD700;
        padding: 4px 8px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        margin-top: 5px;
        border-radius: 2px;
        border-left: 3px solid #FFD700;
        border-bottom: 1px solid #6E6E6E;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .bz-category-checkbox {
        width: 14px;
        height: 14px;
        cursor: pointer;
        accent-color: #FFD700;
    }

    .bz-category-label {
        flex: 1;
        cursor: pointer;
    }

    /* NEW: Category Scan Button */
    .bz-category-scan-btn {
        background: #1a4d6f;
        color: #00BFFF;
        border: 1px solid #2a5d7f;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 9px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s;
    }

    .bz-category-scan-btn:hover {
        background: #2a5d7f;
        transform: scale(1.05);
    }

    /* Items - Added hover effect similar to Sidebar 1 listings */
    .bz-fav-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px;
        border-bottom: 1px solid #333;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }

    .bz-fav-item:hover {
        background: #252525;
        color: #FFD700;
        transform: translateX(2px);
    }

    .bz-fav-remove { color: #575A66; margin-left: 8px; }
    .bz-fav-remove:hover { color: #A33C39; }
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
        const locked = isLocked();
        const selectedCategories = getSelectedCategories();

        let html = `
            <div class="bz-header-controls">
                <div id="bz-clear-all" class="bz-ctrl-btn">Clear</div>
                <div id="bz-lock-btn" class="bz-ctrl-btn ${locked ? 'locked' : 'unlocked'}">
                    ${locked ? 'Locked' : 'Unlocked'}
                </div>
            </div>
            <div style="margin-bottom: 8px;">
                <div id="bz-scan-all" class="bz-ctrl-btn" style="width: 100%;">🔍 Scan ${selectedCategories.size > 0 ? 'Selected' : 'All'}</div>
            </div>
        `;

        if (favs.length === 0) {
            html += `<div style="text-align:center;color:#888;padding:10px;">List Empty</div>`;
        } else {
            const groups = favs.reduce((acc, item) => {
                const cat = item.category || 'Uncategorized';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
            }, {});

            Object.keys(groups).sort().forEach(category => {
                const isChecked = selectedCategories.has(category);
                html += `
                    <div class="bz-fav-category-header">
                        <input type="checkbox" class="bz-category-checkbox" data-category="${category}" ${isChecked ? 'checked' : ''}>
                        <span class="bz-category-label">${category}</span>
                        <button class="bz-category-scan-btn" data-category="${category}">🔍</button>
                    </div>
                `;
                html += groups[category].map(f =>
                    `<div class="bz-fav-item" data-id="${f.id}">
                        <span>${f.name}</span>
                        <span class="bz-fav-remove">✕</span>
                    </div>`
                ).join('');
            });
        }

        panel.innerHTML = html;

        // --- Event Listeners ---
        panel.querySelector('#bz-clear-all').addEventListener('click', () => {
            if (confirm("Clear all favorites?")) {
                GM_setValue(FAV_KEY, {});
                render();
            }
        });

        panel.querySelector('#bz-lock-btn').addEventListener('click', () => {
            GM_setValue(LOCK_KEY, !locked);
            render();
        });

        // Scan All button listener
        panel.querySelector('#bz-scan-all').addEventListener('click', () => {
            if (typeof window.scanAllFavorites === 'function') {
                window.scanAllFavorites();
            } else {
                alert('Scan function not available. Please refresh the page.');
            }
        });

        // NEW: Category scan button listeners
        panel.querySelectorAll('.bz-category-scan-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const category = this.dataset.category;
                if (typeof window.scanAllFavorites === 'function') {
                    window.scanAllFavorites(category);
                } else {
                    alert('Scan function not available. Please refresh the page.');
                }
            });
        });

        // Category checkbox listeners
        panel.querySelectorAll('.bz-category-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                const category = this.dataset.category;
                const selected = getSelectedCategories();

                if (this.checked) {
                    selected.add(category);
                } else {
                    selected.delete(category);
                }

                saveSelectedCategories(selected);
                render();
            });
        });

        // Make category labels clickable too
        panel.querySelectorAll('.bz-category-label').forEach(label => {
            label.addEventListener('click', function() {
                const checkbox = this.previousElementSibling;
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
        });

        panel.querySelectorAll('.bz-fav-item').forEach(el => {
            el.addEventListener('click', e => {
                const id = el.dataset.id;
                const name = el.querySelector('span').textContent;
                if (e.target.classList.contains('bz-fav-remove')) {
                    remove(id);
                } else if (typeof window.processItem === 'function') {
                    window.processItem(name, id);
                }
            });
        });
    }

    function waitForBodyAndInit() {
        if (document.body) createUI();
        else setTimeout(waitForBodyAndInit, 250);
    }

    waitForBodyAndInit();
    window.BZ_FAVOURITES = { save, remove, getAll, getSelectedCategories };
})();