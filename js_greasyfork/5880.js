// ==UserScript==
// @name           LAST.FM Color Visited Links
// @namespace      https://github.com/Row/lastfm-userscripts
// @description    LAST.FM Color Visited Links with grey
// @match          https://www.last.fm/*
// @match          https://www.lastfm.*/*
// @match          https://cn.last.fm/*
// @version 0.0.1.20230323065931
// @downloadURL https://update.greasyfork.org/scripts/5880/LASTFM%20Color%20Visited%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/5880/LASTFM%20Color%20Visited%20Links.meta.js
// ==/UserScript==

function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    try {
        style.innerHTML = css;
    } catch(err) {
        style.innerText = css;
    }
    head.appendChild(style);
}

addStyle('#content a:visited {color: #7b7b7b !important}');
