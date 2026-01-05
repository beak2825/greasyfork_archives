// ==UserScript==
// @name           Shutup.css
// @namespace      http://stevenf.com/shutupcss/
// @description    Hide comments from different sites
// @include        http*
// @exclude        *://greasyfork.org/forum/*
// @exclude        *://greasyfork.org/*/code
// @version        0.0.31
// @downloadURL https://update.greasyfork.org/scripts/847/Shutupcss.user.js
// @updateURL https://update.greasyfork.org/scripts/847/Shutupcss.meta.js
// ==/UserScript==

var link=document.createElement("link");
link.setAttribute("rel","stylesheet");
link.setAttribute("type","text/css");
link.setAttribute("href","https://rickyromero.com/shutup/updates/shutup.css");
var head=document.getElementsByTagName("head")[0];
head.appendChild(link);