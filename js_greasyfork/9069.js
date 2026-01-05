// ==UserScript==
// @name        9gag NSFW censorship remover
// @description shows posts hidden under NSFW covers
// @include     *9gag.com*
// @grant       none
// @author	domodro
// @version 	1.2
// @namespace https://greasyfork.org/users/10283
// @downloadURL https://update.greasyfork.org/scripts/9069/9gag%20NSFW%20censorship%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/9069/9gag%20NSFW%20censorship%20remover.meta.js
// ==/UserScript==

// Changelog
// 1.0 - initial release
// 1.1 - added GIF handling, but script is quite slow
// 1.2 - improved initial loading, added removing nsfw when user changes gags by keyboard

var c = null;
var cHeight = 0;
var ve = [];

function removeChildren(e) {
	while(e.firstChild) {
		if (e.firstChild.firstChild) {
			removeChildren(e.firstChild);
		}
		e.removeChild(e.firstChild);
	}
}

function loadGIF(x) {
	var s1 = document.createElement('source');
	s1.setAttribute('src', 'http://img-9gag-ftw.9cache.com/photo/' + x + '_460sv.mp4');
	s1.setAttribute('type', 'video/mp4');
	
	var s2 = document.createElement('source');
	s2.setAttribute('src', 'http://img-9gag-ftw.9cache.com/photo/' + x + '_460svwm.webm');
	s2.setAttribute('type', 'video/webm');
	
	var e = document.createElement('div');
	e.setAttribute('class', 'badge-item-animated-img');
	
	var v = document.createElement('video');
	v.setAttribute('preload', 'auto');
	v.setAttribute('poster', 'http://img-9gag-ftw.9cache.com/photo/' + x +'_460s.jpg');
	v.setAttribute('loop', '');
	v.setAttribute('style', 'width: 600px;display:block;margin:0 auto;')
	v.setAttribute('autoplay', 'autoplay');
	v.appendChild(s1);
	v.appendChild(s2);
	v.appendChild(e);
	
	v.addEventListener('canplay', function() {
		if (ve[x] === undefined) {
			var d = document.createElement('div');
			d.setAttribute('class', 'badge-animated-container-animated post-view');
			d.setAttribute('data-image', 'http://img-9gag-ftw.9cache.com/photo/' + x + '_460sa.gif');
			d.setAttribute('data-mp4', 'http://img-9gag-ftw.9cache.com/photo/' + x + '_460sv.mp4');
			d.setAttribute('data-webm', 'http://img-9gag-ftw.9cache.com/photo/' + x + '_460svwm.webm');
			d.appendChild(this);

			var a = document.createElement('a');
			a.setAttribute('href', '/gag/' + x);
			a.setAttribute('class', 'badge-animated-cover badge-track badge-track-no-follow badge-auto-clicked');
			a.setAttribute('data-track', 'post,p,,,d,' + x + ',p');
			a.setAttribute('data-web-post', '1');
			a.setAttribute('style', 'min-height:600px');
			a.appendChild(d);
			
			var p = document.querySelector('article[data-entry-id=' + x + '] .post-container');
			
			if (window.location.href.indexOf('9gag.com/gag') <= -1) {
				v.setAttribute('preload', 'none');
				v.setAttribute('style', 'min-height:275px;width: 500px;');
				v.setAttribute('width', '500');
				v.removeAttribute('autoplay');
				d.setAttribute('class', 'badge-animated-container-animated');
				a.setAttribute('class', 'badge-animated-cover badge-track badge-track-no-follow');
				a.setAttribute('style', 'min-height:275px;');
			}
			removeChildren(p);
			p.appendChild(a);
			
			p.setAttribute('style', 'height:' + d.offsetHeight + 'px;');
			
			ve[x] = 0;
		}
	});
	
	v.load();
}

function loadImage(x) {
	var i = document.createElement('img');
	i.setAttribute('class', 'badge-item-img');
	i.setAttribute('src', 'http://img-9gag-ftw.9cache.com/photo/' + x + '_700b.jpg');
	i.setAttribute('alt', 'NSFW');

	var a = document.createElement('a');
	if (window.location.href.indexOf('9gag.com/gag') > -1) {
		a.setAttribute('href', 'javascript: void(0);');
		a.setAttribute('class', 'badge-post-zoom zoomable');

	} else {
		a.setAttribute('href', '/gag/' + x);
		a.setAttribute('class', 'badge-evt badge-track badge-track-no-follow');
		a.setAttribute('data-evt', 'EntryAction,EntryImageRedirect,ListPage');
		a.setAttribute('target', '_blank');
	}

	a.appendChild(i);
	document.querySelector('article[data-entry-id=' + x + '] .post-container').appendChild(a);
	
	return a;
}

function removeNsfw() {
	var l = document.getElementsByClassName('badge-nsfw-entry-cover');
	for (var i=0; i<l.length; ++i) {
		var p = l[i].parentNode;

		var x = l[i].getAttribute('href').replace(/^.*\/(.*)$/, "$1");

		p.removeChild(l[i]);

		loadGIF(x);		
		loadImage(x);
	}
}

function onLoad() {
	c = document.getElementsByClassName('badge-entry-collection')[0];
	cHeight = c.offsetHeight;
	removeNsfw();
}


if (window.location.href.indexOf('9gag.com/gag') <= -1) {
	window.addEventListener('load', function() {
		onLoad();
		setTimeout(onLoad, 1000);
	});

	window.addEventListener('scroll', function() {
		if (c.offsetHeight != cHeight) {
			cHeight = c.offsetHeight;
			removeNsfw();
		}
	});
} else {
	removeNsfw();

	var observer = new MutationObserver(function(ms) {
	  ms.forEach(function() {
		removeNsfw();
	  });
	});

	observer.observe(document.querySelector('.badge-post-container'), {childList: true});
}
