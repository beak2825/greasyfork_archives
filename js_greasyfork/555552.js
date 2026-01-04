// ==UserScript==
// @name         AliExpress - Bundle Deals Filter
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Toggle filter with 3 states: All products, Hide bundles, Show only bundles
// @author       You
// @license      MIT
// @match        https://*.aliexpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555552/AliExpress%20-%20Bundle%20Deals%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/555552/AliExpress%20-%20Bundle%20Deals%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Filter states: 'all', 'hide-bundles', 'only-bundles'
    let filterState = 'all';
    let observer = null;

    const SELECTORS = [
        '.search-item-card-wrapper-gallery',
        '.search-item-card-wrapper',
        '[class*="search-card"]',
        '[class*="product-card"]',
        '[class*="item-card"]',
        'a[href*="/item/"]'
    ];

    // Find all product cards
    function getAllProducts() {
        const products = new Set();

        SELECTORS.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const card = el.closest('[class*="card"]') || el;
                if (card?.querySelector('a[href]')) {
                    products.add(card);
                }
            });
        });

        return Array.from(products);
    }

    // Check if product has bundle deals - SIMPLE VERSION
    function hasBundleDeals(product) {
        // Method 1: Check URL for BundleDeals
        const link = product.querySelector('a[href]');
        if (link?.href.includes('BundleDeals')) {
            return true;
        }

        // Method 2: Check for bundle text indicators
        const text = product.textContent;
        const bundleIndicators = [
            'Packs de ofertas',
            'Bundle deals',
            'Pack deals',
            'Ofertas de paquete',
            'Pacotes de ofertas',
            'Offres groupées',
            '组合优惠',
            'バンドル',
            '번들'
        ];

        return bundleIndicators.some(indicator => text.includes(indicator));
    }

    // Apply filter based on current state
    function filterProducts() {
        const products = getAllProducts();
        if (products.length === 0) return null;

        let bundleCount = 0;
        let nonBundleCount = 0;

        products.forEach(product => {
            const isBundle = hasBundleDeals(product);

            if (isBundle) bundleCount++;
            else nonBundleCount++;

            let shouldHide = false;

            if (filterState === 'hide-bundles' && isBundle) {
                shouldHide = true;
            } else if (filterState === 'only-bundles' && !isBundle) {
                shouldHide = true;
            }

            if (shouldHide) {
                product.style.display = 'none';
            } else {
                product.style.display = '';
            }
        });

        console.log(`State: ${filterState} | Bundles: ${bundleCount} | Regular: ${nonBundleCount}`);

        return {
            total: products.length,
            bundles: bundleCount,
            nonBundles: nonBundleCount
        };
    }

    // Debounced filter application
    let filterTimeout = null;
    function scheduleFilter() {
        if (filterState === 'all') return;

        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(() => {
            filterProducts();
        }, 150);
    }

    // Initialize observer
    function initObserver() {
        observer?.disconnect();

        observer = new MutationObserver(scheduleFilter);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Cycle through filter states
    function cycleFilterState() {
        switch(filterState) {
            case 'all':
                filterState = 'hide-bundles';
                break;
            case 'hide-bundles':
                filterState = 'only-bundles';
                break;
            case 'only-bundles':
                filterState = 'all';
                break;
        }

        return { state: filterState, stats: filterProducts() };
    }

    // Wait for products to load
    function waitForProducts() {
        let attempts = 0;
        const interval = setInterval(() => {
            if (getAllProducts().length > 0 || ++attempts >= 30) {
                clearInterval(interval);
                initObserver();
            }
        }, 500);
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForProducts);
    } else {
        waitForProducts();
    }

    // Create toggle button
    window.addEventListener('load', () => {
        const button = document.createElement('button');
        button.innerHTML = '📦 <span style="font-weight: 900;">ALL</span>';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 24px;
            background: #666;
            color: white;
            border: 2px solid #555;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

        const updateButton = (state) => {
            let icon, text, bg, border;

            switch(state) {
                case 'hide-bundles':
                    icon = '🚫';
                    text = 'HIDE BUNDLES';
                    bg = '#FF6B35';
                    border = '#FF4500';
                    break;
                case 'only-bundles':
                    icon = '✅';
                    text = 'ONLY BUNDLES';
                    bg = '#4CAF50';
                    border = '#388E3C';
                    break;
                default: // 'all'
                    icon = '📦';
                    text = 'ALL';
                    bg = '#666';
                    border = '#555';
            }

            button.innerHTML = `${icon} <span style="font-weight: 900;">${text}</span>`;
            button.style.background = bg;
            button.style.borderColor = border;
        };

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        });

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = 'scale(1)', 100);

            const result = cycleFilterState();
            updateButton(result.state);
        });

        document.body.appendChild(button);
    });
})();