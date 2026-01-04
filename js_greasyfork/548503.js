// ==UserScript==
// @name         Mousehunt Folklore Finale Script (Cypher)
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Autobot for Mousehunt Folklore Finale (Afterword Acres/Epilogue Falls/Conclusion Cliffs)
// @author       Cypher
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548503/Mousehunt%20Folklore%20Finale%20Script%20%28Cypher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548503/Mousehunt%20Folklore%20Finale%20Script%20%28Cypher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mhLocation = document.querySelector('.mousehuntHud-environmentName').textContent;
    if (mhLocation === 'Afterword Acres'){
        console.log('%c[Folklore Finale] Detected location in Folklore Finale region...', 'color: #2b7cff;')
    }
    else if (mhLocation === 'Epilogue Falls' ||
             mhLocation === 'Conclusion Cliffs'
    ){
        console.log('%c[Folklore Finale] Detected location in Folklore Finale region...', 'color: #2b7cff;')

        // Create auto CC dropdown in HUD
        const hudContainer = document.querySelector('.headsUpDisplayEpilogueFallsView__zoneInfoContainer');
        let existingCCDropdown = hudContainer.querySelector('.autoCCdropdown');
        let ccDropdownBox;

        const wrapperFont = 'Segoe UI';
        const wrapperFontSize = '11px';

        if (!existingCCDropdown){
            const wrapper = document.createElement('div');
            wrapper.className = 'autoCCdropdown'
            wrapper.style.marginTop = '32px'
            wrapper.style.marginLeft = '210px'
            wrapper.style.fontFamily = wrapperFont;
            wrapper.style.fontSize = wrapperFontSize;

            const dropdownLabel = document.createElement('span');
            dropdownLabel.textContent = 'Auto CC: ';

            const ccDropdownBox = document.createElement('select');

            const options = ['Auto', 'NoAutoMHA', 'Off'];
            options.forEach((optionText) => {
                const option = document.createElement('option');
                option.value = optionText.toLowerCase().replace(/ /g, '_');
                option.textContent = optionText;
                ccDropdownBox.appendChild(option);
            });

            const storedCCSetting = localStorage.getItem('autoCCSetting');
            if (storedCCSetting && options.some(opt => opt.toLowerCase() === storedCCSetting)) {
                ccDropdownBox.value = storedCCSetting;
            }

            wrapper.appendChild(dropdownLabel);
            wrapper.appendChild(ccDropdownBox);

            hudContainer.appendChild(wrapper);
            ccDropdownBox.addEventListener('change', async () => {
                const selectedCCSetting = ccDropdownBox.value;
                localStorage.setItem('autoCCSetting', selectedCCSetting);
                console.log(`%c[Folklore Finale] Selected CC setting stored: ${selectedCCSetting}`, 'color: #ffa02b;');
            });
        }
        else {
            console.log('[Folklore Finale] CC setting dropdown already exists, bypassing...');
            const storedCCSetting = localStorage.getItem('autoCCSetting');
            if (storedCCSetting) {
                existingCCDropdown.value = storedCCSetting;
            }
        }
        // Create Barrel Strategy dropdown in HUD
        let existingStrategyDropdown = hudContainer.querySelector('.strategydropdown');
        let strategyDropdownBox;

        if (!existingStrategyDropdown){
            const wrapper = document.createElement('div');
            wrapper.className = 'strategydropdown'
            wrapper.style.marginTop = '10px'
            wrapper.style.marginLeft = '165px'
            wrapper.style.fontFamily = wrapperFont;
            wrapper.style.fontSize = wrapperFontSize;

            const dropdownLabel = document.createElement('span');
            dropdownLabel.textContent = 'Barrel Strategy: ';

            const strategyDropdownBox = document.createElement('select');

            const options = ['Morsel', 'Algae', 'Halophyte', 'Seashell/Coral', 'Pearl'];
            options.forEach((optionText) => {
                const option = document.createElement('option');
                option.value = optionText.toLowerCase().replace(/ /g, '_');
                option.textContent = optionText;
                strategyDropdownBox.appendChild(option);
            });

            const storedStrategy = localStorage.getItem('barrelStrategy');
            if (storedStrategy && options.some(opt => opt.toLowerCase() === storedStrategy)) {
                strategyDropdownBox.value = storedStrategy;
            }

            wrapper.appendChild(dropdownLabel);
            wrapper.appendChild(strategyDropdownBox);

            hudContainer.appendChild(wrapper);
            strategyDropdownBox.addEventListener('change', async () => {
                const selectedStrategy = strategyDropdownBox.value;
                localStorage.setItem('barrelStrategy', selectedStrategy);
                console.log(`%c[Folklore Finale] Selected strategy stored: ${selectedStrategy}`, 'color: #ffa02b;');
            });
        }
        else {
            console.log('[Folklore Finale] Barrel Strategy dropdown already exists, bypassing...');
            const storedStrategy = localStorage.getItem('barrelStrategy');
            if (storedStrategy) {
                existingStrategyDropdown.value = storedStrategy;
            }
        }
    }
    else {
        return;
    }

    // Wrap the entire interval function in an async function
    setInterval(async function(){

        const poeticPlankTrigger = 7200;
        const literaryLogNum = Number(document.querySelector('.folkloreForestRegionView-environmentInventory-block-quantity-generic.quantity[data-item-type="literary_lumber_stat_item"]').textContent.trim().replace(/,/g, ''));
        const poeticPlankNum = Number(document.querySelector('.folkloreForestRegionView-environmentInventory-block-quantity-generic.quantity[data-item-type="poetic_plank_stat_item"]').textContent.trim().replace(/,/g, ''));
        const ideaGermNum = Number(document.querySelector('.folkloreForestRegionView-environmentInventory-block-quantity-generic.quantity[data-item-type="idea_germ_stat_item"]').textContent.trim().replace(/,/g, ''));

        const hypotheticalHalophyteTrigger = 120;
        const conceptualCoralTrigger = 60;
        const hypotheticalHalophyteNum = Number(document.querySelector('.folkloreForestRegionView-environmentInventory-block-quantity-generic.quantity[data-item-type="hypothetical_halophyte_stat_item"]').textContent.trim().replace(/,/g, ''));
        const conceptualCoralNum = Number(document.querySelector('.folkloreForestRegionView-environmentInventory-block-quantity-generic.quantity[data-item-type="conceptual_coral_stat_item"]').textContent.trim().replace(/,/g, ''));
        const plotHookNum = Number(document.querySelector('.folkloreForestRegionView-environmentInventory-block-quantity-generic.quantity[data-item-type="plot_hook_stat_item"]').textContent.trim().replace(/,/g, ''));
        const pearlOfWisdomNum = Number(document.querySelector('.folkloreForestRegionView-environmentInventory-block-quantity-generic.quantity[data-item-type="pearl_of_wisdom_stat_item"]').textContent.trim().replace(/,/g, ''));

        const travelButton = document.querySelector('.folkloreForestRegionView-travelButton');

        // Simplified Travelling Functions
        async function traveltoEF(){
            travelButton.click();
            await waitFor(3000);
            const efTravelButton = document.querySelector('.folkloreForestRegionView-dialog-block.epilogue_falls .folkloreForestRegionView-button.prologue_pond');
            if (efTravelButton){
                efTravelButton.click();
                await waitFor(3000);
            }
        }
        async function traveltoAA(){
            travelButton.click();
            await waitFor(3000);
            const aaTravelButton = document.querySelector('.folkloreForestRegionView-dialog-block.afterword_acres .folkloreForestRegionView-button.foreword_farm');
            if (aaTravelButton){
                aaTravelButton.click();
                await waitFor(3000);
            }
        }


        // Afterword Acres
        if (mhLocation === 'Afterword Acres'){

            console.log('%c[Afterword Acres] Detected location in Afterword Acres...', 'color: #2b7cff;')
            const multiplierPriority = 8; // User input
            const currentBlightNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__blightLevelQuantity').textContent.trim().replace(/,/g, ''));
            const droidRate = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__productivityRateQuantity').textContent.trim().replace(/,/g, ''));
            const harvestDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid[data-type="harvesting"] .headsUpDisplayAfterwordAcresView__droidOutputQuantity').textContent.trim());
            const carveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid[data-type="sawing"] .headsUpDisplayAfterwordAcresView__droidOutputQuantity').textContent.trim());
            const addCarveDroidNum = document.querySelector('button.headsUpDisplayAfterwordAcresView__droid[data-type="sawing"] .headsUpDisplayAfterwordAcresView_droidIncrementButton');
            const minusCarveDroidNum = document.querySelector('button.headsUpDisplayAfterwordAcresView__droid[data-type="sawing"] .headsUpDisplayAfterwordAcresView_droidDecrementButton');
            const cleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid[data-type="defending"] .headsUpDisplayAfterwordAcresView__droidOutputQuantity').textContent.trim());
            const addCleanseDroidNum = document.querySelector('button.headsUpDisplayAfterwordAcresView__droid[data-type="defending"] .headsUpDisplayAfterwordAcresView_droidIncrementButton');
            const minusCleanseDroidNum = document.querySelector('button.headsUpDisplayAfterwordAcresView__droid[data-type="defending"] .headsUpDisplayAfterwordAcresView_droidDecrementButton');

            const toggleCCButton = document.querySelector('.folkloreForestRegionView-fuel-toggleButton');
            const checkCCActive = document.querySelector('.folkloreForestRegionView-fuelContainer.mousehuntTooltipParent.active');

            const manchegoMorselNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__ingredientQuantity.quantity[data-item-type="metaphor_morsel_stat_item"]').textContent.trim().replace(/,/g, ''));
            const manchegoCheeseNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__baitQuantity.quantity[data-item-type="metaphor_manchego_cheese"]').textContent.trim().replace(/,/g, ''));
            const manchegoCheeseArmButton = document.querySelector('button.headsUpDisplayAfterwordAcresView__baitImage[data-item-type="metaphor_manchego_cheese"]');
            const manchegoCheeseCraftButton = document.querySelector('button.headsUpDisplayAfterwordAcresView__baitIngredientImage[data-item-type="metaphor_morsel_stat_item"]');

            const allegoryAlgaeNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__ingredientQuantity.quantity[data-item-type="allegory_algae_stat_item"]').textContent.trim().replace(/,/g, ''));
            const anariCheeseNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__baitQuantity.quantity[data-item-type="allegory_anari_cheese"]').textContent.trim().replace(/,/g, ''));
            const anariCheeseArmButton = document.querySelector('button.headsUpDisplayAfterwordAcresView__baitImage[data-item-type="allegory_anari_cheese"]');
            const anariCheeseCraftButton = document.querySelector('button.headsUpDisplayAfterwordAcresView__baitIngredientImage[data-item-type="allegory_algae_stat_item"]');

            const symbolicSeashellNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__ingredientQuantity.quantity[data-item-type="symbolic_seashell_stat_item"]').textContent.trim().replace(/,/g, ''));
            const sireneCheeseNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__baitQuantity.quantity[data-item-type="symbolic_sirene_cheese"]').textContent.trim().replace(/,/g, ''));
            const sireneCheeseArmButton = document.querySelector('button.headsUpDisplayAfterwordAcresView__baitImage[data-item-type="symbolic_sirene_cheese"]');
            const sireneCheeseCraftButton = document.querySelector('button.headsUpDisplayAfterwordAcresView__baitIngredientImage[data-item-type="symbolic_seashell_stat_item"]');

            // Auto CC off when in Afterwoods Acres
            if (checkCCActive){
                console.log('%c[Afterword Acres] Not in Epilogue Falls, deactivating CC...', 'color: #14e03a;');
                toggleCCButton.click();
                await waitFor(3000);
            }
            else {
                console.log('[Afterword Acres] CC inactive in Afterword Acres, bypassing...');
            }

            // Simplified Driod Movement Functions
            async function reset3Harvest(){
                console.log('%c[Afterword Acres] Reseting 3 Droids to Harvest...', 'color: #b82bff;')
                // Reset Carving
                while (true){
                    const decreaseCarvingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidDecrementButton[data-can-decrement="true"][data-type="sawing"]');
                    if (decreaseCarvingButton){
                        decreaseCarvingButton.click();
                        await waitFor(3000);
                    }
                    else {
                        break;
                    }
                }
                // Reset Cleansing
                while (true){
                    const decreaseCleansingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidDecrementButton[data-can-decrement="true"][data-type="defending"]');
                    if (decreaseCleansingButton){
                        decreaseCleansingButton.click();
                        await waitFor(3000);
                    }
                    else {
                        break;
                    }
                }
            }
            async function assign1Carving(){
                console.log('%c[Afterword Acres] Assigning 1 Carving Droids...', 'color: #ffa02b;')
                // Assign Carving
                while (true){
                    const increaseCarvingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="sawing"]');
                    const checkCarveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__sawing .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    const checkCleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__defending .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    // Assign Carve
                    if (checkCarveDroidNum < 1 && increaseCarvingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving Droids, increasing Carving by 1...`)
                        increaseCarvingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCarveDroidNum > 1 || checkCleanseDroidNum !== 0 || !increaseCarvingButton){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign2Carving(){
                console.log('%c[Afterword Acres] Assigning 2 Carving Droids...', 'color: #ffa02b;')
                // Assign Carving
                while (true){
                    const increaseCarvingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="sawing"]');
                    const checkCarveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__sawing .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    if (checkCarveDroidNum < 2 && increaseCarvingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving Droids, increasing Carving by 1...`)
                        increaseCarvingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCarveDroidNum > 2 || !increaseCarvingButton){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign3Carving(){
                console.log('%c[Afterword Acres] Assigning 3 Carving Droids...', 'color: #ffa02b;')
                // Assign Carving
                while (true){
                    const increaseCarvingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="sawing"]');
                    const checkCarveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__sawing .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    if (checkCarveDroidNum < 3 && increaseCarvingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving Droids, increasing Carving by 1...`)
                        increaseCarvingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCarveDroidNum < 3 && !increaseCarvingButton){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Cleansing Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign1Cleansing(){
                console.log('%c[Afterword Acres] Assigning 1 Cleansing Droids...', 'color: #ffa02b;')
                // Assign Cleansing
                while (true){
                    const increaseCleansingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="defending"]');
                    const checkCarveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__sawing .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    const checkCleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__defending .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    // Assign Carve
                    if (checkCleanseDroidNum < 1 && increaseCleansingButton){
                        console.log(`[Afterword Acres] Detected ${checkCleanseDroidNum} Cleansing Droids, increasing Cleansing by 1...`)
                        increaseCleansingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCleanseDroidNum > 1 || checkCarveDroidNum !== 0 || !increaseCleansingButton){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCleanseDroidNum} Cleansing Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign2Cleansing(){
                console.log('%c[Afterword Acres] Assigning 2 Cleansing Droids...', 'color: #ffa02b;')
                // Assign Cleansing
                while (true){
                    const increaseCleansingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="defending"]');
                    const checkCleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__defending .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    if (checkCleanseDroidNum < 2 && increaseCleansingButton){
                        console.log(`[Afterword Acres] Detected ${checkCleanseDroidNum} Cleansing Droids, increasing Cleansing by 1...`)
                        increaseCleansingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCleanseDroidNum === 3 || !increaseCleansingButton){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCleanseDroidNum} Cleansing Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign3Cleansing(){
                console.log('%c[Afterword Acres] Assigning 3 Cleansing Droids...', 'color: #ffa02b;')
                // Assign Cleansing
                while (true){
                    const increaseCleansingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="defending"]');
                    const checkCleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__defending .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    if (checkCleanseDroidNum < 3 && increaseCleansingButton){
                        console.log(`%c[Afterword Acres] Detected ${checkCleanseDroidNum} Cleansing Droids, increasing Cleansing by 1...`)
                        increaseCleansingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCleanseDroidNum < 3 && !increaseCleansingButton){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCleanseDroidNum} Cleansing Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign1Carving1Cleansing(){
                console.log('%c[Afterword Acres] Assigning 1 Carving and 1 Cleansing Droid...', 'color: #ffa02b;')
                while (true){
                    const increaseCarvingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="sawing"]');
                    const increaseCleansingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="defending"]');
                    const checkCarveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__sawing .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    const checkCleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__defending .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    // Assign Carve and Cleanse
                    if (checkCarveDroidNum < 1 && increaseCarvingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, increasing Carving by 1...`)
                        increaseCarvingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCleanseDroidNum < 1 && increaseCleansingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, increasing Cleansing by 1...`)
                        increaseCleansingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCarveDroidNum > 1 || checkCleanseDroidNum > 1 || !increaseCarvingButton || !increaseCleansingButton){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign1Carving2Cleansing(){
                console.log('%c[Afterword Acres] Assigning 1 Carving and 2 Cleansing Droids...', 'color: #ffa02b;')
                while (true){
                    const increaseCarvingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="sawing"]');
                    const increaseCleansingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="defending"]');
                    const checkCarveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__sawing .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    const checkCleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__defending .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    // Assign Carve and Cleanse
                    if (checkCarveDroidNum < 1 && increaseCarvingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, increasing Carving by 1...`)
                        increaseCarvingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCleanseDroidNum < 2 && increaseCleansingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, increasing Cleansing by 1...`)
                        increaseCleansingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCarveDroidNum > 1 || checkCleanseDroidNum > 2){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, bypassed...`)
                        break;
                    }
                }
            }
            async function assign2Carving1Cleansing(){
                console.log('%c[Afterword Acres] Assigning 2 Carving and 1 Cleansing Droids...', 'color: #ffa02b;')
                while (true){
                    const increaseCarvingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="sawing"]');
                    const increaseCleansingButton = document.querySelector('button.headsUpDisplayAfterwordAcresView_droidIncrementButton[data-can-increment="true"][data-type="defending"]');
                    const checkCarveDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__sawing .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    const checkCleanseDroidNum = Number(document.querySelector('.headsUpDisplayAfterwordAcresView__droid.headsUpDisplayAfterwordAcresView__defending .headsUpDisplayAfterwordAcresView_droidNumAssigned').textContent.trim());
                    // Assign Carve and Cleanse
                    if (checkCarveDroidNum < 2 && increaseCarvingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, increasing Carving by 1...`)
                        increaseCarvingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCleanseDroidNum < 1 && increaseCleansingButton){
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, increasing Cleansing by 1...`)
                        increaseCleansingButton.click();
                        await waitFor(3000);
                    }
                    else if (checkCarveDroidNum > 2 || checkCleanseDroidNum > 1){
                        await reset3Harvest();
                        await waitFor(3000);
                    }
                    else {
                        console.log(`[Afterword Acres] Detected ${checkCarveDroidNum} Carving and ${checkCleanseDroidNum} Cleansing Droids, bypassed...`)
                        break;
                    }
                }
            }

            // Blight Level Strategy
            console.log(`[Afterword Acres] Current ${currentBlightNum} blight detected...`)
            if (multiplierPriority === 1){
                console.log('[Afterword Acres] Blight multiplier x1 detected...')
                if (literaryLogNum >= (droidRate*3)){
                    await assign3Carving();
                }
                else if (literaryLogNum >= (droidRate*2)){
                    await assign2Carving();
                }
                else if (literaryLogNum >= (droidRate*1)){
                    await assign1Carving();
                }
                else {
                    await reset3Harvest();
                }
            }
            else if (multiplierPriority === 2){
                console.log('[Afterword Acres] Blight multiplier x2 detected...')
                if (currentBlightNum > 836){ // 900 - 2*32 Herbicidal Maniac buffer
                    if ((836 - currentBlightNum)/droidRate > 3){
                        await assign3Cleansing();
                    }
                    else if ((836 - currentBlightNum)/droidRate >= 2){
                        if (literaryLogNum >= (droidRate*1)){
                            await assign1Carving2Cleansing();
                        }
                        else {
                            await assign2Cleansing();
                        }
                    }
                }
                else if (currentBlightNum <= 600){ // Overshot next multiplier
                    if (literaryLogNum >= (droidRate*3)){
                        await assign3Carving();
                    }
                    else if (literaryLogNum >= (droidRate*2)){
                        await assign2Carving();
                    }
                    else if (literaryLogNum >= (droidRate*1)){
                        await assign1Carving();
                    }
                    else {
                        await reset3Harvest();
                    }
                }
                else {
                    await assign1Carving1Cleansing();
                }
            }
            else if (multiplierPriority === 4){
                console.log('[Afterword Acres] Blight multiplier x4 detected...')
                if (currentBlightNum > 536){ // 600 - 2*32 Herbicidal Maniac buffer
                    if ((currentBlightNum - 536)/droidRate > 2){
                        await assign3Cleansing();
                    }
                    else if ((currentBlightNum - 536)/droidRate > 1){
                        if (literaryLogNum >= (droidRate*1)){
                            await assign1Carving2Cleansing();
                        }
                        else {
                            await assign2Cleansing();
                        }
                    }
                    else if ((currentBlightNum - 536)/droidRate >= 0){
                        if (literaryLogNum >= (droidRate*2)){
                            await assign2Carving1Cleansing();
                        }
                        else if (literaryLogNum >= (droidRate*1)){
                            await assign1Carving1Cleansing();
                        }
                        else {
                            await reset3Harvest();
                        }
                    }
                    else {
                        await assign1Carving1Cleansing();
                    }
                }
                else if (currentBlightNum <= 80){ // Overshot next multiplier
                    if (literaryLogNum >= (droidRate*3)){
                        await assign3Carving();
                    }
                    else if (literaryLogNum >= (droidRate*2)){
                        await assign2Carving();
                    }
                    else if (literaryLogNum >= (droidRate*1)){
                        await assign1Carving();
                    }
                    else {
                        await reset3Harvest();
                    }
                }
                else {
                    await assign1Carving1Cleansing();
                }
            }
            else if (multiplierPriority === 8){
                console.log('[Afterword Acres] Blight multiplier x8 detected...')
                if ((currentBlightNum - 0)/droidRate > 3){
                    await assign3Cleansing();
                }
                else if ((currentBlightNum - 0)/droidRate >= 2){
                    if (literaryLogNum >= (droidRate*1)){
                        await assign1Carving2Cleansing();
                    }
                    else {
                        await assign2Cleansing();
                    }
                }
                else if ((currentBlightNum - 0)/droidRate >= 1){
                    if (literaryLogNum >= (droidRate*2)){
                        await assign2Carving1Cleansing();
                    }
                    else if (literaryLogNum >= (droidRate*1)){
                        await assign1Carving1Cleansing();
                    }
                    else {
                        await assign1Cleansing();
                    }
                }
                else {
                    if (literaryLogNum >= (droidRate*3)){
                        await assign3Carving();
                    }
                    else if (literaryLogNum >= (droidRate*2)){
                        await assign2Carving();
                    }
                    else if (literaryLogNum >= (droidRate*1)){
                        await assign1Carving();
                    }
                    else {
                        await reset3Harvest();
                    }
                }
            }
            else {
                console.log('[Afterword Acres] No blight multiplier priority indicated...')
            }
        }


        // Epilogue Falls
        if (mhLocation === 'Epilogue Falls'){

            console.log('%c[Epilogue Falls] Detected location in Epilogue Falls...', 'color: #2b7cff;')
            let currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
            let currentHealthLeft = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelHealthContainer .headsUpDisplayEpilogueFallsView__barrelHealth').textContent.trim().replace(/,/g, ''));
            const toggleCCButton = document.querySelector('.folkloreForestRegionView-fuel-toggleButton');
            const checkCCActive = document.querySelector('.folkloreForestRegionView-fuelContainer.mousehuntTooltipParent.active');
            const boostButton = document.querySelector('button.headsUpDisplayEpilogueFallsView__jetBoostButton.EpilogueFallsView__orangeButton');

            const ccHudContainer = document.querySelector('.autoCCdropdown');
            const ccDropdownBox = ccHudContainer.querySelector('select');
            const storedCCSetting = ccDropdownBox.value.toLowerCase();

            const strategyHudContainer = document.querySelector('.strategydropdown');
            const strategyDropdownBox = strategyHudContainer.querySelector('select');
            const storedStrategy = strategyDropdownBox.value.toLowerCase();

            const currentSpeed = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__speed').textContent.trim().replace(/,/g, ''));
            const currentCurrent = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__current').textContent.trim().replace(/,/g, ''));
            const currentNetMovement = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__movement').textContent.trim().replace(/,/g, ''));

            const brieArmButton = document.querySelector('.folkloreForestRegionView-bait-image[data-item-type="brie_cheese"]');
            const goudaArmButton = document.querySelector('.folkloreForestRegionView-bait-image[data-item-type="gouda_cheese"]');
            const sbArmButton = document.querySelector('.folkloreForestRegionView-bait-image[data-item-type="super_brie_cheese"]');

            const metaphorMorselTrigger = 200;
            const metaphorMorselNum = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__ingredientQuantity.quantity[data-item-type="metaphor_morsel_stat_item"]').textContent.trim().replace(/,/g, ''));
            const manchegoCheeseNum = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__baitQuantity.quantity[data-item-type="metaphor_manchego_cheese"]').textContent.trim().replace(/,/g, ''));
            const manchegoCheeseArmButton = document.querySelector('button.headsUpDisplayEpilogueFallsView__baitImage[data-item-type="metaphor_manchego_cheese"]');
            const manchegoCheeseCraftButton = document.querySelector('button.headsUpDisplayEpilogueFallsView__baitIngredientImage[data-item-type="metaphor_morsel_stat_item"]');

            const allegoryAlgaeTrigger = 300;
            const allegoryAlgaeNum = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__ingredientQuantity.quantity[data-item-type="allegory_algae_stat_item"]').textContent.trim().replace(/,/g, ''));
            const anariCheeseNum = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__baitQuantity.quantity[data-item-type="allegory_anari_cheese"]').textContent.trim().replace(/,/g, ''));
            const anariCheeseArmButton = document.querySelector('button.headsUpDisplayEpilogueFallsView__baitImage[data-item-type="allegory_anari_cheese"]');
            const anariCheeseCraftButton = document.querySelector('button.headsUpDisplayEpilogueFallsView__baitIngredientImage[data-item-type="allegory_algae_stat_item"]');

            const symbolicSeashellTrigger = 270;
            const symbolicSeashellNum = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__ingredientQuantity.quantity[data-item-type="symbolic_seashell_stat_item"]').textContent.trim().replace(/,/g, ''));
            const sireneCheeseNum = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__baitQuantity.quantity[data-item-type="symbolic_sirene_cheese"]').textContent.trim().replace(/,/g, ''));
            const sireneCheeseArmButton = document.querySelector('button.headsUpDisplayEpilogueFallsView__baitImage[data-item-type="symbolic_sirene_cheese"]');
            const sireneCheeseCraftButton = document.querySelector('button.headsUpDisplayEpilogueFallsView__baitIngredientImage[data-item-type="symbolic_seashell_stat_item"]');

            // Auto CC when abundant
            switch (storedCCSetting){
                case 'auto':
                    {
                        const currentArea = document.querySelector('.headsUpDisplayEpilogueFallsView__zoneTitle');
                        const checkAbundant = currentArea.textContent.toLowerCase().includes('abundant');
                        const checkGrotto = currentArea.textContent.toLowerCase().includes('grotto');
                        const checkCCActive = document.querySelector('.folkloreForestRegionView-fuelContainer.mousehuntTooltipParent.active');
                        if (checkAbundant || checkGrotto){
                            if (!checkCCActive){
                                console.log('%c[Epilogue Falls] Detected in abundant/grotto region, turning on CC...', 'color: #14e03a;');
                                toggleCCButton.click();
                                await waitFor(3000);
                            }
                            else {
                                console.log('[Epilogue Falls] CC active in abundant/grotto region, bypassing...');
                            }
                        }
                        else {
                            if (checkCCActive){
                                console.log('%c[Epilogue Falls] Not in abundant region, deactivating CC...', 'color: #14e03a;');
                                toggleCCButton.click();
                                await waitFor(3000);
                            }
                            else {
                                console.log('[Epilogue Falls] CC inactive in non-abundant zone, bypassing...');
                            }
                        }
                    }
                    break;
                case 'noautomha':
                    {
                        const currentArea = document.querySelector('.headsUpDisplayEpilogueFallsView__zoneTitle');
                        const checkAbundant = currentArea.textContent.toLowerCase().includes('abundant');
                        const checkGrotto = currentArea.textContent.toLowerCase().includes('grotto');
                        const checkCCActive = document.querySelector('.folkloreForestRegionView-fuelContainer.mousehuntTooltipParent.active');
                        if (checkAbundant || checkGrotto){
                            const checkMorsel = currentArea.textContent.toLowerCase().includes('morsel');
                            const checkHalophyte = currentArea.textContent.toLowerCase().includes('halophyte');
                            const checkAlgae = currentArea.textContent.toLowerCase().includes('algae');
                            if (checkMorsel || checkHalophyte || checkAlgae){
                                if (checkCCActive){
                                    console.log('%c[Epilogue Falls] Within MHA region, deactivating CC...', 'color: #14e03a;');
                                    toggleCCButton.click();
                                    await waitFor(3000);
                                }
                                else {
                                    console.log('[Epilogue Falls] CC inactive in MHA region, bypassing...');
                                }
                            }
                            else {
                                if (!checkCCActive){
                                    console.log('%c[Epilogue Falls] Detected in abundant/grotto region, turning on CC...', 'color: #14e03a;');
                                    toggleCCButton.click();
                                    await waitFor(3000);
                                }
                                else {
                                    console.log('[Epilogue Falls] CC active in abundant/grotto region, bypassing...');
                                }
                            }
                        }
                        else {
                            if (checkCCActive){
                                console.log('%c[Epilogue Falls] Not in abundant region, deactivating CC...', 'color: #14e03a;');
                                toggleCCButton.click();
                                await waitFor(3000);
                            }
                            else {
                                console.log('[Epilogue Falls] CC inactive in non-abundant zone, bypassing...');
                            }
                        }
                    }
                    break;
                case 'off':
                    break;
            }

            // Simplified Boost Functions
            async function boostBarrel(requestBoostNum){
                let boostCounter = 0;

                const getOrdinalSuffix = n => {
                    const v = n % 100;
                    if (v >= 11 && v <= 13) return `${n}th`;
                    switch (v % 10) {
                        case 1: return `${n}st`;
                        case 2: return `${n}nd`;
                        case 3: return `${n}rd`;
                        default: return `${n}th`;
                    }
                };

                while (true){
                    boostButton.click();
                    await waitFor(1500);
                    const boostNum = Number(document.querySelector('.epilogueFallsActivateBoostDialogView__boostUsagesQuantity').textContent.trim().match(/\d+/)[0]);
                    const boostCost = Number(document.querySelector('.epilogueFallsActivateBoostDialogView__costExplanationEmphasis .epilogueFallsActivateBoostDialogView__greenText').textContent.trim().match(/(\d+)/)[0]);
                    const confirmBoostButton = document.querySelector('.epilogueFallsView__orangeButton.epilogueFallsView__orangeButton--big.epilogueFallsActivateBoostDialogView__enterButton');
                    const cancelBoostButton = document.querySelector('.epilogueFallsView__blueButton.epilogueFallsView__blueButton--big.epilogueFallsActivateBoostDialogView__closeButton');

                    if (boostNum <= requestBoostNum && boostCost <= poeticPlankNum){
                        console.log(`[Epilogue Falls] Boosting for ${getOrdinalSuffix(boostNum)} time...`);
                        boostCounter++;
                        confirmBoostButton.click();
                        await waitFor(1500);
                    }
                    else if (boostCost > poeticPlankNum){
                        console.log(`[Epilogue Falls] Insufficient Poetic Planks (${poeticPlankNum}/${boostCost}), cancelling...`);
                        cancelBoostButton.click();
                        await waitFor(1500);
                        break;
                    }
                    else {
                        console.log(`[Epilogue Falls] Boosted ${boostCounter} time(s)...`);
                        break;
                    }
                }
            }


            // Simplified Build Barrel Functions
            const buildBarrelButton = document.querySelector('.headsUpDisplayEpilogueFallsView__craftBarrelButton');

            async function buildSimpleBarrel(startCheese){
                if (buildBarrelButton){
                    console.log('%c[Epilogue Falls] Crafting Simple Barrel...', 'color: #ffa02b;');
                    buildBarrelButton.click();
                    await waitFor(3000);
                    const simpleBarrel = document.querySelector('div[data-barrel-type="simple_barrel"]');
                    simpleBarrel.click();
                    await waitFor(3000);
                    const mmCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="metaphor_manchego_cheese"]');
                    const aaCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="allegory_anari_cheese"]');
                    const ssCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="symbolic_sirene_cheese"]');
                    switch (startCheese){
                        case 'mmCheese':
                            mmCheese.click();
                            await waitFor(3000);
                        case 'aaCheese':
                            aaCheese.click();
                            await waitFor(3000);
                        case 'ssCheese':
                            ssCheese.click();
                            await waitFor(3000);
                        default:
                            console.log('%c[Epilogue Falls] No starting bait selected...', 'color: #e82a2a;');
                    }
                    const embarkButton = document.querySelector('.epilogueFallsBarrelChoiceDialogView__enterButton');
                    if (embarkButton){
                        embarkButton.click();
                        await waitFor(3000);
                    }
                    else{
                        console.log('%c[Epilogue Falls] Insufficient materials for Simple Barrel detected...', 'color: #e82a2a;');
                    }
                }
                else {
                    console.log('[Epilogue Falls] Bypassed opening build barrel menu...');
                }
            }
            async function buildSturdyBarrel(startCheese){
                if (buildBarrelButton){
                    console.log('%c[Epilogue Falls] Crafting Sturdy Barrel...', 'color: #ffa02b;');
                    buildBarrelButton.click();
                    await waitFor(3000);
                    const sturdyBarrel = document.querySelector('div[data-barrel-type="sturdy_barrel"]');
                    sturdyBarrel.click();
                    await waitFor(3000);
                    const mmCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="metaphor_manchego_cheese"]');
                    const aaCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="allegory_anari_cheese"]');
                    const ssCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="symbolic_sirene_cheese"]');
                    switch (startCheese){
                        case 'mmCheese':
                            mmCheese.click();
                            await waitFor(3000);
                        case 'aaCheese':
                            aaCheese.click();
                            await waitFor(3000);
                        case 'ssCheese':
                            ssCheese.click();
                            await waitFor(3000);
                        default:
                            console.log('%c[Epilogue Falls] No starting bait selected...', 'color: #e82a2a;');
                    }
                    const embarkButton = document.querySelector('.epilogueFallsBarrelChoiceDialogView__enterButton');
                    if (embarkButton){
                        embarkButton.click();
                        await waitFor(3000);
                    }
                    else{
                        console.log('%c[Epilogue Falls] Insufficient materials for Sturdy Barrel detected...', 'color: #e82a2a;');
                    }
                }
                else {
                    console.log('[Epilogue Falls] Bypassed opening build barrel menu...');
                }
            }
            async function buildRobustBarrel(startCheese){
                if (buildBarrelButton){
                    console.log('%c[Epilogue Falls] Crafting Robust Barrel...', 'color: #ffa02b;');
                    buildBarrelButton.click();
                    await waitFor(3000);
                    const robustBarrel = document.querySelector('div[data-barrel-type="sturdy_barrel"]');
                    robustBarrel.click();
                    await waitFor(3000);
                    const mmCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="metaphor_manchego_cheese"]');
                    const aaCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="allegory_anari_cheese"]');
                    const ssCheese = document.querySelector('.epilogueFallsBarrelChoiceDialogView__baitImage[data-item-type="symbolic_sirene_cheese"]');
                    switch (startCheese){
                        case 'mmCheese':
                            mmCheese.click();
                            await waitFor(3000);
                        case 'aaCheese':
                            aaCheese.click();
                            await waitFor(3000);
                        case 'ssCheese':
                            ssCheese.click();
                            await waitFor(3000);
                        default:
                            console.log('%c[Epilogue Falls] No starting bait selected...', 'color: #e82a2a;');
                    }
                    const embarkButton = document.querySelector('.epilogueFallsBarrelChoiceDialogView__enterButton');
                    if (embarkButton){
                        embarkButton.click();
                        await waitFor(3000);
                    }
                    else {
                        console.log('%c[Epilogue Falls] Insufficient materials for Robust Barrel detected...', 'color: #e82a2a;');
                    }
                }
                else {
                    console.log('[Epilogue Falls] Bypassed opening build barrel menu...');
                }
            }

            // Farm Route Strategy
            const checkZone = document.querySelector('.headsUpDisplayEpilogueFallsView__zoneTitle');
            const currentZone = document.querySelector('.headsUpDisplayEpilogueFallsView__zoneTitle').textContent;
            const checkBarrelHealth = document.querySelector('.headsUpDisplayEpilogueFallsView__barrelHealth');

             
            
            switch (storedStrategy){
                case 'morsel':
                    {
                        console.log('%c[Epilogue Falls] Running Morsel farm run...', 'color: #ffa02b;');
                        if (currentZone === 'Epilogue Falls'){
                            break;
                        }
                        else {
                            console.log(`[Epilogue Falls] Currently in ${currentZone}...`)
                            while (true){
                                const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                                // Target Abundant Morsel = 40m, each boost = 20m
                                let requiredBoostToTarget = Math.ceil(Number((40 - currentDistance) / 20));
                                if (requiredBoostToTarget <= 2 && requiredBoostToTarget > 0){
                                    await boostBarrel(requiredBoostToTarget);
                                    break;
                                }
                                else {
                                    break;
                                }
                            }
                            const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                            // Target Abundant Morsel = 40m - 50m
                            console.log('[Epilogue Falls] Attempting to stay in Abundant Morsel for remaining hunts...');
                            if (currentDistance < 45){ // Current buffer for 0 FTCs = 40 + (0*5) = 40
                                const checkManchegoArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="metaphor_manchego_cheese"]');
                                if (!checkManchegoArmed){
                                    manchegoCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 45 && currentDistance < 50){ // Catch buffer for 0 Catch = 50 - (0*5) = 50
                                const checkSBArmed = document.querySelector('.folkloreForestRegionView-bait-image.active[data-item-type="super_brie_cheese"]');
                                if (!checkSBArmed){
                                    sbArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 50){
                                const checkBrieArmed = document.querySelector('.folkloreForestRegionView-bait-image.active[data-item-type="brie_cheese"]');
                                if (!checkBrieArmed){
                                    brieArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (!currentDistance){
                                console.log('[Epilogue Falls] No barrel runs detected, bypassing...');
                                break;
                            }
                        }
                        break;
                    }
                case 'algae':
                    {
                        console.log('%c[Epilogue Falls] Running Algae farm run...', 'color: #ffa02b;');
                        if (currentZone === 'Epilogue Falls'){
                            break;
                        }
                        else {
                            console.log(`[Epilogue Falls] Currently in ${currentZone}...`)
                            while (true){
                                const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                                // Target Abundant Algae = 165m, each boost = 20m
                                let requiredBoostToTarget = Math.ceil(Number((165 - currentDistance) / 20));
                                if (requiredBoostToTarget <= 6 && requiredBoostToTarget > 0){
                                    await boostBarrel(requiredBoostToTarget);
                                    break;
                                }
                                else {
                                    break;
                                }
                            }
                            const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                            // Target Abundant Algae = 165m - 200m
                            if (currentDistance < 49){ // Current buffer for 1 FTCs = 165 + (1*8) = 173
                                console.log('[Epilogue Falls] Arming Sirene Cheese...');
                                const checkSireneArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="symbolic_sirene_cheese"]');
                                if (!checkSireneArmed){
                                    sireneCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            if (currentDistance >= 49 && currentDistance < 173){ // Current buffer for 1 FTCs = 165 + (1*8) = 173
                                console.log('[Epilogue Falls] Arming Anari Cheese...');
                                const checkAnariArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="allegory_anari_cheese"]');
                                if (!checkAnariArmed){
                                    anariCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 173 && currentDistance < 196){ // Catch buffer for 1 Catch = 200 - (1*4) = 196
                                console.log('[Epilogue Falls] Arming Manchego Cheese...');
                                const checkManchegoArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="metaphor_manchego_cheese"]');
                                if (!checkManchegoArmed){
                                    manchegoCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 196){ 
                                console.log('[Epilogue Falls] Arming SuperBrie+ Cheese...');
                                const checkSBArmed = document.querySelector('.folkloreForestRegionView-bait-image.active[data-item-type="super_brie_cheese"]');
                                if (!checkSBArmed){
                                    sbArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (!currentDistance){
                                console.log('[Epilogue Falls] No barrel runs detected, bypassing...');
                                break;
                            }
                        }
                        break;
                    }
                case 'halophyte':
                    {
                        console.log('%c[Epilogue Falls] Running Halophyte farm run...', 'color: #ffa02b;');
                        if (currentZone === 'Epilogue Falls'){
                            break;
                        }
                        else {
                            console.log(`[Epilogue Falls] Currently in ${currentZone}...`)
                            while (true){
                                const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                                // Target Abundant Halophyte = 90m, each boost = 20m
                                let requiredBoostToTarget = Math.ceil(Number((90 - currentDistance) / 20));
                                if (requiredBoostToTarget <= 5 && requiredBoostToTarget > 0){
                                    await boostBarrel(requiredBoostToTarget);
                                    break;
                                }
                                else {
                                    break;
                                }
                            }
                            const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                            // Target Abundant Halophyte = 90m - 120m
                            console.log('[Epilogue Falls] Attempting to stay in Abundant Halophyte for remaining hunts...');
                            if (currentDistance < 96){ // Current buffer for 1 FTCs = 90 + (1*6) = 96
                                const checkManchegoArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="metaphor_manchego_cheese"]');
                                if (!checkManchegoArmed){
                                    manchegoCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 96 && currentDistance < 116){ // Catch buffer for 1 Catch = 200 - (1*4) = 196
                                const checkManchegoArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="metaphor_manchego_cheese"]');
                                if (!checkManchegoArmed){
                                    manchegoCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 116){
                                const checkSBArmed = document.querySelector('.folkloreForestRegionView-bait-image.active[data-item-type="super_brie_cheese"]');
                                if (!checkSBArmed){
                                    sbArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (!currentDistance){
                                console.log('[Epilogue Falls] No barrel runs detected, bypassing...');
                                break;
                            }
                        }
                        break;
                    }
                case 'seashell/coral':
                    {
                        console.log('%c[Epilogue Falls] Running Seashell farm run...', 'color: #ffa02b;');
                        if (currentZone === 'Epilogue Falls'){
                            break;
                        }
                        else {
                            console.log(`[Epilogue Falls] Currently in ${currentZone}...`)
                            while (true){
                                const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                                // Target Abundant Seashell = 470m, each boost = 20m
                                let requiredBoostToTarget = Math.ceil(Number((470 - currentDistance) / 20));
                                if (requiredBoostToTarget <= 4.5 && requiredBoostToTarget > 0){ // Boost at end of Abundant Coral = (470-380)/20 = 4.5
                                    await boostBarrel(requiredBoostToTarget);
                                    break;
                                }
                                else {
                                    break;
                                }
                            }
                            const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                            const abundantCoral = 340;
                            const sparseSeashell = 380;
                            let stopSirene;
                            // Check Conceptual Coral to decide if Abundant Coral
                            if (conceptualCoralNum < conceptualCoralTrigger){
                                stopSirene = abundantCoral;
                            }
                            else {
                                stopSirene = sparseSeashell;
                            }
                            // Target Abundant Coral = 340m - 380m; Abundant Seashell = 470m - 520m
                            if (currentDistance < stopSirene){ // Before boosting
                                console.log(`[Epilogue Falls] Attempting to reach ${stopSirene}...`);
                                const checkSireneArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="symbolic_sirene_cheese"]');
                                if (!checkSireneArmed){
                                    sireneCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (stopSirene === 340 && currentDistance >= 340 && currentDistance < 380){ // Abundant Coral discretionary stop
                                console.log('[Epilogue Falls] Attempting to reach farm Corals...');
                                const checkAnariArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="allegory_anari_cheese"]');
                                if (!checkAnariArmed){
                                    anariCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 380 && currentDistance < 519){ // Current buffer for 1 FTCs = 470 + (1*21) = 491
                                console.log('[Epilogue Falls] Attempting to stay in Abundant Seashell for remaining hunts...');
                                const checkAnariArmed = document.querySelector('.headsUpDisplayEpilogueFallsView__baitImage.active[data-item-type="allegory_anari_cheese"]');
                                if (!checkAnariArmed){
                                    anariCheeseArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (currentDistance >= 519){
                                console.log('[Epilogue Falls] Attempting to stay in Abundant Seashell for remaining hunts...');
                                const checkSBArmed = document.querySelector('.folkloreForestRegionView-bait-image.active[data-item-type="super_brie_cheese"]');
                                if (!checkSBArmed){
                                    sbArmButton.click();
                                    await waitFor(3000);
                                }
                            }
                            else if (!currentDistance){
                                console.log('[Epilogue Falls] No barrel runs detected, bypassing...');
                                break;
                            }
                        }
                        break;
                    }
                case 'pearl':
                    {
                        console.log('%c[Epilogue Falls] Running Pearl farm run...', 'color: #ffa02b;');
                        if (currentZone === 'Epilogue Falls'){
                            break;
                        }
                        else {
                            console.log(`[Epilogue Falls] Currently in ${currentZone}...`)
                            while (true){
                                const currentDistance = Number(document.querySelector('.headsUpDisplayEpilogueFallsView__barrelPosition .headsUpDisplayEpilogueFallsView__position').textContent.trim().replace(/,/g, ''));
                                const boostTable = [
                                    { boost: 1, cost: 3, cumulative: 3 },
                                    { boost: 2, cost: 4, cumulative: 7 },
                                    { boost: 3, cost: 11, cumulative: 18 },
                                    { boost: 4, cost: 30, cumulative: 48 },
                                    { boost: 5, cost: 67, cumulative: 115 },
                                    { boost: 6, cost: 128, cumulative: 243 },
                                    { boost: 7, cost: 219, cumulative: 462 },
                                    { boost: 8, cost: 346, cumulative: 808 },
                                    { boost: 9, cost: 515, cumulative: 1323 },
                                    { boost: 10, cost: 732, cumulative: 2055 },
                                    { boost: 11, cost: 1003, cumulative: 3058 },
                                    { boost: 12, cost: 1334, cumulative: 4392 },
                                    { boost: 13, cost: 1731, cumulative: 6123 },
                                    { boost: 14, cost: 2200, cumulative: 8323 },
                                    { boost: 15, cost: 2747, cumulative: 11070 },
                                    { boost: 16, cost: 3378, cumulative: 14448 },
                                    { boost: 17, cost: 4099, cumulative: 18547 },
                                    { boost: 18, cost: 4916, cumulative: 23463 },
                                    { boost: 19, cost: 5835, cumulative: 29298 },
                                    { boost: 20, cost: 6862, cumulative: 36060 },
                                    { boost: 21, cost: 8003, cumulative: 44613 },
                                    { boost: 22, cost: 9264, cumulative: 53427 },
                                    { boost: 23, cost: 10651, cumulative: 64078 },
                                    { boost: 24, cost: 12170, cumulative: 76748 },
                                    { boost: 25, cost: 13827, cumulative: 90075 },
                                    { boost: 26, cost: 15628, cumulative: 105703 },
                                    { boost: 27, cost: 17579, cumulative: 123282 },
                                    { boost: 28, cost: 19686, cumulative: 142968 },
                                    { boost: 29, cost: 21955, cumulative: 164323 },
                                    { boost: 30, cost: 24392, cumulative: 189315 },
                                    { boost: 31, cost: 27003, cumulative: 216318 },
                                    { boost: 32, cost: 29794, cumulative: 246112 },
                                    { boost: 33, cost: 32771, cumulative: 278783 },
                                    { boost: 34, cost: 35940, cumulative: 314823 },
                                    { boost: 35, cost: 39807, cumulative: 354130 },
                                    { boost: 36, cost: 42878, cumulative: 397008 },
                                    { boost: 37, cost: 46659, cumulative: 443667 },
                                    { boost: 38, cost: 50656, cumulative: 494326 },
                                    { boost: 39, cost: 54875, cumulative: 549198 },
                                    { boost: 40, cost: 59322, cumulative: 608520 },
                                    { boost: 41, cost: 64603, cumulative: 672523 },
                                    { boost: 42, cost: 68924, cumulative: 741447 },
                                    { boost: 43, cost: 74091, cumulative: 815538 },
                                    { boost: 44, cost: 79510, cumulative: 895048 },
                                    { boost: 45, cost: 85187, cumulative: 980235 },
                                    { boost: 46, cost: 91128, cumulative: 1071328 },
                                    { boost: 47, cost: 97339, cumulative: 1168702 },
                                    { boost: 48, cost: 103826, cumulative: 1272528 },
                                    { boost: 49, cost: 110595, cumulative: 1383123 },
                                    { boost: 50, cost: 117652, cumulative: 1500775 }
                                ];

                                // Target Within the Waterfall = 990m, each boost = 20m
                                let maxAchievableBoost = 0;
                                for (let i = 0; i < boostTable.length; i++){
                                    if (boostTable[i].cumulative <= poeticPlankNum){
                                        maxAchievableBoost = boostTable[i].boost; // Update highest boost num until cumulative exceeds then break loop
                                    }
                                    else {
                                        break;
                                    }
                                }

                                let requiredBoostToTarget = Math.ceil(Number((990 - currentDistance) / 20));
                                if (requiredBoostToTarget <= maxAchievableBoost && requiredBoostToTarget > 0){ // Boost at end of Abundant Coral = (470-380)/20 = 4.5
                                    await boostBarrel(requiredBoostToTarget);
                                    break;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        break;
                    }
            }

        }


    }, 30*1000);

    // Utility function to wait for a specified time
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();