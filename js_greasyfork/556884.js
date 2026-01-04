// ==UserScript==
// @name         Auto-close Slack redirect pages
// @namespace    http://tampermonkey.net/
// @version      2025-11-24
// @description  Closes a Slack app redirect page after a few seconds
// @author       joeytwiddle
// @license      ISC
// @match        https://slack.com/archives/*
// @match        https://*.slack.com/archives/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/556884/Auto-close%20Slack%20redirect%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/556884/Auto-close%20Slack%20redirect%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const loadingMessages = document.querySelector('p[data-qa="loading_messages"]');

        const appHasBeenOpened = loadingMessages && loadingMessages.textContent.includes("We’ve redirected you");

        if (appHasBeenOpened) {
            // Close the window later
            setTimeout(() => {
                window.close();
            }, 20 * 1000);

            // Advertise that this script is running
            loadingMessages.appendChild(document.createElement('br'));
            const textNode = document.createTextNode('(This page will auto-close soon.)');
            loadingMessages.appendChild(textNode);
            //textNode.style.opacity = '0.6';
        }
    }, 4 * 1000);
})();
