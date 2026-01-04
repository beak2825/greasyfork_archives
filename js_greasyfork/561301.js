// ==UserScript==
// @name         Amazon Highlight Gratis leverans imorgon (Search + BuyBox full block)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlighta alla Amazon-element som innehåller exakt "GRATIS leverans imorgon", inklusive hela buybox-blocket
// @match        https://www.amazon.se/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561301/Amazon%20Highlight%20Gratis%20leverans%20imorgon%20%28Search%20%2B%20BuyBox%20full%20block%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561301/Amazon%20Highlight%20Gratis%20leverans%20imorgon%20%28Search%20%2B%20BuyBox%20full%20block%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightSearchResults() {
        const items = document.querySelectorAll('[data-component-type="s-search-result"]');
        items.forEach(item => {
            const deliveryBlock = item.querySelector('[data-cy="delivery-recipe"]');
            if (!deliveryBlock) return;

            const text = deliveryBlock.innerText.toLowerCase();
            if (text.includes("gratis leverans imorgon")) {
                item.style.backgroundColor = "yellow";
                item.style.padding = "10px";
                item.style.borderRadius = "10px";
            }
        });
    }

    function highlightBuyBox() {
        const deliveryMsg = document.querySelector('#deliveryBlockMessage');
        if (!deliveryMsg) return;

        const text = deliveryMsg.innerText.toLowerCase();
        if (!text.includes("gratis leverans imorgon")) return;

        // Hitta hela buyboxcontainern (största uppåtgående container)
        let box = deliveryMsg.closest('.a-box-group');
        if (!box) return;

        // Highlighta hela buyboxgruppen
        box.style.backgroundColor = "yellow";
        box.style.borderRadius = "12px";
        box.style.padding = "10px";

        // Highlighta ALLA underliggande element i buyboxen
        const inner = box.querySelectorAll('.a-box, .a-box-inner, .a-section, .a-row');
        inner.forEach(el => {
            el.style.backgroundColor = "yellow";
        });
    }

    function run() {
        highlightSearchResults();
        highlightBuyBox();
    }

    // Kör direkt
    run();

    // Kör även när Amazon laddar om element
    const obs = new MutationObserver(run);
    obs.observe(document.body, { childList: true, subtree: true });

})();
