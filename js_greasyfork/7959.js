// ==UserScript==
// @name          IsoHunt - Remove Sponsored Torrents
// @namespace     https://greasyfork.org/en/users/321-joesimmons
// @description   Removes Sponsored Torrents from the search page
// @include       https://isohunt.to/torrents/?ihq=*
// @copyright     JoeSimmons
// @version       1.0.0
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7959/IsoHunt%20-%20Remove%20Sponsored%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/7959/IsoHunt%20-%20Remove%20Sponsored%20Torrents.meta.js
// ==/UserScript==

/* CHANGELOG

    1.0.0 (2/8/2015)
        - created

*/

+function () {
    'use strict';

    var tr = document.evaluate('//div[@id="serps"]/table/tbody/tr/td[ contains(., "Sponsored") ]/ancestor::tr', document, null, 6, null),
        i;

    // make sure the page is not in a frame
    if (window.frameElement || window !== window.top) { return; }

    for (i = 0; i < tr.snapshotLength; i += 1) {
        tr.snapshotItem(i).style.display = 'none';
    }
}();