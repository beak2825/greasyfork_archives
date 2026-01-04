// ==UserScript==
// @name         Torn High-Low Assist (with Session Stats)
// @namespace    torn.highlow.assist
// @version      1.4
// @description  Adds win/loss tracking to help see the house edge in action
// @author       Dellucian
// @license      MIT
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @noframes     false
// @downloadURL https://update.greasyfork.org/scripts/560341/Torn%20High-Low%20Assist%20%28with%20Session%20Stats%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560341/Torn%20High-Low%20Assist%20%28with%20Session%20Stats%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.href.includes('highlow')) return;

    const getCardRank = (cardElement) => {
        if (!cardElement) return null;
        const match = cardElement.className.match(/card-\w+-([0-9AJQK]+)/);
        if (!match) return null;

        const val = match[1];
        const ranks = { '2':0, '3':1, '4':2, '5':3, '6':4, '7':5, '8':6, '9':7, '10':8, 'J':9, 'Q':10, 'K':11, 'A':12 };
        return ranks[val];
    };

    function updateOverlay(pHigher, pLower) {
        let box = document.getElementById('hl-helper-overlay');
        if (!box) {
            box = document.createElement('div');
            box.id = 'hl-helper-overlay';
            box.setAttribute('style', `
                position: fixed !important; top: 10px !important; left: 10px !important;
                background: rgba(0, 0, 0, 0.9) !important; color: #fff !important; padding: 12px !important;
                border: 2px solid #FFD700 !important; z-index: 999999999 !important;
                font-family: "Segoe UI", Arial, sans-serif !important; min-width: 140px !important;
                border-radius: 8px !important; display: block !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
            `);
            document.documentElement.appendChild(box);
        }

        const getCol = (p) => (p >= 75 ? '#00FF00' : p >= 60 ? '#00BFFF' : p == 50 ? '#888' : '#FF4500');
        
        // Determine indicator
        let indicator = "";
        let higherStyle = "";
        let lowerStyle = "";

        if (parseFloat(pHigher) > parseFloat(pLower)) {
            indicator = `<div style="text-align:center; font-size:24px; color:#00FF00; margin-bottom:5px;">▲ HIGHER ▲</div>`;
            higherStyle = "border: 1px solid #00FF00; padding: 2px; border-radius:3px;";
        } else if (parseFloat(pLower) > parseFloat(pHigher)) {
            indicator = `<div style="text-align:center; font-size:24px; color:#FF4500; margin-top:5px;">▼ LOWER ▼</div>`;
            lowerStyle = "border: 1px solid #FF4500; padding: 2px; border-radius:3px;";
        } else {
            indicator = `<div style="text-align:center; font-size:18px; color:#888;">EQUAL CHANCE</div>`;
        }

        box.innerHTML = `
            ${indicator}
            <hr style="border:0; border-top:1px solid #444; margin: 8px 0;">
            <div style="font-size:16px; font-weight:bold; display:flex; justify-content:space-between; gap: 10px;">
                <span style="color:${getCol(pHigher)}; ${higherStyle}">H: ${pHigher}%</span>
                <span style="color:${getCol(pLower)}; ${lowerStyle}">L: ${pLower}%</span>
            </div>
        `;
    }

    function scan() {
        const card = document.querySelector('div[class*="card-"]:not([class*="back"])');

        if (card) {
            const rank = getCardRank(card);
            if (rank !== null) {
                // Calculate probabilities based on 13 cards (2-A)
                const probHigher = ((12 - rank) / 12 * 100).toFixed(0);
                const probLower = (rank / 12 * 100).toFixed(0);
                updateOverlay(probHigher, probLower);
            }
        } else {
            let box = document.getElementById('hl-helper-overlay');
            if (box) box.innerHTML = '<div style="font-size:14px; color:#aaa; text-align:center;">Waiting for card...</div>';
        }
    }

    setInterval(scan, 500);
})();