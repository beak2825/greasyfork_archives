// ==UserScript==
// @name         Flight Rising Item Filter
// @namespace    https://flightrising.com/
// @version      2.4
// @description  Let's you filter for items in CRs, PMs, Baldwins, and AH by name.
// @match        https://www1.flightrising.com/auction-house/sell/*
// @match        https://www1.flightrising.com/msgs/*
// @match        https://www1.flightrising.com/crossroads**
// @match        https://www1.flightrising.com/trading/baldwin/transmute
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/563191/Flight%20Rising%20Item%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/563191/Flight%20Rising%20Item%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'fr_item_filter_' + location.pathname;
    const THEME_KEY = 'fr_item_filter_theme';

    /* ---------------- UI ---------------- */
    const box = document.createElement('div');
    box.id = 'fr-filter-container';
    box.style.cssText = `
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #444;
        width: 100%;
        box-sizing: border-box;
        clear: both;
        display: none;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search Items...';
    input.style.cssText = `
        flex-grow: 1;
        padding: 6px;
        border-radius: 3px;
        outline: none;
        border-width: 1px;
        border-style: solid;
    `;

    const themeBtn = document.createElement('button');
    themeBtn.textContent = '🌓';
    themeBtn.style.cssText = `
        background: none;
        border: 1px solid #555;
        cursor: pointer;
        padding: 4px 4px;
        border-radius: 3px;
        font-size: 7px;
    `;

    box.appendChild(input);
    box.appendChild(themeBtn);

    /* ---------------- Theme Logic ---------------- */
    function applyTheme(isLight) {
        if (isLight) {
            // LIGHT MODE COLORS
            box.style.background = '#EAE6E2';
            box.style.color = '#000';
            box.style.borderColor = '#C0C0C0';

            input.style.background = '#fff';
            input.style.color = '#000';
            input.style.borderColor = '#C0C0C0';

            themeBtn.style.background = '#eee';
            themeBtn.style.color = '#000';
            themeBtn.style.borderColor = '#C0C0C0';
        } else {
            // DARK MODE COLORS
            box.style.background = '#242424';
            box.style.color = '#fff';
            box.style.borderColor = '#0C0C0C';

            input.style.background = '#111';
            input.style.color = '#fff';
            input.style.borderColor = '#0C0C0C';

            themeBtn.style.background = '#333';
            themeBtn.style.color = '#fff';
            themeBtn.style.borderColor = '#0C0C0C';
        }
        localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    }

    themeBtn.addEventListener('click', () => {
        const isCurrentlyLight = localStorage.getItem(THEME_KEY) === 'light';
        applyTheme(!isCurrentlyLight);
    });

    /* ---------------- Logic ---------------- */
    function updateVisibility() {
        const ahTarget = document.querySelector('.ah-sell-item-list');
        const modalTarget = document.getElementById('attach-item');
        const baldwinTarget = document.getElementById('generic-attach-item');

        const target = modalTarget || ahTarget || baldwinTarget;

        if (!target) {
            box.style.display = 'none';
            return;
        }

        const style = window.getComputedStyle(target);
        const isActuallyVisible = style.display !== 'none' &&
                                   style.visibility !== 'hidden' &&
                                   target.offsetHeight > 0;

        if (isActuallyVisible) {
            if (target.previousElementSibling !== box) {
                target.parentNode.insertBefore(box, target);
            }
            box.style.display = 'flex';

            if (target === ahTarget) {
                const rect = box.getBoundingClientRect();
                const totalOffset = rect.height + 38;
                const newHeight = `calc(510px - ${totalOffset}px)`;
                target.style.setProperty('height', newHeight, 'important');
                target.style.setProperty('max-height', newHeight, 'important');
                target.style.overflowY = 'auto';
            }
        } else {
            box.style.display = 'none';
            if (ahTarget) {
                ahTarget.style.removeProperty('height');
                ahTarget.style.removeProperty('max-height');
            }
        }
    }

    function getItemName(el) {
        if (el.dataset?.name) return el.dataset.name;
        const namedChild = el.querySelector?.('[data-name]');
        if (namedChild?.dataset?.name) return namedChild.dataset.name;
        const img = el.querySelector?.('img');
        if (img?.alt) return img.alt;
        return '';
    }

    function filterItems() {
        const raw = input.value.trim();
        localStorage.setItem(STORAGE_KEY, raw);
        if (box.style.display === 'none') return;

        // 1. Split the input by commas and clean up whitespace
        const searchTerms = raw.split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0);

        const items = document.querySelectorAll('.item-attachment, .ah-sell-item, a.intclue, .clue-item');

        items.forEach(item => {
            // If search is empty, show everything
            if (searchTerms.length === 0) {
                item.style.display = '';
                return;
            }

            const name = getItemName(item).toLowerCase();

            // 2. Check if the item name matches ANY of the search terms
            const isMatch = searchTerms.some(term => {
                try {
                    // This allows for both simple text and regex per item
                    const regex = new RegExp(term, 'i');
                    return regex.test(name);
                } catch {
                    // Fallback to simple text matching if regex fails
                    return name.includes(term.toLowerCase());
                }
            });

            item.style.display = isMatch ? '' : 'none';
        });
    }

    /* ---------------- Events ---------------- */
    const observer = new MutationObserver(() => {
        updateVisibility();
        if (box.style.display === 'flex') filterItems();
    });

    observer.observe(document.body, {
        childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class']
    });

    input.addEventListener('input', filterItems);

    /* ---------------- Init ---------------- */
    const savedFilter = localStorage.getItem(STORAGE_KEY);
    if (savedFilter) input.value = savedFilter;

    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === 'light');

    updateVisibility();
    if (input.value.trim()) filterItems();
})();