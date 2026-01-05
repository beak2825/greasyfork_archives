// ==UserScript==
// @name         Aliexpress.com - USD to SEK conversion
// @namespace    http://modulecode.com/
// @version      1.1
// @description  Attempts to convert USD to Swedish Krona on aliexpress.se.
// @author       aaslun
// @match        http://www.aliexpress.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9522/Aliexpresscom%20-%20USD%20to%20SEK%20conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/9522/Aliexpresscom%20-%20USD%20to%20SEK%20conversion.meta.js
// ==/UserScript==

// IMPORTANT: Remember to update SEK-variable below according to the USD
// Check Google to see how much 1 USD is worth in SEK and update variable accordingly!! See link below:
// https://www.google.se/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=convert+usd+to+sek

/*******************/

// Update SEK before running the script!
var SEK = 8.62887221;

/*******************/

function usdToSEK(usd) {
    var sekStr = '';
        
    // Check if string is not a single usd, i.e: US $0.67 - 10.56
    if( ! $.isNumeric(usd)) {
        var val1 = parseFloat(usd.substring(4,usd.indexOf('-')-1));
        var val2 = parseFloat(usd.substring(usd.indexOf('-')+1, usd.length));
        val1 = (val1 * SEK).toFixed(2) + ' kr'
        val2 = (val2 * SEK).toFixed(2) + ' kr'
        sekStr = val1 + ' - ' + val2;
    }
    else {
        sekStr = parseFloat(usd * SEK).toFixed(2) + ' kr';
    }

    return sekStr; 
};

$(function(){
    $('span[itemprop="priceCurrency"]').hide();
    
    $('span[itemprop="lowPrice"]').text(usdToSEK($('span[itemprop="lowPrice"]').text()));
    $('span[itemprop="highPrice"]').text(usdToSEK($('span[itemprop="highPrice"]').text()));
    
    $('span[itemprop="price"]').each(function(index, val) {
        $(this).text(usdToSEK($(this).text()));
    });
    
});