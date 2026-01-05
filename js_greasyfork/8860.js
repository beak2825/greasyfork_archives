// ==UserScript==
// @name         Neopets - Neoboard Enhancements
// @author       Jawsch
// @match        http://www.neopets.com/island/tradingpost.phtml*
// @include      http://www.neopets.com/neoboards/topic.phtml?topic=*
// @version 0.0.1.20180611113234
// @namespace Diceroll / Jawsch ;D
// @description Adds some useful icons to the neoboards
// @downloadURL https://update.greasyfork.org/scripts/8860/Neopets%20-%20Neoboard%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/8860/Neopets%20-%20Neoboard%20Enhancements.meta.js
// ==/UserScript==
 
var do_tradingpost_also = true; // enable it if you'd like. :P (set to true)
 
///////////
 
$.urlParam = function(url, name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
    if (results===null) {
       return null;
    } else {
       return results[1] || 0;
    }
};
 
var linkmap = { // for urls and images
    trade: {
        "url": "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=owner&search_string=%s",
        "img": "http://images.neopets.com/icons/trades.gif",
        "hint": "View this user's other trades!"
    },
    auction: {
        "url": "http://www.neopets.com/genie.phtml?type=find_user&auction_username=%s",
        "img": "http://images.neopets.com/icons/ul/auctions.gif",
        "hint": "View this user's auctions!"
    },
    shop: {
        "url": "http://www.neopets.com/browseshop.phtml?owner=%s",
        "img": "http://i.imgur.com/zTqY0jn.png",
        "hint": "View this user's shop!"
    },
    gallery: {
        "url": "http://www.neopets.com/gallery/index.phtml?gu=%s",
        "img": "http://images.neopets.com/trophies/222_1.gif",
        "hint": "View this user's gallery!"
    },
    stamp: {
        "url": "http://www.neopets.com/stamps.phtml?owner=%s",
        "img": "http://i.imgur.com/lb3Ms90.png",
        "hint": "View this user's stamp album!"
    },
    neomail: {
        "url": "http://www.neopets.com/neomessages.phtml?type=send&recipient=%s",
        "img": "http://images.neopets.com/icons/ul/neomail.gif",
        "hint": "Neomail this user!"
    },
};
 
function buildAccountLinks(obj, string) {
    var result = "";
    function sprintf(str, repl) {
        return str.replace("%s", repl);
    }
 
    $.each(obj, function(k, v) {
        result += '<a title="' + v['hint'] + '" href="' + sprintf(v['url'], string) + '" target="_blank"><img src="' + sprintf(v['img'], string) + '" width="20px" height="20px"></a> ';
    });
    return result;
}
 
// Trading Post
if(document.URL.indexOf("/island/tradingpost") != -1 && do_tradingpost_also === true) {
    reports = $("a[href*='autoform_abuse']"); // we'll put the links before this.
 
    $.each(reports, function(index, value) {
        user = $.urlParam($(this).attr("href"), "offender");
        $(this).before(buildAccountLinks(linkmap, user) + " | ");
    });
}
 
// NeoBoards
if(document.URL.indexOf("neoboards/topic.phtml") != -1) {
    $(".topicAuthor.sf").each(function(index, value) {
        user = $.urlParam($(this).find("a[href*='userlookup']").eq(0).attr("href"), "user");
        $(this).find("a[href*='userlookup']").eq(0).after("<hr noshade size='1' color='#D1D1D1'>" + buildAccountLinks(linkmap, user));
        
        // aaaand the pet page
        pet = $.urlParam($(this).find("a[href*='petlookup']").eq(1).attr("href"), "pet");
        if (pet) { // I mean...can people post if they have no pet? Eh, this will make sure it doesn't break if they can.
            $(this).find("a[href*='petlookup']").eq(1).after("<br><a href='http://www.neopets.com/~" + pet + "' target='_blank'><img src='http://images.neopets.com/games/arcade/cat/word_games_30x30.png' height='20px' width='20px'></a>");
 
            // removes "Active Neopet" text
            html = $(this).find("a[href*='petlookup']").parent().parent().html();
            $(this).find("a[href*='petlookup']").parent().parent().html(html.replace("Active Neopet", "")); 
        }
    });
}