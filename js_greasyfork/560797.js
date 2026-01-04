// ==UserScript==
// @name         TipsGuru Bypass + 240s Timer
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Decodes link, clears page, waits 240s, then redirects.
// @author       Chat G
// @match        *://tipsguru.in/prolink.php*
// @match        *://*.tipsguru.in/prolink.php*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560797/TipsGuru%20Bypass%20%2B%20240s%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/560797/TipsGuru%20Bypass%20%2B%20240s%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL se ID nikalna
    let params = new URLSearchParams(window.location.search);
    let id = params.get('id');

    if (id) {
        try {
            // Link decode karna
            let finalUrl = atob(decodeURIComponent(id));

            // Agar link sahi hai, toh timer shuru karo
            if(finalUrl && finalUrl.includes('http')) {
                startTimerAndRedirect(finalUrl);
            }
        } catch(e) {
            console.log("Error:", e);
        }
    }

    function startTimerAndRedirect(url) {
        // Page load rok do taaki ads load na hon
        window.stop();

        // Poori screen saaf kardo
        document.documentElement.innerHTML = '<head></head><body></body>';

        // Timer wala box banao (Design copied from your reference)
        const container = document.createElement('div');
        container.style.cssText = `
            display:flex;
            justify-content:center;
            align-items:center;
            height:100vh;
            font-size:40px;
            font-family:Arial,sans-serif;
            background:#000;
            color:#0f0;
            margin:0;
        `;
        
        // Body ka margin 0 karo taaki full screen black dikhe
        document.body.style.margin = "0";
        document.body.appendChild(container);

        // 240 Seconds ka time set kiya
        let timeLeft = 240;

        container.textContent = `Redirecting in ${timeLeft}s`;

        // Countdown shuru
        const timer = setInterval(() => {
            timeLeft--;
            container.textContent = `Redirecting in ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                // Time khatam hone par redirect
                window.location.href = url;
            }
        }, 1000);
    }
})();
