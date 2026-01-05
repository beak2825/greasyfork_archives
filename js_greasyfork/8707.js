// ==UserScript==
// @name         Error Joiner
// @namespace    http://your.homepage/
// @version      1.3
// @description  Automatically joins Error's games
// @author       Croned
// @match        https://epicmafia.com/lobby
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8707/Error%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/8707/Error%20Joiner.meta.js
// ==/UserScript==
console.log("Error Joiner activated!");
 
var userid = 379153;
var scope = $("#lobby_container").scope();
 
setInterval(function() {scan();}, 500);
 
function scan() {
    $(".gamerow").each(function() {
		var gamerow = $(this);
		if (gamerow.find(".userinfo").attr('data-uid') == userid && !scope.in_game) {
			gamerow.find(".redbutton").each(function() {
				if ($(this).html().trim() == "Join game") {
					$(this).click();
				}
			});
		}
	});
}