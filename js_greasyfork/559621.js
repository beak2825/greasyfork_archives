// ==UserScript==
// @name         Farm RPG Frozen Fishing Detection
// @version      1.1.9
// @description  Detects Frozen Fish
// @author       ClientCoin
// @match        http*://*farmrpg.com/index.php*
// @match        http*://*farmrpg.com/*
// @match        http*://*alpha.farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @namespace    welcometothejunglewehavefunand541games
// @downloadURL https://update.greasyfork.org/scripts/559621/Farm%20RPG%20Frozen%20Fishing%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/559621/Farm%20RPG%20Frozen%20Fishing%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const TOTAL_NETS = 120000;
    const UPDATE_INTERVAL = 100;
    const DEBUG_VERBOSE = false;

    // --- Enforced Location Order ---
    const ENFORCED_ORDER = [
        "Farm Pond", "Small Pond", "Forest Pond", "Lake Tempest",
        "Small Island", "Crystal River", "Emerald Beach", "Vast Ocean",
        "Lake Minerva", "Large Island", "Pirate's Cove", "Glacier Lake"
    ];

    // --- State Variables ---
    let fishingInterval = null;
    let currentObservedId = null;
    let lastValidPercent = null;
    let traceCount = 0;

    const logTrace = (stage, message, data = null) => {
        if (DEBUG_VERBOSE) {
            traceCount++;
            const ts = new Date().toLocaleTimeString();
            const prefix = `[DEBUG:${stage}][#${traceCount}][${ts}]`;
            if (data) console.log(`${prefix} ${message}`, data);
            else console.log(`${prefix} ${message}`);
        }
    };

    const getAbbreviation = (name) => {
        const map = {
            "Farm Pond": "FPOND", "Small Pond": "SP", "Forest Pond": "FP",
            "Lake Tempest": "LT", "Small Island": "SI", "Crystal River": "CR",
            "Emerald Beach": "EB", "Vast Ocean": "VO", "Lake Minerva": "LM",
            "Large Island": "LI", "Pirate's Cove": "PC", "Glacier Lake": "GL"
        };
        return map[name] || name;
    };

    const saveToMemory = (id, fullName, completedPct) => {
        try {
            logTrace("STORAGE", `Saving Progress for: ${fullName} (${completedPct}%)`);
            let data = JSON.parse(GM_getValue('frpg_fishing_data', '{}'));
            data[id] = {
                fullName: fullName,
                shortName: getAbbreviation(fullName),
                completedPct: completedPct, // The raw value from the bar
                lastSeen: Date.now()
            };
            GM_setValue('frpg_fishing_data', JSON.stringify(data));
        } catch (e) {
            logTrace("ERROR", "Storage failure", e);
        }
    };

    const handleCopy = (mode) => {
        logTrace("CLIPBOARD", `Exporting ${mode}...`);
        try {
            const storedData = JSON.parse(GM_getValue('frpg_fishing_data', '{}'));
            const entries = Object.values(storedData);
            if (entries.length === 0) return;

            const sortedEntries = entries.sort((a, b) => {
                let idxA = ENFORCED_ORDER.indexOf(a.fullName);
                let idxB = ENFORCED_ORDER.indexOf(b.fullName);
                return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
            });

            let output = "";
            if (mode === 'detailed') {
                output = sortedEntries.map(item => {
                    const comp = parseFloat(item.completedPct);
                    const netsToGo = Math.ceil(((100 - comp) / 100) * TOTAL_NETS);
                    return `${item.fullName}: ${comp.toFixed(4)}% (${netsToGo.toLocaleString()} LNs to go)`;
                }).join('\n');
            } else {
                output = sortedEntries.map(item => {
                    const comp = parseFloat(item.completedPct);
                    const netsToGo = Math.ceil(((100 - comp) / 100) * TOTAL_NETS);
                    const kVal = Math.floor(netsToGo / 1000) + "k";
                    return `${item.shortName}: ${comp.toFixed(1)}%`;
                }).join('\n');
            }

            navigator.clipboard.writeText(output).then(() => {
                const btn = document.getElementById(mode === 'detailed' ? 'frpg-copy-det' : 'frpg-copy-sim');
                const old = btn.innerText;
                btn.innerText = "COPIED!";
                setTimeout(() => btn.innerText = old, 1200);
            });
        } catch (e) {
            logTrace("ERROR", "Clipboard failed", e);
        }
    };

    const ensureUI = (locName, targetParent) => {
        let container = document.getElementById('frpg-fishing-container');
        if (container && !targetParent.parentNode.contains(container)) {
            container.remove();
            container = null;
        }
        if (!container) {
            container = document.createElement('div');
            container.id = 'frpg-fishing-container';
            container.style.cssText = 'display: inline-block; margin-left: 15px; vertical-align: middle; line-height: 1.1; visibility: hidden;';
            container.innerHTML = `
                <div id="frpg-loc-display" style="color: #0099ff; font-size: 10px; font-weight: bold; text-transform: uppercase;">${locName}</div>
                <div id="frpg-pct-display" style="color: #66ff66; font-weight: bold; font-size: 20px;">...</div>
                <div id="frpg-nets-display" style="color: #ffffff; font-size: 11px; opacity: 0.9;">...</div>
                <div style="margin-top: 5px; display: flex; gap: 10px;">
                    <span id="frpg-copy-det" style="color: orange; font-size: 9px; text-decoration: underline; cursor: pointer;">COPY DETAILED</span>
                    <span id="frpg-copy-sim" style="color: #00ffcc; font-size: 9px; text-decoration: underline; cursor: pointer;">COPY SIMPLE</span>
                    <span id="frpg-clear-mem" style="color: #ff4444; font-size: 9px; text-decoration: underline; cursor: pointer;">CLEAR</span>
                </div>
            `;
            targetParent.parentNode.insertBefore(container, targetParent.nextSibling);
            document.getElementById('frpg-copy-det').onclick = (e) => { e.preventDefault(); handleCopy('detailed'); };
            document.getElementById('frpg-copy-sim').onclick = (e) => { e.preventDefault(); handleCopy('simple'); };
            document.getElementById('frpg-clear-mem').onclick = (e) => {
                if (confirm("Clear ALL fishing data?")) {
                    GM_setValue('frpg_fishing_data', '{}');
                    location.reload();
                }
            };
        }
        return container;
    };

    const runUpdate = () => {
        const activePage = document.querySelector('.page-on-center');
        if (!activePage) return;
        const consoleTxt = activePage.querySelector('#consoletxt');
        const navCenter = document.querySelector('.navbar-on-center .center.sliding');
        if (!consoleTxt || !navCenter) return;

        const locName = navCenter.textContent.split('\u00A0')[0].trim();
        const ui = ensureUI(locName, consoleTxt);

        const bar = activePage.querySelector("div[style*='clip-path: inset']");
        if (!bar) {
            if (ui.style.visibility !== 'hidden') ui.style.visibility = 'hidden';
            return;
        }

        const style = bar.getAttribute('style');
        const match = style.match(/inset\(\s*([\d.]+)/);

        if (match) {
            if (ui.style.visibility !== 'visible') ui.style.visibility = 'visible';

            const completedPct = parseFloat(match[1]); // The raw Progress %
            const remainingPct = 100 - completedPct;
            const netsToGo = Math.ceil((remainingPct / 100) * TOTAL_NETS);

            // Display Progress % in Green
            document.getElementById('frpg-pct-display').innerText = completedPct.toFixed(4) + "%";
            // Display Nets to Go in White
            document.getElementById('frpg-nets-display').innerText = netsToGo.toLocaleString() + " LNs to go";

            if (completedPct.toFixed(4) !== lastValidPercent) {
                saveToMemory(currentObservedId, locName, completedPct.toFixed(4));
                lastValidPercent = completedPct.toFixed(4);
                logTrace("LOGIC", `Update: ${locName} - ${completedPct.toFixed(4)}% Completed.`);
            }
        }
    };

    const stateCheck = () => {
        const activePage = document.querySelector('.page-on-center');
        if (!activePage) return;
        const isFishing = activePage.getAttribute('data-page')?.includes('fishing') || window.location.href.includes('fishing.php');
        const navLink = document.querySelector('.navbar-on-center a[href*="id="]');
        const locId = navLink ? new URL(navLink.href, window.location.origin).searchParams.get('id') : "0";

        if (isFishing) {
            if (locId !== currentObservedId) {
                logTrace("STATE", `ID Shift: ${currentObservedId} -> ${locId}`);
                currentObservedId = locId;
                const oldUI = document.getElementById('frpg-fishing-container');
                if (oldUI) oldUI.remove();
                lastValidPercent = null;
            }
            if (!fishingInterval) fishingInterval = setInterval(runUpdate, UPDATE_INTERVAL);
        } else if (fishingInterval) {
            clearInterval(fishingInterval);
            fishingInterval = null;
            const oldUI = document.getElementById('frpg-fishing-container');
            if (oldUI) oldUI.remove();
            currentObservedId = null;
        }
    };

    const init = () => {
        const target = document.querySelector("#fireworks");
        if (target) {
            new MutationObserver(() => stateCheck()).observe(target, { attributes: true, childList: true, subtree: true });
            stateCheck();
        } else {
            setTimeout(init, 1000);
        }
    };

    init();
})();