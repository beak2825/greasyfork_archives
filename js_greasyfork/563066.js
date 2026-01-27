// ==UserScript==
// @name         Rem4rk's Locked Items Manager
// @namespace    https://www.torn.com/
// @version      2.1.5
// @description  Allows you to lock items in your inventory to prevent accidentally trading, selling, donating, or trashing them. Refined for Faction Armory and City Shops with enhanced SPA support.
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
    const DEBUG = false; // Disable debug logging for production

    const getSettings = () => JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { padlockTransparent: true, showActionToasts: true, showInfoToasts: true, showUnlockButton: true };
    const getLockedItems = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    function log(...args) {
        if (DEBUG) console.log('[LOCKED ITEMS]', ...args);
    }

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
            position: fixed; left: 20px; top: 50%;
            background: #000; color: #fff; padding: 12px 16px; border-radius: 4px;
            border: 1px solid #f00; z-index: 99999; cursor: pointer;
            font-weight: bold; font-size: 11px; opacity: 0.6;
            transition: transform 0.4s ease, opacity 0.3s ease;
       }

       .selectAll___PTOHO { position: relative !important; visibility: hidden !important; }
       .selectAll___PTOHO::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0); z-index: 9999; }

       #torn-unlock-all-btn:hover { transform: scale(1.2); opacity: 1; }

        #torn-toast-container { position: fixed; top: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 10px; }
        .torn-toast {
            padding: 12px 20px; background: #1a1a1a; color: #fff; border-right: 5px solid #cf4444;
            transform: translateX(150%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .torn-toast.show { transform: translateX(0); }

        body:not(.item-php) .torn-padlock, body:not(.item-php) .lock-icon { display: none !important; }

        .torn-bazaar-force-hide {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            position: absolute !important;
            pointer-events: none !important;
            overflow: hidden !important;
        }
    `;
    document.head.appendChild(mainStyle);

    // ========== TOAST NOTIFICATIONS ========== //
    function showToast(msg, type = 'info') {
        const s = getSettings();
        if ((type === 'reminder' || type === 'info') && !s.showInfoToasts) return;
        if ((type === 'action' || type === 'error') && !s.showActionToasts) return;

        let container = document.getElementById('torn-toast-container') || (function() {
            const c = document.createElement('div');
            c.id = 'torn-toast-container';
            document.body.appendChild(c);
            return c;
        })();

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

    // ========== UNIVERSAL ID GETTER ========== //
    const getUniversalID = (el) => {
        // Priority 1: Check for armory IDs (weapons/armor with unique IDs)
        const armory = el.getAttribute('data-armoryid') || el.getAttribute('data-armory');
        if (armory) return armory;

        // Priority 2: Check child elements for armory ID
        const armoryChild = el.querySelector('[data-armory], [data-armoryid]');
        if (armoryChild) {
            const childArmory = armoryChild.getAttribute('data-armory') || armoryChild.getAttribute('data-armoryid');
            if (childArmory) return childArmory;
        }

        // Priority 3: Check for armoryID input
        const armoryInput = el.querySelector('input[name="armoryID"]');
        if (armoryInput?.value) return armoryInput.value;

        // Priority 4: For items WITHOUT armory IDs, use base item ID from image
        const img = el.querySelector('img[src*="/items/"]');
        if (img) {
            const src = img.getAttribute('src');
            const match = src.match(/\/items\/(\d+)\//);
            if (match) {
                const baseItemId = match[1];
                const dataItem = el.getAttribute('data-item') || el.getAttribute('data-id');
                if (dataItem && dataItem === baseItemId) {
                    return baseItemId;
                }
                if (!dataItem) {
                    return baseItemId;
                }
            }
        }

        // Priority 5: Fall back to data attributes
        const itemId = el.getAttribute('data-id') || el.getAttribute('data-item');
        if (itemId) return itemId;

        // Priority 6: Check input for ID
        const idInput = el.querySelector('input[name="ID"]');
        if (idInput?.value) return idInput.value;

        return null;
    };

    // ========== CHECK IF ON BAZAAR ADD PAGE ========== //
    function isOnBazaarAddPage() {
        const url = window.location.href;
        if (!url.includes('bazaar.php')) return false;

        const hash = window.location.hash;
        return hash === '#/add';
    }

    // ========== BAZAAR HANDLER ========== //
    let bazaarObserver = null;
    let bazaarProcessInterval = null;

    function stopBazaarObserver() {
        if (bazaarObserver) {
            bazaarObserver.disconnect();
            bazaarObserver = null;
        }
        if (bazaarProcessInterval) {
            clearInterval(bazaarProcessInterval);
            bazaarProcessInterval = null;
        }
    }

    function handleBazaarPage() {
        if (!isOnBazaarAddPage()) {
            log('Not on bazaar add page, stopping observer');
            stopBazaarObserver();
            document.querySelectorAll('.torn-bazaar-force-hide').forEach(el => {
                el.classList.remove('torn-bazaar-force-hide');
            });
            return;
        }

        log('On bazaar add page, starting item hiding');

        function getItemIdFromElement(itemElement) {
            // CRITICAL: Use the EXACT SAME LOGIC as inventory!

            // Priority 1: Armory IDs for weapons/armor
            const armory = itemElement.getAttribute('data-armoryid') || itemElement.getAttribute('data-armory');
            if (armory) {
                log('Found armory ID on element:', armory);
                return armory;
            }

            // Priority 2: Child armory IDs
            const armoryChild = itemElement.querySelector('[data-armory], [data-armoryid]');
            if (armoryChild) {
                const childArmory = armoryChild.getAttribute('data-armory') || armoryChild.getAttribute('data-armoryid');
                if (childArmory) {
                    log('Found child armory ID:', childArmory);
                    return childArmory;
                }
            }

            // Priority 3: Armory input
            const armoryInput = itemElement.querySelector('input[name="armoryID"]');
            if (armoryInput?.value) {
                log('Found armory input:', armoryInput.value);
                return armoryInput.value;
            }

            // Priority 4: BASE ITEM ID from image (for consumables/tools)
            const img = itemElement.querySelector('img[data-size="medium"], img[src*="/items/"]');
            if (img) {
                const src = img.getAttribute('src') || img.getAttribute('srcset');
                if (src) {
                    const match = src.match(/\/items\/(\d+)\//);
                    if (match) {
                        const baseItemId = match[1];
                        log('Extracted base item ID from image:', baseItemId);
                        return baseItemId;
                    }
                }
            }

            // Priority 5: Data attributes (fallback)
            const dataId = itemElement.getAttribute('data-id') || itemElement.getAttribute('data-item');
            if (dataId) {
                log('Found data attribute ID:', dataId);
                return dataId;
            }

            log('❌ Could not extract any ID from element');
            return null;
        }

        function isItemEquipped(itemElement) {
            // Check if item is equipped by looking for "Equipped" text
            const usedDiv = itemElement.querySelector('.used');
            if (usedDiv && usedDiv.textContent.trim() === 'Equipped') {
                return true;
            }

            // Also check for disabled and bg-red classes (equipped items)
            if (itemElement.classList.contains('disabled') && itemElement.classList.contains('bg-red')) {
                return true;
            }

            return false;
        }

        function processBazaarItems() {
            const items = document.querySelectorAll('li[data-group="child"]');
            const locked = getLockedItems();
            let hiddenCount = 0;
            let equippedCount = 0;

            log(`\n=== PROCESSING BAZAAR ITEMS ===`);
            log(`Total items found: ${items.length}`);
            log(`Locked items in storage:`, Object.keys(locked));

            items.forEach((itemElement, index) => {
                const itemId = getItemIdFromElement(itemElement);
                const isEquipped = isItemEquipped(itemElement);

                const nameEl = itemElement.querySelector('.name-wrap .t-overflow, [class*="name"]');
                const itemName = nameEl ? nameEl.textContent.trim() : 'Unknown';

                if (!itemId) {
                    log(`❌ Item #${index} (${itemName}): NO ID EXTRACTED`);
                    return;
                }

                // Hide if LOCKED or EQUIPPED
                if (locked[itemId] || isEquipped) {
                    itemElement.classList.add('torn-bazaar-force-hide');
                    itemElement.setAttribute('data-locked-item', itemId);
                    hiddenCount++;

                    if (isEquipped) {
                        equippedCount++;
                        log(`⚡ Item #${index} (${itemName}): ID=${itemId} - HIDING (EQUIPPED)`);
                    } else {
                        log(`🔒 Item #${index} (${itemName}): ID=${itemId} - HIDING (LOCKED)`);
                    }
                } else {
                    itemElement.classList.remove('torn-bazaar-force-hide');
                    itemElement.removeAttribute('data-locked-item');
                    log(`✅ Item #${index} (${itemName}): ID=${itemId} - VISIBLE`);
                }
            });

            log(`\n=== SUMMARY ===`);
            log(`Hidden: ${hiddenCount} / ${items.length} (${equippedCount} equipped, ${hiddenCount - equippedCount} locked)`);
        }

        processBazaarItems();
        stopBazaarObserver();

        bazaarObserver = new MutationObserver(() => {
            processBazaarItems();
        });

        bazaarObserver.observe(document.body, { childList: true, subtree: true });
        bazaarProcessInterval = setInterval(processBazaarItems, 500);
    }

    // ========== DYNAMIC CSS HIDING ========== //
    function updateHidingCSS() {
        const locked = getLockedItems();
        const ids = Object.keys(locked);
        const url = window.location.href;

        if (url.includes('item.php') ||
            url.includes('sid=ItemMarket#/market') ||
            url.includes('bazaar.php') ||
            ids.length === 0) {
            hidingStyle.textContent = "";
            return;
        }

        const isFaction = url.includes('factions.php');
        const isShop = url.includes('shops.php') || url.includes('bigalgunshop.php');
        const safeSubTabs = ['sub=weapons', 'sub=armour', 'sub=temporary', 'sub=medical', 'sub=consumables', 'sub=drugs', 'sub=boosters', 'sub=utilities', 'sub=loot', 'sub=points'];
        const isSafeTab = safeSubTabs.some(sub => url.includes(sub));

        if (isFaction) {
            const isArmoury = url.includes('tab=armoury');
            if (!isArmoury || (isArmoury && isSafeTab)) {
                hidingStyle.textContent = "";
                return;
            }
        }

        let css = "";
        ids.forEach(id => {
            const baseSelectors = [
                `li[data-id="${id}"]`, `li[data-item="${id}"]`, `li[data-armoryid="${id}"]`,
                `li:has(input[value="${id}"])`, `li:has(img[src*="/items/${id}/"])`,
                `div[class*="itemRow"]:has([aria-controls*="-${id}"])`,
                `div[class*="itemRow"]:has(img[src*="/items/${id}/"])`,
                `.virtualListing___jl0JE:has([aria-controls*="-${id}"])`,
                `li:has([data-reactid*=".$${id}"])`
            ];

            if (isShop) {
                baseSelectors.forEach(sel => {
                    css += `.sell-items-list ${sel}, .sell-items-wrap ${sel} { display: none !important; }\n`;
                });
            } else {
                css += baseSelectors.join(', ') + " { display: none !important; }\n";
            }
        });
        hidingStyle.textContent = css;
    }

    const hidingStyle = document.createElement('style');
    document.head.appendChild(hidingStyle);

    // ========== MAIN LOGIC ========== //
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
                        if (current[key]) {
                            delete current[key];
                            showToast(`${name} Unlocked`, 'action');
                            log(`Unlocked item: ${key} (${name})`);
                        } else {
                            current[key] = true;
                            showToast(`${name} Locked`, 'error');
                            log(`Locked item: ${key} (${name})`);
                        }
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
                        updateHidingCSS();
                        runLogic();
                        if (isOnBazaarAddPage()) {
                            setTimeout(handleBazaarPage, 100);
                        }
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

    // ========== REMOVE SELECT ALL BUTTONS ========== //
    function removeSelectAll() {
        document.querySelectorAll(
            '#itemRow-incognitoCheckbox-select-all, #_r_80_, .sell-act .select, .sell-act button.wai-btn'
        ).forEach(el => el.remove());
    }

    // ========== SETTINGS PANEL ========== //
    if (!document.getElementById('torn-lock-gear')) {
        const gear = document.createElement('div');
        gear.id = 'torn-lock-gear';
        gear.innerHTML = '⚙';
        gear.onclick = () => {
            const m = document.getElementById('torn-lock-modal');
            m.style.display = (m.style.display === 'block') ? 'none' : 'block';
        };
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

    // ========== UNLOCK ALL BUTTON ========== //
    if (window.location.href.includes('item.php') && !document.getElementById('torn-unlock-all-btn')) {
        const btn = document.createElement('button');
        btn.id = 'torn-unlock-all-btn';
        btn.onclick = () => {
            if (confirm('Unlock all items?')) {
                localStorage.setItem(STORAGE_KEY, '{}');
                showToast('All items unlocked', 'action');
                log('All items unlocked');
                updateHidingCSS();
                runLogic();
                if (isOnBazaarAddPage()) {
                    setTimeout(handleBazaarPage, 100);
                }
            }
        };
        document.body.appendChild(btn);
    }

    // ========== SPA PAGE CHANGE HANDLER ========== //
    function handlePageChange() {
        log('Page change detected:', window.location.href);
        [10, 100, 500, 1000].forEach(delay => {
            setTimeout(() => {
                runLogic();
                updateHidingCSS();
                handleBazaarPage();
            }, delay);
        });
    }

    // ========== MUTATION OBSERVER ========== //
    let t = null;
    const obs = new MutationObserver(() => {
        if (t) clearTimeout(t);
        t = setTimeout(() => requestAnimationFrame(() => {
            runLogic();
            updateHidingCSS();
        }), 300);
    });
    obs.observe(document.body, { childList: true, subtree: true });

    // ========== EVENT LISTENERS FOR SPA NAVIGATION ========== //
    window.addEventListener('hashchange', handlePageChange);
    window.addEventListener('popstate', handlePageChange);
    if (window.onurlchange === null) {
        window.addEventListener('urlchange', handlePageChange);
    }
    document.addEventListener('click', (e) => {
        if (e.target.closest('li[role="tab"]')) {
            handlePageChange();
        }
    });

    // ========== LOCKED ITEMS REMINDER ========== //
    if (!window.location.href.includes('item.php')) {
        const count = Object.keys(getLockedItems()).length;
        if (count > 0) {
            setTimeout(() => showToast(`Reminder: ${count} locked items are hidden. Unlock them in inventory.`, 'reminder'), 1000);
        }
    }

    // ========== INITIAL RUN ========== //
    updateHidingCSS();
    runLogic();
    handleBazaarPage();

    log('Script initialized');
})();