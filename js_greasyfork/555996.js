// ==UserScript==
// @name         Deadshot.io Dark Purple Dot Crosshair
// @namespace    http://deadshot.io/
// @version      1.0
// @description  Injects a minimal dark-purple dot crosshair in the center of the screen.
// @author       You
// @match        *://deadshot.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555996/Deadshotio%20Dark%20Purple%20Dot%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/555996/Deadshotio%20Dark%20Purple%20Dot%20Crosshair.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple injections
    if (window.__deadshot_dot_crosshair_injected) return;
    window.__deadshot_dot_crosshair_injected = true;

    // Create the dot element
    const dot = document.createElement('div');
    dot.id = 'deadshot-dot-crosshair';

    Object.assign(dot.style, {
        position: 'fixed',
        left: '50%',
        top: '50%',
        width: '8px',
        height: '8px',
        background: '#5a00ff', // dark purple
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: '2147483647',
    });

    document.body.appendChild(dot);
})();
