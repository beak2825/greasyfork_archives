// ==UserScript==
// @name         Infinite Craft Auto Processor (Ultra Fast for Safari/Linux/Firefox)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Ultra-fast Infinite Craft combination processor for Safari, Firefox, and Linux
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553695/Infinite%20Craft%20Auto%20Processor%20%28Ultra%20Fast%20for%20SafariLinuxFirefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553695/Infinite%20Craft%20Auto%20Processor%20%28Ultra%20Fast%20for%20SafariLinuxFirefox%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateMouseAndDrop(element, startX, startY, targetX, targetY) {
        function triggerMouseEvent(target, type, clientX, clientY) {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                clientX,
                clientY,
                view: window
            });
            target.dispatchEvent(event);
        }
        triggerMouseEvent(element, "mousedown", startX, startY);
        triggerMouseEvent(document, "mousemove", targetX, targetY);
        triggerMouseEvent(document, "mouseup", targetX, targetY);

        element.style.left = `${targetX}px`;
        element.style.top = `${targetY}px`;
    }

    async function processAllCombinations() {
        let stored = [];
        try {
            stored = JSON.parse(localStorage.getItem("processedPairs")) || [];
        } catch {}
        const processedPairs = new Set(stored);

        function saveProcessedPairs() {
            localStorage.setItem("processedPairs", JSON.stringify(Array.from(processedPairs)));
        }

        async function clickClearButton() {
            const clearBtn = document.querySelector(".clear");
            if (clearBtn) clearBtn.click();
        }

        async function processCombination(firstItem, secondItem, targetX, targetY) {
            const firstRect = firstItem.getBoundingClientRect();
            const secondRect = secondItem.getBoundingClientRect();
            simulateMouseAndDrop(firstItem, firstRect.x + firstRect.width / 2, firstRect.y + firstRect.height / 2, targetX, targetY);
            simulateMouseAndDrop(secondItem, secondRect.x + secondRect.width / 2, secondRect.y + secondRect.height / 2, targetX, targetY);
            await clickClearButton();
        }

        async function processItems(container, x, y) {
            const items = container.getElementsByClassName("item");
            for (let i = 0; i < items.length; i++) {
                for (let j = 0; j < items.length; j++) {
                    const pair = `${i}-${j}`;
                    if (!processedPairs.has(pair)) {
                        processedPairs.add(pair);
                        await processCombination(items[i], items[j], x, y);
                        await new Promise(r => setTimeout(r, 5)); // small delay for Safari stability
                    }
                }
            }
            saveProcessedPairs();
        }

        const rows = document.getElementsByClassName("items-row");
        if (rows.length === 0) {
            const inner = document.querySelector(".items-inner");
            if (inner) await processItems(inner, 200, 600);
            return;
        }

        for (const row of rows) {
            await processItems(row, 500, 100);
        }
    }

    let retries = 0;
    async function startCrafting() {
        try {
            await processAllCombinations();
        } catch (error) {
            console.error("Error during crafting:", error);
            if (retries++ < 10) setTimeout(startCrafting, 100);
        }
    }

    if (document.readyState !== "complete") {
        window.addEventListener("load", startCrafting);
    } else {
        startCrafting();
    }
})();