// ==UserScript==
// @name         Universal Anti-cheat Bypass
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Block page event listeners, stop propagation, and log removed events in a toggleable GUI to stop detectors like anti-cheats detecting it, Press Ctrl Shift + H to toggle
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563777/Universal%20Anti-cheat%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/563777/Universal%20Anti-cheat%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of events to block
    const blockedEvents = [
        'copy', 'cut', 'paste',
        'contextmenu',
        'fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange',
        'resize',
        'blur', 'focusout', 'visibilitychange'
    ];

    // Create the GUI container
    const gui = document.createElement('div');
    gui.style.position = 'fixed';
    gui.style.bottom = '10px';
    gui.style.right = '10px';
    gui.style.width = '300px';
    gui.style.height = '200px';
    gui.style.backgroundColor = 'rgba(0,0,0,0.8)';
    gui.style.color = 'white';
    gui.style.fontFamily = 'monospace';
    gui.style.fontSize = '12px';
    gui.style.overflowY = 'auto';
    gui.style.padding = '10px';
    gui.style.borderRadius = '8px';
    gui.style.zIndex = 999999;
    gui.style.display = 'none'; // hidden by default
    gui.style.boxShadow = '0 0 10px red';
    gui.innerHTML = '<b>Event Blocker Log</b><br>';

    document.body.appendChild(gui);

    // Toggle GUI with a hotkey (Ctrl+Shift+H)
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
            gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
        }
    });

    function logEvent(msg) {
        const line = document.createElement('div');
        line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        gui.appendChild(line);
        gui.scrollTop = gui.scrollHeight; // auto scroll
    }

    // Stop propagation for existing events
    blockedEvents.forEach(event => {
        window.addEventListener(event, e => {
            e.stopImmediatePropagation(); // stop other listeners
        }, true); // capture phase
    });

    // Override addEventListener to block future listeners
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockedEvents.includes(type)) {
            logEvent(`Removed listener for: ${type}`);
            return; // ignore it
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    logEvent('Event Blocker GUI initialized. Press Ctrl+Shift+H to toggle.');
})();
