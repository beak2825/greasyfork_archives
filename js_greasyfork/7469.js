// ==UserScript==
// @name        KickThoseThings1
// @namespace   InGame
// @include     http://www.dreadcast.net/Forum/2-691-ami-du-flood-*
// @version     2
// @grant       none
// @author	Ladoria
// @description Kick thoses things
// @downloadURL https://update.greasyfork.org/scripts/7469/KickThoseThings1.user.js
// @updateURL https://update.greasyfork.org/scripts/7469/KickThoseThings1.meta.js
// ==/UserScript==

$(document).ready( function() {
	function KickThoseThings() {
		$('.sexe0').parent().parent().each( function() {
			$(this).hide();
			$(this).prev().hide();
		});
	}

	KickThoseThings();
	
	$(document).ajaxComplete( function() {
		KickThoseThings();
	});
});