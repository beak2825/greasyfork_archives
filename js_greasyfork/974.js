// ==UserScript==
// @name        GameFAQs post numberer
// @version     1
// @author      King of Cats
// @namespace   Cats
// @description Numbers posts on gameFAQs.
// @include     http://www.gamefaqs.com/boards/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/974/GameFAQs%20post%20numberer.user.js
// @updateURL https://update.greasyfork.org/scripts/974/GameFAQs%20post%20numberer.meta.js
// ==/UserScript==

// The script assumes you have GameFAQs' numbering disabled; probably doubles up on post numbers or breaks otherwise.

var postNumbers = document.evaluate('//td[contains(@class,"author")]//a[@name]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

if (postNumbers.snapshotItem(0) != null) {
	
	function padMe(num) {
		var pad = num + '';
		while(pad.length < 3) {
				pad = "0" + pad;
			}
		return pad;
	}
	
	for (var i = 0; i < postNumbers.snapshotLength; i++) {
		var number = postNumbers.snapshotItem(i).getAttribute("name");
		
		var leftOfMessage = (document.getElementsByClassName("msg_stats_left")[0] != null);
		if (!leftOfMessage) {
			var appendedDivider = document.createTextNode(" | ");
			postNumbers.snapshotItem(i).parentNode.appendChild(appendedDivider);
			
			var appendedNumber = document.createTextNode("#"+padMe(number));
			postNumbers.snapshotItem(i).parentNode.appendChild(appendedNumber);
		} else {
			var appendedNumber = document.createTextNode("#"+padMe(number));
			var lineBreak = document.createElement("br");
			postNumbers.snapshotItem(i).parentNode.insertBefore(lineBreak,postNumbers.snapshotItem(i).parentNode.childNodes[0]);
			postNumbers.snapshotItem(i).parentNode.insertBefore(appendedNumber,postNumbers.snapshotItem(i).parentNode.childNodes[0]);
		}
	}
}