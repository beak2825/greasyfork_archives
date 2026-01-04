// ==UserScript==
// @name         Bazaar Auto Price (Category-Based)
// @namespace    tos-MonChoon_
// @version      0.9.0
// @description  Auto set bazaar prices using market price with category multipliers. Modified by MonChoon.
// @license      MIT
// @author       tos, Lugburz, MonChoon [2250591]
// @match        *.torn.com/bazaar.php*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/549400/Bazaar%20Auto%20Price%20%28Category-Based%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549400/Bazaar%20Auto%20Price%20%28Category-Based%29.meta.js
// ==/UserScript==

/*
 * Original script by tos, Lugburz
 * Modified by MonChoon [2250591] for category-based pricing
 *
 * =============================================================================
 * 🔑 API KEY CONFIGURATION - EDIT THE LINE BELOW WITH YOUR API KEY
 * =============================================================================
 *
 * Replace YOUR_LIMITED-ACCESS_API_KEY with your actual 16-character API key from:
 * https://www.torn.com/preferences.php#tab=api
 *
 * Required Access Level: Limited Access
 *
 * =============================================================================
 * 📋 CATEGORY MULTIPLIERS - EDIT THESE TO ADJUST YOUR PRICING STRATEGY
 * =============================================================================
 *
 * These multipliers are applied to the market price for each category.
 * Values below 1.0 will price below market (more competitive).
 * Adjust based on your desired profit margins and market competitiveness.
 *
 */

const apikey = 'YOUR_LIMITED-ACCESS_API_KEY'; // ← EDIT THIS LINE WITH YOUR API KEY

// Category-based selling multipliers (applied to market_price)
const CATEGORY_MULTIPLIERS = {
    'Flower': 0.985,
    'Plushie': 0.985,
    'Energy Drink': 0.985,
    'Booster': 0.98,
    'Supply Pack': 0.97,
    'Drug': 0.95,
    'Alcohol': 0.97,
    'Candy': 0.97,
    'Medical': 0.96,
    'Temporary': 0.95,
    'Clothing': 0.93,
    'Primary': 0.92,
    'Secondary': 0.92,
    'Melee': 0.92,
    'Armour': 0.92,
    'Enhancer': 0.98,
    'Car': 0.92,
    'Tool': 0.96,
    'Material': 0.96,
    'Jewelry': 0.96,
    'Special': 0.97,
    'Collectible': 0.94,
    'Miscellaneous': 0.94,
    'Artifact': 0.97,
    // Default multiplier for unknown categories
    'default': 0.95
};

// =============================================================================
// DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING
// =============================================================================

// Validate API key format
if (apikey === 'YOUR_LIMITED-ACCESS_API_KEY' || !apikey || apikey.length !== 16) {
    alert('⚠️ Bazaar Auto Price Error:\n\nPlease edit the script and replace YOUR_LIMITED-ACCESS_API_KEY with your actual API key.\n\nGet your API key from:\nhttps://www.torn.com/preferences.php#tab=api\n\nRequired Access Level: Limited Access\n(Higher access levels like Full Access will also work)');
    throw new Error('Invalid API key configuration');
}

