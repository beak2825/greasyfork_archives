// ==UserScript==
// @name        Disable Yahoo! News background ad
// @namespace   yahoo
// @description Makes background ad area on Yahoo! News unclickable. No more accidental clicks.
// @include     https://*.news.yahoo.com/*
// @include     http://*.news.yahoo.com/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8242/Disable%20Yahoo%21%20News%20background%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/8242/Disable%20Yahoo%21%20News%20background%20ad.meta.js
// ==/UserScript==

var el = document.body,
    elClone = el.cloneNode(true);
el.parentNode.replaceChild(elClone, el);