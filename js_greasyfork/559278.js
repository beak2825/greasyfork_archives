// ==UserScript==
// @name         Flavourless
// @namespace    https://greasyfork.org/en/scripts/559278-flavourless
// @version      0.0.3
// @description  Remove crime flavour text.
// @author       https://www.torn.com/profiles.php?XID=2487979
// @match        https://www.torn.com/page.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/559278/Flavourless.user.js
// @updateURL https://update.greasyfork.org/scripts/559278/Flavourless.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isArsonPage() {
        return window.location.hash.includes('/arson');
    }

    function isBurglaryPage() {
        return window.location.hash.includes('/burglary');
    }

    const crimeStyles = document.createElement('style');
    crimeStyles.id = 'flavourless-crime-styles';
    crimeStyles.textContent = `
        .outcomeWrapper___I8dXb {
            display: none !important;
        }

        .flavourless-status-wrapper {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            margin-right: auto;
            text-align: left;
        }

        .flavourless-status {
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .flavourless-reward {
            font-size: 11px;
            font-weight: normal;
            margin-top: 2px;
        }

        .flavourless-status.inquired { color: #cccccc; }
        .flavourless-status.success { color: #7fb069; }
        .flavourless-status.failure { color: #ffe066; }
        .flavourless-status.critical { color: #e74c3c; }

        .crimeOptionWrapper___IOnLO {
            position: relative;
        }

        @keyframes flavourless-flash {
            0% { opacity: 0.4; }
            100% { opacity: 0; }
        }

        .crimeOptionWrapper___IOnLO.flavourless-flash::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            animation: flavourless-flash 0.8s ease-out forwards;
            z-index: 1;
        }

        .crimeOptionWrapper___IOnLO.flavourless-flash.flash-inquired::before {
            background-color: #cccccc;
        }

        .crimeOptionWrapper___IOnLO.flavourless-flash.flash-success::before {
            background-color: #7fb069;
        }

        .crimeOptionWrapper___IOnLO.flavourless-flash.flash-failure::before {
            background-color: #ffe066;
        }

        .crimeOptionWrapper___IOnLO.flavourless-flash.flash-critical::before {
            background-color: #e74c3c;
        }
    `;

    function updatePageStyles() {
        if (isArsonPage() || isBurglaryPage()) {
            if (!document.getElementById('flavourless-crime-styles')) {
                document.head.appendChild(crimeStyles);
            }
        } else {
            const existingStyle = document.getElementById('flavourless-crime-styles');
            if (existingStyle) existingStyle.remove();
        }
    }

    function processOutcome(outcomeWrapper) {
        if (!isArsonPage() && !isBurglaryPage()) return;

        const titleElement = outcomeWrapper.querySelector('.title___IrNe6');
        if (!titleElement) return;

        const statusText = titleElement.textContent.trim();
        const outcomeContent = outcomeWrapper.querySelector('.outcomeContent___nsW4S');
        if (!outcomeContent) return;

        let outcomeClass = 'inquired';
        if (outcomeContent.classList.contains('crimes-outcome-success')) {
            outcomeClass = 'success';
        } else if (outcomeContent.classList.contains('crimes-outcome-criticalFailure')) {
            outcomeClass = 'critical';
        } else if (outcomeContent.classList.contains('crimes-outcome-failure')) {
            outcomeClass = 'failure';
        }

        const rewardsWrapper = outcomeWrapper.querySelector('.rewards___oRCyz');
        let rewardText = '';

        if (rewardsWrapper) {
            const rewardContainer = rewardsWrapper.querySelector('.reward___P7K87');
            if (rewardContainer) {
                const itemCells = rewardContainer.querySelectorAll('.itemCell___aZaUE');
                const items = [];
                itemCells.forEach(cell => {
                    const img = cell.querySelector('img');
                    if (img && img.alt) {
                        items.push(img.alt);
                    }
                });
                rewardText = items.join('; ');
            } else {
                rewardText = rewardsWrapper.textContent.trim();
            }
        }

        const crimeWrapper = outcomeWrapper.closest('.virtualItem___BLyAl');

        let targetElement;
        let insertPosition;
        let searchParent;

        if (isArsonPage()) {
            targetElement = crimeWrapper.querySelector('.titleAndScenario___uWExi');
            insertPosition = 'afterend';
            searchParent = targetElement?.parentElement;
        } else if (isBurglaryPage()) {
            const crimeSection = crimeWrapper.querySelector('.crimeOptionSection___hslpu.flexGrow___S5IUQ');
            const abandonButton = crimeSection?.querySelector('.abandonButtonWrapper___qQOAG');

            if (abandonButton) {
                targetElement = abandonButton;
                insertPosition = 'beforebegin';
            } else {
                targetElement = crimeSection;
                insertPosition = 'beforeend';
            }
            searchParent = crimeSection;
        }

        if (!targetElement) return;

        let statusWrapper = searchParent?.querySelector('.flavourless-status-wrapper');
        if (!statusWrapper) {
            statusWrapper = document.createElement('div');
            statusWrapper.className = 'flavourless-status-wrapper';
            targetElement.insertAdjacentElement(insertPosition, statusWrapper);
        }

        statusWrapper.innerHTML = '';

        const statusSpan = document.createElement('span');
        statusSpan.className = `flavourless-status ${outcomeClass}`;
        statusSpan.textContent = statusText;
        statusWrapper.appendChild(statusSpan);

        if (rewardText) {
            const rewardSpan = document.createElement('span');
            rewardSpan.className = `flavourless-reward ${outcomeClass}`;
            rewardSpan.textContent = rewardText;
            statusWrapper.appendChild(rewardSpan);
        }

        const crimeOption = crimeWrapper.querySelector('.crimeOptionWrapper___IOnLO');
        if (crimeOption) {
            crimeOption.classList.remove('flavourless-flash', 'flash-inquired', 'flash-success', 'flash-failure', 'flash-critical');
            void crimeOption.offsetWidth;
            crimeOption.classList.add('flavourless-flash', `flash-${outcomeClass}`);
        }
    }

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        updatePageStyles();
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        updatePageStyles();
    };

    window.addEventListener('popstate', updatePageStyles);

    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList?.contains('outcome___iW1Dc') &&
                    target.classList?.contains('entered___saHKI')) {
                    processOutcome(target);
                }
            }
        });
    }).observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

    updatePageStyles();
})();