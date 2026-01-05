// ==UserScript==
// @name		[Konachan / yande.re / LB] Comments: Show Large Thumbnails
// @namespace	Zolxys
// @description	Shows larger thumbnails on the comments page.
// @include		/^https?://konachan\.com/comment/?($|\?|#)/
// @include		/^https?://konachan\.net/comment/?($|\?|#)/
// @include		/^https?://yande\.re/comment/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/comment/?($|\?|#)/
// @version		1.4
// @downloadURL https://update.greasyfork.org/scripts/6065/%5BKonachan%20%20yandere%20%20LB%5D%20Comments%3A%20Show%20Large%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/6065/%5BKonachan%20%20yandere%20%20LB%5D%20Comments%3A%20Show%20Large%20Thumbnails.meta.js
// ==/UserScript==
var ss = document.createElement('style');
ss.type = 'text/css';
ss.textContent = 'div#comment-list > div.post > div.col1 {width: 320px;}';
document.head.appendChild(ss);
var a = document.getElementsByTagName('img');
for (var i = 0; i < a.length; i++)
 if (a[i].parentNode.parentNode != null)
  if (a[i].parentNode.parentNode.className == 'col1') {
	a[i].removeAttribute('width');
	a[i].removeAttribute('height');
}
