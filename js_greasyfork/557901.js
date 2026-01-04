// ==UserScript==
// @name         4chan to owo and back
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to switch between 4chan.org and owo.vg
// @author       me
// @match        https://boards.4chan.org/*
// @match        https://owo.vg/*
// @grant        none
// @run-at       document-idle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/557901/4chan%20to%20owo%20and%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/557901/4chan%20to%20owo%20and%20back.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SITE_1_URL_BASE = 'https://boards.4chan.org/';
    const SITE_2_URL_BASE = 'https://owo.vg/';
    const BUTTON_TEXT_1 = 'Go to OWO'; // Text when on 4chan
    const BUTTON_TEXT_2 = 'Go to 4chan'; // Text when on owo
    // ---------------------

    const currentUrl = window.location.href;
    let targetUrl;
    let buttonText;

    // Check if we are on 4chan (using startsWith for robust matching)
    if (currentUrl.startsWith(SITE_1_URL_BASE)) {
        // Calculate the corresponding URL on OWO
        const path = currentUrl.substring(SITE_1_URL_BASE.length);
        targetUrl = SITE_2_URL_BASE + path;
        buttonText = BUTTON_TEXT_1;

    // Check if we are on OWO
    } else if (currentUrl.startsWith(SITE_2_URL_BASE)) {
        // Calculate the corresponding URL on 4chan
        const path = currentUrl.substring(SITE_2_URL_BASE.length);
        targetUrl = SITE_1_URL_BASE + path;
        buttonText = BUTTON_TEXT_2;

    } else {
        // Do nothing if the script somehow runs on an unhandled domain
        return;
    }

    // --- Create and Style the Button ---

    const button = document.createElement('a');
    button.href = targetUrl;
    button.textContent = buttonText;

    // Apply styles to place the button in the top left and make it noticeable
    button.style.cssText = `
        position: fixed;
        top: 25px;
        left: 10px;
        z-index: 99999; /* Ensure it's on top of other elements */
        padding: 8px 15px;
        background-color: #007bff; /* Blue background */
        color: white; /* White text */
        border: none;
        border-radius: 5px;
        text-decoration: none; /* Remove underline from the link */
        font-family: sans-serif;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
        transition: background-color 0.2s ease;
    `;

    // Add a hover effect for better user experience
    button.onmouseover = function() {
        this.style.backgroundColor = '#0056b3'; // Darker blue on hover
    };
    button.onmouseout = function() {
        this.style.backgroundColor = '#007bff';
    };

    // Append the button to the document body
    document.body.appendChild(button);

})();