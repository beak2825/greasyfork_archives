// ==UserScript==
// @name         CS – Duplicate Pet Remover In Trades
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Instantly removes visually identical pets on CS trade pages with 1 click
// @match        https://www.chickensmoothie.com/trades/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chickensmoothie.com

// @downloadURL https://update.greasyfork.org/scripts/559577/CS%20%E2%80%93%20Duplicate%20Pet%20Remover%20In%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/559577/CS%20%E2%80%93%20Duplicate%20Pet%20Remover%20In%20Trades.meta.js
// ==/UserScript==

(() => {
    'use strict';

    /* ---------- UI ---------- */
    const btn = document.createElement('button');
    btn.textContent = '🧹 Remove Duplicate Pets';
    btn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        padding: 8px 12px;
        background: #b64cff;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
    `;
    document.body.appendChild(btn);

    btn.onclick = () => {
        btn.disabled = true;
        btn.textContent = 'Removing…';

        const seen = new Set();
        let removed = 0;

        document.querySelectorAll('.pet').forEach(pet => {
            const img = pet.querySelector('img');
            if (!img || !img.complete) return;

            // Visual fingerprint
            const key = [
                img.naturalWidth,
                img.naturalHeight,
                img.src.replace(/bg=[^&]+/, '') // ignore background
            ].join('|');

            if (seen.has(key)) {
                const removeBtn = pet.querySelector('input[type="submit"][value="Remove"]');
                if (removeBtn) {
                    removeBtn.click();
                    removed++;
                }
            } else {
                seen.add(key);
            }
        });

        btn.textContent = `Done! Removed ${removed}`;
        btn.disabled = false; // ✅ re-enable the button so it can be clicked again
    };
})();
