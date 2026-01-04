// ==UserScript==
// @name         Albert Heijn prijzen vergelijken
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Laat onder de product prijs de prijs per kilogram/liter zien om gemakkelijk prijzen te vergelijken
// @author       Rob Vandenberg
// @license      MIT
// @match        https://*.ah.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553607/Albert%20Heijn%20prijzen%20vergelijken.user.js
// @updateURL https://update.greasyfork.org/scripts/553607/Albert%20Heijn%20prijzen%20vergelijken.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function updatePricePerUnit(product) {
        // Skip if already processed
        if (product.querySelector('.price-per-unit')) return;

        const priceElement = product.querySelector('[class*="price-amount"]');
        const weightElement = product.querySelector('[class*="price_unitSize"]');

        if (priceElement && weightElement) {
            const price = parseFloat(priceElement.textContent.replace(',', '.'));
            let weightVolumeText = weightElement.textContent.trim().toLowerCase();
            weightVolumeText = weightVolumeText.replace(/^\D+/g, '').trim();
            const weightMatch = weightVolumeText.match(/([\d.,]+)\s*(g|kg|l|ml)/);

            if (!weightMatch) return;

            let weightInGrams = null;
            const weightValue = parseFloat(weightMatch[1].replace(',', '.'));

            if (weightMatch[2] === 'g') {
                weightInGrams = weightValue;
            } else if (weightMatch[2] === 'kg') {
                weightInGrams = weightValue * 1000;
            } else if (weightMatch[2] === 'l') {
                weightInGrams = weightValue * 1000;
            } else if (weightMatch[2] === 'ml') {
                weightInGrams = weightValue;
            }

            if (price && weightInGrams && !isNaN(weightInGrams)) {
                const pricePerUnit = (price / weightInGrams) * 1000;
                const priceInteger = Math.floor(pricePerUnit);
                const priceCents = Math.round((pricePerUnit - priceInteger) * 100);

                const pricePerUnitElement = document.createElement('div');
                pricePerUnitElement.className = 'price-per-unit';
                pricePerUnitElement.innerHTML = `${priceInteger}.<sup style="position: relative; top: -2px;">${priceCents.toString().padStart(2, '0')}</sup>`;
                pricePerUnitElement.style.fontSize = '16px';
                pricePerUnitElement.style.color = '#b0b0b0';
                pricePerUnitElement.style.marginTop = '2px';
                pricePerUnitElement.style.marginRight = '4px';
                pricePerUnitElement.style.marginBottom = '24px';
                priceElement.insertAdjacentElement('afterend', pricePerUnitElement);
            }
        }
    }

    // Process initial products on page load
    document.querySelectorAll('article[class^="product-card-portrait_root"]').forEach(updatePricePerUnit);

    // Watch for new products being added
    const observer = new MutationObserver(() => {
        document.querySelectorAll('article[class^="product-card-portrait_root"]').forEach(updatePricePerUnit);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();