// ==UserScript==
// @name         OC Role Display - 39th Reapers Edition
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  Adding minimum and maximum CPR requirements in accordance with 39th Street Reapers OC 2.0 requirements
// @author       Verboten, ChatGPT, based on work originally done by Allenone, Darrelia
// @license      MIT
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/548088/OC%20Role%20Display%20-%2039th%20Reapers%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/548088/OC%20Role%20Display%20-%2039th%20Reapers%20Edition.meta.js
// ==/UserScript==
(async function() {
    'use strict';

    // Inject styles
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes pulseBorder {
        0%   { box-shadow: 0 0 8px var(--pulse-color, red); }
        50%  { box-shadow: 0 0 18px var(--pulse-color, red); }
        100% { box-shadow: 0 0 8px var(--pulse-color, red); }
    }
    .pulse-border { animation: pulseBorder 1s infinite; }

    .status-red {
        --pulse-color: rgba(255,0,0,0.7);
        background-color: rgba(153, 0, 0, 0.6);
        outline: 4px solid red;
    }
    .status-green {
        --pulse-color: rgba(23,116,19,0.7);
        background-color: rgba(23, 116, 19, 0.6);
        outline: none;
    }
    .status-brightgreen {
        --pulse-color: rgba(33,166,28,0.7);
        background-color: rgba(33, 166, 28, 0.6);
        outline: 4px solid #21a61c;
    }
    `;
    document.head.appendChild(style);

    // Defaults
    const defaultLevel6 = 60;
    const defaultLevel5 = 60;
    const defaultLevel4 = 60;
    const defaultLevel2 = 30;
    const defaultDecline = 700;

    // === Requirements ===
    const ocRoles = [
        {
            OCName: "Blast From The Past",
            Positions: {
                "PICKLOCK #1": 60,
                "HACKER": 60,
                "ENGINEER": 62,
                "BOMBER": 62,
                "MUSCLE": 62,
                "PICKLOCK #2": 50
            }
        },{
            OCName: "Stacking the Deck",
            Positions: {
                "HACKER": 60,
                "IMITATOR": 60,
                "CAT BURGLAR": 60,
                "DRIVER": 55
            }
        },
        {
            OCName: "Ace in the Hole",
            Positions: {
                "HACKER": 60,
                "DRIVER": 55,
                "MUSCLE #1": 60,
                "IMITATOR": 60,
                "MUSCLE #2": 60
            }
        },
        {
            OCName: "Break the Bank",
            Positions: {
                "ROBBER": 60,
                "MUSCLE #1": 60,
                "THIEF #1": 50,
                "MUSCLE #2": 60,
                "MUSCLE #3": 62,
                "THIEF #2": 62
            }
        },
        {
            OCName: "Clinical Precision",
            Positions: {
                "ASSASSIN": 60,
                "CAT BURGLAR": 65,
                "CLEANER": 65,
                "IMITATOR": 65,
            }
        },
        {
            OCName: "Stage Fright",
            Positions: {
                "SNIPER": 60,
                "ENFORCER": 60,
                "LOOKOUT": 60,
                "MUSCLE #1": 10,
                "MUSCLE #2": 10,
                "MUSCLE #3": 10,
            }
        },
        {
            OCName: "Gaslight The Way",
            Positions: {
                "IMITATOR #1": 60,
                "IMITATOR #2": 60,
                "IMITATOR #3": 60,
                "LOOTER #1": 60,
                "LOOTER #2": 5,
                "LOOTER #3": 60,
            }
        },
        {
            OCName: "Bidding War",
            Positions: {
                "ROBBER #1": 50,
                "ROBBER #2": 60,
                "ROBBER #3": 60,
                "BOMBER #1": 50,
                "BOMBER #2": 60,
                "DRIVER": 60,
            }
        },
        { OCName: "Honey Trap", Positions: `default_${defaultLevel6}` },
        { OCName: "Leave No Trace", Positions: `default_${defaultLevel5}` },
        { OCName: "Snow Blind", Positions: `default_${defaultLevel4}` },
        { OCName: "Pet Project", Positions: `default_${defaultLevel2}` },
        { OCName: "Cash Me If You Can", Positions: `default_${defaultLevel2}` },
        { OCName: "Smoke and Wing Mirrors", Positions: `default_${defaultLevel2}` },
        { OCName: "Market Forces", Positions: `default_${defaultLevel2}` },
        { OCName: "Mob Mentality", Positions: `default_${defaultLevel2}` },
        { OCName: "Best of the Lot", Positions: `default_${defaultLevel2}` },
        { OCName: "No Reserve", Positions: `default_${defaultLevel5}` },
        { OCName: "Sneaky Git Grab", Positions: `default_${defaultLevel5}` },
    ];

    function processScenario(panel) {
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        Array.from(slots).forEach(slot => {
            const roleElem   = slot.querySelector('.title___UqFNy');
            const chanceElem = slot.querySelector('.successChance___ddHsR');
            if (!roleElem || !chanceElem) return;

            const rawRole       = roleElem.innerText.trim();
            const successChance = parseInt(chanceElem.textContent.trim(), 10) || 0;
            const joinBtn       = slot.querySelector("button[class^='torn-btn joinButton']");
            const honorTexts    = slot.querySelectorAll('.honor-text');
            const userName      = honorTexts.length > 1 ? honorTexts[1].textContent.trim() : null;

            const ocData = ocRoles.find(o => o.OCName.toLowerCase() === ocName.toLowerCase());
            let required = null;
            let isMax = false;

            if (ocData) {
                if (typeof ocData.Positions === 'string' && ocData.Positions.startsWith('default_')) {
                    required = parseInt(ocData.Positions.split('_')[1], 10);
                } else if (typeof ocData.Positions === 'object' && ocData.Positions[rawRole] !== undefined) {
                    if (typeof ocData.Positions[rawRole] === "object" && ocData.Positions[rawRole].max) {
                        required = ocData.Positions[rawRole].max;
                        isMax = true;
                    } else {
                        required = ocData.Positions[rawRole];
                    }
                }
            }
            if (required === null) return;

            slot.classList.remove('status-red', 'status-green', 'status-brightgreen', 'pulse-border');
            slot.style.boxShadow = '';
            slot.style.outline = '';
            slot.style.outlineOffset = '';

            let valid = true;
            if (isMax) {
                if (successChance > required) valid = false;
            } else {
                if (successChance < required) valid = false;
            }

            if (userName) { // occupied slot
                slot.classList.add(valid ? 'status-green' : 'status-red');
                if (!valid) slot.classList.add('pulse-border'); // pulse only for invalid occupants
            } else { // empty slot
                slot.style.backgroundColor = valid ? 'rgba(23, 116, 19, 0.6)' : 'rgba(153, 0, 0, 0.6)'; // green or red background
                slot.classList.remove('status-red', 'status-green', 'pulse-border'); // remove any class that might add outlines
                slot.style.outline = ''; // ensure no outline
            }

            if (joinBtn) {
                if (valid) joinBtn.removeAttribute('disabled');
                else joinBtn.setAttribute('disabled', '');
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches('.wrapper___U2Ap7')) processScenario(node);
                else node.querySelectorAll?.('.wrapper___U2Ap7').forEach(processScenario);
            });
        });
    });

    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(processScenario);
    });
})();