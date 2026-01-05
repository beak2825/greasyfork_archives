// ==UserScript==
// @name           Hover Preview
// @namespace      HP
// @description    Pops up a floating div when you hover over a link, containing the target page!
// @include        *
// @version 0.0.1.20150213035046
// @downloadURL https://update.greasyfork.org/scripts/8042/Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/8042/Hover%20Preview.meta.js
// ==/UserScript==

// TODO:
// Don't act if the target is a file-type.  i.e. we don't want to be prompted
// to save a zip file just because we hovered on it.
// KNOWN UNFIXABLE BUG:
// Damnit some pages break out of the iframe!  Don't try to use this on
// StackOverflow links!

// if (window.document != document) {
	// return; // Don't run in iframes
// }

// Quite nice on apache file listings of .jpegs, but a bit slow.  Ideally pre-load hoverable images?
// Could be a bit heavy.  It depends on the page...
// A different bookmarklet to turn all "links to images" into "images" would be nice. :)

var focusReactionTime = 1500;
var unfocusReactionTime = 1500;

var focus = undefined;
var lastFocus = undefined;
var timer = null;

var myPopup;
var myFrame;

var isOverPopup = false;

function checkFocus() {
	if (focus) {
		// if (focus == lastFocus) {
			// User has definitely been here a while
			showPreviewWindow(focus);
		// } else {
		// }
		// lastFocus = focus;
	}
}

function eekAMouse(evt) {
	if (evt.currentTarget.tagName !== "A") {
		return;
	}
	if (!focus) {
		focus = evt.currentTarget;
		// setTimeout('checkFocus();',focusReactionTime);
		// Hack to bring the popup back immediately if we've gone back to the same link.
		if (myFrame && focus.href && myFrame.href == focus.href) {
			showPreviewWindow(focus,evt);
		} else {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(checkFocus,focusReactionTime);
		}
	} else {
		window.status = "Already focused on a link wtf!";
	}
}

function phewMouseGone(evt) {
	if (evt.currentTarget.tagName !== "A") {
		return;
	}
	focus = undefined;
	if (timer) {
		clearTimeout(timer);
	}
	// TESTING: Don't hide the popup if mouse is currently over the popup!
	timer = setTimeout(clearPopup,unfocusReactionTime);
}

function clearPopup(e) {
	if (isOverPopup || focus)
		return;
	if (myPopup) {
		// myPopup.parentNode.removeChild(myPopup);
		// myPopup = undefined; // eww cache it!
		myPopup.style.display = 'none';
	}
}

// DONE: If the user clicks a link, this isn't really a hover, so we should not
// activate and just let the user's click be processed!
function aClick(evt) {
	focus = undefined;
}

function createPopup() {
	// Create frame
	myPopup = document.createElement('DIV');
	/** Seems style does not work for Konqueror this way. **/
	myPopup.innerHTML =
		"<STYLE type='text/css'> iframe.preview { color: #ff8822; background-color: #ff0000; margin: 0px; padding: 2px; border: 2px solid white; text-align: center; } </STYLE>"
		+
		"<IFRAME class='preview' width='"+(window.innerWidth*0.75)+"' height='"+(window.innerHeight*0.75)+"' src='about:blank'></IFRAME>";
	myPopup.addEventListener("mouseover", function(evt) { isOverPopup=true; }, false);
	myPopup.addEventListener("mouseout", function(evt) { isOverPopup=false; setTimeout(clearPopup,unfocusReactionTime); }, false);
	document.documentElement.appendChild(myPopup);
	/*
	myPopup.style.border = "4px solid white";
	myPopup.style.backgroundColor = "#004400";
	myPopup.style.margin = "4px";
	myPopup.style.padding = "4px";
	*/
	myPopup.style.position = "fixed";
	myPopup.style.right = "12px";
	myPopup.style.bottom = "12px";
	myPopup.style.zIndex = "10000";
	myFrame = myPopup.getElementsByTagName('IFRAME')[0];
}

function showPreviewWindow(link,evt) {
	if (!myFrame) {
		createPopup();
	}
	myPopup.style.display = '';
	if (!myFrame.src || myFrame.src != link.href)
		myFrame.src = link.href;
}

function init() {
	for (var i=0;i<document.links.length;i++) {
		var link = document.links[i];
		/** Apparently deprecated. **/
		// link.onmouseover = eekAMouse;
		// link.onmouseout = phewMouseGone;
		/** The new way: **/
		link.addEventListener("mouseover", eekAMouse, false);
		link.addEventListener("mouseout", phewMouseGone, false);
		link.addEventListener("click", aClick, false);
		// link.addEventListener("mousemove", function(evt) { locate(evt); }, true);
	}
}

init();

// window.document.checkFocus = checkFocus;

