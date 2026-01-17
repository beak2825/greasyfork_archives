// ==UserScript==
// @name         收藏插件
// @namespace    https://www.milkywayidle.com/
// @namespace    https://www.milkywayidlecn.com/
// @version      1.462
// @description  Alt+点击收藏市场商品和背包物品，区分铁牛标准牛；强化界面优化，保护等级快捷按钮，当前强化等级检测，自定义键触发停止按钮
// @author       baozhi
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
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

    // 获取主设置对象
    function getMainSettings() {
        return GM_getValue('mwc_settings', { characters: {}, ui: {} });
    }

    // 保存主设置对象
    function saveMainSettings(settings) {
        GM_setValue('mwc_settings', settings);
    }

    // 获取角色特定设置
    function getCharacterSettings() {
        updateCharacterId();
        const settings = getMainSettings();
        if (!settings.characters) {
            settings.characters = {};
        }
        if (!settings.characters[currentCharacterId]) {
            settings.characters[currentCharacterId] = {
                favorites: [],
                marketFavoriteEnhanceHighlight: true,
                headerMonitorEnabled: false,
                keyboardShortcutEnabled: false,
                lazyButtonsEnabled: true,
                enhanceThreshold: 0,
                customShortcut: '`'
            };
        }
        return settings.characters[currentCharacterId];
    }

    // 保存角色特定设置
    function saveCharacterSettings(characterSettings) {
        updateCharacterId();
        const settings = getMainSettings();
        if (!settings.characters) {
            settings.characters = {};
        }
        settings.characters[currentCharacterId] = characterSettings;
        saveMainSettings(settings);
    }

    // 获取全局UI设置
    function getUISettings() {
        const settings = getMainSettings();
        if (!settings.ui) {
            settings.ui = {
                positions: {
                    stopButton: null,
                    alertOverlay: null
                },
                customCombinedLevels: [
                    { enhanceLevel: 10, protectLevel: 5 },
                    { enhanceLevel: 10, protectLevel: 6 },
                    { enhanceLevel: 10, protectLevel: 7 },
                    { enhanceLevel: 10, protectLevel: 8 }
                ],
                enhanceLevelButtons: [5, 7, 8, 10],
                protectLevelButtons: [2, 5, 6, 7, 8],
                repeatCountButtons: [2, 20, 200, 2000]
            };
        }
        return settings.ui;
    }

    // 保存全局UI设置
    function saveUISettings(uiSettings) {
        const settings = getMainSettings();
        settings.ui = uiSettings;
        saveMainSettings(settings);
    }

    // 获取自定义键盘快捷键
    function getCustomShortcut() {
        const characterSettings = getCharacterSettings();
        return characterSettings.customShortcut || '`';
    }

    // 保存自定义键盘快捷键
    function saveCustomShortcut(key) {
        const characterSettings = getCharacterSettings();
        characterSettings.customShortcut = key;
        saveCharacterSettings(characterSettings);
    }

    // 获取键盘快捷键对应的键盘码
    function getShortcutCode(key) {
        const keyCodeMap = {
            '`': 'Backquote',
            '1': 'Digit1',
            '2': 'Digit2',
            '3': 'Digit3',
            '4': 'Digit4',
            '5': 'Digit5',
            '6': 'Digit6',
            '7': 'Digit7',
            '8': 'Digit8',
            '9': 'Digit9',
            '0': 'Digit0',
            'F1': 'F1',
            'F2': 'F2',
            'F3': 'F3',
            'F4': 'F4',
            'F5': 'F5',
            'F6': 'F6',
            'F7': 'F7',
            'F8': 'F8',
            'F9': 'F9',
            'F10': 'F10',
            'F11': 'F11',
            'F12': 'F12',
            'Space': 'Space',
            'Enter': 'Enter',
            'Escape': 'Escape'
        };
        return keyCodeMap[key] || 'Backquote';
    }

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

    // 获取收藏列表
    function getFavorites() {
        const characterSettings = getCharacterSettings();
        return characterSettings.favorites || [];
    }

    // 保存收藏列表
    function saveFavorites(favorites) {
        const characterSettings = getCharacterSettings();
        characterSettings.favorites = favorites;
        saveCharacterSettings(characterSettings);
    }

    // 获取市场强化装备高亮开关状态
    function getMarketFavoriteEnhanceHighlight() {
        const characterSettings = getCharacterSettings();
        return characterSettings.marketFavoriteEnhanceHighlight !== undefined ? characterSettings.marketFavoriteEnhanceHighlight : true;
    }

    // 保存开关状态
    function saveMarketFavoriteEnhanceHighlight(enabled) {
        const characterSettings = getCharacterSettings();
        characterSettings.marketFavoriteEnhanceHighlight = enabled;
        saveCharacterSettings(characterSettings);
    }

    // 获取所有角色的收藏统计
    function getAllCharactersFavorites() {
        const settings = getMainSettings();
        const favoritesByCharacter = {};

        if (settings.characters) {
            for (const [characterId, characterSettings] of Object.entries(settings.characters)) {
                if (characterSettings.favorites) {
                    favoritesByCharacter[characterId] = {
                        favorites: characterSettings.favorites,
                        count: characterSettings.favorites.length
                    };
                }
            }
        }

        return favoritesByCharacter;
    }

    // 获取头部信息监控开关状态
    function getHeaderMonitorEnabled() {
        const characterSettings = getCharacterSettings();
        return characterSettings.headerMonitorEnabled !== undefined ? characterSettings.headerMonitorEnabled : false;
    }

    // 保存头部信息监控开关状态
    function saveHeaderMonitorEnabled(enabled) {
        const characterSettings = getCharacterSettings();
        characterSettings.headerMonitorEnabled = enabled;
        saveCharacterSettings(characterSettings);
    }

    // 获取键盘快捷键开关状态
    function getKeyboardShortcutEnabled() {
        const characterSettings = getCharacterSettings();
        return characterSettings.keyboardShortcutEnabled !== undefined ? characterSettings.keyboardShortcutEnabled : false;
    }

    // 保存键盘快捷键开关状态
    function saveKeyboardShortcutEnabled(enabled) {
        const characterSettings = getCharacterSettings();
        characterSettings.keyboardShortcutEnabled = enabled;
        saveCharacterSettings(characterSettings);
    }

    // 获取懒鬼按钮功能开关状态
    function getLazyButtonsEnabled() {
        const characterSettings = getCharacterSettings();
        return characterSettings.lazyButtonsEnabled !== undefined ? characterSettings.lazyButtonsEnabled : true;
    }

    // 保存懒鬼按钮功能开关状态
    function saveLazyButtonsEnabled(enabled) {
        const characterSettings = getCharacterSettings();
        characterSettings.lazyButtonsEnabled = enabled;
        saveCharacterSettings(characterSettings);
    }

    // 获取强化等级检测阈值
    function getEnhanceThreshold() {
        const characterSettings = getCharacterSettings();
        const threshold = characterSettings.enhanceThreshold !== undefined ? characterSettings.enhanceThreshold : 0;
        // 确保阈值在0-20范围内
        return Math.min(20, Math.max(0, parseInt(threshold) || 0));
    }

    // 保存强化等级检测阈值
    function saveEnhanceThreshold(threshold) {
        const characterSettings = getCharacterSettings();
        // 限制在0-20范围内
        const safeThreshold = Math.min(20, Math.max(0, parseInt(threshold) || 0));
        characterSettings.enhanceThreshold = safeThreshold;
        saveCharacterSettings(characterSettings);
    }

    // 获取自定义联合按钮设置
    function getCustomCombinedLevels() {
        const uiSettings = getUISettings();
        return uiSettings.customCombinedLevels || [
            { enhanceLevel: 10, protectLevel: 5 },
            { enhanceLevel: 10, protectLevel: 6 },
            { enhanceLevel: 10, protectLevel: 7 },
            { enhanceLevel: 10, protectLevel: 8 }
        ];
    }

    // 保存自定义联合按钮设置
    function saveCustomCombinedLevels(levels) {
        const uiSettings = getUISettings();
        uiSettings.customCombinedLevels = levels;
        saveUISettings(uiSettings);
    }

    // 获取自定义强化等级按钮设置
    function getCustomEnhanceLevelButtons() {
        const uiSettings = getUISettings();
        return uiSettings.enhanceLevelButtons || [5, 7, 8, 10];
    }

    // 保存自定义强化等级按钮设置
    function saveCustomEnhanceLevelButtons(levels) {
        const uiSettings = getUISettings();
        uiSettings.enhanceLevelButtons = levels;
        saveUISettings(uiSettings);
    }

    // 获取自定义保护等级按钮设置
    function getCustomProtectLevelButtons() {
        const uiSettings = getUISettings();
        return uiSettings.protectLevelButtons || [2, 5, 6, 7, 8];
    }

    // 保存自定义保护等级按钮设置
    function saveCustomProtectLevelButtons(levels) {
        const uiSettings = getUISettings();
        uiSettings.protectLevelButtons = levels;
        saveUISettings(uiSettings);
    }

    // 获取自定义重复次数按钮设置
    function getCustomRepeatCountButtons() {
        const uiSettings = getUISettings();
        return uiSettings.repeatCountButtons || [2, 20, 200, 2000];
    }

    // 保存自定义重复次数按钮设置
    function saveCustomRepeatCountButtons(counts) {
        const uiSettings = getUISettings();
        uiSettings.repeatCountButtons = counts;
        saveUISettings(uiSettings);
    }

    // 获取停止按钮位置
    function getStopButtonPosition() {
        const uiSettings = getUISettings();
        const position = uiSettings.positions?.stopButton;
        if (position) {
            return { top: position.top || 30, left: position.left || 350 };
        }
        return { top: 30, left: 350 }; // 默认左上角
    }

    // 保存停止按钮位置
    function saveStopButtonPosition(top, left) {
        const uiSettings = getUISettings();
        if (!uiSettings.positions) {
            uiSettings.positions = {};
        }
        uiSettings.positions.stopButton = { top, left };
        saveUISettings(uiSettings);
    }

    // 获取强化信息提示框位置
    function getAlertOverlayPosition() {
        const uiSettings = getUISettings();
        const position = uiSettings.positions?.alertOverlay;
        if (position) {
            return { top: position.top || 110, left: position.left || 230 };
        }
        return { top: 110, left: 230 }; // 默认位置
    }

    // 保存强化信息提示框位置
    function saveAlertOverlayPosition(top, left) {
        const uiSettings = getUISettings();
        if (!uiSettings.positions) {
            uiSettings.positions = {};
        }
        uiSettings.positions.alertOverlay = { top, left };
        saveUISettings(uiSettings);
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

    // 键盘快捷键：按下自定义键触发停止按钮
    let keyboardShortcutHandler = null;
    function setupKeyboardShortcuts() {
        // 移除旧的事件监听器（如果存在）
        if (keyboardShortcutHandler) {
            document.removeEventListener('keydown', keyboardShortcutHandler, true);
        }

        // 创建新的事件处理器
        keyboardShortcutHandler = function(event) {
            // 检查快捷键功能是否开启
            const keyboardShortcutEnabled = getKeyboardShortcutEnabled();
            if (!keyboardShortcutEnabled) return;

            // 获取自定义快捷键
            const customShortcut = getCustomShortcut();
            const shortcutCode = getShortcutCode(customShortcut);

            // 检查是否按下了自定义快捷键
            let isShortcutKey = false;

            // 匹配逻辑：优先匹配key，然后匹配code
            if (event.key === customShortcut) {
                isShortcutKey = true;
            } else if (event.code === shortcutCode) {
                isShortcutKey = true;
            } else if (customShortcut === '`' && (event.keyCode === 192 || event.code === 'Backquote')) {
                isShortcutKey = true;
            } else if (customShortcut === 'Space' && event.code === 'Space') {
                isShortcutKey = true;
            } else if (customShortcut.startsWith('F') && event.code === customShortcut) {
                isShortcutKey = true;
            }

            if (isShortcutKey) {
                // 防止在输入框中触发
                const activeElement = document.activeElement;
                const isInput = activeElement.tagName === 'INPUT' ||
                                activeElement.tagName === 'TEXTAREA' ||
                                activeElement.isContentEditable;

                if (isInput) return;

                // 阻止默认行为，避免在某些浏览器中打开控制台
                event.preventDefault();
                event.stopPropagation();

                // 修复：使用更通用的选择器查找停止按钮
                // 原来：'button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_large__yIDVZ'
                // 现在：查找所有警告按钮，然后过滤出文本包含"停止"的
                let stopButton = null;

                // 尝试多个可能的选择器
                const possibleSelectors = [
                    'button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_large__yIDVZ',
                    'button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_small__3fqC7',
                    'button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU',
                    '.Button_button__1Fe9z.Button_warning__1-AMI'
                ];

                for (const selector of possibleSelectors) {
                    const buttons = document.querySelectorAll(selector);
                    for (const btn of buttons) {
                        if (btn.textContent.includes('停止')) {
                            stopButton = btn;
                            break;
                        }
                    }
                    if (stopButton) break;
                }

                if (!stopButton) {
                    // 如果上述选择器都没找到，尝试查找所有按钮
                    const allButtons = document.querySelectorAll('button');
                    for (const btn of allButtons) {
                        if (btn.textContent.includes('停止')) {
                            stopButton = btn;
                            break;
                        }
                    }
                }

                if (stopButton) {
                    console.log(`检测到快捷键 ${customShortcut} 按下，触发停止按钮`);

                    // 先触发点击事件
                    stopButton.click();

                    // 添加视觉反馈
                    const originalBg = stopButton.style.background;
                    const originalShadow = stopButton.style.boxShadow;
                    stopButton.style.background = 'linear-gradient(135deg, #ff4500, #ff0000)';
                    stopButton.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.7)';

                    // 恢复原始样式
                    setTimeout(() => {
                        stopButton.style.background = originalBg;
                        stopButton.style.boxShadow = originalShadow;
                    }, 200);
                } else {
                    console.log('未找到停止按钮');
                }
            }
        };

        // 添加新的事件监听器
        document.addEventListener('keydown', keyboardShortcutHandler, true); // 使用捕获阶段，确保优先处理
    }

    // 从头部信息提取强化等级
    function extractEnhanceLevelFromHeader(content) {
        if (!content) return 0;

        // 使用正则表达式匹配强化等级，格式如：北极熊鞋 +2 (378) [0h 29m 17s] 17:51:55
        const regex = /\s+\+(\d+)\s+/;
        const match = content.match(regex);

        if (match && match[1]) {
            return parseInt(match[1], 10);
        }

        return 0; // 当没有+几时，返回等级0
    }

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

        /* 键盘快捷键提示样式 */
        .keyboard-shortcut-hint {
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-size: 12px;
            animation: fadeInOut 3s ease-in-out;
            display: none;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
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
        .mwc-threshold-setting {
            display: flex; align-items: center; gap: 10px; margin: 10px 0 15px 30px;
            padding: 10px; background: var(--color-midnight-700); border-radius: 6px;
        }
        .mwc-threshold-setting label {
            font-size: 13px; color: var(--color-neutral-300); white-space: nowrap;
        }
        .mwc-threshold-input {
            background: var(--color-midnight-800); color: var(--color-text-dark-mode);
            border: 1px solid var(--color-space-300); border-radius: 4px;
            padding: 4px 8px; width: 60px; text-align: center;
            font-size: 13px;
        }
        .mwc-threshold-input:focus {
            outline: none; border-color: var(--color-orange-400);
        }
        .mwc-threshold-hint {
            font-size: 11px; color: var(--color-neutral-400); margin-left: 8px;
        }
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

        /* 悬浮提醒框样式 - 不挤压原生元素，位置在进度条下面 */
        .mwc-enhance-alert-overlay {
            position: fixed !important;
            top: 110px !important;
            left: 23% !important;
            transform: translateX(-50%) !important;
            z-index: 10000 !important;
            background: rgba(0, 0, 0, 0.9) !important;
            border: 3px solid #ff0000 !important;
            border-radius: 12px !important;
            padding: 0px 12px !important;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 0 40px rgba(255, 0, 0, 0.3) !important;
            animation: alertPulse 1.5s infinite alternate !important;
            pointer-events: none !important;
            min-width: 340px !important;
            text-align: center !important;
        }

        .mwc-enhance-alert-overlay .alert-text {
            color: #ff0000 !important;
            font-size: 18px !important;
            font-weight: bold !important;
            text-shadow: 0 0 10px rgba(255, 0, 0, 0.8) !important;
            margin: 0 !important;
        }

        /* 悬浮大按钮样式 - 不挤压原生元素，可拖拽 */
        .mwc-enhance-stop-button-overlay {
            position: fixed !important;
            z-index: 10001 !important;
            pointer-events: auto !important;
            user-select: none !important;
        }

        .mwc-enhance-stop-button-overlay button {
            padding: 20px 50px !important;
            font-size: 24px !important;
            font-weight: bold !important;
            height: 70px !important;
            min-width: 180px !important;
            border-radius: 12px !important;
            background: linear-gradient(135deg, #ff0000, #ff4500) !important;
            border: 3px solid #ff0000 !important;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.7), 0 0 40px rgba(255, 0, 0, 0.4) !important;
            color: white !important;
            cursor: move !important;
            transition: all 0.3s ease !important;
            animation: buttonPulse 2s infinite ease-in-out !important;
            position: relative !important;
        }

        .mwc-enhance-stop-button-overlay button:hover {
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.9), 0 0 60px rgba(255, 0, 0, 0.6) !important;
            background: linear-gradient(135deg, #ff4500, #ff0000) !important;
        }

        .mwc-enhance-stop-button-overlay button:active {
            cursor: grabbing !important;
        }

        .mwc-enhance-stop-button-overlay.dragging button {
            animation: none !important;
            opacity: 0.9 !important;
            cursor: grabbing !important;
        }

        @keyframes alertPulse {
            0% {
                border-color: #ff0000;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 0 40px rgba(255, 0, 0, 0.3);
            }
            50% {
                border-color: #ff4500;
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.8), 0 0 60px rgba(255, 0, 0, 0.5);
            }
            100% {
                border-color: #ff0000;
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), 0 0 40px rgba(255, 0, 0, 0.3);
            }
        }

        @keyframes buttonPulse {
            0%, 100% {
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.7), 0 0 40px rgba(255, 0, 0, 0.4);
            }
            50% {
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.9), 0 0 60px rgba(255, 0, 0, 0.6);
            }
        }
    `);

    // 显示键盘快捷键提示
    function showKeyboardHint(message) {
        let hintElement = document.getElementById('mwc-keyboard-hint');
        if (!hintElement) {
            hintElement = document.createElement('div');
            hintElement.id = 'mwc-keyboard-hint';
            hintElement.className = 'keyboard-shortcut-hint';
            document.body.appendChild(hintElement);
        }

        hintElement.textContent = message;
        hintElement.style.display = 'block';

        // 3秒后自动隐藏
        setTimeout(() => {
            hintElement.style.display = 'none';
        }, 3000);
    }

    // 设置面板
    function showSettings() {
        document.querySelectorAll('.mwc-settings').forEach(el => el.remove());

        const favorites = getFavorites();
        const marketEnhanceEnabled = getMarketFavoriteEnhanceHighlight();
        const headerMonitorEnabled = getHeaderMonitorEnabled();
        const keyboardShortcutEnabled = getKeyboardShortcutEnabled();
        const lazyButtonsEnabled = getLazyButtonsEnabled();
        const enhanceThreshold = getEnhanceThreshold();
        const customShortcut = getCustomShortcut();
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
                <h3>⭐ 设置</h3>

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
                        🔔 强化等级提醒与停止按钮放大
                    </label>
                    <span class="mwc-toggle-status" id="header-monitor-status">
                        ${headerMonitorEnabled ? '已开启' : '已关闭'}
                    </span>
                </div>

                <div class="mwc-threshold-setting" id="threshold-setting" style="${headerMonitorEnabled ? '' : 'display: none;'}">
                    <label for="enhance-threshold">强化等级阈值:</label>
                    <input type="number" id="enhance-threshold" class="mwc-threshold-input"
                           min="0" max="20" value="${enhanceThreshold}">
                    <span class="mwc-threshold-hint">
                        ${enhanceThreshold === 0 ? '0: 检测是否有+号' : `${enhanceThreshold}: 检测是否达到+${enhanceThreshold}`}
                    </span>
                </div>

                <div class="mwc-toggle">
                    <input type="checkbox" id="keyboard-shortcut-toggle" ${keyboardShortcutEnabled ? 'checked' : ''}>
                    <label for="keyboard-shortcut-toggle">
                        ⌨️ 键盘快捷键触发停止按钮
                    </label>
                    <span class="mwc-toggle-status" id="keyboard-shortcut-status">
                        ${keyboardShortcutEnabled ? '已开启' : '已关闭'}
                    </span>
                </div>

                <div class="mwc-threshold-setting" id="shortcut-setting" style="${keyboardShortcutEnabled ? '' : 'display: none;'}">
                    <label for="custom-shortcut">自定义快捷键:</label>
                    <input type="text" id="custom-shortcut" class="mwc-threshold-input"
                           maxlength="10" value="${customShortcut}" placeholder="例如: \`, F1, Space"
                           style="width: 120px;">
                    <span class="mwc-threshold-hint">
                        当前: <kbd>${customShortcut}</kbd> (点击输入框后按任意键设置)
                    </span>
                </div>

                <div class="mwc-toggle">
                    <input type="checkbox" id="lazy-buttons-toggle" ${lazyButtonsEnabled ? 'checked' : ''}>
                    <label for="lazy-buttons-toggle">
                        🛋️ 懒鬼按钮功能（强化等级/保护等级快捷按钮）
                    </label>
                    <span class="mwc-toggle-status" id="lazy-buttons-status">
                        ${lazyButtonsEnabled ? '已开启' : '已关闭'}
                    </span>
                </div>

                <p style="color: var(--color-neutral-400); font-size: 12px; margin-bottom: 15px; line-height: 1.6;">
                    <strong>🎯 操作：</strong><kbd>Alt + 点击</kbd> 快速收藏/取消<br>
                    <strong>🎮 快捷键：</strong>自定义键触发停止按钮（可在上方设置）<br>
                    <strong>🔔 强化提醒：</strong>阈值0检测是否有+号，阈值>0检测是否达到对应等级<br>
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
        const thresholdSetting = settings.querySelector('#threshold-setting');
        const thresholdHint = settings.querySelector('.mwc-threshold-hint');

        headerToggle.addEventListener('change', () => {
            const enabled = headerToggle.checked;
            saveHeaderMonitorEnabled(enabled);
            headerStatus.textContent = enabled ? '已开启' : '已关闭';
            thresholdSetting.style.display = enabled ? '' : 'none';

            // 如果关闭监控，立即移除所有悬浮元素
            if (!enabled) {
                const alertOverlay = document.getElementById('mwc-enhance-alert-overlay');
                const buttonOverlay = document.getElementById('mwc-enhance-stop-button-overlay');
                if (alertOverlay) alertOverlay.remove();
                if (buttonOverlay) buttonOverlay.remove();
            } else {
                // 如果开启监控，立即执行一次检测
                setTimeout(() => {
                    const checkHeaderContent = window.checkHeaderContent;
                    if (typeof checkHeaderContent === 'function') {
                        checkHeaderContent();
                    }
                }, 100);
            }
        });

        // 强化阈值输入事件
        const thresholdInput = settings.querySelector('#enhance-threshold');
        thresholdInput.addEventListener('input', () => {
            const threshold = parseInt(thresholdInput.value) || 0;
            // 限制在0-20范围内
            const safeThreshold = Math.min(20, Math.max(0, threshold));
            thresholdInput.value = safeThreshold;

            // 更新提示文本
            const hintText = safeThreshold === 0 ? '0: 检测是否有+号' : `${safeThreshold}: 检测是否达到+${safeThreshold}`;
            thresholdHint.textContent = hintText;

            // 保存设置
            saveEnhanceThreshold(safeThreshold);

            // 立即应用新阈值
            setTimeout(() => {
                const checkHeaderContent = window.checkHeaderContent;
                if (typeof checkHeaderContent === 'function') {
                    checkHeaderContent();
                }
            }, 100);
        });

        // 键盘快捷键开关事件
        const keyboardToggle = settings.querySelector('#keyboard-shortcut-toggle');
        const keyboardStatus = settings.querySelector('#keyboard-shortcut-status');
        const shortcutSetting = settings.querySelector('#shortcut-setting');
        const shortcutHint = settings.querySelector('#shortcut-setting .mwc-threshold-hint');
        keyboardToggle.addEventListener('change', () => {
            const enabled = keyboardToggle.checked;
            saveKeyboardShortcutEnabled(enabled);
            keyboardStatus.textContent = enabled ? '已开启' : '已关闭';
            shortcutSetting.style.display = enabled ? '' : 'none';
        });

        // 懒鬼按钮功能开关事件
        const lazyButtonsToggle = settings.querySelector('#lazy-buttons-toggle');
        const lazyButtonsStatus = settings.querySelector('#lazy-buttons-status');
        lazyButtonsToggle.addEventListener('change', () => {
            const enabled = lazyButtonsToggle.checked;
            saveLazyButtonsEnabled(enabled);
            lazyButtonsStatus.textContent = enabled ? '已开启' : '已关闭';

            // 如果关闭懒鬼按钮功能，立即移除所有相关按钮
                if (!enabled) {
                    const enhanceContainer = document.querySelector('div.SkillActionDetail_notes__2je2F > div + div');
                    const protectContainer = document.getElementById('mwiProtectionButtonContainer');
                    const combinedContainer = document.getElementById('mwiCombinedLevelButtons');
                    const repeatCountContainer = document.getElementById('mwiRepeatCountButtonContainer');
                    const targetLevelBtnContainer = document.getElementById('mwiTargetLevelBtnContainer');
                    const protectionLevelBtnContainer = document.getElementById('mwiProtectionLevelBtnContainer');

                    if (enhanceContainer) enhanceContainer.remove();
                    if (protectContainer) protectContainer.remove();
                    if (combinedContainer) combinedContainer.remove();
                    if (repeatCountContainer) repeatCountContainer.remove();
                    if (targetLevelBtnContainer) targetLevelBtnContainer.remove();
                    if (protectionLevelBtnContainer) protectionLevelBtnContainer.remove();
                } else {
                    // 如果开启懒鬼按钮功能，确保按钮被重新添加
                    setTimeout(() => {
                        addButtonsToSkillActionDetail();
                        addButtonsToSkillProtectionLevel();
                        addCombinedLevelButtons();
                        addButtonsToSkillRepeatCount();
                        addLevelButtonsForBothInputs();
                    }, 150);
                }
        });

        // 自定义快捷键输入框事件
        const customShortcutInput = settings.querySelector('#custom-shortcut');
        if (customShortcutInput) {
            // 点击输入框时，监听下一个按键
            customShortcutInput.addEventListener('focus', () => {
                customShortcutInput.value = '';
                customShortcutInput.placeholder = '按任意键设置...';
            });

            // 监听按键事件来设置快捷键
            customShortcutInput.addEventListener('keydown', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 忽略一些特殊键
                if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter') {
                    return;
                }

                let keyToSave = e.key;

                // 处理特殊键名
                if (e.key === ' ') {
                    keyToSave = 'Space';
                } else if (e.key.startsWith('F') && e.key.length <= 3) {
                    // F1-F12
                    keyToSave = e.key;
                } else if (e.key.length === 1) {
                    // 单个字符键
                    keyToSave = e.key;
                } else {
                    // 其他特殊键，使用code
                    keyToSave = e.code;
                }

                // 保存快捷键
                saveCustomShortcut(keyToSave);
                customShortcutInput.value = keyToSave;
                customShortcutInput.placeholder = '例如: `, F1, Space';

                // 更新提示
                if (shortcutHint) {
                    shortcutHint.innerHTML = `当前: <kbd>${keyToSave}</kbd> (点击输入框后按任意键设置)`;
                }

                // 重新设置快捷键监听
                setupKeyboardShortcuts();
            });

            // 失去焦点时恢复显示
            customShortcutInput.addEventListener('blur', () => {
                const currentShortcut = getCustomShortcut();
                customShortcutInput.value = currentShortcut;
                customShortcutInput.placeholder = '例如: `, F1, Space';
            });
        }

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

        // 初始化键盘快捷键
        setupKeyboardShortcuts();

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

    // =================== 头部信息监听功能 ===================
    function monitorHeaderInfo() {
        // 目标元素选择器
        const targetSelector = 'div.Header_displayName__1hN09';

        // 创建或更新悬浮提醒框
        function createOrUpdateAlertOverlay(threshold, shouldShow) {
            let alertOverlay = document.getElementById('mwc-enhance-alert-overlay');

            if (!shouldShow) {
                if (alertOverlay) {
                    alertOverlay.remove();
                }
                return;
            }

            // 获取保存的位置
            const position = getAlertOverlayPosition();

            if (!alertOverlay) {
                alertOverlay = document.createElement('div');
                alertOverlay.id = 'mwc-enhance-alert-overlay';
                alertOverlay.className = 'mwc-enhance-alert-overlay';

                // 设置初始位置
                alertOverlay.style.top = position.top + 'px';
                alertOverlay.style.left = position.left + 'px';

                document.body.appendChild(alertOverlay);
            }

            // 根据阈值设置提示文字
            let alertText = '⚠️ 无强化等级！';
            if (threshold === 0) {
                alertText = '⚠️ 无强化等级！';
            } else if (threshold >= 1 && threshold <= 10) {
                alertText = `⚠️ 未达到+${threshold}！`;
            } else {
                alertText = `⚠️ 未达到+${threshold}！`;
            }

            alertOverlay.innerHTML = `<div class="alert-text">${alertText}</div>`;

            // 鼠标按下事件 - 开始拖拽
            alertOverlay.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const startX = e.clientX;
                const startY = e.clientY;
                const mouseDownTime = Date.now();
                let hasMoved = false;

                // 记录初始位置
                let dragStartX = e.clientX;
                let dragStartY = e.clientY;
                let initialTop = parseInt(alertOverlay.style.top) || position.top;
                let initialLeft = parseInt(alertOverlay.style.left) || position.left;

                const mouseMoveHandler = (moveEvent) => {
                    const moveDistance = Math.abs(moveEvent.clientX - startX) + Math.abs(moveEvent.clientY - startY);
                    if (moveDistance > 5) {
                        // 移动距离超过5px，认为是拖拽
                        if (!hasMoved) {
                            hasMoved = true;
                            alertOverlay.classList.add('dragging');
                            dragStartX = moveEvent.clientX;
                            dragStartY = moveEvent.clientY;
                        }

                        // 执行拖拽
                        const deltaX = moveEvent.clientX - dragStartX;
                        const deltaY = moveEvent.clientY - dragStartY;

                        let newTop = initialTop + deltaY;
                        let newLeft = initialLeft + deltaX;

                        // 限制在视窗内
                        const maxTop = window.innerHeight - alertOverlay.offsetHeight;
                        const maxLeft = window.innerWidth - alertOverlay.offsetWidth;
                        newTop = Math.max(0, Math.min(newTop, maxTop));
                        newLeft = Math.max(0, Math.min(newLeft, maxLeft));

                        alertOverlay.style.top = newTop + 'px';
                        alertOverlay.style.left = newLeft + 'px';
                    }
                };

                const mouseUpHandler = () => {
                    const clickDuration = Date.now() - mouseDownTime;
                    if (hasMoved) {
                        // 拖拽结束，保存位置
                        const finalTop = parseInt(alertOverlay.style.top) || position.top;
                        const finalLeft = parseInt(alertOverlay.style.left) || position.left;
                        saveAlertOverlayPosition(finalTop, finalLeft);
                    }

                    alertOverlay.classList.remove('dragging');
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });
        }

        // 创建或更新悬浮停止按钮
        function createOrUpdateStopButton(shouldShow) {
            let buttonOverlay = document.getElementById('mwc-enhance-stop-button-overlay');

            if (!shouldShow) {
                if (buttonOverlay) {
                    buttonOverlay.remove();
                }
                return;
            }

            // 查找原生的停止按钮
            let stopButton = null;
            const possibleSelectors = [
                'button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_large__yIDVZ',
                'button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU.Button_small__3fqC7',
                'button.Button_button__1Fe9z.Button_warning__1-AMI.Button_fullWidth__17pVU',
                '.Button_button__1Fe9z.Button_warning__1-AMI'
            ];

            for (const selector of possibleSelectors) {
                const buttons = document.querySelectorAll(selector);
                for (const btn of buttons) {
                    if (btn.textContent.includes('停止')) {
                        stopButton = btn;
                        break;
                    }
                }
                if (stopButton) break;
            }

            if (!stopButton) {
                const allButtons = document.querySelectorAll('button');
                for (const btn of allButtons) {
                    if (btn.textContent.includes('停止')) {
                        stopButton = btn;
                        break;
                    }
                }
            }

            if (!stopButton) {
                // 如果找不到原生按钮，移除悬浮按钮
                if (buttonOverlay) {
                    buttonOverlay.remove();
                }
                return;
            }

            // 创建或更新悬浮按钮
            const isNewButton = !buttonOverlay;
            if (isNewButton) {
                buttonOverlay = document.createElement('div');
                buttonOverlay.id = 'mwc-enhance-stop-button-overlay';
                buttonOverlay.className = 'mwc-enhance-stop-button-overlay';
                document.body.appendChild(buttonOverlay);
            }

            // 如果按钮已存在，只需要更新位置，不需要重复创建
            if (!isNewButton && buttonOverlay.querySelector('button')) {
                // 更新位置
                const position = getStopButtonPosition();
                buttonOverlay.style.top = position.top + 'px';
                buttonOverlay.style.left = position.left + 'px';
                return;
            }

            // 设置初始位置
            const position = getStopButtonPosition();
            buttonOverlay.style.top = position.top + 'px';
            buttonOverlay.style.left = position.left + 'px';

            // 创建新的悬浮按钮
            const floatingButton = document.createElement('button');
            floatingButton.textContent = '停止';

            // 鼠标按下事件 - 开始拖拽
            floatingButton.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const startX = e.clientX;
                const startY = e.clientY;
                const mouseDownTime = Date.now();
                let hasMoved = false;

                // 记录初始位置
                let dragStartX = e.clientX;
                let dragStartY = e.clientY;
                let initialTop = parseInt(buttonOverlay.style.top) || position.top;
                let initialLeft = parseInt(buttonOverlay.style.left) || position.left;

                const mouseMoveHandler = (moveEvent) => {
                    const moveDistance = Math.abs(moveEvent.clientX - startX) + Math.abs(moveEvent.clientY - startY);
                    if (moveDistance > 5) {
                        // 移动距离超过5px，认为是拖拽
                        if (!hasMoved) {
                            hasMoved = true;
                            buttonOverlay.classList.add('dragging');
                            dragStartX = moveEvent.clientX;
                            dragStartY = moveEvent.clientY;
                        }

                        // 执行拖拽
                        const deltaX = moveEvent.clientX - dragStartX;
                        const deltaY = moveEvent.clientY - dragStartY;

                        let newTop = initialTop + deltaY;
                        let newLeft = initialLeft + deltaX;

                        // 限制在视窗内
                        const maxTop = window.innerHeight - 70;
                        const maxLeft = window.innerWidth - 180;
                        newTop = Math.max(0, Math.min(newTop, maxTop));
                        newLeft = Math.max(0, Math.min(newLeft, maxLeft));

                        buttonOverlay.style.top = newTop + 'px';
                        buttonOverlay.style.left = newLeft + 'px';
                    }
                };

                const mouseUpHandler = () => {
                    const clickDuration = Date.now() - mouseDownTime;
                    if (!hasMoved && clickDuration < 300) {
                        // 短时间点击且没有移动，触发停止按钮
                        triggerStopButton();
                    } else if (hasMoved) {
                        // 拖拽结束，保存位置
                        const finalTop = parseInt(buttonOverlay.style.top) || position.top;
                        const finalLeft = parseInt(buttonOverlay.style.left) || position.left;
                        saveStopButtonPosition(finalTop, finalLeft);
                    }

                    buttonOverlay.classList.remove('dragging');
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };

                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });


            // 触发停止按钮的函数
            function triggerStopButton() {
                // 动态查找停止按钮（因为DOM可能会变化）
                let currentStopButton = null;
                for (const selector of possibleSelectors) {
                    const buttons = document.querySelectorAll(selector);
                    for (const btn of buttons) {
                        if (btn.textContent.includes('停止')) {
                            currentStopButton = btn;
                            break;
                        }
                    }
                    if (currentStopButton) break;
                }

                if (!currentStopButton) {
                    const allButtons = document.querySelectorAll('button');
                    for (const btn of allButtons) {
                        if (btn.textContent.includes('停止')) {
                            currentStopButton = btn;
                            break;
                        }
                    }
                }

                if (currentStopButton) {
                    currentStopButton.click();
                }
            }

            buttonOverlay.innerHTML = '';
            buttonOverlay.appendChild(floatingButton);
        }

        // 高亮显示强化数据面板中当前等级对应的行
        function highlightCurrentLevelInEnhancementStats(currentLevel) {
            // 获取强化数据面板
            const statsContainer = document.getElementById('enhancementStatsContainer');
            if (!statsContainer) return;

            // 移除所有之前的高亮样式
            const allCells = statsContainer.querySelectorAll('div');
            allCells.forEach(cell => {
                cell.style.backgroundColor = '';
                cell.style.fontWeight = '';
            });

            if (currentLevel < 0) return;

            // 获取所有等级单元格
            const gridCells = Array.from(statsContainer.querySelectorAll('div'));
            const totalColumns = 4; // 等级、成功、失败、概率

            // 跳过表头（前4个单元格）
            for (let i = totalColumns; i < gridCells.length; i += totalColumns) {
                // 检查当前行是否是当前等级
                const levelCell = gridCells[i];
                if (levelCell && parseInt(levelCell.textContent) === currentLevel) {
                    // 高亮整行
                    for (let j = 0; j < totalColumns; j++) {
                        const cell = gridCells[i + j];
                        if (cell) {
                            cell.style.backgroundColor = 'rgba(255, 165, 0, 0.3)';
                            cell.style.fontWeight = 'bold';
                        }
                    }
                    break;
                }
            }
        }

        // 检查目标元素的内容是否满足强化等级要求
        function checkHeaderContent() {
            const headerMonitorEnabled = getHeaderMonitorEnabled();
            const targetElement = document.querySelector(targetSelector);
            const actionContainer = document.querySelector('.Header_myActions__3rlBU');

            if (targetElement && actionContainer) {
                const content = targetElement.textContent || targetElement.innerText;
                const currentLevel = extractEnhanceLevelFromHeader(content);

                // 高亮显示当前等级在强化数据面板中的行（一直运行，不依赖监控开关）
                highlightCurrentLevelInEnhancementStats(currentLevel);

                // 如果监控功能开启，才更新悬浮提醒框和按钮
                if (headerMonitorEnabled) {
                    const threshold = getEnhanceThreshold();
                    console.log('监控到头部信息:', content, '提取等级:', currentLevel, '阈值:', threshold);

                    let shouldAlert = false;

                    // 根据阈值和当前等级判断是否需要提醒
                    if (threshold === 0) {
                        // 阈值为0：检测是否有+号（任意强化等级）
                        shouldAlert = currentLevel === 0;
                    } else {
                        // 阈值>0：检测是否达到该强化等级
                        shouldAlert = currentLevel < threshold;
                    }

                    // 更新悬浮提醒框和按钮
                    createOrUpdateAlertOverlay(threshold, shouldAlert);
                    createOrUpdateStopButton(shouldAlert);
                }
            } else {
                // 如果找不到目标元素，隐藏悬浮元素
                createOrUpdateAlertOverlay(0, false);
                createOrUpdateStopButton(false);
            }
        }

        // 将函数暴露给全局，以便设置面板可以调用
        window.checkHeaderContent = checkHeaderContent;

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
            btn.style.padding = '3px 8px';
            btn.style.fontSize = '11px';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'background-color 0.2s';
            btn.style.fontWeight = 'bold';
            btn.style.minWidth = '38px';
            btn.style.textAlign = 'center';

            btn.onmouseenter = () => btn.style.backgroundColor = 'rgb(89,91,133)';
            btn.onmouseleave = () => btn.style.backgroundColor = 'rgb(69,71,113)';
            btn.onclick = onClick;

            return btn;
        }

        // =================== 功能函数 ===================
        // 在技能详情面板添加按钮
        function addButtonsToSkillActionDetail() {
            // 检查懒鬼按钮功能是否开启
            if (!getLazyButtonsEnabled()) return;

            const target = document.querySelector('div.SkillActionDetail_notes__2je2F > div');
            if (!target || document.getElementById('mwiSkillButtonContainer')) return;

            // 获取自定义强化等级按钮设置
            const customButtons = getCustomEnhanceLevelButtons();

            // 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.id = 'mwiSkillButtonContainer';
            btnContainer.style.marginTop = '12px';
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '8px';

            // 创建按钮的函数，使用统一的模拟输入
            const createSkillButton = (id, text, value) => {
                return createButton(id, text, value, () => {
                    simulateInput('div.EnhancingPanel_skillActionDetailContainer__1pV1w > div > div > div.SkillActionDetail_inputs__2tnEq > div.SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl > div.SkillActionDetail_input__1G-kE > div > input', value);
                });
            };

            // 创建自定义按钮
            customButtons.forEach((level, index) => {
                const btn = createSkillButton(
                    `mwiSkillButton${index + 1}`,
                    `+${level}`,
                    level
                );
                btnContainer.appendChild(btn);
            });

            // 添加齿轮设置按钮到强化等级按钮后
            const settingsBtn = createButton(
                'mwiEnhanceSettingsBtn',
                '⚙️',
                'settings',
                () => {
                    showEnhanceButtonSettings();
                }
            );
            // 调整齿轮按钮样式，保持与其他按钮一致
            settingsBtn.style.fontSize = '13px';
            settingsBtn.style.padding = '4px 6px';
            settingsBtn.style.minWidth = 'auto';
            settingsBtn.style.width = '36px';
            settingsBtn.title = '自定义强化按钮';
            btnContainer.appendChild(settingsBtn);

            // 添加容器到目标元素后
            target.parentNode.insertBefore(btnContainer, target.nextSibling);
        }

        // 显示综合按钮设置弹窗
        function showEnhanceButtonSettings() {
            // 移除现有弹窗
            document.querySelectorAll('.mwi-combined-settings').forEach(el => el.remove());

            // 获取当前设置
            const customCombinedLevels = getCustomCombinedLevels();
            const customEnhanceButtons = getCustomEnhanceLevelButtons();
            const customProtectButtons = getCustomProtectLevelButtons();

            // 创建设置弹窗
            const settings = document.createElement('div');
            settings.className = 'mwc-combined-settings mwc-settings';
            settings.innerHTML = `
                <style>
                    /* 整体优化样式 - 更简洁的设计 */
                    .mwc-settings-content {
                        width: 640px !important;
                        background: var(--color-midnight-900) !important;
                    }

                    /* 模块容器 */
                    .mwc-settings-content > div:not(.mwc-close):not(:last-of-type) {
                        margin-bottom: 12px !important;
                        padding: 12px !important;
                        background: var(--color-midnight-800) !important;
                        border: 1px solid var(--color-midnight-700) !important;
                        border-radius: 4px !important;
                    }

                    /* 标题样式优化 */
                    .mwc-settings-content h3 {
                        margin-top: 0 !important;
                        margin-bottom: 12px !important;
                        font-size: 16px !important;
                        color: var(--color-neutral-200) !important;
                    }

                    .mwc-settings-content h4 {
                        margin-top: 0 !important;
                        margin-bottom: 10px !important;
                        font-size: 14px !important;
                        color: var(--color-ocean-300) !important;
                        display: flex !important;
                        align-items: center !important;
                        gap: 6px !important;
                    }

                    /* 按钮列表容器 - 简洁网格布局 */
                    .mwc-button-list {
                        display: flex !important;
                        flex-wrap: wrap !important;
                        gap: 8px !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        background: transparent !important;
                        min-height: auto !important;
                    }

                    /* 拖拽相关样式 - 简化设计 */
                    .mwc-draggable-item {
                        position: relative;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        padding: 8px 12px;
                        background: var(--color-midnight-700);
                        border: 1px solid var(--color-midnight-600);
                        border-radius: 4px;
                        cursor: move;
                        transition: all 0.15s ease;
                        font-size: 12px;
                        min-width: auto;
                        max-width: none;
                        height: auto;
                        min-height: 36px;
                    }

                    .mwc-draggable-item:hover {
                        background: var(--color-midnight-600);
                        border-color: var(--color-ocean-500);
                    }

                    .mwc-draggable-item.dragging {
                        opacity: 0.5;
                        transform: scale(1.02);
                    }

                    .mwc-draggable-item.drag-over {
                        border-color: var(--color-ocean-300);
                        background: var(--color-midnight-600);
                    }

                    /* 简化拖拽提示 */
                    .mwc-draggable-item::before {
                        content: "";
                        position: absolute;
                        top: 4px;
                        left: 4px;
                        width: 12px;
                        height: 12px;
                        background: linear-gradient(var(--color-neutral-500) 20%, transparent 20%, transparent 40%, var(--color-neutral-500) 40%, var(--color-neutral-500) 60%, transparent 60%, transparent 80%, var(--color-neutral-500) 80%);
                        border-radius: 2px;
                        cursor: grab;
                        opacity: 0.6;
                    }

                    /* 删除按钮样式 - 简化设计 */
                    .mwc-draggable-item .mwc-remove-fav {
                        position: absolute;
                        top: -6px;
                        right: -6px;
                        width: 18px;
                        height: 18px;
                        padding: 0;
                        background: var(--color-red-500);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.15s ease;
                    }

                    .mwc-draggable-item .mwc-remove-fav:hover {
                        background: var(--color-red-400);
                        transform: scale(1.1);
                    }

                    /* 按钮项内部样式 - 优化输入框 */
                    .mwc-draggable-item input {
                        padding: 4px 6px;
                        border: 1px solid var(--color-midnight-500);
                        border-radius: 3px;
                        background: var(--color-midnight-900);
                        color: var(--color-neutral-200);
                        width: 42px;
                        text-align: center;
                        font-size: 12px;
                        margin: 0;
                        outline: none;
                        transition: border-color 0.15s ease;
                    }

                    /* 重复次数输入框特殊样式 - 更宽以容纳4-5位数 */
                    .mwc-draggable-item input[placeholder="次数"] {
                        width: 70px;
                    }

                    /* 等级输入框特殊样式 - 更宽以显示完整中文 */
                    .mwc-draggable-item input[placeholder="等级"] {
                        width: 55px;
                    }

                    /* 强化和保护输入框特殊样式 - 更宽以显示完整中文 */
                    .mwc-draggable-item input[placeholder="强化"],
                    .mwc-draggable-item input[placeholder="保护"] {
                        width: 50px;
                    }

                    .mwc-draggable-item input:focus {
                        border-color: var(--color-ocean-400);
                    }

                    /* 联合按钮特殊样式 - 简化设计 */
                    .mwc-draggable-item span {
                        color: var(--color-orange-400);
                        font-weight: 600;
                        font-size: 12px;
                        margin: 0 2px;
                    }

                    /* 联合按钮容器 - 水平排列 */
                    .mwc-draggable-item .combined-levels {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        margin: 0;
                    }

                    /* 联合按钮项特殊处理 */
                    .mwc-draggable-item:has(.combined-levels) {
                        padding: 8px 12px;
                        gap: 4px;
                    }

                    /* 块状添加按钮样式 - 简化设计 */
                    .mwc-add-block-btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        padding: 8px 16px;
                        background: var(--color-midnight-700);
                        border: 1px dashed var(--color-ocean-500);
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        font-size: 12px;
                        color: var(--color-ocean-400);
                        min-height: 36px;
                        min-width: 80px;
                        flex: 0 0 auto;
                    }

                    .mwc-add-block-btn:hover {
                        background: var(--color-midnight-600);
                        border-color: var(--color-ocean-400);
                        color: var(--color-ocean-300);
                    }

                    .mwc-add-block-btn .add-icon {
                        font-size: 14px;
                        font-weight: bold;
                    }

                    /* 分隔线 */
                    .mwc-separator {
                        margin: 16px 0 !important;
                        border: none !important;
                        border-top: 1px solid var(--color-midnight-700) !important;
                    }

                    /* 保存按钮区域优化 */
                    .mwc-settings-content > div:last-of-type {
                        margin-top: 16px !important;
                        padding: 12px !important;
                        background: var(--color-midnight-800) !important;
                        border: 1px solid var(--color-midnight-700) !important;
                    }

                    .mwc-settings-content .mwc-btn {
                        font-size: 13px;
                        padding: 8px 16px;
                        border-radius: 4px;
                        border: none;
                        cursor: pointer;
                        transition: all 0.15s ease;
                    }

                    .mwc-settings-content .mwc-btn:first-of-type {
                        background: var(--color-ocean-500);
                        color: white;
                    }

                    .mwc-settings-content .mwc-btn:first-of-type:hover {
                        background: var(--color-ocean-400);
                    }

                    .mwc-settings-content .mwc-btn:last-of-type {
                        background: var(--color-midnight-600);
                        color: var(--color-neutral-300);
                    }

                    .mwc-settings-content .mwc-btn:last-of-type:hover {
                        background: var(--color-midnight-500);
                    }
                </style>
                <div class="mwc-settings-content">
                    <button class="mwc-close" title="关闭">×</button>
                    <h3>⭐ 按钮设置 <span style="font-size: 12px; color: var(--color-neutral-400);">拖拽排序，点击编辑</span></h3>

                    <!-- 强化等级按钮设置 -->
                    <div>
                        <h4><span>⚡ 强化等级</span></h4>

                        <div id="enhance-levels-list" class="mwc-button-list">
                            ${customEnhanceButtons.map((level, index) => `
                                <div class="mwc-draggable-item" draggable="true" data-index="${index}">
                                    <input type="number" placeholder="等级" min="0" max="20" value="${level}">
                                    <button class="mwc-remove-fav" data-index="${index}">×</button>
                                </div>
                            `).join('')}
                            <button id="add-enhance-level" class="mwc-add-block-btn">
                                <span class="add-icon">+</span>
                                <span>添加</span>
                            </button>
                        </div>
                    </div>

                    <!-- 保护等级按钮设置 -->
                    <div>
                        <h4><span>🛡️ 保护等级</span></h4>

                        <div id="protect-levels-list" class="mwc-button-list">
                            ${customProtectButtons.map((level, index) => `
                                <div class="mwc-draggable-item" draggable="true" data-index="${index}">
                                    <input type="number" placeholder="等级" min="0" max="20" value="${level}">
                                    <button class="mwc-remove-fav" data-index="${index}">×</button>
                                </div>
                            `).join('')}
                            <button id="add-protect-level" class="mwc-add-block-btn">
                                <span class="add-icon">+</span>
                                <span>添加</span>
                            </button>
                        </div>
                    </div>

                    <!-- 重复次数按钮设置 -->
                    <div>
                        <h4><span>🔢 重复次数</span></h4>

                        <div id="repeat-count-list" class="mwc-button-list">
                            ${getCustomRepeatCountButtons().map((count, index) => `
                                <div class="mwc-draggable-item" draggable="true" data-index="${index}">
                                    <input type="number" placeholder="次数" min="1" max="99999" value="${count}">
                                    <button class="mwc-remove-fav" data-index="${index}">×</button>
                                </div>
                            `).join('')}
                            <button id="add-repeat-count" class="mwc-add-block-btn">
                                <span class="add-icon">+</span>
                                <span>添加</span>
                            </button>
                        </div>
                    </div>

                    <!-- 联合按钮设置 -->
                    <div>
                        <h4>
                            <span>🔄 联合快捷</span>
                            <span style="font-size: 11px; color: var(--color-neutral-400); font-weight: normal; margin-left: 8px;">
                                格式：强化等级+保护等级+次数 | 次数不填或填0代表99999
                            </span>
                        </h4>
                        <div id="combined-levels-list" class="mwc-button-list">
                            ${customCombinedLevels.map((level, index) => `
                                <div class="mwc-draggable-item" draggable="true" data-index="${index}">
                                    <div class="combined-levels">
                                        <input type="number" placeholder="强化" min="0" max="20" value="${level.enhanceLevel}">
                                        <span>+</span>
                                        <input type="number" placeholder="保护" min="0" max="20" value="${level.protectLevel}">
                                        <span>×</span>
                                        <input type="number" placeholder="次数" min="0" max="99999" value="${level.count || ''}">
                                    </div>
                                    <button class="mwc-remove-fav" data-index="${index}">×</button>
                                </div>
                            `).join('')}
                            <button id="add-combined-level" class="mwc-add-block-btn">
                                <span class="add-icon">+</span>
                                <span>添加</span>
                            </button>
                        </div>
                    </div>

                    <hr class="mwc-separator">

                    <!-- 统一的保存和关闭按钮 -->
                    <div style="display: flex; justify-content: center; gap: 10px;">
                        <button class="mwc-btn" id="save-all-settings">保存设置</button>
                        <button class="mwc-btn" id="close-all-settings">关闭</button>
                    </div>
                </div>
            `;

            document.body.appendChild(settings);

            // ==================== 拖拽排序功能 ====================
            // 当前拖拽的元素 - 移到外部以便在所有事件中共享
            let draggedItem = null;

            function initDragEvents(item) {
                // 开始拖拽
                item.addEventListener('dragstart', (e) => {
                    draggedItem = e.target;
                    e.target.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', e.target.innerHTML);
                });

                // 拖拽过程中
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';

                    const target = e.target.closest('.mwc-draggable-item');
                    if (!target || target === draggedItem) return;

                    // 移除其他元素的拖放指示
                    target.parentElement.querySelectorAll('.drag-over').forEach(el => {
                        el.classList.remove('drag-over');
                    });

                    // 添加拖放指示
                    target.classList.add('drag-over');
                });

                // 离开拖放区域
                item.addEventListener('dragleave', (e) => {
                    const target = e.target.closest('.mwc-draggable-item');
                    if (target && !target.contains(e.relatedTarget)) {
                        target.classList.remove('drag-over');
                    }
                });

                // 放置元素
                item.addEventListener('drop', (e) => {
                    e.preventDefault();

                    const target = e.target.closest('.mwc-draggable-item');
                    if (!target || target === draggedItem) return;

                    const container = target.parentElement;
                    const targetIndex = Array.from(container.children).indexOf(target);
                    const draggedIndex = Array.from(container.children).indexOf(draggedItem);

                    // 根据位置决定插入位置
                    if (targetIndex > draggedIndex) {
                        container.insertBefore(draggedItem, target.nextSibling);
                    } else {
                        container.insertBefore(draggedItem, target);
                    }

                    // 移除拖放指示
                    target.classList.remove('drag-over');

                    // 更新所有元素的索引
                    updateItemIndexes(container);
                });

                // 拖拽结束
                item.addEventListener('dragend', () => {
                    if (draggedItem) {
                        draggedItem.classList.remove('dragging');
                        draggedItem.parentElement.querySelectorAll('.drag-over').forEach(el => {
                            el.classList.remove('drag-over');
                        });
                        draggedItem = null;
                    }
                });
            }

            // 更新所有元素的索引
            function updateItemIndexes(container) {
                const items = container.querySelectorAll('.mwc-draggable-item');
                items.forEach((item, index) => {
                    item.dataset.index = index;
                    const removeBtn = item.querySelector('.mwc-remove-fav');
                    if (removeBtn) {
                        removeBtn.dataset.index = index;
                    }
                });
            }

            // 为容器添加拖放支持
            function initContainerDrag(container) {
                // 确保容器可以接受拖放
                container.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                });

                // 处理在容器空白处的放置
                container.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if (!draggedItem || container.contains(draggedItem)) {
                        draggedItem.classList.remove('dragging');
                        draggedItem = null;
                    }
                });
            }

            // 初始化所有容器的拖拽支持
            const containers = [
                settings.querySelector('#enhance-levels-list'),
                settings.querySelector('#protect-levels-list'),
                settings.querySelector('#combined-levels-list'),
                settings.querySelector('#repeat-count-list')
            ];
            containers.forEach(container => {
                if (container) {
                    initContainerDrag(container);
                }
            });

            // 初始化所有现有元素的拖拽事件
            const allItems = settings.querySelectorAll('.mwc-draggable-item');
            allItems.forEach(item => {
                initDragEvents(item);
            });

            // ==================== 强化等级按钮设置 ====================
            // 添加新强化等级按钮事件
            const addEnhanceBtn = settings.querySelector('#add-enhance-level');
            const enhanceList = settings.querySelector('#enhance-levels-list');

            addEnhanceBtn.addEventListener('click', () => {
                const newIndex = enhanceList.children.length;
                const newBtnRow = document.createElement('div');
                newBtnRow.className = 'mwc-draggable-item';
                newBtnRow.draggable = true;
                newBtnRow.dataset.index = newIndex;
                newBtnRow.innerHTML = `
                    <input type="number" placeholder="等级" min="0" max="20">
                    <button class="mwc-remove-fav" data-index="${newIndex}">×</button>
                `;
                enhanceList.appendChild(newBtnRow);

                // 添加拖拽事件监听器
                initDragEvents(newBtnRow);
            });

            // 删除强化等级按钮事件
            enhanceList.addEventListener('click', (e) => {
                if (e.target.classList.contains('mwc-remove-fav')) {
                    e.target.closest('.mwc-draggable-item').remove();
                    // 更新所有元素的索引
                    updateItemIndexes(enhanceList);
                }
            });

            // ==================== 保护等级按钮设置 ====================
            // 添加新保护等级按钮事件
            const addProtectBtn = settings.querySelector('#add-protect-level');
            const protectList = settings.querySelector('#protect-levels-list');

            addProtectBtn.addEventListener('click', () => {
                const newIndex = protectList.children.length;
                const newBtnRow = document.createElement('div');
                newBtnRow.className = 'mwc-draggable-item';
                newBtnRow.draggable = true;
                newBtnRow.dataset.index = newIndex;
                newBtnRow.innerHTML = `
                    <input type="number" placeholder="等级" min="0" max="20">
                    <button class="mwc-remove-fav" data-index="${newIndex}">×</button>
                `;
                protectList.appendChild(newBtnRow);

                // 添加拖拽事件监听器
                initDragEvents(newBtnRow);
            });

            // 删除保护等级按钮事件
            protectList.addEventListener('click', (e) => {
                if (e.target.classList.contains('mwc-remove-fav')) {
                    e.target.closest('.mwc-draggable-item').remove();
                    // 更新所有元素的索引
                    updateItemIndexes(protectList);
                }
            });

            // ==================== 联合按钮设置 ====================
            // 添加新联合按钮事件
            const addCombinedBtn = settings.querySelector('#add-combined-level');
            const combinedList = settings.querySelector('#combined-levels-list');

            addCombinedBtn.addEventListener('click', () => {
                const newIndex = combinedList.children.length;
                const newLevelRow = document.createElement('div');
                newLevelRow.className = 'mwc-draggable-item';
                newLevelRow.draggable = true;
                newLevelRow.dataset.index = newIndex;
                newLevelRow.innerHTML = `
                    <input type="number" placeholder="强化" min="0" max="20">
                    <span style="color: var(--color-orange-300); font-weight: bold; font-size: 14px;">+</span>
                    <input type="number" placeholder="保护" min="0" max="20">
                    <span style="color: var(--color-orange-300); font-weight: bold; font-size: 14px;">×</span>
                    <input type="number" placeholder="次数" min="0" max="99999">
                    <button class="mwc-remove-fav" data-index="${newIndex}">×</button>
                `;
                combinedList.appendChild(newLevelRow);

                // 添加拖拽事件监听器
                initDragEvents(newLevelRow);
            });

            // 删除联合按钮事件
            combinedList.addEventListener('click', (e) => {
                if (e.target.classList.contains('mwc-remove-fav')) {
                    e.target.closest('.mwc-draggable-item').remove();
                    // 更新所有元素的索引
                    updateItemIndexes(combinedList);
                }
            });

            // ==================== 重复次数按钮设置 ====================
            // 添加新重复次数按钮事件
            const addRepeatCountBtn = settings.querySelector('#add-repeat-count');
            const repeatCountList = settings.querySelector('#repeat-count-list');

            addRepeatCountBtn.addEventListener('click', () => {
                const newIndex = repeatCountList.children.length;
                const newCountRow = document.createElement('div');
                newCountRow.className = 'mwc-draggable-item';
                newCountRow.draggable = true;
                newCountRow.dataset.index = newIndex;
                newCountRow.innerHTML = `
                    <input type="number" placeholder="次数" min="1" max="99999">
                    <button class="mwc-remove-fav" data-index="${newIndex}">×</button>
                `;
                repeatCountList.appendChild(newCountRow);

                // 添加拖拽事件监听器
                initDragEvents(newCountRow);
            });

            // 删除重复次数按钮事件
            repeatCountList.addEventListener('click', (e) => {
                if (e.target.classList.contains('mwc-remove-fav')) {
                    e.target.closest('.mwc-draggable-item').remove();
                    // 更新所有元素的索引
                    updateItemIndexes(repeatCountList);
                }
            });

            // ==================== 保存所有设置 ====================
            const saveAllBtn = settings.querySelector('#save-all-settings');
            saveAllBtn.addEventListener('click', () => {
                // 保存强化等级按钮设置
                const enhanceRows = enhanceList.querySelectorAll('.mwc-draggable-item');
                const newEnhanceButtons = [];

                enhanceRows.forEach(row => {
                    const levelInput = row.querySelector('input');
                    const level = parseInt(levelInput.value);

                    if (!isNaN(level) && level >= 0 && level <= 20) {
                        newEnhanceButtons.push(level);
                    }
                });

                // 保存保护等级按钮设置
                const protectRows = protectList.querySelectorAll('.mwc-draggable-item');
                const newProtectButtons = [];

                protectRows.forEach(row => {
                    const levelInput = row.querySelector('input');
                    const level = parseInt(levelInput.value);

                    if (!isNaN(level) && level >= 0 && level <= 20) {
                        newProtectButtons.push(level);
                    }
                });

                // 保存联合按钮设置
                const combinedRows = combinedList.querySelectorAll('.mwc-draggable-item');
                const newCombinedLevels = [];

                combinedRows.forEach(row => {
                    const inputs = row.querySelectorAll('input');
                    if (inputs.length < 3) return;

                    const enhanceInput = inputs[0];
                    const protectInput = inputs[1];
                    const countInput = inputs[2];

                    const enhanceLevel = parseInt(enhanceInput.value);
                    const protectLevel = parseInt(protectInput.value);
                    const count = parseInt(countInput.value);

                    if (!isNaN(enhanceLevel) && !isNaN(protectLevel) && enhanceLevel >= 0 && protectLevel >= 0) {
                        const combinedData = { enhanceLevel, protectLevel };
                        // 如果次数不是0且不是空，则保存次数
                        if (!isNaN(count) && count > 0) {
                            combinedData.count = count;
                        }
                        newCombinedLevels.push(combinedData);
                    }
                });

                // 保存重复次数按钮设置
                const repeatCountRows = repeatCountList.querySelectorAll('.mwc-draggable-item');
                const newRepeatCountButtons = [];

                repeatCountRows.forEach(row => {
                    const countInput = row.querySelector('input');
                    const count = parseInt(countInput.value);

                    if (!isNaN(count) && count >= 1 && count <= 99999) {
                        newRepeatCountButtons.push(count);
                    }
                });

                // 保存所有设置
                saveCustomEnhanceLevelButtons(newEnhanceButtons);
                saveCustomProtectLevelButtons(newProtectButtons);
                saveCustomCombinedLevels(newCombinedLevels);
                saveCustomRepeatCountButtons(newRepeatCountButtons);

                // 重新加载所有按钮
                const enhanceContainer = document.querySelector('div.SkillActionDetail_notes__2je2F > div + div');
                if (enhanceContainer) enhanceContainer.remove();

                const protectContainer = document.getElementById('mwiProtectionButtonContainer');
                if (protectContainer) protectContainer.remove();

                const combinedContainer = document.getElementById('mwiCombinedLevelButtons');
                if (combinedContainer) combinedContainer.remove();

                const repeatCountContainer = document.getElementById('mwiRepeatCountButtonContainer');
                if (repeatCountContainer) repeatCountContainer.remove();

                addButtonsToSkillActionDetail();
                addButtonsToSkillProtectionLevel();
                addCombinedLevelButtons();
                addButtonsToSkillRepeatCount();

                // 关闭弹窗
                settings.remove();
            });

            // 关闭按钮事件
            const closeAllBtn = settings.querySelector('#close-all-settings');
            closeAllBtn.addEventListener('click', () => {
                settings.remove();
            });

            // 点击关闭按钮
            settings.querySelector('.mwc-close').addEventListener('click', () => {
                settings.remove();
            });
        }

        // 在技能详情面板添加联合快捷按钮（同时设置强化等级和保护等级）
        function addCombinedLevelButtons() {
            // 检查懒鬼按钮功能是否开启
            if (!getLazyButtonsEnabled()) return;

            // 找到SkillActionDetail_primaryItemAndNotes__RBDpJ元素作为参考点
            const target = document.querySelector('.SkillActionDetail_primaryItemAndNotes__RBDpJ');
            if (!target || document.getElementById('mwiCombinedLevelButtons')) return;

            // 创建联合按钮容器
            const combinedContainer = document.createElement('div');
            combinedContainer.id = 'mwiCombinedLevelButtons';
            combinedContainer.style.marginTop = '12px';
            combinedContainer.style.display = 'flex';
            combinedContainer.style.gap = '8px';
            combinedContainer.style.flexWrap = 'wrap';

            // 创建联合按钮的函数
            const createCombinedButton = (id, text, enhanceLevel, protectLevel, count) => {
                const btn = createButton(id, text, `${enhanceLevel}+${protectLevel}`, (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // 同时设置强化等级和保护等级
                    simulateInput('div.EnhancingPanel_skillActionDetailContainer__1pV1w > div > div > div.SkillActionDetail_inputs__2tnEq > div.SkillActionDetail_enhancingMaxLevelInputContainer__1VCWl > div.SkillActionDetail_input__1G-kE > div > input', enhanceLevel);
                    simulateInput('.SkillActionDetail_protectionMinLevelInputContainer__1HSzb input.Input_input__2-t98', protectLevel);

                    // 设置重复次数：如果count存在且大于0则使用该值，否则设置为99999
                    const repeatCount = (count && count > 0) ? count : 99999;
                    simulateInput('.SkillActionDetail_maxActionCountInput__1C0Pw input.Input_input__2-t98', repeatCount);
                });

                // 调整按钮样式，保持与其他按钮一致但更宽
                btn.style.minWidth = '60px'; // 稍微加宽以适应联合按钮文本
                btn.style.padding = '3px 8px'; // 保持与强化等级按钮相同的内边距

                return btn;
            };

            // 获取联合按钮设置（包含默认或自定义设置）
            const customLevels = getCustomCombinedLevels();

            // 创建所有按钮（默认或自定义）
            customLevels.forEach((level, index) => {
                // 构建按钮文本，包含次数信息（如果有）
                let btnText = `${level.enhanceLevel}+${level.protectLevel}`;
                if (level.count && level.count > 0) {
                    btnText += `×${level.count}`;
                }

                const btn = createCombinedButton(
                    `mwiCombinedCustom${index}`,
                    btnText,
                    level.enhanceLevel,
                    level.protectLevel,
                    level.count
                );
                combinedContainer.appendChild(btn);
            });

            // 不再添加重复的齿轮按钮，已移至强化等级按钮后

            // 添加容器到SkillActionDetail_primaryItemAndNotes__RBDpJ下面
            target.parentNode.insertBefore(combinedContainer, target.nextSibling);
        }

        // 在技能详情面板添加第二个输入框（保护最小等级）的快速按钮
        function addButtonsToSkillRepeatCount() {
            // 检查懒鬼按钮功能是否开启
            if (!getLazyButtonsEnabled()) return;

            // 找到重复次数输入框容器
            const target = document.querySelector('.SkillActionDetail_maxActionCountInput__1C0Pw');
            if (!target) return;

            // 检查是否已经添加了自定义按钮
            if (document.getElementById('mwiRepeatCountButton1')) return;

            // 找到原生的1按钮和无穷按钮
            const nativeButtons = target.querySelectorAll('.Button_button__1Fe9z');
            if (nativeButtons.length < 2) return;

            const oneButton = nativeButtons[0];
            const infinityButton = nativeButtons[1];

            // 获取自定义重复次数按钮设置
            const customButtons = getCustomRepeatCountButtons();

            // 创建按钮的函数，使用与原生按钮相同的样式
            const createRepeatCountButton = (id, text, value) => {
                const btn = document.createElement('button');
                btn.id = id;
                btn.className = 'Button_button__1Fe9z Button_small__3fqC7';
                btn.textContent = text;
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    simulateInput('.SkillActionDetail_maxActionCountInput__1C0Pw input.Input_input__2-t98', value);
                };
                return btn;
            };

            // 创建并插入自定义按钮到原生1按钮和无穷按钮之间
            customButtons.forEach((count, index) => {
                const btn = createRepeatCountButton(
                    `mwiRepeatCountButton${index + 1}`,
                    `${count}`,
                    count
                );
                target.insertBefore(btn, infinityButton);
            });
        }

        function addButtonsToSkillProtectionLevel() {
            // 检查懒鬼按钮功能是否开启
            if (!getLazyButtonsEnabled()) return;

            // 找到保护最小等级输入框容器
            const targetContainer = document.querySelector('.SkillActionDetail_protectionMinLevelInputContainer__1HSzb');
            if (!targetContainer || document.getElementById('mwiProtectionButtonContainer')) return;

            // 定位保护最小等级输入框
            const protectionInputElement = targetContainer.querySelector('input.Input_input__2-t98');
            if (!protectionInputElement) return;

            // 获取自定义保护等级按钮设置
            const customButtons = getCustomProtectLevelButtons();

            // 创建按钮容器
            const btnContainer = document.createElement('div');
            btnContainer.id = 'mwiProtectionButtonContainer';
            btnContainer.style.display = 'flex';
            btnContainer.style.gap = '8px';
            btnContainer.style.marginTop = '12px';
            btnContainer.style.alignItems = 'center';

            // 添加说明标签
            const label = document.createElement('span');
            label.textContent = '保护等级:';
            label.style.fontSize = '12px';
            label.style.color = '#aaa';
            label.style.marginRight = '8px';
            btnContainer.appendChild(label);

            // 创建保护等级按钮的函数，使用统一的模拟输入
            const createProtectionButton = (id, text, value) => {
                return createButton(id, text, value, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    simulateInput('.SkillActionDetail_protectionMinLevelInputContainer__1HSzb input.Input_input__2-t98', value);
                });
            };

            // 创建自定义按钮
            customButtons.forEach((level, index) => {
                const btn = createProtectionButton(
                    `mwiProtectionButton${index + 1}`,
                    `+${level}`,
                    level
                );
                btnContainer.appendChild(btn);
            });

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
            // 检查懒鬼按钮功能是否启用
            if (!getLazyButtonsEnabled()) {
                // 如果禁用，移除已添加的按钮
                const targetBtnContainer = document.getElementById('mwiTargetLevelBtnContainer');
                const protectionBtnContainer = document.getElementById('mwiProtectionLevelBtnContainer');
                if (targetBtnContainer) targetBtnContainer.remove();
                if (protectionBtnContainer) protectionBtnContainer.remove();
                return;
            }

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
                        addCombinedLevelButtons(); // 添加联合快捷按钮
                        addButtonsToSkillRepeatCount(); // 添加重复次数快捷按钮
                    }, 150);
                }
            });

            skillPanelObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                subtree: true
            });
        }

        // 数据迁移函数 - 将旧的存储格式迁移到新的统一存储结构
    function migrateOldData() {
        const allValues = GM_getValue(null) || {};
        let needsMigration = false;
        const migratedSettings = getMainSettings();
        const migratedCharacters = {};
        const migratedUI = migratedSettings.ui || {};

        // 迁移角色特定数据
        for (const [key, value] of Object.entries(allValues)) {
            if (key.startsWith('mwc_favorites_') ||
                key.startsWith('mwc_market_fav_enhance_highlight_') ||
                key.startsWith('mwc_header_monitor_enabled_') ||
                key.startsWith('mwc_keyboard_shortcut_enabled_') ||
                key.startsWith('mwc_lazy_buttons_enabled_') ||
                key.startsWith('mwc_enhance_threshold_') ||
                key.startsWith('mwc_custom_shortcut_')) {

                needsMigration = true;
                const parts = key.split('_');
                const characterId = parts.pop();
                const baseKey = parts.join('_');

                if (!migratedCharacters[characterId]) {
                    migratedCharacters[characterId] = {
                        favorites: [],
                        marketFavoriteEnhanceHighlight: true,
                        headerMonitorEnabled: false,
                        keyboardShortcutEnabled: false,
                        lazyButtonsEnabled: true,
                        enhanceThreshold: 0,
                        customShortcut: '`'
                    };
                }

                switch (baseKey) {
                    case 'mwc_favorites':
                        migratedCharacters[characterId].favorites = value;
                        break;
                    case 'mwc_market_fav_enhance_highlight':
                        migratedCharacters[characterId].marketFavoriteEnhanceHighlight = value;
                        break;
                    case 'mwc_header_monitor_enabled':
                        migratedCharacters[characterId].headerMonitorEnabled = value;
                        break;
                    case 'mwc_keyboard_shortcut_enabled':
                        migratedCharacters[characterId].keyboardShortcutEnabled = value;
                        break;
                    case 'mwc_lazy_buttons_enabled':
                        migratedCharacters[characterId].lazyButtonsEnabled = value;
                        break;
                    case 'mwc_enhance_threshold':
                        migratedCharacters[characterId].enhanceThreshold = value;
                        break;
                    case 'mwc_custom_shortcut':
                        migratedCharacters[characterId].customShortcut = value;
                        break;
                }
            }
        }

        // 迁移UI位置数据
        if (allValues['mwc_ui_positions']) {
            needsMigration = true;
            migratedUI.positions = allValues['mwc_ui_positions'];
        } else {
            if (allValues['mwc_stop_button_position']) {
                needsMigration = true;
                if (!migratedUI.positions) migratedUI.positions = {};
                migratedUI.positions.stopButton = allValues['mwc_stop_button_position'];
            }
            if (allValues['mwc_alert_overlay_position']) {
                needsMigration = true;
                if (!migratedUI.positions) migratedUI.positions = {};
                migratedUI.positions.alertOverlay = allValues['mwc_alert_overlay_position'];
            }
        }

        // 如果有需要迁移的数据，保存到新结构中
        if (needsMigration) {
            const finalSettings = {
                characters: { ...migratedSettings.characters, ...migratedCharacters },
                ui: migratedUI
            };
            saveMainSettings(finalSettings);

            // 清理旧数据
            for (const [key] of Object.entries(allValues)) {
                if (key.startsWith('mwc_favorites_') ||
                    key.startsWith('mwc_market_fav_enhance_highlight_') ||
                    key.startsWith('mwc_header_monitor_enabled_') ||
                    key.startsWith('mwc_keyboard_shortcut_enabled_') ||
                    key.startsWith('mwc_lazy_buttons_enabled_') ||
                    key.startsWith('mwc_enhance_threshold_') ||
                    key.startsWith('mwc_custom_shortcut_') ||
                    key === 'mwc_ui_positions' ||
                    key === 'mwc_stop_button_position' ||
                    key === 'mwc_alert_overlay_position') {
                    GM_deleteValue(key);
                }
            }
        }
    }

    // 页面加载后或面板出现时调用
    setTimeout(() => {
        // 先执行数据迁移
        migrateOldData();

        widenEnhancementContainer();
        observeSkillPanelChanges();
        initDualLevelButtons();

        // 启动头部信息监听
        setTimeout(monitorHeaderInfo, 2000);
    }, 1000); // 延迟确保游戏界面加载完成

    })();
})();