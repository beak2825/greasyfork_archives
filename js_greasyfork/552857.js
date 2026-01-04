// ==UserScript==
// @name         Neon Green and Pink Dots with White Circle
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a neon green dot, a neon pink dot, and a cream white circle border at the center of the screen on deadshot.io
// @author       Freddy Fingers
// @match        https://deadshot.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552857/Neon%20Green%20and%20Pink%20Dots%20with%20White%20Circle.user.js
// @updateURL https://update.greasyfork.org/scripts/552857/Neon%20Green%20and%20Pink%20Dots%20with%20White%20Circle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a div element for the green dot
    const greenDot = document.createElement('div');
    greenDot.style.position = 'fixed';
    greenDot.style.width = '8px';
    greenDot.style.height = '8px';
    greenDot.style.backgroundColor = '#39FF14'; // Brightest neon green color
    greenDot.style.borderRadius = '50%'; // Make it a circle
    greenDot.style.top = '50%'; // Center vertically
    greenDot.style.left = '50%'; // Center horizontally
    greenDot.style.transform = 'translate(-50%, -50%)'; // Adjust position to center
    greenDot.style.zIndex = '9999'; // Ensure it's on top of other elements

    // Append the green dot to the body
    document.body.appendChild(greenDot);

    // Create a div element for the pink dot
    const pinkDot = document.createElement('div');
    pinkDot.style.position = 'fixed';
    pinkDot.style.width = '5px'; // Size of the pink dot
    pinkDot.style.height = '5px'; // Size of the pink dot
    pinkDot.style.backgroundColor = '#fe01b1'; // Neon pink color
    pinkDot.style.borderRadius = '50%'; // Make it a circle
    pinkDot.style.top = '50%'; // Center vertically
    pinkDot.style.left = '50%'; // Center horizontally
    pinkDot.style.transform = 'translate(-50%, -50%)'; // Adjust position to center
    pinkDot.style.zIndex = '10000'; // Ensure it's on top of the green dot

    // Append the pink dot to the body
    document.body.appendChild(pinkDot);

    // Create a div element for the cream white circle border
    const greenCircleBorder = document.createElement('div');
    greenCircleBorder.style.position = 'fixed';
    greenCircleBorder.style.width = '27px'; // Diameter of the circle
    greenCircleBorder.style.height = '27px'; // Diameter of the circle
    greenCircleBorder.style.border = '3.3px solid #BEBEBE'; // Change to cream white
    greenCircleBorder.style.borderRadius = '50%'; // Make it a circle
    greenCircleBorder.style.top = '50%'; // Center vertically
    greenCircleBorder.style.left = '50%'; // Center horizontally
    greenCircleBorder.style.transform = 'translate(-50%, -50%)'; // Adjust position to center
    greenCircleBorder.style.zIndex = '9980'; // Ensure it's below the pink dot and above other elements

    // Append the cream white circle border to the body
    document.body.appendChild(greenCircleBorder);
})();