// ==UserScript==
// @name         ZedCity Vehicle Weight Display by Macaria v1.01
// @namespace    https://www.zed.city/
// @version      1.01
// @description  Instant vehicle weight display, click-triggered updates, and toast notifications (toggle via script menu)
// @author       Macaria
// @match        https://www.zed.city/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558336/ZedCity%20Vehicle%20Weight%20Display%20by%20Macaria%20v101.user.js
// @updateURL https://update.greasyfork.org/scripts/558336/ZedCity%20Vehicle%20Weight%20Display%20by%20Macaria%20v101.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEY_CUR = 'zed_vehicle_weight_current';
    const KEY_MAX = 'zed_vehicle_weight_max';
    let lastLoadItemsCall = 0;
    const LOADITEMS_COOLDOWN = 1000; // 1 second

    let toastsEnabled = GM_getValue('toastsEnabled', true);

    GM_registerMenuCommand(`Toasts: ${toastsEnabled ? 'ON' : 'OFF'}`, () => {
        toastsEnabled = !toastsEnabled;
        GM_setValue('toastsEnabled', toastsEnabled);
        alert(`Toast notifications are now ${toastsEnabled ? 'ON' : 'OFF'}`);
    });

    function saveWeight(current, max) {
        if (typeof current === 'number' && !Number.isNaN(current)) localStorage.setItem(KEY_CUR, String(current));
        if (typeof max === 'number' && !Number.isNaN(max)) localStorage.setItem(KEY_MAX, String(max));
        updateHUD();
    }

    function loadWeight() {
        return {
            current: parseFloat(localStorage.getItem(KEY_CUR)) || 0,
            max: parseFloat(localStorage.getItem(KEY_MAX)) || 0,
        };
    }

    let hudEl = null;

    function createHUD() {
        const anchor = document.querySelector('a[data-cy="menu-btn-inventory"]');
        if (!anchor) return null;
        if (anchor.querySelector('.zed-weight-hud')) {
            hudEl = anchor.querySelector('.zed-weight-hud');
            return hudEl;
        }

        const container = document.createElement('div');
        container.className = 'zed-weight-hud';
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            margin-top: 2px;
            color: var(--zed-weight-color, #bbb);
            user-select: none;
        `;

        const line = document.createElement('div');
        line.className = 'zed-weight-line';
        container.appendChild(line);

        const label = anchor.querySelector('.q-tab__label');
        if (label) {
            label.style.display = 'inline-flex';
            label.style.flexDirection = 'column';
            label.style.alignItems = 'center';
            label.appendChild(container);
        } else {
            anchor.appendChild(container);
        }

        hudEl = container;
        updateHUD();
        return hudEl;
    }

    function updateHUD() {
        if (!hudEl) hudEl = createHUD();
        if (!hudEl) return;

        const { current, max } = loadWeight();
        const line = hudEl.querySelector('.zed-weight-line');
        line.textContent = `${Math.round(current*100)/100} / ${Math.round(max*100)/100} kg`;
        hudEl.style.setProperty('--zed-weight-color', max > 0 && current > max ? '#ff6666' : '#cbd5e1');
    }

    function calculateVehicleWeight(vehicleItems) {
        if (!Array.isArray(vehicleItems)) return 0;
        return vehicleItems.reduce((sum, item) => {
            const weight = parseFloat(item.vars?.weight || 0);
            const qty = item.stackable ? item.quantity : 1;
            return sum + weight * qty;
        }, 0);
    }

    function showToast(msg) {
        if (!toastsEnabled) return;
        const t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: #fff;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 13px;
            z-index: 99999;
            opacity: 0.95;
        `;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    async function fetchLoadItemsSafe() {
        const now = Date.now();
        if (now - lastLoadItemsCall < LOADITEMS_COOLDOWN) return;
        lastLoadItemsCall = now;

        try {
            showToast('Fetching /loadItems…');
            const res = await fetch('https://api.zed.city/loadItems', {
                method: 'GET',
                credentials: 'include',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            const ct = res.headers.get('content-type') || '';
            if (res.ok && ct.includes('application/json')) {
                const json = await res.json();
                if (Array.isArray(json.vehicle_items)) {
                    const weight = calculateVehicleWeight(json.vehicle_items);
                    const prev = loadWeight();
                    saveWeight(weight, prev.max || 0);
                    showToast('/loadItems completed!');
                } else {
                    showToast('/loadItems failed (no vehicle_items)');
                }
            } else {
                const text = await res.text();
                console.warn('Non-JSON /loadItems response:', text);
                showToast('/loadItems failed (non-JSON response, maybe logged out)');
            }
        } catch (e) {
            console.error('fetchLoadItemsSafe error:', e);
            showToast('/loadItems failed (exception)');
        }
    }

    const origFetch = window.fetch;
    window.fetch = function (...args) {
        const url = args[0] || '';
        if (/getStats/i.test(url)) setTimeout(fetchLoadItemsSafe, 50);
        return origFetch.apply(this, args).then(async (response) => {
            try {
                const ct = response.headers.get('content-type') || '';
                if (ct.includes('application/json')) {
                    const clone = response.clone();
                    const json = await clone.json();
                    handleJsonResponse(json, url);
                }
            } catch(e) {}
            return response;
        });
    };

    const XHR = window.XMLHttpRequest;
    const origOpen = XHR.prototype.open;
    const origSend = XHR.prototype.send;

    XHR.prototype.open = function (method, url, ...rest) {
        this._zed_url = url;
        return origOpen.apply(this, [method, url, ...rest]);
    };

    XHR.prototype.send = function (...args) {
        const onLoad = () => {
            try {
                const url = this._zed_url || '';
                if (/getStats/i.test(url)) setTimeout(fetchLoadItemsSafe, 50);
                const txt = this.responseText;
                if (!txt) return;
                const ct = this.getResponseHeader('content-type') || '';
                if (!ct.includes('application/json')) return;
                const json = JSON.parse(txt);
                handleJsonResponse(json, url);
            } catch(e) {}
        };
        this.addEventListener('load', onLoad);
        return origSend.apply(this, args);
    };

    function handleJsonResponse(json, url) {
        if (/loadItems/i.test(url) && Array.isArray(json.vehicle_items)) {
            const weight = calculateVehicleWeight(json.vehicle_items);
            const prev = loadWeight();
            saveWeight(weight, prev.max || 0);
        }
        if (json.stats && typeof json.stats === 'object') {
            const vc = json.stats.vehicle_capacity;
            if (vc != null) {
                const prev = loadWeight();
                saveWeight(prev.current, Number(vc));
            }
        }
    }

    document.addEventListener('click', fetchLoadItemsSafe);

    window.addEventListener('storage', (e) => {
        if (e.key === KEY_CUR || e.key === KEY_MAX) updateHUD();
    });

    const menuObserver = new MutationObserver(() => createHUD());
    menuObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

    function start() { createHUD(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else start();

})();