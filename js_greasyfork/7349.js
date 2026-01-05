// ==UserScript==
// @run-at document-start
// @name        Ebay Buy It Now by Price
// @namespace   EBINbP
// @description Auto set Buy It Now, sort by price and Gallery view parameters on Ebay search
// @version     1.1
// @copyright   2015 steve
// @include     http://www.ebay.tld/sch/*
// @include     https://www.ebay.tld/sch/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7349/Ebay%20Buy%20It%20Now%20by%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/7349/Ebay%20Buy%20It%20Now%20by%20Price.meta.js
// ==/UserScript==

try {
    var url = document.location.toString();
    var updateUrl = url

//    console.log(url);   // original URI
    updateUrl = updateQueryStringParameter(updateUrl, 'LH_Auction', ''); // remove Auction
    updateUrl = updateQueryStringParameter(updateUrl, 'LH_BIN', '1');   // Buy it NOW parameter
    updateUrl = updateQueryStringParameter(updateUrl, '_sop', '15');   // Sort by price parameter
    updateUrl = updateQueryStringParameter(updateUrl, '_dmd', '2');   // Gallery view parameter
//    console.log(updateUrl);   // changed URI
//    console.log(url != updateUrl);   // true = URI has changed

    if (url != updateUrl) {
        document.location = updateUrl;
    }
} catch (e) {}

// set, change or remove parameter
function updateQueryStringParameter(uri, key, value) {
    // remove parameter if empty value
    var parameterSet = (key.length && value.length > 0 ? key + "=" + value : "");
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        parameterSet = (parameterSet.length > 0 ? parameterSet +'$2' : "");
        return uri.replace(re, '$1' + parameterSet);
    } else {
        parameterSet = (parameterSet.length > 0 ? separator + parameterSet : "");
        return uri + parameterSet;
    }
}
