// ==UserScript==
// @name         Mousehunt Gloomy Greenwood (Cypher)
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Autobot for Gloomy Greenwood
// @author       Cypher
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552730/Mousehunt%20Gloomy%20Greenwood%20%28Cypher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552730/Mousehunt%20Gloomy%20Greenwood%20%28Cypher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mhLocation = document.querySelector('.mousehuntHud-environmentName').textContent;
    if (mhLocation !== 'Gloomy Greenwood'){
        return;
    }
    else {
        console.log('%c[Gloomy Greenwood] Detected location in Gloomy Greenwood...', 'color: #2b7cff;')
    }

    // Wrap the entire interval function in an async function
    setInterval(async function(){
        const tier1CheeseNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-quantity.quantity[data-item-type="cauldron_tier_1_cheese"]').textContent.trim().match(/(\d+)/)[0]);
        const tier1IngredientNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-ingredientQuantity.quantity[data-item-type="cauldron_tier_1_ingredient_stat_item"]').textContent.trim().replace(/,/g, ''));
        const tier2CheeseNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-quantity.quantity[data-item-type="cauldron_tier_2_cheese"]').textContent.trim().match(/(\d+)/)[0]);
        const tier2IngredientNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-ingredientQuantity.quantity[data-item-type="cauldron_tier_2_ingredient_stat_item"]').textContent.trim().replace(/,/g, ''));
        const tier3CheeseNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-quantity.quantity[data-item-type="cauldron_tier_3_cheese"]').textContent.trim().match(/(\d+)/)[0]);
        const tier3IngredientNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-ingredientQuantity.quantity[data-item-type="cauldron_tier_3_ingredient_stat_item"]').textContent.trim().replace(/,/g, ''));
        const tier4CheeseNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-quantity.quantity[data-item-type="cauldron_tier_4_cheese"]').textContent.trim().match(/(\d+)/)[0]);
        const tier4IngredientNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-bait-ingredientQuantity.quantity[data-item-type="cauldron_tier_4_ingredient_stat_item"]').textContent.trim().replace(/,/g, ''));
        const extractNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-extract-quantity.quantity[data-item-type="halloween_extract_stat_item"]').textContent.trim().match(/(\d+)/)[0]);
        const mousedrakeNum = Number(document.querySelector('.halloweenBoilingCauldronHUD-extract-mouseDrake-quantity.quantity[data-item-type="cauldron_potion_ingredient_stat_item"]').textContent.trim().replace(/,/g, ''));
        const minCheeseNum = 2;

        const cauldron0 = document.querySelector('.halloweenBoilingCauldronHUD-cauldron.active[data-cauldron-index="0"]');
        const cauldron1 = document.querySelector('.halloweenBoilingCauldronHUD-cauldron.active[data-cauldron-index="1"]');

        if (mousedrakeNum >= 15){
            if (cauldron0 === null){
                console.log('[Gloomy Greenwood] Brewing Extract in Cauldron0...');
                const cauldron0Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="0"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron0Button.click();
                await waitFor(2000);
                const brewMousedrakeButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.halloween_extract_cauldron_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewMousedrakeButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else if (cauldron1 === null){
                console.log('[Gloomy Greenwood] Brewing Extract in Cauldron1...');
                const cauldron1Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="1"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron1Button.click();
                await waitFor(2000);
                const brewMousedrakeButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.halloween_extract_cauldron_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewMousedrakeButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Both cauldrons brewing, bypassing...');
            }
        }
        else if (tier4IngredientNum >= 15){
            if (cauldron0 === null){
                console.log('[Gloomy Greenwood] Brewing Scream Cheese in Cauldron0...');
                const cauldron0Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="0"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron0Button.click();
                await waitFor(2000);
                const brewScreamCheeseButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_4_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewScreamCheeseButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else if (cauldron1 === null){
                console.log('[Gloomy Greenwood] Brewing Scream Cheese in Cauldron1...');
                const cauldron1Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="1"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron1Button.click();
                await waitFor(2000);
                const brewScreamCheeseButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_4_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewScreamCheeseButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Both cauldrons brewing, bypassing...');
            }
        }
        else if (tier3IngredientNum >= 15){
            if (cauldron0 === null){
                console.log('[Gloomy Greenwood] Brewing Polter-Geitost in Cauldron0...');
                const cauldron0Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="0"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron0Button.click();
                await waitFor(2000);
                const brewPolterGeitostButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_3_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewPolterGeitostButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else if (cauldron1 === null){
                console.log('[Gloomy Greenwood] Brewing Polter-Geitost in Cauldron1...');
                const cauldron1Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="1"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron1Button.click();
                await waitFor(2000);
                const brewPolterGeitostButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_3_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewPolterGeitostButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Both cauldrons brewing, bypassing...');
            }
        }
        else if (tier2IngredientNum >= 15){
            if (cauldron0 === null){
                console.log('[Gloomy Greenwood] Brewing Bonefort Cheese in Cauldron0...');
                const cauldron0Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="0"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron0Button.click();
                await waitFor(2000);
                const brewBonefortButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_2_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewBonefortButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else if (cauldron1 === null){
                console.log('[Gloomy Greenwood] Brewing Bonefort Cheese in Cauldron1...');
                const cauldron1Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="1"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron1Button.click();
                await waitFor(2000);
                const brewBonefortButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_2_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewBonefortButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Both cauldrons brewing, bypassing...');
            }
        }
        else if (tier1IngredientNum >= 15){
            if (cauldron0 === null){
                console.log('[Gloomy Greenwood] Brewing Montery Jack-O-Lantern in Cauldron0...');
                const cauldron0Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="0"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron0Button.click();
                await waitFor(2000);
                const brewMonteryButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_1_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewMonteryButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else if (cauldron1 === null){
                console.log('[Gloomy Greenwood] Brewing Montery Jack-O-Lantern in Cauldron1...');
                const cauldron1Button = document.querySelector('.halloweenBoilingCauldronHUD-cauldron[data-cauldron-index="1"] .halloweenBoilingCauldronHUD-cauldron-boundingBox');
                cauldron1Button.click();
                await waitFor(2000);
                const brewMonteryButton = document.querySelector('.halloweenBoilingCauldronRecipeView-recipeRow.cauldron_tier_1_recipe .halloweenBoilingCauldronRecipeView-brewButton.cheese.small');
                brewMonteryButton.click();
                await waitFor(2000);
                const closeButton = document.querySelector('.jsDialogClose');
                closeButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Both cauldrons brewing, bypassing...');
            }
        }
        else {
        }

        const currentCheese = document.querySelector('.campPage-trap-baitName').textContent.trim();
        if (tier4CheeseNum > minCheeseNum){
            if (currentCheese !== 'Scream Cheese'){
                console.log('[Gloomy Greenwood] Arming Scream Cheese...');
                const armScreamCheeseButton = document.querySelector('.halloweenBoilingCauldronHUD-bait.cauldron_tier_4_cheese .halloweenBoilingCauldronHUD-bait-image');
                armScreamCheeseButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Currently arming Scream Cheese, bypassing...');
            }
        }
        else if (tier3CheeseNum > minCheeseNum){
            if (currentCheese !== 'Polter-Geitost'){
                console.log('[Gloomy Greenwood] Arming Polter-Geitost...');
                const armScreamCheeseButton = document.querySelector('.halloweenBoilingCauldronHUD-bait.cauldron_tier_3_cheese .halloweenBoilingCauldronHUD-bait-image');
                armScreamCheeseButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Currently arming Polter-Geitost, bypassing...');
            }
        }
        else if (tier2CheeseNum > minCheeseNum){
            if (currentCheese !== 'Bonefort Cheese'){
                console.log('[Gloomy Greenwood] Arming Boenfort Cheese...');
                const armScreamCheeseButton = document.querySelector('.halloweenBoilingCauldronHUD-bait.cauldron_tier_2_cheese .halloweenBoilingCauldronHUD-bait-image');
                armScreamCheeseButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Currently arming Bonefort Cheese, bypassing...');
            }
        }
        else if (tier1CheeseNum > minCheeseNum){
            if (currentCheese !== 'Monterey Jack-O-Lantern'){
                console.log('[Gloomy Greenwood] Arming Monterey Jack-O-Lantern...');
                const armScreamCheeseButton = document.querySelector('.halloweenBoilingCauldronHUD-bait.cauldron_tier_1_cheese .halloweenBoilingCauldronHUD-bait-image');
                armScreamCheeseButton.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Currently arming Monterey Jack-O-Lantern, bypassing...');
            }
        }
        else {
            if (currentCheese !== 'Brie Cheese'){
                console.log('[Gloomy Greenwood] Arming Brie...');
                const checkBait = document.querySelector('button[data-item-classification="bait"]');
                checkBait.click();
                await waitFor(2000);
                const brieCheeseArmButton = document.querySelector('.campPage-trap-itemBrowser-item-armButton[data-item-id="80"]'); // Brie Cheese
                brieCheeseArmButton.click();
                await waitFor(2000);
                const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
                closeCharm.click();
                await waitFor(2000);
            }
            else {
                console.log('[Gloomy Greenwood] Brie armed, bypassing...');
            }
        }



    }, 20*1000);

    // Utility function to wait for a specified time
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();