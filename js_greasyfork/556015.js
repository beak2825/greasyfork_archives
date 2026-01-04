// ==UserScript==
// @name         Main TPB Torrent file URL
// @namespace    https://github.com/joex92/TBP-Torrent-File-URL-Linker/
// @version      2025-11-15
// @description  Get the direct URL to the torrent file from itorrents.org!
// @author       JoeX92
// @match        https://thepiratebay.org/description.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thepiratebay.org
// @grant        GM.setClipboard
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556015/Main%20TPB%20Torrent%20file%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/556015/Main%20TPB%20Torrent%20file%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the window to finish loading all content
    window.addEventListener('load', function() {
        runLinker();
    }, false);

    function runLinker() {
        // --- 1. Find the Source Information ---
        // TODO: Change this selector to find your source element.
        // Use your browser's "Inspect" tool to find a unique ID or class.
        const sourceName = document.querySelector('#name');

        // Check if the element was found
        if (!sourceName) {
            console.error('Linker Script: Could not find the name element.');
            return;
        }

        // Get the text from the source element and clean it up
        const sourceNameInfo = sourceName.innerText.trim();

        const sourceHash = document.querySelector('#ih');

        // Check if the element was found
        if (!sourceHash) {
            console.error('Linker Script: Could not find the hash element.');
            return;
        }

        // Get the text from the source element and clean it up
        const sourceHashInfo = sourceHash.innerText.trim();

        // --- 2. Find the Target Element ---
        // TODO: Change this selector to find the element you want to replace.
        const targetElement = document.querySelector('#ih');

        // Check if the target element was found
        if (!targetElement) {
            console.error('Linker Script: Could not find the target element.');
            return;
        }

        // --- 3. Build the New URL ---
        // TODO: Change this URL structure to match what you need.
        // I'm using a template literal (backticks ``) to insert the variable.
        const newURL = `http://itorrents.net/torrent/${sourceHashInfo}.torrent?title=${encodeURIComponent(sourceNameInfo)}`;
        console.log(newURL);

        // --- 4. Create and Insert the Link ---

        // Create a new <a> element (a link)
        const link = document.createElement('a');

        // Set its properties to look like a link but not go anywhere
        link.href = '#'; // A "dead" link
        link.innerText = targetElement.innerText; // Use the original text
        link.style.cursor = 'pointer'; // Show a pointer cursor on hover
        link.title = 'Click to copy Torrent file URL to clipboard'; // Add a helpful tooltip

        // *** THIS IS THE NEW PART ***
        // Add a click event listener
        link.addEventListener('click', function(event) {
            // Prevent the browser from trying to follow the "#" link
            event.preventDefault();

            // Use Tampermonkey's API to copy the URL to the clipboard
            GM.setClipboard(newURL).then(() => {
                // Success!
                console.log('URL copied to clipboard:', newURL);

                // Optional: Give the user visual feedback
                const originalText = link.innerText;
                link.innerText = 'Torrent file URL copied to clipboard! Now redirecting to URL...';
                setTimeout(() => {
                    link.innerText = originalText;
                    // window.location.href = newURL;
                    GM_openInTab(newURL, false);
                }, 2000); // Reset the text after 2 seconds

            }).catch(err => {
                // Handle any errors
                console.error('Failed to copy URL: ', err);
            });
        });

        // Clear the original target element's content...
        targetElement.innerHTML = '';

        // ...and add your new "copy" link inside it.
        targetElement.appendChild(link);
    }
})();
