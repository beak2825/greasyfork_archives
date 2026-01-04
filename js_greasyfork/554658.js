// ==UserScript==
// @name         Bazaar + TE Info PDA Version 
// @namespace    https://weav3r.dev/
// @version      1.6
// @description  Adds Bazaar listings, TornExchange data, sorting/filtering, and Market Margin Calculator to Item Market/Bazaar detail views. Optimized for PDA/mobile.
// @author       WTV [3281931]
// @match        https://www.torn.com/*
// @match        https://www.torn.com/itemmarket.php*
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_xmlhttpRequest
// @connect      weav3r.dev
// @connect      tornexchange.com
// @connect      www.torn.com
// @run-at       document-end  
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554658/Bazaar%20%2B%20TE%20Info%20PDA%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/554658/Bazaar%20%2B%20TE%20Info%20PDA%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log("[Bazaar + TE Info PDA Version V 2.9.9.3 UI Restructure].");

    // Global state
    window._visitedBazaars = window._visitedBazaars || new Set();
    window._cachedListings = window._cachedListings || {}; 
    window._marketValueCache = window._marketValueCache || {}; 
    window._activeSort = window._activeSort || { type: 'price', dir: 'asc' }; 
    // NEW GLOBAL STATE
    window._currentMarketNetPrice = window._currentMarketNetPrice || 0; 
    
    let isMobileView = false;
    let currentDarkMode = document.body.classList.contains("dark-mode");
    let lastUrl = window.location.href; 
    
    // ----------------------------------------------------------------------
    // --- UTILITY & STYLES ---
    // ----------------------------------------------------------------------
    
    function checkMobileView() {
        isMobileView = window.innerWidth <= 784; 
        return isMobileView;
    }
    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    
    function extractItemId() {
        let itemId = null;
        
        if (isMobileView) {
            const btn = document.querySelector('[class*="itemsHeader"] button[aria-controls^="wai-itemInfo-"]');
            if (btn) {
                const controls = btn.getAttribute("aria-controls");
                const parts = controls.split("-");
                itemId = parts.length > 2 ? parts[parts.length - 2] : parts[parts.length - 1];
            }
            
            if (!document.querySelector('ul[class*="sellerList"]')) {
                return null;
            }
            
        } else { // PC View
            const itemDetails = document.querySelector('[class*="item-details"], [class*="item-info-desc"]');
            
            if (!itemDetails) {
                 return null;
            }
            
            const itemImg = itemDetails.querySelector('img[src*="/images/items/"]');
            if (itemImg) {
                 const src = itemImg.getAttribute('src');
                 const imgMatch = src.match(/\/images\/items\/(\d+)\//i);
                 if (imgMatch && imgMatch[1]) { itemId = imgMatch[1]; }
            }
            
            if (!itemId) {
                const currentURL = new URL(window.location.href);
                const urlMatch = currentURL.search.match(/ID=(\d+)/i) || window.location.hash.match(/ID=(\d+)/i);
                if (urlMatch && urlMatch[1]) { itemId = urlMatch[1]; }
            }
        }
        
        return (itemId && itemId !== "unknown") ? itemId : null;
    }
    
    /**
     * Cleans and formats a number input value with commas.
     * @param {HTMLInputElement} input - The input element to process.
     * @returns {number} The parsed number value.
     */
    function formatNumberInput(input) {
        let value = input.value.replace(/[^\d]/g, ''); // Remove non-digit characters
        let numValue = parseInt(value, 10);

        if (isNaN(numValue) || numValue < 0) {
            input.value = '';
            return 0;
        }

        // Format with commas (only on blur/change for better typing experience)
        if (document.activeElement !== input) {
            input.value = numValue.toLocaleString();
        }

        return numValue;
    }

    function updateStyles() {
        let styleEl = document.getElementById("bazaar-enhanced-styles");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "bazaar-enhanced-styles";
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = `
            .bazaar-info-container { border: 1px solid #888; margin: 5px 0 10px 0; padding: 5px; background: #222; color: #fff; border-radius: 4px; max-width: 100%; box-sizing: border-box; }
            .dark-mode .bazaar-info-container { background: #222; border-color: #444; }
            .bazaar-control-line { display: flex; flex-wrap: nowrap; gap: 4px; align-items: center; overflow-x: auto; padding-right: 5px; } 
            .bazaar-filter-toggle-btn { background: #555; color: white; border: none; padding: 4px 5px; cursor: pointer; font-weight: bold; height: 28px; width: 50px; flex-shrink: 0; font-size: 12px; border-radius: 4px; }
            .bazaar-filter-toggle-btn.active-filter { background: #007bff; }
            .bazaar-sort-btn { cursor:pointer; font-size: 14px; line-height: 1; margin: 0; padding: 0; }
            .bazaar-filter-input { padding: 4px; background: #333; border: 1px solid #444; color: white; height: 28px; box-sizing: border-box; font-size: 12px; border-radius: 4px; }
            .bazaar-filter-group-price input { width: 48px; } 
            .bazaar-filter-group-quantity input { width: 45px; } 
            .bazaar-apply-btn { background: #28a745; color: white; border: none; padding: 4px 8px; cursor: pointer; font-weight: bold; height: 28px; flex-shrink: 0; font-size: 12px; border-radius: 4px; }
            .bazaar-card-container { display:flex; overflow-x:auto; padding:5px; gap:5px; }
            .bazaar-card { border:1px solid #444; background:#222; color:#eee; padding: 2px 3px; margin:2px; width: 95px; flex-shrink: 0; cursor:pointer; display:flex; flex-direction:column; font-family: inherit; font-size:14px; transition:transform 0.2s; position: relative; gap: 0; border-radius: 4px; } 
            .bazaar-card a { overflow: hidden !important; white-space: nowrap !important; text-overflow: ellipsis; line-height: 1.1; font-size: 14px !important; padding: 0; margin: 0 0 3px 0; display: block; }
            .bazaar-card-line-1 { font-size: 14px !important; line-height: 1.0; padding: 0; margin: 3px 0 3px 0; font-weight: bold; display: flex; justify-content: space-between; align-items: center; } /* Price Line */
            .bazaar-card-line-2 { font-size: 12px !important; line-height: 1.0; padding: 0; margin: 3px 0 0 0; display: flex; justify-content: space-between; align-items: baseline; } /* Qty/Diff Line */
            .bazaar-card-line-3 { font-size: 12px !important; line-height: 1.0; padding: 0; margin: 0; display: flex; justify-content: space-between; align-items: baseline; } /* Margin Line */
            .bazaar-title { font-size: 16px !important; font-weight: bold !important; flex-grow: 1; overflow: visible; white-space: normal;}
            .bazaar-info-header { font-weight:bold;margin-bottom:5px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; font-size: 14px; overflow: visible; }
            .bazaar-te-id-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
            .bazaar-te-id-line .item-id-display { color:#aaa; font-size:13px; font-weight: bold; white-space: nowrap; }
            .bazaar-filter-inputs-group { display: flex; gap: 2px; align-items: center; flex-wrap: nowrap; flex-grow: 1; justify-content: flex-end; flex-shrink: 0; }
            .bazaar-filter-group-price, .bazaar-filter-group-quantity { display: flex; align-items:center; gap:2px; flex-shrink: 0; }
            .best-buyer-line { font-weight:bold; margin-bottom: 5px; color:#FFA500; display: flex; flex-wrap: nowrap; justify-content: flex-start; align-items: center; gap: 5px; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .best-buyer-line > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .best-buyer-line > span:first-child, .best-buyer-line .price-display-span { flex-shrink: 0; }
            .best-buyer-line a { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; }
            
            /* CALCULATOR STYLES */
            .bazaar-market-calc {
                background: #333;
                padding: 8px;
                margin-top: 5px; /* Added margin-top to separate it from filters */
                margin-bottom: 10px;
                border: 1px solid #555;
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 13px;
                border-radius: 4px;
            }

            .bazaar-market-calc label {
                display: flex;
                align-items: center;
                gap: 5px;
                white-space: nowrap;
                justify-content: space-between;
            }

            .bazaar-calc-input {
                width: 100px;
                padding: 3px 5px;
                border: 1px solid #888;
                background: #111;
                color: #fff;
                font-size: 13px;
                text-align: right;
                border-radius: 4px;
            }

            .bazaar-net-profit {
                font-weight: bold;
                color: #00BFFF;
                font-size: 14px;
            }
            
            /* MARGIN STYLES */
            .margin-info {
                font-size: 12px !important;
                font-weight: bold;
                white-space: nowrap;
                line-height: 1.0; 
                padding: 0; 
                margin: 0;
                display: flex; 
                justify-content: space-between; 
                width: 100%; 
            }
            .diff-text-positive { color: red; font-weight: bold; } /* Loss/Negative Margin */
            .diff-text-negative { color: limegreen; font-weight: bold; } /* Profit/Positive Margin */
            .diff-text-neutral { color: gold; font-weight: bold; }
        `;
    }
    updateStyles();

    const darkModeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === "class") {
                const newDarkMode = document.body.classList.contains("dark-mode");
                if (newDarkMode !== currentDarkMode) {
                    currentDarkMode = newDarkMode;
                    updateStyles();
                }
            }
        });
    });
    darkModeObserver.observe(document.body, { attributes: true });

    function renderNoListingsMessage(container, isError){
        const cardContainer = container.querySelector('.bazaar-card-container');
        if(!cardContainer) return;
        cardContainer.innerHTML = '';
        const msg = document.createElement('div');
        msg.style.cssText='color:#fff;text-align:center;padding:20px;width:100%;';
        msg.innerHTML = isError ? "API Error<br><span style='font-size:12px;color:#ccc;'>Could not fetch bazaar data.</span>"
                                 : "No bazaar listings available for this item.";
        cardContainer.appendChild(msg);
    }
    
    function fetchUpvoteCountAndId(userName, callback) {
        const url = `https://tornexchange.com/prices/${userName}/`;
        GM_xmlhttpRequest({
            method: "GET", url: url,
            onload: function(response) {
                let upvoteCount = null;
                let traderId = null;
                try {
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const upvoteElement = doc.querySelector('#vote-score');
                    if (upvoteElement) { upvoteCount = upvoteElement.textContent.trim(); }
                    const profileLink = doc.querySelector('a[href*="profiles.php?XID="]');
                    if (profileLink) {
                        const href = profileLink.getAttribute('href');
                        const match = href.match(/XID=(\d+)/);
                        if (match && match[1]) { traderId = match[1]; }
                    }
                } catch (e) { /* silent fail, as per V 1.0 */ }
                callback(upvoteCount, traderId);
            },
            onerror: function() { callback(null, null); }
        });
    }

    // ----------------------------------------------------------------------
    // --- MARKET CALCULATOR LOGIC ---
    // ----------------------------------------------------------------------

    function calculateMarketNet(container) {
        const inputEl = container.querySelector('.bazaar-calc-input');
        const profitEl = container.querySelector('.bazaar-net-profit');

        // 1. Get cleaned price.
        const price = parseFloat(inputEl.value.replace(/[^\d]/g, ''));

        if (isNaN(price) || price <= 0) {
            window._currentMarketNetPrice = 0;
            if (profitEl) profitEl.textContent = `$0`;
            // Refresh to clear margins
            sortAndFilterListings(container.dataset.itemid, container);
            return;
        }

        // 2. Calculate Net Profit (5% fee)
        const netProfit = Math.floor(price * 0.95);
        window._currentMarketNetPrice = netProfit;

        // 3. Update display
        if (profitEl) {
             profitEl.textContent = `$${netProfit.toLocaleString()}`;
        }
        
        // 4. Refresh cards
        sortAndFilterListings(container.dataset.itemid, container);
    }
    
    /**
     * Binds input, blur, and change events to the market price input.
     * @param {HTMLElement} container - The main script container element.
     */
    function addMarketFeeListener(container) {
        const inputEl = container.querySelector('.bazaar-calc-input');
        if (!inputEl) return;

        // Input event: Calculate immediately for responsiveness
        inputEl.addEventListener('input', () => calculateMarketNet(container));

        // Blur event: Apply formatting and recalculate
        inputEl.addEventListener('blur', () => {
            formatNumberInput(inputEl);
            calculateMarketNet(container);
        });

        // Change event (fallback)
        inputEl.addEventListener('change', () => calculateMarketNet(container));

        // Enter key: Blur input (which triggers format/recalculate)
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                inputEl.blur(); 
            }
        });
    }

    // ----------------------------------------------------------------------
    // --- RENDERING & INJECTION (MODIFIED) ---
    // ----------------------------------------------------------------------

    function createInfoContainer(itemName, itemId, marketValue, bestBuyer, upvoteCount, traderId) {
        const container = document.createElement('div');
        container.className = 'bazaar-info-container';
        container.dataset.itemid = itemId;
        if (marketValue) container.dataset.marketValue = marketValue; 
        if (traderId) container.dataset.bestBuyerId = traderId;
        
        const marketText = marketValue ? ` <span style="color:#FFD700; flex-shrink: 0; font-size: 14px;">(MV: ${marketValue})</span>` : '';
        const encodedItemName = encodeURIComponent(itemName);
        const teListingsLink = `https://tornexchange.com/listings?model_name_contains=${encodedItemName}&order_by=&status=`;
        const teListingHTML = `<a href="${teListingsLink}" target="_blank" style="color:#00BFFF; font-size: 13px; text-decoration: none; white-space:nowrap; font-weight: bold;">TE Listings</a>`;
        const itemIdHTML = `<span class="item-id-display">Item #: ${itemId}</span>`;
        
        const teIdLineHTML = `<div class="bazaar-te-id-line" style="margin-bottom: 5px;">${teListingHTML}${itemIdHTML}</div>`;

        // --- Market Calculator HTML ---
        const calculatorHTML = `
            <div class="bazaar-market-calc">
                <label>
                    Market Sell Price:
                    <input type="text" pattern="[0-9]*" inputmode="numeric" placeholder="Enter Price" class="bazaar-calc-input">
                </label>
                <div style="display:flex; justify-content: space-between; align-items: center;">
                    Net Profit (After 5% Fee): <span class="bazaar-net-profit">$0</span>
                </div>
            </div>
        `;
        
        let bestBuyerInfoHTML = '';
        if (bestBuyer && bestBuyer.price) {
            const formattedPrice = `$${Math.round(bestBuyer.price).toLocaleString()}`;
            const priceDisplayHTML = `<span class="price-display-span" style="color:lime; font-weight:bold; white-space:nowrap; font-size: 16px;">${formattedPrice}</span>`;
            if (bestBuyer.trader && traderId) {
                const traderLinkHTML = `<a href="https://www.torn.com/profiles.php?XID=${traderId}" target="_blank" style="color:#1E90FF; text-decoration:none; font-weight:bold; cursor:pointer;" onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">${bestBuyer.trader}</a>`;
                const upvoteText = upvoteCount ? ` (⭐ ${upvoteCount})` : ''; 
                bestBuyerInfoHTML = `<span style="flex-shrink: 0;">Best Trader: ${priceDisplayHTML}</span><span style="flex-grow: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis;">by ${traderLinkHTML}${upvoteText}</span>`;
            } else {
                 bestBuyerInfoHTML = `<span style="flex-shrink: 0;">Best Trader: ${formattedPrice}</span>`;
            }
        } else {
             bestBuyerInfoHTML = `<span style="flex-shrink: 0;">No Best Trader Data</span>`;
        }
        const bestBuyerHTML = `<div class="best-buyer-line">${bestBuyerInfoHTML}</div>`;
        
        const filterControlsHTML = `
            <div class="bazaar-control-row" style="display:flex; flex-direction: column; gap:8px; margin: 5px 0 8px 0;">
                <div class="bazaar-control-line">
                    
                    <div class="bazaar-price-controls" style="display: flex; gap: 4px; align-items: center; flex-shrink: 0; white-space: nowrap;">
                        <button class="bazaar-filter-toggle-btn active-filter" data-filter-type="price" style="background:#007bff;">Price</button>
                        <div style="display: flex; flex-direction: column; height: 28px; justify-content: center; align-items: center; padding-right: 4px;">
                            <span class="bazaar-sort-btn" data-sort-by="price" data-sort-dir="asc" style="color:#00BFFF;">🔼</span>
                            <span class="bazaar-sort-btn" data-sort-by="price" data-sort-dir="desc" style="color:#555;">🔽</span>
                        </div>
                    </div>
                    
                    <div class="bazaar-quantity-controls" style="display: flex; gap: 4px; align-items: center; flex-shrink: 0; white-space: nowrap;">
                        <button class="bazaar-filter-toggle-btn" data-filter-type="quantity">Qty</button>
                        <div style="display: flex; flex-direction: column; height: 28px; justify-content: center; align-items: center; padding-right: 4px;">
                            <span class="bazaar-sort-btn" data-sort-by="quantity" data-sort-dir="asc" style="color:#555;">🔼</span>
                            <span class="bazaar-sort-btn" data-sort-by="quantity" data-sort-dir="desc" style="color:#555;">🔽</span>
                        </div>
                    </div>
                    
                    <div class="bazaar-filter-inputs-group">
                        <div class="bazaar-filter-group-price">
                            <input type="number" placeholder="Min" class="bazaar-filter-input" data-filter-type="minPrice">
                            <input type="number" placeholder="Max" class="bazaar-filter-input" data-filter-type="maxPrice">
                        </div>
                        <div class="bazaar-filter-group-quantity" style="display: none;">
                            <input type="number" placeholder="Min" class="bazaar-filter-input" data-filter-type="minQty">
                            <input type="number" placeholder="Max" class="bazaar-filter-input" data-filter-type="maxQty">
                        </div>
                        <button class="bazaar-apply-btn" style="display: block;">Apply</button>
                    </div>
                </div>
            </div>
        `;

        // --- MODIFIED CONTAINER STRUCTURE ---
        container.innerHTML = `
            <div class="bazaar-info-header">
                <span class="bazaar-title">${itemName}${marketText}</span>
            </div>
            ${bestBuyerHTML}
            ${teIdLineHTML}
            ${filterControlsHTML}
            ${calculatorHTML} <div class="bazaar-card-container"></div>
        `;
        // --- END MODIFIED CONTAINER STRUCTURE ---

        const cardContainer = container.querySelector('.bazaar-card-container');
        if (cardContainer) {
            cardContainer.addEventListener("wheel", e => {
                if (e.deltaY !== 0) { e.preventDefault(); cardContainer.scrollLeft += e.deltaY; }
            });
        }

        addFilterListeners(container, itemId);
        addMarketFeeListener(container);

        return container;
    }

    function sortAndFilterListings(itemId, container) {
        let listings = window._cachedListings[itemId];
        if (!listings) {
            renderNoListingsMessage(container, !window._cachedListings[itemId]);
            return; 
        }
        
        const sortType = window._activeSort.type;
        const sortDir = window._activeSort.dir;
        
        const minPrice = parseFloat(container.querySelector('[data-filter-type="minPrice"]').value) || null;
        const maxPrice = parseFloat(container.querySelector('[data-filter-type="maxPrice"]').value) || null;
        const minQty = parseInt(container.querySelector('[data-filter-type="minQty"]').value) || null;
        const maxQty = parseInt(container.querySelector('[data-filter-type="maxQty"]').value) || null;
        
        let filteredListings = listings.slice().filter(listing => {
            const price = parseFloat(listing.price.toString().replace(/,/g, ''));
            const qty = parseInt(listing.quantity);
            if (minPrice !== null && price < minPrice) return false;
            if (maxPrice !== null && price > maxPrice) return false;
            if (minQty !== null && qty < minQty) return false;
            if (maxQty !== null && qty > maxQty) return false;
            return true;
        });

        filteredListings.sort((a, b) => {
            let primaryValA, primaryValB;
            if (sortType === 'price') {
                primaryValA = parseFloat(a.price.toString().replace(/,/g, ''));
                primaryValB = parseFloat(b.price.toString().replace(/,/g, ''));
            } else { // 'quantity'
                primaryValA = parseInt(a.quantity);
                primaryValB = parseInt(b.quantity);
            }
            let comparison = 0;
            if (sortDir === 'asc') { comparison = primaryValA - primaryValB; } else if (sortDir === 'desc') { comparison = primaryValB - primaryValA; }
            
            if (comparison === 0) {
                 const priceA = parseFloat(a.price.toString().replace(/,/g, ''));
                 const priceB = parseFloat(b.price.toString().replace(/,/g, ''));
                 return priceA - priceB;
            }
            return comparison;
        });
        
        const marketNum = window._marketValueCache?.[itemId] || null;
        renderCards(container, filteredListings, marketNum);
    }
    
    function addFilterListeners(container, itemId) {
        const priceFilterGroup = container.querySelector('.bazaar-filter-group-price');
        const quantityFilterGroup = container.querySelector('.bazaar-filter-group-quantity');
        const sortBtns = container.querySelectorAll('.bazaar-sort-btn'); 
        const filterToggleBtns = container.querySelectorAll('.bazaar-filter-toggle-btn');
        const applyBtn = container.querySelector('.bazaar-apply-btn');
        const defaultColor = '#555';
        const activeColor = '#00BFFF'; 
        const reverseColor = '#dc3545'; 

        const updateSortVisuals = () => {
             filterToggleBtns.forEach(btn => {
                 const filterType = btn.dataset.filterType;
                 if (filterType === window._activeSort.type) { 
                      btn.style.background = '#007bff';
                      btn.classList.add('active-filter');
                 } else {
                      btn.style.background = defaultColor;
                      btn.classList.remove('active-filter');
                 }
             });
             sortBtns.forEach(btn => {
                 const type = btn.dataset.sortBy;
                 const dir = btn.dataset.sortDir;
                 let color = defaultColor;
                 if (type === window._activeSort.type && dir === window._activeSort.dir) {
                     color = dir === 'asc' ? activeColor : reverseColor;
                 } else if (type === window._activeSort.type) {
                     color = '#777'; 
                 }
                 btn.style.color = color;
             });
        };

        sortBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                window._activeSort.type = btn.dataset.sortBy;
                window._activeSort.dir = btn.dataset.sortDir;
                updateSortVisuals();
                sortAndFilterListings(itemId, container);
            });
        });

        filterToggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = btn.dataset.filterType;
                priceFilterGroup.style.display = (filterType === 'price') ? 'flex' : 'none';
                quantityFilterGroup.style.display = (filterType === 'quantity') ? 'flex' : 'none';
                applyBtn.style.display = 'block';
                updateSortVisuals();
                sortAndFilterListings(itemId, container);
            });
        });

        applyBtn.addEventListener('click', () => { sortAndFilterListings(itemId, container); });

        container.querySelectorAll('.bazaar-filter-input').forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); input.blur(); sortAndFilterListings(itemId, container); }
            });
            input.addEventListener('blur', () => sortAndFilterListings(itemId, container));
        });
        updateSortVisuals();
    }

    function renderCards(container, listings, marketNum){
        const cardContainer=container.querySelector('.bazaar-card-container');
        if(!cardContainer || !listings) return;
        cardContainer.innerHTML='';
        
        if(listings.length===0){
            const msg = document.createElement('div');
            msg.style.cssText='color:#fff;text-align:center;padding:20px;width:100%;';
            msg.innerHTML = "No bazaar listings match the current filters.";
            cardContainer.appendChild(msg);
            return;
        }

        const bestBuyerId = container.dataset.bestBuyerId;
        // Retrieve the calculated net price
        const marketNetPrice = window._currentMarketNetPrice || 0;

        listings.forEach(listing=>{
            const card=document.createElement('div');
            card.className = "bazaar-card";
            const isVisited=window._visitedBazaars.has(listing.player_id);
            const isBestBuyer = bestBuyerId && listing.player_id == bestBuyerId;
            const bazaarLink = `https://www.torn.com/bazaar.php?userId=${listing.player_id}&highlightItem=${listing.item_id}#/`;
            
            if (isBestBuyer) { card.style.cssText += `border: 2px solid #28a745 !important; background: #333 !important;`; }

            const priceNum = parseFloat(listing.price.toString().replace(/,/g, ''));
            const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
            
            // --- MARGIN CALCULATION AND DISPLAY ---
            let marginHTML = '';
            
            if (marketNetPrice > 0) {
                // Margin: (Net Sell Price - Bazaar List Price) / Net Sell Price * 100
                const margin = ((marketNetPrice - priceNum) / marketNetPrice) * 100;
                
                let marginClass = 'diff-text-neutral';
                if (margin > 0.1) { marginClass = 'diff-text-negative'; } // Profit (Green)
                else if (margin < -0.1) { marginClass = 'diff-text-positive'; } // Loss (Red)
                
                const sign = margin >= 0 ? '+' : '';

                // Mgn: on left, % on right
                marginHTML = `
                    <div class="margin-info">
                        <b>Mgn:</b> 
                        <span class="${marginClass}">${sign}${margin.toFixed(2)}%</span>
                    </div>`;
            }
            // --- END MARGIN CALCULATION ---

            let diffTextHTML = '';
            if(marketNum){
                const percent = ((priceNum - marketNum)/marketNum*100).toFixed(1);
                let color = 'gold'; 
                if (percent < -0.5) { color = 'limegreen'; } else if (percent > 0.5) { color = 'red'; } 
                const sign = percent > 0 ? '+' : '';
                diffTextHTML = `<span style="font-weight:bold; color:${color}; font-size: 12px; margin-left: auto; white-space: nowrap; flex-shrink: 0;">${sign}${percent}%</span>`;
            }

            const playerLinkStyle = isVisited?'#800080':'#1E90FF';

            // --- CARD STRUCTURE ---
            card.innerHTML=`
                <a href="${bazaarLink}" target="_blank"
                    style="font-weight:bold; color:${playerLinkStyle}; text-decoration:none; cursor:pointer; 
                           overflow: hidden; white-space: nowrap; text-overflow: ellipsis; 
                           line-height: 1.1; padding: 0; margin: 0 0 3px 0; display: block;">
                    ${listing.player_name || 'Unknown'}
                </a>
                <div class="bazaar-card-line-1">
                    ${formattedPrice}
                </div>
                <div class="bazaar-card-line-2">
                    <span style="white-space: nowrap;">Qty: ${listing.quantity}</span>
                    ${diffTextHTML}
                </div>
                <div class="bazaar-card-line-3">
                    ${marginHTML} 
                </div>
            `;
            // --- END CARD STRUCTURE ---
            
            card.addEventListener('click', (e)=>{
                if(e.target.tagName === 'A') return;
                if(listing.player_id){
                    window._visitedBazaars.add(listing.player_id);
                    const nameLink = card.querySelector('a:first-child');
                    if(nameLink) nameLink.style.color='#800080';
                }
                window.open(bazaarLink, '_blank');
            });
            cardContainer.appendChild(card);
        });
    }

    // ----------------------------------------------------------------------
    // --- CORE FETCH LOGIC ---
    // ----------------------------------------------------------------------
    
    function fetchTornExchangeData(itemId, callback) {
        let marketValue = null; 
        let bestBuyer = null;
        let requestsCompleted = 0;
        
        const checkCompletion = () => {
             requestsCompleted++;
             if (requestsCompleted === 2) {
                 if (bestBuyer && bestBuyer.trader) {
                     fetchUpvoteCountAndId(bestBuyer.trader, (count, id) => {
                         callback(marketValue, bestBuyer, count, id);
                     });
                 } else {
                     callback(marketValue, bestBuyer, null, null);
                 }
             }
        };
        
        GM_xmlhttpRequest({
            method: "GET", url: `https://tornexchange.com/api/te_price?item_id=${itemId}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.status === 'success' && data.data && data.data.te_price) { 
                        window._marketValueCache[itemId] = data.data.te_price; 
                        marketValue = `$${Math.round(data.data.te_price).toLocaleString()}`; 
                    }
                } catch (e) { /* silent fail, as per V 1.0 */ }
                checkCompletion();
            },
            onerror: function() { checkCompletion(); }
        });
        
        GM_xmlhttpRequest({
            method: "GET", url: `https://tornexchange.com/api/best_listing?item_id=${itemId}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.status === 'success' && data.data) {
                        if (data.data.price) { bestBuyer = { price: data.data.price, trader: data.data.trader || null }; }
                    }
                } catch (e) { /* silent fail, as per V 1.0 */ }
                checkCompletion();
            },
            onerror: function() { checkCompletion(); }
        });
    }

    function fetchBazaarListings(itemId, infoContainer) {
        GM_xmlhttpRequest({
            method:"GET",
            url:`https://weav3r.dev/api/marketplace/${itemId}`,
            onload:function(response){
                try{
                    const data = JSON.parse(response.responseText); 
                    const listingsReceived = data.listings ? data.listings.length : 0;
                    
                    if(!data || !data.listings || listingsReceived === 0){
                        renderNoListingsMessage(infoContainer, false);
                        return;
                    }
                    
                    const allListings = data.listings.map(l=>({
                        player_name:l.player_name, player_id:l.player_id, quantity:l.quantity, price:l.price, item_id:l.item_id
                    }));

                    window._cachedListings[itemId] = allListings;
                    sortAndFilterListings(itemId, infoContainer); 

                } catch(e){
                    console.error(`[Bazaar + TE Info PDA Version Error] Failed to process Weaver API response for item ${itemId}:`, e);
                    renderNoListingsMessage(infoContainer, true);
                }
            },
            onerror:function(error){
                console.error(`[Bazaar + TE Info PDA Version Error] GM_xmlhttpRequest failed for item ${itemId}:`, error);
                renderNoListingsMessage(infoContainer, true);
            }
        });
    }

    function updateInfoContainer(wrapper, itemId, itemName) {
        const infoContainer = createInfoContainer(itemName, itemId, null, null, null, null);
        wrapper.insertBefore(infoContainer, wrapper.firstChild);

        fetchTornExchangeData(itemId, (marketValue, bestBuyer, upvoteCount, traderId) => {
            
            let bestBuyerInfoHTML = '';
            if (bestBuyer && bestBuyer.price) {
                const formattedPrice = `$${Math.round(bestBuyer.price).toLocaleString()}`;
                const priceDisplayHTML = `<span class="price-display-span" style="color:lime; font-weight:bold; white-space:nowrap; font-size: 16px;">${formattedPrice}</span>`;
                if (bestBuyer.trader && traderId) {
                    const traderLinkHTML = `<a href="https://www.torn.com/profiles.php?XID=${traderId}" target="_blank" style="color:#1E90FF; text-decoration:none; font-weight:bold; cursor:pointer;" onmouseover="this.style.textDecoration='underline';" onmouseout="this.style.textDecoration='none';">${bestBuyer.trader}</a>`;
                    const upvoteText = upvoteCount ? ` (⭐ ${upvoteCount})` : ''; 
                    bestBuyerInfoHTML = `<span style="flex-shrink: 0;">Best Trader: ${priceDisplayHTML}</span><span style="flex-grow: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis;">by ${traderLinkHTML}${upvoteText}</span>`;
                } else {
                     bestBuyerInfoHTML = `<span style="flex-shrink: 0;">Best Trader: ${formattedPrice}</span>`;
                }
            } else {
                 bestBuyerInfoHTML = `<span style="flex-shrink: 0;">No Best Trader Data</span>`;
            }

            const newBestBuyerHTML = `<div class="best-buyer-line">${bestBuyerInfoHTML}</div>`;
            const oldBestBuyer = infoContainer.querySelector('.best-buyer-line');
            if (oldBestBuyer && oldBestBuyer.parentNode) {
                 const tempDiv = document.createElement('div');
                 tempDiv.innerHTML = newBestBuyerHTML;
                 oldBestBuyer.parentNode.replaceChild(tempDiv.firstChild, oldBestBuyer);
            }
            
            const marketText = marketValue ? ` (MV: ${marketValue})` : '';
            const itemNameEl = infoContainer.querySelector('.bazaar-title');
            if (itemNameEl) {
                itemNameEl.innerHTML = `${itemName}<span style="color:#FFD700; flex-shrink: 0; font-size: 14px;">${marketText}</span>`;
            }

            // Re-render the listings if they are cached to update the Market Value % difference
            if (window._cachedListings[itemId]) {
                sortAndFilterListings(itemId, infoContainer);
            }
        });

        fetchBazaarListings(itemId, infoContainer);
    }

    // ----------------------------------------------------------------------
    // --- MAIN EXECUTION & MONITORS ---
    // ----------------------------------------------------------------------
    
    function processBazaarOrMarketItem(){
        if (!window.location.href.match(/(itemmarket|bazaar|page)\.php/i)) return;
        
        const itemId = extractItemId();
        if (!itemId) return;

        let wrapper = null;
        let itemName = '';
        
        if (isMobileView) {
            const sellerListWrapper = document.querySelector('ul.sellerList__e4C9, ul[class*="sellerList"]');
            if (!sellerListWrapper) return;
            wrapper = sellerListWrapper.parentNode;
            
            const headerEl = document.querySelector('.itemsHeader__ZTO9r .title__ruNCT, [class*="itemsHeader"] [class*="title"]');
            itemName = headerEl ? headerEl.textContent.trim() : "Unknown";
        } else {
            const itemDetails = document.querySelector('[class*="item-details"], [class*="item-info-desc"]');
            if (!itemDetails) return;
            wrapper = itemDetails.closest('.content-wrapper > .content') || itemDetails.parentElement;

            const nameEl = itemDetails.querySelector('h3.item-name, [class*="item-name"], .title');
            if (nameEl) { itemName = nameEl.textContent.trim(); }
        }

        if (!wrapper || !itemName) return;

        const existingContainer = document.querySelector(`.bazaar-info-container`);
        const existingContainerForCurrentItem = document.querySelector(`.bazaar-info-container[data-itemid="${itemId}"]`);

        if (existingContainerForCurrentItem) {
             return;
        }

        if (existingContainer && existingContainer.dataset.itemid !== itemId) {
             console.log(`[Bazaar + TE Info PDA Version] Removing old container for item ${existingContainer.dataset.itemid}.`);
             existingContainer.remove();
        }

        if (!document.querySelector('.bazaar-info-container')) {
             updateInfoContainer(wrapper, itemId, itemName);
        }
    }

    // URL Monitor
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            document.querySelectorAll('.bazaar-info-container').forEach(el => el.remove());
            lastUrl = window.location.href;
            window._cachedListings = {}; 
            window._marketValueCache = {}; 
            window._activeSort = { type: 'price', dir: 'asc' }; 
            window._currentMarketNetPrice = 0; // Reset net price on navigation
        }
    }, 500); 

    // Mutation Observer
    const observer = new MutationObserver(()=>{ 
        processBazaarOrMarketItem(); 
    });

    observer.observe(document.body, {childList:true,subtree:true});
    processBazaarOrMarketItem(); // Initial run on page load
    
})();

// --- Bazaar Page Green Highlight ---
;(() => {
    const params = new URLSearchParams(window.location.search);
    const itemIdToHighlight = params.get("highlightItem");
    if (!itemIdToHighlight) return;
    
    const observer = new MutationObserver(() => {
        const imgs = document.querySelectorAll("img");
        imgs.forEach((img) => {
            if (img.src.includes(`images/items/${itemIdToHighlight}/`)) {
                img.closest("div")?.style.setProperty("outline", "3px solid green", "important");
                img.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();