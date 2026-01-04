// ==UserScript==
// @name         Back to Top Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to quickly scroll to the top of the page
// @author       aaron
// @license      GNU GPLv3
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558420/Back%20to%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558420/Back%20to%20Top%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    const btn = document.createElement('button');
    btn.textContent = '↑ Top';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.padding = '10px 15px';
    btn.style.fontSize = '16px';
    btn.style.backgroundColor = '#000';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '9999';
    btn.style.opacity = '0.6';
    btn.style.transition = 'opacity 0.3s';
    btn.onmouseover = () => btn.style.opacity = '1';
    btn.onmouseout = () => btn.style.opacity = '0.6';

    // Scroll to top on click
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add the button to the page
    document.body.appendChild(btn);
})();
