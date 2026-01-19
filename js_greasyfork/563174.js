// ==UserScript==
// @name         Warlord
// @namespace    Para_Thenics.torn.com
// @version      0.00.001
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

    const STORAGE_KEY = 'warlordApiKey'; // ✅ Unique key for Warlord script

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

    // ✅ Feature 2: Add elegant icon-only attack button on profile page + preload attack page
    function addExtraAttackButton() {
        if (!location.href.includes('profiles.php')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('XID');
        if (!userID) return;

        const buttonsList = document.querySelector('.buttons-list');
        if (!buttonsList) return;

        if (document.querySelector('.custom-attack-btn')) return;

        const attackURL = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID}`;

        // ✅ Preload attack page
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'prefetch';
        preloadLink.href = attackURL;
        document.head.appendChild(preloadLink);

        // ✅ Grab hospital timer if present
        const hospitalTimer = document.querySelector('.hospital-time, .statusHospital, .statusTravel');
        if (hospitalTimer) {
            const timeText = hospitalTimer.textContent.trim(); // e.g., "02:15:30"
            const parts = timeText.split(':').map(Number);
            if (parts.length === 3) {
                const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                localStorage.setItem('hospitalTimerSeconds', totalSeconds);
                localStorage.setItem('hospitalTimerTimestamp', Date.now());
            }
        } else {
            localStorage.removeItem('hospitalTimerSeconds');
            localStorage.removeItem('hospitalTimerTimestamp');
        }

        // Create custom button
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
        customBtn.style.fontWeight = 'bold';
        customBtn.style.marginLeft = '8px';
        customBtn.title = 'Attack (Always)';

        customBtn.addEventListener('mouseenter', () => {
            customBtn.style.backgroundColor = '#c9302c';
        });
        customBtn.addEventListener('mouseleave', () => {
            customBtn.style.backgroundColor = '#d9534f';
        });

        customBtn.addEventListener('click', () => {
            window.location.href = attackURL;
        });

        buttonsList.appendChild(customBtn);
    }

    // ✅ Feature 3: Show live hospital timer on attack page
    function showHospitalTimerOnAttackPage() {
        if (!location.href.includes('loader.php?sid=attack')) return;

        const storedSeconds = parseInt(localStorage.getItem('hospitalTimerSeconds'), 10);
        const storedTimestamp = parseInt(localStorage.getItem('hospitalTimerTimestamp'), 10);
        if (!storedSeconds || !storedTimestamp) return;

        const elapsed = Math.floor((Date.now() - storedTimestamp) / 1000);
        let remaining = storedSeconds - elapsed;
        if (remaining <= 0) return;

        const timerDiv = document.createElement('div');
        timerDiv.style.position = 'fixed';
        timerDiv.style.top = '10px';
        timerDiv.style.right = '10px';
        timerDiv.style.backgroundColor = '#d9534f';
        timerDiv.style.color = '#fff';
        timerDiv.style.padding = '6px 10px';
        timerDiv.style.borderRadius = '4px';
        timerDiv.style.fontWeight = 'bold';
        timerDiv.style.zIndex = '9999';
        timerDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        timerDiv.style.fontSize = '14px';
        document.body.appendChild(timerDiv);

        function formatTime(seconds) {
            const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const s = String(seconds % 60).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }

        function updateTimer() {
            if (remaining <= 0) {
                timerDiv.textContent = 'Ready!';
                clearInterval(interval);
                return;
            }
            timerDiv.textContent = `Hospital: ${formatTime(remaining)}`;
            remaining--;
        }

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
    }

    // ✅ Feature 4: Warlord API Key Management inside .content-title.m-bottom10
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
        btn.style.fontWeight = 'bold';
        btn.style.marginLeft = '10px';
        btn.title = 'Manage Warlord API Key';

        btn.textContent = apiKey ? 'Warlord API Key ✅' : 'Set Warlord API Key';

        btn.addEventListener('click', () => {
            const newKey = prompt('Enter your Warlord API Key (leave blank to remove):', apiKey);
            if (newKey === null) return; // Cancelled
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
        showHospitalTimerOnAttackPage();
        addApiKeyButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    makeStatusClickable();
    addExtraAttackButton();
    showHospitalTimerOnAttackPage();
    addApiKeyButton();
})();
``