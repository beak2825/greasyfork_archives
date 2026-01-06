// ==UserScript==
// @name         GeoGuessr Random Map
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press Alt + R to load a truly random community map
// @author       User
// @match        https://www.geoguessr.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561621/GeoGuessr%20Random%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/561621/GeoGuessr%20Random%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. THE RANDOMIZER LOGIC
    // We search for a random character and pick a random page (up to 500)
    // to find the most obscure maps in the database.
    async function playTrulyRandomMap() {
        const btn = document.getElementById('geo-random-dice');
        if (btn) btn.innerHTML = '⏳';

        try {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            const query = chars[Math.floor(Math.random() * chars.length)];
            const page = Math.floor(Math.random() * 500);

            const response = await fetch(`https://www.geoguessr.com/api/v3/search/map?q=${query}&page=${page}&count=20`);
            const data = await response.json();

            if (data && data.length > 0) {
                const randomMap = data[Math.floor(Math.random() * data.length)];
                window.location.href = `https://www.geoguessr.com/maps/${randomMap.id}`;
            } else {
                // Fallback if the deep page was empty
                const fallback = await fetch(`https://www.geoguessr.com/api/v3/search/map?q=${query}&page=0&count=20`);
                const fbData = await fallback.json();
                window.location.href = `https://www.geoguessr.com/maps/${fbData[Math.floor(Math.random() * fbData.length)].id}`;
            }
        } catch (err) {
            console.error("Randomizer Error:", err);
            if (btn) btn.innerHTML = '🎲';
        }
    }

    // 2. HOTKEY: ALT + R
    window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            playTrulyRandomMap();
        }
    });

    // 3. UI INJECTION
    function injectButton() {
        if (document.getElementById('geo-random-dice')) return;

        // Target the right side of the header where icons live
        const headerRight = document.querySelector('div[class*="header_right"]') ||
                            document.querySelector('[class*=header-desktop_desktopSectionRight__]');

        if (headerRight) {
            const diceBtn = document.createElement('div');
            diceBtn.id = 'geo-random-dice';
            diceBtn.innerHTML = '🎲';
            diceBtn.title = 'Truly Random Map (Alt+R)';

            // Subtle, gray, and integrated
            // We use margin-right: 20px to prevent other scripts from covering us
            diceBtn.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 16px;
                width: 32px;
                height: 32px;
                margin-right: 20px;
                opacity: 0.3;
                transition: all 0.2s ease;
                user-select: none;
                filter: grayscale(1);
                order: -10;
            `;

            diceBtn.onmouseover = () => {
                diceBtn.style.opacity = '1';
                diceBtn.style.filter = 'grayscale(0)';
            };
            diceBtn.onmouseout = () => {
                diceBtn.style.opacity = '0.3';
                diceBtn.style.filter = 'grayscale(1)';
            };

            diceBtn.onclick = (e) => {
                e.preventDefault();
                playTrulyRandomMap();
            };

            // Prepend puts it to the left of most icons, order: -10 ensures it
            // stays to the left even if other scripts prepend items.
            headerRight.prepend(diceBtn);
        }
    }

    // 4. PERSISTENCE
    // Watch for header changes when the user navigates menus
    const observer = new MutationObserver(injectButton);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    injectButton();
})();