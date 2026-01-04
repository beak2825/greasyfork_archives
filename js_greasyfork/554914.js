// ==UserScript==
// @name         Universal Scroll-to-Top QoL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Adds a smooth, sticky button to quickly scroll back to the top of any page.
// @author       D3rp
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554914/Universal%20Scroll-to-Top%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/554914/Universal%20Scroll-to-Top%20QoL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCROLL_THRESHOLD = 300; // Pixels to scroll before the button appears
    const BUTTON_ID = 'D3rp-qol-scroll-to-top';

    // --- Create and Style the Button ---
    function createButton() {
        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.innerHTML = '&#9650;'; // Up arrow character
        button.title = 'Scroll to Top';

        // Basic styling
        button.style.cssText = `
            display: none;
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 24px;
            line-height: 45px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            opacity: 0.7;
            transition: opacity 0.3s, background-color 0.3s, transform 0.2s;
        `;

        // Hover and Active Effects
        button.onmouseover = () => button.style.opacity = '1';
        button.onmouseout = () => button.style.opacity = '0.7';
        button.onmousedown = () => button.style.transform = 'scale(0.95)';
        button.onmouseup = () => button.style.transform = 'scale(1)';

        document.body.appendChild(button);
        return button;
    }

    const scrollToTopButton = createButton();

    // --- Scroll Logic ---
    function handleScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            // Show the button when scrolled past the threshold
            scrollToTopButton.style.display = 'block';
        } else {
            // Hide the button when near the top
            scrollToTopButton.style.display = 'none';
        }
    }

    function smoothScrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Provides a smooth scrolling animation
        });
    }

    // --- Attach Events ---
    window.addEventListener('scroll', handleScroll);
    scrollToTopButton.addEventListener('click', smoothScrollToTop);

    // Initial check in case the user loads the page already scrolled down
    handleScroll();

})();