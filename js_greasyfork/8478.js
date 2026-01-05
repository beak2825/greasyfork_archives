// ==UserScript==
// @name         Dotabuff hero damage percentage
// @namespace    #pop
// @version      1.1
// @description  Shows hero damage percent in match overview
// @author       prna
// @match        http://www.dotabuff.com/matches/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8478/Dotabuff%20hero%20damage%20percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/8478/Dotabuff%20hero%20damage%20percentage.meta.js
// ==/UserScript==
var foots = document.getElementsByTagName('tfoot');
var totals =  [];
for (var i = 0; i < 2; ++i) {
    var k = 1;
    var tot = foots[i].rows[0].cells[10].innerHTML;
    if(tot.substr(tot.length - 1) == "k") {k = 1000;}
    totals.push(k*Number(tot.slice(0,-1)));
    
}

var tr1 = document.getElementsByClassName(' faction-radiant');
var tr2 = document.getElementsByClassName(' faction-dire');
var tr = [tr1,tr2];

for (var j = 0; j < 2; ++j) {
    for (var i = 0; i < tr[j].length; ++i) {
        var k = 1;
        var hd = tr[j][i].cells[12].innerHTML;
        if(hd.substr(hd.length - 1) == "k") {k = 1000;}
        var per = Math.round(Number(k*100*hd.slice(0,-1))/totals[j]);
        tr[j][i].cells[12].innerHTML += " ("+per.toString()+"%)";
    }
}