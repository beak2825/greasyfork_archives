// ==UserScript==

// @name           What.CD Neutral-leech Browser
// @namespace      https://what.cd
// @description    Inserts a neutral-leech browse link in main menu. Groups torrents.
// @include        http://what.cd/*
// @include        https://what.cd/*
// @include        https://ssl.what.cd/*
// @version        1.0
// @date           2015-1-23

// @downloadURL https://update.greasyfork.org/scripts/7681/WhatCD%20Neutral-leech%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/7681/WhatCD%20Neutral-leech%20Browser.meta.js
// ==/UserScript==



function createLi(x,y) {
	var li = document.createElement('li');
	li.id = 'nav_' + x;
	li.appendChild(y);
	return li;
}
function createNL(x) {
	var a = document.createElement('a');

	a.innerHTML = x;
	a.href = "https://what.cd/torrents.php?freetorrent=2&order_by=time&order_way=desc&group_results=1&action=advanced&searchsubmit=1";
	return a;
}

var target = document.getElementById('menu').getElementsByTagName('ul')[0];


var neutral = createNL("Neutral");
var neutralLi = createLi("Neutral",neutral);

target.appendChild(neutralLi);