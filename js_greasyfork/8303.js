// ==UserScript==
// @name        hide ann ep reviews
// @namespace   thewildsun
// @include     http://www.animenewsnetwork.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @version     1.2
// @grant       none
// @description hides ann ep reviews
// @downloadURL https://update.greasyfork.org/scripts/8303/hide%20ann%20ep%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/8303/hide%20ann%20ep%20reviews.meta.js
// ==/UserScript==

(function() {
	$('div.herald.box.reviews span.intro').css({opacity:0});
})();