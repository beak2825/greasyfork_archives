// ==UserScript==
// @name         Warlord
// @namespace    Para_Thenics.torn.com
// @version      0.00.003
// @description  Adds attack buttons where needed
// @author       Para_Thenics
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/563174/Warlord.user.js
// @updateURL https://update.greasyfork.org/scripts/563174/Warlord.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const STORAGE_KEY = 'warlordApiKey';
    let timerInitialized = false; // ✅ Prevent multiple API calls

    // ✅ Feature 1: Make status clickable on faction page
    function makeStatusClickable() {
        if (!location.href.includes('factions.php')) return;
        const statusCells = document.querySelectorAll('.table-cell.status');
        statusCells.forEach(cell => {
            if (cell.dataset.attackReady === 'true') return;
            const playerLink = cell.closest('.table-row')?.querySelector('a[href*="profiles.php?XID="]');
            if (!playerLink) return;
            const href = playerLink.getAttribute('href');
            const match = href.match(/XID=(\d+)/);
            if (!match) return;
            const userID = match[1];
            cell.style.cursor = 'pointer';
            cell.style.color = '#d9534f';
            cell.title = 'Click to attack this player';
            cell.addEventListener('click', () => {
                window.location.href = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID}`;
            });
            cell.dataset.attackReady = 'true';
        });
    }

    // ✅ Feature 2: Add attack button on profile page
    function addExtraAttackButton() {
        if (!location.href.includes('profiles.php')) return;
        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('XID');
        if (!userID) return;
        const buttonsList = document.querySelector('.buttons-list');
        if (!buttonsList || document.querySelector('.custom-attack-btn')) return;
        const attackURL = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID}`;
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'prefetch';
        preloadLink.href = attackURL;
        document.head.appendChild(preloadLink);
        const customBtn = document.createElement('button');
        customBtn.classList.add('custom-attack-btn');
        customBtn.innerHTML = '⚔';
        customBtn.style.backgroundColor = '#d9534f';
        customBtn.style.color = '#fff';
        customBtn.style.border = 'none';
        customBtn.style.width = '32px';
        customBtn.style.height = '32px';
        customBtn.style.borderRadius = '4px';
        customBtn.style.cursor = 'pointer';
        customBtn.style.fontSize = '18px';
        customBtn.style.marginLeft = '8px';
        customBtn.title = 'Attack (Always)';
        customBtn.addEventListener('mouseenter', () => customBtn.style.backgroundColor = '#c9302c');
        customBtn.addEventListener('mouseleave', () => customBtn.style.backgroundColor = '#d9534f');
        customBtn.addEventListener('click', () => window.location.href = attackURL);
        buttonsList.appendChild(customBtn);
    }

    // ✅ Feature 3: Fetch target player's status via API and show timer inside .titleContainer___QrlWP
    async function fetchTargetStatusTimer() {
        if (!location.href.includes('loader.php?sid=attack') || timerInitialized) return;
        timerInitialized = true;

        const apiKey = localStorage.getItem(STORAGE_KEY);
        if (!apiKey) return;

        const urlParams = new URLSearchParams(window.location.search);
        const targetID = urlParams.get('user2ID');
        if (!targetID) return;

        try {
            const response = await fetch(`https://api.torn.com/user/${targetID}?selections=basic&key=${apiKey}`);
            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error.error);
                return;
            }

            const state = data.status.state;
            const until = data.status.until * 1000;
            if (!state || !until || state === 'Okay') return;

            let remaining = Math.floor((until - Date.now()) / 1000);
            if (remaining <= 0) return;

            // ✅ Find container instead of fixed position
            const container = document.querySelector('.titleContainer___QrlWP');
            if (!container) return;


// ✅ Create timer UI inside container (Dark Mode Friendly)
const timerDiv = document.createElement('div');
timerDiv.style.backgroundColor = '#1e1e1e'; // Dark background
timerDiv.style.color = '#00ff99'; // Bright green text for visibility
timerDiv.style.padding = '4px 10px';
timerDiv.style.borderRadius = '6px';
timerDiv.style.fontWeight = 'bold';
timerDiv.style.fontSize = '14px';
timerDiv.style.marginLeft = '12px';
timerDiv.style.display = 'inline-block';
timerDiv.style.boxShadow = '0 0 8px rgba(0, 255, 153, 0.5)'; // Subtle glow
timerDiv.style.border = '1px solid #00ff99'; // Neon border
container.appendChild(timerDiv);


            function formatTime(sec) {
                const h = String(Math.floor(sec / 3600)).padStart(2, '0');
                const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
                const s = String(sec % 60).padStart(2, '0');
                return `${h}:${m}:${s}`;
            }

            function updateTimer() {
                if (remaining <= 0) {
                    timerDiv.textContent = 'Ready!';
                    clearInterval(interval);
                    return;
                }
                timerDiv.textContent = `${state}: ${formatTime(remaining)}`;
                remaining--;
            }

            updateTimer();
            const interval = setInterval(updateTimer, 1000);
        } catch (err) {
            console.error('Failed to fetch Torn API:', err);
        }
    }

    // ✅ Feature 4: Warlord API Key button
    function addApiKeyButton() {
        if (!location.href.includes('index.php')) return;
        if (document.querySelector('.api-key-btn')) return;
        const apiKey = localStorage.getItem(STORAGE_KEY) || '';
        const container = document.querySelector('.content-title.m-bottom10');
        if (!container) return;
        const btn = document.createElement('button');
        btn.classList.add('api-key-btn');
        btn.style.backgroundColor = '#337ab7';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.padding = '6px 10px';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        btn.style.marginLeft = '10px';
        btn.textContent = apiKey ? 'Warlord API Key ✅' : 'Set Warlord API Key';
        btn.addEventListener('click', () => {
            const newKey = prompt('Enter your Warlord API Key (leave blank to remove):', apiKey);
            if (newKey === null) return;
            if (newKey.trim() === '') {
                localStorage.removeItem(STORAGE_KEY);
                alert('Warlord API Key removed.');
                btn.textContent = 'Set Warlord API Key';
            } else {
                localStorage.setItem(STORAGE_KEY, newKey.trim());
                alert('Warlord API Key saved.');
                btn.textContent = 'Warlord API Key ✅';
            }
        });
        container.appendChild(btn);
    }

    // ✅ Observe DOM changes
    const observer = new MutationObserver(() => {
        makeStatusClickable();
        addExtraAttackButton();
        fetchTargetStatusTimer();
        addApiKeyButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    makeStatusClickable();
    addExtraAttackButton();
    fetchTargetStatusTimer();
    addApiKeyButton();
})();
