// ==UserScript==
// @name         Macro Menu (Right Shift + R Toggle)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  UI-only macro menu with Right Shift and R toggle
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559418/Macro%20Menu%20%28Right%20Shift%20%2B%20R%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559418/Macro%20Menu%20%28Right%20Shift%20%2B%20R%20Toggle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -----------------------------
    // Create Menu
    // -----------------------------
    const menu = document.createElement("div");
    menu.id = "macroMenu";
    menu.innerHTML = `
        <h2>Macro Menu</h2>
        <p>Status: <span id="featureStatus" style="color:#ff4444;">OFF</span></p>
        <p>Press <b>R</b> to toggle feature</p>
    `;
    document.body.appendChild(menu);

    // -----------------------------
    // Style
    // -----------------------------
    const style = document.createElement("style");
    style.textContent = `
        #macroMenu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: rgba(20, 20, 20, 0.92);
            padding: 20px;
            border-radius: 12px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 999999999;
            display: none;
            width: 260px;
            text-align: center;
            transition: 0.15s ease;
            border: 1px solid #444;
            box-shadow: 0 0 20px rgba(0,0,0,0.4);
        }

        #macroMenu.open {
            display: block;
            transform: translate(-50%, -50%) scale(1);
        }

        #macroMenu h2 {
            margin-top: 0;
            color: #7ab6ff;
        }
    `;
    document.head.appendChild(style);

    // -----------------------------
    // Logic
    // -----------------------------
    let menuOpen = false;
    let featureEnabled = false;

    // Toggle menu with Right Shift
    window.addEventListener("keydown", (e) => {
        if (e.code === "ShiftRight") {
            menuOpen = !menuOpen;
            menu.classList.toggle("open", menuOpen);
        }
    });

    // Toggle feature with R
    window.addEventListener("keydown", (e) => {
        if (e.code === "KeyR") {
            featureEnabled = !featureEnabled;
            document.getElementById("featureStatus").textContent = featureEnabled ? "ON" : "OFF";
            document.getElementById("featureStatus").style.color = featureEnabled ? "#44ff44" : "#ff4444";

            // 🔧 This is where YOU add whatever you want the toggle to do
            // Example: console.log("Feature is now", featureEnabled);
        }
    });

})();
