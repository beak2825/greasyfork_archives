// ==UserScript==
// @name           Last.fm User Levels
// @namespace      https://github.com/Row/lastfm-userscripts
// @description    Add Last.fm User Level ( http://stas.sh/lastfm/ ) to every last.fm profile you visit.
// @version        1.2
// @match          https://www.last.fm/user/*
// @match          https://www.lastfm.*/user/*
// @match          https://cn.last.fm/user/*
// @downloadURL https://update.greasyfork.org/scripts/5882/Lastfm%20User%20Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/5882/Lastfm%20User%20Levels.meta.js
// ==/UserScript==

var insertPoint = document.querySelector('.col-sidebar');

if(insertPoint) {
    var imgUrl   = 'http://stas.sh/lastfm/pic.php?username=';
    var link     = document.createElement('a');
    var userName = document.querySelector('.avatar').getAttribute('alt');
    link.setAttribute('href', 'http://stas.sh/lastfm/');
    link.innerHTML = '<img src="' + imgUrl + userName + '" style="margin-left: -331px; position: absolute;" />'
    insertPoint.insertBefore(link, insertPoint.firstChild);
}
