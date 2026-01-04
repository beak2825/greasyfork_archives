// ==UserScript==
// @name         Torn Snowfall Overlay
// @namespace    https://torn.com/
// @version      1.0
// @description  Adds falling snow over Torn's background but behind UI elements
// @author       2115907
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560222/Torn%20Snowfall%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/560222/Torn%20Snowfall%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Prevent duplicate injection
    if (document.getElementById("torn-snow-container")) return;

    // Create snow container
    const snowContainer = document.createElement("div");
    snowContainer.id = "torn-snow-container";

    // Style container
    Object.assign(snowContainer.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "2", // above background, below UI
        overflow: "hidden"
    });

    document.body.appendChild(snowContainer);

    // Inject CSS
    const style = document.createElement("style");
    style.textContent = `
        .snowflake {
            position: absolute;
            top: -10px;
            color: white;
            font-size: var(--size);
            opacity: var(--opacity);
            animation: fall linear infinite;
            filter: drop-shadow(0 0 2px rgba(255,255,255,0.5));
        }

        @keyframes fall {
            0% {
                transform: translateX(0) translateY(-10px);
            }
            100% {
                transform: translateX(var(--drift)) translateY(110vh);
            }
        }
    `;
    document.head.appendChild(style);

    // Create snowflakes
    const snowflakeCount = 45;

    for (let i = 0; i < snowflakeCount; i++) {
        const flake = document.createElement("div");
        flake.className = "snowflake";
        flake.innerHTML = "❄";

        const size = Math.random() * 10 + 8;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 10;
        const drift = (Math.random() * 200 - 100) + "px";
        const opacity = Math.random() * 0.6 + 0.3;

        flake.style.left = Math.random() * 100 + "vw";
        flake.style.setProperty("--size", size + "px");
        flake.style.setProperty("--drift", drift);
        flake.style.setProperty("--opacity", opacity);
        flake.style.animationDuration = `${duration}s`;
        flake.style.animationDelay = `${delay}s`;

        snowContainer.appendChild(flake);
    }

})();