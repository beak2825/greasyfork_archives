// ==UserScript==
// @name         Auto-close Zoom join pages
// @namespace    http://tampermonkey.net/
// @version      2025-10-30
// @description  Closes a Zoom join page after a few minutes, so you don't have to manually close it after the call
// @author       joeytwiddle
// @license      ISC
// @match        https://*.zoom.us/j/*
// @match        https://zoom.us/j/*
// @include      https://*.zoom.tld/j/*
// @include      https://zoom.tld/j/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zoom.us
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553948/Auto-close%20Zoom%20join%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/553948/Auto-close%20Zoom%20join%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Weirdly, this script will only execute if we run-at document-start
    // But running at document-start means we need to wait a while before we can check the page content. Hence this setTimeout.
    // To reproduce: Chrome on macOS, and do not test with Reload (which works more easily). Be sure to test by clicking the Zoom link again (e.g. from Google Calendar) to open a fresh page.
    setTimeout(() => {
        const $ = s => document.querySelector(s);

        const isZoomJoinPage = $('#zoom-ui-frame') || $('#zoom-ui-container');

        if (isZoomJoinPage) {
            // Close the window later
            setTimeout(() => {
                window.close();
            }, 60 * 1000);

            // Advertise that this script is running
            const existingTextElement = $('#zoom-ui-frame h2');
            const ourTextElement = document.createElement('h2');
            ourTextElement.textContent = '(This page will auto-close soon)';
            ourTextElement.style.opacity = '0.6';
            existingTextElement.parentNode.appendChild(ourTextElement);
        }
    }, 1.5 * 1000);
})();
