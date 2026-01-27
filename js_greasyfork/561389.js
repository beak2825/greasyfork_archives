// ==UserScript==
// @name         Asylum Script
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Helper script for Asylum members
// @author       You
// @match        https://www.torn.com/properties.php?step=rentalmarket*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/561389/Asylum%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/561389/Asylum%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS_KEY_API_KEY = 'asylum_api_key';
    const SETTINGS_KEY_SERVER_URL = 'asylum_server_url';
    const DEFAULT_SERVER_URL = 'https://asylum.badfor.biz/api/external/property';

    // Styles for the button and settings
    const styles = `
        .asylum-btn {
            background-color: #6a00ff;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 5px;
            font-weight: bold;
        }
        .asylum-btn:hover {
            background-color: #5500cc;
        }
        .mugbot-btn {
            color: red;
            font-weight: bold;
            border: 1px solid red;
            border-radius: 3px;
            margin-right: 8px;
            cursor: pointer;
            font-size: 10px;
            background: transparent;
        }
        .mugbot-btn:hover {
            background: #ffe6e6;
        }
        .asylum-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .asylum-control-panel {
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999999;
            background-color: #333;
            color: #fff;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #666;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            gap: 5px;
            align-items: center;
        }
        .asylum-status {
            margin-right: 5px;
            font-weight: bold;
        }
        .asylum-status.active {
            color: #00ff00;
        }
        /* Settings Modal */
        #asylum-settings-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 10000;
            width: 300px;
            color: black;
        }
        #asylum-settings-modal input {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            box-sizing: border-box;
            border: 1px solid #ccc;
        }
        #asylum-settings-modal label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        #asylum-settings-modal .actions {
            text-align: right;
        }
        #asylum-settings-modal button {
            padding: 5px 10px;
            cursor: pointer;
        }
        /* Toast Notification */
        #asylum-toast {
            visibility: hidden;
            min-width: 250px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 2px;
            padding: 16px;
            position: fixed;
            z-index: 1;
            left: 50%;
            bottom: 30px;
            transform: translateX(-50%);
            font-size: 14px;
        }
        #asylum-toast.show {
            visibility: visible;
            -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
            animation: fadein 0.5s, fadeout 0.5s 2.5s;
        }
        @-webkit-keyframes fadein {
            from {bottom: 0; opacity: 0;} 
            to {bottom: 30px; opacity: 1;}
        }
        @keyframes fadein {
            from {bottom: 0; opacity: 0;}
            to {bottom: 30px; opacity: 1;}
        }
        @-webkit-keyframes fadeout {
            from {bottom: 30px; opacity: 1;} 
            to {bottom: 0; opacity: 0;}
        }
        @keyframes fadeout {
            from {bottom: 30px; opacity: 1;}
            to {bottom: 0; opacity: 0;}
        }
    `;

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- Toast UI ---
    function showToast(message) {
        let toast = document.getElementById("asylum-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "asylum-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = "show";
        setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
    }

    // --- Settings UI ---
    function createSettingsUI() {
        // Remove existing elements
        const existingBtn = document.getElementById('asylum-settings-btn');
        if (existingBtn) existingBtn.remove();
        const existingModal = document.getElementById('asylum-settings-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'asylum-settings-modal';
        modal.innerHTML = `
            <h3>Asylum Watcher Settings</h3>
            <label for="asylum-api-key">API Key</label>
            <input type="text" id="asylum-api-key" placeholder="Enter your API Key">
            <label for="asylum-server-url">Server URL</label>
            <input type="text" id="asylum-server-url" placeholder="https://asylum.badfor.biz/api/external/property">
            <div class="actions">
                <button id="asylum-save-btn">Save</button>
                <button id="asylum-close-btn">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        // Load values
        const apiKeyInput = document.getElementById('asylum-api-key');
        const serverUrlInput = document.getElementById('asylum-server-url');

        // Function to open settings
        window.openAsylumSettings = () => {
            apiKeyInput.value = GM_getValue(SETTINGS_KEY_API_KEY, '');
            serverUrlInput.value = GM_getValue(SETTINGS_KEY_SERVER_URL, DEFAULT_SERVER_URL);
            modal.style.display = 'block';
        };

        document.getElementById('asylum-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('asylum-save-btn').addEventListener('click', () => {
            GM_setValue(SETTINGS_KEY_API_KEY, apiKeyInput.value.trim());
            GM_setValue(SETTINGS_KEY_SERVER_URL, serverUrlInput.value.trim());
            modal.style.display = 'none';
            alert('Settings saved!');
        });
    }

    function injectControlPanel() {
        if (document.getElementById('asylum-control-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'asylum-control-panel';
        panel.className = 'asylum-control-panel';

        // Settings Button
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'asylum-btn';
        settingsBtn.textContent = 'Settings';
        settingsBtn.addEventListener('click', window.openAsylumSettings);
        
        panel.appendChild(settingsBtn);

        document.body.appendChild(panel);
    }

    // --- Logic ---

    function getApiKey() {
        return GM_getValue(SETTINGS_KEY_API_KEY, '');
    }

    function getServerUrl() {
        let url = GM_getValue(SETTINGS_KEY_SERVER_URL, DEFAULT_SERVER_URL);
        // Remove trailing slash if present
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        // Force HTTPS
        if (url.startsWith('http://asylum.badfor.biz')) {
            url = url.replace('http://', 'https://');
        }
        return url;
    }


    function extractPropertyData(liElement) {
        try {
            //console.log('[Asylum Debug] Extracting from element:', liElement);

            // Owner ID
            // In XML: <div class="hidden-name left"><span class="title bold black">Owner: </span><a href="/profiles.php?XID=1187574" ...>
            let playerId = null;
            const userLink = liElement.querySelector('.hidden-name a'); 
            
            if (userLink) {
                // Try from href: /profiles.php?XID=1187574
                const href = userLink.getAttribute('href');
                if (href) {
                    const match = href.match(/XID=(\d+)/);
                    if (match) playerId = match[1];
                }
            }
            
            // Fallback to older selector just in case
            if (!playerId) {
                 const oldUserLink = liElement.querySelector('.userinfo a.user.name');
                 if (oldUserLink) {
                    const href = oldUserLink.getAttribute('href');
                    if (href) {
                        const match = href.match(/XID=(\d+)/);
                        if (match) playerId = match[1];
                    }
                 }
            }

            if (!playerId) {
                console.warn('[Asylum Debug] Could not find Player ID');
                return null;
            }

            // Cost
            // In XML: <div class="cost left t-overflow"> ... $25,990,000 </div>
            const costEl = liElement.querySelector('.cost');
            if (!costEl) {
                console.warn('[Asylum Debug] Could not find Cost element');
                return null;
            }
            // The text content has newlines and "Cost:", so clean it up
            let totalRent = costEl.textContent.replace(/[^\d]/g, '');

            // Days
            // In XML: <div class="rental-period left"> ... 30 </div>
            const periodEl = liElement.querySelector('.rental-period');
            if (!periodEl) {
                console.warn('[Asylum Debug] Could not find Period element');
                return null;
            }
            let days = periodEl.textContent.replace(/[^\d]/g, '');

            const result = {
                player_id: parseInt(playerId, 10),
                days: parseInt(days, 10),
                total_rent: parseInt(totalRent, 10)
            };
            // console.log('[Asylum Debug] Extracted:', result);
            return result;
        } catch (e) {
            console.error('[Asylum Debug] Error extracting property data', e);
            return null;
        }
    }

    // Debounce helper
    let lastScrapeTime = 0;
    let lastScrapedDataSignature = ''; // Store signature of last sent data
    let watchedItemsCache = []; // Cache for watched items
    let lastWatchedFetchTime = 0;

    // --- Watched Items Logic ---

    function fetchWatchedItems(callback) {
        const apiKey = getApiKey();
        if (!apiKey) return;

        // Throttle fetches (e.g., once every 30 seconds or only on page load/action)
        const now = Date.now();
        if (now - lastWatchedFetchTime < 30000 && watchedItemsCache.length > 0) {
            if (callback) callback(watchedItemsCache);
            return;
        }

        let url = getServerUrl();
        // Construct endpoint based on server URL convention
        if (url.endsWith('/property')) {
            url = url.replace('/property', '/watched-items');
        } else if (url.endsWith('/item')) {
            url = url.replace('/item', '/watched-items');
        } else {
             // Fallback logic if URL is just the base
             // Assuming default structure
             url = url.replace(/\/external\/.*$/, '/external/watched-items');
        }
        
        // If replacement failed to produce a valid-looking endpoint, append manually
        if (!url.includes('watched-items')) {
             if (url.endsWith('/')) url += 'watched-items';
             else url += '/watched-items';
        }

        // Using GET with query params as per python sample
        // Ensure proper separator if URL already has query params
        const separator = url.includes('?') ? '&' : '?';
        const fullUrl = `${url}${separator}apiKey=${encodeURIComponent(apiKey)}`;

        console.log(`[Asylum] Fetching watched items from: ${fullUrl}`);

        GM_xmlhttpRequest({
            method: "GET",
            url: fullUrl,
            headers: {
                // Some servers might expect it here too/instead
                'Authorization': apiKey,
                'X-Api-Key': apiKey
            },
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.success && data.listings) {
                        watchedItemsCache = data.listings;
                        lastWatchedFetchTime = Date.now();
                        console.log(`[Asylum] Fetched ${watchedItemsCache.length} watched items.`);
                        if (callback) callback(watchedItemsCache);
                    } else {
                        console.error('[Asylum] Failed to fetch watched items:', data.error);
                    }
                } catch (e) {
                    console.error('[Asylum] Error parsing watched items response', e);
                }
            },
            onerror: function(err) {
                console.error('[Asylum] Network error fetching watched items', err);
            }
        });
    }

    function isItemWatched(sellerId, itemId, price, quality, armor) {
        return watchedItemsCache.some(watched => {
            // Mandatory checks: Seller, Type, Price
            if (parseInt(watched.seller_id) !== parseInt(sellerId)) return false;
            if (parseInt(watched.item_type) !== parseInt(itemId)) return false;
            if (parseInt(watched.price) !== parseInt(price)) return false;
            
            // Optional checks: Quality/Armor
            
            // If quality is provided on screen, check against watched item
            if (quality && watched.quality) {
                 if (Math.abs(parseFloat(quality) - parseFloat(watched.quality)) > 0.01) return false;
            }
            
            // Strict Armor Check requested:
            // "if the server has null, that item shouldn't be highlighted" (if we are looking at an item with armor?)
            // Interpretation: 
            // 1. If screen item has armor, and watched item has NO armor (null), then return FALSE?
            //    (Meaning a "generic" watch shouldn't match a specific armor item?)
            //    OR
            // 2. If screen item has armor, it must match watched armor.
            
            // Let's implement: If both have armor, must match. 
            // If watched has armor but screen doesn't, fail? (Screen usually has armor for armor items).
            // If screen has armor but watched is null -> User says "shouldn't be highlighted".
            
            if (armor) {
                // If the item on screen has an armor value...
                if (!watched.armor) {
                    // ...and the watched item has NO armor value (null/undefined),
                    // then we do NOT consider it a match (as per request).
                    return false;
                }
                // If both have it, check value
                if (Math.abs(parseFloat(armor) - parseFloat(watched.armor)) > 0.01) return false;
            }
            
            return true;
        });
    }

    function isPiRentalScreen() {
        const hasRentalStep = window.location.search.includes('step=rentalmarket');
        const hasPiProperty = window.location.hash.includes('property=13');
        return hasRentalStep && hasPiProperty;
    }

    function checkAndScrape() {
        if (!isPiRentalScreen()) return;
        
        const now = Date.now();
        if (now - lastScrapeTime < 1000) return; // 1 second throttle
        lastScrapeTime = now;

        // Perform extraction first to check if content changed
        const rentLis = document.querySelectorAll('ul.users-list.rental > li');
        const properties = [];
        rentLis.forEach(li => {
             if (li.querySelector('.rent-button')) {
                const data = extractPropertyData(li);
                if (data) properties.push(data);
             }
        });

        if (properties.length === 0) return;

        // Create a simple signature to detect changes
        // Using length + first item ID + last item ID usually suffices for pagination
        const firstId = properties[0].player_id;
        const lastId = properties[properties.length - 1].player_id;
        const signature = `${properties.length}-${firstId}-${lastId}`;

        if (signature === lastScrapedDataSignature) {
            console.log('[Asylum Debug] Content unchanged. Skipping auto-scrape.');
            return;
        }

        console.log(`[Asylum Debug] Content changed (Sig: ${signature}). Triggering auto-scrape.`);
        lastScrapedDataSignature = signature;
        
        // Call send with the pre-extracted properties to avoid re-extraction
        sendBatchData(properties, false);
    }
    
    // Split scrapeAndSend to separate sending logic
    function sendBatchData(properties, shouldClear) {
        const apiKey = getApiKey();
        const url = getServerUrl();
        
        console.log(`Sending POST to: ${url} (Clear: ${shouldClear})`);

        const payload = {
            apiKey: apiKey,
            clear: shouldClear,
            properties: properties
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                 console.log('Response:', response.status, response.responseText);
                 if ((response.status >= 200 && response.status < 300) || response.status === 409) {
                    if (shouldClear) {
                        showToast(`Server cleared & ${properties.length} properties scanned. Please browse pages.`);
                    } else {
                         showToast(`Scanned ${properties.length} properties.`);
                    }
                } else {
                    console.error('Failed to update server: ' + response.statusText + ' (' + response.status + ')');
                    showToast('Error uploading batch.');
                }
            },
            onerror: function(err) {
                console.error('Network error.', err);
                showToast('Network error.');
            }
        });
    }

    function scrapeAndSend(shouldClear) {
         // This function is now mostly for first run
         const rentLis = document.querySelectorAll('ul.users-list.rental > li');
         const properties = [];
         rentLis.forEach(li => {
             if (li.querySelector('.rent-button')) {
                const data = extractPropertyData(li);
                if (data) properties.push(data);
             }
         });
         
         if (properties.length > 0) {
             const firstId = properties[0].player_id;
             const lastId = properties[properties.length - 1].player_id;
             lastScrapedDataSignature = `${properties.length}-${firstId}-${lastId}`;
             
             sendBatchData(properties, shouldClear);
         } else if (shouldClear) {
             // If clearing, we send even if empty
             sendBatchData([], true);
         } else {
            showToast('No properties found to scan.');
         }
    }

    // --- Mugbot Logic ---

    function sendMugbotData(userId, itemId, price, btnElement, stats = {}) {
        const apiKey = getApiKey();
        
        let url = getServerUrl();
        if (url.endsWith('/property')) {
            url = url.replace('/property', '/item');
        }

        const payload = {
            apiKey: apiKey,
            userId: parseInt(userId, 10),
            itemType: parseInt(itemId, 10),
            price: parseInt(price, 10),
            quality: stats.quality || null,
            armor: stats.armor || null,
            damage: stats.damage || null,
            accuracy: stats.accuracy || null
        };
        
        console.log('[Asylum] Sending Payload:', payload);

        // Visual feedback
        btnElement.textContent = '...';
        btnElement.disabled = true;

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(payload),
            onload: function(response) {
                let data = {};
                try {
                    data = JSON.parse(response.responseText);
                } catch(e) {}

                if (response.status >= 200 && response.status < 300 && data.success) {
                    btnElement.textContent = 'Sent!';
                    btnElement.style.color = 'green';
                    btnElement.style.borderColor = 'green';
                    console.log(`[Asylum] Success: ${data.message} (UID: ${data.listing_uid})`);
                    
                    // Update local cache to reflect this new watch
                    // (Assuming the server response structure or just adding what we sent)
                    // We can optimistically add it to avoid a refetch
                    watchedItemsCache.push({
                         seller_id: parseInt(userId),
                         item_type: parseInt(itemId),
                         price: parseInt(price),
                         quality: stats.quality || null,
                         armor: stats.armor || null
                    });

                } else {
                    const errorMsg = data.error || response.responseText;
                    console.error('[Asylum] Error:', errorMsg);
                    btnElement.textContent = 'Error';
                    btnElement.style.color = 'orange';
                    btnElement.disabled = false;
                }
            },
            onerror: function(err) {
                console.error('Mugbot Network Error', err);
                btnElement.textContent = 'Fail';
                btnElement.disabled = false;
            }
        });
    }

    function injectMugbotButtons() {
        // Only run if we are on the Defensive page
        if (!window.location.hash.includes('categoryName=Defensive')) return;

        const AUTO_MUGBOT_PRICE = 15000000;

        const scrapeStatsForRow = (rowEl) => {
            const s = {};
            
            // Try finding stats if they exist in this row context
            // For items like weapons/armor, the stats are often in the parent Item Tile, not the seller row
            
            // Strategy: Find the Item Tile associated with this seller list.
            // Structure: 
            // <li (List Item for Item)>
            //   <div class="itemTile... expanded..."> (CONTAINS STATS)
            //   <li class="sellerListWrapper..."> (CONTAINS SELLERS)
            //     <ul...>
            //       <li...>
            //         <div class="sellerRow..."> (OUR ROW)
            
            const sellerListWrapper = rowEl.closest('.sellerListWrapper___PN32N');
            if (sellerListWrapper) {
                // The item tile is a SIBLING of the seller list wrapper, usually preceding it.
                // Sometimes there might be other elements, so we look for the specific class in siblings.
                const parentLi = sellerListWrapper.parentElement;
                if (parentLi) {
                    // Find the itemTile within the parent LI
                    const itemTile = parentLi.querySelector('.itemTile___cbw7w.expanded___xsZfG');
                    
                    if (itemTile) {
                        // Method A: Look for value___cwqHv inside property___SHm8e (General properties)
                        // There might be multiple properties (Accuracy, Damage, Armor).
                        // We need to distinguish them.
                        
                        const props = itemTile.querySelectorAll('.property___SHm8e');
                        props.forEach(p => {
                            const valEl = p.querySelector('.value___cwqHv');
                            const icon = p.querySelector('.icon___ThfN8 svg');
                            
                            if (valEl) {
                                const val = valEl.textContent.trim();
                                
                                // Heuristic: Armor usually uses the shield icon or is the only property for Armor items
                                // But we can also just default to mapping single values or checking page context
                                
                                // If we are on defensive page, primary value is armor.
                                if (window.location.hash.includes('Defensive')) {
                                    if (!s.armor) s.armor = val;
                                }
                                // If weapon, primary might be Damage/Accuracy.
                                // For now, let's just grab the first value as Armor if it looks like a number
                                // or try to find a specific distinction if possible.
                                
                                // In your snippet, there is only one property shown: 20.01.
                                // So taking the first valid property value is a safe bet for now.
                                if (!s.armor) s.armor = val;
                            }
                        });
                        
                        // Method B: Direct lookup if Method A failed (fallback)
                        if (!s.armor) {
                            const valEl = itemTile.querySelector('.value___cwqHv');
                            if (valEl) s.armor = valEl.textContent.trim();
                        }
                        
                        if (s.armor) {
                            console.log('[Asylum] Found Armor/Stat via expanded item tile:', s.armor);
                        }
                    } else {
                        console.log('[Asylum] Could not find expanded item tile sibling.');
                    }
                }
            }
            
            return s;
        };

        // --- METHOD 3: Seller Row (Primary Method) ---
        const sellerRows = document.querySelectorAll('.sellerRow___AI0m6');
        sellerRows.forEach(row => {
            if (row.querySelector('.mugbot-btn')) return;

            // User ID - Try profile link
            const profileLink = row.querySelector('a[href*="profiles.php?XID="], a[href*="profiles.php?step="]');
            let userId = null;
            if (profileLink) {
                 const href = profileLink.getAttribute('href');
                 const match = href.match(/XID=(\d+)/) || href.match(/ID=(\d+)/);
                 if (match) userId = match[1];
            }
            if (!userId) return;

            // Price
            const priceEl = row.querySelector('.price___Uwiv2');
            if (!priceEl) return;
            const priceText = priceEl.textContent.trim();
            const price = parseInt(priceText.replace(/[$,]/g, ''), 10);
            if (isNaN(price)) return;

            // Item ID
            let itemId = null;
            // 1. Try URL hash/query
            const hashParams = new URLSearchParams(window.location.hash.replace('#/', '?'));
            // URL format might be #/market/view?itemID=650
            if (hashParams.has('itemID')) {
                itemId = hashParams.get('itemID');
            } else {
                // Check normal query params
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('itemId')) itemId = urlParams.get('itemId');
            }
            
            // 2. Try thumbnail image
            if (!itemId) {
                const img = row.querySelector('img[src*="/images/items/"]');
                if (img) {
                    const src = img.getAttribute('src');
                    const match = src.match(/\/items\/(\d+)\//);
                    if (match) itemId = match[1];
                }
            }
            if (!itemId) return;

            const btn = document.createElement('button');
            btn.className = 'mugbot-btn';
            btn.textContent = 'Mugbot';
            btn.style.marginRight = '8px';
            
            btn.onclick = async (e) => {
               e.preventDefault();
               e.stopPropagation();
               let currentStats = scrapeStatsForRow(row);
               
               sendMugbotData(userId, itemId, price, btn, currentStats);
            };
            
            const isWatched = isItemWatched(userId, itemId, price, null, null);
            if (isWatched) {
               btn.textContent = 'Watched';
               btn.style.color = 'green';
               btn.style.borderColor = 'green';
               btn.disabled = true;
            }

            if (priceEl.parentElement) {
                priceEl.parentElement.insertBefore(btn, priceEl);
            }

            if (!isWatched && price > AUTO_MUGBOT_PRICE && !row.dataset.autoMugbotSent) {
                row.dataset.autoMugbotSent = 'true';
                const currentStats = scrapeStatsForRow(row);
                sendMugbotData(userId, itemId, price, btn, currentStats);
            }
        });
    }


    function init() {
        createSettingsUI();
        
        // Fetch watched items immediately on load
        fetchWatchedItems((items) => {
            // If we are already on the item market, re-run injection to update buttons
            if (window.location.href.includes('ItemMarket')) {
                injectMugbotButtons();
            }
        });
        
        // Retry injection
        let attempts = 0;
        const interval = setInterval(() => {
            injectControlPanel();
            attempts++;
            if (document.getElementById('asylum-control-panel') || attempts > 10) {
                clearInterval(interval);
            }
        }, 500);

        // Observer to ensure panel persists and check for page updates
        const observer = new MutationObserver((mutations) => {
            if (!document.getElementById('asylum-control-panel')) {
                 injectControlPanel();
            }
            
            // Check if we need to auto-scrape new content
            // Fallback: Just try to scrape periodically if ANY substantial change happened,
            // but rely on throttle in checkAndScrape to prevent spam.
            if (mutations.length > 0) {
                 checkAndScrape();
            }
            
            // Mugbot Injection Check
            if (window.location.href.includes('ItemMarket')) {
                // Ensure we have latest watched items periodically or if they might have changed
                // For now, relies on the cached version or initial fetch
                injectMugbotButtons();
            }
        });

        const target = document.querySelector('#mainContainer') || document.body;
        observer.observe(target, { childList: true, subtree: true });

        // Initial scan after load (no button)
        setTimeout(() => {
            checkAndScrape();
        }, 500);
    }

    // Wait for load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
