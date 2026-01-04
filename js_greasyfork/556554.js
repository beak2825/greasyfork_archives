// ==UserScript==
// @name         Google Exclusions Dynamic Clean
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Blocks keywords and websites from Google search.
// @author       ScriptKing
// @match        https://www.google.com/search*
// @match        https://www.google.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/556554/Google%20Exclusions%20Dynamic%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/556554/Google%20Exclusions%20Dynamic%20Clean.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // =========================
    // CONFIG: Your exclusion list
    // =========================

    // IMPORTANT
    // (1) update your website search engine to exclude the same keywords below
    // like this: [https://www.google.com/search?q=%s+-site:reddit.com+-antix](https://www.google.com/search?q=%s+-site:reddit.com+-antix)
    // (2) put the exclusions also below
    const exclusions = ['site:reddit.com', 'antix'];

    // LOGIC START
    const isDomain = str => str.includes('.');

    const appendExclusions = query => exclusions.reduce((q, ex) => {
        const exStr = `-${ex}`;
        return q.toLowerCase().includes(exStr.toLowerCase()) ? q : `${q} ${exStr}`;
    }, query);

    const cleanQueryBox = () => {
        const input = document.querySelector('input[name="q"], textarea[name="q"], input[type="search"]');
        if (!input || !input.value) return;

        let cleaned = exclusions.reduce((c, ex) => {
            const exEsc = ex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(^|\\s)-${exEsc}(\\s|$)`, 'gi');
            return c.replace(regex, ' ');
        }, input.value);

        cleaned = cleaned.replace(/\s+/g, ' ').trim();

        if (cleaned !== input.value) {
            input.value = cleaned;
            ['input', 'change'].forEach(ev => input.dispatchEvent(new Event(ev, { bubbles: true })));
        }
    }

    const setupSearchHandler = async () => {
        const button = await new Promise(resolve => {
            const interval = setInterval(() => {
                const btn = document.querySelector('button[aria-label="Search"], input[name="btnK"], button[name="btnK"]');
                if (btn) {
                    clearInterval(interval);
                    resolve(btn);
                }
            }, 100);
        });

        const input = document.querySelector('input[name="q"], textarea[name="q"]');
        button.addEventListener('click', e => {
            if (input && input.value.trim()) {
                e.preventDefault();
                input.value = appendExclusions(input.value);
                setTimeout(() => {
                    input.form.submit();
                }, 0);
            }
        });
    }

    const initialize = () => {
        setupSearchHandler();
        // Clean after results load (works for browser-bar search)
        window.addEventListener('load', () => setTimeout(cleanQueryBox, 50));
    }

    // Detect SPA navigation / browser-bar changes
    window.addEventListener('popstate', () => setTimeout(cleanQueryBox, 50));

    // Clean after pressing Enter (submit)
    document.addEventListener('keydown', e => {
        if (e.key === 'Enter' && e.target.matches('input[name="q"], textarea[name="q"]')) {
            const input = e.target;
            if (input.value.trim()) {
                input.value = appendExclusions(input.value);
                setTimeout(cleanQueryBox, 50);
            }
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
