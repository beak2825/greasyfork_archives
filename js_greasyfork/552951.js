// ==UserScript==
// @name         Auto Click Like Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the Like button with class "dt-action-buttons-button like"
// @match        https://www.okcupid.com/discover
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552951/Auto%20Click%20Like%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/552951/Auto%20Click%20Like%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the like button
    function clickLikeButton() {
        const button = document.querySelector('button.dt-action-buttons-button.like');
        if (button) {
            button.click();
            console.log("✅ Like button clicked");
        }
    }

    // Start automation after 10 seconds
    setTimeout(() => {
        console.log("⏳ Starting auto-like after 10s delay...");

        // Try clicking every second
        setInterval(clickLikeButton, 1000);

        // Watch for dynamically loaded buttons
        const observer = new MutationObserver(() => clickLikeButton());
        observer.observe(document.body, { childList: true, subtree: true });

    }, 10000); // 10,000 ms = 10 seconds
})();