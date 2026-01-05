// ==UserScript==
// @name          Empornium Show All Spoilers
// @description   Show all spoilers on the page all the time
// @version       1.2
// @author        Monkeys
// @namespace     empornium.me
// @include       *.empornium.me/torrents.php?id=*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/7606/Empornium%20Show%20All%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/7606/Empornium%20Show%20All%20Spoilers.meta.js
// ==/UserScript==


(function(){

var spoilers = document.getElementsByClassName('spoiler');
while (spoilers.length > 0)
{
	spoilers[0].className = ''; //spoilers updates every time, so [0] is always the next class
}
})();
