// ==UserScript==
// @name         SA - Menadżer pakowania - kolory ilości
// @namespace    https://premiumtechpanel.sellasist.pl/
// @version      1.0
// @author       Dawid Wróbel
// @description  Koloruje kolumnę "Zamówiona ilość" wg przedziałów 1-5, 6-10, 11-15, 16-20 itd.
// @match        https://*.sellasist.pl/admin/orders_products/edit*
// @run-at       document-end
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/557539/SA%20-%20Menad%C5%BCer%20pakowania%20-%20kolory%20ilo%C5%9Bci.user.js
// @updateURL https://update.greasyfork.org/scripts/557539/SA%20-%20Menad%C5%BCer%20pakowania%20-%20kolory%20ilo%C5%9Bci.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function findQuantityColumnIndex(table) {
        const headerRow = table.querySelector('tr');
        if (!headerRow) return -1;
        const ths = headerRow.querySelectorAll('th');
        for (let i = 0; i < ths.length; i++) {
            const text = ths[i].textContent.replace(/\s+/g, ' ').trim();
            if (text === 'Zamówiona ilość') {
                return i;
            }
        }
        return -1;
    }
    function colorQuantities() {
        const table = document.querySelector('table.m-editor-list-table');
        if (!table) return;

        const qtyIndex = findQuantityColumnIndex(table);
        if (qtyIndex === -1) return;

        const rows = table.querySelectorAll('tr.product_orders_row');
        const colors = [
            '#e0f7fa',
            '#e8f5e9',
            '#fffde7',
            '#ffe0b2',
            '#ffebee',
            '#ede7f6'
        ];

        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (qtyIndex >= tds.length) return;
            const cell = tds[qtyIndex];
            const rawText = cell.textContent.replace(/\s+/g, '').replace(',', '.');
            const value = parseFloat(rawText);
            if (isNaN(value) || value <= 0) {
                cell.style.backgroundColor = '';
                cell.style.fontWeight = '';
                cell.removeAttribute('title');
                return;
            }
            const band = Math.floor((value - 1) / 5);
            const color = colors[band % colors.length];
            const bandFrom = band * 5 + 1;
            const bandTo = band * 5 + 5;
            cell.style.backgroundColor = color;
            cell.style.fontWeight = 'bold';
            cell.title = 'Zamówiona ilość: ' + value + ' (przedział ' + bandFrom + '-' + bandTo + ')';
        });
    }
    function init() {
        colorQuantities();
        const container = document.querySelector('#editor_list') || document.body;
        if (!container || typeof MutationObserver === 'undefined') return;
        let timeoutId = null;
        const observer = new MutationObserver(() => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(colorQuantities, 150);
        });
        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();