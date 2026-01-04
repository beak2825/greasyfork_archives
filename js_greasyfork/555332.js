// ==UserScript==
// @name         Tools Panel
// @namespace    https://torn.com/
// @version      1.0
// @description  Starter Multi-tools! (panel organized by categories, config at top, future category example)
// @author       UnAmigo [3749876]
// @icon         https://www.torn.com/favicon.ico
// @match        https://www.torn.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555332/Tools%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/555332/Tools%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =============================
    // 🔹 CONFIGURATION / CUSTOMIZATION
    // =============================

    // --- NAVIGATION BUTTONS ---
    const navButtons = [
        { label: 'Travel', callback: () => { window.location.href = `https://www.torn.com/page.php?sid=travel`; } },
        { label: 'Bounties', callback: () => { window.location.href = `https://www.torn.com/bounties.php#/!p=main&start=400`; } }, // 400 is aroun 50k-100k bounties page 21
        { label: 'Casino', callback: () => { window.location.href = `https://www.torn.com/casino.php`; } },
        { label: 'Xanax', callback: () => { window.open('https://torn.bzimor.dev/items/bazaar/206', '_blank'); } },
        { label: 'HEG', callback: () => { window.open('https://torn.bzimor.dev/items/bazaar/242', '_blank'); } },
        { label: 'Ecstasy', callback: () => { window.open('https://torn.bzimor.dev/items/bazaar/197', '_blank'); } },
    ];

    // --- QUICK SHOP ITEMS ---
    const shopItems = [
        { id: 180, emoji: "🍺", label: "Beers!", amount: 95 },
        { id: 394, emoji: "🧱", label: "Bricks", amount: 95 },
        { id: 560, emoji: "🍪", label: "Fruicake", amount: 95 },
        { id: 172, emoji: "⛽", label: "Gasoline", amount: 95 },
    ];

    // ---  CATEGORY EXAMPLE (Alerts / Faction buttons) ---
    //const CategoryButtons = [
    //    { label: 'Faction Alert', callback: () => { alert('This is a faction alert example!'); } },
    //    { label: 'Daily Check', callback: () => { console.log('Daily check triggered'); showToast('Daily check executed'); } },
    //    // Add more buttons here for future features
    //];

    // =============================
    // 🔹 CORE SCRIPT (DO NOT CHANGE BELOW)
    // =============================

    // === Centered toast notification ===
    function showToast(message, isSuccess = true) {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.style.position = 'fixed';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
        toast.style.padding = '4px 4px';
        toast.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
        toast.style.color = 'white';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        toast.style.fontWeight = 'bold';
        toast.style.zIndex = '10000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, -50%) scale(1.05)';
        }, 50);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translate(-50%, -50%) scale(1)';
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    // === Fixed side panel ===
    const panel = document.createElement('div');
    panel.id = "toolsPanel";
    panel.style.position = 'fixed';
    panel.style.top = '20%';
    panel.style.right = '0';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '1px';
    panel.style.padding = '4px';
    panel.style.zIndex = '9999';
    document.body.appendChild(panel);

    // === Generic button creator ===
    function createButton(label, callback, id = '') {
        if (id && document.getElementById(id)) return;
        const button = document.createElement('button');
        if (id) button.id = id;
        button.innerHTML = label;
        button.style.backgroundColor = 'green';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '6px 12px';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        button.style.fontWeight = 'bold';
        button.addEventListener('click', callback);
        panel.appendChild(button);
    }

    // === Shop button creator ===
    function createShopButton({ id, emoji, label, amount }) {
        const btnId = `shopBtn_${id}_${103}`;
        if (document.getElementById(btnId)) return;

        const button = document.createElement('button');
        button.id = btnId;
        button.innerHTML = `${emoji} ${label}`;
        button.style.backgroundColor = '#444';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '6px 12px';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        button.style.fontWeight = 'bold';

        button.addEventListener('click', async () => {
            await getAction({
                type: 'post',
                action: 'shops.php',
                data: {
                    step: 'buyShopItem',
                    ID: id,
                    amount: amount,
                    shoparea: 103
                },
                success: (str) => {
                    try {
                        const msg = JSON.parse(str);
                        showToast(`${emoji} ${msg.text}`, msg.success);
                    } catch (e) {
                        console.error('Error parsing response:', e);
                        showToast(`${emoji} Failed to process response`, false);
                    }
                }
            });
        });

        panel.appendChild(button);
    }

    // =============================
    // 🔹 CREATE BUTTONS FROM CONFIG
    // =============================
    navButtons.forEach(btn => createButton(btn.label, btn.callback));
    shopItems.forEach(item => createShopButton(item));
    futureCategoryButtons.forEach(btn => createButton(btn.label, btn.callback));

})();
