// ==UserScript==
// @name         Mini Profile revives with R to make the revive
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Basically it does the same thing as this script: https://greasyfork.org/en/scripts/526119-fast-profile-revives-w-r-to-revive, but it works with mini profiles too :)
// @author       edi [3245925]
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561239/Mini%20Profile%20revives%20with%20R%20to%20make%20the%20revive.user.js
// @updateURL https://update.greasyfork.org/scripts/561239/Mini%20Profile%20revives%20with%20R%20to%20make%20the%20revive.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const targetSelectorRevButton = '.profile-button-revive';
    const paginationWrapperSelector = '.pagination-wrap';
    const profileButtonDialogSelector = '.profile-buttons-dialog';
    const profileRootSelector = '.content-title';
    const regex = /has a <b>(.+?)%<\/b> chance/;
    const confirmActionSelector = '.confirm-action-yes';
    const confirmActionOkSelector = '.confirm-action.okay';
    const classNameButton = 'button-threshold-revive';

    let threshold = parseFloat(localStorage.getItem('reviveThreshold')) || 50;

    const myButton = document.createElement('button');
    myButton.className = classNameButton;
    myButton.style.position = 'fixed';
    myButton.style.top = '100px';
    myButton.style.bottom = '';
    myButton.style.right = '20px';
    myButton.style.padding = '12px 18px';
    myButton.style.backgroundColor = '#d9534f';
    myButton.style.color = '#fff';
    myButton.style.border = '2px solid white';
    myButton.style.borderRadius = '8px';
    myButton.style.cursor = 'pointer';
    myButton.style.fontSize = '14px';
    myButton.style.fontWeight = 'bold';
    myButton.style.zIndex = '999999';
    myButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';

    function updateButtonText() {
        myButton.textContent = `Revive Threshold: ${threshold}%`;
    }
    updateButtonText();

    myButton.onclick = () => {
        const input = prompt("Introduce the threshold:", threshold);

        if (input !== null) {
            const val = parseFloat(input);
            if (!isNaN(val)) {
                threshold = val;
                localStorage.setItem('reviveThreshold', threshold);
                updateButtonText();
                console.log(`Noua limită setată: ${threshold}%`);
            } else {
                alert("Te rog introdu un număr valid!");
            }
        }
    };

    const observer = new MutationObserver(() => {
        const paginationWrapper = document.querySelector(paginationWrapperSelector);
        const profileRoot = document.querySelector(profileRootSelector);

        const existingButton = document.querySelector(`.${classNameButton}`);

        if (!existingButton) {
            if (paginationWrapper) {
                paginationWrapper.appendChild(myButton);
            } else if (profileRoot) {
                console.log('Adding button to profile root');
                profileRoot.append(myButton);
            }
            else {
                console.log('No suitable location found for the button.');
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'r' || event.key === 'R') {
            const okButton = document.querySelector(confirmActionOkSelector);
            if (okButton) {
                okButton.click();
            }
            const dialog = document.querySelector(profileButtonDialogSelector);

            if (dialog) {
                const textContent = dialog.innerHTML;
                const match = textContent.match(regex);

                if (match) {
                    const chance = parseFloat(match[1]);
                    threshold = parseFloat(localStorage.getItem('reviveThreshold')) || 50;
                    if (chance >= threshold) {
                        const confirmButton = document.querySelector(confirmActionSelector);
                        if (confirmButton) {
                            confirmButton.click();
                        }
                    }
                }
            }
            else {
                const reviveButton = document.querySelector(targetSelectorRevButton);
                if (reviveButton) {
                    reviveButton.click();
                }
            }
        }
    });
})();