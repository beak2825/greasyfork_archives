// ==UserScript==
// @name         GeoPixels Energy Overlay (Draggable + Lock)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Always show your current energy with draggable overlay and lock toggle on GeoPixels.net
// @author       john19996741
// @match        https://geopixels.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555875/GeoPixels%20Energy%20Overlay%20%28Draggable%20%2B%20Lock%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555875/GeoPixels%20Energy%20Overlay%20%28Draggable%20%2B%20Lock%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '10px';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';
    overlay.style.background = 'rgba(0, 0, 0, 0.7)';
    overlay.style.color = '#fff';
    overlay.style.padding = '6px 10px';
    overlay.style.borderRadius = '6px';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.fontSize = '14px';
    overlay.style.zIndex = '99999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.gap = '6px';
    overlay.style.cursor = 'move';
    overlay.style.userSelect = 'none';

    // Energy text
    const textEl = document.createElement('span');
    textEl.innerText = 'Energy: ...';
    overlay.appendChild(textEl);

    // Lock/unlock button
    const lockBtn = document.createElement('span');
    lockBtn.innerHTML = '🔒';
    lockBtn.style.cursor = 'pointer';
    lockBtn.style.fontSize = '16px';
    overlay.appendChild(lockBtn);

    document.body.appendChild(overlay);

    let isLocked = true;
    let isDragging = false;
    let offsetX, offsetY;

    // Toggle lock/unlock
    lockBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent drag start
        isLocked = !isLocked;
        lockBtn.innerHTML = isLocked ? '🔒' : '🔓';
        overlay.style.cursor = isLocked ? 'default' : 'move';
    });

    // Drag functionality
    overlay.addEventListener('mousedown', (e) => {
        if (isLocked) return;
        isDragging = true;
        offsetX = e.clientX - overlay.getBoundingClientRect().left;
        offsetY = e.clientY - overlay.getBoundingClientRect().top;
        overlay.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        overlay.style.left = `${e.clientX - offsetX}px`;
        overlay.style.top = `${e.clientY - offsetY}px`;
        overlay.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Update energy display
    function updateEnergyDisplay() {
        const energyEl = document.querySelector('#currentEnergyDisplay');
        if (energyEl) {
            textEl.innerText = 'Energy: ' + energyEl.textContent.trim();
        }
    }

    setInterval(updateEnergyDisplay, 500);
    updateEnergyDisplay();
})();
