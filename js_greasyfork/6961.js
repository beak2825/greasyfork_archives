// ==UserScript==
// @name        chatlogs.jabber.ru cleaner
// @description Очищает логи chatlogs.jabber.ru от "входов" и "выходов"
// @include     http://chatlogs.jabber.ru/*
// @grant       none
// @version 0.0.1.20141212215350
// @namespace https://greasyfork.org/users/7568
// @downloadURL https://update.greasyfork.org/scripts/6961/chatlogsjabberru%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/6961/chatlogsjabberru%20cleaner.meta.js
// ==/UserScript==

var links = document.getElementsByTagName("font");
for (var i=0; i<links.length; i++) {
 links[i].innerHTML = links[i].innerHTML.replace(/^.*в(о|ы)ш(е|ё)л\(а\) (в|из) комнат(у|ы).*$/i,"");
}