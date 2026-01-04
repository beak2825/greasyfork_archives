// ==UserScript==
// @name         Block 0-9 keys on YouTube (video only)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Prevent YouTube from using 0-9 shortcuts only while watching videos
// @match        https://www.youtube.com/*
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/549081/Block%200-9%20keys%20on%20YouTube%20%28video%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549081/Block%200-9%20keys%20on%20YouTube%20%28video%20only%29.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function(e) {
        // Do not block if the user is typing in an input, textarea, or contentEditable element
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea' || e.target.isContentEditable) {
            return;
        }

        // Block number keys 0-9 (top row and numpad)
        if ((e.key >= '0' && e.key <= '9') || (e.keyCode >= 96 && e.keyCode <= 105)) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true);
})();
