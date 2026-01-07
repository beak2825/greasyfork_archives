// ==UserScript==
// @name         ChickenSmoothie Adopted From Viewer
// @namespace    https://greasyfork.org/users/YOUR_ID
// @version      1.0.1
// @description  Toggle viewing "Adopted from" information for pets directly on the pet list page
// @match        https://www.chickensmoothie.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561679/ChickenSmoothie%20Adopted%20From%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/561679/ChickenSmoothie%20Adopted%20From%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------------------------
       Configuration
    ----------------------------- */

    const STORAGE_KEY = 'cs_show_adopted_from';
    const REQUEST_DELAY = 500; // ms between profile fetches

    /* ----------------------------
       State
    ----------------------------- */

    let enabled = localStorage.getItem(STORAGE_KEY) === 'true';
    const cache = new Map();

    /* ----------------------------
       Utilities
    ----------------------------- */

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createAdoptionElement(text) {
        const div = document.createElement('div');
        div.className = 'pet-adopted-from';
        div.textContent = `Adopted from: ${text}`;
        return div;
    }

    /**
     * Extracts the "Adopted from" value from a pet profile page.
     * Handles:
     *  - Linked values (events/archives)
     *  - Plain text values (Pound, Starter Pet, etc.)
     */
    function extractAdoptedFrom(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');

        for (const label of doc.querySelectorAll('td.l')) {
            if (label.textContent.trim() === 'Adopted from') {
                const valueCell = label.nextElementSibling;
                if (!valueCell) break;

                // Prefer link text if present
                const link = valueCell.querySelector('a');
                if (link && link.textContent.trim()) {
                    return link.textContent.trim();
                }

                // Otherwise use plain text
                const text = valueCell.textContent.trim();
                return text || 'Unknown';
            }
        }

        return 'Unknown';
    }

    /* ----------------------------
       Core Logic
    ----------------------------- */

    async function processPets() {
        const pets = document.querySelectorAll('dl.pet');

        for (const pet of pets) {
            const petId = pet.dataset.id;
            if (!petId) continue;

            let info = pet.querySelector('.pet-adopted-from');

            if (!enabled) {
                if (info) info.style.display = 'none';
                continue;
            }

            if (info) {
                info.style.display = 'block';
                continue;
            }

            info = createAdoptionElement('Loading…');
            pet.appendChild(info);

            if (cache.has(petId)) {
                info.textContent = `Adopted from: ${cache.get(petId)}`;
                continue;
            }

            try {
                const res = await fetch(`/viewpet.php?id=${petId}`);
                const html = await res.text();
                const adoptedFrom = extractAdoptedFrom(html);

                cache.set(petId, adoptedFrom);
                info.textContent = `Adopted from: ${adoptedFrom}`;
            } catch (err) {
                info.textContent = 'Adopted from: Error';
            }

            await sleep(REQUEST_DELAY);
        }
    }

    /* ----------------------------
       UI Injection
    ----------------------------- */

    function insertToggleButton() {
        const renameBtn = document.querySelector('.btn-rename-pets');
        if (!renameBtn) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = enabled ? 'Hide Adopted From' : 'Show Adopted From';
        toggleBtn.className = 'btn-adopted-from-toggle';
        toggleBtn.style.marginLeft = '6px';

        toggleBtn.addEventListener('click', () => {
            enabled = !enabled;
            localStorage.setItem(STORAGE_KEY, enabled);
            toggleBtn.textContent = enabled ? 'Hide Adopted From' : 'Show Adopted From';
            processPets();
        });

        renameBtn.insertAdjacentElement('afterend', toggleBtn);
    }

    /* ----------------------------
       Styles
    ----------------------------- */

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .pet-adopted-from {
                font-size: 11px;
                color: #666;
                margin-top: 4px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    /* ----------------------------
       Init
    ----------------------------- */

    function init() {
        if (!document.querySelector('dl.pet')) return;
        injectStyles();
        insertToggleButton();
        if (enabled) processPets();
    }

    init();

})();
