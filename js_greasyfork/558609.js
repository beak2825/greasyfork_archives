// ==UserScript==
// @name         SoldBy pour amazon
// @name:fr      SoldBy - Révéler les vendeurs sur Amazon 
// @namespace    https://greasyfork.org/users/108513
// @version      2.2.1
// @description  révèles l'origine des vendeurs sur amazon
// @author       seb-du17
// @license      MIT
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.com.be/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.com.tr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.se/*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-idle
// @compatible   firefox Optimized for Firefox 146
// @downloadURL https://update.greasyfork.org/scripts/558609/SoldBy%20pour%20amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/558609/SoldBy%20pour%20amazon.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
/* global AbortController, IntersectionObserver, DOMParser, Intl */

(function() {
    'use strict';

    // ========== Configuration TURBO ==========
    const CONFIG = {
        HIGHLIGHTED_COUNTRIES: ['CN', 'HK'],
        HIGHLIGHT_UNKNOWN: true,
        HIDE_HIGHLIGHTED: false,
        MAX_ASIN_AGE_DAYS: 3, // Garde le cache plus longtemps pour moins recharger
        MAX_SELLER_AGE_DAYS: 14,
        FETCH_TIMEOUT: 5000, // Timeout plus court pour ne pas bloquer la file
        MAX_CONCURRENT_FETCHES: 25, // Augmenté de 10 à 25
        DEBOUNCE_DELAY: 100, // Plus réactif au scroll
        PRELOAD_MARGIN: '1500px', // Prépare plus loin en avance
        IMMEDIATE_PROCESS_COUNT: 40, // Traite les 40 premiers items direct
        LAZY_COUNTRY_FETCH: true,
        DEBUG: false
    };

    // ========== Regex précompilées ==========
    const REGEX = {
        ASIN_DP: /\/dp\/(.*?)(?:$|\?|\/)/,
        COUNTRY_CODE: /^[A-Z]{2}$/,
        RATING_DEFAULT: /(\d+%).*?\((\d+)/,
        RATING_TURKISH: /(%\d+).*?\((\d+)/,
        RATING_GERMAN: /(\d+ %).*?\((\d+)/
    };

    // ========== Sélecteurs précompilés ==========
    const SELECTORS = {
        PRODUCTS_WITHOUT_ASIN: [
            '.a-carousel-card > div:not([data-asin])',
            '.octopus-pc-item:not([data-asin])',
            'li[class*=ProductGridItem__]:not([data-asin])',
            'div[class*=_octopus-search-result-card_style_apbSearchResultItem]:not([data-asin])',
            '.sbv-product:not([data-asin])',
            '.a-cardui #gridItemRoot:not([data-asin])'
        ].join(','),

        PRODUCTS_WITH_ASIN: [
            'div[data-asin]:not([data-asin=""])',
            ':not([data-seller-processed])',
            ':not([data-uuid*=s-searchgrid-carousel])',
            ':not([role="img"])',
            ':not(.a-hidden)'
        ].join(''),

        SPECIAL_PAGES: [
            '#gc-detail-page',
            '.reload_gc_balance',
            '#dp.digitaltextfeeds',
            '#dp.magazine',
            '#dp.ebooks',
            '#dp.audible',
            '.av-page-desktop',
            '.avu-retail-page'
        ].join(','),

        THIRD_PARTY_SELLER: [
            '#desktop_qualifiedBuyBox :not(#usedAccordionRow) #sellerProfileTriggerId',
            '#desktop_qualifiedBuyBox :not(#usedAccordionRow) #merchant-info a:first-of-type',
            '#exports_desktop_qualifiedBuybox :not(#usedAccordionRow) #sellerProfileTriggerId',
            '#exports_desktop_qualifiedBuybox :not(#usedAccordionRow) #merchant-info a:first-of-type'
        ].join(',')
    };

    // ========== Cache mémoire ==========
    const memoryCache = {
        asins: new Map(),
        sellers: new Map()
    };

    // ========== Queue de fetch ==========
    const fetchQueue = [];
    let activeFetches = 0;
    let debounceTimer;
    let intersectionObserver;

    // PATCH: évite les observe() multiples sur les mêmes nodes
    const observedProducts = new WeakSet();

    // ========== Fetch avec timeout ==========
    function fetchWithTimeout(url, timeout) {
        return new Promise(function(resolve, reject) {
            const controller = new AbortController();
            const timeoutId = setTimeout(function() {
                controller.abort();
                reject(new Error('Timeout'));
            }, timeout);

            fetch(url, {
                signal: controller.signal,
                // priority: 'low' supprimé pour aller plus vite
            })
            .then(function(response) {
                clearTimeout(timeoutId);
                if (response.ok) {
                    return response.text();
                }
                throw new Error('HTTP ' + response.status);
            })
            .then(resolve)
            .catch(reject);
        });
    }

    // ========== Process single fetch item ==========
    function processFetchItem(item) {
        fetchWithTimeout(item.url, CONFIG.FETCH_TIMEOUT)
            .then(function(html) {
                item.resolve(html);
            })
            .catch(function(err) {
                if (CONFIG.DEBUG) {
                    console.warn('[SoldBy] Fetch failed:', item.url, err);
                }
                item.resolve(null);
            })
            .finally(function() {
                activeFetches--;
                if (fetchQueue.length) {
                    processQueue();
                }
            });
    }

    // ========== Queue processor ==========
    function processQueue() {
        while (fetchQueue.length && activeFetches < CONFIG.MAX_CONCURRENT_FETCHES) {
            const item = fetchQueue.shift();
            activeFetches++;
            processFetchItem(item);
        }
    }

    function queueFetch(url) {
        return new Promise(function(resolve) {
            fetchQueue.push({ url: url, resolve: resolve });
            processQueue();
        });
    }

    // ========== LocalStorage avec cache mémoire ==========
    function getFromStorage(key) {
        if (memoryCache.asins.has(key)) {
            return memoryCache.asins.get(key);
        }
        if (memoryCache.sellers.has(key)) {
            return memoryCache.sellers.get(key);
        }

        const value = localStorage.getItem(key);
        if (!value) { return null; }

        try {
            const parsed = JSON.parse(value);
            if (key.startsWith('asin-')) {
                memoryCache.asins.set(key, parsed);
            } else if (key.startsWith('seller-')) {
                memoryCache.sellers.set(key, parsed);
            }
            return parsed;
        } catch (e) {
            return null;
        }
    }

    function saveToStorage(key, value) {
        const json = JSON.stringify(value);
        localStorage.setItem(key, json);

        if (key.startsWith('asin-')) {
            memoryCache.asins.set(key, value);
            if (memoryCache.asins.size > 500) { // Cache mémoire augmenté
                const firstKey = memoryCache.asins.keys().next().value;
                memoryCache.asins.delete(firstKey);
            }
        } else if (key.startsWith('seller-')) {
            memoryCache.sellers.set(key, value);
            if (memoryCache.sellers.size > 300) { // Cache mémoire augmenté
                const firstKey = memoryCache.sellers.keys().next().value;
                memoryCache.sellers.delete(firstKey);
            }
        }
    }

    function isExpired(timestamp, maxAgeDays) {
        const age = Date.now() - timestamp;
        const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
        return age > maxAge;
    }

    // ========== Extract ASIN from product ==========
    function extractAsin(product) {
        const link = product.querySelector('a:not(.s-grid-status-badge-container > a):not(.a-popover-trigger)');
        if (!link) { return null; }

        const href = decodeURIComponent(link.href);
        const searchParams = new URLSearchParams(href);
        if (searchParams.get('pd_rd_i')) {
            return searchParams.get('pd_rd_i');
        }

        const match = href.match(REGEX.ASIN_DP);
        return match ? match[1] : null;
    }

    // ========== Parse HTML ==========
    function parseHTML(html) {
        return new DOMParser().parseFromString(html, 'text/html');
    }

    // ========== Get seller from product page ==========
    function getSellerFromProductPage(html) {
        const doc = parseHTML(html);

        if (doc.querySelector(SELECTORS.SPECIAL_PAGES)) {
            return { name: 'Amazon', id: null };
        }

        const sellerLink = doc.querySelector(SELECTORS.THIRD_PARTY_SELLER);
        if (sellerLink) {
            const params = new URLSearchParams(sellerLink.href);
            const sellerId = params.get('seller');
            const sellerName = sellerLink.textContent.trim().replace(/\"/g, '\"');
            return { name: sellerName, id: sellerId };
        }

        const merchantInfo = doc.querySelector('#merchant-info') ||
                             doc.querySelector('#tabular-buybox .tabular-buybox-text') ||
                             doc.querySelector('[offer-display-feature-name="desktop-merchant-info"]');

        if (merchantInfo && merchantInfo.textContent.trim().replace(/\s/g, '').length) {
            return { name: 'Amazon', id: null };
        }

        return { name: '? ? ?', id: null };
    }

    // ========== Get seller details from seller page ==========
    function getSellerDetailsFromSellerPage(html) {
        const doc = parseHTML(html);
        const container = doc.getElementById('seller-profile-container');
        if (!container) { return null; }

        const isRedesign = container.classList.contains('spp-redesigned');
        let country = '?';

        if (isRedesign) {
            const addresses = doc.querySelectorAll('#page-section-detail-seller-info .a-box-inner .a-row.a-spacing-none.indent-left');
            if (addresses.length) {
                const lastAddr = addresses[addresses.length - 1];
                const text = lastAddr.textContent.toUpperCase();
                if (REGEX.COUNTRY_CODE.test(text)) {
                    country = text;
                }
            }
        } else {
            const lists = doc.querySelectorAll('ul.a-unordered-list.a-nostyle.a-vertical');
            if (lists.length) {
                const lastList = lists[lists.length - 1];
                const items = lastList.querySelectorAll('li');
                if (items.length) {
                    const text = items[items.length - 1].textContent.toUpperCase();
                    if (REGEX.COUNTRY_CODE.test(text)) {
                        country = text;
                    }
                }
            }
        }

        const sellerName = doc.getElementById('seller-name');
        if (sellerName && sellerName.textContent.includes('Amazon')) {
            return { country: country, ratingScore: 'N/A', ratingCount: '0' };
        }

        const feedbackEl = doc.getElementById('seller-info-feedback-summary');
        if (!feedbackEl) {
            return { country: country, ratingScore: '0%', ratingCount: '0' };
        }

        const desc = feedbackEl.querySelector('.feedback-detail-description');
        const star = feedbackEl.querySelector('.a-icon-alt');

        if (!desc || !star) {
            return { country: country, ratingScore: '0%', ratingCount: '0' };
        }

        let text = desc.textContent.replace(star.textContent, '');
        const lang = document.documentElement.lang;
        let regex = REGEX.RATING_DEFAULT;
        let zeroPercent = '0%';

        if (lang === 'tr-tr') {
            regex = REGEX.RATING_TURKISH;
            zeroPercent = '%0';
        } else if (lang === 'de-de' || lang === 'fr-be') {
            regex = REGEX.RATING_GERMAN;
            zeroPercent = '0 %';
        }

        const match = text.match(regex);
        return {
            country: country,
            ratingScore: match ? match[1] : zeroPercent,
            ratingCount: match ? match[2] : '0'
        };
    }

    // ========== Flag emoji ==========
    function getFlagEmoji(countryCode) {
        if (countryCode === '?') { return '❓'; }
        const codePoints = [];
        for (let i = 0; i < countryCode.length; i++) {
            codePoints.push(127397 + countryCode.charCodeAt(i));
        }
        return String.fromCodePoint.apply(null, codePoints);
    }

    // ========== Find product title ==========
    function findTitle(product) {
        if (product.dataset.avar) {
            return product.querySelector('.a-color-base.a-spacing-none.a-link-normal');
        }
        if (product.parentElement && product.parentElement.classList.contains('a-carousel-card')) {
            return product.querySelector('h2') || product.querySelectorAll('.a-link-normal')[1];
        }
        if (product.id === 'gridItemRoot') {
            return product.querySelectorAll('.a-link-normal')[1];
        }
        const h2 = product.querySelector('h2');
        if (h2) { return h2; }

        return product.querySelector('.a-link-normal');
    }

    // ========== Create info box ==========
    function createInfoBox(product) {
        const container = document.createElement('div');
        container.className = 'sb-info-ct';

        const box = document.createElement('div');
        box.className = 'sb-info';

        const icon = document.createElement('div');
        icon.className = 'sb-icon sb-loading';

        const text = document.createElement('div');
        text.className = 'sb-text';
        text.textContent = 'Loading...';

        box.appendChild(icon);
        box.appendChild(text);
        container.appendChild(box);

        const title = findTitle(product);
        if (title && title.parentNode) {
            title.parentNode.insertBefore(container, title.nextSibling);
        } else {
            product.appendChild(container);
        }
    }

    // ========== Update info box ==========
    function updateInfoBox(product, sellerData) {
        const container = product.querySelector('.sb-info-ct');
        if (!container) { return; }

        const box = container.querySelector('.sb-info');
        const icon = container.querySelector('.sb-icon');
        const text = container.querySelector('.sb-text');

        icon.classList.remove('sb-loading');

        if (sellerData.name === 'Amazon' || sellerData.name.includes('Amazon')) {
            const img = document.createElement('img');
            img.src = '/favicon.ico';
            icon.innerHTML = '';
            icon.appendChild(img);
            text.textContent = sellerData.name;
            box.title = sellerData.name;
            return;
        }

        if (sellerData.name === '? ? ?') {
            icon.textContent = '❓';
            icon.style.fontSize = '1.5em';
            text.textContent = 'Unknown';
            return;
        }

        if (!sellerData.country) {
            icon.textContent = '⏳';
            icon.style.fontSize = '1.5em';
            text.textContent = sellerData.name;
            box.title = 'Loading country info...';
        } else {
            icon.textContent = getFlagEmoji(sellerData.country);
            text.textContent = sellerData.name;

            if (sellerData.ratingScore && sellerData.ratingCount) {
                text.textContent += ' (' + sellerData.ratingScore + ' | ' + sellerData.ratingCount + ')';
            }

            let title = '';
            if (sellerData.country && sellerData.country !== '?') {
                try {
                    const displayNames = new Intl.DisplayNames([document.documentElement.lang], { type: 'region' });
                    title = displayNames.of(sellerData.country) + ' | ';
                } catch (e) {
                    title = sellerData.country + ' | ';
                }
            }

            title += sellerData.name;
            if (sellerData.ratingScore) {
                title += ' (' + sellerData.ratingScore + ' | ' + sellerData.ratingCount + ')';
            }

            box.title = title;

            if (CONFIG.HIGHLIGHTED_COUNTRIES.indexOf(sellerData.country) !== -1 ||
                (CONFIG.HIGHLIGHT_UNKNOWN && sellerData.country === '?')) {

                product.classList.add('sb-highlight');

                if (CONFIG.HIDE_HIGHLIGHTED) {
                    let hideElement = product;
                    if (product.parentElement && product.parentElement.classList.contains('a-carousel-card')) {
                        hideElement = product.parentElement;
                    }
                    hideElement.classList.add('sb-hide');
                }
            }

            if (sellerData.id) {
                const existing = container.querySelector('.sb-link');
                if (!existing) {
                    const link = document.createElement('a');
                    link.className = 'sb-link';
                    link.href = window.location.origin + '/sp?seller=' + sellerData.id;
                    link.appendChild(box.cloneNode(true));
                    container.innerHTML = '';
                    container.appendChild(link);
                }
            }
        }
    }

    // ========== Process single product ==========
    function processProduct(product) {
        const asin = product.dataset.asin;
        if (!asin) { return; }

        product.dataset.sellerProcessed = '1';
        createInfoBox(product);

        const asinKey = 'asin-' + asin;
        const cached = getFromStorage(asinKey);

        if (cached && !isExpired(cached.ts, CONFIG.MAX_ASIN_AGE_DAYS)) {
            const sellerData = { name: cached.sn, id: cached.sid };

            if (cached.sid && cached.sid !== 'Amazon') {
                const sellerKey = 'seller-' + cached.sid;
                const sellerCached = getFromStorage(sellerKey);

                if (sellerCached && !isExpired(sellerCached.ts, CONFIG.MAX_SELLER_AGE_DAYS)) {
                    sellerData.country = sellerCached.c;
                    sellerData.ratingScore = sellerCached.rs;
                    sellerData.ratingCount = sellerCached.rc;
                    updateInfoBox(product, sellerData);
                    return;
                }
            }

            if (CONFIG.LAZY_COUNTRY_FETCH) {
                updateInfoBox(product, sellerData);
                fetchSellerDetails(product, sellerData);
            } else {
                fetchSellerDetails(product, sellerData);
            }
            return;
        }

        updateInfoBox(product, { name: 'Processing...', id: null });

        const url = window.location.origin + '/dp/' + asin + '?psc=1';
        queueFetch(url).then(function(html) {
            if (!html) { return; }

            const sellerData = getSellerFromProductPage(html);
            saveToStorage(asinKey, {
                sn: sellerData.name,
                sid: sellerData.id,
                ts: Date.now()
            });

            if (sellerData.name === 'Amazon' || !sellerData.id) {
                updateInfoBox(product, sellerData);
            } else {
                if (CONFIG.LAZY_COUNTRY_FETCH) {
                    updateInfoBox(product, sellerData);
                    fetchSellerDetails(product, sellerData);
                } else {
                    fetchSellerDetails(product, sellerData);
                }
            }
        });
    }

    // ========== Fetch seller details ==========
    function fetchSellerDetails(product, sellerData) {
        const sellerKey = 'seller-' + sellerData.id;
        const url = window.location.origin + '/sp?seller=' + sellerData.id;

        queueFetch(url).then(function(html) {
            if (!html) {
                updateInfoBox(product, sellerData);
                return;
            }

            const details = getSellerDetailsFromSellerPage(html);
            if (details) {
                sellerData.country = details.country;
                sellerData.ratingScore = details.ratingScore;
                sellerData.ratingCount = details.ratingCount;

                saveToStorage(sellerKey, {
                    c: details.country,
                    rs: details.ratingScore,
                    rc: details.ratingCount,
                    ts: Date.now()
                });

                updateInfoBox(product, sellerData);
            }
        });
    }

    // ========== Extract ASINs from products ==========
    function extractAsins() {
        const products = document.querySelectorAll(SELECTORS.PRODUCTS_WITHOUT_ASIN);
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const asin = extractAsin(product);
            if (asin) {
                product.dataset.asin = asin;
            }
        }
    }

    // ========== Handle intersection ==========
    function handleIntersection(entry) {
        if (entry.isIntersecting) {
            processProduct(entry.target);
            intersectionObserver.unobserve(entry.target);
        }
    }

    // ========== Scan for new products ==========
    function scanProducts() {
        extractAsins();
        const products = document.querySelectorAll(SELECTORS.PRODUCTS_WITH_ASIN);
        for (let i = 0; i < products.length; i++) {
            const p = products[i];
            if (!observedProducts.has(p)) {
                observedProducts.add(p);
                intersectionObserver.observe(p);
            }
        }
    }

    // ========== Process immediate products ==========
    function processImmediateProducts() {
        extractAsins();
        const products = document.querySelectorAll(SELECTORS.PRODUCTS_WITH_ASIN);
        const toProcess = Math.min(CONFIG.IMMEDIATE_PROCESS_COUNT, products.length);

        for (let i = 0; i < toProcess; i++) {
            processProduct(products[i]);
        }

        for (let i = toProcess; i < products.length; i++) {
            const p = products[i];
            if (!observedProducts.has(p)) {
                observedProducts.add(p);
                intersectionObserver.observe(p);
            }
        }

        if (CONFIG.DEBUG) {
            console.log('[SoldBy] Processed ' + toProcess + ' products immediately');
        }
    }

    // ========== Debounced scan ==========
    function debouncedScan() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(scanProducts, CONFIG.DEBOUNCE_DELAY);
    }

    // ========== IntersectionObserver ==========
    intersectionObserver = new IntersectionObserver(
        function(entries) {
            for (let i = 0; i < entries.length; i++) {
                handleIntersection(entries[i]);
            }
        },
        { rootMargin: CONFIG.PRELOAD_MARGIN }
    );

    // ========== MutationObserver ==========
    const mutationObserver = new MutationObserver(function(mutations) {
        for (let i = 0; i < mutations.length; i++) {
            const m = mutations[i];
            if (m.type === 'childList' && m.addedNodes && m.addedNodes.length) {
                debouncedScan();
                return; // PATCH: un seul déclenchement suffit
            }
        }
    });

    // ========== CSS ==========
    function injectCSS() {
        const css = `
            .sb-hide { display: none !important; }
            .sb-info-ct { margin-top: 4px; cursor: default; }
            .sb-info {
                display: inline-flex; gap: 4px; background: #fff;
                font-size: 0.9em; padding: 2px 4px;
                border: 1px solid #d5d9d9; border-radius: 4px; max-width: 100%;
            }
            .sb-loading {
                display: inline-block; width: 0.8em; height: 0.8em;
                border: 3px solid rgba(255, 153, 0, 0.3); border-radius: 50%;
                border-top-color: #ff9900; animation: sb-spin 1s ease-in-out infinite;
                margin: 1px 3px 0;
            }
            @keyframes sb-spin { to { transform: rotate(360deg); } }
            .sb-icon { vertical-align: text-top; text-align: center; font-size: 1.8em; }
            .sb-icon img { width: 0.82em; height: 0.82em; }
            .sb-text {
                color: #1d1d1d !important; white-space: nowrap;
                text-overflow: ellipsis; overflow: hidden;
            }
            a.sb-link:hover .sb-info {
                box-shadow: 0 2px 5px 0 rgba(213, 217, 217, 0.5);
                background-color: #f7fafa;
            }
            .sb-highlight .s-card-container,
            .sb-highlight[data-avar],
            .sb-highlight .s-card-border {
                background-color: #f9e3e4 !important;
                border-color: #e3abae !important;
            }
            .sb-highlight .s-card-drop-shadow {
                box-shadow: none; border: 1px solid #e3abae;
            }
        `;
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ========== Init ==========
    function init() {
        injectCSS();
        processImmediateProducts();
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        if (CONFIG.DEBUG) {
            console.log('[SoldBy] Initialized - Lazy country fetch enabled');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
