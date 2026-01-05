// ==UserScript==
// @name           Filmtipset copy & paste field for filmtipset forum
// @namespace      https://github.com/Row/filmtipset-userscripts
// @description    Adds a input field on each movie page with link code for the forum.
// @version        0.1.1
// @include        http://www.filmtipset.se/film/*
// @downloadURL https://update.greasyfork.org/scripts/5876/Filmtipset%20copy%20%20paste%20field%20for%20filmtipset%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/5876/Filmtipset%20copy%20%20paste%20field%20for%20filmtipset%20forum.meta.js
// ==/UserScript==

var xpath = '//a[contains(@href,"report_bad_info.cgi")]/..';
var boxLocation = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
var title = document.getElementsByTagName('h1')[0].innerHTML;
var input = document.createElement('input');
input.value = '[url]' + title + '|' + document.location.href.replace(/\.html.+$/,'.html') + '[/url]';
input.style.width = '100%';
var txt = document.createTextNode('Länkkod för forum');
boxLocation.parentNode.insertBefore(txt, boxLocation);
boxLocation.parentNode.insertBefore(input, boxLocation);