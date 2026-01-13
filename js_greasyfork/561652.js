// ==UserScript==
// @name         Torn Attack – Temporary Effects Viewer (UserID prompt)
// @namespace    https://torn.com/
// @version      1.7
// @description  Shows currentTemporaryEffects applied to your player and counts attackers already in the loader
// @match        https://www.torn.com/loader.php?sid=attack&user*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561652/Torn%20Attack%20%E2%80%93%20Temporary%20Effects%20Viewer%20%28UserID%20prompt%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561652/Torn%20Attack%20%E2%80%93%20Temporary%20Effects%20Viewer%20%28UserID%20prompt%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY = 'tm_tempEffectsUserID';

    let MY_USER_ID = parseInt(localStorage.getItem(STORAGE_KEY)) || null;
    let effectsBox = null;
    let attackersInLoader = 0;

    /* ---------------- utils ---------------- */

    function deepFind(obj, keyName) {
        if (!obj || typeof obj !== 'object') return null;

        if (obj[keyName] !== undefined) return obj[keyName];

        for (const key in obj) {
            const found = deepFind(obj[key], keyName);
            if (found !== null) return found;
        }
        return null;
    }

    function findCurrentTemporaryEffects(obj) {
        return deepFind(obj, 'currentTemporaryEffects');
    }

    function findAttackerUser(obj) {
        return deepFind(obj, 'attackerUser');
    }

    function findCurrentDefends(obj) {
        return deepFind(obj, 'currentDefends');
    }

    /* ---------------- UI ---------------- */

    function ensureUI() {
        const header = document.querySelector('[class*="appHeaderWrapper"]');
        if (!header) return;

        if (effectsBox && header.contains(effectsBox)) return;

        effectsBox = document.createElement('div');
        effectsBox.id = 'tm-temp-effects';
        effectsBox.style.cssText = `
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: rgba(20,20,20,0.9);
            color: #fff;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            margin-right: 10px;
            min-width: 160px;
        `;

        header.appendChild(effectsBox);
        updateUI([]);
    }

    function renderEffect(effect) {
        const isCritical = ['Smoked', 'Blinded'].includes(effect.title);

        const stackText = effect.isStackable
            ? ` • ${effect.stackCount}/${effect.stackCountMax}`
            : '';

        return `
            <span style="
                margin-top: 2px;
                padding: 2px 4px;
                border-radius: 4px;
                background: ${isCritical ? 'rgba(160,0,0,0.85)' : 'rgba(0,0,0,0.4)'};
                border: ${isCritical ? '1px solid #ff4d4d' : '1px solid transparent'};
                font-weight: ${isCritical ? 'bold' : 'normal'};
            ">
                ${isCritical ? effect.title.toUpperCase() : effect.title}
                (${effect.timeLeft}s)${stackText}
            </span>
        `;
    }

    function updateUI(effects) {
        ensureUI();
        if (!effectsBox) return;

        let html = `
            <span style="font-weight:bold;">
                Attackers in loader: ${attackersInLoader}
            </span>
            <b style="margin-top:4px;">Temp Effects</b>
        `;

        if (!effects || effects.length === 0) {
            html += `<span>None</span>`;
        } else {
            html += effects.map(renderEffect).join('');
        }

        effectsBox.innerHTML = html;
    }

    /* ---------------- Data processing ---------------- */

    function processResponse(data) {
        if (!data || typeof data !== 'object') return;

        // Auto-detect own UserID
        if (!MY_USER_ID) {
            const attackerUser = findAttackerUser(data);
            if (attackerUser?.userID) {
                MY_USER_ID = attackerUser.userID;
                localStorage.setItem(STORAGE_KEY, MY_USER_ID);
            }
        }

        // Count attackers in loader
        const defends = findCurrentDefends(data);
        if (Array.isArray(defends)) {
            const uniqueAttackers = new Set(
                defends.map(d => d.attackerID).filter(Boolean)
            );
            attackersInLoader = uniqueAttackers.size;
        } else {
            attackersInLoader = 0;
        }

        if (!MY_USER_ID) return;

        const effectsObj = findCurrentTemporaryEffects(data);
        if (!effectsObj) {
            updateUI([]);
            return;
        }

        window.__lastAttackResponse = data; // debug hook

        updateUI(effectsObj[MY_USER_ID] || []);
    }

    /* ---------------- Fetch hook ---------------- */

    const origFetch = window.fetch;
    window.fetch = async (...args) => {
        const res = await origFetch(...args);
        try {
            res.clone().json().then(processResponse).catch(() => {});
        } catch {}
        return res;
    };

    /* ---------------- XHR hook ---------------- */

    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...args) {
        this.addEventListener('load', () => {
            try {
                processResponse(JSON.parse(this.responseText));
            } catch {}
        });
        return origOpen.apply(this, args);
    };

    /* ---------------- React-safe reinjection ---------------- */

    const observer = new MutationObserver(ensureUI);
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();
