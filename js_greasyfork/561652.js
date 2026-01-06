// ==UserScript==
// @name         Torn Attack – Temporary Effects Viewer (UserID prompt)
// @namespace    https://torn.com/
// @version      1.6
// @description  Shows currentTemporaryEffects applied to your player during attacks; asks for UserID on first run
// @match        https://www.torn.com/loader.php?sid=attack&user*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561652/Torn%20Attack%20%E2%80%93%20Temporary%20Effects%20Viewer%20%28UserID%20prompt%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561652/Torn%20Attack%20%E2%80%93%20Temporary%20Effects%20Viewer%20%28UserID%20prompt%29.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY = 'tm_tempEffectsUserID';
    let MY_USER_ID = localStorage.getItem(STORAGE_KEY);
    let effectsBox = null;

    /* ---------------- utils ---------------- */

    function findCurrentTemporaryEffects(obj) {
        if (!obj || typeof obj !== 'object') return null;

        if (obj.currentTemporaryEffects) {
            return obj.currentTemporaryEffects;
        }

        for (const key in obj) {
            const found = findCurrentTemporaryEffects(obj[key]);
            if (found) return found;
        }
        return null;
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
            min-width: 140px;
        `;

        if (!MY_USER_ID) {
            // Show input box if userID not set
            effectsBox.innerHTML = `
                <label style="font-weight:bold;margin-bottom:2px;">Enter Your UserID:</label>
                <input type="text" id="tm-userid-input" placeholder="UserID" style="width:100%;padding:2px 4px;border-radius:4px;border:none;font-size:12px;">
            `;
            header.appendChild(effectsBox);

            const input = effectsBox.querySelector('#tm-userid-input');
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const val = parseInt(input.value.trim());
                    if (!isNaN(val)) {
                        MY_USER_ID = val;
                        localStorage.setItem(STORAGE_KEY, val);
                        updateUI([]); // switch to temp effects UI
                    } else {
                        alert('Please enter a valid numeric UserID.');
                    }
                }
            });

            return;
        }

        // If userID exists, normal temp effects placeholder
        effectsBox.innerHTML = '<b>Temp Effects</b><span>None</span>';
        header.appendChild(effectsBox);
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
        if (!effectsBox || !MY_USER_ID) return;

        if (!effects || effects.length === 0) {
            effectsBox.innerHTML = '<b>Temp Effects</b><span>None</span>';
            return;
        }

        effectsBox.innerHTML =
            `<b>Temp Effects</b>` +
            effects.map(renderEffect).join('');
    }

    /* ---------------- Data processing ---------------- */

    function processResponse(data) {
        if (!MY_USER_ID) return; // wait until userID is set

        const effectsObj = findCurrentTemporaryEffects(data);
        if (!effectsObj) return;

        // debug hook (optional)
        window.__lastAttackResponse = effectsObj;

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