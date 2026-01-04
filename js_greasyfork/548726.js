// ==UserScript==
// @name         Show stock level for Frasers Group sites
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show stock level for Frasers Group sites. A full list of the group URLs is included, but it doesn't work on some for various reasons, eg. the stock-qty is 0 for everything. Works well on Sports Direct, Game and eBuyer though.
// @author       Gareth79
//
// @match       https://www.18montrose.com/*
// @match       https://www.agentprovocateur.com/*
// @match       https://www.amara.com/*
// @match       https://antiguaapparelshop.com/*
// @match       https://www.campri.com/*
// @match       https://carlton-sports.com/*
// @match       https://www.cruisefashion.com/*
// @match       https://www.donnay.com/*
// @match       https://www.ebuyer.com/*
// @match       https://www.evanscycles.com/*
// @match       https://www.everlast.com/*
// @match       https://www.everlastgyms.com/*
// @match       https://www.firetrap.com/*
// @match       https://www.flannels.com/*
// @match       https://www.frasers.com/*
// @match       https://www.game.co.uk/*
// @match       https://www.gelert.com/*
// @match       https://www.gievesandhawkes.com/*
// @match       https://www.gul.com/*
// @match       https://www.houseoffraser.co.uk/*
// @match       https://www.isawitfirst.com/*
// @match       https://www.jackwills.com/*
// @match       https://www.karrimor.com/*
// @match       https://lagear.com/*
// @match       https://www.lovellsports.com/*
// @match       https://www.lillywhites.com/*
// @match       https://www.lonsdale.com/*
// @match       https://www.muddyfox.com/*
// @match       https://ukstore.nofear.com/*
// @match       https://www.scottsmenswear.com/*
// @match       https://store.slazenger.com/*
// @match       https://www.sofa.com/gb/*
// @match       https://www.sondico.com/*
// @match       https://www.soulcal.co.uk/*
// @match       https://www.sportsdirect.com/*
// @match       https://sportmaster.dk/*
// @match       https://www.studio.co.uk/*
// @match       https://www.tessuti.co.uk/*
// @match       https://www.usapro.co.uk/*
// @match       https://www.usc.co.uk/*
// @match       https://www.vanmildert.com/*
// @match       https://www.slazenger.com/*
// @match       https://www.sofa.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548726/Show%20stock%20level%20for%20Frasers%20Group%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/548726/Show%20stock%20level%20for%20Frasers%20Group%20sites.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to update the list item text
    function updateListItems() {
        // Include hidden elements in the search
        const listItems = document.querySelectorAll('li[data-stock-qty]');
        listItems.forEach(item => {
            const stockQty = item.getAttribute('data-stock-qty');
            const sizeText = item.getAttribute('data-text') || item.querySelector('span')?.textContent.trim();

            // Remove hidden class if present to make stock info visible
            if (item.classList.contains('hidden')) {
                item.classList.remove('hidden');
            }

            // Find the <span> inside the <li> to update its text
            const span = item.querySelector('span');

            // Avoid duplicate updates
            if (span && !span.textContent.includes('Stock:')) {
                // Get the original size text without any existing stock info
                const originalText = sizeText || span.textContent.trim();
                span.textContent = `${originalText} (Stock: ${stockQty})`;
            }
        });
    }

    // Function to update select dropdown options
    function updateSelectOptions() {
        const selectElement = document.querySelector('#sizeDdl, select[class*="SizeDropDown"]');
        if (selectElement) {
            // Remove hidden class from the select element if present
            if (selectElement.classList.contains('hidden')) {
                selectElement.classList.remove('hidden');
            }

            const options = selectElement.querySelectorAll('option[data-stock-qty]');
            options.forEach(option => {
                const stockQty = option.getAttribute('data-stock-qty');
                const originalText = option.textContent.trim();

                // Avoid duplicate updates
                if (!originalText.includes('Stock:')) {
                    option.textContent = `${originalText} (Stock: ${stockQty})`;
                }
            });
        }
    }

    // Function to show hidden size containers
    function showHiddenSizeContainers() {
        // Look for the specific product variant container that might be hidden
        const productVariantContainer = document.querySelector('#productVariantAndPrice');
        if (productVariantContainer && productVariantContainer.classList.contains('hidden')) {
            productVariantContainer.classList.remove('hidden');
        }

        // Also look for containers with SzQuantGroup class that might be hidden
        const sizeQuantContainers = document.querySelectorAll('.SzQuantGroup.hidden');
        sizeQuantContainers.forEach(container => {
            container.classList.remove('hidden');
        });

        // Look for other common size container elements that might be hidden
        const sizeContainers = document.querySelectorAll('#divSize, #ulSizes, .sizeButtons, .swapSize');
        sizeContainers.forEach(container => {
            if (container.classList.contains('hidden')) {
                container.classList.remove('hidden');
            }
        });
    }

    // Observe DOM changes for dynamic content loading
    const observer = new MutationObserver(() => {
        showHiddenSizeContainers();
        updateListItems();
        updateSelectOptions();
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case elements are already present
    showHiddenSizeContainers();
    updateListItems();
    updateSelectOptions();
})();

