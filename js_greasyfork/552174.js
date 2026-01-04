// ==UserScript==
// @name         Nitro Type Neon Garage Background (Toggle Version)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a smooth color-changing neon background effect to your Nitro Type garage page with an on/off toggle button.
// @author       King's Group
// @match        https://www.nitrotype.com/garage*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552174/Nitro%20Type%20Neon%20Garage%20Background%20%28Toggle%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552174/Nitro%20Type%20Neon%20Garage%20Background%20%28Toggle%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and inject <style> for neon animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes neonShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        body.neon-active {
            background: linear-gradient(270deg,
                #ff005e,
                #ff8400,
                #ffe600,
                #00ff85,
                #00c3ff,
                #8300ff,
                #ff00b7);
            background-size: 1400% 1400%;
            animation: neonShift 20s ease infinite;
            transition: background 1s ease;
        }

        .neon-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: radial-gradient(circle at center,
                rgba(255,255,255,0.05),
                rgba(0,0,0,0.3));
            mix-blend-mode: overlay;
            z-index: 999;
        }

        #neonToggleBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(0,0,0,0.6);
            color: #00ffb3;
            border: 2px solid #00ffb3;
            border-radius: 10px;
            padding: 10px 16px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 0 10px #00ffb3;
            transition: all 0.3s ease;
        }

        #neonToggleBtn:hover {
            background: #00ffb3;
            color: #000;
            box-shadow: 0 0 15px #00ffb3;
        }
    `;
    document.head.appendChild(style);

    // Create overlay and toggle button
    const overlay = document.createElement("div");
    overlay.classList.add("neon-overlay");

    const button = document.createElement("button");
    button.id = "neonToggleBtn";
    button.textContent = "✨ Toggle Neon";

    // Append elements
    document.body.appendChild(button);

    // Load last state from localStorage
    let neonActive = localStorage.getItem("neonActive") === "true";

    if (neonActive) {
        document.body.classList.add("neon-active");
        document.body.appendChild(overlay);
    }

    // Toggle function
    button.addEventListener("click", () => {
        neonActive = !neonActive;
        localStorage.setItem("neonActive", neonActive);
        if (neonActive) {
            document.body.classList.add("neon-active");
            document.body.appendChild(overlay);
            console.log("🌈 Neon mode ON");
        } else {
            document.body.classList.remove("neon-active");
            overlay.remove();
            console.log("🚫 Neon mode OFF");
        }
    });

    console.log("🚗 Neon Garage Background with Toggle Ready!");
})();
