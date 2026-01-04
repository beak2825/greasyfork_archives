// ==UserScript==
// @name            EngineBlock
// @namespace       https://github.com/Hogwai/EngineBlock/
// @version         1.1.0
// @description:en  Remove vehicles cards on lacentrale.fr containing vehicles with specified engines and also ads containers
// @description:fr  Enlève les annonces sur lacentrale.fr contenant les véhicules avec des motorisations spécifiques, ainsi que les conteneurs de publicités
// @author          Hogwai
// @description     Remove vehicles cards on lacentrale.fr containing vehicles with specified engines and also ads containers
// @license         MIT
// @match           https://lacentrale.fr/*
// @match           https://www.lacentrale.fr/*
// @downloadURL https://update.greasyfork.org/scripts/555260/EngineBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/555260/EngineBlock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const VEHICLE_KEYWORDS = ['PURETECH', 'VTI', 'THP'];

    const AD_SELECTORS = [
        '.lcui-AdPlaceholder',
        '#pavePubDesktop',
        '.appNexusPlaceholder',
        '#pavePubGallery',
        'div.advertising-container'
    ];

    function scanAndClean() {
        let removedCount = 0;
        const adContainers = document.querySelectorAll(AD_SELECTORS.join(', '));
        adContainers.forEach(ad => {
            ad.remove();
            console.debug(`[EngineBlock] Ad removed : ${ad.className || ad.id}`);
        });

        const vehicleCards = document.querySelectorAll('.searchCard:not([data-ptb-processed])');
        vehicleCards.forEach(card => {
            card.setAttribute('data-ptb-processed', 'true');

            const subTitle = card.querySelector('div[class*="vehiclecardV2_subTitle__"]');
            if (subTitle) {
                const textContent = subTitle.textContent.trim().toUpperCase();
                if (VEHICLE_KEYWORDS.some(keyword => textContent.includes(keyword))) {
                    card.remove();
                    removedCount++;
                    console.debug(`[EngineBlock] Card removed : ${textContent.trim()}`);
                }
            }
        });

        if (removedCount > 0) {
            console.debug(`[EngineBlock] Total of ${removedCount} elements removed.`);
        }
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedScanAndClean = debounce(scanAndClean, 300);

    const observer = new MutationObserver((mutations) => {
        const hasAddedNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
        if (hasAddedNodes) {
            debouncedScanAndClean();
        }
    });

    const observerConfig = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, observerConfig);

    scanAndClean();

})();