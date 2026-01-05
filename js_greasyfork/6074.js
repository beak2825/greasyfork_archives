// ==UserScript==
// @name		[Konachan / yande.re / LB] Thumbnails: Show Large Thumbnails (Most Pages)
// @namespace	Zolxys
// @description	Shows larger thumbnails on all pages except comments and pool pages.
// @include		/^https?://konachan\.com/(post(/(similar|delete)(/\d+)?)?|user/show/\d+|wiki/show|note)/?($|\?|#)/
// @include		/^https?://konachan\.net/(post(/(similar|delete)(/\d+)?)?|user/show/\d+|wiki/show|note)/?($|\?|#)/
// @include		/^https?://yande\.re/(post(/(similar|delete)(/\d+)?)?|user/show/\d+|wiki/show|note)/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/(post(/(similar|delete)(/\d+)?)?|user/show/\d+|wiki/show|note)/?($|\?|#)/
// @version		1.3
// @downloadURL https://update.greasyfork.org/scripts/6074/%5BKonachan%20%20yandere%20%20LB%5D%20Thumbnails%3A%20Show%20Large%20Thumbnails%20%28Most%20Pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/6074/%5BKonachan%20%20yandere%20%20LB%5D%20Thumbnails%3A%20Show%20Large%20Thumbnails%20%28Most%20Pages%29.meta.js
// ==/UserScript==
if (document.getElementById('post-list-posts') != null) {
	var a = document.getElementsByTagName('img'); // Searches from document instead of id 'post-list-posts' because that id occurs multiple times on the profile page.
	for (var i = 0; i < a.length; i++) {
		var c = 0;
		var d = a[i];
		while (d.id != 'post-list-posts') {
			d = d.parentNode;
			++c;
			if (d == null)
				break;
			if (c == 2 && d.nodeName != 'DIV')
				break;
			if (c == 4) {
				if (d.id != 'post-list-posts')
					break;
				a[i].parentNode.parentNode.style.height=((/konachan/.test(location.host))? '270px' : '300px'); // div
				if (a[i].title != '') {
					a[i].parentNode.parentNode.parentNode.style.width='310px'; // li
					a[i].parentNode.parentNode.style.width='310px'; // div
					a[i].removeAttribute('width');
					a[i].removeAttribute('height');
				}
			}
		}
	}
}
document.getElementById('index-hover-overlay').firstElementChild.style.display = 'none';
