// ==UserScript==
// @name         Rem4rk's Locked Items Manager
// @namespace    https://www.torn.com/
// @version      2.0.4
// @description  This userscript allows you to lock items in your inventory to prevent accidentally trading, selling, donating, or trashing them. Perfect for protecting high-value items, collections, or anything you want to keep safe!- Now with Unique ID's, fallback protection, and a settings panel!
// @author       rem4rk [2375926] - https://www.torn.com/profiles.php?XID=2375926
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/market.php*
// @match        https://www.torn.com/shops.php*
// @match        https://www.torn.com/bigalgunshop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563066/Rem4rk%27s%20Locked%20Items%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/563066/Rem4rk%27s%20Locked%20Items%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'torn_locked_items';
    const SETTINGS_KEY = 'torn_locked_settings';

    const getSettings = () => JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { padlockTransparent: true, showActionToasts: true, showInfoToasts: true, showUnlockButton: true };
    const getLockedItems = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    // ========== STYLES ========== //
    const mainStyle = document.createElement('style');
    mainStyle.id = "rem4rk-core-styles";
    mainStyle.textContent = `
        .torn-locks-transparent .torn-padlock { opacity: 0.2; }
        .torn-locks-transparent .torn-padlock.is-locked { opacity: 1 !important; }
        .torn-hide-unlock-btn #torn-unlock-all-btn { display: none !important; }

        .item-locked-actions li.send, .item-locked-actions li.sell,
        .item-locked-actions li.donate, .item-locked-actions li.dump,
        .item-locked-actions li.return {
            opacity: 0.1 !important; pointer-events: none !important; filter: grayscale(1) brightness(0.5) !important;
        }

        #torn-lock-gear {
            position: fixed; top: 15px; left: 15px; width: 34px; height: 34px;
            background: #1a1a1a; color: #fff; border-radius: 4px; cursor: pointer;
            z-index: 1000001; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 1px solid #cf4444;
        }

        #torn-lock-modal {
            display: none; position: fixed; top: 60px; left: 15px; width: 200px;
            background: #1a1a1a; color: #fff; border: 1px solid #333; z-index: 1000002;
            padding: 12px; border-radius: 4px; font-family: sans-serif;
        }

        #torn-unlock-all-btn {
            position: fixed;
            left: 20px;
            top: 50%;

            background: #000;
            color: #fff;
            padding: 12px 16px;
            border-radius: 4px;

            border: 1px solid #f00;

            z-index: 99999;
            cursor: pointer;
            font-weight: bold;
            font-size: 11px;

            opacity: 0.6;
            transition: transform 0.4s ease, opacity 0.3s ease;
       }

       .selectAll___PTOHO {
            position: relative !important;
            visibility: hidden !important;
       }

       .selectAll___PTOHO::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0);
            z-index: 9999;
       }

       #torn-unlock-all-btn:hover {
            transform: scale(1.2);
            opacity: 1;
       }


        #torn-toast-container { position: fixed; top: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 10px; }
        .torn-toast {
            padding: 12px 20px; background: #1a1a1a; color: #fff; border-right: 5px solid #cf4444;
            transform: translateX(150%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .torn-toast.show { transform: translateX(0); }

        body:not(.item-php) .torn-padlock, body:not(.item-php) .lock-icon { display: none !important; }
    `;
    document.head.appendChild(mainStyle);

    // COMMENT: Fixed showToast to strictly respect info/action settings toggle.
    function showToast(msg, type = 'info') {
        const s = getSettings();

        // COMMENT: If it's a reminder/info toast and setting is OFF, kill it.
        if (type === 'reminder' && !s.showInfoToasts) return;
        if (type === 'info' && !s.showInfoToasts) return;

        // COMMENT: If it's a lock/unlock action toast and setting is OFF, kill it.
        if (type === 'action' && !s.showActionToasts) return;
        if (type === 'error' && !s.showActionToasts) return;

        let container = document.getElementById('torn-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'torn-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'torn-toast';
        toast.style.borderRightColor = (type === 'error' || type === 'reminder') ? '#cf4444' : '#6f9e00';
        toast.textContent = msg;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    const getUniversalID = (el) => {
        const armory = el.getAttribute('data-armoryid') || el.querySelector('input[name="armoryID"]')?.value;
        if (armory) return armory;

        const itemId = el.getAttribute('data-id') || el.getAttribute('data-item') || el.querySelector('input[name="ID"]')?.value;
        if (itemId) return itemId;

        const img = el.querySelector('img[src*="/items/"]');
        if (img) {
            const match = img.getAttribute('src').match(/\/items\/(\d+)\//);
            if (match) return match[1];
        }
        return null;
    };

    function updateHidingCSS() {
        const locked = getLockedItems();
        const ids = Object.keys(locked);
        if (ids.length === 0 || window.location.href.includes('item.php')) {
            hidingStyle.textContent = ""; return;
        }

        let css = "";
        ids.forEach(id => {
            css += `li[data-id="${id}"], li[data-item="${id}"], li[data-armoryid="${id}"],
                    li:has(input[value="${id}"]), li:has(img[src*="/items/${id}/"]),
                    div.itemRowWrapper___cFs4O:has([aria-controls*="-${id}"]),
                    .virtualListing___jl0JE:has([aria-controls*="-${id}"]),
                    li:has([data-reactid*=".$${id}"]) { display: none !important; }\n`;
        });
        hidingStyle.textContent = css;
    }

    const hidingStyle = document.createElement('style');
    document.head.appendChild(hidingStyle);

    function runLogic() {
        const isInv = window.location.href.includes('item.php');
        const locked = getLockedItems();
        const settings = getSettings();

        if (isInv) {
            document.body.classList.add('item-php');
            document.querySelectorAll('li[data-id], li[data-item]').forEach(el => {
                const key = getUniversalID(el);
                if (!key || el.getAttribute('data-group') === 'parent') return;

                const isLocked = !!locked[key];
                el.classList.toggle('item-locked-actions', isLocked);

                let lock = el.querySelector('.torn-padlock');
                if (!lock) {
                    lock = document.createElement('span');
                    lock.className = 'torn-padlock';
                    lock.style.cssText = 'cursor:pointer; margin-right:8px; font-size:16px;';
                    lock.onclick = (e) => {
                        e.stopPropagation();
                        const current = getLockedItems();
                        const name = el.querySelector('.name')?.textContent || "Item";
                        if (current[key]) { delete current[key]; showToast(`${name} Unlocked`, 'action'); }
                        else { current[key] = true; showToast(`${name} Locked`, 'error'); }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
                        updateHidingCSS(); runLogic();
                    };
                    const target = el.querySelector('.name-wrap');
                    if (target) target.insertBefore(lock, target.firstChild);
                }
                lock.textContent = isLocked ? '🔒' : '🔓';
                lock.classList.toggle('is-locked', isLocked);
            });
        } else {
            document.querySelectorAll('.lock-icon, .torn-padlock').forEach(e => e.remove());
        }

        document.body.classList.toggle('torn-locks-transparent', settings.padlockTransparent);
        document.body.classList.toggle('torn-hide-unlock-btn', !settings.showUnlockButton);

        removeSelectAll();

        const uBtn = document.getElementById('torn-unlock-all-btn');
        if (uBtn) uBtn.textContent = `Unlock All (${Object.keys(locked).length})`;
    }

    // COMMENT: Reminder toast logic. Respects info-toast toggle.
    if (!window.location.href.includes('item.php')) {
        const count = Object.keys(getLockedItems()).length;
        if (count > 0) setTimeout(() => showToast(`Reminder: ${count} locked items are hidden. Unlock them in inventory.`, 'reminder'), 1000);
    }

    if (!document.getElementById('torn-lock-gear')) {
        const gear = document.createElement('div');
        gear.id = 'torn-lock-gear'; gear.innerHTML = '⚙';
        gear.onclick = () => { const m = document.getElementById('torn-lock-modal'); m.style.display = (m.style.display === 'block') ? 'none' : 'block'; };
        document.body.appendChild(gear);

        const modal = document.createElement('div');
        modal.id = 'torn-lock-modal';
        const s = getSettings();
        modal.innerHTML = `
            <div style="font-weight:bold; margin-bottom:10px; color:#cf4444; border-bottom:1px solid #333; font-size:12px;">SETTINGS</div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px;"><span>TRANSPARENT</span><input type="checkbox" id="c-trans" ${s.padlockTransparent ? 'checked' : ''}></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px;"><span>ACTION TOASTS</span><input type="checkbox" id="c-toast" ${s.showActionToasts ? 'checked' : ''}></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px;"><span>INFO TOASTS</span><input type="checkbox" id="c-info" ${s.showInfoToasts ? 'checked' : ''}></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:11px;"><span>UNLOCK ALL BTN</span><input type="checkbox" id="c-btn" ${s.showUnlockButton ? 'checked' : ''}></div>
        `;
        document.body.appendChild(modal);
        modal.querySelectorAll('input').forEach(input => {
            input.onchange = () => {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify({
                    padlockTransparent: document.getElementById('c-trans').checked,
                    showActionToasts: document.getElementById('c-toast').checked,
                    showInfoToasts: document.getElementById('c-info').checked,
                    showUnlockButton: document.getElementById('c-btn').checked
                }));
                runLogic();
            };
        });
    }

    if (window.location.href.includes('item.php') && !document.getElementById('torn-unlock-all-btn')) {
        const btn = document.createElement('button');
        btn.id = 'torn-unlock-all-btn';
        btn.onclick = () => { if (confirm('Unlock all items?')) { localStorage.setItem(STORAGE_KEY, '{}'); showToast('All items unlocked', 'action'); updateHidingCSS(); runLogic(); } };
        document.body.appendChild(btn);
    }

    let t = null;
    const obs = new MutationObserver(() => {
        if (t) clearTimeout(t);
        t = setTimeout(() => requestAnimationFrame(() => { runLogic(); updateHidingCSS(); }), 300);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    updateHidingCSS(); runLogic();

    function removeSelectAll() {
        document.querySelectorAll(
        '#itemRow-incognitoCheckbox-select-all, #_r_80_'
    ).forEach(el => el.remove());
    }
})();