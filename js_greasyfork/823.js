// ==UserScript==
// @name        bibliotik - creator names link directly to torrents
// @namespace   diff
// @include     http*://bibliotik.me/*
// @grant		none
// @version     0.3
// @description eliminates a click
// @downloadURL https://update.greasyfork.org/scripts/823/bibliotik%20-%20creator%20names%20link%20directly%20to%20torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/823/bibliotik%20-%20creator%20names%20link%20directly%20to%20torrents.meta.js
// ==/UserScript==

var links = document.links;
for (i=0; i < links.length; i++) {
	var link = links[i];
	if ( /creators\/\d+$/i.test(link.href) ) {
		link.href += "/torrents";
	}
}