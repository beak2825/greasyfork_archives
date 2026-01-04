// ==UserScript==
// @name         Auto Scroll Down
// @description  Scrolls down a webpage automatically until stopped
// @match        *://*/*
// @version 0.0.1.20250904031349
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/548301/Auto%20Scroll%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/548301/Auto%20Scroll%20Down.meta.js
// ==/UserScript==

(function() {
    let intervalId;
    
    // Start scrolling down
    function startScrolling() {
        intervalId = setInterval(() => {
            window.scrollBy(0, 10000); // Scroll down by 100px
        }, 10); // Repeat every 100ms
    }

    // Stop scrolling
    function stopScrolling() {
        clearInterval(intervalId);
    }

    // Start the scrolling on page load
    startScrolling();

    // Attach an event listener to stop scrolling by pressing "Esc"
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') { // Press Escape to stop scrolling
            stopScrolling();
        }
    });
})();