// mindreader
//
// ==UserScript==
// @name          mindreader
// @description   read minds but do it easier
// @include       *127.0.0.1:*mchat.php*
// @include       *kingdomofloathing.com*mchat.php*
// @version 	  1.0
// @namespace https://greasyfork.org/users/3824
// @downloadURL https://update.greasyfork.org/scripts/8458/mindreader.user.js
// @updateURL https://update.greasyfork.org/scripts/8458/mindreader.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('div.emote:not([id]){ color: #CC5200 !important; } div.emote:not([id]):before{content:"[mindreader] ";}');