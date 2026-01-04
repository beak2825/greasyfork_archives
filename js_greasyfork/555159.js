// ==UserScript==
// @name         Farm RPG Watermelon Auto Harvest & Plant (with Confirm)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Waits for watermelon to finish growing, then harvests and plants with randomized delays and confirmation click
// @author       YourNameHere
// @license      MIT
// @match        https://farmrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555159/Farm%20RPG%20Watermelon%20Auto%20Harvest%20%20Plant%20%28with%20Confirm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555159/Farm%20RPG%20Watermelon%20Auto%20Harvest%20%20Plant%20%28with%20Confirm%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isWatermelonReady() {
        const cropRows = document.querySelectorAll('.crop-row');
        for (const row of cropRows) {
            const label = row.querySelector('.crop-label');
            if (label && label.textContent.includes('Watermelon')) {
                const progressBar = row.querySelector('.progress-bar');
                if (progressBar) {
                    const bgColor = window.getComputedStyle(progressBar).backgroundColor;
                    return bgColor === 'rgb(0, 128, 0)';
                }
            }
        }
        return false;
    }

    function clickPlantConfirmation() {
        const confirmBtn = [...document.querySelectorAll('button')].find(btn =>
            btn.textContent.trim().toLowerCase() === 'yes, plant all'
        );
        if (confirmBtn) {
            confirmBtn.click();
            console.log("✅ Confirmed: Yes, Plant All");
        } else {
            console.log("⚠️ Confirmation button not found. Retrying in 5s...");
            setTimeout(clickPlantConfirmation, 5000);
        }
    }

    function monitorAndAct() {
        const harvestBtn = [...document.querySelectorAll('button')].find(btn => btn.textContent.includes('Harvest All Crops'));
        const plantBtn = [...document.querySelectorAll('button')].find(btn => btn.textContent.includes('Plant All Selected'));

        if (!harvestBtn || !plantBtn) {
            console.log("🔍 Buttons not found. Retrying in 15s...");
            setTimeout(monitorAndAct, 15000);
            return;
        }

        if (isWatermelonReady()) {
            const harvestDelay = getRandomDelay(20000, 40000);
            const plantDelay = getRandomDelay(50000, 130000);

            console.log(`🍉 Watermelon ready! Harvesting in ${harvestDelay / 1000}s`);
            setTimeout(() => {
                harvestBtn.click();
                console.log("🌾 Harvest clicked");

                setTimeout(() => {
                    plantBtn.click();
                    console.log("🌱 Plant clicked");

                    // Wait a moment for confirmation modal to appear
                    setTimeout(() => {
                        clickPlantConfirmation();

                        // Restart loop after confirmation
                        setTimeout(monitorAndAct, 10000);
                    }, 3000);
                }, plantDelay);
            }, harvestDelay);
        } else {
            console.log("⏳ Watermelon still growing. Checking again in 30s...");
            setTimeout(monitorAndAct, 30000);
        }
    }

    window.addEventListener('load', () => {
        monitorAndAct();
    });
})();
