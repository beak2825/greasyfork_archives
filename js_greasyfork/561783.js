// ==UserScript==
// @name         Hold Space Auto Clicker (50 CPS)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hold Space to auto left-click at 50 clicks per second
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561783/Hold%20Space%20Auto%20Clicker%20%2850%20CPS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561783/Hold%20Space%20Auto%20Clicker%20%2850%20CPS%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let intervalId = null;
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function clickAtCursor() {
        const target = document.elementFromPoint(mouseX, mouseY);
        if (!target) return;

        const eventOptions = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: mouseX,
            clientY: mouseY,
            button: 0
        };

        target.dispatchEvent(new MouseEvent('mousedown', eventOptions));
        target.dispatchEvent(new MouseEvent('mouseup', eventOptions));
        target.dispatchEvent(new MouseEvent('click', eventOptions));
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !e.repeat) {
            e.preventDefault();

            if (!intervalId) {
                intervalId = setInterval(clickAtCursor, 20); // 50 CPS
                console.log('Auto clicker running (Space held)');
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();

            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                console.log('Auto clicker stopped (Space released)');
            }
        }
    });
})();
