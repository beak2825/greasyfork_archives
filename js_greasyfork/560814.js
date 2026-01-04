// ==UserScript==
// @name         Klavia Rewards Detector 
// @namespace    https://tampermonkey.net/
// @version      4.1
// @description  Detect rewards even when auto-reloader skips UI
// @match        https://klavia.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560814/Klavia%20Rewards%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/560814/Klavia%20Rewards%20Detector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'klaviaRewardsPending';
    const PANEL_ID = 'klavia-reward-panel';
    const GARAGE_URL = 'https://klavia.io/racer/garage';

    /* =========================
       NETWORK HOOK (CRITICAL)
       ========================= */

    function hookNetwork(win) {
        if (win.__klaviaRewardsHooked) return;
        win.__klaviaRewardsHooked = true;

        // Hook fetch
        const origFetch = win.fetch;
        win.fetch = function (...args) {
            const url = args[0]?.toString?.() || '';
            if (url.includes('post_race_check_claims')) {
                console.log('[Klavia Rewards] fetch detected');
                localStorage.setItem(STORAGE_KEY, 'true');
            }
            return origFetch.apply(this, args);
        };

        // Hook XHR
        const origOpen = win.XMLHttpRequest.prototype.open;
        win.XMLHttpRequest.prototype.open = function (method, url) {
            if (url && url.includes('post_race_check_claims')) {
                console.log('[Klavia Rewards] XHR detected');
                localStorage.setItem(STORAGE_KEY, 'true');
            }
            return origOpen.apply(this, arguments);
        };
    }

    /* =========================
       PANEL
       ========================= */

    function showPanel(doc, win) {
        if (!doc || doc.getElementById(PANEL_ID)) return;

        const panel = doc.createElement('div');
        panel.id = PANEL_ID;
        panel.innerHTML = `
            <div style="font-size:16px;font-weight:700;margin-bottom:6px;">
                🎁 Rewards Available
            </div>
            <div style="font-size:13px;opacity:.9;">
                You’ve got rewards to claim.
            </div>
            <button id="klavia-claim">Claim Rewards</button>
        `;

        panel.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 260px;
            background: #0f172a;
            color: #e5e7eb;
            padding: 14px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,.5);
            font-family: system-ui, sans-serif;
            z-index: 9999999;
        `;

        const claim = panel.querySelector('#klavia-claim');
        claim.style.cssText = `
            margin-top: 10px;
            width: 100%;
            padding: 6px;
            border-radius: 6px;
            border: none;
            background: #22c55e;
            color: white;
            cursor: pointer;
        `;

        claim.onclick = () => {
            localStorage.removeItem(STORAGE_KEY);
            win.location.href = GARAGE_URL;
        };

        doc.body.appendChild(panel);
    }

    /* =========================
       INJECTION (iframe-safe)
       ========================= */

    function inject(doc, win) {
        if (!doc || !win) return;

        hookNetwork(win);

        // If rewards already detected, show panel
        if (localStorage.getItem(STORAGE_KEY) === 'true') {
            showPanel(doc, win);
        }
    }

    function injectAll() {
        inject(document, window);

        document.querySelectorAll('iframe').forEach(f => {
            try {
                inject(f.contentDocument, f.contentWindow);
            } catch (e) {}
        });
    }

    // Initial + keep-alive for SPA reloads
    injectAll();
    setInterval(injectAll, 1000);
})();
