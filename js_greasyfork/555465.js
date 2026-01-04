// ==UserScript==
// @name         Ranked War Cache Rewards Value TESTING V2
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Calculate and display ranked war cache reward values with % of total reward split, custom pricing, API integration, PDA support, other rewards (points/respect), cache split calculator with trade recommendations, and API cache timestamp display. Features automatic theme detection and multiple trader configurations.
// @author       Mistborn [3037268]
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/war.php?step=rankreport*
// @run-at       document-start
// @grant        GM.xmlHttpRequest
// @grant        none
// @connect      api.torn.com
// @supportURL   https://github.com/MistbornTC/ranked-war-cache-rewards/issues
// @license      MIT
// @credits      Inspired by bot_7420 [2937420]
// @downloadURL https://update.greasyfork.org/scripts/555465/Ranked%20War%20Cache%20Rewards%20Value%20TESTING%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/555465/Ranked%20War%20Cache%20Rewards%20Value%20TESTING%20V2.meta.js
// ==/UserScript==

// PDA API Key placeholder - MUST be at global scope for PDA replacement
const PDA_API_KEY = '###PDA-APIKEY###';

// PDA API URLs - complete strings for PDA to process
const PDA_USER_API_URL = 'https://api.torn.com/user/?selections=basic&key=###PDA-APIKEY###';
const PDA_ITEMS_API_URL = 'https://api.torn.com/torn/?selections=items&key=###PDA-APIKEY###';
const PDA_POINTS_API_URL = 'https://api.torn.com/torn/?selections=pointsmarket&key=###PDA-APIKEY###';

