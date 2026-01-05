// ==UserScript==
// @author         Jerry Chong
// @name           Lowyat.net Cleaner
// @version        0.3
// @description    Cleans up Lowyat.net's ugly background images and advertisements
// @namespace      https://github.com/zanglang/lowyat
// @icon           https://forum.lowyat.net/favicon.ico
// @include        http*://forum.lowyat.net/*
// @downloadURL https://update.greasyfork.org/scripts/7780/Lowyatnet%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/7780/Lowyatnet%20Cleaner.meta.js
// ==/UserScript==

/*global unsafeWindow: true, GM_addStyle: true  */

GM_addStyle("body { background: url('http://images-cdn.lowyat.net/forum/default/light-tile.gif') repeat scroll 0 0 transparent !important; }\
div#logostrip,div[id^='ads'],div.avatar { display: none !important; }");
