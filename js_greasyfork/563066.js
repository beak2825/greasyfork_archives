// ==UserScript==
// @name         Rem4rk's Locked Items Manager
// @namespace    https://www.torn.com/
// @version      1.2
// @description  This userscript allows you to lock items in your inventory to prevent accidentally trading, selling, donating, or trashing them. Perfect for protecting high-value items, collections, or anything you want to keep safe!
// @author       rem4rk [2375926] - https://www.torn.com/profiles.php?XID=2375926
// @match        https://www.torn.com/item.php*
// @match        https://www.torn.com/bazaar.php*
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/shops.php?step=*
// @match        https://www.torn.com/bigalgunshop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563066/Rem4rk%27s%20Locked%20Items%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/563066/Rem4rk%27s%20Locked%20Items%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== STORAGE & LOCK MANAGEMENT ==========
    const STORAGE_KEY = 'torn_locked_items';

    function getLockedItems() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }

    function setLockedItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function isItemLocked(itemId) {
        const locked = getLockedItems();
        return locked[itemId] === true;
    }

    function toggleItemLock(itemId) {
        const locked = getLockedItems();
        if (locked[itemId]) {
            delete locked[itemId];
        } else {
            locked[itemId] = true;
        }
        setLockedItems(locked);
        return !locked[itemId];
    }

    function unlockAllItems() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    }

    function hasLockedItems() {
        const locked = getLockedItems();
        return Object.keys(locked).length > 0;
    }

    function getLockedItemCount() {
        const locked = getLockedItems();
        return Object.keys(locked).length;
    }

    // ========== VISUAL FEEDBACK SYSTEM ==========
    function showToast(message, isLocked) {
        const toast = document.createElement('div');
        toast.className = 'torn-lock-toast';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${isLocked ? 'linear-gradient(to right, #d9534f, #c9302c)' : 'linear-gradient(to right, #5cb85c, #449d44)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 9999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateX(400px);
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }

    function showInfoToast(message) {
        const toast = document.createElement('div');
        toast.className = 'torn-lock-info-toast';
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(to right, #5bc0de, #31b0d5);
            color: white;
            padding: 14px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 9999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            transform: translateX(400px);
            max-width: 400px;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // ========== BANNER SYSTEM (NOW TOAST) ==========
    function showLockedItemsToast(pageAction) {
        if (!hasLockedItems()) return;

        const message = `Locked items hidden. To ${pageAction}, unlock them in your inventory.`;
        showInfoToast(message);
    }

    // Add CSS for hidden items
    const style = document.createElement('style');
    style.textContent = `
        .torn-locked-hidden {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            width: 0 !important;
        }
    `;
    document.head.appendChild(style);

    // ========== INVENTORY PAGE ==========
    function handleInventoryPage() {
        // Create "Unlock All" button
        function createUnlockAllButton() {
            if (document.getElementById('torn-unlock-all-btn')) return;

            const unlockBtn = document.createElement('button');
            unlockBtn.id = 'torn-unlock-all-btn';

            function updateButtonText() {
                const count = getLockedItemCount();
                unlockBtn.textContent = count > 0 ? `UNLOCK ALL (${count})` : 'UNLOCK ALL';
            }

            updateButtonText();

            unlockBtn.style.cssText = `
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: linear-gradient(to right, #5cb85c, #449d44);
                color: white;
                font-weight: bold;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                font-size: 14px;
                z-index: 999998;
                transition: all 0.3s ease;
                opacity: .3;
            `;

            unlockBtn.addEventListener('mouseenter', () => {
                unlockBtn.style.background = 'linear-gradient(to right, #449d44, #5cb85c)';
                unlockBtn.style.transform = 'translateY(-50%) scale(1.05)';
                unlockBtn.style.opacity = '1';
            });

            unlockBtn.addEventListener('mouseleave', () => {
                unlockBtn.style.background = 'linear-gradient(to right, #5cb85c, #449d44)';
                unlockBtn.style.transform = 'translateY(-50%) scale(1)';
                unlockBtn.style.opacity = '.3';
            });

            unlockBtn.addEventListener('click', () => {
                const count = getLockedItemCount();
                if (count === 0) {
                    showToast('No items to unlock', false);
                    return;
                }

                if (confirm(`Are you sure you want to unlock ${count} item${count > 1 ? 's' : ''}?`)) {
                    unlockAllItems();
                    showToast(`Unlocked ${count} item${count > 1 ? 's' : ''} ✓`, false);

                    // Refresh all padlocks
                    const allPadlocks = document.querySelectorAll('.torn-padlock');
                    allPadlocks.forEach(padlock => {
                        padlock.textContent = '🔓';
                    });

                    // Re-enable all actions
                    const items = document.querySelectorAll('li[data-item]');
                    items.forEach(item => {
                        const itemId = item.getAttribute('data-item');
                        if (itemId) {
                            updateItemActions(item, itemId);
                        }
                    });

                    updateButtonText();
                }
            });

            document.body.appendChild(unlockBtn);

            // Store reference to update function
            unlockBtn._updateText = updateButtonText;
        }

        function processInventoryItem(itemElement) {
            const itemId = itemElement.getAttribute('data-item');
            if (!itemId) return;

            // Check if padlock already exists
            let nameElement = itemElement.querySelector('.name-wrap, .name');
            if (!nameElement) nameElement = itemElement.querySelector('div[class*="name"]');
            if (!nameElement) return;

            if (nameElement.querySelector('.torn-padlock')) return;

            // Create padlock
            const padlock = document.createElement('span');
            padlock.className = 'torn-padlock';
            padlock.style.cssText = `
                margin-right: 5px;
                cursor: pointer;
                font-size: 14px;
                user-select: none;
            `;
            padlock.textContent = isItemLocked(itemId) ? '🔒' : '🔓';

            padlock.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                const wasLocked = isItemLocked(itemId);
                toggleItemLock(itemId);
                const nowLocked = isItemLocked(itemId);

                padlock.textContent = nowLocked ? '🔒' : '🔓';
                updateItemActions(itemElement, itemId);

                // Show toast notification
                const itemName = itemElement.querySelector('.name')?.textContent?.trim() || 'Item';
                if (nowLocked) {
                    showToast(`${itemName} locked 🔒`, true);
                } else {
                    showToast(`${itemName} unlocked 🔓`, false);
                }

                // Update unlock all button count
                const unlockBtn = document.getElementById('torn-unlock-all-btn');
                if (unlockBtn && unlockBtn._updateText) {
                    unlockBtn._updateText();
                }
            });

            nameElement.insertBefore(padlock, nameElement.firstChild);
            updateItemActions(itemElement, itemId);
        }

        function updateItemActions(itemElement, itemId) {
            const locked = isItemLocked(itemId);
            const actionsToBlock = ['dump', 'send', 'donate', 'sell'];

            actionsToBlock.forEach(action => {
                const actionElement = itemElement.querySelector(`li.${action}`);
                if (actionElement) {
                    if (locked) {
                        actionElement.style.opacity = '0.35';
                        actionElement.style.pointerEvents = 'none';
                        actionElement.style.cursor = 'not-allowed';
                        actionElement.style.position = 'relative';
                    } else {
                        actionElement.style.opacity = '';
                        actionElement.style.pointerEvents = '';
                        actionElement.style.cursor = '';
                    }
                }
            });
        }

        function observeInventory() {
            const items = document.querySelectorAll('li[data-item]');
            items.forEach(processInventoryItem);
        }

        createUnlockAllButton();
        observeInventory();

        const observer = new MutationObserver(() => {
            observeInventory();
        });

        const targetNode = document.body;
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // ========== ITEM MARKET PAGE ==========
    function handleItemMarketPage() {
        function getItemIdFromImage(img) {
            const src = img.getAttribute('src') || img.getAttribute('srcset');
            if (!src) return null;
            const match = src.match(/items\/(\d+)\//);
            return match ? match[1] : null;
        }

        function removePadlocksFromPage() {
            // Remove by class
            const padlocksByClass = document.querySelectorAll('.torn-padlock');
            padlocksByClass.forEach(p => {
                p.classList.add('torn-locked-hidden');
                p.remove();
            });

            // Remove by content (🔒 or 🔓)
            const allSpans = document.querySelectorAll('span');
            allSpans.forEach(el => {
                const text = el.textContent || '';
                if (text === '🔒' || text === '🔓' || text.includes('🔒') || text.includes('🔓')) {
                    if (el.classList.contains('torn-padlock') || el.style.cursor === 'pointer' || el.style.userSelect === 'none') {
                        el.classList.add('torn-locked-hidden');
                        el.remove();
                    }
                }
            });

            // Check for any element with padlock-like classes
            const padlockLikeElements = document.querySelectorAll('[class*="padlock"], [class*="lock"]');
            padlockLikeElements.forEach(el => {
                const text = el.innerText || el.textContent || '';
                if (text.includes('🔒') || text.includes('🔓')) {
                    el.classList.add('torn-locked-hidden');
                    el.remove();
                }
            });
        }

        function processItemMarketItem(itemElement) {
            if (itemElement.hasAttribute('data-lock-processed')) {
                return;
            }
            itemElement.setAttribute('data-lock-processed', 'true');

            // Remove any padlocks from this specific item
            const padlocksInItem = itemElement.querySelectorAll('.torn-padlock, [class*="padlock"]');
            padlocksInItem.forEach(p => {
                p.classList.add('torn-locked-hidden');
                p.remove();
            });

            const spansInItem = itemElement.querySelectorAll('span');
            spansInItem.forEach(el => {
                const text = el.textContent || '';
                if (text === '🔒' || text === '🔓') {
                    el.classList.add('torn-locked-hidden');
                    el.remove();
                }
            });

            // Find the item image to extract item ID
            const img = itemElement.querySelector('img[class*="torn-item"]');
            if (!img) return;

            const itemId = getItemIdFromImage(img);
            if (!itemId) return;

            // If item is locked, hide it completely
            if (isItemLocked(itemId)) {
                itemElement.classList.add('torn-locked-hidden');
                return;
            }
        }

        function observeItemMarket() {
            removePadlocksFromPage();

            const virtualListings = document.querySelectorAll('div.virtualListing___jl0JE:not([data-lock-processed]), div[class*="virtualListing"]:not([data-lock-processed])');
            virtualListings.forEach(processItemMarketItem);

            const childItems = document.querySelectorAll('li[data-group="child"]:not([data-lock-processed])');
            childItems.forEach(processItemMarketItem);

            const itemRows = document.querySelectorAll('div[class*="itemRow"]:not([data-lock-processed])');
            itemRows.forEach(processItemMarketItem);
        }

        showLockedItemsToast('list them on the market');
        observeItemMarket();

        const observer = new MutationObserver(() => {
            removePadlocksFromPage();
            observeItemMarket();
        });

        observer.observe(document.body, { childList: true, subtree: true, attributes: false });

        setInterval(() => {
            removePadlocksFromPage();
        }, 500);
    }

    // ========== BAZAAR PAGE ==========
    function handleBazaarPage() {
        function getItemIdFromImage(img) {
            const src = img.getAttribute('src') || img.getAttribute('srcset');
            if (!src) return null;
            const match = src.match(/items\/(\d+)\//);
            return match ? match[1] : null;
        }

        function processBazaarItem(itemElement) {
            if (itemElement.hasAttribute('data-lock-processed')) {
                return;
            }
            itemElement.setAttribute('data-lock-processed', 'true');

            const img = itemElement.querySelector('img[data-size="medium"], img[class*="torn-item"]');
            if (!img) return;

            const itemId = getItemIdFromImage(img);
            if (!itemId) return;

            // If item is locked, hide it completely
            if (isItemLocked(itemId)) {
                itemElement.classList.add('torn-locked-hidden');
                return;
            }
        }

        function observeBazaar() {
            const items = document.querySelectorAll('li[data-group="child"]:not([data-lock-processed])');
            items.forEach(processBazaarItem);
        }

        showLockedItemsToast('add them to your bazaar');
        observeBazaar();

        const observer = new MutationObserver(() => {
            observeBazaar();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========== TRADE PAGE ==========
    function handleTradePage() {
        function getItemIdFromImage(img) {
            const src = img.getAttribute('src') || img.getAttribute('srcset');
            if (!src) return null;
            const match = src.match(/items\/(\d+)\//);
            return match ? match[1] : null;
        }

        function processTradeItem(itemElement) {
            if (itemElement.hasAttribute('data-lock-processed')) {
                return;
            }
            itemElement.setAttribute('data-lock-processed', 'true');

            const img = itemElement.querySelector('img[data-size="medium"], img[class*="torn-item"]');
            if (!img) return;

            const itemId = getItemIdFromImage(img);
            if (!itemId) return;

            // If item is locked, hide it completely
            if (isItemLocked(itemId)) {
                itemElement.classList.add('torn-locked-hidden');
                return;
            }
        }

        function observeTrade() {
            const items = document.querySelectorAll('li[data-group="child"]:not([data-lock-processed])');
            items.forEach(processTradeItem);
        }

        showLockedItemsToast('trade them');
        observeTrade();

        const observer = new MutationObserver(() => {
            observeTrade();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========== FACTION ARMORY PAGE ==========
    function handleFactionPage() {
        function getItemIdFromImage(img) {
            const src = img.getAttribute('src') || img.getAttribute('srcset');
            if (!src) return null;
            const match = src.match(/items\/(\d+)\//);
            return match ? match[1] : null;
        }

        function processFactionItem(itemElement) {
            if (itemElement.hasAttribute('data-lock-processed')) {
                return;
            }
            itemElement.setAttribute('data-lock-processed', 'true');

            const img = itemElement.querySelector('img[data-size="medium"], img[class*="torn-item"]');
            if (!img) return;

            const itemId = getItemIdFromImage(img);
            if (!itemId) return;

            // If item is locked, hide it completely
            if (isItemLocked(itemId)) {
                itemElement.classList.add('torn-locked-hidden');
                return;
            }
        }

        function observeFaction() {
            const items = document.querySelectorAll('li[data-group="child"]:not([data-lock-processed])');
            items.forEach(processFactionItem);
        }

        showLockedItemsToast('donate them');
        observeFaction();

        const observer = new MutationObserver(() => {
            observeFaction();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========== SHOPS PAGE (shops.php and bigalgunshop.php) ==========
    function handleShopsPage() {
        function getItemIdFromElement(itemElement) {
            // Try to get from data-item attribute
            const dataItem = itemElement.getAttribute('data-item');
            if (dataItem) return dataItem;

            // Try to extract from image src
            const img = itemElement.querySelector('img.torn-item');
            if (img) {
                const src = img.getAttribute('src') || img.getAttribute('srcset');
                if (src) {
                    const match = src.match(/items\/(\d+)\//);
                    if (match) return match[1];
                }
            }

            return null;
        }

        function processShopItem(itemElement) {
            if (itemElement.hasAttribute('data-lock-processed')) {
                return;
            }
            itemElement.setAttribute('data-lock-processed', 'true');

            const itemId = getItemIdFromElement(itemElement);
            if (!itemId) return;

            // If item is locked, hide it completely
            if (isItemLocked(itemId)) {
                itemElement.classList.add('torn-locked-hidden');
                return;
            }
        }

        function observeShops() {
            // Look for items in the sell-items-list
            const sellItems = document.querySelectorAll('.sell-items-list li[data-item]:not([data-lock-processed])');
            sellItems.forEach(processShopItem);
        }

        showLockedItemsToast('sell them');
        observeShops();

        const observer = new MutationObserver(() => {
            observeShops();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ========== INITIALIZE ==========
    const currentUrl = window.location.href;

    if (currentUrl.includes('item.php')) {
        handleInventoryPage();
    } else if (currentUrl.includes('page.php?sid=ItemMarket')) {
        handleItemMarketPage();
    } else if (currentUrl.includes('bazaar.php')) {
        handleBazaarPage();
    } else if (currentUrl.includes('trade.php')) {
        handleTradePage();
    } else if (currentUrl.includes('factions.php')) {
        handleFactionPage();
    } else if (currentUrl.includes('shops.php') || currentUrl.includes('bigalgunshop.php')) {
        handleShopsPage();
    }
})();