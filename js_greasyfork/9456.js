// ==UserScript==
// @name        Cursor Mod
// @description Modify the cursor when hovering over certain links
// @icon        https://mdn.mozillademos.org/files/9/alias.gif
// @version     0.1.1
// @license     GNU General Public License v3
// @copyright   2014, Nickel
// @grant       GM_addStyle
// @include     *
// @namespace https://greasyfork.org/users/10797
// @downloadURL https://update.greasyfork.org/scripts/9456/Cursor%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/9456/Cursor%20Mod.meta.js
// ==/UserScript==

// Source: http://www.askvg.com/tip-show-different-cursors-for-javascript-links-and-hyperlinks-that-open-in-new-window/

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

// New tab/window
GM_addStyle(':link[target="_blank"], :visited[target="_blank"], :link[target="_new"], :visited[target="_new"] {cursor: alias;}');
// Javascript
GM_addStyle('a[href^="javascript:"] {cursor: copy;}');