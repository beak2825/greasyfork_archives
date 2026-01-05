// ==UserScript==
// @name           Facepunch Title Fix
// @namespace      @LuaStoned
// @description    Resize those huge titles
// @include        http://facepunch.com/threads/*
// @include        https://facepunch.com/threads/*
// @include        http://*.facepunch.com/threads/*
// @include        https://*.facepunch.com/threads/*
// @include        http://facepunch.com/showthread*
// @include        https://facepunch.com/showthread*
// @include        http://*.facepunch.com/showthread*
// @include        https://*.facepunch.com/showthread*
// @version 0.0.1.20150909154538
// @downloadURL https://update.greasyfork.org/scripts/7761/Facepunch%20Title%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/7761/Facepunch%20Title%20Fix.meta.js
// ==/UserScript==

var usertitles = document.getElementsByClassName("usertitle");
for (var i = 0; i < usertitles.length; ++i)
{
	usertitles[i].style["font-size"] = "10px";

	var fonts = usertitles[i].getElementsByTagName("font");
	for (var j = 0; j < fonts.length; j++)
	{
		fonts[j].setAttribute("size", 1);
	}
}