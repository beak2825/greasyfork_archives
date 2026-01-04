// ==UserScript==
// @name         humanbenchmark.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  reaction test cheat
// @author       7x12
// @match        *://humanbenchmark.com*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550142/humanbenchmarkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/550142/humanbenchmarkcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get average background color of the body
    function getBgColor() {
        let bg = window.getComputedStyle(document.body).backgroundColor;
        return bg;
    }

    // Function to simulate a click
    function simulateClick() {
        document.body.dispatchEvent(new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
        }));
        console.log("✅ Clicked because screen turned green!");
    }

    // Watcher loop
    setInterval(() => {
        let color = getBgColor();

        // Detect green background
        if (color === "rgb(0, 128, 0)" || color.includes("0, 128, 0")) {
            simulateClick();
        }
    }, 1); // check every 1ms
})();