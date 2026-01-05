// ==UserScript==
// @name               Dota 2 & CSGO Lounge item price displayer
// @namespace          http://www.enygma.ro
// @version            3.0.2
// @author             Enygma
// @description        Displays an item's price information from the Steam Community Market and helps to copy an item's name.
// @license            GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include            /^http(s)?://(www.)?dota2lounge.com//
// @include            /^http(s)?://(www.)?csgolounge.com//
// @supportURL         https://github.com/Enygma2002/d2l-price-displayer/issues
// @contributionURL    https://github.com/Enygma2002/d2l-price-displayer#donations
// @contributionAmount $5.00 / Game / Items
// @grant              GM_xmlhttpRequest
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/666/Dota%202%20%20CSGO%20Lounge%20item%20price%20displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/666/Dota%202%20%20CSGO%20Lounge%20item%20price%20displayer.meta.js
// ==/UserScript==

// Determine on which site is the script being executed (dota2lounge or csgolounge)
if (document.URL.match(/^http(s)?:\/\/(www.)?dota2lounge.com\//)) {
    // Dota2 app ID on Steam's community market website.
    appID = 570;

    // Generic item placeholder names used by the d2l website and not existing in the Steam Market.
    genericItemPlaceholderNames = ["Offers", "Any Common", "Any Uncommon", "Any Rare", "Any Mythical", "Any Legendary",
                                   "Any Ancient", "Any Immortal", "Real Money", "+ More", "Any Set"];
} else if (document.URL.match(/^http(s)?:\/\/(www.)?csgolounge.com\//)) {
    // CS:GO app ID on Steam's community market website.
    appID = 730;

    // Generic item placeholder names used by the csgolounge website and not existing in the Steam Market.
    genericItemPlaceholderNames = ["Any Offers", "Real Money", "Dota Items", "TF2 Items"];
}

// A mapping of available currencies that the Steam Market supports and their individual features.
var availableCurrencies = {
    "$"     : { symbol: "USD", decimal: '.', id: 1 },
    "£"     : { symbol: "GBP", decimal: '.', id: 2 },
    "€"     : { symbol: "EUR", decimal: ',', id: 3 },
    "pуб."  : { symbol: "RUB", decimal: ',', id: 5 },
    "R$"    : { symbol: "BRL", decimal: ',', id: 7 },
    "¥"     : { symbol: "JPY", decimal: '.', id: 8 },
    "kr"    : { symbol: "NOK", decimal: ',', id: 9 },
    "Rp"    : { symbol: "IDR", decimal: '.', id: 10 },
    "RM"    : { symbol: "MYR", decimal: '.', id: 11 },
    "P"     : { symbol: "PHP", decimal: '.', id: 12 },
    "S$"    : { symbol: "SGD", decimal: '.', id: 13 },
    "฿"     : { symbol: "THB", decimal: '.', id: 14 },
    "₫"     : { symbol: "VND", decimal: '.', id: 15 },
    "₩"     : { symbol: "KRW", decimal: '.', id: 16 },
    "TL"    : { symbol: "TRY", decimal: ',', id: 17 },
    "₴"     : { symbol: "UAH", decimal: ',', id: 18 },
    "Mex$"  : { symbol: "MXN", decimal: '.', id: 19 },
    "CDN$"  : { symbol: "CAD", decimal: '.', id: 20 },
    "A$"    : { symbol: "AUD", decimal: '.', id: 21 },
    "NZ$"   : { symbol: "NZD", decimal: '.', id: 22 }
    // Add more as Steam makes them available.
};

// Validate a currency, otherwise default to USD.
var validateCurrency = function(currency) {
    var result = "$";

    if (availableCurrencies[currency]) {
        result = currency;
    }

    return result;
};

// Get the user selected currency, if available, otherwise (or if invalid) default on USD.
var currentCurrency = validateCurrency(GM_getValue("currency"));

// Registers the currency selection box in the top right of the website.
var attachCurrencySelector = function() {
    var headerElement = document.querySelector('header');

    var currencySelector = document.createElement('div');
    currencySelector.setAttribute("class", "ddbtn currency");

    var currencySelectorHTML = "<div>";

    // Add the currently selected currency.
    var currentCurrencyInfo = availableCurrencies[currentCurrency];
    currencySelectorHTML += "<a id='" + currentCurrency + "'>" + currentCurrencyInfo.symbol + "</a>";

    // Add all the other available currencies to select from.
    var availableCurrencyCodes = Object.keys(availableCurrencies);
    for (var i=0; i<availableCurrencyCodes.length; i++) {
        var currencyCode = availableCurrencyCodes[i];
        // Skip the currently selected currency to avoid displaying it twice.
        if (currentCurrency === currencyCode) {
            continue;
        }

        var currencyInfo = availableCurrencies[currencyCode];
        currencySelectorHTML += "<a id='" + currencyCode + "'>" + currencyInfo.symbol + "</a>";
    }

    // Add the donations button.
    currencySelectorHTML += "<a id='donate' title='Show your appreciation for the script' ";
    currencySelectorHTML += "href='https://github.com/Enygma2002/d2l-price-displayer#donations' target='_blank'>Donate</a>";

    currencySelectorHTML += "</div>";

    currencySelector.innerHTML = currencySelectorHTML;

    headerElement.appendChild(currencySelector);

    // Attach click event listeners for all the available languages in the list.
    var availableCurrencyElements = currencySelector.querySelectorAll("a:not([id='donate'])");
    for (var i=0; i<availableCurrencyElements.length; i++) {
        var availableCurrencyElement = availableCurrencyElements[i];
        availableCurrencyElement.addEventListener('click', function(mouseEvent) {
            // Set the selected currency.
            var selectedCurrency = mouseEvent.target.id;
            setCurrentCurrency(selectedCurrency);

            // Refresh the list of available languages to reflect the new selection.
            headerElement.removeChild(currencySelector);
            attachCurrencySelector();

            // Refresh any already retrieved prices to use the newly selected currency.
            refreshExistingPrices();
        });
    }
};
attachCurrencySelector();

// Set the new current currency and save it so that it is available next time we reload the page.
var setCurrentCurrency = function(newCurrentCurrency) {
    // Make sure we set a valid currency.
    var validatedNewCurrency = validateCurrency(newCurrentCurrency);

    // Set the cached value used by the script.
    currentCurrency = validatedNewCurrency;

    // Save the new value.
    GM_setValue("currency", validatedNewCurrency);
};

// Refresh all the currently retrieved prices (that were hovered at some point) so that they are displayed consistenly
// using the actual currentCurrency and not the currency that was active then they were first retrieved (hovered).
var refreshExistingPrices = function() {
    var itemNameElements = document.querySelectorAll(".oitm > .name");
    for (var i=0; i<itemNameElements.length; i++) {
        var itemElement = itemNameElements[i].parentNode;
        if (itemElement.querySelector('.extraPanel')) {
            // Retrieve and override new values.
            getLowestPrice(itemElement, true);
        }
    }
};

// Main event listener for hovering items.
document.addEventListener("mouseover", function (event) {
    var itemElement = getItemElement(event);
    if (!itemElement) {
        return;
    }

    attachExtraPanelAndListeners(itemElement);
    getLowestPrice(itemElement);
});

// Get the hovered item, if any.
var getItemElement = function(mouseEvent) {
    var targetElement = mouseEvent.target;
    var itemElement = null;

    // Check the hovered element to see if it's an item element or one of it's children (image or rarity section).

    // Old d2l website layout that used directly the "item" display and within it the "name" panel;
    // It is now only present on csgolounge but we still want to support it in order to work with both sites.
    if (hasClass(targetElement, "item") && targetElement.querySelector(".name")) {
        // Hover the item display (contains image and rarity section)
        itemElement = targetElement;
    } else if (hasClass(targetElement.parentNode, "item") && targetElement.parentNode.querySelector(".name")) {
        // Hover an individual item display's children (image or rarity section)
        itemElement = targetElement.parentNode;
    } else
    // New d2l website layout, that uses an "oitm" container for the "item" display and the "name" panel
    if (hasClass(targetElement, "oitm")) {
        // Hover the main container (contains item display and item popup).
        itemElement = targetElement;
    } else if (hasClass(targetElement.parentNode, "oitm")) {
        // Hover the item display (contains image and rarity section)
        itemElement = targetElement.parentNode;
    } else if (hasClass(targetElement.parentNode, "item")) {
        // Hover an individual item display's children (image or rarity section)
        itemElement = targetElement.parentNode.parentNode;
    } else {
        // Hovered an uninteresting element of the UI.
        return null;
    }

    // Avoid returning empty item slots.
    var itemNameElement = itemElement.querySelector(".name");
    if (!itemNameElement) {
        return null;
    }

    // Avoid returning generic item placeholders.
    var itemName = getItemName(itemElement);
    if (genericItemPlaceholderNames.indexOf(itemName) > -1) {
        return null;
    }

    return itemElement;
};

// Add to the specified item element an extra panel that contains the price information and a click handler to facilitate copying the item's name 
var attachExtraPanelAndListeners = function(itemElement) {
    var itemNamePanel = itemElement.querySelector(".name");
    // If the extra panel already exists, stop here.
    var extraPanel = itemNamePanel.querySelector(".extraPanel");
    if (extraPanel) {
        return;
    }

    // Otherwise, create our own panel to append... 
    extraPanel = document.createElement('div');
    extraPanel.innerHTML = "<span class='scriptStatus'>Ready</span>" +
        "<button type='button' class='extraButton refreshButton' title='Refresh'/>";
    extraPanel.setAttribute("class", "extraPanel");

    // ...and append it.
    // Note: In case we are in the "My Trades" view, make sure to insert before the remove button.
    var insertBeforeElement = itemNamePanel.querySelector("a.button");
    itemNamePanel.insertBefore(extraPanel, insertBeforeElement);
    // Set click event handler for the item's name panel so that the item name can be copied to the clipboard easier.
    itemNamePanel.addEventListener("click", copyItemNameHandler, false);
    // Set click event handler for the refresh button that re-fetches the item's price.
    var refreshButton = extraPanel.querySelector(".refreshButton");
    refreshButton.addEventListener("click", function(event) {
        event.stopPropagation();
        getLowestPrice(itemElement, true);
    }, false);
};

// Get the lowest price for an item from the Steam market.
var getLowestPrice = function(itemElement, override) {
    var itemNameElement = itemElement.querySelector(".name");
    // Don`t try to get the price if we've already retrieved it.
    if (!override && itemNameElement.querySelector(".scriptStatus").innerHTML != "Ready") {
        return;
    }

    itemNameElement.querySelector(".scriptStatus").innerHTML = "Loading...";
    var itemName = getItemName(itemElement);
    var url = getSteamMarketListingsURL(itemName);
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            var jsonResponse = response.responseText;
            var priceObj = eval("(" + jsonResponse + ")");
            var result = "<span class='itemNotMarketable'>Not Marketable</span>";
            // Get only valid responses, since we can sometimes see JSONs with success: true and nothing else.
            if (priceObj.success && priceObj.lowest_price) {
                // Extra information to be displayed when hovering the price.
                var extraInfo = "Median price: " + (priceObj.median_price || "N/A") + "\n";
                extraInfo += "Daily transactions: " + (priceObj.volume || "N/A");

                // Determine the trend, if possible.
                var lowestPrice = getPriceValue(priceObj.lowest_price);
                var medianPrice = getPriceValue(priceObj.median_price);
                var trend = null;
                if (lowestPrice && medianPrice) {
                    if (lowestPrice > medianPrice) {
                        // Ascending trend.
                        trend = "&#8599;";
                    } else if (lowestPrice < medianPrice) {
                        // Descending trend.
                        trend = "&#8600;";
                    } else {
                        // Stagnating trend.
                        trend = "&#8594;";
                    }
                }

                // Determine price safety
                var priceSafety = getPriceSafety(priceObj.volume);

                // Build the result.
                result = "<span class='itemMarketable " + priceSafety + "' title='" + extraInfo + "'>";
                result += priceObj.lowest_price;
                if (trend) {
                    result += " " + trend;
                }
                result += "</span>";
            }

            // Set the result.
            itemNameElement.querySelector(".scriptStatus").innerHTML = result;
        },
        onerror: function (response) {
            // Determine the error and build the result.
            var reason = response.statusText;
            var result = "<span class='error' title='" + reason + "'>Error</span>";

            // Set the result.
            itemNameElement.querySelector(".scriptStatus").innerHTML = result;
        }
    });
};

