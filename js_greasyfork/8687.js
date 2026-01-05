// ==UserScript==
// @name        Youtube Space=Pause
// @namespace   s4nji
// @author      s4nji
// @description Pressing space when watching a video on Youtube will always pause the video instead of functioning like Page Down key.
// @license     CC0
// @include     https://www.youtube.com/watch*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8687/Youtube%20Space%3DPause.user.js
// @updateURL https://update.greasyfork.org/scripts/8687/Youtube%20Space%3DPause.meta.js
// ==/UserScript==


/* - - - - - *\
 * Variables *
\* - - - - - */
var inputFocus = false;
var debug = false;


/* - - - - - - - - - *\ 
 * Utility Functions *
\* - - - - - - - - - */
// Debug Console Logging
function clog(msg) {
	if (debug) {
		console.log("YtS=P | "+msg);
	}
}

// Run codes "unsafely"
function contentEval(source) {
	"use strict";
	
	// Check for function input.
	if ('function' === typeof source) {
		// Execute this function with no arguments, by adding parentheses.
		// One set around the function, required for valid syntax, and a
		// second empty set calls the surrounded function.
		source = '(' + source + ')();';
	}

	// Create a script node holding this  source code.

	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = source;

	// Insert the script node into the page, so it will run, and immediately
	// remove it to clean up.
	document.body.appendChild(script);
	document.body.removeChild(script);
}

// Set inputFocus to true if an input box is on focus
function setInputFocus(bool) {
	"use strict";
	
	return function() {
		if ( typeof bool === "boolean" ) {
			inputFocus = bool;
			clog("inputFocus = " + inputFocus);
		}
	};
}

// Add Event Listeners
function hookInputFocus() {
	"use strict";
	
	var inputs = document.querySelectorAll("input"), i;
	for (i=0; i<inputs.length; i+=1) {
		inputs[i].addEventListener('focus', setInputFocus(true));
		inputs[i].addEventListener('blur', setInputFocus(false));
		clog("hooked "+i+"!");
	}
}

/* - - - - - - - *\ 
 * Main Function *
\* - - - - - - - */
function main() {
	"use strict";
	
	document.body.addEventListener('keydown', function(event) {
		clog("inputFocus == " + inputFocus);
		
		if (event.keyCode === 32 && !inputFocus) {
			event.preventDefault();
			
			var status = document.querySelector("#movie_player").getPlayerState();
			if ( status === 1 || status === 3 ) {
				contentEval('document.querySelector("#movie_player").pauseVideo();');
			} else if ( status === 2 || status === 0 ) {
				contentEval('document.querySelector("#movie_player").playVideo();');
			}
			
			// N/A (-4), unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5). 
			
		}
	});
	
	hookInputFocus();
}

// Start on load
document.addEventListener('DOMContentLoaded', main() );