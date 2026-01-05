// ==UserScript==
// @name         Amazon Variations - Total Bought in Past Month
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sums "bought in past month" across all product variations and shows the total
// @license MIT
// @author       Grok
// @match        https://www.amazon.com/*
// @match        https://amazon.com/*
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @downloadURL https://update.greasyfork.org/scripts/561456/Amazon%20Variations%20-%20Total%20Bought%20in%20Past%20Month.user.js
// @updateURL https://update.greasyfork.org/scripts/561456/Amazon%20Variations%20-%20Total%20Bought%20in%20Past%20Month.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!/\/(dp|gp\/product)\/[A-Z0-9]{10}/.test(location.href)) return;

    let totalBought = 0;
    let processed = 0;
    let variations = [];

    function parseBought(text) {
        if (!text) return 0;
        const match = text.toLowerCase().match(/(\d+(?:\.\d+)?)(k?)\+?/);
        if (!match) return 0;
        let num = parseFloat(match[1]);
        if (match[2] === 'k') num *= 1000;
        return Math.floor(num);
    }

    function extractVariationAsins() {
        const scripts = document.querySelectorAll('script');
        for (let script of scripts) {
            if (script.textContent.includes('dimensionValuesDisplayData')) {
                const match = script.textContent.match(/dimensionValuesDisplayData["\s]*:[\s]*(\{.*?\}),/);
                if (match) {
                    try {
                        const data = JSON.parse(match[1]);
                        return Object.keys(data);
                    } catch (e) {}
                }
            }
            if (script.textContent.includes('variationValues')) {
                const match = script.textContent.match(/variationValues["\s]*:[\s]*(\{.*?\}),/);
                if (match) {
                    try {
                        const data = JSON.parse(match[1]);
                        const asins = new Set();
                        for (let key in data) {
                            data[key].forEach(asin => asins.add(asin));
                        }
                        return Array.from(asins);
                    } catch (e) {}
                }
            }
        }
        return [];
    }

    function fetchBoughtForAsin(asin, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.amazon.com/dp/${asin}`,
            headers: {
                "Accept": "text/html",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            onload: function (response) {
                let count = 0;
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const span = Array.from(doc.querySelectorAll('span')).find(s =>
                        s.textContent.toLowerCase().includes('bought in past month')
                    );
                    if (span) {
                        count = parseBought(span.textContent);
                    }
                }
                callback(count);
            },
            onerror: function () {
                callback(0);
            }
        });
    }

    function insertTotal() {
        let container = document.querySelector('#social-proofing-faceout-title');
        if (!container) {
            container = document.querySelector('#averageCustomerReviews');
            if (!container) return;
        }

        const old = document.getElementById('variation-bought-total');
        if (old) old.remove();

        const totalText = totalBought >= 1000
            ? (totalBought / 1000).toFixed(1).replace('.0', '') + 'K+'
            : totalBought + '+';

        const el = document.createElement('div');
        el.id = 'variation-bought-total';
        el.style.cssText = `
            margin-top: 8px;
            font-size: 14px;
            color: #0F1111;
            font-weight: 700;
        `;
        el.innerHTML = `<span style="color:#c45500;">Total across all variations:</span> 
                        <span style="color:#B12704;">${totalText}</span> bought in past month`;

        container.parentNode.insertBefore(el, container.nextSibling);
    }

    function start() {
        variations = extractVariationAsins();
        if (variations.length === 0) {
            console.log('[Amazon Total Bought] No variations found.');
            return;
        }

        console.log(`[Amazon Total Bought] Found ${variations.length} variations. Fetching sales data...`);

        variations.forEach(asin => {
            fetchBoughtForAsin(asin, count => {
                totalBought += count;
                processed++;
                if (processed === variations.length) {
                    console.log(`[Amazon Total Bought] Completed. Total ≈ ${totalBought}+`);
                    insertTotal();
                }
            });
        });
    }

    waitForKeyElements('#twister', start, true);
    setTimeout(start, 3000);
})();