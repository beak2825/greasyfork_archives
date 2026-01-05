// ==UserScript==
// @name        Tumblr No Scrolling Header
// @namespace   TNSH
// @description Pins scrolling header to the top of the page.
// @include     https://www.tumblr.com/*
// @version     3
// @grant       GM_addStyle
// @license     GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/6167/Tumblr%20No%20Scrolling%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/6167/Tumblr%20No%20Scrolling%20Header.meta.js
// ==/UserScript==

// SETTINGS
// Set to "true" if you want to pin the scrolling header to the top of the page, set to false otherwise
var pinScrollingHeader = true;
// Set to "true" if you want to hide the old button strip, set to false otherwise
var hideOldPostButtons = false;
// END OF SETTINGS

if (pinScrollingHeader){
	var h = document.getElementsByClassName("l-header-container l-header-container--refresh");
	if (h.length >= 1)
		h[0].style.position = "absolute";	
	GM_addStyle(".l-header-container{position:absolute !important;}")
}

if (hideOldPostButtons){
	var h = document.getElementById("new_post_buttons");
	if (h)
		h.style.display = "none";
}