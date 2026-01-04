// ==UserScript==
// @name         Mouse-Follow Auto Clicker (Smooth + Burst, Max 10k CPS)
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Mouse-following auto clicker with both smooth and burst modes. Max CPS 10,000. Toggle with Q.
// @author       LigHT (modified by TheHackerClient and gpt)
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550706/Mouse-Follow%20Auto%20Clicker%20%28Smooth%20%2B%20Burst%2C%20Max%2010k%20CPS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550706/Mouse-Follow%20Auto%20Clicker%20%28Smooth%20%2B%20Burst%2C%20Max%2010k%20CPS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let running = false;
    let cps = 100;
    let smoothInterval = null;
    let burstInterval = null;
    let lastMouseX = 0, lastMouseY = 0;

    // Track mouse
    document.addEventListener("mousemove", e => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    // Toggle with Q
    document.addEventListener("keyup", function(evt) {
        if (evt.key.toLowerCase() === "q") {
            if (!running) {
                // Turn ON
                running = true;

                let inp = prompt("Enter CPS (1–10000, default 100):", cps);
                if (!isNaN(inp) && inp.trim().length > 0) {
                    inp = parseInt(inp);
                    if (inp > 10000) cps = 10000;
                    else if (inp < 1) cps = 1;
                    else cps = inp;
                }

                alert(`Auto Clicker started at ${cps} CPS. Press Q again to stop.`);

                // --- Smooth clicks (evenly spaced) ---
                let smoothIntervalMs = 1000 / cps;
                smoothInterval = setInterval(() => {
                    simulateClick(lastMouseX, lastMouseY);
                }, smoothIntervalMs);

                // --- Burst clicks (chunked every 100ms) ---
                burstInterval = setInterval(() => {
                    let clicksPerBurst = Math.ceil(cps / 10);
                    for (let i = 0; i < clicksPerBurst; i++) {
                        simulateClick(lastMouseX, lastMouseY);
                    }
                }, 100);

            } else {
                // Turn OFF
                running = false;
                clearInterval(smoothInterval);
                clearInterval(burstInterval);
                alert("Auto Clicker stopped.");
            }
        }
    });

    function simulateClick(x, y) {
        let el = document.elementFromPoint(x, y);
        if (!el) return;
        let ev = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y
        });
        el.dispatchEvent(ev);
    }
})();
