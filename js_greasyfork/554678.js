// ==UserScript==
// @name         Item Matcher 132 refreshing
// @version      10000.0
// @description  wooo
// @author       aquagloop
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain/torn.com
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @namespace heartflower.torn
// @downloadURL https://update.greasyfork.org/scripts/554678/Item%20Matcher%20132%20refreshing.user.js
// @updateURL https://update.greasyfork.org/scripts/554678/Item%20Matcher%20132%20refreshing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ITEM_ID_MAP = {
      "Flexible Body Armor": 334,
      "Liquid Body Armor": 333,
      "Combat Vest": 332,
      "Combat Helmet": 651,
      "Combat Pants": 652,
      "Combat Boots": 653,
      "Combat Gloves": 654,
      "Outer Tactical Vest": 50,
      "Kevlar Gloves": 640,
      "WWII Helmet": 641,
      "Safety Boots": 645,
      "Full Body Armor": 49,
      "Bulletproof Vest": 34,
      "Construction Helmet": 643,
      "Police Vest": 33,
      "Flak Jacket": 178,
      "Hiking Boots": 646,
      "Chain Mail": 176,
      "Leather Vest": 32,
      "Leather Helmet": 647,
      "Leather Pants": 648,
      "Leather Boots": 649,
      "Leather Gloves": 650,
      "Vanguard Gloves": 1359,
      "Vanguard Boots": 1358,
      "Vanguard Pants": 1357,
      "Vanguard Body": 1356,
      "Vanguard Respirator": 1355,
      "Sentinel Gloves": 1311,
      "Sentinel Boots": 1310,
      "Sentinel Pants": 1309,
      "Sentinel Apron": 1308,
      "Sentinel Helmet": 1307,
      "Starshield Breastplate": 1174,
      "M'aol Clawshields": 1168,
      "M'aol Hooves": 1167,
      "M'aol Britches": 1166,
      "M'aol Spathe": 1165,
      "M'aol Visage": 1164,
      "Kevlar Lab Coat": 848,
      "EOD Gloves": 684,
      "EOD Boots": 683,
      "EOD Pants": 682,
      "EOD Apron": 681,
      "EOD Helmet": 680,
      "Marauder Gloves": 679,
      "Marauder Boots": 678,
      "Marauder Pants": 677,
      "Marauder Body": 676,
      "Marauder Face Mask": 675,
      "Delta Gloves": 674,
      "Delta Boots": 673,
      "Delta Pants": 672,
      "Delta Body": 671,
      "Delta Gas Mask": 670,
      "Assault Gloves": 669,
      "Assault Boots": 668,
      "Assault Pants": 667,
      "Assault Body": 666,
      "Assault Helmet": 665,
      "Dune Gloves": 664,
      "Dune Boots": 663,
      "Dune Pants": 662,
      "Dune Vest": 661,
      "Dune Helmet": 660,
      "Riot Gloves": 659,
      "Riot Boots": 658,
      "Riot Pants": 657,
      "Riot Body": 656,
      "Riot Helmet": 655,
      "Welding Helmet": 644,
      "Motorcycle Helmet": 642,
      "Medieval Helmet": 538,
      "Hazmat Suit": 348,
      "Gold Plated AK-47": 382,
      "ArmaLite M-15A4": 399,
      "SIG 552": 398,
      "Jackhammer": 223,
      "Minigun": 63,
      "9mm Uzi": 108,
      "M249 SAW": 31,
      "Tavor TAR-21": 612,
      "Enfield SA-80": 219,
      "Steyr AUG": 30,
      "Mag 7": 225,
      "M16 A2 Rifle": 29,
      "Heckler & Koch SL8": 231,
      "Benelli M4 Super": 28,
      "M4A1 Colt Carbine": 27,
      "Bushmaster Carbon 15": 241,
      "AK-47": 26,
      "XM8 Rifle": 174,
      "Ithaca 37": 252,
      "P90": 25,
      "Vektor CR-21": 228,
      "SKS Carbine": 249,
      "MP5 Navy": 24,
      "Benelli M1 Tactical": 23,
      "Sawed-Off Shotgun": 22,
      "Stoner 96": 1157,
      "Negev NG-5": 1156,
      "PKM": 1155,
      "Rheinmetall MG 3": 837,
      "Nock Gun": 830,
      "Dual Uzis": 549,
      "Dual P90s": 548,
      "Dual MP5s": 547,
      "Dual Bushmasters": 546,
      "Dual TMPs": 545,
      "MP 40": 488,
      "Thompson": 487,
      "AK74U": 484,
      "SIG 550": 232,
      "Egg Propelled Launcher": 100,
      "Neutrilux 2000": 98,
      "Snow Cannon": 76,
      "Handbag": 387,
      "Naval Cutlass": 615,
      "Pillow": 440,
      "Flail": 397,
      "Diamond Bladed Knife": 614,
      "Metal Nunchaku": 395,
      "Guandao": 400,
      "Macana": 391,
      "Claymore Sword": 217,
      "Kodachi": 237,
      "Wushu Double Axes": 251,
      "Samurai Sword": 11,
      "Twin Tiger Hooks": 250,
      "Kama": 236,
      "Ice Pick": 402,
      "Katana": 247,
      "Cricket Bat": 438,
      "Chainsaw": 10,
      "Scimitar": 9,
      "Ninja Claws": 111,
      "Wooden Nunchaku": 235,
      "Axe": 8,
      "Chain Whip": 234,
      "Swiss Army Knife": 224,
      "Dagger": 7,
      "Butterfly Knife": 173,
      "Leather Bullwhip": 110,
      "Kitchen Knife": 6,
      "Sai": 238,
      "Pen Knife": 5,
      "Knuckle Dusters": 4,
      "Spear": 227,
      "Bo Staff": 245,
      "Frying Pan": 439,
      "Crowbar": 3,
      "Baseball Bat": 2,
      "Lead Pipe": 401,
      "Hammer": 1,
      "Ban Hammer": 1296,
      "Cattle Prod": 1257,
      "Bone Saw": 1255,
      "Golf Club": 1231,
      "Crystalline Falcata": 1173,
      "Cleaver": 1159,
      "Meat Hook": 1158,
      "Millwall Brick": 1056,
      "Poison Umbrella": 1055,
      "Bread Knife": 1053,
      "Bug Swatter": 871,
      "Sledgehammer": 850,
      "Scalpel": 846,
      "Bolt Gun": 845,
      "Madball": 839,
      "Riding Crop": 832,
      "Duke's Hammer": 805,
      "Penelope": 792,
      "Plastic Sword": 790,
      "Petrified Humerus": 632,
      "Diamond Icicle": 605,
      "Pair of Ice Skates": 604,
      "Devil's Pitchfork": 600,
      "Golden Broomstick": 599,
      "Blood Spattered Sickle": 539,
      "Ivory Walking Cane": 360,
      "Fine Chisel": 359,
      "Pair of High Heels": 346,
      "Dual Samurai Swords": 292,
      "Dual Scimitars": 291,
      "Dual Hammers": 290,
      "Dual Axes": 289,
      "Wand of Destruction": 170,
      "Rusty Sword": 147,
      "Yasukuni Sword": 146,
      "Pink Mac-10": 388,
      "Type 98 Anti Tank": 240,
      "Flamethrower": 255,
      "Harpoon": 613,
      "Qsz-92": 248,
      "Cobra Derringer": 177,
      "BT MP9": 233,
      "Desert Eagle": 20,
      "Magnum": 19,
      "Fiveseven": 18,
      "Taser": 175,
      "USP": 16,
      "Blowgun": 244,
      "Beretta M9": 15,
      "Ruger 57": 14,
      "Crossbow": 218,
      "Taurus": 243,
      "Raven MP25": 13,
      "Springfield 1911": 99,
      "Glock 17": 12,
      "Lorcin 380": 253,
      "Flare Gun": 230,
      "Milkor MGL": 1154,
      "China Lake": 1153,
      "SMAW Launcher": 1152,
      "Prototype": 874,
      "Tranquilizer Gun": 844,
      "Homemade Pocket Shotgun": 838,
      "Beretta Pico": 831,
      "Blunderbuss": 490,
      "Luger": 489,
      "TMP": 486,
      "Skorpion": 485,
      "MP5k": 483,
      "Slingshot": 393,
      "S&W M29": 254,
      "S&W Revolver": 189,
      "RPG Launcher": 109,
      "Dual 92G Berettas": 21,
      "Beretta 92FS": 17
    };

    const ARMOR_NAMES = new Set([
      "Flexible Body Armor", "Liquid Body Armor", "Combat Vest", "Combat Helmet", "Combat Pants",
      "Combat Boots", "Combat Gloves", "Outer Tactical Vest", "Kevlar Gloves", "WWII Helmet",
      "Safety Boots", "Full Body Armor", "Bulletproof Vest", "Construction Helmet", "Police Vest",
      "Flak Jacket", "Hiking Boots", "Chain Mail", "Leather Vest", "Leather Helmet", "Leather Pants",
      "Leather Boots", "Leather Gloves", "Vanguard Gloves", "Vanguard Boots", "Vanguard Pants",
      "Vanguard Body", "Vanguard Respirator", "Sentinel Gloves", "Sentinel Boots", "Sentinel Pants",
      "Sentinel Apron", "Sentinel Helmet", "Starshield Breastplate", "M'aol Clawshields", "M'aol Hooves",
      "M'aol Britches", "M'aol Spathe", "M'aol Visage", "Kevlar Lab Coat", "EOD Gloves", "EOD Boots",
      "EOD Pants", "EOD Apron", "EOD Helmet", "Marauder Gloves", "Marauder Boots", "Marauder Pants",
      "Marauder Body", "Marauder Face Mask", "Delta Gloves", "Delta Boots", "Delta Pants", "Delta Body",
      "Delta Gas Mask", "Assault Gloves", "Assault Boots", "Assault Pants", "Assault Body",
      "Assault Helmet", "Dune Gloves", "Dune Boots", "Dune Pants", "Dune Vest", "Dune Helmet",
      "Riot Gloves", "Riot Boots", "Riot Pants", "Riot Body", "Riot Helmet", "Welding Helmet",
      "Motorcycle Helmet", "Medieval Helmet", "Hazmat Suit"
    ]);

    const SUBMIT_URL = 'http://136.117.216.24:3001/gear';
    const UNCACHED_URL = 'http://136.117.216.24:3001/cache/uncached';
    const GEAR_CACHE_URL = 'http://136.117.216.24:3001/cache/gear';
    const SEND_QUEUE_INTERVAL = 5000;
    const HIGHLIGHT_DEBOUNCE_MS = 300;
    const GEAR_CACHE_EXPIRY_MS = 30 * 60 * 1000;

    let pda = ('xmlhttpRequest' in GM);
    let httpRequest = pda ? 'xmlHttpRequest' : 'xmlHttpRequest';

    let gearCacheIDs = new Set();
    let listingQueue = [];
    let itemsSentCount = 0;
    let debugLog = [];

    let isScriptEnabled = true;
    let isMinimized = false;
    let isDebugLogVisible = false;
    let isUncachedListVisible = false;
    let uncachedSortBy = 'price';

    let uncachedItems = [];
    let lastFetchTime = null;
    let isFetching = false;
    let selectedSortedItemIndex = -1;

    let gearCacheItems = [];
    let gearCacheLastFetch = null;
    let isFetchingGearCache = false;

    let statsUI = null;

    function addDebugLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        debugLog.unshift(`[${timestamp}] ${message}`);
        if (debugLog.length > 50) debugLog.pop();
        updateStatsUI();
    }

    async function loadScriptState() {
        isScriptEnabled = await GM.getValue('itemMatcherEnabled', true);
        isDebugLogVisible = await GM.getValue('isDebugLogVisible', false);
        isUncachedListVisible = await GM.getValue('isUncachedListVisible', false);
        uncachedSortBy = await GM.getValue('uncachedSortBy', 'price');
        isMinimized = await GM.getValue('isMinimized', false);

        uncachedItems = await GM.getValue('uncachedItems', []);
        const storedFetchTime = await GM.getValue('lastFetchTime', null);
        lastFetchTime = storedFetchTime ? new Date(storedFetchTime) : null;

        gearCacheItems = await GM.getValue('gearCacheItems', []);
        const storedGearFetchTime = await GM.getValue('gearCacheLastFetch', null);
        gearCacheLastFetch = storedGearFetchTime ? new Date(storedGearFetchTime) : null;

        addDebugLog(`Script loaded. Enabled: ${isScriptEnabled}. Loaded ${uncachedItems.length} uncached + ${gearCacheItems.length} gear cache items from storage.`);
    }

    async function toggleMinimize() {
        isMinimized = !isMinimized;
        await GM.setValue('isMinimized', isMinimized);
        updateStatsUI();
    }

    async function toggleScript() {
        isScriptEnabled = !isScriptEnabled;
        await GM.setValue('itemMatcherEnabled', isScriptEnabled);
        addDebugLog(`Script toggled: ${isScriptEnabled ? 'ON' : 'OFF'}`);
        updateStatsUI();
    }

    async function toggleDebugLog() {
        isDebugLogVisible = !isDebugLogVisible;
        await GM.setValue('isDebugLogVisible', isDebugLogVisible);
        updateStatsUI();
    }

    async function toggleUncachedList() {
        isUncachedListVisible = !isUncachedListVisible;
        selectedSortedItemIndex = -1;
        await GM.setValue('isUncachedListVisible', isUncachedListVisible);
        updateStatsUI();
    }

    async function setUncachedSort(sortBy) {
        if (uncachedSortBy === sortBy) return;
        uncachedSortBy = sortBy;
        selectedSortedItemIndex = -1;
        await GM.setValue('uncachedSortBy', uncachedSortBy);
        updateStatsUI();
    }

    function isOnItemMarketPage() {
        return window.location.href.includes('page.php?sid=ItemMarket');
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async function fetchUncachedItems() {
        if (isFetching) {
            addDebugLog('Fetch already in progress...');
            return;
        }

        isFetching = true;
        addDebugLog('Fetching uncached items...');
        updateStatsUI();

        GM[httpRequest]({
            method: 'GET',
            url: UNCACHED_URL,
            responseType: 'json',
            onload: async function(response) {
                isFetching = false;
                if (response.status === 200) {
                    try {
                        const data = response.response || JSON.parse(response.responseText);
                        uncachedItems = data.listings || [];
                        lastFetchTime = new Date();
                        selectedSortedItemIndex = -1;
                        addDebugLog(`✓ Fetched ${uncachedItems.length} uncached items`);

                        await GM.setValue('uncachedItems', uncachedItems);
                        await GM.setValue('lastFetchTime', lastFetchTime.toISOString());

                        updateStatsUI();
                        highlightMatchingItems();
                    } catch (err) {
                        addDebugLog(`✗ Parse error: ${err.message}`);
                        updateStatsUI();
                    }
                } else {
                    addDebugLog(`✗ Fetch failed (HTTP ${response.status})`);
                    updateStatsUI();
                }
            },
            onerror: function() {
                isFetching = false;
                addDebugLog(`✗ Network error fetching uncached items`);
                updateStatsUI();
            }
        });
    }

    async function fetchGearCache() {
        const now = Date.now();

        // Check if we have cached data and it's not expired
        if (gearCacheItems.length > 0 && gearCacheLastFetch && (now - gearCacheLastFetch) < GEAR_CACHE_EXPIRY_MS) {
            addDebugLog('Using cached gear cache (not expired)');
            return;
        }

        if (isFetchingGearCache) {
            addDebugLog('Gear cache fetch already in progress...');
            return;
        }

        isFetchingGearCache = true;
        addDebugLog('Fetching gear cache...');
        updateStatsUI();

        GM[httpRequest]({
            method: 'GET',
            url: GEAR_CACHE_URL,
            responseType: 'json',
            onload: async function(response) {
                isFetchingGearCache = false;
                if (response.status === 200) {
                    try {
                        const data = response.response || JSON.parse(response.responseText);
                        gearCacheItems = data.listings || [];
                        gearCacheLastFetch = new Date();
                        addDebugLog(`✓ Fetched ${gearCacheItems.length} gear cache items`);

                        await GM.setValue('gearCacheItems', gearCacheItems);
                        await GM.setValue('gearCacheLastFetch', gearCacheLastFetch.toISOString());

                        updateStatsUI();
                        highlightMatchingItems();
                    } catch (err) {
                        addDebugLog(`✗ Gear cache parse error: ${err.message}`);
                        updateStatsUI();
                    }
                } else {
                    addDebugLog(`✗ Gear cache fetch failed (HTTP ${response.status})`);
                    updateStatsUI();
                }
            },
            onerror: function() {
                isFetchingGearCache = false;
                addDebugLog(`✗ Network error fetching gear cache`);
                updateStatsUI();
            }
        });
    }

    async function highlightMatchingItems() {
        if (!isScriptEnabled) return;

        // Check if gear cache is empty and fetch if needed
        if (gearCacheItems.length === 0) {
            addDebugLog('Gear cache is empty, fetching...');
            await fetchGearCache();
        }

        addDebugLog(`Cache status - Uncached: ${uncachedItems.length}, Gear: ${gearCacheItems.length}`);

        const itemTiles = document.querySelectorAll('.itemTile___cbw7w');
        let greenHighlights = 0;
        let blueHighlights = 0;

        itemTiles.forEach(tile => {
            tile.style.border = '';
            tile.style.boxShadow = '';
            const existingBadge = tile.querySelector('.uncached-price-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            const nameEl = tile.querySelector('.name___ukdHN');
            if (!nameEl) return;

            const itemName = nameEl.textContent.trim();
            const propertyValues = tile.querySelectorAll('.property___SHm8e .value___cwqHv');

            if (propertyValues.length === 0) return;

            let damageArmor = null;
            let accuracy = null;

            if (propertyValues.length === 2) {
                damageArmor = parseFloat(propertyValues[0].textContent.trim());
                accuracy = parseFloat(propertyValues[1].textContent.trim());
            } else if (propertyValues.length === 1) {
                damageArmor = parseFloat(propertyValues[0].textContent.trim());
                accuracy = 0;
            }

            const uncachedMatch = uncachedItems.find(item => {
                if (item.item_name !== itemName) return false;
                const itemDamageArmor = parseFloat(item.damage_armor);
                const itemAccuracy = parseFloat(item.accuracy || 0);
                return itemDamageArmor === damageArmor && itemAccuracy === accuracy;
            });

            if (uncachedMatch) {
                greenHighlights++;
                tile.style.border = '2px solid #00ff00';
                tile.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
                return;
            }

            const gearCacheMatch = gearCacheItems.find(item => {
                if (item.itemName !== itemName) return false;
                const itemDamageArmor = parseFloat(item.stats?.damage || item.damage_armor || 0);
                const itemAccuracy = parseFloat(item.stats?.accuracy || item.accuracy || 0);
                return itemDamageArmor === damageArmor && itemAccuracy === accuracy;
            });

            if (!gearCacheMatch) {
                blueHighlights++;
                tile.style.border = '2px solid #0088ff';
                tile.style.boxShadow = '0 0 10px rgba(0, 136, 255, 0.5)';
            }
        });

        if (greenHighlights > 0 || blueHighlights > 0) {
            addDebugLog(`Highlighted ${greenHighlights} uncached (green) + ${blueHighlights} new gear (blue) items`);
        }
    }

    function setupApiInterception() {
        if (!isOnItemMarketPage()) {
            return;
        }

        if (!unsafeWindow.__originalFetch) {
            unsafeWindow.__originalFetch = unsafeWindow.fetch;
        }

        let originalFetch = unsafeWindow.__originalFetch;
        let currentArmouryID = null;

        unsafeWindow.fetch = function(...args) {
            let [url, options] = args;
            let urlString = typeof url === 'string' ? url : (url && url.url ? url.url : '');

            if (urlString.includes('getListing') && isOnItemMarketPage() && isScriptEnabled && options && options.body) {
                try {
                    const params = new URLSearchParams(options.body);
                    const armouryID = params.get('armouryID');
                    if (armouryID) {
                        currentArmouryID = armouryID;
                        addDebugLog(`Captured armouryID: ${armouryID}`);
                    }
                } catch (err) {
                    addDebugLog(`Error parsing request body: ${err.message}`);
                }
            }

            if (urlString.includes('getListing') && isOnItemMarketPage() && isScriptEnabled) {
                return originalFetch.apply(this, args).then(response => {
                    let clonedResponse = response.clone();
                    clonedResponse.json().then(data => {
                        if (data.list && data.list.length > 0) {
                            let listing = data.list[0];
                            if (currentArmouryID) {
                                listing.armouryID = currentArmouryID;
                            }
                            tryAutoSendListing(listing);
                        }
                    }).catch(err => {
                        addDebugLog(`Error parsing getListing response: ${err.message}`);
                    });
                    return response;
                });
            }
            return originalFetch.apply(this, args);
        };
        addDebugLog('API interception setup complete');
    }

    function tryAutoSendListing(listing, retries = 20) {
        if (!isScriptEnabled) return;

        if (gearCacheIDs.has(listing.listingID)) {
            return;
        }

        let scrapedData = scrapeItemDetailsFromPage();
        if (scrapedData) {
            gearCacheIDs.add(listing.listingID);

            let listerId = (listing.user && listing.user.ID) ? listing.user.ID : "0";
            let sellerName = (listing.user && listing.user.name) ? listing.user.name : "Anonymous";
            if (listing.anonymous === true) {
                listerId = "0";
                sellerName = "Anonymous";
            }
            let listingData = {
                listingID: listing.listingID,
                item_name: scrapedData.item_name,
                damage_armor: scrapedData.damage_armor,
                accuracy: scrapedData.accuracy,
                bonuses: scrapedData.bonuses,
                lister: listerId,
                seller_name: sellerName,
                price: listing.price,
                armouryID: listing.armouryID,
                adder: 'auto-scraper'
            };

            listingQueue.push(listingData);
            addDebugLog(`Queued: ${listingData.item_name} ($${listingData.price})`);
            updateStatsUI();

        } else {
            if (retries <= 0) {
                addDebugLog('Failed to scrape item details after retries');
                return;
            }
            setTimeout(() => tryAutoSendListing(listing, retries - 1), 100);
        }
    }

    function scrapeItemDetailsFromPage() {
        try {
            let itemName = document.body.querySelector('.expanded___xsZfG .name___ukdHN')?.textContent?.trim();
            if (!itemName) return null;

            let damageArmor;
            let valueElement = document.body.querySelector('.expanded___xsZfG .value___cwqHv');

            if (valueElement) {
                damageArmor = valueElement.textContent.trim();
            } else {
                addDebugLog(`No damage/armor found for: ${itemName}. Skipping.`);
                return null;
            }

            let accuracy = '0.0';
            let propertyValues = document.body.querySelectorAll('.expanded___xsZfG .properties___QCPEP .value___cwqHv');
            if (propertyValues.length >= 2) {
                accuracy = propertyValues[1].textContent.trim();
            }

            let bonuses = [];
            let bonusElements = document.body.querySelectorAll('.expanded___xsZfG .bonuses___a8gmz .icon___AuVoj');
            bonusElements.forEach(bonusEl => {
                let description = bonusEl.getAttribute('data-bonus-attachment-description');
                let name = bonusEl.getAttribute('data-bonus-attachment-title') || bonusEl.getAttribute('aria-label') || 'Unknown';
                if (description) {
                    let match = description.match(/(\d+)%/) || description.match(/(\d+) turns?/);
                    if (match) {
                        let value = match[1];
                        let isPercentage = description.includes('%');
                        bonuses.push({
                            name: name,
                            description: description,
                            value: value,
                            isPercentage: isPercentage
                        });
                    }
                }
            });

            if (bonuses.length > 0) {
                addDebugLog(`Bonuses scraped for ${itemName}: ${bonuses.map(b => `${b.name} (${b.value}${b.isPercentage ? '%' : ' turns'})`).join(', ')}`);
            } else {
                addDebugLog(`No bonuses found for ${itemName}`);
            }

            return { item_name: itemName, damage_armor: damageArmor, accuracy: accuracy, bonuses: bonuses };
        } catch (err) {
            addDebugLog(`Scrape error: ${err.message}`);
            return null;
        }
    }

    function sendCompleteListingData(listingData) {
        GM[httpRequest]({
            method: 'POST',
            url: SUBMIT_URL,
            data: JSON.stringify(listingData),
            headers: { 'Content-Type': 'application/json' },
            responseType: 'json',
            onload: function(response) {
                if (response.status === 200) {
                    itemsSentCount++;
                    addDebugLog(`✓ Sent: ${listingData.item_name} ($${listingData.price})`);

                    const sentName = listingData.item_name;
                    const sentDamageArmor = parseFloat(listingData.damage_armor);
                    const sentAccuracy = parseFloat(listingData.accuracy || 0);

                    const itemIndex = uncachedItems.findIndex(item => {
                        if (item.item_name !== sentName) return false;
                        const itemDamageArmor = parseFloat(item.damage_armor);
                        const itemAccuracy = parseFloat(item.accuracy || 0);
                        return itemDamageArmor === sentDamageArmor && itemAccuracy === sentAccuracy;
                    });

                    if (itemIndex > -1) {
                        uncachedItems.splice(itemIndex, 1);
                        addDebugLog(`Removed ${sentName} from uncached list.`);
                        GM.setValue('uncachedItems', uncachedItems);
                        highlightMatchingItems();
                    }

                    const newCacheItem = {
                        listingID: listingData.listingID,
                        itemId: null,
                        itemName: listingData.item_name,
                        price: listingData.price,
                        available: 1,
                        user: { ID: listingData.lister, name: listingData.seller_name },
                        type: 'gear',
                        bonuses: listingData.bonuses || [],
                        armouryID: listingData.armouryID,
                        stats: {
                            damage: parseFloat(listingData.damage_armor),
                            accuracy: parseFloat(listingData.accuracy || 0)
                        }
                    };

                    gearCacheItems.push(newCacheItem);
                    GM.setValue('gearCacheItems', gearCacheItems);

                    updateStatsUI();
                } else {
                    addDebugLog(`✗ Failed to send (HTTP ${response.status}): ${listingData.item_name}`);
                }
            },
            onerror: function() {
                addDebugLog(`✗ Network error sending: ${listingData.item_name}`);
            }
        });
    }

    function processListingQueue() {
        if (listingQueue.length > 0 && isScriptEnabled) {
            const itemToSend = listingQueue.shift();
            sendCompleteListingData(itemToSend);
            updateStatsUI();
        }
    }

    function createStatsUI() {
        if (statsUI) return;

        statsUI = document.createElement('div');
        statsUI.id = 'item-matcher-stats';
        statsUI.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 12px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 999999;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            border: 1px solid #333;
        `;

        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        statsUI.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.id.includes('-toggle') || e.target.id.includes('-sort-') || e.target.tagName === 'A') return;
            isDragging = true;
            initialX = e.clientX - statsUI.offsetLeft;
            initialY = e.clientY - statsUI.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                statsUI.style.left = currentX + 'px';
                statsUI.style.top = currentY + 'px';
                statsUI.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.body.appendChild(statsUI);
        updateStatsUI();
    }

    function generateItemSearchURL(item) {
        const itemID = ITEM_ID_MAP[item.item_name];
        if (!itemID) return null;

        const fromValue = Math.floor(item.damage_armor);
        const toValue = fromValue + 1;
        const fromAccuracy = Math.floor(item.accuracy || 0);
        const toAccuracy = fromAccuracy + 1;

        const price = item.price ? parseInt(item.price, 10) : 0;
        let priceParams = '';
        if (price > 0) {
            priceParams = `&priceFrom=${price}&priceTo=${price}`;
        }

        let searchURL;
        if (ARMOR_NAMES.has(item.item_name)) {
            searchURL = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemID}&sortField=price&sortOrder=DESC&armorFrom=${fromValue}&armorTo=${toValue}${priceParams}`;
        } else {
            searchURL = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemID}&sortField=price&sortOrder=DESC&damageFrom=${fromValue}&damageTo=${toValue}&accuracyFrom=${fromAccuracy}&accuracyTo=${toAccuracy}${priceParams}`;
        }
        return searchURL;
    }

    function handleListNavigation(e) {
        if (e.key !== 'w' && e.key !== 's' && e.key !== ' ') return;

        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
            return;
        }

        if (!isUncachedListVisible || uncachedItems.length === 0) return;

        e.preventDefault();

        const maxIndex = uncachedItems.length - 1;

        if (e.key === 's') {
            selectedSortedItemIndex++;
            if (selectedSortedItemIndex > maxIndex) selectedSortedItemIndex = 0;
        } else if (e.key === 'w') {
            selectedSortedItemIndex--;
            if (selectedSortedItemIndex < 0) selectedSortedItemIndex = maxIndex;
        } else if (e.key === ' ') {
            selectedSortedItemIndex = 0;
        }

        let sortedItems = [...uncachedItems];
        if (uncachedSortBy === 'price') {
            sortedItems.sort((a, b) => a.price - b.price);
        } else {
            sortedItems.sort((a, b) => a.item_name.localeCompare(b.item_name));
        }

        const item = sortedItems[selectedSortedItemIndex];
        if (!item) return;

        const url = generateItemSearchURL(item);

        updateStatsUI();
        if (url) {
            window.location.href = url;
        }
    }

    function updateStatsUI() {
        if (!statsUI) return;

        const statusColor = isScriptEnabled ? '#66ff66' : '#ff6666';
        const statusText = isScriptEnabled ? 'ACTIVE' : 'DISABLED';
        const queueSize = listingQueue.length;

        const fetchButtonColor = isFetching ? '#888' : '#4488ff';
        const fetchButtonText = isFetching ? 'Fetching...' : '🔄 Fetch';
        const lastFetchText = lastFetchTime
            ? `Last: ${lastFetchTime.toLocaleTimeString()}`
            : 'Never fetched';

        let debugSection = '';
        const debugToggleText = isDebugLogVisible ? 'Hide' : 'Show';
        let debugLogsHTML = '';

        if (isDebugLogVisible) {
            if (debugLog.length > 0) {
                debugLogsHTML = debugLog.slice(0, 20).map(log =>
                    `<div style="font-size: 10px; color: #aaa; margin-top: 2px; white-space: normal; word-break: break-all;">${log}</div>`
                ).join('');
            } else {
                debugLogsHTML = `<div style="font-size: 10px; color: #666;">No activity logged yet.</div>`;
            }
            debugLogsHTML = `<div style="max-height: 150px; overflow-y: auto; padding-right: 5px;">${debugLogsHTML}</div>`;
        }

        debugSection = `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #444;">
                <div id="im-debug-toggle" style="color: #888; font-size: 10px; margin-bottom: 4px; cursor: pointer; font-weight: bold; user-select: none;">
                    Recent Activity <span style="color: #4488ff;">[${debugToggleText}]</span>
                </div>
                ${debugLogsHTML}
            </div>
        `;

        const uncachedToggleText = isUncachedListVisible ? 'Hide' : 'Show';
        let uncachedListHTML = '';

        if (isUncachedListVisible) {
            const sortPriceColor = uncachedSortBy === 'price' ? '#66ff66' : '#888';
            const sortPriceWeight = uncachedSortBy === 'price' ? 'bold' : 'normal';
            const sortNameColor = uncachedSortBy === 'name' ? '#66ff66' : '#888';
            const sortNameWeight = uncachedSortBy === 'name' ? 'bold' : 'normal';

            let sortedItems = [...uncachedItems];
            if (uncachedSortBy === 'price') {
                sortedItems.sort((a, b) => a.price - b.price);
            } else {
                sortedItems.sort((a, b) => a.item_name.localeCompare(b.item_name));
            }

            const itemsHTML = sortedItems.map((item, index) => {
                const searchURL = generateItemSearchURL(item);
                let nameHTML = '';

                if (searchURL) {
                    nameHTML = `<a href="${searchURL}" style="color: #66aaff; text-decoration: none; white-space: normal; word-break: break-all; padding-right: 10px;">${item.item_name}</a>`;
                } else {
                    nameHTML = `<span style="white-space: normal; word-break: break-all; padding-right: 10px;">${item.item_name}</span>`;
                }

                const isSelected = (index === selectedSortedItemIndex);
                const selectionStyle = isSelected ? 'background-color: #223355; outline: 1px solid #4488ff;' : '';

                return `
                    <div style="font-size: 11px; color: #ccc; margin-top: 4px; display: flex; justify-content: space-between; border-bottom: 1px solid #222; padding: 4px; ${selectionStyle}">
                        ${nameHTML}
                        <strong style="color: #66ff66; white-space: nowrap;">$${item.price.toLocaleString()}</strong>
                    </div>
                `;
            }).join('');

            uncachedListHTML = `
                <div style="margin-top: 8px;">
                    <div style="font-size: 10px; color: #888; margin-bottom: 5px;">
                        Sort by:
                        <button id="im-uncached-sort-price" style="background: none; border: none; color: ${sortPriceColor}; cursor: pointer; font-size: 10px; font-weight: ${sortPriceWeight}; padding: 2px 4px;">Price</button>
                        <button id="im-uncached-sort-name" style="background: none; border: none; color: ${sortNameColor}; cursor: pointer; font-size: 10px; font-weight: ${sortNameWeight}; padding: 2px 4px;">Name</button>
                    </div>
                    <div style="max-height: 800px; overflow-y: auto; border: 1px solid #333; padding: 5px 8px; border-radius: 4px; background: #111;">
                        ${sortedItems.length > 0 ? itemsHTML : '<div style="font-size: 11px; color: #888;">No uncached items found.</div>'}
                    </div>
                </div>
            `;
        }

        // Minimized mode
        if (isMinimized) {
            statsUI.innerHTML = `
                <div id="im-minimized" style="
                    cursor: pointer;
                    padding: 4px 8px;
                    color: #fff;
                    font-weight: bold;
                    font-size: 12px;
                ">
                    Item Matcher — minimized (click to expand)
                </div>
            `;
            document.getElementById('im-minimized').addEventListener('click', toggleMinimize);
            return;
        }

        // Normal mode
        statsUI.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-weight: bold; color: ${statusColor};">Item Matcher ${statusText}</div>

                <div>
                    <button id="im-minimize-btn" style="
                        background: #444;
                        color: #fff;
                        border: none;
                        padding: 4px 6px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 10px;
                        margin-right: 4px;
                    ">–</button>

                    <button id="im-toggle-btn" style="
                        background: ${statusColor};
                        color: #000;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 10px;
                        font-weight: bold;
                    ">${isScriptEnabled ? 'ON' : 'OFF'}</button>
                </div>
            </div>

            <div style="border-top: 1px solid #444; padding-top: 8px;">
                <div>📊 Sent: <span style="color: #66ff66; font-weight: bold;">${itemsSentCount}</span></div>
                <div>📦 Queue: <span style="color: ${queueSize > 0 ? '#ffaa66' : '#888'}; font-weight: bold;">${queueSize}</span></div>
                <div>🔧 Gear Cache: <span style="color: #0088ff; font-weight: bold;">${gearCacheItems.length}</span></div>
            </div>

            <div style="border-top: 1px solid #444; margin-top: 8px; padding-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <div id="im-uncached-toggle" style="color: #888; font-size: 10px; cursor: pointer; font-weight: bold; user-select: none;">
                        Uncached Items: <span style="color: #66ff66; font-weight: bold;">${uncachedItems.length}</span>
                        <span style="color: #4488ff;">[${uncachedToggleText}]</span>
                    </div>
                    <button id="im-fetch-btn" style="
                        background: ${fetchButtonColor};
                        color: #fff;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 4px;
                        cursor: ${isFetching ? 'not-allowed' : 'pointer'};
                        font-size: 10px;
                        font-weight: bold;
                    " ${isFetching ? 'disabled' : ''}>${fetchButtonText}</button>
                </div>
                <div style="color: #666; font-size: 9px;">${lastFetchText}</div>
                ${uncachedListHTML}
            </div>

            ${debugSection}
        `;

        document.getElementById('im-toggle-btn')?.addEventListener('click', toggleScript);
        document.getElementById('im-minimize-btn')?.addEventListener('click', toggleMinimize);
        document.getElementById('im-fetch-btn')?.addEventListener('click', fetchUncachedItems);
        document.getElementById('im-debug-toggle')?.addEventListener('click', toggleDebugLog);
        document.getElementById('im-uncached-toggle')?.addEventListener('click', toggleUncachedList);
        document.getElementById('im-uncached-sort-price')?.addEventListener('click', () => setUncachedSort('price'));
        document.getElementById('im-uncached-sort-name')?.addEventListener('click', () => setUncachedSort('name'));
    }

    loadScriptState().then(() => {
        setupApiInterception();

        GM.registerMenuCommand('Toggle Item Matcher', toggleScript);
        GM.registerMenuCommand('Fetch Uncached Items', fetchUncachedItems);

        function startDomTasks() {
            if (!document.body) {
                setTimeout(startDomTasks, 100);
                return;
            }

            if (!isOnItemMarketPage()) {
                return;
            }

            createStatsUI();

            document.addEventListener('keydown', handleListNavigation);

            highlightMatchingItems();

            setInterval(processListingQueue, SEND_QUEUE_INTERVAL);

            let currentUrl = window.location.href;
            let marketObserver;

            const debouncedHighlightAndUrlCheck = debounce(() => {
                if (window.location.href !== currentUrl) {
                    currentUrl = window.location.href;
                    addDebugLog('Page navigation detected');
                }

                if (!isOnItemMarketPage() || !isScriptEnabled) {
                    if (!isScriptEnabled) {
                        highlightMatchingItems();
                    }
                    return;
                }

                marketObserver.disconnect();

                try {
                    highlightMatchingItems();
                } catch (e) {
                    addDebugLog(`Highlight error: ${e.message}`);
                }

                marketObserver.observe(document.body, { childList: true, subtree: true });

            }, HIGHLIGHT_DEBOUNCE_MS);

            marketObserver = new MutationObserver(() => {
                debouncedHighlightAndUrlCheck();
            });

            marketObserver.observe(document.body, { childList: true, subtree: true });

            addDebugLog('DOM tasks initialized');
        }

        startDomTasks();
    });

})();
