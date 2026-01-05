// ==UserScript==
// @name		[Konachan / yande.re / LB] Search: Show X Per Page
// @namespace	Zolxys
// @description	Lets you set the # of posts to return per page. This can be set both for the current page and as a default to use when neither "page" nor "limit" is set. Adds a "#/page" link to the footer that pops up a settings box.
// @include		/^https?://konachan\.com/post/?($|\?|#)/
// @include		/^https?://konachan\.net/post/?($|\?|#)/
// @include		/^https?://yande\.re/post/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/post/?($|\?|#)/
// @run-at		document-start
// @version		2.1
// @downloadURL https://update.greasyfork.org/scripts/6072/%5BKonachan%20%20yandere%20%20LB%5D%20Search%3A%20Show%20X%20Per%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/6072/%5BKonachan%20%20yandere%20%20LB%5D%20Search%3A%20Show%20X%20Per%20Page.meta.js
// ==/UserScript==
dl = (location.hostname == 'yande.re')? 40 : (location.hostname == 'lolibooru.moe')? 30 : 21; // Static values for each site's default limit
function correctNumericString(s) {
	s = s.trim();
	var b = (s == '');
	if (!b)
		b = !isNaN(s = parseInt(s));
	return (b)? ''+ s : null;
}
if (!localStorage.Zolxys_ResultsPerPage)
	localStorage.Zolxys_ResultsPerPage = '';
var l = '', g = '', s;
var rx = /.*[\?&]limit=([^&]*)(&|$)/.exec(location.search);
if (rx)
	l = s = correctNumericString(rx[1]);
if (rx = /.*[\?&]page=([^&]*)(&|$)/.exec(location.search))
	g = correctNumericString(rx[1]);
