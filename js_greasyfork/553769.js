// ==UserScript==
// @name         DogeMiner 2 Stable Cheat
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Dodaje dużą liczbę monet i diamentów w DogeMiner 2 (bez lagów)
// @author       You
// @match        https://dogeminer2.com/*
// @match        https://*.dogeminer2.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553769/DogeMiner%202%20Stable%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/553769/DogeMiner%202%20Stable%20Cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const targetCoins = 1000000000000000;
    const targetDiamonds = 100000;

    function activateCheat() {
        if (typeof dogeminer !== 'undefined' && dogeminer.player) {
            dogeminer.player.diamonds += targetDiamonds;
            dogeminer.player.coins = targetCoins;
            
            if (dogeminer.updateDisplay) {
                dogeminer.updateDisplay();
            }
            
            setTimeout(() => {
                if (dogeminer.updateDisplay) dogeminer.updateDisplay();
            }, 100);
            
            return true;
        }
        return false;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const tryActivate = setInterval(() => {
        if (activateCheat() || attempts >= maxAttempts) {
            clearInterval(tryActivate);
            if (attempts < maxAttempts) {
                alert('CHEAT ACTIVATED! ✅\n+100,000 Diamonds 💎\n+1,000,000,000,000,000 Coins 🪙');
            }
        }
        attempts++;
    }, 1500);

    setTimeout(() => {
        const cheatButton = document.createElement('button');
        cheatButton.innerHTML = '💰 ACTIVATE CHEAT';
        cheatButton.style.position = 'fixed';
        cheatButton.style.top = '10px';
        cheatButton.style.right = '10px';
        cheatButton.style.zIndex = '9999';
        cheatButton.style.padding = '12px';
        cheatButton.style.backgroundColor = '#ff9900';
        cheatButton.style.color = 'white';
        cheatButton.style.border = 'none';
        cheatButton.style.borderRadius = '8px';
        cheatButton.style.cursor = 'pointer';
        cheatButton.style.fontWeight = 'bold';
        cheatButton.style.fontSize = '14px';
        cheatButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        
        cheatButton.onclick = function() {
            if (activateCheat()) {
                alert('CHEAT ACTIVATED! ✅\n+100,000 Diamonds 💎\n+1,000,000,000,000,000 Coins 🪙');
            }
        };
        
        document.body.appendChild(cheatButton);
    }, 2000);
})();