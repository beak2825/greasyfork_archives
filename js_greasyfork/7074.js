// ==UserScript==
// @name         Kreisel Addr
// @namespace    http://www.kreiselficker.us
// @version      0.1
// @description  Add a Kreisel to what you have already seen and after fuckin it - become the best Kreiselficker on earth
// @author       qrdesign
// @match        http://pr0gramm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7074/Kreisel%20Addr.user.js
// @updateURL https://update.greasyfork.org/scripts/7074/Kreisel%20Addr.meta.js
// ==/UserScript==

window.addEventListener ("load", Greasemonkey_main, false);

function Greasemonkey_main () {    
    var beforeUri = '';
    var htmlToAppend = '<div style="" class="qr">卐</div>';
    
    $('head').append('<style>.qr{position:absolute;border:1px solid #ccc;background:#fff;margin-top: -25px;margin-left:5px;padding:3px;border-radius:100%;text-align:center;width:25px;height:25px;}</style>');
    
    var lclRead = [];
    if(localStorage.getItem('watchedHistory') == null || localStorage.getItem('watchedHistory') == "")
        localStorage.setItem('watchedHistory', JSON.stringify(lclRead));
    else
        lclRead = JSON.parse(localStorage.getItem('watchedHistory'));
    
    // Initially set from LcLStorage as Read
    lclRead.forEach(function(element, index, array) {
        $('#item-' + element).append(htmlToAppend);
    });
    
    // Check URL change constantly
    setInterval(function() {
        pathx = window.location.pathname;
        if(beforeUri != pathx) {
            var thisIdArray = pathx.split('/');
            var thisId = thisIdArray[2];
            if(lclRead.indexOf(thisId) == -1) {
                console.log(lclRead.length);
                if(lclRead.length >= 500) {
                    lclRead.shift();
                }
                lclRead.push(thisId);
                $('#item-'+thisId).append(htmlToAppend);
            }
        	beforeUri = pathx;
        }
    }, 100);
    // Save to LocalStorage
    window.onbeforeunload = function() {
        localStorage.setItem('watchedHistory', JSON.stringify(lclRead));
    }
}