// ==UserScript==
// @name        MAL Default List Order
// @namespace   MAL
// @description Orders anime and manga lists by a score given on default
// @include     http://myanimelist.net/*
// @include     https://myanimelist.net/*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/8434/MAL%20Default%20List%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/8434/MAL%20Default%20List%20Order.meta.js
// ==/UserScript==

var links = document.evaluate("//a[(contains(@href, '/animelist/') or contains(@href, '/mangalist/')) and not(contains(@href, '&order='))]", document, null, 
XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i=0; i < links.snapshotLength; i++)
{
  var thisLink = links.snapshotItem(i);
  thisLink.href += '&order=4';
}