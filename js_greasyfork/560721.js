// ==UserScript==
// @name          Bazaar Listed/Unlisted - Ghost srsbsns
// @namespace     http://torn.com/
// @version       40.5
// @description   Ghost mode memory when bazaar closed.
// @author        srsbsns
// @match         *://www.torn.com/bazaar.php*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_xmlhttpRequest
// @connect       api.torn.com
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/560721/Bazaar%20ListedUnlisted%20-%20Ghost%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/560721/Bazaar%20ListedUnlisted%20-%20Ghost%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue('tm_api_key', '');
    if (!apiKey) {
        apiKey = prompt("Please enter your Torn API Key for Bazaar Sync:");
        if (apiKey) GM_setValue('tm_api_key', apiKey.trim());
    }

    const syncLabel = document.createElement('div');
    syncLabel.style = `position: fixed; bottom: 10px; left: 10px; background: rgba(0, 0, 0, 0.8); color: #77dd77; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-family: Tahoma; z-index: 9999; border: 1px solid rgba(255, 255, 255, 0.2); pointer-events: none;`;
    document.body.appendChild(syncLabel);

    function syncWithAPI() {
        const key = GM_getValue('tm_api_key', '');
        if (!key) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=bazaar,profile&key=${key}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) return;

                    const bazaarData = data.bazaar || {};
                    const itemsArray = Array.isArray(bazaarData) ? bazaarData : Object.values(bazaarData);

                    const hasItems = itemsArray.length > 0;
                    const apiSaysOpen = parseInt(data.bazaar_is_open) === 1;
                    const actuallyOpen = apiSaysOpen || hasItems;

                    GM_setValue('bazaar_is_open_status', actuallyOpen);

                    if (actuallyOpen) {
                        const newStorage = {};
                        itemsArray.forEach(item => {
                            const id = item.ID || item.item_id;
                            if (id) newStorage[id] = item.quantity || item.amount;
                        });

                        GM_setValue('bazaar_master_list', JSON.stringify(newStorage));
                        GM_setValue('tm_last_sync_time', Date.now());

                        syncLabel.innerText = "Bazaar: Open (Live Sync)";
                        syncLabel.style.color = "#77dd77";
                    } else {
                        syncLabel.innerText = "Bazaar: Closed (Ghost Memory)";
                        syncLabel.style.color = "#ffb347";
                    }
                } catch (e) { console.error(e); }
            }
        });
    }

    function scanAndHighlight() {
        if (!window.location.hash.includes('/add')) return;

        const masterList = JSON.parse(GM_getValue('bazaar_master_list', '{}'));
        const isOpen = GM_getValue('bazaar_is_open_status', true);
        const inventoryImgs = document.querySelectorAll('img[src*="/items/"]');

        inventoryImgs.forEach(img => {
            const idMatch = img.src.match(/\/items\/(\d+)\//);
            if (!idMatch) return;

            const id = idMatch[1];
            const isListed = !!masterList[id];

            const oldLabel = img.parentElement.querySelector('.bazaar-status-label');
            const oldGhost = img.parentElement.querySelector('.bazaar-ghost-label');

            if (isOpen) {
                // --- BAZAAR OPEN (Blue/Red Outlines) ---
                if (oldGhost) oldGhost.remove();

                const color = isListed ? 'rgba(0, 100, 200, 0.7)' : 'rgba(220, 40, 40, 0.7)';
                const glowColor = isListed ? 'rgba(0, 100, 200, 0.5)' : 'rgba(220, 40, 40, 0.5)';

                img.style.setProperty('filter', `drop-shadow(0 0 5px ${glowColor})`, 'important');
                img.style.setProperty('outline', `2px solid ${color}`, 'important');
                img.style.setProperty('border-radius', '4px', 'important');

                if (isListed) {
                    if (!oldLabel) {
                        const label = document.createElement('div');
                        label.className = 'bazaar-status-label';
                        label.innerText = `x${masterList[id]}`;
                        label.style = `
                            position: absolute; bottom: 4px; right: 4px;
                            color: #ffffff; font-style: italic; font-size: 11px;
                            text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
                            background: rgba(30, 30, 30, 0.8);
                            padding: 1px 5px; border-radius: 3px;
                            pointer-events: none; z-index: 999;
                            line-height: 1; border: 1px solid rgba(255,255,255,0.2);
                        `;
                        img.parentElement.style.position = 'relative';
                        img.parentElement.appendChild(label);
                    }
                } else if (oldLabel) {
                    oldLabel.remove();
                }
            } else {
                // --- BAZAAR CLOSED (Subtle Ghost Labels) ---
                if (oldLabel) oldLabel.remove();

                img.style.setProperty('filter', 'none', 'important');
                img.style.setProperty('outline', 'none', 'important');

                if (isListed) {
                    if (!oldGhost) {
                        const ghost = document.createElement('div');
                        ghost.className = 'bazaar-ghost-label';
                        ghost.innerText = `x${masterList[id]}`; // Changed '+' to 'x'
                        // Styled to match original blue label layout but with yellow text
                        ghost.style = `
                            position: absolute; bottom: 4px; right: 4px;
                            color: #e0e000; font-style: italic; font-size: 11px;
                            text-shadow: 1px 1px 1px #000;
                            background: rgba(30, 30, 30, 0.8);
                            padding: 1px 5px; border-radius: 3px;
                            pointer-events: none; z-index: 999;
                            line-height: 1; border: 1px solid rgba(255,255,255,0.1);
                            opacity: 0.9;
                        `;
                        img.parentElement.style.position = 'relative';
                        img.parentElement.appendChild(ghost);
                    }
                } else if (oldGhost) {
                    oldGhost.remove();
                }
            }
        });
    }

    setInterval(syncWithAPI, 10000);
    setInterval(scanAndHighlight, 1000);
    syncWithAPI();
})();