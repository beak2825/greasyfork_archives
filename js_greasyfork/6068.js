// ==UserScript==
// @name		[Konachan / yande.re / LB] Forum Post: View in Parent
// @namespace	Zolxys
// @description	When viewing an individual forum post that has a parent, the "Parent" link at the bottom is changed to "View in parent".  This link takes you to the actual page the post you were viewing is on and then scrolls down to the post.
// @include		/^https?://konachan\.com/forum/show/\d+/?($|\?|#)/
// @include		/^https?://konachan\.net/forum/show/\d+/?($|\?|#)/
// @include		/^https?://yande\.re/forum/show/\d+/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/forum/show/\d+/?($|\?|#)/
// @version		2.2
// @downloadURL https://update.greasyfork.org/scripts/6068/%5BKonachan%20%20yandere%20%20LB%5D%20Forum%20Post%3A%20View%20in%20Parent.user.js
// @updateURL https://update.greasyfork.org/scripts/6068/%5BKonachan%20%20yandere%20%20LB%5D%20Forum%20Post%3A%20View%20in%20Parent.meta.js
// ==/UserScript==
function statusMessage(t, b = 0) {
	var o = document.getElementById('zol_ViewInParent');
	o.style.display = 'inline-block';
	if (b)
		o.textContent += '\n'+ t;
	else
		o.textContent = t;
	o.style.marginLeft = '';
	o.style.marginTop = '';
	var r = o.getBoundingClientRect();
	o.style.marginLeft = ((document.body.clientWidth - r.width)/2 - r.left) +'px';
	o.style.marginTop = (document.getElementById('zol_ViewInParentLink').getBoundingClientRect().top - r.bottom) +'px';
}
if (/^#c\d+$/.test(location.hash)) {
	a = document.getElementById('forum').getElementsByTagName('a');
	for (var i = 1; i < a.length; ++i)
		if (a[i].parentNode.tagName == "SPAN" && /^[^\/]+\/\/[^\/]+\/forum\/show\/\d+$/.test(a[i].href))
			a[i-1].id = 'c'+ parseInt(a[i].href.substr(a[i].href.lastIndexOf('/') + 1));
	location.hash = location.hash;
}
var pf = null, pt = null, pc = null, parent = null, target = null;
var page = document.createElement('iframe'); // Needs to be an iframe search by id
page.style.display = 'none';
document.body.appendChild(page); // contentWindow will be null if it's not in the document
var request = new XMLHttpRequest();
request.responseType = 'text';
var inProgress = false;
request.onreadystatechange = function() {
	if (this.readyState != 4 || this.status < 200)
		return;
	if (this.status == 504 || this.status == 408) {
		this.open('GET', this.responseURL, true);
		this.send();
		statusMessage('Timeout (Trying again)', true);
		return;
	}
	if (this.status == 429) {
		this.open('GET', this.responseURL, true);
		window.setTimeout(this.send, 10000);
		statusMessage('Rate limit hit (Trying again in 10 seconds)', true);
		return;
	}
	if (this.status >= 404) {
		statusMessage('Recieved 404 error for '+ this.responseURL);
		inProgress = false;
		return;
	}
	if (this.status >= 300) {
		statusMessage('Recieved unhandled error '+ this.status +': '+ this.statusText);
		inProgress = false;
		return;
	}
	page.contentWindow.document.body.innerHTML = this.responseText.replace(/src="/g, 'alt="');
	var first = 0, last = 0;
	var a = page.contentWindow.document.getElementById('forum').getElementsByTagName('a');
	for (var i = 1; i < a.length; ++i)
	 if (a[i].parentNode.tagName == "SPAN" && /^[^\/]+\/\/[^\/]+\/forum\/show\/\d+$/.test(a[i].href)) {
		var n = parseInt(a[i].href.substr(a[i].href.lastIndexOf('/') + 1));
		if (first == 0)
			first = n;
		last = n;
	}
	if (!first) {
		statusMessage('Parent forum page '+ pc +' is corrupt or it\'s format has changed.');
		inProgress = false;
		return;
	}
	if (first <= target && target <= last) {
		statusMessage('Page found. (Loading page '+ pc +' in forum #'+ parent +')');
		location.replace(location.protocol +'//'+ location.host +'/forum/show/'+ parent +'?page='+ pc +'#c'+ target);
	}
	else {
		if (!pt) {
			var p = page.contentWindow.document.getElementById('paginator').getElementsByTagName('a');
			for (var w = p.length - 1; w >= 0; --w)
			  if (/^\d+$/.test(p[w].innerHTML.trim())) {
				pt = parseInt(p[w].innerHTML.trim());
				break;
			}
			if (!pt) {
				statusMessage('Parent forum is corrupt or it\'s format has changed.');
				inProgress = false;
				return;
			}
			pf = 2;
		}
		else {
			if (target < first)
				pt = pc - 1;
			else
				pf = pc + 1;
		}
		if (pf < pt) {
			pc = Math.round((pf + pt) / 2);
			this.open('GET', location.protocol +'//'+ location.host +'/forum/show/'+ parent +'?page='+ pc, true);
			this.send();
			statusMessage('Locating page in forum #'+ parent +'. ('+ pf +'-'+ pt +')');
		}
		else if (pf == pt) {
			statusMessage('Page found. (Loading page '+ pf +' in forum #'+ parent +')');
			location.replace(location.protocol +'//'+ location.host +'/forum/show/'+ parent +'?page='+ pf +'#c'+ target);
		}
		else {
			statusMessage('Something\'s wrong...');
			inProgress = false;
		}
	}
}
var a = document.getElementById('subnavbar').getElementsByTagName('a');
for (var i = 0; i < a.length; ++i)
  if (a[i].innerHTML.trim() == 'Parent') {
	var r = /\/forum\/show\/(\d+)/.exec(a[i].href);
	if (!r)
		continue;
	parent = parseInt(r[1]);
	request.open('GET', location.protocol +'//'+ location.host +'/forum/show/'+ parent, true);
	a[i].addEventListener('click', function (e) {
		e.stopPropagation();
		e.preventDefault();
		var o = document.getElementById('zol_ViewInParent');
		if (inProgress)
			o.style.display = 'inline-block';
		else {
			inProgress = true;
			pf = 1
			pt = 0
			pc = 1
			request.send();
			if (o) {
				o.style.display = 'none';
				o.textContent = '';
			}
			else {
				var ne = document.createElement('div');
				ne.id = 'zol_ViewInParent';
				ne.className = 'submenu';
				ne.style.background = 'none repeat scroll 0 0 black';
				ne.style.border = '1px solid #666';
				ne.style.display = 'inline-block';
				ne.style.margin = 'auto';
				ne.style.padding = '3px 4px 5px';
				ne.style.position = 'absolute';
				ne.style.textAlign = 'left';
				ne.style.whiteSpace = 'pre';
				ne.style.zIndex = '1000';
				ne.addEventListener('click', function (e) {
					e.stopPropagation();
				});
				document.body.insertBefore(ne, document.body.firstChild);
				target = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
			}
			statusMessage('Locating page in forum #'+ parent +'. (1-??)');
		}
	});
	a[i].href = '#';
	a[i].textContent = 'View in parent';
	a[i].id = 'zol_ViewInParentLink';
	break;
}
