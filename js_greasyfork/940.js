// ==UserScript==
// @name 	Serenes Forest - Change 'Favorite Fire Emblem' to 'Favorite FE' in Miniprofiles
// @namespace	Makaze
// @include	http://*serenesforest.net/*
// @grant	none
// @version	1.0.2
// @description Like it says on the tin.
// @downloadURL https://update.greasyfork.org/scripts/940/Serenes%20Forest%20-%20Change%20%27Favorite%20Fire%20Emblem%27%20to%20%27Favorite%20FE%27%20in%20Miniprofiles.user.js
// @updateURL https://update.greasyfork.org/scripts/940/Serenes%20Forest%20-%20Change%20%27Favorite%20Fire%20Emblem%27%20to%20%27Favorite%20FE%27%20in%20Miniprofiles.meta.js
// ==/UserScript==

var i = 0,
j = 0;

function clearProfile() {
	for (i = 0; i < document.getElementsByClassName('custom_fields').length; i++) {
		var thisf = document.getElementsByClassName('custom_fields')[i];
		for (j = 0; j < thisf.getElementsByTagName('li').length; j++) {
			if (thisf.getElementsByTagName('li')[j].innerHTML.match(/Fire Emblem/gi)) {
				thisf.getElementsByTagName('li')[j].getElementsByClassName('ft')[0].innerHTML = "Favorite FE:";
			}
		}
	}
}

clearProfile();