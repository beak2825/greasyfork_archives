// ==UserScript==
// @name         Hide Shows and Movies on Rotten Tomatoes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a hide button to flex containers (selected by data-ems-id) on Rotten Tomatoes pages to hide them and remember the choice via localStorage, including dynamically loaded elements.
// @author       r-hiland
// @match        https://www.rottentomatoes.com/browse/tv_series_browse/audience:upright~critics:fresh
// @match        https://www.rottentomatoes.com/browse/tv_series_browse/*
// @match        https://www.rottentomatoes.com/browse/movies_in_theaters/sort:popular
// @match        https://www.rottentomatoes.com/browse/movies_in_theaters/sort:newest
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558048/Hide%20Shows%20and%20Movies%20on%20Rotten%20Tomatoes.user.js
// @updateURL https://update.greasyfork.org/scripts/558048/Hide%20Shows%20and%20Movies%20on%20Rotten%20Tomatoes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'hiddenEMSIDs';
    let hiddenEMSIDs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Saves the list to localStorage
    function saveHiddenEMSIDs() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenEMSIDs));
    }

    // Hides the container and record its EMS id
    function hideContainer(container, emsId) {
        container.style.display = 'none';
        if (!hiddenEMSIDs.includes(emsId)) {
            hiddenEMSIDs.push(emsId);
            saveHiddenEMSIDs();
        }
    }

    // Process a container: add a hide button if not already processed.
    function processContainer(container) {
        if (!container.matches('div.flex-container[data-ems-id]')) return;
        if (container.dataset.tmProcessed === "true") return; // already processed
        container.dataset.tmProcessed = "true"; // mark as processed

        const emsId = container.getAttribute('data-ems-id');

        // Immediately hide if stored in localStorage
        if (hiddenEMSIDs.includes(emsId)) {
            container.style.display = 'none';
        }

        // hide button
        const hideButton = document.createElement('button');
        hideButton.textContent = 'Hide';
        hideButton.style.position = 'absolute';
        hideButton.style.top = '5px';
        hideButton.style.right = '5px';
        hideButton.style.zIndex = '9999';
        hideButton.style.backgroundColor = '#f00';
        hideButton.style.color = '#fff';
        hideButton.style.border = '1px solid black';
        hideButton.style.padding = '0 8px';
        hideButton.style.height = '25px';
        hideButton.style.lineHeight = '20px';
        hideButton.style.cursor = 'pointer';


        container.style.position = 'relative';
        container.appendChild(hideButton);

        hideButton.addEventListener('click', () => {
            hideContainer(container, emsId);
        });
    }

    // Processes all existing containers on page load
    function processAllContainers() {
        document.querySelectorAll('div.flex-container[data-ems-id]').forEach(processContainer);
    }

    processAllContainers();

    // Observe for dynamically added elements due to the "load more" button
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processContainer(node);
                    node.querySelectorAll('div.flex-container[data-ems-id]').forEach(processContainer);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();