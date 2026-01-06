// ==UserScript==
// @name         Auto DOGE Miner Claimer + Human Behavior
// @namespace    https://tampermonkey.net/
// @version      1.5
// @description  Automatically claim DOGE when miner reaches max value, restart mining, remove heavy animations, human-like behavior.
// @author       Rubystance
// @license      MIT
// @match        https://dogerpg.lovable.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560534/Auto%20DOGE%20Miner%20Claimer%20%2B%20Human%20Behavior.user.js
// @updateURL https://update.greasyfork.org/scripts/560534/Auto%20DOGE%20Miner%20Claimer%20%2B%20Human%20Behavior.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const REF_URL = 'https://dogerpg.lovable.app/?ref=DOGECA3FAC';
    const REF_KEY = 'dogerpg_ref_used';

    if (!localStorage.getItem(REF_KEY)) {
        if (!location.search.includes('ref=')) {
            localStorage.setItem(REF_KEY, 'pending');
            location.replace(REF_URL);
            return;
        } else {
          
            localStorage.setItem(REF_KEY, 'used');
        }
    }

    if (localStorage.getItem(REF_KEY) === 'used' && location.search.includes('ref=')) {
        const cleanUrl = location.origin + location.pathname;
        history.replaceState({}, '', cleanUrl);
    }

    const miners = {
        "Doge Artist": 0.0039,
        "DOGNUS": 0.0025,
        "Doge Mechanic": 0.0039,
        "Doge Chef": 0.0039,
        "Doge Wizard": 0.0097
    };

    const ACTION_DELAY = 6000; // 6 seconds per action (human-like)
    let lastActionTime = 0;

    function canAct() {
        return Date.now() - lastActionTime >= ACTION_DELAY;
    }

    function markAction() {
        lastActionTime = Date.now();
    }

    function optimizePerformance() {
        const style = document.createElement('style');
        style.innerHTML = `
            * {
                transition-duration: 0ms !important;
                animation-duration: 0ms !important;
                animation-delay: 0ms !important;
                animation-iteration-count: 1 !important;
            }
            body {
                scroll-behavior: auto !important;
            }
            .background, .banner, .particles, .floating-element {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function navigateToInventario() {
        const inventoryInterval = setInterval(() => {
            const inventoryTab = [...document.querySelectorAll('span.text-sm.truncate')]
                .find(span => span.innerText.includes('Invent'));
            if (inventoryTab) {
                inventoryTab.click();
                clearInterval(inventoryInterval);
            }
        }, 1500);
    }

    function claimMiner() {
        if (!canAct()) return;

        const buttons = [...document.querySelectorAll('button')];

        for (const btn of buttons) {
            const text = btn.innerText.replace(/\n/g, ' ').trim();
            const match = text.match(/Reclamar\s+([\d.,]+)\s+DOGE/i);
            if (!match) continue;
            if (btn.disabled) continue;

            const value = parseFloat(match[1].replace(',', '.'));
            const shouldClaim = Object.values(miners).some(max => value >= max);

            if (shouldClaim) {
                btn.click();
                markAction();
                return;
            }
        }
    }

    function startMining() {
        if (!canAct()) return;

        const btn = [...document.querySelectorAll('button')]
            .find(b => b.innerText.includes('Iniciar Minado') && !b.disabled);

        if (btn) {
            btn.click();
            markAction();
        }
    }

    optimizePerformance();
    navigateToInventario();

    setInterval(() => {
        claimMiner();
        startMining();
    }, 1000);

})();
