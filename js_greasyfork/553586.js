// ==UserScript==
// @name         Next Target Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to increment user2ID and redirect
// @author       MoAlaa
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553586/Next%20Target%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/553586/Next%20Target%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button element
    var button = document.createElement('button');
    button.innerText = 'Next ID';
    button.style.position = 'fixed';
    button.style.top = '30px'; // Changed to top for easier access
    button.style.right = '20px';
    button.style.zIndex = '999999'; // Increased z-index to ensure it's on top
    button.style.padding = '12px 20px'; // Slightly larger padding for better visibility
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px'; // Rounded corners
    button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)'; // Shadow for depth
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px'; // Larger text

    // Add hover effect
    button.addEventListener('mouseover', function() {
        button.style.backgroundColor = '#45a049';
    });
    button.addEventListener('mouseout', function() {
        button.style.backgroundColor = '#4CAF50';
    });

    // Add click event listener
    button.addEventListener('click', function() {
        var currentUrl = window.location.href;
        var idMatch = currentUrl.match(/user2ID=(\d+)/);
        if (idMatch && idMatch[1]) {
            var currentId = parseInt(idMatch[1], 10);
            var newId = currentId + 1;
            var newUrl = currentUrl.replace(/user2ID=\d+/, 'user2ID=' + newId);
            window.location.href = newUrl;
        } else {
            alert('Could not find user2ID in the current URL.');
        }
    });

    // Append the button to the body
    document.body.appendChild(button);
})();