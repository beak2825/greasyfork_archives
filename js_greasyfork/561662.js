// ==UserScript==
// @name         DMA - Discount visualizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Color Code Market prices Based on % below market average
// @license MIT
// @author       You
// @match        https://www.torn.com/page.php?*
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/561662/DMA%20-%20Discount%20visualizer.user.js
// @updateURL https://update.greasyfork.org/scripts/561662/DMA%20-%20Discount%20visualizer.meta.js
// ==/UserScript==   
            const test = 'test'
const baseUrl = "https://api.torn.com/v2/";
const endpoint = "torn/items";
const key = "<ADD YOUR API KEY HERE>";
let masterItems = [];

 (function() {
    'use strict';
    GM_addStyle (`
        .dma_red {
            color: red !important;
       }
        .dma_green {
            color: green !important;
        }
    `);


     const storageItemsString = localStorage.getItem('masterItems');
     const storageItems = storageItemsString ? JSON.parse(storageItemsString) : '';
     const masterItemsTimestamp = localStorage.getItem('masterItemsTimestamp') || 0
     const now = Date.now()
     const twoHoursAgo = now - (2 * 60 * 60 * 1000)

     if (!storageItems || storageItems.length <= 0) {
         console.log('********No Storage items Found, Setting Initial Storage Items...')
         setLocalStorageCategory('All')
         localStorage.setItem('masterItemsTimestamp', now)
     } else if ( masterItemsTimestamp < twoHoursAgo) {
         console.log('********Storage Items out of date. Resetting...')
         setLocalStorageCategory('All')
         localStorage.setItem('masterItemsTimestamp', now)
     } else {
         console.log('********NO API CALL MADE, Using values from Storage********')
         masterItems = storageItems
     }

     setInterval(getElements, 1000);
 })();


function setLocalStorageCategory(category) {
    console.log('********Category API Call ********')
    GM_xmlhttpRequest({
        method: "GET", // or "POST", "PUT", "DELETE", etc.
        url: `${baseUrl}${endpoint}?cat=${category}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `ApiKey ${key}`
        },
        onload: function(response) {
            if (response.status >= 200 && response.status < 300) {
                console.log(`API call successful: for ${category}`);
                // Process the API response data here
                const data = JSON.parse(response.responseText);

                const {items: categoryItems} = data

                masterItems = categoryItems
                localStorage.setItem('masterItems', JSON.stringify(categoryItems))
            } else {
                console.error("API call failed:", response.status, response.statusText);
            }
        },
        onerror: function(response) {
            console.error("Error during API call:", response.error);
        }
    });
}


function getCategoryItems(category) {
    GM_xmlhttpRequest({
        method: "GET", // or "POST", "PUT", "DELETE", etc.
        url: `${baseUrl}${endpoint}?cat=${category}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `ApiKey ${key}`
        },
        onload: function(response) {
            if (response.status >= 200 && response.status < 300) {
                console.log(`API call successful: for ${category}`);
                const data = JSON.parse(response.responseText);
                const {items: categoryItems} = data

                categoryItems.forEach((item)=>{masterItems.push(item)});
            } else {
                console.error("API call failed:", response.status, response.statusText);
            }
        },
        onerror: function(response) {
            console.error("Error during API call:", response.error);
        }
    });
}


function getElements() {
    console.log('*******Getting Elements*******')
    let items = document.querySelectorAll('[class^="itemTile"]')

    items = Array.from(items).filter((item)=>{
        const fullName = item.querySelector('div[class^="name__"]')
        const name = fullName?.textContent

        return !['Dozen White Roses'].includes(name)
    })

    items.forEach((item)=>{
        const fullName = item.querySelector('div[class^="name__"]')
        const name = fullName?.textContent
        const fullPrice = item.querySelector('[class^="priceAndTotal___"] > span')
        const total = item.querySelector('[class^="titleTotal___"]')
        let price = fullPrice ? fullPrice.textContent.match(/[,\d]+/)[0] : '';

        if (price) {
            price = parseInt(price.replaceAll(',',''));
        }

        if (name) {
            const matchingItem = masterItems.find((a)=>{
            return a.name === name
        })

        const marketPrice = matchingItem?.value?.market_price

        if ( price < marketPrice) {

            const difference = marketPrice - price
            const percentage = (difference / marketPrice) * 100
            const displayPercentage = percentage.toFixed(2)

            if (percentage > 0 && percentage <= 0.5) {

                fullPrice.style.color='lightgreen';
                total.style.color='lightgreen';
                total.textContent=` -${displayPercentage}`
            }

            if ( percentage > 0.5 && percentage <= 1 ) {
                fullPrice.style.color='green';
                total.style.color='green';
                total.textContent=` -${displayPercentage}`
            }

            if ( percentage > 1 && percentage <=2 ) {
                fullPrice.style.color='goldenrod';
                total.style.color='goldenrod';
                total.textContent=` -${displayPercentage}`
            }

            if (percentage >= 2 && percentage < 4) {
                fullPrice.style.color='orange'
                total.style.color='orange'
                total.textContent=` -${displayPercentage}`
            }

            if (percentage >=4) {
                fullPrice.style.color='red'
                total.style.color='red'
                total.textContent=` -${displayPercentage}`
            }

        } else {
            const overage = price - marketPrice
            const overagePercent = (overage / marketPrice) * 100
            const displayOverage = overagePercent.toFixed(2)

            fullPrice.style.color='';
            total.style.color='';
            total.textContent=` +${displayOverage}`;
        }
    }
    })
}


 function getSelectorValue( selector, element, attribute = '' ) {
    if (!element) return '';

    const el = selector ? element.querySelector(selector) : element;
    if (!el) return '';

    const value = el && attribute ? el.getAttribute(attribute) : el.textContent;
    return value ? value.trim() : '';
}