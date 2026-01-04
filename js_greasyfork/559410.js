// ==UserScript==
// @name         autoclicker menu with custom cps
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Right Shift menu + custom CPS sliders (UI only)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559410/autoclicker%20menu%20with%20custom%20cps.user.js
// @updateURL https://update.greasyfork.org/scripts/559410/autoclicker%20menu%20with%20custom%20cps.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------
    // CREATE MENU
    // ---------------------------
    const menu = document.createElement("div");
    menu.id = "acMenu";
    menu.innerHTML = `
        <h2>Auto Clicker Menu</h2>

        <div class="section">
            <label>Left Click CPS: <span id="leftCpsVal">14</span></label>
            <input type="range" id="leftCps" min="1" max="60" value="14">
        </div>

        <div class="section">
            <label>Right Click CPS: <span id="rightCpsVal">30</span></label>
            <input type="range" id="rightCps" min="1" max="60" value="30">
        </div>
    `;
    document.body.appendChild(menu);

    // ---------------------------
    // STYLE
    // ---------------------------
    const style = document.createElement("style");
    style.textContent = `
        #acMenu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            background: rgba(20, 20, 20, 0.95);
            padding: 20px;
            border-radius: 12px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 999999999;
            display: none;
            width: 260px;
            text-align: center;
            transition: 0.15s ease;
        }

        #acMenu.open {
            display: block;
            transform: translate(-50%, -50%) scale(1);
        }

        .section {
            margin-top: 15px;
            text-align: left;
        }

        input[type=range] {
            width: 100%;
        }
    `;
    document.head.appendChild(style);

    // ---------------------------
    // MENU TOGGLE (Right Shift)
    // ---------------------------
    let menuOpen = false;

    window.addEventListener("keydown", (e) => {
        if (e.code === "ShiftRight") {
            menuOpen = !menuOpen;
            menu.classList.toggle("open", menuOpen);
        }
    });

    // ---------------------------
    // CPS SLIDER LOGIC (UI ONLY)
    // ---------------------------
    const leftSlider = document.getElementById("leftCps");
    const rightSlider = document.getElementById("rightCps");

    const leftVal = document.getElementById("leftCpsVal");
    const rightVal = document.getElementById("rightCpsVal");

    leftSlider.oninput = () => {
        leftVal.textContent = leftSlider.value;

        // 🔵 HOOK: Your left-click CPS logic goes here
        window.dispatchEvent(new CustomEvent("left-cps-change", {
            detail: Number(leftSlider.value)
        }));
    };

    rightSlider.oninput = () => {
        rightVal.textContent = rightSlider.value;

        // 🔵 HOOK: Your right-click CPS logic goes here
        window.dispatchEvent(new CustomEvent("right-cps-change", {
            detail: Number(rightSlider.value)
        }));
    };

})();
