// ==UserScript==
// @name         P3 - Auto Craft (Stops on Exact Failure)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Auto-craft continuously using AJAX; stops automatically on quantity 0 or specific failure message.
// @match        https://pocketpumapets.com/crafting.php*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/555032/P3%20-%20Auto%20Craft%20%28Stops%20on%20Exact%20Failure%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555032/P3%20-%20Auto%20Craft%20%28Stops%20on%20Exact%20Failure%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const AUTO_DELAY = 153; // ms delay between crafts

    const craftForm = document.querySelector('#craft_form');
    const craftButton = document.querySelector('#craft_submit');
    if (!craftForm || !craftButton) return console.log('Craft form/button not found.');

    // --- UI BAR ---
    const bar = document.createElement('div');
    Object.assign(bar.style, {
        position: 'fixed',
        top: '6px',
        right: '6px',
        background: 'rgba(45,62,31,0.96)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        zIndex: '99999',
        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px'
    });

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '0';
    qtyInput.value = 1;
    Object.assign(qtyInput.style, { width: '70px', padding: '6px', borderRadius: '6px', border: '1px solid #333', fontWeight: '600', textAlign: 'center' });

    const startBtn = document.createElement('button');
    startBtn.textContent = '▶ Start';
    Object.assign(startBtn.style, { backgroundColor: '#2e8b57', color: 'white', border: '2px solid rgba(0,0,0,0.3)', borderRadius: '6px', padding: '8px 12px', fontWeight: '600', cursor: 'pointer' });

    const stopBtn = document.createElement('button');
    stopBtn.textContent = '⏹ Stop';
    Object.assign(stopBtn.style, { backgroundColor: '#7b3535', color: 'white', border: '2px solid rgba(0,0,0,0.3)', borderRadius: '6px', padding: '8px 12px', fontWeight: '600', cursor: 'pointer' });

    const status = document.createElement('div');
    status.textContent = 'Status: Stopped';
    status.style.fontWeight = '700';
    status.style.minWidth = '200px';

    bar.append('Qty:', qtyInput, startBtn, stopBtn, status);
    document.body.appendChild(bar);

    // --- STATE ---
    let autoCraftActive = false;
    let totalQty = 0;
    let remaining = 0;
    let crafted = 0;

    function updateStatus() {
        if (autoCraftActive) {
            status.textContent = `Crafted: ${crafted} | Remaining: ${remaining === 0 ? '∞' : remaining}`;
        } else {
            status.textContent = 'Status: Stopped';
        }
    }

    function canCraft() {
        return craftButton && !craftButton.disabled && window.getComputedStyle(craftButton).display !== 'none';
    }

    async function doCraft() {
        if (!autoCraftActive) return;
        if (!canCraft()) {
            autoCraftActive = false;
            updateStatus();
            alert('Craft button unavailable. Auto-craft stopped.');
            return;
        }

        if (remaining === 0 && totalQty !== 0) {
            autoCraftActive = false;
            updateStatus();
            alert('Completed all crafts. Auto-craft stopped.');
            return;
        }

        if (remaining > 0) remaining--;
        crafted++;
        updateStatus();

        const formData = new FormData(craftForm);

        try {
            const response = await fetch(craftForm.action, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const text = await response.text();

            // Stop if specific error message appears
            if (text.includes('ERROR: You do not have ')) {
                autoCraftActive = false;
                updateStatus();
                alert('Craft failed: not enough materials. Auto-craft stopped.');
                return;
            }

        } catch (err) {
            console.error('Craft failed:', err);
            autoCraftActive = false;
            updateStatus();
            alert('Craft request failed. Auto-craft stopped.');
            return;
        }

        setTimeout(doCraft, AUTO_DELAY);
    }

    // --- BUTTON HANDLERS ---
    startBtn.addEventListener('click', () => {
        totalQty = parseInt(qtyInput.value) || 0;
        remaining = totalQty;
        crafted = 0;
        autoCraftActive = true;
        updateStatus();
        doCraft();
    });

    stopBtn.addEventListener('click', () => {
        autoCraftActive = false;
        updateStatus();
    });

})();
