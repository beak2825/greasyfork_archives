// ==UserScript==
// @name         P3 — Item Auto Opener (Continuous)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically open items repeatedly until a set quantity is reached, with a progress bar and stop button.
// @match        https://pocketpumapets.com/inventory.php*
// @icon         https://pocketpumapets.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT 

// @downloadURL https://update.greasyfork.org/scripts/554933/P3%20%E2%80%94%20Item%20Auto%20Opener%20%28Continuous%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554933/P3%20%E2%80%94%20Item%20Auto%20Opener%20%28Continuous%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Persisted state across page reloads ---
    let totalToOpen = GM_getValue('autoOpen_total', 0);
    let openedCount = GM_getValue('autoOpen_opened', 0);
    let running = GM_getValue('autoOpen_running', false);

    // --- UI setup ---
    const ui = document.createElement('div');
    ui.style.position = 'fixed';
    ui.style.top = '10px';
    ui.style.right = '10px';
    ui.style.zIndex = '999999';
    ui.style.background = 'rgba(0, 0, 0, 0.8)';
    ui.style.color = '#fff';
    ui.style.padding = '10px 15px';
    ui.style.borderRadius = '8px';
    ui.style.fontFamily = 'Arial, sans-serif';
    ui.style.textAlign = 'center';
    ui.style.width = '180px';
    ui.innerHTML = `
        <div style="margin-bottom: 5px; font-weight: bold;">Auto Opener</div>
        <label>Open quantity:</label><br>
        <input id="openCount" type="number" min="1" value="${totalToOpen || 1}" style="width: 60px; text-align: center; margin: 4px 0;"><br>
        <button id="startOpen" style="background:#28a745;color:white;border:none;border-radius:5px;padding:4px 8px;margin-top:3px;">Start</button>
        <button id="stopOpen" style="background:#dc3545;color:white;border:none;border-radius:5px;padding:4px 8px;margin-top:3px;">Stop</button>
        <div id="progress" style="margin-top:5px;font-size:12px;">Idle</div>
        <div id="barOuter" style="margin-top:4px;height:6px;width:100%;background:#444;border-radius:3px;">
          <div id="barInner" style="height:6px;width:0%;background:#28a745;border-radius:3px;"></div>
        </div>
    `;
    document.body.appendChild(ui);

    const progressText = ui.querySelector('#progress');
    const barInner = ui.querySelector('#barInner');

    function updateProgress() {
        const percent = totalToOpen > 0 ? Math.min((openedCount / totalToOpen) * 100, 100) : 0;
        progressText.textContent = running
            ? `Opening ${openedCount}/${totalToOpen}...`
            : 'Stopped';
        barInner.style.width = percent + '%';
    }

    // --- Find and perform open action ---
    async function performOpen() {
        const selects = Array.from(document.querySelectorAll('select.inventmenu'));
        const openOption = selects
            .map(sel => {
                const opt = Array.from(sel.options).find(o => /open/i.test(o.textContent));
                return opt ? { sel, opt } : null;
            })
            .filter(Boolean)[0];

        if (!openOption) {
            alert('No openable item found on this page.');
            stopOpening();
            return;
        }

        openedCount++;
        GM_setValue('autoOpen_opened', openedCount);
        updateProgress();

        // Trigger the open action by navigating to its URL
        const url = openOption.opt.value;
        window.location.href = url;
    }

    // --- Main opener logic ---
    async function startOpening() {
        totalToOpen = parseInt(document.querySelector('#openCount').value) || 1;
        openedCount = 0;
        running = true;

        GM_setValue('autoOpen_total', totalToOpen);
        GM_setValue('autoOpen_opened', openedCount);
        GM_setValue('autoOpen_running', true);

        updateProgress();
        performOpen();
    }

    function stopOpening() {
        running = false;
        GM_setValue('autoOpen_running', false);
        progressText.textContent = 'Stopped';
        updateProgress();
    }

    ui.querySelector('#startOpen').addEventListener('click', startOpening);
    ui.querySelector('#stopOpen').addEventListener('click', stopOpening);

    updateProgress();

    // --- Resume automatically after item opens ---
    const currentURL = window.location.href;
    if (/open_item\.php/.test(currentURL)) {
        if (running) {
            // Wait a bit for the open animation or server redirect, then return to inventory
            setTimeout(() => {
                window.location.href = document.referrer.includes('inventory.php')
                    ? document.referrer
                    : '/inventory.php';
            }, 1500 + Math.random() * 1000);
        }
    } else if (/inventory\.php/.test(currentURL) && running) {
        if (openedCount < totalToOpen) {
            // Wait a short delay before next open to avoid hammering
            setTimeout(performOpen, 1000 + Math.random() * 500);
        } else {
            stopOpening();
            alert(`✅ Finished opening ${openedCount} item${openedCount === 1 ? '' : 's'}!`);
        }
    }
})();
