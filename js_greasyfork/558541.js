// ==UserScript==
// @name         Neopets TP - ItemDB Price Checker v2.0
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Shows ItemDB prices - uses exact NAME matching, all items from Vue, popup support
// @author       You
// @license MIT
// @match        https://www.neopets.com/island/tradingpost.phtml*
// @grant        GM_xmlhttpRequest
// @connect      itemdb.com.br
// @downloadURL https://update.greasyfork.org/scripts/558541/Neopets%20TP%20-%20ItemDB%20Price%20Checker%20v20.user.js
// @updateURL https://update.greasyfork.org/scripts/558541/Neopets%20TP%20-%20ItemDB%20Price%20Checker%20v20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_DURATION = 30 * 60 * 1000;
    const STALE_THRESHOLD = 30 * 24 * 60 * 60 * 1000;
    const VERY_STALE_THRESHOLD = 90 * 24 * 60 * 60 * 1000;
    const BATCH_SIZE = 50;

    let priceCache = {};
    let lotItemsCache = {}; // Cache all items per lot from Vue

    const STYLES = `
        .tp-price-badge {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            margin-top: 4px;
            flex-wrap: wrap;
        }

        .tp-price-value { background: #d4edda; color: #155724; }
        .tp-price-stale { background: #fff3cd; color: #856404; }
        .tp-price-very-stale { background: #f8d7da; color: #721c24; }
        .tp-price-inflated { background: #ffccbc; color: #bf360c; }
        .tp-price-loading { background: #e9ecef; color: #6c757d; }
        .tp-price-not-found { background: #e9ecef; color: #6c757d; font-style: italic; font-weight: normal; }
        .tp-price-mismatch { background: #e1bee7; color: #7b1fa2; }

        .tp-price-age { font-size: 8px; opacity: 0.8; font-weight: normal; }

        .tp-lot-total {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 6px;
            margin-top: 4px;
            width: 100%;
            box-sizing: border-box;
        }

        .tp-lot-value {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 6px;
            background: #e9ecef;
            color: #495057;
            font-size: 12px;
            font-weight: bold;
            width: 100%;
            box-sizing: border-box;
        }

        .tp-lot-value img { width: 20px; height: 20px; }

        .tp-lot-profit {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            width: 100%;
            box-sizing: border-box;
        }

        .tp-lot-profit-positive {
            background: #d4edda;
            color: #155724;
        }

        .tp-lot-profit-negative {
            background: #f8d7da;
            color: #721c24;
        }

        .tp-lot-profit-neutral {
            background: #e9ecef;
            color: #495057;
        }

        .tp-lot-total-good { background: transparent; }
        .tp-lot-total-bad { background: transparent; }
        .tp-lot-total-neutral { background: transparent; }
        .tp-lot-total img { width: 16px; height: 16px; }

        .tp-profit-indicator { font-size: 10px; margin-left: 4px; }
        .tp-profit-positive { color: #155724; }
        .tp-profit-negative { color: #721c24; }

        .tp-price-status {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 13px;
            z-index: 10000;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .tp-itemdb-link {
            color: #007bff;
            text-decoration: none;
            font-size: 9px;
            margin-left: 4px;
        }
        .tp-itemdb-link:hover { text-decoration: underline; }

        .tp-refresh-btn {
            background: #6c757d;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            cursor: pointer;
            margin-left: 8px;
        }
        .tp-refresh-btn:hover { background: #5a6268; }

        .tp-price-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            padding: 4px 8px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 11px;
        }

        .tp-itemdb-credit { font-size: 9px; color: #666; }
        .tp-itemdb-credit a { color: #007bff; }

        /* Popup price styles */
        .tp-custom-popup-item .tp-price-badge {
            font-size: 9px;
            padding: 2px 5px;
        }

        .tp-popup-total {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding: 0;
            margin: 12px 0;
            font-weight: bold;
            font-size: 14px;
        }

        .tp-popup-total .tp-lot-value {
            font-size: 13px;
            padding: 10px 14px;
        }

        .tp-popup-total .tp-lot-value img { width: 20px; height: 20px; }

        .tp-popup-total .tp-lot-profit {
            font-size: 13px;
            padding: 10px 14px;
        }
    `;

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    function loadCache() {
        try {
            const cached = localStorage.getItem('tp_itemdb_price_cache_v7');
            if (cached) {
                priceCache = JSON.parse(cached);
                const now = Date.now();
                let cleaned = false;
                for (const key in priceCache) {
                    if (now - priceCache[key].cachedAt > CACHE_DURATION) {
                        delete priceCache[key];
                        cleaned = true;
                    }
                }
                if (cleaned) saveCache();
            }
        } catch (e) {
            priceCache = {};
        }
    }

    function saveCache() {
        try {
            localStorage.setItem('tp_itemdb_price_cache_v7', JSON.stringify(priceCache));
        } catch (e) {}
    }

    function clearCache() {
        priceCache = {};
        lotItemsCache = {};
        localStorage.removeItem('tp_itemdb_price_cache_v7');
    }

    function getCacheKey(imageId) {
        return imageId;
    }

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function formatPriceAge(addedAt) {
        if (!addedAt) return '';
        const priceDate = new Date(addedAt);
        const now = new Date();
        const diffMs = now - priceDate;
        const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

        if (diffDays === 0) return 'today';
        if (diffDays === 1) return '1d ago';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
        return `${Math.floor(diffDays / 365)}y ago`;
    }

    function getPriceAgeClass(addedAt) {
        if (!addedAt) return 'tp-price-value';
        const diffMs = Date.now() - new Date(addedAt).getTime();
        if (diffMs > VERY_STALE_THRESHOLD) return 'tp-price-very-stale';
        if (diffMs > STALE_THRESHOLD) return 'tp-price-stale';
        return 'tp-price-value';
    }

    function extractImageId(imgSrc) {
        if (!imgSrc) return null;
        const match = imgSrc.match(/\/items\/([^/.]+)/);
        return match ? match[1] : null;
    }

    function fixImageUrl(src) {
        if (!src) return '';
        if (src.startsWith('http')) return src;
        if (src.startsWith('//')) return 'https:' + src;
        return 'https://images.neopets.com' + src;
    }

    function showStatus(message, duration = 3000) {
        let status = document.querySelector('.tp-price-status');
        if (!status) {
            status = document.createElement('div');
            status.className = 'tp-price-status';
            document.body.appendChild(status);
        }
        status.textContent = message;
        status.style.display = 'block';
        if (duration > 0) {
            setTimeout(() => { status.style.display = 'none'; }, duration);
        }
    }

    // Extract ALL items from Vue component for a lot
    function extractAllItemsFromVue(lotEl) {
        const vueComponent = lotEl.__vueParentComponent;
        if (vueComponent && vueComponent.ctx && vueComponent.ctx.lot) {
            const lot = vueComponent.ctx.lot;
            const lotId = lot.lot_id;

            if (lot.items && lot.items.length > 0) {
                const items = lot.items.map(item => ({
                    name: item.name || 'Unknown Item',
                    imageId: extractImageId(item.img_url),
                    imgUrl: fixImageUrl(item.img_url),
                    amount: item.amount || 1,
                    rarity: item.sub_name || ''
                }));

                // Cache for this lot
                lotItemsCache[lotId] = items;
                return { lotId, items, instantBuyPrice: lot.instant_buy_amount };
            }
        }
        return null;
    }

    // Batch fetch - prioritize NAME matching since names are unique in Neopets
    function fetchPricesFromAPI(items) {
        return new Promise((resolve, reject) => {
            if (items.length === 0) {
                resolve({});
                return;
            }

            // Filter to only items with names (skip unknown items)
            const itemsWithNames = items.filter(item => item.name && item.name.trim());
            const names = itemsWithNames.map(item => item.name.trim());

            console.log('[TP Pricer] Fetching prices by NAME for:', names);

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://itemdb.com.br/api/v1/items/many',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({
                    name: names
                    // Only send names - image_id can cause wrong matches if items share images
                }),
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        console.log('[TP Pricer] API Response keys:', Object.keys(result));

                        // Map results back to our items by matching names
                        const validated = {};

                        for (const item of items) {
                            if (!item.name) continue;

                            const itemNameLower = item.name.toLowerCase().trim();

                            // The API returns results keyed by name
                            let data = result[item.name] || result[item.name.trim()];

                            // If not found by exact name, search through results
                            if (!data) {
                                for (const key of Object.keys(result)) {
                                    if (key.toLowerCase().trim() === itemNameLower) {
                                        data = result[key];
                                        break;
                                    }
                                }
                            }

                            if (data && data.name) {
                                const returnedNameLower = data.name.toLowerCase().trim();

                                // Verify name matches exactly (case-insensitive)
                                if (returnedNameLower === itemNameLower) {
                                    // Perfect match!
                                    validated[item.imageId] = {
                                        ...data,
                                        _exactMatch: true
                                    };
                                    console.log(`[TP Pricer] ✓ Exact match: "${item.name}"`);
                                } else {
                                    // Name doesn't match - mark as mismatch
                                    console.warn(`[TP Pricer] ✗ Name mismatch: expected "${item.name}", got "${data.name}"`);
                                    validated[item.imageId] = {
                                        ...data,
                                        _nameMismatch: true
                                    };
                                }
                            }
                        }

                        resolve(validated);
                    } catch (e) {
                        console.error('[TP Pricer] Parse error:', e);
                        reject(e);
                    }
                },
                onerror: function(err) {
                    console.error('[TP Pricer] Request error:', err);
                    reject(err);
                }
            });
        });
    }

    // Search for a single item by exact name (fallback for mismatches)
    function searchItemByName(name) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://itemdb.com.br/api/v1/search?s=${encodeURIComponent(name)}&limit=10`,
                onload: function(response) {
                    try {
                        const results = JSON.parse(response.responseText);
                        // Find exact name match (case-insensitive)
                        const nameLower = name.toLowerCase().trim();
                        const exact = results.find(r => r.name.toLowerCase().trim() === nameLower);

                        if (exact) {
                            console.log(`[TP Pricer] Search found exact: "${exact.name}"`);
                        } else {
                            console.log(`[TP Pricer] Search no exact match for "${name}", got:`, results.map(r => r.name));
                        }

                        resolve(exact || null);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    function collectAllItemsFromPage() {
        const items = [];
        const seen = new Set();

        // First, extract from Vue components to get ALL items (including hidden ones)
        const grid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-3');
        if (grid) {
            grid.querySelectorAll(':scope > div').forEach(lotEl => {
                const vueData = extractAllItemsFromVue(lotEl);
                if (vueData && vueData.items) {
                    vueData.items.forEach(item => {
                        if (item.imageId && !seen.has(item.imageId)) {
                            seen.add(item.imageId);
                            items.push({
                                imageId: item.imageId,
                                name: item.name,
                                amount: item.amount
                            });
                        }
                    });
                }
            });
        }

        // Also collect any visible items (fallback)
        document.querySelectorAll('img[src*="/items/"]').forEach(img => {
            const imageId = extractImageId(img.src);
            if (!imageId || seen.has(imageId)) return;
            seen.add(imageId);

            let name = '';
            const container = img.closest('.tp-custom-item') || img.closest('.tp-custom-popup-item') || img.closest('.flex');
            if (container) {
                const nameEl = container.querySelector('.tp-custom-item-name, .tp-custom-popup-item-name, .text-museo-bold, p.text-\\[14px\\]');
                if (nameEl) name = nameEl.textContent.trim();
            }

            items.push({ imageId, name, img });
        });

        return items;
    }

    async function fetchAllPrices(forceRefresh = false) {
        const allItems = collectAllItemsFromPage();
        if (allItems.length === 0) return;

        showStatus(`Fetching prices for ${allItems.length} items...`, 0);

        const itemsToFetch = forceRefresh
            ? allItems
            : allItems.filter(item => !priceCache[getCacheKey(item.imageId)]);

        if (itemsToFetch.length > 0) {
            for (let i = 0; i < itemsToFetch.length; i += BATCH_SIZE) {
                const batch = itemsToFetch.slice(i, i + BATCH_SIZE);

                showStatus(`Fetching batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(itemsToFetch.length/BATCH_SIZE)}...`, 0);

                try {
                    // Pass full batch with names for better matching
                    const results = await fetchPricesFromAPI(batch);

                    for (const item of batch) {
                        const cacheKey = getCacheKey(item.imageId);
                        const data = results[item.imageId];

                        if (data && data.price) {
                            // Use the _exactMatch or _nameMismatch flags from the API processor
                            const isMismatch = data._nameMismatch || !data._exactMatch;

                            if (isMismatch && !data._nameMismatch) {
                                // Not an exact match but also not flagged as mismatch - might just be missing from response
                                console.log(`[TP Pricer] Item "${item.name}" - checking match status`);
                            }

                            priceCache[cacheKey] = {
                                price: data.price.value,
                                addedAt: data.price.addedAt,
                                inflated: data.price.inflated || false,
                                name: data.name,
                                expectedName: item.name,
                                imageId: data.image_id,
                                expectedImageId: item.imageId,
                                slug: data.slug,
                                mismatch: data._nameMismatch || false,
                                cachedAt: Date.now()
                            };
                        } else {
                            // Not found in batch results - will be retried individually
                            priceCache[cacheKey] = {
                                price: null,
                                name: item.name,
                                imageId: item.imageId,
                                cachedAt: Date.now()
                            };
                        }
                    }

                    saveCache();
                } catch (e) {
                    console.error('[TP Pricer] Batch error:', e);
                }
            }

            // Retry mismatched items AND items not found with individual search
            const itemsToRetry = itemsToFetch.filter(item => {
                const cached = priceCache[getCacheKey(item.imageId)];
                // Retry if: mismatch, no price found, or not in cache at all
                return item.name && (!cached || cached.mismatch || cached.price === null);
            });

            if (itemsToRetry.length > 0 && itemsToRetry.length <= 20) {
                // Only retry individually if reasonable number
                showStatus(`Searching ${itemsToRetry.length} items individually...`, 0);

                for (const item of itemsToRetry) {
                    try {
                        const exactResult = await searchItemByName(item.name);
                        if (exactResult && exactResult.price) {
                            const cacheKey = getCacheKey(item.imageId);

                            priceCache[cacheKey] = {
                                price: exactResult.price.value,
                                addedAt: exactResult.price.addedAt,
                                inflated: exactResult.price.inflated || false,
                                name: exactResult.name,
                                expectedName: item.name,
                                imageId: exactResult.image_id,
                                expectedImageId: item.imageId,
                                slug: exactResult.slug,
                                mismatch: false, // Search found exact match
                                cachedAt: Date.now()
                            };
                        }
                        // Small delay to avoid rate limiting
                        await new Promise(r => setTimeout(r, 100));
                    } catch (e) {
                        console.warn(`[TP Pricer] Search failed for "${item.name}":`, e);
                    }
                }
                saveCache();
            }
        }

        showStatus('Prices loaded!', 2000);
        updateAllPriceDisplays();
    }

    function createPriceBadge(cached) {
        const badge = document.createElement('div');

        if (cached && cached.price !== null) {
            let ageClass;
            let icon = '';
            let mismatchNote = '';

            if (cached.mismatch) {
                ageClass = 'tp-price-mismatch';
                icon = '⚠️ ';
                // Show what ItemDB returned vs what we expected
                if (cached.expectedName && cached.name !== cached.expectedName) {
                    mismatchNote = `<br><span style="font-size:8px;color:#7b1fa2;" title="ItemDB returned: ${cached.name}">Wrong item?</span>`;
                }
            } else if (cached.inflated) {
                ageClass = 'tp-price-inflated';
                icon = '📈 ';
            } else {
                ageClass = getPriceAgeClass(cached.addedAt);
            }

            const ageText = formatPriceAge(cached.addedAt);
            const slug = cached.slug || encodeURIComponent(cached.name);

            badge.className = `tp-price-badge ${ageClass}`;
            badge.innerHTML = `
                ${icon}${formatNumber(cached.price)} NP
                <span class="tp-price-age">(${ageText})</span>
                <a href="https://itemdb.com.br/item/${slug}" target="_blank" class="tp-itemdb-link" title="View on ItemDB">↗</a>
                ${mismatchNote}
            `;
        } else if (cached) {
            badge.className = 'tp-price-badge tp-price-not-found';
            badge.textContent = 'No price';
        } else {
            badge.className = 'tp-price-badge tp-price-loading';
            badge.textContent = '...';
        }

        return badge;
    }

    function updateAllPriceDisplays() {
        // Update custom row items
        document.querySelectorAll('.tp-custom-item').forEach(container => {
            const img = container.querySelector('img[src*="/items/"]');
            if (!img) return;

            const imageId = extractImageId(img.src);
            if (!imageId) return;

            let badge = container.querySelector('.tp-price-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'tp-price-badge tp-price-loading';
                badge.textContent = '...';

                const infoDiv = container.querySelector('.tp-custom-item-info');
                if (infoDiv) {
                    infoDiv.appendChild(badge);
                } else {
                    container.appendChild(badge);
                }
            }

            const cached = priceCache[getCacheKey(imageId)];
            const newBadge = createPriceBadge(cached);
            badge.className = newBadge.className;
            badge.innerHTML = newBadge.innerHTML;
        });

        // Update popup items
        document.querySelectorAll('.tp-custom-popup-item').forEach(container => {
            const img = container.querySelector('img');
            if (!img) return;

            const imageId = extractImageId(img.src);
            if (!imageId) return;

            let badge = container.querySelector('.tp-price-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'tp-price-badge tp-price-loading';
                badge.textContent = '...';
                container.appendChild(badge);
            }

            const cached = priceCache[getCacheKey(imageId)];
            const newBadge = createPriceBadge(cached);
            badge.className = newBadge.className;
            badge.innerHTML = newBadge.innerHTML;
        });

        updateLotTotals();
        updatePopupTotal();
    }

    function updateLotTotals() {
        document.querySelectorAll('.tp-custom-row').forEach(row => {
            const lotId = row.dataset.lotId;

            // Use ALL items from Vue cache, not just visible ones
            let allItems = lotItemsCache[lotId];

            if (!allItems) {
                // Fallback to visible items only
                allItems = [];
                row.querySelectorAll('.tp-custom-item').forEach(item => {
                    const img = item.querySelector('img[src*="/items/"]');
                    if (!img) return;
                    const imageId = extractImageId(img.src);
                    const countEl = item.querySelector('.tp-custom-item-count');
                    const count = countEl ? parseInt(countEl.textContent) || 1 : 1;
                    allItems.push({ imageId, amount: count });
                });
            }

            let totalValue = 0;
            let hasAllPrices = true;
            let hasStalePrices = false;
            let hasMismatch = false;
            let itemCount = 0;
            let pricedCount = 0;

            allItems.forEach(item => {
                if (!item.imageId) return;
                itemCount++;

                const cached = priceCache[getCacheKey(item.imageId)];
                const count = item.amount || 1;

                if (cached && cached.price !== null && !cached.mismatch) {
                    totalValue += cached.price * count;
                    pricedCount++;

                    if (cached.addedAt) {
                        const age = Date.now() - new Date(cached.addedAt).getTime();
                        if (age > STALE_THRESHOLD) hasStalePrices = true;
                    }
                } else if (cached && cached.mismatch) {
                    hasMismatch = true;
                } else {
                    hasAllPrices = false;
                }
            });

            const rightSection = row.querySelector('.tp-custom-right-section');
            if (!rightSection) return;

            let totalDisplay = rightSection.querySelector('.tp-lot-total');
            if (!totalDisplay) {
                totalDisplay = document.createElement('div');
                totalDisplay.className = 'tp-lot-total tp-lot-total-neutral';
                rightSection.insertBefore(totalDisplay, rightSection.firstChild);
            }

            const instantBuyEl = row.querySelector('.tp-custom-instant-buy');
            let instantBuyPrice = 0;
            if (instantBuyEl) {
                const match = instantBuyEl.textContent.match(/([\d,]+)/);
                if (match) instantBuyPrice = parseInt(match[1].replace(/,/g, ''));
            }

            if (totalValue > 0) {
                let profitHtml = '';

                if (instantBuyPrice > 0) {
                    const diff = totalValue - instantBuyPrice;
                    const pct = ((diff / instantBuyPrice) * 100).toFixed(0);

                    if (diff > 0) {
                        profitHtml = `<div class="tp-lot-profit tp-lot-profit-positive">+${formatNumber(diff)} NP (+${pct}%)</div>`;
                    } else if (diff < 0) {
                        profitHtml = `<div class="tp-lot-profit tp-lot-profit-negative">${formatNumber(diff)} NP (${pct}%)</div>`;
                    } else {
                        profitHtml = `<div class="tp-lot-profit tp-lot-profit-neutral">0 NP (0%)</div>`;
                    }
                }

                const warnings = [];
                if (hasStalePrices) warnings.push('<span title="Some prices may be outdated">⏰</span>');
                if (!hasAllPrices) warnings.push(`<span title="${pricedCount}/${itemCount} items priced">❓</span>`);
                if (hasMismatch) warnings.push('<span title="Some items could not be matched">❌</span>');

                totalDisplay.className = 'tp-lot-total';
                totalDisplay.innerHTML = `
                    <div class="tp-lot-value">
                        <img src="https://images.neopets.com/tradingpost/assets/images/np-icon.png" alt="NP">
                        ~${formatNumber(totalValue)} NP ${warnings.join(' ')}
                    </div>
                    ${profitHtml}
                `;
            } else {
                totalDisplay.className = 'tp-lot-total tp-lot-total-neutral';
                totalDisplay.innerHTML = '<div class="tp-lot-value" style="font-size:10px;color:#999;">Calculating...</div>';
            }
        });
    }

    function updatePopupTotal() {
        const popup = document.querySelector('.tp-custom-popup-overlay');
        if (!popup) return;

        const popupInner = popup.querySelector('.tp-custom-popup-inner');
        if (!popupInner) return;

        // Get all items in popup
        const items = popup.querySelectorAll('.tp-custom-popup-item');
        let totalValue = 0;
        let hasAllPrices = true;
        let pricedCount = 0;
        let itemCount = 0;

        items.forEach(item => {
            itemCount++;
            const img = item.querySelector('img');
            if (!img) return;

            const imageId = extractImageId(img.src);
            if (!imageId) return;

            const countEl = item.querySelector('.tp-custom-popup-item-count');
            const count = countEl ? parseInt(countEl.textContent) || 1 : 1;

            const cached = priceCache[getCacheKey(imageId)];
            if (cached && cached.price !== null && !cached.mismatch) {
                totalValue += cached.price * count;
                pricedCount++;
            } else {
                hasAllPrices = false;
            }
        });

        // Find or create total display
        let totalDisplay = popup.querySelector('.tp-popup-total');
        if (!totalDisplay) {
            totalDisplay = document.createElement('div');
            totalDisplay.className = 'tp-popup-total tp-lot-total-neutral';

            // Insert after items grid
            const itemsGrid = popup.querySelector('.tp-custom-popup-items');
            if (itemsGrid) {
                itemsGrid.parentNode.insertBefore(totalDisplay, itemsGrid.nextSibling);
            }
        }

        // Get instant buy price from popup
        const instantBuyEl = popup.querySelector('.tp-custom-popup-instant-buy-price');
        let instantBuyPrice = 0;
        if (instantBuyEl) {
            const match = instantBuyEl.textContent.match(/([\d,]+)/);
            if (match) instantBuyPrice = parseInt(match[1].replace(/,/g, ''));
        }

        if (totalValue > 0) {
            let profitHtml = '';

            if (instantBuyPrice > 0) {
                const diff = totalValue - instantBuyPrice;
                const pct = ((diff / instantBuyPrice) * 100).toFixed(0);

                if (diff > 0) {
                    profitHtml = `<div class="tp-lot-profit tp-lot-profit-positive">+${formatNumber(diff)} NP (+${pct}%)</div>`;
                } else if (diff < 0) {
                    profitHtml = `<div class="tp-lot-profit tp-lot-profit-negative">${formatNumber(diff)} NP (${pct}%)</div>`;
                } else {
                    profitHtml = `<div class="tp-lot-profit tp-lot-profit-neutral">0 NP (0%)</div>`;
                }
            }

            const priceNote = !hasAllPrices ? ` <span style="font-size:9px;opacity:0.7;">(${pricedCount}/${itemCount})</span>` : '';

            totalDisplay.className = 'tp-popup-total';
            totalDisplay.innerHTML = `
                <div class="tp-lot-value">
                    <img src="https://images.neopets.com/tradingpost/assets/images/np-icon.png" alt="NP">
                    ~${formatNumber(totalValue)} NP${priceNote}
                </div>
                ${profitHtml}
            `;
        } else {
            totalDisplay.className = 'tp-popup-total';
            totalDisplay.innerHTML = '<div class="tp-lot-value" style="font-size:11px;color:#999;">Calculating prices...</div>';
        }
    }

    function addRefreshButton() {
        const customList = document.querySelector('.tp-custom-list');
        if (!customList || customList.querySelector('.tp-price-header')) return;

        const header = document.createElement('div');
        header.className = 'tp-price-header';
        header.innerHTML = `
            <span class="tp-itemdb-credit">Prices by <a href="https://itemdb.com.br" target="_blank">itemdb.com.br</a></span>
            <button class="tp-refresh-btn" id="tp-refresh-prices">🔄 Refresh</button>
            <button class="tp-refresh-btn" id="tp-clear-cache">🗑️ Clear Cache</button>
        `;
        customList.insertBefore(header, customList.firstChild);

        document.getElementById('tp-refresh-prices')?.addEventListener('click', () => fetchAllPrices(true));
        document.getElementById('tp-clear-cache')?.addEventListener('click', () => {
            clearCache();
            showStatus('Cache cleared!', 1500);
            setTimeout(() => fetchAllPrices(true), 500);
        });
    }

    function handlePopupOpened() {
        // Wait a moment for popup to render
        setTimeout(() => {
            updateAllPriceDisplays();

            // If some items don't have prices yet, fetch them
            const popup = document.querySelector('.tp-custom-popup-overlay');
            if (popup) {
                const unpricedItems = [];
                popup.querySelectorAll('.tp-custom-popup-item img').forEach(img => {
                    const imageId = extractImageId(img.src);
                    if (imageId && !priceCache[getCacheKey(imageId)]) {
                        unpricedItems.push({ imageId, name: '' });
                    }
                });

                if (unpricedItems.length > 0) {
                    fetchAllPrices(false);
                }
            }
        }, 100);
    }

    function init() {
        injectStyles();
        loadCache();

        const observer = new MutationObserver((mutations) => {
            let hasNewRows = false;
            let hasPopup = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('tp-custom-row') || node.querySelector?.('.tp-custom-row')) {
                            hasNewRows = true;
                        }
                        if (node.classList?.contains('tp-custom-popup-overlay') || node.querySelector?.('.tp-custom-popup-overlay')) {
                            hasPopup = true;
                        }
                    }
                });
            });

            if (hasNewRows) {
                addRefreshButton();
                setTimeout(() => fetchAllPrices(), 500);
            }

            if (hasPopup) {
                handlePopupOpened();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                lotItemsCache = {}; // Clear lot cache on navigation
                setTimeout(() => {
                    addRefreshButton();
                    fetchAllPrices();
                }, 1000);
            }
        }, 500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[TP Pricer] ItemDB Price Checker v2.4 loaded');
})();