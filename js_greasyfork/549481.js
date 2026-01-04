// ==UserScript==
// @name         Steam Bulk Sell Helper
// @namespace    http://tampermonkey.net/
// @version      3.1.3
// @description  Mass sell Steam inventory items with preview and auto-confirm modes
// @author       Steam Bulk Seller
// @match        https://steamcommunity.com/*/inventory*
// @match        https://steamcommunity.com/id/*/inventory*
// @match        https://gg.deals/*
// @match        https://*.gg.deals/*
// @match        https://store.steampowered.com/*
// @match        https://*.store.steampowered.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549481/Steam%20Bulk%20Sell%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/549481/Steam%20Bulk%20Sell%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        DELAY_BETWEEN_REQUESTS: 3000, // 3 seconds between price checks
        DELAY_BETWEEN_LISTINGS: 5000, // 5 seconds between listings
        MAX_RETRIES: 3,
        STEAM_TAX: 0.15, // Steam takes 15% total (5% Steam + 10% game)
        DEFAULT_MARKUP: 0, // Default markup percentage
    };

    // State management
    let selectedItems = new Map();
    let priceCache = new Map();
    let isProcessing = false;
    let lastEstimatedProfit = 0;
    let sessionID = null;

    function isSteamInventoryPage() {
        const url = location.href;
        return /steamcommunity\.com\/.+\/inventory/.test(url);
    }

    function isOnSteamStore() {
        return window.location.hostname.includes('steampowered.com');
    }

    function isOnGGDeals() {
        return window.location.hostname.includes('gg.deals') || window.location.hostname.includes('ggdeals');
    }

    // Initialize the extension
    function init() {
        if (isSteamInventoryPage()) {
        console.log('Steam Bulk Sell Helper initialized');

        getSessionID();

        waitForInventory().then(() => {
            injectUI();
            attachEventListeners();
        });
            return;
        }

        gelConverterInit();
    }

    // Get Steam session ID for API requests
    function getSessionID() {
        try {
            sessionID = unsafeWindow.g_sessionID ||
                        document.querySelector('[name="sessionid"]')?.value ||
                        /sessionid=([^&]+)/.exec(document.cookie)?.[1];
            console.log('Session ID obtained:', sessionID ? 'Yes' : 'No');
        } catch (e) {
            console.error('Failed to get session ID:', e);
        }
    }

    // Wait for inventory to be loaded
    function waitForInventory() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const inventoryPage = document.querySelector('#inventories');
                if (inventoryPage && unsafeWindow.g_ActiveInventory) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 500);
        });
    }

    // Inject UI elements
    function injectUI() {
        // Create control panel
        const controlPanel = document.createElement('div');
        controlPanel.id = 'bulk-sell-panel';
        controlPanel.innerHTML = `
            <style>
                #bulk-sell-panel {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    width: 320px;
                    background: linear-gradient(135deg, #1e3c5a 0%, #2a475e 100%);
                    border: 2px solid #66c0f4;
                    border-radius: 10px;
                    padding: 15px;
                    z-index: 10000;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    font-family: "Motiva Sans", Arial, sans-serif;
                    color: #c7d5e0;
                }

                #bulk-sell-panel h3 {
                    margin: 0 0 15px 0;
                    color: #66c0f4;
                    text-align: center;
                    font-size: 18px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .bsp-control-group {
                    margin-bottom: 12px;
                    background: rgba(0,0,0,0.2);
                    padding: 10px;
                    border-radius: 5px;
                }

                .bsp-control-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 12px;
                    color: #8f98a0;
                    text-transform: uppercase;
                }

                .bsp-input {
                    width: 100%;
                    padding: 8px;
                    background: #16202d;
                    border: 1px solid #3d4c5d;
                    border-radius: 4px;
                    color: #c7d5e0;
                    font-size: 14px;
                }

                .bsp-input:focus {
                    outline: none;
                    border-color: #66c0f4;
                    box-shadow: 0 0 5px rgba(102,192,244,0.3);
                }

                .bsp-button {
                    width: 100%;
                    padding: 10px;
                    margin: 5px 0;
                    background: linear-gradient(to bottom, #66c0f4 0%, #4a9fd5 100%);
                    border: none;
                    border-radius: 4px;
                    color: #ffffff;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }

                .bsp-button:hover:not(:disabled) {
                    background: linear-gradient(to bottom, #7dd0f7 0%, #5aa9dd 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                }

                .bsp-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .bsp-button.danger {
                    background: linear-gradient(to bottom, #d94432 0%, #b7372a 100%);
                }

                .bsp-button.danger:hover:not(:disabled) {
                    background: linear-gradient(to bottom, #e55443 0%, #c4453a 100%);
                }

                #selected-count {
                    text-align: center;
                    font-size: 16px;
                    margin: 10px 0;
                    color: #66c0f4;
                    font-weight: bold;
                }

                #progress-bar {
                    width: 100%;
                    height: 20px;
                    background: #16202d;
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 10px 0;
                    display: none;
                    border: 1px solid #3d4c5d;
                }

                #progress-fill {
                    height: 100%;
                    background: linear-gradient(to right, #66c0f4 0%, #4a9fd5 100%);
                    width: 0%;
                    transition: width 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                }

                #status-message {
                    text-align: center;
                    margin: 10px 0;
                    font-size: 12px;
                    color: #8f98a0;
                    min-height: 20px;
                }

                .item-checkbox {
                    position: absolute;
                    top: 5px;
                    left: 5px;
                    width: 20px;
                    height: 20px;
                    z-index: 100;
                    cursor: pointer;
                    accent-color: #66c0f4;
                }

                .item-price-preview {
                    position: absolute;
                    bottom: 5px;
                    left: 5px;
                    right: 5px;
                    background: rgba(0,0,0,0.8);
                    color: #66c0f4;
                    padding: 2px 4px;
                    font-size: 11px;
                    border-radius: 3px;
                    z-index: 99;
                    text-align: center;
                }

                .preset-buttons {
                    display: flex;
                    gap: 5px;
                    margin-top: 5px;
                }

                .preset-btn {
                    flex: 1;
                    padding: 5px;
                    background: #16202d;
                    border: 1px solid #3d4c5d;
                    border-radius: 3px;
                    color: #8f98a0;
                    cursor: pointer;
                    font-size: 11px;
                }

                .preset-btn:hover {
                    background: #1e2d3d;
                    border-color: #66c0f4;
                    color: #c7d5e0;
                }

                #total-profit {
                    background: rgba(102,192,244,0.1);
                    border: 1px solid #66c0f4;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px 0;
                    text-align: center;
                }

                #total-profit .amount {
                    font-size: 20px;
                    color: #66c0f4;
                    font-weight: bold;
                }

                #total-profit .label {
                    font-size: 11px;
                    color: #8f98a0;
                    text-transform: uppercase;
                    margin-top: 5px;
                }
            </style>

            <h3>🚀 Steam Bulk Sell Helper</h3>

            <div class="bsp-control-group">
                <label>Selection</label>
                <div style="display: flex; gap: 5px;">
                    <button id="select-all" class="bsp-button" style="flex: 1;">Select All</button>
                    <button id="deselect-all" class="bsp-button" style="flex: 1;">Deselect All</button>
                </div>
                <button id="select-marketable" class="bsp-button">Select Marketable Only</button>
            </div>

            <div id="selected-count">Selected: 0 items</div>

            <div class="bsp-control-group">
                <label>Price Adjustment (%)</label>
                <input type="number" id="markup-percent" class="bsp-input"
                       value="0" min="-50" max="100" step="1">
                <div class="preset-buttons">
                    <button class="preset-btn" data-value="-10">-10%</button>
                    <button class="preset-btn" data-value="-5">-5%</button>
                    <button class="preset-btn" data-value="0">Market</button>
                    <button class="preset-btn" data-value="5">+5%</button>
                    <button class="preset-btn" data-value="10">+10%</button>
                </div>
            </div>

            <div class="bsp-control-group">
                <label>Min Price Override (leave empty for market price)</label>
                <input type="number" id="min-price" class="bsp-input"
                        placeholder="Optional: override minimum price" min="0" step="0.01">
            </div>

            <div id="total-profit">
                <div class="amount" id="profit-amount">$0.00</div>
                <div class="label">Estimated Profit (after fees)</div>
            </div>

            <button id="preview-prices" class="bsp-button" title="Opens Steam dialogs with prices filled for review. You manually confirm each.">📋 Preview Prices</button>
            <button id="start-selling" class="bsp-button danger" title="Automatically lists items by opening dialogs and confirming them.">🚀 Start Auto-Selling</button>
            <button id="stop-selling" class="bsp-button danger" style="display: none;">⏹ Stop</button>

            <div id="progress-bar">
                <div id="progress-fill">0%</div>
            </div>

            <div id="status-message"></div>
        `;

        document.body.appendChild(controlPanel);

        // Make panel draggable
        makeDraggable(controlPanel);
    }

    // Make panel draggable
    function makeDraggable(element) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = element.querySelector('h3');
        header.style.cursor = 'move';

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === header) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // Attach event listeners
    function attachEventListeners() {
        // Selection buttons
        document.getElementById('select-all').addEventListener('click', selectTradingCards);
        document.getElementById('deselect-all').addEventListener('click', deselectAll);
        document.getElementById('select-marketable').addEventListener('click', selectMarketableCards);

        // Action buttons
        document.getElementById('preview-prices').addEventListener('click', previewPrices);
        document.getElementById('start-selling').addEventListener('click', startSelling);
        document.getElementById('stop-selling').addEventListener('click', stopSelling);

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('markup-percent').value = btn.dataset.value;
                updateProfitEstimate();
            });
        });

        // Markup change
        document.getElementById('markup-percent').addEventListener('input', updateProfitEstimate);

        // Observe inventory changes
        observeInventoryChanges();

        setupSellDialogInputFix();
    }

    // Add checkboxes to inventory items
    function addCheckboxesToItems() {
        const items = document.querySelectorAll('.itemHolder:not(.disabled)');

        items.forEach(item => {
            if (item.querySelector('.item-checkbox')) return;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'item-checkbox';

            checkbox.addEventListener('change', (e) => {
                const itemElement = item.querySelector('.item');
                if (!itemElement) {
                    console.warn('[Checkbox] No item element found');
                    return;
                }

                // Try to get item ID from different sources
                let itemId = itemElement.id || itemElement.getAttribute('id');
                console.log(`[Checkbox] Raw ID from element.id: "${itemId}"`);

                // If ID doesn't start with 'item', try data attributes
                if (!itemId || !itemId.startsWith('item')) {
                    // Check for data-* attributes
                    const dataId = itemElement.dataset.id ||
                                  itemElement.getAttribute('data-id') ||
                                  itemElement.getAttribute('data-item-id');
                    console.log(`[Checkbox] Data attribute: "${dataId}"`);
                    if (dataId) itemId = dataId;
                }

                // Remove 'item' prefix if present
                const cleanId = itemId.replace(/^item/, '');
                console.log(`[Checkbox] Clean ID: "${cleanId}"`);

                // Parse format: [classid]_[appid]_[assetid] or [appid]_[contextid]_[assetid]
                const parts = cleanId.split('_');
                console.log(`[Checkbox] ID parts:`, parts);

                if (parts.length < 3) {
                    console.error('[Checkbox] Invalid ID format, expected at least 3 parts:', cleanId);
                    return;
                }

                const appid = parts[0];
                const contextid = parts[1];
                const assetid = parts[2];

                console.log(`[Checkbox] Parsed - AppID: ${appid}, ContextID: ${contextid}, AssetID: ${assetid}`);

                const itemData = {
                    appid: appid,
                    contextid: contextid,
                    assetid: assetid,
                    element: item
                };

                const key = `${itemData.appid}_${itemData.contextid}_${itemData.assetid}`;

                if (e.target.checked) {
                    selectedItems.set(key, itemData);
                    console.log(`[Checkbox] ✓ Selected:`, itemData);
                } else {
                    selectedItems.delete(key);
                    console.log(`[Checkbox] ✗ Deselected:`, key);
                }

                updateSelectedCount();
            });

            item.style.position = 'relative';
            item.appendChild(checkbox);
        });
    }

    // Observe inventory changes
    function observeInventoryChanges() {
        const observer = new MutationObserver(() => {
            setTimeout(addCheckboxesToItems, 100);
        });

        const inventoryContainer = document.querySelector('#inventories');
        if (inventoryContainer) {
            observer.observe(inventoryContainer, {
                childList: true,
                subtree: true
            });
        }

        // Initial checkbox addition
        addCheckboxesToItems();
    }

    // Selection functions
    function isTradingCard(itemHolder) {
        const itemElement = itemHolder.querySelector('.item');
        if (!itemElement) return false;
        let itemId = itemElement.id || itemElement.getAttribute('id') || itemElement.dataset.id || itemElement.getAttribute('data-id') || itemElement.getAttribute('data-item-id');
        if (!itemId) return false;
        const cleanId = itemId.replace(/^item/, '');
        const parts = cleanId.split('_');
        if (parts.length < 3) return false;
        const appid = parts[0];
        const assetid = parts[2];
        const inv = unsafeWindow.g_ActiveInventory;
        const base = inv?.m_rgAssets?.[assetid];
        const descSources = [inv?.rgDescriptions, inv?.m_rgDescriptions, unsafeWindow?.g_rgDescriptions, inv?.m_owner?.rgDescriptions];
        let descriptions = null;
        for (let i = 0; i < descSources.length; i++) { if (descSources[i]) { descriptions = descSources[i]; break; } }
        const desc = base && descriptions ? descriptions[`${base.classid}_${base.instanceid || '0'}`] : null;
        const tags = desc?.tags || [];
        const isCardByTag = tags.some(t => String(t.category).toLowerCase() === 'item_class' && String(t.localized_tag_name).toLowerCase().includes('trading card'));
        const isSteamCommunityApp = String(appid) === '753';
        const isCardByType = typeof desc?.type === 'string' && desc.type.toLowerCase().includes('trading card');
        return isSteamCommunityApp && (isCardByTag || isCardByType);
    }

    function selectTradingCards() {
        document.querySelectorAll('.item-checkbox').forEach(cb => {
            const holder = cb.closest('.itemHolder');
            const shouldSelect = holder && isTradingCard(holder);
            cb.checked = !!shouldSelect;
            cb.dispatchEvent(new Event('change'));
        });
    }

    function deselectAll() {
        document.querySelectorAll('.item-checkbox').forEach(cb => {
            cb.checked = false;
            cb.dispatchEvent(new Event('change'));
        });
        selectedItems.clear();
        updateSelectedCount();
    }

    function selectMarketableCards() {
        deselectAll();

        const items = document.querySelectorAll('.itemHolder:not(.disabled)');
        items.forEach(item => {
            const itemElement = item.querySelector('.item');
            if (!itemElement) return;

            if (!isTradingCard(item)) return;

            const checkbox = item.querySelector('.item-checkbox');
            if (checkbox && !item.classList.contains('not-marketable')) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }

    // Update selected count display
    function updateSelectedCount() {
    document.getElementById('selected-count').textContent =
        `Selected: ${selectedItems.size} items`;

        // Show placeholder when no prices cached
        if (selectedItems.size > 0) {
            const hasCachedPrices = Array.from(selectedItems.values()).some(item => {
                const activeInventory = unsafeWindow.g_ActiveInventory;
                const itemData = activeInventory?.m_rgAssets?.[item.assetid];
                if (itemData && itemData.market_hash_name) {
                    const cacheKey = `${item.appid}_${itemData.market_hash_name}`;
                    return priceCache.has(cacheKey);
                }
                return false;
            });

            if (!hasCachedPrices) {
                if (lastEstimatedProfit > 0) {
                    document.getElementById('profit-amount').textContent = `$${lastEstimatedProfit.toFixed(2)}`;
                    document.getElementById('profit-amount').style.fontSize = '20px';
                } else {
                document.getElementById('profit-amount').textContent = 'Click "Preview Prices"';
                document.getElementById('profit-amount').style.fontSize = '14px';
                return;
                }
            } else {
                document.getElementById('profit-amount').style.fontSize = '20px';
            }
        }

        updateProfitEstimate();
    }

    // Get market price for an item
    async function getMarketPrice(appid, market_hash_name) {
        const cacheKey = `${appid}_${market_hash_name}`;

        // Check cache first
        if (priceCache.has(cacheKey)) {
            const cached = priceCache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
                console.log(`[Cache Hit] ${market_hash_name}: $${cached.price}`);
                return cached.price;
            }
        }

        return new Promise((resolve) => {
            const url = `https://steamcommunity.com/market/priceoverview/?appid=${appid}&currency=1&market_hash_name=${encodeURIComponent(market_hash_name)}`;

            console.log(`[API Request] ${market_hash_name}`);
            console.log(`[URL] ${url}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    console.log(`[Response Status] ${response.status} for ${market_hash_name}`);
                    console.log(`[Response Text] ${response.responseText.substring(0, 200)}`);

                    try {
                        const data = JSON.parse(response.responseText);
                        console.log(`[Parsed Data]`, data);

                        if (data.success && data.lowest_price) {
                            // Parse price - handle different formats
                            const priceStr = data.lowest_price.replace(/[^\d.,]/g, '').replace(',', '.');
                            const price = parseFloat(priceStr);

                            console.log(`[Price String] "${data.lowest_price}" -> [Parsed] ${price}`);

                            if (!isNaN(price) && price > 0) {
                                priceCache.set(cacheKey, {
                                    price: price,
                                    timestamp: Date.now()
                                });
                                console.log(`[Success] Cached price for ${market_hash_name}: $${price}`);
                                resolve(price);
                            } else {
                                console.error(`[Error] Invalid price: ${priceStr}`);
                                resolve(null);
                            }
                        } else {
                            console.warn(`[No Data] Success=${data.success}, has lowest_price=${!!data.lowest_price}`);
                            resolve(null);
                        }
                    } catch (e) {
                        console.error(`[Parse Error]`, e);
                        console.error(`[Raw Response]`, response.responseText);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error(`[Request Failed]`, error);
                    resolve(null);
                },
                ontimeout: function() {
                    console.error(`[Timeout] Request timed out for ${market_hash_name}`);
                    resolve(null);
                }
            });
        });
    }

    // Preview prices for selected items - now opens Steam dialogs with prices filled
    async function previewPrices() {
        if (selectedItems.size === 0) {
            showStatus('No items selected', 'error');
            return;
        }

        const markup = parseFloat(document.getElementById('markup-percent').value) || 0;
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;

        if (!confirm(`Open sell dialogs for ${selectedItems.size} items?\n\nEach dialog will have the minimum price pre-filled.\nYou can review and adjust prices before selling.`)) {
            return;
        }

        showStatus('Opening sell dialogs...', 'info');
        document.getElementById('progress-bar').style.display = 'block';
        isProcessing = true;

        let processed = 0;
        const totalToProcess = selectedItems.size;
        let totalProfit = 0;
        let successCount = 0;
        const itemsArray = Array.from(selectedItems);

        console.log(`[Preview] Opening dialogs for ${selectedItems.size} items`);
        console.log(`[Preview] Markup: ${markup}%, Min Price: $${minPrice}`);

        for (let i = 0; i < itemsArray.length; i++) {
            if (!isProcessing) break;

            const [key, item] = itemsArray[i];

            try {
                const activeInventory = unsafeWindow.g_ActiveInventory;
                let itemData = activeInventory?.m_rgAssets?.[item.assetid];

                if (itemData) {
                    const descSources = [
                        activeInventory?.rgDescriptions,
                        activeInventory?.m_rgDescriptions,
                        unsafeWindow?.g_rgDescriptions,
                        activeInventory?.m_owner?.rgDescriptions
                    ];
                    let descriptions = null;
                    for (let j = 0; j < descSources.length; j++) {
                        if (descSources[j]) { descriptions = descSources[j]; break; }
                    }
                    if (descriptions) {
                        const descKey = `${itemData.classid}_${itemData.instanceid || '0'}`;
                        const description = descriptions[descKey];
                        if (description) itemData = { ...itemData, ...description };
                    }
                }

                if (itemData && itemData.marketable && itemData.market_hash_name) {
                    showStatus(`Opening dialog for ${itemData.name} (${i + 1}/${itemsArray.length})...`, 'info');

                    // Get or fetch price
                    const cacheKey = `${item.appid}_${itemData.market_hash_name}`;
                    let marketPrice;

                    if (priceCache.has(cacheKey)) {
                        marketPrice = priceCache.get(cacheKey).price;
                        console.log(`[Preview] Using cached price: $${marketPrice}`);
                    } else {
                        marketPrice = await getMarketPrice(item.appid, itemData.market_hash_name);
                        await sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
                    }

                    if (marketPrice && marketPrice >= minPrice) {
                        const adjustedPrice = marketPrice * (1 + markup / 100);
                        const profit = adjustedPrice * (1 - CONFIG.STEAM_TAX);
                        totalProfit += profit;

                        // Open dialog with price filled
                        const opened = await openSteamSellDialog(item, itemData, adjustedPrice);

                        if (opened) {
                        successCount++;
                            showStatus(`Dialog opened for ${itemData.name}`, 'success');

                        // Add price preview to item
                        addPricePreview(item.element, adjustedPrice, profit);

                            // Give dialog time to fully render
                            await sleep(500);

                            // Wait for user to close dialog before opening next
                            await waitForDialogClose();

                            // Small delay before next item
                            await sleep(500);
                    } else {
                            showStatus(`Failed to open dialog for ${itemData.name}`, 'error');
                    }
                    }
                }

                processed++;
                updateProgress(processed, totalToProcess);

            } catch (e) {
                console.error(`[Preview] Error:`, e);
            }
        }

        isProcessing = false;
        lastEstimatedProfit = totalProfit;
        document.getElementById('profit-amount').textContent = `$${totalProfit.toFixed(2)}`;
        document.getElementById('profit-amount').style.fontSize = '20px';
        document.getElementById('progress-bar').style.display = 'none';
        showStatus(`Preview complete: ${successCount}/${selectedItems.size} dialogs opened`, 'success');

        console.log(`[Preview] Complete. Total profit: $${totalProfit.toFixed(2)}`);
        updateProfitEstimate();
    }

    // Add price preview to item element
    function addPricePreview(element, price, profit) {
        const existing = element.querySelector('.item-price-preview');
        if (existing) existing.remove();

        const preview = document.createElement('div');
        preview.className = 'item-price-preview';
        preview.innerHTML = `$${price.toFixed(2)} (profit: $${profit.toFixed(2)})`;
        element.appendChild(preview);
    }

    // Start selling process - automatically confirms each dialog
    async function startSelling() {
        if (selectedItems.size === 0) {
            showStatus('No items selected', 'error');
            return;
        }

        if (!sessionID) {
            showStatus('Session ID not found. Please refresh the page.', 'error');
            return;
        }

        if (!confirm(`Automatically list ${selectedItems.size} items for sale?\n\nDialogs will open with prices filled and automatically confirmed.`)) {
            return;
        }

        isProcessing = true;
        document.getElementById('start-selling').style.display = 'none';
        document.getElementById('stop-selling').style.display = 'block';
        document.getElementById('progress-bar').style.display = 'block';

        const markup = parseFloat(document.getElementById('markup-percent').value) || 0;
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;

        let processed = 0;
        let successful = 0;
        let failed = 0;

        const itemsArray = Array.from(selectedItems);

        for (let i = 0; i < itemsArray.length; i++) {
            if (!isProcessing) break;

            const [key, item] = itemsArray[i];

            try {
                const activeInventory = unsafeWindow.g_ActiveInventory;
                let itemData = activeInventory?.m_rgAssets?.[item.assetid];

                if (itemData) {
                    const descSources = [
                        activeInventory?.rgDescriptions,
                        activeInventory?.m_rgDescriptions,
                        unsafeWindow?.g_rgDescriptions,
                        activeInventory?.m_owner?.rgDescriptions
                    ];
                    let descriptions = null;
                    for (let j = 0; j < descSources.length; j++) {
                        if (descSources[j]) { descriptions = descSources[j]; break; }
                    }
                    if (descriptions) {
                        const descKey = `${itemData.classid}_${itemData.instanceid || '0'}`;
                        const description = descriptions[descKey];
                        if (description) itemData = { ...itemData, ...description };
                    }
                }

                if (itemData && itemData.marketable && itemData.market_hash_name) {
                    // Get or fetch price
                    const cacheKey = `${item.appid}_${itemData.market_hash_name}`;
                    let marketPrice;

                    if (priceCache.has(cacheKey)) {
                        marketPrice = priceCache.get(cacheKey).price;
                    } else {
                        marketPrice = await getMarketPrice(item.appid, itemData.market_hash_name);
                        await sleep(CONFIG.DELAY_BETWEEN_REQUESTS);
                    }

                    if (marketPrice && marketPrice >= minPrice) {
                        const adjustedPrice = marketPrice * (1 + markup / 100);

                        showStatus(`Listing ${itemData.name} (${i + 1}/${itemsArray.length})...`, 'info');

                        // Open dialog and auto-confirm
                        const listed = await openAndConfirmSellDialog(item, itemData, adjustedPrice);

                        if (listed) {
                            successful++;
                            showStatus(`Listed ${itemData.name} for $${adjustedPrice.toFixed(2)}`, 'success');

                            // Remove item from selection
                            const checkbox = item.element.querySelector('.item-checkbox');
                            if (checkbox) {
                                checkbox.checked = false;
                                checkbox.dispatchEvent(new Event('change'));
                            }
                        } else {
                            failed++;
                            showStatus(`Failed to list ${itemData.name}`, 'error');
                        }

                        // Small delay between items
                        await sleep(CONFIG.DELAY_BETWEEN_LISTINGS);
                    }
                } else {
                    showStatus(`Skipping non-marketable item`, 'warning');
                }

                processed++;
                updateProgress(processed, itemsArray.length);

            } catch (e) {
                console.error('Selling error:', e);
                failed++;
            }
        }

        isProcessing = false;
        document.getElementById('start-selling').style.display = 'block';
        document.getElementById('stop-selling').style.display = 'none';
        document.getElementById('progress-bar').style.display = 'none';

        showStatus(`Completed: ${successful} listed, ${failed} failed`, 'info');
        updateProfitEstimate();
    }

    // Open Steam's sell dialog and automatically click both OK buttons
    async function openAndConfirmSellDialog(item, itemData, buyerPrice) {
        try {
            console.log(`[AutoSell] Opening and confirming dialog for ${itemData.name}`);

            // Step 1: Open the dialog
            const dialogOpened = await openSteamSellDialog(item, itemData, buyerPrice);

            if (!dialogOpened) {
                console.error('[AutoSell] Failed to open dialog');
                return false;
            }

            // Step 2: Wait for dialog to fully render and price to be filled
            console.log('[AutoSell] Waiting for dialog to render...');
            await sleep(1500);

            // Step 3: Click the first "OK, put it up for sale" button
            console.log('[AutoSell] Step 1: Looking for "OK, put it up for sale" button');
            const firstButtonClicked = await clickSellButton();

            if (!firstButtonClicked) {
                console.error('[AutoSell] Failed to click first OK button');
                return false;
            }

            console.log('[AutoSell] ✓ First button clicked, waiting for Steam to process...');

            // Step 4: Wait longer for Steam to process the listing
            await sleep(1500);

            // Step 5: Check for confirmation dialog (Steam Guard, etc.)
            console.log('[AutoSell] Step 2: Checking for confirmation dialog...');
            const secondButtonClicked = await clickConfirmationButton();

            if (secondButtonClicked) {
                console.log('[AutoSell] ✓ Confirmation button clicked');
                await sleep(1000);
            } else {
                console.log('[AutoSell] No confirmation dialog (normal for most items)');
            }

            // Step 6: Wait for all dialogs to close completely
            console.log('[AutoSell] Waiting for dialogs to close...');
            await waitForDialogClose();
            await sleep(500);

            console.log('[AutoSell] ✓ Item listing process completed');
            return true;

        } catch (e) {
            console.error('[AutoSell] Error:', e);
            return false;
        }
    }

    // Click the main "OK, put it up for sale" button
    function clickSellButton() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 15;
            let diagnosticsDone = false;

            const findAndClick = () => {
                attempts++;
                console.log(`[AutoSell] Looking for sell button (attempt ${attempts}/${maxAttempts})`);

                // On first attempt, show diagnostic info - search GLOBALLY
                if (!diagnosticsDone) {
                    diagnosticsDone = true;

                    // Find all potential dialog containers
                    const dialogs = [
                        document.querySelector('.newmodal'),
                        document.querySelector('.market_sell_dialog'),
                        document.querySelector('[class*="DialogContent"]'),
                        document.querySelector('[class*="ModalPosition"]')
                    ];

                    console.log('[AutoSell] === DIAGNOSTICS ===');
                    dialogs.forEach((dlg, i) => {
                        if (dlg) {
                            console.log(`Dialog ${i + 1}: ${dlg.className}`);
                            const btns = dlg.querySelectorAll('button, a, div[role="button"], span[onclick]');
                            btns.forEach((btn, j) => {
                                const computedStyle = window.getComputedStyle(btn);
                                const isReallyVisible = btn.offsetParent !== null &&
                                                       computedStyle.display !== 'none' &&
                                                       computedStyle.visibility !== 'hidden' &&
                                                       computedStyle.opacity !== '0';
                                console.log(`  ${j + 1}. "${btn.textContent.trim()}" | ${btn.tagName} | class: "${btn.className}" | visible: ${isReallyVisible}`);
                            });
                        }
                    });

                    // Also check for buttons in body that might be portaled
                    console.log('[AutoSell] Checking body for visible green buttons...');
                    const bodyButtons = document.querySelectorAll('button, a, span[onclick], div[onclick]');
                    let greenCount = 0;
                    bodyButtons.forEach(btn => {
                        if (btn.offsetParent !== null &&
                            (btn.className.includes('green') || btn.className.includes('market'))) {
                            greenCount++;
                            console.log(`  Green button: "${btn.textContent.trim()}" | class: "${btn.className}"`);
                        }
                    });
                    console.log(`[AutoSell] Found ${greenCount} visible green/market buttons in body`);
                    console.log('[AutoSell] === END DIAGNOSTICS ===');
                }

                // Search globally for visible buttons with market/sell keywords
                const allButtons = document.querySelectorAll('button, a, span[onclick], div[onclick], input[type="submit"]');

                for (const btn of allButtons) {
                    // Check if really visible
                    if (btn.offsetParent === null) continue;

                    const computedStyle = window.getComputedStyle(btn);
                    if (computedStyle.display === 'none' ||
                        computedStyle.visibility === 'hidden' ||
                        computedStyle.opacity === '0') continue;

                    const text = btn.textContent.trim().toLowerCase();
                    const className = btn.className.toLowerCase();

                    // Look for sell/market related buttons
                    if (
                        text.includes('put it up') ||
                        text.includes('ok, put') ||
                        text.includes('ok,put') ||
                        (text.includes('ok') && text.includes('sale')) ||
                        className.includes('market_listing_button') ||
                        (className.includes('btn_green') && (text.includes('ok') || text.includes('sell')))
                    ) {
                        console.log(`[AutoSell] ✓ Found sell button: "${btn.textContent.trim()}" (${btn.tagName}, class: ${btn.className})`);

                        // Use multiple click methods to ensure it works
                        try {
                            // Method 1: Direct click
                            btn.click();

                            // Method 2: MouseEvent
                            const mouseEvent = new MouseEvent('click', {
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            });
                            btn.dispatchEvent(mouseEvent);

                            // Method 3: If it's a link with onclick, trigger it
                            if (btn.onclick) {
                                setTimeout(() => btn.onclick.call(btn), 50);
                            }

                            console.log('[AutoSell] ✓ Multiple click methods dispatched');
                        } catch (e) {
                            console.error('[AutoSell] Click error:', e);
                        }

                        resolve(true);
                        return;
                    }
                }

                // If not found and haven't exceeded attempts, try again
                if (attempts < maxAttempts) {
                    setTimeout(findAndClick, 250);
                } else {
                    console.error('[AutoSell] Could not find sell button after all attempts');
                    resolve(false);
                }
            };

            setTimeout(findAndClick, 200);
        });
    }

    // Click the confirmation "OK" button (for Steam Guard or trade confirmation)
    function clickConfirmationButton() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 10;

            const findAndClick = () => {
                attempts++;
                console.log(`[AutoSell] Looking for confirmation button (attempt ${attempts}/${maxAttempts})`);

                // Look for confirmation dialog buttons
                const allButtons = document.querySelectorAll('button, a, span[onclick], div[onclick], input[type="submit"]');

                for (const btn of allButtons) {
                    if (btn.offsetParent === null) continue;

                    const computedStyle = window.getComputedStyle(btn);
                    if (computedStyle.display === 'none' ||
                        computedStyle.visibility === 'hidden' ||
                        computedStyle.opacity === '0') continue;

                    const text = btn.textContent.trim().toLowerCase();

                    // Look for OK/Confirm buttons in a NEW dialog (not the sell dialog)
                    // These appear for Steam Guard or trade confirmations
                    if (
                        (text === 'ok' || text === 'confirm' || text.includes('confirm')) &&
                        !text.includes('put it up') &&
                        !text.includes('sale') &&
                        (btn.className.includes('green') || btn.className.includes('btn_'))
                    ) {
                        console.log(`[AutoSell] ✓ Found confirmation button: "${btn.textContent.trim()}"`);

                        try {
                            btn.click();
                            const clickEvent = new MouseEvent('click', {
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            });
                            btn.dispatchEvent(clickEvent);
                        } catch (e) {
                            console.error('[AutoSell] Confirmation click error:', e);
                        }

                        resolve(true);
                        return;
                    }
                }

                if (attempts < maxAttempts) {
                    setTimeout(findAndClick, 300);
                } else {
                    // No confirmation needed - this is normal for most items
                    console.log('[AutoSell] No confirmation button found (normal behavior)');
                    resolve(false);
                }
            };

            setTimeout(findAndClick, 300);
        });
    }

    // Open Steam's native sell dialog with pre-filled price (for preview mode)
    async function openSteamSellDialog(item, itemData, buyerPrice) {
        return new Promise((resolve) => {
            try {
                console.log(`[OpenDialog] Opening sell dialog for ${itemData.name}`);
                console.log(`[OpenDialog] AppID: ${item.appid}, ContextID: ${item.contextid}, AssetID: ${item.assetid}`);
                console.log(`[OpenDialog] ClassID: ${itemData.classid}, InstanceID: ${itemData.instanceid || '0'}`);
                console.log(`[OpenDialog] Buyer Price: $${buyerPrice.toFixed(2)}`);

                // Set target price before opening dialog
                if (typeof unsafeWindow.setBulkSellTargetPrice === 'function') {
                    unsafeWindow.setBulkSellTargetPrice(buyerPrice);
                }

                // Get Steam's inventory object
                const inventory = unsafeWindow.g_ActiveInventory;
                if (!inventory) {
                    console.error('[OpenDialog] g_ActiveInventory not found');
                    resolve(false);
                    return;
                }

                // Try to get rgItem from DOM element using Steam's own method
                const itemElement = item.element.querySelector('.item');
                let rgItem = null;

                if (itemElement && typeof inventory.GetItemFromElement === 'function') {
                    console.log('[OpenDialog] Trying GetItemFromElement');
                    rgItem = inventory.GetItemFromElement(itemElement);
                    console.log('[OpenDialog] rgItem from element:', rgItem);
                }

                // If not found, try direct lookup
                if (!rgItem && inventory.m_rgAssets) {
                    console.log('[OpenDialog] Trying direct m_rgAssets lookup');
                    rgItem = inventory.m_rgAssets[item.assetid];
                    console.log('[OpenDialog] rgItem from m_rgAssets:', rgItem);
                }

                // Try different methods to open the dialog for specific item
                try {
                    console.log('[OpenDialog] Available inventory methods:', {
                        SelectItem: typeof inventory.SelectItem,
                        ShowMarketSellDialog: typeof inventory.ShowMarketSellDialog,
                        GetItemFromElement: typeof inventory.GetItemFromElement,
                        hasAssets: !!inventory.m_rgAssets
                    });

                    console.log('[OpenDialog] Available global functions:', {
                        ShowMarketSellDialog: typeof unsafeWindow.ShowMarketSellDialog,
                        SellItemDialog: typeof unsafeWindow.SellItemDialog,
                        g_marketSellDialog: typeof unsafeWindow.g_marketSellDialog
                    });

                    // Method 1: Use rgItem with Steam's SellItemDialog directly
                    if (rgItem) {
                        console.log('[OpenDialog] Trying SellItemDialog with rgItem');
                        console.log('[OpenDialog] rgItem details:', {
                            appid: rgItem.appid,
                            contextid: rgItem.contextid,
                            assetid: rgItem.assetid || rgItem.id,
                            classid: rgItem.classid,
                            amount: rgItem.amount
                        });

                        // Try using global SellItemDialog
                        if (unsafeWindow.SellItemDialog && typeof unsafeWindow.SellItemDialog.Show === 'function') {
                            console.log('[OpenDialog] Using SellItemDialog.Show()');
                            unsafeWindow.SellItemDialog.Show(rgItem);

                            setTimeout(() => {
                                fillBuyerPaysField(buyerPrice);
                                resolve(true);
                            }, 800);
                            return;
                        }

                        // Try creating the dialog using inventory method
                        if (typeof inventory.ShowMarketSellDialog === 'function') {
                            console.log('[OpenDialog] Using inventory.ShowMarketSellDialog()');

                            // Select item first
                            if (typeof inventory.SelectItem === 'function') {
                                inventory.SelectItem(null, rgItem, true);
                            }

                            setTimeout(() => {
                                inventory.ShowMarketSellDialog();
                                setTimeout(() => {
                                    fillBuyerPaysField(buyerPrice);
                                    resolve(true);
                                }, 800);
                            }, 300);
                            return;
                        }

                        console.log('[OpenDialog] Direct methods not available, trying click approach');
                    } else {
                        console.warn('[OpenDialog] rgItem not found, trying alternative methods...');
                    }

                    // Method 2: Direct ShowMarketSellDialog with parameters (if supported)
                    if (typeof unsafeWindow.ShowMarketSellDialog === 'function') {
                        console.log('[OpenDialog] Using ShowMarketSellDialog with item params');
                        unsafeWindow.ShowMarketSellDialog(item.appid, item.contextid, item.assetid);

                        setTimeout(() => {
                            fillBuyerPaysField(buyerPrice);
                            resolve(true);
                        }, 800);
                        return;
                    }

                    // Method 3: Click on item and use direct Steam function to sell
                    console.log('[OpenDialog] Using click + direct sell method');
                    if (!itemElement) {
                        console.error('[OpenDialog] Item element not found');
                        resolve(false);
                        return;
                    }

                    // Click to select the item
                    console.log('[OpenDialog] Clicking item element');
                    itemElement.click();

                    // Give Steam a moment to register the click, then call sell function
                    setTimeout(() => {
                        console.log('[OpenDialog] Attempting to trigger sell dialog after click');

                        // Try multiple approaches in sequence
                        let dialogOpened = false;

                        // Approach 1: Look for Sell button that appeared
                        const sellButtons = document.querySelectorAll('a');
                        for (const btn of sellButtons) {
                            const text = btn.textContent.trim().toLowerCase();
                            if (text === 'sell' && btn.offsetParent !== null && !text.includes('quick')) {
                                console.log('[OpenDialog] Found and clicking Sell button');
                                btn.click();
                                dialogOpened = true;
                                break;
                            }
                        }

                        if (dialogOpened) {
                            setTimeout(() => {
                                fillBuyerPaysField(buyerPrice);
                                resolve(true);
                            }, 800);
                            return;
                        }

                        // Approach 2: Use Steam's internal sell function if available
                        console.log('[OpenDialog] Button not found, trying Steam internal functions');

                        // Try calling SellItemDialog with specific item if it exists
                        if (unsafeWindow.SellItemDialog && unsafeWindow.SellItemDialog.Show) {
                            console.log('[OpenDialog] Calling SellItemDialog.Show with rgItem');
                            unsafeWindow.SellItemDialog.Show(rgItem);
                            setTimeout(() => {
                                fillBuyerPaysField(buyerPrice);
                                resolve(true);
                            }, 800);
                            return;
                        }

                        // Try selecting item and showing dialog via inventory
                        if (rgItem && inventory.SelectItem && inventory.ShowMarketSellDialog) {
                            console.log('[OpenDialog] Selecting item and showing dialog via inventory');
                            inventory.SelectItem(null, rgItem, true);
                            setTimeout(() => {
                                inventory.ShowMarketSellDialog();
                                setTimeout(() => {
                                    fillBuyerPaysField(buyerPrice);
                                    resolve(true);
                                }, 800);
                            }, 200);
                            return;
                        }

                        // Last resort: programmatically construct and show the dialog
                        console.error('[OpenDialog] All methods failed - cannot open dialog');
                        resolve(false);

                    }, 600);

                } catch (e) {
                    console.error('[OpenDialog] Error in dialog opening:', e);
                    resolve(false);
                }

            } catch (e) {
                console.error('[OpenDialog] Error:', e);
                resolve(false);
            }
        });
    }

    // Fill the "Buyer pays" field in Steam's sell dialog
    function fillBuyerPaysField(price) {
        try {
            console.log(`[FillPrice] Setting target price: $${price.toFixed(2)}`);

            // Use the new method to set target price
            if (typeof unsafeWindow.setBulkSellTargetPrice === 'function') {
                unsafeWindow.setBulkSellTargetPrice(price);
            }

            // Also try direct filling as fallback
            setTimeout(() => {
                const buyerInput = document.querySelector('#market_sell_buyercurrency_input');

                if (buyerInput) {
                    const priceStr = price.toFixed(2);
                    console.log(`[FillPrice] Direct filling buyer pays: ${priceStr}`);

                    // Set the value
                    buyerInput.value = priceStr;

                    // Trigger all necessary events for Steam to recognize the change
                    buyerInput.dispatchEvent(new Event('input', { bubbles: true }));
                    buyerInput.dispatchEvent(new Event('change', { bubbles: true }));
                    buyerInput.dispatchEvent(new Event('keyup', { bubbles: true }));
                    buyerInput.dispatchEvent(new Event('blur', { bubbles: true }));

                    // Focus the field
                    buyerInput.focus();

                    // Also update receive field
                    const receiveInput = document.querySelector('#market_sell_currency_input');
                    if (receiveInput) {
                        const youReceive = (price * (1 - CONFIG.STEAM_TAX)).toFixed(2);
                        receiveInput.value = youReceive;
                        receiveInput.dispatchEvent(new Event('input', { bubbles: true }));
                        receiveInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    console.log('[FillPrice] Price field filled successfully');
                } else {
                    console.warn('[FillPrice] Buyer pays input field not found yet, waiting...');
                }
            }, 200);

            return true;
        } catch (e) {
            console.error('[FillPrice] Error:', e);
            return false;
        }
    }

    // Wait for the sell dialog to be closed
    function waitForDialogClose() {
        return new Promise((resolve) => {
            // Check if dialog exists
            const checkDialog = () => {
                // Check multiple possible dialog selectors
                const dialogs = [
                    document.querySelector('.newmodal'),
                    document.querySelector('.market_sell_dialog'),
                    document.querySelector('#market_sell_dialog'),
                    document.querySelector('div[class*="DialogContent"]'),
                    document.querySelector('div[class*="ModalPosition"]')
                ];

                for (const dialog of dialogs) {
                    if (dialog) {
                        const style = window.getComputedStyle(dialog);
                        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                        if (isVisible) {
                            console.log('[WaitDialog] Found visible dialog:', dialog.className);
                            return dialog;
                        }
                    }
                }

                return null;
            };

            // Wait a bit for dialog to appear first
            console.log('[WaitDialog] Waiting for dialog to appear...');

            let appearCheckAttempts = 0;
            const maxAppearAttempts = 20; // 4 seconds

            const waitForAppear = setInterval(() => {
                appearCheckAttempts++;
                const dialog = checkDialog();

                if (dialog) {
                    console.log('[WaitDialog] Dialog appeared, now waiting for close...');
                    clearInterval(waitForAppear);

                    // Now wait for it to close
                    const pollInterval = setInterval(() => {
                        if (!checkDialog()) {
                            console.log('[WaitDialog] Dialog closed');
                            clearInterval(pollInterval);
                            resolve();
                        }
                    }, 500);

                    // Timeout after 60 seconds
                    setTimeout(() => {
                        clearInterval(pollInterval);
                        console.log('[WaitDialog] Timeout - proceeding anyway');
                        resolve();
                    }, 60000);

                } else if (appearCheckAttempts >= maxAppearAttempts) {
                    console.log('[WaitDialog] Dialog did not appear within timeout, proceeding');
                    clearInterval(waitForAppear);
                    resolve();
                }
            }, 200);
        });
    }

    // List item on market (kept for backward compatibility, not used in new flow)
    async function listItem(item, itemData, price) {
        return new Promise((resolve) => {
            // price - это желаемая цена для покупателя (buyer pays)
            // ВАЖНО: Steam API принимает параметр 'price' как сумму "You receive" (что получит продавец после комиссии)
            // Steam затем рассчитывает "Buyer pays" = "You receive" / (1 - tax)
            //
            // Чтобы установить правильную цену для покупателя, нужно конвертировать:
            // Если мы хотим: Buyer pays = X
            // То отправляем: You receive = X * (1 - tax)
            // Тогда Steam покажет: Buyer pays = [X * (1 - tax)] / (1 - tax) = X ✓
            const youReceivePrice = price * (1 - CONFIG.STEAM_TAX);
            const priceInCents = Math.round(youReceivePrice * 100);

            const body = new URLSearchParams();
            body.append('sessionid', String(sessionID || ''));
            body.append('appid', String(item.appid));
            body.append('contextid', String(item.contextid));
            body.append('assetid', String(item.assetid));
            body.append('amount', '1');
            body.append('price', String(priceInCents)); // "You receive" в центах

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://steamcommunity.com/market/sellitem/',
                data: body.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Origin': 'https://steamcommunity.com',
                    'Referer': window.location.href
                },
                onload: function(response) {
                    try {
                        const text = String(response.responseText || '');
                        let data;
                        try {
                            data = JSON.parse(text);
                        } catch {
                            data = {};
                        }
                        const ok = data.success === true || data.requires_confirmation === true || data.needs_confirmation === true;
                        if (!ok) {
                            console.error('[SellItem] Unexpected response', { status: response.status, text: text.slice(0, 500) });
                        }
                        resolve(ok);
                    } catch (e) {
                        console.error('List item error:', e);
                        resolve(false);
                    }
                },
                onerror: function(err) {
                    console.error('[SellItem] Request error', err);
                    resolve(false);
                },
                ontimeout: function() {
                    console.error('[SellItem] Request timeout');
                    resolve(false);
                }
            });
        });
    }
    // Stop selling process
    function stopSelling() {
        isProcessing = false;
        showStatus('Stopping...', 'info');
    }

    // Update profit estimate
    async function updateProfitEstimate() {
        if (selectedItems.size === 0) {
            lastEstimatedProfit = 0;
            document.getElementById('profit-amount').textContent = '$0.00';
            return;
        }

        const markup = parseFloat(document.getElementById('markup-percent').value) || 0;
        const minPriceOverride = parseFloat(document.getElementById('min-price').value);
        let estimatedTotal = 0;
        let minPriceFound = Infinity;

        // Use cached prices for quick estimate
        for (const [key, item] of selectedItems) {
            const activeInventory = unsafeWindow.g_ActiveInventory;
            const itemData = activeInventory?.m_rgAssets?.[item.assetid];

            if (itemData && itemData.market_hash_name) {
                const cacheKey = `${item.appid}_${itemData.market_hash_name}`;
                if (priceCache.has(cacheKey)) {
                    const cached = priceCache.get(cacheKey);
                    const adjustedPrice = cached.price * (1 + markup / 100);
                    const profit = adjustedPrice * (1 - CONFIG.STEAM_TAX);
                    estimatedTotal += profit;

                    // Track minimum price
                    if (cached.price < minPriceFound) {
                        minPriceFound = cached.price;
                    }
                }
            }
        }

        if (estimatedTotal === 0 && lastEstimatedProfit > 0) {
            document.getElementById('profit-amount').textContent = `$${lastEstimatedProfit.toFixed(2)}`;
        } else {
        document.getElementById('profit-amount').textContent = `$${estimatedTotal.toFixed(2)}`;
        }

        // Update min price display if not overridden
        const minPriceInput = document.getElementById('min-price');
        if (!minPriceOverride && minPriceFound !== Infinity) {
            minPriceInput.placeholder = `Market min: $${minPriceFound.toFixed(2)}`;
        }
    }

    // Update progress bar
    function updateProgress(current, total) {
        const percent = Math.round((current / total) * 100);
        const progressFill = document.getElementById('progress-fill');
        progressFill.style.width = `${percent}%`;
        progressFill.textContent = `${percent}%`;
    }

    // Show status message
    function showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('status-message');
        statusDiv.textContent = message;
        statusDiv.style.color = type === 'error' ? '#d94432' :
                                type === 'success' ? '#90ba3c' :
                                type === 'warning' ? '#ffae42' : '#8f98a0';

        console.log(`[Bulk Sell] ${message}`);
    }

        function setupSellDialogInputFix() {
        let isSyncing = false;
        let currentTargetPrice = null;

        const tryAttach = () => {
            const buyer = document.querySelector('#market_sell_buyercurrency_input');
            const receive = document.querySelector('#market_sell_currency_input');
            if (!buyer || !receive) return false;

            // If we have a target price, apply it
            if (currentTargetPrice !== null) {
                console.log('[DialogFix] Applying target price:', currentTargetPrice);
                buyer.value = currentTargetPrice.toFixed(2);
                buyer.dispatchEvent(new Event('input', { bubbles: true }));
                buyer.dispatchEvent(new Event('keyup', { bubbles: true }));
                buyer.dispatchEvent(new Event('change', { bubbles: true }));
                buyer.focus();

                // Also update receive field
                const receiveAmount = (currentTargetPrice * (1 - CONFIG.STEAM_TAX)).toFixed(2);
                receive.value = receiveAmount;
                receive.dispatchEvent(new Event('input', { bubbles: true }));

                currentTargetPrice = null; // Clear after use
            }

            const applyBuyer = value => {
                if (isSyncing) return;
                isSyncing = true;
                buyer.value = value;
                buyer.dispatchEvent(new Event('input', { bubbles: true }));
                buyer.dispatchEvent(new Event('keyup', { bubbles: true }));
                buyer.dispatchEvent(new Event('change', { bubbles: true }));
                isSyncing = false;
            };

            // Sync receive field changes to buyer field
            receive.addEventListener('input', e => {
                if (isSyncing) return;
                const receiveVal = String(e.target.value || '').trim();
                if (receiveVal && !isNaN(parseFloat(receiveVal))) {
                    // Calculate buyer price from receive amount
                    const buyerPrice = (parseFloat(receiveVal) / (1 - CONFIG.STEAM_TAX)).toFixed(2);
                    applyBuyer(buyerPrice);
                }
            });

            setTimeout(() => {
                const buyerVal = String(buyer.value || '').trim();
                const receiveVal = String(receive.value || '').trim();
                if (receiveVal && !buyerVal) {
                    const buyerPrice = (parseFloat(receiveVal) / (1 - CONFIG.STEAM_TAX)).toFixed(2);
                    applyBuyer(buyerPrice);
                } else if (buyerVal) {
                    applyBuyer(buyerVal);
                }
            }, 100);

            return true;
        };

        const mo = new MutationObserver(() => {
            tryAttach();
        });
        mo.observe(document.body, { childList: true, subtree: true });
        tryAttach();

        // Expose function to set target price
        unsafeWindow.setBulkSellTargetPrice = (price) => {
            currentTargetPrice = price;
            console.log('[DialogFix] Target price set:', price);
        };
    }

    // Utility: Sleep function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function gelConverterInit() {
        let exchangeRate = 2.75;
        let processedElements = new WeakSet();
        const defaultSettings = { fontSize: 95, fontWeight: 600, showBackground: true, textColor: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)' };
        function getSiteKey(){ const h=window.location.hostname; if(h.includes('steampowered.com')||h.includes('steamcommunity.com')) return 'steam'; if(h.includes('gg.deals')||h.includes('ggdeals')) return 'ggdeals'; return h.replace(/[^a-z0-9]/gi,'_'); }
        const siteKey=getSiteKey();
        function loadPerSiteSettings(){ try{ const raw=GM_getValue('perSiteSettings','{}'); return JSON.parse(raw||'{}'); }catch{ return {}; } }
        function savePerSiteSettings(o){ try{ GM_setValue('perSiteSettings', JSON.stringify(o)); }catch{} }
        function loadGlobalSettings(){ try{ const raw=GM_getValue('globalSettings'); if(!raw) return Object.assign({},defaultSettings); const parsed=JSON.parse(raw); return Object.assign({},defaultSettings,parsed); }catch{ return Object.assign({},defaultSettings); } }
        function saveGlobalSettings(o){ try{ GM_setValue('globalSettings', JSON.stringify(o)); }catch{} }
        function getActiveSettings(){ const per=loadPerSiteSettings(); const glob=loadGlobalSettings(); const site=per[siteKey]||{}; return { fontSize: typeof site.fontSize!=='undefined'?site.fontSize:glob.fontSize, fontWeight: typeof site.fontWeight!=='undefined'?site.fontWeight:glob.fontWeight, showBackground: typeof glob.showBackground!=='undefined'?glob.showBackground:defaultSettings.showBackground, textColor: glob.textColor||defaultSettings.textColor, backgroundColor: glob.backgroundColor||defaultSettings.backgroundColor }; }
        function saveSettingsFromPanel(s){ const per=loadPerSiteSettings(); const glob=loadGlobalSettings(); per[siteKey]=per[siteKey]||{}; per[siteKey].fontSize=s.fontSize; per[siteKey].fontWeight=s.fontWeight; savePerSiteSettings(per); glob.textColor=s.textColor; glob.backgroundColor=s.backgroundColor; glob.showBackground=s.showBackground; saveGlobalSettings(glob); }
        function resetSiteFontSettings(){ const per=loadPerSiteSettings(); if(per[siteKey]){ delete per[siteKey].fontSize; delete per[siteKey].fontWeight; if(Object.keys(per[siteKey]).length===0) delete per[siteKey]; savePerSiteSettings(per); } }
        function createSettingsPanel(){ const ex=document.getElementById('gel-settings-panel'); if(ex){ ex.remove(); return; } const a=getActiveSettings(); const panel=document.createElement('div'); panel.id='gel-settings-panel'; panel.innerHTML=`<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1e1e1e;border:2px solid #4ade80;border-radius:10px;padding:20px;z-index:999999;min-width:380px;color:#fff;"><h3 style="margin:0 0 12px 0;color:#4ade80;text-align:center;">⚙️ GEL Converter Settings — <span style=\"color:#fff;\">${siteKey}</span></h3><div style=\"margin-bottom:12px;color:#a0a0a0;font-size:12px;\">Настройки шрифта отдельно по сайтам. Цвет и фон — глобальные.</div><div style=\"margin-bottom:15px;\"><label style=\"display:block;margin-bottom:5px;color:#a0a0a0;\">Font Size: <span id=\"font-size-value\" style=\"color:#4ade80;\">${a.fontSize}%</span></label><input type=\"range\" id=\"gel-font-size\" min=\"50\" max=\"150\" value=\"${a.fontSize}\" style=\"width:100%;cursor:pointer;\"></div><div style=\"margin-bottom:15px;\"><label style=\"display:block;margin-bottom:5px;color:#a0a0a0;\">Font Weight: <span id=\"font-weight-value\" style=\"color:#4ade80;\">${a.fontWeight}</span></label><input type=\"range\" id=\"gel-font-weight\" min=\"100\" max=\"900\" step=\"100\" value=\"${a.fontWeight}\" style=\"width:100%;cursor:pointer;\"></div><div style=\"margin-bottom:15px;\"><label style=\"display:block;margin-bottom:5px;color:#a0a0a0;\">Text Color (global):</label><div style=\"display:flex;gap:10px;align-items:center;\"><input type=\"color\" id=\"gel-text-color\" value=\"${a.textColor}\" style=\"width:50px;height:30px;border:none;border-radius:5px;cursor:pointer;\"><input type=\"text\" id=\"gel-text-color-hex\" value=\"${a.textColor}\" style=\"flex:1;background:#2a2a2a;border:1px solid #444;color:#fff;padding:5px;border-radius:3px;\"></div></div><div style=\"margin-bottom:15px;\"><label style=\"display:flex;align-items:center;cursor:pointer;color:#a0a0a0;\"><input type=\"checkbox\" id=\"gel-show-background\" ${a.showBackground?'checked':''} style=\"margin-right:10px;cursor:pointer;\">Show background (global)</label></div><div style=\"margin-bottom:20px;\"><label style=\"display:block;margin-bottom:10px;color:#a0a0a0;\">Preview:</label><div style=\"background:#2a2a2a;padding:15px;border-radius:5px;text-align:center;\"><span style=\"color:#fff;\">$19.99</span><span id=\"preview-gel\" style=\"margin-left:8px;\">₾54.97</span></div></div><div style=\"display:flex;gap:10px;justify-content:center;\"><button id=\"gel-save-settings\" style=\"padding:8px 20px;background:#4ade80;color:#1e1e1e;border:none;border-radius:5px;cursor:pointer;font-weight:bold;\">Save for this site</button><button id=\"gel-reset-settings\" style=\"padding:8px 20px;background:#666;color:#fff;border:none;border-radius:5px;cursor:pointer;\">Reset site font</button><button id=\"gel-close-settings\" style=\"padding:8px 20px;background:#444;color:#fff;border:none;border-radius:5px;cursor:pointer;\">Close</button></div></div>`; document.body.appendChild(panel); function updatePreview(){ const p=document.getElementById('preview-gel'); const fs=document.getElementById('gel-font-size').value; const fw=document.getElementById('gel-font-weight').value; const tc=document.getElementById('gel-text-color').value; const sb=document.getElementById('gel-show-background').checked; p.style.fontSize=`${fs/100}em`; p.style.fontWeight=fw; p.style.color=tc; if(sb){ p.style.background='rgba(74, 222, 128, 0.1)'; p.style.padding='2px 6px'; p.style.borderRadius='3px'; } else { p.style.background='none'; p.style.padding='0'; } }
            document.getElementById('gel-font-size').addEventListener('input',e=>{ document.getElementById('font-size-value').textContent=e.target.value+'%'; updatePreview(); });
            document.getElementById('gel-font-weight').addEventListener('input',e=>{ document.getElementById('font-weight-value').textContent=e.target.value; updatePreview(); });
            document.getElementById('gel-text-color').addEventListener('input',e=>{ document.getElementById('gel-text-color-hex').value=e.target.value; updatePreview(); });
            document.getElementById('gel-text-color-hex').addEventListener('input',e=>{ const c=e.target.value; if(/^#[0-9A-F]{6}$/i.test(c)){ document.getElementById('gel-text-color').value=c; updatePreview(); } });
            document.getElementById('gel-show-background').addEventListener('change',updatePreview);
            document.getElementById('gel-save-settings').addEventListener('click',()=>{ const s={ fontSize:parseInt(document.getElementById('gel-font-size').value), fontWeight:parseInt(document.getElementById('gel-font-weight').value), textColor:document.getElementById('gel-text-color').value, showBackground:document.getElementById('gel-show-background').checked, backgroundColor:defaultSettings.backgroundColor }; saveSettingsFromPanel(s); applyStyles(); panel.remove(); document.querySelectorAll('.gel-converted').forEach(el=>{ el.classList.remove('gel-converted'); processedElements.delete(el); el.querySelectorAll('.gel-price,.gel-price-steam').forEach(g=>g.remove()); }); convertPrices(); });
            document.getElementById('gel-reset-settings').addEventListener('click',()=>{ resetSiteFontSettings(); document.getElementById('gel-font-size').value=defaultSettings.fontSize; document.getElementById('gel-font-weight').value=defaultSettings.fontWeight; document.getElementById('font-size-value').textContent=defaultSettings.fontSize+'%'; document.getElementById('font-weight-value').textContent=defaultSettings.fontWeight; updatePreview(); });
            document.getElementById('gel-close-settings').addEventListener('click',()=>panel.remove());
            updatePreview();
        }
        function applyStyles(){ const a=getActiveSettings(); const old=document.getElementById('gel-converter-styles'); if(old) old.remove(); const bg=a.showBackground?`background:${a.backgroundColor};padding:1px 4px;border-radius:3px;`:''; const css=`.gel-price{color:${a.textColor}!important;font-weight:${a.fontWeight}!important;margin-left:6px!important;font-size:${a.fontSize/100}em!important}.gel-price-steam{color:${a.textColor}!important;font-weight:${a.fontWeight}!important;margin-left:8px!important;font-size:${a.fontSize/100}em!important}.gel-price-inline{display:inline-block;margin-left:4px;${bg}}.discount_final_price .gel-price-steam,.game_purchase_price .gel-price-steam{display:block;margin-left:0!important;margin-top:2px!important;font-size:${a.fontSize/100*0.85}em!important;opacity:.9}.discount_prices .gel-price-steam{display:inline-block}#gel-settings-button{position:fixed;bottom:20px;right:20px;width:40px;height:40px;background:#4ade80;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:99999;box-shadow:0 2px 10px rgba(0,0,0,.3);transition:all .3s;font-size:20px}#gel-settings-button:hover{transform:scale(1.1);box-shadow:0 3px 15px rgba(74,222,128,.5)}`; const style=document.createElement('style'); style.id='gel-converter-styles'; style.textContent=css; document.head.appendChild(style); }
        function addSettingsButton(){ if(document.getElementById('gel-settings-button')) return; const b=document.createElement('div'); b.id='gel-settings-button'; b.innerHTML='₾'; b.title='GEL Converter Settings'; b.addEventListener('click',createSettingsPanel); document.body.appendChild(b); }
        function getExchangeRate(){ GM_xmlhttpRequest({ method:'GET', url:'https://api.exchangerate-api.com/v4/latest/USD', onload:r=>{ try{ const d=JSON.parse(r.responseText); if(d.rates&&d.rates.GEL){ exchangeRate=d.rates.GEL; convertPrices(); } }catch{} }, onerror:()=>{} }); }
        function convertToGEL(usd){ return `₾${(usd*exchangeRate).toFixed(2)}`; }
        function parsePrice(text){ const m=text.match(/\$(\d+(?:\.\d{1,2})?)/); if(m){ const v=parseFloat(m[1]); return isNaN(v)?null:v; } return null; }
        function isOnSteam(){ return window.location.hostname.includes('steampowered.com')||window.location.hostname.includes('steamcommunity.com'); }
        function convertSteamPrices(){ const sels=['.discount_final_price','.discount_original_price','.game_purchase_price','.game_area_purchase_game_price','.discount_block_inline','.package_totals_row .price','.game_purchase_discount .discount_final_price','.StoreSalePriceBox','.salepreviewwidgets_StoreSalePriceBox','.game_area_dlc_price','.recommendation_highlight_price','.regular_price','.your_price','[data-price-final]','.price','.PriceOverride','.discountPercentage','.discount_percent','.price_range']; let cnt=0; sels.forEach(s=>{ document.querySelectorAll(s).forEach(el=>{ if(processedElements.has(el)||el.classList.contains('gel-converted')) return; const text=(el.textContent||'').trim(); if(text.includes('$')&&!text.includes('₾')){ const price=parsePrice(text); if(price!==null&&price>0){ const gel=convertToGEL(price); const span=document.createElement('span'); span.className='gel-price-steam'; if(getActiveSettings().showBackground) span.className+=' gel-price-inline'; span.textContent=` (${gel})`; el.appendChild(span); el.classList.add('gel-converted'); processedElements.add(el); cnt++; } } }); }); if(cnt===0){ const all=document.querySelectorAll('*'); all.forEach(el=>{ if(processedElements.has(el)||el.classList.contains('gel-converted')) return; if(el.children.length>0) return; const text=(el.textContent||'').trim(); if(/^\$\d+(\.\d{2})?$/.test(text)&&!text.includes('₾')){ const price=parsePrice(text); if(price!==null&&price>0){ const gel=convertToGEL(price); const span=document.createElement('span'); span.className='gel-price-steam'; if(getActiveSettings().showBackground) span.className+=' gel-price-inline'; span.textContent=` (${gel})`; el.appendChild(span); el.classList.add('gel-converted'); processedElements.add(el); } } }); }
        }
        function convertGGDealsPrices(){ const sels=['.price-inner','.game-info-price-col','.price-label','.game-price','.deal-price','.price-cut','.price-new','.price-old','.shop-price','.historical-price','[class*="price"]']; sels.forEach(s=>{ document.querySelectorAll(`${s}:not(.gel-converted)`).forEach(el=>{ if(processedElements.has(el)||el.classList.contains('gel-converted')) return; const text=(el.textContent||'').trim(); if(text.includes('$')&&!text.includes('₾')){ const price=parsePrice(text); if(price!==null&&price>0){ const gel=convertToGEL(price); const span=document.createElement('span'); span.className='gel-price'; if(getActiveSettings().showBackground) span.className+=' gel-price-inline'; span.textContent=gel; el.appendChild(span); el.classList.add('gel-converted'); processedElements.add(el); } } }); }); }
        function convertPrices(){ if(isOnSteam()) convertSteamPrices(); else convertGGDealsPrices(); }
        function setupObserver(){ const obs=new MutationObserver(ms=>{ let should=false; ms.forEach(m=>{ if(m.type==='childList'){ m.addedNodes.forEach(n=>{ if(n.nodeType===1){ const t=n.textContent||''; if(t.includes('$')) should=true; } }); } }); if(should){ clearTimeout(window.convertPricesTimeout); window.convertPricesTimeout=setTimeout(convertPrices,500); } }); obs.observe(document.body,{childList:true,subtree:true}); }
        function start(){ const siteName=isOnSteam()?'Steam':'GG.deals'; try{ console.log(`${siteName} USD to GEL converter initialized (siteKey=${siteKey})`); }catch{} applyStyles(); addSettingsButton(); getExchangeRate(); setTimeout(convertPrices,1000); setTimeout(convertPrices,3000); setTimeout(convertPrices,5000); setupObserver(); setInterval(getExchangeRate,1800000); document.addEventListener('visibilitychange',()=>{ if(!document.hidden) convertPrices(); }); let st; window.addEventListener('scroll',()=>{ clearTimeout(st); st=setTimeout(convertPrices,500); }); if(isOnSteam()){ const ps=history.pushState.bind(history); const rs=history.replaceState.bind(history); history.pushState=function(){ ps.apply(history,arguments); setTimeout(convertPrices,1000); }; history.replaceState=function(){ rs.apply(history,arguments); setTimeout(convertPrices,1000); }; window.addEventListener('popstate',()=>setTimeout(convertPrices,1000)); } }
        GM_registerMenuCommand('⚙️ GEL Converter Settings', createSettingsPanel);
        start();
    }

    // Start the extension
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }

})();