// ==UserScript==
// @name              YouTube redirect
// @version           1.0.5
// @description     Redirect YouTube url to my fullscreen version.
// @include           https://*youtube.com/*
// @include           http://*youtube.com/*
// @namespace    https://greasyfork.org/users/3159
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/6454/YouTube%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/6454/YouTube%20redirect.meta.js
// ==/UserScript==
var a = 0;
setInterval(function () {
	if (a === 0 && window.location.href.indexOf('watch?') > -1 && window.location.href.indexOf('list=WL') < 0 && document.referrer.indexOf('github.io') < 0) {
		a = '//yukip.github.io/YouTube/?' + window.parent.location.href.split('?')[1];
		window.location.replace(a);
	}
}, 10);