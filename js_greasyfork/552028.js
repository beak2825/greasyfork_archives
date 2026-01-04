// ==UserScript==
// @name         DobarTek Robot Price Injector
// @license      MIT License
// @namespace    http://dobartek.hr/
// @version      1.4
// @description  Inject Robot prices into Ericsson Poljička menu
// @match        https://www.dobartek.hr/tvrtka/ericsson-poljicka/narudzba
// @match        https://www.dobartek.hr/tvrtka/ericsson-poljicka?ref=menu
// @match        https://www.dobartek.hr/tvrtka/ericsson-poljicka
// @match        https://www.dobartek.hr/tvrtka/ericsson-poljicka/narudzba?ref=menu
// @grant        GM_xmlhttpRequest
// @connect      www.dobartek.hr
// @downloadURL https://update.greasyfork.org/scripts/552028/DobarTek%20Robot%20Price%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/552028/DobarTek%20Robot%20Price%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let counter_ent=0;
    let counter_public=0;
    let items=0;

    // Extract items from current page
    const currentItems = {};
    document.querySelectorAll('.carteItem-holder').forEach(item => {
        const nameEl = item.querySelector('.carteItemTitleHolder');
        if (nameEl) {
            const name = nameEl.textContent.trim();
            currentItems[name] = nameEl;
            counter_ent = counter_ent + 7;
            items = items + 1;
        }
    });

    // Fetch Robot page
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.dobartek.hr/robot?ref=small",
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");

            // Extract Robot prices
            const robotPrices = {};
            doc.querySelectorAll('.carteItem-holder').forEach(item => {
                const nameEl = item.querySelector('.carteItemTitleHolder');
                const priceEl = item.querySelector('.dishPrice');
                if (nameEl && priceEl) {
                    const name = nameEl.textContent.trim();
                    const price = parseFloat(priceEl.textContent.replace(',', '.').replace(/[^\d.]/g, ''));
                    if (!isNaN(price)) {
                        robotPrices[name] = price;
                    }
                }
            });

            // Inject Robot prices into current page
            for (const [name, nameEl] of Object.entries(currentItems)) {
                const robotPrice = robotPrices[name];
                if (robotPrice !== undefined) {
                    counter_public = counter_public + robotPrice;
                    const badge = document.createElement('div');
                    badge.textContent = `Robot: ${robotPrice.toFixed(2)} €`;
                    if ( robotPrice > 7 ) {
                        badge.style.color = 'green'; }
                    else if ( robotPrice == 7 ) {
                        badge.style.color = 'orange';
                    }
                    else {
                        badge.style.color = 'red';
                    }
                    badge.style.fontSize = '0.9em';
                    badge.style.marginTop = '4px';
                    badge.style.fontWeight = 'bold';
                    nameEl.appendChild(badge);
                }
            }
            //alert("ENT: " + counter_ent/items + "\nPublic: " + counter_public/items)
        }
    });
})();