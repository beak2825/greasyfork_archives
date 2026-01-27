// ==UserScript==
// @name         TornW3B Scraper
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Scrapes your TornW3B favourites page and alerts you of deals
// @author       Biscuitius [1936433]
// @match        https://weav3r.dev/favorites
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weav3r.dev
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/564178/TornW3B%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/564178/TornW3B%20Scraper.meta.js
// ==/UserScript==

const PROFIT_MARGIN = 0.05; // 5% profit margin
const MIN_PROFIT = 100000; // Minimum $100,000 profit
const PUSHOVER_TOKEN = "aq7k4bo72uxp7i5pxzq9ow9914zted";
const PUSHOVER_USER = "unp566kwb2rrbrh54d85ghgdjaci5d";
const TRADER_WEBHOOKS = [
    "https://discord.com/api/webhooks/1417868461371031754/F8zZELvX0eacSuFPTpwKrHZnP7s31rKuqaPvO1R4pvpN8WdBicvVq4egbI87AAiGW_zI",
    "https://discord.com/api/webhooks/1464688526896398549/UhUiLqxXN9wqyo6oSy2oJYMhR6LWta-FuaVve538NbTLr_n-9BpIzX4H3Wx2N9qFGPa_"
]
const STORAGE_KEY = "w3b_alerted_deals";

// Get previously alerted deals from localStorage
function getAlertedDeals() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error("Error reading alerted deals:", e);
        return {};
    }
}

// Save alerted deal to localStorage
function saveAlertedDeal(dealKey) {
    try {
        const alerted = getAlertedDeals();
        alerted[dealKey] = Date.now();
        // Clean up deals older than 1 hour to prevent localStorage bloat
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        Object.keys(alerted).forEach(key => {
            if (alerted[key] < oneHourAgo) {
                delete alerted[key];
            }
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(alerted));
    } catch (e) {
        console.error("Error saving alerted deal:", e);
    }
}

// Create unique key for a deal
function createDealKey(itemID, buyPrice, sellPrice, quantity) {
    return `${itemID}_${buyPrice}_${sellPrice}_${quantity}`;
}

function waitForElement(selector, callback) {
    let checkExist = setInterval(function() {
        if ($(selector).length) {
            clearInterval(checkExist);
            callback();
        }
    }, 50);
}
waitForElement("div.rounded-lg:nth-child(1) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)", scrapeItems);

async function scrapeItems() {
    let itemGroupContainer = $("div.max-w-7xl:nth-child(3) > div:nth-child(1)");
    let itemCards = itemGroupContainer.children("div.rounded-lg");
    itemCards.each(async function() {

        let itemName = $(this).find(":nth-child(1) > div.flex-1 > a").text().trim();
        let itemID = $(this).find(":nth-child(1) > div.flex-1 > a").attr("href").split("/item/")[1];

        let firstListing =  $(this).find(":nth-child(2) > div > div:nth-child(1)")
        let firstListingLink = firstListing.find("div:nth-child(1) > a").attr("href");
        let firstListingQuantity = firstListing.find("div:nth-child(2) > div:nth-child(1) > span:nth-child(2)").text().trim();
        let firstListingPrice = parseInt(firstListing.find("div:nth-child(2) > div:nth-child(2) > span:nth-child(2)").text().replace('$', '').replace(/,/g, ''));

        let secondListing =  $(this).find(":nth-child(2) > div > div:nth-child(2)")
        let secondListingPrice = parseInt(secondListing.find("div:nth-child(2) > div:nth-child(2) > span:nth-child(2)").text().replace('$', '').replace(/,/g, ''));

        let totalBuyPrice = firstListingPrice * firstListingQuantity;
        let totalSellPrice = secondListingPrice * firstListingQuantity;
        let profit = totalSellPrice - totalBuyPrice;
        let profitMargin = profit / totalBuyPrice;

        if (profit >= MIN_PROFIT && profitMargin >= PROFIT_MARGIN) {
            // Create unique key for this deal
            const dealKey = createDealKey(itemID, firstListingPrice, secondListingPrice, firstListingQuantity);
            const alertedDeals = getAlertedDeals();
            
            // Only alert if we haven't seen this deal before
            if (!alertedDeals[dealKey]) {
                // Save this deal as alerted IMMEDIATELY to prevent race conditions
                saveAlertedDeal(dealKey);
                
                firstListingLink += `&itemId=${itemID}#/`
                console.log(`PROFIT ALERT: ${firstListingQuantity}x ${itemName} | Buy $${firstListingPrice.toLocaleString()} | Sell $${secondListingPrice.toLocaleString()} | Profit $${profit.toLocaleString()} | ${firstListingLink}`); 
                await sendPushoverNotification(`<b>$${totalBuyPrice.toLocaleString()} → $${profit.toLocaleString()}</b>\n${firstListingQuantity}x ${itemName}`, firstListingLink, "Open Bazaar");
                await sendDiscordAlert(itemName, firstListingQuantity, totalBuyPrice, totalSellPrice, profit, firstListingLink);
            } else {
                console.log(`Skipping duplicate alert for ${firstListingQuantity}x ${itemName}`);
            }
        }
    });
}


async function sendDiscordAlert(itemName, quantity, buyPriceTotal, sellPriceTotal, profit, bazaarLink) {
    const embed = {
        title: `${quantity}x ${itemName}`,
        url: bazaarLink,
        color: 165280,
        fields: [
            { name: "💸 Buy", value: `$${buyPriceTotal.toLocaleString()}`, inline: true },
            { name: "💰 Sell", value: `$${sellPriceTotal.toLocaleString()}`, inline: true },
            { name: "📈 Profit", value: `$${profit.toLocaleString()}`, inline: true }
        ],
        timestamp: new Date().toISOString()
    };
    
    const payload = JSON.stringify({ embeds: [embed] });
    
    for (const webhook of TRADER_WEBHOOKS) {
        try {
            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: webhook,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: payload,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response);
                        } else {
                            console.error(`Discord webhook failed: HTTP ${response.status}`);
                            reject(new Error(`HTTP error! status: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        console.error(`Discord webhook failed: ${error.message || 'Network error'}`);
                        reject(error);
                    }
                });
            });
        } catch (e) {
            console.error(`Discord alert failed: ${e.message}`);
        }
    }
}


async function sendPushoverNotification(message, url, urlTitle) {
    const data = new URLSearchParams({
        token: PUSHOVER_TOKEN,
        user: PUSHOVER_USER,
        message: message,
        html: 1
    });
    data.append('url', url);
    data.append('url_title', urlTitle);
    
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.pushover.net/1/messages.json",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: data.toString(),
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log("Pushover notification sent successfully");
                    resolve(response);
                } else {
                    console.error(`Pushover failed: HTTP ${response.status}`);
                    reject(new Error(`HTTP error! status: ${response.status}`));
                }
            },
            onerror: function(error) {
                console.error(`Pushover failed: ${error.message || 'Network error'}`);
                reject(error);
            }
        });
    });
}