// ==UserScript==
// @name         OC Role Display + Weights 
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  CPR requirement status indicators + weight percentages from tornprobability.com API
// @license      MIT
// @match        https://www.torn.com/factions.php?step=your*
// @match        https://www.torn.com/organizedcrimes.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/562668/OC%20Role%20Display%20%2B%20Weights.user.js
// @updateURL https://update.greasyfork.org/scripts/562668/OC%20Role%20Display%20%2B%20Weights.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const API_URL = "https://tornprobability.com:3000/api/GetRoleWeights";
    let weightData = {};

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

        .oc-weight-box {
            margin-top: 6px;
            padding: 6px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 6px;
            background: rgba(255,255,255,0.03);
        }
        .oc-weight-box .label {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .05em;
            opacity: .8;
            padding-bottom: 3px;
            margin-bottom: 4px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .oc-weight-box .value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            margin-top: 2px;
        }
    `;
    document.head.appendChild(style);

    // CPR Defaults
    const defaultLevel6 = 60;
    const defaultLevel5 = 60;
    const defaultLevel4 = 60;
    const defaultLevel2 = 30;

    // CPR Requirements
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
        },
        {
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

    // Normalize strings for matching
    function normalize(str) {
        return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    // Process a single OC panel for CPR status colors
    function processScenario(panel) {
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "Unknown";
        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        Array.from(slots).forEach(slot => {
            const roleElem = slot.querySelector('.title___UqFNy');
            const chanceElem = slot.querySelector('.successChance___ddHsR');
            if (!roleElem || !chanceElem) return;

            const rawRole = roleElem.innerText.trim();
            const successChance = parseInt(chanceElem.textContent.trim(), 10) || 0;
            const joinBtn = slot.querySelector("button[class^='torn-btn joinButton']");
            const honorTexts = slot.querySelectorAll('.honor-text');
            const userName = honorTexts.length > 1 ? honorTexts[1].textContent.trim() : null;

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

            if (userName) {
                slot.classList.add(valid ? 'status-green' : 'status-red');
                if (!valid) slot.classList.add('pulse-border');
            } else {
                slot.style.backgroundColor = valid ? 'rgba(23, 116, 19, 0.6)' : 'rgba(153, 0, 0, 0.6)';
                slot.classList.remove('status-red', 'status-green', 'pulse-border');
                slot.style.outline = '';
            }

            if (joinBtn) {
                if (valid) joinBtn.removeAttribute('disabled');
                else joinBtn.setAttribute('disabled', '');
            }
        });
    }

    // Add weight boxes to a single OC panel
    function addWeightBoxes(panel) {
        const ocNameRaw = panel.querySelector('.panelTitle___aoGuV')?.textContent.trim();
        if (!ocNameRaw) return;

        const ocKey = normalize(ocNameRaw);
        const ocWeights = weightData[ocKey];
        if (!ocWeights) return;

        const roles = panel.querySelectorAll('.wrapper___Lpz_D');
        roles.forEach(role => {
            if (role.querySelector('.oc-weight-box')) return;

            const roleNameRaw = (role.querySelector('.title___UqFNy')?.textContent || "").trim();
            const roleKey = normalize(roleNameRaw);
            const weight = ocWeights[roleKey];
            if (weight == null) return;

            const box = document.createElement('div');
            box.className = 'oc-weight-box';
            box.innerHTML = `
                <span class="label">Weight</span>
                <span class="value">${weight.toFixed(1)}%</span>
            `;
            role.appendChild(box);
        });
    }

    // Process all panels on the page
    function processAllPanels() {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(panel => {
            processScenario(panel);
            addWeightBoxes(panel);
        });
    }

    // Observe DOM changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches('.wrapper___U2Ap7')) {
                    processScenario(node);
                    addWeightBoxes(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('.wrapper___U2Ap7').forEach(panel => {
                        processScenario(panel);
                        addWeightBoxes(panel);
                    });
                }
            });
        });
    });

    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    // Initial page load
    window.addEventListener('load', processAllPanels);

    // Fetch weight data from API
    GM.xmlHttpRequest({
        method: "GET",
        url: API_URL,
        onload: function (response) {
            try {
                const data = JSON.parse(response.responseText);
                weightData = {};
                for (const [ocName, roles] of Object.entries(data)) {
                    const ocKey = normalize(ocName);
                    weightData[ocKey] = {};
                    for (const [roleName, value] of Object.entries(roles)) {
                        weightData[ocKey][normalize(roleName)] = value;
                    }
                }
                processAllPanels();
            } catch (err) {
                console.error("[OC Combined] Failed to parse API response:", err);
            }
        },
        onerror: function (err) {
            console.error("[OC Combined] API request failed:", err);
        }
    });
})();