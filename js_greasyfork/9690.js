// ==UserScript==
// @name        Full URLs for Twitter
// @description Replace t.co URLs with the original
// @include     twitter.com
// @match       *://*.twitter.com/*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/11079
// @downloadURL https://update.greasyfork.org/scripts/9690/Full%20URLs%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/9690/Full%20URLs%20for%20Twitter.meta.js
// ==/UserScript==
(function (win) {
	var main = function () {
		Array.prototype.slice.call(win.document.querySelectorAll('#page-container a.twitter-timeline-link[href*="t.co"]'), 0) .forEach(function (el) {
			if (el.dataset && el.dataset.expandedUrl) {
				el.href = el.dataset.expandedUrl;
			}
		});
	};
	main();
        win.onscroll = main;
}) (window);
