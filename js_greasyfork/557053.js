// ==UserScript==
// @name         Bloxd.io Ultimate v6 Pro
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Ultimate v6 Pro: Global Toggle All, Auto Respawn, Deny Teleport, Custom Crosshair, Draggable GUI, Mobile & Desktop Ready. Author: Hidayat+ChatGPT
// @author       Hidayat+ChatGPT
// @match        https://bloxd.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557053/Bloxdio%20Ultimate%20v6%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/557053/Bloxdio%20Ultimate%20v6%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== CONFIG =====
    const CROSSHAIRS = [
        {name: "Classic", char: "✚"},
        {name: "Dot", char: "●"},
        {name: "X", char: "✖"},
        {name: "Star", char: "✦"},
        {name: "Chevron", char: "❯"},
    ];
    const CROSSHAIR_COLORS = ["#00FFFF","#FF0000","#00FF00","#FFFF00","#FFFFFF","#FFA500"];
    let selectedCrosshair = 0;
    let selectedColor = 0;

    let isAutoRespawn = false;
    let isAutoDenyTeleport = false;
    let globalToggle = false;

    // ===== GUI =====
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.top = '5vh';
    gui.style.left = '2vw';
    gui.style.backgroundColor = 'rgba(75,0,130,0.9)';
    gui.style.color = 'white';
    gui.style.border = '1px solid #333';
    gui.style.padding = '10px';
    gui.style.borderRadius = '8px';
    gui.style.zIndex = '9999';
    gui.style.fontSize = '16px';
    gui.style.cursor = 'grab';
    gui.style.maxWidth = '90vw';
    gui.style.maxHeight = '70vh';
    gui.style.overflowY = 'auto';
    gui.innerHTML = "<strong>v6 Ultimate Pro</strong><br>";

    function createButton(label, callback) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.margin = '5px 0';
        btn.style.padding = '10px';
        btn.style.fontSize = '16px';
        btn.onclick = callback;
        return btn;
    }

    // ===== Global Toggle =====
    const globalBtn = createButton("Enable All Features", () => {
        globalToggle = !globalToggle;
        isAutoRespawn = globalToggle;
        isAutoDenyTeleport = globalToggle;
        globalBtn.textContent = globalToggle ? "Disable All Features" : "Enable All Features";
        respawnBtn.textContent = isAutoRespawn ? "Disable Auto Respawn" : "Enable Auto Respawn";
        teleportBtn.textContent = isAutoDenyTeleport ? "Disable Auto Deny Teleport" : "Enable Auto Deny Teleport";
    });

    // Auto Respawn toggle
    const respawnBtn = createButton("Enable Auto Respawn", () => {
        isAutoRespawn = !isAutoRespawn;
        respawnBtn.textContent = isAutoRespawn ? "Disable Auto Respawn" : "Enable Auto Respawn";
    });

    // Auto Deny Teleport toggle
    const teleportBtn = createButton("Enable Auto Deny Teleport", () => {
        isAutoDenyTeleport = !isAutoDenyTeleport;
        teleportBtn.textContent = isAutoDenyTeleport ? "Disable Auto Deny Teleport" : "Enable Auto Deny Teleport";
    });

    // Crosshair settings
    const crosshairBtn = createButton("Next Crosshair", () => {
        selectedCrosshair = (selectedCrosshair + 1) % CROSSHAIRS.length;
        updateCrosshair();
    });

    const colorBtn = createButton("Next Crosshair Color", () => {
        selectedColor = (selectedColor + 1) % CROSSHAIR_COLORS.length;
        updateCrosshair();
    });

    gui.appendChild(globalBtn);
    gui.appendChild(respawnBtn);
    gui.appendChild(teleportBtn);
    gui.appendChild(crosshairBtn);
    gui.appendChild(colorBtn);

    document.body.appendChild(gui);

    // ===== Draggable GUI =====
    let isDragging = false, offsetX = 0, offsetY = 0;

    gui.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - gui.getBoundingClientRect().left;
        offsetY = e.clientY - gui.getBoundingClientRect().top;
        gui.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup', () => {
        isDragging = false;
        gui.style.cursor = 'grab';
    });
    window.addEventListener('mousemove', e => {
        if(!isDragging) return;
        gui.style.left = `${e.clientX - offsetX}px`;
        gui.style.top = `${e.clientY - offsetY}px`;
    });

    // Touch support
    gui.addEventListener('touchstart', e => {
        isDragging = true;
        offsetX = e.touches[0].clientX - gui.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - gui.getBoundingClientRect().top;
    });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', e => {
        if(!isDragging) return;
        gui.style.left = `${e.touches[0].clientX - offsetX}px`;
        gui.style.top = `${e.touches[0].clientY - offsetY}px`;
    });

    // ===== Crosshair =====
    const crosshairEl = document.createElement('div');
    crosshairEl.style.position = 'fixed';
    crosshairEl.style.top = '50vh';
    crosshairEl.style.left = '50vw';
    crosshairEl.style.transform = 'translate(-50%, -50%)';
    crosshairEl.style.fontSize = '3vh';
    crosshairEl.style.color = CROSSHAIR_COLORS[selectedColor];
    crosshairEl.style.zIndex = '9999';
    crosshairEl.style.pointerEvents = 'none';
    crosshairEl.textContent = CROSSHAIRS[selectedCrosshair].char;
    document.body.appendChild(crosshairEl);

    function updateCrosshair() {
        crosshairEl.textContent = CROSSHAIRS[selectedCrosshair].char;
        crosshairEl.style.color = CROSSHAIR_COLORS[selectedColor];
    }

    // ===== Auto Functions =====
    function autoRespawn() {
        if(!isAutoRespawn) return;
        const btn = document.querySelector('.RespawnButton');
        if(btn && !btn.disabled) btn.click();
    }

    function autoDenyTeleport() {
        if(!isAutoDenyTeleport) return;
        const btn = document.querySelector('.UiReqDismissButt');
        if(btn) btn.click();
    }

    setInterval(autoRespawn, 1000);
    setInterval(autoDenyTeleport, 1000);

})();
