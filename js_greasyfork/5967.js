// ==UserScript==
// @name          Slickdeals Old Forum Redirect
// @namespace     vzjrz1@gmail.com
// @description   Redirects to old forum version of posts
// @include       https://slickdeals.net/f/*
// @include       http://slickdeals.net/f/*
// @version       1
// @grant         none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/5967/Slickdeals%20Old%20Forum%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/5967/Slickdeals%20Old%20Forum%20Redirect.meta.js
// ==/UserScript==


var url = window.location.href;

if (url.indexOf("v=1") == -1) {
	if (url.indexOf("?") == -1) {
		url += "?v=1";
	} else {
		var prefix = url.substring(0, url.indexOf("?") + 1);
		var suffix = url.substring(url.indexOf("?") + 1);
		url = prefix + "v=1&" + suffix;
	}
	window.location.replace(url);
}
