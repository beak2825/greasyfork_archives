// ==UserScript==
// @name         Sidebar Collapse Button
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Adds a collapse button to the main sidebar and audio content
// @match        https://www.tokiniandy.com/products/immersion-material/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548059/Sidebar%20Collapse%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548059/Sidebar%20Collapse%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add a collapse button
    function addCollapseButton(targetClass, direction) {
        // Find the target element
        const targetElement = document.querySelector(`.${targetClass}`);
        
        // Determine symbols based on direction
        let closeSymbol, openSymbol;
        if(direction === 'lr'){
            closeSymbol = '◀';
            openSymbol = '▶';
        } else {
            closeSymbol = '▼';
            openSymbol = '▲'
        }
        
        // Check if the target element exists
        if (!targetElement) return;

        // Create collapse button
        const collapseButton = document.createElement('button');
        collapseButton.textContent = closeSymbol;
        collapseButton.style.position = 'absolute';
        collapseButton.style.zIndex = '1100';
        collapseButton.style.background = '#f0f0f0';
        collapseButton.style.border = '1px solid #ccc';
        collapseButton.style.padding = '5px 10px';
        collapseButton.style.cursor = 'pointer';

        // Positioning based on direction
        if (direction === 'lr') {
            collapseButton.style.top = '10px';
            collapseButton.style.right = '-40px'; // Positioned just outside the element
        } else {
            collapseButton.style.top = '-30px'; // Positioned just above the element
            collapseButton.style.left = '10px';
        }

        // Make sure the target element has a relative position
        targetElement.style.position = 'relative';

        // Add click event to toggle visibility
        let isCollapsed = false;
        collapseButton.addEventListener('click', () => {
            if (isCollapsed) {
                // Expand the target element
                targetElement.style.display = 'block';
                collapseButton.textContent = closeSymbol;
                isCollapsed = false;
            } else {
                // Collapse the target element
                targetElement.style.display = 'none';
                collapseButton.textContent = openSymbol;
                isCollapsed = true;
            }
        });

        // Append button to the target element
        targetElement.appendChild(collapseButton);
    }

    // Run the function for both sidebar and audio content when the page loads
    window.addEventListener('load', () => {
        addCollapseButton('main-sidebar', 'lr');
        addCollapseButton('main-content-audio', 'ud');
    });
})();
