// ==UserScript==
// @name         TrollBlock Plus
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      2.6
// @description  Blocks the comments of trolls
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8564/TrollBlock%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/8564/TrollBlock%20Plus.meta.js
// ==/UserScript==
 
//Add the exact username of someone below that you want to block, with quotes surrounding the name and a comma      
var trolls = ["Anna", "Josh", "Trololomakinmoney", "Joshuazilla", "Kartia", "Danish"];
 
console.log("TrollBlock Plus (by Croned) activated!");
 
setInterval(function() {scan();}, 10);
 
function scan() {
        for (var i = 0; i < trolls.length; i++) {
                $(".commentinfo a.tt").each(function() {
                        if ($(this).html().trim() == trolls[i]) {
                            $(this).parents(".comment").hide();
                        }
                });
               
                $(".postuser a.tt").each(function() {
                        if ($(this).html().trim() == trolls[i]) {
                            $(this).parents(".post").hide();
                        }
                });
               
                $("b.name").each(function() {
                        if ($(this).html().trim() == trolls[i]) {
                            $(this).parents(".talk").hide();
                        }
                });
        }
}