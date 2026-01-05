// ==UserScript==
// @name		[Konachan] Pool: Fix Thumbnails
// @namespace	Zolxys
// @description	Fixes the slight cropping of thumbnails on the pool pages. Also prevents the hovered thumbnail from moving when shift is pressed on an image with borders.
// @include		/^https?://konachan\.com/pool/show/\d+/?($|\?|#)/
// @include		/^https?://konachan\.net/pool/show/\d+/?($|\?|#)/
// @version		2.0
// @downloadURL https://update.greasyfork.org/scripts/6057/%5BKonachan%5D%20Pool%3A%20Fix%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/6057/%5BKonachan%5D%20Pool%3A%20Fix%20Thumbnails.meta.js
// ==/UserScript==
var ss = document.createElement('style');
ss.type = 'text/css';
ss.textContent = 'img.preview {margin-top: 0;}';
document.head.appendChild(ss);
var a = document.getElementById('post-list-posts').getElementsByTagName('img');
for (var i = 0; i < a.length; i++) {
	var d = a[i].parentNode.parentNode;
	d.style.width='';
	d.style.height='';
}
document.getElementById('index-hover-overlay').firstElementChild.style.display = 'none';
