// ==UserScript==
// @name        KG - default sort by Added
// @description affects browse tab and search form
// @namespace   KG
// @grant	none
// @include     http*://*karagarga.in/*
// @exclude     http*://forum.karagarga.in/*
// @version     1.3
// @downloadURL https://update.greasyfork.org/scripts/802/KG%20-%20default%20sort%20by%20Added.user.js
// @updateURL https://update.greasyfork.org/scripts/802/KG%20-%20default%20sort%20by%20Added.meta.js
// ==/UserScript==

// don't run in iFrames
if (window.frameElement) return;

// change Browse tab link to sort by Added date
var links = document.getElementById("ddimagetabs").getElementsByTagName("a");

for (i=0; i < links.length; i++ ) {
        if (links[i].textContent.indexOf("Browse") != -1) {
                links[i].href = links[i].href + "?sort=added&d=DESC";
        }
}


// change search form back to default sort, to see most relevant hits first
var searchForm = document.forms.namedItem("searchform");
var sortField = searchForm.elements.namedItem("sort");
sortField.value = "";