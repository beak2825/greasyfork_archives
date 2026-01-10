
// ==UserScript==
// @name         Tenhou Canvas Visibility Modification Styles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify specific canvas element visibility on the page and add CSS rules
// @match        https://tenhou.net/*
// @icon         https://yt3.googleusercontent.com/J7QbevqvDkLbkI77_6EXxacKeq3SEvAfQ8pnlpyQ5RBzVjDHyMmNQ9UIOYc43nIQ6i5DKDCnCw=s160-c-k-c0x00ffffff-no-rj
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562057/Tenhou%20Canvas%20Visibility%20Modification%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/562057/Tenhou%20Canvas%20Visibility%20Modification%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add CSS rules to the document
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .__web-inspector-hide-shortcut__, .__web-inspector-hide-shortcut__ *,
            .__web-inspector-hidebefore-shortcut__::before,
            .__web-inspector-hideafter-shortcut__::after {
                visibility: hidden !important;
            }
        `;
        document.head.appendChild(style);
        console.log('Custom styles added');
    }

    // Function to modify the specific canvas element
    function modifyCanvasVisibility() {
        console.log('Tampermonkey script running...');

        // Select the specific canvas element using its CSS selector
        const canvas = document.querySelector("body > div.nosel > div.nosel.tbl > canvas");

        if (canvas) {
            canvas.classList.add("__web-inspector-hide-shortcut__");
            console.log('Changed canvas:', canvas.outerHTML);
        } else {
            console.log('Canvas element not found.');
        }
    }

    // Wait for the document to be fully loaded before modifying the canvas elements and adding styles
    window.addEventListener('load', function() {
        addCustomStyles();
        modifyCanvasVisibility();
    });
})();

