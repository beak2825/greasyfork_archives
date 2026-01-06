// ==UserScript==
// @name         FV - Search Item Button in Inventory
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      1.0
// @description  Adds a Search button inside the item inventory that takes you to the item museum.
// @match        https://www.furvilla.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561551/FV%20-%20Search%20Item%20Button%20in%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/561551/FV%20-%20Search%20Item%20Button%20in%20Inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSearchButton() {
        const modals = document.querySelectorAll('#itemModal');

        modals.forEach(modal => {
            const form = modal.querySelector('#stack-form');
            if (!form) return;

            if (form.querySelector('.search-btn')) return;

            const searchBtn = document.createElement('button');
            searchBtn.textContent = 'Search';
            searchBtn.className = 'btn pull-left search-btn';
            searchBtn.style.marginLeft = '0.5px';
            searchBtn.type = 'button';

            const transferElement = form.querySelector('a[data-url*="/transfers/items/new/"]');
            if (transferElement) {
                transferElement.parentNode.insertBefore(searchBtn, transferElement.nextSibling);
            } else {
                form.insertBefore(searchBtn, form.firstChild);
            }
            searchBtn.addEventListener('click', () => {
                const logoDiv = modal.querySelector('div.logo');
                if (!logoDiv) return alert('Logo div not found.');

                const bgImage = logoDiv.style.backgroundImage || logoDiv.getAttribute('style');
                const urlMatch = /url\(["']?([^"')]+)["']?\)/.exec(bgImage);
                if (!urlMatch) return alert('Background image URL not found.');

                const imageUrl = urlMatch[1];
                const urlParts = imageUrl.split('/');
                const filename = urlParts[urlParts.length - 1];
                const idMatch = /^(\d+)-/.exec(filename);
                if (!idMatch) return alert('Item ID not found.');

                const itemId = idMatch[1];
                window.location.href = `https://www.furvilla.com/museum/item/${itemId}`;
            });
        });
    }

    const observer = new MutationObserver(() => {
        addSearchButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addSearchButton();
})();