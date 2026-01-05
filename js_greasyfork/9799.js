// ==UserScript==
// @name       jawz Eric Chan(Check business categories)
// @version    1.1
// @author	   jawz
// @description  Eric Chan
// @match      https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/9799/jawz%20Eric%20Chan%28Check%20business%20categories%29.user.js
// @updateURL https://update.greasyfork.org/scripts/9799/jawz%20Eric%20Chan%28Check%20business%20categories%29.meta.js
// ==/UserScript==

var businessName = $("p:contains('Business name:')");
var businessText = businessName.text().trim().replace("Business name: ", "");
var URL = "http://www.google.com/search?q=" + businessText;
URL = URL.replace(/&/g, "%26");
businessName.html("<b>Business name: </b>" + '<a href="' + URL + '" target="_blank">' + businessText + '</a>');
var locations = '<a href="' + URL + " locations" + '" target="_blank">' + "Locations" + '</a>'
var stores = '<a href="' + URL + " stores" + '" target="_blank">' + "Stores" + '</a>'
var franchise = '<a href="' + URL + " franchise" + '" target="_blank">' + "Franchise" + '</a>'
$("li").has("a")[0].innerHTML = locations;
$("li").has("a")[1].innerHTML = stores;
$("li").has("a")[2].innerHTML = franchise;

var businessAddress = $("p:contains('Business address:')");
var businessAText = businessAddress.text().trim().replace("Business address: ", "");
var URL = "http://www.google.com/search?q=" + businessAText;
URL = URL.replace(/&/g, "%26");
businessAddress.html("<b>Business address: </b>" + '<a href="' + URL + '" target="_blank">' + businessAText + '</a>');
var both = '<a href="' + URL + " " + businessText + '" target="_blank">' + "Name and Address" + '</a>';
both = both.replace(/&/g, "%26");
var ul = $("ul").has("li");
var li = document.createElement("li");
li.innerHTML = both
li.setAttribute("id","element4");
ul.append(li);

var businessPhone = $("p:contains('Phone Number to call:')");
var businessPText = businessPhone.text().trim().replace("Phone Number to call: ", "");
businessPText = businessPText.substring(0, 3) + "-" + businessPText.substring(3, businessPText.length);
businessPText = businessPText.substring(0, 7) + "-" + businessPText.substring(7, businessPText.length);
businessPhone.html("<b>Phone Number to call: </b>*67 " + businessPText);
GM_setClipboard("*67 " + businessPText);
