// ==UserScript==
// @name         Edit all text
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Re-arranges buttons to: Edit Any Text, Close, Print.
// @author       Gemini
// @match        https://salsabeelcars.site/index.php/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564238/Edit%20all%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/564238/Edit%20all%20text.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isEditable = false;

    // 1. Create the Edit Button Column
    const editCol = document.createElement('div');
    // Using col-sm-2 to accommodate the longer "Edit Any Text" label
    editCol.className = 'col-sm-2';
    editCol.id = 'edit-btn-container';
    editCol.style.textAlign = 'right';
    editCol.style.paddingRight = '5px';

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.id = 'editToggleBtn';
    toggleButton.className = 'btn btn-sm';
    toggleButton.innerHTML = '<i class="fa fa-edit"></i> Edit Any Text: Off';

    Object.assign(toggleButton.style, {
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        whiteSpace: 'nowrap'
    });

    editCol.appendChild(toggleButton);

    // 2. Toggle Logic
    toggleButton.addEventListener('click', () => {
        isEditable = !isEditable;
        document.designMode = isEditable ? 'on' : 'off';

        const textAreas = document.querySelectorAll('textarea[readonly]');
        textAreas.forEach(area => {
            if (isEditable) {
                area.removeAttribute('readonly');
                area.dataset.wasReadonly = "true";
                area.style.border = "2px dashed #4CAF50";
            } else {
                if (area.dataset.wasReadonly) {
                    area.setAttribute('readonly', '');
                    area.style.border = "";
                }
            }
        });

        if (isEditable) {
            toggleButton.innerHTML = '<i class="fa fa-check"></i> Edit Any Text: On';
            toggleButton.style.backgroundColor = '#4CAF50';
        } else {
            toggleButton.innerHTML = '<i class="fa fa-edit"></i> Edit Any Text: Off';
            toggleButton.style.backgroundColor = '#333';
        }
    });

    // 3. Re-arrangement Logic
    const rearrangeButtons = () => {
        const printDiv = document.querySelector('button.btn-success i.fa-print')?.closest('div[class*="col-sm-"]');
        const closeDiv = document.querySelector('.btn-close');

        if (printDiv && closeDiv && !document.getElementById('editToggleBtn')) {
            const container = printDiv.parentNode;

            // Apply offset to the first button (Edit) to push the group to the right
            // Adjusted offset to 8 because the Edit button now takes up 2 columns (col-sm-2)
            editCol.className = 'col-sm-offset-8 col-sm-2';

            // Standardize widths for the remaining buttons
            printDiv.className = 'col-sm-1';
            closeDiv.className = 'col-sm-1 btn-close';

            // Force the order: Edit Any Text -> Close -> Print
            container.appendChild(editCol);
            container.appendChild(closeDiv);
            container.appendChild(printDiv);
        }
    };

    // Use MutationObserver to handle dynamic page loads
    const observer = new MutationObserver(rearrangeButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    rearrangeButtons();

})();