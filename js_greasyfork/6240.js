// ==UserScript==
// @name         Open All Timesheets
// @namespace    http://canto.com
// @version      0.2
// @description  Opens all Timesheets currently in the list on click of the Kimble Logo
// @author       Carsten Hoffmann
// @include      https://*.salesforce.com/a5H?*
// @downloadURL https://update.greasyfork.org/scripts/6240/Open%20All%20Timesheets.user.js
// @updateURL https://update.greasyfork.org/scripts/6240/Open%20All%20Timesheets.meta.js
// ==/UserScript==


document.querySelector("img.pageTitleIcon").onclick = function () {
    var linksToOpen = document.querySelectorAll ("div.x-grid3-col-Name a");
    for (var J = 0, numLinks = linksToOpen.length;  J < numLinks;  ++J) {
        window.open (linksToOpen[J].href, '_blank');
    }
}