// ==UserScript==
// @name         Torn Market Auto Buyer Pro
// @namespace    http://torn.com/
// @version      7.0.0
// @description  Professional auto-buyer using API market values with proper purchase flow
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555208/Torn%20Market%20Auto%20Buyer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/555208/Torn%20Market%20Auto%20Buyer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ==================== CONFIGURATION ==================== */
    const CONFIG = {
        SCAN_INTERVAL: 8000,
        PURCHASE_DELAY: 5000,       // 5s wait after EACH purchase
        MODAL_WAIT: 2000,
        INPUT_DELAY: 800,           // Increased delay after input
        CONFIRM_DELAY: 1500,        // Increased delay before confirm
        MIN_PROFIT_PERCENT: 10,
        MAX_PURCHASES_PER_SCAN: 1   // Only buy ONE item per scan
    };

    /* ==================== STATE MANAGEMENT ==================== */
    const state = {
        apiKey: GM_getValue('torn_api_key', ''),
        marketValues: {},
        marketValuesCached: 0,
        isScanning: false,
        isPurchasing: false,
        isMinimized: GM_getValue('is_minimized', false),
        totalPurchases: GM_getValue('total_purchases', 0),
        totalProfit: GM_getValue('total_profit', 0),
        autoScanInterval: null,
        lastDeals: []
    };

    /* ==================== UTILITY FUNCTIONS ==================== */
    const utils = {
        sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        
        parsePrice: (text) => {
            const match = String(text).match(/\$[\d,]+/);
            if (!match) return null;
            return parseInt(match[0].replace(/[$,]/g, ''), 10);
        },

        formatNumber: (num) => num.toLocaleString(),

        log: (category, ...args) => {
            console.log(`[Torn AutoBuy - ${category}]`, ...args);
        },

        scrollToElement: async (el) => {
            if (!el) return;
            try {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await utils.sleep(300);
            } catch (e) {
                utils.log('Scroll', 'Failed to scroll:', e);
            }
        }
    };

    /* ==================== API FUNCTIONS ==================== */
    const api = {
        request: (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                reject(new Error(data.error.error || 'API Error'));
                            } else {
                                resolve(data);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            });
        },

        ensureApiKey: async () => {
            if (state.apiKey && state.apiKey.length > 10) return state.apiKey;
            
            const key = prompt('Enter your Torn API key (Full Access recommended):');
            if (!key) throw new Error('API key required');
            
            state.apiKey = key.trim();
            GM_setValue('torn_api_key', state.apiKey);
            return state.apiKey;
        },

        fetchMarketValues: async () => {
            const now = Date.now();
            if (state.marketValues && Object.keys(state.marketValues).length > 0 && 
                (now - state.marketValuesCached) < 60000) {
                return state.marketValues;
            }

            await api.ensureApiKey();
            const url = `https://api.torn.com/torn/?selections=items&key=${encodeURIComponent(state.apiKey)}`;
            const data = await api.request(url);
            
            const values = {};
            if (data && data.items) {
                Object.entries(data.items).forEach(([id, item]) => {
                    if (item && item.market_value) {
                        values[id] = item.market_value;
                    }
                });
            }

            state.marketValues = values;
            state.marketValuesCached = Date.now();
            utils.log('API', `Loaded ${Object.keys(values).length} item market values`);
            return values;
        }
    };

    /* ==================== DOM SCANNING ==================== */
    const scanner = {
        isOnMarket: () => {
            return window.location.href.includes('sid=ItemMarket') || 
                   window.location.href.includes('sid=itemMarket') ||
                   document.querySelector('#item-market-root') !== null;
        },

        findAllItemListings: () => {
            const selectors = [
                'ul[class*="itemList"] li',
                'li[class*="item"]',
                '[class*="itemTile"]'
            ];

            const elements = new Set();
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => elements.add(el));
            });

            return Array.from(elements);
        },

        extractItemId: (element) => {
            const img = element.querySelector('img[src*="/items/"]');
            if (img && img.src) {
                const match = img.src.match(/\/items\/(\d+)\//);
                if (match) return match[1];
            }

            const dataId = element.getAttribute('data-item-id') || 
                          element.querySelector('[data-item-id]')?.getAttribute('data-item-id');
            if (dataId) return dataId;

            return null;
        },

        extractAllPricesForItem: (itemId) => {
            // Find ALL listings for this specific item ID to calculate market average
            const allListings = scanner.findAllItemListings();
            const prices = [];

            for (const listing of allListings) {
                const listingItemId = scanner.extractItemId(listing);
                if (listingItemId === itemId) {
                    const price = scanner.extractPrice(listing);
                    if (price && price > 0) {
                        prices.push(price);
                    }
                }
            }

            return prices;
        },

        calculateMarketAverage: (prices) => {
            if (!prices || prices.length === 0) return null;

            // Sort prices ascending
            const sorted = [...prices].sort((a, b) => a - b);
            
            // Take lowest 8 prices (or all if less than 8)
            const topPrices = sorted.slice(0, Math.min(8, sorted.length));
            
            // Calculate average
            const sum = topPrices.reduce((acc, price) => acc + price, 0);
            const average = sum / topPrices.length;

            utils.log('Market Calc', `Prices: [${sorted.join(', ')}]`);
            utils.log('Market Calc', `Top 8: [${topPrices.join(', ')}]`);
            utils.log('Market Calc', `Average: $${Math.round(average).toLocaleString()}`);

            return average;
        },

        extractItemName: (element) => {
            const nameEl = element.querySelector('[class*="name"]') || 
                          element.querySelector('.name') ||
                          element.querySelector('img');
            
            if (!nameEl) return 'Unknown Item';
            return nameEl.textContent?.trim() || nameEl.alt?.trim() || 'Unknown Item';
        },

        extractPrice: (element) => {
            const priceEl = element.querySelector('[class*="price"]') ||
                           element.querySelector('[class*="priceAndTotal"] span');
            
            if (!priceEl) return null;
            return utils.parsePrice(priceEl.textContent);
        },

        extractQuantity: (element) => {
            const qtyEl = element.querySelector('[class*="available"]');
            if (qtyEl) {
                const match = qtyEl.textContent.match(/(\d+)/);
                if (match) return parseInt(match[1], 10);
            }
            return 1;
        },

        findBuyTrigger: (element) => {
            return element.querySelector('[aria-controls*="buy"]') ||
                   element.querySelector('button[class*="buy"]') ||
                   element.querySelector('button');
        }
    };

    /* ==================== PURCHASE FLOW ==================== */
    const purchaser = {
        clickBuyTrigger: async (element) => {
            const trigger = scanner.findBuyTrigger(element);
            if (!trigger) {
                utils.log('Purchase', 'No buy trigger found');
                return false;
            }

            utils.log('Purchase', 'Clicking buy trigger...');
            await utils.scrollToElement(element);
            trigger.click();
            await utils.sleep(CONFIG.MODAL_WAIT);
            return true;
        },

        fillQuantity: async (quantity) => {
            // Wait a bit to ensure modal is fully rendered
            await utils.sleep(500);

            // Try multiple selectors for quantity input
            let qtyInput = document.querySelector('input[placeholder="Qty"]') ||
                          document.querySelector('input.input-money') ||
                          document.querySelector('input[data-testid="legacy-money-input"]') ||
                          document.querySelector('input[type="number"]:not([readonly])');

            // Also try looking in visible modals
            if (!qtyInput) {
                const modals = Array.from(document.querySelectorAll('[role="dialog"], .ReactModalPortal, [class*="modal"]'))
                    .filter(m => m.offsetParent !== null);
                
                for (const modal of modals) {
                    qtyInput = modal.querySelector('input[placeholder="Qty"]') ||
                              modal.querySelector('input.input-money') ||
                              modal.querySelector('input[type="number"]:not([readonly])');
                    if (qtyInput) break;
                }
            }

            if (!qtyInput) {
                utils.log('Purchase', '⚠️ Quantity input not found');
                utils.log('Purchase', 'Available inputs:', Array.from(document.querySelectorAll('input')).map(i => ({
                    type: i.type,
                    placeholder: i.placeholder,
                    class: i.className,
                    readonly: i.readOnly
                })));
                return true; // Continue anyway - might not need quantity
            }

            utils.log('Purchase', `Found quantity input: ${qtyInput.placeholder || qtyInput.className}`);
            utils.log('Purchase', `Setting quantity to ${quantity}...`);
            
            // Focus the input
            qtyInput.focus();
            await utils.sleep(100);
            
            // Clear existing value
            qtyInput.value = '';
            await utils.sleep(100);
            
            // Type the quantity
            qtyInput.value = String(quantity);
            await utils.sleep(100);
            
            // Trigger all possible events
            qtyInput.dispatchEvent(new Event('input', { bubbles: true }));
            qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
            qtyInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
            
            await utils.sleep(100);
            qtyInput.blur();
            
            await utils.sleep(CONFIG.INPUT_DELAY);
            utils.log('Purchase', `✓ Quantity set to ${quantity}`);
            return true;
        },

        clickBuyButton: async () => {
            await utils.sleep(300);

            // Try to find the buy button - be very specific
            let buyButton = null;

            // Method 1: Look for button with class containing "buyButton"
            buyButton = document.querySelector('button[class*="buyButton"]');
            
            // Method 2: Look in visible modals
            if (!buyButton) {
                const modals = Array.from(document.querySelectorAll('[role="dialog"], .ReactModalPortal, [class*="modal"]'))
                    .filter(m => m.offsetParent !== null);
                
                for (const modal of modals) {
                    buyButton = modal.querySelector('button[class*="buyButton"]') ||
                               Array.from(modal.querySelectorAll('button')).find(btn => {
                                   const text = btn.textContent.trim().toLowerCase();
                                   return text === 'buy' && !btn.disabled && btn.offsetParent !== null;
                               });
                    if (buyButton) break;
                }
            }

            // Method 3: Find any visible button with text "Buy"
            if (!buyButton) {
                buyButton = Array.from(document.querySelectorAll('button')).find(btn => {
                    const text = btn.textContent.trim().toLowerCase();
                    return text === 'buy' && !btn.disabled && btn.offsetParent !== null;
                });
            }

            if (!buyButton) {
                utils.log('Purchase', '❌ Buy button not found');
                utils.log('Purchase', 'Available buttons:', Array.from(document.querySelectorAll('button'))
                    .filter(b => b.offsetParent !== null)
                    .map(b => ({
                        text: b.textContent.trim(),
                        class: b.className,
                        disabled: b.disabled
                    })));
                return false;
            }

            utils.log('Purchase', `Found Buy button: "${buyButton.textContent.trim()}" (${buyButton.className})`);
            utils.log('Purchase', 'Clicking Buy button...');
            buyButton.click();
            await utils.sleep(CONFIG.CONFIRM_DELAY);
            return true;
        },

        clickConfirm: async () => {
            await utils.sleep(300);

            let confirmButton = null;

            // Method 1: Specific selector from working example
            confirmButton = document.querySelector('[class*="confirmButtons"] button:nth-child(1)');

            // Method 2: Look for confirmButton class
            if (!confirmButton) {
                confirmButton = document.querySelector('button[class*="confirmButton"]');
            }

            // Method 3: Look in visible modals for confirm/yes buttons
            if (!confirmButton) {
                const modals = Array.from(document.querySelectorAll('[role="dialog"], .ReactModalPortal, [class*="modal"], [class*="confirm"]'))
                    .filter(m => m.offsetParent !== null);
                
                for (const modal of modals) {
                    confirmButton = Array.from(modal.querySelectorAll('button')).find(btn => {
                        const text = btn.textContent.trim().toLowerCase();
                        return (text === 'confirm' || text === 'yes' || text.includes('confirm')) && 
                               !btn.disabled && 
                               btn.offsetParent !== null;
                    });
                    if (confirmButton) break;
                }
            }

            // Method 4: Search all visible buttons for confirm/yes
            if (!confirmButton) {
                confirmButton = Array.from(document.querySelectorAll('button')).find(btn => {
                    const text = btn.textContent.trim().toLowerCase();
                    return (text === 'confirm' || text === 'yes') && 
                           !btn.disabled && 
                           btn.offsetParent !== null;
                });
            }

            if (!confirmButton) {
                utils.log('Purchase', '❌ Confirm button not found');
                utils.log('Purchase', 'Available buttons:', Array.from(document.querySelectorAll('button'))
                    .filter(b => b.offsetParent !== null)
                    .map(b => ({
                        text: b.textContent.trim(),
                        class: b.className,
                        disabled: b.disabled
                    })));
                return false;
            }

            utils.log('Purchase', `Found Confirm button: "${confirmButton.textContent.trim()}" (${confirmButton.className})`);
            utils.log('Purchase', 'Clicking Confirm button...');
            confirmButton.click();
            await utils.sleep(1500);
            return true;
        },

        closePanel: async () => {
            const closeButton = document.querySelector('[aria-label="Close panel"]') ||
                               document.querySelector('[class*="close"]');
            if (closeButton) {
                closeButton.click();
                await utils.sleep(500);
            }
        },

        executePurchase: async (deal) => {
            utils.log('Purchase', `\n=== PURCHASING: ${deal.name} ===`);
            utils.log('Purchase', `Price: $${utils.formatNumber(deal.price)} | Profit: $${utils.formatNumber(deal.profit)} (${(deal.profitPercent * 100).toFixed(2)}%)`);

            try {
                const triggerSuccess = await purchaser.clickBuyTrigger(deal.element);
                if (!triggerSuccess) return false;

                await purchaser.fillQuantity(deal.quantity);

                const buySuccess = await purchaser.clickBuyButton();
                if (!buySuccess) return false;

                const confirmSuccess = await purchaser.clickConfirm();
                if (!confirmSuccess) return false;

                await purchaser.closePanel();

                state.totalPurchases++;
                state.totalProfit += deal.profit;
                GM_setValue('total_purchases', state.totalPurchases);
                GM_setValue('total_profit', state.totalProfit);

                utils.log('Purchase', `✓ SUCCESS! Purchased ${deal.name}`);
                ui.updateStats();

                if (deal.element) {
                    deal.element.style.backgroundColor = 'rgba(76, 175, 80, 0.4)';
                    deal.element.style.outline = '3px solid #FFD700';
                }

                return true;

            } catch (e) {
                utils.log('Purchase', `ERROR: ${e.message}`, e);
                return false;
            }
        }
    };

    /* ==================== SCANNING & ANALYSIS ==================== */
    const analyzer = {
        scanForDeals: async () => {
            if (state.isScanning || state.isPurchasing) {
                utils.log('Scan', 'Already scanning or purchasing, skipping...');
                return [];
            }

            if (!scanner.isOnMarket()) {
                utils.log('Scan', 'Not on Item Market page');
                return [];
            }

            state.isScanning = true;
            ui.updateStatus('Scanning for deals...', '#2196F3');

            try {
                const minProfitPct = GM_getValue('min_profit_percent', CONFIG.MIN_PROFIT_PERCENT) / 100;

                const listings = scanner.findAllItemListings();
                utils.log('Scan', `Found ${listings.length} item listings on page`);

                const deals = [];
                const processedItems = new Set(); // Track which items we've already analyzed

                for (const element of listings) {
                    try {
                        const itemId = scanner.extractItemId(element);
                        if (!itemId) continue;

                        // Skip if we've already analyzed this item
                        if (processedItems.has(itemId)) continue;
                        processedItems.add(itemId);

                        const price = scanner.extractPrice(element);
                        if (!price || price <= 0) continue;

                        // Get ALL listings for this item to calculate market average
                        const allPrices = scanner.extractAllPricesForItem(itemId);
                        if (allPrices.length === 0) continue;

                        // Calculate average from top 8 lowest prices
                        const marketAverage = scanner.calculateMarketAverage(allPrices);
                        if (!marketAverage) continue;

                        // Find the absolute lowest price for this item
                        const lowestPrice = Math.min(...allPrices);

                        // Calculate how much below average the lowest price is
                        const percentBelowAvg = ((marketAverage - lowestPrice) / marketAverage);

                        utils.log('Scan', `Item ${itemId}: Lowest=$${lowestPrice}, Avg=$${Math.round(marketAverage)}, Below=${(percentBelowAvg * 100).toFixed(2)}%`);

                        // Only flag as deal if lowest price is X% below average
                        if (percentBelowAvg >= minProfitPct) {
                            // Find the listing element with the lowest price
                            let bestElement = null;
                            for (const listing of listings) {
                                if (scanner.extractItemId(listing) === itemId) {
                                    const listingPrice = scanner.extractPrice(listing);
                                    if (listingPrice === lowestPrice) {
                                        bestElement = listing;
                                        break;
                                    }
                                }
                            }

                            if (bestElement) {
                                const deal = {
                                    itemId,
                                    name: scanner.extractItemName(bestElement),
                                    price: lowestPrice,
                                    marketValue: Math.round(marketAverage),
                                    profit: Math.round(marketAverage - lowestPrice),
                                    profitPercent: percentBelowAvg,
                                    quantity: scanner.extractQuantity(bestElement),
                                    element: bestElement,
                                    allPrices: allPrices
                                };

                                deals.push(deal);

                                // Highlight only the best deal
                                bestElement.style.outline = '3px solid #4CAF50';
                                bestElement.style.backgroundColor = 'rgba(76, 175, 80, 0.15)';
                            }
                        }

                    } catch (e) {
                        utils.log('Scan', 'Error processing listing:', e);
                    }
                }

                // Sort by profit percentage (highest first)
                deals.sort((a, b) => b.profitPercent - a.profitPercent);

                state.lastDeals = deals;
                ui.displayDeals(deals);

                const msg = deals.length > 0 ? `Found ${deals.length} profitable deals!` : 'No profitable deals found';
                const color = deals.length > 0 ? '#4CAF50' : '#888';
                ui.updateStatus(msg, color);

                utils.log('Scan', msg);
                if (deals.length > 0) {
                    console.table(deals.map(d => ({
                        Name: d.name,
                        'Lowest Price': `$${utils.formatNumber(d.price)}`,
                        'Market Avg': `$${utils.formatNumber(d.marketValue)}`,
                        Profit: `$${utils.formatNumber(d.profit)}`,
                        '% Below Avg': `${(d.profitPercent * 100).toFixed(2)}%`,
                        Qty: d.quantity,
                        'Total Listings': d.allPrices.length
                    })));
                }

                return deals;

            } catch (e) {
                utils.log('Scan', 'Error during scan:', e);
                ui.updateStatus(`Scan error: ${e.message}`, '#f44336');
                return [];
            } finally {
                state.isScanning = false;
            }
        },

        autoPurchaseDeals: async (deals) => {
            if (state.isPurchasing) return;
            state.isPurchasing = true;

            const maxPurchases = GM_getValue('max_purchases_per_scan', 1); // Default to 1
            const dealsToProcess = deals.slice(0, maxPurchases);

            utils.log('Purchase', `\n╔════════════════════════════════════════╗`);
            utils.log('Purchase', `║  STARTING AUTO-PURCHASE                ║`);
            utils.log('Purchase', `║  Buying ONE item, then waiting 5s      ║`);
            utils.log('Purchase', `╚════════════════════════════════════════╝\n`);

            let successCount = 0;

            // Only process ONE item at a time
            for (let i = 0; i < dealsToProcess.length; i++) {
                const deal = dealsToProcess[i];
                
                ui.updateStatus(`Purchasing: ${deal.name}`, '#ff9800');

                const success = await purchaser.executePurchase(deal);
                if (success) {
                    successCount++;
                    utils.log('Purchase', `\n✓ Successfully purchased ${deal.name}!`);
                } else {
                    utils.log('Purchase', `\n✗ Failed to purchase ${deal.name}`);
                }

                // Always wait 5 seconds after attempting a purchase
                utils.log('Purchase', `\n⏳ Waiting ${CONFIG.PURCHASE_DELAY / 1000}s before next scan...\n`);
                ui.updateStatus(`Waiting 5s before next scan...`, '#2196F3');
                await utils.sleep(CONFIG.PURCHASE_DELAY);
            }

            state.isPurchasing = false;

            utils.log('Purchase', `\n╔════════════════════════════════════════╗`);
            utils.log('Purchase', `║  PURCHASE COMPLETE                     ║`);
            utils.log('Purchase', `║  Success: ${successCount > 0 ? 'YES' : 'NO'.padEnd(30)}║`);
            utils.log('Purchase', `╚════════════════════════════════════════╝\n`);

            ui.updateStatus(successCount > 0 ? `Bought 1 item! Scanning again...` : `Purchase failed, retrying...`, '#4CAF50');

            // Scan again after purchase attempt
            await utils.sleep(2000);
            analyzer.scanForDeals();
        }
    };

    /* ==================== USER INTERFACE ==================== */
    const ui = {
        createMinimizedIcon: () => {
            const icon = document.createElement('div');
            icon.id = 'tornAutoBuyIcon';
            Object.assign(icon.style, {
                position: 'fixed',
                left: '20px',
                top: '200px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: '#fff',
                display: state.isMinimized ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: '999999',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                border: '2px solid #fff',
                transition: 'transform 0.2s'
            });
            icon.innerHTML = '💰';
            icon.title = 'Torn Auto Buyer - Click to expand';

            icon.addEventListener('mouseenter', () => icon.style.transform = 'scale(1.1)');
            icon.addEventListener('mouseleave', () => icon.style.transform = 'scale(1)');
            icon.addEventListener('click', () => {
                state.isMinimized = false;
                GM_setValue('is_minimized', false);
                icon.style.display = 'none';
                document.getElementById('tornAutoBuyPanel').style.display = 'block';
            });

            document.body.appendChild(icon);
        },

        createPanel: () => {
            const panel = document.createElement('div');
            panel.id = 'tornAutoBuyPanel';
            Object.assign(panel.style, {
                position: 'fixed',
                left: '20px',
                top: '200px',
                width: '360px',
                background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
                color: '#f9f9f9',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #444',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                zIndex: '999999',
                fontFamily: 'Arial, sans-serif',
                fontSize: '13px',
                display: state.isMinimized ? 'none' : 'block'
            });

            panel.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:2px solid #4CAF50;padding-bottom:8px;">
                    <h3 style="margin:0;font-size:18px;color:#4CAF50;font-weight:700;">💰 Torn Auto Buyer Pro</h3>
                    <button id="minimizeBtn" style="background:#444;color:#fff;border:none;border-radius:6px;padding:6px 10px;cursor:pointer;font-size:16px;">➖</button>
                </div>

                <div id="status" style="padding:10px;background:#222;border-radius:6px;color:#4CAF50;font-weight:700;text-align:center;margin-bottom:12px;">
                    Initializing...
                </div>

                <div style="background:#222;padding:12px;border-radius:8px;margin-bottom:12px;">
                    <label style="display:block;margin-bottom:10px;color:#ddd;">
                        Min Profit Margin (% below market avg):
                        <input type="number" id="minProfitInput" min="0" max="100" step="0.5" value="${GM_getValue('min_profit_percent', CONFIG.MIN_PROFIT_PERCENT)}" style="width:100%;padding:8px;margin-top:4px;border-radius:6px;border:1px solid #555;background:#333;color:#fff;">
                    </label>
                    <div style="font-size:11px;color:#888;margin-top:4px;margin-bottom:10px;">
                        Only buy items priced X% below the average of the 8 lowest listings
                    </div>

                    <label style="display:block;margin-bottom:10px;color:#ddd;">
                        Max Purchases Per Scan:
                        <input type="number" id="maxPurchasesInput" min="1" max="20" value="${GM_getValue('max_purchases_per_scan', 1)}" style="width:100%;padding:8px;margin-top:4px;border-radius:6px;border:1px solid #555;background:#333;color:#fff;">
                    </label>
                    <div style="font-size:11px;color:#888;margin-top:4px;">
                        ⚠️ Set to 1 to buy one item at a time (recommended)
                    </div>

                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:12px;">
                        <input type="checkbox" id="autoBuyCheckbox" ${GM_getValue('auto_buy_enabled', false) ? 'checked' : ''}>
                        <span style="color:#fff;font-weight:700;">Enable Auto-Purchase</span>
                    </label>

                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;margin-top:8px;">
                        <input type="checkbox" id="autoScanCheckbox" ${GM_getValue('auto_scan_enabled', true) ? 'checked' : ''}>
                        <span style="color:#fff;">Continuous Scanning</span>
                    </label>
                </div>

                <div style="display:flex;gap:8px;margin-bottom:12px;">
                    <button id="scanNowBtn" style="flex:1;padding:12px;border:none;border-radius:8px;background:#4CAF50;color:#fff;font-weight:700;cursor:pointer;font-size:14px;">
                        🔍 Scan Now
                    </button>
                    <button id="toggleAutoBtn" style="flex:1;padding:12px;border:none;border-radius:8px;background:#2196F3;color:#fff;font-weight:700;cursor:pointer;font-size:14px;">
                        Auto: OFF
                    </button>
                </div>

                <div id="dealsList" style="max-height:320px;overflow-y:auto;background:#111;padding:10px;border-radius:8px;margin-bottom:12px;">
                    <em style="color:#888;">Click "Scan Now" to find deals...</em>
                </div>

                <div style="border-top:1px solid #444;padding-top:10px;font-size:12px;color:#aaa;">
                    <div id="stats" style="color:#4CAF50;font-weight:700;margin-bottom:4px;">
                        Purchases: ${state.totalPurchases} | Profit: $${utils.formatNumber(state.totalProfit)}
                    </div>
                    <div style="font-size:10px;color:#666;">
                        ⚠️ Use responsibly • Based on TornTools methodology
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            ui.attachEventListeners();
            ui.makeDraggable(panel);
        },

        attachEventListeners: () => {
            document.getElementById('minimizeBtn').addEventListener('click', () => {
                state.isMinimized = true;
                GM_setValue('is_minimized', true);
                document.getElementById('tornAutoBuyPanel').style.display = 'none';
                document.getElementById('tornAutoBuyIcon').style.display = 'flex';
            });

            document.getElementById('minProfitInput').addEventListener('change', (e) => {
                GM_setValue('min_profit_percent', parseFloat(e.target.value) || CONFIG.MIN_PROFIT_PERCENT);
            });

            document.getElementById('maxPurchasesInput').addEventListener('change', (e) => {
                GM_setValue('max_purchases_per_scan', parseInt(e.target.value) || CONFIG.MAX_PURCHASES_PER_SCAN);
            });

            document.getElementById('autoBuyCheckbox').addEventListener('change', (e) => {
                GM_setValue('auto_buy_enabled', e.target.checked);
                if (e.target.checked) {
                    alert('⚠️ AUTO-PURCHASE ENABLED!\n\nThe script will now automatically buy profitable items.\nMake sure you understand the risks and have compatible scripts.');
                }
            });

            document.getElementById('autoScanCheckbox').addEventListener('change', (e) => {
                GM_setValue('auto_scan_enabled', e.target.checked);
                ui.toggleAutoScan();
            });

            document.getElementById('scanNowBtn').addEventListener('click', async () => {
                const deals = await analyzer.scanForDeals();
                if (deals.length > 0 && GM_getValue('auto_buy_enabled', false)) {
                    await analyzer.autoPurchaseDeals(deals);
                }
            });

            document.getElementById('toggleAutoBtn').addEventListener('click', ui.toggleAutoScan);
        },

        makeDraggable: (element) => {
            const header = element.querySelector('div');
            header.style.cursor = 'move';

            let isDragging = false;
            let currentX, currentY, initialX, initialY;

            header.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                
                isDragging = true;
                initialX = e.clientX - element.offsetLeft;
                initialY = e.clientY - element.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        },

        updateStatus: (message, color = '#4CAF50') => {
            const statusEl = document.getElementById('status');
            if (statusEl) {
                statusEl.textContent = message;
                statusEl.style.color = color;
            }
        },

        updateStats: () => {
            const statsEl = document.getElementById('stats');
            if (statsEl) {
                statsEl.textContent = `Purchases: ${state.totalPurchases} | Profit: $${utils.formatNumber(state.totalProfit)}`;
            }
        },

        displayDeals: (deals) => {
            const listEl = document.getElementById('dealsList');
            if (!listEl) return;

            if (deals.length === 0) {
                listEl.innerHTML = '<em style="color:#888;">No profitable deals found</em>';
                return;
            }

            listEl.innerHTML = deals.map(deal => `
                <div style="padding:10px;margin-bottom:10px;background:#222;border-radius:6px;border-left:4px solid #4CAF50;">
                    <div style="font-weight:700;color:#4CAF50;margin-bottom:6px;">${deal.name}</div>
                    <div style="font-size:12px;color:#ccc;">
                        Lowest: <strong>$${utils.formatNumber(deal.price)}</strong> | 
                        Market Avg: <strong>$${utils.formatNumber(deal.marketValue)}</strong><br>
                        <span style="color:#FFD700;font-weight:700;">
                            Profit: $${utils.formatNumber(deal.profit)} (${(deal.profitPercent * 100).toFixed(2)}% below avg)
                        </span><br>
                        Quantity: ${deal.quantity} | Listings: ${deal.allPrices.length}
                    </div>
                </div>
            `).join('');
        },

        toggleAutoScan: () => {
            const isEnabled = GM_getValue('auto_scan_enabled', true);
            const toggleBtn = document.getElementById('toggleAutoBtn');

            if (state.autoScanInterval) {
                clearInterval(state.autoScanInterval);
                state.autoScanInterval = null;
                toggleBtn.textContent = 'Auto: OFF';
                toggleBtn.style.background = '#2196F3';
                ui.updateStatus('Auto-scan stopped', '#888');
            } else if (isEnabled) {
                state.autoScanInterval = setInterval(async () => {
                    const deals = await analyzer.scanForDeals();
                    if (deals.length > 0 && GM_getValue('auto_buy_enabled', false)) {
                        await analyzer.autoPurchaseDeals(deals);
                    }
                }, CONFIG.SCAN_INTERVAL);
                
                toggleBtn.textContent = 'Auto: ON';
                toggleBtn.style.background = '#ff9800';
                ui.updateStatus('Auto-scan running', '#ff9800');
            }
        }
    };

    /* ==================== INITIALIZATION ==================== */
    async function initialize() {
        utils.log('Init', 'Starting Torn Auto Buyer Pro...');

        if (document.readyState !== 'complete') {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }

        await utils.sleep(2000);

        try {
            ui.createPanel();
            ui.createMinimizedIcon();

            await api.ensureApiKey();
            
            ui.updateStatus('Loading market values...', '#2196F3');
            await api.fetchMarketValues();
            ui.updateStatus('Ready!', '#4CAF50');

            if (GM_getValue('auto_scan_enabled', true)) {
                ui.toggleAutoScan();
            }

            setTimeout(async () => {
                const deals = await analyzer.scanForDeals();
                if (deals.length > 0 && GM_getValue('auto_buy_enabled', false)) {
                    await analyzer.autoPurchaseDeals(deals);
                }
            }, 3000);

            utils.log('Init', 'Initialization complete!');

        } catch (e) {
            utils.log('Init', 'Initialization error:', e);
            ui.updateStatus(`Init error: ${e.message}`, '#f44336');
        }
    }

    /* ==================== DOM OBSERVER ==================== */
    function setupDOMObserver() {
        const observer = new MutationObserver(() => {
            if (GM_getValue('auto_scan_enabled', true) && 
                !state.isScanning && 
                !state.isPurchasing &&
                scanner.isOnMarket()) {
                
                const currentCount = scanner.findAllItemListings().length;
                if (Math.abs(currentCount - (observer.lastCount || 0)) > 5) {
                    observer.lastCount = currentCount;
                    analyzer.scanForDeals();
                }
            }
        });

        setTimeout(() => {
            const target = document.querySelector('#item-market-root') || document.body;
            observer.observe(target, { childList: true, subtree: true });
            observer.lastCount = 0;
            utils.log('Observer', 'DOM observer active');
        }, 3000);
    }

    /* ==================== CONSOLE API ==================== */
    window.TornAutoBuyerPro = {
        scan: () => analyzer.scanForDeals(),
        buy: (deals) => analyzer.autoPurchaseDeals(deals || state.lastDeals),
        status: () => ({
            scanning: state.isScanning,
            purchasing: state.isPurchasing,
            totalPurchases: state.totalPurchases,
            totalProfit: state.totalProfit,
            lastDeals: state.lastDeals
        }),
        reset: () => {
            if (confirm('Reset all statistics?')) {
                state.totalPurchases = 0;
                state.totalProfit = 0;
                GM_setValue('total_purchases', 0);
                GM_setValue('total_profit', 0);
                ui.updateStats();
                alert('Statistics reset!');
            }
        }
    };

    /* ==================== START ==================== */
    initialize();
    setupDOMObserver();

    utils.log('System', '╔════════════════════════════════════════════════════╗');
    utils.log('System', '║   TORN AUTO BUYER PRO - FULLY LOADED              ║');
    utils.log('System', '║   Console API: window.TornAutoBuyerPro            ║');
    utils.log('System', '╚════════════════════════════════════════════════════╝');

})();