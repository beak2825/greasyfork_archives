// ==UserScript==
// @name         P3 Site Shop — Auto Purchase (AJAX + Status Bar + Sort Toggle)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Auto-purchase items via AJAX, highlight event icons, filters, persistent settings, no page reload, status bar, sort toggle
// @match        https://pocketpumapets.com/shop*
// @icon         https://www.pocketpumapets.com/favicon.ico
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/552825/P3%20Site%20Shop%20%E2%80%94%20Auto%20Purchase%20%28AJAX%20%2B%20Status%20Bar%20%2B%20Sort%20Toggle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552825/P3%20Site%20Shop%20%E2%80%94%20Auto%20Purchase%20%28AJAX%20%2B%20Status%20Bar%20%2B%20Sort%20Toggle%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'p3shop_autobuy_active';
    const SETTINGS_KEY = 'p3shop_autobuy_settings';

    let running = false;
    let totalItems = 0;
    let purchasedCount = 0;
    let processedCount = 0;

    // --- Stop Button ---
    function createEarlyStopButton() {
        if (document.getElementById('p3shop-stop-btn')) return;
        const stopBtn = document.createElement('button');
        stopBtn.id = 'p3shop-stop-btn';
        stopBtn.textContent = 'Stop Auto-Purchase';
        stopBtn.style.position = 'fixed';
        stopBtn.style.top = '10px';
        stopBtn.style.right = '10px';
        stopBtn.style.zIndex = '9999';
        stopBtn.style.background = 'red';
        stopBtn.style.color = 'white';
        stopBtn.style.padding = '6px 12px';
        stopBtn.style.border = 'none';
        stopBtn.style.borderRadius = '4px';
        stopBtn.style.cursor = 'pointer';
        stopBtn.style.fontWeight = 'bold';
        stopBtn.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';

        stopBtn.addEventListener('click', () => {
            running = false;
            localStorage.removeItem(STORAGE_KEY);
            updateStatus('Stopped by user');
            alert('Auto-Purchase stopped.');
        });

        document.body.appendChild(stopBtn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createEarlyStopButton);
    } else {
        createEarlyStopButton();
    }

    function log(...args) { console.log('[P3 Shop Script]', ...args); }

    function getQtyOwned(shopItemElem) {
        const ownedSpan = shopItemElem.querySelector('.owned_qty .qty');
        if (!ownedSpan) return 0;
        const num = parseInt(ownedSpan.textContent.replace(/,/g, '').trim(), 10);
        return isNaN(num) ? 0 : num;
    }

    function sortItemsByOwned() {
        const shopElems = Array.from(document.querySelectorAll('.shop'));
        if (!shopElems.length) return;
        shopElems.sort((a, b) => getQtyOwned(a) - getQtyOwned(b));
        const container = document.querySelector('#main .centerdiv') || document.querySelector('#main') || document.body;
        shopElems.forEach(elem => container.appendChild(elem));
    }

    function getShopId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async function hasRedIcon(img) {
        return new Promise(resolve => {
            if (!img.complete || img.naturalWidth === 0) {
                img.onload = () => resolve(hasRedIcon(img));
                return;
            }
            if (img.naturalWidth !== 120 || img.naturalHeight !== 120) return resolve(false);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 120; canvas.height = 120;
            ctx.drawImage(img, 0, 0, 120, 120);

            const corner = ctx.getImageData(95, 95, 25, 25).data;
            let redPixels = 0, total = 0;
            for (let i = 0; i < corner.length; i += 4) {
                const r = corner[i], g = corner[i + 1], b = corner[i + 2];
                total++;
                if (r > 150 && r > g + 40 && r > b + 40) redPixels++;
            }
            resolve(redPixels / total > 0.1);
        });
    }

    async function highlightEventImages() {
        const shopElems = Array.from(document.querySelectorAll('.shop'));
        for (const elem of shopElems) {
            const img = elem.querySelector('img');
            if (!img) continue;
            const valid = await hasRedIcon(img);
            elem.style.outline = valid ? '3px solid limegreen' : 'none';
        }
        log('Event Mode: highlighted images with red icons.');
    }

    function updateStatus(msg) {
        const statusBar = document.getElementById('p3shop-status-bar');
        if (!statusBar) return;
        statusBar.textContent = msg;
    }

    async function purchaseItemAJAX(itemElem, qty, requirePumaPence, eventMode) {
        const btn = itemElem.querySelector('.shopbutton');
        if (!btn) return false;
        const currency = btn.getAttribute('data-currency-name') || '';
        if (requirePumaPence && currency !== 'Puma Pence') return false;

        if (eventMode) {
            const img = itemElem.querySelector('img');
            if (!img) return false;
            const valid = await hasRedIcon(img);
            if (!valid) return false;
        }

        const itemId = btn.getAttribute('data-item-id');
        const shopId = getShopId();
        if (!itemId || !shopId) return false;

        const formData = new FormData();
        formData.append('shop_id', shopId);
        formData.append('item_id', itemId);
        formData.append('quantity', qty);

        try {
            await fetch('/actions/shop_purchase.php', { method: 'POST', body: formData, credentials: 'include' });
            purchasedCount++;
            itemElem.style.opacity = '0.5';
            return true;
        } catch (e) {
            log('Purchase failed', e);
            return false;
        }
    }

    async function autoPurchaseLoop(qty, maxOwned, requirePumaPence, eventMode) {
        running = true;
        purchasedCount = 0;
        processedCount = 0;

        let shopElems = Array.from(document.querySelectorAll('.shop'));
        totalItems = shopElems.length;

        const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
        if (savedSettings.sortOwned) sortItemsByOwned();

        for (const itemElem of shopElems) {
            if (!running) break;
            processedCount++;
            const owned = getQtyOwned(itemElem);
            if (owned <= maxOwned) {
                await purchaseItemAJAX(itemElem, qty, requirePumaPence, eventMode);
            }
            updateStatus(`Processed ${processedCount}/${totalItems} — Purchased: ${purchasedCount}`);
            await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
        }

        if (running) {
            updateStatus(`Finished! Total purchased: ${purchasedCount}`);
            alert(`Auto-Purchase finished! Purchased ${purchasedCount} items.`);
        } else {
            updateStatus('Stopped');
        }
        running = false;
    }

    function createControlsUI() {
        const container = document.querySelector('#main .centerdiv') || document.querySelector('#main') || document.body;
        const wrapper = document.createElement('div');
        wrapper.style.margin = '10px 0';
        wrapper.style.padding = '10px';
        wrapper.style.border = '1px solid #ccc';
        wrapper.style.background = '#f9f9f9';

        const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');

        const qtyInput = document.createElement('input'); qtyInput.type = 'number'; qtyInput.min = '1'; qtyInput.value = saved.qty || '1'; qtyInput.style.width = '50px';
        const maxOwnedInput = document.createElement('input'); maxOwnedInput.type = 'number'; maxOwnedInput.min = '0'; maxOwnedInput.value = saved.maxOwned || '0'; maxOwnedInput.style.width = '50px';
        const pumaPenceToggle = document.createElement('input'); pumaPenceToggle.type = 'checkbox'; pumaPenceToggle.checked = saved.requirePumaPence ?? true;
        const eventModeToggle = document.createElement('input'); eventModeToggle.type = 'checkbox'; eventModeToggle.checked = saved.eventMode ?? false;
        const sortOwnedToggle = document.createElement('input'); sortOwnedToggle.type = 'checkbox'; sortOwnedToggle.checked = saved.sortOwned ?? false;

        const startBtn = document.createElement('button'); startBtn.textContent = 'Start Auto-Purchase'; startBtn.style.marginLeft = '6px';
        const stopBtn = document.createElement('button'); stopBtn.textContent = 'Stop'; stopBtn.style.marginLeft = '6px';

        const statusBar = document.createElement('div');
        statusBar.id = 'p3shop-status-bar';
        statusBar.style.marginTop = '8px';
        statusBar.style.padding = '4px 6px';
        statusBar.style.border = '1px solid #888';
        statusBar.style.background = '#eee';
        statusBar.style.fontWeight = 'bold';
        statusBar.textContent = 'Idle';

        const saveSettings = () => {
            const newSettings = {
                qty: parseInt(qtyInput.value, 10),
                maxOwned: parseInt(maxOwnedInput.value, 10),
                requirePumaPence: pumaPenceToggle.checked,
                eventMode: eventModeToggle.checked,
                sortOwned: sortOwnedToggle.checked
            };
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        };
        [qtyInput, maxOwnedInput, pumaPenceToggle, eventModeToggle, sortOwnedToggle].forEach(el => el.addEventListener('change', saveSettings));

        startBtn.addEventListener('click', async () => {
            saveSettings();
            const { qty, maxOwned, requirePumaPence, eventMode, sortOwned } = JSON.parse(localStorage.getItem(SETTINGS_KEY));
            if (eventMode) await highlightEventImages();
            await autoPurchaseLoop(qty, maxOwned, requirePumaPence, eventMode);
        });

        stopBtn.addEventListener('click', () => { running = false; updateStatus('Stopped'); });

        wrapper.append(
            document.createTextNode('Qty:'), qtyInput,
            document.createTextNode(' Max Owned ≤'), maxOwnedInput,
            document.createTextNode(' Only PP '), pumaPenceToggle,
            document.createTextNode(' Event Mode '), eventModeToggle,
            document.createElement('br'),
            document.createTextNode('Sort by Owned Quantity '), sortOwnedToggle,
            startBtn, stopBtn,
            statusBar
        );

        container.insertBefore(wrapper, container.firstChild);

        // Sort immediately on page load if toggle checked
        if (sortOwnedToggle.checked) sortItemsByOwned();
    }

    async function init() {
        const shopElems = Array.from(document.querySelectorAll('.shop'));
        if (!shopElems.length) return;
        createControlsUI();
    }

    window.addEventListener('load', () => setTimeout(init, 1000));
})();
