// ==UserScript==
// @name         pomodoro timer (Full-Screen Timer Watermark with Add Button)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Full-screen timer watermark with a button to add custom time in minutes
// @author       iamnobody
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550475/pomodoro%20timer%20%28Full-Screen%20Timer%20Watermark%20with%20Add%20Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550475/pomodoro%20timer%20%28Full-Screen%20Timer%20Watermark%20with%20Add%20Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timer = 10 * 60; // default 10 minutes
    let intervalId = null;

    // Create full-screen watermark
    const watermark = document.createElement('div');
    watermark.id = 'timerWatermark';
    watermark.style.position = 'fixed';
    watermark.style.top = 0;
    watermark.style.left = 0;
    watermark.style.width = '100%';
    watermark.style.height = '100%';
    watermark.style.display = 'flex';
    watermark.style.alignItems = 'center';
    watermark.style.justifyContent = 'center';
    watermark.style.pointerEvents = 'none'; // clicks pass through
    watermark.style.zIndex = 999998;
    watermark.style.color = 'rgba(255,0,0,0.15)';
    watermark.style.fontSize = '100px';
    watermark.style.fontWeight = 'bold';
    watermark.style.fontFamily = 'Arial, sans-serif';
    watermark.style.userSelect = 'none';
    watermark.style.textAlign = 'center';
    watermark.style.textShadow = '2px 2px 4px rgba(0,0,0,0.2)';
    document.body.appendChild(watermark);

    // Floating + button
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.style.position = 'fixed';
    addButton.style.left = '10px';
    addButton.style.top = '50%';
    addButton.style.transform = 'translateY(-50%)';
    addButton.style.zIndex = 999999;
    addButton.style.width = '50px';
    addButton.style.height = '50px';
    addButton.style.borderRadius = '50%';
    addButton.style.border = 'none';
    addButton.style.background = 'rgba(0,0,0,0.5)';
    addButton.style.color = '#fff';
    addButton.style.fontSize = '30px';
    addButton.style.cursor = 'pointer';
    addButton.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    addButton.style.userSelect = 'none';
    addButton.title = 'Click to add timer (minutes)';
    document.body.appendChild(addButton);

    // Helper to format time
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    // Update watermark
    function updateWatermark() {
        watermark.textContent = timer > 0 ? formatTime(timer) : 'TIME UP!';
    }

    // Timer tick
    function tick() {
        if(timer > 0){
            timer--;
            updateWatermark();
        } else {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Start timer
    function startTimer() {
        if(intervalId) clearInterval(intervalId);
        intervalId = setInterval(tick, 1000);
    }

    updateWatermark();
    startTimer();

    // Click handler to add custom time
    addButton.addEventListener('click', () => {
        const custom = prompt('Enter additional time in minutes:', '5');
        const val = parseInt(custom);
        if(!isNaN(val) && val > 0){
            timer += val * 60;
            updateWatermark();
        }
    });

})();
