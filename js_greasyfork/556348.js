// ==UserScript==
// @name         Neopets Inventory Manager
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Consolidate and manage your Neopets inventory from Gallery, Shop, Inventory, and SDB with ItemDB pricing
// @author       Fatalsymptoms
// @match        https://www.neopets.com/*
// @license MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      itemdb.com.br
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/556348/Neopets%20Inventory%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/556348/Neopets%20Inventory%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        ITEMDB_API: 'https://itemdb.com.br/api/v1/items/',
        STORAGE_KEY: 'neopets_inventory_data',
        PRICE_CACHE_KEY: 'neopets_price_cache',
        CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
        REQUEST_DELAY: 1000 // 1 second between API requests
    };

    // Data structure
    class InventoryManager {
        constructor() {
            this.inventory = GM_getValue(CONFIG.STORAGE_KEY, {
                gallery: [],
                shop: [],
                inventory: [],
                sdb: [],
                lastUpdated: {}
            });
            this.priceCache = GM_getValue(CONFIG.PRICE_CACHE_KEY, {});
        }

        save() {
            GM_setValue(CONFIG.STORAGE_KEY, this.inventory);
            GM_setValue(CONFIG.PRICE_CACHE_KEY, this.priceCache);
        }

        async fetchFromGallery() {
            console.log('Fetching from Gallery...');

            return new Promise((resolve, reject) => {
                // Check if we're already on a gallery page
                const currentUrl = window.location.href;
                const isOnGalleryPage = currentUrl.includes('/gallery/');

                if (isOnGalleryPage) {
                    // Parse current page directly
                    console.log('Already on gallery page, parsing current page...');
                    const items = this.parseGalleryPage(document);
                    this.inventory.gallery = items;
                    this.inventory.lastUpdated.gallery = new Date().toISOString();
                    this.save();
                    resolve(items);
                } else {
                    // Fetch gallery page
                    console.log('Fetching gallery page...');
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://www.neopets.com/gallery/index.phtml?view=all',
                        onload: (response) => {
                            try {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(response.responseText, 'text/html');
                                const items = this.parseGalleryPage(doc);

                                console.log(`Found ${items.length} items in gallery`);

                                this.inventory.gallery = items;
                                this.inventory.lastUpdated.gallery = new Date().toISOString();
                                this.save();

                                resolve(items);
                            } catch (error) {
                                console.error('Error parsing gallery:', error);
                                reject(error);
                            }
                        },
                        onerror: (error) => {
                            console.error('Error fetching gallery:', error);
                            reject(error);
                        }
                    });
                }
            });
        }

        parseGalleryPage(doc) {
            const items = [];

            console.log('=== PARSING GALLERY PAGE ===');

            // Find the form table
            const mainTable = doc.querySelector('form[name="gallery_form"] table[border="0"][align="center"]');

            if (!mainTable) {
                console.error('Could not find gallery form table');
                console.log('Looking for alternative gallery structure...');

                // Try the remove form structure
                const removeTable = doc.querySelector('form[id="gallery_form"] table[border="0"][align="center"]');
                if (removeTable) {
                    console.log('Found gallery_form by ID instead');
                    return this.parseGalleryTableStructure(removeTable);
                }

                return items;
            }

            return this.parseGalleryTableStructure(mainTable);
        }

        parseGalleryTableStructure(table) {
            const items = [];
            const rows = Array.from(table.querySelectorAll('tr'));

            console.log(`Found ${rows.length} rows in gallery table`);

            // Iterate through all rows looking for items
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                // Look for cells that contain item images
                const itemCells = row.querySelectorAll('td[width="140"][align="center"][valign="top"]');

                if (itemCells.length === 0) continue;

                console.log(`Row ${i}: Found ${itemCells.length} item cells`);

                // Process each item cell in this row
                itemCells.forEach((cell, cellIndex) => {
                    const img = cell.querySelector('img.itemimg');
                    const nameEl = cell.querySelector('b.textcolor');

                    if (!img || !nameEl) return;

                    const name = nameEl.textContent.trim();
                    const imageUrl = img.src;
                    let quantity = 1;

                    // The quantity is in the NEXT row, at the SAME cell index
                    if (i + 1 < rows.length) {
                        const qtyRow = rows[i + 1];
                        const qtyCells = qtyRow.querySelectorAll('td[align="center"]');

                        console.log(`  Looking for qty in row ${i + 1}, cell ${cellIndex}`);
                        console.log(`  Found ${qtyCells.length} cells in qty row`);

                        if (qtyCells[cellIndex]) {
                            const qtyCell = qtyCells[cellIndex];
                            const qtyHTML = qtyCell.innerHTML;
                            const qtyText = qtyCell.textContent;

                            console.log(`  Qty cell HTML: ${qtyHTML.substring(0, 100)}`);
                            console.log(`  Qty cell text: ${qtyText.trim()}`);

                            // Try to find "Qty:X" pattern
                            const qtyMatch = qtyText.match(/Qty:\s*(\d+)/i);

                            if (qtyMatch) {
                                quantity = parseInt(qtyMatch[1], 10);
                                console.log(`  ✓ Found quantity: ${quantity}`);
                            } else {
                                console.log(`  ✗ No quantity match found in: "${qtyText.trim()}"`);
                            }
                        } else {
                            console.log(`  ✗ No qty cell at index ${cellIndex}`);
                        }
                    }

                    console.log(`Adding: ${name} x${quantity}`);

                    items.push({
                        name: name,
                        quantity: quantity,
                        imageUrl: imageUrl,
                        source: 'gallery'
                    });
                });
            }

            console.log(`=== TOTAL ITEMS: ${items.length} ===`);
            return items;
        }

        async fetchFromInventory() {
            console.log('Fetching from Inventory...');
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://www.neopets.com/objects.phtml?type=inventory',
                    onload: (response) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const items = this.parseInventoryPage(doc);

                        this.inventory.inventory = items;
                        this.inventory.lastUpdated.inventory = new Date().toISOString();
                        this.save();

                        resolve(items);
                    },
                    onerror: reject
                });
            });
        }

        parseInventoryPage(doc) {
            const items = [];
            const itemElements = doc.querySelectorAll('td[bgcolor]');

            itemElements.forEach(el => {
                const img = el.querySelector('img');
                const nameEl = el.querySelector('b');

                if (img && nameEl && img.src.includes('items/')) {
                    items.push({
                        name: nameEl.textContent.trim(),
                        quantity: 1,
                        imageUrl: img.src,
                        source: 'inventory'
                    });
                }
            });

            return items;
        }

        async fetchFromShop(progressCallback) {
            console.log('Fetching from Shop...');

            return new Promise(async (resolve, reject) => {
                try {
                    const allItems = [];
                    let currentPage = 0;
                    let hasMorePages = true;

                    while (hasMorePages) {
                        console.log(`Fetching shop page ${currentPage + 1}...`);

                        if (progressCallback) {
                            progressCallback(currentPage + 1, '?', `Fetching page ${currentPage + 1}...`);
                        }

                        const url = currentPage === 0
                            ? 'https://www.neopets.com/market.phtml?type=your'
                            : `https://www.neopets.com/market.phtml?type=your&lim=${currentPage * 30}`;

                        const pageItems = await this.fetchShopPage(url);

                        if (pageItems.length > 0) {
                            allItems.push(...pageItems);
                            console.log(`Page ${currentPage + 1}: Found ${pageItems.length} items (Total: ${allItems.length})`);
                            currentPage++;

                            // Add a small delay between pages
                            await new Promise(resolve => setTimeout(resolve, 500));
                        } else {
                            hasMorePages = false;
                        }

                        // Safety check - stop after 100 pages
                        if (currentPage >= 100) {
                            console.warn('Reached maximum page limit (100 pages)');
                            hasMorePages = false;
                        }
                    }

                    console.log(`Shop fetch complete: ${allItems.length} total items from ${currentPage} pages`);

                    this.inventory.shop = allItems;
                    this.inventory.lastUpdated.shop = new Date().toISOString();
                    this.save();

                    resolve(allItems);
                } catch (error) {
                    console.error('Error fetching shop:', error);
                    reject(error);
                }
            });
        }

        fetchShopPage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (response) => {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const items = this.parseShopPageStructure(doc);
                            resolve(items);
                        } catch (error) {
                            console.error('Error parsing shop page:', error);
                            reject(error);
                        }
                    },
                    onerror: reject
                });
            });
        }

        parseShopPageStructure(doc) {
            const items = [];

            // Find all rows in the shop table
            const rows = doc.querySelectorAll('form[action="process_market.phtml"] table tr');

            console.log(`Found ${rows.length} rows in shop table`);

            rows.forEach((row, index) => {
                // Skip header and footer rows
                const cells = row.querySelectorAll('td');
                if (cells.length < 6) return;

                // Check if this is an item row (has item name in first cell)
                const nameCell = cells[0];
                const imgCell = cells[1];
                const stockCell = cells[2];
                const priceCell = cells[4];

                const nameEl = nameCell.querySelector('b');
                const img = imgCell.querySelector('img');

                if (!nameEl || !img) return;

                const name = nameEl.textContent.trim();
                const imageUrl = img.src;

                // Extract stock quantity
                let quantity = 1;
                const stockText = stockCell.textContent.trim();
                const stockMatch = stockText.match(/\b(\d+)\b/);
                if (stockMatch) {
                    quantity = parseInt(stockMatch[1], 10);
                }

                // Extract price
                let price = 0;
                const priceInput = priceCell.querySelector('input[name^="cost_"]');
                if (priceInput) {
                    price = parseInt(priceInput.value) || 0;
                }

                console.log(`Found shop item: ${name} x${quantity} @ ${price} NP`);

                items.push({
                    name: name,
                    quantity: quantity,
                    price: price,
                    imageUrl: imageUrl,
                    source: 'shop'
                });
            });

            return items;
        }

        async fetchFromSDB(progressCallback) {
            console.log('Fetching from SDB...');

            return new Promise(async (resolve, reject) => {
                try {
                    const allItems = [];
                    let currentPage = 0;
                    let hasMorePages = true;

                    while (hasMorePages) {
                        console.log(`Fetching SDB page ${currentPage + 1}...`);

                        if (progressCallback) {
                            progressCallback(currentPage + 1, '?', `Fetching page ${currentPage + 1}...`);
                        }

                        const url = currentPage === 0
                            ? 'https://www.neopets.com/safetydeposit.phtml'
                            : `https://www.neopets.com/safetydeposit.phtml?offset=${currentPage * 30}`;

                        const pageItems = await this.fetchSDBPage(url);

                        if (pageItems.length > 0) {
                            allItems.push(...pageItems);
                            console.log(`Page ${currentPage + 1}: Found ${pageItems.length} items (Total: ${allItems.length})`);
                            currentPage++;

                            // Add a small delay between pages
                            await new Promise(resolve => setTimeout(resolve, 500));
                        } else {
                            hasMorePages = false;
                        }

                        // Safety check - stop after 200 pages (SDB can be huge!)
                        if (currentPage >= 200) {
                            console.warn('Reached maximum page limit (200 pages)');
                            hasMorePages = false;
                        }
                    }

                    console.log(`SDB fetch complete: ${allItems.length} total items from ${currentPage} pages`);

                    this.inventory.sdb = allItems;
                    this.inventory.lastUpdated.sdb = new Date().toISOString();
                    this.save();

                    resolve(allItems);
                } catch (error) {
                    console.error('Error fetching SDB:', error);
                    reject(error);
                }
            });
        }

        fetchSDBPage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: (response) => {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const items = this.parseSDBPage(doc);
                            resolve(items);
                        } catch (error) {
                            console.error('Error parsing SDB page:', error);
                            reject(error);
                        }
                    },
                    onerror: reject
                });
            });
        }

        parseSDBPage(doc) {
            const items = [];

            console.log(`=== PARSING SDB PAGE ===`);

            // Try multiple ways to find item rows
            let rows = doc.querySelectorAll('form[action*="process_safetydeposit"] table tr[bgcolor]');

            if (rows.length === 0) {
                console.log('No rows found with form selector, trying alternative...');
                rows = doc.querySelectorAll('form[name="boxform"] table tr[bgcolor]');
            }

            if (rows.length === 0) {
                console.log('No rows found with name selector, trying ID...');
                rows = doc.querySelectorAll('form#boxform table tr[bgcolor]');
            }

            if (rows.length === 0) {
                console.log('No rows with form selectors, trying just table rows with bgcolor...');
                // Get all rows with bgcolor and filter out header/footer
                const allRows = doc.querySelectorAll('table tr[bgcolor]');
                console.log(`Found ${allRows.length} total rows with bgcolor`);

                // Filter to only rows that have item images
                rows = Array.from(allRows).filter(row => {
                    return row.querySelector('img[src*="items/"]') !== null;
                });
            }

            console.log(`Found ${rows.length} item rows in SDB page`);

            if (rows.length === 0) {
                console.error('Could not find any item rows in SDB!');
                console.log('Page structure:');
                console.log(doc.body.innerHTML.substring(0, 500));
                return items;
            }

            rows.forEach((row, rowIndex) => {
                const cells = row.querySelectorAll('td');

                if (rowIndex === 0) {
                    console.log(`First row has ${cells.length} cells - analyzing structure...`);
                    cells.forEach((cell, i) => {
                        console.log(`  Cell ${i}: ${cell.textContent.trim().substring(0, 50)}`);
                    });
                }

                if (cells.length < 5) {
                    console.log(`Row ${rowIndex}: Skipping - only ${cells.length} cells`);
                    return;
                }

                // Cell structure can vary:
                // WITHOUT price column: Image | Name | Description | Type | Qty | Remove
                // WITH price column: Image | Name | Description | Type | Price | Qty | Remove

                const imgCell = cells[0];
                const nameCell = cells[1];

                const img = imgCell.querySelector('img');
                const nameEl = nameCell.querySelector('b');

                if (!img || !nameEl) {
                    if (rowIndex < 3) {
                        console.log(`Row ${rowIndex}: Skipping - no image or name element`);
                    }
                    return;
                }

                // Extract ONLY the item name, excluding any rarity text
                // The HTML structure is: <b>Item Name<br><span class="medText"><b><font color='green'>(uncommon)</font></b><br></span></b>
                // We want only the text directly in the <b> element before any <br> or <span>
                let name = '';

                // Get all child nodes of the <b> element
                const childNodes = nameEl.childNodes;
                for (let node of childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // This is a text node - add it to the name
                        name += node.textContent;
                    } else if (node.nodeName === 'BR') {
                        // Stop at the first <br> - everything after is rarity info
                        break;
                    }
                }

                name = name.trim();

                const imageUrl = img.src;

                // Try to find the quantity cell
                // Look for the cell with just numeric content
                let quantity = 1;
                let qtyFound = false;

                // Search through cells for quantity (usually cell 4 or 5)
                for (let i = 4; i < cells.length && i < 7; i++) {
                    const cellText = cells[i].textContent.trim();

                    // Check if this looks like a quantity (just a number)
                    if (/^\d+$/.test(cellText)) {
                        quantity = parseInt(cellText, 10);
                        qtyFound = true;
                        if (rowIndex < 3) {
                            console.log(`Row ${rowIndex}: Found qty ${quantity} in cell ${i}`);
                        }
                        break;
                    }
                }

                if (!qtyFound && rowIndex < 3) {
                    console.log(`Row ${rowIndex}: No quantity found, defaulting to 1`);
                }

                if (rowIndex < 3) {
                    console.log(`Row ${rowIndex}: Extracted name: "${name}"`);
                }

                items.push({
                    name: name,
                    quantity: quantity,
                    imageUrl: imageUrl,
                    source: 'sdb'
                });
            });

            console.log(`=== TOTAL ITEMS PARSED: ${items.length} ===`);
            return items;
        }

        clearAllData() {
            console.log('Clearing all cached data...');
            this.inventory = {
                gallery: [],
                inventory: [],
                shop: [],
                sdb: [],
                lastUpdated: {
                    gallery: null,
                    inventory: null,
                    shop: null,
                    sdb: null
                }
            };
            this.priceCache = {};
            this.save();
            console.log('All data cleared!');
        }

        getAllItems() {
            const allItems = {};

            ['gallery', 'shop', 'inventory', 'sdb'].forEach(source => {
                this.inventory[source].forEach(item => {
                    const key = item.name;
                    if (!allItems[key]) {
                        allItems[key] = {
                            name: item.name,
                            imageUrl: item.imageUrl,
                            sources: {},
                            totalQuantity: 0
                        };
                    }
                    allItems[key].sources[source] = item.quantity;
                    allItems[key].totalQuantity += item.quantity;
                });
            });

            return Object.values(allItems);
        }

        async fetchItemPrice(itemName, forceUpdate = false) {
            // Check cache
            const cached = this.priceCache[itemName];
            if (!forceUpdate && cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION) {
                console.log(`Using cached price for ${itemName}`);
                return cached.data;
            }

            console.log(`Fetching fresh price for ${itemName} from ItemDB API...`);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: CONFIG.ITEMDB_API + encodeURIComponent(itemName),
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);

                            const priceData = {
                                item_id: data.item_id,
                                price: data.price?.value || 0,
                                rarity: data.rarity,
                                category: data.category,
                                last_updated: data.price?.addedAt,
                                timestamp: Date.now()
                            };

                            this.priceCache[itemName] = {
                                data: priceData,
                                timestamp: Date.now()
                            };
                            this.save();

                            console.log(`Successfully fetched price for ${itemName}: ${priceData.price} NP`);
                            resolve(priceData);
                        } catch (error) {
                            console.error('Error parsing ItemDB response:', error);
                            reject(error);
                        }
                    },
                    onerror: reject
                });
            });
        }

        async updateAllPrices(forceUpdate = false, progressCallback) {
            const allItems = this.getAllItems();
            const results = [];

            // Get list of items that need prices
            let itemsToFetch = [];
            let cachedItems = [];

            for (let item of allItems) {
                const cached = this.priceCache[item.name];
                const isCached = cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_DURATION;

                if (!forceUpdate && isCached) {
                    // Use cached data
                    cachedItems.push({
                        ...item,
                        ...cached.data,
                        updated: false
                    });
                } else {
                    itemsToFetch.push(item);
                }
            }

            console.log(`Items to fetch: ${itemsToFetch.length}, Cached: ${cachedItems.length}`);

            if (itemsToFetch.length === 0) {
                console.log('All items already cached!');
                if (progressCallback) {
                    progressCallback(allItems.length, allItems.length, 'All cached', true);
                }
                return [...cachedItems];
            }

            // Fetch prices in batches (ItemDB API limit appears to be around 500-1000 items)
            const BATCH_SIZE = 500;
            const batches = [];

            for (let i = 0; i < itemsToFetch.length; i += BATCH_SIZE) {
                batches.push(itemsToFetch.slice(i, i + BATCH_SIZE));
            }

            console.log(`Splitting ${itemsToFetch.length} items into ${batches.length} batches of ${BATCH_SIZE}`);

            try {
                for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                    const batch = batches[batchIndex];
                    const batchNum = batchIndex + 1;

                    console.log(`Fetching batch ${batchNum}/${batches.length} (${batch.length} items)...`);

                    if (progressCallback) {
                        progressCallback(
                            batchIndex * BATCH_SIZE + batch.length,
                            itemsToFetch.length,
                            `Batch ${batchNum}/${batches.length}`,
                            false
                        );
                    }

                    const fetchedData = await this.fetchBulkPrices(batch.map(i => i.name));

                    // Process results for this batch
                    for (let item of batch) {
                        const priceData = fetchedData[item.name];

                        if (priceData) {
                            const processedData = {
                                item_id: priceData.item_id,
                                price: priceData.price?.value || 0,
                                rarity: priceData.rarity,
                                category: priceData.category,
                                status: priceData.status,
                                isNC: priceData.isNC,
                                owls: priceData.owls,
                                last_updated: priceData.price?.addedAt,
                                timestamp: Date.now()
                            };

                            // Cache it
                            this.priceCache[item.name] = {
                                data: processedData,
                                timestamp: Date.now()
                            };

                            results.push({
                                ...item,
                                ...processedData,
                                updated: true
                            });
                        } else {
                            console.warn(`No price data found for ${item.name}`);
                            results.push({
                                ...item,
                                updated: false
                            });
                        }
                    }

                    // Save after each batch
                    this.save();

                    // Small delay between batches to be respectful
                    if (batchIndex < batches.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }

                console.log(`Bulk fetch complete: ${results.length} updated, ${cachedItems.length} cached`);
                return [...results, ...cachedItems];

            } catch (error) {
                console.error('Error in bulk price fetch:', error);
                throw error;
            }
        }

        async fetchBulkPrices(itemNames) {
            console.log(`Fetching bulk prices for ${itemNames.length} items...`);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://itemdb.com.br/api/v1/items/many',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({ name: itemNames }),
                    onload: (response) => {
                        try {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                console.log(`Successfully fetched ${Object.keys(data).length} item prices from ItemDB`);
                                resolve(data);
                            } else {
                                console.error('ItemDB API returned error:', response.status, response.responseText);
                                reject(new Error(`API returned status ${response.status}`));
                            }
                        } catch (error) {
                            console.error('Error parsing ItemDB bulk response:', error);
                            reject(error);
                        }
                    },
                    onerror: (error) => {
                        console.error('Network error fetching bulk prices:', error);
                        reject(error);
                    }
                });
            });
        }
    }

    // UI Creation
    class InventoryUI {
        constructor(manager) {
            this.manager = manager;
            this.isOpen = false;
            this.currentPage = 1;
            this.itemsPerPage = 50;
            this.filteredItems = [];
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'inventory-manager-panel';
            panel.innerHTML = `
                <style>
                    #inventory-manager-panel {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 90%;
                        max-width: 1200px;
                        height: 80vh;
                        background: white;
                        border: 3px solid #4a90e2;
                        border-radius: 10px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                        z-index: 10000;
                        display: none;
                        flex-direction: column;
                    }
                    #inventory-manager-panel.open {
                        display: flex;
                    }
                    .im-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px 20px;
                        border-radius: 7px 7px 0 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .im-header h2 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .im-close {
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        font-size: 24px;
                        cursor: pointer;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .im-close:hover {
                        background: rgba(255,255,255,0.3);
                    }
                    .im-controls {
                        padding: 15px 20px;
                        background: #f5f5f5;
                        border-bottom: 1px solid #ddd;
                        display: flex;
                        gap: 10px;
                        flex-wrap: wrap;
                    }
                    .im-btn {
                        padding: 8px 16px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s;
                    }
                    .im-btn-primary {
                        background: #4a90e2;
                        color: white;
                    }
                    .im-btn-primary:hover {
                        background: #357abd;
                    }
                    .im-btn-success {
                        background: #5cb85c;
                        color: white;
                    }
                    .im-btn-success:hover {
                        background: #449d44;
                    }
                    .im-btn-warning {
                        background: #f0ad4e;
                        color: white;
                    }
                    .im-btn-warning:hover {
                        background: #ec971f;
                    }
                    .im-btn-danger {
                        background: #dc3545;
                        color: white;
                    }
                    .im-btn-danger:hover {
                        background: #c82333;
                    }
                    .im-pagination-controls {
                        padding: 15px 20px;
                        background: #f8f9fa;
                        border-bottom: 1px solid #ddd;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 15px;
                    }
                    .im-per-page {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .im-per-page label {
                        font-weight: 600;
                        color: #333;
                    }
                    .im-select {
                        padding: 6px 12px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background: white;
                        font-size: 14px;
                        cursor: pointer;
                    }
                    .im-select:hover {
                        border-color: #0066cc;
                    }
                    .im-pagination {
                        display: flex;
                        gap: 5px;
                        align-items: center;
                    }
                    .im-page-btn {
                        padding: 6px 12px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background: white;
                        cursor: pointer;
                        font-size: 14px;
                        color: #333;
                        transition: all 0.2s;
                    }
                    .im-page-btn:hover:not(:disabled) {
                        background: #0066cc;
                        color: white;
                        border-color: #0066cc;
                    }
                    .im-page-btn:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                    }
                    .im-page-btn.active {
                        background: #0066cc;
                        color: white;
                        border-color: #0066cc;
                        font-weight: bold;
                    }
                    .im-page-info {
                        font-size: 14px;
                        color: #666;
                        margin: 0 10px;
                    }
                    .im-stats {
                        padding: 10px 20px;
                        background: #e8f4f8;
                        border-bottom: 1px solid #ddd;
                        display: flex;
                        justify-content: space-around;
                        flex-wrap: wrap;
                    }
                    .im-stat {
                        text-align: center;
                        padding: 5px 15px;
                    }
                    .im-stat-value {
                        font-size: 24px;
                        font-weight: bold;
                        color: #4a90e2;
                    }
                    .im-stat-label {
                        font-size: 12px;
                        color: #666;
                    }
                    .im-content {
                        flex: 1;
                        overflow-y: auto;
                        padding: 20px;
                    }
                    .im-table {
                        width: 100%;
                        border-collapse: collapse;
                        background: white;
                    }
                    .im-table th {
                        background: #667eea;
                        color: white;
                        padding: 10px;
                        text-align: left;
                        position: sticky;
                        top: 0;
                        z-index: 10;
                    }
                    .im-table td {
                        padding: 8px;
                        border-bottom: 1px solid #eee;
                    }
                    .im-table tr:hover {
                        background: #f9f9f9;
                    }
                    .im-item-img {
                        width: 40px;
                        height: 40px;
                        object-fit: contain;
                    }
                    .im-source-badge {
                        display: inline-block;
                        padding: 2px 8px;
                        border-radius: 3px;
                        font-size: 11px;
                        margin: 2px;
                        font-weight: bold;
                    }
                    .im-source-gallery { background: #d4edda; color: #155724; }
                    .im-source-shop { background: #fff3cd; color: #856404; }
                    .im-source-inventory { background: #d1ecf1; color: #0c5460; }
                    .im-source-sdb { background: #f8d7da; color: #721c24; }
                    .im-progress {
                        margin: 10px 0;
                        padding: 10px;
                        background: #e8f4f8;
                        border-radius: 5px;
                        display: none;
                    }
                    .im-progress.active {
                        display: block;
                    }
                    .im-progress-bar {
                        width: 100%;
                        height: 20px;
                        background: #ddd;
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .im-progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                        transition: width 0.3s;
                    }
                    .im-filter {
                        padding: 8px 12px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        width: 200px;
                    }
                </style>

                <div class="im-header">
                    <h2>🎒 Inventory Manager</h2>
                    <button class="im-close" id="im-close-btn">×</button>
                </div>

                <div class="im-controls">
                    <button class="im-btn im-btn-primary" id="im-fetch-gallery">Fetch Gallery</button>
                    <button class="im-btn im-btn-primary" id="im-fetch-inventory">Fetch Inventory</button>
                    <button class="im-btn im-btn-primary" id="im-fetch-shop">Fetch Shop</button>
                    <button class="im-btn im-btn-primary" id="im-fetch-sdb">Fetch SDB</button>
                    <button class="im-btn im-btn-success" id="im-fetch-all">Fetch All</button>
                    <button class="im-btn im-btn-warning" id="im-update-prices">Update Prices (New Only)</button>
                    <button class="im-btn im-btn-warning" id="im-force-update-prices">Force Update All Prices</button>
                    <button class="im-btn im-btn-danger" id="im-clear-cache">Clear All Cache</button>
                    <input type="text" class="im-filter" id="im-filter-input" placeholder="Filter items...">
                </div>

                <div class="im-pagination-controls">
                    <div class="im-per-page">
                        <label for="im-per-page-select">Items per page:</label>
                        <select id="im-per-page-select" class="im-select">
                            <option value="25">25</option>
                            <option value="50" selected>50</option>
                            <option value="100">100</option>
                            <option value="250">250</option>
                            <option value="500">500</option>
                            <option value="all">Show All</option>
                        </select>
                    </div>
                    <div class="im-pagination" id="im-pagination">
                        <!-- Pagination buttons will be inserted here -->
                    </div>
                </div>

                <div class="im-progress" id="im-progress">
                    <div id="im-progress-text">Processing...</div>
                    <div class="im-progress-bar">
                        <div class="im-progress-fill" id="im-progress-fill" style="width: 0%"></div>
                    </div>
                </div>

                <div class="im-stats">
                    <div class="im-stat">
                        <div class="im-stat-value" id="im-stat-total">0</div>
                        <div class="im-stat-label">Total Items</div>
                    </div>
                    <div class="im-stat">
                        <div class="im-stat-value" id="im-stat-unique">0</div>
                        <div class="im-stat-label">Unique Items</div>
                    </div>
                    <div class="im-stat">
                        <div class="im-stat-value" id="im-stat-value">0 NP</div>
                        <div class="im-stat-label">Total Value</div>
                    </div>
                </div>

                <div class="im-content">
                    <table class="im-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Item Name</th>
                                <th>Total Qty</th>
                                <th>Sources</th>
                                <th>Price</th>
                                <th>Value</th>
                                <th>Rarity</th>
                            </tr>
                        </thead>
                        <tbody id="im-table-body">
                            <tr><td colspan="7" style="text-align: center; padding: 40px;">No data loaded. Click "Fetch All" to begin.</td></tr>
                        </tbody>
                    </table>
                </div>
            `;

            document.body.appendChild(panel);
            this.attachEventListeners();
        }

        attachEventListeners() {
            document.getElementById('im-close-btn').addEventListener('click', () => this.close());
            document.getElementById('im-fetch-gallery').addEventListener('click', () => this.fetchSource('gallery'));
            document.getElementById('im-fetch-inventory').addEventListener('click', () => this.fetchSource('inventory'));
            document.getElementById('im-fetch-shop').addEventListener('click', () => this.fetchSource('shop'));
            document.getElementById('im-fetch-sdb').addEventListener('click', () => this.fetchSource('sdb'));
            document.getElementById('im-fetch-all').addEventListener('click', () => this.fetchAll());
            document.getElementById('im-update-prices').addEventListener('click', () => this.updatePrices(false));
            document.getElementById('im-force-update-prices').addEventListener('click', () => this.updatePrices(true));
            document.getElementById('im-clear-cache').addEventListener('click', () => this.clearCache());
            document.getElementById('im-filter-input').addEventListener('input', (e) => this.filterItems(e.target.value));
            document.getElementById('im-per-page-select').addEventListener('change', (e) => this.changeItemsPerPage(e.target.value));
        }

        async fetchSource(source) {
            this.showProgress(true, `Fetching from ${source}...`);

            try {
                let items = [];

                const progressCallback = (current, total, message) => {
                    document.getElementById('im-progress-text').textContent =
                        `Fetching from ${source}... Page ${current} (${message})`;
                };

                switch(source) {
                    case 'gallery':
                        console.log('Starting gallery fetch...');
                        items = await this.manager.fetchFromGallery();
                        console.log(`Gallery fetch complete: ${items.length} items`);
                        break;
                    case 'inventory':
                        console.log('Starting inventory fetch...');
                        items = await this.manager.fetchFromInventory();
                        console.log(`Inventory fetch complete: ${items.length} items`);
                        break;
                    case 'shop':
                        console.log('Starting shop fetch...');
                        items = await this.manager.fetchFromShop(progressCallback);
                        console.log(`Shop fetch complete: ${items.length} items`);
                        break;
                    case 'sdb':
                        console.log('Starting SDB fetch...');
                        items = await this.manager.fetchFromSDB(progressCallback);
                        console.log(`SDB fetch complete: ${items.length} items`);
                        break;
                }

                this.refreshDisplay();

                if (items.length === 0) {
                    alert(`Fetched from ${source}, but found 0 items. This might mean:\n\n1. The ${source} is empty\n2. You need to navigate to the ${source} page first\n3. The page structure has changed\n\nCheck the browser console (F12) for more details.`);
                } else {
                    alert(`Successfully fetched ${items.length} items from ${source}!`);
                }
            } catch (error) {
                console.error(`Error fetching ${source}:`, error);
                alert(`Error fetching from ${source}. Check console (F12) for details.\n\nError: ${error.message || error}`);
            } finally {
                this.showProgress(false);
            }
        }

        async fetchAll() {
            this.showProgress(true, 'Fetching all sources...');

            try {
                const progressCallback = (current, total, message) => {
                    document.getElementById('im-progress-text').textContent = message;
                };

                document.getElementById('im-progress-text').textContent = 'Fetching Gallery...';
                await this.manager.fetchFromGallery();
                this.updateProgressBar(25);

                document.getElementById('im-progress-text').textContent = 'Fetching Inventory...';
                await this.manager.fetchFromInventory();
                this.updateProgressBar(50);

                document.getElementById('im-progress-text').textContent = 'Fetching Shop...';
                await this.manager.fetchFromShop(progressCallback);
                this.updateProgressBar(75);

                document.getElementById('im-progress-text').textContent = 'Fetching SDB...';
                await this.manager.fetchFromSDB(progressCallback);
                this.updateProgressBar(100);

                this.refreshDisplay();
                alert('Successfully fetched all sources!');
            } catch (error) {
                console.error('Error fetching all:', error);
                alert('Error fetching all sources. Check console for details.');
            } finally {
                this.showProgress(false);
            }
        }

        async updatePrices(forceUpdate = false) {
            const buttonText = forceUpdate ? 'Force updating all prices' : 'Updating new prices only';
            this.showProgress(true, `${buttonText} from ItemDB...`);

            try {
                const items = await this.manager.updateAllPrices(forceUpdate, (current, total, itemName, skipped) => {
                    const percent = (current / total) * 100;
                    this.updateProgressBar(percent);
                    const skipText = skipped ? ' (skipped - already cached)' : '';
                    document.getElementById('im-progress-text').textContent =
                        `${buttonText}... ${current}/${total} (${itemName})${skipText}`;
                });

                this.refreshDisplay();

                const updatedCount = items.filter(item => item.updated).length;
                const skippedCount = items.length - updatedCount;

                let message = `Price update complete!\n\n`;
                message += `Updated: ${updatedCount} items\n`;
                if (!forceUpdate && skippedCount > 0) {
                    message += `Skipped: ${skippedCount} items (already cached)\n\n`;
                    message += `Use "Force Update All Prices" to refresh all cached prices.`;
                }

                alert(message);
            } catch (error) {
                console.error('Error updating prices:', error);
                alert('Error updating prices. Check console for details.');
            } finally {
                this.showProgress(false);
            }
        }

        refreshDisplay() {
            const allItems = this.manager.getAllItems();
            this.filteredItems = allItems; // Store all items for pagination
            this.currentPage = 1; // Reset to page 1
            this.renderTable();
        }

        renderTable() {
            const tbody = document.getElementById('im-table-body');

            if (this.filteredItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No items found. Fetch from sources first.</td></tr>';
                this.renderPagination();
                return;
            }

            // Get prices from cache
            const itemsWithPrices = this.filteredItems.map(item => {
                const cached = this.manager.priceCache[item.name];
                const priceData = cached?.data || {};

                // Handle different price scenarios
                let displayPrice = 0;
                let priceDisplay = '???';

                if (priceData.status === 'no trade') {
                    priceDisplay = '<span style="color: #cc0000;">No Trade</span>';
                } else if (priceData.isNC && !priceData.owls) {
                    priceDisplay = '<span style="color: #0066cc;">NC</span>';
                } else if (priceData.isNC && priceData.owls) {
                    priceDisplay = `<span style="color: #0066cc;">${priceData.owls.value || 'NC'}</span>`;
                } else if (priceData.price) {
                    displayPrice = priceData.price;
                    priceDisplay = displayPrice.toLocaleString() + ' NP';
                }

                const totalValue = displayPrice * item.totalQuantity;

                return {
                    ...item,
                    price: displayPrice,
                    priceDisplay: priceDisplay,
                    rarity: priceData.rarity || '?',
                    status: priceData.status,
                    isNC: priceData.isNC,
                    totalValue: totalValue
                };
            });

            // Sort by total value descending
            itemsWithPrices.sort((a, b) => b.totalValue - a.totalValue);

            // Calculate pagination
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = this.itemsPerPage === 'all' ? itemsWithPrices.length : startIndex + parseInt(this.itemsPerPage);
            const itemsToShow = itemsWithPrices.slice(startIndex, endIndex);

            tbody.innerHTML = itemsToShow.map(item => `
                <tr>
                    <td><img src="${item.imageUrl}" class="im-item-img" alt="${item.name}"></td>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.totalQuantity.toLocaleString()}</td>
                    <td>
                        ${Object.entries(item.sources).map(([source, qty]) =>
                            `<span class="im-source-badge im-source-${source}">${source}: ${qty}</span>`
                        ).join('')}
                    </td>
                    <td>${item.priceDisplay}</td>
                    <td><strong>${item.totalValue > 0 ? item.totalValue.toLocaleString() + ' NP' : '-'}</strong></td>
                    <td>r${item.rarity}</td>
                </tr>
            `).join('');

            this.updateStats(itemsWithPrices);
            this.renderPagination();
        }

        renderPagination() {
            const paginationDiv = document.getElementById('im-pagination');

            if (this.itemsPerPage === 'all' || this.filteredItems.length === 0) {
                paginationDiv.innerHTML = '';
                return;
            }

            const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);

            if (totalPages <= 1) {
                paginationDiv.innerHTML = '';
                return;
            }

            let html = '';

            // Previous button
            html += `<button class="im-page-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}">« Prev</button>`;

            // Page numbers
            const maxButtons = 7;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
            let endPage = Math.min(totalPages, startPage + maxButtons - 1);

            if (endPage - startPage < maxButtons - 1) {
                startPage = Math.max(1, endPage - maxButtons + 1);
            }

            if (startPage > 1) {
                html += `<button class="im-page-btn" data-page="1">1</button>`;
                if (startPage > 2) {
                    html += `<span class="im-page-info">...</span>`;
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                html += `<button class="im-page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    html += `<span class="im-page-info">...</span>`;
                }
                html += `<button class="im-page-btn" data-page="${totalPages}">${totalPages}</button>`;
            }

            // Next button
            html += `<button class="im-page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}">Next »</button>`;

            // Page info
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredItems.length);
            html += `<span class="im-page-info">Showing ${startItem}-${endItem} of ${this.filteredItems.length}</span>`;

            paginationDiv.innerHTML = html;

            // Attach click events to pagination buttons
            paginationDiv.querySelectorAll('.im-page-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const page = parseInt(e.target.dataset.page);
                    if (page && page !== this.currentPage) {
                        this.goToPage(page);
                    }
                });
            });
        }

        goToPage(page) {
            this.currentPage = page;
            this.renderTable();
            // Scroll to top of table
            document.getElementById('im-table-body').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        changeItemsPerPage(value) {
            this.itemsPerPage = value === 'all' ? 'all' : parseInt(value);
            this.currentPage = 1; // Reset to first page
            this.renderTable();
        }

        updateStats(items) {
            const totalItems = items.reduce((sum, item) => sum + item.totalQuantity, 0);
            const uniqueItems = items.length;
            const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);

            document.getElementById('im-stat-total').textContent = totalItems.toLocaleString();
            document.getElementById('im-stat-unique').textContent = uniqueItems.toLocaleString();
            document.getElementById('im-stat-value').textContent = totalValue.toLocaleString() + ' NP';
        }

        clearCache() {
            if (!confirm('Are you sure you want to clear ALL cached data?\n\nThis will:\n• Clear all item data (Gallery, Inventory, Shop, SDB)\n• Clear all cached prices\n• You will need to re-fetch everything\n\nThis action cannot be undone!')) {
                return;
            }

            try {
                this.manager.clearAllData();
                this.refreshDisplay();
                alert('All cached data has been cleared!\n\nYou can now re-fetch your items with clean data.');
            } catch (error) {
                console.error('Error clearing cache:', error);
                alert('Error clearing cache. Check console for details.');
            }
        }

        filterItems(query) {
            const allItems = this.manager.getAllItems();
            const lowerQuery = query.toLowerCase();

            if (!query.trim()) {
                this.filteredItems = allItems;
            } else {
                this.filteredItems = allItems.filter(item =>
                    item.name.toLowerCase().includes(lowerQuery)
                );
            }

            this.currentPage = 1; // Reset to first page when filtering
            this.renderTable();
        }

        showProgress(show, text = '') {
            const progress = document.getElementById('im-progress');
            if (show) {
                progress.classList.add('active');
                document.getElementById('im-progress-text').textContent = text;
                this.updateProgressBar(0);
            } else {
                progress.classList.remove('active');
            }
        }

        updateProgressBar(percent) {
            document.getElementById('im-progress-fill').style.width = percent + '%';
        }

        open() {
            document.getElementById('inventory-manager-panel').classList.add('open');
            this.isOpen = true;
            this.refreshDisplay();
        }

        close() {
            document.getElementById('inventory-manager-panel').classList.remove('open');
            this.isOpen = false;
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }
    }

    // Create floating button
    function createFloatingButton(ui) {
        const button = document.createElement('button');
        button.id = 'inventory-manager-float-btn';
        button.innerHTML = '🎒';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            transition: transform 0.3s;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', () => ui.toggle());

        document.body.appendChild(button);
    }

    // Initialize
    function init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        const manager = new InventoryManager();
        const ui = new InventoryUI(manager);

        // Check if we're on the stamps dashboard page
        const isDashboardPage = window.location.href.includes('/stamps.phtml?type=dashboard');

        if (isDashboardPage) {
            // Replace the entire content area with our panel
            replacePageContent(ui);
        } else {
            // Normal mode - create floating button
            ui.createPanel();
            createFloatingButton(ui);
        }

        // Auto-fetch if on gallery page
        if (window.location.href.includes('/gallery/')) {
            setTimeout(() => {
                manager.fetchFromGallery().then(() => {
                    console.log('Auto-fetched gallery items');
                });
            }, 1000);
        }

        console.log('Neopets Inventory Manager loaded! Click the 🎒 button to open.');
    }

    // Replace page content for dashboard mode
    function replacePageContent(ui) {
        // Find the main content area
        const contentArea = document.querySelector('td.content');

        if (contentArea) {
            // Clear existing content
            contentArea.innerHTML = '';

            // Create container for our dashboard
            const dashboardContainer = document.createElement('div');
            dashboardContainer.id = 'inventory-dashboard-container';
            dashboardContainer.innerHTML = `
                <style>
                    #inventory-dashboard-container {
                        width: 100%;
                        min-height: 600px;
                        padding: 20px;
                    }
                    #inventory-manager-panel.dashboard-mode {
                        position: relative !important;
                        top: auto !important;
                        left: auto !important;
                        transform: none !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        height: auto !important;
                        min-height: 700px;
                        display: flex !important;
                        border: none;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    #inventory-manager-panel.dashboard-mode .im-header {
                        border-radius: 10px 10px 0 0;
                    }
                    #inventory-manager-panel.dashboard-mode .im-close {
                        display: none;
                    }
                    #inventory-manager-panel.dashboard-mode .im-content {
                        max-height: none;
                    }
                </style>
            `;

            contentArea.appendChild(dashboardContainer);

            // Create the panel
            ui.createPanel();

            // Add dashboard-mode class and make it visible
            const panel = document.getElementById('inventory-manager-panel');
            panel.classList.add('dashboard-mode');
            panel.classList.add('open');

            // Move panel into our container
            dashboardContainer.appendChild(panel);

            // Load data immediately
            ui.refreshDisplay();

            console.log('Dashboard mode activated - Inventory Manager is now the main page content');
        }
    }

    init();
})();