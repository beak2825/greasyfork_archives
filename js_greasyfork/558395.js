// ==UserScript==
// @name         Ciela - скриване на неналични продукти
// @namespace    ciela-filter-hide-unavailable
// @match        https://www.ciela.com/*
// @match        https://ciela.com/*
// @version      1.0
// @description  Скрий всички неналични продукти в Ciela.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558395/Ciela%20-%20%D1%81%D0%BA%D1%80%D0%B8%D0%B2%D0%B0%D0%BD%D0%B5%20%D0%BD%D0%B0%20%D0%BD%D0%B5%D0%BD%D0%B0%D0%BB%D0%B8%D1%87%D0%BD%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/558395/Ciela%20-%20%D1%81%D0%BA%D1%80%D0%B8%D0%B2%D0%B0%D0%BD%D0%B5%20%D0%BD%D0%B0%20%D0%BD%D0%B5%D0%BD%D0%B0%D0%BB%D0%B8%D1%87%D0%BD%D0%B8%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Core hide function
    function hideUnavailable(root=document) {
        const items = root.querySelectorAll('li.item.product.product-item');
        items.forEach(item => {
            const unavailable =
                item.querySelector('.label-unavailable, .stock.unavailable, .product-label.label-unavailable') ||
                item.innerText.includes('Не е наличен');

            if (unavailable) {
                item.style.display = 'none';
            }
        });
    }

    // Initial run
    hideUnavailable();

    // Watch for new product tiles (used for infinite scroll / AJAX loads)
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    // If a product LI appears directly
                    if (node.matches?.('li.item.product.product-item')) {
                        hideUnavailable(node);
                    }
                    // Or if a container with many items is injected
                    hideUnavailable(node);
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
