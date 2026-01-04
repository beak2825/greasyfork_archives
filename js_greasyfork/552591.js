// ==UserScript==
// @name            Product code in cart on 21vek.by
// @name:ru         Код товара в корзине на 21vek.by
// @namespace       FIX
// @version         0.1.1
// @description     Restoration of the product code in cart on 21vek.by
// @description:ru  Возвращение кода товара в корзине на 21vek.by
// @author          raletag
// @copyright       2025, raletag
// @license         CC BY-NC-SA 4.0
// @include         *://www.21vek.by/order/*
// @include         *://*.21vek.dev/order/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/552591/Product%20code%20in%20cart%20on%2021vekby.user.js
// @updateURL https://update.greasyfork.org/scripts/552591/Product%20code%20in%20cart%20on%2021vekby.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const basketItemSelector = 'div[class^="BasketItem_item__"]:not([has-product-code])';

    function extractProductCode(basketItem) {
        const label = basketItem.getAttribute('aria-label');
        if (!label) {
            return 0;
        }

        const match = label.match(/^basket-item-(\d+)$/);

        return match ? parseInt(match[1]) : 0;
    }

    function formatProductCode(code) {
        return code.toString().replace(/\d(?=(\d{3})+$)/g, '$&.');
    }

    function addProductCode(basketItem) {
        basketItem.setAttribute('has-product-code', '');

        const title = basketItem.querySelector('div[class^="BasketItem_titleWrapper__"]');
        if (!title) {
            return;
        }

        const productCode = extractProductCode(basketItem);

        const p = document.createElement('p');
        p.textContent = formatProductCode(productCode);
        p.style.cursor = 'pointer';
        p.style.color = '#888';
        p.addEventListener('click', () => {
            navigator.clipboard.writeText(productCode);
        });

        title.appendChild(p);
    }

    function addProductCodes (node) {
        if (node.matches(basketItemSelector)) {
            addProductCode(node);
        } else {
            for (const item of node.querySelectorAll(basketItemSelector)) {
                addProductCode(item);
            }
        }
    }

    const doc = document.body !== null ? document.body : document;

    addProductCodes(doc);

    new MutationObserver(function(ms) {
        for (const m of ms) {
            for (const n of m.addedNodes) {
                if (n.nodeType === Node.ELEMENT_NODE) {
                    addProductCodes(n);
                }
            }
        }
    }).observe(doc, {childList: true, subtree: true});

})();
