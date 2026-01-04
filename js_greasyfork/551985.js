// ==UserScript==
// @name         Diep.io Bullet Tracker (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tracks and visualizes bullets in Diep.io for collision detection
// @author       King's Group
// @author       David Bett
// @match        *://diep.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551985/Diepio%20Bullet%20Tracker%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551985/Diepio%20Bullet%20Tracker%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create canvas overlay
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Function to detect if a bullet is near the player
    function isBulletNearPlayer(bullet, player, threshold = 100) {
        const dx = bullet.x - player.x;
        const dy = bullet.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < threshold;
    }

    // Main drawing function
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Accessing game variables
        const player = window.player; // Assuming 'window.player' holds the player's position
        const bullets = window.bullets; // Assuming 'window.bullets' is an array of bullet objects

        if (!player || !bullets) return;

        // Draw safe zone around player
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(player.x, player.y, 50, 0, Math.PI * 2);
        ctx.stroke();

        // Draw bullets
        bullets.forEach(bullet => {
            // Check if bullet is near the player
            const isNear = isBulletNearPlayer(bullet, player);

            ctx.fillStyle = isNear ? 'red' : 'white';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Update bullet position
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
        });

        requestAnimationFrame(draw);
    }

    draw();
})();
