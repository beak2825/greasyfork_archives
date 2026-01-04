// ==UserScript==
// @name         SimpCity Move and Enlarge Thumbnails Before Titles in Threads
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Moves thread thumbnails to appear before the thread titles on SimpCity forums and makes them larger.
// @author       You
// @match        https://simpcity.cr/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551739/SimpCity%20Move%20and%20Enlarge%20Thumbnails%20Before%20Titles%20in%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/551739/SimpCity%20Move%20and%20Enlarge%20Thumbnails%20Before%20Titles%20in%20Threads.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Select all thread items on the page
    const threadItems = document.querySelectorAll('.structItem.structItem--thread');

    threadItems.forEach(thread => {
        // Find the thumbnail container
        const thumbnailContainer = thread.querySelector('.structItem-cell--icon .structItem-iconContainer a');
        const titleContainer = thread.querySelector('.structItem-cell--main .structItem-title');

        if (thumbnailContainer && titleContainer) {
            // Enlarge thumbnail dimensions
            thumbnailContainer.style.width = '400px'; // Adjust width
            thumbnailContainer.style.height = '400px'; // Adjust height
            thumbnailContainer.style.display = 'block'; // Ensure it's displayed as a block

            // Move the thumbnail before the title
            titleContainer.parentNode.insertBefore(thumbnailContainer, titleContainer);
        }
    });
})();
