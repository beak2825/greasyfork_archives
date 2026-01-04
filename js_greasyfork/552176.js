// ==UserScript==
// @name         Defly.io Neon Zoom Panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a neon color-changing panel to zoom in/out in Defly.io
// @author       King's Group
// @match        https://defly.io/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552176/Deflyio%20Neon%20Zoom%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/552176/Deflyio%20Neon%20Zoom%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create neon panel
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "20px";
    panel.style.right = "20px";
    panel.style.width = "180px";
    panel.style.height = "100px";
    panel.style.zIndex = "999";
    panel.style.padding = "10px";
    panel.style.borderRadius = "10px";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.justifyContent = "space-around";
    panel.style.alignItems = "center";
    panel.style.color = "#00fff0";
    panel.style.fontWeight = "bold";
    panel.style.cursor = "move";
    panel.style.userSelect = "none";
    panel.style.boxShadow = "0 0 15px #00fff0";
    panel.style.transition = "all 0.3s ease";
    panel.style.background = "linear-gradient(270deg,#ff005e,#ff8400,#ffe600,#00ff85,#00c3ff,#8300ff,#ff00b7)";
    panel.style.backgroundSize = "1400% 1400%";
    panel.style.animation = "neonShift 20s ease infinite";

    panel.innerHTML = `
        <div>Zoom Control</div>
        <button id="zoomIn">Zoom In +</button>
        <button id="zoomOut">Zoom Out -</button>
    `;

    document.body.appendChild(panel);

    // Neon animation keyframes
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes neonShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);

    // Draggable panel
    let isDragging = false, offsetX = 0, offsetY = 0;

    panel.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if(isDragging){
            panel.style.left = (e.clientX - offsetX) + "px";
            panel.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", () => { isDragging = false; });

    // Zoom functions
    let zoomLevel = 1;
    const zoomStep = 0.1;
    const gameContainer = document.querySelector("canvas"); // main game canvas

    document.getElementById("zoomIn").addEventListener("click", () => {
        zoomLevel += zoomStep;
        if(gameContainer) gameContainer.style.transform = `scale(${zoomLevel})`;
    });

    document.getElementById("zoomOut").addEventListener("click", () => {
        zoomLevel -= zoomStep;
        if(zoomLevel < 0.5) zoomLevel = 0.5; // minimum zoom
        if(gameContainer) gameContainer.style.transform = `scale(${zoomLevel})`;
    });

    console.log("🚀 Defly.io Neon Zoom Panel Active!");
})();
