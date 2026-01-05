// ==UserScript==
// @name         TM Player Page Info Box (Works on ALL Player Profiles)
// @namespace    TMPP_InfoBox
// @version      1.0
// @description  Adds a custom info box on every Trophy Manager player page (Violentmonkey compatible)
// @match        https://trophymanager.com/players/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558532/TM%20Player%20Page%20Info%20Box%20%28Works%20on%20ALL%20Player%20Profiles%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558532/TM%20Player%20Page%20Info%20Box%20%28Works%20on%20ALL%20Player%20Profiles%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitFor(selector, cb) {
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                cb(el);
            }
        }, 200);
    }

    function createBox(container) {

        // Prevent duplicate box on reload
        if (document.querySelector("#tm_custom_box")) return;

        const box = document.createElement("div");
        box.id = "tm_custom_box";
        box.style.background = "#2d6";
        box.style.padding = "10px 12px";
        box.style.marginTop = "12px";
        box.style.borderRadius = "6px";
        box.style.fontSize = "15px";
        box.style.fontWeight = "bold";
        box.style.color = "#fff";
        box.style.boxShadow = "0 0 6px rgba(0,0,0,0.25)";

        // --- WHAT SHOWS INSIDE THE BOX ---
        const stats = document.querySelectorAll(".skill_table .skill .value");
        let total = 0;
        let count = 0;

        stats.forEach(s => {
            const v = parseFloat(s.textContent.trim());
            if (!isNaN(v)) {
                total += v;
                count++;
            }
        });

        let avg = (count > 0 ? (total / count).toFixed(2) : "N/A");
        let stars = (count > 0 ? ((avg / 20) * 5).toFixed(1) : "N/A");

        box.innerHTML = `
            <div style="font-size:17px;">⭐ <u>Player Quick Overview</u></div>
            <br>
            Average skill: <b>${avg}</b><br>
            Estimated star rating: <b>${stars} ★</b>
        `;

        // Add the custom box under the player info section
        container.appendChild(box);
    }

    // Run ONLY on player pages
    waitFor(".player_info", createBox);

})();
