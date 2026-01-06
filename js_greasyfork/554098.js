// ==UserScript==
// @name         到店取组合脚本（互联）
// @namespace    http://tampermonkey.net/
// @version      5.4.3
// @description  泡泡玛特库存监测和下单助手的组合脚本，支持模式切换 [v5.4.3新增: 支付流程自动处理错误弹窗并重试,最多3次] [v5.4.2修复: 详情模式支付流程添加确认弹窗处理，与下单模式保持一致] [v5.4.1关键修复: 店铺列表在所有模式下都能恢复，解决切换模式后店铺列表丢失问题] [v5.4.0状态持久化: 刷新页面保持详情模式/刷新间隔等所有设置；详情模式启动优化-自动跳过当前店铺避免重复检测] [v5.2.0重大重构: 统一店铺切换逻辑-购物车和详情页模式共用同一套店铺遍历、选择、切换逻辑，只在检测和下单环节有区别]
// @author       You
// @match        https://www.popmart.com/hk/largeShoppingCart
// @match        https://www.popmart.com/hk/order-confirmation?isStore=true
// @match        https://www.popmart.com/hk/largeShoppingCart?origin=pickup
// @match        https://www.popmart.com/hk/store-pickup/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/554098/%E5%88%B0%E5%BA%97%E5%8F%96%E7%BB%84%E5%90%88%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BA%92%E8%81%94%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554098/%E5%88%B0%E5%BA%97%E5%8F%96%E7%BB%84%E5%90%88%E8%84%9A%E6%9C%AC%EF%BC%88%E4%BA%92%E8%81%94%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 全局模式控制 ====================
    let currentMode = 'order'; // 默认下单模式 'monitor' | 'order'

    // ==================== 监测模式配置 ====================
    const MONITOR_CONFIG = {
        ELEMENT_WAIT_TIMEOUT: 10000,
        PAGE_SWITCH_DELAY: 1000,
        CART_PAGE_LOAD_TIMEOUT: 5000,
        PAYMENT_PAGE_LOAD_TIMEOUT: 10000,
        QUANTITY_ADJUSTMENT_DELAY: 300,
        QUANTITY_CHECK_TIMEOUT: 3000
    };

    // ==================== 下单模式配置 ====================
    const ORDER_CONFIG = {
        ELEMENT_WAIT_TIMEOUT: 10000,
        PAYMENT_PAGE_LOAD_TIMEOUT: 10000,
        DEFAULT_DURATION_SECONDS: 5,
        DEFAULT_SUBMIT_SPEED: 5000,
        // v4.0: 新的自动模式配置
        AUTO_CLICK_INTERVAL: 1000,  // 固定1秒间隔
        AUTO_CLICK_COUNT: 2,        // 固定2次点击
        AUTO_ERROR_DETECT_TIMEOUT: 2000  // 错误检测超时
    };

    // ==================== 并发控制配置 ====================
    const CONCURRENCY_CONFIG = {
        MAX_SLOTS: 2,               // 每浏览器最大并发数
        SLOT_TIMEOUT: 30000,        // 槽位超时时间（30秒）
        ACQUIRE_MAX_RETRIES: 3,     // 获取槽位最大重试次数
        ACQUIRE_RETRY_DELAY: 50     // 重试随机延迟基数（10-60ms）
    };

    // ==================== 监测模式全局变量 ====================
    let monitor_selectedStores = [];
    let monitor_currentStoreIndex = 0;
    let monitor_isRunning = false;
    let monitor_isExecuting = false;
    let monitor_currentStoreStatus = null;

    let monitor_isScheduledEnabled = false;
    let monitor_scheduledTime = { hour: 0, minute: 0, second: 0, millisecond: 0 };
    let monitor_scheduleInterval = null;

    let monitor_isMessageModeEnabled = true;
    let monitor_refreshInterval = 1000;

    let monitor_ALL_STORES = [];
    let monitor_windowStatuses = {}; // 存储所有下单窗口状态
    let monitor_windowFilter_enabled = false; // 是否启用窗口筛选
    let monitor_selectedStoreNames = []; // 当前选中的店铺名称列表
    let monitor_currentSyncRequestId = null; // 当前同步请求ID

    // v5.0: 详情页模式
    let monitor_isDetailModeEnabled = false; // 是否启用详情页模式
    let monitor_detailQuantityMode = 'max'; // 'max' or 'half'
    let monitor_maxQuantity = 12; // 从页面获取的最大数量

    // API拦截相关
    let latestCartApiResponse = null; // 购物车API响应
    let latestProductApiResponse = null; // 商品详情API响应  
    let latestCartAddApiResponse = null; // 加购API响应
    let cartApiResponseResolvers = []; // API响应的Promise解析器
    let productApiResponseResolvers = []; // 商品API响应的Promise解析器
    let cartAddApiResponseResolvers = []; // 加购API响应的Promise解析器

    // ==================== 下单模式全局变量 ====================
    let order_currentStoreName = '';
    let order_isRunning = false;
    let order_isExecuting = false;
    let order_isStoreValid = true;

    let order_isScheduledEnabled = false;
    let order_scheduledTime = { hour: 0, minute: 0, second: 0, millisecond: 0 };
    let order_scheduleInterval = null;

    let order_durationSeconds = ORDER_CONFIG.DEFAULT_DURATION_SECONDS;
    let order_startTime = null;
    let order_submitSpeed = ORDER_CONFIG.DEFAULT_SUBMIT_SPEED;

    let order_latestLog = ''; // 存储最新日志
    let order_windowId = ''; // 当前窗口的唯一ID
    let order_crossBrowserHeartbeatTimer = null; // 跨端心跳定时器
    let order_crossBrowserHeartbeatEnabled = false; // 跨端心跳是否已启用

    // ==================== 共享变量 ====================
    let broadcastChannel = null;
    let panel = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isCollapsed = false;
    let isManualCollapsed = true; // 默认折叠手动模式

    // ==================== WebSocket通信 ====================
    let ws_enabled = true; // WebSocket是否启用 (通过按钮控制) [v5.3.7: 默认开启]
    let ws_serverUrl = ''; // 服务器地址（自动检测：优先localhost，失败则使用局域网IP）
    let ws_connection = null; // WebSocket连接对象
    let ws_isConnected = false; // 连接状态
    let ws_reconnectTimer = null; // 重连定时器
    let ws_reconnectAttempts = 0; // 重连尝试次数
    const ws_maxReconnectAttempts = 5; // 最大重连次数
    const ws_reconnectDelay = 3000; // 重连延迟(ms)
    let ws_sessionId = ''; // 浏览器会话ID (localStorage中的UUID)
    let ws_instancePrefix = GM_getValue('ws_instancePrefix', ''); // 实例前缀 (如C1, C2) - 从本地存储读取

    // ==================== 店铺名称标准化 ====================
    function normalizeStoreName(name) {
        return name
            .replace(/^POP\s*MART\s*/i, '')
            .trim();
    }

    // ==================== 并发控制系统 ====================

    /**
     * 尝试获取执行槽位（乐观锁 + 重试机制）
     * @param {string} windowId - 窗口ID
     * @returns {Object} { success: boolean, reason: string }
     */
    async function tryAcquireSlot(windowId) {
        const maxRetries = CONCURRENCY_CONFIG.ACQUIRE_MAX_RETRIES;

        for (let i = 0; i < maxRetries; i++) {
            try {
                // 1. 读取当前槽位状态
                const slotsData = JSON.parse(localStorage.getItem('popmart_running_slots') ||
                    `{"slots":[],"maxSlots":${CONCURRENCY_CONFIG.MAX_SLOTS}}`);

                // 2. 检查是否有空位
                if (slotsData.slots.length >= slotsData.maxSlots) {
                    return { success: false, reason: 'full' };
                }

                // 3. 检查是否已存在（重复申请）
                if (slotsData.slots.some(s => s.windowId === windowId)) {
                    return { success: true, reason: 'already_acquired' };
                }

                // 4. 添加新槽位
                slotsData.slots.push({
                    windowId: windowId,
                    startTime: Date.now(),
                    storeName: order_currentStoreName
                });

                // 5. 写入 localStorage
                localStorage.setItem('popmart_running_slots', JSON.stringify(slotsData));

                // 6. 立即回读验证（检测冲突）
                const verified = JSON.parse(localStorage.getItem('popmart_running_slots'));

                // 7. 验证是否写入成功
                if (verified.slots.some(s => s.windowId === windowId)) {
                    console.log(`✓ 槽位获取成功 (${verified.slots.length}/${slotsData.maxSlots})`);

                    // 广播槽位状态变化
                    broadcastSlotStatusChange('acquired', verified.slots);

                    return { success: true, reason: 'acquired' };
                }

                // 8. 冲突检测到，随机延迟后重试
                const delay = Math.random() * CONCURRENCY_CONFIG.ACQUIRE_RETRY_DELAY + 10;
                await new Promise(resolve => setTimeout(resolve, delay));
                console.log(`⚠️ 检测到槽位冲突，重试第${i + 1}次...`);

            } catch (e) {
                console.error('获取槽位异常:', e);
            }
        }

        // 重试失败
        return { success: false, reason: 'conflict' };
    }

    /**
     * 释放执行槽位
     * @param {string} windowId - 窗口ID
     */
    function releaseSlot(windowId) {
        try {
            const slotsData = JSON.parse(localStorage.getItem('popmart_running_slots') ||
                `{"slots":[],"maxSlots":${CONCURRENCY_CONFIG.MAX_SLOTS}}`);

            // 过滤掉当前窗口
            const beforeCount = slotsData.slots.length;
            slotsData.slots = slotsData.slots.filter(s => s.windowId !== windowId);
            const afterCount = slotsData.slots.length;

            if (beforeCount !== afterCount) {
                localStorage.setItem('popmart_running_slots', JSON.stringify(slotsData));
                console.log(`✓ 槽位已释放 (${afterCount}/${slotsData.maxSlots})`);

                // 广播槽位状态变化
                broadcastSlotStatusChange('released', slotsData.slots);
            }
        } catch (e) {
            console.error('释放槽位异常:', e);
        }
    }

    /**
     * 获取当前槽位状态
     * @returns {Object} { slots: Array, maxSlots: number }
     */
    function getRunningSlots() {
        try {
            return JSON.parse(localStorage.getItem('popmart_running_slots') ||
                `{"slots":[],"maxSlots":${CONCURRENCY_CONFIG.MAX_SLOTS}}`);
        } catch (e) {
            return { slots: [], maxSlots: CONCURRENCY_CONFIG.MAX_SLOTS };
        }
    }

    /**
     * 清理超时的槽位
     */
    function cleanupTimeoutSlots() {
        try {
            const slotsData = getRunningSlots();
            const now = Date.now();
            const timeout = CONCURRENCY_CONFIG.SLOT_TIMEOUT;

            const validSlots = slotsData.slots.filter(slot => {
                return (now - slot.startTime) < timeout;
            });

            if (validSlots.length !== slotsData.slots.length) {
                console.warn(`检测到 ${slotsData.slots.length - validSlots.length} 个超时槽位，已自动清理`);
                slotsData.slots = validSlots;
                localStorage.setItem('popmart_running_slots', JSON.stringify(slotsData));

                // 广播槽位状态变化
                broadcastSlotStatusChange('cleanup', validSlots);
            }
        } catch (e) {
            console.error('清理超时槽位异常:', e);
        }
    }

    /**
     * 广播槽位状态变化
     */
    function broadcastSlotStatusChange(action, slots) {
        if (!broadcastChannel) return;

        try {
            broadcastChannel.postMessage({
                type: 'slot_status_change',
                action: action,
                windowId: order_windowId,
                currentSlots: slots,
                timestamp: Date.now()
            });
        } catch (e) {
            console.error('广播槽位状态失败:', e);
        }
    }

    // ==================== 下单窗口注册机制 ====================
    function generateWindowId() {
        return 'window_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function registerOrderWindow() {
        // 如果 windowId 已存在，直接使用，否则生成新的
        if (!order_windowId) {
            order_windowId = generateWindowId();
        }

        // 重试机制：最多尝试5次
        let retryCount = 0;
        const maxRetries = 5;

        const tryRegister = () => {
            try {
                const registrations = getOrderWindowRegistrations();

                // 检查是否已注册
                if (registrations.find(r => r.id === order_windowId)) {
                    console.log('下单窗口已存在，跳过注册:', order_windowId);
                    return true;
                }

                // 添加新注册
                registrations.push({
                    id: order_windowId,
                    timestamp: Date.now(),
                    mode: 'order'
                });

                localStorage.setItem('popmart_order_window_registrations', JSON.stringify(registrations));

                // 验证写入是否成功
                const verification = getOrderWindowRegistrations();
                if (verification.find(r => r.id === order_windowId)) {
                    console.log('✓ 下单窗口注册成功:', order_windowId);
                    updateOrderWindowCountDisplay();
                    return true;
                } else {
                    console.warn('✗ 注册验证失败，准备重试...');
                    return false;
                }
            } catch (e) {
                console.error('注册失败:', e);
                return false;
            }
        };

        // 执行注册（带重试）
        const register = () => {
            if (tryRegister()) {
                // 注册成功
                return;
            }

            retryCount++;
            if (retryCount < maxRetries) {
                // 随机延迟后重试（避免多个窗口同时重试）
                const delay = Math.random() * 200 + 100; // 100-300ms
                console.log(`重试注册 (${retryCount}/${maxRetries})，延迟 ${delay.toFixed(0)}ms`);
                setTimeout(register, delay);
            } else {
                console.error('❌ 注册失败，已达到最大重试次数');
            }
        };

        // 随机延迟后开始注册（避免并发冲突）
        const initialDelay = Math.random() * 100; // 0-100ms
        setTimeout(register, initialDelay);

        // 页面关闭时移除
        window.addEventListener('beforeunload', () => {
            unregisterOrderWindow();
            // v4.0: 释放槽位
            if (order_windowId) {
                releaseSlot(order_windowId);
            }
        });
    }

    function unregisterOrderWindow() {
        const registrations = getOrderWindowRegistrations();
        const index = registrations.findIndex(r => r.id === order_windowId);
        if (index > -1) {
            registrations.splice(index, 1);
            localStorage.setItem('popmart_order_window_registrations', JSON.stringify(registrations));
            console.log('下单窗口已注销:', order_windowId);

            // 更新显示
            updateOrderWindowCountDisplay();
        }
    }

    function getOrderWindowRegistrations() {
        try {
            const registrations = JSON.parse(localStorage.getItem('popmart_order_window_registrations') || '[]');
            // 清理超过5分钟的旧注册（防止窗口崩溃导致的遗留）
            const now = Date.now();
            const filtered = registrations.filter(r => (now - r.timestamp) < 300000);
            if (filtered.length !== registrations.length) {
                localStorage.setItem('popmart_order_window_registrations', JSON.stringify(filtered));
            }
            return filtered;
        } catch (e) {
            return [];
        }
    }

    function getOrderWindowCount() {
        return getOrderWindowRegistrations().filter(r => r.mode === 'order').length;
    }

    function updateOrderWindowCountDisplay() {
        const countElement = document.getElementById('order-window-count');
        if (countElement) {
            const count = getOrderWindowCount();
            countElement.textContent = count;
        }
    }

    // ==================== 购物车页面操作 ====================
    function isPickupTabActive() {
        const activeTab = document.querySelector('.ant-tabs-tab-active .ant-tabs-tab-btn');
        return activeTab && activeTab.textContent.includes('到店取');
    }

    async function switchToPickupTab() {
        if (!isPickupTabActive()) {
            const pickupTab = document.querySelector('[data-node-key="3"] .ant-tabs-tab-btn');
            if (pickupTab) {
                pickupTab.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('已切换到到店取标签页');
            }
        }
    }

    // ==================== 共享工具函数 ====================
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Element not found: ' + selector));
            }, timeout);
        });
    }

    function waitForElementDisappear(selector, timeout = 10000) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (!element) {
                resolve();
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (!element) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve();
            }, timeout);
        });
    }

    function clickElement(element) {
        if (element) {
            element.click();
            return true;
        }
        return false;
    }

    function getServerTimeFromPage() {
        const now = new Date();
        return new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
    }

    function addLog(message, isError = false) {
        const logContent = document.getElementById('log-content');
        if (logContent && currentMode === 'order') {
            const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            if (isError) {
                logEntry.style.color = '#ff4d4f';
                logEntry.style.fontWeight = 'bold';
            }
            logEntry.textContent = `[${timestamp}] ${message}`;
            logContent.appendChild(logEntry);

            // 保存最新日志（去掉时间戳）
            order_latestLog = message;

            logContent.scrollTop = logContent.scrollHeight;

            while (logContent.children.length > 50) {
                logContent.removeChild(logContent.firstChild);
            }
        }
    }

    // ==================== BroadcastChannel通信 ====================
    function initBroadcastChannel() {
        try {
            broadcastChannel = new BroadcastChannel('popmart_stock_channel');
            console.log('BroadcastChannel已初始化');

            broadcastChannel.onmessage = (event) => {
                const data = event.data;

                // 根据消息类型分发，不打印全局日志
                if (data.type === 'stock_found' && currentMode === 'order') {
                    handleStockMessage(data);
                } else if (data.type === 'order_success' && currentMode === 'monitor') {
                    handleOrderSuccessMessage(data);
                } else if (data.type === 'sync_schedule' && currentMode === 'order') {
                    handleScheduleSync(data);
                } else if (data.type === 'register_request') {
                    // 记录收到注册请求（所有窗口都会收到）
                    if (currentMode === 'monitor') {
                        console.log('📢 监控窗口收到注册请求（忽略）');
                    } else if (currentMode === 'order' && order_windowId) {
                        handleRegisterRequest(data);
                    } else if (currentMode === 'order' && !order_windowId) {
                        console.log('⚠️ 下单窗口收到注册请求，但窗口ID为空（忽略）');
                    }
                } else if (data.type === 'register_response' && currentMode === 'monitor') {
                    handleRegisterResponse(data);
                } else if (data.type === 'heartbeat' && currentMode === 'monitor') {
                    handleHeartbeat(data);
                } else if (data.type === 'window_full_info' && currentMode === 'monitor') {
                    handleFullInfo(data);
                } else if (data.type === 'window_status_change' && currentMode === 'monitor') {
                    handleStatusChange(data);
                } else if (data.type === 'focus_window_request' && currentMode === 'order') {
                    handleFocusRequest(data);
                } else if (data.type === 'window_failure_increment' && currentMode === 'monitor') {
                    handleWindowFailureIncrement(data);
                } else if (data.type === 'force_full_info_update' && currentMode === 'order') {
                    handleForceFullInfoUpdate(data);
                } else if (data.type === 'slot_status_change' && currentMode === 'monitor') {
                    // v4.0: 槽位状态变化（监控窗口更新槽位显示）
                    updateSlotDisplayInMonitor();
                } else if (data.type === 'click_progress' && currentMode === 'monitor') {
                    // v4.0: 点击进度更新（监控窗口更新进度显示）
                    handleClickProgress(data);
                }
            };

            if (currentMode === 'order') {
                addLog('已启动监听');
            }
        } catch (e) {
            console.error('BroadcastChannel初始化失败:', e);
        }
    }

    function handleOrderSuccessMessage(data) {
        const messageStoreName = data.storeName;
        const successTime = data.successTime || '-';
        console.log(`收到下单成功消息: ${messageStoreName}`);

        monitor_isRunning = false;
        monitor_isExecuting = false;
        saveUserRunningState(false, 'monitor');
        updateRunButtonState();

        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = `已停止 - ${messageStoreName}下单成功`;
            statusText.style.color = '#52c41a';
        }

        console.log(`脚本已停止 - ${messageStoreName}下单成功`);

        // v4.0: 如果是监控模式且消息来自同浏览器，弹窗提示
        if (currentMode === 'monitor' && data._source === 'broadcast') {
            // 先闪烁标题
            flashTitle('🎉 下单成功！', 3);

            // 显示确认对话框
            const confirmMessage = `🎉 下单成功！\n\n店铺: ${messageStoreName}\n时间: ${successTime}\n\n是否跳转到该窗口？`;

            if (confirm(confirmMessage)) {
                // 用户点击确认，聚焦窗口
                if (data.windowId) {
                    focusOrderWindow(data.windowId);
                }
            }
        }
    }

    /**
     * 标题闪烁提醒
     * @param {string} message - 提示消息
     * @param {number} times - 闪烁次数
     */
    function flashTitle(message, times) {
        const originalTitle = document.title;
        let count = 0;

        const interval = setInterval(() => {
            document.title = count % 2 === 0 ? message : originalTitle;
            count++;

            if (count >= times * 2) {
                clearInterval(interval);
                // 延迟50ms后确保恢复原标题
                setTimeout(() => {
                    document.title = originalTitle;
                }, 50);
            }
        }, 500);
    }

    function sendStockMessage(storeName, isTest = false, windowId = null) {
        const message = {
            type: 'stock_found',
            storeName: storeName,
            isTest: isTest,
            windowId: windowId,
            instancePrefix: ws_instancePrefix,
            timestamp: Date.now()
        };

        let sentCount = 0;

        // 通过BroadcastChannel发送（同浏览器内）
        if (broadcastChannel) {
            try {
                broadcastChannel.postMessage(message);
                sentCount++;
                console.log('✓ 已通过BroadcastChannel发送');
            } catch (e) {
                console.error('BroadcastChannel发送失败:', e);
            }
        }

        // 通过WebSocket发送（跨设备，仅监控模式）
        if (currentMode === 'monitor' && ws_enabled && ws_isConnected) {
            try {
                sendWebSocketMessage('stock_found', {
                    storeName: storeName,
                    isTest: isTest,
                    windowId: windowId,
                    instancePrefix: ws_instancePrefix
                });
                sentCount++;
                console.log('✓ 已通过WebSocket发送');
            } catch (e) {
                console.error('WebSocket发送失败:', e);
            }
        }

        console.log(`📢 库存消息已发送 (${storeName}) - ${sentCount}个通道`);
    }

    // 下单窗口：处理注册请求
    function handleRegisterRequest(data) {
        console.log('========== 下单窗口收到注册请求 ==========');
        console.log('当前窗口ID:', order_windowId);
        console.log('当前模式:', currentMode);
        console.log('当前店铺:', order_currentStoreName);

        // 三重保护检查
        if (currentMode !== 'order') {
            console.log('❌ 拒绝响应：当前不是下单模式 (mode:', currentMode, ')');
            return;
        }

        if (!order_windowId) {
            console.log('❌ 拒绝响应：窗口ID不存在');
            return;
        }

        if (!broadcastChannel) {
            console.log('❌ 拒绝响应：BroadcastChannel未初始化');
            return;
        }

        try {
            // 先发送注册响应
            const response = {
                type: 'register_response',
                windowId: order_windowId,
                timestamp: Date.now()
            };
            broadcastChannel.postMessage(response);
            console.log('✓ 已发送注册响应');

            // 再发送完整信息
            sendFullInfo();
        } catch (e) {
            console.error('✗ 发送响应失败:', e);
        }
    }

    // 监测窗口：收集注册响应（用于首次测试）
    let registerResponses = [];
    function handleRegisterResponse(data) {
        console.log('收到注册响应:', data);
        registerResponses.push(data);
    }

    async function sendTestSignal() {
        if (!broadcastChannel) {
            console.warn('BroadcastChannel未初始化');
            return;
        }

        if (monitor_selectedStores.length === 0) {
            alert('请至少选择一个店铺');
            return;
        }

        const testButton = document.getElementById('test-signal');
        if (!testButton) return;

        const originalText = testButton.textContent;
        testButton.disabled = true;

        // ========== 每次都重新注册和分配 ==========
        testButton.textContent = '注册中...';

        // 清空响应数组
        registerResponses = [];

        // 发送注册请求
        broadcastChannel.postMessage({
            type: 'register_request',
            timestamp: Date.now()
        });
        console.log('已发送注册请求');

        // 等待3秒收集响应
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log(`收到 ${registerResponses.length} 个响应:`, registerResponses);

        // 调试信息
        const registeredCount = getOrderWindowCount();
        console.log(`[调试] localStorage中注册: ${registeredCount} 个`);
        console.log(`[调试] 实际响应: ${registerResponses.length} 个`);

        // 详细列出所有响应窗口
        console.log('========== 响应窗口详细列表 ==========');
        registerResponses.forEach((r, i) => {
            console.log(`${i + 1}. ${r.windowId} (响应时间: ${new Date(r.timestamp).toLocaleTimeString()})`);
        });
        console.log('====================================');

        if (registeredCount !== registerResponses.length) {
            console.warn(`[警告] 数量不匹配！localStorage注册了${registeredCount}个，但实际响应了${registerResponses.length}个`);
        }

        if (registerResponses.length === 0) {
            alert('未检测到下单窗口，请确保至少打开一个下单窗口');
            testButton.textContent = originalText;
            testButton.disabled = false;
            return;
        }

        // 按timestamp排序（先响应的在前）
        registerResponses.sort((a, b) => a.timestamp - b.timestamp);

        // 获取旧的分配关系
        const oldMapping = GM_getValue('popmart_window_store_mapping', {});

        // 当前在线的windowId集合
        const onlineWindowIds = new Set(registerResponses.map(r => r.windowId));

        // 当前选中的店铺名称集合
        const selectedStoreNames = new Set(monitor_selectedStores.map(idx => monitor_ALL_STORES[idx]));

        // 检查哪些配对仍然有效
        const validPairs = {};
        const assignedWindows = new Set();
        const assignedStores = new Set();

        for (const [windowId, storeName] of Object.entries(oldMapping)) {
            // 如果窗口在线 且 店铺在选中列表中
            if (onlineWindowIds.has(windowId) && selectedStoreNames.has(storeName)) {
                validPairs[windowId] = storeName;
                assignedWindows.add(windowId);
                assignedStores.add(storeName);
                console.log(`保持有效配对: ${windowId} → ${storeName}`);
            }
        }

        // 计算需要重新分配的窗口和店铺
        const unassignedWindows = registerResponses.filter(r => !assignedWindows.has(r.windowId));
        const unassignedStores = monitor_selectedStores
            .map(idx => monitor_ALL_STORES[idx])
            .filter(name => !assignedStores.has(name));

        console.log(`需要重新分配: ${unassignedWindows.length} 个窗口, ${unassignedStores.length} 个店铺`);

        // 检查数量是否匹配
        const totalWindows = registerResponses.length;
        const totalStores = monitor_selectedStores.length;

        if (totalStores > totalWindows) {
            // 选中数量大于窗口数量，自动调整
            const removed = totalStores - totalWindows;

            // 需要移除的店铺是未分配店铺的后几个
            const storesToRemove = unassignedStores.slice(totalWindows - Object.keys(validPairs).length);

            // 更新选中状态（移除多余的）
            const newSelectedStores = [];
            for (let i = 0; i < monitor_selectedStores.length; i++) {
                const idx = monitor_selectedStores[i];
                const storeName = monitor_ALL_STORES[idx];
                if (!storesToRemove.includes(storeName)) {
                    newSelectedStores.push(idx);
                }
            }

            monitor_selectedStores = newSelectedStores;
            saveUserSelectedStores(newSelectedStores);
            updateStoreList();
            bindStoreCheckboxEvents();

            alert(`已自动调整选中店铺：\n保留 ${totalWindows} 个店铺\n取消了 ${removed} 个店铺`);

            // 重新计算未分配店铺
            const assignedStoresSet = new Set(Object.values(validPairs));
            unassignedStores.length = 0;
            for (const idx of monitor_selectedStores) {
                const storeName = monitor_ALL_STORES[idx];
                if (!assignedStoresSet.has(storeName)) {
                    unassignedStores.push(storeName);
                }
            }
        }

        // 重新分配未分配的窗口和店铺
        const newMapping = { ...validPairs };
        for (let i = 0; i < unassignedWindows.length && i < unassignedStores.length; i++) {
            const windowId = unassignedWindows[i].windowId;
            const storeName = unassignedStores[i];
            newMapping[windowId] = storeName;
            console.log(`新分配: ${windowId} → ${storeName}`);
        }

        // 保存新的分配关系
        GM_setValue('popmart_window_store_mapping', newMapping);
        console.log('最终分配关系:', newMapping);

        // 发送测试信号给所有窗口（包括保持的和重新分配的）
        let sendIndex = 0;
        const totalToSend = Object.keys(newMapping).length;

        for (const [windowId, storeName] of Object.entries(newMapping)) {
            sendIndex++;

            // 判断是保持还是新分配
            const isReassigned = !validPairs[windowId] || validPairs[windowId] !== storeName;
            const prefix = isReassigned ? '分配' : '测试中';

            testButton.textContent = `${prefix} ${sendIndex}/${totalToSend}`;

            sendStockMessage(storeName, true, windowId);
            console.log(`已发送: ${windowId} → ${storeName} (${isReassigned ? '新分配' : '保持'})`);

            // 最后一个不需要等待
            if (sendIndex < totalToSend) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }

        // 显示完成状态
        testButton.textContent = '✓ 已发送';

        // 1秒后恢复
        setTimeout(() => {
            testButton.textContent = originalText;
            testButton.disabled = false;
        }, 1000);
    }

    async function handleStockMessage(data) {
        const messageStoreName = data.storeName;
        const isTest = data.isTest || false;
        const messageWindowId = data.windowId;

        // 如果是测试信号，特殊处理
        if (isTest) {
            // 验证windowId是否匹配（只处理发给自己的消息）
            if (messageWindowId && messageWindowId !== order_windowId) {
                console.log(`收到其他窗口的测试信号，忽略 (目标: ${messageWindowId}, 我的: ${order_windowId})`);
                return;
            }

            console.log(`收到测试信号: ${messageStoreName}, windowId: ${messageWindowId}`);
            addLog(`🧪 收到测试信号: ${messageStoreName}`);

            // 检测是否在订单页面
            const isOnOrderPage = checkIfOnOrderPage();

            if (isOnOrderPage) {
                // 已在订单页面，检查店铺匹配
                addLog(`✓ 已在订单页面`);

                // 验证店铺匹配
                if (order_currentStoreName === messageStoreName) {
                    addLog(`✓ 店铺匹配! (测试模式，不执行下单)`);
                } else if (order_currentStoreName) {
                    addLog(`⚠️ 店铺不匹配，不在所选店铺中`);
                    addLog(`当前: ${order_currentStoreName}, 分配: ${messageStoreName}`);
                }
            } else {
                // 在购物车页面，执行跳转流程
                addLog(`检测到在购物车页面，开始跳转到订单页面`);
                navigateToOrderPage(messageStoreName);
            }
            return;
        }

        // 正常库存消息处理
        console.log(`收到库存消息: ${messageStoreName}, 当前店铺: ${order_currentStoreName}`);

        if (!order_isStoreValid) {
            console.log('店铺无效(重复或不匹配),忽略消息');
            addLog(`✗ 店铺无效,已忽略消息`, true);
            return;
        }

        if (order_isExecuting) {
            console.log('正在执行下单流程,忽略新消息');
            addLog(`⚠️ 正在下单中,已忽略新消息`);
            return;
        }

        if (messageStoreName === order_currentStoreName) {
            console.log('店铺匹配! 准备自动点击去支付');
            addLog(`✓ 店铺匹配! 准备申请执行槽位`);

            // v4.0: 尝试获取执行槽位
            addLog('正在申请执行槽位...');
            const slotResult = await tryAcquireSlot(order_windowId);

            if (slotResult.success) {
                const slotsData = getRunningSlots();
                addLog(`✓ 获得执行槽位 (${slotsData.slots.length}/${slotsData.maxSlots})`);

                // 执行新的2次点击流程
                executeAutoPayment_V2();
            } else {
                if (slotResult.reason === 'full') {
                    const slotsData = getRunningSlots();
                    const runningStores = slotsData.slots.map(s => s.storeName).join(', ');
                    addLog(`⚠️ 执行槽位已满 (${slotsData.slots.length}/${slotsData.maxSlots})，跳过本次`, true);
                    addLog(`当前运行窗口: ${runningStores}`);

                    // 更新状态为 skipped
                    sendStatusChange({ status: 'skipped' });

                    // 3秒后恢复为 waiting
                    setTimeout(() => {
                        sendStatusChange({ status: 'waiting' });
                    }, 3000);
                } else {
                    addLog(`✗ 获取槽位失败: ${slotResult.reason}`, true);
                }
            }
        } else {
            console.log('店铺不匹配，忽略消息');
            addLog(`✗ 店铺不匹配`);
        }
    }

    // ==================== WebSocket功能函数 ====================

    // 生成或获取会话ID
    function getOrCreateSessionId() {
        let sessionId = localStorage.getItem('popmart_ws_sessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('popmart_ws_sessionId', sessionId);
            console.log('生成新会话ID:', sessionId);
        }
        return sessionId;
    }

    // 智能WebSocket连接：先尝试localhost，失败后切换到局域网IP
    async function tryConnectWebSocket(url, timeout = 500) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url);
            const timer = setTimeout(() => {
                ws.close();
                reject(new Error('连接超时'));
            }, timeout);

            ws.onopen = () => {
                clearTimeout(timer);
                resolve(ws);
            };

            ws.onerror = () => {
                clearTimeout(timer);
                ws.close();
                reject(new Error('连接失败'));
            };
        });
    }

    // 初始化WebSocket连接
    async function initWebSocket() {
        // 读取配置 [v5.3.7: 默认开启]
        ws_enabled = GM_getValue('popmart_ws_enabled', true);

        if (!ws_enabled) {
            console.log('WebSocket未启用');
            return;
        }

        console.log('正在初始化WebSocket连接...');
        console.log('页面协议:', window.location.protocol);

        // 智能连接策略：
        // 1. 先尝试 localhost（本机不受Mixed Content限制）
        // 2. 失败后尝试局域网IP（其他电脑需手动允许不安全内容）
        const localhostUrl = 'ws://localhost:8080';
        const lanUrl = 'ws://192.168.3.49:8080';

        try {
            console.log('🔍 步骤1：尝试连接本机 localhost:8080...');
            ws_connection = await tryConnectWebSocket(localhostUrl, 500);
            ws_serverUrl = localhostUrl;
            console.log('✅ 成功连接到本机服务器（localhost）');
        } catch (e) {
            console.log('⚠️ localhost连接失败，尝试局域网IP...');
            try {
                console.log('🔍 步骤2：尝试连接局域网 192.168.3.49:8080...');
                ws_connection = await tryConnectWebSocket(lanUrl, 2000);
                ws_serverUrl = lanUrl;
                console.log('✅ 成功连接到局域网服务器（192.168.3.49）');
            } catch (e2) {
                console.error('❌ 所有连接尝试均失败');
                console.log('提示：如果是其他电脑，请在浏览器中允许不安全内容');
                ws_isConnected = false;
                updateWebSocketStatus();
                return;
            }
        }

        // 连接成功，设置状态并绑定事件
        ws_isConnected = true;
        ws_reconnectAttempts = 0;
        updateWebSocketStatus();

        // 绑定消息处理
        ws_connection.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('收到WebSocket消息:', message);
                handleWebSocketMessage(message);
            } catch (error) {
                console.error('解析WebSocket消息失败:', error);
            }
        };

        // 绑定错误处理
        ws_connection.onerror = (error) => {
            console.error('WebSocket错误:', error);
            ws_isConnected = false;
            updateWebSocketStatus();
        };

        // 绑定关闭处理（自动重连）
        ws_connection.onclose = () => {
            console.log('WebSocket连接已关闭');
            ws_isConnected = false;
            updateWebSocketStatus();

            // 自动重连
            if (ws_enabled && ws_reconnectAttempts < ws_maxReconnectAttempts) {
                ws_reconnectAttempts++;
                console.log(`尝试重连 (${ws_reconnectAttempts}/${ws_maxReconnectAttempts})...`);
                ws_reconnectTimer = setTimeout(() => {
                    initWebSocket();
                }, ws_reconnectDelay);
            }
        };

        // 发送注册消息
        ws_sessionId = getOrCreateSessionId();
        sendWebSocketMessage('register', {
            deviceType: 'pc',
            sessionId: ws_sessionId
        });

        console.log('✅ WebSocket初始化完成，当前地址:', ws_serverUrl);
    }

    // 关闭WebSocket连接
    function closeWebSocket() {
        if (ws_reconnectTimer) {
            clearTimeout(ws_reconnectTimer);
            ws_reconnectTimer = null;
        }

        if (ws_connection) {
            ws_connection.close();
            ws_connection = null;
        }

        ws_isConnected = false;
        ws_instancePrefix = '';
        updateWebSocketStatus();
        console.log('WebSocket已关闭');
    }

    // 发送WebSocket消息
    function sendWebSocketMessage(type, data) {
        if (!ws_enabled) {
            return;
        }

        if (!ws_isConnected || !ws_connection || ws_connection.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket未连接，无法发送消息');
            return;
        }

        try {
            const message = {
                type: type,
                ...data,
                timestamp: Date.now()
            };
            ws_connection.send(JSON.stringify(message));
            console.log('已发送WebSocket消息:', message);
        } catch (error) {
            console.error('发送WebSocket消息失败:', error);
        }
    }

    // 处理WebSocket消息
    function handleWebSocketMessage(message) {
        switch (message.type) {
            case 'instance_assigned':
                // 收到实例前缀分配
                ws_instancePrefix = message.instancePrefix;
                GM_setValue('ws_instancePrefix', ws_instancePrefix); // 保存到本地存储
                console.log('✅ 实例前缀已分配并保存:', ws_instancePrefix);
                updateWebSocketStatus();
                break;

            case 'stock_found':
                // 收到有货消息（下单模式处理）
                if (currentMode === 'order') {
                    handleStockMessage(message);
                }
                break;

            case 'sync_schedule':
                // 收到定时同步消息（下单模式处理）
                if (currentMode === 'order') {
                    handleScheduleSync(message);
                }
                break;

            case 'order_success':
                // 收到下单成功消息（监控模式处理）
                if (currentMode === 'monitor') {
                    handleOrderSuccessMessage(message);
                }
                break;

            case 'heartbeat':
                // 收到心跳消息（监控模式处理）
                if (currentMode === 'monitor') {
                    handleHeartbeat(message);
                }
                break;

            case 'window_full_info':
                // 收到完整窗口信息（监控模式处理）
                if (currentMode === 'monitor') {
                    handleFullInfo(message);
                }
                break;

            case 'window_status_change':
                // 收到窗口状态变化（监控模式处理）
                if (currentMode === 'monitor') {
                    handleStatusChange(message);
                }
                break;

            case 'focus_window_request':
                // 收到聚焦请求（下单模式处理）
                if (currentMode === 'order' && message.targetWindowId === order_windowId) {
                    window.focus();
                    console.log('收到聚焦请求，已聚焦窗口');
                }
                break;

            case 'force_full_info_update':
                // 收到强制更新请求（下单模式处理，监控模式忽略）
                if (currentMode === 'order') {
                    handleForceFullInfoUpdate(message);
                }
                break;

            case 'enable_cross_browser_heartbeat':
                // 收到启用跨端心跳请求（下单模式处理）
                if (currentMode === 'order') {
                    startCrossBrowserHeartbeat();
                }
                break;

            case 'cross_browser_heartbeat':
                // 收到跨端心跳（监控模式处理）
                if (currentMode === 'monitor') {
                    handleCrossBrowserHeartbeat(message);
                }
                break;

            default:
                console.log('未处理的消息类型:', message.type);
                break;
        }
    }

    // 更新WebSocket状态显示
    function updateWebSocketStatus() {
        const statusElement = document.getElementById('ws-status');
        const connectionElement = document.getElementById('ws-connection-status');
        const instanceElement = document.getElementById('ws-instance-prefix');

        if (statusElement) {
            if (ws_isConnected) {
                statusElement.textContent = '✅ 已连接';
                statusElement.style.color = '#52c41a';
            } else {
                statusElement.textContent = '❌ 未连接';
                statusElement.style.color = '#ff4d4f';
            }
        }

        if (connectionElement) {
            connectionElement.textContent = ws_isConnected ? '已连接' : '断开';
            connectionElement.style.color = ws_isConnected ? '#52c41a' : '#999';
        }

        if (instanceElement) {
            instanceElement.textContent = ws_instancePrefix || '-';
        }

        // 更新按钮状态
        updateWebSocketButtonUI();
    }

    // 切换WebSocket开关
    function toggleWebSocket() {
        ws_enabled = !ws_enabled;
        GM_setValue('popmart_ws_enabled', ws_enabled);

        if (ws_enabled) {
            console.log('✅ WebSocket已启用');
            initWebSocket();
        } else {
            console.log('❌ WebSocket已禁用');
            closeWebSocket();
        }

        updateWebSocketButtonUI();
    }

    // 更新WebSocket按钮UI
    function updateWebSocketButtonUI() {
        const toggleBtn = document.getElementById('toggle-websocket-btn');
        const btnText = document.querySelector('.ws-btn-text');

        if (!toggleBtn || !btnText) return;

        if (ws_enabled) {
            if (ws_isConnected) {
                toggleBtn.className = 'websocket-toggle-btn ws-connected';
                btnText.textContent = '已互联';
            } else {
                toggleBtn.className = 'websocket-toggle-btn ws-connecting';
                btnText.textContent = '连接中...';
            }
        } else {
            toggleBtn.className = 'websocket-toggle-btn ws-disabled';
            btnText.textContent = '开启互联';
        }
    }

    // ==================== 模式切换功能 ====================
    function switchMode(newMode) {
        if (currentMode === newMode) return;

        // 检查是否正在运行
        if (currentMode === 'monitor' && monitor_isRunning) {
            alert('请先停止监测模式的运行');
            return;
        }

        if (currentMode === 'order' && order_isRunning) {
            alert('请先停止下单流程');
            return;
        }

        // 弹窗确认
        const modeName = newMode === 'monitor' ? '监测模式' : '下单模式';
        if (!confirm(`确认切换到${modeName}？`)) {
            return;
        }

        // 停止当前模式的定时器
        if (currentMode === 'monitor') {
            stopMonitorScheduleChecker();
        } else {
            stopOrderScheduleChecker();
        }

        // 从下单模式切换出去时注销窗口
        if (currentMode === 'order' && order_windowId) {
            unregisterOrderWindow();
            order_windowId = ''; // 清空窗口ID，防止继续响应注册请求
            console.log('切换模式：已注销下单窗口并清空窗口ID');
        }

        currentMode = newMode;
        saveCurrentMode();

        // 切换到下单模式时注册窗口
        if (currentMode === 'order') {
            registerOrderWindow();
            console.log('切换模式：已注册下单窗口');
        }

        // 切换UI
        switchUI();

        // 更新按钮状态
        updateModeButtons();
        updateCollapsedInfo();

        // 启动新模式的定时器（如果开启了）
        if (currentMode === 'monitor' && monitor_isScheduledEnabled) {
            startMonitorScheduleChecker();
        } else if (currentMode === 'order' && order_isScheduledEnabled) {
            startOrderScheduleChecker();
        }

        console.log(`已切换到${modeName}`);
    }

    function switchUI() {
        const monitorContent = document.querySelector('.monitor-content');
        const orderContent = document.querySelector('.order-content');
        const runButton = document.getElementById('toggle-run');
        const testButton = document.getElementById('test-signal');
        const collapseSyncButton = document.getElementById('collapse-sync-store');

        if (currentMode === 'monitor') {
            if (monitorContent) monitorContent.style.display = 'block';
            if (orderContent) orderContent.style.display = 'none';
            if (runButton) runButton.style.display = 'inline-block';

            // 测试按钮：根据消息模式决定是否显示
            updateTestButtonVisibility();

            // 折叠同步按钮：监测模式隐藏
            if (collapseSyncButton) collapseSyncButton.style.display = 'none';

            // 更新监测模式的UI
            updateIntervalUI();
            if (monitor_ALL_STORES.length > 0) {
                updateStoreList();
                bindStoreCheckboxEvents();
            }
        } else {
            if (monitorContent) monitorContent.style.display = 'none';
            if (orderContent) orderContent.style.display = 'block';
            if (runButton) runButton.style.display = 'none';
            if (testButton) testButton.style.display = 'none';

            // 折叠同步按钮：根据折叠状态决定是否显示
            updateCollapseSyncButtonVisibility();

            // 更新下单模式的UI
            updateStoreNameDisplay();
            updateDurationUI();
            updateSpeedUI();
            updateOrderScheduleUI();
        }
    }

    function updateTestButtonVisibility() {
        const testButton = document.getElementById('test-signal');
        if (!testButton) return;

        // 只在监测模式且消息模式开启时显示
        if (currentMode === 'monitor' && monitor_isMessageModeEnabled) {
            testButton.style.display = 'inline-block';
        } else {
            testButton.style.display = 'none';
        }
    }

    function updateCollapseSyncButtonVisibility() {
        const collapseSyncButton = document.getElementById('collapse-sync-store');
        if (!collapseSyncButton) return;

        // 只在下单模式且折叠时显示
        if (currentMode === 'order' && isCollapsed) {
            collapseSyncButton.style.display = 'inline-block';
        } else {
            collapseSyncButton.style.display = 'none';
        }
    }

    function updateModeButtons() {
        const monitorBtn = document.getElementById('mode-monitor');
        const orderBtn = document.getElementById('mode-order');

        if (currentMode === 'monitor') {
            if (monitorBtn) {
                monitorBtn.classList.add('active');
                monitorBtn.style.color = '#ff4d4f';
                monitorBtn.style.fontWeight = 'bold';
            }
            if (orderBtn) {
                orderBtn.classList.remove('active');
                orderBtn.style.color = '#666';
                orderBtn.style.fontWeight = 'normal';
            }
        } else {
            if (monitorBtn) {
                monitorBtn.classList.remove('active');
                monitorBtn.style.color = '#666';
                monitorBtn.style.fontWeight = 'normal';
            }
            if (orderBtn) {
                orderBtn.classList.add('active');
                orderBtn.style.color = '#52c41a';
                orderBtn.style.fontWeight = 'bold';
            }
        }
    }

    function saveCurrentMode() {
        // 使用 sessionStorage 保存模式（单个标签页独立）
        sessionStorage.setItem('popmart_currentMode', currentMode);
    }

    function getCurrentMode() {
        // 从 sessionStorage 读取（单个标签页独立），默认下单模式
        return sessionStorage.getItem('popmart_currentMode') || 'order';
    }

    // ==================== GM_Value 存储 ====================
    function getUserRunningState(mode) {
        const key = mode === 'monitor' ? 'popmart_monitor_isRunning' : 'popmart_payment_isRunning';
        return GM_getValue(key, false);
    }

    function saveUserRunningState(state, mode) {
        const key = mode === 'monitor' ? 'popmart_monitor_isRunning' : 'popmart_payment_isRunning';
        GM_setValue(key, state);
        if (mode === 'monitor') {
            monitor_isRunning = state;
        } else {
            order_isRunning = state;
        }
    }

    function getUserScheduleSettings(mode) {
        const key = mode === 'monitor' ? 'popmart_monitor_scheduleSettings' : 'popmart_payment_scheduleSettings';
        return GM_getValue(key, {
            enabled: false,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        });
    }

    function saveUserScheduleSettings(settings, mode) {
        const key = mode === 'monitor' ? 'popmart_monitor_scheduleSettings' : 'popmart_payment_scheduleSettings';
        GM_setValue(key, settings);

        if (mode === 'monitor') {
            monitor_isScheduledEnabled = settings.enabled;
            monitor_scheduledTime = {
                hour: settings.hour,
                minute: settings.minute,
                second: settings.second,
                millisecond: settings.millisecond
            };
        } else {
            order_isScheduledEnabled = settings.enabled;
            order_scheduledTime = {
                hour: settings.hour,
                minute: settings.minute,
                second: settings.second,
                millisecond: settings.millisecond
            };
        }
    }

    // ==================== UI界面创建 ====================
    function createPanel() {
        panel = document.createElement('div');
        panel.id = 'combined-panel';
        panel.innerHTML = `
            <div class="panel-header" id="drag-handle">
                <div class="mode-switcher">
                    <button id="mode-monitor" class="mode-btn">监测</button>
                    <button id="mode-order" class="mode-btn">下单</button>
                </div>
                <div class="header-controls">
                    <button id="test-signal" class="test-btn" style="display: none;">测试</button>
                    <button id="toggle-run" class="run-button" style="display: none;">运行</button>
                    <button id="collapse-sync-store" class="collapse-sync-btn" style="display: none;">同步</button>
                    <button id="toggle-panel" class="collapse-btn">-</button>
                </div>
            </div>
            <div class="collapsed-info-container" style="display: none;">
                <div class="monitor-collapsed-info">
                    状态: <span id="monitor-status-collapsed">已停止</span> | 
                    当前: <span id="monitor-store-collapsed">-</span>
                    <br>
                    下单窗口: <span id="window-collapsed-info">无在线窗口</span>
                </div>
                <div class="order-collapsed-info">
                    店铺: <span id="order-store-collapsed">-</span> | 
                    <span id="order-info-collapsed">-</span>
                </div>
            </div>
            <div class="panel-content">
                ${createMonitorUI()}
                ${createOrderUI()}
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const dragHandle = document.getElementById('drag-handle');
        dragHandle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        document.getElementById('toggle-panel').addEventListener('click', toggleCollapse);
        document.getElementById('mode-monitor').addEventListener('click', () => switchMode('monitor'));
        document.getElementById('mode-order').addEventListener('click', () => switchMode('order'));
        document.getElementById('toggle-run').addEventListener('click', toggleMonitorRunning);
        document.getElementById('test-signal').addEventListener('click', sendTestSignal);
        document.getElementById('collapse-sync-store').addEventListener('click', syncStoreNameCollapsed);

        // 绑定下单模式的手动模式折叠
        const manualHeader = document.getElementById('manual-header');
        if (manualHeader) {
            manualHeader.addEventListener('click', toggleManualSection);
        }

        // 初始化模式
        switchUI();
        updateModeButtons();

        // 绑定监测模式事件
        bindMonitorEvents();
        // 绑定下单模式事件
        bindOrderEvents();
    }

    function bindMonitorEvents() {
        // 全选勾选框
        const selectAllToggle = document.getElementById('select-all-toggle');
        if (selectAllToggle) {
            selectAllToggle.addEventListener('change', toggleSelectAll);
        }

        // 同步店铺列表按钮
        const syncStoreListBtn = document.getElementById('sync-store-list-btn');
        if (syncStoreListBtn) {
            syncStoreListBtn.addEventListener('click', syncStoreList);
        }

        // WebSocket 开启/关闭按钮
        const toggleWebSocketBtn = document.getElementById('toggle-websocket-btn');
        if (toggleWebSocketBtn) {
            toggleWebSocketBtn.addEventListener('click', toggleWebSocket);
        }

        // 同步下单窗口按钮
        const syncOrderWindowsBtn = document.getElementById('sync-order-windows-btn');
        if (syncOrderWindowsBtn) {
            syncOrderWindowsBtn.addEventListener('click', syncOrderWindows);
        }

        // 定时运行事件
        const monitorScheduleToggle = document.getElementById('monitor-schedule-toggle');
        if (monitorScheduleToggle) {
            monitorScheduleToggle.addEventListener('change', toggleMonitorSchedule);
        }
        const monitorScheduleSave = document.getElementById('monitor-schedule-save');
        if (monitorScheduleSave) {
            monitorScheduleSave.addEventListener('click', saveMonitorSchedule);
        }

        // 消息模式切换
        const messageModeToggle = document.getElementById('message-mode-toggle');
        if (messageModeToggle) {
            messageModeToggle.addEventListener('change', toggleMessageMode);
        }

        // v5.0: 详情模式切换
        const detailModeToggle = document.getElementById('detail-mode-toggle');
        if (detailModeToggle) {
            detailModeToggle.addEventListener('change', toggleDetailMode);
        }

        // v5.0: 数量模式切换
        document.querySelectorAll('input[name="quantity-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                monitor_detailQuantityMode = e.target.value;
                // v5.4.0: 保存详情模式设置
                GM_setValue('popmart_detailModeSettings', {
                    enabled: monitor_isDetailModeEnabled,
                    quantityMode: monitor_detailQuantityMode,
                    maxQuantity: monitor_maxQuantity
                });
                console.log('数量模式切换为:', monitor_detailQuantityMode);
            });
        });

        // 刷新间隔按钮
        document.querySelectorAll('.interval-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const interval = parseInt(e.target.getAttribute('data-interval'));
                monitor_refreshInterval = interval;
                GM_setValue('popmart_refreshInterval', interval); // v5.4.0: 保存刷新间隔
                updateIntervalUI();
                console.log(`刷新间隔已设置为: ${interval}ms`);
                document.querySelectorAll('.interval-preset').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 绑定店铺列表的复选框事件
        bindStoreCheckboxEvents();
    }

    function bindStoreCheckboxEvents() {
        const storeList = document.getElementById('store-list');
        if (storeList) {
            storeList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', handleStoreSelectionChange);
            });
        }
    }

    function handleStoreSelectionChange() {
        const selected = [];
        document.querySelectorAll('#store-list input[type="checkbox"]:checked').forEach(cb => {
            selected.push(parseInt(cb.getAttribute('data-index')));
        });
        saveUserSelectedStores(selected);
        updateSelectStatusText();
    }

    function saveUserSelectedStores(stores) {
        GM_setValue('popmart_selectedStores', stores);
        monitor_selectedStores = [...stores];
        const storeNames = stores.map(index => monitor_ALL_STORES[index]);
        GM_setValue('popmart_selectedStoreNames', storeNames);
    }

    function toggleSelectAll() {
        const selectAllToggle = document.getElementById('select-all-toggle');
        const isChecked = selectAllToggle ? selectAllToggle.checked : false;

        const checkboxes = document.querySelectorAll('#store-list input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = isChecked;
        });

        const newSelection = isChecked ? monitor_ALL_STORES.map((_, i) => i) : [];
        saveUserSelectedStores(newSelection);
        updateSelectStatusText();
    }

    function updateSelectStatusText() {
        const selectedCount = getUserSelectedStores().length;
        const totalCount = monitor_ALL_STORES.length;
        const statusText = document.getElementById('select-status-text');
        const selectAllToggle = document.getElementById('select-all-toggle');

        if (statusText) {
            statusText.textContent = `${selectedCount}/${totalCount}`;
        }

        if (selectAllToggle) {
            selectAllToggle.checked = selectedCount === totalCount && totalCount > 0;
        }
    }

    function syncOrderWindows() {
        const btn = document.getElementById('sync-order-windows-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '同步中...';
            btn.disabled = true;

            try {
                // 获取当前选中的店铺名称列表
                monitor_selectedStoreNames = GM_getValue('popmart_selectedStoreNames', []);

                // 启用筛选功能
                monitor_windowFilter_enabled = true;

                console.log('启用窗口筛选，匹配店铺:', monitor_selectedStoreNames);

                // 生成同步请求ID
                const syncRequestId = 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                monitor_currentSyncRequestId = syncRequestId;

                // 通过 BroadcastChannel 向本浏览器的下单窗口发送请求
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'force_full_info_update',
                        syncRequestId: syncRequestId,
                        timestamp: Date.now()
                    });
                    console.log('已通过 BroadcastChannel 发送同步请求（本浏览器）');
                }

                // 通过 WebSocket 向其他浏览器的下单窗口发送请求
                if (ws_enabled && ws_isConnected) {
                    sendWebSocketMessage('force_full_info_update', {
                        syncRequestId: syncRequestId,
                        timestamp: Date.now()
                    });
                    console.log('已通过 WebSocket 发送同步请求（其他浏览器）');

                    // 启用跨端心跳（20秒一次）
                    sendWebSocketMessage('enable_cross_browser_heartbeat', {
                        timestamp: Date.now()
                    });
                    console.log('已启用跨端心跳（20秒一次）');
                }

                // 立即更新UI
                setTimeout(() => {
                    updateWindowMonitorUI();
                    btn.textContent = '✓ 已筛选';
                    btn.style.backgroundColor = '#52c41a';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 1000);
                }, 500);
            } catch (e) {
                console.error('同步失败:', e);
                btn.textContent = originalText;
                btn.disabled = false;
            }
        }
    }

    async function syncStoreList() {
        // v5.1.2: 第一阶段 - 优先提取商品数量（不依赖弹窗）
        let quantityExtracted = false;
        let extractedQuantity = null;

        try {
            const quantityElement = document.querySelector('.index_info__XCDmR');
            console.log('🔍 第一阶段：检测商品数量元素:', {
                hasElement: !!quantityElement,
                text: quantityElement?.textContent,
                pathname: window.location.pathname
            });

            if (quantityElement) {
                const match = quantityElement.textContent.match(/最大\s*(\d+)\s*件/);
                if (match) {
                    extractedQuantity = parseInt(match[1]);
                    monitor_maxQuantity = extractedQuantity;
                    updateQuantityDisplay();
                    quantityExtracted = true;

                    console.log(`✅ 已提取最大数量: ${extractedQuantity}件`);
                    console.log('✓ 数量配置已更新:', {
                        maxQuantity: monitor_maxQuantity,
                        halfQuantity: Math.floor(monitor_maxQuantity / 2)
                    });
                } else {
                    console.log('⚠️ 元素存在但无法提取数量:', quantityElement.textContent);
                }
            } else {
                console.log('ℹ️ 未检测到商品数量元素（可能不在详情页）');
            }
        } catch (error) {
            console.error('❌ 提取商品数量失败:', error);
        }

        // v5.1.3: 第二阶段 - 同步店铺列表
        try {
            console.log('🔍 第二阶段：开始同步店铺列表...');

            const storeInfo = document.querySelector('.index_storeInfo__G9rTP');
            if (!storeInfo) {
                throw new Error('未找到店铺信息元素');
            }

            // 直接点击打开弹窗
            console.log('📍 点击打开店铺弹窗...');
            storeInfo.click();

            // 等待弹窗出现
            await waitForElement('.ant-modal-content', 5000);
            console.log('✓ 弹窗已打开');

            // ✅ 修复：直接查询店铺容器（兼容详情页多个弹窗的情况）
            await waitForElement('.index_storeListContainer__0Vg6c', 5000);
            const container = document.querySelector('.index_storeListContainer__0Vg6c');

            if (!container) {
                throw new Error('未找到店铺列表容器');
            }

            const storeElements = container.querySelectorAll('.index_name__BHfG4');
            if (storeElements.length === 0) {
                throw new Error('店铺容器已加载但未找到店铺元素');
            }
            console.log(`✅ 找到 ${storeElements.length} 个店铺元素`);

            const storeList = [];
            storeElements.forEach(el => {
                const originalName = el.textContent.trim();
                const normalizedName = normalizeStoreName(originalName);
                storeList.push(normalizedName);
            });

            GM_setValue('popmart_storeList', storeList);
            monitor_ALL_STORES = storeList;

            // v5.4.0: 验证保存是否成功
            const verifyStoreList = GM_getValue('popmart_storeList', []);
            if (verifyStoreList.length === storeList.length) {
                console.log('✅ 店铺列表保存验证成功:', verifyStoreList);
            } else {
                console.error('❌ 店铺列表保存验证失败! 期望:', storeList.length, '实际:', verifyStoreList.length);
            }

            // ✅ 关闭弹窗：详情页和购物车页使用不同的策略
            if (quantityExtracted) {
                // 详情页：从容器向上找到正确的modal，再找关闭按钮
                console.log('详情页模式：使用精确关闭策略');
                const modal = container.closest('.ant-modal-content');
                const closeBtn = modal?.querySelector('.ant-modal-close');
                if (closeBtn) {
                    closeBtn.click();
                    console.log('✓ 已关闭弹窗（详情页）');
                }
            } else {
                // 购物车页：使用原有逻辑
                const closeBtn = document.querySelector('.ant-modal-close');
                if (closeBtn) {
                    closeBtn.click();
                    console.log('✓ 已关闭弹窗（购物车）');
                }
            }

            updateStoreList();
            bindStoreCheckboxEvents();

            // 根据两个阶段的结果显示状态
            if (quantityExtracted) {
                updateStatusText(`✅ 同步成功! 共${storeList.length}家店铺 | 最大数量: ${extractedQuantity}件`);
            } else {
                updateStatusText(`✅ 同步成功! 共${storeList.length}家店铺`);
            }

            console.log('✅ 店铺列表同步完成');

        } catch (error) {
            console.error('❌ 同步店铺列表失败:', error);

            // 即使店铺同步失败，如果数量提取成功了，也要显示
            if (quantityExtracted) {
                updateStatusText(`⚠️ 店铺同步失败，但已提取数量: ${extractedQuantity}件`);
            } else {
                updateStatusText(`❌ 同步失败: ${error.message}`);
            }
        }
    }

    function updateStatusText(text) {
        const statusText = document.getElementById('status-text');
        if (statusText) {
            statusText.textContent = text;
            if (text.includes('✓')) {
                statusText.style.color = '#52c41a';
            } else if (text.includes('✗')) {
                statusText.style.color = '#ff4d4f';
            } else {
                statusText.style.color = '#999';
            }
        }
        if (isCollapsed) updateCollapsedInfo();
    }

    function toggleMonitorSchedule() {
        const scheduleToggle = document.getElementById('monitor-schedule-toggle');
        monitor_isScheduledEnabled = scheduleToggle.checked;
        const settings = {
            enabled: monitor_isScheduledEnabled,
            hour: monitor_scheduledTime.hour,
            minute: monitor_scheduledTime.minute,
            second: monitor_scheduledTime.second,
            millisecond: monitor_scheduledTime.millisecond
        };
        saveUserScheduleSettings(settings, 'monitor');
        if (monitor_isScheduledEnabled) {
            startMonitorScheduleChecker();
            console.log('监测模式定时运行已开启');
        } else {
            stopMonitorScheduleChecker();
            console.log('监测模式定时运行已关闭');
        }
    }

    function saveMonitorSchedule() {
        const hourInput = document.getElementById('monitor-schedule-hour');
        const minuteInput = document.getElementById('monitor-schedule-minute');
        const secondInput = document.getElementById('monitor-schedule-second');

        const hour = parseInt(hourInput.value) || 0;
        const minute = parseInt(minuteInput.value) || 0;
        const second = parseInt(secondInput.value) || 0;

        if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
            alert('请输入有效的时间范围');
            return;
        }

        monitor_scheduledTime = { hour, minute, second, millisecond: 0 };
        const settings = {
            enabled: monitor_isScheduledEnabled,
            hour: monitor_scheduledTime.hour,
            minute: monitor_scheduledTime.minute,
            second: monitor_scheduledTime.second,
            millisecond: 0
        };
        saveUserScheduleSettings(settings, 'monitor');
        console.log('监测模式定时设置已保存');
    }

    function startMonitorScheduleChecker() {
        if (monitor_scheduleInterval) {
            clearInterval(monitor_scheduleInterval);
        }
        monitor_scheduleInterval = setInterval(() => {
            if (!monitor_isScheduledEnabled || monitor_isRunning) return;
            const beijingTime = getServerTimeFromPage();
            if (beijingTime.getHours() === monitor_scheduledTime.hour &&
                beijingTime.getMinutes() === monitor_scheduledTime.minute &&
                beijingTime.getSeconds() === monitor_scheduledTime.second) {
                monitor_isRunning = true;
                saveUserRunningState(true, 'monitor');
                updateRunButtonState();
            }
        }, 100);
    }

    function stopMonitorScheduleChecker() {
        if (monitor_scheduleInterval) {
            clearInterval(monitor_scheduleInterval);
            monitor_scheduleInterval = null;
        }
    }

    function toggleMessageMode() {
        const messageModeToggle = document.getElementById('message-mode-toggle');
        monitor_isMessageModeEnabled = messageModeToggle.checked;
        GM_setValue('popmart_messageModeSettings', { enabled: monitor_isMessageModeEnabled });
        const runModeStatus = document.getElementById('run-mode-status');
        if (runModeStatus) {
            runModeStatus.textContent = monitor_isMessageModeEnabled ? '消息通知' : '自动下单';
        }
        if (!broadcastChannel && monitor_isMessageModeEnabled) {
            initBroadcastChannel();
        }

        // 更新测试按钮可见性
        updateTestButtonVisibility();
    }

    // v5.0: 详情模式切换
    function toggleDetailMode() {
        const detailModeToggle = document.getElementById('detail-mode-toggle');
        monitor_isDetailModeEnabled = detailModeToggle.checked;

        // v5.4.0: 保存详情模式状态
        GM_setValue('popmart_detailModeSettings', {
            enabled: monitor_isDetailModeEnabled,
            quantityMode: monitor_detailQuantityMode,
            maxQuantity: monitor_maxQuantity
        });

        // 显示/隐藏详情模式配置区
        const detailModeSection = document.getElementById('detail-mode-section');
        if (detailModeSection) {
            detailModeSection.style.display = monitor_isDetailModeEnabled ? 'block' : 'none';
        }

        // 如果开启详情模式，自动提取并更新最大数量显示
        if (monitor_isDetailModeEnabled && isOnProductDetailPage()) {
            monitor_maxQuantity = extractMaxQuantity();
            updateQuantityDisplay();
        }

        console.log('详情模式已' + (monitor_isDetailModeEnabled ? '开启' : '关闭'));
    }

    // v5.0: 更新数量显示
    function updateQuantityDisplay() {
        const maxQtyDisplay = document.getElementById('max-quantity-display');
        const halfQtyDisplay = document.getElementById('half-quantity-display');

        if (maxQtyDisplay) {
            maxQtyDisplay.textContent = monitor_maxQuantity;
        }
        if (halfQtyDisplay) {
            halfQtyDisplay.textContent = Math.floor(monitor_maxQuantity / 2);
        }
    }

    function bindOrderEvents() {
        // 同步店铺按钮
        const syncStoreBtn = document.getElementById('sync-store-btn');
        if (syncStoreBtn) {
            syncStoreBtn.addEventListener('click', syncStoreName);
        }

        // 手动点击去支付按钮
        const manualPayBtn = document.getElementById('manual-pay-btn');
        if (manualPayBtn) {
            manualPayBtn.addEventListener('click', executeManualPayment);
        }

        // 定时运行事件
        const orderScheduleToggle = document.getElementById('order-schedule-toggle');
        if (orderScheduleToggle) {
            orderScheduleToggle.addEventListener('change', toggleOrderSchedule);
        }
        const orderScheduleSave = document.getElementById('order-schedule-save');
        if (orderScheduleSave) {
            orderScheduleSave.addEventListener('click', saveOrderSchedule);
        }
        const orderScheduleSync = document.getElementById('order-schedule-sync');
        if (orderScheduleSync) {
            orderScheduleSync.addEventListener('click', syncScheduleToOthers);
        }

        // 持续时间调整
        const durationDecrease = document.getElementById('duration-decrease');
        const durationIncrease = document.getElementById('duration-increase');
        if (durationDecrease) {
            durationDecrease.addEventListener('click', () => {
                order_durationSeconds = Math.max(5, order_durationSeconds - 5);
                saveDurationSettings({ durationSeconds: order_durationSeconds });
                updateDurationUI();
            });
        }
        if (durationIncrease) {
            durationIncrease.addEventListener('click', () => {
                order_durationSeconds += 5;
                saveDurationSettings({ durationSeconds: order_durationSeconds });
                updateDurationUI();
            });
        }

        // 提交速度预设
        document.querySelectorAll('.speed-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseInt(e.target.getAttribute('data-speed'));
                order_submitSpeed = speed;
                saveSubmitSpeedSettings({ submitSpeed: order_submitSpeed });
                updateSpeedUI();
                addLog(`提交速度已设置为: ${speed}ms`);
                document.querySelectorAll('.speed-preset').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // 快速开窗功能
        const openWindowsBtn = document.getElementById('open-windows-btn');
        if (openWindowsBtn) {
            openWindowsBtn.addEventListener('click', openMultipleWindows);
        }
    }

    function syncStoreName() {
        const newStoreName = extractStoreName();
        if (!newStoreName) {
            addLog('⚠️ 未检测到店铺信息', true);
            return;
        }
        if (newStoreName === order_currentStoreName) {
            addLog('店铺信息无变化');
            return;
        }

        // 先取消注册旧店铺
        if (order_currentStoreName) {
            unregisterStore();
        }

        order_currentStoreName = newStoreName;
        order_isStoreValid = true;

        // 重新验证店铺
        registerStore();
        checkStoreInSelectedList();

        updateStoreNameDisplay();
        addLog(`✓ 店铺已同步: ${order_currentStoreName}`);

        if (order_isStoreValid) {
            addLog('等待购物车信号...');
        } else {
            addLog('自动功能已禁用,仅支持手动操作', true);
        }

        if (isCollapsed) updateCollapsedInfo();
    }

    function syncStoreNameCollapsed() {
        // 折叠状态下的同步店铺 - 调用主同步函数保持功能一致
        const syncButton = document.getElementById('collapse-sync-store');

        // 先执行主同步逻辑（与展开状态完全一致）
        syncStoreName();

        // 折叠状态特有：按钮反馈动画
        if (syncButton) {
            const originalText = syncButton.textContent;

            syncButton.textContent = '✓';
            syncButton.style.backgroundColor = '#389e0d';
            syncButton.disabled = true;

            setTimeout(() => {
                syncButton.textContent = originalText;
                syncButton.style.backgroundColor = '#52c41a';
                syncButton.disabled = false;
            }, 1000);
        }
    }

    // 店铺验证相关函数
    function registerStore() {
        try {
            const openStores = JSON.parse(localStorage.getItem('popmart_openStores') || '[]');
            if (openStores.includes(order_currentStoreName)) {
                console.warn('检测到重复店铺:', order_currentStoreName);
                order_isStoreValid = false;
                addLog('⚠️ 警告: 检测到重复店铺! 已禁用自动功能', true);
                return false;
            } else {
                openStores.push(order_currentStoreName);
                localStorage.setItem('popmart_openStores', JSON.stringify(openStores));
                window.addEventListener('beforeunload', () => {
                    unregisterStore();
                });
                return true;
            }
        } catch (e) {
            console.error('注册店铺失败:', e);
            return true;
        }
    }

    function unregisterStore() {
        try {
            const openStores = JSON.parse(localStorage.getItem('popmart_openStores') || '[]');
            const index = openStores.indexOf(order_currentStoreName);
            if (index > -1) {
                openStores.splice(index, 1);
                localStorage.setItem('popmart_openStores', JSON.stringify(openStores));
            }
        } catch (e) {
            console.error('取消注册店铺失败:', e);
        }
    }

    function checkStoreInSelectedList() {
        const selectedStoreNames = GM_getValue('popmart_selectedStoreNames', []);
        if (selectedStoreNames.length === 0) {
            return true;
        }
        if (!selectedStoreNames.includes(order_currentStoreName)) {
            console.warn('当前店铺不在监控列表:', order_currentStoreName);
            addLog('⚠️ 警告: 当前店铺不在监控列表中! 已禁用自动功能', true);
            order_isStoreValid = false;
            return false;
        }
        return true;
    }

    async function waitForStoreElement(timeout = 10000) {
        return new Promise((resolve) => {
            const storeName = extractStoreName();
            if (storeName) {
                resolve(storeName);
                return;
            }
            const startTime = Date.now();
            const observer = new MutationObserver(() => {
                const storeName = extractStoreName();
                if (storeName) {
                    observer.disconnect();
                    resolve(storeName);
                } else if (Date.now() - startTime > timeout) {
                    observer.disconnect();
                    resolve(null);
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    function toggleOrderSchedule() {
        const scheduleToggle = document.getElementById('order-schedule-toggle');
        order_isScheduledEnabled = scheduleToggle.checked;
        const settings = {
            enabled: order_isScheduledEnabled,
            hour: order_scheduledTime.hour,
            minute: order_scheduledTime.minute,
            second: order_scheduledTime.second,
            millisecond: order_scheduledTime.millisecond
        };
        saveUserScheduleSettings(settings, 'order');
        if (order_isScheduledEnabled) {
            startOrderScheduleChecker();
            addLog('定时运行已开启');
        } else {
            stopOrderScheduleChecker();
            addLog('定时运行已关闭');
        }

        // 更新手动模式折叠信息
        if (isManualCollapsed) {
            updateManualCollapsedInfo();
        }

        if (isCollapsed) updateCollapsedInfo();
    }

    function saveOrderSchedule() {
        const hourInput = document.getElementById('order-schedule-hour');
        const minuteInput = document.getElementById('order-schedule-minute');
        const secondInput = document.getElementById('order-schedule-second');
        const millisecondInput = document.getElementById('order-schedule-millisecond');

        const hour = parseInt(hourInput.value) || 0;
        const minute = parseInt(minuteInput.value) || 0;
        const second = parseInt(secondInput.value) || 0;
        const millisecond = parseInt(millisecondInput.value) || 0;

        if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59 || millisecond < 0 || millisecond > 999) {
            alert('请输入有效的时间范围：\n小时(0-23) 分钟(0-59) 秒(0-59) 毫秒(0-999)');
            return;
        }

        order_scheduledTime = { hour, minute, second, millisecond };
        const settings = {
            enabled: order_isScheduledEnabled,
            hour: order_scheduledTime.hour,
            minute: order_scheduledTime.minute,
            second: order_scheduledTime.second,
            millisecond: order_scheduledTime.millisecond
        };
        saveUserScheduleSettings(settings, 'order');
        addLog('定时设置已保存');

        // 更新手动模式折叠信息
        if (isManualCollapsed) {
            updateManualCollapsedInfo();
        }

        if (isCollapsed) updateCollapsedInfo();
    }

    function updateIntervalUI() {
        const intervalDisplay = document.getElementById('interval-display');
        if (intervalDisplay) {
            intervalDisplay.textContent = `${monitor_refreshInterval}ms`;
        }
        document.querySelectorAll('.interval-preset').forEach(btn => {
            const interval = parseInt(btn.getAttribute('data-interval'));
            if (interval === monitor_refreshInterval) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function updateDurationUI() {
        const durationDisplay = document.getElementById('duration-display');
        if (durationDisplay) {
            durationDisplay.textContent = `${order_durationSeconds}秒`;
        }
    }

    function updateSpeedUI() {
        const speedDisplay = document.getElementById('speed-display');
        if (speedDisplay) {
            speedDisplay.textContent = `${order_submitSpeed}ms`;
        }
        document.querySelectorAll('.speed-preset').forEach(btn => {
            const speed = parseInt(btn.getAttribute('data-speed'));
            if (speed === order_submitSpeed) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function createMonitorUI() {
        return `
            <div class="monitor-content" style="display: none;">
                <div class="control-buttons">
                    <label class="select-all-label">
                        <input type="checkbox" id="select-all-toggle" />
                        <span id="select-status-text">0/0</span>
                    </label>
                    <button id="sync-store-list-btn" class="sync-store-btn-small">同步</button>
                </div>
                <div class="store-list-container">
                    <div class="store-list" id="store-list"></div>
                </div>
                <div class="window-monitor-section" id="window-monitor-section">
                    <div class="window-monitor-header-row">
                        <span class="window-monitor-header">下单窗口监控 (<span id="online-window-count">0</span>个在线)</span>
                        <div class="window-monitor-buttons">
                            <button id="toggle-websocket-btn" class="websocket-toggle-btn">
                                <span class="ws-btn-text">开启互联</span>
                            </button>
                            <button id="sync-order-windows-btn" class="sync-windows-btn">同步</button>
                        </div>
                    </div>
                    <div class="window-monitor-list" id="window-monitor-list">
                        <div class="no-windows">暂无在线窗口</div>
                    </div>
                    <div class="ws-info-row">
                        <span class="ws-label">WebSocket:</span>
                        <span class="ws-value" id="ws-connection-status">断开</span>
                        <span class="ws-label" style="margin-left: 15px;">实例:</span>
                        <span class="ws-value" id="ws-instance-prefix">-</span>
                        <span class="ws-label" style="margin-left: 15px;">并发槽位:</span>
                        <span class="ws-value" id="slot-count-display">0/2</span>
                    </div>
                </div>
                <div class="schedule-section">
                    <div class="schedule-header">
                        <label>
                            <input type="checkbox" id="monitor-schedule-toggle">
                            <span>定时运行</span>
                        </label>
                    </div>
                    <div class="schedule-controls">
                        <input type="number" id="monitor-schedule-hour" min="0" max="23" placeholder="时">
                        <span>:</span>
                        <input type="number" id="monitor-schedule-minute" min="0" max="59" placeholder="分">
                        <span>:</span>
                        <input type="number" id="monitor-schedule-second" min="0" max="59" placeholder="秒">
                        <button id="monitor-schedule-save">保存</button>
                    </div>
                    <div class="schedule-info">
                        <div>当前时间: <span id="monitor-current-time">--:--:--</span></div>
                        <div>定时时间: <span id="monitor-scheduled-time">--:--:--</span></div>
                    </div>
                </div>
                <div class="refresh-interval-section">
                    <div class="refresh-interval-header">刷新间隔</div>
                    <div class="refresh-interval-controls">
                        <button class="interval-preset" data-interval="1000">1秒</button>
                        <button class="interval-preset" data-interval="2000">2秒</button>
                        <button class="interval-preset" data-interval="5000">5秒</button>
                    </div>
                    <div class="refresh-interval-info">
                        <div>当前间隔: <span id="interval-display">1000ms</span></div>
                    </div>
                </div>
                <div class="message-mode-section">
                    <div class="mode-toggle-row">
                        <div class="mode-toggle-item">
                            <label>
                                <input type="checkbox" id="message-mode-toggle" checked>
                                <span>消息模式</span>
                            </label>
                        </div>
                        <div class="mode-toggle-item">
                            <label>
                                <input type="checkbox" id="detail-mode-toggle">
                                <span>详情模式</span>
                            </label>
                        </div>
                    </div>
                    <div class="message-mode-info">
                        <div>运行模式: <span id="run-mode-status">消息通知</span></div>
                        <div>说明: 开启后只发送消息不自动下单</div>
                    </div>
                </div>
                <div class="detail-mode-section" id="detail-mode-section" style="display: none;">
                    <div class="detail-mode-header">商品数量配置</div>
                    <div class="quantity-mode-controls">
                        <label class="quantity-radio">
                            <input type="radio" name="quantity-mode" value="max" checked>
                            <span>最大数量 (<span id="max-quantity-display">12</span>件)</span>
                        </label>
                        <label class="quantity-radio">
                            <input type="radio" name="quantity-mode" value="half">
                            <span>半数量 (<span id="half-quantity-display">6</span>件)</span>
                        </label>
                    </div>
                    <div class="detail-mode-info">
                        <div>说明: 自动从页面获取最大数量</div>
                    </div>
                </div>
                <div class="status-info">
                    <div>状态: <span id="status-text">已停止</span></div>
                    <div>当前: <span id="current-store">-</span></div>
                    <div>下单窗口: <span id="order-window-count">0</span> 个</div>
                </div>
            </div>
        `;
    }

    function createOrderUI() {
        return `
            <div class="order-content" style="display: none;">
                <div class="info-section">
                    <div class="info-item">
                        <span class="label">当前店铺:</span>
                        <span class="value" id="current-store-name">-</span>
                        <button id="sync-store-btn" class="sync-btn">同步</button>
                    </div>
                    <div class="info-item">
                        <span class="label">监听状态:</span>
                        <span class="value status-active">等待信号中...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">WebSocket:</span>
                        <span class="value" id="ws-status">❌ 未连接</span>
                        <span class="label" style="margin-left: 10px;">实例:</span>
                        <span class="value" id="ws-instance-prefix">-</span>
                    </div>
                </div>
                
                <div class="quick-open-section">
                    <div class="quick-open-header">快速开窗</div>
                    <div class="quick-open-content">
                        <div class="quick-open-row">
                            <span class="quick-open-label">数量:</span>
                            <input type="number" id="window-count" min="1" max="20" value="4" />
                            <span class="quick-open-unit">个</span>
                            <button id="open-windows-btn" class="open-windows-btn">打开窗口</button>
                        </div>
                        <div class="quick-open-info">
                            当前已注册: <span id="registered-windows-count">0</span> 个窗口
                            <span class="loading-hint"> (新窗口需要几秒加载)</span>
                        </div>
                    </div>
                </div>
                
                <div class="auto-mode-section">
                    <div class="auto-mode-header">自动模式配置</div>
                    <div class="auto-mode-content">
                        <div class="auto-mode-item">
                            <span class="auto-label">点击间隔:</span>
                            <span class="auto-value">1秒 (固定)</span>
                        </div>
                        <div class="auto-mode-item">
                            <span class="auto-label">点击次数:</span>
                            <span class="auto-value">2次 (固定)</span>
                        </div>
                        <div class="auto-mode-item">
                            <span class="auto-label">并发槽位:</span>
                            <span class="auto-value" id="auto-slot-display">0/2 使用中</span>
                        </div>
                    </div>
                </div>
                
                <div class="manual-section">
                    <div class="manual-header" id="manual-header">
                        <div class="manual-title-row">
                            <span>手动模式</span>
                            <button id="toggle-manual" class="manual-collapse-btn">+</button>
                        </div>
                        <div class="manual-collapsed-info" style="display: block;">
                            定时: <span style="color: #999">未开启</span>
                        </div>
                    </div>
                    
                    <div class="manual-content" style="display: none;">
                        <div class="schedule-section">
                            <div class="schedule-header">
                                <label>
                                    <input type="checkbox" id="order-schedule-toggle">
                                    <span>定时运行</span>
                                </label>
                            </div>
                            <div class="schedule-controls">
                                <input type="number" id="order-schedule-hour" min="0" max="23" placeholder="时">
                                <span>:</span>
                                <input type="number" id="order-schedule-minute" min="0" max="59" placeholder="分">
                                <span>:</span>
                                <input type="number" id="order-schedule-second" min="0" max="59" placeholder="秒">
                                <span>.</span>
                                <input type="number" id="order-schedule-millisecond" min="0" max="999" placeholder="毫秒">
                                <button id="order-schedule-save">保存</button>
                                <button id="order-schedule-sync">同步</button>
                            </div>
                            <div class="schedule-info">
                                <div>当前时间: <span id="order-current-time">--:--:--.---</span></div>
                                <div>定时时间: <span id="order-scheduled-time">--:--:--.---</span></div>
                            </div>
                        </div>
                        
                        <div class="duration-section">
                            <div class="duration-header">持续时间</div>
                            <div class="duration-controls">
                                <button id="duration-decrease" class="adjust-btn">-</button>
                                <span id="duration-display">5秒</span>
                                <button id="duration-increase" class="adjust-btn">+</button>
                            </div>
                            <div class="duration-info">
                                <div>剩余时间: <span id="remaining-time">-</span></div>
                            </div>
                        </div>
                        
                        <div class="speed-section">
                            <div class="speed-header">提交速度</div>
                            <div class="speed-controls">
                                <button class="speed-preset" data-speed="1000">1秒</button>
                                <button class="speed-preset" data-speed="2000">2秒</button>
                                <button class="speed-preset" data-speed="5000">5秒</button>
                            </div>
                            <div class="speed-info">
                                <div>当前速度: <span id="speed-display">5000ms</span></div>
                            </div>
                        </div>
                        
                        <div class="button-section">
                            <button id="manual-pay-btn" class="pay-button">手动点击去支付</button>
                        </div>
                    </div>
                </div>
                
                <div class="log-section">
                    <div class="log-header">日志:</div>
                    <div class="log-content" id="log-content"></div>
                </div>
            </div>
        `;
    }

    function updateCollapsedInfo() {
        const container = document.querySelector('.collapsed-info-container');
        const monitorInfo = document.querySelector('.monitor-collapsed-info');
        const orderInfo = document.querySelector('.order-collapsed-info');

        if (!isCollapsed && !container) return;

        if (isCollapsed) {
            if (currentMode === 'monitor') {
                if (monitorInfo) monitorInfo.style.display = 'block';
                if (orderInfo) orderInfo.style.display = 'none';
                updateMonitorCollapsedInfo();
            } else {
                if (monitorInfo) monitorInfo.style.display = 'none';
                if (orderInfo) orderInfo.style.display = 'block';
                updateOrderCollapsedInfo();
            }
        }
    }

    function updateMonitorCollapsedInfo() {
        const statusEl = document.getElementById('monitor-status-collapsed');
        const storeEl = document.getElementById('monitor-store-collapsed');

        if (statusEl) {
            statusEl.textContent = monitor_isRunning ? '运行中' : '已停止';
            statusEl.style.color = monitor_isRunning ? '#52c41a' : '#999';
        }

        if (storeEl) {
            const currentStore = document.getElementById('current-store');
            let storeText = currentStore ? currentStore.textContent : '-';
            let storeColor = '#666';

            // 根据库存状态添加标记和颜色
            if (monitor_currentStoreStatus === 'in_stock') {
                storeText += ' 有货';
                storeColor = '#52c41a'; // 绿色
            } else if (monitor_currentStoreStatus === 'out_of_stock') {
                storeText += ' 无货';
                storeColor = '#ff4d4f'; // 红色
            }

            storeEl.textContent = storeText;
            storeEl.style.color = storeColor;
        }

        // 更新窗口统计信息
        updateWindowCollapsedInfo();
    }

    function updateOrderCollapsedInfo() {
        const storeEl = document.getElementById('order-store-collapsed');
        const infoEl = document.getElementById('order-info-collapsed');

        if (storeEl) {
            storeEl.textContent = order_currentStoreName || '-';
        }

        if (infoEl) {
            if (order_isScheduledEnabled && !order_isRunning) {
                // 显示定时时间和倒计时
                const countdown = getScheduleCountdown();
                const timeStr = `${String(order_scheduledTime.hour).padStart(2, '0')}:${String(order_scheduledTime.minute).padStart(2, '0')}:${String(order_scheduledTime.second).padStart(2, '0')}.${String(order_scheduledTime.millisecond).padStart(3, '0')}`;
                infoEl.textContent = `定时: ${timeStr} (还有 ${countdown})`;
                infoEl.style.color = '#fa8c16'; // 橙色
            } else if (order_isRunning) {
                infoEl.textContent = '运行中...';
                infoEl.style.color = '#52c41a'; // 绿色
            } else {
                // 显示最新日志（截取前30字符）
                const logText = order_latestLog || '等待信号中...';
                infoEl.textContent = logText.length > 30 ? logText.substring(0, 30) + '...' : logText;
                infoEl.style.color = '#666';
            }
        }
    }

    // ==================== 拖动和折叠 ====================
    function startDrag(e) {
        isDragging = true;
        const rect = panel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        panel.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        const maxX = window.innerWidth - panel.offsetWidth;
        const maxY = window.innerHeight - panel.offsetHeight;
        panel.style.left = Math.max(0, Math.min(maxX, x)) + 'px';
        panel.style.top = Math.max(0, Math.min(maxY, y)) + 'px';
        panel.style.right = 'auto';
    }

    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            panel.style.cursor = 'default';
        }
    }

    function toggleCollapse() {
        isCollapsed = !isCollapsed;
        const content = panel.querySelector('.panel-content');
        const button = document.getElementById('toggle-panel');
        const collapsedContainer = document.querySelector('.collapsed-info-container');

        if (isCollapsed) {
            panel.classList.add('collapsed');
            content.style.display = 'none';
            button.textContent = '+';
            if (collapsedContainer) {
                collapsedContainer.style.display = 'block';
                updateCollapsedInfo();
            }
            // 折叠时更新同步按钮可见性
            updateCollapseSyncButtonVisibility();
        } else {
            panel.classList.remove('collapsed');
            content.style.display = 'block';
            button.textContent = '-';
            if (collapsedContainer) {
                collapsedContainer.style.display = 'none';
            }
            // 展开时隐藏折叠同步按钮
            updateCollapseSyncButtonVisibility();
        }
    }

    function toggleManualSection() {
        isManualCollapsed = !isManualCollapsed;
        const content = panel.querySelector('.manual-content');
        const button = document.getElementById('toggle-manual');
        const collapsedInfo = document.querySelector('.manual-collapsed-info');

        if (isManualCollapsed) {
            content.style.display = 'none';
            button.textContent = '+';
            if (collapsedInfo) {
                collapsedInfo.style.display = 'block';
                updateManualCollapsedInfo();
            }
        } else {
            content.style.display = 'block';
            button.textContent = '-';
            if (collapsedInfo) {
                collapsedInfo.style.display = 'none';
            }
        }
    }

    function getScheduleCountdown() {
        const now = getServerTimeFromPage();
        const target = new Date();
        target.setHours(
            order_scheduledTime.hour,
            order_scheduledTime.minute,
            order_scheduledTime.second,
            order_scheduledTime.millisecond
        );

        let diff = target - now;

        // 如果时间已过,可能是明天
        if (diff < 0) {
            target.setDate(target.getDate() + 1);
            diff = target - now;
        }

        const totalMs = diff;
        const seconds = Math.floor(totalMs / 1000);
        const ms = totalMs % 1000;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}小时${minutes % 60}分${seconds % 60}秒`;
        } else if (minutes > 0) {
            return `${minutes}分${seconds % 60}秒${ms}毫秒`;
        } else {
            return `${seconds}秒${ms}毫秒`;
        }
    }

    function updateManualCollapsedInfo() {
        const info = document.querySelector('.manual-collapsed-info');
        if (!info) return;

        let statusText = '';
        let statusColor = '#999';

        if (!order_isScheduledEnabled) {
            statusText = '未开启';
            statusColor = '#999';
        } else if (order_isRunning) {
            statusText = '已启动';
            statusColor = '#52c41a';
        } else {
            const countdown = getScheduleCountdown();
            const timeStr = `${String(order_scheduledTime.hour).padStart(2, '0')}:${String(order_scheduledTime.minute).padStart(2, '0')}:${String(order_scheduledTime.second).padStart(2, '0')}.${String(order_scheduledTime.millisecond).padStart(3, '0')}`;
            statusText = `${timeStr} (还有 ${countdown})`;
            statusColor = '#fa8c16';
        }

        info.innerHTML = `定时: <span style="color: ${statusColor}">${statusText}</span>`;
    }

    async function toggleMonitorRunning() {
        if (monitor_isRunning) {
            monitor_isRunning = false;
            monitor_isExecuting = false;
            saveUserRunningState(false, 'monitor');
            updateRunButtonState();
            console.log('监测已停止');
        } else {
            if (monitor_selectedStores.length === 0) {
                alert('请至少选择一个门店');
                return;
            }

            // 确保在到店取标签页
            await switchToPickupTab();

            // v5.4.0: 详情模式启动优化 - 跳过当前店铺
            if (monitor_isDetailModeEnabled) {
                const currentPageStore = extractDetailPageCurrentStore();
                if (currentPageStore) {
                    const currentStoreIndex = monitor_selectedStores[monitor_currentStoreIndex];
                    const targetStoreName = monitor_ALL_STORES[currentStoreIndex];

                    if (currentPageStore === targetStoreName) {
                        console.log(`[启动优化] 当前页面已在店铺 ${currentPageStore}，跳过到下一个店铺`);
                        monitor_currentStoreIndex = (monitor_currentStoreIndex + 1) % monitor_selectedStores.length;
                        const nextStoreIndex = monitor_selectedStores[monitor_currentStoreIndex];
                        const nextStoreName = monitor_ALL_STORES[nextStoreIndex];
                        console.log(`[启动优化] 将从店铺 ${nextStoreName} 开始检测`);
                    }
                }
            }

            monitor_isRunning = true;
            saveUserRunningState(true, 'monitor');
            updateRunButtonState();
            console.log('监测开始运行');
            runMonitorMainLoop();
        }
    }

    // ==================== 监测模式主循环 ====================
    async function runMonitorMainLoop() {
        if (!monitor_isRunning || monitor_selectedStores.length === 0) {
            monitor_isExecuting = false;
            return;
        }

        if (monitor_isExecuting) return;
        monitor_isExecuting = true;

        // v5.2.0: 统一的店铺遍历逻辑（购物车和详情页共用）
        const storeIndex = monitor_selectedStores[monitor_currentStoreIndex];
        const storeName = monitor_ALL_STORES[storeIndex] || '未知门店';

        const currentStoreEl = document.getElementById('current-store');
        if (currentStoreEl) currentStoreEl.textContent = storeName;

        monitor_currentStoreStatus = null;
        updateCollapsedInfo();

        try {
            // 1. 选择店铺（统一）
            console.log(`正在切换到店铺: ${storeName}`);
            const selectSuccess = await selectStoreByIndex(storeIndex);
            if (!selectSuccess) {
                console.error('选择店铺失败');
                monitor_currentStoreIndex = (monitor_currentStoreIndex + 1) % monitor_selectedStores.length;
                setTimeout(runMonitorMainLoop, monitor_refreshInterval);
                monitor_isExecuting = false;
                return;
            }

            // 2. 根据模式等待不同的页面加载
            if (monitor_isDetailModeEnabled) {
                // 详情页模式：不需要等待购物车页面
                console.log(`[详情页模式] 检测店铺: ${storeName}`);
            } else {
                // 购物车模式：等待购物车页面加载
                await waitForCartPageLoad();
            }

            // 3. 根据模式执行不同的检测和下单流程
            if (monitor_isDetailModeEnabled) {
                // 详情页模式：执行详情页下单流程
                const result = await executeDetailPageCheckoutFlow();

                if (result.success) {
                    // 有货且下单成功
                    console.log(`✓ 店铺 ${storeName} 下单成功！`);
                    monitor_currentStoreStatus = 'in_stock';
                    updateCollapsedInfo();

                    monitor_isRunning = false;
                    monitor_isExecuting = false;
                    saveUserRunningState(false, 'monitor');
                    updateRunButtonState();

                    alert(`详情页下单成功！\n店铺: ${storeName}\n${result.reason}`);
                    return;
                } else {
                    // 无货或失败，切换下一个店铺
                    console.log(`店铺 ${storeName} 失败: ${result.reason}`);
                    monitor_currentStoreStatus = 'out_of_stock';
                    updateCollapsedInfo();

                    monitor_currentStoreIndex = (monitor_currentStoreIndex + 1) % monitor_selectedStores.length;
                    setTimeout(runMonitorMainLoop, monitor_refreshInterval);
                    monitor_isExecuting = false;
                    return;
                }

            } else {
                // 购物车模式 - 原有逻辑
                console.log(`[购物车模式] 检测店铺: ${storeName}`);

                // 3. 检查全选按钮
                const hasSelectAll = await checkSelectAllButton();
                if (!hasSelectAll) {
                    monitor_currentStoreStatus = 'out_of_stock';
                    updateCollapsedInfo();
                    monitor_currentStoreIndex = (monitor_currentStoreIndex + 1) % monitor_selectedStores.length;
                    setTimeout(runMonitorMainLoop, monitor_refreshInterval);
                    monitor_isExecuting = false;
                    return;
                }

                // 4. 检查库存
                if (!isProductInStock()) {
                    monitor_currentStoreStatus = 'out_of_stock';
                    updateCollapsedInfo();
                    monitor_currentStoreIndex = (monitor_currentStoreIndex + 1) % monitor_selectedStores.length;
                    setTimeout(runMonitorMainLoop, monitor_refreshInterval);
                    monitor_isExecuting = false;
                    return;
                }

                // 5. 有货！
                console.log(`门店 ${storeName} 有货!`);
                monitor_currentStoreStatus = 'in_stock';
                updateCollapsedInfo();

                if (monitor_isMessageModeEnabled) {
                    // 消息模式：发送消息
                    sendStockMessage(storeName);
                    monitor_currentStoreIndex = (monitor_currentStoreIndex + 1) % monitor_selectedStores.length;
                    setTimeout(runMonitorMainLoop, monitor_refreshInterval);
                } else {
                    // 自动下单模式
                    console.log('自动下单模式：开始下单');
                    monitor_isRunning = false;
                    saveUserRunningState(false, 'monitor');
                    updateRunButtonState();
                }
            }

        } catch (error) {
            console.error(`处理门店 ${storeName} 时出错:`, error);
            monitor_currentStoreIndex = (monitor_currentStoreIndex + 1) % monitor_selectedStores.length;
            setTimeout(runMonitorMainLoop, monitor_refreshInterval);
        } finally {
            monitor_isExecuting = false;
        }
    }

    async function selectStoreByIndex(index) {
        try {
            await openStoreSelection();

            // ✅ 修复：通过容器精确定位店铺列表（兼容详情页多弹窗）
            await waitForElement('.index_storeListContainer__0Vg6c', 5000);
            const container = document.querySelector('.index_storeListContainer__0Vg6c');

            if (!container) {
                console.error('未找到店铺列表容器');
                return false;
            }

            const storeItems = container.querySelectorAll('.index_storeListItem__IF8Cz');
            if (storeItems[index]) {
                storeItems[index].click();

                // ✅ 修复：等待正确的弹窗消失
                const modal = container.closest('.ant-modal-content');
                if (modal) {
                    await waitForElementDisappear('.ant-modal-content', 10000);
                }
                return true;
            }
        } catch (error) {
            console.error('选择门店出错:', error);
        }
        return false;
    }

    async function openStoreSelection() {
        const storeInfo = document.querySelector('.index_storeInfo__G9rTP');
        if (storeInfo) {
            storeInfo.click();
            await waitForElement('.ant-modal-content', 10000);
            return true;
        }
        return false;
    }

    async function waitForCartPageLoad() {
        await Promise.all([
            waitForElementDisappear('.index_loadingWrap__3Vucc', 5000),
            waitForElement('.index_checkout__V9YPC', 5000)
        ]);
    }

    async function checkSelectAllButton() {
        try {
            const selectAllContainer = document.querySelector('.index_checkboxContainer__nQZ_a');
            if (!selectAllContainer) return false;

            const checkboxButton = selectAllContainer.querySelector('.index_checkbox__w_166');
            const selectText = selectAllContainer.querySelector('.index_selectText___HDXz');
            if (!checkboxButton && !selectText) return false;

            const isSelected = selectAllContainer.querySelector('.index_checkboxActive__LAaYV');
            if (!isSelected) {
                await new Promise(resolve => setTimeout(resolve, 100));
                if (checkboxButton) {
                    checkboxButton.click();
                } else {
                    selectAllContainer.click();
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    function isProductInStock() {
        const totalContainer = document.querySelector('.index_totalNum__0lVik');
        if (totalContainer) {
            const priceText = totalContainer.textContent.trim();
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            return price > 0;
        }
        return false;
    }

    function updateRunButtonState() {
        const button = document.getElementById('toggle-run');
        const statusText = document.getElementById('status-text');
        if (!button) return;
        if (monitor_isRunning) {
            button.textContent = '停止';
            button.className = 'stop-button';
            if (statusText) statusText.textContent = '运行中';
        } else {
            button.textContent = '运行';
            button.className = 'run-button';
            if (statusText) statusText.textContent = '已停止';
        }
        if (isCollapsed) updateCollapsedInfo();
    }

    // ==================== 下单模式业务逻辑 ====================
    function sendOrderSuccessMessage() {
        if (!broadcastChannel) return;
        try {
            // 格式化时间 "12:00:05"
            const now = new Date();
            const successTime = now.toTimeString().substring(0, 8);

            const message = {
                type: 'order_success',
                windowId: order_windowId,
                storeName: order_currentStoreName,
                successTime: successTime,
                timestamp: Date.now(),
                _source: 'broadcast'  // 标记消息来源
            };
            broadcastChannel.postMessage(message);

            // 发送状态变化（标记为成功）
            sendStatusChange({
                orderSuccess: true,
                orderSuccessTime: Date.now()
            });

            addLog(`✓ 已通知购物车: ${order_currentStoreName} 下单成功`);
        } catch (e) {
            console.error('发送消息失败:', e);
        }
    }

    function sendFailureNotification() {
        if (!broadcastChannel) return;
        try {
            broadcastChannel.postMessage({
                type: 'window_failure_increment',
                windowId: order_windowId,
                timestamp: Date.now()
            });
            console.log('已发送失败通知');
        } catch (e) {
            console.error('发送失败通知失败:', e);
        }
    }

    // 处理二次确认弹窗（部分账号需要确认取货门店）
    async function handleStoreConfirmModal() {
        try {
            // 使用较短超时检测弹窗（800ms）
            const modal = await waitForElement('.index_storeConfirmModalTitle__jtuIE', 800);

            if (!modal) return false; // 未检测到弹窗

            console.log('检测到二次确认弹窗，开始处理');
            addLog('检测到门店确认弹窗');

            // 1. 先勾选"无提示"复选框
            const checkbox = document.querySelector('.index_unNoticeCheckbox__lebkx input[type="checkbox"]');
            if (checkbox && !checkbox.checked) {
                checkbox.click();
                await new Promise(resolve => setTimeout(resolve, 100));
                addLog('已勾选"无提示"');
            }

            // 2. 点击确认按钮
            const confirmBtn = document.querySelector('.index_pickUpStoreBtn__cf1_Z');
            if (confirmBtn) {
                confirmBtn.click();
                addLog('已点击确认按钮');
                // 等待弹窗消失
                await waitForElementDisappear('.index_storeConfirmModalTitle__jtuIE', 2000);
                await new Promise(resolve => setTimeout(resolve, 200));
                return true; // 成功处理
            }

            return false;
        } catch (e) {
            // 超时或未找到弹窗，直接返回false
            return false;
        }
    }

    async function executePaymentProcess(currentSubmitSpeed, currentDurationSeconds) {
        addLog(`开始支付流程 (速度:${currentSubmitSpeed}ms, 时长:${currentDurationSeconds}秒)`);
        order_startTime = Date.now();
        const endTime = order_startTime + (currentDurationSeconds * 1000);
        let orderSucceeded = false;

        // 发送状态变化（运行开始）
        sendStatusChange();

        // 开始更新剩余时间
        const remainingTimeInterval = setInterval(updateRemainingTimeDisplay, 100);

        while (Date.now() < endTime && order_isRunning) {
            const payButton = document.querySelector('.index_placeOrderBtn__30ZOe');
            if (!payButton) {
                addLog('✓ 下单成功! 按钮已消失');
                sendOrderSuccessMessage();
                orderSucceeded = true;
                break;
            }
            payButton.click();

            // 点击后立即检测并处理二次确认弹窗
            const hasModal = await handleStoreConfirmModal();
            if (hasModal) {
                console.log('已处理二次确认弹窗，继续支付流程');
            }

            try {
                const notification = await waitForElement('.ant-notification-notice', 2000);
                const messageElement = notification.querySelector('.ant-notification-notice-message');
                const descElement = notification.querySelector('.ant-notification-notice-description');
                let errorMessage = '';
                if (messageElement) errorMessage = messageElement.textContent.trim();
                if (descElement) {
                    const desc = descElement.textContent.trim();
                    if (desc) errorMessage += (errorMessage ? ' ' : '') + desc;
                }
                if (errorMessage) {
                    addLog(errorMessage, true);
                    // 捕获到错误，失败计数+1
                    sendFailureNotification();
                }
                await new Promise(resolve => setTimeout(resolve, currentSubmitSpeed));
                const notifications = document.querySelectorAll('.ant-notification-notice');
                notifications.forEach(n => n.remove());
            } catch (e) {
                // 没有弹窗
            }

            const payButtonAfter = document.querySelector('.index_placeOrderBtn__30ZOe');
            if (!payButtonAfter) {
                addLog('✓ 下单成功! 按钮已消失');
                sendOrderSuccessMessage();
                orderSucceeded = true;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // 停止更新剩余时间
        clearInterval(remainingTimeInterval);
        updateRemainingTimeDisplay();

        addLog('支付流程结束');

        if (order_isRunning) {
            order_isRunning = false;
            saveUserRunningState(false, 'order');
            updateOrderPayButtonState();

            // 发送状态变化（运行结束）
            sendStatusChange();
        }
    }

    function updateRemainingTimeDisplay() {
        if (!order_isRunning || !order_startTime) {
            const remainingTimeElement = document.getElementById('remaining-time');
            if (remainingTimeElement) {
                remainingTimeElement.textContent = '-';
            }
            return;
        }

        const elapsed = (Date.now() - order_startTime) / 1000;
        const remaining = Math.max(0, order_durationSeconds - elapsed);

        const remainingTimeElement = document.getElementById('remaining-time');
        if (remainingTimeElement) {
            remainingTimeElement.textContent = `${remaining.toFixed(1)}秒`;
        }
    }

    /**
     * v4.0: 新的自动支付流程（固定2次点击）
     */
    async function executeAutoPayment_V2() {
        if (order_isExecuting) return;

        order_isExecuting = true;
        order_isRunning = true;
        order_startTime = Date.now();

        addLog(`开始自动提交（${ORDER_CONFIG.AUTO_CLICK_COUNT}次点击，间隔${ORDER_CONFIG.AUTO_CLICK_INTERVAL}ms）`);

        // 发送状态变化（运行开始）
        sendStatusChange({
            status: 'running',
            currentClick: 0,
            totalClicks: ORDER_CONFIG.AUTO_CLICK_COUNT
        });

        try {
            // 第1次点击
            addLog('→ 第1次点击');
            const payButton1 = document.querySelector('.index_placeOrderBtn__30ZOe');
            if (!payButton1) {
                addLog('✗ 支付按钮未找到', true);
                return;
            }
            payButton1.click();

            // 发送点击进度
            broadcastClickProgress(1, ORDER_CONFIG.AUTO_CLICK_COUNT);

            // 处理二次确认弹窗
            await handleStoreConfirmModal();

            // 检测错误通知
            const error1 = await checkErrorNotification();
            if (error1) {
                addLog(`检测到错误: ${error1}`, true);
                sendFailureNotification();
            }

            // 检查按钮是否消失（成功）
            if (!document.querySelector('.index_placeOrderBtn__30ZOe')) {
                addLog('✓ 下单成功！支付按钮已消失');
                sendOrderSuccessMessage();
                return;
            }

            // 等待固定间隔
            addLog(`等待${ORDER_CONFIG.AUTO_CLICK_INTERVAL}ms...`);
            await new Promise(resolve => setTimeout(resolve, ORDER_CONFIG.AUTO_CLICK_INTERVAL));

            // 第2次点击
            addLog('→ 第2次点击');
            const payButton2 = document.querySelector('.index_placeOrderBtn__30ZOe');
            if (!payButton2) {
                addLog('✓ 下单成功！支付按钮已消失');
                sendOrderSuccessMessage();
                return;
            }
            payButton2.click();

            // 发送点击进度
            broadcastClickProgress(2, ORDER_CONFIG.AUTO_CLICK_COUNT);

            // 处理二次确认弹窗
            await handleStoreConfirmModal();

            // 检测错误通知
            const error2 = await checkErrorNotification();
            if (error2) {
                addLog(`检测到错误: ${error2}`, true);
                sendFailureNotification();
            }

            // 最终检查
            if (!document.querySelector('.index_placeOrderBtn__30ZOe')) {
                addLog('✓ 下单成功！支付按钮已消失');
                sendOrderSuccessMessage();
            } else {
                addLog('自动提交流程结束');
            }

        } catch (error) {
            console.error('自动支付异常:', error);
            addLog(`✗ 自动支付异常: ${error.message}`, true);
        } finally {
            // 释放槽位
            releaseSlot(order_windowId);
            const slotsData = getRunningSlots();
            addLog(`已释放执行槽位 (${slotsData.slots.length}/${slotsData.maxSlots})`);

            order_isRunning = false;
            order_isExecuting = false;

            // 发送状态变化（运行结束）
            sendStatusChange({ status: 'waiting' });
        }
    }

    /**
     * 检测错误通知
     * @returns {Promise<string|null>} 错误消息或null
     */
    async function checkErrorNotification() {
        try {
            const notification = await waitForElement('.ant-notification-notice', ORDER_CONFIG.AUTO_ERROR_DETECT_TIMEOUT);
            const messageElement = notification.querySelector('.ant-notification-notice-message');
            const descElement = notification.querySelector('.ant-notification-notice-description');

            let errorMessage = '';
            if (messageElement) errorMessage = messageElement.textContent.trim();
            if (descElement) {
                const desc = descElement.textContent.trim();
                if (desc) errorMessage += (errorMessage ? ' ' : '') + desc;
            }

            // 移除通知
            const notifications = document.querySelectorAll('.ant-notification-notice');
            notifications.forEach(n => n.remove());

            return errorMessage || null;
        } catch (e) {
            // 超时，没有错误通知
            return null;
        }
    }

    /**
     * 广播点击进度
     */
    function broadcastClickProgress(currentClick, totalClicks) {
        if (!broadcastChannel) return;

        try {
            broadcastChannel.postMessage({
                type: 'click_progress',
                windowId: order_windowId,
                currentClick: currentClick,
                totalClicks: totalClicks,
                timestamp: Date.now()
            });

            // 同时更新窗口状态
            sendStatusChange({
                currentClick: currentClick,
                totalClicks: totalClicks
            });
        } catch (e) {
            console.error('广播点击进度失败:', e);
        }
    }

    /**
     * 旧的自动支付（保留，但不再使用）
     */
    async function executeAutoPayment() {
        // v4.0: 已废弃，使用 executeAutoPayment_V2
        console.warn('executeAutoPayment 已废弃，请使用 executeAutoPayment_V2');
        executeAutoPayment_V2();
    }

    async function executeManualPayment() {
        if (order_isRunning) {
            order_isRunning = false;
            order_isExecuting = false;
            saveUserRunningState(false, 'order');
            updateOrderPayButtonState();
            addLog('手动模式: 已停止');

            // 发送状态变化（手动停止）
            sendStatusChange();
            return;
        }
        if (order_isExecuting) {
            addLog('已有流程在执行中，请稍候');
            return;
        }
        order_isExecuting = true;
        order_isRunning = true;
        saveUserRunningState(true, 'order');
        updateOrderPayButtonState();
        addLog('手动模式: 开始支付流程');
        await executePaymentProcess(order_submitSpeed, order_durationSeconds);
        order_isExecuting = false;
    }

    function updateOrderPayButtonState() {
        const button = document.getElementById('manual-pay-btn');
        if (!button) return;
        if (order_isRunning) {
            button.textContent = '停止';
            button.className = 'pay-button stop-button';
        } else {
            button.textContent = '手动点击去支付';
            button.className = 'pay-button';
        }
        if (isCollapsed) updateCollapsedInfo();
    }

    function syncScheduleToOthers() {
        const message = {
            type: 'sync_schedule',
            enabled: order_isScheduledEnabled,
            hour: order_scheduledTime.hour,
            minute: order_scheduledTime.minute,
            second: order_scheduledTime.second,
            millisecond: order_scheduledTime.millisecond,
            durationSeconds: order_durationSeconds,
            submitSpeed: order_submitSpeed,
            timestamp: Date.now()
        };

        let sentCount = 0;

        // 通过BroadcastChannel同步（同浏览器内）
        if (broadcastChannel) {
            try {
                broadcastChannel.postMessage(message);
                sentCount++;
                console.log('✓ 已通过BroadcastChannel同步');
            } catch (e) {
                console.error('BroadcastChannel同步失败:', e);
            }
        }

        // 通过WebSocket同步（跨设备）
        if (ws_enabled && ws_isConnected) {
            try {
                sendWebSocketMessage('sync_schedule', {
                    enabled: order_isScheduledEnabled,
                    hour: order_scheduledTime.hour,
                    minute: order_scheduledTime.minute,
                    second: order_scheduledTime.second,
                    millisecond: order_scheduledTime.millisecond,
                    durationSeconds: order_durationSeconds,
                    submitSpeed: order_submitSpeed
                });
                sentCount++;
                console.log('✓ 已通过WebSocket同步');
            } catch (e) {
                console.error('WebSocket同步失败:', e);
            }
        }

        const timeStr = `${String(order_scheduledTime.hour).padStart(2, '0')}:${String(order_scheduledTime.minute).padStart(2, '0')}:${String(order_scheduledTime.second).padStart(2, '0')}.${String(order_scheduledTime.millisecond).padStart(3, '0')}`;
        addLog(`✓ 已同步: 定时 ${timeStr}, 持续 ${order_durationSeconds}秒, 速度 ${order_submitSpeed}ms (${sentCount}个通道)`);

        const syncButton = document.getElementById('order-schedule-sync');
        if (syncButton) {
            const originalText = syncButton.textContent;
            syncButton.textContent = '✓ 已同步';
            syncButton.style.backgroundColor = '#389e0d';
            syncButton.disabled = true;
            setTimeout(() => {
                syncButton.textContent = originalText;
                syncButton.style.backgroundColor = '';
                syncButton.disabled = false;
            }, 1000);
        }
    }

    function handleScheduleSync(data) {
        order_isScheduledEnabled = data.enabled;
        order_scheduledTime = {
            hour: data.hour,
            minute: data.minute,
            second: data.second,
            millisecond: data.millisecond
        };
        order_durationSeconds = data.durationSeconds;
        order_submitSpeed = data.submitSpeed;

        saveUserScheduleSettings({
            enabled: order_isScheduledEnabled,
            hour: order_scheduledTime.hour,
            minute: order_scheduledTime.minute,
            second: order_scheduledTime.second,
            millisecond: order_scheduledTime.millisecond
        }, 'order');

        saveDurationSettings({ durationSeconds: order_durationSeconds });
        saveSubmitSpeedSettings({ submitSpeed: order_submitSpeed });

        updateOrderScheduleUI();
        updateDurationUI();
        updateSpeedUI();

        if (order_isScheduledEnabled) {
            startOrderScheduleChecker();
        } else {
            stopOrderScheduleChecker();
        }

        // 更新手动模式折叠信息
        if (isManualCollapsed) {
            updateManualCollapsedInfo();
        }

        if (isCollapsed) updateCollapsedInfo();

        const timeStr = `${String(data.hour).padStart(2, '0')}:${String(data.minute).padStart(2, '0')}:${String(data.second).padStart(2, '0')}.${String(data.millisecond).padStart(3, '0')}`;
        addLog(`⬇️ 已接收同步: 定时 ${timeStr}, 持续 ${data.durationSeconds}秒, 速度 ${data.submitSpeed}ms`);
    }

    function getDurationSettings() {
        return GM_getValue('popmart_payment_durationSettings', {
            durationSeconds: ORDER_CONFIG.DEFAULT_DURATION_SECONDS
        });
    }

    function saveDurationSettings(settings) {
        GM_setValue('popmart_payment_durationSettings', settings);
        order_durationSeconds = settings.durationSeconds;
    }

    function getSubmitSpeedSettings() {
        return GM_getValue('popmart_payment_submitSpeedSettings', {
            submitSpeed: ORDER_CONFIG.DEFAULT_SUBMIT_SPEED
        });
    }

    function saveSubmitSpeedSettings(settings) {
        GM_setValue('popmart_payment_submitSpeedSettings', settings);
        order_submitSpeed = settings.submitSpeed;
    }

    // ==================== 窗口监控功能 ====================

    // 处理窗口状态更新（监测窗口接收）
    // ========== 新的消息处理函数（监控窗口） ==========

    // 处理心跳（只更新lastUpdate）
    function handleHeartbeat(data) {
        if (monitor_windowStatuses[data.windowId]) {
            monitor_windowStatuses[data.windowId].lastUpdate = data.timestamp || Date.now();
        }
    }

    // 处理完整信息（更新所有字段）
    function handleFullInfo(data) {
        // 如果消息带有 syncRequestId，检查是否匹配当前监控窗口的同步请求
        if (data.syncRequestId) {
            if (data.syncRequestId !== monitor_currentSyncRequestId) {
                // 这是其他监控窗口发起的同步请求的回复，忽略
                console.log('忽略其他监控窗口的同步回复:', data.windowId, data.syncRequestId);
                return;
            }
            console.log('收到本次同步的完整信息:', data.windowId, data.storeName);
        } else {
            // 没有 syncRequestId 的是正常的心跳触发的更新，所有监控窗口都接受
            console.log('收到完整信息:', data.windowId, data.storeName);
        }

        const existingStatus = monitor_windowStatuses[data.windowId];

        monitor_windowStatuses[data.windowId] = {
            windowId: data.windowId,
            instancePrefix: data.instancePrefix || '', // 保存实例前缀
            storeName: data.storeName || '未知',
            status: data.status || 'waiting',
            isScheduledEnabled: data.isScheduledEnabled || false,
            scheduledTime: data.scheduledTime || { hour: 0, minute: 0, second: 0, millisecond: 0 },
            isRunning: data.isRunning || false,
            durationSeconds: data.durationSeconds || ORDER_CONFIG.DEFAULT_DURATION_SECONDS,
            startTime: data.startTime,
            orderSuccess: data.orderSuccess || false,
            orderSuccessTime: data.orderSuccessTime || null,
            orderFailed: data.orderFailed || false,
            failureCount: data.failureCount || (existingStatus ? existingStatus.failureCount : 0),
            lastUpdate: data.timestamp || Date.now()
        };

        // 更新UI
        updateWindowMonitorUI();
        if (isCollapsed) {
            updateWindowCollapsedInfo();
        }
    }

    // 处理状态变化（只更新动态字段）
    function handleStatusChange(data) {
        console.log('收到状态变化:', data.windowId);
        if (!monitor_windowStatuses[data.windowId]) {
            // 如果窗口不存在，忽略（需要先收到完整信息）
            console.warn('窗口不存在，忽略状态变化:', data.windowId);
            return;
        }

        const window = monitor_windowStatuses[data.windowId];

        // 更新实例前缀（如果提供）
        if (data.instancePrefix !== undefined) {
            window.instancePrefix = data.instancePrefix;
        }

        // 只更新动态字段
        window.status = data.status || window.status;
        window.isRunning = data.isRunning !== undefined ? data.isRunning : window.isRunning;
        window.startTime = data.startTime !== undefined ? data.startTime : window.startTime;
        window.durationSeconds = data.durationSeconds !== undefined ? data.durationSeconds : window.durationSeconds;
        window.orderSuccess = data.orderSuccess !== undefined ? data.orderSuccess : window.orderSuccess;
        window.orderSuccessTime = data.orderSuccessTime || window.orderSuccessTime;
        window.orderFailed = data.orderFailed !== undefined ? data.orderFailed : window.orderFailed;
        window.lastUpdate = data.timestamp || Date.now();

        // 更新UI
        updateWindowMonitorUI();
        if (isCollapsed) {
            updateWindowCollapsedInfo();
        }
    }

    // ========== 旧的兼容函数（暂时保留，后续可删除） ==========
    function handleWindowStatusUpdate(data) {
        // 为了兼容，保留这个函数，调用 handleFullInfo
        handleFullInfo(data);
    }

    // 处理失败计数增加（监测窗口接收）
    function handleWindowFailureIncrement(data) {
        if (monitor_windowStatuses[data.windowId]) {
            monitor_windowStatuses[data.windowId].failureCount =
                (monitor_windowStatuses[data.windowId].failureCount || 0) + 1;

            console.log(`窗口 ${data.windowId} 失败次数: ${monitor_windowStatuses[data.windowId].failureCount}`);

            // 更新UI
            updateWindowMonitorUI();
            if (isCollapsed) {
                updateWindowCollapsedInfo();
            }
        }
    }

    // v4.0: 更新监控窗口的槽位显示
    function updateSlotDisplayInMonitor() {
        const slotsData = getRunningSlots();
        const slotCountElement = document.getElementById('slot-count-display');

        if (slotCountElement) {
            slotCountElement.textContent = `${slotsData.slots.length}/${slotsData.maxSlots}`;
        }

        // 同时更新窗口监控UI
        updateWindowMonitorUI();
    }

    // v4.0: 处理点击进度更新
    function handleClickProgress(data) {
        if (monitor_windowStatuses[data.windowId]) {
            monitor_windowStatuses[data.windowId].currentClick = data.currentClick;
            monitor_windowStatuses[data.windowId].totalClicks = data.totalClicks;

            // 更新UI
            updateWindowMonitorUI();
        }
    }

    // 更新窗口监控UI（展开状态）
    function updateWindowMonitorUI() {
        const listContainer = document.getElementById('window-monitor-list');
        const countElement = document.getElementById('online-window-count');

        if (!listContainer || currentMode !== 'monitor') return;

        // 过滤在线窗口
        const now = Date.now();
        let onlineWindows = Object.values(monitor_windowStatuses)
            .filter(w => {
                // 本浏览器窗口：15秒内有心跳更新（心跳间隔5秒，容错3倍）
                const isLocalWindow = !w.instancePrefix || w.instancePrefix === ws_instancePrefix;
                if (isLocalWindow) {
                    return (now - w.lastUpdate) < 15000;
                }
                // 其他浏览器窗口：30秒内有任何更新（完整信息/状态变化，通过WebSocket）
                // 因为心跳不通过WebSocket发送，所以用更长的超时时间
                return (now - w.lastUpdate) < 30000;
            })
            .sort((a, b) => {
                // 先按浏览器分组：本浏览器在前，其他浏览器在后
                const aIsLocal = !a.instancePrefix || a.instancePrefix === ws_instancePrefix;
                const bIsLocal = !b.instancePrefix || b.instancePrefix === ws_instancePrefix;

                if (aIsLocal && !bIsLocal) return -1; // a在前
                if (!aIsLocal && bIsLocal) return 1;   // b在前

                // 同组内按创建时间排序（从windowId中提取时间戳）
                const timeA = a.windowId.split('_')[1] || '0';
                const timeB = b.windowId.split('_')[1] || '0';
                return parseInt(timeA) - parseInt(timeB);
            });

        const totalCount = onlineWindows.length;

        // 如果启用筛选，过滤匹配的窗口
        let filteredWindows = onlineWindows;
        if (monitor_windowFilter_enabled && monitor_selectedStoreNames.length > 0) {
            filteredWindows = onlineWindows.filter(w => {
                // 本浏览器的窗口（instancePrefix 为空或等于当前实例），全部显示
                if (!w.instancePrefix || w.instancePrefix === ws_instancePrefix) {
                    return true;
                }
                // 其他浏览器的窗口，只显示勾选店铺匹配的
                return monitor_selectedStoreNames.includes(w.storeName);
            });
        }

        const matchedCount = filteredWindows.length;

        // 更新在线数量（显示 匹配数/总数）
        if (countElement) {
            if (monitor_windowFilter_enabled && monitor_selectedStoreNames.length > 0) {
                countElement.textContent = `${matchedCount}/${totalCount}`;
            } else {
                countElement.textContent = totalCount;
            }
        }

        // 如果没有在线窗口
        if (totalCount === 0) {
            listContainer.innerHTML = '<div class="no-windows">暂无在线窗口</div>';
            return;
        }

        // 如果筛选后没有匹配的窗口
        if (monitor_windowFilter_enabled && matchedCount === 0) {
            listContainer.innerHTML = '<div class="no-windows">无匹配窗口（总共 ' + totalCount + ' 个）</div>';
            return;
        }

        // 渲染窗口列表（只显示筛选后的窗口）
        let html = '';
        let instanceCounters = {}; // 为每个实例前缀分别计数
        let localCounter = 0;

        filteredWindows.forEach((window, index) => {
            const storeName = window.storeName.substring(0, 3).padEnd(3, ' '); // 固定3个字符
            const statusText = getStatusText(window);
            const statusClass = getStatusClass(window);
            const failureCount = window.failureCount || 0;
            const infoText = getThirdColumnText(window);

            // 生成显示的ID
            let displayId;
            if (!window.instancePrefix || window.instancePrefix === ws_instancePrefix) {
                // 本浏览器：#1, #2, #3...
                localCounter++;
                displayId = `#${localCounter}`;
            } else {
                // 其他浏览器：C14-1, C14-2, 移1-1...
                if (!instanceCounters[window.instancePrefix]) {
                    instanceCounters[window.instancePrefix] = 0;
                }
                instanceCounters[window.instancePrefix]++;
                displayId = `${window.instancePrefix}-${instanceCounters[window.instancePrefix]}`;
            }

            html += `
                <div class="window-item">
                    <span class="window-number clickable-window-focus" data-window-id="${window.windowId}">${displayId}</span>
                    <span class="window-store-name clickable-window-focus" data-window-id="${window.windowId}" title="${window.storeName}">${storeName}</span>
                    <span class="window-separator">|</span>
                    <span class="window-status ${statusClass}">${statusText}</span>
                    <span class="window-separator">|</span>
                    <span class="window-failure">失败: ${failureCount}次</span>
                    <span class="window-separator">|</span>
                    <span class="window-info">${infoText}</span>
                </div>
            `;
        });

        listContainer.innerHTML = html;

        // 绑定点击事件
        bindSuccessClickEvents();
        bindWindowFocusEvents();
    }

    // 获取状态文本
    function getStatusText(window) {
        if (window.orderSuccess) return '已停止';
        if (window.orderFailed) return '已停止';
        if (window.isRunning) return '运行中';
        if (window.isScheduledEnabled && !window.isRunning) return '定时等待';
        return '等待信号';
    }

    // 获取状态样式类
    function getStatusClass(window) {
        if (window.orderSuccess) return 'status-stopped';
        if (window.orderFailed) return 'status-stopped';
        if (window.isRunning) return 'status-running';
        if (window.isScheduledEnabled && !window.isRunning) return 'status-scheduled';
        return 'status-waiting';
    }

    // 获取第三列文本（按优先级）
    function getThirdColumnText(window) {
        // 优先级1: 下单成功（带15分钟倒计时）
        if (window.orderSuccess && window.orderSuccessTime) {
            const elapsed = Date.now() - window.orderSuccessTime;
            const remaining = 15 * 60 * 1000 - elapsed;
            if (remaining > 0) {
                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);
                return `<span class="success-link" data-window-id="${window.windowId}">下单成功 (${minutes}:${String(seconds).padStart(2, '0')})</span>`;
            }
            return '<span class="success-text">下单成功</span>';
        }

        // 优先级2: 下单失败
        if (window.orderFailed) {
            return '<span class="failed-text">下单失败</span>';
        }

        // v4.0: 优先级3: 运行中（显示点击进度）
        if (window.isRunning) {
            if (window.currentClick && window.totalClicks) {
                return `第${window.currentClick}/${window.totalClicks}次`;
            }
            // 兼容旧数据：显示剩余时间
            if (window.startTime && window.durationSeconds) {
                const elapsed = (Date.now() - window.startTime) / 1000;
                const remaining = Math.max(0, Math.floor(window.durationSeconds - elapsed));
                return `剩余: ${remaining}秒`;
            }
        }

        // 优先级4: 定时等待（显示定时时间）
        if (window.isScheduledEnabled && !window.isRunning) {
            const t = window.scheduledTime;
            return `${String(t.hour).padStart(2, '0')}:${String(t.minute).padStart(2, '0')}:${String(t.second).padStart(2, '0')}.${String(t.millisecond).padStart(3, '0')}`;
        }

        // 优先级5: 默认
        return '-';
    }

    // 绑定下单成功点击事件
    function bindSuccessClickEvents() {
        document.querySelectorAll('.success-link').forEach(link => {
            link.addEventListener('click', function () {
                const windowId = this.getAttribute('data-window-id');
                handleSuccessClick(windowId);
            });
        });
    }

    // 处理点击下单成功链接
    function handleSuccessClick(windowId) {
        focusOrderWindow(windowId);
    }

    // 绑定窗口聚焦点击事件（序号和店名）
    function bindWindowFocusEvents() {
        document.querySelectorAll('.clickable-window-focus').forEach(element => {
            element.addEventListener('click', function () {
                const windowId = this.getAttribute('data-window-id');
                focusOrderWindow(windowId);
            });
        });
    }

    // 统一的窗口聚焦函数
    function focusOrderWindow(windowId) {
        const focusMessage = {
            type: 'focus_window_request',
            targetWindowId: windowId,
            timestamp: Date.now()
        };

        try {
            // 通过 BroadcastChannel 发送（同浏览器）
            if (broadcastChannel) {
                broadcastChannel.postMessage(focusMessage);
            }

            // 通过 WebSocket 发送（跨浏览器）
            if (ws_enabled && ws_isConnected) {
                sendWebSocketMessage('focus_window_request', focusMessage);
            }

            console.log(`已发送聚焦请求到窗口: ${windowId}`);
        } catch (e) {
            console.error('发送聚焦请求失败:', e);
        }
    }

    // 更新折叠状态下的窗口统计
    function updateWindowCollapsedInfo() {
        const infoElement = document.getElementById('window-collapsed-info');
        if (!infoElement) return;

        // 过滤在线窗口（与updateWindowMonitorUI保持一致）
        const now = Date.now();
        const onlineWindows = Object.values(monitor_windowStatuses)
            .filter(w => {
                // 本浏览器窗口：15秒内有心跳更新（容错3倍）
                // 其他浏览器窗口：30秒内有任何更新
                const isLocalWindow = !w.instancePrefix || w.instancePrefix === ws_instancePrefix;
                return isLocalWindow ? ((now - w.lastUpdate) < 15000) : ((now - w.lastUpdate) < 30000);
            })
            .sort((a, b) => {
                // 先按浏览器分组：本浏览器在前，其他浏览器在后
                const aIsLocal = !a.instancePrefix || a.instancePrefix === ws_instancePrefix;
                const bIsLocal = !b.instancePrefix || b.instancePrefix === ws_instancePrefix;

                if (aIsLocal && !bIsLocal) return -1;
                if (!aIsLocal && bIsLocal) return 1;

                // 同组内按创建时间排序
                const timeA = a.windowId.split('_')[1] || '0';
                const timeB = b.windowId.split('_')[1] || '0';
                return parseInt(timeA) - parseInt(timeB);
            });

        if (onlineWindows.length === 0) {
            infoElement.textContent = '无在线窗口';
            infoElement.style.color = '#999';
            return;
        }

        // 统计各状态数量
        const stats = {
            waiting: 0,
            running: 0,
            scheduled: 0,
            success: 0
        };

        // 计算总失败次数
        let totalFailures = 0;

        onlineWindows.forEach(window => {
            // 累计失败次数
            totalFailures += (window.failureCount || 0);

            // 统计窗口状态
            if (window.orderSuccess) {
                stats.success++;
            } else if (window.isRunning) {
                stats.running++;
            } else if (window.isScheduledEnabled && !window.isRunning) {
                stats.scheduled++;
            } else {
                stats.waiting++;
            }
        });

        // 生成显示文本
        const parts = [];
        if (stats.waiting > 0) parts.push(`🟢等待:${stats.waiting}`);
        if (stats.running > 0) parts.push(`🔵运行:${stats.running}`);
        if (stats.scheduled > 0) parts.push(`🟡定时:${stats.scheduled}`);
        if (stats.success > 0) parts.push(`✅成功:${stats.success}`);
        if (totalFailures > 0) parts.push(`❌失败:${totalFailures}次`);

        infoElement.textContent = parts.join(' ');
        infoElement.style.color = '#1890ff';
    }

    // 处理聚焦请求（下单窗口接收）
    function handleFocusRequest(data) {
        console.log('收到聚焦请求:', data);
        console.log('目标窗口ID:', data.targetWindowId);
        console.log('当前窗口ID:', order_windowId);
        console.log('是否匹配:', data.targetWindowId === order_windowId);

        if (data.targetWindowId === order_windowId) {
            try {
                const originalTitle = document.title;
                const alertTitle = '🔔🔔🔔 请查看此窗口！';

                // 立即显示第一次提醒（解决延迟问题）
                document.title = alertTitle;

                // 闪烁5轮（每轮包含显示和恢复，共10次变化）
                let count = 1; // 从1开始，因为已经显示了第一次
                const flashInterval = setInterval(() => {
                    // 奇数次显示原标题，偶数次显示提醒
                    document.title = count % 2 === 1 ? originalTitle : alertTitle;
                    count++;

                    // 10次变化后停止（5轮完整闪烁）
                    if (count >= 10) {
                        clearInterval(flashInterval);
                        // 延迟50ms后确保恢复原标题（防止定时器队列中的任务覆盖）
                        setTimeout(() => {
                            document.title = originalTitle;
                        }, 50);
                    }
                }, 500);

                // 尝试聚焦
                window.focus();

                // 滚动到顶部
                window.scrollTo(0, 0);

                console.log('已请求聚焦，标题闪烁中');
            } catch (e) {
                console.error('聚焦失败:', e);
            }
        }
    }

    // 处理强制完整信息更新请求（下单窗口接收）
    function handleForceFullInfoUpdate(data) {
        console.log('收到强制完整信息更新请求');
        sendFullInfo(data.syncRequestId);
    }

    // 获取当前窗口状态（下单窗口调用）
    function getWindowStatus() {
        if (order_isRunning) return 'running';
        if (order_isScheduledEnabled && !order_isRunning) return 'scheduled';
        return 'waiting';
    }

    // 获取剩余时间（下单窗口调用）
    function getRemainingTime() {
        if (!order_isRunning || !order_startTime) return null;
        const elapsed = (Date.now() - order_startTime) / 1000;
        const remaining = Math.max(0, order_durationSeconds - elapsed);
        return remaining;
    }

    // 启动心跳（下单窗口调用，每5秒发送一次轻量级心跳）
    function startHeartbeat() {
        setInterval(() => {
            if (currentMode !== 'order' || !order_windowId) return;

            try {
                // 心跳只通过 BroadcastChannel 发送（轻量级，只用于检测同浏览器窗口在线状态）
                // WebSocket 连接本身就能表明跨浏览器窗口是否在线，无需额外心跳
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'heartbeat',
                        windowId: order_windowId,
                        timestamp: Date.now()
                    });
                }
            } catch (e) {
                console.error('发送心跳失败:', e);
            }
        }, 5000);
    }

    // 启动跨端心跳（下单窗口调用，点击同步后每20秒发送一次）
    function startCrossBrowserHeartbeat() {
        // 如果已启用，忽略（避免重复启动）
        if (order_crossBrowserHeartbeatEnabled) {
            console.log('⏭️ 跨端心跳已在运行，跳过重复启动');
            return;
        }

        console.log('✅ 首次启动跨端心跳（20秒一次）');

        // 标记为已启用
        order_crossBrowserHeartbeatEnabled = true;

        // 立即发送一次
        sendCrossBrowserHeartbeat();

        // 每20秒发送一次
        order_crossBrowserHeartbeatTimer = setInterval(() => {
            if (currentMode !== 'order' || !order_windowId) return;
            sendCrossBrowserHeartbeat();
        }, 20000);
    }

    // 发送跨端心跳（轻量级，只通过WebSocket）
    function sendCrossBrowserHeartbeat() {
        if (!order_windowId || !ws_enabled || !ws_isConnected) return;

        try {
            sendWebSocketMessage('cross_browser_heartbeat', {
                windowId: order_windowId,
                instancePrefix: ws_instancePrefix,
                timestamp: Date.now()
            });
            console.log('📡 已发送跨端心跳');
        } catch (e) {
            console.error('发送跨端心跳失败:', e);
        }
    }

    // 处理跨端心跳（监控窗口调用）
    function handleCrossBrowserHeartbeat(data) {
        if (!data.windowId) return;

        // 如果窗口已存在，更新lastUpdate
        if (monitor_windowStatuses[data.windowId]) {
            monitor_windowStatuses[data.windowId].lastUpdate = data.timestamp || Date.now();
            console.log('📡 收到跨端心跳:', data.windowId);
        }
    }

    // 发送完整信息（下单窗口调用）
    function sendFullInfo(syncRequestId) {
        if (!order_windowId) return;

        const fullInfoMessage = {
            type: 'window_full_info',
            windowId: order_windowId,
            instancePrefix: ws_instancePrefix,
            storeName: order_currentStoreName,
            status: getWindowStatus(),
            isScheduledEnabled: order_isScheduledEnabled,
            scheduledTime: order_scheduledTime,
            isRunning: order_isRunning,
            durationSeconds: order_durationSeconds,
            startTime: order_startTime,
            orderSuccess: false,
            orderFailed: false,
            failureCount: 0,
            syncRequestId: syncRequestId, // 如果是响应同步请求，带上请求ID
            timestamp: Date.now()
        };

        try {
            // 总是通过 BroadcastChannel 发送（同浏览器）
            if (broadcastChannel) {
                broadcastChannel.postMessage(fullInfoMessage);
            }

            // 只有在响应同步请求时才通过 WebSocket 发送（跨浏览器同步请求）
            if (syncRequestId && ws_enabled && ws_isConnected) {
                sendWebSocketMessage('window_full_info', fullInfoMessage);
                console.log('已发送完整信息到其他浏览器 (syncRequestId:', syncRequestId, ')');
            } else {
                console.log('已发送完整信息到本浏览器');
            }
        } catch (e) {
            console.error('发送完整信息失败:', e);
        }
    }

    // 发送状态变化（下单窗口调用）
    function sendStatusChange(options = {}) {
        if (!order_windowId) return;

        const statusMessage = {
            type: 'window_status_change',
            windowId: order_windowId,
            instancePrefix: ws_instancePrefix,
            status: getWindowStatus(),
            isRunning: order_isRunning,
            startTime: order_startTime,
            durationSeconds: order_durationSeconds,
            timestamp: Date.now(),
            ...options // 可以传入 orderSuccess, orderFailed 等
        };

        try {
            // 总是通过 BroadcastChannel 发送（同浏览器）
            if (broadcastChannel) {
                broadcastChannel.postMessage(statusMessage);
            }

            // 只有关键状态（下单成功）才通过 WebSocket 发送（需要通知所有浏览器停止监控）
            const isCriticalStatus = options.orderSuccess === true;
            if (isCriticalStatus && ws_enabled && ws_isConnected) {
                sendWebSocketMessage('window_status_change', statusMessage);
                console.log('已发送关键状态变化到所有浏览器:', statusMessage);
            } else {
                console.log('已发送状态变化到本浏览器:', statusMessage.status);
            }
        } catch (e) {
            console.error('发送状态变化失败:', e);
        }
    }

    // 启动离线检测（监测窗口调用，每5秒检查一次）
    function startOfflineDetection() {
        setInterval(() => {
            if (currentMode !== 'monitor') return;

            const now = Date.now();
            let hasOffline = false;

            Object.values(monitor_windowStatuses).forEach(status => {
                // 本浏览器窗口：15秒超时（心跳5秒，容错3倍）
                // 其他浏览器窗口：30秒超时（因为心跳不通过WebSocket）
                const isLocalWindow = !status.instancePrefix || status.instancePrefix === ws_instancePrefix;
                const timeout = isLocalWindow ? 15000 : 30000;

                if (now - status.lastUpdate > timeout && status.status !== 'offline') {
                    status.status = 'offline';
                    hasOffline = true;
                    console.log(`窗口 ${status.windowId} 离线 (超时: ${timeout}ms)`);
                }
            });

            if (hasOffline) {
                updateWindowMonitorUI();
                if (isCollapsed) updateWindowCollapsedInfo();
            }
        }, 5000);
    }

    // 启动15分钟倒计时更新（监测窗口调用，每秒更新一次）
    function startSuccessCountdown() {
        setInterval(() => {
            if (currentMode !== 'monitor') return;

            let hasExpired = false;
            const now = Date.now();

            Object.values(monitor_windowStatuses).forEach(status => {
                if (status.orderSuccess && status.orderSuccessTime) {
                    const elapsed = now - status.orderSuccessTime;
                    if (elapsed > 15 * 60 * 1000) {
                        status.orderSuccess = false;
                        status.orderSuccessTime = null;
                        hasExpired = true;
                    }
                }
            });

            // 即使没有过期也要更新（更新倒计时显示）
            updateWindowMonitorUI();
            if (isCollapsed) updateWindowCollapsedInfo();
        }, 1000);
    }

    // ==================== 快速开窗功能 ====================
    function getWindowCount() {
        return GM_getValue('popmart_windowCount', 4);
    }

    function saveWindowCount(count) {
        GM_setValue('popmart_windowCount', count);
    }

    function updateRegisteredWindowsCount() {
        const countElement = document.getElementById('registered-windows-count');
        if (countElement && currentMode === 'order') {
            const count = getOrderWindowCount();
            countElement.textContent = count;
        }
    }

    /**
     * v4.0: 更新自动模式槽位显示
     */
    function updateAutoSlotDisplay() {
        const slotDisplay = document.getElementById('auto-slot-display');
        if (slotDisplay && currentMode === 'order') {
            const slotsData = getRunningSlots();
            slotDisplay.textContent = `${slotsData.slots.length}/${slotsData.maxSlots} 使用中`;
        }
    }

    async function openMultipleWindows() {
        const windowCountInput = document.getElementById('window-count');
        const openBtn = document.getElementById('open-windows-btn');

        if (!windowCountInput || !openBtn) return;

        let count = parseInt(windowCountInput.value);

        // 验证数量
        if (isNaN(count) || count < 1 || count > 20) {
            addLog('⚠️ 请输入有效的窗口数量 (1-20)', true);
            return;
        }

        // 保存数量
        saveWindowCount(count);

        // 禁用按钮，显示进度
        const originalText = openBtn.textContent;
        openBtn.disabled = true;

        addLog(`开始打开 ${count} 个窗口...`);

        const targetUrl = 'https://www.popmart.com/hk/largeShoppingCart';
        let successCount = 0;

        for (let i = 0; i < count; i++) {
            try {
                // 更新按钮文本显示进度
                openBtn.textContent = `打开中 ${i + 1}/${count}`;

                // 使用 GM_openInTab 打开新窗口（不会被浏览器拦截）
                GM_openInTab(targetUrl, {
                    active: false,  // 后台打开，不切换焦点
                    insert: true    // 在当前标签页后插入
                });
                successCount++;

                // 等待1000ms再打开下一个
                if (i < count - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (error) {
                console.error('打开窗口失败:', error);
                addLog(`✗ 打开第 ${i + 1} 个窗口失败`, true);
            }
        }

        // 完成反馈
        addLog(`✓ 成功打开 ${successCount} 个窗口`);
        openBtn.textContent = '✓ 已完成';
        openBtn.style.backgroundColor = '#52c41a';

        // 1.5秒后恢复按钮
        setTimeout(() => {
            openBtn.textContent = originalText;
            openBtn.style.backgroundColor = '';
            openBtn.disabled = false;
        }, 1500);

        // 5秒后更新窗口计数（等待新窗口加载和注册）
        setTimeout(() => {
            updateRegisteredWindowsCount();
            addLog('窗口注册更新完成，请查看数量');
        }, 5000);
    }

    function updateOrderScheduleUI() {
        const scheduleToggle = document.getElementById('order-schedule-toggle');
        const hourInput = document.getElementById('order-schedule-hour');
        const minuteInput = document.getElementById('order-schedule-minute');
        const secondInput = document.getElementById('order-schedule-second');
        const millisecondInput = document.getElementById('order-schedule-millisecond');

        if (scheduleToggle) scheduleToggle.checked = order_isScheduledEnabled;
        if (hourInput) hourInput.value = order_scheduledTime.hour;
        if (minuteInput) minuteInput.value = order_scheduledTime.minute;
        if (secondInput) secondInput.value = order_scheduledTime.second;
        if (millisecondInput) millisecondInput.value = order_scheduledTime.millisecond;
    }

    function startOrderScheduleChecker() {
        if (order_scheduleInterval) {
            clearInterval(order_scheduleInterval);
        }
        order_scheduleInterval = setInterval(() => {
            if (!order_isScheduledEnabled) return;
            const beijingTime = getServerTimeFromPage();
            if (beijingTime.getHours() === order_scheduledTime.hour &&
                beijingTime.getMinutes() === order_scheduledTime.minute &&
                beijingTime.getSeconds() === order_scheduledTime.second &&
                beijingTime.getMilliseconds() >= order_scheduledTime.millisecond &&
                !order_isRunning) {
                addLog('定时时间到达，开始运行');
                executeManualPayment();
            }
        }, 100);
    }

    function stopOrderScheduleChecker() {
        if (order_scheduleInterval) {
            clearInterval(order_scheduleInterval);
            order_scheduleInterval = null;
        }
    }

    // ==================== 样式 ====================
    GM_addStyle(`
        #combined-panel {
            position: fixed; top: 20px; left: 20px; width: 350px;
            background: white; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid #999; z-index: 999;
        }
        .panel-header { display: flex; justify-content: space-between; padding: 12px; cursor: move; border-bottom: 1px solid #e8e8e8; }
        .mode-switcher { display: flex; gap: 8px; }
        .mode-btn { padding: 4px 12px; border: none; background: transparent; color: #666; cursor: pointer; }
        .mode-btn.active { font-weight: bold; }
        .header-controls { display: flex; gap: 8px; }
        .run-button { padding: 4px 12px; border: none; border-radius: 4px; background: #52c41a; color: white; cursor: pointer; font-size: 12px; font-weight: bold; }
        .stop-button { padding: 4px 12px; border: none; border-radius: 4px; background: #ff4d4f; color: white; cursor: pointer; font-size: 12px; font-weight: bold; }
        .collapse-btn { width: 24px; height: 24px; border: 1px solid #d9d9d9; background: #f0f0f0; border-radius: 4px; cursor: pointer; padding: 0; }
        .collapse-btn:hover { background: #e6e6e6; border-color: #bfbfbf; }
        .test-btn { padding: 4px 12px; border: 1px solid #d9d9d9; background: #f0f0f0; color: #333; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; }
        .test-btn:hover { background: #e6e6e6; border-color: #bfbfbf; }
        .test-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .collapse-sync-btn { padding: 4px 10px; border: none; background: #52c41a; color: white; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .collapse-sync-btn:hover { background: #73d13d; }
        .collapse-sync-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .collapsed-info-container { padding: 8px 12px; font-size: 13px; color: #666; border-bottom: 1px solid #e8e8e8; }
        .panel-content { padding: 12px; max-height: calc(100vh - 200px); overflow-y: auto; }
        .panel-content::-webkit-scrollbar { width: 6px; }
        .panel-content::-webkit-scrollbar-thumb { background: #bfbfbf; border-radius: 3px; }
        .control-buttons { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 10px; }
        .select-all-label { display: flex; align-items: center; cursor: pointer; font-size: 12px; font-weight: bold; }
        #select-all-toggle { margin-right: 5px; cursor: pointer; }
        #select-status-text { user-select: none; }
        .button-group { display: flex; gap: 5px; }
        .sync-store-btn-small { padding: 4px 8px; border: none; border-radius: 4px; background: #52c41a; color: white; cursor: pointer; font-size: 12px; }
        .sync-store-btn-small:hover { background: #73d13d; }
        .websocket-toggle-btn { padding: 2px 8px; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; transition: all 0.3s; }
        .websocket-toggle-btn.ws-disabled { background: #d9d9d9; color: #666; }
        .websocket-toggle-btn.ws-disabled:hover { background: #bfbfbf; }
        .websocket-toggle-btn.ws-connecting { background: #faad14; color: white; animation: pulse 1.5s infinite; }
        .websocket-toggle-btn.ws-connected { background: #1890ff; color: white; }
        .websocket-toggle-btn.ws-connected:hover { background: #40a9ff; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .store-list-container { max-height: 250px; overflow-y: auto; margin-bottom: 10px; border: 1px solid #f0f0f0; border-radius: 4px; padding: 6px; }
        .store-list-container::-webkit-scrollbar { width: 6px; }
        .store-list-container::-webkit-scrollbar-thumb { background: #bfbfbf; border-radius: 3px; }
        .store-item { padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
        .store-item:last-child { border-bottom: none; }
        .store-item label { display: flex; align-items: center; cursor: pointer; }
        .store-item input { margin-right: 8px; }
        .store-name { font-size: 12px; word-break: break-all; }
        .schedule-section, .refresh-interval-section { margin-bottom: 10px; padding: 8px; border: 1px solid #f0f0f0; border-radius: 4px; background: #f9f9f9; }
        .schedule-header label { display: flex; align-items: center; font-weight: bold; margin-bottom: 5px; font-size: 12px; }
        .schedule-header input { margin-right: 5px; }
        .schedule-controls { display: flex; align-items: center; gap: 3px; margin-bottom: 5px; flex-wrap: wrap; }
        .schedule-controls input { width: 40px; padding: 3px; text-align: center; font-size: 11px; }
        .schedule-controls input[type="number"]#order-schedule-millisecond { width: 50px; }
        .schedule-controls button { padding: 4px 8px; border: none; border-radius: 4px; background: #1890ff; color: white; cursor: pointer; font-size: 12px; }
        .schedule-controls button:hover { background: #40a9ff; }
        #order-schedule-sync { background: #52c41a; }
        #order-schedule-sync:hover { background: #73d13d; }
        #order-schedule-sync:disabled { opacity: 0.8; cursor: not-allowed; }
        .schedule-info { font-size: 10px; color: #666; }
        .schedule-info div { margin-bottom: 2px; }
        .refresh-interval-header { font-weight: bold; margin-bottom: 5px; font-size: 12px; }
        .refresh-interval-controls { display: flex; gap: 5px; margin-bottom: 5px; }
        .interval-preset { flex: 1; padding: 4px 8px; border: none; border-radius: 4px; background: #f0f0f0; color: #333; cursor: pointer; font-size: 12px; transition: all 0.3s; }
        .interval-preset:hover { background: #e0e0e0; }
        .interval-preset.active { background: #1890ff; color: white; }
        .refresh-interval-info { font-size: 11px; color: #666; text-align: center; }
        .message-mode-section { margin-bottom: 10px; padding: 8px; border: 1px solid #f0f0f0; border-radius: 4px; background: #fff3cd; }
        .mode-toggle-row { display: flex; gap: 10px; margin-bottom: 8px; }
        .mode-toggle-item { flex: 1; }
        .mode-toggle-item label { display: flex; align-items: center; font-weight: bold; font-size: 12px; cursor: pointer; }
        .mode-toggle-item input[type="checkbox"] { margin-right: 5px; }
        .message-mode-header label { display: flex; align-items: center; font-weight: bold; margin-bottom: 5px; }
        .message-mode-info { font-size: 11px; }
        .message-mode-info div { margin-bottom: 2px; }
        .detail-mode-section { margin-bottom: 10px; padding: 8px; border: 1px solid #f0f0f0; border-radius: 4px; background: #d4edda; }
        .detail-mode-header { font-weight: bold; margin-bottom: 8px; font-size: 12px; }
        .quantity-mode-controls { display: flex; flex-direction: column; gap: 5px; margin-bottom: 8px; }
        .quantity-radio { display: flex; align-items: center; font-size: 12px; cursor: pointer; padding: 4px; border-radius: 3px; transition: background 0.2s; }
        .quantity-radio:hover { background: rgba(0, 0, 0, 0.05); }
        .quantity-radio input { margin-right: 6px; }
        .detail-mode-info { font-size: 11px; color: #666; margin-top: 5px; }
        .status-info { font-size: 11px; padding: 6px; background: #f9f9f9; border-radius: 4px; }
        .status-info div { margin-bottom: 3px; }
        .info-section { margin-bottom: 12px; padding: 8px; background: #f5f5f5; border-radius: 4px; }
        .info-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 13px; }
        .info-item:last-child { margin-bottom: 0; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .status-active { color: #52c41a; font-weight: bold; }
        .sync-btn { padding: 4px 8px; border: none; border-radius: 4px; background: #52c41a; color: white; cursor: pointer; font-size: 12px; margin-left: 8px; }
        .sync-btn:hover { background: #73d13d; }
        .quick-open-section { margin-bottom: 12px; padding: 10px; background: #e6f7ff; border-radius: 4px; border: 1px solid #91d5ff; }
        .quick-open-header { font-weight: bold; margin-bottom: 8px; color: #0050b3; font-size: 14px; }
        .quick-open-content { font-size: 12px; }
        .quick-open-row { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .quick-open-label { color: #666; font-weight: bold; }
        #window-count { width: 50px; padding: 4px 6px; text-align: center; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 12px; }
        .quick-open-unit { color: #666; }
        .open-windows-btn { width: 85px; padding: 4px 12px; border: none; border-radius: 4px; background: #1890ff; color: white; cursor: pointer; font-size: 12px; font-weight: bold; }
        .open-windows-btn:hover { background: #40a9ff; }
        .open-windows-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .quick-open-info { font-size: 11px; color: #666; padding: 4px 0; }
        #registered-windows-count { color: #1890ff; font-weight: bold; }
        .loading-hint { color: #999; font-size: 10px; }
        .auto-mode-section { margin-bottom: 12px; padding: 10px; background: #e6f7ff; border-radius: 4px; border: 1px solid #91d5ff; }
        .auto-mode-header { font-weight: bold; margin-bottom: 8px; color: #0050b3; font-size: 14px; }
        .auto-mode-content { font-size: 13px; }
        .auto-mode-item { display: flex; justify-content: space-between; padding: 4px 0; }
        .auto-label { color: #666; font-weight: bold; }
        .auto-value { color: #1890ff; font-weight: bold; }
        .manual-section { margin-bottom: 12px; padding: 10px; background: #fff3cd; border-radius: 4px; border: 1px solid #ffc107; }
        .manual-header { font-weight: bold; margin-bottom: 8px; color: #856404; font-size: 14px; cursor: pointer; user-select: none; }
        .manual-title-row { display: flex; justify-content: space-between; align-items: center; }
        .manual-collapsed-info { display: none; font-size: 13px; font-weight: normal; padding-top: 8px; margin-top: 8px; border-top: 1px solid #e8e8e8; }
        .manual-collapse-btn { width: 20px; height: 20px; border: none; background: rgba(133,100,4,0.2); color: #856404; border-radius: 3px; cursor: pointer; font-size: 14px; padding: 0; }
        .duration-section, .speed-section { margin-bottom: 10px; padding: 8px; background: white; border-radius: 4px; }
        .duration-header, .speed-header { font-weight: bold; margin-bottom: 5px; font-size: 12px; }
        .duration-controls { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 5px; }
        .speed-controls { display: flex; gap: 5px; margin-bottom: 5px; }
        .adjust-btn { width: 24px; height: 24px; border: none; border-radius: 4px; background: #1890ff; color: white; cursor: pointer; font-size: 14px; font-weight: bold; }
        .adjust-btn:hover { background: #40a9ff; }
        #duration-display { font-size: 14px; font-weight: bold; min-width: 50px; text-align: center; }
        .duration-info, .speed-info { font-size: 10px; color: #666; text-align: center; }
        .speed-preset { flex: 1; padding: 4px 8px; border: none; border-radius: 4px; background: #f0f0f0; color: #333; cursor: pointer; font-size: 12px; transition: all 0.3s; }
        .speed-preset:hover { background: #e0e0e0; }
        .speed-preset.active { background: #1890ff; color: white; }
        .button-section { margin-top: 10px; }
        .pay-button { width: 100%; padding: 8px 16px; border: none; border-radius: 4px; background: #52c41a; color: white; font-size: 14px; font-weight: bold; cursor: pointer; }
        .pay-button:hover { background: #73d13d; }
        .pay-button.stop-button { background: #ff4d4f; }
        .log-section { border-top: 1px solid #f0f0f0; padding-top: 8px; }
        .log-header { font-size: 12px; font-weight: bold; color: #666; margin-bottom: 6px; }
        .log-content { max-height: 150px; overflow-y: auto; background: #fafafa; border: 1px solid #f0f0f0; border-radius: 4px; padding: 6px; font-size: 11px; font-family: 'Courier New', monospace; }
        .log-entry { margin-bottom: 4px; color: #333; word-break: break-all; }
        .log-entry:last-child { margin-bottom: 0; }
        
        /* 窗口监控样式 */
        .window-monitor-section { margin-bottom: 10px; padding: 8px; border: 1px solid #f0f0f0; border-radius: 4px; background: #f0f9ff; }
        .window-monitor-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .window-monitor-header { font-weight: bold; font-size: 12px; color: #0050b3; }
        .window-monitor-buttons { display: flex; gap: 5px; align-items: center; }
        .sync-windows-btn { padding: 2px 8px; border: none; border-radius: 3px; background: #52c41a; color: white; cursor: pointer; font-size: 11px; }
        .sync-windows-btn:hover { background: #73d13d; }
        .sync-windows-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        #online-window-count { color: #1890ff; font-weight: bold; }
        .window-monitor-list { font-size: 11px; }
        .no-windows { color: #999; text-align: center; padding: 8px; font-style: italic; }
        .window-item { display: flex; align-items: center; gap: 6px; padding: 4px 0; border-bottom: 1px solid #e6f7ff; }
        .window-item:last-child { border-bottom: none; }
        .window-number { color: #666; font-weight: bold; min-width: 40px; font-family: monospace; }
        .window-store-name { color: #333; font-weight: bold; min-width: 3em; font-family: monospace; }
        .clickable-window-focus { cursor: pointer; transition: color 0.2s, text-decoration 0.2s; }
        .clickable-window-focus:hover { color: #1890ff; text-decoration: underline; }
        .window-separator { color: #ccc; }
        .window-status { font-weight: bold; min-width: 55px; }
        .status-waiting { color: #52c41a; }
        .status-running { color: #1890ff; }
        .status-scheduled { color: #faad14; }
        .status-stopped { color: #999; }
        .status-offline { color: #ff4d4f; }
        .window-failure { color: #ff4d4f; font-weight: bold; min-width: 60px; }
        .window-info { flex: 1; color: #666; }
        .success-link { color: #52c41a; font-weight: bold; cursor: pointer; text-decoration: underline; }
        .success-link:hover { color: #73d13d; }
        .success-text { color: #52c41a; font-weight: bold; }
        .failed-text { color: #ff4d4f; font-weight: bold; }
        .window-offline { opacity: 0.5; }
        
        /* WebSocket状态样式 */
        .ws-info-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: #f0f5ff; border-top: 1px solid #d6e4ff; font-size: 11px; }
        .ws-label { color: #666; font-weight: normal; }
        .ws-value { color: #1890ff; font-weight: bold; }
    `);

    // ==================== 监测模式辅助函数 ====================
    function updateStoreList() {
        const storeListContainer = document.getElementById('store-list');
        if (!storeListContainer) return;

        const previouslySelected = getUserSelectedStores();

        storeListContainer.innerHTML = monitor_ALL_STORES.map((storeName, index) => `
            <div class="store-item">
                <label>
                    <input type="checkbox" data-index="${index}"
                        ${previouslySelected.includes(index) || previouslySelected.length === 0 ? 'checked' : ''} />
                    <span class="store-name">${storeName}</span>
                </label>
            </div>
        `).join('');

        if (previouslySelected.length > 0) {
            monitor_selectedStores = [...previouslySelected];
        } else {
            monitor_selectedStores = monitor_ALL_STORES.map((_, index) => index);
        }

        // 更新选择状态文本
        updateSelectStatusText();
    }

    function getUserSelectedStores() {
        return GM_getValue('popmart_selectedStores', []);
    }

    function updateMonitorTimeDisplay() {
        const beijingTime = getServerTimeFromPage();
        const timeString = beijingTime.toTimeString().substring(0, 8);
        const currentTimeElement = document.getElementById('monitor-current-time');
        if (currentTimeElement) {
            currentTimeElement.textContent = timeString;
        }
        const scheduledTimeElement = document.getElementById('monitor-scheduled-time');
        if (scheduledTimeElement) {
            scheduledTimeElement.textContent =
                `${String(monitor_scheduledTime.hour).padStart(2, '0')}:${String(monitor_scheduledTime.minute).padStart(2, '0')}:${String(monitor_scheduledTime.second).padStart(2, '0')}`;
        }
    }

    // ==================== 下单模式辅助函数 ====================
    function checkIfOnOrderPage() {
        // 检测订单页面的特征元素
        const orderPageElement = document.querySelector('.index_pickUpStoreName__4lZuR');
        return !!orderPageElement;
    }

    function extractStoreName() {
        const storeNameElement = document.querySelector('.index_pickUpStoreName__4lZuR');
        if (storeNameElement) {
            const fullName = storeNameElement.textContent.trim();
            const storeName = normalizeStoreName(fullName);
            console.log('提取到店铺名称:', storeName);
            return storeName;
        }
        return '';
    }

    // v5.4.0: 提取详情页当前显示的店铺名称
    function extractDetailPageCurrentStore() {
        const storeInfo = document.querySelector('.index_storeInfo__G9rTP');
        if (storeInfo) {
            const text = storeInfo.textContent.trim();
            // 可能的格式: "門店：XXX" 或直接是店铺名
            const storeName = normalizeStoreName(text);
            console.log('详情页当前店铺:', storeName);
            return storeName;
        }
        return '';
    }

    async function navigateToOrderPage(targetStoreName) {
        try {
            addLog(`开始跳转到店铺: ${targetStoreName}`);

            // 1. 打开店铺选择器
            addLog(`1. 打开店铺选择器`);
            const storeInfo = document.querySelector('.index_storeInfo__G9rTP');
            if (!storeInfo) {
                addLog(`✗ 未找到店铺选择器`, true);
                return;
            }
            storeInfo.click();
            await waitForElement('.ant-modal-content', 5000);

            // 2. 查找并选择目标店铺
            addLog(`2. 查找店铺: ${targetStoreName}`);
            const storeItems = document.querySelectorAll('.index_storeListItem__IF8Cz');
            let targetFound = false;

            for (let i = 0; i < storeItems.length; i++) {
                const nameElement = storeItems[i].querySelector('.index_name__BHfG4');
                if (nameElement) {
                    const storeName = normalizeStoreName(nameElement.textContent.trim());
                    if (storeName === targetStoreName) {
                        addLog(`✓ 找到店铺，点击选择`);
                        storeItems[i].click();
                        targetFound = true;
                        break;
                    }
                }
            }

            if (!targetFound) {
                addLog(`✗ 未找到店铺: ${targetStoreName}`, true);
                const closeBtn = document.querySelector('.ant-modal-close');
                if (closeBtn) closeBtn.click();
                return;
            }

            // 等待弹窗关闭
            await waitForElementDisappear('.ant-modal-content', 5000);

            // 3. 等待页面加载
            addLog(`3. 等待页面加载`);
            await waitForCartPageLoad();

            // 4. 勾选全选按钮
            addLog(`4. 勾选全选按钮`);
            const selectAllSuccess = await checkSelectAllButton();
            if (!selectAllSuccess) {
                addLog(`⚠️ 全选失败，可能无货`);
            }

            // 5. 点击确认并支付
            addLog(`5. 点击确认并支付`);
            const checkoutButton = document.querySelector('.index_checkout__V9YPC');
            if (checkoutButton) {
                checkoutButton.click();
                addLog(`✓ 已点击确认并支付，等待跳转...`);

                // 等待跳转到订单页面
                await waitForPaymentPageLoad();
                addLog(`✓ 已到达订单页面`);

                // 跳转后提取店铺名称并验证
                setTimeout(async () => {
                    order_currentStoreName = await waitForStoreElement(5000);
                    if (order_currentStoreName) {
                        addLog(`当前店铺: ${order_currentStoreName}`);
                        if (order_currentStoreName !== targetStoreName) {
                            addLog(`⚠️ 店铺不匹配，不在所选店铺中`, true);
                            addLog(`分配: ${targetStoreName}, 实际: ${order_currentStoreName}`);
                        } else {
                            addLog(`✓ 店铺匹配成功!`);
                        }
                        updateStoreNameDisplay();
                        if (isCollapsed) updateCollapsedInfo();
                    }
                }, 2000);
            } else {
                addLog(`✗ 未找到确认并支付按钮`, true);
            }

        } catch (error) {
            console.error('跳转到订单页面出错:', error);
            addLog(`✗ 跳转失败: ${error.message}`, true);
        }
    }

    async function waitForPaymentPageLoad() {
        // 等待订单页面加载元素出现
        await waitForElement('.index_loading__PKvd1', 10000);
        // 等待加载元素消失
        await waitForElementDisappear('.index_loading__PKvd1', 10000);
    }

    function updateStoreNameDisplay() {
        const storeNameElement = document.getElementById('current-store-name');
        if (storeNameElement) {
            storeNameElement.textContent = order_currentStoreName || '未检测到';
        }
    }

    function updateOrderTimeDisplay() {
        const beijingTime = getServerTimeFromPage();
        const timeString = beijingTime.toTimeString().substring(0, 8) + '.' + String(beijingTime.getMilliseconds()).padStart(3, '0');
        const currentTimeElement = document.getElementById('order-current-time');
        if (currentTimeElement) {
            currentTimeElement.textContent = timeString;
        }
        const scheduledTimeElement = document.getElementById('order-scheduled-time');
        if (scheduledTimeElement) {
            scheduledTimeElement.textContent =
                `${String(order_scheduledTime.hour).padStart(2, '0')}:${String(order_scheduledTime.minute).padStart(2, '0')}:${String(order_scheduledTime.second).padStart(2, '0')}.${String(order_scheduledTime.millisecond).padStart(3, '0')}`;
        }
    }

    function updateTimeDisplay() {
        if (currentMode === 'monitor') {
            updateMonitorTimeDisplay();
        } else {
            updateOrderTimeDisplay();
        }
    }

    // ==================== API拦截器 (v5.0) ====================
    function setupApiInterceptor() {
        console.log('设置API拦截器...');

        // 拦截 fetch
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function (...args) {
            const [url, options] = args;

            // 拦截购物车API
            if (typeof url === 'string' && url.includes('/store/v1/store/cart/listByStore')) {
                const response = await originalFetch.apply(this, args);
                const clonedResponse = response.clone();

                try {
                    const data = await clonedResponse.json();

                    // 解析并存储
                    const hasStock = data.data?.hasStock === true;
                    const reason = data.data?.reason || '';

                    latestCartApiResponse = {
                        hasStock,
                        reason,
                        timestamp: Date.now(),
                        fullData: data
                    };

                    console.log('[API拦截] 购物车检测:', { hasStock, reason });

                    // 触发所有等待的Promise
                    cartApiResponseResolvers.forEach(resolve => resolve(latestCartApiResponse));
                    cartApiResponseResolvers = [];

                } catch (e) {
                    console.error('[API拦截] 解析购物车API失败:', e);
                }

                return response;
            }

            // 拦截商品详情API
            if (typeof url === 'string' && url.includes('/store/v1/store/product/detail')) {
                const response = await originalFetch.apply(this, args);
                const clonedResponse = response.clone();

                try {
                    const data = await clonedResponse.json();

                    // ✅ 使用到店13的判断逻辑
                    const isAvailableInTheStore = data.data?.isAvailableInTheStore || false;
                    const isSoldOut = data.data?.isSoldOut || false;
                    const skus = data.data?.skus || [];
                    const onlineStock = skus.length > 0 && skus[0].stock ? skus[0].stock.onlineStock : 0;

                    // 综合判断：店铺有货 且 未售罄 且 有库存
                    const hasStock = isAvailableInTheStore && !isSoldOut && onlineStock > 0;

                    latestProductApiResponse = {
                        hasStock,
                        stock: onlineStock,
                        isAvailableInTheStore,
                        isSoldOut,
                        timestamp: Date.now(),
                        fullData: data
                    };

                    console.log('[API拦截] 商品详情:', {
                        hasStock,
                        isAvailableInTheStore,
                        isSoldOut,
                        onlineStock
                    });

                    // 触发所有等待的Promise
                    productApiResponseResolvers.forEach(resolve => resolve(latestProductApiResponse));
                    productApiResponseResolvers = [];

                } catch (e) {
                    console.error('[API拦截] 解析商品详情API失败:', e);
                }

                return response;
            }

            // 拦截加购API
            if (typeof url === 'string' && url.includes('/store/v1/store/cart/add')) {
                const response = await originalFetch.apply(this, args);
                const clonedResponse = response.clone();

                try {
                    const data = await clonedResponse.json();

                    const success = data.data?.success === true;
                    const message = data.message || '';

                    latestCartAddApiResponse = {
                        success,
                        message,
                        timestamp: Date.now(),
                        fullData: data
                    };

                    console.log('[API拦截] 加购结果:', { success, message });

                    // 触发所有等待的Promise
                    cartAddApiResponseResolvers.forEach(resolve => resolve(latestCartAddApiResponse));
                    cartAddApiResponseResolvers = [];

                } catch (e) {
                    console.error('[API拦截] 解析加购API失败:', e);
                }

                return response;
            }

            return originalFetch.apply(this, args);
        };

        // 拦截 XMLHttpRequest
        const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalSend = unsafeWindow.XMLHttpRequest.prototype.send;

        unsafeWindow.XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...rest]);
        };

        unsafeWindow.XMLHttpRequest.prototype.send = function (body) {
            const xhr = this;

            // 购物车API
            if (xhr._url && xhr._url.includes('/store/v1/store/cart/listByStore')) {
                xhr.addEventListener('load', function () {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        const hasStock = data.data?.hasStock === true;
                        const reason = data.data?.reason || '';

                        latestCartApiResponse = {
                            hasStock,
                            reason,
                            timestamp: Date.now(),
                            fullData: data
                        };

                        console.log('[XHR拦截] 购物车检测:', { hasStock, reason });

                        cartApiResponseResolvers.forEach(resolve => resolve(latestCartApiResponse));
                        cartApiResponseResolvers = [];
                    } catch (e) {
                        console.error('[XHR拦截] 解析购物车API失败:', e);
                    }
                });
            }

            // 商品详情API
            if (xhr._url && xhr._url.includes('/store/v1/store/product/detail')) {
                xhr.addEventListener('load', function () {
                    try {
                        const data = JSON.parse(xhr.responseText);

                        // ✅ 使用到店13的判断逻辑
                        const isAvailableInTheStore = data.data?.isAvailableInTheStore || false;
                        const isSoldOut = data.data?.isSoldOut || false;
                        const skus = data.data?.skus || [];
                        const onlineStock = skus.length > 0 && skus[0].stock ? skus[0].stock.onlineStock : 0;

                        // 综合判断：店铺有货 且 未售罄 且 有库存
                        const hasStock = isAvailableInTheStore && !isSoldOut && onlineStock > 0;

                        latestProductApiResponse = {
                            hasStock,
                            stock: onlineStock,
                            isAvailableInTheStore,
                            isSoldOut,
                            timestamp: Date.now(),
                            fullData: data
                        };

                        console.log('[XHR拦截] 商品详情:', {
                            hasStock,
                            isAvailableInTheStore,
                            isSoldOut,
                            onlineStock
                        });

                        productApiResponseResolvers.forEach(resolve => resolve(latestProductApiResponse));
                        productApiResponseResolvers = [];
                    } catch (e) {
                        console.error('[XHR拦截] 解析商品详情API失败:', e);
                    }
                });
            }

            // 加购API
            if (xhr._url && xhr._url.includes('/store/v1/store/cart/add')) {
                xhr.addEventListener('load', function () {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        const success = data.data?.success === true;
                        const message = data.message || '';

                        latestCartAddApiResponse = {
                            success,
                            message,
                            timestamp: Date.now(),
                            fullData: data
                        };

                        console.log('[XHR拦截] 加购结果:', { success, message });

                        cartAddApiResponseResolvers.forEach(resolve => resolve(latestCartAddApiResponse));
                        cartAddApiResponseResolvers = [];
                    } catch (e) {
                        console.error('[XHR拦截] 解析加购API失败:', e);
                    }
                });
            }

            return originalSend.apply(this, [body]);
        };

        console.log('✓ API拦截器设置完成');
    }

    // 等待API响应的辅助函数
    function waitForCartApiResponse(timeout = 3000) {
        return new Promise((resolve) => {
            // 如果已有最近的响应（500ms内），直接返回
            if (latestCartApiResponse && (Date.now() - latestCartApiResponse.timestamp) < 500) {
                resolve(latestCartApiResponse);
                return;
            }

            // 添加到等待队列
            cartApiResponseResolvers.push(resolve);

            // 超时处理
            setTimeout(() => {
                const index = cartApiResponseResolvers.indexOf(resolve);
                if (index > -1) {
                    cartApiResponseResolvers.splice(index, 1);
                    resolve(null); // 超时返回null
                }
            }, timeout);
        });
    }

    function waitForProductApiResponse(timeout = 3000) {
        return new Promise((resolve) => {
            if (latestProductApiResponse && (Date.now() - latestProductApiResponse.timestamp) < 500) {
                resolve(latestProductApiResponse);
                return;
            }

            productApiResponseResolvers.push(resolve);

            setTimeout(() => {
                const index = productApiResponseResolvers.indexOf(resolve);
                if (index > -1) {
                    productApiResponseResolvers.splice(index, 1);
                    resolve(null);
                }
            }, timeout);
        });
    }

    function waitForCartAddApiResponse(timeout = 5000) {
        return new Promise((resolve) => {
            if (latestCartAddApiResponse && (Date.now() - latestCartAddApiResponse.timestamp) < 500) {
                resolve(latestCartAddApiResponse);
                return;
            }

            cartAddApiResponseResolvers.push(resolve);

            setTimeout(() => {
                const index = cartAddApiResponseResolvers.indexOf(resolve);
                if (index > -1) {
                    cartAddApiResponseResolvers.splice(index, 1);
                    resolve(null);
                }
            }, timeout);
        });
    }

    // ==================== 详情页模式函数 (v5.0) ====================

    // 检测是否在商品详情页
    function isOnProductDetailPage() {
        return document.querySelector('.index_info__XCDmR') !== null ||
            window.location.pathname.includes('/store-pickup/');
    }

    // 提取最大数量
    function extractMaxQuantity() {
        const quantityText = document.querySelector('.index_info__XCDmR');
        if (quantityText) {
            const match = quantityText.textContent.match(/最大\s*(\d+)\s*件/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        return 12; // 默认值
    }

    // 获取当前数量
    function getCurrentQuantity() {
        const input = document.querySelector('.index_countInput__pvaLv');
        return input ? parseInt(input.value) || 1 : 1;
    }

    // 等待值变化
    async function waitForValueChange(input, oldValue, timeout = 100) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            await new Promise(resolve => setTimeout(resolve, 10));
            const newValue = parseInt(input.value);
            if (newValue !== oldValue) {
                return true;
            }
        }
        return false;
    }

    // 点击+号到目标数量（参考到店13）
    async function increaseToTargetQuantity(targetQuantity) {
        console.log(`开始增加数量到 ${targetQuantity}...`);

        let clickCount = 0;
        const maxClicks = targetQuantity - 1; // 假设初始是1

        // ✅ 到店13方式：querySelector + click()
        for (let i = 0; i < maxClicks && i < 50; i++) {
            const buttons = document.querySelectorAll('.index_countButton__R0q92');
            let clicked = false;

            for (let button of buttons) {
                if (!button.classList.contains('index_disableBtn__v3vb5') && button.textContent.trim() === '+') {
                    button.click();
                    clickCount++;
                    console.log(`点击+号 第${clickCount}次`);
                    clicked = true;
                    break;
                }
            }

            if (!clicked) {
                console.warn('未找到+号按钮');
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`数量调整完成，共点击 ${clickCount} 次`);
        return targetQuantity;
    }

    // 点击-号到目标数量（参考到店13）
    async function decreaseToTargetQuantity(targetQuantity) {
        console.log(`开始减少数量到 ${targetQuantity}...`);

        let clickCount = 0;
        const maxClicks = 50; // 最多点击50次

        // ✅ 到店13方式：querySelector + click()
        for (let i = 0; i < maxClicks; i++) {
            const buttons = document.querySelectorAll('.index_countButton__R0q92');
            let clicked = false;

            for (let button of buttons) {
                if (!button.classList.contains('index_disableBtn__v3vb5') && button.textContent.trim() === '-') {
                    button.click();
                    clickCount++;
                    console.log(`点击-号 第${clickCount}次`);
                    clicked = true;
                    break;
                }
            }

            if (!clicked) {
                console.warn('未找到-号按钮');
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`数量调整完成，共点击 ${clickCount} 次`);
        return targetQuantity;
    }

    // 点击加购按钮（简化版：直接点击）
    async function clickAddToCartButton() {
        console.log('点击加购按钮...');
        const btn = document.querySelector('.index_usBtn__UUQYB.index_btnFull__QK9IW');
        if (btn) {
            btn.click();
            console.log('✓ 已点击加购按钮');
            return true;
        }
        console.error('✗ 未找到加购按钮');
        return false;
    }

    // 等待加购结果
    async function waitForAddToCartResult(timeout = 5000) {
        // 清空之前的响应
        latestCartAddApiResponse = null;

        // 等待API响应
        const apiResult = await waitForCartAddApiResponse(timeout);

        if (apiResult) {
            return {
                success: apiResult.success,
                message: apiResult.message
            };
        }

        // API超时，检查DOM
        console.warn('API响应超时，检查DOM...');
        await new Promise(resolve => setTimeout(resolve, 500));

        const notification = document.querySelector('.ant-notification-notice');
        if (notification) {
            const message = notification.textContent;
            // 检查是否成功
            if (message.includes('成功') || message.includes('已加入')) {
                return { success: true, message };
            } else {
                return { success: false, message };
            }
        }

        return { success: false, message: '无法判断加购结果' };
    }

    // 点击查看购物车
    async function clickViewCartButton() {
        // 等待弹窗出现
        await new Promise(resolve => setTimeout(resolve, 500));

        const viewCartBtn = document.querySelector('.index_noticeFooterBtn__3prxm.ant-btn-primary');
        if (viewCartBtn) {
            console.log('点击查看购物车...');
            viewCartBtn.click();
            return true;
        }

        console.error('找不到查看购物车按钮');
        return false;
    }

    // 等待购物车页面加载
    async function waitForCartPageLoad(timeout = 5000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            // 检查URL
            if (window.location.pathname.includes('largeShoppingCart')) {
                // 检查页面元素
                const totalPrice = document.querySelector('.index_totalNum__0lVik');
                if (totalPrice) {
                    console.log('购物车页面加载完成');
                    return true;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.error('购物车页面加载超时');
        return false;
    }

    // 等待到店取标签加载并切换
    async function ensurePickupTab() {
        // 检查是否已经在到店取标签
        if (isPickupTabActive()) {
            console.log('已在到店取标签');
            return true;
        }

        // 切换到到店取
        await switchToPickupTab();
        await new Promise(resolve => setTimeout(resolve, 1000));

        return isPickupTabActive();
    }

    // 全选商品
    async function ensureSelectAll() {
        // 检查总价
        const totalPriceElement = document.querySelector('.index_totalNum__0lVik');
        if (!totalPriceElement) {
            console.error('找不到总价元素');
            return false;
        }

        const priceText = totalPriceElement.textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        if (price > 0) {
            console.log(`商品已选中，总价: ${price}`);
            return true;
        }

        // 价格为0，需要点击全选
        console.log('价格为0，点击全选...');
        const selectAllContainer = document.querySelector('.index_checkboxContainer__nQZ_a');

        if (!selectAllContainer) {
            console.error('找不到全选按钮');
            return false;
        }

        // 重试机制
        for (let i = 0; i < 5; i++) {
            selectAllContainer.click();
            await new Promise(resolve => setTimeout(resolve, 100));

            // 检查价格是否变化
            const newPrice = parseFloat(totalPriceElement.textContent.replace(/[^0-9.]/g, ''));
            if (newPrice > 0) {
                console.log(`全选成功，总价: ${newPrice}`);
                return true;
            }
        }

        console.error('全选失败');
        return false;
    }

    // 点击去结算
    async function clickCheckoutButton() {
        const checkoutBtn = document.querySelector('.index_checkout__V9YPC');
        if (checkoutBtn) {
            console.log('点击去结算...');
            checkoutBtn.click();
            return true;
        }

        console.error('找不到去结算按钮');
        return false;
    }

    // 等待订单页面加载
    async function waitForOrderPageLoad(timeout = 10000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeout) {
            if (window.location.pathname.includes('order-confirmation')) {
                const payBtn = document.querySelector('.index_placeOrderBtn__30ZOe');
                if (payBtn) {
                    console.log('订单页面加载完成');
                    return true;
                }
            }

            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.error('订单页面加载超时');
        return false;
    }

    // v5.4.3: 处理店铺确认弹窗
    async function handleStoreConfirmModal() {
        // 等待弹窗出现
        await new Promise(resolve => setTimeout(resolve, 200));

        // 查找确认弹窗
        const modal = document.querySelector('.ant-modal-content');
        if (!modal) {
            return false;
        }

        // 查找确认按钮(可能是"确认"、"确定"等文本)
        const confirmBtn = modal.querySelector('.ant-btn-primary');
        if (confirmBtn) {
            console.log('检测到确认弹窗,点击确认按钮');
            confirmBtn.click();
            await new Promise(resolve => setTimeout(resolve, 300));
            return true;
        }

        return false;
    }

    // v5.4.3: 处理错误弹窗并自动重试支付
    async function handleErrorModalsAndRetry(maxRetries = 3) {
        let retryCount = 0;

        while (retryCount < maxRetries) {
            // 等待弹窗可能出现
            await new Promise(resolve => setTimeout(resolve, 300));

            // 检测是否有弹窗
            const modal = document.querySelector('.ant-modal-content');
            if (!modal) {
                // 没有弹窗,返回成功
                return { hasError: false, retryCount };
            }

            // 提取弹窗内容
            const modalBody = modal.querySelector('.ant-modal-body');
            const errorMessage = modalBody ? modalBody.textContent.trim() : '';

            console.log(`检测到错误弹窗 (第${retryCount + 1}次): ${errorMessage}`);

            // 关闭弹窗 - 优先点击关闭按钮
            const closeBtn = modal.querySelector('.ant-modal-close');
            if (closeBtn) {
                console.log('点击关闭按钮');
                closeBtn.click();
            } else {
                // 如果没有关闭按钮,点击OK按钮
                const okBtn = modal.querySelector('.ant-btn-primary');
                if (okBtn) {
                    console.log('点击OK按钮');
                    okBtn.click();
                }
            }

            // 等待弹窗关闭
            await new Promise(resolve => setTimeout(resolve, 500));

            // 重新点击支付按钮
            const payBtn = document.querySelector('.index_placeOrderBtn__30ZOe');
            if (payBtn) {
                console.log(`重新点击支付按钮 (第${retryCount + 1}次重试)`);
                payBtn.click();

                // 等待处理
                await new Promise(resolve => setTimeout(resolve, 1000));

                retryCount++;
            } else {
                // 支付按钮消失,可能已成功
                console.log('支付按钮已消失,可能支付成功');
                return { hasError: false, retryCount, reason: '支付按钮消失' };
            }
        }

        // 达到最大重试次数
        return { hasError: true, retryCount, reason: '达到最大重试次数' };
    }

    // v5.4.2: 执行支付流程（优化：添加确认弹窗处理）
    async function executePaymentProcess() {
        console.log('开始支付流程...');

        const payBtn = document.querySelector('.index_placeOrderBtn__30ZOe');
        if (!payBtn) {
            console.error('找不到支付按钮');
            return { success: false, reason: '找不到支付按钮' };
        }

        // 第1次点击支付按钮
        console.log('点击支付按钮（第1次）...');
        payBtn.click();

        // v5.4.2: 立即处理确认弹窗
        const hasModal1 = await handleStoreConfirmModal();
        if (hasModal1) {
            console.log('已处理确认弹窗（第1次点击后）');
        }

        // 检测错误
        await new Promise(resolve => setTimeout(resolve, 500));
        let errorNotification = document.querySelector('.ant-notification-notice');
        if (errorNotification) {
            const errorMsg = errorNotification.textContent;
            console.warn('第1次点击检测到错误:', errorMsg);
            // 移除错误通知
            errorNotification.remove();
        }

        // 检查是否已成功（按钮消失）
        if (!document.querySelector('.index_placeOrderBtn__30ZOe')) {
            console.log('✓ 支付成功！（第1次点击后按钮已消失）');
            return { success: true, reason: '支付成功' };
        }

        // 等待1秒后第2次点击
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 第2次点击支付按钮
        console.log('点击支付按钮（第2次）...');
        const payBtn2 = document.querySelector('.index_placeOrderBtn__30ZOe');
        if (!payBtn2) {
            console.log('✓ 支付成功！（第2次点击前按钮已消失）');
            return { success: true, reason: '支付成功' };
        }
        payBtn2.click();

        // v5.4.2: 再次处理确认弹窗
        const hasModal2 = await handleStoreConfirmModal();
        if (hasModal2) {
            console.log('已处理确认弹窗（第2次点击后）');
        }

        // v5.4.3: 处理错误弹窗并自动重试
        console.log('检测是否有错误弹窗...');
        const retryResult = await handleErrorModalsAndRetry(3);

        if (retryResult.hasError) {
            console.error(`支付失败: ${retryResult.reason} (重试${retryResult.retryCount}次)`);
            return { success: false, reason: retryResult.reason };
        }

        if (retryResult.retryCount > 0) {
            console.log(`经过${retryResult.retryCount}次重试后继续检测...`);
        }

        // 等待2秒检测最终结果
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('等待2秒检测最终结果...');

        // 检查是否有错误提示
        errorNotification = document.querySelector('.ant-notification-notice');
        if (errorNotification) {
            const errorMsg = errorNotification.textContent;
            console.error('支付失败:', errorMsg);
            return { success: false, reason: errorMsg };
        }

        // 最终检查按钮是否消失
        if (!document.querySelector('.index_placeOrderBtn__30ZOe')) {
            console.log('✓ 支付成功！（按钮已消失）');
            return { success: true, reason: '支付成功' };
        }

        // 按钮仍存在，但无错误提示
        console.log('✓ 支付完成（无错误提示）');
        return { success: true, reason: '支付完成' };
    }

    // v5.2.0: 详情页下单流程（不含店铺切换，由主循环统一处理）
    async function executeDetailPageCheckoutFlow() {
        try {
            console.log('========== 开始详情页下单流程 ==========');

            // 1. 等待店铺切换后的loading消失
            console.log('1. 等待店铺切换后的loading消失...');
            await waitForElementDisappear('.index_loadingWrap__3Vucc', 5000);
            await new Promise(resolve => setTimeout(resolve, 300)); // 额外稳定时间

            // 2. 检测有货（使用已有的API数据或等待新数据）
            console.log('2. 检测商品库存...');

            const productApiResult = await waitForProductApiResponse(3000);
            if (!productApiResult || !productApiResult.hasStock) {
                console.log('商品无货');
                return { success: false, reason: '商品无货' };
            }

            console.log('✓ 商品有货');

            // 2. 提取最大数量
            monitor_maxQuantity = extractMaxQuantity();
            console.log(`最大数量: ${monitor_maxQuantity}`);

            // 3. 确定目标数量
            const targetQuantity = monitor_detailQuantityMode === 'max'
                ? monitor_maxQuantity
                : Math.floor(monitor_maxQuantity / 2);

            console.log(`目标数量: ${targetQuantity}`);

            // 4. 调整数量
            const currentQty = getCurrentQuantity();
            if (currentQty < targetQuantity) {
                await increaseToTargetQuantity(targetQuantity);
            } else if (currentQty > targetQuantity) {
                await decreaseToTargetQuantity(targetQuantity);
            }

            // 5. 点击加购
            const clicked = await clickAddToCartButton();
            if (!clicked) {
                return { success: false, reason: '加购按钮点击失败' };
            }

            // 6. 等待加购结果
            const addResult = await waitForAddToCartResult();

            if (!addResult.success) {
                // 加购失败，降级到一半
                const fallbackQuantity = Math.floor(targetQuantity / 2);

                if (fallbackQuantity >= 1) {
                    console.log(`加购${targetQuantity}个失败，降级到${fallbackQuantity}个...`);

                    await decreaseToTargetQuantity(fallbackQuantity);

                    // 再次加购
                    await clickAddToCartButton();
                    const retryResult = await waitForAddToCartResult();

                    if (!retryResult.success) {
                        console.error('降级后仍然失败，视为无货');
                        return { success: false, reason: '库存不足（降级失败）' };
                    }

                    console.log(`✓ 降级成功，已加入${fallbackQuantity}个`);
                } else {
                    return { success: false, reason: '库存不足' };
                }
            } else {
                console.log(`✓ 加购成功：${targetQuantity}个`);
            }

            // 7. 点击查看购物车
            await new Promise(resolve => setTimeout(resolve, 500));
            const viewCartClicked = await clickViewCartButton();
            if (!viewCartClicked) {
                console.warn('未找到查看购物车按钮，尝试直接跳转...');
                window.location.href = 'https://www.popmart.com/hk/largeShoppingCart?origin=pickup';
            }

            // 8. 等待购物车页面
            const cartLoaded = await waitForCartPageLoad();
            if (!cartLoaded) {
                return { success: false, reason: '购物车页面加载失败' };
            }

            // 9. 切换到到店取标签
            await ensurePickupTab();

            // 10. 全选商品
            const selected = await ensureSelectAll();
            if (!selected) {
                return { success: false, reason: '全选商品失败' };
            }

            // 11. 去结算
            const checkoutClicked = await clickCheckoutButton();
            if (!checkoutClicked) {
                return { success: false, reason: '结算按钮点击失败' };
            }

            // 12. 等待订单页面
            const orderLoaded = await waitForOrderPageLoad();
            if (!orderLoaded) {
                return { success: false, reason: '订单页面加载失败' };
            }

            // 13. 执行支付
            const paymentResult = await executePaymentProcess();

            console.log('========== 详情页流程结束 ==========');
            return paymentResult;

        } catch (error) {
            console.error('详情页流程异常:', error);
            return { success: false, reason: '流程异常: ' + error.message };
        }
    }

    // ==================== 初始化 ====================
    async function init() {
        console.log('到店取组合脚本已启动');

        // v5.0: 设置API拦截器
        setupApiInterceptor();

        // 恢复模式
        currentMode = getCurrentMode();

        // 创建UI
        createPanel();

        // 初始化BroadcastChannel
        initBroadcastChannel();

        // 初始化WebSocket连接
        initWebSocket();

        // v5.4.1: 在模式判断之前恢复店铺列表（确保两个模式都能使用）
        const savedStoreList = GM_getValue('popmart_storeList', []);
        if (savedStoreList.length > 0) {
            monitor_ALL_STORES = savedStoreList;
            console.log('✅ 从存储恢复店铺列表:', savedStoreList.length, '家店铺', savedStoreList);
        } else {
            console.warn('⚠️ 店铺列表为空，请点击"同步"按钮获取店铺列表');
        }

        // 根据模式初始化
        if (currentMode === 'monitor') {
            // 监测模式初始化

            // 切换到到店取标签页
            await switchToPickupTab();

            // 更新店铺列表UI（只在监测模式需要）
            if (monitor_ALL_STORES.length > 0) {
                updateStoreList();
                bindStoreCheckboxEvents();
            }

            const savedSchedule = getUserScheduleSettings('monitor');
            monitor_isScheduledEnabled = savedSchedule.enabled;
            monitor_scheduledTime = {
                hour: savedSchedule.hour,
                minute: savedSchedule.minute,
                second: savedSchedule.second,
                millisecond: savedSchedule.millisecond
            };

            const savedMessageMode = GM_getValue('popmart_messageModeSettings', { enabled: true });
            monitor_isMessageModeEnabled = savedMessageMode.enabled;

            // v5.4.0: 恢复刷新间隔
            monitor_refreshInterval = GM_getValue('popmart_refreshInterval', 1000);

            // v5.4.0: 恢复详情模式设置
            const savedDetailMode = GM_getValue('popmart_detailModeSettings', {
                enabled: false,
                quantityMode: 'max',
                maxQuantity: 12
            });
            monitor_isDetailModeEnabled = savedDetailMode.enabled;
            monitor_detailQuantityMode = savedDetailMode.quantityMode;
            monitor_maxQuantity = savedDetailMode.maxQuantity;

            const savedRunning = getUserRunningState('monitor');
            monitor_isRunning = savedRunning;

            updateRunButtonState();
            updateMonitorScheduleUI();
            updateIntervalUI();
            updateMessageModeUI();
            updateTestButtonVisibility();
            updateOrderWindowCountDisplay();
            updateWebSocketButtonUI();

            // v5.4.0: 恢复详情模式UI状态
            const detailModeToggle = document.getElementById('detail-mode-toggle');
            if (detailModeToggle) {
                detailModeToggle.checked = monitor_isDetailModeEnabled;
            }
            const detailModeSection = document.getElementById('detail-mode-section');
            if (detailModeSection) {
                detailModeSection.style.display = monitor_isDetailModeEnabled ? 'block' : 'none';
            }
            // 恢复数量模式选择
            const quantityModeRadio = document.querySelector(`input[name="quantity-mode"][value="${monitor_detailQuantityMode}"]`);
            if (quantityModeRadio) {
                quantityModeRadio.checked = true;
            }
            // 更新数量显示
            updateQuantityDisplay();

            // 定期更新下单窗口数量（每2秒检查一次）
            setInterval(() => {
                if (currentMode === 'monitor') {
                    updateOrderWindowCountDisplay();
                }
            }, 2000);

            if (monitor_isScheduledEnabled) {
                startMonitorScheduleChecker();
            }

            if (monitor_isRunning && monitor_selectedStores.length > 0) {
                setTimeout(runMonitorMainLoop, monitor_refreshInterval);
            }

            // 启动窗口监控相关功能
            startOfflineDetection();
            startSuccessCountdown();

            // v4.0: 启动槽位清理定时器（每10秒检查一次）
            setInterval(() => {
                if (currentMode === 'monitor') {
                    cleanupTimeoutSlots();
                    updateSlotDisplayInMonitor();
                }
            }, 10000);

        } else {
            // 下单模式初始化

            // 提前生成窗口ID（在 BroadcastChannel 监听器绑定后，确保能响应注册请求）
            order_windowId = generateWindowId();
            console.log('下单窗口ID已生成:', order_windowId);

            // 切换到到店取标签页
            await switchToPickupTab();

            // 注册下单窗口到 localStorage
            registerOrderWindow();

            order_currentStoreName = await waitForStoreElement(10000);

            if (order_currentStoreName) {
                console.log('当前店铺:', order_currentStoreName);
                addLog(`当前店铺: ${order_currentStoreName}`);

                // 验证店铺
                registerStore();
                checkStoreInSelectedList();

                if (order_isStoreValid) {
                    addLog('等待购物车信号...');
                } else {
                    addLog('自动功能已禁用,仅支持手动操作', true);
                }
            } else {
                addLog('⚠️ 未检测到店铺信息,请点击同步按钮', true);
            }

            const savedSchedule = getUserScheduleSettings('order');
            order_isScheduledEnabled = savedSchedule.enabled;
            order_scheduledTime = {
                hour: savedSchedule.hour,
                minute: savedSchedule.minute,
                second: savedSchedule.second,
                millisecond: savedSchedule.millisecond
            };

            const savedDuration = getDurationSettings();
            order_durationSeconds = savedDuration.durationSeconds;

            const savedSpeed = getSubmitSpeedSettings();
            order_submitSpeed = savedSpeed.submitSpeed;

            updateStoreNameDisplay();
            updateOrderScheduleUI();
            updateDurationUI();
            updateSpeedUI();

            // 恢复保存的窗口数量
            const savedWindowCount = getWindowCount();
            const windowCountInput = document.getElementById('window-count');
            if (windowCountInput) {
                windowCountInput.value = savedWindowCount;
            }

            // 初始化已注册窗口数量显示
            updateRegisteredWindowsCount();

            // 定期更新已注册窗口数量（每2秒检查一次）
            setInterval(() => {
                if (currentMode === 'order') {
                    updateRegisteredWindowsCount();
                    // v4.0: 更新槽位显示
                    updateAutoSlotDisplay();
                }
            }, 2000);

            if (order_isScheduledEnabled) {
                startOrderScheduleChecker();
            }

            // 初始化手动模式折叠信息
            if (isManualCollapsed) {
                updateManualCollapsedInfo();
            }

            // 定期更新手动模式折叠信息
            setInterval(() => {
                if (isManualCollapsed && order_isScheduledEnabled && !order_isRunning) {
                    updateManualCollapsedInfo();
                }
            }, 100);

            // 定期更新主面板折叠信息（倒计时）
            setInterval(() => {
                if (isCollapsed && order_isScheduledEnabled && !order_isRunning) {
                    updateOrderCollapsedInfo();
                }
            }, 100);

            // 启动状态广播（发送到监测窗口）
            // 启动心跳
            startHeartbeat();
        }

        // 开始时间显示更新
        setInterval(updateTimeDisplay, 100);

        console.log(`初始化完成，当前模式: ${currentMode === 'monitor' ? '监测模式' : '下单模式'}`);
    }

    function updateMonitorScheduleUI() {
        const scheduleToggle = document.getElementById('monitor-schedule-toggle');
        const hourInput = document.getElementById('monitor-schedule-hour');
        const minuteInput = document.getElementById('monitor-schedule-minute');
        const secondInput = document.getElementById('monitor-schedule-second');

        if (scheduleToggle) scheduleToggle.checked = monitor_isScheduledEnabled;
        if (hourInput) hourInput.value = monitor_scheduledTime.hour;
        if (minuteInput) minuteInput.value = monitor_scheduledTime.minute;
        if (secondInput) secondInput.value = monitor_scheduledTime.second;
    }

    function updateMessageModeUI() {
        const messageModeToggle = document.getElementById('message-mode-toggle');
        const runModeStatus = document.getElementById('run-mode-status');
        if (messageModeToggle) messageModeToggle.checked = monitor_isMessageModeEnabled;
        if (runModeStatus) {
            runModeStatus.textContent = monitor_isMessageModeEnabled ? '消息通知' : '自动下单';
        }
    }

    window.addEventListener('load', () => { setTimeout(init, 3000); });
})();
