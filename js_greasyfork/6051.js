// ==UserScript==
// @name        WaniKani ALC
// @namespace   wanikani
// @description Adds a link to the alc.co.jp results to vocab pages
// @include     http*.wanikani.com/vocabulary/*
// @include     http*.wanikani.com/level/*/vocabulary/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6051/WaniKani%20ALC.user.js
// @updateURL https://update.greasyfork.org/scripts/6051/WaniKani%20ALC.meta.js
// ==/UserScript==

var vocab = document.getElementsByClassName('vocabulary-icon')[0].firstChild.innerHTML;
var url = 'http://eow.alc.co.jp/search?q=' + encodeURIComponent(vocab) + '&ref=sa';
var info = document.getElementsByClassName('page-list')[0].getElementsByTagName('ul')[0];
var alc = document.createElement('li');
alc.innerHTML = '<a href="' + url + '">alc.co.jp</a>';
info.appendChild(alc);