// ==UserScript==
// @name          Bazaar Listed/Unlisted with API by srsbsns
// @namespace     http://torn.com/
// @version       39.0
// @description   Visual Bazaar tool with "Last Synced" timer.
// @author        srsbsns
// @match         *://www.torn.com/bazaar.php*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_xmlhttpRequest
// @connect       api.torn.com
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/560672/Bazaar%20ListedUnlisted%20with%20API%20by%20srsbsns.user.js
// @updateURL https://update.greasyfork.org/scripts/560672/Bazaar%20ListedUnlisted%20with%20API%20by%20srsbsns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue('tm_api_key', '');
    if (!apiKey) {
        apiKey = prompt("Please enter your Torn API Key for Bazaar Sync:");
        if (apiKey) GM_setValue('tm_api_key', apiKey.trim());
    }

    // Create the Timer UI Element
    const syncLabel = document.createElement('div');
    syncLabel.id = 'tm-sync-timer';
    syncLabel.style = `
        position: fixed;
        bottom: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.5);
        color: #77dd77;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-family: Tahoma, sans-serif;
        font-weight: normal;
        z-index: 9999;
        border: 1px solid rgba(255, 255, 255, 0.1);
        pointer-events: none;
        display: none;
    `;
    syncLabel.innerText = "Bazaar Sync: Initializing...";
    document.body.appendChild(syncLabel);

    function updateTimerDisplay() {
        const hash = window.location.hash;
        if (!hash.includes('/add')) {
            syncLabel.style.display = 'none';
            return;
        } else {
            syncLabel.style.display = 'block';
        }

        const lastSync = GM_getValue('tm_last_sync_time', 0);
        if (lastSync === 0) return;

        const secondsAgo = Math.floor((Date.now() - lastSync) / 1000);
        syncLabel.innerText = `Bazaar Sync: ${secondsAgo}s ago`;

        // Change color to orange if data is older than 2 minutes
        syncLabel.style.color = secondsAgo > 120 ? '#ffb347' : '#77dd77';
    }

    function syncWithAPI() {
        const key = GM_getValue('tm_api_key', '');
        if (!key) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=bazaar&key=${key}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) {
                        syncLabel.innerText = "Bazaar Sync: API Error";
                        syncLabel.style.color = "#ff4444";
                        return;
                    }

                    const bazaarItems = data.bazaar || [];
                    const newStorage = {};

                    bazaarItems.forEach(item => {
                        const id = item.ID || item.item_id;
                        if (id) newStorage[id] = item.quantity || item.amount;
                    });

                    GM_setValue('bazaar_api_storage', JSON.stringify(newStorage));
                    GM_setValue('tm_last_sync_time', Date.now());
                    updateTimerDisplay();

                } catch (e) { console.error("Bazaar Sync Error", e); }
            }
        });
    }

    function scanAndHighlight() {
        const hash = window.location.hash;
        if (!hash.includes('/add')) return;

        const storedData = JSON.parse(GM_getValue('bazaar_api_storage', '{}'));
        const inventoryImgs = document.querySelectorAll('img[src*="/items/"]');

        inventoryImgs.forEach(img => {
            const idMatch = img.src.match(/\/items\/(\d+)\//);
            if (!idMatch) return;

            const id = idMatch[1];
            const isListed = !!storedData[id];

            const color = isListed ? 'rgba(0, 100, 200, 0.7)' : 'rgba(220, 40, 40, 0.7)';
            const glowColor = isListed ? 'rgba(0, 100, 200, 0.5)' : 'rgba(220, 40, 40, 0.5)';

            if (!img.dataset.processed || img.dataset.listedStatus !== String(isListed)) {
                const oldLabel = img.parentElement.querySelector('.bazaar-status-label');
                if (oldLabel) oldLabel.remove();

                img.style.setProperty('filter', `drop-shadow(0 0 5px ${glowColor})`, 'important');
                img.style.setProperty('outline', `2px solid ${color}`, 'important');
                img.style.setProperty('border-radius', '4px', 'important');

                if (isListed) {
                    const label = document.createElement('div');
                    label.className = 'bazaar-status-label';
                    label.innerText = `x${storedData[id]}`;
                    label.style = `
                        position: absolute; bottom: 4px; right: 4px;
                        color: #ffffff; font-style: italic; font-size: 11px;
                        text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
                        background: rgba(30, 30, 30, 0.8);
                        padding: 1px 5px; border-radius: 3px;
                        pointer-events: none; z-index: 999;
                        line-height: 1; border: 1px solid rgba(255,255,255,0.2);
                    `;
                    if (img.parentElement) {
                        img.parentElement.style.position = 'relative';
                        img.parentElement.appendChild(label);
                    }
                }
                img.dataset.processed = "true";
                img.dataset.listedStatus = String(isListed);
            }
        });
    }

    // Initial Sync and Loops
    syncWithAPI();
    setInterval(syncWithAPI, 60000);   // API Sync every 60s
    setInterval(updateTimerDisplay, 1000); // UI Timer update every 1s
    setInterval(scanAndHighlight, 1000);   // Visual Highlight check every 1s
})();