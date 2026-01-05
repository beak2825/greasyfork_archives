// ==UserScript==
// @name            Konwerter $ do PLN w AliExpress
// @description     Konwertuje wartosci
// @author          Barricade
// @namespace       https://greasyfork.org/pl/scripts/6940-konwerter-do-pln-w-aliexpress
// @grant           GM_xmlhttpRequest
// @include         http://www.aliexpress.com/*
// @version 0.0.1.20141211230146
// @downloadURL https://update.greasyfork.org/scripts/6940/Konwerter%20%24%20do%20PLN%20w%20AliExpress.user.js
// @updateURL https://update.greasyfork.org/scripts/6940/Konwerter%20%24%20do%20PLN%20w%20AliExpress.meta.js
// ==/UserScript==

GM_xmlhttpRequest ( {
    method:     "GET",
    url:        'http://rate-exchange.appspot.com/currency?from=USD&to=PLN',
    //Google sends malformed response, not JSON.
    //url:      'http://www.google.com/ig/calculator?hl=en&q=1usd=?inr',

    onload:     function (rsp){
        var rspJSON     = JSON.parse (rsp.responseText);
        var convRate    = rspJSON.rate;
        console.log (rspJSON, convRate);

        changeDollarsToPln (document.body, convRate);
    }
} );

function changeDollarsToPln (node, convRate) {
    if (node.nodeType === Node.TEXT_NODE) {
        if (/\$/.test (node.nodeValue) ) {
            processTextNode (node, convRate);
        }
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
        for (var K = 0, numNodes = node.childNodes.length;  K < numNodes;  ++K) {
            changeDollarsToPln (node.childNodes[K], convRate);
        }
    }
}

function processTextNode (node, convRate) {
    /*-- Results like:
        ["Three values: ", "$1.10", " ", "$2.20", " ", "$3.00.", ""]
    */
    var moneySplit  = node.nodeValue.split (/US ((?:\+|\-)?\$[0-9.,]+)/);
    if (moneySplit  &&  moneySplit.length > 2) {
        /*-- Money values will be odd array index, loop through
            and convert all.
        */
        for (var J = 1, L = moneySplit.length;  J < L;  J += 2) {
            var dolVal = parseFloat (moneySplit[J].replace (/\$|,|([.,]$)/g, "") );

            if (typeof dolVal === "number") {
                //var plnVal = Math.round (dolVal * convRate) + "zł";
                var plnVal = (dolVal * convRate).toFixed (2) + "zł";
            }
            else {
                var plnVal = moneySplit[J] + " *Err*";
            }
            moneySplit[J] = plnVal;
        }
        //-- Rebuild and replace the text node with the changed value (s).
        var newTxt      = moneySplit.join ("");
        node.nodeValue  = newTxt;
    }
}