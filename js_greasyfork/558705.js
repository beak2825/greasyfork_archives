// ==UserScript==
// @name         Torn Disposal Enhanced - Unified Scale
// @version      7.0.0
// @namespace    enanchedDisposal
// @description  Statistical disposal classification with customizable slot-based mode selection
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author       stel
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=crimes*
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/558705/Torn%20Disposal%20Enhanced%20-%20Unified%20Scale.user.js
// @updateURL https://update.greasyfork.org/scripts/558705/Torn%20Disposal%20Enhanced%20-%20Unified%20Scale.meta.js
// ==/UserScript==

/*
 * MIT License
 * 
 * Copyright (c) 2025 stel [2672610]
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    /**
     * Torn Disposal Enhanced - Unified Scale
     * 
     * Architecture:
     *   1. Config     - Immutable configuration constants
     *   2. Utils      - Pure utility functions (logging, debounce, error handling)
     *   3. Data       - Static game data (items, jobs, success rates)
     *   4. Stats      - Mathematical functions (Wilson score, percentiles)
     *   5. API        - Torn API communication layer
     *   6. Cache      - Price cache with versioning
     *   7. Ranking    - UnifiedScale and PercentileCache
     *   8. DOM        - DOM utilities and selectors
     *   9. UI         - User interface components
     *  10. Calculator - Profitability calculations
     *  11. Controller - Main orchestration
     *  12. Debug      - Development tools
     */

    // Namespace for all module exports
    const Disposal = {};

    // --- Module: Config START ---
    /**
     * Immutable configuration constants.
     * All runtime parameters are centralized here for maintainability.
     * This module has no dependencies on other modules.
     */
    const Config = Object.freeze({
        debug: true,
        
        colors: Object.freeze({
            dangerous: '#C62828',
            risky:     '#E85C3A',
            unsafe:    '#F2C746',
            moderate:  '#8CCF5E',
            safe:      '#1A9850'
        }),
        
        borderWidth: Object.freeze({
            best: '4px',
            worst: '4px',
            negative: '4px',
            default: '2px'
        }),
        
        percentiles: Object.freeze({
            safe: 0.80,
            moderate: 0.60,
            unsafe: 0.40,
            risky: 0.20
        }),
        
        observer: Object.freeze({
            debounceDelay: 200,
            throttleDelay: 100
        }),
        
        api: Object.freeze({
            rateLimit: 650,
            cacheTime: 3600,
            timeout: 30000,
            retryAttempts: 2,
            retryDelayMs: 500
        }),
        
        cache: Object.freeze({
            version: 1,
            maxAgeMs: 3600000,
            storageKey: 'disposal_price_cache',
            timeKey: 'disposal_cache_time'
        }),
        
        storage: Object.freeze({
            apiKey: 'disposal_api_key',
            mode: 'disposalMode',
            slots: 'disposalSlots'
        }),
        
        modeColors: Object.freeze({
            'conservative': '#0066cc',
            'optimistic': '#28a745',
            'profitability': '#ffd700',
            'expected': '#9b59b6'
        }),
        
        caretOffsets: Object.freeze({
            'conservative': 1,
            'optimistic': 2,
            'profitability': 2,
            'expected': 1.5
        })
    });
    
    Disposal.Config = Config;
    // --- Module: Config END ---

    // --- Module: Utils START ---
    /**
     * Pure utility functions with no side effects.
     * Provides logging, timing utilities, and error handling.
     */
    const Utils = (() => {
        /**
         * Logs messages to console when debug mode is enabled.
         * @param {...any} args - Arguments to log
         */
        const log = (...args) => {
            if (Config.debug) {
                console.log('[Disposal]', ...args);
            }
        };

        /**
         * Logs warnings regardless of debug mode.
         * @param {...any} args - Arguments to log
         */
        const warn = (...args) => {
            console.warn('[Disposal]', ...args);
        };

        /**
         * Logs errors regardless of debug mode.
         * @param {...any} args - Arguments to log
         */
        const error = (...args) => {
            console.error('[Disposal]', ...args);
        };

        /**
         * Returns a promise that resolves after specified milliseconds.
         * @param {number} ms - Milliseconds to wait
         * @returns {Promise<void>}
         */
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        /**
         * Creates a debounced version of a function.
         * The debounced function delays invoking func until after wait milliseconds
         * have elapsed since the last time the debounced function was invoked.
         * 
         * @param {Function} func - Function to debounce
         * @param {number} delay - Delay in milliseconds
         * @returns {Function} Debounced function
         */
        const debounce = (func, delay) => {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        };

        /**
         * Creates a throttled version of a function.
         * The throttled function only invokes func at most once per every wait milliseconds.
         * 
         * @param {Function} func - Function to throttle
         * @param {number} limit - Minimum time between invocations in milliseconds
         * @returns {Function} Throttled function
         */
        const throttle = (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        /**
         * Centralized error handler for consistent error processing.
         * Logs structured error information without interrupting execution flow.
         * 
         * @param {Error} err - The error object
         * @param {Object} context - Error context
         * @param {string} context.module - Module where error occurred
         * @param {string} context.operation - Operation that failed
         */
        const handleError = (err, { module, operation }) => {
            error(`[${module}] ${operation} failed:`, err.message);
            if (Config.debug && err.stack) {
                console.debug(err.stack);
            }
        };

        /**
         * Returns current Unix timestamp in seconds.
         * @returns {number}
         */
        const nowSec = () => Math.floor(Date.now() / 1000);

        return Object.freeze({
            log,
            warn,
            error,
            sleep,
            debounce,
            throttle,
            handleError,
            nowSec
        });
    })();
    
    Disposal.Utils = Utils;
    // --- Module: Utils END ---

    // Expose log at module scope for backward compatibility
    const log = Utils.log;
    const debounce = Utils.debounce;

    // ==================== CSS STYLES ====================

    // ==================== CUSTOM TOOLTIP STYLES ====================
    GM_addStyle(`
        .disposal-mode-toggle {
            position: relative;
        -webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
    user-select: none !important;
        }
        
        .disposal-mode-toggle::before {
            content: attr(data-tooltip);
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(8px);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
            z-index: 10000;
            font-weight: normal;
        }
        
        .disposal-mode-toggle::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(2px);
            border: 5px solid transparent;
            border-bottom-color: rgba(0, 0, 0, 0.9);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease, transform 0.2s ease;
            z-index: 10000;
        }
        
        .disposal-mode-toggle:hover::before,
        .disposal-mode-toggle:hover::after {
            opacity: 1;
            transform: translateX(-50%) translateY(4px);
        }
        
        .disposal-mode-toggle:hover::after {
            transform: translateX(-50%) translateY(-1px);
        }

        .disposal-slot-dropdown {
            position: fixed;
            background: rgba(20, 20, 20, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            padding: 8px 0;
            min-width: 180px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .disposal-slot-dropdown-category {
            color: rgba(255, 255, 255, 0.5);
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 8px 12px 4px 12px;
            letter-spacing: 0.5px;
        }

        .disposal-slot-dropdown,
.disposal-slot-dropdown-item {
    -webkit-touch-callout: none !important;
    -webkit-user-select: none !important;
    user-select: none !important;
}


        .disposal-slot-dropdown-item {
            padding: 8px 12px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.15s;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }

        .disposal-slot-dropdown-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .disposal-slot-dropdown-item.active {
            background: rgba(255, 255, 255, 0.05);
            font-weight: bold;
        }

        .disposal-slot-dropdown-item.active::before {
            content: '✓';
            font-size: 10px;
            color: #4CAF50;
        }

        .disposal-slot-dropdown-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 4px 0;
        }

        .disposal-settings-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(30, 30, 30, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 16px;
            width: 340px;
            max-width: 90vw;
            z-index: 10002;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .disposal-settings-popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            flex-shrink: 0;
        }

        .disposal-settings-popup-title {
            font-size: 15px;
            font-weight: bold;
            color: white;
            margin: 0;
        }

        .disposal-settings-tabs {
            display: inline-flex;
            background: rgba(255,255,255,0.06);
            border-radius: 4px;
            overflow: hidden;
        }

        .disposal-settings-tab {
            padding: 5px 12px;
            background: transparent;
            border: none;
            color: rgba(255,255,255,0.6);
            font-size: 11px;
            cursor: pointer;
            transition: background 0.15s, color 0.15s;
        }

        .disposal-settings-tab:first-child {
            border-right: 1px solid rgba(255,255,255,0.1);
        }

        .disposal-settings-tab:hover {
            color: rgba(255,255,255,0.85);
        }

        .disposal-settings-tab.active {
            background: rgba(149,255,149,0.12);
            color: white;
            box-shadow: inset 0 0 3px rgba(149,255,149,0.35);
        }

        .disposal-settings-views-container {
            position: relative;
            flex: 1;
            overflow: hidden;
        }

        .disposal-settings-view {
            position: absolute;
            inset: 0;
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.15s ease;
            -webkit-overflow-scrolling: touch;
        }

        .disposal-settings-view.active {
            opacity: 1;
            visibility: visible;
        }

        .disposal-settings-footer {
            flex-shrink: 0;
            padding-top: 12px;
        }

        .disposal-legend-section {
            margin-bottom: 16px;
        }

        .disposal-legend-title {
            font-size: 12px;
            font-weight: bold;
            color: white;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .disposal-legend-description {
            font-size: 10px;
            color: rgba(255,255,255,0.6);
            margin-bottom: 10px;
            line-height: 1.4;
        }

        .disposal-legend-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
            font-size: 11px;
        }

        .disposal-legend-item svg {
            flex-shrink: 0;
        }

        .disposal-legend-label {
            color: white;
            font-weight: 500;
        }

        .disposal-legend-meaning {
            color: rgba(255,255,255,0.65);
            font-size: 10px;
        }

        .disposal-legend-divider {
            height: 1px;
            background: rgba(255,255,255,0.1);
            margin: 12px 0;
        }

        .disposal-legend-summary {
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
            padding: 10px;
            font-size: 10px;
            color: rgba(255,255,255,0.75);
            line-height: 1.5;
        }

        .disposal-legend-summary strong {
            color: white;
        }

        .disposal-settings-popup-section {
            margin-bottom: 12px;
        }

        .disposal-settings-popup-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 6px;
        }

        .disposal-settings-popup-value {
            font-size: 13px;
            color: white;
            background: rgba(0, 0, 0, 0.3);
            padding: 6px 10px;
            border-radius: 4px;
            margin-bottom: 6px;
            font-family: monospace;
        }

        .disposal-settings-popup-buttons {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }

        .disposal-settings-popup-button {
            padding: 7px 14px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.15s;
        }

        .disposal-settings-popup-button:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .disposal-settings-popup-button.primary {
            background: #0066cc;
            border-color: #0066cc;
        }

        .disposal-settings-popup-button.primary:hover {
            background: #0052a3;
        }

        .disposal-settings-popup-help {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 8px;
            line-height: 1.4;
        }

        .disposal-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10001;
        }

        .worst-negative-ring {
            position: relative;
            border-radius: 50% !important;
        }

        .worst-negative-ring::before,
        .worst-negative-ring::after {
            content: "" !important;
            position: absolute !important;
            border-radius: 50% !important;
            border: 1px dashed var(--accent) !important;
            pointer-events: none !important;
            z-index: 10 !important;
        }

        .worst-negative-ring::before {
            inset: 0 !important;
        }

        .worst-negative-ring::after {
            inset: -4px !important;
        }

        .negative-ring {
            position: relative;
            border-radius: 50% !important;
        }

        .negative-ring::after {
            content: "" !important;
            position: absolute !important;
            inset: -4px !important;
            border-radius: 50% !important;
            border: 1px dashed var(--accent) !important;
            pointer-events: none !important;
            z-index: 10 !important;
        }
    `);

    // Legacy alias for backward compatibility
    const CONFIG = Config;

    // ==================== TORN API MANAGER ====================
    // --- Module: API START ---
    /**
     * API module handles all external network requests and caching.
     * 
     * Components:
     *   - TornAPI: HTTP requests with rate limiting, retry, and coalescing
     *   - CacheManager: Persistent storage with versioning and validation
     * 
     * Design principles:
     *   - All network errors are recoverable via retry
     *   - Exponential backoff with jitter prevents thundering herd
     *   - Cache validation prevents corrupted data propagation
     */

    // ==================== TORN API ====================
    /**
     * Handles all Torn API communications with built-in protections:
     *   - Request queue with rate limiting (650ms between requests)
     *   - Automatic retry with exponential backoff and jitter
     *   - Request coalescing (multiple calls to same endpoint share single request)
     */
    const TornAPI = (() => {
        // Request queue state
        let queue = [];
        let processing = false;
        let lastRequest = 0;
        
        // Coalescing state: maps endpoint → { promise, resolvers, rejecters }
        const pendingRequests = new Map();
        
        // API key management
        let apiKey = GM_getValue(Config.storage.apiKey, '');

        /**
         * Sets the API key and persists to storage.
         * @param {string} key - Torn API key
         */
        const setKey = (key) => {
            apiKey = (key || '').trim();
            GM_setValue(Config.storage.apiKey, apiKey);
        };

        /**
         * Gets the current API key.
         * @returns {string} Current API key or empty string
         */
        const getKey = () => apiKey;

        /**
         * Calculates retry delay with exponential backoff and jitter.
         * Jitter prevents thundering herd when multiple requests retry simultaneously.
         * 
         * @param {number} attempt - Current attempt number (1-based)
         * @returns {number} Delay in milliseconds
         */
        const getRetryDelay = (attempt) => {
            const baseDelay = Config.api.retryDelayMs;
            const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
            const jitter = Math.random() * baseDelay * 0.5; // 0-50% jitter
            return Math.min(exponentialDelay + jitter, 10000); // Cap at 10s
        };

        /**
         * Determines if an error is potentially recoverable via retry.
         * 
         * @param {Error} error - The error to evaluate
         * @returns {boolean} True if retry may succeed
         */
        const isRecoverableError = (error) => {
            const message = error.message.toLowerCase();
            
            // Non-recoverable: auth/config errors
            if (message.includes('api key') || 
                message.includes('api error') ||
                message.includes('invalid api') ||
                message.includes('incorrect id')) {
                return false;
            }
            
            // Recoverable: transient errors
            if (message.includes('network') || 
                message.includes('timeout') ||
                message.includes('invalid json')) {
                return true;
            }
            
            return false;
        };

        /**
         * Executes a single HTTP request to the Torn API.
         * 
         * @param {string} url - Full API URL
         * @returns {Promise<Object>} Parsed JSON response
         * @throws {Error} On network, timeout, or API errors
         */
        const executeRequest = (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: Config.api.timeout,
                    onload: (response) => {
                        let data;
                        try {
                            data = JSON.parse(response.responseText);
                        } catch (e) {
                            reject(new Error('Invalid JSON response'));
                            return;
                        }

                        if (data.error) {
                            reject(new Error(`API Error: ${data.error.error}`));
                            return;
                        }

                        resolve(data);
                    },
                    onerror: () => reject(new Error('Network error')),
                    ontimeout: () => reject(new Error('API timeout'))
                });
            });
        };

        /**
         * Queues an API call for execution with rate limiting and coalescing.
         * 
         * COALESCING: If the same endpoint is called multiple times while a request
         * is in progress, all callers receive the same result from a single HTTP request.
         * This prevents duplicate API calls and respects rate limits.
         * 
         * @param {string} endpoint - API endpoint (e.g., "torn/172?selections=items")
         * @returns {Promise<Object>} API response data
         * @throws {Error} If no API key configured or request fails
         */
        const call = (endpoint) => {
            if (!apiKey) {
                return Promise.reject(new Error('No API key configured'));
            }

            // Coalescing: if same endpoint is already pending, join that request
            if (pendingRequests.has(endpoint)) {
                const pending = pendingRequests.get(endpoint);
                return new Promise((resolve, reject) => {
                    pending.resolvers.push(resolve);
                    pending.rejecters.push(reject);
                });
            }

            // Create new pending request entry
            const pending = {
                resolvers: [],
                rejecters: []
            };
            pendingRequests.set(endpoint, pending);

            const url = `https://api.torn.com/${endpoint}&key=${apiKey}`;
            
            return new Promise((resolve, reject) => {
                // Add original caller to pending lists
                pending.resolvers.push(resolve);
                pending.rejecters.push(reject);
                
                // Queue the actual request
                queue.push({ 
                    url, 
                    endpoint,
                    // Fan-out: resolve/reject ALL pending callers
                    resolve: (data) => {
                        const p = pendingRequests.get(endpoint);
                        pendingRequests.delete(endpoint);
                        if (p) {
                            p.resolvers.forEach(r => r(data));
                        }
                    },
                    reject: (error) => {
                        const p = pendingRequests.get(endpoint);
                        pendingRequests.delete(endpoint);
                        if (p) {
                            p.rejecters.forEach(r => r(error));
                        }
                    }
                });
                
                if (!processing) processQueue();
            });
        };

        /**
         * Processes queued requests with rate limiting and retry logic.
         * Only one instance runs at a time (controlled by `processing` flag).
         * 
         * @private
         */
        async function processQueue() {
            processing = true;
            
            while (queue.length > 0) {
                const job = queue.shift();
                
                // Rate limiting
                const timeSinceLastRequest = Date.now() - lastRequest;
                const delay = Config.api.rateLimit - timeSinceLastRequest;
                
                if (delay > 0) {
                    await Utils.sleep(delay);
                }

                // Retry loop
                let lastError = null;
                for (let attempt = 1; attempt <= Config.api.retryAttempts; attempt++) {
                    try {
                        const data = await executeRequest(job.url);
                        lastRequest = Date.now();
                        job.resolve(data);
                        lastError = null;
                        break;
                        
                    } catch (error) {
                        lastError = error;
                        const isLastAttempt = attempt === Config.api.retryAttempts;
                        
                        if (isLastAttempt || !isRecoverableError(error)) {
                            log(`API request failed (attempt ${attempt}/${Config.api.retryAttempts}):`, error.message);
                            break;
                        }
                        
                        const retryDelay = getRetryDelay(attempt);
                        log(`API request failed (attempt ${attempt}/${Config.api.retryAttempts}), retrying in ${Math.round(retryDelay)}ms...`);
                        await Utils.sleep(retryDelay);
                    }
                }

                if (lastError) {
                    job.reject(lastError);
                }
            }
            
            processing = false;
        }

        /**
         * Fetches current market prices for all consumable items.
         * 
         * @returns {Promise<Object>} Map of itemId -> market_value
         * @throws {Error} On API failure or invalid response
         */
        const getItemPrices = async () => {
            log('Fetching fresh item prices from API...');
            
            const prices = {};
            const consumableIds = Object.keys(ITEMS.consumables);
            const itemIdsString = consumableIds.join(',');
            
            const data = await call(`torn/${itemIdsString}?selections=items`);
            
            if (!data || !data.items) {
                throw new Error('Invalid API response');
            }

            let validPriceCount = 0;
            for (const [itemId, itemName] of Object.entries(ITEMS.consumables)) {
                if (data.items[itemId] && data.items[itemId].market_value !== undefined) {
                    prices[itemId] = data.items[itemId].market_value;
                    if (prices[itemId] > 0) validPriceCount++;
                } else {
                    prices[itemId] = 0;
                }
            }

            if (validPriceCount === 0) {
                throw new Error('API returned no valid prices');
            }

            log(`Fetched prices for ${validPriceCount} items`);
            return prices;
        };

        return Object.freeze({
            call,
            setKey,
            getKey,
            getItemPrices,
            isRecoverableError // Exposed for testing
        });
    })();

    // ==================== CACHE MANAGER ====================
    /**
     * Manages persistent cache with versioning, validation, and integrity checks.
     * 
     * Features:
     *   - Version-based cache invalidation for safe migrations
     *   - Comprehensive validation prevents corrupted data propagation
     *   - Automatic cleanup of malformed entries
     */
    const CacheManager = (() => {
        /**
         * Migration functions for cache version upgrades.
         * Each migration transforms data from version N to N+1.
         * Add new migrations here when cache structure changes.
         * 
         * @private
         */
        const migrations = {
            // Example: migrate from version 1 to 2
            // 1: (cache) => {
            //     // Transform cache.prices structure
            //     return { ...cache, version: 2 };
            // }
        };

        /**
         * Attempts to migrate cache data to current version.
         * Applies sequential migrations from old version to current.
         * 
         * @private
         * @param {Object} cache - Cache object with version and data
         * @returns {Object|null} Migrated cache or null if migration failed
         */
        const migrateCache = (cache) => {
            let currentCache = cache;
            const targetVersion = Config.cache.version;

            while (currentCache.version < targetVersion) {
                const migrationFn = migrations[currentCache.version];
                
                if (!migrationFn) {
                    log(`No migration path from version ${currentCache.version} to ${targetVersion}`);
                    return null;
                }

                try {
                    currentCache = migrationFn(currentCache);
                    log(`Migrated cache from version ${currentCache.version - 1} to ${currentCache.version}`);
                } catch (e) {
                    log(`Migration failed from version ${currentCache.version}:`, e.message);
                    return null;
                }
            }

            return currentCache;
        };

        /**
         * Saves prices to cache with metadata.
         * 
         * @param {Object} prices - Item prices object (itemId -> price)
         */
        const save = (prices) => {
            const cache = {
                version: Config.cache.version,
                timestamp: Date.now(),
                prices: prices
            };
            GM_setValue(Config.cache.storageKey, JSON.stringify(cache));
            GM_setValue(Config.cache.timeKey, cache.timestamp);
            log('Price cache saved');
        };

        /**
         * Loads and validates cached prices.
         * Attempts migration if version mismatch detected.
         * Performs comprehensive validation to prevent corrupted data propagation.
         * 
         * @returns {Object|null} Cached prices or null if invalid/expired
         */
        const load = () => {
            try {
                const cached = GM_getValue(Config.cache.storageKey);
                if (!cached) return null;

                let cache = JSON.parse(cached);

                // Version check with migration attempt
                if (cache.version !== Config.cache.version) {
                    if (cache.version < Config.cache.version) {
                        // Attempt migration
                        cache = migrateCache(cache);
                        if (!cache) {
                            log('Cache migration failed, invalidating');
                            clear();
                            return null;
                        }
                        // Save migrated cache
                        save(cache.prices);
                    } else {
                        // Cache is from future version (downgrade scenario)
                        log('Cache version newer than expected, invalidating');
                        clear();
                        return null;
                    }
                }

                // Age validation
                const age = Date.now() - cache.timestamp;
                if (age > Config.cache.maxAgeMs) {
                    log('Cache expired');
                    return null;
                }

                // Structure validation
                if (!cache.prices || typeof cache.prices !== 'object') {
                    log('Cache structure invalid, clearing');
                    clear();
                    return null;
                }

                // Empty cache check
                if (Object.keys(cache.prices).length === 0) {
                    log('Cache empty, clearing');
                    clear();
                    return null;
                }

                // Value sanity check
                for (const [item, price] of Object.entries(cache.prices)) {
                    if (typeof price !== 'number' || price < 0 || price > 100000000) {
                        log(`Invalid price detected for ${item}: ${price}`);
                        clear();
                        return null;
                    }
                }

                log('Price cache loaded successfully');
                return cache.prices;

            } catch (e) {
                log('Cache load error:', e.message);
                clear();
                return null;
            }
        };

        /**
         * Clears all cache data.
         */
        const clear = () => {
            GM_setValue(Config.cache.storageKey, '');
            GM_setValue(Config.cache.timeKey, 0);
            log('Cache cleared');
        };

        /**
         * Checks if cache needs refresh.
         * 
         * @returns {boolean} True if cache is invalid or expired
         */
        const needsRefresh = () => {
            const cacheTime = GM_getValue(Config.cache.timeKey, 0);
            const age = Date.now() - cacheTime;
            return age > Config.cache.maxAgeMs;
        };

        /**
         * Gets cache metadata without loading full data.
         * Useful for debugging and status display.
         * 
         * @returns {Object|null} Cache metadata or null
         */
        const getMetadata = () => {
            try {
                const cached = GM_getValue(Config.cache.storageKey);
                if (!cached) return null;

                const cache = JSON.parse(cached);
                return {
                    version: cache.version,
                    timestamp: cache.timestamp,
                    age: Date.now() - cache.timestamp,
                    itemCount: cache.prices ? Object.keys(cache.prices).length : 0
                };
            } catch (e) {
                return null;
            }
        };

        return Object.freeze({
            save,
            load,
            clear,
            needsRefresh,
            getMetadata
        });
    })();

    /**
     * API module exports.
     */
    const API = Object.freeze({
        TornAPI,
        CacheManager
    });

    Disposal.API = API;
    // --- Module: API END ---

    // --- Module: Data START ---
    /**
     * Static game data for disposal items, jobs, and success rates.
     * All data is immutable to prevent accidental modifications.
     */
    
    // ==================== ITEMS DATABASE ====================
    const ITEMS = (() => {
        const itemsById = Object.freeze({
            172: Object.freeze({ name: 'Gasoline', type: 'consumable' }),
            1249: Object.freeze({ name: 'Hydrochloric Acid', type: 'consumable' }),
            1213: Object.freeze({ name: 'Lye', type: 'consumable' }),
            1212: Object.freeze({ name: 'Bleach', type: 'consumable' }),
            1270: Object.freeze({ name: 'Paper Towels', type: 'consumable' }),
            1143: Object.freeze({ name: 'Disposable Mask', type: 'consumable' }),
            394: Object.freeze({ name: 'Brick', type: 'consumable' }),
            1250: Object.freeze({ name: 'Anchor', type: 'consumable' }),
            1201: Object.freeze({ name: 'Rope', type: 'consumable' }),
            1255: Object.freeze({ name: 'Bone Saw', type: 'consumable' }),
            1234: Object.freeze({ name: 'Shovel', type: 'tool' }),
            1233: Object.freeze({ name: 'Wheelbarrow', type: 'tool' }),
            906: Object.freeze({ name: 'Handkerchief', type: 'tool' }),
            1340: Object.freeze({ name: 'Double Cut File', type: 'tool' })
        });
        
        const itemsByName = {};
        for (const [id, item] of Object.entries(itemsById)) {
            itemsByName[item.name] = parseInt(id);
        }
        Object.freeze(itemsByName);
        
        const consumables = {};
        const tools = {};
        for (const [id, item] of Object.entries(itemsById)) {
            const numId = parseInt(id);
            if (item.type === 'consumable') {
                consumables[numId] = item.name;
            } else {
                tools[numId] = item.name;
            }
        }
        Object.freeze(consumables);
        Object.freeze(tools);
        
        return Object.freeze({
            byId: itemsById,
            byName: itemsByName,
            consumables: consumables,
            tools: tools,
            getId(name) { return this.byName[name] || null; },
            getName(id) {
                const item = this.byId[parseInt(id)];
                return item ? item.name : null;
            },
            isConsumable(idOrName) {
                const id = typeof idOrName === 'number' ? idOrName : this.getId(idOrName);
                return id && !!this.consumables[id];
            },
            isTool(idOrName) {
                const id = typeof idOrName === 'number' ? idOrName : this.getId(idOrName);
                return id && !!this.tools[id];
            }
        });
    })();
    
    // Legacy aliases for backward compatibility
    const ITEM_IDS = ITEMS.byName;
    const ITEM_NAMES = Object.freeze((() => {
        const names = {};
        for (const [id, item] of Object.entries(ITEMS.byId)) {
            names[parseInt(id)] = item.name;
        }
        return names;
    })());
    
    // ==================== JOB DATA ====================
    const JOB_DATA = Object.freeze({
        "General Waste": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 2066, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 1994, consumables: Object.freeze([]) }),
                "Burn": Object.freeze({ income: 1998, consumables: Object.freeze(["Gasoline"]) }),
                "Sink": Object.freeze({ income: 2000, consumables: Object.freeze([]) }),
                "Dissolve": Object.freeze({ income: 0, consumables: Object.freeze(["Hydrochloric Acid"]) })
            })
        }),
        "Broken Appliance": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 4535, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 4557, consumables: Object.freeze([]) }),
                "Sink": Object.freeze({ income: 4469, consumables: Object.freeze([]) }),
                "Dissolve": Object.freeze({ income: 0, consumables: Object.freeze(["Hydrochloric Acid"]) })
            })
        }),
        "Old Furniture": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 2885, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 2961, consumables: Object.freeze([]) }),
                "Burn": Object.freeze({ income: 2993, consumables: Object.freeze(["Gasoline"]) }),
                "Sink": Object.freeze({ income: 2970, consumables: Object.freeze([]) }),
                "Dissolve": Object.freeze({ income: 0, consumables: Object.freeze(["Hydrochloric Acid"]) })
            })
        }),
        "Building Debris": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 8923, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 8860, consumables: Object.freeze([]) }),
                "Sink": Object.freeze({ income: 8990, consumables: Object.freeze([]) })
            })
        }),
        "Vehicle": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 15070, consumables: Object.freeze(["Bleach", "Paper Towels"]) }),
                "Burn": Object.freeze({ income: 14994, consumables: Object.freeze(["Gasoline"]) }),
                "Sink": Object.freeze({ income: 15017, consumables: Object.freeze(["Brick"]) })
            })
        }),
        "Documents": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 10118, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 9957, consumables: Object.freeze([]) }),
                "Burn": Object.freeze({ income: 9973, consumables: Object.freeze(["Gasoline"]) }),
                "Sink": Object.freeze({ income: 0, consumables: Object.freeze([]) }),
                "Dissolve": Object.freeze({ income: 0, consumables: Object.freeze(["Hydrochloric Acid"]) })
            })
        }),
        "Industrial Waste": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 24077, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 24375, consumables: Object.freeze([]) }),
                "Sink": Object.freeze({ income: 24067, consumables: Object.freeze([]) })
            })
        }),
        "Biological Waste": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 28012, consumables: Object.freeze(["Disposable Mask"]) }),
                "Bury": Object.freeze({ income: 28201, consumables: Object.freeze(["Disposable Mask"]) }),
                "Burn": Object.freeze({ income: 29061, consumables: Object.freeze(["Gasoline", "Disposable Mask"]) }),
                "Sink": Object.freeze({ income: 28477, consumables: Object.freeze(["Disposable Mask"]) })
            })
        }),
        "Firearm": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 38433, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 37241, consumables: Object.freeze([]) }),
                "Sink": Object.freeze({ income: 38222, consumables: Object.freeze([]) }),
                "Dissolve": Object.freeze({ income: 0, consumables: Object.freeze(["Hydrochloric Acid"]) })
            })
        }),
        "Murder Weapon": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 39078, consumables: Object.freeze(["Bleach", "Paper Towels"]) }),
                "Bury": Object.freeze({ income: 38912, consumables: Object.freeze([]) }),
                "Sink": Object.freeze({ income: 37359, consumables: Object.freeze([]) }),
                "Dissolve": Object.freeze({ income: 0, consumables: Object.freeze(["Hydrochloric Acid"]) })
            })
        }),
        "Body Part": Object.freeze({
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 72044, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 71673, consumables: Object.freeze(["Lye"]) }),
                "Burn": Object.freeze({ income: 70850, consumables: Object.freeze(["Gasoline"]) }),
                "Sink": Object.freeze({ income: 70913, consumables: Object.freeze([]) }),
                "Dissolve": Object.freeze({ income: 70543, consumables: Object.freeze(["Hydrochloric Acid"]) })
            })
        }),
        "Dead Body": Object.freeze({
            income: 138309,
            multiplier: 5,
            methods: Object.freeze({
                "Abandon": Object.freeze({ income: 140755, consumables: Object.freeze([]) }),
                "Bury": Object.freeze({ income: 130663, consumables: Object.freeze(["Lye"]) }),
                "Burn": Object.freeze({ income: 150350, consumables: Object.freeze(["Gasoline"]) }),
                "Sink": Object.freeze({ income: 0, consumables: Object.freeze(["Anchor", "Rope"]) }),
                "Dissolve": Object.freeze({ income: 137550, consumables: Object.freeze(["Hydrochloric Acid", "Bone Saw"]) })
            })
        })
    });

    // Export Data module
    Disposal.Data = Object.freeze({
        ITEMS,
        JOB_DATA,
        ITEM_IDS,
        ITEM_NAMES
    });
    // --- Module: Data END ---

    // --- Module: Stats START ---
    /**
     * Statistical functions for success rate analysis.
     * All functions are pure with no side effects.
     */
    const SUCCESS_RATES = Object.freeze({
        'Biological Waste': Object.freeze({
            'Abandon': Object.freeze({ success: 79.37, samples: 504, risk: 'risky', nerve: 6 }),
            'Bury': Object.freeze({ success: 87.78, samples: 352, risk: 'moderate', nerve: 8 }),
            'Burn': Object.freeze({ success: 72.46, samples: 207, risk: 'risky', nerve: 10 }),
            'Sink': Object.freeze({ success: 98.35, samples: 1814, risk: 'safe', nerve: 12 })
        }),
        'Body Part': Object.freeze({
            'Abandon': Object.freeze({ success: 81.54, samples: 623, risk: 'unsafe', nerve: 6 }),
            'Bury': Object.freeze({ success: 81.04, samples: 413, risk: 'unsafe', nerve: 8 }),
            'Burn': Object.freeze({ success: 88.77, samples: 187, risk: 'moderate', nerve: 10 }),
            'Sink': Object.freeze({ success: 84.62, samples: 104, risk: 'unsafe', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 99.35, samples: 919, risk: 'safe', nerve: 14 })
        }),
        'Building Debris': Object.freeze({
            'Abandon': Object.freeze({ success: 86.40, samples: 3441, risk: 'unsafe', nerve: 6 }),
            'Bury': Object.freeze({ success: 70.53, samples: 1181, risk: 'risky', nerve: 8 }),
            'Sink': Object.freeze({ success: 97.45, samples: 5715, risk: 'safe', nerve: 12 })
        }),
        'Dead Body': Object.freeze({
            'Abandon': Object.freeze({ success: 79.56, samples: 964, risk: 'risky', nerve: 6 }),
            'Bury': Object.freeze({ success: 89.02, samples: 164, risk: 'moderate', nerve: 8 }),
            'Burn': Object.freeze({ success: 89.33, samples: 253, risk: 'moderate', nerve: 10 }),
            'Sink': Object.freeze({ success: 78.57, samples: 14, risk: 'risky', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 98.14, samples: 537, risk: 'safe', nerve: 14 })
        }),
        'Documents': Object.freeze({
            'Abandon': Object.freeze({ success: 77.53, samples: 632, risk: 'risky', nerve: 6 }),
            'Bury': Object.freeze({ success: 89.05, samples: 201, risk: 'moderate', nerve: 8 }),
            'Burn': Object.freeze({ success: 98.06, samples: 3138, risk: 'safe', nerve: 10 }),
            'Sink': Object.freeze({ success: 0, samples: 76, risk: 'dangerous', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 0, samples: 25, risk: 'dangerous', nerve: 14 })
        }),
        'Firearm': Object.freeze({
            'Abandon': Object.freeze({ success: 78.10, samples: 548, risk: 'risky', nerve: 6 }),
            'Bury': Object.freeze({ success: 89.87, samples: 671, risk: 'moderate', nerve: 8 }),
            'Sink': Object.freeze({ success: 98.60, samples: 1285, risk: 'safe', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 0, samples: 25, risk: 'dangerous', nerve: 14 })
        }),
        'General Waste': Object.freeze({
            'Abandon': Object.freeze({ success: 86.33, samples: 4622, risk: 'unsafe', nerve: 6 }),
            'Bury': Object.freeze({ success: 97.64, samples: 2843, risk: 'safe', nerve: 8 }),
            'Burn': Object.freeze({ success: 96.97, samples: 3032, risk: 'safe', nerve: 10 }),
            'Sink': Object.freeze({ success: 71.92, samples: 463, risk: 'risky', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 0, samples: 89, risk: 'dangerous', nerve: 14 })
        }),
        'Industrial Waste': Object.freeze({
            'Abandon': Object.freeze({ success: 75.49, samples: 1118, risk: 'risky', nerve: 6 }),
            'Bury': Object.freeze({ success: 86.33, samples: 1017, risk: 'unsafe', nerve: 8 }),
            'Sink': Object.freeze({ success: 97.48, samples: 3054, risk: 'safe', nerve: 12 })
        }),
        'Murder Weapon': Object.freeze({
            'Abandon': Object.freeze({ success: 79.07, samples: 259, risk: 'risky', nerve: 6 }),
            'Bury': Object.freeze({ success: 92.31, samples: 299, risk: 'moderate', nerve: 8 }),
            'Sink': Object.freeze({ success: 98.64, samples: 959, risk: 'safe', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 0, samples: 26, risk: 'dangerous', nerve: 14 })
        }),
        'Old Furniture': Object.freeze({
            'Abandon': Object.freeze({ success: 88.13, samples: 1542, risk: 'moderate', nerve: 6 }),
            'Bury': Object.freeze({ success: 69.11, samples: 764, risk: 'risky', nerve: 8 }),
            'Burn': Object.freeze({ success: 97.28, samples: 3451, risk: 'safe', nerve: 10 }),
            'Sink': Object.freeze({ success: 84.36, samples: 390, risk: 'unsafe', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 0, samples: 41, risk: 'dangerous', nerve: 14 })
        }),
        'Broken Appliance': Object.freeze({
            'Abandon': Object.freeze({ success: 86.58, samples: 1461, risk: 'unsafe', nerve: 6 }),
            'Bury': Object.freeze({ success: 75.52, samples: 286, risk: 'risky', nerve: 8 }),
            'Sink': Object.freeze({ success: 96.98, samples: 4537, risk: 'safe', nerve: 12 }),
            'Dissolve': Object.freeze({ success: 0, samples: 69, risk: 'dangerous', nerve: 14 })
        }),
        'Vehicle': Object.freeze({
            'Abandon': Object.freeze({ success: 86.58, samples: 790, risk: 'unsafe', nerve: 6 }),
            'Burn': Object.freeze({ success: 96.88, samples: 865, risk: 'safe', nerve: 10 }),
            'Sink': Object.freeze({ success: 98.12, samples: 1648, risk: 'safe', nerve: 12 })
        })
    });

    // ==================== STATISTICS (Pure Functions) ====================
    /**
     * Pure mathematical functions for statistical calculations.
     * No dependencies on external state. No side effects.
     */

    /**
     * Calculates the percentile rank of a value within a sorted array.
     * Uses midpoint method for tied values.
     * 
     * @param {number} value - Value to find percentile for
     * @param {number[]} sortedArray - Array sorted in ascending order
     * @returns {number} Percentile as decimal (0-1)
     */
    function getPercentile(value, sortedArray) {
        if (sortedArray.length === 0) return 0;
        if (sortedArray.length === 1) return value >= sortedArray[0] ? 1 : 0;
        
        let position = 0;
        for (let i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i] < value) {
                position = i + 1;
            } else if (sortedArray[i] === value) {
                let equalCount = 1;
                for (let j = i + 1; j < sortedArray.length && sortedArray[j] === value; j++) {
                    equalCount++;
                }
                position = i + equalCount / 2;
                break;
            } else {
                break;
            }
        }
        
        return position / sortedArray.length;
    }

    /**
     * Maps a percentile value to a color category based on Config thresholds.
     * 
     * @param {number} percentile - Percentile as decimal (0-1)
     * @returns {string} Color category: 'safe', 'moderate', 'unsafe', 'risky', or 'dangerous'
     */
    function percentileToColor(percentile) {
        const t = Config.percentiles;
        if (percentile >= t.safe) return 'safe';
        if (percentile >= t.moderate) return 'moderate';
        if (percentile >= t.unsafe) return 'unsafe';
        if (percentile >= t.risky) return 'risky';
        return 'dangerous';
    }

    /**
     * Calculates Wilson score confidence interval for a proportion.
     * Used for statistical ranking with small sample sizes.
     * 
     * @param {number} successes - Number of successful outcomes
     * @param {number} attempts - Total number of attempts
     * @param {number} [zScore=1.96] - Z-score for confidence level (default 95%)
     * @returns {Object} Object with lower, upper bounds and point estimate
     */
    function wilsonScore(successes, attempts, zScore = 1.96) {
        if (attempts === 0) return { lower: 0, upper: 0, point: 0 };
        
        const p = successes / attempts;
        const denominator = 1 + (zScore * zScore) / attempts;
        const centre = p + (zScore * zScore) / (2 * attempts);
        const adjustment = zScore * Math.sqrt(
            (p * (1 - p)) / attempts + (zScore * zScore) / (4 * attempts * attempts)
        );
        
        return {
            lower: (centre - adjustment) / denominator,
            upper: (centre + adjustment) / denominator,
            point: p
        };
    }

    /**
     * Calculates the Wilson lower bound for a success rate.
     * Provides a conservative estimate that accounts for sample size.
     * 
     * @param {number} successRate - Success rate as percentage (0-100)
     * @param {number} samples - Number of samples
     * @returns {number} Wilson lower bound as percentage (0-100)
     */
    function getWilsonLowerBound(successRate, samples) {
        const successes = Math.round(successRate * samples / 100);
        const wilson = wilsonScore(successes, samples);
        return wilson.lower * 100;
    }

    /**
     * Finds the best and worst methods for a job based on a scoring function.
     * 
     * @param {string} jobType - Job type to analyze
     * @param {Function} scoringFunction - Function that takes method data and returns score
     * @returns {Object} Object with best and worst method names
     */
    function getJobBestWorst(jobType, scoringFunction) {
        const methods = SUCCESS_RATES[jobType];
        if (!methods) return { best: null, worst: null };
        
        const scored = Object.entries(methods).map(([name, data]) => ({
            name,
            score: scoringFunction(data)
        }));
        
        if (scored.length === 0) return { best: null, worst: null };
        scored.sort((a, b) => b.score - a.score);
        
        return {
            best: scored[0].name,
            worst: scored[scored.length - 1].name
        };
    }

    /**
     * Stats module - exports all pure statistical functions.
     */
    const Stats = Object.freeze({
        getPercentile,
        percentileToColor,
        wilsonScore,
        getWilsonLowerBound,
        getJobBestWorst
    });

    Disposal.Stats = Stats;
    // --- Module: Stats END ---

    // ==================== PROFITABILITY CALCULATOR ====================
    /**
     * Calculates profitability metrics for disposal methods.
     * 
     * Initialization is asynchronous and may involve API calls. Consumers must
     * await ensureReady() before accessing calculated data to avoid race conditions.
     */
    // --- Module: Calculator START ---
    /**
     * ProfitabilityCalculator module handles profit/efficiency calculations.
     * 
     * Dependencies (injected via closure):
     *   - JOB_DATA: Job income and consumable data
     *   - SUCCESS_RATES: Method success rates and nerve costs
     *   - ITEM_IDS: Item name to ID mapping
     *   - TornAPI: API client for price fetching
     *   - CacheManager: Price cache management
     * 
     * Features:
     *   - Idempotent initialization (concurrent calls share same promise)
     *   - Automatic cache management
     *   - Price change notifications
     * 
     * Architecture:
     *   - Private: State variables, internal helpers (_calculateItemCost, _calculate, _doInitialize)
     *   - Public: Read-only state getters, lifecycle methods, query methods
     */
    const ProfitabilityCalculator = (() => {
        // ==================== PRIVATE STATE ====================
        let _itemPrices = {};
        let _profitabilityData = [];
        let _expectedData = [];
        let _thresholds = null;
        let _lastUpdate = 0;
        let _initialized = false;
        let _onUpdateCallback = null;
        let _initPromise = null;
        let _initInProgress = false;

        // ==================== PRIVATE METHODS ====================
        
        /**
         * Calculates the total item cost for a disposal method.
         * @private
         * 
         * @param {string} jobType - Job type
         * @param {string} methodName - Method name
         * @returns {number} Total cost in dollars
         */
        const _calculateItemCost = (jobType, methodName) => {
            const jobData = JOB_DATA[jobType];
            if (!jobData || !jobData.methods[methodName]) return 0;

            const method = jobData.methods[methodName];
            const multiplier = jobData.multiplier || 1;
            let totalCost = 0;

            for (const itemName of method.consumables) {
                const itemId = ITEM_IDS[itemName];
                const price = _itemPrices[itemId] || 0;
                totalCost += price * multiplier;
            }

            return totalCost;
        };

        /**
         * Calculates profitability metrics for a single method.
         * @private
         * 
         * @param {string} jobType - Job type
         * @param {string} methodName - Method name
         * @returns {Object|null} Calculation result or null if invalid
         */
        const _calculate = (jobType, methodName) => {
            const jobData = JOB_DATA[jobType];
            const methodData = SUCCESS_RATES[jobType]?.[methodName];
            
            if (!jobData || !methodData) return null;
            
            const methodInfo = jobData.methods[methodName];
            if (!methodInfo || methodInfo.income === undefined) return null;

            const cost = _calculateItemCost(jobType, methodName);
            const income = methodInfo.income;
            const successRate = methodData.success / 100;
            const nerve = methodData.nerve;
            
            // Profitability: assumes 100% success
            const profitabilityProfit = income - cost;
            const profitabilityProfitPerNerve = profitabilityProfit / nerve;
            
            // Expected: weighted by success rate
            const expectedIncome = income * successRate;
            const expectedProfit = expectedIncome - cost;
            const expectedProfitPerNerve = expectedProfit / nerve;

            return {
                jobType,
                methodName,
                nerve,
                successRate: methodData.success,
                income,
                itemCost: Math.round(cost),
                profitabilityProfit: Math.round(profitabilityProfit),
                profitabilityProfitPerNerve: Math.round(profitabilityProfitPerNerve),
                expectedIncome: Math.round(expectedIncome),
                expectedProfit: Math.round(expectedProfit),
                expectedProfitPerNerve: Math.round(expectedProfitPerNerve)
            };
        };

        /**
         * Recalculates all profitability data.
         * Called after prices are loaded/updated.
         * @private
         */
        const _calculateAll = () => {
            _profitabilityData = [];
            _expectedData = [];
            
            for (const [jobType, methods] of Object.entries(SUCCESS_RATES)) {
                for (const methodName of Object.keys(methods)) {
                    const calc = _calculate(jobType, methodName);
                    if (calc) {
                        _profitabilityData.push({
                            jobType: calc.jobType,
                            methodName: calc.methodName,
                            nerve: calc.nerve,
                            successRate: calc.successRate,
                            income: calc.income,
                            itemCost: calc.itemCost,
                            profit: calc.profitabilityProfit,
                            profitPerNerve: calc.profitabilityProfitPerNerve
                        });
                        
                        _expectedData.push({
                            jobType: calc.jobType,
                            methodName: calc.methodName,
                            nerve: calc.nerve,
                            successRate: calc.successRate,
                            income: calc.income,
                            itemCost: calc.itemCost,
                            expectedIncome: calc.expectedIncome,
                            profit: calc.expectedProfit,
                            profitPerNerve: calc.expectedProfitPerNerve
                        });
                    }
                }
            }
            
            log(`Calculator: computed ${_profitabilityData.length} methods`);
        };

        // ==================== PUBLIC METHODS ====================

        /**
         * Gets color class based on value percentile.
         * 
         * @param {number} value - Profit per nerve value
         * @param {string} [mode='profitability'] - Mode type
         * @returns {string} Color class name
         */
        const getColorClass = (value, mode = 'profitability') => {
            const data = mode === 'profitability' ? _profitabilityData : _expectedData;
            
            if (!data || data.length === 0) return 'unsafe';
            
            const allValues = data.map(d => d.profitPerNerve).sort((a, b) => a - b);
            const percentile = getPercentile(value, allValues);
            return percentileToColor(percentile);
        };

        /**
         * Gets border class for best/worst method indicators.
         * 
         * @param {string} jobType - Job type
         * @param {string} methodName - Method name
         * @param {string} [mode='profitability'] - Mode type
         * @returns {string} Border class name
         */
        const getBorderClass = (jobType, methodName, mode = 'profitability') => {
            const data = mode === 'profitability' ? _profitabilityData : _expectedData;
            
            if (!data || data.length === 0) return 'perf';
            
            const jobMethods = data.filter(d => d.jobType === jobType);
            if (jobMethods.length === 0) return 'perf';
            
            const values = jobMethods.map(m => m.profitPerNerve);
            const bestValue = Math.max(...values);
            const worstValue = Math.min(...values);
            
            const currentMethod = jobMethods.find(m => m.methodName === methodName);
            if (!currentMethod) return 'perf';
            
            const currentValue = currentMethod.profitPerNerve;
            const EPSILON = 0.01;
            
            if (Math.abs(currentValue - bestValue) < EPSILON) return 'best-ring';
            if (Math.abs(currentValue - worstValue) < EPSILON) return 'worst-negative-ring';
            if (currentValue < 0) return 'negative-ring';
            
            return 'perf';
        };

        /**
         * Gets tooltip text for a method.
         * 
         * @param {string} jobType - Job type
         * @param {string} methodName - Method name
         * @param {string} [mode='profitability'] - Mode type
         * @returns {string} Tooltip text
         */
        const getTooltipText = (jobType, methodName, mode = 'profitability') => {
            const data = mode === 'profitability' ? 
                _profitabilityData.find(d => d.jobType === jobType && d.methodName === methodName) :
                _expectedData.find(d => d.jobType === jobType && d.methodName === methodName);

            if (!data) return '';

            const profitSign = data.profit >= 0 ? '+' : '';
            const nerveProfitSign = data.profitPerNerve >= 0 ? '+' : '';

            if (mode === 'expected') {
                return `📊 Expected Income Analysis\n` +
                       `Base Income: $${data.income.toLocaleString()}\n` +
                       `Success Rate: ${data.successRate}%\n` +
                       `Expected Income: $${data.expectedIncome.toLocaleString()}\n` +
                       `Item Cost: $${data.itemCost.toLocaleString()}\n` +
                       `Net Profit: ${profitSign}$${data.profit.toLocaleString()}\n` +
                       `Profit/Nerve: ${nerveProfitSign}$${data.profitPerNerve.toLocaleString()}`;
            } else {
                return `💰 Profitability Analysis\n` +
                       `Base Income: $${data.income.toLocaleString()}\n` +
                       `Item Cost: $${data.itemCost.toLocaleString()}\n` +
                       `Net Profit: ${profitSign}$${data.profit.toLocaleString()}\n` +
                       `Profit/Nerve: ${nerveProfitSign}$${data.profitPerNerve.toLocaleString()}`;
            }
        };

        /**
         * Internal initialization logic.
         * @private
         */
        const _doInitialize = async () => {
            try {
                log('Calculator: initializing...');
                
                const oldPrices = { ..._itemPrices };
                const hadPrices = Object.keys(oldPrices).length > 0;
                
                // Attempt to load from cache first
                const cachedPrices = CacheManager.load();
                
                if (cachedPrices) {
                    _itemPrices = cachedPrices;
                } else {
                    // Fetch from API (retry logic is handled by TornAPI)
                    _itemPrices = await TornAPI.getItemPrices();
                    if (_itemPrices) {
                        CacheManager.save(_itemPrices);
                    }
                }
                
                if (!_itemPrices || Object.keys(_itemPrices).length === 0) {
                    throw new Error('Failed to obtain price data');
                }
                
                _calculateAll();
                _lastUpdate = Date.now();
                _initialized = true;

                // Notify listeners if prices changed
                if (hadPrices) {
                    const pricesChanged = JSON.stringify(oldPrices) !== JSON.stringify(_itemPrices);
                    if (pricesChanged && _onUpdateCallback) {
                        log('Calculator: prices changed, notifying listeners');
                        _onUpdateCallback(_itemPrices);
                    }
                } else {
                    log('Calculator: initial prices loaded');
                }
                
                log('Calculator: ready');
                return true;

            } catch (error) {
                log('Calculator: initialization failed:', error.message);
                _initialized = false;
                return false;
            }
        };

        // ==================== LIFECYCLE METHODS ====================

        /**
         * Initializes the calculator by loading prices from cache or API.
         * Idempotent: concurrent calls share the same promise.
         * 
         * @returns {Promise<boolean>} True if initialization succeeded
         */
        const initialize = async () => {
            if (_initInProgress && _initPromise) {
                return _initPromise;
            }
            
            _initInProgress = true;
            _initPromise = _doInitialize();
            
            try {
                return await _initPromise;
            } finally {
                _initInProgress = false;
            }
        };

        /**
         * Returns a promise that resolves when initialization is complete.
         * Safe barrier for consumers that depend on calculated data.
         * 
         * @returns {Promise<boolean>} Resolves to true if ready
         */
        const ensureReady = async () => {
            if (_initialized) {
                return true;
            }
            
            if (_initInProgress && _initPromise) {
                return _initPromise;
            }
            
            return initialize();
        };

        /**
         * Forces a refresh by clearing cache and reinitializing.
         * 
         * @returns {Promise<boolean>} True if refresh succeeded
         */
        const forceRefresh = async () => {
            log('Calculator: force refresh requested');
            CacheManager.clear();
            _initialized = false;
            _initPromise = null;
            _initInProgress = false;
            return initialize();
        };

        /**
         * Checks if cache needs refresh.
         * 
         * @returns {boolean} True if refresh needed
         */
        const needsRefresh = () => CacheManager.needsRefresh();

        /**
         * Refreshes if cache is stale.
         */
        const refreshIfNeeded = async () => {
            if (needsRefresh()) {
                await initialize();
            }
        };

        /**
         * Registers a callback for price update notifications.
         * 
         * @param {Function} callback - Called with new prices when changed
         */
        const onPricesUpdate = (callback) => {
            _onUpdateCallback = callback;
        };

        // ==================== PUBLIC API ====================
        return {
            // State getters (read-only access to private state)
            get itemPrices() { return _itemPrices; },
            get profitabilityData() { return _profitabilityData; },
            get expectedData() { return _expectedData; },
            get thresholds() { return _thresholds; },
            get lastUpdate() { return _lastUpdate; },
            get initialized() { return _initialized; },
            
            // Public methods (no internal helpers exposed)
            getColorClass,
            getBorderClass,
            getTooltipText,
            initialize,
            ensureReady,
            forceRefresh,
            needsRefresh,
            refreshIfNeeded,
            onPricesUpdate
        };
    })();

    Disposal.Calculator = ProfitabilityCalculator;
    // --- Module: Calculator END ---

    // --- Module: Ranking START ---
    /**
     * Ranking module provides unified scale calculations and percentile caching.
     * Depends on Stats module for mathematical functions.
     */

    // ==================== UNIFIED PERCENTILE SCALE ====================
    /**
     * Builds a unified scale combining Wilson lower bounds and raw success rates.
     * Ensures consistent color mapping across conservative and optimistic modes.
     * Uses lazy initialization - scale is built on first access.
     */
    const UnifiedScale = (() => {
        let unifiedScores = null;
        
        /**
         * Builds the unified scale by collecting all possible scores.
         * Called automatically on first use.
         * @private
         */
        function buildUnifiedScale() {
            const allScores = [];
            
            // Collect ALL scores (both Wilson lower bounds and raw success rates)
            for (const [jobType, methods] of Object.entries(SUCCESS_RATES)) {
                for (const [methodName, data] of Object.entries(methods)) {
                    allScores.push(getWilsonLowerBound(data.success, data.samples));
                    allScores.push(data.success);
                }
            }
            
            // Sort ascending for percentile calculation
            unifiedScores = allScores.sort((a, b) => a - b);
            
            log('Unified scale built:', {
                totalScores: unifiedScores.length,
                min: unifiedScores[0],
                max: unifiedScores[unifiedScores.length - 1]
            });
        }
        
        /**
         * Returns color category for a given value using the unified scale.
         * 
         * @param {number} value - Score value to evaluate
         * @returns {string} Color category name
         */
        function getColorForValue(value) {
            if (!unifiedScores) buildUnifiedScale();
            const percentile = getPercentile(value, unifiedScores);
            return percentileToColor(percentile);
        }
        
        /**
         * Resets the cached scale. Call when SUCCESS_RATES changes.
         */
        function reset() {
            unifiedScores = null;
        }
        
        return Object.freeze({
            buildScale: buildUnifiedScale,
            getColor: getColorForValue,
            reset
        });
    })();

    // ==================== PERCENTILE CACHE ====================
    /**
     * Caches percentile calculations for all disposal methods.
     * Computes once per mode switch, then provides O(1) lookups.
     * Prevents redundant calculations across multiple button renders.
     */
    class PercentileCache {
        constructor() {
            this.cache = new Map();
            this.mode = null;
        }

        /**
         * Computes and caches percentiles for all methods in the given mode.
         * Skips computation if already calculated for this mode.
         * Complexity: O(n log n) where n is total number of disposal methods.
         * 
         * @param {string} mode - Display mode ('conservative', 'optimistic', 'profitability', 'expected')
         */
        compute(mode) {
            if (this.mode === mode && this.cache.size > 0) {
                if (Config.debug) log(`Percentile cache: already computed for ${mode}`);
                return;
            }

            const allMethods = [];

            for (const [crimeType, methods] of Object.entries(SUCCESS_RATES)) {
                for (const [methodName, data] of Object.entries(methods)) {
                    const value = this.getValue(crimeType, methodName, mode);
                    
                    if (value === null || value === undefined) continue;
                    
                    allMethods.push({
                        key: `${crimeType}|${methodName}`,
                        value,
                        crimeType,
                        methodName,
                        data: { ...data, jobType: crimeType, methodName }
                    });
                }
            }

            if (allMethods.length === 0) {
                log('Warning: No valid methods to cache');
                return;
            }

            // Sort by value descending
            allMethods.sort((a, b) => b.value - a.value);

            const n = allMethods.length;
            this.cache.clear();

            allMethods.forEach((method, index) => {
                const percentile = (n - index) / n;

                this.cache.set(method.key, {
                    percentile,
                    value: method.value,
                    color: this.getColorFromValue(method.value, mode),
                    borderClass: this.getBorderClassFromRank(method.data, index, n, mode)
                });
            });

            this.mode = mode;

            if (Config.debug) log(`Percentile cache computed: ${n} methods in ${mode} mode`);
        }

        /**
         * Retrieves cached data for a specific crime type and method.
         * 
         * @param {string} crimeType - Crime type (e.g., "General Waste")
         * @param {string} methodName - Disposal method (e.g., "Burn")
         * @returns {Object|undefined} Cached percentile data or undefined if not found
         */
        get(crimeType, methodName) {
            return this.cache.get(`${crimeType}|${methodName}`);
        }

        /**
         * Extracts the value to use for ranking based on the current mode.
         * 
         * @param {string} crimeType - Crime type
         * @param {string} methodName - Disposal method
         * @param {string} mode - Display mode
         * @returns {number|null} Value for ranking or null if unavailable
         */
        getValue(crimeType, methodName, mode) {
            const data = SUCCESS_RATES[crimeType]?.[methodName];
            if (!data) return null;

            switch (mode) {
                case 'conservative':
                    return getWilsonLowerBound(data.success, data.samples);
                    
                case 'optimistic':
                    return data.success;
                    
                case 'profitability':
                    if (!ProfitabilityCalculator.initialized) return null;
                    const profitData = ProfitabilityCalculator.profitabilityData.find(
                        d => d.jobType === crimeType && d.methodName === methodName
                    );
                    return profitData ? profitData.profitPerNerve : 0;
                    
                case 'expected':
                    if (!ProfitabilityCalculator.initialized) return null;
                    const expectedData = ProfitabilityCalculator.expectedData.find(
                        d => d.jobType === crimeType && d.methodName === methodName
                    );
                    return expectedData ? expectedData.profitPerNerve : 0;
                    
                default:
                    return null;
            }
        }

        /**
         * Maps value to color category using appropriate scale.
         * 
         * @param {number} value - Actual calculated value
         * @param {string} mode - Display mode
         * @returns {string} Color class name
         */
        getColorFromValue(value, mode) {
            if (mode === 'conservative' || mode === 'optimistic') {
                return UnifiedScale.getColor(value);
            } else if (mode === 'profitability' || mode === 'expected') {
                if (ProfitabilityCalculator.initialized) {
                    return ProfitabilityCalculator.getColorClass(value, mode);
                }
                return 'moderate';
            }
            return 'moderate';
        }

        /**
         * Determines border styling class based on rank and value.
         * 
         * @param {Object} data - Method data with job type and method name
         * @param {number} rank - Zero-based rank (0 = best)
         * @param {number} total - Total number of methods
         * @param {string} mode - Display mode
         * @returns {string} Border class identifier
         */
        getBorderClassFromRank(data, rank, total, mode) {
            const jobType = data.jobType;
            const methodName = data.methodName;

            if (!SUCCESS_RATES[jobType]) return 'perf';

            if (mode === 'conservative') {
                const { best, worst } = getJobBestWorst(jobType, d =>
                    getWilsonLowerBound(d.success, d.samples)
                );
                if (methodName === best) return 'best-ring';
                if (methodName === worst) return 'worst-negative-ring';
                return 'perf';
                
            } else if (mode === 'optimistic') {
                const { best, worst } = getJobBestWorst(jobType, d => d.success);
                if (methodName === best) return 'best-ring';
                if (methodName === worst) return 'worst-negative-ring';
                return 'perf';
                
            } else if ((mode === 'profitability' || mode === 'expected') && ProfitabilityCalculator.initialized) {
                return ProfitabilityCalculator.getBorderClass(jobType, methodName, mode);
            }

            return 'perf';
        }

        /**
         * Clears the cache and resets state.
         */
        invalidate() {
            this.cache.clear();
            this.mode = null;
            if (Config.debug) log('Percentile cache invalidated');
        }
    }

    /**
     * Ranking module exports.
     */
    const Ranking = Object.freeze({
        UnifiedScale,
        PercentileCache
    });

    Disposal.Ranking = Ranking;
    // --- Module: Ranking END ---

    // --- Module: DOM START ---
    /**
     * DOM module provides centralized DOM manipulation utilities.
     * 
     * Components:
     *   - SELECTORS: Frozen selector definitions for stable DOM queries
     *   - DOMCache: Caches stable DOM elements to reduce querySelector calls
     *   - DOM: Helper functions for common DOM operations
     *   - EventDelegate: Centralized event handling with delegation
     */

    // ==================== SELECTORS ====================
    /**
     * Selector definitions for DOM queries.
     * Arrays allow fallback for different Torn UI versions.
     */
    const SELECTORS = Object.freeze({
        header: Object.freeze([
            '.appHeader___gUnYC.crimes-app-header',
            '[class*="appHeader"]',
            '.crimes-app-header'
        ]),
        crimeOptions: Object.freeze([
            '.crime-option',
            '[class*="crimeOption___"]',
            '[class*="crime-option"]'
        ]),
        crimeType: Object.freeze([
            '[class*="crimeOptionSection"]',
            '.crimeOptionSection___hslpu',
            '[class*="flexGrow"]'
        ]),
        methodButtons: Object.freeze([
            'button[aria-label="Abandon"]',
            'button[aria-label="Bury"]',
            'button[aria-label="Burn"]',
            'button[aria-label="Sink"]',
            'button[aria-label="Dissolve"]',
            'button[class*="methodButton"]'
        ]),
        commitButton: Object.freeze([
            '.commitButton___NYsg8',
            '.commit-button'
        ]),
        // Custom UI selectors
        ui: Object.freeze({
            modeToggle: '.disposal-mode-toggle',
            settingsButton: '.disposal-settings-btn',
            slotDropdown: '.disposal-slot-dropdown',
            settingsDialog: '.disposal-settings-dialog'
        })
    });

    // ==================== DOM HELPERS ====================
    /**
     * Pure DOM helper functions.
     * No state, no side effects beyond DOM manipulation.
     */
    const DOM = (() => {
        /**
         * Queries DOM with multiple selector fallbacks.
         * 
         * @param {string[]} selectors - Array of CSS selectors to try
         * @param {Element} [context=document] - Context element for query
         * @returns {Element|null} First matching element or null
         */
        const queryWithFallback = (selectors, context = document) => {
            for (const selector of selectors) {
                const element = context.querySelector(selector);
                if (element) return element;
            }
            return null;
        };

        /**
         * Queries all matching elements with multiple selector fallbacks.
         * 
         * @param {string[]} selectors - Array of CSS selectors to try
         * @param {Element} [context=document] - Context element for query
         * @returns {Element[]} Array of all matching elements
         */
        const queryAllWithFallback = (selectors, context = document) => {
            for (const selector of selectors) {
                const elements = context.querySelectorAll(selector);
                if (elements.length > 0) return Array.from(elements);
            }
            return [];
        };

        /**
         * Checks if element matches any of the given selectors.
         * 
         * @param {Element} element - Element to check
         * @param {string[]} selectors - Array of CSS selectors
         * @returns {boolean} True if element matches any selector
         */
        const matchesAny = (element, selectors) => {
            if (!element || !element.matches) return false;
            return selectors.some(sel => {
                try {
                    return element.matches(sel);
                } catch (e) {
                    return false;
                }
            });
        };

        /**
         * Finds closest ancestor matching any of the given selectors.
         * 
         * @param {Element} element - Starting element
         * @param {string[]} selectors - Array of CSS selectors
         * @returns {Element|null} Closest matching ancestor or null
         */
        const closestAny = (element, selectors) => {
            if (!element) return null;
            for (const selector of selectors) {
                try {
                    const match = element.closest(selector);
                    if (match) return match;
                } catch (e) {
                    continue;
                }
            }
            return null;
        };

        /**
         * Creates an element with attributes and children.
         * 
         * @param {string} tag - HTML tag name
         * @param {Object} [attrs={}] - Attributes to set
         * @param {(string|Element)[]} [children=[]] - Child nodes
         * @returns {Element} Created element
         */
        const createElement = (tag, attrs = {}, children = []) => {
            const element = document.createElement(tag);
            
            for (const [key, value] of Object.entries(attrs)) {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key.startsWith('data')) {
                    element.setAttribute(key.replace(/([A-Z])/g, '-$1').toLowerCase(), value);
                } else {
                    element.setAttribute(key, value);
                }
            }
            
            for (const child of children) {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    element.appendChild(child);
                }
            }
            
            return element;
        };

        /**
         * Safely removes an element from DOM.
         * 
         * @param {Element|null} element - Element to remove
         */
        const removeElement = (element) => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        };

        /**
         * Checks if element is visible in viewport.
         * 
         * @param {Element} element - Element to check
         * @returns {boolean} True if element is visible
         */
        const isVisible = (element) => {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        };

        return Object.freeze({
            queryWithFallback,
            queryAllWithFallback,
            matchesAny,
            closestAny,
            createElement,
            removeElement,
            isVisible
        });
    })();

    // ==================== DOM CACHE ====================
    /**
     * Caches stable DOM elements to reduce repeated querySelector calls.
     * Only caches elements that don't change during page lifecycle.
     */
    class DOMCache {
        constructor() {
            this.header = null;
            this.lastScanTime = 0;
            this.scanThrottleMs = 500;
        }

        /**
         * Gets the crimes page header element with caching.
         * 
         * @returns {HTMLElement|null} Header element or null if not found
         */
        getHeader() {
            if (this.header && document.contains(this.header)) {
                return this.header;
            }

            this.header = DOM.queryWithFallback(SELECTORS.header);
            if (this.header) {
                log('Header element cached');
            }

            return this.header;
        }

        /**
         * Checks if enough time has passed to allow a full DOM scan.
         * 
         * @returns {boolean} True if scan should proceed
         */
        shouldScan() {
            const now = Date.now();
            if (now - this.lastScanTime < this.scanThrottleMs) {
                return false;
            }
            this.lastScanTime = now;
            return true;
        }

        /**
         * Invalidates all cached elements.
         */
        invalidate() {
            this.header = null;
            log('DOM cache invalidated');
        }
    }

    // ==================== EVENT DELEGATE ====================
    /**
     * Centralized event delegation system.
     * Reduces event listener count by using delegation at document level.
     * 
     * Usage:
     *   EventDelegate.on('click', '.my-button', (e, target) => { ... });
     *   EventDelegate.off('click', '.my-button');
     */
    const EventDelegate = (() => {
        // Map of event type -> Map of selector -> handler
        const handlers = new Map();
        
        // Track which event types have document listeners
        const activeListeners = new Set();

        /**
         * Main delegation handler attached to document.
         * 
         * @private
         * @param {Event} event - DOM event
         */
        const delegateHandler = (event) => {
            const eventHandlers = handlers.get(event.type);
            if (!eventHandlers) return;

            // Walk up from target to find matching elements
            let target = event.target;
            
            while (target && target !== document) {
                for (const [selector, config] of eventHandlers) {
                    try {
                        if (target.matches(selector)) {
                            config.handler(event, target);
                            
                            if (config.once) {
                                eventHandlers.delete(selector);
                            }
                            
                            if (config.stopPropagation) {
                                return;
                            }
                        }
                    } catch (e) {
                        // Selector may be invalid, skip
                    }
                }
                target = target.parentElement;
            }
        };

        /**
         * Registers a delegated event handler.
         * 
         * @param {string} eventType - Event type (e.g., 'click', 'mouseenter')
         * @param {string} selector - CSS selector to match
         * @param {Function} handler - Handler function (event, matchedElement)
         * @param {Object} [options={}] - Options
         * @param {boolean} [options.once=false] - Remove after first trigger
         * @param {boolean} [options.stopPropagation=false] - Stop checking other selectors
         */
        const on = (eventType, selector, handler, options = {}) => {
            if (!handlers.has(eventType)) {
                handlers.set(eventType, new Map());
            }

            handlers.get(eventType).set(selector, {
                handler,
                once: options.once || false,
                stopPropagation: options.stopPropagation || false
            });

            // Add document listener if not already active
            if (!activeListeners.has(eventType)) {
                document.addEventListener(eventType, delegateHandler, true);
                activeListeners.add(eventType);
                log(`EventDelegate: listening for ${eventType}`);
            }
        };

        /**
         * Removes a delegated event handler.
         * 
         * @param {string} eventType - Event type
         * @param {string} selector - CSS selector
         */
        const off = (eventType, selector) => {
            const eventHandlers = handlers.get(eventType);
            if (eventHandlers) {
                eventHandlers.delete(selector);
                
                // Remove document listener if no handlers left
                if (eventHandlers.size === 0) {
                    document.removeEventListener(eventType, delegateHandler, true);
                    activeListeners.delete(eventType);
                    handlers.delete(eventType);
                    log(`EventDelegate: stopped listening for ${eventType}`);
                }
            }
        };

        /**
         * Removes all handlers for an event type.
         * 
         * @param {string} eventType - Event type
         */
        const offAll = (eventType) => {
            if (activeListeners.has(eventType)) {
                document.removeEventListener(eventType, delegateHandler, true);
                activeListeners.delete(eventType);
                handlers.delete(eventType);
                log(`EventDelegate: removed all ${eventType} handlers`);
            }
        };

        /**
         * Clears all event handlers.
         */
        const destroy = () => {
            for (const eventType of activeListeners) {
                document.removeEventListener(eventType, delegateHandler, true);
            }
            handlers.clear();
            activeListeners.clear();
            log('EventDelegate: destroyed');
        };

        /**
         * Gets count of registered handlers (for debugging).
         * 
         * @returns {Object} Handler counts by event type
         */
        const getStats = () => {
            const stats = {};
            for (const [eventType, eventHandlers] of handlers) {
                stats[eventType] = eventHandlers.size;
            }
            return stats;
        };

        return Object.freeze({
            on,
            off,
            offAll,
            destroy,
            getStats
        });
    })();

    /**
     * DOM module exports.
     */
    const DOMModule = Object.freeze({
        SELECTORS,
        DOM,
        DOMCache,
        EventDelegate
    });

    Disposal.DOM = DOMModule;
    // --- Module: DOM END ---

    // --- Module: UI START ---
    /**
     * UI module provides idempotent rendering utilities.
     * 
     * Idempotent rendering means:
     *   - Calling render() multiple times produces the same result
     *   - Existing elements are updated, not duplicated
     *   - State is preserved across re-renders when possible
     * 
     * Components:
     *   - UI: Core rendering utilities and state management
     *   - MODE_DEFINITIONS: Centralized mode configuration
     */

    // ==================== MODE DEFINITIONS ====================
    /**
     * Centralized mode configuration.
     * Single source of truth for all mode-related data.
     */
    const MODE_DEFINITIONS = Object.freeze([
        Object.freeze({ 
            key: 'conservative', 
            label: '🛡️', 
            fullLabel: 'Conservative', 
            color: '#0066cc', 
            category: 'Success Rate',
            description: 'Wilson lower bound - pessimistic estimate accounting for sample size'
        }),
        Object.freeze({ 
            key: 'optimistic', 
            label: '🌈', 
            fullLabel: 'Optimistic', 
            color: '#28a745', 
            category: 'Success Rate',
            description: 'Raw success rate - best case scenario'
        }),
        Object.freeze({ 
            key: 'profitability', 
            label: '💰', 
            fullLabel: 'Efficiency', 
            color: '#ffd700', 
            category: 'Profitability',
            description: 'Profit per nerve assuming 100% success'
        }),
        Object.freeze({ 
            key: 'expected', 
            label: '💵', 
            fullLabel: 'Expected Efficiency', 
            color: '#9b59b6', 
            category: 'Profitability',
            description: 'Expected profit per nerve weighted by success rate'
        })
    ]);

    // ==================== UI UTILITIES ====================
    /**
     * Idempotent UI rendering utilities.
     */
    const UI = (() => {
        // Track rendered components for idempotent updates
        const renderedComponents = new Map();

        /**
         * Gets a mode definition by key.
         * 
         * @param {string} key - Mode key
         * @returns {Object|undefined} Mode definition or undefined
         */
        const getMode = (key) => MODE_DEFINITIONS.find(m => m.key === key);

        /**
         * Gets all mode definitions.
         * 
         * @returns {Object[]} Array of mode definitions
         */
        const getModes = () => MODE_DEFINITIONS;

        /**
         * Gets modes filtered by category.
         * 
         * @param {string} category - Category name
         * @returns {Object[]} Filtered mode definitions
         */
        const getModesByCategory = (category) => 
            MODE_DEFINITIONS.filter(m => m.category === category);

        /**
         * Renders or updates a component idempotently.
         * If component exists, updates it. Otherwise creates it.
         * 
         * @param {string} id - Unique component identifier
         * @param {HTMLElement} container - Parent container
         * @param {Function} createFn - Function that creates the element
         * @param {Function} [updateFn] - Function that updates existing element
         * @returns {HTMLElement} The rendered element
         */
        const render = (id, container, createFn, updateFn = null) => {
            let element = renderedComponents.get(id);
            
            // Check if element still in DOM
            if (element && !document.contains(element)) {
                renderedComponents.delete(id);
                element = null;
            }

            if (element) {
                // Update existing element
                if (updateFn) {
                    updateFn(element);
                }
                return element;
            }

            // Create new element
            element = createFn();
            if (element) {
                renderedComponents.set(id, element);
                if (container && !container.contains(element)) {
                    container.appendChild(element);
                }
            }

            return element;
        };

        /**
         * Removes a rendered component.
         * 
         * @param {string} id - Component identifier
         */
        const remove = (id) => {
            const element = renderedComponents.get(id);
            if (element) {
                DOM.removeElement(element);
                renderedComponents.delete(id);
            }
        };

        /**
         * Removes all components matching a prefix.
         * 
         * @param {string} prefix - ID prefix to match
         */
        const removeByPrefix = (prefix) => {
            for (const [id, element] of renderedComponents) {
                if (id.startsWith(prefix)) {
                    DOM.removeElement(element);
                    renderedComponents.delete(id);
                }
            }
        };

        /**
         * Clears all tracked components.
         */
        const clear = () => {
            for (const element of renderedComponents.values()) {
                DOM.removeElement(element);
            }
            renderedComponents.clear();
            log('UI: All components cleared');
        };

        /**
         * Checks if a component is rendered.
         * 
         * @param {string} id - Component identifier
         * @returns {boolean} True if component exists and is in DOM
         */
        const isRendered = (id) => {
            const element = renderedComponents.get(id);
            return element && document.contains(element);
        };

        /**
         * Gets a rendered component by ID.
         * 
         * @param {string} id - Component identifier
         * @returns {HTMLElement|null} Element or null
         */
        const get = (id) => {
            const element = renderedComponents.get(id);
            return element && document.contains(element) ? element : null;
        };

        /**
         * Updates button active state based on current mode.
         * 
         * @param {HTMLElement[]} buttons - Array of toggle buttons
         * @param {string} activeMode - Currently active mode key
         */
        const updateButtonStates = (buttons, activeMode) => {
            buttons.forEach(btn => {
                const btnMode = btn.dataset.mode;
                const isActive = btnMode === activeMode;
                
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive);
                
                // Update visual styling
                if (isActive) {
                    const mode = getMode(btnMode);
                    if (mode) {
                        btn.style.background = `linear-gradient(135deg, ${mode.color}22, ${mode.color}11)`;
                        btn.style.boxShadow = `inset 0 0 0 1.5px ${mode.color}88, 0 0 8px ${mode.color}33`;
                    }
                } else {
                    btn.style.background = 'transparent';
                    btn.style.boxShadow = 'none';
                }
            });
        };

        /**
         * Creates a standard button with consistent styling.
         * 
         * @param {Object} options - Button options
         * @param {string} options.className - CSS class name
         * @param {string} options.label - Button label/emoji
         * @param {string} [options.tooltip] - Tooltip text
         * @param {Object} [options.dataset] - Data attributes
         * @returns {HTMLButtonElement} Created button
         */
        const createButton = ({ className, label, tooltip, dataset = {} }) => {
            const button = document.createElement('button');
            button.className = className;
            button.textContent = label;
            
            if (tooltip) {
                button.dataset.tooltip = tooltip;
                button.title = '';
            }
            
            for (const [key, value] of Object.entries(dataset)) {
                button.dataset[key] = value;
            }
            
            return button;
        };

        /**
         * Gets rendering statistics (for debugging).
         * 
         * @returns {Object} Stats object
         */
        const getStats = () => ({
            componentCount: renderedComponents.size,
            components: Array.from(renderedComponents.keys())
        });

        return Object.freeze({
            getMode,
            getModes,
            getModesByCategory,
            render,
            remove,
            removeByPrefix,
            clear,
            isRendered,
            get,
            updateButtonStates,
            createButton,
            getStats
        });
    })();

    /**
     * UI module exports.
     */
    const UIModule = Object.freeze({
        MODE_DEFINITIONS,
        UI
    });

    Disposal.UI = UIModule;
    // --- Module: UI END ---

    // --- Module: RenderEngine START ---
    /**
     * RenderEngine module - Deterministic UI rendering pipeline.
     * 
     * Architecture (Micro-Engines):
     *   1. ButtonMapper: DOM → Stable button map (pure, no mutations)
     *   2. ElementStyler: UIData → DOM styles (deterministic)
     *   3. TooltipEngine: Generate tooltip text (pure)
     *   4. UIOrchestrator: Pipeline controller (coordinates all engines)
     * 
     * Guarantees:
     *   - Idempotent rendering
     *   - No duplication
     *   - No side-effects outside orchestrator
     *   - Deterministic behavior
     */

    // ==================== BUTTON MAPPER ====================
    /**
     * ButtonMapper - Maps DOM to stable button structure.
     * Pure function, no DOM mutations.
     * 
     * Output structure:
     * {
     *   isComplete: boolean,
     *   jobs: {
     *     [jobType]: {
     *       isExpanded: boolean,
     *       buttons: [{ node, methodName, type: 'preview'|'expanded' }]
     *     }
     *   }
     * }
     */
    const ButtonMapper = (() => {
        /**
         * Finds all crime option containers.
         * @returns {NodeList|Array} Crime option elements
         */
        const findCrimeOptions = () => {
            for (const selector of SELECTORS.crimeOptions) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) return elements;
            }
            return [];
        };

        /**
         * Extracts crime type from a crime option element.
         * @param {Element} crimeOption - Crime option container
         * @returns {string|null} Crime type name
         */
        const getCrimeType = (crimeOption) => {
            for (const selector of SELECTORS.crimeType) {
                const element = crimeOption.querySelector(selector);
                if (element) {
                    const text = element.childNodes[0]?.textContent?.trim();
                    if (text && text.length > 0) return text;
                }
            }
            return null;
        };

        /**
         * Checks if element is a commit button (should be ignored).
         * @param {Element} btn - Button element
         * @returns {boolean} True if commit button
         */
        const isCommitButton = (btn) => {
            const isCommitClass = SELECTORS.commitButton.some(cls => 
                btn.classList.contains(cls.replace('.', ''))
            );
            const isDisposeText = btn.textContent.toLowerCase().includes('dispose');
            return isCommitClass || isDisposeText;
        };

        /**
         * Checks if button is in tablet preview section (collapsed view).
         * @param {Element} button - Button element
         * @returns {boolean} True if preview button
         */
        const isPreviewButton = (button) => {
            const parent = button.parentElement;
            return parent && parent.className.includes('tabletMethodsSection');
        };

        /**
         * Extracts method name from button.
         * @param {Element} button - Button element
         * @returns {string|null} Method name
         */
        const getMethodName = (button) => {
            const ariaLabel = button.getAttribute('aria-label');
            if (ariaLabel) return ariaLabel;

            const classList = button.className;
            if (classList.includes('abandon')) return 'Abandon';
            if (classList.includes('bury')) return 'Bury';
            if (classList.includes('burn')) return 'Burn';
            if (classList.includes('sink')) return 'Sink';
            if (classList.includes('dissolve')) return 'Dissolve';

            return null;
        };

        /**
         * Finds all method buttons in a crime option.
         * @param {Element} crimeOption - Crime option container
         * @returns {Array} Button elements (deduplicated, no commit buttons)
         */
        const findMethodButtons = (crimeOption) => {
            const buttons = [];
            const seen = new Set();
            
            for (const selector of SELECTORS.methodButtons) {
                const found = crimeOption.querySelectorAll(selector);
                found.forEach(btn => {
                    if (seen.has(btn)) return;
                    if (btn.type === 'button' && !isCommitButton(btn)) {
                        buttons.push(btn);
                        seen.add(btn);
                    }
                });
            }

            return buttons;
        };

        /**
         * Checks if method picker is expanded.
         * @param {Element} crimeOption - Crime option container
         * @returns {boolean} True if expanded
         */
        const isMethodPickerExpanded = (crimeOption) => {
            const methodPicker = crimeOption.querySelector('[class*="methodPicker"]');
            return methodPicker && methodPicker.className.includes('show');
        };

        /**
         * Creates a complete button map from current DOM state.
         * Pure function - no mutations.
         * 
         * @returns {Object} Button map with isComplete flag and jobs array
         */
        const map = () => {
            const result = {
                isComplete: false,
                jobs: []  // Array to handle duplicate crimeTypes (e.g., multiple "General Waste")
            };

            const crimeOptions = findCrimeOptions();
            if (crimeOptions.length === 0) {
                return result;
            }

            let totalButtons = 0;

            crimeOptions.forEach((crimeOption, index) => {
                const crimeType = getCrimeType(crimeOption);
                
                if (!crimeType || !SUCCESS_RATES[crimeType]) return;

                const isExpanded = isMethodPickerExpanded(crimeOption);
                const allButtons = findMethodButtons(crimeOption);
                
                // Collect ALL valid buttons (those with methodName in SUCCESS_RATES)
                const validButtons = [];
                
                allButtons.forEach(btn => {
                    const methodName = getMethodName(btn);
                    if (!methodName) return;
                    if (!SUCCESS_RATES[crimeType][methodName]) return;

                    validButtons.push({
                        node: btn,
                        methodName,
                        type: isPreviewButton(btn) ? 'preview' : 'expanded'
                    });
                });

                if (validButtons.length > 0) {
                    result.jobs.push({
                        crimeType,
                        index,  // Distinguish duplicates
                        isExpanded,
                        buttons: validButtons
                    });
                    totalButtons += validButtons.length;
                }
            });

            result.isComplete = result.jobs.length > 0;
            
            if (Config.debug) {
                log(`ButtonMapper: ${result.jobs.length} jobs, ${totalButtons} buttons`);
            }
            
            return result;
        };

        /**
         * Gets list of buttons that should be cleaned up (not in active map).
         * @param {Element} crimeOption - Crime option container
         * @returns {Array} Buttons to cleanup
         */
        const getButtonsToCleanup = (crimeOption) => {
            const isExpanded = isMethodPickerExpanded(crimeOption);
            const allButtons = findMethodButtons(crimeOption);
            
            // Separate by type
            const previewButtons = allButtons.filter(btn => isPreviewButton(btn));
            const expandedButtons = allButtons.filter(btn => !isPreviewButton(btn));
            
            // Cleanup logic mirrors map() logic:
            // - When expanded: cleanup preview buttons
            // - When collapsed: 
            //   - If has preview buttons: cleanup expanded buttons
            //   - If no preview buttons: cleanup nothing (expanded are being used)
            if (isExpanded) {
                return previewButtons;
            } else {
                return previewButtons.length > 0 ? expandedButtons : [];
            }
        };

        return Object.freeze({
            map,
            findCrimeOptions,
            getCrimeType,
            getMethodName,
            findMethodButtons,
            isPreviewButton,
            isMethodPickerExpanded,
            getButtonsToCleanup
        });
    })();

    // ==================== ELEMENT STYLER ====================
    /**
     * ElementStyler - Applies styles to button elements.
     * Deterministic: clear → apply pattern.
     * No querySelector, no global state reading.
     */
    const ElementStyler = (() => {
        /**
         * Converts hex color to RGB string.
         * @param {string} hex - Hex color (e.g., "#ff0000")
         * @returns {string} RGB values (e.g., "255, 0, 0")
         */
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? 
                `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
                '255, 255, 255';
        };

        /**
         * Clears all disposal-related styles from a button.
         * @param {Element} button - Button element
         */
        const clear = (button) => {
            button.classList.remove('worst-negative-ring', 'negative-ring');
            button.style.removeProperty('--accent');
            button.style.border = '';
            button.style.outline = '';
            button.style.outlineOffset = '';
            button.style.boxShadow = '';
        };

        /**
         * Applies styles to a button based on UIData.
         * Deterministic: always clears first, then applies.
         * 
         * @param {Element} button - Button element
         * @param {Object} uiData - Style data
         * @param {string} uiData.color - Hex color
         * @param {string} uiData.borderClass - Border class type
         */
        const apply = (button, uiData) => {
            const { color, borderClass } = uiData;
            const rgbColor = hexToRgb(color);

            // Always clear first (deterministic)
            clear(button);

            // Apply based on border class
            if (borderClass === 'best-ring') {
                button.style.outline = `4px double ${color}`;
                button.style.boxShadow = 
                    `inset 0 0 8px 3px rgba(255,255,255,0.06), ` +
                    `0 0 6px 2px rgba(0,0,0,0.55), ` +
                    `0 0 6px 3px rgba(${rgbColor}, 0.40)`;
            } else if (borderClass === 'worst-negative-ring') {
                button.classList.add('worst-negative-ring');
                button.style.setProperty('--accent', color);
                button.style.boxShadow =
                    `inset 0 0 8px 3px rgba(255,255,255,0.06), ` +
                    `0 0 6px 2px rgba(0,0,0,0.55), ` +
                    `0 0 6px 3px rgba(${rgbColor}, 0.40)`;
            } else if (borderClass === 'negative-ring') {
                button.classList.add('negative-ring');
                button.style.setProperty('--accent', color);
                button.style.outline = 'none';
                button.style.outlineOffset = '0px';
                button.style.border = 'none';
                button.style.boxShadow =
                    `inset 0 0 8px 3px rgba(255,255,255,0.06), ` +
                    `0 0 6px 2px rgba(0,0,0,0.55), ` +
                    `0 0 6px 3px rgba(${rgbColor}, 0.40)`;
            } else {
                // Default: perf or standard
                button.style.outline = `2px solid ${color}`;
                button.style.outlineOffset = '0px';
                button.style.boxShadow = 
                    `inset 0 0 8px 3px rgba(255,255,255,0.06), ` +
                    `0 0 6px 2px rgba(0,0,0,0.55), ` +
                    `0 0 6px 3px rgba(${rgbColor}, 0.40)`;
            }
        };

        return Object.freeze({
            clear,
            apply,
            hexToRgb
        });
    })();

    // ==================== TOOLTIP ENGINE ====================
    /**
     * TooltipEngine - Generates and applies tooltip text.
     * Pure functions for generation, simple apply for DOM.
     */
    const TooltipEngine = (() => {
        /**
         * Generates tooltip text for conservative/optimistic modes.
         * @param {string} crimeType - Crime type
         * @param {string} methodName - Method name
         * @param {Object} methodData - SUCCESS_RATES data
         * @returns {string} Tooltip text
         */
        const generateStatsTooltip = (crimeType, methodName, methodData) => {
            return `${crimeType} - ${methodName}\nSuccess: ${methodData.success}%\nSamples: ${methodData.samples}`;
        };

        /**
         * Generates tooltip text for profitability/expected modes.
         * @param {string} crimeType - Crime type
         * @param {string} methodName - Method name
         * @param {string} mode - Current mode
         * @returns {string} Tooltip text
         */
        const generateProfitTooltip = (crimeType, methodName, mode) => {
            if (!ProfitabilityCalculator.initialized) {
                return `${crimeType} - ${methodName}\nInitializing...`;
            }
            const tooltip = ProfitabilityCalculator.getTooltipText(crimeType, methodName, mode);
            return tooltip || `${crimeType} - ${methodName}\nCalculating...`;
        };

        /**
         * Generates appropriate tooltip based on mode.
         * @param {string} crimeType - Crime type
         * @param {string} methodName - Method name
         * @param {string} mode - Current mode
         * @param {Object} methodData - SUCCESS_RATES data
         * @returns {string} Tooltip text
         */
        const generate = (crimeType, methodName, mode, methodData) => {
            if (mode === 'profitability' || mode === 'expected') {
                return generateProfitTooltip(crimeType, methodName, mode);
            }
            return generateStatsTooltip(crimeType, methodName, methodData);
        };

        /**
         * Applies tooltip and data attributes to button.
         * @param {Element} button - Button element
         * @param {Object} data - Tooltip data
         */
        const apply = (button, data) => {
            const { tooltip, successRate, mode } = data;
            button.title = tooltip;
            button.setAttribute('data-disposal-rate', `${successRate}%`);
            button.setAttribute('data-disposal-mode', mode);
        };

        return Object.freeze({
            generate,
            apply,
            generateStatsTooltip,
            generateProfitTooltip
        });
    })();

    // ==================== DATA ENGINE ====================
    /**
     * DataEngine - Computes UI data from stats and cache.
     * 
     * Pure functions that transform:
     *   - SUCCESS_RATES data
     *   - PercentileCache lookups
     *   - Mode-specific calculations
     * 
     * Into UIData objects used by ElementStyler and TooltipEngine.
     * 
     * Handles gracefully:
     *   - Missing SUCCESS_RATES entries
     *   - Cache misses
     *   - New Torn methods not in our data
     */
    const DataEngine = (() => {
        /**
         * Computes UIData for a single button.
         * 
         * @param {string} crimeType - Crime type (e.g., "Dead Body")
         * @param {string} methodName - Method name (e.g., "Burn")
         * @param {string} mode - Current mode (conservative, optimistic, profitability, expected)
         * @param {Object} percentileCache - PercentileCache instance
         * @returns {Object|null} UIData object or null if data unavailable
         */
        const computeUIData = (crimeType, methodName, mode, percentileCache) => {
            // Validate input data exists
            const methodData = SUCCESS_RATES[crimeType]?.[methodName];
            if (!methodData) {
                if (Config.debug) log(`DataEngine: no SUCCESS_RATES for ${crimeType}/${methodName}`);
                return null;
            }

            // O(1) cache lookup for precomputed percentile/color
            const cached = percentileCache.get(crimeType, methodName);
            if (!cached) {
                if (Config.debug) log(`DataEngine: cache miss ${crimeType}/${methodName}`);
                return null;
            }

            // Build complete UIData object
            return {
                // Style data
                color: Config.colors[cached.color],
                borderClass: cached.borderClass,
                
                // Tooltip data
                tooltip: TooltipEngine.generate(crimeType, methodName, mode, methodData),
                
                // Metadata
                successRate: methodData.success,
                samples: methodData.samples,
                mode,
                
                // Extended data (from cache)
                percentile: cached.percentile,
                colorKey: cached.color,
                
                // Flags for special handling
                isNegative: cached.borderClass?.includes('negative') || false,
                isBest: cached.borderClass === 'best-ring',
                isWorst: cached.borderClass?.includes('worst') || false
            };
        };

        /**
         * Computes UIData for multiple buttons in batch.
         * 
         * @param {Array} buttons - Array of { crimeType, methodName }
         * @param {string} mode - Current mode
         * @param {Object} percentileCache - PercentileCache instance
         * @returns {Map} Map of "crimeType/methodName" → UIData
         */
        const computeBatch = (buttons, mode, percentileCache) => {
            const results = new Map();
            
            buttons.forEach(({ crimeType, methodName }) => {
                const key = `${crimeType}/${methodName}`;
                const uiData = computeUIData(crimeType, methodName, mode, percentileCache);
                if (uiData) {
                    results.set(key, uiData);
                }
            });
            
            return results;
        };

        /**
         * Checks if data is available for a given crime/method.
         * 
         * @param {string} crimeType - Crime type
         * @param {string} methodName - Method name
         * @returns {boolean} True if data exists in SUCCESS_RATES
         */
        const hasData = (crimeType, methodName) => {
            return !!(SUCCESS_RATES[crimeType]?.[methodName]);
        };

        return Object.freeze({
            computeUIData,
            computeBatch,
            hasData
        });
    })();

    // ==================== SNAPSHOT HASH ====================
    /**
     * SnapshotHash - Post-render verification for debugging.
     * 
     * Creates 3-layer signatures to verify render consistency:
     *   1. Node signature: text content, aria-label
     *   2. Style signature: border, outline, box-shadow
     *   3. Data signature: dataset attributes
     * 
     * Use for:
     *   - Debugging render issues
     *   - Verifying idempotency (same input → same output)
     *   - Detecting unexpected DOM changes
     */
    const SnapshotHash = (() => {
        /**
         * Creates a simple hash from a string.
         * Not cryptographic, just for comparison.
         * 
         * @param {string} str - String to hash
         * @returns {string} Hash string
         */
        const simpleHash = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash).toString(36);
        };

        /**
         * Gets node signature (content-based).
         * 
         * @param {HTMLElement} node - DOM node
         * @returns {string} Node signature
         */
        const getNodeSignature = (node) => {
            const text = node.textContent || '';
            const ariaLabel = node.getAttribute('aria-label') || '';
            const className = node.className || '';
            return simpleHash(`${text}|${ariaLabel}|${className}`);
        };

        /**
         * Gets style signature (appearance-based).
         * 
         * @param {HTMLElement} node - DOM node
         * @returns {string} Style signature
         */
        const getStyleSignature = (node) => {
            const style = node.style;
            const parts = [
                style.outline || '',
                style.border || '',
                style.boxShadow || '',
                style.background || ''
            ];
            return simpleHash(parts.join('|'));
        };

        /**
         * Gets data signature (dataset attributes).
         * 
         * @param {HTMLElement} node - DOM node
         * @returns {string} Data signature
         */
        const getDataSignature = (node) => {
            const data = node.dataset;
            const parts = [
                data.disposalRate || '',
                data.disposalMode || '',
                data.slot || '',
                data.mode || ''
            ];
            return simpleHash(parts.join('|'));
        };

        /**
         * Creates a complete snapshot of a node.
         * 
         * @param {HTMLElement} node - DOM node
         * @returns {Object} Snapshot with all signatures
         */
        const snapshot = (node) => {
            return {
                node: getNodeSignature(node),
                style: getStyleSignature(node),
                data: getDataSignature(node),
                combined: null // Computed below
            };
        };

        /**
         * Creates snapshots for multiple nodes.
         * 
         * @param {HTMLElement[]} nodes - Array of DOM nodes
         * @returns {Map} Map of node → snapshot
         */
        const snapshotAll = (nodes) => {
            const snapshots = new Map();
            nodes.forEach(node => {
                const snap = snapshot(node);
                snap.combined = simpleHash(`${snap.node}|${snap.style}|${snap.data}`);
                snapshots.set(node, snap);
            });
            return snapshots;
        };

        /**
         * Compares two snapshot maps and returns differences.
         * 
         * @param {Map} before - Snapshots before operation
         * @param {Map} after - Snapshots after operation
         * @returns {Object} Comparison result
         */
        const compare = (before, after) => {
            const result = {
                unchanged: 0,
                changed: [],
                added: [],
                removed: []
            };

            // Check for changes and removals
            for (const [node, snapBefore] of before) {
                const snapAfter = after.get(node);
                if (!snapAfter) {
                    result.removed.push(node);
                } else if (snapBefore.combined !== snapAfter.combined) {
                    result.changed.push({
                        node,
                        before: snapBefore,
                        after: snapAfter
                    });
                } else {
                    result.unchanged++;
                }
            }

            // Check for additions
            for (const [node] of after) {
                if (!before.has(node)) {
                    result.added.push(node);
                }
            }

            return result;
        };

        /**
         * Verifies render consistency (for debugging).
         * Renders twice and compares - should be identical (idempotent).
         * 
         * @param {Function} renderFn - Render function to verify
         * @param {HTMLElement[]} nodes - Nodes to check
         * @returns {Object} Verification result
         */
        const verifyIdempotency = (renderFn, nodes) => {
            // First render
            renderFn();
            const after1 = snapshotAll(nodes);
            
            // Second render (should be identical)
            renderFn();
            const after2 = snapshotAll(nodes);
            
            const comparison = compare(after1, after2);
            const isIdempotent = comparison.changed.length === 0 && 
                                 comparison.added.length === 0 && 
                                 comparison.removed.length === 0;
            
            if (!isIdempotent && Config.debug) {
                log('SnapshotHash: Idempotency violation detected!', comparison);
            }
            
            return {
                isIdempotent,
                comparison
            };
        };

        return Object.freeze({
            snapshot,
            snapshotAll,
            compare,
            verifyIdempotency,
            // Expose individual hashers for debugging
            getNodeSignature,
            getStyleSignature,
            getDataSignature
        });
    })();

    // ==================== DEBUG OVERLAY ====================
    /**
     * DebugOverlay - Visual diagnostics on method buttons.
     * 
     * When enabled, displays an overlay on each button showing:
     *   - Percentile rank
     *   - Current mode
     *   - Color class
     *   - Success rate
     * 
     * Useful for development and debugging rendering issues.
     * Does NOT affect normal functionality.
     */
    const DebugOverlay = (() => {
        let _enabled = false;
        const OVERLAY_CLASS = 'disposal-debug-overlay';

        /**
         * Creates overlay element for a button.
         * 
         * @param {Object} uiData - UIData from DataEngine
         * @returns {HTMLElement} Overlay element
         */
        const createOverlay = (uiData) => {
            const overlay = document.createElement('div');
            overlay.className = OVERLAY_CLASS;
            overlay.style.cssText = `
                position: absolute;
                top: 2px;
                right: 2px;
                background: rgba(0,0,0,0.85);
                color: #0f0;
                font-family: monospace;
                font-size: 9px;
                padding: 2px 4px;
                border-radius: 3px;
                pointer-events: none;
                z-index: 1000;
                line-height: 1.2;
                white-space: nowrap;
            `;
            
            const lines = [
                `P:${uiData.percentile?.toFixed(0) || '?'}%`,
                `M:${uiData.mode?.charAt(0).toUpperCase() || '?'}`,
                `C:${uiData.colorKey || '?'}`,
                `S:${uiData.successRate || '?'}%`
            ];
            
            overlay.textContent = lines.join(' ');
            return overlay;
        };

        /**
         * Applies debug overlay to a button.
         * 
         * @param {HTMLElement} button - Button element
         * @param {Object} uiData - UIData from DataEngine
         */
        const apply = (button, uiData) => {
            if (!_enabled) return;
            
            // Remove existing overlay
            const existing = button.querySelector(`.${OVERLAY_CLASS}`);
            if (existing) existing.remove();
            
            // Ensure button has relative positioning for overlay
            const currentPosition = window.getComputedStyle(button).position;
            if (currentPosition === 'static') {
                button.style.position = 'relative';
            }
            
            // Add new overlay
            const overlay = createOverlay(uiData);
            button.appendChild(overlay);
        };

        /**
         * Removes debug overlay from a button.
         * 
         * @param {HTMLElement} button - Button element
         */
        const remove = (button) => {
            const existing = button.querySelector(`.${OVERLAY_CLASS}`);
            if (existing) existing.remove();
        };

        /**
         * Removes all debug overlays from the page.
         */
        const removeAll = () => {
            document.querySelectorAll(`.${OVERLAY_CLASS}`).forEach(el => el.remove());
        };

        /**
         * Enables debug overlay mode.
         */
        const enable = () => {
            _enabled = true;
            log('DebugOverlay: enabled');
            log('DebugOverlay Legend:');
            log('  P:XX% = Percentile (ranking vs all methods, higher = better)');
            log('  M:X   = Mode (C=Conservative, O=Optimistic, P=Profitability, E=Expected)');
            log('  C:XXX = Color key (green/yellow/orange/red)');
            log('  S:XX% = Success rate (method success percentage)');
        };

        /**
         * Disables debug overlay mode and removes all overlays.
         */
        const disable = () => {
            _enabled = false;
            removeAll();
            log('DebugOverlay: disabled');
        };

        /**
         * Toggles debug overlay mode.
         * 
         * @returns {boolean} New enabled state
         */
        const toggle = () => {
            if (_enabled) {
                disable();
            } else {
                enable();
            }
            return _enabled;
        };

        /**
         * Checks if debug overlay is enabled.
         * 
         * @returns {boolean} Enabled state
         */
        const isEnabled = () => _enabled;

        return Object.freeze({
            apply,
            remove,
            removeAll,
            enable,
            disable,
            toggle,
            isEnabled
        });
    })();

    // ==================== UI ORCHESTRATOR ====================
    /**
     * UIOrchestrator - Coordinates the rendering pipeline.
     * 
     * Pipeline:
     *   1. Map buttons (stable snapshot)
     *   2. Compute UIData via DataEngine
     *   3. Apply styles via ElementStyler
     *   4. Apply tooltips via TooltipEngine
     * 
     * Features:
     *   - Dirty flag scheduler (coalesces multiple render requests)
     *   - Observer safety (pause/resume during render)
     *   - Processing lock to prevent re-entry
     *   - Graceful degradation on cache miss
     */
    const UIOrchestrator = (() => {
        // Private state
        let _isProcessing = false;
        let _lastRenderTime = 0;
        let _processedButtons = new WeakSet();
        
        // Dirty flag scheduler state
        let _isDirty = false;
        let _scheduledFrame = null;
        let _pendingContext = null;

        /**
         * Schedules a render for the next animation frame.
         * Multiple calls before the frame executes are coalesced into one render.
         * 
         * @param {Object} context - Render context (same as render())
         */
        const scheduleRender = (context) => {
            _pendingContext = context;
            _isDirty = true;
            
            // Only schedule if not already scheduled
            if (_scheduledFrame === null) {
                _scheduledFrame = requestAnimationFrame(() => {
                    _scheduledFrame = null;
                    
                    if (_isDirty && _pendingContext) {
                        _isDirty = false;
                        const ctx = _pendingContext;
                        _pendingContext = null;
                        render(ctx);
                    }
                });
            }
        };

        /**
         * Cancels any pending scheduled render.
         */
        const cancelScheduledRender = () => {
            if (_scheduledFrame !== null) {
                cancelAnimationFrame(_scheduledFrame);
                _scheduledFrame = null;
            }
            _isDirty = false;
            _pendingContext = null;
        };

        /**
         * Runs the complete rendering pipeline.
         * 
         * @param {Object} context - Render context
         * @param {string} context.mode - Current mode
         * @param {Object} context.percentileCache - Cache instance
         * @param {Function} context.onButtonProcessed - Callback for processed buttons
         * @returns {Object} Render result { processed, skipped, errors }
         */
        const render = (context) => {
            const { mode, percentileCache, onButtonProcessed, observer } = context;
            
            // Guard: prevent re-entry
            if (_isProcessing) {
                return { processed: 0, skipped: 0, errors: 0, reason: 'processing' };
            }

            // Throttle check
            const now = Date.now();
            if (now - _lastRenderTime < Config.observer.throttleDelay) {
                return { processed: 0, skipped: 0, errors: 0, reason: 'throttled' };
            }

            _isProcessing = true;
            _lastRenderTime = now;

            const result = { processed: 0, skipped: 0, errors: 0 };
            
            // Observer Safety: pause observer during DOM mutations
            // This prevents render loops where our style changes trigger new mutations
            let observerTarget = null;
            let observerConfig = null;
            
            if (observer) {
                // Store observer state before disconnecting
                observerTarget = document.querySelector('[class*="disposal-root"]') || 
                                document.querySelector('.disposal-root') || 
                                document.body;
                observerConfig = {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class']
                };
                observer.disconnect();
            }

            try {
                // Ensure cache is computed
                if (percentileCache.cache.size === 0) {
                    percentileCache.compute(mode);
                }

                // Step 1: Map buttons (returns ALL valid buttons)
                const buttonMap = ButtonMapper.map();
                if (!buttonMap.isComplete) {
                    result.reason = 'incomplete_map';
                    return result;
                }

                // Step 2-4: Process each job
                // Step 2-4: Process each job (jobs is now an array to handle duplicates)
                for (const jobData of buttonMap.jobs) {
                    const { crimeType, isExpanded, buttons } = jobData;
                    
                    // Count buttons by type for this job
                    const previewCount = buttons.filter(b => b.type === 'preview').length;
                    const expandedCount = buttons.filter(b => b.type === 'expanded').length;
                    
                    buttons.forEach(buttonInfo => {
                        const { node, methodName, type } = buttonInfo;

                        // Determine if this button should be styled or cleaned up
                        // Logic: avoid styling BOTH preview and expanded for same method
                        // - If job has both preview AND expanded buttons:
                        //   - When expanded: style expanded only
                        //   - When collapsed: style preview only
                        // - If job has only one type: style all
                        let shouldStyle = true;
                        
                        if (previewCount > 0 && expandedCount > 0) {
                            // Has both types - need to pick one based on state
                            shouldStyle = (isExpanded && type === 'expanded') || 
                                         (!isExpanded && type === 'preview');
                        }
                        
                        if (!shouldStyle) {
                            // Cleanup this button
                            ElementStyler.clear(node);
                            return;
                        }

                        try {
                            // Compute UIData via DataEngine
                            const uiData = DataEngine.computeUIData(crimeType, methodName, mode, percentileCache);
                            if (!uiData) {
                                result.skipped++;
                                return;
                            }

                            // Apply styles
                            ElementStyler.apply(node, uiData);

                            // Apply tooltip
                            TooltipEngine.apply(node, uiData);
                            
                            // Apply debug overlay (only if enabled)
                            DebugOverlay.apply(node, uiData);

                            // Track for click handler
                            if (!_processedButtons.has(node) && onButtonProcessed) {
                                onButtonProcessed(node);
                                _processedButtons.add(node);
                            }

                            result.processed++;
                        } catch (err) {
                            result.errors++;
                            if (Config.debug) log(`RenderEngine: error on ${crimeType}/${methodName}:`, err);
                        }
                    });
                }

            } finally {
                _isProcessing = false;
                
                // Observer Safety: resume observer after DOM mutations complete
                if (observer && observerTarget && observerConfig) {
                    observer.observe(observerTarget, observerConfig);
                }
            }

            return result;
        };

        /**
         * Clears a specific button's styles.
         * @param {Element} button - Button element
         */
        const clearButton = (button) => {
            ElementStyler.clear(button);
        };

        /**
         * Resets the orchestrator state.
         * Call when navigating away from disposal page.
         */
        const reset = () => {
            _processedButtons = new WeakSet();
            _lastRenderTime = 0;
            _isProcessing = false;
            
            // Clear dirty flag scheduler
            cancelScheduledRender();
        };

        /**
         * Gets current processing state.
         * @returns {boolean} True if currently processing
         */
        const isProcessing = () => _isProcessing;
        
        /**
         * Checks if a render is scheduled.
         * @returns {boolean} True if render is pending
         */
        const isDirty = () => _isDirty;

        return Object.freeze({
            render,
            scheduleRender,
            cancelScheduledRender,
            clearButton,
            reset,
            isProcessing,
            isDirty,
            // Expose engines for direct access if needed
            ButtonMapper,
            DataEngine,
            ElementStyler,
            TooltipEngine,
            SnapshotHash,
            DebugOverlay
        });
    })();

    // Export RenderEngine module
    Disposal.RenderEngine = Object.freeze({
        ButtonMapper,
        DataEngine,
        ElementStyler,
        TooltipEngine,
        SnapshotHash,
        DebugOverlay,
        UIOrchestrator
    });
    // --- Module: RenderEngine END ---

    // Legacy alias for backward compatibility
    const CARET_OFFSETS = Config.caretOffsets;

    // --- Module: Controller START ---
    /**
     * Controller module - Main orchestration class.
     * 
     * This module contains the DisposalEnhancer class which orchestrates:
     *   - Navigation detection (SPA routing)
     *   - DOM mutation observation
     *   - Mode/slot management
     *   - UI rendering and updates
     * 
     * Architecture notes:
     *   - Single instance created on DOMContentLoaded
     *   - Exposed globally as window.disposalEnhancer for debugging
     *   - Uses event delegation where possible
     *   - Manages lifecycle of observer and UI components
     * 
     * Dependencies:
     *   - Config: All configuration constants
     *   - Utils: Logging, debounce, error handling
     *   - API: TornAPI, CacheManager
     *   - Data: JOB_DATA, SUCCESS_RATES, ITEMS
     *   - Stats: Mathematical functions
     *   - Calculator: ProfitabilityCalculator
     *   - Ranking: UnifiedScale, PercentileCache
     *   - DOM: SELECTORS, DOMCache, EventDelegate
     *   - UI: MODE_DEFINITIONS, UI utilities
     *   - RenderEngine: ButtonMapper, ElementStyler, TooltipEngine, UIOrchestrator
     */

    // ==================== STATE ENGINE ====================
    /**
     * StateEngine - Centralized state management for the Controller.
     * 
     * This module provides a single source of truth for UI state,
     * with getters/setters that maintain consistency and enable
     * future features like state persistence and undo/redo.
     * 
     * State categories:
     *   - Navigation: isOnDisposalPage
     *   - Mode: currentMode, profitabilityInitialized
     *   - UI: toggleButtons, activeDropdown, dropdownJustClosed
     *   - Slots: slot configuration
     * 
     * Design principle: This is a refactoring of form only.
     * All state that was in DisposalEnhancer is now accessed through
     * StateEngine, but the behavior remains identical.
     */
    const StateEngine = (() => {
        // Private state store
        const _state = {
            // Navigation state
            isOnDisposalPage: false,
            
            // Mode state
            currentMode: GM_getValue(Config.storage.mode, 'conservative'),
            profitabilityInitialized: false,
            
            // UI state
            toggleButtons: [],
            activeDropdown: null,
            activeDropdownButton: null,
            dropdownJustClosed: false,
            
            // Observer state
            observer: null
        };

        // Slot state (separate for clarity)
        let _slots = null;

        /**
         * Gets a state value.
         * 
         * @param {string} key - State key
         * @returns {*} State value
         */
        const get = (key) => {
            if (key === 'slots') return _slots;
            return _state[key];
        };

        /**
         * Sets a state value.
         * 
         * @param {string} key - State key
         * @param {*} value - New value
         */
        const set = (key, value) => {
            if (key === 'slots') {
                _slots = value;
                return;
            }
            
            const oldValue = _state[key];
            _state[key] = value;
            
            // Log state changes in debug mode (only for primitive values)
            if (Config.debug && oldValue !== value) {
                // Don't log DOM elements or complex objects
                const isPrimitive = (v) => v === null || v === undefined || 
                    typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
                
                if (isPrimitive(oldValue) && isPrimitive(value)) {
                    log(`StateEngine: ${key}: ${oldValue} → ${value}`);
                } else {
                    log(`StateEngine: ${key} updated`);
                }
            }
        };

        /**
         * Gets multiple state values.
         * 
         * @param {string[]} keys - State keys
         * @returns {Object} State values
         */
        const getMany = (keys) => {
            const result = {};
            keys.forEach(key => {
                result[key] = get(key);
            });
            return result;
        };

        /**
         * Sets multiple state values.
         * 
         * @param {Object} updates - Key-value pairs to update
         */
        const setMany = (updates) => {
            Object.entries(updates).forEach(([key, value]) => {
                set(key, value);
            });
        };

        /**
         * Resets UI-related state (used on navigation).
         */
        const resetUIState = () => {
            _state.toggleButtons = [];
            _state.activeDropdown = null;
            _state.activeDropdownButton = null;
            _state.dropdownJustClosed = false;
        };

        /**
         * Gets a snapshot of all state (for debugging).
         * Returns serializable data only (no DOM elements or observers).
         * 
         * @returns {Object} Complete state snapshot
         */
        const snapshot = () => ({
            // Navigation
            isOnDisposalPage: _state.isOnDisposalPage,
            
            // Mode
            currentMode: _state.currentMode,
            profitabilityInitialized: _state.profitabilityInitialized,
            
            // UI (counts only, not DOM references)
            toggleButtonsCount: _state.toggleButtons?.length || 0,
            hasActiveDropdown: _state.activeDropdown !== null,
            dropdownJustClosed: _state.dropdownJustClosed,
            
            // Observer
            observerActive: _state.observer !== null,
            
            // Slots
            slots: _slots ? { ..._slots } : null
        });

        return Object.freeze({
            get,
            set,
            getMany,
            setMany,
            resetUIState,
            snapshot
        });
    })();

    // Export StateEngine
    Disposal.StateEngine = StateEngine;

    // ==================== MAIN CONTROLLER CLASS ====================
    class DisposalEnhancer {
        constructor() {
            // Initialize StateEngine with stored values
            StateEngine.set('currentMode', GM_getValue(Config.storage.mode, 'conservative'));
            StateEngine.set('observer', null);
            StateEngine.set('toggleButtons', []);
            StateEngine.set('isOnDisposalPage', false);
            StateEngine.set('profitabilityInitialized', false);
            StateEngine.set('activeDropdown', null);
            StateEngine.set('activeDropdownButton', null);
            StateEngine.set('dropdownJustClosed', false);
            
            // Module instances (not in StateEngine - these are objects, not state)
            this.percentileCache = new PercentileCache();
            this.domCache = new DOMCache();
            
            // Slot configuration
            StateEngine.set('slots', this.loadSlotConfiguration());
            
            this.init();
        }
        
        // ==================== STATE ACCESSORS ====================
        // These getters/setters delegate to StateEngine, maintaining
        // backward compatibility with existing code while centralizing state.
        
        get currentMode() { return StateEngine.get('currentMode'); }
        set currentMode(value) { StateEngine.set('currentMode', value); }
        
        get observer() { return StateEngine.get('observer'); }
        set observer(value) { StateEngine.set('observer', value); }
        
        get toggleButtons() { return StateEngine.get('toggleButtons'); }
        set toggleButtons(value) { StateEngine.set('toggleButtons', value); }
        
        get isOnDisposalPage() { return StateEngine.get('isOnDisposalPage'); }
        set isOnDisposalPage(value) { StateEngine.set('isOnDisposalPage', value); }
        
        get profitabilityInitialized() { return StateEngine.get('profitabilityInitialized'); }
        set profitabilityInitialized(value) { StateEngine.set('profitabilityInitialized', value); }
        
        get activeDropdown() { return StateEngine.get('activeDropdown'); }
        set activeDropdown(value) { StateEngine.set('activeDropdown', value); }
        
        get _activeDropdownButton() { return StateEngine.get('activeDropdownButton'); }
        set _activeDropdownButton(value) { StateEngine.set('activeDropdownButton', value); }
        
        get dropdownJustClosed() { return StateEngine.get('dropdownJustClosed'); }
        set dropdownJustClosed(value) { StateEngine.set('dropdownJustClosed', value); }
        
        get slots() { return StateEngine.get('slots'); }
        set slots(value) { StateEngine.set('slots', value); }

        // ==================== SLOT CONFIGURATION ====================
        
        /**
         * Loads slot configuration from storage.
         * Slots store which mode is assigned to each quick-access button.
         * 
         * @returns {Object} Slot configuration
         */
        loadSlotConfiguration() {
            const defaultSlots = {
                slot1: 'optimistic',
                slot2: 'expected'
            };
            return GM_getValue('disposalSlots', defaultSlots);
        }

        /**
         * Saves slot configuration to storage.
         */
        saveSlotConfiguration() {
            GM_setValue('disposalSlots', this.slots);
        }

        // ==================== DEVICE DETECTION ====================
        
        /**
         * Detects if device is mobile based on screen width.
         * 
         * @returns {boolean} True if mobile device
         */
        isMobileDevice() {
            return window.innerWidth <= 768;
        }

        // ==================== INITIALIZATION ====================
        
        /**
         * Main initialization routine.
         * Sets up navigation detection, price updates, and periodic refresh.
         */
        async init() {
            log('Init v7.0.0 - Modular Architecture');
            
            // Build unified scale for color mapping
            UnifiedScale.buildScale();

            // Subscribe to price updates before any profitability initialization
            ProfitabilityCalculator.onPricesUpdate(() => {
                if (this.currentMode === 'profitability' || this.currentMode === 'expected') {
                    log('Price update detected, recomputing percentile cache');
                    this.percentileCache.compute(this.currentMode);
                    this.applyColors();
                }
            });
            
            // Setup SPA navigation detection
            this.setupNavigationDetection();
            
            // Periodic price refresh (every 10 minutes)
            setInterval(() => {
                if ((this.currentMode === 'profitability' || this.currentMode === 'expected') && 
                    ProfitabilityCalculator.initialized) {
                    ProfitabilityCalculator.refreshIfNeeded();
                }
            }, 600000);
            
            // Initial check
            this.checkAndEnhance();
        }

        // ==================== NAVIGATION DETECTION (SPA) ====================
        
        /**
         * Sets up SPA navigation detection.
         * Intercepts history API and listens for hash changes.
         * This is critical for Torn's SPA architecture.
         */
        setupNavigationDetection() {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            const self = this;
            
            // Intercept pushState
            history.pushState = function() {
                originalPushState.apply(this, arguments);
                self.onNavigationChange();
            };
            
            // Intercept replaceState
            history.replaceState = function() {
                originalReplaceState.apply(this, arguments);
                self.onNavigationChange();
            };
            
            // Listen for hash/popstate changes
            window.addEventListener('hashchange', () => this.onNavigationChange());
            window.addEventListener('popstate', () => this.onNavigationChange());
        }

        /**
         * Handles navigation changes in the SPA.
         * Detects entry/exit from disposal page.
         */
        onNavigationChange() {
            const isDisposal = window.location.hash.includes('disposal');
            
            if (isDisposal !== this.isOnDisposalPage) {
                this.isOnDisposalPage = isDisposal;
                
                if (isDisposal) {
                    this.onEnterDisposalPage();
                } else {
                    this.onLeaveDisposalPage();
                }
            }
        }

        // ==================== PAGE LIFECYCLE ====================
        
        /**
         * Called when entering the disposal page.
         * Resets state and initializes profitability if needed.
         */
        onEnterDisposalPage() {
            log('Entering disposal');
            
            // Disconnect any existing observer
            if (this.observer) this.observer.disconnect();
            
            // Reset processing state (both local and UIOrchestrator)
            UIOrchestrator.reset();
            
            // Initialize profitability mode if needed
            if ((this.currentMode === 'profitability' || this.currentMode === 'expected') 
                && !this.profitabilityInitialized) {
                this.initializeProfitabilityMode().then(() => {
                    this.waitForElements(() => {
                        setTimeout(() => this.enhance(), 300);
                    });
                });
            } else {
                this.waitForElements(() => {
                    setTimeout(() => this.enhance(), 300);
                });
            }
        }

        onLeaveDisposalPage() {
            log('Leaving disposal');
            
            const container = document.querySelector('.disposal-mode-container');
            if (container && container.parentElement) {
                container.remove();
            }
            
            this.toggleButtons = [];
            this.closeActiveDropdown();
            
            const popup = document.querySelector('.disposal-settings-popup');
            if (popup) popup.remove();
            const overlay = document.querySelector('.disposal-popup-overlay');
            if (overlay) overlay.remove();
            
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            
            this.domCache.invalidate();
        }

        /**
         * Waits for the page to be ready for enhancement.
         * Ready = jobs found OR header present (for empty job list case).
         */
        waitForElements(callback, attempts = 0, maxAttempts = 20) {
            const elements = ButtonMapper.findCrimeOptions();
            const header = document.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
            
            if (header) {
                if (elements.length > 0) {
                    log(`Found ${elements.length} options`);
                } else {
                    log('No jobs but header found - mounting UI');
                }
                callback();
            } else if (attempts < maxAttempts) {
                setTimeout(() => {
                    this.waitForElements(callback, attempts + 1, maxAttempts);
                }, 200);
            } else {
                log('Timeout waiting for page elements');
                callback();
            }
        }

        /**
         * Main enhancement entry point.
         * Sets up UI controls and applies initial styling.
         */
        enhance() {
            this.addModeToggle();
            this.setupObserver();
            this.applyColors();
            
            // Ensure button highlighting is applied after DOM is stable.
            // Uses requestAnimationFrame to defer until after paint,
            // resolving race conditions on initial page load.
            requestAnimationFrame(() => {
                this.updateToggleButtons();
            });
            
            log('Enhanced');
        }

        checkAndEnhance() {
            if (window.location.hash.includes('disposal')) {
                this.isOnDisposalPage = true;
                this.onEnterDisposalPage();
            }
        }

        /**
         * Initializes profitability mode with proper async handling.
         * Ensures calculator is fully ready before allowing UI updates.
         * 
         * @returns {Promise<boolean>} True if initialization succeeded
         */
        async initializeProfitabilityMode() {
            if (this.profitabilityInitialized && ProfitabilityCalculator.initialized) {
                return true;
            }

            let apiKey = TornAPI.getKey();
            
            if (!apiKey) {
                apiKey = prompt(
                    '💰 Profitability/Expected Mode\n\n' +
                    'Requires API key (minimal permissions).\n' +
                    'Fetches item prices (cached 1h).\n\n' +
                    'Enter API key:'
                );
                
                if (apiKey) {
                    TornAPI.setKey(apiKey);
                } else {
                    alert('Mode requires API key.\nSwitching to Conservative.');
                    this.currentMode = 'conservative';
                    GM_setValue('disposalMode', 'conservative');
                    return false;
                }
            }
            
            // Use ensureReady() to guarantee initialization completes before proceeding
            const success = await ProfitabilityCalculator.ensureReady();
            
            if (success) {
                this.profitabilityInitialized = true;
                log('Profitability mode ready');
            } else {
                alert('Init failed.\nSwitching to Conservative.');
                this.currentMode = 'conservative';
                GM_setValue('disposalMode', 'conservative');
            }
            
            return success;
        }

        addModeToggle() {
            const header = this.domCache.getHeader();
            if (!header) return;

            const existing = header.querySelectorAll('.disposal-mode-toggle');
            existing.forEach(btn => btn.remove());
            const existingContainer = header.querySelector('.disposal-mode-container');
            if (existingContainer) existingContainer.remove();
            this.toggleButtons = [];

            // Group wrapper: unified pill shape with rounded external corners
            // Follows modern segmented control patterns (iOS, macOS, Figma)
            const container = document.createElement('div');
            container.className = 'disposal-mode-container';
            container.style.cssText = `
                display: inline-flex;
                align-items: center;
                background: rgba(255,255,255,0.06);
                border-radius: 5px;
                margin-left: 8px;
                vertical-align: middle;
                overflow: hidden;
            `;

            // Use centralized mode definitions
            const modes = MODE_DEFINITIONS;

            const isMobile = this.isMobileDevice();

            if (isMobile) {
                this.createSlotButtons(container, modes);
                this.createSoftSeparator(container);
                this.createSettingsButton(container);
            } else {
                this.createDesktopButtons(container, modes);
                this.createSoftSeparator(container);
                this.createSettingsButton(container);
            }

            const titleBar = document.querySelector('.currentCrime___MN0T1 .titleBar___Cci85');
            if (titleBar && titleBar.children.length > 0) {
                titleBar.insertBefore(container, titleBar.children[1]);
            } else {
                const backLink = header.querySelector('a[href="#/"]');
                if (backLink) {
                    header.insertBefore(container, backLink);
                } else {
                    header.appendChild(container);
                }
            }
        }

        /**
         * Create slot-based buttons for mobile (2 slots + settings)
         */
        createSlotButtons(container, modes) {
            ['slot1', 'slot2'].forEach((slotId, slotIndex) => {
                const modeKey = this.slots[slotId];
                const mode = modes.find(m => m.key === modeKey);
                if (!mode) return;

                const button = this.createSlotButton(slotId, mode, modes, slotIndex === 0);
                container.appendChild(button);
                this.toggleButtons.push(button);
            });
        }

        /**
         * Create a single slot button with click and long-press functionality.
         * 
         * IMPORTANT: This function avoids closure-based state for the mode.
         * The button reads its current mode from dataset.mode at click time,
         * not from the closure. This allows the mode to be changed via dropdown
         * without recreating the button.
         */
        createSlotButton(slotId, mode, allModes, isFirst) {
            const button = document.createElement('button');
            button.className = 'disposal-mode-toggle';
            button.dataset.slot = slotId;
            button.dataset.mode = mode.key;
            button.dataset.tooltip = mode.fullLabel;
            button.title = '';
            
            // Icon element - centered via grid 1fr column
            const labelSpan = document.createElement('span');
            labelSpan.textContent = mode.label;
            labelSpan.style.fontSize = '14px';
            
            // Caret element - right-aligned utility indicator with optical correction
            const arrowSpan = document.createElement('span');
            arrowSpan.className = 'disposal-caret';
            arrowSpan.textContent = '▾';
            arrowSpan.style.cssText = `
                font-size: 10px;
                opacity: 0.75;
                letter-spacing: -0.5px;
                display: inline-block;
                justify-self: end;
                margin-left: 6px;
                transform: translateY(${CARET_OFFSETS[mode.key] || 1}px);
            `;
            
            button.appendChild(labelSpan);
            button.appendChild(arrowSpan);
            
            // Slot is active when its assigned mode matches currentMode
            const isActive = (this.slots[slotId] === this.currentMode);
            
            // Mode button layout: 1fr auto auto ensures icon centering with stable caret anchor
            button.style.cssText = `
                display: inline-grid;
                grid-template-columns: 1fr auto auto;
                align-items: center;
                background: ${isActive ? 'rgba(149,255,149,0.12)' : 'rgba(255,255,255,0.03)'};
                color: white;
                cursor: pointer;
                padding: 4px 10px;
                border: none;
                border-radius: 0;
                font-size: 14px;
                margin: 0;
                height: 28px;
                transition: background 0.2s, box-shadow 0.2s, outline 0.2s;
                position: relative;
                -webkit-tap-highlight-color: transparent;
            `;
            
            // Internal separator between mode buttons
            if (isFirst) {
                button.style.borderRight = '1px solid rgba(255,255,255,0.14)';
            }
            
            // Active state: Variant C — Hybrid Outline Glow
            // Inset glow for depth, soft outer glow, thin precise outline
            if (isActive) {
                button.style.boxShadow = 'inset 0 0 3px rgba(149,255,149,0.35), 0 0 3px rgba(149,255,149,0.25)';
                button.style.outline = '1px solid rgba(149,255,149,0.35)';
                button.style.outlineOffset = '-2px';
            }

            button.addEventListener('mouseenter', () => {
                const currentButtonMode = button.dataset.mode;
                if (this.currentMode !== currentButtonMode) {
                    button.style.filter = 'brightness(1.08)';
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.filter = '';
            });

            let pressTimer = null;
            let longPressTriggered = false;
            
            const startPress = () => {
                longPressTriggered = false;
                pressTimer = setTimeout(() => {
                    longPressTriggered = true;
                    this.showSlotDropdown(button, slotId, allModes);
                }, 600);
            };
            
            const cancelPress = () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            };
            
            /**
             * Handle click/tap on slot button.
             * CRITICAL: Reads mode from button.dataset.mode, NOT from closure.
             * This ensures the correct mode is used even after dropdown changes.
             */
            const handleClick = async () => {
                // Block if this is a spurious event after dropdown selection
                if (this.dropdownJustClosed) {
                    this.dropdownJustClosed = false;
                    return;
                }
                
                if (longPressTriggered) {
                    longPressTriggered = false;
                    return;
                }
                
                // Read current mode from dataset, not closure
                const currentButtonMode = button.dataset.mode;
                await this.switchToMode(currentButtonMode);
            };
            
            button.addEventListener('mousedown', startPress);
            button.addEventListener('mouseup', cancelPress);
            button.addEventListener('mouseleave', cancelPress);
            
            button.addEventListener('touchstart', (e) => {
                if (e.target.closest('.disposal-slot-dropdown')) return;
                startPress();
            });

            button.addEventListener('touchend', (e) => {
                if (e.target.closest('.disposal-slot-dropdown')) return;
                cancelPress();
                if (!longPressTriggered) {
                    handleClick();
                }
            });

            button.addEventListener('touchcancel', cancelPress);
            button.addEventListener('click', handleClick);

            return button;
        }

        /**
         * Create all 4 mode buttons for desktop
         */
        createDesktopButtons(container, modes) {
            modes.forEach((mode, index) => {
                const button = document.createElement('button');
                button.className = 'disposal-mode-toggle';
                button.dataset.mode = mode.key;
                button.textContent = `${mode.label} ${mode.fullLabel}`;
                button.setAttribute('aria-label', mode.fullLabel);
                button.title = '';
                
                const isActive = this.currentMode === mode.key;
                const isLast = index === modes.length - 1;
                
                // Desktop mode button styling - consistent with mobile segmented control
                button.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    background: ${isActive ? 'rgba(149,255,149,0.12)' : 'rgba(255,255,255,0.03)'};
                    color: white;
                    cursor: pointer;
                    padding: 4px 12px;
                    border: none;
                    border-radius: 0;
                    font-size: 12px;
                    margin: 0;
                    height: 28px;
                    transition: background 0.2s, box-shadow 0.2s, outline 0.2s;
                `;
                
                // Internal separator between mode buttons
                if (!isLast) {
                    button.style.borderRight = '1px solid rgba(255,255,255,0.14)';
                }
                
                // Active state: Variant C — Hybrid Outline Glow
                if (isActive) {
                    button.style.boxShadow = 'inset 0 0 3px rgba(149,255,149,0.35), 0 0 3px rgba(149,255,149,0.25)';
                    button.style.outline = '1px solid rgba(149,255,149,0.35)';
                    button.style.outlineOffset = '-2px';
                }

                button.addEventListener('mouseenter', () => {
                    if (this.currentMode !== mode.key) {
                        button.style.filter = 'brightness(1.08)';
                    }
                });

                button.addEventListener('mouseleave', () => {
                    button.style.filter = '';
                });

                button.addEventListener('click', async () => {
                    await this.switchToMode(mode.key);
                });

                container.appendChild(button);
                this.toggleButtons.push(button);
            });
        }

        /**
         * Creates a soft visual separator between mode buttons and config button.
         * Uses lower contrast than internal separators to indicate functional grouping.
         */
        createSoftSeparator(container) {
            const separator = document.createElement('div');
            separator.style.cssText = `
                width: 1px;
                height: 16px;
                background: rgba(255,255,255,0.07);
                margin: 0 2px;
                border-radius: 1px;
                flex-shrink: 0;
            `;
            container.appendChild(separator);
        }
        /**
         * Creates the config/settings button with cold utility styling.
         * This button is NOT part of the mutually exclusive mode set.
         * Uses a distinct visual treatment to communicate "tool action" vs "mode selection".
         */
        createSettingsButton(container) {
            const button = document.createElement('button');
            button.className = 'disposal-settings-button';
            button.textContent = '⚙️';
            button.setAttribute('aria-label', 'Settings');
            button.title = '';
            
            // Config button styling - cold utility blue variant
            // No glow, no selected state - communicates "action" not "mode"
            button.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: rgba(140,170,200,0.12);
                border: 1px solid rgba(160,190,220,0.25);
                border-radius: 0;
                color: white;
                cursor: pointer;
                padding: 4px 10px;
                font-size: 14px;
                height: 28px;
                margin: 0;
                opacity: 0.85;
                transition: background 0.2s, opacity 0.2s;
                -webkit-tap-highlight-color: transparent;
            `;

            button.addEventListener('mouseenter', () => {
                button.style.opacity = '1';
                button.style.filter = 'brightness(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.opacity = '0.85';
                button.style.filter = '';
            });

            let pressTimer = null;
            let longPressTriggered = false;
            
            const startPress = () => {
                longPressTriggered = false;
                pressTimer = setTimeout(async () => {
                    longPressTriggered = true;
                    button.style.transform = 'scale(0.95)';
                    button.style.filter = 'brightness(1.3)';
                    
                    log('Force refresh API prices');
                    const success = await ProfitabilityCalculator.forceRefresh();
                    
                    if (success) {
                        button.textContent = '✓';
                        button.style.color = '#4CAF50';
                    } else {
                        button.textContent = '✗';
                        button.style.color = '#f44336';
                    }
                    
                    setTimeout(() => {
                        button.textContent = '⚙️';
                        button.style.color = 'white';
                        button.style.transform = 'scale(1)';
                        button.style.filter = '';
                    }, 1000);
                    
                    this.updateToggleButtons();
                    this.applyColors();
                }, 600);
            };
            
            const cancelPress = () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
            };

            button.addEventListener('mousedown', startPress);
            button.addEventListener('mouseup', cancelPress);
            button.addEventListener('mouseleave', cancelPress);
            
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                startPress();
            });
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                cancelPress();
                if (!longPressTriggered) {
                    this.showSettingsPopup();
                }
            });
            button.addEventListener('touchcancel', cancelPress);

            button.addEventListener('click', () => {
                if (!longPressTriggered) {
                    this.showSettingsPopup();
                }
                longPressTriggered = false;
            });

            container.appendChild(button);
        }

        /**
         * Switch to a different mode
         */
        /**
         * Switches to a different display mode.
         * 
         * For profitability modes, ensures the calculator is fully initialized
         * before computing percentiles or applying colors. This prevents race
         * conditions where UI updates occur before data is ready.
         * 
         * @param {string} modeKey - Target mode identifier
         */
        async switchToMode(modeKey) {
            if (this.currentMode === modeKey) return;

            // For profitability modes, ensure calculator is ready before proceeding
            if (modeKey === 'profitability' || modeKey === 'expected') {
                const success = await this.initializeProfitabilityMode();
                if (!success) {
                    this.updateToggleButtons();
                    return;
                }
            }

            this.currentMode = modeKey;
            GM_setValue('disposalMode', modeKey);
            
            log(`Switched to ${modeKey}`);
            
            // Compute cache only after confirming calculator is ready
            this.percentileCache.compute(modeKey);
            
            this.updateToggleButtons();
            UIOrchestrator.reset(); // Reset render state for fresh application
            this.applyColors();
        }

        /**
         * Show dropdown menu for slot customization.
         * Sets dropdownJustClosed flag to prevent spurious button click events.
         */
        showSlotDropdown(button, slotId, allModes) {
            this.closeActiveDropdown();

            const dropdown = document.createElement('div');
            dropdown.className = 'disposal-slot-dropdown';

            const categories = {
                'Success Rate': allModes.filter(m => m.category === 'Success Rate'),
                'Profitability': allModes.filter(m => m.category === 'Profitability')
            };

            Object.entries(categories).forEach(([categoryName, modes], catIndex) => {
                if (catIndex > 0) {
                    const divider = document.createElement('div');
                    divider.className = 'disposal-slot-dropdown-divider';
                    dropdown.appendChild(divider);
                }

                const categoryLabel = document.createElement('div');
                categoryLabel.className = 'disposal-slot-dropdown-category';
                categoryLabel.textContent = categoryName;
                dropdown.appendChild(categoryLabel);

                modes.forEach(mode => {
                    const item = document.createElement('div');
                    item.className = 'disposal-slot-dropdown-item';
                    
                    const isCurrentSlot = this.slots[slotId] === mode.key;
                    const otherSlotId = slotId === 'slot1' ? 'slot2' : 'slot1';
                    const isInOtherSlot = this.slots[otherSlotId] === mode.key;
                    
                    if (isCurrentSlot) {
                        item.classList.add('active');
                    }
                    
                    if (isInOtherSlot) {
                        item.style.opacity = '0.5';
                        item.style.cursor = 'not-allowed';
                        item.style.pointerEvents = 'none';
                    }
                    
                    const label = document.createElement('span');
                    label.textContent = `${mode.label} ${mode.fullLabel}`;
                    item.appendChild(label);

                    if (!isInOtherSlot) {
                        /**
                         * Handle dropdown item selection.
                         * Uses both click (desktop) and touchend (mobile) because on iOS,
                         * the click event target can be incorrect after touch, causing
                         * closeOnClickOutside to fire before the item click is processed.
                         */
                        const handleItemSelect = async (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            
                            // Prevent double-firing from both touchend and click
                            if (item.dataset.handled === 'true') return;
                            item.dataset.handled = 'true';
                            
                            // Check if this slot is currently active BEFORE modifying it.
                            // Only switch active mode if modifying the currently active slot.
                            const slotWasActive = this.currentMode === this.slots[slotId];
                            
                            // Update slot configuration
                            this.slots[slotId] = mode.key;
                            this.saveSlotConfiguration();

                            // Find and update the correct slot button
                            const slotButton = document.querySelector(`.disposal-mode-toggle[data-slot="${slotId}"]`);
                            if (slotButton) {
                                slotButton.dataset.mode = mode.key;
                                const spans = slotButton.querySelectorAll('span');
                                // Update icon
                                if (spans[0]) spans[0].textContent = mode.label;
                                // Update caret with correct optical offset for new mode
                                if (spans[1]) {
                                    spans[1].textContent = '▾';
                                    spans[1].style.transform = `translateY(${CARET_OFFSETS[mode.key] || 1}px)`;
                                }
                            }

                            this.dropdownJustClosed = true;
                            this.closeActiveDropdown();

                            // Only switch active mode if the modified slot was the active one
                            if (slotWasActive) {
                                await this.switchToMode(mode.key);
                            } else {
                                // Just update button styles without changing active mode
                                this.updateToggleButtons();
                            }
                            
                            setTimeout(() => {
                                this.dropdownJustClosed = false;
                            }, 100);
                        };
                        
                        // Use touchend for mobile (fires before problematic click)
                        item.addEventListener('touchend', handleItemSelect);
                        // Use click for desktop
                        item.addEventListener('click', handleItemSelect);
                    }

                    dropdown.appendChild(item);
                });
            });

            // Position dropdown relative to button using fixed positioning
            // Appending to body avoids clipping from parent's overflow:hidden
            const rect = button.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = `${rect.bottom + 8}px`;
            dropdown.style.left = `${rect.left + rect.width / 2}px`;
            dropdown.style.transform = 'translateX(-50%)';
            
            document.body.appendChild(dropdown);
            this.activeDropdown = dropdown;
            this._activeDropdownButton = button;

            const closeOnClickOutside = (e) => {
                if (!dropdown.contains(e.target) && !button.contains(e.target)) {
                    this.closeActiveDropdown();
                    document.removeEventListener('click', closeOnClickOutside);
                    document.removeEventListener('touchend', closeOnClickOutside);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', closeOnClickOutside);
                document.addEventListener('touchend', closeOnClickOutside);
            }, 10);
        }

        /**
         * Close any active dropdown menu
         */
        closeActiveDropdown() {
            if (this.activeDropdown) {
                this.activeDropdown.remove();
                this.activeDropdown = null;
                this._activeDropdownButton = null;
            }
        }

        /**
         * Show settings popup for API management
         */
        showSettingsPopup() {
            this.closeActiveDropdown();
            
            const overlay = document.createElement('div');
            overlay.className = 'disposal-popup-overlay';

            const popup = document.createElement('div');
            popup.className = 'disposal-settings-popup';

            // ═══════════════════════════════════════════════════════════════
            // HEADER WITH TABS
            // ═══════════════════════════════════════════════════════════════
            const header = document.createElement('div');
            header.className = 'disposal-settings-popup-header';

            const title = document.createElement('div');
            title.className = 'disposal-settings-popup-title';
            title.textContent = 'Settings';
            header.appendChild(title);

            const tabs = document.createElement('div');
            tabs.className = 'disposal-settings-tabs';

            const generalTab = document.createElement('button');
            generalTab.className = 'disposal-settings-tab active';
            generalTab.textContent = 'General';

            const legendTab = document.createElement('button');
            legendTab.className = 'disposal-settings-tab';
            legendTab.textContent = 'Legend';

            tabs.appendChild(generalTab);
            tabs.appendChild(legendTab);
            header.appendChild(tabs);
            popup.appendChild(header);

            // ═══════════════════════════════════════════════════════════════
            // VIEWS CONTAINER (fixed size, internal scroll)
            // ═══════════════════════════════════════════════════════════════
            const viewsContainer = document.createElement('div');
            viewsContainer.className = 'disposal-settings-views-container';

            const generalView = document.createElement('div');
            generalView.className = 'disposal-settings-view active';

            const legendView = document.createElement('div');
            legendView.className = 'disposal-settings-view';

            // Tab switching
            const switchView = (isGeneral) => {
                generalTab.classList.toggle('active', isGeneral);
                legendTab.classList.toggle('active', !isGeneral);
                generalView.classList.toggle('active', isGeneral);
                legendView.classList.toggle('active', !isGeneral);
            };

            generalTab.addEventListener('click', () => switchView(true));
            legendTab.addEventListener('click', () => switchView(false));

            // ═══════════════════════════════════════════════════════════════
            // GENERAL VIEW CONTENT
            // ═══════════════════════════════════════════════════════════════
            
            // API Key section
            const apiSection = document.createElement('div');
            apiSection.className = 'disposal-settings-popup-section';

            const apiLabel = document.createElement('div');
            apiLabel.className = 'disposal-settings-popup-label';
            apiLabel.textContent = 'API Key';
            apiSection.appendChild(apiLabel);

            const apiKey = TornAPI.getKey();
            const apiValue = document.createElement('div');
            apiValue.className = 'disposal-settings-popup-value';
            if (apiKey) {
                const masked = '•'.repeat(apiKey.length - 4) + apiKey.slice(-4);
                apiValue.textContent = masked;
            } else {
                apiValue.textContent = 'Not configured';
                apiValue.style.opacity = '0.5';
            }
            apiSection.appendChild(apiValue);

            const apiButtons = document.createElement('div');
            apiButtons.className = 'disposal-settings-popup-buttons';

            const changeBtn = document.createElement('button');
            changeBtn.className = 'disposal-settings-popup-button primary';
            changeBtn.textContent = apiKey ? 'Change Key' : 'Add Key';
            changeBtn.addEventListener('click', () => {
                const newKey = prompt('Enter your Torn API key:', apiKey || '');
                if (newKey !== null && newKey.trim() !== '') {
                    TornAPI.setKey(newKey.trim());
                    this.closeSettingsPopup(overlay);
                    if (this.currentMode === 'profitability' || this.currentMode === 'expected') {
                        ProfitabilityCalculator.forceRefresh();
                    }
                }
            });
            apiButtons.appendChild(changeBtn);

            if (apiKey) {
                const removeBtn = document.createElement('button');
                removeBtn.className = 'disposal-settings-popup-button';
                removeBtn.textContent = 'Remove Key';
                removeBtn.addEventListener('click', () => {
                    if (confirm('Remove API key? Profitability modes will be disabled.')) {
                        TornAPI.setKey('');
                        this.closeSettingsPopup(overlay);
                        if (this.currentMode === 'profitability' || this.currentMode === 'expected') {
                            this.currentMode = 'conservative';
                            GM_setValue('disposalMode', 'conservative');
                            this.percentileCache.compute('conservative');
                            this.updateToggleButtons();
                            this.applyColors();
                        }
                    }
                });
                apiButtons.appendChild(removeBtn);
            }

            apiSection.appendChild(apiButtons);
            generalView.appendChild(apiSection);

            // Display Modes section
            const modesSection = document.createElement('div');
            modesSection.className = 'disposal-settings-popup-section';
            
            const modesLabel = document.createElement('div');
            modesLabel.className = 'disposal-settings-popup-label';
            modesLabel.textContent = 'Display Modes';
            modesSection.appendChild(modesLabel);
            
            const modesHelp = document.createElement('div');
            modesHelp.className = 'disposal-settings-popup-help';
            modesHelp.style.lineHeight = '1.5';
            modesHelp.innerHTML = `
                <strong style="display: block; margin-top: 4px; margin-bottom: 3px; font-size: 12px;">Reliability Modes</strong>
                <div style="margin-bottom: 8px; font-size: 10px; color: rgba(255,255,255,0.65);">
                    Methods that evaluate how likely it is for an action to succeed.
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong style="font-size: 11px;">🌈 Optimistic</strong><br>
                    <span style="font-size: 10px; color: rgba(255,255,255,0.75);">
                        Raw success rate with no correction. Small samples may appear better.
                    </span><br>
                    <em style="font-size: 9px; color: rgba(255,255,255,0.55); font-style: italic;">
                        "Best possible outcome, even with limited data."
                    </em>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <strong style="font-size: 11px;">🛡️ Conservative</strong><br>
                    <span style="font-size: 10px; color: rgba(255,255,255,0.75);">
                        Wilson lower bound. Statistically reliable, penalizes low samples.
                    </span><br>
                    <em style="font-size: 9px; color: rgba(255,255,255,0.55); font-style: italic;">
                        "Most reliable and safest chance of success."
                    </em>
                </div>
                
                <div style="border-top: 1px solid rgba(255,255,255,0.1); margin: 8px 0;"></div>
                
                <strong style="display: block; margin-top: 4px; margin-bottom: 3px; font-size: 12px;">Profitability Modes</strong>
                <div style="margin-bottom: 8px; font-size: 10px; color: rgba(255,255,255,0.65);">
                    Methods that evaluate how much profit an action is expected to generate.
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong style="font-size: 11px;">💰 Efficiency</strong><br>
                    <span style="font-size: 10px; color: rgba(255,255,255,0.75);">
                        Profit per nerve using actual costs, ignores success rate.
                    </span><br>
                    <em style="font-size: 9px; color: rgba(255,255,255,0.55); font-style: italic;">
                        "Highest profit per nerve, ignoring success rate."
                    </em>
                </div>
                
                <div style="margin-bottom: 8px;">
                    <strong style="font-size: 11px;">💵 Expected Efficiency</strong><br>
                    <span style="font-size: 10px; color: rgba(255,255,255,0.75);">
                        Expected profit per nerve: (successRate × income) − cost.
                    </span><br>
                    <em style="font-size: 9px; color: rgba(255,255,255,0.55); font-style: italic;">
                        "Maximize average profit considering both outcomes."
                    </em>
                </div>
            `;
            modesSection.appendChild(modesHelp);
            generalView.appendChild(modesSection);

            // Mobile tip
            if (this.isMobileDevice()) {
                const helpSection = document.createElement('div');
                helpSection.className = 'disposal-settings-popup-help';
                helpSection.style.marginTop = '8px';
                helpSection.innerHTML = `<strong>Tip:</strong> Long-press mode buttons to customize slots`;
                generalView.appendChild(helpSection);
            }

            // ======================================================================
// Legend view content (Color Scale, Border Styles, Summary)
// Updated icons are 32×32 with corrected viewBox and stroke alignment.
// ======================================================================

// ----------------------------
// Color Scale Section
// ----------------------------
const colorSection = document.createElement('div');
colorSection.className = 'disposal-legend-section';
colorSection.innerHTML = `
    <div class="disposal-legend-title">Color Scale (Global Percentiles)</div>
    <div class="disposal-legend-description">
        Colors show how strong a method is <strong>globally</strong>, compared to all other methods.<br>
Meaning depends on the active method type:
    <ul>
    <li><strong>Success modes:</strong> Safe → Dangerous</li>
    <li><strong>Money modes:</strong> Very high profit → Very low profit</li>
</ul>
    </div>

    <div class="disposal-legend-item">
        <svg width="32" height="32">
            <circle cx="16" cy="16" r="12" stroke="#1A9850" stroke-width="3" fill="none"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Safe / Very high profit</span>
            <span class="disposal-legend-meaning">— Top 20%</span>
        </div>
    </div>

    <div class="disposal-legend-item">
        <svg width="32" height="32">
            <circle cx="16" cy="16" r="12" stroke="#8CCF5E" stroke-width="3" fill="none"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Moderate / High profit</span>
            <span class="disposal-legend-meaning">— 60–80%</span>
        </div>
    </div>

    <div class="disposal-legend-item">
        <svg width="32" height="32">
            <circle cx="16" cy="16" r="12" stroke="#F2C746" stroke-width="3" fill="none"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Uncertain / Moderate profit</span>
            <span class="disposal-legend-meaning">— 40–60%</span>
        </div>
    </div>

    <div class="disposal-legend-item">
        <svg width="32" height="32">
            <circle cx="16" cy="16" r="12" stroke="#E85C3A" stroke-width="3" fill="none"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Risky / Low profit</span>
            <span class="disposal-legend-meaning">— 20–40%</span>
        </div>
    </div>

    <div class="disposal-legend-item">
        <svg width="32" height="32">
            <circle cx="16" cy="16" r="12" stroke="#C62828" stroke-width="3" fill="none"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Dangerous / Very low profit</span>
            <span class="disposal-legend-meaning">— Bottom 20%</span>
        </div>
    </div>
    <p><em>(Color represents relative strength, not whether the value is positive or negative.)</em></p>

`;
legendView.appendChild(colorSection);

// Section divider
legendView.appendChild(document.createElement('div')).className = 'disposal-legend-divider';


// ----------------------------
// Border Styles Section
// ----------------------------
const borderSection = document.createElement('div');
borderSection.className = 'disposal-legend-section';
borderSection.innerHTML = `
    <div class="disposal-legend-title">Border Styles (Per-Job Ranking)</div>
    <div class="disposal-legend-description">
        Borders indicate how the method performs <strong>within this specific job</strong>,<br>
and whether its expected value is <strong>negative</strong> (profit modes only).
    </div>

    <!-- Double Solid (best performer) -->
    <div class="disposal-legend-item">
        <svg width="32" height="32" viewBox="-2 -2 36 36">
            <circle cx="16" cy="16" r="13" stroke="#1A9850" stroke-width="2" fill="none"/>
            <circle cx="16" cy="16" r="9"  stroke="#1A9850" stroke-width="2" fill="none"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Double Solid</span>
            <span class="disposal-legend-meaning">— Best method for this job</span>
        </div>
    </div>

    <!-- Double Dashed (worst) -->
    <div class="disposal-legend-item">
        <svg width="32" height="32" viewBox="-2 -2 36 36">
            <circle cx="16" cy="16" r="13" stroke="#C62828" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
            <circle cx="16" cy="16" r="9"  stroke="#C62828" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Double Dashed</span>
            <span class="disposal-legend-meaning">— Worst method for this job</span>
        </div>
    </div>

    <!-- Single Dashed (negative value) -->
    <div class="disposal-legend-item">
        <svg width="32" height="32" viewBox="-2 -2 36 36">
            <circle cx="16" cy="16" r="13" stroke="#E85C3A" stroke-width="2" fill="none" stroke-dasharray="4 4"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Single Dashed</span>
            <span class="disposal-legend-meaning">— Negative expected value <em>(profit methods only)</em></span>
        </div>
    </div>

    <!-- Single Solid (positive, not top-ranked) -->
    <div class="disposal-legend-item">
        <svg width="32" height="32" viewBox="-2 -2 36 36">
            <circle cx="16" cy="16" r="13" stroke="#888" stroke-width="2" fill="none"/>
        </svg>
        <div>
            <span class="disposal-legend-label">Single Solid</span>
            <span class="disposal-legend-meaning">— Positive value, but not best or worst</span>
        </div>
    </div>
`;
legendView.appendChild(borderSection);

// Section divider
legendView.appendChild(document.createElement('div')).className = 'disposal-legend-divider';


// ----------------------------
// Summary Section
// ----------------------------
const summary = document.createElement('div');
summary.className = 'disposal-legend-summary';
summary.innerHTML = `
    <strong>Color</strong> = global performance (vs all methods)<br>
    <strong>Border</strong> = local ranking (within job only)
`;
legendView.appendChild(summary);

            // Add views to container
            viewsContainer.appendChild(generalView);
            viewsContainer.appendChild(legendView);
            popup.appendChild(viewsContainer);

            // ═══════════════════════════════════════════════════════════════
            // FOOTER (Close button)
            // ═══════════════════════════════════════════════════════════════
            const footer = document.createElement('div');
            footer.className = 'disposal-settings-footer';

            const closeBtn = document.createElement('button');
            closeBtn.className = 'disposal-settings-popup-button';
            closeBtn.textContent = 'Close';
            closeBtn.style.width = '100%';
            closeBtn.addEventListener('click', () => {
                this.closeSettingsPopup(overlay);
            });
            footer.appendChild(closeBtn);
            popup.appendChild(footer);

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeSettingsPopup(overlay);
                }
            });

            document.body.appendChild(overlay);
            document.body.appendChild(popup);
            
            // ═══════════════════════════════════════════════════════════════
            // DYNAMIC HEIGHT CALCULATION (WebView-optimized)
            // ═══════════════════════════════════════════════════════════════
            // Rule: height = min(content height, available viewport)
            // This ensures dialog shows all content if it fits, or fills
            // available space if content is too tall.
            requestAnimationFrame(() => {
                // Get available viewport (with safe margins for WebView/TornPDA)
                // TornPDA has top bar (~100px) and bottom bar (~80px) that eat into viewport
                const viewportHeight = window.innerHeight;
                const safeMargin = 180; // generous margin for TornPDA chrome
                const availableHeight = viewportHeight - safeMargin;
                
                // Measure content heights
                // Temporarily make views visible and remove absolute positioning to measure
                const originalGeneralStyle = generalView.style.cssText;
                const originalLegendStyle = legendView.style.cssText;
                
                generalView.style.cssText = 'position: static; visibility: visible; opacity: 1;';
                legendView.style.cssText = 'position: static; visibility: visible; opacity: 1;';
                
                const generalContentHeight = generalView.scrollHeight;
                const legendContentHeight = legendView.scrollHeight;
                
                // Restore original styles
                generalView.style.cssText = originalGeneralStyle;
                legendView.style.cssText = originalLegendStyle;
                
                // Use the taller of the two views
                const maxContentHeight = Math.max(generalContentHeight, legendContentHeight);
                
                // Get header and footer heights
                const headerHeight = header.offsetHeight || 50;
                const footerHeight = footer.offsetHeight || 50;
                const padding = 32; // popup padding
                const chromeHeight = headerHeight + footerHeight + padding;
                
                // Total height needed for content
                const totalNeeded = maxContentHeight + chromeHeight;
                
                // Final height: min(content needed, available space)
                const finalHeight = Math.min(totalNeeded, availableHeight);
                
                // Apply to popup
                popup.style.height = `${finalHeight}px`;
                
                // Calculate views container height
                const viewsHeight = finalHeight - chromeHeight;
                viewsContainer.style.height = `${viewsHeight}px`;
            });
        }

        /**
         * Close settings popup
         */
        closeSettingsPopup(overlay) {
            if (overlay && overlay.parentElement) {
                overlay.remove();
            }
            const popup = document.querySelector('.disposal-settings-popup');
            if (popup) {
                popup.remove();
            }
        }

        /**
         * Update toggle button styles to reflect current mode selection.
         * 
         * This function reads state dynamically rather than relying on closures,
         * ensuring correct behavior even after dropdown mode changes.
         * 
         * Hover handlers are set up to also read state dynamically, preventing
         * stale closure issues where an old isActive value would cause incorrect
         * background colors on hover.
         */
        /**
         * Updates visual state of all toggle buttons to reflect current mode.
         * Applies active glow and background to the selected mode button.
         */
        updateToggleButtons() {
            this.toggleButtons.forEach(button => {
                const buttonMode = button.dataset.mode;
                if (!buttonMode) return;

                // For mobile slot buttons, active state is when slot's mode matches currentMode
                const slotId = button.dataset.slot;
                let isActive;
                
                if (slotId) {
                    // Mobile: slot is active when its assigned mode is the current mode
                    isActive = (this.slots[slotId] === this.currentMode);
                } else {
                    // Desktop: button is active when its mode is the current mode
                    isActive = (this.currentMode === buttonMode);
                }

                // Variant C — Hybrid Outline Glow for active state
                button.style.background = isActive 
                    ? 'rgba(149,255,149,0.12)' 
                    : 'rgba(255,255,255,0.03)';
                
                if (isActive) {
                    button.style.boxShadow = 'inset 0 0 3px rgba(149,255,149,0.35), 0 0 3px rgba(149,255,149,0.25)';
                    button.style.outline = '1px solid rgba(149,255,149,0.35)';
                    button.style.outlineOffset = '-2px';
                } else {
                    button.style.boxShadow = 'none';
                    button.style.outline = 'none';
                }
            });
        }

        // ==================== DOM MUTATION OBSERVER ====================
        
        /**
         * Sets up MutationObserver for dynamic content.
         * 
         * Torn's UI dynamically loads and modifies crime options.
         * This observer detects:
         *   1. New crime options being added (childList)
         *   2. Method picker expand/collapse (class changes)
         * 
         * Uses debounced callback for batch updates to prevent
         * excessive reprocessing during rapid DOM changes.
         */
        setupObserver() {
            if (this.observer) this.observer.disconnect();
            
            // Debounced apply for new nodes (batch updates)
            const debouncedApply = debounce(() => {
                if (!UIOrchestrator.isProcessing() && this.isOnDisposalPage) {
                    this.applyColors();
                }
            }, CONFIG.observer.debounceDelay);
            
            // Immediate apply for expand/collapse (no debounce for responsiveness)
            const immediateApply = () => {
                if (!UIOrchestrator.isProcessing() && this.isOnDisposalPage) {
                    this.applyColors();
                }
            };

            this.observer = new MutationObserver((mutations) => {
                if (!this.isOnDisposalPage) return;
                
                for (const mutation of mutations) {
                    // Handle new nodes being added (lazy loading)
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && (
                                node.classList?.contains('crime-option') ||
                                node.classList?.contains('crimeOption___LP90y') ||
                                node.querySelector?.('[class*="crimeOption"]')
                            )) {
                                const buttons = node.querySelectorAll('[class*="methodButton"]');
                                buttons.forEach(btn => ElementStyler.clear(btn));
                                
                                debouncedApply();
                                return;
                            }
                        }
                    }
                    
                    // Handle class changes on methodPicker (expand/collapse)
                    // applyColors() already handles which buttons to style based on expand state
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        const target = mutation.target;
                        if (target.className.includes('methodPicker')) {
                            immediateApply();
                            return;
                        }
                    }
                }
            });

            const targetNode = document.querySelector('[class*="disposal-root"]') || 
                              document.querySelector('.disposal-root') || 
                              document.body;
            
            this.observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }

        // NOTE: findCrimeOptions, getCrimeType, findMethodButtons, getMethodName, 
        // isTabletPreviewButton, cleanupButtonStyles moved to RenderEngine module
        // (ButtonMapper and ElementStyler)

        /**
         * Applies colors to disposal method buttons using RenderEngine pipeline.
         * 
         * Delegates to UIOrchestrator for:
         *   - Button mapping
         *   - Style computation
         *   - Deterministic style application
         *   - Tooltip generation
         */
        applyColors() {
            const self = this;
            
            const result = UIOrchestrator.render({
                mode: this.currentMode,
                percentileCache: this.percentileCache,
                observer: this.observer,  // For observer safety (pause/resume)
                onButtonProcessed: (button) => {
                    // Add click handler for re-render after button click
                    button.addEventListener('click', () => {
                        setTimeout(() => self.applyColors(), 200);
                    });
                }
            });

            if (result.processed > 0 || Config.debug) {
                log(`Applied ${result.processed} (${this.currentMode})` + 
                    (result.skipped ? ` [${result.skipped} skipped]` : '') +
                    (result.reason ? ` [${result.reason}]` : ''));
            }
        }

        /**
         * Cleanup method for page unload.
         * Disconnects observer to prevent memory leaks.
         */
        destroy() {
            if (this.observer) this.observer.disconnect();
            UIOrchestrator.reset();
            log('Controller destroyed');
        }
    }

    // Export Controller class
    Disposal.Controller = DisposalEnhancer;
    // --- Module: Controller END ---

    // ==================== INITIALIZATION ====================
    /**
     * Bootstrap the application.
     * Creates a single DisposalEnhancer instance and exposes it globally.
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.disposalEnhancer = new DisposalEnhancer();
        });
    } else {
        window.disposalEnhancer = new DisposalEnhancer();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.disposalEnhancer) {
            window.disposalEnhancer.destroy();
        }
    });

    // --- Module: Debug START ---
    /**
     * Debug module provides internal inspection tools.
     * 
     * Access via: window.disposalDebug
     * 
     * Features:
     *   - Method analysis (colors, scores, borders)
     *   - Success rate inspection
     *   - Profitability calculations
     *   - Cache statistics
     *   - Data export
     */

    // ==================== DEBUG INTERFACE ====================
    window.disposalDebug = (() => {
        /**
         * Builds complete dataset with all calculated metrics for each method
         * @returns {Array|null} Array of method objects with complete metrics
         */
        const getData = () => {
            const enhancer = window.disposalEnhancer;
            if (!enhancer) {
                console.warn('[Debug] DisposalEnhancer not initialized yet');
                return null;
            }
            
            const cache = enhancer.percentileCache;
            const methods = [];
            
            // Build complete dataset for all methods
            for (const [job, jobMethods] of Object.entries(SUCCESS_RATES)) {
                for (const [method, data] of Object.entries(jobMethods)) {
                    const methodData = {
                        job,
                        method,
                        success: data.success,
                        samples: data.samples,
                        nerve: data.nerve
                    };
                    
                    // Add Wilson bounds
                    methodData.wilsonLB = getWilsonLowerBound(data.success, data.samples);
                    
                    // Add cached data for all modes
                    ['conservative', 'optimistic', 'profitability', 'expected'].forEach(mode => {
                        // Temporarily compute cache for this mode if needed
                        const currentMode = cache.mode;
                        if (cache.mode !== mode) {
                            cache.compute(mode);
                        }
                        
                        const cached = cache.get(job, method);
                        if (cached) {
                            methodData[`value_${mode}`] = cached.value;
                            methodData[`percentile_${mode}`] = cached.percentile;
                            methodData[`color_${mode}`] = cached.color;
                            methodData[`border_${mode}`] = cached.borderClass;
                        }
                        
                        // Restore original mode
                        if (currentMode && currentMode !== mode) {
                            cache.compute(currentMode);
                        }
                    });
                    
                    // Add profitability data if available
                    if (ProfitabilityCalculator.initialized) {
                        const profitData = ProfitabilityCalculator.profitabilityData.find(
                            d => d.jobType === job && d.methodName === method
                        );
                        if (profitData) {
                            methodData.income = profitData.income;
                            methodData.cost = profitData.cost;
                            methodData.profit = profitData.profit;
                            methodData.profitPerNerve = profitData.profitPerNerve;
                            methodData.consumables = profitData.consumables;
                        }
                        
                        const expectedData = ProfitabilityCalculator.expectedData.find(
                            d => d.jobType === job && d.methodName === method
                        );
                        if (expectedData) {
                            methodData.expectedProfit = expectedData.profit;
                            methodData.expectedProfitPerNerve = expectedData.profitPerNerve;
                        }
                    }
                    
                    methods.push(methodData);
                }
            }
            
            return methods;
        };
        
        return {
            /**
             * Get complete metrics for a specific disposal method
             * @param {string} job - Job type (e.g., "General Waste", "Murder Weapon")
             * @param {string} method - Method name (e.g., "Burn", "Dissolve")
             * @returns {Object|null} Complete method data with all calculated metrics
             * @example
             * disposalDebug.getMethod('Dead Body', 'Burn');
             */
            getMethod(job, method) {
                const data = getData();
                if (!data) return null;
                const result = data.find(m => m.job === job && m.method === method);
                if (!result) {
                    console.warn(`[Debug] Method not found: ${job} - ${method}`);
                }
                return result;
            },
            
            /**
             * Get all methods for a specific job with rankings
             * @param {string} job - Job type
             * @returns {Array|null} All methods for the job, sorted by current mode value
             * @example
             * disposalDebug.getJob('Murder Weapon');
             */
            getJob(job) {
                const data = getData();
                if (!data) return null;
                
                const jobMethods = data.filter(m => m.job === job);
                if (jobMethods.length === 0) {
                    console.warn(`[Debug] Job not found: ${job}`);
                    return null;
                }
                
                const enhancer = window.disposalEnhancer;
                const mode = enhancer ? enhancer.currentMode : 'conservative';
                
                return jobMethods.sort((a, b) => {
                    const aVal = a[`value_${mode}`] || 0;
                    const bVal = b[`value_${mode}`] || 0;
                    return bVal - aVal;
                });
            },
            
            /**
             * Get all methods with complete dataset across all modes
             * @returns {Array|null} Complete dataset for all methods
             * @example
             * const allData = disposalDebug.getAll();
             * console.table(allData);
             */
            getAll() {
                return getData();
            },
            
            /**
             * Get global ranking for a specific mode
             * @param {string} mode - Mode name ('conservative', 'optimistic', 'profitability', 'expected')
             * @returns {Array|null} Methods sorted by mode score (best to worst)
             * @example
             * disposalDebug.getRanking('profitability');
             */
            getRanking(mode) {
                const validModes = ['conservative', 'optimistic', 'profitability', 'expected'];
                if (!validModes.includes(mode)) {
                    console.error(`[Debug] Invalid mode: ${mode}. Valid modes: ${validModes.join(', ')}`);
                    return null;
                }
                
                const data = getData();
                if (!data) return null;
                
                return data
                    .map(m => ({
                        job: m.job,
                        method: m.method,
                        value: m[`value_${mode}`],
                        percentile: m[`percentile_${mode}`],
                        color: m[`color_${mode}`],
                        border: m[`border_${mode}`]
                    }))
                    .sort((a, b) => (b.value || 0) - (a.value || 0));
            },
            
            /**
             * Force full recalculation of cache without page reload
             * Useful after manual data changes or for testing
             * @returns {boolean} Success status
             * @example
             * disposalDebug.refresh();
             */
            refresh() {
                const enhancer = window.disposalEnhancer;
                if (!enhancer) {
                    console.error('[Debug] DisposalEnhancer not initialized');
                    return false;
                }
                
                enhancer.percentileCache.invalidate();
                enhancer.percentileCache.compute(enhancer.currentMode);
                enhancer.applyColors();
                
                log('[Debug] Cache refreshed and colors reapplied');
                return true;
            },
            
            /**
             * Export complete dataset as JSON for external analysis
             * @returns {string|null} JSON string
             * @example
             * const json = disposalDebug.exportJSON();
             * console.log(json);
             * // Copy to clipboard for Excel/Python analysis
             */
            exportJSON() {
                const data = getData();
                if (!data) return null;
                return JSON.stringify(data, null, 2);
            },
            
            /**
             * Compare two methods across all modes
             * @param {string} job1 - First job type
             * @param {string} method1 - First method name
             * @param {string} job2 - Second job type
             * @param {string} method2 - Second method name
             * @returns {Object|null} Comparison table showing winner for each mode
             * @example
             * disposalDebug.compare('Dead Body', 'Burn', 'Body Part', 'Dissolve');
             */
            compare(job1, method1, job2, method2) {
                const m1 = this.getMethod(job1, method1);
                const m2 = this.getMethod(job2, method2);
                
                if (!m1 || !m2) {
                    console.error('[Debug] One or both methods not found');
                    return null;
                }
                
                const comparison = {
                    conservative: {
                        [`${job1} ${method1}`]: m1.value_conservative,
                        [`${job2} ${method2}`]: m2.value_conservative,
                        winner: (m1.value_conservative || 0) > (m2.value_conservative || 0) ? 
                            `${job1} ${method1}` : `${job2} ${method2}`
                    },
                    optimistic: {
                        [`${job1} ${method1}`]: m1.value_optimistic,
                        [`${job2} ${method2}`]: m2.value_optimistic,
                        winner: (m1.value_optimistic || 0) > (m2.value_optimistic || 0) ? 
                            `${job1} ${method1}` : `${job2} ${method2}`
                    },
                    profitability: {
                        [`${job1} ${method1}`]: m1.profitPerNerve,
                        [`${job2} ${method2}`]: m2.profitPerNerve,
                        winner: (m1.profitPerNerve || 0) > (m2.profitPerNerve || 0) ? 
                            `${job1} ${method1}` : `${job2} ${method2}`
                    },
                    expected: {
                        [`${job1} ${method1}`]: m1.expectedProfitPerNerve,
                        [`${job2} ${method2}`]: m2.expectedProfitPerNerve,
                        winner: (m1.expectedProfitPerNerve || 0) > (m2.expectedProfitPerNerve || 0) ? 
                            `${job1} ${method1}` : `${job2} ${method2}`
                    }
                };
                
                return comparison;
            },
            
            /**
             * Get cache statistics and current state
             * @returns {Object|null} Cache stats including size, mode, and available modes
             * @example
             * disposalDebug.getCacheStats();
             */
            getCacheStats() {
                const enhancer = window.disposalEnhancer;
                if (!enhancer) {
                    console.error('[Debug] DisposalEnhancer not initialized');
                    return null;
                }
                
                return {
                    size: enhancer.percentileCache.cache.size,
                    currentMode: enhancer.percentileCache.mode,
                    activeUIMode: enhancer.currentMode,
                    availableModes: ['conservative', 'optimistic', 'profitability', 'expected'],
                    profitabilityInitialized: ProfitabilityCalculator.initialized
                };
            },
            
            /**
             * Get StateEngine snapshot (all centralized state)
             * @returns {Object} Complete state snapshot
             * @example
             * disposalDebug.getState();
             */
            getState() {
                const state = StateEngine.snapshot();
                console.log('[Debug] Current State:', JSON.stringify(state, null, 2));
                return state;
            },
            
            /**
             * Get best and worst methods for each job in current mode
             * @returns {Object|null} Object with job names as keys, each containing best/worst methods
             * @example
             * disposalDebug.getBestWorst();
             */
            getBestWorst() {
                const data = getData();
                if (!data) return null;
                
                const enhancer = window.disposalEnhancer;
                const mode = enhancer ? enhancer.currentMode : 'conservative';
                const result = {};
                
                const jobs = [...new Set(data.map(m => m.job))];
                jobs.forEach(job => {
                    const jobMethods = data.filter(m => m.job === job);
                    const sorted = jobMethods.sort((a, b) => {
                        const aVal = a[`value_${mode}`] || 0;
                        const bVal = b[`value_${mode}`] || 0;
                        return bVal - aVal;
                    });
                    
                    if (sorted.length > 0) {
                        result[job] = {
                            best: {
                                method: sorted[0].method,
                                value: sorted[0][`value_${mode}`]
                            },
                            worst: {
                                method: sorted[sorted.length - 1].method,
                                value: sorted[sorted.length - 1][`value_${mode}`]
                            }
                        };
                    }
                });
                
                return result;
            },
            
            /**
             * Display help information with available commands
             * @example
             * disposalDebug.help();
             */
            help() {
                console.log(`
=== Disposal Enhanced Debug Interface ===

Available Commands:
  
  disposalDebug.getMethod(job, method)
    Get complete metrics for a specific method
    Example: disposalDebug.getMethod('Dead Body', 'Burn')
  
  disposalDebug.getJob(job)
    Get all methods for a job, sorted by current mode
    Example: disposalDebug.getJob('Murder Weapon')
  
  disposalDebug.getAll()
    Get complete dataset for all methods
    Example: console.table(disposalDebug.getAll())
  
  disposalDebug.getRanking(mode)
    Get global ranking for a mode
    Modes: 'conservative', 'optimistic', 'profitability', 'expected'
    Example: disposalDebug.getRanking('profitability')
  
  disposalDebug.compare(job1, method1, job2, method2)
    Compare two methods across all modes
    Example: disposalDebug.compare('Dead Body', 'Burn', 'Body Part', 'Dissolve')
  
  disposalDebug.getBestWorst()
    Get best and worst methods for each job in current mode
  
  disposalDebug.getCacheStats()
    Get cache statistics and current state
  
  disposalDebug.getState()
    Get StateEngine snapshot (all centralized state)
  
  disposalDebug.testCache()
    Test internal cache systems (CacheManager, DOMCache)
  
  disposalDebug.refresh()
    Force cache recalculation

  disposalDebug.exportJSON()
    Export complete dataset as JSON

=== DEBUG OVERLAY ===

  disposalDebug.showOverlay()
    Show debug info overlay on all buttons (one-shot)
  
  disposalDebug.hideOverlay()
    Hide debug overlays
  
  disposalDebug.toggleOverlay()
    Toggle overlay on/off (one-shot)
  
  disposalDebug.overlay.enable()
    Enable auto-overlay during render (persists until disabled)
  
  disposalDebug.overlay.disable()
    Disable auto-overlay
  
  disposalDebug.verifyRender()
    Verify render idempotency (renders twice, compares results)

  disposalDebug.help()
    Show this help message
                `);
            },
            
            /**
             * Test internal cache systems
             * Tests CacheManager and DOMCache functionality
             * @returns {Object} Test results
             * @example
             * disposalDebug.testCache();
             */
            testCache() {
                const enhancer = window.disposalEnhancer;
                if (!enhancer) {
                    console.error('[Debug] DisposalEnhancer not initialized');
                    return null;
                }
                
                const results = {
                    domCache: {
                        exists: !!enhancer.domCache,
                        header: null,
                        headerTag: null
                    },
                    percentileCache: {
                        exists: !!enhancer.percentileCache,
                        size: 0,
                        mode: null
                    },
                    profitability: {
                        initialized: ProfitabilityCalculator.initialized,
                        hasData: false
                    }
                };
                
                // Test DOMCache
                if (enhancer.domCache) {
                    const header = enhancer.domCache.getHeader();
                    results.domCache.header = header !== null;
                    results.domCache.headerTag = header ? header.tagName : null;
                }
                
                // Test PercentileCache
                if (enhancer.percentileCache) {
                    results.percentileCache.size = enhancer.percentileCache.cache.size;
                    results.percentileCache.mode = enhancer.percentileCache.mode;
                }
                
                // Test ProfitabilityCalculator
                results.profitability.hasData = ProfitabilityCalculator.profitabilityData.length > 0;
                
                console.log('=== Cache Test Results ===');
                console.log('DOM Cache:', results.domCache);
                console.log('Percentile Cache:', results.percentileCache);
                console.log('Profitability:', results.profitability);
                
                return results;
            },
            
            /**
             * View raw price cache from storage
             * @returns {Object} Raw cache data
             */
            viewPriceCache() {
                const raw = GM_getValue('disposal_price_cache', null);
                if (!raw) {
                    console.log('=== Price Cache: EMPTY ===');
                    return null;
                }
                try {
                    const cache = JSON.parse(raw);
                    const age = cache.timestamp ? Math.round((Date.now() - cache.timestamp) / 1000 / 60) : 'unknown';
                    console.log('=== Price Cache ===');
                    console.log(`Version: ${cache.version || 'none'}`);
                    console.log(`Age: ${age} minutes`);
                    console.log(`Items: ${cache.prices ? Object.keys(cache.prices).length : 0}`);
                    if (cache.prices) {
                        const nonZero = Object.values(cache.prices).filter(p => p > 0).length;
                        console.log(`Non-zero prices: ${nonZero}`);
                    }
                    return cache;
                } catch (e) {
                    console.log('=== Price Cache: INVALID JSON ===');
                    console.log('Raw value:', raw);
                    return null;
                }
            },
            
            /**
             * Clear price cache to test fresh fetch
             */
            clearPriceCache() {
                GM_setValue('disposal_price_cache', '');
                GM_setValue('disposal_cache_time', 0);
                console.log('=== Price Cache CLEARED ===');
                console.log('Reload the page to test fresh API fetch');
            },
            
            /**
             * Simulate corrupted/empty cache to test error handling
             * @param {string} type - 'empty', 'invalid', 'old_format', 'zero_prices'
             */
            corruptPriceCache(type = 'empty') {
                let value;
                switch(type) {
                    case 'empty':
                        value = JSON.stringify({ version: 1, timestamp: Date.now(), prices: {} });
                        break;
                    case 'invalid':
                        value = 'not valid json {{{';
                        break;
                    case 'old_format':
                        // Simula il vecchio formato senza version/timestamp
                        value = JSON.stringify({ "396": 1000, "397": 2000 });
                        break;
                    case 'zero_prices':
                        value = JSON.stringify({ 
                            version: 1, 
                            timestamp: Date.now(), 
                            prices: { "396": 0, "397": 0, "398": 0 } 
                        });
                        break;
                    default:
                        console.log('Types: empty, invalid, old_format, zero_prices');
                        return;
                }
                GM_setValue('disposal_price_cache', value);
                console.log(`=== Price Cache set to "${type}" ===`);
                console.log('Reload the page to test how the script handles it');
            },
            
            /**
             * Force refresh prices from API (bypass cache)
             */
            async forceRefreshPrices() {
                console.log('=== Forcing price refresh ===');
                GM_setValue('disposal_price_cache', '');
                GM_setValue('disposal_cache_time', 0);
                const result = await ProfitabilityCalculator.initialize();
                console.log(result ? 'SUCCESS: Prices refreshed' : 'FAILED: Check console for errors');
                this.viewPriceCache();
            },
            
            // ==================== DEBUG OVERLAY MODE ====================
            
            /**
             * Shows debug overlay on all method buttons.
             * Displays percentile, mode, and color info directly on buttons.
             * 
             * @example
             * disposalDebug.showOverlay();
             */
            showOverlay() {
                const enhancer = window.disposalEnhancer;
                if (!enhancer) {
                    console.error('[Debug] DisposalEnhancer not initialized');
                    return;
                }
                
                // Remove existing overlays
                this.hideOverlay();
                
                // Get button map
                const buttonMap = ButtonMapper.map();
                if (!buttonMap.isComplete) {
                    console.error('[Debug] No buttons found');
                    return;
                }
                
                let count = 0;
                const mode = enhancer.currentMode;
                
                buttonMap.jobs.forEach(jobData => {
                    const { crimeType, buttons } = jobData;
                    
                    buttons.forEach(buttonInfo => {
                        const { node, methodName } = buttonInfo;
                        
                        // Get UIData for this button
                        const uiData = DataEngine.computeUIData(
                            crimeType, 
                            methodName, 
                            mode, 
                            enhancer.percentileCache
                        );
                        
                        if (!uiData) return;
                        
                        // Create overlay element
                        const overlay = document.createElement('div');
                        overlay.className = 'disposal-debug-overlay';
                        overlay.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            background: rgba(0,0,0,0.85);
                            color: #fff;
                            font-size: 9px;
                            font-family: monospace;
                            padding: 2px 4px;
                            pointer-events: none;
                            z-index: 9999;
                            line-height: 1.2;
                            border-radius: 3px 3px 0 0;
                        `;
                        
                        // Format overlay content
                        const pct = uiData.percentile !== undefined ? 
                            `P${Math.round(uiData.percentile * 100)}` : 'P??';
                        const color = uiData.colorKey || '??';
                        const border = uiData.borderClass || 'default';
                        
                        overlay.innerHTML = `
                            <div style="color: ${uiData.color}">${pct} ${color}</div>
                            <div style="opacity: 0.7">${border}</div>
                        `;
                        
                        // Make button position relative if not already
                        const currentPosition = window.getComputedStyle(node).position;
                        if (currentPosition === 'static') {
                            node.style.position = 'relative';
                            node.dataset.debugPositionChanged = 'true';
                        }
                        
                        node.appendChild(overlay);
                        count++;
                    });
                });
                
                console.log(`[Debug] Overlay shown on ${count} buttons`);
                console.log('[Debug] Legend: P=Percentile | Color | Border class');
                console.log('[Debug]   Percentile: ranking vs all methods (higher = better)');
            },
            
            /**
             * Hides debug overlays from all buttons.
             * 
             * @example
             * disposalDebug.hideOverlay();
             */
            hideOverlay() {
                const overlays = document.querySelectorAll('.disposal-debug-overlay');
                overlays.forEach(overlay => {
                    const parent = overlay.parentElement;
                    overlay.remove();
                    
                    // Restore original position if we changed it
                    if (parent && parent.dataset.debugPositionChanged === 'true') {
                        parent.style.position = '';
                        delete parent.dataset.debugPositionChanged;
                    }
                });
                
                if (overlays.length > 0) {
                    console.log(`[Debug] Removed ${overlays.length} overlays`);
                }
            },
            
            /**
             * Toggles debug overlay on/off.
             * 
             * @example
             * disposalDebug.toggleOverlay();
             */
            toggleOverlay() {
                const hasOverlay = document.querySelector('.disposal-debug-overlay');
                if (hasOverlay) {
                    this.hideOverlay();
                } else {
                    this.showOverlay();
                }
            },
            
            /**
             * Verifies render idempotency using SnapshotHash.
             * Renders twice and checks if results are identical.
             * 
             * @example
             * disposalDebug.verifyRender();
             */
            verifyRender() {
                const enhancer = window.disposalEnhancer;
                if (!enhancer) {
                    console.error('[Debug] DisposalEnhancer not initialized');
                    return null;
                }
                
                const buttonMap = ButtonMapper.map();
                if (!buttonMap.isComplete) {
                    console.error('[Debug] No buttons found');
                    return null;
                }
                
                // Get all button nodes
                const nodes = [];
                buttonMap.jobs.forEach(job => {
                    job.buttons.forEach(btn => nodes.push(btn.node));
                });
                
                console.log(`[Debug] Verifying idempotency on ${nodes.length} buttons...`);
                
                const result = SnapshotHash.verifyIdempotency(
                    () => enhancer.applyColors(),
                    nodes
                );
                
                if (result.isIdempotent) {
                    console.log('[Debug] ✅ Render is IDEMPOTENT');
                } else {
                    console.log('[Debug] ❌ Render is NOT idempotent!');
                    console.log('[Debug] Changes:', result.comparison);
                }
                
                return result;
            },
            
            /**
             * Access to DebugOverlay module for programmatic control.
             * 
             * @example
             * disposalDebug.overlay.enable();  // Enable auto-overlay during render
             * disposalDebug.overlay.disable(); // Disable auto-overlay
             * disposalDebug.overlay.toggle();  // Toggle state
             */
            overlay: DebugOverlay
        };
    })();

    // Export Debug module
    Disposal.Debug = window.disposalDebug;
    // --- Module: Debug END ---

    // ==================== FINAL EXPORTS ====================
    /**
     * Expose Disposal namespace globally for debugging and extension.
     */
    window.Disposal = Disposal;

    // Log availability
    log('Loaded v7.0.0 (Modular Architecture)');
    log('Debug interface available: window.disposalDebug');
    log('Module namespace available: window.Disposal');
    log('Type disposalDebug.help() for available commands');
})();
