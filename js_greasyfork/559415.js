// ==UserScript==
// @name         Bloxd.io Smoothness Booster + Fake 120 FPS
// @namespace    bloxd-smooth-120fps
// @version      1.0
// @description  Makes Bloxd.io feel smoother and replaces the top-left FPS text with a fake 120 FPS display.
// @author       You
// @match        *://bloxd.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559415/Bloxdio%20Smoothness%20Booster%20%2B%20Fake%20120%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/559415/Bloxdio%20Smoothness%20Booster%20%2B%20Fake%20120%20FPS.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // ------------------------------
    // 1. Inject smoothness CSS
    // ------------------------------
    const smoothCSS = `
        * {
            animation: none !important;
            transition: none !important;
            box-shadow: none !important;
            filter: none !important;
            backdrop-filter: none !important;
        }

        body, html {
            background-image: none !important;
        }
    `;

    const style = document.createElement("style");
    style.textContent = smoothCSS;
    document.documentElement.appendChild(style);

    // ------------------------------
    // 2. Improve responsiveness
    // ------------------------------
    // Reduce layout thrashing by forcing stable canvas layout
    const stabilize = () => {
        const canvas = document.querySelector("canvas");
        if (canvas) {
            canvas.style.imageRendering = "pixelated";
            canvas.style.touchAction = "none";
        }
    };

    const observer = new MutationObserver(stabilize);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // ------------------------------
    // 3. Replace top-left FPS text with "FPS: 120"
    // ------------------------------
    function replaceFPS() {
        const fpsElements = document.querySelectorAll("*");

        fpsElements.forEach(el => {
            if (el.innerText && el.innerText.includes("FPS")) {
                // Replace ONLY the small top-left FPS text
                if (el.innerText.match(/FPS[: ]/i)) {
                    el.innerText = "FPS: 120";
                    el.style.color = "#00ffea";
                    el.style.fontWeight = "bold";
                    el.style.textShadow = "0 0 6px #00fff2";
                }
            }
        });
    }

    // Run repeatedly because Bloxd updates the FPS text constantly
    setInterval(replaceFPS, 50);

})();
