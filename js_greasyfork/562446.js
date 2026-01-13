// ==UserScript==
// @name         IQRPG Dungeon Companion Modified By Timpp0
// @namespace    https://www.iqrpg.com/
// @version      0.5.0
// @author       Tempest (Modified by Timpp0)
// @description  QoL enhancement for IQRPG Dungeons
// @match        https://*.iqrpg.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @license      unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562446/IQRPG%20Dungeon%20Companion%20Modified%20By%20Timpp0.user.js
// @updateURL https://update.greasyfork.org/scripts/562446/IQRPG%20Dungeon%20Companion%20Modified%20By%20Timpp0.meta.js
// ==/UserScript==

/* global $ */

/*
 * Special thanks to Ciomegu for formula feedback
 */

// Added a price checker and cost calculator to Token Store Page to estimate what keys to buy

//-----------------------------------------------------------------------
// Config
//-----------------------------------------------------------------------

const KEY_API = {
    "Goblin Cave Key":        "dungeon_key_1",
    "Mountain Pass Key":      "dungeon_key_2",
    "Desolate Tombs Key":     "dungeon_key_3",
    "Dragonkin Lair Key":     "dungeon_key_4",
    "Sunken Ruins Key":       "dungeon_key_5",
    "Abandoned Tower Key":    "dungeon_key_101",
    "Haunted Cells Key":      "dungeon_key_102",
    "Hall Of Dragons Key":    "dungeon_key_103",
    "The Vault Key":          "dungeon_key_201",
    "The Treasury Key":       "dungeon_key_202"
};

async function fetchAllKeyPrices() {
    const results = {};

    for (const keyName of KEY_NAMES) {
        const apiId = KEY_API[keyName];
        const url = `https://www.iqrpg.com/php/market.php?mod=loadItems&itemid=${apiId}`;

        try {
            const res = await fetch(url, { credentials: "include" });
            const json = await res.json();

            if (json.sellOrders && json.sellOrders.length > 0) {
    const cheapest = json.sellOrders.reduce((a, b) =>
        a.cost < b.cost ? a : b
    );

    results[keyName] = {
        buyPrice: cheapest.cost,
        sellPrice: 0,
        available: cheapest.amount
    };
} else {
    results[keyName] = { buyPrice: 0, sellPrice: 0, available: 0 };
}


        } catch (err) {
            console.error("Failed to fetch", keyName, err);
            results[keyName] = { buyPrice: 0, sellPrice: 0, available: 0 };
        }
    }

    cacheMarketPrices(results);
    console.log("Updated all market prices:", results);

    drawEstimateTable();
    drawEstimateSelect();
}


/*              Tokens, Index, Name */
const TOKENS = [20, // 0 - Goblin
                25, // 1 - Mountain
                30, // 2 - Tomb
                35, // 3 - Lair
                40, // 4 - Ruins
                40, // 5 - Tower
                50, // 6 - Cells
                60, // 7 - Hall
               100, // 8 - Vault
               150];// 9 - Treasury

//-----------------------------------------------------------------------
// Market Price Tracking
//-----------------------------------------------------------------------

const CACHE_MARKET_PRICES = "cache_market_prices";
const CACHE_MARKET_TIMESTAMP = "cache_market_timestamp";
const MARKET_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const KEY_NAMES = [
    "Goblin Cave Key",
    "Mountain Pass Key",
    "Desolate Tombs Key",
    "Dragonkin Lair Key",
    "Sunken Ruins Key",
    "Abandoned Tower Key",
    "Haunted Cells Key",
    "Hall Of Dragons Key",
    "The Vault Key",
    "The Treasury Key"
];

/**
 * Identify which key is used for the estimates on the Token Store
 * To change, use the Index (0-9) from the list above.
 */
let INDEX_FOR_ESTIMATE = 0; // Default, 1 - Goblin Key

/**
 * Modify the token store page to show additional keys estimates.
 */
const MODIFY_TOKEN_STORE = 1; // 1 - Yes, 0 - No

