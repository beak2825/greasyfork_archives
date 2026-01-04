// ==UserScript==
// @name         POE国服市集助手
// @namespace    http://tampermonkey.net/
// @version      5.3.4.7
// @description  同时支持poe1 poe2
// @author
// @match        https://poe.game.qq.com/trade/search/*
// @match        https://poe.game.qq.com/trade2/search/*
// @icon         https://poecdn.game.qq.com/protected/image/favicon/tencent/apple-touch-icon.png?key=-wEde9G2wrNA77kQJxAbrg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/557439/POE%E5%9B%BD%E6%9C%8D%E5%B8%82%E9%9B%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557439/POE%E5%9B%BD%E6%9C%8D%E5%B8%82%E9%9B%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


GM_addStyle(`
/* 全局间隔输入框样式 */
#tas-global-interval {
    background: #1a1a1a !important;
    border: 2px solid #4CAF50 !important;
    color: #4CAF50 !important;
    font-weight: bold !important;
}

/* 禁用状态的输入框 */
#tas-interval:disabled {
    background: #333 !important;
    color: #888 !important;
    cursor: not-allowed !important;
}

/* 随机时间复选框禁用状态 */
#tas-random-interval:disabled + label {
    color: #777 !important;
    cursor: not-allowed !important;
}
@keyframes tas-logo-rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

#tas-startup-logo {
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 60px !important;
    height: 60px !important;
    cursor: pointer !important;
    z-index: 10000 !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
    border-radius: 50% !important;
    border: 3px solid #fff !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: all 0.3s ease !important;
    animation: tas-logo-rotate 3s linear infinite !important;
    overflow: hidden !important;
}

#tas-startup-logo:hover {
    animation-duration: 1s !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
    transform: scale(1.1) !important;
    border-color: #4CAF50 !important;
}

#tas-startup-logo img {
    width: 50px !important;
    height: 50px !important;
    object-fit: cover !important;
    border-radius: 50% !important;
    border: 2px solid rgba(255,255,255,0.8) !important;
}
`);
(function() {
    'use strict';

    // --- 日志记录器 ---
    const Logger = {
        logs: [],
        LOG_LIFETIME: 5 * 60 * 1000,
        pruneOldLogs() { const now = Date.now(); this.logs = this.logs.filter(log => now - log.timestamp < this.LOG_LIFETIME); },
        log(message, color = 'white', weight = 'normal') {
            this.pruneOldLogs();
            const timeStr = new Date().toLocaleTimeString('en-GB', { hour12: false });
            const logEntry = { timestamp: Date.now(), message: `[${timeStr}] ${message}` };
            this.logs.push(logEntry);
            console.log(`%c${logEntry.message}`, `color: ${color}; font-weight: ${weight};`);
        },
        exportLogs() {
            try {
                this.pruneOldLogs();
                const logContent = `==== POE Trade Alert Log ====\nVersion: ${GM_info.script.version}\nURL: ${window.location.href}\nTimestamp: ${new Date().toISOString()}\n=============================\n\n` + this.logs.map(log => log.message).join('\r\n');
                const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `poe_trade_alert_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                this.log('日志已导出。', 'cyan', 'bold');
            } catch (e) { this.log(`日志导出失败: ${e.message}`, 'red', 'bold'); alert('日志导出失败，详情请查看控制台。'); }
        },
        error(error, context = '未知上下文') { this.log(`[错误] 在 ${context} 中: ${error.message}\nStack: ${error.stack}`, 'red', 'bold'); }
    };

    // --- 全局变量 ---
    const ALL_CONFIGS_KEY = 'poeTradeAlertAllConfigs';
    let allConfigs = {}, config = {};
    let pageId = null, pageContextPath = null;
    let isRunning = false, isConfigDirty = false, isFetchingResults = false;
    let searchIntervalId = null, countdownIntervalId = null, urlCheckIntervalId = null;
    let nextSearchTime = 0, audioContext = null, resultsObserver = null;
    let currentPath = window.location.pathname;
    let lastTeleportTime = 0;
    let lastSearchTime = 0;
    let isLeaderTab = false;
    let leaderTabId = null;

    const CURRENCY_MAP = { 'divine': { name: '神圣石', key: 'divineThreshold' }, 'exalted': { name: '崇高石', key: 'exaltedThreshold' }, 'chaos': { name: '混沌石', key: 'chaosThreshold' }, 'alch': { name: '点金石', key: 'alchThreshold' } };

    // --- 函数定义区 ---
    function extractPageInfo() { /* ... */ }
    function updateUIFromConfig() { /* ... */ }
    function clearDirtyFlag() { /* ... */ }
    function loadConfigs() { /* ... */ }
    function buildSavedSearchesUI() { /* ... */ }
    function startSearch() { /* ... */ }
    function stopSearch() { /* ... */ }
    function saveConfig() { /* ... */ }
    function markAsDirty() { /* ... */ }
    function playAlertSound() { /* ... */ }
    function handleFileSelect() { /* ... */ }
    function parseResults() { /* ... */ }
    function performSearch() { /* ... */ }
    function toggleSearch() { /* ... */ }
    function updateStatus(text, color) { /* ... */ }
    function startCountdown() { /* ... */ }
    function stopCountdown() { /* ... */ }
    function updateCountdown() { /* ... */ }
    function createUIPanel() { /* ... */ }
    function makeDraggable(el) { /* ... */ }
    function bindUIEvents() { /* ... */ }
    function cleanup() { /* ... */ }
    function run() { /* ... */ }
    function onUrlChange() { /* ... */ }
    function exportLinks() { /* ... */ }
    function init() { /* ... */ }

    // --- 完整函数实现 ---
    const CoordinationManager = {
        STORAGE_KEY: 'poe_trade_alert_coordination',
        LEADER_KEY: 'poe_trade_alert_leader',
        HEARTBEAT_INTERVAL: 2000, // 心跳间隔2秒
        LEADER_TIMEOUT: 5000,     // leader超时5秒

        // 生成唯一的标签页ID
        getTabId() {
            let tabId = sessionStorage.getItem('poe_trade_alert_tab_id');
            if (!tabId) {
                tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                sessionStorage.setItem('poe_trade_alert_tab_id', tabId);
            }
            return tabId;
        },

        // 获取当前标签页ID
        tabId: null,

        // 初始化
        init() {
            this.tabId = this.getTabId();
            Logger.log(`当前标签页ID: ${this.tabId}`, 'lightblue');

            // 监听storage事件
            window.addEventListener('storage', this.handleStorageEvent.bind(this));

            // 发送心跳
            setInterval(() => this.sendHeartbeat(), this.HEARTBEAT_INTERVAL);

            // 检查leader状态
            this.checkLeaderStatus();
        },

        // 处理storage事件
        handleStorageEvent(event) {
            if (event.key === this.LEADER_KEY) {
                const leaderData = this.getLeaderData();
                if (leaderData && leaderData.tabId !== this.tabId) {
                    leaderTabId = leaderData.tabId;
                    isLeaderTab = false;
                    Logger.log(`检测到leader标签页: ${leaderTabId}`, 'cyan');
                }
            }
        },

        // 获取leader数据
        getLeaderData() {
            try {
                const data = localStorage.getItem(this.LEADER_KEY);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        },

        // 设置leader数据
        setLeaderData(data) {
            try {
                localStorage.setItem(this.LEADER_KEY, JSON.stringify(data));
            } catch (e) {
                Logger.error(e, 'setLeaderData');
            }
        },

        // 发送心跳
        sendHeartbeat() {
            if (isLeaderTab) {
                const leaderData = {
                    tabId: this.tabId,
                    timestamp: Date.now(),
                    url: window.location.href
                };
                this.setLeaderData(leaderData);
            }
        },

        // 检查leader状态
        checkLeaderStatus() {
            const leaderData = this.getLeaderData();
            const now = Date.now();

            if (!leaderData) {
                // 没有leader，自己成为leader
                this.becomeLeader();
            } else if (leaderData.tabId === this.tabId) {
                // 自己就是leader
                isLeaderTab = true;
                leaderTabId = this.tabId;
                Logger.log('本标签页是leader', 'green');
            } else if (now - leaderData.timestamp > this.LEADER_TIMEOUT) {
                // leader超时，接管成为leader
                Logger.log(`leader ${leaderTabId} 超时，接管成为leader`, 'orange');
                this.becomeLeader();
            } else {
                // 其他标签页是活跃的leader
                leaderTabId = leaderData.tabId;
                isLeaderTab = false;
            }
        },

        // 成为leader
        becomeLeader() {
            isLeaderTab = true;
            leaderTabId = this.tabId;
            const leaderData = {
                tabId: this.tabId,
                timestamp: Date.now(),
                url: window.location.href
            };
            this.setLeaderData(leaderData);
            Logger.log('成为协调leader', 'green', 'bold');
        },
        getAllActiveTabs() {
            try {
                const data = localStorage.getItem(this.LEADER_KEY);
                const allTabs = {};

                // 检查心跳数据
                const now = Date.now();
                const TIMEOUT = 10000; // 10秒超时

                // 遍历所有存储的标签页数据
                const leaderData = data ? JSON.parse(data) : null;
                if (leaderData && (now - leaderData.timestamp < TIMEOUT)) {
                    allTabs[leaderData.tabId] = leaderData;
                }

                // 可以添加其他标签页的检测逻辑
                return allTabs;
            } catch (e) {
                return {};
            }
        },

        // 获取协调的搜索时间
        getCoordinatedSearchTime(baseInterval) {
            // 计算基于页面ID的哈希值
            const hash = this.hashString(pageId || this.tabId);
            const offset = (hash % 1000) / 1000; // 0-1之间的偏移

            // 如果是leader，使用固定时间；如果是follower，添加随机偏移
            let interval = baseInterval;
            if (!isLeaderTab) {
                // follower页面添加随机偏移（0.5-1.5秒）
                const randomOffset = 0.5 + (Math.random() * 1);
                interval = baseInterval + randomOffset;

                // 再添加基于哈希的固定偏移（避免所有follower同时）
                const hashOffset = offset * 2; // 0-2秒
                interval += hashOffset;
            }

            // 确保最小间隔
            interval = Math.max(interval, 3);

            Logger.log(`协调搜索间隔: ${interval.toFixed(1)}s (${isLeaderTab ? 'leader' : 'follower'})`, 'lightblue');
            return interval;
        },

        // 字符串哈希函数
        hashString(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash);
        },

        // 清理（标签页关闭时）
        cleanup() {
            if (isLeaderTab) {
                localStorage.removeItem(this.LEADER_KEY);
            }
        }

    };

    extractPageInfo = function() {
        const urlPath = window.location.pathname;
        const oldPageId = pageId;
        let foundId = null, foundPath = null;
        let gameVersion = urlPath.includes('/trade2/') ? 'poe2' : 'poe1';

        // 提取页面ID（最后一个路径部分）
        const pathParts = urlPath.split('/');
        if (pathParts.length > 0) {
            foundId = pathParts[pathParts.length - 1];
        }

        // 提取路径（去除开头的/trade或/trade2和结尾的ID）
        const pathMatch = urlPath.match(/\/trade2?\/search\/(.+)\/[^/]+$/);
        if (pathMatch) foundPath = pathMatch[1];

        // 构建带版本前缀的pageId
        if (foundId) {
            pageId = `${gameVersion}_${foundId}`;
        } else {
            pageId = null;
        }
        pageContextPath = foundPath;

        if (oldPageId && pageId && oldPageId !== pageId) {
            Logger.log(`页面ID已变更: ${oldPageId} -> ${pageId}`, 'orange');
        }

        Logger.log(`页面解析 - 原始ID: ${foundId}, 存储ID: ${pageId}, 路径: ${pageContextPath}, 版本: ${gameVersion.toUpperCase()}`, 'lightblue');
    };

    updateUIFromConfig = function() {
        if (!document.getElementById('tas-panel')) return;

        // 设置页面搜索间隔
        const pageIntervalInput = document.getElementById('tas-page-interval');
        if (pageIntervalInput) {
            pageIntervalInput.value = config.pageSearchInterval || 10;
        }

        // 设置全局排队间隔
        const globalIntervalInput = document.getElementById('tas-global-interval');
        if (globalIntervalInput) {
            globalIntervalInput.value = config.globalQueueInterval || 6;
        }

        // 修改：当前页面间隔设为只读显示
        document.getElementById('tas-interval').value = config.interval;
        document.getElementById('tas-interval').disabled = true;
        document.getElementById('tas-interval').title = "当前使用页面搜索间隔";

        document.getElementById('tas-divine').value = config.divineThreshold;
        document.getElementById('tas-exalted').value = config.exaltedThreshold;
        document.getElementById('tas-chaos').value = config.chaosThreshold;
        document.getElementById('tas-alch').value = config.alchThreshold;
        document.getElementById('tas-auto-teleport').checked = config.autoTeleport;
        document.getElementById('tas-double-teleport').checked = config.doubleTeleport;
        document.getElementById('tas-teleport-cooldown').value = config.teleportCooldown;
        document.getElementById('tas-remark').value = config.remark;
        document.getElementById('tas-random-interval').checked = config.randomInterval;
        document.getElementById('tas-random-min').value = config.randomMin;
        document.getElementById('tas-random-max').value = config.randomMax;

        const fileLabel = document.querySelector('label[for="tas-audio-file"]');
        if (fileLabel) {
            fileLabel.textContent = config.audioBase64 ? '已选择音频' : '选择音频文件';
            fileLabel.style.color = config.audioBase64 ? '#4CAF50' : 'inherit';
        }

        const panel = document.getElementById('tas-panel');
        panel.classList.toggle('tas-collapsed', config.isCollapsed);
        document.getElementById('tas-toggle-collapse').textContent = config.isCollapsed ? '[+]' : '[—]';

        const autoTeleportCheckbox = document.getElementById('tas-auto-teleport');
        const doubleTeleportCheckbox = document.getElementById('tas-double-teleport');
        const doubleTeleportGroup = document.getElementById('tas-double-teleport-group');
        const teleportCooldownGroup = document.getElementById('tas-teleport-cooldown-group');

        if (autoTeleportCheckbox && autoTeleportCheckbox.checked) {
            if (doubleTeleportGroup) doubleTeleportGroup.style.display = 'flex';
            if (teleportCooldownGroup) teleportCooldownGroup.style.display = 'flex';
        } else {
            if (doubleTeleportGroup) doubleTeleportGroup.style.display = 'none';
            if (teleportCooldownGroup) teleportCooldownGroup.style.display = 'none';
            if (doubleTeleportCheckbox) doubleTeleportCheckbox.checked = false;
        }

        // 修复：随机时间相关控件的显示/隐藏逻辑
        const randomIntervalCheckbox = document.getElementById('tas-random-interval');
        const randomMinGroup = document.getElementById('tas-random-min-group');
        const randomMaxGroup = document.getElementById('tas-random-max-group');
        const intervalGroup = document.querySelector('label[for="tas-interval"]')?.parentElement;
        const intervalInput = document.getElementById('tas-interval');
        const randomMinInput = document.getElementById('tas-random-min');
        const randomMaxInput = document.getElementById('tas-random-max');

        if (randomIntervalCheckbox) {
            randomIntervalCheckbox.checked = config.randomInterval;

            // 强制禁用随机时间复选框
            randomIntervalCheckbox.disabled = true;
            randomIntervalCheckbox.title = "多开模式下随机时间已禁用";

            if (config.randomInterval) {
                // 启用随机时间时：显示随机时间选项，隐藏固定间隔
                if (randomMinGroup) randomMinGroup.style.display = 'flex';
                if (randomMaxGroup) randomMaxGroup.style.display = 'flex';
                if (randomMinInput) randomMinInput.disabled = false;
                if (randomMaxInput) randomMaxInput.disabled = false;

                // 隐藏固定间隔
                if (intervalGroup) intervalGroup.style.display = 'none';
                if (intervalInput) intervalInput.disabled = true;
            } else {
                // 禁用随机时间时：隐藏随机时间选项，显示固定间隔
                if (randomMinGroup) randomMinGroup.style.display = 'none';
                if (randomMaxGroup) randomMaxGroup.style.display = 'none';
                if (randomMinInput) randomMinInput.disabled = true;
                if (randomMaxInput) randomMaxInput.disabled = true;

                // 显示固定间隔
                if (intervalGroup) intervalGroup.style.display = 'flex';
                if (intervalInput) intervalInput.disabled = false;
            }
        }
    };  // 这里只需要一个结束括号，删除了多余的嵌套函数

    clearDirtyFlag = function() {
        isConfigDirty = false;
        const saveButton = document.getElementById('tas-save-btn');
        if (saveButton) saveButton.classList.remove('tas-dirty');
    };

    loadConfigs = function() {
        const defaultConfig = {
            interval: 20,  // 页面搜索间隔（弃用）
            divineThreshold: 0,
            exaltedThreshold: 0,
            chaosThreshold: 0,
            alchThreshold: 0,
            audioBase64: null,
            remark: '',
            isCollapsed: false,
            path: null,
            autoTeleport: false,
            doubleTeleport: false,
            teleportCooldown: 5,
            randomInterval: false,           // 强制设为false
            randomMin: 15,                   // 最小随机时间
            randomMax: 30,                   // 最大随机时间
            globalQueueInterval: 6,          // 全局排队间隔（新）
            pageSearchInterval: 10           // 页面搜索间隔（新）
        };
        allConfigs = GM_getValue(ALL_CONFIGS_KEY, {});

        // 版本兼容性：如果加载旧配置没有gameVersion，自动推断
        if (allConfigs[pageId] && !allConfigs[pageId].gameVersion) {
            allConfigs[pageId].gameVersion = pageId.startsWith('poe2_') ? 'poe2' : 'poe1';
            Logger.log(`自动为旧配置添加版本标识: ${allConfigs[pageId].gameVersion}`, 'yellow');
        }

        const hasExistingConfig = !!allConfigs[pageId];

        config = { ...defaultConfig, ...(allConfigs[pageId] || {}) };
        allConfigs[pageId] = config;

        if (hasExistingConfig) {
            Logger.log(`为页面ID ${pageId} 加载已有配置。备注: ${config.remark || '无'} (${config.gameVersion.toUpperCase()})`, 'lightblue');
        } else {
            Logger.log(`为页面ID ${pageId} 创建新配置。`, 'lightblue');
        }

        updateUIFromConfig();
        clearDirtyFlag();
    };

    buildSavedSearchesUI = function() {
        const listContainer = document.getElementById('tas-saved-list');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        // 获取当前页面的游戏版本
        const currentGameVersion = window.location.pathname.includes('/trade2/') ? 'poe2' : 'poe1';
        // 只显示当前游戏版本的配置
        const filteredIds = Object.keys(allConfigs).filter(id => {
            const config = allConfigs[id];
            return config.gameVersion === currentGameVersion;
        }).sort((a, b) => (allConfigs[a].remark || a).localeCompare(allConfigs[b].remark || b));
        if (filteredIds.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; padding: 10px; color: #888;">当前版本无已存配置</div>';
            return;
        }
        filteredIds.forEach(id => {
            const savedConfig = allConfigs[id];
            const realPageId = id.replace(/^(poe[12]_)/, '');
            const displayName = savedConfig.remark || `(无备注) ${realPageId}`;
            const item = document.createElement('a');
            item.className = 'tas-saved-item';
            item.dataset.id = id;
            if (savedConfig.path) {
                const basePath = savedConfig.gameVersion === 'poe2' ? '/trade2' : '/trade';
                item.href = `${basePath}/search/${savedConfig.path}/${realPageId}`;
            } else {
                item.className += ' disabled';
                item.title = '旧配置无路径信息，无法跳转';
                item.addEventListener('click', e => e.preventDefault());
            }
            item.innerHTML = `<span class="tas-saved-item-name" title="${displayName}\nID: ${realPageId}">${displayName}</span><span class="tas-saved-item-delete" title="删除此配置">X</span>`;
            item.querySelector('.tas-saved-item-delete').addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                if (confirm(`确定要删除配置 "${displayName}" 吗？此操作无法撤销。`)) {
                    delete allConfigs[id];
                    GM_setValue(ALL_CONFIGS_KEY, allConfigs);
                    buildSavedSearchesUI();
                }
            });
            listContainer.appendChild(item);
        });
        Logger.log(`显示 ${currentGameVersion.toUpperCase()} 版本的配置，共 ${filteredIds.length} 个`, 'lightblue');
    };
    saveConfig = function() {
        const oldPageId = pageId;
        extractPageInfo(); // 重新提取页面信息，确保包含版本标识
        Logger.log(`保存时，根据当前URL ${window.location.href} 确认页面ID为 ${pageId}`, 'lightblue');

        const autoTeleportElem = document.getElementById('tas-auto-teleport');
        const doubleTeleportElem = document.getElementById('tas-double-teleport');
        const randomIntervalElem = document.getElementById('tas-random-interval');

        const autoTeleport = autoTeleportElem ? autoTeleportElem.checked : false;

        const getNumericValue = (elementId, defaultValue) => {
            const elem = document.getElementById(elementId);
            if (!elem) return defaultValue;
            const value = parseFloat(elem.value);
            return isNaN(value) ? defaultValue : value;
        };

        const newConfigData = {
            interval: 20,  // 保持原值，但实际不再使用
            divineThreshold: getNumericValue('tas-divine', 9999),
            exaltedThreshold: getNumericValue('tas-exalted', 9999),
            chaosThreshold: getNumericValue('tas-chaos', 9999),
            alchThreshold: getNumericValue('tas-alch', 9999),
            autoTeleport: autoTeleport,
            doubleTeleport: autoTeleport && doubleTeleportElem ? doubleTeleportElem.checked : false,
            teleportCooldown: getNumericValue('tas-teleport-cooldown', 5),
            remark: document.getElementById('tas-remark') ? document.getElementById('tas-remark').value.trim() : '',
            path: pageContextPath,
            audioBase64: config.audioBase64,
            isCollapsed: config.isCollapsed,
            gameVersion: pageId.startsWith('poe2_') ? 'poe2' : 'poe1',
            randomInterval: false,  // 强制禁用随机时间
            randomMin: getNumericValue('tas-random-min', 15),
            randomMax: getNumericValue('tas-random-max', 30),
            globalQueueInterval: getNumericValue('tas-global-interval', 6),  // 全局排队间隔
            pageSearchInterval: getNumericValue('tas-page-interval', 10)     // 页面搜索间隔
        };

        if (oldPageId && pageId && oldPageId !== pageId && allConfigs[oldPageId]) {
            Logger.log(`配置迁移: 从 ${oldPageId} 移动到 ${pageId}`, 'orange');
            delete allConfigs[oldPageId];
        }
        config = newConfigData;
        allConfigs[pageId] = config;
        GM_setValue(ALL_CONFIGS_KEY, allConfigs);
        Logger.log(`[配置已保存] 新配置已保存到ID: ${pageId} (${config.gameVersion.toUpperCase()})`, 'lightgreen', 'bold');
        clearDirtyFlag();
        const saveButton = document.getElementById('tas-save-btn');
        if (saveButton) {
            saveButton.textContent = '已保存!';
            setTimeout(() => {
                if (saveButton) saveButton.textContent = '保存设置';
            }, 2000);
        }
        if (isRunning) {
            stopSearch();
            startSearch();
        }
        buildSavedSearchesUI();
    };
    markAsDirty = function() {
        isConfigDirty = true;
        const saveButton = document.getElementById('tas-save-btn');
        if (saveButton) saveButton.classList.add('tas-dirty');
    }

    playAlertSound = function() {
        if (!config.audioBase64) {
            Logger.log('警报：未设置音频文件。', 'orange');
            updateStatus('发现低价! (未设置音频)', 'red');
            return;
        }
        const audio = new Audio(config.audioBase64);
        audio.play().catch(e => Logger.error(e, 'playAlertSound'));
    };

    handleFileSelect = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            config.audioBase64 = e.target.result;
            document.querySelector('label[for="tas-audio-file"]').textContent = '已选择: ' + file.name;
            document.querySelector('label[for="tas-audio-file"]').style.color = '#4CAF50';
            markAsDirty();
        };
        reader.readAsDataURL(file);
    };

    parseResults = function() {
        isFetchingResults = false; // [STATE LOCK] 解锁
        Logger.log('开始解析结果... (状态锁已解除)');
        updateStatus('正在解析结果...', 'orange');
        document.querySelectorAll('.tas-found-item').forEach(el => el.classList.remove('tas-found-item'));
        const itemRows = document.querySelectorAll('.resultset > .row:not(.row-total)');
        if (itemRows.length === 0) { updateStatus(isRunning ? '等待下一次搜索...' : '已停止 (无结果)', isRunning ? 'lightblue' : 'white'); return; }

        let foundLowPrice = false;
        let teleportButtonClicked = false;

        // 检查冷却时间
        const now = Date.now();
        const cooldownRemaining = (lastTeleportTime + (config.teleportCooldown * 1000)) - now;
        if (cooldownRemaining > 0) {
            Logger.log(`传送冷却中，剩余 ${Math.ceil(cooldownRemaining / 1000)} 秒`, 'yellow');
        }

        itemRows.forEach((row) => {
            const priceContainer = row.querySelector('.price span[data-field="price"]');
            if (!priceContainer) return;
            const currencyImgEl = priceContainer.querySelector('.currency-image img');
            if (!currencyImgEl || !currencyImgEl.alt) return;
            const currencyAlt = currencyImgEl.getAttribute('alt').toLowerCase();
            const currencyInfo = CURRENCY_MAP[currencyAlt];
            if (!currencyInfo) return;
            let amount = NaN;
            for (const node of priceContainer.childNodes) {
                if (node.nodeType === 3 && /^\d+(\.\d+)?$/.test(node.textContent.trim())) { amount = parseFloat(node.textContent.trim()); break; }
            }
            if (isNaN(amount)) {
                for (const span of priceContainer.querySelectorAll('span')) {
                    if (span.children.length === 0 && /^\d+(\.\d+)?$/.test(span.textContent.trim())) { amount = parseFloat(span.textContent.trim()); break; }
                }
            }
            if (isNaN(amount)) return;
            const threshold = config[currencyInfo.key];

            if (amount <= threshold) {
                Logger.log(`发现低价物品! 价格: ${amount} ${currencyInfo.name}, 阈值: <= ${threshold}`, 'lightgreen', 'bold');
                row.classList.add('tas-found-item');
                foundLowPrice = true;

                // 检查冷却时间，避免连续点击
                if (!teleportButtonClicked && config.autoTeleport && cooldownRemaining <= 0) {
                    const teleportButton = row.querySelector('.direct-btn');
                    if (teleportButton && !teleportButton.disabled) {
                        teleportButtonClicked = true;
                        lastTeleportTime = now; // 记录点击时间
                        teleportButton.click();
                        Logger.log(`自动点击 [前往藏身处] 按钮，进入 ${config.teleportCooldown} 秒冷却`, 'lime', 'bold');
                        updateStatus(`已自动前往! ${config.teleportCooldown}秒冷却`, 'lime');

                        if (config.doubleTeleport) {
                            setTimeout(() => {
                                if (teleportButton) {
                                    teleportButton.click();
                                    Logger.log('第二次点击 [前往藏身处] 按钮。', 'lime', 'bold');
                                }
                            }, 500);
                        }
                    } else {
                        Logger.log('找到低价物品，但无法点击 [前往藏身处] 按钮 (可能不存在或被禁用)。', 'orange');
                    }
                } else if (config.autoTeleport && cooldownRemaining > 0) {
                    Logger.log(`跳过自动传送，冷却时间剩余 ${Math.ceil(cooldownRemaining / 1000)} 秒`, 'yellow');
                }
            }
        });

        if (foundLowPrice) {
            playAlertSound();
            if (!teleportButtonClicked && cooldownRemaining <= 0) {
                updateStatus(`发现低价! 等待下次搜索...`, 'lightgreen');
            } else if (!teleportButtonClicked && cooldownRemaining > 0) {
                updateStatus(`发现低价! (冷却中)`, 'orange');
            }
        } else {
            updateStatus(isRunning ? `等待下一次搜索...` : '已停止 (未发现低价)', isRunning ? 'lightblue' : 'white');
        }
    };

    performSearch = function() {
        // =============== 改进的全局锁排队系统 ===============
        const LOCK_KEY = 'poe_search_lock';
        const QUEUE_KEY = 'poe_search_queue';
        const now = Date.now();

        // 获取配置
        const PAGE_INTERVAL = config.pageSearchInterval || 10;  // 页面自己的搜索频率
        const GLOBAL_QUEUE_INTERVAL = config.globalQueueInterval || 6;  // 页面间的最小间隔

        // 获取当前锁状态
        const lockDataStr = localStorage.getItem(LOCK_KEY);
        const lockData = lockDataStr ? JSON.parse(lockDataStr) : null;

        // 获取队列
        const queueStr = localStorage.getItem(QUEUE_KEY);
        const queue = queueStr ? JSON.parse(queueStr) : [];

        // 清理过期的锁（超过页面间隔2倍视为过期）
        const LOCK_TIMEOUT = PAGE_INTERVAL * 2 * 1000;

        if (lockData && (now - lockData.timestamp > LOCK_TIMEOUT)) {
            localStorage.removeItem(LOCK_KEY);
            Logger.log('清除过期的锁', 'orange');
        }

        // 清理过期的队列项
        const validQueue = queue.filter(item => now - item.timestamp < LOCK_TIMEOUT);

        // 如果当前页面不在队列中，加入队列
        const currentTabInQueue = validQueue.find(item => item.tabId === CoordinationManager.tabId);
        if (!currentTabInQueue) {
            validQueue.push({
                tabId: CoordinationManager.tabId,
                timestamp: now,
                pageId: pageId,
                pageInterval: PAGE_INTERVAL  // 记录页面的搜索间隔
            });
            localStorage.setItem(QUEUE_KEY, JSON.stringify(validQueue));
            Logger.log(`加入队列，位置: ${validQueue.length}，页面间隔: ${PAGE_INTERVAL}秒`, 'lightblue');
        }

        // 排序队列（按加入时间）
        validQueue.sort((a, b) => a.timestamp - b.timestamp);

        // 检查是否可以搜索
        const canSearch = !lockData || (now - lockData.timestamp > GLOBAL_QUEUE_INTERVAL * 1000);
        const isMyTurn = validQueue.length > 0 && validQueue[0].tabId === CoordinationManager.tabId;

        if (!canSearch || !isMyTurn) {
            // 不能搜索，等待
            const currentIndex = validQueue.findIndex(item => item.tabId === CoordinationManager.tabId);
            const position = currentIndex + 1;
            const totalInQueue = validQueue.length;

            if (lockData) {
                const lockRemaining = Math.max(0, (lockData.timestamp + (GLOBAL_QUEUE_INTERVAL * 1000) - now) / 1000);
                Logger.log(`等待中... 队列间隔: ${GLOBAL_QUEUE_INTERVAL}秒, 剩余: ${lockRemaining.toFixed(1)}秒, 队列位置: ${position}/${totalInQueue}`, 'yellow');
                updateStatus(`队列中 ${position}/${totalInQueue} (${lockRemaining.toFixed(1)}秒)`, 'orange');
            } else {
                Logger.log(`等待中... 队列位置: ${position}/${totalInQueue}`, 'yellow');
                updateStatus(`队列中 ${position}/${totalInQueue}`, 'orange');
            }

            // 短时间重试
            const retryInterval = 0.5;
            if (searchIntervalId) {
                clearInterval(searchIntervalId);
                searchIntervalId = setInterval(performSearch, retryInterval * 1000);
            }
            nextSearchTime = now + (retryInterval * 1000);
            return;
        }
        // =============== 排队系统结束 ===============

        const searchButton = document.querySelector('.search-btn');
        if (searchButton && !searchButton.disabled) {
            isFetchingResults = true;
            Logger.log('点击搜索按钮... (状态锁已激活)', 'yellow');
            updateStatus('正在点击搜索...', 'yellow');
            searchButton.click();

            // =============== 设置新的锁 ===============
            // 设置新的锁（使用全局排队间隔）
            const newLockData = {
                tabId: CoordinationManager.tabId,
                timestamp: now,
                pageId: pageId,
                globalInterval: GLOBAL_QUEUE_INTERVAL
            };
            localStorage.setItem(LOCK_KEY, JSON.stringify(newLockData));

            // 从队列中移除自己
            const updatedQueue = validQueue.filter(item => item.tabId !== CoordinationManager.tabId);
            localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));

            // 当前页面使用自己的页面搜索间隔
            let nextInterval = PAGE_INTERVAL;

            Logger.log(`获取锁，开始搜索，${nextInterval}秒后再次检查 (页面间隔: ${PAGE_INTERVAL}秒, 队列间隔: ${GLOBAL_QUEUE_INTERVAL}秒)`, 'lightgreen');
            Logger.log(`队列剩余: ${updatedQueue.length}个页面`, 'lightblue');
            // =============== 修改结束 ===============

            nextSearchTime = Date.now() + (nextInterval * 1000);

            // 清除旧的定时器，使用页面自己的间隔
            if (searchIntervalId) {
                clearInterval(searchIntervalId);
                searchIntervalId = setInterval(performSearch, nextInterval * 1000);
            }

            Logger.log(`下次搜索: ${nextInterval.toFixed(1)}秒后`, 'cyan');
        } else {
            Logger.log('搜索按钮不可用。', 'red');
            updateStatus('搜索按钮不可用', 'red');
        }
    };

    startSearch = function() {
        if (isRunning) return;
        if (isConfigDirty) { alert('配置已修改但未保存，请先保存设置！'); return; }

        // 初始化协调管理器
        if (!CoordinationManager.tabId) {
            CoordinationManager.init();
        }

        isRunning = true;
        if (!audioContext) audioContext = new(window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') audioContext.resume().catch(e => Logger.error(e, 'startSearch.audioContext'));
        extractPageInfo();
        loadConfigs();

        const startStopButton = document.getElementById('tas-start-btn');
        startStopButton.textContent = '停止自动搜索';
        startStopButton.style.backgroundColor = '#f44336';

        Logger.log(`[开始搜索] 使用ID为 ${pageId} 的配置。全局间隔: ${config.globalInterval || 6}秒`, 'cyan', 'bold');
        Logger.log('多开模式：所有网页使用统一全局间隔时间，轮流搜索', 'lightblue');

        // =============== 关键修改：直接执行搜索，不使用协调时间 ===============
        // 直接调用 performSearch，让全局锁机制控制顺序
        performSearch();

        // 设置定时器，使用全局间隔
        const GLOBAL_INTERVAL = config.globalInterval || 6;
        searchIntervalId = setInterval(performSearch, GLOBAL_INTERVAL * 1000);
        // =============== 修改结束 ===============

        startCountdown();
    };
    stopSearch = function() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(searchIntervalId); searchIntervalId = null;
        stopCountdown();

        // 从队列中移除
        const QUEUE_KEY = 'poe_search_queue';
        const queueStr = localStorage.getItem(QUEUE_KEY);
        if (queueStr) {
            const queue = JSON.parse(queueStr);
            const updatedQueue = queue.filter(item => item.tabId !== CoordinationManager.tabId);
            localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
            Logger.log('从队列中移除', 'lightblue');
        }

        const startStopButton = document.getElementById('tas-start-btn');
        if (startStopButton) {
            startStopButton.textContent = '启动自动搜索';
            startStopButton.style.backgroundColor = '#4CAF50';
        }
        updateStatus('已停止', 'white');
        Logger.log('自动搜索已停止。', 'cyan');
    };

    toggleSearch = function() { isRunning ? stopSearch() : startSearch(); };

    updateStatus = function(text, color = 'white') {
        const statusDiv = document.getElementById('tas-status');
        if (statusDiv) { statusDiv.textContent = `状态: ${text}`; statusDiv.style.color = color; }
    };

    startCountdown = function() {
        if (countdownIntervalId) return;
        updateCountdown();
        countdownIntervalId = setInterval(updateCountdown, 1000);
    };

    stopCountdown = function() {
        clearInterval(countdownIntervalId); countdownIntervalId = null;
        const countdownEl = document.getElementById('tas-countdown');
        if (countdownEl) countdownEl.textContent = '';
    };

    updateCountdown = function() {
        if (!isRunning) { stopCountdown(); return; }
        const remaining = Math.max(0, (nextSearchTime - Date.now()) / 1000);
        const countdownEl = document.getElementById('tas-countdown');
        if (countdownEl) {
            const roundedRemaining = Math.round(remaining * 10) / 10; // 保留一位小数
            countdownEl.textContent = `(${roundedRemaining}s)`;
        }
    };

    exportLinks = function() {
        try {
            const content = `==== POE Trade Alert Saved Searches ====\nVersion: ${GM_info.script.version}\nExported on: ${new Date().toISOString()}\n=========================================\n\n` +
                  Object.entries(allConfigs).map(([id, conf]) => {
                      const remark = conf.remark || `(无备注)`;
                      // 修复URL生成，使用正确的版本路径
                      const basePath = conf.gameVersion === 'poe2' ? '/trade2' : '/trade';
                      const realId = id.replace(/^(poe[12]_)/, '');
                      const url = conf.path ? `https://poe.game.qq.com${basePath}/search/${conf.path}/${realId}` : `(旧配置, 无路径信息)`;
                      return `${remark}\n${url}\n`;
                  }).join('\n');

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `poe_trade_alert_links_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            Logger.log('链接已导出。', 'cyan', 'bold');
        } catch (e) {
            Logger.error(e, 'exportLinks');
            alert('链接导出失败，详情请查看控制台。');
        }
    };
    function createStartupLogo() {
        if (document.getElementById('tas-startup-logo')) {
            Logger.log('启动Logo已存在，跳过创建', 'yellow');
            return;
        }
        Logger.log('正在创建启动Logo...', 'lightblue');
        const logo = document.createElement('div');
        logo.id = 'tas-startup-logo';
        // 创建图片元素
        const img = document.createElement('img');
        img.src = 'https://c-ssl.duitang.com/uploads/item/202002/08/20200208145841_ugtma.png';
        img.alt = 'POE警报';
        // 图片加载失败时的备用方案
        img.onerror = function() {
            Logger.log('Logo图片加载失败，使用备用文本', 'orange');
            logo.innerHTML = '<div style="color: white; font-size: 10px; text-align: center; font-weight: bold; line-height: 1.2;">POE<br>警报</div>';
        };
        logo.appendChild(img);
        logo.title = '点击启动POE市集自动警报脚本';
        logo.addEventListener('click', function() {
            Logger.log('启动Logo被点击', 'lightgreen');
            createUIPanel();
            activateScript();
        });
        document.body.appendChild(logo);
        Logger.log('启动Logo已创建并添加到页面', 'lightgreen');
    }

    function activateScript() {
        // 移除启动Logo
        const logo = document.getElementById('tas-startup-logo');
        if (logo) {
            logo.style.animation = 'none';
            logo.style.transform = 'scale(0)';
            setTimeout(() => logo.remove(), 300);
        }
        // 显示主面板
        const panel = document.getElementById('tas-panel');
        if (panel) {
            panel.classList.remove('tas-inactive');
        }
        // 设置脚本为激活状态
        GM_setValue('tas_script_active', true);
        // 运行主脚本
        runMainScript();
        Logger.log('脚本已激活！', 'lightgreen', 'bold');
    }

    function runMainScript() {
        // 这里是原来的 run() 函数内容
        try {
            Logger.log(`执行脚本 RUN for ${window.location.pathname}`, 'cyan', 'bold');
            extractPageInfo();
            if (!pageId || !pageContextPath) {
                Logger.log('URL不匹配，脚本暂停。', 'orange');
                return;
            }
            Logger.log(`当前页面 - ID: ${pageId}, 备注: ${allConfigs[pageId]?.remark || '无备注'}`, 'lightblue');
            loadConfigs();
            bindUIEvents();
            updateStatus('已停止', 'white');
            let attempts = 0;
            const maxAttempts = 20;
            const findResultsInterval = setInterval(() => {
                const targetNode = document.querySelector('.results');
                if (targetNode || attempts >= maxAttempts) {
                    clearInterval(findResultsInterval);
                    if (targetNode) {
                        Logger.log('.results 容器已找到，启动结果监听器。', 'green');
                        resultsObserver = new MutationObserver((mutations) => {
                            try {
                                for (const mutation of mutations) {
                                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                        if (Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && (node.classList.contains('resultset') || node.querySelector('.resultset')))) {
                                            setTimeout(parseResults, 500);
                                            return;
                                        }
                                    }
                                }
                            } catch (e) { Logger.error(e, 'resultsObserver.callback'); }
                        });
                        resultsObserver.observe(targetNode, { childList: true, subtree: true });
                    } else {
                        Logger.log('错误：超时仍未找到 .results 容器。', 'red', 'bold');
                        updateStatus('错误: 页面结构不匹配', 'red');
                    }
                }
                attempts++;
            }, 500);
        } catch(e) { Logger.error(e, 'runMainScript'); }
    }
    createUIPanel = function() {
        const existingPanel = document.getElementById('tas-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        if (document.getElementById('tas-panel')) return;
        GM_addStyle(`
    /* 随机时间相关样式 */
    #tas-random-min-group.disabled,
    #tas-random-max-group.disabled {
        opacity: 0.5;
    }

    .tas-input-group.disabled label {
        color: #777 !important;
    }
@keyframes tas-pulse{0%{box-shadow:0 0 0 0 rgba(255,165,0,.7)}70%{box-shadow:0 0 0 10px rgba(255,165,0,0)}100%{box-shadow:0 0 0 0 rgba(255,165,0,0)}}
@keyframes tas-flash-green{50%{background-color:rgba(60,255,60,.35)}}
.tas-found-item{animation:tas-flash-green 1.2s infinite ease-in-out!important}

/* 主面板样式 */
#tas-panel{position:fixed;top:10px;right:10px;background-color:#222;border:1px solid #555;padding:15px;z-index:9999;color:#ddd;font-family:Arial,sans-serif;border-radius:8px;width:280px;box-shadow:0 4px 8px rgba(0,0,0,.5);display:flex;flex-direction:column}
#tas-panel.tas-collapsed #tas-content-wrapper{display:none}
#tas-header{cursor:move;background-color:#333;padding:8px;margin:-15px -15px 10px;border-top-left-radius:8px;border-top-right-radius:8px;text-align:center;font-weight:700;-webkit-user-select:none;user-select:none;display:flex;justify-content:space-between;align-items:center}
#tas-title{flex-grow:1}
#tas-countdown{font-weight:400;margin-left:5px;color:#00bcd4}
#tas-toggle-collapse{cursor:pointer;padding:0 8px;font-weight:700;font-size:1.2em;color:#00bcd4;transition:color .2s}
#tas-toggle-collapse:hover{color:#fff}
#tas-content-wrapper{display:block}
.tas-input-group{margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
.tas-input-group label{margin-right:10px;flex-basis:120px;font-size:14px}
.tas-input-group input{width:80px;background:#333;border:1px solid #555;color:#fff;padding:5px;border-radius:4px}
.tas-input-group input[type="checkbox"]{width:auto;flex-grow:0;margin-right:65px;}
.tas-input-group input#tas-remark{width:140px;flex-grow:1}
#tas-double-teleport-group.disabled,#tas-teleport-cooldown-group.disabled{opacity:0.5}
.tas-btn{width:100%;padding:10px;border:none;border-radius:4px;cursor:pointer;font-weight:700;margin-top:5px;transition:background-color .3s}
#tas-start-btn{background-color:#4caf50;color:#fff}
#tas-save-btn{background-color:#008cba;color:#fff}
#tas-save-btn.tas-dirty{background-color:orange;color:#000;animation:tas-pulse 1.5s infinite}
#tas-test-audio-btn,#tas-manage-btn,#tas-export-log-btn,#tas-export-links-btn{background-color:#555;color:#fff}
#tas-status{margin-top:10px;text-align:center;font-style:italic}
input#tas-audio-file{display:none}
label[for=tas-audio-file]{display:block;text-align:center;padding:8px;background:#444;border-radius:4px;cursor:pointer;margin:10px 0}
label[for=tas-audio-file]:hover{background:#555}
#tas-saved-list{display:none;max-height:200px;overflow-y:auto;background:#1a1a1a;border:1px solid #444;border-radius:4px;margin-top:10px;padding:5px}
a.tas-saved-item{padding:8px;margin-bottom:5px;background:#333;border-radius:3px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#ddd;text-decoration:none}
a.tas-saved-item:hover{background:#4a4a4a}
a.tas-saved-item.disabled{cursor:not-allowed;background:#2a2a2a;color:#777}
a.tas-saved-item.disabled:hover{background:#2a2a2a}
.tas-saved-item-name{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px}
.tas-saved-item-delete{color:#ff5555;font-weight:700;cursor:pointer;padding:0 5px;z-index:10}
.tas-saved-item-delete:hover{color:red}

#tas-panel.tas-collapsed {
    width: 60px !important;
    height: 60px !important;
    padding: 0 !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    border-radius: 50% !important;
    border: 3px solid #fff !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3) !important;
    cursor: pointer !important;
    animation: tas-logo-rotate 3s linear infinite !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    top: 20px !important;
    right: 20px !important;
    left: auto !important;
    bottom: auto !important;
}

#tas-panel.tas-collapsed:hover {
    animation-duration: 1s !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6) !important;
    transform: scale(1.1) !important;
    border-color: #4CAF50 !important;
}

#tas-panel.tas-collapsed #tas-header {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
}

#tas-panel.tas-collapsed #tas-header::before {
    content: "";
    display: block;
    width: 50px;
    height: 50px;
    background-image: url('https://c-ssl.duitang.com/uploads/item/202002/08/20200208145841_ugtma.png');
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.8);
}

#tas-panel.tas-collapsed #tas-title,
#tas-panel.tas-collapsed #tas-countdown {
    display: none !important;
}

/* 重要修改：折叠按钮在最小化状态下仍然显示且可点击 */
#tas-panel.tas-collapsed #tas-toggle-collapse {
    display: block !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    color: white !important;
    font-size: 16px !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: transparent !important;
    border: none !important;
    z-index: 10 !important;
    opacity: 0 !important; /* 隐藏文字但保持可点击 */
}

#tas-panel.tas-collapsed #tas-content-wrapper {
    display: none !important;
}
`);

        // 然后创建面板HTML
        const panel = document.createElement('div');
        panel.id = 'tas-panel';
        panel.innerHTML = `
<div id="tas-header">
    <span id="tas-toggle-collapse">[—]</span>
    <span id="tas-title">POE 价格警报 V${GM_info.script.version}</span>
    <span id="tas-countdown"></span>
</div>
<div id="tas-content-wrapper">
    <div class="tas-input-group">
        <label for="tas-remark">此页面的备注名称:</label>
        <input type="text" id="tas-remark" placeholder="为此搜索添加备注">
    </div>

    <!-- 新增：页面搜索间隔 -->
    <div class="tas-input-group" style="background: #2a2a2a; padding: 5px; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #2196F3;">
        <label for="tas-page-interval" style="color: #2196F3; font-weight: bold;" title="每个页面自己的搜索频率">页面搜索间隔 (秒):</label>
        <input type="number" id="tas-page-interval" min="1" max="60" step="0.1" style="border-color: #2196F3; background: #1a1a1a; color: #2196F3; font-weight: bold;">
    </div>

    <!-- 修改：全局排队间隔 -->
    <div class="tas-input-group" style="background: #2a2a2a; padding: 5px; border-radius: 4px; margin-bottom: 10px; border-left: 3px solid #4CAF50;">
        <label for="tas-global-interval" style="color: #4CAF50; font-weight: bold;" title="多开时页面轮流搜索的最小间隔">全局排队间隔 (秒):</label>
        <input type="number" id="tas-global-interval" min="1" max="60" step="0.1" style="border-color: #4CAF50; background: #1a1a1a; color: #4CAF50; font-weight: bold;">
    </div>

    <!-- 旧间隔显示（只读） -->
    <div class="tas-input-group" style="opacity: 0.7;">
        <label for="tas-interval" title="当前使用全局排队间隔设置">当前页面间隔:</label>
        <input type="number" id="tas-interval" min="0.5" step="0.1" disabled>
    </div>
        <hr style="border-color:#444">
        <!-- 添加随机时间设置 -->
        <div class="tas-input-group">
            <label for="tas-random-interval" title="开启后，搜索间隔将在最小和最大时间之间随机变化">随机搜索时间:</label>
            <input type="checkbox" id="tas-random-interval">
        </div>
        <div class="tas-input-group" id="tas-random-min-group">
            <label for="tas-random-min">└─ 最小时间 (秒):</label>
            <input type="number" id="tas-random-min" min="0.5" max="60" step="0.1" value="15">
        </div>
        <div class="tas-input-group" id="tas-random-max-group">
            <label for="tas-random-max">└─ 最大时间 (秒):</label>
            <input type="number" id="tas-random-max" min="0.5" max="120" step="0.1" value="30">
        </div>
        <hr style="border-color:#444">
        <div class="tas-input-group">
            <label for="tas-divine">神圣石 小于等于 :</label>
            <input type="number" id="tas-divine" min="0">
        </div>
        <div class="tas-input-group">
            <label for="tas-exalted">崇高石 小于等于 :</label>
            <input type="number" id="tas-exalted" min="0">
        </div>
        <div class="tas-input-group">
            <label for="tas-chaos">混沌石 小于等于 :</label>
            <input type="number" id="tas-chaos" min="0">
        </div>
        <div class="tas-input-group">
            <label for="tas-alch">点金石 小于等于 :</label>
            <input type="number" id="tas-alch" min="0">
        </div>
        <div class="tas-input-group">
            <label for="tas-auto-teleport" title="触发警报时，自动点击第一个符合条件的物品的"前往藏身处"按钮，并继续搜索。">自动前往藏身处:</label>
            <input type="checkbox" id="tas-auto-teleport">
        </div>
        <div class="tas-input-group" id="tas-double-teleport-group">
            <label for="tas-double-teleport" title="开启后，报警时会连续点击两次"前往藏身处"按钮，间隔0.5秒。不建议开启。">└─ 点击两次 (慎用):</label>
            <input type="checkbox" id="tas-double-teleport">
        </div>
        <div class="tas-input-group" id="tas-teleport-cooldown-group">
            <label for="tas-teleport-cooldown" title="点击传送后，需要等待多少秒才会再次点击传送按钮">└─ 传送冷却 (秒):</label>
            <input type="number" id="tas-teleport-cooldown" min="1" max="60" value="5">
        </div>
        <hr style="border-color:#444">
        <input type="file" id="tas-audio-file" accept="audio/*">
        <label for="tas-audio-file">选择音频文件</label>
        <button id="tas-test-audio-btn" class="tas-btn">测试音频</button>
        <button id="tas-manage-btn" class="tas-btn">管理已存搜索</button>
        <div id="tas-saved-list"></div>
        <button id="tas-export-log-btn" class="tas-btn">导出日志</button>
        <button id="tas-export-links-btn" class="tas-btn">导出我的链接</button>
        <button id="tas-reset-btn" class="tas-btn" style="background-color: #ff5722;">重置脚本</button>
        <button id="tas-save-btn" class="tas-btn">保存设置</button>
        <button id="tas-start-btn" class="tas-btn">启动自动搜索</button>
        <div id="tas-status">状态: 初始化...</div>
    </div>
`;
        document.body.appendChild(panel);
        makeDraggable(panel);
        // 如果脚本未激活，隐藏面板
        const isScriptActive = GM_getValue('tas_script_active', false);
        if (!isScriptActive) {
            panel.classList.add('tas-inactive');
        }

        // 立即绑定折叠按钮事件 - 使用委托模式
        panel.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'tas-toggle-collapse') {
                e.preventDefault();
                e.stopPropagation();

                const panel = document.getElementById('tas-panel');
                if (panel) {
                    config.isCollapsed = !config.isCollapsed;
                    panel.classList.toggle('tas-collapsed', config.isCollapsed);

                    const toggleBtn = document.getElementById('tas-toggle-collapse');
                    if (toggleBtn) {
                        toggleBtn.textContent = config.isCollapsed ? '[+]' : '[—]';
                    }

                    // 立即保存折叠状态到配置
                    if (pageId && allConfigs[pageId]) {
                        allConfigs[pageId].isCollapsed = config.isCollapsed;
                        GM_setValue(ALL_CONFIGS_KEY, allConfigs);
                    }

                    Logger.log(`面板已${config.isCollapsed ? '折叠' : '展开'}`, 'lightblue');
                }
            }
        });
    };

    makeDraggable = function(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('tas-header');
        if (header) header.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            if (e.target.closest('button, a, input, label, #tas-toggle-collapse')) return;
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    };

    bindUIEvents = function() {
        // 控制按钮
        const startBtn = document.getElementById('tas-start-btn');
        const saveBtn = document.getElementById('tas-save-btn');
        const testAudioBtn = document.getElementById('tas-test-audio-btn');
        const manageBtn = document.getElementById('tas-manage-btn');
        const exportLogBtn = document.getElementById('tas-export-log-btn');
        const exportLinksBtn = document.getElementById('tas-export-links-btn');
        const resetBtn = document.getElementById('tas-reset-btn');
        const audioFileInput = document.getElementById('tas-audio-file');
        const autoTeleportCheckbox = document.getElementById('tas-auto-teleport');
        const doubleTeleportCheckbox = document.getElementById('tas-double-teleport');
        const teleportCooldownInput = document.getElementById('tas-teleport-cooldown');
        const randomIntervalCheckbox = document.getElementById('tas-random-interval');
        const randomMinInput = document.getElementById('tas-random-min');
        const randomMaxInput = document.getElementById('tas-random-max');

        // 注意：折叠按钮的事件已经在 createUIPanel 中通过事件委托绑定
        // 这里不需要重复绑定
        const globalIntervalInput = document.getElementById('tas-global-interval');
        if (globalIntervalInput) {
            globalIntervalInput.addEventListener('input', markAsDirty);
        }

        if (startBtn) startBtn.addEventListener('click', toggleSearch);
        if (saveBtn) saveBtn.addEventListener('click', saveConfig);
        if (testAudioBtn) testAudioBtn.addEventListener('click', () => {
            if (config.audioBase64) playAlertSound();
            else alert('请先选择并保存一个音频文件。');
        });
        if (manageBtn) manageBtn.addEventListener('click', () => {
            const list = document.getElementById('tas-saved-list');
            if (!list) return;
            list.style.display = list.style.display === 'block' ? 'none' : 'block';
            if (list.style.display === 'block') buildSavedSearchesUI();
        });
        if (exportLogBtn) exportLogBtn.addEventListener('click', () => Logger.exportLogs());
        if (exportLinksBtn) exportLinksBtn.addEventListener('click', exportLinks);
        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置脚本状态吗？这将需要重新点击Logo启动脚本。')) {
                GM_setValue('tas_script_active', false);
                location.reload();
            }
        });
        if (audioFileInput) audioFileInput.addEventListener('change', handleFileSelect);

        // 输入框变化监听
        document.querySelectorAll('#tas-panel input[type="number"], #tas-panel input[type="text"]').forEach(input => {
            if (input) input.addEventListener('input', markAsDirty);
        });

        if (autoTeleportCheckbox) autoTeleportCheckbox.addEventListener('change', markAsDirty);
        if (doubleTeleportCheckbox) doubleTeleportCheckbox.addEventListener('change', markAsDirty);
        if (teleportCooldownInput) teleportCooldownInput.addEventListener('input', markAsDirty);
        if (randomIntervalCheckbox) randomIntervalCheckbox.addEventListener('change', markAsDirty);
        if (randomMinInput) randomMinInput.addEventListener('input', markAsDirty);
        if (randomMaxInput) randomMaxInput.addEventListener('input', markAsDirty);

        // 随机时间相关事件监听
        if (randomIntervalCheckbox) {
            randomIntervalCheckbox.addEventListener('change', function() {
                markAsDirty();
                const randomMinGroup = document.getElementById('tas-random-min-group');
                const randomMaxGroup = document.getElementById('tas-random-max-group');
                const intervalGroup = document.querySelector('label[for="tas-interval"]')?.parentElement; // 获取固定间隔的父元素
                const intervalInput = document.getElementById('tas-interval');

                if (this.checked) {
                    // 启用随机时间
                    if (randomMinGroup) randomMinGroup.style.display = 'flex';
                    if (randomMaxGroup) randomMaxGroup.style.display = 'flex';
                    if (randomMinInput) randomMinInput.disabled = false;
                    if (randomMaxInput) randomMaxInput.disabled = false;

                    // 隐藏固定间隔
                    if (intervalGroup) intervalGroup.style.display = 'none';
                    if (intervalInput) intervalInput.disabled = true;
                } else {
                    // 禁用随机时间
                    if (randomMinGroup) randomMinGroup.style.display = 'none';
                    if (randomMaxGroup) randomMaxGroup.style.display = 'none';
                    if (randomMinInput) randomMinInput.disabled = true;
                    if (randomMaxInput) randomMaxInput.disabled = true;

                    // 显示固定间隔
                    if (intervalGroup) intervalGroup.style.display = 'flex';
                    if (intervalInput) intervalInput.disabled = false;
                }
            });
        }

        // 依赖控件状态更新
        const doubleTeleportGroup = document.getElementById('tas-double-teleport-group');
        const teleportCooldownGroup = document.getElementById('tas-teleport-cooldown-group');

        const updateDependentControls = () => {
            if (autoTeleportCheckbox && autoTeleportCheckbox.checked) {
                if (doubleTeleportGroup) doubleTeleportGroup.style.display = 'flex';
                if (teleportCooldownGroup) teleportCooldownGroup.style.display = 'flex';
                if (doubleTeleportCheckbox) doubleTeleportCheckbox.disabled = false;
                if (teleportCooldownInput) teleportCooldownInput.disabled = false;
            } else {
                if (doubleTeleportGroup) doubleTeleportGroup.style.display = 'none';
                if (teleportCooldownGroup) teleportCooldownGroup.style.display = 'none';
                if (doubleTeleportCheckbox) doubleTeleportCheckbox.disabled = true;
                if (teleportCooldownInput) teleportCooldownInput.disabled = true;
                if (doubleTeleportCheckbox) doubleTeleportCheckbox.checked = false;
            }
        };

        if (autoTeleportCheckbox) {
            autoTeleportCheckbox.addEventListener('change', updateDependentControls);
        }
    };

    cleanup = function() {
        Logger.log('执行清理操作，为页面跳转做准备...', 'grey');
        stopSearch();
        if (resultsObserver) {
            resultsObserver.disconnect();
            resultsObserver = null;
        }

        // 清理协调管理器
        CoordinationManager.cleanup();

        // 清理面板和Logo
        const panel = document.getElementById('tas-panel');
        if (panel) panel.remove();
        const logo = document.getElementById('tas-startup-logo');
        if (logo) logo.remove();
    };

    run = function() {
        try {
            Logger.log(`执行脚本 RUN for ${window.location.pathname}`, 'cyan', 'bold');
            extractPageInfo();
            if (!pageId || !pageContextPath) {
                Logger.log('URL不匹配，脚本暂停。', 'orange');
                return;
            }
            Logger.log(`当前页面 - ID: ${pageId}, 备注: ${allConfigs[pageId]?.remark || '无备注'}`, 'lightblue');
            loadConfigs();
            bindUIEvents();
            updateStatus('已停止', 'white');
            let attempts = 0;
            const maxAttempts = 20;
            const findResultsInterval = setInterval(() => {
                const targetNode = document.querySelector('.results');
                if (targetNode || attempts >= maxAttempts) {
                    clearInterval(findResultsInterval);
                    if (targetNode) {
                        Logger.log('.results 容器已找到，启动结果监听器。', 'green');
                        resultsObserver = new MutationObserver((mutations) => {
                            try {
                                for (const mutation of mutations) {
                                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                        if (Array.from(mutation.addedNodes).some(node => node.nodeType === 1 && (node.classList.contains('resultset') || node.querySelector('.resultset')))) {
                                            setTimeout(parseResults, 500);
                                            return;
                                        }
                                    }
                                }
                            } catch (e) { Logger.error(e, 'resultsObserver.callback'); }
                        });
                        resultsObserver.observe(targetNode, { childList: true, subtree: true });
                    } else {
                        Logger.log('错误：超时仍未找到 .results 容器。', 'red', 'bold');
                        updateStatus('错误: 页面结构不匹配', 'red');
                    }
                }
                attempts++;
            }, 500);
        } catch(e) { Logger.error(e, 'run'); }
    };

    let debounceTimer = null;
    onUrlChange = function() {
        if (isFetchingResults) { // 如果正在搜索，则忽略URL变化
            return;
        }
        if (window.location.pathname !== currentPath) {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if(window.location.pathname !== currentPath) {
                    const oldPath = currentPath;
                    const oldPageId = pageId;

                    currentPath = window.location.pathname;
                    extractPageInfo();

                    Logger.log(`URL路径发生变化: ${oldPath} -> ${window.location.pathname}`, 'magenta', 'bold');
                    Logger.log(`页面ID变化: ${oldPageId} -> ${pageId}`, 'magenta');

                    // 检查是否需要配置迁移
                    if (oldPageId && pageId && oldPageId !== pageId && allConfigs[oldPageId]) {
                        const oldConfig = allConfigs[oldPageId];
                        const oldRemark = oldConfig.remark || `(无备注) ${oldPageId}`;

                        // 显示配置迁移确认对话框
                        if (confirm(`检测到页面变更！\n\n原页面: ${oldRemark}\n新页面ID: ${pageId}\n\n是否将原页面的配置应用到新页面？\n\n点击"确定"：迁移配置并继续\n点击"取消"：新页面使用默认配置`)) {
                            // 用户选择迁移配置
                            Logger.log(`用户确认将配置从 ${oldPageId} 迁移到 ${pageId}`, 'lightgreen', 'bold');

                            // 迁移配置，但更新路径信息
                            allConfigs[pageId] = {
                                ...oldConfig,
                                path: pageContextPath // 更新为新的路径
                            };

                            // 🔥 关键修复：删除旧配置，避免重复
                            delete allConfigs[oldPageId];
                            Logger.log(`已删除旧配置: ${oldPageId}`, 'lightgreen');

                            // 保存配置
                            GM_setValue(ALL_CONFIGS_KEY, allConfigs);
                            Logger.log(`配置已成功迁移到新页面`, 'lightgreen');

                            // 重新加载配置并重新创建UI
                            loadConfigs();
                            createUIPanel(); // 重新创建面板
                            bindUIEvents();
                            updateUIFromConfig();

                        } else {
                            // 用户选择不迁移，使用默认配置
                            Logger.log(`用户选择不迁移配置，新页面将使用默认配置`, 'orange');
                            // 重新创建面板
                            createUIPanel();
                            bindUIEvents();
                            updateUIFromConfig();
                        }
                    } else {
                        // 没有配置需要迁移，正常处理
                        cleanup();
                        setTimeout(run, 500);
                    }
                }
            }, 300); // 300毫秒防抖
        }
    };

    init = function() {
        try {
            Logger.log('脚本初始化...', 'green', 'bold');

            // 监听页面卸载事件
            window.addEventListener('beforeunload', function() {
                CoordinationManager.cleanup();
            });

            // 检查脚本是否已经激活
            const isScriptActive = GM_getValue('tas_script_active', false);
            if (isScriptActive) {
                // 如果已经激活，直接运行主脚本
                Logger.log('脚本已激活，直接启动...', 'lightgreen');
                createUIPanel(); // 先创建面板
                runMainScript();
                if (urlCheckIntervalId) clearInterval(urlCheckIntervalId);
                urlCheckIntervalId = setInterval(onUrlChange, 500);
            } else {
                // 如果未激活，只显示启动Logo，不创建面板
                Logger.log('脚本未激活，显示启动Logo...', 'orange');
                createStartupLogo();
            }
        } catch(e) {
            Logger.error(e, 'init');
            alert('脚本初始化失败，请检查浏览器控制台(F12)获取错误信息。');
        }
    };

    // --- 脚本执行入口 ---
    init();

})();