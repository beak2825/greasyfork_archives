// ==UserScript==
// @name		[Konachan / yande.re] Profile: Show Duplicate Thumbnails
// @namespace	Zolxys
// @description	Disables the hiding of duplicate thumbnails on the user pages.
// @include		/^https?://konachan\.(com|net)/user/show/\d+/?($|\?|#)/
// @include		/^https?://yande\.re/user/show/\d+/?($|\?|#)/
// @version		1.2
// @downloadURL https://update.greasyfork.org/scripts/6070/%5BKonachan%20%20yandere%5D%20Profile%3A%20Show%20Duplicate%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/6070/%5BKonachan%20%20yandere%5D%20Profile%3A%20Show%20Duplicate%20Thumbnails.meta.js
// ==/UserScript==
var l = [];
var a = document.getElementsByTagName("li");
for (var i = 0; i < a.length; ++i)
  if (/^p\d+$/.test(a[i].id)) {
	var n = parseInt(a[i].id.substr(1));
	if (l.indexOf(n) == -1) {
		if (!/(^|\s)javascript-hide(\s|$)/.test(a[i].className))
			l.push(n);
	}
	else
		a[i].className = a[i].className.replace(/(^|\s)javascript-hide(\s|$)/g, ' ');
}
