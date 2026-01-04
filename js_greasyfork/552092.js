// ==UserScript==
// @name         Defly.io Enhanced Radar HUD 3
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Real-time radar with player and enemy tracking in Defly.io
// @author       King's group
// @license      MIT
// @match        *://defly.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552092/Deflyio%20Enhanced%20Radar%20HUD%203.user.js
// @updateURL https://update.greasyfork.org/scripts/552092/Deflyio%20Enhanced%20Radar%20HUD%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create HUD container
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

    // WebSocket interception
    let ws;
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        if (data instanceof ArrayBuffer) {
            const view = new DataView(data);
            // Check for player position update packet
            if (view.byteLength > 10 && view.getUint8(0) === 0x01) {
                const x = view.getFloat32(1, true);
                const y = view.getFloat32(5, true);
                const speed = Math.sqrt(view.getFloat32(9, true) ** 2 + view.getFloat32(13, true) ** 2);
                updateHUD(x, y, speed);
            }
        }
        originalSend.call(this, data);
    };

    // Update HUD with player data
    function updateHUD(x, y, speed) {
        speedPanel.innerText = `Speed: ${speed.toFixed(2)}`;
        coordPanel.innerText = `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`;
        drawRadar(x, y);
    }

    // Draw radar with player and enemy positions
    function drawRadar(playerX, playerY) {
        radarCtx.clearRect(0, 0, radarPanel.width, radarPanel.height);

        // Draw radar circle
        radarCtx.strokeStyle = 'darkgreen';
        radarCtx.lineWidth = 2;
        radarCtx.beginPath();
        radarCtx.arc(radarPanel.width / 2, radarPanel.height / 2, radarPanel.width / 2 - 2, 0, Math.PI * 2);
        radarCtx.stroke();

        // Draw sweep
        const sweepAngle = (Date.now() / 100) % (2 * Math.PI);
        radarCtx.strokeStyle = 'darkgreen';
        radarCtx.lineWidth = 2;
        radarCtx.beginPath();
        radarCtx.moveTo(radarPanel.width / 2, radarPanel.height / 2);
        radarCtx.lineTo(
            radarPanel.width / 2 + Math.cos(sweepAngle) * (radarPanel.width / 2 - 2),
            radarPanel.height / 2 + Math.sin(sweepAngle) * (radarPanel.height / 2 - 2)
        );
        radarCtx.stroke();

        // Draw player dot
        radarCtx.fillStyle = 'blue';
        radarCtx.beginPath();
        radarCtx.arc(radarPanel.width / 2, radarPanel.height / 2, 5, 0, Math.PI * 2);
        radarCtx.fill();

        // Draw enemies
        // Assuming enemies data is available in a global variable `enemies`
        if (window.enemies) {
            window.enemies.forEach(enemy => {
                const dx = enemy.x - playerX;
                const dy = enemy.y - playerY;
                const radarX = radarPanel.width / 2 + dx / 10;
                const radarY = radarPanel.height / 2 + dy / 10;
                if (radarX > 0 && radarX < radarPanel.width && radarY > 0 && radarY < radarPanel.height) {
                    radarCtx.fillStyle = 'red';
                    radarCtx.beginPath();
                    radarCtx.arc(radarX, radarY, 4, 0, Math.PI * 2);
                    radarCtx.fill();
                }
            });
        }
    }

})();
