// ==UserScript==
// @name        Hide Google Default Search Warning
// @namespace   http://www.NematzNetwork.com
// @description This removes the new "Set Google as your default search engine" warning on Firefox-based browsers.
// @include     https://www.google.com/*
// @include     https://www.google.com/search
// @include     https://google.com/*
// @include     https://*.google.com/*
// @include     http://www.google.com/*
// @include     http://www.google.com/search
// @include     http://google.com/*
// @include     http://*.google.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9860/Hide%20Google%20Default%20Search%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/9860/Hide%20Google%20Default%20Search%20Warning.meta.js
// ==/UserScript==

var pushdown = document.getElementById('pushdown');
if (pushdown) {
    pushdown.parentNode.removeChild(pushdown);
}