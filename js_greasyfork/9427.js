// ==UserScript==
// @name           Tatoeba Remove Sentence Links
// @namespace      Jakob V. <jakov@gmx.at>
// @description	   Removes the links from the sentences for easier copying. Use the icons instead. (beta version, may cause bugs!)
// @include        http://tatoeba.org/*
// @match          http://tatoeba.org/*
// @require        http://code.jquery.com/jquery-1.7.js
// @version 0.0.1.20150423133717
// @downloadURL https://update.greasyfork.org/scripts/9427/Tatoeba%20Remove%20Sentence%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/9427/Tatoeba%20Remove%20Sentence%20Links.meta.js
// ==/UserScript==
//
$(document).ready(main);

function main() {
	$('.sentenceContent a').removeAttr('href');
}