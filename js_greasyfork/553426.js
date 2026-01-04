// ==UserScript==
// @name         Force HTTPS Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically redirect HTTP pages to HTTPS without blocking
// @author       Rishabh
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553426/Force%20HTTPS%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/553426/Force%20HTTPS%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.protocol === 'http:') {
        location.href = location.href.replace('http:', 'https:');
    }
})();