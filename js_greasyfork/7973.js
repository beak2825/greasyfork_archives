// ==UserScript==
// @name         Remove 'Who To Follow' from Twitter
// @namespace    http://www.kennyzaron.com
// @description  Removes the 'who to follow' box on twitter.com as of 02/09/2015
// @include      https://twitter.com/*
// @grant        none
// @version      1.0.020915
// @downloadURL https://update.greasyfork.org/scripts/7973/Remove%20%27Who%20To%20Follow%27%20from%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/7973/Remove%20%27Who%20To%20Follow%27%20from%20Twitter.meta.js
// ==/UserScript==

function disable() {
    document.getElementsByClassName('wtf-module')[0].style.display='none';
}
disable();
