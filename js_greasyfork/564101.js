// ==UserScript==
// @name         Torn City Company Stock Alert
// @version      0.1.0
// @description  This script makes the Job sidebar flash (identical to the Rules sidebar) when your company stock is not sufficient to support two days of sales.
// @author       404hasfound [2995605]
// @namespace    https://github.com/4o4hasfound/torn_city_company_stock_alert
// @match        https://www.torn.com/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand 
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/564101/Torn%20City%20Company%20Stock%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/564101/Torn%20City%20Company%20Stock%20Alert.meta.js
// ==/UserScript==

'use strict';

const PDA_APIKey = '###PDA-APIKEY###';
const MIN_DAYS_OF_STOCK = 2;

// Copied from https://greasyfork.org/en/scripts/522974-torn-oc-2-0-helper/code
function isPDA() {
    const PDATestRegex = !/^(###).+(###)$/.test(PDA_APIKey);
    return PDATestRegex;
}

if (!isPDA()) {
    GM_registerMenuCommand("Set Limited Access API Key", () => {
        const currentKey = GM_getValue("apiKey", "");
        const key = prompt("Please enter your API key:", currentKey);

        if (key) {
            GM_setValue("apiKey", key.trim());
        }
    });
    GM_registerMenuCommand("Set Minimum Days of Stock", () => {
        const current = GM_getValue("min_days_of_stock", 2);
        const input = prompt("Please enter minimum days of stock:", current);

        if (input === null) return;

        const days = parseInt(input, 10);

        if (Number.isNaN(days) || days <= 0) {
            alert("Please enter a valid positive integer.");
            return;
        }

        GM_setValue("min_days_of_stock", days);
    });
}

function getApiKey() {
    if (isPDA()) {
        return PDA_APIKey;
    }

    const key = GM_getValue("apiKey", "");
    if (!key) {
        console.warn("No API key set.");
        return null;
    }
    return key;
}

function getMinDaysOfStock() {
    if (isPDA()) {
        return MIN_DAYS_OF_STOCK;
    }

    const days = GM_getValue("min_days_of_stock", "");
    if (!days) {
        return MIN_DAYS_OF_STOCK;
    }
    return days;
}

function waitForJobSidebar(cb) {
    const el = document.getElementById("nav-job");
    if (el) return cb(el);

    const observer = new MutationObserver(() => {
        const el = document.getElementById("nav-job");
        if (el) {
            observer.disconnect();
            cb(el);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function run() {
    var apiKey = getApiKey()

    if (!apiKey) {
        return;
    }

    const stock_api = `https://api.torn.com/company/?selections=stock&key=${apiKey}`;

    fetch(stock_api)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response error');
        })
        .then(function (stocks) {
            if (stocks.error) {
                throw new Error(stocks.error.error);
            }

            for (var name in stocks.company_stock) {
                var total = stocks.company_stock[name].in_stock + stocks.company_stock[name].on_order;
                console.log(`${name}: ${total / stocks.company_stock[name].sold_amount}`);
                if (total < getMinDaysOfStock() * stocks.company_stock[name].sold_amount) {
                    waitForJobSidebar(el => {
                        el.classList.add(
                            "warning___vczUU",
                            "highlight-active___pjUes"
                        );
                    });
                    break;
                }
            }
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
        });
}

run();