// ==UserScript==
// @name        Stop Middle Click Hijacking
// @description Prevent sites from hijacking the middle mouse button for their own purposes
// @icon        http://www.rjlsoftware.com/software/entertainment/finger/icons/finger.gif
// @version     0.1
// @license     GNU General Public License v3
// @copyright   2014, Nickel
// @grant       none
// @include     *://www.youtube.com/*
// @namespace https://greasyfork.org/users/10797
// @downloadURL https://update.greasyfork.org/scripts/9453/Stop%20Middle%20Click%20Hijacking.user.js
// @updateURL https://update.greasyfork.org/scripts/9453/Stop%20Middle%20Click%20Hijacking.meta.js
// ==/UserScript==

(function(){
	//Adapted from Chrome extension (written by petergrabs@yahoo.com)
	//TODO: would event.preventDefault() also work??

	document.addEventListener("click", function(e){ e.button===1 && e.stopPropagation(); }, true);
})();