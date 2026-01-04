// ==UserScript==
// @name         autoclicker menu shell
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Right Shift menu + left/right toggle hooks
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559409/autoclicker%20menu%20shell.user.js
// @updateURL https://update.greasyfork.org/scripts/559409/autoclicker%20menu%20shell.meta.js
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

        <div class="toggle" id="leftToggle">
            <span>Left Click (14 CPS)</span>
            <div class="indicator" id="leftIndicator"></div>
        </div>

        <div class="toggle" id="rightToggle">
            <span>Right Click (30 CPS)</span>
            <div class="indicator" id="rightIndicator"></div>
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

        .toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255,255,255,0.05);
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
            cursor: pointer;
        }

        .indicator {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: red;
            transition: 0.15s;
        }

        .indicator.on {
            background: lime;
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
    // TOGGLE STATES
    // ---------------------------
    let leftOn = false;
    let rightOn = false;

    const leftIndicator = document.getElementById("leftIndicator");
    const rightIndicator = document.getElementById("rightIndicator");

    // ---------------------------
    // CLICK HANDLERS (SAFE HOOKS)
    // ---------------------------
    document.getElementById("leftToggle").onclick = () => {
        leftOn = !leftOn;
        leftIndicator.classList.toggle("on", leftOn);

        // 🔵 HOOK: Your left-click 14 CPS logic goes here
        window.dispatchEvent(new CustomEvent("left-toggle", { detail: leftOn }));
    };

    document.getElementById("rightToggle").onclick = () => {
        rightOn = !rightOn;
        rightIndicator.classList.toggle("on", rightOn);

        // 🔵 HOOK: Your right-click 30 CPS logic goes here
        window.dispatchEvent(new CustomEvent("right-toggle", { detail: rightOn }));
    };

})();
