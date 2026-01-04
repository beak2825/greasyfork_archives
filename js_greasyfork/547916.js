// ==UserScript==
// @name         Weee vs. Yami Price Comparator
// @namespace    https://github.com/Zhenghao-Dai/Weee-vs-Yami-Price-Comparator
// @version      1.2
// @description  Compares prices between Weee and Yamibuy on their product pages, and provides a link to the cheaper option.
// @author       Zhenghao Dai
// @match        *://*.sayweee.com/*
// @match        *://*.yami.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sayweee.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        window.close
// @homepage     https://github.com/Zhenghao-Dai/Weee-vs-Yami-Price-Comparator
// @supportURL   https://github.com/Zhenghao-Dai/Weee-vs-Yami-Price-Comparator/issues
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/547916/Weee%20vs%20Yami%20Price%20Comparator.user.js
// @updateURL https://update.greasyfork.org/scripts/547916/Weee%20vs%20Yami%20Price%20Comparator.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const SITES = {
        weee: {
            name: 'Weee!',
            url: 'sayweee.com',
            productPageIdentifier: '/product/',
            searchPageIdentifier: '/search',
            productTitleSelector: 'h1',
            searchResultItemSelector: 'a[data-testid="wid-product-card-container"]',
            searchResultNameSelector: '[data-testid="wid-product-card-title"]',
            searchResultPriceSelector: '[data-testid="wid-product-card-price"]',
            getSearchUrl: (name) => `https://www.yami.com/zh/search?q=${encodeURIComponent(name)}`,
            competitorName: 'Yami',
            productToSearchKey: 'priceComparatorProductToSearch',
            resultKey: 'priceComparatorResult',
            priceCleaner: (priceText) => priceText.replace(/[^\d.]/g, '')
        },
        yami: {
            name: 'Yami',
            url: 'yami.com',
            productPageIdentifier: '/p/',
            searchPageIdentifier: '/search',
            productTitleSelector: 'h1',
            searchResultItemSelector: '.search-items .item-card',
            searchResultNameSelector: '.item-title a',
            searchResultPriceSelector: '[data-qa-itemcard-price-txt]',
            getSearchUrl: (name) => `https://www.sayweee.com/zh/search/${encodeURIComponent(name)}?keyword=${encodeURIComponent(name)}&trigger_type=search_active`,
            competitorName: 'Weee!',
            productToSearchKey: 'priceComparatorProductToSearch',
            resultKey: 'priceComparatorResult',
            priceCleaner: (priceText) => priceText.replace(/[^\d.]/g, '')
        }
    };

    function initProductPage(config) {
        let comparisonInterval;
        let comparisonBox;

        function showMessage(element, message, isError = false) {
            element.innerHTML = message;
            element.style.backgroundColor = isError ? '#E84A5F' : '#f8f8f8';
            element.style.color = isError ? 'white' : '#333';
        }

        function removeComparisonBox() {
            if (comparisonBox) comparisonBox.remove();
            comparisonBox = null;
            if (comparisonInterval) clearInterval(comparisonInterval);
        }

        function runComparison() {
            removeComparisonBox();
            const productNameElement = document.querySelector(config.productTitleSelector);
            if (!productNameElement || !productNameElement.innerText) return;

            comparisonBox = document.createElement('div');
            comparisonBox.style.padding = '8px';
            comparisonBox.style.marginTop = '10px';
            comparisonBox.style.marginBottom = '10px';
            comparisonBox.style.border = '1px solid #ddd';
            comparisonBox.style.borderRadius = '4px';
            productNameElement.insertAdjacentElement('afterend', comparisonBox);

            const productName = productNameElement.innerText;
            showMessage(comparisonBox, `Comparing price on ${config.competitorName}...`);
            GM_setValue(config.productToSearchKey, productName);
            GM_setValue(config.resultKey, 'SEARCHING');

            const searchUrl = config.getSearchUrl(productName);
            console.log(`Searching ${config.competitorName} with URL:`, searchUrl);
            GM_openInTab(searchUrl, { active: false });

            comparisonInterval = setInterval(() => {
                const result = GM_getValue(config.resultKey);
                if (result && result !== 'SEARCHING') {
                    if (result.error) {
                        showMessage(comparisonBox, result.error, true);
                    } else {
                        const link = result.url ? `<a href="${result.url}" target="_blank">${result.name}</a>` : result.name;
                        showMessage(comparisonBox, `<span>${config.competitorName}:</span> <strong>${link}</strong> - <strong>${result.price}</strong>`);
                    }
                    GM_deleteValue(config.productToSearchKey);
                    GM_deleteValue(config.resultKey);
                    clearInterval(comparisonInterval);
                }
            }, 1000);
        }

        let currentHref = window.location.href;
        function handlePageChange() {
            if (window.location.href.includes(config.productPageIdentifier)) {
                // Use MutationObserver to wait for the title element
                const observer = new MutationObserver((mutations, obs) => {
                    const titleElement = document.querySelector(config.productTitleSelector);
                    if (titleElement && titleElement.innerText) {
                        obs.disconnect();
                        runComparison();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                removeComparisonBox();
            }
        }

        handlePageChange();
        setInterval(() => {
            if (currentHref !== window.location.href) {
                currentHref = window.location.href;
                handlePageChange();
            }
        }, 500);
    }

    function initWeeeSearchPage(config) {
        if (GM_getValue(config.productToSearchKey)) {
            let timeoutId = setTimeout(() => {
                GM_setValue(config.resultKey, { error: `No products found on ${config.name}.` });
                window.close();
            }, 10000);

            const observer = new MutationObserver((mutations, obs) => {
                const firstItem = document.querySelector(config.searchResultItemSelector);
                if (firstItem) {
                    const itemNameElement = firstItem.querySelector(config.searchResultNameSelector);
                    const priceElement = firstItem.querySelector(config.searchResultPriceSelector);

                    if (itemNameElement && priceElement) {
                        const result = {
                            name: itemNameElement.innerText.trim(),
                            price: config.priceCleaner(priceElement.innerText),
                            url: firstItem.href
                        };
                        GM_setValue(config.resultKey, result);
                        clearTimeout(timeoutId);
                        obs.disconnect();
                        window.close();
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function initYamiSearchPage(config) {
        if (GM_getValue(config.productToSearchKey)) {
            let timeoutId = setTimeout(() => {
                GM_setValue(config.resultKey, { error: `No products found on ${config.name}.` });
                window.close();
            }, 10000);

            const observer = new MutationObserver((mutations, obs) => {
                const firstItem = document.querySelector(config.searchResultItemSelector);
                if (firstItem) {
                    const itemNameElement = firstItem.querySelector(config.searchResultNameSelector);
                    const priceElement = firstItem.querySelector(config.searchResultPriceSelector);

                    if (itemNameElement && priceElement) {
                        const result = {
                            name: itemNameElement.innerText.trim(),
                            price: config.priceCleaner(priceElement.innerText),
                            url: itemNameElement.href
                        };
                        GM_setValue(config.resultKey, result);
                        clearTimeout(timeoutId);
                        obs.disconnect();
                        window.close();
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // --- Main Logic ---
    const currentUrl = window.location.href;
    if (currentUrl.includes(SITES.weee.url)) {
        if (currentUrl.includes(SITES.weee.searchPageIdentifier)) {
            initWeeeSearchPage(SITES.weee);
        } else {
            initProductPage(SITES.weee);
        }
    } else if (currentUrl.includes(SITES.yami.url)) {
        if (currentUrl.includes(SITES.yami.searchPageIdentifier)) {
            initYamiSearchPage(SITES.yami);
        } else {
            initProductPage(SITES.yami);
        }
    }
})();
