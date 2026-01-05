// ==UserScript==
// @name        btn torrent background colour alternator
// @namespace   enforcer
// @include     http*://broadcasthe.net/torrents.php?*id=*
// @version     1
// @grant       none
// @description makes btn easier to see
// @downloadURL https://update.greasyfork.org/scripts/6286/btn%20torrent%20background%20colour%20alternator.user.js
// @updateURL https://update.greasyfork.org/scripts/6286/btn%20torrent%20background%20colour%20alternator.meta.js
// ==/UserScript==

//change your colour here, get hex codes from http://www.colorpicker.com/
var bgcol = "#272A2E" 

var gt = document.querySelectorAll(".group_torrent")

for(i = 0; i < gt.length; i += 2) {
	gt[i].className += " mod2";
	gt[i].parentNode.rows[ gt[i].rowIndex + 1 ].className += " mod2";
	}
		
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".mod2 { background-color: "+ bgcol + " !important }";
document.head.appendChild(css);
