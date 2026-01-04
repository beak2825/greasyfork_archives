// ==UserScript==
// @name         Defly.io Sonar Radar Visible Sweep
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Sonar radar with visible sweep line and flashing enemies
// @author       King's Group
// @match        *://defly.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551982/Deflyio%20Sonar%20Radar%20Visible%20Sweep.user.js
// @updateURL https://update.greasyfork.org/scripts/551982/Deflyio%20Sonar%20Radar%20Visible%20Sweep.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '10px';
    canvas.style.right = '10px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const radarRadius = 100;
    canvas.width = radarRadius * 2 + 20;
    canvas.height = radarRadius * 2 + 20;

    const sweepSpeed = 0.002; // slow sweep
    const detectionRange = 500;

    let sweepAngle = 0;

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

        // Player dot
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw enemies when sweep passes
        enemies.forEach(enemy => {
            const dx = enemy.x - player.x;
            const dy = enemy.y - player.y;
            const scale = radarRadius / detectionRange;
            const ex = centerX + dx * scale;
            const ey = centerY + dy * scale;

            if (Math.sqrt((dx*scale)**2 + (dy*scale)**2) <= radarRadius) {
                const angleToEnemy = Math.atan2(ey - centerY, ex - centerX);
                let diff = sweepAngle - angleToEnemy;
                diff = Math.atan2(Math.sin(diff), Math.cos(diff));

                if (Math.abs(diff) < 0.15) {
                    ctx.fillStyle = 'red';
                    ctx.beginPath();
                    ctx.arc(ex, ey, 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });

        // Sweep line (fully visible)
        ctx.strokeStyle = 'lime'; // brighter green
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + radarRadius * Math.cos(sweepAngle), centerY + radarRadius * Math.sin(sweepAngle));
        ctx.stroke();
    }

    function findTanks() {
        let player = {x: 0, y: 0};
        let enemies = [];

        // Scan window for objects that look like tanks
        for (const key in window) {
            const obj = window[key];
            if (obj && typeof obj === 'object') {
                try {
                    if ('x' in obj && 'y' in obj && 'id' in obj) {
                        if (obj.isYou) player = {x: obj.x, y: obj.y};
                        else enemies.push({x: obj.x, y: obj.y});
                    }
                } catch (e) { continue; }
            }
        }

        return {player, enemies};
    }

    function loop() {
        sweepAngle += sweepSpeed * 16; // fixed increment for visibility
        sweepAngle %= Math.PI * 2;

        const {player, enemies} = findTanks();
        drawRadar(player, enemies);
        requestAnimationFrame(loop);
    }

    loop();
})();

