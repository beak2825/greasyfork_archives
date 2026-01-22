// ==UserScript==
// @name         Torn Hire CR Merc (Mobile)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Mobile-compatible CR Merc hire button
// @author       ShAdOwCrEsT [3929345]
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      merc.shadowcrest96.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/563471/Torn%20Hire%20CR%20Merc%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563471/Torn%20Hire%20CR%20Merc%20%28Mobile%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PROXY_URL = 'https://merc.shadowcrest96.workers.dev';
    const cooldowns = {};

    /* ==========================
       Utilities
    ========================== */

    function isOnCooldown(id) {
        if (!cooldowns[id]) return false;
        const left = cooldowns[id] - Date.now();
        if (left <= 0) {
            delete cooldowns[id];
            return false;
        }
        return Math.ceil(left / 60000);
    }

    function setCooldown(id) {
        cooldowns[id] = Date.now() + 5 * 60 * 1000;
    }

    function getApiKey() {
        let key = GM_getValue('torn_api_key', '');
        if (!key) {
            showModal({
                title: 'API Key Required',
                content: 'Enter your PUBLIC Torn API key:',
                input: true,
                onConfirm: val => {
                    if (val) GM_setValue('torn_api_key', val.trim());
                }
            });
            return null;
        }
        return key;
    }

    function apiGet(url, cb) {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: r => {
                try {
                    cb(JSON.parse(r.responseText));
                } catch {
                    cb(null);
                }
            },
            onerror: () => cb(null)
        });
    }

    function getUser(apiKey, cb) {
        apiGet(`https://api.torn.com/user/?selections=basic&key=${apiKey}`, cb);
    }

    function getTarget(id, apiKey, cb) {
        apiGet(`https://api.torn.com/v2/user/${id}/profile?striptags=true&key=${apiKey}`, d => {
            cb(d?.profile || null);
        });
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
       Modal UI (mobile safe)
    ========================== */

    function showModal({ title, content, input, onConfirm }) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,.7);
        z-index:999999; display:flex; align-items:center; justify-content:center;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        position:relative;
        background:#1f1f1f; color:#fff; padding:15px;
        width:90%; max-width:350px; border-radius:8px;
    `;

    /* ❌ Cancel (X) button */
    const close = document.createElement('button');
    close.textContent = '✕';
    close.style.cssText = `
        position:absolute; top:8px; right:8px;
        background:none; border:none; color:#aaa;
        font-size:20px; font-weight:700;
        cursor:pointer;
        padding:5px;
    `;
    close.onclick = () => overlay.remove();

    const h = document.createElement('h3');
    h.textContent = title;
    h.style.marginTop = '0';

    const p = document.createElement('p');
    p.textContent = content;

    box.append(close, h, p);

    let inputEl;
    if (input) {
        inputEl = document.createElement('input');
        inputEl.style.cssText = `
            width:100%; padding:8px; margin:10px 0;
            box-sizing:border-box;
        `;
        box.appendChild(inputEl);
    }

    const ok = document.createElement('button');
    ok.textContent = 'OK';
    ok.style.cssText = `
        width:100%; padding:10px; margin-top:10px;
    `;

    ok.onclick = () => {
        overlay.remove();
        onConfirm && onConfirm(inputEl?.value);
    };

    box.appendChild(ok);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}


    /* ==========================
       Merc Logic
    ========================== */

    function mercTarget(targetId) {
        const apiKey = getApiKey();
        if (!apiKey) return;

        const cd = isOnCooldown(targetId);
        if (cd) return alert(`Cooldown: ${cd} minutes`);

        getUser(apiKey, user => {
            if (!user?.player_id) return alert('Invalid API key');

            getTarget(targetId, apiKey, target => {
                if (!target) return alert('Invalid target');

                sendRequest({
                    requesterId: user.player_id,
                    requesterName: user.name,
                    requesterUrl: `https://www.torn.com/profiles.php?XID=${user.player_id}`,
                    targetId,
                    targetUrl: `https://www.torn.com/profiles.php?XID=${targetId}`,
                    targetName: target.name,
                    targetLevel: target.level,
                    targetStatus: target.status?.description || 'Unknown'
                });

                setCooldown(targetId);
                alert('Request sent. Pay 4 Xanax.');
            });
        });
    }

    /* ==========================
       Chat Merc Button
    ========================== */

    function addChatMercButton() {
        if (document.getElementById('cr-merc-chat-button')) return;

        const settingsBtn = document.getElementById('notes_settings_button');
        if (!settingsBtn) return;

        // Clone the settings button (includes SVG icon)
        const btn = settingsBtn.cloneNode(true);

        btn.id = 'cr-merc-chat-button';
        btn.title = 'Hire CR Merc';

        // Remove React handlers safely
        btn.replaceWith(btn);

        // Replace settings icon with merc icon (fallback to "CR")
        (() => {
            const currentSvg = btn.querySelector('svg');

            try {
                if (!currentSvg) throw new Error('No SVG found');

                currentSvg.outerHTML = `
          <svg viewBox="0 0 24 24" width="24" height="24"
               class="root___DYylw icon___M_Izz"
               xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="12" r="8"
                    fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="3"
                    fill="currentColor"/>
          </svg>`;
            } catch (e) {
                btn.innerHTML = '<span style="font-weight:700; font-size:14px;">CR</span>';
            }
        })();

        // Replace click behaviour
        btn.addEventListener('click', e => {
            e.stopPropagation();
            showModal({
                title: 'Hire Merc',
                content: 'Enter User ID to merc:',
                input: true,
                onConfirm: id => {
                    if (/^\d+$/.test(id)) mercTarget(id);
                }
            });
        });

        // Insert to the RIGHT of settings
        settingsBtn.parentNode.insertBefore(btn, settingsBtn.nextSibling);
    }


    /* ==========================
       Profile Button
    ========================== */

    function addProfileCRButton() {
    const params = new URLSearchParams(location.search);
    const xid = params.get('XID');
    if (!xid) return;

    // Prevent duplicates
    if (document.getElementById('button-cr-merc')) return;

    const buttonsList = document.querySelector('.buttons-list');
    if (!buttonsList) return;

    // Create a new <a> element styled like the profile buttons
    const btn = document.createElement('a');
    btn.id = 'button-cr-merc';
    btn.href = '#'; // no page navigation
    btn.className = 'profile-button clickable';
    btn.title = 'Hire CR Merc';

    // Match the style of other buttons
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.color = 'inherit';
    btn.style.textDecoration = 'none';
    btn.style.fontWeight = '700';
    btn.style.fontSize = '14px';
    btn.style.pointerEvents = 'auto';

    // Add CR text inside
    const span = document.createElement('span');
    span.textContent = 'CR';
    span.style.color = 'currentColor';
    btn.appendChild(span);

    // Click logic with confirmation
    btn.addEventListener('click', e => {
        e.preventDefault();

        const apiKey = getApiKey();
        if (!apiKey) return;

        // Fetch the target's profile to get their name
        getTarget(xid, apiKey, target => {
            if (!target) return alert('Could not get target info');

            showModal({
                title: 'Confirm Merc Request',
                content: `Are you sure you want to request a merc hit on "${target.name}"?`,
                input: false,
                onConfirm: () => {
                    mercTarget(xid);
                }
            });
        });
    });

    // Append to buttons list
    buttonsList.appendChild(btn);
}
    /* ==========================
       Init
    ========================== */

    setInterval(() => {
    addChatMercButton();
    addProfileCRButton(); // instead of addProfileButton()
}, 1500);



})();