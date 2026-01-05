// ==UserScript==
// @name        Australia
// @description Applies proper rotation to Reddit's Australia subreddit.
// @namespace   faa8146
// @include     http://www.reddit.com/r/australia/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7005/Australia.user.js
// @updateURL https://update.greasyfork.org/scripts/7005/Australia.meta.js
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

addGlobalStyle('body { -webkit-transform:rotate(180deg) !important; -moz-transform:rotate(180deg) !important; -o-transform:rotate(180deg) !important; filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=180) !important;}');