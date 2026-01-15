// ==UserScript==
// @name          Item Market Price Indicator + Hot Deals
// @namespace     http://torn.com/
// @version       4.1
// @description   Shows price percentage indicators on Item Market listings relative to market value with green highlighting for good deals
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
// @downloadURL https://update.greasyfork.org/scripts/562318/Item%20Market%20Price%20Indicator%20%2B%20Hot%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/562318/Item%20Market%20Price%20Indicator%20%2B%20Hot%20Deals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================================
    // STORAGE KEYS & CONSTANTS
    // ============================================================================
    const S = {
        apiKey: 'im_api_key',
        catalog: 'im_catalog',
        catalogTs: 'im_catalog_ts',
        settings: 'im_deal_settings'
    };

    const BASE = 'https://api.torn.com';

    // Default settings for deal highlighting
    let dealSettings = JSON.parse(localStorage.getItem(S.settings)) || {
        tier1: { percent: 5, badgeColor: '#00A100', borderColor: '#00A100' },
        tier2: { percent: 10, badgeColor: '#00D000', borderColor: '#00D000' },
        tier3: { percent: 20, badgeColor: '#00FF00', borderColor: '#00FF00' }
    };

    // Set minDiscount to tier1 percent (lowest tier)
    dealSettings.minDiscount = dealSettings.tier1.percent;

    // ============================================================================
    // STATE VARIABLES
    // ============================================================================
    let catalog = null;
    let busy = false;
    let observer = null;
    let debounceTimer = null;
    let processedElements = new WeakSet();

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

        /* Hot deal highlighting - clean, no glow, no animation */
        .imp-hot-deal {
            transition: all 0.2s ease-in !important;
            position: relative !important;
            z-index: 1 !important;
            border-radius: 4px !important;
        }

        /* Settings Menu Styles */
        #market-deals-menu {
            position: fixed;
            bottom: 38px;
            left: 20px;
            z-index: 999999;
            background: #222;
            color: #ccc;
            border: 1px solid #444;
            border-radius: 5px;
            font-family: Tahoma, Arial, sans-serif;
            width: 200px;
            box-shadow: 0 0 10px #000;
        }

        #market-menu-header {
            padding: 6px;
            cursor: pointer;
            background: #333;
            border-radius: 5px 5px 0 0;
            font-weight: bold;
            font-size: 11px;
            text-align: center;
            color: #fff;
        }

        #market-menu-content {
            display: none;
            padding: 10px;
            border-top: 1px solid #444;
            max-height: 400px;
            overflow-y: auto;
        }

        #market-menu-content::-webkit-scrollbar {
            width: 6px;
        }

        #market-menu-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 3px;
        }

        .market-tier-section {
            background: #2a2a2a;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 8px;
        }

        .market-tier-header {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 6px;
            padding-bottom: 4px;
            border-bottom: 1px solid #444;
        }

        .market-tier-title {
            font-weight: bold;
            font-size: 10px;
            color: #fff;
            flex: 1;
        }

        .market-setting-row {
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 9px;
        }

        .market-setting-label {
            color: #aaa;
            width: 65px;
            flex-shrink: 0;
            font-size: 9px;
        }

        .market-setting-row input[type="number"] {
            width: 45px;
            background: #000;
            color: #fff;
            border: 1px solid #555;
            text-align: center;
            border-radius: 2px;
            font-size: 9px;
            padding: 2px;
        }

        .market-setting-row input[type="color"] {
            width: 40px;
            height: 22px;
            background: #000;
            border: 1px solid #555;
            border-radius: 2px;
            cursor: pointer;
            padding: 1px;
        }

        #market-save-btn {
            width: 100%;
            cursor: pointer;
            background: #76c776;
            color: #000;
            border: none;
            padding: 8px;
            border-radius: 3px;
            font-weight: bold;
            font-size: 11px;
            margin-top: 6px;
        }

        #market-save-btn:hover {
            background: #8ed68e;
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
    // COLOR CALCULATION FOR BADGES
    // ============================================================================
    function getGreenColorForDiscount(pctDiff) {
        // pctDiff is negative for discounts (e.g., -5%, -10%, -20%)
        const discount = Math.abs(pctDiff);

        // Return colors based on settings
        if (discount >= dealSettings.tier3.percent) {
            return dealSettings.tier3.badgeColor;
        } else if (discount >= dealSettings.tier2.percent) {
            return dealSettings.tier2.badgeColor;
        } else if (discount >= dealSettings.tier1.percent) {
            return dealSettings.tier1.badgeColor;
        } else {
            return dealSettings.tier1.badgeColor; // Default for small discounts
        }
    }

    // ============================================================================
    // COLOR CALCULATION FOR BORDER HIGHLIGHTING
    // ============================================================================
    function getGreenBorderColor(percentage) {
        // percentage is already absolute (e.g., 3, 10, 35)
        // Return colors based on settings

        if (percentage >= dealSettings.tier3.percent) {
            return dealSettings.tier3.borderColor;
        } else if (percentage >= dealSettings.tier2.percent) {
            return dealSettings.tier2.borderColor;
        } else if (percentage >= dealSettings.tier1.percent) {
            return dealSettings.tier1.borderColor;
        } else {
            return dealSettings.tier1.borderColor; // Default
        }
    }

    // ============================================================================
    // CATALOG FETCH
    // ============================================================================
    async function fetchCatalog(force = false) {
        const cached = JGet(S.catalog);
        const ts = GM_getValue(S.catalogTs, 0);

        // Use cached catalog if less than 1 hour old
        if (!force && cached && (Date.now() - ts) < 1 * 3600 * 1000) {
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

        if (pctDiff < 0) {
            // Below MV - Green (good to buy) - brightness increases with discount
            displayText = `${Math.round(pctDiff)}%`;
            badge.style.color = getGreenColorForDiscount(pctDiff);
        } else if (pctDiff > 0) {
            // Above MV - Red (expensive)
            displayText = `+${Math.round(pctDiff)}%`;
            badge.classList.add('high');
        } else {
            // Exactly at MV - Base green (at market value is acceptable)
            displayText = `MV`;
            badge.style.color = '#00A100';
        }

        badge.textContent = displayText;
        badge.title = `Market Value: $${marketValue.toLocaleString()}\nListing Price: $${price.toLocaleString()}`;

        return badge;
    }

    // ============================================================================
    // HOT DEAL HIGHLIGHTING (like original script)
    // ============================================================================
    function applyHotDeals() {
        // Find all span/div/p elements (like original script)
        const elements = document.querySelectorAll('span, div, p');

        // Track which parent elements should be highlighted
        const highlightedParents = new Set();

        elements.forEach(el => {
            const text = el.innerText.trim();

            // Target the pattern: -XX% or -XX.X% (negative percentages only)
            if (/^-\d+(\.\d+)?%$/.test(text)) {
                const percentage = Math.abs(parseFloat(text));

                // Only highlight if discount meets minimum threshold from settings
                if (percentage >= dealSettings.minDiscount) {
                    const box = el.parentElement;
                    if (box) {
                        highlightedParents.add(box);

                        if (!box.classList.contains('imp-hot-deal')) {
                            box.classList.add('imp-hot-deal');
                        }

                        const color = getGreenBorderColor(percentage);

                        // Thicker borders for better deals
                        let borderWidth = '1px';
                        if (percentage >= dealSettings.tier3.percent) {
                            borderWidth = '3px'; // Thick border for amazing deals
                        } else if (percentage >= dealSettings.tier2.percent) {
                            borderWidth = '2px'; // Medium border for good deals
                        }

                        // Subtle background tint for better deals (very transparent)
                        let bgColor = 'transparent';
                        if (percentage >= dealSettings.tier2.percent) {
                            bgColor = 'rgba(0, 200, 0, 0.05)'; // Very subtle green tint
                        }

                        // Apply styling - using box-sizing to prevent layout shift from thicker borders
                        box.style.border = `${borderWidth} solid ${color}`;
                        box.style.backgroundColor = bgColor;
                        box.style.boxShadow = 'none';
                        box.style.animation = 'none';
                        box.style.boxSizing = 'border-box';
                    }
                }
            }
        });

        // Remove highlighting from elements that no longer have good deals
        const allHighlighted = document.querySelectorAll('.imp-hot-deal');
        allHighlighted.forEach(el => {
            if (!highlightedParents.has(el)) {
                el.classList.remove('imp-hot-deal');
                el.style.border = '';
                el.style.backgroundColor = '';
                el.style.boxShadow = '';
                el.style.animation = '';
                el.style.boxSizing = '';
            }
        });
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
            const itemTiles = document.querySelectorAll('[class*="itemTile"]');

            itemTiles.forEach(card => {
                // Skip if this card is inside a bazaar/NPC deals popup
                if (card.closest('[class*="bz-"]') ||
                    card.closest('[class*="bazaar"]')) {
                    return;
                }

                const item = resolveItemFromElement(card);

                // Handle main item card prices (grid view)
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
        console.log('Item Market Price Indicator + Hot Deals: Initializing...');

        // Create settings menu
        createSettingsMenu();

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

        // Apply hot deals highlighting every 400ms (like original script)
        setInterval(() => {
            applyHotDeals();
        }, 400);
    }

    // ============================================================================
    // SETTINGS MENU
    // ============================================================================
    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.id = 'market-deals-menu';
        menu.innerHTML = `
            <div id="market-menu-header">💚 Market Deals Settings</div>
            <div id="market-menu-content">
                <div class="market-tier-section">
                    <div class="market-tier-header">
                        <span class="market-tier-title">Tier 3 (Best Deals)</span>
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Min Discount %:</span>
                        <input type="number" id="market-tier3-percent" value="${dealSettings.tier3.percent}" min="1" max="100" step="1">
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Badge Color:</span>
                        <input type="color" id="market-tier3-badge" value="${dealSettings.tier3.badgeColor}">
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Border Color:</span>
                        <input type="color" id="market-tier3-border" value="${dealSettings.tier3.borderColor}">
                    </div>
                </div>

                <div class="market-tier-section">
                    <div class="market-tier-header">
                        <span class="market-tier-title">Tier 2 (Good Deals)</span>
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Min Discount %:</span>
                        <input type="number" id="market-tier2-percent" value="${dealSettings.tier2.percent}" min="1" max="100" step="1">
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Badge Color:</span>
                        <input type="color" id="market-tier2-badge" value="${dealSettings.tier2.badgeColor}">
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Border Color:</span>
                        <input type="color" id="market-tier2-border" value="${dealSettings.tier2.borderColor}">
                    </div>
                </div>

                <div class="market-tier-section">
                    <div class="market-tier-header">
                        <span class="market-tier-title">Tier 1 (Small Deals)</span>
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Min Discount %:</span>
                        <input type="number" id="market-tier1-percent" value="${dealSettings.tier1.percent}" min="1" max="100" step="1">
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Badge Color:</span>
                        <input type="color" id="market-tier1-badge" value="${dealSettings.tier1.badgeColor}">
                    </div>
                    <div class="market-setting-row">
                        <span class="market-setting-label">Border Color:</span>
                        <input type="color" id="market-tier1-border" value="${dealSettings.tier1.borderColor}">
                    </div>
                </div>

                <button id="market-save-btn">Save & Apply</button>
            </div>
        `;
        document.body.appendChild(menu);

        // Event listeners
        document.getElementById('market-menu-header').onclick = () => {
            const content = document.getElementById('market-menu-content');
            content.style.display = (content.style.display === 'block') ? 'none' : 'block';
        };

        document.getElementById('market-save-btn').onclick = () => {
            // Save all settings
            dealSettings.tier3.percent = parseInt(document.getElementById('market-tier3-percent').value);
            dealSettings.tier3.badgeColor = document.getElementById('market-tier3-badge').value;
            dealSettings.tier3.borderColor = document.getElementById('market-tier3-border').value;

            dealSettings.tier2.percent = parseInt(document.getElementById('market-tier2-percent').value);
            dealSettings.tier2.badgeColor = document.getElementById('market-tier2-badge').value;
            dealSettings.tier2.borderColor = document.getElementById('market-tier2-border').value;

            dealSettings.tier1.percent = parseInt(document.getElementById('market-tier1-percent').value);
            dealSettings.tier1.badgeColor = document.getElementById('market-tier1-badge').value;
            dealSettings.tier1.borderColor = document.getElementById('market-tier1-border').value;

            // Use tier1 percent as the minimum discount
            dealSettings.minDiscount = dealSettings.tier1.percent;

            localStorage.setItem(S.settings, JSON.stringify(dealSettings));

            // Immediate visual update
            annotateMarket();
            applyHotDeals();
        };
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();