// ==UserScript==
// @name         Random Element Spacer
// @namespace    https://3n3a.ch/
// @version      2025-11-23
// @description  Randomly adds spacing to random elements on a page
// @author       3n3a
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556709/Random%20Element%20Spacer.user.js
// @updateURL https://update.greasyfork.org/scripts/556709/Random%20Element%20Spacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all elements on the page
    var allElements = document.querySelectorAll('body *');
    
    // Randomly decide how many elements to modify (between 5% and 30% of total elements)
    var minPercent = 0.05;
    var maxPercent = 0.30;
    var numToModify = Math.floor(allElements.length * (Math.random() * (maxPercent - minPercent) + minPercent));
    
    // Create an object to store unique random indices
    var randomIndices = {};
    var indicesArray = [];
    
    // Generate unique random indices
    while (indicesArray.length < Math.min(numToModify, allElements.length)) {
        var randomIndex = Math.floor(Math.random() * allElements.length);
        if (!randomIndices[randomIndex]) {
            randomIndices[randomIndex] = true;
            indicesArray.push(randomIndex);
        }
    }
    
    // Apply random spacing to selected elements
    for (var i = 0; i < indicesArray.length; i++) {
        var index = indicesArray[i];
        var element = allElements[index];
        
        // Generate random spacing values (0 to 6.9px)
        var spacingTypes = ['margin', 'padding'];
        var sides = ['Top', 'Right', 'Bottom', 'Left'];
        
        // Randomly choose spacing type (margin or padding)
        var spacingType = spacingTypes[Math.floor(Math.random() * spacingTypes.length)];
        
        // Randomly decide which sides to apply spacing to
        for (var j = 0; j < sides.length; j++) {
            if (Math.random() > 0.5) { // 50% chance for each side
                var spacing = (Math.random() * 6.9).toFixed(2);
                element.style[spacingType + sides[j]] = spacing + 'px';
            }
        }
    }
    
    console.log('Random Element Spacer: Modified ' + indicesArray.length + ' out of ' + allElements.length + ' elements');
})();
