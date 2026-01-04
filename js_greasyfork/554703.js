// ==UserScript==
// @name         HeyMax SubCaps Viewer
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Monitor network requests and display SubCaps calculations for UOB cards on HeyMax
// @author       Laurence Putra Franslay (@laurenceputra)
// @source       https://github.com/laurenceputra/heymax-subcaps-viewer/
// @match        https://heymax.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heymax.ai
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554703/HeyMax%20SubCaps%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/554703/HeyMax%20SubCaps%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[HeyMax SubCaps Viewer] Tampermonkey script starting...');

    // ============================================================================
    // DEBUG CONFIGURATION
    // ============================================================================
    
    const DEBUG_MODE = false; // Set to true for verbose logging
    
    // Logging utility functions
    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log(...args);
        }
    }
    
    function infoLog(message, color = '#4CAF50') {
        console.log(`%c[HeyMax SubCaps Viewer] ${message}`, `color: ${color}; font-weight: bold;`);
    }
    
    function errorLog(...args) {
        console.error('[HeyMax SubCaps Viewer]', ...args);
    }

    // ============================================================================
    // PART 1: API INTERCEPTION VIA DIRECT MONKEY PATCHING
    // ============================================================================
    
    // Store original functions
    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const originalFetch = targetWindow.fetch;
    const originalXHROpen = targetWindow.XMLHttpRequest.prototype.open;
    const originalXHRSend = targetWindow.XMLHttpRequest.prototype.send;

    // Check if URL should be logged
    function shouldLogUrl(url) {
        try {
            const urlObj = new URL(url, window.location.href);
            
            if (urlObj.hostname !== 'heymax.ai') {
                return false;
            }
            
            const pathname = urlObj.pathname;
            
            if (pathname.startsWith('/cards/your-cards/')) {
                return true;
            }
            
            if (pathname.startsWith('/api/spend_tracking/cards/') && 
                (pathname.includes('/summary') || pathname.includes('/transactions'))) {
                return true;
            }
            
            if (pathname === '/api/spend_tracking/card_tracker') {
                return true;
            }
            
            return false;
        } catch (error) {
            return false;
        }
    }

    // ============================================================================
    // PART 2: DATA STORAGE FUNCTIONS
    // ============================================================================

    // Compiled regex patterns (created once for reuse)
    const REGEX_CARD_ID_API = /\/api\/spend_tracking\/cards\/([a-f0-9]+)\//;
    const REGEX_CARD_ID_PAGE = /\/cards\/your-cards\/([a-f0-9]+)/;

    // Extract card ID from URL
    function extractCardId(url) {
        const match = url.match(REGEX_CARD_ID_API);
        if (match) {
            return match[1];
        }
        
        if (url.includes('/cards//')) {
            const pageMatch = window.location.pathname.match(REGEX_CARD_ID_PAGE);
            return pageMatch ? pageMatch[1] : null;
        }
        
        return null;
    }

    // Determine the data type from URL
    function getDataType(url) {
        if (url.includes('/transactions')) {
            return 'transactions';
        } else if (url.includes('/summary')) {
            return 'summary';
        } else if (url.includes('/card_tracker')) {
            return 'card_tracker';
        }
        return null;
    }

    // Store API data with request type tracking
    function storeApiData(requestType, method, url, status, data, timestamp) {
        const typeEmoji = requestType === 'fetch' ? '🌐' : '📡';
        const typeLabel = requestType === 'fetch' ? 'FETCH' : 'XHR';
        
        const dataType = getDataType(url);
        let cardId = extractCardId(url);
        
        // For card_tracker, try to get card ID from the current page URL
        if (dataType === 'card_tracker' && !cardId) {
            const pageMatch = window.location.pathname.match(REGEX_CARD_ID_PAGE);
            if (pageMatch) {
                cardId = pageMatch[1];
            }
        }
        
        // Get existing card data
        const cardDataStr = GM_getValue('cardData', '{}');
        const cardData = JSON.parse(cardDataStr);
        
        debugLog('[HeyMax SubCaps Viewer] Current cardData before update:', cardData);
        
        if (dataType && cardId) {
            // Initialize card object if it doesn't exist
            if (!cardData[cardId]) {
                cardData[cardId] = {};
            }
            
            // Store the latest data for this card ID and data type
            cardData[cardId][dataType] = {
                data: data,
                timestamp: timestamp,
                url: url,
                status: status,
                requestType: requestType
            };
            
            infoLog(`${typeEmoji} Stored ${dataType} for card ${cardId} via ${typeLabel}`, requestType === 'fetch' ? '#2196F3' : '#FF9800');
        } else if (dataType === 'card_tracker' && !cardId) {
            // card_tracker on main listing page (no specific card ID)
            cardData['card_tracker'] = {
                data: data,
                timestamp: timestamp,
                url: url,
                status: status,
                requestType: requestType
            };
            
            infoLog(`${typeEmoji} Stored card_tracker (global) via ${typeLabel}`, requestType === 'fetch' ? '#2196F3' : '#FF9800');
        }
        
        // Save the updated cardData structure
        GM_setValue('cardData', JSON.stringify(cardData));
        
        if (DEBUG_MODE) {
            console.groupCollapsed(`%c[HeyMax SubCaps Viewer] ${typeEmoji} Storage Details`, `color: ${requestType === 'fetch' ? '#2196F3' : '#FF9800'};`);
            console.log('Request Type:', typeLabel);
            console.log('Method:', method);
            console.log('URL:', url);
            console.log('Status:', status);
            console.log('Timestamp:', timestamp);
            console.log('Updated cardData:', cardData);
            console.groupEnd();
        }
    }

    // ============================================================================
    // PART 3: FETCH INTERCEPTION
    // ============================================================================

    // Reusable fetch interceptor factory
    function createFetchInterceptor() {
        return async function(...args) {
            const [resource, config] = args;
            const url = typeof resource === 'string' ? resource : resource.url;
            const method = config?.method || 'GET';

            debugLog(`%c[HeyMax SubCaps Viewer] 🌐 FETCH Intercepted: ${method} ${url}`, 'color: #2196F3; font-weight: bold;');

            const response = await originalFetch.apply(this, args);
            
            const shouldLog = shouldLogUrl(url);
            debugLog(`%c[HeyMax SubCaps Viewer] 🌐 FETCH Response: ${method} ${url} - Status: ${response.status} - Will Log: ${shouldLog}`, 
                shouldLog ? 'color: #4CAF50;' : 'color: #9E9E9E;');
            
            if (!shouldLog) {
                return response;
            }

            const clonedResponse = response.clone();
            
            try {
                const contentType = response.headers.get('content-type');
                let responseData;
                
                if (contentType && contentType.includes('application/json')) {
                    responseData = await clonedResponse.json();
                    const timestamp = new Date().toISOString();
                    
                    if (DEBUG_MODE) {
                        console.groupCollapsed(`%c[HeyMax SubCaps Viewer] 🌐 FETCH Response Logged`, 'color: #2196F3; font-weight: bold;');
                        console.log('Method:', method);
                        console.log('URL:', url);
                        console.log('Status:', response.status);
                        console.log('Response Data:', responseData);
                        console.groupEnd();
                    }
                    
                    storeApiData('fetch', method, url, response.status, responseData, timestamp);
                } else {
                    const text = await clonedResponse.text();
                    if (text.length < 1000) {
                        const timestamp = new Date().toISOString();
                        
                        if (DEBUG_MODE) {
                            console.groupCollapsed(`%c[HeyMax SubCaps Viewer] 🌐 FETCH Response Logged`, 'color: #2196F3; font-weight: bold;');
                            console.log('Method:', method);
                            console.log('URL:', url);
                            console.log('Status:', response.status);
                            console.log('Response Data:', text);
                            console.groupEnd();
                        }
                        
                        storeApiData('fetch', method, url, response.status, text, timestamp);
                    }
                }
            } catch (error) {
                errorLog('Error reading fetch response:', error);
            }

            return response;
        };
    }

    // Apply initial fetch interceptor
    targetWindow.fetch = createFetchInterceptor();
    targetWindow.fetch.patchedVersion = true;

    // ============================================================================
    // PART 4: XMLHttpRequest INTERCEPTION
    // ============================================================================

    // Reusable XHR interceptor factory - returns open and send methods
    function createXHRInterceptors() {
        const openInterceptor = function(method, url, ...rest) {
            this._method = method;
            this._url = url;
            debugLog(`%c[HeyMax SubCaps Viewer] 📡 XHR Intercepted: ${method} ${url}`, 'color: #FF9800; font-weight: bold;');
            return originalXHROpen.apply(this, [method, url, ...rest]);
        };

        const sendInterceptor = function(...args) {
            const url = this._url;
            const method = this._method;
            
            if (url && typeof url === 'string') {
                // Use named function for proper cleanup
                const loadHandler = function() {
                    if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
                        const shouldLog = shouldLogUrl(url);
                        debugLog(`%c[HeyMax SubCaps Viewer] 📡 XHR Response: ${method} ${url} - Status: ${this.status} - Will Log: ${shouldLog}`, 
                            shouldLog ? 'color: #4CAF50;' : 'color: #9E9E9E;');
                        
                        if (!shouldLog) {
                            // Clean up listener before early return
                            this.removeEventListener('load', loadHandler);
                            return;
                        }

                        try {
                            const contentType = this.getResponseHeader('content-type');
                            let responseData;

                            if (contentType && contentType.includes('application/json')) {
                                responseData = JSON.parse(this.responseText);
                            } else if (this.responseText && this.responseText.length < 1000) {
                                responseData = this.responseText;
                            }

                            if (responseData) {
                                const timestamp = new Date().toISOString();
                                
                                if (DEBUG_MODE) {
                                    console.groupCollapsed(`%c[HeyMax SubCaps Viewer] 📡 XHR Response Logged`, 'color: #FF9800; font-weight: bold;');
                                    console.log('Method:', method);
                                    console.log('URL:', url);
                                    console.log('Status:', this.status);
                                    console.log('Response Data:', responseData);
                                    console.groupEnd();
                                }
                                
                                storeApiData('xhr', method, url, this.status, responseData, timestamp);
                            }
                        } catch (error) {
                            errorLog('Error processing XHR response:', error);
                        }
                    }
                    
                    // Always clean up listener after execution
                    this.removeEventListener('load', loadHandler);
                };
                
                this.addEventListener('load', loadHandler);
            }
            
            return originalXHRSend.apply(this, args);
        };

        return { openInterceptor, sendInterceptor };
    }

    // Apply initial XHR interceptors
    const { openInterceptor: initialXHROpen, sendInterceptor: initialXHRSend } = createXHRInterceptors();
    targetWindow.XMLHttpRequest.prototype.open = initialXHROpen;
    targetWindow.XMLHttpRequest.prototype.send = initialXHRSend;

    console.log('[HeyMax SubCaps Viewer] API interception initialized');

    // ============================================================================
    // PART 4.5: PATCH PROTECTION WITH EXPONENTIAL BACKOFF
    // ============================================================================

    let patchCheckInterval = 1000; // Start at 1 second
    const MIN_CHECK_INTERVAL = 1000; // Minimum 1 second
    const MAX_CHECK_INTERVAL = 60000; // Maximum 60 seconds
    const BACKOFF_MULTIPLIER = 1.5; // Increase by 50% each time
    let consecutiveStableChecks = 0;
    const STABLE_CHECKS_THRESHOLD = 10; // After 10 stable checks, interval increases

    // Store references to the current XHR interceptors for comparison
    let currentXHROpen = initialXHROpen;
    let currentXHRSend = initialXHRSend;

    function checkAndReapplyPatches() {
        let patchesOverwritten = false;

        // Check if fetch was overwritten (marker property missing or false)
        if (typeof targetWindow.fetch !== 'function' || !targetWindow.fetch.patchedVersion) {
            if (typeof originalFetch !== 'function') {
                infoLog('❌ Cannot re-apply fetch patch: originalFetch is not a function. Skipping patch to avoid breaking fetch.', '#F44336');
            } else {
                infoLog('⚠️ Fetch patch overwritten, re-applying...', '#FF9800');
                targetWindow.fetch = createFetchInterceptor();
                targetWindow.fetch.patchedVersion = true;
                patchesOverwritten = true;
            }
        }

        // Check if XHR was overwritten
        if (targetWindow.XMLHttpRequest.prototype.open !== currentXHROpen || 
            targetWindow.XMLHttpRequest.prototype.send !== currentXHRSend) {
            infoLog('⚠️ XHR patch overwritten, re-applying...', '#FF9800');
            
            const { openInterceptor, sendInterceptor } = createXHRInterceptors();
            Object.assign(targetWindow.XMLHttpRequest.prototype, {
                open: openInterceptor,
                send: sendInterceptor
            });
            
            // Update stored references
            currentXHROpen = openInterceptor;
            currentXHRSend = sendInterceptor;
            
            patchesOverwritten = true;
        }

        // Adjust check interval based on patch stability
        if (patchesOverwritten) {
            // Patches were overwritten, reset to minimum interval
            consecutiveStableChecks = 0;
            patchCheckInterval = MIN_CHECK_INTERVAL;
            debugLog(`[HeyMax SubCaps Viewer] Patch check interval reset to ${patchCheckInterval}ms`);
        } else {
            // Patches are stable
            consecutiveStableChecks++;
            
            // After enough stable checks, increase interval with exponential backoff
            if (consecutiveStableChecks >= STABLE_CHECKS_THRESHOLD) {
                const newInterval = Math.min(
                    Math.floor(patchCheckInterval * BACKOFF_MULTIPLIER),
                    MAX_CHECK_INTERVAL
                );
                
                if (newInterval !== patchCheckInterval) {
                    patchCheckInterval = newInterval;
                    infoLog(`Patches stable, increasing check interval to ${patchCheckInterval}ms`, '#2196F3');
                }
                
                consecutiveStableChecks -= STABLE_CHECKS_THRESHOLD; // Allow carry-over for faster progression to higher intervals
            }
        }

        // Schedule next check with current interval
        setTimeout(checkAndReapplyPatches, patchCheckInterval);
    }

    // Start patch monitoring with immediate initial check
    checkAndReapplyPatches();
    infoLog('🛡️ Patch protection initialized with exponential backoff', '#4CAF50');

    // ============================================================================
    // PART 5: UI COMPONENTS
    // ============================================================================

    // ============================================================================
    // PART 5.1: MCC AND BLACKLIST CONSTANTS (Module-level for reuse)
    // ============================================================================
    
    // MCC code Sets for O(1) lookup - created once and reused
    const MCC_PPV_SHOPPING = new Set([4816, 5262, 5306, 5309, 5310, 5311, 5331, 5399, 5611, 5621, 5631, 5641, 5651, 5661, 5691, 5699, 5732, 5733, 5734, 5735, 5912, 5942, 5944, 5945, 5946, 5947, 5948, 5949, 5964, 5965, 5966, 5967, 5968, 5969, 5970, 5992, 5999]);
    const MCC_PPV_DINING = new Set([5811, 5812, 5814, 5333, 5411, 5441, 5462, 5499, 8012, 9751]);
    const MCC_PPV_ENTERTAINMENT = new Set([7278, 7832, 7841, 7922, 7991, 7996, 7998, 7999]);
    const MCC_BLACKLIST = new Set([4829, 4900, 5199, 5960, 5965, 5993, 6012, 6050, 6051, 6211, 6300, 6513, 6529, 6530, 6534, 6540, 7349, 7511, 7523, 7995, 8062, 8211, 8220, 8241, 8244, 8249, 8299, 8398, 8661, 8651, 8699, 8999, 9211, 9222, 9223, 9311, 9402, 9405, 9399]);
    
    // Merchant name blacklist - created once and reused
    const BLACKLIST_MERCHANT_PREFIXES = [
        "AXS", "AMAZE", "AMAZE* TRANSIT", "BANC DE BINARY", "BANCDEBINARY.COM",
        "EZ LINK PTE LTD (FEVO)", "EZ Link transport", "EZ Link", "EZ-LINK (IMAGINE CARD)",
        "EZ-Link EZ-Reload (ATU)", "EZLINK", "EzLink", "EZ-LINK", "FlashPay ATU",
        "MB * MONEYBOOKERS.COM", "NETS VCASHCARD", "OANDA ASIA PAC", "OANDAASIAPA",
        "PAYPAL * BIZCONSULTA", "PAYPAL * CAPITALROYA", "PAYPAL * OANDAASIAPA",
        "Saxo Cap Mkts Pte Ltd", "SKR*SKRILL.COM", "SKR*xglobalmarkets.com", "SKYFX.COM",
        "TRANSIT", "WWW.IGMARKETS.COM.SG", "IPAYMY", "RWS-LEVY", "SMOOVE PAY",
        "SINGPOST-SAM", "RazerPay", "NORWDS"
    ];

    // Helper functions at module level (created once)
    const roundDownToNearestFive = (amount) => Math.floor(amount / 5) * 5;
    
    const getBlacklistReason = (transaction) => {
        const mccCode = parseInt(transaction.mcc_code, 10);
        if (MCC_BLACKLIST.has(mccCode)) {
            return `Blacklisted MCC ${mccCode}`;
        }
        
        if (transaction.merchant_name) {
            for (const prefix of BLACKLIST_MERCHANT_PREFIXES) {
                if (transaction.merchant_name.startsWith(prefix)) {
                    return `Blacklisted merchant prefix: ${prefix}`;
                }
            }
        }
        
        return null;
    };
    
    const isEligibleForPPVOnline = (mccCode) => {
        return MCC_PPV_SHOPPING.has(mccCode) || MCC_PPV_DINING.has(mccCode) || MCC_PPV_ENTERTAINMENT.has(mccCode);
    };

    // Extract card ID from URL
    function extractCardIdFromUrl() {
        const match = window.location.pathname.match(/\/cards\/your-cards\/([a-f0-9]+)/);
        return match ? match[1] : null;
    }

    // Calculate buckets from transaction data
    function calculateBuckets(apiResponse, cardShortName = 'UOB PPV', includeDetails = false) {
        const transactionDetails = includeDetails ? {
            included: {
                contactless: [],
                online: [],
                foreignCurrency: []
            },
            excluded: {
                blacklisted: [],
                notEligible: [],
                wrongPaymentMethod: []
            }
        } : null;

        if (cardShortName === 'UOB VS') {
            return calculateVSBuckets(apiResponse, getBlacklistReason, transactionDetails, includeDetails);
        } else {
            return calculatePPVBuckets(apiResponse, getBlacklistReason, roundDownToNearestFive, isEligibleForPPVOnline, transactionDetails, includeDetails);
        }
    }

    // Calculate UOB VS buckets
    function calculateVSBuckets(apiResponse, getBlacklistReason, transactionDetails, includeDetails) {
        let contactlessBucket = 0;
        let foreignCurrencyBucket = 0;

        apiResponse.forEach((transactionObj) => {
            const transaction = transactionObj.transaction;
            
            const blacklistReason = getBlacklistReason(transaction);
            if (blacklistReason) {
                if (includeDetails) {
                    transactionDetails.excluded.blacklisted.push({
                        merchant: transaction.merchant_name || 'Unknown',
                        amount: transaction.base_currency_amount,
                        reason: blacklistReason,
                        mcc: transaction.mcc_code,
                        date: transaction.transaction_date || transaction.date
                    });
                }
                return;
            }

            if (transaction.original_currency && transaction.original_currency !== 'SGD') {
                foreignCurrencyBucket += transaction.base_currency_amount;
                if (includeDetails) {
                    transactionDetails.included.foreignCurrency.push({
                        merchant: transaction.merchant_name || 'Unknown',
                        amount: transaction.base_currency_amount,
                        currency: transaction.original_currency,
                        date: transaction.transaction_date || transaction.date
                    });
                }
            } else if (transaction.payment_tag === 'contactless') {
                contactlessBucket += transaction.base_currency_amount;
                if (includeDetails) {
                    transactionDetails.included.contactless.push({
                        merchant: transaction.merchant_name || 'Unknown',
                        amount: transaction.base_currency_amount,
                        date: transaction.transaction_date || transaction.date
                    });
                }
            } else {
                if (includeDetails) {
                    transactionDetails.excluded.wrongPaymentMethod.push({
                        merchant: transaction.merchant_name || 'Unknown',
                        amount: transaction.base_currency_amount,
                        paymentMethod: transaction.payment_tag || 'unknown',
                        date: transaction.transaction_date || transaction.date
                    });
                }
            }
        });

        const result = { contactless: contactlessBucket, foreignCurrency: foreignCurrencyBucket };
        if (includeDetails) {
            result.details = transactionDetails;
        }
        return result;
    }

    // Calculate UOB PPV buckets
    function calculatePPVBuckets(apiResponse, getBlacklistReason, roundDownToNearestFive, isEligibleForPPVOnline, transactionDetails, includeDetails) {
        let contactlessBucket = 0;
        let onlineBucket = 0;

        apiResponse.forEach((transactionObj) => {
            const transaction = transactionObj.transaction;
            
            const blacklistReason = getBlacklistReason(transaction);
            if (blacklistReason) {
                if (includeDetails) {
                    transactionDetails.excluded.blacklisted.push({
                        merchant: transaction.merchant_name || 'Unknown',
                        amount: transaction.base_currency_amount,
                        reason: blacklistReason,
                        mcc: transaction.mcc_code,
                        date: transaction.transaction_date || transaction.date
                    });
                }
                return;
            }

            if (transaction.payment_tag === 'contactless') {
                const roundedAmount = roundDownToNearestFive(transaction.base_currency_amount);
                contactlessBucket += roundedAmount;
                if (includeDetails) {
                    transactionDetails.included.contactless.push({
                        merchant: transaction.merchant_name || 'Unknown',
                        amount: transaction.base_currency_amount,
                        roundedAmount: roundedAmount,
                        date: transaction.transaction_date || transaction.date
                    });
                }
            } else if (transaction.payment_tag === 'online') {
                const mccCode = parseInt(transaction.mcc_code, 10);
                if (isEligibleForPPVOnline(mccCode)) {
                    const roundedAmount = roundDownToNearestFive(transaction.base_currency_amount);
                    onlineBucket += roundedAmount;
                    if (includeDetails) {
                        transactionDetails.included.online.push({
                            merchant: transaction.merchant_name || 'Unknown',
                            amount: transaction.base_currency_amount,
                            roundedAmount: roundedAmount,
                            mcc: mccCode,
                            date: transaction.transaction_date || transaction.date
                        });
                    }
                } else {
                    if (includeDetails) {
                        transactionDetails.excluded.notEligible.push({
                            merchant: transaction.merchant_name || 'Unknown',
                            amount: transaction.base_currency_amount,
                            mcc: mccCode,
                            reason: 'MCC not in eligible categories',
                            date: transaction.transaction_date || transaction.date
                        });
                    }
                }
            } else {
                if (includeDetails) {
                    transactionDetails.excluded.wrongPaymentMethod.push({
                        merchant: transaction.merchant_name || 'Unknown',
                        amount: transaction.base_currency_amount,
                        paymentMethod: transaction.payment_tag || 'unknown',
                        date: transaction.transaction_date || transaction.date
                    });
                }
            }
        });

        const result = { contactless: contactlessBucket, online: onlineBucket };
        if (includeDetails) {
            result.details = transactionDetails;
        }
        return result;
    }

    // Check if button should be visible
    function shouldShowButton(cardId) {
        const cardDataStr = GM_getValue('cardData', '{}');
        const cardData = JSON.parse(cardDataStr);

        debugLog('[HeyMax SubCaps Viewer] Checking visibility - cardData:', cardData);
        debugLog('[HeyMax SubCaps Viewer] Checking visibility - cardId:', cardId);

        if (!cardData || !cardId) {
            debugLog('[HeyMax SubCaps Viewer] No cardData or cardId, hiding button');
            return false;
        }

        const cardInfo = cardData[cardId];
        debugLog('[HeyMax SubCaps Viewer] Card info exists:', !!cardInfo);

        if (!cardInfo || !cardInfo.card_tracker) {
            debugLog('[HeyMax SubCaps Viewer] No card info or card_tracker, hiding button');
            return false;
        }

        const cardTrackerData = cardInfo.card_tracker.data;
        debugLog('[HeyMax SubCaps Viewer] Card tracker data exists:', !!cardTrackerData);

        if (!cardTrackerData || !cardTrackerData.card) {
            debugLog('[HeyMax SubCaps Viewer] No card tracker data or card object, hiding button');
            return false;
        }

        const shortName = cardTrackerData.card.short_name;
        debugLog('[HeyMax SubCaps Viewer] Card short_name:', shortName);
        const isSupportedCard = shortName === 'UOB PPV' || shortName === 'UOB VS';
        debugLog('[HeyMax SubCaps Viewer] Is supported card:', isSupportedCard);
        return isSupportedCard;
    }

    // Create button styles object
    const BUTTON_STYLES = {
        base: `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transition: all 0.3s ease;
            display: none;
        `,
        hover: {
            backgroundColor: '#45a049',
            transform: 'scale(1.05)'
        },
        normal: {
            backgroundColor: '#4CAF50',
            transform: 'scale(1)'
        }
    };

    // Create the SubCaps button
    function createButton() {
        const button = document.createElement('button');
        button.id = 'heymax-subcaps-button';
        button.textContent = 'Subcaps';
        button.style.cssText = BUTTON_STYLES.base;

        button.addEventListener('mouseenter', () => {
            Object.assign(button.style, BUTTON_STYLES.hover);
        });

        button.addEventListener('mouseleave', () => {
            Object.assign(button.style, BUTTON_STYLES.normal);
        });

        button.addEventListener('click', showOverlay);

        return button;
    }

    // Create the overlay
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'heymax-subcaps-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background-color: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 32px;
            font-weight: bold;
            cursor: pointer;
            color: #666;
            line-height: 1;
            padding: 0;
            width: 32px;
            height: 32px;
            transition: color 0.3s ease;
        `;

        closeButton.addEventListener('mouseenter', function() {
            closeButton.style.color = '#000';
        });

        closeButton.addEventListener('mouseleave', function() {
            closeButton.style.color = '#666';
        });

        closeButton.addEventListener('click', function() {
            hideOverlay();
        });

        const title = document.createElement('h2');
        title.id = 'heymax-subcaps-title';
        title.textContent = 'Subcaps Analysis';
        title.style.cssText = `
            margin-top: 0;
            margin-bottom: 20px;
            color: #333;
            font-size: 24px;
        `;

        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'heymax-subcaps-results';

        content.appendChild(closeButton);
        content.appendChild(title);
        content.appendChild(resultsDiv);
        overlay.appendChild(content);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                hideOverlay();
            }
        });

        return overlay;
    }

    // Show overlay with calculated data
    function showOverlay() {
        const overlay = document.getElementById('heymax-subcaps-overlay');
        const resultsDiv = document.getElementById('heymax-subcaps-results');
        const titleElement = document.getElementById('heymax-subcaps-title');

        if (!overlay || !resultsDiv) {
            errorLog('Overlay elements not found');
            return;
        }

        resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">Loading data...</p>';
        overlay.style.display = 'flex';

        const cardId = extractCardIdFromUrl();
        const cardDataStr = GM_getValue('cardData', '{}');
        const cardData = JSON.parse(cardDataStr);

        debugLog('[HeyMax SubCaps Viewer] showOverlay - cardData:', cardData);
        debugLog('[HeyMax SubCaps Viewer] showOverlay - cardId:', cardId);

        if (!cardData || !cardId || !cardData[cardId]) {
            resultsDiv.innerHTML = '<p style="color: #f44336;">Error: No card data found</p>';
            return;
        }

        const transactionsData = cardData[cardId].transactions;
        if (!transactionsData || !transactionsData.data) {
            resultsDiv.innerHTML = '<p style="color: #f44336;">Error: No transaction data available</p>';
            return;
        }

        const cardTrackerData = cardData[cardId].card_tracker;
        const cardShortName = cardTrackerData && cardTrackerData.data && cardTrackerData.data.card
            ? cardTrackerData.data.card.short_name
            : 'UOB PPV';

        if (titleElement) {
            titleElement.textContent = `${cardShortName} Subcaps Analysis`;
        }

        try {
            const transactions = transactionsData.data;
            const results = calculateBuckets(transactions, cardShortName, true); // Request details

            displayResults(results, transactions.length, cardShortName);
        } catch (error) {
            errorLog('Error calculating data:', error);
            resultsDiv.innerHTML = '<p style="color: #f44336;">Error calculating data: ' + error.message + '</p>';
        }
    }

    // Hide overlay
    function hideOverlay() {
        const overlay = document.getElementById('heymax-subcaps-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Helper function to determine color based on value and card type
    function getBucketColor(value, cardType) {
        if (cardType === 'UOB VS') {
            if (value < 1000) return '#FFC107'; // Yellow
            if (value <= 1200) return '#4CAF50'; // Green
            return '#f44336'; // Red
        }
        // UOB PPV
        return value < 600 ? '#4CAF50' : '#f44336';
    }

    // Helper function to get bucket limit
    function getBucketLimit(cardType) {
        return cardType === 'UOB VS' ? 1200 : 600;
    }

    // Display calculation results
    function displayResults(results, transactionCount, cardShortName = 'UOB PPV') {
        const resultsDiv = document.getElementById('heymax-subcaps-results');
        if (!resultsDiv) return;

        const contactlessColor = getBucketColor(results.contactless, cardShortName);
        const contactlessLimit = getBucketLimit(cardShortName);

        let html = `
            <div style="margin-bottom: 20px;">
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                    Analyzed ${transactionCount} transaction${transactionCount !== 1 ? 's' : ''}
                </p>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="margin-top: 0; color: #333; font-size: 18px;">Contactless Bucket</h3>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">
                    <span style="color: ${contactlessColor};">$${results.contactless.toFixed(2)}</span>
                    <span style="color: #333;"> / $${contactlessLimit}</span>
                </p>
                <div style="width: 100%; height: 12px; background-color: #e0e0e0; border-radius: 6px; overflow: hidden; margin: 15px 0;">
                    <div style="
                        width: ${Math.min((results.contactless / parseFloat(contactlessLimit)) * 100, 100)}%;
                        height: 100%;
                        background-color: ${contactlessColor};
                        transition: width 0.3s ease;
                    "></div>
                </div>
                <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                    Total from contactless payments${cardShortName === 'UOB PPV' ? ' (rounded down to nearest $5)' : ''}
                </p>
                ${cardShortName === 'UOB VS' && results.contactless < 1000 ? `
                <p style="color: #F57C00; font-size: 14px; margin-top: 10px; margin-bottom: 0; font-weight: 500;">
                    To start earning bonus miles, you must spend at least $1,000 in this category.
                </p>
                ` : ''}
            </div>
        `;

        if (cardShortName === 'UOB VS') {
            const foreignCurrencyColor = getBucketColor(results.foreignCurrency, cardShortName);
            html += `
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #333; font-size: 18px;">Foreign Currency Bucket</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">
                        <span style="color: ${foreignCurrencyColor};">$${results.foreignCurrency.toFixed(2)}</span>
                        <span style="color: #333;"> / $1200</span>
                    </p>
                    <div style="width: 100%; height: 12px; background-color: #e0e0e0; border-radius: 6px; overflow: hidden; margin: 15px 0;">
                        <div style="
                            width: ${Math.min((results.foreignCurrency / 1200) * 100, 100)}%;
                            height: 100%;
                            background-color: ${foreignCurrencyColor};
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                        Total from non-SGD transactions
                    </p>
                    ${results.foreignCurrency < 1000 ? `
                    <p style="color: #F57C00; font-size: 14px; margin-top: 10px; margin-bottom: 0; font-weight: 500;">
                        To start earning bonus miles, you must spend at least $1,000 in this category.
                    </p>
                    ` : ''}
                </div>
            `;
        } else {
            const onlineColor = getBucketColor(results.online, cardShortName);
            html += `
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <h3 style="margin-top: 0; color: #333; font-size: 18px;">Online Bucket</h3>
                    <p style="font-size: 32px; font-weight: bold; margin: 10px 0;">
                        <span style="color: ${onlineColor};">$${results.online.toFixed(2)}</span>
                        <span style="color: #333;"> / $600</span>
                    </p>
                    <div style="width: 100%; height: 12px; background-color: #e0e0e0; border-radius: 6px; overflow: hidden; margin: 15px 0;">
                        <div style="
                            width: ${Math.min((results.online / 600) * 100, 100)}%;
                            height: 100%;
                            background-color: ${onlineColor};
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                        Total from eligible online transactions (rounded down to nearest $5)
                    </p>
                </div>
            `;
        }

        // Add transaction details section if available
        if (results.details) {
            html += `
                <div style="margin-top: 20px; border-top: 2px solid #e0e0e0; padding-top: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="margin: 0; color: #333; font-size: 16px;">Transaction Details</h3>
                        <button id="toggle-details-btn" style="
                            padding: 6px 16px;
                            background-color: #2196F3;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            font-size: 13px;
                            cursor: pointer;
                        ">Show Details</button>
                    </div>
                    <div id="transaction-details-content" style="display: none; margin-top: 15px;">
                        ${generateTransactionDetailsHTML(results.details, cardShortName)}
                    </div>
                </div>
            `;
        }

        html += `
            <div style="margin-top: 20px; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #1976D2;">
                    <strong>Note:</strong> These calculations are based on the transaction data that has been loaded so far.
                </p>
            </div>
        `;

        resultsDiv.innerHTML = html;
        
        // Add event listener for toggle details button
        const toggleBtn = document.getElementById('toggle-details-btn');
        const detailsContent = document.getElementById('transaction-details-content');
        if (toggleBtn && detailsContent) {
            toggleBtn.addEventListener('click', function() {
                if (detailsContent.style.display === 'none') {
                    detailsContent.style.display = 'block';
                    toggleBtn.textContent = 'Hide Details';
                    toggleBtn.style.backgroundColor = '#F57C00';
                } else {
                    detailsContent.style.display = 'none';
                    toggleBtn.textContent = 'Show Details';
                    toggleBtn.style.backgroundColor = '#2196F3';
                }
            });
        }
    }

    // Generate HTML for transaction details
    function generateTransactionDetailsHTML(details, cardShortName) {
        // Helper function to generate table header cell
        const headerCell = (text, align = 'left') => 
            `<th style="padding: 8px; text-align: ${align}; border-bottom: 1px solid #ddd;">${text}</th>`;
        
        // Helper function to generate table data cell
        const dataCell = (text, align = 'left', fontSize = null) => {
            const fontSizeStyle = fontSize ? `font-size: ${fontSize}; ` : '';
            return `<td style="padding: 6px 8px; text-align: ${align}; ${fontSizeStyle}border-bottom: 1px solid #eee;">${text}</td>`;
        };
        
        // Helper function to format currency
        const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
        
        // Helper function to check if rounded column should be shown
        const showRoundedColumn = cardShortName === 'UOB PPV';
        
        // Helper function to generate included transaction row
        const generateIncludedRow = (txn) => {
            let row = `<tr>`;
            row += dataCell(txn.merchant);
            row += dataCell(formatCurrency(txn.amount), 'right');
            if (showRoundedColumn && txn.roundedAmount !== undefined) {
                row += dataCell(formatCurrency(txn.roundedAmount), 'right');
            }
            row += `</tr>`;
            return row;
        };
        
        // Helper function to generate table wrapper
        const tableWrapper = (headers, rows) => `
            <div style="max-height: 200px; overflow-y: auto; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            ${headers}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
        
        let html = '';
        
        // Included transactions
        const includedSections = cardShortName === 'UOB VS' 
            ? [
                { key: 'contactless', title: 'Contactless Transactions', count: details.included.contactless.length },
                { key: 'foreignCurrency', title: 'Foreign Currency Transactions', count: details.included.foreignCurrency.length }
              ]
            : [
                { key: 'contactless', title: 'Contactless Transactions', count: details.included.contactless.length },
                { key: 'online', title: 'Online Transactions', count: details.included.online.length }
              ];
        
        html += '<h4 style="color: #4CAF50; margin-top: 0;">Included Transactions</h4>';
        
        includedSections.forEach(section => {
            if (section.count > 0) {
                // Build headers
                let headers = headerCell('Merchant') + headerCell('Amount', 'right');
                if (showRoundedColumn) {
                    headers += headerCell('Rounded', 'right');
                }
                
                // Build rows
                const rows = details.included[section.key].map(generateIncludedRow).join('');
                
                html += `
                    <div style="margin-bottom: 15px;">
                        <strong>${section.title} (${section.count})</strong>
                        ${tableWrapper(headers, rows)}
                    </div>
                `;
            }
        });
        
        // Excluded transactions
        const excludedCount = details.excluded.blacklisted.length + 
                             details.excluded.notEligible.length + 
                             details.excluded.wrongPaymentMethod.length;
        
        if (excludedCount > 0) {
            html += '<h4 style="color: #f44336; margin-top: 20px;">Excluded Transactions</h4>';
            
            // Blacklisted transactions
            if (details.excluded.blacklisted.length > 0) {
                const headers = headerCell('Merchant') + headerCell('Amount', 'right') + headerCell('Reason');
                const rows = details.excluded.blacklisted.map(txn => {
                    return `<tr>` +
                        dataCell(txn.merchant) +
                        dataCell(formatCurrency(txn.amount), 'right') +
                        dataCell(txn.reason, 'left', '11px') +
                        `</tr>`;
                }).join('');
                
                html += `
                    <div style="margin-bottom: 15px;">
                        <strong>Blacklisted (${details.excluded.blacklisted.length})</strong>
                        ${tableWrapper(headers, rows)}
                    </div>
                `;
            }
            
            // Not eligible MCC transactions
            if (details.excluded.notEligible.length > 0) {
                const headers = headerCell('Merchant') + headerCell('Amount', 'right') + headerCell('MCC', 'center');
                const rows = details.excluded.notEligible.map(txn => {
                    return `<tr>` +
                        dataCell(txn.merchant) +
                        dataCell(formatCurrency(txn.amount), 'right') +
                        dataCell(txn.mcc, 'center', '11px') +
                        `</tr>`;
                }).join('');
                
                html += `
                    <div style="margin-bottom: 15px;">
                        <strong>Not Eligible MCC (${details.excluded.notEligible.length})</strong>
                        ${tableWrapper(headers, rows)}
                    </div>
                `;
            }
            
            // Wrong payment method transactions
            if (details.excluded.wrongPaymentMethod.length > 0) {
                const headers = headerCell('Merchant') + headerCell('Amount', 'right') + headerCell('Method', 'center');
                const rows = details.excluded.wrongPaymentMethod.map(txn => {
                    return `<tr>` +
                        dataCell(txn.merchant) +
                        dataCell(formatCurrency(txn.amount), 'right') +
                        dataCell(txn.paymentMethod, 'center', '11px') +
                        `</tr>`;
                }).join('');
                
                html += `
                    <div style="margin-bottom: 15px;">
                        <strong>Wrong Payment Method (${details.excluded.wrongPaymentMethod.length})</strong>
                        ${tableWrapper(headers, rows)}
                    </div>
                `;
            }
        }
        
        return html;
    }

    // Update button visibility
    function updateButtonVisibility() {
        const button = document.getElementById('heymax-subcaps-button');
        if (!button) return;

        const cardId = extractCardIdFromUrl();
        debugLog('[HeyMax SubCaps Viewer] Extracted card ID:', cardId);

        if (cardId) {
            const shouldShow = shouldShowButton(cardId);
            debugLog(`[HeyMax SubCaps Viewer] Button visibility for card ${cardId}: ${shouldShow}`);
            button.style.display = shouldShow ? 'block' : 'none';
        } else {
            button.style.display = 'none';
            debugLog('[HeyMax SubCaps Viewer] No card ID in URL, button hidden');
        }
    }

    // Initialize UI
    function initializeUI() {
        if (!document.body) {
            debugLog('[HeyMax SubCaps Viewer] document.body not ready, waiting...');
            setTimeout(initializeUI, 100);
            return;
        }

        infoLog('Initializing UI components...');

        const button = createButton();
        document.body.appendChild(button);
        debugLog('[HeyMax SubCaps Viewer] Button element created and appended');

        const overlay = createOverlay();
        document.body.appendChild(overlay);
        debugLog('[HeyMax SubCaps Viewer] Overlay element created and appended');

        updateButtonVisibility();

        let lastUrl = window.location.href;
        let debounceTimer = null;
        const observer = new MutationObserver(function(mutations) {
            const hasSignificantChange = mutations.some(mutation =>
                mutation.type === 'childList' && mutation.addedNodes.length > 0
            );

            if (!hasSignificantChange) {
                return;
            }

            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            debounceTimer = setTimeout(function() {
                if (window.location.href !== lastUrl) {
                    lastUrl = window.location.href;
                    updateButtonVisibility();
                }
            }, 250);
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Listen for storage changes instead of polling
        window.addEventListener('storage', updateButtonVisibility);
        
        // Check visibility on page visibility changes (more efficient than polling)
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                updateButtonVisibility();
            }
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        initializeUI();
    }

    console.log('[HeyMax SubCaps Viewer] Tampermonkey script initialized');
})();