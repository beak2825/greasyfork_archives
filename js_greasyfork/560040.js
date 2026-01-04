// ==UserScript==
// @name         WTF OC
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  Color Coding the positions (green = can join, red = can't)
// @author       Adamastor
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560040/WTF%20OC.user.js
// @updateURL https://update.greasyfork.org/scripts/560040/WTF%20OC.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Inject pulse animation for assigned slots that are under threshold
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
    `;
    document.head.appendChild(style);

    // Thresholds by LEVEL rule:
    // L1/L2 = 60, L3-8 = 65, L9 = 63
    // Map every OC name (from your screenshots) to its required success chance.
    const ocThresholds = {
        // Level 1 (60)
        "mob mentality": 60,
        "pet project": 60,

        // Level 2 (60)
        "cash me if you can": 60,
        "best of the lot": 60,

        // Level 3 (65)
        "smoke and wing mirrors": 65,
        "market forces": 65,
        "gaslight the way": 65,

        // Level 4 (65)
        "snow blind": 65,
        "stage fright": 65,

        // Level 5 (65)
        "guardian angels": 65,
        "leave no trace": 65,
        "counter offer": 65,
        "no reserve": 65,

        // Level 6 (65)
        "bidding war": 65,
        "honey trap": 65,
        "sneaky git grab": 65,

        // Level 7 (65)
        "blast from the past": 65,

        // Level 8 (65)
        "break the bank": 65,
        "stacking the deck": 65,
        "manifest cruelty": 65,

        // Level 9 (63)
        "ace in the hole": 63,
        "gone fission": 63
    };

    function getRequiredForOC(ocName) {
        if (!ocName) return null;
        return ocThresholds[ocName.trim().toLowerCase()] ?? null;
    }

    function processScenario(panel) {
        if (panel.classList.contains('role-processed')) return;
        panel.classList.add('role-processed');

        const ocName = panel.querySelector('.panelTitle___aoGuV')?.innerText.trim() || "";
        const required = getRequiredForOC(ocName);
        if (required === null) return; // skip OCs we didn't map

        const slots = panel.querySelectorAll('.wrapper___Lpz_D');

        Array.from(slots).forEach(slot => {
            const chanceElem = slot.querySelector('.successChance___ddHsR');
            if (!chanceElem) return;

            const successChance = parseInt(chanceElem.textContent.trim(), 10) || 0;
            const joinBtn = slot.querySelector("button[class^='torn-btn joinButton']");

            // Detect assigned player (if assigned, don't recolor background—just pulse if under req)
            const honorTexts = slot.querySelectorAll('.honor-text');
            const userName = honorTexts.length > 1 ? honorTexts[1].textContent.trim() : null;

            if (!userName) {
                // Empty slot: paint red/green and optionally disable join button
                const canJoin = successChance >= required;
                slot.style.backgroundColor = canJoin ? '#21a61c61' : '#ff000061';

                if (joinBtn) {
                    if (!canJoin) joinBtn.setAttribute('disabled', '');
                    else joinBtn.removeAttribute('disabled');
                }
            } else {
                // Assigned slot: if under threshold, pulse red outline
                if (successChance < required) {
                    slot.classList.add('pulse-border-red');
                    slot.style.outline = '4px solid red';
                    slot.style.outlineOffset = '0px';
                }
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches('.wrapper___U2Ap7')) {
                    processScenario(node);
                } else {
                    node.querySelectorAll?.('.wrapper___U2Ap7').forEach(processScenario);
                }
            });
        });
    });

    const targetNode = document.querySelector('#factionCrimes-root') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        document.querySelectorAll('.wrapper___U2Ap7').forEach(processScenario);
    });

})();
