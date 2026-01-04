// ==UserScript==
// @name         Auto Scroll with Adjustable Speed (c/v)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto scroll webpage with adjustable speed via 'c' and 'v' keys (0.1ms to 1000ms)
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556981/Auto%20Scroll%20with%20Adjustable%20Speed%20%28cv%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556981/Auto%20Scroll%20with%20Adjustable%20Speed%20%28cv%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    let scrollSpeed = 10;   // Default scroll speed in ms (higher = slower)
    const minSpeed = 0.1;    // Minimum scroll speed in ms (fastest)
    const maxSpeed = 1000;   // Maximum scroll speed in ms (slowest)
    const speedIncrement = 0.1; // Increment to adjust the scroll speed (ms)

    let scrollAmount = 10;  // Scroll amount per step (higher = faster scroll)
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

    // Function to increase scroll speed (faster scrolling)
    function increaseScrollSpeed() {
        if (scrollSpeed + speedIncrement <= maxSpeed) {
            scrollSpeed += speedIncrement;
            console.log(`Scroll speed increased to ${scrollSpeed}ms`);
        } else {
            console.log('Scroll speed is already at the maximum setting.');
        }
    }

    // Function to decrease scroll speed (slower scrolling)
    function decreaseScrollSpeed() {
        if (scrollSpeed - speedIncrement >= minSpeed) {
            scrollSpeed -= speedIncrement;
            console.log(`Scroll speed decreased to ${scrollSpeed}ms`);
        } else {
            console.log('Scroll speed is already at the minimum setting.');
        }
    }

    // Event listener for hotkeys (start with 'z', stop with 'x', adjust with 'c' and 'v')
    document.addEventListener('keydown', (event) => {
        if (event.key === 'z') { // 'z' to start scrolling
            startAutoScroll();
        } else if (event.key === 'x') { // 'x' to stop scrolling
            stopAutoScroll();
        } else if (event.key === 'c') { // 'c' to decrease scroll speed (slower)
            decreaseScrollSpeed();
        } else if (event.key === 'v') { // 'v' to increase scroll speed (faster)
            increaseScrollSpeed();
        }
    });

    console.log('Auto Scroll script loaded. Press "z" to start, "x" to stop, "c" to slow down, and "v" to speed up.');
})();
