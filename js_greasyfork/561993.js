// ==UserScript==
// @name         Sello leveranstid presets
// @namespace    https://greasyfork.org/en/users/1513603-hobbypryl
// @version      1.1
// @description  Lägger till leveranstid presets i sello ändra produkt rutan
// @author       HobbyPryl
// @match        https://ui.sello.io/inventory/list?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561993/Sello%20leveranstid%20presets.user.js
// @updateURL https://update.greasyfork.org/scripts/561993/Sello%20leveranstid%20presets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const allKnownCountries = ['Denmark', 'Finland', 'Norway', 'Sweden', 'United Kingdom'];

    const myPresets = {
        "Rensa alla lev. tider": [], 
        "Över 400g/300kr": [
            { id: 'Standard', name: 'Standard', from: 0, to: 0 },
            { id: 'DK', name: 'Denmark', from: 2, to: 5 },
            { id: 'FI', name: 'Finland', from: 2, to: 6 },
            { id: 'NO', name: 'Norway', from: 2, to: 6 }
        ],
        "DROP - ISO, VERK, Ikonka": [
            { id: 'Standard', name: 'Standard', from: 6, to: 10 },
            { id: 'SE', name: 'Sweden', from: 2, to: 6 }
        ],
        "DROP - Javoli, Interbosch": [
            { id: 'Standard', name: 'Standard', from: 6, to: 10 },
            { id: 'SE', name: 'Sweden', from: 4, to: 8 }
        ],
        "INQ 1 - SE 1-5 | Std. 6-10": [
            { id: 'Standard', name: 'Standard', from: 6, to: 10 },
            { id: 'SE', name: 'Sweden', from: 1, to: 5 }
        ],
        "INQ 2 - Standard 6-10": [
            { id: 'Standard', name: 'Standard', from: 6, to: 10 }
        ],
        "INQ 3 - SE 6-10 | Std. 10-14": [
            { id: 'Standard', name: 'Standard', from: 10, to: 14 },
            { id: 'SE', name: 'Sweden', from: 6, to: 10 }
        ],
        "INQ 4 - SE 4-8 | Std. 6-10": [
            { id: 'Standard', name: 'Standard', from: 6, to: 10 },
            { id: 'SE', name: 'Sweden', from: 4, to: 8 }
        ]
    };

    async function applyFullPreset(presetData) {
        let activeX;
        while ((activeX = Array.from(document.querySelectorAll('span[style*="cursor: pointer"]')).find(s => s.innerText === '×'))) {
            activeX.click();
            await new Promise(r => setTimeout(r, 5)); 
        }

        await addAllAvailableCountries();

        const tasks = [];
        const standardItem = presetData.find(i => i.name === 'Standard');
        tasks.push({ name: 'Standard', from: standardItem ? standardItem.from : 0, to: standardItem ? standardItem.to : 0 });

        for (const countryName of allKnownCountries) {
            const presetItem = presetData.find(i => i.name === countryName);
            if (presetItem) {
                tasks.push({ name: countryName, from: presetItem.from, to: presetItem.to });
            } else if (getInputsByRowName(countryName)) {
                tasks.push({ name: countryName, from: 0, to: 0 });
            }
        }

        await Promise.all(tasks.map(task => aggressiveFill(task.name, task.from, task.to)));
        await new Promise(r => setTimeout(r, 50)); 
        await removeZeroRows();
    }

    async function addAllAvailableCountries() {
        const select = document.querySelector('select.form-control');
        const getAddButton = () => {
             const spans = document.querySelectorAll('.mdc-button__label');
             let btn = null;
             spans.forEach(s => { if (s.innerText.includes('Lägg till')) btn = s.closest('button'); });
             return btn;
        };

        for (let i = 0; i < 10; i++) {
            if (!select || select.options.length === 0) break;
            const addButton = getAddButton();
            if (!addButton) break;
            select.selectedIndex = 0;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            addButton.click();
            await new Promise(r => setTimeout(r, 30));
        }
    }

    async function aggressiveFill(countryName, from, to) {
        const inputs = getInputsByRowName(countryName);
        if (inputs) {
            const [inputFrom, inputTo] = inputs;
            inputFrom.value = from;
            inputTo.value = to;
            [inputFrom, inputTo].forEach(el => {
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
                el.dispatchEvent(new Event('blur', { bubbles: true }));
            });
        }
    }

    async function removeZeroRows() {
        const labels = document.querySelectorAll('div[style*="width: 100px"]');
        for (const label of labels) {
            const name = label.innerText.trim();
            if (name === 'Standard') continue;
            const row = label.parentElement;
            const inputs = row.querySelectorAll('input[type="number"]');
            if (inputs.length >= 2) {
                const val1 = parseInt(inputs[0].value, 10);
                const val2 = parseInt(inputs[1].value, 10);
                if ((isNaN(val1) || val1 === 0) && (isNaN(val2) || val2 === 0)) {
                    const xBtn = Array.from(row.querySelectorAll('span')).find(s => s.innerText === '×');
                    if (xBtn) {
                        xBtn.click();
                        await new Promise(r => setTimeout(r, 5));
                    }
                }
            }
        }
    }

    function getInputsByRowName(name) {
        const allLabels = document.querySelectorAll('div[style*="width: 100px"]');
        for (const label of allLabels) {
            if (label.innerText.trim() === name) {
                const row = label.parentElement;
                const inputGroup = row.querySelector('.input-group');
                if (inputGroup) {
                    const inputs = inputGroup.querySelectorAll('input[type="number"]');
                    if (inputs.length >= 2) return [inputs[0], inputs[1]];
                }
            }
        }
        return null;
    }

    function injectButtons() {
        const labels = document.querySelectorAll('label');
        const deliveryLabel = Array.from(labels).find(l => l.innerText.includes('Leveranstid:'));
        if (!deliveryLabel) return false;
        const parentDiv = deliveryLabel.parentElement;
        if (parentDiv.querySelector('.custom-preset-container')) return true;

        const btnRow = document.createElement('div');
        btnRow.className = 'custom-preset-container';
        btnRow.style = "margin-top: 10px; margin-left: 25%; padding-left: 15px; display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 15px;";

        Object.keys(myPresets).forEach((label, index) => {
            const btn = document.createElement('button');
            btn.innerText = label;
            btn.type = "button";
            
            let bgColor = (index === 0) ? "#ffeb3b" : "#e6f0ff";
            let borderColor = (index === 0) ? "#fbc02d" : "#b3d7ff";

            btn.style = `
                padding: 6px 10px; 
                cursor: pointer; 
                background: ${bgColor}; 
                color: #0056b3; 
                border: 1px solid ${borderColor}; 
                border-radius: 4px; 
                font-size: 11px; 
                font-weight: bold; 
                flex-grow: 1; 
                text-align: center; 
                transition: all 0.1s ease;
                position: relative;
                top: 0;
                box-shadow: 0 2px 0 rgba(0,0,0,0.1);
            `;
            
            btn.onmousedown = () => {
                btn.style.top = "1px";
                btn.style.boxShadow = "none";
                btn.style.filter = "brightness(1.1)";
            };
            
            btn.onmouseup = () => {
                btn.style.top = "0";
                btn.style.boxShadow = "0 2px 0 rgba(0,0,0,0.1)";
                btn.style.filter = "brightness(1.0)";
            };

            btn.onclick = (e) => { 
                e.preventDefault(); 
                applyFullPreset(myPresets[label]); 
            };

            btnRow.appendChild(btn);
        });
        parentDiv.appendChild(btnRow);
        return true;
    }

    // Lyssna efter klick på Ändra-knappen i listan samt flikbyten i modulen
    document.addEventListener('click', (event) => {
        const target = event.target;
        
        // 1. Om man klickar på "Ändra" knappen i inventory-listan
        const editBtn = target.closest('app-product-edit-button button');
        if (editBtn && editBtn.innerText.includes('Ändra')) {
            startInjectedLoop();
        }

        // 2. Om man klickar på en flik inuti modulen
        const tabItem = target.closest('.sello-tabs li');
        if (tabItem) {
            // Vi kör en loop som kollar efter "Leveranstid" etiketten
            // eftersom Angular behöver ett ögonblick på sig att byta flik.
            startInjectedLoop();
        }
    }, true);

    function startInjectedLoop() {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            const success = injectButtons();
            attempts++;
            // Om vi lyckas injicera eller om vi försökt för länge (7.5 sekunder) stänger vi loopen
            if (success || attempts > 25) clearInterval(checkInterval);
        }, 300);
    }

})();