// ==UserScript==
// @name         SteamPY购物助手
// @namespace    https://steampy.com/
// @version      1.2
// @description  SteamPY用的下单辅助脚本，支持自动选择最低价下单、按阈值下单和自动刷新监控最新价格等功能
// @author       sjx01
// @match        https://steampy.com/*
// @icon         https://steampy.com/img/logo.63413a4f.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551333/SteamPY%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/551333/SteamPY%E8%B4%AD%E7%89%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================== 常量定义 ====================
    const CONSTANTS = {
        CSS_SELECTORS: {
            GAME_NAME_PRIMARY: '.ht100.mt-50 .gameName',
            GAME_NAME_FALLBACK_1: '.gameName.fw-b.ml-50',
            GAME_NAME_FALLBACK_2: '[class*="gameName"]',
            PRICE_ROW: '.ivu-table-row',
            MODAL_WRAP: '.ivu-modal-wrap',
            BUY_BUTTON: 'button, .btn, [class*="button"]',
            CHECKOUT_BUTTON: 'button:contains("立即购买")',
            BALANCE_CHECKBOX: 'input.ivu-checkbox-input[type="checkbox"]',
            NEXT_BUTTON: 'button:contains("下一步")',
            ACTIVATION_BUTTON: '.b_black.btn.c-point, button:contains("确认")',
            PRICE_ELEMENT: '[class*="price"], [class*="Price"]'
        },
        NOTIFICATIONS: {
            SETTINGS_UPDATED: '设置已更新:',
            CANNOT_GET_NAME: '无法获取游戏名称，请稍后再试',
            AUTO_REFRESH_STARTED: '自动刷新已开启',
            AUTO_REFRESH_STOPPED: '自动刷新已停止',
            ACTIVATION_COMPLETE: '激活流程完成',
            LOWEST_PRICE_SELECTED: '已选择最低价:',
            BALANCE_CHECKED: '已勾选PY余额',
            NEXT_STEP_CLICKED: '已点击下一步',
            PAYMENT_CONFIRMED: '已确认支付',
            ACTIVATION_CLICKED: '已点击激活确认'
        },
        URL_PATTERNS: {
            GAME_LIST: /https:\/\/steampy\.com\/cdKey\/.*/,
            GAME_DETAIL: /https:\/\/steampy\.com\/cdkDetail\?name=cn&gameId=.*/,
            CHECKOUT: /https:\/\/steampy\.com\/cdkeyOrder\?.*/,
            ACTIVATION: /https:\/\/steampy\.com\/cdkLogin\?name=cn/,
            RESULT: /https:\/\/steampy\.com\/cdkResult\?name=cn/
        }
    };

    // ================== 配置部分 ====================
    const CONFIG = {
        version: '1.2',
        timing: {
            baseDelay: 200,
            mutationDebounce: 150,
            stepInterval: () => Math.max(GM_getValue('stepInterval', 300), 300),
            maxAttempts: 20,
            retryDelay: 400
        },
        activation: {
            maxRetries: 5, // 最大重试次数
            retryInterval: 2000, // 重试间隔(毫秒)
            timeout: 10000 // 超时时间(毫秒)
        },
        gameNameRetry: {
            maxRetries: 5,
            retryInterval: 1000,
            permanentRetry: false
        }
    };

    // ================== 工具函数 ====================
    const Utils = {
        /**
         * 标准的延迟函数
         * @param {number} ms - 延迟毫秒数
         * @returns {Promise<void>}
         */
        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        /**
         * 标准的防抖函数
         * @param {Function} func - 要防抖的函数
         * @param {number} wait - 延迟毫秒数
         * @returns {Function}
         */
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        },

        /**
         * 安全地执行函数并捕获错误
         * @param {Function} fn - 要执行的函数
         * @param {string} operationName - 操作名称（用于错误日志）
         * @returns {any} 函数执行结果
         */
        safeExecute(fn, operationName = '未知操作') {
            try {
                return fn();
            } catch (error) {
                console.error(`[SteamPY购物助手] ${operationName} 执行失败:`, error);
                return null;
            }
        },

        /**
         * 提取价格数值
         * @param {string} text - 包含价格的文本
         * @returns {number|null} 价格数值
         */
        extractPrice(text) {
            const match = text.match(/￥(\d+\.?\d*)/);
            return match ? parseFloat(match[1]) : null;
        }
    };

    // ================== 状态管理 ====================
    const State = {
        active: false,
        attempts: 0,
        lastAction: 0,
        currentUrl: window.location.href,
        currentGameId: null,
        currentGameName: null,
        pageLoadState: {
            isLoaded: false,
            lastLoadTime: 0
        },
        paymentState: {
            waitingForModal: false,
            modalDetected: false,
            paymentAttempted: false
        },
        activationState: {
            waitingForActivation: false,
            activationAttempted: false,
            activationRetries: 0,
            activationStartTime: 0,
            lastActivationAttempt: 0,
            hasTimeoutLogged: false, // 标记是否已记录超时
            activationCompleted: false // 标记激活是否完成
        }
    };

    // ================== 存储管理 ====================
    const StorageManager = {
        /**
         * 获取游戏特定设置
         * @param {string} key - 设置键名
         * @param {string} gameId - 游戏ID
         * @param {any} defaultValue - 默认值
         * @returns {any} 设置值
         */
        getGameSetting(key, gameId = State.currentGameId, defaultValue = null) {
            if (!gameId) return defaultValue;
            const fullKey = `${key}_${gameId}`;
            return GM_getValue(fullKey, defaultValue);
        },

        /**
         * 根据gameId存储游戏专属设置
         * @param {string} key - 设置键名
         * @param {any} value - 设置值
         * @param {string} gameId - 游戏ID
         * @returns {boolean} 是否存储成功
         */
        setGameSetting(key, value, gameId = State.currentGameId) {
            if (!gameId) return false;

            const fullKey = `${key}_${gameId}`;
            GM_setValue(fullKey, value);

            if (this.isAutoShoppingSetting(key)) {
                this.updateGameInfoWithCurrentName(gameId);
            }

            return true;
        },

        /**
         * 判断是否为自动购物设置
         * @param {string} key - 设置键名
         * @returns {boolean} 是否为自动购物设置
         */
        isAutoShoppingSetting(key) {
            const shoppingSettings = [
                'autoSelectLowestSwitch',
                'enableThresholdSwitch',
                'priceThreshold',
                'autoRefreshSwitch',
                'refreshInterval'
            ];
            return shoppingSettings.includes(key);
        },

        /**
         * 获取全局设置
         * @param {string} key - 设置键名
         * @param {any} defaultValue - 默认值
         * @returns {any} 设置值
         */
        getGlobalSetting(key, defaultValue = null) {
            return GM_getValue(key, defaultValue);
        },

        /**
         * 设置全局设置
         * @param {string} key - 设置键名
         * @param {any} value - 设置值
         */
        setGlobalSetting(key, value) {
            GM_setValue(key, value);
        },

        /**
         * 使用当前游戏名称更新游戏信息
         * @param {string} gameId - 游戏ID
         */
        updateGameInfoWithCurrentName(gameId) {
            if (!gameId || !State.currentGameName) {
                console.warn('[SteamPY购物助手] 无法更新游戏信息: 缺少游戏ID或名称');
                return;
            }

            // 尝试获取游戏名称，如果获取不到则不存储
            if (State.currentGameName.length > 100 || /<[^>]*>/.test(State.currentGameName) || State.currentGameName === '未知游戏') {
                console.warn('[SteamPY购物助手] 游戏名称格式异常，跳过存储:', State.currentGameName);
                return;
            }

            const gameInfo = this.getGameInfo(gameId) || {};

            if (!gameInfo.name || gameInfo.name !== State.currentGameName) {
                gameInfo.name = State.currentGameName;
                gameInfo.lastUpdated = Date.now();
                GM_setValue(`gameInfo_${gameId}`, gameInfo);
                console.log('[SteamPY购物助手] 游戏信息已存储:', { gameId, gameName: State.currentGameName });
            }
        },

        /**
         * 获取游戏信息
         * @param {string} gameId - 游戏ID
         * @returns {Object|null} 游戏信息对象
         */
        getGameInfo(gameId) {
            return GM_getValue(`gameInfo_${gameId}`, null);
        },

        /**
         * 获取所有游戏设置
         * @returns {Array} 游戏设置数组
         */
        getAllGameSettings() {
            const allValues = GM_listValues();
            const gameSettings = {};

            allValues.forEach(key => {
                const gameMatch = key.match(/^(.+)_([^_]+)$/);
                if (gameMatch) {
                    const settingKey = gameMatch[1];
                    const gameId = gameMatch[2];

                    if (!gameSettings[gameId]) {
                        const gameInfo = this.getGameInfo(gameId);
                        gameSettings[gameId] = {
                            id: gameId,
                            settings: {},
                            info: gameInfo,
                            timestamp: gameInfo?.lastUpdated || 0
                        };
                    }

                    if (settingKey !== 'gameInfo') {
                        gameSettings[gameId].settings[settingKey] = GM_getValue(key);
                    }
                }
            });

            // 按时间戳降序排序
            return Object.values(gameSettings).sort((a, b) => b.timestamp - a.timestamp);
        },

        /**
         * 删除特定游戏的设置
         * @param {string} gameId - 游戏ID
         */
        deleteGameSettings(gameId) {
            const allValues = GM_listValues();
            allValues.forEach(key => {
                if (key.endsWith(`_${gameId}`) || key === `gameInfo_${gameId}`) {
                    GM_deleteValue(key);
                }
            });
        },

        /**
         * 批量删除游戏设置
         * @param {Function} condition - 删除条件函数
         * @returns {Array} 被删除的游戏列表
         */
        batchDeleteGameSettings(condition) {
            const gameSettings = this.getAllGameSettings();
            const deletedGames = [];

            gameSettings.forEach(game => {
                const shouldDelete = condition(game);

                if (shouldDelete) {
                    this.deleteGameSettings(game.id);
                    deletedGames.push(game.info?.name || game.id);
                }
            });

            return deletedGames;
        },

        /**
         * 删除指定天数前的数据
         * @param {number} days - 天数
         * @returns {Array} 被删除的游戏列表
         */
        deleteDataByDays(days) {
            const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
            const condition = days === 0 ?
                (game) => {
                    const today = new Date();
                    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
                    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
                    return game.timestamp >= startOfDay && game.timestamp < endOfDay;
                } :
                (game) => game.timestamp < cutoff;

            return this.batchDeleteGameSettings(condition);
        }
    };

    // ================== 设置面板 ====================
    class SettingsPanel {
        static elements = {
            settingsPanel: null,
            headerButton: null,
            gameInfoDisplay: null
        };

        /**
         * 初始化设置面板
         */
        static init() {
            try {
                if (this.isPanelExist()) {
                    return;
                }

                GM_addStyle(this.generateStyles());
                this.createPanelStructure();
                this.bindDynamicEvents();
                this.initSavedValues();

                this.createGameInfoDisplay();
                this.createHeaderButton();

                console.debug('[SteamPY购物助手] 设置面板初始化完成');
            } catch (error) {
                console.error('[SteamPY购物助手] 面板初始化失败:', error);
            }
        }

        /**
         * 检查设置面板是否已存在
         * @returns {boolean} 是否存在
         */
        static isPanelExist() {
            return !!document.getElementById('steampySettingsPro');
        }

        /**
         * 生成CSS样式
         * @returns {string} CSS样式字符串
         */
        static generateStyles() {
            return `
                #steampySettingsPro {
                    position: fixed;
                    top: 20px;
                    right: 0;
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px 0 0 12px;
                    padding: 20px;
                    min-width: 350px;
                    z-index: 2147483647;
                    box-shadow: -4px 0 24px rgba(0,0,0,0.15);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateX(100%);
                    opacity: 1 !important;
                    visibility: visible !important;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                #steampySettingsPro.show {
                    transform: translateX(0) !important;
                }

                #steampySettingsPro * {
                    box-sizing: border-box !important;
                    font-family: system-ui, -apple-system, sans-serif !important;
                }

                .settings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #eee;
                }

                .settings-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .close-btn {
                    cursor: pointer;
                    font-size: 24px;
                    color: #95a5a6;
                    transition: color 0.2s;
                    user-select: none;
                    line-height: 1;
                }

                .close-btn:hover {
                    color: #e74c3c;
                }

                .settings-group {
                    margin: 16px 0;
                    padding: 16px;
                    background: #f9f9f9;
                    border-radius: 8px;
                }

                .settings-group-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #34495e;
                    margin-bottom: 12px;
                    display: block;
                }

                .switch-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 12px 0;
                }

                .range-input {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin: 15px 0;
                }

                .range-input input[type="range"] {
                    flex: 1;
                    height: 4px;
                    background: #ddd;
                    border-radius: 2px;
                }

                .number-input {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 10px 0;
                }

                .number-input input {
                    width: 80px;
                    padding: 4px 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                #stepIntervalValue {
                    min-width: 60px;
                    text-align: right;
                    color: #3498db;
                }

                .status-indicator {
                    margin-top: 15px;
                    font-size: 12px;
                    color: #7f8c8d;
                    text-align: center;
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 4px;
                }

                .game-id-display {
                    background: #e3f2fd;
                    padding: 6px 10px;
                    border-radius: 4px;
                    margin: 5px 0;
                    font-family: monospace;
                    font-size: 11px;
                    display: none;
                }

                .action-button {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    margin: 5px 0;
                    transition: background 0.2s;
                }

                .action-button:hover {
                    background: #2980b9;
                }

                .cleanup-panel {
                    display: none;
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 2147483648;
                    max-width: 90vw;
                    max-height: 80vh;
                    overflow: auto;
                }

                .cleanup-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .cleanup-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 10px 0;
                }

                .cleanup-table th, .cleanup-table td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }

                .cleanup-table th {
                    background: #f5f5f5;
                }

                .game-name-link {
                    color: #3498db;
                    cursor: pointer;
                    text-decoration: underline;
                }

                .game-name-link:hover {
                    color: #2980b9;
                }

                .bulk-actions {
                    margin: 15px 0;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .custom-cleanup {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 10px 0;
                }

                .custom-cleanup input {
                    width: 80px;
                    padding: 4px 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .tooltip {
                    position: relative;
                    display: inline-block;
                }

                .tooltip .tooltiptext {
                    visibility: hidden;
                    width: 200px;
                    background-color: #555;
                    color: #fff;
                    text-align: center;
                    border-radius: 6px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%;
                    left: 50%;
                    margin-left: -100px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    font-size: 12px;
                }

                .tooltip:hover .tooltiptext {
                    visibility: visible;
                    opacity: 1;
                }

                .header-settings-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent !important;
                    color: #515a6e !important;
                    border: 1px solid #dcdee2 !important;
                    border-radius: 4px;
                    padding: 2px !important;
                    margin-left: 8px !important;
                    margin-top: 2px !important;
                    cursor: pointer;
                    font-size: 16px !important;
                    transition: all 0.3s ease;
                    width: 22px !important;
                    height: 22px !important;
                    line-height: 1 !important;
                    position: relative !important;
                    top: 2px !important;
                }

                .header-settings-button:hover {
                    background: #f8f8f9 !important;
                    border-color: #c5c8ce !important;
                    color: #515a6e !important;
                }
            `;
        }

        /**
         * 创建面板结构
         */
        static createPanelStructure() {
            const panel = document.createElement('div');
            panel.id = 'steampySettingsPro';
            panel.innerHTML = this.generatePanelHTML();
            document.body.appendChild(panel);
            this.elements.settingsPanel = panel;

            this.createCleanupPanel();
        }

        /**
         * 生成面板HTML
         * @returns {string} 面板HTML字符串
         */
        static generatePanelHTML() {
            const currentGameId = State.currentGameId;
            const currentGameName = State.currentGameName;

            const autoSelectLowest = currentGameId ?
                StorageManager.getGameSetting('autoSelectLowestSwitch', currentGameId, false) :
                StorageManager.getGlobalSetting('autoSelectLowestSwitch', false);

            const enableThreshold = currentGameId ?
                StorageManager.getGameSetting('enableThresholdSwitch', currentGameId, false) :
                StorageManager.getGlobalSetting('enableThresholdSwitch', false);

            const priceThreshold = currentGameId ?
                StorageManager.getGameSetting('priceThreshold', currentGameId, '') :
                StorageManager.getGlobalSetting('priceThreshold', '');

            const autoRefresh = currentGameId ?
                StorageManager.getGameSetting('autoRefreshSwitch', currentGameId, false) :
                StorageManager.getGlobalSetting('autoRefreshSwitch', false);

            const refreshInterval = currentGameId ?
                StorageManager.getGameSetting('refreshInterval', currentGameId, 30) :
                StorageManager.getGlobalSetting('refreshInterval', 30);

            const autoActivation = StorageManager.getGlobalSetting('autoActivationSwitch', false);

            return `
                <div class="settings-header">
                    <span class="settings-title">⚙️ SteamPY购物助手 v${CONFIG.version}</span>
                    <span class="close-btn">×</span>
                </div>

                <div class="settings-group">
                    <span class="settings-group-title">💰 自动支付设置</span>
                    ${this.generateSwitch('autoClickSwitch', '自动勾选PY余额抵现', true, true)}
                    ${this.generateSwitch('nextStepSwitch', '自动点击下一步', true, true)}
                    ${this.generateSwitch('paySwitch', '自动点击支付(⚠️注意风险)', false, true)}
                    ${this.generateSwitch('autoActivationSwitch', '自动确认激活(提前steam登录账号)', autoActivation, true)}
                </div>

                <div class="settings-group">
                    <span class="settings-group-title">🛒 自动购物设置</span>
                    ${this.generateSwitch('autoSelectLowestSwitch', '自动选择最低单价', autoSelectLowest, false)}

                    <div class="number-input">
                        <input type="number" id="priceThreshold" step="0.01" min="0" placeholder="价格阈值" value="${priceThreshold}">
                        <label for="priceThreshold">价格阈值</label>
                    </div>
                    ${this.generateSwitch('enableThresholdSwitch', '启用价格阈值筛选(仅当价格低于阈值时自动选择)', enableThreshold, false)}

                    <div class="number-input">
                        <input type="number" id="refreshInterval" min="5" max="300" step="5" placeholder="刷新间隔" value="${refreshInterval}">
                        <label for="refreshInterval">自动刷新间隔(秒)</label>
                    </div>
                    ${this.generateSwitch('autoRefreshSwitch', '自动刷新页面(寻找符合要求的新订单)', autoRefresh, false)}

                    <button class="action-button" id="cleanupSettingsBtn">清理存储数据</button>
                </div>

                <div class="settings-group">
                    <span class="settings-group-title">⚡ 性能设置</span>
                    <div class="range-input">
                        <span>检测间隔:</span>
                        <input type="range" id="stepInterval" min="300" max="1500" step="100">
                        <output id="stepIntervalValue">${StorageManager.getGlobalSetting('stepInterval', 300)}ms</output>
                    </div>
                </div>

                <div class="status-indicator">
                    状态: <span id="statusIndicator">🟢 运行中</span>
                    <br>
                    <small>当前页面: <span id="currentPageIndicator">${PageMonitor.getCurrentPageType()}</span></small>
                    <div id="gameInfoDisplayContainer"></div>
                    <div id="refreshStatus"></div>
                </div>
            `;
        }

        /**
         * 生成开关控件HTML
         * @param {string} id - 控件ID
         * @param {string} label - 标签文本
         * @param {boolean} defaultValue - 默认值
         * @param {boolean} isGlobal - 是否为全局设置
         * @returns {string} 开关控件HTML
         */
        static generateSwitch(id, label, defaultValue, isGlobal = false) {
            const checked = defaultValue ? 'checked' : '';
            const dataAttr = isGlobal ? 'data-global="true"' : '';
            return `
                <div class="switch-container">
                    <input type="checkbox" id="${id}" ${checked} ${dataAttr}>
                    <label for="${id}" style="cursor:pointer;">${label}</label>
                </div>
            `;
        }

        /**
         * 创建游戏信息显示元素
         */
        static createGameInfoDisplay() {
            const container = document.getElementById('gameInfoDisplayContainer');
            if (container && !this.elements.gameInfoDisplay) {
                const gameInfoDisplay = document.createElement('div');
                gameInfoDisplay.className = 'game-id-display';
                gameInfoDisplay.id = 'gameInfoDisplay';
                gameInfoDisplay.style.display = 'none';
                container.appendChild(gameInfoDisplay);
                this.elements.gameInfoDisplay = gameInfoDisplay;
            }
        }

        /**
         * 创建头部设置按钮
         */
        static createHeaderButton() {
            const tryCreateHeaderButton = () => {
                const messageCon = document.querySelector('.message-con');
                if (messageCon && messageCon.parentNode) {
                    const headerButton = document.createElement('button');
                    headerButton.className = 'header-settings-button';
                    headerButton.innerHTML = '⚙️';
                    headerButton.title = '下单助手设置';
                    headerButton.addEventListener('click', () => {
                        this.showPanel();
                    });

                    messageCon.parentNode.insertBefore(headerButton, messageCon.nextSibling);
                    this.elements.headerButton = headerButton;
                    console.debug('[SteamPY购物助手] 头部按钮创建成功');
                } else {
                    setTimeout(tryCreateHeaderButton, 500);
                }
            };

            setTimeout(tryCreateHeaderButton, 1000);
        }

        /**
         * 创建清理面板
         */
        static createCleanupPanel() {
            const cleanupPanel = document.createElement('div');
            cleanupPanel.id = 'cleanupPanel';
            cleanupPanel.className = 'cleanup-panel';
            cleanupPanel.innerHTML = `
                <div class="cleanup-header">
                    <h3>存储数据清理</h3>
                    <span class="close-btn" id="closeCleanupPanel">×</span>
                </div>
                <div class="bulk-actions">
                    <button class="action-button" id="cleanup1Month">清理1个月前数据</button>
                    <button class="action-button" id="cleanup6Months">清理半年前数据</button>
                    <button class="action-button" id="cleanup1Year">清理1年前数据</button>
                    <button class="action-button" id="cleanupAll" style="background:#e74c3c;">清理所有数据</button>
                </div>
                <div class="custom-cleanup">
                    <input type="number" id="customDays" step="1" min="0" placeholder="天数" value="30">
                    <button class="action-button tooltip" id="cleanupCustom">
                        自定义清理
                        <span class="tooltiptext">输入0清理今天的数据，输入其他数字清理多少天前的数据</span>
                    </button>
                </div>
                <table class="cleanup-table">
                    <thead>
                        <tr>
                            <th>游戏名称</th>
                            <th>游戏ID</th>
                            <th>最后更新</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="cleanupTableBody">
                    </tbody>
                </table>
            `;
            document.body.appendChild(cleanupPanel);

            this.bindCleanupPanelEvents();
        }

        /**
         * 绑定清理面板事件
         */
        static bindCleanupPanelEvents() {
            const cleanupPanel = document.getElementById('cleanupPanel');
            const closeBtn = document.getElementById('closeCleanupPanel');

            closeBtn.addEventListener('click', () => {
                cleanupPanel.style.display = 'none';
            });

            document.getElementById('cleanup1Month').addEventListener('click', () => {
                this.bulkCleanup(30);
            });

            document.getElementById('cleanup6Months').addEventListener('click', () => {
                this.bulkCleanup(180);
            });

            document.getElementById('cleanup1Year').addEventListener('click', () => {
                this.bulkCleanup(365);
            });

            document.getElementById('cleanupAll').addEventListener('click', () => {
                if (confirm('确定要删除所有游戏设置数据吗？此操作不可恢复！')) {
                    this.bulkCleanup(0, true);
                }
            });

            document.getElementById('cleanupCustom').addEventListener('click', () => {
                const daysInput = document.getElementById('customDays');
                const days = parseInt(daysInput.value) || 0;
                if (days < 0) {
                    alert('请输入有效的天数（0或正整数）');
                    return;
                }

                const message = days === 0 ?
                    '确定要删除今天的所有数据吗？' :
                    `确定要删除${days}天前的所有数据吗？`;

                if (confirm(message)) {
                    this.bulkCleanup(days, false, true);
                }
            });

            cleanupPanel.addEventListener('click', (e) => {
                if (e.target === cleanupPanel) {
                    cleanupPanel.style.display = 'none';
                }
            });
        }

        /**
         * 显示清理面板
         */
        static showCleanupPanel() {
            const cleanupPanel = document.getElementById('cleanupPanel');
            this.updateCleanupTable();
            cleanupPanel.style.display = 'block';
        }

        /**
         * 更新清理表格
         */
        static updateCleanupTable() {
            const cleanupTableBody = document.getElementById('cleanupTableBody');
            const gameSettings = StorageManager.getAllGameSettings();

            cleanupTableBody.innerHTML = '';

            gameSettings.forEach(game => {
                const row = document.createElement('tr');
                const gameName = game.info?.name || '未知游戏';
                const lastUpdated = game.info?.lastUpdated ?
                    new Date(game.info.lastUpdated).toLocaleDateString() : '未知';

                row.innerHTML = `
                    <td>
                        <span class="game-name-link" data-game-id="${game.id}">${gameName}</span>
                    </td>
                    <td>${game.id}</td>
                    <td>${lastUpdated}</td>
                    <td>
                        <button class="action-button delete-game" data-game-id="${game.id}">删除</button>
                    </td>
                `;

                cleanupTableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-game').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const gameId = e.target.getAttribute('data-game-id');
                    this.deleteGameSettings(gameId);
                });
            });

            document.querySelectorAll('.game-name-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    const gameId = e.target.getAttribute('data-game-id');
                    this.navigateToGame(gameId);
                });
            });
        }

        /**
         * 删除游戏设置
         * @param {string} gameId - 游戏ID
         */
        static deleteGameSettings(gameId) {
            if (confirm('确定要删除此游戏的设置数据吗？')) {
                StorageManager.deleteGameSettings(gameId);
                this.updateCleanupTable();
                this.showNotification('游戏设置已删除');
            }
        }

        /**
         * 批量清理数据
         * @param {number} days - 天数
         * @param {boolean} isAll - 是否清理所有数据
         * @param {boolean} isCustom - 是否为自定义清理
         */
        static bulkCleanup(days, isAll = false, isCustom = false) {
            let deletedGames;
            let message;

            if (isAll) {
                deletedGames = StorageManager.batchDeleteGameSettings(() => true);
                message = '所有数据';
            } else if (isCustom) {
                deletedGames = StorageManager.deleteDataByDays(days);
                message = days === 0 ? '今天的数据' : `${days}天前的数据`;
            } else {
                deletedGames = StorageManager.batchDeleteGameSettings((game) => {
                    const lastUpdated = game.info?.lastUpdated;
                    if (!lastUpdated) return false;
                    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
                    return lastUpdated < cutoff;
                });
                message = `${days}天前的数据`;
            }

            if (deletedGames.length > 0) {
                this.showNotification(`已删除 ${deletedGames.length} 个游戏的${message}`);
                this.updateCleanupTable();
            } else {
                this.showNotification(`没有找到${message}`);
            }
        }

        /**
         * 跳转到游戏页面
         * @param {string} gameId - 游戏ID
         */
        static navigateToGame(gameId) {
            window.location.href = `https://steampy.com/cdkDetail?name=cn&gameId=${gameId}`;
        }

        /**
         * 绑定动态事件
         */
        static bindDynamicEvents() {
            const panel = this.elements.settingsPanel;

            panel.querySelector('.close-btn').addEventListener('click', () => {
                this.hidePanel();
            });

            document.getElementById('cleanupSettingsBtn').addEventListener('click', () => {
                this.showCleanupPanel();
            });

            panel.querySelectorAll('input[type="checkbox"]').forEach(input => {
                input.addEventListener('change', e => {
                    const isGlobal = e.target.hasAttribute('data-global');

                    if (isGlobal) {
                        StorageManager.setGlobalSetting(e.target.id, e.target.checked);
                    } else {
                        if (State.currentGameId) {
                            StorageManager.setGameSetting(e.target.id, e.target.checked, State.currentGameId);
                        } else {
                            StorageManager.setGlobalSetting(e.target.id, e.target.checked);
                        }
                    }

                    this.showNotification(`${CONSTANTS.NOTIFICATIONS.SETTINGS_UPDATED} ${e.target.nextElementSibling.textContent}`);

                    if (e.target.id === 'enableThresholdSwitch') {
                        const thresholdInput = document.getElementById('priceThreshold');
                        if (thresholdInput) {
                            thresholdInput.disabled = !e.target.checked;
                        }
                    } else if (e.target.id === 'autoRefreshSwitch') {
                        AutoRefreshManager.toggleAutoRefresh();
                    } else if (e.target.id === 'autoSelectLowestSwitch') {
                        if (!e.target.checked) {
                            State.attempts = 0;
                        }
                    }
                });
            });

            const rangeInput = panel.querySelector('#stepInterval');
            rangeInput.value = StorageManager.getGlobalSetting('stepInterval', 300);
            rangeInput.addEventListener('input', e => {
                const value = e.target.value;
                panel.querySelector('#stepIntervalValue').textContent = `${value}ms`;
                StorageManager.setGlobalSetting('stepInterval', Number(value));
            });

            const thresholdInput = panel.querySelector('#priceThreshold');
            thresholdInput.addEventListener('change', e => {
                if (State.currentGameId) {
                    StorageManager.setGameSetting('priceThreshold', e.target.value, State.currentGameId);
                } else {
                    StorageManager.setGlobalSetting('priceThreshold', e.target.value);
                }
            });

            const refreshInput = panel.querySelector('#refreshInterval');
            refreshInput.addEventListener('change', e => {
                const value = Math.max(5, parseInt(e.target.value) || 30);
                if (State.currentGameId) {
                    StorageManager.setGameSetting('refreshInterval', value, State.currentGameId);
                } else {
                    StorageManager.setGlobalSetting('refreshInterval', value);
                }
                AutoRefreshManager.updateRefreshTimer();
            });

            const enableThreshold = State.currentGameId ?
                StorageManager.getGameSetting('enableThresholdSwitch', State.currentGameId, false) :
                StorageManager.getGlobalSetting('enableThresholdSwitch', false);
            thresholdInput.disabled = !enableThreshold;
        }

        /**
         * 初始化保存的值
         */
        static initSavedValues() {
            const interval = StorageManager.getGlobalSetting('stepInterval', 300);
            const rangeInput = document.querySelector('#stepInterval');
            if (rangeInput) {
                rangeInput.value = interval;
            }
        }

        /**
         * 显示通知
         * @param {string} message - 通知消息
         */
        static showNotification(message) {
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: 'SteamPY助手',
                    text: message,
                    timeout: 2000
                });
            } else {
                console.log('[SteamPY购物助手]', message);
            }
        }

        /**
         * 显示面板
         */
        static showPanel() {
            if (!this.elements.settingsPanel) {
                this.init();
            }

            const panel = this.elements.settingsPanel || document.getElementById('steampySettingsPro');
            if (!panel) {
                console.error('[SteamPY购物助手] 设置面板未找到');
                return;
            }

            this.updatePanelContent();
            panel.classList.add('show');
        }

        /**
         * 隐藏面板
         */
        static hidePanel() {
            const panel = this.elements.settingsPanel || document.getElementById('steampySettingsPro');
            if (panel) {
                panel.classList.remove('show');
            }
        }

        /**
         * 更新面板内容
         */
        static updatePanelContent() {
            const panel = document.getElementById('steampySettingsPro');
            if (!panel) return;

            this.updatePageInfo();
            this.updateGameSpecificSettings();
        }

        /**
         * 更新状态指示器
         * @param {string} message - 状态消息
         */
        static updateStatus(message) {
            const indicator = document.getElementById('statusIndicator');
            if (indicator) {
                indicator.textContent = message;
            }
        }

        /**
         * 更新页面信息
         */
        static updatePageInfo() {
            const pageIndicator = document.getElementById('currentPageIndicator');
            if (pageIndicator) {
                pageIndicator.textContent = PageMonitor.getCurrentPageType();
            }

            // 更新游戏信息显示
            this.updateGameInfoDisplay();
        }

        /**
         * 更新游戏信息显示
         */
        static updateGameInfoDisplay() {
            const gameInfoDisplay = this.elements.gameInfoDisplay || document.getElementById('gameInfoDisplay');
            if (gameInfoDisplay) {
                const pageType = PageMonitor.getCurrentPageType();
                // 在激活页面和结果页面不显示游戏信息
                const shouldShow = (pageType === '游戏详情页' || pageType === '结账页面') && State.currentGameId;

                if (shouldShow) {
                    gameInfoDisplay.innerHTML = `
                        游戏ID: ${State.currentGameId}<br>
                        ${State.currentGameName ? `游戏名称: ${State.currentGameName}` : '正在获取名称...'}
                    `;
                    gameInfoDisplay.style.display = 'block';
                } else {
                    gameInfoDisplay.style.display = 'none';
                }
            }
        }

        /**
         * 更新游戏特定设置
         */
        static updateGameSpecificSettings() {
            const autoSelectCheckbox = document.getElementById('autoSelectLowestSwitch');
            const enableThresholdCheckbox = document.getElementById('enableThresholdSwitch');
            const priceThresholdInput = document.getElementById('priceThreshold');
            const autoRefreshCheckbox = document.getElementById('autoRefreshSwitch');
            const refreshIntervalInput = document.getElementById('refreshInterval');

            if (!State.currentGameId) {
                const autoSelectLowest = StorageManager.getGlobalSetting('autoSelectLowestSwitch', false);
                const enableThreshold = StorageManager.getGlobalSetting('enableThresholdSwitch', false);
                const priceThreshold = StorageManager.getGlobalSetting('priceThreshold', '');
                const autoRefresh = StorageManager.getGlobalSetting('autoRefreshSwitch', false);
                const refreshInterval = StorageManager.getGlobalSetting('refreshInterval', 30);

                if (autoSelectCheckbox) autoSelectCheckbox.checked = autoSelectLowest;
                if (enableThresholdCheckbox) enableThresholdCheckbox.checked = enableThreshold;
                if (priceThresholdInput) {
                    priceThresholdInput.value = priceThreshold;
                    priceThresholdInput.disabled = !enableThreshold;
                }
                if (autoRefreshCheckbox) autoRefreshCheckbox.checked = autoRefresh;
                if (refreshIntervalInput) refreshIntervalInput.value = refreshInterval;
                return;
            }

            const autoSelectLowest = StorageManager.getGameSetting('autoSelectLowestSwitch', State.currentGameId, false);
            const enableThreshold = StorageManager.getGameSetting('enableThresholdSwitch', State.currentGameId, false);
            const priceThreshold = StorageManager.getGameSetting('priceThreshold', State.currentGameId, '');
            const autoRefresh = StorageManager.getGameSetting('autoRefreshSwitch', State.currentGameId, false);
            const refreshInterval = StorageManager.getGameSetting('refreshInterval', State.currentGameId, 30);

            if (autoSelectCheckbox) autoSelectCheckbox.checked = autoSelectLowest;
            if (enableThresholdCheckbox) enableThresholdCheckbox.checked = enableThreshold;
            if (priceThresholdInput) {
                priceThresholdInput.value = priceThreshold;
                priceThresholdInput.disabled = !enableThreshold;
            }
            if (autoRefreshCheckbox) autoRefreshCheckbox.checked = autoRefresh;
            if (refreshIntervalInput) refreshIntervalInput.value = refreshInterval;
        }

        /**
         * 更新刷新状态
         * @param {string} message - 刷新状态消息
         */
        static updateRefreshStatus(message) {
            const refreshStatus = document.getElementById('refreshStatus');
            if (refreshStatus) {
                refreshStatus.innerHTML = `<small>${message}</small>`;
            }
        }
    }

    // ================== 自动刷新管理 ==================
    const AutoRefreshManager = {
        isActive: false,
        timer: null,

        /**
         * 初始化自动刷新管理器
         */
        init() {
            this.checkAutoRefresh();
        },

        /**
         * 检查是否需要自动刷新
         */
        checkAutoRefresh() {
            if (PageMonitor.getCurrentPageType() !== '游戏详情页' || !State.currentGameId) {
                this.stopAutoRefresh();
                return;
            }

            const autoRefresh = StorageManager.getGameSetting('autoRefreshSwitch', State.currentGameId, false);
            if (autoRefresh) {
                this.startAutoRefresh();
            } else {
                this.stopAutoRefresh();
            }
        },

        /**
         * 开始自动刷新
         */
        startAutoRefresh() {
            if (this.isActive) return;

            this.isActive = true;
            this.updateRefreshTimer();
            SettingsPanel.updateRefreshStatus('🔄 自动刷新已开启');
        },

        /**
         * 停止自动刷新
         */
        stopAutoRefresh() {
            this.isActive = false;
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            SettingsPanel.updateRefreshStatus('⏹️ 自动刷新已停止');
        },

        /**
         * 更新刷新计时器
         */
        updateRefreshTimer() {
            if (!this.isActive) return;

            if (this.timer) {
                clearTimeout(this.timer);
            }

            const refreshInterval = State.currentGameId ?
                StorageManager.getGameSetting('refreshInterval', State.currentGameId, 30) :
                StorageManager.getGlobalSetting('refreshInterval', 30);

            const intervalMs = refreshInterval * 1000;

            this.timer = setTimeout(() => {
                if (this.isActive && PageMonitor.getCurrentPageType() === '游戏详情页') {
                    SettingsPanel.updateRefreshStatus('🔄 正在刷新页面...');
                    window.location.reload();
                }
            }, intervalMs);

            const nextRefresh = new Date(Date.now() + intervalMs);
            SettingsPanel.updateRefreshStatus(`🔄 下次刷新: ${nextRefresh.toLocaleTimeString()}`);
        },

        /**
         * 切换自动刷新状态
         */
        toggleAutoRefresh() {
            if (PageMonitor.getCurrentPageType() !== '游戏详情页' || !State.currentGameId) {
                SettingsPanel.showNotification('自动刷新仅在游戏详情页可用');
                return;
            }

            const autoRefresh = StorageManager.getGameSetting('autoRefreshSwitch', State.currentGameId, false);
            if (autoRefresh) {
                this.startAutoRefresh();
            } else {
                this.stopAutoRefresh();
            }
        }
    };

    // ================== 页面监控 ==================
    const PageMonitor = {
        observer: null,

        /**
         * 初始化页面监控系统
         */
        init() {
            this.initUrlMonitor();
            this.initMutationObserver();
            this.bindPageEvents();

            console.log('[SteamPY购物助手] 页面监控系统已启动');
        },

        /**
         * 初始化URL监控
         */
        initUrlMonitor() {
            State.currentUrl = window.location.href;
            this.updateGameInfoFromUrl(State.currentUrl);

            let lastUrl = window.location.href;
            const urlObserver = new MutationObserver(() => {
                const url = window.location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    this.handleUrlChange(url);
                }
            });
            urlObserver.observe(document, { subtree: true, childList: true });

            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function(state, title, url) {
                originalPushState.apply(this, arguments);
                PageMonitor.handleUrlChange(window.location.href);
            };

            history.replaceState = function(state, title, url) {
                originalReplaceState.apply(this, arguments);
                PageMonitor.handleUrlChange(window.location.href);
            };

            window.addEventListener('popstate', () => {
                PageMonitor.handleUrlChange(window.location.href);
            });
        },

        /**
         * 处理URL变化
         * @param {string} newUrl - 新的URL
         */
        handleUrlChange(newUrl) {
            if (newUrl === State.currentUrl) return;

            console.log('[SteamPY购物助手] 检测到URL变化:', newUrl);
            State.currentUrl = newUrl;

            this.updateGameInfoFromUrl(newUrl);

            State.attempts = 0;
            State.paymentState = {
                waitingForModal: false,
                modalDetected: false,
                paymentAttempted: false
            };

            if (!CONSTANTS.URL_PATTERNS.RESULT.test(newUrl)) {
                State.activationState = {
                    waitingForActivation: false,
                    activationAttempted: false,
                    activationRetries: 0,
                    activationStartTime: 0,
                    lastActivationAttempt: 0,
                    hasTimeoutLogged: false,
                    activationCompleted: false
                };
            }

            SettingsPanel.updatePageInfo();
            SettingsPanel.updateStatus('🔄 页面切换中...');

            SettingsPanel.updateGameSpecificSettings();

            AutoRefreshManager.checkAutoRefresh();

            State.pageLoadState.isLoaded = false;
            setTimeout(() => {
                State.pageLoadState.isLoaded = true;
                State.pageLoadState.lastLoadTime = Date.now();
                OperationEngine.execute();
            }, 300);
        },

        /**
         * 从URL更新游戏信息
         * @param {string} url - 当前URL
         */
        updateGameInfoFromUrl(url) {
            const oldGameId = State.currentGameId;
            const oldGameName = State.currentGameName;

            if (CONSTANTS.URL_PATTERNS.GAME_DETAIL.test(url)) {
                State.currentGameId = this.extractGameId(url);

                if (State.currentGameId) {
                    SettingsPanel.updatePageInfo();
                    this.tryExtractGameNameImmediately();
                } else {
                    State.currentGameName = null;
                }
            } else if (CONSTANTS.URL_PATTERNS.CHECKOUT.test(url)) {
                if (!State.currentGameId) {
                    State.currentGameId = this.extractGameId(url);
                }
            } else if (CONSTANTS.URL_PATTERNS.ACTIVATION.test(url)) {
                State.currentGameId = null;
                State.currentGameName = null;
                State.activationState.waitingForActivation = true;
                State.activationState.activationStartTime = Date.now();
            } else if (CONSTANTS.URL_PATTERNS.RESULT.test(url)) {
                State.currentGameId = null;
                State.currentGameName = null;
                State.activationState.activationCompleted = true;
                SettingsPanel.updateStatus('✅ 激活完成');
            } else {
                State.currentGameId = null;
                State.currentGameName = null;
            }

            if (State.currentGameId !== oldGameId || State.currentGameName !== oldGameName) {
                console.log('[SteamPY购物助手] 游戏信息变化:', {
                    oldId: oldGameId,
                    newId: State.currentGameId,
                    oldName: oldGameName,
                    newName: State.currentGameName
                });
            }

            SettingsPanel.updatePageInfo();
        },

        /**
         * 从URL提取游戏ID
         * @param {string} url - URL
         * @returns {string|null} 游戏ID
         */
        extractGameId(url) {
            const match = url.match(/gameId=([^&]+)/);
            return match ? match[1] : null;
        },

        /**
         * 立即尝试提取游戏名称
         */
        tryExtractGameNameImmediately() {
            if (this.getCurrentPageType() !== '游戏详情页') {
                return;
            }

            this.tryExtractGameName();
        },

        /**
         * 尝试提取游戏名称
         * @param {number} attempts - 当前尝试次数
         */
        async tryExtractGameName(attempts = 0) {
            // 如果是激活页面或结果页面，不尝试获取游戏名称
            if (this.getCurrentPageType() === '激活页面' || this.getCurrentPageType() === '结果页面') {
                return;
            }

            let gameNameElement = document.querySelector(CONSTANTS.CSS_SELECTORS.GAME_NAME_PRIMARY);

            if (!gameNameElement) {
                gameNameElement = document.querySelector(CONSTANTS.CSS_SELECTORS.GAME_NAME_FALLBACK_1);
            }
            if (!gameNameElement) {
                gameNameElement = document.querySelector(CONSTANTS.CSS_SELECTORS.GAME_NAME_FALLBACK_2);
            }

            if (gameNameElement) {
                const gameName = gameNameElement.textContent.trim();

                if (gameName && this.isValidDetailPageGameName(gameNameElement)) {
                    console.log('[SteamPY购物助手] 提取到有效游戏名称:', gameName);
                    State.currentGameName = gameName;
                    SettingsPanel.updatePageInfo();
                    return;
                }
            }

            if (attempts < CONFIG.gameNameRetry.maxRetries) {
                console.log(`[SteamPY购物助手] 第${attempts + 1}次尝试获取游戏名称...`);
                await Utils.delay(CONFIG.gameNameRetry.retryInterval);
                return this.tryExtractGameName(attempts + 1);
            } else {
                console.warn(`[SteamPY购物助手] 未找到有效的游戏名称元素，已尝试${attempts}次`);
                SettingsPanel.showNotification(CONSTANTS.NOTIFICATIONS.CANNOT_GET_NAME);
            }
        },

        /**
         * 检查是否为有效的详情页游戏名称元素
         * @param {Element} element - 游戏名称元素
         * @returns {boolean} 是否有效
         */
        isValidDetailPageGameName(element) {
            const isInGameBlock = element.closest('.gameblock');
            if (isInGameBlock) {
                return false;
            }

            const isInFlexRow = element.closest('.flex-row.jc-space-flex-start');
            if (isInFlexRow) {
                return false;
            }

            const nextElement = element.nextElementSibling;
            if (nextElement && nextElement.textContent && nextElement.textContent.includes('store.steampowered.com')) {
                return true;
            }

            const priceElements = element.parentElement?.querySelectorAll(CONSTANTS.CSS_SELECTORS.PRICE_ELEMENT);
            if (priceElements && priceElements.length > 0) {
                return true;
            }

            if (element.classList.contains('fw-b') && element.classList.contains('ml-50')) {
                return true;
            }

            const isInDetailContainer = element.closest('.ht100.mt-50');
            if (isInDetailContainer) {
                return true;
            }

            return false;
        },

        /**
         * 获取当前页面类型
         * @returns {string} 页面类型
         */
        getCurrentPageType() {
            const url = State.currentUrl;
            if (CONSTANTS.URL_PATTERNS.GAME_LIST.test(url)) return '游戏列表页';
            if (CONSTANTS.URL_PATTERNS.GAME_DETAIL.test(url)) return '游戏详情页';
            if (CONSTANTS.URL_PATTERNS.CHECKOUT.test(url)) return '结账页面';
            if (CONSTANTS.URL_PATTERNS.ACTIVATION.test(url)) return '激活页面';
            if (CONSTANTS.URL_PATTERNS.RESULT.test(url)) return '结果页面';
            return '其他页面';
        },

        /**
         * 初始化DOM变化观察器
         */
        initMutationObserver() {
            const debouncedExecute = Utils.debounce(OperationEngine.execute.bind(OperationEngine), CONFIG.timing.mutationDebounce);

            this.observer = new MutationObserver(mutations => {
                if (!State.pageLoadState.isLoaded) return;

                const relevantChanges = mutations.some(mutation => {
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                const element = node;
                                if (element.matches && (
                                    element.matches(CONSTANTS.CSS_SELECTORS.PRICE_ROW) ||
                                    element.matches(CONSTANTS.CSS_SELECTORS.GAME_NAME_PRIMARY) ||
                                    element.matches(CONSTANTS.CSS_SELECTORS.BUY_BUTTON) ||
                                    element.matches(CONSTANTS.CSS_SELECTORS.BALANCE_CHECKBOX) ||
                                    element.matches(CONSTANTS.CSS_SELECTORS.MODAL_WRAP)
                                )) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                });

                if (relevantChanges) {
                    debouncedExecute();
                }
            });

            setTimeout(() => {
                if (document.body) {
                    this.observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class', 'style', 'disabled', 'checked']
                    });
                }
            }, 1000);
        },

        /**
         * 绑定页面事件
         */
        bindPageEvents() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.onPageReady();
                });
            } else {
                this.onPageReady();
            }

            window.addEventListener('load', () => {
                this.onPageFullLoad();
            });
        },

        /**
         * 页面准备就绪时的处理
         */
        onPageReady() {
            SettingsPanel.init();
            AutoRefreshManager.init();

            setTimeout(() => {
                State.pageLoadState.isLoaded = true;
                State.pageLoadState.lastLoadTime = Date.now();
                OperationEngine.execute();
            }, 600);
        },

        /**
         * 页面完全加载时的处理
         */
        onPageFullLoad() {
            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand('⚙️ 打开SteamPY助手设置', () => {
                    SettingsPanel.showPanel();
                });
            }

            console.log('[SteamPY购物助手] 系统完全加载完成');
        }
    };

    // ================== 操作引擎 ==================
    const OperationEngine = {
        /**
         * 执行主操作流程
         */
        async execute() {
            if (this.shouldSkip()) return;

            State.active = true;
            State.attempts++;

            try {
                SettingsPanel.updateStatus('🔍 检测页面元素...');
                await this.processByPageType();
            } catch (error) {
                console.error('[SteamPY购物助手] 执行异常:', error);
            } finally {
                State.active = false;
                this.scheduleNext();
            }
        },

        /**
         * 根据页面类型处理不同操作
         */
        async processByPageType() {
            const pageType = PageMonitor.getCurrentPageType();

            switch(pageType) {
                case '游戏详情页':
                    await this.processGameDetailPage();
                    break;
                case '结账页面':
                    await this.processCheckoutPage();
                    break;
                case '激活页面':
                    await this.processActivationPage();
                    break;
                case '结果页面':
                    SettingsPanel.updateStatus('✅ 激活流程完成');
                    break;
                default:
                    break;
            }
        },

        /**
         * 处理游戏详情页
         * @returns {Promise<boolean>} 是否执行了操作
         */
        async processGameDetailPage() {
            try {
                const autoSelectLowest = State.currentGameId ?
                    StorageManager.getGameSetting('autoSelectLowestSwitch', State.currentGameId, false) :
                    StorageManager.getGlobalSetting('autoSelectLowestSwitch', false);

                if (!autoSelectLowest) return false;

                const priceRows = document.querySelectorAll(CONSTANTS.CSS_SELECTORS.PRICE_ROW);
                if (!priceRows || priceRows.length === 0) {
                    SettingsPanel.updateStatus('⚠️ 价格列表未加载或选择器失效');
                    return false;
                }

                const result = await this.findLowestPriceAndSelect(priceRows);
                if (result) {
                    State.lastAction = Date.now();
                }
                return result;
            } catch (error) {
                console.error('[SteamPY购物助手] 处理游戏详情页失败:', error);
                return false;
            }
        },

        /**
         * 查找最低价并选择
         * @param {NodeListOf<Element>} priceRows - 价格行 DOM 列表
         * @returns {Promise<boolean>} 是否选择成功
         */
        async findLowestPriceAndSelect(priceRows) {
            let lowestPrice = Infinity;
            let lowestPriceRow = null;

            for (const row of priceRows) {
                try {
                    const priceElement = row.querySelector('[class*="Price"], [class*="price"]');
                    const buyButton = row.querySelector('button');

                    if (priceElement && buyButton) {
                        const price = Utils.extractPrice(priceElement.textContent);
                        if (price !== null && price < lowestPrice) {
                            lowestPrice = price;
                            lowestPriceRow = row;
                        }
                    }
                } catch (error) {
                    console.error('[SteamPY购物助手] 处理价格行时出错:', error);
                }
            }

            if (!lowestPriceRow) return false;

            const enableThreshold = State.currentGameId ?
                StorageManager.getGameSetting('enableThresholdSwitch', State.currentGameId, false) :
                StorageManager.getGlobalSetting('enableThresholdSwitch', false);

            const threshold = State.currentGameId ?
                parseFloat(StorageManager.getGameSetting('priceThreshold', State.currentGameId, '0')) :
                parseFloat(StorageManager.getGlobalSetting('priceThreshold', '0'));

            if (enableThreshold && lowestPrice > threshold) {
                SettingsPanel.updateStatus(`⏹️ 价格 ${lowestPrice} 高于阈值 ${threshold}`);
                return false;
            }

            if (this.clickPriceRow(lowestPriceRow)) {
                SettingsPanel.updateStatus(`${CONSTANTS.NOTIFICATIONS.LOWEST_PRICE_SELECTED} ${lowestPrice}`);
                return true;
            }

            return false;
        },

        /**
         * 处理结账页面
         */
        async processCheckoutPage() {
            try {
                // 并行执行支付相关操作，提高响应速度
                const results = await Promise.allSettled([
                    this.toggleBalance(),
                    this.clickNextStep(),
                    this.confirmPayment()
                ]);

                // 检查是否有操作成功执行
                const performed = results.some(r => r.status === 'fulfilled' && r.value);

                if (performed) {
                    State.lastAction = Date.now();
                }
            } catch (error) {
                console.error('[SteamPY购物助手] 处理结账页面失败:', error);
            }
        },

        /**
         * 处理激活页面
         * @returns {Promise<boolean>} 是否执行了操作
         */
        async processActivationPage() {
            try {
                const autoActivation = StorageManager.getGlobalSetting('autoActivationSwitch', false);
                if (!autoActivation) return false;

                // 如果激活已经完成，不再执行任何操作
                if (State.activationState.activationCompleted) {
                    return false;
                }

                // 检查是否达到最大重试次数
                if (State.activationState.activationRetries >= CONFIG.activation.maxRetries) {
                    // 只有在达到最大重试次数且未记录超时的情况下才记录一次
                    if (!State.activationState.hasTimeoutLogged) {
                        console.warn(`[SteamPY购物助手] 已达到最大激活重试次数: ${CONFIG.activation.maxRetries}`);
                        SettingsPanel.updateStatus(`⏹️ 激活重试已达上限`);
                        State.activationState.hasTimeoutLogged = true;
                    }
                    return false;
                }

                // 检查是否超时
                const now = Date.now();
                if (now - State.activationState.activationStartTime > CONFIG.activation.timeout) {
                     // 只有在超时且未记录超时的情况下才记录一次
                    if (!State.activationState.hasTimeoutLogged) {
                        console.warn('[SteamPY购物助手] 激活操作超时，停止重试');
                        SettingsPanel.updateStatus('⏰ 激活操作超时');
                        State.activationState.hasTimeoutLogged = true;
                    }
                    return false;
                }

                // 检查重试间隔
                if (now - State.activationState.lastActivationAttempt < CONFIG.activation.retryInterval) {
                    return false;
                }

                // 查找激活确认按钮
                const activationButton = this.findActivationButton();
                if (!activationButton) {
                    SettingsPanel.updateStatus('🔍 等待激活按钮...');
                    return false;
                }

                // 点击激活按钮
                activationButton.click();
                State.activationState.activationRetries++;
                State.activationState.lastActivationAttempt = now;
                State.activationState.activationAttempted = true;

                SettingsPanel.updateStatus(`${CONSTANTS.NOTIFICATIONS.ACTIVATION_CLICKED} (第${State.activationState.activationRetries}次)`);
                console.log(`[SteamPY购物助手] 第${State.activationState.activationRetries}次激活尝试`);

                return true;
            } catch (error) {
                console.error('[SteamPY购物助手] 处理激活页面失败:', error);
                return false;
            }
        },

        /**
         * 查找激活确认按钮
         * @returns {Element|null} 激活按钮元素
         */
        findActivationButton() {
            // 通过class和文字内容精确匹配
            let button = document.querySelector(CONSTANTS.CSS_SELECTORS.ACTIVATION_BUTTON);
            if (button && button.textContent.trim() === '确认' && !button.disabled) {
                return button;
            }

            // 通过文字内容匹配任何包含"确认"的按钮(借用同样符合的购买按钮样式)
            const buttons = document.querySelectorAll(CONSTANTS.CSS_SELECTORS.BUY_BUTTON);
            for (const btn of buttons) {
                if (btn.textContent.trim() === '确认' &&
                    btn.offsetParent !== null &&
                    !btn.disabled) {
                    return btn;
                }
            }

            return null;
        },

        /**
         * 点击价格行
         * @param {Element} row - 表格行元素
         * @returns {boolean} 是否点击成功
         */
        clickPriceRow(row) {
            try {
                const clickable = row.querySelector('td, button, a');
                if (clickable) {
                    clickable.click();
                    return true;
                }
                return false;
            } catch (error) {
                console.error('[SteamPY购物助手] 点击价格行失败:', error);
                return false;
            }
        },

        /**
         * 切换PY余额复选框
         * @returns {Promise<boolean>} 是否执行了操作
         */
        async toggleBalance() {
            try {
                const autoClick = StorageManager.getGlobalSetting('autoClickSwitch', true);
                if (!autoClick) return false;

                // 通过class直接查找PY余额checkbox复选框
                const checkbox = document.querySelector(CONSTANTS.CSS_SELECTORS.BALANCE_CHECKBOX);
                if (checkbox && !checkbox.checked && !checkbox.disabled) {
                    checkbox.click();
                    await Utils.delay(50);
                    SettingsPanel.updateStatus(CONSTANTS.NOTIFICATIONS.BALANCE_CHECKED);
                    return true;
                }

                // 通过文本查找PY余额元素找到checkbox复选框(class更改后的备用方案)
                const balanceElements = document.querySelectorAll('.f18.mt-10');
                for (const element of balanceElements) {
                    if (element.textContent.includes('PY余额抵现')) {
                        const checkbox = element.querySelector(CONSTANTS.CSS_SELECTORS.BALANCE_CHECKBOX);
                        if (checkbox && !checkbox.checked && !checkbox.disabled) {
                            checkbox.click();
                            await Utils.delay(50);
                            SettingsPanel.updateStatus(CONSTANTS.NOTIFICATIONS.BALANCE_CHECKED);
                            return true;
                        }
                    }
                }

                return false;
            } catch (error) {
                console.error('[SteamPY购物助手] 切换余额复选框失败:', error);
                return false;
            }
        },

        /**
         * 点击下一步按钮
         * @returns {Promise<boolean>} 是否执行了操作
         */
        async clickNextStep() {
            try {
                const nextStep = StorageManager.getGlobalSetting('nextStepSwitch', true);
                if (!nextStep) return false;

                // 提前查找所有按钮
                const buttons = document.querySelectorAll(CONSTANTS.CSS_SELECTORS.BUY_BUTTON);
                for (const button of buttons) {
                    if (button.textContent.trim() === '下一步' &&
                        !button.disabled &&
                        button.offsetParent !== null) {
                        button.click();
                        await Utils.delay(100);
                        SettingsPanel.updateStatus(CONSTANTS.NOTIFICATIONS.NEXT_STEP_CLICKED);

                        // 设置状态，表示正在等待支付模态框
                        State.paymentState.waitingForModal = true;
                        State.paymentState.modalDetected = false;
                        State.paymentState.paymentAttempted = false;

                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('[SteamPY购物助手] 点击下一步按钮失败:', error);
                return false;
            }
        },

        /**
         * 确认支付
         * @returns {Promise<boolean>} 是否执行了操作
         */
        async confirmPayment() {
            try {
                const paySwitch = StorageManager.getGlobalSetting('paySwitch', false);
                if (!paySwitch) return false;

                // 如果已经尝试过支付，不再重复尝试
                if (State.paymentState.paymentAttempted) {
                    return false;
                }

                // 查找显示的支付模态框
                const modalWraps = document.querySelectorAll(CONSTANTS.CSS_SELECTORS.MODAL_WRAP);
                let paymentModal = null;

                for (const wrap of modalWraps) {
                    // 检查模态框是否显示
                    const isHidden = wrap.classList.contains('ivu-modal-hidden');
                    const hasDisplayNone = wrap.style.display === 'none';

                    if (!isHidden && !hasDisplayNone) {
                        // 检查模态框内是否有支付按钮
                        const payButton = wrap.querySelector('button.ivu-btn-large span');
                        if (payButton && payButton.textContent.trim() === '支付') {
                            paymentModal = wrap;
                            break;
                        }
                    }
                }

                if (paymentModal) {
                    State.paymentState.modalDetected = true;
                    const payButton = paymentModal.querySelector('button.ivu-btn-large');
                    if (payButton && !payButton.disabled) {
                        payButton.click();
                        State.paymentState.paymentAttempted = true;
                        SettingsPanel.updateStatus(CONSTANTS.NOTIFICATIONS.PAYMENT_CONFIRMED);
                        return true;
                    }
                } else if (State.paymentState.waitingForModal && !State.paymentState.modalDetected) {
                    // 等待检测到支付弹窗
                    SettingsPanel.updateStatus('⏳ 等待支付弹窗...');
                }

                return false;
            } catch (error) {
                console.error('[SteamPY购物助手] 确认支付失败:', error);
                return false;
            }
        },

        /**
         * 检查是否应该跳过当前执行
         * @returns {boolean} 是否应该跳过
         */
        shouldSkip() {
            const shouldSkip = State.active ||
                   State.attempts > CONFIG.timing.maxAttempts ||
                   (Date.now() - State.lastAction) < 100 ||
                   !State.pageLoadState.isLoaded;

            if (shouldSkip && State.attempts <= CONFIG.timing.maxAttempts) {
                SettingsPanel.updateStatus('⏳ 等待执行条件...');
            }

            return shouldSkip;
        },

        /**
         * 安排下一次执行
         */
        scheduleNext() {
            const interval = CONFIG.timing.stepInterval();
            const elapsed = Date.now() - State.lastAction;
            const delay = Math.max(interval - elapsed, CONFIG.timing.baseDelay);

            Utils.delay(delay).then(() => {
                if (State.attempts <= CONFIG.timing.maxAttempts) {
                    SettingsPanel.updateStatus('🟢 运行中');
                    this.execute();
                } else {
                    SettingsPanel.updateStatus('⏹️ 监控中...');
                    Utils.delay(5000).then(() => {
                        State.attempts = 0;
                        this.execute();
                    });
                }
            });
        }
    };

    // ================== 系统初始化 ==================
    (function bootstrap() {
        console.log('[SteamPY购物助手] 脚本开始初始化 v' + CONFIG.version);

        PageMonitor.init();

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            PageMonitor.onPageReady();
        }
    })();
})();
