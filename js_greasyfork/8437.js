// ==UserScript==
// @name        xkcd Arrow Keys
// @description Adds the ability to use arrow keys to move to the next or previous comic/article on xkcd.com.
// @namespace   https://greasyfork.org/en/users/2556-pietu1998
// @include     http://xkcd.com/*
// @include     https://xkcd.com/*
// @include     http://*.xkcd.com/*
// @include     https://*.xkcd.com/*
// @version     1.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8437/xkcd%20Arrow%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/8437/xkcd%20Arrow%20Keys.meta.js
// ==/UserScript==

window.addEventListener("keydown", function(e) {
    var q = document.querySelector.bind(document);
    var el = false;
    if (e.keyCode == 37)
        el = q("a[rel=prev]") || q("li.nav-prev a");
    if (e.keyCode == 39)
        el = q("a[rel=next]") || q("li.nav-next a");
    el && el.click();
});