// ==UserScript==
// @name          Item Market Price Indicator
// @namespace     http://torn.com/
// @version       3.7
// @description   Shows price percentage indicators on Item Market listings relative to market value
// @author        srsbsns
// @match         *://www.torn.com/page.php?sid=ItemMarket*
// @match         *://www.torn.com/imarket.php*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @connect       api.torn.com
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/562318/Item%20Market%20Price%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/562318/Item%20Market%20Price%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // STORAGE KEYS & CONSTANTS
    // ============================================================================
    const S = {
        apiKey: 'im_api_key',
        catalog: 'im_catalog',
        catalogTs: 'im_catalog_ts'
    };

    const BASE = 'https://api.torn.com';

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================
    let catalog = null;
    let busy = false;
    let observer = null;
    let debounceTimer = null;
    let processedElements = new WeakSet(); // Track processed elements globally

    // ============================================================================
    // API KEY MANAGEMENT
    // ============================================================================
    let apiKey = GM_getValue(S.apiKey, '');
    if (!apiKey) {
        apiKey = prompt("Please enter your Torn API Key for Item Market Price Indicator:");
        if (apiKey) GM_setValue(S.apiKey, apiKey.trim());
    }

    const getApiKey = () => GM_getValue(S.apiKey, '');
    const setApiKey = v => GM_setValue(S.apiKey, String(v || '').trim());

    // ============================================================================
    // MENU COMMANDS
    // ============================================================================
    GM_registerMenuCommand('Set API key', () => {
        const v = prompt('Enter your Torn API key', getApiKey() || '');
        if (v !== null) {
            setApiKey(v);
            alert('API key saved. Refreshing catalog...');
            fetchCatalog(true);
        }
    });

    GM_registerMenuCommand('Refresh item catalog', () => {
        fetchCatalog(true).then(() => {
            alert('Catalog refreshed!');
            annotateMarket();
        });
    });

    // ============================================================================
    // STYLES
    // ============================================================================
    GM_addStyle(`
        /* Price percentage badge - ULTRA aggressive overrides */
        .imp-price-badge,
        .imp-price-badge.good,
        .imp-price-badge.high,
        .imp-main-badge,
        .imp-dropdown-badge {
            display: inline !important;
            font-weight: bold !important;
            margin-left: 4px !important;
            white-space: nowrap !important;
            background: none !important;
            background-color: transparent !important;
            background-image: none !important;
            border: none !important;
            border-width: 0 !important;
            border-style: none !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            outline: none !important;
            animation: none !important;
        }

        .imp-price-badge.good {
            color: #00A100 !important;
        }

        .imp-price-badge.high {
            color: #BA5959 !important;
        }

        /* Main listing price badge (larger) */
        .imp-main-badge {
            font-size: 11px !important;
        }

        /* Dropdown listing badges (smaller) */
        .imp-dropdown-badge {
            font-size: 10px !important;
        }
    `);

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    const sanitize = s => String(s || '').replace(/\(x?\d+\)$/i, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const num = v => Number(String(v ?? '').replace(/[^0-9.-]/g, '')) || 0;

    const JGet = (k) => {
        try {
            const v = GM_getValue(k, null);
            return v ? JSON.parse(v) : null;
        } catch {
            return null;
        }
    };
    const JSet = (k, o) => GM_setValue(k, JSON.stringify(o || null));

    async function xfetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: r => {
                    try {
                        const j = JSON.parse(r.responseText);
                        if (j?.error) return reject(new Error(j.error.error_desc || j.error.error));
                        resolve(j);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: e => reject(e)
            });
        });
    }

    // ============================================================================
    // CATALOG FETCH
    // ============================================================================
    async function fetchCatalog(force = false) {
        const cached = JGet(S.catalog);
        const ts = GM_getValue(S.catalogTs, 0);

        // Use cached catalog if less than 12 hours old
        if (!force && cached && (Date.now() - ts) < 12 * 3600 * 1000) {
            return cached;
        }

        const key = getApiKey();
        if (!key) {
            console.error('No API key set');
            return { byId: {}, byName: {} };
        }

        try {
            const data = await xfetch(`${BASE}/torn/?selections=items&key=${encodeURIComponent(key)}`);
            const items = data.items || {};
            const out = { byId: {}, byName: {} };

            for (const id in items) {
                const it = items[id];
                const rec = {
                    id: Number(id),
                    name: it.name,
                    mv: Number(it.market_value) || 0
                };
                out.byId[rec.id] = rec;
                out.byName[sanitize(it.name)] = rec;
            }

            JSet(S.catalog, out);
            GM_setValue(S.catalogTs, Date.now());
            console.log('Item Market Price Indicator: Catalog updated');
            return out;
        } catch (e) {
            console.error('Failed to fetch catalog:', e);
            return cached || { byId: {}, byName: {} };
        }
    }

    // ============================================================================
    // ITEM RESOLUTION
    // ============================================================================
    function resolveItemFromElement(element) {
        if (!catalog) return null;

        // Try to find item ID from image
        const img = element.querySelector('img[src*="/items/"], img[src*="/images/items/"]');
        if (img) {
            const match = img.src.match(/\/items\/(\d+)/);
            if (match && catalog.byId[match[1]]) {
                return catalog.byId[match[1]];
            }
        }

        // Try to find by item name
        const nameElement = element.querySelector('[class*="name"], [class*="title"], [class*="Name"], [class*="Title"]');
        if (nameElement) {
            const itemName = sanitize(nameElement.textContent);
            if (catalog.byName[itemName]) {
                return catalog.byName[itemName];
            }
        }

        return null;
    }

    // ============================================================================
    // BADGE CREATION
    // ============================================================================
    function createPriceBadge(price, marketValue, isMainListing = false) {
        if (!price || !marketValue || marketValue === 0) return null;

        const pctDiff = ((price - marketValue) / marketValue) * 100;

        // Don't create badges for tiny differences or exact matches
        if (Math.abs(pctDiff) < 0.5) return null;

        const badge = document.createElement('span');
        badge.className = isMainListing ? 'imp-price-badge imp-main-badge' : 'imp-price-badge imp-dropdown-badge';

        let displayText = '';
        let colorClass = '';

        if (pctDiff < 0) {
            // Below MV - Green (good to buy)
            displayText = `${Math.round(pctDiff)}%`;
            colorClass = 'good';
        } else if (pctDiff > 0) {
            // Above MV - Red (expensive)
            displayText = `+${Math.round(pctDiff)}%`;
            colorClass = 'high';
        } else {
            // Exactly at MV - Green (at market value is acceptable)
            displayText = `MV`;
            colorClass = 'good';
        }

        badge.classList.add(colorClass);
        badge.textContent = displayText;
        badge.title = `Market Value: $${marketValue.toLocaleString()}\nListing Price: $${price.toLocaleString()}`;

        return badge;
    }

    // ============================================================================
    // MAIN ANNOTATION LOGIC
    // ============================================================================
    async function annotateMarket() {
        if (busy) return;
        busy = true;

        // Disconnect observer while we work
        if (observer) observer.disconnect();

        try {
            // Skip if on add/edit listing screens
            const hash = location.hash || '';
            if (hash.includes('/addListing') || hash.includes('/viewListing')) {
                busy = false;
                if (observer) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
                return;
            }

            if (!catalog) {
                catalog = await fetchCatalog();
            }

            // Find all item cards on the market
            // Look for itemTile divs directly, or li elements that contain them
            const itemTiles = document.querySelectorAll('[class*="itemTile"]');


            itemTiles.forEach(card => {
                // Skip if this card is inside a bazaar/NPC deals popup
                if (card.closest('[class*="bz-"]') ||
                    card.closest('[class*="bazaar"]')) {
                    return;
                }

                const item = resolveItemFromElement(card);

                // FIRST: Handle main item card prices (grid view)
                const mainPriceContainer = card.querySelector('[class*="priceAndTotal"]');
                if (mainPriceContainer) {
                    // Find the span that contains the price (first span with $ in it)
                    const allSpans = mainPriceContainer.querySelectorAll('span');
                    let priceSpan = null;

                    for (let span of allSpans) {
                        const text = span.textContent.trim();
                        // Find span with $ but without parentheses (the price, not the quantity)
                        if (text.includes('$') && !text.includes('(')) {
                            priceSpan = span;
                            break;
                        }
                    }

                    if (priceSpan) {
                        // Remove any existing badges
                        const existingBadges = priceSpan.querySelectorAll('.imp-price-badge');
                        existingBadges.forEach(badge => badge.remove());

                        // Get ALL text content from the span (handles multiple text nodes)
                        let priceText = priceSpan.textContent.trim();

                        // Only process if it looks like a price and doesn't have a badge already
                        if (priceText && priceText.includes('$') && !priceText.includes('%')) {
                            const price = num(priceText);
                            if (price > 0 && price < 1000000000) {
                                const badge = createPriceBadge(price, item.mv, true);
                                if (badge) {
                                    priceSpan.appendChild(badge);
                                }
                            }
                        }
                    }
                }
            });

            // Annotate expanded dropdown listings
            annotateDropdownListings();

        } catch (e) {
            console.error('Error in annotateMarket:', e);
        } finally {
            busy = false;
            // Reconnect observer after we're done
            if (observer) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }
    }

    // ============================================================================
    // DROPDOWN LISTINGS ANNOTATION
    // ============================================================================
    function annotateDropdownListings() {
        if (!catalog) return;

        // Find expanded dropdown/list of sellers
        const listingRows = document.querySelectorAll('[class*="listing"], [class*="seller"], [class*="row"]');

        listingRows.forEach(row => {
            // Skip if this row is inside a bazaar/NPC deals popup
            if (row.closest('[class*="bz-"]') ||
                row.closest('[class*="bazaar"]')) {
                return;
            }

            // Look for price in this row
            const priceElements = row.querySelectorAll('[class*="price"], [class*="Price"], [class*="cost"], [class*="Cost"]');

            // Only add ONE badge per row
            let badgeAdded = false;
            for (let priceEl of priceElements) {
                if (badgeAdded) break;

                // FIRST: Remove ALL existing badges
                const existingBadges = priceEl.querySelectorAll('.imp-price-badge');
                existingBadges.forEach(badge => badge.remove());

                // Skip if not visible
                if (priceEl.offsetParent === null) continue;

                // Get ONLY direct text content
                let priceText = '';
                for (let node of priceEl.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        priceText += node.textContent;
                    }
                }
                priceText = priceText.trim();

                // Skip if no text or has %
                if (!priceText || priceText.includes('%')) continue;

                const price = num(priceText);

                if (price > 0 && price < 1000000000) {
                    // Find item
                    let parentCard = row;
                    let item = null;

                    for (let i = 0; i < 10 && parentCard; i++) {
                        item = resolveItemFromElement(parentCard);
                        if (item && item.mv) break;
                        parentCard = parentCard.parentElement;
                    }

                    if (item && item.mv) {
                        const badge = createPriceBadge(price, item.mv, false);
                        if (badge) {
                            priceEl.appendChild(badge);
                            badgeAdded = true;
                            break; // Stop after adding one
                        }
                    }
                }
            }
        });
    }

    // ============================================================================
    // MUTATION OBSERVER
    // ============================================================================
    observer = new MutationObserver(() => {
        // Debounce to prevent rapid re-triggers
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            annotateMarket();
        }, 100);
    });

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    async function init() {

        // Fetch catalog
        catalog = await fetchCatalog();

        // Wait longer for React app to load
        setTimeout(() => {
            annotateMarket();
        }, 3000);

        // Watch for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Re-annotate periodically to catch dynamic content
        setInterval(() => {
            annotateMarket();
        }, 5000);

    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();