// ==UserScript==
// @name         All-in-One Hotel Price Calculator
// @namespace    http://tampermonkey.net/
// @version      2.7.0
// @description  Calculates the true per-night price (including taxes/fees) on Hotels.com and Booking.com search results and hotel pages.
// @author       Gemini vibe bro
// @license      MIT
// @match        *://*.hotels.com/Hotel-Search*
// @match        *://*.hotels.com/d/*
// @match        *://*.hotels.com/ho*
// @match        *://*.booking.com/searchresults.html*
// @match        *://*.booking.com/hotel/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548067/All-in-One%20Hotel%20Price%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/548067/All-in-One%20Hotel%20Price%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This script calculates the final, all-in price for hotel listings and displays it,
     * along with the true nightly price. It supports multiple travel websites and page types.
     */

    // --- SITE CONFIGURATIONS ---
    const SITE_CONFIGS = {
        'hotels.com-searchResults': {
            selectors: {
                hotelListingContainer: 'div.uitk-card.uitk-card-has-border, [data-testid="property-listing"], #floating-lodging-card',
                totalPrice: 'div.uitk-text.is-visually-hidden, [data-testid="price-and-discounted-price"]',
                perNightPriceDisplay: 'div.uitk-text.uitk-type-end, [data-testid="price-per-night"] > span',
            },
            dateParams: {
                start: ['startDate', 'd1'],
                end: ['endDate', 'd2']
            },
            processListing: processHotelsComListing
        },
        'hotels.com-hotelPage': {
            selectors: {
                hotelListingContainer: '[data-stid^="property-offer"]',
                totalPrice: 'div.uitk-text.is-visually-hidden, [data-testid="price-and-discounted-price"]',
                perNightPriceDisplay: 'div.uitk-text.uitk-type-end, [data-testid="price-per-night"] > span',
            },
            dateParams: {
                start: ['chkin'],
                end: ['chkout']
            },
            processListing: processHotelsComListing
        },
        'booking.com-searchResults': {
            selectors: {
                hotelListingContainer: '[data-testid="property-card"], [data-testid="property-list-map-card"]',
                basePrice: '[data-testid="price-and-discounted-price"]',
                taxesAndFees: '[data-testid="taxes-and-charges"]',
                priceContainer: '[data-testid="availability-rate-information"]',
            },
            dateParams: {
                start: ['checkin'],
                end: ['checkout']
            },
            processListing: processBookingComListing
        },
        'booking.com-hotelPage': {
             selectors: {
                hotelListingContainer: 'tr.js-rt-block-row',
                basePrice: '.bui-price-display__value .prco-valign-middle-helper',
                taxesAndFees: '.prd-taxes-and-fees-under-price',
                priceContainer: '.hprt-table-cell-price',
                strikethroughPrice: '.js-strikethrough-price'
            },
            dateParams: {
                start: ['checkin'],
                end: ['checkout']
            },
            processListing: processBookingComListing // The same logic works for both
        }
    };
    // ---------------------------------------------------------

    function parsePrice(text) {
        if (!text) return NaN;
        // This regex is more robust for different currency formats like US$XXX or XXX€
        const cleanText = text.replace(/[^\d.,]/g, '').replace(',', '.');
        const priceMatch = cleanText.match(/(\d+\.?\d*)/);
        return priceMatch ? parseFloat(priceMatch[0]) : NaN;
    }


    function calculateNightsFromUrl(config) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            let startDateStr, endDateStr;

            for (const param of config.dateParams.start) {
                if (urlParams.has(param)) {
                    startDateStr = urlParams.get(param);
                    break;
                }
            }
            for (const param of config.dateParams.end) {
                if (urlParams.has(param)) {
                    endDateStr = urlParams.get(param);
                    break;
                }
            }

            if (!startDateStr || !endDateStr) {
                console.warn("Price Calculator: Could not find start or end date in URL.");
                return NaN;
            }

            const startDate = new Date(startDateStr + 'T00:00:00Z');
            const endDate = new Date(endDateStr + 'T00:00:00Z');
            const timeDiff = endDate.getTime() - startDate.getTime();
            const nights = Math.round(timeDiff / (1000 * 60 * 60 * 24));

            return (nights > 0) ? nights : NaN;
        } catch (error) {
            console.error("Price Calculator: Error calculating nights from URL.", error);
            return NaN;
        }
    }

    /**
     * Site-Specific Processing Logic
     */

    function processHotelsComListing(listing, totalNights, config) {
        let perNightPriceDisplayEl = null;
        const potentialPerNightEls = listing.querySelectorAll(config.selectors.perNightPriceDisplay);
        for (const el of potentialPerNightEls) {
            if (el.innerText.toLowerCase().includes('nightly')) {
                perNightPriceDisplayEl = el;
                break;
            }
        }

        let totalPriceEl = null;
        const potentialTotalPriceEls = listing.querySelectorAll(config.selectors.totalPrice);
        for (const el of potentialTotalPriceEls) {
             // Find the element specifically containing "current price" for accuracy
            if (el.innerText.toLowerCase().includes('current price')) {
                totalPriceEl = el;
                break;
            }
        }

        if (!totalPriceEl || !perNightPriceDisplayEl || perNightPriceDisplayEl.title.includes('true per-night price')) {
            return false; // Not enough info or already processed
        }

        // Find and remove the strikethrough price element to declutter the UI
        const strikethroughEl = listing.querySelector('del');
        if (strikethroughEl) {
            const strikethroughContainer = strikethroughEl.closest('button[data-stid="disclaimer-dialog-link"]');
            if (strikethroughContainer) {
                strikethroughContainer.remove();
            }
        }

        const totalPriceText = totalPriceEl.innerText;
        const finalPrice = parsePrice(totalPriceText);
        if (isNaN(finalPrice)) return false;

        const truePerNightPrice = finalPrice / totalNights;
        const currencySymbol = totalPriceText.trim().match(/[$,€,£]/) ? totalPriceText.trim().match(/[$,€,£]/)[0] : '$';
        perNightPriceDisplayEl.innerText = `${currencySymbol}${truePerNightPrice.toFixed(0)} nightly`;

        Object.assign(perNightPriceDisplayEl.style, {
            color: '#008000', fontWeight: 'bold', border: '1px solid #008000',
            padding: '2px 4px', borderRadius: '4px'
        });
        perNightPriceDisplayEl.title = 'This is the true per-night price including all taxes and fees.';
        return true;
    }

    function processBookingComListing(listing, totalNights, config) {
        const basePriceEl = listing.querySelector(config.selectors.basePrice);
        const taxesEl = listing.querySelector(config.selectors.taxesAndFees);
        const priceContainer = listing.querySelector(config.selectors.priceContainer);
        const strikethroughEl = listing.querySelector(config.selectors.strikethroughPrice);

        // Check if we have the necessary elements or if we've already processed this listing
        if (!basePriceEl || !taxesEl || !priceContainer || priceContainer.querySelector('.true-price-container')) {
            return false;
        }

        // 1. Calculate prices from the original elements
        const basePrice = parsePrice(basePriceEl.innerText);
        const taxes = parsePrice(taxesEl.innerText);
        if (isNaN(basePrice) || isNaN(taxes)) return false;

        const totalPrice = basePrice + taxes;
        const perNightPrice = totalPrice / totalNights;
        const currencySymbol = (basePriceEl.innerText.trim().match(/[^0-9.,\s]+/) || ['$'])[0];

        // 2. Build the HTML for the hover popup using original text
        let popupHTML = '<div style="font-size: 0.9em; text-align: left;"><strong>Original Breakdown</strong><br>';
        if (strikethroughEl) {
            popupHTML += `Original: <del>${strikethroughEl.innerText}</del><br>`;
        }
        popupHTML += `Base Price: ${basePriceEl.innerText}<br>`;
        popupHTML += `Taxes & Fees: ${taxesEl.innerText}`;
        popupHTML += '</div>';

        // 3. Create the popup element
        const popupEl = document.createElement('div');
        popupEl.className = 'true-price-popup';
        popupEl.innerHTML = popupHTML;
        Object.assign(popupEl.style, {
            display: 'none',
            position: 'absolute',
            bottom: '100%',
            right: '0',
            marginBottom: '5px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '8px',
            borderRadius: '5px',
            zIndex: '1000',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        });

        // 4. Create the new container that will be visible
        const displayContainer = document.createElement('div');
        displayContainer.className = 'true-price-container'; // New class to check against
        displayContainer.style.position = 'relative'; // Anchor for the popup
        Object.assign(displayContainer.style, {
            marginTop: '4px',
            padding: '4px',
            border: '2px solid #008000',
            borderRadius: '4px',
            backgroundColor: '#f0fff0',
            textAlign: 'right',
            cursor: 'pointer'
        });
        displayContainer.innerHTML = `
            <div style="font-weight: bold; color: #006400;">${currencySymbol}${totalPrice.toFixed(0)} total</div>
            <div style="font-size: 0.9em; color: #333;">${currencySymbol}${perNightPrice.toFixed(0)} / night</div>
        `;

        // 5. Add event listeners to the new container to show/hide the popup
        displayContainer.addEventListener('mouseenter', () => { popupEl.style.display = 'block'; });
        displayContainer.addEventListener('mouseleave', () => { popupEl.style.display = 'none'; });

        // 6. Append the hidden popup to the new container
        displayContainer.appendChild(popupEl);

        // 7. Hide the original price elements
        Array.from(priceContainer.children).forEach(child => {
            if (child.style) {
                 child.style.display = 'none';
            }
        });

        // 8. Add the new interactive element to the page
        priceContainer.appendChild(displayContainer);

        return true;
    }


    /**
     * Main script execution and observation logic
     */
    function updateHotelPrices() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        let siteKey = null;

        if (hostname.includes('hotels.com')) {
            if (pathname.startsWith('/Hotel-Search')) {
                 siteKey = 'hotels.com-searchResults';
            } else if (pathname.startsWith('/ho') || pathname.startsWith('/d/')) {
                 siteKey = 'hotels.com-hotelPage';
            }
        } else if (hostname.includes('booking.com')) {
            if (pathname.startsWith('/searchresults')) {
                siteKey = 'booking.com-searchResults';
            } else if (pathname.startsWith('/hotel/')) {
                siteKey = 'booking.com-hotelPage';
            }
        }

        if (!siteKey) return;
        const siteConfig = SITE_CONFIGS[siteKey];

        const totalNights = calculateNightsFromUrl(siteConfig);
        if (isNaN(totalNights)) {
            console.error("Price Calculator: Could not determine number of nights. Aborting.");
            return;
        }

        const listings = document.querySelectorAll(siteConfig.selectors.hotelListingContainer);
        if (listings.length === 0) return;

        let successfulUpdates = 0;
        listings.forEach((listing) => {
            try {
                if (siteConfig.processListing(listing, totalNights, siteConfig)) {
                    successfulUpdates++;
                }
            } catch (error) {
                console.error("Price Calculator: An error occurred while processing a listing:", error, listing);
            }
        });

        if (successfulUpdates > 0) {
            console.log(`Price Calculator: Finished. Successfully updated ${successfulUpdates} of ${listings.length} listings on ${siteKey}.`);
        }
    }

    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedUpdate = debounce(updateHotelPrices, 750);
    const observer = new MutationObserver(() => debouncedUpdate());
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run after page load
    setTimeout(updateHotelPrices, 2000);
})();

