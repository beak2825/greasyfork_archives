// ==UserScript==
// @name         Khan Destroyer Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Loads and executes external script from Khan Destroyer repo
// @author       Viperlord010101
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555379/Khan%20Destroyer%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/555379/Khan%20Destroyer%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    fetch("https://raw.githubusercontent.com/Snowxyrzk/Khan-Destroyer/refs/heads/main/SCRIPT.js")
        .then(response => response.text())
        .then(code => eval(code));
})();