// ==UserScript==
// @name         Torn Rental Helper
// @namespace    http://tampermonkey.net/
// @version      6.45
// @description  Adds a powerful, multi-filter UI and a Key Mods scanner to the rental market.
// @author       Drago
// @match        https://www.torn.com/properties.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/551714/Torn%20Rental%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551714/Torn%20Rental%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uiContainerClassName = 'rental-filter-container';

    let filters = {
        maxCost: 'none',
        minHappiness: 3500,
        minPeriod: 7
    };

    function scanAndDisplayMods(item) {
        if (item.classList.contains('mods-scanned')) return;
        item.classList.add('mods-scanned');

        const infoBlock = item.querySelector('.confirm-info');
        const rentalPeriodDiv = item.querySelector('.rental-period');
        if (!infoBlock || !rentalPeriodDiv) return;

        // beep
        if (!rentalPeriodDiv.dataset.originalText) {
            rentalPeriodDiv.dataset.originalText = rentalPeriodDiv.textContent;
        }

        const modifications = infoBlock.querySelectorAll('.modifications .modification');
        let modsFound = [];

        modifications.forEach(mod => {
            const title = mod.title.toLowerCase();
            if (title.includes('airstrip')) modsFound.push('AS');
            if (title.includes('vault')) modsFound.push('Vault');
        });

     
        const uniqueMods = [...new Set(modsFound)];

        if (uniqueMods.length > 0) {
            const originalText = rentalPeriodDiv.dataset.originalText;
            const periodNumber = originalText.match(/\d+/)[0]; 
            const modsText = `(${uniqueMods.join(', ')}) `;
            rentalPeriodDiv.textContent = modsText + periodNumber;
        }
    }

    async function processRentalList() {
        const rentalList = document.querySelector('ul.users-list.rental');
        if (!rentalList) return;

        const isFiltered = rentalList.querySelector(`.${uiContainerClassName}`);
        const rentalListItems = rentalList.querySelectorAll(':scope > li');

        if (!isFiltered) {
            filters.maxCost = await GM_getValue('maxCost', 'none');
            filters.minHappiness = await GM_getValue('minHappiness', 3500);
            filters.minPeriod = await GM_getValue('minPeriod', 7);

            let visibleCount = 0;
            let hiddenCount = 0;

            rentalListItems.forEach(item => {
                const costEl = item.querySelector('.cost-per-day');
                const happinessEl = item.querySelector('.happiness');
                const periodEl = item.querySelector('.rental-period');

                if (!costEl || !happinessEl || !periodEl) return;

                const cost = parseInt(costEl.textContent.trim().replace(/\$|,/g, ''));
                const happiness = parseInt(happinessEl.textContent.trim().replace('Happiness:', '').trim());
                const period = parseInt(periodEl.textContent.trim().match(/\d+/)[0]); // Extract number from potentially modified text

                const costPass = filters.maxCost === 'none' || cost <= filters.maxCost;
                const happinessPass = happiness >= filters.minHappiness;
                const periodPass = period >= filters.minPeriod;

                if (costPass && happinessPass && periodPass) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                    hiddenCount++;
                }
            });

            const container = createFilterUI(visibleCount, hiddenCount);
            rentalList.prepend(container);
        }

        rentalListItems.forEach(item => {
            if (item.style.display !== 'none') {
                scanAndDisplayMods(item);
            }
        });
    }

    function createFilterUI(visibleCount, hiddenCount) {
        const container = document.createElement('div');
        container.className = uiContainerClassName;
        container.style.cssText = `
            padding: 10px; color: #fff; font-size: 13px; background-color: #666;
            border: 1px solid #888; border-radius: 5px; margin: 10px 0;
            display: flex; flex-direction: column; gap: 10px;
        `;

        const textPart = document.createElement('div');
        textPart.style.cssText = `
            display: flex; justify-content: space-between; align-items: center;
            font-size: 1.1em; border-bottom: 1px solid #888;
            padding-bottom: 8px; margin-bottom: 2px;
        `;

        const statusText = document.createElement('span');
        statusText.innerHTML = `Showing <b>${visibleCount}</b> rental(s). <span style="color: #ccc;">Hiding ${hiddenCount}.</span>`;

        const authorText = document.createElement('span');
        authorText.textContent = 'by Drago';
        authorText.style.cssText = 'font-style: italic; color: #bbb; font-size: 0.85em;';

        textPart.appendChild(statusText);
        textPart.appendChild(authorText);

        const controlsRow = document.createElement('div');
        controlsRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;';

        const createControl = (labelText, controlElement) => {
            const group = document.createElement('div');
            group.style.cssText = 'display: flex; align-items: center; gap: 6px;';
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.cssText = 'font-size: 1em; color: #eee;';
            group.appendChild(label);
            group.appendChild(controlElement);
            return group;
        };

        const costSelect = createCostDropdown();
        const happinessInput = createHappinessInput();
        const periodSelect = createPeriodDropdown();
        const applyButton = document.createElement('button');

        styleButton(applyButton);
        applyButton.textContent = "Apply Filters";
        applyButton.addEventListener('click', async () => {
            await GM_setValue('maxCost', costSelect.value === 'none' ? 'none' : parseInt(costSelect.value));
            await GM_setValue('minHappiness', parseInt(happinessInput.value) || 0);
            await GM_setValue('minPeriod', parseInt(periodSelect.value));
            container.remove();
        });

        const filterControls = document.createElement('div');
        filterControls.style.cssText = 'display: flex; align-items: center; gap: 15px; flex-grow: 1; flex-wrap: wrap;';
        filterControls.appendChild(createControl('Cost over:', costSelect));
        filterControls.appendChild(createControl('Min. Happiness:', happinessInput));
        filterControls.appendChild(createControl('Min. Rental Period:', periodSelect));

        controlsRow.appendChild(filterControls);
        controlsRow.appendChild(applyButton);

        container.appendChild(textPart);
        container.appendChild(controlsRow);
        return container;
    }

    function createCostDropdown() {
        const select = document.createElement('select');
        styleControl(select);
        const options = ['none', 300000, 400000, 500000, 600000, 700000, 750000, 800000];
        options.forEach(price => {
            const option = document.createElement('option');
            option.value = price;
            option.textContent = (price === 'none') ? 'None (Disabled)' : `$${price.toLocaleString()}`;
            if (String(price) === String(filters.maxCost)) option.selected = true;
            select.appendChild(option);
        });
        return select;
    }

    function createHappinessInput() {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = filters.minHappiness;
        styleControl(input);
        input.style.width = '60px';
        return input;
    }

    function createPeriodDropdown() {
        const select = document.createElement('select');
        styleControl(select);
        const options = [1,7, 14, 30, 90];
        options.forEach(days => {
            const option = document.createElement('option');
            option.value = days;
            option.textContent = `${days} days`;
            if (days === filters.minPeriod) option.selected = true;
            select.appendChild(option);
        });
        return select;
    }

    function styleControl(el) {
        el.style.cssText = `
            padding: 4px 6px; border: 1px solid #888; border-radius: 3px;
            background-color: #555; color: #fff;
        `;
    }

    function styleButton(el) {
        el.style.cssText = `
            padding: 6px 12px; color: #fff; font-weight: bold;
            background: linear-gradient(to bottom, #888 0%, #777 100%);
            border: 1px solid #aaa; border-radius: 5px; cursor: pointer;
        `;
        el.onmouseover = () => el.style.background = 'linear-gradient(to bottom, #777 0%, #666 100%)';
        el.onmouseout = () => el.style.background = 'linear-gradient(to bottom, #888 0%, #777 100%)';
    }

    setInterval(processRentalList, 250);

})();