/**
 * Used to store the Dungeon Keeper stats when you navigate from
 * the Personnel page, to the Dungeons and Token Store page.
 */
const CACHE_DUNGEON = "cache_dungeon"; // Cache for all the
const CACHE_ESTIMATE = "cache_estimate"; // Cache for all the


const RENDER_DELAY = 100; // Delay for modifying the page.


const RARITY_BONUS = 5; // Bonus (percent) per Rarity Level.
const MAX_BONUS = 1.65; // 65% is the maximum for bonus tokens.

//-----------------------------------------------------------------------
// CACHE
//-----------------------------------------------------------------------
/* We are caching the Dungeon Keeper stats,
 * which are updated each time the personnel page is visited.
 */
function writeCache( key, data ) {
  localStorage[key] = JSON.stringify(data);
}

function readCache( key ) {
  return JSON.parse(localStorage[key] || null) || localStorage[key];
}


//-----------------------------------------------------------------------
// Util
//-----------------------------------------------------------------------

/**
 * Bonus percent by level
 */
function bonusByLevel(level) {
    if(level < 50) return 0;
    if(level < 75) return 2;
    if(level < 100) return 5;
    if(level < 125) return 10;
    if(level < 150) return 20;

    return 40;
}

/**
 * Bonus percent by rarity
 */
function bonusTokens(rarity, level) {
    let percent = 0;
    rarity -= 1; // Rarity 1 (Common) doesn't apply any bonus, so we subtract it.
    percent += rarity * RARITY_BONUS; // Each rarity level after common.
    percent += bonusByLevel(level);

    return percent;
}

/**
 * The multiplier used in the total token calculation
 */
function bonusMultiplier() {

    const dkStats = readCache(CACHE_DUNGEON);

    const rarity = dkStats?.rarity || 0;
    const level = dkStats?.level || 0;
    let bonusPercent = bonusTokens(rarity, level);

    if(bonusPercent < 0) {
        bonusPercent = 0;
    }
    const bonusMultiplier = (1 + bonusPercent / 100);

    return bonusMultiplier;
}
function isMarketCacheValid() {
    const timestamp = readCache(CACHE_MARKET_TIMESTAMP);
    if (!timestamp) return false;
    return (Date.now() - timestamp) < MARKET_CACHE_DURATION;
}

function getCachedMarketPrices() {
    if (!isMarketCacheValid()) return null;
    return readCache(CACHE_MARKET_PRICES);
}

function cacheMarketPrices(prices) {
    writeCache(CACHE_MARKET_PRICES, prices);
    writeCache(CACHE_MARKET_TIMESTAMP, Date.now());
}

function calculateGoldCost(keysNeeded, keyIndex) {
    const marketPrices = getCachedMarketPrices();
    if (!marketPrices) return null;

    const keyName = KEY_NAMES[keyIndex];
    const keyPrice = marketPrices[keyName];

    if (!keyPrice || !keyPrice.buyPrice) return null;

    return {
        totalGold: keysNeeded * keyPrice.buyPrice,
        pricePerKey: keyPrice.buyPrice,
        keysNeeded: keysNeeded,
        keyName: keyName
    };
}

/**
 * Used to debounce DOM modifications
 */
