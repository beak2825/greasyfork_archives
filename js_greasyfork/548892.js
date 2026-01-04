// ==UserScript==
// @name         Webpage Fullscreen Toggle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to toggle fullscreen mode for any webpage
// @author       ill13
// @match        *://*/*
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/548892/Webpage%20Fullscreen%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/548892/Webpage%20Fullscreen%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the fullscreen toggle button
    const fullscreenButton = document.createElement('button');
    fullscreenButton.textContent = '⛶';
    fullscreenButton.title = 'Toggle Fullscreen';
    fullscreenButton.style.position = 'fixed';
    fullscreenButton.style.bottom = '32px';
    fullscreenButton.style.right = '32px';
    fullscreenButton.style.zIndex = '9999';
    fullscreenButton.style.fontSize = '16px';
    fullscreenButton.style.background = 'none';
    fullscreenButton.style.border = 'none';
    fullscreenButton.style.cursor = 'pointer';
    fullscreenButton.style.color = '#666666';

    // Add hover effect
    fullscreenButton.addEventListener('mouseover', function() {
        this.style.opacity = '0.8';
    });

    fullscreenButton.addEventListener('mouseout', function() {
        this.style.opacity = '1';
    });

    // Function to toggle fullscreen
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            // If not in fullscreen mode, enter fullscreen
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
                fullscreenButton.textContent = '⏹';
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen();
                fullscreenButton.textContent = '⏹';
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari
                document.documentElement.webkitRequestFullscreen();
                fullscreenButton.textContent = '⏹';
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen();
                fullscreenButton.textContent = '⏹';
            }
        } else {
            // If in fullscreen mode, exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenButton.textContent = '⛶';
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
                fullscreenButton.textContent = '⛶';
            } else if (document.webkitExitFullscreen) { // Chrome, Safari
                document.webkitExitFullscreen();
                fullscreenButton.textContent = '⛶';
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
                fullscreenButton.textContent = '⛶';
            }
        }
    }

    // Add click event to the button
    fullscreenButton.addEventListener('click', toggleFullScreen);

    // Listen for fullscreenchange event to update button appearance
    document.addEventListener('fullscreenchange', function() {
        if (document.fullscreenElement) {
            fullscreenButton.textContent = '⏹';
        } else {
            fullscreenButton.textContent = '⛶';
        }
    });

    // Also handle browser-specific events
    document.addEventListener('mozfullscreenchange', function() {
        if (document.mozFullScreenElement) {
            fullscreenButton.textContent = '⏹';
        } else {
            fullscreenButton.textContent = '⛶';
        }
    });

    document.addEventListener('webkitfullscreenchange', function() {
        if (document.webkitFullscreenElement) {
            fullscreenButton.textContent = '⏹';
        } else {
            fullscreenButton.textContent = '⛶';
        }
    });

    document.addEventListener('MSFullscreenChange', function() {
        if (document.msFullscreenElement) {
            fullscreenButton.textContent = '⏹';
        } else {
            fullscreenButton.textContent = '⛶';
        }
    });

    // Add the button to the page
    document.body.appendChild(fullscreenButton);

    // Key shortcut (Alt+F) to toggle fullscreen
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'f') {
            toggleFullScreen();
        }
    });
})();