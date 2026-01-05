// ==UserScript==
// @id             Brokenstones-add-version
// @name           Brokenstones : Add Version
// @version        1.0
// @author         a
// @description    Add Version links appear torrents.php
// @include        http*://*brokenstones.me/torrents.php*
// @namespace https://greasyfork.org/users/6235
// @downloadURL https://update.greasyfork.org/scripts/5947/Brokenstones%20%3A%20Add%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/5947/Brokenstones%20%3A%20Add%20Version.meta.js
// ==/UserScript==

var gm_better = {
	path:document.location.pathname.substring(1).replace('.php',''),
	route:function(){
		var p;
		switch(this.path){
			case 'torrents': p = '.group a[href^="torrents.php?id="]'; break;
			default: return false;
		}
		this.a = document.querySelectorAll(p);
		this.go();
	},
	go:function(){
		var a, p, i = this.a.length, l, f, s;
		while(i--){
			a = this.a[i];
			if(/id\=(\d+)/.test(a.href)){
				p = a.parentNode;
				f = document.createDocumentFragment();
				l = document.createElement('a');
				l.href = '/upload.php?groupid='+RegExp.lastParen;
				l.textContent = 'Add Version';
				l.title = 'Add Version';
				f.appendChild(document.createTextNode(' ['));
				f.appendChild(l);
				f.appendChild(document.createTextNode(']'));
				s = this.path === 'torrents' ? a.nextElementSibling : a.nextElementSibling.nextElementSibling;
				p.insertBefore(f,s);
			}
		}
	}
};

gm_better.route();