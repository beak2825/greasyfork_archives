// ==UserScript==
// @name		[Konachan / yande.re] Thumbnails: Fix Highres Link
// @namespace	Zolxys
// @description	*Does not work on wiki pages* (1) Changes the links below thumbnails to link to the original PNG instead of the highres JPEG. • (2) Changes the image size shown below thumbnails to the size of the original PNG which can be different for large images.
// @include		/^https?://konachan\.com/(post(/similar(/\d+)?)?|user/show/\d+)/?($|\?|#)/
// @include		/^https?://konachan\.net/(post(/similar(/\d+)?)?|user/show/\d+)/?($|\?|#)/
// @include		/^https?://yande\.re/(post(/similar(/\d+)?)?|user/show/\d+)/?($|\?|#)/
// @version		1.3
// @downloadURL https://update.greasyfork.org/scripts/6073/%5BKonachan%20%20yandere%5D%20Thumbnails%3A%20Fix%20Highres%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/6073/%5BKonachan%20%20yandere%5D%20Thumbnails%3A%20Fix%20Highres%20Link.meta.js
// ==/UserScript==
if (document.getElementById('post-list-posts') == null)
	return;
var a = document.getElementsByTagName('li'); // Searches from document instead of id 'post-list-posts' because that id occurs multiple times on the profile page.
for (var i = 0; i < a.length; ++i) {
	if (!/^p\d+$/.test(a[i].id))
		continue;
	if (!/(^|\s)creator-id-\d+(\s|$)/.test(a[i].className))
		continue;
	var n = parseInt(a[i].id.substr(1));
	var s = a[i].getElementsByTagName('span');
	for (var p = 0; p < s.length; ++p) 
	  if (s[p].childElementCount == 0 && /(^|\s)directlink-res(\s|$)/.test(s[p].className)) {
		s[p].textContent = window.Post.posts._object[n].width +' × '+ window.Post.posts._object[n].height;
		if (s[p].parentNode.nodeName != 'A')
			continue;
		s[p].parentNode.href = window.Post.posts._object[n].file_url;
	}
}
