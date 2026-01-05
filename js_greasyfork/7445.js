// ==UserScript==
// @name        WME Hot Fix
// @namespace   Waze-Map-Editor-addons-by-FZ69617
// @version     1.0.1
// @description Fixes minor bugs found in the WME.
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @include     https://editor-beta.waze.com/*
// @grant       none
// @copyright   2015 FZ69617
// @downloadURL https://update.greasyfork.org/scripts/7445/WME%20Hot%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/7445/WME%20Hot%20Fix.meta.js
// ==/UserScript==


function wmehotfix_apply()
{
	// WME v1.6-415 fix for shift-click map selection problem
	// see: https://www.waze.com/forum/viewtopic.php?f=8&t=122463&start=230#p1002095
	//
	var style = document.createElement('style');
	style.id = 'wmehotfix-shift-click-problem';
	style.innerHTML = ''
	+	'#WazeMap { -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }\n'
	+	'#chat-overlay { -webkit-touch-callout: initial;  -webkit-user-select: initial; -khtml-user-select: initial; -moz-user-select: initial; -ms-user-select: initial; user-select: initial; }\n'
	;
	document.head.appendChild(style);

	console.log('WME Hot Fix applied.');
}

wmehotfix_apply();
