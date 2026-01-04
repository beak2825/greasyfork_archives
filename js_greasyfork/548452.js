// ==UserScript==
// @name         Popcat.click chaos
// @namespace    http://tampermonkey.net
// @version      80x 1.0
// @description  absolute chaos
// @author       7X12
// @match        https://popcat.click/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548452/Popcatclick%20chaos.user.js
// @updateURL https://update.greasyfork.org/scripts/548452/Popcatclick%20chaos.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let intervalId = null;

    // Create the custom keyboard event
    var event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });

    // Function to start the interval of Ctrl+G key presses
    function startCtrlG() {
        intervalId = setInterval(function() {
            for (let i = 0; i < 80; i++) {
                document.dispatchEvent(event); // press start
            }
        }, 60); // Adjusted interval to 60 milliseconds
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
    toggleButton.textContent = 'Start 80x';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '100px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px';
    toggleButton.style.fontSize = '16px';

    toggleButton.addEventListener('click', function() {
        if (intervalId === null) {
            startCtrlG();
            toggleButton.textContent = 'Stop chaos';
        } else {
            stopCtrlG();
            toggleButton.textContent = 'Start chaos';
        }
    });

    document.body.appendChild(toggleButton);
})();