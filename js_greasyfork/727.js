// ==UserScript==
// @name        BTN - collapse tech specs
// @description hide+click to expand
// @namespace   diff
// @include     http*://broadcasthe.net/torrents.php?*id=*
// @grant	none
// @version     0.1.2
// @downloadURL https://update.greasyfork.org/scripts/727/BTN%20-%20collapse%20tech%20specs.user.js
// @updateURL https://update.greasyfork.org/scripts/727/BTN%20-%20collapse%20tech%20specs.meta.js
// ==/UserScript==

var torrents = document.querySelectorAll("[id^='torrent_']");
for (i=0; detail=torrents[i]; i++) {
	blocks = detail.getElementsByTagName("blockquote");
	specs = blocks[1];
	specs.style.display="none";

	var showhide = document.createElement('blockquote');
	showhide.innerHTML = "click to show specs";
	showhide.style.cursor = 'pointer';
	showhide.setAttribute("onClick", "javascript: this.nextSibling.style.display=''; this.style.display='none';");
	specs.parentNode.insertBefore(showhide, specs);
}