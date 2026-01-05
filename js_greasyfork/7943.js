// ==UserScript==
// @name        Kindleren Redirector
// @author       M.ZH
// @namespace   http://kandouren.com/home.php?mod=space&uid=542029
// @description Kindle人旧域名自动重定向到新域名Kandouren.com；Redirect Kindleren.com to it new site: Kandouren.com
// @version     1
// @include 	*
// @grant       none
// @icon        http://is.gd/NJSkJ9
// @downloadURL https://update.greasyfork.org/scripts/7943/Kindleren%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/7943/Kindleren%20Redirector.meta.js
// ==/UserScript==

links = document.querySelectorAll("a");

for(i = 0; i < links.length; i++) {
	li = links[i];
	if(li.href.match(/https*:\/*kindleren\.com/) != null) {
		//Change href
		li.href = li.href.replace("kindleren.com", "kandouren.com");
		if(li.innerHTML.match(/https*:\/*kindleren\.com/) != null) {
			//Change display
			li.innerHTML = li.innerHTML.replace("kindleren.com", "kandouren.com");
			}
		}
	}