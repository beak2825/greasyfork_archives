// ==UserScript==
// @name         Dark Gray Background for Goal Line Blitz - V2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  Changes the outer background color of the GLB login page to dark gray (more aggressive).
// @author       SeattleNiner
// @match        https://glb.warriorgeneral.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557274/Dark%20Gray%20Background%20for%20Goal%20Line%20Blitz%20-%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/557274/Dark%20Gray%20Background%20for%20Goal%20Line%20Blitz%20-%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // #333333 is the dark gray color

    // 1. Target the <html> element (the root of the page)
    GM_addStyle('html { background-color: #413F44 !important; }');

    // 2. Target the <body> element (this is what we targeted before, keeping it for certainty)
    GM_addStyle('body { background-color: #413F44 !important; }');

    // 3. Target the main content wrapper if the page is using an inner wrapper to hold the white background
    // Based on the HTML you provided earlier, the main wrapper seems to be
    // <div id="body_container"> which contains the white-background content.
    // Let's ensure this wrapper does *not* inherit the body background and keeps its current appearance.
    // However, if the entire visible page *inside* the gray area is white, the most effective target is html/body.

})();