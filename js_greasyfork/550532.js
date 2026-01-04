// ==UserScript==
// @name         YouTube Floating Comment Styler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Applies custom styles to a selected div on YouTube.
// @author       reaverxai
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550532/YouTube%20Floating%20Comment%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/550532/YouTube%20Floating%20Comment%20Styler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selecting = false;
    let selectedDiv = null;
    let originalStyles = {};

    // Create the selector button
    const selectorButton = document.createElement('button');
    selectorButton.textContent = 'Select Div';
    selectorButton.style.position = 'fixed';
    selectorButton.style.bottom = '10px';
    selectorButton.style.right = '10px';
    selectorButton.style.zIndex = '9999999999999999';
    selectorButton.style.padding = '10px';
    selectorButton.style.backgroundColor = '#f44336';
    selectorButton.style.color = 'white';
    selectorButton.style.border = 'none';
    selectorButton.style.borderRadius = '5px';
    selectorButton.style.cursor = 'pointer';
    document.body.appendChild(selectorButton);

    // Function to apply the styles
    const applyStyles = (element) => {
        const styles = {
            position: 'fixed',
            background: 'white',
            zIndex: '1999999999999999',
            top: '1px',
            right: '1px',
            width: '39%',
            height: '100%'
        };

        for (const property in styles) {
            originalStyles[property] = element.style[property];
            element.style[property] = styles[property];
        }
    };

    // Function to remove the styles
    const removeStyles = (element) => {
        for (const property in originalStyles) {
            element.style[property] = originalStyles[property];
        }
        originalStyles = {};
    };

    // Event listener for the selector button
    selectorButton.addEventListener('click', () => {
        if (selectedDiv) {
            removeStyles(selectedDiv);
            selectedDiv = null;
            selectorButton.textContent = 'Select Div';
            selectorButton.style.backgroundColor = '#f44336';
            return;
        }

        selecting = true;
        selectorButton.textContent = 'Click on a div to apply styles';
        document.body.style.cursor = 'crosshair';
    });

    // Event listener for the document to select an element
    document.addEventListener('click', (e) => {
        if (selecting) {
            e.preventDefault();
            e.stopPropagation();

            const target = e.target;

            if (target && target.tagName.toLowerCase() === 'div') {
                selectedDiv = target;
                applyStyles(selectedDiv);
                selecting = false;
                selectorButton.textContent = 'Remove Styles';
                selectorButton.style.backgroundColor = '#4CAF50';
                document.body.style.cursor = 'default';
            } else if (target && target.tagName.toLowerCase() !== 'button') {
                alert('Please click on a div element.');
            }
        }
    }, true); // Use capturing to intercept the click early
})();