// ==UserScript==
// @name         Deadshot.io Dot Crosshair
// @namespace    https://greasyfork.org/users/yourname
// @version      1.0
// @description  Adds a simple red dot crosshair at the center of the screen on deadshot.io.
// @match        *://deadshot.io/*
// @match        *://*.deadshot.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555586/Deadshotio%20Dot%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/555586/Deadshotio%20Dot%20Crosshair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple injections
    if (window.__deadshot_dot_crosshair_injected) return;
    window.__deadshot_dot_crosshair_injected = true;

    // Create the dot element
    const dot = document.createElement('div');
    dot.id = 'deadshot-dot-crosshair';

    // Style it as a small red circle in the exact center
    Object.assign(dot.style, {
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: '8px',
        height: '8px',
        background: '#ff0000',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',  // don't block game input
        zIndex: '2147483647',   // top of everything
    });

    // Add it to the page
    document.body.appendChild(dot);
})();
