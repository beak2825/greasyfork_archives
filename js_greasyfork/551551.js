// ==UserScript==
// @name         quick equip needles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  quick needles
// @author       aquagloop
// @license MIT
// @match        https://www.torn.com/item.php*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551551/quick%20equip%20needles.user.js
// @updateURL https://update.greasyfork.org/scripts/551551/quick%20equip%20needles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const quickItems = [
        { name: 'Epi',  id: '463' },
        { name: 'Mela', id: '464' },
        { name: 'Tyro', id: '814' },
        { name: 'Sero', id: '465' }
    ];

    const itemDescriptions = {
        '463': 'Epi: +500% Strength for 120s',
        '464': 'Mela: +500% Speed for 120s',
        '814': 'Tyro: +500% Dexterity for 120s',
        '465': 'Sero: +300% Defense for 120s & +25% Life'
    };

    const MASTER_ID = 'torn-quick-equip-master-container';
    const GRID_ID = 'torn-quick-equip-grid';
    const DESC_ID = 'torn-quick-equip-description';

    function createUI() {
        if (document.getElementById(MASTER_ID)) return;

        const masterContainer = document.createElement('div');
        masterContainer.id = MASTER_ID;
        Object.assign(masterContainer.style, {
            position: 'fixed', top: '100px', right: '20px', zIndex: '9999',
            display: 'flex', flexDirection: 'column', gap: '5px'
        });

        const gridContainer = document.createElement('div');
        gridContainer.id = GRID_ID;
        Object.assign(gridContainer.style, {
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px',
            backgroundColor: 'rgba(50, 50, 50, 0.8)', padding: '10px',
            borderRadius: '8px', border: '1px solid #333'
        });

        quickItems.forEach(item => {
            const button = document.createElement('button');
            button.textContent = item.name;
            Object.assign(button.style, {
                padding: '8px 12px', border: '1px solid #555', borderRadius: '5px', backgroundColor: '#444',
                color: 'white', cursor: 'pointer', minWidth: '60px', fontFamily: 'Arial, sans-serif'
            });
            button.onmouseover = () => button.style.backgroundColor = '#555';
            button.onmouseout = () => button.style.backgroundColor = '#444';

            button.addEventListener('click', () => {
                const equipActionElement = document.querySelector(`li[data-item="${item.id}"] li[data-action="equip"]`);
                if (equipActionElement) {
                    equipActionElement.querySelector('button')?.click();
                } else {
                    button.style.backgroundColor = '#a13023';
                    setTimeout(() => { button.style.backgroundColor = '#444'; }, 1000);
                }
            });
            gridContainer.appendChild(button);
        });

        const descriptionBox = document.createElement('div');
        descriptionBox.id = DESC_ID;
        Object.assign(descriptionBox.style, {
            display: 'none', padding: '8px', backgroundColor: 'rgba(50, 50, 50, 0.8)',
            color: '#ddd', borderRadius: '8px', border: '1px solid #333',
            fontSize: '12px', textAlign: 'center'
        });

        masterContainer.appendChild(gridContainer);
        masterContainer.appendChild(descriptionBox);
        document.body.appendChild(masterContainer);
    }

    function updateDescription() {
        const descriptionBox = document.getElementById(DESC_ID);
        if (!descriptionBox) return;

        const tempItemImg = document.querySelector('#equipped-items [data-slot="temporary"] img');
        if (!tempItemImg || !tempItemImg.src) {
            descriptionBox.style.display = 'none';
            return;
        }

        const match = tempItemImg.src.match(/\/items\/(\d+)\//);
        if (match && itemDescriptions[match[1]]) {
            descriptionBox.textContent = itemDescriptions[match[1]];
            descriptionBox.style.display = 'block';
        } else {
            descriptionBox.style.display = 'none';
        }
    }

    const uiCreationObserver = new MutationObserver((mutationsList, obs) => {
        if (document.querySelector('ul.itemsList')) {
            createUI();
            obs.disconnect();

            const equippedItemsContainer = document.getElementById('equipped-items');
            if (equippedItemsContainer) {
                const descriptionObserver = new MutationObserver(updateDescription);
                descriptionObserver.observe(equippedItemsContainer, {
                    childList: true, subtree: true, attributes: true, attributeFilter: ['src']
                });
                updateDescription();
            }
        }
    });

    uiCreationObserver.observe(document.body, { childList: true, subtree: true });

})();