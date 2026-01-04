// ==UserScript==
// @name        CRYSTAL's Torn OC CSV Export (Copy to Clipboard)
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Exports OC data for assigned members to a pop-up window for easy copying (fixed scenario names).
// @author      Crystal
// @match       https://www.torn.com/factions.php?step=your*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/555937/CRYSTAL%27s%20Torn%20OC%20CSV%20Export%20%28Copy%20to%20Clipboard%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555937/CRYSTAL%27s%20Torn%20OC%20CSV%20Export%20%28Copy%20to%20Clipboard%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Map full scenario names to your abbreviations
    const scenarioMap = {
        "Ace in the Hole": "AITH",
        "Break the Bank": "BTB",
        "Clinical Precision": "CP",
        "Stacking the Deck": "STD",
        "Blast from the Past": "BFTP",
        "Honey Trap": "HT",
        "Sneaky Git Grab": "SGG",
        "Bidding War": "BW",
        "Guardian Ángels": "GA",
        "No Reserve": "NR",
        "Counter Offer": "CO",
        "Leave No Trace": "LNT",
        "Snow Blind": "SB",
        "Stage Fright": "SF",
        "Market Forces": "MF",
        "Smoke and Wing Mirrors": "SAWM",
        "Gaslight the Way": "GTW",
        "Best of the Lot": "BOTL",
        "Cash Me if You Can": "CMIYC",
        "Pet Project": "PP",
        "Mob Mentality": "MM"
    };

    // Utility to wait until element exists
    function waitForElement(selector, callback, interval = 500, timeout = 10000) {
        const start = Date.now();
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                console.error('Timeout waiting for element: ' + selector);
            }
        }, interval);
    }

    // Create export button
    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = 'Export OC Data';
        btn.style.position = 'fixed';
        btn.style.top = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.padding = '8px 12px';
        btn.style.background = '#f39c12';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        document.body.appendChild(btn);
        btn.addEventListener('click', showDataPopup);
    }

    // Extract OC data and show in a pop-up
    function showDataPopup() {
        const rows = [];
        rows.push(['Member', 'Scenario', 'Role', 'Success Chance']);

        // Find all OC containers
        const ocWrappers = document.querySelectorAll('div[class*="wrapper___"][data-oc-id]');

        ocWrappers.forEach(ocWrapper => {
            // Get the scenario name
            let scenarioName = 'N/A';
            let scenarioAbbr = 'N/A';
            const titleEl = ocWrapper.querySelector('p[class*="panelTitle___"]');
            if (titleEl) {
                scenarioName = titleEl.childNodes[0].textContent.trim();
                scenarioAbbr = scenarioMap[scenarioName] || scenarioName;
            }

            // Get the OC level for this crime
            let ocLevel = 'N/A';
            const ocLevelContainer = ocWrapper.querySelector('div[class*="level___"]');
            if (ocLevelContainer) {
                const ocLevelEl = ocLevelContainer.querySelector('span[class*="levelValue___"]');
                ocLevel = ocLevelEl ? ocLevelEl.textContent.trim() : 'N/A';
            }

            // Find all individual slots within this OC wrapper
            const slots = ocWrapper.querySelectorAll('div[class*="wrapper___"][class*="success"]');

            slots.forEach(slot => {
                // Get the member name
                let member = 'N/A';
                const memberEl = slot.querySelector('div[class*="badge___"] span.honor-text');
                const svgNameEl = slot.querySelector('div[class*="badge___"] span.honor-text-svg + span.honor-text');

                if (svgNameEl) {
                    member = svgNameEl.textContent.trim();
                } else if (memberEl) {
                    const parentClass = memberEl.parentElement.className;
                    if (!parentClass.includes("honorTextSymbol___")) {
                        member = memberEl.textContent.trim();
                    }
                }

                if (member !== 'N/A') {
                    // Get the OC role and remove numbers (e.g., "Thief #1")
                    const roleEl = slot.querySelector('span[class*="title___"]');
                    const role = roleEl ? roleEl.textContent.trim().replace(/ #\d+/, '') : 'N/A';

                    // Get the success chance
                    const successEl = slot.querySelector('div[class*="successChance___"]');
                    const successChance = successEl ? successEl.textContent.trim() + '%' : 'N/A';

                    rows.push([member, scenarioAbbr, role, successChance]);
                }
            });
        });

        const csvContent = rows.map(r => r.join(',')).join('\n');

        // Create modal
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.width = '400px';
        modal.style.padding = '20px';
        modal.style.backgroundColor = '#222';
        modal.style.color = 'white';
        modal.style.border = '1px solid #f39c12';
        modal.style.zIndex = '10000';
        modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)';
        modal.style.borderRadius = '8px';
        modal.style.fontFamily = 'Arial, sans-serif';

        const header = document.createElement('h3');
        header.textContent = 'OC Data Export';
        header.style.marginBottom = '10px';
        header.style.color = '#f39c12';
        modal.appendChild(header);

        const textArea = document.createElement('textarea');
        textArea.value = csvContent;
        textArea.style.width = '100%';
        textArea.style.height = '200px';
        textArea.style.backgroundColor = '#111';
        textArea.style.color = '#fff';
        textArea.style.border = '1px solid #555';
        textArea.style.padding = '5px';
        textArea.style.fontFamily = 'monospace';
        modal.appendChild(textArea);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.marginTop = '15px';
        closeBtn.style.padding = '8px 12px';
        closeBtn.style.background = '#555';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '5px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);
        textArea.select();
    }

    // Wait for at least one full OC wrapper to show up
    waitForElement('div[class*="wrapper___"][data-oc-id]', createButton);
})();
