// ==UserScript==
// @name         Torn Attack Mover - Mobile Version
// @namespace    http://tampermonkey.net/
// @version      2/1
// @description  Adds a tactical info card with 1-tap weapon switching and defender status.
// @author       bap
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563739/Torn%20Attack%20Mover%20-%20Mobile%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/563739/Torn%20Attack%20Mover%20-%20Mobile%20Version.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_WEAPON = 'torn_weapon_overlay_pref';
    const STORAGE_KEY_API = 'torn_api_key_v2';
    const OPTIONS = ['weapon_main', 'weapon_second', 'weapon_melee'];

    let currentTargetId = GM_getValue(STORAGE_KEY_WEAPON, 'weapon_main');
    let apiKey = GM_getValue(STORAGE_KEY_API, '');
    const defenderID = new URLSearchParams(window.location.search).get('user2ID');

    GM_addStyle(`
        .tm-tactical-card {
            background: linear-gradient(180deg, #333 0%, #222 100%);
            border: 1px solid #444;
            border-radius: 5px;
            margin: 10px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.5);
        }

        .tm-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            color: #ddd;
            border-bottom: 1px solid #444;
            padding-bottom: 8px;
        }

        .tm-status-val { font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-green { color: #85b200; }
        .status-red { color: #ff5e5e; }
        .status-orange { color: #ff8e38; }

        .tm-selector-row {
            display: flex;
            gap: 8px;
        }

        .tm-btn {
            flex: 1;
            background: #444;
            background: linear-gradient(180deg, #555 0%, #333 100%);
            border: 1px solid #222;
            color: #bbb;
            padding: 10px 0;
            text-align: center;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
        }

        .tm-btn.active {
            background: linear-gradient(180deg, #ff9933 0%, #e67300 100%);
            color: #fff;
            border-color: #b35900;
            box-shadow: 0 0 8px rgba(255, 142, 53, 0.4);
        }

        /* Proxy Button Styling */
        .tm-proxy-button {
            position: absolute !important;
            top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            z-index: 99999 !important;
            display: flex !important; align-items: center; justify-content: center !important;
            font-weight: bold !important;
            border-radius: 4px !important;
            text-transform: uppercase;
            font-size: 20px !important;
            color: #fff !important;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.9);
            cursor: pointer !important;
        }
        .btn-orange { background: linear-gradient(180deg, #f2ad55 0%, #e09130 100%) !important; border: 1px solid #99611d !important; }
        .btn-red { background: linear-gradient(180deg, #b22222 0%, #801515 100%) !important; border: 1px solid #5e0000 !important; }

        .tm-hidden-original { opacity: 0 !important; pointer-events: none !important; position: absolute !important; }
    `);

    function formatLastAction(timestamp) {
        const diff = Math.floor(Date.now() / 1000) - timestamp;
        if (diff < 60) return `${diff}s`;
        return `${Math.floor(diff / 60)}m`;
    }

    function updateCard(profile = null) {
        let card = document.getElementById('tm-tactical-card');
        if (!card) {
            card = document.createElement('div');
            card.id = 'tm-tactical-card';
            card.className = 'tm-tactical-card';
            const topSection = document.querySelector('.topSection___U7sVi');
            if (topSection) topSection.after(card);
            else return;
        }

        const lastAct = profile ? formatLastAction(profile.last_action.timestamp) : '...';
        const statusDesc = profile ? (profile.status.state === 'Okay' ? 'Okay' : profile.status.description) : 'SYNCING...';
        const statusColor = profile ? `status-${profile.status.color}` : '';

        card.innerHTML = `
            <div class="tm-info-row">
                <span>ACT: <span class="tm-status-val">${lastAct}</span></span>
                <span class="tm-status-val ${statusColor}">${statusDesc}</span>
                <span style="cursor:pointer; font-size: 16px;" onclick="location.reload()">🔄</span>
            </div>
            <div class="tm-selector-row">
                <div class="tm-btn ${currentTargetId === 'weapon_main' ? 'active' : ''}" data-id="weapon_main">Primary</div>
                <div class="tm-btn ${currentTargetId === 'weapon_second' ? 'active' : ''}" data-id="weapon_second">Secondary</div>
                <div class="tm-btn ${currentTargetId === 'weapon_melee' ? 'active' : ''}" data-id="weapon_melee">Melee</div>
            </div>
        `;

        card.querySelectorAll('.tm-btn').forEach(btn => {
            btn.onclick = () => {
                currentTargetId = btn.getAttribute('data-id');
                GM_setValue(STORAGE_KEY_WEAPON, currentTargetId);
                clearAllProxies();
                updateCard(profile);
            };
        });
    }

    function clearAllProxies() {
        document.querySelectorAll('.tm-proxy-button').forEach(el => el.remove());
        document.querySelectorAll('.tm-hidden-original').forEach(el => el.classList.remove('tm-hidden-original'));
    }

    function moveButtons() {
        const target = document.getElementById(currentTargetId);
        if (!target) return;

        if (getComputedStyle(target).position === 'static') target.style.position = 'relative';

        document.querySelectorAll('button[type="submit"]').forEach(realBtn => {
            // If button is already hidden or is one of the "Attack" buttons inside the fight, ignore it
            if (realBtn.classList.contains('tm-hidden-original') || realBtn.offsetParent === null) return;

            const text = realBtn.innerText.toLowerCase().trim();
            // We only want to move the PRE-FIGHT buttons (Start Fight, Mug, Leave)
            if (text === 'start fight' || text === 'mug' || text === 'leave') {
                const proxy = document.createElement('div');
                proxy.className = `tm-proxy-button ${text === 'mug' ? 'btn-red' : 'btn-orange'}`;
                proxy.innerHTML = text.toUpperCase();

                proxy.onclick = (e) => {
                    e.stopPropagation();
                    // CRITICAL: Remove the proxy immediately so it doesn't block the actual weapon controls after clicking
                    clearAllProxies();
                    realBtn.click();
                };

                target.appendChild(proxy);
                realBtn.classList.add('tm-hidden-original');
            }
        });
    }

    function fetchStatus() {
        if (!apiKey || !defenderID) return;
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/user/${defenderID}/profile?key=${apiKey}`,
            onload: (r) => {
                try {
                    const data = JSON.parse(r.responseText);
                    if (data.profile) updateCard(data.profile);
                } catch (e) {}
            }
        });
    }

    if (!apiKey) {
        apiKey = prompt("Enter Torn API Key:");
        if (apiKey) GM_setValue(STORAGE_KEY_API, apiKey);
    }

    // High frequency check for button movement, low frequency for API status
    setInterval(moveButtons, 250);
    setInterval(() => {
        if (!document.getElementById('tm-tactical-card')) updateCard();
    }, 1000);

    fetchStatus();
})();