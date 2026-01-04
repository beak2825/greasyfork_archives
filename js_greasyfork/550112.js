// ==UserScript==
// @name          [Pokeclicker] Farm Plot Editor
// @namespace     Pokeclicker Scripts
// @author        samfp
// @description   Adds edit mode button to farm modal for directly setting berries at Berry stage
// @license       GPL-3.0 License
// @version       1.0.2

// @homepageURL   https://github.com/Ephenia/Pokeclicker-Scripts/
// @supportURL    https://github.com/Ephenia/Pokeclicker-Scripts/issues

// @match         https://www.pokeclicker.com/
// @icon          https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant         unsafeWindow
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/550112/%5BPokeclicker%5D%20Farm%20Plot%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/550112/%5BPokeclicker%5D%20Farm%20Plot%20Editor.meta.js
// ==/UserScript==

function initFarmPlotEditor() {
    let editMode = false;

    function createEditButton() {
        const shovelList = document.getElementById('shovelList');
        if (!shovelList) return;

        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'row justify-content-center py-1';

        const button = document.createElement('button');
        button.id = 'farm-edit-mode-toggle';
        button.className = 'btn btn-block btn-danger';
        button.textContent = 'Edit Mode [OFF]';
        button.onclick = toggleEditMode;

        buttonDiv.appendChild(button);
        shovelList.before(buttonDiv);
    }

    function toggleEditMode() {
        editMode = !editMode;
        console.log('Farm Edit Mode:', editMode ? 'ON' : 'OFF');
        const button = document.getElementById('farm-edit-mode-toggle');
        button.className = `btn btn-block btn-${editMode ? 'success' : 'danger'}`;
        button.textContent = `Edit Mode [${editMode ? 'ON' : 'OFF'}]`;
    }

    function setPlotBerryAtBerryStage(plotIndex, berryType) {
        console.log(`Setting plot ${plotIndex} to berry ${berryType} (${BerryType[berryType]})`);

        if (plotIndex >= App.game.farming.plotList.length) {
            console.log(`Invalid plot index ${plotIndex}, max is ${App.game.farming.plotList.length - 1}`);
            return;
        }

        const plot = App.game.farming.plotList[plotIndex];

        // Step 1: If there is a berry, advance it to berry stage
        if (plot.berry !== -1) {
            const existingBerry = plot.berry;
            console.log(`Found existing berry: ${existingBerry} (${BerryType[existingBerry]})`);
            const existingBerryData = App.game.farming.berryData[existingBerry];
            const existingTargetAge = existingBerryData.growthTime[3];
            console.log(`Existing berry data:`, existingBerryData.growthTime);
            plot.age = existingTargetAge;
            console.log(`Step 1: Advanced existing berry ${BerryType[existingBerry]} to harvest stage (age: ${existingTargetAge})`);

            setTimeout(() => {
                // Step 2: Harvest plot
                App.game.farming.harvest(plotIndex);
                console.log(`Step 2: Harvested plot ${plotIndex}`);

                setTimeout(() => {
                    // Step 3: Plant selected berry
                    App.game.farming.plant(plotIndex, berryType);
                    console.log(`Step 3: Planted ${BerryType[berryType]} at plot ${plotIndex}`);

                    setTimeout(() => {
                        // Step 4: Advance new berry to berry stage
                        const newBerryData = App.game.farming.berryData[berryType];
                        const newTargetAge = newBerryData.growthTime[3];
                        console.log(`New berry data:`, newBerryData.growthTime);
                        plot.age = newTargetAge;
                        console.log(`Step 4: Advanced new berry to Berry stage (age: ${newTargetAge})`);
                    }, 100);
                }, 100);
            }, 100);
        } else {
            // Step 3: Plant selected berry
            App.game.farming.plant(plotIndex, berryType);
            console.log(`Step 3: Planted ${BerryType[berryType]} at plot ${plotIndex}`);

            setTimeout(() => {
                // Step 4: Advance new berry to berry stage
                const newBerryData = App.game.farming.berryData[berryType];
                const newTargetAge = newBerryData.growthTime[3];
                console.log(`New berry data:`, newBerryData.growthTime);
                plot.age = newTargetAge;
                console.log(`Step 4: Advanced new berry to Berry stage (age: ${newTargetAge})`);
            }, 100);
        }
    }

    function addPlotClickListeners() {
        console.log('Starting to look for farm container...');
        const checkForPlots = setInterval(() => {
            const farmContainer = document.querySelector('#farmContainer');
            console.log('Checking for farmContainer:', farmContainer ? 'found' : 'not found');

            // Also try alternative selectors
            const farmView = document.querySelector('#farmView');
            const plotElements = document.querySelectorAll('[data-bind*="plotList"]');
            console.log('farmView:', farmView ? 'found' : 'not found');
            console.log('plot elements found:', plotElements.length);

            if (farmContainer || farmView || plotElements.length > 0) {
                clearInterval(checkForPlots);
                console.log('Farm elements found, adding click listeners');

                const targetElement = farmContainer || farmView || document.body;
                console.log('Adding listener to:', targetElement.id || targetElement.tagName);

                targetElement.addEventListener('click', (e) => {
                    console.log('Click detected, edit mode:', editMode);
                    if (!editMode) return;

                    let target = e.target;
                    console.log('Initial target:', target.tagName, target.className);

                    // Check if we're clicking on a farm plot
                    let isPlotClick = false;
                    for (let i = 0; i < 10 && target; i++) {
                        if (target.hasAttribute('data-bind')) {
                            const dataBind = target.getAttribute('data-bind');
                            if (dataBind.includes('$index()')) {
                                isPlotClick = true;
                                break;
                            }
                        }
                        target = target.parentElement;
                    }

                    if (!isPlotClick) {
                        console.log('Not a plot click, allowing normal behavior');
                        return;
                    }

                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Plot click intercepted');

                    target = e.target;
                    console.log('Initial target:', target.tagName, target.className);

                    // Check multiple levels up
                    for (let i = 0; i < 10 && target; i++) {
                        console.log(`Level ${i}:`, target.tagName, target.getAttribute('data-bind'));
                        if (target.hasAttribute('data-bind')) {
                            const dataBind = target.getAttribute('data-bind');
                            console.log('Found data-bind:', dataBind);

                            // Look for $index() which indicates we're in the foreach loop
                            if (dataBind.includes('$index()')) {
                                // Find the foreach element to get the plot index
                                let foreachElement = target;
                                while (foreachElement && !foreachElement.getAttribute('data-bind')?.includes('foreach: App.game.farming.plotList')) {
                                    foreachElement = foreachElement.parentElement;
                                }

                                if (foreachElement) {
                                    // Get all plot elements and find which one this is
                                    const allPlots = Array.from(foreachElement.children);
                                    console.log(`Total children in foreach: ${allPlots.length}`);
                                    console.log(`Total plots in game: ${App.game.farming.plotList.length}`);

                                    let plotIndex = -1;

                                    // Find the plot container that contains our clicked element
                                    let plotContainer = target;
                                    while (plotContainer && plotContainer.parentElement !== foreachElement) {
                                        plotContainer = plotContainer.parentElement;
                                    }

                                    if (plotContainer) {
                                        plotIndex = allPlots.indexOf(plotContainer);
                                        console.log(`Found plot container at DOM index ${plotIndex}`);

                                        // The DOM might include non-plot elements, so let's count only actual plots
                                        let actualPlotIndex = 0;
                                        for (let j = 0; j < plotIndex; j++) {
                                            if (allPlots[j].querySelector('[data-bind*="$index()"]')) {
                                                actualPlotIndex++;
                                            }
                                        }
                                        plotIndex = actualPlotIndex;
                                        console.log(`Corrected to actual plot index ${plotIndex}`);
                                    }

                                    if (plotIndex >= 0) {
                                        const selectedBerry = FarmController.selectedBerry();
                                        console.log(`Plot ${plotIndex} clicked, selected berry: ${selectedBerry}`);
                                        if (selectedBerry !== undefined) {
                                            setPlotBerryAtBerryStage(plotIndex, selectedBerry);
                                        }
                                        return;
                                    }
                                }
                            }
                        }
                        target = target.parentElement;
                    }
                    console.log('No plot found in click hierarchy');
                }, true);
            }
        }, 1000);
    }

    // Initialize when the game is loaded
    const initInterval = setInterval(() => {
        if (typeof App !== 'undefined' && App.game && App.game.farming && typeof FarmController !== 'undefined') {
            clearInterval(initInterval);
            createEditButton();
            addPlotClickListeners();
        }
    }, 1000);
}

// Auto-start the script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFarmPlotEditor);
} else {
    initFarmPlotEditor();
}
