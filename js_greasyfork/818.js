// ==UserScript==
// @name        overdrive library - btik links
// @namespace   diff
// @include     http*://*.lib.overdrive.com/*/SearchResultsList.htm*
// @include     http*://*.lib.overdrive.com/*/SearchResults.htm*
// @include     http*://*.lib.overdrive.com/*/SearchResultsGrid.htm*
// @include     http*://*.lib.overdrive.com/*/Default.htm*
// @include     http*://*.libraryreserve.com/*/SearchResultsList.htm*
// @include     http*://*.libraryreserve.com/*/SearchResults.htm*
// @include     http*://*.libraryreserve.com/*/SearchResultsGrid.htm*
// @include     http*://*.libraryreserve.com/*/Default.htm*
// @version     0.4
// @grant       none
// @description link from overdrive to btik
// @downloadURL https://update.greasyfork.org/scripts/818/overdrive%20library%20-%20btik%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/818/overdrive%20library%20-%20btik%20links.meta.js
// ==/UserScript==

var title = document.querySelectorAll('div[class*="trunc-title-line"]');
for (i=0; elm=title[i]; i++) {
	var str = elm.textContent.trim();
	str = str.replace(/\s+/gi,"+");
	str = escape(str);
	var link = "https://bibliotik.me/torrents/?search=%40title+%22"
		+ str + "%22";
 	elm.innerHTML += " <a href='" + link + "' style='font-size:90%'>[btik]</a>";
}