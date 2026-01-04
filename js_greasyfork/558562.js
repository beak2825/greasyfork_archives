// ==UserScript==
// @name         Torn Bazaar Quick Pricer
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Auto-fill bazaar items with market-based pricing (PDA optimized)
// @author       Zedtrooper [3028329]
// @license      MIT
// @match        https://www.torn.com/bazaar.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @homepage     https://github.com/Musa-dabwe/Torn-Bazaar-Quick-Pricer
// @supportURL   https://github.com/Musa-dabwe/Torn-Bazaar-Quick-Pricer/issues
// @downloadURL https://update.greasyfork.org/scripts/558562/Torn%20Bazaar%20Quick%20Pricer.user.js
// @updateURL https://update.greasyfork.org/scripts/558562/Torn%20Bazaar%20Quick%20Pricer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[BazaarQuickPricer] v2.8 Starting (PDA optimized)...');

    // Configuration
    const CONFIG = {
        defaultDiscount: GM_getValue('discountPercent', 0),
        apiKey: GM_getValue('tornApiKey', ''),
        lastPriceUpdate: GM_getValue('lastPriceUpdate', 0),
        priceCache: GM_getValue('priceCache', {}),
        cacheTimeout: 5 * 60 * 1000
    };

    const processedItems = new WeakSet();
    const processedManageItems = new WeakSet();
    let mutationDebounceTimer = null;
    const isMobile = window.innerWidth <= 784;
    let buttonsAdded = false;
    let manageButtonsAdded = false;

    // Detect dark mode
    function isDarkMode() {
        return document.body.classList.contains('dark-mode');
    }

    // Get appropriate text color based on theme
    function getTextColor() {
        return isDarkMode() ? '#767676' : '#7F7F7F';
    }

    function saveConfig() {
        GM_setValue('discountPercent', CONFIG.defaultDiscount);
        GM_setValue('tornApiKey', CONFIG.apiKey);
        GM_setValue('lastPriceUpdate', CONFIG.lastPriceUpdate);
        GM_setValue('priceCache', CONFIG.priceCache);
    }

    // Custom SVGs
    const addButtonSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3,7.5v11c0,1.38,1.12,2.5,2.5,2.5h1c.83,0,1.5,.67,1.5,1.5s-.67,1.5-1.5,1.5h-1c-3.03,0-5.5-2.47-5.5-5.5V7.5C0,4.47,2.47,2,5.5,2h.35c.56-1.18,1.76-2,3.15-2h2c1.39,0,2.59,.82,3.15,2h.35c1.96,0,3.78,1.05,4.76,2.75,.42,.72,.17,1.63-.55,2.05-.24,.14-.49,.2-.75,.2-.52,0-1.02-.27-1.3-.75-.45-.77-1.28-1.25-2.17-1.25h-.35c-.56,1.18-1.76,2-3.15,2h-2c-1.39,0-2.59-.82-3.15-2h-.35c-1.38,0-2.5,1.12-2.5,2.5Zm14.5,6.5h-1c-.83,0-1.5,.67-1.5,1.5s.67,1.5,1.5,1.5h1c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5Zm6.5-.5v6c0,2.48-2.02,4.5-4.5,4.5h-5c-2.48,0-4.5-2.02-4.5-4.5v-6c0-2.48,2.02-4.5,4.5-4.5h5c2.48,0,4.5,2.02,4.5,4.5Zm-3,0c0-.83-.67-1.5-1.5-1.5h-5c-.83,0-1.5,.67-1.5,1.5v6c0,.83,.67,1.5,1.5,1.5h5c.83,0,1.5-.67,1.5-1.5v-6Z"/></svg>`;
    const refreshSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm0,18c-4.41,0-8-3.59-8-8s3.59-8,8-8,8,3.59,8,8-3.59,8-8,8Zm-1-13h2v6h-2v-6Zm0,8h2v2h-2v-2Z"/><path d="M13,7v6h4l-5,5-5-5h4V7h2Z" transform="translate(0,-1)"/></svg>`;

    function showApiKeyPrompt() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
        overlay.innerHTML = `
            <div style="background:#2a2a2a;padding:25px;border-radius:8px;max-width:400px;width:100%;color:#fff;">
                <h2 style="margin:0 0 15px 0;color:#fff;font-size:18px;">Quick Pricer Setup</h2>
                <p style="margin:0 0 15px 0;line-height:1.5;font-size:14px;">Enter your <strong>Public API Key</strong>:</p>
                <input type="text" id="apiKeyInput" placeholder="API Key" style="width:100%;padding:10px;margin:10px 0;border:1px solid #555;border-radius:5px;box-sizing:border-box;background:#1a1a1a;color:#fff;font-size:14px;">
                <div style="display:flex;gap:10px;margin-top:15px;">
                    <button id="saveApiKey" style="flex:1;padding:10px;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;">Save</button>
                    <button id="cancelApiKey" style="flex:1;padding:10px;background:#f44336;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('saveApiKey').onclick = () => {
            const key = document.getElementById('apiKeyInput').value.trim();
            if (key && key.length === 16) {
                CONFIG.apiKey = key;
                saveConfig();
                overlay.remove();
                location.reload();
            } else {
                alert('Please enter a valid 16-character API key');
            }
        };
        document.getElementById('cancelApiKey').onclick = () => overlay.remove();
    }

    function showSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
        overlay.innerHTML = `
            <div style="background:#2a2a2a;padding:25px;border-radius:8px;max-width:400px;width:100%;color:#fff;">
                <h2 style="margin:0 0 15px 0;font-size:18px;">Quick Pricer Settings</h2>
                <div style="margin:15px 0;">
                    <label style="display:block;margin-bottom:5px;font-weight:bold;font-size:14px;">Discount %:</label>
                    <input type="number" id="discountInput" value="${CONFIG.defaultDiscount}" min="-50" max="50" step="0.5" style="width:100%;padding:10px;border:1px solid #555;border-radius:5px;background:#1a1a1a;color:#fff;font-size:14px;">
                    <small style="color:#999;font-size:11px;display:block;margin-top:5px;">Use negative values to price above market (e.g., -5 for +5%)</small>
                </div>
                <div style="margin:15px 0;">
                    <label style="display:block;margin-bottom:5px;font-weight:bold;font-size:14px;">API Key:</label>
                    <input type="text" id="apiKeyUpdateInput" value="${CONFIG.apiKey}" style="width:100%;padding:10px;border:1px solid #555;border-radius:5px;background:#1a1a1a;color:#fff;font-size:14px;">
                </div>
                <button id="clearCache" style="width:100%;padding:10px;background:#ff9800;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;margin:10px 0;">Clear Cache</button>
                <div style="display:flex;gap:10px;margin-top:15px;">
                    <button id="saveSettings" style="flex:1;padding:10px;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;">Save</button>
                    <button id="cancelSettings" style="flex:1;padding:10px;background:#999;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;">Cancel</button>
                </div>
                <div style="margin-top:15px;padding-top:15px;border-top:1px solid #555;text-align:center;">
                    <small style="color:#999;font-size:12px;">
                        v2.8 | <a href="https://github.com/Musa-dabwe/Torn-Bazaar-Quick-Pricer" target="_blank" style="color:#2196F3;">GitHub</a>
                    </small>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        document.getElementById('clearCache').onclick = () => {
            CONFIG.priceCache = {};
            CONFIG.lastPriceUpdate = 0;
            saveConfig();
            alert('Cache cleared!');
        };
        document.getElementById('saveSettings').onclick = () => {
            CONFIG.defaultDiscount = parseFloat(document.getElementById('discountInput').value);
            CONFIG.apiKey = document.getElementById('apiKeyUpdateInput').value.trim();
            saveConfig();
            overlay.remove();
            alert('Settings saved!');
        };
        document.getElementById('cancelSettings').onclick = () => overlay.remove();
    }

    const itemIdCache = new Map();
    function getItemIdFromImage(image) {
        const src = image.src;
        if (itemIdCache.has(src)) return itemIdCache.get(src);
        const match = src.match(/\/(\d+)\//);
        if (match) {
            const itemId = parseInt(match[1], 10);
            itemIdCache.set(src, itemId);
            return itemId;
        }
        return null;
    }

    function getQuantity(itemElement) {
        const titleWrap = itemElement.querySelector('div.title-wrap');
        if (!titleWrap) return 1;
        const match = titleWrap.textContent.match(/x(\d+)/i);
        return match ? parseInt(match[1], 10) : 1;
    }

    const requestQueue = [];
    let isProcessingQueue = false;

    function processRequestQueue() {
        if (isProcessingQueue || requestQueue.length === 0) return;
        isProcessingQueue = true;
        const { itemId, callback } = requestQueue.shift();

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/torn/${itemId}?selections=items&key=${CONFIG.apiKey}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        if (data.error.code === 2) {
                            alert('Incorrect API Key!');
                            CONFIG.apiKey = null;
                            saveConfig();
                        }
                        callback({ marketValue: 0, sellPrice: 0 });
                    } else if (data.items?.[itemId]) {
                        const itemData = data.items[itemId];
                        const marketValue = itemData.market_value || 0;
                        const sellPrice = itemData.sell_price || 0;

                        CONFIG.priceCache[itemId] = {
                            marketValue: marketValue,
                            sellPrice: sellPrice,
                            timestamp: Date.now()
                        };
                        CONFIG.lastPriceUpdate = Date.now();
                        saveConfig();

                        callback({ marketValue, sellPrice });
                    } else {
                        callback({ marketValue: 0, sellPrice: 0 });
                    }
                } catch (e) {
                    console.error('[BazaarQuickPricer] Parse error:', e);
                    callback({ marketValue: 0, sellPrice: 0 });
                }
                isProcessingQueue = false;
                setTimeout(processRequestQueue, 300);
            },
            onerror: function() {
                callback({ marketValue: 0, sellPrice: 0 });
                isProcessingQueue = false;
                setTimeout(processRequestQueue, 300);
            }
        });
    }

    function fetchItemData(itemId, callback) {
        const now = Date.now();
        const cached = CONFIG.priceCache[itemId];

        if (cached && cached.timestamp && (now - cached.timestamp < CONFIG.cacheTimeout)) {
            callback({
                marketValue: cached.marketValue,
                sellPrice: cached.sellPrice
            });
            return;
        }

        requestQueue.push({ itemId, callback });
        processRequestQueue();
    }

    function calculateFinalPrice(marketValue, sellPrice, discount) {
        let finalPrice = Math.round(marketValue * (1 - discount / 100));
        if (sellPrice > 0 && finalPrice < sellPrice) {
            console.log(`[BazaarQuickPricer] Price ${finalPrice} below NPC sell price ${sellPrice}, adjusting...`);
            finalPrice = sellPrice;
        }

        return finalPrice;
    }

    function fillItemPrice(itemElement) {
        const image = itemElement.querySelector('div.image-wrap img');
        if (!image) return Promise.resolve();

        const itemId = getItemIdFromImage(image);
        if (!itemId) return Promise.resolve();

        const amountDiv = itemElement.querySelector('div.amount-main-wrap');
        if (!amountDiv) return Promise.resolve();
        const priceInputs = amountDiv.querySelectorAll('div.price div input');
        if (priceInputs.length === 0) return Promise.resolve();
        return new Promise((resolve) => {
            fetchItemData(itemId, ({ marketValue, sellPrice }) => {
                if (marketValue > 0) {
                    const finalPrice = calculateFinalPrice(marketValue, sellPrice, CONFIG.defaultDiscount);

                    priceInputs[0].value = finalPrice;
                    priceInputs[1].value = finalPrice;
                    priceInputs[0].dispatchEvent(new Event('input', { bubbles: true }));

                    const isQuantityCheckbox = amountDiv.querySelector('div.amount.choice-container');
                    if (isQuantityCheckbox) {
                        const checkbox = isQuantityCheckbox.querySelector('input');
                        if (checkbox && !checkbox.checked) checkbox.click();
                    } else {
                        const quantityInput = amountDiv.querySelector('div.amount input');
                        if (quantityInput) {
                            quantityInput.value = getQuantity(itemElement);
                            quantityInput.dispatchEvent(new Event('input', { bubbles: true }));
                            quantityInput.dispatchEvent(new Event('keyup', { bubbles: true }));
                        }
                    }
                }
                resolve();
            });
        });
    }

    function getActiveTab() {
        const tabs = document.querySelectorAll('ul.items-tabs li');
        for (const tab of tabs) {
            if (tab.classList.contains('active')) {
                return tab.getAttribute('data-category') || 'all';
            }
        }
        return 'all';
    }

    function getVisibleItems() {
        const activeTab = getActiveTab();
        const allItemsLists = document.querySelectorAll('ul.items-cont');

        for (const list of allItemsLists) {
            const style = window.getComputedStyle(list);
            if (style.display !== 'none') {
                const items = list.querySelectorAll('li.clearfix:not(.disabled)');
                return Array.from(items);
            }
        }

        return [];
    }

    // ===== MANAGE ITEMS PAGE FUNCTIONS =====

    function updateManageItemPrice(priceDiv, itemId) {
        const priceInput = priceDiv.querySelector('input.input-money');
        if (!priceInput) return;

        const currentPrice = parseInt(priceInput.value.replace(/,/g, '')) || 0;

        priceInput.disabled = true;
        priceInput.style.opacity = '0.5';
        fetchItemData(itemId, ({ marketValue, sellPrice }) => {
            priceInput.disabled = false;
            priceInput.style.opacity = '1';

            if (marketValue > 0) {
                const newPrice = calculateFinalPrice(marketValue, sellPrice, CONFIG.defaultDiscount);

                // Warn if price change is significant (>20% difference)
                const priceDiff = Math.abs(newPrice - currentPrice);
                const percentDiff = currentPrice > 0 ? (priceDiff / currentPrice) * 100 : 100;

                if (percentDiff > 20 && currentPrice > 0) {
                    const direction = newPrice > currentPrice ? 'increase' : 'decrease';
                    const confirmed = confirm(
                        `Price ${direction} detected!\n\n` +
                        `Current: $${currentPrice.toLocaleString()}\n` +
                        `New: $${newPrice.toLocaleString()}\n` +
                        `Difference: ${percentDiff.toFixed(1)}%\n\n` +
                        `Update to new price?`
                    );
                    if (!confirmed) return;
                }

                // Update the price
                priceInput.value = newPrice;
                priceInput.dispatchEvent(new Event('input', { bubbles: true }));
                priceInput.dispatchEvent(new Event('change', { bubbles: true }));
                // Visual feedback
                const borderColor = (sellPrice > 0 && newPrice === sellPrice) ? '#ff9800' : '#5F5F5F';
                priceInput.style.border = `2px solid ${borderColor}`;
                setTimeout(() => priceInput.style.border = '', 1000);
            } else {
                alert('Could not fetch price for this item');
            }
        });
    }

    function addUpdatePriceButton(manageItem) {
        if (processedManageItems.has(manageItem)) return;
        const priceDiv = manageItem.querySelector('div[class*="price"]');
        if (!priceDiv) return;

        // Check if button already exists
        if (priceDiv.querySelector('.quick-update-price-btn')) {
            processedManageItems.add(manageItem);
            return;
        }

        processedManageItems.add(manageItem);
        // Find item image to get item ID
        const image = manageItem.querySelector('img');
        if (!image) return;

        const itemId = getItemIdFromImage(image);
        if (!itemId) return;
        // Create update button
        const btnContainer = document.createElement('div');
        btnContainer.className = 'quick-update-price-btn';
        btnContainer.style.cssText = 'display:inline-block;margin-left:10px;vertical-align:middle;';

        const btnInput = document.createElement('button');
        btnInput.innerHTML = refreshSVG;
        btnInput.style.cssText = 'background:#5F5F5F;color:white;padding:6px;border:none;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:background 0.2s;';
        btnInput.setAttribute('title', 'Update Price');
        btnInput.addEventListener('mouseenter', () => {
            btnInput.style.background = '#4F4F4F';
        });
        btnInput.addEventListener('mouseleave', () => {
            if (!btnInput.disabled) btnInput.style.background = '#5F5F5F';
        });
        btnContainer.appendChild(btnInput);

        // Insert button after the price input
        const inputGroup = priceDiv.querySelector('.input-money-group');
        if (inputGroup) {
            inputGroup.parentNode.insertBefore(btnContainer, inputGroup.nextSibling);
        }

        btnInput.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            updateManageItemPrice(priceDiv, itemId);
        });
    }

    function getManageItems() {
        // Look for manage items list
        const manageItemsList = document.querySelectorAll('div[class*="item___"]');
        return Array.from(manageItemsList);
    }

    async function updateAllManagePrices() {
        const items = getManageItems();
        console.log('[BazaarQuickPricer] Updating', items.length, 'manage items...');

        if (items.length === 0) {
            alert('No items found to update!');
            return;
        }

        const updateButton = document.getElementById('quickUpdateAllPricesBtn');
        if (updateButton) {
            updateButton.disabled = true;
            updateButton.style.opacity = '0.5';
            updateButton.textContent = 'Updating...';
        }

        let updated = 0;
        for (const item of items) {
            const priceDiv = item.querySelector('div[class*="price"]');
            const image = item.querySelector('img');

            if (priceDiv && image) {
                const itemId = getItemIdFromImage(image);
                if (itemId) {
                    await new Promise((resolve) => {
                        updateManageItemPrice(priceDiv, itemId);
                        setTimeout(resolve, 350);
                    });
                    updated++;
                }
            }
        }

        if (updateButton) {
            updateButton.disabled = false;
            updateButton.style.opacity = '1';
            updateButton.textContent = 'Update All';
        }

        alert(`Updated ${updated} item prices!`);
        console.log('[BazaarQuickPricer] Update complete!');
    }

    function addManagePageButtons() {
        if (manageButtonsAdded) return;
        let attempts = 0;
        const maxAttempts = 20;

        const tryAddButtons = setInterval(() => {
            attempts++;

            // Find header with broader selector support for current Torn UI
            const headings = Array.from(document.querySelectorAll('div[role="heading"], div[class*="title"], div[class*="panelHeader"]'));
            // Look for "Manage your Bazaar" or "Manage items"
            let manageHeading = headings.find(h => h.textContent.includes('Manage your Bazaar') || h.textContent.includes('Manage items'));

            if (manageHeading) {
                if (document.getElementById('quickUpdateAllPricesBtn')) {
                    clearInterval(tryAddButtons);
                    manageButtonsAdded = true;
                    return;
                }

                clearInterval(tryAddButtons);
                manageButtonsAdded = true;

                // Container for buttons floating right
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'float: right; display: flex; gap: 5px; align-items: center; margin-top: -2px;';

                // 1. Update All Button
                const updateAllBtn = document.createElement('button');
                updateAllBtn.id = 'quickUpdateAllPricesBtn';
                updateAllBtn.textContent = 'Update All';
                updateAllBtn.style.cssText = 'background:#5F5F5F;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.2);';
                updateAllBtn.setAttribute('title', 'Update all item prices to current market value');
                updateAllBtn.addEventListener('click', updateAllManagePrices);

                // 2. Settings Button
                const settingsBtn = document.createElement('button');
                settingsBtn.id = 'manageSettingsBtn';
                settingsBtn.textContent = 'Settings';
                settingsBtn.style.cssText = 'background:#5F5F5F;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.2);';
                settingsBtn.setAttribute('title', 'Open Quick Pricer settings');
                settingsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSettingsPanel();
                });

                // Add Hover Effects
                [updateAllBtn, settingsBtn].forEach(btn => {
                    btn.addEventListener('mouseenter', () => {
                        if (!btn.disabled) btn.style.background = '#4F4F4F';
                    });
                    btn.addEventListener('mouseleave', () => {
                        if (!btn.disabled) btn.style.background = '#5F5F5F';
                    });
                });

                // Only add "Update All" button if NOT on mobile
                if (!isMobile) {
                    buttonContainer.appendChild(updateAllBtn);
                }

                buttonContainer.appendChild(settingsBtn);

                manageHeading.appendChild(buttonContainer);

                console.log('[BazaarQuickPricer] Manage page buttons added');
            } else if (attempts >= maxAttempts) {
                clearInterval(tryAddButtons);
                console.log('[BazaarQuickPricer] Manage page buttons failed to add (header not found)');
            }
        }, 500);
    }

    function processManageItems() {
        const items = getManageItems();
        console.log('[BazaarQuickPricer] Found', items.length, 'manage items');
        if (items.length > 0) {
            items.forEach(item => addUpdatePriceButton(item));
        }
    }

    // ===== ADD ITEMS PAGE FUNCTIONS =====

    function addQuickPriceButton(itemElement) {
        if (processedItems.has(itemElement)) return;
        const titleWrap = itemElement.querySelector('div.title-wrap');
        if (!titleWrap) return;

        if (titleWrap.querySelector('.quick-price-btn')) {
            processedItems.add(itemElement);
            return;
        }

        processedItems.add(itemElement);

        const image = itemElement.querySelector('div.image-wrap img');
        if (!image) return;
        const itemId = getItemIdFromImage(image);
        if (!itemId) return;

        const amountDiv = itemElement.querySelector('div.amount-main-wrap');
        if (!amountDiv) return;

        const priceInputs = amountDiv.querySelectorAll('div.price div input');
        if (priceInputs.length === 0) return;

        const btnContainer = document.createElement('div');
        btnContainer.className = 'quick-price-btn';
        btnContainer.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);z-index:10;';

        const btnInput = document.createElement('button');
        btnInput.innerHTML = addButtonSVG;
        btnInput.style.cssText = 'background:#5F5F5F;color:white;padding:8px;border:none;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:background 0.2s;';
        btnInput.setAttribute('title', 'Quick Add');
        btnInput.addEventListener('mouseenter', () => {
            btnInput.style.background = '#4F4F4F';
        });
        btnInput.addEventListener('mouseleave', () => {
            if (!btnInput.disabled) btnInput.style.background = '#5F5F5F';
        });
        btnContainer.appendChild(btnInput);
        titleWrap.style.position = 'relative';
        titleWrap.appendChild(btnContainer);

        btnInput.addEventListener('click', function(event) {
            event.stopPropagation();
            btnInput.disabled = true;
            btnInput.style.opacity = '0.5';

            fillItemPrice(itemElement).then(() => {
                btnInput.disabled = false;
                btnInput.style.opacity = '1';
            });
        });
    }

    async function fillAllItems() {
        const items = getVisibleItems();
        console.log('[BazaarQuickPricer] Filling', items.length, 'items in current tab simultaneously...');

        if (items.length === 0) {
            alert('No items found to fill!');
            return;
        }

        const fillButton = document.getElementById('quickFillAllBtn');
        if (fillButton) {
            fillButton.disabled = true;
            fillButton.style.opacity = '0.5';
            fillButton.textContent = 'Filling...';
        }

        const promises = items.map(item => fillItemPrice(item));
        await Promise.all(promises);
        if (fillButton) {
            fillButton.disabled = false;
            fillButton.style.opacity = '1';
            fillButton.textContent = 'Quick Fill';
        }

        console.log('[BazaarQuickPricer] Fill complete!');
    }

    function addTopButtons() {
        if (buttonsAdded) return;
        let attempts = 0;
        const maxAttempts = 20;

        const tryAddButtons = setInterval(() => {
            attempts++;
            const titleSection = document.querySelector('div.title-black');

            if (titleSection && titleSection.textContent.includes('Add items to your Bazaar')) {
                if (document.getElementById('quickFillAllBtn')) {
                    clearInterval(tryAddButtons);
                    buttonsAdded = true;
                    return;
                }

                clearInterval(tryAddButtons);
                buttonsAdded = true;

                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'display:inline-flex;margin-left:15px;vertical-align:top;align-items:flex-start;';

                const fillAllBtn = document.createElement('button');
                fillAllBtn.id = 'quickFillAllBtn';
                fillAllBtn.textContent = 'Quick Fill';
                fillAllBtn.style.cssText = 'background:#5F5F5F;color:white;padding:8px 14px;border:none;border-radius:4px 0 0 4px;cursor:pointer;display:inline-flex;align-items:center;font-size:13px;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:background 0.2s;border-right:1px solid #4F4F4F;';
                fillAllBtn.setAttribute('title', 'Fill all items in current tab with market prices');
                fillAllBtn.addEventListener('mouseenter', () => {
                    if (!fillAllBtn.disabled) fillAllBtn.style.background = '#4F4F4F';
                });
                fillAllBtn.addEventListener('mouseleave', () => {
                    if (!fillAllBtn.disabled) fillAllBtn.style.background = '#5F5F5F';
                });
                fillAllBtn.addEventListener('click', fillAllItems);

                const settingsBtn = document.createElement('button');
                settingsBtn.id = 'quickPricerSettingsBtn';
                settingsBtn.textContent = 'Settings';
                settingsBtn.style.cssText = 'background:#5F5F5F;color:white;padding:8px 14px;border:none;border-radius:0 4px 4px 0;cursor:pointer;display:inline-flex;align-items:center;font-size:13px;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:background 0.2s;';
                settingsBtn.setAttribute('title', 'Open Quick Pricer settings');
                settingsBtn.addEventListener('mouseenter', () => {
                    settingsBtn.style.background = '#4F4F4F';
                });
                settingsBtn.addEventListener('mouseleave', () => {
                    settingsBtn.style.background = '#5F5F5F';
                });
                settingsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showSettingsPanel();
                });
                buttonContainer.appendChild(fillAllBtn);
                buttonContainer.appendChild(settingsBtn);
                titleSection.appendChild(buttonContainer);

                console.log('[BazaarQuickPricer] Buttons added');
            } else if (attempts >= maxAttempts) {
                clearInterval(tryAddButtons);
                console.log('[BazaarQuickPricer] Buttons failed to add');
            }
        }, 500);
    }

    function processAllItems() {
        const items = document.querySelectorAll('ul.items-cont li.clearfix:not(.disabled)');
        console.log('[BazaarQuickPricer] Found', items.length, 'items');
        if (items.length > 0) {
            items.forEach(item => addQuickPriceButton(item));
        }
    }

    function setupObserver() {
        const bazaarRoot = document.getElementById('bazaarRoot');
        if (!bazaarRoot) {
            setTimeout(setupObserver, 1000);
            return;
        }

        console.log('[BazaarQuickPricer] Observer starting');
        const observer = new MutationObserver(() => {
            clearTimeout(mutationDebounceTimer);
            mutationDebounceTimer = setTimeout(() => {
                processAllItems();
                addTopButtons();
                processManageItems();
                addManagePageButtons();
            }, 300);
        });
        observer.observe(bazaarRoot, { childList: true, subtree: true });
    }

    function init() {
        console.log('[BazaarQuickPricer] Init starting');
        if (!CONFIG.apiKey || CONFIG.apiKey === 'null') {
            setTimeout(showApiKeyPrompt, 1000);
            return;
        }

        setTimeout(() => {
            processAllItems();
            setupObserver();
            addTopButtons();
            processManageItems();
            addManagePageButtons();
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

})();