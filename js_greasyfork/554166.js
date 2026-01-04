// ==UserScript==
// @name         Slow Motion
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Slow down
// @author       KukuModz
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554166/Slow%20Motion.user.js
// @updateURL https://update.greasyfork.org/scripts/554166/Slow%20Motion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let slowFactor = 5; // Change this number to slow down more (5x slower)
    let slowMode = false;

    // Create control panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.padding = '10px';
    panel.style.backgroundColor = 'rgba(0,0,0,0.7)';
    panel.style.color = 'white';
    panel.style.zIndex = '1000000';
    panel.style.borderRadius = '5px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.cursor = 'pointer';
    panel.textContent = 'Enable Slow Motion';
    document.body.appendChild(panel);

    panel.addEventListener('click', () => {
        slowMode = !slowMode;
        panel.textContent = slowMode ? 'Disable Slow Motion' : 'Enable Slow Motion';
        if (slowMode) enableSlowMotion();
        else disableSlowMotion();
    });

    // Store original functions
    const origSetTimeout = window.setTimeout;
    const origSetInterval = window.setInterval;
    const origRequestAnimationFrame = window.requestAnimationFrame;

    let rafMap = new Map();

    function enableSlowMotion() {
        // Slow down setTimeout
        window.setTimeout = function(fn, delay, ...args) {
            return origSetTimeout(fn, delay * slowFactor, ...args);
        };

        // Slow down setInterval
        window.setInterval = function(fn, delay, ...args) {
            return origSetInterval(fn, delay * slowFactor, ...args);
        };

        // Slow down requestAnimationFrame
        window.requestAnimationFrame = function(fn) {
            return origRequestAnimationFrame(timestamp => {
                origSetTimeout(() => fn(timestamp), (1000 / 60) * (slowFactor - 1));
            });
        };

        // Slow down CSS animations
        document.querySelectorAll('*').forEach(el => {
            el.style.animationDuration = getComputedStyle(el).animationDuration.replace('s', '') * slowFactor + 's';
            el.style.transitionDuration = getComputedStyle(el).transitionDuration.replace('s', '') * slowFactor + 's';
        });
    }

    function disableSlowMotion() {
        // Restore original functions
        window.setTimeout = origSetTimeout;
        window.setInterval = origSetInterval;
        window.requestAnimationFrame = origRequestAnimationFrame;

        // Restore CSS animations/transitions
        document.querySelectorAll('*').forEach(el => {
            el.style.animationDuration = '';
            el.style.transitionDuration = '';
        });
    }

})();
