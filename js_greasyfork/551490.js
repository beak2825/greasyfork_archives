// ==UserScript==
// @name         Steam鉴赏家页面自动激活Key
// @namespace    https://store.steampowered.com/
// @version      1.5
// @description  定期刷新鉴赏家页面，自动获取并激活新的Steam Key
// @author       sjx01
// @match        https://store.steampowered.com/curator/*
// @exclude      https://store.steampowered.com/curator/*/admin/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @connect      127.0.0.1
// @connect      localhost
// @connect      store.steampowered.com
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551490/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E6%BF%80%E6%B4%BBKey.user.js
// @updateURL https://update.greasyfork.org/scripts/551490/Steam%E9%89%B4%E8%B5%8F%E5%AE%B6%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E6%BF%80%E6%B4%BBKey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /***************************
     * SteamActivator 核心模块
     ***************************/
    const SteamActivator = {
        // 默认配置
        defaultConfig: {
            refreshInterval: 5 * 60 * 1000, // 5分钟
            randomDelay: 0, // 随机延迟秒数，0表示不启用
            activationMethod: 'web', // 'web' 或 'asf'
            autoActivate: true, // 自动激活新Key
            asfConfig: {
                protocol: 'http',
                host: '127.0.0.1',
                port: '1242',
                password: '',
                bot: ''
            },
            notification: false, // 默认关闭桌面通知
            showSuccessPopup: true, // 显示激活成功弹窗
            checkCount: 1, // 默认只检查最新1个评测
            maxHistoryRecords: 10, // 默认保留10条记录
            backgroundRefresh: true, // 后台刷新默认开启
            refreshRetryCount: 3, // 刷新重试次数
            refreshRetryDelay: 5000, // 刷新重试延迟(ms)
            maxRefreshFailures: 5, // 最大刷新失败次数
            autoReopen: true, // 自动重开默认开启
            autoReopenDelay: 2000, // 自动重开延迟(ms)
            heartbeatInterval: 3000, // 心跳间隔(ms)
            heartbeatTimeout: 30000, // 30秒心跳超时时间
            refreshMethods: ['locationReplace', 'locationReload', 'metaRefresh', 'iframeRefresh'],
            enableLogging: false, // 详细日志默认关闭
            closeWithControl: true, // 监控标签页随控制标签页一同关闭默认开启
            closeWithControlDelay: 0, // 一同关闭延迟(ms)
            checkFrequency: 2000, // 检查频率(ms)
            // 表格显示设置 - 默认省略显示
            tableOverflowBehavior: 'ellipsis', // 'default', 'wrap', 'ellipsis'
            // 批量激活设置
            batchActivation: {
                enabled: true,
                delayMs: 2000, // 激活间隔(毫秒)
                retryCount: 2, // 重试次数
                showProgress: true, // 显示进度默认开启
                showLogs: true // 显示日志默认开启
            }
        },

        // 状态管理
        state: {
            curatorId: '',
            curatorName: '',
            config: null,
            processedKeys: [],
            activationHistory: [],
            sessionID: '',
            isRunning: false,
            isPanelExpanded: false,
            refreshTimer: null,
            countdownTimer: null,
            nextRefreshTime: null,
            remainingTime: null,
            activeModals: new Set(),
            lastStartNotificationTime: 0,
            activationSuccessCount: 0,
            backgroundRefreshTimer: null,
            lastActiveTime: Date.now(),
            refreshRetryCount: 0,
            currentRefreshMethodIndex: 0,
            isBackground: false,
            refreshFailureCount: 0,
            lastRefreshSuccessTime: Date.now(),
            isMonitoringTab: false,
            isNotificationCooldown: false,
            lastUserActionTime: Date.now(),
            monitoringTabCheckInterval: null,
            heartbeatInterval: null,
            controlPageClosed: false,
            lastHeartbeat: Date.now(),
            heartbeatTimer: null,
            isRefreshing: false,
            reopenTimer: null,
            pageLoaded: false,
            initializationTime: Date.now(),
            lastStatusCheck: 0,
            // 批量激活状态
            batchQueue: [],
            batchRunning: false,
            batchProgress: 0,
            batchTotal: 0,
            batchLogs: [],
            // 拖拽状态
            isDragging: false,
            dragStartTime: 0,
            dragStartX: 0,
            dragStartY: 0,
            dragThreshold: 2,
            dragOffsetX: 0,
            dragOffsetY: 0,
            lastDragTime: 0,
            dragVelocityX: 0,
            dragVelocityY: 0,
            dragAnimationFrame: null,
            // DOM节点缓存
            domCache: {},
            eventListeners: [],
            // 监控标签页ID
            monitoringTabWindowName: null
        },

        // 失败原因映射
        FAILURE_DETAILS: {
            14: "无效激活码",
            15: "重复激活",
            53: "次数上限",
            13: "地区限制",
            9: "已拥有",
            24: "缺少主游戏",
            36: "需要PS3?",
            50: "这是充值码"
        },

        // 刷新方法实现
        refreshMethods: {
            locationReplace: function() {
                return new Promise((resolve, reject) => {
                    try {
                        if (SteamActivator.state.config.enableLogging) {
                            console.log('使用 location.replace 刷新');
                        }
                        SteamActivator.updateHeartbeatBeforeRefresh();

                        setTimeout(() => {
                            const timestamp = Date.now();
                            const baseUrl = window.location.href.split('?')[0];
                            const url = baseUrl + '?autoRedeem=true&_t=' + timestamp;
                            window.location.replace(url);
                            setTimeout(() => reject(new Error('location.replace 刷新失败')), 10000);
                        }, 100);
                    } catch (e) {
                        reject(e);
                    }
                });
            },

            locationReload: function() {
                return new Promise((resolve, reject) => {
                    try {
                        if (SteamActivator.state.config.enableLogging) {
                            console.log('使用 location.reload 刷新');
                        }
                        SteamActivator.updateHeartbeatBeforeRefresh();

                        setTimeout(() => {
                            window.location.reload(true);
                            setTimeout(() => reject(new Error('location.reload 刷新失败')), 10000);
                        }, 100);
                    } catch (e) {
                        reject(e);
                    }
                });
            },

            metaRefresh: function() {
                return new Promise((resolve, reject) => {
                    try {
                        if (SteamActivator.state.config.enableLogging) {
                            console.log('使用 meta refresh 刷新');
                        }
                        SteamActivator.updateHeartbeatBeforeRefresh();

                        setTimeout(() => {
                            const meta = document.createElement('meta');
                            meta.httpEquiv = 'refresh';
                            meta.content = '0; url=' + window.location.href.split('?')[0] + '?autoRedeem=true';
                            document.head.appendChild(meta);
                            setTimeout(() => reject(new Error('meta refresh 刷新失败')), 10000);
                        }, 100);
                    } catch (e) {
                        reject(e);
                    }
                });
            },

            iframeRefresh: function() {
                return new Promise((resolve, reject) => {
                    try {
                        if (SteamActivator.state.config.enableLogging) {
                            console.log('使用 iframe refresh 刷新');
                        }
                        SteamActivator.updateHeartbeatBeforeRefresh();

                        setTimeout(() => {
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            iframe.src = window.location.href.split('?')[0] + '?autoRedeem=true';
                            iframe.onload = function() {
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            };
                            document.body.appendChild(iframe);
                            setTimeout(() => reject(new Error('iframe refresh 刷新失败')), 15000);
                        }, 100);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        },

        /**
         * 初始化
         */
        init() {
            this.initializeState();
            this.injectStyles();
            this.setupEventListeners();
            this.initTooltipSystem();
            this.createFloatingUI();
            this.setupMenuCommands();

            // 设置监控标签页的window.name
            if (this.state.isMonitoringTab) {
                this.setupMonitoringTabWindowName();
            }

            if (this.state.isMonitoringTab) {
                this.startMonitoring();
                this.showOptimizedStartNotification();
                this.startHeartbeat();
                this.startControlPageCheck();
            } else {
                this.checkForNewKeys();
                this.startMonitoringStatusCheck();
                this.updateStatusFromStorage();
                this.ensureStoppedState();
                // 页面可见时立即更新状态
                this.setupControlPageVisibilityHandler();
            }

            this.state.pageLoaded = true;
            this.log('脚本初始化完成');
        },

        /**
         * 设置监控标签页的window.name
         */
        setupMonitoringTabWindowName() {
            // 从存储中获取或生成监控标签页ID
            let tabId = GM_getValue(`monitoringTabId_${this.state.curatorId}`);
            if (!tabId) {
                tabId = 'steam_auto_redeem_' + this.state.curatorId + '_' + Date.now();
                GM_setValue(`monitoringTabId_${this.state.curatorId}`, tabId);
            }

            // 设置window.name以便控制页面可以找到
            window.name = tabId;
            this.state.monitoringTabWindowName = tabId;

            this.log(`监控标签页ID设置: ${tabId}`);
        },

        /**
         * 初始化状态
         */
        initializeState() {
            const curatorInfo = this.getCuratorInfo();
            this.state.curatorId = curatorInfo.id;
            this.state.curatorName = curatorInfo.name;

            // 立即设置默认配置，确保不为null
            this.state.config = JSON.parse(JSON.stringify(this.defaultConfig));

            // 加载保存的配置
            const savedConfig = GM_getValue('config');
            if (savedConfig) {
                this.state.config = this.mergeConfigs(this.state.config, savedConfig);
            }

            // 加载其他状态
            this.state.processedKeys = GM_getValue(`processedKeys_${curatorInfo.id}`, []);
            this.state.activationHistory = GM_getValue(`activationHistory_${curatorInfo.id}`, []);
            this.state.lastStartNotificationTime = GM_getValue(`lastStartNotificationTime_${curatorInfo.id}`, 0);

            // 检查运行模式
            const urlParams = new URLSearchParams(window.location.search);
            this.state.isMonitoringTab = urlParams.has('autoRedeem');

            this.ensureConfigIntegrity();
            this.trimHistory();
            this.loadSessionID();

            // 立即设置心跳保护
            if (this.state.isMonitoringTab) {
                const now = Date.now();
                const futureTime = now + 60000;
                GM_setValue(`monitoringTabLastHeartbeat_${curatorInfo.id}`, futureTime);
                GM_setValue(`monitoringTabLastUpdate_${curatorInfo.id}`, now);
                this.log('监控页面立即设置心跳保护');
            }
        },

        /**
         * 合并配置
         */
        mergeConfigs(defaultConfig, savedConfig) {
            const merged = JSON.parse(JSON.stringify(defaultConfig));

            for (const key in savedConfig) {
                if (savedConfig.hasOwnProperty(key)) {
                    if (typeof savedConfig[key] === 'object' && savedConfig[key] !== null &&
                        typeof merged[key] === 'object' && merged[key] !== null) {
                        // 深度合并对象
                        merged[key] = { ...merged[key], ...savedConfig[key] };
                    } else {
                        merged[key] = savedConfig[key];
                    }
                }
            }

            return merged;
        },

        /**
         * 确保配置完整性
         */
        ensureConfigIntegrity() {
            const configKeys = Object.keys(this.defaultConfig);
            let configChanged = false;

            configKeys.forEach(key => {
                if (this.state.config[key] === undefined) {
                    this.state.config[key] = this.defaultConfig[key];
                    configChanged = true;
                }
            });

            // 确保批量激活配置完整
            if (!this.state.config.batchActivation) {
                this.state.config.batchActivation = JSON.parse(JSON.stringify(this.defaultConfig.batchActivation));
                configChanged = true;
            } else {
                const batchKeys = Object.keys(this.defaultConfig.batchActivation);
                batchKeys.forEach(key => {
                    if (this.state.config.batchActivation[key] === undefined) {
                        this.state.config.batchActivation[key] = this.defaultConfig.batchActivation[key];
                        configChanged = true;
                    }
                });
            }

            if (configChanged) {
                this.saveConfig();
            }
        },

        /**
         * 注入样式
         */
        injectStyles() {
            const styles = `
                /* Steam风格全局样式 */
                .steam-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #1b2838;
                    border: 1px solid #363c44;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                    z-index: 10002;
                    font-family: 'Motiva Sans', Arial, sans-serif;
                    color: #c7d5e0;
                    min-width: 400px;
                    max-width: 90vw;
                    display: none;
                    contain: layout style paint;
                }

                .steam-modal-header {
                    background: linear-gradient(90deg, #2a475e, #1b2838);
                    padding: 15px 20px;
                    border-bottom: 1px solid #363c44;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 8px 8px 0 0;
                }

                .steam-modal-title {
                    color: #66c0f4;
                    font-weight: bold;
                    font-size: 16px;
                }

                .steam-modal-close {
                    background: none;
                    border: none;
                    color: #c7d5e0;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 3px;
                }

                .steam-modal-close:hover {
                    background: rgba(255,255,255,0.1);
                }

                .steam-modal-content {
                    padding: 20px;
                    max-height: 70vh;
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                .steam-modal-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #363c44;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    background: #16202d;
                    border-radius: 0 0 8px 8px;
                }

                .steam-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 10001;
                    display: none;
                }

                /* 标签页样式 */
                .tab-container {
                    margin-bottom: 20px;
                }

                .tab-buttons {
                    display: flex;
                    border-bottom: 1px solid #363c44;
                    margin-bottom: 15px;
                    flex-wrap: wrap;
                }

                .tab-button {
                    background: #2a475e;
                    border: none;
                    color: #c7d5e0;
                    padding: 10px 15px;
                    cursor: pointer;
                    border-radius: 4px 4px 0 0;
                    margin-right: 2px;
                    font-size: 12px;
                    transition: all 0.2s ease;
                    flex: 1;
                    min-width: 80px;
                }

                .tab-button.active {
                    background: #66c0f4;
                    color: #1b2838;
                    font-weight: bold;
                }

                .tab-button:hover:not(.active) {
                    background: #3c5a78;
                }

                .tab-content {
                    display: none;
                }

                .tab-content.active {
                    display: block;
                }

                /* 按钮样式 */
                .steam-btn {
                    background: linear-gradient(to bottom, #799905 0%, #536904 100%);
                    border: 1px solid #363c44;
                    color: #d2e885;
                    padding: 8px 16px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    text-shadow: 1px 1px 0px rgba(0,0,0,0.3);
                    transition: all 0.2s ease;
                    font-family: 'Motiva Sans', Arial, sans-serif;
                }

                .steam-btn:hover {
                    background: linear-gradient(to bottom, #8faf06 0%, #677e05 100%);
                }

                .steam-btn:active {
                    background: linear-gradient(to bottom, #536904 0%, #799905 100%);
                }

                .steam-btn-primary {
                    background: linear-gradient(to bottom, #67c1f5 0%, #417a9b 100%);
                    color: white;
                }

                .steam-btn-primary:hover {
                    background: linear-gradient(to bottom, #7bc8f6 0%, #4e8fb4 100%);
                }

                .steam-btn-danger {
                    background: linear-gradient(to bottom, #a34f4f 0%, #7a3a3a 100%);
                    color: white;
                }

                .steam-btn-danger:hover {
                    background: linear-gradient(to bottom, #b85a5a 0%, #8a4444 100%);
                }

                /* 表单样式 */
                .steam-form-group {
                    margin-bottom: 15px;
                }

                .steam-form-label {
                    display: block;
                    margin-bottom: 5px;
                    color: #66c0f4;
                    font-size: 12px;
                    font-weight: bold;
                }

                .steam-form-input {
                    width: 100%;
                    padding: 8px 12px;
                    background: #16202d;
                    border: 1px solid #363c44;
                    color: #c7d5e0;
                    border-radius: 3px;
                    font-family: 'Motiva Sans', Arial, sans-serif;
                    font-size: 12px;
                    box-sizing: border-box;
                }

                .steam-form-input:focus {
                    border-color: #66c0f4;
                    outline: none;
                }

                .steam-form-select {
                    width: 100%;
                    padding: 8px 12px;
                    background: #16202d;
                    border: 1px solid #363c44;
                    color: #c7d5e0;
                    border-radius: 3px;
                    font-family: 'Motiva Sans', Arial, sans-serif;
                    font-size: 12px;
                    box-sizing: border-box;
                }

                .steam-form-select option {
                    background: #1b2838;
                    color: #c7d5e0;
                }

                /* 复选框样式 */
                .steam-checkbox {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    cursor: pointer;
                    font-size: 12px;
                    background: #16202d;
                    padding: 8px 12px;
                    border-radius: 4px;
                    border: 1px solid #363c44;
                }

                .steam-checkbox:hover {
                    background: #1a2532;
                }

                .steam-checkbox input {
                    margin-right: 8px;
                }

                /* 表格容器 - 响应式设计 */
                .steam-table-container {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    margin: 10px 0;
                    border: 1px solid #363c44;
                    border-radius: 4px;
                    background: #16202d;
                    position: relative;
                    z-index: 1;
                }

                /* 表格基础样式 */
                .steam-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 11px;
                    table-layout: fixed;
                    min-width: 600px;
                }

                .steam-table th {
                    background: linear-gradient(180deg, #2a475e, #1f3647);
                    color: #66c0f4;
                    padding: 10px 8px;
                    text-align: left;
                    border: 1px solid #363c44;
                    font-weight: bold;
                    white-space: nowrap;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .steam-table td {
                    padding: 8px;
                    border: 1px solid #363c44;
                    background: #16202d;
                    color: #c7d5e0;
                    position: relative;
                    vertical-align: top;
                    transition: all 0.2s ease;
                }

                /* 表格列宽 */
                .steam-table th:nth-child(1),
                .steam-table td:nth-child(1) {
                    width: 140px;
                    min-width: 140px;
                }

                .steam-table th:nth-child(2),
                .steam-table td:nth-child(2) {
                    width: 140px;
                    min-width: 140px;
                }

                .steam-table th:nth-child(3),
                .steam-table td:nth-child(3) {
                    width: 80px;
                    min-width: 80px;
                }

                .steam-table th:nth-child(4),
                .steam-table td:nth-child(4) {
                    width: 60px;
                    min-width: 60px;
                }

                .steam-table th:nth-child(5),
                .steam-table td:nth-child(5) {
                    width: 120px;
                    min-width: 120px;
                }

                .steam-table th:nth-child(6),
                .steam-table td:nth-child(6) {
                    width: 160px;
                    min-width: 160px;
                }

                /* 特殊单元格样式 */
                .steam-table .time-cell {
                    white-space: nowrap;
                }

                .steam-table .game-name-cell {
                    white-space: nowrap;
                }

                .steam-table .success {
                    color: #90ba3c;
                    font-weight: bold;
                }

                .steam-table .failed {
                    color: #a34f4f;
                    font-weight: bold;
                }

                /* 表格显示模式 - 默认模式 */
                .table-default .steam-table td {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: clip;
                }

                /* 表格显示模式 - 换行 */
                .table-wrap .steam-table td {
                    white-space: normal;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    line-height: 1.3;
                    max-height: 3.9em;
                    overflow: hidden;
                }

                /* 表格显示模式 - 省略 */
                .table-ellipsis .steam-table td {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    position: relative;
                    cursor: help; /* 添加帮助光标提示 */
                }

                /* 为省略模式的单元格添加视觉提示 */
                .table-ellipsis .steam-table td[data-fulltext]:hover {
                    background: #2a475e !important;
                    border-color: #66c0f4 !important;
                }

                /* 确保模态框有足够高的z-index */
                .steam-modal {
                    z-index: 10002;
                }

                .steam-overlay {
                    z-index: 10001;
                }
                /* 批量激活样式 */
                .batch-container {
                    margin: 15px 0;
                }

                .batch-textarea {
                    width: 100%;
                    height: 120px;
                    background: #16202d;
                    border: 1px solid #363c44;
                    color: #c7d5e0;
                    border-radius: 4px;
                    padding: 8px;
                    font-family: monospace;
                    font-size: 12px;
                    resize: vertical;
                    box-sizing: border-box;
                }

                .batch-textarea:focus {
                    border-color: #66c0f4;
                    outline: none;
                }

                .batch-controls {
                    display: flex;
                    gap: 10px;
                    margin: 10px 0;
                    flex-wrap: wrap;
                }

                .batch-controls .steam-btn {
                    flex: 1;
                    min-width: 100px;
                }

                .progress-container {
                    margin: 10px 0;
                    background: #16202d;
                    border-radius: 4px;
                    padding: 10px;
                    border: 1px solid #363c44;
                }

                .progress-bar {
                    width: 100%;
                    height: 20px;
                    background: #2a475e;
                    border-radius: 10px;
                    overflow: hidden;
                    margin: 5px 0;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #67c1f5, #90ba3c);
                    transition: width 0.3s ease;
                    border-radius: 10px;
                }

                .progress-text {
                    text-align: center;
                    font-size: 11px;
                    color: #c7d5e0;
                }

                .log-panel {
                    max-height: 200px;
                    overflow-y: auto;
                    background: #16202d;
                    border: 1px solid #363c44;
                    border-radius: 4px;
                    padding: 8px;
                    font-family: monospace;
                    font-size: 11px;
                    margin-top: 10px;
                }

                .log-entry {
                    margin: 2px 0;
                    padding: 2px 4px;
                    border-radius: 2px;
                }

                .log-success {
                    color: #90ba3c;
                    background: rgba(144, 186, 60, 0.1);
                }

                .log-error {
                    color: #a34f4f;
                    background: rgba(163, 79, 79, 0.1);
                }

                .log-info {
                    color: #67c1f5;
                    background: rgba(103, 193, 245, 0.1);
                }

                .log-warning {
                    color: #f2b824;
                    background: rgba(242, 184, 36, 0.1);
                }

                /* 控制面板样式 */
                #auto-redeem-icon {
                    position: fixed;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #1b2838, #2a475e);
                    border-radius: 50%;
                    cursor: move;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                    border: 2px solid #66c0f4;
                    user-select: none;
                    transition: all 0.15s ease;
                    touch-action: none;
                    will-change: transform;
                }

                #auto-redeem-icon:hover {
                    transform: scale(1.1);
                    border-color: #90ba3c;
                    box-shadow: 0 4px 15px rgba(102, 192, 244, 0.3);
                }

                #auto-redeem-icon.dragging {
                    transform: scale(1.2);
                    cursor: grabbing;
                    border-color: #f2b824;
                    box-shadow: 0 6px 20px rgba(242, 184, 36, 0.4);
                    filter: brightness(1.2);
                }

                #auto-redeem-panel {
                    position: fixed;
                    background: #1b2838;
                    color: #c7d5e0;
                    border-radius: 8px;
                    z-index: 10001;
                    font-family: 'Motiva Sans', Arial, sans-serif;
                    font-size: 13px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                    border: 1px solid #363c44;
                    min-width: 300px;
                    max-width: 400px;
                    display: none;
                    overflow: hidden;
                }

                .panel-header {
                    background: linear-gradient(90deg, #2a475e, #1b2838);
                    padding: 12px 15px;
                    border-bottom: 1px solid #363c44;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .panel-title {
                    font-weight: bold;
                    color: #66c0f4;
                }

                .panel-content {
                    padding: 15px;
                }

                .status-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .status-value {
                    color: #66c0f4;
                }

                .controls-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin: 15px 0;
                }

                .settings-section {
                    background: #16202d;
                    border-radius: 4px;
                    padding: 10px;
                    margin-bottom: 15px;
                }

                .curator-info {
                    background: #2a475e;
                    border-radius: 4px;
                    padding: 8px;
                    margin-bottom: 10px;
                    font-size: 11px;
                    text-align: center;
                }

                /* 状态指示器 */
                .status-indicator {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 5px;
                }

                .status-running {
                    background-color: #90ba3c;
                    box-shadow: 0 0 5px #90ba3c;
                }

                .status-stopped {
                    background-color: #a34f4f;
                }

                .mode-indicator {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 5px;
                }

                .mode-monitoring {
                    background-color: #90ba3c;
                    box-shadow: 0 0 5px #90ba3c;
                }

                .mode-control {
                    background-color: #67c1f5;
                }

                .heartbeat-indicator {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 5px;
                    animation: heartbeat 2s infinite;
                }

                .heartbeat-alive {
                    background-color: #90ba3c;
                }

                .heartbeat-dead {
                    background-color: #a34f4f;
                }

                .background-indicator {
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 5px;
                }

                .background-active {
                    background-color: #90ba3c;
                }

                .background-inactive {
                    background-color: #a34f4f;
                }

                @keyframes heartbeat {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                /* 响应式设计 */
                @media (max-width: 768px) {
                    .steam-modal {
                        min-width: 95vw;
                        max-width: 95vw;
                        margin: 0;
                    }

                    .steam-modal-content {
                        padding: 15px;
                    }

                    .steam-table-container {
                        margin: 0 -5px;
                        border: none;
                        border-radius: 0;
                    }

                    .steam-table {
                        min-width: 550px;
                        font-size: 10px;
                    }

                    .steam-table th,
                    .steam-table td {
                        padding: 6px 4px;
                    }

                    .steam-table th:nth-child(1),
                    .steam-table td:nth-child(1) {
                        width: 120px;
                        min-width: 120px;
                    }

                    .steam-table th:nth-child(2),
                    .steam-table td:nth-child(2) {
                        width: 120px;
                        min-width: 120px;
                    }

                    .steam-table th:nth-child(3),
                    .steam-table td:nth-child(3) {
                        width: 70px;
                        min-width: 70px;
                    }

                    .steam-table th:nth-child(4),
                    .steam-table td:nth-child(4) {
                        width: 50px;
                        min-width: 50px;
                    }

                    .steam-table th:nth-child(5),
                    .steam-table td:nth-child(5) {
                        width: 100px;
                        min-width: 100px;
                    }

                    .steam-table th:nth-child(6),
                    .steam-table td:nth-child(6) {
                        width: 140px;
                        min-width: 140px;
                    }
                }

                @media (max-width: 480px) {
                    .steam-table {
                        min-width: 500px;
                        font-size: 9px;
                    }

                    .steam-table th,
                    .steam-table td {
                        padding: 4px 3px;
                    }

                    .steam-modal-content {
                        padding: 10px;
                    }

                    #auto-redeem-panel {
                        min-width: 280px;
                        max-width: 95vw;
                    }
                }
            `;

            GM_addStyle(styles);
        },

        /**
         * 设置事件监听器
         */
        setupEventListeners() {
            // 页面卸载处理
            this.addEventListener(window, 'beforeunload', () => {
                this.cleanup();
            });

            // ESC键关闭模态框
            this.addEventListener(document, 'keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllModals();
                }
            });

            // 事件委托
            this.addEventListener(document, 'click', (e) => {
                const target = e.target;

                // 处理模态框关闭
                if (target.classList.contains('steam-modal-close') ||
                    target.classList.contains('steam-overlay')) {
                    this.closeAllModals();
                }
            });
        },

        /**
         * 添加事件监听器
         */
        addEventListener(element, event, handler) {
            element.addEventListener(event, handler);
            this.state.eventListeners.push({ element, event, handler });
        },

        /**
         * 创建浮动UI
         */
        createFloatingUI() {
            // 移除可能已存在的元素
            this.removeExistingElements(['#auto-redeem-icon', '#auto-redeem-panel', '.steam-overlay']);

            const overlay = $('<div class="steam-overlay"></div>');
            const icon = $(`
                <div id="auto-redeem-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#66c0f4" stroke-width="2"/>
                        <path d="M12 16L16 12M12 16L8 12M12 16V8" stroke="#66c0f4" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            `);

            let panelContent;
            if (this.state.isMonitoringTab) {
                panelContent = this.createMonitoringPanelContent();
            } else {
                panelContent = this.createControlPanelContent();
            }

            const panel = $(`
                <div id="auto-redeem-panel">
                    <div class="panel-header">
                        <div class="panel-title">自动激活控制面板</div>
                        <div style="display: flex; gap: 5px;">
                            <button id="minimizeBtn" class="steam-modal-close" title="最小化">−</button>
                            <button id="settingsBtn" class="steam-modal-close" title="设置">⚙</button>
                        </div>
                    </div>
                    ${panelContent}
                </div>
            `);

            $('body').append(overlay, icon, panel);
            this.setupDragAndDrop();
            this.bindPanelEvents();

            // 恢复位置
            const savedPosition = GM_getValue('panelPosition') || { x: 20, y: 20 };
            $('#auto-redeem-icon').css({
                left: savedPosition.x + 'px',
                top: savedPosition.y + 'px'
            });
            this.updatePanelPosition();
        },

        /**
         * 移除已存在的元素
         */
        removeExistingElements(selectors) {
            selectors.forEach(selector => {
                $(selector).remove();
            });
        },

        /********************
          * 悬浮框管理
          ********************/

        /**
          * 初始化悬浮框系统
          */
        initTooltipSystem() {
            this.state.tooltipElement = null;
            this.state.activeTooltip = null;
            this.state.tooltipHideTimeout = null;

            this.createTooltipElement();
            this.bindTooltipEvents();
        },

        /**
          * 创建悬浮框元素
          */
        createTooltipElement() {
            // 移除已存在的悬浮框
            if (this.state.tooltipElement) {
                this.state.tooltipElement.remove();
            }

            this.state.tooltipElement = $(`
        <div id="steam-tooltip" style="
            position: fixed;
            background: #1b2838;
            color: #c7d5e0;
            padding: 12px 16px;
            border-radius: 6px;
            border: 2px solid #66c0f4;
            box-shadow: 0 8px 25px rgba(0,0,0,0.7);
            z-index: 10005;
            white-space: normal;
            max-width: 500px;
            word-wrap: break-word;
            font-size: 12px;
            line-height: 1.4;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.2s ease;
            pointer-events: none;
            font-family: 'Motiva Sans', Arial, sans-serif;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: none;
        "></div>
    `);

            $('body').append(this.state.tooltipElement);
        },

        /**
          * 绑定悬浮框事件
          */
        bindTooltipEvents() {
            // 使用事件委托处理表格单元格的悬浮事件
            this.addEventListener(document, 'mouseover', (e) => {
                const target = $(e.target);
                const cell = target.closest('.table-ellipsis .steam-table td');

                if (cell.length && cell.attr('data-fulltext')) {
                    this.showTooltip(cell, e);
                }
            });

            this.addEventListener(document, 'mouseout', (e) => {
                const target = $(e.target);
                const cell = target.closest('.table-ellipsis .steam-table td');

                if (cell.length) {
                    this.hideTooltip();
                }
            });

            this.addEventListener(document, 'mousemove', (e) => {
                if (this.state.activeTooltip) {
                    this.updateTooltipPosition(e);
                }
            });
        },

        /**
          * 显示悬浮框
          */
        showTooltip(cell, event) {
            if (this.state.tooltipHideTimeout) {
                clearTimeout(this.state.tooltipHideTimeout);
                this.state.tooltipHideTimeout = null;
            }

            const fulltext = cell.attr('data-fulltext');
            if (!fulltext) return;

            this.state.activeTooltip = {
                element: cell,
                content: fulltext
            };

            this.state.tooltipElement
                .text(fulltext)
                .css({
                display: 'block',
                opacity: 0
            });

            this.updateTooltipPosition(event);

            // 延迟显示以获得更好的动画效果
            setTimeout(() => {
                if (this.state.activeTooltip) {
                    this.state.tooltipElement.css('opacity', 1);
                }
            }, 10);
        },

        /**
          * 更新悬浮框位置
          */
        updateTooltipPosition(event) {
            if (!this.state.activeTooltip || !this.state.tooltipElement.is(':visible')) return;

            const tooltip = this.state.tooltipElement;
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // 获取视口尺寸
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // 获取悬浮框尺寸
            const tooltipWidth = tooltip.outerWidth();
            const tooltipHeight = tooltip.outerHeight();

            // 默认位置：鼠标右下方
            let posX = mouseX + 15;
            let posY = mouseY + 15;

            // 防止超出右边界
            if (posX + tooltipWidth > viewportWidth - 10) {
                posX = mouseX - tooltipWidth - 15;
            }

            // 防止超出左边界
            if (posX < 10) {
                posX = 10;
            }

            // 防止超出下边界
            if (posY + tooltipHeight > viewportHeight - 10) {
                posY = mouseY - tooltipHeight - 15;
            }

            // 防止超出上边界
            if (posY < 10) {
                posY = 10;
            }

            tooltip.css({
                left: posX + 'px',
                top: posY + 'px'
            });
        },

        /**
          * 隐藏悬浮框
          */
        hideTooltip() {
            this.state.tooltipHideTimeout = setTimeout(() => {
                this.state.tooltipElement.css('opacity', 0);

                setTimeout(() => {
                    this.state.tooltipElement.hide();
                    this.state.activeTooltip = null;
                }, 300);
            }, 100);
        },

        /**
          * 强制隐藏悬浮框
          */
        forceHideTooltip() {
            if (this.state.tooltipHideTimeout) {
                clearTimeout(this.state.tooltipHideTimeout);
            }
            this.state.tooltipElement.hide().css('opacity', 0);
            this.state.activeTooltip = null;
        },

        /**
         * 创建监控面板内容
         */
        createMonitoringPanelContent() {
            return `
                <div class="panel-content">
                    <div class="curator-info">
                        当前鉴赏家: ${this.state.curatorName}
                        <span class="mode-indicator mode-monitoring" title="监控标签页"></span>
                        <span class="heartbeat-indicator heartbeat-alive" title="心跳正常"></span>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div class="status-item">
                            <span>状态:</span>
                            <span id="status" class="status-value">
                                ${this.state.isRunning ? '运行中' : '已暂停'}
                                <span class="status-indicator ${this.state.isRunning ? 'status-running' : 'status-stopped'}"></span>
                            </span>
                        </div>
                        <div class="status-item">
                            <span>已激活Key:</span>
                            <span id="keyCount" class="status-value">${this.state.processedKeys.length}个</span>
                        </div>
                        <div class="status-item">
                            <span>下次刷新:</span>
                            <span id="nextRefresh" class="status-value">${this.formatCountdown(this.state.config.refreshInterval)}</span>
                        </div>
                        <div class="status-item">
                            <span>后台刷新:</span>
                            <span id="backgroundStatus" class="status-value">
                                ${this.state.config.backgroundRefresh ? '启用' : '禁用'}
                                <span class="background-indicator ${this.state.config.backgroundRefresh ? 'background-active' : 'background-inactive'}"></span>
                            </span>
                        </div>
                    </div>

                    <div class="controls-grid">
                        <button id="toggleBtn" class="steam-btn steam-btn-primary">${this.state.isRunning ? '暂停' : '继续'}</button>
                        <button id="manualRefreshBtn" class="steam-btn">立即刷新</button>
                    </div>

                    <div class="controls-grid">
                        <button id="batchActivateBtn" class="steam-btn">批量激活</button>
                        <button id="viewHistoryBtn" class="steam-btn">查看记录</button>
                    </div>

                    <div class="controls-grid">
                        <button id="settingsMainBtn" class="steam-btn">修改设置</button>
                        <button id="clearHistoryBtn" class="steam-btn steam-btn-danger">清空记录</button>
                    </div>
                </div>
            `;
        },

        /**
         * 创建控制面板内容
         */
        createControlPanelContent() {
            const isHeartbeatAlive = this.checkHeartbeat();
            const isActuallyRunning = GM_getValue(`isMonitoringRunning_${this.state.curatorId}`, false);
            const displayRunning = isActuallyRunning && isHeartbeatAlive;

            return `
                <div class="panel-content">
                    <div class="curator-info">
                        当前鉴赏家: ${this.state.curatorName}
                        <span class="mode-indicator mode-control" title="控制面板"></span>
                        <span class="heartbeat-indicator ${isHeartbeatAlive ? 'heartbeat-alive' : 'heartbeat-dead'}" title="${isHeartbeatAlive ? '心跳正常' : '心跳停止'}"></span>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <div class="status-item">
                            <span>监控状态:</span>
                            <span id="status" class="status-value">
                                ${displayRunning ? '运行中' : '已停止'}
                                <span class="status-indicator ${displayRunning ? 'status-running' : 'status-stopped'}"></span>
                            </span>
                        </div>
                        <div class="status-item">
                            <span>已激活Key:</span>
                            <span id="keyCount" class="status-value">${this.state.processedKeys.length}个</span>
                        </div>
                        <div class="status-item">
                            <span>运行模式:</span>
                            <span class="status-value">标签页监控模式</span>
                        </div>
                        <div class="status-item">
                            <span>心跳状态:</span>
                            <span class="status-value heartbeat-status-text">${isHeartbeatAlive ? '正常' : '停止'}</span>
                        </div>
                    </div>

                    <div style="text-align: center; margin: 20px 0;">
                        <button id="startBtn" class="steam-btn steam-btn-primary" style="padding: 12px 24px; font-size: 14px; ${displayRunning ? 'display: none;' : ''}">
                            开始监控
                        </button>
                        <button id="stopBtn" class="steam-btn steam-btn-danger" style="padding: 12px 24px; font-size: 14px; ${!displayRunning ? 'display: none;' : ''}">
                            停止监控
                        </button>
                    </div>

                    <div class="controls-grid">
                        <button id="batchActivateBtn" class="steam-btn">批量激活</button>
                        <button id="viewHistoryBtn" class="steam-btn">查看记录</button>
                    </div>

                    <div class="controls-grid">
                        <button id="settingsMainBtn" class="steam-btn">修改设置</button>
                        <button id="clearHistoryBtn" class="steam-btn steam-btn-danger">清空记录</button>
                    </div>

                    <div style="margin-top: 15px; padding: 10px; background: #2a475e; border-radius: 4px; font-size: 11px;">
                        <strong>提示:</strong> 在标签页中运行可以避免刷新失败问题，并获得更好的稳定性。
                    </div>
                </div>
            `;
        },

        /**
         * 设置拖拽功能
         */
        setupDragAndDrop() {
            const icon = $('#auto-redeem-icon');
            let isDragStarted = false;

            // 事件委托
            this.addEventListener(icon[0], 'mousedown', (e) => {
                if (e.target.tagName === 'BUTTON') return;

                isDragStarted = true;
                this.state.isDragging = false;
                this.state.dragStartTime = Date.now();
                this.state.dragStartX = e.clientX;
                this.state.dragStartY = e.clientY;

                const iconRect = icon[0].getBoundingClientRect();
                this.state.dragOffsetX = e.clientX - iconRect.left;
                this.state.dragOffsetY = e.clientY - iconRect.top;

                icon.addClass('dragging');
                e.preventDefault();
                e.stopPropagation();
            });

            const handleMouseMove = (e) => {
                if (!isDragStarted) return;

                // 检查是否达到拖动阈值
                if (!this.state.isDragging) {
                    const moveDeltaX = Math.abs(e.clientX - this.state.dragStartX);
                    const moveDeltaY = Math.abs(e.clientY - this.state.dragStartY);

                    if (moveDeltaX > this.state.dragThreshold || moveDeltaY > this.state.dragThreshold) {
                        this.state.isDragging = true;
                    }
                }

                if (this.state.isDragging) {
                    // 使用requestAnimationFrame进行流畅的动画
                    if (this.state.dragAnimationFrame) {
                        cancelAnimationFrame(this.state.dragAnimationFrame);
                    }

                    this.state.dragAnimationFrame = requestAnimationFrame(() => {
                        const x = e.clientX - this.state.dragOffsetX;
                        const y = e.clientY - this.state.dragOffsetY;

                        const maxX = window.innerWidth - icon.outerWidth();
                        const maxY = window.innerHeight - icon.outerHeight();

                        const boundedX = Math.max(0, Math.min(x, maxX));
                        const boundedY = Math.max(0, Math.min(y, maxY));

                        icon.css({
                            left: boundedX + 'px',
                            top: boundedY + 'px'
                        });

                        if (this.state.isPanelExpanded) {
                            this.updatePanelPosition();
                        }
                    });
                }
            };

            this.addEventListener(document, 'mousemove', handleMouseMove);

            const handleMouseUp = (e) => {
                if (!isDragStarted) return;

                const dragEndTime = Date.now();
                const dragDuration = dragEndTime - this.state.dragStartTime;

                // 判断是点击还是拖拽
                if (!this.state.isDragging && dragDuration < 300) {
                    // 点击行为：打开/关闭面板
                    this.togglePanel();
                }

                isDragStarted = false;
                this.state.isDragging = false;
                icon.removeClass('dragging');

                // 取消动画帧
                if (this.state.dragAnimationFrame) {
                    cancelAnimationFrame(this.state.dragAnimationFrame);
                    this.state.dragAnimationFrame = null;
                }

                // 保存位置
                const position = {
                    x: parseInt(icon.css('left')),
                    y: parseInt(icon.css('top'))
                };
                GM_setValue('panelPosition', position);
            };

            this.addEventListener(document, 'mouseup', handleMouseUp);

            // 触摸设备支持
            this.addEventListener(icon[0], 'touchstart', (e) => {
                if (e.target.tagName === 'BUTTON') return;

                isDragStarted = true;
                this.state.isDragging = false;
                this.state.dragStartTime = Date.now();

                const touch = e.touches[0];
                this.state.dragStartX = touch.clientX;
                this.state.dragStartY = touch.clientY;

                const iconRect = icon[0].getBoundingClientRect();
                this.state.dragOffsetX = touch.clientX - iconRect.left;
                this.state.dragOffsetY = touch.clientY - iconRect.top;

                icon.addClass('dragging');
                e.preventDefault();
            });

            const handleTouchMove = (e) => {
                if (!isDragStarted) return;

                const touch = e.touches[0];

                // 检查是否达到拖动阈值
                if (!this.state.isDragging) {
                    const moveDeltaX = Math.abs(touch.clientX - this.state.dragStartX);
                    const moveDeltaY = Math.abs(touch.clientY - this.state.dragStartY);

                    if (moveDeltaX > this.state.dragThreshold || moveDeltaY > this.state.dragThreshold) {
                        this.state.isDragging = true;
                    }
                }

                if (this.state.isDragging) {
                    if (this.state.dragAnimationFrame) {
                        cancelAnimationFrame(this.state.dragAnimationFrame);
                    }

                    this.state.dragAnimationFrame = requestAnimationFrame(() => {
                        const x = touch.clientX - this.state.dragOffsetX;
                        const y = touch.clientY - this.state.dragOffsetY;

                        const maxX = window.innerWidth - icon.outerWidth();
                        const maxY = window.innerHeight - icon.outerHeight();

                        const boundedX = Math.max(0, Math.min(x, maxX));
                        const boundedY = Math.max(0, Math.min(y, maxY));

                        icon.css({
                            left: boundedX + 'px',
                            top: boundedY + 'px'
                        });

                        if (this.state.isPanelExpanded) {
                            this.updatePanelPosition();
                        }
                    });
                }

                e.preventDefault();
            };

            this.addEventListener(document, 'touchmove', handleTouchMove);

            this.addEventListener(document, 'touchend', (e) => {
                if (!isDragStarted) return;

                const dragEndTime = Date.now();
                const dragDuration = dragEndTime - this.state.dragStartTime;

                // 判断是点击还是拖拽
                if (!this.state.isDragging && dragDuration < 300) {
                    this.togglePanel();
                }

                isDragStarted = false;
                this.state.isDragging = false;
                icon.removeClass('dragging');

                if (this.state.dragAnimationFrame) {
                    cancelAnimationFrame(this.state.dragAnimationFrame);
                    this.state.dragAnimationFrame = null;
                }

                const position = {
                    x: parseInt(icon.css('left')),
                    y: parseInt(icon.css('top'))
                };
                GM_setValue('panelPosition', position);
            });
        },

        /**
         * 更新面板位置
         */
        updatePanelPosition() {
            const icon = $('#auto-redeem-icon');
            const panel = $('#auto-redeem-panel');

            const iconRect = icon[0].getBoundingClientRect();
            const panelWidth = panel.outerWidth();
            const panelHeight = panel.outerHeight();

            const spaceRight = window.innerWidth - iconRect.right;
            const spaceLeft = iconRect.left;
            const spaceBottom = window.innerHeight - iconRect.bottom;

            let x, y;

            if (spaceRight >= panelWidth || spaceRight >= spaceLeft) {
                x = iconRect.right + 10;
            } else {
                x = iconRect.left - panelWidth - 10;
            }

            y = iconRect.top;
            if (y + panelHeight > window.innerHeight) {
                y = window.innerHeight - panelHeight - 10;
            }

            y = Math.max(10, y);

            panel.css({
                left: x + 'px',
                top: y + 'px'
            });
        },

        /**
         * 绑定面板事件
         */
        bindPanelEvents() {
            // 事件委托
            this.addEventListener(document, 'click', (e) => {
                const target = e.target;
                const id = target.id;

                if (!id) return;

                // 监控页面按钮
                if (this.state.isMonitoringTab) {
                    switch(id) {
                        case 'toggleBtn':
                            this.toggleMonitoring();
                            break;
                        case 'manualRefreshBtn':
                            this.manualRefresh();
                            break;
                    }
                } else {
                    // 控制页面按钮
                    switch(id) {
                        case 'startBtn':
                            this.startMonitoringTab();
                            break;
                        case 'stopBtn':
                            this.stopMonitoringTab();
                            break;
                    }
                }

                // 通用按钮
                switch(id) {
                    case 'minimizeBtn':
                        this.togglePanel();
                        break;
                    case 'settingsBtn':
                    case 'settingsMainBtn':
                        this.showSettings();
                        break;
                    case 'batchActivateBtn':
                        this.showBatchActivation();
                        break;
                    case 'viewHistoryBtn':
                        this.showActivationHistory();
                        break;
                    case 'clearHistoryBtn':
                        this.showClearHistoryConfirm();
                        break;
                }
            });
        },

        /**
         * 切换面板显示
         */
        togglePanel() {
            const panel = $('#auto-redeem-panel');
            if (panel.is(':visible')) {
                panel.hide();
                this.state.isPanelExpanded = false;
            } else {
                this.updatePanelPosition();
                panel.show();
                this.state.isPanelExpanded = true;
            }
        },

        /**
         * 强制显示面板
         */
        showPanel() {
            const panel = $('#auto-redeem-panel');
            if (!panel.is(':visible')) {
                this.updatePanelPosition();
                panel.show();
                this.state.isPanelExpanded = true;
            }
        },

        /********************
         * 核心功能
         ********************/

        /**
         * 获取鉴赏家信息
         */
        getCuratorInfo() {
            const match = window.location.href.match(/curator\/(\d+)(?:-([^\/]+))?/);
            if (!match) return { id: 'default', name: '未知鉴赏家' };

            const id = match[1];
            let name = '未知鉴赏家';

            // 进行（两次）URL解码
            if (match[2]) {
                try {
                    name = decodeURIComponent(decodeURIComponent(match[2]));
                } catch (e) {
                    try {
                        name = decodeURIComponent(match[2]);
                    } catch (e2) {
                        name = match[2];
                    }
                }

                // 处理名称格式
                name = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }

            return { id, name };
        },

        /**
         * 检查新Key
         */
        checkForNewKeys() {
            this.log('检查新key...');

            const recommendations = $('.recommendation_desc').slice(0, this.state.config.checkCount);
            const newKeys = [];

            recommendations.each(function() {
                const keys = SteamActivator.extractKeysFromHTML($(this).text());
                keys.forEach(key => {
                    if (!SteamActivator.isKeyInCurrentCuratorHistory(key)) {
                        newKeys.push(key);
                    }
                });
            });

            const uniqueNewKeys = [...new Set(newKeys)];

            if (uniqueNewKeys.length > 0) {
                this.log(`发现 ${uniqueNewKeys.length} 个新key:`, uniqueNewKeys);

                if (this.state.config.notification) {
                    this.showNotification('发现新Key', `找到 ${uniqueNewKeys.length} 个新key`, false);
                }

                if (this.state.config.autoActivate) {
                    this.activateKeys(uniqueNewKeys);
                } else {
                    // 即使不自动激活，也记录发现的新key
                    uniqueNewKeys.forEach(key => {
                        const historyEntry = {
                            key: key,
                            timestamp: new Date().toISOString(),
                            method: '发现',
                            result: 'found',
                            message: '发现新Key但未自动激活',
                            detail: '发现新Key但未自动激活',
                            sub: '',
                            subName: ''
                        };
                        this.state.activationHistory.unshift(historyEntry);
                    });
                    this.trimHistory();
                    this.saveState();
                }
            } else {
                this.log('未发现新key');
            }
        },

        /**
         * 激活Key（只在设置开启时显示成功弹窗）
         */
        async activateKeys(keys) {
            if (!keys || keys.length === 0) return;

            this.log('开始激活key:', keys);

            let results = [];

            if (this.state.config.activationMethod === 'asf') {
                results = await this.activateWithASF(keys);
            } else {
                results = await this.activateWithWeb(keys);
            }

            // 处理激活结果并记录
            if (results && Array.isArray(results)) {
                results.forEach(result => {
                    if (result && result.key) {
                        const historyEntry = {
                            key: result.key,
                            timestamp: new Date().toISOString(),
                            method: this.state.config.activationMethod === 'asf' ? 'ASF激活' : '网页激活',
                            result: result.success ? 'success' : 'failed',
                            message: result.detail,
                            detail: result.detail,
                            sub: result.sub || '',
                            subName: result.subName || ''
                        };

                        this.state.activationHistory.unshift(historyEntry);

                        if (result.success) {
                            this.state.processedKeys.push(result.key);
                            this.state.activationSuccessCount++;

                            // 只在设置开启时显示成功弹窗
                            if (this.state.config.showSuccessPopup) {
                                this.showActivationSuccessNotification(result.detail, historyEntry.method);
                            }
                        }
                        // 失败情况只记录，不显示弹窗
                    }
                });

                this.trimHistory();
                this.saveState();
                this.updateKeyCountDisplay();
            }
        },

        /**
         * 使用ASF激活
         */
        async activateWithASF(keys) {
            // 确保keys是数组
            if (!Array.isArray(keys)) {
                keys = [keys];
            }

            const command = `!redeem ${this.state.config.asfConfig.bot ? this.state.config.asfConfig.bot + ' ' : ''}${keys.join(',')}`;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${this.state.config.asfConfig.protocol}://${this.state.config.asfConfig.host}:${this.state.config.asfConfig.port}/Api/Command`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication': this.state.config.asfConfig.password
                    },
                    data: JSON.stringify({ Command: command }),
                    timeout: 15000,
                    onload: (response) => {
                        const results = [];
                        try {
                            const result = JSON.parse(response.responseText);
                            this.log('ASF激活结果:', result);

                            // 为每个key创建结果
                            keys.forEach(key => {
                                results.push({
                                    key: key,
                                    success: result.Success === true,
                                    detail: result.Message || (result.Success ? '激活成功' : 'ASF激活失败'),
                                    sub: '',
                                    subName: ''
                                });
                            });

                            resolve(results);
                        } catch (e) {
                            this.log('解析ASF响应失败:', e);
                            keys.forEach(key => {
                                results.push({
                                    key: key,
                                    success: false,
                                    detail: 'ASF响应解析错误',
                                    sub: '',
                                    subName: ''
                                });
                            });
                            resolve(results);
                        }
                    },
                    onerror: (error) => {
                        this.log('ASF激活失败:', error);
                        const results = keys.map(key => ({
                            key: key,
                            success: false,
                            detail: 'ASF网络连接错误',
                            sub: '',
                            subName: ''
                        }));
                        resolve(results);
                    },
                    ontimeout: () => {
                        const results = keys.map(key => ({
                            key: key,
                            success: false,
                            detail: 'ASF请求超时',
                            sub: '',
                            subName: ''
                        }));
                        resolve(results);
                    }
                });
            });
        },

        /**
         * 使用网页激活
         */
        async activateWithWeb(keys) {
            // 确保keys是数组
            if (!Array.isArray(keys)) {
                keys = [keys];
            }

            const results = [];

            try {
                await this.ensureValidSession();

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];

                    try {
                        const result = await this.redeemKey(key);
                        results.push(result);
                    } catch (error) {
                        this.log(`激活key ${key} 失败:`, error);
                        results.push({
                            key: key,
                            success: false,
                            detail: '激活过程异常',
                            sub: '',
                            subName: ''
                        });
                    }
                }
            } catch (error) {
                this.log('获取session失败:', error);
                keys.forEach(key => {
                    results.push({
                        key: key,
                        success: false,
                        detail: '无法获取有效session',
                        sub: '',
                        subName: ''
                    });
                });
            }

            return results;
        },

        /**
         * 单个Key激活
         */
        redeemKey(key) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://store.steampowered.com/account/ajaxregisterkey/',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'Origin': 'https://store.steampowered.com',
                        'Referer': 'https://store.steampowered.com/account/registerkey'
                    },
                    data: `product_key=${key}&sessionid=${this.state.sessionID}`,
                    responseType: 'json',
                    timeout: 15000,
                    onload: (response) => {
                        if (response.status === 200 && response.response) {
                            const data = response.response;

                            if (data.success === 1 && data.purchase_receipt_info?.line_items[0]) {
                                const item = data.purchase_receipt_info.line_items[0];
                                resolve({
                                    key: key,
                                    result: 'success',
                                    success: true,
                                    detail: '激活成功',
                                    sub: item.packageid,
                                    subName: item.line_item_description
                                });
                            } else if (data.purchase_result_details !== undefined) {
                                const failureReason = this.FAILURE_DETAILS[data.purchase_result_details] || '其他错误';
                                let subInfo = '';
                                let subName = '';

                                if (data.purchase_receipt_info?.line_items[0]) {
                                    const item = data.purchase_receipt_info.line_items[0];
                                    subInfo = item.packageid;
                                    subName = item.line_item_description;
                                }

                                resolve({
                                    key: key,
                                    result: 'failed',
                                    success: false,
                                    detail: failureReason,
                                    sub: subInfo,
                                    subName: subName
                                });
                            } else {
                                resolve({
                                    key: key,
                                    result: 'failed',
                                    success: false,
                                    detail: '未知错误',
                                    sub: '',
                                    subName: ''
                                });
                            }
                        } else {
                            resolve({
                                key: key,
                                result: 'failed',
                                success: false,
                                detail: '网络错误',
                                sub: '',
                                subName: ''
                            });
                        }
                    },
                    onerror: () => {
                        resolve({
                            key: key,
                            result: 'failed',
                            success: false,
                            detail: '请求失败',
                            sub: '',
                            subName: ''
                        });
                    },
                    ontimeout: () => {
                        resolve({
                            key: key,
                            result: 'failed',
                            success: false,
                            detail: '请求超时',
                            sub: '',
                            subName: ''
                        });
                    }
                });
            });
        },

        /********************
         * 批量激活功能
         ********************/

        /**
         * 显示批量激活界面
         */
        showBatchActivation() {
            const content = `
                <div class="batch-container">
                    <div class="steam-form-group">
                        <label class="steam-form-label">输入Key (每行一个)</label>
                        <textarea class="batch-textarea" id="batchKeyInput" placeholder="请输入Steam Key，每行一个&#10;例如：&#10;ABCDE-FGHIJ-KLMNO&#10;PQRST-UVWXY-Z1234"></textarea>
                    </div>

                    <div class="batch-controls">
                        <button id="batchStartBtn" class="steam-btn steam-btn-primary">开始激活</button>
                        <button id="batchStopBtn" class="steam-btn steam-btn-danger" disabled>停止激活</button>
                        <button id="batchClearBtn" class="steam-btn">清空输入</button>
                    </div>

                    ${this.state.config.batchActivation.showProgress ? `
                    <div class="progress-container">
                        <div class="progress-text">
                            进度: <span id="batchProgressText">0/0</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="batchProgressBar" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">
                            状态: <span id="batchStatusText">等待开始</span>
                        </div>
                    </div>
                    ` : ''}

                    ${this.state.config.batchActivation.showLogs ? `
                    <div class="log-panel" id="batchLogPanel">
                        <div class="log-entry log-info">批量激活就绪，请输入Key并点击开始</div>
                    </div>
                    ` : ''}
                </div>
            `;

            const modalId = this.createModal('批量激活Key', content, [
                {
                    text: '关闭',
                    action: ''
                }
            ]);

            // 绑定批量激活事件
            setTimeout(() => {
                $('#batchStartBtn').off('click').on('click', () => this.startBatchActivation());
                $('#batchStopBtn').off('click').on('click', () => this.stopBatchActivation());
                $('#batchClearBtn').off('click').on('click', () => {
                    $('#batchKeyInput').val('');
                    this.addBatchLog('输入已清空', 'info');
                });
            }, 100);
        },

        /**
         * 开始批量激活
         */
        startBatchActivation() {
            if (this.state.batchRunning) return;

            const keyInput = $('#batchKeyInput').val().trim();
            if (!keyInput) {
                this.addBatchLog('请输入要激活的Key', 'error');
                return;
            }

            const keys = keyInput.split('\n')
                .map(key => key.trim())
                .filter(key => key.length > 0)
                .filter(key => /^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(key));

            if (keys.length === 0) {
                this.addBatchLog('未找到有效的Steam Key格式', 'error');
                return;
            }

            // 去重处理
            const uniqueKeys = [...new Set(keys)];
            const duplicateCount = keys.length - uniqueKeys.length;

            if (duplicateCount > 0) {
                this.addBatchLog(`检测到 ${duplicateCount} 个重复Key，已自动去重`, 'warning');
            }

            this.state.batchQueue = uniqueKeys;
            this.state.batchRunning = true;
            this.state.batchProgress = 0;
            this.state.batchTotal = uniqueKeys.length;
            this.state.batchLogs = [];

            this.updateBatchControls();
            this.updateBatchProgress();
            this.addBatchLog(`开始批量激活 ${uniqueKeys.length} 个Key`, 'info');

            this.processBatchQueue();
        },

        /**
         * 停止批量激活
         */
        stopBatchActivation() {
            if (!this.state.batchRunning) return;

            this.state.batchRunning = false;
            this.addBatchLog('批量激活已停止', 'warning');
            this.updateBatchControls();
            this.updateBatchProgress('已停止');
        },

        /**
         * 处理批量激活队列
         */
        async processBatchQueue() {
            for (let i = 0; i < this.state.batchQueue.length && this.state.batchRunning; i++) {
                const key = this.state.batchQueue[i];

                // 检查Key是否已经存在
                if (this.isKeyInCurrentCuratorHistory(key)) {
                    this.addBatchLog(`⏭️ 跳过重复Key: ${key}`, 'warning');
                    this.state.batchProgress++;
                    this.updateBatchProgress();
                    continue;
                }

                try {
                    this.addBatchLog(`正在激活: ${key}`, 'info');
                    this.updateBatchProgress(`激活中: ${key}`);

                    const result = await this.activateSingleKey(key);

                    // 创建统一的历史记录
                    const methodPrefix = this.state.config.activationMethod === 'asf' ? '批量激活-ASF' : '批量激活-网页';
                    const historyEntry = {
                        key: key,
                        timestamp: new Date().toISOString(),
                        method: methodPrefix,
                        result: result.success ? 'success' : 'failed',
                        message: result.detail,
                        detail: result.detail,
                        sub: result.sub || '',
                        subName: result.subName || ''
                    };

                    // 只添加一次记录
                    this.state.activationHistory.unshift(historyEntry);

                    if (result.success) {
                        this.addBatchLog(`✅ 激活成功: ${key} - ${result.detail}`, 'success');
                        this.state.processedKeys.push(key);
                        this.state.activationSuccessCount++;

                        // 批量激活时不显示成功弹窗，避免频繁弹窗
                    } else {
                        this.addBatchLog(`❌ 激活失败: ${key} - ${result.detail}`, 'error');
                    }

                } catch (error) {
                    this.addBatchLog(`❌ 激活异常: ${key} - ${error.message}`, 'error');

                    // 异常情况也记录一次
                    const historyEntry = {
                        key: key,
                        timestamp: new Date().toISOString(),
                        method: '批量激活-异常',
                        result: 'failed',
                        message: error.message,
                        detail: error.message,
                        sub: '',
                        subName: ''
                    };
                    this.state.activationHistory.unshift(historyEntry);
                }

                this.state.batchProgress++;
                this.updateBatchProgress();

                // 保存状态
                this.trimHistory();
                this.saveState();
                this.updateKeyCountDisplay();

                // 延时处理
                if (i < this.state.batchQueue.length - 1 && this.state.batchRunning) {
                    await this.delay(this.state.config.batchActivation.delayMs);
                }
            }

            if (this.state.batchRunning) {
                this.state.batchRunning = false;

                // 计算成功数量
                const successCount = this.state.batchQueue.filter((key, index) =>
                    index < this.state.batchProgress &&
                    this.state.batchLogs.some(log => log.includes(`✅ 激活成功: ${key}`))
                ).length;

                this.addBatchLog(`批量激活完成！成功: ${successCount}/${this.state.batchTotal}`, 'info');
                this.updateBatchProgress('完成');
            }

            this.updateBatchControls();
        },

        /**
         * 激活单个Key
         */
        async activateSingleKey(key) {
            if (this.state.config.activationMethod === 'asf') {
                const results = await this.activateWithASF([key]);
                return results[0] || { success: false, detail: 'ASF激活失败' };
            } else {
                const results = await this.activateWithWeb([key]);
                return results[0] || { success: false, detail: '网页激活失败' };
            }
        },

        /**
         * 更新批量激活控件状态
         */
        updateBatchControls() {
            $('#batchStartBtn').prop('disabled', this.state.batchRunning);
            $('#batchStopBtn').prop('disabled', !this.state.batchRunning);
        },

        /**
         * 更新批量激活进度
         */
        updateBatchProgress(status = '') {
            if (!this.state.config.batchActivation.showProgress) return;

            const progress = this.state.batchTotal > 0 ? (this.state.batchProgress / this.state.batchTotal) * 100 : 0;

            $('#batchProgressBar').css('width', `${progress}%`);
            $('#batchProgressText').text(`${this.state.batchProgress}/${this.state.batchTotal}`);

            if (status) {
                $('#batchStatusText').text(status);
            } else if (this.state.batchRunning) {
                $('#batchStatusText').text(`处理中... (${Math.round(progress)}%)`);
            } else {
                $('#batchStatusText').text('等待开始');
            }
        },

        /**
         * 添加批量激活日志
         */
        addBatchLog(message, type = 'info') {
            if (!this.state.config.batchActivation.showLogs) return;

            const logPanel = $('#batchLogPanel');
            if (logPanel.length === 0) return;

            const logEntry = $(`<div class="log-entry log-${type}">${message}</div>`);

            logPanel.append(logEntry);
            logPanel.scrollTop(logPanel[0].scrollHeight);

            this.state.batchLogs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
        },

        /********************
         * 设置界面
         ********************/

        /**
         * 显示设置界面
         */
        showSettings() {
            const content = `
                <div class="tab-container">
                    <div class="tab-buttons">
                        <button class="tab-button active" data-tab="activation">激活设置</button>
                        <button class="tab-button" data-tab="refresh">刷新设置</button>
                        <button class="tab-button" data-tab="batch">批量设置</button>
                        <button class="tab-button" data-tab="advanced">高级设置</button>
                    </div>

                    <div class="tab-content active" id="tab-activation">
                        ${this.createActivationSettingsTab()}
                    </div>

                    <div class="tab-content" id="tab-refresh">
                        ${this.createRefreshSettingsTab()}
                    </div>

                    <div class="tab-content" id="tab-batch">
                        ${this.createBatchSettingsTab()}
                    </div>

                    <div class="tab-content" id="tab-advanced">
                        ${this.createAdvancedSettingsTab()}
                    </div>
                </div>
            `;

            const modalId = this.createModal('设置', content, [
                {
                    text: '保存',
                    primary: true,
                    action: 'saveSettings'
                },
                {
                    text: '取消',
                    action: ''
                }
            ]);

            this.setupTabSwitching();
        },

        /**
         * 创建激活设置标签页
         */
        createActivationSettingsTab() {
            return `
                <div class="steam-form-group">
                    <label class="steam-form-label">检测前几个评测 (1-10)</label>
                    <input type="number" id="checkCount" class="steam-form-input" value="${this.state.config.checkCount}" min="1" max="10">
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">保留记录数量 (1-50)</label>
                    <input type="number" id="maxHistoryRecords" class="steam-form-input" value="${this.state.config.maxHistoryRecords}" min="1" max="50">
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">激活方式</label>
                    <select id="activationMethod" class="steam-form-select">
                        <option value="web" ${this.state.config.activationMethod === 'web' ? 'selected' : ''}>网页激活</option>
                        <option value="asf" ${this.state.config.activationMethod === 'asf' ? 'selected' : ''}>ASF激活</option>
                    </select>
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">表格文本溢出行为</label>
                    <select id="tableOverflowBehavior" class="steam-form-select">
                        <option value="default" ${this.state.config.tableOverflowBehavior === 'default' ? 'selected' : ''}>单行显示</option>
                        <option value="wrap" ${this.state.config.tableOverflowBehavior === 'wrap' ? 'selected' : ''}>换行显示</option>
                        <option value="ellipsis" ${this.state.config.tableOverflowBehavior === 'ellipsis' ? 'selected' : ''}>省略显示 (悬浮提示)</option>
                    </select>
                    <div style="font-size: 11px; color: #8f98a0; margin-top: 5px;">
                        选择"省略显示"时，单元格内容默认显示完整内容的悬浮提示
                    </div>
                </div>

                <div id="asfSettings" style="${this.state.config.activationMethod === 'asf' ? '' : 'display: none;'}">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div class="steam-form-group">
                            <label class="steam-form-label">协议</label>
                            <input type="text" id="asfProtocol" class="steam-form-input" value="${this.state.config.asfConfig.protocol}">
                        </div>
                        <div class="steam-form-group">
                            <label class="steam-form-label">主机</label>
                            <input type="text" id="asfHost" class="steam-form-input" value="${this.state.config.asfConfig.host}">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <div class="steam-form-group">
                            <label class="steam-form-label">端口</label>
                            <input type="text" id="asfPort" class="steam-form-input" value="${this.state.config.asfConfig.port}">
                        </div>
                        <div class="steam-form-group">
                            <label class="steam-form-label">Bot名称</label>
                            <input type="text" id="asfBot" class="steam-form-input" value="${this.state.config.asfConfig.bot}">
                        </div>
                    </div>
                    <div class="steam-form-group">
                        <label class="steam-form-label">密码</label>
                        <input type="password" id="asfPassword" class="steam-form-input" value="${this.state.config.asfConfig.password}">
                    </div>
                </div>

                <label class="steam-checkbox">
                    <input type="checkbox" id="autoActivateCheckbox" ${this.state.config.autoActivate ? 'checked' : ''}>
                    <span>自动激活新Key</span>
                </label>

                <label class="steam-checkbox">
                    <input type="checkbox" id="successPopupCheckbox" ${this.state.config.showSuccessPopup ? 'checked' : ''}>
                    <span>显示激活成功弹窗</span>
                </label>
            `;
        },

        /**
         * 创建刷新设置标签页
         */
        createRefreshSettingsTab() {
            return `
                <div class="steam-form-group">
                    <label class="steam-form-label">刷新间隔 (分钟)</label>
                    <input type="number" id="refreshInterval" class="steam-form-input" value="${this.state.config.refreshInterval / 60000}" min="1" max="1440">
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">随机延迟 (秒，0=禁用)</label>
                    <input type="number" id="randomDelay" class="steam-form-input" value="${this.state.config.randomDelay}" min="0" max="300">
                </div>

                <label class="steam-checkbox">
                    <input type="checkbox" id="backgroundRefreshCheckbox" ${this.state.config.backgroundRefresh ? 'checked' : ''}>
                    <span>启用后台刷新</span>
                </label>

                <div class="steam-form-group">
                    <label class="steam-form-label">刷新重试次数 (1-10)</label>
                    <input type="number" id="refreshRetryCount" class="steam-form-input" value="${this.state.config.refreshRetryCount}" min="1" max="10">
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">刷新重试延迟 (秒)</label>
                    <input type="number" id="refreshRetryDelay" class="steam-form-input" value="${this.state.config.refreshRetryDelay / 1000}" min="1" max="30">
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">最大刷新失败次数 (1-10)</label>
                    <input type="number" id="maxRefreshFailures" class="steam-form-input" value="${this.state.config.maxRefreshFailures}" min="1" max="10">
                </div>
            `;
        },

        /**
         * 创建批量设置标签页
         */
        createBatchSettingsTab() {
            return `
                <label class="steam-checkbox">
                    <input type="checkbox" id="batchEnabledCheckbox" ${this.state.config.batchActivation.enabled ? 'checked' : ''}>
                    <span>启用批量激活功能</span>
                </label>

                <div class="steam-form-group">
                    <label class="steam-form-label">激活间隔 (秒)</label>
                    <input type="number" id="batchDelayMs" class="steam-form-input" value="${this.state.config.batchActivation.delayMs / 1000}" min="1" max="30" step="0.5">
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">重试次数</label>
                    <input type="number" id="batchRetryCount" class="steam-form-input" value="${this.state.config.batchActivation.retryCount}" min="0" max="5">
                </div>

                <label class="steam-checkbox">
                    <input type="checkbox" id="batchShowProgressCheckbox" ${this.state.config.batchActivation.showProgress ? 'checked' : ''}>
                    <span>显示进度条</span>
                </label>

                <label class="steam-checkbox">
                    <input type="checkbox" id="batchShowLogsCheckbox" ${this.state.config.batchActivation.showLogs ? 'checked' : ''}>
                    <span>显示日志面板</span>
                </label>
            `;
        },

        /**
         * 创建高级设置标签页
         */
        createAdvancedSettingsTab() {
            return `
                <label class="steam-checkbox">
                    <input type="checkbox" id="notificationCheckbox" ${this.state.config.notification ? 'checked' : ''}>
                    <span>显示桌面通知</span>
                </label>

                <div class="steam-form-group">
                    <label class="steam-form-label">检查频率 (秒)</label>
                    <input type="number" id="checkFrequency" class="steam-form-input" value="${this.state.config.checkFrequency / 1000}" min="0.5" max="10" step="0.5">
                    <div style="font-size: 11px; color: #8f98a0; margin-top: 5px;">
                        设置标签页关闭控制和自动重开的检查频率
                    </div>
                </div>

                <label class="steam-checkbox">
                    <input type="checkbox" id="autoReopenCheckbox" ${this.state.config.autoReopen ? 'checked' : ''}>
                    <span>意外关闭时自动重开监控标签页</span>
                </label>

                <div id="autoReopenDelaySettings" style="${this.state.config.autoReopen ? '' : 'display: none;'}">
                    <div class="steam-form-group">
                        <label class="steam-form-label">自动重开标签页延迟 (秒)</label>
                        <input type="number" id="autoReopenDelay" class="steam-form-input" value="${this.state.config.autoReopenDelay / 1000}" min="0" max="10" step="0.5">
                    </div>
                </div>

                <label class="steam-checkbox">
                    <input type="checkbox" id="closeWithControlCheckbox" ${this.state.config.closeWithControl ? 'checked' : ''}>
                    <span>监控标签页随控制标签页一同关闭</span>
                </label>

                <div id="closeWithControlDelaySettings" style="${this.state.config.closeWithControl ? '' : 'display: none;'}">
                    <div class="steam-form-group">
                        <label class="steam-form-label">控制标签页一同关闭延迟 (秒)</label>
                        <input type="number" id="closeWithControlDelay" class="steam-form-input" value="${this.state.config.closeWithControlDelay / 1000}" min="0" max="10" step="0.1">
                    </div>
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">心跳间隔 (秒)</label>
                    <input type="number" id="heartbeatInterval" class="steam-form-input" value="${this.state.config.heartbeatInterval / 1000}" min="1" max="10">
                </div>

                <div class="steam-form-group">
                    <label class="steam-form-label">心跳超时 (秒)</label>
                    <input type="number" id="heartbeatTimeout" class="steam-form-input" value="${this.state.config.heartbeatTimeout / 1000}" min="5" max="60">
                </div>

                <label class="steam-checkbox">
                    <input type="checkbox" id="enableLoggingCheckbox" ${this.state.config.enableLogging ? 'checked' : ''}>
                    <span>启用详细日志 (控制台输出)</span>
                </label>

                <div style="margin-top: 20px; padding: 10px; background: #2a475e; border-radius: 4px;">
                    <div style="color: #66c0f4; font-weight: bold; margin-bottom: 5px;">危险操作</div>
                    <button id="clearAllHistoryBtn" class="steam-btn steam-btn-danger" style="width: 100%;">清空所有记录</button>
                </div>
            `;
        },

        /**
         * 设置标签页切换
         */
        setupTabSwitching() {
            $('.tab-button').off('click').on('click', function() {
                const tabId = $(this).data('tab');

                // 更新按钮状态
                $('.tab-button').removeClass('active');
                $(this).addClass('active');

                // 更新内容显示
                $('.tab-content').removeClass('active');
                $(`#tab-${tabId}`).addClass('active');
            });

            // ASF设置显示/隐藏
            $('#activationMethod').off('change').on('change', function() {
                const asfSettings = $('#asfSettings');
                if (this.value === 'asf') {
                    asfSettings.show();
                } else {
                    asfSettings.hide();
                }
            });

            // 自动重开延迟设置显示/隐藏
            $('#autoReopenCheckbox').off('change').on('change', function() {
                const autoReopenDelaySettings = $('#autoReopenDelaySettings');
                if (this.checked) {
                    autoReopenDelaySettings.show();
                } else {
                    autoReopenDelaySettings.hide();
                }
            });

            // 一同关闭延迟设置显示/隐藏
            $('#closeWithControlCheckbox').off('change').on('change', function() {
                const closeWithControlDelaySettings = $('#closeWithControlDelaySettings');
                if (this.checked) {
                    closeWithControlDelaySettings.show();
                } else {
                    closeWithControlDelaySettings.hide();
                }
            });

            // 清空所有记录按钮
            $('#clearAllHistoryBtn').off('click').on('click', () => {
                this.showClearAllHistoryConfirm();
            });
        },

        /**
         * 保存设置
         */
        saveSettings() {
            // 激活设置
            this.state.config.checkCount = Math.min(10, Math.max(1, parseInt($('#checkCount').val()) || 1));
            this.state.config.maxHistoryRecords = Math.min(50, Math.max(1, parseInt($('#maxHistoryRecords').val()) || 10));
            this.state.config.activationMethod = $('#activationMethod').val();
            this.state.config.tableOverflowBehavior = $('#tableOverflowBehavior').val();

            if (this.state.config.activationMethod === 'asf') {
                this.state.config.asfConfig = {
                    protocol: $('#asfProtocol').val(),
                    host: $('#asfHost').val(),
                    port: $('#asfPort').val(),
                    password: $('#asfPassword').val(),
                    bot: $('#asfBot').val()
                };
            }
            this.state.config.autoActivate = $('#autoActivateCheckbox').is(':checked');
            this.state.config.showSuccessPopup = $('#successPopupCheckbox').is(':checked');

            // 刷新设置
            this.state.config.refreshInterval = parseInt($('#refreshInterval').val()) * 60000;
            this.state.config.randomDelay = parseInt($('#randomDelay').val()) || 0;
            this.state.config.backgroundRefresh = $('#backgroundRefreshCheckbox').is(':checked');
            this.state.config.refreshRetryCount = Math.min(10, Math.max(1, parseInt($('#refreshRetryCount').val()) || 3));
            this.state.config.refreshRetryDelay = parseInt($('#refreshRetryDelay').val()) * 1000;
            this.state.config.maxRefreshFailures = Math.min(10, Math.max(1, parseInt($('#maxRefreshFailures').val()) || 5));

            // 批量设置
            this.state.config.batchActivation.enabled = $('#batchEnabledCheckbox').is(':checked');
            this.state.config.batchActivation.delayMs = (parseFloat($('#batchDelayMs').val()) || 2) * 1000;
            this.state.config.batchActivation.retryCount = Math.min(5, Math.max(0, parseInt($('#batchRetryCount').val()) || 2));
            this.state.config.batchActivation.showProgress = $('#batchShowProgressCheckbox').is(':checked');
            this.state.config.batchActivation.showLogs = $('#batchShowLogsCheckbox').is(':checked');

            // 高级设置
            this.state.config.notification = $('#notificationCheckbox').is(':checked');
            this.state.config.checkFrequency = (parseFloat($('#checkFrequency').val()) || 2) * 1000;
            this.state.config.autoReopen = $('#autoReopenCheckbox').is(':checked');
            this.state.config.autoReopenDelay = (parseFloat($('#autoReopenDelay').val()) || 2) * 1000;
            this.state.config.closeWithControl = $('#closeWithControlCheckbox').is(':checked');
            this.state.config.closeWithControlDelay = (parseFloat($('#closeWithControlDelay').val()) || 0) * 1000;
            this.state.config.heartbeatInterval = parseInt($('#heartbeatInterval').val()) * 1000;
            this.state.config.heartbeatTimeout = parseInt($('#heartbeatTimeout').val()) * 1000;
            this.state.config.enableLogging = $('#enableLoggingCheckbox').is(':checked');

            this.saveConfig();
            this.trimHistory();

            if (this.state.isMonitoringTab) {
                if (this.state.isRunning) {
                    this.restartMonitoring(false);
                }
            }

            this.showNotification('设置已保存', '配置更新成功', false);
        },

        /********************
         * 工具函数
         ********************/

        /**
         * 创建模态框
         */
        createModal(title, content, buttons = []) {
            const overlay = $('.steam-overlay');
            const modalId = 'modal-' + Date.now();

            const modal = $(`
                <div id="${modalId}" class="steam-modal">
                    <div class="steam-modal-header">
                        <div class="steam-modal-title">${title}</div>
                        <button class="steam-modal-close" data-modal-id="${modalId}">×</button>
                    </div>
                    <div class="steam-modal-content">${content}</div>
                    ${buttons.length > 0 ? `
                    <div class="steam-modal-footer">
                        ${buttons.map(btn => `
                            <button class="steam-btn ${btn.primary ? 'steam-btn-primary' : ''} ${btn.danger ? 'steam-btn-danger' : ''}"
                                    data-modal-id="${modalId}" data-action="${btn.action || ''}">${btn.text}</button>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            `);

            $('body').append(modal);
            overlay.show();
            modal.show();

            modal.find('.steam-modal-close[data-modal-id]').off('click').on('click', function() {
                const modalId = $(this).data('modal-id');
                SteamActivator.closeModal(modalId);
            });

            modal.find('.steam-btn[data-modal-id]').off('click').on('click', function() {
                const modalId = $(this).data('modal-id');
                const action = $(this).data('action');

                if (action) {
                    if (typeof SteamActivator[action] === 'function') {
                        SteamActivator[action]();
                    }
                }

                SteamActivator.closeModal(modalId);
            });

            this.state.activeModals.add(modalId);
            return modalId;
        },

        /**
         * 关闭模态框
         */
        closeModal(modalId) {
            $(`#${modalId}`).remove();
            this.state.activeModals.delete(modalId);

            if (this.state.activeModals.size === 0) {
                $('.steam-overlay').hide();
            }
        },

        /**
         * 关闭所有模态框
         */
        closeAllModals() {
            this.state.activeModals.forEach(modalId => {
                $(`#${modalId}`).remove();
            });
            this.state.activeModals.clear();
            $('.steam-overlay').hide();
        },

        /**
         * 显示激活历史
         */
        showActivationHistory() {
            if (this.state.activationHistory.length === 0) {
                this.createModal('激活记录', '暂无激活记录', [
                    {
                        text: '确定',
                        primary: true,
                        action: ''
                    }
                ]);
                return;
            }

            const tableHTML = this.generateTableHTML(this.state.activationHistory, '激活记录');
            this.createModal('激活记录', tableHTML, [
                {
                    text: '确定',
                    primary: true,
                    action: ''
                }
            ]);
        },

        /**
          * 生成表格HTML
          */
        generateTableHTML(data, title) {
            // 根据设置确定表格显示模式
            let tableMode = 'table-default';
            if (this.state.config.tableOverflowBehavior === 'wrap') {
                tableMode = 'table-wrap';
            } else if (this.state.config.tableOverflowBehavior === 'ellipsis') {
                tableMode = 'table-ellipsis';
            }

            const isEllipsisMode = this.state.config.tableOverflowBehavior === 'ellipsis';

            return `
        <div class="steam-table-container ${tableMode}">
            <table class="steam-table">
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>Key</th>
                        <th>方式</th>
                        <th>结果</th>
                        <th>详情</th>
                        <th>Sub</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((entry, index) => {
                let timeText;
                try {
                    const date = new Date(entry.timestamp);
                    timeText = isNaN(date.getTime()) ? '时间错误' : date.toLocaleString();
                } catch (e) {
                    timeText = '时间错误';
                }

                const keyText = entry.key || '';
                const methodText = entry.method || '未知方式';
                const resultText = entry.result === 'success' ? '成功' : (entry.result === 'found' ? '发现' : '失败');
                const detailText = entry.detail || entry.message || '';
                const subText = entry.sub ? `${entry.sub} ${entry.subName || ''}` : '——';

                // 为省略模式添加data-fulltext属性
                const timeAttr = isEllipsisMode ? `data-fulltext="${this.escapeHtml(timeText)}"` : '';
                const keyAttr = isEllipsisMode ? `data-fulltext="${this.escapeHtml(keyText)}"` : '';
                const methodAttr = isEllipsisMode ? `data-fulltext="${this.escapeHtml(methodText)}"` : '';
                const resultAttr = isEllipsisMode ? `data-fulltext="${this.escapeHtml(resultText)}"` : '';
                const detailAttr = isEllipsisMode ? `data-fulltext="${this.escapeHtml(detailText)}"` : '';
                const subAttr = isEllipsisMode ? `data-fulltext="${this.escapeHtml(subText)}"` : '';

                return `
                        <tr>
                            <td class="time-cell" ${timeAttr}>${timeText}</td>
                            <td ${keyAttr}><code>${keyText}</code></td>
                            <td ${methodAttr}>${methodText}</td>
                            <td class="${entry.result === 'success' ? 'success' : (entry.result === 'found' ? '' : 'failed')}" ${resultAttr}>
                                ${resultText}
                            </td>
                            <td ${detailAttr}>${detailText}</td>
                            <td class="game-name-cell" ${subAttr}>
                                ${entry.sub ?
                    `<a href="https://steamdb.info/sub/${entry.sub}/" target="_blank">${entry.sub} ${entry.subName || ''}</a>` :
                '——'
            }
                            </td>
                        </tr>
                    `}).join('')}
                </tbody>
            </table>
            <div style="margin-top: 10px; font-size: 11px; color: #8f98a0; text-align: center;">
                总计激活Key数量: ${this.state.processedKeys.length}
            </div>
        </div>
    `;
        },
        /**
         * HTML转义函数
         */
        escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
        },

        /**
         * 显示清空历史确认
         */
        showClearHistoryConfirm() {
            const content = `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 16px; margin-bottom: 10px;">⚠️ 确认清空</div>
                    <div>确定要清空当前鉴赏家(${this.state.curatorName})的所有激活记录吗？此操作不可撤销。</div>
                </div>
            `;

            this.createModal('确认操作', content, [
                {
                    text: '清空',
                    danger: true,
                    action: 'clearHistory'
                },
                {
                    text: '取消',
                    action: ''
                }
            ]);
        },

        /**
         * 显示清空所有历史确认
         */
        showClearAllHistoryConfirm() {
            const content = `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 16px; margin-bottom: 10px;">⚠️ 确认清空所有记录</div>
                    <div>确定要清空<strong>所有鉴赏家</strong>的所有激活记录吗？此操作不可撤销。</div>
                </div>
            `;

            this.createModal('确认操作', content, [
                {
                    text: '清空所有',
                    danger: true,
                    action: 'clearAllHistory'
                },
                {
                    text: '取消',
                    action: ''
                }
            ]);
        },

        /**
         * 清空当前鉴赏家历史记录
         */
        clearHistory() {
            this.state.activationHistory = [];
            this.state.processedKeys = [];
            this.saveState();
            this.updateKeyCountDisplay();
            this.showNotification('记录已清空', `鉴赏家 ${this.state.curatorName} 的所有激活记录已被清除`, false);
        },

        /**
         * 清空所有鉴赏家历史记录
         */
        clearAllHistory() {
            try {
                const allKeys = GM_listValues();
                let deletedCount = 0;

                allKeys.forEach(key => {
                    if (key.startsWith('processedKeys_') || key.startsWith('activationHistory_') || key.startsWith('lastStartNotificationTime_') || key.startsWith('monitoringTabId_') || key.startsWith('isMonitoringRunning_') || key.startsWith('monitoringTabLastUpdate_') || key.startsWith('userStopped_') || key.startsWith('controlPageClosed_') || key.startsWith('monitoringTabLastHeartbeat_') || key.startsWith('pageRefreshing_') || key.startsWith('refreshStartTime_')) {
                        GM_deleteValue(key);
                        deletedCount++;
                    }
                });

                this.state.activationHistory = [];
                this.state.processedKeys = [];
                this.state.lastStartNotificationTime = 0;
                this.state.isRunning = false;
                this.updateKeyCountDisplay();
                this.updateStatusDisplay();

                this.showNotification('所有记录已清空', `已清除 ${deletedCount} 个鉴赏家的激活记录`, false);

            } catch (error) {
                this.log('清空所有记录时出错:', error);
                this.showNotification('操作失败', '清空所有记录时出现错误，请查看控制台', false);
            }
        },

        /**
         * 提取Key从HTML
         */
        extractKeysFromHTML(html) {
            const keys = [];
            const regex = /([A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5})/g;
            let match;

            while ((match = regex.exec(html)) !== null) {
                keys.push(match[1]);
            }

            return [...new Set(keys)];
        },

        /**
         * 检查Key是否在当前鉴赏家历史中
         */
        isKeyInCurrentCuratorHistory(key) {
            if (this.state.processedKeys.includes(key)) {
                return true;
            }

            for (const record of this.state.activationHistory) {
                if (record.key === key) {
                    return true;
                }
            }

            return false;
        },

        /**
         * 加载Session ID
         */
        loadSessionID() {
            try {
                if (typeof g_sessionID !== 'undefined') {
                    this.state.sessionID = g_sessionID;
                }
            } catch (e) {
                const match = document.cookie.match(/sessionid=([^;]+)/);
                if (match) {
                    this.state.sessionID = match[1];
                }
            }
        },

        /**
         * 确保有效的Session
         */
        ensureValidSession() {
            return new Promise((resolve, reject) => {
                if (this.state.sessionID) {
                    resolve();
                } else {
                    this.loadSessionID();
                    if (this.state.sessionID) {
                        resolve();
                    } else {
                        reject(new Error('No valid session'));
                    }
                }
            });
        },

        /**
         * 格式化倒计时
         */
        formatCountdown(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            if (minutes > 0) {
                return `${minutes}分${remainingSeconds}秒`;
            } else {
                return `${remainingSeconds}秒`;
            }
        },

        /**
         * 延时函数
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * 日志函数
         */
        log(...args) {
            if (this.state.config.enableLogging) {
                console.log('[SteamActivator]', ...args);
            }
        },

        /**
         * 显示通知
         */
        showNotification(title, message, autoFocus = false) {
            if (this.state.config.notification && typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: title,
                    text: message,
                    timeout: 4000,
                    highlight: true,
                    onclick: function() {
                        if (autoFocus) {
                            window.focus();
                        }
                    }
                });
            }
        },

        /**
         * 显示激活成功通知（只在设置开启时显示）
         */
        showActivationSuccessNotification(gameInfo, method) {
            if (!this.state.config.showSuccessPopup) return;

            const title = `${this.state.curatorName}-激活成功`;
            const text = gameInfo;

            // 桌面通知
            if (this.state.config.notification) {
                GM_notification({
                    title: title,
                    text: text,
                    timeout: 5000,
                    highlight: true,
                    onclick: function() {
                        window.focus();
                    }
                });
            }

            // 弹窗通知
            this.createModal('激活成功', `
                <div style="text-align: center; padding: 20px;">
                    <div style="color: #90ba3c; font-size: 24px; margin-bottom: 10px;">✓</div>
                    <div style="font-size: 16px; margin-bottom: 10px;">激活成功！</div>
                    <div style="color: #8f98a0;">${text}</div>
                </div>
            `, [
                {
                    text: '确定',
                    primary: true,
                    action: ''
                }
            ]);

            this.state.activationSuccessCount++;
            this.log(`激活成功通知已发送: ${title} - ${text}`);
        },

        /**
         * 更新Key计数显示
         */
        updateKeyCountDisplay() {
            $('#keyCount').text(this.state.processedKeys.length);
        },

        /**
         * 保存配置
         */
        saveConfig() {
            GM_setValue('config', this.state.config);
        },

        /**
         * 保存状态
         */
        saveState() {
            GM_setValue(`processedKeys_${this.state.curatorId}`, this.state.processedKeys);
            GM_setValue(`activationHistory_${this.state.curatorId}`, this.state.activationHistory);
            GM_setValue(`lastStartNotificationTime_${this.state.curatorId}`, this.state.lastStartNotificationTime);
        },

        /**
         * 清理历史记录
         */
        trimHistory() {
            if (this.state.activationHistory.length > this.state.config.maxHistoryRecords) {
                this.state.activationHistory = this.state.activationHistory.slice(0, this.state.config.maxHistoryRecords);
            }
            if (this.state.processedKeys.length > this.state.config.maxHistoryRecords * 2) {
                this.state.processedKeys = this.state.processedKeys.slice(0, this.state.config.maxHistoryRecords * 2);
            }
        },

        /**
         * 设置菜单命令
         */
        setupMenuCommands() {
            GM_registerMenuCommand('打开控制面板', () => this.showPanel());
            if (this.state.isMonitoringTab) {
                GM_registerMenuCommand('暂停/继续监控', () => this.toggleMonitoring());
                GM_registerMenuCommand('立即刷新页面', () => this.manualRefresh());
            } else {
                GM_registerMenuCommand('开始监控', () => this.startMonitoringTab());
                GM_registerMenuCommand('停止监控', () => this.stopMonitoringTab());
            }
            GM_registerMenuCommand('批量激活Key', () => this.showBatchActivation());
            GM_registerMenuCommand('查看激活记录', () => this.showActivationHistory());
            GM_registerMenuCommand('打开设置', () => this.showSettings());
        },

        /********************
         * 监控功能
         ********************/

        /**
         * 开始监控
         */
        startMonitoring() {
            if (this.state.isRunning) return;

            this.state.isRunning = true;
            GM_setValue(`userStopped_${this.state.curatorId}`, false);

            if (this.state.isMonitoringTab) {
                GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, true);
                GM_setValue(`monitoringTabLastUpdate_${this.state.curatorId}`, Date.now());
                GM_setValue(`monitoringTabLastHeartbeat_${this.state.curatorId}`, Date.now());
            }

            this.updateStatusDisplay();
            this.checkForNewKeys();

            if (this.state.isMonitoringTab) {
                this.setupOptimizedTimers();
            }
        },

        /**
         * 停止监控
         */
        stopMonitoring(showNotificationFlag = true) {
            if (!this.state.isRunning) return;

            this.state.isRunning = false;

            if (this.state.isMonitoringTab) {
                GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, false);
            }

            this.updateStatusDisplay();

            if (this.state.nextRefreshTime) {
                this.state.remainingTime = this.state.nextRefreshTime - Date.now();
            }

            this.cleanupAllTimers();

            this.state.refreshRetryCount = 0;
            this.state.refreshFailureCount = 0;
            this.state.currentRefreshMethodIndex = 0;
            this.state.isRefreshing = false;

            if (this.state.config.notification && showNotificationFlag && this.state.isMonitoringTab) {
                this.showNotification('自动激活已暂停', '点击继续按钮重新启动', false);
            }
        },

        /**
         * 切换监控状态
         */
        toggleMonitoring() {
            if (this.state.isRunning) {
                this.stopMonitoring(true);
            } else {
                this.startMonitoring();
                if (this.state.isMonitoringTab) {
                    this.showOptimizedStartNotification();
                }
            }
        },

        /**
         * 立即刷新页面
         */
        manualRefresh() {
            if (this.state.config.enableLogging) {
                console.log('手动刷新页面');
            }
            this.state.lastUserActionTime = Date.now();
            this.state.refreshFailureCount = 0;
            this.state.refreshRetryCount = 0;
            this.state.currentRefreshMethodIndex = 0;
            if (this.state.config.notification) {
                this.showNotification('立即刷新', '正在执行手动刷新页面', false);
            }
            this.performReliableRefresh();
        },

        /**
         * 启动监控标签页
         */
        startMonitoringTab() {
            const baseUrl = window.location.href.split('?')[0];
            const currentUrl = baseUrl + '?autoRedeem=true';

            GM_setValue(`controlPageClosed_${this.state.curatorId}`, false);
            GM_setValue(`userStopped_${this.state.curatorId}`, false);

            const existingTabId = GM_getValue(`monitoringTabId_${this.state.curatorId}`, null);
            if (existingTabId) {
                const isHeartbeatAlive = this.checkHeartbeat();

                if (isHeartbeatAlive) {
                    try {
                        // 使用存储的tabId来查找标签页
                        const existingTab = window.open('', existingTabId);
                        if (existingTab && !existingTab.closed) {
                            this.showNotification('监控已运行', '监控标签页已在运行中', false);
                            this.state.isRunning = true;
                            GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, true);
                            this.updateStatusDisplay();
                            return;
                        }
                    } catch (e) {
                        if (this.state.config.enableLogging) {
                            console.log('无法访问现有标签页，将创建新标签页');
                        }
                    }
                } else {
                    if (this.state.config.enableLogging) {
                        console.log('现有监控标签页心跳已停止，将创建新标签页');
                    }
                    GM_setValue(`monitoringTabId_${this.state.curatorId}`, null);
                }
            }

            const tabId = 'steam_auto_redeem_' + this.state.curatorId + '_' + Date.now();

            GM_setValue(`monitoringTabId_${this.state.curatorId}`, tabId);
            GM_setValue(`monitoringTabLastUpdate_${this.state.curatorId}`, Date.now());
            GM_setValue(`monitoringTabLastHeartbeat_${this.state.curatorId}`, Date.now());
            GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, true);

            const newTab = window.open(currentUrl, tabId);

            if (newTab) {
                this.showNotification('监控已启动', '已在新的标签页中启动自动激活功能', false);
                this.state.isRunning = true;
                this.updateStatusDisplay();

                this.checkTabClosed(newTab, tabId);
            } else {
                this.showNotification('启动失败', '无法打开新标签页，请允许弹窗', false);
                GM_setValue(`monitoringTabId_${this.state.curatorId}`, null);
                GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, false);
            }
        },

        /**
         * 停止监控标签页
         */
        stopMonitoringTab() {
            GM_setValue(`userStopped_${this.state.curatorId}`, true);

            const tabId = GM_getValue(`monitoringTabId_${this.state.curatorId}`, null);
            if (tabId) {
                try {
                    // 使用存储的tabId来关闭标签页
                    const monitoringTab = window.open('', tabId);
                    if (monitoringTab && !monitoringTab.closed) {
                        monitoringTab.close();
                        this.log(`成功关闭监控标签页: ${tabId}`);
                    } else {
                        this.log(`监控标签页已关闭或无法访问: ${tabId}`);
                    }
                } catch (e) {
                    if (this.state.config.enableLogging) {
                        console.log('无法直接关闭监控标签页:', e);
                    }
                }

                // 清理状态
                GM_setValue(`monitoringTabId_${this.state.curatorId}`, null);
                GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, false);
                GM_setValue(`monitoringTabLastHeartbeat_${this.state.curatorId}`, 0);
                GM_setValue(`pageRefreshing_${this.state.curatorId}`, false);
            }

            this.state.isRunning = false;
            this.updateStatusDisplay();
            this.showNotification('监控已停止', '已停止自动激活功能', false);
        },

        /**
         * 重新启动监控
         */
        restartMonitoring(showPauseNotification = true) {
            this.stopMonitoring(showPauseNotification);
            setTimeout(() => {
                this.startMonitoring();
            }, 1000);
        },

        /**
         * 定时器设置
         */
        setupOptimizedTimers() {
            this.cleanupAllTimers();

            const now = Date.now();
            let nextRefreshTime;

            if (this.state.nextRefreshTime && this.state.nextRefreshTime > now) {
                nextRefreshTime = this.state.nextRefreshTime;
            } else {
                const randomDelay = this.state.config.randomDelay > 0 ?
                    Math.floor(Math.random() * this.state.config.randomDelay * 1000) : 0;
                nextRefreshTime = now + this.state.config.refreshInterval + randomDelay;

                if (randomDelay > 0 && this.state.config.enableLogging) {
                    console.log(`添加随机延迟: ${randomDelay/1000}秒`);
                }
            }

            this.state.nextRefreshTime = nextRefreshTime;

            this.state.refreshTimer = setInterval(() => {
                if (!document.hidden) {
                    this.performReliableRefresh();
                } else {
                    if (this.state.config.backgroundRefresh) {
                        this.performReliableRefresh();
                    } else if (this.state.config.enableLogging) {
                        console.log('后台刷新已禁用，等待页面回到前台');
                    }
                }
            }, this.state.config.refreshInterval);

            this.startCountdown();

            if (this.state.config.backgroundRefresh && document.hidden) {
                this.startBackgroundRefreshCheck();
            }
        },

        /**
         * 开始倒计时
         */
        startCountdown() {
            if (this.state.countdownTimer) {
                clearInterval(this.state.countdownTimer);
            }

            if (this.state.remainingTime && this.state.remainingTime > 0) {
                this.state.nextRefreshTime = Date.now() + this.state.remainingTime;
                this.state.remainingTime = null;
            } else if (!this.state.nextRefreshTime) {
                const randomDelay = this.state.config.randomDelay > 0 ?
                    Math.floor(Math.random() * this.state.config.randomDelay * 1000) : 0;
                this.state.nextRefreshTime = Date.now() + this.state.config.refreshInterval + randomDelay;

                if (randomDelay > 0 && this.state.config.enableLogging) {
                    console.log(`添加随机延迟: ${randomDelay/1000}秒`);
                }
            }

            this.updateCountdownDisplay();
            this.state.countdownTimer = setInterval(this.updateCountdownDisplay.bind(this), 1000);
        },

        /**
         * 更新倒计时显示
         */
        updateCountdownDisplay() {
            if (!this.state.nextRefreshTime) return;

            const now = Date.now();
            const timeLeft = this.state.nextRefreshTime - now;

            if (timeLeft <= 0) {
                $('#nextRefresh').text('0秒');
                this.performReliableRefresh();
            } else {
                $('#nextRefresh').text(this.formatCountdown(timeLeft));
            }
        },

        /**
         * 执行刷新操作
         */
        performReliableRefresh() {
            if (this.state.isRefreshing) {
                if (this.state.config.enableLogging) {
                    console.log('刷新操作正在进行中，跳过重复刷新');
                }
                return;
            }

            if (this.state.config.enableLogging) {
                console.log(`执行刷新操作，重试次数: ${this.state.refreshRetryCount}, 失败次数: ${this.state.refreshFailureCount}, 当前方法次数: ${this.state.currentRefreshMethodIndex}`);
            }

            if (this.state.refreshFailureCount >= this.state.config.maxRefreshFailures) {
                if (this.state.config.enableLogging) {
                    console.log('刷新失败次数过多，启动备用方案');
                }
                this.openNewTabAndCloseCurrent();
                return;
            }

            this.state.isRefreshing = true;

            const currentMethod = this.state.config.refreshMethods[this.state.currentRefreshMethodIndex];

            if (!currentMethod || !this.refreshMethods[currentMethod]) {
                if (this.state.config.enableLogging) {
                    console.log('无效的刷新方法，重置索引');
                }
                this.state.currentRefreshMethodIndex = 0;
                this.state.isRefreshing = false;
                setTimeout(() => this.performReliableRefresh(), 1000);
                return;
            }

            if (this.state.config.enableLogging) {
                console.log(`尝试刷新方法: ${currentMethod} (${this.state.currentRefreshMethodIndex + 1}/${this.state.config.refreshMethods.length})`);
            }

            this.refreshMethods[currentMethod]()
                .then(() => {
                    if (this.state.config.enableLogging) {
                        console.log(`刷新方法 ${currentMethod} 执行成功`);
                    }
                    this.state.refreshFailureCount = 0;
                    this.state.refreshRetryCount = 0;
                    this.state.currentRefreshMethodIndex = 0;
                    this.state.lastRefreshSuccessTime = Date.now();
                    this.state.isRefreshing = false;
                })
                .catch((error) => {
                    if (this.state.config.enableLogging) {
                        console.log(`刷新方法 ${currentMethod} 失败:`, error);
                    }
                    this.state.refreshFailureCount++;
                    this.state.refreshRetryCount++;
                    this.state.isRefreshing = false;

                    this.state.currentRefreshMethodIndex++;

                    if (this.state.currentRefreshMethodIndex >= this.state.config.refreshMethods.length) {
                        this.state.currentRefreshMethodIndex = 0;
                        if (this.state.config.enableLogging) {
                            console.log('所有刷新方法都尝试完毕，等待重试');
                        }

                        if (this.state.refreshRetryCount <= this.state.config.refreshRetryCount) {
                            if (this.state.config.enableLogging) {
                                console.log(`等待 ${this.state.config.refreshRetryDelay/1000} 秒后重试 (${this.state.refreshRetryCount}/${this.state.config.refreshRetryCount})`);
                            }
                            setTimeout(() => this.performReliableRefresh(), this.state.config.refreshRetryDelay);
                        } else {
                            if (this.state.config.enableLogging) {
                                console.log('刷新重试次数用尽，启动备用方案');
                            }
                            this.openNewTabAndCloseCurrent();
                        }
                    } else {
                        if (this.state.config.enableLogging) {
                            console.log('立即尝试下一个刷新方法');
                        }
                        setTimeout(() => this.performReliableRefresh(), 1000);
                    }
                });
        },

        /**
         * 打开新标签页并关闭当前标签页
         */
        openNewTabAndCloseCurrent() {
            if (this.state.config.enableLogging) {
                console.log('启动备用方案：在新标签页中打开页面');
            }

            const baseUrl = window.location.href.split('?')[0];
            const currentUrl = baseUrl + '?autoRedeem=true';
            const newTab = window.open(currentUrl, '_blank');

            if (newTab) {
                this.showNotification('刷新失败', '已在新标签页中打开页面', false);

                this.state.refreshFailureCount = 0;
                this.state.refreshRetryCount = 0;
                this.state.currentRefreshMethodIndex = 0;

                if (this.state.isMonitoringTab) {
                    setTimeout(() => {
                        try {
                            window.close();
                        } catch (e) {
                            if (this.state.config.enableLogging) {
                                console.log('无法关闭标签页，请手动关闭:', e);
                            }
                        }
                    }, 2000);
                }
            } else {
                this.showNotification('刷新失败', '无法打开新标签页，请手动刷新页面或检查弹窗设置', false);
                if (this.state.config.enableLogging) {
                    console.log('新标签页被阻止，请允许弹窗或手动操作');
                }

                this.state.refreshFailureCount = 0;
                this.state.refreshRetryCount = 0;
            }
        },

        /**
         * 启动后台刷新检查
         */
        startBackgroundRefreshCheck() {
            if (this.state.backgroundRefreshTimer) {
                clearInterval(this.state.backgroundRefreshTimer);
            }

            this.state.backgroundRefreshTimer = setInterval(() => {
                if (document.hidden && this.state.isRunning) {
                    const now = Date.now();
                    GM_setValue(`monitoringTabLastUpdate_${this.state.curatorId}`, now);

                    if (this.state.nextRefreshTime && now >= this.state.nextRefreshTime) {
                        if (this.state.config.enableLogging) {
                            console.log('后台刷新时间到达，执行刷新');
                        }
                        this.performReliableRefresh();
                    }

                    this.state.lastActiveTime = now;
                }
            }, 45000);
        },

        /**
         * 启动心跳机制
         */
        startHeartbeat() {
            if (!this.state.isMonitoringTab) return;

            if (this.state.heartbeatTimer) {
                clearInterval(this.state.heartbeatTimer);
            }

            const updateHeartbeat = () => {
                const now = Date.now();
                this.state.lastHeartbeat = now;

                try {
                    GM_setValue(`monitoringTabLastHeartbeat_${this.state.curatorId}`, now);
                    GM_setValue(`monitoringTabLastUpdate_${this.state.curatorId}`, now);

                    if (this.state.pageLoaded) {
                        GM_setValue(`pageRefreshing_${this.state.curatorId}`, false);
                    }

                    if (this.state.isRunning) {
                        GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, true);
                    }
                } catch (e) {
                    if (this.state.config.enableLogging) {
                        console.error('更新心跳失败:', e);
                    }
                }
            };

            updateHeartbeat();
            this.state.heartbeatTimer = setInterval(updateHeartbeat, this.state.config.heartbeatInterval);
        },

        /**
         * 停止心跳机制
         */
        stopHeartbeat() {
            if (this.state.heartbeatTimer) {
                clearInterval(this.state.heartbeatTimer);
                this.state.heartbeatTimer = null;
            }

            try {
                GM_setValue(`monitoringTabLastHeartbeat_${this.state.curatorId}`, 0);
                GM_setValue(`pageRefreshing_${this.state.curatorId}`, false);
            } catch (e) {
                if (this.state.config.enableLogging) {
                    console.error('清除心跳状态失败:', e);
                }
            }
        },

        /**
         * 检查心跳状态
         */
        checkHeartbeat() {
            if (this.state.isMonitoringTab) return true;

            const lastHeartbeat = GM_getValue(`monitoringTabLastHeartbeat_${this.state.curatorId}`, 0);
            const now = Date.now();
            const timeSinceLastHeartbeat = now - lastHeartbeat;

            // 刷新保护期
            if (lastHeartbeat > now) {
                return true;
            }

            return timeSinceLastHeartbeat <= this.state.config.heartbeatTimeout;
        },

        /**
         * 刷新前更新心跳时间
         */
        updateHeartbeatBeforeRefresh() {
            if (!this.state.isMonitoringTab) return;

            const now = Date.now();
            const futureTime = now + 60000;

            try {
                GM_setValue(`monitoringTabLastHeartbeat_${this.state.curatorId}`, futureTime);
                GM_setValue(`monitoringTabLastUpdate_${this.state.curatorId}`, now);
                GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, true);
            } catch (e) {
                if (this.state.config.enableLogging) {
                    console.error('设置刷新前心跳失败:', e);
                }
            }

            if (this.state.config.enableLogging) {
                console.log('刷新前更新心跳时间，设置60秒保护期');
            }
        },

        /**
         * 显示启动通知（一小时内只显示一次）
         */
        showOptimizedStartNotification() {
            if (!this.state.config.notification) return;

            const now = Date.now();
            const oneHour = 60 * 60 * 1000;

            if (now - this.state.lastStartNotificationTime > oneHour) {
                this.showNotification(
                    '自动激活已启动',
                    `每${this.state.config.refreshInterval/60000}分钟刷新一次页面`,
                    true
                );
                this.state.lastStartNotificationTime = now;
                GM_setValue(`lastStartNotificationTime_${this.state.curatorId}`, now);
            }
        },

        /**
         * 检查标签页是否关闭
         */
        checkTabClosed(tab, tabId) {
            const checkInterval = setInterval(() => {
                if (tab.closed) {
                    clearInterval(checkInterval);
                    if (this.state.config.enableLogging) {
                        console.log('监控标签页已关闭');
                    }
                    GM_setValue(`monitoringTabId_${this.state.curatorId}`, null);
                    GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, false);
                    this.state.isRunning = false;
                    this.updateStatusDisplay();

                    if (this.state.config.autoReopen && !GM_getValue(`userStopped_${this.state.curatorId}`, false)) {
                        this.showNotification('监控标签页已关闭', `将在${this.state.config.autoReopenDelay/1000}秒后自动重新打开监控标签页`, false);
                        setTimeout(() => {
                            this.startMonitoringTab();
                        }, this.state.config.autoReopenDelay);
                    } else {
                        this.showNotification('监控已停止', '监控标签页已被关闭', false);
                    }
                }
            }, this.state.config.checkFrequency);
        },

        /**
         * 启动控制页面检查
         */
        startControlPageCheck() {
            if (!this.state.isMonitoringTab) return;

            const controlCheckInterval = setInterval(() => {
                const controlClosed = GM_getValue(`controlPageClosed_${this.state.curatorId}`, false);
                if (controlClosed) {
                    if (this.state.config.enableLogging) {
                        console.log('检测到控制页面已关闭，自动关闭监控页面');
                    }
                    clearInterval(controlCheckInterval);
                    this.stopMonitoring(false);

                    if (this.state.config.closeWithControl) {
                        setTimeout(() => {
                            try {
                                window.close();
                            } catch (e) {
                                if (this.state.config.enableLogging) {
                                    console.log('无法关闭监控标签页:', e);
                                }
                            }
                        }, this.state.config.closeWithControlDelay);
                    }
                }
            }, this.state.config.checkFrequency);
        },

        /**
         * 启动监控状态检查
         */
        startMonitoringStatusCheck() {
            if (this.state.monitoringTabCheckInterval) {
                clearInterval(this.state.monitoringTabCheckInterval);
            }

            this.state.monitoringTabCheckInterval = setInterval(() => {
                const now = Date.now();
                // 减少检查频率，避免频繁更新
                if (now - this.state.lastStatusCheck > 5000) {
                    this.updateStatusFromStorage();
                    this.updateHeartbeatDisplay();
                    this.state.lastStatusCheck = now;
                }
            }, 10000);
        },

        /**
         * 从存储更新状态
         */
        updateStatusFromStorage() {
            const isRunning = GM_getValue(`isMonitoringRunning_${this.state.curatorId}`, false);
            const isHeartbeatAlive = this.checkHeartbeat();

            // 只有当两者都为true时才认为真正在运行
            const actualRunning = isRunning && isHeartbeatAlive;

            if (this.state.isRunning !== actualRunning) {
                this.state.isRunning = actualRunning;
                this.updateStatusDisplay();
            }

            this.updateHeartbeatDisplay();
        },

        /**
         * 设置控制页面可见性处理
         */
        setupControlPageVisibilityHandler() {
            if (this.state.isMonitoringTab) return;

            const visibilityHandler = function() {
                if (!document.hidden) {
                    // 页面变为可见时立即更新状态
                    if (SteamActivator.state.config.enableLogging) {
                        console.log('控制页面变为可见，立即更新状态');
                    }
                    SteamActivator.updateStatusFromStorage();
                }
            };

            this.addEventListener(document, 'visibilitychange', visibilityHandler);

            // 同时监听页面焦点事件
            this.addEventListener(window, 'focus', function() {
                if (SteamActivator.state.config.enableLogging) {
                    console.log('控制页面获得焦点，更新状态');
                }
                setTimeout(() => SteamActivator.updateStatusFromStorage(), 100);
            });
        },

        /**
         * 更新心跳显示状态
         */
        updateHeartbeatDisplay() {
            if (this.state.isMonitoringTab) return;

            const isAlive = this.checkHeartbeat();
            const heartbeatIndicator = $('.heartbeat-indicator');
            if (heartbeatIndicator.length) {
                heartbeatIndicator.toggleClass('heartbeat-alive', isAlive);
                heartbeatIndicator.toggleClass('heartbeat-dead', !isAlive);
                heartbeatIndicator.attr('title', isAlive ? '心跳正常' : '心跳停止');
            }

            const heartbeatText = $('.heartbeat-status-text');
            if (heartbeatText.length) {
                heartbeatText.text(isAlive ? '正常' : '停止');
            }
        },

        /**
         * 确保控制页面显示停止状态
         */
        ensureStoppedState() {
            if (!this.state.isMonitoringTab) {
                const isActuallyRunning = GM_getValue(`isMonitoringRunning_${this.state.curatorId}`, false);
                const isHeartbeatAlive = this.checkHeartbeat();

                // 只有当心跳停止且存储状态为停止时才设为停止
                if (!isActuallyRunning && !isHeartbeatAlive) {
                    this.state.isRunning = false;
                    GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, false);
                    this.updateStatusDisplay();
                } else if (isActuallyRunning && isHeartbeatAlive) {
                    this.state.isRunning = true;
                    this.updateStatusDisplay();
                }
                // 如果状态不一致，保持当前状态，等待下一次检查
            }
        },

        /**
         * 状态显示更新
         */
        updateStatusDisplay() {
            if (this.state.isMonitoringTab) {
                $('#status').html(`
                    ${this.state.isRunning ? '运行中' : '已暂停'}
                    <span class="status-indicator ${this.state.isRunning ? 'status-running' : 'status-stopped'}"></span>
                `);
                $('#toggleBtn').text(this.state.isRunning ? '暂停' : '继续');
                $('#toggleBtn').toggleClass('steam-btn-primary', this.state.isRunning);
            } else {
                const isHeartbeatAlive = this.checkHeartbeat();
                const isActuallyRunning = GM_getValue(`isMonitoringRunning_${this.state.curatorId}`, false);

                // 只有当两者都为true时才显示运行中
                const displayRunning = isActuallyRunning && isHeartbeatAlive;

                $('#status').html(`
                    ${displayRunning ? '运行中' : '已停止'}
                    <span class="status-indicator ${displayRunning ? 'status-running' : 'status-stopped'}"></span>
                `);

                if (displayRunning) {
                    $('#startBtn').hide();
                    $('#stopBtn').show();
                } else {
                    $('#startBtn').show();
                    $('#stopBtn').hide();
                }

                // 更新心跳文本显示
                $('.heartbeat-status-text').text(isHeartbeatAlive ? '正常' : '停止');
            }

            this.updateHeartbeatDisplay();
        },

        /**
         * 清理所有定时器
         */
        cleanupAllTimers() {
            const timers = [
                'refreshTimer', 'countdownTimer', 'backgroundRefreshTimer',
                'monitoringTabCheckInterval', 'heartbeatTimer', 'reopenTimer'
            ];

            timers.forEach(timerName => {
                if (this.state[timerName]) {
                    if (timerName === 'reopenTimer') {
                        clearTimeout(this.state[timerName]);
                    } else {
                        clearInterval(this.state[timerName]);
                    }
                    this.state[timerName] = null;
                }
            });

            if (this.state.dragAnimationFrame) {
                cancelAnimationFrame(this.state.dragAnimationFrame);
                this.state.dragAnimationFrame = null;
            }
        },

        /**
         * 清理事件监听器
         */
        cleanupEventListeners() {
            this.state.eventListeners.forEach(({ element, event, handler }) => {
                element.removeEventListener(event, handler);
            });
            this.state.eventListeners = [];
        },

        /**
         * 清理资源
         */
        cleanup() {
            this.cleanupAllTimers();
            this.cleanupEventListeners();
            this.forceHideTooltip();

            // 移除悬浮框元素
            if (this.state.tooltipElement) {
                this.state.tooltipElement.remove();
                this.state.tooltipElement = null;
            }

            // 保存状态
            if (this.state.isRunning && this.state.nextRefreshTime) {
                this.state.remainingTime = this.state.nextRefreshTime - Date.now();
                this.saveState();
            }

            // 清理监控标签页状态
            if (this.state.isMonitoringTab) {
                GM_setValue(`monitoringTabLastUpdate_${this.state.curatorId}`, Date.now());
                this.stopHeartbeat();
                // 不清理monitoringTabId，以便控制页面可以找到
                GM_setValue(`isMonitoringRunning_${this.state.curatorId}`, false);
            }

            // 清理控制页面状态
            if (!this.state.isMonitoringTab) {
                GM_setValue(`controlPageClosed_${this.state.curatorId}`, true);
            }
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => SteamActivator.init());
    } else {
        SteamActivator.init();
    }

})();
