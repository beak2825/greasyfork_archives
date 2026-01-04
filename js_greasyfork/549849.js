 // ==UserScript==
// @name         Copy Invoice File Name
// @namespace    https://openai.com
// @version      1.1
// @description  Adds copy buttons for Reference Number - Invoice Number in payment history
// @match        https://imos.churchofjesuschrist.org/vendor-management/*
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/549849/Copy%20Invoice%20File%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/549849/Copy%20Invoice%20File%20Name.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Copy Ref-Inv] Script loaded');

     function processTable() {
        const table = document.querySelector('table.payment-history-table');
        if (!table) {
            console.log('[Copy Ref-Inv] Table not found.');
            return;
        }
        console.log('[Copy Ref-Inv] Processing table...');

        // Add column header if not already present
        const headerRow = table.querySelector('thead tr');
        if (headerRow && !headerRow.querySelector('.imos-thead-directive-th-wrapper-copy')) {
            const th = document.createElement('th');
            th.classList.add('ng-scope', 'imos-thead-directive-th-wrapper-print', 'imos-thead-directive-th-wrapper-copy');
            th.setAttribute('ng-class', "'imos-thead-directive-th-wrapper-' + key");

            const divSwitch = document.createElement('div');
            divSwitch.setAttribute('ng-switch', 'th.headingType');

            const divSwitchWhen = document.createElement('div');
            divSwitchWhen.setAttribute('ng-switch-when', 'text');
            divSwitchWhen.classList.add('ng-scope');

            const labelDiv = document.createElement('div');
            labelDiv.classList.add('field-label', 'current-sorted-column');
            labelDiv.setAttribute('ng-click', "imosThead.sortBy(key)");

            const spanLong = document.createElement('span');
            spanLong.classList.add('field-label-long', 'ng-binding');
            spanLong.textContent = 'Copy Ref - Inv';

            const spanShort = document.createElement('span');
            spanShort.classList.add('field-label-short', 'ng-binding');

            const arrowUp = document.createElement('span');
            arrowUp.classList.add('up-arrow', 'ng-hide');
            arrowUp.setAttribute('ng-show', "imosThead.shouldShowArrow(key, 'up')");

            const arrowDown = document.createElement('span');
            arrowDown.classList.add('down-arrow', 'ng-hide');
            arrowDown.setAttribute('ng-show', "imosThead.shouldShowArrow(key, 'down')");

            labelDiv.appendChild(spanLong);
            labelDiv.appendChild(spanShort);
            labelDiv.appendChild(arrowUp);
            labelDiv.appendChild(arrowDown);

            divSwitchWhen.appendChild(labelDiv);
            divSwitch.appendChild(divSwitchWhen);
            th.appendChild(divSwitch);

            headerRow.appendChild(th);
            console.log('[Copy Ref-Inv] Header added.');
        }

        const bodytable = document.querySelector('.payment-history-table-body-section');
        if (!bodytable) {
            console.log('[Copy Ref-Inv] Body table not found.');
            return;
        }

        const tbodies = bodytable.querySelectorAll('tbody');
        tbodies.forEach((tbody, index) => {
            const row = tbody.querySelector('tr');
            if (!row) return;

            if (row.querySelector('.copy-cell')) {
                console.log(`[Copy Ref-Inv] Row ${index} already processed.`);
                return;
            }

            const cells = row.querySelectorAll('td');
            if (cells.length < 3) {
                console.log(`[Copy Ref-Inv] Row ${index} skipped (not enough columns).`);
                return;
            }

            const ref = cells[0].innerText.trim();
            const invoice = cells[2].innerText.trim();

            if (!ref || !invoice) {
                console.log(`[Copy Ref-Inv] Row ${index} missing ref/invoice.`);
                return;
            }

            const toCopy = `${ref} - ${invoice}`;
            console.log(`[Copy Ref-Inv] Row ${index}: "${toCopy}"`);

            const td = document.createElement('td');
            td.className = 'copy-cell';

            const btn = document.createElement('button');
            btn.innerText = 'Copy';
            btn.title = `Copy "${toCopy}"`;
            btn.style.cursor = 'pointer';
            btn.style.padding = '2px 6px';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '4px';
            btn.style.background = '#f0f0f0';
            btn.style.fontSize = '13px';

            btn.onclick = () => {
                GM_setClipboard(toCopy);
                console.log(`[Copy Ref-Inv] Copied: "${toCopy}"`);
                btn.textContent = '✅';
                setTimeout(() => btn.textContent = 'Copy', 1200);
            };

            td.appendChild(btn);
            row.appendChild(td);
        });
    }

    // 🐒 Add floating monkey button
    function addFloatingButton() {
        if (document.querySelector('#copy-monkey-button')) return;

        const btn = document.createElement('button');
        btn.id = 'copy-monkey-button';
        btn.textContent = '🐒';
        btn.title = 'Click to add Copy buttons';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.width = '48px';
        btn.style.height = '48px';
        btn.style.borderRadius = '50%';
        btn.style.border = 'none';
        btn.style.background = '#0091bc';
        btn.style.color = 'white';
        btn.style.fontSize = '24px';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        btn.style.zIndex = '9999';
        btn.style.cursor = 'pointer';

        // 🐒 Monkey jump + spin animation
        const style = document.createElement('style');
        style.textContent =
        `@keyframes monkey-jump-spin {
            0% { transform: translateY(0) rotate(0deg); }
            30% { transform: translateY(-100px) rotate(180deg); }
            60% { transform: translateY(0) rotate(360deg); }
            100% { transform: translateY(0) rotate(360deg); }
        }

        #copy-monkey-button.animate {
            animation: monkey-jump-spin 0.9s ease-in-out;
        }`
    ;
        document.head.appendChild(style);

        btn.onclick = () => {
            console.log('[Copy Ref-Inv] 🐒 Button clicked!');
            btn.classList.remove('animate');
            void btn.offsetWidth; // force reflow
            btn.classList.add('animate');
            processTable();
        };

        document.body.appendChild(btn);
    }

    // ⌨️ Add Ctrl + M shortcut to run the script
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key.toLowerCase() === 'm') {
            e.preventDefault();
            console.log('[Copy Ref-Inv] Ctrl+M pressed!');
            processTable();
        }
    });

    // Run once on load
    window.addEventListener('load', () => {
        addFloatingButton();
    });
})();
