// ==UserScript==
// @name         Auto Continue - oto.otowp.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Waits for Continue button and clicks it automatically
// @match        https://oto.otowp.com/*
// @match        https://carrnissan.com/*
// @license   MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557013/Auto%20Continue%20-%20otootowpcom.user.js
// @updateURL https://update.greasyfork.org/scripts/557013/Auto%20Continue%20-%20otootowpcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Auto-Continue script running...");

    const waitForContinue = setInterval(() => {
        // Try to find buttons that say Continue
        const btn = [...document.querySelectorAll("button, a")]
            .find(el => el.innerText.trim().toLowerCase() === "continue");

        if (btn) {
            console.log("Continue button found, clicking...");
            btn.click();
            clearInterval(waitForContinue);
        }
    }, 500);
})();