// Cache for item data to reduce API calls
const itemCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const torn_api_v2_items = async (itemID) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/torn/${itemID}/items?key=${apikey}`,
            headers: {
                "Content-Type": "application/json"
            },
            onload: (response) => {
                try {
                    const resjson = JSON.parse(response.responseText);

                    // Check for API errors
                    if (resjson.error) {
                        if (resjson.error.code === 2) {
                            console.error('❌ Invalid API Key - Check your API key configuration');
                        } else if (resjson.error.code === 5) {
                            console.error('⚠️ API Rate Limit: Too many requests. Please wait before trying again.');
                        }
                        reject(new Error(resjson.error.error || 'API Error'));
                        return;
                    }

                    resolve(resjson);
                } catch(err) {
                    reject(err);
                }
            },
            onerror: (err) => {
                reject(err);
            }
        });
    });
}

var event = new Event('keyup');
var APIERROR = false;

async function calculatePrice(itemID) {
    if(APIERROR === true) return 'API key error';

    // Check cache first
    const cached = itemCache.get(itemID);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log(`Using cached price for item ${itemID}: ${cached.price}`);
        return cached.price;
    }

    try {
        const response = await torn_api_v2_items(itemID);

        if (response.error) {
            APIERROR = true;
            return 'API key error';
        }

        // Check if we have item data
        if (response.items && response.items.length > 0) {
            const item = response.items[0];
            const marketPrice = item.value?.market_price;
            const category = item.type;

            if (!marketPrice || marketPrice === 0) {
                console.warn(`No market price available for item ${itemID} (${item.name})`);
                return 'No market data';
            }

            // Get the multiplier for this category (default to 0.95 if category not found)
            const multiplier = CATEGORY_MULTIPLIERS[category] || CATEGORY_MULTIPLIERS['default'];

            // Calculate the selling price
            const sellingPrice = Math.floor(marketPrice * multiplier);

            console.log(`Item: ${item.name} | Category: ${category} | Market: $${marketPrice.toLocaleString()} | Multiplier: ${multiplier} | Selling: $${sellingPrice.toLocaleString()}`);

            // Cache the result
            itemCache.set(itemID, {
                price: sellingPrice,
                timestamp: Date.now()
            });

            return sellingPrice;
        } else {
            return 'No item data available';
        }
    } catch (error) {
        console.error('Bazaar Auto Price API Error:', error);
        APIERROR = true;
        return 'API error';
    }
}

// HACK to simulate input value change
// https://github.com/facebook/react/issues/11488#issuecomment-347775628
function reactInputHack(inputjq, value) {
    // get js object from jquery
    const input = $(inputjq).get(0);

    let lastValue = 0;
    input.value = value;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

function addOneFocusHandler(elem, itemID) {
    $(elem).on('focus', function(e) {
        this.value = '';
        if (this.value === '') {
            calculatePrice(itemID).then((price) => {
                reactInputHack(this, price);
                this.dispatchEvent(event);
                if(price && typeof price === 'number') $(elem).off('focus');
            });
        }
    });
}

const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (typeof node.classList !== 'undefined' && node.classList) {
                const remove = $(node).find('[class*=removeAmountInput]');
                let input = $(node).find('[class^=input-money]');
                if ($(input).size() > 0 && $(remove).size() > 0) {
                    // Manage items
                    $(input).each(function() {
                        const img = $(this).parent().parent().find('img');
                        const src = $(img).attr('src');
                        if (src) {
                            const itemID = src.split('items/')[1].split('/medium')[0];
                            const inp = $(this).find('.input-money[type=text]');
                            addOneFocusHandler($(inp), itemID);
                        }
                    });
                } else if ($(input).size() > 0) {
                    // Add items
                    input = node.querySelector('.input-money[type=text]');
                    const img = node.querySelector('img');
                    if (input && img) {
                        const itemID = img.src.split('items/')[1].split('/medium')[0].split('/large.png')[0];
                        addOneFocusHandler($(input), itemID);

                        // input amount
                        const input_amount = $(node).find('div.amount').find('.clear-all[type=text]');
                        const inv_amount = $(node).find('div.name-wrap').find('span.t-hide').text();
                        const amount = inv_amount == '' ? 1 : inv_amount.replace('x', '').trim();
                        $(input_amount).on('focus', function() {
                            reactInputHack(input_amount, amount);
                        });
                    }
                }
            }
        }
    }
});

const wrapper = document.querySelector('#bazaarRoot');
if (wrapper) {
    observer.observe(wrapper, { subtree: true, childList: true });
}

// Log configuration on load
console.log('=== Bazaar Auto Price (Category-Based) Loaded ===');
console.log('Category Multipliers:', CATEGORY_MULTIPLIERS);
console.log('Cache Duration:', CACHE_DURATION / 1000, 'seconds');
console.log('===============================================');
