// ==UserScript==
// @name         AliExpress Filter
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Hide low-rated, unrated, low-seller-score, low-votes and promo items on AliExpress
// @match        *://*.aliexpress.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561248/AliExpress%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/561248/AliExpress%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MIN_SELLER_SCORE = 80;
    const PROMO_KEYWORDS = ['Combo Blast', 'Bundle Deal', 'Combo Deals', 'Super Deals'];

    // Selectors for cleaning up garbage elements
    const GARBAGE_SELECTORS = [
        // Discount badges and percentages
        '.kt_lj', // -50% discount badges

        // Extra offers and promotional text
        '.kt_lr', // "Top selling on AliExpress" etc
        '.kt_lq', // Free shipping badges
        '.mr_a1.mr_mt', // Free shipping text

        // Partner/affiliate labels
        '.ah-ref-label', // "Партнерская ссылка"

        // Sale images - specifically target the ones you mentioned
        '.mr_mu', // Sale/promo images before product names
        'img[src*="Sale"]', // Images with "Sale" in the URL
        'img[src*="sale"]', // Images with "sale" in the URL (case insensitive)
        'img[src*="promo"]', // Promo images
        'img[src*="discount"]', // Discount images
        'img[height="16"]', // Small promotional images (common size for sale badges)

        // Any element with line-through (crossed prices)
        '[style*="line-through"]',

        // Generic promo/badge selectors (be careful with these)
        '[class*="promo"]',
        '[class*="badge"][class*="discount"]'
    ];

    // Additional cleanup for sale images by URL patterns
    const SALE_IMAGE_PATTERNS = [
        /sale/i,
        /discount/i,
        /promo/i,
        /badge/i,
        /154x64\.png/i,
    ];

    const defaultConfig = {
        minRating: 4.7,
        minVotes: 10,
        filterEnabled: true,
        cleanupEnabled: true,
        debugEnabled: false
    };

    const config = loadConfig();
    let lastUrl = location.href;
    let seenCards = new WeakSet();

    function loadConfig() {
        const stored = JSON.parse(localStorage.getItem('aeFilterConfig') || '{}');
        return { ...defaultConfig, ...stored };
    }

    function saveConfig() {
        localStorage.setItem('aeFilterConfig', JSON.stringify(config));
        seenCards = new WeakSet();
        hideLowRatedAndPromoItems();
    }

    function log(message) {
        if (config.debugEnabled) {
            console.log(message);
        }
    }

    function parseNumber(text) {
        const match = /* text.match(/([0-9.]+)/) */ text.match(/^([0-5](?:\.\d)?)$/);
        return match ? parseFloat(match[1]) : null;
    }

    function calculateRatingError(rating, votes) {
        if (votes <= 0) return null;
        if (votes < 5) return 1.0;

        const p = rating / 5;
        const n = votes;
        const z = 3.29;

        const denominator = 1 + (z * z) / n;
        const centre = p + (z * z) / (2 * n);
        const adjustment = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);

        const lowerBound = (centre - adjustment) / denominator;
        const upperBound = (centre + adjustment) / denominator;

        const lowerRating = lowerBound * 5;
        const upperRating = upperBound * 5;

        const error = (upperRating - lowerRating) / 2;
        return Math.round(error * 100) / 100;
    }

    function parseVotesCount(text) {
        const match = text.match(/\b(\d{1,5})\+?\s*sold\b/i);
        return match ? parseInt(match[1]) : null;
    }

    function extractVotesNearRating(card, ratingSpan) {
        const context = ratingSpan.closest('div')?.parentElement;
        if (!context) return 0;

        const elements = context.querySelectorAll('*');
        for (const el of elements) {
            const txt = el.textContent.trim();
            const votes = parseVotesCount(txt);
            if (votes) {
                return votes;
            }
        }

        return 0;
    }

    function findRatingInCard(card) {
        const allDivs = [...card.querySelectorAll('div')].reverse(); // deepest first

        for (let div of allDivs) {
            const ratingSpan = [...div.querySelectorAll('span')].find(
                span => /^[0-5](\.\d)?$/.test(span.textContent.trim())
            );
            const stars = div.querySelectorAll('img[width="12"]');

            if (ratingSpan && stars.length == 5) {
                return ratingSpan;
            }
        }

        return null;
    }

    function addRatingError(card) {
        const ratingSpan = findRatingInCard(card);
        if (!ratingSpan) return;
        if (ratingSpan.nextSibling && ratingSpan.nextSibling.classList?.contains('ae-rating-error')) return;

        const rating = parseNumber(ratingSpan.textContent);
        if (!rating) return;

        const votes = extractVotesNearRating(card, ratingSpan);
        if (votes > 0) {
            const error = calculateRatingError(rating, votes);
            if (error !== null) {
                const errorSpan = document.createElement('span');
                errorSpan.className = 'ae-rating-error';
                errorSpan.style.fontSize = '1em';
                errorSpan.style.color = '#666';
                errorSpan.style.marginLeft = '2px';
                errorSpan.textContent = `±${error}`;
                ratingSpan.parentNode.insertBefore(errorSpan, ratingSpan.nextSibling);
            }
        }
    }


    function cleanCard(card) {
        if (seenCards.has(card)) return;
        seenCards.add(card);

        if (!config.cleanupEnabled) return;

        let cardCleanedCount = 0;

        // Remove elements by selector
        GARBAGE_SELECTORS.forEach(sel => {
            const elements = card.querySelectorAll(sel);
            elements.forEach(el => {
                // Don't hide if it contains important info
                const text = el.textContent.trim();
                const isImportant = /^\d+\.\d+$/.test(text) || // rating like "4.7"
                                  /\d+\+?\s*sold/i.test(text) || // sold count
                                  /^[\d,]+\.?\d*[€$¥£₽]/.test(text); // main price

                if (!isImportant) {
                    el.style.display = 'none';
                    cardCleanedCount++;
                    log(`[Clean] Hidden by selector "${sel}": "${text.substring(0, 30)}"`);
                }
            });
        });

        // Specifically target sale images by URL pattern
        const allImages = card.querySelectorAll('img');
        allImages.forEach(img => {
            const src = img.src || '';
            const shouldHide = SALE_IMAGE_PATTERNS.some(pattern => pattern.test(src));

            if (shouldHide) {
                // Hide the image and potentially its parent if it's just a container
                img.style.display = 'none';
                cardCleanedCount++;
                log(`[Clean] Hidden sale image: ${src.substring(src.lastIndexOf('/') + 1)}`);

                // If the parent only contains this image and no important text, hide parent too
                const parent = img.parentElement;
                if (parent && parent.children.length === 1 && parent.textContent.trim().length < 5) {
                    parent.style.display = 'none';
                    log(`[Clean] Hidden parent container of sale image`);
                }
            }
        });

        // Hide elements with line-through style (crossed prices)
        const allElements = card.querySelectorAll('*');
        allElements.forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.textDecoration.includes('line-through')) {
                const text = el.textContent.trim();
                // Only hide if it looks like a price or promotional text
                if (/[\d,]+[€$¥£₽]|%|off|sale/i.test(text)) {
                    el.style.display = 'none';
                    cardCleanedCount++;
                    log(`[Clean] Hidden crossed price: "${text}"`);
                }
            }
        });
    }

    function hideLowRatedAndPromoItems() {
        let hiddenCount = 0;
        const cards = document.querySelectorAll('.search-item-card-wrapper-gallery');

        log(`[Filter] Processing ${cards.length} cards`);

        cards.forEach((card, index) => {
            card.style.display = '';

            if (!config.filterEnabled) {
                // Even if filter is disabled, still clean the cards if cleanup is enabled
                cleanCard(card);
                return;
            }

            // Check for promo items
            const promoElements = card.querySelectorAll('span[class*="kt_"], div[class*="kt_"]');
            for (const element of promoElements) {
                if (PROMO_KEYWORDS.some(keyword => element.textContent.toLowerCase().includes(keyword.toLowerCase()))) {
                    card.style.display = 'none';
                    hiddenCount++;
                    log(`[Filter] Hidden promo: ${element.textContent.substring(0, 30)}`);
                    return;
                }
            }

            // Check rating and votes
            const ratingSpan = findRatingInCard(card);
            const rating = ratingSpan ? parseNumber(ratingSpan.textContent) : null;

            if (rating === null) {
                card.style.display = 'none';
                hiddenCount++;
                log(`[Filter] Hidden no rating: card ${index}`);
                return;
            }

            const votes = extractVotesNearRating(card, ratingSpan);
            // Check minimum votes requirement
            if (votes < config.minVotes) {
                card.style.display = 'none';
                hiddenCount++;
                log(`[Filter] Hidden low votes ${votes} (min: ${config.minVotes}): card ${index}`);
                return;
            }

            if (rating < config.minRating) {
                card.style.display = 'none';
                hiddenCount++;
                log(`[Filter] Hidden low rating ${rating}: card ${index}`);
                return;
            }

            /*  Uncomment this, if you use AliHelper and want to use it for filtering. Note that this is kinda unstable.

            // Check seller rating
            const sellerRatingEl = card.querySelector('.ah-rating');
            const sellerRating = sellerRatingEl ? parseNumber(sellerRatingEl.textContent) : null;

            if (sellerRating !== null && sellerRating < MIN_SELLER_SCORE) {
                card.style.display = 'none';
                hiddenCount++;
                log(`[Filter] Hidden bad seller ${sellerRating}%: card ${index}`);
                return;
            }

            // Also hide if there's a red "unreliable seller" label
            const badSellerLabel = card.querySelector('.ah-label-red');
            if (badSellerLabel) {
                card.style.display = 'none';
                hiddenCount++;
                log(`[Filter] Hidden unreliable seller: card ${index}`);
                return;
            }
            */

            // Clean the card (remove promotional elements)
            cleanCard(card);

            // Add statistical error to rating display
            addRatingError(card);
        });

        log(`[Filter] Hidden: ${hiddenCount}/${cards.length} cards`);
        updateStats(`Hidden: ${hiddenCount}/${cards.length} cards`);
    }

    function updateStats(newText) {
        const stats = document.getElementById('ae-filter-stats');
        if (stats) stats.textContent = newText;
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            fontSize: '12px',
            color: '#333',
            maxWidth: '220px',
            fontFamily: 'sans-serif'
        });

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom: 8px; font-size: 13px; text-align:center; color:#222; cursor: pointer;" id="ae-filter-header">🧹 AE Filter</div>
            <div id="ae-filter-body">
                <label><input type="checkbox" id="ae-toggle-filter"> Filter</label><br>
                <label><input type="checkbox" id="ae-toggle-cleanup"> Cleanup</label><br>
                <label><input type="checkbox" id="ae-toggle-debug"> Debug</label><br><br>
                <label>Min Rating: <span id="ae-rating-val">${config.minRating}</span></label><br>
                <input type="range" min="3.5" max="5" step="0.1" value="${config.minRating}" id="ae-min-rating"><br>
                <label>Min Votes: <span id="ae-votes-val">${config.minVotes}</span></label><br>
                <input type="range" min="0" max="500" step="10" value="${config.minVotes}" id="ae-min-votes"><br><br>
                <div id="ae-filter-stats" style="margin-top:6px; font-size:11px; color:#555; text-align:center;">Hidden: 0</div>
            </div>`;

        document.body.appendChild(panel);

        document.getElementById('ae-toggle-filter').checked = config.filterEnabled;
        document.getElementById('ae-toggle-cleanup').checked = config.cleanupEnabled;
        document.getElementById('ae-toggle-debug').checked = config.debugEnabled;

        document.getElementById('ae-toggle-filter').onchange = e => {
            config.filterEnabled = e.target.checked;
            saveConfig();
        };
        document.getElementById('ae-toggle-cleanup').onchange = e => {
            config.cleanupEnabled = e.target.checked;
            saveConfig();
        };
        document.getElementById('ae-toggle-debug').onchange = e => {
            config.debugEnabled = e.target.checked;
            saveConfig();
        };

        document.getElementById('ae-filter-header').onclick = () => {
            const body = document.getElementById('ae-filter-body');
            body.style.display = body.style.display === 'none' ? 'block' : 'none';
        };
        document.getElementById('ae-min-rating').oninput = e => {
            config.minRating = parseFloat(e.target.value);
            document.getElementById('ae-rating-val').textContent = config.minRating;
            saveConfig();
        };
        document.getElementById('ae-min-votes').oninput = e => {
            config.minVotes = parseInt(e.target.value);
            document.getElementById('ae-votes-val').textContent = config.minVotes;
            saveConfig();
        };
    }

    function monitorUrlChanges() {
        setInterval(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                log('[Filter] URL changed → restarting filter');
                setTimeout(() => hideLowRatedAndPromoItems(), 1000);
            }
        }, 1000);
    }


    let lastRun = 0;
    let pendingTimeout = null;
    const MIN_DELAY = 300; // ms
    function throttle(f) {
        const now = Date.now();

        if (now - lastRun > MIN_DELAY) {
            lastRun = now;
            f();
        } else if (!pendingTimeout) {
            pendingTimeout = setTimeout(() => {
                lastRun = Date.now();
                pendingTimeout = null;
                f();
            }, MIN_DELAY);
        }
    }

    function throttledHide() {
        throttle(() => {
            log("Execution allowed, starting...");
            hideLowRatedAndPromoItems();
        });
    }

    pendingTimeout = setTimeout(throttledHide, 1000);

    const observer = new MutationObserver(throttledHide);
    observer.observe(document.body, { childList: true, subtree: true });

    monitorUrlChanges();

    // Launch
    createControlPanel();
    log('[AliExpress Filter v2.3] started');
})();