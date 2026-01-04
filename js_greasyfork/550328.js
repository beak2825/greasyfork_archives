// ==UserScript==
// @name         Close after .1s
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Close login successful
// @author       Louis Yvelin
// @match        http://127.0.0.1:35001/*
// @icon         https://www.teads.com/wp-content/uploads/2025/04/teads-motif-center-avatar-300x300.png
// @grant        window.close
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550328/Close%20after%201s.user.js
// @updateURL https://update.greasyfork.org/scripts/550328/Close%20after%201s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.origin.trim('/').split(':')[2] === '35001' &&
    setTimeout(_ => {window.close();console.log('should close now!');}, 100);

})();