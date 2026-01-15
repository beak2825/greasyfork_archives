// ==UserScript==
// @name         Torn Attack UI - Universal Overlay (v9.3 Stable)
// @namespace    TornUserScriptWriter
// @version      9.3
// @description  Stable overlay that won't break the page. Hotkey 'S' for Settings.
// @author       Torn UserScript Writer
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/562572/Torn%20Attack%20UI%20-%20Universal%20Overlay%20%28v93%20Stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562572/Torn%20Attack%20UI%20-%20Universal%20Overlay%20%28v93%20Stable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue('torn_api_key', '');
    let refreshLatency = GM_getValue('user_latency', 800);
    let weaponSlot = GM_getValue('target_weapon_slot', 'primary');
    let lastLoadTime = GM_getValue('last_load_speed', 0);
    const startTime = performance.now();

    const SLOT_MAP = {
        'primary': '.weaponWrapper___h3buK',
        'secondary': '#weapon_second',
        'melee': '#weapon_melee',
        'temp': '#weapon_temp'
    };

    GM_addStyle(`
        #torn-stats-panel {
            position: fixed !important; top: 15px !important; right: 15px !important;
            padding: 12px; background: rgba(0,0,0,0.9) !important; color: #00ff00 !important;
            font-family: monospace; font-size: 13px; border: 1px solid #00ff00 !important;
            z-index: 2147483647 !important; border-radius: 4px; pointer-events: auto !important;
        }
        #torn-settings-menu {
            position: fixed !important; top: 50% !important; left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: #111 !important; color: white !important; padding: 20px;
            border: 2px solid #00ff00; z-index: 2147483647 !important;
            display: none; flex-direction: column; gap: 10px; min-width: 280px;
        }
        .custom-attack-overlay {
            position: absolute !important; top: 0 !important; left: 0 !important;
            width: 100% !important; height: 100% !important; z-index: 9999 !important;
            background: rgba(255, 0, 0, 0.7) !important; color: white !important;
            font-weight: 900 !important; font-size: 20px !important;
            border: 2px solid #fff !important; cursor: pointer !important;
            display: flex !important; align-items: center; justify-content: center;
            text-align: center; border-radius: 5px;
        }
    `);

    // --- UI Creation ---
    const statsDiv = document.createElement('div');
    statsDiv.id = 'torn-stats-panel';
    document.body.appendChild(statsDiv);

    const settingsMenu = document.createElement('div');
    settingsMenu.id = 'torn-settings-menu';
    settingsMenu.innerHTML = `
        <h3 style="margin:0; color:#00ff00;">SETTINGS</h3>
        <label>API Key:</label><input type="text" id="set-api-key" value="${apiKey}">
        <label>Weapon Slot:</label>
        <select id="set-weapon-slot">
            <option value="primary" ${weaponSlot === 'primary' ? 'selected' : ''}>Primary</option>
            <option value="secondary" ${weaponSlot === 'secondary' ? 'selected' : ''}>Secondary</option>
            <option value="melee" ${weaponSlot === 'melee' ? 'selected' : ''}>Melee</option>
            <option value="temp" ${weaponSlot === 'temp' ? 'selected' : ''}>Temporary</option>
        </select>
        <label>Latency (ms):</label><input type="number" id="set-latency" value="${refreshLatency}">
        <button id="save-settings" style="background:#006400; color:white; padding:8px; border:none; cursor:pointer;">SAVE</button>
        <button id="close-settings" style="background:none; color:#888; border:none; cursor:pointer;">Close</button>
    `;
    document.body.appendChild(settingsMenu);

    let hospitalTimestamp = 0;
    const targetID = new URLSearchParams(window.location.search).get('user2ID');

    function updateApiData() {
        if (targetID && apiKey) {
            fetch(`https://api.torn.com/user/${targetID}?selections=profile&key=${apiKey}`)
                .then(res => res.json())
                .then(data => { if (data.status?.until) hospitalTimestamp = data.status.until * 1000; });
        }
    }
    updateApiData();
    setInterval(updateApiData, 3000);

    function tick() {
        const diff = hospitalTimestamp - Date.now();
        let status = diff > 0 ? `T-MINUS: ${(diff/1000).toFixed(2)}s` : "READY";
        if (diff > 0 && diff <= refreshLatency) {
            statsDiv.style.background = "#004d00";
            status = "REFRESH NOW!";
        } else { statsDiv.style.background = "rgba(0,0,0,0.9)"; }

        statsDiv.innerHTML = `<div style="font-weight:bold;">${status}</div>
            <div style="font-size:10px; color:#888; margin-top:4px;">LOAD: ${lastLoadTime}ms<br>PRESS 'S' FOR SETTINGS</div>`;
        requestAnimationFrame(tick);
    }
    tick();

    // --- Listeners ---
    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 's' && e.target.tagName !== 'INPUT') settingsMenu.style.display = 'flex';
    });

    document.addEventListener('click', (e) => {
        if (e.target.id === 'close-settings') settingsMenu.style.display = 'none';
        if (e.target.id === 'save-settings') {
            GM_setValue('torn_api_key', document.getElementById('set-api-key').value.trim());
            GM_setValue('user_latency', parseInt(document.getElementById('set-latency').value));
            GM_setValue('target_weapon_slot', document.getElementById('set-weapon-slot').value);
            location.reload();
        }
        // If they click our fake overlay, we click the REAL button for them
        if (e.target.classList.contains('custom-attack-overlay')) {
            const realBtn = document.querySelector('button.torn-btn.silver[type="submit"]');
            if (realBtn) realBtn.click();
        }
    });

    // --- The "Shadow" Observer ---
    const observer = new MutationObserver(() => {
        const targetSelector = SLOT_MAP[weaponSlot] || SLOT_MAP['primary'];
        const weaponWrapper = document.querySelector(targetSelector);
        const realBtn = document.querySelector('button.torn-btn.silver[type="submit"]');

        if (weaponWrapper && realBtn && !document.querySelector('.custom-attack-overlay')) {
            GM_setValue('last_load_speed', Math.round(performance.now() - startTime));

            // Create a "Proxy" button instead of moving the real one
            const proxyBtn = document.createElement('div');
            proxyBtn.className = 'custom-attack-overlay';
            proxyBtn.innerHTML = "START FIGHT";

            if (getComputedStyle(weaponWrapper).position === 'static') weaponWrapper.style.position = 'relative';
            weaponWrapper.appendChild(proxyBtn);

            // Keep the real button on the page but hidden so Torn doesn't crash
            realBtn.style.opacity = "0";
            realBtn.style.pointerEvents = "none";
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();