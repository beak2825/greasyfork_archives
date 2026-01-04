// ==UserScript==
// @name         Disable Shapes.inc Message Effects (17 Oct 2025)
// @namespace    http://tampermonkey.net/
// @version      2025-10-18 v.1
// @description  override Shapes.inc CSS so users can see chat easily
// @author       Wyvern Dryke
// @match        https://talk.shapes.inc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shapes.inc
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552949/Disable%20Shapesinc%20Message%20Effects%20%2817%20Oct%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552949/Disable%20Shapesinc%20Message%20Effects%20%2817%20Oct%202025%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement('style');
    // NOTE: You can switch the colors! -> change the word black V and the word white V to color-words or #hexcodes of your choice :)
    style.textContent = '[class*=message-effect-]{background:black !important; color:white !important; box-shadow:unset!important;} [class*=message-effect-]:after,[class*=message-effect-]:before{all:unset !important;} div.relative.-mt-12.pt-12.pb-1.pointer-events-none{display:none!important;} .dark .message-effect-boom{color:unset!important;}';
    document.head.appendChild(style);
})();
