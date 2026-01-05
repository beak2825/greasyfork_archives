// ==UserScript==
// @name         nwanime script
// @namespace    http://www.nwanime.com/
// @version      0.1
// @description  lien video nwanime
// @author       You
// @match        http://www.nwanime.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6161/nwanime%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/6161/nwanime%20script.meta.js
// ==/UserScript==

$(".mirror-btns").append("<div class='mirror-btn'><a href='" + $("#video_mirrors a:contains('AuEngine')").attr('href')  + " '>Auengine</a></div>");
$(".mirror-btns").append("<div class='mirror-btn'><a href='" + $("#video_mirrors a:contains('mp4Upload')").attr('href')  + " '>mp4Upload</a></div>");
$(".mirror-btns").append("<div class='mirror-btn'><a href='#' onclick='window.open(\"" + $("#embed_holder iframe").attr('src') + "\", \"_blank\", \"modal=yes\")'>PopUp</a></div>");