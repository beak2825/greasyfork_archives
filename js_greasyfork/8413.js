// black forest reminder
//
// ==UserScript==
// @name          black forest reminder
// @description   don't do the ballroom before the black forest
// @include       *127.0.0.1:*/place.php?whichplace=manor2
// @include       *kingdomofloathing.com*/place.php?whichplace=manor2
// @version 	  1.1
// @grant		  GM_setValue
// @grant		  GM_getValue
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/8413/black%20forest%20reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/8413/black%20forest%20reminder.meta.js
// ==/UserScript==

$(document).ready(function() {
	if($('a[href*="adventure.php?snarfblat=395"]')){
		$.getJSON("api.php?what=status&for=BlackForestReminderScript", function(json) {
			setValue('myCurrentAscension', json.ascensions);
			setValue('myCurrentLevel', json.level);
		});
	}
	$('a[href*="adventure.php?snarfblat=395"]').click(function(){
		if(parseInt(getValue('myLastAscension'))!=parseInt(getValue('myCurrentAscension')) && parseInt(getValue('myCurrentLevel')) >= 11){
			if(confirm("Are you sure you want to adventure here? Have you done the Black Forest yet?")){
				setValue('myLastAscension', getValue('myCurrentAscension'));
				return false;
			} else {
				return false;
			}
		}
	});
});

function getValue(player) {
	return GM_getValue(player + '.BlackForest');
}

function setValue(player, val) {
	GM_setValue(player + '.BlackForest', val);
}