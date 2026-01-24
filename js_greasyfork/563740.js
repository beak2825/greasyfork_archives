// ==UserScript==
// @name         Enlarged Custom Tooltips on YouTube
// @namespace    Violentmonkey Scripts
// @match        *://www.youtube.com/*
// @grant        none
// @version      1.0
// @author       -
// @description  Replaces native browser tooltips with a large, styled custom version
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563740/Enlarged%20Custom%20Tooltips%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/563740/Enlarged%20Custom%20Tooltips%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tooltip = document.createElement('div');
    // Set a very high z-index and ensure it's on top of YouTube's player
    Object.assign(tooltip.style, {
        position: 'fixed',
        display: 'none',
        padding: '10px 15px',
        backgroundColor: '#282828',
        color: '#ffffff',
        fontSize: '22px', // ADJUST THIS TO CHANGE TEXT SIZE
        fontFamily: 'Roboto, Arial, sans-serif',
        borderRadius: '4px',
        zIndex: '2147483647',
        pointerEvents: 'none',
        border: '1px solid #444',
        boxShadow: '0px 4px 15px rgba(0,0,0,0.8)',
        maxWidth: '500px',
        lineHeight: '1.4'
    });

    // Append to documentElement so it exists even before <body> is ready
    document.documentElement.appendChild(tooltip);

    // Use "Capture" phase (true) to ensure we catch events before YouTube's own scripts
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('[title]');
        if (target && target.title !== '') {
            target.dataset.customTitle = target.title;
            target.removeAttribute('title'); // Fully remove to kill native tooltip

            tooltip.textContent = target.dataset.customTitle;
            tooltip.style.display = 'block';
        }
    }, true);

    document.addEventListener('mousemove', (e) => {
        if (tooltip.style.display === 'block') {
            const gap = 20;
            // Basic collision detection for screen edges
            let x = e.clientX + gap;
            let y = e.clientY + gap;

            if (x + tooltip.offsetWidth > window.innerWidth) {
                x = e.clientX - tooltip.offsetWidth - gap;
            }
            if (y + tooltip.offsetHeight > window.innerHeight) {
                y = e.clientY - tooltip.offsetHeight - gap;
            }

            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('[data-custom-title]');
        if (target) {
            target.title = target.dataset.customTitle;
            tooltip.style.display = 'none';
        }
    }, true);
})();