// ==UserScript==
// @name		[Konachan / yande.re] Forum List: Default to Last Page
// @namespace	Zolxys
// @description	Replaces the "last" links in the forum list with "first" links and changes the main links to link to the last page.
// @include		/^https?://konachan\.(com|net)/forum/?($|\?|#)/
// @include		/^https?://yande\.re/forum/?($|\?|#)/
// @version		1.1
// @downloadURL https://update.greasyfork.org/scripts/6067/%5BKonachan%20%20yandere%5D%20Forum%20List%3A%20Default%20to%20Last%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/6067/%5BKonachan%20%20yandere%5D%20Forum%20List%3A%20Default%20to%20Last%20Page.meta.js
// ==/UserScript==
var t = document.getElementById('forum').getElementsByTagName('table')[0].getElementsByTagName('td');
for (var i = 0; i < t.length; ++i) {
	var a = t[i].getElementsByTagName('a');
	if (a.length == 2)
	  if (a[1].innerHTML.trim() == 'last') {
		var h = a[0].href;
		a[0].href = a[1].href;
		a[1].href = h;
		a[1].innerHTML = 'first';
	}
}
