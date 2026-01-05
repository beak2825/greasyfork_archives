// ==UserScript==
// @name         scrypt.cc BTC to USD
// @namespace    http://your.homepage/
// @version      0.1
// @description  Convert btc to usd on scrypt.cc
// @author       You
// @match        https://scrypt.cc/users/index.php
// @match        http://scrypt.cc/users/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9577/scryptcc%20BTC%20to%20USD.user.js
// @updateURL https://update.greasyfork.org/scripts/9577/scryptcc%20BTC%20to%20USD.meta.js
// ==/UserScript==

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function $x() {
    var x='';
    var node=document;
    var type=0;
    var fix=true;
    var i=0;
    var cur;

    function toArray(xp) {
        var final=[], next;
        while (next=xp.iterateNext()) {
            final.push(next);
        }
        return final;
    }

    while (cur=arguments[i++]) {
        switch (typeof cur) {
            case "string": x+=(x=='') ? cur : " | " + cur; continue;
            case "number": type=cur; continue;
            case "object": node=cur; continue;
            case "boolean": fix=cur; continue;
        }
    }

    if (fix) {
        if (type==6) type=4;
        if (type==7) type=5;
    }

    // selection mistake helper
    if (!/^\//.test(x)) x="//"+x;

    // context mistake helper
    if (node!=document && !/^\./.test(x)) x="."+x;

    var result=document.evaluate(x, node, null, type, null);
    if (fix) {
        // automatically return special type
        switch (type) {
            case 1: return result.numberValue;
            case 2: return result.stringValue;
            case 3: return result.booleanValue;
            case 8:
            case 9: return result.singleNodeValue;
        }
    }

    return fix ? toArray(result) : result;
}

var btc_elems = [
    $x('//*[@id="idblc_4"]')[0],
    $x('//*[@id="idblc_6"]')[2], 
    $x('//*[@id="idblc_12"]')[0]
];

var btc_avg = httpGet("https://api.bitcoinaverage.com/ticker/global/USD/24h_avg");

for (var i = 0; i < btc_elems.length; i++) {
    var thisElem = btc_elems[i];
    if (thisElem.textContent.search("BTC:") != -1) {
        var btc = thisElem.textContent.split(" ")[1];
    }
    else {
        var btc = thisElem.textContent;
    }
    thisElem.textContent += ", $";
    thisElem.textContent += (btc_avg * btc).toFixed(4).toString();
    thisElem.style.width = "auto";
}