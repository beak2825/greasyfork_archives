// ==UserScript==
// @name        Diaspora* - Public publications by default
// @description Select the Public aspect as default for new publications in the social media platform Diaspora*.
// @namespace   diaspora-new-post-public
// @include     http://joindiaspora.com/stream
// @version     1
// @copyright   Public domain (http://unlicense.org/)
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7951/Diaspora%2A%20-%20Public%20publications%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/7951/Diaspora%2A%20-%20Public%20publications%20by%20default.meta.js
// ==/UserScript==

/**
 * Be sure to update '@include' on line 5 above to match your Diaspora* pod!
 * Simply replace 'diasporabrazil.org' with your pod domain
 */

// If jQuery is available, run everything as soon as the DOM is set up.
if ( 'jQuery' in window ) jQuery( document ).ready(function( $ ) {

	// A list of the ids of users who should have publications marked as public by default.
	var	userid_targets = [
		'1d4c2183c4c73dac'
	];

	var userid_current = document.querySelectorAll( '.user-menu-item a[href*="/people/"]' );

	if ( typeof userid_current[0] != 'undefined' ) {
		userid_current = userid_current[0].href.substr( userid_current[0].href.lastIndexOf( '/' ) + 1 );

		if ( userid_targets.indexOf( userid_current ) > -1 ) {
			var aspect_public = document.querySelectorAll( '.public_toggle .public' );
			if ( typeof aspect_public[0] != 'undefined' ) {
				$( aspect_public[0] ).trigger( 'click' );
			}
		}
	}

});
