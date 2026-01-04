// ==UserScript==
// @name         Farmrpg autofarm uwu
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @description  Autofarm for farmrpg.com with random harvest and replant delays (24–50s harvest, 20–60s plant)
// @author       1011001
// @match        https://farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        none
// @require      https://greasyfork.org/scripts/469666-farmrpg-helper/code/FarmRPG%20Helper.user.js
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/555160/Farmrpg%20autofarm%20uwu.user.js
// @updateURL https://update.greasyfork.org/scripts/555160/Farmrpg%20autofarm%20uwu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getRandomDelay(minSeconds, maxSeconds) {
        return Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000;
    }

    async function clickActionsModalButtonIfExists() {
        const actionsModalButton = document.querySelector('.actions-modal-button');
        if (actionsModalButton) {
            actionsModalButton.click();
            console.log("✅ Clicked: Yes, Plant All");
        }
    }

    async function execute() {
        const harvestAndPlant = document.querySelector('.last-bought-button.svelte-rr924h');
        if (!harvestAndPlant) {
            console.log("❌ Harvest/Plant button not found. Retrying in 10s...");
            return;
        }

        const harvestDelay = getRandomDelay(24, 50);
        const plantDelay = getRandomDelay(20, 60);

        console.log(`⏳ Waiting ${harvestDelay / 1000}s before harvesting...`);
        await timeout(harvestDelay);

        harvestAndPlant.click();
        console.log("🌾 Clicked: Harvest All Crops");

        await timeout(2000);
        await clickActionsModalButtonIfExists();

        console.log(`🌱 Waiting ${plantDelay / 1000}s before replanting...`);
        await timeout(plantDelay);

        harvestAndPlant.click();
        console.log("🌱 Clicked: Plant All Selected");

        await timeout(2000);
        await clickActionsModalButtonIfExists();
    }

    async function loop() {
        while (true) {
            await execute();
        }
    }

    window.addEventListener('load', () => {
        loop();
    });
})();
