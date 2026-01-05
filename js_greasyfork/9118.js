// ==UserScript==
// @name         Show Flairless Count
// @namespace    http://your.homepage/
// @version      0.2
// @description  Estimate flairless users on /r/thebutton/
// @author       /u/bwochinski
// @match        *://www.reddit.com/r/thebutton/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/9118/Show%20Flairless%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/9118/Show%20Flairless%20Count.meta.js
// ==/UserScript==

function parseFlairNum(flairLine) {
    flairLine = flairLine.split("~");
    var total = parseInt(flairLine.shift().split(" ")[0].replace(",",""));
    var estFlair = 0;
    for (var est in flairLine) {
        var curEst = parseInt(flairLine[est].split(" ")[0]);
        estFlair += curEst;
    }
    return total - estFlair;
}

var estFlairless = parseFlairNum($('div.titlebox p').text());
$('div.titlebox p:last').after("<p> &nbsp; &nbsp; ~" + estFlairless + " flairless users</p>");

//add flair text
$('div.titlebox p span.flair-no-press').text("non presser");
$('div.titlebox p span.flair-press-6').text("60-52s");
$('div.titlebox p span.flair-press-5').text("51-42s");
$('div.titlebox p span.flair-press-4').text("41-32s");
$('div.titlebox p span.flair-press-3').text("31-22s");
$('div.titlebox p span.flair-press-2').text("21-12s");
$('div.titlebox p span.flair-press-1').text("11-1s");
$('div.titlebox p span.flair-cant-press').text("can't press");