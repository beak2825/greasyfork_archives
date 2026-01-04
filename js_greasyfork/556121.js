// ==UserScript==
// @name         TORN - Quick Custom Mug
// @namespace    https://www.torn.com/
// @version      1.5
// @description  Start Attack on Selected Weapon Slot
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556121/TORN%20-%20Quick%20Custom%20Mug.user.js
// @updateURL https://update.greasyfork.org/scripts/556121/TORN%20-%20Quick%20Custom%20Mug.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'PUT_YOUR_API_KEY_HERE';

    let inBattle = false;
    let fightFinished = false;

    let lastActionState = 'idle';
    let lastActionInfo = null;
    let lastActionLastFetch = 0;
    const LAST_ACTION_REFRESH_INTERVAL = 30;

    const STORAGE_KEY_ENABLED = 'customMugScript_enabled';
    let scriptEnabled = true;

    const STORAGE_KEY_FINAL = 'customMugScript_finalAction';
    const FINAL_ACTIONS = ['Leave', 'Mug', 'Hospitalize'];
    let finalActionPref = 'Mug';

    const STORAGE_KEY_WEAPON = 'customMugScript_weaponSlot';
    const WEAPON_SLOTS = ['Primary', 'Secondary', 'Melee'];
    let weaponSlotPref = 'Melee';

    function loadEnabledFromStorage() {
        try {
            const v = localStorage.getItem(STORAGE_KEY_ENABLED);
            scriptEnabled = (v === null) ? true : (v === 'true');
        } catch (e) {
            scriptEnabled = true;
        }
    }

    function saveEnabledToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY_ENABLED, scriptEnabled ? 'true' : 'false');
        } catch (e) {}
    }

    function loadFinalFromStorage() {
        try {
            const v = localStorage.getItem(STORAGE_KEY_FINAL);
            if (v && FINAL_ACTIONS.includes(v)) {
                finalActionPref = v;
            } else {
                finalActionPref = 'Mug';
            }
        } catch (e) {
            finalActionPref = 'Mug';
        }
    }

    function saveFinalToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY_FINAL, finalActionPref);
        } catch (e) {}
    }

    function cycleFinalAction() {
        const idx = FINAL_ACTIONS.indexOf(finalActionPref);
        const next = (idx === -1) ? 0 : (idx + 1) % FINAL_ACTIONS.length;
        finalActionPref = FINAL_ACTIONS[next];
        saveFinalToStorage();
    }

    function loadWeaponFromStorage() {
        try {
            const v = localStorage.getItem(STORAGE_KEY_WEAPON);
            if (v && WEAPON_SLOTS.includes(v)) {
                weaponSlotPref = v;
            } else {
                weaponSlotPref = 'Melee';
            }
        } catch (e) {
            weaponSlotPref = 'Melee';
        }
    }

    function saveWeaponToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY_WEAPON, weaponSlotPref);
        } catch (e) {}
    }

    function cycleWeaponSlot() {
        const idx = WEAPON_SLOTS.indexOf(weaponSlotPref);
        const next = (idx === -1) ? 0 : (idx + 1) % WEAPON_SLOTS.length;
        weaponSlotPref = WEAPON_SLOTS[next];
        saveWeaponToStorage();
    }

    function findMySlot() {
        let selector = '#weapon_melee';
        if (weaponSlotPref === 'Primary') selector = '#weapon_main';
        else if (weaponSlotPref === 'Secondary') selector = '#weapon_second';
        const weapons = document.querySelectorAll(selector);
        if (!weapons || weapons.length === 0) return null;
        return weapons[0];
    }

    function findStartFightButton() {
        const buttons = document.querySelectorAll('button');
        for (const b of buttons) {
            const txt = (b.textContent || '').trim().toLowerCase();
            if (txt === 'start fight') return b;
        }
        return null;
    }

    function findActionByLabel(label) {
        const target = label.trim().toLowerCase();
        const els = document.querySelectorAll('button, a, span, div');
        for (const el of els) {
            const txt = (el.textContent || '').trim().toLowerCase();
            if (txt === target) return el;
        }
        return null;
    }

    function getEndActionsMap() {
        return {
            Leave: findActionByLabel('Leave'),
            Mug: findActionByLabel('Mug'),
            Hospitalize: findActionByLabel('Hospitalize')
        };
    }

    function pickPreferredEndAction(map) {
        if (map[finalActionPref]) return { label: finalActionPref, el: map[finalActionPref] };
        if (map.Mug) return { label: 'Mug', el: map.Mug };
        if (map.Leave) return { label: 'Leave', el: map.Leave };
        if (map.Hospitalize) return { label: 'Hospitalize', el: map.Hospitalize };
        return null;
    }

    function hasAnyEndAction(map) {
        return !!(map.Leave || map.Mug || map.Hospitalize);
    }

    function isTargetNotAvailable() {
        const modalTitles = document.querySelectorAll('.title___fOh2J');
        for (const el of modalTitles) {
            const txt = (el.textContent || '').toLowerCase();
            if (
                txt.includes('cannot be attacked') ||
                txt.includes('traveling') ||
                txt.includes('hospital') ||
                txt.includes('hospitalized') ||
                txt.includes('jail')
            ) {
                return true;
            }
        }
        const bodyText = (document.body && document.body.innerText ? document.body.innerText : '').toLowerCase();
        if (
            bodyText.includes('cannot be attacked') ||
            bodyText.includes('traveling') ||
            bodyText.includes('hospital') ||
            bodyText.includes('hospitalized') ||
            bodyText.includes('jail')
        ) {
            return true;
        }
        return false;
    }

    function removeOverlay() {
        const old = document.getElementById('tm-melee-overlay-btn');
        if (old && old.parentElement) old.parentElement.removeChild(old);
    }

    function attachStartFightListener(btn) {
        if (!btn) return;
        if (btn.dataset.tmStartHooked === '1') return;
        btn.dataset.tmStartHooked = '1';
        btn.addEventListener('click', function () {
            inBattle = true;
            fightFinished = false;
            removeOverlay();
        });
    }

    function createOverlayButtons(slotEl, buttonsConfig) {
        if (!slotEl || !buttonsConfig || !buttonsConfig.length) return;
        const existing = document.getElementById('tm-melee-overlay-btn');
        if (existing) {
            const btnsExisting = Array.from(existing.querySelectorAll('button'));
            const sameCount = btnsExisting.length === buttonsConfig.length;
            const sameLabels = sameCount && btnsExisting.every((b, i) => (b.textContent || '').trim() === buttonsConfig[i].label);
            if (sameLabels) return;
            existing.remove();
        }
        const style = window.getComputedStyle(slotEl);
        if (style.position === 'static') slotEl.style.position = 'relative';
        const wrapper = document.createElement('div');
        wrapper.id = 'tm-melee-overlay-btn';
        wrapper.style.position = 'absolute';
        wrapper.style.inset = '0';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.gap = '4px';
        wrapper.style.pointerEvents = 'none';
        wrapper.style.zIndex = '50';
        buttonsConfig.forEach(cfg => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = cfg.label;
            btn.style.pointerEvents = 'auto';
            btn.style.cursor = 'pointer';
            btn.className = cfg.className || 'torn-btn silver';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                removeOverlay();
                if (cfg.onClick) cfg.onClick();
            });
            wrapper.appendChild(btn);
        });
        slotEl.appendChild(wrapper);
    }

    function attachEndActionListeners(endMap) {
        ['Leave', 'Mug', 'Hospitalize'].forEach(name => {
            const el = endMap[name];
            if (!el) return;
            if (el.dataset.tmEndHooked === '1') return;
            el.dataset.tmEndHooked = '1';
            el.addEventListener('click', function () {
                fightFinished = true;
                inBattle = false;
                removeOverlay();
            });
        });
    }

    function createToggleUI() {
        const modelContainer = document.querySelector('.allLayers___cXY5i');
        if (!modelContainer) return;
        const style = window.getComputedStyle(modelContainer);
        if (style.position === 'static') modelContainer.style.position = 'relative';
        let wrap = document.getElementById('tm-toggle-wrap');
        if (!wrap) {
            wrap = document.createElement('div');
            wrap.id = 'tm-toggle-wrap';
            wrap.style.position = 'absolute';
            wrap.style.top = '4px';
            wrap.style.left = '4px';
            wrap.style.zIndex = '200';
            wrap.style.display = 'flex';
            wrap.style.gap = '4px';
            wrap.style.alignItems = 'center';
            modelContainer.appendChild(wrap);
        }
        let btnScript = document.getElementById('tm-custom-mug-toggle');
        if (!btnScript) {
            btnScript = document.createElement('button');
            btnScript.id = 'tm-custom-mug-toggle';
            btnScript.style.fontSize = '10px';
            btnScript.style.padding = '2px 6px';
            btnScript.style.opacity = '0.9';
            btnScript.style.cursor = 'pointer';
            btnScript.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                scriptEnabled = !scriptEnabled;
                saveEnabledToStorage();
                updateToggleLabels();
                if (!scriptEnabled) {
                    inBattle = false;
                    fightFinished = false;
                    removeOverlay();
                    lastActionState = 'idle';
                    lastActionInfo = null;
                } else {
                    updateOverlay();
                    updateLastActionUI(true);
                }
            });
            wrap.appendChild(btnScript);
        }
        let btnFinal = document.getElementById('tm-final-action-toggle');
        if (!btnFinal) {
            btnFinal = document.createElement('button');
            btnFinal.id = 'tm-final-action-toggle';
            btnFinal.style.fontSize = '10px';
            btnFinal.style.padding = '2px 6px';
            btnFinal.style.opacity = '0.9';
            btnFinal.style.cursor = 'pointer';
            btnFinal.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                cycleFinalAction();
                updateToggleLabels();
                if (scriptEnabled) updateOverlay();
            });
            wrap.appendChild(btnFinal);
        }
        let btnWeapon = document.getElementById('tm-weapon-slot-toggle');
        if (!btnWeapon) {
            btnWeapon = document.createElement('button');
            btnWeapon.id = 'tm-weapon-slot-toggle';
            btnWeapon.style.fontSize = '10px';
            btnWeapon.style.padding = '2px 6px';
            btnWeapon.style.opacity = '0.9';
            btnWeapon.style.cursor = 'pointer';
            btnWeapon.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                cycleWeaponSlot();
                updateToggleLabels();
                if (scriptEnabled) updateOverlay();
            });
            wrap.appendChild(btnWeapon);
        }
        updateToggleLabels();
    }

    function updateToggleLabels() {
        const btnScript = document.getElementById('tm-custom-mug-toggle');
        const btnFinal = document.getElementById('tm-final-action-toggle');
        const btnWeapon = document.getElementById('tm-weapon-slot-toggle');
        if (btnScript) btnScript.textContent = scriptEnabled ? 'Script: ON' : 'Script: OFF';
        if (btnFinal) btnFinal.textContent = 'Final: ' + finalActionPref;
        if (btnWeapon) btnWeapon.textContent = 'Slot: ' + weaponSlotPref;
    }

    function updateOverlay() {
        createToggleUI();
        if (!scriptEnabled) {
            removeOverlay();
            return;
        }
        if (fightFinished) {
            removeOverlay();
            return;
        }
        const mySlot = findMySlot();
        if (!mySlot) {
            removeOverlay();
            return;
        }
        const startFight = findStartFightButton();
        const endMap = getEndActionsMap();
        const anyEnd = hasAnyEndAction(endMap);
        const preferredEnd = pickPreferredEndAction(endMap);
        attachStartFightListener(startFight);
        attachEndActionListeners(endMap);
        if (inBattle) {
            if (anyEnd && preferredEnd) {
                inBattle = false;
                createOverlayButtons(mySlot, [
                    {
                        label: preferredEnd.label,
                        onClick: function () {
                            preferredEnd.el.click();
                        },
                        className: preferredEnd.el.className || 'torn-btn silver'
                    }
                ]);
            } else {
                removeOverlay();
            }
            return;
        }
        if (anyEnd && preferredEnd) {
            createOverlayButtons(mySlot, [
                {
                    label: preferredEnd.label,
                    onClick: function () {
                        preferredEnd.el.click();
                    },
                    className: preferredEnd.el.className || 'torn-btn silver'
                }
            ]);
            return;
        }
        if (startFight) {
            createOverlayButtons(mySlot, [
                {
                    label: 'Refresh',
                    onClick: function () {
                        window.location.reload();
                    },
                    className: 'torn-btn silver'
                },
                {
                    label: 'Start fight',
                    onClick: function () {
                        inBattle = true;
                        fightFinished = false;
                        startFight.click();
                    },
                    className: startFight.className
                }
            ]);
            return;
        }
        if (isTargetNotAvailable()) {
            createOverlayButtons(mySlot, [
                {
                    label: 'Refresh',
                    onClick: function () {
                        window.location.reload();
                    },
                    className: 'torn-btn silver'
                }
            ]);
            return;
        }
        removeOverlay();
    }

    function findBackToProfileLink() {
        const links = document.querySelectorAll('a[href*="profiles.php?XID="]');
        for (const a of links) {
            const txt = (a.textContent || '').trim().toLowerCase();
            if (txt.includes('back to profile')) return a;
        }
        return null;
    }

    function getUserIdFromLink(link) {
        if (!link) return null;
        const href = link.getAttribute('href') || '';
        const m = href.match(/XID=(\d+)/i);
        return m ? m[1] : null;
    }

    function formatDiffFromTimestamp(ts) {
        const nowSec = Math.floor(Date.now() / 1000);
        let diff = Math.max(0, nowSec - ts);
        const units = [
            { nameSing: 'year', namePl: 'years', secs: 365 * 24 * 3600 },
            { nameSing: 'month', namePl: 'months', secs: 30 * 24 * 3600 },
            { nameSing: 'day', namePl: 'days', secs: 24 * 3600 },
            { nameSing: 'hour', namePl: 'hours', secs: 3600 },
            { nameSing: 'minute', namePl: 'minutes', secs: 60 },
            { nameSing: 'second', namePl: 'seconds', secs: 1 }
        ];
        const parts = [];
        for (const u of units) {
            const value = Math.floor(diff / u.secs);
            if (value > 0) {
                parts.push(value + ' ' + (value === 1 ? u.nameSing : u.namePl));
                diff %= u.secs;
            }
        }
        if (parts.length === 0) return 'just now';
        return parts.join(' ');
    }

    function loadLastAction(userId) {
        if (!API_KEY || API_KEY === 'PUT_YOUR_API_KEY_HERE') return;
        if (lastActionState === 'loading') return;
        lastActionState = 'loading';
        const fetchStartSec = Math.floor(Date.now() / 1000);
        const url = 'https://api.torn.com/user/' + userId + '?selections=profile&key=' + API_KEY + '&comment=customMugScript';
        fetch(url)
            .then(function (resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .then(function (data) {
                lastActionLastFetch = fetchStartSec;
                if (data.error) {
                    lastActionState = 'error';
                    lastActionInfo = data.error.error || 'API error';
                    return;
                }
                const la = data.last_action;
                if (!la || !la.timestamp) {
                    lastActionState = 'error';
                    lastActionInfo = 'No last action data';
                    return;
                }
                lastActionState = 'loaded';
                lastActionInfo = {
                    status: la.status || '',
                    timestamp: la.timestamp
                };
            })
            .catch(function (err) {
                lastActionLastFetch = fetchStartSec;
                lastActionState = 'error';
                lastActionInfo = (err && err.message) ? err.message : 'API request failed';
            });
    }

    function updateLastActionUI(forceImmediate) {
        const backLink = findBackToProfileLink();
        if (!backLink) return;
        const parent = backLink.parentElement;
        if (!parent) return;
        let container = document.getElementById('tm-last-action');
        if (!container) {
            container = document.createElement('div');
            container.id = 'tm-last-action';
            container.style.fontSize = '11px';
            container.style.marginTop = '2px';
            container.style.color = '#ccc';
            container.style.whiteSpace = 'nowrap';
            parent.style.display = 'flex';
            parent.style.flexDirection = 'column';
            parent.style.alignItems = 'flex-end';
            parent.appendChild(container);
        }
        if (!scriptEnabled) {
            container.textContent = 'Custom Mug: OFF';
            return;
        }
        if (!API_KEY || API_KEY === 'PUT_YOUR_API_KEY_HERE') {
            container.textContent = 'Last action: set API_KEY in script.';
            return;
        }
        const userId = getUserIdFromLink(backLink);
        if (!userId) {
            container.textContent = 'Last action: cannot determine user id.';
            return;
        }
        const nowSec = Math.floor(Date.now() / 1000);
        if (lastActionState === 'idle') {
            container.textContent = 'Last action: loading...';
            loadLastAction(userId);
            return;
        }
        if (lastActionState !== 'loading' && (nowSec - lastActionLastFetch >= LAST_ACTION_REFRESH_INTERVAL)) {
            loadLastAction(userId);
        }
        if (lastActionState === 'loading' && !lastActionInfo && !forceImmediate) {
            container.textContent = 'Last action: loading...';
            return;
        }
        if (lastActionState === 'error') {
            container.textContent = 'Last action: ' + (lastActionInfo || 'error');
            return;
        }
        if (lastActionState === 'loaded' && lastActionInfo) {
            const statusPart = lastActionInfo.status || '';
            const diffPart = formatDiffFromTimestamp(lastActionInfo.timestamp);
            let text = 'Last action';
            if (statusPart || diffPart) text += ': ';
            if (statusPart) text += statusPart;
            if (statusPart && diffPart) text += ' · ';
            if (diffPart) text += diffPart;
            container.textContent = text;
        }
    }

    function init() {
        loadEnabledFromStorage();
        loadFinalFromStorage();
        loadWeaponFromStorage();
        createToggleUI();
        updateOverlay();
        updateLastActionUI(true);
        setInterval(updateOverlay, 500);
        setInterval(function () {
            updateLastActionUI(false);
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
