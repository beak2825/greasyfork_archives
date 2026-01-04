// ==UserScript==
// @name            YouTube Music - Mark All Podcast Episodes as Played
// @namespace       https://github.com/crazyrabbit0
// @version         1.0
// @description     Adds a button to mark all unplayed podcast episodes on the current page as played.
// @author          CrazyRabbit
// @match           https://music.youtube.com/*
// @icon            https://music.youtube.com/img/favicon_48.png
// @grant           none
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       2023+, CrazyRabbit (https://github.com/crazyrabbit0)
// @homepageURL     https://github.com/crazyrabbit0/UserScripts
// @supportURL      https://github.com/crazyrabbit0/UserScripts/issues/new?assignees=crazyrabbit0&labels=help+wanted&template=&title=YouTube%20Music%20-%20Mark%20All%20Podcast%20Episodes%20as%20Played%20-%20Issue
// @run-at          document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/553118/YouTube%20Music%20-%20Mark%20All%20Podcast%20Episodes%20as%20Played.user.js
// @updateURL https://update.greasyfork.org/scripts/553118/YouTube%20Music%20-%20Mark%20All%20Podcast%20Episodes%20as%20Played.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to introduce a delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to find and click the "Mark as played" menu item
    async function clickMarkAsPlayed() {
        // Wait a moment for the context menu to appear
        await sleep(100);

        const menuItems = document.querySelectorAll('ytmusic-toggle-menu-service-item-renderer');
        for (const item of menuItems) {
            const label = item.querySelector('yt-formatted-string');
            if (label && label.textContent.trim() === 'Mark as played') {
                item.click();
                return true;
            }
        }
        return false;
    }

    // Main function to mark unplayed items
    async function markAllUnplayed() {
        const items = document.querySelectorAll('ytmusic-multi-row-list-item-renderer');
        for (const item of items) {
            const progressText = item.querySelector('ytmusic-playback-progress-renderer .progress-text');
            const title = item.querySelector('.title .yt-formatted-string').innerHTML;

            // Check if the item is not marked as "Played"
            if (!progressText || !progressText.title.includes('Played')) {
                //console.log(title); continue;

                // Simulate a right-click to open the context menu
                item.dispatchEvent(new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    buttons: 2
                }));

                // Wait for the menu and click the "Mark as played" option
                await clickMarkAsPlayed();

                // Wait a bit before processing the next item to avoid overwhelming the UI
                await sleep(1);
            }
        }
        alert('All unplayed episodes have been marked as played.');
    }

    // Function to create and inject the "Mark All as Played" button
    function createMarkAllButton() {
        const shelfRenderer = document.querySelector('ytmusic-shelf-renderer');
        if (shelfRenderer && !document.getElementById('markAllPlayedButton')) {
            const button = document.createElement('button');
            button.id = 'markAllPlayedButton';
            button.textContent = 'Mark All as Played';
            button.style.margin = '10px 0 20px 24px';
            button.style.padding = '10px 15px';
            button.style.backgroundColor = '#1DB954';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.fontWeight = 'bold';

            button.addEventListener('click', markAllUnplayed);

            shelfRenderer.parentNode.insertBefore(button, shelfRenderer);
        }
    }

    // Use a MutationObserver to detect when the podcast list is loaded
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (document.querySelector('ytmusic-shelf-renderer')) {
                    createMarkAllButton();
                    // We can disconnect the observer if we only need to add the button once per page load
                    observer.disconnect();
                }
            }
        }
    });

    // Start observing the document for changes
    observer.observe(document, { childList: true, subtree: true });

})();