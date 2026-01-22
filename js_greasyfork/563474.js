// ==UserScript==
// @name         Torn Hire CR Merc (Self Only, Mobile/PDA Safe)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Request a self Merc hit only (4 Xanax). Works on PC, mobile, and Torn PDA. Prompts for API key directly on profile pages. All buttons have pointer cursor.
// @author       ShAdOwCrEsT + OptimusGrimeDC
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      merc.shadowcrest96.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/563474/Torn%20Hire%20CR%20Merc%20%28Self%20Only%2C%20MobilePDA%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563474/Torn%20Hire%20CR%20Merc%20%28Self%20Only%2C%20MobilePDA%20Safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PROXY_URL = 'https://merc.shadowcrest96.workers.dev';
    const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
    const cooldowns = {};

    /* ==========================
       Cooldown Helpers
    ========================== */
    function isOnCooldown(id) {
        if (!cooldowns[id]) return false;
        const remaining = cooldowns[id] - Date.now();
        if (remaining <= 0) {
            delete cooldowns[id];
            return false;
        }
        return Math.ceil(remaining / 60000);
    }

    function setCooldown(id) {
        cooldowns[id] = Date.now() + COOLDOWN_MS;
    }

    /* ==========================
       API Helpers
    ========================== */
    function apiGet(url, cb) {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: r => {
                try { cb(JSON.parse(r.responseText)); }
                catch { cb(null); }
            },
            onerror: () => cb(null)
        });
    }

    function getUser(apiKey, cb) {
        apiGet(`https://api.torn.com/user/?selections=basic&key=${apiKey}`, cb);
    }

    function sendRequest(payload) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: PROXY_URL,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(payload)
        });
    }

    /* ==========================
       Modal UI (Mobile/PDA Safe)
    ========================== */
    function showModal({ title, content, showCancel = false, onConfirm }) {
        if (document.getElementById('cr-merc-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'cr-merc-modal';
        overlay.style.cssText = `
            position:fixed; inset:0;
            background:rgba(0,0,0,.75);
            z-index:999999;
            display:flex;
            align-items:center;
            justify-content:center;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background:#fefefe;
            color:#111;
            padding:20px;
            width:90%;
            max-width:360px;
            border-radius:10px;
            position:relative;
            box-shadow:0 4px 15px rgba(0,0,0,0.25);
            font-family: Arial, sans-serif;
        `;

        const close = document.createElement('div');
        close.textContent = '×';
        close.style.cssText = `
            position:absolute; top:8px; right:12px;
            cursor:pointer; font-size:20px; font-weight:bold;
        `;
        close.onclick = () => overlay.remove();

        const h = document.createElement('h3');
        h.textContent = title;
        h.style.cssText = 'margin-top:0; margin-bottom:10px; color:#111;';

        const p = document.createElement('p');
        p.textContent = content;
        p.style.cssText = 'color:#111; line-height:1.4;';

        const ok = document.createElement('button');
        ok.textContent = 'Confirm';
        ok.style.cssText = `
            width:100%; padding:10px; margin-top:12px;
            background:#1E90FF; color:#fff; border:none; border-radius:5px;
            font-size:15px; cursor:pointer; touch-action: manipulation;
        `;
        ok.addEventListener('click', () => {
            overlay.remove();
            onConfirm?.();
        });

        box.append(close, h, p, ok);

        if (showCancel) {
            const cancel = document.createElement('button');
            cancel.textContent = 'Cancel';
            cancel.style.cssText = `
                width:100%; padding:10px; margin-top:6px;
                background:#ccc; color:#111; border:none; border-radius:5px;
                font-size:15px; cursor:pointer; touch-action: manipulation;
            `;
            cancel.addEventListener('click', () => overlay.remove());
            box.appendChild(cancel);
        }

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    /* ==========================
       API Key Input Modal
    ========================== */
    function promptApiKeyAndInit() {
        const xid = getProfileXid();
        if (!xid) return; // Only run on profile pages

        const stored = GM_getValue('torn_api_key', '');
        if (stored) {
            getUser(stored, user => {
                if (!user?.player_id) return;
                addProfileButton(user);
            });
            return;
        }

        if (document.getElementById('cr-merc-api-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'cr-merc-api-modal';
        overlay.style.cssText = `
            position:fixed; inset:0;
            background:rgba(0,0,0,0.75);
            z-index:999999;
            display:flex;
            align-items:center;
            justify-content:center;
        `;

        const box = document.createElement('div');
        box.style.cssText = `
            background:#fefefe;
            padding:20px;
            width:90%;
            max-width:360px;
            border-radius:10px;
            text-align:center;
            font-family:Arial,sans-serif;
            position:relative;
        `;

        const close = document.createElement('div');
        close.textContent = '×';
        close.style.cssText = `
            position:absolute; top:8px; right:12px;
            cursor:pointer; font-size:20px; font-weight:bold;
        `;
        close.onclick = () => overlay.remove();

        const title = document.createElement('h3');
        title.textContent = 'Enter Torn API Key';
        title.style.cssText = 'margin-top:0; margin-bottom:10px;';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your PUBLIC API key';
        input.style.cssText = `
            width:100%; padding:10px; font-size:15px;
            margin-bottom:12px; box-sizing:border-box;
        `;

        const btn = document.createElement('button');
        btn.textContent = 'Save & Continue';
        btn.style.cssText = `
            width:100%; padding:10px; background:#1E90FF; color:#fff;
            border:none; border-radius:5px; font-size:15px;
            cursor:pointer; touch-action: manipulation;
        `;
        btn.addEventListener('click', () => {
            const apiKey = input.value.trim();
            if (!apiKey) return alert('API key cannot be empty!');
            GM_setValue('torn_api_key', apiKey);
            overlay.remove();
            getUser(apiKey, user => {
                if (!user?.player_id) return;
                addProfileButton(user);
            });
        });

        box.append(close, title, input, btn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    /* ==========================
       Merc Logic (SELF ONLY)
    ========================== */
    function requestSelfMerc(user) {
        const cd = isOnCooldown(user.player_id);
        if (cd) {
            showModal({
                title: 'Cooldown Active',
                content: `Cooldown active: ${cd} minutes remaining.`,
                showCancel: false
            });
            return;
        }

        showModal({
            title: 'Confirm Merc Hit',
            content: "Are you sure you want to request a Merc hit on yourself? It'll cost 4 Xanax.",
            showCancel: true,
            onConfirm: () => {
                sendRequest({
                    requesterId: user.player_id,
                    requesterName: user.name,
                    requesterUrl: `https://www.torn.com/profiles.php?XID=${user.player_id}`,
                    targetId: user.player_id,
                    targetName: user.name,
                    targetUrl: `https://www.torn.com/profiles.php?XID=${user.player_id}`,
                    targetLevel: user.level,
                    targetStatus: user.status?.description || 'Unknown'
                });

                setCooldown(user.player_id);

                showModal({
                    title: 'Merc Request Sent',
                    content: 'Merc hit request sent. Pay 4 Xanax.',
                    showCancel: false
                });
            }
        });
    }

    /* ==========================
       Profile Button Injection
    ========================== */
    function getProfileXid() {
        const params = new URLSearchParams(location.search);
        if (params.has('XID')) return params.get('XID');
        const hashMatch = location.hash.match(/XID=(\d+)/);
        return hashMatch ? hashMatch[1] : null;
    }

    function addProfileButton(user) {
        const xid = getProfileXid();
        if (!xid || xid !== String(user.player_id)) return;
        if (document.getElementById('cr-merc-profile')) return;

        const btn = document.createElement('button');
        btn.id = 'cr-merc-profile';
        btn.textContent = 'Merc';
        btn.style.cssText = `
            width:90%;
            max-width:300px;
            padding:12px;
            margin:10px auto;
            display:block;
            background:#87CEEB;
            border:none;
            border-radius:6px;
            font-size:16px;
            text-align:center;
            cursor:pointer;
            touch-action: manipulation;
        `;
        btn.addEventListener('click', () => requestSelfMerc(user));

        // Use MutationObserver to handle SPA/dynamic content
        const container = document.querySelector('#content') || document.body;
        const observer = new MutationObserver(() => {
            if (!document.getElementById('cr-merc-profile')) {
                const target = document.querySelector('#content') || document.body;
                target.prepend(btn);
            }
        });
        observer.observe(container, { childList: true, subtree: true });

        container.prepend(btn); // initial inject
    }

    /* ==========================
       Init (Mobile/PDA compatible)
    ========================== */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', promptApiKeyAndInit);
    } else {
        promptApiKeyAndInit();
    }

})();