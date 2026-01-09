// ==UserScript==
// @name         收藏插件
// @namespace    https://www.milkywayidle.com/
// @version      1.42
// @description  商品收藏功能，Alt+点击收藏，按角色ID区分收藏内容，仅市场列表收藏强化装备时联动+0，修复模糊匹配bug,合并强化的懒鬼按钮，加宽界面，添加+号检测提醒
// @author       baozhi
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://www.milkywayidle.com/favicon.svg
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/555068/%E6%94%B6%E8%97%8F%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555068/%E6%94%B6%E8%97%8F%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isUpdating = false;
    let updateQueue = [];
    let currentCharacterId = null;
    let pluginInitialized = false;

    // 使用Ranged Way Idle的方法：通过WebSocket监听获取角色ID
    function hookWebSocketForCharacterId() {
        // Hook WebSocket的message事件
        const originalGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get;

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket) || !socket.url) {
                return originalGet.call(this);
            }
            const message = originalGet.call(this);
            try {
                const obj = JSON.parse(message);
                if (obj && obj.type === "init_character_data") {
                    updateCharacterFromWebSocket(obj);
                }
            } catch (err) {
                // 忽略非JSON消息
            }
            return message;
        }

        Object.defineProperty(MessageEvent.prototype, "data", {
            get: hookedGet,
            configurable: true,
            enumerable: true
        });

        // 也Hook send方法以防万一
        const originalSend = WebSocket.prototype.send;
        WebSocket.prototype.send = function(message) {
            try {
                const obj = JSON.parse(message);
                if (obj && obj.type === "init_character_data") {
                    // 这里通常不会通过send发送角色数据，但为了完整性保留
                }
            } catch (err) {
                // 忽略非JSON消息
            }
            return originalSend.call(this, message);
        };
    }

    // 从WebSocket消息更新角色信息
    function updateCharacterFromWebSocket(obj) {
        if (obj && obj.character && obj.character.id) {
            const newCharacterId = obj.character.id.toString();

            if (newCharacterId !== currentCharacterId) {
                currentCharacterId = newCharacterId;

                if (pluginInitialized) {
                    throttledMarkFavorites();
                }
            }
        }
    }

    // 获取角色ID
    function getCharacterId() {
        // 优先使用WebSocket获取的ID
        if (currentCharacterId) {
            return currentCharacterId;
        }

        // 备用方法：尝试从mwi对象获取
        if (window.mwi?.character?.id) {
            return window.mwi.character.id.toString();
        }

        return 'default_character';
    }

    // 更新当前角色ID
    function updateCharacterId() {
        const newCharacterId = getCharacterId();
        if (newCharacterId !== currentCharacterId) {
            currentCharacterId = newCharacterId;
            if (pluginInitialized) {
                throttledMarkFavorites();
            }
        }
        return currentCharacterId;
    }

    // 获取角色特定的存储键
    function getCharacterKey(baseKey) {
        updateCharacterId();
        return `${baseKey}_${currentCharacterId}`;
    }

    // 获取收藏列表
    function getFavorites() {
        const characterKey = getCharacterKey('mwc_favorites');
        return GM_getValue(characterKey, []);
    }

    // 保存收藏列表
    function saveFavorites(favorites) {
        const characterKey = getCharacterKey('mwc_favorites');
        GM_setValue(characterKey, favorites);
    }

    // 获取市场强化装备高亮开关状态
    function getMarketFavoriteEnhanceHighlight() {
        const characterKey = getCharacterKey('mwc_market_fav_enhance_highlight');
        return GM_getValue(characterKey, true);
    }

    // 保存开关状态
    function saveMarketFavoriteEnhanceHighlight(enabled) {
        const characterKey = getCharacterKey('mwc_market_fav_enhance_highlight');
        GM_setValue(characterKey, enabled);
    }

    // 获取所有角色的收藏统计
    function getAllCharactersFavorites() {
        const allValues = GM_getValue(null) || {};
        const favoritesByCharacter = {};

        for (const [key, value] of Object.entries(allValues)) {
            if (key.startsWith('mwc_favorites_')) {
                const characterId = key.replace('mwc_favorites_', '');
                favoritesByCharacter[characterId] = {
                    favorites: value,
                    count: value.length
                };
            }
        }

        return favoritesByCharacter;
    }

    // 获取头部信息监控开关状态
    function getHeaderMonitorEnabled() {
        const characterKey = getCharacterKey('mwc_header_monitor_enabled');
        return GM_getValue(characterKey, true); // 默认开启
    }

    // 保存头部信息监控开关状态
    function saveHeaderMonitorEnabled(enabled) {
        const characterKey = getCharacterKey('mwc_header_monitor_enabled');
        GM_setValue(characterKey, enabled);
    }

    // 严格检查是否为市场列表容器（仅市场列表触发模糊匹配）
    function isMarketListContainer(container) {
        return container.closest('.MarketplacePanel_marketItems__D4k7e') !== null;
    }

    // 获取强化等级
    function getEnhancementLevel(container) {
        const enhancementEl = container.querySelector('.Item_enhancementLevel__19g-e');
        if (!enhancementEl) return null;

        const levelText = enhancementEl.textContent.trim();
        if (levelText === '' || levelText === '0') return null;

        const match = levelText.match(/\+?(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    // 生成收藏键名
    function getItemKey(container) {
        const itemName = getItemName(container);
        if (!itemName) return null;

        const enhancementLevel = getEnhancementLevel(container);
        return enhancementLevel !== null ? `${itemName}+${enhancementLevel}` : itemName;
    }

    // 获取物品基础名称
    function getItemName(container) {
        const svg = container.querySelector('svg[aria-label]');
        return svg ? svg.getAttribute('aria-label') : null;
    }

    // 从收藏键获取基础物品名
    function getBaseItemName(itemKey) {
        return itemKey.includes('+') ? itemKey.split('+')[0] : itemKey;
    }

    // 检查是否为强化装备收藏（+1及以上）
    function isEnhancedFavorite(favKey) {
        const parts = favKey.split('+');
        return parts.length === 2 && !isNaN(parseInt(parts[1])) && parseInt(parts[1]) > 0;
    }

    // 添加/移除收藏
    function toggleFavorite(itemKey, clickedContainer) {
        let favorites = getFavorites();
        const index = favorites.indexOf(itemKey);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(itemKey);
        }

        saveFavorites(favorites);
        return favorites.includes(itemKey);
    }

    // 防抖函数
    function debounce(func, delay, immediate = false) {
        let timeoutId;
        let lastExecTime = 0;

        return function(...args) {
            const now = Date.now();
            clearTimeout(timeoutId);

            if (immediate && lastExecTime === 0) {
                lastExecTime = now;
                return func.apply(this, args);
            }

            timeoutId = setTimeout(() => {
                if (!immediate || now - lastExecTime >= delay) {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }
            }, delay);
        };
    }

    // 标记收藏函数
    function markFavorites() {
        if (isUpdating) {
            updateQueue.push(true);
            return;
        }

        isUpdating = true;
        updateQueue = [];

        requestAnimationFrame(() => {
            const favorites = getFavorites();
            const marketEnhanceEnabled = getMarketFavoriteEnhanceHighlight();
            const ITEM_CONTAINER = [
                '.MarketplacePanel_marketItems__D4k7e .Item_itemContainer__x7kH1',
                '.Inventory_itemGrid__20YAH .Item_itemContainer__x7kH1',
                '.MarketplacePanel_itemSummaryTable__2g3gr .Item_itemContainer__x7kH1',
                '.MarketplacePanel_currentItem__3ercC .Item_itemContainer__x7kH1'
            ].join(', ');

            // 移除所有收藏样式
            document.querySelectorAll(`${ITEM_CONTAINER}.favorited`).forEach(container => {
                container.classList.remove('favorited');
            });

            // 应用收藏样式
            document.querySelectorAll(ITEM_CONTAINER).forEach(container => {
                const svg = container.querySelector('svg[aria-label]');
                if (!svg) return;

                const itemKey = getItemKey(container);
                if (!itemKey) return;

                let shouldHighlight = false;

                // 1. 精确匹配收藏（所有界面通用，优先级最高）
                if (favorites.includes(itemKey)) {
                    shouldHighlight = true;
                }
                // 2. 模糊匹配：严格限制仅市场列表容器
                else if (marketEnhanceEnabled) {
                    // 必须是市场列表容器
                    if (isMarketListContainer(container)) {
                        // 当前物品必须是+0
                        if (getEnhancementLevel(container) === null) {
                            const baseItemName = getItemName(container);
                            // 检查收藏列表中是否有该基础物品的强化版本
                            const hasEnhancedFavorite = favorites.some(favKey => {
                                return getBaseItemName(favKey) === baseItemName && isEnhancedFavorite(favKey);
                            });

                            if (hasEnhancedFavorite) {
                                shouldHighlight = true;
                            }
                        }
                    }
                }

                if (shouldHighlight) {
                    container.classList.add('favorited');
                }
            });

            isUpdating = false;
            if (updateQueue.length > 0) {
                updateQueue = [];
                markFavorites();
            }
        });
    }

    const throttledMarkFavorites = debounce(markFavorites, 200);

    GM_addStyle(`
        .Item_itemContainer__x7kH1.favorited {
            box-shadow: 0 0 0 3px var(--color-orange-300) !important;
            border-radius: 4px !important;
            transition: box-shadow 0.2s ease, background-color 0.2s ease;
        }
        .Item_itemContainer__x7kH1.favorited:hover {
            animation: favoritePulse 0.6s ease-in-out;
            box-shadow: 0 0 0 6px rgba(255, 165, 0, 0.3) !important;
        }
        @keyframes favoritePulse {
            0% { box-shadow: 0 0 0 3px var(--color-orange-300); }
            50% { box-shadow: 0 0 0 6px rgba(255, 165, 0, 0.3); }
            100% { box-shadow: 0 0 0 3px var(--color-orange-300); }
        }
        .Item_itemContainer__x7kH1.favorited .Item_item__2De2O {
            background: var(--color-orange-800) !important;
            border-radius: 4px;
        }
        .MarketplacePanel_itemSummaryTable__2g3gr .Item_itemContainer__x7kH1.favorited {
            box-shadow: 0 0 0 2px var(--color-orange-300) !important;
        }
        .MarketplacePanel_itemSummaryTable__2g3gr .Item_itemContainer__x7kH1.favorited .Item_item__2De2O {
            background: rgba(255, 165, 0, 0.1) !important;
            border: 1px solid var(--color-orange-300) !important;
        }

        /* 设置面板样式 */
        .mwc-settings {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
        }
        .mwc-settings-content {
            background: var(--color-midnight-900); border: 2px solid var(--color-space-300);
            border-radius: 8px; padding: 20px; max-width: 600px; width: 90%;
            max-height: 80%; overflow-y: auto; color: var(--color-text-dark-mode);
            position: relative;
        }
        .mwc-settings h3 { margin-top: 0; color: var(--color-ocean-300); }
        .mwc-toggle {
            display: flex; align-items: center; gap: 10px; margin: 15px 0;
            padding: 12px; background: var(--color-midnight-600); border-radius: 6px;
            border-left: 3px solid var(--color-orange-400);
        }
        .mwc-toggle input[type="checkbox"] {
            width: 20px; height: 20px; accent-color: var(--color-orange-400);
        }
        .mwc-toggle label { color: var(--color-text-dark-mode); font-size: 14px; flex: 1; cursor: pointer; }
        .mwc-toggle-status { font-size: 12px; color: var(--color-orange-300); font-weight: bold; }
        .mwc-favorites-list {
            max-height: 300px; overflow-y: auto; margin: 10px 0;
            padding: 10px; background: var(--color-midnight-700); border-radius: 4px;
        }
        .mwc-favorite-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px; margin: 4px 0; background: var(--color-midnight-600);
            border-radius: 4px; border-left: 3px solid var(--color-orange-400);
        }
        .mwc-btn, .mwc-remove-fav, .mwc-close {
            border: none; color: white; border-radius: 4px; cursor: pointer;
            transition: background-color 0.2s ease;
        }
        .mwc-btn { background: var(--color-orange-500); padding: 8px 16px; margin: 5px; }
        .mwc-btn:hover { background: var(--color-orange-400); }
        .mwc-remove-fav {
            background: var(--color-warning); padding: 4px 8px; font-size: 12px;
        }
        .mwc-remove-fav:hover { background: var(--color-scarlet-500); }
        .mwc-close {
            position: absolute; top: 10px; right: 10px;
            background: var(--color-scarlet-500); width: 30px; height: 30px; border-radius: 50%;
        }
        .level-tag { color: var(--color-orange-300) !important; font-weight: bold; margin-left: 8px; }
        .character-info {
            background: var(--color-midnight-700); padding: 10px; border-radius: 6px;
            margin: 10px 0; border-left: 3px solid var(--color-ocean-400);
        }
        .character-list {
            max-height: 200px; overflow-y: auto; margin: 10px 0;
            padding: 10px; background: var(--color-midnight-800); border-radius: 4px;
        }
        .character-item {
            padding: 8px; margin: 4px 0; background: var(--color-midnight-700);
            border-radius: 4px; display: flex; justify-content: space-between;
        }
        .character-item.current {
            border-left: 3px solid var(--color-orange-400);
            background: var(--color-midnight-600);
        }

        /* 修改：简化的高亮提醒样式 - 应用到操作容器 */
        .Header_myActions__3rlBU.highlight-alert {
            border: 3px solid #ff0000 !important;
            border-radius: 8px !important;
            animation: alertPulse 1.5s infinite alternate !important;
            background: rgba(255, 0, 0, 0.08) !important;
            margin: 5px 0 !important;
            position: relative !important;
            z-index: 1000 !important;
            overflow: visible !important;
        }

        /* 简化提示文字样式 */
        .Header_myActions__3rlBU.highlight-alert::before {
            content: "⚠️ 无强化等级！" !important;
            color: #ff0000 !important;
            font-size: 16px !important;
            font-weight: bold !important;
            text-align: center !important;
            margin: 0 !important;
            white-space: nowrap !important;
            width: 100% !important;
            display: block !important;
            padding: 4px 0 !important;
            background: rgba(255, 0, 0, 0.1) !important;
            border-radius: 4px 4px 0 0 !important;
        }

        /* 高亮时放大停止按钮 */
        .Header_myActions__3rlBU.highlight-alert .Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_small__3fqC7 {
            padding: 15px 30px !important;
            font-size: 18px !important;
            height: 50px !important;
            min-width: 120px !important;
            border-radius: 8px !important;
            background: linear-gradient(135deg, #ff0000, #ff4500) !important;
            border: 2px solid #ff0000 !important;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5) !important;
            font-weight: bold !important;
            transition: all 0.3s ease !important;
            margin-top: 5px !important;
            transform: scale(1.1) !important;
        }

        /* 停止按钮悬停效果 */
        .Header_myActions__3rlBU.highlight-alert .Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_small__3fqC7:hover {
            transform: scale(1.15) !important;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.7) !important;
            background: linear-gradient(135deg, #ff4500, #ff0000) !important;
        }

        @keyframes alertPulse {
            0% {
                border-color: #ff0000;
                background: rgba(255, 0, 0, 0.08);
            }
            50% {
                border-color: #ff4500;
                background: rgba(255, 0, 0, 0.15);
            }
            100% {
                border-color: #ff0000;
                background: rgba(255, 0, 0, 0.08);
            }
        }

        /* 正常的停止按钮样式 */
        .Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_small__3fqC7 {
            transition: all 0.3s ease !important;
        }
    `);

    // 设置面板
    function showSettings() {
        document.querySelectorAll('.mwc-settings').forEach(el => el.remove());

        const favorites = getFavorites();
        const marketEnhanceEnabled = getMarketFavoriteEnhanceHighlight();
        const headerMonitorEnabled = getHeaderMonitorEnabled();
        const allCharactersFavorites = getAllCharactersFavorites();
        const settings = document.createElement('div');
        settings.className = 'mwc-settings';

        const formattedFavorites = favorites.map(key => {
            if (key.includes('+')) {
                const [name, level] = key.split('+');
                return {
                    name, level: parseInt(level),
                    display: `${name} <span class="level-tag">[+${level}]</span>`,
                    key
                };
            }
            return { name: key, level: null, display: key, key };
        });

        settings.innerHTML = `
            <div class="mwc-settings-content">
                <button class="mwc-close" title="关闭">×</button>
                <h3>⭐ 商品收藏设置</h3>

                <div class="character-info">
                    <strong>角色ID:</strong> ${currentCharacterId}<br>
                    <strong>收藏数量:</strong> ${favorites.length} 个物品
                </div>

                <div class="mwc-toggle">
                    <input type="checkbox" id="market-enhance-toggle" ${marketEnhanceEnabled ? 'checked' : ''}>
                    <label for="market-enhance-toggle">
                        🛒 收藏强化装备时联动收藏市场
                    </label>
                    <span class="mwc-toggle-status" id="market-enhance-status">
                        ${marketEnhanceEnabled ? '已开启' : '已关闭'}
                    </span>
                </div>

                <div class="mwc-toggle">
                    <input type="checkbox" id="header-monitor-toggle" ${headerMonitorEnabled ? 'checked' : ''}>
                    <label for="header-monitor-toggle">
                        🔔 无强化等级提醒与停止按钮放大
                    </label>
                    <span class="mwc-toggle-status" id="header-monitor-status">
                        ${headerMonitorEnabled ? '已开启' : '已关闭'}
                    </span>
                </div>

                <p style="color: var(--color-neutral-400); font-size: 12px; margin-bottom: 15px; line-height: 1.6;">
                    <strong>🎯 操作：</strong><kbd>Alt + 点击</kbd> 快速收藏/取消<br>
                    <strong>💡 特性：</strong>每个角色有独立的收藏列表
                </p>

                <h4>我的收藏 (${favorites.length})</h4>
                <div class="mwc-favorites-list">
                    ${formattedFavorites.map(item => `
                        <div class="mwc-favorite-item">
                            <span style="word-break: break-word;">${item.display}</span>
                            <button class="mwc-remove-fav" data-item="${item.key}">移除</button>
                        </div>
                    `).join('') || '<p style="color: var(--color-neutral-400); text-align: center; padding: 20px;">暂无收藏物品</p>'}
                </div>

                ${Object.keys(allCharactersFavorites).length > 1 ? `
                <h4>所有角色收藏统计</h4>
                <div class="character-list">
                    ${Object.entries(allCharactersFavorites).map(([charId, data]) => `
                        <div class="character-item ${charId === currentCharacterId ? 'current' : ''}">
                            <span>${charId}</span>
                            <span>${data.count} 个收藏</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <div style="text-align: center; margin-top: 20px;">
                    <button class="mwc-btn" id="close-settings">关闭</button>
                    ${favorites.length ? '<button class="mwc-btn" id="clear-favorites">清空当前角色收藏</button>' : ''}
                </div>
            </div>
        `;

        document.body.appendChild(settings);

        // 市场联动开关事件
        const marketToggle = settings.querySelector('#market-enhance-toggle');
        const marketStatus = settings.querySelector('#market-enhance-status');
        marketToggle.addEventListener('change', () => {
            const enabled = marketToggle.checked;
            saveMarketFavoriteEnhanceHighlight(enabled);
            marketStatus.textContent = enabled ? '已开启' : '已关闭';
            throttledMarkFavorites();
        });

        // 头部监控开关事件
        const headerToggle = settings.querySelector('#header-monitor-toggle');
        const headerStatus = settings.querySelector('#header-monitor-status');
        headerToggle.addEventListener('change', () => {
            const enabled = headerToggle.checked;
            saveHeaderMonitorEnabled(enabled);
            headerStatus.textContent = enabled ? '已开启' : '已关闭';

            // 如果关闭监控，立即移除所有高亮样式
            if (!enabled) {
                const actionContainers = document.querySelectorAll('.Header_myActions__3rlBU.highlight-alert');
                actionContainers.forEach(container => {
                    container.classList.remove('highlight-alert');
                });
            }
        });

        // 关闭事件
        const closeSettings = () => {
            settings.remove();
            document.removeEventListener('keydown', escHandler);
        };

        settings.querySelector('.mwc-close').addEventListener('click', closeSettings);
        settings.querySelector('#close-settings')?.addEventListener('click', closeSettings);

        function escHandler(e) {
            if (e.key === 'Escape') closeSettings();
        }
        document.addEventListener('keydown', escHandler);

        // 移除收藏事件
        settings.querySelectorAll('.mwc-remove-fav').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemKey = btn.dataset.item;
                let favorites = getFavorites().filter(fav => fav !== itemKey);
                saveFavorites(favorites);
                btn.closest('.mwc-favorite-item').remove();
                throttledMarkFavorites();
                settings.querySelector('h4').textContent = `我的收藏 (${favorites.length})`;
            });
        });

        settings.querySelector('#clear-favorites')?.addEventListener('click', () => {
            if (confirm('确定清空当前角色的所有收藏吗？')) {
                saveFavorites([]);
                throttledMarkFavorites();
                closeSettings();
                setTimeout(showSettings, 100);
            }
        });
    }

    // 初始化插件
    function initPlugin() {
        // 设置事件监听器
        document.addEventListener('click', (event) => {
            if ((event.altKey || event.metaKey) && event.button === 0) {
                const ITEM_CONTAINER = [
                    '.MarketplacePanel_marketItems__D4k7e .Item_itemContainer__x7kH1',
                    '.Inventory_itemGrid__20YAH .Item_itemContainer__x7kH1',
                    '.MarketplacePanel_itemSummaryTable__2g3gr .Item_itemContainer__x7kH1',
                    '.MarketplacePanel_currentItem__3ercC .Item_itemContainer__x7kH1'
                ].join(', ');

                const itemContainer = event.target.closest(ITEM_CONTAINER);
                if (itemContainer?.querySelector('svg[aria-label]')) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    const itemKey = getItemKey(itemContainer);
                    if (itemKey) {
                        const wasFavorited = toggleFavorite(itemKey, itemContainer);
                        markFavorites();
                        itemContainer.classList.toggle('favorited', !wasFavorited);
                    }
                }
            }
        }, true);

        // 初始标记收藏
        throttledMarkFavorites();
        pluginInitialized = true;
    }

    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    const hasItemContainer = Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === 1 && (
                            node.matches?.('.Item_itemContainer__x7kH1') ||
                            node.querySelector?.('.Item_itemContainer__x7kH1')
                        )
                    );
                    if (hasItemContainer) shouldUpdate = true;
                }
            });
            if (shouldUpdate && pluginInitialized) {
                throttledMarkFavorites();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 注册菜单命令
    GM_registerMenuCommand('⭐ 收藏设置', showSettings);

    // 主初始化函数
    function main() {
        // 首先Hook WebSocket来获取角色ID
        hookWebSocketForCharacterId();

        // 设置观察者
        setupObserver();

        // 初始化插件
        initPlugin();

        // 添加其他事件监听器
        window.addEventListener('popstate', () => {
            if (pluginInitialized) throttledMarkFavorites();
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && pluginInitialized) {
                updateCharacterId();
                throttledMarkFavorites();
            }
        });

        // 设置一个超时，如果WebSocket没有及时返回数据，使用备用方法
        setTimeout(() => {
            if (!currentCharacterId) {
                updateCharacterId();
                if (pluginInitialized) {
                    throttledMarkFavorites();
                }
            }
        }, 3000);
    }

    // 启动插件
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }

    // 初始化相关localStorage替换
    (async function initMWISettings() {
        // =================== 通用工具函数 ===================
        // 统一的React输入触发函数
        function reactInputTrigger(inputElem, value) {
            if (!inputElem) return;

            const lastValue = inputElem.value;
            inputElem.value = value;

            // 触发标准输入事件
            const event = new Event("input", { bubbles: true });
            event.simulated = true;

            // 更新React内部值跟踪器
            if (inputElem._valueTracker) {
                inputElem._valueTracker.setValue(lastValue);
            }

            // 使用原生属性设置器确保DOM更新
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, "value"
            ).set;
            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(inputElem, value);
            }

            inputElem.dispatchEvent(event);
        }

        // 统一的输入模拟函数
        function simulateInput(inputSelector, value) {
            let inputElement = document.querySelector(inputSelector);
            if (!inputElement) return;

            // 激活输入框
            inputElement.focus();

            // 清空输入框
            setTimeout(() => {
                inputElement.value = '';
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new Event('change', { bubbles: true }));

                // 设置新值
                setTimeout(() => {
                    const valueStr = String(value);
                    reactInputTrigger(inputElement, valueStr);
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));

                    // 模拟失去焦点
                    setTimeout(() => {
                        inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
                    }, 50);
                }, 30);
            }, 30);
        }

        // 统一的按钮创建函数
        function createButton(id, text, value, onClick) {
            const btn = document.createElement('button');
            btn.id = id;
            btn.textContent = text;
            btn.style.background = 'rgb(69,71,113)';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.padding = '4px 10px';
            btn.style.fontSize = '14px';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'background-color 0.2s';

            btn.onmouseenter = () => btn.style.backgroundColor = 'rgb(89,91,133)';
            btn.onmouseleave = () => btn.style.backgroundColor = 'rgb(69,71,113)';
            btn.onclick = onClick;

            return btn;
        }

        // =================== 功能函数 ===================
        // 在技能详情面板添加按钮
        function addButtonsToSkillActionDetail() {
            const target = document.querySelector('div.SkillActionDetail_notes__2je2F > div');
            if (!target || document.getElementById('mwiSkillButton1')) return;

            // 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.style.marginTop = '12px';
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '8px';

            // 创建按钮的函数，使用统一的模拟输入
            const createSkillButton = (id, text, value) => {
                return createButton(id, text, value, () => {
                    simulateInput('div.EnhancingPanel_skillActionDetailContainer__1pV1w > div > div > div.SkillActionDetail_inputs__2tnEq > div.SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl > div.SkillActionDetail_input__1G-kE > div > input', value);
                });
            };

            // 创建按钮
            const btn1 = createSkillButton('mwiSkillButton1', '+5', 5);
            const btn2 = createSkillButton('mwiSkillButton2', '+7', 7);
            const btn3 = createSkillButton('mwiSkillButton4', '+10', 10);
            const btn4 = createSkillButton('mwiSkillButton3', '+8', 8);

            // 添加按钮到容器
            btnContainer.appendChild(btn1);
            btnContainer.appendChild(btn2);
            btnContainer.appendChild(btn4);
            btnContainer.appendChild(btn3);

            // 添加容器到目标元素后
            target.parentNode.insertBefore(btnContainer, target.nextSibling);
        }

        // 在技能详情面板添加第二个输入框（保护最小等级）的快速按钮
        function addButtonsToSkillProtectionLevel() {
            // 找到保护最小等级输入框容器
            const targetContainer = document.querySelector('.SkillActionDetail_protectionMinLevelInputContainer__1HSzb');
            if (!targetContainer || document.getElementById('mwiProtectionButtonContainer')) return;

            // 定位保护最小等级输入框
            const protectionInputElement = targetContainer.querySelector('input.Input_input__2-t98');
            if (!protectionInputElement) return;

            // 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.id = 'mwiProtectionButtonContainer';
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '8px';
            btnContainer.style.marginTop = '8px';
            btnContainer.style.alignItems = 'center';

            // 添加说明标签
            const label = document.createElement('span');
            label.textContent = '保护等级:';
            label.style.fontSize = '12px';
            label.style.color = '#aaa';
            label.style.marginRight = '8px';
            btnContainer.appendChild(label);

            // 创建保护等级按钮的函数，使用统一的模拟输入
            const createProtectionButton = (id, text, value, title) => {
                return createButton(id, text, value, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    simulateInput('.SkillActionDetail_protectionMinLevelInputContainer__1HSzb input.Input_input__2-t98', value);
                });
            };

            // 创建按钮：+2、+5、+6、+7、+8
            const btn2 = createProtectionButton('mwiProtectionButton2', '+2', 2, '设置保护起始等级为2');
            const btn5 = createProtectionButton('mwiProtectionButton5', '+5', 5, '设置保护起始等级为5');
            const btn6 = createProtectionButton('mwiProtectionButton6', '+6', 6, '设置保护起始等级为6');
            const btn7 = createProtectionButton('mwiProtectionButton7', '+7', 7, '设置保护起始等级为7');
            const btn8 = createProtectionButton('mwiProtectionButton8', '+8', 8, '设置保护起始等级为8');

            // 添加按钮到容器
            btnContainer.appendChild(btn2);
            btnContainer.appendChild(btn5);
            btnContainer.appendChild(btn6);
            btnContainer.appendChild(btn7);
            btnContainer.appendChild(btn8);

            // 在目标容器后面添加按钮容器
            if (targetContainer.nextSibling) {
                targetContainer.parentNode.insertBefore(btnContainer, targetContainer.nextSibling);
            } else {
                targetContainer.parentNode.appendChild(btnContainer);
            }
        }

        // 用于调整强化界面整体宽度的函数
        function widenEnhancementContainer() {
            // 创建或更新样式
            let styleEl = document.getElementById('mwi-wide-enhancement-styles');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'mwi-wide-enhancement-styles';
                document.head.appendChild(styleEl);
            }

            // 核心CSS：放宽外层容器及内部布局
            styleEl.textContent = `
                /* 【重点】放宽最外层容器 */
                .EnhancingPanel_enhancingAction__2GJtD {
                    min-width: 750px !important;   /* 默认宽度，可根据需要增加 */
                    max-width: 1200px !important;  /* 最大宽度限制 */
                    width: auto !important;
                }
                .AlchemyPanel_alchemyAction__THez7 {
                    min-width: 750px !important;   /* 默认宽度，可根据需要增加 */
                    max-width: 1200px !important;  /* 最大宽度限制 */
                    width: auto !important;
                }

                /* 可选：如果游戏有最大宽度限制，可能需要一并放宽 */
                .GamePage_middlePanel__uDts7,
                .GamePage_mainPanel__2njyb > div {
                    max-width: none !important;
                }

                /* 确保内部技能详情容器能利用新增的空间 */
                .EnhancingPanel_skillActionDetailContainer__1pV1w {
                    width: 100% !important;
                    max-width: none !important;
                    display: flex !important;
                    flex-direction: column !important;
                }

                /* 调整内部的主内容区域，使其并排显示 */
                .SkillActionDetail_skillActionDetail__1jHU4 {
                    display: flex !important;
                    flex-wrap: nowrap !important;
                    gap: 20px !important;
                    justify-content: space-between !important;
                    width: 100% !important;
                }

                /* 加宽强化选择面板 */
                .SkillActionDetail_inputs__2tnEq {
                    flex: 1 1 auto !important;
                    min-width: 290px !important; /* 可根据喜好调整 */
                    overflow: visible !important;
                }

                /* 放大停止按钮 */
                .SkillActionDetail_actionContainer__22yYX button.Button_button__1Fe9z.Button_warning__1-AMI {
                    padding: 20px 40px !important;
                    font-size: 20px !important;
                    height: 60px !important;
                    border-radius: 10px !important;
                }

                /* 加宽信息面板 */
                .SkillActionDetail_info__3umoI {
                    flex: 1 1 auto !important;
                    min-width: 280px !important; /* 可根据喜好调整 */
                    overflow: visible !important;
                }

                /* 加宽并美化你的自定义强化数据面板 */
                #enhancementParentContainer {
                    flex: 0 0 auto !important;
                    min-width: 280px !important; /* 可根据喜好调整 */
                    padding: 12px 16px !important;
                    border-left: 3px solid #444 !important;
                    background-color: rgba(40, 40, 60, 0.7) !important;
                    border-radius: 8px !important;
                }
            `;
        }

        // 为两个输入框添加+/-按钮的完整方案
        function addLevelButtonsForBothInputs() {
            // === 1. 添加控制两个容器布局的CSS样式 ===
            const styleId = 'mwi-dual-level-buttons-style';
            if (!document.getElementById(styleId)) {
                const styleEl = document.createElement('style');
                styleEl.id = styleId;
                styleEl.textContent = `
                    /* 通用：两个输入框容器都使用flex布局 */
                    .SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl,
                    .SkillActionDetail_protectionMinLevelInputContainer__1HSzb {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: space-between !important;
                        gap: 8px !important;
                        min-height: 40px !important;
                        width: 100% !important;
                        margin-bottom: 8px !important; /* 增加间距避免拥挤 */
                    }

                    /* 标签区域 - 固定宽度 */
                    .SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl .SkillActionDetail_label__1mGQJ,
                    .SkillActionDetail_protectionMinLevelInputContainer__1HSzb .SkillActionDetail_label__1mGQJ {
                        flex: 0 0 auto !important;
                        min-width: 90px !important; /* "保护起始等级"较长，需要更宽 */
                        text-align: left !important;
                        white-space: nowrap !important;
                        font-size: 13px !important;
                    }

                    /* 针对目标等级标签单独调整 */
                    .SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl .SkillActionDetail_label__1mGQJ {
                        min-width: 90px !important; /* "目标等级"较短 */
                    }

                    /* 输入框区域 - 占据主要空间，不被挤压 */
                    .SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl .SkillActionDetail_input__1G-kE,
                    .SkillActionDetail_protectionMinLevelInputContainer__1HSzb .SkillActionDetail_input__1G-kE {
                        flex: 1 1 auto !important;
                        min-width: 100px !important; /* 比之前稍小，为按钮留空间 */
                        max-width: 140px !important;
                    }

                    /* 确保输入框本身占满容器 */
                    .SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl .Input_inputContainer__22GnD,
                    .SkillActionDetail_protectionMinLevelInputContainer__1HSzb .Input_inputContainer__22GnD {
                        width: 100% !important;
                        max-width: 100% !important;
                    }

                    /* 按钮容器通用样式 */
                    .mwi-level-btn-container {
                        flex: 0 0 auto !important;
                        display: flex !important;
                        gap: 3px !important;
                        margin-left: 6px !important;
                    }

                    /* 按钮基础样式 */
                    .mwi-level-btn {
                        flex: 0 0 auto !important;
                        width: 26px !important;
                        height: 24px !important;
                        background: rgb(69, 71, 113) !important;
                        color: white !important;
                        border: none !important;
                        border-radius: 3px !important;
                        font-size: 15px !important;
                        font-weight: bold !important;
                        cursor: pointer !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        padding: 0 !important;
                        transition: background-color 0.15s !important;
                        user-select: none !important;
                        line-height: 1 !important;
                    }

                    /* 按钮悬停效果 */
                    .mwi-level-btn:hover {
                        background: rgb(89, 91, 143) !important;
                    }

                    .mwi-level-btn:active {
                        background: rgb(59, 61, 103) !important;
                    }

                    /* 减号按钮特殊样式 */
                    .mwi-level-btn.minus {
                        font-size: 17px !important;
                        padding-bottom: 1px !important;
                    }

                    /* 禁用状态（达到边界时） */
                    .mwi-level-btn.disabled {
                        background: rgb(50, 52, 90) !important;
                        color: #888 !important;
                        cursor: not-allowed !important;
                        opacity: 0.7 !important;
                    }
                `;
                document.head.appendChild(styleEl);
            }

            // === 2. 为目标等级输入框添加按钮（如果不存在） ===
            addButtonsToInput({
                containerSelector: '.SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl',
                btnContainerId: 'mwiTargetLevelBtnContainer',
                inputSelector: 'input.Input_input__2-t98[type="number"]',
                label: '目标等级'
            });

            // === 3. 为保护起始等级输入框添加按钮（如果不存在） ===
            addButtonsToInput({
                containerSelector: '.SkillActionDetail_protectionMinLevelInputContainer__1HSzb',
                btnContainerId: 'mwiProtectionLevelBtnContainer',
                inputSelector: 'input.Input_input__2-t98[type="number"]',
                label: '保护起始等级'
            });

        }

        // === 为目标等级输入框添加按钮（如果不存在） ===
        function addButtonsToInput(config) {
            const { containerSelector, btnContainerId, inputSelector, label } = config;

            const container = document.querySelector(containerSelector);
            if (!container || container.querySelector(`#${btnContainerId}`)) return;

            const inputElement = container.querySelector(inputSelector);
            if (!inputElement) {
                return;
            }

            // 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.id = btnContainerId;
            btnContainer.className = 'mwi-level-btn-container';
            btnContainer.title = `快速调整${label}`;

            // 创建 -1 按钮
            const minusBtn = document.createElement('button');
            minusBtn.className = 'mwi-level-btn minus';
            minusBtn.innerHTML = '−';
            minusBtn.setAttribute('data-action', 'decrease');

            // 创建 +1 按钮
            const plusBtn = document.createElement('button');
            plusBtn.className = 'mwi-level-btn';
            plusBtn.innerHTML = '+';
            plusBtn.setAttribute('data-action', 'increase');

            // 按钮点击逻辑 - 修复关键：每次点击时动态查找输入框
            function handleLevelAdjust(amount) {
                // 关键修复：动态查找当前输入框，而不是使用闭包中的旧引用
                const currentContainer = document.querySelector(containerSelector);
                if (!currentContainer) {
                    console.warn(`${label}容器不存在，无法调整`);
                    return;
                }

                const currentInput = currentContainer.querySelector(inputSelector);
                if (!currentInput) {
                    console.warn(`未找到当前${label}输入框`);
                    return;
                }

                let currentValue = parseInt(currentInput.value) || 0;

                // 获取边界限制
                const maxAttr = currentInput.getAttribute('max') || '99';
                const minAttr = currentInput.getAttribute('min') || '0';
                const maxLimit = parseInt(maxAttr);
                const minLimit = parseInt(minAttr);

                // 计算新值
                let newValue = currentValue + amount;
                newValue = Math.max(minLimit, Math.min(maxLimit, newValue));

                if (newValue === currentValue) return;

                // 更新输入框值
                currentInput.value = newValue;

                // 触发React事件（完整的事件序列）
                const inputEvent = new Event('input', { bubbles: true });
                const changeEvent = new Event('change', { bubbles: true });

                // 尝试更新React内部值跟踪器
                if (currentInput._valueTracker) {
                    currentInput._valueTracker.setValue(currentValue.toString());
                }

                // 使用属性设置器确保DOM更新
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, "value"
                )?.set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(currentInput, newValue);
                }

                // 触发事件
                currentInput.dispatchEvent(inputEvent);
                currentInput.dispatchEvent(changeEvent);

                // 稍后触发blur确保更新
                setTimeout(() => {
                    currentInput.dispatchEvent(new Event('blur', { bubbles: true }));
                }, 50);

                // 视觉反馈
                const btn = amount > 0 ? plusBtn : minusBtn;
                const originalBg = btn.style.backgroundColor;
                btn.style.backgroundColor = amount > 0 ? '#2e7d32' : '#c62828';
                setTimeout(() => {
                    btn.style.backgroundColor = originalBg;
                }, 120);

                // 更新按钮状态（延迟以确保值已更新）
                setTimeout(() => {
                    updateButtonStates(currentInput, minusBtn, plusBtn);
                }, 60);

            }

            // 更新按钮状态函数（独立出来）
            function updateButtonStates(inputElement, minusBtn, plusBtn) {
                if (!inputElement) {
                    // 如果输入框不存在，尝试重新查找
                    const currentContainer = document.querySelector(containerSelector);
                    const currentInput = currentContainer ? currentContainer.querySelector(inputSelector) : null;
                    if (!currentInput) return;
                    inputElement = currentInput;
                }

                const currentValue = parseInt(inputElement.value) || 0;
                const maxAttr = inputElement.getAttribute('max') || '99';
                const minAttr = inputElement.getAttribute('min') || '0';
                const maxLimit = parseInt(maxAttr);
                const minLimit = parseInt(minAttr);

                // 达到最小值时禁用减号按钮
                if (currentValue <= minLimit) {
                    minusBtn.classList.add('disabled');
                    minusBtn.disabled = true;
                } else {
                    minusBtn.classList.remove('disabled');
                    minusBtn.disabled = false;
                }

                // 达到最大值时禁用加号按钮
                if (currentValue >= maxLimit) {
                    plusBtn.classList.add('disabled');
                    plusBtn.disabled = true;
                } else {
                    plusBtn.classList.remove('disabled');
                    plusBtn.disabled = false;
                }
            }

            // 绑定事件
            minusBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLevelAdjust(-1);
            };

            plusBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLevelAdjust(1);
            };

            // 初始更新按钮状态
            updateButtonStates(inputElement, minusBtn, plusBtn);

            // 添加到容器
            btnContainer.appendChild(minusBtn);
            btnContainer.appendChild(plusBtn);

            // 添加到DOM
            container.appendChild(btnContainer);

        }

        // 简单的初始化函数，只在需要时添加按钮，不创建额外的观察器
        function initDualLevelButtons() {
            // 立即尝试添加一次
            setTimeout(addLevelButtonsForBothInputs, 1000);
        }

        // 监听技能详情面板的变化，统一处理所有按钮添加逻辑
        function observeSkillPanelChanges() {
            const skillPanelObserver = new MutationObserver((mutations) => {
                // 检查技能详情面板是否显示
                const skillDetailPanel = document.querySelector('.EnhancingPanel_skillActionDetailContainer__1pV1w');

                if (skillDetailPanel && skillDetailPanel.style.display !== 'none') {
                    // 面板显示时，确保所有按钮都存在
                    setTimeout(() => {
                        addButtonsToSkillActionDetail();
                        addButtonsToSkillProtectionLevel();
                        addLevelButtonsForBothInputs();
                    }, 150);
                }
            });

            skillPanelObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                subtree: true
            });
        }

        // =================== 头部信息监听功能 ===================
        function monitorHeaderInfo() {
            // 目标元素选择器
            const targetSelector = 'div.Header_displayName__1hN09';

            // 检查目标元素的内容是否包含+号
            function checkHeaderContent() {
                const headerMonitorEnabled = getHeaderMonitorEnabled();

                // 如果监控功能关闭，移除可能存在的样式并返回
                if (!headerMonitorEnabled) {
                    const actionContainers = document.querySelectorAll('.Header_myActions__3rlBU.highlight-alert');
                    actionContainers.forEach(container => {
                        container.classList.remove('highlight-alert');
                    });
                    return;
                }

                const targetElement = document.querySelector(targetSelector);
                const actionContainer = document.querySelector('.Header_myActions__3rlBU');

                if (targetElement && actionContainer) {
                    const content = targetElement.textContent || targetElement.innerText;
                    const hasPlusSign = content.includes('+');

                    console.log('监控到头部信息:', content, '包含+号:', hasPlusSign);

                    if (!hasPlusSign) {
                        // 没有+号，添加高亮提醒
                        actionContainer.classList.add('highlight-alert');
                    } else {
                        // 有+号，移除高亮提醒
                        actionContainer.classList.remove('highlight-alert');
                    }
                }
            }

            // 初始检查
            setTimeout(checkHeaderContent, 1000);

            // 使用MutationObserver监听目标元素的变化
            let observer = null;

            function setupObserver() {
                const targetNode = document.querySelector(targetSelector);

                if (targetNode && !observer) {
                    observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                                checkHeaderContent();
                            }
                        });
                    });

                    // 配置观察选项
                    const config = {
                        characterData: true,
                        childList: true,
                        subtree: true
                    };

                    // 开始观察目标节点
                    observer.observe(targetNode, config);
                    console.log('已开始监控头部信息变化');
                }
            }

            // 初始设置观察器
            setTimeout(setupObserver, 1500);

            // 如果目标元素是延迟加载的，也需要监听DOM变化
            const domObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // 元素节点
                                if (node.matches?.(targetSelector) || node.querySelector?.(targetSelector)) {
                                    setupObserver();
                                    checkHeaderContent();
                                }
                            }
                        });
                    }
                });
            });

            // 开始观察整个文档
            domObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 定期检查，确保不会漏掉变化
            setInterval(checkHeaderContent, 5000);

            // 监听页面可见性变化，当页面重新显示时检查
            document.addEventListener('visibilitychange', function() {
                if (!document.hidden) {
                    setTimeout(checkHeaderContent, 500);
                }
            });
        }

        // 页面加载后或面板出现时调用
        setTimeout(() => {
            widenEnhancementContainer();
            observeSkillPanelChanges();
            initDualLevelButtons();

            // 启动头部信息监听
            setTimeout(monitorHeaderInfo, 2000);
        }, 1000); // 延迟确保游戏界面加载完成

    })();
})();