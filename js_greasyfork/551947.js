// ==UserScript==
// @name         Modify Copied X Links to fixupx.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace x.com domain with fixupx.com in copied share links
// @author       GuybrushUlyssesThreepwood
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551947/Modify%20Copied%20X%20Links%20to%20fixupxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/551947/Modify%20Copied%20X%20Links%20to%20fixupxcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(event) {
        const selection = window.getSelection().toString();
        if (selection && (selection.startsWith('https://x.com/') || selection.startsWith('https://twitter.com/'))) {
            event.preventDefault();
            const newText = selection.replace(/^https:\/\/(?:x|twitter)\.com\//, 'https://fixupx.com/');
            event.clipboardData.setData('text/plain', newText);
        }
    });
})();