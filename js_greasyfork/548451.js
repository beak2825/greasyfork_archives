// ==UserScript==
// @name         Popcat.click cheat
// @namespace    http://tampermonkey.net
// @version      1x 1.0
// @description  popcat cheat thats the simplest 1 tap per ms
// @author       7X12
// @match        https://popcat.click/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548451/Popcatclick%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/548451/Popcatclick%20cheat.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let intervalId = null;

    // Create the custom keyboard event
    var event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });

    // Function to start the interval of Ctrl+G key presses
    function startCtrlG() {
        intervalId = setInterval(function() {
            for (let i = 0; i < 1; i++) {
                document.dispatchEvent(event); // press start
            }
        }, 30); // Adjusted interval to 30 milliseconds
    }

    // Function to stop the interval
    function stopCtrlG() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Create toggle buttons to start/stop the simulation
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Start 1x';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px';
    toggleButton.style.fontSize = '16px';

    toggleButton.addEventListener('click', function() {
        if (intervalId === null) {
            startCtrlG();
            toggleButton.textContent = 'Stop 1x';
        } else {
            stopCtrlG();
            toggleButton.textContent = 'Start 1x';
        }
    });

    document.body.appendChild(toggleButton);
})();