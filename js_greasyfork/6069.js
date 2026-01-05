// ==UserScript==
// @name		[Konachan / yande.re / LB] Menu: Replace Dropdown Buttons
// @namespace	Zolxys
// @description	Replaces the squares in the main menu bar which display rather small in Firefox and Chrome with downward pointing triangles that are a lot easier to click.
// @include		/^https?://konachan\.com/[^#?]/
// @include		/^https?://konachan\.net/[^#?]/
// @include		/^https?://yande\.re/[^#?]/
// @include		/^https?://lolibooru\.moe/[^#?]/
// @exclude		/^[^#?]+\.\w+($|\?|#)/
// @version		1.2
// @downloadURL https://update.greasyfork.org/scripts/6069/%5BKonachan%20%20yandere%20%20LB%5D%20Menu%3A%20Replace%20Dropdown%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/6069/%5BKonachan%20%20yandere%20%20LB%5D%20Menu%3A%20Replace%20Dropdown%20Buttons.meta.js
// ==/UserScript==
var c = document.getElementById('header').getElementsByTagName('a');
for (var i = 0; i < c.length; i++)
 if (c[i].childNodes.length) {
	var o = c[i].firstChild;
	if (o.nodeType == 3) {
		if (o.data.trim() == '\u25A0')
		 o.data = o.data.replace('\u25A0','\u25BC');
	}
}
