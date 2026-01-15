// ==UserScript==
// @name         GC SDB Favorite Links Tool
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.1
// @description  Add links to favorite searches to your SDB on GC.
// @author       sanjix
// @match        https://www.grundos.cafe/safetydeposit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562574/GC%20SDB%20Favorite%20Links%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/562574/GC%20SDB%20Favorite%20Links%20Tool.meta.js
// ==/UserScript==

var sdbInfo = document.querySelector('.sdb-info');
var savedSearches = [{'url': 'https://www.grundos.cafe/safetydeposit/?query=&page=1&category=995&type=&min_rarity=0&max_rarity=999&sort=count&descending=0&descending=1','name':'Barrel Fodder'},{'url':'https://www.grundos.cafe/safetydeposit/?query=&page=1&category=999&type=&min_rarity=0&max_rarity=999&sort=rarity&descending=0','name':'Relics'}]
function addLink(item) {
    var newLink = document.createElement('a');
    newLink.href = item.url;
    newLink.textContent = item.name;
    return newLink;
}
var faveLinks = document.createElement('div');
faveLinks.className = 'faves center';
sdbInfo.appendChild(faveLinks);
savedSearches.forEach((search, i, arr) => {
    faveLinks.appendChild(addLink(search))
    if (i < arr.length - 1) {
        faveLinks.append(' | ');
    }
});

faveLinks.style.text