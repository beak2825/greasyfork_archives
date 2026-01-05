// ==UserScript==
// @name        Respawn Sticker Smile
// @namespace   http://redsky.fr/userscripts/respawn-sticker-smile/
// @description Permet d'avoir un aperçu des nouveaux smileys magnifiques, fantastiques et génialissime de Respawn
// @include     http://www.jeuxvideo.com/*
// @version     7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9346/Respawn%20Sticker%20Smile.user.js
// @updateURL https://update.greasyfork.org/scripts/9346/Respawn%20Sticker%20Smile.meta.js
// ==/UserScript==


/* Dédie à N***y ( pseudo censuré ) :hap: */
var skyPicts = document.getElementsByTagName("img");
var j 		= 0;
var lgn 	= skyPicts.length;
while( j < lgn ) {
	for (var i = skyPicts[j].attributes.length - 1; i >= 0; i--) {
		if( skyPicts[j].attributes[i].name == "data-def" && skyPicts[j].attributes[i].value == "SMILEYS" ) {
			skyPicts[j].style.width = "71px";
		}
	};
	j ++;
}