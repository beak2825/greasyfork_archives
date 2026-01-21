// ==UserScript==
// @name         WindHub 农场自动化助手
// @namespace    https://wcdk.224442.xyz/
// @version      4.1
// @description  自动播种、一键收割、自动卖出、自动兑换购买
// @author       You
// @match        https://wcdk.224442.xyz/farm.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563330/WindHub%20%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563330/WindHub%20%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'farmbot_data_v13';
    const LOGS_KEY = 'farmbot_logs';

    const CROPS = [
        { key: 'wheat',      icon: '🌾', name: '小麦' },
        { key: 'carrot',     icon: '🥕', name: '胡萝卜' },
        { key: 'potato',     icon: '🥔', name: '土豆' },
        { key: 'strawberry', icon: '🍓', name: '草莓' },
        { key: 'tomato',     icon: '🍅', name: '番茄' },
        { key: 'cabbage',    icon: '🥬', name: '卷心菜' },
        { key: 'corn',       icon: '🌽', name: '玉米' },
        { key: 'onion',      icon: '🧅', name: '洋葱' },
        { key: 'pepper',     icon: '🌶️', name: '辣椒' },
        { key: 'pumpkin',    icon: '🎃', name: '南瓜' },
        { key: 'blueberry',  icon: '🫐', name: '蓝莓' },
        { key: 'rice',       icon: '🍚', name: '水稻' },
        { key: 'cotton',     icon: '🧶', name: '棉花' },
    ];

    let inventoryCache = {};

    const getWalletBalance = () => {
        const el = document.getElementById('nav-wallet') || document.getElementById('cash-balance-num');
        if (!el) return 0;
        return parseInt(el.textContent.replace(/,/g, '')) || 0;
    };

    const loadConfig = () => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const defaults = {
            CROP_KEY: 'pumpkin',
            AUTO_SELL: true,
            PLANT_MODE: 'daily',
            AUTO_EXCHANGE_ENABLED: false,
            EXCHANGE_AMOUNT: 15000,
            BUY_PACK_QTY: 1,
            MAX_LOGS: 50,
            isRunning: false,
            stats: { harvested: 0, planted: 0, sold: 0, initialBalance: null }
        };
        if (!saved) return defaults;
        try {
            return { ...defaults, ...JSON.parse(saved) };
        } catch { return defaults; }
    };

    const saveConfig = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(CONFIG));

    let CONFIG = loadConfig();

    const getCropInfo = (key) => CROPS.find(c => c.key === (key || CONFIG.CROP_KEY)) || CROPS[9];

    let state = {
        timer: null,
        countdownTimer: null,
        nextCheckTime: 0
    };

    const getCSRFToken = () => {
        if (window.CSRF_TOKEN) return window.CSRF_TOKEN;
        const match = document.documentElement.innerHTML.match(/CSRF_TOKEN\s*=\s*["']([a-f0-9]{64})["']/);
        return match ? match[1] : '';
    };

    const API = {
        async getState() {
            const token = getCSRFToken();
            if (!token) throw new Error('无法获取 CSRF Token');
            const res = await fetch('api/farm_state.php', { headers: { 'X-CSRF-Token': token } });
            const json = await res.json();
            if (json.status !== 'success') throw new Error(json.message);
            return json.data;
        },
        async action(action, params = {}) {
            const token = getCSRFToken();
            if (!token) throw new Error('无法获取 CSRF Token');
            const form = new FormData();
            form.append('action', action);
            Object.entries(params).forEach(([k, v]) => form.append(k, v));
            const res = await fetch('api/farm_action.php', { method: 'POST', body: form, headers: { 'X-CSRF-Token': token } });
            const json = await res.json();
            if (json.status !== 'success') throw new Error(json.message);
            return json.data;
        },
        async exchange(amount) {
            const token = getCSRFToken();
            if (!token) throw new Error('无法获取 CSRF Token');
            const form = new FormData();
            form.append('amount', amount);
            const res = await fetch('api/wallet_exchange.php', { method: 'POST', body: form, headers: { 'X-CSRF-Token': token } });
            const json = await res.json();
            if (json.status !== 'success') throw new Error(json.message);
            return json.data;
        },
        async buyPack(qty) {
            const token = getCSRFToken();
            if (!token) throw new Error('无法获取 CSRF Token');
            const form = new FormData();
            form.append('item_key', 'farm_actions_pack');
            form.append('quantity', qty);
            const res = await fetch('api/store_purchase.php', { method: 'POST', body: form, headers: { 'X-CSRF-Token': token } });
            const json = await res.json();
            if (json.status !== 'success') throw new Error(json.message);
            return json.data;
        }
    };

    const Logger = {
        logs: [],
        load() {
            try {
                const saved = localStorage.getItem(LOGS_KEY);
                if (saved) this.logs = JSON.parse(saved);
            } catch { this.logs = []; }
        },
        save() {
            try {
                localStorage.setItem(LOGS_KEY, JSON.stringify(this.logs.slice(0, CONFIG.MAX_LOGS)));
            } catch {}
        },
        add(msg, type = 'info') {
            const time = new Date().toLocaleTimeString('zh-CN');
            const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌' };
            this.logs.unshift({ time, msg, type, icon: icons[type] || 'ℹ️' });
            if (this.logs.length > CONFIG.MAX_LOGS) this.logs.pop();
            this.save();
            this.render();
        },
        render() {
            const el = document.getElementById('farmbot-logs');
            if (!el) return;
            el.innerHTML = this.logs.map(l => `<div class="log-${l.type}">[${l.time}] ${l.icon} ${l.msg}</div>`).join('');
        },
        clear() {
            this.logs = [];
            this.save();
            this.render();
        }
    };

    const Countdown = {
        start(seconds) {
            this.stop();
            state.nextCheckTime = Date.now() + seconds * 1000;
            this.tick();
            state.countdownTimer = setInterval(() => this.tick(), 1000);
        },
        stop() {
            if (state.countdownTimer) {
                clearInterval(state.countdownTimer);
                state.countdownTimer = null;
            }
        },
        tick() {
            const remaining = Math.max(0, Math.ceil((state.nextCheckTime - Date.now()) / 1000));
            UI.updateCountdown(remaining);
        }
    };

    const formatBalance = (val) => {
        const prefix = val >= 0 ? '+' : '';
        return prefix + val.toLocaleString();
    };

    const doSupply = async (walletBalance) => {
        let success = false;
        
        if (CONFIG.EXCHANGE_AMOUNT >= 250) {
            if (walletBalance >= CONFIG.EXCHANGE_AMOUNT) {
                try {
                    await API.exchange(CONFIG.EXCHANGE_AMOUNT);
                    Logger.add(`兑换 ${CONFIG.EXCHANGE_AMOUNT.toLocaleString()} 钱包`, 'success');
                    success = true;
                } catch (e) {
                    Logger.add(`兑换失败: ${e.message}`, 'error');
                    return false;
                }
            } else {
                Logger.add(`钱包余额不足(${walletBalance.toLocaleString()})，无法补给`, 'warn');
                return false;
            }
        }

        if (success && CONFIG.BUY_PACK_QTY > 0) {
            try {
                await API.buyPack(CONFIG.BUY_PACK_QTY);
                Logger.add(`购买 ${CONFIG.BUY_PACK_QTY} 个农场包`, 'success');
            } catch (e) {
                Logger.add(`购买失败: ${e.message}`, 'error');
            }
        }

        return success;
    };

    const refreshInventory = async () => {
        try {
            const farmState = await API.getState();
            const inv = farmState.inventory?.items || [];
            inventoryCache = {};
            inv.forEach(item => {
                if (CROPS.find(c => c.key === item.key)) {
                    inventoryCache[item.key] = item.quantity || 0;
                }
            });
            UI.updateSellSection();
            return inventoryCache;
        } catch (e) {
            Logger.add(`获取库存失败: ${e.message}`, 'error');
            return {};
        }
    };

    // 计算卖出需要的体力（开启自动卖出且有库存时为1，否则为0）
    const getSellActionCost = (inventory, willHarvest = false) => {
        if (!CONFIG.AUTO_SELL) return 0;
        // 如果即将收割，肯定会有库存需要卖出
        if (willHarvest) return 1;
        // 检查当前是否有库存
        const cropItem = inventory?.find(i => i.key === CONFIG.CROP_KEY);
        return (cropItem && cropItem.quantity > 0) ? 1 : 0;
    };

    const Bot = {
        async cycle() {
            if (!CONFIG.isRunning) return;

            try {
                Countdown.stop();
                UI.updateStatus('checking');
                Logger.add('检查农场状态...');

                let farmState = await API.getState();
                let plots = farmState.plots || [];
                let profile = farmState.profile || {};
                let actionsLeft = (profile.daily_actions_cap || 0) - (profile.daily_actions_used || 0);
                let inventory = farmState.inventory?.items || [];

                const readyCount = plots.filter(p => p.state === 'ready').length;
                const growingCount = plots.filter(p => p.state === 'growing').length;
                const emptyCount = plots.filter(p => p.state === 'empty').length;

                const modeText = CONFIG.PLANT_MODE === 'daily' ? '日常' : '自动';
                Logger.add(`[${modeText}] 成熟${readyCount} 生长${growingCount} 空${emptyCount} | 体力${actionsLeft}`);

                let needRefresh = false;

                // ===== 自动播种模式：体力不足时先补给 =====
                // 计算需要的最小体力：收割 + 卖出（如果开启）
                if (CONFIG.PLANT_MODE === 'auto' && CONFIG.AUTO_EXCHANGE_ENABLED) {
                    const sellCost = getSellActionCost(inventory, readyCount > 0);
                    const minActionsNeeded = (readyCount > 0 ? readyCount : 0) + sellCost + (emptyCount > 0 ? 1 : 0);
                    
                    if (actionsLeft < minActionsNeeded && (readyCount > 0 || emptyCount > 0)) {
                        Logger.add(`体力不足(需${minActionsNeeded})，自动补给...`, 'warn');
                        const walletBalance = Number(farmState.wallet_balance || 0);
                        const supplied = await doSupply(walletBalance);
                        
                        if (supplied) {
                            needRefresh = true;
                            farmState = await API.getState();
                            plots = farmState.plots || [];
                            profile = farmState.profile || {};
                            actionsLeft = (profile.daily_actions_cap || 0) - (profile.daily_actions_used || 0);
                            inventory = farmState.inventory?.items || [];
                            Logger.add(`补给后体力: ${actionsLeft}`, 'info');
                        }
                    }
                }

                // ===== 收割 =====
                const readyPlots = plots.filter(p => p.state === 'ready');
                if (readyPlots.length > 0 && actionsLeft > 0) {
                    Logger.add(`收割 ${readyPlots.length} 块...`, 'success');
                    const result = await API.action('harvest_all', {});
                    CONFIG.stats.harvested += result.result?.harvested_count || readyPlots.length;
                    saveConfig();
                    needRefresh = true;
                    
                    const newState = await API.getState();
                    actionsLeft = (newState.profile?.daily_actions_cap || 0) - (newState.profile?.daily_actions_used || 0);
                    inventory = newState.inventory?.items || [];
                }

                // ===== 卖出 =====
                if (CONFIG.AUTO_SELL && actionsLeft > 0) {
                    const sellState = await API.getState();
                    const inv = sellState.inventory?.items || [];
                    const cropItem = inv.find(i => i.key === CONFIG.CROP_KEY);
                    if (cropItem && cropItem.quantity > 0) {
                        await API.action('sell_item', { item_key: CONFIG.CROP_KEY, quantity: cropItem.quantity });
                        CONFIG.stats.sold += cropItem.quantity;
                        saveConfig();
                        Logger.add(`卖出 ${cropItem.quantity} 个${getCropInfo().name} (消耗1体力)`, 'success');
                        needRefresh = true;
                        
                        // 更新体力
                        const afterSellState = await API.getState();
                        actionsLeft = (afterSellState.profile?.daily_actions_cap || 0) - (afterSellState.profile?.daily_actions_used || 0);
                    }
                } else if (CONFIG.AUTO_SELL && actionsLeft <= 0) {
                    const inv = (await API.getState()).inventory?.items || [];
                    const cropItem = inv.find(i => i.key === CONFIG.CROP_KEY);
                    if (cropItem && cropItem.quantity > 0) {
                        Logger.add(`有${cropItem.quantity}个${getCropInfo().name}待卖出，但体力不足`, 'warn');
                    }
                }

                // ===== 获取最新状态准备播种 =====
                let latestState = await API.getState();
                let latestProfile = latestState.profile || {};
                actionsLeft = (latestProfile.daily_actions_cap || 0) - (latestProfile.daily_actions_used || 0);
                let latestPlots = latestState.plots || [];
                let emptyPlots = latestPlots.filter(p => p.state === 'empty');
                let currentGrowingCount = latestPlots.filter(p => p.state === 'growing').length;

                // 自动播种模式：播种前如果体力不足再次补给
                if (CONFIG.PLANT_MODE === 'auto' && CONFIG.AUTO_EXCHANGE_ENABLED && actionsLeft <= 0 && emptyPlots.length > 0) {
                    Logger.add(`播种前体力不足，再次补给...`, 'warn');
                    const walletBalance = Number(latestState.wallet_balance || 0);
                    const supplied = await doSupply(walletBalance);
                    
                    if (supplied) {
                        needRefresh = true;
                        latestState = await API.getState();
                        latestProfile = latestState.profile || {};
                        actionsLeft = (latestProfile.daily_actions_cap || 0) - (latestProfile.daily_actions_used || 0);
                        latestPlots = latestState.plots || [];
                        currentGrowingCount = latestPlots.filter(p => p.state === 'growing').length;
                    }
                }

                emptyPlots = (latestState.plots || []).filter(p => p.state === 'empty');

                // ===== 播种 =====
                if (emptyPlots.length > 0 && actionsLeft > 0) {
                    const crops = latestState.crops || [];
                    const crop = crops.find(c => c.key === CONFIG.CROP_KEY);
                    
                    if (!crop) {
                        Logger.add(`未找到作物: ${CONFIG.CROP_KEY}`, 'error');
                    } else if (!crop.unlocked) {
                        Logger.add(`${getCropInfo().icon} ${getCropInfo().name} 未解锁 (需${crop.min_level}级)`, 'warn');
                    } else {
                        const cost = Number(crop.seed_cost || 0);
                        const walletBalance = Number(latestState.wallet_balance || 0);
                        const affordable = cost > 0 ? Math.floor(walletBalance / cost) : emptyPlots.length;
                        
                        let maxPlantByActions;
                        let skipPlanting = false;
                        
                        if (CONFIG.PLANT_MODE === 'daily') {
                            // 日常播种：需要预留体力收割所有作物（包括正在生长的）+ 卖出
                            // 设播种P块，当前生长G块，自动卖出需要1体力
                            // 需要体力：P（播种）+ (G + P)（收割）+ sellCost（卖出）= 2P + G + sellCost
                            // 所以 P <= (actionsLeft - G - sellCost) / 2
                            const sellCost = CONFIG.AUTO_SELL ? 1 : 0;
                            const availableForPlanting = actionsLeft - currentGrowingCount - sellCost;
                            maxPlantByActions = Math.max(0, Math.floor(availableForPlanting / 2));
                            
                            const minRequired = 2 + sellCost; // 至少需要播种1块+收割1块+卖出
                            
                            if (currentGrowingCount > 0 && maxPlantByActions <= 0) {
                                const reason = CONFIG.AUTO_SELL ? '收割和卖出' : '收割';
                                Logger.add(`已有${currentGrowingCount}块生长中，预留体力${reason}`, 'info');
                                skipPlanting = true;
                            } else if (actionsLeft < minRequired) {
                                const reason = CONFIG.AUTO_SELL ? '播种、收割和卖出' : '播种和收割';
                                Logger.add(`体力不足以${reason} (需≥${minRequired})`, 'warn');
                                skipPlanting = true;
                            }
                        } else {
                            // 自动播种：用尽所有体力
                            maxPlantByActions = actionsLeft;
                        }
                        
                        if (!skipPlanting) {
                            const canPlant = Math.min(emptyPlots.length, affordable, maxPlantByActions);
                            
                            if (canPlant <= 0 && affordable <= 0) {
                                Logger.add(`钱包不足: ${walletBalance.toLocaleString()}，种子${cost}/个`, 'warn');
                            } else if (canPlant > 0) {
                                const indices = emptyPlots.slice(0, canPlant).map(p => p.plot_index);
                                await API.action('plant_many', { crop_key: CONFIG.CROP_KEY, plot_indices: JSON.stringify(indices) });
                                CONFIG.stats.planted += canPlant;
                                saveConfig();
                                
                                if (CONFIG.PLANT_MODE === 'daily') {
                                    const totalGrowing = currentGrowingCount + canPlant;
                                    const sellCost = CONFIG.AUTO_SELL ? 1 : 0;
                                    const remainingActions = actionsLeft - canPlant;
                                    const reserveDetail = CONFIG.AUTO_SELL 
                                        ? `收割${totalGrowing}块+卖出` 
                                        : `收割${totalGrowing}块`;
                                    Logger.add(`播种 ${canPlant} 块${getCropInfo().name}，预留${remainingActions}体力${reserveDetail}`, 'success');
                                } else {
                                    Logger.add(`播种 ${canPlant} 块${getCropInfo().name}`, 'success');
                                }
                                needRefresh = true;
                            }
                        }
                    }
                } else if (emptyPlots.length > 0 && actionsLeft <= 0) {
                    Logger.add(`有空地但体力不足`, 'warn');
                }

                // 刷新页面
                if (needRefresh) {
                    UI.updateStats();
                    Logger.add('刷新页面...');
                    setTimeout(() => location.reload(), 500);
                    return;
                }

                const finalState = await API.getState();
                const growing = (finalState.plots || []).filter(p => p.state === 'growing');
                let nextCheck = 60;

                if (growing.length > 0) {
                    const minReady = Math.min(...growing.map(p => Number(p.ready_in_seconds || 0)));
                    if (minReady > 0) nextCheck = minReady + 3;
                }

                UI.updateStats();
                UI.updateStatus('idle');
                Countdown.start(nextCheck);
                Logger.add(`${nextCheck}s 后检查`);

                state.timer = setTimeout(() => this.cycle(), nextCheck * 1000);

            } catch (err) {
                Logger.add(`错误: ${err.message}`, 'error');
                UI.updateStatus('error');
                Countdown.start(30);
                state.timer = setTimeout(() => this.cycle(), 30000);
            }
        },

        start() {
            if (CONFIG.isRunning) return;
            
            const token = getCSRFToken();
            if (!token) {
                Logger.add('Token 未就绪，2s后重试...', 'warn');
                setTimeout(() => this.start(), 2000);
                return;
            }
            
            if (CONFIG.stats.initialBalance === null) {
                CONFIG.stats.initialBalance = getWalletBalance();
            }
            
            CONFIG.isRunning = true;
            saveConfig();
            
            const modeText = CONFIG.PLANT_MODE === 'daily' ? '日常模式' : '自动模式';
            Logger.add(`🤖 助手已启动 [${modeText}] ${getCropInfo().icon}${getCropInfo().name}`, 'success');
            UI.updateRunButton();
            UI.updateStatus('running');
            this.cycle();
        },

        stop() {
            CONFIG.isRunning = false;
            saveConfig();
            
            if (state.timer) {
                clearTimeout(state.timer);
                state.timer = null;
            }
            Countdown.stop();
            
            Logger.add('⏹️ 助手已停止', 'warn');
            UI.updateRunButton();
            UI.updateStatus('stopped');
            UI.updateCountdown(0);
        },

        toggle() {
            if (CONFIG.isRunning) {
                this.stop();
            } else {
                this.start();
            }
        },

        autoResume() {
            const token = getCSRFToken();
            if (!token) {
                setTimeout(() => this.autoResume(), 2000);
                return;
            }
            
            refreshInventory();
            
            if (CONFIG.isRunning) {
                const modeText = CONFIG.PLANT_MODE === 'daily' ? '日常模式' : '自动模式';
                Logger.add(`🔄 恢复运行 [${modeText}] ${getCropInfo().icon}${getCropInfo().name}`, 'info');
                UI.updateRunButton();
                UI.updateStatus('running');
                this.cycle();
            } else {
                UI.updateRunButton();
                UI.updateStatus('stopped');
            }
        }
    };

    const UI = {
        init() {
            const panel = document.createElement('div');
            panel.id = 'farmbot-panel';
            const currentBalance = getWalletBalance();
            const balanceChange = CONFIG.stats.initialBalance !== null ? currentBalance - CONFIG.stats.initialBalance : 0;
            const cropInfo = getCropInfo();
            
            const cropOptions = CROPS.map(c => 
                `<option value="${c.key}" ${c.key === CONFIG.CROP_KEY ? 'selected' : ''}>${c.icon} ${c.name}</option>`
            ).join('');

            const sellCropOptions = CROPS.map(c => 
                `<option value="${c.key}">${c.icon} ${c.name}</option>`
            ).join('');
            
            panel.innerHTML = `
                <style>
                    #farmbot-panel { position: fixed; top: 80px; left: 20px; width: 300px; background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #d4a853; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(212,168,83,0.2); z-index: 9999; font-family: system-ui, sans-serif; color: #fff; overflow: visible; }
                    .panel-header { background: linear-gradient(90deg, #d4a853 0%, #b8860b 100%); padding: 10px 14px; cursor: move; display: flex; justify-content: space-between; align-items: center; }
                    .panel-title { font-weight: 700; font-size: 13px; color: #1a1a2e; }
                    .header-btns { display: flex; gap: 6px; }
                    .header-btn { background: rgba(0,0,0,0.2); border: none; color: #1a1a2e; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px; }
                    .header-btn:hover { background: rgba(0,0,0,0.3); }
                    .panel-body { padding: 12px; }
                    .control-bar { display: flex; gap: 8px; margin-bottom: 10px; }
                    .run-btn { flex: 1; padding: 10px; border: none; border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                    .run-btn.start { background: linear-gradient(90deg, #4ade80, #22c55e); color: #fff; }
                    .run-btn.start:hover { background: linear-gradient(90deg, #22c55e, #16a34a); }
                    .run-btn.stop { background: linear-gradient(90deg, #f87171, #ef4444); color: #fff; }
                    .run-btn.stop:hover { background: linear-gradient(90deg, #ef4444, #dc2626); }
                    .crop-select { flex: 1; background: #0a0a0a; border: 1px solid #333; color: #d4a853; padding: 8px; border-radius: 6px; font-size: 12px; cursor: pointer; }
                    .crop-select:focus { outline: none; border-color: #d4a853; }
                    .mode-bar { display: flex; gap: 6px; margin-bottom: 10px; }
                    .mode-btn { flex: 1; padding: 8px; border: 1px solid #333; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.03); color: #888; }
                    .mode-btn.active { background: rgba(212,168,83,0.2); border-color: #d4a853; color: #d4a853; }
                    .mode-btn:hover:not(.active) { background: rgba(255,255,255,0.05); color: #aaa; }
                    .mode-hint { font-size: 10px; color: #666; padding: 6px 8px; background: rgba(255,255,255,0.02); border-radius: 4px; margin-bottom: 10px; }
                    .mode-hint.daily { border-left: 2px solid #4ade80; }
                    .mode-hint.auto { border-left: 2px solid #f59e0b; }
                    .status-bar { display: flex; align-items: center; gap: 8px; padding: 8px 10px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 10px; font-size: 12px; }
                    .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #666; flex-shrink: 0; }
                    .status-dot.running, .status-dot.idle { background: #4ade80; animation: pulse 1.5s infinite; }
                    .status-dot.checking { background: #facc15; }
                    .status-dot.error { background: #f87171; }
                    .status-dot.stopped { background: #666; animation: none; }
                    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                    .countdown { margin-left: auto; font-family: monospace; color: #d4a853; font-weight: bold; }
                    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px; }
                    .stat-item { background: rgba(255,255,255,0.05); padding: 8px 4px; border-radius: 5px; text-align: center; }
                    .stat-value { font-size: 14px; font-weight: 700; color: #d4a853; }
                    .stat-value.positive { color: #4ade80; }
                    .stat-value.negative { color: #f87171; }
                    .stat-label { font-size: 9px; color: #888; margin-top: 2px; }
                    .balance-info { display: flex; justify-content: space-between; padding: 6px 10px; background: rgba(255,255,255,0.03); border-radius: 5px; margin-bottom: 10px; font-size: 10px; color: #888; }
                    .balance-info span { color: #aaa; }
                    .section-title { font-size: 11px; color: #d4a853; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
                    .section-title button { background: rgba(212,168,83,0.3); border: none; color: #d4a853; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 10px; margin-left: auto; }
                    .section-title button:hover { background: rgba(212,168,83,0.5); }
                    .auto-settings-bar { display: none; align-items: center; padding: 8px 10px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 6px; margin-bottom: 10px; font-size: 11px; position: relative; }
                    .auto-settings-bar.show { display: flex; }
                    .auto-settings-info { flex: 1; color: #888; font-size: 10px; }
                    .auto-settings-info span { color: #aaa; }
                    .auto-settings-info.disabled { opacity: 0.5; }
                    .auto-controls { display: flex; align-items: center; gap: 8px; }
                    .auto-toggle { display: flex; align-items: center; gap: 4px; }
                    .auto-toggle input { width: 14px; height: 14px; accent-color: #f59e0b; margin: 0; }
                    .auto-toggle label { color: #f59e0b; font-weight: 600; cursor: pointer; font-size: 11px; }
                    .auto-settings-btn { background: rgba(245,158,11,0.3); border: none; color: #f59e0b; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 12px; }
                    .auto-settings-btn:hover { background: rgba(245,158,11,0.5); }
                    .settings-popup { display: none; position: absolute; top: 100%; left: 0; right: 0; margin-top: 8px; background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%); border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 10001; }
                    .settings-popup.show { display: block; }
                    .popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(245,158,11,0.3); }
                    .popup-title { font-size: 12px; font-weight: 600; color: #f59e0b; }
                    .popup-close { background: none; border: none; color: #888; font-size: 16px; cursor: pointer; padding: 0; line-height: 1; }
                    .popup-close:hover { color: #fff; }
                    .setting-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 11px; }
                    .setting-row:last-child { margin-bottom: 0; }
                    .setting-row label { color: #aaa; }
                    .setting-row input { width: 80px; background: #0a0a0a; border: 1px solid #333; color: #f59e0b; padding: 5px 8px; border-radius: 4px; text-align: right; font-size: 11px; }
                    .setting-hint { font-size: 10px; color: #666; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
                    .action-section { background: rgba(255,255,255,0.03); border-radius: 6px; padding: 8px; margin-bottom: 10px; }
                    .action-row { display: flex; gap: 6px; margin-bottom: 6px; }
                    .action-row:last-child { margin-bottom: 0; }
                    .action-row input { flex: 1; background: #0a0a0a; border: 1px solid #333; color: #d4a853; padding: 6px 8px; border-radius: 4px; font-size: 11px; }
                    .action-row select { flex: 1; background: #0a0a0a; border: 1px solid #333; color: #d4a853; padding: 6px 8px; border-radius: 4px; font-size: 11px; }
                    .action-row button { background: linear-gradient(90deg, #d4a853, #b8860b); border: none; color: #1a1a2e; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600; white-space: nowrap; }
                    .action-row button:hover { opacity: 0.9; }
                    .action-row button:disabled { opacity: 0.5; cursor: not-allowed; }
                    .sell-info { display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 10px; color: #888; }
                    .sell-info .qty { color: #4ade80; font-weight: 600; }
                    .sell-info .max-btn { background: rgba(74,222,128,0.2); border: 1px solid rgba(74,222,128,0.3); color: #4ade80; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 9px; }
                    .sell-info .max-btn:hover { background: rgba(74,222,128,0.3); }
                    .config-row { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px; font-size: 11px; margin-bottom: 10px; }
                    .config-row label { color: #aaa; }
                    .config-row input[type="checkbox"] { width: 14px; height: 14px; accent-color: #d4a853; }
                    .logs-container { background: #0a0a0a; border-radius: 5px; padding: 8px; max-height: 100px; overflow-y: auto; font-size: 10px; font-family: monospace; }
                    .logs-container::-webkit-scrollbar { width: 4px; }
                    .logs-container::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
                    #farmbot-logs > div { padding: 3px 0; border-bottom: 1px solid #1a1a1a; }
                    .log-success { color: #4ade80; }
                    .log-warn { color: #facc15; }
                    .log-error { color: #f87171; }
                    .log-info { color: #94a3b8; }
                    .reset-btn { width: 100%; margin-top: 8px; padding: 6px; background: rgba(248,113,113,0.2); border: 1px solid rgba(248,113,113,0.3); color: #f87171; border-radius: 4px; cursor: pointer; font-size: 11px; }
                    .reset-btn:hover { background: rgba(248,113,113,0.3); }
                </style>
                <div class="panel-header">
                    <div class="panel-title">${cropInfo.icon} 农场助手</div>
                    <div class="header-btns">
                        <button class="header-btn" id="clear-logs-btn">清空日志</button>
                    </div>
                </div>
                <div class="panel-body">
                    <div class="control-bar">
                        <button class="run-btn ${CONFIG.isRunning ? 'stop' : 'start'}" id="run-btn">
                            ${CONFIG.isRunning ? '⏹️ 停止' : '▶️ 启动'}
                        </button>
                        <select class="crop-select" id="crop-select">${cropOptions}</select>
                    </div>
                    <div class="mode-bar">
                        <button class="mode-btn ${CONFIG.PLANT_MODE === 'daily' ? 'active' : ''}" id="mode-daily">🌱 日常播种</button>
                        <button class="mode-btn ${CONFIG.PLANT_MODE === 'auto' ? 'active' : ''}" id="mode-auto">⚡ 自动播种</button>
                    </div>
                    <div class="mode-hint ${CONFIG.PLANT_MODE}" id="mode-hint">
                        ${CONFIG.PLANT_MODE === 'daily' 
                            ? '💡 预留体力收割' + (CONFIG.AUTO_SELL ? '+卖出' : '') + '，播种=(体力-生长中' + (CONFIG.AUTO_SELL ? '-1' : '') + ')÷2'
                            : '⚠️ 用尽体力播种，需配合自动补给'}
                    </div>
                    <div class="auto-settings-bar ${CONFIG.PLANT_MODE === 'auto' ? 'show' : ''}" id="auto-settings-bar">
                        <div class="auto-settings-info ${!CONFIG.AUTO_EXCHANGE_ENABLED ? 'disabled' : ''}" id="auto-info">
                            补给: <span id="display-exchange">${CONFIG.EXCHANGE_AMOUNT.toLocaleString()}</span>💰 → <span id="display-pack">${CONFIG.BUY_PACK_QTY}</span>包
                        </div>
                        <div class="auto-controls">
                            <div class="auto-toggle">
                                <input type="checkbox" id="cfg-auto-enabled" ${CONFIG.AUTO_EXCHANGE_ENABLED ? 'checked' : ''}>
                                <label for="cfg-auto-enabled">启用</label>
                            </div>
                            <button class="auto-settings-btn" id="open-settings-btn" title="设置">⚙️</button>
                        </div>
                        <div class="settings-popup" id="settings-popup">
                            <div class="popup-header">
                                <div class="popup-title">⚙️ 自动补给设置</div>
                                <button class="popup-close" id="close-settings-btn">×</button>
                            </div>
                            <div class="setting-row">
                                <label>兑换钱包金额</label>
                                <input type="number" id="cfg-exchange-amt" value="${CONFIG.EXCHANGE_AMOUNT}" min="0" step="250">
                            </div>
                            <div class="setting-row">
                                <label>购买农场包数量</label>
                                <input type="number" id="cfg-pack-qty" value="${CONFIG.BUY_PACK_QTY}" min="0" max="100">
                            </div>
                            <div class="setting-hint">💡 体力不足时：先兑换 → 再购买农场包</div>
                        </div>
                    </div>
                    <div class="status-bar">
                        <div class="status-dot ${CONFIG.isRunning ? 'running' : 'stopped'}" id="farmbot-dot"></div>
                        <span id="farmbot-status">${CONFIG.isRunning ? '运行中' : '已停止'}</span>
                        <span class="countdown" id="farmbot-countdown">--</span>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-item"><div class="stat-value" id="stat-harvested">${CONFIG.stats.harvested}</div><div class="stat-label">收割</div></div>
                        <div class="stat-item"><div class="stat-value" id="stat-planted">${CONFIG.stats.planted}</div><div class="stat-label">播种</div></div>
                        <div class="stat-item"><div class="stat-value" id="stat-sold">${CONFIG.stats.sold}</div><div class="stat-label">卖出</div></div>
                        <div class="stat-item"><div class="stat-value ${balanceChange >= 0 ? 'positive' : 'negative'}" id="stat-balance">${formatBalance(balanceChange)}</div><div class="stat-label">收支</div></div>
                    </div>
                    <div class="balance-info">
                        <div>基准: <span id="initial-balance">${CONFIG.stats.initialBalance !== null ? CONFIG.stats.initialBalance.toLocaleString() : '--'}</span></div>
                        <div>当前: <span id="current-balance">${currentBalance.toLocaleString()}</span></div>
                    </div>
                    <div class="action-section">
                        <div class="section-title">💰 手动操作</div>
                        <div class="action-row">
                            <input type="number" id="manual-exchange-amt" value="15000" min="250" step="250" placeholder="兑换金额">
                            <button id="manual-exchange-btn">兑换积分</button>
                        </div>
                        <div class="action-row">
                            <input type="number" id="manual-pack-qty" value="1" min="1" max="100" placeholder="数量">
                            <button id="manual-pack-btn">购买农场包</button>
                        </div>
                    </div>
                    <div class="action-section">
                        <div class="section-title">
                            📦 手动卖出
                            <button id="refresh-inv-btn">🔄 刷新</button>
                        </div>
                        <div class="action-row">
                            <select id="sell-crop-select">${sellCropOptions}</select>
                        </div>
                        <div class="sell-info">
                            库存: <span class="qty" id="sell-crop-qty">0</span> 个
                            <button class="max-btn" id="sell-max-btn">全部</button>
                        </div>
                        <div class="action-row">
                            <input type="number" id="sell-qty-input" value="0" min="0" placeholder="卖出数量">
                            <button id="manual-sell-btn">卖出</button>
                        </div>
                    </div>
                    <div class="config-row">
                        <label>自动卖出收获物 (消耗1体力)</label>
                        <input type="checkbox" id="cfg-autosell" ${CONFIG.AUTO_SELL ? 'checked' : ''}>
                    </div>
                    <div class="logs-container"><div id="farmbot-logs"></div></div>
                    <button class="reset-btn" id="farmbot-reset">重置统计</button>
                </div>
            `;
            document.body.appendChild(panel);
            this.bindEvents(panel);
            this.makeDraggable(panel);
        },

        updateSellSection() {
            const select = document.getElementById('sell-crop-select');
            const qtySpan = document.getElementById('sell-crop-qty');
            const qtyInput = document.getElementById('sell-qty-input');
            if (!select || !qtySpan || !qtyInput) return;

            const selectedKey = select.value;
            const qty = inventoryCache[selectedKey] || 0;
            qtySpan.textContent = qty;
            qtyInput.value = qty;
            qtyInput.max = qty;
        },

        updateModeUI() {
            const dailyBtn = document.getElementById('mode-daily');
            const autoBtn = document.getElementById('mode-auto');
            const hint = document.getElementById('mode-hint');
            const settingsBar = document.getElementById('auto-settings-bar');

            if (CONFIG.PLANT_MODE === 'daily') {
                dailyBtn.classList.add('active');
                autoBtn.classList.remove('active');
                hint.className = 'mode-hint daily';
                const sellPart = CONFIG.AUTO_SELL ? '+卖出' : '';
                const sellCost = CONFIG.AUTO_SELL ? '-1' : '';
                hint.textContent = `💡 预留体力收割${sellPart}，播种=(体力-生长中${sellCost})÷2`;
                settingsBar.classList.remove('show');
            } else {
                dailyBtn.classList.remove('active');
                autoBtn.classList.add('active');
                hint.className = 'mode-hint auto';
                hint.textContent = '⚠️ 用尽体力播种，需配合自动补给';
                settingsBar.classList.add('show');
            }
        },

        bindEvents(panel) {
            const popup = document.getElementById('settings-popup');
            const openBtn = document.getElementById('open-settings-btn');
            const closeBtn = document.getElementById('close-settings-btn');

            openBtn.addEventListener('click', (e) => { e.stopPropagation(); popup.classList.toggle('show'); });
            closeBtn.addEventListener('click', (e) => { e.stopPropagation(); popup.classList.remove('show'); });
            document.addEventListener('click', (e) => { if (!popup.contains(e.target) && e.target !== openBtn) popup.classList.remove('show'); });

            // 运行按钮
            document.getElementById('run-btn').addEventListener('click', () => Bot.toggle());

            // 模式切换
            document.getElementById('mode-daily').addEventListener('click', () => {
                if (CONFIG.PLANT_MODE === 'daily') return;
                CONFIG.PLANT_MODE = 'daily';
                saveConfig();
                this.updateModeUI();
                Logger.add('切换到日常播种模式', 'info');
            });

            document.getElementById('mode-auto').addEventListener('click', () => {
                if (CONFIG.PLANT_MODE === 'auto') return;
                CONFIG.PLANT_MODE = 'auto';
                saveConfig();
                this.updateModeUI();
                Logger.add('切换到自动播种模式', 'info');
            });

            // 作物选择
            document.getElementById('crop-select').addEventListener('change', (e) => {
                CONFIG.CROP_KEY = e.target.value;
                saveConfig();
                const info = getCropInfo();
                document.querySelector('.panel-title').textContent = `${info.icon} 农场助手`;
                Logger.add(`切换作物: ${info.icon} ${info.name}`, 'info');
            });

            // 卖出作物选择
            document.getElementById('sell-crop-select').addEventListener('change', () => {
                this.updateSellSection();
            });

            // 刷新库存
            document.getElementById('refresh-inv-btn').addEventListener('click', async function() {
                const btn = this;
                btn.disabled = true;
                btn.textContent = '...';
                await refreshInventory();
                btn.disabled = false;
                btn.textContent = '🔄 刷新';
                Logger.add('库存已刷新', 'info');
            });

            // 全部按钮
            document.getElementById('sell-max-btn').addEventListener('click', () => {
                const qty = parseInt(document.getElementById('sell-crop-qty').textContent) || 0;
                document.getElementById('sell-qty-input').value = qty;
            });

            // 手动卖出
            document.getElementById('manual-sell-btn').addEventListener('click', async function() {
                const btn = this;
                const select = document.getElementById('sell-crop-select');
                const input = document.getElementById('sell-qty-input');
                const cropKey = select.value;
                const qty = parseInt(input.value) || 0;
                const maxQty = inventoryCache[cropKey] || 0;

                if (qty <= 0) {
                    Logger.add('请输入卖出数量', 'warn');
                    return;
                }
                if (qty > maxQty) {
                    Logger.add(`库存不足，最多 ${maxQty} 个`, 'warn');
                    return;
                }

                btn.disabled = true;
                btn.textContent = '处理中...';
                try {
                    await API.action('sell_item', { item_key: cropKey, quantity: qty });
                    const info = getCropInfo(cropKey);
                    Logger.add(`手动卖出 ${qty} 个${info.name}`, 'success');
                    await refreshInventory();
                    setTimeout(() => location.reload(), 300);
                } catch (e) {
                    Logger.add(`卖出失败: ${e.message}`, 'error');
                    btn.disabled = false;
                    btn.textContent = '卖出';
                }
            });

            document.getElementById('clear-logs-btn').addEventListener('click', () => {
                Logger.clear();
                Logger.add('日志已清空', 'info');
            });

            document.getElementById('cfg-auto-enabled').addEventListener('change', (e) => {
                CONFIG.AUTO_EXCHANGE_ENABLED = e.target.checked;
                saveConfig();
                document.getElementById('auto-info').classList.toggle('disabled', !e.target.checked);
                Logger.add(`自动补给: ${CONFIG.AUTO_EXCHANGE_ENABLED ? '开启' : '关闭'}`);
            });

            document.getElementById('cfg-exchange-amt').addEventListener('change', (e) => {
                let val = parseInt(e.target.value) || 0;
                if (val > 0) val = Math.max(250, Math.floor(val / 250) * 250);
                e.target.value = val;
                CONFIG.EXCHANGE_AMOUNT = val;
                saveConfig();
                document.getElementById('display-exchange').textContent = val.toLocaleString();
            });

            document.getElementById('cfg-pack-qty').addEventListener('change', (e) => {
                let val = parseInt(e.target.value) || 0;
                val = Math.max(0, Math.min(100, val));
                e.target.value = val;
                CONFIG.BUY_PACK_QTY = val;
                saveConfig();
                document.getElementById('display-pack').textContent = val;
            });

            document.getElementById('cfg-autosell').addEventListener('change', (e) => {
                CONFIG.AUTO_SELL = e.target.checked;
                saveConfig();
                this.updateModeUI(); // 更新模式提示
                Logger.add(`自动卖出: ${CONFIG.AUTO_SELL ? '开启' : '关闭'}`);
            });

            document.getElementById('manual-exchange-btn').addEventListener('click', async function() {
                const btn = this;
                const input = document.getElementById('manual-exchange-amt');
                let amount = parseInt(input.value) || 0;
                amount = Math.max(250, Math.floor(amount / 250) * 250);
                input.value = amount;
                btn.disabled = true;
                btn.textContent = '处理中...';
                try {
                    await API.exchange(amount);
                    Logger.add(`手动兑换 ${amount.toLocaleString()} 钱包`, 'success');
                    setTimeout(() => location.reload(), 300);
                } catch (e) {
                    Logger.add(`兑换失败: ${e.message}`, 'error');
                    btn.disabled = false;
                    btn.textContent = '兑换积分';
                }
            });

            document.getElementById('manual-pack-btn').addEventListener('click', async function() {
                const btn = this;
                const input = document.getElementById('manual-pack-qty');
                let qty = parseInt(input.value) || 1;
                qty = Math.max(1, Math.min(100, qty));
                input.value = qty;
                btn.disabled = true;
                btn.textContent = '处理中...';
                try {
                    await API.buyPack(qty);
                    Logger.add(`手动购买 ${qty} 个农场包`, 'success');
                    setTimeout(() => location.reload(), 300);
                } catch (e) {
                    Logger.add(`购买失败: ${e.message}`, 'error');
                    btn.disabled = false;
                    btn.textContent = '购买农场包';
                }
            });

            document.getElementById('farmbot-reset').addEventListener('click', () => {
                if (confirm('确定重置统计数据？')) {
                    CONFIG.stats = { harvested: 0, planted: 0, sold: 0, initialBalance: getWalletBalance() };
                    saveConfig();
                    this.updateStats();
                    Logger.add('统计已重置', 'warn');
                }
            });
        },

        makeDraggable(panel) {
            const header = panel.querySelector('.panel-header');
            let isDragging = false, startX, startY, startLeft, startTop;
            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('header-btn')) return;
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = panel.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
            });
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                panel.style.left = startLeft + e.clientX - startX + 'px';
                panel.style.top = startTop + e.clientY - startY + 'px';
            });
            document.addEventListener('mouseup', () => { isDragging = false; });
        },

        updateRunButton() {
            const btn = document.getElementById('run-btn');
            if (!btn) return;
            if (CONFIG.isRunning) {
                btn.className = 'run-btn stop';
                btn.textContent = '⏹️ 停止';
            } else {
                btn.className = 'run-btn start';
                btn.textContent = '▶️ 启动';
            }
        },

        updateStatus(status) {
            const dot = document.getElementById('farmbot-dot');
            const text = document.getElementById('farmbot-status');
            if (!dot || !text) return;
            dot.className = 'status-dot ' + status;
            const texts = { running: '运行中', checking: '检查中...', idle: '等待中', error: '出错', stopped: '已停止' };
            text.textContent = texts[status] || status;
        },

        updateCountdown(seconds) {
            const el = document.getElementById('farmbot-countdown');
            if (el) {
                if (seconds <= 0 && !CONFIG.isRunning) {
                    el.textContent = '--';
                } else {
                    const m = Math.floor(seconds / 60);
                    const s = seconds % 60;
                    el.textContent = m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`;
                }
            }
        },

        updateStats() {
            document.getElementById('stat-harvested').textContent = CONFIG.stats.harvested;
            document.getElementById('stat-planted').textContent = CONFIG.stats.planted;
            document.getElementById('stat-sold').textContent = CONFIG.stats.sold;
            
            const currentBalance = getWalletBalance();
            const balanceChange = CONFIG.stats.initialBalance !== null ? currentBalance - CONFIG.stats.initialBalance : 0;
            const balanceEl = document.getElementById('stat-balance');
            balanceEl.textContent = formatBalance(balanceChange);
            balanceEl.className = 'stat-value ' + (balanceChange >= 0 ? 'positive' : 'negative');
            
            document.getElementById('initial-balance').textContent = CONFIG.stats.initialBalance !== null ? CONFIG.stats.initialBalance.toLocaleString() : '--';
            document.getElementById('current-balance').textContent = currentBalance.toLocaleString();
        }
    };

    Logger.load();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { UI.init(); Logger.render(); Bot.autoResume(); });
    } else {
        UI.init();
        Logger.render();
        Bot.autoResume();
    }
})();
