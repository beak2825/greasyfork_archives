// ==UserScript==
// @name		[Konachan / yande.re / LB] Forum List: Re-order columns
// @namespace	Zolxys
// @description	Adds the ability to re-order columns in the forum list by dragging the headers. The layout is automatically saved in your browser and will be applied on each page load.
// @include		/^https?://konachan\.com/forum/?($|\?|#)/
// @include		/^https?://konachan\.net/forum/?($|\?|#)/
// @include		/^https?://yande\.re/forum/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/forum/?($|\?|#)/
// @version		2.2
// @downloadURL https://update.greasyfork.org/scripts/6218/%5BKonachan%20%20yandere%20%20LB%5D%20Forum%20List%3A%20Re-order%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/6218/%5BKonachan%20%20yandere%20%20LB%5D%20Forum%20List%3A%20Re-order%20columns.meta.js
// ==/UserScript==
var h = document.getElementById('forum').getElementsByTagName('table')[0].getElementsByTagName('th');
var a = document.getElementById('forum').getElementsByTagName('table')[0].getElementsByTagName('tr');
var d = null, x = 0, y = 0, l = 0, r = 0;
function dragEnd() {
	if (d == null)
		return;
	d.style.position = '';
	d.style.marginLeft = '';
	d.style.marginTop = '';
	d = null;
	var o = [];
	o.length = h.length;
	var t;
	for (var i = 0; i < h.length; ++i)
		if (/^\d+$/.test(t = h[i].getAttribute('zol_column_number')))
			o[t] = i;
	for (var i = 0; i < o.length; ++i)
		if (o[i] == undefined)
			o.splice(i--,1);
	window.localStorage.Zolxys_ForumListColumnOrder = o.join();
}
function dragUpdate(e) {
	if (d != null) {
		var ml = (e.pageX - x);
		d.style.marginLeft = ml + 'px';
		d.style.marginTop = (e.pageY - y) + 'px';
		var p = 0;
		if (l < 0 && ml < l)
			p = -1;
		else if (r > 0 && ml > r)
			p = 2;
		else
			return;
		var n = 0;
		for (; n < h.length; ++n)
			if (d == h[n])
				break;
		p += n;
		var cx = d.getBoundingClientRect().x;
		for (var i = 0; i < a.length; ++i)
			a[i].insertBefore(a[i].children[n], a[i].children[p]);
		d.style.marginLeft = '';
		x = e.pageX + d.getBoundingClientRect().x - cx;
		d.style.marginLeft = (e.pageX - x) + 'px';
		l = r = 0;
		if (d.previousElementSibling != null)
			l = d.previousElementSibling.getBoundingClientRect().width * -1;
		if (d.nextElementSibling != null)
			r = d.nextElementSibling.getBoundingClientRect().width;
		dragUpdate(e);
	}
}
for (var i = 0; i < h.length; ++i) {
	h[i].setAttribute('zol_column_number', i);
	h[i].addEventListener('mousedown', function (e) {
		if (d != null || e.buttons != 1)
			return dragEnd();
		d = this;
		var dx = d.getBoundingClientRect().x;
		d.style.position = 'absolute';
		var tx = document.body.clientWidth - d.getBoundingClientRect().right;
		d.style.marginLeft = tx +'px';
		d.style.marginLeft = (tx += dx - d.getBoundingClientRect().x) +'px';
		x = e.pageX - tx;
		y = e.pageY;
		if (d.previousElementSibling != null)
			l = d.previousElementSibling.getBoundingClientRect().width * -1;
		if (d.nextElementSibling != null)
			r = d.nextElementSibling.getBoundingClientRect().width;
		e.stopPropagation();
		e.preventDefault();
	});
}
var co = window.localStorage.Zolxys_ForumListColumnOrder;
if (co)
 if (/^\d[\d,]+\d$/.test(co)) {
	co = co.split(',');
	if (co.length > h.length)
		co.length = h.length;
	for (var i = 0; i < co.length; ++i)
		co[i] = parseInt(co[i]);
	for (var n = 0, x = -1; n < h.length; ++n)
	 if ((x = co.indexOf(n)) >= 0)
	  if (n != x) {
		for (var i = 0; i < a.length; ++i)
			a[i].insertBefore(a[i].children[x], a[i].children[n]);
		co.splice(x,1);
		co.unshift(-1);
	}
}
document.addEventListener('mousemove', dragUpdate);
document.addEventListener('mouseup', dragEnd);
