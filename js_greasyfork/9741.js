// ==UserScript==
// @name        Neopets - Go Go Go - Auto Continue
// @namespace   Jarofgrease.captainmaxthecat.com
// @description Auto clicks continue while playing Go Go Go
// @author 		Demeiz
// @email 		admin@captainmaxthecat.com
// @homepage	http://www.captainmaxthecat.com
// @version		1.0
// @language	en
// @include		http://www.neopets.com/prehistoric/gogogo/gogogo.phtml
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/9741/Neopets%20-%20Go%20Go%20Go%20-%20Auto%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/9741/Neopets%20-%20Go%20Go%20Go%20-%20Auto%20Continue.meta.js
// ==/UserScript==

(function() {
	continue_find = document.evaluate("//input[@value='Continue...']", document, null,7, null); 
	continue_button = continue_find.snapshotItem(0);
	continue_button.click();

})();