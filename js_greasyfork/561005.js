// ==UserScript==
// @name         大桔农场自动种植收获
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动检测空地种植、检测成熟收获、自动出售
// @author       Auto
// @match        https://game.daiju.live/*
// @icon         https://game.daiju.live/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_notification
// @grant        unsafeWindow
// @connect      game.daiju.live
// @downloadURL https://update.greasyfork.org/scripts/561005/%E5%A4%A7%E6%A1%94%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E7%A7%8D%E6%A4%8D%E6%94%B6%E8%8E%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561005/%E5%A4%A7%E6%A1%94%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E7%A7%8D%E6%A4%8D%E6%94%B6%E8%8E%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        USER_ID: null,              // 手动设置用户ID（如果自动获取失败，请在这里填写你的用户ID，如: 26）
        MIN_CHECK_INTERVAL: 1000,   // 最小检查间隔（毫秒），默认1秒
        MAX_CHECK_INTERVAL: 3600000,// 最大检查间隔（毫秒），默认1小时
        FIXED_CHECK_INTERVAL: 300000, // 固定检查间隔（毫秒），默认5分钟，即使没有作物成熟也会检查
        CHECK_BUFFER: -50,          // 收获时间延迟量（毫秒），负数表示延迟检查，确保作物已成熟
        DEFAULT_CROP_ID: 30,        // 默认种植作物ID（葡萄）
        AUTO_START: true,           // 是否自动开始
        AUTO_SELL: true,           // 是否自动出售收获的作物（false=只能手动出售）
        AUTO_BUY_SEEDS: true,       // 是否自动购买种子（当种子不足时）
        SELL_ALL_CROPS: true,       // 是否出售所有作物（true=出售所有，false=只出售指定作物）
        SELL_CROP_ID: 30,           // 指定出售的作物ID（当SELL_ALL_CROPS为false时生效）
        KEEP_CROP_COUNT: 0,         // 每种作物保留的数量（不出售）
        SHOW_NOTIFICATIONS: false,   // 是否显示通知
        DEBUG: true,                // 调试模式
        HEARTBEAT_INTERVAL: 60000,  // 心跳检查间隔（毫秒），默认1分钟，用于检测定时器是否失效
        VISIBILITY_CHECK_DELAY: 2000, // 页面可见性恢复后的检查延迟（毫秒）
        HARVEST_WAIT_THRESHOLD: 30000, // 收获等待阈值（毫秒），如果有作物在此时间内成熟，则等待
        HARVEST_WAIT_BUFFER: 1000,  // 收获等待缓冲（毫秒），等待作物成熟后额外等待的时间
        AUTO_STEAL: true,           // 是否自动偷菜
        STEAL_DELAY: 2000,          // 偷菜间隔（毫秒），避免请求过快
        STEAL_SORT_BY: 'money',     // 偷菜排序方式：'money'=按预估收益排序，'time'=按成熟时间排序
        STEAL_SCHEDULE_HOUR: 10,    // 自动偷菜执行时间（小时，24小时制）
        STEAL_SCHEDULE_MINUTE: 20   // 自动偷菜执行时间（分钟）
    };

    // 日志函数（控制台 + 面板）
    // 简洁模式：info 类型只显示关键信息，success/warning/error 全部显示
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[大桔农场] [${timestamp}]`;

        // === 控制台日志（完整输出）===
        if (CONFIG.DEBUG) {
            switch (type) {
                case 'error':
                    console.error(`${prefix} ❌ ${message}`);
                    break;
                case 'success':
                    console.log(`${prefix} ✅ ${message}`);
                    break;
                case 'warning':
                    console.warn(`${prefix} ⚠️ ${message}`);
                    break;
                default:
                    console.log(`${prefix} ℹ️ ${message}`);
            }
        }

        // === 面板日志（简洁模式）===
        const logList = document.getElementById('farm-log-list');
        if (!logList) return;

        // info 类型过滤：只显示关键信息
        if (type === 'info') {
            const keyPatterns = [
                /开始检查/, /用户ID/, /下次收获/, /下次检查/,
                /偷菜次数/, /找到.*可偷/, /即将.*成熟/
            ];
            const isKey = keyPatterns.some(p => p.test(message));
            if (!isKey) return; // 非关键 info 不显示到面板
        }

        // 确保日志面板可见（有日志时自动展开日志面板）
        const logPanel = document.getElementById('farm-log-panel');
        if (logPanel && logPanel.classList.contains('collapsed')) {
            logPanel.classList.remove('collapsed');
        }

        // 简化时间戳格式
        const shortTime = timestamp.replace(/:\d{2}$/, ''); // 去掉秒

        const item = document.createElement('div');
        item.className = `log-item log-${type}`;
        item.textContent = `${shortTime} ${message}`;

        logList.appendChild(item);

        // 最多保留 50 条，更简洁
        while (logList.children.length > 50) {
            logList.removeChild(logList.firstChild);
        }

        // 自动滚动
        logList.scrollTop = logList.scrollHeight;
    }

    // 通知函数
    function notify(title, text) {
        if (CONFIG.SHOW_NOTIFICATIONS && typeof GM_notification !== 'undefined') {
            GM_notification({
                title: title,
                text: text,
                timeout: 3000
            });
        }
    }

    // 从页面获取用户ID
    function getUserId() {
        // 1. 首先检查手动配置
        if (CONFIG.USER_ID) {
            return CONFIG.USER_ID;
        }

        // 2. 尝试从localStorage获取 - 多种可能的key
        const localStorageKeys = ['userInfo', 'user', 'userData', 'currentUser', 'auth', 'session'];
        for (const key of localStorageKeys) {
            try {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    if (parsed.id) return parsed.id;
                    if (parsed.userId) return parsed.userId;
                    if (parsed.user && parsed.user.id) return parsed.user.id;
                }
            } catch (e) {}
        }

        // 3. 尝试从sessionStorage获取
        for (const key of localStorageKeys) {
            try {
                const data = sessionStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    if (parsed.id) return parsed.id;
                    if (parsed.userId) return parsed.userId;
                    if (parsed.user && parsed.user.id) return parsed.user.id;
                }
            } catch (e) {}
        }

        // 4. 尝试从URL获取
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId') || urlParams.get('user_id') || urlParams.get('uid');
        if (userId) return userId;

        // 5. 尝试从cookie获取
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (['userId', 'user_id', 'uid', 'id'].includes(name)) {
                return value;
            }
        }

        // 6. 尝试从页面全局变量获取
        if (typeof window !== 'undefined') {
            if (window.userId) return window.userId;
            if (window.USER_ID) return window.USER_ID;
            if (window.user && window.user.id) return window.user.id;
            if (window.__USER__ && window.__USER__.id) return window.__USER__.id;
            if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.user) {
                return window.__INITIAL_STATE__.user.id;
            }
        }

        // 7. 尝试从页面DOM获取
        try {
            // 查找可能包含用户ID的元素
            const userIdElement = document.querySelector('[data-user-id]');
            if (userIdElement) {
                return userIdElement.getAttribute('data-user-id');
            }
        } catch (e) {}

        // 默认返回null，需要用户手动设置
        return null;
    }

    // 提示用户设置ID
    function promptForUserId() {
        const userId = prompt('无法自动获取用户ID，请手动输入你的用户ID：\n（可以在农场页面的网络请求中找到）');
        if (userId && !isNaN(userId)) {
            CONFIG.USER_ID = parseInt(userId);
            localStorage.setItem('daiju_farm_userId', userId);
            log(`用户ID已设置为: ${userId}`, 'success');
            return parseInt(userId);
        }
        return null;
    }

    // 尝试从保存的设置中恢复用户ID
    function loadSavedUserId() {
        const savedId = localStorage.getItem('daiju_farm_userId');
        if (savedId && !CONFIG.USER_ID) {
            CONFIG.USER_ID = parseInt(savedId);
            log(`从本地存储恢复用户ID: ${savedId}`, 'info');
        }
    }

    // API请求封装
    function apiRequest(url, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                method: method,
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    try {
                        const result = JSON.parse(response.responseText);
                        resolve(result);
                    } catch (e) {
                        reject(new Error('解析响应失败: ' + e.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('请求失败: ' + error));
                }
            };

            if (data && method !== 'GET') {
                options.data = JSON.stringify(data);
            }

            GM_xmlhttpRequest(options);
        });
    }

    // 使用fetch的API请求（备用方案）
    async function fetchApi(url, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        return await response.json();
    }

    // 获取农场状态
    async function getFarmStatus(userId) {
        log(`正在获取用户 ${userId} 的农场状态...`);
        try {
            const result = await fetchApi(`https://game.daiju.live/api/farm/status?userId=${userId}`);
            if (result.success) {
                log(`农场状态获取成功: ${result.data.fieldCount}/${result.data.maxFields} 块田地已使用`, 'success');
                return result.data;
            } else {
                log(`获取农场状态失败: ${result.message || '未知错误'}`, 'error');
                return null;
            }
        } catch (e) {
            log(`获取农场状态异常: ${e.message}`, 'error');
            return null;
        }
    }

    // 收获作物
    async function harvestCrop(plantingId, userId) {
        log(`正在收获作物 ID: ${plantingId}...`);
        try {
            const result = await fetchApi('https://game.daiju.live/api/farm/harvest', 'POST', {
                userId: userId,
                plantingId: plantingId
            });
            if (result.success) {
                log(`收获成功: ${result.message}`, 'success');
                notify('收获成功', result.message);
                return true;
            } else {
                log(`收获失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        } catch (e) {
            log(`收获异常: ${e.message}`, 'error');
            return false;
        }
    }

    // 种植作物
    async function plantCrop(cropId, userId) {
        log(`正在种植作物 ID: ${cropId}...`);
        try {
            const result = await fetchApi('https://game.daiju.live/api/farm/plant', 'POST', {
                userId: userId,
                cropId: cropId
            });
            if (result.success) {
                const harvestTime = new Date(result.data.harvestTime).toLocaleString();
                log(`种植成功: 预计收获时间 ${harvestTime}`, 'success');
                notify('种植成功', `预计收获时间: ${harvestTime}`);
                return true;
            } else {
                log(`种植失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        } catch (e) {
            log(`种植异常: ${e.message}`, 'error');
            return false;
        }
    }

    // 获取库存
    async function getInventory(userId) {
        log(`正在获取用户 ${userId} 的库存...`);
        try {
            const result = await fetchApi(`https://game.daiju.live/api/inventory?userId=${userId}`);
            if (result.success) {
                log(`库存获取成功`, 'success');
                return result.data;
            } else {
                log(`获取库存失败: ${result.message || '未知错误'}`, 'error');
                return null;
            }
        } catch (e) {
            log(`获取库存异常: ${e.message}`, 'error');
            return null;
        }
    }

    // 出售作物
    async function sellCrop(userId, cropId, amount) {
        log(`正在出售作物 ID: ${cropId}, 数量: ${amount}...`);
        try {
            const result = await fetchApi('https://game.daiju.live/api/shop/sell', 'POST', {
                userId: userId,
                cropId: cropId,
                amount: amount
            });
            if (result.success) {
                log(`出售成功: ${result.message}, 收入: ${result.data.income}`, 'success');
                notify('出售成功', `收入: ${result.data.income}`);
                return result.data;
            } else {
                log(`出售失败: ${result.message || '未知错误'}`, 'error');
                return null;
            }
        } catch (e) {
            log(`出售异常: ${e.message}`, 'error');
            return null;
        }
    }

    // 获取偷菜次数
    async function getStealCount(userId) {
        log(`正在获取偷菜次数...`);
        try {
            const result = await fetchApi(`https://game.daiju.live/api/steal/count?userId=${userId}`);
            if (result.success) {
                log(`偷菜次数: ${result.data.count}/${result.data.maxCount}, 剩余: ${result.data.remaining}`, 'success');
                return result.data;
            } else {
                log(`获取偷菜次数失败: ${result.message || '未知错误'}`, 'error');
                return null;
            }
        } catch (e) {
            log(`获取偷菜次数异常: ${e.message}`, 'error');
            return null;
        }
    }

    // 获取可偷的目标
    async function getStealTargets(userId) {
        log(`正在获取可偷目标...`);
        try {
            const result = await fetchApi(`https://game.daiju.live/api/steal/available?userId=${userId}`);
            if (result.success) {
                const targetCount = result.data ? result.data.length : 0;
                log(`找到 ${targetCount} 个可偷目标`, 'success');
                return result.data || [];
            } else {
                log(`获取可偷目标失败: ${result.message || '未知错误'}`, 'error');
                return [];
            }
        } catch (e) {
            log(`获取可偷目标异常: ${e.message}`, 'error');
            return [];
        }
    }

    // 执行偷菜
    async function stealCrop(thiefId, victimId, plantingId) {
        log(`正在偷取用户 ${victimId} 的作物 ${plantingId}...`);
        try {
            const result = await fetchApi('https://game.daiju.live/api/steal', 'POST', {
                thiefId: thiefId,
                victimId: victimId,
                plantingId: plantingId
            });
            if (result.success) {
                log(`偷菜成功: ${result.message}, 获得 ${result.data.stealMoney} 金`, 'success');
                notify('偷菜成功', `${result.data.cropEmoji} 获得 ${result.data.stealMoney} 金`);
                return { success: true, data: result.data };
            } else {
                log(`偷菜失败: ${result.message || '未知错误'}`, 'warning');
                return { success: false, message: result.message };
            }
        } catch (e) {
            log(`偷菜异常: ${e.message}`, 'error');
            return { success: false, message: e.message };
        }
    }

    // 检查是否到了计划的偷菜时间
    // 从 localStorage 读取上次偷菜日期
    function getLastStealDate() {
        return localStorage.getItem('daiju_farm_lastStealDate');
    }

    // 保存偷菜日期到 localStorage
    function setLastStealDate(date) {
        localStorage.setItem('daiju_farm_lastStealDate', date);
    }

    async function checkScheduledSteal(userId) {
        if (!CONFIG.AUTO_STEAL) {
            return;
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const today = now.toDateString();

        // 检查是否已经在今天执行过（从 localStorage 读取）
        const lastStealDate = getLastStealDate();
        if (lastStealDate === today) {
            return;
        }

        // 检查是否到了计划时间
        const scheduleHour = CONFIG.STEAL_SCHEDULE_HOUR;
        const scheduleMinute = CONFIG.STEAL_SCHEDULE_MINUTE;
        
        // 只有在计划时间之后才执行
        const isPastScheduleTime = (currentHour > scheduleHour) ||
                                   (currentHour === scheduleHour && currentMinute >= scheduleMinute);
        
        // 只在计划时间之后执行，且今天还没执行过
        if (isPastScheduleTime) {
            log(`到达计划偷菜时间 ${scheduleHour}:${scheduleMinute.toString().padStart(2, '0')}，开始自动偷菜...`, 'info');
            setLastStealDate(today); // 标记今天已执行（保存到 localStorage）
            await executeSteal(userId);
        }
    }

    // 执行偷菜（可被手动调用或计划任务调用）
    async function executeSteal(userId) {

        // 获取偷菜次数
        const stealCount = await getStealCount(userId);
        if (!stealCount || stealCount.remaining <= 0) {
            log('今日偷菜次数已用完', 'info');
            return;
        }

        log(`今日剩余偷菜次数: ${stealCount.remaining}`, 'info');

        // 获取可偷目标
        const targets = await getStealTargets(userId);
        if (!targets || targets.length === 0) {
            log('没有可偷的目标', 'info');
            return;
        }

        // 收集所有可偷的作物
        let allPlantings = [];
        const now = new Date();
        
        for (const target of targets) {
            if (!target.plantings || target.plantings.length === 0) continue;
            
            for (const planting of target.plantings) {
                const harvestTime = new Date(planting.harvestTime);
                // 只偷已经成熟的作物
                if (now >= harvestTime) {
                    allPlantings.push({
                        targetUserId: target.userId,
                        targetUsername: target.username,
                        plantingId: planting.plantingId,
                        cropName: planting.cropName,
                        cropEmoji: planting.cropEmoji,
                        estimatedMoney: planting.estimatedMoney,
                        harvestTime: harvestTime
                    });
                }
            }
        }

        if (allPlantings.length === 0) {
            log('没有已成熟的可偷作物', 'info');
            return;
        }

        // 排序
        if (CONFIG.STEAL_SORT_BY === 'money') {
            // 按预估收益从高到低排序
            allPlantings.sort((a, b) => b.estimatedMoney - a.estimatedMoney);
        } else {
            // 按成熟时间从早到晚排序
            allPlantings.sort((a, b) => a.harvestTime - b.harvestTime);
        }

        log(`找到 ${allPlantings.length} 个已成熟的可偷作物`, 'info');

        // 开始偷菜
        let stealSuccess = 0;
        let stealFail = 0;
        let remaining = stealCount.remaining;

        for (const planting of allPlantings) {
            if (remaining <= 0) {
                log('偷菜次数已用完', 'info');
                break;
            }

            log(`尝试偷取 ${planting.targetUsername} 的 ${planting.cropEmoji} ${planting.cropName} (预估 ${planting.estimatedMoney} 金)...`);
            
            const result = await stealCrop(userId, planting.targetUserId, planting.plantingId);
            
            if (result.success) {
                stealSuccess++;
                remaining--;
            } else {
                stealFail++;
                // 检查是否是次数用完
                if (result.message && (result.message.includes('次数已用完') || result.message.includes('次数不足'))) {
                    log('今日偷菜次数已用完，停止偷菜', 'info');
                    remaining = 0; // 强制停止
                    break;
                }
                // 如果被发现，可能需要等待一下
                if (result.message && result.message.includes('被发现')) {
                    log('被发现了，等待一下再继续...', 'warning');
                }
            }

            // 等待一下再偷下一个
            if (remaining > 0) {
                await sleep(CONFIG.STEAL_DELAY);
            }
        }

        log(`偷菜完成: 成功 ${stealSuccess} 次, 失败 ${stealFail} 次`, 'success');
    }

    // 手动偷菜（不受时间限制）
    async function manualSteal(userId) {
        log('手动触发偷菜...', 'info');
        await executeSteal(userId);
    }

    // 购买种子
    async function buySeed(userId, cropId, amount) {
        log(`正在购买种子 ID: ${cropId}, 数量: ${amount}...`);
        try {
            const result = await fetchApi('https://game.daiju.live/api/shop/buy', 'POST', {
                userId: userId,
                cropId: cropId,
                amount: amount
            });
            if (result.success) {
                log(`购买成功: ${result.message}, 花费: ${result.data.totalPrice}`, 'success');
                notify('购买种子', `花费: ${result.data.totalPrice}`);
                return true;
            } else {
                log(`购买失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        } catch (e) {
            log(`购买异常: ${e.message}`, 'error');
            return false;
        }
    }

    // 检查并自动出售
    async function checkAndSell(userId) {
        if (!CONFIG.AUTO_SELL) {
            return;
        }

        const inventory = await getInventory(userId);
        if (!inventory) {
            return;
        }

        let totalSold = 0;

        if (CONFIG.SELL_ALL_CROPS) {
            // 出售所有有库存的作物
            for (const item of inventory) {
                if (item.cropCount > CONFIG.KEEP_CROP_COUNT) {
                    const sellCount = item.cropCount - CONFIG.KEEP_CROP_COUNT;
                    log(`${item.crop.emoji} ${item.crop.name} 库存: ${item.cropCount}, 准备出售: ${sellCount}`);
                    const result = await sellCrop(userId, item.cropId, sellCount);
                    if (result) {
                        totalSold++;
                        await sleep(500); // 避免请求过快
                    }
                }
            }
            if (totalSold === 0) {
                log('没有可出售的作物', 'info');
            } else {
                log(`共出售 ${totalSold} 种作物`, 'success');
            }
        } else {
            // 只出售指定作物
            const cropToSell = inventory.find(item => item.cropId === CONFIG.SELL_CROP_ID);
            if (!cropToSell) {
                log(`库存中没有作物ID ${CONFIG.SELL_CROP_ID}`, 'info');
                return;
            }

            const availableCount = cropToSell.cropCount;
            const sellCount = availableCount - CONFIG.KEEP_CROP_COUNT;

            if (sellCount <= 0) {
                log(`${cropToSell.crop.emoji} ${cropToSell.crop.name} 库存: ${availableCount}, 保留: ${CONFIG.KEEP_CROP_COUNT}, 无需出售`, 'info');
                return;
            }

            log(`${cropToSell.crop.emoji} ${cropToSell.crop.name} 库存: ${availableCount}, 准备出售: ${sellCount}`);
            await sellCrop(userId, CONFIG.SELL_CROP_ID, sellCount);
        }
    }

    // 显示库存信息
    async function showInventory(userId) {
        const inventory = await getInventory(userId);
        if (!inventory) {
            return;
        }

        log('=== 库存信息 ===', 'info');
        for (const item of inventory) {
            if (item.seedCount > 0 || item.cropCount > 0) {
                log(`${item.crop.emoji} ${item.crop.name}: 种子 ${item.seedCount}, 作物 ${item.cropCount}`, 'info');
            }
        }
        log('===============', 'info');
    }

    // 检查并收获成熟作物
    async function checkAndHarvest(plantings, userId) {
        const now = new Date();
        let harvestedCount = 0;

        for (const planting of plantings) {
            const harvestTime = new Date(planting.harvestTime);
            
            // 检查是否已到收获时间且未被收获
            if (!planting.isHarvested && now >= harvestTime) {
                log(`作物 ${planting.crop.emoji} ${planting.crop.name} (ID: ${planting.id}) 已成熟，准备收获...`);
                const success = await harvestCrop(planting.id, userId);
                if (success) {
                    harvestedCount++;
                    // 收获后等待一小段时间，避免请求过快
                    await sleep(1000);
                }
            }
        }

        return harvestedCount;
    }

    // 检查并种植空地
    async function checkAndPlant(farmData, userId) {
        // fieldCount 是当前已使用的田地数量
        // plantings.length 是当前种植的作物数量
        // 如果两者相等，说明田地已满
        const currentPlantings = farmData.plantings ? farmData.plantings.length : 0;
        const usedFields = farmData.fieldCount;
        
        // 如果当前种植数量等于已使用田地数，说明没有空地
        if (currentPlantings >= usedFields) {
            log(`田地已满 (${currentPlantings}/${usedFields})，无需种植`, 'info');
            return 0;
        }
        
        // 计算空地数量
        const emptyFields = usedFields - currentPlantings;
        let plantedCount = 0;

        log(`发现 ${emptyFields} 块空地，准备种植...`);
        
        // 先检查种子数量
        const inventory = await getInventory(userId);
        if (inventory) {
            const seedItem = inventory.find(item => item.cropId === CONFIG.DEFAULT_CROP_ID);
            const seedCount = seedItem ? seedItem.seedCount : 0;
            
            if (seedCount < emptyFields) {
                const needToBuy = emptyFields - seedCount;
                log(`种子不足: 现有 ${seedCount}, 需要 ${emptyFields}, 缺少 ${needToBuy}`, 'warning');
                
                if (CONFIG.AUTO_BUY_SEEDS) {
                    log(`自动购买 ${needToBuy} 个种子...`);
                    const buySuccess = await buySeed(userId, CONFIG.DEFAULT_CROP_ID, needToBuy);
                    if (!buySuccess) {
                        log('购买种子失败，尝试用现有种子种植', 'warning');
                    }
                    await sleep(500);
                }
            }
        }
        
        for (let i = 0; i < emptyFields; i++) {
            const success = await plantCrop(CONFIG.DEFAULT_CROP_ID, userId);
            if (success) {
                plantedCount++;
                // 种植后等待一小段时间，避免请求过快
                await sleep(1000);
            } else {
                // 如果种植失败，可能是种子不足或余额不足
                if (plantedCount === 0) {
                    log('种植失败，可能种子不足或余额不足', 'warning');
                } else {
                    log(`种植完成，共种植 ${plantedCount} 块`, 'info');
                }
                break;
            }
        }

        return plantedCount;
    }

    // 睡眠函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 检查是否有即将成熟的作物
    function getNextHarvestInfo(plantings) {
        if (!plantings || plantings.length === 0) {
            return { hasReady: false, nextWaitTime: null, readyCount: 0, pendingCount: 0 };
        }
        
        const now = new Date();
        let readyCount = 0;
        let pendingCount = 0;
        let nextWaitTime = null;
        
        for (const planting of plantings) {
            if (planting.isHarvested) continue;
            
            const harvestTime = new Date(planting.harvestTime);
            const timeUntilHarvest = harvestTime - now;
            
            if (timeUntilHarvest <= 0) {
                // 已经成熟
                readyCount++;
            } else if (timeUntilHarvest <= CONFIG.HARVEST_WAIT_THRESHOLD) {
                // 即将成熟（在阈值内）
                pendingCount++;
                if (nextWaitTime === null || timeUntilHarvest < nextWaitTime) {
                    nextWaitTime = timeUntilHarvest;
                }
            }
        }
        
        return {
            hasReady: readyCount > 0,
            nextWaitTime: nextWaitTime,
            readyCount: readyCount,
            pendingCount: pendingCount
        };
    }

    // 主循环
    async function mainLoop() {
        let userId = getUserId();
        
        if (!userId) {
            log('无法自动获取用户ID，尝试提示用户输入...', 'warning');
            userId = promptForUserId();
            if (!userId) {
                log('用户未提供ID，请在脚本配置中手动设置 CONFIG.USER_ID', 'error');
                notify('错误', '请设置用户ID');
                return;
            }
        }

        log(`开始检查农场状态，用户ID: ${userId}`);

        // 获取农场状态
        let farmData = await getFarmStatus(userId);
        if (!farmData) {
            log('获取农场状态失败，将在下次循环重试', 'warning');
            return;
        }

        // 循环收获成熟作物，直到没有可收获的为止
        let totalHarvested = 0;
        let harvestRound = 0;
        const maxHarvestRounds = 20; // 防止无限循环
        
        while (harvestRound < maxHarvestRounds) {
            harvestRound++;
            
            // 检查当前状态
            const harvestInfo = getNextHarvestInfo(farmData.plantings);
            
            // 如果有即将成熟的作物（30秒内），等待它们成熟
            if (!harvestInfo.hasReady && harvestInfo.pendingCount > 0 && harvestInfo.nextWaitTime !== null) {
                const waitTime = harvestInfo.nextWaitTime + CONFIG.HARVEST_WAIT_BUFFER;
                log(`有 ${harvestInfo.pendingCount} 个作物即将在 ${Math.ceil(harvestInfo.nextWaitTime/1000)} 秒内成熟，等待中...`, 'info');
                await sleep(waitTime);
                
                // 重新获取农场状态
                farmData = await getFarmStatus(userId);
                if (!farmData) {
                    log('获取农场状态失败，停止收获循环', 'warning');
                    break;
                }
                continue; // 继续下一轮检查
            }
            
            // 收获成熟的作物
            const harvestedCount = await checkAndHarvest(farmData.plantings || [], userId);
            
            if (harvestedCount === 0) {
                // 没有收获任何作物
                // 再次检查是否有即将成熟的
                const recheckInfo = getNextHarvestInfo(farmData.plantings);
                if (recheckInfo.pendingCount > 0 && recheckInfo.nextWaitTime !== null) {
                    const waitTime = recheckInfo.nextWaitTime + CONFIG.HARVEST_WAIT_BUFFER;
                    log(`还有 ${recheckInfo.pendingCount} 个作物即将在 ${Math.ceil(recheckInfo.nextWaitTime/1000)} 秒内成熟，继续等待...`, 'info');
                    await sleep(waitTime);
                    
                    // 重新获取农场状态
                    farmData = await getFarmStatus(userId);
                    if (!farmData) {
                        log('获取农场状态失败，停止收获循环', 'warning');
                        break;
                    }
                    continue;
                }
                // 没有即将成熟的作物了，退出循环
                break;
            }
            
            totalHarvested += harvestedCount;
            log(`第 ${harvestRound} 轮收获了 ${harvestedCount} 个作物`, 'info');
            
            // 等待一下再获取最新状态
            await sleep(500);
            
            // 重新获取农场状态，检查是否还有成熟的作物
            farmData = await getFarmStatus(userId);
            if (!farmData) {
                log('获取农场状态失败，停止收获循环', 'warning');
                break;
            }
        }
        
        if (totalHarvested > 0) {
            log(`本次共收获 ${totalHarvested} 个作物`, 'success');
        }

        // 每次检查都自动出售库存中的作物
        await sleep(500);
        await checkAndSell(userId);

        // 检查是否到了自动偷菜时间
        await sleep(500);
        await checkScheduledSteal(userId);

        // 获取最新农场状态并检查空地
        await sleep(500);
        farmData = await getFarmStatus(userId);
        
        if (farmData) {
            // 循环种植空地，直到没有空地或种植失败
            let totalPlanted = 0;
            let plantRound = 0;
            const maxPlantRounds = 10; // 防止无限循环
            
            while (plantRound < maxPlantRounds) {
                plantRound++;
                const plantedCount = await checkAndPlant(farmData, userId);
                
                if (plantedCount === 0) {
                    // 没有种植任何作物，退出循环
                    break;
                }
                
                totalPlanted += plantedCount;
                log(`第 ${plantRound} 轮种植了 ${plantedCount} 个作物`, 'info');
                
                // 等待一下再获取最新状态
                await sleep(500);
                
                // 重新获取农场状态，检查是否还有空地
                farmData = await getFarmStatus(userId);
                if (!farmData) {
                    log('获取农场状态失败，停止种植循环', 'warning');
                    break;
                }
            }
            
            if (totalPlanted > 0) {
                log(`本次共种植 ${totalPlanted} 个作物`, 'success');
            }
        }

        // 获取最终农场状态，计算下次收获时间
        const finalFarmData = await getFarmStatus(userId);
        if (finalFarmData && finalFarmData.plantings && finalFarmData.plantings.length > 0) {
            const now = new Date();
            const nextHarvestTimes = finalFarmData.plantings
                .filter(p => !p.isHarvested)
                .map(p => new Date(p.harvestTime))
                .filter(t => t > now)
                .sort((a, b) => a - b);

            if (nextHarvestTimes.length > 0) {
                const nextHarvest = nextHarvestTimes[0];
                const waitTime = nextHarvest - now;
                log(`下次收获时间: ${nextHarvest.toLocaleString()} (${Math.ceil(waitTime / 60000)} 分钟后)`);
            }
        }
    }

    // 创建控制面板（主面板 + 右侧日志面板）
    function createControlPanel() {
        // 主面板
        const panel = document.createElement('div');
        panel.id = 'farm-auto-panel';
        panel.className = 'collapsed'; // 默认收起

        // 日志面板（右侧独立）
        const logPanel = document.createElement('div');
        logPanel.id = 'farm-log-panel';
        logPanel.className = 'collapsed';

        panel.innerHTML = `
            <style>
                /* 悬浮可拖动主面板 */
                #farm-auto-panel {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    z-index: 9999;
                    background: linear-gradient(to bottom, #8B4513, #654321);
                    color: white;
                    padding: 12px;
                    border-radius: 12px;
                    font-family: var(--font-geist-sans, Arial, sans-serif);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                    border: 3px solid #5D3A1A;
                    width: 220px;
                    cursor: default;
                    user-select: none;
                }
                /* 收起状态 */
                #farm-auto-panel.collapsed {
                    width: auto;
                    padding: 8px 12px;
                }
                #farm-auto-panel.collapsed .panel-content {
                    display: none;
                }
                #farm-auto-panel.collapsed .panel-title {
                    margin: 0;
                }
                #farm-auto-panel .panel-title {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                    font-weight: bold;
                    color: #FFD54F;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    cursor: move;
                    white-space: nowrap;
                }
                #farm-auto-panel .panel-title:hover {
                    opacity: 0.8;
                }
                #farm-auto-panel.dragging {
                    opacity: 0.8;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
                }
                #farm-auto-panel .status-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 10px;
                }
                #farm-auto-panel .status {
                    font-size: 12px;
                    padding: 6px 8px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
                #farm-auto-panel .planting-list {
                    max-height: 180px;
                    overflow-y: auto;
                    font-size: 11px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                    padding: 4px;
                }
                #farm-auto-panel .planting-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 4px 6px;
                    background: rgba(255,255,255,0.08);
                    border-radius: 3px;
                    margin-bottom: 3px;
                }
                #farm-auto-panel .planting-item:last-child {
                    margin-bottom: 0;
                }
                #farm-auto-panel .planting-item.ready {
                    background: rgba(76, 175, 80, 0.4);
                }
                #farm-auto-panel .planting-item .time {
                    color: #FFD54F;
                    font-weight: bold;
                }
                #farm-auto-panel .btn-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 6px;
                }
                #farm-auto-panel button {
                    padding: 8px 10px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                }
                #farm-auto-panel button:hover {
                    transform: scale(1.03);
                    filter: brightness(1.1);
                }
                #farm-auto-panel button:active {
                    transform: scale(0.97);
                }
                #farm-auto-panel .btn-start {
                    background: linear-gradient(to bottom, #4CAF50, #388E3C);
                    color: white;
                }
                #farm-auto-panel .btn-stop {
                    background: linear-gradient(to bottom, #f44336, #d32f2f);
                    color: white;
                }
                #farm-auto-panel .btn-action {
                    background: linear-gradient(to bottom, #FF9800, #F57C00);
                    color: white;
                }
                #farm-auto-panel .btn-info {
                    background: linear-gradient(to bottom, #2196F3, #1976D2);
                    color: white;
                }
                #farm-auto-panel .btn-steal {
                    background: linear-gradient(to bottom, #9C27B0, #7B1FA2);
                    color: white;
                }
                #farm-auto-panel .expand-icon {
                    font-size: 12px;
                    transition: transform 0.3s;
                    cursor: pointer;
                }
                #farm-auto-panel .expand-icon:hover {
                    color: white;
                }
                #farm-auto-panel.collapsed .expand-icon {
                    transform: rotate(-90deg);
                }
                #farm-auto-panel .section-title {
                    font-size: 11px;
                    color: #FFD54F;
                    margin: 8px 0 4px 0;
                    padding-bottom: 2px;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                }

                /* 右侧日志面板 */
                #farm-log-panel {
                    position: fixed;
                    top: 100px;
                    right: 250px;
                    z-index: 9999;
                    background: rgba(0,0,0,0.65);
                    color: white;
                    padding: 10px;
                    border-radius: 12px;
                    font-family: var(--font-geist-sans, Arial, sans-serif);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                    border: 2px solid rgba(255,255,255,0.2);
                    width: 280px;
                    min-width: 200px;
                    min-height: 100px;
                    user-select: none;
                    resize: both;
                    overflow: hidden;
                }
                #farm-log-panel.collapsed { display: none; }
                #farm-log-panel .log-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 6px;
                    color: #FFD54F;
                    cursor: move;
                }
                #farm-log-panel .log-actions {
                    display: flex;
                    gap: 6px;
                }
                #farm-log-panel button {
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 6px;
                    border: none;
                    cursor: pointer;
                    background: rgba(255,255,255,0.15);
                    color: white;
                }
                #farm-log-panel button:hover { filter: brightness(1.1); }
                #farm-log-panel .log-list {
                    height: calc(100% - 30px);
                    overflow-y: auto;
                    font-size: 11px;
                    line-height: 1.4;
                    background: rgba(0,0,0,0.25);
                    border-radius: 6px;
                    padding: 6px;
                }
                #farm-log-panel .log-item { margin-bottom: 3px; }
                #farm-log-panel .log-info { color: #bbb; }
                #farm-log-panel .log-success { color: #81C784; font-weight: bold; }
                #farm-log-panel .log-warning { color: #FFB74D; font-weight: bold; }
                #farm-log-panel .log-error { color: #E57373; font-weight: bold; }
            </style>

            <div class="panel-title" id="panel-header">
                <span>🤖 大桔农场助手</span>
                <span class="expand-icon" id="expand-btn">▼</span>
            </div>

            <div class="panel-content">
                <div class="status-grid">
                    <div class="status" id="farm-status">⏳ 状态: 等待中</div>
                    <div class="status" id="farm-info">🌱 田地: -/-</div>
                    <div class="status" id="farm-inventory">📦 库存: -</div>
                    <div class="status" id="last-check">🕐 检查: -</div>
                </div>

                <div class="section-title">🌾 种植情况</div>
                <div class="planting-list" id="planting-list">
                    <div style="color: #aaa; text-align: center; padding: 8px;">暂无种植信息</div>
                </div>

                <div class="section-title">⚙️ 操作</div>
                <div class="btn-grid">
                    <button class="btn-start" id="btn-toggle">▶️ 启动</button>
                    <button class="btn-action" id="btn-check">🔄 检查</button>
                    <button class="btn-action" id="btn-sell">💰 出售</button>
                    <button class="btn-info" id="btn-inventory">📋 库存</button>
                    <button class="btn-steal" id="btn-steal">🥷 偷菜</button>
                    <button class="btn-info" id="btn-log-panel-toggle">📜 日志</button>
                </div>
            </div>
        `;

        logPanel.innerHTML = `
            <div class="log-header" id="log-panel-header">
                <span>📜 日志</span>
                <span class="log-actions">
                    <button id="btn-log-clear">清空</button>
                    <button id="btn-log-hide">隐藏</button>
                </span>
            </div>
            <div class="log-list" id="farm-log-list"></div>
        `;

        // 添加到页面
        document.body.appendChild(panel);
        document.body.appendChild(logPanel);

        // 恢复保存的位置
        const savedPos = localStorage.getItem('daiju_farm_panel_pos');
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                panel.style.top = pos.top + 'px';
                panel.style.left = pos.left + 'px';
                panel.style.right = 'auto';
            } catch (e) {}
        }

        const savedLogPos = localStorage.getItem('daiju_farm_log_panel_pos');
        if (savedLogPos) {
            try {
                const pos = JSON.parse(savedLogPos);
                logPanel.style.top = pos.top + 'px';
                logPanel.style.left = pos.left + 'px';
                logPanel.style.right = 'auto';
            } catch (e) {}
        }

        // 绑定拖动事件（两个面板都可拖动）
        makeDraggable(panel);
        makeDraggableLogPanel(logPanel);

        // 绑定事件监听器
        document.getElementById('expand-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            togglePanelCollapse();
        });
        document.getElementById('btn-toggle').addEventListener('click', farmAutoToggle);
        document.getElementById('btn-check').addEventListener('click', farmManualCheck);
        document.getElementById('btn-sell').addEventListener('click', farmSellAll);
        document.getElementById('btn-inventory').addEventListener('click', farmShowInventory);
        document.getElementById('btn-steal').addEventListener('click', farmManualSteal);

        const btnLogPanelToggle = document.getElementById('btn-log-panel-toggle');
        if (btnLogPanelToggle) {
            btnLogPanelToggle.addEventListener('click', () => {
                logPanel.classList.toggle('collapsed');
            });
        }

        const btnLogClear = document.getElementById('btn-log-clear');
        if (btnLogClear) {
            btnLogClear.addEventListener('click', () => {
                const list = document.getElementById('farm-log-list');
                if (list) list.innerHTML = '';
            });
        }

        const btnLogHide = document.getElementById('btn-log-hide');
        if (btnLogHide) {
            btnLogHide.addEventListener('click', () => {
                logPanel.classList.add('collapsed');
            });
        }
    }

    // 使面板可拖动
    function makeDraggable(panel) {
        const header = document.getElementById('panel-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', function(e) {
            // 忽略点击展开按钮
            if (e.target.id === 'expand-btn') return;
            
            isDragging = true;
            panel.classList.add('dragging');
            
            const rect = panel.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // 限制在窗口内
            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                panel.classList.remove('dragging');
                
                // 保存位置
                const rect = panel.getBoundingClientRect();
                localStorage.setItem('daiju_farm_panel_pos', JSON.stringify({
                    left: rect.left,
                    top: rect.top
                }));
            }
        });
    }

    // 切换面板展开/收起
    function togglePanelCollapse() {
        const panel = document.getElementById('farm-auto-panel');
        if (panel) panel.classList.toggle('collapsed');
    }

    // 使日志面板可拖动（独立保存位置）
    function makeDraggableLogPanel(panel) {
        const header = document.getElementById('log-panel-header');
        if (!header) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', function(e) {
            isDragging = true;
            panel.classList.add('dragging');

            const rect = panel.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;

            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', function() {
            if (!isDragging) return;

            isDragging = false;
            panel.classList.remove('dragging');

            const rect = panel.getBoundingClientRect();
            localStorage.setItem('daiju_farm_log_panel_pos', JSON.stringify({
                left: rect.left,
                top: rect.top
            }));
        });
    }


    // 更新面板状态
    function updatePanelStatus(status, farmData = null) {
        const statusEl = document.getElementById('farm-status');
        const infoEl = document.getElementById('farm-info');
        const lastCheckEl = document.getElementById('last-check');
        const plantingListEl = document.getElementById('planting-list');
        
        if (statusEl) statusEl.textContent = `⏳ ${status}`;
        if (farmData && infoEl) {
            const plantCount = farmData.plantings ? farmData.plantings.length : 0;
            infoEl.textContent = `🌱 田地: ${plantCount}/${farmData.fieldCount}`;
        }
        if (lastCheckEl) lastCheckEl.textContent = `🕐 ${new Date().toLocaleTimeString()}`;
        
        // 更新种植列表
        if (farmData && farmData.plantings && plantingListEl) {
            updatePlantingList(farmData.plantings);
        }
    }

    // 更新种植列表显示
    function updatePlantingList(plantings) {
        // 保存种植数据用于倒计时
        currentPlantings = plantings;
        
        // 渲染列表
        renderPlantingList();
        
        // 启动倒计时
        startCountdown();
    }

    // 渲染种植列表
    function renderPlantingList() {
        const plantingListEl = document.getElementById('planting-list');
        if (!plantingListEl) return;
        
        if (!currentPlantings || currentPlantings.length === 0) {
            plantingListEl.innerHTML = '<div style="color: #aaa; text-align: center;">暂无种植</div>';
            return;
        }
        
        const now = new Date();
        let html = '';
        
        for (const planting of currentPlantings) {
            const harvestTime = new Date(planting.harvestTime);
            const isReady = now >= harvestTime;
            const timeStr = isReady ? '✅可收获' : formatTimeRemaining(harvestTime - now);
            
            html += `<div class="planting-item ${isReady ? 'ready' : ''}" data-harvest="${planting.harvestTime}">
                <span>${planting.crop.emoji} ${planting.crop.name}</span>
                <span class="time">${timeStr}</span>
            </div>`;
        }
        
        plantingListEl.innerHTML = html;
    }

    // 启动倒计时
    function startCountdown() {
        // 清除之前的倒计时
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // 每秒更新一次
        countdownInterval = setInterval(() => {
            renderPlantingList();
            updateNextCheckCountdown();
        }, 1000);
    }

    // 更新下次检查倒计时
    function updateNextCheckCountdown() {
        if (!nextCheckTime) return;
        
        const lastCheckEl = document.getElementById('last-check');
        if (lastCheckEl) {
            const now = new Date();
            const remaining = nextCheckTime - now;
            
            if (remaining <= 0) {
                lastCheckEl.textContent = `🕐 即将检查...`;
            } else {
                const timeStr = formatTimeRemaining(remaining);
                lastCheckEl.textContent = `🕐 下次: ${timeStr}`;
            }
        }
    }

    // 格式化剩余时间（带秒）
    function formatTimeRemaining(ms) {
        if (ms <= 0) return '✅可收获';
        
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}时${minutes}分${seconds}秒`;
        }
        if (minutes > 0) {
            return `${minutes}分${seconds}秒`;
        }
        return `${seconds}秒`;
    }

    // 全局变量
    let autoTimeout = null;
    let isRunning = false;
    let nextCheckTime = null;
    let countdownInterval = null;  // 倒计时定时器
    let currentPlantings = null;   // 当前种植数据（用于倒计时）
    let heartbeatInterval = null;  // 心跳定时器
    let lastHeartbeat = null;      // 上次心跳时间
    let isCheckingNow = false;     // 是否正在检查中（防止重复检查）

    // 计算下次检查时间
    function calculateNextCheckTime(farmData) {
        // 默认使用固定检查间隔（5分钟）
        let waitTime = CONFIG.FIXED_CHECK_INTERVAL;

        if (farmData && farmData.plantings && farmData.plantings.length > 0) {
            const now = new Date();
            const harvestTimes = farmData.plantings
                .filter(p => !p.isHarvested)
                .map(p => new Date(p.harvestTime))
                .filter(t => t > now)
                .sort((a, b) => a - b);

            if (harvestTimes.length > 0) {
                // 计算到最近收获时间的等待时间
                const nextHarvest = harvestTimes[0];
                const harvestWaitTime = nextHarvest - now - CONFIG.CHECK_BUFFER; // CHECK_BUFFER为负数时表示延迟检查
                
                // 取收获时间和固定间隔的较小值
                waitTime = Math.min(waitTime, harvestWaitTime);
            } else {
                // 所有作物都可以收获了，立即检查
                waitTime = CONFIG.MIN_CHECK_INTERVAL;
            }
        }

        // 限制在最小和最大间隔之间
        waitTime = Math.max(CONFIG.MIN_CHECK_INTERVAL, waitTime);
        waitTime = Math.min(CONFIG.MAX_CHECK_INTERVAL, waitTime);

        return waitTime;
    }

    // 安排下次检查
    function scheduleNextCheck(farmData) {
        if (!isRunning) return;

        // 清除之前的定时器
        if (autoTimeout) {
            clearTimeout(autoTimeout);
            autoTimeout = null;
        }

        const waitTime = calculateNextCheckTime(farmData);
        nextCheckTime = new Date(Date.now() + waitTime);

        const minutes = Math.ceil(waitTime / 60000);
        log(`下次检查时间: ${nextCheckTime.toLocaleTimeString()} (${minutes}分钟后)`);

        // 保存下次检查时间到 localStorage（用于恢复）
        localStorage.setItem('daiju_farm_nextCheck', nextCheckTime.getTime().toString());

        // 更新面板显示下次检查时间
        updateNextCheckDisplay(waitTime);

        autoTimeout = setTimeout(() => {
            if (isRunning) {
                runCheck();
            }
        }, waitTime);
    }

    // 启动心跳检测（用于检测定时器是否因浏览器节流而失效）
    function startHeartbeat() {
        // 清除之前的心跳
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
        }

        lastHeartbeat = Date.now();

        heartbeatInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - lastHeartbeat;
            lastHeartbeat = now;

            // 如果心跳间隔超过预期的2倍，说明浏览器可能休眠过
            if (elapsed > CONFIG.HEARTBEAT_INTERVAL * 2) {
                log(`检测到浏览器可能休眠过 (间隔: ${Math.round(elapsed/1000)}秒)，检查是否需要立即执行`, 'warning');
                checkAndRecoverSchedule();
            }

            // 检查是否错过了计划的检查时间
            if (isRunning && nextCheckTime && now > nextCheckTime.getTime() + 5000) {
                log(`检测到错过了计划的检查时间，立即执行检查`, 'warning');
                checkAndRecoverSchedule();
            }
        }, CONFIG.HEARTBEAT_INTERVAL);

        log('心跳检测已启动', 'info');
    }

    // 停止心跳检测
    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
        log('心跳检测已停止', 'info');
    }

    // 检查并恢复调度
    function checkAndRecoverSchedule() {
        if (!isRunning || isCheckingNow) return;

        const now = Date.now();

        // 检查是否已经过了计划的检查时间
        if (nextCheckTime && now >= nextCheckTime.getTime()) {
            log('恢复调度：立即执行检查', 'warning');
            runCheck();
        } else {
            // 重新计算并设置定时器
            const savedNextCheck = localStorage.getItem('daiju_farm_nextCheck');
            if (savedNextCheck) {
                const savedTime = parseInt(savedNextCheck);
                if (now >= savedTime) {
                    log('恢复调度：根据保存的时间立即执行检查', 'warning');
                    runCheck();
                }
            }
        }
    }

    // 页面可见性变化处理
    function handleVisibilityChange() {
        if (document.visibilityState === 'visible') {
            log('页面变为可见状态', 'info');
            
            // 延迟一小段时间后检查，避免页面刚恢复时的不稳定
            setTimeout(() => {
                if (isRunning) {
                    checkAndRecoverSchedule();
                }
            }, CONFIG.VISIBILITY_CHECK_DELAY);
        } else {
            log('页面变为隐藏状态', 'info');
        }
    }

    // 页面焦点变化处理
    function handleFocusChange() {
        if (document.hasFocus()) {
            log('页面获得焦点', 'info');
            
            // 延迟检查
            setTimeout(() => {
                if (isRunning) {
                    checkAndRecoverSchedule();
                }
            }, CONFIG.VISIBILITY_CHECK_DELAY);
        }
    }

    // 更新下次检查时间显示
    function updateNextCheckDisplay(waitTime) {
        const lastCheckEl = document.getElementById('last-check');
        if (lastCheckEl) {
            const minutes = Math.ceil(waitTime / 60000);
            const nextTime = new Date(Date.now() + waitTime).toLocaleTimeString();
            lastCheckEl.textContent = `🕐 下次: ${nextTime} (${minutes}分)`;
        }
    }

    // 切换自动运行
    function farmAutoToggle() {
        const btn = document.getElementById('btn-toggle');
        
        if (isRunning) {
            // 停止
            if (autoTimeout) {
                clearTimeout(autoTimeout);
                autoTimeout = null;
            }
            stopHeartbeat();
            isRunning = false;
            nextCheckTime = null;
            localStorage.removeItem('daiju_farm_nextCheck');
            btn.innerHTML = '▶️ 启动';
            btn.className = 'btn-start';
            updatePanelStatus('已停止');
            log('自动运行已停止', 'warning');
        } else {
            // 启动
            isRunning = true;
            btn.innerHTML = '⏹️ 停止';
            btn.className = 'btn-stop';
            updatePanelStatus('运行中');
            log('自动运行已启动', 'success');
            
            // 启动心跳检测
            startHeartbeat();
            
            // 立即执行一次
            runCheck();
        }
    }

    // 手动检查
    function farmManualCheck() {
        log('手动触发检查...');
        runCheck();
    }

    // 手动出售
    async function farmSellAll() {
        const userId = getUserId();
        if (!userId) {
            log('请先设置用户ID', 'error');
            return;
        }
        log('手动触发出售...');
        await checkAndSell(userId);
    }

    // 查看库存
    async function farmShowInventory() {
        const userId = getUserId();
        if (!userId) {
            log('请先设置用户ID', 'error');
            return;
        }
        await showInventory(userId);
    }

    // 手动偷菜
    async function farmManualSteal() {
        const userId = getUserId();
        if (!userId) {
            log('请先设置用户ID', 'error');
            return;
        }
        await manualSteal(userId);
    }

    // 执行检查
    async function runCheck() {
        // 防止重复检查
        if (isCheckingNow) {
            log('已有检查正在进行中，跳过本次检查', 'warning');
            return;
        }

        isCheckingNow = true;
        
        try {
            updatePanelStatus('检查中...');
            await mainLoop();
            
            // 更新面板信息
            const userId = getUserId();
            let farmData = null;
            if (userId) {
                farmData = await getFarmStatus(userId);
                if (farmData) {
                    updatePanelStatus(isRunning ? '运行中' : '已停止', farmData);
                }
                // 更新库存信息
                const inventory = await getInventory(userId);
                if (inventory) {
                    updateInventoryDisplay(inventory);
                }
            }

            // 安排下次检查（基于收获时间）
            if (isRunning) {
                scheduleNextCheck(farmData);
            }
        } catch (e) {
            log(`检查过程中发生错误: ${e.message}`, 'error');
            // 即使出错也要安排下次检查
            if (isRunning) {
                scheduleNextCheck(null);
            }
        } finally {
            isCheckingNow = false;
        }
    }

    // 更新库存显示
    function updateInventoryDisplay(inventory) {
        const inventoryEl = document.getElementById('farm-inventory');
        if (!inventoryEl) return;
        
        // 显示所有有库存的作物
        const itemsWithCrops = inventory.filter(item => item.cropCount > 0);
        if (itemsWithCrops.length > 0) {
            const displayText = itemsWithCrops
                .map(item => `${item.crop.emoji}${item.cropCount}`)
                .join(' ');
            inventoryEl.textContent = `📦 库存: ${displayText}`;
        } else {
            inventoryEl.textContent = `📦 库存: 无`;
        }
    }

    // 初始化
    function init() {
        log('大桔农场自动助手已加载', 'success');
        log(`浏览器: ${navigator.userAgent}`, 'info');
        
        // 尝试恢复保存的用户ID
        loadSavedUserId();
        
        // 注册页面可见性变化监听器
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // 注册页面焦点变化监听器
        window.addEventListener('focus', handleFocusChange);
        
        // 注册页面卸载前的清理
        window.addEventListener('beforeunload', () => {
            stopHeartbeat();
        });
        
        // 等待页面加载完成后创建控制面板
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createControlPanel();
                if (CONFIG.AUTO_START) {
                    setTimeout(() => {
                        farmAutoToggle();
                    }, 2000);
                }
            });
        } else {
            createControlPanel();
            if (CONFIG.AUTO_START) {
                setTimeout(() => {
                    farmAutoToggle();
                }, 2000);
            }
        }
    }

    // 启动
    init();

})();