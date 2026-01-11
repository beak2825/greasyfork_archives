// ==UserScript==
// @name         pokespy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Help with eBay listings with TCGdex integration and PriceCharting data extraction
// @author       bobjoepie
// @match        https://www.ebay.com/*
// @match        https://www.ebay.co.uk/*
// @match        https://www.pricecharting.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551604/pokespy.user.js
// @updateURL https://update.greasyfork.org/scripts/551604/pokespy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // DEBUG MODE CONFIGURATION
    // ============================================================================
    const DEBUG_MODE = false; // Set to false for production/performance mode
    
    // Logging wrapper - only logs if DEBUG_MODE is true
    const debugLog = (...args) => {
        if (DEBUG_MODE) console.log(...args);
    };
    
    // Timing configuration based on mode
    const TIMING = {
        // PriceCharting data polling
        POLL_INTERVAL: DEBUG_MODE ? 500 : 200,        // How often to check for data (ms)
        POLL_MAX_ATTEMPTS: DEBUG_MODE ? 30 : 60,      // Max attempts before timeout
        
        // Button processing batches
        BATCH_PROCESSING_DELAY: DEBUG_MODE ? 100 : 50, // Delay between batches (ms)
        
        // Cache duration
        CACHE_DURATION: 60000, // 1 minute (same for both modes)
        
        // eBay Browse API polling interval (ms)
        API_POLL_INTERVAL: 18000, // 18 seconds - adjust this to change API polling frequency
    };
    
    debugLog(`🔧 Debug mode: ${DEBUG_MODE ? 'ENABLED' : 'DISABLED'}`);
    debugLog(`⏱️ Timing config:`, TIMING);

    // Detect which site we're on
    const currentSite = window.location.hostname;
    const isEbay = currentSite.includes('ebay.com') || currentSite.includes('ebay.co.uk');
    const isPriceCharting = currentSite.includes('pricecharting.com');

    debugLog(`🔍 Script running on: ${currentSite}`);

    if (isEbay) {
        initializeEbayFunctionality();
    } else if (isPriceCharting) {
        initializePriceChartingFunctionality();
    }

    // ============================================================================
    // SHARED DATA STORAGE FUNCTIONS (using Tampermonkey's cross-site storage)
    // ============================================================================

    // Store card search data for cross-site access
    function storePriceChartingRequest(cardData) {
        const timestamp = Date.now();
        const key = `pc_request_${timestamp}`;
        GM_setValue(key, {
            ...cardData,
            timestamp: timestamp,
            source: 'ebay'
        });
        debugLog(`💾 Stored PriceCharting request:`, cardData);
        return key;
    }

    // Store extracted PriceCharting data
    function storePriceChartingData(cardKey, priceData) {
        GM_setValue(`${cardKey}_data`, {
            ...priceData,
            timestamp: Date.now(),
            source: 'pricecharting'
        });
        debugLog(`💾 Stored PriceCharting data for ${cardKey}:`, priceData);
    }

    // Get stored data
    function getStoredData(key) {
        return GM_getValue(key, null);
    }

    // Store listing display cache (persists across page reloads)
    // Only store raw data, not HTML - we'll reconstruct the display each time
    function storeListingDisplayCache(listingUrl, displayData) {
        const cacheKey = `listing_cache_${btoa(listingUrl).substring(0, 50)}`;
        GM_setValue(cacheKey, {
            cardName: displayData.cardName,
            setName: displayData.setName,
            prices: displayData.prices,
            detectedGrade: displayData.detectedGrade,
            extractedCardName: displayData.extractedCardName,
            extractedSetName: displayData.extractedSetName,
            extractedCardNumber: displayData.extractedCardNumber,
            lastUpdated: displayData.lastUpdated,
            url: displayData.url,
            imageUrl: displayData.imageUrl,
            timestamp: Date.now(),
            originalUrl: listingUrl
        });
        debugLog(`💾 Cached listing data for: ${listingUrl}`);
    }

    // Get listing display cache
    function getListingDisplayCache(listingUrl) {
        const cacheKey = `listing_cache_${btoa(listingUrl).substring(0, 50)}`;
        const cached = GM_getValue(cacheKey, null);
        
        if (cached) {
            const age = Date.now() - cached.timestamp;
            const ageMinutes = (age / 1000 / 60).toFixed(1);
            debugLog(`🔍 Cache found for key: ${cacheKey.substring(0, 30)}... (age: ${ageMinutes} min)`);
            
            // Check if cache is still valid (30 minutes)
            if (age < (30 * 60 * 1000)) {
                debugLog(`✅ Cache is valid (< 30 min)`);
                return cached;
            } else {
                debugLog(`❌ Cache expired (> 30 min)`);
            }
        }
        
        return null;
    }

    // Clean up old data (older than 1 hour for requests, 30 minutes for listing caches)
    function cleanupOldData() {
        const keys = GM_listValues();
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);

        keys.forEach(key => {
            if (key.startsWith('pc_request_')) {
                const data = GM_getValue(key);
                if (data && data.timestamp < oneHourAgo) {
                    GM_deleteValue(key);
                    GM_deleteValue(`${key}_data`);
                }
            } else if (key.startsWith('listing_cache_')) {
                const data = GM_getValue(key);
                if (data && data.timestamp < thirtyMinutesAgo) {
                    GM_deleteValue(key);
                }
            }
        });
    }

    // ============================================================================
    // TITLE CLEANING UTILITY
    // ============================================================================

    // Clean eBay item titles by removing "Picture X of Y" text that appears in image alt attributes
    function cleanEbayTitle(title) {
        if (!title) return title;
        
        // Remove "- Picture X of Y" or " - Picture X of Y" patterns (common in eBay image alt text)
        // Examples: "POKEMON CARD NAME - Picture 1 of 3" -> "POKEMON CARD NAME"
        const cleaned = title
            .replace(/\s*-\s*Picture\s+\d+\s+of\s+\d+\s*$/i, '')  // Remove from end
            .replace(/\s*-\s*Picture\s+\d+\s+of\s+\d+/i, '')      // Remove from middle
            .trim();
        
        if (cleaned !== title) {
            debugLog(`🧹 Cleaned eBay title: "${title}" -> "${cleaned}"`);
        }
        
        return cleaned;
    }

    // ============================================================================
    // POPUP PERMISSION HELPER
    // ============================================================================

    function checkPopupPermissions() {
        // Check if user has been notified before
        const hasBeenNotified = GM_getValue('popup_permission_notified', false);
        
        if (!hasBeenNotified) {
            // Show notification on first use
            showPopupPermissionNotification();
            GM_setValue('popup_permission_notified', true);
        }
    }

    function showPopupPermissionNotification() {
        const notification = document.createElement('div');
        notification.id = 'pokespy-popup-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px 32px;
            border-radius: 12px;
            z-index: 100000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            max-width: 500px;
            border: 2px solid #5a67d8;
        `;

        notification.innerHTML = `
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 12px; text-align: center;">
                🚀 PokeSpy Setup Required
            </div>
            <div style="line-height: 1.6; margin-bottom: 16px;">
                <p style="margin: 0 0 12px 0;">
                    PokeSpy needs to open PriceCharting.com in popup windows to fetch card prices automatically.
                </p>
                <p style="margin: 0 0 12px 0; font-weight: bold;">
                    📌 Please allow popups for eBay in your browser settings.
                </p>
                <p style="margin: 0; font-size: 12px; opacity: 0.9;">
                    The popups will close automatically after fetching data (usually within 1-2 seconds).
                </p>
            </div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="pokespy-popup-understood" style="
                    padding: 10px 24px;
                    background: #43b581;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                ">Got it!</button>
                <button id="pokespy-popup-help" style="
                    padding: 10px 24px;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid white;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                ">Show Me How</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Got it button
        document.getElementById('pokespy-popup-understood').addEventListener('click', () => {
            notification.remove();
        });

        // Help button
        document.getElementById('pokespy-popup-help').addEventListener('click', () => {
            notification.innerHTML = `
                <div style="font-size: 18px; font-weight: bold; margin-bottom: 12px; text-align: center;">
                    📖 How to Allow Popups
                </div>
                <div style="line-height: 1.6; margin-bottom: 16px; text-align: left;">
                    <p style="margin: 0 0 8px 0; font-weight: bold;">Chrome / Edge:</p>
                    <ol style="margin: 0 0 12px 0; padding-left: 20px;">
                        <li>Click the popup blocked icon <span style="background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 3px;">🚫</span> in the address bar</li>
                        <li>Select "Always allow popups from [ebay.com]"</li>
                        <li>Click "Done"</li>
                    </ol>
                    
                    <p style="margin: 12px 0 8px 0; font-weight: bold;">Firefox:</p>
                    <ol style="margin: 0 0 12px 0; padding-left: 20px;">
                        <li>Click the popup blocked icon in the address bar</li>
                        <li>Click "Preferences" → "Allow popups for ebay.com"</li>
                    </ol>

                    <p style="margin: 12px 0 0 0; font-size: 12px; opacity: 0.9;">
                        💡 You only need to do this once!
                    </p>
                </div>
                <div style="text-align: center;">
                    <button id="pokespy-popup-close" style="
                        padding: 10px 24px;
                        background: #43b581;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Close</button>
                </div>
            `;

            document.getElementById('pokespy-popup-close').addEventListener('click', () => {
                notification.remove();
            });
        });

        // Add hover effects
        const buttons = notification.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
        });
    }

    function showPopupBlockedWarning(listingElement) {
        // Show a small warning badge on the button
        const pcButton = listingElement?.querySelector('.pricecharting-direct-btn');
        if (pcButton) {
            pcButton.style.background = '#e74c3c';
            pcButton.title = '❌ Popup blocked! Please allow popups for eBay to use this feature.';
            pcButton.textContent = '🚫 Blocked';
        }

        // Check if we should show the full notification (only once per session)
        const hasShownWarning = sessionStorage.getItem('pokespy_popup_warning_shown');
        if (!hasShownWarning) {
            sessionStorage.setItem('pokespy_popup_warning_shown', 'true');
            
            const warning = document.createElement('div');
            warning.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #e74c3c;
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                z-index: 99999;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 13px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                max-width: 350px;
                animation: slideIn 0.3s ease-out;
            `;

            warning.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px; font-size: 15px;">
                    🚫 Popup Blocked!
                </div>
                <div style="line-height: 1.4; margin-bottom: 12px;">
                    PokeSpy needs to open popups to fetch prices. Please allow popups for eBay.
                </div>
                <button id="pokespy-warning-ok" style="
                    padding: 6px 16px;
                    background: white;
                    color: #e74c3c;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                    cursor: pointer;
                ">OK</button>
            `;

            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(warning);

            document.getElementById('pokespy-warning-ok').addEventListener('click', () => {
                warning.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => warning.remove(), 300);
            });

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.style.animation = 'slideIn 0.3s ease-out reverse';
                    setTimeout(() => warning.remove(), 300);
                }
            }, 10000);
        }
    }

    // ============================================================================
    // LISTING NOTES FUNCTIONALITY (SHARED BETWEEN SEARCH AND ITEM PAGES)
    // ============================================================================

    // Store and retrieve notes (using listing ID for portability)
    function storeListingNote(listingId, noteData) {
        const noteKey = `listing_note_${listingId}`;
        GM_setValue(noteKey, {
            rating: noteData.rating, // 'good', 'neutral', 'bad'
            description: noteData.description,
            timestamp: Date.now()
        });
        debugLog(`💾 Stored note for listing ID: ${listingId}`);
    }

    function getListingNote(listingId) {
        const noteKey = `listing_note_${listingId}`;
        return GM_getValue(noteKey, null);
    }

    // Helper functions for ratings
    function getRatingIcon(rating) {
        switch(rating) {
            case 'good': return '✓';
            case 'neutral': return '−';
            case 'bad': return '✕';
            default: return '📝';
        }
    }

    function getRatingColor(rating) {
        switch(rating) {
            case 'good': return '#27ae60';
            case 'neutral': return '#f39c12';
            case 'bad': return '#e74c3c';
            default: return 'rgba(255, 255, 255, 0.9)';
        }
    }

    // Wrapper for item page that refreshes the panel after note changes
    function openNoteModalWithRefresh(panel, listingId, rating, existingDescription = '') {
        // Remove any existing modal
        const existingModal = document.getElementById('pokespy-note-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'pokespy-note-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #2f3136;
            color: white;
            padding: 24px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            animation: slideIn 0.3s ease;
        `;

        const ratingColor = getRatingColor(rating);
        const ratingIcon = getRatingIcon(rating);

        modalContent.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: ${ratingColor}; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-right: 12px;">
                    ${ratingIcon}
                </div>
                <div>
                    <div style="font-size: 18px; font-weight: bold;">Edit Note</div>
                    <div style="font-size: 12px; opacity: 0.7;">${rating.charAt(0).toUpperCase() + rating.slice(1)} Rating</div>
                </div>
            </div>
            <textarea id="pokespy-note-textarea" placeholder="Why did you choose this rating?" style="
                width: 100%;
                min-height: 120px;
                padding: 12px;
                background: #40444b;
                border: 2px solid ${ratingColor};
                border-radius: 8px;
                color: white;
                font-family: inherit;
                font-size: 14px;
                resize: vertical;
                margin-bottom: 16px;
            ">${existingDescription}</textarea>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button id="pokespy-note-cancel" style="
                    padding: 10px 20px;
                    background: #5865f2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                ">Cancel</button>
                <button id="pokespy-note-delete" style="
                    padding: 10px 20px;
                    background: #ed4245;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    display: ${existingDescription ? 'block' : 'none'};
                ">Delete</button>
                <button id="pokespy-note-save" style="
                    padding: 10px 20px;
                    background: ${ratingColor};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                ">Save Note</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Focus textarea
        const textarea = document.getElementById('pokespy-note-textarea');
        textarea.focus();

        // Event handlers
        document.getElementById('pokespy-note-cancel').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('pokespy-note-delete').addEventListener('click', () => {
            const noteKey = `listing_note_${listingId}`;
            GM_deleteValue(noteKey);
            
            modal.remove();
            
            // Refresh the panel by reloading the page
            window.location.reload();
        });

        document.getElementById('pokespy-note-save').addEventListener('click', () => {
            const description = textarea.value.trim();
            
            storeListingNote(listingId, {
                rating: rating,
                description: description
            });

            modal.remove();
            
            // Refresh the panel by reloading the page
            window.location.reload();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // ============================================================================
    // EBAY FUNCTIONALITY
    // ============================================================================

    function initializeEbayFunctionality() {
        debugLog('🛒 Initializing eBay functionality...');

        // Clean up old data on startup
        cleanupOldData();

        // Check and notify about popup permissions
        checkPopupPermissions();

        // Cache for sets data
        let setsCache = null;
        let setsCacheLoaded = false;

        // Load and cache sets on startup
        async function loadSetsCache() {
            if (setsCacheLoaded) return setsCache;

            try {
                debugLog('Loading TCGdex sets cache...');
                const response = await fetch('https://api.tcgdex.net/v2/en/sets', {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    setsCache = await response.json();
                    setsCacheLoaded = true;
                    debugLog(`✓ Loaded ${Array.isArray(setsCache) ? setsCache.length : 'unknown number of'} sets into cache`);
                    return setsCache;
                } else {
                    console.warn(`Failed to load sets cache: ${response.status} ${response.statusText}`);
                    setsCache = [];
                    setsCacheLoaded = true;
                    return setsCache;
                }
            } catch (error) {
                console.warn('Error loading sets cache:', error);
                setsCache = [];
                setsCacheLoaded = true;
                return setsCache;
            }
        }

        // Find sets by card count from cache
        function findSetsByCardCount(cardCount) {
            if (!setsCache || !Array.isArray(setsCache)) {
                return [];
            }

            const matchingSets = [];
            // Convert to number to handle leading zeros (078 becomes 78)
            const targetCount = parseInt(cardCount, 10);

            for (let i = 0; i < setsCache.length; i++) {
                const set = setsCache[i];
                const official = set.cardCount?.official || set.cardCount?.total;
                if (official && parseInt(official, 10) === targetCount) {
                    matchingSets.push(set);
                }
            }

            return matchingSets;
        }

        // Card number patterns - easy to add new ones
        const CARD_PATTERNS = [
            {
                name: 'numeric',
                regex: /\b(\d{1,4})\/(\d{1,4})\b/,
                description: 'Numeric pattern like 108/106'
            },
            {
                name: 'number-letter',
                regex: /\b(\d{1,4}[a-zA-Z])\/(\d{1,4})\b/,
                description: 'Number-letter pattern like 177a/168'
            },
            {
                name: 'letter-number',
                regex: /\b([A-Za-z]{1,4}\d{1,4})\/([A-Za-z]{1,4}\d{1,4})\b/i,
                description: 'Letter-number pattern like GG69/GG70 or Tg20/Tg30'
            },
            {
                name: 'hash-number',
                regex: /\#(\d{1,4})\b/,
                description: 'Hash pattern like #238'
            },
            {
                name: 'single-letter-number',
                regex: /\b([A-Za-z]{1,4})(\d{1,3})\b/i,
                description: 'Single letter-number pattern like SV107, RC5, DP45, SM158, SWSH184, TG03, XY121'
            },
            {
                name: 'hash-letter-number',
                regex: /\#([A-Za-z]{1,4})(\d{1,3})\b/i,
                description: 'Hash letter-number pattern like #SV107, #RC5'
            },
            {
                name: 'standalone-number',
                regex: /\b(\d{3}|\d{2}|\d{1})\b/,
                description: 'Standalone number like "164" (last resort - prefers 3 digits, then 2, then 1)',
                exclude: /\b(?:PSA|BGS|CGC|SGC)\s+(\d{1,2}(?:\.\d)?)\b/i // Exclude grade numbers like "PSA 10", "BGS 9.5"
            }
        ];

        // Extract title and card numbers from eBay listings
        function extractListingInfo(listingElement) {
            const info = {
                title: null,
                cardNumber: null,
                setNumber: null,
                fullCardNumber: null,
                matchedPattern: null,
                setName: null, // Extracted set name from title
                pokemonName: null // Extracted Pokemon name (when no card number found)
            };

            // Try multiple selectors at once for better performance
            const titleElement = listingElement.querySelector('.s-card__title .su-styled-text, [role="heading"] span, .s-item__title span, h3 span, .x-item-title-label span');

            if (titleElement) {
                info.title = cleanEbayTitle(titleElement.textContent.trim());

                // Special case: Check for Black Star Promo patterns first
                // "Mew ex SVP 053 Pokemon TCG Scarlet Violet 151 Black Star Promo" -> SVP = Scarlet & Violet Promo
                // "SWSH BLACK STAR PROMO ARCEUS V #204" -> SWSH Black Star Promo
                // Check if title contains "BLACK STAR PROMO" or just "PROMO" anywhere
                const hasPromo = /BLACK\s+STAR\s+PROMO|PROMO/i.test(info.title);
                if (hasPromo) {
                    // Look for promo prefix: SVP, SWSH, SM, XY, BW, DP, HGSS (check most specific first, EX last)
                    // Order matters! Check SVP before SM, SWSH before SM, etc.
                    const prefixMatch = info.title.match(/\b(SVP|SWSH|HGSS|XY|SM|BW|DP)\b/i) || 
                                       info.title.match(/\b(EX)\s+(?:BLACK\s+STAR\s+)?PROMO/i); // Only match EX if followed by PROMO
                    if (prefixMatch) {
                        const promoPrefix = prefixMatch[1].toUpperCase();
                        const promoSetNames = {
                            'SVP': 'SVP Black Star Promos',
                            'SWSH': 'SWSH Black Star Promos',
                            'SM': 'SM Black Star Promos',
                            'XY': 'XY Black Star Promos',
                            'BW': 'BW Black Star Promos',
                            'DP': 'DP Black Star Promos',
                            'HGSS': 'HGSS Black Star Promos',
                            'EX': 'EX Black Star Promos'
                        };
                        info.setName = promoSetNames[promoPrefix] || `${promoPrefix} Black Star Promos`;
                        debugLog(`🔍 Promo detected: "${info.setName}" (found "${prefixMatch[1]}" + "PROMO" in title)`);
                    }
                }

                // Special case: Check if "151" appears as a set name (not as card number)
                // "POKEMON 151 MEW EX #163" -> 151 is set name, 163 is card number
                // "Scarlet & Violet 151 Pokémon TCG" -> 151 is set name
                // "Poliwhirl Illustration Rare 2023 Scarlet & Violet 151 Pokémon TCG PSA 10" -> 151 is set name
                // "POKEMON SCARLET VIOLET MEW 151/165" -> 151 is card number (will be caught by numeric pattern)
                const set151Match = info.title.match(/(?:Scarlet\s*&\s*Violet|Pokemon|Pokémon)\s+151(?:\W|$)/i);
                const has151AsSlash = info.title.match(/151\s*\/\s*\d+/);
                
                if (set151Match && !has151AsSlash) {
                    // "151" appears after "Scarlet & Violet" or "Pokemon" - treat as set name
                    debugLog(`🔍 Special case: "151" detected as set name (found after Scarlet & Violet/Pokemon): ${set151Match[0]}`);
                    info.setName = "151";
                    // Mark that 151 should NOT be used as a card number
                    info.skip151AsCardNumber = true;
                }

                // Try each pattern until we find a match
                for (const pattern of CARD_PATTERNS) {
                    const match = info.title.match(pattern.regex);
                    if (match) {
                        // Check if this match should be excluded (for standalone-number pattern)
                        if (pattern.exclude) {
                            const excludeMatch = info.title.match(pattern.exclude);
                            if (excludeMatch && excludeMatch[1] === match[1]) {
                                debugLog(`🔍 Skipping "${match[1]}" - matched exclude pattern (grade number)`);
                                continue; // Skip this pattern, try next one
                            }
                        }
                        
                        // Skip if this is "151" standalone number and we've already identified it as a set name
                        if (pattern.name === 'standalone-number' && match[1] === '151' && info.skip151AsCardNumber) {
                            debugLog(`🔍 Skipping "151" as card number - already identified as set name`);
                            continue; // Skip this pattern, try next one
                        }
                        
                        if (pattern.name === 'single-letter-number' || pattern.name === 'hash-letter-number') {
                            // Special handling for single letter-number patterns: complete localId format
                            info.cardNumber = match[1] + match[2]; // "SV" + "107" = "SV107", "RC" + "5" = "RC5", "SM" + "241" = "SM241", etc.
                            info.setNumber = null; // No set number for these patterns
                            info.fullCardNumber = match[1] + match[2]; // "SV107", "RC5", "DP45", "SM241", "SWSH184", etc.
                        } else if (pattern.name === 'hash-number') {
                            // Special handling for hash patterns: #238 format
                            info.cardNumber = match[1]; // Just the number: "238"
                            info.setNumber = null; // No set number for hash patterns
                            info.fullCardNumber = match[0]; // Full match: "#238"
                            debugLog(`🔍 Hash-number pattern detected: ${match[0]}`);
                            
                            // Try to extract set name from title - check if already extracted "151" as set name
                            if (!info.setName) {
                                // Try to extract set name - special handling for PROMO sets
                                // For promos: "SWSH BLACK STAR PROMO ARCEUS V #204" -> "SWSH BLACK STAR PROMO"
                                // For sets: "SHROUDED FABLE KINGDRA EX #131" -> "SHROUDED FABLE"
                                let setNameMatch = info.title.match(/(?:Pokemon|Pokémon)?\s*(?:TCG)?\s*((?:SWSH|SM|XY|SV|BW|DP|HGSS|EX)?\s*BLACK\s+STAR\s+PROMO(?:S)?)/i);
                                if (!setNameMatch) {
                                    // Extract 1-3 words after POKEMON/TCG (typical set names are 1-3 words)
                                    // "POKEMON SHROUDED FABLE KINGDRA" -> match "SHROUDED FABLE" (2 words)
                                    setNameMatch = info.title.match(/(?:Pokemon|Pokémon)?\s*(?:TCG)?\s*([A-Z][A-Za-z&-]+(?:\s+[A-Z&][A-Za-z&-]+){0,2})/i);
                                }
                                if (setNameMatch) {
                                    info.setName = setNameMatch[1].trim();
                                    debugLog(`🔍 Extracted set name from title: "${info.setName}"`);
                                }
                            } else {
                                debugLog(`🔍 Using pre-extracted set name: "${info.setName}"`);
                            }
                        } else if (pattern.name === 'standalone-number') {
                            // Special handling for standalone numbers: "164 Secret PSA" format
                            info.cardNumber = match[1]; // Just the number: "164"
                            info.setNumber = null; // No set number for standalone patterns
                            info.fullCardNumber = match[1]; // Just the number
                            debugLog(`🔍 Standalone number detected: ${match[1]}`);
                            
                            // Try to extract set name from title - check if already extracted "151" as set name
                            if (!info.setName) {
                                // Try to extract set name - special handling for PROMO sets
                                // For promos: "SWSH BLACK STAR PROMO ARCEUS V #204" -> "SWSH BLACK STAR PROMO"
                                // For sets: "SHROUDED FABLE KINGDRA EX #131" -> "SHROUDED FABLE"
                                let setNameMatch = info.title.match(/(?:Pokemon|Pokémon)?\s*(?:TCG)?\s*((?:SWSH|SM|XY|SV|BW|DP|HGSS|EX)?\s*BLACK\s+STAR\s+PROMO(?:S)?)/i);
                                if (!setNameMatch) {
                                    // Extract 1-3 words after POKEMON/TCG (typical set names are 1-3 words)
                                    // "POKEMON SHROUDED FABLE KINGDRA" -> match "SHROUDED FABLE" (2 words)
                                    setNameMatch = info.title.match(/(?:Pokemon|Pokémon)?\s*(?:TCG)?\s*([A-Z][A-Za-z&-]+(?:\s+[A-Z&][A-Za-z&-]+){0,2})/i);
                                }
                                if (setNameMatch) {
                                    info.setName = setNameMatch[1].trim();
                                    debugLog(`🔍 Extracted set name from title: "${info.setName}"`);
                                }
                            } else {
                                debugLog(`🔍 Using pre-extracted set name: "${info.setName}"`);
                            }
                        } else if (pattern.name === 'letter-number') {
                            // Special handling for letter-number slash patterns: GG44/GG70, RC24/RC25 format
                            info.cardNumber = match[1]; // Full card identifier: "GG44", "RC24", "Tg20"
                            // Check if the second part is also a letter-number combination
                            if (/^[A-Za-z]+\d+$/i.test(match[2])) {
                                // Both parts are letter-number (like GG44/GG70, Tg20/Tg30) - treat as localId search
                                info.setNumber = null;
                                debugLog(`🔍 Both parts are letter-number format: ${match[1]}/${match[2]} - using localId search`);
                            } else {
                                // Second part is numeric (like RC24/25) - extract set number
                                const setTotalMatch = match[2].match(/(\d+)$/);
                                info.setNumber = setTotalMatch ? setTotalMatch[1] : match[2];
                            }
                            info.fullCardNumber = match[0]; // Full match: "GG44/GG70", "RC24/RC25", "Tg20/Tg30"
                        } else {
                            // Standard handling for slash patterns: 108/106 format
                            info.cardNumber = match[1]; // First capture group
                            info.setNumber = match[2];   // Second capture group
                            info.fullCardNumber = match[0]; // Full match
                        }
                        info.matchedPattern = pattern.name; // Track which pattern matched
                        break; // Stop after first match
                    }
                }
                
                // Always try to extract set name for potential fallback (even if card number was found)
                if (info.title && !info.setName) {
                    debugLog(`🔍 Extracting set name from title for potential fallback`);
                    
                    // Common set names that might appear in titles (most specific first)
                    const setPatterns = [
                        // XY Series sets (specific names to avoid matching "EX" in Pokemon names)
                        /\b(Phantom Forces|Ancient Origins|BREAKthrough|BREAKpoint|Roaring Skies|Primal Clash)\b/i,
                        /\b(Steam Siege|Fates Collide|Generations|Evolutions|Flashfire|Furious Fists)\b/i,
                        // Sun & Moon Series
                        /\b(Sun & Moon|Burning Shadows|Crimson Invasion|Ultra Prism|Forbidden Light)\b/i,
                        /\b(Celestial Storm|Lost Thunder|Team Up|Unbroken Bonds|Unified Minds|Guardians Rising)\b/i,
                        // Sword & Shield Series
                        /\b(Cosmic Eclipse|Sword & Shield|Rebel Clash|Darkness Ablaze|Vivid Voltage)\b/i,
                        /\b(Shining Fates|Battle Styles|Chilling Reign|Evolving Skies|Fusion Strike)\b/i,
                        /\b(Brilliant Stars|Astral Radiance|Lost Origin|Silver Tempest)\b/i,
                        // Scarlet & Violet Series
                        /\b(Prismatic Evolutions?|Phantasmal Flames|Paldea Evolved|Obsidian Flames|Paradox Rift|Paldean Fates|Temporal Forces)\b/i,
                        /\b(Twilight Masquerade|Shrouded Fable|Stellar Crown|Surging Sparks|Mega Evolutions?)\b/i,
                        /\b(151)\b/i,
                        // Older series (specific names only, no generic "EX")
                        /\b(XY|Black & White|HeartGold & SoulSilver|Diamond & Pearl)\b/i,
                        // EX series sets (must have "EX" followed by set name, not just "EX")
                        /\b(EX\s+(?:Deoxys|Emerald|Unseen Forces|Delta Species|Legend Maker|Holon Phantoms|Crystal Guardians|Dragon Frontiers|Power Keepers|Team Rocket Returns|FireRed & LeafGreen|Team Magma vs Team Aqua|Hidden Legends|Ruby & Sapphire|Sandstorm))\b/i,
                    ];
                    
                    // Try to find a set name
                    for (const pattern of setPatterns) {
                        const setMatch = info.title.match(pattern);
                        if (setMatch) {
                            info.setName = setMatch[1];
                            debugLog(`  Found set name: "${info.setName}"`);
                            debugLog(`  Will match full title against card names in this set`);
                            break;
                        }
                    }
                }
            }

            return info;
        }

        // Search for a card by matching eBay title against card names in a specific set
        async function searchByTitleInSet(setNameHint, ebayTitle) {
            try {
                debugLog(`\n🔍 Matching title against cards in set: "${setNameHint}"`);
                debugLog(`  eBay title: "${ebayTitle}"`);
                
                // Normalize set name and find matching set IDs
                await loadSetsCache();
                
                const normalizedSetHint = setNameHint.toUpperCase()
                    .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                    .replace(/PROMOS?$/, 'PROMO');
                
                const matchingSets = setsCache?.filter(set => {
                    const normalizedSetName = set.name.toUpperCase()
                        .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                        .replace(/PROMOS?$/, 'PROMO');
                    return normalizedSetName.includes(normalizedSetHint) || normalizedSetHint.includes(normalizedSetName);
                }) || [];
                
                if (matchingSets.length === 0) {
                    debugLog(`  No matching sets found for hint: "${setNameHint}"`);
                    return null;
                }
                
                debugLog(`  Found ${matchingSets.length} matching set(s)`);
                
                // Normalize eBay title for comparison (remove common descriptors but keep Pokemon name)
                const normalizedTitle = ebayTitle.toUpperCase()
                    .replace(/POKÉMON|POKEMON|TCG/gi, '')
                    .replace(/\b\d{4}\b/g, '') // Remove years
                    .replace(/\b(?:PSA|BGS|CGC|SGC)\s+\d+(?:\.\d)?\b/gi, '') // Remove grades
                    .replace(/\b(?:ENGLISH|JAPANESE|KOREAN|GERMAN|FRENCH|ITALIAN|SPANISH)\b/gi, '') // Remove languages
                    .replace(/[^A-Z0-9\s]/g, ' ') // Replace special chars with spaces
                    .replace(/\s+/g, ' ')
                    .trim();
                
                debugLog(`  Normalized title: "${normalizedTitle}"`);
                
                // Try each matching set
                for (const set of matchingSets) {
                    debugLog(`\n  Fetching cards from set: ${set.name} (${set.id})`);
                    
                    const response = await fetch(`https://api.tcgdex.net/v2/en/sets/${set.id}`);
                    if (!response.ok) continue;
                    
                    const setData = await response.json();
                    const cards = setData.cards || [];
                    
                    debugLog(`    Got ${cards.length} cards from set`);
                    
                    // Score each card based on title similarity
                    const scoredCards = [];
                    
                    for (const card of cards) {
                        const cardName = (card.name || '').toUpperCase();
                        const normalizedCardName = cardName
                            .replace(/[^A-Z0-9\s]/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
                        
                        // Calculate how much of the card name appears in the title
                        const cardNameWords = normalizedCardName.split(' ').filter(w => w.length > 0);
                        const titleWords = normalizedTitle.split(' ').filter(w => w.length > 0);
                        
                        // Count matching words
                        let matchedWords = 0;
                        for (const cardWord of cardNameWords) {
                            if (titleWords.some(titleWord => 
                                titleWord === cardWord || 
                                titleWord.includes(cardWord) || 
                                cardWord.includes(titleWord)
                            )) {
                                matchedWords++;
                            }
                        }
                        
                        // Score is percentage of card name words found in title
                        const score = cardNameWords.length > 0 ? (matchedWords / cardNameWords.length) * 100 : 0;
                        
                        if (score >= 50) { // Only consider cards with at least 50% word match
                            scoredCards.push({ card, score, cardName });
                            debugLog(`      ${cardName} - Match: ${score.toFixed(0)}% (${matchedWords}/${cardNameWords.length} words)`);
                        }
                    }
                    
                    if (scoredCards.length === 0) {
                        debugLog(`    No good matches found in this set`);
                        continue;
                    }
                    
                    // Sort by score descending
                    scoredCards.sort((a, b) => b.score - a.score);
                    
                    // Get top matches (within 10% of best score)
                    const bestScore = scoredCards[0].score;
                    const topMatches = scoredCards.filter(sc => sc.score >= bestScore - 10);
                    
                    debugLog(`\n    Top ${topMatches.length} match(es):`);
                    topMatches.forEach((sc, i) => {
                        debugLog(`      ${i + 1}. ${sc.cardName} - ${sc.score.toFixed(0)}%`);
                    });
                    
                    // If multiple top matches, use rarity indicators and pricing to pick the best one
                    if (topMatches.length > 1) {
                        debugLog(`\n    Fetching full details for tie-breaking...`);
                        
                        // Check if title has rarity indicators - be specific to distinguish SIR from IR
                        const hasMUR = /\b(MEGA\s+ULTRA\s+RARE|MUR)\b/i.test(ebayTitle);
                        const hasSIR = /\b(SPECIAL\s+ILLUSTRATION\s+RARE|SIR)\b/i.test(ebayTitle);
                        const hasIR = /\b(ILLUSTRATION\s+RARE|IR)\b/i.test(ebayTitle);
                        const hasSpecialRarity = hasMUR || hasSIR || hasIR;
                        
                        // Determine priority - MUR > SIR > IR (if multiple mentioned)
                        // Default to SIR if no rarity specified
                        let targetRarity = 'SIR'; // Default to SIR
                        if (hasMUR) {
                            targetRarity = 'MUR';
                        } else if (hasSIR) {
                            targetRarity = 'SIR';
                        } else if (hasIR) {
                            targetRarity = 'IR';
                        }
                        
                        if (hasSpecialRarity) {
                            debugLog(`    🌟 Title indicates special rarity (${targetRarity}) - will prioritize matching card`);
                        } else {
                            debugLog(`    🌟 No rarity specified - defaulting to ${targetRarity}`);
                        }
                        
                        const fullCards = await Promise.all(
                            topMatches.map(async sc => {
                                const detailResponse = await fetch(`https://api.tcgdex.net/v2/en/cards/${sc.card.id}`);
                                if (!detailResponse.ok) return null;
                                const fullCard = await detailResponse.json();
                                const titleSimilarity = calculateTitleSimilarity(ebayTitle, fullCard.name);
                                
                                // Check if card rarity matches the specific type we're looking for
                                const cardRarity = (fullCard.rarity?.name || fullCard.rarity || '').toUpperCase();
                                debugLog(`      Fetched ${fullCard.name} #${fullCard.localId}`);
                                debugLog(`        Rarity object:`, fullCard.rarity);
                                debugLog(`        Rarity string: "${cardRarity}"`);
                                
                                // Determine card's rarity type and priority
                                let cardRarityType = null;
                                let cardRarityPriority = 0;
                                
                                if (cardRarity.includes('MEGA') && cardRarity.includes('ULTRA')) {
                                    cardRarityType = 'MUR';
                                    cardRarityPriority = 3; // Highest priority
                                } else if (cardRarity.includes('SPECIAL') && cardRarity.includes('ILLUSTRATION')) {
                                    cardRarityType = 'SIR';
                                    cardRarityPriority = 2;
                                } else if (cardRarity.includes('ILLUSTRATION') && !cardRarity.includes('SPECIAL')) {
                                    cardRarityType = 'IR';
                                    cardRarityPriority = 1;
                                }
                                
                                // Match rarity based on target (if specified) or use priority
                                let rarityMatch = false;
                                if (targetRarity) {
                                    // Specific rarity requested in title
                                    rarityMatch = (cardRarityType === targetRarity);
                                } else if (cardRarityType) {
                                    // No specific rarity in title, but card has special rarity
                                    rarityMatch = true; // All special rarities match when not specified
                                }
                                
                                debugLog(`        Rarity type: ${cardRarityType || 'none'} (priority: ${cardRarityPriority})`);
                                debugLog(`        Rarity match: ${rarityMatch} (target: ${targetRarity || 'any'})`);
                                
                                return { 
                                    card: fullCard, 
                                    similarity: titleSimilarity,
                                    rarity: cardRarity,
                                    rarityType: cardRarityType,
                                    rarityPriority: cardRarityPriority,
                                    rarityMatch: rarityMatch
                                };
                            })
                        );
                        
                        const validCards = fullCards.filter(fc => fc !== null);
                        if (validCards.length > 0) {
                            // Always prefer cards with matching rarity (including default SIR)
                            const specialCards = validCards.filter(fc => fc.rarityMatch);
                            if (specialCards.length > 0) {
                                debugLog(`    Found ${specialCards.length} card(s) matching target rarity (${targetRarity}):`);
                                specialCards.forEach(fc => {
                                    debugLog(`      ${fc.card.name} - ${fc.rarity} (priority ${fc.rarityPriority})`);
                                });
                                
                                // Sort by rarity priority first (MUR > SIR > IR), then by similarity
                                specialCards.sort((a, b) => 
                                    (b.rarityPriority - a.rarityPriority) || (b.similarity - a.similarity)
                                );
                                const best = specialCards[0];
                                debugLog(`    🎯 BEST MATCH (${best.rarityType || 'rarity'} priority): ${best.card.name} - ${best.rarity} (${best.similarity.toFixed(1)}%)`);
                                return best.card;
                            }
                            
                            // Otherwise, sort by similarity
                            validCards.sort((a, b) => b.similarity - a.similarity);
                            const best = validCards[0];
                            debugLog(`    🎯 BEST MATCH: ${best.card.name} - ${best.rarity} (${best.similarity.toFixed(1)}%)`);
                            return best.card;
                        }
                    }
                    
                    // Single best match - fetch full details
                    const bestMatch = topMatches[0];
                    debugLog(`    Fetching full details for: ${bestMatch.cardName}`);
                    const detailResponse = await fetch(`https://api.tcgdex.net/v2/en/cards/${bestMatch.card.id}`);
                    if (!detailResponse.ok) continue;
                    
                    const fullCard = await detailResponse.json();
                    debugLog(`    ✅ Found card: ${fullCard.name} #${fullCard.localId}`);
                    return fullCard;
                }
                
                debugLog(`  ⚠ No matching cards found in any set`);
                return null;
                
            } catch (error) {
                console.error('Error in searchByTitleInSet:', error);
                return null;
            }
        }

        // Try to fetch cards directly from a specific set
        async function tryDirectSetSearch(cardNumber, setNameHint, ebayTitle = '') {
            try {
                // Normalize set name and find matching set IDs
                await loadSetsCache();
                
                const normalizedSetHint = setNameHint.toUpperCase()
                    .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                    .replace(/PROMOS?$/, 'PROMO');
                
                const matchingSets = setsCache?.filter(set => {
                    const normalizedSetName = set.name.toUpperCase()
                        .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                        .replace(/PROMOS?$/, 'PROMO');
                    return normalizedSetName.includes(normalizedSetHint) || normalizedSetHint.includes(normalizedSetName);
                }) || [];
                
                if (matchingSets.length === 0) {
                    debugLog(`  No matching sets found for hint: "${setNameHint}"`);
                    return null;
                }
                
                debugLog(`  🔍 Trying direct set search in: ${matchingSets.map(s => s.name).join(', ')}`);
                
                // Try each matching set
                for (const set of matchingSets) {
                    try {
                        const setUrl = `https://api.tcgdex.net/v2/en/sets/${set.id}`;
                        debugLog(`    Fetching all cards from set ${set.id}: ${setUrl}`);
                        
                        const response = await fetch(setUrl);
                        if (!response.ok) continue;
                        
                        const setData = await response.json();
                        const cards = setData.cards || [];
                        
                        debugLog(`    ✓ Loaded ${cards.length} cards from ${set.name}`);
                        
                        // Find card with matching localId
                        const matchingCards = cards.filter(card => 
                            card.localId === cardNumber || 
                            card.localId === cardNumber.toUpperCase() ||
                            parseInt(card.localId, 10) === parseInt(cardNumber, 10)
                        );
                        
                        if (matchingCards.length > 0) {
                            debugLog(`    ✓ Found ${matchingCards.length} card(s) with localId ${cardNumber} in ${set.name}`);
                            
                            // If multiple matches or we have eBay title, fetch full details for similarity matching
                            if (matchingCards.length > 1 && ebayTitle) {
                                // Fetch full details for each matching card
                                const fullCards = [];
                                for (const card of matchingCards) {
                                    try {
                                        const cardDetailUrl = `https://api.tcgdex.net/v2/en/cards/${card.id}`;
                                        const detailResponse = await fetch(cardDetailUrl);
                                        if (detailResponse.ok) {
                                            const fullCard = await detailResponse.json();
                                            fullCards.push(fullCard);
                                        }
                                    } catch (err) {
                                        debugLog(`      Error fetching details for ${card.id}`);
                                    }
                                }
                                
                                // Use similarity matching to find best card
                                let bestMatch = fullCards[0];
                                let bestSimilarity = 0;
                                
                                fullCards.forEach(card => {
                                    const similarity = calculateTitleSimilarity(ebayTitle, card.name);
                                    debugLog(`      ${card.name}: ${(similarity * 100).toFixed(1)}% similarity`);
                                    if (similarity > bestSimilarity) {
                                        bestSimilarity = similarity;
                                        bestMatch = card;
                                    }
                                });
                                
                                debugLog(`    🎯 Best match: ${bestMatch.name} (${(bestSimilarity * 100).toFixed(1)}%)`);
                                return bestMatch;
                            } else {
                                // Single match or no title - fetch full details and return
                                const cardDetailUrl = `https://api.tcgdex.net/v2/en/cards/${matchingCards[0].id}`;
                                const detailResponse = await fetch(cardDetailUrl);
                                if (detailResponse.ok) {
                                    const fullCard = await detailResponse.json();
                                    debugLog(`    ✓ ${fullCard.name} from ${fullCard.set?.name}`);
                                    return fullCard;
                                }
                            }
                        }
                    } catch (setError) {
                        debugLog(`    Error fetching set ${set.id}:`, setError.message);
                    }
                }
                
                return null; // No card found in any matching set
            } catch (error) {
                debugLog(`  Error in direct set search:`, error.message);
                return null;
            }
        }

        // Search TCGdex API by localId when no set number is available
        async function searchTCGdexByLocalId(cardNumber, ebayTitle = '', setNameHint = null, skipFallback = false) {
            try {
                if (setNameHint) {
                    debugLog(`🔍 Using set name hint for filtering: "${setNameHint}"`);
                    
                    // OPTIMIZATION: If we have a strong set hint, try to fetch directly from that set first
                    // This is much faster than searching by localId and filtering
                    const directSetResult = await tryDirectSetSearch(cardNumber, setNameHint, ebayTitle);
                    if (directSetResult) {
                        debugLog(`✅ Found card via direct set search!`);
                        return directSetResult;
                    }
                    debugLog(`⚠ Direct set search didn't find card, falling back to localId search`);
                }
                
                // Create variations of the card number to handle zero-padding issues
                let cardNumberVariations;

                // For promo cards (SWSH291, SM241, etc.), don't create variations - use exactly as-is
                if (/^(SWSH|SM)[0-9]+$/i.test(cardNumber)) {
                    debugLog(`  Promo card detected: ${cardNumber} - using exact match only`);
                    cardNumberVariations = [cardNumber.toUpperCase()]; // Normalize to uppercase for API
                } else if (/^[A-Za-z]+\d+$/i.test(cardNumber)) {
                    // For letter-number patterns (RC24, GG69, TG20, etc.), normalize to uppercase
                    const normalizedCardNumber = cardNumber.toUpperCase();
                    debugLog(`  Letter-number pattern detected: ${cardNumber} - normalizing to uppercase: ${normalizedCardNumber}`);
                    cardNumberVariations = [normalizedCardNumber];
                } else {
                    // For regular numeric cards, create variations
                    const baseCardNumber = cardNumber.replace(/[a-zA-Z]+$/g, ''); // Remove trailing letters
                    cardNumberVariations = [
                        baseCardNumber, // Original: "238"
                        parseInt(baseCardNumber, 10).toString(), // Remove leading zeros: "238"
                        baseCardNumber.padStart(3, '0') // Add leading zeros: "238" -> "238"
                    ].filter(variation => variation && !isNaN(variation) && variation !== 'NaN'); // Filter out invalid variations
                }

                // Remove duplicates and filter out invalid entries
                const uniqueCardNumbers = [...new Set(cardNumberVariations)].filter(num => num && num !== 'NaN');
                debugLog(`  Card number variations to try: ${uniqueCardNumbers.join(', ')}`);

                let allFoundCards = [];

                // Try each card number variation
                for (const cardNum of uniqueCardNumbers) {
                    try {
                        const localIdUrl = `https://api.tcgdex.net/v2/en/cards?localId=${cardNum}`;
                        debugLog(`  Fetching cards with localId ${cardNum}: ${localIdUrl}`);

                        const response = await fetch(localIdUrl, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        });

                        if (response.ok) {
                            const cards = await response.json();

                            if (Array.isArray(cards) && cards.length > 0) {
                                debugLog(`    ✓ Found ${cards.length} card(s) with localId ${cardNum}`);

                                // If we have a set name hint, filter cards by set first to reduce API calls
                                let cardsToProcess = cards;
                                if (setNameHint && cards.length > 10) {
                                    // Normalize both hint and set names for matching
                                    const normalizedSetHint = setNameHint.toUpperCase()
                                        .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                                        .replace(/PROMOS?$/, 'PROMO'); // Normalize "PROMO" vs "PROMOS"
                                    debugLog(`      Filtering by set hint: "${setNameHint}" (normalized: "${normalizedSetHint}")`);
                                    
                                    // Load sets cache to get set IDs
                                    await loadSetsCache();
                                    
                                    // Find matching set IDs
                                    const matchingSets = setsCache?.filter(set => {
                                        const normalizedSetName = set.name.toUpperCase()
                                            .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                                            .replace(/PROMOS?$/, 'PROMO'); // Normalize "PROMO" vs "PROMOS"
                                        return normalizedSetName.includes(normalizedSetHint) || normalizedSetHint.includes(normalizedSetName);
                                    }) || [];
                                    
                                    if (matchingSets.length > 0) {
                                        const matchingSetIds = matchingSets.map(s => s.id);
                                        debugLog(`      Found matching sets: ${matchingSets.map(s => s.name).join(', ')}`);
                                        const filteredCards = cards.filter(card => matchingSetIds.some(setId => card.id.startsWith(setId + '-')));
                                        
                                        if (filteredCards.length > 0) {
                                            cardsToProcess = filteredCards;
                                            debugLog(`      Filtered to ${cardsToProcess.length} card(s) from matching sets`);
                                        } else {
                                            debugLog(`      ⚠ Filtering resulted in 0 cards - ignoring set hint and using all ${cards.length} cards`);
                                            cardsToProcess = cards;
                                        }
                                    }
                                }

                                // Add cards to list for similarity matching (use basic data for speed)
                                for (const card of cardsToProcess) {
                                    if (card && card.id) {
                                        allFoundCards.push(card);
                                    }
                                }
                                
                                if (cardsToProcess.length > 0 && cardsToProcess.length <= 10) {
                                    debugLog(`      Found ${cardsToProcess.length} card(s) to compare:${cardsToProcess.map(c => ' ' + c.name).join(',')}`);
                                }
                            } else {
                                debugLog(`    ✗ No cards found with localId ${cardNum}`);
                            }
                        } else {
                            debugLog(`    ✗ LocalId ${cardNum} not found: ${response.status} ${response.statusText}`);
                        }
                    } catch (error) {
                        debugLog(`    ✗ Error fetching localId ${cardNum}:`, error);
                    }
                }

                if (allFoundCards.length > 0) {
                    debugLog(`\n✓ Found ${allFoundCards.length} total card(s) with localId ${cardNumber}`);

                    // If multiple cards found and we have an eBay title, find the best match
                    let bestMatch = allFoundCards[0]; // Default to first card

                    if (allFoundCards.length > 1 && (ebayTitle || setNameHint)) {
                        debugLog(`\nComparing ${allFoundCards.length} cards against eBay title${setNameHint ? ' and set name' : ''}...`);

                        let bestSimilarity = -1;
                        let bestCard = null;
                        const MINIMUM_SIMILARITY_THRESHOLD = 0.25; // 25% minimum similarity

                        // First pass: Check for set identifier matches in eBay title
                        const ebayTitleUpper = ebayTitle ? ebayTitle.toUpperCase() : '';
                        const setNameHintUpper = setNameHint ? setNameHint.toUpperCase() : '';
                        let setMatchFound = false;

                        allFoundCards.forEach((card, index) => {
                            const similarity = ebayTitle ? calculateTitleSimilarity(ebayTitle, card.name) : 0;

                            // Extract set identifier from card ID (e.g., "svp-141" -> "SVP", "A4-141" -> "A4")
                            const setMatch = card.id.match(/^([^-]+)-/);
                            const setIdentifier = setMatch ? setMatch[1].toUpperCase() : null;
                            const cardSetName = (card.set?.name || '').toUpperCase();

                            // Normalize set names for comparison (remove prefixes and normalize PROMO/PROMOS)
                            const normalizedSetHint = setNameHintUpper
                                .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                                .replace(/PROMOS?$/, 'PROMO');
                            const normalizedCardSetName = cardSetName
                                .replace(/^(EX|XY|SM|SWSH|SV|BW|DP|HGSS)\s+/, '')
                                .replace(/PROMOS?$/, 'PROMO');

                            // Check if the set identifier or set name matches
                            let setBonus = 0;
                            if (setIdentifier && ebayTitleUpper.includes(setIdentifier)) {
                                setBonus = 0.5; // Large bonus for set ID match in title
                                setMatchFound = true;
                                debugLog(`  ${index + 1}. ${card.name} from ${card.set?.name || 'Unknown Set'} - Similarity: ${(similarity * 100).toFixed(1)}% + SET MATCH (${setIdentifier}) = ${((similarity + setBonus) * 100).toFixed(1)}%`);
                            } else if (setNameHint && (normalizedCardSetName.includes(normalizedSetHint) || normalizedSetHint.includes(normalizedCardSetName))) {
                                setBonus = 0.6; // Even larger bonus for set name match
                                setMatchFound = true;
                                debugLog(`  ${index + 1}. ${card.name} from ${card.set?.name || 'Unknown Set'} - Similarity: ${(similarity * 100).toFixed(1)}% + SET NAME MATCH = ${((similarity + setBonus) * 100).toFixed(1)}%`);
                            } else {
                                debugLog(`  ${index + 1}. ${card.name} from ${card.set?.name || 'Unknown Set'} - Similarity: ${(similarity * 100).toFixed(1)}%`);
                            }

                            const totalScore = similarity + setBonus;
                            if (totalScore > bestSimilarity) {
                                bestSimilarity = totalScore;
                                bestCard = card;
                            }
                        });

                        if (bestCard) {
                            bestMatch = bestCard;
                        }

                        // Check if best match meets minimum threshold (or has set match)
                        if (bestSimilarity >= MINIMUM_SIMILARITY_THRESHOLD || setMatchFound) {
                            const matchType = setMatchFound ? "with SET MATCH" : "by similarity";
                            debugLog(`\n🎯 BEST MATCH: ${bestMatch.name} from ${bestMatch.set?.name || 'Unknown Set'} (${(bestSimilarity * 100).toFixed(1)}% total score - ${matchType})`);
                        } else {
                            debugLog(`\n❌ NO GOOD MATCH: Best similarity was ${(bestSimilarity * 100).toFixed(1)}% (below ${(MINIMUM_SIMILARITY_THRESHOLD * 100).toFixed(1)}% threshold)`);
                            debugLog(`🔄 Falling back to highest similarity card: ${bestMatch.name} from ${bestMatch.set?.name || 'Unknown Set'}`);
                            // bestMatch already contains the highest similarity card (bestCard)
                            bestSimilarity = -1; // Reset similarity to indicate poor match
                        }
                    } else if (allFoundCards.length === 1) {
                        debugLog(`\n🎯 SINGLE MATCH FOUND: ${bestMatch.name} from ${bestMatch.set?.name || 'Unknown Set'}`);
                    } else {
                        debugLog(`\n🎯 USING FIRST MATCH: ${bestMatch.name} from ${bestMatch.set?.name || 'Unknown Set'} (no eBay title for comparison)`);
                    }

                    // Fetch full details for the best match only (optimization - 1 API call instead of potentially hundreds)
                    debugLog(`\n📡 Fetching full details for best match: ${bestMatch.name}`);
                    try {
                        const cardDetailUrl = `https://api.tcgdex.net/v2/en/cards/${bestMatch.id}`;
                        const cardDetailResponse = await fetch(cardDetailUrl);
                        
                        if (cardDetailResponse.ok) {
                            const fullCard = await cardDetailResponse.json();
                            bestMatch = fullCard; // Replace with full card data
                            debugLog(`✓ Loaded complete card data with set info: ${fullCard.set?.name || 'Unknown Set'}`);
                        } else {
                            debugLog(`⚠ Could not fetch full details (${cardDetailResponse.status}), using basic data`);
                        }
                    } catch (error) {
                        debugLog(`⚠ Error fetching full details:`, error.message, '- using basic data');
                    }

                    // Display the best match
                    debugLog(`\n🎉 FINAL RESULT FOR localId ${cardNumber}:`);
                    debugLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
                    debugLog(`Name: ${bestMatch.name}`);
                    debugLog(`Card Number: ${bestMatch.localId}/${bestMatch.set?.cardCount?.official || bestMatch.set?.cardCount?.total || '???'}`);
                    debugLog(`Set: ${bestMatch.set?.name || 'Unknown Set'} (${bestMatch.set?.id || 'unknown-id'})`);
                    debugLog(`Rarity: ${bestMatch.rarity || 'Unknown'}`);
                    debugLog(`HP: ${bestMatch.hp || 'N/A'}`);
                    debugLog(`Types: ${bestMatch.types?.join(', ') || 'Unknown'}`);

                    // Price information (simplified version)
                    if (bestMatch.pricing && bestMatch.pricing.tcgplayer) {
                        debugLog(`\n💰 TCGPLAYER PRICES:`);
                        const tcgPricing = bestMatch.pricing.tcgplayer;

                        debugLog(`  Last Updated: ${tcgPricing.updated || 'Unknown'}`);
                        debugLog(`  Currency: ${tcgPricing.unit || 'USD'}`);

                        if (tcgPricing['holofoil']) {
                            const holo = tcgPricing['holofoil'];
                            debugLog(`  Holofoil - Low: $${holo.lowPrice || 'N/A'}, Mid: $${holo.midPrice || 'N/A'}, High: $${holo.highPrice || 'N/A'}, Market: $${holo.marketPrice || 'N/A'}`);
                        }

                        if (tcgPricing['normal']) {
                            const normal = tcgPricing['normal'];
                            debugLog(`  Normal - Low: $${normal.lowPrice || 'N/A'}, Mid: $${normal.midPrice || 'N/A'}, High: $${normal.highPrice || 'N/A'}, Market: $${normal.marketPrice || 'N/A'}`);
                        }
                    } else {
                        debugLog(`💰 TCGPLAYER PRICES: Not available`);
                    }

                    // High quality image
                    const imageUrl = bestMatch.image?.high || bestMatch.image?.large || bestMatch.images?.large || bestMatch.imageUrl || bestMatch.image;
                    if (imageUrl) {
                        debugLog(`\n🖼️ High-Res Image: ${imageUrl}`);
                    }

                    // Market URLs
                    if (bestMatch.tcgPlayer?.url) {
                        debugLog(`🔗 TCGPlayer: ${bestMatch.tcgPlayer.url}`);
                    }

                    debugLog(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

                    // Return the best match
                    return bestMatch;

                } else {
                    debugLog(`No cards found with localId ${cardNumber}`);
                    debugLog('This could mean:');
                    debugLog('1. The card number doesn\'t exist in the API');
                    debugLog('2. The number format is different than expected');
                    debugLog('3. API connectivity issues');
                    
                    // Only open fallback search if not skipped (e.g., when called from PriceCharting URL generation)
                    if (!skipFallback) {
                        debugLog('\nTrying fallback search...');
                        await searchTCGdexFallback(cardNumber);
                    } else {
                        debugLog('Skipping fallback search (silent fail for PriceCharting)');
                    }
                    return null;
                }

            } catch (error) {
                console.error('Error searching TCGdex by localId:', error);
                debugLog('API request failed. This could be due to:');
                debugLog('1. Network connectivity issues');
                debugLog('2. API being temporarily down');
                debugLog('3. Rate limiting');

                debugLog('\nOpening TCGdex website as fallback...');
                const searchWindow = window.open(`https://www.tcgdex.dev/cards?search=${encodeURIComponent(cardNumber)}`, '_blank');
                if (searchWindow) {
                    debugLog('Opened TCGdex website search in new tab');
                }
                return null;
            }
        }

        // Add Google PriceCharting search button
        function addGooglePriceChartingButton(listingElement, cardNumber) {
            if (listingElement.querySelector('.google-pricecharting-btn')) return;

            const priceElement = listingElement.querySelector('.s-card__price, .s-item__price, .s-item__price-range, .notranslate');
            if (!priceElement || !cardNumber) return;

            const button = document.createElement('a');
            button.className = 'google-pricecharting-btn';
            button.href = `https://www.google.com/search?q=PriceCharting+${encodeURIComponent(cardNumber)}`;
            button.target = '_blank';
            button.textContent = '🔍';
            button.title = `Google search PriceCharting for ${cardNumber}`;

            Object.assign(button.style, {
                display: 'inline-block',
                marginLeft: '8px',
                padding: '2px 6px',
                background: '#e74c3c',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
                transition: 'background-color 0.2s'
            });

            if (!document.querySelector('#google-pc-button-styles')) {
                const style = document.createElement('style');
                style.id = 'google-pc-button-styles';
                style.textContent = '.google-pricecharting-btn:hover { background-color: #c0392b !important; }';
                document.head.appendChild(style);
            }

            priceElement.parentNode.insertBefore(button, priceElement.nextSibling);
        }

        // Enhanced PriceCharting Direct button with data sharing
        function addPriceChartingDirectButton(listingElement, cardNumber, setNumber) {
            if (listingElement.querySelector('.pricecharting-direct-btn')) return;

            const priceElement = listingElement.querySelector('.s-card__price, .s-item__price, .s-item__price-range, .notranslate');
            if (!priceElement) return;

            const button = document.createElement('button');
            button.className = 'pricecharting-direct-btn';
            button.textContent = cardNumber ? 'PC✓' : '🔍 PC';
            button.title = cardNumber ? `Direct PriceCharting link for ${cardNumber}` : 'Search PriceCharting by card name';

            Object.assign(button.style, {
                display: 'inline-block',
                marginLeft: '4px',
                padding: '2px 6px',
                background: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            });

            if (!document.querySelector('#pricecharting-direct-button-styles')) {
                const style = document.createElement('style');
                style.id = 'pricecharting-direct-button-styles';
                style.textContent = '.pricecharting-direct-btn:hover { background-color: #8e44ad !important; }';
                document.head.appendChild(style);
            }

            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const originalText = button.textContent;
                button.textContent = '...';
                button.disabled = true;

                try {
                    await openPriceChartingDirectWithSharing(listingElement, cardNumber, setNumber);
                } finally {
                    button.textContent = originalText;
                    button.disabled = false;
                }
            });

            // Insert after the PC📊 (View) button
            const pcViewButton = listingElement.querySelector('.pricecharting-view-btn');
            if (pcViewButton && pcViewButton.parentNode) {
                pcViewButton.parentNode.insertBefore(button, pcViewButton.nextSibling);
            } else {
                // Fallback insertion logic
                const googlePcButton = listingElement.querySelector('.google-pricecharting-btn');
                if (googlePcButton) {
                    googlePcButton.parentNode.insertBefore(button, googlePcButton.nextSibling);
                } else {
                    priceElement.parentNode.insertBefore(button, priceElement.nextSibling);
                }
            }
        }

        // Add PriceCharting View button to open the full pricing page (without #full-prices hash)
        function addPriceChartingViewButton(listingElement, cardNumber, setNumber) {
            if (listingElement.querySelector('.pricecharting-view-btn')) return;

            const priceElement = listingElement.querySelector('.s-card__price, .s-item__price, .s-item__price-range, .notranslate');
            if (!priceElement || !cardNumber) return;

            const button = document.createElement('button');
            button.className = 'pricecharting-view-btn';
            button.textContent = 'PC📊';
            button.title = `View full PriceCharting page for ${cardNumber}`;

            Object.assign(button.style, {
                display: 'inline-block',
                marginLeft: '4px',
                padding: '2px 6px',
                background: '#e67e22',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 'bold',
                verticalAlign: 'middle',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
            });

            if (!document.querySelector('#pricecharting-view-button-styles')) {
                const style = document.createElement('style');
                style.id = 'pricecharting-view-button-styles';
                style.textContent = '.pricecharting-view-btn:hover { background-color: #d35400 !important; }';
                document.head.appendChild(style);
            }

            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const originalText = button.textContent;
                button.textContent = '...';
                button.disabled = true;

                try {
                    await openPriceChartingViewPage(listingElement, cardNumber, setNumber);
                } finally {
                    button.textContent = originalText;
                    button.disabled = false;
                }
            });

            // Insert after the PC✓ button
            const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
            if (pcButton && pcButton.parentNode) {
                pcButton.parentNode.insertBefore(button, pcButton.nextSibling);
            } else {
                // Fallback insertion logic
                const googlePcButton = listingElement.querySelector('.google-pricecharting-btn');
                if (googlePcButton) {
                    googlePcButton.parentNode.insertBefore(button, googlePcButton.nextSibling);
                } else {
                    priceElement.parentNode.insertBefore(button, priceElement.nextSibling);
                }
            }
        }

        // Calculate title similarity function (referenced in searchTCGdex)
        function calculateTitleSimilarity(ebayTitle, cardName) {
            if (!ebayTitle || !cardName) return 0;

            // Normalize "Mega" and "M " before comparison
            let title1 = ebayTitle.toLowerCase().replace(/\bmega[\s-]*/g, 'm ');
            let title2 = cardName.toLowerCase();

            // Extract Pokemon name from card name (before any modifiers like "ex", "V", "VSTAR", etc.)
            const pokemonNameMatch = title2.match(/^(.*?)\s*(?:ex|v|vstar|vmax|gx|tag team|&|break|prime|lv\.?x|δ|★|prism star)?\s*$/i);
            const pokemonName = pokemonNameMatch ? pokemonNameMatch[1].trim() : title2;

            // Check for exact Pokemon name match (case-insensitive)
            // Special handling for single-letter names (like "N") or trainer names
            let isMatch = false;
            if (pokemonName.length === 1) {
                // For single letter names, look for the letter as a standalone word
                const regex = new RegExp(`\\b${pokemonName}\\b`, 'i');
                isMatch = regex.test(title1);
                if (isMatch) {
                    debugLog(`🎯 Single-letter Pokemon match found: "${pokemonName}" as standalone word in "${title1}"`);
                }
            } else if (pokemonName.length >= 2) {
                // For multi-character names, use substring matching
                isMatch = title1.includes(pokemonName);
                if (isMatch) {
                    debugLog(`🎯 Direct Pokemon match found: "${pokemonName}" in "${title1}"`);
                }
            }

            if (isMatch) {
                let score = 0.85; // High base score for Pokemon name match

                // Bonus points for matching modifiers
                if (title2.includes('ex') && title1.includes('ex')) score += 0.1;
                if (title2.includes(' v') && title1.includes(' v')) score += 0.1;
                if (title2.includes('vstar') && title1.includes('vstar')) score += 0.1;
                if (title2.includes('vmax') && title1.includes('vmax')) score += 0.1;
                if (title2.includes('gx') && title1.includes('gx')) score += 0.1;

                return Math.min(score, 1.0);
            }

            // Fallback to word matching for non-Pokemon names or when Pokemon name doesn't match
            const words1 = title1.split(/\s+/);
            const words2 = title2.split(/\s+/);

            let matches = 0;
            let significantMatches = 0;

            words2.forEach(word => {
                if (word.length > 2) { // Only count significant words
                    if (words1.some(w => w === word)) {
                        matches++;
                        significantMatches++;
                    } else if (words1.some(w => w.includes(word) || word.includes(w))) {
                        matches += 0.5; // Partial match
                    }
                }
            });

            return significantMatches > 0 ? matches / Math.max(words1.length, words2.length) : 0;
        }

        // Fallback search function (referenced in searchTCGdex)
        async function searchTCGdexFallback(cardNumber) {
            debugLog(`🔄 Fallback: Opening TCGdex website search for ${cardNumber}`);
            const searchWindow = window.open(`https://www.tcgdex.dev/cards?search=${encodeURIComponent(cardNumber)}`, '_blank');
            if (searchWindow) {
                debugLog('Opened TCGdex website search in new tab');
            }
            return null;
        }

        // Function to open PriceCharting view page (without #full-prices hash)
        async function openPriceChartingViewPage(listingElement, cardNumber, setNumber) {
            try {
            // Store the initial card data for PriceCharting to access
            const listingInfo = extractListingInfo(listingElement);
            const cardData = {
                cardNumber: cardNumber,
                setNumber: setNumber,
                ebayTitle: listingInfo.title
            };

            const requestKey = storePriceChartingRequest(cardData);

            // Use the enhanced URL creation function that handles all the logic
            const finalUrl = await createPriceChartingUrl(cardNumber, setNumber, requestKey, listingElement, false);

            if (finalUrl) {
                debugLog(`🔗 Opening PriceCharting view URL: ${finalUrl}`);

                // Open in new tab for viewing
                window.open(finalUrl, '_blank');
            } else {
                debugLog('⚠️ Card number pattern failed - trying title-based fallback for view page');
                
                // Try title-based search as fallback if we have a set name
                if (listingInfo.setName) {
                    debugLog(`🔄 Falling back to title-based search in set: ${listingInfo.setName}`);
                    
                    // Search by matching title against card names in the set
                    const foundCard = await searchByTitleInSet(listingInfo.setName, listingInfo.title);
                    
                    if (foundCard) {
                        debugLog(`✅ Found card via title fallback: ${foundCard.name} #${foundCard.localId}`);
                        
                        // Build URL from the found card
                        const fallbackUrl = await buildPriceChartingUrlFromCard(foundCard, foundCard.set?.name, requestKey, false, listingElement);
                        
                        if (fallbackUrl) {
                            debugLog(`🔗 Opening PriceCharting view URL (fallback): ${fallbackUrl}`);
                            window.open(fallbackUrl, '_blank');
                            return;
                        }
                    }
                }
                
                // If all fallbacks failed, use search page with title
                debugLog('⚠️ All search methods failed - opening PriceCharting search page');
                const searchQuery = listingInfo.title || cardNumber;
                const fallbackUrl = `https://www.pricecharting.com/search?q=${encodeURIComponent(searchQuery)}&type=prices`;
                window.open(fallbackUrl, '_blank');
            }

            } catch (error) {
            debugLog('Error constructing PriceCharting view URL:', error);
            const listingInfo = extractListingInfo(listingElement);
            const searchQuery = listingInfo.title || cardNumber;
            const fallbackUrl = `https://www.pricecharting.com/search?q=${encodeURIComponent(searchQuery)}&type=prices`;
            window.open(fallbackUrl, '_blank');
            }
        }

        // PriceCharting URL set name mapping - hardcoded for known differences
        const PRICECHARTING_SET_MAPPING = {
            // Sets with & characters (must preserve the & to avoid redirects)
            '151': 'pokemon-scarlet-&-violet-151',
            'Scarlet & Violet': 'pokemon-scarlet-&-violet',
            'Sun & Moon': 'pokemon-sun-&-moon',
            'Black & White': 'pokemon-black-&-white',
            'Ruby & Sapphire': 'pokemon-ruby-&-sapphire',
            'Diamond & Pearl': 'pokemon-diamond-&-pearl',
            'HeartGold SoulSilver': 'pokemon-heartgold-&-soulsilver',
            'Sword & Shield': 'pokemon-sword-&-shield',
            'FireRed & LeafGreen': 'pokemon-firered-&-leafgreen',

            // Base Set variations
            'Base Set': 'pokemon-base-set',
            'Base Set 2': 'pokemon-base-set-2',

            // POP Series
            'POP Series 1': 'pokemon-pop-series-1',
            'POP Series 2': 'pokemon-pop-series-2',
            'POP Series 3': 'pokemon-pop-series-3',
            'POP Series 4': 'pokemon-pop-series-4',
            'POP Series 5': 'pokemon-pop-series-5',
            'POP Series 6': 'pokemon-pop-series-6',
            'POP Series 7': 'pokemon-pop-series-7',
            'POP Series 8': 'pokemon-pop-series-8',
            'POP Series 9': 'pokemon-pop-series-9',

            // Gym Series
            'Gym Heroes': 'pokemon-gym-heroes',
            'Gym Challenge': 'pokemon-gym-challenge',

            // Neo Series
            'Neo Genesis': 'pokemon-neo-genesis',
            'Neo Discovery': 'pokemon-neo-discovery',
            'Neo Revelation': 'pokemon-neo-revelation',
            'Neo Destiny': 'pokemon-neo-destiny',

            // E-Card Series
            'Expedition Base Set': 'pokemon-expedition',
            'Aquapolis': 'pokemon-aquapolis',
            'Skyridge': 'pokemon-skyridge',

            // EX Series
            'Team Magma vs Team Aqua': 'pokemon-team-magma-vs-team-aqua',
            'Hidden Legends': 'pokemon-hidden-legends',
            'Team Rocket Returns': 'pokemon-team-rocket-returns',
            'Deoxys': 'pokemon-deoxys',
            'EX Deoxys': 'pokemon-deoxys',
            'Emerald': 'pokemon-emerald',
            'EX Emerald': 'pokemon-emerald',
            'Unseen Forces': 'pokemon-unseen-forces',
            'EX Unseen Forces': 'pokemon-unseen-forces',
            'Delta Species': 'pokemon-delta-species',
            'Legend Maker': 'pokemon-legend-maker',
            'Holon Phantoms': 'pokemon-holon-phantoms',
            'Crystal Guardians': 'pokemon-crystal-guardians',
            'Dragon Frontiers': 'pokemon-dragon-frontiers',
            'Power Keepers': 'pokemon-power-keepers',

            // Diamond & Pearl Series
            'Mysterious Treasures': 'pokemon-mysterious-treasures',
            'Secret Wonders': 'pokemon-secret-wonders',
            'Great Encounters': 'pokemon-great-encounters',
            'Majestic Dawn': 'pokemon-majestic-dawn',
            'Legends Awakened': 'pokemon-legends-awakened',
            'Stormfront': 'pokemon-stormfront',

            // Platinum Series
            'Platinum': 'pokemon-platinum',
            'Rising Rivals': 'pokemon-rising-rivals',
            'Supreme Victors': 'pokemon-supreme-victors',
            'Arceus': 'pokemon-arceus',

            // HGSS Series
            'Unleashed': 'pokemon-unleashed',
            'Undaunted': 'pokemon-undaunted',
            'Triumphant': 'pokemon-triumphant',
            'Call of Legends': 'pokemon-call-of-legends',

            // Black & White Series
            'Emerging Powers': 'pokemon-emerging-powers',
            'Noble Victories': 'pokemon-noble-victories',
            'Next Destinies': 'pokemon-next-destinies',
            'Dark Explorers': 'pokemon-dark-explorers',
            'Dragons Exalted': 'pokemon-dragons-exalted',
            'Boundaries Crossed': 'pokemon-boundaries-crossed',
            'Plasma Storm': 'pokemon-plasma-storm',
            'Plasma Freeze': 'pokemon-plasma-freeze',
            'Plasma Blast': 'pokemon-plasma-blast',
            'Legendary Treasures': 'pokemon-legendary-treasures',

            // XY Series
            'XY': 'pokemon-xy',
            'Flashfire': 'pokemon-flashfire',
            'Furious Fists': 'pokemon-furious-fists',
            'Phantom Forces': 'pokemon-phantom-forces',
            'Primal Clash': 'pokemon-primal-clash',
            'Roaring Skies': 'pokemon-roaring-skies',
            'Ancient Origins': 'pokemon-ancient-origins',
            'BREAKthrough': 'pokemon-breakthrough',
            'BREAKpoint': 'pokemon-breakpoint',
            'Generations': 'pokemon-generations',
            'Fates Collide': 'pokemon-fates-collide',
            'Steam Siege': 'pokemon-steam-siege',
            'Evolutions': 'pokemon-evolutions',

            // Sun & Moon Series
            'Guardians Rising': 'pokemon-guardians-rising',
            'Burning Shadows': 'pokemon-burning-shadows',
            'Crimson Invasion': 'pokemon-crimson-invasion',
            'Ultra Prism': 'pokemon-ultra-prism',
            'Forbidden Light': 'pokemon-forbidden-light',
            'Celestial Storm': 'pokemon-celestial-storm',
            'Lost Thunder': 'pokemon-lost-thunder',
            'Team Up': 'pokemon-team-up',
            'Unbroken Bonds': 'pokemon-unbroken-bonds',
            'Unified Minds': 'pokemon-unified-minds',
            'Cosmic Eclipse': 'pokemon-cosmic-eclipse',

            // Sword & Shield Series
            'Rebel Clash': 'pokemon-rebel-clash',
            'Darkness Ablaze': 'pokemon-darkness-ablaze',
            'Vivid Voltage': 'pokemon-vivid-voltage',
            'Battle Styles': 'pokemon-battle-styles',
            'Chilling Reign': 'pokemon-chilling-reign',
            'Evolving Skies': 'pokemon-evolving-skies',
            'Fusion Strike': 'pokemon-fusion-strike',
            'Brilliant Stars': 'pokemon-brilliant-stars',
            'Astral Radiance': 'pokemon-astral-radiance',
            'Lost Origin': 'pokemon-lost-origin',
            'Silver Tempest': 'pokemon-silver-tempest',

            // Scarlet & Violet Series
            'Paldea Evolved': 'pokemon-paldea-evolved',
            'Obsidian Flames': 'pokemon-obsidian-flames',
            'Paradox Rift': 'pokemon-paradox-rift',
            'Temporal Forces': 'pokemon-temporal-forces',
            'Twilight Masquerade': 'pokemon-twilight-masquerade',
            'Shrouded Fable': 'pokemon-shrouded-fable',
            'Stellar Crown': 'pokemon-stellar-crown',
            'Surging Sparks': 'pokemon-surging-sparks',

            // Special Sets
            'Shining Legends': 'pokemon-shining-legends',
            'Hidden Fates': 'pokemon-hidden-fates',
            'Champion\'s Path': 'pokemon-champions-path',
            'Shining Fates': 'pokemon-shining-fates',
            'Celebrations': 'pokemon-celebrations',
            'Pokémon GO': 'pokemon-go',
            'Crown Zenith': 'pokemon-crown-zenith',
            'Paldean Fates': 'pokemon-paldean-fates',

            // Promos
            'SVP Black Star Promos': 'pokemon-promo',
            'SWSH Black Star Promos': 'pokemon-promo',
            'SM Black Star Promos': 'pokemon-promo',
            'XY Black Star Promos': 'pokemon-promo',
            'BW Black Star Promos': 'pokemon-promo',
            'DP Black Star Promos': 'pokemon-promo',
            'HGSS Black Star Promos': 'pokemon-promo',
            'EX Black Star Promos': 'pokemon-promo',
            'Nintendo Black Star Promos': 'pokemon-promo',
            'Wizards Black Star Promos': 'pokemon-promo',
            'Promo Cards': 'pokemon-promo',
            'Promos': 'pokemon-promo',
        };

        // Cache for recently fetched PriceCharting data to avoid duplicate requests
        const priceChartingCache = new Map();

        // Enhanced function to open PriceCharting with the specific URL format - Returns Promise
        async function openPriceChartingDirectWithSharing(listingElement, cardNumber, setNumber) {
            try {
                const listingInfo = extractListingInfo(listingElement);

                // Check if this is a title-based search (no card number but has set name)
                if (!cardNumber && listingInfo.setName) {
                    debugLog(`🔍 Title-based search in set: ${listingInfo.setName}`);
                    
                    // Update button to show searching
                    const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
                    if (pcButton) {
                        pcButton.textContent = '🔍 Searching...';
                        pcButton.disabled = true;
                    }
                    
                    // Search by matching title against card names in the set
                    const foundCard = await searchByTitleInSet(listingInfo.setName, listingInfo.title);
                    
                    if (foundCard) {
                        debugLog(`✅ Found card via name search: ${foundCard.name} #${foundCard.localId}`);
                        
                        // Update button to show found
                        if (pcButton) {
                            pcButton.textContent = `💰 ${foundCard.name}`;
                            pcButton.title = `Found: ${foundCard.name} #${foundCard.localId} from ${foundCard.set?.name}`;
                        }
                        
                        // Store card data for PriceCharting to access
                        const cardData = {
                            cardNumber: foundCard.localId,
                            setNumber: foundCard.set?.cardCount?.total || null,
                            ebayTitle: listingInfo.title
                        };
                        
                        const requestKey = storePriceChartingRequest(cardData);
                        
                        // Build URL directly from the found card (bypass localId search)
                        // Params: foundCard, setName, requestKey, showPricePage, listingElement
                        const finalUrl = await buildPriceChartingUrlFromCard(foundCard, foundCard.set?.name, requestKey, true, listingElement);
                        
                        if (finalUrl) {
                            // Continue with opening PriceCharting window
                            const detectedGrade = detectGradeFromTitle(listingInfo.title);
                            const gradeKey = detectedGrade ? detectedGrade.key : 'ungraded';
                            const baseUrl = finalUrl.split('?')[0];
                            const cacheKey = `${foundCard.localId}_${foundCard.set?.cardCount?.total}_${gradeKey}_${baseUrl}`;
                            
                            const cached = priceChartingCache.get(cacheKey);
                            if (cached && (Date.now() - cached.timestamp < TIMING.CACHE_DURATION)) {
                                debugLog(`💾 Using cached PriceCharting data for ${cacheKey}`);
                                updateListingWithPriceChartingData(listingElement, cached.data);
                                
                                if (pcButton) {
                                    pcButton.style.background = '#27ae60';
                                    pcButton.title = `✅ PriceCharting data loaded (cached) - ${Object.keys(cached.data.prices || {}).length} prices found`;
                                    pcButton.disabled = false;
                                }
                                return true;
                            }
                            
                        debugLog(`🔗 Opening PriceCharting URL: ${finalUrl}`);
                        const windowName = `pricecharting_${requestKey}`;
                        // Create minimal resource popup (1x1 pixel, off-screen, all features disabled)
                        const pcWindow = window.open(finalUrl, windowName, 
                            'width=1,height=1,left=9999,top=9999,' +
                            'scrollbars=no,toolbar=no,menubar=no,location=no,status=no,' +
                            'resizable=no,directories=no');                            if (pcWindow) {
                                debugLog(`✅ PriceCharting window opened successfully (minimized off-screen)`);
                                window.focus();
                            } else {
                                debugLog(`⚠️ Failed to open PriceCharting window - popup may be blocked`);
                                showPopupBlockedWarning(listingElement);
                                if (pcButton) pcButton.disabled = false;
                                return false;
                            }
                            
                            await setupPriceChartingDataListener(requestKey, listingElement);
                            return true;
                        } else {
                            debugLog('⚠️ Could not create PriceCharting URL from found card');
                            if (pcButton) {
                                pcButton.style.background = '#95a5a6';
                                pcButton.textContent = '❓ URL Error';
                                pcButton.title = 'Could not create PriceCharting URL';
                                pcButton.disabled = false;
                            }
                            return false;
                        }
                    } else {
                        debugLog(`⚠️ Could not find card by name`);
                        if (pcButton) {
                            pcButton.style.background = '#95a5a6';
                            pcButton.textContent = '❓ Not Found';
                            pcButton.title = `Could not find "${listingInfo.pokemonName}" in ${listingInfo.setName}`;
                            pcButton.disabled = false;
                        }
                        return false;
                    }
                }

                // Store the initial card data for PriceCharting to access
                const cardData = {
                    cardNumber: cardNumber,
                    setNumber: setNumber,
                    ebayTitle: listingInfo.title
                };

                const requestKey = storePriceChartingRequest(cardData);

                // Use the enhanced URL creation function that handles all the logic
                const finalUrl = await createPriceChartingUrl(cardNumber, setNumber, requestKey, listingElement, true);

                if (finalUrl) {
                    // Detect grade from title to make cache key unique per grade
                    const detectedGrade = detectGradeFromTitle(listingInfo.title);
                    const gradeKey = detectedGrade ? detectedGrade.key : 'ungraded';
                    
                    // Create a cache key based on the card AND grade (without the unique request key)
                    const baseUrl = finalUrl.split('?')[0]; // URL without query params
                    const cacheKey = `${cardNumber}_${setNumber}_${gradeKey}_${baseUrl}`;
                    
                    // Check if we have cached data for this card with this specific grade
                    const cached = priceChartingCache.get(cacheKey);
                    if (cached && (Date.now() - cached.timestamp < TIMING.CACHE_DURATION)) {
                        debugLog(`💾 Using cached PriceCharting data for ${cacheKey}`);
                        // Use cached data immediately
                        updateListingWithPriceChartingData(listingElement, cached.data);
                        
                        // Update button to show success
                        const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
                        if (pcButton) {
                            pcButton.style.background = '#27ae60';
                            pcButton.title = `✅ PriceCharting data loaded (cached) - ${Object.keys(cached.data.prices || {}).length} prices found`;
                        }
                        return true;
                    }

                    debugLog(`🔗 Opening PriceCharting URL: ${finalUrl}`);
                    debugLog(`🔑 Request key: ${requestKey}`);

                    // Use unique window name for each request to avoid reusing same window
                    const windowName = `pricecharting_${requestKey}`;
                    
                    // Open in new window/tab (will auto-close quickly)
                    // Create minimal resource popup (1x1 pixel, off-screen, all features disabled)
                    const pcWindow = window.open(finalUrl, windowName, 
                        'width=1,height=1,left=9999,top=9999,' +
                        'scrollbars=no,toolbar=no,menubar=no,location=no,status=no,' +
                        'resizable=no,directories=no');
                    if (pcWindow) {
                        debugLog(`✅ PriceCharting window opened successfully`);
                        window.focus(); // Try to keep focus on current eBay tab
                    } else {
                        debugLog(`⚠️ Failed to open PriceCharting window - popup may be blocked`);
                        // Show popup blocked warning
                        showPopupBlockedWarning(listingElement);
                        return false;
                    }

                    // Set up listener for returned data - now returns a Promise
                    await setupPriceChartingDataListener(requestKey, listingElement);
                    return true;
                } else {
                    debugLog('⚠️ Card number pattern failed to find card - trying title-based fallback');
                    
                    // Try title-based search as fallback if we have a set name
                    if (listingInfo.setName) {
                        debugLog(`🔄 Falling back to title-based search in set: ${listingInfo.setName}`);
                        
                        const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
                        if (pcButton) {
                            pcButton.textContent = '🔍 Retry...';
                            pcButton.disabled = true;
                        }
                        
                        // Search by matching title against card names in the set
                        const foundCard = await searchByTitleInSet(listingInfo.setName, listingInfo.title);
                        
                        if (foundCard) {
                            debugLog(`✅ Found card via title fallback: ${foundCard.name} #${foundCard.localId}`);
                            
                            // Store new card data
                            const newCardData = {
                                cardNumber: foundCard.localId,
                                setNumber: foundCard.set?.cardCount?.total || null,
                                ebayTitle: listingInfo.title
                            };
                            const newRequestKey = storePriceChartingRequest(newCardData);
                            
                            // Build URL from the found card
                            const fallbackUrl = await buildPriceChartingUrlFromCard(foundCard, foundCard.set?.name, newRequestKey, true, listingElement);
                            
                            if (fallbackUrl) {
                                debugLog(`🔗 Opening PriceCharting URL (fallback): ${fallbackUrl}`);
                                const windowName = `pricecharting_${newRequestKey}`;
                                const pcWindow = window.open(fallbackUrl, windowName, 
                                    'width=1,height=1,left=9999,top=9999,' +
                                    'scrollbars=no,toolbar=no,menubar=no,location=no,status=no,' +
                                    'resizable=no,directories=no');
                                
                                if (pcWindow) {
                                    debugLog(`✅ PriceCharting window opened (fallback method)`);
                                    window.focus();
                                    await setupPriceChartingDataListener(newRequestKey, listingElement);
                                    return true;
                                }
                            }
                        }
                    }
                    
                    // If all fallbacks failed, show not found
                    debugLog('⚠️ All search methods failed - card not found');
                    const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
                    if (pcButton) {
                        pcButton.style.background = '#95a5a6'; // Gray
                        pcButton.textContent = '❓ Not Found';
                        pcButton.title = 'Card not found in TCGdex database. Try manual search.';
                        pcButton.disabled = false;
                    }
                    
                    return false;
                }

            } catch (error) {
                debugLog('❌ Error opening PriceCharting:', error);
                
                // Update button to show error
                const pcButton = listingElement?.querySelector('.pricecharting-direct-btn');
                if (pcButton) {
                    pcButton.style.background = '#95a5a6'; // Gray
                    pcButton.textContent = '⚠️ Error';
                    pcButton.title = `Error: ${error.message}`;
                }
                
                return false;
            }
        }

        // --- Enhanced helper function for PriceCharting URL creation with all logic ---
        async function createPriceChartingUrl(cardNumber, setNumber, requestKey, listingElement, showPricePage) {
            try {
            // Load sets cache and find matching sets
            await loadSetsCache();
            const matchingSets = findSetsByCardCount(setNumber);

            let foundCard = null;
            let setName = null;
            let allFoundCards = [];

            // If no setNumber provided (hash patterns) OR no matching sets found, search by localId to get set info
            if (!setNumber || matchingSets.length === 0) {
                if (!setNumber) {
                    debugLog('🔍 No setNumber provided - using localId search to find set information for PriceCharting URL');
                } else {
                    debugLog(`🔍 No matching sets found for setNumber "${setNumber}" - falling back to localId search`);
                }

                try {
                    const listingInfo = extractListingInfo(listingElement);
                    const localIdResult = await searchTCGdexByLocalId(cardNumber, listingInfo.title, listingInfo.setName, true);

                    if (localIdResult && localIdResult.id) {
                        // Extract set ID from the card ID (e.g., "sv08-238" -> "sv08")
                        const setId = localIdResult.id.split('-')[0];
                        debugLog(`✅ Found card via localId: ${localIdResult.name} from set ID "${setId}"`);

                        // Find the set name from our cached sets using the set ID
                        await loadSetsCache();
                        const matchingSet = setsCache.find(set => set.id === setId);

                        if (matchingSet) {
                            foundCard = localIdResult;
                            setName = matchingSet.name;
                            debugLog(`✅ Found matching set: ${setName}`);

                            // Skip the normal set searching since we already have our card
                            // Jump directly to URL construction
                            return buildPriceChartingUrlFromCard(foundCard, setName, requestKey, showPricePage, listingElement);
                        } else {
                            debugLog(`❌ Could not find set with ID "${setId}" in cached sets`);
                            return null;
                        }
                    } else {
                        debugLog('❌ LocalId search failed - no card or ID found');
                        return null;
                    }
                } catch (error) {
                    debugLog('❌ Error in localId search for PriceCharting URL:', error);
                    return null;
                }
            }

            // Create variations of the card number to handle zero-padding issues
            // For alternate arts (like "177a"), strip the letter for API searches
            const baseCardNumber = cardNumber.replace(/[a-zA-Z]/g, ''); // Remove letters
            debugLog(`🔍 [PC URL] Original cardNumber: "${cardNumber}" (length: ${cardNumber.length})`);
            debugLog(`🔍 [PC URL] Base cardNumber after letter removal: "${baseCardNumber}"`);

            let cardNumberVariations = [];

            // Check if this is a letter-number pattern (like "RC24", "GG69") - letters at beginning
            if (/[A-Z]/.test(cardNumber)) {
                // For letter-number patterns, keep the original format
                cardNumberVariations = [cardNumber, baseCardNumber];
                debugLog(`🔍 Letter-number pattern detected: "${cardNumber}" - keeping original format`);
            } else {
                // For numeric patterns (like "177", "177a"), create variations
                cardNumberVariations = [
                    baseCardNumber, // Numeric part only: "177" from "177a"
                    parseInt(baseCardNumber, 10).toString(), // Remove leading zeros: "177"
                    baseCardNumber.padStart(3, '0') // Add leading zeros: "177" -> "177"
                ].filter(variation => variation && !isNaN(variation) && variation !== 'NaN'); // Filter out invalid variations
            }

            // Remove duplicates
            const uniqueCardNumbers = [...new Set(cardNumberVariations)];
            debugLog(`🔍 Card number variations to try: ${uniqueCardNumbers.join(', ')}`);
            if (cardNumber !== baseCardNumber && /[a-zA-Z]/.test(cardNumber)) {
                debugLog(`🔍 Alternate art detected: "${cardNumber}" -> using "${baseCardNumber}" for API search`);
            }

            // Search each target set to find the card and get set info
            for (const set of matchingSets) {
                // Try each card number variation
                for (const cardNum of uniqueCardNumbers) {
                    try {
                const fullCardUrl = `https://api.tcgdex.net/v2/en/cards/${set.id}-${cardNum}`;
                const response = await fetch(fullCardUrl, {
                    method: 'GET',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const fullCard = await response.json();
                    if (fullCard && fullCard.name) {
                    allFoundCards.push({
                        card: fullCard,
                        setName: set.name
                    });
                    debugLog(`🎯 Found card: ${fullCard.name} in set ${set.name} with card number ${cardNum}`);
                    break; // Found card in this set, no need to try other variations
                    }
                }
                } catch (error) {
                // Continue to next variation
                }
                }
            }

            // Find the best match using title similarity
            if (allFoundCards.length > 0) {
                const listingInfo = extractListingInfo(listingElement);

                if (allFoundCards.length === 1) {
                foundCard = allFoundCards[0].card;
                setName = allFoundCards[0].setName;
                debugLog(`🎯 Single card found for PriceCharting: ${foundCard.name} from ${setName}`);
                } else if (listingInfo.title) {
                let bestSimilarity = -1;
                let bestMatch = allFoundCards[0];

                debugLog(`🔍 Comparing ${allFoundCards.length} cards for PriceCharting URL...`);

                allFoundCards.forEach((cardData, index) => {
                    const similarity = calculateTitleSimilarity(listingInfo.title, cardData.card.name);
                    debugLog(`  ${index + 1}. ${cardData.card.name} from ${cardData.setName} - Similarity: ${(similarity * 100).toFixed(1)}%`);

                    if (similarity > bestSimilarity) {
                    bestSimilarity = similarity;
                    bestMatch = cardData;
                    }
                });

                foundCard = bestMatch.card;
                setName = bestMatch.setName;
                debugLog(`🎯 Best match for PriceCharting: ${foundCard.name} from ${setName} (${(bestSimilarity * 100).toFixed(1)}% similarity)`);
                } else {
                foundCard = allFoundCards[0].card;
                setName = allFoundCards[0].setName;
                debugLog(`🎯 Using first card for PriceCharting (no title): ${foundCard.name} from ${setName}`);
                }
            }

            if (!foundCard || !setName) {
                debugLog('Card not found for PriceCharting URL construction');
                return null; // Let caller handle fallback
            }

            // Now construct the URL with the found card data
            let cleanSetName;

            // Check if we have a hardcoded mapping first
            if (PRICECHARTING_SET_MAPPING[setName]) {
                cleanSetName = PRICECHARTING_SET_MAPPING[setName];
                debugLog(`🔧 Using hardcoded mapping: "${setName}" -> "${cleanSetName}"`);
            } else {
                // Fall back to automatic cleaning
                cleanSetName = setName
                .toLowerCase()
                .replace(/pokémon/g, 'pokemon')
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
                debugLog(`🔧 Using automatic cleaning: "${setName}" -> "${cleanSetName}"`);
            }

            // Check if this is a Mega Evolution card (starts with "M ")
            const isMegaCard = /^m\s+/i.test(foundCard.name);
            
            const cleanCardName = foundCard.name
                .toLowerCase()
                .replace(/^m\s+/i, 'm-') // Replace "M " prefix with "m-" (e.g., "M Charizard EX" -> "m-charizard ex")
                .replace(/'/g, '') // Remove apostrophes
                .replace(/&/g, '-&-') // Replace & with -&- to preserve it in URL
                .replace(/[^a-z0-9\s&-]/g, '') // Keep letters, numbers, spaces, &, and hyphens
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            // For Mega cards, also create the "mega-" variant
            const megaVariantName = isMegaCard ? cleanCardName.replace(/^m-/, 'mega-') : null;

            // Check eBay title for special indicators and modifiers
            let finalCardName = cleanCardName;
            const listingInfo = extractListingInfo(listingElement);
            if (listingInfo.title) {
                const titleUpper = listingInfo.title.toUpperCase();

                // Check for Gold Star variants (highest priority for rare cards)
                if (titleUpper.includes('GOLD STAR') || titleUpper.includes('GOLDSTAR')) {
                    finalCardName = `${cleanCardName}-gold-star`;
                    debugLog(`🔧 Gold Star detected in title - adding "gold-star": "${cleanCardName}" -> "${finalCardName}"`);
                }
                // Check for Pokemon Center variants
                else if (['POKEMON CENTER', 'POKÉMON CENTER'].some(variant => titleUpper.includes(variant))) {
                    finalCardName = `${cleanCardName}-pokemon-center`;
                    debugLog(`🔧 Pokemon Center detected in title - adding "pokemon-center": "${cleanCardName}" -> "${finalCardName}"`);
                }
                // Check for standalone STAMPED (but not if part of "Stamped Reverse Holo")
                else if (titleUpper.includes('STAMPED') && !titleUpper.includes('REVERSE')) {
                    finalCardName = `${cleanCardName}-stamped`;
                    debugLog(`🔧 Stamped detected in title - adding "stamped": "${cleanCardName}" -> "${finalCardName}"`);
                }
                // Check for First Edition
                else if (['FIRST EDITION', '1ST EDITION'].some(variant => titleUpper.includes(variant))) {
                    finalCardName = `${cleanCardName}-1st-edition`;
                    debugLog(`🔧 First Edition detected in title - adding "1st-edition": "${cleanCardName}" -> "${finalCardName}"`);
                }
            }

            // Handle card number - preserve letters for alternate arts (like 177a) and promo cards (like SWSH291)
            let cleanCardNumber;
            if (/\d+[a-zA-Z]$/.test(cardNumber)) {
                // Card number ends with a letter (e.g., "177a") - preserve it for alternate arts
                cleanCardNumber = cardNumber.toLowerCase();
                debugLog(`🔧 Alternate art detected - preserving letter: "${cardNumber}" -> "${cleanCardNumber}"`);
            } else if (/^(SWSH|SM)[0-9]+$/i.test(cardNumber)) {
                // Promo card (e.g., "SWSH291", "SM241") - preserve exactly as-is
                cleanCardNumber = cardNumber.toLowerCase();
                debugLog(`🔧 Promo card detected - preserving format: "${cardNumber}" -> "${cleanCardNumber}"`);
            } else if (/^[A-Z]{1,4}\d+$/i.test(cardNumber)) {
                // Letter-number pattern (e.g., "TG29", "SV107", "RC5") - preserve exactly as-is
                cleanCardNumber = cardNumber.toLowerCase();
                debugLog(`🔧 Letter-number pattern detected - preserving format: "${cardNumber}" -> "${cleanCardNumber}"`);
            } else {
                // Standard numeric card number - normalize it
                cleanCardNumber = parseInt(cardNumber, 10).toString();
            }

            const setPrefix = cleanSetName.startsWith('pokemon-') ? '' : 'pokemon-';

            // Build base URL - don't add query parameters as they cause search redirects
            let finalUrl = `https://www.pricecharting.com/game/${setPrefix}${cleanSetName}/${finalCardName}-${cleanCardNumber}`;
            
            // If this is a Mega card, store the alternative URL for retry
            let alternativeUrl = null;
            if (megaVariantName && showPricePage && requestKey) {
                alternativeUrl = `https://www.pricecharting.com/game/${setPrefix}${cleanSetName}/${megaVariantName}-${cleanCardNumber}#full-prices&ebay_request=${requestKey}`;
                
                // Store the alternative URL in the request data
                const storedData = GM_getValue(requestKey);
                if (storedData) {
                    storedData.alternativeUrl = alternativeUrl;
                    storedData.triedAlternative = false;
                    GM_setValue(requestKey, storedData);
                    debugLog(`💾 Stored alternative URL for Mega card: ${alternativeUrl}`);
                }
            }
            
            debugLog(`🔍 [createPriceChartingUrl] showPricePage: ${showPricePage}`);
            debugLog(`🔍 [createPriceChartingUrl] requestKey: ${requestKey}`);
            
            if (showPricePage) {
                // Put ebay_request in the hash to survive redirects
                finalUrl += `#full-prices&ebay_request=${requestKey}`;
                debugLog(`✅ [createPriceChartingUrl] Added ebay_request to hash`);
            } else {
                debugLog(`ℹ️ [createPriceChartingUrl] Skipping ebay_request (view mode)`);
            }

            debugLog(`📋 Card: ${foundCard.name} from ${setName}`);
            debugLog(`🔗 Generated final URL: ${finalUrl}`);
            if (alternativeUrl) {
                debugLog(`🔗 Alternative URL available: ${alternativeUrl}`);
            }
            return finalUrl;

            } catch (error) {
                debugLog('Error in createPriceChartingUrl:', error);
                return null; // Let caller handle fallback
            }
        }

        // Helper function to build PriceCharting URL from a found card
        function buildPriceChartingUrlFromCard(foundCard, setName, requestKey, showPricePage, listingElement) {
            try {
                debugLog(`🔗 Building PriceCharting URL from found card: ${foundCard.name} from ${setName}`);

                // Now construct the URL with the found card data
                let cleanSetName;

                // Check if we have a hardcoded mapping first
                if (PRICECHARTING_SET_MAPPING[setName]) {
                    cleanSetName = PRICECHARTING_SET_MAPPING[setName];
                    debugLog(`🔧 Using hardcoded mapping: "${setName}" -> "${cleanSetName}"`);
                } else {
                    // Fall back to automatic cleaning
                    cleanSetName = setName
                    .toLowerCase()
                    .replace(/pokémon/g, 'pokemon')
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                    debugLog(`🔧 Using automatic cleaning: "${setName}" -> "${cleanSetName}"`);
                }

                // Check if this is a Mega Evolution card (starts with "M ")
                const isMegaCard = /^m\s+/i.test(foundCard.name);
                
                const cleanCardName = foundCard.name
                    .toLowerCase()
                    .replace(/^m\s+/i, 'm-') // Replace "M " prefix with "m-" (e.g., "M Charizard EX" -> "m-charizard ex")
                    .replace(/'/g, '') // Remove apostrophes
                    .replace(/&/g, '-&-') // Replace & with -&- to preserve it in URL
                    .replace(/[^a-z0-9\s&-]/g, '') // Keep letters, numbers, spaces, &, and hyphens
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');

                // For Mega cards, also create the "mega-" variant
                const megaVariantName = isMegaCard ? cleanCardName.replace(/^m-/, 'mega-') : null;

                // Check eBay title for special indicators and modifiers
                let finalCardName = cleanCardName;
                const listingInfo = extractListingInfo(listingElement);
                if (listingInfo.title) {
                    const titleUpper = listingInfo.title.toUpperCase();

                    // Check for Pokemon Center variants
                    if (titleUpper.includes('POKEMON CENTER') || titleUpper.includes('POKÉMON CENTER')) {
                        finalCardName = `${cleanCardName}-pokemon-center`;
                        debugLog(`🔧 Pokemon Center detected in title - adding "pokemon-center": "${cleanCardName}" -> "${finalCardName}"`);
                    }
                    // Check for standalone STAMPED (but not if part of "Stamped Reverse Holo")
                    else if (titleUpper.includes('STAMPED') && !titleUpper.includes('REVERSE')) {
                        finalCardName = `${cleanCardName}-stamped`;
                        debugLog(`🔧 Stamped detected in title - adding "stamped": "${cleanCardName}" -> "${finalCardName}"`);
                    }
                    // Check for First Edition
                    else if (titleUpper.includes('FIRST EDITION') || titleUpper.includes('1ST EDITION')) {
                        finalCardName = `${cleanCardName}-1st-edition`;
                        debugLog(`🔧 First Edition detected in title - adding "1st-edition": "${cleanCardName}" -> "${finalCardName}"`);
                    }
                }

                // Use the localId from the found card for the card number
                let cleanCardNumber = foundCard.localId;
                if (/\d+[a-zA-Z]$/.test(cleanCardNumber)) {
                    // Card number ends with a letter (e.g., "177a") - preserve it for alternate arts
                    cleanCardNumber = cleanCardNumber.toLowerCase();
                    debugLog(`🔧 Alternate art detected - preserving letter: "${foundCard.localId}" -> "${cleanCardNumber}"`);
                } else if (/^(SWSH|SM)[0-9]+$/i.test(cleanCardNumber)) {
                    // Promo card (e.g., "SWSH291", "SM241") - preserve exactly as-is
                    cleanCardNumber = cleanCardNumber.toLowerCase();
                    debugLog(`🔧 Promo card detected - preserving format: "${foundCard.localId}" -> "${cleanCardNumber}"`);
                } else if (/^[A-Z]{1,4}\d+$/i.test(cleanCardNumber)) {
                    // Letter-number pattern (e.g., "TG29", "SV107", "RC5") - preserve exactly as-is
                    cleanCardNumber = cleanCardNumber.toLowerCase();
                    debugLog(`🔧 Letter-number pattern detected - preserving format: "${foundCard.localId}" -> "${cleanCardNumber}"`);
                } else {
                    // Standard numeric card number - normalize it
                    cleanCardNumber = parseInt(foundCard.localId, 10).toString();
                }

                const setPrefix = cleanSetName.startsWith('pokemon-') ? '' : 'pokemon-';

                // Build base URL - don't add query parameters as they cause search redirects
                let finalUrl = `https://www.pricecharting.com/game/${setPrefix}${cleanSetName}/${finalCardName}-${cleanCardNumber}`;
                
                // If this is a Mega card, store the alternative URL for retry
                let alternativeUrl = null;
                if (megaVariantName && showPricePage && requestKey) {
                    alternativeUrl = `https://www.pricecharting.com/game/${setPrefix}${cleanSetName}/${megaVariantName}-${cleanCardNumber}#full-prices&ebay_request=${requestKey}`;
                    
                    // Store the alternative URL in the request data
                    const storedData = GM_getValue(requestKey);
                    if (storedData) {
                        storedData.alternativeUrl = alternativeUrl;
                        storedData.triedAlternative = false;
                        GM_setValue(requestKey, storedData);
                        debugLog(`💾 Stored alternative URL for Mega card: ${alternativeUrl}`);
                    }
                }
                
                debugLog(`🔍 [buildPriceChartingUrlFromCard] showPricePage: ${showPricePage}`);
                debugLog(`🔍 [buildPriceChartingUrlFromCard] requestKey: ${requestKey}`);
                
                if (showPricePage) {
                    // Put ebay_request in the hash to survive redirects
                    finalUrl += `#full-prices&ebay_request=${requestKey}`;
                    debugLog(`✅ [buildPriceChartingUrlFromCard] Added ebay_request to hash`);
                } else {
                    debugLog(`ℹ️ [buildPriceChartingUrlFromCard] Skipping ebay_request (view mode)`);
                }

                debugLog(`📋 Card: ${foundCard.name} from ${setName}`);
                debugLog(`🔗 Generated PriceCharting URL: ${finalUrl}`);
                if (alternativeUrl) {
                    debugLog(`🔗 Alternative URL available: ${alternativeUrl}`);
                }
                return finalUrl;

            } catch (error) {
                debugLog('Error in buildPriceChartingUrlFromCard:', error);
                return null;
            }
        }

        // Track active listeners to prevent duplicates and allow cancellation
        const activeListeners = new Map();

        // Enhanced listener with Promise-based async/await for better control
        function setupPriceChartingDataListener(requestKey, listingElement) {
            // Cancel any existing listener for this request key
            if (activeListeners.has(requestKey)) {
                debugLog(`🛑 Cancelling existing listener for ${requestKey}`);
                const existingListener = activeListeners.get(requestKey);
                existingListener.cancelled = true;
                clearTimeout(existingListener.timeoutId);
            }

            return new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = TIMING.POLL_MAX_ATTEMPTS;
                let timeoutId = null;
                const listenerControl = { cancelled: false, timeoutId: null };

                // Store this listener
                activeListeners.set(requestKey, listenerControl);

                debugLog(`🔄 Setting up listener for request key: ${requestKey}`);

                const checkForData = () => {
                    // Check if this listener was cancelled
                    if (listenerControl.cancelled) {
                        debugLog(`🛑 Listener for ${requestKey} was cancelled`);
                        activeListeners.delete(requestKey);
                        reject(new Error('Listener cancelled'));
                        return;
                    }

                    attempts++;
                    debugLog(`📡 Checking for PriceCharting data... attempt ${attempts}/${maxAttempts}`);

                    const data = getStoredData(`${requestKey}_data`);

                    if (data) {
                        debugLog(`📊 Received PriceCharting data after ${attempts} attempts:`, data);

                        // Clean up
                        activeListeners.delete(requestKey);

                        // Cache the data for future use (extract card info from stored request)
                        const storedRequest = getStoredData(requestKey);
                        if (storedRequest && data.url) {
                            // Detect grade from the original eBay title
                            const detectedGrade = detectGradeFromTitle(storedRequest.ebayTitle || '');
                            const gradeKey = detectedGrade ? detectedGrade.key : 'ungraded';
                            
                            const baseUrl = data.url.split('?')[0];
                            const cacheKey = `${storedRequest.cardNumber}_${storedRequest.setNumber}_${gradeKey}_${baseUrl}`;
                            priceChartingCache.set(cacheKey, {
                                data: data,
                                timestamp: Date.now()
                            });
                            debugLog(`💾 Cached data for key: ${cacheKey} (grade: ${gradeKey})`);
                        }

                        // Verify the listing element still exists
                        if (listingElement && listingElement.parentNode) {
                            updateListingWithPriceChartingData(listingElement, data);

                            // Add a success indicator to the PC button
                            const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
                            if (pcButton) {
                                pcButton.style.background = '#27ae60'; // Green to indicate success
                                pcButton.title = `✅ PriceCharting data loaded - ${Object.keys(data.prices || {}).length} prices found`;
                            }
                        } else {
                            console.warn('⚠️ Listing element no longer exists in DOM');
                        }
                        resolve(data);
                        return;
                    }

                    if (attempts < maxAttempts) {
                        timeoutId = setTimeout(checkForData, TIMING.POLL_INTERVAL);
                        listenerControl.timeoutId = timeoutId;
                    } else {
                        debugLog('⏰ Timeout waiting for PriceCharting data');

                        // Clean up
                        activeListeners.delete(requestKey);

                        // Update button to show timeout
                        const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
                        if (pcButton) {
                            pcButton.style.background = '#e67e22'; // Orange to indicate timeout
                            pcButton.title = '⏰ Timeout waiting for PriceCharting data';
                        }
                        reject(new Error('Timeout waiting for PriceCharting data'));
                    }
                };

                // Start checking after a short delay to allow PriceCharting page to load
                timeoutId = setTimeout(checkForData, 1000); // Wait 1 second before first check
                listenerControl.timeoutId = timeoutId;
            });
        }

        // Update listing with PriceCharting data - Enhanced version with grade detection
        function updateListingWithPriceChartingData(listingElement, pcData) {
            debugLog('📊 Updating eBay listing with PriceCharting data:', pcData);

            // Create or update a PriceCharting info display
            let pcInfoDisplay = listingElement.querySelector('.pc-info-display');

            if (!pcInfoDisplay) {
                pcInfoDisplay = document.createElement('div');
                pcInfoDisplay.className = 'pc-info-display';

                Object.assign(pcInfoDisplay.style, {
                    display: 'block',
                    marginTop: '4px',
                    padding: '6px 10px',
                    background: '#9b59b6',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    lineHeight: '1.4',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    border: '1px solid #8e44ad'
                });

                // Find the best place to insert the display
                const pcButton = listingElement.querySelector('.pricecharting-direct-btn');
                const priceElement = listingElement.querySelector('.s-card__price, .s-item__price, .s-item__price-range, .notranslate');

                if (pcButton && pcButton.parentNode) {
                    pcButton.parentNode.insertBefore(pcInfoDisplay, pcButton.nextSibling);
                } else if (priceElement && priceElement.parentNode) {
                    priceElement.parentNode.insertBefore(pcInfoDisplay, priceElement.nextSibling);
                } else {
                    // Fallback: append to the listing element itself
                    listingElement.appendChild(pcInfoDisplay);
                }

                debugLog('✅ Created new PC info display element');
            }

            // Get eBay title to detect grade
            const listingInfo = extractListingInfo(listingElement);
            const detectedGrade = detectGradeFromTitle(listingInfo.title);

            debugLog('🔍 Detected grade from eBay title:', detectedGrade);
            debugLog('🔍 eBay title:', listingInfo.title);

            // Format the PriceCharting data to show only the relevant grade
            let displayLines = [];
            let hasValidPrices = false;

            if (pcData.prices && Object.keys(pcData.prices).length > 0) {
                debugLog('Available price keys:', Object.keys(pcData.prices));

                // If grade detected from title, show that grade + ungraded as baseline
                if (detectedGrade) {
                    debugLog(`Looking for detected grade key: ${detectedGrade.key}`);

                    // Show the specific detected grade (highlighted)
                    if (pcData.prices[detectedGrade.key]) {
                        const gradePrice = pcData.prices[detectedGrade.key];
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${detectedGrade.displayName}: ${gradePrice.price}</span>`);
                        hasValidPrices = true;
                        debugLog(`Added detected grade: ${detectedGrade.displayName}: ${gradePrice.price}`);
                    } else {
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${detectedGrade.displayName}: Unpriced</span>`);
                        debugLog(`Detected grade ${detectedGrade.displayName} not found - showing Unpriced`);
                    }

                    // Show ungraded as baseline reference
                    if (pcData.prices['ungraded']) {
                        const ungradedPrice = pcData.prices['ungraded'];
                        displayLines.push(`Ungraded: ${ungradedPrice.price}`);
                        hasValidPrices = true;
                        debugLog(`Added ungraded baseline: ${ungradedPrice.price}`);
                    } else {
                        displayLines.push(`Ungraded: Unpriced`);
                        debugLog('Ungraded price not found for baseline');
                    }
                } else {
                    // No grade detected, show only ungraded price (highlighted)
                    if (pcData.prices['ungraded']) {
                        const ungradedPrice = pcData.prices['ungraded'];
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">Ungraded: ${ungradedPrice.price}</span>`);
                        hasValidPrices = true;
                        debugLog(`Added ungraded: ${ungradedPrice.price}`);
                    } else {
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">Ungraded: Unpriced</span>`);
                        debugLog('Ungraded price not found - showing Unpriced');
                    }
                }

                // Add total count if there are more prices available
                const totalPrices = Object.keys(pcData.prices).length;
                const shownPrices = displayLines.length;
                if (totalPrices > shownPrices) {
                    displayLines.push(`+${totalPrices - shownPrices} more grades available`);
                }
            } else {
                if (detectedGrade) {
                    displayLines.push(`<strong>${detectedGrade.displayName}: Unpriced</strong>`);
                } else {
                    displayLines.push('<strong>Ungraded: Unpriced</strong>');
                }
                debugLog('⚠️ No valid prices found in data');
            }

            // Add card name if extracted
            let headerText = 'PC:';
            const displayCardName = pcData.extractedCardName || pcData.cardName || 'Unknown Card';
            if (displayCardName && displayCardName !== 'Unknown' && displayCardName !== 'Unknown Card') {
                // Add detected grade to the name if available
                if (detectedGrade) {
                    if (detectedGrade.key.toUpperCase().includes('BGS') && parseFloat(detectedGrade.grade) >= 10.0) {
                        headerText = `${displayCardName} (👑${detectedGrade.displayName})`;
                    } else if (parseFloat(detectedGrade.grade) >= 10.0) {
                        headerText = `${displayCardName} (💎${detectedGrade.displayName})`;
                    } else if (parseFloat(detectedGrade.grade) >= 9.5) {
                        headerText = `${displayCardName} (⭐${detectedGrade.displayName})`;
                    } else if (parseFloat(detectedGrade.grade) >= 9.0) {
                        headerText = `${displayCardName} (✨${detectedGrade.displayName})`;
                    } else {
                        headerText = `${displayCardName} (${detectedGrade.displayName})`;
                    }
                } else {
                    headerText = `${displayCardName}`;
                }
            }

            // Add set name if available
            let setNameLine = '';
            if (pcData.extractedSetName) {
                setNameLine = `<div style="font-size: 12px; opacity: 0.8; margin-top: 2px; font-weight: bold;">${pcData.extractedSetName}</div>`;
            }

            // Add card image if available (on the right side)
            let imageHtml = '';
            if (pcData.imageUrl) {
                imageHtml = `<img src="${pcData.imageUrl}" alt="Card Image" style="float: right; width: 60px; height: auto; margin-left: 8px; margin-top: -4px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.3);">`;
            }

            // Update the display content
            pcInfoDisplay.innerHTML = `${imageHtml}<strong>${headerText}</strong>${setNameLine}<br>${displayLines.join('<br>')}`;

            // Create detailed tooltip with all prices
            let tooltipContent = `PriceCharting Data:\n`;
            tooltipContent += `Card: ${pcData.extractedCardName || pcData.cardName || 'Unknown'}\n`;
            if (pcData.extractedCardNumber) {
                tooltipContent += `Number: #${pcData.extractedCardNumber}\n`;
            }
            if (detectedGrade) {
                tooltipContent += `Detected Grade: ${detectedGrade.displayName}\n`;
            }
            tooltipContent += `URL: ${pcData.url}\n\n`;

            if (pcData.prices && Object.keys(pcData.prices).length > 0) {
                tooltipContent += `All Available Prices:\n`;
                Object.entries(pcData.prices).forEach(([key, priceInfo]) => {
                    tooltipContent += `  ${priceInfo.grade}: ${priceInfo.price}\n`;
                });
            } else {
                tooltipContent += `No prices currently available\n`;
            }

            if (pcData.lastUpdated) {
                tooltipContent += `\nLast Updated: ${pcData.lastUpdated}`;
            }

            tooltipContent += `\nExtracted: ${new Date(pcData.timestamp).toLocaleString()}`;

            pcInfoDisplay.title = tooltipContent;

            // Make the display more visible with a subtle animation
            pcInfoDisplay.style.opacity = '0';
            setTimeout(() => {
                pcInfoDisplay.style.transition = 'opacity 0.3s ease-in-out';
                pcInfoDisplay.style.opacity = '1';
            }, 100);

            debugLog(`✅ Updated PC display with ${displayLines.length} lines:`, displayLines);

            // Cache the data (not HTML) for future page loads
            const listingUrl = getListingUrl(listingElement);
            debugLog(`🔑 Attempting to cache - listingUrl: ${listingUrl ? listingUrl.substring(0, 80) : 'NULL'}`);
            if (listingUrl) {
                debugLog(`💾 Storing cache with keys:`, {
                    cardName: pcData.cardName,
                    setName: pcData.setName,
                    hasPrices: !!pcData.prices,
                    hasGrade: !!detectedGrade
                });
                storeListingDisplayCache(listingUrl, {
                    cardName: pcData.cardName,
                    setName: pcData.setName,
                    prices: pcData.prices,
                    detectedGrade: detectedGrade,
                    extractedCardName: pcData.extractedCardName,
                    extractedSetName: pcData.extractedSetName,
                    extractedCardNumber: pcData.extractedCardNumber,
                    lastUpdated: pcData.lastUpdated,
                    url: pcData.url,
                    imageUrl: pcData.imageUrl
                });
                debugLog(`✅ Cache stored successfully!`);
            } else {
                debugLog(`❌ Cannot cache - listingUrl is null!`);
            }

            // Color the eBay price based on PriceCharting comparison
            colorEbayPriceBasedOnComparison(listingElement, pcData, detectedGrade);
        }

        // Helper function to build display HTML from cached data
        function buildDisplayFromCache(cachedData) {
            const displayLines = [];
            const detectedGrade = cachedData.detectedGrade;
            let hasValidPrices = false;

            if (cachedData.prices && Object.keys(cachedData.prices).length > 0) {
                if (detectedGrade) {
                    // Show detected grade price first (highlighted)
                    const gradePrice = cachedData.prices[detectedGrade.key];
                    if (gradePrice) {
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${detectedGrade.displayName}: ${gradePrice.price}</span>`);
                        hasValidPrices = true;
                    } else {
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${detectedGrade.displayName}: Unpriced</span>`);
                    }

                    // Show ungraded as baseline reference
                    if (cachedData.prices['ungraded']) {
                        displayLines.push(`Ungraded: ${cachedData.prices['ungraded'].price}`);
                        hasValidPrices = true;
                    } else {
                        displayLines.push(`Ungraded: Unpriced`);
                    }
                } else {
                    // No grade detected, show only ungraded price (highlighted)
                    if (cachedData.prices['ungraded']) {
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">Ungraded: ${cachedData.prices['ungraded'].price}</span>`);
                        hasValidPrices = true;
                    } else {
                        displayLines.push(`<span style="background-color: #ffeb3b; color: #000; padding: 2px 4px; border-radius: 3px; font-weight: bold;">Ungraded: Unpriced</span>`);
                    }
                }

                // Add total count if there are more prices available
                const totalPrices = Object.keys(cachedData.prices).length;
                const shownPrices = displayLines.length;
                if (totalPrices > shownPrices) {
                    displayLines.push(`+${totalPrices - shownPrices} more grades available`);
                }
            } else {
                if (detectedGrade) {
                    displayLines.push(`<strong>${detectedGrade.displayName}: Unpriced</strong>`);
                } else {
                    displayLines.push('<strong>Ungraded: Unpriced</strong>');
                }
            }

            // Build header text
            let headerText = 'PC:';
            const displayCardName = cachedData.extractedCardName || cachedData.cardName || 'Unknown Card';
            if (displayCardName && displayCardName !== 'Unknown' && displayCardName !== 'Unknown Card') {
                if (detectedGrade) {
                    if (detectedGrade.key.toUpperCase().includes('BGS') && parseFloat(detectedGrade.grade) >= 10.0) {
                        headerText = `${displayCardName} (👑${detectedGrade.displayName})`;
                    } else if (parseFloat(detectedGrade.grade) >= 10.0) {
                        headerText = `${displayCardName} (💎${detectedGrade.displayName})`;
                    } else if (parseFloat(detectedGrade.grade) >= 9.5) {
                        headerText = `${displayCardName} (⭐${detectedGrade.displayName})`;
                    } else if (parseFloat(detectedGrade.grade) >= 9.0) {
                        headerText = `${displayCardName} (✨${detectedGrade.displayName})`;
                    } else {
                        headerText = `${displayCardName} (${detectedGrade.displayName})`;
                    }
                } else {
                    headerText = `${displayCardName}`;
                }
            }

            // Add set name if available
            let setNameLine = '';
            if (cachedData.extractedSetName) {
                setNameLine = `<div style="font-size: 12px; opacity: 0.8; margin-top: 2px; font-weight: bold;">${cachedData.extractedSetName}</div>`;
            }

            // Add card image if available (on the right side)
            let imageHtml = '';
            if (cachedData.imageUrl) {
                imageHtml = `<img src="${cachedData.imageUrl}" alt="Card Image" style="float: right; width: 60px; height: auto; margin-left: 8px; margin-top: -4px; border-radius: 3px; border: 1px solid rgba(255,255,255,0.3);">`;
            }

            // Build tooltip
            let tooltipContent = `PriceCharting Data:\n`;
            tooltipContent += `Card: ${cachedData.extractedCardName || cachedData.cardName || 'Unknown'}\n`;
            if (cachedData.extractedCardNumber) {
                tooltipContent += `Number: #${cachedData.extractedCardNumber}\n`;
            }
            if (detectedGrade) {
                tooltipContent += `Detected Grade: ${detectedGrade.displayName}\n`;
            }
            tooltipContent += `URL: ${cachedData.url}\n\n`;

            if (cachedData.prices && Object.keys(cachedData.prices).length > 0) {
                tooltipContent += `All Available Prices:\n`;
                Object.entries(cachedData.prices).forEach(([key, priceInfo]) => {
                    tooltipContent += `  ${priceInfo.grade}: ${priceInfo.price}\n`;
                });
            } else {
                tooltipContent += `No prices currently available\n`;
            }

            if (cachedData.lastUpdated) {
                tooltipContent += `\nLast Updated: ${cachedData.lastUpdated}`;
            }

            tooltipContent += `\nExtracted: ${new Date(cachedData.timestamp).toLocaleString()}`;

            return {
                html: `${imageHtml}<strong>${headerText}</strong>${setNameLine}<br>${displayLines.join('<br>')}`,
                tooltip: tooltipContent
            };
        }

        // Function to color eBay price based on PriceCharting data comparison
        function colorEbayPriceBasedOnComparison(listingElement, pcData, detectedGrade) {
            try {
                // Find the eBay price element
                const priceElement = listingElement.querySelector('.s-card__price, .s-item__price, .su-styled-text.primary.bold.large-1.s-card__price');
                if (!priceElement) {
                    debugLog('🔍 eBay price element not found for comparison');
                    return;
                }
                
                // Always check and remove existing modifications before updating
                const existingPercentage = priceElement.querySelector('.price-percentage');
                if (existingPercentage) {
                    existingPercentage.remove();
                    debugLog('🧹 Removed existing .price-percentage');
                }
                
                // If the price element has been modified, reset it to get the raw price
                const styledPriceSpan = Array.from(priceElement.children).find(el => 
                    el.tagName === 'SPAN' && el.style.color && el.textContent.includes('$')
                );
                if (styledPriceSpan) {
                    // Extract just the price number
                    const priceMatch = priceElement.textContent.match(/\$[\d,]+\.?\d*/);
                    if (priceMatch) {
                        priceElement.textContent = priceMatch[0];
                        debugLog(`🧹 Reset price element to: ${priceMatch[0]}`);
                    }
                }

                // Extract the eBay price value
                const priceText = priceElement.textContent.trim();
                const priceMatch = priceText.match(/\$?([\d,]+\.?\d*)/);
                if (!priceMatch) {
                    debugLog('🔍 Could not parse eBay price:', priceText);
                    return;
                }

                const ebayPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
                debugLog(`💰 eBay price: $${ebayPrice}`);

                // Determine which PriceCharting price to compare against
                let comparisonPrice = null;
                let comparisonGrade = 'Ungraded';

                if (pcData.prices && Object.keys(pcData.prices).length > 0) {
                    if (detectedGrade && pcData.prices[detectedGrade.key]) {
                        // Use detected grade price
                        const gradeData = pcData.prices[detectedGrade.key];
                        const gradePriceMatch = gradeData.price.match(/\$?([\d,]+\.?\d*)/);
                        if (gradePriceMatch) {
                            comparisonPrice = parseFloat(gradePriceMatch[1].replace(/,/g, ''));
                            comparisonGrade = detectedGrade.displayName;
                        }
                    } else if (pcData.prices['ungraded']) {
                        // Use ungraded price as fallback
                        const ungradedData = pcData.prices['ungraded'];
                        const ungradedPriceMatch = ungradedData.price.match(/\$?([\d,]+\.?\d*)/);
                        if (ungradedPriceMatch) {
                            comparisonPrice = parseFloat(ungradedPriceMatch[1].replace(/,/g, ''));
                            comparisonGrade = 'Ungraded';
                        }
                    } else {
                        // Use first available price
                        const firstPrice = Object.entries(pcData.prices)[0];
                        if (firstPrice) {
                            const [key, priceData] = firstPrice;
                            const firstPriceMatch = priceData.price.match(/\$?([\d,]+\.?\d*)/);
                            if (firstPriceMatch) {
                                comparisonPrice = parseFloat(firstPriceMatch[1].replace(/,/g, ''));
                                comparisonGrade = priceData.grade;
                            }
                        }
                    }
                }

                if (comparisonPrice === null) {
                    debugLog('🔍 No valid PriceCharting price found for comparison');
                    return;
                }

                debugLog(`📊 Comparing eBay $${ebayPrice} vs PriceCharting ${comparisonGrade} $${comparisonPrice}`);

                // Calculate percentage difference
                const percentageDifference = Math.abs((ebayPrice - comparisonPrice) / comparisonPrice) * 100;
                debugLog(`📊 Percentage difference: ${percentageDifference.toFixed(1)}%`);

                // Determine color based on comparison (within 5% = orange)
                let color;
                let comparison;
                if (percentageDifference <= 5) {
                    color = '#f39c12'; // Orange - within 5% (close to market value)
                    comparison = 'near';
                } else if (ebayPrice < comparisonPrice) {
                    color = '#27ae60'; // Green - good deal (more than 5% below)
                    comparison = 'below';
                } else {
                    color = '#e74c3c'; // Red - expensive (more than 5% above)
                    comparison = 'above';
                }

                // Calculate the price difference
                const priceDifference = ebayPrice - comparisonPrice;
                const percentageSign = priceDifference > 0 ? '+' : '-';
                const differenceText = priceDifference > 0 
                    ? `(+$${priceDifference.toFixed(2)})` 
                    : `(-$${Math.abs(priceDifference).toFixed(2)})`;

                // Update price element (always, since we cleaned it above if needed)
                const originalPriceText = priceElement.textContent.trim();
                
                // Clear the price element and rebuild it with styled components
                priceElement.textContent = '';
                
                // Add the original price with color
                const priceSpan = document.createElement('span');
                priceSpan.textContent = `${originalPriceText} ${differenceText}`;
                priceSpan.style.color = color;
                priceSpan.style.fontWeight = 'bold';
                priceSpan.style.textShadow = `0 0 2px ${color}`;
                
                // Add the percentage in smaller, black font
                const percentageSpan = document.createElement('span');
                percentageSpan.className = 'price-percentage';
                percentageSpan.textContent = ` ${percentageSign}${percentageDifference.toFixed(1)}%`;
                percentageSpan.style.color = 'black';
                percentageSpan.style.fontSize = '0.85em';
                percentageSpan.style.fontWeight = 'normal';
                
                priceElement.appendChild(priceSpan);
                priceElement.appendChild(percentageSpan);

                debugLog(`🎨 Colored eBay price ${comparison} PriceCharting ${comparisonGrade}: ${color} with differential: ${differenceText}`);

                // Update tooltip to include comparison info
                const originalTitle = priceElement.title || '';
                const newTitle = `${originalTitle}${originalTitle ? '\n' : ''}eBay: $${ebayPrice} (${comparison} PC ${comparisonGrade}: $${comparisonPrice})`;
                priceElement.title = newTitle;

            } catch (error) {
                debugLog('❌ Error in price comparison:', error);
            }
        }

        // Get unique identifier for a listing
        function getListingUrl(listingElement) {
            // Try to find the listing URL
            const linkElement = listingElement.querySelector('a[href*="/itm/"]');
            if (linkElement) {
                return linkElement.href.split('?')[0]; // Remove query params for consistent caching
            }
            
            // Fallback: use title as identifier
            const titleElement = listingElement.querySelector('.s-card__title .su-styled-text, [role="heading"] span, .s-item__title span, h3 span, .x-item-title-label span');
            if (titleElement) {
                return `title_${titleElement.textContent.trim()}`;
            }
            
            return null;
        }

        // Extract listing ID (item number) from listing element
        function getListingId(listingElement) {
            // Try to find the listing URL and extract ID
            const linkElement = listingElement.querySelector('a[href*="/itm/"]');
            if (linkElement) {
                const match = linkElement.href.match(/\/itm\/(\d+)/);
                if (match) {
                    return match[1]; // Return the item number
                }
            }
            
            // Try data attributes
            const itemId = listingElement.getAttribute('data-item-id') || 
                          listingElement.getAttribute('listingid');
            if (itemId) return itemId;
            
            // Fallback: use title as identifier
            const titleElement = listingElement.querySelector('.s-card__title .su-styled-text, [role="heading"] span, .s-item__title span, h3 span, .x-item-title-label span');
            if (titleElement) {
                return `title_${titleElement.textContent.trim()}`;
            }
            
            return null;
        }

        // Check if listing has already been processed
        function isListingProcessed(listingElement) {
            // Check if display already exists
            if (listingElement.querySelector('.pc-info-display')) {
                return true;
            }
            
            // Check if buttons already exist
            if (listingElement.querySelector('.pricecharting-direct-btn')) {
                return true;
            }
            
            return false;
        }

        // Add notes button to listing
        function addListingNotesButton(listingElement) {
            // Don't add if already exists
            if (listingElement.querySelector('.pokespy-notes-btn')) return;

            // Find the watch button container
            const watchContainer = listingElement.querySelector('.s-item__watchheart, .s-card__watchheart');
            if (!watchContainer) return;

            const listingId = getListingId(listingElement);
            if (!listingId) return;

            // Get existing note if any
            const existingNote = getListingNote(listingId);

            // Create notes button container
            const notesContainer = document.createElement('div');
            notesContainer.className = 'pokespy-notes-container';
            notesContainer.style.cssText = `
                position: absolute;
                top: 45px;
                right: 8px;
                z-index: 100;
            `;

            // Main notes button
            const mainButton = document.createElement('button');
            mainButton.className = 'pokespy-notes-btn';
            mainButton.innerHTML = existingNote ? getRatingIcon(existingNote.rating) : '📝';
            mainButton.title = existingNote ? `Note: ${existingNote.rating}\n${existingNote.description || 'No description'}` : 'Add note';
            mainButton.style.cssText = `
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: ${existingNote ? getRatingColor(existingNote.rating) : 'rgba(255, 255, 255, 0.9)'};
                border: 2px solid ${existingNote ? '#fff' : '#ddd'};
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                position: relative;
            `;

            // Rating options container (hidden by default)
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'pokespy-notes-options';
            optionsContainer.style.cssText = `
                position: absolute;
                top: 0;
                right: 0;
                display: none;
                pointer-events: auto;
                width: 180px;
                height: 180px;
            `;

            // Create rating buttons
            const ratings = [
                { type: 'good', icon: '✓', color: '#27ae60', label: 'Good' },
                { type: 'neutral', icon: '−', color: '#f39c12', label: 'Neutral' },
                { type: 'bad', icon: '✕', color: '#e74c3c', label: 'Bad' }
            ];

            ratings.forEach((rating, index) => {
                const ratingBtn = document.createElement('button');
                ratingBtn.className = `pokespy-rating-btn pokespy-rating-${rating.type}`;
                ratingBtn.innerHTML = rating.icon;
                ratingBtn.title = rating.label;
                ratingBtn.style.cssText = `
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: ${rating.color};
                    border: 2px solid #fff;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    position: absolute;
                    top: 0;
                    right: 0;
                    opacity: 0;
                    transform: translate(0, 0) scale(0);
                    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease;
                    pointer-events: all;
                `;

                ratingBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openNoteModal(listingElement, listingId, rating.type);
                    hideOptions();
                });

                optionsContainer.appendChild(ratingBtn);
            });

            notesContainer.appendChild(mainButton);
            notesContainer.appendChild(optionsContainer);

            // Fan out animation
            let isExpanded = false;
            let hoverTimeout;

            function showOptions() {
                isExpanded = true;
                optionsContainer.style.display = 'block';
                
                const positions = [
                    { x: -45, y: 45 },   // Good: down-left
                    { x: 0, y: 55 },     // Neutral: straight down
                    { x: 45, y: 45 }     // Bad: down-right
                ];
                
                const buttons = optionsContainer.querySelectorAll('.pokespy-rating-btn');
                buttons.forEach((btn, index) => {
                    setTimeout(() => {
                        const pos = positions[index];
                        btn.style.opacity = '1';
                        btn.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(1)`;
                    }, index * 100);
                });
            }

            function hideOptions() {
                isExpanded = false;
                const buttons = optionsContainer.querySelectorAll('.pokespy-rating-btn');
                buttons.forEach(btn => {
                    btn.style.opacity = '0';
                    btn.style.transform = 'translate(0, 0) scale(0)';
                });
                
                setTimeout(() => {
                    optionsContainer.style.display = 'none';
                }, 300);
            }

            mainButton.addEventListener('mouseenter', () => {
                if (!isExpanded) showOptions();
            });

            notesContainer.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                if (isExpanded) {
                    setTimeout(hideOptions, 500);
                }
            });

            mainButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (existingNote) {
                    // If note exists, open modal to edit
                    openNoteModal(listingElement, listingId, existingNote.rating, existingNote.description);
                } else if (!isExpanded) {
                    // If no note and not expanded, show options
                    showOptions();
                }
            });

            // Insert after watch button
            watchContainer.parentNode.style.position = 'relative';
            watchContainer.parentNode.appendChild(notesContainer);
        }

        // Open modal for note description
        function openNoteModal(listingElement, listingId, rating, existingDescription = '') {
            // Remove any existing modal
            const existingModal = document.getElementById('pokespy-note-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'pokespy-note-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: #2f3136;
                color: white;
                padding: 24px;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                animation: slideIn 0.3s ease;
            `;

            const ratingColor = getRatingColor(rating);
            const ratingIcon = getRatingIcon(rating);

            modalContent.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${ratingColor}; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-right: 12px;">
                        ${ratingIcon}
                    </div>
                    <div>
                        <div style="font-size: 18px; font-weight: bold;">Add Note</div>
                        <div style="font-size: 12px; opacity: 0.7;">${rating.charAt(0).toUpperCase() + rating.slice(1)} Rating</div>
                    </div>
                </div>
                <textarea id="pokespy-note-textarea" placeholder="Why did you choose this rating?" style="
                    width: 100%;
                    min-height: 120px;
                    padding: 12px;
                    background: #40444b;
                    border: 2px solid ${ratingColor};
                    border-radius: 8px;
                    color: white;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    margin-bottom: 16px;
                ">${existingDescription}</textarea>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="pokespy-note-cancel" style="
                        padding: 10px 20px;
                        background: #5865f2;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Cancel</button>
                    <button id="pokespy-note-delete" style="
                        padding: 10px 20px;
                        background: #ed4245;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                        display: ${existingDescription ? 'block' : 'none'};
                    ">Delete</button>
                    <button id="pokespy-note-save" style="
                        padding: 10px 20px;
                        background: ${ratingColor};
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Save Note</button>
                </div>
            `;

            // Add animation styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Focus textarea
            const textarea = document.getElementById('pokespy-note-textarea');
            textarea.focus();

            // Event handlers
            document.getElementById('pokespy-note-cancel').addEventListener('click', () => {
                modal.remove();
            });

            document.getElementById('pokespy-note-delete').addEventListener('click', () => {
                const noteKey = `listing_note_${listingId}`;
                GM_deleteValue(noteKey);
                
                // Update button
                const notesBtn = listingElement.querySelector('.pokespy-notes-btn');
                if (notesBtn) {
                    notesBtn.innerHTML = '📝';
                    notesBtn.title = 'Add note';
                    notesBtn.style.background = 'rgba(255, 255, 255, 0.9)';
                    notesBtn.style.borderColor = '#ddd';
                }
                
                modal.remove();
            });

            document.getElementById('pokespy-note-save').addEventListener('click', () => {
                const description = textarea.value.trim();
                
                storeListingNote(listingId, {
                    rating: rating,
                    description: description
                });

                // Update button
                const notesBtn = listingElement.querySelector('.pokespy-notes-btn');
                if (notesBtn) {
                    notesBtn.innerHTML = getRatingIcon(rating);
                    notesBtn.title = `Note: ${rating}\n${description || 'No description'}`;
                    notesBtn.style.background = getRatingColor(rating);
                    notesBtn.style.borderColor = '#fff';
                }

                modal.remove();
            });

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Close on escape key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        // Update the addPriceChartingButtons function
        function addPriceChartingButtons() {
            const listings = document.querySelectorAll('#srp-river-results .s-item, .srp-river-results .s-item, .s-item, .s-card, [data-testid="listing-card"]');

            debugLog(`Found ${listings.length} listings to process`);

            if (listings.length === 0) return;

            // Process in smaller batches
            const batchSize = 5;
            let processed = 0;
            let skipped = 0;

            function processBatch() {
                const endIndex = Math.min(processed + batchSize, listings.length);

                for (let i = processed; i < endIndex; i++) {
                    const listing = listings[i];
                    
                    const listingUrl = getListingUrl(listing);
                    const info = extractListingInfo(listing);
                    
                    // Try to restore from cache first (even if buttons exist)
                    if (listingUrl) {
                        const cached = getListingDisplayCache(listingUrl);
                        if (cached && cached.prices) {
                            debugLog(`📦 Found cache for: ${listingUrl.substring(0, 80)}...`);
                            // Check if display already exists
                            if (!listing.querySelector('.pc-info-display')) {
                                debugLog(`📦 Restoring display from cached data for: ${listingUrl.substring(0, 80)}...`);
                                
                                // Build display from cached data
                                const displayContent = buildDisplayFromCache(cached);
                                
                                // Create display element
                                const pcInfoDisplay = document.createElement('div');
                                pcInfoDisplay.className = 'pc-info-display';
                                pcInfoDisplay.innerHTML = displayContent.html;
                                pcInfoDisplay.title = displayContent.tooltip;
                                
                                Object.assign(pcInfoDisplay.style, {
                                    display: 'block',
                                    marginTop: '4px',
                                    padding: '6px 10px',
                                    background: '#9b59b6',
                                    color: 'white',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    textAlign: 'left',
                                    lineHeight: '1.4',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    border: '1px solid #8e44ad',
                                    opacity: '0',
                                    transition: 'opacity 0.3s ease-in-out'
                                });
                                
                                // Find the best place to insert the display
                                const priceElement = listing.querySelector('.s-card__price, .s-item__price, .s-item__price-range, .notranslate');
                                if (priceElement && priceElement.parentNode) {
                                    priceElement.parentNode.insertBefore(pcInfoDisplay, priceElement.nextSibling);
                                } else {
                                    listing.appendChild(pcInfoDisplay);
                                }
                                
                                // Animate in
                                setTimeout(() => {
                                    pcInfoDisplay.style.opacity = '1';
                                }, 100);
                                
                                // Update price comparison (since eBay price can change)
                                const pcData = {
                                    cardName: cached.cardName,
                                    setName: cached.setName,
                                    prices: cached.prices,
                                    extractedCardName: cached.extractedCardName,
                                    extractedSetName: cached.extractedSetName
                                };
                                colorEbayPriceBasedOnComparison(listing, pcData, cached.detectedGrade);
                                debugLog(`🔄 Updated price comparison from cached data`);
                                
                                // Still add buttons for functionality (if not already present)
                                if (info.fullCardNumber) {
                                    addGooglePriceChartingButton(listing, info.title);
                                    addPriceChartingViewButton(listing, info.cardNumber, info.setNumber, info.matchedPattern);
                                    addPriceChartingDirectButton(listing, info.cardNumber, info.setNumber, info.matchedPattern);
                                } else if (info.setName) {
                                    addGooglePriceChartingButton(listing, info.title);
                                    addPriceChartingDirectButton(listing, null, null, 'title-based');
                                } else {
                                    addGooglePriceChartingButton(listing, info.title);
                                }
                                
                                // Add notes button
                                addListingNotesButton(listing);
                            } else {
                                // Display exists, but update price comparison dynamically
                                const pcData = {
                                    cardName: cached.cardName,
                                    setName: cached.setName,
                                    prices: cached.prices,
                                    extractedCardName: cached.extractedCardName,
                                    extractedSetName: cached.extractedSetName
                                };
                                colorEbayPriceBasedOnComparison(listing, pcData, cached.detectedGrade);
                                debugLog(`🔄 Updated price comparison from cache (display already exists)`);
                            }
                            
                            skipped++;
                            continue;
                        } else {
                            debugLog(`⚠️ No cache found for: ${listingUrl.substring(0, 80)}...`);
                        }
                    }
                    
                    // Skip if already processed and no cache available
                    if (isListingProcessed(listing)) {
                        debugLog(`⏭️ Skipping already-processed listing (has buttons/display, no cache)`);
                        skipped++;
                        continue;
                    }

                    // Debug logging for button creation
                    if (!info.fullCardNumber && info.setName) {
                        debugLog(`📋 Card info - cardNumber: ${info.cardNumber}, setName: ${info.setName}`);
                    }

                    // Add buttons if we have card number OR set name (for title-based matching)
                    if (info.fullCardNumber) {
                        addGooglePriceChartingButton(listing, info.title);
                        addPriceChartingViewButton(listing, info.cardNumber, info.setNumber, info.matchedPattern);
                        addPriceChartingDirectButton(listing, info.cardNumber, info.setNumber, info.matchedPattern);
                    } else if (info.setName) {
                        // No card number, but we have set name - add title-based search button
                        debugLog(`✅ Adding title-based search button for set: ${info.setName}`);
                        addGooglePriceChartingButton(listing, info.title);
                        addPriceChartingDirectButton(listing, null, null, 'title-based');
                    } else {
                        addGooglePriceChartingButton(listing, info.title);
                    }
                    
                    // Add notes button
                    addListingNotesButton(listing);
                }

                processed = endIndex;

                // Schedule next batch if there are more items
                if (processed < listings.length) {
                    setTimeout(() => requestAnimationFrame(processBatch), TIMING.BATCH_PROCESSING_DELAY);
                } else if (skipped > 0) {
                    debugLog(`✅ Processing complete! Skipped ${skipped} already-processed listing(s)`);
                }
            }

            // Start processing
            processBatch();
        }

        // Create floating control panel for PriceCharting functionality
        function createPCControlPanel() {
            // Don't add multiple panels
            if (document.getElementById('pokespy-pc-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'pokespy-pc-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #2f3136;
                color: #ffffff;
                padding: 12px;
                border-radius: 8px;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
                border: 2px solid #9b59b6;
                min-width: 220px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;

            panel.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 10px; color: #9b59b6; font-size: 14px; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span>💎</span>
                        <span>PokeSpy - Search Page</span>
                    </div>
                    <button id="pokespy-search-minimize-btn" style="
                        background: transparent;
                        border: none;
                        color: #b9bbbe;
                        font-size: 16px;
                        cursor: pointer;
                        padding: 4px;
                        line-height: 1;
                        transition: color 0.2s ease;
                    " title="Minimize panel">−</button>
                </div>
                <div id="pokespy-search-panel-content">
                    <div style="margin-bottom: 8px;">
                        <button id="pokespy-check-all-btn" style="
                        width: 100%;
                        padding: 8px 12px;
                        background: linear-gradient(45deg, #9b59b6, #8e44ad);
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 13px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">🚀 Check All Prices</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-stop-check-btn" style="
                        width: 100%;
                        padding: 6px 10px;
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">⏹️ Stop</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-clear-cache-btn" style="
                        width: 100%;
                        padding: 6px 10px;
                        background: #95a5a6;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">🗑️ Clear Cache</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-hide-bad-btn" style="
                        width: 100%;
                        padding: 6px 10px;
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">✕ Hide Bad Listings</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-auto-refresh-btn" style="
                        width: 100%;
                        padding: 6px 10px;
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">🔄 Auto-Refresh OFF</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-discord-settings-btn" style="
                        width: 100%;
                        padding: 6px 10px;
                        background: #5865f2;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">⚙️ Discord Webhook</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-ebay-api-settings-btn" style="
                        width: 100%;
                        padding: 6px 10px;
                        background: #e67e22;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">🔑 eBay API Key</button>
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-api-poll-btn" style="
                        width: 100%;
                        padding: 6px 10px;
                        background: #16a085;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">📡 API Poll OFF</button>
                </div>
                    <div style="font-size: 11px; opacity: 0.8; margin-top: 8px; padding-top: 8px; border-top: 1px solid #444;">
                        <div>Status: <span id="pokespy-status" style="color: #43b581; font-weight: bold;">Ready</span></div>
                        <div id="pokespy-progress" style="margin-top: 4px; display: none;">
                            Progress: <span id="pokespy-progress-text" style="font-weight: bold;">0/0</span>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            // Add minimize functionality
            let isMinimized = false;
            const minimizeBtn = document.getElementById('pokespy-search-minimize-btn');
            const panelContent = document.getElementById('pokespy-search-panel-content');
            const panelHeader = minimizeBtn.parentElement;
            
            // Create minimized icon
            const minimizedIcon = document.createElement('div');
            minimizedIcon.innerHTML = '💎';
            minimizedIcon.style.cssText = `
                font-size: 20px;
                cursor: pointer;
                display: none;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            minimizedIcon.title = 'Expand PokeSpy panel';
            panel.appendChild(minimizedIcon);
            
            function toggleMinimize() {
                isMinimized = !isMinimized;
                if (isMinimized) {
                    panelContent.style.display = 'none';
                    panelHeader.style.display = 'none';
                    minimizedIcon.style.display = 'flex';
                    panel.style.minWidth = 'auto';
                    panel.style.width = '40px';
                    panel.style.height = '40px';
                    panel.style.padding = '0';
                } else {
                    panelContent.style.display = 'block';
                    panelHeader.style.display = 'flex';
                    minimizedIcon.style.display = 'none';
                    panel.style.minWidth = '220px';
                    panel.style.width = 'auto';
                    panel.style.height = 'auto';
                    panel.style.padding = '12px';
                }
            }
            
            minimizeBtn.addEventListener('click', toggleMinimize);
            minimizedIcon.addEventListener('click', toggleMinimize);
            
            minimizeBtn.addEventListener('mouseenter', () => {
                minimizeBtn.style.color = '#ffffff';
            });
            minimizeBtn.addEventListener('mouseleave', () => {
                minimizeBtn.style.color = '#b9bbbe';
            });

            // Add hover effect for check all button
            const checkAllButton = document.getElementById('pokespy-check-all-btn');
            checkAllButton.addEventListener('mouseenter', () => {
                checkAllButton.style.transform = 'translateY(-2px)';
                checkAllButton.style.boxShadow = '0 4px 8px rgba(155,89,182,0.4)';
            });

            checkAllButton.addEventListener('mouseleave', () => {
                checkAllButton.style.transform = 'translateY(0)';
                checkAllButton.style.boxShadow = 'none';
            });

            // Store stop flag
            let shouldStop = false;

            // Stop button handler
            document.getElementById('pokespy-stop-check-btn').addEventListener('click', () => {
                shouldStop = true;
                document.getElementById('pokespy-status').textContent = 'Stopping...';
                document.getElementById('pokespy-status').style.color = '#e67e22';
            });

            // Clear cache button handler
            document.getElementById('pokespy-clear-cache-btn').addEventListener('click', () => {
                const confirmClear = confirm('Clear all cached listing displays? This will remove saved price data from previous sessions.');
                if (confirmClear) {
                    const keys = GM_listValues();
                    let clearedCount = 0;
                    
                    keys.forEach(key => {
                        if (key.startsWith('listing_cache_')) {
                            GM_deleteValue(key);
                            clearedCount++;
                        }
                    });
                    
                    // Also remove all existing displays from current page
                    document.querySelectorAll('.pc-info-display').forEach(display => display.remove());
                    
                    alert(`✅ Cleared ${clearedCount} cached listing(s). Page will reload.`);
                    location.reload();
                }
            });

            // Discord webhook settings modal
            const discordSettingsBtn = document.getElementById('pokespy-discord-settings-btn');
            const webhookUrl = GM_getValue('discord_webhook_url', '');
            
            // Update button text based on webhook status
            if (webhookUrl) {
                discordSettingsBtn.innerHTML = '✅ Discord Webhook';
            }
            
            // eBay API key settings modal
            const ebayApiSettingsBtn = document.getElementById('pokespy-ebay-api-settings-btn');
            const ebayClientId = GM_getValue('ebay_client_id', '');
            const ebayClientSecret = GM_getValue('ebay_client_secret', '');
            
            // Update button text based on API key status
            if (ebayClientId && ebayClientSecret) {
                ebayApiSettingsBtn.innerHTML = '✅ eBay API Key';
            }
            
            ebayApiSettingsBtn.addEventListener('click', () => {
                const currentClientId = GM_getValue('ebay_client_id', '');
                const currentClientSecret = GM_getValue('ebay_client_secret', '');
                const currentEnvironment = GM_getValue('ebay_api_environment', 'sandbox');
                
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    background: #2f3136;
                    color: white;
                    padding: 24px;
                    border-radius: 12px;
                    max-width: 650px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    max-height: 80vh;
                    overflow-y: auto;
                `;
                
                modalContent.innerHTML = `
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 24px;">🔑</span>
                        eBay Developer API Credentials
                    </div>
                    <div style="margin-bottom: 16px; font-size: 13px; opacity: 0.9; line-height: 1.5;">
                        <p style="margin: 0 0 12px 0;"><strong>⚠️ IMPORTANT: Use SANDBOX credentials for testing!</strong></p>
                        <p style="margin: 0 0 12px 0;">To use the eBay Browse API:</p>
                        <ol style="margin: 0; padding-left: 20px;">
                            <li>Go to <a href="https://developer.ebay.com/" target="_blank" style="color: #5865f2;">developer.ebay.com</a></li>
                            <li>Sign in with your eBay account</li>
                            <li>Go to <strong>My Account → Application Keys</strong></li>
                            <li>Under <strong>Sandbox Keys</strong> section, click "Create a keyset" if you don't have one</li>
                            <li>Find the <strong>OAuth credentials</strong> section</li>
                            <li>Copy <strong>App ID (Client ID)</strong> and <strong>Cert ID (Client Secret)</strong></li>
                        </ol>
                        <p style="margin: 12px 0 0 0; font-size: 12px; opacity: 0.7; background: #e67e22; padding: 8px; border-radius: 4px;">
                            💡 <strong>Tip:</strong> Production keys require approval and won't work for most apps. Start with Sandbox!
                        </p>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; opacity: 0.8;">Environment:</label>
                        <select id="pokespy-environment-select" style="
                            width: 100%;
                            padding: 10px;
                            background: #40444b;
                            border: 2px solid #e67e22;
                            border-radius: 6px;
                            color: white;
                            font-size: 12px;
                        ">
                            <option value="sandbox" ${currentEnvironment === 'sandbox' ? 'selected' : ''}>Sandbox (for testing)</option>
                            <option value="production" ${currentEnvironment === 'production' ? 'selected' : ''}>Production (requires approval)</option>
                        </select>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; opacity: 0.8;">App ID (Client ID):</label>
                        <input type="text" id="pokespy-client-id-input" placeholder="YourAppName-YourApp-SBX-... (for Sandbox)" value="${currentClientId}" style="
                            width: 100%;
                            padding: 10px;
                            background: #40444b;
                            border: 2px solid #e67e22;
                            border-radius: 6px;
                            color: white;
                            font-family: monospace;
                            font-size: 11px;
                        ">
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-size: 12px; opacity: 0.8;">Cert ID (Client Secret):</label>
                        <input type="password" id="pokespy-client-secret-input" placeholder="SBX-... (for Sandbox)" value="${currentClientSecret}" style="
                            width: 100%;
                            padding: 10px;
                            background: #40444b;
                            border: 2px solid #e67e22;
                            border-radius: 6px;
                            color: white;
                            font-family: monospace;
                            font-size: 11px;
                        ">
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button id="pokespy-api-key-cancel" style="
                            padding: 10px 20px;
                            background: #95a5a6;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                        ">Cancel</button>
                        <button id="pokespy-api-key-clear" style="
                            padding: 10px 20px;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                            display: ${currentClientId || currentClientSecret ? 'block' : 'none'};
                        ">Clear</button>
                        <button id="pokespy-api-key-save" style="
                            padding: 10px 20px;
                            background: #e67e22;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                        ">Save</button>
                    </div>
                `;
                
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
                
                const clientIdInput = document.getElementById('pokespy-client-id-input');
                const clientSecretInput = document.getElementById('pokespy-client-secret-input');
                const environmentSelect = document.getElementById('pokespy-environment-select');
                clientIdInput.focus();
                
                document.getElementById('pokespy-api-key-cancel').addEventListener('click', () => {
                    modal.remove();
                });
                
                document.getElementById('pokespy-api-key-clear').addEventListener('click', () => {
                    GM_setValue('ebay_client_id', '');
                    GM_setValue('ebay_client_secret', '');
                    GM_setValue('ebay_api_environment', 'sandbox');
                    GM_deleteValue('ebay_api_token');
                    GM_deleteValue('ebay_api_token_expires');
                    ebayApiSettingsBtn.innerHTML = '🔑 eBay API Key';
                    modal.remove();
                });
                
                document.getElementById('pokespy-api-key-save').addEventListener('click', () => {
                    const clientId = clientIdInput.value.trim();
                    const clientSecret = clientSecretInput.value.trim();
                    const environment = environmentSelect.value;
                    
                    if (!clientId || !clientSecret) {
                        alert('⚠️ Please enter both App ID (Client ID) and Cert ID (Client Secret)');
                        return;
                    }
                    
                    GM_setValue('ebay_client_id', clientId);
                    GM_setValue('ebay_client_secret', clientSecret);
                    GM_setValue('ebay_api_environment', environment);
                    // Clear cached token when credentials change
                    GM_deleteValue('ebay_api_token');
                    GM_deleteValue('ebay_api_token_expires');
                    ebayApiSettingsBtn.innerHTML = '✅ eBay API Key';
                    modal.remove();
                });
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.remove();
                });
            });
            
            discordSettingsBtn.addEventListener('click', () => {
                const currentUrl = GM_getValue('discord_webhook_url', '');
                
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    background: #2f3136;
                    color: white;
                    padding: 24px;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                `;
                
                modalContent.innerHTML = `
                    <div style="font-size: 18px; font-weight: bold; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 24px;">🔗</span>
                        Discord Webhook Settings
                    </div>
                    <div style="margin-bottom: 12px; font-size: 13px; opacity: 0.8; line-height: 1.4;">
                        Enter your Discord webhook URL to receive notifications when new listings appear in the top 8.
                    </div>
                    <input type="text" id="pokespy-webhook-input" placeholder="https://discord.com/api/webhooks/..." value="${currentUrl}" style="
                        width: 100%;
                        padding: 10px;
                        background: #40444b;
                        border: 2px solid #5865f2;
                        border-radius: 6px;
                        color: white;
                        font-family: monospace;
                        font-size: 12px;
                        margin-bottom: 16px;
                    ">
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button id="pokespy-webhook-cancel" style="
                            padding: 10px 20px;
                            background: #95a5a6;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                        ">Cancel</button>
                        <button id="pokespy-webhook-clear" style="
                            padding: 10px 20px;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                            display: ${currentUrl ? 'block' : 'none'};
                        ">Clear</button>
                        <button id="pokespy-webhook-save" style="
                            padding: 10px 20px;
                            background: #5865f2;
                            color: white;
                            border: none;
                            border-radius: 6px;
                            font-size: 14px;
                            font-weight: bold;
                            cursor: pointer;
                        ">Save</button>
                    </div>
                `;
                
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
                
                const input = document.getElementById('pokespy-webhook-input');
                input.focus();
                
                document.getElementById('pokespy-webhook-cancel').addEventListener('click', () => {
                    modal.remove();
                });
                
                document.getElementById('pokespy-webhook-clear').addEventListener('click', () => {
                    GM_setValue('discord_webhook_url', '');
                    discordSettingsBtn.innerHTML = '⚙️ Discord Webhook';
                    modal.remove();
                });
                
                document.getElementById('pokespy-webhook-save').addEventListener('click', () => {
                    const url = input.value.trim();
                    if (url && !url.startsWith('https://discord.com/api/webhooks/')) {
                        alert('Invalid Discord webhook URL. It should start with https://discord.com/api/webhooks/');
                        return;
                    }
                    GM_setValue('discord_webhook_url', url);
                    discordSettingsBtn.innerHTML = url ? '✅ Discord Webhook' : '⚙️ Discord Webhook';
                    modal.remove();
                });
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.remove();
                });
            });
            
            // Function to send listing to Discord webhook
            async function sendToDiscord(listingData) {
                const webhookUrl = GM_getValue('discord_webhook_url', '');
                if (!webhookUrl) return;
                
                try {
                    const embed = {
                        title: listingData.title,
                        url: listingData.url,
                        color: 0x9b59b6, // Purple color
                        fields: [
                            {
                                name: 'Price',
                                value: listingData.price || 'N/A',
                                inline: true
                            },
                            {
                                name: 'Time Left',
                                value: listingData.timeLeft || 'N/A',
                                inline: true
                            }
                        ],
                        timestamp: new Date().toISOString()
                    };
                    
                    if (listingData.imageUrl) {
                        embed.thumbnail = { url: listingData.imageUrl };
                    }
                    
                    const payload = {
                        content: '🆕 **New Listing Detected!**',
                        embeds: [embed]
                    };
                    
                    const response = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if (response.ok) {
                        debugLog('✅ Sent to Discord successfully');
                    } else {
                        debugLog('❌ Failed to send to Discord:', response.status, response.statusText);
                    }
                } catch (error) {
                    debugLog('❌ Error sending to Discord:', error);
                }
            }
            
            // eBay API OAuth token management
            async function getEbayApiToken() {
                const clientId = GM_getValue('ebay_client_id', '');
                const clientSecret = GM_getValue('ebay_client_secret', '');
                
                if (!clientId || !clientSecret) {
                    debugLog('❌ No eBay API credentials configured');
                    console.error('Missing credentials - Client ID:', clientId ? 'Set' : 'Missing', 'Client Secret:', clientSecret ? 'Set' : 'Missing');
                    return null;
                }
                
                // Check if we have a cached valid token
                const cachedToken = GM_getValue('ebay_api_token', '');
                const tokenExpires = GM_getValue('ebay_api_token_expires', 0);
                
                if (cachedToken && Date.now() < tokenExpires) {
                    debugLog('✅ Using cached eBay API token');
                    return cachedToken;
                }
                
                // Get new token using Client Credentials grant
                try {
                    debugLog('🔄 Requesting new eBay API token...');
                    const environment = GM_getValue('ebay_api_environment', 'sandbox');
                    console.log('Environment:', environment);
                    console.log('Client ID (first 10 chars):', clientId.substring(0, 10) + '...');
                    console.log('Client Secret (first 5 chars):', clientSecret.substring(0, 5) + '...');
                    
                    const credentials = btoa(`${clientId}:${clientSecret}`);
                    console.log('Base64 credentials (first 20 chars):', credentials.substring(0, 20) + '...');
                    
                    // Use sandbox or production endpoint based on environment
                    const tokenUrl = environment === 'sandbox' 
                        ? 'https://api.sandbox.ebay.com/identity/v1/oauth2/token'
                        : 'https://api.ebay.com/identity/v1/oauth2/token';
                    
                    console.log('Token URL:', tokenUrl);
                    
                    return await new Promise((resolve, reject) => {
                        GM.xmlHttpRequest({
                            method: 'POST',
                            url: tokenUrl,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `Basic ${credentials}`
                            },
                            data: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope',
                            onload: (response) => {
                                console.log('eBay OAuth Response Status:', response.status);
                                console.log('eBay OAuth Response:', response.responseText);
                                
                                if (response.status >= 200 && response.status < 300) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        const token = data.access_token;
                                        const expiresIn = data.expires_in || 7200; // Default 2 hours
                                        
                                        // Cache token (expires 5 minutes early to be safe)
                                        GM_setValue('ebay_api_token', token);
                                        GM_setValue('ebay_api_token_expires', Date.now() + ((expiresIn - 300) * 1000));
                                        
                                        debugLog('✅ eBay API token acquired');
                                        console.log('Token acquired, expires in:', expiresIn, 'seconds');
                                        resolve(token);
                                    } catch (err) {
                                        console.error('Failed to parse token response:', err);
                                        debugLog('❌ Failed to parse token response:', err);
                                        resolve(null);
                                    }
                                } else {
                                    console.error('Authentication failed:', response.status, response.responseText);
                                    debugLog('❌ Failed to get eBay API token:', response.status, response.responseText);
                                    
                                    let errorMsg = 'Authentication failed: ';
                                    try {
                                        const errorData = JSON.parse(response.responseText);
                                        errorMsg += errorData.error_description || errorData.error || response.responseText;
                                    } catch {
                                        errorMsg += response.responseText;
                                    }
                                    
                                    alert('❌ eBay API authentication failed.\n\n' + errorMsg + '\n\nPlease verify:\n1. Client ID is correct (from Production keyset)\n2. Client Secret is correct\n3. You\'re using Production credentials (not Sandbox)\n\nCheck browser console for more details.');
                                    resolve(null);
                                }
                            },
                            onerror: (error) => {
                                console.error('Network error getting eBay token:', error);
                                debugLog('❌ Error getting eBay API token:', error);
                                alert('❌ Cannot connect to eBay API. Network error.');
                                resolve(null);
                            }
                        });
                    });
                } catch (error) {
                    console.error('Exception in getEbayApiToken:', error);
                    debugLog('❌ Error getting eBay API token:', error);
                    return null;
                }
            }
            
            // Extract current search filters from URL
            function extractSearchFilters() {
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);
                
                console.log('📋 URL Parameters:', Object.fromEntries(params.entries()));
                
                // Map eBay _sop codes to Browse API sort values
                const sortMap = {
                    '1': 'price',              // Price + Shipping: lowest first
                    '10': 'newlyListed',       // Best Match -> use newly listed for monitoring
                    '12': '-price',            // Price + Shipping: highest first
                    '15': '-endingSoonest',    // Time: ending soonest
                    '16': 'price',             // Price: lowest first
                    '17': '-price'             // Price: highest first
                };
                
                const sopCode = params.get('_sop');
                const apiSort = sopCode ? (sortMap[sopCode] || 'newlyListed') : 'newlyListed';
                
                // Extract common eBay search parameters
                const filters = {
                    q: params.get('_nkw') || params.get('q') || '', // Search query
                    categoryId: params.get('_sacat') || params.get('_dcat') || params.get('categoryId'), // _dcat is also used
                    sort: apiSort, // Use mapped sort value, default to newlyListed for monitoring
                    buyingFormat: params.get('LH_BIN') === '1' ? 'FIXED_PRICE' : params.get('LH_Auction') === '1' ? 'AUCTION' : null,
                    filter: [],
                    limit: 40 // Get top 40 results to filter down
                };
                
                console.log(`🔄 Sort: eBay code ${sopCode} -> API sort '${apiSort}'`);
                
                // Add price filters
                const minPrice = params.get('_udlo');
                const maxPrice = params.get('_udhi');
                if (minPrice || maxPrice) {
                    // eBay Browse API format: price:[min..max],priceCurrency:USD
                    // Use {min} or {max} syntax for proper filtering
                    const min = minPrice || '0';
                    const max = maxPrice || '';
                    if (max) {
                        filters.filter.push(`price:[${min}..${max}],priceCurrency:USD`);
                    } else {
                        filters.filter.push(`price:[${min}..],priceCurrency:USD`);
                    }
                    console.log(`💰 Price filter: min=$${min}, max=$${max || 'none'}`);
                }
                
                // Add condition filter
                const condition = params.get('LH_ItemCondition');
                if (condition) {
                    filters.filter.push(`conditionIds:{${condition}}`);
                }
                
                // Add location filter - US only
                if (params.get('LH_PrefLoc') === '1' || params.get('LH_AV') === '1') {
                    filters.filter.push('itemLocationCountry:US');
                }
                
                const locatedIn = params.get('_fcid');
                if (locatedIn) {
                    filters.filter.push(`locatedIn:${locatedIn}`);
                }
                
                // Add authenticity guarantee to buying options if requested
                if (params.get('LH_AV') === '1') {
                    // Will be combined with buyingOptions filter below
                    filters.authenticityGuarantee = true;
                    console.log('🔍 Authenticity Guarantee filter will be applied');
                }
                
                // Add "New" filter if LH_Complete is set (completed listings)
                if (params.get('LH_Complete') === '1') {
                    filters.filter.push('listingStatus:COMPLETED');
                }
                
                // Add "Sold" filter
                if (params.get('LH_Sold') === '1') {
                    filters.filter.push('listingStatus:SOLD');
                }
                
                // Add shipping options
                if (params.get('LH_FS') === '1') { // Free shipping
                    filters.filter.push('deliveryOptions:{FREE_SHIPPING}');
                }
                
                // Add filter for items listed in the last hour (for API polling freshness)
                // This ensures we get recent items, not the same old "newly listed" items
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
                filters.filter.push(`listingStartDate:[${oneHourAgo}..`);
                console.log(`⏰ Filtering items listed since: ${oneHourAgo}`);
                
                // Check for custom "Graded" aspect filter
                const graded = params.get('Graded');
                const language = params.get('Language');
                
                // Build aspect_filter if we have aspect parameters
                const aspectFilters = [];
                
                if (graded) {
                    // Use the exact value from the URL parameter
                    aspectFilters.push(`Graded:{${graded}}`);
                }
                
                if (language) {
                    aspectFilters.push(`Language:{${language}}`);
                }
                
                // Store aspect filters separately - they need to be in aspect_filter parameter
                filters.aspectFilter = aspectFilters.length > 0 ? aspectFilters : null;
                filters.gradedFilter = graded; // Also store for backup client-side filtering
                
                console.log('🔍 Extracted filters:', filters);
                
                return filters;
            }
            
            // Call eBay Browse API
            async function searchEbayApi(filters) {
                const token = await getEbayApiToken();
                if (!token) {
                    debugLog('❌ Cannot search: no valid API token');
                    return null;
                }
                
                try {
                    // Build query parameters
                    const params = new URLSearchParams();
                    if (filters.q) params.append('q', filters.q);
                    if (filters.categoryId) params.append('category_ids', filters.categoryId);
                    if (filters.sort) params.append('sort', filters.sort);
                    if (filters.limit) params.append('limit', filters.limit.toString());
                    
                    // Combine all filters into a single comma-separated string
                    const allFilters = [...filters.filter];
                    
                    // Build buyingOptions filter (can have multiple values)
                    const buyingOptions = [];
                    if (filters.buyingFormat) {
                        buyingOptions.push(filters.buyingFormat);
                    }
                    if (filters.authenticityGuarantee) {
                        buyingOptions.push('AUTHENTICITY_GUARANTEE');
                    }
                    if (buyingOptions.length > 0) {
                        allFilters.push(`buyingOptions:{${buyingOptions.join('|')}}`);
                    }
                    
                    if (allFilters.length > 0) {
                        params.append('filter', allFilters.join(','));
                        console.log('🔧 Combined filters:', allFilters.join(','));
                    }
                    
                    // Add aspect_filter if present (Graded, Language, etc.)
                    if (filters.aspectFilter && filters.aspectFilter.length > 0) {
                        // aspect_filter format: categoryId:CATEGORY_ID,AspectName:{Value}
                        const aspectFilterStr = `categoryId:${filters.categoryId},${filters.aspectFilter.join(',')}`;
                        params.append('aspect_filter', aspectFilterStr);
                        console.log('🎯 Aspect filter:', aspectFilterStr);
                    }
                    
                    // Use sandbox or production endpoint based on environment
                    const environment = GM_getValue('ebay_api_environment', 'sandbox');
                    const baseUrl = environment === 'sandbox'
                        ? 'https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search'
                        : 'https://api.ebay.com/buy/browse/v1/item_summary/search';
                    
                    const apiUrl = `${baseUrl}?${params.toString()}`;
                    debugLog('📡 eBay API Request:', apiUrl);
                    console.log('Using environment:', environment);
                    console.log('API URL:', apiUrl);
                    
                    return await new Promise((resolve, reject) => {
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: apiUrl,
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
                                'Accept': 'application/json'
                            },
                            onload: (response) => {
                                if (response.status >= 200 && response.status < 300) {
                                    try {
                                        const data = JSON.parse(response.responseText);
                                        debugLog('✅ eBay API Response:', data);
                                        resolve(data);
                                    } catch (err) {
                                        debugLog('❌ Failed to parse API response:', err);
                                        resolve(null);
                                    }
                                } else {
                                    debugLog('❌ eBay API Error:', response.status, response.responseText);
                                    resolve(null);
                                }
                            },
                            onerror: (error) => {
                                debugLog('❌ Error calling eBay API:', error);
                                resolve(null);
                            }
                        });
                    });
                } catch (error) {
                    debugLog('❌ Error calling eBay API:', error);
                    return null;
                }
            }

            // Auto-refresh functionality
            let autoRefreshEnabled = false;
            let autoRefreshInterval = null;
            let seenListingIds = new Set(GM_getValue('seen_listing_ids', []));
            const autoRefreshBtn = document.getElementById('pokespy-auto-refresh-btn');
            
            // Function to update tab badge
            let originalTitle = document.title;
            let newListingCount = 0;
            
            function updateTabBadge(count) {
                newListingCount = count;
                if (count > 0) {
                    document.title = `(${count}) ${originalTitle}`;
                } else {
                    document.title = originalTitle;
                }
            }
            
            // Clear badge when page is focused
            window.addEventListener('focus', () => {
                if (newListingCount > 0) {
                    debugLog('🔍 Page focused - clearing badge');
                    updateTabBadge(0);
                }
            });
            
            // Function to play notification sound
            function playNotificationSound() {
                // Create a simple beep sound using Web Audio API
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800; // Frequency in Hz
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }
            
            // Function to get top 8 listing IDs
            function getTop8ListingIds() {
                const allListings = document.querySelectorAll('#srp-river-results .s-item, .srp-river-results .s-item, .s-item, .s-card, [data-testid="listing-card"]');
                const listingIds = [];
                
                for (let i = 0; i < Math.min(8, allListings.length); i++) {
                    const listingId = getListingId(allListings[i]);
                    if (listingId) {
                        listingIds.push(listingId);
                    }
                }
                
                return listingIds;
            }
            
            // Function to check for new listings
            function checkForNewListings() {
                const allListings = document.querySelectorAll('#srp-river-results .s-item, .srp-river-results .s-item, .s-item, .s-card, [data-testid="listing-card"]');
                const currentTop8 = [];
                const currentTop8Data = [];
                
                // Get top 8 with their data
                for (let i = 0; i < Math.min(8, allListings.length); i++) {
                    const listing = allListings[i];
                    const listingId = getListingId(listing);
                    if (listingId) {
                        currentTop8.push(listingId);
                        
                        // Extract listing data for Discord
                        const titleElement = listing.querySelector('.s-item__title, h3 span, [role="heading"] span');
                        const priceElement = listing.querySelector('.s-item__price, .s-card__price');
                        const timeLeftElement = listing.querySelector('.s-item__time-left, .s-item__timeLeft, .s-item__time-end');
                        const imageElement = listing.querySelector('.s-item__image-img, img');
                        const linkElement = listing.querySelector('a.s-item__link, a[href*="/itm/"]');
                        
                        currentTop8Data.push({
                            id: listingId,
                            title: titleElement ? cleanEbayTitle(titleElement.textContent.trim()) : 'Unknown Item',
                            price: priceElement ? priceElement.textContent.trim() : null,
                            timeLeft: timeLeftElement ? timeLeftElement.textContent.trim() : null,
                            imageUrl: imageElement ? imageElement.src : null,
                            url: linkElement ? linkElement.href : `https://www.ebay.com/itm/${listingId}`
                        });
                    }
                }
                
                const newListings = currentTop8.filter(id => !seenListingIds.has(id));
                
                if (newListings.length > 0) {
                    debugLog(`🆕 Found ${newListings.length} new listing(s) in top 8!`);
                    playNotificationSound();
                    
                    // Update tab badge
                    updateTabBadge(newListings.length);
                    
                    // Send new listings to Discord
                    newListings.forEach(newId => {
                        const listingData = currentTop8Data.find(data => data.id === newId);
                        if (listingData) {
                            sendToDiscord(listingData);
                        }
                    });
                    
                    // Show notification
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = `🆕 ${newListings.length} new listing(s)!`;
                    statusElement.style.color = '#f39c12';
                    
                    // Flash the status a few times
                    let flashCount = 0;
                    const flashInterval = setInterval(() => {
                        statusElement.style.opacity = statusElement.style.opacity === '0' ? '1' : '0';
                        flashCount++;
                        if (flashCount >= 6) {
                            clearInterval(flashInterval);
                            statusElement.style.opacity = '1';
                            setTimeout(() => {
                                if (autoRefreshEnabled) {
                                    statusElement.textContent = 'Auto-refresh active';
                                    statusElement.style.color = '#3498db';
                                }
                            }, 2000);
                        }
                    }, 300);
                }
                
                // Add current top 8 to seen listings
                currentTop8.forEach(id => seenListingIds.add(id));
                
                // Save to persistent storage
                GM_setValue('seen_listing_ids', Array.from(seenListingIds));
                
                debugLog(`📊 Tracking ${seenListingIds.size} total seen listings (current top 8: ${currentTop8.length})`);
            }
            
            // Auto-refresh button handler
            autoRefreshBtn.addEventListener('click', () => {
                autoRefreshEnabled = !autoRefreshEnabled;
                
                if (autoRefreshEnabled) {
                    // Enable auto-refresh
                    autoRefreshBtn.innerHTML = '🔄 Auto-Refresh ON';
                    autoRefreshBtn.style.background = '#27ae60';
                    
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = 'Auto-refresh active';
                    statusElement.style.color = '#3498db';
                    
                    // Check current top 8 immediately
                    checkForNewListings();
                    
                    // Set up interval to refresh page every 5 seconds
                    let countdown = 5;
                    autoRefreshInterval = setInterval(() => {
                        countdown--;
                        if (countdown <= 0) {
                            debugLog('🔄 Auto-refreshing page...');
                            location.reload();
                        } else {
                            statusElement.textContent = `Refresh in ${countdown}s`;
                        }
                    }, 1000);
                } else {
                    // Disable auto-refresh
                    autoRefreshBtn.innerHTML = '🔄 Auto-Refresh OFF';
                    autoRefreshBtn.style.background = '#3498db';
                    
                    if (autoRefreshInterval) {
                        clearInterval(autoRefreshInterval);
                        autoRefreshInterval = null;
                    }
                    
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = 'Ready';
                    statusElement.style.color = '#43b581';
                }
            });
            
            // On page load, if auto-refresh was enabled, re-enable it
            const wasAutoRefreshEnabled = sessionStorage.getItem('pokespy_auto_refresh_enabled') === 'true';
            if (wasAutoRefreshEnabled) {
                // Small delay to ensure page is fully loaded
                setTimeout(() => {
                    autoRefreshBtn.click();
                }, 1000);
            }
            
            // Save auto-refresh state to session storage
            window.addEventListener('beforeunload', () => {
                sessionStorage.setItem('pokespy_auto_refresh_enabled', autoRefreshEnabled.toString());
            });
            
            // API Polling functionality
            let apiPollEnabled = false;
            let apiPollInterval = null;
            let apiSeenListingIds = new Set(GM_getValue('api_seen_listing_ids', []));
            const apiPollBtn = document.getElementById('pokespy-api-poll-btn');
            
            // Function to check API results for new listings
            async function checkApiForNewListings() {
                // Only run if API polling is enabled
                if (!apiPollEnabled) {
                    return;
                }
                
                const filters = extractSearchFilters();
                debugLog('🔍 Current search filters:', filters);
                
                const results = await searchEbayApi(filters);
                if (!results || !results.itemSummaries) {
                    debugLog('⚠️ No results from eBay API');
                    return;
                }
                
                console.log('📊 eBay API Results:', results);
                console.log(`📦 Found ${results.itemSummaries.length} items`);
                
                const newListings = [];
                let displayIndex = 1;
                
                results.itemSummaries.forEach((item, index) => {
                    const itemId = item.itemId;
                    const isNew = !apiSeenListingIds.has(itemId);
                    
                    // Client-side filtering for graded cards if "Graded: No" was requested
                    const filters = extractSearchFilters();
                    let shouldSkip = false;
                    
                    if (filters.gradedFilter && filters.gradedFilter.toLowerCase() === 'no') {
                        // Check if title contains grading company names
                        const title = item.title.toUpperCase();
                        const gradingKeywords = ['PSA', 'BGS', 'CGC', 'SGC', 'GRADED', 'BECKETT'];
                        if (gradingKeywords.some(keyword => title.includes(keyword))) {
                            shouldSkip = true;
                        }
                    }
                    
                    if (shouldSkip) return; // Skip this item
                    
                    console.log(`${displayIndex}. ${item.title}`);
                    console.log(`   ID: ${itemId} ${isNew ? '🆕 NEW' : '(seen)'}`);
                    console.log(`   Price: ${item.price?.value} ${item.price?.currency || ''}`);
                    console.log(`   URL: ${item.itemWebUrl}`);
                    
                    displayIndex++;
                    
                    if (isNew) {
                        newListings.push({
                            id: itemId,
                            title: item.title,
                            price: item.price ? `${item.price.value} ${item.price.currency}` : 'N/A',
                            timeLeft: item.itemEndDate ? new Date(item.itemEndDate).toLocaleString() : null,
                            imageUrl: item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl,
                            url: item.itemWebUrl
                        });
                        apiSeenListingIds.add(itemId);
                    }
                });
                
                if (newListings.length > 0) {
                    console.log(`\n🆕 Found ${newListings.length} NEW listing(s) via API!`);
                    playNotificationSound();
                    updateTabBadge(newListings.length);
                    
                    // Send to Discord if webhook is configured
                    const webhookUrl = GM_getValue('discord_webhook_url', '');
                    if (webhookUrl) {
                        console.log('📤 Sending new listings to Discord...');
                        for (const listing of newListings) {
                            await sendToDiscord(listing);
                        }
                    }
                    
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = `🆕 ${newListings.length} new via API!`;
                    statusElement.style.color = '#f39c12';
                    
                    setTimeout(() => {
                        if (apiPollEnabled) {
                            statusElement.textContent = 'API polling active';
                            statusElement.style.color = '#16a085';
                        }
                    }, 3000);
                }
                
                // Save seen IDs
                GM_setValue('api_seen_listing_ids', Array.from(apiSeenListingIds));
                console.log(`📊 Tracking ${apiSeenListingIds.size} total API listings\n`);
            }
            
            // API Poll button handler
            apiPollBtn.addEventListener('click', async () => {
                const clientId = GM_getValue('ebay_client_id', '');
                const clientSecret = GM_getValue('ebay_client_secret', '');
                
                if (!clientId || !clientSecret) {
                    alert('⚠️ Please configure your eBay API credentials first!\n\nYou need both Client ID and Client Secret from developer.ebay.com');
                    ebayApiSettingsBtn.click();
                    return;
                }
                
                apiPollEnabled = !apiPollEnabled;
                
                if (apiPollEnabled) {
                    apiPollBtn.innerHTML = '📡 API Poll ON';
                    apiPollBtn.style.background = '#27ae60';
                    
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = 'API polling active';
                    statusElement.style.color = '#16a085';
                    
                    // Check immediately
                    await checkApiForNewListings();
                    
                    // Then check at configured interval
                    apiPollInterval = setInterval(async () => {
                        await checkApiForNewListings();
                    }, TIMING.API_POLL_INTERVAL);
                } else {
                    apiPollBtn.innerHTML = '📡 API Poll OFF';
                    apiPollBtn.style.background = '#16a085';
                    
                    if (apiPollInterval) {
                        clearInterval(apiPollInterval);
                        apiPollInterval = null;
                    }
                    
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = 'Ready';
                    statusElement.style.color = '#43b581';
                }
            });

            // Hide bad listings button handler
            let badListingsHidden = false;
            const hideBadBtn = document.getElementById('pokespy-hide-bad-btn');
            
            hideBadBtn.addEventListener('click', () => {
                badListingsHidden = !badListingsHidden;
                
                if (badListingsHidden) {
                    // Hide all listings marked as bad
                    let hiddenCount = 0;
                    const allListings = document.querySelectorAll('#srp-river-results .s-item, .srp-river-results .s-item, .s-item, .s-card, [data-testid="listing-card"]');
                    
                    allListings.forEach(listing => {
                        const listingId = getListingId(listing);
                        if (listingId) {
                            const note = getListingNote(listingId);
                            if (note && note.rating === 'bad') {
                                listing.style.display = 'none';
                                listing.setAttribute('data-pokespy-hidden', 'true');
                                hiddenCount++;
                            }
                        }
                    });
                    
                    hideBadBtn.innerHTML = '👁️ Show Bad Listings';
                    hideBadBtn.style.background = '#27ae60';
                    
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = `Hidden ${hiddenCount} bad listing(s)`;
                    statusElement.style.color = '#e67e22';
                    setTimeout(() => {
                        statusElement.textContent = 'Ready';
                        statusElement.style.color = '#43b581';
                    }, 3000);
                } else {
                    // Show all hidden listings
                    const hiddenListings = document.querySelectorAll('[data-pokespy-hidden="true"]');
                    hiddenListings.forEach(listing => {
                        listing.style.display = '';
                        listing.removeAttribute('data-pokespy-hidden');
                    });
                    
                    hideBadBtn.innerHTML = '✕ Hide Bad Listings';
                    hideBadBtn.style.background = '#e74c3c';
                    
                    const statusElement = document.getElementById('pokespy-status');
                    statusElement.textContent = 'Showing all listings';
                    statusElement.style.color = '#3498db';
                    setTimeout(() => {
                        statusElement.textContent = 'Ready';
                        statusElement.style.color = '#43b581';
                    }, 3000);
                }
            });

            // Check all button handler
            checkAllButton.addEventListener('click', async () => {
                shouldStop = false;
                const statusElement = document.getElementById('pokespy-status');
                const progressElement = document.getElementById('pokespy-progress');
                const progressText = document.getElementById('pokespy-progress-text');
                const originalText = checkAllButton.innerHTML;
                const pcButtons = document.querySelectorAll('.pricecharting-direct-btn');

                if (pcButtons.length === 0) {
                    statusElement.textContent = '⚠️ No PC buttons found';
                    statusElement.style.color = '#e67e22';
                    setTimeout(() => {
                        statusElement.textContent = 'Ready';
                        statusElement.style.color = '#43b581';
                    }, 3000);
                    return;
                }

                checkAllButton.disabled = true;
                checkAllButton.innerHTML = '⏳ Processing...';
                checkAllButton.style.opacity = '0.6';
                statusElement.textContent = 'Running';
                statusElement.style.color = '#3498db';
                progressElement.style.display = 'block';
                progressText.textContent = `0/${pcButtons.length}`;

                // Log the order of buttons for debugging
                debugLog(`Processing ${pcButtons.length} PC buttons in document order:`);
                pcButtons.forEach((btn, index) => {
                    const listingTitle = btn.closest('.s-item')?.querySelector('.s-item__title')?.textContent?.slice(0, 50) || 'Unknown';
                    debugLog(`${index + 1}. ${listingTitle}... (${btn.title})`);
                });

                let processed = 0;
                let successful = 0;

                // Process buttons one by one, waiting for each to show ✅
                for (const button of pcButtons) {
                    if (shouldStop) {
                        statusElement.textContent = 'Stopped by user';
                        statusElement.style.color = '#e74c3c';
                        break;
                    }

                    if (button.disabled) continue; // Skip already processed buttons

                    try {
                        const listingElement = button.closest('.s-item, .s-card');
                        // Try multiple selectors for the title
                        const titleElement = listingElement?.querySelector('.s-item__title span, .s-item__title, .s-card__title span, .s-card__title, [role="heading"] span');
                        const listingTitle = titleElement?.textContent?.trim()?.slice(0, 40) || 'Unknown';
                        progressText.textContent = `${processed + 1}/${pcButtons.length}`;
                        debugLog(`\n🎯 Processing ${processed + 1}/${pcButtons.length}: ${listingTitle}`);

                        // Skip if already processed (has green background or cached display exists)
                        const hasCachedDisplay = listingElement?.querySelector('.pc-info-display');
                        if (button.style.background === 'rgb(39, 174, 96)' || hasCachedDisplay) {
                            debugLog(`⏭️ Skipping - ${hasCachedDisplay ? 'has cached display' : 'already processed'}`);
                            successful++;
                            processed++;
                            continue;
                        }
                        
                        // Store the original button text and state
                        const originalText = button.textContent;
                        const originalDisabled = button.disabled;
                        
                        // Create a promise that resolves when the button click completes
                        const clickPromise = new Promise(async (resolve, reject) => {
                            try {
                                // Add a one-time event listener to the button to detect when processing completes
                                let completed = false;
                                const observer = new MutationObserver((mutations) => {
                                    // Check if button background turned green (success)
                                    if (button.style.background === 'rgb(39, 174, 96)' && !completed) {
                                        completed = true;
                                        observer.disconnect();
                                        debugLog(`✅ Button ${processed + 1} completed successfully`);
                                        resolve(true);
                                    }
                                    // Check if button background turned orange (timeout/error)
                                    else if (button.style.background === 'rgb(230, 126, 34)' && !completed) {
                                        completed = true;
                                        observer.disconnect();
                                        debugLog(`⚠️ Button ${processed + 1} timed out`);
                                        resolve(false);
                                    }
                                    // Check if button background turned gray (not found/error) - skip and continue
                                    else if (button.style.background === 'rgb(149, 165, 166)' && !completed) {
                                        completed = true;
                                        observer.disconnect();
                                        debugLog(`⏭️ Button ${processed + 1} - card not found, skipping`);
                                        resolve(false);
                                    }
                                    // Check if button shows red (popup blocked)
                                    else if (button.style.background === 'rgb(231, 76, 60)' && !completed) {
                                        completed = true;
                                        observer.disconnect();
                                        debugLog(`🚫 Button ${processed + 1} - popup blocked, skipping`);
                                        resolve(false);
                                    }
                                    // Check if button is re-enabled (finished processing)
                                    else if (!button.disabled && button.textContent === originalText && !completed) {
                                        const displayExists = listingElement?.querySelector('.pc-info-display');
                                        if (displayExists) {
                                            completed = true;
                                            observer.disconnect();
                                            debugLog(`✅ Button ${processed + 1} completed (display shown)`);
                                            resolve(true);
                                        }
                                    }
                                });

                                // Observe button style and state changes
                                observer.observe(button, {
                                    attributes: true,
                                    attributeFilter: ['style', 'disabled']
                                });

                                // Also observe the listing for PC display appearance
                                if (listingElement) {
                                    const listingObserver = new MutationObserver((mutations) => {
                                        const pcDisplay = listingElement.querySelector('.pc-info-display');
                                        if (pcDisplay && pcDisplay.style.opacity === '1' && !completed) {
                                            const displayText = pcDisplay.textContent || '';
                                            if (displayText.includes('$') || displayText.includes('Unpriced')) {
                                                completed = true;
                                                observer.disconnect();
                                                listingObserver.disconnect();
                                                debugLog(`✅ Button ${processed + 1} completed (PC display visible)`);
                                                resolve(true);
                                            }
                                        }
                                    });
                                    listingObserver.observe(listingElement, {
                                        childList: true,
                                        subtree: true,
                                        attributes: true,
                                        attributeFilter: ['style']
                                    });
                                }

                                // Set a timeout in case something goes wrong
                                setTimeout(() => {
                                    if (!completed) {
                                        completed = true;
                                        observer.disconnect();
                                        debugLog(`⏰ Button ${processed + 1} timed out after 20 seconds - skipping`);
                                        resolve(false); // Resolve instead of reject to continue processing
                                    }
                                }, 20000); // Reduced to 20 second timeout per item

                                // Now click the button
                                debugLog(`🖱️ Clicking button ${processed + 1}...`);
                                button.click();
                                
                            } catch (error) {
                                debugLog(`❌ Error in click promise for button ${processed + 1}:`, error);
                                resolve(false); // Resolve instead of reject to continue
                            }
                        });

                        // Wait for the click to complete (or fail)
                        try {
                            const success = await clickPromise;
                            if (success) {
                                successful++;
                            }
                        } catch (error) {
                            debugLog(`❌ Click promise rejected for button ${processed + 1}, continuing anyway:`, error);
                            // Continue processing even if one fails
                        }

                        // Progressive delay - longer after every few items to prevent rate limiting
                        let delay = 1000; // Base delay of 1 second
                        if (processed > 0 && processed % 5 === 0) {
                            // Every 5 items, add an extra delay
                            delay = 3000;
                            debugLog(`⏸️ Taking a 3-second break after ${processed} items to prevent rate limiting...`);
                        }
                        
                        await new Promise(resolve => setTimeout(resolve, delay));

                    } catch (error) {
                        debugLog(`❌ Error processing button ${processed + 1}:`, error);
                        // Continue processing even if one item fails
                    }

                    processed++;
                }

                // Show completion status
                checkAllButton.disabled = false;
                checkAllButton.innerHTML = originalText;
                checkAllButton.style.opacity = '1';
                
                if (shouldStop) {
                    statusElement.textContent = `Stopped (${successful}/${processed})`;
                    statusElement.style.color = '#e74c3c';
                } else {
                    statusElement.textContent = `✅ Complete! ${successful}/${processed}`;
                    statusElement.style.color = '#43b581';
                }

                // Reset status after 5 seconds
                setTimeout(() => {
                    statusElement.textContent = 'Ready';
                    statusElement.style.color = '#43b581';
                    progressElement.style.display = 'none';
                }, 5000);
            });

            debugLog('✅ PokeSpy PC Control Panel created');
        }

        function addPriceResearchTools() {
            // Try immediately first
            addPriceChartingButtons();

            // Add the control panel after buttons are added
            setTimeout(() => {
                createPCControlPanel();
            }, 1000);


            // Then try a few more times quickly if no results found initially
            let attempts = 0;
            const maxAttempts = 5;

            function tryAddButtons() {
                const existingButtons = document.querySelectorAll('.google-pricecharting-btn');
                const totalListings = document.querySelectorAll('#srp-river-results .s-item, .srp-river-results .s-item, .s-item, .s-card').length;

                if (existingButtons.length < totalListings && attempts < maxAttempts) {
                    attempts++;
                    addPriceChartingButtons();
                    createPCControlPanel(); // Also try to add the control panel
                    setTimeout(tryAddButtons, 200);
                }
            }

            setTimeout(tryAddButtons, 100);

            // Re-add buttons when new items load (infinite scroll, etc.)
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1 && (node.classList?.contains('s-item') || node.classList?.contains('s-card'))) {
                                shouldUpdate = true;
                            }
                        });
                    }
                });

                if (shouldUpdate) {
                    setTimeout(addPriceChartingButtons, 50);
                }
            });

            const searchResults = document.querySelector('#srp-river-results, .srp-river-results, .s-results, body');
            if (searchResults) {
                observer.observe(searchResults, { childList: true, subtree: true });
                debugLog('Observer attached to search results container');
            }
        }

        // Add control panel to item page (simplified version for single items)
        function addItemPageControlPanel() {
            console.log('🎛️ Adding item page control panel');
            
            // Don't add multiple panels
            if (document.getElementById('pokespy-item-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'pokespy-item-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #2f3136;
                color: #ffffff;
                padding: 12px;
                border-radius: 8px;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 12px;
                border: 2px solid #3498db;
                min-width: 220px;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;

            // Extract item ID from URL
            const match = window.location.href.match(/\/itm\/(\d+)/);
            const listingId = match ? match[1] : 'Unknown';
            
            // Extract card info from page - try multiple selectors
            let titleElement = document.querySelector('.x-item-title__mainTitle .ux-textspans');
            if (!titleElement) {
                titleElement = document.querySelector('.x-item-title__mainTitle span');
            }
            if (!titleElement) {
                titleElement = document.querySelector('h1.x-item-title__mainTitle');
            }
            if (!titleElement) {
                titleElement = document.querySelector('.x-item-title h1');
            }
            if (!titleElement) {
                titleElement = document.querySelector('h1');
            }
            
            const cardTitle = titleElement ? cleanEbayTitle(titleElement.textContent.trim()) : 'Unknown';
            console.log('📝 Title element found:', !!titleElement);
            console.log('📝 Extracted card title:', cardTitle);
            
            // Try to extract card info using the existing function
            let cardInfo = { title: cardTitle, cardNumber: null, setNumber: null, fullCardNumber: null };
            if (cardTitle && cardTitle !== 'Unknown') {
                // Create a temporary wrapper to use extractListingInfo - use the same selector pattern
                const tempWrapper = document.createElement('div');
                const tempTitle = document.createElement('span');
                tempTitle.className = 's-card__title';
                const tempInnerSpan = document.createElement('span');
                tempInnerSpan.className = 'su-styled-text';
                tempInnerSpan.textContent = cardTitle;
                tempTitle.appendChild(tempInnerSpan);
                tempWrapper.appendChild(tempTitle);
                
                console.log('🔍 Created temp wrapper HTML:', tempWrapper.innerHTML);
                
                const extracted = extractListingInfo(tempWrapper);
                console.log('🔍 extractListingInfo returned:', extracted);
                
                if (extracted && extracted.title) {
                    cardInfo = extracted;
                    console.log('✅ Extracted card info:', cardInfo);
                    console.log('✅ Card number in info:', cardInfo.cardNumber);
                    console.log('✅ Full card number in info:', cardInfo.fullCardNumber);
                } else {
                    console.log('⚠️ Could not extract card info, using title only');
                }
            } else {
                console.log('❌ No title element found or title is Unknown');
            }
            
            console.log('🎯 Final cardInfo object:', cardInfo);
            console.log('🎯 Has card number?', !!(cardInfo.fullCardNumber || cardInfo.cardNumber));
            
            // Check if there's a note for this item
            const existingNote = getListingNote(listingId);
            
            // Build note status display with description
            let noteStatusHtml = '';
            if (existingNote) {
                const ratingColor = getRatingColor(existingNote.rating);
                noteStatusHtml = `
                    <div style="font-size: 12px; margin-bottom: 6px;">
                        <span style="color: ${ratingColor}; font-weight: bold;">● ${existingNote.rating.toUpperCase()}</span>
                    </div>
                    ${existingNote.description ? `
                        <div style="font-size: 11px; color: #dcddde; line-height: 1.4; padding: 6px; background: #36393f; border-radius: 3px; border-left: 3px solid ${ratingColor};">
                            ${existingNote.description}
                        </div>
                    ` : '<div style="font-size: 11px; color: #72767d; font-style: italic;">No description</div>'}
                `;
            } else {
                noteStatusHtml = '<span style="color: #95a5a6;">○ No note</span>';
            }

            const cardNumberDisplay = cardInfo.fullCardNumber || cardInfo.cardNumber || 'Not detected';
            
            panel.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 10px; color: #3498db; font-size: 14px; display: flex; align-items: center; justify-content: space-between; gap: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span>💎</span>
                        <span>PokeSpy - Item Page</span>
                    </div>
                    <button id="pokespy-minimize-btn" style="
                        background: transparent;
                        border: none;
                        color: #b9bbbe;
                        font-size: 16px;
                        cursor: pointer;
                        padding: 4px;
                        line-height: 1;
                        transition: color 0.2s ease;
                    " title="Minimize panel">−</button>
                </div>
                <div id="pokespy-panel-content">
                    <div style="margin-bottom: 8px; padding: 8px; background: #40444b; border-radius: 4px;">
                        <div style="font-size: 11px; color: #b9bbbe; margin-bottom: 4px;">Card Info</div>
                        <div style="font-size: 11px; color: #dcddde; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${cardTitle}">${cardTitle}</div>
                        ${cardNumberDisplay !== 'Not detected' ? `<div style="font-size: 10px; color: #7289da;">Card #: ${cardNumberDisplay}</div>` : '<div style="font-size: 10px; color: #95a5a6; font-style: italic;">No card number detected</div>'}
                    </div>
                <div style="margin-bottom: 8px; padding: 8px; background: #40444b; border-radius: 4px;">
                    <div style="font-size: 11px; color: #b9bbbe; margin-bottom: 4px;">Item ID</div>
                    <div style="font-size: 11px; font-family: monospace; color: #7289da;">#${listingId}</div>
                </div>
                <div style="margin-bottom: 8px; padding: 8px; background: #40444b; border-radius: 4px; max-height: 150px; overflow-y: auto;">
                    <div style="font-size: 11px; color: #b9bbbe; margin-bottom: 4px;">Note</div>
                    ${noteStatusHtml}
                </div>
                <div style="margin-bottom: 8px;">
                    <button id="pokespy-item-edit-note" style="
                        width: 100%;
                        padding: 8px 12px;
                        background: linear-gradient(45deg, #f39c12, #e67e22);
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        margin-bottom: 8px;
                    ">${existingNote ? '✏️ Edit Note' : '📝 Add Note'}</button>
                    <button id="pokespy-item-check-price" style="
                        width: 100%;
                        padding: 8px 12px;
                        background: linear-gradient(45deg, #9b59b6, #8e44ad);
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">� Check PriceCharting</button>
                    <button id="pokespy-item-google-search" style="
                        width: 100%;
                        padding: 8px 12px;
                        background: linear-gradient(45deg, #e74c3c, #c0392b);
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 12px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        margin-top: 8px;
                    ">🔍 Google Search PC</button>
                </div>
                    <div style="font-size: 10px; color: #72767d; text-align: center; margin-top: 8px;">
                        Notes button on image ↗️
                    </div>
                </div>
            `;

            document.body.appendChild(panel);

            // Add minimize functionality
            let isMinimized = false;
            const minimizeBtn = document.getElementById('pokespy-minimize-btn');
            const panelContent = document.getElementById('pokespy-panel-content');
            const panelHeader = minimizeBtn.parentElement;
            
            // Create minimized icon
            const minimizedIcon = document.createElement('div');
            minimizedIcon.innerHTML = '💎';
            minimizedIcon.style.cssText = `
                font-size: 20px;
                cursor: pointer;
                display: none;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            minimizedIcon.title = 'Expand PokeSpy panel';
            panel.appendChild(minimizedIcon);
            
            function toggleMinimize() {
                isMinimized = !isMinimized;
                if (isMinimized) {
                    panelContent.style.display = 'none';
                    panelHeader.style.display = 'none';
                    minimizedIcon.style.display = 'flex';
                    panel.style.minWidth = 'auto';
                    panel.style.width = '40px';
                    panel.style.height = '40px';
                    panel.style.padding = '0';
                } else {
                    panelContent.style.display = 'block';
                    panelHeader.style.display = 'flex';
                    minimizedIcon.style.display = 'none';
                    panel.style.minWidth = '220px';
                    panel.style.width = 'auto';
                    panel.style.height = 'auto';
                    panel.style.padding = '12px';
                }
            }
            
            minimizeBtn.addEventListener('click', toggleMinimize);
            minimizedIcon.addEventListener('click', toggleMinimize);
            
            minimizeBtn.addEventListener('mouseenter', () => {
                minimizeBtn.style.color = '#ffffff';
            });
            minimizeBtn.addEventListener('mouseleave', () => {
                minimizeBtn.style.color = '#b9bbbe';
            });

            // Add hover effect and functionality to Edit/Add Note button
            const editNoteButton = document.getElementById('pokespy-item-edit-note');
            editNoteButton.addEventListener('mouseenter', () => {
                editNoteButton.style.transform = 'scale(1.05)';
                editNoteButton.style.boxShadow = '0 4px 12px rgba(243, 156, 18, 0.4)';
            });
            editNoteButton.addEventListener('mouseleave', () => {
                editNoteButton.style.transform = 'scale(1)';
                editNoteButton.style.boxShadow = 'none';
            });
            editNoteButton.addEventListener('click', () => {
                if (existingNote) {
                    // Edit existing note - modal will update the panel on save/delete
                    openNoteModalWithRefresh(panel, listingId, existingNote.rating, existingNote.description);
                } else {
                    // Show fan-out rating selector for new note
                    showRatingSelector(panel, listingId);
                }
            });

            // Add hover effect to PriceCharting button
            const checkButton = document.getElementById('pokespy-item-check-price');
            checkButton.addEventListener('mouseenter', () => {
                checkButton.style.transform = 'scale(1.05)';
                checkButton.style.boxShadow = '0 4px 12px rgba(155, 89, 182, 0.4)';
            });
            checkButton.addEventListener('mouseleave', () => {
                checkButton.style.transform = 'scale(1)';
                checkButton.style.boxShadow = 'none';
            });
            
            // Add hover effect to Google search button
            const googleButton = document.getElementById('pokespy-item-google-search');
            googleButton.addEventListener('mouseenter', () => {
                googleButton.style.transform = 'scale(1.05)';
                googleButton.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.4)';
            });
            googleButton.addEventListener('mouseleave', () => {
                googleButton.style.transform = 'scale(1)';
                googleButton.style.boxShadow = 'none';
            });
            
            // Add functionality to Google search button - same as search page (uses full title)
            googleButton.addEventListener('click', () => {
                // Use full title like search page does
                console.log('🔍 Google button clicked - cardTitle:', cardTitle);
                console.log('🔍 Google button clicked - cardInfo.title:', cardInfo.title);
                const googleUrl = `https://www.google.com/search?q=PriceCharting+${encodeURIComponent(cardTitle)}`;
                console.log('🔗 Opening Google URL:', googleUrl);
                window.open(googleUrl, '_blank');
                
                googleButton.textContent = '✅ Opened!';
                setTimeout(() => {
                    googleButton.textContent = '🔍 Google Search PC';
                }, 2000);
            });

            // Add functionality to check price button
            checkButton.addEventListener('click', async () => {
                console.log('🔍 Check Price button clicked on item page');
                console.log('📋 Card Title:', cardTitle);
                console.log('📋 Card Info Object:', cardInfo);
                console.log('📋 Full Card Number:', cardInfo.fullCardNumber);
                console.log('📋 Card Number:', cardInfo.cardNumber);
                console.log('📋 Set Number:', cardInfo.setNumber);
                console.log('📋 Set Name:', cardInfo.setName);
                
                checkButton.disabled = true;
                checkButton.textContent = '🔍 Searching...';
                checkButton.style.background = '#95a5a6';
                
                try {
                    // Create a fake listing element that extractListingInfo can work with (same as search page)
                    const fakeListing = document.createElement('div');
                    const titleSpan = document.createElement('span');
                    titleSpan.className = 's-card__title';
                    const titleText = document.createElement('span');
                    titleText.className = 'su-styled-text';
                    titleText.textContent = cardTitle;
                    titleSpan.appendChild(titleText);
                    fakeListing.appendChild(titleSpan);
                    
                    // Use the same function as search page
                    const cardNumber = cardInfo.fullCardNumber || cardInfo.cardNumber;
                    const setNumber = cardInfo.setNumber;
                    
                    // Store card data for PriceCharting to access
                    const cardData = {
                        cardNumber: cardNumber,
                        setNumber: setNumber,
                        ebayTitle: cardTitle
                    };
                    
                    const requestKey = storePriceChartingRequest(cardData);
                    
                    // Use createPriceChartingUrl like search page does
                    const finalUrl = await createPriceChartingUrl(cardNumber, setNumber, requestKey, fakeListing, false);
                    
                    if (finalUrl) {
                        checkButton.textContent = '💰 Opening PC...';
                        checkButton.style.background = '#27ae60';
                        
                        // Open PriceCharting in new tab (item page = view mode, not data sharing)
                        window.open(finalUrl, '_blank');
                        
                        setTimeout(() => {
                            checkButton.textContent = '✅ Opened!';
                            setTimeout(() => {
                                checkButton.textContent = '� Check PriceCharting';
                                checkButton.style.background = 'linear-gradient(45deg, #9b59b6, #8e44ad)';
                                checkButton.disabled = false;
                            }, 2000);
                        }, 500);
                    } else {
                        throw new Error('Could not create PriceCharting URL');
                    }
                } catch (error) {
                    console.error('❌ Error checking price:', error);
                    checkButton.textContent = '❌ ' + error.message.substring(0, 20);
                    checkButton.style.background = '#e74c3c';
                    setTimeout(() => {
                        checkButton.textContent = '� Check PriceCharting';
                        checkButton.style.background = 'linear-gradient(45deg, #9b59b6, #8e44ad)';
                        checkButton.disabled = false;
                    }, 3000);
                }
            });

            console.log('✅ Item page control panel added with card info:', cardInfo);
        }

        // Add notes and rating display to watchlist items
        function addWatchlistNotesDisplay() {
            debugLog('🔍 Searching for watchlist items...');
            
            // Use MutationObserver to handle dynamic content loading
            const processWatchlistItems = () => {
                // Find all watchlist items using the structure from the provided HTML
                const watchlistItems = document.querySelectorAll('.m-item-3');
                debugLog(`Found ${watchlistItems.length} watchlist items`);
                
                watchlistItems.forEach((item, index) => {
                    // Skip if already processed
                    if (item.querySelector('.pokespy-watchlist-note')) {
                        return;
                    }
                    
                    // Extract listing ID from the item
                    const itemIdAttr = item.querySelector('[data-itemid]')?.getAttribute('data-itemid') ||
                                      item.querySelector('[item-id]')?.getAttribute('item-id');
                    
                    if (!itemIdAttr) {
                        debugLog(`⚠️ Could not find item ID for watchlist item ${index + 1}`);
                        return;
                    }
                    
                    const listingId = itemIdAttr;
                    debugLog(`Processing watchlist item ${index + 1}: ID ${listingId}`);
                    
                    // Get the note for this listing
                    const note = getListingNote(listingId);
                    
                    if (!note) {
                        debugLog(`  No note found for item ${listingId}`);
                        return;
                    }
                    
                    debugLog(`  ✓ Found note: ${note.rating} - "${note.description}"`);
                    
                    // Find the note container in the watchlist item
                    const noteContainer = item.querySelector('.m-item-3-col__note [data-testid="user-note"]');
                    
                    if (!noteContainer) {
                        debugLog(`  ⚠️ Could not find note container for item ${listingId}`);
                        return;
                    }
                    
                    // Create the note display element
                    const noteDisplay = document.createElement('div');
                    noteDisplay.className = 'pokespy-watchlist-note';
                    
                    const ratingColor = getRatingColor(note.rating);
                    const ratingIcon = getRatingIcon(note.rating);
                    
                    noteDisplay.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 12px;
                        background: ${ratingColor};
                        color: white;
                        border-radius: 6px;
                        font-size: 13px;
                        font-weight: 500;
                        margin-top: 4px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    `;
                    
                    noteDisplay.innerHTML = `
                        <div style="
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            background: rgba(255, 255, 255, 0.3);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                            font-weight: bold;
                            flex-shrink: 0;
                        ">${ratingIcon}</div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-weight: bold; text-transform: uppercase; font-size: 11px; opacity: 0.9; margin-bottom: 2px;">
                                ${note.rating}
                            </div>
                            ${note.description ? `
                                <div style="
                                    font-size: 12px;
                                    opacity: 0.95;
                                    line-height: 1.4;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    display: -webkit-box;
                                    -webkit-line-clamp: 2;
                                    -webkit-box-orient: vertical;
                                ">${note.description}</div>
                            ` : ''}
                        </div>
                    `;
                    
                    // Add click handler to edit note
                    noteDisplay.style.cursor = 'pointer';
                    noteDisplay.title = 'Click to edit note';
                    noteDisplay.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openWatchlistNoteModal(listingId, note.rating, note.description);
                    });
                    
                    // Insert the note display
                    noteContainer.appendChild(noteDisplay);
                });
            };
            
            // Initial processing
            processWatchlistItems();
            
            // Set up MutationObserver to handle dynamic content
            const observer = new MutationObserver((mutations) => {
                // Debounce: only process if we haven't processed recently
                if (observer.debounceTimer) {
                    clearTimeout(observer.debounceTimer);
                }
                observer.debounceTimer = setTimeout(() => {
                    processWatchlistItems();
                }, 500);
            });
            
            // Observe the watchlist container for changes
            const watchlistContainer = document.querySelector('#gh-wl-list, .m-items, [role="main"]');
            if (watchlistContainer) {
                observer.observe(watchlistContainer, {
                    childList: true,
                    subtree: true
                });
                debugLog('✅ MutationObserver set up for watchlist updates');
            } else {
                debugLog('⚠️ Could not find watchlist container for observation');
            }
        }
        
        // Modal for editing notes on watchlist page
        function openWatchlistNoteModal(listingId, rating, existingDescription = '') {
            // Remove any existing modal
            const existingModal = document.getElementById('pokespy-note-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'pokespy-note-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s ease;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: #2f3136;
                color: white;
                padding: 24px;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                animation: slideIn 0.3s ease;
            `;

            const ratingColor = getRatingColor(rating);
            const ratingIcon = getRatingIcon(rating);

            modalContent.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${ratingColor}; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-right: 12px;">
                        ${ratingIcon}
                    </div>
                    <div>
                        <div style="font-size: 18px; font-weight: bold;">Edit Note</div>
                        <div style="font-size: 12px; opacity: 0.7;">${rating.charAt(0).toUpperCase() + rating.slice(1)} Rating</div>
                    </div>
                </div>
                <textarea id="pokespy-note-textarea" placeholder="Why did you choose this rating?" style="
                    width: 100%;
                    min-height: 120px;
                    padding: 12px;
                    background: #40444b;
                    border: 2px solid ${ratingColor};
                    border-radius: 8px;
                    color: white;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    margin-bottom: 16px;
                ">${existingDescription}</textarea>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="pokespy-note-cancel" style="
                        padding: 10px 20px;
                        background: #5865f2;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Cancel</button>
                    <button id="pokespy-note-delete" style="
                        padding: 10px 20px;
                        background: #ed4245;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                        display: ${existingDescription ? 'block' : 'none'};
                    ">Delete</button>
                    <button id="pokespy-note-save" style="
                        padding: 10px 20px;
                        background: ${ratingColor};
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                    ">Save Note</button>
                </div>
            `;

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Focus textarea
            const textarea = document.getElementById('pokespy-note-textarea');
            textarea.focus();

            // Event handlers
            document.getElementById('pokespy-note-cancel').addEventListener('click', () => {
                modal.remove();
            });

            document.getElementById('pokespy-note-delete').addEventListener('click', () => {
                const noteKey = `listing_note_${listingId}`;
                GM_deleteValue(noteKey);
                modal.remove();
                // Refresh the page to update the display
                window.location.reload();
            });

            document.getElementById('pokespy-note-save').addEventListener('click', () => {
                const description = textarea.value.trim();
                
                storeListingNote(listingId, {
                    rating: rating,
                    description: description
                });

                modal.remove();
                // Refresh the page to update the display
                window.location.reload();
            });

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Close on escape key
            const escHandler = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            };
            document.addEventListener('keydown', escHandler);
        }

        // Initialize eBay functionality
        loadSetsCache();

        // Detect what page we're on and run appropriate functions
        const currentUrl = window.location.href;
        console.log('🌐 Current URL:', currentUrl);
        console.log('🔍 Is search page?', currentUrl.includes('/sch/') || currentUrl.includes('/b/'));
        console.log('🔍 Is item page?', currentUrl.includes('/itm/'));
        console.log('🔍 Is watchlist page?', currentUrl.includes('/mye/myebay/watchlist'));
        
        if (currentUrl.includes('/sch/') || currentUrl.includes('/b/')) {
            debugLog('eBay search page detected');
            console.log('📋 eBay search page detected');
            addPriceResearchTools();
        } else if (currentUrl.includes('/itm/')) {
            debugLog('eBay item page detected');
            console.log('🖼️ eBay item page detected');
            addNotesButtonToItemPage();
            addItemPageControlPanel();
        } else if (currentUrl.includes('/mye/myebay/watchlist')) {
            debugLog('eBay watchlist page detected');
            console.log('👁️ eBay watchlist page detected');
            addWatchlistNotesDisplay();
        }
    }

    // Show rating selector with fan-out animation (for item page "Add Note" button)
    function showRatingSelector(panel, listingId) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'pokespy-rating-selector-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;

        // Create selector container
        const selectorContainer = document.createElement('div');
        selectorContainer.style.cssText = `
            background: #2f3136;
            padding: 32px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            animation: slideIn 0.3s ease;
        `;

        selectorContainer.innerHTML = `
            <div style="color: white; font-size: 18px; font-weight: bold; margin-bottom: 24px; text-align: center;">
                Choose a Rating
            </div>
            <div id="pokespy-rating-buttons" style="display: flex; gap: 20px; justify-content: center; position: relative;">
                <button class="pokespy-rating-select" data-rating="good" style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #27ae60;
                    border: 3px solid #fff;
                    cursor: pointer;
                    font-size: 36px;
                    font-weight: bold;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: scale(0);
                ">✓</button>
                <button class="pokespy-rating-select" data-rating="neutral" style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #f39c12;
                    border: 3px solid #fff;
                    cursor: pointer;
                    font-size: 36px;
                    font-weight: bold;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: scale(0);
                ">−</button>
                <button class="pokespy-rating-select" data-rating="bad" style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #e74c3c;
                    border: 3px solid #fff;
                    cursor: pointer;
                    font-size: 36px;
                    font-weight: bold;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: scale(0);
                ">✕</button>
            </div>
            <div style="margin-top: 20px; text-align: center;">
                <button id="pokespy-rating-cancel" style="
                    padding: 10px 20px;
                    background: #5865f2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                ">Cancel</button>
            </div>
        `;

        overlay.appendChild(selectorContainer);
        document.body.appendChild(overlay);

        // Animate buttons in
        const buttons = selectorContainer.querySelectorAll('.pokespy-rating-select');
        buttons.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }, index * 100);

            // Hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1)';
                btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            });

            // Click handler
            btn.addEventListener('click', () => {
                const rating = btn.getAttribute('data-rating');
                overlay.remove();
                openNoteModalWithRefresh(panel, listingId, rating, '');
            });
        });

        // Cancel button
        document.getElementById('pokespy-rating-cancel').addEventListener('click', () => {
            overlay.remove();
        });

        // Close on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        // Close on escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // Add notes button to individual item page
    function addNotesButtonToItemPage() {
        console.log('🔧 addNotesButtonToItemPage called');
        debugLog('🔧 addNotesButtonToItemPage called');
        
        // Wait for the page to load
        let attempts = 0;
        const maxAttempts = 30; // 15 seconds total
        
        const checkForImage = setInterval(() => {
            attempts++;
            const imageContainer = document.querySelector('.ux-image-carousel-container, .ux-image-carousel, .image-container');
            const watchButton = document.querySelector('.x-watch-heart, .watchlink, [class*="watch"]');
            
            console.log(`Attempt ${attempts}/${maxAttempts} - Checking for elements...`, { 
                imageContainer: !!imageContainer, 
                watchButton: !!watchButton,
                url: window.location.href
            });
            
            if (imageContainer) {
                clearInterval(checkForImage);
                console.log('✅ Found image container:', imageContainer);
                
                // Extract listing ID from URL
                const match = window.location.href.match(/\/itm\/(\d+)/);
                if (!match) {
                    debugLog('Could not extract item ID from URL');
                    return;
                }
                
                const listingId = match[1];
                const existingNote = getListingNote(listingId);
                
                debugLog(`Adding notes button to item page for ID: ${listingId}`);
                
                // Main notes button - styled to match eBay's icon buttons
                const mainButton = document.createElement('button');
                mainButton.className = 'icon-btn pokespy-notes-btn';
                mainButton.setAttribute('data-ebayui', '');
                mainButton.type = 'button';
                mainButton.setAttribute('aria-label', existingNote ? `Note: ${existingNote.rating}` : 'Add note');
                mainButton.innerHTML = existingNote ? getRatingIcon(existingNote.rating) : '📝';
                mainButton.title = existingNote ? `Note: ${existingNote.rating}\n${existingNote.description || 'No description'}` : 'Add note';
                mainButton.style.cssText = `
                    font-size: 20px;
                    background: ${existingNote ? getRatingColor(existingNote.rating) : 'rgba(255, 255, 255, 0.95)'};
                    border-radius: 50%;
                    position: relative;
                    transition: all 0.3s ease;
                `;
                
                // Create notes container to hold button and fan-out options
                const notesContainer = document.createElement('div');
                notesContainer.className = 'pokespy-notes-container-item-page';
                notesContainer.style.cssText = `
                    position: relative;
                    display: inline-block;
                `;

                // Rating options container (hidden by default)
                const optionsContainer = document.createElement('div');
                optionsContainer.className = 'pokespy-notes-options';
                optionsContainer.style.cssText = `
                    position: absolute;
                    top: 0px;
                    left: 20%;
                    transform: translateX(5%);
                    display: none;
                    pointer-events: auto;
                    width: 200px;
                    height: 150px;
                    margin-left: -100px;
                `;

                // Create rating buttons
                const ratings = [
                    { type: 'good', icon: '✓', color: '#27ae60', label: 'Good' },
                    { type: 'neutral', icon: '−', color: '#f39c12', label: 'Neutral' },
                    { type: 'bad', icon: '✕', color: '#e74c3c', label: 'Bad' }
                ];

                ratings.forEach((rating, index) => {
                    const ratingBtn = document.createElement('button');
                    ratingBtn.className = `pokespy-rating-btn pokespy-rating-${rating.type}`;
                    ratingBtn.innerHTML = rating.icon;
                    ratingBtn.title = rating.label;
                    ratingBtn.style.cssText = `
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: ${rating.color};
                        border: 2px solid #fff;
                        cursor: pointer;
                        font-size: 22px;
                        font-weight: bold;
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        position: absolute;
                        top: 0;
                        left: 100px;
                        transform: translate(-50%, 0) scale(0);
                        opacity: 0;
                        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                        pointer-events: all;
                    `;

                    ratingBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openNoteModalForItemPage(listingId, rating.type, mainButton);
                        hideOptions();
                    });

                    optionsContainer.appendChild(ratingBtn);
                });

                notesContainer.appendChild(mainButton);
                notesContainer.appendChild(optionsContainer);

                // Fan out animation
                let isExpanded = false;
                let hoverTimeout;

                function showOptions() {
                    isExpanded = true;
                    optionsContainer.style.display = 'block';
                    
                    const buttons = optionsContainer.querySelectorAll('.pokespy-rating-btn');
                    buttons.forEach((btn, index) => {
                        setTimeout(() => {
                            // Fan out downward in a horizontal arc
                            // index 0 (good) = left, index 1 (neutral) = center, index 2 (bad) = right
                            const positions = [
                                { x: -50, y: 50 },   // Good: down-left
                                { x: 0, y: 60 },     // Neutral: straight down
                                { x: 50, y: 50 }     // Bad: down-right
                            ];
                            const pos = positions[index];
                            
                            btn.style.opacity = '1';
                            btn.style.transform = `translate(calc(-50% + ${pos.x}px), ${pos.y}px) scale(1)`;
                        }, index * 50);
                    });
                }

                function hideOptions() {
                    isExpanded = false;
                    const buttons = optionsContainer.querySelectorAll('.pokespy-rating-btn');
                    buttons.forEach(btn => {
                        btn.style.opacity = '0';
                        btn.style.transform = 'translateX(-50%) scale(0)';
                    });
                    
                    setTimeout(() => {
                        optionsContainer.style.display = 'none';
                    }, 300);
                }

                mainButton.addEventListener('mouseenter', () => {
                    if (!isExpanded) showOptions();
                });

                // Listen for mouse leave on the options container (which now has padding)
                optionsContainer.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimeout);
                    if (isExpanded) {
                        setTimeout(hideOptions, 300);
                    }
                });

                // Also listen on the main container for extra safety
                notesContainer.addEventListener('mouseleave', (e) => {
                    // Only hide if we're not entering the options container
                    if (!optionsContainer.contains(e.relatedTarget)) {
                        clearTimeout(hoverTimeout);
                        if (isExpanded) {
                            setTimeout(hideOptions, 300);
                        }
                    }
                });

                mainButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (existingNote) {
                        openNoteModalForItemPage(listingId, existingNote.rating, mainButton, existingNote.description);
                    } else if (!isExpanded) {
                        showOptions();
                    }
                });

                // Insert into the top-right button area (before the watch heart)
                const topRightButtons = document.querySelector('.ux-image-carousel-buttons__top-right');
                if (topRightButtons) {
                    // Insert before the watch heart button
                    const watchHeart = topRightButtons.querySelector('.x-watch-heart');
                    if (watchHeart) {
                        topRightButtons.insertBefore(notesContainer, watchHeart);
                        console.log('✅ Notes button added before watch heart');
                    } else {
                        topRightButtons.appendChild(notesContainer);
                        console.log('✅ Notes button added to button area');
                    }
                    debugLog('✅ Notes button added to item page');
                } else {
                    // Fallback: just append to the image container itself
                    console.log('⚠️ Could not find top-right buttons, appending to image container');
                    imageContainer.style.position = 'relative';
                    imageContainer.appendChild(notesContainer);
                }
            } else if (attempts >= maxAttempts) {
                console.log('❌ Timed out waiting for elements');
                clearInterval(checkForImage);
            }
        }, 500);

        // Stop checking after 15 seconds
        setTimeout(() => {
            clearInterval(checkForImage);
            console.log('⏱️ Stopped checking for item page elements');
        }, 15000);
    }

    // Open note modal for item page (simplified without listingElement)
    function openNoteModalForItemPage(listingId, rating, buttonElement, existingDescription = '') {
        // Remove any existing modal
        const existingModal = document.getElementById('pokespy-note-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'pokespy-note-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #2f3136;
            color: white;
            padding: 24px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            animation: slideIn 0.3s ease;
        `;

        const ratingColor = getRatingColor(rating);
        const ratingIcon = getRatingIcon(rating);

        modalContent.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: ${ratingColor}; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-right: 12px;">
                    ${ratingIcon}
                </div>
                <div>
                    <div style="font-size: 18px; font-weight: bold;">Add Note</div>
                    <div style="font-size: 12px; opacity: 0.7;">${rating.charAt(0).toUpperCase() + rating.slice(1)} Rating</div>
                </div>
            </div>
            <textarea id="pokespy-note-textarea" placeholder="Why did you choose this rating?" style="
                width: 100%;
                min-height: 120px;
                padding: 12px;
                background: #40444b;
                border: 2px solid ${ratingColor};
                border-radius: 8px;
                color: white;
                font-family: inherit;
                font-size: 14px;
                resize: vertical;
                margin-bottom: 16px;
            ">${existingDescription}</textarea>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button id="pokespy-note-cancel" style="
                    padding: 10px 20px;
                    background: #5865f2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                ">Cancel</button>
                <button id="pokespy-note-delete" style="
                    padding: 10px 20px;
                    background: #ed4245;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    display: ${existingDescription ? 'block' : 'none'};
                ">Delete</button>
                <button id="pokespy-note-save" style="
                    padding: 10px 20px;
                    background: ${ratingColor};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                ">Save Note</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Focus textarea
        const textarea = document.getElementById('pokespy-note-textarea');
        textarea.focus();

        // Event handlers
        document.getElementById('pokespy-note-cancel').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('pokespy-note-delete').addEventListener('click', () => {
            const noteKey = `listing_note_${listingId}`;
            GM_deleteValue(noteKey);
            
            // Update button
            if (buttonElement) {
                buttonElement.innerHTML = '📝';
                buttonElement.title = 'Add note';
                buttonElement.style.background = 'rgba(255, 255, 255, 0.95)';
                buttonElement.style.borderColor = '#ddd';
            }
            
            modal.remove();
        });

        document.getElementById('pokespy-note-save').addEventListener('click', () => {
            const description = textarea.value.trim();
            
            storeListingNote(listingId, {
                rating: rating,
                description: description
            });

            // Update button
            if (buttonElement) {
                buttonElement.innerHTML = getRatingIcon(rating);
                buttonElement.title = `Note: ${rating}\n${description || 'No description'}`;
                buttonElement.style.background = getRatingColor(rating);
                buttonElement.style.borderColor = '#fff';
            }

            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    // ============================================================================
    // PRICECHARTING FUNCTIONALITY
    // ============================================================================

    // Enhanced PriceCharting functionality with better URL parameter detection
    function initializePriceChartingFunctionality() {
        debugLog('💰 Initializing PriceCharting functionality...');

        // Check multiple ways for eBay request parameter
        const fullUrl = window.location.href;
        const url = new URL(fullUrl);
        const hash = window.location.hash;
        const search = window.location.search;

        debugLog(`🔍 Looking for eBay request parameter...`);
        debugLog(`Full URL: ${fullUrl}`);
        debugLog(`Search params: ${search}`);
        debugLog(`Hash: ${hash}`);

        let requestKey = null;

        // Method 1: Check URL search parameters
        requestKey = url.searchParams.get('ebay_request');
        if (requestKey) {
            debugLog(`✅ Found ebay_request in URL params: ${requestKey}`);
        }

        // Method 2: Check hash fragment for ebay_request
        if (!requestKey && hash) {
            const ebayRequestMatch = hash.match(/[&#]ebay_request=([^&\s]+)/);
            if (ebayRequestMatch) {
                requestKey = ebayRequestMatch[1];
                debugLog(`✅ Found ebay_request in hash: ${requestKey}`);
            }
        }

        // Method 3: Check if it's anywhere in the URL (fallback)
        if (!requestKey) {
            const urlRequestMatch = fullUrl.match(/[?&#]ebay_request=([^&\s#]+)/);
            if (urlRequestMatch) {
                requestKey = urlRequestMatch[1];
                debugLog(`✅ Found ebay_request in full URL: ${requestKey}`);
            }
        }

        debugLog(`Final request key: ${requestKey || 'None found'}`);

        if (requestKey) {
            debugLog(`🔗 PriceCharting opened from eBay with request key: ${requestKey}`);

            // Get the card data from eBay
            const cardData = getStoredData(requestKey);
            if (cardData) {
                debugLog(`📋 Retrieved card data from eBay:`, cardData);
                setupPriceChartingExtraction(requestKey, cardData);
            } else {
                debugLog(`❌ No card data found for request key: ${requestKey}`);
                // List all available keys for debugging
                const allKeys = GM_listValues();
                debugLog(`Available storage keys:`, allKeys.filter(key => key.includes('pc_request')));
            }
        } else if (window.location.hash === '#full-prices' || window.location.hash.includes('full-prices')) {
            debugLog(`ℹ️ No eBay request parameter found initially - checking if it's in the hash...`);
            
            // Sometimes the parameter gets moved into the hash, check there
            const hashMatch = window.location.href.match(/ebay_request=([^&\s#]+)/);
            if (hashMatch) {
                requestKey = hashMatch[1];
                debugLog(`✅ Found ebay_request in hash/URL: ${requestKey}`);
                
                // Retry extraction with the found key
                const cardData = getStoredData(requestKey);
                if (cardData) {
                    debugLog(`📋 Retrieved card data from eBay (hash match):`, cardData);
                    setupPriceChartingExtraction(requestKey, cardData);
                    return; // Exit early, extraction is set up
                }
            }

            debugLog(`⚠️ This appears to be a manual visit or the request key was lost`);

            // Auto-close window if opened programmatically but no request key found
            // This happens when the eBay script tries to open PriceCharting but the URL parameters get lost
            if (document.referrer.includes('ebay.com') || document.referrer.includes('ebay.co.uk')) {
                debugLog(`🔄 Auto-closing PriceCharting window in 35 seconds - no request key found from eBay (waiting for manual extraction)`);
                setTimeout(() => {
                    debugLog(`🔄 Closing window now (no request key, likely lost in URL)`);
                    window.close();
                }, 35000); // Wait 35 seconds to allow manual extraction to complete and debugging
            }
        }

        // Always add general extraction for manually opened PriceCharting pages
        setTimeout(() => {
            debugLog(`🔍 Running manual extraction fallback after 2 seconds...`);
            const manualData = extractPriceChartingDataFromPage();
            if (manualData && Object.keys(manualData.prices).length > 0) {
                debugLog('📊 Manual extraction successful:', manualData);

                // Debug logging for storage decision
                debugLog(`🔍 Request key: ${requestKey || 'NONE'}`);
                const existingData = requestKey ? getStoredData(`${requestKey}_data`) : null;
                debugLog(`🔍 Existing data check: ${existingData ? 'YES' : 'NO'}`);

                // If we have a request key, ALWAYS store the data (override any existing data)
                if (requestKey) {
                    debugLog(`🔄 Storing manual extraction data for eBay request: ${requestKey}`);
                    storePriceChartingData(requestKey, manualData);

                    // Show notification that data was stored
                    showExtractionNotification(manualData, { cardName: manualData.extractedCardName });
                    
                    // Auto-close if this was an eBay request
                    if (window.location.hash.includes('full-prices')) {
                        setTimeout(() => {
                            debugLog('🔄 Auto-closing after manual extraction success');
                            window.close();
                        }, 800);
                    }
                } else {
                    debugLog(`⚠️ No request key found - cannot send data back to eBay`);
                }
            } else {
                debugLog(`⚠️ Manual extraction failed or no prices found`);
                
                // If we have a request key and this is a #full-prices page, something went wrong
                if (requestKey && window.location.hash.includes('full-prices')) {
                    debugLog(`❌ Extraction failed for request ${requestKey} - keeping window open for 30 seconds for debugging`);
                    
                    // Keep window open longer for debugging
                    setTimeout(() => {
                        debugLog('🔄 Auto-closing after extraction failure (30s delay for debugging)');
                        window.close();
                    }, 30000); // 30 seconds
                }
            }
        }, 2000); // Increased to 2 seconds to ensure page is fully loaded
    }

    // Set up automatic data extraction on PriceCharting - Enhanced with better error handling
    function setupPriceChartingExtraction(requestKey, cardData) {
        debugLog('🔄 Setting up PriceCharting data extraction...');
        debugLog(`🔑 Request key: ${requestKey}`);
        debugLog(`📋 Card data:`, cardData);
        debugLog(`📍 Current URL: ${window.location.href}`);

        // Wait for page to load
        let attempts = 0;
        const maxAttempts = 20;
        
        const extractData = () => {
            attempts++;
            const readyState = document.readyState;
            debugLog(`📄 Document ready state: ${readyState} (attempt ${attempts}/${maxAttempts})`);

            if (readyState !== 'complete' && attempts < maxAttempts) {
                debugLog(`⏳ Waiting for page to complete loading...`);
                setTimeout(extractData, 200);
                return;
            }

            if (attempts >= maxAttempts) {
                debugLog(`⚠️ Max attempts reached, proceeding with extraction anyway...`);
            }

            debugLog(`🔍 Page loaded, starting data extraction...`);
            debugLog(`🔍 Page title: ${document.title}`);

            const extractedData = extractPriceChartingDataFromPage(cardData);

            if (extractedData && Object.keys(extractedData.prices).length > 0) {
                debugLog(`✅ Data extraction successful!`);
                debugLog(`📊 Extracted data:`, extractedData);

                // Store the extracted data for eBay to retrieve
                debugLog(`💾 Storing data with key: ${requestKey}_data`);
                storePriceChartingData(requestKey, extractedData);

                // Verify the data was stored
                const verifyData = getStoredData(`${requestKey}_data`);
                if (verifyData) {
                    debugLog(`✅ Data storage verified successfully`);
                } else {
                    debugLog(`❌ Data storage verification failed!`);
                }

                // Show notification on PriceCharting page
                showExtractionNotification(extractedData, cardData);

                // Auto-close the tab after successful data extraction (only for direct PC checks)
                if (window.location.hash === '#full-prices') {
                    setTimeout(() => {
                        debugLog('🔄 Auto-closing PriceCharting tab after successful data extraction...');
                        // Give a bit more time to ensure data is fully stored
                        setTimeout(() => {
                            window.close();
                        }, 300);
                    }, 500); // Wait 500ms before closing to ensure storage completes
                } else {
                    debugLog('📊 View page - not auto-closing, user can browse manually');
                }
            } else {
                debugLog(`❌ Data extraction failed or no prices found - keeping window open for 30 seconds for debugging`);

                // Still try to store something so eBay knows we tried
                const fallbackData = {
                    url: window.location.href,
                    title: document.title,
                    cardName: cardData?.cardName ? cleanEbayTitle(cardData.cardName) : 'Unknown',
                    prices: {},
                    extractedCardName: cardData?.cardName ? cleanEbayTitle(cardData.cardName) : null,
                    timestamp: Date.now(),
                    error: 'No prices found on page'
                };

                debugLog(`💾 Storing fallback data:`, fallbackData);
                storePriceChartingData(requestKey, fallbackData);
                
                // Keep window open longer for debugging
                if (window.location.hash === '#full-prices') {
                    setTimeout(() => {
                        debugLog('🔄 Auto-closing after extraction failure (30s delay for debugging)');
                        window.close();
                    }, 30000); // 30 seconds
                }
            }
        };

        // Start extraction with a slight delay
        setTimeout(extractData, 200);
    }

    // Extract data from current PriceCharting page - Enhanced to handle more grade variations
    function extractPriceChartingDataFromPage(cardData = null) {
        try {
            const data = {
                url: window.location.href,
                title: document.title,
                cardName: cardData?.cardName ? cleanEbayTitle(cardData.cardName) : 'Unknown',
                prices: {},
                availability: '',
                lastUpdated: '',
                timestamp: Date.now()
            };

            debugLog('🔍 Searching for prices on PriceCharting full-prices page...');
            debugLog(`🔍 Current page URL: ${window.location.href}`);
            debugLog(`🔍 Has #full-prices hash: ${window.location.hash === '#full-prices'}`);

            // Extract requestKey from URL for alternative URL checking
            let requestKey = null;
            const requestKeyMatch = window.location.href.match(/ebay_request=([^&\s#]+)/);
            if (requestKeyMatch) {
                requestKey = requestKeyMatch[1];
                debugLog(`🔑 Extracted request key from URL: ${requestKey}`);
            }

            // Check if we're on a search results page (not a specific card page)
            if (window.location.href.includes('/search-products') || window.location.href.includes('/search?')) {
                debugLog('⚠️ Landed on search results page - card URL not found');
                
                // Check if there's an alternative URL to try (for Mega cards)
                if (requestKey) {
                    const storedData = GM_getValue(requestKey);
                    if (storedData && storedData.alternativeUrl && !storedData.triedAlternative) {
                        debugLog('🔄 Trying alternative URL format for Mega card...');
                        debugLog(`🔗 Alternative URL: ${storedData.alternativeUrl}`);
                        storedData.triedAlternative = true;
                        GM_setValue(requestKey, storedData);
                        
                        // Redirect to alternative URL and stop further processing
                        debugLog('⏳ Redirecting now...');
                        window.location.replace(storedData.alternativeUrl); // Use replace to avoid back button issues
                        
                        // Don't return data - wait for the redirect
                        throw new Error('Redirecting to alternative URL'); // Stop execution
                    }
                }
                
                debugLog('⚠️ No alternative URL available, treating as not found');
                data.error = 'Card not found - redirected to search results';
                return data; // Return empty prices
            }

            // Check if we're on a 404 or error page
            const pageText = document.body.textContent.toLowerCase();
            if (pageText.includes('404') || pageText.includes('not found') || pageText.includes('no results')) {
                debugLog('⚠️ Appears to be a 404 or error page');
            }

            // Target the specific full-prices table structure
            const fullPricesTable = document.querySelector('#full-prices table');
            debugLog(`🔍 Full-prices table found: ${!!fullPricesTable}`);

            if (fullPricesTable) {
                debugLog('✓ Found full-prices table');

                // Extract data from each row
                const rows = fullPricesTable.querySelectorAll('tbody tr');
                debugLog(`Found ${rows.length} price rows`);

                rows.forEach((row, index) => {
                    const gradeCell = row.querySelector('td:first-child');
                    const priceCell = row.querySelector('td.price.js-price, .price, td:last-child');

                    if (gradeCell && priceCell) {
                        const grade = gradeCell.textContent.trim();
                        const priceText = priceCell.textContent.trim();

                        // Only store if price is not empty and not just a dash
                        if (priceText && priceText !== '-' && priceText !== '') {
                            const priceMatch = priceText.match(/\$[\d,]+\.?\d*/);
                            if (priceMatch) {
                                // Create clean key from grade (remove spaces and special chars)
                                let cleanGrade = grade.toLowerCase().replace(/[^a-z0-9]/g, '_');

                                // Special handling for specific grade formats
                                if (grade === 'Ungraded') {
                                    cleanGrade = 'ungraded';
                                } else if (grade.startsWith('Grade ')) {
                                    // Convert "Grade 9.5" to "grade_9_5"
                                    cleanGrade = grade.toLowerCase().replace('grade ', 'grade_').replace('.', '_');
                                } else if (grade.includes(' 10') && grade.includes('Black')) {
                                    cleanGrade = 'bgs_10_black';
                                } else if (grade.includes(' 10') && grade.includes('Pristine')) {
                                    cleanGrade = 'cgc_10_pristine';
                                }

                                data.prices[cleanGrade] = {
                                    price: priceMatch[0],
                                    grade: grade,
                                    rawText: priceText
                                };
                                debugLog(`  ✓ ${grade} (${cleanGrade}): ${priceMatch[0]}`);
                            }
                        } else {
                            debugLog(`  - ${grade}: No price available`);
                        }
                    }
                });
            } else {
                debugLog('✗ Full-prices table not found, trying fallback selectors...');

                // Fallback: Try general price extraction
                const priceSelectors = [
                    '.price.js-price',
                    '.price',
                    '[class*="price"]',
                    '.used-price',
                    '.new-price'
                ];

                priceSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((el, index) => {
                        const text = el.textContent.trim();
                        const priceMatch = text.match(/\$[\d,]+\.?\d*/);
                        if (priceMatch && parseFloat(priceMatch[0].replace(/[$,]/g, '')) > 0) {
                            const key = `${selector.replace(/[^a-zA-Z]/g, '')}_${index}`;
                            data.prices[key] = {
                                price: priceMatch[0],
                                grade: 'Unknown',
                                rawText: text
                            };
                        }
                    });
                });
            }

            // Extract card title from the full-prices heading
            const fullPricesHeading = document.querySelector('#full-prices h2');
            if (fullPricesHeading) {
                const headingText = fullPricesHeading.textContent.trim();
                const titleMatch = headingText.match(/Full Price Guide: (.+?) #(\d+)/);
                if (titleMatch) {
                    data.extractedCardName = cleanEbayTitle(titleMatch[1]);
                    data.extractedCardNumber = titleMatch[2];
                    debugLog(`📋 Extracted from heading: ${data.extractedCardName} #${data.extractedCardNumber}`);
                }
            }

            // Extract card image from product_details div
            const productDetailsDiv = document.querySelector('#product_details');
            if (productDetailsDiv) {
                const cardImage = productDetailsDiv.querySelector('.cover img[src*="storage.googleapis.com"]');
                if (cardImage && cardImage.src) {
                    data.imageUrl = cardImage.src;
                    debugLog(`🖼️ Extracted card image: ${data.imageUrl}`);
                } else {
                    debugLog(`⚠️ No card image found in #product_details`);
                }
            }

            // Always try to extract set name from page title regardless of card name source
            if (document.title) {
                const pageTitle = document.title.trim();
                // Match patterns like "CardName #SM210 Prices | Pokemon Promo | Pokemon Cards"
                const setNameMatch = pageTitle.match(/Prices\s*\|\s*(.+?)\s*\|/);
                if (setNameMatch) {
                    data.extractedSetName = setNameMatch[1];
                    debugLog(`📋 Extracted set name from page title: ${data.extractedSetName}`);
                }
            }

            // If no card name found from heading, try extracting from page title
            if (!data.extractedCardName && document.title) {
                const pageTitle = document.title.trim();
                // Match patterns like "CardName #SM210 Prices | Pokemon Promo | Pokemon Cards"
                const pageTitleMatch = pageTitle.match(/^(.+?)\s+#([A-Z0-9]+)\s+Prices\s*\|/);
                if (pageTitleMatch) {
                    data.extractedCardName = cleanEbayTitle(pageTitleMatch[1]);
                    data.extractedCardNumber = pageTitleMatch[2];
                    debugLog(`📋 Extracted from page title: ${data.extractedCardName} #${data.extractedCardNumber}`);
                }
            }

            // Look for last updated date anywhere on the page
            const dateSelectors = [
                '[class*="updated"]',
                '[class*="date"]',
                '.last-updated',
                '.data-date',
                'small', // Sometimes dates are in small tags
                '.text-muted' // Or muted text
            ];

            for (const selector of dateSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const el of elements) {
                    const text = el.textContent.trim();
                    if (text.includes('202') || text.includes('updated') || text.includes('last')) {
                        data.lastUpdated = text;
                        break;
                    }
                }
                if (data.lastUpdated) break;
            }

            const priceCount = Object.keys(data.prices).length;
            debugLog(`💎 Extracted ${priceCount} prices from PriceCharting:`);

            // Log all extracted prices for debugging
            Object.entries(data.prices).forEach(([key, priceData]) => {
                debugLog(`  ${priceData.grade}: ${priceData.price}`);
            });

            if (priceCount > 0) {
                debugLog('✅ Price extraction successful');
            } else {
                debugLog('⚠️ No prices found - check selectors');
            }

            return data;

        } catch (error) {
            console.error('❌ Error extracting PriceCharting data:', error);
            return null;
        }
    }

    // Show notification on PriceCharting page - Updated with better messaging
    function showExtractionNotification(extractedData, cardData) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #27ae60;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        const totalPrices = Object.keys(extractedData.prices || {}).length;
        const pricedGrades = Object.values(extractedData.prices || {}).filter(p => p.hasPrice !== false && p.price !== 'Unpriced').length;

        let message = '';
        const cardName = cleanEbayTitle(extractedData.extractedCardName || cardData?.cardName || 'Unknown');
        if (totalPrices > 0) {
            message = `
                <strong>✅ Data Extracted for eBay</strong><br>
                Card: ${cardName}<br>
                Total grades: ${totalPrices}<br>
                With prices: ${pricedGrades}<br>
                <small>This data will appear in your eBay listing</small>
            `;
        } else {
            message = `
                <strong>⚠️ Data Attempted for eBay</strong><br>
                Card: ${cardName}<br>
                No prices found on this page<br>
                <small>eBay will show "Unpriced"</small>
            `;
        }

        notification.innerHTML = message;
        document.body.appendChild(notification);

        // Auto-remove after 6 seconds (slightly longer to read)
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 6000);
    }

    // Enhanced function to detect grade from eBay title
    function detectGradeFromTitle(title) {
        if (!title) return null;

        const titleUpper = title.toUpperCase();
        debugLog(`🔍 Grade detection for title: "${title}"`);

        // PSA grades
        const psaMatch = titleUpper.match(/PSA\s*(\d+(?:\.\d+)?)/);
        if (psaMatch) {
            const grade = psaMatch[1];
            let key, displayName;

            if (grade === '10') {
                key = `psa_${grade}`;
                displayName = `PSA ${grade}`;
            } else {
                // PSA grades below 10 are listed as "Grade X" on PriceCharting
                key = `grade_${grade.replace('.', '_')}`;
                displayName = `Grade ${grade}`;
            }

            return {
                company: 'PSA',
                grade: grade,
                key: key,
                displayName: displayName
            };
        }

        // BGS grades
        const bgsMatch = titleUpper.match(/BGS\s*(\d+(?:\.\d+)?)/);
        if (bgsMatch) {
            const grade = bgsMatch[1];
            let key, displayName;

            if (grade === '10' && titleUpper.includes('BLACK')) {
                key = 'bgs_10_black';
                displayName = 'BGS 10 Black';
            } else if (grade === '10') {
                key = 'bgs_10';
                displayName = 'BGS 10';
            } else {
                // BGS grades below 10 are listed as "Grade X" on PriceCharting
                key = `grade_${grade.replace('.', '_')}`;
                displayName = `Grade ${grade}`;
            }

            return {
                company: 'BGS',
                grade: grade,
                key: key,
                displayName: displayName
            };
        }

        // CGC grades - handle both "CGC 10" and "CGC PRISTINE 10" formats
        const cgcMatch = titleUpper.match(/CGC\s*(?:PRISTINE\s*)?(\d+(?:\.\d+)?)/);
        if (cgcMatch) {
            debugLog(`🎯 CGC grade detected: match = "${cgcMatch[0]}", grade = "${cgcMatch[1]}"`);
            const grade = cgcMatch[1];
            let key, displayName;

            if (grade === '10' && titleUpper.includes('PRISTINE')) {
                key = 'cgc_10_pristine';
                displayName = 'CGC 10 Pristine';
                debugLog(`🏆 CGC Pristine 10 detected - using key: ${key}`);
            } else if (grade === '10') {
                key = 'cgc_10';
                displayName = 'CGC 10';
            } else {
                // CGC grades below 10 are listed as "Grade X" on PriceCharting
                key = `grade_${grade.replace('.', '_')}`;
                displayName = `Grade ${grade}`;
            }

            return {
                company: 'CGC',
                grade: grade,
                key: key,
                displayName: displayName
            };
        }

        // SGC grades
        const sgcMatch = titleUpper.match(/SGC\s*(\d+(?:\.\d+)?)/);
        if (sgcMatch) {
            const grade = sgcMatch[1];
            let key, displayName;

            if (grade === '10') {
                key = 'sgc_10';
                displayName = 'SGC 10';
            } else {
                // SGC grades below 10 are listed as "Grade X" on PriceCharting
                key = `grade_${grade.replace('.', '_')}`;
                displayName = `Grade ${grade}`;
            }

            return {
                company: 'SGC',
                grade: grade,
                key: key,
                displayName: displayName
            };
        }

        // Generic Grade patterns (for Grade 9.5, etc.)
        const gradeMatch = titleUpper.match(/GRADE\s*(\d+(?:\.\d+)?)/);
        if (gradeMatch) {
            const grade = gradeMatch[1];
            return {
                company: 'Generic',
                grade: grade,
                key: `grade_${grade.replace('.', '_')}`,
                displayName: `Grade ${grade}`
            };
        }

        return null;
    }

})();
