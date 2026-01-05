// ==UserScript==
// @name        forum.israpda.com
// @namespace   http://forum.israpda.com/
// @include     http://forum.israpda.com/*
// @include     https://forum.israpda.com/*
// @author      benipaz
// @version     3.2
// @description Add link to unread posts page on every page.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6694/forumisrapdacom.user.js
// @updateURL https://update.greasyfork.org/scripts/6694/forumisrapdacom.meta.js
// ==/UserScript==

var para = document.createElement("p");
var link = document.createElement('a');
	link.href = './search.php?search_id=unreadposts';
	link.appendChild(document.createTextNode('Непрочитанные сообщения'));
//	link.style.fontSize = '150%';
para.appendChild(link);

element = document.getElementsByClassName("crumb")[0];
element.appendChild(para);

element = document.getElementsByClassName("panel")[0];
element.appendChild(para);