// ==UserScript==
// @name         Force Dark Theme on Guru3D
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Automatically switch Bootstrap theme from light to dark
// @author       You
// @match        https://www.guru3d.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551154/Force%20Dark%20Theme%20on%20Guru3D.user.js
// @updateURL https://update.greasyfork.org/scripts/551154/Force%20Dark%20Theme%20on%20Guru3D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update the theme
    function updateTheme() {
        const html = document.documentElement;
        if (html.hasAttribute('data-bs-theme') && html.getAttribute('data-bs-theme') === 'light') {
            html.setAttribute('data-bs-theme', 'dark');
            console.log('Theme changed to dark');
        }
    }

    // Run immediately
    updateTheme();

    // Also observe for dynamic changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-bs-theme'] });
})();