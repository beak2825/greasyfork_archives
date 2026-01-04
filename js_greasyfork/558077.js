// ==UserScript==
// @name         Snapcaster Multi Search Recommendation Improver
// @version      0.1
// @description  When doing multi searches on snapcaster.ca, will actually show which stores have the cards you want!
// @author       Derya
// @match        *://*.snapcaster.ca/*
// @match        *://api.snapcaster.ca/*
// @grant        none
// @namespace    https://github.com/derya
// @license      no license
// @downloadURL https://update.greasyfork.org/scripts/558077/Snapcaster%20Multi%20Search%20Recommendation%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/558077/Snapcaster%20Multi%20Search%20Recommendation%20Improver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const { keys, values, entries } = Object;

    // config
    const NUM_STORES_SHOW = 6;

    // checks if URL is a multisearch call
    function shouldRunMain(url) {
        return typeof url === 'string' && url.includes('api.snapcaster.ca/api/v1/catalog/multisearch');
    }

    // generate HTML for the results
    function generateResultsHtml(bestStores) {
        const vendorCards = bestStores.map(vendor => {
            const cardList = entries(vendor.pricesByCard)
                .map(([cardName, price]) => `<div class="text-sm text-muted-foreground">${cardName} ($${price})</div>`)
                .join('');

            return `
                <div class="border-1 col-span-2 rounded-lg border border-border px-4 py-3 text-left sm:col-span-1">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="text-sm font-semibold">${vendor.name}</div>
                        </div>
                    </div>
                    <div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <div class="flex items-center gap-1">
                            <span>${vendor.numCards} cards found</span>
                        </div>
                    </div>
                    <div class="mt-1 text-lg font-bold text-foreground">$${vendor.totalPrice.toFixed(2)}</div>
                    <div class="mt-2 space-y-1 max-h-20 overflow-y-auto">
                        ${cardList}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div id="smsri-results" class="rounded-lg border bg-card text-card-foreground shadow-sm col-span-12 flex flex-col text-xs mb-6">
                <div class="flex flex-col space-y-1.5 p-4 text-left">
                    <h3 class="font-semibold tracking-tight text-lg">Top ${NUM_STORES_SHOW} Stores with Most Matches</h3>
                    <div class="text-xs text-muted-foreground">This section is injected, not original content from Snapcaster!!!</div>
                </div>
                <div class="p-4 pt-0 grid grid-cols-2 gap-2 overflow-clip">
                    ${vendorCards}
                </div>
            </div>
        `;
    }

    // inject results into the page
    function injectResults(html) {
        // remove existing results if they exist
        const existingResults = document.getElementById('smsri-results');
        if (existingResults) {
            existingResults.remove();
        }

        // targets the recommended stores section. utter hack hopefully the fine folks
        // at the snapcaster team don't ever change the html structure of this page!
        const targetElement = document.querySelector('div.col-span-12:nth-child(2)');

        if (targetElement) {
            // insert our better recs before the existing recs element
            targetElement.insertAdjacentHTML('beforebegin', html);
        } else {
            console.warn('SMSRI: could not find injection point for html');
        }
    }

    // reads and parses multisearch response data
    function main(responseData) {
        if (!responseData || !responseData.data || !responseData.data.results) {
            console.log('SMSRI: No valid response data found, aborting...');
            return;
        }

        const cardListings = responseData.data.results.flatMap(x => x ? x : []);

        if (cardListings.length === 0) {
            console.log('SMSRI: No card listings found, aborting...');
            return;
        }

        const uniqueCardsFound = [...new Set(cardListings.map(x => x.normalized_name))];
        const vendors = [...new Set(cardListings.map(x => x.vendor))];

        const vendorsWithListings = vendors.map(vendor => {
            const pricesByCard = {};

            for (const cardName of uniqueCardsFound) {
                const vendorListings = cardListings.filter(x =>
                    x.normalized_name === cardName && x.vendor === vendor
                );

                if (vendorListings.length > 0) {
                    const bestListing = vendorListings.reduce((min, current) =>
                        current.price < min.price ? current : min
                    );
                    pricesByCard[cardName] = bestListing.price;
                }
            }

            return {
                name: vendor,
                pricesByCard,
                numCards: keys(pricesByCard).length,
                totalPrice: values(pricesByCard).reduce((sum, price) => sum + price, 0)
            };
        });

        // Sort by number of cards
        const sorted = vendorsWithListings.sort((a, b) =>
            keys(b.pricesByCard).length - keys(a.pricesByCard).length
        );
        const bestStores = sorted.slice(0, NUM_STORES_SHOW);

        // Generate HTML for injection
        const resultsHtml = generateResultsHtml(bestStores);
        setTimeout(() => injectResults(resultsHtml), 1000);

        // Also log all to console for debugging
        console.log('=== MULTISEARCH RESULTS ===');
        sorted.forEach(vendor => {
            let pricesStr = `${vendor.name} has ${vendor.numCards} cards, total price: $${vendor.totalPrice.toFixed(2)}\n`;
            for (const [cardName, price] of entries(vendor.pricesByCard)) {
                pricesStr += "   " + cardName + " ($" + price + ")\n";
            }
            console.log(pricesStr);
        });
        console.log('=====================================');
    }

    // store original fetch, XHR functions
    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;


    // intercept fetch calls
    window.fetch = function(...args) {
        const url = args[0];

        if (shouldRunMain(url)) {
            console.log('SMSRI: Intercepting multisearch call (fetch) to Snapcaster API...');

            return originalFetch.apply(this, args).then(response => {
                // operate on cloned response, don't mess with existing functionality of the web app
                response.clone().json().then(data => {
                    main(data);
                }).catch(err => {
                    console.log('SMSRI: Error parsing fetchresponse:', err);
                });

                return response;
            });
        }

        return originalFetch.apply(this, args);
    };

    // intercept XMLHttpRequest calls
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this.runIntercept = shouldRunMain(url);
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this.runIntercept) {
            console.log('SMSRI: Intercepting multisearch call (XMLHttpRequest) to Snapcaster API...');

            const originalOnReadyStateChange = this.onreadystatechange;

            this.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        main(JSON.parse(this.responseText));
                    } catch (err) {
                        console.log('SMSRI: Error parsing XHR response:', err);
                    }
                }

                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
        }

        return originalXHRSend.apply(this, args);
    };

    console.log('Snapcaster Multi Search Recommendation Improver (SMSRI) is loaded!');
    console.log('SMSRI: Monitoring for calls to api.snapcaster.ca/api/v1/catalog/multisearch');
})();
