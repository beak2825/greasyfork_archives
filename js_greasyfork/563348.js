// ==UserScript==
// @name         WindHub 福利站农场自动化
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  完整复刻 windhub_game.py 逻辑，支持收获、种植、订单、每日任务（喂养/浇水/施肥）、偷菜、抽奖等功能
// @author       You
// @match        https://wcdk.224442.xyz/*
// @icon         https://wcdk.224442.xyz/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      wcdk.224442.xyz
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563348/WindHub%20%E7%A6%8F%E5%88%A9%E7%AB%99%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563348/WindHub%20%E7%A6%8F%E5%88%A9%E7%AB%99%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * WindHub 农场自动化类
     */
    class WindHubGame {
        constructor() {
            this.baseUrl = 'https://wcdk.224442.xyz';
            this.csrfToken = null;
            this.logWindow = null;
        }

        /**
         * 日志输出
         */
        log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[${timestamp}]`;

            console.log(`${prefix} ${message}`);

            if (this.logWindow) {
                const color = {
                    'info': '#333',
                    'success': '#28a745',
                    'error': '#dc3545',
                    'warning': '#ffc107'
                }[type] || '#333';

                const logLine = document.createElement('div');
                logLine.style.color = color;
                logLine.textContent = `${prefix} ${message}`;
                this.logWindow.appendChild(logLine);
                this.logWindow.scrollTop = this.logWindow.scrollHeight;
            }
        }

        /**
         * 获取 CSRF Token
         */
        async getCsrfToken() {
            try {
                this.log('获取 CSRF Token...');
                const response = await fetch(`${this.baseUrl}/farm.php`);
                const html = await response.text();

                // 从页面中提取 CSRF token
                const match = html.match(/csrf[_-]?token["']?\s*[:=]\s*["']([a-f0-9]{64})["']/i);
                if (match) {
                    this.csrfToken = match[1];
                    this.log(`CSRF Token 获取成功: ${this.csrfToken.substring(0, 20)}...`, 'success');
                    return true;
                } else {
                    this.log('未找到 CSRF Token，将尝试不带 token 请求', 'warning');
                    return false;
                }
            } catch (error) {
                this.log(`获取 CSRF Token 失败: ${error.message}`, 'error');
                return false;
            }
        }

        /**
         * 获取农场状态
         */
        async getFarmState() {
            try {
                const headers = {
                    'accept': '*/*',
                    'content-type': 'application/json'
                };
                if (this.csrfToken) {
                    headers['x-csrf-token'] = this.csrfToken;
                }

                const response = await fetch(`${this.baseUrl}/api/farm_state.php`, {
                    method: 'GET',
                    headers: headers,
                    credentials: 'include'
                });

                const result = await response.json();
                if (result.status === 'success') {
                    return result.data;
                } else {
                    this.log(`获取农场状态失败: ${result.message || '未知错误'}`, 'error');
                    return null;
                }
            } catch (error) {
                this.log(`获取农场状态失败: ${error.message}`, 'error');
                return null;
            }
        }

        /**
         * 农场操作通用方法
         */
        async farmAction(action, params = {}) {
            try {
                const formData = new FormData();
                formData.append('action', action);

                for (const [key, value] of Object.entries(params)) {
                    formData.append(key, value);
                }

                const headers = {};
                if (this.csrfToken) {
                    headers['x-csrf-token'] = this.csrfToken;
                }

                const response = await fetch(`${this.baseUrl}/api/farm_action.php`, {
                    method: 'POST',
                    headers: headers,
                    body: formData,
                    credentials: 'include'
                });

                return await response.json();
            } catch (error) {
                this.log(`请求失败: ${error.message}`, 'error');
                return { success: false, message: error.message };
            }
        }

        /**
         * 农场社交操作通用方法
         */
        async farmSocialAction(action, params = {}) {
            try {
                const formData = new FormData();
                formData.append('action', action);

                for (const [key, value] of Object.entries(params)) {
                    formData.append(key, String(value));
                }

                const headers = {};
                if (this.csrfToken) {
                    headers['x-csrf-token'] = this.csrfToken;
                }

                const response = await fetch(`${this.baseUrl}/api/farm_social.php`, {
                    method: 'POST',
                    headers: headers,
                    body: formData,
                    credentials: 'include'
                });

                const result = await response.json();
                if (result.status === 'success') {
                    return result.data;
                } else {
                    const errorMessage = result.message || '未知错误';
                    this.log(`社交操作失败: ${errorMessage}`, 'error');

                    // 检查是否是每日操作次数用尽的错误
                    if (errorMessage.includes('操作次数已用完')) {
                        this.log('每日农场操作次数已用尽', 'warning');
                        throw new Error('DAILY_LIMIT_REACHED');
                    }

                    return null;
                }
            } catch (error) {
                if (error.message === 'DAILY_LIMIT_REACHED') {
                    throw error;
                }
                this.log(`社交操作请求失败: ${error.message}`, 'error');
                return null;
            }
        }

        /**
         * 收获所有成熟作物
         */
        async harvestAll() {
            this.log('\n=== 执行收获操作 ===');
            const result = await this.farmAction('harvest_all');

            if (result.status === 'success') {
                this.log('✓ 收获成功', 'success');
                if (result.message) {
                    this.log(`  ${result.message}`);
                }
                if (result.harvest) {
                    this.log(`  收获数量: ${result.harvest}`);
                }
                return true;
            } else {
                this.log(`✗ 收获失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        }

        /**
         * 交付订单
         */
        async deliverOrder(orderKey) {
            this.log(`\n=== 交付订单: ${orderKey} ===`);
            const result = await this.farmAction('deliver_order', { order_key: orderKey });

            if (result.status === 'success') {
                this.log('✓ 订单交付成功', 'success');
                const data = result.data || {};
                if (data.reward) {
                    this.log(`  获得奖励: ${data.reward} 金币`);
                }
                if (data.exp) {
                    this.log(`  获得经验: ${data.exp}`);
                }
                return true;
            } else {
                this.log(`✗ 订单交付失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        }

        /**
         * 播种作物
         */
        async plantCrops(cropKey, plotIndices) {
            if (!plotIndices || plotIndices.length === 0) {
                this.log('没有可种植的地块');
                return true;
            }

            this.log(`\n=== 执行播种操作 ===`);
            this.log(`作物类型: ${cropKey}`);
            this.log(`地块数量: ${plotIndices.length}`);

            const result = await this.farmAction('plant_many', {
                crop_key: cropKey,
                plot_indices: JSON.stringify(plotIndices)
            });

            if (result.status === 'success') {
                this.log('✓ 播种成功', 'success');
                if (result.message) {
                    this.log(`  ${result.message}`);
                }
                return true;
            } else {
                this.log(`✗ 播种失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        }

        /**
         * 计算智能种植方案
         */
        calculatePlantingPlan(state, deliveredOrderKeys = []) {
            const profile = state.profile || {};
            const walletBalance = state.wallet_balance || 0;
            const plots = state.plots || [];
            const crops = state.crops || [];
            const orders = state.orders || {};
            const grid = state.grid || {};

            this.log(`\n=== 计算种植方案 ===`);
            this.log(`钱包余额: ${walletBalance}`);
            this.log(`总地块数: ${grid.count || 0}`);

            // 获取空闲地块
            const emptyPlots = [];
            for (const plot of plots) {
                if (!['growing', 'ready'].includes(plot.state)) {
                    emptyPlots.push(plot.plot_index);
                }
            }

            // 检查 state 为 null 的地块
            if (emptyPlots.length === 0) {
                const totalCount = grid.count || 0;
                const occupiedIndices = new Set(plots.map(p => p.plot_index));
                for (let i = 0; i < totalCount; i++) {
                    if (!occupiedIndices.has(i)) {
                        emptyPlots.push(i);
                    }
                }
            }

            this.log(`空闲地块数: ${emptyPlots.length}`);

            if (emptyPlots.length === 0) {
                this.log('没有空闲地块');
                return {};
            }

            // 获取已解锁的作物
            const unlockedCrops = crops.filter(crop => crop.unlocked);
            if (unlockedCrops.length === 0) {
                this.log('没有已解锁的作物');
                return {};
            }

            // 优先处理订单需求
            const plantingPlan = {};
            let remainingPlots = [...emptyPlots];
            let remainingBalance = walletBalance;

            if (orders.enabled && orders.items) {
                this.log('\n检查订单需求...');
                for (const order of orders.items) {
                    const orderKey = order.key || '';
                    if (order.delivered || deliveredOrderKeys.includes(orderKey)) {
                        continue;
                    }

                    const requirements = order.requirements || {};
                    this.log(`订单: ${order.name} - ${order.desc}`);

                    for (const [cropKey, needCount] of Object.entries(requirements)) {
                        const cropInfo = unlockedCrops.find(c => c.key === cropKey);
                        if (!cropInfo) {
                            this.log(`  作物 ${cropKey} 未解锁，跳过`);
                            continue;
                        }

                        const seedCost = cropInfo.seed_cost;
                        const canPlant = Math.min(
                            needCount,
                            remainingPlots.length,
                            Math.floor(remainingBalance / seedCost)
                        );

                        if (canPlant > 0) {
                            plantingPlan[cropKey] = (plantingPlan[cropKey] || 0) + canPlant;
                            remainingBalance -= canPlant * seedCost;
                            remainingPlots = remainingPlots.slice(canPlant);
                            this.log(`  订单种植: ${cropInfo.name} x${canPlant} (成本: ${seedCost * canPlant})`);
                        }
                    }
                }
            }

            // 剩余地块种植性价比最高的作物
            if (remainingPlots.length > 0 && remainingBalance > 0) {
                this.log(`\n剩余地块: ${remainingPlots.length}, 剩余余额: ${remainingBalance}`);

                const maxSeedCost = Math.floor(remainingBalance / remainingPlots.length);
                this.log(`单块地最大成本: ${maxSeedCost}`);

                const affordableCrops = unlockedCrops.filter(crop => crop.seed_cost <= maxSeedCost);

                if (affordableCrops.length > 0) {
                    // 按售价排序
                    affordableCrops.sort((a, b) => b.reward - a.reward);
                    const bestCrop = affordableCrops[0];

                    const canPlant = Math.min(
                        remainingPlots.length,
                        Math.floor(remainingBalance / bestCrop.seed_cost)
                    );

                    if (canPlant > 0) {
                        plantingPlan[bestCrop.key] = (plantingPlan[bestCrop.key] || 0) + canPlant;
                        this.log(`性价比种植: ${bestCrop.name} x${canPlant} (成本: ${bestCrop.seed_cost * canPlant})`);
                    }
                }
            }

            return plantingPlan;
        }

        /**
         * 偷菜功能
         */
        async stealCrops() {
            this.log('\n=== 开始偷菜 ===');

            // 获取当前状态，检查偷菜次数
            const state = await this.getFarmState();
            if (!state) {
                this.log('✗ 获取农场状态失败', 'error');
                return false;
            }

            const config = state.config || {};
            const stealDailyRemaining = config.steal_daily_remaining || 0;

            this.log(`剩余偷菜次数: ${stealDailyRemaining}`);

            if (stealDailyRemaining <= 0) {
                this.log('今日偷菜次数已用完');
                return true;
            }

            // 偷菜循环
            let stealCount = 0;
            try {
                for (let attempt = 0; attempt < stealDailyRemaining; attempt++) {
                    this.log(`\n--- 第 ${attempt + 1} 次偷菜尝试 ---`);

                    // 1. 获取随机用户
                    const neighborData = await this.farmSocialAction('random_neighbor');
                    if (!neighborData || !neighborData.user) {
                        this.log('✗ 获取随机用户失败', 'error');
                        await this.sleep(1000, 2000);
                        continue;
                    }

                    const user = neighborData.user;
                    const targetUserId = user.id;
                    const username = user.username;

                    this.log(`目标用户: ${username} (ID: ${targetUserId})`);
                    await this.sleep(1000, 2000);

                    // 2. 访问用户农场
                    const farmData = await this.farmSocialAction('visit', { target_user_id: targetUserId });
                    if (!farmData || !farmData.plots) {
                        this.log(`✗ 访问 ${username} 的农场失败`, 'error');
                        await this.sleep(1000, 2000);
                        continue;
                    }

                    // 3. 查找可偷取的地块
                    const plots = farmData.plots || [];
                    const stealablePlots = plots.filter(plot => {
                        if (plot.state === 'ready') {
                            const stolenCount = plot.stolen_count || 0;
                            const stolenMax = plot.stolen_max || 1;
                            return stolenCount < stolenMax;
                        }
                        return false;
                    });

                    if (stealablePlots.length === 0) {
                        this.log(`✗ ${username} 的农场没有可偷取的作物`);
                        await this.sleep(1000, 2000);
                        continue;
                    }

                    // 4. 随机选择一块地偷取
                    const targetPlot = stealablePlots[Math.floor(Math.random() * stealablePlots.length)];
                    const plotIndex = targetPlot.plot_index;
                    const cropName = targetPlot.crop?.name || '未知作物';

                    this.log(`偷取地块 ${plotIndex}: ${cropName}`);

                    // 5. 执行偷菜
                    const stealResult = await this.farmSocialAction('steal', {
                        target_user_id: targetUserId,
                        plot_index: plotIndex
                    });

                    if (stealResult) {
                        stealCount++;
                        const reward = stealResult.reward || 0;
                        const exp = stealResult.exp || 0;
                        this.log(`✓ 偷菜成功! 获得: ${reward} 金币, ${exp} 经验`, 'success');
                    } else {
                        this.log('✗ 偷菜失败', 'error');
                    }

                    // 延迟，避免请求过快
                    await this.sleep(2000, 4000);
                }
            } catch (error) {
                if (error.message === 'DAILY_LIMIT_REACHED') {
                    this.log('每日操作次数已用尽，退出偷菜', 'warning');
                }
            }

            this.log(`\n=== 偷菜完成 ===`);
            this.log(`成功偷取: ${stealCount} 次`);
            return true;
        }

        /**
         * 喂养宠物
         */
        async feedPet() {
            this.log('\n=== 喂养宠物 ===');
            const result = await this.farmAction('feed_pet');

            if (result.status === 'success') {
                this.log('✓ 喂养成功', 'success');
                if (result.message) {
                    this.log(`  ${result.message}`);
                }
                return true;
            } else {
                this.log(`✗ 喂养失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        }

        /**
         * 与宠物互动
         */
        async playPet() {
            this.log('\n=== 与宠物互动 ===');
            const result = await this.farmAction('play_pet');

            if (result.status === 'success') {
                this.log('✓ 互动成功', 'success');
                if (result.message) {
                    this.log(`  ${result.message}`);
                }
                return true;
            } else {
                this.log(`✗ 互动失败: ${result.message || '未知错误'}`, 'error');
                return false;
            }
        }

        /**
         * 浇水
         */
        async waterCrops(count = 1) {
            this.log(`\n=== 执行浇水操作 (目标: ${count} 次) ===`);

            // 获取当前农场状态，找出可浇水的地块
            const state = await this.getFarmState();
            if (!state) {
                this.log('✗ 获取农场状态失败', 'error');
                return false;
            }

            const plots = state.plots || [];
            const growingPlots = plots.filter(p => p.state === 'growing');

            if (growingPlots.length === 0) {
                this.log('✗ 没有正在生长的作物可以浇水', 'error');
                return false;
            }

            this.log(`发现 ${growingPlots.length} 块正在生长的地块`);

            // 执行浇水操作
            let successCount = 0;
            const waterCount = Math.min(count, growingPlots.length);

            for (let i = 0; i < waterCount; i++) {
                const plot = growingPlots[i];
                const plotIndex = plot.plot_index;
                const cropName = plot.crop?.name || '未知作物';

                this.log(`\n--- 第 ${i + 1} 次浇水 ---`);
                this.log(`地块 ${plotIndex}: ${cropName}`);

                const result = await this.farmAction('water', { plot_index: String(plotIndex) });

                if (result.status === 'success') {
                    successCount++;
                    this.log('✓ 浇水成功', 'success');
                    if (result.message) {
                        this.log(`  ${result.message}`);
                    }
                } else {
                    this.log(`✗ 浇水失败: ${result.message || '未知错误'}`, 'error');
                }

                // 延迟，避免请求过快
                if (i < waterCount - 1) {
                    await this.sleep(1000, 2000);
                }
            }

            this.log(`\n浇水完成: ${successCount}/${waterCount}`);
            return successCount > 0;
        }

        /**
         * 施肥功能
         */
        async fertilizeCrops(count = null) {
            const countText = count ? `(目标: ${count} 次)` : '';
            this.log(`\n=== 开始施肥 ${countText} ===`);

            // 获取当前状态，检查可施肥的地块
            const state = await this.getFarmState();
            if (!state) {
                this.log('✗ 获取农场状态失败', 'error');
                return false;
            }

            const plots = state.plots || [];
            const walletBalance = state.wallet_balance || 0;

            // 查找可施肥的地块（state=growing 且未施肥）
            const fertilizablePlots = plots.filter(plot => {
                return plot.state === 'growing' && !plot.fertilized;
            });

            if (fertilizablePlots.length === 0) {
                this.log('当前没有可施肥的地块');
                return true;
            }

            this.log(`发现 ${fertilizablePlots.length} 块可施肥地块`);
            this.log(`当前余额: ${walletBalance}`);

            // 确定实际施肥次数
            const actualCount = count ? Math.min(count, fertilizablePlots.length) : fertilizablePlots.length;

            // 施肥循环
            let fertilizeCount = 0;
            for (let i = 0; i < actualCount; i++) {
                const plot = fertilizablePlots[i];
                const plotIndex = plot.plot_index;
                const cropName = plot.crop?.name || '未知作物';

                this.log(`\n--- 第 ${i + 1} 次施肥 ---`);
                this.log(`地块 ${plotIndex}: ${cropName}`);

                // 执行施肥
                const result = await this.farmAction('fertilize', { plot_index: String(plotIndex) });

                if (result.status === 'success') {
                    fertilizeCount++;
                    this.log('✓ 施肥成功', 'success');
                    const data = result.data || {};
                    if (result.message) {
                        this.log(`  ${result.message}`);
                    }
                    if (data.wallet_balance !== undefined) {
                        this.log(`  当前余额: ${data.wallet_balance}`);
                    }
                } else {
                    const message = result.message || '未知错误';
                    this.log(`✗ 施肥失败: ${message}`, 'error');

                    // 如果是余额不足或缺少肥料，停止施肥
                    if (message.includes('余额不足') || message.toLowerCase().includes('insufficient')) {
                        this.log('余额不足，停止施肥', 'warning');
                        break;
                    } else if (message.includes('缺少肥料') || message.toLowerCase().includes('fertilizer')) {
                        this.log('仓库缺少肥料，停止施肥', 'warning');
                        break;
                    }
                }

                // 延迟，避免请求过快
                if (i < actualCount - 1) {
                    await this.sleep(2000, 4000);
                }
            }

            this.log(`\n=== 施肥完成 ===`);
            this.log(`成功施肥: ${fertilizeCount}/${actualCount}`);
            return fertilizeCount > 0;
        }

        /**
         * 检查并完成每日任务
         */
        async checkAndCompleteDailyQuests(state) {
            this.log('\n=== 检查每日任务 ===');

            const dailyQuests = state.daily_quests || {};
            if (!dailyQuests.enabled) {
                this.log('每日任务功能未启用');
                return false;
            }

            const items = dailyQuests.items || [];
            if (items.length === 0) {
                this.log('今日没有任务');
                return false;
            }

            let executed = false;

            for (const quest of items) {
                const key = quest.key || '';
                const name = quest.name || '';
                const desc = quest.desc || '';
                const progress = quest.progress || 0;
                const target = quest.target || 0;
                const completed = quest.completed || false;
                const claimed = quest.claimed || false;

                this.log(`\n任务: ${name} (${key})`);
                this.log(`  描述: ${desc}`);
                this.log(`  进度: ${progress}/${target}`);
                this.log(`  状态: ${completed ? '已完成' : '未完成'}, ${claimed ? '已领取' : '未领取'}`);

                // 如果任务已完成或已领取，跳过
                if (completed || claimed) {
                    this.log('  → 跳过（已完成或已领取）');
                    continue;
                }

                // 根据任务类型执行操作
                if (key.startsWith('dq_feed')) {
                    // 喂养任务
                    const remaining = target - progress;
                    this.log(`  → 执行喂养任务，剩余次数: ${remaining}`);
                    for (let i = 0; i < remaining; i++) {
                        await this.feedPet();
                        executed = true;
                        if (i < remaining - 1) {
                            await this.sleep(1000, 2000);
                        }
                    }
                } else if (key.startsWith('dq_water')) {
                    // 浇水任务
                    const remaining = target - progress;
                    this.log(`  → 执行浇水任务，剩余次数: ${remaining}`);
                    await this.waterCrops(remaining);
                    executed = true;
                } else if (key.startsWith('dq_harvest')) {
                    // 忽略收割任务
                    this.log('  → 忽略收割任务');
                    continue;
                } else if (key.startsWith('dq_fertilize')) {
                    // 施肥任务
                    const remaining = target - progress;
                    this.log(`  → 执行施肥任务，剩余次数: ${remaining}`);
                    await this.fertilizeCrops(remaining);
                    executed = true;
                } else {
                    this.log(`  → 未知任务类型: ${key}`, 'warning');
                }
            }

            return executed;
        }

        /**
         * 抽奖功能
         */
        async lottery() {
            this.log('\n=== 开始抽奖 ===');

            // 获取当前状态，检查抽奖次数
            const state = await this.getFarmState();
            if (!state) {
                this.log('✗ 获取农场状态失败', 'error');
                return false;
            }

            const profile = state.profile || {};
            const lotteryDailyRemaining = profile.lottery_daily_remaining || 0;

            this.log(`剩余抽奖次数: ${lotteryDailyRemaining}`);

            if (lotteryDailyRemaining <= 0) {
                this.log('今日抽奖次数已用完');
                return true;
            }

            // 抽奖循环
            let lotteryCount = 0;
            let wonCount = 0;
            let totalAwarded = 0;

            for (let attempt = 0; attempt < lotteryDailyRemaining; attempt++) {
                this.log(`\n--- 第 ${attempt + 1} 次抽奖 ---`);

                try {
                    const headers = {
                        'accept': '*/*',
                        'content-type': 'application/json'
                    };
                    if (this.csrfToken) {
                        headers['x-csrf-token'] = this.csrfToken;
                    }

                    const response = await fetch(`${this.baseUrl}/api/draw.php`, {
                        method: 'POST',
                        headers: headers,
                        credentials: 'include'
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        lotteryCount++;
                        const data = result.data || {};
                        const message = result.message || '';

                        const won = data.won || false;
                        const awardedQuota = data.awarded_quota || 0;
                        const walletBalance = data.wallet_balance || 0;

                        if (won) {
                            wonCount++;
                            totalAwarded += awardedQuota;
                            this.log(`✓ ${message}`, 'success');
                            this.log(`  中奖金额: ${awardedQuota}`);
                            this.log(`  当前余额: ${walletBalance}`);
                        } else {
                            this.log(`✗ ${message}`);
                            this.log(`  当前余额: ${walletBalance}`);
                        }
                    } else {
                        this.log(`✗ 抽奖失败: ${result.message || '未知错误'}`, 'error');
                        break;
                    }
                } catch (error) {
                    this.log(`✗ 抽奖请求失败: ${error.message}`, 'error');
                    break;
                }

                // 延迟，避免请求过快
                await this.sleep(1000, 3000);
            }

            this.log(`\n=== 抽奖完成 ===`);
            this.log(`总抽奖次数: ${lotteryCount}`);
            this.log(`中奖次数: ${wonCount}`);
            if (totalAwarded > 0) {
                this.log(`总中奖金额: ${totalAwarded}`);
            }

            return true;
        }

        /**
         * 随机延迟
         */
        async sleep(minMs, maxMs) {
            const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
            return new Promise(resolve => setTimeout(resolve, delay));
        }

        /**
         * 执行农场任务流程
         */
        async run() {
            this.log('=== WindHub 福利站农场自动化 ===\n');

            try {
                // 获取 CSRF Token
                await this.getCsrfToken();
                await this.sleep(1000, 2000);

                // 1. 获取农场状态
                this.log('=== 获取农场状态 ===');
                let state = await this.getFarmState();
                if (!state) {
                    this.log('✗ 获取农场状态失败', 'error');
                    return false;
                }

                // 打印状态信息
                const profile = state.profile || {};
                this.log(`\n农场信息:`);
                this.log(`  等级: ${profile.level || 0}`);
                this.log(`  经验: ${profile.exp || 0}/${profile.next_level_exp || 0}`);
                this.log(`  钱包余额: ${state.wallet_balance || 0}`);
                this.log(`  积分余额: ${state.points_balance || 0}`);

                // 2. 检查体力
                const dailyActionsCap = profile.daily_actions_cap || 0;
                const dailyActionsUsed = profile.daily_actions_used || 0;
                const remainingActions = dailyActionsCap - dailyActionsUsed;

                this.log(`\n体力状态:`);
                this.log(`  已使用: ${dailyActionsUsed}/${dailyActionsCap}`);
                this.log(`  剩余: ${remainingActions}`);

                if (remainingActions <= 0) {
                    this.log('✗ 体力不足，无法执行操作', 'error');
                    return false;
                }

                // 3. 优先处理每日任务
                const dailyQuestExecuted = await this.checkAndCompleteDailyQuests(state);
                if (dailyQuestExecuted) {
                    // 如果执行了每日任务，重新获取状态
                    this.log('\n每日任务执行完毕，重新获取状态');
                    await this.sleep(1000, 2000);
                    state = await this.getFarmState();
                    if (!state) {
                        this.log('✗ 重新获取农场状态失败', 'error');
                        return false;
                    }
                }

                // 4. 检查是否有可收获的作物
                let plots = state.plots || [];
                const readyPlots = plots.filter(p => p.state === 'ready');

                if (readyPlots.length > 0) {
                    this.log(`\n发现 ${readyPlots.length} 块可收获地块`);
                    await this.harvestAll();
                    await this.sleep(2000, 4000);

                    // 重新获取状态（收获后余额会变化）
                    state = await this.getFarmState();
                    if (!state) {
                        this.log('✗ 重新获取农场状态失败', 'error');
                        return false;
                    }
                } else {
                    this.log('\n当前没有可收获的作物');
                }

                // 5. 检查并交付可完成的订单
                this.log('\n=== 检查订单交付 ===');
                const orders = state.orders || {};
                const deliveredOrderKeys = [];

                if (orders.enabled && orders.items) {
                    for (const order of orders.items) {
                        if (order.can_deliver && !order.delivered) {
                            const orderKey = order.key || '';
                            const orderName = order.name || '';
                            this.log(`发现可交付订单: ${orderName} (${orderKey})`);

                            if (await this.deliverOrder(orderKey)) {
                                deliveredOrderKeys.push(orderKey);
                                await this.sleep(1000, 2000);
                            }
                        }
                    }

                    // 如果有订单交付，重新获取状态
                    if (deliveredOrderKeys.length > 0) {
                        this.log(`\n已交付 ${deliveredOrderKeys.length} 个订单，重新获取状态`);
                        state = await this.getFarmState();
                        if (!state) {
                            this.log('✗ 重新获取农场状态失败', 'error');
                            return false;
                        }
                    }
                } else {
                    this.log('今日没有订单或订单功能未启用');
                }

                // 6. 计算种植方案
                const plantingPlan = this.calculatePlantingPlan(state, deliveredOrderKeys);

                if (Object.keys(plantingPlan).length === 0) {
                    this.log('\n没有可执行的种植方案');
                    // 即使没有种植方案，也继续执行抽奖
                    await this.lottery();
                    this.log('\n=== 任务完成 ===', 'success');
                    return true;
                }

                // 7. 执行种植
                this.log(`\n=== 执行种植方案 ===`);
                plots = state.plots || [];
                const grid = state.grid || {};
                const totalCount = grid.count || 0;

                // 获取空闲地块索引
                const occupiedIndices = new Set(
                    plots.filter(p => ['growing', 'ready'].includes(p.state)).map(p => p.plot_index)
                );
                const emptyPlots = [];
                for (let i = 0; i < totalCount; i++) {
                    if (!occupiedIndices.has(i)) {
                        emptyPlots.push(i);
                    }
                }

                let plotIndex = 0;
                for (const [cropKey, count] of Object.entries(plantingPlan)) {
                    if (plotIndex >= emptyPlots.length) {
                        break;
                    }

                    // 分配地块
                    const plotsToPlant = emptyPlots.slice(plotIndex, plotIndex + count);
                    plotIndex += count;

                    // 执行种植
                    await this.plantCrops(cropKey, plotsToPlant);
                    await this.sleep(2000, 4000);
                }

                // 8. 执行抽奖
                await this.lottery();

                this.log('\n=== 任务完成 ===', 'success');
                return true;
            } catch (error) {
                this.log(`\n执行过程中发生错误: ${error.message}`, 'error');
                return false;
            }
        }
    }

    /**
     * 创建悬浮按钮和日志窗口
     */
    function createUI() {
        // 创建悬浮按钮
        const button = document.createElement('div');
        button.id = 'windhub-auto-button';
        button.innerHTML = '🤖';
        button.title = '点击执行农场自动化';
        button.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 30px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });

        document.body.appendChild(button);

        // 创建日志窗口容器
        const logContainer = document.createElement('div');
        logContainer.id = 'windhub-log-container';
        logContainer.style.cssText = `
            position: fixed;
            bottom: 170px;
            right: 20px;
            width: 400px;
            height: 500px;
            background: rgba(255, 255, 255, 0.95);
            border: 2px solid #667eea;
            border-radius: 10px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 9998;
            display: none;
            flex-direction: column;
            overflow: hidden;
        `;

        // 创建标题栏
        const logHeader = document.createElement('div');
        logHeader.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 15px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        `;
        logHeader.innerHTML = `
            <span>🌾 农场自动化日志</span>
            <span id="windhub-close-log" style="cursor: pointer; font-size: 20px;">×</span>
        `;

        // 创建日志内容区域
        const logContent = document.createElement('div');
        logContent.id = 'windhub-log-content';
        logContent.style.cssText = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.6;
            background: #f8f9fa;
        `;

        logContainer.appendChild(logHeader);
        logContainer.appendChild(logContent);
        document.body.appendChild(logContainer);

        // 关闭日志窗口
        document.getElementById('windhub-close-log').addEventListener('click', () => {
            logContainer.style.display = 'none';
        });

        // 按钮点击事件
        let isRunning = false;
        button.addEventListener('click', async () => {
            if (isRunning) {
                alert('任务正在执行中，请勿重复点击！');
                return;
            }

            // 显示日志窗口
            logContainer.style.display = 'flex';
            logContent.innerHTML = '';

            // 禁用按钮
            isRunning = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
            button.innerHTML = '⏳';

            // 创建游戏实例
            const game = new WindHubGame();
            game.logWindow = logContent;

            // 执行任务
            try {
                await game.run();
            } catch (error) {
                game.log(`执行失败: ${error.message}`, 'error');
            } finally {
                // 恢复按钮
                isRunning = false;
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                button.innerHTML = '🤖';
            }
        });
    }

    // 页面加载完成后创建 UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();