let loadMarketOnce = false;
let loadDungeonsOnce = false;
let loadPersonnelOnce = false;
let loadTokenStoreOnce = false;
function parseMarketPage() {
    console.log('Parsing market page for key prices...');

    // Get the current item name from the page
const itemNameElement = $('.main-game-section .main-section__body .item.clickable p[class*="text-rarity"]');
    if (itemNameElement.length === 0) {
        console.log('No item found on market page');
        return;
    }

    const itemText = itemNameElement.text().trim();
    // Remove brackets: "[Goblin Cave Key]" -> "Goblin Cave Key"
    const itemName = itemText.replace(/[\[\]]/g, '');

    console.log('Found item:', itemName);

    // Check if this is a dungeon key
    if (!KEY_NAMES.includes(itemName)) {
        console.log('Item is not a dungeon key, skipping');
        return;
    }

    // Find the "For Sale" section
    const headings = $('.main-section__body p.heading');
    let forSaleTable = null;

    headings.each(function() {
        if ($(this).text().trim() === 'For Sale') {
            forSaleTable = $(this).next().find('table');
            return false;
        }
    });

    if (!forSaleTable || forSaleTable.length === 0) {
        console.log('Could not find For Sale table');
        return;
    }

    // Get the first row after the header (cheapest listing)
    const firstRow = forSaleTable.find('tr').eq(1);

    if (firstRow.length === 0) {
        console.log('No listings found for', itemName);
        return;
    }

    // Extract price from second column
    const priceText = firstRow.find('td').eq(1).text().trim();
    const price = parseInt(priceText.replace(/,/g, ''));

    if (isNaN(price) || price <= 0) {
        console.log('Invalid price found:', priceText);
        return;
    }

    console.log(`${itemName}: ${price.toLocaleString()} gold`);

    // Load existing cached prices
    let marketPrices = getCachedMarketPrices() || {};

    // Update the price for this specific key
    marketPrices[itemName] = {
        buyPrice: price,
        sellPrice: 0,
        available: 0
    };

    // Save back to cache
    cacheMarketPrices(marketPrices);
    console.log('Market price cached for', itemName);
}

function drawEstimateTable() {
    $('.removeTable').remove();

    let header = $('.main-game-section .main-section__body .heading')[1];
    let currentTokens = $(header).next().text();
    currentTokens = currentTokens.replace('[Dungeoneering Tokens]: ', '');
    currentTokens = currentTokens.replaceAll(',', '');
    currentTokens = parseInt(currentTokens);

    let table = $('.main-game-section .main-section__body table')[1];
    const trs = $('tr', table);
    let bonus = Math.round((bonusMultiplier() - 1) * 100);
    const marketPrices = getCachedMarketPrices();
    const hasMarketData = marketPrices !== null;

    // Headers
    $(trs[0]).append(`<td class='removeTable text-rarity-1'>No DK</td>`);
    $(trs[0]).append(`<td class='removeTable text-rarity-1'>Current DK (${bonus}%)</td>`);
    $(trs[0]).append(`<td class='removeTable text-rarity-1'>Max DK (65%)</td>`);

    if (hasMarketData) {
        $(trs[0]).append(`<td class='removeTable text-rarity-3'>Gold Cost</td>`);
    }

    // Rows
    for(let i = 1; i < trs.length; i += 1) {
        let td = $('td', trs[i]);
        let tokens = $(td[2]).text();
        tokens = tokens.replaceAll(',', '');
        tokens = parseInt(tokens);
        tokens -= currentTokens;
        if(tokens < 0) tokens = 0;

        INDEX_FOR_ESTIMATE = readCache(CACHE_ESTIMATE) || 0;
        const keys = Math.ceil(tokens / TOKENS[INDEX_FOR_ESTIMATE]);
        const keysBonus = Math.ceil(tokens / Math.ceil(TOKENS[INDEX_FOR_ESTIMATE] * bonusMultiplier()));
        const keysMax = Math.ceil(tokens / Math.ceil(TOKENS[INDEX_FOR_ESTIMATE] * MAX_BONUS));

        $(trs[i]).append(`<td class='removeTable'>${keys.toLocaleString()}</td>`);
        $(trs[i]).append(`<td class='removeTable'>${keysBonus.toLocaleString()}</td>`);
        $(trs[i]).append(`<td class='removeTable'>${keysMax.toLocaleString()}</td>`);

        // Gold cost column
        if (hasMarketData) {
            const costData = calculateGoldCost(keysBonus, INDEX_FOR_ESTIMATE);

            if (costData && costData.totalGold > 0) {
                const goldText = `${costData.totalGold.toLocaleString()} g`;
                const priceInfo = `${costData.pricePerKey.toLocaleString()} g/key`;
                $(trs[i]).append(`<td class='removeTable' title='${priceInfo}'>${goldText}</td>`);
            } else {
                $(trs[i]).append(`<td class='removeTable text-rarity-0'>N/A</td>`);
            }
        }
    }
}
function drawEstimateSelect() {
    // Remove previous dropdown + info
$('.estimateExplanation').remove();

    $('#keySelect').remove();
    $('.marketInfo').remove();

    let table = $('.main-game-section .main-section__body table')[1];
    const estimate = readCache(CACHE_ESTIMATE);
    const marketPrices = getCachedMarketPrices();

    let select = "<div class='marketInfo'>";
    select += "<select id='keySelect' onchange='window.changeKey()'>";

    for (let i = 0; i < KEY_NAMES.length; i++) {
        let optionText = KEY_NAMES[i];

        if (marketPrices && marketPrices[KEY_NAMES[i]] && marketPrices[KEY_NAMES[i]].buyPrice > 0) {
            const price = marketPrices[KEY_NAMES[i]].buyPrice.toLocaleString();
            optionText += ` (${price} g)`;
        }

        select += `<option value='${i}' ${estimate == i ? 'selected' : ''}>${optionText}</option>`;
    }

    select += "</select> is used for calculation above.<br/>";

    if (marketPrices) {
        const timestamp = readCache(CACHE_MARKET_TIMESTAMP);
        const minutesAgo = Math.floor((Date.now() - timestamp) / 60000);
        const keyCount = Object.keys(marketPrices).length;
        select += `<span class='text-rarity-2'>Market prices for ${keyCount}/${KEY_NAMES.length} keys (updated ${minutesAgo} min ago)</span><br/>`;
    } else {
        select += `<span class='text-rarity-0'>Visit Market pages to load current prices</span><br/>`;
    }

    select += "<br/></div>";

    $(table).after(select);
   $(table).after(`
    <div class="estimateExplanation">
        <br/>
        <p>The \`No\`, \`Current\`, and \`Max\` DK columns show keys needed. Gold cost uses current market buy prices (cheapest seller).</p>
        <br/>
    </div>
`);

}


