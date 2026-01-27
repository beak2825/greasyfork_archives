// ==UserScript==
// @name         Anti Captcha Solver
// @namespace    Anti Captcha Auto Solver
// @version      1.3
// @description  Auto-solve captcha
// @author       Shnethan
// @match        https://freeltc.online/*
// @icon         https://elixirforum.com/uploads/default/optimized/1X/4310e7de671d4920800063776e9b1f6dc268c692_2_32x32.ico
// @license      GPL-3.0-or-later
// @run-at       document-end
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/564096/Anti%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/564096/Anti%20Captcha%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        const c = document.querySelector('input[data-id="anticap-checkbox"]');
        if (!c) return;
        c.disabled = false;
        c.checked  = true;
        c.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, 1500);

    const s = ms => new Promise(r => setTimeout(r, ms));

    const w = async sel => {
        while (!document.querySelector(sel)) await s(300);
        return document.querySelector(sel);
    };

    const h = img => {
        const c = document.createElement('canvas');
        c.width = c.height = 16;
        const x = c.getContext('2d');
        x.drawImage(img, 0, 0, 16, 16);
        const d = x.getImageData(0, 0, 16, 16).data;
        return [...d].filter((_, i) => i % 4 !== 3);
    };

    const dist = (a, b) => a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0);

    (async () => {
        try {
            const err = document.querySelector('div[data-id="anticap-feedback"].error');
            if (err && err.textContent.includes('Wrong selection. Try again.')) {
                // location.reload();
                return;
            }

            const p = await w('.anticap-preview');
            await w('.anticap-grid img');

            const i = [...document.querySelectorAll('.anticap-grid img')];
            const t = h(p);

            let b, sc = Infinity;

            for (const x of i) {
                const v = dist(t, h(x));
                if (v < sc) sc = v, b = x;
            }

            if (!b) return;

            b.style.outline = '1px solid #2196F3';

            await s(5000);
            b.click();

        } catch (e) {}
    })();

})();
