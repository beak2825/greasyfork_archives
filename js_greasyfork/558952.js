// ==UserScript==
// @name         Bloxd.io Crosshair "+" with Black Outline and vConsole
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds "+" crosshair with small black outline to Bloxd.io, controllable via vConsole
// @author       You
// @match        https://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558952/Bloxdio%20Crosshair%20%22%2B%22%20with%20Black%20Outline%20and%20vConsole.user.js
// @updateURL https://update.greasyfork.org/scripts/558952/Bloxdio%20Crosshair%20%22%2B%22%20with%20Black%20Outline%20and%20vConsole.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create crosshair element
    const crosshair = document.createElement('div');
    crosshair.style.position = 'fixed';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.fontSize = '30px';
    crosshair.style.color = 'white';
    // Small black outline
    crosshair.style.textShadow = '1px 1px 0 black, -1px 1px 0 black, 1px -1px 0 black, -1px -1px 0 black';
    crosshair.style.pointerEvents = 'none';
    crosshair.style.zIndex = '9999';
    crosshair.style.userSelect = 'none';
    crosshair.textContent = '+';
    document.body.appendChild(crosshair);

    // Expose API to window for vConsole
    window.crosshair = {
        toggle: () => {
            crosshair.style.display = crosshair.style.display === 'none' ? 'block' : 'none';
        },
        setColor: (color) => {
            crosshair.style.color = color;
        },
        setSize: (size) => {
            crosshair.style.fontSize = `${size}px`;
        }
    };

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if(e.key === 'C') window.crosshair.toggle();
        if(e.key === 'V') window.crosshair.setColor('red');
        if(e.key === 'X') window.crosshair.setSize(50); // example size change
    });
})();