// Cached RegExps used by getPriceValue.
var currencySymbolRegex = new RegExp("&#[0-9]+;");
var numberSanitizingRegex = new RegExp("[^0-9]");

// Extract the numeric value from a currency-value string combination.
var getPriceValue = function(priceWithCurrency) {
    // Some prices are not available for certain items.
    // Example: Dota2's Voracious Greevil displays only lowest_price, nothing else.
    if (!priceWithCurrency) {
        return null;
    }

    // Sanitize the input string since it is html escaped in the returned JSON.
    priceWithCurrency = unescapeHtml(priceWithCurrency);

    // Strip out the currency symbol and any spaces.
    var priceString = priceWithCurrency.replace(currentCurrency, '').trim();

    // Strip out any thousand marker from the price, since parseFloat might get confused on some locales.
    var currencyInfo = availableCurrencies[currentCurrency];
    var decimalIndex = priceString.lastIndexOf(currencyInfo.decimal);
    var integerValue = priceString.substring(0, decimalIndex).replace(numberSanitizingRegex, '');
    var fractionalValue = priceString.substring(decimalIndex + 1);
    // When rebuilding the cleaned priceString, always use '.' since that is the only thing parseFloat understands.
    priceString = integerValue + '.' + fractionalValue;

    // Parse and return the value.
    return parseFloat(priceString);
};

