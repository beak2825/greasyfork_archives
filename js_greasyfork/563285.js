// ==UserScript==
// @name         Wikipedia Dark/Light Mode with Text Color
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Toggle dark/light mode, change Wikipedia logo text color reliably
// @author       AnonymousUnblocker
// @match        https://*.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563285/Wikipedia%20DarkLight%20Mode%20with%20Text%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/563285/Wikipedia%20DarkLight%20Mode%20with%20Text%20Color.meta.js
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

    // Inject CSS for dark/light modes and logo text
    const style = document.createElement('style');
    style.innerHTML = `
        /* Dark mode background and text */
        body.dark-mode {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }
        /* Dark mode links */
        body.dark-mode a {
            color: #9ecfff !important;
        }
        /* Logo text color in dark mode */
        body.dark-mode .central-textlogo {
            color: white !important;
        }
        /* Logo text color in light mode */
        body:not(.dark-mode) .central-textlogo {
            color: black !important;
        }
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
        // No need to add classes here, CSS takes care of it
    });
})();