// ==UserScript==
// @name          Bazaar + TE Info PC Version
// @namespace     https://weav3r.dev/
// @version       2.4.2
// @description   Shows Bazaar listing on Item Market with TE Data. Includes Item Market Profit Calculator and uses robust loading logic. Optimizations added for input lag and comma formatting.
// @author        WTV [3281931]
// @match         https://www.torn.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @connect       weav3r.dev
// @connect       tornexchange.com
// @run-at        document-idle
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/554659/Bazaar%20%2B%20TE%20Info%20PC%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/554659/Bazaar%20%2B%20TE%20Info%20PC%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global State Variables
    window._visitedBazaars = new Set();
    window._cachedListings = {};
    window._activeSort = { type: 'price', dir: 'asc' };
    window._marketValueCache = {};
    window._currentMarketNetPrice = 0;

    // --- CSS INJECTION (No functional changes from v2.9.4) ---
    GM_addStyle(`
        /* General Styles (No Change) */
        .bazaar-info-container { border: 1px solid #888; margin: 10px 0; padding: 5px; background: #222; color: #fff; }
        .bazaar-info-header { font-weight: bold; margin-bottom: 5px; display: flex; flex-wrap: nowrap; justify-content: space-between; align-items: center; font-size: 14px; }
        .bazaar-title { flex-grow: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bazaar-market-value { color: #FFD700; flex-shrink: 0; font-size: 14px; }
        .bazaar-count-info { font-size: 13px; color: #aaa; font-weight: normal; flex-shrink: 0; margin-left: 10px; }
        .best-buyer-line { font-weight: bold; margin-bottom: 5px; color: #FFA500; display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: center; gap: 5px; font-size: 14px; }
        .best-buyer-line .price-display { color: lime; font-weight: bold; white-space: nowrap; font-size: 16px; }
        .best-buyer-line .trader-link { color: #1E90FF; text-decoration: none; font-weight: bold; cursor: pointer; }
        .best-buyer-line .te-listings-link { color: #00BFFF; font-size: 14px; text-decoration: none; white-space: nowrap; margin-left: 5px; font-weight: bold; }
        .best-buyer-line .trader-link:visited { color: #800080; }
        .bazaar-item-id { color: #aaa; font-size: 13px; font-weight: bold; white-space: nowrap; margin-left: auto; }
        .bazaar-control-row { display: flex; flex-direction: column; gap: 8px; margin: 5px 0 8px 0; }
        .bazaar-control-line { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .bazaar-price-controls, .bazaar-quantity-controls { display: flex; gap: 4px; align-items: center; flex-shrink: 0; white-space: nowrap; }
        .bazaar-filter-toggle-btn { background: #555; color: white; border: none; padding: 4px 8px; cursor: pointer; font-weight: bold; height: 28px; width: 65px; font-size: 12px; transition: background 0.2s; }
        .bazaar-sort-visuals { display: flex; flex-direction: column; height: 28px; justify-content: center; align-items: center; padding-right: 4px; }
        .bazaar-sort-btn { color: #555; font-weight: bold; cursor: pointer; font-size: 14px; line-height: 1; margin: 0; padding: 0; transition: color 0.2s; }
        .bazaar-filter-inputs-group { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .bazaar-filter-group-price, .bazaar-filter-group-quantity { display: none; align-items: center; gap: 4px; flex-shrink: 0; }
        .bazaar-filter-input { width: 70px; padding: 4px; background: #333; border: 1px solid #444; color: white; height: 28px; box-sizing: border-box; font-size: 12px; }
        .bazaar-filter-group-quantity .bazaar-filter-input { width: 60px; }
        .bazaar-apply-btn { background: #28a745; color: white; border: none; padding: 4px 8px; cursor: pointer; font-weight: bold; height: 28px; flex-shrink: 0; font-size: 12px; display: none; }
        .bazaar-reset-all-btn { background: #444; color: white; border: none; padding: 4px 8px; cursor: pointer; font-weight: bold; height: 28px; flex-shrink: 0; font-size: 14px; margin-left: 5px; }

        /* Market Calculator Styles */
        .bazaar-market-calc {
            display: flex; align-items: center; gap: 10px; padding: 5px 0 10px 0;
            border-top: 1px dashed #444;
            margin-top: 10px;
            overflow-x: auto;
            padding-bottom: 5px;
        }
        .bazaar-calc-label { font-weight: bold; color: #ddd; font-size: 14px; white-space: nowrap; }

        /* Arrow Removal */
        .bazaar-calc-input {
            width: 100px; padding: 4px; background: #333; border: 1px solid #444; color: white; height: 28px; box-sizing: border-box; font-size: 12px;
            -moz-appearance: textfield;
        }
        .bazaar-calc-input::-webkit-outer-spin-button,
        .bazaar-calc-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .bazaar-net-profit { font-weight: bold; color: limegreen; font-size: 14px; white-space: nowrap; }

        /* Spinner Styles (No Change) */
        .bazaar-loading-overlay {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            color: #aaa;
            font-size: 16px;
            font-weight: bold;
        }
        .bazaar-loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
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

        .bazaar-card-container { display: flex; overflow-x: auto; padding: 5px; gap: 5px; }
        .bazaar-card-container::-webkit-scrollbar { height: 8px; }
        .bazaar-card-container::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
        .bazaar-card { border: 1px solid #444; background: #222; color: #eee; padding: 10px; margin: 2px; width: 125px; flex-shrink: 0; cursor: pointer; display: flex; flex-direction: column; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px; transition: transform 0.2s, border 0.2s, background 0.2s; position: relative; gap: 3px; }
        .bazaar-card:not(.is-best-buyer):hover { border-color: #555 !important; background: #2a2a2a !important; }
        .bazaar-card.is-best-buyer { border: 2px solid #28a745 !important; background: #333 !important; }
        .bazaar-card.is-best-buyer:hover { background: #3a3a3a !important; }
        .bazaar-card a { font-weight: bold; text-decoration: none; cursor: pointer; font-size: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bazaar-card a:link { color: #1E90FF; }
        .bazaar-card a:visited { color: #800080; }
        .bazaar-card a:hover { text-decoration: underline; }
        .bazaar-card .price-info { font-size: 14px; white-space: nowrap; }
        .bazaar-card .qty-diff-info { font-size: 14px; display: flex; justify-content: space-between; align-items: baseline; line-height: 1; margin-bottom: 0; }
        .bazaar-card .diff-text-positive { color: red; font-weight: bold; }
        .bazaar-card .diff-text-negative { color: limegreen; font-weight: bold; }
        .bazaar-card .diff-text-neutral { color: gold; font-weight: bold; }
    `);
    // --- END CSS INJECTION ---

    // --- UTILITY & API FUNCTIONS (No changes) ---

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

    function fetchUpvoteCountAndId(userName) {
        return new Promise(resolve => {
            const url = `https://tornexchange.com/prices/${userName}/`;
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: function(response) {
                    let upvoteCount = null;
                    let tornXID = null;
                    try {
                        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        const upvoteElement = doc.querySelector('#vote-score');
                        if (upvoteElement) {
                             upvoteCount = upvoteElement.textContent.trim().replace(/[^\d]/g, '');
                        }

                        const profileLink = doc.querySelector('a[href*="profiles.php?XID="]');
                        if (profileLink) {
                            const href = profileLink.getAttribute('href');
                            const match = href.match(/XID=(\d+)/);
                            if (match && match[1]) { tornXID = match[1]; }
                        }
                    } catch (e) { /* silent fail */ }
                    resolve({ upvoteCount, tornXID });
                },
                onerror: function() { resolve({ upvoteCount: null, tornXID: null }); }
            });
        });
    }

    async function fetchTornExchangeData(itemId) {
        let marketValue = '';
        let bestBuyer = null;
        let upvoteCount = null;
        let tornXID = null;

        const [tePriceData, bestListingData] = await Promise.all([
            fetchApi(`https://tornexchange.com/api/te_price?item_id=${itemId}`),
            fetchApi(`https://tornexchange.com/api/best_listing?item_id=${itemId}`)
        ]);

        if (tePriceData && tePriceData.data && tePriceData.data.te_price) {
            const price = tePriceData.data.te_price;
            window._marketValueCache[itemId] = price;
            marketValue = `$${Math.round(price).toLocaleString()}`;
        }

        if (bestListingData && bestListingData.data && bestListingData.data.price) {
            bestBuyer = {
                price: bestListingData.data.price,
                trader: bestListingData.data.trader || null
            };

            if (bestBuyer.trader) {
                const profile = await fetchUpvoteCountAndId(bestBuyer.trader);
                upvoteCount = profile.upvoteCount ? parseInt(profile.upvoteCount) : 0;
                tornXID = profile.tornXID;
            }
        }

        return { marketValue, bestBuyer, upvoteCount, tornXID };
    }


    // --- RENDERING FUNCTIONS (MODIFIED HTML TEMPLATE) ---

    // Removes the spinner from the final info container (Bazaar data fetch)
    function removeSpinner(container) {
        const spinner = container.querySelector('.bazaar-loading-overlay');
        if (spinner) {
            spinner.remove();
        }
    }

    // Removes the initial spinner from the wrapper (TE data fetch)
    function removeInitialSpinner(wrapper) {
        const initialSpinner = wrapper.querySelector('[data-loading-phase="initial"]');
        if (initialSpinner) {
            initialSpinner.remove();
        }
    }

    // Shows initial spinner in the wrapper
    function showInitialSpinner(wrapper) {
         const loadingHTML = `
            <div class="bazaar-loading-overlay" data-loading-phase="initial" style="margin-top: 10px; border: 1px solid #888; background: #222;">
                <div class="bazaar-loader"></div>
                Loading TE & Bazaar Data...
            </div>
        `;
        // Insert right at the top of the wrapper
        wrapper.insertAdjacentHTML('afterbegin', loadingHTML);
    }

    function renderMessage(container, isError){
        removeSpinner(container);
        const cardContainer = container.querySelector('.bazaar-card-container');
        if(!cardContainer) return;
        cardContainer.innerHTML = '';
        const msg = document.createElement('div');
        msg.className = 'bazaar-message';
        msg.style.cssText='color:#fff;text-align:center;padding:20px;width:100%;';
        msg.innerHTML = isError ? "API Error<br><span style='font-size:12px;color:#ccc;'>Could not fetch bazaar data. (Weaver API)</span>"
                                 : "No bazaar listings available for this item.";
        cardContainer.appendChild(msg);

        const countSpan = container.querySelector('.bazaar-count-info');
        if(countSpan) countSpan.textContent = '';
    }

    function createBestBuyerFragment(bestBuyer, upvoteCount, tornXID, encodedItemName) {
        const fragment = document.createDocumentFragment();
        const listingsLink = `https://tornexchange.com/listings?model_name_contains=${encodedItemName}&order_by=&status=`;

        const teListingsLink = document.createElement('a');
        teListingsLink.href = listingsLink;
        teListingsLink.target = '_blank';
        teListingsLink.className = 'te-listings-link';
        teListingsLink.textContent = '(TE Listings)';


        if (bestBuyer && bestBuyer.price && bestBuyer.trader) {
            const formattedPrice = `$${Math.round(bestBuyer.price).toLocaleString()}`;
            const traderName = bestBuyer.trader;

            const priceSpan = document.createElement('span');
            priceSpan.style.whiteSpace = 'nowrap';
            priceSpan.innerHTML = `Best Trader: <span class="price-display">${formattedPrice}</span>`;

            const traderSpan = document.createElement('span');
            traderSpan.style.whiteSpace = 'nowrap';
            traderSpan.textContent = 'by ';

            if (tornXID) {
                const profileLink = `https://www.torn.com/profiles.php?XID=${tornXID}`;
                const traderLink = document.createElement('a');
                traderLink.href = profileLink;
                traderLink.target = '_blank';
                traderLink.className = 'trader-link';
                traderLink.textContent = traderName;
                traderLink.setAttribute('rel', 'noopener noreferrer');
                traderLink.setAttribute('data-linkclump', 'false');
                traderLink.addEventListener('click', (e) => e.stopPropagation());

                traderSpan.appendChild(traderLink);
            } else {
                const nameText = document.createElement('span');
                nameText.style.color = '#1E90FF';
                nameText.textContent = traderName;
                traderSpan.appendChild(nameText);
            }

            if (upvoteCount !== null && upvoteCount !== undefined) {
                const upvoteText = document.createTextNode(` (⭐ ${upvoteCount} Upvotes)`);
                traderSpan.appendChild(upvoteText);
            }

            fragment.appendChild(priceSpan);
            fragment.appendChild(traderSpan);
        }

        fragment.appendChild(teListingsLink);

        return fragment;
    }

    function createInfoContainer(itemName, itemId, marketValue, bestBuyer, upvoteCount, tornXID) {
        const container = document.createElement('div');
        container.className = 'bazaar-info-container';
        container.dataset.itemid = itemId;
        if (marketValue) container.dataset.marketValue = marketValue.replace(/\$|,/g, '');
        if (tornXID) container.dataset.bestBuyerId = tornXID;

        const marketText = marketValue ? ` <span class="bazaar-market-value">(Market Value: ${marketValue})</span>` : '';
        const encodedItemName = encodeURIComponent(itemName);

        const bestBuyerFragment = createBestBuyerFragment(bestBuyer, upvoteCount, tornXID, encodedItemName);
        const itemIdHTML = `<span class="bazaar-item-id">Item #: ${itemId}</span>`;

        // 1. Best Buyer Line
        const bestBuyerLine = document.createElement('div');
        bestBuyerLine.className = 'best-buyer-line';
        bestBuyerLine.appendChild(bestBuyerFragment);
        bestBuyerLine.insertAdjacentHTML('beforeend', itemIdHTML);

        // --- Filter and Sort Controls HTML (No changes) ---
        const filterControlsHTML = `
            <div class="bazaar-control-row">
                <div class="bazaar-control-line">
                    <div class="bazaar-price-controls">
                        <button class="bazaar-filter-toggle-btn" data-filter-type="price">Price</button>
                        <div class="bazaar-sort-visuals"><span class="bazaar-sort-btn" data-sort-by="price" data-sort-dir="asc">🔼</span><span class="bazaar-sort-btn" data-sort-by="price" data-sort-dir="desc">🔽</span></div>
                    </div>
                    <div class="bazaar-quantity-controls">
                        <button class="bazaar-filter-toggle-btn" data-filter-type="quantity">Qty</button>
                       <div class="bazaar-sort-visuals"><span class="bazaar-sort-btn" data-sort-by="quantity" data-sort-dir="asc">🔼</span><span class="bazaar-sort-btn" data-sort-by="quantity" data-sort-dir="desc">🔽</span></div>
                    </div>
                    <div class="bazaar-filter-inputs-group">
                        <div class="bazaar-filter-group-price">
                            <input type="number" placeholder="Min Price" class="bazaar-filter-input" data-filter-type="minPrice">
                            <input type="number" placeholder="Max Price" class="bazaar-filter-input" data-filter-type="maxPrice">
                        </div>
                        <div class="bazaar-filter-group-quantity">
                            <input type="number" placeholder="Min Qty" class="bazaar-filter-input" data-filter-type="minQty">
                            <input type="number" placeholder="Max Qty" class="bazaar-filter-input" data-filter-type="maxQty">
                        </div>
                       <button class="bazaar-apply-btn">Apply</button>
                        <button class="bazaar-reset-all-btn" title="Reset Filters and Visited Links">↺</button>
                    </div>
                </div>
            </div>
        `;

        // --- Market Fee Calculation HTML (MODIFIED input type to "text") ---
        const marketCalcHTML = `
            <div class="bazaar-market-calc">
                <span class="bazaar-calc-label" style="font-size: 16px; color: #fff;">Item Market Profit:</span>

                <span class="bazaar-calc-label">Sell Price:</span>
                <input type="text" placeholder="Enter Price" class="bazaar-calc-input" data-calc-type="sellingPrice" pattern="[0-9,]*">

                <span class="bazaar-calc-label">Net after 5% Fee:</span>
                <span class="bazaar-net-profit" data-calc-type="netProfit">$0</span>
            </div>
        `;

         // --- Container Spinner HTML (for Bazaar data fetch only) ---
        const loadingHTML = `
            <div class="bazaar-loading-overlay">
                <div class="bazaar-loader"></div>
                Fetching Bazaar Listings...
            </div>
        `;


        container.innerHTML = `
            <div class="bazaar-info-header">
                <span class="bazaar-title">Bazaar Listings for ${itemName}${marketText}</span>
                <span class="bazaar-count-info"></span>
            </div>
        `;

        container.appendChild(bestBuyerLine);
        container.insertAdjacentHTML('beforeend', filterControlsHTML);
        container.insertAdjacentHTML('beforeend', marketCalcHTML);
        container.insertAdjacentHTML('beforeend', loadingHTML);
        container.insertAdjacentHTML('beforeend', '<div class="bazaar-card-container"></div>');

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


    // --- Core Logic (MODIFIED Helper Function) ---

    // New function to handle comma formatting on the text input
    function formatNumberInput(input) {
        // Get the cursor position before cleaning
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const previousValue = input.value;
        const previousLength = previousValue.length;

        // 1. Clean value: Remove all non-digit characters (including old commas)
        const cleanValue = previousValue.replace(/[^\d]/g, '');

        // 2. Format value: Apply formatting using locale settings (creates new commas)
        let formattedValue = '';
        if (cleanValue) {
            // Use Number.toLocaleString to add commas based on user's locale
            formattedValue = Number(cleanValue).toLocaleString('en-US', { maximumFractionDigits: 0 });
        }

        // 3. Update the input field display
        input.value = formattedValue;

        // 4. Adjust the cursor position to keep it stable
        const newLength = formattedValue.length;
        const diff = newLength - previousLength;
        const newCursorPosition = start + diff;

        // Only set the selection if the input is actively focused
        if (document.activeElement === input) {
            input.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    }


    function sortAndFilterListings(itemId, container) {
        let listings = window._cachedListings[itemId];
        if (!listings) return;
        const sortType = window._activeSort.type;
        const sortDir = window._activeSort.dir;
        const minPrice = parseFloat(container.querySelector('[data-filter-type="minPrice"]').value) || null;
        const maxPrice = parseFloat(container.querySelector('[data-filter-type="maxPrice"]').value) || null;
        const minQty = parseInt(container.querySelector('[data-filter-type="minQty"]').value) || null;
        const maxQty = parseInt(container.querySelector('[data-filter-type="maxQty"]').value) || null;
        const isFiltered = minPrice !== null || maxPrice !== null || minQty !== null || maxQty !== null;

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
            } else {
                primaryValA = parseInt(a.quantity);
                primaryValB = parseInt(b.quantity);
            }
            let comparison = 0;
            if (sortDir === 'asc') { comparison = primaryValA - primaryValB; }
            else if (sortDir === 'desc') { comparison = primaryValB - primaryValA; }
            if (comparison === 0) {
                 const priceA = parseFloat(a.price.toString().replace(/,/g, ''));
                 const priceB = parseFloat(b.price.toString().replace(/,/g, ''));
                 return priceA - priceB;
            }
            return comparison;
        });

        const marketNum = window._marketValueCache[itemId] || null;
        renderCards(container, filteredListings, marketNum, isFiltered);
    }

    function resetAllState(container, itemId) {
        window._visitedBazaars.clear();
        container.querySelector('[data-filter-type="minPrice"]').value = '';
        container.querySelector('[data-filter-type="maxPrice"]').value = '';
        container.querySelector('[data-filter-type="minQty"]').value = '';
        container.querySelector('[data-filter-type="maxQty"]').value = '';
        sortAndFilterListings(itemId, container);
    }

    function addFilterListeners(container, itemId) {
        const priceFilterGroup = container.querySelector('.bazaar-filter-group-price');
        const quantityFilterGroup = container.querySelector('.bazaar-filter-group-quantity');
        const sortBtns = container.querySelectorAll('.bazaar-sort-btn');
        const filterToggleBtns = container.querySelectorAll('.bazaar-filter-toggle-btn');
        const applyBtn = container.querySelector('.bazaar-apply-btn');
        const resetAllBtn = container.querySelector('.bazaar-reset-all-btn');
        const defaultColor = '#555';
        const activeColor = '#00BFFF';
        const reverseColor = '#dc3545';

        const updateSortVisuals = () => {
             filterToggleBtns.forEach(btn => {
                 const filterType = btn.dataset.filterType;
                 if (filterType === window._activeSort.type) { btn.style.background = activeColor; } else { btn.style.background = defaultColor; }
             });
             sortBtns.forEach(btn => {
                 const type = btn.dataset.sortBy;
                 const dir = btn.dataset.sortDir;
                 let color = defaultColor;
                 if (type === window._activeSort.type && dir === window._activeSort.dir) { color = dir === 'asc' ? activeColor : reverseColor; } else if (type === window._activeSort.type) { color = '#777'; }
                 btn.style.color = color;
             });
        };

        sortBtns.forEach(btn => { btn.addEventListener('click', () => { window._activeSort.type = btn.dataset.sortBy; window._activeSort.dir = btn.dataset.sortDir; updateSortVisuals(); sortAndFilterListings(itemId, container); }); });
        filterToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterType = btn.dataset.filterType;
                const targetGroup = filterType === 'price' ? priceFilterGroup : quantityFilterGroup;
                const wasActive = btn.classList.contains('active-filter');
                priceFilterGroup.style.display = 'none'; quantityFilterGroup.style.display = 'none'; applyBtn.style.display = 'none';
                filterToggleBtns.forEach(b => b.classList.remove('active-filter'));
                if (!wasActive) { targetGroup.style.display = 'flex'; applyBtn.style.display = 'block'; btn.classList.add('active-filter'); }
                updateSortVisuals();
                sortAndFilterListings(itemId, container);
            });
        });

        applyBtn.addEventListener('click', () => { sortAndFilterListings(itemId, container); });
        if (resetAllBtn) { resetAllBtn.addEventListener('click', () => { resetAllState(container, itemId); }); }
        updateSortVisuals();
        const initialPriceToggle = container.querySelector('.bazaar-filter-toggle-btn[data-filter-type="price"]');
        if (initialPriceToggle) {
             initialPriceToggle.style.background = activeColor;
             initialPriceToggle.classList.add('active-filter');
             priceFilterGroup.style.display = 'flex';
             applyBtn.style.display = 'block';
        }
        container.querySelectorAll('.bazaar-filter-input').forEach(input => {
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); input.blur(); sortAndFilterListings(itemId, container); } });
            input.addEventListener('blur', () => sortAndFilterListings(itemId, container));
        });
    }

    function addMarketFeeListener(container) {
        const sellingPriceInput = container.querySelector('[data-calc-type="sellingPrice"]');
        const netProfitSpan = container.querySelector('[data-calc-type="netProfit"]');

        function updateProfit() {
            // IMPORTANT: Remove commas from the displayed input value before parsing
            let price = parseInt(sellingPriceInput.value.replace(/[^\d]/g, ''));
            let netProfit = 0;

            // Only proceed if a valid price > 0 is input
            if (isNaN(price) || price <= 0) {
                netProfitSpan.textContent = '$0';
                netProfitSpan.style.color = 'limegreen';
                window._currentMarketNetPrice = 0;

                // If the calculator is reset/empty, re-render cards to clear margin visuals
                if (window._cachedListings[container.dataset.itemid]) {
                    renderCards(container, window._cachedListings[container.dataset.itemid], window._marketValueCache[container.dataset.itemid] || null, false);
                }
                return;
            }

            netProfit = Math.floor(price * 0.95);
            window._currentMarketNetPrice = netProfit;

            const itemId = container.dataset.itemid;
            const listings = window._cachedListings[itemId];
            let cheapestBazaarPrice = Infinity;

            if (listings && listings.length > 0) {
                 cheapestBazaarPrice = listings.reduce((min, listing) => {
                     const currentPrice = parseFloat(listing.price.toString().replace(/,/g, ''));
                     return currentPrice < min ? currentPrice : min;
                 }, Infinity);
            }

            const formattedProfit = `$${netProfit.toLocaleString()}`;
            netProfitSpan.textContent = formattedProfit;

            if (cheapestBazaarPrice > 0 && cheapestBazaarPrice < netProfit) {
                netProfitSpan.style.color = 'red';
            } else if (netProfit > 0) {
                netProfitSpan.style.color = 'limegreen';
            } else {
                netProfitSpan.style.color = 'limegreen';
            }

            // Re-render cards only after a valid price is committed
            if (window._cachedListings[itemId]) {
                 sortAndFilterListings(itemId, container);
            }
        }

        // --- ADDED INPUT LISTENERS FOR FORMATTING ---
        // Format on every keystroke
        sellingPriceInput.addEventListener('input', () => formatNumberInput(sellingPriceInput));

        // Format on focus loss and trigger calculation
        sellingPriceInput.addEventListener('blur', () => {
            formatNumberInput(sellingPriceInput);
            updateProfit();
        });

        // Explicitly handle the 'Enter' key for a quick calculation trigger (remains the same)
        sellingPriceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sellingPriceInput.blur(); // Triggers the 'blur' event, which calls updateProfit
            }
        });

        // Initial trigger for change event listener
        sellingPriceInput.addEventListener('change', updateProfit);

        // Initial run to set profit to $0 (still needed to initialize state)
        updateProfit();
    }

    function renderCards(container, listings, marketNum, isFiltered){
        removeSpinner(container);
        const cardContainer=container.querySelector('.bazaar-card-container');
        if(!cardContainer || !listings) return;
        cardContainer.innerHTML='';
        if(listings.length===0){
            const msg = document.createElement('div');
            msg.style.cssText='color:#fff;text-align:center;padding:20px;width:100%;';
            msg.innerHTML = isFiltered ? "No bazaar listings match the current filters." : "No bazaar listings available for this item.";
            cardContainer.appendChild(msg);
            return;
        }

        const marketNetPrice = window._currentMarketNetPrice || 0;

        const countSpan = container.querySelector('.bazaar-count-info');
        if (countSpan) {
            const totalListings = window._cachedListings[container.dataset.itemid].length;
            if (isFiltered && listings.length < totalListings) { countSpan.innerHTML = `(Displaying ${listings.length} Listings - Filtered)`; countSpan.style.color = '#FFA500'; }
            else if (totalListings > 100) { countSpan.innerHTML = `(Displaying 100+ Listings)`; countSpan.style.color = 'orange'; }
            else if (totalListings > 0) { countSpan.innerHTML = `(Displaying ${totalListings} Listings)`; countSpan.style.color = '#aaa'; }
            else { countSpan.textContent = ''; }
        }

        const bestBuyerId = container.dataset.bestBuyerId;
        listings.forEach(listing=>{
            const card=document.createElement('div');
            card.className = 'bazaar-card';
            card.dataset.playerId = listing.player_id;
            const isVisited=window._visitedBazaars.has(listing.player_id);
            const isBestBuyer = bestBuyerId && listing.player_id == bestBuyerId;
            if (isBestBuyer) card.classList.add('is-best-buyer');

            const bazaarLink = `https://www.torn.com/bazaar.php?userId=${listing.player_id}&highlightItem=${listing.item_id}#/`;
            if(!isVisited){
                card.addEventListener('mouseenter', ()=>card.style.transform='scale(1.03)');
                card.addEventListener('mouseleave', ()=>card.style.transform='scale(1)');
            }

            const priceNum = parseFloat(listing.price.toString().replace(/,/g, ''));
            const formattedPrice = `$${Math.round(priceNum).toLocaleString()}`;
            let diffTextHTML = '';

            if(marketNum){
                const percent = ((priceNum - marketNum)/marketNum*100).toFixed(1);
                let diffClass = 'diff-text-neutral';
                if (percent < -0.5) { diffClass = 'diff-text-negative'; }
                else if (percent > 0.5) { diffClass = 'diff-text-positive'; }
                const sign = percent > 0 ? '+' : '';
                diffTextHTML = `<span class="${diffClass}">${sign}${percent}%</span>`;
            }

            let marginHTML = '';
            // Only show margin calculation if the user has entered a valid sell price (> 0)
            if (marketNetPrice > 0) {
                if (marketNetPrice >= priceNum) {
                    const margin = ((marketNetPrice - priceNum) / marketNetPrice) * 100;
                    const marginClass = margin > 0 ? 'diff-text-negative' : 'diff-text-neutral';
                    marginHTML = `
                        <div class="margin-info" style="font-size: 14px; white-space: nowrap;">
                            <b>Margin:</b> <span class="${marginClass}">${margin.toFixed(2)}%</span>
                        </div>`;
                } else {
                     marginHTML = `<div class="margin-info" style="font-size: 14px; white-space: nowrap;"><b>Margin:</b> <span class="diff-text-positive">Loss</span></div>`;
                }
            }


            card.innerHTML=`
                <a href="${bazaarLink}" target="_blank" data-linkclump="true" class="player-link">
                    ${listing.player_name || 'Unknown'}
                </a>
                <div class="price-info"><b>Price:</b> ${formattedPrice}</div>
                <div class="qty-diff-info">
                    <span style="white-space: nowrap;"><b>Qty:</b> ${listing.quantity}</span>
                    <span style="white: nowrap;">${diffTextHTML}</span>
                </div>
                ${marginHTML}
            `;
            card.addEventListener('click', (e)=>{
                const link = e.currentTarget.querySelector('a:first-child');
                if(listing.player_id && link){
                    window._visitedBazaars.add(listing.player_id);
                    link.style.color='#800080';
                }
            });
            cardContainer.appendChild(card);
        });
    }

    // --- MAIN EXECUTION FLOW (No changes) ---

    async function updateInfoContainer(wrapper,itemId,itemName){
        let infoContainer=document.querySelector(`.bazaar-info-container[data-itemid="${itemId}"]`);

        if(!infoContainer){
            // Initial fetch starts (TE data)
            const { marketValue, bestBuyer, upvoteCount, tornXID } = await fetchTornExchangeData(itemId);

            // Remove the initial spinner once TE data is done
            removeInitialSpinner(wrapper);

            infoContainer = createInfoContainer(itemName, itemId, marketValue, bestBuyer, upvoteCount, tornXID);
            wrapper.insertBefore(infoContainer, wrapper.firstChild);

            fetchBazaarListings(itemId, infoContainer);

        } else {
             if (window._cachedListings[itemId]) {
                 sortAndFilterListings(itemId, infoContainer);
             }
        }
    }

    function fetchBazaarListings(itemId, infoContainer){
        GM_xmlhttpRequest({
            method:"GET",
            url:`https://weav3r.dev/api/marketplace/${itemId}`,
            onload:function(response){
                removeSpinner(infoContainer);
                try{
                    const data = JSON.parse(response.responseText);
                    const listingsReceived = data.listings ? data.listings.length : 0;
                    const countSpan = infoContainer.querySelector('.bazaar-count-info');
                    if (countSpan) {
                          if (listingsReceived > 100) { countSpan.innerHTML = `(Displaying 100+ Listings)`; countSpan.style.color = 'orange'; }
                          else if (listingsReceived > 0) { countSpan.innerHTML = `(Displaying ${listingsReceived} Listings)`; countSpan.style.color = '#aaa'; }
                          else { countSpan.textContent = ''; }
                    }

                    if(!data || !data.listings || listingsReceived === 0){
                        renderMessage(infoContainer,false);
                        return;
                    }

                    const allListings = data.listings.map(l=>({
                        player_name:l.player_name, player_id:l.player_id, quantity:l.quantity, price:l.price, item_id:l.item_id
                    }));

                    window._cachedListings[itemId] = allListings;
                    sortAndFilterListings(itemId, infoContainer);

                } catch(e){
                    console.error(`%c[BazaarScript Error] Failed to process Weaver API response for item ${itemId}:`, 'color: red; font-weight: bold;', e);
                    renderMessage(infoContainer,true);
                }
            },
            onerror:function(error){
                removeSpinner(infoContainer);
                console.error(`%c[BazaarScript Error] GM_xmlhttpRequest failed for item ${itemId}:`, 'color: red; font-weight: bold;', error);
                renderMessage(infoContainer,true);
            }
        });
    }

    function processSellerWrapper(wrapper){
        if(!wrapper || wrapper.dataset.bazaarProcessed) return;
        const itemTile = wrapper.closest('[class*="itemTile"]') || wrapper.previousElementSibling;
        if(!itemTile) return;
        let nameEl = itemTile.querySelector('div[class*="name"]') || itemTile.querySelector('div');
        const btn = itemTile.querySelector('button[aria-controls*="itemInfo"]');
        if(!nameEl || !btn) return;
        const itemName = nameEl.textContent.trim();
        const idParts = btn.getAttribute('aria-controls').split('-');
        const itemId = idParts[idParts.length-1];
        wrapper.dataset.bazaarProcessed='true';

        // Show the initial loading spinner immediately
        showInitialSpinner(wrapper);

        updateInfoContainer(wrapper,itemId,itemName);
    }

    // --- SCRIPT EXECUTION AND MONITORS (No changes) ---

    function processAllSellerWrappers(root = document.body) {
        const sellerWrappers = root.querySelectorAll('[class*="sellerListWrapper"]');
        sellerWrappers.forEach(wrapper => processSellerWrapper(wrapper));
    }

    const observer = new MutationObserver(() => {
        processAllSellerWrappers();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    processAllSellerWrappers();

})();

// --- Bazaar Page Green Highlight (No changes) ---
(function(){
    const params=new URLSearchParams(window.location.search);
    const itemIdToHighlight=params.get('highlightItem');
    if(!itemIdToHighlight) return;
    const observer=new MutationObserver(()=>{
        const imgs=document.querySelectorAll('img');
        imgs.forEach(img=>{
            if(img.src.includes(`/images/items/${itemIdToHighlight}/`)){
                 img.closest('div')?.style.setProperty('outline','3px solid green','important');
                 img.scrollIntoView({behavior:'smooth', block:'center'});
            }
            const itemDetailsContainer = document.querySelector('[aria-labelledby*="itemInfo"]');
            if (itemDetailsContainer) {
                const itemImg = itemDetailsContainer.querySelector(`img[src*="/images/items/${itemIdToHighlight}/"]`);
                if (itemImg) {
                    itemImg.closest('div')?.style.setProperty('outline','3px solid green','important');
                }
            }
        });
    });
    observer.observe(document.body,{childList:true,subtree:true});
})();