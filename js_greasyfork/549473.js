// ==UserScript==
// @name         OC Role - Acceptable Range
// @namespace    http://tampermonkey.net/
// @version      0.4.7
// @description  Dynamically numbers duplicate OC roles based on slot order
// @author       Eilaer [2741746], grabbed observer from Allenone [2033011] and their original slot numbering code
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549473/OC%20Role%20-%20Acceptable%20Range.user.js
// @updateURL https://update.greasyfork.org/scripts/549473/OC%20Role%20-%20Acceptable%20Range.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let globalObserver = null;
    let processing = false;
    const debounceDelay = 200;

    const ocReqs = {
        'default': {
            min: 60,
            max: 80
        },
        'blast from the past': {
            'bomber': 65,
            'muscle': 70,
            'picklock #1': 60,
            'engineer': 65,
            'hacker': 60,
            'picklock #2': 55,
            'max': 80,
            'fuzzy': false
        },
        'break the bank': {
            'thief #1': 50,
            'thief #2': 65,
            'muscle #1': 60,
            'muscle #2': 60,
            'muscle #3': 65,
            'robber': 60,
            'max': 80,
            'fuzzy': true
        },
        'clinical precision': {
            'cleaner': 65,
            'cat burglar': 65,
            'imitator': 65,
            'assassin': 65,
            'max': 80,
            'fuzzy': true
        }
    };

    const requestIdleCallback = window.requestIdleCallback || function(callback) {
        return setTimeout(callback, 200);
    };

    function checkUser() {
        let user = document.querySelectorAll('.menu-info-row___YG31c > a');

        if (user.length) {
            let userId = user[0].getAttribute('href').substring(user[0].getAttribute('href').indexOf('=') + 1);

            return {'name': user[0].textContent, 'id': userId};
        } else {
            return {'name': 'POS PDA HTML', 'id': '-1'};
        }
    }

    function processScenario(element) {
        const ocName = element.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = element.querySelectorAll('.wrapper___Lpz_D');

        const reqs = ocName.toLowerCase() in ocReqs ? ocReqs[ocName.toLowerCase()] : ocReqs.default;

        slots.forEach( slot => {
            const slotFiberKey = Object.keys(slot).find(key => key.startsWith("__reactFiber$"));
            if (!slotFiberKey) return;

            let successChance = parseInt(slot.querySelector('.successChance___ddHsR').innerText.trim());
            let displayName = slot.querySelector('.title___UqFNy').innerText.trim().toLowerCase();

            let openSlot = slot.querySelector('.slotBody___oxizq button').innerText?.trim().toLowerCase()
            if (openSlot) {
                slot.classList.add(openSlot);
            }

            if ( ocName.toLowerCase() in ocReqs ) {
                if (successChance < reqs[displayName]) {
                    slot.classList.add('badRange');
                    slot.classList.remove('goodRange');
                    slot.classList.remove('mehRange');
                    if (openSlot) {
                        let disappointed = doBetter();
                        if (disappointed) {
                            slot.appendChild(disappointed);
                        }
                    }
                } else if (successChance >= reqs['max']) {
                    slot.classList.remove('badRange');
                    slot.classList.remove('goodRange');
                    slot.classList.add('mehRange');
                } else {
                    slot.classList.remove('badRange');
                    slot.classList.add('goodRange');
                    slot.classList.remove('mehRange');
                }

                // special meh place
                if (reqs.fuzzy && successChance > ocReqs['default'].min && successChance < reqs[displayName]) {
                    slot.classList.remove('badRange');
                    slot.classList.remove('goodRange');
                    slot.classList.add('mehRange');
                }
            } else {
                if (successChance < reqs['min']) {
                    slot.classList.add('badRange');
                    slot.classList.remove('goodRange');
                    slot.classList.remove('mehRange');
                    if (openSlot) {
                        let disappointed = doBetter();
                        if (disappointed) {
                            slot.appendChild(disappointed);
                        }
                    }
                } else if (successChance >= reqs['max']) {
                    slot.classList.remove('badRange');
                    slot.classList.remove('goodRange');
                    slot.classList.add('mehRange');
                } else {
                    slot.classList.remove('badRange');
                    slot.classList.add('goodRange');
                    slot.classList.remove('mehRange');
                }
            }
        });
    }

    function doBetter() {
        let user = checkUser();
        if (user.id == '2637921') {
            let cover = document.createElement('a');
            cover.classList.add('do-better');
            cover.addEventListener('click', () => {
                alert('You\'ll be good enough to do this some day, but for now you should try something you are actually ready for. You can do it Red!');
            });
            return(cover);
        }
    }

    function doOnHashChange() {
        if (processing) return;
        processing = true;

        requestIdleCallback(() => {
            try {
                const ocElements = document.querySelectorAll('.wrapper___U2Ap7:not(.role-processed)');
                ocElements.forEach(element => {
                    element.classList.add('role-processed');
                    processScenario(element);
                });
            } finally {
                processing = false;
            }
        });
    }

    function observeButtonContainer() {
        let buttonContainer = document.querySelector('.buttonsContainer___aClaa');
        if (buttonContainer) {
            buttonContainer.addEventListener('click', () => {
                document.querySelectorAll('.wrapper___U2Ap7').forEach(el => {
                    el.classList.remove('role-processed');
                });
                doOnHashChange();
            });
        } else {
            setTimeout(observeButtonContainer, 500);
        }
    }

    function setupHashChangeListener() {
        window.addEventListener('hashchange', () => {
            document.querySelectorAll('.wrapper___U2Ap7.role-processed').forEach(el => {
                el.classList.remove('role-processed');
            });
            doOnHashChange();
        });
    }

    function initializeScript() {
        if (globalObserver) globalObserver.disconnect();

        const targetNode = document.querySelector('#factionCrimes-root') || document.body;

        globalObserver = new MutationObserver(debounce(() => {
            if (!document.querySelector('.wrapper___U2Ap7')) return;
            doOnHashChange();
        }, debounceDelay));

        globalObserver.observe(targetNode, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        doOnHashChange();
        observeButtonContainer();
        setupHashChangeListener();

        document.head.insertAdjacentHTML("beforeend", `<style>
                .badRange {
                    border: .125rem dashed #ff00ff;
                    position: relative;
                }

                .badRange::after {
                    content: '';
                    pointer-events: none;
                    border-radius: 5px;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    background-image: repeating-linear-gradient(45deg, rgba(187, 0, 0, .15) 0, rgba(187, 0, 0, .15) .75rem, rgba(187, 0, 0, 0) .75rem, rgba(187, 0, 0, 0) 1.5rem);
                }

                .contentLayer___IYFdz:has(.goodRange.join) {
                    background-color: rgba(0, 238, 0, .05);
                }

                .goodRange {
                    position: relative;
                }

                .goodRange::after {
                    content: '';
                    pointer-events: none;
                    border-radius: 5px;
                    position: absolute;
                    bottom: 4px;
                    left: 0;
                    right: 0;
                    top: 0;
                    background-color: rgba(0, 228, 0, .1);
                }

                .mehRange {
                    position: relative;
                }

                .mehRange::after {
                    content: '';
                    pointer-events: none;
                    border-radius: 5px;
                    position: absolute;
                    bottom: 4px;
                    left: 0;
                    right: 0;
                    top: 0;
                    background-image: repeating-linear-gradient(90deg, rgba(235, 185, 0, .1) 0, rgba(235, 185, 0, .1), .75rem, rgba(235, 185, 0, 0), .75rem, rgba(235, 185, 0, 0) 1.5rem);
                }

                .wrapper___Lpz_D {
                    position: relative;
                }

                .do-better {
                    background-color: rgba(0, 0, 0, .01);
                    bottom: 0;
                    left: 0;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            </style>`);
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    if (document.readyState === 'complete') {
        initializeScript();
    } else {
        window.addEventListener('load', initializeScript);
    }
})();