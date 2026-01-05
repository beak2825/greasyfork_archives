// ==UserScript==
// @name				Retina Twitter
// @namespace			http://google.com
// @version				0.2
// @description			This is a bastardizatoin of Frederick888's Wider Twitter script designed to make maximum use of a retina Macbook 15 inch display.
// @include				*://twitter.com/*
// @copyright			Nobody
// @require				https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/9970/Retina%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/9970/Retina%20Twitter.meta.js
// ==/UserScript==

// CSS
CSSElement = '<style id="myTwitterMod" type="text/css">div#page-container.wrapper{width:1310px!important;}div.content-main[role="main"]{width:1800px!important;}#page-container.wrapper>.permalink-footer{width:900px!important;margin-left:auto!important;margin-right:auto!important;}div.permalink.stream-uncapped{margin-left:auto!important;margin-right:auto!important;}div.profile-card.profile-page-header{right:100px!important;}div.profile-card,.profile-header-mask,div.profile-header-inner-overlay,div.modal-content.clearfix{width:700px!important;}li.stream-user-gallery{width:564px!important;margin-left:auto!important;margin-right:auto!important;}.content-main.user-similarities-list{width:700px!important;margin-right:100px!important;}</style>';
$('head').append(CSSElement);

// Move the right-dashboard
function change() {
	var parent = $('.dashboard-right');
	var users = $('.dashboard-right>div:first-child');
	var footer = $('.dashboard-right>div:last-child');

	$('.dashboard-left').append(users);
	$('.dashboard-left').append(footer);
	parent.remove();
}
var oldLoc = '';
change();
setInterval(function() {
	if(location.href != oldLoc) {
		oldLoc = location.href;
		change();
	}
}, 100);