(function () {
    "use strict";
    console.log("RWAwardValue: Script starting v3.7");

    // Enhanced PDA detection
    function isTornPDA() {
        const userAgentCheck = navigator.userAgent.includes('com.manuito.tornpda');
        const flutterCheck = !!window.flutter_inappwebview;
        const platformCheck = !!window.__PDA_platformReadyPromise;
        const httpCheck = !!window.PDA_httpGet;
        const result = !!(userAgentCheck || flutterCheck || platformCheck || httpCheck);
        console.log('RW: PDA Detection:', result, {
            userAgent: userAgentCheck,
            flutter: flutterCheck,
            platform: platformCheck,
            httpGet: httpCheck
        });
        return result;
    }

    // Configure PDA session
    const PDA_MODE = isTornPDA();
    console.log('RW: PDA Mode:', PDA_MODE);

    // ========================================
    // GLOBAL VARIABLES & SETTINGS
    // ========================================

    // User's API key and validation status
    let API_KEY = 'YOUR_API_KEY_HERE';
    let API_USERNAME = ''; // Username from successful API validation
    let PDA_VALIDATED = false; // Whether PDA mobile app API is working
    let SETTINGS = {
        showApiValues: false,
        showIndirectRewards: false,
        showCustomPrices: false,
        respectValue: 20000,
        showCacheSplit: false
    };

    // Cache API prices with timestamp to avoid repeated calls
    let apiPriceCache = {
        lastFetched: null,
        data: {}
    };

    // Debug mode - window.rwDebugMode = true/false
    let DEBUG_MODE = localStorage.getItem('rw_debug_mode') === 'true';

    Object.defineProperty(window, 'rwDebugMode', {
        get() { return DEBUG_MODE; },
        set(value) {
            DEBUG_MODE = !!value;
            localStorage.setItem('rw_debug_mode', DEBUG_MODE.toString());
            console.log('RW: Debug mode', DEBUG_MODE ? 'ENABLED' : 'DISABLED');
        }
    });

    // Custom seller prices (up to 10 different sellers) - declared before loadSettings
    let sellerData = {
        activeSeller: 0,
        sellers: [
            { name: "Trader 1", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 2", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 3", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 4", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 5", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 6", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 7", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 8", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 9", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
            { name: "Trader 10", pricingMode: "fixed", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } }
        ]
    };

    // Working data for calculations
    let marketValueMap = new Map();        // Live market prices from API
    let pointMarketValue = 0;              // Current points market rate
    let currentTheme = getTheme();         // Track dark/light mode
    let rewardData = [];                   // Processed reward data
    let rawRewardData = [];               // Original data for recalculation

    // Cache information mapping with IDs and image URLs
    const CACHE_INFO = {
        armorCache: {
            id: 1118,
            name: 'Armor Cache',
            shortName: 'Armor',
            imageUrl: 'https://www.torn.com/images/items/1118/large.png'
        },
        meleeCache: {
            id: 1119,
            name: 'Melee Cache',
            shortName: 'Melee',
            imageUrl: 'https://www.torn.com/images/items/1119/large.png'
        },
        smallArmsCache: {
            id: 1120,
            name: 'Small Arms Cache',
            shortName: 'Small Arms',
            imageUrl: 'https://www.torn.com/images/items/1120/large.png'
        },
        mediumArmsCache: {
            id: 1121,
            name: 'Medium Arms Cache',
            shortName: 'Medium Arms',
            imageUrl: 'https://www.torn.com/images/items/1121/large.png'
        },
        heavyArmsCache: {
            id: 1122,
            name: 'Heavy Arms Cache',
            shortName: 'Heavy Arms',
            imageUrl: 'https://www.torn.com/images/items/1122/large.png'
        }
    };

    // ========================================
    // THEME DETECTION & MONITORING
    // ========================================

    // Watch for theme changes and update UI automatically
    function monitorThemeChanges() {
        // Set up listener to detect when user switches between dark/light mode
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    const newTheme = getTheme();
                    if (newTheme !== currentTheme) {
                        console.log('RW: Theme changed from', currentTheme, 'to', newTheme);
                        currentTheme = newTheme;
                        updateAllUIForTheme();
                    }
                }
            });
        });

        // Start observing body for class and style changes
        if (document.body) {
            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
    }

    // Refresh all UI elements when theme changes
    function updateAllUIForTheme() {
        console.log('RW: Updating all UI elements for theme:', currentTheme);

        // Refresh the main reward display
        if (typeof refreshRewardDisplay === 'function') {
            refreshRewardDisplay();
        }

        // Update any open configuration panels by refreshing their styles
        const pricePanel = document.getElementById('rw-price-panel');
        const settingsPanel = document.getElementById('rw-settings-panel');

        if (pricePanel && pricePanel.style.maxHeight !== '0px') {
            console.log('RW: Refreshing price panel colors for new theme');
            // Close and reopen the price panel to apply new theme
            const priceButton = document.getElementById('rw-price-btn-header');
            if (priceButton) {
                priceButton.click(); // Close
                setTimeout(() => priceButton.click(), 50); // Reopen with new theme
            }
        }

        if (settingsPanel && settingsPanel.style.maxHeight !== '0px') {
            console.log('RW: Refreshing settings panel colors for new theme');
            // Close and reopen the settings panel to apply new theme
            const settingsButton = document.getElementById('rw-settings-btn-header');
            if (settingsButton) {
                settingsButton.click(); // Close
                setTimeout(() => settingsButton.click(), 50); // Reopen with new theme
            }
        }
    }

    // ========================================
    // UTILITY/HELPER FUNCTIONS
    // ========================================
    function isMobile() {
        const width = window.innerWidth;
        const isMobileWidth = width <= 768;
        console.log('RW: Mobile detection - width:', width, 'isMobile:', isMobileWidth);
        return isMobileWidth;
    }

    // Mobile-safe arrow function using HTML entities
    function getMobileArrow(isPositive) {
        // Use HTML entities that work reliably across all platforms
        return isPositive ? '&#9650;' : '&#9660;'; // ▲ ▼ as HTML entities
    }

    // Mobile-safe expand arrow using HTML entities
    function getExpandArrow(isExpanded) {
        // Use HTML entities for consistent rendering
        return isExpanded ? '&#9650;' : '&#9660;'; // ▲ ▼ as HTML entities
    }

    function getTheme() {
        // Wait for body to exist
        if (!document.body) {
            return 'dark'; // Default fallback
        }
        const body = document.body;
        const isDarkMode = body.classList.contains('dark-mode') ||
                          body.classList.contains('dark') ||
                          body.style.background.includes('#191919') ||
                          getComputedStyle(body).backgroundColor === 'rgb(25, 25, 25)';
        return isDarkMode ? 'dark' : 'light';
    }

    function getThemeColors() {
        const theme = getTheme();
        if (theme === 'dark') {
            return {
                panelBg: '#2a2a2a',
                panelBorder: '#444',
                statBoxBg: '#3a3a3a',
                statBoxBorder: '#444',
                statBoxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textPrimary: '#fff',
                textSecondary: '#ccc',
                textMuted: '#999',
                success: '#5cb85c',
                danger: '#d9534f',
                primary: 'rgb(116, 192, 252)',
                configBg: '#333',
                configBorder: '#555',
                inputBg: '#444',
                inputBorder: '#555'
            };
        } else {
            return {
                panelBg: '#eeeeee',
                panelBorder: 'rgba(102, 102, 102, 0.3)',
                statBoxBg: '#ffffff',
                statBoxBorder: 'rgba(102, 102, 102, 0.3)',
                statBoxShadow: 'rgba(50, 50, 50, 0.2) 0px 0px 2px 0px',
                textPrimary: '#212529',
                textSecondary: '#212529',
                textMuted: '#666',
                success: 'rgb(105, 168, 41)',
                danger: '#dc3545',
                primary: '#0092d8',
                configBg: '#ffffff',
                configBorder: '#ced4da',
                inputBg: '#ffffff',
                inputBorder: '#ced4da'
            };
        }
    }

    // Format number with commas
    function formatNumberWithCommas(num) {
        if (num === 0) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Parse number from comma-formatted string
    function parseCommaNumber(str) {
        return parseInt(str.replace(/,/g, '')) || 0;
    }

    // Detect ranking outcome from faction name for winner/loser determination
    function detectRankingOutcome(factionName) {
        if (!factionName || typeof factionName !== 'string') {
            return null; // Cannot determine
        }

        const lowerName = factionName.toLowerCase();
        if (lowerName.includes('ranked down')) {
            return 'loser';
        } else if (lowerName.includes('ranked up') || lowerName.includes('remained at')) {
            return 'winner';
        }

        return null; // Cannot determine
    }

    // Create dismissible info box for when no pricing is available
    function createNoPricingInfoBox() {
        const colors = getThemeColors();
        const mobile = isMobile();

        const infoBox = document.createElement('div');
        infoBox.id = 'rw-no-pricing-info';
        infoBox.style.cssText = `
            background: ${colors.statBoxBg};
            border: 1px solid ${colors.primary};
            border-radius: 6px;
            padding: ${mobile ? '12px' : '16px'};
            margin: 15px 0;
            position: relative;
            box-shadow: ${colors.statBoxShadow};
        `;

        // Close button (X)
        const closeButton = document.createElement('span');
        closeButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 12px;
            font-size: 18px;
            font-weight: bold;
            color: ${colors.textMuted};
            cursor: pointer;
            user-select: none;
            line-height: 1;
        `;
        closeButton.innerHTML = mobile ? '&#215;' : '×';
        closeButton.title = 'Dismiss this message';

        // Close functionality
        closeButton.addEventListener('click', function() {
            infoBox.remove();
            // Remember dismissal
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem('rw_no_pricing_info_dismissed', 'true');
            }
        });

        // Info content
        const content = document.createElement('div');
        content.style.cssText = `
            color: ${colors.textPrimary};
            font-size: ${mobile ? '11px' : '12px'};
            line-height: 1.4;
        `;

        // Title
        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 8px;
            color: ${colors.primary};
            font-size: ${mobile ? '13px' : '14px'};
        `;
        title.textContent = 'No Pricing Configured';

        // Message content container
        const message = document.createElement('div');

        // Description text
        const description = document.createElement('div');
        description.style.marginBottom = '8px';
        description.textContent = 'Cache reward values are not being calculated as no pricing sources are configured.';

        // "To see reward values:" text
        const instructionHeader = document.createElement('div');
        instructionHeader.style.cssText = `font-weight: bold; margin-bottom: 4px;`;
        instructionHeader.textContent = 'To see reward values:';

        // Bullet points container
        const bulletPoints = document.createElement('div');

        // First bullet point - Price List
        const bullet1 = document.createElement('div');
        bullet1.style.marginBottom = '2px';
        bullet1.innerHTML = (mobile ? '&#8226; ' : '• ') + 'Configure custom prices using ';

        const priceListLink = document.createElement('span');
        priceListLink.textContent = 'Price List';
        priceListLink.style.cssText = `
            color: ${colors.primary};
        `;

        bullet1.appendChild(priceListLink);
        bullet1.innerHTML += ', and/or';

        // Second bullet point - Settings
        const bullet2 = document.createElement('div');
        bullet2.innerHTML = (mobile ? '&#8226; ' : '• ') + 'Enable market values in ';

        const settingsLink = document.createElement('span');
        settingsLink.textContent = 'Settings';
        settingsLink.style.cssText = `
            color: ${colors.primary};
        `;

        bullet2.appendChild(settingsLink);
        bullet2.innerHTML += ' (Public API key)';

        bulletPoints.appendChild(bullet1);
        bulletPoints.appendChild(bullet2);

        message.appendChild(description);
        message.appendChild(instructionHeader);
        message.appendChild(bulletPoints);

        content.appendChild(title);
        content.appendChild(message);
        infoBox.appendChild(closeButton);
        infoBox.appendChild(content);

        return infoBox;
    }

    // Check if no pricing info box should be shown
    function shouldShowNoPricingInfo() {
        // Don't show if user has dismissed it
        if (typeof(Storage) !== "undefined") {
            const dismissed = localStorage.getItem('rw_no_pricing_info_dismissed');
            if (dismissed === 'true') {
                return false;
            }
        }

        // Show if no valid API key AND no custom prices configured
        const hasValidApiKey = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') || PDA_VALIDATED;
        const hasCustomPrices = SETTINGS.showCustomPrices && sellerData.sellers.some(seller =>
            Object.values(seller.prices).some(price => price > 0)
        );

        // Hide info box if user has either a valid API key OR configured custom prices
        return !hasValidApiKey && !hasCustomPrices;
    }

    // ========================================
    // SETTINGS & DATA PERSISTENCE
    // ========================================

    // Load settings from browser storage
    function loadSettings() {
        if (typeof(Storage) !== "undefined") {
            const saved = localStorage.getItem('rw_cache_settings');
            if (saved) {
                try {
                    SETTINGS = Object.assign(SETTINGS, JSON.parse(saved));
                } catch (e) {
                    console.log('RW: Could not load settings');
                }
            }

            const savedKey = localStorage.getItem('rw_api_key');
            if (savedKey) {
                API_KEY = savedKey;
            }

            const savedUsername = localStorage.getItem('rw_api_username');
            if (savedUsername) {
                API_USERNAME = savedUsername;
                console.log('RW: Loaded username from localStorage:', API_USERNAME);
            }

            const savedPdaValidated = localStorage.getItem('rw_pda_validated');
            if (savedPdaValidated === 'true') {
                PDA_VALIDATED = true;
                console.log('RW: PDA State Transition - Loaded validated state from localStorage');
                console.log('RW: PDA State - Mode:', PDA_MODE, 'Validated:', PDA_VALIDATED, 'Username:', API_USERNAME);
            } else {
                console.log('RW: PDA State - No validation flag in localStorage, PDA_MODE:', PDA_MODE);
            }

            // Load API price cache from localStorage
            const savedApiCache = localStorage.getItem('rw_api_price_cache');
            if (savedApiCache) {
                try {
                    apiPriceCache = JSON.parse(savedApiCache);
                    console.log('RW: Loaded API price cache from localStorage:', apiPriceCache);
                } catch (e) {
                    console.log('RW: Could not load API price cache from localStorage');
                }
            }

            // Load seller data with migration support
            const savedSellers = localStorage.getItem('rw_seller_data');
            if (savedSellers) {
                try {
                    const parsed = JSON.parse(savedSellers);
                    if (parsed && parsed.sellers && Array.isArray(parsed.sellers)) {
                        sellerData = parsed;


                        console.log('RW: Loaded seller data:', sellerData);
                    }
                } catch (e) {
                    console.log('RW: Could not load seller data, using defaults');
                }
            }
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('rw_cache_settings', JSON.stringify(SETTINGS));
            if (API_KEY !== 'YOUR_API_KEY_HERE') {
                localStorage.setItem('rw_api_key', API_KEY);
            }
            if (API_USERNAME) {
                localStorage.setItem('rw_api_username', API_USERNAME);
                console.log('RW: Saved username to localStorage:', API_USERNAME);
            }
            if (PDA_VALIDATED) {
                localStorage.setItem('rw_pda_validated', 'true');
                console.log('RW: PDA State Transition - Saved validated state to localStorage');
                console.log('RW: PDA State - Mode:', PDA_MODE, 'Validated:', PDA_VALIDATED, 'Username:', API_USERNAME);
            } else if (PDA_MODE) {
                // Clear the flag if PDA mode but not validated
                localStorage.removeItem('rw_pda_validated');
                console.log('RW: PDA State Transition - Cleared validation flag from localStorage');
            }
            // Save seller data
            localStorage.setItem('rw_seller_data', JSON.stringify(sellerData));
            console.log('RW: Saved seller data to localStorage');

            // Clear no-pricing info dismissal if pricing is now configured
            const hasApiValues = SETTINGS.showApiValues && apiPriceCache.data && Object.keys(apiPriceCache.data).length > 0;
            const hasCustomPrices = SETTINGS.showCustomPrices && sellerData.sellers.some(seller =>
                Object.values(seller.prices).some(price => price > 0)
            );
            if (hasApiValues || hasCustomPrices) {
                localStorage.removeItem('rw_no_pricing_info_dismissed');
            }
        }
    }

    // PDA reconnection logic - attempt to restore lost validation state
    async function attemptPdaReconnection() {
        if (!PDA_MODE) return;

        // If we have a username but no validation flag, try to reconnect
        if (API_USERNAME && !PDA_VALIDATED) {
            console.log('RW: PDA Reconnection - Attempting to restore validation for user:', API_USERNAME);
            try {
                const testResult = await testApiKey('');
                if (testResult.success && testResult.isPDA && testResult.name === API_USERNAME) {
                    console.log('RW: PDA Reconnection - Successfully restored validation');
                    PDA_VALIDATED = true;
                    saveSettings();
                } else {
                    console.log('RW: PDA Reconnection - Failed to restore validation');
                }
            } catch (error) {
                console.log('RW: PDA Reconnection - Error during reconnection attempt:', error);
            }
        }
    }

    // Initialize settings - LOAD FIRST BEFORE ANYTHING ELSE
    loadSettings();
    console.log('RW: Loaded settings - Active seller:', sellerData.activeSeller, 'Seller name:', sellerData.sellers[sellerData.activeSeller].name);

    // Attempt PDA reconnection if needed
    if (PDA_MODE && API_USERNAME && !PDA_VALIDATED) {
        console.log('RW: Detected potential PDA reconnection scenario');
        attemptPdaReconnection();
    }

    // Check if any custom prices are configured for the current seller
    function hasAnyCustomPricesConfigured() {
        const seller = sellerData.sellers[sellerData.activeSeller];
        const cacheTypes = ['armorCache', 'heavyArmsCache', 'mediumArmsCache', 'meleeCache', 'smallArmsCache'];

        // Check if any cache type has a non-zero price
        return cacheTypes.some(cacheType => {
            const price = seller.prices[cacheType] || 0;
            if (seller.pricingMode === 'relative') {
                // For relative pricing, any non-zero percentage counts
                return price !== 0;
            } else {
                // For fixed pricing, need actual price value
                return price > 0;
            }
        });
    }

    // Get current seller's custom price for an item
    function getCustomPrice(cacheType) {
        const seller = sellerData.sellers[sellerData.activeSeller];
        const priceValue = seller.prices[cacheType] || 0;

        if (priceValue === 0) return 0;

        // Handle relative pricing mode
        if (seller.pricingMode === 'relative') {
            // Calculate actual price from percentage of API price
            if (apiPriceCache.data && apiPriceCache.data[cacheType]) {
                const apiPrice = apiPriceCache.data[cacheType];
                const calculatedPrice = Math.round(apiPrice * (priceValue / 100));
                console.log(`RW: Relative pricing - ${cacheType}: ${priceValue}% of ${apiPrice} = ${calculatedPrice}`);
                return calculatedPrice;
            } else {
                // No API price available for calculation
                console.log(`RW: Relative pricing - ${cacheType}: No API price available for ${priceValue}%`);
                return 0;
            }
        } else {
            // Fixed pricing mode - return as-is
            return priceValue;
        }
    }

    // Check if API cache needs refreshing based on GMT timing
    function shouldRefreshApiCache() {
        if (!apiPriceCache.lastFetched) return true; // No cache

        const lastFetch = new Date(apiPriceCache.lastFetched);
        const now = new Date();

        // Convert both to UTC for GMT comparison
        const lastFetchUTC = new Date(lastFetch.getUTCFullYear(), lastFetch.getUTCMonth(), lastFetch.getUTCDate(), lastFetch.getUTCHours());
        const nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours());

        // Different dates = definitely refresh
        if (lastFetchUTC.getUTCDate() !== nowUTC.getUTCDate() ||
            lastFetchUTC.getUTCMonth() !== nowUTC.getUTCMonth() ||
            lastFetchUTC.getUTCFullYear() !== nowUTC.getUTCFullYear()) {
            return true;
        }

        // Same date: check 3am GMT rule
        const lastHour = lastFetchUTC.getUTCHours();
        const nowHour = nowUTC.getUTCHours();

        return (lastHour < 3 && nowHour >= 3); // Was before 3am GMT, now after
    }

    // Function to update API price cache
    async function updateApiPriceCache(forceRefresh = false) {
        const currentApiKey = getApiKey();

        if (!currentApiKey || currentApiKey === 'YOUR_API_KEY_HERE') return false;

        // Check if we need to refresh the cache (skip check if forced)
        if (!forceRefresh && !shouldRefreshApiCache()) {
            console.log('RW: Using cached API prices (still fresh)');
            return true; // We have fresh data
        }

        console.log('RW: Cache expired or missing, fetching fresh API prices...');

        try {
            const result = await fetchApiPrices();
            if (result.success) {
                // Store with timestamp
                apiPriceCache = {
                    lastFetched: new Date().toISOString(),
                    data: result.prices
                };

                // Save to localStorage for persistence across page refreshes
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem('rw_api_price_cache', JSON.stringify(apiPriceCache));
                    console.log('RW: Saved API price cache to localStorage');
                }

                console.log('RW: Updated API price cache:', apiPriceCache);
                return true;
            } else {
                console.warn('RW: Failed to fetch API prices:', result.error);
                return false;
            }
        } catch (error) {
            console.error('RW: Error updating API cache:', error);
            return false;
        }
    }

    // ========================================
    // API INTEGRATION & REQUESTS
    // ========================================

    // Handle API requests - works with both browser and PDA mobile app
    function makeApiRequest(url, options = {}) {
        return new Promise(async function(resolve) {
            const timeout = options.timeout || 10000;

            if (PDA_MODE && typeof window.PDA_httpGet === 'function') {
                if (DEBUG_MODE) console.log('RW: Using PDA API request for:', url);
                console.log('RW: Using PDA API request');
                try {
                    // Set up timeout for PDA requests
                    const timeoutId = setTimeout(function() {
                        console.error('RW: PDA API request timeout');
                        resolve({ success: false, error: 'PDA API request timed out. Please check your connection and try again.' });
                    }, timeout);

                    // PDA_httpGet returns a Promise, not a callback
                    const response = await window.PDA_httpGet(url);
                    clearTimeout(timeoutId);

                    console.log('RW: PDA API response received:', response);

                    try {
                        let data;
                        if (typeof response.responseText === 'string') {
                            data = JSON.parse(response.responseText);
                        } else if (typeof response.responseText === 'object' && response.responseText !== null) {
                            data = response.responseText;
                        } else {
                            console.error('RW: Unexpected PDA response format:', response);
                            resolve({ success: false, error: 'PDA API response format error. Please ensure your API key is connected to PDA.' });
                            return;
                        }

                        console.log('RW: PDA API parsed data:', data);
                        resolve({ success: true, data: data });
                    } catch (error) {
                        console.error('RW: PDA API response parse error:', error);
                        resolve({ success: false, error: 'PDA API response could not be parsed. Please check your PDA API connection.' });
                    }
                } catch (error) {
                    console.error('RW: PDA API request error:', error);
                    resolve({ success: false, error: 'PDA API request failed. Please ensure your API key is properly connected to PDA and try again.' });
                }
            } else {
                // Check if GM.xmlHttpRequest is available, otherwise use fetch
                if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function') {
                    if (DEBUG_MODE) console.log('RW: Using GM API request for:', url);
                    console.log('RW: Using GM API request');
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: url,
                        timeout: timeout,
                        onload: function(response) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve({ success: true, data: data });
                            } catch (error) {
                                resolve({ success: false, error: 'Invalid response from API' });
                            }
                        },
                        onerror: function() {
                            resolve({ success: false, error: 'Network error' });
                        },
                        ontimeout: function() {
                            resolve({ success: false, error: 'Request timed out' });
                        }
                    });
                } else {
                    // Fallback to fetch API
                    console.log('RW: GM not available, using fetch API');

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), timeout);

                    fetch(url, {
                        signal: controller.signal,
                        method: 'GET'
                    })
                    .then(response => {
                        clearTimeout(timeoutId);
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        resolve({ success: true, data: data });
                    })
                    .catch(error => {
                        clearTimeout(timeoutId);
                        if (error.name === 'AbortError') {
                            resolve({ success: false, error: 'Request timed out' });
                        } else {
                            resolve({ success: false, error: error.message || 'Network error' });
                        }
                    });
                }
            }
        });
    }

    // Get the appropriate API key for requests
    function getApiKey() {
        if (PDA_MODE && (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE')) {
            return '###PDA-APIKEY###'; // Direct placeholder for PDA replacement
        }
        return API_KEY;
    }

    async function testApiKey(apiKey) {
        return new Promise(async function(resolve) {
            // Handle PDA mode with empty API key
            if (PDA_MODE && (!apiKey || apiKey === 'YOUR_API_KEY_HERE')) {
                console.log('RW: Testing PDA API key');
                // Use the complete URL constant that PDA should have processed
                const url = PDA_USER_API_URL;
                if (DEBUG_MODE) console.log('RW: PDA API URL (key should be replaced):', url);

                try {
                    const result = await makeApiRequest(url, { timeout: 15000 });
                    console.log('RW: PDA API test result:', result);

                    if (result.success) {
                        if (result.data.error) {
                            console.log('RW: PDA API returned error:', result.data.error);
                            let errorMsg = result.data.error.error;
                            if (errorMsg.includes('Incorrect API key')) {
                                errorMsg = 'API key not connected to PDA. Please connect your API key in PDA settings first.';
                            }
                            resolve({ success: false, error: errorMsg });
                        } else {
                            console.log('RW: PDA API test successful:', result.data.name);
                            resolve({ success: true, name: result.data.name, isPDA: true });
                        }
                    } else {
                        console.log('RW: PDA API request failed:', result.error);
                        resolve({ success: false, error: 'PDA connection failed: ' + result.error });
                    }
                } catch (error) {
                    console.error('RW: PDA API test exception:', error);
                    resolve({ success: false, error: 'PDA API validation failed. Please ensure PDA is properly configured with your API key.' });
                }
                return;
            }

            // Standard API key validation
            if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
                resolve({ success: false, error: 'No API key provided' });
                return;
            }

            const url = 'https://api.torn.com/user/?selections=basic&key=' + apiKey;
            const result = await makeApiRequest(url, { timeout: 10000 });

            if (result.success) {
                if (result.data.error) {
                    resolve({ success: false, error: result.data.error.error });
                } else {
                    resolve({ success: true, name: result.data.name, isPDA: false });
                }
            } else {
                resolve({ success: false, error: result.error });
            }
        });
    }

    async function fetchApiPrices() {
        return new Promise(async function(resolve) {
            let currentApiKey;
            if (PDA_MODE && (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE')) {
                currentApiKey = '###PDA-APIKEY###'; // Direct placeholder for PDA
            } else {
                currentApiKey = API_KEY;
            }

            if (!currentApiKey || currentApiKey === 'YOUR_API_KEY_HERE') {
                resolve({ success: false, error: 'No API key configured' });
                return;
            }

            // Correct cache item IDs
            const cacheItems = {
                armorCache: '1118',       // Armor Cache
                meleeCache: '1119',       // Melee Cache
                smallArmsCache: '1120',   // Small Arms Cache
                mediumArmsCache: '1121',  // Medium Arms Cache
                heavyArmsCache: '1122'    // Heavy Arms Cache
            };

            const url = 'https://api.torn.com/torn/?selections=items&key=' + currentApiKey;
            const result = await makeApiRequest(url, { timeout: 15000 });

            if (result.success) {
                if (result.data.error) {
                    resolve({ success: false, error: result.data.error.error });
                } else {
                    const prices = {};
                    Object.keys(cacheItems).forEach(function(key) {
                        const itemId = cacheItems[key];
                        const item = result.data.items[itemId];
                        if (item && item.market_value) {
                            prices[key] = item.market_value;
                        }
                    });

                    console.log('RW: Cache prices from API:', prices);
                    resolve({ success: true, prices: prices });
                }
            } else {
                resolve({ success: false, error: result.error });
            }
        });
    }

    async function fetchPointValue() {
        return new Promise(async function(resolve) {
            let currentApiKey;
            if (PDA_MODE && (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE')) {
                currentApiKey = '###PDA-APIKEY###'; // Direct placeholder for PDA
            } else {
                currentApiKey = API_KEY;
            }

            if (!currentApiKey || currentApiKey === 'YOUR_API_KEY_HERE') {
                resolve(31300); // Default mock value
                return;
            }

            const url = 'https://api.torn.com/torn/?selections=pointsmarket&key=' + currentApiKey;
            const result = await makeApiRequest(url, { timeout: 10000 });

            if (result.success) {
                if (result.data.error) {
                    console.warn('RW: Could not fetch point value:', result.data.error.error);
                    resolve(31300); // Fallback
                } else {
                    const pointValue = result.data.pointsmarket ? result.data.pointsmarket.cost : 31300;
                    resolve(pointValue);
                }
            } else {
                console.warn('RW: Point value API error:', result.error);
                resolve(31300); // Fallback
            }
        });
    }

    function numberFormatter(num, digits) {
        digits = digits || 1;
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "B" },
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup
            .slice()
            .reverse()
            .find(function (item) {
                return num >= item.value;
            });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }

    // Helper function to extract user ID from seller name
    function extractUserInfo(sellerName) {
        const match = sellerName.match(/^(.+?)\s*\[(\d+)\]$/);
        if (match) {
            return {
                name: match[1].trim(),
                id: match[2],
                hasId: true
            };
        }
        return {
            name: sellerName.trim(),
            id: null,
            hasId: false
        };
    }

    // Helper function to create profile link
    function createProfileLink(userId, colors) {
        const link = document.createElement('a');
        link.href = 'https://www.torn.com/profiles.php?XID=' + userId;
        link.target = '_blank';
        link.style.cssText = 'margin-left: 4px; color: ' + colors.primary + '; text-decoration: none; font-size: 12px;';

        // Use HTML entity for mobile compatibility
        if (isMobile()) {
            link.innerHTML = '&#128279;';
        } else {
            link.innerHTML = '🔗';
        }

        link.title = 'View profile [' + userId + ']';
        return link;
    }

    // ========================================
    // MAIN UI CREATION & DISPLAY
    // ========================================

    // Add control buttons to the page header (run only once)
    function addIconsToTopHeader() {
        const colors = getThemeColors();

        // Find the "Ranked War # header
        const titleHeader = document.querySelector('.title-black.m-top10.top-round') ||
                           document.querySelector('.title-black') ||
                           document.querySelector('[class*="title"]');

        if (!titleHeader) {
            console.log("RWAwardValue: Could not find title header for icons");
            return;
        }

        // Check if we already added buttons to avoid duplicates
        if (titleHeader.querySelector('#rw-price-btn-header')) {
            console.log("RWAwardValue: Header buttons already exist, skipping");
            return;
        }

        console.log("RWAwardValue: Adding icons to top header");

        // Make the header a flex container with proper alignment
        titleHeader.style.display = 'flex';
        titleHeader.style.justifyContent = 'space-between';
        titleHeader.style.alignItems = 'center';
        titleHeader.style.paddingLeft = titleHeader.style.paddingLeft || '15px';
        titleHeader.style.paddingRight = '15px';
        titleHeader.style.boxSizing = 'border-box';

        // Create button container with proper vertical alignment
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; align-items: center; height: 100%; margin-left: auto;';

        // Price list button with text instead of icon
        const priceButton = document.createElement('button');
        priceButton.id = 'rw-price-btn-header';
        priceButton.textContent = 'Price List';
        priceButton.title = 'Manage Cache Prices';
        priceButton.style.cssText = 'background: transparent; color: rgba(255, 255, 255, 0.8); border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 1em; font-weight: normal; transition: color 0.2s ease; line-height: 1; min-height: 32px;';

        // Separator
        const separator = document.createElement('span');
        separator.textContent = ' | ';
        separator.style.cssText = 'color: rgba(255, 255, 255, 0.5); font-size: 1em; margin: 0 4px;';

        // Settings button with text instead of icon
        const settingsButton = document.createElement('button');
        settingsButton.id = 'rw-settings-btn-header';
        settingsButton.textContent = 'Settings';
        settingsButton.title = 'RW Script Settings';
        settingsButton.style.cssText = 'background: transparent; color: rgba(255, 255, 255, 0.8); border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer; font-size: 1em; font-weight: normal; transition: color 0.2s ease; line-height: 1; min-height: 32px;';

        // Add hover effects
        priceButton.addEventListener('mouseenter', function() {
            priceButton.style.color = 'rgba(255, 255, 255, 1)';
        });
        priceButton.addEventListener('mouseleave', function() {
            priceButton.style.color = 'rgba(255, 255, 255, 0.8)';
        });

        settingsButton.addEventListener('mouseenter', function() {
            settingsButton.style.color = 'rgba(255, 255, 255, 1)';
        });
        settingsButton.addEventListener('mouseleave', function() {
            settingsButton.style.color = 'rgba(255, 255, 255, 0.8)';
        });

        // Add event listeners for the actual panel functionality
        priceButton.addEventListener('click', function() {
            console.log('Header price management clicked');
            showPricePanel();
        });

        settingsButton.addEventListener('click', function() {
            console.log('Header settings clicked');
            showSettingsPanel();
        });

        buttonContainer.appendChild(priceButton);
        buttonContainer.appendChild(separator);
        buttonContainer.appendChild(settingsButton);
        titleHeader.appendChild(buttonContainer);
    }

    // Recalculate item.calculatedValue for all items without recreating the UI
    function recalculateRewardValues() {
        if (rawRewardData && rawRewardData.length === 2) {
            console.log("RWAwardValue: Recalculating values with current prices...");

            rawRewardData.forEach(function(rawReward, index) {
                let newTotalValue = 0;
                let apiTotalValue = 0;

                rawReward.items.forEach(function(item) {
                    let itemValue = 0;
                    let apiValue = 0;

                    if (item.type === 'cache') {
                        const customPrice = getCustomPrice(item.cacheType);
                        const hasCustomPrice = customPrice > 0;
                        const hasApiPrice = apiPriceCache.data && apiPriceCache.data[item.cacheType];
                        const hasValidApiKey = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') || PDA_VALIDATED;

                        let baseValue = 0;
                        if (SETTINGS.showCustomPrices && hasCustomPrice) {
                            baseValue = customPrice;
                        } else if (hasApiPrice && hasValidApiKey) {
                            baseValue = apiPriceCache.data[item.cacheType];
                        } else {
                            baseValue = 0;
                        }

                        itemValue = baseValue * item.quantity;

                        if (DEBUG_MODE) {
                            console.log(`RWAwardValue: ${item.cacheType} - custom: ${customPrice}, using: ${baseValue}, quantity: ${item.quantity}, total: ${itemValue}`);
                        }

                        if (SETTINGS.showApiValues && apiPriceCache.data[item.cacheType]) {
                            apiValue = apiPriceCache.data[item.cacheType] * item.quantity;
                            apiTotalValue += apiValue;
                        }

                        item.calculatedValue = itemValue;
                        item.calculatedApiValue = apiValue;
                    } else if (item.type === 'points') {
                        itemValue = item.pointValue * item.quantity;
                        apiValue = itemValue;
                        apiTotalValue += apiValue;

                        item.calculatedValue = itemValue;
                        item.calculatedApiValue = apiValue;
                    }

                    newTotalValue += itemValue;
                });

                rewardData[index].totalValue = newTotalValue;
                rewardData[index].apiTotalValue = apiTotalValue;
            });

            console.log("RWAwardValue: Recalculation complete");
        }
    }

    function refreshRewardDisplay() {
        // If we have stored raw data, recalculate with current seller prices AND API values
        if (rawRewardData && rawRewardData.length === 2) {
            if (DEBUG_MODE) console.log("RWAwardValue: Recalculating with stored data, current seller prices, and API values");
            console.log("RWAwardValue: Using seller:", sellerData.sellers[sellerData.activeSeller].name);
            console.log("RWAwardValue: API cache available:", Object.keys(apiPriceCache).length > 0);

            // Recalculate values
            recalculateRewardValues();
        }

        // Clear existing containers and recreate with updated data
        const existingContainer = document.getElementById('rw-panels-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Recreate with updated data (includes API values in headers)
        setTimeout(function() { createAndDisplayContainers(); }, 100);
    }

    function createAndDisplayContainers() {
        console.log("RWAwardValue: Creating containers...");
        if (rewardData.length !== 2) {
            console.error("RWAwardValue: Expected 2 rewards, got", rewardData.length);
            return;
        }

        // Check if containers already exist to prevent duplicates
        const existingContainer = document.getElementById('rw-panels-container');
        if (existingContainer) {
            console.log("RWAwardValue: Panels already exist, removing old ones first");
            existingContainer.remove();
        }

        const grandTotalValue = rewardData[0].totalValue + rewardData[1].totalValue;
        console.log("RWAwardValue: Grand total value:", grandTotalValue);

        // First, add icons to the top header
        addIconsToTopHeader();

        // Find the insertion point - target right after the war declaration section
        const reportTitle = document.querySelector('.report-title');
        const firstFactionText = document.querySelector('ul');
        let insertionPoint = null;
        let insertMethod = 'fallback';

        if (reportTitle && firstFactionText) {
            // Find the element that contains both the title and the faction descriptions
            const titleParent = reportTitle.parentElement;
            const factionParent = firstFactionText.parentElement;

            if (titleParent === factionParent) {
                // Same container - insert between them
                insertionPoint = titleParent;
                insertMethod = 'insertBefore';
                console.log("RWAwardValue: Will insert between title and faction descriptions");
            } else {
                // Different containers - insert after title
                insertionPoint = reportTitle;
                insertMethod = 'afterTitle';
                console.log("RWAwardValue: Will insert right after report title");
            }
        } else {
            // Fallback
            insertionPoint = reportTitle || document.body;
            insertMethod = 'fallback';
            console.log("RWAwardValue: Using fallback insertion");
        }

        // Create container for all our panels with proper spacing
        const panelContainer = document.createElement('div');
        panelContainer.id = 'rw-panels-container';
        panelContainer.style.cssText = 'margin: 15px 10px 20px 10px; padding: 0; display: block; visibility: visible; opacity: 1; position: relative; z-index: 1;';

        console.log("RWAwardValue: Created panel container with proper spacing");

        // Create top info bar with API cache display (left) and trader selector (right)
        // Show API cache timestamp when: (1) custom prices disabled (API is primary) OR (2) showing API comparison values
        const hasApiKey = API_KEY !== 'YOUR_API_KEY_HERE' || PDA_VALIDATED;
        const showApiCache = hasApiKey && (!SETTINGS.showCustomPrices || SETTINGS.showApiValues);
        const showTraderSelector = SETTINGS.showCustomPrices;

        if (showApiCache || showTraderSelector) {
            const mobile = isMobile();
            const topInfoBar = document.createElement('div');
            topInfoBar.style.display = 'flex';
            topInfoBar.style.flexDirection = 'row';
            topInfoBar.style.justifyContent = 'space-between';
            topInfoBar.style.alignItems = 'center';
            topInfoBar.style.marginBottom = '10px';
            topInfoBar.style.width = '100%';
            topInfoBar.style.gap = '10px';
            topInfoBar.style.flexWrap = mobile ? 'wrap' : 'nowrap';

            // Add API cache display on the left
            if (showApiCache) {
                const apiCacheDisplay = createApiCacheDisplay();
                if (apiCacheDisplay) {
                    topInfoBar.appendChild(apiCacheDisplay);
                }
            }

            // Add trader selector on the right
            if (showTraderSelector) {
                const traderSelector = createTraderSelector();
                if (traderSelector) {
                    topInfoBar.appendChild(traderSelector);
                }
            }

            panelContainer.appendChild(topInfoBar);
        }

        // Add info box if no pricing sources are configured
        if (shouldShowNoPricingInfo()) {
            const infoBox = createNoPricingInfoBox();
            panelContainer.appendChild(infoBox);
        }

        // Create individual reward containers
        for (let i = 0; i < 2; i++) {
            console.log("RWAwardValue: Creating container for reward", i);
            const container = createCompactContainer(
                rewardData[i].totalValue,
                i,
                grandTotalValue,
                rewardData[i].factionName,
                rewardData // Pass all faction data for ranking analysis
            );

            // Add click listener for expansion
            const header = container.querySelector('#rw-reward-' + i);
            header.addEventListener('click', function() { toggleExpansion(i); });

            // Populate details with updated item elements
            const details = container.querySelector('#rw-details-' + i);

            // Use the updated item elements that include API values
            if (rawRewardData && rawRewardData[i] && rawRewardData[i].items) {
                console.log('RWAwardValue: Building updated item elements for', rewardData[i].factionName);
                // Clear existing items
                details.innerHTML = '';

                // Pre-calculate colors and mobile flag to avoid unsafe references
                const detailColors = getThemeColors();
                const isMobileView = isMobile();

                // Create fresh item elements with current calculations
                rawRewardData[i].items.forEach(function(item) {
                        const itemDiv = document.createElement('div');
                        itemDiv.style.background = detailColors.statBoxBg;
                        itemDiv.style.padding = isMobileView ? '8px' : '10px';
                        itemDiv.style.borderRadius = '3px';
                        itemDiv.style.marginBottom = '6px';
                        itemDiv.style.borderLeft = '3px solid ' + detailColors.primary;
                        itemDiv.style.border = '1px solid ' + detailColors.statBoxBorder;
                        itemDiv.style.boxShadow = detailColors.statBoxShadow;
                        itemDiv.style.display = 'flex';
                        itemDiv.style.justifyContent = 'space-between';
                        itemDiv.style.alignItems = 'center';
                        itemDiv.style.fontSize = isMobileView ? '12px' : '13px';

                        const nameSpan = document.createElement('span');
                        nameSpan.style.color = detailColors.textSecondary;

                        // Create enhanced item name format
                        let itemName = '';
                        if (item.type === 'cache') {
                            // Use proper cache type names
                            let cacheTypeName = '';
                            switch(item.cacheType) {
                                case 'armorCache':
                                    cacheTypeName = 'Armor';
                                    break;
                                case 'heavyArmsCache':
                                    cacheTypeName = 'Heavy Arms';
                                    break;
                                case 'mediumArmsCache':
                                    cacheTypeName = 'Medium Arms';
                                    break;
                                case 'meleeCache':
                                    cacheTypeName = 'Melee';
                                    break;
                                case 'smallArmsCache':
                                    cacheTypeName = 'Small Arms';
                                    break;
                            }

                            if (isMobileView) {
                                // Mobile: Simplified layout without quantity breakdown
                                if (item.quantity === 1) {
                                    itemName = '1x ' + cacheTypeName + ' Cache';
                                } else {
                                    itemName = item.quantity + 'x ' + cacheTypeName + ' Cache';
                                }

                                // Add API comparison on second line if available
                                if (SETTINGS.showApiValues && item.calculatedApiValue > 0) {
                                    const apiValue = item.calculatedApiValue;
                                    const customValue = item.calculatedValue;
                                    const percentDiff = customValue > 0 ? ((customValue - apiValue) / apiValue * 100) : 0;

                                    if (Math.abs(percentDiff) > 0.1) {
                                        let arrow = '';
                                        let arrowColor = detailColors.textMuted;
                                        if (percentDiff > 0) {
                                            arrow = ' ' + getMobileArrow(true) + ' ';
                                            arrowColor = detailColors.success;
                                        } else {
                                            arrow = ' ' + getMobileArrow(false) + ' ';
                                            arrowColor = detailColors.danger;
                                        }
                                        itemName += '<br><span style="font-size: 11px; color: ' + detailColors.textMuted + ';"><span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(apiValue, 2) + '</span>';
                                    }
                                }
                            } else {
                                // Desktop: Single line layout (unchanged)
                                const individualPrice = item.calculatedValue / item.quantity;
                                if (item.quantity === 1) {
                                    if (individualPrice > 0 && !isNaN(individualPrice)) {
                                        itemName = '1x ' + cacheTypeName + ' Cache (' + formatNumberWithCommas(individualPrice) + ')';
                                    } else {
                                        itemName = '1x ' + cacheTypeName + ' Cache';
                                    }
                                } else {
                                    if (individualPrice > 0 && !isNaN(individualPrice)) {
                                        itemName = item.quantity + 'x ' + cacheTypeName + ' Cache (' + item.quantity + 'x ' + formatNumberWithCommas(individualPrice) + ')';
                                    } else {
                                        itemName = item.quantity + 'x ' + cacheTypeName + ' Cache';
                                    }
                                }
                            }
                        } else if (item.type === 'points') {
                            if (isMobileView) {
                                // Mobile: Keep points simple
                                itemName = item.quantity.toLocaleString() + ' points<br><span style="font-size: 11px; color: ' + detailColors.textMuted + ';">(' + (item.calculatedValue > 0 ? numberFormatter(item.calculatedValue) : '?') + ' total)</span>';
                            } else {
                                // Desktop: Single line
                                itemName = item.quantity.toLocaleString() + ' points (' + (item.calculatedValue > 0 ? numberFormatter(item.calculatedValue) : '?') + ' total)';
                            }
                        }
                        nameSpan.innerHTML = itemName; // Use innerHTML for mobile line breaks

                        const valueContainer = document.createElement('div');
                        valueContainer.style.display = 'flex';
                        valueContainer.style.alignItems = 'center';
                        valueContainer.style.gap = '8px';

                        // Add API comparison if enabled and available - DESKTOP ONLY (mobile has it inline)
                        if (!isMobileView && SETTINGS.showApiValues && item.calculatedApiValue > 0 && item.type === 'cache') {
                            const apiValue = item.calculatedApiValue;
                            const customValue = item.calculatedValue;
                            const percentDiff = customValue > 0 ? ((customValue - apiValue) / apiValue * 100) : 0;

                            console.log('RWAwardValue: Item', item.cacheType, '- Custom:', customValue, 'API:', apiValue, 'Diff:', percentDiff.toFixed(1) + '%');

                            if (Math.abs(percentDiff) > 0.1) {
                                // Create wrapper for name with API line below
                                const nameWrapper = document.createElement('div');
                                nameWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';

                                // Create main item name span
                                const mainNameSpan = document.createElement('span');
                                mainNameSpan.style.color = detailColors.textSecondary;
                                mainNameSpan.innerHTML = itemName;

                                // Create API comparison line with increased gap
                                const apiLine = document.createElement('div');
                                apiLine.style.cssText = 'margin-top: 4px; font-size: 11px; color: ' + detailColors.textMuted + '; font-weight: normal;';

                                let arrow = '';
                                let arrowColor = detailColors.textMuted;
                                if (percentDiff > 0) {
                                    arrow = ' ' + getMobileArrow(true) + ' ';
                                    arrowColor = detailColors.success;
                                } else {
                                    arrow = ' ' + getMobileArrow(false) + ' ';
                                    arrowColor = detailColors.danger;
                                }

                                apiLine.innerHTML = '<span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(apiValue, 2);

                                nameWrapper.appendChild(mainNameSpan);
                                nameWrapper.appendChild(apiLine);

                                // Adjust itemDiv to allow for multi-line content
                                itemDiv.style.alignItems = 'flex-start';
                                itemDiv.appendChild(nameWrapper);
                            } else {
                                // No significant API difference, use normal layout
                                nameSpan.innerHTML = itemName;
                                itemDiv.appendChild(nameSpan);
                            }
                        } else {
                            // No API comparison or mobile view, use normal layout
                            nameSpan.innerHTML = itemName;
                            itemDiv.appendChild(nameSpan);
                        }

                        const valueSpan = document.createElement('span');
                        valueSpan.style.color = detailColors.primary;
                        valueSpan.style.fontWeight = 'bold';
                        valueSpan.textContent = item.calculatedValue > 0 ? numberFormatter(item.calculatedValue, 2) : '?';

                        valueContainer.appendChild(valueSpan);

                        // Only add valueContainer if we haven't already added nameWrapper
                        if (!itemDiv.children.length) {
                            itemDiv.appendChild(nameSpan);
                        }
                        itemDiv.appendChild(valueContainer);
                        details.appendChild(itemDiv);
                });
            } else {
                // Fallback to original method
                rewardData[i].itemElements.forEach(function(element) {
                    details.appendChild(element);
                });
            }

            panelContainer.appendChild(container);
            rewardData[i].container = container;
            console.log("RWAwardValue: Container", i, "added to panel container");
        }

        // Add grand total to panel container
        const grandTotalContainer = createGrandTotalContainer(grandTotalValue);
        panelContainer.appendChild(grandTotalContainer);

        // Add cache split link if enabled
        if (SETTINGS.showCacheSplit) {
            const cacheSplitLink = createCacheSplitLink();
            panelContainer.appendChild(cacheSplitLink);
        }

        // Insert the panel container using the appropriate method
        if (insertMethod === 'insertBefore' && firstFactionText) {
            // Insert before faction descriptions
            insertionPoint.insertBefore(panelContainer, firstFactionText);
            console.log("RWAwardValue: Panels inserted before faction descriptions");
        } else if (insertMethod === 'afterTitle' && reportTitle) {
            // Insert immediately after report title
            insertionPoint.insertAdjacentElement('afterend', panelContainer);
            console.log("RWAwardValue: Panels inserted immediately after report title");
        } else {
            // Fallback - insert after title or at top
            insertionPoint.insertAdjacentElement('afterend', panelContainer);
            console.log("RWAwardValue: Panels inserted at fallback position");
        }

        console.log("RWAwardValue: All panels inserted at top position");

        // Debug: Check if panels are actually in the DOM
        setTimeout(function() {
            const insertedContainer = document.getElementById('rw-panels-container');
            if (insertedContainer) {
                console.log("RWAwardValue: Panel container found in DOM");
                console.log("RWAwardValue: Container has", insertedContainer.children.length, "children");
                console.log("RWAwardValue: Container computed style:", getComputedStyle(insertedContainer).display);

                // Force visibility if needed
                insertedContainer.style.display = 'block';
                insertedContainer.style.visibility = 'visible';

                // Check individual panels
                for (let i = 0; i < insertedContainer.children.length; i++) {
                    const child = insertedContainer.children[i];
                    const computedDisplay = getComputedStyle(child).display;
                    console.log("RWAwardValue: Child", i, "display:", computedDisplay);
                    // Preserve flex displays, only force block on non-flex elements
                    if (computedDisplay !== 'flex' && computedDisplay !== 'inline-flex') {
                        child.style.display = 'block';
                    }
                    child.style.visibility = 'visible';
                }
            } else {
                console.error("RWAwardValue: Panel container NOT found in DOM!");
                // Try fallback placement
                console.log("RWAwardValue: Attempting fallback placement...");
                const fallbackTarget = document.querySelector('.report-title');
                if (fallbackTarget) {
                    fallbackTarget.parentElement.appendChild(panelContainer);
                    console.log("RWAwardValue: Fallback placement completed");
                }
            }
        }, 100);

        console.log("RWAwardValue: Script completed successfully!");

        // Initialize API cache in these cases - ONLY ONCE, NOT IN REFRESH:
        // 1. If showing API values
        // 2. If custom prices enabled but not configured (fallback to API prices)
        const needsApiPrices = SETTINGS.showApiValues || (SETTINGS.showCustomPrices && !hasAnyCustomPricesConfigured());
        const hasValidApiKey = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') || (PDA_MODE && PDA_VALIDATED);

        if (needsApiPrices && hasValidApiKey && !window.rwApiInitialized) {
            const reason = SETTINGS.showApiValues ? 'API values enabled' : 'Custom prices enabled but not configured';
            console.log(`RW: Initializing API price cache on startup (${reason})...`);
            window.rwApiInitialized = true; // Prevent multiple initializations
            updateApiPriceCache().then(function(success) {
                if (success) {
                    console.log('RW: Startup API fetch successful - refreshing display to integrate API values');
                    // We need a full refresh to integrate API values properly into the calculations
                    refreshRewardDisplay();
                } else {
                    console.log('RW: Startup API fetch failed');
                }
            });
        }

        console.log("RWAwardValue: Script completed successfully!");
    }

    // Panel Management Functions - Convert to slide-down panels (same as my gym script)
    function showPricePanel() {
        const colors = getThemeColors();
        const mobile = isMobile();

        // Close any existing panel
        const existingPanel = document.getElementById('rw-price-panel');
        if (existingPanel) {
            existingPanel.remove();
            return; // Toggle off
        }

        // Close settings panel if open
        const settingsPanel = document.getElementById('rw-settings-panel');
        if (settingsPanel) settingsPanel.remove();

        // Find the title header to attach panel after
        const titleHeader = document.querySelector('.title-black.m-top10.top-round') ||
                           document.querySelector('.title-black') ||
                           document.querySelector('[class*="title"]');
        if (!titleHeader) return;

        // Create slide-down panel
        const panel = document.createElement('div');
        panel.id = 'rw-price-panel';
        panel.style.cssText = 'background: ' + colors.configBg + '; border: none; border-radius: 0; padding: 15px; margin: 0; color: ' + colors.textPrimary + '; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 8px rgba(0,0,0,0.15); position: relative; overflow: hidden; max-height: 0; transition: max-height 0.3s ease, padding 0.3s ease;';

        // Animate in
        setTimeout(function() {
            panel.style.maxHeight = '600px'; // Increased from 500px to accommodate confirmations
        }, 10);

        // Create header
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid ' + colors.configBorder + ';';

        const title = document.createElement('h4');
        title.textContent = 'Price Configuration';
        title.style.cssText = 'margin: 0; color: ' + colors.textPrimary + '; font-size: 18px;';

        const closeBtn = document.createElement('button');
        // Use HTML entity for mobile compatibility
        if (isMobile()) {
            closeBtn.innerHTML = '&#10006;';
        } else {
            closeBtn.textContent = '✕';
        }
        closeBtn.style.cssText = 'background: none; border: none; font-size: 20px; color: ' + colors.textSecondary + '; cursor: pointer; padding: 5px; border-radius: 3px;';
        closeBtn.onclick = function() {
            panel.style.maxHeight = '0';
            panel.style.padding = '0 15px';
            setTimeout(function() {
                panel.remove();
                // Refresh values when panel closes
                refreshRewardDisplay();
            }, 300);
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create seller section
        const sellerSection = document.createElement('div');
        sellerSection.style.marginBottom = '20px';

        const sellerLabel = document.createElement('label');
        sellerLabel.textContent = 'Active Trader:';
        sellerLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: bold; color: ' + colors.textPrimary + ';';

        const sellerContainer = document.createElement('div');
        sellerContainer.style.cssText = 'display: flex; gap: 10px; align-items: center; margin-bottom: 10px;';

        // Create last modified date display
        const lastModifiedDiv = document.createElement('div');
        lastModifiedDiv.style.cssText = 'font-size: 12px; color: ' + colors.textMuted + '; margin-bottom: 15px;';

        function formatLastModified(dateString) {
            if (!dateString) return 'Last modified: Unknown';

            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const formattedDate = date.getDate() + ' ' + months[date.getMonth()];

            if (diffDays === 1) {
                return 'Last modified: ' + formattedDate + ' (today)';
            } else if (diffDays === 2) {
                return 'Last modified: ' + formattedDate + ' (yesterday)';
            } else {
                return 'Last modified: ' + formattedDate + ' (' + (diffDays - 1) + ' days ago)';
            }
        }

        const currentSeller = sellerData.sellers[sellerData.activeSeller];
        lastModifiedDiv.textContent = formatLastModified(currentSeller.lastModified);

        const sellerSelect = document.createElement('select');
        sellerSelect.style.cssText = 'background: ' + colors.inputBg + '; border: 1px solid ' + colors.inputBorder + '; color: ' + colors.textPrimary + '; padding: 8px; border-radius: 4px; flex: 1;';

        sellerData.sellers.forEach(function(seller, index) {
            const option = document.createElement('option');
            option.value = index;
            const userInfo = extractUserInfo(seller.name);
            option.textContent = userInfo.name + (userInfo.hasId ? ' [' + userInfo.id + ']' : '');
            option.selected = index === sellerData.activeSeller;
            sellerSelect.appendChild(option);
        });

        const editSellerBtn = document.createElement('button');
        editSellerBtn.textContent = 'Edit Name';
        editSellerBtn.style.cssText = 'background: ' + colors.primary + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;';

        // Add seller name input field (initially hidden)
        const nameInputContainer = document.createElement('div');
        nameInputContainer.style.cssText = 'display: none; margin-top: 10px;';

        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Trader Name (e.g. "John Doe [123456]"):';
        nameLabel.style.cssText = 'display: block; margin-bottom: 5px; color: ' + colors.textSecondary + '; font-size: 12px;';

        const nameInputRow = document.createElement('div');
        nameInputRow.style.cssText = 'display: flex; gap: 8px; align-items: center; flex-wrap: ' + (mobile ? 'wrap' : 'nowrap') + ';';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter seller name with optional [ID]';
        nameInput.style.cssText = 'background: ' + colors.inputBg + '; border: 1px solid ' + colors.inputBorder + '; color: ' + colors.textPrimary + '; padding: 8px; border-radius: 4px; flex: 1; ' + (mobile ? 'width: 100%; margin-bottom: 8px;' : '');

        const saveNameBtn = document.createElement('button');
        saveNameBtn.textContent = 'Save';
        saveNameBtn.style.cssText = 'background: ' + colors.success + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; ' + (mobile ? 'flex: 1;' : '');

        const cancelNameBtn = document.createElement('button');
        cancelNameBtn.textContent = 'Cancel';
        cancelNameBtn.style.cssText = 'background: ' + colors.danger + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; ' + (mobile ? 'flex: 1;' : '');

        nameInputContainer.appendChild(nameLabel);
        if (mobile) {
            nameInputRow.appendChild(nameInput);
            nameInputRow.appendChild(document.createElement('div')); // Line break
            const buttonRow = document.createElement('div');
            buttonRow.style.cssText = 'display: flex; gap: 8px; width: 100%;';
            buttonRow.appendChild(saveNameBtn);
            buttonRow.appendChild(cancelNameBtn);
            nameInputContainer.appendChild(nameInputRow);
            nameInputContainer.appendChild(buttonRow);
        } else {
            nameInputRow.appendChild(nameInput);
            nameInputRow.appendChild(saveNameBtn);
            nameInputRow.appendChild(cancelNameBtn);
            nameInputContainer.appendChild(nameInputRow);
        }

        sellerContainer.appendChild(sellerSelect);
        sellerContainer.appendChild(editSellerBtn);
        sellerSection.appendChild(sellerLabel);
        sellerSection.appendChild(sellerContainer);
        sellerSection.appendChild(lastModifiedDiv);
        sellerSection.appendChild(nameInputContainer);

        // Add CSS for placeholder styling
        const styleId = 'rw-placeholder-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .rw-relative-input::placeholder {
                    color: #999 !important;
                    opacity: 1 !important;
                    font-style: italic !important;
                }
                .rw-relative-input::-webkit-input-placeholder {
                    color: #999 !important;
                    opacity: 1 !important;
                    font-style: italic !important;
                }
                .rw-relative-input::-moz-placeholder {
                    color: #999 !important;
                    opacity: 1 !important;
                    font-style: italic !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Create pricing mode toggle
        const pricingModeSection = document.createElement('div');
        pricingModeSection.style.cssText = 'margin-bottom: 20px;';

        const pricingModeLabel = document.createElement('label');
        pricingModeLabel.textContent = 'Pricing Mode:';
        pricingModeLabel.style.cssText = 'display: block; margin-bottom: 8px; font-weight: bold; color: ' + colors.textPrimary + ';';

        // Create horizontal toggle
        const toggleContainer = document.createElement('div');
        const toggleBg = currentTheme === 'light' ? '#e8e8e8' : colors.inputBg;
        toggleContainer.style.cssText = `
            display: flex;
            background: ${toggleBg};
            border: 1px solid ${colors.inputBorder};
            border-radius: 6px;
            overflow: hidden;
            width: 100%;
        `;

        const isRelativeMode = currentSeller.pricingMode === 'relative';

        // Fixed prices option
        const fixedOption = document.createElement('div');
        fixedOption.style.cssText = `
            flex: 1;
            padding: 9px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            background: ${!isRelativeMode ? colors.primary : 'transparent'};
            color: ${!isRelativeMode ? 'white' : colors.textPrimary};
            font-weight: ${!isRelativeMode ? 'bold' : 'normal'};
        `;
        fixedOption.textContent = 'Fixed Prices';

        // Relative prices option
        const relativeOption = document.createElement('div');
        relativeOption.style.cssText = `
            flex: 1;
            padding: 9px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            background: ${isRelativeMode ? colors.primary : 'transparent'};
            color: ${isRelativeMode ? 'white' : colors.textPrimary};
            font-weight: ${isRelativeMode ? 'bold' : 'normal'};
        `;
        relativeOption.textContent = 'Relative Prices';

        toggleContainer.appendChild(fixedOption);
        toggleContainer.appendChild(relativeOption);
        pricingModeSection.appendChild(pricingModeLabel);
        pricingModeSection.appendChild(toggleContainer);

        // Function to update toggle styles
        function updateToggleStyles() {
            const activeSeller = sellerData.sellers[sellerData.activeSeller];
            const isRelative = activeSeller.pricingMode === 'relative';

            if (DEBUG_MODE) console.log('RW: Updating toggle for seller', sellerData.activeSeller, 'mode:', activeSeller.pricingMode);

            fixedOption.style.background = !isRelative ? colors.primary : 'transparent';
            fixedOption.style.color = !isRelative ? 'white' : colors.textPrimary;
            fixedOption.style.fontWeight = !isRelative ? 'bold' : 'normal';

            relativeOption.style.background = isRelative ? colors.primary : 'transparent';
            relativeOption.style.color = isRelative ? 'white' : colors.textPrimary;
            relativeOption.style.fontWeight = isRelative ? 'bold' : 'normal';
        }

        // Click handlers for toggle
        fixedOption.addEventListener('click', function() {
            const currentSeller = sellerData.sellers[sellerData.activeSeller];
            if (currentSeller.pricingMode !== 'fixed') {
                // Clear prices when switching modes to prevent confusion
                cacheTypes.forEach(function(cache) {
                    currentSeller.prices[cache.key] = 0;
                });
                currentSeller.pricingMode = 'fixed';
                updateToggleStyles();
                updateInputDisplayMode();
                saveSettings();
            }
        });

        relativeOption.addEventListener('click', function() {
            const currentSeller = sellerData.sellers[sellerData.activeSeller];
            if (currentSeller.pricingMode !== 'relative') {
                // Clear prices when switching modes to prevent confusion
                cacheTypes.forEach(function(cache) {
                    currentSeller.prices[cache.key] = 0;
                });
                currentSeller.pricingMode = 'relative';
                updateToggleStyles();
                updateInputDisplayMode();
                saveSettings();
            }
        });

        // Create price inputs
        const pricesSection = document.createElement('div');
        pricesSection.style.marginBottom = '20px';

        const cacheTypes = [
            { key: 'armorCache', label: 'Armor Cache' },
            { key: 'heavyArmsCache', label: 'Heavy Arms' },
            { key: 'mediumArmsCache', label: 'Medium Arms' },
            { key: 'meleeCache', label: 'Melee Cache' },
            { key: 'smallArmsCache', label: 'Small Arms' }
        ];

        const priceInputs = {};

        // Function to update input display mode
        function updateInputDisplayMode() {
            const activeSeller = sellerData.sellers[sellerData.activeSeller];
            const isRelative = activeSeller.pricingMode === 'relative';

            if (DEBUG_MODE) console.log('RW: Updating input mode for seller', sellerData.activeSeller, 'mode:', activeSeller.pricingMode);

            cacheTypes.forEach(function(cache, index) {
                const input = priceInputs[cache.key];
                if (input) {
                    if (isRelative) {
                        // Convert to percentage display (add % suffix, show as percentage)
                        const value = activeSeller.prices[cache.key];
                        input.value = value > 0 ? value + '%' : '%';
                        input.style.textAlign = 'center';
                        // Add placeholder only to first field (Armor Cache) and CSS class
                        if (index === 0) {
                            input.placeholder = 'e.g. 95';
                            input.classList.add('rw-relative-input');
                        } else {
                            input.placeholder = '';
                            input.classList.add('rw-relative-input');
                        }
                    } else {
                        // Convert to fixed price display (remove % suffix, format as currency)
                        const value = activeSeller.prices[cache.key];
                        input.value = value > 0 ? formatNumberWithCommas(value) : '';
                        input.style.textAlign = 'center';
                        input.placeholder = '';
                        input.classList.remove('rw-relative-input');
                    }
                }
            });
        }

        cacheTypes.forEach(function(cache) {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;';

            const label = document.createElement('label');
            label.textContent = cache.label + ':';
            label.style.cssText = 'color: ' + colors.textPrimary + '; width: 35%;';

            const input = document.createElement('input');
            input.type = 'text';
            input.style.cssText = 'background: ' + colors.inputBg + '; border: 1px solid ' + colors.inputBorder + '; color: ' + colors.textPrimary + '; padding: 8px; border-radius: 4px; width: 60%; text-align: center;';

            // Set initial value based on pricing mode
            const currentSeller = sellerData.sellers[sellerData.activeSeller];
            const isRelative = currentSeller.pricingMode === 'relative';
            if (isRelative) {
                const value = currentSeller.prices[cache.key];
                input.value = value > 0 ? value + '%' : '%';
                input.style.textAlign = 'center';
                // Add placeholder only to first field (Armor Cache) and CSS class
                input.placeholder = cache.key === 'armorCache' ? 'e.g. 95' : '';
                input.classList.add('rw-relative-input');
            } else {
                input.value = formatNumberWithCommas(currentSeller.prices[cache.key]);
                input.style.textAlign = 'center';
                input.placeholder = '';
            }

            // Dynamic input formatting based on pricing mode
            input.addEventListener('input', function() {
                const currentSeller = sellerData.sellers[sellerData.activeSeller];
                const isRelative = currentSeller.pricingMode === 'relative';

                if (isRelative) {
                    // Handle percentage input with permanent % symbol
                    let value = input.value.replace(/[^0-9.]/g, ''); // Extract only numbers and decimals
                    if (value) {
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                            // Cap at 999% to prevent 4-digit percentages
                            const cappedValue = Math.min(numValue, 999);
                            input.value = cappedValue + '%';
                        }
                    } else {
                        // Always maintain % symbol even when empty
                        input.value = '%';
                    }
                } else {
                    // Handle fixed price input with comma formatting
                    const cursorPosition = input.selectionStart;
                    const oldValue = input.value;
                    const numericValue = input.value.replace(/[^0-9]/g, '');
                    const formattedValue = numericValue ? formatNumberWithCommas(parseInt(numericValue)) : '';

                    if (formattedValue !== oldValue) {
                        input.value = formattedValue;
                        // Adjust cursor position after formatting
                        const newCursorPosition = cursorPosition + (formattedValue.length - oldValue.length);
                        input.setSelectionRange(newCursorPosition, newCursorPosition);
                    }
                }
            });

            priceInputs[cache.key] = input;

            row.appendChild(label);
            row.appendChild(input);
            pricesSection.appendChild(row);
        });

        // Create button section
        const buttonSection = document.createElement('div');
        buttonSection.style.cssText = 'display: flex; gap: 10px; margin-top: 20px; padding-top: 15px; border-top: 1px solid ' + colors.configBorder + ';';

        // Create confirmation section for Clear All Sellers (initially hidden)
        const clearConfirmationSection = document.createElement('div');
        clearConfirmationSection.id = 'clear-confirmation';
        clearConfirmationSection.style.cssText = 'display: none; margin-top: 15px; padding: 15px; background: ' + colors.panelBg + '; border: 1px solid ' + colors.danger + '; border-radius: 4px;';

        const clearConfirmText = document.createElement('div');
        clearConfirmText.textContent = 'Reset all traders to default? This will clear all custom trader names and prices.';
        clearConfirmText.style.cssText = 'color: ' + colors.textPrimary + '; margin-bottom: 10px; font-size: 14px;';

        const clearConfirmButtons = document.createElement('div');
        clearConfirmButtons.style.cssText = 'display: flex; gap: 10px;';

        const clearConfirmYes = document.createElement('button');
        clearConfirmYes.textContent = 'Yes, Reset All';
        clearConfirmYes.style.cssText = 'background: ' + colors.danger + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;';

        const clearConfirmNo = document.createElement('button');
        clearConfirmNo.textContent = 'Cancel';
        clearConfirmNo.style.cssText = 'background: ' + colors.textSecondary + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;';

        clearConfirmButtons.appendChild(clearConfirmYes);
        clearConfirmButtons.appendChild(clearConfirmNo);
        clearConfirmationSection.appendChild(clearConfirmText);
        clearConfirmationSection.appendChild(clearConfirmButtons);

        // Create confirmation section for Delete Seller (initially hidden)
        const deleteConfirmationSection = document.createElement('div');
        deleteConfirmationSection.id = 'delete-confirmation';
        deleteConfirmationSection.style.cssText = 'display: none; margin-top: 15px; padding: 15px; background: ' + colors.panelBg + '; border: 1px solid ' + colors.danger + '; border-radius: 4px;';

        const deleteConfirmText = document.createElement('div');
        deleteConfirmText.textContent = 'Delete this trader configuration? This will reset name and set prices to zero.';
        deleteConfirmText.style.cssText = 'color: ' + colors.textPrimary + '; margin-bottom: 10px; font-size: 14px;';

        const deleteConfirmButtons = document.createElement('div');
        deleteConfirmButtons.style.cssText = 'display: flex; gap: 10px;';

        const deleteConfirmYes = document.createElement('button');
        deleteConfirmYes.textContent = mobile ? 'Delete Trader' : 'Yes, Delete Trader';
        deleteConfirmYes.style.cssText = 'background: ' + colors.danger + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1; font-size: ' + (mobile ? '11px' : '12px') + ';';

        const deleteConfirmNo = document.createElement('button');
        deleteConfirmNo.textContent = 'Cancel';
        deleteConfirmNo.style.cssText = 'background: ' + colors.textSecondary + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; flex: 1;';

        deleteConfirmButtons.appendChild(deleteConfirmYes);
        deleteConfirmButtons.appendChild(deleteConfirmNo);
        deleteConfirmationSection.appendChild(deleteConfirmText);
        deleteConfirmationSection.appendChild(deleteConfirmButtons);

        const copyFromApiBtn = document.createElement('button');
        copyFromApiBtn.textContent = mobile ? 'Copy API' : 'Copy from API';
        copyFromApiBtn.style.cssText = 'background: #454545; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; flex: 1; font-size: ' + (mobile ? '11px' : '12px') + ';';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = mobile ? 'Delete' : 'Delete Trader';
        deleteBtn.style.cssText = 'background: ' + colors.danger + '; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; flex: 1; font-size: ' + (mobile ? '11px' : '12px') + ';';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = 'background: ' + colors.success + '; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; flex: 1; font-size: ' + (mobile ? '11px' : '12px') + ';';

        const clearSellersBtn = document.createElement('button');
        clearSellersBtn.textContent = mobile ? 'Clear All' : 'Clear All Traders';
        clearSellersBtn.style.cssText = 'background: ' + colors.danger + '; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; flex: 1; font-size: ' + (mobile ? '11px' : '12px') + ';';

        buttonSection.appendChild(copyFromApiBtn);
        buttonSection.appendChild(clearSellersBtn);
        buttonSection.appendChild(deleteBtn);
        buttonSection.appendChild(saveBtn);

        // Event handlers
        let editMode = false; // Track if we're editing or adding new

        // Function to show name input
        function showNameInput(isEdit, currentName) {
            editMode = isEdit;
            nameInput.value = currentName || '';
            nameInputContainer.style.display = 'block';
            nameLabel.textContent = isEdit ?
                'Edit Trader Name e.g. \'John Doe [123456]\'' :
                'New Trader Name e.g. \'John Doe [123456]\'';
            nameInput.focus();
        }

        // Function to hide name input
        function hideNameInput() {
            nameInputContainer.style.display = 'none';
            nameInput.value = '';
        }

        // Edit seller button
        editSellerBtn.addEventListener('click', function() {
            const currentSeller = sellerData.sellers[sellerData.activeSeller];
            showNameInput(true, currentSeller.name);
        });

        // Save name button
        saveNameBtn.addEventListener('click', function() {
            const name = nameInput.value.trim();
            if (!name) {
                alert('Please enter a trader name');
                return;
            }

            const userInfo = extractUserInfo(name);

            if (editMode) {
                // Edit existing seller
                sellerData.sellers[sellerData.activeSeller].name = name;

                // Update dropdown option
                const option = sellerSelect.options[sellerData.activeSeller];
                option.textContent = userInfo.name + (userInfo.hasId ? ' [' + userInfo.id + ']' : '');
            } else {
                // Add new seller
                sellerData.sellers.push({
                    name: name,
                    pricingMode: "fixed",
                    prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 }
                });

                // Add to dropdown
                const option = document.createElement('option');
                option.value = sellerData.sellers.length - 1;
                option.textContent = userInfo.name + (userInfo.hasId ? ' [' + userInfo.id + ']' : '');
                sellerSelect.appendChild(option);

                // Select new seller
                sellerSelect.value = sellerData.sellers.length - 1;
                sellerData.activeSeller = sellerData.sellers.length - 1;

                // Update price inputs
                cacheTypes.forEach(function(cache) {
                    priceInputs[cache.key].value = '0';
                });
            }

            // Save seller changes
            saveSettings();
            hideNameInput();
        });

        // Cancel name button
        cancelNameBtn.addEventListener('click', function() {
            hideNameInput();
        });

        // Allow Enter key to save
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveNameBtn.click();
            }
        });

        sellerSelect.onchange = function() {
            sellerData.activeSeller = parseInt(sellerSelect.value);

            // Update toggle styles and input display mode
            updateToggleStyles();
            updateInputDisplayMode();

            // Update last modified date display
            const newSeller = sellerData.sellers[sellerData.activeSeller];
            lastModifiedDiv.textContent = formatLastModified(newSeller.lastModified);
            // Hide name input if open
            hideNameInput();
            // Save the active seller change
            saveSettings();
            // Just update the seller display - values will refresh when panel closes
            updateSellerDisplay();
        };

        // Function to update just the seller name in the combined total
        function updateSellerDisplay() {
            const combinedTotalContainers = document.querySelectorAll('#rw-panels-container');
            combinedTotalContainers.forEach(function(container) {
                // Find seller spans and update them
                const sellerSpans = container.querySelectorAll('span[style*="margin-left: 16px"]');
                sellerSpans.forEach(function(span) {
                    if (span.textContent.includes('Trader:')) {
                        const currentSeller = sellerData.sellers[sellerData.activeSeller];
                        const userInfo = extractUserInfo(currentSeller.name);

                        // Clear existing content
                        span.innerHTML = '';
                        span.textContent = 'Trader: ' + userInfo.name;

                        // Re-add profile link if exists
                        if (userInfo.hasId) {
                            const colors = getThemeColors();
                            const profileLink = createProfileLink(userInfo.id, colors);
                            span.appendChild(profileLink);
                        }
                    }
                });
            });
        }

        saveBtn.onclick = function() {
            console.log('RW: Save button clicked');

            // Save current prices and track if any changed
            let pricesChanged = false;
            const currentSeller = sellerData.sellers[sellerData.activeSeller];
            const isRelative = currentSeller.pricingMode === 'relative';

            cacheTypes.forEach(function(cache) {
                const oldPrice = currentSeller.prices[cache.key];
                let newPrice = 0;

                if (isRelative) {
                    // Parse percentage value (remove % and parse as decimal)
                    const percentValue = priceInputs[cache.key].value.replace('%', '').trim();
                    newPrice = percentValue ? parseFloat(percentValue) : 0;
                } else {
                    // Parse fixed price value (remove commas)
                    newPrice = parseCommaNumber(priceInputs[cache.key].value);
                }

                currentSeller.prices[cache.key] = newPrice;

                if (oldPrice !== newPrice) {
                    if (DEBUG_MODE) console.log('RW: Price changed for', cache.key, 'from', oldPrice, 'to', newPrice, 'mode:', currentSeller.pricingMode);
                    pricesChanged = true;
                }
            });

            // Update last modified date if any prices changed
            if (pricesChanged) {
                sellerData.sellers[sellerData.activeSeller].lastModified = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            }

            // Save seller data to localStorage
            saveSettings();

            if (DEBUG_MODE) {
                console.log('RW: Saved new prices for', sellerData.sellers[sellerData.activeSeller].name);
                console.log('RW: New prices:', sellerData.sellers[sellerData.activeSeller].prices);
            }

            // Close panel and use full refresh (reliable)
            panel.style.maxHeight = '0';
            panel.style.padding = '0 15px';
            setTimeout(function() {
                panel.remove();
                console.log('RW: Price panel closed, using full refresh for reliability');
                refreshRewardDisplay();
            }, 300);
        };

        copyFromApiBtn.onclick = async function() {
            copyFromApiBtn.textContent = 'Loading...';
            copyFromApiBtn.disabled = true;

            const result = await fetchApiPrices();

            if (result.success) {
                // Update the price inputs with API values
                Object.keys(result.prices).forEach(function(cacheType) {
                    const price = result.prices[cacheType];
                    if (priceInputs[cacheType]) {
                        priceInputs[cacheType].value = formatNumberWithCommas(price);
                    }
                });

                copyFromApiBtn.textContent = 'Copied!';
                copyFromApiBtn.style.background = colors.success;

                setTimeout(function() {
                    copyFromApiBtn.textContent = mobile ? 'Copy API' : 'Copy from API';
                    copyFromApiBtn.style.background = '#454545';
                    copyFromApiBtn.disabled = false;
                }, 2000);
            } else {
                alert('Failed to fetch API prices: ' + result.error);
                copyFromApiBtn.textContent = mobile ? 'Copy API' : 'Copy from API';
                copyFromApiBtn.disabled = false;
            }
        };

        clearSellersBtn.onclick = function() {
            // Hide delete confirmation if shown
            deleteConfirmationSection.style.display = 'none';
            deleteBtn.disabled = false;
            deleteBtn.style.opacity = '1';

            // Show clear confirmation section
            clearConfirmationSection.style.display = 'block';
            clearSellersBtn.disabled = true;
            clearSellersBtn.style.opacity = '0.5';
        };

        deleteBtn.onclick = function() {
            // Hide clear confirmation if shown
            clearConfirmationSection.style.display = 'none';
            clearSellersBtn.disabled = false;
            clearSellersBtn.style.opacity = '1';

            // Show delete confirmation section
            deleteConfirmationSection.style.display = 'block';
            deleteBtn.disabled = true;
            deleteBtn.style.opacity = '0.5';
        };

        // Clear All Sellers confirmation handlers
        clearConfirmYes.onclick = function() {
            // Reset to default sellers
            sellerData = {
                activeSeller: 0,
                sellers: [
                    { name: "Trader 1", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
                    { name: "Trader 2", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } },
                    { name: "Trader 3", prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 } }
                ]
            };

            // Save to localStorage
            saveSettings();

            // Refresh the panel by closing and reopening it
            panel.style.maxHeight = '0';
            panel.style.padding = '0 15px';
            setTimeout(function() {
                panel.remove();
                // Reopen the panel to show reset sellers
                setTimeout(function() {
                    showPricePanel();
                }, 100);
            }, 300);
        };

        clearConfirmNo.onclick = function() {
            // Hide confirmation section
            clearConfirmationSection.style.display = 'none';
            clearSellersBtn.disabled = false;
            clearSellersBtn.style.opacity = '1';
        };

        // Delete Seller confirmation handlers
        deleteConfirmYes.onclick = function() {
            const currentIndex = sellerData.activeSeller;

            // Determine the default name for this slot
            const defaultNames = ["Trader 1", "Trader 2", "Trader 3", "Trader 4", "Trader 5", "Trader 6", "Trader 7", "Trader 8", "Trader 9", "Trader 10"];
            const defaultName = defaultNames[currentIndex] || "Seller " + (currentIndex + 1);

            // Reset seller to default state
            sellerData.sellers[currentIndex] = {
                name: defaultName,
                prices: { armorCache: 0, heavyArmsCache: 0, mediumArmsCache: 0, meleeCache: 0, smallArmsCache: 0 }
            };

            // Update the dropdown option
            const option = sellerSelect.options[currentIndex];
            option.textContent = defaultName;

            // Update price inputs to show zeros
            cacheTypes.forEach(function(cache) {
                priceInputs[cache.key].value = '0';
            });

            // Save the changes
            saveSettings();

            // Hide confirmation
            deleteConfirmationSection.style.display = 'none';
            deleteBtn.disabled = false;
            deleteBtn.style.opacity = '1';
        };

        deleteConfirmNo.onclick = function() {
            // Hide confirmation section
            deleteConfirmationSection.style.display = 'none';
            deleteBtn.disabled = false;
            deleteBtn.style.opacity = '1';
        };

        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(sellerSection);
        panel.appendChild(pricingModeSection);
        panel.appendChild(pricesSection);
        panel.appendChild(buttonSection);
        panel.appendChild(clearConfirmationSection);
        panel.appendChild(deleteConfirmationSection);

        // Insert after the title header
        titleHeader.insertAdjacentElement('afterend', panel);
    }

    // ========================================
    // CONFIGURATION PANELS
    // ========================================

    function showSettingsPanel() {
        const colors = getThemeColors();
        const mobile = isMobile();

        // Close any existing panel
        const existingPanel = document.getElementById('rw-settings-panel');
        if (existingPanel) {
            existingPanel.remove();
            return; // Toggle off
        }

        // Close price panel if open
        const pricePanel = document.getElementById('rw-price-panel');
        if (pricePanel) pricePanel.remove();

        // Find the title header to attach panel after
        const titleHeader = document.querySelector('.title-black.m-top10.top-round') ||
                           document.querySelector('.title-black') ||
                           document.querySelector('[class*="title"]');
        if (!titleHeader) return;

        // Create slide-down panel
        const panel = document.createElement('div');
        panel.id = 'rw-settings-panel';
        panel.style.cssText = 'background: ' + colors.configBg + '; border: none; border-radius: 0; padding: 15px; margin: 0; color: ' + colors.textPrimary + '; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 8px rgba(0,0,0,0.15); position: relative; overflow: hidden; max-height: 0; transition: max-height 0.3s ease, padding 0.3s ease;';

        // Animate in - increase height for PDA mode to accommodate extra info box
        setTimeout(function() {
            panel.style.maxHeight = PDA_MODE ? '550px' : '500px';
        }, 10);

        // Create header
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid ' + colors.configBorder + ';';

        const title = document.createElement('h3');
        title.textContent = 'Settings';
        title.style.cssText = 'margin: 0; color: ' + colors.textPrimary + '; font-size: 18px;';

        const closeBtn = document.createElement('button');
        // Use HTML entity for mobile compatibility
        if (isMobile()) {
            closeBtn.innerHTML = '&#10006;';
        } else {
            closeBtn.textContent = '✕';
        }
        closeBtn.style.cssText = 'background: none; border: none; font-size: 20px; color: ' + colors.textSecondary + '; cursor: pointer; padding: 5px; border-radius: 3px;';
        closeBtn.onclick = function() {
            panel.style.maxHeight = '0';
            panel.style.padding = '0 15px';
            setTimeout(function() {
                panel.remove();
                // Refresh the display to update info box visibility based on new settings
                refreshRewardDisplay();
            }, 300);
        };

        header.appendChild(title);
        header.appendChild(closeBtn);

        // API Configuration Section
        const apiSection = document.createElement('div');
        apiSection.style.marginBottom = '25px';

        const apiTitle = document.createElement('h4');
        apiTitle.textContent = 'API Configuration';
        apiTitle.style.cssText = 'margin: 0 0 15px 0; color: ' + colors.textPrimary + '; font-size: 16px;';

        apiSection.appendChild(apiTitle);

        const keyContainer = document.createElement('div');
        keyContainer.style.cssText = mobile ?
            'display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;' :
            'display: flex; gap: 8px; align-items: center; margin-bottom: 10px;';

        const keyLabel = document.createElement('label');
        keyLabel.textContent = 'Public API Key:';
        keyLabel.style.cssText = 'color: ' + colors.textPrimary + '; ' + (mobile ? 'margin-bottom: 5px;' : 'width: 100px;');

        const inputRow = document.createElement('div');
        inputRow.style.cssText = 'display: flex; gap: 8px; align-items: center;' + (mobile ? ' flex-wrap: wrap; margin-bottom: 0;' : '');

        const keyInput = document.createElement('input');
        keyInput.type = 'password';
        keyInput.value = API_KEY !== 'YOUR_API_KEY_HERE' ? API_KEY : '';
        keyInput.placeholder = 'Enter your Torn API key';
        // Disable browser autocomplete/autofill to prevent login suggestions
        // Note: These attributes only prevent browser behaviour such as autofill
        keyInput.autocomplete = 'new-password'; // More effective than 'off' on mobile browsers
        keyInput.spellcheck = false;
        keyInput.setAttribute('data-form-type', 'other'); // Additional hint this isn't a login form
        keyInput.style.cssText = 'background: ' + colors.inputBg + '; border: 1px solid ' + colors.inputBorder + '; color: ' + colors.textPrimary + '; padding: 8px; border-radius: 4px; ' + (mobile ? 'width: 100%; margin-bottom: 0;' : 'flex: 1;');

        const buttonRow = document.createElement('div');
        buttonRow.style.cssText = mobile ?
            'display: flex; gap: 6px; width: 100%; flex-wrap: wrap;' :
            'display: flex; gap: 8px;';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        const editBtnColor = currentTheme === 'light' ? '#999999' : colors.textSecondary;
        editBtn.style.cssText = 'background: ' + editBtnColor + ' !important; color: white !important; border: none !important; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; ' + (mobile ? 'flex: 1; min-width: 0;' : '');

        const testBtn = document.createElement('button');
        testBtn.textContent = 'Validate';
        testBtn.style.cssText = 'background: ' + colors.primary + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; ' + (mobile ? 'flex: 1; min-width: 0;' : '');

        const resetApiBtn = document.createElement('button');
        resetApiBtn.textContent = 'Reset';
        resetApiBtn.style.cssText = 'background: ' + colors.danger + '; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; ' + (mobile ? 'flex: 1; min-width: 0;' : '');
        resetApiBtn.title = 'Clear API key and cache';

        // Create status div first
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'margin-left: ' + (mobile ? '0px' : '110px') + '; font-size: 12px; color: ' + colors.textMuted + '; ' + (mobile ? 'text-align: left; margin-top: 4px; margin-bottom: 12px;' : '');
        const statusPrefix = mobile ? 'Status: ' : 'Status: ';

        // Use HTML entities for mobile compatibility
        const checkmark = mobile ? '&#9989;' : '✅';
        const cross = mobile ? '&#10060;' : '❌';

        // Improved status logic for better PDA handling
        let isConfigured = false;
        let statusMessage = '';

        if (API_KEY !== 'YOUR_API_KEY_HERE') {
            // Manual API key configured
            isConfigured = true;
            statusMessage = 'Valid - Welcome ' + (API_USERNAME || 'User');
        } else if (PDA_MODE && PDA_VALIDATED) {
            // PDA mode with validation - don't require API_USERNAME to show as valid
            isConfigured = true;
            statusMessage = 'Valid - Welcome ' + (API_USERNAME || 'PDA User') + ' (PDA)';
        } else if (PDA_MODE && API_USERNAME) {
            // PDA mode with username but no validation flag - could be a recovery case
            isConfigured = true;
            statusMessage = 'Valid - Welcome ' + API_USERNAME + ' (PDA - reconnected)';
            console.log('RW: PDA reconnection detected - username exists but validation flag missing');
            // Restore validation flag
            PDA_VALIDATED = true;
            saveSettings();
        }

        const validationSuccessColor = currentTheme === 'light' ? '#69a829' : colors.success;
        statusDiv.innerHTML = isConfigured ?
            statusPrefix + '<span style="color: ' + validationSuccessColor + ';">' + checkmark + ' ' + statusMessage + '</span>' :
            statusPrefix + '<span style="color: ' + colors.danger + ';">' + cross + ' Not configured</span>';

        if (mobile) {
            keyContainer.appendChild(keyLabel);
            inputRow.appendChild(keyInput);
            keyContainer.appendChild(inputRow);
            keyContainer.appendChild(statusDiv); // Status div positioned between input and buttons on mobile
            buttonRow.appendChild(editBtn);
            buttonRow.appendChild(testBtn);
            buttonRow.appendChild(resetApiBtn);
            keyContainer.appendChild(buttonRow);
        } else {
            inputRow.appendChild(keyLabel);
            inputRow.appendChild(keyInput);
            inputRow.appendChild(editBtn);
            inputRow.appendChild(testBtn);
            inputRow.appendChild(resetApiBtn);
            keyContainer.appendChild(inputRow);
        }

        // Create last retrieved info (moved up from API values section)
        const lastRetrievedDiv = document.createElement('div');
        lastRetrievedDiv.style.cssText = mobile ?
            'margin-left: 0px; margin-top: 8px; font-size: 11px; color: ' + colors.textMuted + ';' :
            'margin-left: 110px; margin-top: 4px; font-size: 11px; color: ' + colors.textMuted + ';';

        function getLastRetrievedText() {
            if (!apiPriceCache.lastFetched) return 'Last retrieved: Never';

            const lastFetched = new Date(apiPriceCache.lastFetched);
            const now = new Date();
            const diffMs = now - lastFetched;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            const timeString = lastFetched.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            if (diffDays === 0) {
                return 'Last retrieved: Today at ' + timeString;
            } else if (diffDays === 1) {
                return 'Last retrieved: Yesterday at ' + timeString;
            } else {
                const day = lastFetched.getDate();
                const month = lastFetched.toLocaleString('en-US', { month: 'short' });
                return 'Last retrieved: ' + day + ' ' + month + ' at ' + timeString;
            }
        }

        function updateLastRetrievedDisplay() {
            const uniqueId = 'refresh-api-link-' + Date.now(); // Unique ID to avoid conflicts
            lastRetrievedDiv.innerHTML = getLastRetrievedText() +
                (apiPriceCache.lastFetched ?
                    ' <span id="' + uniqueId + '" style="color: ' + colors.primary + '; cursor: pointer; text-decoration: underline;">Refresh</span>' :
                    '');

            // Add event listener for refresh link if it exists
            const refreshLink = document.getElementById(uniqueId);
            if (refreshLink) {
                refreshLink.addEventListener('click', function() {
                    console.log('RW: Manual API refresh requested');
                    refreshLink.textContent = 'Loading...';
                    refreshLink.style.cursor = 'wait';

                    updateApiPriceCache(true).then(function(success) { // Force refresh for manual clicks
                        if (success) {
                            console.log('RW: Manual API refresh successful');
                            updateLastRetrievedDisplay();
                            refreshRewardDisplay();
                        } else {
                            console.log('RW: Manual API refresh failed');
                            refreshLink.textContent = 'Failed';
                            setTimeout(function() {
                                updateLastRetrievedDisplay();
                            }, 2000);
                        }
                    });
                });
            } else {
                console.log('RW: Refresh link not found with ID:', uniqueId);
            }
        }

        apiSection.appendChild(apiTitle);
        apiSection.appendChild(keyContainer);
        if (!mobile) {
            apiSection.appendChild(statusDiv); // Status div positioned after keyContainer on desktop
            apiSection.appendChild(lastRetrievedDiv); // Last retrieved positioned after status on desktop
        } else {
            // On mobile, add last retrieved inside keyContainer after all other elements
            keyContainer.appendChild(lastRetrievedDiv);
        }

        // Update the display after the element is in the DOM with a small delay
        setTimeout(function() {
            updateLastRetrievedDisplay();
        }, 10);

        // Add PDA-specific instruction if detected - MOVED TO AFTER OTHER ELEMENTS
        if (PDA_MODE) {
            const pdaInfo = document.createElement('div');
            pdaInfo.style.cssText = 'margin-top: 15px; margin-bottom: 12px; padding: 8px 12px; background: ' + colors.statBoxBg + '; border: 1px solid ' + colors.primary + '; border-radius: 4px; font-size: 11px; color: ' + colors.textPrimary + ';';
            pdaInfo.innerHTML = '<strong>Torn PDA detected:</strong> If you\'ve already connected your API key to PDA, just click validate.';
            apiSection.appendChild(pdaInfo);
        }

        // Other Settings Section
        const otherSection = document.createElement('div');
        otherSection.style.marginBottom = '20px';

        const otherTitle = document.createElement('h4');
        otherTitle.textContent = 'Other Settings';
        otherTitle.style.cssText = 'margin: 0 0 15px 0; color: ' + colors.textPrimary + '; font-size: 16px;';

        // Custom Prices section
        const customPricesSection = document.createElement('div');
        customPricesSection.style.cssText = 'margin-bottom: 15px;';

        const showCustomPricesCheck = document.createElement('div');
        showCustomPricesCheck.style.cssText = 'display: flex; align-items: center; margin-bottom: 2px;';

        const customPricesCheckbox = document.createElement('input');
        customPricesCheckbox.type = 'checkbox';
        customPricesCheckbox.checked = SETTINGS.showCustomPrices;
        const customPricesCheckboxStyle = 'margin-right: 8px;' + (currentTheme === 'dark' ? ' accent-color: #74c0fc;' : '');
        customPricesCheckbox.style.cssText = customPricesCheckboxStyle;

        const customPricesLabel = document.createElement('label');
        customPricesLabel.textContent = 'Show custom prices';
        customPricesLabel.style.color = colors.textPrimary;
        customPricesLabel.style.cursor = 'pointer';

        // Make label clickable to toggle checkbox
        customPricesLabel.addEventListener('click', function() {
            customPricesCheckbox.checked = !customPricesCheckbox.checked;
            // Trigger the change event to ensure all logic runs
            customPricesCheckbox.dispatchEvent(new Event('change'));
        });

        // Handle checkbox change
        customPricesCheckbox.addEventListener('change', function() {
            SETTINGS.showCustomPrices = this.checked;
            saveSettings();
            // Update the "Show API alongside" checkbox state immediately
            const customPricesEnabled = this.checked;
            showCheckbox.disabled = !customPricesEnabled;
            showLabel.style.color = customPricesEnabled ? colors.textPrimary : colors.textMuted;
            showLabel.style.cursor = customPricesEnabled ? 'pointer' : 'not-allowed';

            // If disabling custom prices, also disable the API alongside option
            if (!customPricesEnabled) {
                SETTINGS.showApiValues = false;
                showCheckbox.checked = false;
                saveSettings();
            }

            // Refresh display to apply custom price changes immediately
            refreshRewardDisplay();
        });

        showCustomPricesCheck.appendChild(customPricesCheckbox);
        showCustomPricesCheck.appendChild(customPricesLabel);
        customPricesSection.appendChild(showCustomPricesCheck);

        // API Values section with combined checkbox and last retrieved
        const apiValuesSection = document.createElement('div');
        apiValuesSection.style.cssText = 'margin-bottom: 15px;';

        const showApiCheck = document.createElement('div');
        showApiCheck.style.cssText = 'display: flex; align-items: center; margin-bottom: 2px;';

        const showCheckbox = document.createElement('input');
        showCheckbox.type = 'checkbox';
        showCheckbox.checked = SETTINGS.showApiValues;
        // Only disable if custom prices are not enabled
        const customPricesDisabled = !SETTINGS.showCustomPrices;
        showCheckbox.disabled = customPricesDisabled;

        const checkboxStyle = 'margin-right: 8px;' + (currentTheme === 'dark' ? ' accent-color: #74c0fc;' : '');
        showCheckbox.style.cssText = checkboxStyle;

        const showLabel = document.createElement('label');
        showLabel.textContent = 'Show API market values alongside custom prices';

        // Grey out if disabled for any reason
        showLabel.style.color = showCheckbox.disabled ? colors.textMuted : colors.textPrimary;
        showLabel.style.cursor = showCheckbox.disabled ? 'not-allowed' : 'pointer';

        // Make label clickable to toggle checkbox
        showLabel.addEventListener('click', function() {
            if (!showCheckbox.disabled) {
                showCheckbox.checked = !showCheckbox.checked;
            }
        });

        // Note: API key input no longer affects the "Show API alongside" checkbox
        // That checkbox is now only controlled by the "Show custom prices" setting

        // Update display when checkbox changes
        showCheckbox.addEventListener('change', function() {
            SETTINGS.showApiValues = this.checked;
            saveSettings();
        });

        showApiCheck.appendChild(showCheckbox);
        showApiCheck.appendChild(showLabel);

        // Assemble API values section
        apiValuesSection.appendChild(showApiCheck);

        otherSection.appendChild(otherTitle);
        otherSection.appendChild(customPricesSection);
        otherSection.appendChild(apiValuesSection);

        // Indirect rewards section
        const showIndirectCheck = document.createElement('div');
        showIndirectCheck.style.cssText = 'display: flex; align-items: center; margin-bottom: 15px;';

        const indirectCheckbox = document.createElement('input');
        indirectCheckbox.type = 'checkbox';
        indirectCheckbox.checked = SETTINGS.showIndirectRewards;
        const indirectCheckboxStyle = 'margin-right: 8px;' + (currentTheme === 'dark' ? ' accent-color: #74c0fc;' : '');
        indirectCheckbox.style.cssText = indirectCheckboxStyle;

        const indirectLabel = document.createElement('label');
        indirectLabel.textContent = mobile ? 'Show other rewards incl points and respect' : 'Show other rewards including points and respect';
        indirectLabel.style.color = colors.textPrimary;
        indirectLabel.style.cursor = 'pointer';

        // Make label clickable to toggle checkbox
        indirectLabel.addEventListener('click', function() {
            indirectCheckbox.checked = !indirectCheckbox.checked;
        });

        showIndirectCheck.appendChild(indirectCheckbox);
        showIndirectCheck.appendChild(indirectLabel);

        // Respect value input section
        const respectValueSection = document.createElement('div');
        respectValueSection.style.cssText = mobile ?
            'display: flex; gap: 8px; align-items: center; margin-bottom: 15px; padding-left: 26px;' :
            'display: flex; gap: 8px; align-items: center; margin-bottom: 15px;';

        const respectLabel = document.createElement('label');
        respectLabel.textContent = 'Value per respect:';
        respectLabel.style.cssText = 'color: ' + colors.textPrimary + '; ' + (mobile ? 'width: 100px; white-space: nowrap;' : 'width: 100px;');

        const respectInputRow = document.createElement('div');
        respectInputRow.style.cssText = 'display: flex; gap: 8px; align-items: center;' + (mobile ? ' flex-wrap: wrap; margin-bottom: 0;' : '');

        const respectInput = document.createElement('input');
        respectInput.type = 'text';
        respectInput.value = formatNumberWithCommas(SETTINGS.respectValue);
        respectInput.placeholder = '20,000';
        respectInput.style.cssText = 'background: ' + colors.inputBg + '; border: 1px solid ' + colors.inputBorder + '; color: ' + colors.textPrimary + '; padding: 8px; border-radius: 4px; text-align: right; ' + (mobile ? 'width: 100px;' : 'width: 120px;');

        // Add real-time comma formatting for respect input
        respectInput.addEventListener('input', function() {
            const cursorPosition = respectInput.selectionStart;
            const oldValue = respectInput.value;
            const numericValue = respectInput.value.replace(/[^0-9]/g, '');
            const formattedValue = numericValue ? formatNumberWithCommas(parseInt(numericValue)) : '';

            if (formattedValue !== oldValue) {
                respectInput.value = formattedValue;
                // Adjust cursor position after formatting
                const newCursorPosition = cursorPosition + (formattedValue.length - oldValue.length);
                respectInput.setSelectionRange(newCursorPosition, newCursorPosition);
            }
        });

        respectInputRow.appendChild(respectInput);

        if (mobile) {
            respectValueSection.appendChild(respectLabel);
            respectValueSection.appendChild(respectInputRow);
        } else {
            respectValueSection.appendChild(respectLabel);
            respectValueSection.appendChild(respectInputRow);
        }

        // Cache Split function section
        const showCacheSplitCheck = document.createElement('div');
        showCacheSplitCheck.style.cssText = 'display: flex; align-items: center; margin-bottom: 15px;';

        const cacheSplitCheckbox = document.createElement('input');
        cacheSplitCheckbox.type = 'checkbox';
        cacheSplitCheckbox.checked = SETTINGS.showCacheSplit;
        const cacheSplitCheckboxStyle = 'margin-right: 8px;' + (currentTheme === 'dark' ? ' accent-color: #74c0fc;' : '');
        cacheSplitCheckbox.style.cssText = cacheSplitCheckboxStyle;

        const cacheSplitLabel = document.createElement('label');
        cacheSplitLabel.textContent = 'Show Cache Split function';
        cacheSplitLabel.style.color = colors.textPrimary;
        cacheSplitLabel.style.cursor = 'pointer';

        // Make label clickable to toggle checkbox
        cacheSplitLabel.addEventListener('click', function() {
            cacheSplitCheckbox.checked = !cacheSplitCheckbox.checked;
        });

        showCacheSplitCheck.appendChild(cacheSplitCheckbox);
        showCacheSplitCheck.appendChild(cacheSplitLabel);

        otherSection.appendChild(showIndirectCheck);
        otherSection.appendChild(showCacheSplitCheck);
        otherSection.appendChild(respectValueSection);

        // Save button
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        const saveBtnColor = currentTheme === 'light' ? '#69a829' : colors.success;
        saveBtn.style.cssText = 'background: ' + saveBtnColor + ' !important; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; width: 100%; margin-top: ' + (mobile ? '8px' : '15px') + '; border-top: 1px solid ' + colors.configBorder + '; padding-top: ' + (mobile ? '8px' : '15px') + ';';

        // Event handlers
        editBtn.onclick = function() {
            keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
            editBtn.textContent = keyInput.type === 'password' ? 'Edit' : 'Hide';
        };

        testBtn.onclick = async function() {
            // Allow validation with empty field if in PDA mode
            if (!keyInput.value.trim() && !PDA_MODE) {
                alert('Please enter an API key first.');
                return;
            }

            testBtn.textContent = 'Testing...';
            testBtn.disabled = true;

            try {
                const result = await testApiKey(keyInput.value.trim());

                if (result.success) {
                    const checkmark = mobile ? '&#9989;' : '✅';
                    const pdaIndicator = result.isPDA ? ' (PDA)' : '';
                    const dynamicValidationColor = currentTheme === 'light' ? '#69a829' : colors.success;
                    statusDiv.innerHTML = 'Status: <span style="color: ' + dynamicValidationColor + ';">' + checkmark + ' Valid - Welcome ' + result.name + pdaIndicator + '</span>';
                    testBtn.textContent = 'Valid!';
                    testBtn.style.background = colors.success;

                // Store the validated username
                API_USERNAME = result.name;

                // If this was a PDA validation, set PDA validated flag
                if (result.isPDA) {
                    console.log('RW: PDA State Transition - API validation successful for:', result.name);
                    PDA_VALIDATED = true;
                    console.log('RW: PDA State - Mode:', PDA_MODE, 'Validated:', PDA_VALIDATED, 'Username:', API_USERNAME);
                } else {
                    // Store manual API key for non-PDA validation
                    console.log('RW: Manual API validation successful for:', result.name);
                    API_KEY = keyInput.value.trim();
                    PDA_VALIDATED = false;
                    console.log('RW: Manual API State - Key saved, PDA_VALIDATED set to false');
                }

                // FIXED: Save to localStorage immediately - EXPLICIT save
                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem('rw_api_username', API_USERNAME);
                    if (PDA_VALIDATED) {
                        localStorage.setItem('rw_pda_validated', 'true');
                    }
                    console.log('RW: EXPLICIT save of username to localStorage:', API_USERNAME);
                }

                // Immediately fetch API prices after successful validation
                console.log('RW: API validation successful - fetching prices immediately...');
                updateApiPriceCache().then(function(success) {
                    if (success) {
                        console.log('RW: API prices fetched successfully during validation');
                        updateLastRetrievedDisplay();
                    } else {
                        console.log('RW: Failed to fetch API prices during validation');
                    }
                });

                saveSettings();
            } else {
                const cross = mobile ? '&#10060;' : '❌';
                statusDiv.innerHTML = 'Status: <span style="color: ' + colors.danger + ';">' + cross + ' Error: ' + result.error + '</span>';
                testBtn.textContent = 'Error';
                testBtn.style.background = colors.danger;
            }
            } catch (error) {
                console.error('RW: API validation exception:', error);
                const cross = mobile ? '&#10060;' : '❌';
                statusDiv.innerHTML = 'Status: <span style="color: ' + colors.danger + ';">' + cross + ' Validation failed - please try again</span>';
                testBtn.textContent = 'Failed';
                testBtn.style.background = colors.danger;
            } finally {
                // Always reset button after 3 seconds
                setTimeout(function() {
                    testBtn.textContent = 'Validate';
                    testBtn.style.background = colors.primary;
                    testBtn.disabled = false;
                }, 3000);
            }
        };

        resetApiBtn.onclick = function() {
            // Clear API key
            API_KEY = 'YOUR_API_KEY_HERE';
            keyInput.value = '';

            // Clear API cache
            apiPriceCache = {
                lastFetched: null,
                data: {}
            };

            // Clear stored username and PDA validation
            API_USERNAME = '';
            PDA_VALIDATED = false;

            // Disable show API values
            SETTINGS.showApiValues = false;
            showCheckbox.checked = false;
            showCheckbox.disabled = true;
            showLabel.style.color = colors.textMuted;
            showLabel.style.cursor = 'not-allowed';

            // Update status
            const cross = mobile ? '&#10060;' : '❌';
            statusDiv.innerHTML = 'Status: <span style="color: ' + colors.danger + ';">' + cross + ' Not configured</span>';

            // Save settings
            saveSettings();

            // Clear from localStorage
            if (typeof(Storage) !== "undefined") {
                localStorage.removeItem('rw_api_key');
                localStorage.removeItem('rw_api_username');
                localStorage.removeItem('rw_pda_validated');
            }

            resetApiBtn.textContent = 'Cleared!';
            resetApiBtn.style.background = colors.success;

            setTimeout(function() {
                resetApiBtn.textContent = 'Reset';
                resetApiBtn.style.background = colors.danger;
            }, 2000);

            // Refresh display to remove API values
            setTimeout(function() {
                refreshRewardDisplay();
            }, 500);
        };

        saveBtn.onclick = function() {
            try {
                // Store previous settings to detect changes
                const previousApiKey = API_KEY;
                const previousShowApiValues = SETTINGS.showApiValues;
                const previousShowIndirectRewards = SETTINGS.showIndirectRewards;
                const previousRespectValue = SETTINGS.respectValue;
                const previousShowCacheSplit = SETTINGS.showCacheSplit;

                // Save API key and username
                if (keyInput.value.trim() && !PDA_MODE) {
                    // Manual API key for non-PDA users
                    API_KEY = keyInput.value.trim();
                    console.log('RW: Saved manual API key');
                } else if (PDA_MODE && PDA_VALIDATED) {
                    // For PDA users, ensure we maintain the validated state
                    console.log('RW: Maintaining PDA validated state');
                }

                // Store username and validation state if we have it
                if (API_USERNAME) {
                    console.log('RW: Saving username and validation state:', API_USERNAME, 'PDA_VALIDATED:', PDA_VALIDATED);
                    saveSettings(); // This will save the username and PDA validation state
                }

                // Save settings
                SETTINGS.showApiValues = showCheckbox.checked;
                SETTINGS.showIndirectRewards = indirectCheckbox.checked;
                SETTINGS.respectValue = parseCommaNumber(respectInput.value);
                SETTINGS.showCacheSplit = cacheSplitCheckbox.checked;

                saveSettings();

                // Enhanced debugging logs for API updates
                console.log('RW: Settings saved - API key changed:', (previousApiKey !== API_KEY));
                console.log('RW: API update check - showApiValues:', SETTINGS.showApiValues, 'hasValidKey:', (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE'), 'PDA_VALIDATED:', PDA_VALIDATED);

                // Handle API-related updates - include PDA validation
                const apiKeyChanged = previousApiKey !== API_KEY;
                const hasValidApiKey = ((API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') || (PDA_MODE && PDA_VALIDATED));
                const needsApiUpdate = hasValidApiKey;

                console.log('RW: needsApiUpdate:', needsApiUpdate, 'apiKeyChanged:', apiKeyChanged, 'hasValidApiKey:', hasValidApiKey);

                if (needsApiUpdate && apiKeyChanged) {
                    console.log('RW: API key available and show API enabled - fetching prices...');
                    updateApiPriceCache().then(function(success) {
                        if (success) {
                            console.log('RW: API prices fetched successfully, refreshing display');
                            refreshRewardDisplay();
                        } else {
                            console.log('RW: API fetch failed, display unchanged');
                        }
                    });
                } else if (!SETTINGS.showApiValues && previousShowApiValues) {
                    console.log('RW: Show API disabled, refreshing display to remove API values');
                    refreshRewardDisplay();
                }

                // Handle indirect rewards setting changes
                const indirectRewardsChanged = (SETTINGS.showIndirectRewards !== previousShowIndirectRewards);
                const respectValueChanged = (SETTINGS.respectValue !== previousRespectValue);

                if (indirectRewardsChanged || respectValueChanged) {
                    console.log('RW: Indirect rewards settings changed, refreshing display');
                    refreshRewardDisplay();
                }

                // Handle cache split setting changes (need to refresh to show/hide link)
                if (SETTINGS.showCacheSplit !== previousShowCacheSplit) {
                    console.log('RW: Cache split setting changed, refreshing display');
                    refreshRewardDisplay();
                }

                console.log('RW: Settings saved successfully');

                // Close panel
                panel.style.maxHeight = '0';
                panel.style.padding = '0 15px';
                setTimeout(function() { panel.remove(); }, 300);

                // Refresh the reward display to update info box visibility and prices
                console.log('RW: Refreshing display after settings panel close');
                refreshRewardDisplay();

            } catch (error) {
                console.error('RW: Error saving settings:', error);
                alert('Error saving settings: ' + error.message);
            }
        };

        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(apiSection);
        panel.appendChild(otherSection);
        panel.appendChild(saveBtn);

        // Insert after the title header
        titleHeader.insertAdjacentElement('afterend', panel);
    }

    // Create trader selector dropdown
    function createTraderSelector() {
        const colors = getThemeColors();
        const mobile = isMobile();

        // Filter to only show custom trader names (not default "Trader X")
        const customTraders = sellerData.sellers
            .map((seller, index) => ({ ...seller, index }))
            .filter(seller => !seller.name.match(/^Trader \d+$/));

        const container = document.createElement('div');
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.fontSize = '11px';
        container.style.gap = '6px';

        if (customTraders.length > 0) {
            // Create dropdown with custom traders
            const label = document.createElement('span');
            label.textContent = 'Selected Trader:';
            label.style.cssText = `color: ${colors.textMuted}; font-weight: normal; margin-right: 4px;`;

            const dropdown = document.createElement('select');
            dropdown.style.cssText = `
                background: ${colors.inputBg};
                color: ${colors.textPrimary};
                border: 1px solid ${colors.inputBorder};
                border-radius: 3px;
                padding: 2px 6px;
                font-size: 11px;
                cursor: pointer;
            `;

            // Add options for each custom trader
            customTraders.forEach(trader => {
                const option = document.createElement('option');
                option.value = trader.index;
                option.textContent = trader.name;
                option.selected = trader.index === sellerData.activeSeller;
                dropdown.appendChild(option);
            });

            // Handle dropdown changes
            dropdown.addEventListener('change', function() {
                const newActiveIndex = parseInt(this.value);
                sellerData.activeSeller = newActiveIndex;
                saveSettings();
                refreshRewardDisplay();
            });

            container.appendChild(label);
            container.appendChild(dropdown);

            // Add profile link if current trader has one
            const currentTrader = sellerData.sellers[sellerData.activeSeller];
            if (currentTrader) {
                const userInfo = extractUserInfo(currentTrader.name);
                if (userInfo.hasId) {
                    const profileLink = createProfileLink(userInfo.id, colors);
                    profileLink.style.fontSize = '10px';
                    profileLink.style.marginLeft = '4px';
                    container.appendChild(profileLink);
                }
            }

        } else {
            // Show fallback message with clickable link
            const fallbackText = document.createElement('span');
            fallbackText.style.cssText = `color: ${colors.textMuted};`;
            fallbackText.textContent = 'No custom prices - ';

            const configLink = document.createElement('a');
            configLink.textContent = 'Configure Price List';
            configLink.style.cssText = `
                color: ${colors.primary};
                text-decoration: none;
                cursor: pointer;
            `;
            configLink.addEventListener('click', function(e) {
                e.preventDefault();
                showPricePanel();
            });

            fallbackText.appendChild(configLink);
            container.appendChild(fallbackText);
        }

        return container;
    }

    // Create API cache timestamp display with refresh link
    function createApiCacheDisplay() {
        const colors = getThemeColors();
        const mobile = isMobile();

        const container = document.createElement('div');
        container.id = 'rw-api-cache-display';
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        container.style.fontSize = '11px';
        container.style.gap = '6px';
        container.style.flex = '1';
        container.style.marginLeft = '3px';

        // Get formatted text for when prices were last fetched
        function getApiCacheText() {
            if (!apiPriceCache.lastFetched) return 'Prices: Never fetched';

            const lastFetched = new Date(apiPriceCache.lastFetched);
            const now = new Date();
            const diffMs = now - lastFetched;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            const timeString = lastFetched.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            if (diffDays === 0) {
                return 'Prices: Today at ' + timeString;
            } else if (diffDays === 1) {
                return 'Prices: Yesterday at ' + timeString;
            } else {
                const day = lastFetched.getDate();
                const month = lastFetched.toLocaleString('en-US', { month: 'short' });
                return 'Prices: ' + day + ' ' + month + ' at ' + timeString;
            }
        }

        const textSpan = document.createElement('span');
        textSpan.style.cssText = `color: ${colors.textMuted}; font-weight: normal;`;
        textSpan.textContent = getApiCacheText();

        container.appendChild(textSpan);

        // Add refresh link if cache exists
        if (apiPriceCache.lastFetched) {
            const separator = document.createElement('span');
            separator.style.cssText = `color: ${colors.textMuted};`;
            separator.textContent = '•';
            container.appendChild(separator);

            const refreshLink = document.createElement('span');
            refreshLink.style.cssText = `
                color: ${colors.primary};
                cursor: pointer;
                text-decoration: underline;
            `;
            refreshLink.textContent = 'Refresh';
            refreshLink.title = 'Click to refresh API prices';

            refreshLink.addEventListener('click', function() {
                console.log('RW: Manual API refresh requested from cache display');
                const originalText = refreshLink.textContent;
                refreshLink.textContent = 'Loading...';
                refreshLink.style.cursor = 'wait';
                refreshLink.style.textDecoration = 'none';

                updateApiPriceCache(true).then(function(success) {
                    if (success) {
                        console.log('RW: Manual API refresh successful');
                        refreshLink.textContent = 'Done!';
                        refreshLink.style.color = colors.success;

                        // Update the timestamp text
                        textSpan.textContent = getApiCacheText();

                        setTimeout(function() {
                            refreshLink.textContent = originalText;
                            refreshLink.style.color = colors.primary;
                            refreshLink.style.cursor = 'pointer';
                            refreshLink.style.textDecoration = 'underline';
                            // Full refresh to update all values
                            refreshRewardDisplay();
                        }, 1500);
                    } else {
                        console.log('RW: Manual API refresh failed');
                        refreshLink.textContent = 'Failed';
                        refreshLink.style.color = colors.danger;
                        setTimeout(function() {
                            refreshLink.textContent = originalText;
                            refreshLink.style.color = colors.primary;
                            refreshLink.style.cursor = 'pointer';
                            refreshLink.style.textDecoration = 'underline';
                        }, 2000);
                    }
                });
            });

            container.appendChild(refreshLink);
        }

        return container;
    }

    // Separate function to create grand total container
    function createGrandTotalContainer(grandTotalValue) {
        const colors = getThemeColors();
        const mobile = isMobile();

        // Pre-calculate API values to avoid scope issues
        let combinedApiTotal = 0;
        let showMobileApiComparison = false;
        let mobileApiHtml = '';

        if (SETTINGS.showApiValues && rewardData && rewardData.length === 2) {
            combinedApiTotal = (rewardData[0].apiTotalValue || 0) + (rewardData[1].apiTotalValue || 0);

            if (combinedApiTotal > 0) {
                const percentDiff = grandTotalValue > 0 ? ((grandTotalValue - combinedApiTotal) / combinedApiTotal * 100) : 0;

                if (Math.abs(percentDiff) > 0.1) {
                    showMobileApiComparison = true;
                    let arrow = '';
                    let arrowColor = colors.textMuted;
                    if (percentDiff > 0) {
                        arrow = ' ' + getMobileArrow(true) + ' ';
                        arrowColor = colors.success;
                    } else {
                        arrow = ' ' + getMobileArrow(false) + ' ';
                        arrowColor = colors.danger;
                    }
                    mobileApiHtml = '<br><span style="font-size: 11px; color: ' + colors.textMuted + '; font-weight: normal;"><span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(combinedApiTotal, 2) + '</span>';
                }
            }
        }

        // Create grand total container
        const grandContainer = document.createElement('div');
        grandContainer.style.background = colors.panelBg;
        grandContainer.style.border = '1px solid ' + colors.panelBorder;
        grandContainer.style.borderRadius = '5px';
        grandContainer.style.margin = mobile ? '5px 0' : '10px 0';
        grandContainer.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        grandContainer.style.color = colors.textPrimary;
        grandContainer.style.boxShadow = colors.statBoxShadow;
        grandContainer.style.overflow = 'hidden';
        grandContainer.style.position = 'relative';

        // Create single header
        const header = document.createElement('div');
        header.style.padding = mobile ? '10px 12px' : '12px 15px';
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.style.background = colors.statBoxBg;
        header.style.borderLeft = '3px solid ' + colors.primary; // Blue left border
        header.style.transition = 'background-color 0.2s ease';

        // Create header content container
        const headerContent = document.createElement('div');
        const currentSeller = sellerData.sellers[sellerData.activeSeller];
        const userInfo = extractUserInfo(currentSeller.name);

        if (mobile) {
            // Mobile: Clean layout with buyer info on third line
            headerContent.style.cssText = 'display: flex; justify-content: space-between; align-items: center; width: 100%;';

            const titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = 'bold';
            titleSpan.style.fontSize = '14px';
            titleSpan.style.color = colors.textPrimary;
            titleSpan.textContent = 'Total Rewards';

            // Create right-aligned content area with just blue value (clean first line)
            const rightContent = document.createElement('div');
            rightContent.style.cssText = 'display: flex; align-items: center; gap: 6px;';

            const blueValue = document.createElement('span');
            blueValue.style.color = colors.primary;
            blueValue.style.fontWeight = 'bold';
            blueValue.style.fontSize = '14px';
            blueValue.textContent = grandTotalValue > 0 ? numberFormatter(grandTotalValue, 2) : '?';

            // Conditional arrow for alignment consistency with faction panels
            const expandArrow = document.createElement('span');
            expandArrow.id = 'grand-total-expand-icon';
            if (SETTINGS.showIndirectRewards) {
                // Visible, functional arrow
                expandArrow.style.cssText = 'transition: transform 0.2s ease; font-size: 12px; color: ' + colors.primary + '; font-weight: bold; width: 12px; text-align: center; display: inline-block; cursor: pointer;';
            } else {
                // Hidden arrow for layout consistency
                expandArrow.style.cssText = 'transition: transform 0.2s ease; font-size: 12px; color: ' + colors.primary + '; visibility: hidden; font-weight: bold; width: 12px; text-align: center; display: inline-block;';
            }
            expandArrow.innerHTML = getExpandArrow(false);

            rightContent.appendChild(blueValue);
            rightContent.appendChild(expandArrow);
            headerContent.appendChild(titleSpan);
            headerContent.appendChild(rightContent);

            // Apply desktop wrapper pattern for mobile
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'flex-start'; // Allow for multi-line content

            // Always use wrapper pattern for mobile to add buyer info on third line
            const headerWrapper = document.createElement('div');
            headerWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';

            // Move title to wrapper
            headerWrapper.appendChild(headerContent);

            // Add API comparison line if needed (second line)
            if (SETTINGS.showApiValues && combinedApiTotal > 0) {
                const percentDiff = grandTotalValue > 0 ? ((grandTotalValue - combinedApiTotal) / combinedApiTotal * 100) : 0;

                if (Math.abs(percentDiff) > 0.1) {
                    const apiLine = document.createElement('div');
                    apiLine.style.cssText = 'margin-top: 4px; font-size: 11px; color: ' + colors.textMuted + '; font-weight: normal;';

                    let arrow = '';
                    let arrowColor = colors.textMuted;
                    if (percentDiff > 0) {
                        arrow = ' ' + getMobileArrow(true) + ' ';
                        arrowColor = colors.success;
                    } else {
                        arrow = ' ' + getMobileArrow(false) + ' ';
                        arrowColor = colors.danger;
                    }

                    const apiSpan = document.createElement('span');
                    apiSpan.style.cssText = 'font-size: 11px; color: ' + colors.textMuted + '; font-weight: normal;';
                    apiSpan.innerHTML = '<span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(combinedApiTotal, 2);

                    apiLine.appendChild(apiSpan);
                    headerWrapper.appendChild(apiLine);
                }
            }

            // Add buyer info line (third line) - consistent spacing and handle missing buyer
            const buyerLine = document.createElement('div');
            buyerLine.style.cssText = 'margin-top: 4px; font-size: 11px; color: ' + colors.textMuted + '; font-weight: normal;';

            // Buyer info removed - now handled by trader selector above

            header.appendChild(headerWrapper);
            header.appendChild(rightContent);
        } else {
            // Desktop: Apply new layout matching faction headers
            const titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = 'bold';
            titleSpan.style.fontSize = '16px';
            titleSpan.style.color = colors.textPrimary;
            titleSpan.style.marginRight = '8px';
            titleSpan.textContent = 'Total Rewards';
            headerContent.appendChild(titleSpan);

            // Create right-aligned content area for buyer info and value
            const rightContent = document.createElement('div');
            rightContent.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-end;';

            // Buyer info removed - now handled by trader selector above

            // Add blue total value
            const valueSpan = document.createElement('span');
            valueSpan.style.color = colors.primary;
            valueSpan.style.fontWeight = 'bold';
            valueSpan.style.fontSize = '16px';
            valueSpan.style.marginRight = '8px'; // FIXED: Add gap before invisible arrow to match faction headers
            valueSpan.textContent = grandTotalValue > 0 ? numberFormatter(grandTotalValue, 2) : '?';

            // Conditional arrow for desktop layout
            const desktopExpandArrow = document.createElement('span');
            desktopExpandArrow.id = 'grand-total-expand-icon-desktop';
            desktopExpandArrow.style.transition = 'transform 0.2s ease';
            desktopExpandArrow.style.fontSize = '14px';
            desktopExpandArrow.style.color = colors.primary;
            desktopExpandArrow.style.fontWeight = 'bold';
            desktopExpandArrow.style.width = '14px';
            desktopExpandArrow.style.textAlign = 'center';
            desktopExpandArrow.style.display = 'inline-block';

            if (SETTINGS.showIndirectRewards) {
                // Visible, functional arrow
                desktopExpandArrow.style.cursor = 'pointer';
            } else {
                // Hidden but maintains layout space
                desktopExpandArrow.style.visibility = 'hidden';
            }
            desktopExpandArrow.innerHTML = getExpandArrow(false);

            rightContent.appendChild(valueSpan);
            rightContent.appendChild(desktopExpandArrow);

            // Set up flex layout
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'flex-start'; // Allow for multi-line content

            // Handle API comparison on second line if enabled
            if (SETTINGS.showApiValues && combinedApiTotal > 0) {
                const percentDiff = grandTotalValue > 0 ? ((grandTotalValue - combinedApiTotal) / combinedApiTotal * 100) : 0;

                if (Math.abs(percentDiff) > 0.1) {
                    // Create container for header content with API line
                    const headerWrapper = document.createElement('div');
                    headerWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';

                    // Move title to wrapper
                    headerWrapper.appendChild(headerContent);

                    // Add API comparison on second line
                    const apiLine = document.createElement('div');
                    apiLine.style.cssText = 'margin-top: 4px; font-size: 12px; color: ' + colors.textMuted + '; font-weight: normal;';

                    let arrow = '';
                    let arrowColor = colors.textMuted;
                    if (percentDiff > 0) {
                        arrow = ' ' + getMobileArrow(true) + ' ';
                        arrowColor = colors.success;
                    } else {
                        arrow = ' ' + getMobileArrow(false) + ' ';
                        arrowColor = colors.danger;
                    }

                    apiLine.innerHTML = '<span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(combinedApiTotal, 2);
                    headerWrapper.appendChild(apiLine);

                    header.appendChild(headerWrapper);
                    header.appendChild(rightContent);
                } else {
                    // No API comparison, simpler layout
                    header.appendChild(headerContent);
                    header.appendChild(rightContent);
                }
            } else {
                // No API values, simpler layout
                header.appendChild(headerContent);
                header.appendChild(rightContent);
            }
        }

        // Create details section for indirect rewards (only if enabled)
        if (SETTINGS.showIndirectRewards) {
            const details = document.createElement('div');
            details.id = 'grand-total-details';
            details.style.display = 'none';
            details.style.padding = mobile ? '12px 12px 8px 12px' : '12px 15px 8px 15px';
            details.style.background = colors.panelBg;
            details.style.borderLeft = '3px solid ' + colors.primary;

            // Add click handler to header for expansion
            header.addEventListener('click', function() {
                toggleGrandTotalExpansion();
            });

            grandContainer.appendChild(header);
            grandContainer.appendChild(details);
        } else {
            grandContainer.appendChild(header);
        }
        return grandContainer;
    }

    // Create the "Calculate Cache Split" link
    function createCacheSplitLink() {
        const colors = getThemeColors();
        const mobile = isMobile();

        const linkContainer = document.createElement('div');
        linkContainer.style.cssText = `
            text-align: center;
            margin: 10px 0;
            padding: 8px;
        `;

        const link = document.createElement('a');
        link.textContent = 'Calculate Cache Split';
        link.style.cssText = `
            color: ${colors.primary};
            text-decoration: none;
            cursor: pointer;
            font-size: ${mobile ? '12px' : '13px'};
            font-weight: 500;
            border-bottom: 1px dashed ${colors.primary};
        `;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            showCacheSplitPanel();
        });

        linkContainer.appendChild(link);
        return linkContainer;
    }

    // Show the cache split calculation panel
    function showCacheSplitPanel() {
        const colors = getThemeColors();
        const mobile = isMobile();

        // Remove existing panel if any
        const existingPanel = document.getElementById('rw-cache-split-panel');
        if (existingPanel) {
            existingPanel.remove();
            return; // Toggle behavior
        }

        // Get faction names from reward data
        const faction1Name = rewardData[0]?.factionName || 'Faction 1';
        const faction2Name = rewardData[1]?.factionName || 'Faction 2';

        const panel = document.createElement('div');
        panel.id = 'rw-cache-split-panel';
        panel.style.cssText = `
            background: ${colors.configBg};
            border: 1px solid ${colors.configBorder};
            border-radius: 6px;
            padding: ${mobile ? '12px' : '20px'};
            margin: 10px 0;
            box-shadow: ${colors.statBoxShadow};
        `;

        // Title row with price indicator
        const titleRow = document.createElement('div');
        titleRow.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            gap: 10px;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Cache Split Calculator';
        title.style.cssText = `
            margin: 0;
            color: ${colors.textPrimary};
            font-size: ${mobile ? '16px' : '18px'};
        `;

        // Price source indicator (right side of title) - matches trader selector style
        const priceIndicator = document.createElement('div');
        priceIndicator.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: ${colors.textMuted};
            white-space: nowrap;
        `;

        const priceLabel = document.createElement('span');
        priceLabel.textContent = 'Prices:';
        priceLabel.style.cssText = `color: ${colors.textMuted}; font-weight: normal;`;

        const priceSource = document.createElement('span');
        priceSource.style.cssText = `color: ${colors.textPrimary}; font-weight: normal;`;

        // Determine price source
        if (SETTINGS.showCustomPrices) {
            // Show active trader name
            const activeTrader = sellerData.sellers[sellerData.activeSeller];
            if (activeTrader) {
                priceSource.textContent = activeTrader.name;
            } else {
                priceSource.textContent = 'Custom';
            }
        } else {
            // Show Market Value for API prices
            priceSource.textContent = 'Market Value';
        }

        priceIndicator.appendChild(priceLabel);
        priceIndicator.appendChild(priceSource);

        titleRow.appendChild(title);
        titleRow.appendChild(priceIndicator);

        // Split mode selection - Toggle bar
        const modeSection = document.createElement('div');
        modeSection.style.cssText = 'margin-bottom: 20px;';

        // Create toggle container
        const toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = `
            display: flex;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid ${colors.configBorder};
        `;

        // Track current mode (default: split by value)
        let currentMode = 'value';

        // Left option: Split by value
        const valueOption = document.createElement('div');
        valueOption.id = 'toggle-split-by-value';
        valueOption.style.cssText = `
            flex: 1;
            padding: ${mobile ? '10px 16px' : '12px 20px'};
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: ${mobile ? '12px' : '13px'};
            font-weight: 500;
            background: ${colors.primary};
            color: white;
            user-select: none;
        `;
        valueOption.textContent = 'Split by value';

        // Right option: Split caches by value
        const cachesOption = document.createElement('div');
        cachesOption.id = 'toggle-split-caches';
        cachesOption.style.cssText = `
            flex: 1;
            padding: ${mobile ? '10px 16px' : '12px 20px'};
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: ${mobile ? '12px' : '13px'};
            font-weight: 500;
            background: ${colors.statBoxBg};
            color: ${colors.textMuted};
            user-select: none;
        `;
        cachesOption.textContent = 'Split caches by value';

        // Click handlers to toggle between modes
        valueOption.addEventListener('click', function() {
            if (currentMode !== 'value') {
                currentMode = 'value';
                valueOption.style.background = colors.primary;
                valueOption.style.color = 'white';
                cachesOption.style.background = colors.statBoxBg;
                cachesOption.style.color = colors.textMuted;
                calculateCacheSplit();
            }
        });

        cachesOption.addEventListener('click', function() {
            if (currentMode !== 'caches') {
                currentMode = 'caches';
                cachesOption.style.background = colors.primary;
                cachesOption.style.color = 'white';
                valueOption.style.background = colors.statBoxBg;
                valueOption.style.color = colors.textMuted;
                calculateCacheSplit();
            }
        });

        toggleContainer.appendChild(valueOption);
        toggleContainer.appendChild(cachesOption);
        modeSection.appendChild(toggleContainer);

        // Slider section
        const sliderSection = document.createElement('div');
        sliderSection.style.cssText = 'margin-bottom: 20px;';

        const sliderTitle = document.createElement('div');
        sliderTitle.textContent = 'Split Ratio:';
        sliderTitle.style.cssText = `
            color: ${colors.textPrimary};
            font-weight: bold;
            margin-bottom: 10px;
            font-size: ${mobile ? '13px' : '14px'};
        `;

        // Slider with faction names on ends
        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = 'margin: 15px 0;';

        // Top row: faction names with percentage in center
        const sliderLabels = document.createElement('div');
        sliderLabels.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-size: 12px;
        `;

        const leftLabel = document.createElement('span');
        leftLabel.textContent = faction1Name;
        leftLabel.style.cssText = `
            color: ${colors.textSecondary};
            font-weight: 500;
            flex: 1;
            text-align: left;
        `;

        const sliderValue = document.createElement('div');
        sliderValue.id = 'slider-value-display';
        sliderValue.style.cssText = `
            text-align: center;
            font-size: ${mobile ? '14px' : '16px'};
            font-weight: bold;
            color: ${colors.primary};
            flex-shrink: 0;
        `;
        sliderValue.textContent = '50% / 50%';

        const rightLabel = document.createElement('span');
        rightLabel.textContent = faction2Name;
        rightLabel.style.cssText = `
            color: ${colors.textSecondary};
            font-weight: 500;
            flex: 1;
            text-align: right;
        `;

        sliderLabels.appendChild(leftLabel);
        sliderLabels.appendChild(sliderValue);
        sliderLabels.appendChild(rightLabel);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = '50';
        slider.id = 'cache-split-slider';
        slider.style.cssText = `
            width: 100%;
            accent-color: ${colors.primary};
        `;

        slider.addEventListener('input', function() {
            const value1 = parseInt(slider.value);
            const value2 = 100 - value1;
            sliderValue.textContent = value1 + '% / ' + value2 + '%';

            // Auto-calculate when slider changes
            calculateCacheSplit();
        });

        sliderContainer.appendChild(sliderLabels);
        sliderContainer.appendChild(slider);

        sliderSection.appendChild(sliderTitle);
        sliderSection.appendChild(sliderContainer);

        // Results section
        const resultsSection = document.createElement('div');
        resultsSection.id = 'cache-split-results';
        resultsSection.style.cssText = `
            margin-top: 20px;
            padding: ${mobile ? '12px' : '15px'};
            background: ${colors.panelBg};
            border: 1px solid ${colors.panelBorder};
            border-radius: 4px;
            display: none;
        `;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: ${colors.textMuted};
            color: white;
            border: none;
            padding: ${mobile ? '8px 16px' : '10px 20px'};
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
            font-size: ${mobile ? '13px' : '14px'};
        `;

        closeBtn.addEventListener('click', function() {
            panel.remove();
        });

        // Assemble panel
        panel.appendChild(titleRow);
        panel.appendChild(modeSection);
        panel.appendChild(sliderSection);
        panel.appendChild(resultsSection);
        panel.appendChild(closeBtn);

        // Insert after grand total container
        const grandTotal = document.querySelector('#rw-panels-container > div:last-of-type');
        if (grandTotal) {
            grandTotal.insertAdjacentElement('afterend', panel);
        }

        // Initial calculation
        calculateCacheSplit();
    }

    // Calculate cache split based on selected mode
    function calculateCacheSplit() {
        const resultsSection = document.getElementById('cache-split-results');
        if (!resultsSection) return;

        const slider = document.getElementById('cache-split-slider');
        const valueToggle = document.getElementById('toggle-split-by-value');
        const cachesToggle = document.getElementById('toggle-split-caches');

        // Determine mode by checking which toggle has white text (active state)
        const isByValue = valueToggle && valueToggle.style.color === 'white';

        const splitRatio = parseInt(slider.value) / 100; // Faction 1 percentage
        const colors = getThemeColors();
        const mobile = isMobile();

        // Clear results
        resultsSection.innerHTML = '';
        resultsSection.style.display = 'block';

        const faction1Name = rewardData[0]?.factionName || 'Faction 1';
        const faction2Name = rewardData[1]?.factionName || 'Faction 2';

        // Calculate total value (caches only, not including indirect rewards)
        const grandTotalValue = (rewardData[0]?.totalValue || 0) + (rewardData[1]?.totalValue || 0);

        if (isByValue) {
            // Simple value split
            const faction1Value = grandTotalValue * splitRatio;
            const faction2Value = grandTotalValue * (1 - splitRatio);

            const result = document.createElement('div');
            result.innerHTML = `
                <div style="color: ${colors.textPrimary}; font-weight: bold; margin-bottom: 12px; font-size: ${mobile ? '14px' : '15px'};">
                    Split by Value
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; justify-content: space-between; color: ${colors.textSecondary}; font-size: ${mobile ? '12px' : '13px'};">
                        <span>${faction1Name}:</span>
                        <span style="color: ${colors.primary}; font-weight: bold;">${numberFormatter(faction1Value, 2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; color: ${colors.textSecondary}; font-size: ${mobile ? '12px' : '13px'};">
                        <span>${faction2Name}:</span>
                        <span style="color: ${colors.primary}; font-weight: bold;">${numberFormatter(faction2Value, 2)}</span>
                    </div>
                </div>
            `;
            resultsSection.appendChild(result);
        } else {
            // Complex cache distribution
            const distribution = calculateCacheDistribution(splitRatio);

            if (distribution.error) {
                resultsSection.innerHTML = `
                    <div style="color: ${colors.danger}; font-size: ${mobile ? '12px' : '13px'};">
                        ${distribution.error}
                    </div>
                `;
                return;
            }

            // Title
            const title = document.createElement('div');
            title.style.cssText = `
                color: ${colors.textPrimary};
                font-weight: bold;
                margin-bottom: 12px;
                font-size: ${mobile ? '14px' : '15px'};
            `;
            title.textContent = 'Split Caches by Value';
            resultsSection.appendChild(title);

            // Faction 1 section
            const faction1Section = document.createElement('div');
            faction1Section.style.marginBottom = '15px';

            const faction1Header = document.createElement('div');
            faction1Header.style.cssText = `
                color: ${colors.textPrimary};
                font-weight: 500;
                margin-bottom: 8px;
                font-size: ${mobile ? '13px' : '14px'};
            `;
            faction1Header.innerHTML = `${faction1Name}: <span style="color: ${colors.primary}; font-weight: bold;">${numberFormatter(distribution.faction1Value, 2)}</span>`;
            faction1Section.appendChild(faction1Header);

            // Faction 1 cache boxes container
            const faction1Boxes = document.createElement('div');
            faction1Boxes.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-left: ${mobile ? '0' : '8px'};
            `;

            if (distribution.faction1Grouped.length > 0) {
                distribution.faction1Grouped.forEach(group => {
                    // Pass per-unit value, not total (e.g., 180M per cache, not 540M for 3x)
                    const perUnitValue = group.totalValue / group.quantity;
                    const box = createCacheBox(group.type, group.quantity, perUnitValue);
                    if (box) faction1Boxes.appendChild(box);
                });
            } else {
                const noCache = document.createElement('div');
                noCache.textContent = 'No caches';
                noCache.style.cssText = `
                    font-size: ${mobile ? '11px' : '12px'};
                    color: ${colors.textMuted};
                    padding: 8px;
                `;
                faction1Boxes.appendChild(noCache);
            }

            faction1Section.appendChild(faction1Boxes);
            resultsSection.appendChild(faction1Section);

            // Faction 2 section
            const faction2Section = document.createElement('div');
            faction2Section.style.marginBottom = '15px';

            const faction2Header = document.createElement('div');
            faction2Header.style.cssText = `
                color: ${colors.textPrimary};
                font-weight: 500;
                margin-bottom: 8px;
                font-size: ${mobile ? '13px' : '14px'};
            `;
            faction2Header.innerHTML = `${faction2Name}: <span style="color: ${colors.primary}; font-weight: bold;">${numberFormatter(distribution.faction2Value, 2)}</span>`;
            faction2Section.appendChild(faction2Header);

            // Faction 2 cache boxes container
            const faction2Boxes = document.createElement('div');
            faction2Boxes.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-left: ${mobile ? '0' : '8px'};
            `;

            if (distribution.faction2Grouped.length > 0) {
                distribution.faction2Grouped.forEach(group => {
                    // Pass per-unit value, not total (e.g., 180M per cache, not 540M for 3x)
                    const perUnitValue = group.totalValue / group.quantity;
                    const box = createCacheBox(group.type, group.quantity, perUnitValue);
                    if (box) faction2Boxes.appendChild(box);
                });
            } else {
                const noCache = document.createElement('div');
                noCache.textContent = 'No caches';
                noCache.style.cssText = `
                    font-size: ${mobile ? '11px' : '12px'};
                    color: ${colors.textMuted};
                    padding: 8px;
                `;
                faction2Boxes.appendChild(noCache);
            }

            faction2Section.appendChild(faction2Boxes);
            resultsSection.appendChild(faction2Section);

            // Trade summary (what needs to be swapped)
            if (distribution.tradeSummary) {
                const tradeSummaryText = formatTradeSummary(distribution.tradeSummary, faction1Name, faction2Name);
                const tradeDiv = document.createElement('div');
                tradeDiv.style.cssText = `
                    margin-top: 15px;
                    padding: ${mobile ? '10px' : '12px'};
                    background: ${colors.panelBg};
                    border: 1px solid ${colors.primary};
                    border-radius: 4px;
                    font-size: ${mobile ? '12px' : '13px'};
                    color: ${colors.textPrimary};
                    line-height: 1.5;
                `;
                tradeDiv.innerHTML = `<strong style="color: ${colors.primary};">Trade Required:</strong> ${tradeSummaryText}`;
                resultsSection.appendChild(tradeDiv);
            }

            // Summary footer
            const summary = document.createElement('div');
            summary.style.cssText = `
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid ${colors.panelBorder};
                font-size: ${mobile ? '11px' : '12px'};
                color: ${colors.textMuted};
            `;

            // Calculate which faction is short
            const diff = distribution.faction1Value - distribution.targetValue;
            const absDiff = Math.abs(diff);
            let diffText;
            if (diff > 0) {
                // Faction 1 got more than target, so Faction 2 is short
                diffText = `Difference: ${numberFormatter(absDiff, 2)} (-${numberFormatter(absDiff, 2)} to ${faction2Name})`;
            } else if (diff < 0) {
                // Faction 1 got less than target, so Faction 1 is short
                diffText = `Difference: ${numberFormatter(absDiff, 2)} (-${numberFormatter(absDiff, 2)} to ${faction1Name})`;
            } else {
                // Perfect match
                diffText = `Difference: ${numberFormatter(absDiff, 2)} (perfect split)`;
            }

            // Calculate faction 2's target (remaining from total)
            const faction2Target = distribution.totalValue - distribution.targetValue;

            summary.textContent = `Targets: ${numberFormatter(distribution.targetValue, 2)} / ${numberFormatter(faction2Target, 2)} | ${diffText}`;
            resultsSection.appendChild(summary);
        }
    }

    // Create visual cache box element
    function createCacheBox(cacheType, quantity, value) {
        const colors = getThemeColors();
        const mobile = isMobile();
        const cacheInfo = CACHE_INFO[cacheType];

        if (!cacheInfo) return null;

        const box = document.createElement('div');
        box.style.cssText = `
            display: inline-flex;
            flex-direction: ${mobile ? 'row' : 'column'};
            align-items: center;
            background: ${colors.statBoxBg};
            border: 1px solid ${colors.statBoxBorder};
            border-radius: 6px;
            padding: ${mobile ? '8px' : '10px'};
            margin: ${mobile ? '4px' : '6px'};
            min-width: ${mobile ? 'auto' : '120px'};
            box-shadow: ${colors.statBoxShadow};
            gap: ${mobile ? '8px' : '6px'};
        `;

        // Cache image
        const img = document.createElement('img');
        img.src = cacheInfo.imageUrl;
        img.alt = cacheInfo.name;
        img.style.cssText = `
            width: ${mobile ? '32px' : '48px'};
            height: ${mobile ? '32px' : '48px'};
            object-fit: contain;
        `;

        // Info container (for mobile: flex column on the right, for desktop: below image)
        const infoContainer = document.createElement('div');
        infoContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: ${mobile ? 'flex-start' : 'center'};
            gap: 2px;
            flex: ${mobile ? '1' : 'initial'};
        `;

        // Cache name
        const nameSpan = document.createElement('div');
        nameSpan.textContent = cacheInfo.shortName;
        nameSpan.style.cssText = `
            color: ${colors.textSecondary};
            font-size: ${mobile ? '11px' : '12px'};
            font-weight: 500;
            text-align: ${mobile ? 'left' : 'center'};
        `;

        // Quantity
        const quantitySpan = document.createElement('div');
        quantitySpan.textContent = quantity + 'x';
        quantitySpan.style.cssText = `
            color: ${colors.textPrimary};
            font-size: ${mobile ? '12px' : '14px'};
            font-weight: bold;
        `;

        // Value
        const valueSpan = document.createElement('div');
        valueSpan.textContent = numberFormatter(value, 2);
        valueSpan.style.cssText = `
            color: ${colors.primary};
            font-size: ${mobile ? '11px' : '12px'};
            font-weight: 500;
        `;

        infoContainer.appendChild(nameSpan);
        infoContainer.appendChild(quantitySpan);
        infoContainer.appendChild(valueSpan);

        box.appendChild(img);
        box.appendChild(infoContainer);

        return box;
    }

    // Group caches by type and return summary with quantities
    function groupCachesByType(caches) {
        const grouped = {};

        caches.forEach(cache => {
            if (!grouped[cache.type]) {
                grouped[cache.type] = {
                    type: cache.type,
                    quantity: 0,
                    totalValue: 0
                };
            }
            grouped[cache.type].quantity += 1;
            grouped[cache.type].totalValue += cache.value;
        });

        return Object.values(grouped);
    }

    // Calculate optimal cache distribution using subset sum approach
    function calculateCacheDistribution(splitRatio) {
        // Validate that prices are actually available
        // When showCustomPrices is enabled, check if custom prices exist
        // When showCustomPrices is disabled, API prices are used automatically
        if (SETTINGS.showCustomPrices) {
            // Custom prices mode - verify at least one seller has prices configured
            const hasCustomPriceData = sellerData.sellers.some(seller =>
                Object.values(seller.prices || {}).some(price => price > 0)
            );
            if (!hasCustomPriceData) {
                return { error: 'Custom prices enabled but not configured. Please add prices in settings.' };
            }
        } else {
            // API mode - verify API data is loaded
            const hasApiPriceData = apiPriceCache.data && Object.keys(apiPriceCache.data).length > 0;
            if (!hasApiPriceData) {
                return { error: 'No API prices available. Please configure an API key in settings.' };
            }
        }

        // Collect all caches from both factions with their values
        const allCaches = [];
        let hasZeroPrices = false;

        for (let i = 0; i < 2; i++) {
            const faction = rawRewardData[i];
            if (!faction || !faction.items) continue;

            faction.items.forEach(item => {
                if (item.type === 'cache') {
                    // Use already-calculated value from rewardData (this has correct prices)
                    const totalValue = item.calculatedValue || 0;
                    const perUnitPrice = item.quantity > 0 ? totalValue / item.quantity : 0;

                    if (perUnitPrice === 0) {
                        hasZeroPrices = true;
                    }
                    if (perUnitPrice > 0 && item.quantity > 0) {
                        // Get cache name from CACHE_INFO
                        const cacheInfo = CACHE_INFO[item.cacheType];
                        if (cacheInfo) {
                            // Create individual cache entries for each quantity
                            // This allows the algorithm to split them (e.g., 2 to faction A, 1 to faction B)
                            for (let q = 0; q < item.quantity; q++) {
                                allCaches.push({
                                    name: cacheInfo.name,  // e.g., "Armor Cache"
                                    type: item.cacheType,   // e.g., "armorCache"
                                    value: perUnitPrice,    // per-unit price from already-calculated values
                                    originalFaction: i      // track which faction this cache came from (0 or 1)
                                });
                            }
                        }
                    }
                }
            });
        }

        if (hasZeroPrices) {
            // Check if we're waiting for prices to load
            const waitingForCustom = SETTINGS.showCustomPrices;
            const waitingForApi = SETTINGS.showApiValues && (marketValueMap.size === 0 || !apiPriceCache.lastFetched);

            if (waitingForApi) {
                return { error: 'Waiting for API prices to load. Please wait a moment and try again, or click the Refresh link next to "Prices last fetched" above.' };
            } else if (waitingForCustom) {
                return { error: 'Some cache prices are showing as "?". Please ensure your custom trader has all cache types priced, or try toggling your pricing settings off and on again.' };
            } else {
                return { error: 'Cache prices not available. Please enable and configure either Custom Prices or API Values in Settings.' };
            }
        }

        if (allCaches.length === 0) {
            return { error: 'No caches found to distribute' };
        }

        // Calculate target value for faction 1
        const totalValue = allCaches.reduce((sum, cache) => sum + cache.value, 0);
        const targetValue = totalValue * splitRatio;

        // Use dynamic programming subset sum to find best distribution
        const bestSubset = findBestSubset(allCaches, targetValue);

        // Build results
        const faction1CacheObjects = bestSubset.caches;
        const faction1Value = bestSubset.value;

        const faction2CacheObjects = allCaches.filter(c => !bestSubset.caches.includes(c));
        const faction2Value = totalValue - faction1Value;

        // Group caches by type for visual display
        const faction1Grouped = groupCachesByType(faction1CacheObjects);
        const faction2Grouped = groupCachesByType(faction2CacheObjects);

        // Calculate trade summary (what needs to be swapped)
        const tradeSummary = calculateTradeSummary(faction1CacheObjects, faction2CacheObjects);

        return {
            faction1Caches: faction1CacheObjects.map(c => c.name), // Keep for compatibility
            faction1Value,
            faction1Grouped, // New: grouped data for visual boxes
            faction2Caches: faction2CacheObjects.map(c => c.name), // Keep for compatibility
            faction2Value,
            faction2Grouped, // New: grouped data for visual boxes
            targetValue,
            totalValue,
            tradeSummary // New: what each faction needs to trade
        };
    }

    // Calculate what each faction needs to trade to achieve the split
    function calculateTradeSummary(faction1Caches, faction2Caches) {
        // Count what each faction is GETTING by cache type
        const faction1Gets = {};
        const faction2Gets = {};

        faction1Caches.forEach(cache => {
            if (!faction1Gets[cache.type]) faction1Gets[cache.type] = { count: 0, originalFaction: [] };
            faction1Gets[cache.type].count++;
            faction1Gets[cache.type].originalFaction.push(cache.originalFaction);
        });

        faction2Caches.forEach(cache => {
            if (!faction2Gets[cache.type]) faction2Gets[cache.type] = { count: 0, originalFaction: [] };
            faction2Gets[cache.type].count++;
            faction2Gets[cache.type].originalFaction.push(cache.originalFaction);
        });

        // Calculate what each faction TRADES to the other
        // faction1Caches = allocation for faction at index 0 (first faction)
        // faction2Caches = allocation for faction at index 1 (second faction)

        const faction1Trades = {}; // What faction 1 (second, index 1) trades to faction 0
        const faction0Trades = {}; // What faction 0 (first, index 0) trades to faction 1

        // Check faction 0's final allocation - what came from faction 1?
        // These are caches that faction 1 is TRADING to faction 0
        Object.keys(faction1Gets).forEach(cacheType => {
            const fromFaction1 = faction1Gets[cacheType].originalFaction.filter(f => f === 1).length;
            if (fromFaction1 > 0) {
                faction1Trades[cacheType] = fromFaction1;
            }
        });

        // Check faction 1's final allocation - what came from faction 0?
        // These are caches that faction 0 is TRADING to faction 1
        Object.keys(faction2Gets).forEach(cacheType => {
            const fromFaction0 = faction2Gets[cacheType].originalFaction.filter(f => f === 0).length;
            if (fromFaction0 > 0) {
                faction0Trades[cacheType] = fromFaction0;
            }
        });

        return {
            faction0Trades,  // What faction 0 (first) trades to faction 1 (second)
            faction1Trades   // What faction 1 (second) trades to faction 0 (first)
        };
    }

    // Format trade summary as readable text
    function formatTradeSummary(tradeSummary, faction1Name, faction2Name) {
        const parts = [];

        // faction1Name = first faction (index 0), faction2Name = second faction (index 1)

        // What does first faction trade to second?
        const faction1TradesList = [];
        Object.keys(tradeSummary.faction0Trades).forEach(cacheType => {
            const count = tradeSummary.faction0Trades[cacheType];
            const cacheInfo = CACHE_INFO[cacheType];
            if (cacheInfo && count > 0) {
                faction1TradesList.push(`${count}x ${cacheInfo.name}`);
            }
        });

        if (faction1TradesList.length > 0) {
            parts.push(`${faction1Name} trades ${faction1TradesList.join(' and ')}`);
        }

        // What does second faction trade to first?
        const faction2TradesList = [];
        Object.keys(tradeSummary.faction1Trades).forEach(cacheType => {
            const count = tradeSummary.faction1Trades[cacheType];
            const cacheInfo = CACHE_INFO[cacheType];
            if (cacheInfo && count > 0) {
                faction2TradesList.push(`${count}x ${cacheInfo.name}`);
            }
        });

        if (faction2TradesList.length > 0) {
            parts.push(`${faction2Name} trades ${faction2TradesList.join(' and ')}`);
        }

        if (parts.length === 0) {
            return 'No trades needed - split matches current distribution';
        }

        return parts.join(', ');
    }

    // Get current price for a cache type based on settings
    function getCachePriceForType(cacheType) {
        if (SETTINGS.showCustomPrices) {
            const currentSeller = sellerData.sellers[sellerData.activeSeller];
            if (currentSeller.pricingMode === 'relative' && Object.keys(marketValueMap).length > 0) {
                const basePrice = marketValueMap.get(cacheType) || 0;
                const percentage = currentSeller.prices[cacheType] || 0;
                return basePrice * (1 + percentage / 100);
            } else {
                return currentSeller.prices[cacheType] || 0;
            }
        } else if (SETTINGS.showApiValues && marketValueMap.size > 0) {
            return marketValueMap.get(cacheType) || 0;
        }
        return 0;
    }

    // Find best subset of caches closest to target value using bounded knapsack DP
    // Groups caches by type since same-type caches have same value (much fewer states)
    function findBestSubset(caches, targetValue) {
        // Group caches by type and value (caches of same type have same value)
        const groups = {};

        for (const cache of caches) {
            const key = `${cache.type}_${cache.value}`;
            if (!groups[key]) {
                groups[key] = {
                    type: cache.type,
                    name: cache.name,
                    value: cache.value,
                    originalFaction: cache.originalFaction,
                    caches: []
                };
            }
            groups[key].caches.push(cache);
        }

        const groupArray = Object.values(groups);

        // Use Map-based DP: stores only reachable values (not all values up to sum)
        // Key: value achieved, Value: { caches: array of cache objects, value: total value }
        let reachable = new Map();
        reachable.set(0, { caches: [], value: 0 });

        // Process each cache type group
        for (const group of groupArray) {
            const newReachable = new Map(reachable); // Start with copy of current states

            // For each existing state, try adding 1, 2, 3... of this cache type
            for (const [existingValue, state] of reachable) {
                for (let count = 1; count <= group.caches.length; count++) {
                    const newValue = existingValue + (group.value * count);
                    const newCaches = [...state.caches, ...group.caches.slice(0, count)];

                    // Only update if this is a new value or we haven't seen it yet
                    if (!newReachable.has(newValue)) {
                        newReachable.set(newValue, { caches: newCaches, value: newValue });
                    }
                }
            }

            reachable = newReachable;
        }

        // Find value closest to target
        let closest = 0;
        let minDiff = Infinity;

        for (const value of reachable.keys()) {
            const diff = Math.abs(value - targetValue);
            if (diff < minDiff) {
                minDiff = diff;
                closest = value;
            }
        }

        const result = reachable.get(closest);
        return result || { caches: [], value: 0 };
    }

    function populateIndirectRewards() {
        const details = document.getElementById('grand-total-details');
        if (!details || !SETTINGS.showIndirectRewards || !rewardData || rewardData.length !== 2) {
            return;
        }

        // Clear existing content
        details.innerHTML = '';

        const colors = getThemeColors();
        const mobile = isMobile();

        // Create title for the section
        const sectionTitle = document.createElement('div');
        sectionTitle.style.cssText = 'margin-bottom: 12px; color: ' + colors.textPrimary + '; font-size: 12px;';
        sectionTitle.textContent = 'Other Rewards';
        details.appendChild(sectionTitle);

        // Calculate and display indirect rewards for each faction
        for (let i = 0; i < 2; i++) {
            const faction = rewardData[i];
            if (!faction) continue;

            // Create faction container
            const factionDiv = document.createElement('div');
            factionDiv.style.cssText = 'background: ' + colors.statBoxBg + '; padding: ' + (mobile ? '8px' : '10px') + '; border-radius: 3px; margin-bottom: 8px; border-left: 3px solid ' + colors.primary + '; border: 1px solid ' + colors.statBoxBorder + '; box-shadow: ' + colors.statBoxShadow + ';';

            // Faction name
            const factionName = document.createElement('div');
            factionName.style.cssText = 'font-weight: bold; margin-bottom: 6px; color: ' + colors.textPrimary + '; font-size: ' + (mobile ? '12px' : '13px') + ';';
            factionName.textContent = faction.factionName;
            factionDiv.appendChild(factionName);

            let indirectTotal = 0;

            // Respect rewards
            if (faction.respectAmount > 0) {
                const respectValue = faction.respectAmount * SETTINGS.respectValue;
                indirectTotal += respectValue;

                const respectRow = document.createElement('div');
                respectRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: ' + (mobile ? '11px' : '12px') + ';';

                const respectLabel = document.createElement('span');
                respectLabel.style.color = colors.textSecondary;
                respectLabel.textContent = formatNumberWithCommas(faction.respectAmount) + ' respect x' + formatNumberWithCommas(SETTINGS.respectValue);

                const respectValueSpan = document.createElement('span');
                respectValueSpan.style.cssText = 'color: ' + colors.primary + '; font-weight: bold;';
                respectValueSpan.textContent = numberFormatter(respectValue, 2);

                respectRow.appendChild(respectLabel);
                respectRow.appendChild(respectValueSpan);
                factionDiv.appendChild(respectRow);
            }

            // Points rewards (extract from items)
            if (rawRewardData[i] && rawRewardData[i].items) {
                const pointsItems = rawRewardData[i].items.filter(item => item.type === 'points');
                for (const pointsItem of pointsItems) {
                    if (pointsItem.quantity > 0) {
                        const pointsValue = pointsItem.quantity * pointsItem.pointValue;
                        indirectTotal += pointsValue;

                        const pointsRow = document.createElement('div');
                        pointsRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: ' + (mobile ? '11px' : '12px') + ';';

                        const pointsLabel = document.createElement('span');
                        pointsLabel.style.color = colors.textSecondary;
                        pointsLabel.textContent = formatNumberWithCommas(pointsItem.quantity) + ' points x' + formatNumberWithCommas(pointsItem.pointValue);

                        const pointsValueSpan = document.createElement('span');
                        pointsValueSpan.style.cssText = 'color: ' + colors.primary + '; font-weight: bold;';
                        pointsValueSpan.textContent = numberFormatter(pointsValue, 2);

                        pointsRow.appendChild(pointsLabel);
                        pointsRow.appendChild(pointsValueSpan);
                        factionDiv.appendChild(pointsRow);
                    }
                }
            }

            // Faction total
            if (indirectTotal > 0) {
                const totalRow = document.createElement('div');
                totalRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 6px; border-top: 1px solid ' + colors.statBoxBorder + '; font-weight: bold; font-size: ' + (mobile ? '12px' : '13px') + ';';

                const totalLabel = document.createElement('span');
                totalLabel.style.color = colors.textPrimary;
                totalLabel.textContent = 'Faction Total';

                const totalValueSpan = document.createElement('span');
                totalValueSpan.style.cssText = 'color: ' + colors.success + '; font-weight: bold;';
                totalValueSpan.textContent = numberFormatter(indirectTotal, 2);

                totalRow.appendChild(totalLabel);
                totalRow.appendChild(totalValueSpan);
                factionDiv.appendChild(totalRow);
            } else {
                // No indirect rewards
                const noRewardsDiv = document.createElement('div');
                noRewardsDiv.style.cssText = 'font-style: italic; color: ' + colors.textMuted + '; font-size: ' + (mobile ? '11px' : '12px') + ';';
                noRewardsDiv.textContent = 'No other rewards';
                factionDiv.appendChild(noRewardsDiv);
            }

            details.appendChild(factionDiv);
        }
    }

    function toggleGrandTotalExpansion() {
        const details = document.getElementById('grand-total-details');
        const mobileIcon = document.getElementById('grand-total-expand-icon');
        const desktopIcon = document.getElementById('grand-total-expand-icon-desktop');

        if (details && details.style.display === 'none') {
            details.style.display = 'block';
            // Populate content when expanding
            populateIndirectRewards();

            if (mobileIcon) {
                mobileIcon.style.transform = 'rotate(180deg)';
                mobileIcon.innerHTML = getExpandArrow(true);
            }
            if (desktopIcon) {
                desktopIcon.style.transform = 'rotate(180deg)';
                desktopIcon.innerHTML = getExpandArrow(true);
            }
        } else if (details) {
            details.style.display = 'none';
            if (mobileIcon) {
                mobileIcon.style.transform = 'rotate(0deg)';
                mobileIcon.innerHTML = getExpandArrow(false);
            }
            if (desktopIcon) {
                desktopIcon.style.transform = 'rotate(0deg)';
                desktopIcon.innerHTML = getExpandArrow(false);
            }
        }
    }

    function createCompactContainer(totalValue, index, grandTotalValue, factionName, allRewardData) {
        const colors = getThemeColors();
        const mobile = isMobile();
        const container = document.createElement('div');

        // Calculate distribution percentage for this reward
        const percentage = grandTotalValue > 0 ? (totalValue / grandTotalValue * 100).toFixed(1) : '?';

        // Determine winner/loser and set border color with progressive fallback
        let borderColor;
        let isWinner = false;

        if (percentage !== '?' && parseFloat(percentage) > 50) {
            // Primary method: Use percentage-based determination when prices available
            isWinner = true;
            borderColor = colors.success;
        } else if (percentage !== '?' && parseFloat(percentage) <= 50) {
            // Primary method: Loser based on percentage
            isWinner = false;
            borderColor = colors.danger;
        } else if (allRewardData && allRewardData.length === 2) {
            // Secondary method: Use ranking-based determination when no prices
            const faction0Outcome = allRewardData[0].rankingOutcome;
            const faction1Outcome = allRewardData[1].rankingOutcome;

            console.log("RWAwardValue: Ranking outcomes - Faction 0:", faction0Outcome, "Faction 1:", faction1Outcome);

            // If one faction ranked down, they're the loser
            if (faction0Outcome === 'loser' && faction1Outcome !== 'loser') {
                // Faction 0 is loser, faction 1 is winner
                isWinner = index === 1;
                borderColor = index === 1 ? colors.success : colors.danger;
                console.log("RWAwardValue: Faction 0 lost, faction 1 won. Current index:", index, "isWinner:", isWinner);
            } else if (faction1Outcome === 'loser' && faction0Outcome !== 'loser') {
                // Faction 1 is loser, faction 0 is winner
                isWinner = index === 0;
                borderColor = index === 0 ? colors.success : colors.danger;
                console.log("RWAwardValue: Faction 1 lost, faction 0 won. Current index:", index, "isWinner:", isWinner);
            } else {
                // Tertiary fallback: Cannot determine winner/loser
                borderColor = colors.primary; // Use blue as neutral
                console.log("RWAwardValue: Cannot determine winner/loser from ranking, using blue");
            }
        } else {
            // Tertiary fallback: Cannot determine winner/loser
            borderColor = colors.primary; // Use blue as neutral
        }

        // Set container styles
        container.style.background = colors.panelBg;
        container.style.border = '1px solid ' + colors.panelBorder;
        container.style.borderRadius = '5px';
        container.style.margin = mobile ? '5px 0' : '10px 0';
        container.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        container.style.color = colors.textPrimary;
        container.style.boxShadow = colors.statBoxShadow;
        container.style.overflow = 'hidden';
        container.style.position = 'relative';

        // Create header
        const header = document.createElement('div');
        header.id = 'rw-reward-' + index;
        header.style.padding = mobile ? '10px 12px' : '12px 15px';
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.background = colors.statBoxBg;
        header.style.borderLeft = '3px solid ' + borderColor;
        header.style.borderBottom = '1px solid ' + colors.statBoxBorder;
        header.style.transition = 'background-color 0.2s ease';

        // Create header content
        const headerContent = document.createElement('div');
        const titleSpan = document.createElement('span');
        titleSpan.style.fontWeight = 'bold';
        titleSpan.style.fontSize = mobile ? '14px' : '16px';
        titleSpan.style.color = colors.textPrimary;
        titleSpan.style.marginRight = '8px';

        if (mobile) {
            // Mobile: working structure
            headerContent.style.cssText = 'display: flex; justify-content: space-between; align-items: center; width: 100%;';

            const titleSpan = document.createElement('span');
            titleSpan.style.fontWeight = 'bold';
            titleSpan.style.fontSize = '14px';
            titleSpan.style.color = colors.textPrimary;

            // Truncate faction name on mobile if longer than 18 characters
            const displayName = factionName.length > 18 ? factionName.substring(0, 18) + '...' : factionName;
            titleSpan.innerHTML = displayName + ' <span style="color: ' + borderColor + ';">(' + percentage + '%)</span>';

            // Create right-aligned content area
            const rightContent = document.createElement('div');
            rightContent.style.cssText = 'display: flex; align-items: center; gap: 6px;';

            const blueValue = document.createElement('span');
            blueValue.style.color = colors.primary;
            blueValue.style.fontWeight = 'bold';
            blueValue.style.fontSize = '14px';
            blueValue.textContent = totalValue > 0 ? numberFormatter(totalValue, 2) : '?';

            const expandIcon = document.createElement('span');
            expandIcon.id = 'expand-icon-' + index;
            expandIcon.style.cssText = 'transition: transform 0.2s ease; font-size: 12px; color: ' + colors.primary + '; font-weight: bold; width: 12px; text-align: center; display: inline-block;';
            expandIcon.innerHTML = getExpandArrow(false);

            rightContent.appendChild(blueValue);
            rightContent.appendChild(expandIcon);
            headerContent.appendChild(titleSpan);
            headerContent.appendChild(rightContent);

            // Apply desktop wrapper pattern for mobile API comparison
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'flex-start'; // Allow for multi-line content

            // Add API comparison using desktop wrapper pattern
            if (SETTINGS.showApiValues && rewardData[index] && rewardData[index].apiTotalValue > 0) {
                const apiValue = rewardData[index].apiTotalValue;
                const customValue = rewardData[index].totalValue;
                const percentDiff = customValue > 0 ? ((customValue - apiValue) / apiValue * 100) : 0;

                if (Math.abs(percentDiff) > 0.1) {
                    // Create container for header content with API line
                    const headerWrapper = document.createElement('div');
                    headerWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';

                    // Move title to wrapper
                    headerWrapper.appendChild(headerContent);

                    // Add API comparison on second line
                    const apiLine = document.createElement('div');
                    apiLine.style.cssText = 'margin-top: 4px; font-size: 11px; color: ' + colors.textMuted + '; font-weight: normal;';

                    let arrow = '';
                    let arrowColor = colors.textMuted;
                    if (percentDiff > 0) {
                        arrow = ' ' + getMobileArrow(true) + ' ';
                        arrowColor = colors.success;
                    } else {
                        arrow = ' ' + getMobileArrow(false) + ' ';
                        arrowColor = colors.danger;
                    }

                    apiLine.innerHTML = '<span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(apiValue, 2);
                    headerWrapper.appendChild(apiLine);

                    header.appendChild(headerWrapper);
                    header.appendChild(rightContent);
                } else {
                    // No API comparison, simpler layout
                    header.appendChild(headerContent);
                    header.appendChild(rightContent);
                }
            } else {
                // No API values, simpler layout
                header.appendChild(headerContent);
                header.appendChild(rightContent);
            }
        } else {
            // Desktop: Single line layout with percentage moved to left
            titleSpan.innerHTML = factionName + ' Rewards <span style="color: ' + borderColor + ';">(' + percentage + '%)</span>';
            headerContent.appendChild(titleSpan);

            // Desktop: Create right-aligned content area for blue value only
            const rightContent = document.createElement('div');
            rightContent.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1; justify-content: flex-end;';

            // Add blue total value (percentage now on left with title)
            const valueSpan = document.createElement('span');
            valueSpan.style.color = colors.primary;
            valueSpan.style.fontWeight = 'bold';
            valueSpan.style.fontSize = '16px';
            valueSpan.style.marginRight = '8px'; // Gap before expand arrow
            valueSpan.textContent = totalValue > 0 ? numberFormatter(totalValue, 2) : '?';

            rightContent.appendChild(valueSpan);

            // Create expand icon
            const expandIcon = document.createElement('span');
            expandIcon.id = 'expand-icon-' + index;
            expandIcon.style.transition = 'transform 0.2s ease';
            expandIcon.style.fontSize = '14px';
            expandIcon.style.color = colors.primary;
            expandIcon.style.fontWeight = 'bold';
            expandIcon.style.width = '14px';
            expandIcon.style.textAlign = 'center';
            expandIcon.style.display = 'inline-block';
            expandIcon.innerHTML = getExpandArrow(false); // Start collapsed - USE innerHTML for HTML entities

            rightContent.appendChild(expandIcon);

            // Modify header to be flex container
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'flex-start'; // Allow for multi-line content

            // Add API comparison on second line if enabled
            if (SETTINGS.showApiValues && rewardData[index] && rewardData[index].apiTotalValue > 0) {
                const apiValue = rewardData[index].apiTotalValue;
                const customValue = rewardData[index].totalValue;
                const percentDiff = customValue > 0 ? ((customValue - apiValue) / apiValue * 100) : 0;

                if (Math.abs(percentDiff) > 0.1) {
                    // Create container for header content with API line
                    const headerWrapper = document.createElement('div');
                    headerWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';

                    // Move title to wrapper
                    headerWrapper.appendChild(headerContent);

                    // Add API comparison on second line
                    const apiLine = document.createElement('div');
                    apiLine.style.cssText = 'margin-top: 4px; font-size: 12px; color: ' + colors.textMuted + '; font-weight: normal;';

                    let arrow = '';
                    let arrowColor = colors.textMuted;
                    if (percentDiff > 0) {
                        arrow = ' ' + getMobileArrow(true) + ' ';
                        arrowColor = colors.success;
                    } else {
                        arrow = ' ' + getMobileArrow(false) + ' ';
                        arrowColor = colors.danger;
                    }

                    apiLine.innerHTML = '<span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(apiValue, 2);
                    headerWrapper.appendChild(apiLine);

                    header.appendChild(headerWrapper);
                    header.appendChild(rightContent);
                } else {
                    // No API comparison, simpler layout
                    header.appendChild(headerContent);
                    header.appendChild(rightContent);
                }
            } else {
                // No API values, simpler layout
                header.appendChild(headerContent);
                header.appendChild(rightContent);
            }
        }

        // Create details section
        const details = document.createElement('div');
        details.id = 'rw-details-' + index;
        details.style.display = 'none';
        details.style.padding = mobile ? '12px 12px 8px 12px' : '12px 15px 8px 15px';
        details.style.background = colors.panelBg;
        details.style.borderLeft = '3px solid ' + borderColor;

        container.appendChild(header);
        container.appendChild(details);

        return container;
    }

    function toggleExpansion(index) {
        const details = document.getElementById('rw-details-' + index);
        const icon = document.getElementById('expand-icon-' + index);

        if (details.style.display === 'none') {
            details.style.display = 'block';
            icon.style.transform = 'rotate(180deg)';
            icon.innerHTML = getExpandArrow(true); // USE innerHTML for HTML entities
        } else {
            details.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
            icon.innerHTML = getExpandArrow(false); // USE innerHTML for HTML entities
        }
    }

    async function valueRow(row, index) {
        console.log("RWAwardValue: Processing row", index);

        // Extract faction name and ranking outcome from the row text
        let factionName = "Unknown Faction";
        let rankingOutcome = null;
        const rowText = row.innerText;
        const factionMatch = rowText.match(/^([A-Za-z0-9\.\s_'-]+)\s+(ranked\s+(up|down)\s+from|remained\s+at)/);
        if (factionMatch) {
            factionName = factionMatch[1].trim();
            const rankingText = factionMatch[2].toLowerCase();

            if (rankingText.includes('ranked down')) {
                rankingOutcome = 'loser';
            } else if (rankingText.includes('ranked up') || rankingText.includes('remained at')) {
                rankingOutcome = 'winner';
            }
        }
        console.log("RWAwardValue: Extracted faction name:", factionName, "ranking outcome:", rankingOutcome);

        // Extract respect amount before "bonus respect, "
        let respectAmount = 0;
        const respectMatch = row.innerText.match(/(\d{1,3}(?:,\d{3})*)\s+bonus respect,/);
        if (respectMatch) {
            respectAmount = parseInt(respectMatch[1].replace(/,/g, ''));
            console.log("RWAwardValue: Extracted respect amount:", respectAmount);
        }

        let startingIndex = row.innerText.indexOf("bonus respect, ") + 15;
        if (startingIndex === 14) {
            console.error("RWAwardValue: Could not find 'bonus respect, ' in row text");
            rewardData[index] = {
                totalValue: 0,
                totalBB: 0,
                itemElements: [],
                factionName: factionName,
                respectAmount: respectAmount,
                row: row
            };
            return;
        }

        let awardsString = row.innerText.substring(startingIndex, row.innerText.length);
        console.log("RWAwardValue: Awards string:", awardsString);

        let rowTotalValue = 0;
        let rawItems = []; // Store raw item data for recalculation
        const colors = getThemeColors();
        const mobile = isMobile();

        const items = awardsString.split(", ");
        let itemElements = [];

        for (const item of items) {
            console.log("RWAwardValue: Processing item:", item);
            let itemValue = 0;
            let itemBB = 0;
            let itemName = item;
            let rawItem = null;

            if (item.includes("points")) {
                const pointsAmount = parseInt(item.substring(0, item.indexOf(" ")).replace(",", ""));
                if (pointsAmount > 0) {
                    let pointValueForCalc;
                    if (API_KEY === 'YOUR_API_KEY_HERE' || !API_KEY) {
                        pointValueForCalc = 31300;
                        itemValue = 31300 * pointsAmount;
                        console.log("RWAwardValue: Using mock point value");
                    } else {
                        pointValueForCalc = await fetchPointValue();
                        itemValue = pointValueForCalc * pointsAmount;
                        console.log("RWAwardValue: Using API point value:", pointValueForCalc);
                    }

                    rawItem = {
                        type: 'points',
                        quantity: pointsAmount,
                        pointValue: pointValueForCalc
                    };

                    rowTotalValue += itemValue;
                    itemName = item + ' (' + numberFormatter(itemValue) + ' total)';
                } else {
                    console.log("RWAwardValue: Skipping 0 points");
                    continue;
                }
            } else if (item.includes("Cache")) {
                console.log("RWAwardValue: Found cache item:", item);
                let cacheValue = 0;
                let bbValue = 0;
                let cacheType = '';
                let defaultValue = 0;

                if (item.includes("Armor Cache")) {
                    cacheType = 'armorCache';
                    defaultValue = 312400000;
                } else if (item.includes("Heavy Arms Cache")) {
                    cacheType = 'heavyArmsCache';
                    defaultValue = 250000000;
                } else if (item.includes("Medium Arms Cache")) {
                    cacheType = 'mediumArmsCache';
                    defaultValue = 191000000;
                } else if (item.includes("Melee Cache")) {
                    cacheType = 'meleeCache';
                    defaultValue = 139500000;
                } else if (item.includes("Small Arms Cache")) {
                    cacheType = 'smallArmsCache';
                    defaultValue = 111400000;
                }

                const quantity = parseInt(item.substring(0, item.indexOf("x")));

                // Determine price source based on settings and availability
                const customPrice = getCustomPrice(cacheType);
                const hasCustomPrice = customPrice > 0;
                const hasApiPrice = apiPriceCache.data && apiPriceCache.data[cacheType];
                const hasValidApiKey = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') || PDA_VALIDATED;

                // DEBUG: Log pricing decision with full context
                console.log(`RW DEBUG: ${cacheType} pricing check:`);
                console.log(`  - customPrice: ${customPrice}`);
                console.log(`  - SETTINGS.showCustomPrices: ${SETTINGS.showCustomPrices}`);
                console.log(`  - sellerData.activeSeller: ${sellerData.activeSeller}`);
                console.log(`  - seller.name: ${sellerData.sellers[sellerData.activeSeller].name}`);
                console.log(`  - seller.pricingMode: ${sellerData.sellers[sellerData.activeSeller].pricingMode}`);
                console.log(`  - seller raw price: ${sellerData.sellers[sellerData.activeSeller].prices[cacheType]}`);
                console.log(`  - hasApiPrice: ${hasApiPrice}`);
                if (hasApiPrice) {
                    console.log(`  - API price value: ${apiPriceCache.data[cacheType]}`);
                }
                console.log(`  - hasValidApiKey: ${hasValidApiKey}`);

                // Priority: Custom prices (if enabled) > API prices (if available) > No pricing (show "?")
                if (SETTINGS.showCustomPrices && hasCustomPrice) {
                    cacheValue = customPrice;
                    itemValue = cacheValue * quantity;
                    console.log(`RW DEBUG: ${cacheType} - Using custom price: ${cacheValue}`);
                } else if (hasApiPrice && hasValidApiKey) {
                    cacheValue = apiPriceCache.data[cacheType];
                    itemValue = cacheValue * quantity;
                    console.log(`RW DEBUG: ${cacheType} - Using API price: ${cacheValue}`);
                } else {
                    // No prices available - show "?"
                    cacheValue = 0;
                    itemValue = 0;
                    console.log(`RW DEBUG: ${cacheType} - No pricing available, showing ?`);
                }

                rawItem = {
                    type: 'cache',
                    cacheType: cacheType,
                    quantity: quantity,
                    defaultValue: defaultValue
                };

                rowTotalValue += itemValue;
                // Only format value if we have a price, otherwise show just the item name
                if (itemValue > 0) {
                    itemName = item + ' (' + numberFormatter(itemValue) + ' total)';
                } else {
                    itemName = item; // Just show the item name without pricing
                }
            }

            if (rawItem) {
                rawItems.push(rawItem);
            }

            // Create item display element with ENHANCED FORMAT
                const itemDiv = document.createElement('div');
                itemDiv.style.background = colors.statBoxBg;
                itemDiv.style.padding = mobile ? '8px' : '10px';
                itemDiv.style.borderRadius = '3px';
                itemDiv.style.marginBottom = '6px';
                itemDiv.style.borderLeft = '3px solid ' + colors.primary;
                itemDiv.style.border = '1px solid ' + colors.statBoxBorder;
                itemDiv.style.boxShadow = colors.statBoxShadow;
                itemDiv.style.display = 'flex';
                itemDiv.style.justifyContent = 'space-between';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.fontSize = mobile ? '12px' : '13px';

                const nameSpan = document.createElement('span');
                nameSpan.style.color = colors.textSecondary;

                // NEW ENHANCED FORMAT for item names - USE CUSTOM PRICES
                let enhancedItemName = '';
                let cacheTypeForApi = '';
                if (item.includes("Cache")) {
                    // Extract cache details for enhanced format
                    const quantity = parseInt(item.substring(0, item.indexOf("x")));
                    let cacheTypeName = '';
                    let individualPrice = 0;

                    if (item.includes("Armor Cache")) {
                        cacheTypeName = 'Armor';
                        cacheTypeForApi = 'armorCache';
                        const customPrice = getCustomPrice('armorCache');
                        const hasCustomPrice = customPrice > 0;
                        const hasApiPrice = SETTINGS.showApiValues && apiPriceCache.data && apiPriceCache.data['armorCache'];

                        if (SETTINGS.showCustomPrices && hasCustomPrice) {
                            individualPrice = customPrice;
                        } else if (hasApiPrice) {
                            individualPrice = apiPriceCache.data['armorCache'];
                        } else {
                            individualPrice = 0;
                        }
                    } else if (item.includes("Heavy Arms Cache")) {
                        cacheTypeName = 'Heavy Arms';
                        cacheTypeForApi = 'heavyArmsCache';
                        const customPrice = getCustomPrice('heavyArmsCache');
                        const hasCustomPrice = customPrice > 0;
                        const hasApiPrice = SETTINGS.showApiValues && apiPriceCache.data && apiPriceCache.data['heavyArmsCache'];

                        if (SETTINGS.showCustomPrices && hasCustomPrice) {
                            individualPrice = customPrice;
                        } else if (hasApiPrice) {
                            individualPrice = apiPriceCache.data['heavyArmsCache'];
                        } else {
                            individualPrice = 0;
                        }
                    } else if (item.includes("Medium Arms Cache")) {
                        cacheTypeName = 'Medium Arms';
                        cacheTypeForApi = 'mediumArmsCache';
                        const customPrice = getCustomPrice('mediumArmsCache');
                        const hasCustomPrice = customPrice > 0;
                        const hasApiPrice = SETTINGS.showApiValues && apiPriceCache.data && apiPriceCache.data['mediumArmsCache'];

                        if (SETTINGS.showCustomPrices && hasCustomPrice) {
                            individualPrice = customPrice;
                        } else if (hasApiPrice) {
                            individualPrice = apiPriceCache.data['mediumArmsCache'];
                        } else {
                            individualPrice = 0;
                        }
                    } else if (item.includes("Melee Cache")) {
                        cacheTypeName = 'Melee';
                        cacheTypeForApi = 'meleeCache';
                        const customPrice = getCustomPrice('meleeCache');
                        const hasCustomPrice = customPrice > 0;
                        const hasApiPrice = SETTINGS.showApiValues && apiPriceCache.data && apiPriceCache.data['meleeCache'];

                        if (SETTINGS.showCustomPrices && hasCustomPrice) {
                            individualPrice = customPrice;
                        } else if (hasApiPrice) {
                            individualPrice = apiPriceCache.data['meleeCache'];
                        } else {
                            individualPrice = 0;
                        }
                    } else if (item.includes("Small Arms Cache")) {
                        cacheTypeName = 'Small Arms';
                        cacheTypeForApi = 'smallArmsCache';
                        const customPrice = getCustomPrice('smallArmsCache');
                        const hasCustomPrice = customPrice > 0;
                        const hasApiPrice = SETTINGS.showApiValues && apiPriceCache.data && apiPriceCache.data['smallArmsCache'];

                        if (SETTINGS.showCustomPrices && hasCustomPrice) {
                            individualPrice = customPrice;
                        } else if (hasApiPrice) {
                            individualPrice = apiPriceCache.data['smallArmsCache'];
                        } else {
                            individualPrice = 0;
                        }
                    }

                    if (mobile) {
                        // Mobile: Simplified layout without quantity breakdown
                        if (quantity === 1) {
                            enhancedItemName = '1x ' + cacheTypeName + ' Cache';
                        } else {
                            enhancedItemName = quantity + 'x ' + cacheTypeName + ' Cache';
                        }

                        // Add API comparison if available and custom prices are enabled
                        if (SETTINGS.showCustomPrices && SETTINGS.showApiValues && item.includes("Cache") && Object.keys(apiPriceCache.data).length > 0 && cacheTypeForApi && apiPriceCache.data[cacheTypeForApi] && individualPrice > 0) {
                            const apiValue = apiPriceCache.data[cacheTypeForApi] * quantity;
                            const customValue = itemValue;
                            const percentDiff = customValue > 0 ? ((customValue - apiValue) / apiValue * 100) : 0;

                            if (Math.abs(percentDiff) > 0.1) {
                                let arrow = '';
                                let arrowColor = colors.textMuted;
                                if (percentDiff > 0) {
                                    arrow = ' ' + getMobileArrow(true) + ' ';
                                    arrowColor = colors.success;
                                } else {
                                    arrow = ' ' + getMobileArrow(false) + ' ';
                                    arrowColor = colors.danger;
                                }
                                enhancedItemName += '<br><span style="font-size: 11px; color: ' + colors.textMuted + ';"><span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(apiValue, 2) + '</span>';
                            }
                        }
                    } else {
                        // Desktop: Single line layout
                        if (individualPrice > 0) {
                            if (quantity === 1) {
                                enhancedItemName = '1x ' + cacheTypeName + ' Cache (' + formatNumberWithCommas(individualPrice) + ')';
                            } else {
                                enhancedItemName = quantity + 'x ' + cacheTypeName + ' Cache (' + quantity + 'x ' + formatNumberWithCommas(individualPrice) + ')';
                            }
                        } else {
                            // No price available - show just quantity and cache name
                            if (quantity === 1) {
                                enhancedItemName = '1x ' + cacheTypeName + ' Cache';
                            } else {
                                enhancedItemName = quantity + 'x ' + cacheTypeName + ' Cache';
                            }
                        }
                    }
                } else {
                    // For points, use the existing format
                    if (mobile) {
                        enhancedItemName = itemName.replace(' (', '<br><span style="font-size: 11px; color: ' + colors.textMuted + ';">(') + '</span>';
                    } else {
                        enhancedItemName = itemName;
                    }
                    cacheTypeForApi = 'points';
                }

                nameSpan.innerHTML = enhancedItemName; // Use innerHTML for mobile line breaks

                const valueContainer = document.createElement('div');
                valueContainer.style.display = 'flex';
                valueContainer.style.alignItems = 'center';
                valueContainer.style.gap = '8px';

                // Add API comparison for cache items if enabled and API data available (DESKTOP ONLY)
                if (!mobile && SETTINGS.showCustomPrices && SETTINGS.showApiValues && item.includes("Cache") && Object.keys(apiPriceCache.data).length > 0 && cacheTypeForApi && apiPriceCache.data[cacheTypeForApi] && itemValue > 0) {
                    const quantity = parseInt(item.substring(0, item.indexOf("x")));
                    const apiValue = apiPriceCache.data[cacheTypeForApi] * quantity;
                    const customValue = itemValue;
                    const percentDiff = customValue > 0 ? ((customValue - apiValue) / apiValue * 100) : 0;

                    if (Math.abs(percentDiff) > 0.1) { // Only show if meaningful difference
                        // Create wrapper for name with API line below
                        const nameWrapper = document.createElement('div');
                        nameWrapper.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';

                        // Create main item name span
                        const mainNameSpan = document.createElement('span');
                        mainNameSpan.style.color = colors.textSecondary;
                        mainNameSpan.innerHTML = enhancedItemName;

                        // Create API comparison line with increased gap
                        const apiLine = document.createElement('div');
                        apiLine.style.cssText = 'margin-top: 4px; font-size: 11px; color: ' + colors.textMuted + '; font-weight: normal;';

                        let arrow = '';
                        let arrowColor = colors.textMuted;
                        if (percentDiff > 0) {
                            arrow = getMobileArrow(true) + ' ';
                            arrowColor = colors.success;
                        } else {
                            arrow = getMobileArrow(false) + ' ';
                            arrowColor = colors.danger;
                        }

                        apiLine.innerHTML = '<span style="color: ' + arrowColor + ';">' + arrow + Math.abs(percentDiff).toFixed(1) + '%</span> Market value ' + numberFormatter(apiValue, 2);

                        nameWrapper.appendChild(mainNameSpan);
                        nameWrapper.appendChild(apiLine);

                        // Adjust itemDiv to allow for multi-line content
                        itemDiv.style.alignItems = 'flex-start';
                        itemDiv.appendChild(nameWrapper);
                    } else {
                        // No significant API difference, use normal layout
                        nameSpan.innerHTML = enhancedItemName;
                        itemDiv.appendChild(nameSpan);
                    }
                } else {
                    // No API comparison or mobile view, use normal layout
                    nameSpan.innerHTML = enhancedItemName;
                    itemDiv.appendChild(nameSpan);
                }

                const valueSpan = document.createElement('span');
                valueSpan.style.color = colors.primary;
                valueSpan.style.fontWeight = 'bold';
                valueSpan.textContent = numberFormatter(itemValue, 2);

                valueContainer.appendChild(valueSpan);

                // Only add valueContainer if we haven't already added nameWrapper
                if (!itemDiv.children.length) {
                    itemDiv.appendChild(nameSpan);
                }
                itemDiv.appendChild(valueContainer);
                itemElements.push(itemDiv);

                // Store reference for updating during refresh
                if (rawItem) {
                    itemDiv.setAttribute('data-cache-type', rawItem.cacheType || 'points');
                    itemDiv.setAttribute('data-item-type', rawItem.type);
                }
        }

        console.log("RWAwardValue: Row", index, "total value:", rowTotalValue);
        rewardData[index] = {
            totalValue: rowTotalValue,
            itemElements: itemElements,
            factionName: factionName,
            respectAmount: respectAmount,
            rankingOutcome: rankingOutcome, // Store ranking outcome for winner/loser determination
            row: row
        };

        // Store raw data for recalculation
        rawRewardData[index] = {
            factionName: factionName,
            respectAmount: respectAmount,
            items: rawItems
        };
    }

    // FIXED CSS SELECTOR - robust partial matching
    const checkRows = async function() {
        console.log("RWAwardValue: Checking for rows...");

        // Try multiple selector strategies to find the reward rows
        let selectedElements = [];

        // Strategy 1: Use partial class name matching (most reliable)
        selectedElements = document.querySelectorAll("div[class*='memberBonusRow']");

        // Strategy 2: If that fails, try other patterns
        if (selectedElements.length === 0) {
            selectedElements = document.querySelectorAll("div[class*='bonusRow']");
        }

        // Strategy 3: Look for text patterns that indicate bonus rows
        if (selectedElements.length === 0) {
            const allDivs = document.querySelectorAll('div');
            selectedElements = Array.from(allDivs).filter(div => {
                const text = div.innerText || '';
                return text.includes('ranked up from') || text.includes('ranked down from');
            });
        }

        console.log("RWAwardValue: Found", selectedElements.length, "rows");

        if (selectedElements.length > 0) {
            console.log("RWAwardValue: First element text:", selectedElements[0].innerText);
        }

        if (selectedElements.length == 2) {
            console.log("RWAwardValue: Found both rows, processing...");
            clearInterval(timer);
            try {
                await valueRow(selectedElements[0], 0);
                await valueRow(selectedElements[1], 1);
                console.log("RWAwardValue: Data collected, calculating values...");

                // Calculate item.calculatedValue for all items BEFORE creating the display
                // This prevents the "?" flash issue
                recalculateRewardValues();

                console.log("RWAwardValue: Values calculated, creating containers...");
                setTimeout(function() { createAndDisplayContainers(); }, 100);
            } catch (error) {
                console.error("RWAwardValue: Error processing rows:", error);
            }
        }
    };

    // ========================================
    // SCRIPT INITIALIZATION
    // ========================================

    // Start checking for reward tables
    let timer = setInterval(checkRows, 200);

    // Start theme monitoring
    monitorThemeChanges();

    console.log("RWAwardValue: Script setup complete v3.2");
})();