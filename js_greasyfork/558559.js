// ==UserScript==
// @name         Grundos Cafe – Faerie Quest Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Helper for finding items in big malls when on faerie quests
// @match        https://www.grundos.cafe/search/items/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558559/Grundos%20Cafe%20%E2%80%93%20Faerie%20Quest%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558559/Grundos%20Cafe%20%E2%80%93%20Faerie%20Quest%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const shopOwners = [
        'Maths',
        'fractalxwee',
        'crabs',
        'grusuko'
        // Add more as needed
    ];

    function inject() {
        const idSpan = document.querySelector('#item-id');
        if (!idSpan) return;

        const itemId = idSpan.textContent.trim();
        if (!itemId) return;

        const nameP = idSpan.closest('.item-search-column')?.querySelector('p.nomargin strong');
        if (!nameP) return;

        if (document.querySelector('.gc-shop-links')) return;

        const linksDiv = document.createElement('div');
        linksDiv.className = 'gc-shop-links';
        linksDiv.style.marginTop = '6px';
        linksDiv.style.display = 'flex';
        linksDiv.style.flexDirection = 'column';
        linksDiv.style.gap = '2px';

        shopOwners.forEach(owner => {
            const link = document.createElement('a');
            link.href = `https://www.grundos.cafe/market/browseshop/?owner=${encodeURIComponent(owner)}&item_id=${itemId}`;
            link.target = '_blank';
            link.textContent = `Find in ${owner} shop`;
            link.style.fontSize = '0.8em';
            linksDiv.appendChild(link);
        });

        nameP.parentElement.after(linksDiv);
    }

    inject();

    const observer = new MutationObserver(inject);
    observer.observe(document.body, { childList: true, subtree: true });
})();
