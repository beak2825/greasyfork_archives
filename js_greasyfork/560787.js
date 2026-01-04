// ==UserScript==
// @name         TipsGuru & Wealth.TipsGuru Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fast bypass for tipsguru.in and wealth.tipsguru.in to skip 90s timer.
// @author       Harshit
// @match        *://tipsguru.in/prolink.php*
// @match        *://*.tipsguru.in/prolink.php*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560787/TipsGuru%20%20WealthTipsGuru%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/560787/TipsGuru%20%20WealthTipsGuru%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let p = new URLSearchParams(window.location.search);
    let id = p.get('id');
    if (id) {
        try {
            let u = atob(decodeURIComponent(id));
            if(u.startsWith('http')) window.location.replace(u);
        } catch(e) {}
    }
})();
