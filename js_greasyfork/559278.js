// ==UserScript==
// @name         Flavourless
// @namespace    https://greasyfork.org/en/scripts/559278-flavourless
// @version      0.0.4
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

(function () {
    'use strict';

    // change true to false if you don't want to hide flavour text on a page
    const CONFIG = {
        arson: true,
        burglary: true,
        disposal: true,
        cracking: true
    };

    function getEnabledPage() {
        const hash = window.location.hash;
        return Object.keys(CONFIG).find(page => hash.includes(`/${page}`) && CONFIG[page]) || null;
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
        if (getEnabledPage()) {
            if (!document.getElementById('flavourless-crime-styles')) {
                document.head.appendChild(crimeStyles);
            }
        } else {
            const existingStyle = document.getElementById('flavourless-crime-styles');
            if (existingStyle) existingStyle.remove();
        }
    }

    function extractRewards(outcomeWrapper) {
        const rewardsWrapper = outcomeWrapper.querySelector('.rewards___oRCyz');
        if (!rewardsWrapper) return '';

        const items = [];

        const rewardContainer = rewardsWrapper.querySelector('[class*="reward___P7K87"], [class*="reward___oQH1h"]');
        if (rewardContainer) {
            rewardContainer.querySelectorAll('.itemCell___aZaUE').forEach(cell => {
                const img = cell.querySelector('img');
                if (img?.alt) items.push(img.alt);
            });

            // ammo has no alt text so generic outcome. Check logs if you wanna know what it was
            const ammoImage = rewardContainer.querySelector('[class*="ammoImage___"]');
            if (ammoImage) {
                const countSpan = rewardContainer.querySelector('[class*="countCell___"] [class*="count___"]');
                const count = countSpan ? countSpan.textContent.trim() : '';
                items.push(`Ammunition${count ? ', ' + count : ''}`);
            }

            // items might be added to the game with no alt text like ammo
            if (items.length === 0 && rewardContainer.querySelector('[class*="itemCell___"]')) {
                items.push('Unknown');
            }
        }

        if (items.length === 0) {
            const moneyReward = rewardsWrapper.querySelector('span[class*="reward___"]');
            if (moneyReward?.textContent.trim()) {
                items.push(moneyReward.textContent.trim());
            }
        }

        return items.join('; ');
    }

    function getInsertionPoint(crimeWrapper, page) {
        let targetElement, insertPosition, searchParent;

        if (page === 'arson') {
            targetElement = crimeWrapper.querySelector('.titleAndScenario___uWExi');
            insertPosition = 'afterend';
            searchParent = targetElement?.parentElement;
        } else {
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

        return { targetElement, insertPosition, searchParent };
    }

    function processOutcome(outcomeWrapper, page) {

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

        const rewardText = extractRewards(outcomeWrapper);
        const crimeWrapper = outcomeWrapper.closest('.virtualItem___BLyAl');
        const { targetElement, insertPosition, searchParent } = getInsertionPoint(crimeWrapper, page);

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

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        updatePageStyles();
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        updatePageStyles();
    };

    window.addEventListener('popstate', updatePageStyles);

    const processedOutcomes = new WeakSet();

    new MutationObserver((mutations) => {
        const page = getEnabledPage();
        if (!page) return;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;

                    const outcomes = node.classList?.contains('outcome___iW1Dc')
                        ? [node]
                        : Array.from(node.querySelectorAll?.('.outcome___iW1Dc') || []);

                    outcomes.forEach(outcome => {
                        if (processedOutcomes.has(outcome)) return;
                        if (outcome.querySelector('.outcomeContent___nsW4S')) {
                            processedOutcomes.add(outcome);
                            processOutcome(outcome, page);
                        }
                    });
                });
            }
        });
    }).observe(document.body, {
        subtree: true,
        childList: true
    });

    updatePageStyles();
})();