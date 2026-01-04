// ==UserScript==
// @name         Bloxd.io Crosshair Pulse (R/F)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press R or F to make the crosshair quickly grow then shrink
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559868/Bloxdio%20Crosshair%20Pulse%20%28RF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559868/Bloxdio%20Crosshair%20Pulse%20%28RF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ----------------------------
    // Config
    // ----------------------------
    const BASE_SIZE = 20;      // normal size
    const PULSE_SIZE = 45;     // how big it gets during pulse
    const PULSE_SPEED = 90;    // ms to grow
    const SHRINK_SPEED = 90;   // ms to shrink back

    // ----------------------------
    // Create crosshair
    // ----------------------------
    const crosshair = document.createElement('div');
    Object.assign(crosshair.style, {
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: BASE_SIZE + 'px',
        height: BASE_SIZE + 'px',
        pointerEvents: 'none',
        zIndex: '999999',
        borderLeft: '2px solid white',
        borderTop: '2px solid white',
        borderRight: '2px solid white',
        borderBottom: '2px solid white',
        filter: 'drop-shadow(0 0 2px black)',
        transition: `width ${PULSE_SPEED}ms ease, height ${PULSE_SPEED}ms ease`
    });
    document.body.appendChild(crosshair);

    let pulsing = false;

    // ----------------------------
    // Pulse animation
    // ----------------------------
    function pulse() {
        if (pulsing) return; // prevent spam overlap
        pulsing = true;

        // grow
        crosshair.style.width = PULSE_SIZE + 'px';
        crosshair.style.height = PULSE_SIZE + 'px';

        // shrink back
        setTimeout(() => {
            crosshair.style.width = BASE_SIZE + 'px';
            crosshair.style.height = BASE_SIZE + 'px';

            // allow next pulse after shrink finishes
            setTimeout(() => {
                pulsing = false;
            }, SHRINK_SPEED);

        }, PULSE_SPEED);
    }

    // ----------------------------
    // Keybinds
    // ----------------------------
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'r' || key === 'f') {
            pulse();
        }
    });
})();
