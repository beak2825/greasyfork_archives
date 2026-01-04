// ==UserScript==
// @name            [MWI]批量开箱、挂单、出售
// @namespace       https://tampermonkey.net/
// @version         2.0.1
// @run-at          document-start
// @description     先批量选择物品，再执行开箱/挂单/出售功能
// @author          SHIIN
// @license         MIT
// @icon            https://www.milkywayidle.com/favicon.svg
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/551865/%5BMWI%5D%E6%89%B9%E9%87%8F%E5%BC%80%E7%AE%B1%E3%80%81%E6%8C%82%E5%8D%95%E3%80%81%E5%87%BA%E5%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/551865/%5BMWI%5D%E6%89%B9%E9%87%8F%E5%BC%80%E7%AE%B1%E3%80%81%E6%8C%82%E5%8D%95%E3%80%81%E5%87%BA%E5%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wsState = {
        instances: [],
        current: null,
        requestHandlers: new Map(),
        marketDataCache: new Map(),
        gameCore: null,
        wsConnected: false,
        gameCoreReady: false
    };

    function setupWebSocketInterception() {
        const OriginalWebSocket = window.WebSocket;

        function InterceptedWebSocket(...args) {
            const [url] = args;
            const ws = new OriginalWebSocket(...args);

            if (typeof url === 'string' && (url.includes('milkywayidle.com/ws') || url.includes('milkywayidlecn.com/ws'))) {
                wsState.instances.push(ws);
                wsState.current = ws;

                const originalSend = ws.send;
                ws.send = function(data) {
                    try {
                        const parsed = JSON.parse(data);
                        dispatchWsMessage(parsed, 'send');
                    } catch {}
                    return originalSend.call(this, data);
                };

                ws.addEventListener('message', (event) => {
                    try { dispatchWsMessage(JSON.parse(event.data), 'receive'); } catch {}
                });

                ws.addEventListener('open', () => {
                    wsState.wsConnected = true;
                });

                ws.addEventListener('close', () => {
                    wsState.wsConnected = false;
                    const index = wsState.instances.indexOf(ws);
                    if (index > -1) wsState.instances.splice(index, 1);
                    if (wsState.current === ws) {
                        wsState.current = wsState.instances[wsState.instances.length - 1] || null;
                    }
                });
            }
            return ws;
        }

        InterceptedWebSocket.prototype = OriginalWebSocket.prototype;
        InterceptedWebSocket.OPEN = OriginalWebSocket.OPEN;
        InterceptedWebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
        InterceptedWebSocket.CLOSING = OriginalWebSocket.CLOSING;
        InterceptedWebSocket.CLOSED = OriginalWebSocket.CLOSED;
        window.WebSocket = InterceptedWebSocket;
    }

    function dispatchWsMessage(data, direction) {
        if (data.type && wsState.requestHandlers.has(data.type)) {
            wsState.requestHandlers.get(data.type).forEach(handler => {
                try { handler(data); } catch {}
            });
        }
        
        if (data.type === 'market_item_order_books_updated') {
            const itemHrid = data.marketItemOrderBooks?.itemHrid;
            if (itemHrid) {
                wsState.marketDataCache.set(itemHrid, {
                    data: data.marketItemOrderBooks,
                    timestamp: Date.now()
                });
                
            }
        }
    }

    function registerHandler(type, handler) {
        if (!wsState.requestHandlers.has(type)) {
            wsState.requestHandlers.set(type, new Set());
        }
        wsState.requestHandlers.get(type).add(handler);
    }

    function unregisterHandler(type, handler) {
        const handlers = wsState.requestHandlers.get(type);
        if (handlers) {
            handlers.delete(handler);
            if (handlers.size === 0) wsState.requestHandlers.delete(type);
        }
    }

    function hookMessage(messageType, callback, filter = null) {
        const wrappedHandler = (responseData) => {
            try {
                if (filter && !filter(responseData)) return;
                callback(responseData);
            } catch (error) {}
        };
        registerHandler(messageType, wrappedHandler);
        return function unhook() {
            unregisterHandler(messageType, wrappedHandler);
        };
    }

    function waitForMessage(messageType, timeout = 10000, filter = null) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                unhook();
                reject(new Error(`Wait for '${messageType}' timeout (${timeout}ms)`));
            }, timeout);
            const unhook = hookMessage(messageType, (responseData) => {
                clearTimeout(timeoutId);
                unhook();
                resolve(responseData);
            }, filter);
        });
    }

    function getGameCore() {
        try {
            const el = document.querySelector('.GamePage_gamePage__ixiPl');
            if (!el) return null;
            const k = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
            if (!k) return null;
            let f = el[k];
            while (f) {
                if (f.stateNode?.sendPing) return f.stateNode;
                f = f.return;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    function ensureGameCore() {
        if (wsState.gameCore) return true;
        const core = getGameCore();
        if (core) {
            wsState.gameCore = core;
            wsState.gameCoreReady = true;
            return true;
        }
        return false;
    }

    async function getMarketData(itemHrid) {
        const fullItemHrid = itemHrid.startsWith('/items/') ? itemHrid : `/items/${itemHrid}`;
        const cached = wsState.marketDataCache.get(fullItemHrid);
        if (cached && Date.now() - cached.timestamp < 60000) {
            return cached.data;
        }
        if (!wsState.gameCore) {
            throw new Error('Game core not ready');
        }
        const responsePromise = waitForMessage(
            'market_item_order_books_updated',
            8000,
            (responseData) => responseData.marketItemOrderBooks?.itemHrid === fullItemHrid
        );
        wsState.gameCore.handleGetMarketItemOrderBooks(fullItemHrid);
        const response = await responsePromise;
        return response.marketItemOrderBooks;
    }

    function getAskPrice(marketData, enhancementLevel) {
        const asks = marketData.orderBooks?.[enhancementLevel]?.asks;
        if (!asks?.length) return null;
        return asks[0].price;
    }

    function getBidPrice(marketData, enhancementLevel, quantity) {
        const bids = marketData.orderBooks?.[enhancementLevel]?.bids;
        if (!bids?.length) return null;
        let cumulativeQuantity = 0;
        let targetPrice = 0;
        for (const bid of bids) {
            const canSellToThisOrder = Math.min(bid.quantity, quantity - cumulativeQuantity);
            cumulativeQuantity += canSellToThisOrder;
            targetPrice = bid.price;
            if (cumulativeQuantity >= quantity) break;
        }
        return targetPrice;
    }

    async function executeMarketSell(itemHrid, enhancementLevel, quantity, price, isInstant) {
        if (!wsState.gameCore) {
            throw new Error('Game core not ready');
        }
        const fullItemHrid = itemHrid.startsWith('/items/') ? itemHrid : `/items/${itemHrid}`;

        if (isInstant) {
            const successPromise = waitForMessage(
                'info', 15000,
                (responseData) => responseData.message === 'infoNotification.sellOrderCompleted'
            );
            const errorPromise = waitForMessage('error', 15000);
            wsState.gameCore.handlePostMarketOrder(true, fullItemHrid, enhancementLevel, quantity, price, true);
            await Promise.race([
                successPromise,
                errorPromise.then(errorData => Promise.reject(new Error(errorData.message || 'Instant sell failed')))
            ]);
        } else {
            const successPromise = waitForMessage(
                'info', 15000,
                (responseData) => responseData.message === 'infoNotification.sellListingProgress'
            );
            const errorPromise = waitForMessage('error', 15000);
            wsState.gameCore.handlePostMarketOrder(true, fullItemHrid, enhancementLevel, quantity, price, false);
            await Promise.race([
                successPromise,
                errorPromise.then(errorData => Promise.reject(new Error(errorData.message || 'Listing failed')))
            ]);
        }
    }

    function extractItemInfoFromElement(itemElement) {
        try {
            const svg = itemElement.querySelector('svg[aria-label]');
            const itemName = svg ? svg.getAttribute('aria-label') : '';
            const useEl = itemElement.querySelector('use[href], use[xlink\\:href]');
            const href = useEl ? (useEl.getAttribute('href') || useEl.getAttribute('xlink:href') || '') : '';
            let itemHrid = '';
            if (href && href.includes('#')) {
                itemHrid = '/items/' + href.split('#').pop();
            }
            let enhancementLevel = 0;
            const enhanceEl = itemElement.querySelector('[class*="enhancement"], [class*="Enhancement"]');
            if (enhanceEl) {
                const match = enhanceEl.textContent.match(/\+(\d+)/);
                if (match) enhancementLevel = parseInt(match[1], 10);
            }
            const countEl = itemElement.querySelector('[class*="count"], [class*="Count"], [class*="quantity"]');
            let quantity = 1;
            if (countEl) {
                const countText = countEl.textContent.replace(/[^\d]/g, '');
                if (countText) quantity = parseInt(countText, 10);
            }
            return { name: itemName, itemHrid, enhancementLevel, quantity };
        } catch (error) {
            return null;
        }
    }

    setupWebSocketInterception();

    let selectedSpriteKeys = new Set();
    let isOperating = false;
    let operationStopped = false;
    let isSelectionMode = false;
    let checkboxes = new Map(); 
    let itemClickHandlers = new Map(); 
    const categorySelectAll = {
        '货币': { checkbox: null, wrapper: null },
        '资源': { checkbox: null, wrapper: null },
        '技能书': { checkbox: null, wrapper: null },
        '钥匙': { checkbox: null, wrapper: null },
        '食物': { checkbox: null, wrapper: null },
        '饮料': { checkbox: null, wrapper: null },
        '装备': { checkbox: null, wrapper: null },
        '战利品': { checkbox: null, wrapper: null }
    };
    function waitForInventoryArea() {
        setInterval(() => {
            const panels = [
                document.querySelector('div.GamePage_mainPanel__2njyb div[class*="Inventory_inventory"]'),
                document.querySelector('div.GamePage_characterManagementPanel__3OYQL div[class*="Inventory_inventory"]')
            ].filter(Boolean);
            
            panels.forEach(panel => {
                if (!panel.querySelector('.inventory-batch-toolbar')) {
                    panel.insertAdjacentHTML('afterbegin', getToolbarHTML());
                }
            });
            
            bindToolbarEvents();
        }, 500);
    }
    
    function getToolbarHTML() {
        return `
        <div class="inventory-batch-toolbar" style="width:100%;background:transparent;border:none;padding:0 0.5rem;margin:2px 0;display:flex;align-items:center;justify-content:flex-start;min-height:24px;box-sizing:border-box;flex-wrap:nowrap;">
            <div style="display:flex;gap:4px;align-items:center;flex:1;min-width:0;">
                <button class="selection-mode-btn" style="all:unset;background:#6b7280;color:white;border-radius:4px;cursor:pointer;font-size:13px;font-weight:500;flex:1;min-height:20px;display:flex;align-items:center;justify-content:center;padding:3px 6px;white-space:nowrap;">批量选择</button>
                <button class="batch-open-btn" style="all:unset;background:#b45309;color:white;border-radius:4px;cursor:pointer;font-size:13px;font-weight:500;flex:1;min-height:20px;display:flex;align-items:center;justify-content:center;padding:3px 6px;white-space:nowrap;">批量开箱</button>
                <button class="batch-right-sell-btn" style="all:unset;background:#4357af;color:white;border-radius:4px;cursor:pointer;font-size:13px;font-weight:500;flex:1;min-height:20px;display:flex;align-items:center;justify-content:center;padding:3px 6px;white-space:nowrap;">批量左一</button>
                <button class="batch-sell-btn" style="all:unset;background:#21967e;color:white;border-radius:4px;cursor:pointer;font-size:13px;font-weight:500;flex:1;min-height:20px;display:flex;align-items:center;justify-content:center;padding:3px 6px;white-space:nowrap;">批量右一</button>
            </div>
        </div>`;
    }
    
    function bindToolbarEvents() {
        document.querySelectorAll('.selection-mode-btn').forEach(btn => {
            if (!btn.dataset.bound) {
                btn.addEventListener('click', toggleSelectionMode);
                btn.dataset.bound = '1';
            }
        });
        document.querySelectorAll('.batch-open-btn').forEach(btn => {
            if (!btn.dataset.bound) {
                btn.addEventListener('click', batchOpenChest);
                btn.dataset.bound = '1';
            }
        });
        document.querySelectorAll('.batch-right-sell-btn').forEach(btn => {
            if (!btn.dataset.bound) {
                btn.addEventListener('click', batchRightOneSell);
                btn.dataset.bound = '1';
            }
        });
        document.querySelectorAll('.batch-sell-btn').forEach(btn => {
            if (!btn.dataset.bound) {
                btn.addEventListener('click', batchSell);
                btn.dataset.bound = '1';
            }
        });
        const invArea = findInventoryArea();
        if (invArea && invArea !== document && invArea.dataset && !invArea.dataset.monitoringInit) {
            initializeItemMonitoring(invArea);
            invArea.dataset.monitoringInit = '1';
        }
    }

    function findInventoryArea() {
        const invContainer = document.querySelector('div.Inventory_inventory__17CH2') ||
                             document.querySelector('div[class*="Inventory_inventory__"]');
        if (invContainer) return invContainer;
        const invItems = document.querySelector('div[class*="Inventory_items__"]');
        if (invItems) return invItems;
        return document;
    }

    function toggleSelectionMode() {
        isSelectionMode = !isSelectionMode;
        
        document.querySelectorAll('.selection-mode-btn').forEach(btn => {
            if (isSelectionMode) {
                btn.textContent = '退出选择';
                btn.style.setProperty('background', '#dc2626', 'important');
            } else {
                btn.textContent = '批量选择';
                btn.style.setProperty('background', '#6b7280', 'important');
            }
        });
        
        if (isSelectionMode) {
            addCheckboxesToItems();
            Object.keys(categorySelectAll).forEach(cat => {
                ensureCategorySelectAll(document, cat);
                if (categorySelectAll[cat].wrapper) categorySelectAll[cat].wrapper.style.display = 'inline-flex';
            });
        } else {
            removeCheckboxesFromItems();
            clearAllSelections();
            document.querySelectorAll('.batch-select-all-wrapper').forEach(w => w.style.display = 'none');
            document.querySelectorAll('.batch-select-all-checkbox').forEach(cb => {
                cb.checked = false;
                cb.indeterminate = false;
            });
        }
    }

    function exitSelectionModeKeepSelection() {
        isSelectionMode = false;
        
        document.querySelectorAll('.selection-mode-btn').forEach(btn => {
            btn.textContent = '批量选择';
            btn.style.setProperty('background', '#6b7280', 'important');
        });
        
        checkboxes.forEach((checkbox, item) => {
            if (checkbox.parentNode) checkbox.parentNode.removeChild(checkbox);
            item.style.cursor = '';
            const clickHandler = itemClickHandlers.get(item);
            if (clickHandler) item.removeEventListener('click', clickHandler);
        });
        checkboxes.clear();
        itemClickHandlers.clear();

        document.querySelectorAll('.batch-select-all-wrapper').forEach(w => w.style.display = 'none');
        document.querySelectorAll('.batch-select-all-checkbox').forEach(cb => {
            cb.checked = false;
            cb.indeterminate = false;
        });
        
        const inv = findInventoryArea();
        if (inv) {
            inv.querySelectorAll('[class^="Item_item__"]').forEach(item => {
                const spriteKey = getItemSpriteKey(item);
                if (spriteKey && selectedSpriteKeys.has(spriteKey)) {
                    item.style.outline = '2px solid #3b82f6';
                    item.style.outlineOffset = '1px';
                }
            });
        }
    }

    function addCheckboxesToItems() {
        const inventoryArea = findInventoryArea();
        if (!inventoryArea) return;

        const items = inventoryArea.querySelectorAll('[class^="Item_item__"]');
        items.forEach(item => {
            if (isInCharacterManagementPanelArea(item) && !isInventoryTabSelected()) {
                return;
            }

            if (shouldSkipItem(item)) {
                return;
            }

            if (!checkboxes.has(item)) {
                const checkbox = createCheckbox(item);
                item.style.position = 'relative';
                item.style.cursor = 'pointer';
                item.appendChild(checkbox);
                checkboxes.set(item, checkbox);
                
                const clickHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleItemSelection(item, checkbox);
                };
                
                item.addEventListener('click', clickHandler);
                itemClickHandlers.set(item, clickHandler);
            }
            
            const spriteKey = getItemSpriteKey(item);
            if (spriteKey && selectedSpriteKeys.has(spriteKey)) {
                updateItemVisualState(item, true);
            }
        });
    }

    function enforceBlacklistCleanup(inventoryArea) {
        const area = inventoryArea || findInventoryArea();
        if (!area) return;
        const items = area.querySelectorAll('[class^="Item_item__"]');
        items.forEach(item => {
            if (isBlacklistedItem(item)) {
                const existing = checkboxes.get(item) || item.querySelector('.mw-batch-checkbox');
                if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
                checkboxes.delete(item);
                const clickHandler = itemClickHandlers.get(item);
                if (clickHandler) {
                    item.removeEventListener('click', clickHandler);
                    itemClickHandlers.delete(item);
                }
                item.style.cursor = '';
            }
        });
    }
    function removeCheckboxesFromItems() {
        checkboxes.forEach((checkbox, item) => {
            if (checkbox.parentNode) {
                checkbox.parentNode.removeChild(checkbox);
            }
            item.style.cursor = '';
            item.style.outline = '';
            
            const clickHandler = itemClickHandlers.get(item);
            if (clickHandler) {
                item.removeEventListener('click', clickHandler);
            }
        });
        checkboxes.clear();
        itemClickHandlers.clear();
        selectedSpriteKeys.clear();
    }

    function createCheckbox(item) {
        const checkbox = document.createElement('div');
        checkbox.style.cssText = `
            position: absolute !important;
            top: 4px !important;
            left: 4px !important;
            width: 18px !important;
            height: 18px !important;
            background: transparent !important;
            border: 1px solid #999999 !important;
            border-radius: 3px !important;
            pointer-events: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 10 !important;
            font-size: 16px !important;
            font-weight: bold !important;
            color: #333 !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
            line-height: 1 !important;
            font-family: Arial, sans-serif !important;
        `;
        checkbox.className = 'mw-batch-checkbox';
        checkbox.dataset.batchCheckbox = '1';

        return checkbox;
    }

    function getItemSpriteKey(item) {
        try {
            const useEl = item.querySelector('use[href], use[xlink\\:href]');
            const href = useEl ? (useEl.getAttribute('href') || useEl.getAttribute('xlink:href') || '') : '';
            if (href && href.includes('#')) {
                return href.split('#').pop().toLowerCase();
            }
        } catch (_) {}
        return null;
    }

    function toggleItemSelection(item, checkbox) {
        if (isBlacklistedItem(item)) {
            updateItemVisualState(item, false);
            return;
        }
        const spriteKey = getItemSpriteKey(item);
        if (!spriteKey) return;
        
        const isCurrentlySelected = selectedSpriteKeys.has(spriteKey);
        
        if (isCurrentlySelected) {
            selectedSpriteKeys.delete(spriteKey);
            updateItemVisualState(item, false);
        } else {
            selectedSpriteKeys.add(spriteKey);
            updateItemVisualState(item, true);
        }
    }

    function updateItemVisualState(item, isSelected) {
        const checkbox = item.querySelector('.mw-batch-checkbox');
        if (isSelected) {
            item.style.outline = '2px solid #3b82f6';
            item.style.outlineOffset = '1px';
            if (checkbox) {
                checkbox.innerHTML = '✓';
                checkbox.style.color = 'white';
                checkbox.style.fontSize = '16px';
                checkbox.style.fontWeight = 'bold';
            }
        } else {
            item.style.outline = '';
            item.style.outlineOffset = '';
            if (checkbox) {
                checkbox.textContent = '';
            }
        }
    }

    function clearAllSelections() {
        const inv = findInventoryArea();
        if (inv) {
            inv.querySelectorAll('[class^="Item_item__"]').forEach(item => {
                item.style.outline = '';
            });
        }
        selectedSpriteKeys.clear();
        
        checkboxes.forEach(checkbox => {
            checkbox.innerHTML = '';
            checkbox.style.background = 'transparent';
            checkbox.style.border = '1px solid #999999';
            checkbox.style.color = '#333';
        });
    }

    function initializeItemMonitoring(inventoryArea) {
        setInterval(() => {
            if (isSelectionMode) {
                updateItemCheckboxes(inventoryArea);
                enforceBlacklistCleanup(inventoryArea);
                const charMgmtPanel = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_characterManagementPanel__3OYQL');
                if (charMgmtPanel) {
                    if (isInventoryTabSelected()) {
                        updateItemCheckboxes(charMgmtPanel);
                        enforceBlacklistCleanup(charMgmtPanel);
                    } else {
                        const items = charMgmtPanel.querySelectorAll('[class^="Item_item__"]');
                        items.forEach(item => {
                            const existing = checkboxes.get(item);
                            if (existing && existing.parentNode) {
                                existing.parentNode.removeChild(existing);
                            }
                            checkboxes.delete(item);
                            const clickHandler = itemClickHandlers.get(item);
                            if (clickHandler) {
                                item.removeEventListener('click', clickHandler);
                                itemClickHandlers.delete(item);
                            }
                            item.style.cursor = '';
                            item.style.outline = '';
                        });
                    }
                }
            }
            cleanupRemovedItems();
            Object.keys(categorySelectAll).forEach(cat => ensureCategorySelectAll(document, cat));
        }, 1000);
    }

    function updateItemCheckboxes(inventoryArea) {
        const items = inventoryArea.querySelectorAll('[class^="Item_item__"]');
        
        items.forEach(item => {
            if (isInCharacterManagementPanelArea(item) && !isInventoryTabSelected()) {
                const existing = checkboxes.get(item);
                if (existing && existing.parentNode) {
                    existing.parentNode.removeChild(existing);
                }
                checkboxes.delete(item);
                const clickHandler = itemClickHandlers.get(item);
                if (clickHandler) {
                    item.removeEventListener('click', clickHandler);
                    itemClickHandlers.delete(item);
                }
                item.style.cursor = '';
                item.style.outline = '';
                return;
            }

            if (shouldSkipItem(item)) {
                const existing = checkboxes.get(item);
                if (existing && existing.parentNode) {
                    existing.parentNode.removeChild(existing);
                }
                checkboxes.delete(item);
                const clickHandler = itemClickHandlers.get(item);
                if (clickHandler) {
                    item.removeEventListener('click', clickHandler);
                    itemClickHandlers.delete(item);
                }
                item.style.cursor = '';
                item.style.outline = '';
                if (isBlacklistedItem(item)) {
                    const spriteKey = getItemSpriteKey(item);
                    if (spriteKey) selectedSpriteKeys.delete(spriteKey);
                }
                return;
            }
            
            const spriteKey = getItemSpriteKey(item);
            const shouldBeSelected = spriteKey && selectedSpriteKeys.has(spriteKey);
            
            let checkbox = checkboxes.get(item);
            if (!checkbox) {
                checkbox = createCheckbox(item);
                item.style.position = 'relative';
                item.style.cursor = 'pointer';
                item.appendChild(checkbox);
                checkboxes.set(item, checkbox);
                
                const clickHandler = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleItemSelection(item, checkbox);
                };
                
                item.addEventListener('click', clickHandler);
                itemClickHandlers.set(item, clickHandler);
            }
            
            updateItemVisualState(item, shouldBeSelected);
        });
    }

    function cleanupRemovedItems() {

        const checkboxesToRemove = [];
        checkboxes.forEach((checkbox, item) => {
            if (!item.parentNode || !document.contains(item)) {
                checkboxesToRemove.push(item);
            }
        });
        checkboxesToRemove.forEach(item => checkboxes.delete(item));
    }

    function isInExcludedCategory(node) {
        if (!node) return false;
        const grid = node.closest('div[class^="Inventory_itemGrid"]');
        if (!grid) return false;
        let labelSpan = grid.querySelector('div[class^="Inventory_label"] span[class^="Inventory_categoryButton"]');
        if (!labelSpan) {
            labelSpan = grid.querySelector('span[class^="Inventory_categoryButton"]');
        }
        if (!labelSpan) {
            labelSpan = grid.querySelector('div[class*="Inventory_label"]');
        }
        const text = labelSpan ? (labelSpan.textContent || '').trim().toLowerCase() : '';
        return text === '货币' || text === 'currencies';
    }

    function getItemName(item) {
        if (!item) return '';
        const svg = item.querySelector('svg[aria-label]');
        if (svg) {
            const label = svg.getAttribute('aria-label') || '';
            if (label) return label.trim();
        }
        const titleNode = item.querySelector('[class*="Item_title"], [class*="Item_name"], [class*="item-title"], [class*="itemName"], [class*="title"]');
        let name = titleNode ? (titleNode.textContent || '') : '';
        if (!name) {
            const img = item.querySelector('img');
            if (img) name = img.getAttribute('alt') || img.getAttribute('title') || '';
        }
        if (!name) {
            name = item.getAttribute('aria-label') || item.getAttribute('title') || '';
        }
        if (!name) {
            name = (item.textContent || '').trim().split('\\n')[0].trim();
        }
        return name.trim();
    }
    function getItemCategory(item) {
        if (!item) return '';
        const grid = item.closest('div[class^="Inventory_itemGrid"]');
        if (!grid) return '';
        let labelSpan = grid.querySelector('div[class^="Inventory_label"] span[class^="Inventory_categoryButton"]');
        if (!labelSpan) {
            labelSpan = grid.querySelector('span[class^="Inventory_categoryButton"]');
        }
        if (!labelSpan) {
            labelSpan = grid.querySelector('div[class*="Inventory_label"]');
        }
        const text = labelSpan ? (labelSpan.textContent || '').trim() : '';
        return text;
    }
    const BLACKLIST_NAMES = ['秘法披风','阴森斗篷','奇幻箭袋','任务水晶','魔术师帽子','enchanted cloak','sinister token','chimerical token','task crystal',"magician's hat",
        'griffin bulwark','cursed bow','furious spear','regal sword','chaotic flail','sundering crossbow',
        'rippling trident','blooming trident','blazing trident',"knight's aegis","bishop's codex",'corsair helmet',
        "dairyhand's top","forager's top","lumberjack's top","cheesemaker's top",
        "crafter's top","tailor's top","chef's top","brewer's top","alchemist's top","enhancer's top",
        'demonic plate body','anchorbound plate body','maelstrom plate body','kraken tunic',
        'royal water robe top','royal nature robe top','royal fire robe top',
        "dairyhand's bottoms","forager's bottoms","cheesemaker's bottoms","crafter's bottoms",
        "tailor's bottoms","chef's bottoms","brewer's bottoms","alchemist's bottoms","enhancer's bottoms",
        'anchorbound plate legs','maelstrom plate legs','kraken chaps',
        'royal water robe bottoms','royal nature robe bottoms','royal fire robe bottoms',
        'dodocamel gauntlets','marksman bracers','chrono gloves',
        'shoebill shoes','centaur boots','black bear shoes','grizzly bear shoes','polar bear shoes','sorcerer boots',
        'gluttonous pouch','guzzling pouch',"collector's boots",'red culinary hat','watchful relic',
        "philosopher's necklace","philosopher's earrings","philosopher's ring",'charm','celestial',
        "philosopher's stone",'bag of 10 cowbells','ultra',"philosopher's mirror",
        'lucky coffee','critical coffee','channeling coffee','swiftness coffee','wisdom coffee',
        'sinister cape','chimerical quiver','eye watch',
        'spaceberry donut','marsberry donut','star fruit gummy','peach gummy','dragon fruit gummy',
        'dragon fruit yogurt','peach yogurt','marsberry cake','spaceberry cake','plum gummy','star fruit yogurt'];
    const BLACKLIST_SPRITES = ['enchanted_cloak','sinister_token','chimerical_token','task_crystal','magicians_hat',
        'griffin_bulwark','cursed_bow','furious_spear','regal_sword','chaotic_flail','sundering_crossbow',
        'rippling_trident','blooming_trident','blazing_trident','knights_aegis','bishops_codex','corsair_helmet',
        'dairyhands_top','foragers_top','lumberjacks_top','cheesemakers_top',
        'crafters_top','tailors_top','chefs_top','brewers_top','alchemists_top','enhancers_top',
        'demonic_plate_body','anchorbound_plate_body','maelstrom_plate_body','kraken_tunic',
        'royal_water_robe_top','royal_nature_robe_top','royal_fire_robe_top',
        'dairyhands_bottoms','foragers_bottoms','cheesemakers_bottoms','crafters_bottoms',
        'tailors_bottoms','chefs_bottoms','brewers_bottoms','alchemists_bottoms','enhancers_bottoms',
        'anchorbound_plate_legs','maelstrom_plate_legs','kraken_chaps',
        'royal_water_robe_bottoms','royal_nature_robe_bottoms','royal_fire_robe_bottoms',
        'dodocamel_gauntlets','marksman_bracers','chrono_gloves',
        'shoebill_shoes','centaur_boots','black_bear_shoes','grizzly_bear_shoes','polar_bear_shoes','sorcerer_boots',
        'gluttonous_pouch','guzzling_pouch','collectors_boots','red_culinary_hat','watchful_relic',
        'philosophers_necklace','philosophers_earrings','philosophers_ring','charm','celestial',
        'philosophers_stone','bag_of_10_cowbells','ultra','philosophers_mirror',
        'lucky_coffee','critical_coffee','channeling_coffee','swiftness_coffee','wisdom_coffee',
        'sinister_cape','chimerical_quiver','eye_watch',
        'spaceberry_donut','marsberry_donut','star_fruit_gummy','peach_gummy','dragon_fruit_gummy',
        'dragon_fruit_yogurt','peach_yogurt','marsberry_cake','spaceberry_cake','plum_gummy','star_fruit_yogurt'];

    function isBlacklistedItem(item) {
        const name = getItemName(item);
        if (!name) return false;
        const nameLower = name.toLowerCase();
        let spriteKey = '';
        try {
            const useEl = item.querySelector('use[href], use[xlink\\:href]');
            const href = useEl ? (useEl.getAttribute('href') || useEl.getAttribute('xlink:href') || '') : '';
            if (href && href.includes('#')) spriteKey = href.split('#').pop().toLowerCase();
        } catch (_) {}
        const cat = getItemCategory(item);
        if (cat === '资源' || (cat || '').toLowerCase() === 'resources') {
            return nameLower.includes('任务水晶') || nameLower.includes('task crystal') || spriteKey.includes('task_crystal');
        }
        const isBasicCharm = nameLower.includes('basic') || spriteKey.includes('basic');
        const filteredNames = isBasicCharm 
            ? BLACKLIST_NAMES.filter(k => k.toLowerCase() !== 'charm')
            : BLACKLIST_NAMES;
        const filteredSprites = isBasicCharm 
            ? BLACKLIST_SPRITES.filter(sk => sk !== 'charm')
            : BLACKLIST_SPRITES;
        return filteredNames.some(k => nameLower.includes(k.toLowerCase()))
            || (spriteKey && filteredSprites.some(sk => spriteKey.includes(sk)));
    }
    function isInCharacterManagementPanelArea(item) {
        if (!item) return false;
        const charMgmtPanel = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_characterManagementPanel__3OYQL');
        return charMgmtPanel && charMgmtPanel.contains(item);
    }

    function isInventoryTabSelected() {
        const selectedTab = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_characterManagementPanel__3OYQL > div > div > div > div.TabsComponent_tabsContainer__3BDUp button.Mui-selected');
        if (!selectedTab) return false;
        const text = selectedTab.textContent.trim().toLowerCase();
        return text === 'inventory' || text === '库存';
    }

    function shouldSkipItem(item) {
        const charMgmtPanel = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_characterManagementPanel__3OYQL');
        if (charMgmtPanel && charMgmtPanel.contains(item)) {
            if (!isInventoryTabSelected()) {
                return true;
            }
            return isInExcludedCategory(item) || isBlacklistedItem(item);
        }
        return isInExcludedCategory(item) || isBlacklistedItem(item);
    }

    function findCategoryLabel(inventoryArea, text) {
        const textMap = {
            '食物': ['食物', 'Foods', 'Food'],
            '饮料': ['饮料', 'Drinks', 'Drink'],
            '装备': ['装备', 'Equipment'],
            '钥匙': ['钥匙', 'Keys', 'Key'],
            '资源': ['资源', 'Resources', 'Resource'],
            '技能书': ['技能书', 'Skill Books', 'Skills'],
            '战利品': ['战利品', 'Loot'],
            '货币': ['货币', 'Currency']
        };
        const searchTexts = textMap[text] || [text];
        const searchRoots = [
            document.querySelector('div.GamePage_mainPanel__2njyb div.Inventory_items__6SXv0'),
            document.querySelector('div.GamePage_mainPanel__2njyb div[class*="Inventory_items"]'),
            document.querySelector('div.GamePage_characterManagementPanel__3OYQL div.Inventory_items__6SXv0'),
            document.querySelector('div.GamePage_characterManagementPanel__3OYQL div[class*="Inventory_items"]'),
            document
        ].filter(Boolean);
        
        for (const root of searchRoots) {
            const candidates = root.querySelectorAll('span[class^="Inventory_categoryButton"]');
            for (const el of candidates) {
                const t = (el.textContent || '').trim();
                if (searchTexts.some(s => t === s || t.toLowerCase() === s.toLowerCase())) {
                    return el;
                }
            }
        }
        return null;
    }
    
    function findAllCategoryLabels(text) {
        const textMap = {
            '食物': ['食物', 'Foods', 'Food'],
            '饮料': ['饮料', 'Drinks', 'Drink'],
            '装备': ['装备', 'Equipment'],
            '钥匙': ['钥匙', 'Keys', 'Key'],
            '资源': ['资源', 'Resources', 'Resource'],
            '技能书': ['技能书', 'Skill Books', 'Skills'],
            '战利品': ['战利品', 'Loot'],
            '货币': ['货币', 'Currency']
        };
        const searchTexts = textMap[text] || [text];
        const results = new Set();
        const candidates = document.querySelectorAll('span[class^="Inventory_categoryButton"]');
        for (const el of candidates) {
            const t = (el.textContent || '').trim();
            if (searchTexts.some(s => t === s || t.toLowerCase() === s.toLowerCase())) {
                results.add(el);
            }
        }
        return Array.from(results);
    }

    function ensureCategorySelectAll(inventoryArea, category) {
        if (category === '货币') return;
        try {
            const labels = findAllCategoryLabels(category);
            if (!labels || labels.length === 0) return;
            
            labels.forEach((lbl) => {
                if (lbl.dataset.batchSelectAllAdded === '1') {
                    const next = lbl.nextElementSibling;
                    if (next && next.classList.contains('batch-select-all-wrapper') && isSelectionMode) {
                        next.style.display = 'inline-flex';
                    }
                    return;
                }
                lbl.dataset.batchSelectAllAdded = '1';
                
                const wrapper = document.createElement('span');
                wrapper.className = 'batch-select-all-wrapper';
                wrapper.style.cssText = 'margin-left: 6px; user-select: none; display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 6px; cursor: pointer; background: rgba(99,102,241,0.16); border: 1px solid rgba(99,102,241,0.40);';
                wrapper.style.display = isSelectionMode ? 'inline-flex' : 'none';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'batch-select-all-checkbox';
                checkbox.dataset.category = category;
                checkbox.style.cssText = 'margin-left: 0; cursor: pointer; width: 18px; height: 18px;';
                
                const cbLabel = document.createElement('span');
                cbLabel.textContent = '全选';
                cbLabel.style.cssText = 'font-size: 12px; color: white; cursor: pointer;';
                
                wrapper.appendChild(checkbox);
                wrapper.appendChild(cbLabel);
                
                checkbox.addEventListener('click', (e) => e.stopPropagation());
                wrapper.addEventListener('click', (e) => {
                    if (e.target === checkbox) return;
                    e.preventDefault();
                    e.stopPropagation();
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                });
                checkbox.addEventListener('change', (e) => {
                    if (e.target.checked) selectAllCategoryByLabel(lbl, category);
                    else clearCategorySelectionByLabel(lbl, category);
                });
                
                if (lbl.tagName === 'DIV') {
                    lbl.style.display = 'flex';
                    lbl.style.alignItems = 'center';
                    lbl.style.gap = '6px';
                    lbl.appendChild(wrapper);
                } else {
                    lbl.parentNode.insertBefore(wrapper, lbl.nextSibling);
                }
            });
        } catch (err) {}
    }

    function getCategoryItemsByLabel(labelEl) {
        if (!labelEl) return [];
        let grid = labelEl.closest('div[class^="Inventory_itemGrid"]');
        if (!grid) {
            let anchor = labelEl.parentElement || labelEl;
            let sib = anchor.nextElementSibling;
            let steps = 0;
            while (sib && steps < 15) {
                if (sib.matches && sib.matches('div[class^="Inventory_itemGrid"]')) { grid = sib; break; }
                const found = sib.querySelector && sib.querySelector('div[class^="Inventory_itemGrid"]');
                if (found) { grid = found; break; }
                sib = sib.nextElementSibling;
                steps++;
            }
        }
        if (!grid) return [];
        return Array.from(grid.querySelectorAll('[class^="Item_item__"]'));
    }

    function selectAllCategoryByLabel(labelEl, category) {
        if (!isSelectionMode) toggleSelectionMode(); else addCheckboxesToItems();
        const items = getCategoryItemsByLabel(labelEl).filter(i => !isBlacklistedItem(i));
        if (items.length === 0) return;
        items.forEach(item => {
            const spriteKey = getItemSpriteKey(item);
            if (spriteKey && !selectedSpriteKeys.has(spriteKey)) {
                selectedSpriteKeys.add(spriteKey);
                updateItemVisualState(item, true);
            }
        });
    }

    function clearCategorySelectionByLabel(labelEl, category) {
        const items = getCategoryItemsByLabel(labelEl).filter(i => !isBlacklistedItem(i));
        items.forEach(item => {
            const spriteKey = getItemSpriteKey(item);
            if (spriteKey && selectedSpriteKeys.has(spriteKey)) {
                selectedSpriteKeys.delete(spriteKey);
                updateItemVisualState(item, false);
            }
        });
    }

    async function batchOpenChest() {
        await executeBatchOperation({
            emptyMsg: '请先进入批量选择模式选择物品',
            needGameCore: false,
            startMsg: '开始批量开箱',
            action: performOpenChestAction,
            delay: 500,
            stopMsg: '批量开箱已停止',
            doneMsg: '批量开箱完成'
        });
    }

    async function performOpenChestAction(item) {
        try {
            const itemInfo = extractItemInfoFromElement(item);
            if (!itemInfo || !itemInfo.itemHrid) {
                return false;
            }
            
            const ws = wsState.current;
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                showMessage('WebSocket未连接', 2000, 'error');
                return false;
            }
            
            const urlMatch = window.location.href.match(/characterId=(\d+)/);
            const characterId = urlMatch ? urlMatch[1] : '';
            if (!characterId) {
                return false;
            }
            
            const itemName = itemInfo.itemHrid.replace('/items/', '');
            const itemHash = `${characterId}::/item_locations/inventory::/items/${itemName}::${itemInfo.enhancementLevel || 0}`;
            
            const message = {
                type: 'open_loot',
                openLootData: {
                    itemHash: itemHash,
                    count: itemInfo.quantity || 1
                }
            };
            
            ws.send(JSON.stringify(message));
            await sleep(1000);
            return true;
        } catch (error) {
            return false;
        }
    }

    function installMutationCleanup() {
        try {
            const area = findInventoryArea() || document;
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes && m.addedNodes.forEach(n => {
                        if (!(n instanceof HTMLElement)) return;
                        const items = [];
                        if (n.matches && n.matches('[class^="Item_item__"], [class*="Item_item__"]')) {
                            items.push(n);
                        }
                        n.querySelectorAll && n.querySelectorAll('[class^="Item_item__"], [class*="Item_item__"]').forEach(el => items.push(el));
                        items.forEach(item => {
                            if (isBlacklistedItem(item)) {
                                const existing = checkboxes.get(item) || item.querySelector('.mw-batch-checkbox');
                                if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
                                checkboxes.delete(item);
                                const clickHandler = itemClickHandlers.get(item);
                                if (clickHandler) {
                                    item.removeEventListener('click', clickHandler);
                                    itemClickHandlers.delete(item);
                                }
                                item.style.cursor = '';
                                item.style.outline = '';
                            }
                        });
                    });
                });
            });
            observer.observe(area, { childList: true, subtree: true });
        } catch (err) {}
    }
    function showMessage(message, duration = 3000, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(52, 152, 219, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            word-wrap: break-word;
        `;

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, duration);
    }

    async function batchSell() {
        await executeBatchOperation({
            emptyMsg: '请先进入批量选择模式选择物品',
            needGameCore: true,
            startMsg: '开始批量出售',
            action: performSellAction,
            delay: 2000,
            stopMsg: '批量出售已停止',
            doneMsg: '批量出售完成，成功出售',
            failDoneMsg: '批量出售完成，成功:'
        });
    }

    async function batchRightOneSell() {
        await executeBatchOperation({
            emptyMsg: '请先进入批量选择模式选择物品',
            needGameCore: true,
            startMsg: '开始批量挂单',
            action: performRightOneSellAction,
            delay: 2000,
            stopMsg: '批量挂单已停止',
            doneMsg: '批量挂单完成，成功挂单',
            failDoneMsg: '批量挂单完成，成功:'
        });
    }

    async function performSellAction(itemElement, retryCount = 0) {
        try {
            const itemInfo = extractItemInfoFromElement(itemElement);
            if (!itemInfo || !itemInfo.itemHrid) {
                showMessage('无法获取物品信息', 2000, 'error');
                return false;
            }

            const marketData = await getMarketData(itemInfo.itemHrid);
            if (!marketData) {
                showMessage(`无法获取市场数据: ${itemInfo.name}`, 2000, 'error');
                return false;
            }

            const price = getBidPrice(marketData, itemInfo.enhancementLevel, itemInfo.quantity);
            if (!price || price <= 0) {
                showMessage(`无法获取买单价格: ${itemInfo.name}`, 2000, 'error');
                return false;
            }

            await executeMarketSell(itemInfo.itemHrid, itemInfo.enhancementLevel, itemInfo.quantity, price, true);
            const totalPrice = price * itemInfo.quantity;
            showMessage(`出售${itemInfo.name}成功，价格${formatPrice(totalPrice)}`, 2000, 'success');
            return true;
        } catch (error) {
            if (retryCount < 1) {
                await sleep(1500);
                return performSellAction(itemElement, retryCount + 1);
            }
            showMessage(`出售失败: ${error.message}`, 2000, 'error');
            return false;
        }
    }

    async function performRightOneSellAction(itemElement, retryCount = 0) {
        try {
            const itemInfo = extractItemInfoFromElement(itemElement);
            if (!itemInfo || !itemInfo.itemHrid) {
                showMessage('无法获取物品信息', 2000, 'error');
                return false;
            }

            const marketData = await getMarketData(itemInfo.itemHrid);
            if (!marketData) {
                showMessage(`无法获取市场数据: ${itemInfo.name}`, 2000, 'error');
                return false;
            }

            const price = getAskPrice(marketData, itemInfo.enhancementLevel);
            if (!price || price <= 0) {
                showMessage(`无法获取卖单价格: ${itemInfo.name}`, 2000, 'error');
                return false;
            }

            await executeMarketSell(itemInfo.itemHrid, itemInfo.enhancementLevel, itemInfo.quantity, price, false);
            const totalPrice = price * itemInfo.quantity;
            showMessage(`挂单${itemInfo.name}成功，价格${formatPrice(totalPrice)}`, 2000, 'success');
            return true;
        } catch (error) {
            if (retryCount < 1) {
                await sleep(1500);
                return performRightOneSellAction(itemElement, retryCount + 1);
            }
            showMessage(`挂单失败: ${error.message}`, 2000, 'error');
            return false;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function formatPrice(price) {
        if (price >= 1000000000) return (price / 1000000000).toFixed(2) + 'B';
        if (price >= 1000000) return (price / 1000000).toFixed(2) + 'M';
        if (price >= 10000) return (price / 1000).toFixed(2) + 'K';
        return price.toLocaleString();
    }

    async function executeBatchOperation(config) {
        if (selectedSpriteKeys.size === 0) {
            showMessage(config.emptyMsg, 3000, 'warning');
            return;
        }
        if (isOperating) return;
        if (config.needGameCore && !ensureGameCore()) {
            showMessage('游戏核心未就绪，请稍后重试', 3000, 'error');
            return;
        }
        
        const keysToProcess = Array.from(selectedSpriteKeys);
        if (isSelectionMode) exitSelectionModeKeepSelection();
        
        isOperating = true;
        operationStopped = false;
        
        let successCount = 0, failCount = 0;
        showMessage(`${config.startMsg} ${keysToProcess.length} 个物品`, 3000, 'info');
        
        for (let i = 0; i < keysToProcess.length && !operationStopped; i++) {
            const spriteKey = keysToProcess[i];
            const item = findItemBySpriteKey(spriteKey);
            if (!item) {
                failCount++;
                continue;
            }
            const result = await config.action(item);
            if (result) successCount++; else failCount++;
            selectedSpriteKeys.delete(spriteKey);
            item.style.outline = '';
            await sleep(config.delay);
        }
        
        isOperating = false;
        if (operationStopped) {
            showMessage(config.stopMsg, 2000, 'warning');
        } else {
            if (failCount > 0) {
                showMessage(`${config.failDoneMsg || config.doneMsg} ${successCount}, 失败: ${failCount}`, 4000, 'warning');
            } else {
                showMessage(`${config.doneMsg} ${successCount} 个物品`, 3000, 'success');
            }
        }
    }
    
    function findItemBySpriteKey(spriteKey) {
        const inv = findInventoryArea();
        if (!inv) return null;
        const items = inv.querySelectorAll('[class^="Item_item__"]');
        for (const item of items) {
            if (getItemSpriteKey(item) === spriteKey) return item;
        }
        return null;
    }

    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(waitForInventoryArea, 1000);
                setTimeout(installMutationCleanup, 1100);
            });
        } else {
            setTimeout(waitForInventoryArea, 1000);
            setTimeout(installMutationCleanup, 1100);
        }
    }

    initialize();

})()
