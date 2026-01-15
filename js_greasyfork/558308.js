// ==UserScript==
// @name         猫猫放置强化助手
// @version      v5.2.5.2
// @description  通过原型链拦截实现功能的强化自动化工具。
// @author       YuoHira
// @license      MIT
// @match        https://www.moyu-idle.com/*
// @match        https://moyu-idle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moyu-idle.com
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @namespace    https://greasyfork.org/users/397156
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      kokdmexaezqaylurjprj.supabase.co
// @connect      *.supabase.co
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/558308/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E5%BC%BA%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/558308/%E7%8C%AB%E7%8C%AB%E6%94%BE%E7%BD%AE%E5%BC%BA%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =================================================================================
    // == 核心：原型链 WebSocket 拦截器 (必须立即执行)
    // =================================================================================
    console.log('🛠️ [强化助手]：准备部署原型链 WebSocket 拦截器。');

    let currentSocket = null;

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        currentSocket = this;
        HandleSendMessage(data);
        return originalSend.apply(this, arguments);
    };

    const onmessageDescriptor = Object.getOwnPropertyDescriptor(WebSocket.prototype, 'onmessage');
    if (onmessageDescriptor) {
        Object.defineProperty(WebSocket.prototype, 'onmessage', {
            ...onmessageDescriptor,
            set: function (callback) {
                const wsInstance = this;
                currentSocket = this;
                const wrappedCallback = (event) => {
                    HandleMessage(event.data, wsInstance);
                    if (typeof callback === 'function') {
                        callback.call(wsInstance, event);
                    }
                };
                onmessageDescriptor.set.call(this, wrappedCallback);
            }
        });
    }

    console.log('✅ [强化助手]：原型链 WebSocket 拦截器已成功部署。');
    // =================================================================================

    // —— 默认配置 ——
    let TARGET_LEVEL = 5;
    let ENHANCE_INTERVAL = 3000;
    let IS_AUTO_ENHANCING = false;
    let enhanceTimer = null;
    let storedEnhanceData = null;
    let currentEnhanceItem = null;
    let DEBUG_MODE = false;
    let WS_DEBUG_MODE = false;
    let AUTO_ENHANCE = false;
    let PROTECT_START_LEVEL = 3;
    let PROTECT_MODE = 'none';
    let BATCH_COUNT = 1;
    let currentBatchCount = 0;
    let waitingForResult = false;
    let enhanceHistory = {};
    let isHistoryPanelOpen = false;
    let currentEnhanceRecordId = null;
    let isContinuedFromHistory = false;
    let lastEnhanceBaseItem = null;
    let ENABLE_HISTORY_RECORDING = true;
    let savedUserName = null;
    let isMinimized = false;

    let enhanceStats = {
        baseItem: '', currentLevel: 0, targetLevel: 0, maxReachedLevel: 0,
        levelStats: {}, totalAttempts: 0, totalSuccess: 0, startTime: null
    };

    const STORAGE_KEYS = {
        POSITION: 'enhanceHelper_position',
        TARGET_LEVEL: 'enhanceHelper_targetLevel',
        INTERVAL: 'enhanceHelper_interval',
        CURRENT_ITEM: 'enhanceHelper_currentItem',
        IS_AUTO_ENHANCING: 'enhanceHelper_isEnhancing',
        STORED_REQUEST: 'enhanceHelper_storedRequest',
        DEBUG_MODE: 'enhanceHelper_debugMode',
        WS_DEBUG_MODE: 'enhanceHelper_wsDebugMode',
        AUTO_ENHANCING: 'enhanceHelper_autoEnhance',
        PROTECT_START_LEVEL: 'enhanceHelper_protectStartLevel',
        PROTECT_MODE: 'enhanceHelper_protectMode',
        IS_MINIMIZED: 'enhanceHelper_isMinimized',
        BATCH_COUNT: 'enhanceHelper_batchCount',
        CURRENT_BATCH_COUNT: 'enhanceHelper_currentBatchCount',
        ENHANCE_HISTORY: 'enhanceHelper_enhanceHistory',
        ENABLE_HISTORY_RECORDING: 'enhanceHelper_enableHistoryRecording',
        USER_NAME: 'enhanceHelper_userName'
    };

    const SUPABASE_CONFIG = {
        url: 'https://kokdmexaezqaylurjprj.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtva2RtZXhhZXpxYXlsdXJqcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzMzNzQsImV4cCI6MjA2Njg0OTM3NH0.fuHqBV4RWd6gHUn-ff3pmsOu6BAdNTmDb_0Eclqz8aM'
    };
    const TABLE_NAME = '弱化之王';

    // —— WS消息处理 ——
    function HandleSendMessage(data) {
        if (WS_DEBUG_MODE) {
            console.log('%c[WS 已发送]', 'color: #03A9F4; font-weight: bold;', data);
        }
        if (isEnhanceRequest(data)) {
            const enhanceData = parseEnhanceData(data);
            if (enhanceData && enhanceData.fullPayload) {
                storedEnhanceData = enhanceData.fullPayload;
                saveStoredRequest();
                if (document.getElementById('enhanceHelperPanel')) updateProtectDisplay();
                if (enhanceData.user && !savedUserName) {
                    const userName = (enhanceData.user && enhanceData.user.name) ? enhanceData.user.name : enhanceData.user;
                    if (typeof userName === 'string') {
                        savedUserName = userName;
                        saveConfig();
                    }
                }
            }
        }
    }

    function HandleMessage(messageData, ws) {
        if (messageData instanceof ArrayBuffer) {
            try {
                const format = detectCompression(messageData);
                const text = pako.inflate(new Uint8Array(messageData), { to: 'string' });
                if (WS_DEBUG_MODE) {
                    try {
                        const parsed = JSON.parse(text);
                        console.log('%c[WS 已接收]', 'color: #4CAF50; font-weight: bold;', `(已解压 ${format})`, parsed);
                    } catch {
                        console.log('%c[WS 已接收]', 'color: #4CAF50; font-weight: bold;', `(已解压 ${format}, 非JSON)`, text);
                    }
                }

                const noFoundMsg = parseEnhanceNoFoundResult(text);
                if (IS_AUTO_ENHANCING) {
                    if (noFoundMsg === '背包中没有该装备，无法强化') {
                        if (DEBUG_MODE) console.warn(`[强化助手] 物品 ${currentEnhanceItem.resourceId} 耗尽，正在寻找下一件...`);
                        const nextItem = findNextItemToEnhance();
                        if (nextItem) {
                            if (DEBUG_MODE) console.log(`[强化助手] 找到下一件: ${nextItem.resourceId}`);
                            currentEnhanceItem = nextItem;
                            saveCurrentItem();
                            updateItemDisplay(currentEnhanceItem, '自动切换物品');
                            updateMinimizedDisplay();
                            if (enhanceTimer) clearTimeout(enhanceTimer);
                            enhanceTimer = setTimeout(() => sendEnhanceRequest(ws), ENHANCE_INTERVAL);
                        } else {
                            if (DEBUG_MODE) console.error('[强化助手] 找不到任何可用的同类物品，停止强化。');
                            stopAutoEnhance(true);
                        }
                        return;
                    } else if (noFoundMsg === '操作过于频繁，请稍后再试') {
                        if (DEBUG_MODE) console.warn(`[强化助手] 物品 ${currentEnhanceItem.resourceId} 强化失败，重新尝试...`);
                        if (enhanceTimer) clearTimeout(enhanceTimer);
                        enhanceTimer = setTimeout(() => sendEnhanceRequest(ws), ENHANCE_INTERVAL);
                        return;
                    }
                }


                const enhanceResult = parseEnhanceResult(text);
                if (enhanceResult) {
                    if (DEBUG_MODE) console.log('✨[强化助手] 拦截到结果', enhanceResult);
                    setTimeout(() => handleEnhanceResult(enhanceResult), 50);
                }
            } catch (err) {
                if (WS_DEBUG_MODE) console.error('[WS] 消息解压失败', err);
            }
        } else {
            if (WS_DEBUG_MODE) {
                console.log('%c[WS 已接收]', 'color: #4CAF50; font-weight: bold;', '(纯文本)', messageData);
            }
        }
    }

    function detectCompression(buf) {
        const b = new Uint8Array(buf);
        if (b.length < 2) return 'deflate';
        if (b[0] === 0x1f && b[1] === 0x8b) return 'gzip';
        if (b[0] === 0x78 && (((b[0] << 8) | b[1]) % 31) === 0) return 'zlib';
        return 'deflate';
    }

    function loadConfig() {
        TARGET_LEVEL = parseInt(localStorage.getItem(STORAGE_KEYS.TARGET_LEVEL), 10) || 5;
        ENHANCE_INTERVAL = parseInt(localStorage.getItem(STORAGE_KEYS.INTERVAL), 10) || 3000;
        IS_AUTO_ENHANCING = localStorage.getItem(STORAGE_KEYS.IS_AUTO_ENHANCING) === 'true';
        DEBUG_MODE = localStorage.getItem(STORAGE_KEYS.DEBUG_MODE) === 'true';
        WS_DEBUG_MODE = localStorage.getItem(STORAGE_KEYS.WS_DEBUG_MODE) === 'true';
        AUTO_ENHANCE = localStorage.getItem(STORAGE_KEYS.AUTO_ENHANCE) === 'true';
        PROTECT_START_LEVEL = parseInt(localStorage.getItem(STORAGE_KEYS.PROTECT_START_LEVEL), 10) || 3;
        PROTECT_MODE = localStorage.getItem(STORAGE_KEYS.PROTECT_MODE) || 'none';
        isMinimized = localStorage.getItem(STORAGE_KEYS.IS_MINIMIZED) === 'true';
        BATCH_COUNT = parseInt(localStorage.getItem(STORAGE_KEYS.BATCH_COUNT), 10) || 1;
        currentBatchCount = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_BATCH_COUNT), 10) || 0;
        ENABLE_HISTORY_RECORDING = localStorage.getItem(STORAGE_KEYS.ENABLE_HISTORY_RECORDING) !== 'false';
        savedUserName = localStorage.getItem(STORAGE_KEYS.USER_NAME) || null;

        const savedCurrentItem = localStorage.getItem(STORAGE_KEYS.CURRENT_ITEM);
        if (savedCurrentItem) try {
            currentEnhanceItem = JSON.parse(savedCurrentItem);
        } catch (e) {
            currentEnhanceItem = null;
        }
        const savedStoredRequest = localStorage.getItem(STORAGE_KEYS.STORED_REQUEST);
        if (savedStoredRequest) try {
            storedEnhanceData = JSON.parse(savedStoredRequest);
        } catch (e) {
            storedEnhanceData = null;
        }
        const savedEnhanceHistory = localStorage.getItem(STORAGE_KEYS.ENHANCE_HISTORY);
        if (savedEnhanceHistory) try {
            enhanceHistory = JSON.parse(savedEnhanceHistory);
        } catch (e) {
            enhanceHistory = {};
        }
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEYS.TARGET_LEVEL, TARGET_LEVEL);
        localStorage.setItem(STORAGE_KEYS.INTERVAL, ENHANCE_INTERVAL);
        localStorage.setItem(STORAGE_KEYS.IS_AUTO_ENHANCING, IS_AUTO_ENHANCING);
        localStorage.setItem(STORAGE_KEYS.DEBUG_MODE, DEBUG_MODE);
        localStorage.setItem(STORAGE_KEYS.WS_DEBUG_MODE, WS_DEBUG_MODE);
        localStorage.setItem(STORAGE_KEYS.AUTO_ENHANCE, AUTO_ENHANCE);
        localStorage.setItem(STORAGE_KEYS.PROTECT_START_LEVEL, PROTECT_START_LEVEL);
        localStorage.setItem(STORAGE_KEYS.PROTECT_MODE, PROTECT_MODE);
        localStorage.setItem(STORAGE_KEYS.IS_MINIMIZED, isMinimized);
        localStorage.setItem(STORAGE_KEYS.BATCH_COUNT, BATCH_COUNT);
        localStorage.setItem(STORAGE_KEYS.CURRENT_BATCH_COUNT, currentBatchCount);
        localStorage.setItem(STORAGE_KEYS.ENABLE_HISTORY_RECORDING, ENABLE_HISTORY_RECORDING);
        if (savedUserName) localStorage.setItem(STORAGE_KEYS.USER_NAME, savedUserName);
    }

    function saveEnhanceHistory() {
        localStorage.setItem(STORAGE_KEYS.ENHANCE_HISTORY, JSON.stringify(enhanceHistory));
    }

    function generateEnhanceRecordId() {
        return `${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
    }

    function saveCurrentItem() {
        if (currentEnhanceItem) localStorage.setItem(STORAGE_KEYS.CURRENT_ITEM, JSON.stringify(currentEnhanceItem)); else localStorage.removeItem(STORAGE_KEYS.CURRENT_ITEM);
    }

    function saveStoredRequest() {
        if (storedEnhanceData) localStorage.setItem(STORAGE_KEYS.STORED_REQUEST, JSON.stringify(storedEnhanceData)); else localStorage.removeItem(STORAGE_KEYS.STORED_REQUEST);
    }

    function constrainPosition(x, y) {
        const winW = window.innerWidth, winH = window.innerHeight, minVisible = 50;
        x = Math.max(-20, Math.min(x, winW - minVisible));
        y = Math.max(0, Math.min(y, winH - minVisible));
        return { x, y };
    }

    // —— 拖拽逻辑 ——
    function makeDraggable(el) {
        let isDown = false, offsetX = 0, offsetY = 0, hasMoved = false;
        el.addEventListener('mousedown', e => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            isDown = true;
            hasMoved = false;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
        });
        document.addEventListener('mousemove', e => {
            if (!isDown) return;
            hasMoved = true;
            window.innerWidth
            const newX = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - 40));
            const newY = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - 40));
            el.style.left = newX + 'px';
            el.style.top = newY + 'px';
            el.style.right = 'auto'; // 拖拽时清除right定位
        });
        document.addEventListener('mouseup', () => {
            if (isDown && hasMoved) {
                // 只有真正拖拽过才应用边界检查
                setTimeout(() => {
                    const rect = el.getBoundingClientRect();
                    const rightDistance = window.innerWidth - rect.right;
                    const topDistance = rect.top;

                    // 保存并应用边界约束后的位置
                    const constrained = constrainPosition(rightDistance, topDistance);
                    savePosition(constrained.x, constrained.y);

                    // 重新设置为right定位
                    el.style.right = constrained.x + 'px';
                    el.style.top = constrained.y + 'px';
                    el.style.left = 'auto';
                }, 0); // 使用setTimeout避免干扰点击事件
            }
            isDown = false;
            hasMoved = false;
        });
    }

    function savePosition(x, y) {
        localStorage.setItem(STORAGE_KEYS.POSITION, JSON.stringify(constrainPosition(x, y)));
    }

    function loadPosition() {
        const saved = localStorage.getItem(STORAGE_KEYS.POSITION);
        if (saved) try {
            return JSON.parse(saved);
        } catch (e) {
        }
        return { x: 20, y: 20 };
    }

    function isEnhanceRequest(data) {
        return typeof data === 'string' && data.includes('enhance:require');
    }

    function parseEnhanceData(data) {
        try {
            const match = data.match(/\["enhance:require",(.+)\]/);
            if (match) {
                const payload = JSON.parse(match[1]);
                if (payload.data && payload.data.resourceId) return {
                    resourceId: payload.data.resourceId,
                    protectedResourceId: payload.data.protectedResourceId,
                    user: payload.user,
                    fullPayload: payload
                };
            }
        } catch (e) {
        }
        return null;
    }

    function parseEnhanceResult(text) {
        try {
            const data = JSON.parse(text);
            if (data.data?.hasOwnProperty('success') && data.data.enhanceResultId) return {
                success: data.data.success,
                message: data.data.msg,
                resultId: data.data.enhanceResultId,
                user: data.user?.name
            };
        } catch (e) {
        }
        return null;
    }

    function parseEnhanceNoFoundResult(text) {
        try {
            const data = JSON.parse(text);
            return data.data?.msg;
        } catch (e) {
        }
        return null;
    }

    function parseItemLevel(itemId) {
        const match = itemId.match(/(.+?)\+(\d+)$/);
        return match ? { baseItem: match[1], level: parseInt(match[2], 10) } : { baseItem: itemId, level: 0 };
    }

    function translateItemId(itemId) {
        if (!itemId) return itemId;
        const itemInfo = parseItemLevel(itemId);
        const tAllGameResource = loadOrSyncAllGameResource();
        const name = tAllGameResource?.[itemInfo.baseItem]?.name || itemInfo.baseItem;
        return itemInfo.level > 0 ? `${name}+${itemInfo.level}` : name;
    }

    function loadOrSyncAllGameResource() {
        let tAllGameResource = unsafeWindow?.tAllGameResource;
        if (tAllGameResource) {
            GM_setValue('tAllGameResource', tAllGameResource);
            return tAllGameResource
        }

        console.log('未获得物品信息，尝试从存储加载...');
        return GM_getValue('tAllGameResource', {});
    }

    function initStats(itemId, targetLevel, inheritRecordId = null) {
        const parsed = parseItemLevel(itemId);
        currentEnhanceRecordId = inheritRecordId || generateEnhanceRecordId();
        enhanceStats = {
            baseItem: parsed.baseItem,
            startLevel: parsed.level,
            currentLevel: parsed.level,
            targetLevel: targetLevel,
            maxReachedLevel: parsed.level,
            levelStats: {},
            totalAttempts: 0,
            totalSuccess: 0,
            startTime: Date.now(),
            sessionId: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            recordId: currentEnhanceRecordId
        };
        for (let i = parsed.level; i < targetLevel; i++) {
            enhanceStats.levelStats[i] = { attempts: 0, success: 0 };
        }
    }

    function updateStats(result) {
        const resultItem = parseItemLevel(result.resultId);
        const attemptLevel = enhanceStats.currentLevel;
        if (!enhanceStats.levelStats[attemptLevel]) enhanceStats.levelStats[attemptLevel] = { attempts: 0, success: 0 };
        const levelStats = enhanceStats.levelStats[attemptLevel];
        levelStats.attempts++;
        enhanceStats.totalAttempts++;
        if (result.success) {
            levelStats.success++;
            enhanceStats.totalSuccess++;
        }
        enhanceStats.currentLevel = resultItem.level;
        if (resultItem.level > enhanceStats.maxReachedLevel) enhanceStats.maxReachedLevel = resultItem.level;
        if (document.getElementById('enhanceHelperPanel')) updateStatsDisplay();
    }

    function saveCurrentSessionToHistory() {
        if (!ENABLE_HISTORY_RECORDING || !enhanceStats.baseItem) return;
        const baseItem = enhanceStats.baseItem;
        if (!enhanceHistory[baseItem]) enhanceHistory[baseItem] = { sessions: [] };
        const historyEntry = {
            sessionId: enhanceStats.sessionId,
            recordId: enhanceStats.recordId,
            startLevel: enhanceStats.startLevel,
            endLevel: enhanceStats.currentLevel,
            targetLevel: enhanceStats.targetLevel,
            maxReachedLevel: enhanceStats.maxReachedLevel,
            levelStats: JSON.parse(JSON.stringify(enhanceStats.levelStats)),
            totalAttempts: enhanceStats.totalAttempts,
            totalSuccess: enhanceStats.totalSuccess,
            startTime: enhanceStats.startTime,
            endTime: Date.now(),
            completed: enhanceStats.currentLevel >= enhanceStats.targetLevel
        };
        const existingIndex = enhanceHistory[baseItem].sessions.findIndex(s => s.recordId === enhanceStats.recordId);
        if (existingIndex >= 0) {
            historyEntry.startTime = enhanceHistory[baseItem].sessions[existingIndex].startTime;
            enhanceHistory[baseItem].sessions[existingIndex] = historyEntry;
        } else {
            enhanceHistory[baseItem].sessions.push(historyEntry);
        }
        saveEnhanceHistory();
    }

    function stopAutoEnhance(isFinished = false) {
        if (enhanceTimer) {
            clearTimeout(enhanceTimer);
            enhanceTimer = null;
        }
        waitingForResult = false;
        IS_AUTO_ENHANCING = false;
        saveConfig();
        if (enhanceStats.baseItem) {
            saveCurrentSessionToHistory();
            lastEnhanceBaseItem = enhanceStats.baseItem;
        }
        updateItemDisplay(currentEnhanceItem, isFinished ? '批量完成' : '已停止');
        updateToggleButtonState();
        updateMinimizedDisplay();
        if (isFinished) {
            isContinuedFromHistory = false;
            lastEnhanceBaseItem = null;
        }
    }

    function sendEnhanceRequest(ws) {
        const batchInput = document.getElementById('enhanceHelper_batchCountInput');
        if (!IS_AUTO_ENHANCING || !ws || ws.readyState !== WebSocket.OPEN || !currentEnhanceItem || !storedEnhanceData || !batchInput) return;

        // --- 目标达成逻辑 ---
        if (enhanceStats.currentLevel >= enhanceStats.targetLevel) {
            if (DEBUG_MODE) console.log(`[强化助手] 目标 +${enhanceStats.targetLevel} 已达成！`);
            saveCurrentSessionToHistory();
            const currentInputValue = parseInt(batchInput.value, 10);
            if (currentInputValue > 1) {
                if (DEBUG_MODE) console.log(`[强化助手] 剩余批量次数: ${currentInputValue - 1}。准备下一件。`);
                batchInput.value = currentInputValue - 1;
                saveConfig();
                const baseItemId = parseItemLevel(storedEnhanceData.data.resourceId).baseItem;
                const nextItem = { resourceId: baseItemId, user: storedEnhanceData.user };
                currentEnhanceItem = nextItem;
                saveCurrentItem();
                initStats(nextItem.resourceId, TARGET_LEVEL);
                updateStatsDisplay();
                updateItemDisplay(currentEnhanceItem, `批量剩余: ${currentInputValue - 1}`);
                updateMinimizedDisplay();
                enhanceTimer = setTimeout(() => sendEnhanceRequest(ws), ENHANCE_INTERVAL);
            } else {
                if (DEBUG_MODE) console.log('[强化助手] 所有批量任务已完成。');
                stopAutoEnhance(true);
            }
            return;
        }

        // --- 正常发送强化请求 ---
        const requestData = { user: storedEnhanceData.user, data: { resourceId: currentEnhanceItem.resourceId } };
        if (enhanceStats.currentLevel >= PROTECT_START_LEVEL && PROTECT_MODE !== 'none') {
            if (PROTECT_MODE === 'essence') {
                requestData.data.protectedResourceId = 'starEssence';
            } else if (PROTECT_MODE === 'item') {
                const info = parseItemLevel(currentEnhanceItem.resourceId);
                const protectLevel = Math.max(0, info.level - 4);
                requestData.data.protectedResourceId = protectLevel > 0 ? `${info.baseItem}+${protectLevel}` : info.baseItem;
            }
        }
        const enhanceRequest = `42["enhance:require",${JSON.stringify(requestData)}]`;
        waitingForResult = true;
        ws.send(enhanceRequest);
    }

    function handleEnhanceResult(result) {
        try {
            waitingForResult = false;
            const resultItemInfo = parseItemLevel(result.resultId);
            const resultBaseItem = resultItemInfo.baseItem;
            let shouldSmartContinue = !IS_AUTO_ENHANCING && lastEnhanceBaseItem && resultBaseItem === lastEnhanceBaseItem;
            if (shouldSmartContinue) isContinuedFromHistory = true;
            currentEnhanceItem = { resourceId: result.resultId, user: result.user };
            saveCurrentItem();
            if (result.user && !savedUserName) {
                savedUserName = result.user;
                saveConfig();
            }
            updateItemDisplay(currentEnhanceItem);
            if (IS_AUTO_ENHANCING || shouldSmartContinue || (!IS_AUTO_ENHANCING && enhanceStats.baseItem === resultBaseItem)) {
                updateStats(result);
                saveCurrentSessionToHistory();
            }
            if (IS_AUTO_ENHANCING) {
                enhanceTimer = setTimeout(() => sendEnhanceRequest(currentSocket), ENHANCE_INTERVAL);
            }
        } catch (error) {
            waitingForResult = false;
        }
    }

    function findNextItemToEnhance() {
        if (!storedEnhanceData?.data?.resourceId || !currentEnhanceItem) return null;
        const baseItemId = parseItemLevel(storedEnhanceData.data.resourceId).baseItem;
        const failedLevel = parseItemLevel(currentEnhanceItem.resourceId).level;
        for (let level = failedLevel - 1; level >= 0; level--) {
            const nextItemId = (level > 0) ? `${baseItemId}+${level}` : baseItemId;
            return { resourceId: nextItemId, user: storedEnhanceData.user };
        }
        return null;
    }

    function checkPermissions() {
        return typeof GM_xmlhttpRequest !== 'undefined';
    }
    // 定义初始化函数
    function initScript() {
        loadConfig();
        createUIPanel();
        initializeUIState();
        if (DEBUG_MODE) console.log('🐛 [强化助手] 调试模式已启用。');
        const btn = document.getElementById('enhanceHelper_toggleBtn');
        btn.innerText.includes('停止') ? Toggle() : '';
    }
    // 等待页面加载完成
    window.addEventListener('load', function () {
        setTimeout(() => {
            initScript()
        }, 3000);
    })

    function createUIPanel() {
        const panel = document.createElement('div');
        panel.id = 'enhanceHelperPanel';
        const savedPos = loadPosition();
        panel.style.cssText = `position: fixed; top: ${savedPos.y}px; right: ${savedPos.x}px; width: 480px; padding: 12px; background: rgba(25,35,45,0.95); color: #fff; font-family: 'Consolas', monospace; font-size: 12px; border-radius: 10px; z-index: 9999; cursor: move; border: 1px solid rgba(100,200,255,0.3); box-shadow: 0 6px 25px rgba(0,0,0,0.4); backdrop-filter: blur(5px);`;
        panel.innerHTML = `
        <div id="enhanceHelper_titleBar" style="cursor: default; margin-bottom:10px; font-weight:bold; color:#64B5F6; display:flex; align-items:center;">
          <span>🛠️ 强化助手</span>
          <div style="margin-left:auto; display:flex; align-items:center; gap:6px;">
            <button id="enhanceHelper_minimizeBtn" style="padding:2px 6px; background:rgba(100,200,255,0.2); border:none; border-radius:3px; color:#64B5F6; cursor:pointer; font-size:10px;">📌</button>
            <div style="font-size:10px; color:#888;">v5.2.3</div>
          </div>
        </div>
        <div id="enhanceHelper_minimizedBar" style="display:none; background:rgba(0,0,0,0.5); padding:6px 8px; border-radius:6px; font-size:11px; color:#FFA726; align-items:center; justify-content:space-between;">
          <div id="enhanceHelper_minimizedStatus"></div>
          <button id="enhanceHelper_expandBtn" style="padding:2px 6px; background:rgba(100,200,255,0.2); border:none; border-radius:3px; color:#64B5F6; cursor:pointer; font-size:10px; margin-left:8px;">📋</button>
        </div>
        <div id="enhanceHelper_mainContent">
          <div style="display: flex; gap: 12px;">
            <div style="flex: 1; min-width: 220px;">
              <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; margin-bottom:8px;">
                <div style="font-size:10px; color:#aaa; margin-bottom:4px;">目标物品:</div>
                <div id="enhanceHelper_itemDisplay" style="color:#FFA726; font-weight:bold; min-height:16px;">等待强化结果...</div>
                <div id="enhanceHelper_protectMaterialDisplay" style="font-size:9px; color:#81C784; margin-top:4px; min-height:12px;"></div>
              </div>
              <div style="display:flex; gap:8px; margin-bottom:8px;">
                <label style="flex:1;">目标等级:<input id="enhanceHelper_targetInput" type="number" min="1" max="15" style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;"></label>
                <label style="flex:1;">间隔(ms):<input id="enhanceHelper_intervalInput" type="number" min="100" style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;"></label>
              </div>
              <div style="display:flex; gap:8px; margin-bottom:8px;">
                <label style="flex:1;">批量次数:<input id="enhanceHelper_batchCountInput" type="number" min="1" title="连续强化多少个物品到目标等级" style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;"></label>
                <div style="flex:1; font-size:10px; color:#aaa; padding-top:18px;"><div style="font-size:9px; color:#666;">1=单次强化</div></div>
              </div>
              <div style="margin-bottom:8px;">
                <div style="font-size:10px; color:#aaa; margin-bottom:4px;">保护设置:</div>
                <div style="display:flex; gap:2px; margin-bottom:6px;">
                  <button id="enhanceHelper_protectModeNone" class="protect-mode-btn" data-mode="none">不使用</button>
                  <button id="enhanceHelper_protectModeItem" class="protect-mode-btn" data-mode="item">使用物品</button>
                  <button id="enhanceHelper_protectModeEssence" class="protect-mode-btn" data-mode="essence">使用精华</button>
                </div>
                <div style="display:flex; gap:8px;">
                  <label style="flex:1;">保护等级:<input id="enhanceHelper_protectStartLevelInput" type="number" min="0" max="15" title="从几级开始使用保护材料 (0=不使用)" style="width:100%; padding:4px; border-radius:4px; border:none; background:rgba(255,255,255,0.1); color:#fff; margin-top:2px;"></label>
                  <div style="flex:1; font-size:10px; color:#aaa; padding-top:18px;"><div id="enhanceHelper_protectLevelHint"></div><div style="font-size:9px; color:#666;">0=不使用保护</div></div>
                </div>
              </div>
              <div style="margin-bottom:8px;">
                 <label style="display:flex; align-items:center; font-size:11px; color:#aaa; cursor:pointer; margin-bottom:4px;"><input id="enhanceHelper_enableHistoryCheckbox" type="checkbox" style="margin-right:6px; transform:scale(0.9);"><span>📚 启用历史记录</span></label>
                 <label style="display:flex; align-items:center; font-size:11px; color:#aaa; cursor:pointer; margin-bottom:4px;"><input id="enhanceHelper_debugModeCheckbox" type="checkbox" style="margin-right:6px; transform:scale(0.9);"><span>🐛 调试模式</span></label>
                 <label style="display:flex; align-items:center; font-size:11px; color:#aaa; cursor:pointer;"><input id="enhanceHelper_wsDebugModeCheckbox" type="checkbox" style="margin-right:6px; transform:scale(0.9);"><span>📡 WS调试</span></label>
              </div>
              <button id="enhanceHelper_toggleBtn" style="width:100%; padding:10px; background:linear-gradient(45deg, #4CAF50, #45a049); color:white; border:none; border-radius:6px; cursor:pointer; font-size:13px; font-weight:bold; transition: all 0.3s ease;" disabled>🚀 开始强化</button>
              <div style="display:flex; justify-content:space-between; font-size:10px; color:#aaa; margin-top:8px;">
                <span>状态: <span id="enhanceHelper_status" style="color:#FFA726;">待机中</span></span>
                <span id="enhanceHelper_counter">就绪</span>
              </div>
              <div style="display:flex; gap:6px; margin-top:6px;">
                <button id="enhanceHelper_historyBtn" class="panel-btn">📚 历史</button>
                <button id="enhanceHelper_weakKingBtn" class="panel-btn">👑 弱化</button>
                <button id="enhanceHelper_clearDataBtn" class="panel-btn">🗑️ 清除</button>
              </div>
            </div>
            <div style="flex: 1; min-width: 220px;">
              <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; height: 100%;">
                <div style="font-size:10px; color:#aaa; margin-bottom:6px;">📊 强化统计</div>
                <div id="enhanceHelper_statsDisplay" style="font-size:10px; color:#FFA726;">等待开始强化...</div>
              </div>
            </div>
          </div>
        </div>`;
        document.body.appendChild(panel);
        const style = document.createElement('style');
        style.textContent = `
            #enhanceHelperPanel .panel-btn { flex:1; padding:6px; border:none; border-radius:4px; cursor:pointer; font-size:10px; transition: all 0.3s ease; }
            #enhanceHelperPanel #enhanceHelper_historyBtn { background:rgba(129,199,132,0.8); color:white; }
            #enhanceHelperPanel #enhanceHelper_weakKingBtn { background:rgba(255,215,0,0.8); color:#000; font-weight:bold; }
            #enhanceHelperPanel #enhanceHelper_clearDataBtn { background:rgba(244,67,54,0.8); color:white; }
            #enhanceHelperPanel .protect-mode-btn { flex:1; padding:4px 8px; font-size:10px; border:1px solid transparent; cursor: pointer; }`;
        document.head.appendChild(style);
        makeDraggable(panel)
    }

    function initializeUIState() {
        if (!document.getElementById('enhanceHelperPanel')) return;
        const ui = {
            targetInput: document.getElementById('enhanceHelper_targetInput'),
            intervalInput: document.getElementById('enhanceHelper_intervalInput'),
            batchCountInput: document.getElementById('enhanceHelper_batchCountInput'),
            protectStartLevelInput: document.getElementById('enhanceHelper_protectStartLevelInput'),
            protectModeButtons: document.querySelectorAll('.protect-mode-btn'),
            enableHistoryCheckbox: document.getElementById('enhanceHelper_enableHistoryCheckbox'),
            debugCheckbox: document.getElementById('enhanceHelper_debugModeCheckbox'),
            wsDebugCheckbox: document.getElementById('enhanceHelper_wsDebugModeCheckbox'),
            toggleBtn: document.getElementById('enhanceHelper_toggleBtn'),
            clearDataBtn: document.getElementById('enhanceHelper_clearDataBtn'),
            historyBtn: document.getElementById('enhanceHelper_historyBtn'),
            weakKingBtn: document.getElementById('enhanceHelper_weakKingBtn'),
            minimizeBtn: document.getElementById('enhanceHelper_minimizeBtn'),
            expandBtn: document.getElementById('enhanceHelper_expandBtn'),
        };
        ui.targetInput.value = TARGET_LEVEL;
        ui.intervalInput.value = ENHANCE_INTERVAL;
        ui.batchCountInput.value = BATCH_COUNT;
        ui.protectStartLevelInput.value = PROTECT_START_LEVEL;
        ui.enableHistoryCheckbox.checked = ENABLE_HISTORY_RECORDING;
        ui.debugCheckbox.checked = DEBUG_MODE;
        ui.wsDebugCheckbox.checked = WS_DEBUG_MODE;
        if (currentEnhanceItem) {
            initStats(currentEnhanceItem.resourceId, TARGET_LEVEL);
            updateItemDisplay(currentEnhanceItem);
            updateStatsDisplay();
        }
        updateProtectDisplay();
        updateProtectModeButtons();
        updateToggleButtonState();
        updateMinimizedDisplay();
        setMinimize();
        ui.targetInput.addEventListener('change', e => {
            TARGET_LEVEL = parseInt(e.target.value, 10) || 5;
            saveConfig();
        });
        ui.intervalInput.addEventListener('change', e => {
            ENHANCE_INTERVAL = parseInt(e.target.value, 10) || 3000;
            saveConfig();
        });
        ui.batchCountInput.addEventListener('change', e => {
            BATCH_COUNT = parseInt(e.target.value, 10) || 1;
            saveConfig();
        });
        ui.protectStartLevelInput.addEventListener('change', e => {
            PROTECT_START_LEVEL = parseInt(e.target.value, 10);
            saveConfig();
            updateProtectDisplay();
        });
        ui.protectModeButtons.forEach(btn => btn.addEventListener('click', () => {
            PROTECT_MODE = btn.dataset.mode;
            saveConfig();
            updateProtectModeButtons();
            updateProtectDisplay();
        }));
        ui.enableHistoryCheckbox.addEventListener('change', e => {
            ENABLE_HISTORY_RECORDING = e.target.checked;
            saveConfig();
            ui.historyBtn.disabled = !ENABLE_HISTORY_RECORDING;
            ui.historyBtn.style.opacity = ENABLE_HISTORY_RECORDING ? '1' : '0.5';
        });
        ui.debugCheckbox.addEventListener('change', e => {
            DEBUG_MODE = e.target.checked;
            saveConfig();
        });
        ui.wsDebugCheckbox.addEventListener('change', e => {
            WS_DEBUG_MODE = e.target.checked;
            saveConfig();
            console.log(`[强化助手] WS调试模式已${WS_DEBUG_MODE ? '开启' : '关闭'}`);
        });
        ui.toggleBtn.addEventListener('click', () => {
            if (!IS_AUTO_ENHANCING) {
                if (currentEnhanceItem) Toggle();
            } else {
                stopAutoEnhance();
            }
        });
        ui.minimizeBtn.addEventListener('click', toggleMinimize);
        ui.expandBtn.addEventListener('click', toggleMinimize);
        ui.clearDataBtn.addEventListener('click', () => {
            if (confirm('确定清除数据?')) {
                currentEnhanceItem = null;
                storedEnhanceData = null;
                localStorage.removeItem(STORAGE_KEYS.CURRENT_ITEM);
                localStorage.removeItem(STORAGE_KEYS.STORED_REQUEST);
                updateItemDisplay(null);
                if (IS_AUTO_ENHANCING) {
                    stopAutoEnhance();
                }
            }
        });


    }

    function Toggle() {
        console.log(`[强化助手] 强化开始`);
        const batchInput = document.getElementById('enhanceHelper_batchCountInput');
        BATCH_COUNT = parseInt(batchInput.value, 10) || 1;
        currentBatchCount = BATCH_COUNT;
        if (!isContinuedFromHistory) {
            initStats(currentEnhanceItem.resourceId, TARGET_LEVEL);
        } else {
            isContinuedFromHistory = false;
        }
        IS_AUTO_ENHANCING = true;
        saveConfig();
        updateToggleButtonState();
        updateMinimizedDisplay();
        if (currentSocket) startAutoEnhance(currentSocket);
    }

    function startAutoEnhance(ws) {
        if (enhanceTimer) clearTimeout(enhanceTimer);
        sendEnhanceRequest(ws);
    }

    function updateItemDisplay(itemInfo, customStatus = null) {
        const display = document.getElementById('enhanceHelper_itemDisplay');
        const toggleBtn = document.getElementById('enhanceHelper_toggleBtn');
        const statusSpan = document.getElementById('enhanceHelper_status');
        if (!display) return;
        if (itemInfo) {
            display.textContent = translateItemId(itemInfo.resourceId);
            if (toggleBtn) toggleBtn.disabled = false;
            if (statusSpan) statusSpan.textContent = customStatus || (isContinuedFromHistory ? '继续就绪' : '就绪');
        } else {
            display.textContent = '等待强化结果...';
            if (toggleBtn) toggleBtn.disabled = true;
            if (statusSpan) statusSpan.textContent = '等待中';
        }
        updateProtectDisplay();
        updateMinimizedDisplay();
    }

    function updateStatsDisplay() {
        const statsDisplay = document.getElementById('enhanceHelper_statsDisplay');
        if (!statsDisplay || !enhanceStats.baseItem) {
            if (statsDisplay) statsDisplay.innerHTML = '等待开始强化...';
            return;
        }
        const totalRate = enhanceStats.totalAttempts > 0 ? (enhanceStats.totalSuccess / enhanceStats.totalAttempts * 100).toFixed(1) : '0.0';
        let html = `<div style="margin-bottom:6px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.1);">
            <div style="color:#64B5F6; font-weight:bold; margin-bottom:2px;">${translateItemId(enhanceStats.baseItem)}</div>
            <div style="font-size:11px; color:#FFA726;">进度: Lv${enhanceStats.currentLevel}/${enhanceStats.targetLevel} | 总计: ${enhanceStats.totalAttempts}次 (${totalRate}%)</div>
        </div>`;
        for (let level = 0; level < enhanceStats.targetLevel; level++) {
            const stats = enhanceStats.levelStats[level] || { attempts: 0, success: 0 };
            const rate = stats.attempts > 0 ? (stats.success / stats.attempts * 100).toFixed(1) : '0.0';
            html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:2px 4px; font-size:9px;">
                <span>Lv${level + 1}</span><span>${stats.attempts}次 (${rate}%)</span></div>`;
        }
        statsDisplay.innerHTML = html;
    }

    function updateToggleButtonState() {
        const toggleBtn = document.getElementById('enhanceHelper_toggleBtn');
        const statusSpan = document.getElementById('enhanceHelper_status');
        if (!toggleBtn) return;
        if (IS_AUTO_ENHANCING) {
            toggleBtn.innerHTML = '⏹️ 停止强化';
            toggleBtn.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
            statusSpan.textContent = '运行中';
            statusSpan.style.color = '#4CAF50';
        } else {
            toggleBtn.innerHTML = '🚀 开始强化';
            toggleBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            statusSpan.textContent = (enhanceStats.baseItem && enhanceStats.currentLevel >= enhanceStats.targetLevel) ? '已完成' : '已停止';
            statusSpan.style.color = (enhanceStats.baseItem && enhanceStats.currentLevel >= enhanceStats.targetLevel) ? '#4CAF50' : '#f44336';
        }
    }

    function updateProtectDisplay() {
        const display = document.getElementById('enhanceHelper_protectMaterialDisplay');
        const hint = document.getElementById('enhanceHelper_protectLevelHint');
        if (!display || !hint) return;
        let displayText = '';
        if (PROTECT_MODE === 'none' || PROTECT_START_LEVEL === 0) {
            displayText = '🛡️ 保护: 不使用';
        } else {
            const protectType = PROTECT_MODE === 'essence' ? translateItemId('starEssence') : '当前物品-4级';
            displayText = `🛡️ 保护: ${protectType} (≥${PROTECT_START_LEVEL}级)`;
        }
        display.innerHTML = displayText;
        hint.textContent = PROTECT_START_LEVEL === 0 ? '不使用保护' : `≥${PROTECT_START_LEVEL}级使用保护`;
        hint.style.color = PROTECT_START_LEVEL === 0 ? '#f44336' : '#aaa';
    }

    function updateProtectModeButtons() {
        document.querySelectorAll('.protect-mode-btn').forEach(btn => {
            const isActive = btn.dataset.mode === PROTECT_MODE;
            btn.style.background = isActive ? (PROTECT_MODE === 'none' ? 'rgba(244,67,54,0.3)' : (PROTECT_MODE === 'item' ? 'rgba(100,181,246,0.3)' : 'rgba(129,199,132,0.3)')) : 'rgba(255,255,255,0.1)';
            btn.style.color = isActive ? (PROTECT_MODE === 'none' ? '#f44336' : (PROTECT_MODE === 'item' ? '#64B5F6' : '#81C784')) : '#aaa';
            btn.style.border = isActive ? `1px solid ${PROTECT_MODE === 'none' ? '#f44336' : (PROTECT_MODE === 'item' ? '#64B5F6' : '#81C784')}` : '1px solid transparent';
        });
    }

    function toggleMinimize() {
        isMinimized = !isMinimized;
        setMinimize();
    }

    function setMinimize() {
        const main = document.getElementById('enhanceHelper_mainContent');
        const title = document.getElementById('enhanceHelper_titleBar');
        const miniBar = document.getElementById('enhanceHelper_minimizedBar');
        const panel = document.getElementById('enhanceHelperPanel');
        if (!main || !title || !miniBar || !panel) return;
        if (isMinimized) {
            main.style.display = 'none';
            title.style.display = 'none';
            miniBar.style.display = 'flex';
            panel.style.width = '280px';
        } else {
            main.style.display = 'block';
            title.style.display = 'flex';
            miniBar.style.display = 'none';
            panel.style.width = '480px';
        }
        saveConfig();
        updateMinimizedDisplay();
    }

    function updateMinimizedDisplay() {
        const statusEl = document.getElementById('enhanceHelper_minimizedStatus');
        if (!statusEl || !isMinimized) return;
        let statusText = '等待中...';
        if (currentEnhanceItem) {
            const itemInfo = parseItemLevel(currentEnhanceItem.resourceId);
            const baseItemName = translateItemId(itemInfo.baseItem);
            if (IS_AUTO_ENHANCING) {
                statusText = `🔨 ${baseItemName} +${itemInfo.level} → +${TARGET_LEVEL}`;
            } else {
                statusText = `✅ ${baseItemName} +${itemInfo.level}`;
            }
        }
        statusEl.textContent = statusText;
    }
})();