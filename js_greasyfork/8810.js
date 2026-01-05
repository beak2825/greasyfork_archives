// ==UserScript==
// @name        MAL Unhide Time
// @namespace   MAL
// @include     http://myanimelist.net/profile/*/*
// @description Unhides time in some specific pages
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/8810/MAL%20Unhide%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/8810/MAL%20Unhide%20Time.meta.js
// ==/UserScript==

allElements = document.evaluate("//td[@class='borderClass']/span", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < allElements.snapshotLength; i++) {
    var time = allElements.snapshotItem(i).title;
    if (time) {
        allElements.snapshotItem(i).innerHTML += ', ' + time;
    }
}