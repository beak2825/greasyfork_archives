// ==UserScript==
// @name         Mouse-Follow Auto Clicker (Smooth + Burst, Max 10k CPS, Hold M1) V3
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  Auto clicker: Smooth + Burst modes, max 10k CPS. Hold M1 to click, Alt+M toggle, Alt+N set CPS.
// @author       TheHackerClient
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550750/Mouse-Follow%20Auto%20Clicker%20%28Smooth%20%2B%20Burst%2C%20Max%2010k%20CPS%2C%20Hold%20M1%29%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/550750/Mouse-Follow%20Auto%20Clicker%20%28Smooth%20%2B%20Burst%2C%20Max%2010k%20CPS%2C%20Hold%20M1%29%20V3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let running = false;       // Auto clicker ON/OFF state
    let cps = 100;             // Default clicks per second
    let smoothInterval = null;
    let burstInterval = null;
    let lastMouseX = 0, lastMouseY = 0;
    let m1Down = false;        // Track if M1 is held

    // Track mouse
    document.addEventListener("mousemove", e => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    // Track M1 press
    document.addEventListener("mousedown", e => {
        if (e.button === 0) m1Down = true;
    });
    document.addEventListener("mouseup", e => {
        if (e.button === 0) m1Down = false;
    });

    // Key controls
    document.addEventListener("keyup", function(evt) {
        // Alt+M → toggle on/off
        if (evt.key.toLowerCase() === "m" && evt.altKey) {
            if (!running) {
                running = true;
                alert(`Auto Clicker ENABLED. Hold M1 to click at ${cps} CPS.\n(Use Alt+N to change CPS, Alt+M to disable)`);
            } else {
                running = false;
                clearInterval(smoothInterval);
                clearInterval(burstInterval);
                smoothInterval = null;
                burstInterval = null;
                alert("Auto Clicker DISABLED.");
            }
        }

        // Alt+N → change CPS
        if (evt.key.toLowerCase() === "n" && evt.altKey) {
            let inp = prompt(`Enter CPS (1–10000, current ${cps}):`, cps);
            if (!isNaN(inp) && inp.trim().length > 0) {
                inp = parseInt(inp);
                if (inp > 10000) cps = 10000;
                else if (inp < 1) cps = 1;
                else cps = inp;
                alert(`CPS updated to ${cps}.`);
            }
            // If running, restart clicking with new CPS
            if (running) {
                clearInterval(smoothInterval);
                clearInterval(burstInterval);
                smoothInterval = null;
                burstInterval = null;
            }
        }
    });

    function startClicking() {
        if (smoothInterval || burstInterval) return; // Already running

        // Smooth clicks
        let smoothIntervalMs = 1000 / cps;
        smoothInterval = setInterval(() => {
            if (m1Down && running) simulateClick(lastMouseX, lastMouseY);
        }, smoothIntervalMs);

        // Burst clicks
        burstInterval = setInterval(() => {
            if (m1Down && running) {
                let clicksPerBurst = Math.ceil(cps / 10);
                for (let i = 0; i < clicksPerBurst; i++) {
                    simulateClick(lastMouseX, lastMouseY);
                }
            }
        }, 100);
    }

    // Continuously check to start/stop clicking
    setInterval(() => {
        if (running && m1Down && !smoothInterval && !burstInterval) {
            startClicking();
        }
        if ((!m1Down || !running) && (smoothInterval || burstInterval)) {
            clearInterval(smoothInterval);
            clearInterval(burstInterval);
            smoothInterval = null;
            burstInterval = null;
        }
    }, 50);

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
