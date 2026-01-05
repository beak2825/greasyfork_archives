// ==UserScript==
// @name         BITCOIN XBT USD price
// @version      0.2.1
// @description  Adds the according USD price per bitcoin to the BITCOIN TRACKER ONE XBT PROVIDER page
// @author       tralala33@reddit
// @match        http://www.nasdaqomxnordic.com/etp/etn/etninfo?Instrument=SSE109538
// @namespace https://greasyfork.org/users/11513
// @downloadURL https://update.greasyfork.org/scripts/9947/BITCOIN%20XBT%20USD%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/9947/BITCOIN%20XBT%20USD%20price.meta.js
// ==/UserScript==

function setPrice() {
    var SEK_TO_USD_RATE = 0.1218;

    var td = $($("td:contains('Bitcoin Tracker One XBT Provider')").siblings()[0]);
    var sek = parseFloat(td.html());
    
    if(isNaN(sek)) {
        setTimeout(setPrice, 500);
        return;
    }
    
    var usd = 200 * sek * SEK_TO_USD_RATE;
    var price = Math.round(100 * usd) / 100;

    td.html(sek + " <span style='font-size: 12px; font-weight: normal'>($" + price + "/BTC)</span>");
    setTimeout(setPrice, 5 * 1000);
}

$(function() {
    setPrice();
})