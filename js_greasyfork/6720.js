// ==UserScript==
// @name		[Konachan / yande.re] Images: Remove Tags from Filenames
// @namespace	Zolxys
// @description	Removes the tags from filenames for all images and image links. The resulting filnames will still contain the site and post #.
// @include		/^https?://konachan\.(com|net)//
// @include		/^https?://yande\.re//
// @exclude		/\.(jpg|png|gif)$/
// @version		1.0
// @downloadURL https://update.greasyfork.org/scripts/6720/%5BKonachan%20%20yandere%5D%20Images%3A%20Remove%20Tags%20from%20Filenames.user.js
// @updateURL https://update.greasyfork.org/scripts/6720/%5BKonachan%20%20yandere%5D%20Images%3A%20Remove%20Tags%20from%20Filenames.meta.js
// ==/UserScript==
var rx = /(https?:\/\/[^\/]+\/(image|jpeg)\/[^\/]+\/[^\/?#]+?(%20| )(?:-%20|- )?\d+)(?=\D)[^\/?#]*(\.\w+($|\?|#))/;
function removeTags(u) {
	var r = rx.exec(u);
	if (r)
		return r[1] + ((r[2] == 'jpeg')? r[3] +'jpeg' : '') + r[4];
	return u;
}
if (/\/post\/show\/\d+($|\/)/.test(location.pathname)) {
	var o = document.getElementById('image');
	if (o)
		o.src = removeTags(o.src);
	if (o = document.getElementById('highres-show'))
		o.href = removeTags(o.href);
	if (o = document.getElementById('highres'))
		o.href = removeTags(o.href);
	if (o = document.getElementById('png'))
		o.href = removeTags(o.href);
}
var a = document.getElementsByTagName('li'); // Searches from document instead of id 'post-list-posts' because that id occurs multiple times on the profile page.
for (var i = 0; i < a.length; ++i) {
	if (!/^p\d+$/.test(a[i].id))
		continue;
	if (!/(^|\s)creator-id-\d+(\s|$)/.test(a[i].className))
		continue;
	var l = a[i].getElementsByTagName('a');
	for (var p = 0; p < l.length; ++p)
		if (/(^|\s)directlink(\s|$)/.test(l[p].className))
			l[p].href = removeTags(l[p].href);
}
var f = String(function(){
	var zolx = STRING_rx;
	for (var zoli in Post.posts._object) {
		var zolo = Post.posts._object[zoli];
		var zoll = ['file_url', 'jpeg_url', 'sample_url'];
		for (var zolp = 0; zolp < zoll.length; ++zolp) {
			if (zolr = zolx.exec(zolo[zoll[zolp]]))
				zolo[zoll[zolp]] = zolr[1] + ((zolr[2] == 'jpeg')? zolr[3] +'jpeg' : '') + zolr[4];
		}
	}
});
var ne = document.createElement('script');
ne.setAttribute('type','text/javascript');
ne.innerHTML=f.substring(f.indexOf('\n') + 1, f.lastIndexOf('}')).replace('STRING_rx', String(rx));
	document.head.appendChild(ne);
