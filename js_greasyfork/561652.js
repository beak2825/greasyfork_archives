// ==UserScript==
// @name         Torn Attack – Mobile Fight Assistant
// @namespace    https://torn.com/
// @version      2.0
// @description  Shows your temp effects, attackers in loader, and opponent weapons with Parry/Bloodlust warning (mobile-safe)
// @match        https://www.torn.com/loader.php?sid=attack&user*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561652/Torn%20Attack%20%E2%80%93%20Mobile%20Fight%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/561652/Torn%20Attack%20%E2%80%93%20Mobile%20Fight%20Assistant.meta.js
// ==/UserScript==
     
    (() => {
        'use strict';
     
        /* ===================== CONFIG ===================== */
     
        const STORAGE_KEY = 'tm_tempEffectsUserID';
     
        const SLOT_MAP = {
            1: 'Primary',
            2: 'Secondary',
            3: 'Melee',
            5: 'Temp'
        };
     
        const DANGER_BONUSES = {
            parry: {
                color: '#ff5252',
                label: 'PARRY'
            },
            bloodlust: {
                color: '#ff9800',
                label: 'BLOOD'
            }
        };
     
        /* ===================== STATE ===================== */
     
        let MY_USER_ID = parseInt(localStorage.getItem(STORAGE_KEY)) || null;
        let effectsBox = null;
        let attackersInLoader = 0;
        let defenderWeapons = null;
     
        /* ===================== UTILS ===================== */
     
        function deepFind(obj, keyName) {
            if (!obj || typeof obj !== 'object') return null;
            if (obj[keyName] !== undefined) return obj[keyName];
     
            for (const key in obj) {
                const found = deepFind(obj[key], keyName);
                if (found !== null) return found;
            }
            return null;
        }
     
        const findCurrentTemporaryEffects = obj => deepFind(obj, 'currentTemporaryEffects');
        const findAttackerUser = obj => deepFind(obj, 'attackerUser');
        const findCurrentDefends = obj => deepFind(obj, 'currentDefends');
     
        /* ===================== WEAPON EXTRACTION ===================== */
     
        function extractDefenderWeapons(data) {
        const defenderItems = deepFind(data, 'defenderItems');
        if (!defenderItems || typeof defenderItems !== 'object') return null;
     
        const result = {};
     
        for (const [slot, label] of Object.entries(SLOT_MAP)) {
            const entry = defenderItems[slot]?.item?.[0];
            if (!entry) continue;
     
            // Temp slot: name only
            if (label === 'Temp') {
                result[label] = { name: entry.name };
                continue;
            }
     
            const bonuses = entry.currentBonuses
                ? Object.values(entry.currentBonuses).map(b => ({
                    icon: b.icon,
                    value: b.value
                }))
                : [];
     
            result[label] = {
                name: entry.name,
                bonuses
            };
        }
     
        // Critical: only lock in once we actually have something
        return Object.keys(result).length ? result : null;
    }
     
        /* ===================== UI ===================== */
     
        function ensureUI() {
            const header = document.querySelector('[class*="appHeaderWrapper"]');
            if (!header) return;
     
            if (effectsBox && header.contains(effectsBox)) return;
     
            effectsBox = document.createElement('div');
            effectsBox.id = 'tm-temp-effects';
            effectsBox.style.cssText = `
                display:flex;
                flex-direction:column;
                background:rgba(20,20,20,0.9);
                color:#fff;
                padding:4px 8px;
                border-radius:6px;
                font-size:12px;
                margin-right:10px;
                min-width:170px;
                max-width:260px;
            `;
     
            header.appendChild(effectsBox);
            updateUI([]);
        }
     
        function renderWeaponLine(label, weapon) {
            if (!weapon?.name) return '';
     
            let bonusText = '';
            let dangerTags = '';
     
            if (Array.isArray(weapon.bonuses) && weapon.bonuses.length) {
                bonusText = weapon.bonuses
                    .map(b => {
                        if (DANGER_BONUSES[b.icon]) {
                            const d = DANGER_BONUSES[b.icon];
                            dangerTags += `
                                <span style="
                                    color:${d.color};
                                    font-weight:bold;
                                    margin-left:4px;
                                ">${d.label}</span>
                            `;
                        }
                        return `${b.value}% ${b.icon}`;
                    })
                    .join(' ');
            }
     
            return `
                <span style="font-size:11px; line-height:1.25; white-space:nowrap;">
                    <b>${label[0]}:</b> ${weapon.name}
                    ${bonusText ? ' • ' + bonusText : ''}
                    ${dangerTags}
                </span>
            `;
        }
     
        function renderEffect(effect) {
            const isCritical = ['Smoked', 'Blinded'].includes(effect.title);
            const stackText = effect.isStackable
                ? ` • ${effect.stackCount}/${effect.stackCountMax}`
                : '';
     
            return `
                <span style="
                    margin-top:2px;
                    padding:2px 4px;
                    border-radius:4px;
                    background:${isCritical ? 'rgba(160,0,0,0.85)' : 'rgba(0,0,0,0.4)'};
                    border:${isCritical ? '1px solid #ff4d4d' : '1px solid transparent'};
                    font-weight:${isCritical ? 'bold' : 'normal'};
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
            `;
     
            if (defenderWeapons) {
                html += `
                    <b style="margin-top:4px;">Opponent Loadout</b>
                    ${renderWeaponLine('Primary', defenderWeapons.Primary)}
                    ${renderWeaponLine('Secondary', defenderWeapons.Secondary)}
                    ${renderWeaponLine('Melee', defenderWeapons.Melee)}
                    ${renderWeaponLine('Temp', defenderWeapons.Temp)}
                `;
            }
     
            html += `<b style="margin-top:4px;">Temp Effects</b>`;
     
            if (!effects || effects.length === 0) {
                html += `<span>None</span>`;
            } else {
                html += effects.map(renderEffect).join('');
            }
     
            effectsBox.innerHTML = html;
        }
     
        /* ===================== DATA PROCESSING ===================== */
     
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
     
            // Reset on new target
            const attackerUser = findAttackerUser(data);
            if (attackerUser?.userID && attackerUser.userID !== MY_USER_ID) {
                defenderWeapons = null;
            }
     
            // Count attackers
            const defends = findCurrentDefends(data);
            if (Array.isArray(defends)) {
                attackersInLoader = new Set(
                    defends.map(d => d.attackerID).filter(Boolean)
                ).size;
            } else {
                attackersInLoader = 0;
            }
     
            // Extract defender weapons once
            if (!defenderWeapons) {
                const extracted = extractDefenderWeapons(data);
                if (extracted) defenderWeapons = extracted;
            }
     
            if (!MY_USER_ID) return;
     
            const effectsObj = findCurrentTemporaryEffects(data);
            updateUI(effectsObj?.[MY_USER_ID] || []);
        }
     
        /* ===================== FETCH / XHR HOOKS ===================== */
     
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
            const res = await origFetch(...args);
            try {
                res.clone().json().then(processResponse).catch(() => {});
            } catch {}
            return res;
        };
     
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args) {
            this.addEventListener('load', () => {
                try {
                    processResponse(JSON.parse(this.responseText));
                } catch {}
            });
            return origOpen.apply(this, args);
        };
     
        /* ===================== REINJECTION ===================== */
     
        const observer = new MutationObserver(ensureUI);
        observer.observe(document.documentElement, { childList: true, subtree: true });
     
    })();

