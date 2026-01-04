// ==UserScript==
// @name        Seeing Red Logo
// @namespace   Seeing Red Logo
// @description Purges TORN logo from the top left icon and replaces it with Sea Lions booty pic!
// @author      copypasta
// @match       http*://www.torn.com/*
// @match       http*://torn.com/*
// @version     1
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549644/Seeing%20Red%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/549644/Seeing%20Red%20Logo.meta.js
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
addGlobalStyle('#tcLogo.logo { background-image: url(https://i.imgur.com/B7FcQWb.jpeg) !important; }');