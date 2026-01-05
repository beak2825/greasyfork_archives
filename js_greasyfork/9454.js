// ==UserScript==
// @name        livestream.com Widescreen tweak
// @description Expand the video on livestream.com while keeping the chat visible
// @icon        https://lh4.googleusercontent.com/-HR473IkG4L8/AAAAAAAAAAI/AAAAAAAAE2E/tgp7xxNk6dI/s46-c-k-no/photo.jpg
// @version     0.3.2
// @license     GNU General Public License v3
// @copyright   2014, Nickel
// @grant       GM_addStyle
// @include     *://www.livestream.com/*
// @namespace https://greasyfork.org/users/10797
// @downloadURL https://update.greasyfork.org/scripts/9454/livestreamcom%20Widescreen%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/9454/livestreamcom%20Widescreen%20tweak.meta.js
// ==/UserScript==

(function(){

// don't run in frames
if (frameElement){ return; }

// fallback (Chrome lacks GM functions)
if( typeof GM_addStyle != 'function' ) {
	function GM_addStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if( !head ){ return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
}

// expand
document.getElementById("content").classList.add("expanded");
document.getElementById("expand-channel-player").classList.add("expanded");

// fix widths
GM_addStyle("#main {width:1280px !important;}");

GM_addStyle("#main-top {width:1310px !important;}");
GM_addStyle("#top-header {width:1280px !important;}");

GM_addStyle("#main-bottom {width:1310px !important;}");
GM_addStyle("#top-bottom {width:1280px !important;}");
GM_addStyle("#footer-main-bottom {width:1280px !important;}");

GM_addStyle("#main .box-wrap:not(#channel-chat):not(#like):not(#adContainer):not(#related-channels) {width:912px !important;}");
GM_addStyle("#main #channel-about .content {width:720px !important;}");
GM_addStyle("#main .box .footer {width:910px !important;}");

})();