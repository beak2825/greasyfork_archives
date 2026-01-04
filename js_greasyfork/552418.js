// ==UserScript==
// @name         Fortnite Aimbot & ESP for Xbox and Chromebook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Aimbot and ESP for Fortnite on Xbox and Chromebook
// @author       Your Name
// @match        https://www.xbox.com/en-US/games/fortnite
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552418/Fortnite%20Aimbot%20%20ESP%20for%20Xbox%20and%20Chromebook.user.js
// @updateURL https://update.greasyfork.org/scripts/552418/Fortnite%20Aimbot%20%20ESP%20for%20Xbox%20and%20Chromebook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to draw ESP boxes around enemies
    function drawESP() {
        const enemies = document.querySelectorAll('.enemy-player'); // Adjust the selector to match the actual class or ID used by Fortnite for enemy players
        enemies.forEach(enemy => {
            const rect = enemy.getBoundingClientRect();
            const espBox = document.createElement('div');
            espBox.style.position = 'absolute';
            espBox.style.left = `${rect.left}px`;
            espBox.style.top = `${rect.top}px`;
            espBox.style.width = `${rect.width}px`;
            espBox.style.height = `${rect.height}px`;
            espBox.style.border = '2px solid red';
            espBox.style.pointerEvents = 'none';
            document.body.appendChild(espBox);
        });
    }

    // Function to implement aimbot
    function aimbot() {
        const enemy = document.querySelector('.enemy-player'); // Adjust the selector to match the actual class or ID used by Fortnite for the closest enemy
        if (enemy) {
            const rect = enemy.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            // Move the mouse to the enemy's position
            const moveMouse = new MouseEvent('mousemove', {
                clientX: x,
                clientY: y,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(moveMouse);
            // Simulate a mouse click
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(clickEvent);
        }
    }

    // Main function to run the script
    function main() {
        setInterval(drawESP, 100); // Update ESP every 100ms
        setInterval(aimbot, 100); // Update aimbot every 100ms
    }

    main();
})();