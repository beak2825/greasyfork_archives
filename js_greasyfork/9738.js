// ==UserScript==
// @name        Neopets PetpetBattle Shield
// @namespace   Jarofgrease.captainmaxthecat.com
// @description Selects shield
// @author 		Demeiz
// @email 		admin@captainmaxthecat.com
// @homepage	http://www.captainmaxthecat.com
// @version		1
// @language	en
// @include     http://www.neopets.com/games/petpet_battle/*// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/9738/Neopets%20PetpetBattle%20Shield.user.js
// @updateURL https://update.greasyfork.org/scripts/9738/Neopets%20PetpetBattle%20Shield.meta.js
// ==/UserScript==

(function() {

	buttons = document.evaluate("//input[@value='Shield']", document, null,7, null); 
	buttonclick = buttons.snapshotItem(0);
	buttonclick.click();

})();