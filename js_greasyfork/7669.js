// ==UserScript==
// @name           More Keybinds
// @namespace      MK
// @description    Adds some extra keystrokes to Firefox.
// @version        1.2.5
// @include        *
// @license        ISC
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/7669/More%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/7669/More%20Keybinds.meta.js
// ==/UserScript==

// jQuery might be present
/* eslint-env jquery */

// Not all keys fire a keypress event (Chrome 2010), so we use keydown.
document.addEventListener('keydown', keypressListener, false);

function keypressListener(evt) {
	var code = evt.keyCode || evt.which;

	/*
	var modifierReport = "";
	modifierReport += ( evt.ctrlKey  ? "Ctrl "  : "" );
	modifierReport += ( evt.shiftKey ? "Shift " : "" );
	modifierReport += ( evt.altKey   ? "Alt "   : "" );
	GM_log("Caught keypress "+code+" with modifiers: "+modifierReport);
	*/

	// Do not intercept any of the keys below when the user is focused on an input or textarea.
	/*
	//var focusedElement = document.activeElement;   // document.body if no input is focused
	var focusedElement = evt.target || event.srcElement;
	if (focusedElement) {
		var isInput = focusedElement.nodeName === 'INPUT' || focusedElement.nodeName === 'TEXTAREA';
		if (isInput) {
			return;
		}
	}
	*/
	// From next_imageprevious_image.user.js:
	if (evt.target.tagName && evt.target.tagName.match(/input|select|textarea/i) || evt.target.getAttribute('contenteditable')==="true") {
		return;
	}
	// Unfortunately this doesn't catch all input boxes (e.g. YouTube live chat, amongst others)

	// Actions

	/*
	// Ctrl+Backspace goes Back
	if (code == 8 && evt.ctrlKey) {
		window.history.back();
	}

	// The Delete key, because sometimes I map Ctrl+Backspace to emit a Delete, so I need that Delete to go back
	// But I disable this for sites where I really need the Delete key to work normally outside of form elements.  Those sites are usually graphical editors.
	if (code == 46 && !document.location.host.match(/piktochart.com|miro.com|whimsical.com/)) {
		window.history.back();
	}

	// Ctrl+Enter goes Forward
	if (code == 13 && evt.ctrlKey) {
		window.history.forward();
	}
	*/

	// macOS style (Cmd-BraceLeft / Cmd-BraceRight)
	// Not needed in Firefox, because Firefox responds to these by default
	if (!navigator.userAgent.match(/Firefox[/]/)) {
		if ((evt.ctrlKey || evt.altKey) && evt.key === '[') {
			window.history.back();
		}
		if ((evt.ctrlKey || evt.altKey) && evt.key === ']') {
			window.history.forward();
		}
	}

	/* These conflict with selecting words in text!

	// Ctrl+Shift+Left goes Back
	if (code == 37 && evt.ctrlKey && evt.shiftKey) {
		window.history.back();
	}

	// Ctrl+Shift+Right goes Forward
	if (code == 39 && evt.ctrlKey && evt.shiftKey) {
		window.history.forward();
	}

	*/

	// Ctrl+Shift+Up goes up in the URL path (removes the tail leaf)
	// Cmd+Alt+Up on macOS also works
	if ((code == 38 && evt.ctrlKey && evt.shiftKey) || (evt.code == 'ArrowUp' && evt.altKey && evt.metaKey)) {
		var newURL = document.location.href;
		if (newURL.slice(-1)=='/') {
			newURL = newURL.slice(0,-1);
		}
		document.location.href = document.location.href.replace(/[#/?][^#/?]*[/]*$/,'');
	}

	if (!evt.ctrlKey && !evt.shiftKey && !evt.metaKey) {
		if (document.location.host !== "9gag.com" /* && document.location.host !== "github.com" */) {
			if (code === 'K'.charCodeAt(0)) {
				bestScrollBy(-getScrollAmount());
			}

			if (code === 'J'.charCodeAt(0)) {
				bestScrollBy(+getScrollAmount());
			}
		}
	}

}

// Try to perform a smooth vertical scroll, but fall back to a jump scroll if neccessary
function bestScrollBy(amount) {
	if (typeof window.scrollBy === 'function') {
		// If browser has native scrollBy, use that
		window.scrollBy({
			left: 0,
			top: amount,
			behavior: 'smooth'
		});
	} else if (typeof $ !== "undefined" && $.fn && $.fn.animate) {
		// Otherwise, if jQuery is present, use that
		queue(function(next){
			$("html,body").animate({scrollTop: $(document).scrollTop() + amount}, 200, "swing", ifBody(next));
		});
	} else {
		// Otherwise perform a jerky scroll
		// Does not do anything in Chrome:
		document.body.scrollTop += amount;
		// Works in Chrome/Firefox:
		document.documentElement.scrollTop += amount;
	}
}

function getScrollAmount() {
	return window.innerHeight / 6;
}

function ifBody(fn) {
	return function(){
		// jQuery calls complete once for each element, and we have two elements.  Annoying!
		if (this === document.body) {
			fn();
		}
	};
}

var actions = [];
var running = false;
function queue(action) {
	actions.push(action);
	if (!running) {
		dequeue();
	}
}
function dequeue() {
	if (actions.length > 0) {
		var nextAction = actions.shift();
		running = true;
		nextAction(dequeue);
	} else {
		running = false;
	}
}
