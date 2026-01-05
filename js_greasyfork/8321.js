// ==UserScript==
// @name P站搜索页屏蔽
// @namespace 
// @version
// @description 愚蠢的屏蔽方式
// @include http://www.pixiv.net/search*
// @copyright lanee
// @grant GM_xmlhttpRequest
// @version 0.0.1.20150228164829
// @downloadURL https://update.greasyfork.org/scripts/8321/P%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/8321/P%E7%AB%99%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

var userid = document.querySelectorAll(".image-item .user");
var illust = document.querySelectorAll(".image-item");

for(i=0;i<userid.length;i++)
	if(userid[i].innerHTML.indexOf("顎守兎 agosto") != -1)
		illust[i].style.display = "none";