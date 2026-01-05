// ==UserScript==
// @name		[Konachan] Wiki: Tag Links
// @namespace	Zolxys
// @description	Adds "Edit Tag" and "Tag History" Links to the footer on the wiki pages.  The links are also added to the artist creation page if there's a name in the url.
// @include		/^https?://konachan\.com/(wiki/show|artist/create)\?/
// @include		/^https?://konachan\.net/(wiki/show|artist/create)\?/
// @version		2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6064/%5BKonachan%5D%20Wiki%3A%20Tag%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/6064/%5BKonachan%5D%20Wiki%3A%20Tag%20Links.meta.js
// ==/UserScript==
var t = /[\?&](title|name)=([^&]+)(&|$)/.exec(location.search);
if (t == null)
	return;
t = t[2];
var r = new XMLHttpRequest();
r.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var v = JSON.parse(this.responseText);
		for (; v[0].name != decodeURIComponent(t); v.shift())
			if (v.length == 0)
				return;
		var o = document.getElementById('content').firstElementChild;
		while (o != null) {
			if (o.nodeName == 'DIV' && o.className == 'footer') {
				var l = o.firstElementChild
				if (l.nodeName == 'UL') {
					var ne = document.createElement('div');
					ne.className = 'footer';
					ne.style.clear = 'both';
					o.parentNode.insertBefore(ne,o);
					o = ne;
					ne.appendChild(document.createElement('br'));
				}
				else if (l.nodeName != 'A')
					return;
				var p, a = o.getElementsByTagName('A');
				if (a.length == 0)
					p = o.firstChild;
				else {
					p = a[a.length - 1];
					if (/^[^#]+\?([^#]+&)?version=\d+($|&)/.test(p.href))
						p = p.previousElementSibling;
					p = p.nextSibling;
					o.insertBefore(document.createTextNode(' | '),p);
				}
				ne = document.createElement('a');
				ne.textContent = 'Edit Tag';
				ne.href = '/tag/edit/'+ v[0].id;
				o.insertBefore(ne,p);
				o.insertBefore(document.createTextNode(' | '),p);
				ne = document.createElement('a');
				ne.textContent = 'Tag History';
				ne.href = '/history?search=tag:'+ v[0].id;
				o.insertBefore(ne,p);
				break;
			}
			o = o.nextElementSibling;
		}
	}
}
r.open('GET', location.protocol +'//'+ location.host + '/tag.json?limit=0&name='+ t, true);
r.send();
