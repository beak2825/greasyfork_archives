// ==UserScript==
// @name         Attempt to Hide Safari Toolbar on chatreplay.stream
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tries to hide the Safari toolbar on page load by scrolling slightly.
// @author       You
// @match        https://chatreplay.stream/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553613/Attempt%20to%20Hide%20Safari%20Toolbar%20on%20chatreplaystream.user.js
// @updateURL https://update.greasyfork.org/scripts/553613/Attempt%20to%20Hide%20Safari%20Toolbar%20on%20chatreplaystream.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This trick may nudge Safari to hide the toolbar, similar to a user scrolling.
    window.addEventListener('load', function() {
        setTimeout(function() {
            window.scrollTo(0, 1);
        }, 100); // A slight delay may be necessary for the page to be ready.
    });
})();