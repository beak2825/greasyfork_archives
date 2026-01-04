// ==UserScript==
// @name         Defly.io HUD with Radar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Displays speed, radar, and coordinates in Defly.io with color-changing panels
// @author       King's group
// @license      MIT
// @match        *://defly.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552089/Deflyio%20HUD%20with%20Radar.user.js
// @updateURL https://update.greasyfork.org/scripts/552089/Deflyio%20HUD%20with%20Radar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create container for HUD
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.display = 'flex';
    container.style.gap = '10px';
    container.style.zIndex = '9999';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.pointerEvents = 'none'; // Prevent interaction with HUD
    document.body.appendChild(container);

    // Left panel - Speed
    const speedPanel = document.createElement('div');
    speedPanel.style.color = 'white';
    speedPanel.style.padding = '5px 10px';
    speedPanel.style.borderRadius = '5px';
    speedPanel.innerText = 'Speed: 0';
    container.appendChild(speedPanel);

    // Middle panel - Radar
    const radarPanel = document.createElement('canvas');
    radarPanel.width = 150;
    radarPanel.height = 150;
    radarPanel.style.borderRadius = '5px';
    container.appendChild(radarPanel);
    const radarCtx = radarPanel.getContext('2d');

    // Right panel - Coordinates
    const coordPanel = document.createElement('div');
    coordPanel.style.color = 'white';
    coordPanel.style.padding = '5px 10px';
    coordPanel.style.borderRadius = '5px';
    coordPanel.innerText = 'X: 0, Y: 0';
    container.appendChild(coordPanel);

    // Function to generate a changing color (cycling hue)
    let hue = 0;
    function getColor() {
        hue += 0.5; // change speed here
        if (hue > 360) hue = 0;
        return `hsl(${hue}, 80%, 40%)`;
    }

    // Function to update HUD
    function updateHUD() {
        // Accessing player and enemy data
        const player = window.player;
        const enemies = window.enemies;

        if (player) {
            const { x, y, speed } = player;
            speedPanel.innerText = `Speed: ${Math.round(speed)}`;
            coordPanel.innerText = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;

            // Radar drawing
            radarCtx.clearRect(0, 0, radarPanel.width, radarPanel.height);
            radarCtx.fillStyle = 'blue';
            radarCtx.beginPath();
            radarCtx.arc(radarPanel.width / 2, radarPanel.height / 2, 5, 0, Math.PI * 2);
            radarCtx.fill();

            radarCtx.fillStyle = 'red';
            if (enemies) {
                enemies.forEach(enemy => {
                    const dx = enemy.x - x;
                    const dy = enemy.y - y;
                    const radarX = radarPanel.width / 2 + dx / 5;
                    const radarY = radarPanel.height / 2 + dy / 5;
                    if (radarX > 0 && radarX < radarPanel.width && radarY > 0 && radarY < radarPanel.height) {
                        radarCtx.beginPath();
                        radarCtx.arc(radarX, radarY, 3, 0, Math.PI * 2);
                        radarCtx.fill();
                    }
                });
            }
        }

        // Update panel backgrounds with changing colors
        const color = getColor();
        speedPanel.style.background = color;
        radarPanel.style.background = color;
        coordPanel.style.background = color;
    }

    // Update HUD every 100ms
    setInterval(updateHUD, 100);
})();
