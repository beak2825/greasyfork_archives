// ==UserScript==
// @name         Defly.io Auto Radar Overlay
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-detects player and enemies, shows radar with sweep line
// @author       King's Group
// @match        *://defly.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551986/Deflyio%20Auto%20Radar%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/551986/Deflyio%20Auto%20Radar%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create canvas overlay
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '10px';
    canvas.style.right = '10px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const radarRadius = 100; // radar size
    canvas.width = radarRadius * 2 + 20;
    canvas.height = radarRadius * 2 + 20;

    const sweepSpeed = 0.02; // sweep line rotation speed
    const detectionRange = 500; // max distance for radar

    function drawRadar(player, enemies) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Radar circle
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Center dot (player)
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Enemies
        enemies.forEach(enemy => {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;

            const scale = radarRadius / detectionRange;
            const ex = centerX + dx * scale;
            const ey = centerY + dy * scale;

            if (Math.sqrt((dx*scale)**2 + (dy*scale)**2) <= radarRadius) {
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(ex, ey, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Sweep line
        const angle = (Date.now() * sweepSpeed) % (Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,255,0,0.5)';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radarRadius * Math.cos(angle), centerY + radarRadius * Math.sin(angle));
        ctx.stroke();
    }

    function getGameData() {
        let player = {x: 0, y: 0};
        let enemies = [];

        try {
            // Attempt to detect player and tanks from Defly.io internal memory
            const tanks = Object.values(window.entities || {}); // window.entities usually holds all tanks
            tanks.forEach(t => {
                if (!t || !t.id) return;
                if (t.isYou) player = {x: t.x, y: t.y};
                else enemies.push({x: t.x, y: t.y});
            });
        } catch (e) {
            // fallback: empty arrays if variables not found
        }

        return {player, enemies};
    }

    function loop() {
        const {player, enemies} = getGameData();
        drawRadar(player, enemies);
        requestAnimationFrame(loop);
    }

    loop();
})();
