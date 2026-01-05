// ==UserScript==
// @name        谷歌学术https
// @namespace   https://github.com/vovict
// @description 将谷歌搜索得到的http谷歌学术链接改写为https
// @include     https://www.google.com/*
// @version     1.0
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/9584/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AFhttps.user.js
// @updateURL https://update.greasyfork.org/scripts/9584/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AFhttps.meta.js
// ==/UserScript==

//location.href.replace(/^http:/, 'https:');

var topstuff = document.getElementById("topstuff");
//alert(topstuff);
var scholarlink = topstuff.getElementsByTagName("a");
//alert(scholarlink.length);

scholarlink[2].href  = scholarlink[2].href.replace(/^http:/, 'https:');

// for (var i=3;i<scholarlink.length;i++)
// {
	// //if (i==4)
		// alert(scholarlink[i].href);
	
	// rawlink  = scholarlink[i].href.split('url=')[1];
	// rawlink  = rawlink.split('&hl=')[0]
	// scholarlink[i].href = rawlink;
// }