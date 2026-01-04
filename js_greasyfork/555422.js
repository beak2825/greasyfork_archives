// ==UserScript==
// @name         Google Calendar Add "Duplicate" Menu Item
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Injects a "Duplicate" option into Google Calendar's right-click popup menu
// @author       desk195
// @match        https://calendar.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555422/Google%20Calendar%20Add%20%22Duplicate%22%20Menu%20Item.user.js
// @updateURL https://update.greasyfork.org/scripts/555422/Google%20Calendar%20Add%20%22Duplicate%22%20Menu%20Item.meta.js
// ==/UserScript==

// Note, this was made with Chat-GPT...
// This injects a "Duplicate" list element to the google calendar right click menu
// And opens a new link to the google calendar duplicate functionality
// it still requires the user to manually save the event
// but at least saves a few clicks to get to that menu

(function() {
    'use strict';

    console.log('Google Calendar "Duplicate" Menu Injector loaded.');


    // Fetch and store the current google account user index
    const url = window.location.href;

    // Match "u/<number>" in the URL
    const match = url.match(/\/u\/(\d+)\//);

    if (match && match[1] !== undefined) {
        const currentUserIndex = parseInt(match[1], 10);
        console.log('Current Google account index:', currentUserIndex);
        // store globally
        window.currentGoogleAccountIndex = currentUserIndex;
    } else {
        console.log('No user index found in URL, defaulting to 0');
        window.currentGoogleAccountIndex = 0;
    }

    // --- 1. Capture the event's data-eventid on right-click ---
    document.addEventListener('contextmenu', function(e) {
        const eventElement = e.target.closest('[data-eventid]');
        if (eventElement) {
            window.lastRightClickedEventId = eventElement.getAttribute('data-eventid');
            console.log('📌 Captured event ID:', window.lastRightClickedEventId);
        } else {
            window.lastRightClickedEventId = null;
        }
    }, true);

    // Function to create and insert the new "Duplicate" menu item
    function injectDuplicateItem(ul) {
        // Avoid duplicates if it’s already been injected
        if (ul.querySelector('.tm-duplicate-item')) return;

        // Create a separator element matching Google Calendar’s style
        const separator = document.createElement('li');
        separator.setAttribute('role', 'separator');
        separator.className = 'aqdrmf-clz4Ic aqdrmf-clz4Ic-OWXEXe-Vkfede O68mGe-xl07Ob-clz4Ic ugNmBf';
        ul.insertBefore(separator, ul.firstChild);

        // Create the new "Duplicate" menu item
        const newItem = document.createElement('li');
        newItem.className = 'tm-duplicate-item'; // unique class for our item
        newItem.style.cursor = 'pointer';
        newItem.style.padding = '8px 12px';
        newItem.style.userSelect = 'none';
        newItem.style.borderTop = '0px solid rgba(0,0,0,0.1)';
        newItem.innerText = 'Duplicate';

        // Hover feedback (simple styling to match menu behavior)
        newItem.addEventListener('mouseenter', () => {
            newItem.style.backgroundColor = '#D9D9D9';
        });
        newItem.addEventListener('mouseleave', () => {
            newItem.style.backgroundColor = '';
        });

        // Add a click handler — for now, just logs (you can replace this with your logic)
        newItem.addEventListener('click', async e => {
            e.stopPropagation();
            e.preventDefault();

            // get event ID from a right-clicked element if you stored it
            const eventId = window.lastRightClickedEventId;
            if (!eventId) {
                alert('No event selected to duplicate.');
                return;
            }

            // Open the event’s duplication page using a documented Calendar URL pattern
            // fetch current user account index
            const currentUser = window.currentGoogleAccountIndex;

            const duplicateUrl = `https://calendar.google.com/calendar/u/${currentUser}/r/eventedit/duplicate/${eventId}`;
            window.open(duplicateUrl, '_self');
        });  

        // Insert the new item above the menu
        ul.insertBefore(newItem, ul.firstChild);
        console.log('✅ "Duplicate" menu item injected.');
    }

    // Observe for the popup menu being added to the DOM
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                // Detect the UL menu
                if (node.matches('ul.aqdrmf-rymPhb.pa1Qpd')) {
                    injectDuplicateItem(node);
                } else {
                    const menu = node.querySelector('ul.aqdrmf-rymPhb.pa1Qpd');
                    if (menu) injectDuplicateItem(menu);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