function changeKey() {
    INDEX_FOR_ESTIMATE = $('#keySelect').val();
    writeCache(CACHE_ESTIMATE, INDEX_FOR_ESTIMATE);
    drawEstimateTable();
}

window.changeKey = changeKey;

function onReadyStateChangeReplacement(e) {
// This is called anytime there is an action complete, or a view (page) loads.
    // console.log('Response URL', this.responseURL);
    //
/**
 * Market page - Parse and cache key prices
 */
if (e.responseURL.includes("/market/dungeon_keys") ||
    e.responseURL.includes("php/market.php")) {

    // Always allow parsing again on each market response
    loadMarketOnce = false;

    if (e.response) {
        loadMarketOnce = true;
        setTimeout(parseMarketPage, RENDER_DELAY * 2);
    }
}

    /**
     * Remove the message at the top of the Dungeon page, only if we've left the Dungeon page.
     */
    let accordians = $('.main-game-section .main-section__body .accordian');
    if(accordians.length !== TOKENS.length) { // Each dungeon has a accordion.
      $('.removeMe').remove();
    }

    setTimeout( () => {

        /**
         * Token Store page.
         *
         * Modify the table to show how many remaining keys need to be used, with various
         * amounts of bonus tokens applied.
         */
if (e.responseURL.includes("php/store.php?mod=tokenStore")) {

    if (!MODIFY_TOKEN_STORE) return;

    if (e.response && !loadTokenStoreOnce) {
        loadTokenStoreOnce = true;

        drawEstimateTable();
        drawEstimateSelect();

        // Add button only once
        if (!document.getElementById("fetchPricesBtn")) {
            const btn = document.createElement("button");
            btn.id = "fetchPricesBtn";
            btn.textContent = "Fetch Market Prices";
            btn.style.margin = "10px 0";
            btn.onclick = async () => {
                btn.textContent = "Fetching...";
                await fetchAllKeyPrices();
                btn.textContent = "Fetch Market Prices";
            };

            $('.main-game-section .main-section__body').prepend(btn);
        }
    }

} else {
    loadTokenStoreOnce = false;
    $('#fetchPricesBtn').remove();// ← remove button when leaving Token Store
}



        /**
         * Personnel page.
         *
         * Read and cache the dungeon keeper information.
         */
        if(e.responseURL.includes("php/land.php?mod=loadPersonnel")) {
            if(e.response && !loadPersonnelOnce) {

                loadPersonnelOnce = true;

                const dkStats = JSON.parse(e.response).personnel.dungeon_keeper;
                const payload = {
                    level: dkStats.level, rarity : dkStats.rarity
                };

                writeCache(CACHE_DUNGEON, payload);
            }
        } else {
            loadPersonnelOnce = false;
        }

        /**
         * Dungeons page.
         *
         * Display the total tokens you could earn from each type of key, and total.
         */
        if(e.responseURL.includes("php/areas.php?mod=loadDungeons")) {

            if(e.response && !loadDungeonsOnce) {

                $('.removeMe').remove(); // Remove a previous one

                loadDungeonsOnce = true;

                const dungeonsCount = $('.accordian__item').length;

                let grandTotal = 0;

                for(let i = 0; i < dungeonsCount; i +=1) {
                    /**
                     * Find the amount of keys for each dungeon
                     */
                    let acc = $('.accordian__item')[i]; // Accordion
                    let leftContent = $('div', acc)[0]; // [0] - Dungeon Name, [1] - Amount and Key
                    let rightContent = $('div', acc)[1]; // [0] - Dungeon Name, [1] - Amount and Key
                    let amount = $(rightContent).text().split('x ')[0]; // Amountx [Key Name] -- Get Amount
                    const total = amount * Math.ceil(TOKENS[i] * bonusMultiplier()); // total tokens

                    /**
                     * Modify existing DOM element with total tokens available.
                     */
                    $(leftContent).after(`<div><span class='text-rarity-1'>${total.toLocaleString()}</span> tokens</div>`);

                    grandTotal += total; // add total to running grand total

                }

                let header = `<span class='removeMe'>`;
                 /**
                  * Usually we're modifying an element which is re-rendered.
                  * In this case, we're not. So we need to remove it ourselves.
                  */

                /**
                 * Read from cache, set defaults in case Personnel page has not been visited.
                 */
                const dkStats = readCache(CACHE_DUNGEON);
                const rarity = dkStats?.rarity || 0;
                const level = dkStats?.level || 0; // Untrained, it would be level 1.
                const bonusPercent = bonusTokens(rarity, level);


                if(!level) {
                    /**
                     * User has not visited the Personnel page yet.
                     */
                    header += `<p>Userscript not synced with your <span class='green-text'>Dungeon Keeper</span>. `;
                    header += `Visit your Personnel to update the token calculation.</p><br/>`;
                } else {
                    /**
                     * Display the cached Dungeon Keeper stats.
                     */
                    header += `<p>Your <span class='text-rarity-${rarity}'>Dungeon Keeper</span> (Level <span class='green-text'>${level}</span>)</span> - ${bonusPercent}% Bonus</p></br>`;
                }

                /**
                 * Display the grand total amount of tokens.
                 */
                header += `<p><b><span class='text-rarity-1'>${grandTotal.toLocaleString()} tokens</b></span> total.</p><br/></span>`;

                $('.main-game-section .main-section__body').prepend(header);

            }
        } else {
            loadDungeonsOnce = false;
        }

    }, RENDER_DELAY );
}

//-----------------------------------------------------------------------
// HTTP Request Override -- DO NOT EDIT
//-----------------------------------------------------------------------
let send = window.XMLHttpRequest.prototype.send;

function sendReplacement() {
    let old = this.onreadystatechange;

    this.onreadystatechange = () => {
        onReadyStateChangeReplacement(this);
        if(old) {
            old();
        }
    }

    return send.apply(this, arguments);
}

window.XMLHttpRequest.prototype.send = sendReplacement;