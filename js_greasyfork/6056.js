// ==UserScript==
// @name		[Konachan / yande.re / LB] History: Show Thumbnails for Deleted Posts
// @namespace	Zolxys
// @description	Disables the hiding of thumbnails for deleted posts on the history pages.
// @include		/^https?://konachan\.com/history/?($|\?|#)/
// @include		/^https?://konachan\.net/history/?($|\?|#)/
// @include		/^https?://yande\.re/history/?($|\?|#)/
// @include		/^https?://lolibooru\.moe/history/?($|\?|#)/
// @version		1.1
// @downloadURL https://update.greasyfork.org/scripts/6056/%5BKonachan%20%20yandere%20%20LB%5D%20History%3A%20Show%20Thumbnails%20for%20Deleted%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/6056/%5BKonachan%20%20yandere%20%20LB%5D%20History%3A%20Show%20Thumbnails%20for%20Deleted%20Posts.meta.js
// ==/UserScript==
window.zolhistdelimg = [];
for (var i in window.Post.posts._object) {
	var o = window.Post.posts._object[i];
	if (/deleted-preview\.png$/.test(o.preview_url)) {
		var u = location.protocol +'//'+ location.host +'/data/preview/'+ o.md5.substr(0,2) +'/'+ o.md5.substr(2,2) +'/'+ o.md5 + '.jpg';
		o.preview_url = u;
		zolhistdelimg.push(document.createElement('img'));
		zolhistdelimg[zolhistdelimg.length - 1].src = u;
	}
}
