// ==UserScript==
// @name		[Konachan] Thumbnails: Multicolored Image Borders
// @namespace	Zolxys
// @description	Shows multicolored borders on thumbnails when more than one color is applicable.
// @include		/^https?://konachan\.com/(post(/(similar|delete)(/\d+)?)?|(user|pool)/show/\d+|wiki/show)/?($|\?|#)/
// @include		/^https?://konachan\.net/(post(/(similar|delete)(/\d+)?)?|(user|pool)/show/\d+|wiki/show)/?($|\?|#)/
// @version		1.4
// @downloadURL https://update.greasyfork.org/scripts/6063/%5BKonachan%5D%20Thumbnails%3A%20Multicolored%20Image%20Borders.user.js
// @updateURL https://update.greasyfork.org/scripts/6063/%5BKonachan%5D%20Thumbnails%3A%20Multicolored%20Image%20Borders.meta.js
// ==/UserScript==
var ss = document.createElement('style');
ss.type = 'text/css';
ss.textContent = 'img.has-children {border-top: 3px solid #00FF00;}\n'+
'img.has-parent {border-top: 3px solid #CCCC00; border-right: 3px solid #CCCC00; border-left: 3px solid #CCCC00;}\n'+
'img.has-children {border-left: 3px solid #00FF00; border-bottom: 3px solid #00FF00;}\n'+
'img.flagged {border-right: 3px solid #FF0000; border-bottom: 3px solid #FF0000;}\n'+
'img.pending {border-right: 3px solid #0000FF; border-bottom: 3px solid #0000FF;}';
document.head.appendChild(ss);
