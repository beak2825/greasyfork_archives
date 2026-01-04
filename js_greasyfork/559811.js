// ==UserScript==
// @name         Lovable.dev Add Download Project Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a "Download Project" button on the project page of Lovable.dev
// @author       You
// @match        https://lovable.dev/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/559811/Lovabledev%20Add%20Download%20Project%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559811/Lovabledev%20Add%20Download%20Project%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and style the download button
    function addDownloadButton() {
        const projectPage = document.querySelector('.project-page'); // Adjust selector based on the page structure
        if (!projectPage) return;

        // Create the button element
        const button = document.createElement('button');
        button.innerText = 'Download Project';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50'; // Green
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginTop = '20px';

        // Insert the button into the page (e.g., after the project description)
        projectPage.appendChild(button);

        // Add an event listener for when the button is clicked
        button.addEventListener('click', function() {
            // Replace this URL with the actual URL or functionality you need
            const downloadUrl = 'https://lovable.dev/download/project.zip'; // Example URL
            window.location.href = downloadUrl;
        });
    }

    // Wait for the page to load
    window.addEventListener('load', addDownloadButton);
})();