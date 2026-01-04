// ==UserScript==
// @name         Achievement Scanner 🏆
// @namespace    popmundo.achievement.scanner
// @version      1.7
// @description  Robust scanner with dynamic clickable character results
// @author       Gemini
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/ItemDetails/270217003
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      *.popmundo.com
// @downloadURL https://update.greasyfork.org/scripts/560879/Achievement%20Scanner%20%F0%9F%8F%86.user.js
// @updateURL https://update.greasyfork.org/scripts/560879/Achievement%20Scanner%20%F0%9F%8F%86.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // --- CONFIGURATION ---
    const DELAY_MS = 1500;
    let isScanning = false;

    // --- UI SETUP ---
    function createScannerUI() {
        if (document.getElementById('ach-scanner-box')) return;

        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
            #ach-scanner-box {
                position: fixed; bottom: 20px; right: 20px; width: 220px;
                background: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px;
                padding: 14px; font-family: 'Inter', sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 99999;
                display: flex; flex-direction: column; gap: 10px;
            }
            .scanner-header { font-size: 10px; font-weight: 600; color: #9e9e9e; text-transform: uppercase; display: flex; justify-content: space-between; align-items: center; }
            .scanner-input-group { display: flex; flex-direction: column; gap: 5px; }
            .scanner-input-group label { font-size: 10px; font-weight: 600; color: #616161; }
            .scanner-input {
                width: 100%; border: 1px solid #eee; border-radius: 6px;
                padding: 6px; font-size: 11px; font-family: 'Inter', sans-serif;
                box-sizing: border-box;
            }
            #scanner-ids { height: 60px; resize: none; }

            .status-row { display: flex; align-items: center; gap: 10px; margin-top: 5px; }
            .indicator { width: 10px; height: 10px; border-radius: 50%; background: #bdbdbd; transition: background 0.3s; }
            .status-label { font-size: 13px; font-weight: 600; color: #424242; }

            #scanner-results {
                max-height: 150px; overflow-y: auto; border-top: 1px solid #f5f5f5;
                margin-top: 5px; padding-top: 5px; font-size: 11px;
            }
            .res-item { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #fafafa; }
            .res-link {
                text-decoration: none; color: #2980b9; font-weight: 600;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 160px;
            }
            .res-link:hover { text-decoration: underline; color: #3498db; }

            .btn-action {
                background: #f5f5f5; border: 1px solid #ddd; border-radius: 6px;
                padding: 8px; font-size: 11px; font-weight: 600; color: #666;
                cursor: pointer; transition: all 0.2s;
            }
            .btn-action:hover { background: #eee; }
            .btn-action:disabled { opacity: 0.5; cursor: not-allowed; }

            .state-idle { background: #bdbdbd; }
            .state-running { background: #6dc98f; box-shadow: 0 0 8px #6dc98f; animation: pulse 1.5s infinite; }
            .state-complete { background: #aecde5; }
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
        `;
        document.head.appendChild(style);

        const box = document.createElement('div');
        box.id = 'ach-scanner-box';
        box.innerHTML = `
            <div class="scanner-header"><span>Achievement Scanner</span></div>
            <div class="scanner-input-group">
                <label>ACHIEVEMENT TITLE</label>
                <input type="text" id="scanner-title" class="scanner-input" placeholder="Celebrated Halloween">
            </div>
            <div class="scanner-input-group">
                <label>CHAR IDs</label>
                <textarea id="scanner-ids" class="scanner-input" placeholder="2887796, 2887791..."></textarea>
            </div>
            <div class="status-row">
                <div id="scanner-indicator" class="indicator state-idle"></div>
                <div id="scanner-status" class="status-label">Ready</div>
            </div>
            <div id="scanner-results"></div>
            <button id="scanner-btn" class="btn-action">Start Scanning</button>
        `;
        document.body.appendChild(box);

        document.getElementById('scanner-btn').addEventListener('click', startScan);
    }

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function checkCharacter(id, targetTitle) {
        // Detect origin dynamically (e.g., https://74.popmundo.com or https://www.popmundo.com)
        const base = window.location.origin;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${base}/World/Popmundo.aspx/Character/Achievements/${id}`,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const target = targetTitle.toLowerCase().trim();

                    let charName = id;
                    const nameNode = doc.querySelector('.playername') || doc.querySelector('h2') || doc.querySelector('h1');
                    if (nameNode) charName = nameNode.innerText.trim().split('\n')[0];

                    let found = false;
                    const rows = doc.querySelectorAll('#tableach tbody tr');
                    rows.forEach(row => {
                        if (row.innerText.toLowerCase().includes(target)) found = true;
                    });

                    if (!found) {
                        const achDivs = doc.querySelectorAll('.Achievement');
                        for (let div of achDivs) {
                            if (div.getAttribute('title')?.toLowerCase().includes(target)) {
                                found = true;
                                break;
                            }
                        }
                    }

                    resolve({ id, name: charName, hasAch: found });
                },
                onerror: () => resolve({ id, name: id, hasAch: false, error: true })
            });
        });
    }

    async function startScan() {
        if (isScanning) return;

        const titleInput = document.getElementById('scanner-title');
        const idsInput = document.getElementById('scanner-ids');
        const btn = document.getElementById('scanner-btn');
        const indicator = document.getElementById('scanner-indicator');
        const status = document.getElementById('scanner-status');
        const results = document.getElementById('scanner-results');

        const title = titleInput.value.trim();
        const ids = idsInput.value.split(/[\s,]+/).map(i => i.trim()).filter(i => i.length > 0);

        if (!title || ids.length === 0) return;

        isScanning = true;
        btn.disabled = true;
        results.innerHTML = "";
        indicator.className = "indicator state-running";

        // Get dynamic base for links
        const base = window.location.origin;

        for (let i = 0; i < ids.length; i++) {
            status.textContent = `Checking ${i + 1}/${ids.length}`;
            const res = await checkCharacter(ids[i], title);

            const item = document.createElement('div');
            item.className = 'res-item';

            // Dynamic link without hardcoding the subdomain
            item.innerHTML = `
                <a href="${base}/World/Popmundo.aspx/Character/${res.id}"
                   target="_blank" class="res-link" title="Open ${res.name}">
                   ${res.name}
                </a>
                <span>${res.hasAch ? '✔️' : '❌'}</span>
            `;
            results.prepend(item);

            if (i < ids.length - 1) await wait(DELAY_MS);
        }

        isScanning = false;
        btn.disabled = false;
        indicator.className = "indicator state-complete";
        status.textContent = "Finished";
    }

    createScannerUI();
})();