// ==UserScript==
// @name		[Konachan / yande.re / LB] Comments: Show Post Status
// @namespace	Zolxys
// @description	Adds Parent/Child/Pending/Flagged info to the post headers on the comments page.
// @include		/^https?://konachan\.com/comment/?($|\?|#)/
// @include		/^https?://konachan\.net/comment/?($|\?|#)/
// @include		/^https?://yande\.re/comment/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/comment/?($|\?|#)/
// @version		1.2
// @downloadURL https://update.greasyfork.org/scripts/6066/%5BKonachan%20%20yandere%20%20LB%5D%20Comments%3A%20Show%20Post%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/6066/%5BKonachan%20%20yandere%20%20LB%5D%20Comments%3A%20Show%20Post%20Status.meta.js
// ==/UserScript==
var a = document.getElementById('comment-list').getElementsByTagName('strong');
for (var i = a.length - 1; i >= 0; --i)
 if (a[i].innerHTML == 'Date')
  if (/^comments-for-p\d+$/.test(a[i].parentNode.parentNode.parentNode.parentNode.id)) {
	var o = window.Post.posts._object[parseInt(a[i].parentNode.parentNode.parentNode.parentNode.id.substr(14))];
	var b = 0;
	if (o.has_children)
		b = 1;
	if (o.parent_id != null)
		b |= 2;
	if (o.status == 'pending')
		b |= 4;
	else if (o.status == 'flagged')
		b |= 8;
	if (b == 0)
		continue;
	var ne = document.createElement('span');
	ne.className = 'info';
	a[i].parentNode.parentNode.insertBefore(ne,a[i].parentNode.parentNode.firstChild);
	var ee = ne;
	ne = document.createElement('strong');
	ee.appendChild(ne);
	ee = ne;
	for (var d = 0; d <= 3; ++d)
	  if (b & Math.pow(2,d)) {
		ne = document.createElement('span');
		ne.style.color = ['#00FF00','#FFFF00','#0070FF','#FF0000'][d];
		ne.textContent = ['Parent ','Child ','Pending ','Flagged '][d];
		ee.appendChild(ne);
	}
}
