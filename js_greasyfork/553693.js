// ==UserScript==
// @name         Infinite Craft Auto Processor (Ultra Fast for Firefox/Linux)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ultra-fast Infinite Craft combination processor for Firefox on Linux
// @author       You
// @match        *://*/*   // Adjust this URL pattern to the specific game page for Infinite Craft
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553693/Infinite%20Craft%20Auto%20Processor%20%28Ultra%20Fast%20for%20FirefoxLinux%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553693/Infinite%20Craft%20Auto%20Processor%20%28Ultra%20Fast%20for%20FirefoxLinux%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fast drag-and-drop simulation optimized for Infinite Craft
    function simulateMouseAndDrop(element, startX, startY, targetX, targetY) {
        function triggerMouseEvent(target, eventType, clientX, clientY) {
            const event = new MouseEvent(eventType, {
                bubbles: true,
                cancelable: true,
                clientX,
                clientY,
                view: window,
            });
            target.dispatchEvent(event);
        }

        // Instant drag-and-drop without gradual movement
        triggerMouseEvent(element, "mousedown", startX, startY);
        triggerMouseEvent(document, "mousemove", targetX, targetY);
        triggerMouseEvent(document, "mouseup", targetX, targetY);

        // Directly set the position of the element to avoid reflows/repaints
        element.style.left = `${targetX}px`;
        element.style.top = `${targetY}px}`;
    }

    async function beat_infinite_craft() {
        const processedPairs = new Set(JSON.parse(localStorage.getItem("processedPairs")) || []);

        // Save processed pairs to localStorage in bulk
        function saveProcessedPairs() {
            localStorage.setItem("processedPairs", JSON.stringify(Array.from(processedPairs)));
        }

        async function clickClearButton() {
            const clearBtn = document.querySelector(".clear");
            if (clearBtn) {
                clearBtn.click();
            }
        }

        async function processCombination(firstItem, secondItem, targetX, targetY) {
            const firstRect = firstItem.getBoundingClientRect();
            const secondRect = secondItem.getBoundingClientRect();

            const firstStartX = firstRect.x + firstRect.width / 2;
            const firstStartY = firstRect.y + firstRect.height / 2;

            const secondStartX = secondRect.x + secondRect.width / 2;
            const secondStartY = secondRect.y + secondRect.height / 2;

            // Simulate instant mouse drag-and-drop for both items
            simulateMouseAndDrop(firstItem, firstStartX, firstStartY, targetX, targetY);
            simulateMouseAndDrop(secondItem, secondStartX, secondStartY, targetX, targetY);

            // Click the clear button immediately to reset the crafting area
            await clickClearButton();
        }

        async function processItems(itemsRow, x, y) {
            const items = itemsRow.getElementsByClassName("item");
            const promises = []; // Use promises for parallel execution

            // Process combinations concurrently in parallel
            for (let i = 0; i < items.length; i++) {
                for (let j = 0; j < items.length; j++) {
                    if (!processedPairs.has(`${i}-${j}`)) {
                        processedPairs.add(`${i}-${j}`);
                        promises.push(processCombination(items[i], items[j], x, y)); // Concurrently process combinations
                    }
                }
            }

            // Wait for all combinations to be processed
            await Promise.all(promises);
            saveProcessedPairs(); // Save the processed pairs after finishing
        }

        // Cache DOM elements to avoid re-querying
        let itemsRows = document.getElementsByClassName("items-row");
        if (itemsRows.length === 0) {
            const itemsInner = document.querySelector(".items-inner");
            return await processItems(itemsInner, 200, 600); // Default position if no rows found
        }

        // Process all item rows concurrently
        const rowPromises = [];

        for (const row of itemsRows) {
            rowPromises.push(processItems(row, 500, 100)); // Process each row concurrently
        }

        await Promise.all(rowPromises); // Wait for all row processes to finish
    }

    // Retry mechanism for error handling with minimal delay
    async function startCrafting() {
        try {
            await beat_infinite_craft();
        } catch (error) {
            console.error("Error during crafting process:", error);
            setImmediate(startCrafting); // Retry immediately
        }
    }

    // Start the crafting process
    startCrafting();
})();