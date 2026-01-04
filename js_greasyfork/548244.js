// ==UserScript==
// @name         Bring back Google Maps button
// @namespace    http://tampermonkey.net/
// @version      2024-02-13
// @description  Bring back Google Maps button in search results
// @author       You
// @match        https://www.google.com/*
// @match        https://google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548246/Bring%20back%20Google%20Maps%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/548246/Bring%20back%20Google%20Maps%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addMapsButton() {
        // Find the existing results tabs container (Images, News, etc.)
        const listItemsContainer = document.querySelector('[role="navigation"] [role="list"]');

        // Give up if the container wasn't found
        if (!listItemsContainer) {
            return
        }

        // Find a sibling item that is not selected to steal stuff from

        const listItems = listItemsContainer.querySelectorAll('[role="listitem"]');

        const siblingItem = Array.from(listItems).find((item) => !item.querySelector('div[selected]'));

        // Maps item

        const mapsItem = siblingItem.cloneNode(true)

        const searchQuery = new URLSearchParams(window.location.search).get('q');

        mapsItem.querySelector('a').href = `http://maps.google.com/maps?q=${searchQuery}`;

        mapsItem.querySelector('span').textContent = 'Maps';

        // Insert the Maps button after "All" results

        listItemsContainer.insertBefore(mapsItem, listItemsContainer.childNodes[1]);
    }

    // Call the function to add the button
    addMapsButton();
})();