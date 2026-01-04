// ==UserScript==
// @name         Nuggets Menu - Retro Neon Gold (No Footer)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Retro neon glowing menu for kour.io with button placements (No bottom label)
// @match        https://kour.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557841/Nuggets%20Menu%20-%20Retro%20Neon%20Gold%20%28No%20Footer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557841/Nuggets%20Menu%20-%20Retro%20Neon%20Gold%20%28No%20Footer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent duplicate menu
    if (document.getElementById("nuggets-menu")) return;

    // Menu HTML
    const menu = document.createElement("div");
    menu.id = "nuggets-menu";
    menu.innerHTML = `
        <div class="title">NUGGETS MENU</div>

        <div class="button-container">
            <button class="nug-btn">Button 1</button>
            <button class="nug-btn">Button 2</button>
            <button class="nug-btn">Button 3</button>
            <button class="nug-btn">Button 4</button>
        </div>
    `;

    document.body.appendChild(menu);

    // Styles
    const style = document.createElement("style");
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

    #nuggets-menu {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 320px;
        height: 240px; /* shortened height since footer removed */
        transform: translate(-50%, -50%);
        background: #111;
        border-radius: 18px;
        border: 2px solid gold;

        box-shadow:
            0 0 24px rgba(0,255,120,0.7),
            0 0 8px gold inset;

        font-family: "Press Start 2P", monospace;
        color: gold;
        z-index: 999999999;
        user-select: none;

        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 18px;

        animation: neonPulse 3s infinite alternate;
    }

    .title {
        font-size: 16px;
        text-shadow: 0 0 8px gold, 0 0 12px lime;
        margin-bottom: 18px;
    }

    .button-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 90%;
        gap: 10px;
    }

    .nug-btn {
        width: 120px;
        height: 38px;
        background: black;
        border: 2px solid gold;
        border-radius: 10px;
        color: gold;
        font-family: "Press Start 2P";
        font-size: 10px;
        cursor: pointer;

        text-shadow: 0 0 6px gold;
        box-shadow: 0 0 6px rgba(0,255,120,0.6);
        transition: 0.2s ease;
    }

    .nug-btn:hover {
        background: #222;
        box-shadow: 0 0 12px rgba(0,255,120,1);
    }

    @keyframes neonPulse {
        0% {
            box-shadow:
                0 0 10px rgba(0,255,120,0.4),
                0 0 3px gold inset;
        }
        100% {
            box-shadow:
                0 0 30px rgba(0,255,120,1),
                0 0 10px gold inset;
        }
    }
    `;
    document.head.appendChild(style);

    // Dragging logic
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    menu.addEventListener("mousedown", e => {
        dragging = true;
        offsetX = e.clientX - menu.offsetLeft;
        offsetY = e.clientY - menu.offsetTop;
    });

    document.addEventListener("mousemove", e => {
        if (dragging) {
            menu.style.left = (e.clientX - offsetX) + "px";
            menu.style.top  = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => dragging = false);

})();
