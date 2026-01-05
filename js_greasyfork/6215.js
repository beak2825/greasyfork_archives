// ==UserScript==
// @name        A-P search defaults to manga on manga pages
// @description With this, when you visit a page in the manga section on anime planet, the search type will default to manga.
// @namespace   https://github.com/jahu00
// @include     http://www.anime-planet.com/manga/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6215/A-P%20search%20defaults%20to%20manga%20on%20manga%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/6215/A-P%20search%20defaults%20to%20manga%20on%20manga%20pages.meta.js
// ==/UserScript==
{
	var typeSelector = document.querySelector('#siteSearch-select');
	if (typeSelector != null)
	{
		typeSelector.value = "manga";
	}
}