// ==UserScript==
// @name         Trading Post Lot Counter
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Counts trading post lots and shows usage compared to maximum
// @author       Abel
// @match        https://www.grundos.cafe/island/tradingpost/
// @grant        none
// @license      beerware
// @icon         https://grundoscafe.b-cdn.net/items/stamp_jhuidah1.gif
// @downloadURL https://update.greasyfork.org/scripts/551298/Trading%20Post%20Lot%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/551298/Trading%20Post%20Lot%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

        // CHANGE THIS NUMBER TO YOUR MAXIMUM NUMBER OF LOTS
        const maxLots = 20;

        // Count the number of lots
        const lotElements = document.querySelectorAll('.trade-lot');
        const currentLots = lotElements.length;

        // Create lot counter display
        const counterDiv = document.createElement('div');
        counterDiv.style.cssText = `
            background-color: #f8f9fa;
            border: 2px solid #dee2e6;
            border-radius: 8px;
            padding: 10px;
            margin: 15px 0;
            text-align: center;
            font-family: Arial, sans-serif;
        `;

        // Create progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            height: 25px;
            background-color: #e9ecef;
            border-radius: 12px;
            margin: 10px 0;
            overflow: hidden;
        `;

        // Create progress bar
        const progressBar = document.createElement('div');
        const percentage = (currentLots / maxLots) * 100;
        progressBar.style.cssText = `
            height: 100%;
            width: ${percentage}%;
            background: linear-gradient(to right, #28a745, #17a2b8);
            border-radius: 12px;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
        `;
        progressBar.textContent = `${Math.round(percentage)}%`;

        // Create counter text
        const counterText = document.createElement('div');
        counterText.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
            color: ${currentLots >= maxLots ? '#dc3545' : '#28a745'};
        `;
        counterText.textContent = `${currentLots} / ${maxLots} lots used`;

        // Create message
        const message = document.createElement('div');
        message.style.cssText = `
            font-size: 14px;
            color: #6c757d;
        `;

        if (currentLots >= maxLots) {
            message.textContent = 'You have reached the maximum number of lots!';
            message.style.color = '#dc3545';
        } else {
            message.textContent = `You have ${maxLots - currentLots} lots remaining.`;
        }

        // Assemble the counter
        progressContainer.appendChild(progressBar);
        counterDiv.appendChild(counterText);
        counterDiv.appendChild(progressContainer);
        counterDiv.appendChild(message);

        // Find a good place to insert the counter (after the h1 or before the first lot)
        const header = document.querySelector('h1');
        if (header) {
            header.parentNode.insertBefore(counterDiv, header.nextSibling);
        } else {
            // Fallback: insert at the top of the content area
            const contentArea = document.querySelector('#page_content') || document.body;
            contentArea.insertBefore(counterDiv, contentArea.firstChild);
        }
})();