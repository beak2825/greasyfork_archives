// ==UserScript==
// @name         Wikipedia Dark/Light Mode
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Toggle dark/light mode without changing logo text color
// @author       AnonymousUnblocker
// @match        https://*.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563286/Wikipedia%20DarkLight%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/563286/Wikipedia%20DarkLight%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create toggle button
    const btn = document.createElement('button');
    btn.innerText = 'Toggle Dark Mode';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        padding: '8px 12px',
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    });
    document.body.appendChild(btn);

    // Inject CSS for dark/light modes
    const style = document.createElement('style');
    style.innerHTML = `
        /* Dark mode background and text */
        body.dark-mode {
            background-color: #121212 !important;
            /* Removed global text color for neutral appearance */
        }
        /* Dark mode links */
        body.dark-mode a {
            color: #9ecfff !important;
        }
        /* Removed specific logo text color styles */
        /* Optional: keep logo styles unchanged for default color */
    `;
    document.head.appendChild(style);

    // Function to toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        btn.innerText = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    }

    // Setup click event
    btn.addEventListener('click', toggleDarkMode);

    // Wait for DOM to load before doing anything
    document.addEventListener('DOMContentLoaded', () => {
        // No additional class changes needed
    });
})();