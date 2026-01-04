// ==UserScript==
// @name         Popcat.click
// @namespace    http://tampermonkey.net
// @version      5x 2.12
// @description  better simple popcat cheat
// @author       7X12
// @match        https://popcat.click/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548350/Popcatclick.user.js
// @updateURL https://update.greasyfork.org/scripts/548350/Popcatclick.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let intervalId = null;

    // Create the custom keyboard event
    var event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });

    // Function to start the interval of Ctrl+G key presses
    function startCtrlG() {
        intervalId = setInterval(function() {
            for (let i = 0; i < 5; i++) {
                document.dispatchEvent(event); // press start
            }
        }, 50); // Adjusted interval to 50 milliseconds
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
    toggleButton.textContent = 'Start 5x';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px';
    toggleButton.style.fontSize = '16px';

    toggleButton.addEventListener('click', function() {
        if (intervalId === null) {
            startCtrlG();
            toggleButton.textContent = 'Stop 5x';
        } else {
            stopCtrlG();
            toggleButton.textContent = 'Start 5x';
        }
    });

    document.body.appendChild(toggleButton);
})();