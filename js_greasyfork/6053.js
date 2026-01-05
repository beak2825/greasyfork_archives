// ==UserScript==
// @name		[Konachan] Forum: Expandable Last Page
// @namespace	Zolxys
// @description	When using the "last" links: Allows prepending of previous pages and automatically appends the next page if it exists. // Redirects to the last page if the specified page doesn't exist.
// @include		/^https?://konachan\.(com|net)/forum/
// @version		2.0
// @downloadURL https://update.greasyfork.org/scripts/6053/%5BKonachan%5D%20Forum%3A%20Expandable%20Last%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/6053/%5BKonachan%5D%20Forum%3A%20Expandable%20Last%20Page.meta.js
// ==/UserScript==
/*
if (/^\/forum\/show\//.test(location.pathname)) {
	var n = document.getElementById('paginator');
	if (n.getElementsByTagName('em').length == 0) {
		var a = n.getElementsByTagName('a');
		if (a.length > 0)
			location.replace(a[a.length - 1].href);
	}
	else if (/^#lastpage$/.test(location.hash)) {
		var a = n.getElementsByTagName('a');
		for (var i = a.length - 1; i > 0; --i)
		  if (/^\d+$/.test(a[i].innerHTML.trim())) {
			var r = /[\?&]page=(\d+)(&|$)/.exec(location.search);
			var p = ((r == null)? 1 : parseInt(r[1]));
			if (p < parseInt(a[i].innerHTML.trim())) {
				location.replace(a[i].href);
				return;
			}
			break;
		}
		location.replace(location.protocol +'//'+ location.host + location.pathname + location.search);
	}
}
else {
	var a = document.getElementById('forum').getElementsByTagName('table')[0].getElementsByTagName('a');
	for (var i = 0; i < a.length; ++i)
		if (/\/forum\/show\/\d+\?page=\d+$/.test(a[i].href))
			a[i].href += '#lastpage';
}
/*/
if (/^\/forum\/show\//.test(location.pathname)) {
	var n = document.getElementById('paginator');
	if (n.getElementsByTagName('em').length == 0) {
		var a = n.getElementsByTagName('a');
		if (a.length > 0)
			location.replace(a[a.length - 1].href +'#lastpage');
		return;
	}
	if (!/^#lastpage$/.test(location.hash))
		return;
	var l = 0;
	var a = n.getElementsByTagName('a')
	for (var i = a.length - 1; i > 0; --i)
		if (/^\d+$/.test(a[i].innerHTML.trim())) {
			l = parseInt(a[i].innerHTML.trim());
			break;
	}
	if (l == 0)
		return;
	var f=String(function(){
		var zolr = /[\?&]page=(\d+)(&|$)/.exec(location.search);
		var zolforum = {r:new XMLHttpRequest(), add:null, d:document.createElement('div'), a:[], c:((zolr == null)? 1 : parseInt(zolr[1])), l:REPLACE.l, s:0, e:0}
		if (zolforum.l < zolforum.c)
			zolforum.l = zolforum.c;
		zolforum.s = zolforum.e = zolforum.c;
		zolforum.d.style.display = 'none';
		document.body.appendChild(zolforum.d);
		zolforum.r.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var t = document.getElementById('forum');
				zolforum.d.innerHTML = this.responseText;
				t.id = '';
				var ne = document.getElementById('forum');
				t.id = 'forum';
				ne.id = 'zolforum'+ zolforum.a[0];
				var ee = document.getElementById('zolpage'+ zolforum.a[0]);
				ee.parentNode.insertBefore(ne,ee.nextSibling);
				zolforum.d.innerHTML = '';
				if (zolforum.a[0] == zolforum.s)
					document.getElementById('zolpage'+(zolforum.s+1)).scrollIntoView(false);
				for (var a = document.getElementById('paginator').getElementsByTagName('a'), i = a.length-1; i >= 0; --i)
				  if (parseInt(a[i].innerHTML.trim()) == zolforum.a[0]) {
					a[i].style.color = '#40FF20';
					break;
				}
				ee.textContent = '-- Page '+zolforum.a.shift()+' --';
				ee.style.marginLeft = '12em';
				ee.style.color = '#40FF20';
				if (zolforum.a.length > 0) {
					this.open('GET', location.pathname +'?page='+ zolforum.a[0], true);
					this.send();
				}
			}
		}
		zolforum.add = function(next) {
			var p = (next)? zolforum.e + 1 : zolforum.s - 1;
			if (zolforum.a.indexOf(p + 1) == -1) {
				zolforum.a.push(p);
				if (next)
					zolforum.e = p;
				else
					zolforum.s = p;
				var ne, ee = document.getElementById('forum');
				if (p == zolforum.c-1) {
					ne = document.createElement('a');
					ne.id = 'zolpage'+zolforum.c;
					ne.style.color = '#40FF20';
					ne.style.fontSize = '16px';
					ne.style.clear = 'both';
					ne.style.display = 'block';
					ne.style.marginLeft = '12em';
					ne.textContent = '-- Current Page ('+zolforum.c+') --';
					ee.insertBefore(ne,ee.childNodes[0]);
				}
				ne = document.createElement('a');
				ne.id = 'zolpage'+p;
				ne.style.color = '#FF4020';
				ne.style.fontSize = '16px';
				ne.style.clear = 'both';
				ne.style.display = 'block';
				ne.textContent = 'Page '+p+' - Loading...';
				ne.href = location.pathname +'?page='+p;
				if (next)
					ee.appendChild(ne);
				else
					ee.insertBefore(ne,ee.childNodes[0]);
			}
			if ((zolforum.r.readyState & 3) == 0) {
				zolforum.r.open('GET', location.pathname +'?page='+ zolforum.a[0], true);
				zolforum.r.send();
			}
		}
		if (zolforum.c < zolforum.l)
			zolforum.add(true);
	});
	var ne = document.createElement('script');
	ne.setAttribute('type','text/javascript');
	ne.innerHTML = f.substring(f.indexOf('\n')+1, f.lastIndexOf('}')).replace('REPLACE.l', l);
	document.head.appendChild(ne);
	var ee = document.getElementById('forum');
	ne = document.createElement('div');
	ee.id = 'zolforum'+(zolforum.c);
	ne.id = 'forum';
	ne.className = 'response-list'
	ee.parentNode.insertBefore(ne,ee);
	ne.appendChild(ee);
	ee = ne;
	ne = document.createElement('a');
	ne.id = 'zoladdprev';
	ne.href = "javascript:{zolforum.add(false);}";
	ee.parentNode.insertBefore(ne,ee);
	ee = ne;
	ne = document.createElement('div');
	ne.style.opacity = '.001';
	ne.style.width = '40em';
	ne.style.marginLeft = '5em';
	ne.style.height = '13px';
	ne.style.marginTop = '-15px';
	ne.style.border = '1px solid #808080';
	ne.style.textAlign = 'center';
	ne.innerHTML = '^ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ^ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ^';
	ne.onmouseover = function(){this.style.opacity = '.8';}
	ne.onmouseout = function(){this.style.opacity = '.001';};
	ee.appendChild(ne);
}
else {
	var a = document.getElementById('forum').getElementsByTagName('table')[0].getElementsByTagName('a');
	for (var i = 0; i < a.length; ++i)
		if (/\/forum\/show\/\d+\?page=\d+$/.test(a[i].href))
			a[i].href += '#lastpage';
}
//*/
