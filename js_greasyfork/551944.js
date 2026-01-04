// ==UserScript==
// @name         OC Role Display - CHR (OC 2.0 Faction Helper)
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  Color Codes OC 2.0 positions, adds eligibility text, and visually disables ineligible join buttons.
// @author       colaman32 (Modified by Gemini)
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551944/OC%20Role%20Display%20-%20CHR%20%28OC%2020%20Faction%20Helper%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551944/OC%20Role%20Display%20-%20CHR%20%28OC%2020%20Faction%20Helper%29.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    // Inject pulse animation and disabled button style
    const style = document.createElement('style');
    style.innerHTML = `
    @keyframes pulseRed {
        0% { box-shadow: 0 0 8px red; }
        50% { box-shadow: 0 0 18px red; }
        100% { box-shadow: 0 0 8px red; }
    }
    .pulse-border-red {
        animation: pulseRed 1s infinite;
    }
    /* Style for disabled join button when user is ineligible */
    .torn-btn.joinButton:disabled {
        background-color: #6c757d !important; /* Gray background */
        border-color: #6c757d !important;
        cursor: not-allowed;
        opacity: 0.6; /* Slight fade */
    }
    `;
    document.head.appendChild(style);


    // Define the default minimum success chance for each tier of OC
    const defaultLevel6 = 70; // Level 6 OCs (Bidding War, Honey Trap)
    const defaultLevel5 = 65; // Level 5 OCs (Guardian Angels, Leave No Trace, Counter Offer, No Reserve)
    const defaultLevel4 = 65; // Level 4 OCs (Stage Fright, Snow Blind)
    const defaultLevel3 = 65; // Level 3 OCs (Gaslight the Way, Smoke and Wing Mirrors, Market Forces)
    const defaultLevel2 = 65; // Level 1-2 OCs (Mob Mentality, Pet Project, Cash Me If You Can, Best of the Lot)


    // --- OC 2.0 SCENARIO DEFINITIONS ---
    const ocRoles = [
        // HIGH-LEVEL OCS WITH CUSTOM ROLE REQUIREMENTS
        {
            OCName: "Blast from the Past", // Level 7 (Advanced)
            Positions: {
                "PICKLOCK #1": 65,
                "HACKER": 65,
                "ENGINEER": 72,
                "BOMBER": 72,
                "MUSCLE": 75,
                "PICKLOCK #2": 0
            }
        },{
            OCName: "Stacking the Deck", // Level 8 (Elaborate)
            Positions: {
                "HACKER": 68,
                "IMITATOR": 70,
                "CAT BURGLAR": 70,
                "DRIVER": 60
            }
        },{
            OCName: "Clinical Precision", // Level 10 (Elaborate)
            Positions: {
                "CLEANER": 70,
                "IMITATOR": 73,
                "CAT BURGLAR": 69,
                "ASSASSIN": 68
            }
        },
        {
            OCName: "Ace in the Hole", // Level 9 (Elaborate)
            Positions: {
                "HACKER": 65,
                "DRIVER": 50,
                "MUSCLE #1": 63,
                "IMITATOR": 65,
                "MUSCLE #2": 63
            }
        },
        {
            OCName: "Break the Bank", // Level 8 (Advanced)
            Positions: {
                "ROBBER": 65,
                "MUSCLE #1": 65,
                "THIEF #1": 60,
                "MUSCLE #2": 65,
                "MUSCLE #3": 67,
                "THIEF #2": 67
            }
        },
        // MID-LEVEL OCS (USING DEFAULT MINIMUMS)
        {
            OCName: "Bidding War", // Level 6 (Intermediate)
            Positions: `default_${defaultLevel6}` // 70% min for all roles
        },
        {
            OCName: "Honey Trap", // Level 6 (Intermediate)
            Positions: `default_${defaultLevel6}` // 70% min for all roles
        },
        {
            OCName: "Guardian Angels", // Level 5 (Intermediate)
            Positions: `default_${defaultLevel5}` // 65% min for all roles
        },
        {
            OCName: "Leave No Trace", // Level 5 (Intermediate)
            Positions: `default_${defaultLevel5}` // 65% min for all roles
        },
        {
            OCName: "Counter Offer", // Level 5 (Intermediate)
            Positions: `default_${defaultLevel5}` // 65% min for all roles
        },
        {
            OCName: "No Reserve", // Level 5 (Intermediate)
            Positions: `default_${defaultLevel5}` // 65% min for all roles
        },
        {
            OCName: "Stage Fright", // Level 4 (Simple)
            Positions: `default_${defaultLevel4}` // 65% min for all roles
        }, {
            OCName: "Snow Blind", // Level 4 (Simple)
            Positions: `default_${defaultLevel4}` // 65% min for all roles
        },
        {
            OCName: "Gaslight the Way", // Level 3 (Simple)
            Positions: `default_${defaultLevel3}` // 65% min for all roles
        },
        {
            OCName: "Smoke and Wing Mirrors", // Level 3 (Simple)
            Positions: `default_${defaultLevel3}` // 65% min for all roles
        },
        {
            OCName: "Market Forces", // Level 3 (Simple)
            Positions: `default_${defaultLevel3}` // 65% min for all roles
        },
        // LOW-LEVEL OCS (USING DEFAULT MINIMUMS)
        {
            OCName: "Best of the Lot", // Level 2 (Introductory)
            Positions: `default_${defaultLevel2}` // 65% min for all roles
        },
        {
            OCName: "Cash Me If You Can", // Level 2 (Introductory)
            Positions: `default_${defaultLevel2}` // 65% min for all roles
        },
        {
            OCName: "Mob Mentality", // Level 1 (Introductory)
            Positions: `default_${defaultLevel2}` // 65% min for all roles
        },
        {
            OCName: "Pet Project", // Level 1 (Introductory)
            Positions: `default_${defaultLevel2}` // 65% min for all roles
        }
    ];
    // --- END OC 2.0 SCENARIO DEFINITIONS ---


    const roleMappings = {};

    function processScenario(panel) {
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        Array.from(slots).forEach(slot => {
            // get raw role text and chance
            const roleElem      = slot.querySelector('.title___UqFNy');
            const chanceElem    = slot.querySelector('.successChance___ddHsR');
            if (!roleElem || !chanceElem) return;

            const rawRole       = roleElem.innerText.trim();
            const successChance = parseInt(chanceElem.textContent.trim(), 10) || 0;
            const joinBtn       = slot.querySelector("button[class^='torn-btn joinButton']");

            // find thresholds
            const ocData = ocRoles.find(o => o.OCName.toLowerCase() === ocName.toLowerCase());
            let required = null;
            if (ocData) {
                if (typeof ocData.Positions === 'string' && ocData.Positions.startsWith('default_')) {
                    required = parseInt(ocData.Positions.split('_')[1], 10);
                } else if (typeof ocData.Positions === 'object' && ocData.Positions[rawRole] !== undefined) {
                    required = ocData.Positions[rawRole];
                }
            }
            if (required === null) return; // skip unmapped slots

            // detect assigned player
            const honorTexts = slot.querySelectorAll('.honor-text');
            const userName   = honorTexts.length > 1 ? honorTexts[1].textContent.trim() : null;


            // --- TEXT INDICATOR LOGIC ---
            const indicatorDiv = document.createElement('div');
            indicatorDiv.style.fontWeight = 'bold';
            indicatorDiv.style.marginTop = '4px';
            indicatorDiv.style.fontSize = '11px';

            if (!userName) { // Only show indicator if the slot is empty
                if (successChance >= required) {
                    indicatorDiv.style.color = 'white'; // High contrast against the colored background
                    indicatorDiv.textContent = `✅ ELIGIBLE (Min: ${required}%)`;
                } else {
                    indicatorDiv.style.color = 'gray'; // High contrast against the colored background
                    indicatorDiv.textContent = `❌ BELOW MIN (Req: ${required}%)`;
                }
                slot.appendChild(indicatorDiv);
            }
            // --- END TEXT INDICATOR LOGIC ---


            // color & disable logic (applied to the slot wrapper)
            if (!userName) {
                slot.style.backgroundColor = successChance < required
                    ? '#ff000061'  // redish
                    : '#21a61c61'; // greenish
                if (joinBtn && successChance < required) {
                    // Button is disabled and will be styled grey by the CSS rule added above
                    joinBtn.setAttribute('disabled', '');
                } else if (joinBtn && successChance >= required) {
                    // Ensure button is not disabled if eligible
                    joinBtn.removeAttribute('disabled');
                }
            } else if (successChance < required) {
                // Already assigned player is below minimum (pulsing red border)
                slot.classList.add('pulse-border-red');
                slot.style.outline = '4px solid red';
                slot.style.outlineOffset = '0px';
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                // Check if the node itself is a crime panel
                if (node.matches('.wrapper___U2Ap7')) {
                    processScenario(node);
                } else {
                    // Check for crime panels within the added node
                    node.querySelectorAll?.('.wrapper___U2Ap7').forEach(processScenario);
                }
            });
        });
    });

    // Start observing the main content area for new crime panels
    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    // Process any crime panels already loaded on page load
    window.addEventListener('load', () => {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(processScenario);
    });

})();