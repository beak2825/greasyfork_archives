// ==UserScript==
// @name         Duolingo Solver Button
// @namespace    http://tampermonkey.net/
// @version      2025-12-31
// @description  Adds a button to open Duo Solver Dashboard
// @author       Star hacker
// @match        https://www.duolingo.com/
// @match        https://www.duolingo.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560889/Duolingo%20Solver%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/560889/Duolingo%20Solver%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating button
    const button = document.createElement('button');
    button.id = 'duoSolverButton';
    button.innerText = 'Open Duo Solver Dashboard';

    // Style the button
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = '#4CAF50';  // Green background
    button.style.color = 'white';
    button.style.padding = '15px 25px';
    button.style.fontSize = '16px';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    // Change color on hover
    button.onmouseover = () => {
        button.style.backgroundColor = '#45a049'; // Darker green on hover
    };
    button.onmouseout = () => {
        button.style.backgroundColor = '#4CAF50'; // Revert to original green
    };

    // Append the button to the body of the page
    document.body.appendChild(button);

    // Add click event to redirect to Duo Solver Dashboard
    button.addEventListener('click', function() {
        window.location.href = 'https://duohacker.base44.app';
    });
})();
