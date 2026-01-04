// ==UserScript==
// @name         NovelUpdates Tag Filter & Sorter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filters and sorts NovelUpdates series finder results by tag count.
// @author       MasuRii
// @match        https://www.novelupdates.com/series-finder/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553324/NovelUpdates%20Tag%20Filter%20%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/553324/NovelUpdates%20Tag%20Filter%20%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================================================
    //  USER CONFIGURATION - IMPORTANT!
    // ========================================================================

    // --- Filter Configuration ---
    // Set the minimum number of tags a series must have to be displayed.
    // Set to 0 to disable filtering.
    const minTagCount = 10; // <===== ADJUST THIS NUMBER TO CHANGE MINIMUM TAG COUNT

    // --- Sorter Configuration ---
    // Set to 'true' to enable console logging for debugging, or 'false' to disable.
    const enableLogging = false; // <===== ADJUST THIS TO 'true' OR 'false'

    // ========================================================================
    //  END USER CONFIGURATION
    // ========================================================================

    /**
     * Counts the number of tags within a given search result box.
     * @param {HTMLElement} searchBox - The DOM element for a single series result.
     * @returns {number} The total number of tags.
     */
    function countTags(searchBox) {
        return searchBox.querySelectorAll('.genre[id="etagme"]').length;
    }

    /**
     * Filters all series results across the page, removing any that have
     * fewer tags than the configured `minTagCount`.
     */
    function filterGlobalByTagCount() {
        if (enableLogging) console.log(`Filtering series with less than ${minTagCount} tags...`);
        const searchResultContainers = document.querySelectorAll('.w-blog-content.other');
        let allSearchResultBoxes = [];

        if (searchResultContainers.length > 0) {
            searchResultContainers.forEach(container => {
                const containerBoxes = Array.from(container.querySelectorAll('.search_main_box_nu'));
                allSearchResultBoxes = allSearchResultBoxes.concat(containerBoxes);
            });

            if (allSearchResultBoxes.length > 0) {
                const seriesToRemove = [];

                allSearchResultBoxes.forEach(box => {
                    const tagCount = countTags(box);
                    if (tagCount < minTagCount) {
                        seriesToRemove.push(box);
                    }
                });

                if (enableLogging) console.log("Series to remove (count):", seriesToRemove.length);

                seriesToRemove.forEach(box => {
                    box.remove();
                });

                if (enableLogging) console.log("Global series filtering by tag count completed.");
            } else {
                if (enableLogging) console.log("No search results found to filter.");
            }
        } else {
            console.error("Could not find any search result containers (.w-blog-content.other) for filtering.");
        }
    }

    /**
     * Sorts all visible series results across the page by their tag count
     * in descending order and redistributes them across the containers.
     */
    function sortAllContainersGlobally() {
        if (enableLogging) console.log("Sorting all series by tag count...");
        const searchResultContainers = document.querySelectorAll('.w-blog-content.other');
        let allSearchResultBoxes = [];

        if (searchResultContainers.length > 0) {
            searchResultContainers.forEach(container => {
                const containerBoxes = Array.from(container.querySelectorAll('.search_main_box_nu'));
                allSearchResultBoxes = allSearchResultBoxes.concat(containerBoxes);
            });

            if (allSearchResultBoxes.length > 0) {
                const seriesData = [];

                allSearchResultBoxes.forEach(box => {
                    const tagCount = countTags(box);
                    seriesData.push({ box: box, tagCount: tagCount });
                });

                // Sort all series globally by tag count, descending
                seriesData.sort((a, b) => b.tagCount - a.tagCount);

                // Clear existing search result boxes from all containers
                searchResultContainers.forEach(container => {
                    const existingBoxes = Array.from(container.querySelectorAll('.search_main_box_nu'));
                    existingBoxes.forEach(box => container.removeChild(box));
                });

                // Re-populate containers with the sorted results
                let seriesIndex = 0;
                const containerBoxLimit = 10; // NU displays 10 results per page section
                searchResultContainers.forEach(container => {
                    let boxCount = 0;
                    while (seriesIndex < seriesData.length && boxCount < containerBoxLimit) {
                        container.appendChild(seriesData[seriesIndex].box);
                        seriesIndex++;
                        boxCount++;
                    }
                });

                if (enableLogging) console.log("NovelUpdates search results sorted by tag count (descending).");
            } else {
                if (enableLogging) console.log("No search results found to sort.");
            }
        } else {
            console.error("Could not find any search result containers (.w-blog-content.other) for sorting.");
        }
    }

    /**
     * Creates and appends the control buttons for filtering and sorting to the page.
     */
    function createControlButtons() {
        // --- Create Filter Button ---
        const filterButton = document.createElement('button');
        filterButton.textContent = 'Filter by Tags';
        filterButton.className = 'btnrev review';
        Object.assign(filterButton.style, {
            position: 'fixed',
            bottom: '60px', // Positioned higher
            right: '20px',
            zIndex: '1000',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        filterButton.addEventListener('click', function(event) {
            event.preventDefault();
            if (enableLogging) console.log("Filter by Tags button clicked!");
            // Note: Re-filtering without a page reload won't bring back removed items.
            // This is mainly useful if the page content changes dynamically.
            filterGlobalByTagCount();
        });
        document.body.appendChild(filterButton);

        // --- Create Sort Button ---
        const sortButton = document.createElement('button');
        sortButton.textContent = 'Sort by Tags';
        sortButton.className = 'btnrev review';
        Object.assign(sortButton.style, {
            position: 'fixed',
            bottom: '20px', // Positioned lower
            right: '20px',
            zIndex: '1000',
            padding: '8px 15px',
            borderRadius: '5px',
            cursor: 'pointer'
        });
        sortButton.addEventListener('click', function(event) {
            event.preventDefault();
            if (enableLogging) console.log("Sort by Tags button clicked!");
            sortAllContainersGlobally();
        });
        document.body.appendChild(sortButton);
    }

    // ========================================================================
    //  INITIAL EXECUTION
    // ========================================================================
    // On page load, first filter the results, then sort the remaining ones.
    // Finally, create the buttons for manual re-triggering.
    // ========================================================================
    filterGlobalByTagCount();
    sortAllContainersGlobally();
    createControlButtons();

})();