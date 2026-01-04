// ==UserScript==
// @name         bomb and bags!
// @namespace    http://tampermonkey.net/
// @version      10.0
// @description  more bomb leondias!
// @author       aquagloop
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554010/bomb%20and%20bags%21.user.js
// @updateURL https://update.greasyfork.org/scripts/554010/bomb%20and%20bags%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const parcelItemID = '373';
    const medItemIDs = [
        '732'
    ];

    const clickCooldown = 100;
    let isActionLocked = false;

    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'gm-opener-container';
    document.body.appendChild(buttonContainer);

    const parcelButton = document.createElement('button');
    parcelButton.innerText = 'bomb';
    parcelButton.className = 'gm-opener-btn';
    buttonContainer.appendChild(parcelButton);

    const medButton = document.createElement('button');
    medButton.innerText = 'A+ bag';
    medButton.className = 'gm-opener-btn';
    buttonContainer.appendChild(medButton);

    GM_addStyle(`
        #gm-opener-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: #333;
            border: 1px solid #555;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .gm-opener-btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            min-width: 120px;
            text-align: center;
        }
        .gm-opener-btn:hover {
            background: #45a049;
        }
        .gm-opener-btn:disabled {
            background: #555;
            cursor: not-allowed;
        }
    `);

    function buildMedSelector(part, active = true, container = null) {
        const state = active ? 'li.act' : 'li:not(.act)';
        const prefix = container ? `${container} ` : '';
        return medItemIDs.map(id => `${prefix}${state}[data-item="${id}"] ${part}`).join(', ');
    }

    function updateButtonText() {
        if (window.location.pathname !== '/item.php') {
            parcelButton.innerText = 'items';
            medButton.innerText = 'items';
            return;
        }

        // --- Parcel Selectors ---
        const parcelConfirm = document.querySelector(`li.act[data-item="${parcelItemID}"] .action-wrap .next-act.decrement-amount`);
        const parcelOpenSpecific = document.querySelector(`li.act[data-item="${parcelItemID}"] .action-wrap .open-parcel-act[data-id="${parcelItemID}"]`);
        const supplyPackPanel = document.querySelector('#supply-pck-items');
        const isParcelPanelVisible = supplyPackPanel && supplyPackPanel.style.display !== 'none';
        const parcelOpen = document.querySelector(`#supply-pck-items li[data-item="${parcelItemID}"]:not(.act) .actions-wrap li[data-action="use"] button.option-use`);

        // --- Med Selectors ---
        const medConfirmationButtons = document.querySelectorAll(buildMedSelector('.action-wrap a.next-act.decrement-amount', true));
        const medYes = document.querySelector(buildMedSelector('.action-wrap a.next-act', true)); // For empty bags, just in case
        const medicalPanel = document.querySelector('#medical-items');
        const isMedPanelVisible = medicalPanel && medicalPanel.style.display !== 'none';
        const medUse = document.querySelector(buildMedSelector('.actions-wrap li[data-action="use"] button.option-use', false, '#medical-items'));

        // --- Parcel Button Logic ---
        if (parcelConfirm || parcelOpenSpecific) {
            parcelButton.innerText = 'open';
        } else if (isParcelPanelVisible && parcelOpen) {
            parcelButton.innerText = 'parcel';
        } else if (!isParcelPanelVisible) {
            parcelButton.innerText = 'supplypack';
        } else {
            parcelButton.innerText = 'bomb';
        }

        // --- Med Button Logic ---
        let medConfirmFound = false;
        if (medConfirmationButtons.length > 0) {
            for (const btn of medConfirmationButtons) {
                const btnText = btn.innerText.trim().toLowerCase();
                if (btnText === 'use another') {
                    medButton.innerText = 'use another';
                    medConfirmFound = true;
                    break;
                } else if (btnText === 'okay') {
                    medButton.innerText = 'use';
                    medConfirmFound = true;
                    break;
                }
            }
        }

        if (!medConfirmFound) {
            if (medYes && medYes.innerText.trim().toLowerCase() === 'yes') {
                 medButton.innerText = 'use';
            } else if (isMedPanelVisible && medUse) {
                medButton.innerText = 'bloodbag';
            } else if (!isMedPanelVisible) {
                medButton.innerText = 'medical';
            } else {
                medButton.innerText = 'A+ bag';
            }
        }
    }

    function lockAndRun(logicFunction) {
        if (isActionLocked) {
            return;
        }

        if (window.location.pathname !== '/item.php') {
            window.location.href = 'https://www.torn.com/item.php';
            isActionLocked = true;
            parcelButton.disabled = true;
            medButton.disabled = true;
            return;
        }

        isActionLocked = true;
        parcelButton.disabled = true;
        medButton.disabled = true;

        logicFunction();

        setTimeout(() => {
            isActionLocked = false;
            parcelButton.disabled = false;
            medButton.disabled = false;
        }, clickCooldown);
    }

    parcelButton.addEventListener('click', () => {
        lockAndRun(() => {
            const confirmYes = document.querySelector(`li.act[data-item="${parcelItemID}"] .action-wrap .next-act.decrement-amount`);
            if (confirmYes) {
                confirmYes.click();
                return;
            }

            const openSpecificParcel = document.querySelector(`li.act[data-item="${parcelItemID}"] .action-wrap .open-parcel-act[data-id="${parcelItemID}"]`);
            if (openSpecificParcel) {
                openSpecificParcel.click();
                return;
            }

            const supplyPackPanel = document.querySelector('#supply-pck-items');
            const isParcelPanelVisible = supplyPackPanel && supplyPackPanel.style.display !== 'none';

            if (isParcelPanelVisible) {
                const openButton = document.querySelector(`#supply-pck-items li[data-item="${parcelItemID}"]:not(.act) .actions-wrap li[data-action="use"] button.option-use`);
                if (openButton) {
                    openButton.click();
                    return;
                }
            }

            const supplyPackTab = document.querySelector('a[href="#supply-pck-items"][data-info="Supply Pack"]');
            if (supplyPackTab && !isParcelPanelVisible) {
                supplyPackTab.click();
                return;
            }
        });
    });

    medButton.addEventListener('click', () => {
        lockAndRun(() => {

            const medConfirmationButtons = document.querySelectorAll(buildMedSelector('.action-wrap a.next-act.decrement-amount', true));
            if (medConfirmationButtons.length > 0) {
                for (const btn of medConfirmationButtons) {
                    const btnText = btn.innerText.trim().toLowerCase();
                    if (btnText === 'use another') {
                        btn.click();
                        return;
                    }
                    if (btnText === 'okay') {
                        btn.click();
                        return;
                    }
                }
            }


            const confirmYesSelector = buildMedSelector('.action-wrap a.next-act', true);
            const confirmYes = document.querySelector(confirmYesSelector);
            if (confirmYes && confirmYes.innerText.trim().toLowerCase() === 'yes') {
                confirmYes.click();
                return;
            }


            const medicalPanel = document.querySelector('#medical-items');
            const isMedPanelVisible = medicalPanel && medicalPanel.style.display !== 'none';

            if (isMedPanelVisible) {
                const useButtonSelector = buildMedSelector('.actions-wrap li[data-action="use"] button.option-use', false, '#medical-items');
                const useButton = document.querySelector(useButtonSelector);
                if (useButton) {
                    useButton.click();
                    return;
                }
            }


            const medicalTab = document.querySelector('a[href="#medical-items"][data-info="Medical"]');
            if (medicalTab && !isMedPanelVisible) {
                medicalTab.click();
                return;
            }
        });
    });


    updateButtonText();


    if (window.location.pathname === '/item.php') {
        let observerDebounceTimeout;
        const observerCallback = (mutations) => {
            clearTimeout(observerDebounceTimeout);
            observerDebounceTimeout = setTimeout(() => {
                updateButtonText();
            }, 50);
        };

        const targetNode = document.querySelector('.items-wrap.primary-items.t-blue-cont');

        if (targetNode) {
            const observer = new MutationObserver(observerCallback);
            observer.observe(targetNode, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style']
            });
        }
    }

})();