// ==UserScript==
// @name         Auto Scroll with Start/Stop Hotkey and Speed Adjustment (c/v)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto scroll webpage with start/stop hotkey and adjustable speed via 'c' and 'v'.
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556979/Auto%20Scroll%20with%20StartStop%20Hotkey%20and%20Speed%20Adjustment%20%28cv%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556979/Auto%20Scroll%20with%20StartStop%20Hotkey%20and%20Speed%20Adjustment%20%28cv%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    let scrollSpeed = 100; // Default scroll speed (ms between each scroll step)
    const minSpeed = 50;   // Minimum scroll speed (ms)
    const maxSpeed = 500;  // Maximum scroll speed (ms)
    const speedIncrement = 25; // Amount to adjust speed by on each key press
    let scrollAmount = 100; // Scroll amount per step (higher = faster scroll)
    let isScrolling = false;
    let scrollInterval;

    // Function to start auto-scrolling
    function startAutoScroll() {
        if (isScrolling) return; // Prevent multiple intervals
        isScrolling = true;
        scrollInterval = setInterval(() => {
            window.scrollBy(0, scrollAmount);
        }, scrollSpeed);
    }

    // Function to stop auto-scrolling
    function stopAutoScroll() {
        if (!isScrolling) return; // If it's not scrolling, do nothing
        isScrolling = false;
        clearInterval(scrollInterval);
    }

    // Function to increase scroll speed
    function increaseScrollSpeed() {
        if (scrollSpeed - speedIncrement >= minSpeed) {
            scrollSpeed -= speedIncrement;
            console.log(`Scroll speed increased to ${scrollSpeed}ms`);
        } else {
            console.log('Already at maximum scroll speed');
        }
    }

    // Function to decrease scroll speed
    function decreaseScrollSpeed() {
        if (scrollSpeed + speedIncrement <= maxSpeed) {
            scrollSpeed += speedIncrement;
            console.log(`Scroll speed decreased to ${scrollSpeed}ms`);
        } else {
            console.log('Already at minimum scroll speed');
        }
    }

    // Event listener for hotkeys (start with 'z', stop with 'x', adjust with 'c' and 'v')
    document.addEventListener('keydown', (event) => {
        if (event.key === 'z') { // 'z' to start scrolling
            startAutoScroll();
        } else if (event.key === 'x') { // 'x' to stop scrolling
            stopAutoScroll();
        } else if (event.key === 'c') { // 'c' to decrease scroll speed
            decreaseScrollSpeed();
        } else if (event.key === 'v') { // 'v' to increase scroll speed
            increaseScrollSpeed();
        }
    });

    console.log('Auto Scroll script loaded. Press "z" to start, "x" to stop, "c" to slow down, and "v" to speed up.');
})();
