// ==UserScript==
// @name         GMail Pause
// @namespace    http://tagansvar.eu/
// @version      1.2
// @description  Put GMail on pause to stop distractions!
// @author       Mikkel Kongsfelt
// @match        https://mail.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/5669/GMail%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/5669/GMail%20Pause.meta.js
// ==/UserScript==

function hideUnread()
{
    document.title = 'Gmail';
}
var t=setInterval(hideUnread,10);

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('tr.zE {display:none;}');
addGlobalStyle('div.aDG {display:none;}');
addGlobalStyle('div.aKs {display:none;}');
addGlobalStyle('.n1 .n0 {  font-weight:bold !important;}');
addGlobalStyle('div.UKr6le { width:73px; }');
addGlobalStyle('.aRu {display:none;}');