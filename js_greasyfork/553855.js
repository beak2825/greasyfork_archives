// ==UserScript==
// @name         DailyGammon Forum User Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to hide all threads by a specific user on the DailyGammon forum index.
// @author       neptun & Gemini
// @match        *://www.dailygammon.com/*
// @match        *://dailygammon.com/*
// @grant        GM_xmlhttpRequest
// @connect      dailygammon.com
// @connect      www.dailygammon.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553855/DailyGammon%20Forum%20User%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/553855/DailyGammon%20Forum%20User%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Check if we are on the correct page ---
    // We check for the text the user specified to make sure we only run on the main forum page.
    const pageText = document.body.textContent;
    if (!pageText.includes("DailyGammon Forum:") || !pageText.includes("Main Index")) {
        // Not the main forum index page, do nothing.
        return;
    }

    // --- 2. Find the "Main Index" element to insert the button next to ---
    let mainIndexElement = null;
    // Forums often use <b> tags for subheaders
    document.querySelectorAll('h2').forEach(el => {
        if (el.textContent.trim() === "Main Index") {
            mainIndexElement = el;
        }
    });

    if (!mainIndexElement) {
        console.warn("DG Hider: Could not find 'Main Index' element to attach button to.");
        return;
    }

    // --- 3. Create and insert the "Hide User" button ---
    const hideButton = document.createElement('button');
    hideButton.textContent = 'Hide All by User';
    hideButton.style.marginLeft = '20px';
    hideButton.style.fontSize = '12px'; // Try to match site style
    hideButton.style.cursor = 'pointer';
    hideButton.style.padding = '2px 8px';
    hideButton.style.verticalAlign = 'middle'; // Align with the "Main index" text

    // Insert the button right after the "Main index" element
    mainIndexElement.insertAdjacentElement('afterend', hideButton);

    // --- 4. Add the click event listener ---
    hideButton.addEventListener('click', promptAndHideUsers);

    // --- 5. Define the main function that does all the work ---
    function promptAndHideUsers() {
        const userToHide = prompt("Enter the exact username of the poster to hide:");
        if (!userToHide || userToHide.trim() === "") {
            return; // User cancelled
        }
        const targetUser = userToHide.trim();

        // Column indexes are 0-based. "Third column" is 2, "Fourth column" is 3.
        const posterColIndex = 2;
        const hideColIndex = 3;

        // Find the main forum table. A reliable way is to find the 'Poster' header.
        const posterHeader = Array.from(document.querySelectorAll('th'))
        .find(b => b.textContent.trim() === 'Poster');

        if (!posterHeader) {
            alert("Error: Could not find the 'Poster' column header. Cannot proceed.");
            return;
        }

        const forumTable = posterHeader.closest('table');
        if (!forumTable) {
            alert("Error: Could not find the forum table. Cannot proceed.");
            return;
        }

        const rowsToHide = [];
        const allRows = forumTable.querySelectorAll('tr');

        allRows.forEach(row => {
            const cells = row.querySelectorAll('td');

            // Check if it's a valid data row (must have enough columns)
            if (cells.length > hideColIndex) {
                const posterCell = cells[posterColIndex];
                const hideCell = cells[hideColIndex];

                // Check for a valid poster cell and matching username
                if (posterCell && posterCell.textContent.trim() === targetUser) {

                    // Find the "Hide" link within the 4th column.
                    // We look for a link with "hide" in its URL, which is safer.
                    const hideLink = hideCell.querySelector('a[href*="hide"]');

                    if (hideLink) {
                        rowsToHide.push({ rowElement: row, url: hideLink.href });
                    }
                }
            }
        });

        // --- 6. Process the matched rows ---
        if (rowsToHide.length === 0) {
            alert(`No threads found by user "${targetUser}" that can be hidden.`);
            return;
        }

        if (!confirm(`Found ${rowsToHide.length} thread(s) by ${targetUser}. Hide them all?`)) {
            return;
        }

        // We will send a web request for each link.
        // This creates an array of Promises, one for each request.
        let requests = rowsToHide.map(item => {
            return new Promise((resolve, reject) => {

                // Visually mark the row as "being hidden"
                item.rowElement.style.opacity = '0.3';
                item.rowElement.style.textDecoration = 'line-through';

                // Use GM_xmlhttpRequest to "click" the link in the background
                // This prevents the page from navigating away and stopping the script
                GM_xmlhttpRequest({
                    method: "GET",
                    url: item.url,
                    onload: function(response) {
                        resolve(response.status); // Mark this promise as complete
                    },
                    onerror: function(error) {
                        console.error(`Error hiding thread: ${item.url}`, error);
                        reject(error); // Mark this promise as failed
                    }
                });
            });
        });

        // --- 7. After all requests are done, alert the user and reload ---
        Promise.all(requests)
            .then(() => {
            alert(`Successfully processed ${rowsToHide.length} thread(s) by ${targetUser}. \n\nThe page will now reload to show the changes.`);
            window.location.reload();
        })
            .catch(err => {
            alert("An error occurred while hiding threads. Some threads may not be hidden. Check the console (F12) for details.");
            console.error("Error during batch hide process:", err);
        });
    }

})();
