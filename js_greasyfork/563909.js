// ==UserScript==
// @name         Panda Captcha Solver (Upside down)
// @namespace    Panda Captcha Auto Solver
// @version      1.1
// @description  Auto-Upside-down panda captcha
// @author       Shnethan
// @match        *://pitasks.com/*
// @icon         https://usepanda.com/favicon.ico
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563909/Panda%20Captcha%20Solver%20%28Upside%20down%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563909/Panda%20Captcha%20Solver%20%28Upside%20down%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let s = false;

    function t() {
        if (s) return;

        const r = document.getElementById('robotBox');
        const v = document.getElementById('verifySection');

        if (r && v?.classList.contains('hidden')) {
            r.click();
            return;
        }

        if (v && !v.classList.contains('hidden')) {
            const u = document.querySelector('.cap-item.upside-down');
            if (u) {
                const o = u.getAttribute('onclick') || '';
                const m = o.match(/selectCap\((\d+),/);
                let i = m && m[1] ? parseInt(m[1], 10) : null;

                if (i !== null) {
                    try { window.selectCap?.(i, u); }
                    catch (e) { u.click(); }
                } else { u.click(); }

                s = true;
            }
        }
    }

    setTimeout(t, 600);

    const o = new MutationObserver((muts) => {
        if (s) { o.disconnect(); return; }
        for (const mut of muts) {
            if (
                mut.addedNodes.length > 0 ||
                (mut.target.id === 'verifySection' && mut.attributeName === 'class') ||
                mut.target.id === 'robotBox' ||
                mut.target.classList?.contains('cap-item')
            ) { t(); break; }
        }
    });

    o.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style','hidden'] });

    setTimeout(() => { o.disconnect(); }, 5000);

})();
