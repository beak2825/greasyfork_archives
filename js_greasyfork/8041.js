// ==UserScript==
// @name         Automat plusujący
// @namespace    http://www.wykop.pl/
// @version      1.2.2
// @description  automatycznie plusuje wpisy co interwał czasu
// @author       modyfikacja kodu @Grizwold'a by @MirkoStats 
// @match        http://www.wykop.pl/mikroblog/plusuj/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8041/Automat%20plusuj%C4%85cy.user.js
// @updateURL https://update.greasyfork.org/scripts/8041/Automat%20plusuj%C4%85cy.meta.js
// ==/UserScript==

// co ile odświeżać (sekund)

var refreshTime = 10;

///////////////////////////

$(document).ready(function(){

    alert = function() {
        console.log('przekroczony limit plusów');
    };

    window.alert = function() {
        console.log('przekroczony limit plusów');
    };

    function plusuj(selector) {
        var $plusArea = $(selector);
        $.each($plusArea, function(i, $val) {
            if (!$($val).find("b").hasClass("voted")) {
                $($val).find("a").click();
            }
        });
    };
    plusuj("#itemsStream > li > ul > li > div > div > div.author.ellipsis > p");
    plusuj("#itemsStream > li > div > div > div.author.ellipsis > p");

    setTimeout(function() {
        location.reload();
    }, refreshTime * 1000);
})