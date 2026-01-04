// ==UserScript==
// @name         Backpack.tf PriceDB.io Overlay
// @namespace    https://pricedb.io/
// @version      2.3.2
// @description  Overlay PriceDB.io prices on backpack.tf, Steam Community, and Scrap.tf inventory pages with buy/sell/average pricing options
// @author       Bliss
// @license      MIT
// @match        https://backpack.tf/profiles/*
// @match        https://backpack.tf/
// @match        https://backpack.tf/classifieds*
// @match        https://backpack.tf/pricelist*
// @match        https://steamcommunity.com/*/inventory/*
// @match        https://steamcommunity.com/*/inventory
// @match        https://scrap.tf/buy/*
// @match        https://scrap.tf/sell/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-idle
// @connect      pricedb.io
// @downloadURL https://update.greasyfork.org/scripts/552147/Backpacktf%20PriceDBio%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/552147/Backpacktf%20PriceDBio%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== CONFIG ==========
    const CONFIG = {
        API_BASE: 'https://pricedb.io/api',
        BATCH_SIZE: 50,
        CACHE_TTL: 15 * 60 * 1000, // 15 minutes
        BULK_CACHE_TTL: 60 * 60 * 1000, // 1 hour for bulk items cache
        REQUEST_DELAY: 300, // ms between batch requests
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    };

    // ========== SETTINGS ==========
    const SETTINGS = {
        PRICE_MODE: 'sell' // 'buy', 'sell', or 'average'
    };

    // Global variable to store dynamic refined metal per key price
    let REFINED_PER_KEY = 57.77; // Default fallback, will be updated from API

    // Load settings from storage
    function loadSettings() {
        try {
            const saved = GM_getValue('pricedb_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                Object.assign(SETTINGS, settings);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    // Save settings to storage
    function saveSettings() {
        try {
            GM_setValue('pricedb_settings', JSON.stringify(SETTINGS));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Check if item should be processed (skip Non-Tradable items)
     */
    function shouldProcessItem(itemElement, isSteam = false, steamData = null) {
        // For Steam items, check tradable flag and description
        if (isSteam && steamData) {
            // Check tradable flag (0 = not tradable, 1 = tradable)
            if (steamData.tradable === 0) {
                console.log(`⏭️ Skipping non-tradable Steam item: ${steamData.market_hash_name || steamData.name}`);
                return false;
            }
            
            // Check descriptions array for tradability text
            if (steamData.descriptions && Array.isArray(steamData.descriptions)) {
                const hasNonTradable = steamData.descriptions.some(desc => 
                    desc.value && (
                        desc.value.includes('Not Tradable') ||
                        desc.value.includes('Not Marketable')
                    )
                );
                if (hasNonTradable) {
                    console.log(`⏭️ Skipping item with tradability restriction: ${steamData.market_hash_name || steamData.name}`);
                    return false;
                }
            }
            
            return true;
        }
        
        // For Backpack.tf items, check title/name
        const name = itemElement.dataset.originalTitle || itemElement.dataset.name || itemElement.title || '';
        
        // Skip Non-Tradable items completely
        if (name.toLowerCase().includes('non-tradable') || name.toLowerCase().includes('not tradable')) {
            console.log('⏭️ Skipping non-tradable item:', name);
            return false;
        }
        
        return true;
    }

    /**
     * Extract Steam inventory item data using g_ActiveInventory
     * Steam stores ALL items in g_ActiveInventory.m_rgAssets (not just 75!)
     */
    function getSteamItemData(itemElement) {
        try {
            const itemId = itemElement.id; // Format: "440_2_16162197667"
            if (!itemId) {
                console.warn('❌ Steam item has no ID attribute');
                return null;
            }
            
            const parts = itemId.split('_');
            if (parts.length !== 3) {
                console.warn('❌ Steam item ID format invalid:', itemId);
                return null;
            }
            
            const [appid, contextid, assetid] = parts;
            
            // Access Steam's active inventory through unsafeWindow
            const g_ActiveInventory = unsafeWindow.g_ActiveInventory;
            
            if (!g_ActiveInventory) {
                console.error('❌ g_ActiveInventory not found! Steam inventory may not be loaded yet.');
                return null;
            }
            
            // Get asset directly from m_rgAssets (keyed by assetid)
            const asset = g_ActiveInventory.m_rgAssets[assetid];
            
            if (!asset) {
                console.warn(`⚠️ Asset ${assetid} not found in g_ActiveInventory.m_rgAssets`);
                return { _notYetLoaded: true, assetid: assetid };
            }
            
            // Get description from m_rgDescriptions (keyed by classid_instanceid)
            const descKey = `${asset.classid}_${asset.instanceid}`;
            const description = g_ActiveInventory.m_rgDescriptions[descKey];
            
            if (!description) {
                console.warn(`⚠️ Description not found for ${descKey}`);
                // Still return the asset, just without full description
                return asset;
            }
            
            // Merge asset with its description
            const mergedItem = {
                ...asset,
                ...description
            };
            
            return mergedItem;
            
        } catch (error) {
            console.error('Error extracting Steam item data:', error);
            return null;
        }
    }

    /**
     * Extract Scrap.tf item name from data-title attribute
     * Handles HTML entities and span tags for quality colors
     */
    function getScrapItemName(itemElement) {
        try {
            const dataTitle = itemElement.getAttribute('data-title');
            if (!dataTitle) {
                console.warn('❌ Scrap.tf item has no data-title attribute');
                return null;
            }
            
            // Decode HTML entities (e.g., &lt; to <)
            const parser = new DOMParser();
            const decodedDoc = parser.parseFromString(dataTitle, 'text/html');
            const decodedText = decodedDoc.documentElement.textContent;
            
            // Remove span tags (e.g., <span class='quality11'>Strange Medi Gun</span> -> Strange Medi Gun)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = decodedText;
            const cleanName = tempDiv.textContent || tempDiv.innerText || decodedText;
            
            console.log(`🔧 Scrap.tf item: "${cleanName}"`);
            return cleanName.trim();
            
        } catch (error) {
            console.error('Error extracting Scrap.tf item name:', error);
            return null;
        }
    }
    
    /**
     * Build SKU from Steam inventory item
     */
    function buildSKUFromSteamItem(steamData) {
        if (!steamData || !steamData.market_hash_name) return null;
        
        try {
            const name = steamData.market_hash_name;
            
            // Quality mapping from name prefixes
            const qualityMap = {
                'Strange': '11',
                'Genuine': '1',
                'Vintage': '3',
                'Unusual': '5',
                'Unique': '6',
                'Community': '7',
                'Self-Made': '9',
                'Haunted': '13',
                "Collector's": '14'
            };
            
            let quality = '6'; // Default to Unique
            for (const [prefix, q] of Object.entries(qualityMap)) {
                if (name.startsWith(prefix + ' ')) {
                    quality = q;
                    break;
                }
            }
            
            // Find defindex - Steam can store it in multiple places
            let defindex = null;
            
            // Method 1: Check app_data first (most reliable if present)
            if (steamData.app_data) {
                defindex = steamData.app_data.def_index || steamData.app_data.defindex;
            }
            
            // Method 2: Check tags for Type category
            if (!defindex && steamData.tags) {
                console.log('🔍 Searching tags for defindex. Tags:', JSON.stringify(steamData.tags, null, 2));
                for (const tag of steamData.tags) {
                    console.log('  Checking tag:', tag.category, tag.internal_name, tag.localized_tag_name);
                    // Try different tag categories that might contain defindex
                    if ((tag.category === 'Type' || tag.category === 'itemdef' || tag.category === 'Item') && tag.internal_name) {
                        // Steam might store defindex directly or as part of a string
                        const match = tag.internal_name.match(/\d+/);
                        if (match) {
                            defindex = match[0];
                            console.log('  ✅ Found defindex from tag:', defindex);
                            break;
                        }
                    }
                }
            }
            
            // Method 3: Check descriptions array for defindex
            if (!defindex && steamData.descriptions) {
                console.log('🔍 Searching descriptions for defindex');
                for (const desc of steamData.descriptions) {
                    if (desc.value) {
                        // Some descriptions contain "Item Level: X (Item #Y)" where Y is defindex
                        const match = desc.value.match(/Item #(\d+)/i) || desc.value.match(/defindex[:\s]+(\d+)/i);
                        if (match) {
                            defindex = match[1];
                            console.log('  ✅ Found defindex from description:', defindex);
                            break;
                        }
                    }
                }
            }
            
            // Method 4: For some items, we can use a known mapping of market_hash_name to defindex
            // This is a last resort fallback
            if (!defindex) {
                console.warn('⚠️ Could not determine defindex for:', name);
                console.log('📋 Full Steam data for debugging:', {
                    market_hash_name: steamData.market_hash_name,
                    market_name: steamData.market_name,
                    name: steamData.name,
                    type: steamData.type,
                    classid: steamData.classid,
                    instanceid: steamData.instanceid,
                    tags: steamData.tags,
                    app_data: steamData.app_data,
                    descriptions: steamData.descriptions
                });
                return null;
            }
            
            let sku = `${defindex};${quality}`;
            
            // Check for modifiers in name and descriptions
            const lowerName = name.toLowerCase();
            
            // Non-craftable
            if (lowerName.includes('non-craftable') || lowerName.includes('uncraftable')) {
                sku += ';uncraftable';
            }
            
            // Killstreak
            if (lowerName.includes('professional killstreak')) {
                sku += ';kt-3';
            } else if (lowerName.includes('specialized killstreak')) {
                sku += ';kt-2';
            } else if (lowerName.includes('killstreak')) {
                sku += ';kt-1';
            }
            
            // Australium
            if (lowerName.includes('australium')) {
                sku += ';australium';
            }
            
            // Festive
            if (lowerName.includes('festive')) {
                sku += ';festive';
            }
            
            return sku;
        } catch (error) {
            console.error('Error building SKU from Steam item:', error);
            return null;
        }
    }

    /**
     * Build TF2 SKU from item element data attributes (for Backpack.tf pages)
     */
    function buildSKU(itemElement, isSteam = false) {
        try {
            // Handle Steam inventory
            if (isSteam) {
                const steamData = getSteamItemData(itemElement);
                if (steamData) {
                    return buildSKUFromSteamItem(steamData);
                }
                return null;
            }
            
            // Handle Backpack.tf pages
            const defindex = itemElement.dataset.defindex;
            const quality = itemElement.dataset.quality;
            const name = itemElement.dataset.name || itemElement.title || '';
            
            if (!defindex || !quality) {
                console.warn('Missing defindex or quality for item:', itemElement);
                return null;
            }

            // Handle metal items (scrap, reclaimed, refined)
            if (defindex === '5000' && quality === '6') return '5000;6';  // Scrap Metal
            if (defindex === '5001' && quality === '6') return '5001;6';  // Reclaimed Metal  
            if (defindex === '5002' && quality === '6') return '5002;6';  // Refined Metal

            let sku = `${defindex};${quality}`;

            // Non-craftable - check both data attribute and name
            if (itemElement.dataset.craftable === '0' || name.toLowerCase().includes('non-craftable') || name.toLowerCase().includes('uncraftable')) {
                sku += ';uncraftable';
            }

            // Killstreak - use kt- prefix not ks-
            const ksTier = itemElement.dataset.ks_tier;
            if (ksTier) {
                sku += `;kt-${ksTier}`;
            }

            // Australium (check name)
            if (name.toLowerCase().includes('australium')) {
                sku += ';australium';
            }

            // Festive (check name)
            if (name.toLowerCase().includes('festive')) {
                sku += ';festive';
            }

            // Unusual effect - handle various formats
            const particle = itemElement.dataset.particle_id || itemElement.dataset.particle;
            if (particle && quality === '5') {
                sku += `;u${particle}`;
            }

            // Wear (for decorated weapons)
            const wear = itemElement.dataset.wear;
            if (wear) {
                sku += `;w${wear}`;
            }

            // Strange parts (if available)
            const strangeParts = itemElement.dataset.strange_parts;
            if (strangeParts) {
                sku += `;sp${strangeParts}`;
            }

            return sku;
        } catch (error) {
            console.error('Error building SKU:', error, itemElement);
            return null;
        }
    }

    /**
     * Format price for display
     */
    function formatPrice(priceObj, compact = false) {
        if (!priceObj) return 'N/A';
        
        const keys = priceObj.keys || 0;
        const metal = priceObj.metal || 0;

        if (compact) {
            // Compact format for overlays
            if (keys > 0 && metal > 0) {
                return `${keys} keys ${metal.toFixed(1)} ref`;
            } else if (keys > 0) {
                return `${keys} keys`;
            } else if (metal > 0) {
                return `${metal.toFixed(1)} ref`;
            }
        } else {
            // Normal format for tooltips
            if (keys > 0 && metal > 0) {
                return `${keys} keys, ${metal.toFixed(2)} ref`;
            } else if (keys > 0) {
                return `${keys} keys`;
            } else if (metal > 0) {
                return `${metal.toFixed(2)} ref`;
            }
        }
        
        return 'N/A';
    }

    /**
     * Get the appropriate price based on settings
     */
    function getDisplayPrice(priceData) {
        if (!priceData) return null;
        
        switch (SETTINGS.PRICE_MODE) {
            case 'buy':
                return priceData.buy;
            case 'sell':
                return priceData.sell;
            case 'average':
                if (priceData.buy && priceData.sell) {
                    const buyKeys = priceToKeys(priceData.buy);
                    const sellKeys = priceToKeys(priceData.sell);
                    const avgKeys = (buyKeys + sellKeys) / 2;
                    // Convert back to keys/metal format
                    const keys = Math.floor(avgKeys);
                    const metal = (avgKeys - keys) * REFINED_PER_KEY;
                    return { keys, metal };
                } else {
                    return priceData.buy || priceData.sell;
                }
            default:
                return priceData.sell; // Default to sell
        }
    }

    /**
     * Get hardcoded prices for metal items
     */
    function getMetalPrice(sku) {
        const metalPrices = {
            '5000;6': { // Scrap Metal
                keys: 0,
                metal: 0.11,
                source: 'hardcoded',
                time: Math.floor(Date.now() / 1000)
            },
            '5001;6': { // Reclaimed Metal
                keys: 0,
                metal: 0.33,
                source: 'hardcoded',
                time: Math.floor(Date.now() / 1000)
            },
            '5002;6': { // Refined Metal
                keys: 0,
                metal: 1.0,
                source: 'hardcoded',
                time: Math.floor(Date.now() / 1000)
            }
        };
        
        if (metalPrices[sku]) {
            return {
                sku: sku,
                name: sku === '5000;6' ? 'Scrap Metal' : sku === '5001;6' ? 'Reclaimed Metal' : 'Refined Metal',
                source: 'hardcoded',
                time: metalPrices[sku].time,
                buy: metalPrices[sku],
                sell: metalPrices[sku]
            };
        }
        
        return null;
    }

    /**
     * Convert price to keys for comparison
     */
    function priceToKeys(priceObj) {
        if (!priceObj) return 0;
        const keys = priceObj.keys || 0;
        const metal = priceObj.metal || 0;
        return keys + (metal / REFINED_PER_KEY);
    }



    /**
     * Make API request with retry logic
     */
    function apiRequest(url, options = {}, attempt = 1) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                data: options.data || undefined, // Use data as-is (already stringified in fetchBulkPrices)
                timeout: 10000,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            reject(new Error('Invalid JSON response'));
                        }
                    } else if (response.status === 429 && attempt < CONFIG.RETRY_ATTEMPTS) {
                        // Rate limited, retry with backoff
                        setTimeout(() => {
                            apiRequest(url, options, attempt + 1)
                                .then(resolve)
                                .catch(reject);
                        }, CONFIG.RETRY_DELAY * attempt);
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: (error) => {
                    if (attempt < CONFIG.RETRY_ATTEMPTS) {
                        setTimeout(() => {
                            apiRequest(url, options, attempt + 1)
                                .then(resolve)
                                .catch(reject);
                        }, CONFIG.RETRY_DELAY * attempt);
                    } else {
                        reject(error);
                    }
                },
                ontimeout: () => {
                    reject(new Error('Request timeout'));
                }
            });
        });
    }

    /**
     * Fetch and cache all items from PriceDB.io
     */
    async function fetchAllItems() {
        try {
            // Check if we have cached bulk data
            const cacheKey = 'pricedb_bulk_items';
            const cached = GM_getValue(cacheKey);
            
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < CONFIG.BULK_CACHE_TTL) {
                    console.log(`Using cached bulk items data (${data.items.length} items)`);
                    return data.items;
                }
            }
            
            console.log('Fetching all items from PriceDB.io...');
            const url = `${CONFIG.API_BASE}/autob/items`;
            const response = await apiRequest(url);
            
            if (response && response.success && response.items) {
                console.log(`✅ Received ${response.items.length} items from bulk API`);
                
                // Cache the results
                GM_setValue(cacheKey, JSON.stringify({
                    timestamp: Date.now(),
                    items: response.items
                }));
                
                return response.items;
            }
            
            return [];
        } catch (error) {
            console.error('Bulk items fetch error:', error);
            return [];
        }
    }

    /**
     * Find item by exact name match in bulk data
     */
    function findItemByName(allItems, itemName) {
        // Try exact match first
        let match = allItems.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        
        if (match) {
            console.log(`✅ Found exact match: "${itemName}" -> ${match.sell ? `${formatPrice(match.sell)}` : 'No sell price'}`);
            return match;
        }
        
        // Handle edge case: items starting with "The " in DOM but stored without it in database
        if (itemName.toLowerCase().startsWith('the ')) {
            const nameWithoutThe = itemName.substring(4); // Remove "The "
            match = allItems.find(item => item.name.toLowerCase() === nameWithoutThe.toLowerCase());
            
            if (match) {
                console.log(`✅ Found match without "The": "${itemName}" -> "${match.name}" -> ${match.sell ? `${formatPrice(match.sell)}` : 'No sell price'}`);
                return match;
            }
        }
        
        // Handle edge case: crates and cases with #<number> suffix in DOM but stored without it in database
        const cratePattern = /^(.+(?:crate|case))\s+#\d+$/i;
        const crateMatch = itemName.match(cratePattern);
        if (crateMatch) {
            const nameWithoutNumber = crateMatch[1]; // Remove the #<number> part
            match = allItems.find(item => item.name.toLowerCase() === nameWithoutNumber.toLowerCase());
            
            if (match) {
                console.log(`✅ Found crate/case match without #number: "${itemName}" -> "${match.name}" -> ${match.sell ? `${formatPrice(match.sell)}` : 'No sell price'}`);
                return match;
            }
        }
        
        console.log(`❌ No exact match found for: "${itemName}"`);
        return null;
    }



    /**
     * Process prices for all items using bulk data ONLY
     */
    async function processPrices(itemElements, pageConfig) {
        const itemData = [];
        const isSteam = pageConfig.isSteam || false;
        const isScrap = pageConfig.isScrap || false;
        
        // Fetch all items from PriceDB.io once
        console.log('🔄 Loading all items from PriceDB.io bulk API...');
        const allItems = await fetchAllItems();
        
        if (allItems.length === 0) {
            console.error('❌ Failed to load bulk items data - no prices will be shown');
            return itemData;
        }
        
        const pageType = isSteam ? 'Steam' : isScrap ? 'Scrap.tf' : 'Backpack.tf';
        console.log(`📊 Processing ${itemElements.length} ${pageType} items against ${allItems.length} database entries...`);
        
        let processedCount = 0;
        let skippedCount = 0;
        let deferredCount = 0; // Items whose data isn't loaded yet
        let foundCount = 0;
        
        // Process each item
        for (const element of itemElements) {
            processedCount++;
            
            let price = null;
            let itemName = '';
            let sku = null;
            let steamData = null;
            
            // Get item data based on page type
            if (isSteam) {
                // For Steam items, get data from g_ActiveInventory
                steamData = getSteamItemData(element);
                if (!steamData) {
                    console.warn('⚠️ Could not extract Steam data for item, skipping');
                    continue;
                }
                
                // Check if asset data hasn't loaded yet
                if (steamData._notYetLoaded) {
                    // Steam hasn't loaded this item's data yet - remove from processed set
                    // so it can be retried on next periodic check
                    processedItemIds.delete(element.id);
                    deferredCount++;
                    continue;
                }
                
                // Check if item should be processed (skip Non-Tradable) - AFTER getting steamData
                if (!shouldProcessItem(element, true, steamData)) {
                    skippedCount++;
                    continue;
                }
                
                // ALWAYS use market_hash_name for matching (original name, not custom name)
                itemName = steamData.market_hash_name;
                
                // Fallback to other name fields if market_hash_name is missing
                if (!itemName) {
                    itemName = steamData.market_name || steamData.name || '';
                }
                
                if (!itemName) {
                    console.warn('⚠️ No name found in Steam data, skipping');
                    continue;
                }
                
                // Log if item has custom name (fraud warning - renamed items)
                if (steamData.fraudwarnings && steamData.fraudwarnings.length > 0) {
                    console.log(`🏷️ Renamed item detected: "${steamData.name}" (original: "${itemName}")`);
                }
                
                // For Steam items, we'll match by name instead of SKU
                // since Steam doesn't expose defindex in inventory data
                sku = null; // Will be populated from matched item
                
                // Debug: Show first few items
                if (processedCount <= 3) {
                    console.log(`🔍 Steam Item ${processedCount}:`, {
                        name: itemName,
                        display_name: steamData.name,
                        market_name: steamData.market_name,
                        tradable: steamData.tradable,
                        marketable: steamData.marketable,
                        type: steamData.type,
                        classid: steamData.classid,
                        instanceid: steamData.instanceid,
                        tags: steamData.tags?.map(t => `${t.category}:${t.internal_name}`)
                    });
                }
            } else if (isScrap) {
                // For Scrap.tf items
                itemName = getScrapItemName(element);
                
                if (!itemName) {
                    console.warn('⚠️ No name found for Scrap.tf item, skipping');
                    skippedCount++;
                    continue;
                }
                
                // For Scrap.tf items, we'll match by name like Steam (no SKU building needed)
                sku = null; // Will be populated from matched item
                
                // Debug: Show first few items
                if (processedCount <= 3) {
                    console.log(`🔧 Scrap.tf Item ${processedCount}:`, {
                        name: itemName,
                        defindex: element.getAttribute('data-defindex'),
                        value: element.getAttribute('data-item-value')
                    });
                }
            } else {
                // For Backpack.tf items, check if should be processed first
                if (!shouldProcessItem(element, false, null)) {
                    skippedCount++;
                    continue;
                }
                
                // For Backpack.tf items, use HTML attributes
                itemName = element.getAttribute('data-original-title') || 
                          element.dataset.originalTitle || 
                          element.getAttribute('title') ||
                          element.title ||
                          element.dataset.name || 
                          '';
                
                if (!itemName) {
                    console.warn('⚠️ No name found for item, skipping');
                    continue;
                }
                
                // Build SKU from dataset attributes
                sku = buildSKU(element, false);
                
                // Debug: Show first few items
                if (processedCount <= 3) {
                    console.log(`🔍 Backpack Item ${processedCount}:`, {
                        name: itemName,
                        sku: sku,
                        defindex: element.dataset.defindex,
                        quality: element.dataset.quality
                    });
                }
            }
            
            // Check for metal items first (hardcoded prices)
            if (itemName.toLowerCase().includes('scrap metal')) {
                price = getMetalPrice('5000;6');
                sku = '5000;6';
            } else if (itemName.toLowerCase().includes('reclaimed metal')) {
                price = getMetalPrice('5001;6');
                sku = '5001;6';
            } else if (itemName.toLowerCase().includes('refined metal')) {
                price = getMetalPrice('5002;6');
                sku = '5002;6';
            } else {
                // Find exact match by name in bulk data
                const match = findItemByName(allItems, itemName);
                if (match) {
                    price = {
                        sku: match.sku,
                        name: match.name,
                        source: match.source,
                        time: match.time,
                        buy: match.buy,
                        sell: match.sell
                    };
                    // For Steam items, get SKU from matched price since Steam doesn't expose defindex
                    if (isSteam && !sku) {
                        sku = match.sku;
                    }
                    foundCount++;
                    
                    // Debug: Show matched items (first few and random samples)
                    if (processedCount <= 3 || (isSteam && processedCount % 50 === 0)) {
                        console.log(`  ✅ Item #${processedCount} Matched! Name: "${itemName}" → SKU: ${match.sku}, Price: ${match.sell?.keys || 0}k ${match.sell?.metal || 0}ref`);
                    }
                } else {
                    // Enhanced logging for failed matches to help debug inconsistencies
                    if (isSteam) {
                        console.warn(`❌ No match found for item #${processedCount}: "${itemName}"`);
                        console.log(`   Details:`, {
                            exact: itemName,
                            lowercase: itemName.toLowerCase(),
                            display_name: steamData?.name,
                            market_name: steamData?.market_name,
                            type: steamData?.type,
                            classid: steamData?.classid
                        });
                    }
                }
            }
            
            // Always add to itemData (with or without price)
            itemData.push({ 
                element, 
                sku: sku, // Use the SKU (from Backpack.tf dataset or matched from price data)
                price, 
                cached: false 
            });
            
            // For Steam items, mark as processed so periodic checker doesn't reprocess
            if (isSteam && element.id) {
                processedItemIds.add(element.id);
            }
        }
        
        console.log(`✅ Processing complete:`);
        console.log(`   📦 Total items processed: ${processedCount}`);
        console.log(`   ⏭️  Non-tradable items skipped: ${skippedCount}`);
        if (deferredCount > 0) {
            console.log(`   ⏸️  Items deferred (data not loaded yet): ${deferredCount}`);
        }
        console.log(`   💰 Items with prices found: ${foundCount}`);
        console.log(`   ❌ Items without prices: ${processedCount - skippedCount - deferredCount - foundCount}`);
        
        return itemData;
    }

    // ========== UI FUNCTIONS ==========

    /**
     * Create price display element
     */
    function createPriceElement(priceData, bptfPrice) {
        const container = document.createElement('div');
        container.className = 'pricedb-overlay';
        container.style.cssText = `
            position: absolute;
            top: 2px;
            right: 2px;
            background: rgba(40, 40, 40, 0.95);
            padding: 1px 4px;
            border-radius: 2px;
            font-size: 9px;
            color: white;
            font-weight: bold;
            z-index: 10;
            white-space: nowrap;
            box-shadow: 0 1px 2px rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.2);
        `;

        const displayPrice = getDisplayPrice(priceData);
        if (!displayPrice) {
            container.textContent = 'N/A';
        } else {
            container.textContent = formatPrice(displayPrice, true); // Use compact format
        }

        // Add tooltip with more info
        if (priceData && (priceData.buy || priceData.sell)) {
            const tooltip = document.createElement('div');
            tooltip.className = 'pricedb-tooltip';
            tooltip.style.cssText = `
                display: none;
                position: absolute;
                top: -5px;
                left: 100%;
                background: rgba(0, 0, 0, 0.95);
                color: white;
                padding: 6px 8px;
                border-radius: 4px;
                font-size: 11px;
                white-space: nowrap;
                margin-left: 4px;
                z-index: 20;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            `;

            let tooltipHTML = '<div style="font-weight: bold; margin-bottom: 3px;">PriceDB.io</div>';
            if (priceData.buy) {
                tooltipHTML += `<div>Buy: ${formatPrice(priceData.buy, false)}</div>`;
            }
            if (priceData.sell) {
                tooltipHTML += `<div>Sell: ${formatPrice(priceData.sell, false)}</div>`;
            }
            if (priceData.time) {
                const date = new Date(priceData.time * 1000);
                tooltipHTML += `<div style="font-size: 9px; opacity: 0.7; margin-top: 3px;">Updated: ${date.toLocaleDateString()}</div>`;
            }

            tooltip.innerHTML = tooltipHTML;
            container.appendChild(tooltip);

            container.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
            });
            container.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }

        return container;
    }

    /**
     * Apply price overlays to item elements
     */
    function applyPriceOverlays(itemDataArray) {
        let appliedCount = 0;
        let withPriceCount = 0;
        let withoutPriceCount = 0;
        
        for (const itemData of itemDataArray) {
            const { element, price } = itemData;
            
            // Make item position relative for absolute positioning of overlay
            element.style.position = 'relative';

            // Get backpack.tf price for comparison
            const bptfPriceStr = element.dataset.price;
            const bptfPrice = bptfPriceStr ? parseFloat(bptfPriceStr) / REFINED_PER_KEY : null; // Convert ref to keys

            // Create and append price element
            const priceElement = createPriceElement(price, bptfPrice);
            element.appendChild(priceElement);
            
            appliedCount++;
            if (price && (price.buy || price.sell)) {
                withPriceCount++;
            } else {
                withoutPriceCount++;
            }
        }
        
        console.log(`🎨 Applied overlays to ${appliedCount} items (${withPriceCount} with prices, ${withoutPriceCount} without)`);
    }

    /**
     * Create summary panel
     */
    function createSummaryPanel(itemDataArray, pageConfig) {
        // Calculate totals
        let pricedbTotal = 0;
        let siteTotal = 0;
        let itemsWithPrices = 0;

        const siteName = pageConfig.isScrap ? 'Scrap.tf' : pageConfig.isSteam ? 'Steam' : 'Backpack.tf';
        const showComparison = !pageConfig.isScrap && !pageConfig.isSteam; // Only show comparison for Backpack.tf

        for (const itemData of itemDataArray) {
            const { element, price } = itemData;

            // PriceDB.io total using selected price mode
            const displayPrice = getDisplayPrice(price);
            if (displayPrice) {
                pricedbTotal += priceToKeys(displayPrice);
                itemsWithPrices++;
            }

            // Site total (only for Backpack.tf which has data-price in refined)
            if (showComparison) {
                const siteRef = element.dataset.price;
                if (siteRef) {
                    siteTotal += parseFloat(siteRef) / REFINED_PER_KEY;
                }
            }
        }

        const difference = pricedbTotal - siteTotal;
        const percentDiff = siteTotal > 0 ? (difference / siteTotal * 100).toFixed(1) : 0;

        // Create panel
        const panel = document.createElement('div');
        panel.id = 'pricedb-summary';
        panel.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            background: rgba(255, 255, 255, 0.98);
            border: 2px solid #0078d7;
            border-radius: 8px;
            padding: 15px;
            min-width: 280px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
        `;

        let comparisonHTML = '';
        if (showComparison) {
            comparisonHTML = `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 6px 0; color: #666;">${siteName} Total:</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #333;">
                        ${siteTotal.toFixed(2)} keys
                    </td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 6px 0; color: #666;">PriceDB.io Total:</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #0078d7;">
                        ${pricedbTotal.toFixed(2)} keys
                    </td>
                </tr>
                <tr style="border-bottom: 2px solid #ddd;">
                    <td style="padding: 6px 0; color: #666;">Items Priced:</td>
                    <td style="padding: 6px 0; text-align: right; color: #333;">
                        ${itemsWithPrices} / ${itemDataArray.length}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #333;">Difference:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; font-size: 14px; color: ${difference >= 0 ? '#28a745' : '#dc3545'};">
                        ${difference >= 0 ? '+' : ''}${difference.toFixed(2)} keys
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            (${percentDiff >= 0 ? '+' : ''}${percentDiff}%)
                        </div>
                    </td>
                </tr>
            `;
        } else {
            comparisonHTML = `
                <tr style="border-bottom: 2px solid #ddd;">
                    <td style="padding: 6px 0; color: #666;">PriceDB.io Total:</td>
                    <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #0078d7;">
                        ${pricedbTotal.toFixed(2)} keys
                    </td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #666;">Items Priced:</td>
                    <td style="padding: 6px 0; text-align: right; color: #333;">
                        ${itemsWithPrices} / ${itemDataArray.length}
                    </td>
                </tr>
            `;
        }

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px; color: #333;">💰 ${siteName} Prices</h3>
                <div style="display: flex; gap: 4px;">
                    <button id="pricedb-settings" style="background: #666; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;" title="Settings">
                        ⚙️
                    </button>
                    <button id="pricedb-refresh" style="background: #0078d7; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">
                        🔄 Refresh
                    </button>
                </div>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                ${comparisonHTML}
            </table>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center;">
                Powered by <a href="https://pricedb.io" target="_blank" style="color: #0078d7; text-decoration: none;">PriceDB.io</a>
                <span style="margin: 0 8px; color: #ddd;">•</span>
                <a href="https://discord.gg/6Ka2qdSz" target="_blank" style="color: #5865F2; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;" title="Join our Discord">
                    <svg width="16" height="16" viewBox="0 0 71 55" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                    </svg>
                    Discord
                </a>
            </div>
        `;

        document.body.appendChild(panel);

        // Add refresh button handler
        document.getElementById('pricedb-refresh').addEventListener('click', () => {
            // Clear all cache including bulk items
            const keys = GM_listValues();
            keys.forEach(key => {
                if (key.startsWith('pricedb_')) {
                    GM_deleteValue(key);
                }
            });
            console.log('Cache cleared, reloading...');
            location.reload();
        });

        // Add settings button handler
        document.getElementById('pricedb-settings').addEventListener('click', () => {
            showSettingsModal();
        });

        // Make panel draggable
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        panel.addEventListener('mousedown', (e) => {
            if (e.target.id === 'pricedb-refresh') return;
            isDragging = true;
            initialX = e.clientX - panel.offsetLeft;
            initialY = e.clientY - panel.offsetTop;
            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                panel.style.left = currentX + 'px';
                panel.style.top = currentY + 'px';
                panel.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'move';
        });

        panel.style.cursor = 'move';
    }

    /**
     * Show settings modal
     */
    function showSettingsModal() {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 20px;
            min-width: 300px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        modal.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #333;">⚙️ PriceDB Settings</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #666; font-weight: 500;">Price to Display:</label>
                <select id="price-mode-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                    <option value="sell" ${SETTINGS.PRICE_MODE === 'sell' ? 'selected' : ''}>Sell Price (Most Common)</option>
                    <option value="buy" ${SETTINGS.PRICE_MODE === 'buy' ? 'selected' : ''}>Buy Price</option>
                    <option value="average" ${SETTINGS.PRICE_MODE === 'average' ? 'selected' : ''}>Average (Buy + Sell) / 2</option>
                </select>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button id="settings-cancel" style="background: #ccc; color: #333; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
                    Cancel
                </button>
                <button id="settings-save" style="background: #0078d7; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">
                    Save & Refresh
                </button>
            </div>
        `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Add event handlers
        document.getElementById('settings-cancel').addEventListener('click', () => {
            document.body.removeChild(backdrop);
        });

        document.getElementById('settings-save').addEventListener('click', () => {
            const select = document.getElementById('price-mode-select');
            SETTINGS.PRICE_MODE = select.value;
            saveSettings();
            document.body.removeChild(backdrop);
            console.log('Settings saved, reloading...');
            location.reload();
        });

        // Close on backdrop click
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                document.body.removeChild(backdrop);
            }
        });
    }

    /**
     * Update existing summary panel with current totals
     * Called after each batch of items is processed
     */
    function updateSummaryPanel() {
        // Gather all items that have been processed so far
        const allProcessedItems = document.querySelectorAll('[data-price-overlay]');
        const allItemsData = [];
        
        allProcessedItems.forEach(el => {
            try {
                const data = JSON.parse(el.dataset.priceOverlay || '{}');
                if (data.price) {
                    allItemsData.push({
                        element: el,
                        price: data.price,
                        sku: data.sku
                    });
                }
            } catch (e) {
                // Skip invalid data
            }
        });
        
        // Remove old panel if exists
        const oldPanel = document.getElementById('pricedb-summary');
        if (oldPanel) {
            oldPanel.remove();
        }
        
        // Create new panel with updated totals
        if (allItemsData.length > 0) {
            const pageConfig = detectPageType();
            createSummaryPanel(allItemsData, pageConfig);
            console.log(`📊 Summary panel updated: ${allItemsData.length} items priced`);
        }
    }

    // ========== MAIN EXECUTION ==========

    /**
     * Wait for Steam's inventory data to be populated
     * Steam loads inventory asynchronously after page load
     */
    async function waitForSteamInventoryData(maxAttempts = 30) {
        const g_inventoryData = unsafeWindow.g_inventoryData;
        
        if (!g_inventoryData) {
            console.error('❌ g_inventoryData does not exist on this page');
            return false;
        }

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const appids = Object.keys(g_inventoryData);
            
            if (appids.length > 0 && g_inventoryData['440']) {
                console.log(`✅ Steam inventory data loaded (attempt ${attempt}/${maxAttempts})`);
                console.log('Available appids:', appids);
                
                // Check if data is actually populated
                if (g_inventoryData['440'].data || g_inventoryData['440'].rgInventory) {
                    return true;
                }
            }
            
            console.log(`⏳ Waiting for Steam inventory data... (attempt ${attempt}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        console.error('❌ Steam inventory data failed to load after', maxAttempts, 'attempts');
        return false;
    }

    async function initialize(pageConfig) {
        console.log('🎮 Backpack.tf PriceDB.io Overlay initialized');
        console.log('Page type:', pageConfig.description);
        
        // Load settings
        loadSettings();
        console.log('Using price mode:', SETTINGS.PRICE_MODE);

        // Wait a bit for page to fully render
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find all item elements using page-specific selector
        let itemElements = document.querySelectorAll(pageConfig.selector);
        
        if (itemElements.length === 0) {
            console.warn('No items found on page using selector:', pageConfig.selector);
            return;
        }

        console.log(`Found ${itemElements.length} items`);

        // Debug: Log first few items' attributes and SKUs
        if (itemElements.length > 0) {
            console.log('Sample item analysis:');
            for (let i = 0; i < Math.min(5, itemElements.length); i++) {
                const item = itemElements[i];
                
                if (pageConfig.isSteam) {
                    // For Steam items, show what we can extract
                    console.log(`Item ${i + 1} (Steam):`, {
                        id: item.id,
                        classes: item.className
                    });
                    const steamData = getSteamItemData(item);
                    if (steamData) {
                        console.log(`  -> market_hash_name: ${steamData.market_hash_name}`);
                        const sku = buildSKU(item, true);
                        console.log(`  -> SKU: ${sku}`);
                    } else {
                        console.log(`  -> Could not extract Steam data`);
                    }
                } else {
                    // For Backpack.tf items
                    const itemDataset = item.dataset || {};
                    console.log(`Item ${i + 1}:`, {
                        defindex: itemDataset.defindex,
                        quality: itemDataset.quality,
                        name: itemDataset.name || item.title,
                        craftable: itemDataset.craftable,
                        ks_tier: itemDataset.ks_tier,
                        particle_id: itemDataset.particle_id,
                        title: item.title
                    });
                    const sku = buildSKU(item, false);
                    console.log(`  -> SKU: ${sku}`);
                    
                    // Test if it's a metal item
                    if (sku && getMetalPrice(sku)) {
                        console.log(`  -> Metal item detected with hardcoded price`);
                    }
                }
            }
        }

        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'pricedb-loading';
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 120, 215, 0.95);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        loadingIndicator.innerHTML = '⏳ Loading PriceDB.io prices...';
        document.body.appendChild(loadingIndicator);

        try {
            // For Steam pages, wait for inventory data to load
            if (pageConfig.isSteam) {
                console.log('🔄 Waiting for Steam inventory data to load...');
                const dataLoaded = await waitForSteamInventoryData();
                if (!dataLoaded) {
                    throw new Error('Steam inventory data failed to load');
                }
                console.log('✅ Steam inventory data loaded!');
            }
            
            // Process prices (pass full pageConfig)
            const itemDataArray = await processPrices(Array.from(itemElements), pageConfig);

            // Apply overlays
            applyPriceOverlays(itemDataArray);

            // Create summary panel only on profile pages
            if (pageConfig.showSummary) {
                createSummaryPanel(itemDataArray, pageConfig);
            }

            console.log('✅ Price overlay complete');
            loadingIndicator.innerHTML = '✅ Prices loaded!';
            setTimeout(() => loadingIndicator.remove(), 2000);
            
            // For Steam pages, set up observer to watch for lazy-loaded items
            if (pageConfig.isSteam) {
                setupSteamInventoryObserver(pageConfig);
            }
        } catch (error) {
            console.error('Error during initialization:', error);
            loadingIndicator.innerHTML = '❌ Error loading prices';
            loadingIndicator.style.background = 'rgba(220, 53, 69, 0.95)';
            setTimeout(() => loadingIndicator.remove(), 3000);
        }
    }

    /**
     * Set up MutationObserver to process Steam items as they're lazy-loaded
     */
    let processedItemIds = new Set();
    let processingQueue = [];
    let isProcessingQueue = false;

    function setupSteamInventoryObserver(pageConfig) {
        console.log('🔍 Setting up observer for lazy-loaded Steam items...');
        
        // Find the inventory container
        const inventoryContainer = document.querySelector('#inventories') || 
                                  document.querySelector('.inventory_page') ||
                                  document.body;
        
        if (!inventoryContainer) {
            console.warn('⚠️ Could not find inventory container for observer');
            return;
        }

        // Note: We don't mark existing items here because they were already processed
        // in the initial batch. Only NEW items added after this point need tracking.

        const observer = new MutationObserver((mutations) => {
            const newItems = [];
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Check if the node itself matches
                            if (node.matches && node.matches(pageConfig.selector)) {
                                if (!processedItemIds.has(node.id)) {
                                    newItems.push(node);
                                    processedItemIds.add(node.id);
                                }
                            }
                            // Check for matching children
                            const children = node.querySelectorAll?.(pageConfig.selector);
                            if (children) {
                                children.forEach(child => {
                                    if (!processedItemIds.has(child.id)) {
                                        newItems.push(child);
                                        processedItemIds.add(child.id);
                                    }
                                });
                            }
                        }
                    });
                }
            }

            if (newItems.length > 0) {
                console.log(`📦 Found ${newItems.length} new Steam items`);
                processingQueue.push(...newItems);
                processQueuedItems(pageConfig);
            }
        });

        observer.observe(inventoryContainer, {
            childList: true,
            subtree: true
        });

        console.log('✅ Steam inventory observer active');
        
        // Also set up periodic checker for items that might have loaded without triggering mutations
        setupPeriodicItemChecker(pageConfig);
    }

    /**
     * Periodically check for new items that might have loaded
     * Steam sometimes loads items in batches without triggering DOM mutations
     */
    function setupPeriodicItemChecker(pageConfig) {
        console.log('⏰ Setting up periodic item checker...');
        console.log('   Selector:', pageConfig.selector);
        console.log('   Currently processed items:', processedItemIds.size);
        
        let checkCount = 0;
        const maxChecks = 40; // Check for 2 minutes (40 * 3 seconds)
        
        const checker = setInterval(() => {
            checkCount++;
            console.log(`\n🔍 Periodic check #${checkCount}/${maxChecks}...`);
            
            // Find all items on page
            const allItems = document.querySelectorAll(pageConfig.selector);
            console.log(`   Found ${allItems.length} total items on page`);
            console.log(`   Already processed: ${processedItemIds.size} items`);
            
            const newItems = [];
            
            allItems.forEach(item => {
                if (item.id && !processedItemIds.has(item.id)) {
                    newItems.push(item);
                    // Don't mark as processed here - let processPrices() do it
                }
            });
            
            if (newItems.length > 0) {
                console.log(`🔄 Periodic check found ${newItems.length} unprocessed items!`);
                processingQueue.push(...newItems);
                processQueuedItems(pageConfig);
            } else {
                console.log(`✓ Periodic check: all ${allItems.length} items already processed`);
            }
            
            // Stop checking after max checks or if inventory seems complete
            if (checkCount >= maxChecks) {
                console.log('⏹️ Stopping periodic checks (max reached)');
                clearInterval(checker);
            }
        }, 3000); // Check every 3 seconds
        
        console.log('✅ Periodic item checker started (runs every 3 seconds for 2 minutes)');
    }

    /**
     * Process queued items in batches to avoid overwhelming the browser
     */
    async function processQueuedItems(pageConfig) {
        if (isProcessingQueue || processingQueue.length === 0) {
            return;
        }

        isProcessingQueue = true;

        try {
            // Process in batches of 20 items
            const batchSize = 20;
            const batch = processingQueue.splice(0, batchSize);
            
            console.log(`🔄 Processing batch of ${batch.length} items...`);
            
            const itemDataArray = await processPrices(batch, pageConfig);
            applyPriceOverlays(itemDataArray);
            
            // Update summary panel with new totals after each batch
            updateSummaryPanel();
            
            console.log(`✅ Batch complete (${processingQueue.length} remaining)`);

            // Continue processing if more items in queue
            if (processingQueue.length > 0) {
                setTimeout(() => {
                    isProcessingQueue = false;
                    processQueuedItems(pageConfig);
                }, 100); // Small delay between batches
            } else {
                isProcessingQueue = false;
            }
        } catch (error) {
            console.error('Error processing queued items:', error);
            isProcessingQueue = false;
        }
    }

    // Add key price overlay on homepage
    async function addKeyPriceOverlay(keyBox) {
        try {
            // Mann Co. Supply Crate Key is 5021;6
            const keySKU = '5021;6';
            
            // Check cache first
            const cacheKey = `pricedb_${keySKU}`;
            const cached = GM_getValue(cacheKey);
            
            let priceData;
            if (cached) {
                const data = JSON.parse(cached);
                if (Date.now() - data.timestamp < CONFIG.CACHE_TTL) {
                    priceData = data.price;
                }
            }
            
            // Fetch if not cached
            if (!priceData) {
                const response = await apiRequest(`${CONFIG.API_BASE}/item/${keySKU}`);
                priceData = response;
                
                // Cache the result
                GM_setValue(cacheKey, JSON.stringify({
                    price: priceData,
                    timestamp: Date.now()
                }));
            }
            
            // Update global REFINED_PER_KEY from key price data
            if (priceData && priceData.sell && priceData.sell.metal) {
                REFINED_PER_KEY = priceData.sell.metal;
                console.log(`💰 Updated refined per key rate: ${REFINED_PER_KEY} ref/key (from PriceDB.io key price)`);
            }
            
            if (priceData && priceData.sell) {
                // Find the price element
                const priceElement = keyBox.querySelector('.value');
                if (priceElement) {
                    const pricedbPrice = formatPrice(priceData.sell, false);
                    
                    // Add PriceDB.io price below BPTF price
                    const overlay = document.createElement('p');
                    overlay.className = 'value';
                    overlay.style.cssText = `
                        color: #00d4d4;
                        font-weight: bold;
                        margin-top: 5px;
                        font-size: 13px;
                    `;
                    overlay.innerHTML = `📊 PriceDB: ${pricedbPrice}`;
                    overlay.title = `PriceDB.io price for Mann Co. Supply Crate Key`;
                    
                    priceElement.parentElement.insertBefore(overlay, priceElement.nextSibling);
                    console.log('✅ Added key price overlay');
                }
            }
        } catch (error) {
            console.error('Error adding key price overlay:', error);
        }
    }

    // Detect page type and appropriate selectors
    function detectPageType() {
        const url = window.location.href;
        
        if (url.includes('steamcommunity.com') && url.includes('/inventory')) {
            return {
                type: 'steam',
                selector: '.item.app440.context2',
                showSummary: true,
                description: 'Steam Inventory',
                isSteam: true
            };
        } else if (url.includes('scrap.tf/buy/') || url.includes('scrap.tf/sell/')) {
            return {
                type: 'scrap',
                selector: 'div.item.app440',
                showSummary: true,
                description: 'Scrap.tf Trading',
                isScrap: true
            };
        } else if (url.includes('/profiles/')) {
            return {
                type: 'profile',
                selector: 'li.item[data-defindex]',
                showSummary: true,
                description: 'Profile Inventory'
            };
        } else if (url.includes('/classifieds')) {
            return {
                type: 'classifieds',
                selector: 'li.listing .item[data-defindex]',
                showSummary: false,
                description: 'Classifieds Listings'
            };
        } else if (url.includes('/pricelist')) {
            return {
                type: 'pricelist',
                selector: 'li.item-pricegrid',
                showSummary: false,
                description: 'Price List'
            };
        } else if (url === 'https://backpack.tf/' || url === 'https://backpack.tf') {
            return {
                type: 'homepage',
                selector: 'li.item[data-defindex]',
                showSummary: false,
                description: 'Homepage'
            };
        }
        
        return null;
    }

    // Wait for page to be fully loaded and backpack items to render
    let keyBoxProcessed = false;
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 20; // 10 seconds max wait
    
    function waitForItems() {
        const pageConfig = detectPageType();
        
        if (!pageConfig) {
            console.log('⚠️ PriceDB.io Overlay: Not a supported page type');
            return;
        }
        
        const items = document.querySelectorAll(pageConfig.selector);
        
        // Check for currency box on homepage (do this once)
        if (pageConfig.type === 'homepage' && !keyBoxProcessed) {
            const keyBox = document.querySelector('a.currency-box[href*="Supply%20Crate%20Key"]');
            if (keyBox) {
                console.log('✅ PriceDB.io Overlay: Adding key price overlay');
                addKeyPriceOverlay(keyBox);
                keyBoxProcessed = true;
            }
        }
        
        if (items.length > 0) {
            console.log(`✅ PriceDB.io Overlay: ${pageConfig.description} - Found ${items.length} items`);
            initialize(pageConfig);
        } else {
            initAttempts++;
            if (initAttempts < MAX_INIT_ATTEMPTS) {
                console.log(`⏳ Waiting for ${pageConfig.description} items... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
                setTimeout(waitForItems, 500);
            } else {
                console.log(`⚠️ No items found after ${MAX_INIT_ATTEMPTS} attempts. Page may not have items or they may be loading dynamically.`);
                // On homepage, this is normal - just show the key price
                if (pageConfig.type === 'homepage') {
                    console.log('✅ Homepage key price overlay complete (no inventory items expected)');
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForItems);
    } else {
        // Page already loaded, but items might still be rendering
        waitForItems();
    }

})();
