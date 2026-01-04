// ==UserScript==
// @name         Powerline.io UI Enhancer Panel
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a draggable, color-changing overlay panel for trail effects, name colors, enemy trail fade, score overlay, and boost countdown in Powerline.io (visual-only, client-side).  
// @author       King's group
// @license      MIT
// @match        http://powerline.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552086/Powerlineio%20UI%20Enhancer%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/552086/Powerlineio%20UI%20Enhancer%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    let settings = {
        trailEffects: false,
        nameColors: false,
        enemyTrailFade: false,
        showScore: false,
        boostCountdown: false
    };

    // Create draggable panel
    const panel = document.createElement('div');
    panel.id = 'plio-enhancer-panel';
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '20px';
    panel.style.width = '220px';
    panel.style.background = '#000';
    panel.style.color = '#fff';
    panel.style.border = '3px solid #ff0000';
    panel.style.borderRadius = '8px';
    panel.style.padding = '10px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.fontSize = '13px';
    panel.style.zIndex = 99999;
    panel.style.cursor = 'move';
    panel.style.transition = 'border-color 2s linear';

    panel.innerHTML = `
        <div style="font-weight:bold;margin-bottom:6px;">Powerline.io Enhancer</div>
        <label><input type="checkbox" id="plio-trail"> Trail Effects</label><br>
        <label><input type="checkbox" id="plio-name"> Name/Tag Colors</label><br>
        <label><input type="checkbox" id="plio-enemy"> Enemy Trail Fade</label><br>
        <label><input type="checkbox" id="plio-score"> Score Overlay</label><br>
        <label><input type="checkbox" id="plio-boost"> Boost Countdown</label>
    `;
    document.body.appendChild(panel);

    // Color cycle for panel border
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        panel.style.borderColor = `hsl(${hue}, 100%, 50%)`;
    }, 100);

    // Draggable functionality
    let isDragging = false, offsetX = 0, offsetY = 0;
    panel.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
        panel.style.transition = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            panel.style.left = e.clientX - offsetX + 'px';
            panel.style.top = e.clientY - offsetY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
    });
    document.addEventListener('mouseup', () => { isDragging = false; panel.style.transition = 'border-color 2s linear'; });

    // Toggle settings
    document.getElementById('plio-trail').addEventListener('change', e => { settings.trailEffects = e.target.checked; });
    document.getElementById('plio-name').addEventListener('change', e => { settings.nameColors = e.target.checked; });
    document.getElementById('plio-enemy').addEventListener('change', e => { settings.enemyTrailFade = e.target.checked; });
    document.getElementById('plio-score').addEventListener('change', e => { settings.showScore = e.target.checked; });
    document.getElementById('plio-boost').addEventListener('change', e => { settings.boostCountdown = e.target.checked; });

    // Example hooks for visual enhancements (client-side only)
    // You can expand this to apply actual canvas/DOM effects
    function updateVisuals() {
        if (settings.trailEffects) {
            // Placeholder: logic for trail effect
        }
        if (settings.nameColors) {
            // Placeholder: logic for local name color change
        }
        if (settings.enemyTrailFade) {
            // Placeholder: logic to fade enemy trails
        }
        if (settings.showScore) {
            // Placeholder: logic to overlay score
        }
        if (settings.boostCountdown) {
            // Placeholder: logic to show boost timer
        }
        requestAnimationFrame(updateVisuals);
    }

    requestAnimationFrame(updateVisuals);

})();
