// ==UserScript==
// @name         抖音智能直播助手
// @namespace    http://tampermonkey.net/
// @version      9.9.9
// @description  支持后台运行，多条回复话术随机选择，优化关键词检测响应速度，修复商品数量检测问题，新增弹窗自动关闭功能，支持配置导入导出
// @author       付一笑
// @match        https://eos.douyin.com/livesite/live/current
// @match        https://www.douyin.com/*
// @match        https://live.douyin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license       GPL
// @downloadURL https://update.greasyfork.org/scripts/557191/%E6%8A%96%E9%9F%B3%E6%99%BA%E8%83%BD%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557191/%E6%8A%96%E9%9F%B3%E6%99%BA%E8%83%BD%E7%9B%B4%E6%92%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//仅限个人测试使用，严禁传播。
(function() {
    'use strict';

    console.log('🎯 抖音轮播助手脚本开始加载（后台运行版）...');

    // 弹窗检测管理器
    const PopupManager = {
        isMonitoring: false,
        popupObserver: null,
        checkInterval: null,
        lastPopupTime: 0,
        popupCooldown: 5000, // 5秒内不重复处理同一弹窗

        init() {
            console.log('🔍 初始化弹窗检测管理器');
            this.startMonitoring();
        },

        startMonitoring() {
            if (this.isMonitoring) return;

            this.isMonitoring = true;

            // 使用 MutationObserver 监听DOM变化
            this.setupMutationObserver();

            // 同时使用定时器检查，双重保障
            this.setupIntervalCheck();

            console.log('✅ 弹窗检测已启动');
        },

        stopMonitoring() {
            this.isMonitoring = false;

            if (this.popupObserver) {
                this.popupObserver.disconnect();
                this.popupObserver = null;
            }

            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }

            console.log('🛑 弹窗检测已停止');
        },

        setupMutationObserver() {
            this.popupObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        this.checkForPopup();
                    }
                }
            });

            this.popupObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        setupIntervalCheck() {
            this.checkInterval = setInterval(() => {
                if (this.isMonitoring) {
                    this.checkForPopup();
                }
            }, 1000); // 每秒检查一次
        },

        checkForPopup() {
            // 防止频繁处理
            if (Date.now() - this.lastPopupTime < this.popupCooldown) {
                return;
            }

            // 检测弹窗选择器
            const popupSelectors = [
                '.okee-current-live-alert', // 主要选择器
                '[class*="alert"]',
                '[class*="modal"]',
                '[class*="dialog"]'
            ];

            for (const selector of popupSelectors) {
                const popups = document.querySelectorAll(selector);
                for (const popup of popups) {
                    if (this.isTargetPopup(popup)) {
                        this.handlePopup(popup);
                        return;
                    }
                }
            }
        },

        isTargetPopup(popup) {
            // 检查弹窗内容是否包含目标文本
            const popupText = popup.textContent || '';
            const targetTexts = [
                '请勿频繁切换讲解',
                '讲解频次过高',
                '货架闪烁',
                '稍后再试'
            ];

            // 检查是否包含任意目标文本
            for (const text of targetTexts) {
                if (popupText.includes(text)) {
                    return true;
                }
            }

            // 检查特定的弹窗结构
            const hasHeader = popup.querySelector('.okee-current-live-content-header');
            const hasFooter = popup.querySelector('.okee-current-live-content-footer');
            const hasConfirmButton = popup.querySelector('button.okee-current-live-confirm-ok');

            return hasHeader && hasFooter && hasConfirmButton;
        },

        handlePopup(popup) {
            console.log('🎯 检测到目标弹窗，尝试关闭');

            // 查找确认按钮
            const buttonSelectors = [
                'button.okee-current-live-confirm-ok',
                '.okee-current-live-btn-primary',
                '[class*="confirm"] button',
                '[class*="ok"] button'
            ];

            for (const selector of buttonSelectors) {
                const buttons = popup.querySelectorAll(selector);
                for (const button of buttons) {
                    const buttonText = button.textContent?.trim() || '';
                    if (buttonText.includes('我知道') || buttonText.includes('确认') ||
                        buttonText.includes('确定') || buttonText.includes('OK')) {
                        this.clickButton(button, popup);
                        return;
                    }
                }
            }

            // 如果通过选择器没找到，尝试查找包含"我知道了"文本的按钮
            const allButtons = popup.querySelectorAll('button');
            for (const button of allButtons) {
                const buttonText = button.textContent?.trim() || '';
                if (buttonText.includes('我知道') || buttonText === '我知道了') {
                    this.clickButton(button, popup);
                    return;
                }
            }

            console.log('❌ 未找到关闭按钮');
        },

        clickButton(button, popup) {
            try {
                // 模拟人类点击行为
                setTimeout(() => {
                    button.click();
                    this.lastPopupTime = Date.now();
                    console.log('✅ 已自动点击"我知道了"按钮');

                    // 更新统计
                    if (window.liveHelper && window.liveHelper.status) {
                        window.liveHelper.status.popupsClosed = (window.liveHelper.status.popupsClosed || 0) + 1;
                    }

                    // 通知用户
                    if (window.liveHelper && window.liveHelper.notify) {
                        window.liveHelper.notify('弹窗已关闭', '已自动处理频繁切换提示');
                    } else {
                        this.showNotification('弹窗已关闭', '已自动处理频繁切换提示');
                    }

                    // 可选：移除弹窗元素（如果点击后没有立即消失）
                    setTimeout(() => {
                        if (document.body.contains(popup)) {
                            popup.style.display = 'none';
                            console.log('🔄 强制隐藏弹窗');
                        }
                    }, 1000);

                }, 500 + Math.random() * 1000); // 随机延迟，更自然
            } catch (error) {
                console.error('点击按钮失败:', error);
            }
        },

        showNotification(title, message) {
            console.log(`[${title}] ${message}`);
            if (typeof GM_notification === 'function') {
                try {
                    GM_notification({ title, text: message, timeout: 3000 });
                } catch (e) {
                    console.error('通知发送失败:', e);
                }
            }
        },

        // 获取弹窗检测状态
        getStatus() {
            return {
                isMonitoring: this.isMonitoring,
                lastPopupTime: this.lastPopupTime,
                hasObserver: !!this.popupObserver,
                hasInterval: !!this.checkInterval
            };
        }
    };

    // 配置管理器
    const ConfigManager = {
        // 导出配置
        exportConfig() {
            try {
                const configData = GM_getValue('douyin_live_helper_config');
                if (!configData) {
                    this.showNotification('导出失败', '没有找到配置数据');
                    return;
                }

                const config = typeof configData === 'string' ? JSON.parse(configData) : configData;
                const configStr = JSON.stringify(config, null, 2);
                const blob = new Blob([configStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `douyin_live_helper_config_${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                this.showNotification('导出成功', '配置已导出为JSON文件');
                console.log('✅ 配置导出成功');
            } catch (error) {
                console.error('配置导出失败:', error);
                this.showNotification('导出失败', '请查看控制台错误信息');
            }
        },

        // 导入配置
        importConfig() {
            try {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.style.display = 'none';

                input.onchange = (event) => {
                    const file = event.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const configStr = e.target.result;
                            const config = JSON.parse(configStr);

                            // 验证配置格式
                            if (!this.validateConfig(config)) {
                                this.showNotification('导入失败', '配置文件格式不正确');
                                return;
                            }

                            if (confirm('确定要导入配置吗？这将覆盖当前所有设置。')) {
                                // 保存配置到存储
                                GM_setValue('douyin_live_helper_config', JSON.stringify(config));

                                // 立即应用到当前运行的脚本
                                this.applyImportedConfig(config);

                                this.showNotification('导入成功', '配置已导入并立即生效');
                                console.log('✅ 配置导入成功并立即生效');
                            }
                        } catch (error) {
                            console.error('配置文件解析失败:', error);
                            this.showNotification('导入失败', '配置文件格式错误');
                        }
                    };

                    reader.readAsText(file);
                    document.body.removeChild(input);
                };

                document.body.appendChild(input);
                input.click();
            } catch (error) {
                console.error('配置导入失败:', error);
                this.showNotification('导入失败', '请查看控制台错误信息');
            }
        },

        // 应用导入的配置到当前运行的脚本
        applyImportedConfig(importedConfig) {
            if (!window.liveHelper || !window.liveHelper.config) {
                console.error('无法应用配置：liveHelper 未初始化');
                return;
            }

            try {
                const liveHelper = window.liveHelper;

                // 保存当前运行状态
                const wasRunning = liveHelper.status.isRunning;
                const currentProductIndex = liveHelper.config.currentProductIndex;

                // 停止当前运行
                if (wasRunning && liveHelper.toggleRun) {
                    liveHelper.toggleRun();
                }

                // 应用新配置
                Object.assign(liveHelper.config, importedConfig);

                // 恢复产品索引（如果新配置中的商品数量足够）
                if (currentProductIndex < liveHelper.config.products.length) {
                    liveHelper.config.currentProductIndex = currentProductIndex;
                } else {
                    liveHelper.config.currentProductIndex = 0;
                }

                // 保存配置
                if (liveHelper.saveConfig) {
                    liveHelper.saveConfig();
                }

                // 更新UI
                if (liveHelper.updateUI) {
                    liveHelper.updateUI();
                }

                // 重新启动监控器
                if (liveHelper.startMonitors) {
                    liveHelper.startMonitors();
                }

                // 如果之前是运行状态，重新开始
                if (wasRunning && liveHelper.toggleRun) {
                    setTimeout(() => {
                        liveHelper.toggleRun();
                    }, 1000);
                }

                console.log('🔄 导入的配置已立即应用到当前脚本');
            } catch (error) {
                console.error('应用导入配置失败:', error);
                this.showNotification('配置应用失败', '部分设置可能需要刷新页面');
            }
        },

        // 验证配置格式
        validateConfig(config) {
            const requiredFields = [
                'enabled', 'minInterval', 'maxInterval', 'products',
                'autoReplyEnabled', 'replyRules', 'backgroundModeEnabled'
            ];

            for (const field of requiredFields) {
                if (!(field in config)) {
                    console.error(`缺少必要字段: ${field}`);
                    return false;
                }
            }

            // 验证数组字段
            if (!Array.isArray(config.products) || !Array.isArray(config.replyRules)) {
                console.error('products或replyRules字段格式错误');
                return false;
            }

            return true;
        },

        showNotification(title, message) {
            console.log(`[${title}] ${message}`);
            if (typeof GM_notification === 'function') {
                try {
                    GM_notification({ title, text: message, timeout: 3000 });
                } catch (e) {
                    console.error('通知发送失败:', e);
                }
            }
        }
    };

    // 后台运行管理器
    const BackgroundManager = {
        isBackgroundMode: false,
        backgroundInterval: null,
        lastActiveTime: Date.now(),
        backgroundTasks: [],

        init() {
            // 监听页面可见性变化
            document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

            // 监听页面挂起事件
            document.addEventListener('freeze', this.handleFreeze.bind(this));
            document.addEventListener('resume', this.handleResume.bind(this));

            // 监听 beforeunload 事件
            window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

            // 监听窗口失焦/获焦
            window.addEventListener('blur', this.handleWindowBlur.bind(this));
            window.addEventListener('focus', this.handleWindowFocus.bind(this));

            console.log('🔮 后台管理器已初始化');
        },

        handleVisibilityChange() {
            if (document.hidden) {
                console.log('📱 页面进入后台，启用后台模式');
                this.enterBackgroundMode();
            } else {
                console.log('📱 页面回到前台，禁用后台模式');
                this.exitBackgroundMode();
            }
        },

        handleWindowBlur() {
            if (!document.hidden) return;
            console.log('🔍 窗口失焦，检查是否需要进入后台模式');
            setTimeout(() => {
                if (document.hidden && !this.isBackgroundMode) {
                    this.enterBackgroundMode();
                }
            }, 1000);
        },

        handleWindowFocus() {
            if (this.isBackgroundMode) {
                console.log('🔍 窗口获焦，退出后台模式');
                this.exitBackgroundMode();
            }
        },

        handleFreeze() {
            console.log('❄️ 页面被挂起，保存状态');
            this.saveStateBeforeSuspend();
        },

        handleResume() {
            console.log('🔥 页面恢复，恢复状态');
            this.restoreStateAfterResume();
        },

        handleBeforeUnload() {
            console.log('🚪 页面即将关闭，保存状态');
            this.saveStateBeforeUnload();
        },

        enterBackgroundMode() {
            if (this.isBackgroundMode) return;

            this.isBackgroundMode = true;
            this.lastActiveTime = Date.now();

            // 启动后台轮询
            this.startBackgroundPolling();

            // 降低资源消耗
            this.reduceResourceUsage();

            // 保存当前状态
            this.saveBackgroundState();

            // 调整弹窗检测频率
            PopupManager.stopMonitoring();
            setTimeout(() => {
                PopupManager.startMonitoring();
            }, 2000);

            this.notify('后台模式', '脚本将在后台继续运行');
        },

        exitBackgroundMode() {
            if (!this.isBackgroundMode) return;

            this.isBackgroundMode = false;

            // 停止后台轮询
            this.stopBackgroundPolling();

            // 恢复资源使用
            this.restoreResourceUsage();

            // 恢复前台模式
            this.restoreForegroundMode();

            // 恢复弹窗检测
            PopupManager.startMonitoring();

            this.notify('前台模式', '已恢复正常运行');
        },

        startBackgroundPolling() {
            if (this.backgroundInterval) {
                clearInterval(this.backgroundInterval);
            }

            // 后台模式下降低检查频率
            this.backgroundInterval = setInterval(() => {
                if (this.isBackgroundMode) {
                    this.backgroundTick();
                }
            }, 3000); // 3秒检查一次
        },

        stopBackgroundPolling() {
            if (this.backgroundInterval) {
                clearInterval(this.backgroundInterval);
                this.backgroundInterval = null;
            }
        },

        backgroundTick() {
            const now = Date.now();
            const inactiveTime = now - this.lastActiveTime;

            // 如果长时间在后台，模拟一些活动
            if (inactiveTime > 45000) { // 45秒
                this.simulateActivity();
                this.lastActiveTime = now;
            }

            // 执行后台任务
            this.executeBackgroundTasks();

            // 定期保存状态
            if (now % 30000 < 3000) { // 每30秒保存一次
                this.saveBackgroundState();
            }
        },

        simulateActivity() {
            // 模拟用户活动，防止页面被完全挂起
            try {
                // 触发微小的事件
                const events = ['mousemove', 'scroll', 'click'];
                const eventType = events[Math.floor(Math.random() * events.length)];
                const event = new Event(eventType, { bubbles: true });
                document.dispatchEvent(event);

                // 轻微滚动（如果可能）
                if (Math.random() < 0.2) {
                    window.scrollBy(0, 2);
                    setTimeout(() => window.scrollBy(0, -2), 50);
                }

                console.log('🎭 模拟用户活动:', eventType);
            } catch (e) {
                // 忽略错误
            }
        },

        executeBackgroundTasks() {
            // 执行注册的后台任务
            this.backgroundTasks.forEach(task => {
                try {
                    if (task.condition && task.condition()) {
                        task.execute();
                    }
                } catch (error) {
                    console.error('后台任务执行失败:', error);
                }
            });
        },

        registerBackgroundTask(task) {
            this.backgroundTasks.push(task);
            console.log(`✅ 注册后台任务: ${task.name}`);
        },

        reduceResourceUsage() {
            // 降低动画频率
            const styles = document.createElement('style');
            styles.textContent = `
                #explainPanel {
                    animation-duration: 2s !important;
                }
                * {
                    animation-duration: 2s !important;
                    transition-duration: 0.5s !important;
                }
                .pulse-animation {
                    animation: none !important;
                }
            `;
            styles.id = 'background-mode-styles';
            document.head.appendChild(styles);

            // 降低面板更新频率
            if (window.liveHelper && window.liveHelper.updateUI) {
                window.liveHelper.updateUIFrequency = 5000; // 5秒更新一次UI
            }
        },

        restoreResourceUsage() {
            // 恢复正常资源使用
            const styles = document.getElementById('background-mode-styles');
            if (styles) {
                styles.remove();
            }

            // 恢复面板更新频率
            if (window.liveHelper && window.liveHelper.updateUI) {
                window.liveHelper.updateUIFrequency = 1000;
            }
        },

        restoreForegroundMode() {
            // 恢复前台模式的完整功能
            if (window.liveHelper) {
                // 立即更新UI
                if (window.liveHelper.updateUI) {
                    window.liveHelper.updateUI();
                }

                // 重新启动监控器
                if (window.liveHelper.startMonitors) {
                    window.liveHelper.startMonitors();
                }

                // 重新计算下一次点击时间
                if (window.liveHelper.status && window.liveHelper.status.isRunning) {
                    if (window.liveHelper.scheduleNextClick) {
                        window.liveHelper.scheduleNextClick();
                    }
                }
            }
        },

        saveBackgroundState() {
            // 保存关键状态到 GM_setValue
            if (window.liveHelper) {
                try {
                    const state = {
                        config: window.liveHelper.config,
                        status: window.liveHelper.status,
                        timestamp: Date.now(),
                        isBackgroundMode: this.isBackgroundMode
                    };
                    GM_setValue('background_state', JSON.stringify(state));
                } catch (e) {
                    console.error('保存后台状态失败:', e);
                }
            }
        },

        saveStateBeforeSuspend() {
            this.saveBackgroundState();
            console.log('💾 状态已保存（挂起前）');
        },

        restoreStateAfterResume() {
            // 从 GM_setValue 恢复状态
            try {
                const saved = GM_getValue('background_state');
                if (saved) {
                    const state = JSON.parse(saved);
                    if (window.liveHelper && Date.now() - state.timestamp < 300000) { // 5分钟内
                        Object.assign(window.liveHelper.config, state.config);
                        Object.assign(window.liveHelper.status, state.status);

                        // 如果之前是后台模式，重新进入
                        if (state.isBackgroundMode && document.hidden) {
                            this.enterBackgroundMode();
                        }

                        console.log('🔄 状态已恢复（恢复后）');
                    }
                }
            } catch (e) {
                console.error('恢复状态失败:', e);
            }
        },

        saveStateBeforeUnload() {
            this.saveStateBeforeSuspend();
        },

        notify(title, text) {
            console.log(`[${title}] ${text}`);
            if (typeof GM_notification === 'function') {
                try {
                    GM_notification({ title, text, timeout: 3000 });
                } catch (e) {
                    console.error('通知发送失败:', e);
                }
            }
        },

        // 获取后台运行状态
        getStatus() {
            return {
                isBackgroundMode: this.isBackgroundMode,
                lastActiveTime: this.lastActiveTime,
                activeTasks: this.backgroundTasks.length,
                backgroundInterval: !!this.backgroundInterval
            };
        }
    };

    // 修改初始化函数
    function initializeScript() {
        console.log('🚀 初始化脚本（后台运行版）...');
        try {
            // 启动弹窗检测管理器
            PopupManager.init();

            // 启动后台管理器
            BackgroundManager.init();

            // 原有初始化代码
            (() => {
                'use strict';

                const defaultConfig = {
                    enabled: false,
                    minInterval: 20000,
                    maxInterval: 30000,
                    clickCount: 0,
                    lastClickTime: null,
                    totalRunningTime: 0,
                    startTime: null,
                    panelVisible: true,
                    panelPosition: { x: 20, y: 100 },
                    currentProductIndex: 0,
                    products: [],
                    autoReplyEnabled: false,
                    replyRules: [],
                    replyDelay: 2000,
                    replyCooldown: 15000,
                    useRandomEmoji: true,
                    antiCheatEnabled: true,
                    minReplyCooldown: 15000,
                    maxReplyCooldown: 30000,
                    replyProbability: 0.8,
                    maxRepliesPerMinute: 3,
                    useHumanLikeBehavior: true,
                    commentCheckInterval: 500,
                    immediateExplain: true,
                    explainPriority: true,
                    backgroundModeEnabled: true,  // 新增：后台模式开关
                    autoClosePopup: true  // 新增：自动关闭弹窗开关
                };

                let config = {};
                let status = {
                    isRunning: false,
                    nextClickTime: null,
                    isClicking: false,
                    errorCount: 0,
                    priorityProduct: null,
                    isExplaining: false,
                    currentExplainingProduct: null,
                    lastComment: '',
                    lastRepliedComment: '',
                    lastReplyTime: 0,
                    lastReplies: [],
                    lastCommentCheck: 0,
                    pendingExplain: null,
                    lastMatchedKeyword: '',
                    lastReplyAction: '',
                    isBackgroundMode: false,  // 新增：后台模式状态
                    popupsClosed: 0  // 新增：关闭的弹窗数量
                };

                let countdownMonitorId = null;
                let commentMonitorId = null;
                let uiUpdateIntervalId = null;
                let updateUIFrequency = 1000; // 默认1秒更新一次UI

                const emojiList = ['😊', '😂', '❤️', '👍', '🙏', '🥰', '🤗', '😇', '😉', '😄', '😃', '😁', '😆', '☺️', '😅', '🥲', '😍', '💕', '🤩', '🥳', '👌', '🙌', '👏', '🤝', '🤲', '💪', '✌️', '🤟', '🤙', '👋', '✋', '👈', '👉', '👆', '👇', '☝️', '🤔', '😮', '😲', '😯', '🤓', '😶', '😐', '😑', '🤫', '🎉', '🎊', '🥳', '🏆', '🏅', '🥇', '🥈', '🥉', '✨', '🎆', '🎇', '🎈', '🎓', '🧩', '🧠', '👀'];

                function migrateConfig() {
                    try {
                        const possibleOldKeys = [
                            'explainConfig_9.9.2',
                            'explainConfig'
                        ];

                        let migrated = false;

                        for (const key of possibleOldKeys) {
                            const oldConfig = GM_getValue(key);
                            if (oldConfig && !GM_getValue('douyin_live_helper_config')) {
                                console.log(`🔄 从 ${key} 迁移配置到新版本...`);
                                GM_setValue('douyin_live_helper_config', oldConfig);
                                GM_setValue(`${key}_migrated`, true);
                                migrated = true;
                                console.log('✅ 配置迁移完成');
                                break;
                            }
                        }

                        return migrated;
                    } catch (e) {
                        console.error('❌ 配置迁移失败:', e);
                        return false;
                    }
                }

                function loadConfig() {
                    migrateConfig();

                    try {
                        console.log('📂 加载配置...');
                        const saved = GM_getValue('douyin_live_helper_config');
                        if (saved) {
                            const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
                            config = Object.assign({}, defaultConfig, parsed);

                            // 兼容性处理
                            if (parsed.interval && !parsed.minInterval) {
                                config.minInterval = parsed.interval;
                                config.maxInterval = parsed.interval;
                            }

                            if (!config.products) config.products = [];
                            if (!config.replyRules) config.replyRules = [];
                            if (config.backgroundModeEnabled === undefined) config.backgroundModeEnabled = true;
                            if (config.autoClosePopup === undefined) config.autoClosePopup = true;

                            console.log('✅ 配置加载成功，商品数量:', config.products.length);
                        } else {
                            config = Object.assign({}, defaultConfig);
                            console.log('🆕 使用默认配置');
                        }
                    } catch (e) {
                        console.error('❌ 加载配置失败:', e);
                        config = Object.assign({}, defaultConfig);
                    }
                }

                function saveConfig() {
                    try {
                        const configToSave = {
                            enabled: config.enabled,
                            minInterval: config.minInterval,
                            maxInterval: config.maxInterval,
                            clickCount: config.clickCount,
                            lastClickTime: config.lastClickTime,
                            totalRunningTime: config.totalRunningTime,
                            startTime: config.startTime,
                            panelVisible: config.panelVisible,
                            panelPosition: config.panelPosition,
                            currentProductIndex: config.currentProductIndex,
                            products: config.products.map(p => ({
                                name: p.name || '未知商品',
                                keywords: Array.isArray(p.keywords) ? [...p.keywords] : []
                            })),
                            autoReplyEnabled: config.autoReplyEnabled,
                            replyRules: config.replyRules.map(rule => ({
                                keywords: Array.isArray(rule.keywords) ? [...rule.keywords] : [],
                                replies: Array.isArray(rule.replies) ? [...rule.replies] : [rule.reply || '']
                            })),
                            replyDelay: config.replyDelay,
                            replyCooldown: config.replyCooldown,
                            useRandomEmoji: config.useRandomEmoji,
                            antiCheatEnabled: config.antiCheatEnabled,
                            minReplyCooldown: config.minReplyCooldown,
                            maxReplyCooldown: config.maxReplyCooldown,
                            replyProbability: config.replyProbability,
                            maxRepliesPerMinute: config.maxRepliesPerMinute,
                            useHumanLikeBehavior: config.useHumanLikeBehavior,
                            commentCheckInterval: config.commentCheckInterval,
                            immediateExplain: config.immediateExplain,
                            explainPriority: config.explainPriority,
                            backgroundModeEnabled: config.backgroundModeEnabled,
                            autoClosePopup: config.autoClosePopup
                        };

                        GM_setValue('douyin_live_helper_config', JSON.stringify(configToSave));
                        console.log('💾 配置保存成功');
                        return true;
                    } catch (e) {
                        console.error('❌ 保存配置失败:', e);
                        return false;
                    }
                }

                function notify(title, text) {
                    console.log(`[${title}] ${text}`);
                    if (typeof GM_notification === 'function') {
                        try {
                            GM_notification({ title, text, timeout: 3000 });
                        } catch (e) {
                            console.error('通知发送失败:', e);
                        }
                    }
                }

                function getRandomInterval() {
                    const min = config.minInterval;
                    const max = config.maxInterval;
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }

                function getRandomEmoji() {
                    const randomIndex = Math.floor(Math.random() * emojiList.length);
                    return emojiList[randomIndex];
                }

                function addRandomEmoji(text) {
                    if (!config.useRandomEmoji) return text;
                    const addAtStart = Math.random() > 0.5;
                    const emoji = getRandomEmoji();
                    const newText = addAtStart ? `${emoji} ${text}` : `${text} ${emoji}`;
                    return newText.length <= 50 ? newText : text;
                }

                function getRandomCooldown() {
                    return Math.floor(Math.random() *
                                      (config.maxReplyCooldown - config.minReplyCooldown + 1)) +
                        config.minReplyCooldown;
                }

                function getRandomReply(replies) {
                    if (!replies || !Array.isArray(replies) || replies.length === 0) {
                        return '';
                    }
                    const randomIndex = Math.floor(Math.random() * replies.length);
                    return replies[randomIndex].trim();
                }

                function getProductCount() {
                    try {
                        // 更精确的商品选择器，避免选择到隐藏或无效的商品元素
                        const productSelectors = [
                            '[data-index] .talking-btn-XzVTUV',
                            '[data-index] .talking-word-S8p5x6',
                            '[data-index] [class*="talking-btn"]',
                            '[data-index] [class*="talking-word"]',
                            '[data-e2e="product-item"]',
                            '.product-item'
                        ];

                        let productCount = 0;

                        // 尝试多种选择器来获取商品数量
                        for (const selector of productSelectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                //console.log(`🔍 使用选择器 "${selector}" 找到 ${elements.length} 个商品`);
                                productCount = elements.length;
                                break;
                            }
                        }

                        // 如果上面的选择器都没找到，尝试通过data-index属性查找
                        if (productCount === 0) {
                            const dataIndexElements = document.querySelectorAll('[data-index]');
                            const validProducts = Array.from(dataIndexElements).filter(el => {
                                // 过滤掉无效的商品元素
                                const rect = el.getBoundingClientRect();
                                return rect.width > 0 && rect.height > 0 &&
                                       window.getComputedStyle(el).display !== 'none';
                            });
                            productCount = validProducts.length;
                            //console.log(`🔍 通过data-index找到 ${validProducts.length} 个有效商品`);
                        }

                        return productCount;
                    } catch (e) {
                        console.error('获取商品数量失败:', e);
                        return 0;
                    }
                }

                function getProductName(index) {
                    try {
                        // 先尝试精确匹配
                        const productSelectors = [
                            `[data-index="${index}"] .render-NifWJ3`,
                            `[data-index="${index}"] .card-name-bDMAjA`,
                            `[data-index="${index}"] [class*="name"]`,
                            `[data-index="${index}"]`
                        ];

                        let productElement = null;
                        for (const selector of productSelectors) {
                            productElement = document.querySelector(selector);
                            if (productElement) break;
                        }

                        if (!productElement) return `商品${index + 1}`;

                        // 获取商品名称
                        const nameElement = productElement.querySelector('.render-NifWJ3, .card-name-bDMAjA, [class*="name"]') || productElement;
                        if (nameElement) {
                            const name = nameElement.textContent?.trim() || `商品${index + 1}`;
                            return name.replace(/(.+?)\1+/, '$1').split(' (')[0] || `商品${index + 1}`;
                        }

                        return `商品${index + 1}`;
                    } catch (e) {
                        console.error(`获取商品${index}名称失败:`, e);
                        return `商品${index + 1}`;
                    }
                }

                function syncProductConfig() {
                    try {
                        const productCount = getProductCount();
                        console.log(`🔄 同步商品配置，检测到 ${productCount} 个商品`);

                        if (productCount === 0) {
                            console.log('❌ 未检测到商品，同步失败');
                            return false;
                        }

                        const oldCount = config.products.length;

                        // 如果商品数量变化不大，只更新名称
                        if (oldCount > 0 && Math.abs(oldCount - productCount) <= 2) {
                            let nameUpdated = false;
                            for (let i = 0; i < Math.min(productCount, oldCount); i++) {
                                const currentName = config.products[i].name;
                                const pageName = getProductName(i);
                                if (currentName.startsWith('商品') && !pageName.startsWith('商品')) {
                                    config.products[i].name = pageName;
                                    nameUpdated = true;
                                }
                            }
                            if (nameUpdated) {
                                saveConfig();
                                console.log('✅ 商品名称已更新');
                            }
                            return false;
                        }

                        // 商品数量变化较大，重新同步
                        const newProducts = [];
                        let hasChange = false;

                        for (let i = 0; i < productCount; i++) {
                            if (i < oldCount && config.products[i]) {
                                // 保留现有的关键词配置
                                newProducts.push({
                                    name: config.products[i].name,
                                    keywords: [...config.products[i].keywords]
                                });
                            } else {
                                // 新增商品
                                newProducts.push({
                                    name: getProductName(i),
                                    keywords: []
                                });
                                hasChange = true;
                            }
                        }

                        if (hasChange || productCount !== oldCount) {
                            config.products = newProducts;
                            if (config.currentProductIndex >= productCount) {
                                config.currentProductIndex = 0;
                            }
                            saveConfig();
                            console.log(`✅ 商品配置已同步: ${productCount} 个商品`);
                            notify('商品同步', `检测到 ${productCount} 个商品，已更新配置`);
                            return true;
                        }

                        return false;
                    } catch (e) {
                        console.error('❌ 商品同步失败:', e);
                        return false;
                    }
                }

                function createPanel() {
                    console.log('🎨 创建浮窗面板...');

                    const existingPanel = document.getElementById('explainPanel');
                    if (existingPanel) {
                        console.log('🗑️ 移除已存在的面板');
                        existingPanel.remove();
                    }

                    const div = document.createElement('div');
                    div.id = 'explainPanel';

                    let x = config.panelPosition.x;
                    let y = config.panelPosition.y;
                    const maxX = window.innerWidth - 360;
                    const maxY = window.innerHeight - 400;

                    if (x > maxX) x = maxX;
                    if (y > maxY) y = maxY;
                    if (x < 0) x = 20;
                    if (y < 0) y = 100;

                    config.panelPosition = { x, y };

                    div.style.cssText = `
                        position: fixed;
                        left: ${x}px;
                        top: ${y}px;
                        width: 360px;
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        border-radius: 12px;
                        color: #fff;
                        font-size: 14px;
                        z-index: 1000000;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                        padding: 0;
                        font-family: PingFang SC, Microsoft YaHei, sans-serif;
                        border: 2px solid rgba(255,255,255,0.1);
                    `;

                    div.innerHTML = `
<div style="padding:12px 16px;background:rgba(0,0,0,0.2);display:flex;justify-content:space-between;align-items:center;cursor:move;border-radius:12px 12px 0 0;">
    <span><b>🎤 智能直播助手</b> v9.9.9<br><small style="font-size:10px;opacity:0.8;">配置导入立即生效</small></span>
    <div style="display:flex;gap:4px;">
        <button id="minP" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:22px;height:22px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">−</button>
        <button id="closeP" style="background:rgba(255,255,255,0.2);border:none;color:#fff;width:22px;height:22px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
    </div>
</div>
<div id="panelBody" style="padding:16px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <span id="statusLight" style="width:10px;height:10px;border-radius:50%;background:#FF4757;"></span>
        <span>状态：<b id="statusText">已停止</b></span>
        <span id="backgroundStatus" style="margin-left:auto;font-size:10px;background:rgba(255,255,255,0.2);padding:2px 6px;border-radius:8px;">前台</span>
    </div>
    <div style="background:rgba(255,255,255,0.1);padding:8px;border-radius:6px;margin-bottom:10px;font-size:12px;">
        <div style="margin-bottom:8px;">当前商品：<b id="curProduct">--</b> (<span id="curIndex">0</span>/<span id="totalProducts">0</span>)</div>
        <div style="margin-bottom:8px;">优先商品：<b id="priProduct">无</b></div>
        <div>讲解状态：<b id="expStatus">未讲解</b></div>
    </div>
    <div style="background:rgba(255,255,255,0.1);padding:10px;border-radius:8px;margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:12px;opacity:0.8;">下次轮播倒计时：</div>
            <div id="countdown" style="font-size:20px;font-family:monospace;font-weight:bold;color:#2ED573;">--:--</div>
        </div>
    </div>
    <div style="background:rgba(255,255,255,0.1);padding:8px;border-radius:6px;margin-bottom:10px;font-size:12px;">
        <div style="margin-bottom:6px;">
            <div>最新评论：<span id="lastComment">暂无</span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;grid-gap:4px;">
            <div>匹配关键词：<span id="matchedKw">无</span></div>
            <div>回复状态：<span id="replyActionStatus">未触发</span></div>
            <div>自动回复：<span id="autoReplyStatus">${config.autoReplyEnabled ? '开启' : '关闭'}</span></div>
            <div>冷却状态：<span id="cooldownStatus">可回复</span></div>
            <div>随机表情：<span id="emojiStatus">${config.useRandomEmoji ? '开启' : '关闭'}</span></div>
            <div>检测间隔：<span id="checkInterval">${config.commentCheckInterval}ms</span></div>
        </div>
    </div>
    <div style="background:rgba(255,255,255,0.1);padding:8px;border-radius:6px;margin-bottom:10px;font-size:12px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;grid-gap:4px;">
            <div>弹窗关闭：<span id="popupClosedCount">${status.popupsClosed}</span></div>
            <div>自动关闭：<span id="autoClosePopupStatus">${config.autoClosePopup ? '开启' : '关闭'}</span></div>
        </div>
    </div>
    <div style="margin-bottom:10px;">
        <div style="display:flex;gap:8px;margin-bottom:8px;">
            <input id="minIntervalInp" type="number" min="5" max="3600" value="${config.minInterval/1000}" style="flex:1;padding:8px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;background:rgba(255,255,255,0.1);color:#fff;" placeholder="最小秒数">
            <input id="maxIntervalInp" type="number" min="5" max="3600" value="${config.maxInterval/1000}" style="flex:1;padding:8px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;background:rgba(255,255,255,0.1);color:#fff;" placeholder="最大秒数">
        </div>
        <button id="setIntervalBtn" style="width:100%;padding:8px;background:rgba(255,255,255,0.2);border:none;border-radius:6px;color:#fff;cursor:pointer;">更新间隔</button>
        <button id="toggleBtn" style="width:100%;margin-top:8px;padding:10px;background:linear-gradient(135deg,#2ED573,#1E90FF);border:none;border-radius:8px;color:#fff;font-weight:bold;cursor:pointer;">🚀 开始轮播</button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
        <button id="manualBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">🔍手动讲解</button>
        <button id="nextBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">⏭️下一商品</button>
        <button id="editBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">📝编辑商品</button>
        <button id="forceBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">⚡强制讲解</button>
        <button id="resetBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">🔄重置统计</button>
        <button id="syncBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">🔄同步商品</button>
        <button id="replyBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">💬回复设置</button>
        <button id="exportBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">📤导出配置</button>
        <button id="importBtn" style="padding:3px;background:rgba(255,255,255,0.2);border:none;border-radius:4px;color:#fff;cursor:pointer;">📥导入配置</button>
    </div>
</div>
`;

                    document.body.appendChild(div);
                    console.log('✅ 浮窗面板已创建');

                    bindPanelEvents(div);
                    makeDrag(div);

                    startMonitors();
                    updateUI();

                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes pulse {
                            0% { opacity: 1; }
                            50% { opacity: 0.7; }
                            100% { opacity: 1; }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        #explainPanel {
                            animation: fadeIn 0.5s ease-in;
                        }
                        #explainPanel button:hover {
                            opacity: 0.8;
                            transform: scale(1.05);
                            transition: all 0.2s ease;
                        }
                        #explainPanel input::placeholder {
                            color: rgba(255,255,255,0.5);
                        }
                        .background-mode {
                            opacity: 0.9;
                            border: 2px solid #FFA500 !important;
                        }
                    `;
                    document.head.appendChild(style);

                    notify('脚本加载完成', 'v9.9.9 配置导入立即生效版已就绪');
                }

                function bindPanelEvents(panel) {
                    console.log('🔗 绑定面板事件...');

                    // 使用事件委托，确保所有按钮都能正确响应
                    panel.addEventListener('click', function(e) {
                        // 找到被点击的按钮元素
                        let target = e.target;
                        while (target && target !== panel) {
                            if (target.tagName === 'BUTTON') {
                                break;
                            }
                            target = target.parentElement;
                        }

                        if (!target || target.tagName !== 'BUTTON') return;

                        const id = target.id;
                        console.log('点击按钮:', id);

                        // 使用switch语句确保所有按钮都能正确响应
                        switch(id) {
                            case 'toggleBtn':
                                toggleRun();
                                break;
                            case 'setIntervalBtn':
                                updateInterval();
                                break;
                            case 'manualBtn':
                                manualExplain();
                                break;
                            case 'nextBtn':
                                nextProduct();
                                break;
                            case 'editBtn':
                                openEditor();
                                break;
                            case 'forceBtn':
                                forceExplain();
                                break;
                            case 'resetBtn':
                                resetStats();
                                break;
                            case 'syncBtn':
                                syncProducts();
                                break;
                            case 'replyBtn':
                                openReplyEditor();
                                break;
                            case 'exportBtn':
                                ConfigManager.exportConfig();
                                break;
                            case 'importBtn':
                                ConfigManager.importConfig();
                                break;
                            case 'minP':
                                minimizePanel();
                                break;
                            case 'closeP':
                                closePanel();
                                break;
                            default:
                                console.log('未知按钮:', id);
                        }
                    });
                }

                function makeDrag(el) {
                    const head = el.querySelector('div:first-child');
                    let isDragging = false;
                    let offsetX, offsetY;

                    head.addEventListener('mousedown', function(e) {
                        if (e.target.tagName === 'BUTTON') return;

                        isDragging = true;
                        offsetX = e.clientX - el.offsetLeft;
                        offsetY = e.clientY - el.offsetTop;

                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);

                        e.preventDefault();
                    });

                    function onMouseMove(e) {
                        if (!isDragging) return;

                        let x = e.clientX - offsetX;
                        let y = e.clientY - offsetY;

                        const maxX = window.innerWidth - el.offsetWidth;
                        const maxY = window.innerHeight - el.offsetHeight;

                        x = Math.max(0, Math.min(x, maxX));
                        y = Math.max(0, Math.min(y, maxY));

                        el.style.left = x + 'px';
                        el.style.top = y + 'px';

                        config.panelPosition = { x, y };
                    }

                    function onMouseUp() {
                        isDragging = false;
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                        saveConfig();
                    }
                }

                function startMonitors() {
                    console.log('🔍 启动监控器...');

                    if (commentMonitorId) {
                        clearInterval(commentMonitorId);
                    }

                    commentMonitorId = setInterval(() => {
                        if (!document.hidden || BackgroundManager.isBackgroundMode) {
                            checkComment();
                        }
                    }, config.commentCheckInterval);

                    // 启动UI更新定时器
                    if (uiUpdateIntervalId) {
                        clearInterval(uiUpdateIntervalId);
                    }
                    uiUpdateIntervalId = setInterval(updateUI, updateUIFrequency);

                    if (status.isRunning && !countdownMonitorId) {
                        countdownMonitorId = setInterval(updateCountdown, 500);
                    }

                    console.log('✅ 监控器已启动');
                }

                function updateCountdown() {
                    const el = document.getElementById('countdown');
                    if(!el) return;

                    if(!status.isRunning || !status.nextClickTime) {
                        el.textContent = '--:--';
                        return;
                    }

                    const left = status.nextClickTime - Date.now();
                    if(left <= 0) {
                        el.textContent = '00:00';
                        executeTimedExplain();
                        scheduleNextClick();
                        return;
                    }

                    const s = Math.ceil(left/1000);
                    const m = Math.floor(s/60);
                    const rs = s % 60;
                    el.textContent = `${String(m).padStart(2,'0')}:${String(rs).padStart(2,'0')}`;
                }

                function checkComment() {
                    try {
                        const now = Date.now();
                        if (now - status.lastCommentCheck < config.commentCheckInterval) {
                            return;
                        }
                        status.lastCommentCheck = now;

                        const commentSelectors = [
                            '.item-jRI0X3',
                            '[data-e2e="comment-item"]',
                            '.comment-item',
                            '.webcast-chatroom___items .webcast-chatroom___item'
                        ];

                        let items = [];
                        for (const selector of commentSelectors) {
                            items = document.querySelectorAll(selector);
                            if (items.length > 0) break;
                        }

                        if(!items.length) return;

                        const latestItem = items[items.length - 1];
                        const commentText = getCommentText(latestItem);

                        if(commentText && commentText !== status.lastComment) {
                            status.lastComment = commentText;
                            const displayText = commentText.length > 15 ? commentText.slice(0,15)+'…' : commentText;
                            const lastCommentEl = document.getElementById('lastComment');
                            if (lastCommentEl) lastCommentEl.textContent = displayText;

                            analyseComment(commentText);
                        }
                    } catch(e){
                        console.error('评论检测错误:', e);
                    }
                }

                function getCommentText(commentElement) {
                    if (!commentElement) return '';

                    const textSelectors = [
                        '.item-content-PYLVxE',
                        '.comment-text',
                        '.webcast-chatroom___content',
                        '[data-e2e="comment-content"]',
                        '.text-content'
                    ];

                    for (const selector of textSelectors) {
                        const textElement = commentElement.querySelector(selector);
                        if (textElement && textElement.textContent) {
                            return textElement.textContent.trim();
                        }
                    }

                    return commentElement.textContent?.trim() || '';
                }

                function analyseComment(txt) {
                    if (!txt) return;

                    const t = txt.toLowerCase();
                    let keywordMatched = false;
                    let matchedProductIndex = -1;
                    let matchedKeyword = '';

                    for(let i = 0; i < config.products.length; i++){
                        for(const k of config.products[i].keywords){
                            if(k && t.includes(k.toLowerCase())){
                                keywordMatched = true;
                                matchedProductIndex = i;
                                matchedKeyword = k;
                                break;
                            }
                        }
                        if (keywordMatched) break;
                    }

                    if (keywordMatched && matchedProductIndex >= 0) {
                        console.log(`🔑 检测到关键词 "${matchedKeyword}"，立即讲解商品 ${matchedProductIndex}`);

                        const matchedKwEl = document.getElementById('matchedKw');
                        if (matchedKwEl) matchedKwEl.textContent = matchedKeyword;

                        if (config.immediateExplain) {
                            immediateExecuteExplain('comment', matchedProductIndex, matchedKeyword);
                        } else {
                            status.priorityProduct = matchedProductIndex;
                            notify('关键词触发',`「${matchedKeyword}」→ 准备讲解《${config.products[matchedProductIndex].name}》`);
                        }

                        if(status.isRunning) {
                            scheduleNextClick();
                        }

                        if (config.explainPriority) {
                            return;
                        }
                    }

                    if (config.autoReplyEnabled && canReply() && !keywordMatched) {
                        checkAutoReplyKeywords(txt, t);
                    } else if (!keywordMatched) {
                        const matchedKwEl = document.getElementById('matchedKw');
                        if (matchedKwEl) matchedKwEl.textContent = '无';
                    }
                }

                function checkAutoReplyKeywords(originalText, lowerText) {
                    for (const rule of config.replyRules) {
                        for (const keyword of rule.keywords) {
                            if (lowerText.includes(keyword.toLowerCase()) && originalText !== status.lastRepliedComment) {
                                status.lastMatchedKeyword = keyword;

                                const availableReplies = rule.replies || [rule.reply || ''];
                                const selectedReply = getRandomReply(availableReplies);

                                if (!selectedReply) {
                                    console.log('❌ 没有可用的回复内容');
                                    updateReplyActionStatus('无可用回复');
                                    return;
                                }

                                let finalReply = selectedReply;

                                if (config.useRandomEmoji) {
                                    finalReply = addRandomEmoji(finalReply);
                                }

                                const delay = 1000 + Math.random() * 2000;

                                updateReplyActionStatus('准备回复');

                                setTimeout(async () => {
                                    if (canReply()) {
                                        const success = await autoReply(finalReply);
                                        if (success) {
                                            status.lastRepliedComment = originalText;
                                            updateReplyActionStatus('已回复');
                                            notify('自动回复', `关键词「${keyword}」触发回复（${availableReplies.length}条话术随机选择）`);
                                        } else {
                                            updateReplyActionStatus('回复失败');
                                        }
                                    } else {
                                        updateReplyActionStatus('跳过回复');
                                    }
                                }, delay);

                                const matchedKwEl = document.getElementById('matchedKw');
                                if (matchedKwEl) matchedKwEl.textContent = keyword;
                                return;
                            }
                        }
                    }
                }

                function updateReplyActionStatus(action) {
                    status.lastReplyAction = action;
                    const replyActionEl = document.getElementById('replyActionStatus');
                    if (replyActionEl) {
                        replyActionEl.textContent = action;

                        if (action === '已回复') {
                            replyActionEl.style.color = '#2ED573';
                        } else if (action === '准备回复' || action === '跳过回复') {
                            replyActionEl.style.color = '#FFA500';
                        } else if (action === '回复失败' || action === '无可用回复') {
                            replyActionEl.style.color = '#FF4757';
                        } else {
                            replyActionEl.style.color = '#FFFFFF';
                        }
                    }
                }

                function immediateExecuteExplain(trigger, productIndex, keyword) {
                    if (status.isClicking) {
                        console.log(`⏳ 正在点击中，将商品 ${productIndex} 加入待处理队列`);
                        status.pendingExplain = { trigger, productIndex, keyword };
                        return;
                    }

                    executeDirectExplain(trigger, productIndex, keyword);
                }

                function canReply() {
                    const now = Date.now();

                    const cooldownRemaining = status.lastReplyTime + config.replyCooldown - now;
                    if (cooldownRemaining > 0) {
                        updateReplyActionStatus('冷却中');
                        return false;
                    }

                    const recentReplies = status.lastReplies.filter(time =>
                                                                    now - time < 60000
                                                                   );
                    if (recentReplies.length >= config.maxRepliesPerMinute) {
                        console.log('达到每分钟回复次数限制');
                        updateReplyActionStatus('频率限制');
                        return false;
                    }

                    if (Math.random() > config.replyProbability) {
                        console.log('随机跳过本次回复');
                        updateReplyActionStatus('概率跳过');
                        return false;
                    }

                    return true;
                }

                function updateReplyStatus() {
                    const now = Date.now();
                    status.lastReplyTime = now;
                    status.lastReplies.push(now);

                    status.lastReplies = status.lastReplies.filter(time =>
                                                                   now - time < 120000
                                                                  );

                    config.replyCooldown = getRandomCooldown();
                    console.log(`⏰ 下次冷却时间: ${config.replyCooldown/1000}秒`);
                }

                function simulateHumanInput(inputElement, text) {
                    return new Promise((resolve) => {
                        let currentText = '';
                        let index = 0;
                        let errorCount = 0;

                        const typeNextChar = () => {
                            if (index >= text.length) {
                                resolve(true);
                                return;
                            }

                            const baseDelay = 80 + Math.random() * 120;

                            if (config.useHumanLikeBehavior && Math.random() < 0.1 && index > 2 && errorCount < 2) {
                                simulateTypo().then(typeNextChar);
                                errorCount++;
                                return;
                            }

                            setTimeout(() => {
                                currentText += text.charAt(index);
                                inputElement.value = currentText;

                                const inputEvent = new Event('input', { bubbles: true });
                                inputElement.dispatchEvent(inputEvent);

                                index++;
                                typeNextChar();
                            }, baseDelay);
                        };

                        const simulateTypo = () => {
                            return new Promise((resolveTypo) => {
                                const wrongChars = 'asdfghjkl;';
                                const wrongChar = wrongChars[Math.floor(Math.random() * wrongChars.length)];

                                setTimeout(() => {
                                    currentText += wrongChar;
                                    inputElement.value = currentText;
                                    const inputEvent = new Event('input', { bubbles: true });
                                    inputElement.dispatchEvent(inputEvent);

                                    setTimeout(() => {
                                        currentText = currentText.slice(0, -1);
                                        inputElement.value = currentText;
                                        const inputEvent2 = new Event('input', { bubbles: true });
                                        inputElement.dispatchEvent(inputEvent2);

                                        setTimeout(() => {
                                            currentText += text.charAt(index);
                                            inputElement.value = currentText;
                                            const inputEvent3 = new Event('input', { bubbles: true });
                                            inputElement.dispatchEvent(inputEvent3);

                                            index++;
                                            resolveTypo();
                                        }, 100 + Math.random() * 100);
                                    }, 200 + Math.random() * 200);
                                }, 100 + Math.random() * 100);
                            });
                        };

                        typeNextChar();
                    });
                }

                async function autoReply(replyText) {
                    try {
                        if (!canReply()) {
                            console.log('回复条件不满足，跳过本次回复');
                            return false;
                        }

                        const inputElement = document.querySelector('.input-EghOjQ');
                        if (!inputElement) {
                            console.log('未找到评论输入框');
                            return false;
                        }

                        console.log('开始自动回复流程，回复内容:', replyText);

                        await simulateHumanInput(inputElement, replyText);

                        await new Promise(resolve =>
                                          setTimeout(resolve, 1000 + Math.random() * 2000)
                                         );

                        const success = await sendComment(inputElement);

                        if (success) {
                            updateReplyStatus();
                            console.log('自动回复发送成功');
                        }

                        return success;
                    } catch (e) {
                        console.error('自动回复失败:', e);
                        return false;
                    }
                }

                async function sendComment(inputElement) {
                    return new Promise((resolve) => {
                        try {
                            const sendButton = document.querySelector('.button-Wc1yvW');
                            if (sendButton && !sendButton.classList.contains('button-disable-MIXLyd')) {
                                console.log('找到可用发送按钮，尝试点击');
                                sendButton.click();

                                setTimeout(() => {
                                    inputElement.value = '';
                                    const inputEvent = new Event('input', { bubbles: true });
                                    inputElement.dispatchEvent(inputEvent);
                                    resolve(true);
                                }, 500);
                            } else {
                                console.log('发送按钮不可用，尝试模拟回车键');
                                const enterEvent = new KeyboardEvent('keydown', {
                                    key: 'Enter',
                                    code: 'Enter',
                                    keyCode: 13,
                                    which: 13,
                                    bubbles: true,
                                    cancelable: true
                                });

                                inputElement.dispatchEvent(enterEvent);

                                setTimeout(() => {
                                    inputElement.value = '';
                                    const inputEvent = new Event('input', { bubbles: true });
                                    inputElement.dispatchEvent(inputEvent);
                                    resolve(true);
                                }, 500);
                            }
                        } catch (e) {
                            console.error('发送评论失败:', e);
                            resolve(false);
                        }
                    });
                }

                function updateCooldownStatus() {
                    const el = document.getElementById('cooldownStatus');
                    if (!el) return;

                    const now = Date.now();
                    const cooldownRemaining = status.lastReplyTime + config.replyCooldown - now;

                    if (cooldownRemaining <= 0) {
                        el.textContent = '可回复';
                        el.style.color = '#2ED573';
                    } else {
                        const secondsLeft = Math.ceil(cooldownRemaining / 1000);
                        el.textContent = `${secondsLeft}秒后`;
                        el.style.color = '#FF4757';
                    }
                }

                function findExplainButton(productIndex) {
                    const selectors = [
                        '.talking-btn-XzVTUV',
                        '.talking-word-S8p5x6',
                        '[class*="talking-btn"]',
                        '[class*="talking-word"]',
                        '[data-e2e="product-explanation"]',
                        '.explain-button'
                    ];

                    const containers = document.querySelectorAll('[data-index]');
                    let container = null;

                    for(const c of containers) {
                        if(+c.dataset.index === productIndex) {
                            container = c;
                            break;
                        }
                    }

                    if(!container) return {found:false};

                    for(const s of selectors){
                        const btn = container.querySelector(s);
                        if(btn && btn.textContent){
                            const txt = btn.textContent.trim();
                            if(txt === '讲解' || txt === '取消讲解' || txt.includes('讲解')) {
                                return {found:true, element:btn, type:txt};
                            }
                        }
                    }
                    return {found:false};
                }

                function safeClick(el){
                    try{
                        el.click();
                        return true;
                    } catch(e){
                        console.error('点击失败:', e);
                        return false;
                    }
                }

                function executeDirectExplain(trigger, productIndex, keyword = ''){
                    if(status.isClicking) {
                        console.log('正在点击中，跳过本次讲解');
                        return;
                    }

                    status.isClicking = true;

                    const st = findExplainButton(productIndex);
                    if(!st.found){
                        console.log(`❌ 未找到商品 ${productIndex} 的讲解按钮`);
                        status.errorCount++;
                        status.isClicking = false;

                        if (status.pendingExplain) {
                            const pending = status.pendingExplain;
                            status.pendingExplain = null;
                            setTimeout(() => {
                                executeDirectExplain(pending.trigger, pending.productIndex, pending.keyword);
                            }, 100);
                        }
                        return;
                    }

                    if(st.type === '讲解' || st.type.includes('讲解')){
                        console.log(`🎤 执行讲解: 商品 ${productIndex}`);
                        const clickSuccess = safeClick(st.element);
                        if (clickSuccess) {
                            afterExplain(trigger, productIndex, keyword);
                        } else {
                            console.log(`❌ 讲解点击失败: 商品 ${productIndex}`);
                            status.errorCount++;
                            status.isClicking = false;
                        }
                    } else {
                        console.log(`ℹ️ 商品 ${productIndex} 已在讲解中，跳过`);
                        status.isClicking = false;

                        if (trigger === 'comment' && keyword) {
                            notify('关键词触发',`「${keyword}」→ 《${config.products[productIndex].name}》已在讲解中`);
                        }
                    }
                }

                function afterExplain(trigger, productIndex, keyword = ''){
                    status.isExplaining = true;
                    status.currentExplainingProduct = productIndex;
                    updateExplainStatus();
                    config.clickCount++;
                    config.lastClickTime = Date.now();
                    saveConfig();

                    if (trigger === 'comment' && keyword) {
                        notify('关键词讲解成功',`「${keyword}」→ 《${config.products[productIndex].name}》已讲解（第${config.clickCount}次）`);
                    } else {
                        notify('讲解成功',`${config.products[productIndex].name} 已讲解（第${config.clickCount}次）`);
                    }

                    status.isClicking = false;

                    if (status.pendingExplain) {
                        const pending = status.pendingExplain;
                        status.pendingExplain = null;
                        setTimeout(() => {
                            executeDirectExplain(pending.trigger, pending.productIndex, pending.keyword);
                        }, 500);
                    }
                }

                function executeTimedExplain() {
                    if (status.isClicking) {
                        console.log('正在点击中，跳过本次轮播');
                        return;
                    }

                    const productCount = getProductCount();
                    if (productCount === 0) {
                        notify('轮播失败', '未检测到商品');
                        return;
                    }

                    console.log('🔄 开始轮播');

                    let nextIndex = (config.currentProductIndex + 1) % productCount;
                    console.log(`当前商品: ${config.currentProductIndex}, 下一个商品: ${nextIndex}`);

                    config.currentProductIndex = nextIndex;
                    saveConfig();
                    updateUI();

                    console.log(`轮播讲解商品: ${nextIndex}`);
                    executeDirectExplain('timer', nextIndex);
                }

                function toggleRun(){
                    status.isRunning = !status.isRunning;
                    config.enabled = status.isRunning;

                    if(status.isRunning){
                        syncProductConfig();
                        config.startTime = Date.now();
                        scheduleNextClick();
                        notify('轮播开始', `开始定时轮播 ${config.products.length} 个商品`);

                        if (countdownMonitorId) {
                            clearInterval(countdownMonitorId);
                        }
                        countdownMonitorId = setInterval(updateCountdown, 500);

                        startMonitors();
                    } else {
                        if(config.startTime) {
                            config.totalRunningTime += Date.now() - config.startTime;
                        }
                        config.startTime = null;
                        status.nextClickTime = null;

                        if (countdownMonitorId) {
                            clearInterval(countdownMonitorId);
                            countdownMonitorId = null;
                        }

                        notify('轮播停止', '已停止自动轮播');
                    }

                    saveConfig();
                    updateUI();
                }

                function updateInterval(){
                    const minVal = parseInt(document.getElementById('minIntervalInp').value);
                    const maxVal = parseInt(document.getElementById('maxIntervalInp').value);

                    if(minVal >= 5 && maxVal >= 5 && minVal <= 3600 && maxVal <= 3600 && minVal <= maxVal){
                        config.minInterval = minVal * 1000;
                        config.maxInterval = maxVal * 1000;
                        saveConfig();
                        if(status.isRunning) scheduleNextClick();
                        notify('设置成功',`轮播间隔已更新为 ${minVal}-${maxVal} 秒随机`);
                    } else {
                        document.getElementById('minIntervalInp').value = config.minInterval/1000;
                        document.getElementById('maxIntervalInp').value = config.maxInterval/1000;
                        notify('设置失败','请输入有效的间隔范围（5-3600秒，最小≤最大）');
                    }
                }

                function manualExplain(){
                    executeDirectExplain('manual', config.currentProductIndex);
                }

                function forceExplain(){
                    executeDirectExplain('force', config.currentProductIndex);
                }

                function nextProduct(){
                    const productCount = getProductCount();
                    if (productCount === 0) {
                        notify('切换失败', '未检测到商品');
                        return;
                    }

                    config.currentProductIndex = (config.currentProductIndex + 1) % productCount;
                    saveConfig();
                    updateUI();
                    notify('商品切换', `已切换到 ${config.products[config.currentProductIndex].name}`);
                }

                function resetStats(){
                    if(!confirm('重置所有统计？')) return;
                    Object.assign(config,{clickCount:0,totalRunningTime:0,lastClickTime:null});
                    Object.assign(status,{
                        errorCount:0,
                        lastComment:'',
                        priorityProduct:null,
                        isExplaining:false,
                        currentExplainingProduct:null,
                        lastRepliedComment:'',
                        lastReplyTime:0,
                        lastReplies:[],
                        lastCommentCheck:0,
                        pendingExplain:null,
                        lastMatchedKeyword: '',
                        lastReplyAction: '',
                        popupsClosed: 0
                    });
                    saveConfig();
                    updateUI();
                    notify('重置完成','统计已清空');
                }

                function syncProducts(){
                    console.log('🔄 强制同步商品...');

                    // 清除缓存，强制重新检测
                    const productCount = getProductCount();
                    console.log(`🔍 强制检测到 ${productCount} 个商品`);

                    const hasChange = syncProductConfig();
                    updateUI();

                    if (hasChange) {
                        notify('同步完成', `已同步 ${config.products.length} 个商品，请检查关键词配置`);
                    } else {
                        notify('同步完成', `已同步 ${config.products.length} 个商品`);
                    }
                }

                function minimizePanel(){
                    const b = document.getElementById('panelBody');
                    if(b) b.style.display = b.style.display === 'none' ? 'block' : 'none';
                }

                function closePanel(){
                    if(!confirm('关闭面板将停止轮播，确定？')) return;
                    const p = document.getElementById('explainPanel');
                    if(p) p.style.display = 'none';
                    config.enabled = false;
                    status.isRunning = false;
                    status.nextClickTime = null;

                    if (countdownMonitorId) {
                        clearInterval(countdownMonitorId);
                        countdownMonitorId = null;
                    }

                    if (commentMonitorId) {
                        clearInterval(commentMonitorId);
                        commentMonitorId = null;
                    }

                    if (uiUpdateIntervalId) {
                        clearInterval(uiUpdateIntervalId);
                        uiUpdateIntervalId = null;
                    }

                    saveConfig();
                    notify('面板已关闭','刷新页面重新显示');
                }

                function scheduleNextClick(){
                    const randomInterval = getRandomInterval();
                    status.nextClickTime = Date.now() + randomInterval;
                    console.log(`⏱️ 设置下一次轮播间隔: ${randomInterval/1000}秒`);
                }

                function updateUI(){
                    const light = document.getElementById('statusLight');
                    const txt = document.getElementById('statusText');
                    const btn = document.getElementById('toggleBtn');
                    const autoReplyStatus = document.getElementById('autoReplyStatus');
                    const emojiStatus = document.getElementById('emojiStatus');
                    const checkInterval = document.getElementById('checkInterval');
                    const backgroundStatus = document.getElementById('backgroundStatus');
                    const popupClosedCount = document.getElementById('popupClosedCount');
                    const autoClosePopupStatus = document.getElementById('autoClosePopupStatus');
                    const panel = document.getElementById('explainPanel');

                    if(light){
                        light.style.background = status.isRunning ? '#2ED573' : '#FF4757';
                        if(status.isRunning) {
                            light.style.animation = 'pulse 2s infinite';
                        } else {
                            light.style.animation = 'none';
                        }
                    }

                    if(txt) txt.textContent = status.isRunning ? '运行中' : '已停止';

                    if(autoReplyStatus) {
                        autoReplyStatus.textContent = config.autoReplyEnabled ? '开启' : '关闭';
                        autoReplyStatus.style.color = config.autoReplyEnabled ? '#2ED573' : '#FF4757';
                    }

                    if(emojiStatus) {
                        emojiStatus.textContent = config.useRandomEmoji ? '开启' : '关闭';
                        emojiStatus.style.color = config.useRandomEmoji ? '#2ED573' : '#FF4757';
                    }

                    if(checkInterval) {
                        checkInterval.textContent = config.commentCheckInterval + 'ms';
                    }

                    if(btn){
                        btn.textContent = status.isRunning ? '🛑 停止轮播' : '🚀 开始轮播';
                        btn.style.background = status.isRunning ?
                            'linear-gradient(135deg,#FF4757,#FF3742)' :
                        'linear-gradient(135deg,#2ED573,#1E90FF)';
                    }

                    // 更新弹窗统计
                    if (popupClosedCount) {
                        popupClosedCount.textContent = status.popupsClosed;
                    }

                    if (autoClosePopupStatus) {
                        autoClosePopupStatus.textContent = config.autoClosePopup ? '开启' : '关闭';
                        autoClosePopupStatus.style.color = config.autoClosePopup ? '#2ED573' : '#FF4757';
                    }

                    // 更新后台状态显示
                    if (backgroundStatus) {
                        if (BackgroundManager.isBackgroundMode) {
                            backgroundStatus.textContent = '后台';
                            backgroundStatus.style.background = '#FFA500';
                            if (panel) panel.classList.add('background-mode');
                        } else {
                            backgroundStatus.textContent = '前台';
                            backgroundStatus.style.background = 'rgba(255,255,255,0.2)';
                            if (panel) panel.classList.remove('background-mode');
                        }
                    }

                    updateProductsDisplay();
                    updateExplainStatus();
                    updatePriorityProduct();
                    updateCooldownStatus();

                    const replyActionEl = document.getElementById('replyActionStatus');
                    if (replyActionEl && status.lastReplyAction) {
                        replyActionEl.textContent = status.lastReplyAction;
                    }
                }

                function updateProductsDisplay(){
                    const productCount = getProductCount();
                    const el = document.getElementById('curProduct');
                    const indexEl = document.getElementById('curIndex');
                    const totalEl = document.getElementById('totalProducts');

                    if(el) {
                        const productName = config.products[config.currentProductIndex]?.name || '未知商品';
                        const cleanName = productName.replace(/(.+?)\1+/, '$1').split(' (')[0];
                        el.textContent = cleanName;
                    }

                    if(indexEl) indexEl.textContent = config.currentProductIndex + 1;
                    if(totalEl) totalEl.textContent = productCount;
                }

                function updateExplainStatus(){
                    const el = document.getElementById('expStatus');
                    if(el){
                        el.textContent = status.isExplaining ? '讲解中' : '未讲解';
                        el.style.color = status.isExplaining ? '#2ED573' : '#FF4757';
                    }
                }

                function updatePriorityProduct(){
                    const el = document.getElementById('priProduct');
                    if(el){
                        if(status.priorityProduct !== null){
                            el.textContent = config.products[status.priorityProduct]?.name;
                            el.style.color = '#FFD700';
                        } else {
                            el.textContent = '无';
                            el.style.color = '#FFFFFF';
                        }
                    }
                }

                /* ---------------------  编辑器功能  --------------------- */
                function openEditor() {
                    console.log('📝 打开商品编辑器...');

                    const old = document.getElementById('editorPanel');
                    if (old) old.remove();

                    const div = document.createElement('div');
                    div.id = 'editorPanel';
                    div.style.cssText = `
                        position: fixed;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 450px;
                        max-height: 80vh;
                        overflow-y: auto;
                        background: #fff;
                        color: #333;
                        border-radius: 10px;
                        padding: 20px;
                        z-index: 9999999;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                        font-size: 14px;
                    `;

                    let html = `
                        <div style="display:flex;justify-content:space-between;margin-bottom:12px;align-items:center;">
                            <b>编辑商品名称 & 关键词</b>
                            <button id="closeEd" style="background:#ff4757;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer;">×</button>
                        </div>
                        <div style="font-size:12px;color:#666;margin-bottom:10px;">
                            检测到 ${config.products.length} 个商品，关键词用英文逗号分隔
                        </div>
                    `;

                    config.products.forEach((p, i) => {
                        const pageName = getProductName(i);
                        const displayName = p.name && !p.name.startsWith('商品') ? p.name : pageName;
                        const keywordsValue = Array.isArray(p.keywords) ? p.keywords.join(', ') : '';

                        html += `
                            <div style="margin-bottom:15px;padding:10px;border:1px solid #eee;border-radius:6px;">
                                <div style="font-weight:bold;margin-bottom:5px;">商品${i+1}</div>
                                <div style="font-size:12px;color:#888;margin-bottom:8px;">页面名称: ${pageName}</div>
                                <label style="font-size:12px;display:block;margin-bottom:4px;">自定义名称</label>
                                <input class="nameInp" data-idx="${i}" value="${p.name || pageName}" placeholder="${pageName}" style="width:100%;padding:6px 8px;margin-bottom:8px;border:1px solid #ccc;border-radius:4px;">
                                <label style="font-size:12px;display:block;margin-bottom:4px;">关键词</label>
                                <input class="kwInp" data-idx="${i}" value="${keywordsValue}" placeholder="数学,计算" style="width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:4px;">
                            </div>
                        `;
                    });

                    html += `
                        <div style="display:flex;gap:10px;margin-top:15px;position:sticky;bottom:0;background:#fff;padding-top:10px;">
                            <button id="saveEd" style="flex:1;padding:10px;background:#2ed573;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">保存配置</button>
                            <button id="cancelEd" style="flex:1;padding:10px;background:#ddd;color:#333;border:none;border-radius:4px;cursor:pointer;">取消</button>
                        </div>
                    `;

                    div.innerHTML = html;
                    document.body.appendChild(div);

                    // 修复编辑器事件绑定
                    div.addEventListener('click', function(e) {
                        const target = e.target;
                        if (!target || target.tagName !== 'BUTTON') return;

                        const id = target.id;
                        console.log('编辑器点击按钮:', id);

                        if (id === 'closeEd' || id === 'cancelEd') {
                            div.remove();
                        } else if (id === 'saveEd') {
                            saveEditorChanges(div);
                        }
                    });

                    console.log('✅ 商品编辑器已打开');
                }

                function saveEditorChanges(editorDiv) {
                    try {
                        const nameInputs = editorDiv.querySelectorAll('.nameInp');
                        const kwInputs = editorDiv.querySelectorAll('.kwInp');

                        nameInputs.forEach(inp => {
                            const idx = parseInt(inp.dataset.idx);
                            const value = inp.value.trim();
                            config.products[idx].name = value || getProductName(idx);
                        });

                        kwInputs.forEach(inp => {
                            const idx = parseInt(inp.dataset.idx);
                            const value = inp.value;
                            const keywords = value.split(',').map(s => s.trim()).filter(Boolean);
                            config.products[idx].keywords = keywords;
                        });

                        saveConfig();
                        updateUI();
                        editorDiv.remove();
                        notify('保存成功', '商品名称与关键词已更新');
                    } catch (e) {
                        console.error('保存编辑器设置失败:', e);
                        notify('保存失败', '请检查输入是否正确');
                    }
                }

                /* ---------------------  回复设置功能  --------------------- */
                function openReplyEditor() {
                    console.log('💬 打开回复设置编辑器...');

                    const old = document.getElementById('replyEditorPanel');
                    if (old) old.remove();

                    const div = document.createElement('div');
                    div.id = 'replyEditorPanel';
                    div.style.cssText = `
                        position: fixed;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 500px;
                        max-height: 80vh;
                        overflow: hidden;
                        background: #fff;
                        color: #333;
                        border-radius: 12px;
                        z-index: 9999999;
                        box-shadow: 0 12px 48px rgba(0,0,0,0.3);
                        font-size: 14px;
                        display: flex;
                        flex-direction: column;
                    `;

                    let html = `
                        <div style="flex-shrink: 0; padding: 20px 20px 12px; background: #fff; border-bottom: 1px solid #eee; border-radius: 12px 12px 0 0; position: sticky; top: 0; z-index: 10;">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <b style="font-size:15px;">💬 自动回复设置 - 多话术随机版</b>
                                <button id="closeReplyEd" style="background:#ff4757;color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;">×</button>
                            </div>
                        </div>

                        <div style="flex: 1; overflow-y: auto; padding: 0 20px 20px;">
                            <div style="margin-bottom:16px;">
                                <div style="font-weight:bold;margin-bottom:10px;color:#2c3e50;font-size:13px;">⚙️ 功能开关</div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                    <div style="padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;">
                                            <div>
                                                <div style="font-weight:bold;color:#2c3e50;font-size:12px;">自动回复</div>
                                                <div style="font-size:11px;color:#666;margin-top:2px;">关键词触发回复</div>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="autoReplyToggle" ${config.autoReplyEnabled ? 'checked' : ''}>
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div style="padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;">
                                            <div>
                                                <div style="font-weight:bold;color:#2c3e50;font-size:12px;">后台运行</div>
                                                <div style="font-size:11px;color:#666;margin-top:2px;">页面隐藏时继续</div>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="backgroundModeToggle" ${config.backgroundModeEnabled ? 'checked' : ''}>
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div style="padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;">
                                            <div>
                                                <div style="font-weight:bold;color:#2c3e50;font-size:12px;">防作弊优化</div>
                                                <div style="font-size:11px;color:#666;margin-top:2px;">降低检测风险</div>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="antiCheatToggle" ${config.antiCheatEnabled ? 'checked' : ''}>
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div style="padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;">
                                            <div>
                                                <div style="font-weight:bold;color:#2c3e50;font-size:12px;">随机表情</div>
                                                <div style="font-size:11px;color:#666;margin-top:2px;">回复更自然</div>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="randomEmojiToggle" ${config.useRandomEmoji ? 'checked' : ''}>
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                    </div>

                                    <div style="padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;">
                                        <div style="display:flex;justify-content:space-between;align-items:center;">
                                            <div>
                                                <div style="font-weight:bold;color:#2c3e50;font-size:12px;">自动关闭弹窗</div>
                                                <div style="font-size:11px;color:#666;margin-top:2px;">检测并关闭频繁切换提示</div>
                                            </div>
                                            <label class="switch">
                                                <input type="checkbox" id="autoClosePopupToggle" ${config.autoClosePopup ? 'checked' : ''}>
                                                <span class="slider"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style="padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;margin-bottom:16px;">
                                <div style="font-weight:bold;margin-bottom:10px;color:#2c3e50;font-size:13px;">⚡ 响应优化</div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                    <div>
                                        <label style="font-size:12px;display:block;margin-bottom:6px;">检测间隔</label>
                                        <select id="checkIntervalSelect" style="width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:4px;background:#fff;font-size:12px;">
                                            <option value="200" ${config.commentCheckInterval === 200 ? 'selected' : ''}>200ms (最快)</option>
                                            <option value="500" ${config.commentCheckInterval === 500 ? 'selected' : ''}>500ms (推荐)</option>
                                            <option value="1000" ${config.commentCheckInterval === 1000 ? 'selected' : ''}>1000ms (平衡)</option>
                                            <option value="2000" ${config.commentCheckInterval === 2000 ? 'selected' : ''}>2000ms (保守)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="font-size:12px;display:block;margin-bottom:6px;">回复延迟(ms)</label>
                                        <input type="number" id="replyDelayInp" value="${config.replyDelay}" min="1000" max="10000" style="width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                                    </div>
                                </div>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;">
                                    <div>
                                        <div style="font-size:12px;">关键词立即讲解</div>
                                        <div style="font-size:11px;color:#666;">检测到关键词立即讲解</div>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="immediateExplainToggle" ${config.immediateExplain ? 'checked' : ''}>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
                                    <div>
                                        <div style="font-size:12px;">讲解优先回复</div>
                                        <div style="font-size:11px;color:#666;">讲解优先于自动回复</div>
                                    </div>
                                    <label class="switch">
                                        <input type="checkbox" id="explainPriorityToggle" ${config.explainPriority ? 'checked' : ''}>
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div style="padding:12px;border:1px solid #e1e5e9;border-radius:6px;background:#f8f9fa;margin-bottom:16px;">
                                <div style="font-weight:bold;margin-bottom:10px;color:#2c3e50;font-size:13px;">🛡️ 防作弊设置</div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                                    <div>
                                        <label style="font-size:12px;display:block;margin-bottom:6px;">最小冷却(秒)</label>
                                        <input type="number" id="minCooldownInp" value="${config.minReplyCooldown/1000}" min="10" max="60" style="width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                                    </div>
                                    <div>
                                        <label style="font-size:12px;display:block;margin-bottom:6px;">最大冷却(秒)</label>
                                        <input type="number" id="maxCooldownInp" value="${config.maxReplyCooldown/1000}" min="20" max="120" style="width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                                    </div>
                                </div>
                                <div style="margin-bottom:10px;">
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                        <label style="font-size:12px;">回复概率</label>
                                        <span style="font-size:12px;font-weight:bold;" id="probValue">${Math.round(config.replyProbability*100)}%</span>
                                    </div>
                                    <input type="range" id="replyProbInp" min="10" max="100" value="${config.replyProbability*100}" style="width:100%;height:4px;border-radius:2px;">
                                </div>
                                <div>
                                    <label style="font-size:12px;display:block;margin-bottom:6px;">每分钟最大回复数</label>
                                    <input type="number" id="maxRepliesInp" value="${config.maxRepliesPerMinute}" min="1" max="10" style="width:100%;padding:6px 8px;border:1px solid #ccc;border-radius:4px;font-size:12px;">
                                </div>
                            </div>

                            <div style="margin-bottom:16px;">
                                <div style="font-weight:bold;margin-bottom:8px;color:#2c3e50;font-size:13px;">📝 多话术回复规则</div>
                                <div style="font-size:11px;color:#666;margin-bottom:8px;line-height:1.4;">
                                    格式：关键词=>回复1||回复2||回复3<br>
                                    使用 <span style="color:#ff4757;font-weight:bold;">||</span> 分隔多条回复话术
                                </div>
                                <textarea id="replyRulesText" style="width:100%;height:150px;padding:10px;border:1px solid #ccc;border-radius:6px;font-size:12px;resize:vertical;font-family:monospace;line-height:1.4;" placeholder="哪里,在哪=>回复1||回复2||回复3
价格,多少钱=>回复A||回复B||回复C">`;

                    if (config.replyRules && config.replyRules.length > 0) {
                        const rulesText = config.replyRules.map(rule => {
                            const keywords = rule.keywords.join(',');
                            const replies = rule.replies ? rule.replies.join('||') : (rule.reply || '');
                            return `${keywords}=>${replies}`;
                        }).join('\n');
                        html += rulesText;
                    }

                    html += `</textarea>
                            </div>

                            <div style="display:flex;gap:10px;">
                                <button id="saveReplyEd" style="flex:1;padding:10px;background:#2ed573;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:13px;">保存设置</button>
                                <button id="testReplyBtn" style="flex:1;padding:10px;background:#1e90ff;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">测试回复</button>
                                <button id="exportConfigBtn" style="flex:1;padding:10px;background:#ffa500;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">导出配置</button>
                                <button id="importConfigBtn" style="flex:1;padding:10px;background:#9b59b6;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">导入配置</button>
                                <button id="cancelReplyEd" style="flex:1;padding:10px;background:#e9ecef;color:#495057;border:none;border-radius:6px;cursor:pointer;font-size:13px;">取消</button>
                            </div>
                        </div>
                    `;

                    div.innerHTML = html;
                    document.body.appendChild(div);

                    const style = document.createElement('style');
                    style.textContent = `
                        .switch {
                            position: relative;
                            display: inline-block;
                            width: 44px;
                            height: 22px;
                        }
                        .switch input {
                            opacity: 0;
                            width: 0;
                            height: 0;
                        }
                        .slider {
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-color: #ccc;
                            transition: .4s;
                            border-radius: 22px;
                        }
                        .slider:before {
                            position: absolute;
                            content: "";
                            height: 16px;
                            width: 16px;
                            left: 3px;
                            bottom: 3px;
                            background-color: white;
                            transition: .4s;
                            border-radius: 50%;
                        }
                        input:checked + .slider {
                            background-color: #2ed573;
                        }
                        input:checked + .slider:before {
                            transform: translateX(22px);
                        }
                        input:focus + .slider {
                            box-shadow: 0 0 1px #2ed573;
                        }
                    `;
                    div.appendChild(style);

                    const probSlider = div.querySelector('#replyProbInp');
                    const probValue = div.querySelector('#probValue');
                    if (probSlider && probValue) {
                        probSlider.addEventListener('input', function() {
                            probValue.textContent = this.value + '%';
                        });
                    }

                    // 修复回复编辑器事件绑定
                    div.addEventListener('click', function(e) {
                        const target = e.target;
                        if (!target || target.tagName !== 'BUTTON') return;

                        const id = target.id;
                        console.log('回复编辑器点击按钮:', id);

                        if (id === 'closeReplyEd' || id === 'cancelReplyEd') {
                            div.remove();
                        } else if (id === 'saveReplyEd') {
                            saveReplySettings(div);
                        } else if (id === 'testReplyBtn') {
                            testAutoReply();
                        } else if (id === 'exportConfigBtn') {
                            ConfigManager.exportConfig();
                        } else if (id === 'importConfigBtn') {
                            ConfigManager.importConfig();
                        }
                    });

                    // 修复切换事件绑定
                    setupToggleEvent(div, '#autoReplyToggle', 'autoReplyEnabled');
                    setupToggleEvent(div, '#backgroundModeToggle', 'backgroundModeEnabled');
                    setupToggleEvent(div, '#antiCheatToggle', 'antiCheatEnabled');
                    setupToggleEvent(div, '#randomEmojiToggle', 'useRandomEmoji');
                    setupToggleEvent(div, '#immediateExplainToggle', 'immediateExplain');
                    setupToggleEvent(div, '#explainPriorityToggle', 'explainPriority');
                    setupToggleEvent(div, '#autoClosePopupToggle', 'autoClosePopup');

                    const checkIntervalSelect = div.querySelector('#checkIntervalSelect');
                    if (checkIntervalSelect) {
                        checkIntervalSelect.addEventListener('change', function() {
                            config.commentCheckInterval = parseInt(this.value);
                            startMonitors();
                            updateUI();
                        });
                    }

                    console.log('✅ 回复设置编辑器已打开');
                }

                function setupToggleEvent(container, selector, configKey) {
                    const toggle = container.querySelector(selector);
                    if (toggle) {
                        toggle.addEventListener('change', function() {
                            config[configKey] = this.checked;
                            updateUI();
                        });
                    }
                }

                function saveReplySettings(editorDiv) {
                    try {
                        const minCooldown = parseInt(editorDiv.querySelector('#minCooldownInp').value) * 1000;
                        const maxCooldown = parseInt(editorDiv.querySelector('#maxCooldownInp').value) * 1000;
                        const replyProbability = parseInt(editorDiv.querySelector('#replyProbInp').value) / 100;
                        const maxRepliesPerMinute = parseInt(editorDiv.querySelector('#maxRepliesInp').value);
                        const replyDelay = parseInt(editorDiv.querySelector('#replyDelayInp').value);

                        if (minCooldown >= 10000 && maxCooldown >= 20000 && minCooldown <= maxCooldown) {
                            config.minReplyCooldown = minCooldown;
                            config.maxReplyCooldown = maxCooldown;
                        }

                        if (replyProbability >= 0.1 && replyProbability <= 1) {
                            config.replyProbability = replyProbability;
                        }

                        if (maxRepliesPerMinute >= 1 && maxRepliesPerMinute <= 10) {
                            config.maxRepliesPerMinute = maxRepliesPerMinute;
                        }

                        if (replyDelay >= 1000 && replyDelay <= 10000) {
                            config.replyDelay = replyDelay;
                        }

                        const rulesText = editorDiv.querySelector('#replyRulesText').value;
                        const lines = rulesText.split('\n').filter(line => line.trim());

                        const newRules = [];

                        for (const line of lines) {
                            const parts = line.split('=>');
                            if (parts.length === 2) {
                                const keywords = parts[0].split(',').map(k => k.trim()).filter(k => k);
                                const replies = parts[1].split('||').map(r => r.trim()).filter(r => r);

                                if (keywords.length > 0 && replies.length > 0) {
                                    newRules.push({
                                        keywords: keywords,
                                        replies: replies
                                    });
                                    console.log(`✅ 添加规则: ${keywords.join(',')} => ${replies.length}条回复话术`);
                                }
                            }
                        }

                        config.replyRules = newRules;
                        saveConfig();
                        updateUI();

                        editorDiv.remove();
                        notify('保存成功', `已保存 ${newRules.length} 个回复规则，共 ${newRules.reduce((sum, rule) => sum + rule.replies.length, 0)} 条回复话术`);
                    } catch (e) {
                        console.error('保存回复设置失败:', e);
                        notify('保存失败', '请检查规则格式是否正确');
                    }
                }

                function testAutoReply() {
                    console.log('=== 开始测试自动回复 ===');

                    if (!canReply()) {
                        const remaining = Math.ceil((status.lastReplyTime + config.replyCooldown - Date.now()) / 1000);
                        notify('测试失败', `回复冷却中，${remaining}秒后可测试`);
                        return;
                    }

                    let testReply = "测试自动回复功能，请忽略此消息";

                    if (config.replyRules && config.replyRules.length > 0) {
                        const randomRule = config.replyRules[Math.floor(Math.random() * config.replyRules.length)];
                        if (randomRule.replies && randomRule.replies.length > 0) {
                            testReply = getRandomReply(randomRule.replies);
                            console.log(`🎲 测试随机选择: 从${randomRule.replies.length}条话术中选择了1条`);
                        }
                    }

                    if (config.useRandomEmoji) {
                        testReply = addRandomEmoji(testReply);
                    }

                    autoReply(testReply).then(success => {
                        if (success) {
                            status.lastReplyTime = Date.now();
                            notify('测试已发送', '请查看评论区确认是否成功');
                        } else {
                            notify('测试失败', '无法发送回复，请查看控制台日志');
                        }
                    });
                }

                // 注册后台任务
                function registerBackgroundTasks() {
                    // 轮播任务
                    BackgroundManager.registerBackgroundTask({
                        name: '轮播检查',
                        condition: () => status.isRunning && status.nextClickTime && Date.now() >= status.nextClickTime,
                        execute: () => {
                            console.log('⏰ 后台执行轮播任务');
                            executeTimedExplain();
                            scheduleNextClick();
                        }
                    });

                    // 评论检查任务（简化版）
                    BackgroundManager.registerBackgroundTask({
                        name: '评论检查',
                        condition: () => config.autoReplyEnabled && Math.random() < 0.2,
                        execute: () => {
                            setTimeout(() => {
                                if (checkComment) {
                                    checkComment();
                                }
                            }, 1000);
                        }
                    });

                    // 弹窗检测任务
                    BackgroundManager.registerBackgroundTask({
                        name: '弹窗检测',
                        condition: () => config.autoClosePopup && Math.random() < 0.3,
                        execute: () => {
                            if (PopupManager.checkForPopup) {
                                PopupManager.checkForPopup();
                            }
                        }
                    });

                    // 状态保存任务
                    BackgroundManager.registerBackgroundTask({
                        name: '状态保存',
                        condition: () => Date.now() % 30000 < 3000,
                        execute: () => {
                            saveConfig();
                            BackgroundManager.saveBackgroundState();
                        }
                    });
                }

                function initScript() {
                    console.log('🎯 初始化主脚本...');
                    try {
                        loadConfig();
                        createPanel();
                        registerBackgroundTasks();

                        setTimeout(function() {
                            if (config.products.length === 0) {
                                syncProductConfig();
                            }
                            updateUI();
                        }, 2000);

                        // 将主要对象暴露到全局，供后台管理器和弹窗管理器使用
                        window.liveHelper = {
                            config,
                            status,
                            executeTimedExplain,
                            scheduleNextClick,
                            checkComment,
                            updateUI,
                            startMonitors,
                            saveConfig,
                            updateUIFrequency,
                            notify,
                            toggleRun,
                            PopupManager,
                            BackgroundManager,
                            ConfigManager
                        };

                    } catch (e) {
                        console.error('❌ 初始化失败:', e);
                        setTimeout(createPanel, 2000);
                    }
                }

                // 启动主脚本
                initScript();

            })();
        } catch (error) {
            console.error('❌ 脚本初始化失败:', error);
        }
    }

    // 修改页面加载逻辑
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📄 DOM内容加载完成，启动脚本');
            setTimeout(initializeScript, 1500);
        });
    } else {
        console.log('⚡ 页面已加载，直接启动脚本');
        setTimeout(initializeScript, 1000);
    }

})();