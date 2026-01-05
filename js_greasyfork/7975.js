// ==UserScript==
// @name        TW - RAM
// @namespace   *
// @include     http://*.the-west.*/*
// @version     1
// @grant       none
// @description TW - RA;
// @downloadURL https://update.greasyfork.org/scripts/7975/TW%20-%20RAM.user.js
// @updateURL https://update.greasyfork.org/scripts/7975/TW%20-%20RAM.meta.js
// ==/UserScript==

$( document ).ready(function() 
{
	window.setTimeout("$('.border.highlight').remove();", 10000);
});