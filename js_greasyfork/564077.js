// ==UserScript==
// @name         Amazon SNAP EBT Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter Amazon search results to show only SNAP EBT eligible items
// @match        https://www.amazon.com/s*
// @match        https://www.amazon.com/*/s*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/564077/Amazon%20SNAP%20EBT%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/564077/Amazon%20SNAP%20EBT%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let filterEnabled = false;

    // Add CSS for the toggle button and hidden items
    GM_addStyle(`
        #ebt-filter-toggle {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 15px;
            background: #232f3e;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        #ebt-filter-toggle:hover {
            background: #37475a;
        }
        #ebt-filter-toggle.active {
            background: #067d62;
        }
        .ebt-hidden {
            display: none !important;
        }
        #ebt-filter-count {
            position: fixed;
            top: 55px;
            right: 10px;
            z-index: 9999;
            padding: 5px 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 3px;
            font-size: 12px;
        }
    `);

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'ebt-filter-toggle';
    toggleBtn.textContent = 'EBT Filter: OFF';
    document.body.appendChild(toggleBtn);

    // Create count display
    const countDisplay = document.createElement('div');
    countDisplay.id = 'ebt-filter-count';
    countDisplay.style.display = 'none';
    document.body.appendChild(countDisplay);

    function getProductCards() {
        // Amazon uses various selectors for product cards
        return document.querySelectorAll('[data-component-type="s-search-result"]');
    }

    function hasEbtLabel(card) {
        // Check for SNAP EBT eligible text in the card
        const cardText = card.innerText.toLowerCase();
        return cardText.includes('snap ebt eligible') ||
               cardText.includes('ebt eligible');
    }

    function applyFilter() {
        const cards = getProductCards();
        let visibleCount = 0;
        let hiddenCount = 0;

        cards.forEach(card => {
            if (filterEnabled && !hasEbtLabel(card)) {
                card.classList.add('ebt-hidden');
                hiddenCount++;
            } else {
                card.classList.remove('ebt-hidden');
                visibleCount++;
            }
        });

        if (filterEnabled) {
            countDisplay.textContent = `Showing ${visibleCount} EBT items (${hiddenCount} hidden)`;
            countDisplay.style.display = 'block';
        } else {
            countDisplay.style.display = 'none';
        }
    }

    function toggleFilter() {
        filterEnabled = !filterEnabled;
        toggleBtn.textContent = filterEnabled ? 'EBT Filter: ON' : 'EBT Filter: OFF';
        toggleBtn.classList.toggle('active', filterEnabled);
        applyFilter();
    }

    toggleBtn.addEventListener('click', toggleFilter);

    // Initial apply
    applyFilter();

    // Watch for dynamic content loading (infinite scroll, etc.)
    const observer = new MutationObserver((mutations) => {
        let hasNewProducts = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                hasNewProducts = true;
                break;
            }
        }
        if (hasNewProducts) {
            applyFilter();
        }
    });

    // Observe the search results container
    const resultsContainer = document.querySelector('.s-main-slot') || document.body;
    observer.observe(resultsContainer, { childList: true, subtree: true });

})();