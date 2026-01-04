// ==UserScript==
// @name         Setdart Min Price
// @namespace    http://tampermonkey.net/
// @version      2025-10-08
// @description  Display the min price in console
// @author       Michele
// @license      MIT
// @match        https://www.setdart.com/subasta/displayimage/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=setdart.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551942/Setdart%20Min%20Price.user.js
// @updateURL https://update.greasyfork.org/scripts/551942/Setdart%20Min%20Price.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("== PREZZO MINIMO == " + setdart.rpmin);
    // Your code here...
})();