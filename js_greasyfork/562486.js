// ==UserScript==
// @name        AliExpress Search Fix
// @namespace   Askhento
// @description Sort Price from Low to High, Put Items in View list All  Automatically
// @include     http*://*aliexpress.tld/af/*
// @include     http*://*aliexpress.tld/w/*
// @include     http*://*aliexpress.tld/wholesale*
// @version     1.03
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/562486/AliExpress%20Search%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562486/AliExpress%20Search%20Fix.meta.js
// ==/UserScript==



(function() {
    'use strict';

    //  Prices Low to High
    let url = window.location.href;

    if (url.indexOf("&SortType=price_asc") == -1)
    {
        let priceAsc = "&SortType=price_asc";
        url += priceAsc;
    }

    if (url.indexOf("&SortType=default") > -1)
    {
        url = url.replace(/(\&S(\w+)=(\w+)ault)/, "");
    }

    // Free Shipping

    if (url.indexOf("&isFreeShip=y") == -1)
    {
        let freeShip = "&isFreeShip=y";
        url += freeShip;
    }

    if (url.indexOf("&isFreeShip=n") > -1)
    {
        url = url.replace(/(\&isF(\w+)=(n))/, "");
    }

    // Seller sell in Quantity 1

    if (url.indexOf("&isRtl=yes") == -1)
    {
        let priceRtlUnit = "&isRtl=yes";
        url += priceRtlUnit;
    }

    // View LIST instead of Gallery

    if (url.indexOf("&g=n") == -1)
    {
        let modeList = "&g=n";
        url += modeList;
    }

    if (url.indexOf("&g=y") > -1)
    {
        url = url.replace(/(\&g)=(\y)/, "");
    }

    if (url !== window.location.href)
    {
        window.location.href = url;
    }

})();




