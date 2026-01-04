// ==UserScript==
// @name         Apotal/Medikamente-per-Klick Price Comparison
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Compare prices with Medikamente-per-Klick
// @icon         https://icons.duckduckgo.com/ip2/apotal.de.ico
// @match        https://shop.apotal.de/*
// @match        https://www.medikamente-per-klick.de/*
// @license      GPLv3
// @grant        GM_xmlhttpRequest
// @connect      www.medikamente-per-klick.de
// @connect      shop.apotal.de
// @downloadURL https://update.greasyfork.org/scripts/559845/ApotalMedikamente-per-Klick%20Price%20Comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/559845/ApotalMedikamente-per-Klick%20Price%20Comparison.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve the current price from the original page
    function getCurrentPrice() {
        const priceElement = document.querySelector('dd.yourPrice');
        return priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9,.]/g, '').replace(',', '.')) : null;
    }

    // Fetch and clean package size from the page
    function getPackageSize() {
        const packageSizeElement = document.querySelector('dd.packageSize');
        return packageSizeElement ? packageSizeElement.textContent.replace(/\s/g, '') : null;
    }

    // Generate price comparison result text and color
    function generateComparisonText(currentPrice, comparisonPrice, url, name) {
        const priceComparisonText = `Preis auf <a href="${url}" target="_blank">${name}</a>`;
        let price, color;

        if (comparisonPrice < currentPrice) {
            price = `${comparisonPrice} € (niedriger)`;
            color = 'green';
        } else if (comparisonPrice > currentPrice) {
            price = `${comparisonPrice} € (höher)`;
            color = 'red';
        } else {
            price = `${comparisonPrice} € (gleich)`;
            color = 'yellow';
        }

        return { comparisonText: priceComparisonText, price, color };
    }

    // Display the comparison result on the page
    function displayComparisonResult(priceElement, comparisonResult) {
        const resultHeader = document.createElement('dt');
        const resultValue = document.createElement('dd');

        resultHeader.innerHTML = comparisonResult.comparisonText;
        resultValue.innerText = comparisonResult.price;
        resultValue.style.color = comparisonResult.color;

        priceElement.insertAdjacentElement('afterend', resultValue);
        priceElement.insertAdjacentElement('afterend', resultHeader);
    }

    // Fetch the price from the comparison site
    function fetchComparisonPrice(fetchUrl, name) {
        let path = window.location.pathname;
        let packageSize = getPackageSize();
        const pzn = path.split('-').pop();

        if (name === "Medikamente per Klick") {
            path = path.replace(pzn, packageSize) + "-" + pzn;
        } else if (name === "Apotal") {
            packageSize = packageSize.replace("Stk", "St"); // Differing naming convention
            path = path.replace(packageSize + "-", "");
        }

        const url = `${fetchUrl}${path}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const externalPriceElement = new DOMParser().parseFromString(response.responseText, "text/html").querySelector("dd.yourPrice");
                    const comparisonPrice = externalPriceElement ? parseFloat(externalPriceElement.textContent.replace(/[^0-9,.]/g, '').replace(',', '.')) : null;

                    const currentPrice = getCurrentPrice();
                    if (currentPrice !== null && comparisonPrice !== null) {
                        const comparisonResult = generateComparisonText(currentPrice, comparisonPrice, url, name);
                        displayComparisonResult(document.querySelector('dd.yourPrice'), comparisonResult);
                    } else {
                        console.error("One of the prices could not be found.");
                    }
                } else {
                    console.error("Error fetching comparison price.");
                }
            }
        });
    }

    function fetchComparisonPriceMpk() {
        fetchComparisonPrice("https://www.medikamente-per-klick.de", "Medikamente per Klick");
    }

    function fetchComparisonPriceApotal() {
        fetchComparisonPrice("https://shop.apotal.de", "Apotal");
    }

    // Initialize script on page load
    if (document.location.host === "shop.apotal.de") {
        window.addEventListener('load', fetchComparisonPriceMpk);
    } else if (document.location.host === "www.medikamente-per-klick.de") {
        window.addEventListener('load', fetchComparisonPriceApotal);
    }
})();
