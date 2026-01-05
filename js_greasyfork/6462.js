// BEAR SEASON
//
// ==UserScript==
// @name          BEAR SEASON
// @description   BEARSSSSS
// @include       *127.0.0.1:*/peevpee.php*
// @include       *kingdomofloathing.com*/peevpee.php*
// @version 	  0.2
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/6462/BEAR%20SEASON.user.js
// @updateURL https://update.greasyfork.org/scripts/6462/BEAR%20SEASON.meta.js
// ==/UserScript==

$(document).ready(function() {		   
	$('img[src*="otherimages/pvp_youwin.gif"]').attr('src','http://images.kingdomofloathing.com/adventureimages/bar.gif');
});