else if (s == undefined)
 if (s = correctNumericString(localStorage.Zolxys_ResultsPerPage)) {
	if (location.search.length > 1)
		s += '&'+ location.search.substr(1);
	location.replace(location.protocol +'//'+ location.host + location.pathname +'?limit='+ s + location.hash);
	return;
}
function position() {
	var o = document.getElementById('zol_XPerPage');
	o.style.marginTop = '-'+ o.getBoundingClientRect().height +'px';
	o.style.marginLeft = 0;
	var t = innerWidth - o.getBoundingClientRect().x - o.getBoundingClientRect().width;
	if (t < 0)
		o.style.marginLeft = t;
}
function applyCustom(e, p) {
	e.preventDefault();
	var c = correctNumericString(document.getElementById('zol_XPerPage_Custom').value);
	if (c == null) {
		var o = document.getElementById('zol_XPerPage_Error');
		o.textContent = 'Error: Invalid number';
		o.style.display = 'block';
		position();
		return;
	}
	c = (parseInt(c) > 0)? parseInt(c) : 0;
	var cl = (parseInt(l) > 0)? parseInt(l) : 0;
	var cp = (parseInt(g) > 1)? parseInt(g) : 1;
	if (c == cl && (p > 0 || cp == 1)) {
		var o = document.getElementById('zol_XPerPage_Error');
		o.textContent = 'No change to load';
		o.style.display = 'block';
		position();
		return;
	}
	var d = correctNumericString(localStorage.Zolxys_ResultsPerPage);
	d = (parseInt(d) > 0)? parseInt(d) : 0;
	var s = '';
	if (c != 0 || d != 0)
		s = '&limit='+ c;
	if (p > 0) {
		if (cl == 0)
			cl = dl;
		if (c == 0)
			c = dl;
		p = Math.ceil(((cp + p - 2) * cl + 1) / c);
		if (p > 1)
			s += '&page='+ p;
	}
	location = location.protocol +'//'+ location.host + location.pathname +'?'+ s.substr(1) + ('&'+ location.search.substr(1)).replace(/&(limit|page)=([^&]*)(?=&|$)/g,'') + location.hash;
}
function init() {
	var o = document.getElementById('subnavbar');
	var ne = document.createElement('li');
	o.appendChild(ne);
	o = ne;
	ne = document.createElement('a');
	ne.href = '#';
	ne.addEventListener('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		if (document.getElementById('zol_XPerPage').visible())
			document.getElementById('zol_XPerPage').style.display = 'none';
		else {
			var s = correctNumericString(localStorage.Zolxys_ResultsPerPage);
			document.getElementById('zol_XPerPage_Default').value = (s == '0')? '' : s;
			document.getElementById('zol_XPerPage_Status').textContent = '';
			document.getElementById('zol_XPerPage_Custom').value = (l == '0')? '' : l;
			document.getElementById('zol_XPerPage_Error').style.display = 'none';
			document.getElementById('zol_XPerPage').style.display = 'inline-block';
			position();
			document.getElementById('zol_XPerPage_Default').focus();
			document.getElementById('zol_XPerPage_Default').select();
		}
	});
	ne.textContent = '#/page';
	o.appendChild(ne);
	ne = document.createElement('div');
	ne.id = 'zol_XPerPage';
	ne.className = 'submenu';
	ne.style.background = 'none repeat scroll 0 0 black';
	ne.style.border = '1px solid #666';
	ne.style.display = 'none';
	ne.style.margin = '0';
	ne.style.padding = '3px 4px 5px';
	ne.style.position = 'absolute';
	ne.style.textAlign = 'left';
	ne.style.whiteSpace = 'nowrap';
	ne.style.zIndex = '1000';
	ne.addEventListener('click', function (e) {
		e.stopPropagation();
	});
	o.insertBefore(ne, o.firstChild);
	o = ne;
	o.textContent = 'Default #: ';
	ne = document.createElement('input');
	ne.id = 'zol_XPerPage_Default';
	ne.type = 'text';
	ne.size = '1';
	ne.style.marginBottom = '3px';
	ne.addEventListener('input', function () {
		var t = correctNumericString(document.getElementById('zol_XPerPage_Default').value);
		if (t != null)
			localStorage.Zolxys_ResultsPerPage = t;
		document.getElementById('zol_XPerPage_Status').style.color = (t != null)? '#3F3' : '#F33';
		document.getElementById('zol_XPerPage_Status').textContent = (t != null)? 'Saved' : 'Invalid';
		document.getElementById('zol_XPerPage_Custom').value = t;
		position();
	});
	ne.addEventListener('keyup', function (e) {
		if (e.keyCode == 13)
			document.getElementById('zol_XPerPage').style.display = 'none';
	});
	o.appendChild(ne);
	ne = document.createElement('span');
	ne.id = 'zol_XPerPage_Status';
	ne.style.fontSize = '10px';
	ne.style.marginLeft = '6px';
	o.appendChild(ne);
	o.appendChild(document.createElement('hr'));
	o.appendChild(document.createTextNode('Custom #: '));
	ne = document.createElement('input');
	ne.id = 'zol_XPerPage_Custom';
	ne.type = 'text';
	ne.size = '1';
	ne.style.marginBottom = '3px';
	ne.addEventListener('keyup', function (e) {
		if (e.keyCode == 13)
			applyCustom(e, (parseInt(g) > 1)? 1 : 0);
	});
	o.appendChild(ne);
	o.appendChild(document.createElement('br'));
	if (parseInt(g) > 1) {
		o.appendChild(document.createTextNode('Change and:'));
		o.appendChild(document.createElement('br'));
		ne = document.createElement('a');
		ne.href = '#';
		ne.textContent = 'Adjust to show this page';
		ne.addEventListener('click', function (e) {
			applyCustom(e, 1);
		});
		o.appendChild(ne);
		o.appendChild(document.createElement('br'));
		ne = document.createElement('a');
		ne.href = '#';
		ne.textContent = 'Adjust to show next page';
		ne.addEventListener('click', function (e) {
			applyCustom(e, 2);
		});
		o.appendChild(ne);
		o.appendChild(document.createElement('br'));
	}
	ne = document.createElement('a');
	ne.href = '#';
	ne.textContent = (parseInt(g) > 1)? 'Go to first page' : 'Apply Custom Limit';
	ne.addEventListener('click', function (e) {
		applyCustom(e, 0);
	});
	o.appendChild(ne);
	ne = document.createElement('span');
	ne.id = 'zol_XPerPage_Error';
	ne.style.color = '#F33';
	ne.style.display = 'none';
	ne.style.marginLeft = '6px';
	o.appendChild(ne);
}
if (document.readyState == 'loading' || document.readyState == 'uninitialized')
	window.addEventListener('DOMContentLoaded', init);
else
	init();