// Helper method to unescape an escaped HTML string, such as what we get from the price JSON.
var unescapeHtml = function(escapedStr) {
    var div = document.createElement("div");
    div.innerHTML = escapedStr;
    var child = div.childNodes[0];

    return child ? child.nodeValue : "";
};

// Cached RegExp used in getPriceSafety.
var thousandSeparatorRegex = new RegExp("[,.]");

/*
 * If price volume information is available (nr. of daily transactions), we determine price "safety" based on how many
 * transactions are for the item. Few transactions (<= 10) means the item is not popular and it will be harder to get rid of.
 *
 * If no volume information exists, the default is "priceUnsafe".
 */
var getPriceSafety = function(priceVolumeString) {
    var result = "priceUnsafe";

    if (priceVolumeString) {
        // Make sure to clean the volume string of any thousand separator that can cause problems in the conversion.
        var dailyTransactions = parseInt(priceVolumeString.replace(thousandSeparatorRegex, ""));

        // This is where we actually determine the "safety" of a price.
        if (dailyTransactions <= 10) {
            result = "priceUnsafe";
        } else if (dailyTransactions <= 50) {
            result = "priceWarning";
        } else {
            result = "priceSafe";
        }
    }

    return result;
};

// Computes the URL used to access the Steam market listings for a given item.
var getSteamMarketListingsURL = function(itemName) {
    var itemNameEncoded = encodeURIComponent(itemName);
    var currencyInfo = availableCurrencies[currentCurrency];

    var url = "http://steamcommunity.com/market/priceoverview/?appid=" + (appID);
    url += "&market_hash_name=" + itemNameEncoded;
    url += "&currency=" + currencyInfo.id;

    return url;
};

