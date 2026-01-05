// ==UserScript==
// @name		[Konachan] Tagging: Verify Tags
// @namespace	Zolxys
// @description	Adds "Verify tags" to the tags utility bar on the upload and post pages.  Clicking "Verify tags" moves any tags not in use on the site to a separate textbox.  Moved tags will be ignored on submission.
// @include		/^https?://konachan\.(com|net)/post/(upload/?($|\?|#)|show/\d+($|[/?#]))/
// @version		1.4
// @downloadURL https://update.greasyfork.org/scripts/6062/%5BKonachan%5D%20Tagging%3A%20Verify%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/6062/%5BKonachan%5D%20Tagging%3A%20Verify%20Tags.meta.js
// ==/UserScript==
var o = document.getElementById('post_tags');
var ne = document.createElement('div');
ne.id = ('zol_unused_tags_d');
ne.style.display = 'none';
ne.textContent = 'Unused Tags:';
o.parentNode.insertBefore(ne,o.nextSibling);
o = o.cloneNode(false);
o.id = ('zol_unused_tags');
o.name = o.id;
ne.appendChild(o);
o = ne.parentNode;
ne = document.createElement('script');
ne.setAttribute('type','text/javascript');
ne.innerHTML = String(function zol_verify_tags(){
	if (!TagCompletion.loaded) {
		TagCompletion.load_data(zol_verify_tags);
		return;
	}
	var t = document.getElementById('post_tags')
	var u = document.getElementById('zol_unused_tags');
	var a = t.value.toLowerCase().replace(/[,;`]/g,'').split(/[\s]/);
	t.value = '';
	for (var i = 0; i < a.length; ++i) {
		if (a[i] == '')
			continue;
		if (/^((char(acter)?|artist|copy(right)?):.+)?$/.test(a[i]) || TagCompletion.tag_data.indexOf('`'+ a[i] +'`') != -1)
			t.value += a[i] +' ';
		else
			u.value += ' '+ a[i];
	}
	document.getElementById('zol_unused_tags_d').style.display = '';
});
document.head.appendChild(ne);
o.appendChild(document.createTextNode(' | '));
ne = document.createElement('a');
ne.textContent = 'Verify tags';
//ne.setAttribute('onclick','zol_verify_tags(); return false;');
ne.href = 'javascript:zol_verify_tags();';
o.appendChild(ne);
