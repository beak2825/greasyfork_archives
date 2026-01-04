// ==UserScript==
// @name         Torn PDA Inventory - Complete Mobile Version
// @namespace    https://www.torn.com/
// @version      2.3
// @description  Fully mobile-optimized Torn PDA inventory script: auto-fill all items, editable prices & trends, color-coded values, bulk edit panel, persistent storage.
// @author       BugzMarino
// @match        https://www.torn.com/pda.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549546/Torn%20PDA%20Inventory%20-%20Complete%20Mobile%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/549546/Torn%20PDA%20Inventory%20-%20Complete%20Mobile%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---- FULL ITEM LIST ----
    const defaultInventoryData = {
        "Hammer": { category: "Melee", price: 36, trend: '—' },
        "Baseball Bat": { category: "Melee", price: 133, trend: '—' },
        "Crowbar": { category: "Melee", price: 143, trend: '—' },
        "Knuckle Dusters": { category: "Melee", price: 389, trend: '—' },
        "Pen Knife": { category: "Melee", price: 500, trend: '—' },
        "Glock 17": { category: "Pistol", price: 400, trend: '—' },
        "USP": { category: "Pistol", price: 2750, trend: '—' },
        "Magnum": { category: "Pistol", price: 23000, trend: '—' },
        "Desert Eagle": { category: "Pistol", price: 45000, trend: '—' },
        "AK-47": { category: "Rifle", price: 15000, trend: '—' },
        "M4A1 Colt Carbine": { category: "Rifle", price: 19500, trend: '—' },
        "Sniper Rifle": { category: "Rifle", price: 200000, trend: '—' },
        "Sawed-Off Shotgun": { category: "Shotgun", price: 2400, trend: '—' },
        "MP5 Navy": { category: "SMG", price: 5600, trend: '—' },
        "Molotov": { category: "Explosive", price: 15000, trend: '—' },
        "Grenade": { category: "Explosive", price: 30000, trend: '—' },
        "Armor": { category: "Defensive", price: 50000, trend: '—' },
        "Bulletproof Vest": { category: "Defensive", price: 125000, trend: '—' },
        "Health Kit": { category: "Health", price: 10000, trend: '—' },
        "Cocaine": { category: "Drug", price: 150000, trend: '—' },
        "Ecstasy": { category: "Drug", price: 120000, trend: '—' },
        "LSD": { category: "Drug", price: 250000, trend: '—' },
        "Serotonin": { category: "Drug", price: 1135593, trend: '—' },
        "Rose Set": { category: "Flower", price: 27335, trend: '—' },
        "Tulip Set": { category: "Flower", price: 27335, trend: '—' },
        "Sunflower Set": { category: "Flower", price: 27335, trend: '—' },
        "Sheep Plushie": { category: "Plushie", price: 500, trend: '—' },
        "Teddy Bear Plushie": { category: "Plushie", price: 800, trend: '—' },
        "Kitten Plushie": { category: "Plushie", price: 1000, trend: '—' },
        "White Senet Pawn": { category: "Artifact", price: 5950000, trend: '—' },
        "Black Senet Pawn": { category: "Artifact", price: 5500000, trend: '—' },
        "Dumbbells": { category: "Misc", price: 441000000, trend: '—' },
        "Parachute": { category: "Misc", price: 441000000, trend: '—' },
        "Boxing Gloves": { category: "Misc", price: 441000000, trend: '—' },
        "Skateboard": { category: "Misc", price: 434000000, trend: '—' }
    };

    // ---- LOAD INVENTORY DATA ----
    let inventoryData = JSON.parse(localStorage.getItem('tornPdaInventoryData') || '{}');
    for (const [item, info] of Object.entries(defaultInventoryData)) {
        if (!(item in inventoryData)) inventoryData[item] = info;
    }
    localStorage.setItem('tornPdaInventoryData', JSON.stringify(inventoryData));

    // ---- WAIT FOR INVENTORY TO LOAD ----
    function waitForInventory() {
        const container = document.querySelector('[data-item-id]')?.parentElement;
        if(container) initializeInventory(container);
        else setTimeout(waitForInventory, 500);
    }

    // ---- INITIALIZE ----
    function initializeInventory(container){
        addRefreshButton(container);
        addBulkEditButton(container);
        updateInventory(container);
        observeInventory(container);
    }

    // ---- UPDATE INVENTORY ----
    function updateInventory(container){
        const items = container.querySelectorAll('[data-item-id]');
        let totalItems = 0, totalValue = 0;

        items.forEach(item=>{
            let nameEl = item.querySelector('span') || item;
            let itemName = nameEl.textContent.trim();

            let amountMatch = item.textContent.match(/\d+/);
            let amount = amountMatch ? parseInt(amountMatch[0],10) : 1;

            let itemInfo = inventoryData[itemName] || {price:0, trend:'—'};
            totalItems += amount;
            totalValue += itemInfo.price * amount;

            let color = '#00ff00';
            if(itemInfo.price >= 50000) color='#FFA500';
            if(itemInfo.price >= 200000) color='#ff0000';

            let valueTag = item.querySelector('.value-tag');
            if(!valueTag){
                valueTag = document.createElement('div');
                valueTag.className='value-tag';
                valueTag.style.fontSize='14px';
                valueTag.style.fontWeight='bold';
                valueTag.style.marginTop='3px';
                item.appendChild(valueTag);
            }
            valueTag.textContent = `💰 ${itemInfo.price * amount} Torn ${itemInfo.trend}`;
            valueTag.style.color = color;

            if(!nameEl.classList.contains('editable-name')){
                nameEl.classList.add('editable-name');
                nameEl.style.cursor='pointer';
                nameEl.onclick = ()=>{
                    const newPrice = prompt(`Set price for ${itemName}:`, itemInfo.price);
                    if(newPrice!==null){
                        inventoryData[itemName] = { price: parseInt(newPrice,10)||0, trend: itemInfo.trend };
                        localStorage.setItem('tornPdaInventoryData', JSON.stringify(inventoryData));
                        updateInventory(container);
                    }
                };
            }
        });

        let summary = container.querySelector('#inventory-summary');
        if(!summary){
            summary = document.createElement('div');
            summary.id='inventory-summary';
            summary.style.fontSize='18px';
            summary.style.fontWeight='bold';
            summary.style.marginBottom='12px';
            summary.style.textAlign='center';
            container.prepend(summary);
        }
        summary.textContent = `Total Items: ${totalItems} | Total Value: 💰${totalValue} Torn`;
    }

    // ---- REFRESH & BULK BUTTONS ----
    function addRefreshButton(container){
        if(container.querySelector('#refresh-prices-btn')) return;
        const btn = document.createElement('button');
        btn.id='refresh-prices-btn';
        btn.textContent='Refresh Inventory Values';
        btn.style.margin='5px auto';
        btn.style.display='block';
        btn.style.padding='8px 12px';
        btn.style.fontWeight='bold';
        btn.style.fontSize='16px';
        btn.style.cursor='pointer';
        btn.style.borderRadius='6px';
        btn.style.backgroundColor='#007BFF';
        btn.style.color='white';
        btn.onclick = ()=>updateInventory(container);
        container.prepend(btn);
    }

    function addBulkEditButton(container){
        if(container.querySelector('#bulk-edit-btn')) return;
        const btn = document.createElement('button');
        btn.id='bulk-edit-btn';
        btn.textContent='Bulk Edit Prices & Trends';
        btn.style.margin='5px auto';
        btn.style.display='block';
        btn.style.padding='8px 12px';
        btn.style.fontWeight='bold';
        btn.style.fontSize='16px';
        btn.style.cursor='pointer';
        btn.style.borderRadius='6px';
        btn.style.backgroundColor='#28A745';
        btn.style.color='white';
        btn.onclick = ()=>openBulkEditPanel();
        container.prepend(btn);
    }

    // ---- BULK EDIT PANEL ----
    function openBulkEditPanel(){
        let panel = document.querySelector('#bulk-edit-panel');
        if(panel) return;

        panel = document.createElement('div');
        panel.id='bulk-edit-panel';
        panel.style.position='fixed';
        panel.style.top='5%';
        panel.style.left='5%';
        panel.style.width='90%';
        panel.style.height='90%';
        panel.style.overflowY='auto';
        panel.style.backgroundColor='white';
        panel.style.border='2px solid black';
        panel.style.padding='10px';
        panel.style.zIndex='9999';
        panel.style.borderRadius='8px';
        panel.style.boxShadow='0 0 10px rgba(0,0,0,0.5)';

        const title = document.createElement('div');
        title.textContent='📝 Bulk Edit Inventory Prices & Trends';
        title.style.fontWeight='bold';
        title.style.fontSize='18px';
        title.style.marginBottom='10px';
        title.style.textAlign='center';
        panel.appendChild(title);

        Object.keys(inventoryData).forEach(itemName => {
            const row = document.createElement('div');
            row.style.marginBottom='8px';
            row.style.display='flex';
            row.style.flexWrap='wrap';
            row.style.alignItems='center';
            row.style.gap='5px';

            const nameLabel = document.createElement('span');
            nameLabel.textContent = itemName;
            nameLabel.style.flex='1 0 100%';
            nameLabel.style.fontWeight='bold';
            row.appendChild(nameLabel);

            const priceInput = document.createElement('input');
            priceInput.type = 'number';
            priceInput.value = inventoryData[itemName].price;
            priceInput.style.flex='1';
            priceInput.style.padding='5px';
            priceInput.style.fontSize='14px';
            priceInput.onchange = () => {
                inventoryData[itemName].price = parseInt(priceInput.value, 10) || 0;
                localStorage.setItem('tornPdaInventoryData', JSON.stringify(inventoryData));
                const container = document.querySelector('[data-item-id]')?.parentElement;
                if(container) updateInventory(container);
            };
            row.appendChild(priceInput);

            const trendInput = document.createElement('input');
            trendInput.type = 'text';
            trendInput.value = inventoryData[itemName].trend;
            trendInput.maxLength = 1;
            trendInput.style.width='40px';
            trendInput.style.padding='5px';
            trendInput.style.fontSize='14px';
            trendInput.onchange = () => {
                inventoryData[itemName].trend = trendInput.value;
                localStorage.setItem('tornPdaInventoryData', JSON.stringify(inventoryData));
                const container = document.querySelector('[data-item-id]')?.parentElement;
                if(container) updateInventory(container);
            };
            row.appendChild(trendInput);

            panel.appendChild(row);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.display='block';
        closeBtn.style.width='100%';
        closeBtn.style.marginTop='10px';
        closeBtn.style.padding='10px';
        closeBtn.style.fontWeight='bold';
        closeBtn.style.fontSize='16px';
        closeBtn.style.cursor='pointer';
        closeBtn.style.borderRadius='6px';
        closeBtn.style.backgroundColor='#DC3545';
        closeBtn.style.color='white';
        closeBtn.onclick = () => panel.remove();
        panel.appendChild(closeBtn);

        document.body.appendChild(panel);
    }

    // ---- OBSERVE INVENTORY CHANGES ----
    function observeInventory(container) {
        const observer = new MutationObserver(() => updateInventory(container));
        observer.observe(container, { childList: true, subtree: true });
    }

    // ---- START SCRIPT ----
    waitForInventory();

})();