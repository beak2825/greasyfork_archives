// ==UserScript==
// @name         Torn War Cache Value Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Calculate total cache value for ranked war payouts
// @author       swervelord
// @match        https://www.torn.com/war.php?*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/548771/Torn%20War%20Cache%20Value%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/548771/Torn%20War%20Cache%20Value%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cache types and their item IDs
    const CACHE_TYPES = {
        'Heavy Arms Cache': 1122,
        'Armor Cache': 1118,
        'Medium Arms Cache': 1121,
        'Melee Cache': 1119,
        'Small Arms Cache': 1120
    };

    // API endpoint for Torn Exchange
    const API_BASE = 'https://tornexchange.com/api/listings';

    // Cache for API results to avoid duplicate calls (with 5 minute expiry)
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

    // Global flag to prevent multiple executions
    let scriptExecuted = false;

    // Set to track processed text content to prevent duplicates
    const processedResults = new Set();

    /**
     * Get cached price with expiry check
     */
    function getCachedPrice(cacheType) {
        const cached = GM_getValue(`price_${cacheType}`, null);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < CACHE_EXPIRY) {
                return data.price;
            }
        }
        return null;
    }

    /**
     * Set cached price with timestamp
     */
    function setCachedPrice(cacheType, price) {
        const data = {
            price: price,
            timestamp: Date.now()
        };
        GM_setValue(`price_${cacheType}`, JSON.stringify(data));
    }

    /**
     * Fetch average price for a cache type
     */
    function fetchCachePrice(cacheType) {
        return new Promise((resolve) => {
            const itemId = CACHE_TYPES[cacheType];

            // Check cache first
            const cachedPrice = getCachedPrice(cacheType);
            if (cachedPrice !== null) {
                resolve(cachedPrice);
                return;
            }

            const url = `${API_BASE}?item_id=${itemId}&sort_by=price&order=desc&page=1`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.status === 'success' && data.data.listings) {
                            // Filter out fake listings (anything over $500M is likely fake)
                            const legitimateListings = data.data.listings.filter(listing => listing.price < 500000000);

                            if (legitimateListings.length >= 3) {
                                // Take top 3 legitimate listings and average them
                                const top3 = legitimateListings.slice(0, 3);
                                const average = top3.reduce((sum, listing) => sum + listing.price, 0) / 3;
                                const roundedAverage = Math.round(average);

                                setCachedPrice(cacheType, roundedAverage);
                                resolve(roundedAverage);
                            } else if (legitimateListings.length > 0) {
                                // If less than 3 legitimate listings, use what we have
                                const average = legitimateListings.reduce((sum, listing) => sum + listing.price, 0) / legitimateListings.length;
                                const roundedAverage = Math.round(average);

                                setCachedPrice(cacheType, roundedAverage);
                                resolve(roundedAverage);
                            } else {
                                resolve(0);
                            }
                        } else {
                            resolve(0);
                        }
                    } catch (error) {
                        resolve(0);
                    }
                },
                onerror: function(error) {
                    resolve(0);
                },
                ontimeout: function() {
                    resolve(0);
                }
            });
        });
    }

    /**
     * Parse cache quantities from faction result text
     */
    function parseCacheQuantities(text) {
        const caches = {};
        const cacheRegex = /(\d+)x\s+(Heavy Arms Cache|Armor Cache|Medium Arms Cache|Melee Cache|Small Arms Cache)/g;
        let match;

        while ((match = cacheRegex.exec(text)) !== null) {
            const quantity = parseInt(match[1]);
            const cacheType = match[2];
            caches[cacheType] = quantity;
        }

        return caches;
    }

    /**
     * Calculate total cache value for a faction
     */
    async function calculateTotalValue(caches) {
        let totalValue = 0;
        const pricePromises = [];

        // Fetch all prices concurrently
        for (const [cacheType, quantity] of Object.entries(caches)) {
            pricePromises.push(
                fetchCachePrice(cacheType).then(price => price * quantity)
            );
        }

        const results = await Promise.all(pricePromises);
        totalValue = results.reduce((sum, value) => sum + value, 0);

        return totalValue;
    }

    /**
     * Format number as currency
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Create a unique identifier for faction result text
     */
    function getResultIdentifier(text) {
        // Extract faction name and cache info for unique identification
        const factionMatch = text.match(/^([^<]+?)\s+ranked/);
        const cacheMatch = text.match(/(\d+x\s+(?:Heavy Arms Cache|Armor Cache|Medium Arms Cache|Melee Cache|Small Arms Cache)(?:,\s*)?)+/);

        if (factionMatch && cacheMatch) {
            return `${factionMatch[1].trim()}_${cacheMatch[0]}`;
        }
        return text.substring(0, 100); // fallback
    }

    /**
     * Process faction results and add cache value display
     */
    async function processFactionResults() {
        if (scriptExecuted) {
            return;
        }

        // Find all elements that contain faction result text
        const allElements = document.querySelectorAll('*');
        const factionResults = [];

        for (const element of allElements) {
            // Only check elements with direct text content (not nested)
            if (element.children.length === 0 || element.children.length === 1) {
                const text = element.textContent || element.innerHTML;

                if ((text.includes('ranked up from') || text.includes('ranked down from')) &&
                    text.includes('Cache')) {

                    const identifier = getResultIdentifier(text);

                    if (!processedResults.has(identifier)) {
                        factionResults.push({
                            element: element,
                            text: text,
                            identifier: identifier
                        });
                        processedResults.add(identifier);
                    }
                }
            }
        }

        for (const result of factionResults) {
            // Parse cache quantities from the text
            const caches = parseCacheQuantities(result.text);

            if (Object.keys(caches).length > 0) {
                try {
                    // Calculate total value
                    const totalValue = await calculateTotalValue(caches);

                    // Add the cache value directly after the original text with just a line break
                    const valueSpan = document.createElement('span');
                    valueSpan.style.cssText = `
                        color: #00E676;
                        font-weight: bold;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                        display: block;
                    `;
                    valueSpan.textContent = `Total Cache Value: ${formatCurrency(totalValue)}`;

                    result.element.appendChild(valueSpan);

                } catch (error) {
                    // Silently handle errors
                }
            }
        }

        // Mark script as executed and stop all future executions
        scriptExecuted = true;
    }

    /**
     * Initialize the script with one-time execution
     */
    function initialize() {
        // Reset execution flag on page load
        scriptExecuted = false;
        processedResults.clear();

        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(processFactionResults, 2000);
            });
        } else {
            // Page already loaded, wait a bit for dynamic content
            setTimeout(processFactionResults, 2000);
        }
    }

    // Initialize the script
    initialize();

})();