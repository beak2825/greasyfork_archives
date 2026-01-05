// ==UserScript==
// @name Flightradar24 show flights in title
// @description Adds a counter to the page title on Flightradar24 to show the number of matched flights
// @author Raphael Cockx
// @version 0.1.0
// @namespace http://www.flightradar24.com
// @match http://www.flightradar24.com/*
// @downloadURL https://update.greasyfork.org/scripts/8993/Flightradar24%20show%20flights%20in%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/8993/Flightradar24%20show%20flights%20in%20title.meta.js
// ==/UserScript==

setInterval(function(){
    var flights = document.getElementById('menuPlanesValue').innerHTML.split(' / ')[0];
    if (flights.substring(0, 1) == '0') flights = '0';
    document.title = '['+flights+'] Flightradar24.com - Live flight tracker!';
},5000);