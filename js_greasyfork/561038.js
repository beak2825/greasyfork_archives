// ==UserScript==
// @name          Bazaar Scanner - Sidebar Edition
// @namespace     https://weav3r.dev/
// @version       3.0.0
// @description   Shows top bazaar deals in sidebar - keeps item market clean
// @author        Modified for srsbsns
// @match         https://www.torn.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @connect       weav3r.dev
// @connect       tornexchange.com
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/561038/Bazaar%20Scanner%20-%20Sidebar%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/561038/Bazaar%20Scanner%20-%20Sidebar%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global State
    window._visitedBazaars = new Set();
    window._cachedListings = {};
    window._marketValueCache = {};

    GM_addStyle(`
        /* Sidebar Container */
        #bazaar-sidebar {
            position: fixed;
            left: 10px;
            top: 180px;
            width: 320px;
            background: #1a1a1a;
            border: 2px solid #444;
            border-radius: 8px;
            padding: 12px;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        #bazaar-sidebar.dragging {
            cursor: grabbing;
            user-select: none;
        }

        #bazaar-sidebar::-webkit-scrollbar {
            width: 8px;
        }

        #bazaar-sidebar::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }

        /* Header */
        .bz-header {
            font-size: 16px;
            font-weight: bold;
            color: #FFD700;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid #444;
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
            color: #FFD700;
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
            border-bottom: 1px solid #444;
        }

        .bz-listing {
            background: #252525;
            border: 1px solid #444;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
        }

        .bz-listing:hover {
            background: #2a2a2a;
            border-color: #666;
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
            font-size: 11px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 3px;
            background: rgba(0,0,0,0.3);
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
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
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
            background: #1a5d7f;
        }
    `);

    // API Functions
    function fetchApi(url) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.status === 'success') {
                            resolve(data);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    async function fetchTornExchangeData(itemId) {
        let marketValue = '';
        let bestBuyer = null;

        const [tePriceData, bestListingData] = await Promise.all([
            fetchApi(`https://tornexchange.com/api/te_price?item_id=${itemId}`),
            fetchApi(`https://tornexchange.com/api/best_listing?item_id=${itemId}`)
        ]);

        if (tePriceData && tePriceData.data && tePriceData.data.te_price) {
            const price = tePriceData.data.te_price;
            window._marketValueCache[itemId] = price;
            marketValue = Math.round(price);
        }

        if (bestListingData && bestListingData.data && bestListingData.data.price) {
            bestBuyer = {
                price: bestListingData.data.price,
                trader: bestListingData.data.trader || null
            };
        }

        return { marketValue, bestBuyer };
    }

    function fetchBazaarListings(itemId) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://weav3r.dev/api/marketplace/${itemId}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.listings) {
                            resolve(data.listings);
                        } else {
                            resolve([]);
                        }
                    } catch (e) {
                        resolve([]);
                    }
                },
                onerror: function() {
                    resolve([]);
                }
            });
        });
    }

    // Sidebar Management
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
            // Only drag if clicking on the header
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

                // Keep sidebar within viewport bounds
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
        
        // Sort by price
        const sorted = listings.sort((a, b) => {
            const priceA = parseFloat(a.price.toString().replace(/,/g, ''));
            const priceB = parseFloat(b.price.toString().replace(/,/g, ''));
            return priceA - priceB;
        });

        // Take top 5
        const top5 = sorted.slice(0, 5);

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
            listingsHTML = '<div class="bz-listings-title">Top Bazaar Deals</div>';
            
            top5.forEach(listing => {
                const priceNum = parseFloat(listing.price.toString().replace(/,/g, ''));
                const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
                const isVisited = window._visitedBazaars.has(listing.player_id);
                const visitedClass = isVisited ? 'visited' : '';
                
                let profitHTML = '';
                if (marketValue) {
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
                    <div class="bz-listing ${visitedClass}" data-player-id="${listing.player_id}" data-url="${bazaarLink}">
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

        const encodedItemName = encodeURIComponent(itemName);
        const teLink = `https://tornexchange.com/listings?model_name_contains=${encodedItemName}&order_by=&status=`;

        sidebar.innerHTML = `
            <div class="bz-header">
                <span class="bz-item-name">${itemName}</span>
                <button class="bz-close-btn">✕</button>
            </div>
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
    attachListeners();

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