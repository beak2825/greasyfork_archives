// ==UserScript==
// @name         Blood Money CPR Monitor
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  adding notes about the role weight to OCs, marking slots where completely insane CPR requirements are not met
// @author       Nemokrael [2664542]
// @license      MIT
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      tornprobability.com
// @downloadURL https://update.greasyfork.org/scripts/554797/Blood%20Money%20CPR%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/554797/Blood%20Money%20CPR%20Monitor.meta.js
// ==/UserScript==


const percentages = {
    "Crane Reaction": {"Muscle #1": {"min_cpr": 50},"Muscle #2": {"min_cpr": 50},"Engineer": {"min_cpr": 50},"Bomber": {"min_cpr": 50},"Lookout": {"min_cpr": 50},"Sniper": {"min_cpr": 50},},
    "Gone Fission": {"Bomber": {"min_cpr": 60},"Hijacker": {"min_cpr": 60},"Engineer": {"min_cpr": 60},"Imitator": {"min_cpr": 60},"Pickpocket": {"min_cpr": 50},},
    "Ace in the Hole": {"Hacker": {"min_cpr": 60},"Imitator": {"min_cpr": 60},"Muscle #2": {"min_cpr": 60},"Muscle #1": {"min_cpr": 60},"Driver": {"min_cpr": 50},},
    "Stacking the Deck": {"Imitator": {"min_cpr": 60},"Hacker": {"min_cpr": 60},"Cat Burglar": {"min_cpr": 60},"Driver": {"min_cpr": 50},},
    "Clinical Precision": {"Imitator": {"min_cpr": 60},"Cleaner": {"min_cpr": 60},"Cat Burglar": {"min_cpr": 60},"Assassin": {"min_cpr": 60},},
    "Break the Bank": {"Muscle #3": {"min_cpr": 60},"Thief #2": {"min_cpr": 60},"Muscle #1": {"min_cpr": 60},"Robber": {"min_cpr": 60},"Muscle #2": {"min_cpr": 60},"Thief #1": {"min_cpr": 60},},
    "Blast from the Past": {"Muscle": {"min_cpr": 70},"Engineer": {"min_cpr": 70},"Bomber": {"min_cpr": 70},"Picklock #1": {"min_cpr": 70},"Hacker": {"min_cpr": 70},"Picklock #2": {"min_cpr": 70},},
    "Honey Trap": {"Muscle #2": {"min_cpr": 70},"Muscle #1": {"min_cpr": 70},"Enforcer": {"min_cpr": 70},},
    "Bidding War": {"Robber #3": {"min_cpr": 70},"Robber #2": {"min_cpr": 70},"Bomber #2": {"min_cpr": 70},"Driver": {"min_cpr": 70},"Bomber #1": {"min_cpr": 70},"Robber #1": {"min_cpr": 70},},
    "Leave No Trace": {"Imitator": {"min_cpr": 70},"Negotiator": {"min_cpr": 70},"Techie": {"min_cpr": 70},},
    "Counter Offer": {"Robber": {"min_cpr": 70},"Engineer": {"min_cpr": 70},"Picklock": {"min_cpr": 70},"Hacker": {"min_cpr": 70},"Looter": {"min_cpr": 70},},
    "No Reserve": {"Techie": {"min_cpr": 70},"Engineer": {"min_cpr": 70},"Car Thief": {"min_cpr": 70},},
    "Stage Fright": {"Sniper": {"min_cpr": 70},"Muscle #1": {"min_cpr": 70},"Enforcer": {"min_cpr": 70},"Muscle #3": {"min_cpr": 70},"Lookout": {"min_cpr": 70},"Muscle #2": {"min_cpr": 70},},
    "Snow Blind": {"Hustler": {"min_cpr": 70},"Imitator": {"min_cpr": 70},"Muscle #1": {"min_cpr": 70},"Muscle #2": {"min_cpr": 70},},
    "Gaslight the Way": {"Imitator #3": {"min_cpr": 70},"Imitator #2": {"min_cpr": 70},"Looter #3": {"min_cpr": 70},"Imitator #1": {"min_cpr": 70},"Looter #1": {"min_cpr": 70},"Looter #2": {"min_cpr": 70},},
    "Market Forces": {"Enforcer": {"min_cpr": 70},"Negotiator": {"min_cpr": 70},"Muscle": {"min_cpr": 70},"Lookout": {"min_cpr": 70},"Arsonist": {"min_cpr": 70},},
    "Smoke and Wing Mirrors": {"Car Thief": {"min_cpr": 70},"Imitator": {"min_cpr": 70},"Hustler #2": {"min_cpr": 70},"Hustler #1": {"min_cpr": 70},},
    "Cash Me If You Can": {"Thief #1": {"min_cpr": 70},"Lookout": {"min_cpr": 70},"Thief #2": {"min_cpr": 70},},
    "Mob Mentality": {"Looter #1": {"min_cpr": 0},"Looter #2": {"min_cpr": 0},"Looter #4": {"min_cpr": 0},"Looter #3": {"min_cpr": 0},}};

