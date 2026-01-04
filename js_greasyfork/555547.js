// ==UserScript==
// @name         FV - Improved Min Level Displays
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Displays the min level of equipment and inventory items, with color following the inherited text color.
// @author       necroam
// @match        https://www.furvilla.com/career/warrior/*
// @match        https://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560813/FV%20-%20Improved%20Min%20Level%20Displays.user.js
// @updateURL https://update.greasyfork.org/scripts/560813/FV%20-%20Improved%20Min%20Level%20Displays.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const minLevelCache = new Map();

    function createMinLevelLabel(minLevel) {
        const label = document.createElement('span');
        label.className = 'min-level-label';
        label.textContent = `Min Lvl ${minLevel}`;
        label.style.display = 'block';
        label.style.marginTop = '2px';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '90%';
        label.style.color = 'currentColor';
        return label;
    }

    // warrior equipment display
    function injectWarriorMinLevels() {
        const items = document.querySelectorAll('.inventory-item');

        items.forEach(item => {
            const nameSpan = item.querySelector('.name');
            const infoBlock = item.querySelector('.info');
            const id = item.getAttribute('data-id');

            if (!id || !nameSpan || !infoBlock || nameSpan.querySelector('.min-level-label')) return;

            const infoText = infoBlock.textContent || '';
            const match = infoText.match(/Min Level:\s*(\d+)/i);
            if (!match) return;

            const minLevel = match[1];
            const label = createMinLevelLabel(minLevel);
            nameSpan.appendChild(label);
        });
    }

    // inject min levels in the inventory
    function injectInventoryMinLevels() {
        const items = document.querySelectorAll('.inventory-item');

        items.forEach(item => {
            const link = item.querySelector('a.show-inventory-actions');
            const nameSpan = item.querySelector('.name');
            const id = link?.getAttribute('data-id');

            if (!id || !nameSpan || nameSpan.querySelector('.min-level-label')) return;

            const minLevel = minLevelCache.get(id);
            if (!minLevel) return;

            const label = createMinLevelLabel(minLevel);
            nameSpan.appendChild(label);
        });
    }

    // fetch inventory min levels
    async function preloadMinLevels() {
        const items = document.querySelectorAll('.inventory-item');
        if (!items.length) return;

        const fetchPromises = [];

        items.forEach(item => {
            const link = item.querySelector('a.show-inventory-actions');
            const id = link?.getAttribute('data-id');
            if (id && !minLevelCache.has(id)) {
                fetchPromises.push(
                    fetch(`/inventory/${id}`)
                        .then(res => res.text())
                        .then(html => {
                            const match = html.match(/<b>Min Level:<\/b>\s*(\d+)/);
                            if (match) minLevelCache.set(id, match[1]);
                        })
                        .catch(err => console.error('Fetch error for item ID', id, err))
                );
            }
        });

        await Promise.all(fetchPromises);
        injectInventoryMinLevels();
    }

    let mutationTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(mutationTimeout);
        mutationTimeout = setTimeout(() => {
            // equipment display
            injectWarriorMinLevels();
            // inventory
            preloadMinLevels();
        }, 150);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', () => {
        injectWarriorMinLevels();
        setTimeout(preloadMinLevels, 500);
    });
})();