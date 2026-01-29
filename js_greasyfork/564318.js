
// ==UserScript==
// @name         Anti-bot Solver (Trump faucet)
// @namespace    Anti-bot links Auto Solver
// @version      1.0
// @description  Anti-bot links Auto mode
// @author       Shnethan
// @match        *://earn-trump.com/*
// @icon         https://earn-trump.com/favicon.ico
// @license      GPL-3.0-or-later
// @grant        none
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/564318/Anti-bot%20Solver%20%28Trump%20faucet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564318/Anti-bot%20Solver%20%28Trump%20faucet%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let c = false;

    const g = () => {
        let t = document.body.textContent || "";
        let m = t.match(/Click (?:in )?this order:\s*([A-Z,\s→-]+)/i)
             || t.match(/([A-Z]{2,})[,\s]+([A-Z]{2,})[,\s]+([A-Z]{2,})/);
        if (!m) return null;
        return m[1]
            ? m[1].toUpperCase().split(/[,→\-\s]+/).map(x => x.trim()).filter(Boolean)
            : [m[1], m[2], m[3]];
    };

    const w = x => {
        let e = document.querySelectorAll('button,a,div,span,p,li,td');
        for (let el of e) {
            if (el.textContent && el.textContent.toUpperCase().trim() === x) {
                k(el);
                return true;
            }
        }
        for (let el of e) {
            if (el.textContent && el.textContent.toUpperCase().includes(x)) {
                k(el);
                return true;
            }
        }
        return false;
    };

    const k = el => {
        try { el.click(); }
        catch { el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true })); }
        console.log("Clicked:", el.textContent.trim());
    };

    const s = a => a.forEach((x,i) => setTimeout(() => w(x), i*800));

    const i = () => {
        if (c) return;
        let a = g();
        if (a) { s(a); c = true; }
        else { setTimeout(i, 500); }
    };

    i();

})();
