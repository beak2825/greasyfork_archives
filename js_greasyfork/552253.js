// ==UserScript==
// @name         Torn Market Item Locker v2
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Add lockable quantity controls to market items (replaces checkbox content, addListing only)
// @author       Glitchey
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @downloadURL https://update.greasyfork.org/scripts/552253/Torn%20Market%20Item%20Locker%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/552253/Torn%20Market%20Item%20Locker%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Only run on addListing page
    function isAddListingPage() {
        return window.location.hash.includes('#/addListing');
    }
    
    if (!isAddListingPage()) {
        console.log('[Lock] Not on addListing page, script disabled');
        return;
    }

    // Create and inject CSS
    const style = document.createElement('style');
    style.textContent = `
        .input-locked {
            pointer-events: none !important;
            opacity: 0.5;
            background-color: #f5f5f5 !important;
        }
        .lock-icon-replacement {
            cursor: pointer;
            color: #666;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            user-select: none;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.9);
            transition: all 0.2s ease;
        }
        .lock-icon-replacement.locked {
            color: #ff4444;
            background: rgba(255, 68, 68, 0.1);
        }
        .lock-icon-replacement:hover {
            color: #333;
            background: rgba(0, 0, 0, 0.1);
            transform: scale(1.1);
        }
        .checkboxWrapper___YnT5u.replaced-with-lock {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);

    const STORAGE_KEY = 'torn_market_locked_items';
    let lockedItems = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    let processedRows = new WeakSet();

    function saveLockedItems() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...lockedItems]));
    }

    function setInputValue(input, value) {
        if (!input || input.value === value) return;
        
        // Don't modify if input is currently focused (prevents keyboard/scroll issues on mobile)
        if (document.activeElement === input) {
            return;
        }
       
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
       
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function findItemRows() {
        // Look for rows with the checkbox wrapper
        const rows = document.querySelectorAll('[class*="itemRow"], [class*="item-row"], [class*="listing"]');
        const validRows = [];
        
        rows.forEach(row => {
            // Must have the checkbox wrapper and inputs to be considered a market item
            const hasCheckboxWrapper = row.querySelector('.checkboxWrapper___YnT5u');
            const hasInputs = row.querySelector('input:not([type="hidden"]):not([type="button"]):not([type="checkbox"])');
            
            if (hasCheckboxWrapper && hasInputs && row.offsetParent !== null && !processedRows.has(row)) {
                validRows.push(row);
            }
        });
       
        console.log('[Lock] Found rows:', validRows.length);
        return validRows;
    }

    function getItemName(row) {
        // Try to find the item name in various places
        const nameSelectors = [
            '.name___XmQWk',
            '[class*="name___"]',
            '[class*="title"] [class*="name"]',
            '[class*="itemName"]',
            '[class*="item-name"]'
        ];
       
        for (const selector of nameSelectors) {
            const nameEl = row.querySelector(selector);
            if (nameEl && nameEl.textContent.trim()) {
                return nameEl.textContent.trim();
            }
        }
       
        // Try to get it from the checkbox label
        const checkboxLabel = row.querySelector('label[class*="marker-css"]');
        if (checkboxLabel) {
            const text = checkboxLabel.textContent.trim();
            const match = text.match(/Make my listing of (.+?) anonymous/);
            if (match) {
                return match[1];
            }
        }
       
        // Fallback: look for any text that might be an item name
        const textElements = row.querySelectorAll('span, div, p');
        for (const el of textElements) {
            const text = el.textContent.trim();
            if (text.length > 3 && text.length < 50 && !text.includes('$') && !text.includes('x') && !text.match(/^\d+$/)) {
                return text;
            }
        }
       
        return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    function lockRowInputs(row, locked) {
        const inputs = row.querySelectorAll('input:not([type="hidden"]):not([type="button"]):not([type="checkbox"])');
       
        inputs.forEach(input => {
            const wrapper = input.closest('[class*="wrapper"], [class*="group"]') || input.parentElement;
           
            if (wrapper) {
                wrapper.classList.toggle('input-locked', locked);
            } else {
                input.classList.toggle('input-locked', locked);
            }
           
            if (locked) {
                setInputValue(input, '0');
            }
        });
       
        console.log(`[Lock] ${locked ? 'Locked' : 'Unlocked'} ${inputs.length} inputs`);
    }

    function addInputListeners(row, itemName) {
        const inputs = row.querySelectorAll('input:not([type="hidden"]):not([type="button"]):not([type="checkbox"])');
       
        inputs.forEach(input => {
            const handler = (e) => {
                if (lockedItems.has(itemName) && e.target.value !== '0' && e.target.value !== '') {
                    setTimeout(() => {
                        if (lockedItems.has(itemName)) {
                            setInputValue(e.target, '0');
                        }
                    }, 50);
                }
            };

            ['input', 'change', 'paste'].forEach(event => {
                input.removeEventListener(event, handler);
                input.addEventListener(event, handler);
            });
        });
    }

    function processRow(row) {
        if (processedRows.has(row)) {
            return;
        }
       
        const checkboxWrapper = row.querySelector('.checkboxWrapper___YnT5u');
        if (!checkboxWrapper || checkboxWrapper.classList.contains('replaced-with-lock')) {
            return;
        }
       
        processedRows.add(row);
       
        const itemName = getItemName(row);
        
        // Use requestAnimationFrame to avoid layout thrashing
        requestAnimationFrame(() => {
            // Clear the checkbox wrapper content and replace with lock icon
            checkboxWrapper.innerHTML = '';
            checkboxWrapper.classList.add('replaced-with-lock');
            
            // Create lock icon
            const lockIcon = document.createElement('div');
            lockIcon.className = 'lock-icon-replacement';
            lockIcon.innerHTML = '🔓';
            lockIcon.title = 'Click to lock/unlock this item';
           
            // Check if item should be locked
            const isLocked = lockedItems.has(itemName);
            if (isLocked) {
                lockIcon.innerHTML = '🔒';
                lockIcon.classList.add('locked');
                lockIcon.title = 'Item is locked - click to unlock';
                lockRowInputs(row, true);
            }
           
            // Add to the cleared checkbox wrapper
            checkboxWrapper.appendChild(lockIcon);
            console.log('[Lock] Replaced checkbox content for:', itemName);
           
            // Add input listeners
            addInputListeners(row, itemName);
           
            // Click handler
            lockIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
               
                const currentlyLocked = lockIcon.classList.contains('locked');
               
                if (currentlyLocked) {
                    // Unlock
                    lockIcon.innerHTML = '🔓';
                    lockIcon.classList.remove('locked');
                    lockIcon.title = 'Click to lock this item';
                    lockRowInputs(row, false);
                    lockedItems.delete(itemName);
                    console.log('[Lock] Unlocked:', itemName);
                } else {
                    // Lock
                    lockIcon.innerHTML = '🔒';
                    lockIcon.classList.add('locked');
                    lockIcon.title = 'Item is locked - click to unlock';
                    lockRowInputs(row, true);
                    lockedItems.add(itemName);
                    console.log('[Lock] Locked:', itemName);
                }
               
                saveLockedItems();
            }, true);
           
            console.log('[Lock] Successfully processed row for:', itemName);
        });
    }

    function processAllRows() {
        const rows = findItemRows();
        console.log('[Lock] Processing', rows.length, 'rows');
       
        // Batch process to reduce layout thrashing
        const fragment = document.createDocumentFragment();
        
        rows.forEach(row => {
            try {
                processRow(row);
            } catch (e) {
                console.error('[Lock] Error processing row:', e, row);
            }
        });
    }

    // Observer for new content
    let processingTimeout = null;
    const observer = new MutationObserver((mutations) => {
        // Check if we're still on addListing page
        if (!isAddListingPage()) {
            console.log('[Lock] Left addListing page, stopping observer');
            observer.disconnect();
            return;
        }
        
        let hasNewContent = false;
       
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (
                        node.matches?.('[class*="itemRow"], [class*="item-row"], [class*="listing"]') ||
                        node.querySelector?.('[class*="itemRow"], [class*="item-row"], [class*="listing"], .checkboxWrapper___YnT5u')
                    )) {
                        hasNewContent = true;
                    }
                });
            }
        });
       
        if (hasNewContent) {
            // Debounce processing to avoid excessive DOM manipulation
            clearTimeout(processingTimeout);
            processingTimeout = setTimeout(() => {
                console.log('[Lock] New content detected, processing...');
                processAllRows();
            }, 250);
        }
    });

    // Start observing
    const targetNode = document.querySelector('#item-market-root') || document.body;
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });

    // Initial processing
    setTimeout(() => {
        console.log('[Lock] Initial processing...');
        processAllRows();
    }, 1500);

    // Backup periodic check
    setInterval(() => {
        // Only run if on addListing page
        if (!isAddListingPage()) {
            return;
        }
        
        const unprocessedRows = findItemRows().filter(row => !processedRows.has(row));
        if (unprocessedRows.length > 0) {
            console.log('[Lock] Found', unprocessedRows.length, 'unprocessed rows');
            processAllRows();
        }
    }, 5000);

    // Cleanup
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
    
    // Monitor hash changes to disable script if user navigates away from addListing
    window.addEventListener('hashchange', () => {
        if (!isAddListingPage()) {
            console.log('[Lock] Navigated away from addListing, disconnecting observer');
            observer.disconnect();
        }
    });

    console.log('[Lock] Market Item Locker initialized (addListing only)');
})();