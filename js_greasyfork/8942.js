// ==UserScript==
// @name         Advanced button stats
// @namespace    http://bwochinski.com/
// @version      0.5
// @description  Show Advanced button stats
// @author       bwochinski
// @match        *://www.reddit.com/r/thebutton/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8942/Advanced%20button%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/8942/Advanced%20button%20stats.meta.js
// ==/UserScript==

//CONFIG
var advInterval = 500; //update interval
var advKeepAmt = 60; //history to keep (in seconds)

//Imoprtant variables
var parHist = [];
var histLen = (1000 / advInterval) * advKeepAmt;
var lowestTime = 60.00;

$(".thebutton-form").append("<div id='advButtonStats' style='position: relative; float: clear; margin-top: 100px; width: 500px;'></div>");
$("#advButtonStats").append("<div id='advBOPS' style='Font: 18px Verdana normal black; width: 50%; float: left;''>BOPS:</div>");
$("#advButtonStats").append("<div id='advLowest' style='Font: 18px Verdana normal;  width: 50%; float: left;'>Lowest Seen:</div>");
$("#advButtonStats").append("<div id='advPPM' style='Font: 18px Verdana normal black; width: 50%; float: left;''>Clicks/min:</div>");
$("#advButtonStats").append("<div id='advFlair' style='Font: 18px Verdana normal; width: 50%; float: left;'>Current Flair:</div>");
$("#advButtonStats").append("<div id='advSPC' style='Font: 18px Verdana normal; width: 50%; float: left;'>Avg Secs/Click:</div>");

function advStatUpdate() {
    if (parHist.length > histLen) {
        parHist.pop();
    }
    var advText = $("span.thebutton-participants").text().replace(",","");
    parHist.unshift(parseInt(advText));

    //console.log(parHist);
    var curBOPS = (parHist[0] - parHist[parHist.length - 1]) / (parHist.length / (1000 / advInterval));
    var curPPM = (parHist[0] - parHist[parHist.length - 1]) * (60 / advKeepAmt) * (advKeepAmt / (parHist.length / (1000 / advInterval)));
    var curTime = parseFloat($("#thebutton-s-10s").text() + $("#thebutton-s-1s").text() + "." + $("#thebutton-s-100ms").text() + $("#thebutton-s-10ms").text());
    if (curTime < lowestTime) {
        lowestTime = curTime;
    }
    $("#advBOPS").html("<b>BOPS:</b> " + curBOPS.toFixed(5));
    $("#advPPM").html("<b>Clicks/min:</b> " + Math.round(curPPM));
    $("#advFlair").html("<b>Current Flair:</b> <span class='flair flair-press-" + String(curTime + 9).substring(0,1) + "'>" + String(curTime).substring(0,2) + "s</span>");
    $("#advLowest").html("<b>Lowest Seen:</b> " + lowestTime + "s</span>");
    $("#advSPC").html("<b>Avg Secs/Click:</b> " + (1 / curBOPS.toFixed(5)).toFixed(2));
}

advStatUpdate();
setInterval(advStatUpdate, advInterval);
