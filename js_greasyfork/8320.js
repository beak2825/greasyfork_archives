// ==UserScript==
// @name Bilibili Raw-YGO Hider
// @namespace 
// @version 0.5
// @description 生肉隐藏；各种隐藏= =
// @include *://www.bilibili.com/video/bangumi-two-*.html*
// @include *://www.bilibili.com/video/soap-three-*.html*
// @include *://www.bilibili.com/video/ent-food-*.html*
// @include *://search.bilibili.com/*
// @include *://www.bilibili.com/v/anime/*
// @copyright 
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8320/Bilibili%20Raw-YGO%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/8320/Bilibili%20Raw-YGO%20Hider.meta.js
// ==/UserScript==

document.addEventListener('DOMNodeInserted',scan,false);
function scan(){
	var title = document.querySelectorAll("ul.vd-list.mod-1 li .r a.title");
	var listl1 = document.querySelectorAll("ul.vd-list.mod-1 li");
	var filter = /(生肉|游戏王|木下|密子君|吃播|大胃王|晨间剧|FIX字幕侠)/;

	for(i=0;i<title.length;i++) {
		if(filter.test(title[i].innerHTML)) {
			listl1[i].remove();
		}	
    }
}