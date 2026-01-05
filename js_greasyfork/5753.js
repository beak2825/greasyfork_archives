// ==UserScript==
// @name           clinton
// @namespace      bruh
// @description    Turns clinton into an emoji
// @include        *twitter.com/*
// @version        1.0
// @grant       none
// DETAILS: This script is a really shitty hack coming from https://greasyfork.org/es/scripts/1033-neogaf-fuuuuuuu-smilies/code
// @downloadURL https://update.greasyfork.org/scripts/5753/clinton.user.js
// @updateURL https://update.greasyfork.org/scripts/5753/clinton.meta.js
// ==/UserScript==

var BRUH = {
	nodes : document.evaluate("//div[contains(@class, 'ProfileTweet-contents')]//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null),
	l : 'http://i.imgur.com/T38lru2.jpgj',
	d : 'http://i.imgur.com/T38lru2.jpg',
	replace : function(){
		var i = this.nodes.snapshotLength, t;
		while(i--){
			t = this.nodes.snapshotItem(i);
			t.data = t.data.replace(/(?:\:bill|\:D)\b/gi, function($1){
				var m = document.createElement('img');
				m.src = $1.toLowerCase() === ':bill:' ? BRUH.l : BRUH.d;
				t.parentNode.insertBefore(m, t.nextSibling);
				return '';
			});
		}
	}
};

BRUH.replace();