// ==UserScript==
// @name         Anti-bot links solver (pitasks.com)
// @namespace    Anti-bot links Auto solver
// @version      0.4
// @description  Anti-nut links Auto mode
// @author       Shnethan
// @match        *://pitasks.com/*
// @icon         https://api.dicebear.com/7.x/avataaars/svg?seed=blackrider&backgroundColor=b6e3f4
// @license      GPL-3.0-or-later
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563891/Anti-bot%20links%20solver%20%28pitaskscom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563891/Anti-bot%20links%20solver%20%28pitaskscom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const e = () => {
        const p = document.querySelector('p[class*="text-"][class*="uppercase"][class*="font-black"]') ||
                  document.querySelector('p.mb-4') ||
                  [...document.querySelectorAll('p')].find(x => /order\s*:/i.test(x.textContent));
        if (!p) return null;
        const m = p.textContent.match(/order\s*[:]\s*([\d\s,]+)/i);
        const n = m ? m[1].split(/[\s,]+/).filter(y => /^\d{3}$/.test(y)) : [];
        return n.length >= 3 ? n : null;
    };

    const c = v => {
        for (const s of document.querySelectorAll('span.nut-link')) {
            if (s.textContent.trim() === v) {
                (typeof s.onclick === 'function' ? s.onclick : s.click).call(s);
                return true;
            }
        }
        return false;
    };

    const r = () => {
        const o = e();
        if (!o) return;
        let i = 0;
        const n = () => {
            if (i >= o.length) return;
            if (c(o[i])) i++;
            setTimeout(n, i ? 750 : 400);
        };
        setTimeout(n, 1500);
    };

    setTimeout(r, 1000);

    const z = new MutationObserver(() => {
        if (document.querySelector('span.nut-link')) r();
    });
    z.observe(document.body, { childList: true, subtree: true, characterData: true });

})();