// Extract the item's name from a DOM item element.
var getItemName = function(itemElement) {
    var itemNameElement = itemElement.querySelector(".name");
    var itemName = itemNameElement.querySelector("b").innerHTML.trim();

    return itemName;
};

// Event handler to facilitate copying an item's name.
var copyItemNameHandler = function(event) {
    var clickedElement = event.target;

    // Avoid executing this handler if the "Remove item" button is clicked in a trade.
    if (excludedTags.indexOf(clickedElement.tagName) > -1 || excludedTags.indexOf(clickedElement.parentNode.tagName) > -1) {
        return;
    }

    // Stop the element's parent (item) from getting the click event. This stops the item from being selected.
    event.stopPropagation();

    // Make sure we select the item name element.
    var itemNameElement = clickedElement;
    while (!hasClass(itemNameElement, "name")) {
        itemNameElement = itemNameElement.parentNode;
    }

    // Get and display the item's name.
    var itemName = itemNameElement.querySelector("b").innerHTML.trim();
    window.prompt("Press CTRL+C to copy the item's name:", itemName);
};

// Tags that, if clicked on in an item name panel, should not execute the copyItemNameHandler.
var excludedTags = ["A", "IMG"];

// Helper method to check if an element has the specified class name.
var hasClass = function(element, cls) {
    return element && (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
};

// Style.
// The two websites currently have diferent styles, so we need to tweak a bit the price colors to make them properly readable.
var priceSafeColor;
var priceWarningColor;
if (appID == 570) {
    // D2L - lighter colors to go with the darker name panel background.
    priceSafeColor = "#8EC13E"; // same used on the "Market" link
    priceWarningColor = "orange";
} else {
    // CSGOLounge - darker colors to contrast with the lighter name panel background.
    priceSafeColor = "green";
    priceWarningColor = "#C74411";
}
GM_addStyle(".currency a { color: white; font-weight: bold; margin-top: 0.25em; }");
GM_addStyle(".priceSafe { color: " + priceSafeColor + " }");
GM_addStyle(".priceWarning { color : " + priceWarningColor + " }");
GM_addStyle(".priceUnsafe { color : red }");
GM_addStyle(".itemNotMarketable { color : red }");
GM_addStyle(".error { color : red }");
GM_addStyle(".extraButton { margin-left: 0.3em; vertical-align: top; margin-top: -0.1em; border: 0; padding: 0; width: 16px; height: 16px; }");
GM_addStyle(".refreshButton { background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABOUlEQVQ4jc2RsUoDQRCGv32CXECzdjaWRiOCVSA+RdqAL6BFesUXOPUFbCWKJ2thkcRgxCa3cJUEQuCwExRjCi1sxiKXsElO6wz81e58888/sPhlESwxlhNaeP/+zRnO/wCMNaBDIbVZG/ztppLcLYdpgK3uSFgGc05WAnbX7pTcD5FCQ8lyMDOlQ4mQaO8lcRI6Q7wATxsGR32k9YUc9RFtiL1gZsoTq1jk7D3JxLEeFNtKLj6ZqNhWkppHSOvxO3GRFlb3J3mc2VEb/I2mktM3Jtp5UKINgUuProYJoMO+C8jWyGhDXO0hl0Ok2hutma2RcR1UsMjx6ySoA9fJkqGUryu5+UDydSW5azbn1wiJyjFSjp3bO4lrg19opJzacZEhJMIi688juYBkFT+9eRpUGYOmbr6Q9QvwBrFqSdh8NgAAAABJRU5ErkJggg==) no-repeat left center; }");
GM_addStyle(".ddbtn a#donate { font-size: 0.7em; margin-top: 1.5em; color: orange; }");
GM_addStyle(".ddbtn a#donate:before { color: red; content: '\u2665'; display: block; font-size: 1.5em; margin-bottom: 0.2em; text-align: center; text-shadow: 0 1px 1px #000; }");
