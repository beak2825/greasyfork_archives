// ==UserScript==
// @name         Secim Bilgini Solver
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Instantly displays the target City & Year in a Red HUD
// @author       You
// @match        *://*.secimbilgini.com/*
// @match        *://secimbilgini.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558109/Secim%20Bilgini%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/558109/Secim%20Bilgini%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. HUD Setup ---
    const hud = document.createElement('div');
    hud.id = 'sb-solver-hud';
    hud.style.cssText = `
        position: fixed;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #dc2626; /* Red-600 */
        color: white;
        padding: 8px 20px;
        border-radius: 10px;
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        pointer-events: none;
        text-align: center;
        border: 2px solid white;
        min-width: 150px;
        line-height: 1.3;
        white-space: nowrap;
    `;
    hud.innerHTML = "<span>⏳ Ready</span>";
    document.body.appendChild(hud);

    let lastFingerprint = "";

    function log(msg, data) {
        console.log(`%c[SB Solver] ${msg}`, "color: #0ea5e9; font-weight: bold;", data || "");
    }

    // --- 2. Format Date ---
    function formatYear(yearVal) {
        const val = Number(yearVal);
        if (val === 2015) return "2015 HAZİRAN";
        if (val === 2015.5) return "2015 KASIM";
        return val;
    }

    // --- 3. Main Logic ---
    function solveRound() {
        const root = document.querySelector('#root');
        if (!root) return;

        // Get Screen Numbers
        const numberElements = document.querySelectorAll('.text-2xl.sm\\:text-3xl.font-black');
        if (numberElements.length === 0) return;

        const percentages = Array.from(numberElements)
            .map(el => parseFloat(el.innerText.trim()))
            .filter(n => !isNaN(n));

        if (percentages.length === 0) return;

        const currentFingerprint = percentages.join('-');

        if (currentFingerprint !== lastFingerprint) {
            lastFingerprint = currentFingerprint;
            hud.innerHTML = "🔍 Scanning...";
            hud.style.backgroundColor = '#eab308'; // Yellow

            const winnerPct = percentages[0];
            log(`New Round: ${winnerPct}%`);

            findAnswerByStructure(root, winnerPct);
        }
    }

    // --- 4. Deep Structure Scanner ---
    function findAnswerByStructure(root, targetValue) {
        const reactKey = Object.keys(root).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactContainer'));
        if (!reactKey) return;

        let foundData = null;

        // Recursive Search
        const search = (node, depth = 0) => {
            // Increased depth limit to 2500 for late-game rounds
            if (!node || depth > 2500 || foundData) return;

            // Checker function
            const validate = (data) => {
                if (!data || typeof data !== 'object') return;

                // 1. Structure Check: Look for Game Object shape
                const hasCity = data.city || data.name;
                const hasYear = data.year;
                const hasResults = Array.isArray(data.results);

                if (hasCity && hasYear && hasResults) {

                    // 2. Fuzzy Value Check
                    // Check normal (32.6) and decimal (0.326) formats
                    const match = data.results.some(r => {
                        if (typeof r === 'object') {
                            return Object.values(r).some(val => {
                                if (typeof val === 'number') {
                                    // Check absolute value (32.6)
                                    if (Math.abs(val - targetValue) < 0.2) return true;
                                    // Check ratio value (0.326 vs 32.6)
                                    if (Math.abs((val * 100) - targetValue) < 0.2) return true;
                                }
                                return false;
                            });
                        }
                        return false;
                    });

                    if (match) {
                        foundData = data;
                        log("✅ Valid Match Found:", data);
                    }
                }

                // Nested target check
                if (data.target) validate(data.target);
            };

            // Inspect State (Hooks)
            let hook = node.memoizedState;
            while (hook) {
                validate(hook.memoizedState);
                hook = hook.next;
            }
            // Inspect Props
            validate(node.memoizedProps);

            // Traverse Children
            search(node.child, depth + 1);
            search(node.sibling, depth);

            // Traverse Alternate Tree (Double Buffer)
            // This catches state updates that are pending or cached differently
            if (node.alternate) {
                // We don't recurse fully into alternate to avoid infinite loops,
                // just check its immediate data
                let altHook = node.alternate.memoizedState;
                while (altHook) {
                    validate(altHook.memoizedState);
                    altHook = altHook.next;
                }
                validate(node.alternate.memoizedProps);
            }
        };

        search(root[reactKey]);

        // --- 5. Update UI ---
        if (foundData) {
            const city = (foundData.city || foundData.name).toLocaleUpperCase('tr-TR');
            const year = formatYear(foundData.year);

            hud.style.backgroundColor = '#dc2626'; // Red
            hud.innerHTML = `
                <div style="font-size: 20px;">🗳️ ${city}</div>
                <div style="font-size: 14px; margin-top:2px; color: #fee2e2;">📅 ${year}</div>
            `;
        } else {
            // If still scanning, it might retry on next tick
            if(hud.innerText.includes("Scanning")) {
                console.log("[SB Solver] Retrying...");
            }
        }
    }

    // --- 6. Watch Loop (250ms) ---
    setInterval(solveRound, 250);

})();