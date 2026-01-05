// ==UserScript==
// @name		[Konachan / yande.re / LB] Search: Remove Dead Space
// @namespace	Zolxys
// @description	Makes use of much of the empty space on the posts pages to show more thumbnails. Useful if you increase the size and/or number of thumbnails.
// @include		/^https?://konachan\.com/post/?($|\?|#)/
// @include		/^https?://konachan\.net/post/?($|\?|#)/
// @include		/^https?://yande\.re/post/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/post/?($|\?|#)/
// @version		1.2
// @downloadURL https://update.greasyfork.org/scripts/6075/%5BKonachan%20%20yandere%20%20LB%5D%20Search%3A%20Remove%20Dead%20Space.user.js
// @updateURL https://update.greasyfork.org/scripts/6075/%5BKonachan%20%20yandere%20%20LB%5D%20Search%3A%20Remove%20Dead%20Space.meta.js
// ==/UserScript==
var ss = document.createElement('style');
ss.type = 'text/css';
ss.textContent = [
'body {padding: 1em .6%;}',
'div.content {width: 84%; margin: 0; padding: 0;}',
'div.sidebar {width: 15%; margin: 0 .4% 0 0; padding: 0;}',
'div#news-ticker {margin: -1em -.6% 1em;}',
''].join('\n');
document.head.appendChild(ss);
var n = document.getElementById('lsidebar');
if (n)
	n.parentNode.removeChild(n);