class FactionCrime {
    constructor(panel, title, oc_id, slots) {
        this.panel = panel;
        this.title = title;
        this.oc_id = oc_id;
        this.slots = slots;
    }
}

class Slot {
    constructor(panel, title) {
        this.panel = panel;
        this.header = panel.getElementsByClassName('slotHeader___K2BS_')[0];
        this.rolename = panel.getElementsByClassName('title___UqFNy')[0].innerHTML;
        this.cpr = panel.getElementsByClassName('successChance___ddHsR')[0].innerHTML;
        this.min_cpr = 0;
        if (title in percentages && this.rolename in percentages[title]) {
            this.min_cpr = percentages[title][this.rolename].min_cpr;
        }
        this.slot_used = (panel.getElementsByClassName('honor-text') > 0);
    }
}

(function() {
    'use strict';

    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const isTornPDA = typeof window.flutter_inappwebview !== 'undefined';
    let scenarioData = {};
    let roles = {};
    const factioncrimes = [];

    // HTTP request function
    const xmlhttpRequest = isTornPDA ? (details) => {
        window.flutter_inappwebview.callHandler('PDA_httpPost', details.url, details.headers, details.data)
            .then(response => {
            details.onload({
                status: response.status,
                responseText: response.data
            });
        })
        .catch(err => details.onerror(err));
    }
    : GM_xmlhttpRequest;

    function log(...args) {
        console.log('[OC Monitor]', ...args);
    }

    function logError(...args) {
        console.error('[OC Monitor]', ...args);
    }

    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    };
    let observer;


    async function callOCAPI(endpoint, data = null, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            xmlhttpRequest({
                method: data ? 'POST' : 'GET',
                url: `https://tornprobability.com:3000/${endpoint}`,
                headers: data ? { 'Content-Type': 'application/json' } : {},
                data: data ? JSON.stringify(data) : null,
                signal: controller.signal,
                onload: (response) => {
                    clearTimeout(timeoutId);
                    try {
                        const result = JSON.parse(response.responseText);
                        if (response.status >= 200 && response.status < 300) {
                            resolve(result);
                        } else {
                            reject(new Error(result.error || 'API error'));
                        }
                    } catch (err) {
                        reject(err);
                    }
                },
                onerror: (err) => reject(err)
            });
        });
    }

    function injectWeightPanel(element, weight, cpr, min_cpr) {
        const displayWeight = element.querySelector('.slot-weight-display') || document.createElement('p');
        displayWeight.className = 'title___UqFNy slot-weight-display';
        displayWeight.textContent = `W: ${weight}%`;

        const displayRequirement = element.querySelector('.slot-requirement-display') || document.createElement('p');
        displayRequirement.className = 'title___UqFNy slot-requirement-display';
        displayRequirement.textContent = `R: ${cpr}/${min_cpr}`;

        if (Number(min_cpr) > Number(cpr)) {
            element.style.border = "medium solid #FF0000";
            displayRequirement.style.color = "#FF0000"
            let joinButton = element.querySelector('.joinButton___Ikoyy');
            if (joinButton) {
                joinButton.className += " disabled";
            }
        } else {
            displayRequirement.style.color = "#00FF00"
        }

        element.querySelector('.slotHeader___K2BS_')?.before(displayWeight);
        element.querySelector('.slotHeader___K2BS_')?.before(displayRequirement);
    }
    function injectSummaryPanel(element, oc_id, chance) {
        const display = element.querySelector('.oc-summary-display') || document.createElement('p');
        display.className = 'title___UqFNy oc-summary-display';
        if (chance) {
            let border = "medium solid #00FF00"
            if (chance < 0.8) {
                border = "medium solid #55FF00";
            }
            if (chance < 0.7) {
                border = "medium solid #FFAA00";
            }
            if (chance < 0.6) {
                border = "medium solid #FF0000";
            }
            element.style.border = border;
            display.textContent = `OC-ID: ${oc_id} --> Success Chance: ${(chance*100).toFixed(2)}%`;
        }
        else {
            display.textContent = `OC-ID: ${oc_id}`;
        }
        element.querySelector('.panelTitle___aoGuV')?.after(display);
    }

    async function processOCElement(element) {
        let title = element.getElementsByClassName('panelTitle___aoGuV')[0].innerText;

        if (!(title in scenarioData)) {
            log('Unsupported OC:', title);
            return;
        }
/*        if (!(title in percentages)) {
            log('Unsupported OC:', title);
            return;
        }
*/
        let oc_id = element.getAttribute("data-oc-id");

        var fc = new FactionCrime(element, title, oc_id, []);

        const slots = element.getElementsByClassName('wrapper___Lpz_D');
        for (const slot of slots) {
            fc.slots.push(new Slot(slot, title));
        }
        factioncrimes.push(fc);

        const parameters = [];
        for (const slot of fc.slots) {
            parameters.push(Number(slot.cpr));
            let weight = 0;
/*            if (fc.title in percentages && slot.rolename in percentages[fc.title]) {
                weight = percentages[fc.title][slot.rolename].weight;
            }
*/
            if (!(fc.title in roles)) {
                continue;
            }
            for (const [r, rvalue] of Object.entries(roles[fc.title])) {
                if (slot.rolename.replaceAll("#", "") == rvalue.name) {
                    weight = rvalue.weight.toFixed(2);
                }
            }
            injectWeightPanel(slot.panel, weight, slot.cpr, slot.min_cpr);
        }

        const result = await callOCAPI('api/CalculateSuccess', {
            scenario: fc.title,
            parameters
        });

        if (result?.successChance) {
            injectSummaryPanel(element, oc_id, result.successChance);
        }
        else {
            injectSummaryPanel(element, oc_id, null);
        }
    }

    function processOCs() {
        document.querySelectorAll('.wrapper___U2Ap7:not(.oc-processed)').forEach(element => {
            element.classList.add('oc-processed');
            processOCElement(element);
        });
    }

    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    async function fetchScenarioData() {
        try {
            const [supportedScenarios, roleMappings, roleWeights] = await Promise.all([
                callOCAPI('api/GetSupportedScenarios'),
                callOCAPI('api/GetRoleNames'),
                callOCAPI('api/GetRoleWeights')
            ]);

            for (var [key, value] of Object.entries(roleMappings)) {
                const lookup = titleCase(key).replaceAll(" ", "")
                if (roleWeights[lookup]) {
                    for (var [vkey, v] of Object.entries(value)) {
                        const tmp = v.replaceAll(" ", "")
                        if (roleWeights[lookup][tmp]) {
                            roleMappings[key][vkey] = {
                                name: v,
                                weight: roleWeights[lookup][tmp]
                            }
                        }
                    }
                }
            }
            roles = roleMappings;

            scenarioData = supportedScenarios.reduce((acc, scenario) => {
                const roles = roleMappings[scenario.name];
                if (roles) {
                    acc[scenario.name] = {
                        paramCount: scenario.parameters,
                        paramOrder: Object.keys(roles)
                            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
                            .slice(0, scenario.parameters)
                    };
                }
                return acc;
            }, {});

            log('Loaded scenario data:', scenarioData);
        } catch (error) {
            logError('Failed to initialize scenario data:', error);
        }
    }

    async function initialize() {
        await fetchScenarioData();

        const rootNode = document.querySelector('#factionCrimes-root, #faction-crimes-root') || document.body;
        observer = new MutationObserver(processOCs);
        observer.observe(rootNode, observerConfig);

        document.querySelector('.buttonsContainer___aClaa')?.addEventListener('click', () => {
            document.querySelectorAll('.wrapper___U2Ap7.oc-processed').forEach(el => {
                el.classList.remove('oc-processed');
            });
            setTimeout(processOCs, 500);
        });

        processOCs();
    }

    // Initialize script
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();