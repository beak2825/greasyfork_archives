// ==UserScript==
// @name         Defly.io Full Radar HUD 2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Full radar HUD with moving sweep in Defly.io, dark green sweep line, showing player and enemies
// @author       King's group
// @license      MIT
// @match        *://defly.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552091/Deflyio%20Full%20Radar%20HUD%202.user.js
// @updateURL https://update.greasyfork.org/scripts/552091/Deflyio%20Full%20Radar%20HUD%202.meta.js
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
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);

    // Left panel - Speed
    const speedPanel = document.createElement('div');
    speedPanel.style.color = 'white';
    speedPanel.style.padding = '5px 10px';
    speedPanel.style.borderRadius = '5px';
    speedPanel.style.background = 'rgba(0,0,0,0.7)';
    speedPanel.innerText = 'Speed: 0';
    container.appendChild(speedPanel);

    // Middle panel - Radar canvas
    const radarPanel = document.createElement('canvas');
    radarPanel.width = 200;
    radarPanel.height = 200;
    radarPanel.style.borderRadius = '50%';
    radarPanel.style.background = 'rgba(0,0,0,0.7)';
    container.appendChild(radarPanel);
    const radarCtx = radarPanel.getContext('2d');

    // Right panel - Coordinates
    const coordPanel = document.createElement('div');
    coordPanel.style.color = 'white';
    coordPanel.style.padding = '5px 10px';
    coordPanel.style.borderRadius = '5px';
    coordPanel.style.background = 'rgba(0,0,0,0.7)';
    coordPanel.innerText = 'X: 0, Y: 0';
    container.appendChild(coordPanel);

    // Radar sweep variables
    let sweepAngle = 0;

    // Update HUD
    function updateHUD() {
        const player = window.player;
        const enemies = window.enemies;

        // Update speed and coordinates
        if (player) {
            const { x, y, speed } = player;
            speedPanel.innerText = `Speed: ${Math.round(speed)}`;
            coordPanel.innerText = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
        }

        // Clear radar
        radarCtx.clearRect(0, 0, radarPanel.width, radarPanel.height);

        // Draw radar circle
        radarCtx.strokeStyle = 'darkgreen';
        radarCtx.lineWidth = 2;
        radarCtx.beginPath();
        radarCtx.arc(radarPanel.width/2, radarPanel.height/2, radarPanel.width/2 - 2, 0, Math.PI*2);
        radarCtx.stroke();

        // Draw sweep
        sweepAngle += 0.02; // slow sweep speed
        if (sweepAngle > Math.PI*2) sweepAngle = 0;

        radarCtx.strokeStyle = 'darkgreen';
        radarCtx.lineWidth = 2;
        radarCtx.beginPath();
        radarCtx.moveTo(radarPanel.width/2, radarPanel.height/2);
        radarCtx.lineTo(
            radarPanel.width/2 + Math.cos(sweepAngle)*(radarPanel.width/2 - 2),
            radarPanel.height/2 + Math.sin(sweepAngle)*(radarPanel.height/2 - 2)
        );
        radarCtx.stroke();

        // Draw player dot (always center)
        radarCtx.fillStyle = 'blue';
        radarCtx.beginPath();
        radarCtx.arc(radarPanel.width/2, radarPanel.height/2, 5, 0, Math.PI*2);
        radarCtx.fill();

        // Draw enemies
        if (player && enemies) {
            enemies.forEach(enemy => {
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const radarX = radarPanel.width/2 + dx/10; // scale down
                const radarY = radarPanel.height/2 + dy/10;
                if (radarX > 0 && radarX < radarPanel.width && radarY > 0 && radarY < radarPanel.height) {
                    radarCtx.fillStyle = 'red';
                    radarCtx.beginPath();
                    radarCtx.arc(radarX, radarY, 4, 0, Math.PI*2);
                    radarCtx.fill();
                }
            });
        }
    }

    setInterval(updateHUD, 50); // smooth updates
})();
