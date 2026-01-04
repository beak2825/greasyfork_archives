// ==UserScript==
// @name         eqe fmpm - e-qe.online Shortcuts
// @namespace    https://e-qe.online/
// @version      3.0
// @description  ←→↑↓ → instant navigation • Space/`/Enter → check/submit
// @match        https://e-qe.online/*
// @match        https://www.e-qe.online/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559366/eqe%20fmpm%20-%20e-qeonline%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/559366/eqe%20fmpm%20-%20e-qeonline%20Shortcuts.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const nextBtn = () => document.querySelector('button[aria-label*="next" i], button[aria-label="Next question" i]');
    const prevBtn = () => document.querySelector('button[aria-label*="previous" i], button[aria-label="Previous question" i]');
    const checkBtn = () => [...document.querySelectorAll('button')]
        .find(b => /check|submit/i.test(b.textContent?.trim()) && !b.disabled);

    const keyHandler = e => {
        // Ignore if focus is in input fields
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

        // Check / Submit Answer with Space, ` or Enter
        if (e.key === ' ' || e.key === '`' || e.key === 'Enter') {
            const btn = checkBtn();
            if (btn) {
                e.preventDefault();
                e.stopImmediatePropagation();
                btn.click();
            }
            return;
        }

        // Navigation with arrows only (no Ctrl required)
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextBtn()?.click();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            prevBtn()?.click();
        }
    };

    const init = () => {
        document.addEventListener('keydown', keyHandler, true);
    };

    // Bullet-proof injection
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    new MutationObserver(init).observe(document.documentElement, { childList: true, subtree: true });

    // Extra safety timeouts
    [500, 1500, 4000, 8000].forEach(t => setTimeout(init, t));
})();