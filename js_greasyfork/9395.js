// ==UserScript==
// @name         My Fancy New Userscript
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.ticketswap.nl/
// @grant        none
// @include http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9395/My%20Fancy%20New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/9395/My%20Fancy%20New%20Userscript.meta.js
// ==/UserScript==

var reloadtime = Math.floor(Math.random() * 12000) + 11000;

setTimeout(function () { location.reload(1); }, reloadtime);
addCard();

function addCard() {
    var cardOrder = $(".event_list").find(".type");
    if($(".event_list")[0]){
        $(".event_list").not(":has('.sold')").click();   
    }
}

