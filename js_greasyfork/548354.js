// ==UserScript==
// @name         popcat.click
// @namespace    http://tampermonkey.net
// @version      30x 2.18
// @description  better simple popcat cheat but you might get detected as a bot
// @author       7X12
// @match        https://popcat.click/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548354/popcatclick.user.js
// @updateURL https://update.greasyfork.org/scripts/548354/popcatclick.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let intervalId = null;

    // Create the custom keyboard event
    var event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });

    // Function to start the interval of Ctrl+G key presses
    function startCtrlG() {
        intervalId = setInterval(function() {
            for (let i = 0; i < 30; i++) {
                document.dispatchEvent(event); // press start
            }
        }, 85); // Adjusted interval to 85 milliseconds
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
    toggleButton.textContent = 'Start 30x';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px';
    toggleButton.style.fontSize = '16px';

    toggleButton.addEventListener('click', function() {
        if (intervalId === null) {
            startCtrlG();
            toggleButton.textContent = 'Stop 30x';
        } else {
            stopCtrlG();
            toggleButton.textContent = 'Start 30x';
        }
    });

    document.body.appendChild(toggleButton);
})();