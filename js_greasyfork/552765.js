// ==UserScript==
// @name         [银河奶牛] 战斗市场小助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  基于生产采集增强的自动补货和自动售出功能，支持网页多开
// @author       RERoger
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552765/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E6%88%98%E6%96%97%E5%B8%82%E5%9C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552765/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E6%88%98%E6%96%97%E5%B8%82%E5%9C%BA%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 工具函数 ====================
    const utils = {
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // 获取当前角色ID
        getCurrentCharacterId() {
            return new URLSearchParams(window.location.search).get('characterId');
        },

        getCountById(id) {
            try {
                const headerElement = document.querySelector('.Header_header__1DxsV');
                if (!headerElement) {
                    console.warn(`[Utils] 未找到Header元素，无法获取物品 ${id} 数量`);
                    return 0;
                }

                const reactKey = Object.keys(headerElement).find(key => key.startsWith('__reactProps'));
                if (!reactKey) {
                    console.warn(`[Utils] 未找到React属性，无法获取物品 ${id} 数量`);
                    return 0;
                }

                const characterItemMap = headerElement[reactKey]?.children?.[0]?._owner?.memoizedProps?.characterItemMap;
                if (!characterItemMap) {
                    console.warn(`[Utils] 未找到characterItemMap，无法获取物品 ${id} 数量`);
                    return 0;
                }

                const searchSuffix = `::/item_locations/inventory::/items/${id}::0`;
                for (let [key, value] of characterItemMap) {
                    if (key.endsWith(searchSuffix)) {
                        const count = value?.count || 0;
                        console.log(`[Utils] 获取物品 ${id} 数量: ${count}`);
                        return count;
                    }
                }

                console.warn(`[Utils] 未找到物品 ${id} 在库存中的记录`);
                return 0;
            } catch (error) {
                console.warn(`[Utils] 获取物品 ${id} 数量失败:`, error);
                return 0;
            }
        },

        extractItemId(svgElement) {
            return svgElement?.querySelector('use')?.getAttribute('href')?.match(/#(.+)$/)?.[1] || null;
        },

        applyStyles(element, styles) {
            Object.assign(element.style, styles);
        },

        waitForElement(selector, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();
                const checkElement = () => {
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                    } else {
                        requestAnimationFrame(checkElement);
                    }
                };
                checkElement();
            });
        },

        // 创建图标元素（简化版本，直接使用MWI脚本的方式）
        createIconElement(itemId, iconHref) {
            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.style.cssText = 'max-width: 24px; max-height: 24px;';
            svgElement.setAttribute('data-item-id', itemId);

            const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            useElement.setAttribute('href', `/static/media/items_sprite.d4d08849.svg${iconHref}`);
            svgElement.appendChild(useElement);

            // 添加延迟重试机制，确保图标资源已加载
            setTimeout(() => {
                // 检查图标是否显示正常
                const rect = svgElement.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) {
                    console.log(`[Icon] 物品 ${itemId} 图标可能未加载，尝试重新创建`);
                    // 重新设置href属性
                    useElement.setAttribute('href', `/static/media/items_sprite.d4d08849.svg${iconHref}`);
                }
            }, 2000);

            return svgElement;
        }
    };

    // ==================== Toast 通知系统 ====================
    class Toast {
        constructor() {
            this.container = this.createContainer();
        }

        createContainer() {
            const container = document.createElement('div');
            container.id = 'mwi-toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
            return container;
        }

        show(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            const colors = {
                success: '#4caf50',
                error: '#f44336',
                warning: '#ff9800',
                info: '#2196f3'
            };

            toast.style.cssText = `
                background: ${colors[type] || colors.info};
                color: white;
                padding: 12px 16px;
                margin-bottom: 8px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                font-size: 14px;
                max-width: 300px;
                word-wrap: break-word;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                pointer-events: auto;
            `;

            toast.textContent = message;
            this.container.appendChild(toast);

            // 动画显示
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            });

            // 自动移除
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, duration);
        }
    }

    // ==================== API 接口 ====================
    class API {
        constructor() {
            this.api = window.MWIModules.api;
            this.isReady = false;
            this.lastMarketDataRequest = 0; // 跟踪上次市场数据请求时间
            this.minRequestInterval = 1000; // 最小请求间隔1秒
            this.init();
        }

        async init() {
            // 等待MWI脚本的API加载
            while (!this.api?.isReady) {
                await utils.delay(500);
            }
            this.isReady = true;
            console.log('[API] API初始化完成');
        }

        async checkAPI() {
            return this.isReady;
        }

        async batchDirectPurchase(items, delayBetween = 800) {
            if (!this.isReady || !window.MWIModules?.api) {
                throw new Error('API不可用');
            }
            return await window.MWIModules.api.batchDirectPurchase(items, delayBetween);
        }

        async batchBidOrder(items, delayBetween = 800) {
            if (!this.isReady || !window.MWIModules?.api) {
                throw new Error('API不可用');
            }
            return await window.MWIModules.api.batchBidOrder(items, delayBetween);
        }

        async getMarketData(itemHrid) {
            if (!window.PGE?.core) {
                throw new Error('游戏核心不可用');
            }

            const fullItemHrid = itemHrid.startsWith('/items/') ? itemHrid : `/items/${itemHrid}`;

            // 检查缓存（增加缓存时间到5分钟以减少网络请求）
            const cached = window.marketDataCache?.get(fullItemHrid);
            if (cached && Date.now() - cached.timestamp < 300000) {
                return cached.data;
            }

            // API频率限制：确保两次市场数据请求之间至少间隔1秒
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastMarketDataRequest;
            if (timeSinceLastRequest < this.minRequestInterval) {
                const waitTime = this.minRequestInterval - timeSinceLastRequest;
                console.log(`[API] 市场数据请求过于频繁，等待 ${waitTime}ms`);
                await utils.delay(waitTime);
            }

            // 更新最后请求时间
            this.lastMarketDataRequest = Date.now();

            // 等待市场数据响应
            const responsePromise = window.PGE.waitForMessage(
                'market_item_order_books_updated',
                8000,
                (responseData) => responseData.marketItemOrderBooks?.itemHrid === fullItemHrid
            );

            // 请求市场数据
            window.PGE.core.handleGetMarketItemOrderBooks(fullItemHrid);

            const response = await responsePromise;
            return response.marketItemOrderBooks;
        }

        async executeMarketOrder(itemHrid, enhancementLevel, quantity, price, isInstant) {
            if (!window.PGE?.core) {
                throw new Error('游戏核心不可用');
            }

            const successMessage = isInstant ? 'infoNotification.sellOrderCompleted' : 'infoNotification.sellListingProgress';
            const successPromise = window.PGE.waitForMessage('info', 15000, (responseData) =>
                responseData.message === successMessage
            );
            const errorPromise = window.PGE.waitForMessage('error', 15000);

            window.PGE.core.handlePostMarketOrder(true, itemHrid, enhancementLevel, quantity, price, isInstant);

            try {
                await Promise.race([
                    successPromise,
                    errorPromise.then(errorData => Promise.reject(new Error(errorData.message || '操作失败')))
                ]);
                return { success: true };
            } catch (error) {
                throw error;
            }
        }
    }

    // ==================== 自动补货管理器 ====================
    class AutoRestockManager {
        constructor() {
            this.characterId = utils.getCurrentCharacterId(); // 获取当前角色ID
            this.items = new Map(); // 补货物品列表
            this.isOpen = false;
            this.restockContainer = null;
            this.observer = null;
            this.checkInterval = null;
            this.isEnabled = true;
            this.checkIntervalMs = 3600000; // 默认3600秒检测间隔
            this.restockTabPosition = this.loadRestockTabPosition();
            this.allSelected = true;
            this.defaultPurchaseMode = 'ask'; // 默认购买方式：ask（直购）
            this.countdownInterval = null; // 倒计时定时器
            this.nextExecutionTime = null; // 下次执行时间
            this.lastExecutionTime = null; // 上次执行时间
            this.isExecuting = false; // 执行锁，防止重复执行
            this.init();
        }

        init() {
            this.loadRestockFromStorage();
            this.updateRestockBadge();
            this.setupMarketRestockButton();
            this.startAutoCheck();

            setTimeout(() => {
                this.updateRestockBadge();
                this.updateRestockDisplay();
            }, 0);
        }

        // 加载补货标签位置
        loadRestockTabPosition() {
            try {
                const saved = JSON.parse(localStorage.getItem(`milkyway-restock-tab-position-${this.characterId}`));
                return saved || { y: '60%' };
            } catch (error) {
                return { y: '60%' };
            }
        }

        // 保存补货标签位置
        saveRestockTabPosition() {
            try {
                localStorage.setItem(`milkyway-restock-tab-position-${this.characterId}`, JSON.stringify(this.restockTabPosition));
            } catch (error) {
                console.warn('保存补货标签位置失败:', error);
            }
        }

        setRestockTabInitialPosition() {
            const restockTab = document.getElementById('restock-tab');
            if (restockTab && this.restockTabPosition.y) {
                restockTab.style.top = this.restockTabPosition.y;
            }
        }

        // 创建补货抽屉（已由统一抽屉管理器接管）
        createRestockDrawer() {
            // 此方法已被UnifiedDrawerManager接管，不再创建独立界面
        }

        bindEvents() {
            // 补货标签点击事件将在setupRestockTabDragAndClick中处理

            // 检测间隔设置
            const checkIntervalInput = document.getElementById('check-interval-input');
            if (checkIntervalInput) {
                checkIntervalInput.value = Math.floor(this.checkIntervalMs / 1000);
                checkIntervalInput.addEventListener('change', (e) => {
                    // 解析用户输入（以秒为单位），并保证为有效数字
                    const raw = parseInt(e.target.value, 10);
                    const seconds = Number.isFinite(raw) && raw > 0 ? raw : null;
                    // 最低限制 5 秒（5000 ms）
                    this.checkIntervalMs = seconds ? Math.max(5000, seconds * 1000) : 5000;
                    // 将输入框回写为规范化后的秒数，避免空值或非法值导致 NaN
                    try { e.target.value = Math.floor(this.checkIntervalMs / 1000); } catch (err) {}
                    // 立即保存设置并重启检测
                    try { this.saveRestockToStorage && this.saveRestockToStorage(); } catch (err) {}
                    this.restartAutoCheck();
                });
            }

            // 全选控制
            const selectAllCheckbox = document.getElementById('restock-select-all-checkbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', (e) => {
                    this.allSelected = e.target.checked;
                    this.updateSelectAllState();
                });
            }

            // 自动检测开关
            const toggleAutoBtn = document.getElementById('restock-toggle-auto');
            if (toggleAutoBtn) {
                // 初始化按钮状态
                toggleAutoBtn.textContent = this.isEnabled ? '禁用自动检测' : '启用自动检测';
                toggleAutoBtn.style.backgroundColor = this.isEnabled ? 'rgba(244, 67, 54, 0.8)' : 'rgba(76, 175, 80, 0.8)';

                toggleAutoBtn.addEventListener('click', () => {
                    this.isEnabled = !this.isEnabled;
                    toggleAutoBtn.textContent = this.isEnabled ? '禁用自动检测' : '启用自动检测';
                    toggleAutoBtn.style.backgroundColor = this.isEnabled ? 'rgba(244, 67, 54, 0.8)' : 'rgba(76, 175, 80, 0.8)';

                    if (this.isEnabled) {
                        this.startAutoCheck();
                    } else {
                        this.stopAutoCheck();
                    }
                });
            }

            // 批量设置按钮
            const batchSetAskBtn = document.getElementById('restock-batch-set-ask');
            const batchSetBidBtn = document.getElementById('restock-batch-set-bid');
            if (batchSetAskBtn) {
                batchSetAskBtn.addEventListener('click', () => this.batchSetPurchaseMode('ask'));
            }
            if (batchSetBidBtn) {
                batchSetBidBtn.addEventListener('click', () => this.batchSetPurchaseMode('bid'));
            }

            // 执行补货按钮
            const executeBtn = document.getElementById('restock-execute-selected');
            if (executeBtn) {
                executeBtn.addEventListener('click', () => this.executeSelectedRestocks());
            }

            // 清空按钮
            const clearBtn = document.getElementById('restock-clear-all');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearRestock());
            }
        }

        // 开始自动检测
        startAutoCheck() {
            this.stopAutoCheck();
            // 校验间隔值，防止非法值导致 setInterval 行为异常
            if (!Number.isFinite(this.checkIntervalMs) || this.checkIntervalMs < 1000) {
                this.checkIntervalMs = 1000;
            }
            if (this.isEnabled && this.items.size > 0) {
                // 始终根据 lastExecutionTime 重新计算 nextExecutionTime，确保刷新后倒计时准确
                this.calculateNextExecutionTime();

                const now = Date.now();
                
                // 如果已过期且未在执行中，延迟100ms执行避免与定时器冲突
                if (now >= this.nextExecutionTime && !this.isExecuting) {
                    setTimeout(() => {
                        this.checkAndExecuteRestock();
                    }, 100);
                }

                // 设置定时检测（降低频率以减少CPU占用）
                this.checkInterval = setInterval(() => {
                    this.checkAndExecuteRestock();
                }, 30000); // 每30秒检查一次

                // 启动倒计时显示
                this.startCountdown();
            }
        }

        // 检查并执行补货（基于上次执行时间的距离）
        async checkAndExecuteRestock() {
            // 防止重复执行
            if (this.isExecuting) {
                console.log('[AutoRestock] 正在执行中，跳过本次检查');
                return;
            }

            const now = Date.now();

            // 优先使用已保存的 nextExecutionTime，避免刷新时重置倒计时
            if (!this.nextExecutionTime) {
                // 如果没有 nextExecutionTime，则尝试基于 lastExecutionTime 计算
                if (!this.lastExecutionTime) {
                    this.isExecuting = true;
                    try {
                        await this.checkAndRestock();
                        this.lastExecutionTime = Date.now();
                        this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
                        this.saveLastExecutionTime();
                        this.saveNextExecutionTime();
                    } catch (error) {
                        console.error('[AutoRestock] 执行失败:', error);
                    } finally {
                        this.isExecuting = false;
                    }
                    return;
                }
                this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
            }

            // 当到达或超过下次执行时间时，执行补货，并在完成后刷新下次执行时间
            if (now >= this.nextExecutionTime) {
                this.isExecuting = true;
                try {
                    await this.checkAndRestock();
                    this.lastExecutionTime = Date.now();
                    this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
                    this.saveLastExecutionTime();
                    this.saveNextExecutionTime();
                } catch (error) {
                    console.error('[AutoRestock] 执行失败:', error);
                } finally {
                    this.isExecuting = false;
                }
            }
        }

        // 停止自动检测
        stopAutoCheck() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
            this.stopCountdown();
        }

        // 重启自动检测
        restartAutoCheck() {
            this.startAutoCheck();
        }

        // 启动倒计时显示
        startCountdown() {
            this.stopCountdown();
            this.calculateNextExecutionTime();
            this.updateCountdownDisplay();

            this.countdownInterval = setInterval(() => {
                this.updateCountdownDisplay();
            }, 1000);
        }

        // 计算下次执行时间（基于上次执行时间）
        calculateNextExecutionTime() {
            const now = Date.now();

            // 如果 nextExecutionTime 已存在且未过期，保持不变
            if (this.nextExecutionTime && this.nextExecutionTime > now) {
                return;
            }

            // 如果 nextExecutionTime 不存在或已过期，重新计算
            if (!this.lastExecutionTime) {
                // 如果没有上次执行时间，下次执行时间就是现在
                this.nextExecutionTime = now;
            } else {
                // 基于上次执行时间计算下次执行时间
                this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
                
                // 如果计算出的时间仍然小于当前时间（说明间隔很久没检查了）
                // 则推进到下一个有效周期
                while (this.nextExecutionTime <= now) {
                    this.nextExecutionTime += this.checkIntervalMs;
                }
            }
        }

        // 保存下次执行时间到本地
        saveNextExecutionTime() {
            try {
                if (this.nextExecutionTime) {
                    localStorage.setItem(`milkyway-restock-next-execution-${this.characterId}`, this.nextExecutionTime.toString());
                }
            } catch (error) {
                console.warn('保存下次执行时间失败:', error);
            }
        }

        // 从本地加载下次执行时间
        loadNextExecutionTime() {
            try {
                const stored = localStorage.getItem(`milkyway-restock-next-execution-${this.characterId}`);
                if (stored) {
                    const ts = parseInt(stored, 10);
                    if (Number.isFinite(ts) && ts > 0) {
                        this.nextExecutionTime = ts;
                    }
                }
            } catch (error) {
                console.warn('加载下次执行时间失败:', error);
            }
        }

        // 停止倒计时显示
        stopCountdown() {
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            this.hideCountdownDisplay();
        }

        // 更新倒计时显示
        updateCountdownDisplay() {
            if (!this.nextExecutionTime) return;

            const now = Date.now();
            const remaining = Math.max(0, this.nextExecutionTime - now);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            const timerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const nextExecution = new Date(this.nextExecutionTime);
            const executionText = nextExecution.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            const timerElement = document.getElementById('restock-countdown-timer');
            const executionElement = document.getElementById('restock-next-execution');
            const displayElement = document.getElementById('restock-countdown-display');

            if (timerElement) timerElement.textContent = timerText;
            if (executionElement) executionElement.textContent = executionText;
            if (displayElement) displayElement.style.display = 'block';
        }

        // 隐藏倒计时显示
        hideCountdownDisplay() {
            const displayElement = document.getElementById('restock-countdown-display');
            if (displayElement) displayElement.style.display = 'none';
        }

        // 检查并补货
        async checkAndRestock() {
            if (!this.isEnabled || this.items.size === 0) return;

            const api = window.MWIModules?.api;
            const toast = window.MWIModules?.toast;

            if (!api?.isReady) {
                console.warn('[AutoRestock] API不可用，跳过检测');
                return;
            }

            const needRestock = [];

            for (const [itemId, item] of this.items) {
                if (!item.selected) continue;

                try {
                    const currentCount = utils.getCountById(itemId);
                    if (currentCount < item.targetQuantity) {
                        const needQuantity = item.targetQuantity - currentCount;
                        needRestock.push({
                            itemHrid: item.itemHrid,
                            quantity: needQuantity,
                            itemName: item.itemName,
                            purchaseMode: item.purchaseMode
                        });
                    }
                } catch (error) {
                    console.warn(`[AutoRestock] 检查物品 ${item.itemName} 数量失败:`, error);
                }
            }

            if (needRestock.length > 0) {
                console.log(`[AutoRestock] 发现 ${needRestock.length} 项需要补货`);
                await this.executeRestock(needRestock);
            }
        }

        // 执行补货
        async executeRestock(restockItems) {
            const api = window.MWIModules?.api;
            const toast = window.MWIModules?.toast;

            if (!api?.isReady) {
                toast?.show('API不可用，无法执行补货', 'error');
                return;
            }

            try {
                const askItems = restockItems.filter(item => item.purchaseMode === 'ask');
                const bidItems = restockItems.filter(item => item.purchaseMode === 'bid');

                const results = [];

                if (askItems.length > 0) {
                    const askResults = await api.batchDirectPurchase(askItems, 800);
                    results.push(...askResults);
                }

                if (bidItems.length > 0) {
                    const bidResults = await api.batchBidOrder(bidItems, 800);
                    results.push(...bidResults);
                }

                this.processRestockResults(results);

            } catch (error) {
                console.error('[AutoRestock] 补货执行失败:', error);
                toast?.show(`补货执行失败: ${error.message}`, 'error');
            }
        }


        // 处理补货结果
        processRestockResults(results) {
            const toast = window.MWIModules?.toast;
            let successCount = 0;

            results.forEach(result => {
                const statusText = result.success ? '补货成功' : '补货失败';
                const message = `${statusText} ${result.item.itemName || result.item.itemHrid} x${result.item.quantity}`;
                toast?.show(message, result.success ? 'success' : 'error');

                if (result.success) successCount++;
            });

            const finalMessage = successCount > 0 ?
                `补货完成: 成功 ${successCount}/${results.length} 项` :
                '所有补货操作失败';

            toast?.show(finalMessage, successCount > 0 ? 'success' : 'error', successCount > 0 ? 5000 : 3000);
        }

        // 添加物品到补货列表
        addItem(itemInfo, targetQuantity = 1, purchaseMode = 'ask') {
            const itemId = itemInfo.itemId || itemInfo.id;
            const itemHrid = itemInfo.itemHrid || `/items/${itemId}`;
            const itemName = itemInfo.itemName || itemInfo.name || '未知物品';
            const iconHref = itemInfo.iconHref || `#${itemId}`;

            if (this.items.has(itemId)) {
                // 更新现有项目
                const existing = this.items.get(itemId);
                existing.targetQuantity = targetQuantity;
                existing.purchaseMode = purchaseMode;
                console.log(`[AutoRestock] 更新现有物品 ${itemName}:`, existing);
            } else {
                // 添加新项目 - 确保包含所有必要字段
                const newItem = {
                    itemId,           // 物品ID
                    itemHrid,         // 物品HRID
                    itemName,         // 物品名称
                    iconHref,          // 图标引用
                    targetQuantity,    // 目标数量
                    purchaseMode,     // 购买方式
                    selected: true    // 是否选中
                };
                this.items.set(itemId, newItem);
            }

            // 保存并尽量刷新 UI。如果面板尚未挂载，延迟重试一次以防止刷新丢失
            this.updateRestockBadge();
            this.saveRestockToStorage();
            if (document.getElementById('restock-items-container')) {
                this.updateRestockDisplay();
            } else {
                setTimeout(() => {
                    try {
                        if (document.getElementById('restock-items-container')) this.updateRestockDisplay();
                    } catch (err) {}
                }, 300);
            }
            this.startAutoCheck();
        }

        // 移除补货项目
        removeItem(itemId) {
            this.items.delete(itemId);
            this.updateRestockDisplay();
            this.updateRestockBadge();
            this.saveRestockToStorage();

            if (this.items.size === 0) {
                this.stopAutoCheck();
            }
        }

        // 更新补货显示
        updateRestockDisplay() {
            const container = document.getElementById('restock-items-container');
            if (!container) return;

            if (this.items.size === 0) {
                container.innerHTML = `
                    <div style="
                        text-align: center;
                        color: var(--color-text-dark-mode);
                        padding: 20px;
                        font-size: 14px;
                    ">暂无补货项目</div>
                `;
                return;
            }

            container.innerHTML = '';

            this.items.forEach((item, itemId) => {
                const itemElement = this.createRestockItemElement(item);
                container.appendChild(itemElement);
            });

            // 更新统一抽屉的徽章
            if (window.MWIModules?.unifiedWarehouse) {
                window.MWIModules.unifiedWarehouse.updateBadge();
            }
        }

        // 创建购买方式滑动开关
        createPurchaseModeToggle(mode = 'ask') {
            const toggle = document.createElement('div');
            toggle.className = 'purchase-mode-toggle';
            toggle.setAttribute('data-mode', mode);

            const isAsk = mode === 'ask';
            const borderColor = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderBg = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderText = isAsk ? '直购' : '挂单';
            const sliderPosition = isAsk ? 'left: 2px' : 'right: 2px';
            const toggleBackgroundColor = 'var(--item-background)';

            toggle.style.cssText = `
                position: relative;
                width: 60px;
                height: 20px;
                background: ${toggleBackgroundColor};
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid ${borderColor};
                flex-shrink: 0;
            `;

            toggle.innerHTML = `
                <div class="toggle-slider" style="
                    position: absolute;
                    top: 1px;
                    ${sliderPosition};
                    width: 26px;
                    height: 14px;
                    background: ${sliderBg};
                    border-radius: 7px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 8px;
                    font-weight: bold;
                ">${sliderText}</div>
                <div style="
                    position: absolute;
                    top: 1px;
                    left: 2px;
                    width: 26px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${isAsk ? 'var(--color-text-dark-mode)' : 'var(--color-neutral-400)'};
                    font-size: 8px;
                    font-weight: bold;
                ">直购</div>
                <div style="
                    position: absolute;
                    top: 1px;
                    right: 2px;
                    width: 26px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${isAsk ? 'var(--color-neutral-400)' : 'var(--color-text-dark-mode)'};
                    font-size: 8px;
                    font-weight: bold;
                ">挂单</div>
            `;

            return toggle;
        }

        // 创建补货项目元素
        createRestockItemElement(item) {
            const div = document.createElement('div');
            div.className = 'restock-item';
            div.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                margin-bottom: 8px;
                background-color: var(--item-background);
                border: 1px solid var(--item-border);
                border-radius: 6px;
                transition: all 0.2s ease;
            `;

            // 创建购买方式切换器
            const purchaseToggle = this.createPurchaseModeToggle(item.purchaseMode || 'bid');
            purchaseToggle.setAttribute('data-item-id', item.itemId);

            div.innerHTML = `
                <!-- 选择框 -->
                <input type="checkbox" ${item.selected ? 'checked' : ''} style="
                    margin-right: 8px;
                    transform: scale(1.2);
                    cursor: pointer;
                ">

                <!-- 物品图标 -->
                <div data-item-icon="${item.itemId}" style="
                    width: 32px;
                    height: 32px;
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--item-background);
                    border-radius: 4px;
                    cursor: pointer;
                ">
                </div>

                <!-- 物品信息 -->
                <div style="flex: 1; color: var(--color-text-dark-mode); min-width: 0;">
                    <div style="font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.itemName}</div>
                </div>

                <!-- 控制区域 -->
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                    <!-- 购买方式切换器 -->
                    ${purchaseToggle.outerHTML}

                    <!-- 目标数量输入 -->
                <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-size: 11px; color: var(--color-text-dark-mode);">目标</span>
                        <input
                            type="number"
                            value="${item.targetQuantity}"
                            min="1"
                            max="999999"
                            data-item-id="${item.itemId}"
                            style="
                                width: 80px;
                                padding: 4px 6px;
                                background-color: var(--item-background);
                                border: 1px solid var(--item-border);
                        border-radius: 3px;
                        color: var(--color-text-dark-mode);
                        font-size: 11px;
                                text-align: right;
                            "
                        >
                    </div>

                    <!-- 删除按钮 -->
                    <button
                        data-remove-item="${item.itemId}"
                        style="
                            background: none;
                        border: none;
                            color: #c0c0c0;
                        cursor: pointer;
                            padding: 4px;
                            border-radius: 3px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                        "
                        title="删除"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            `;

            // 绑定事件
            const checkbox = div.querySelector('input[type="checkbox"]');
            const quantityInput = div.querySelector('input[type="number"]');
            const purchaseToggleElement = div.querySelector('.purchase-mode-toggle');
            const removeBtn = div.querySelector('[data-remove-item]');

            checkbox.addEventListener('change', (e) => {
                item.selected = e.target.checked;
                this.updateSelectAllState();
                this.saveRestockToStorage();
            });

            quantityInput.addEventListener('change', (e) => {
                const newValue = Math.max(1, parseInt(e.target.value) || 1);
                console.log(`[AutoRestock] 修改物品 ${item.itemName} 的目标数量: ${item.targetQuantity} -> ${newValue}`);
                item.targetQuantity = newValue;
                this.saveRestockToStorage();
                console.log(`[AutoRestock] 已保存到本地存储`);
            });

            // 购买方式切换器事件
            purchaseToggleElement.addEventListener('click', () => {
                const currentMode = purchaseToggleElement.getAttribute('data-mode');
                const newMode = currentMode === 'ask' ? 'bid' : 'ask';

                purchaseToggleElement.setAttribute('data-mode', newMode);
                item.purchaseMode = newMode;

                // 更新切换器样式
                const isAsk = newMode === 'ask';
                const borderColor = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
                const sliderBg = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
                const sliderText = isAsk ? '直购' : '挂单';

                purchaseToggleElement.style.borderColor = borderColor;
                const slider = purchaseToggleElement.querySelector('.toggle-slider');
                slider.style.backgroundColor = sliderBg;
                slider.style.left = isAsk ? '2px' : 'auto';
                slider.style.right = isAsk ? 'auto' : '2px';
                slider.textContent = sliderText;

                // 更新标签颜色
                const labels = purchaseToggleElement.querySelectorAll('div:not(.toggle-slider)');
                labels[0].style.color = isAsk ? 'var(--color-text-dark-mode)' : 'var(--color-neutral-400)';
                labels[1].style.color = isAsk ? 'var(--color-neutral-400)' : 'var(--color-text-dark-mode)';

                this.saveRestockToStorage();
            });

            removeBtn.addEventListener('click', () => {
                this.removeItem(item.itemId);
            });

            // 动态创建图标
            const iconContainer = div.querySelector('[data-item-icon]');
            if (iconContainer && item.iconHref) {
                const iconElement = utils.createIconElement(item.itemId, item.iconHref);
                iconContainer.appendChild(iconElement);
            }

            return div;
        }

        // 更新全选状态
        updateSelectAllState() {
            const selectAllCheckbox = document.getElementById('restock-select-all-checkbox');
            if (!selectAllCheckbox) return;

            const selectedItems = Array.from(this.items.values()).filter(item => item.selected);
            const allSelected = selectedItems.length === this.items.size && this.items.size > 0;

            selectAllCheckbox.checked = allSelected;
            this.allSelected = allSelected;
        }

        // 批量设置购买方式
        batchSetPurchaseMode(mode) {
            this.items.forEach(item => {
                item.purchaseMode = mode;
            });
            this.updateRestockDisplay();
            this.saveRestockToStorage();
        }

        // 执行选中的补货
        async executeSelectedRestocks() {
            const selectedItems = Array.from(this.items.values()).filter(item => item.selected);

            if (selectedItems.length === 0) {
                window.MWIModules?.toast?.show('请选择要补货的项目', 'warning');
                return;
            }

            const restockItems = [];
            for (const item of selectedItems) {
                try {
                    const currentCount = utils.getCountById(item.itemId);
                    if (currentCount < item.targetQuantity) {
                        const needQuantity = item.targetQuantity - currentCount;
                        restockItems.push({
                            itemHrid: item.itemHrid,
                            quantity: needQuantity,
                            itemName: item.itemName,
                            purchaseMode: item.purchaseMode
                        });
                    }
                } catch (error) {
                    console.warn(`[AutoRestock] 检查物品 ${item.itemName} 数量失败:`, error);
                }
            }

            if (restockItems.length === 0) {
                window.MWIModules?.toast?.show('所有选中项目库存充足，无需补货', 'info');
                return;
            }

            await this.executeRestock(restockItems);

            // 手动执行后刷新上次执行时间与下次执行时间（并持久化）
            this.lastExecutionTime = Date.now();
            this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
            this.saveLastExecutionTime();
            this.saveNextExecutionTime();
        }

        // 清空补货列表
        clearRestock() {
            this.items.clear();
            this.updateRestockDisplay();
            this.updateRestockBadge();
            this.saveRestockToStorage();
            this.stopAutoCheck();
        }

        // 切换补货界面
        toggleRestock() {
            this.isOpen ? this.closeRestock() : this.openRestock();
        }

        // 打开补货界面
        openRestock() {
            if (this.restockContainer) {
                this.restockContainer.style.transform = 'translateX(0)';
                this.isOpen = true;
            }
        }

        // 关闭补货界面
        closeRestock() {
            if (this.restockContainer) {
                const translateX = Math.min(window.innerWidth, 450);
                this.restockContainer.style.transform = `translateX(${translateX}px)`;
                this.isOpen = false;
            }
        }

        // 更新补货徽章
        updateRestockBadge() {
            const badge = document.getElementById('restock-tab-badge');
            const countDisplay = document.getElementById('restock-count-display');

            if (badge) {
                if (this.items.size > 0) {
                    badge.textContent = this.items.size;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }

            if (countDisplay) {
                countDisplay.textContent = `${this.items.size} 项`;
            }
        }

        // 设置市场补货按钮
        setupMarketRestockButton() {
            this.observer = new MutationObserver((mutationsList) => {
                this.handleMarketRestockButton(mutationsList);
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        // 处理市场补货按钮
        handleMarketRestockButton(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查商店界面
                            if (node.classList?.contains('Market_marketPage__2Qz8L')) {
                                this.addRestockButtonsToMarket(node);
                            }
                            // 检查市场导航按钮容器
                            if (node.classList && [...node.classList].some(c => c.startsWith('MarketplacePanel_marketNavButtonContainer'))) {
                                this.addRestockButtonToMarketNav(node);
                            }
                            // 检查物品详情
                            if (node.querySelector?.('.Item_actionMenu__2yUcG')) {
                                this.addRestockButtonsToItemMenu(node.querySelector('.Item_actionMenu__2yUcG'));
                            }
                        }
                    });
                }
            }
        }

        // 在市场导航按钮容器添加补货按钮
        addRestockButtonToMarketNav(navContainer) {
            const buttons = navContainer.querySelectorAll('button');
            if (buttons.length > 0 && !navContainer.querySelector('.market-restock-btn')) {
                const lastButton = buttons[buttons.length - 1];
                const restockButton = lastButton.cloneNode(true);
                restockButton.textContent = '加入自动补货';
                restockButton.classList.add('market-restock-btn');
                restockButton.style.backgroundColor = 'rgba(255, 152, 0, 0.8)';
                restockButton.onclick = () => {
                    this.addCurrentMarketItemToRestock();
                };
                // 将补货按钮添加到原有按钮后面
                navContainer.appendChild(restockButton);

                // 添加购物车按钮
                this.addCartButtonToMarketNav(navContainer);
            }
        }

        // 添加购物车按钮到市场导航
        addCartButtonToMarketNav(navContainer) {
            if (navContainer.querySelector('.market-cart-btn')) return;

            const buttons = navContainer.querySelectorAll('button');
            if (buttons.length > 0) {
                const lastButton = buttons[buttons.length - 1];
                const cartButton = lastButton.cloneNode(true);
                cartButton.textContent = LANG.addToCart;
                cartButton.classList.add('market-cart-btn');
                cartButton.style.backgroundColor = 'rgba(76, 175, 80, 0.8)';
                cartButton.onclick = () => {
                    // 调用购物车管理器的方法
                    window.MWIModules?.shoppingCart?.addCurrentMarketItemToCart();
                };
                navContainer.appendChild(cartButton);

                // 添加出售按钮
                const sellManager = window.MWIModules?.autoSell;
                if (sellManager) {
                    sellManager.addSellButtonToMarketNav(navContainer);
                }
            }
        }

        // 在商店界面添加补货按钮
        addRestockButtonsToMarket(marketContainer) {
            const itemContainers = marketContainer.querySelectorAll('.Item_itemContainer__x7kH1');

            itemContainers.forEach(container => {
                if (container.dataset.restockButtonAdded) return;

                const itemId = this.extractItemId(container);
                if (!itemId) return;

                const itemName = container.querySelector('.Item_itemName__2Qz8L')?.textContent || '未知物品';
                const itemHrid = `/items/${itemId}`;

                const button = this.createAddToRestockButton(itemId, itemHrid, itemName);

                // 找到合适的位置插入按钮
                const actionArea = container.querySelector('.Item_itemActions__2Qz8L') || container;
                actionArea.appendChild(button);

                container.dataset.restockButtonAdded = 'true';
            });
        }

        // 在物品菜单添加补货按钮
        addRestockButtonsToItemMenu(menuContainer) {
            if (menuContainer.dataset.restockButtonAdded) return;

            const itemId = this.extractItemIdFromMenu(menuContainer);
            if (!itemId) return;

            const itemName = menuContainer.querySelector('.Item_itemName__2Qz8L')?.textContent || '未知物品';
            const itemHrid = `/items/${itemId}`;

            const button = this.createAddToRestockButton(itemId, itemHrid, itemName);
            menuContainer.appendChild(button);

            menuContainer.dataset.restockButtonAdded = 'true';
        }

        // 创建加入补货按钮
        createAddToRestockButton(itemId, itemHrid, itemName) {
            const button = document.createElement('button');
            button.className = 'Button_button__1Fe9z Button_restock__3FNpM Button_fullWidth__17pVU add-to-restock-btn';
            button.textContent = '加入补货';
            button.style.cssText = `
                background-color: rgba(255, 152, 0, 0.8);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: background-color 0.2s;
                margin-top: 4px;
            `;

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addItem({
                    itemId,
                    itemHrid,
                    itemName,
                    iconHref: `#${itemId}`
                }, 1, 'ask');
                window.MWIModules?.toast?.show(`已添加 ${itemName} 到补货列表`, 'success');
            });

            return button;
        }

        // 提取物品ID
        extractItemId(container) {
            const svgElement = container.querySelector('svg use');
            if (svgElement) {
                const href = svgElement.getAttribute('href');
                const match = href?.match(/#(.+)$/);
                return match ? match[1] : null;
            }
            return null;
        }

        // 从菜单提取物品ID
        extractItemIdFromMenu(menuContainer) {
            // 这里需要根据实际的菜单结构来实现
            // 暂时返回null，需要根据实际情况调整
            return null;
        }

        // 添加当前市场物品到补货列表
        addCurrentMarketItemToRestock() {
            try {
                const currentItem = document.querySelector('.MarketplacePanel_currentItem__3ercC');
                const svgElement = currentItem?.querySelector('svg[aria-label]');
                const useElement = svgElement?.querySelector('use');

                if (!svgElement || !useElement) {
                    window.MWIModules?.toast?.show('未找到当前物品信息', 'error');
                    return;
                }

                const itemName = svgElement.getAttribute('aria-label');
                const itemId = useElement.getAttribute('href')?.split('#')[1];

                if (!itemName || !itemId) {
                    window.MWIModules?.toast?.show('无法获取物品信息', 'error');
                    return;
                }

                const itemHrid = `/items/${itemId}`;

                this.addItem({
                    itemId,
                    itemHrid,
                    itemName,
                    iconHref: `#${itemId}`
                }, 1, 'ask');

                window.MWIModules?.toast?.show(`已添加 ${itemName} 到补货列表`, 'success');
            } catch (error) {
                console.error('[AutoRestock] 添加市场物品到补货列表失败:', error);
                window.MWIModules?.toast?.show('添加失败，请重试', 'error');
            }
        }

        // 保存补货数据到存储
        saveRestockToStorage() {
            try {
                const itemsArray = Array.from(this.items.entries());

                const data = {
                    items: itemsArray,
                    checkIntervalMs: this.checkIntervalMs,
                    isEnabled: this.isEnabled,
                    lastExecutionTime: this.lastExecutionTime,
                    nextExecutionTime: this.nextExecutionTime
                };
                localStorage.setItem(`milkyway-restock-data-${this.characterId}`, JSON.stringify(data));
                console.log(`[AutoRestock] 保存数据到localStorage:`, {
                    itemsCount: this.items.size,
                    checkIntervalMs: this.checkIntervalMs,
                    isEnabled: this.isEnabled
                });
            } catch (error) {
                console.warn('保存补货数据失败:', error);
            }
        }

        // 保存上次执行时间
        saveLastExecutionTime() {
            try {
                localStorage.setItem(`milkyway-restock-last-execution-${this.characterId}`, this.lastExecutionTime.toString());
            } catch (error) {
                console.warn('保存上次执行时间失败:', error);
            }
        }

        // 从存储加载补货数据
        loadRestockFromStorage() {
            try {
                const data = JSON.parse(localStorage.getItem(`milkyway-restock-data-${this.characterId}`));
                if (data) {
                    if (data.items) {
                        this.items = new Map(data.items);

                        // 确保每个物品都有必要的字段
                        this.items.forEach((item, itemId) => {
                            console.log(`[AutoRestock] 加载物品 ${item.itemName || itemId}:`, {
                                itemId: item.itemId,
                                targetQuantity: item.targetQuantity,
                                purchaseMode: item.purchaseMode,
                                selected: item.selected
                            });

                            // 修复itemId字段
                            if (typeof item.itemId === 'undefined' || item.itemId === null) {
                                console.log(`[AutoRestock] 修复 ${item.itemName || itemId} 的 itemId: undefined -> ${itemId}`);
                                item.itemId = itemId;
                            }
                            if (typeof item.targetQuantity === 'undefined' || item.targetQuantity === null) {
                                console.log(`[AutoRestock] 修复 ${item.itemName || itemId} 的 targetQuantity: undefined -> 1`);
                                item.targetQuantity = 1;
                            }
                            if (typeof item.purchaseMode === 'undefined' || item.purchaseMode === null) {
                                item.purchaseMode = 'ask';
                            }
                            if (typeof item.selected === 'undefined' || item.selected === null) {
                                item.selected = true;
                            }
                        });
                    }
                    if (data.checkIntervalMs) {
                        let ms = Number(data.checkIntervalMs);
                        this.checkIntervalMs = Number.isFinite(ms) && ms >= 5000 ? ms : 5000;
                    }
                    if (typeof data.isEnabled === 'boolean') {
                        this.isEnabled = data.isEnabled;
                    }
                    if (typeof data.lastExecutionTime === 'number') {
                        this.lastExecutionTime = data.lastExecutionTime;
                    }
                    if (typeof data.nextExecutionTime === 'number') {
                        this.nextExecutionTime = data.nextExecutionTime;
                    }
                }

                // 尝试从单独的时间存储加载
                if (!this.lastExecutionTime) {
                    const lastExec = localStorage.getItem(`milkyway-restock-last-execution-${this.characterId}`);
                    if (lastExec) {
                        this.lastExecutionTime = parseInt(lastExec, 10);
                    }
                }
            
                // 尝试从单独的 nextExecution 存储加载（向后兼容）
                if (!this.nextExecutionTime) {
                    try {
                        const nextExec = localStorage.getItem(`milkyway-restock-next-execution-${this.characterId}`);
                        if (nextExec) this.nextExecutionTime = parseInt(nextExec, 10);
                    } catch (err) {}
                }
            } catch (error) {
                console.warn('加载补货数据失败:', error);
            }
            // 如果界面已经创建，更新时分秒显示
            try {
                if (window.MWIModules?.unifiedWarehouse?.updateRestockIntervalDisplay) {
                    window.MWIModules.unifiedWarehouse.updateRestockIntervalDisplay();
                }
            } catch (err) {
                // noop
            }
        }

        // 设置补货标签拖拽和点击（已由统一抽屉管理器接管）
        setupRestockTabDragAndClick() {
            // 此方法已被UnifiedDrawerManager接管，不再需要独立处理
        }

        // 清理资源
        cleanup() {
            this.stopAutoCheck();
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.restockContainer) {
                this.restockContainer.remove();
                this.restockContainer = null;
            }
        }
    }

    // ==================== 自动出售管理器 ====================
    class AutoSellManager {
        constructor() {
            this.characterId = utils.getCurrentCharacterId(); // 获取当前角色ID
            this.items = new Map(); // 自动出售物品列表
            this.isOpen = false;
            this.sellContainer = null;
            this.observer = null;
            this.checkInterval = null;
            this.isEnabled = true;
            this.checkIntervalMs = 3600000; // 默认3600秒检测间隔
            this.sellTabPosition = this.loadSellTabPosition();
            this.allSelected = true;
            this.defaultSellMode = 'ask'; // 默认出售方式：ask（挂单）
            this.countdownInterval = null; // 倒计时定时器
            this.nextExecutionTime = null; // 下次执行时间
            this.lastExecutionTime = null; // 上次执行时间
            this.isExecuting = false; // 执行锁，防止重复执行
            this.init();
        }

        init() {
            this.loadSellFromStorage();
            this.updateSellBadge();
            this.setupMarketSellButton();
            this.startAutoCheck();

            setTimeout(() => {
                this.updateSellBadge();
                this.updateSellDisplay();
            }, 0);
        }

        // 加载出售标签位置
        loadSellTabPosition() {
            try {
                const saved = JSON.parse(localStorage.getItem(`milkyway-sell-tab-position-${this.characterId}`));
                return saved || { y: '70%' };
            } catch (error) {
                return { y: '70%' };
            }
        }

        // 保存出售标签位置
        saveSellTabPosition() {
            try {
                localStorage.setItem(`milkyway-sell-tab-position-${this.characterId}`, JSON.stringify(this.sellTabPosition));
            } catch (error) {
                console.warn('保存出售标签位置失败:', error);
            }
        }

        setSellTabInitialPosition() {
            const sellTab = document.getElementById('sell-tab');
            if (sellTab && this.sellTabPosition.y) {
                sellTab.style.top = this.sellTabPosition.y;
            }
        }

        // 创建出售抽屉（已由统一抽屉管理器接管）
        createSellDrawer() {
            // 此方法已被UnifiedDrawerManager接管，不再创建独立界面
        }

        bindEvents() {
            // 出售标签点击事件将在setupSellTabDragAndClick中处理

            // 检测间隔设置
            const checkIntervalInput = document.getElementById('sell-check-interval-input');
            if (checkIntervalInput) {
                checkIntervalInput.value = Math.floor(this.checkIntervalMs / 1000);
                checkIntervalInput.addEventListener('change', (e) => {
                    const raw = parseInt(e.target.value, 10);
                    const seconds = Number.isFinite(raw) && raw > 0 ? raw : null;
                    this.checkIntervalMs = seconds ? Math.max(5000, seconds * 1000) : 5000;
                    try { e.target.value = Math.floor(this.checkIntervalMs / 1000); } catch (err) {}
                    try { this.saveSellToStorage && this.saveSellToStorage(); } catch (err) {}
                    this.restartAutoCheck();
                });
            }

            // 全选控制
            const selectAllCheckbox = document.getElementById('sell-select-all-checkbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', (e) => {
                    this.allSelected = e.target.checked;
                    this.updateSelectAllState();
                });
            }

            // 自动检测开关
            const toggleAutoBtn = document.getElementById('sell-toggle-auto');
            if (toggleAutoBtn) {
                // 初始化按钮状态
                toggleAutoBtn.textContent = this.isEnabled ? '禁用自动检测' : '启用自动检测';
                toggleAutoBtn.style.backgroundColor = this.isEnabled ? 'rgba(244, 67, 54, 0.8)' : 'rgba(76, 175, 80, 0.8)';

                toggleAutoBtn.addEventListener('click', () => {
                    this.isEnabled = !this.isEnabled;
                    toggleAutoBtn.textContent = this.isEnabled ? '禁用自动检测' : '启用自动检测';
                    toggleAutoBtn.style.backgroundColor = this.isEnabled ? 'rgba(244, 67, 54, 0.8)' : 'rgba(76, 175, 80, 0.8)';

                    if (this.isEnabled) {
                        this.startAutoCheck();
                    } else {
                        this.stopAutoCheck();
                    }
                });
            }

            // 批量设置按钮
            const batchSetAskBtn = document.getElementById('sell-batch-set-ask');
            const batchSetBidBtn = document.getElementById('sell-batch-set-bid');
            if (batchSetAskBtn) {
                batchSetAskBtn.addEventListener('click', () => this.batchSetSellMode('ask'));
            }
            if (batchSetBidBtn) {
                batchSetBidBtn.addEventListener('click', () => this.batchSetSellMode('bid'));
            }

            // 执行出售按钮
            const executeBtn = document.getElementById('sell-execute-selected');
            if (executeBtn) {
                executeBtn.addEventListener('click', () => this.executeSelectedSells());
            }

            // 清空按钮
            const clearBtn = document.getElementById('sell-clear-all');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearSell());
            }
        }

        // 开始自动检测
        startAutoCheck() {
            this.stopAutoCheck();
            if (!Number.isFinite(this.checkIntervalMs) || this.checkIntervalMs < 1000) {
                this.checkIntervalMs = 1000;
            }
            if (this.isEnabled && this.items.size > 0) {
                // 始终根据 lastExecutionTime 重新计算 nextExecutionTime，确保刷新后倒计时准确
                this.calculateNextExecutionTime();

                const now = Date.now();
                
                // 如果已过期且未在执行中，延迟100ms执行避免与定时器冲突
                if (now >= this.nextExecutionTime && !this.isExecuting) {
                    setTimeout(() => {
                        this.checkAndExecuteSell();
                    }, 100);
                }

                // 设置定时检测（降低频率以减少CPU占用）
                this.checkInterval = setInterval(() => {
                    this.checkAndExecuteSell();
                }, 30000); // 每30秒检查一次

                // 启动倒计时显示
                this.startCountdown();
            }
        }

        // 检查并执行出售（基于上次执行时间的距离）
        async checkAndExecuteSell() {
            // 防止重复执行
            if (this.isExecuting) {
                console.log('[AutoSell] 正在执行中，跳过本次检查');
                return;
            }

            const now = Date.now();

            // 优先使用已保存的 nextExecutionTime，避免刷新时重置倒计时
            if (!this.nextExecutionTime) {
                // 如果没有 nextExecutionTime，则尝试基于 lastExecutionTime 计算
                if (!this.lastExecutionTime) {
                    this.isExecuting = true;
                    try {
                        await this.checkAndSell();
                        this.lastExecutionTime = Date.now();
                        this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
                        this.saveLastExecutionTime();
                        this.saveNextExecutionTime();
                    } catch (error) {
                        console.error('[AutoSell] 执行失败:', error);
                    } finally {
                        this.isExecuting = false;
                    }
                    return;
                }
                this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
            }

            // 当到达或超过下次执行时间时，执行出售，并在完成后刷新下次执行时间
            if (now >= this.nextExecutionTime) {
                this.isExecuting = true;
                try {
                    await this.checkAndSell();
                    this.lastExecutionTime = Date.now();
                    this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
                    this.saveLastExecutionTime();
                    this.saveNextExecutionTime();
                } catch (error) {
                    console.error('[AutoSell] 执行失败:', error);
                } finally {
                    this.isExecuting = false;
                }
            }
        }

        // 停止自动检测
        stopAutoCheck() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
            this.stopCountdown();
        }

        // 重启自动检测
        restartAutoCheck() {
            this.startAutoCheck();
        }

        // 启动倒计时显示
        startCountdown() {
            this.stopCountdown();
            this.calculateNextExecutionTime();
            this.updateCountdownDisplay();

            this.countdownInterval = setInterval(() => {
                this.updateCountdownDisplay();
            }, 1000);
        }

        // 计算下次执行时间（基于上次执行时间）
        calculateNextExecutionTime() {
            const now = Date.now();

            // 如果 nextExecutionTime 已存在且未过期，保持不变
            if (this.nextExecutionTime && this.nextExecutionTime > now) {
                return;
            }

            // 如果 nextExecutionTime 不存在或已过期，重新计算
            if (!this.lastExecutionTime) {
                // 如果没有上次执行时间，下次执行时间就是现在
                this.nextExecutionTime = now;
            } else {
                // 基于上次执行时间计算下次执行时间
                this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
                
                // 如果计算出的时间仍然小于当前时间（说明间隔很久没检查了）
                // 则推进到下一个有效周期
                while (this.nextExecutionTime <= now) {
                    this.nextExecutionTime += this.checkIntervalMs;
                }
            }
        }

        // 保存下次执行时间到本地
        saveNextExecutionTime() {
            try {
                if (this.nextExecutionTime) {
                    localStorage.setItem(`milkyway-sell-next-execution-${this.characterId}`, this.nextExecutionTime.toString());
                }
            } catch (error) {
                console.warn('保存下次执行时间失败:', error);
            }
        }

        // 从本地加载下次执行时间
        loadNextExecutionTime() {
            try {
                const stored = localStorage.getItem(`milkyway-sell-next-execution-${this.characterId}`);
                if (stored) {
                    const ts = parseInt(stored, 10);
                    if (Number.isFinite(ts) && ts > 0) {
                        this.nextExecutionTime = ts;
                    }
                }
            } catch (error) {
                console.warn('加载下次执行时间失败:', error);
            }
        }

        // 停止倒计时显示
        stopCountdown() {
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            this.hideCountdownDisplay();
        }

        // 更新倒计时显示
        updateCountdownDisplay() {
            if (!this.nextExecutionTime) return;

            const now = Date.now();
            const remaining = Math.max(0, this.nextExecutionTime - now);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            const timerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const nextExecution = new Date(this.nextExecutionTime);
            const executionText = nextExecution.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            const timerElement = document.getElementById('sell-countdown-timer');
            const executionElement = document.getElementById('sell-next-execution');
            const displayElement = document.getElementById('sell-countdown-display');

            if (timerElement) timerElement.textContent = timerText;
            if (executionElement) executionElement.textContent = executionText;
            if (displayElement) displayElement.style.display = 'block';
        }

        // 隐藏倒计时显示
        hideCountdownDisplay() {
            const displayElement = document.getElementById('sell-countdown-display');
            if (displayElement) displayElement.style.display = 'none';
        }

        // 检查并出售
        async checkAndSell() {
            if (!this.isEnabled || this.items.size === 0) return;

            const api = window.MWIModules?.api;
            const toast = window.MWIModules?.toast;

            if (!api?.isReady) {
                console.warn('[AutoSell] API不可用，跳过检测');
                return;
            }

            const needSell = [];

            for (const [itemId, item] of this.items) {
                if (!item.selected) continue;

                try {
                    const currentCount = utils.getCountById(itemId);
                    if (currentCount > item.keepQuantity) {
                        const sellQuantity = currentCount - item.keepQuantity;
                        needSell.push({
                            itemHrid: item.itemHrid,
                            quantity: sellQuantity,
                            itemName: item.itemName,
                            sellMode: item.sellMode,
                            enhancementLevel: 0 // 暂时设为0，后续可以扩展
                        });
                    }
                } catch (error) {
                    console.warn(`[AutoSell] 检查物品 ${item.itemName} 数量失败:`, error);
                }
            }

            if (needSell.length > 0) {
                console.log(`[AutoSell] 发现 ${needSell.length} 项需要出售`);
                await this.executeSell(needSell);
            }
        }

        // 执行出售
        async executeSell(sellItems) {
            const api = window.MWIModules?.api;
            const toast = window.MWIModules?.toast;

            if (!api?.isReady) {
                toast?.show('API不可用，无法执行出售', 'error');
                return;
            }

            try {
                const askItems = sellItems.filter(item => item.sellMode === 'ask');
                const bidItems = sellItems.filter(item => item.sellMode === 'bid');

                const results = [];

                if (askItems.length > 0) {
                    const askResults = await this.batchSellItems(askItems, 'ask');
                    results.push(...askResults);
                }

                if (bidItems.length > 0) {
                    const bidResults = await this.batchSellItems(bidItems, 'bid');
                    results.push(...bidResults);
                }

                this.processSellResults(results);

            } catch (error) {
                console.error('[AutoSell] 出售执行失败:', error);
                toast?.show(`出售执行失败: ${error.message}`, 'error');
            }
        }

        // 批量出售物品
        async batchSellItems(items, sellMode) {
            const results = [];

            for (const item of items) {
                try {
                    const result = await this.sellSingleItem(item, sellMode);
                    results.push(result);

                    // 添加延迟避免请求过于频繁
                    await utils.delay(500);
                } catch (error) {
                    results.push({
                        success: false,
                        item: item,
                        error: error.message
                    });
                }
            }

            return results;
        }

        // 出售单个物品
        async sellSingleItem(item, sellMode) {
            try {
                // 获取市场价格
                const marketData = await this.getMarketData(item.itemHrid);
                if (!marketData) {
                    throw new Error('无法获取市场价格');
                }

                // 计算价格
                const price = this.calculatePrice(marketData, item.enhancementLevel || 0, item.quantity, sellMode);
                if (!price || price <= 0) {
                    throw new Error('价格无效');
                }

                // 执行出售
                const result = await this.executeSellRequest(item, price, sellMode);
                return {
                    success: result.success,
                    item: item,
                    price: price,
                    sellMode: sellMode
                };

            } catch (error) {
                return {
                    success: false,
                    item: item,
                    error: error.message
                };
            }
        }

        // 计算价格
        calculatePrice(marketData, enhancementLevel, quantity, sellMode) {
            try {
                if (sellMode === 'ask') {
                    // 挂单出售：按ask价挂单（参考卖单价格）
                    return this.analyzeAskPrice(marketData, enhancementLevel);
                } else {
                    // 直售：按bid价直售（卖给买单）
                    return this.analyzeBidPrice(marketData, enhancementLevel, quantity);
                }
            } catch (error) {
                console.error('[AutoSell] 计算价格失败:', error);
                return null;
            }
        }

        // 分析挂单价格
        analyzeAskPrice(marketData, enhancementLevel) {
            const asks = marketData.orderBooks?.[enhancementLevel]?.asks;
            if (!asks?.length) {
                return null;
            }

            // 返回最低卖单价格，用于挂单竞争
            return asks[0].price;
        }

        // 分析直售价格
        analyzeBidPrice(marketData, enhancementLevel, quantity) {
            const bids = marketData.orderBooks?.[enhancementLevel]?.bids;
            if (!bids?.length) {
                return null;
            }

            // 分析能够出售的数量和价格
            let cumulativeQuantity = 0;
            let targetPrice = 0;

            for (const bid of bids) {
                const canSellToThisOrder = Math.min(bid.quantity, quantity - cumulativeQuantity);
                cumulativeQuantity += canSellToThisOrder;
                targetPrice = bid.price;

                if (cumulativeQuantity >= quantity) break;
            }

            if (cumulativeQuantity < quantity) {
                console.warn(`[AutoSell] 市场订单不足: ${cumulativeQuantity}/${quantity}`);
            }

            return targetPrice;
        }

        // 获取市场数据
        async getMarketData(itemHrid) {
            try {
                const fullItemHrid = itemHrid.startsWith('/items/') ? itemHrid : `/items/${itemHrid}`;

                // 检查缓存
                const cached = window.marketDataCache?.get(fullItemHrid);
                if (cached && Date.now() - cached.timestamp < 60000) {
                    return cached.data;
                }

                // 等待市场数据响应
                const responsePromise = window.PGE.waitForMessage(
                    'market_item_order_books_updated',
                    8000,
                    (responseData) => responseData.marketItemOrderBooks?.itemHrid === fullItemHrid
                );

                // 请求市场数据
                window.PGE.core.handleGetMarketItemOrderBooks(fullItemHrid);

                const response = await responsePromise;
                return response.marketItemOrderBooks;
            } catch (error) {
                console.error('[AutoSell] 获取市场数据失败:', error);
                return null;
            }
        }

        // 执行出售请求
        async executeSellRequest(item, price, sellMode) {
            try {
                const fullItemHrid = item.itemHrid.startsWith('/items/') ? item.itemHrid : `/items/${item.itemHrid}`;
                const enhancementLevel = item.enhancementLevel || 0;
                const quantity = item.quantity;
                const itemName = item.itemName;

                if (sellMode === 'ask') {
                    // 挂单出售
                    await this.executeListing(fullItemHrid, enhancementLevel, quantity, price, itemName);
                } else {
                    // 直售
                    await this.executeInstantSell(fullItemHrid, enhancementLevel, quantity, price, itemName);
                }

                return { success: true };
            } catch (error) {
                console.error('[AutoSell] 执行出售请求失败:', error);
                return { success: false, error: error.message };
            }
        }

        // 直售（卖给买单）
        async executeInstantSell(itemHrid, enhancementLevel, quantity, price, itemName) {
            const successPromise = window.PGE.waitForMessage(
                'info',
                15000,
                (responseData) => responseData.message === 'infoNotification.sellOrderCompleted'
            );

            const errorPromise = window.PGE.waitForMessage('error', 15000);

            window.PGE.core.handlePostMarketOrder(true, itemHrid, enhancementLevel, quantity, price, true);

            try {
                await Promise.race([
                    successPromise,
                    errorPromise.then(errorData => Promise.reject(new Error(errorData.message || '直售失败')))
                ]);

                console.log(`[AutoSell] 直售成功: ${itemName} x${quantity} @ ${price}`);
            } catch (error) {
                console.error(`[AutoSell] 直售失败: ${itemName}`, error);
                throw error;
            }
        }

        // 挂单出售
        async executeListing(itemHrid, enhancementLevel, quantity, price, itemName) {
            const successPromise = window.PGE.waitForMessage(
                'info',
                15000,
                (responseData) => responseData.message === 'infoNotification.sellListingProgress'
            );

            const errorPromise = window.PGE.waitForMessage('error', 15000);

            window.PGE.core.handlePostMarketOrder(true, itemHrid, enhancementLevel, quantity, price, false);

            try {
                await Promise.race([
                    successPromise,
                    errorPromise.then(errorData => Promise.reject(new Error(errorData.message || '挂单失败')))
                ]);

                console.log(`[AutoSell] 挂单成功: ${itemName} x${quantity} @ ${price}`);
            } catch (error) {
                console.error(`[AutoSell] 挂单失败: ${itemName}`, error);
                throw error;
            }
        }

        // 处理出售结果
        processSellResults(results) {
            const toast = window.MWIModules?.toast;
            let successCount = 0;

            results.forEach(result => {
                const statusText = result.success ? '出售成功' : '出售失败';
                const message = `${statusText} ${result.item.itemName || result.item.itemHrid} x${result.item.quantity}`;
                toast?.show(message, result.success ? 'success' : 'error');

                if (result.success) successCount++;
            });

            const finalMessage = successCount > 0 ?
                `出售完成: 成功 ${successCount}/${results.length} 项` :
                '所有出售操作失败';

            toast?.show(finalMessage, successCount > 0 ? 'success' : 'error', successCount > 0 ? 5000 : 3000);
        }

        // 添加物品到出售列表
        addItem(itemInfo, keepQuantity = 0, sellMode = 'ask') {
            const itemId = itemInfo.itemId || itemInfo.id;
            const itemHrid = itemInfo.itemHrid || `/items/${itemId}`;
            const itemName = itemInfo.itemName || itemInfo.name || '未知物品';
            const iconHref = itemInfo.iconHref || `#${itemId}`;

            if (this.items.has(itemId)) {
                // 更新现有项目
                const existing = this.items.get(itemId);
                existing.keepQuantity = keepQuantity;
                existing.sellMode = sellMode;
            } else {
                // 添加新项目
                this.items.set(itemId, {
                    itemId,
                    itemHrid,
                    itemName,
                    iconHref,
                    keepQuantity,
                    sellMode,
                    selected: true
                });
            }

            // 保存并刷新 UI；若容器未挂载则稍后重试一次
            this.updateSellBadge();
            this.saveSellToStorage();
            if (document.getElementById('sell-items-container')) {
                this.updateSellDisplay();
            } else {
                setTimeout(() => {
                    try {
                        if (document.getElementById('sell-items-container')) this.updateSellDisplay();
                    } catch (err) {}
                }, 300);
            }
            this.startAutoCheck();
        }

        // 移除出售项目
        removeItem(itemId) {
            this.items.delete(itemId);
            this.updateSellDisplay();
            this.updateSellBadge();
            this.saveSellToStorage();

            if (this.items.size === 0) {
                this.stopAutoCheck();
            }
        }

        // 更新出售显示
        updateSellDisplay() {
            const container = document.getElementById('sell-items-container');
            if (!container) return;

            if (this.items.size === 0) {
                container.innerHTML = `
                    <div style="
                        text-align: center;
                        color: var(--color-text-dark-mode);
                        padding: 20px;
                        font-size: 14px;
                    ">暂无出售项目</div>
                `;
                return;
            }

            container.innerHTML = '';

            this.items.forEach((item, itemId) => {
                const itemElement = this.createSellItemElement(item);
                container.appendChild(itemElement);
            });

            // 更新统一抽屉的徽章
            if (window.MWIModules?.unifiedWarehouse) {
                window.MWIModules.unifiedWarehouse.updateBadge();
            }
        }

        // 创建出售方式滑动开关
        createSellModeToggle(mode = 'ask') {
            const toggle = document.createElement('div');
            toggle.className = 'sell-mode-toggle';
            toggle.setAttribute('data-mode', mode);

            const isAsk = mode === 'ask';
            const borderColor = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderBg = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
            const sliderText = isAsk ? '挂单' : '直售';
            const sliderPosition = isAsk ? 'left: 2px' : 'right: 2px';
            const toggleBackgroundColor = 'var(--item-background)';

            toggle.style.cssText = `
                position: relative;
                width: 60px;
                height: 20px;
                background: ${toggleBackgroundColor};
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid ${borderColor};
                flex-shrink: 0;
            `;

            toggle.innerHTML = `
                <div class="toggle-slider" style="
                    position: absolute;
                    top: 1px;
                    ${sliderPosition};
                    width: 26px;
                    height: 14px;
                    background: ${sliderBg};
                    border-radius: 7px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 8px;
                    font-weight: bold;
                ">${sliderText}</div>
                <div style="
                    position: absolute;
                    top: 1px;
                    left: 2px;
                    width: 26px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${isAsk ? 'var(--color-text-dark-mode)' : 'var(--color-neutral-400)'};
                    font-size: 8px;
                    font-weight: bold;
                ">挂单</div>
                <div style="
                    position: absolute;
                    top: 1px;
                    right: 2px;
                    width: 26px;
                    height: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: ${isAsk ? 'var(--color-neutral-400)' : 'var(--color-text-dark-mode)'};
                    font-size: 8px;
                    font-weight: bold;
                ">直售</div>
            `;

            return toggle;
        }

        // 创建出售项目元素
        createSellItemElement(item) {
            const div = document.createElement('div');
            div.className = 'sell-item';
            div.style.cssText = `
                display: flex;
                align-items: center;
                padding: 10px;
                margin-bottom: 8px;
                background-color: var(--item-background);
                border: 1px solid var(--item-border);
                border-radius: 6px;
                transition: all 0.2s ease;
            `;

            // 创建出售方式切换器
            const sellToggle = this.createSellModeToggle(item.sellMode || 'ask');
            sellToggle.setAttribute('data-item-id', item.itemId);

            div.innerHTML = `
                <!-- 选择框 -->
                <input type="checkbox" ${item.selected ? 'checked' : ''} style="
                    margin-right: 8px;
                    transform: scale(1.2);
                    cursor: pointer;
                ">

                <!-- 物品图标 -->
                <div data-item-icon="${item.itemId}" style="
                    width: 32px;
                    height: 32px;
                    margin-right: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--item-background);
                    border-radius: 4px;
                    cursor: pointer;
                ">
                </div>

                <!-- 物品信息 -->
                <div style="flex: 1; color: var(--color-text-dark-mode); min-width: 0;">
                    <div style="font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.itemName}</div>
                </div>

                <!-- 控制区域 -->
                <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
                    <!-- 出售方式切换器 -->
                    ${sellToggle.outerHTML}

                    <!-- 保留数量输入 -->
                <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="font-size: 11px; color: var(--color-text-dark-mode);">保留</span>
                        <input
                            type="number"
                            value="${item.keepQuantity}"
                            min="0"
                            max="999999"
                            data-item-id="${item.itemId}"
                            style="
                                width: 80px;
                                padding: 4px 6px;
                                background-color: var(--item-background);
                                border: 1px solid var(--item-border);
                        border-radius: 3px;
                        color: var(--color-text-dark-mode);
                        font-size: 11px;
                                text-align: right;
                            "
                        >
                    </div>

                    <!-- 删除按钮 -->
                    <button
                        data-remove-item="${item.itemId}"
                        style="
                            background: none;
                        border: none;
                            color: #c0c0c0;
                        cursor: pointer;
                            padding: 4px;
                            border-radius: 3px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 24px;
                            height: 24px;
                        "
                        title="删除"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            `;

            // 绑定事件
            const checkbox = div.querySelector('input[type="checkbox"]');
            const quantityInput = div.querySelector('input[type="number"]');
            const sellToggleElement = div.querySelector('.sell-mode-toggle');
            const removeBtn = div.querySelector('[data-remove-item]');

            checkbox.addEventListener('change', (e) => {
                item.selected = e.target.checked;
                this.updateSelectAllState();
                this.saveSellToStorage();
            });

            quantityInput.addEventListener('change', (e) => {
                const raw = parseInt(e.target.value, 10);
                const newValue = Number.isFinite(raw) ? Math.max(0, raw) : 0;
                console.log(`[AutoSell] 修改物品 ${item.itemName} 的保留数量: ${item.keepQuantity} -> ${newValue}`);
                item.keepQuantity = newValue;
                this.saveSellToStorage();
                console.log(`[AutoSell] 已保存到本地存储`);
            });

            // 出售方式切换器事件
            sellToggleElement.addEventListener('click', () => {
                const currentMode = sellToggleElement.getAttribute('data-mode');
                const newMode = currentMode === 'ask' ? 'bid' : 'ask';

                sellToggleElement.setAttribute('data-mode', newMode);
                item.sellMode = newMode;

                // 更新切换器样式
                const isAsk = newMode === 'ask';
                const borderColor = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
                const sliderBg = isAsk ? 'rgba(217, 89, 97, 1)' : 'rgba(47, 196, 167, 1)';
                const sliderText = isAsk ? '挂单' : '直售';

                sellToggleElement.style.borderColor = borderColor;
                const slider = sellToggleElement.querySelector('.toggle-slider');
                slider.style.backgroundColor = sliderBg;
                slider.style.left = isAsk ? '2px' : 'auto';
                slider.style.right = isAsk ? 'auto' : '2px';
                slider.textContent = sliderText;

                // 更新标签颜色
                const labels = sellToggleElement.querySelectorAll('div:not(.toggle-slider)');
                labels[0].style.color = isAsk ? 'var(--color-text-dark-mode)' : 'var(--color-neutral-400)';
                labels[1].style.color = isAsk ? 'var(--color-neutral-400)' : 'var(--color-text-dark-mode)';

                this.saveSellToStorage();
            });

            removeBtn.addEventListener('click', () => {
                this.removeItem(item.itemId);
            });

            // 动态创建图标
            const iconContainer = div.querySelector('[data-item-icon]');
            if (iconContainer && item.iconHref) {
                const iconElement = utils.createIconElement(item.itemId, item.iconHref);
                iconContainer.appendChild(iconElement);
            }

            return div;
        }

        // 更新全选状态
        updateSelectAllState() {
            const selectAllCheckbox = document.getElementById('sell-select-all-checkbox');
            if (!selectAllCheckbox) return;

            const selectedItems = Array.from(this.items.values()).filter(item => item.selected);
            const allSelected = selectedItems.length === this.items.size && this.items.size > 0;

            selectAllCheckbox.checked = allSelected;
            this.allSelected = allSelected;
        }

        // 批量设置出售方式
        batchSetSellMode(mode) {
            this.items.forEach(item => {
                item.sellMode = mode;
            });
            this.updateSellDisplay();
            this.saveSellToStorage();
        }

        // 执行选中的出售
        async executeSelectedSells() {
            const selectedItems = Array.from(this.items.values()).filter(item => item.selected);

            if (selectedItems.length === 0) {
                window.MWIModules?.toast?.show('请选择要出售的项目', 'warning');
                return;
            }

            const sellItems = [];
            for (const item of selectedItems) {
                try {
                    const currentCount = utils.getCountById(item.itemId);
                    if (currentCount > item.keepQuantity) {
                        const sellQuantity = currentCount - item.keepQuantity;
                        sellItems.push({
                            itemHrid: item.itemHrid,
                            quantity: sellQuantity,
                            itemName: item.itemName,
                            sellMode: item.sellMode,
                            enhancementLevel: 0
                        });
                    }
                } catch (error) {
                    console.warn(`[AutoSell] 检查物品 ${item.itemName} 数量失败:`, error);
                }
            }

            if (sellItems.length === 0) {
                window.MWIModules?.toast?.show('所有选中项目无需出售', 'info');
                return;
            }

            await this.executeSell(sellItems);

            // 手动执行后刷新上次执行时间与下次执行时间（并持久化）
            this.lastExecutionTime = Date.now();
            this.nextExecutionTime = this.lastExecutionTime + this.checkIntervalMs;
            this.saveLastExecutionTime();
            this.saveNextExecutionTime();
        }

        // 清空出售列表
        clearSell() {
            this.items.clear();
            this.updateSellDisplay();
            this.updateSellBadge();
            this.saveSellToStorage();
            this.stopAutoCheck();
        }

        // 切换出售界面
        toggleSell() {
            this.isOpen ? this.closeSell() : this.openSell();
        }

        // 打开出售界面
        openSell() {
            if (this.sellContainer) {
                this.sellContainer.style.transform = 'translateX(0)';
                this.isOpen = true;
            }
        }

        // 关闭出售界面
        closeSell() {
            if (this.sellContainer) {
                const translateX = Math.min(window.innerWidth, 450);
                this.sellContainer.style.transform = `translateX(${translateX}px)`;
                this.isOpen = false;
            }
        }

        // 更新出售徽章
        updateSellBadge() {
            const badge = document.getElementById('sell-tab-badge');
            const countDisplay = document.getElementById('sell-count-display');

            if (badge) {
                if (this.items.size > 0) {
                    badge.textContent = this.items.size;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }

            if (countDisplay) {
                countDisplay.textContent = `${this.items.size} 项`;
            }
        }

        // 设置市场出售按钮
        setupMarketSellButton() {
            this.observer = new MutationObserver((mutationsList) => {
                this.handleMarketSellButton(mutationsList);
            });
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        // 处理市场出售按钮
        handleMarketSellButton(mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查商店界面
                            if (node.classList?.contains('Market_marketPage__2Qz8L')) {
                                this.addSellButtonsToMarket(node);
                            }
                            // 检查市场导航按钮容器
                            if (node.classList && [...node.classList].some(c => c.startsWith('MarketplacePanel_marketNavButtonContainer'))) {
                                this.addSellButtonToMarketNav(node);
                            }
                            // 检查物品详情
                            if (node.querySelector?.('.Item_actionMenu__2yUcG')) {
                                this.addSellButtonsToItemMenu(node.querySelector('.Item_actionMenu__2yUcG'));
                            }
                        }
                    });
                }
            }
        }

        // 在市场导航按钮容器添加出售按钮
        addSellButtonToMarketNav(navContainer) {
            if (navContainer.querySelector('.market-sell-btn')) return;

            const buttons = navContainer.querySelectorAll('button');
            if (buttons.length > 0) {
                const lastButton = buttons[buttons.length - 1];
                const sellButton = lastButton.cloneNode(true);
                sellButton.textContent = '加入自动出售';
                sellButton.classList.add('market-sell-btn');
                sellButton.style.backgroundColor = 'rgba(244, 67, 54, 0.8)';
                sellButton.onclick = () => {
                    this.addCurrentMarketItemToSell();
                };
                // 将出售按钮添加到原有按钮后面
                navContainer.appendChild(sellButton);
            }
        }

        // 在商店界面添加出售按钮
        addSellButtonsToMarket(marketContainer) {
            const itemContainers = marketContainer.querySelectorAll('.Item_itemContainer__x7kH1');

            itemContainers.forEach(container => {
                if (container.dataset.sellButtonAdded) return;

                const itemId = this.extractItemId(container);
                if (!itemId) return;

                const itemName = container.querySelector('.Item_itemName__2Qz8L')?.textContent || '未知物品';
                const itemHrid = `/items/${itemId}`;

                const button = this.createAddToSellButton(itemId, itemHrid, itemName);

                // 找到合适的位置插入按钮
                const actionArea = container.querySelector('.Item_itemActions__2Qz8L') || container;
                actionArea.appendChild(button);

                container.dataset.sellButtonAdded = 'true';
            });
        }

        // 在物品菜单添加出售按钮
        addSellButtonsToItemMenu(menuContainer) {
            if (menuContainer.dataset.sellButtonAdded) return;

            const itemId = this.extractItemIdFromMenu(menuContainer);
            if (!itemId) return;

            const itemName = menuContainer.querySelector('.Item_itemName__2Qz8L')?.textContent || '未知物品';
            const itemHrid = `/items/${itemId}`;

            const button = this.createAddToSellButton(itemId, itemHrid, itemName);
            menuContainer.appendChild(button);

            menuContainer.dataset.sellButtonAdded = 'true';
        }

        // 创建加入自动出售按钮
        createAddToSellButton(itemId, itemHrid, itemName) {
            const button = document.createElement('button');
            button.className = 'Button_button__1Fe9z Button_sell__3FNpM Button_fullWidth__17pVU add-to-sell-btn';
            button.textContent = '加入自动出售';
            button.style.cssText = `
                background-color: rgba(244, 67, 54, 0.8);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: background-color 0.2s;
                margin-top: 4px;
            `;

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addItem({
                    itemId,
                    itemHrid,
                    itemName,
                    iconHref: `#${itemId}`
                }, 0, 'bid');
                window.MWIModules?.toast?.show(`已添加 ${itemName} 到自动出售列表`, 'success');
            });

            return button;
        }

        // 添加当前市场物品到出售列表
        addCurrentMarketItemToSell() {
            try {
                const currentItem = document.querySelector('.MarketplacePanel_currentItem__3ercC');
                const svgElement = currentItem?.querySelector('svg[aria-label]');
                const useElement = svgElement?.querySelector('use');

                if (!svgElement || !useElement) {
                    window.MWIModules?.toast?.show('未找到当前物品信息', 'error');
                    return;
                }

                const itemName = svgElement.getAttribute('aria-label');
                const itemId = useElement.getAttribute('href')?.split('#')[1];

                if (!itemName || !itemId) {
                    window.MWIModules?.toast?.show('无法获取物品信息', 'error');
                    return;
                }

                const itemHrid = `/items/${itemId}`;

                this.addItem({
                    itemId,
                    itemHrid,
                    itemName,
                    iconHref: `#${itemId}`
                }, 0, 'bid');

                window.MWIModules?.toast?.show(`已添加 ${itemName} 到自动出售列表`, 'success');
            } catch (error) {
                console.error('[AutoSell] 添加市场物品到出售列表失败:', error);
                window.MWIModules?.toast?.show('添加失败，请重试', 'error');
            }
        }

        // 提取物品ID
        extractItemId(container) {
            const svgElement = container.querySelector('svg use');
            if (svgElement) {
                const href = svgElement.getAttribute('href');
                const match = href?.match(/#(.+)$/);
                return match ? match[1] : null;
            }
            return null;
        }

        // 从菜单提取物品ID
        extractItemIdFromMenu(menuContainer) {
            // 这里需要根据实际的菜单结构来实现
            // 暂时返回null，需要根据实际情况调整
            return null;
        }

        // 设置出售标签拖拽和点击（已由统一抽屉管理器接管）
        setupSellTabDragAndClick() {
            // 此方法已被UnifiedDrawerManager接管，不再需要独立处理
        }

        // 保存出售数据到存储
        saveSellToStorage() {
            try {
                const data = {
                    items: Array.from(this.items.entries()),
                    checkIntervalMs: this.checkIntervalMs,
                    isEnabled: this.isEnabled,
                    lastExecutionTime: this.lastExecutionTime,
                    nextExecutionTime: this.nextExecutionTime
                };
                localStorage.setItem(`milkyway-sell-data-${this.characterId}`, JSON.stringify(data));
                console.log(`[AutoSell] 保存数据到localStorage:`, {
                    itemsCount: this.items.size,
                    checkIntervalMs: this.checkIntervalMs,
                    isEnabled: this.isEnabled
                });
            } catch (error) {
                console.warn('保存出售数据失败:', error);
            }
        }

        // 保存上次执行时间
        saveLastExecutionTime() {
            try {
                localStorage.setItem(`milkyway-sell-last-execution-${this.characterId}`, this.lastExecutionTime.toString());
            } catch (error) {
                console.warn('保存上次执行时间失败:', error);
            }
        }

        // 从存储加载出售数据
        loadSellFromStorage() {
            try {
                const data = JSON.parse(localStorage.getItem(`milkyway-sell-data-${this.characterId}`));
                if (data) {
                    if (data.items) {
                        this.items = new Map(data.items);

                        // 确保每个物品都有必要的字段
                        this.items.forEach((item, itemId) => {
                            if (typeof item.keepQuantity === 'undefined' || item.keepQuantity === null) {
                                item.keepQuantity = 0;
                            }
                            if (typeof item.sellMode === 'undefined' || item.sellMode === null) {
                                item.sellMode = 'ask';
                            }
                            if (typeof item.selected === 'undefined' || item.selected === null) {
                                item.selected = true;
                            }
                        });
                    }
                    if (data.checkIntervalMs) {
                        let ms = Number(data.checkIntervalMs);
                        this.checkIntervalMs = Number.isFinite(ms) && ms >= 5000 ? ms : 5000;
                    }
                    if (typeof data.isEnabled === 'boolean') {
                        this.isEnabled = data.isEnabled;
                    }
                    if (typeof data.lastExecutionTime === 'number') {
                        this.lastExecutionTime = data.lastExecutionTime;
                    }
                    if (typeof data.nextExecutionTime === 'number') {
                        this.nextExecutionTime = data.nextExecutionTime;
                    }
                }

                // 尝试从单独的时间存储加载
                if (!this.lastExecutionTime) {
                    const lastExec = localStorage.getItem(`milkyway-sell-last-execution-${this.characterId}`);
                    if (lastExec) {
                        this.lastExecutionTime = parseInt(lastExec, 10);
                    }
                }
                // 尝试从单独的 nextExecution 存储加载（向后兼容）
                if (!this.nextExecutionTime) {
                    try {
                        const nextExec = localStorage.getItem(`milkyway-sell-next-execution-${this.characterId}`);
                        if (nextExec) this.nextExecutionTime = parseInt(nextExec, 10);
                    } catch (err) {}
                }
            } catch (error) {
                console.warn('加载出售数据失败:', error);
            }
            try {
                if (window.MWIModules?.unifiedWarehouse?.updateSellIntervalDisplay) {
                    window.MWIModules.unifiedWarehouse.updateSellIntervalDisplay();
                }
            } catch (err) {}
        }

        // 清理资源
        cleanup() {
            this.stopAutoCheck();
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.sellContainer) {
                this.sellContainer.remove();
                this.sellContainer = null;
            }
        }
    }


    // ==================== 统一抽屉管理器 ====================
    class UnifiedDrawerManager {
        constructor() {
            this.characterId = utils.getCurrentCharacterId(); // 获取当前角色ID
            this.isOpen = false;
            this.currentTab = 'restock'; // 'restock' 或 'sell'
            this.container = null;
            this.restockManager = null;
            this.sellManager = null;
            this.tabPosition = this.loadTabPosition();
            this.init();
        }

        init() {
            this.createUnifiedContainer();
            this.initializeManagers();
            this.bindEvents();
            this.setupTabDragAndClick();
        }

        // 加载页签位置
        loadTabPosition() {
            try {
                const saved = JSON.parse(localStorage.getItem(`milkyway-unified-tab-position-${this.characterId}`));
                return saved || { y: '10%' };
            } catch (error) {
                return { y: '10%' };
            }
        }

        // 保存页签位置
        saveTabPosition() {
            try {
                localStorage.setItem(`milkyway-unified-tab-position-${this.characterId}`, JSON.stringify(this.tabPosition));
            } catch (error) {
                console.warn('保存页签位置失败:', error);
            }
        }

        setTabInitialPosition() {
            const tab = document.getElementById('unified-tab');
            if (tab && this.tabPosition.y) {
                tab.style.top = this.tabPosition.y;
            }
        }

        createUnifiedContainer() {
            this.container = document.createElement('div');
            this.container.id = 'unified-warehouse-drawer';

            utils.applyStyles(this.container, {
                position: 'fixed',
                top: '0',
                right: '0',
                width: Math.min(window.innerWidth, 450) + 'px',
                height: '100vh',
                backgroundColor: 'rgba(42, 43, 66, 0.95)',
                border: '1px solid var(--border)',
                borderRight: 'none',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
                backdropFilter: 'blur(10px)',
                boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
                zIndex: '9999',
                transform: `translateX(${Math.min(window.innerWidth, 450)}px)`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif'
            });

            this.container.innerHTML = `
            <!-- 统一页签/触发器 -->
            <div id="unified-tab" style="
                position: absolute;
                left: -40px;
                top: ${this.tabPosition.y};
                transform: translateY(-50%);
                width: 40px;
                height: 80px;
                background: rgba(42, 43, 66, 0.95);
                border: 1px solid var(--border);
                border-right: none;
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: -2px 0 8px rgba(0,0,0,0.2);
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            ">
                <div style="
                    font-size: 18px;
                    white-space: nowrap;
                    color: var(--color-text-dark-mode);
                ">🛍️</div>
            </div>

            <!-- 页签头部 -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                border-bottom: 1px solid var(--border-separator);
                background: var(--card-title-background);
                border-top-left-radius: 8px;
                flex-shrink: 0;
            ">
                <div style="display: flex; gap: 8px;">
                    <button id="tab-restock" class="tab-button active" style="
                        padding: 6px 12px;
                        background: rgba(255, 152, 0, 0.8);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: all 0.2s;
                    ">自动补货</button>
                    <button id="tab-sell" class="tab-button" style="
                        padding: 6px 12px;
                        background: rgba(76, 175, 80, 0.8);
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 500;
                        transition: all 0.2s;
                    ">自动出售</button>
                </div>
                <div style="
                    background: rgba(255, 152, 0, 0.2);
                    color: var(--color-text-dark-mode);
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                " id="unified-count-display">0 项</div>
            </div>

            <!-- 内容区域 -->
            <div style="
                flex: 1 1 auto;
                overflow: hidden;
                background: var(--card-background);
                position: relative;
            " id="unified-content">
                <!-- 补货内容 -->
                <div id="restock-content" class="tab-content active" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    flex-direction: column;
                ">
                    <!-- 补货设置区域 -->
                    <div style="
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--border-separator);
                        background: var(--card-background);
                        flex-shrink: 0;
                    ">
                        <!-- 检测间隔设置 -->
                        <div style="margin-bottom: 8px;">
                            <label style="color: var(--color-text-dark-mode); font-size: 12px; font-weight: 500; display: block; margin-bottom: 4px;">检测间隔:</label>
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <input type="number" id="restock-days-input" value="0" min="0" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">天</span>
                                <input type="number" id="restock-hours-input" value="1" min="-1" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">时</span>
                                <input type="number" id="restock-minutes-input" value="0" min="-1" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">分</span>
                                <input type="number" id="restock-seconds-input" value="0" min="-1" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">秒</span>
                            </div>
                        </div>

                        <!-- 检测倒计时显示 -->
                        <div id="restock-countdown-display" style="
                            display: none;
                            margin-bottom: 8px;
                            padding: 8px;
                            background: rgba(76, 175, 80, 0.1);
                            border: 1px solid rgba(76, 175, 80, 0.3);
                            border-radius: 4px;
                            font-size: 11px;
                            color: var(--color-text-dark-mode);
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong>检测倒计时：</strong><span id="restock-countdown-timer" style="font-size: 13px; font-weight: bold; color: #4caf50;">00:00:00</span>
                                </div>
                                <div>
                                    <strong>下次执行时间：</strong><span id="restock-next-execution" style="font-size: 13px; font-weight: bold; color: #4caf50;">--</span>
                                </div>
                            </div>
                        </div>

                        <!-- 全选控制 -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <label style="display: flex; align-items: center; cursor: pointer; color: var(--color-text-dark-mode); font-size: 13px;">
                                <input type="checkbox" id="restock-select-all-checkbox" checked style="margin-right: 8px; transform: scale(1.1);">
                                全选
                            </label>
                            <button id="restock-toggle-auto" style="
                                padding: 4px 12px;
                                background-color: rgba(76, 175, 80, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                            ">自动执行：开</button>
                        </div>

                        <!-- 批量购买方式设置 -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: var(--color-text-dark-mode); font-size: 12px; font-weight: 500;">批量设置:</span>
                            <button id="restock-batch-set-ask" style="
                                flex: 1;
                                padding: 6px 12px;
                                background-color: rgba(217, 89, 97, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                                transition: background-color 0.2s;
                                white-space: nowrap;
                            ">直购</button>
                            <button id="restock-batch-set-bid" style="
                                flex: 1;
                                padding: 6px 12px;
                                background-color: rgba(47, 196, 167, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                                transition: background-color 0.2s;
                                white-space: nowrap;
                            ">挂单购买</button>
                        </div>
                    </div>

                    <!-- 补货列表区域 -->
                    <div style="
                        flex: 1 1 auto;
                        overflow-y: auto;
                        overflow-x: hidden;
                        background: var(--card-background);
                        padding: 8px;
                        min-height: 0;
                    " id="restock-items-container">
                        <div style="
                            text-align: center;
                            color: var(--color-text-dark-mode);
                            padding: 20px;
                            font-size: 14px;
                        ">暂无补货项目</div>
                    </div>

                    <!-- 底部操作区域 -->
                    <div style="
                        padding: 12px 16px;
                        border-top: 1px solid var(--border-separator);
                        background: var(--card-background);
                        flex-shrink: 0;
                    ">
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <button id="restock-execute-selected" style="
                                flex: 1;
                                padding: 10px 16px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.2s;
                            ">执行补货</button>
                            <button id="restock-clear-all" style="
                                padding: 10px 16px;
                                background: rgba(244, 67, 54, 0.8);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.2s;
                            ">清空</button>
                        </div>
                    </div>
                </div>

                <!-- 出售内容 -->
                <div id="sell-content" class="tab-content" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    flex-direction: column;
                ">
                    <!-- 出售设置区域 -->
                    <div style="
                        padding: 12px 16px;
                        border-bottom: 1px solid var(--border-separator);
                        background: var(--card-background);
                        flex-shrink: 0;
                    ">
                        <!-- 检测间隔设置 -->
                        <div style="margin-bottom: 8px;">
                            <label style="color: var(--color-text-dark-mode); font-size: 12px; font-weight: 500; display: block; margin-bottom: 4px;">检测间隔:</label>
                            <div style="display: flex; align-items: center; gap: 4px;">
                                <input type="number" id="sell-days-input" value="0" min="0" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">天</span>
                                <input type="number" id="sell-hours-input" value="1" min="-1" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">时</span>
                                <input type="number" id="sell-minutes-input" value="0" min="-1" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">分</span>
                                <input type="number" id="sell-seconds-input" value="0" min="-1" style="
                                    width: 50px;
                                    padding: 4px 6px;
                                    background: var(--input-background);
                                    border: 1px solid var(--border);
                                    border-radius: 4px;
                                    color: var(--color-text-dark-mode);
                                    font-size: 12px;
                                    text-align: center;
                                ">
                                <span style="color: var(--color-text-dark-mode); font-size: 12px;">秒</span>
                            </div>
                        </div>

                        <!-- 检测倒计时显示 -->
                        <div id="sell-countdown-display" style="
                            display: none;
                            margin-bottom: 8px;
                            padding: 8px;
                            background: rgba(76, 175, 80, 0.1);
                            border: 1px solid rgba(76, 175, 80, 0.3);
                            border-radius: 4px;
                            font-size: 11px;
                            color: var(--color-text-dark-mode);
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong>检测倒计时：</strong><span id="sell-countdown-timer" style="font-size: 13px; font-weight: bold; color: #4caf50;">00:00:00</span>
                                </div>
                                <div>
                                    <strong>下次执行时间：</strong><span id="sell-next-execution" style="font-size: 13px; font-weight: bold; color: #4caf50;">--</span>
                                </div>
                            </div>
                        </div>

                        <!-- 全选控制 -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <label style="display: flex; align-items: center; cursor: pointer; color: var(--color-text-dark-mode); font-size: 13px;">
                                <input type="checkbox" id="sell-select-all-checkbox" checked style="margin-right: 8px; transform: scale(1.1);">
                                全选
                            </label>
                            <button id="sell-toggle-auto" style="
                                padding: 4px 12px;
                                background-color: rgba(76, 175, 80, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                            ">自动执行：开</button>
                        </div>

                        <!-- 批量出售方式设置 -->
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="color: var(--color-text-dark-mode); font-size: 12px; font-weight: 500;">批量设置:</span>
                            <button id="sell-batch-set-ask" style="
                                flex: 1;
                                padding: 6px 12px;
                                background-color: rgba(217, 89, 97, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                                transition: background-color 0.2s;
                                white-space: nowrap;
                            ">挂单出售</button>
                            <button id="sell-batch-set-bid" style="
                                flex: 1;
                                padding: 6px 12px;
                                background-color: rgba(47, 196, 167, 0.8);
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                                transition: background-color 0.2s;
                                white-space: nowrap;
                            ">直售</button>
                        </div>
                    </div>

                    <!-- 出售列表区域 -->
                    <div style="
                        flex: 1 1 auto;
                        overflow-y: auto;
                        overflow-x: hidden;
                        background: var(--card-background);
                        padding: 8px;
                        min-height: 0;
                    " id="sell-items-container">
                        <div style="
                            text-align: center;
                            color: var(--color-text-dark-mode);
                            padding: 20px;
                            font-size: 14px;
                        ">暂无出售项目</div>
                    </div>

                    <!-- 底部操作区域 -->
                    <div style="
                        padding: 12px 16px;
                        border-top: 1px solid var(--border-separator);
                        background: var(--card-background);
                        flex-shrink: 0;
                    ">
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <button id="sell-execute-selected" style="
                                flex: 1;
                                padding: 10px 16px;
                                background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.2s;
                            ">执行出售</button>
                            <button id="sell-clear-all" style="
                                padding: 10px 16px;
                                background: rgba(244, 67, 54, 0.8);
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 14px;
                                font-weight: 600;
                                transition: all 0.2s;
                            ">清空</button>
                        </div>
                    </div>
                </div>
            </div>
            `;

            document.body.appendChild(this.container);

            // 添加页签切换样式
            this.addTabStyles();
        }

        addTabStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .tab-content {
                    display: none !important;
                }
                .tab-content.active {
                    display: flex !important;
                }
                .tab-button {
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }
                .tab-button.active {
                    opacity: 1;
                }
                #restock-content {
                    display: none;
                }
                #restock-content.active {
                    display: flex;
                }
                #sell-content {
                    display: none;
                }
                #sell-content.active {
                    display: flex;
                }
            `;
            document.head.appendChild(style);
        }

        initializeManagers() {
            // 初始化补货管理器
            this.restockManager = new AutoRestockManager();
            this.restockManager.restockContainer = this.container;
            this.restockManager.isOpen = true; // 统一管理开关状态
            // 禁用原有的独立界面创建
            this.restockManager.createRestockDrawer = () => {};
            this.restockManager.setupRestockTabDragAndClick = () => {};

            // 初始化出售管理器
            this.sellManager = new AutoSellManager();
            this.sellManager.sellContainer = this.container;
            this.sellManager.isOpen = true; // 统一管理开关状态
            // 禁用原有的独立界面创建
            this.sellManager.createSellDrawer = () => {};
            this.sellManager.setupSellTabDragAndClick = () => {};

            // 设置初始位置
            setTimeout(() => {
                this.setTabInitialPosition();
                this.updateBadge();
                // 强制设置初始页签状态
                this.switchTab('restock');
                // 更新显示
                this.restockManager.updateRestockDisplay();
                this.sellManager.updateSellDisplay();
                // 初始化全选按钮状态
                this.restockManager.updateSelectAllState();
                this.sellManager.updateSelectAllState();
                // 注意：自动检测已在各管理器的init()方法中启动，避免重复调用
            }, 0);
        }

        bindEvents() {
            // 使用事件委托，绑定到容器上
            if (this.container) {
                this.container.addEventListener('click', (e) => {
                    if (e.target.id === 'tab-restock') {
                        console.log('[UnifiedDrawer] 点击补货页签');
                        this.switchTab('restock');
                    } else if (e.target.id === 'tab-sell') {
                        console.log('[UnifiedDrawer] 点击出售页签');
                        this.switchTab('sell');
                    }
                });
                console.log('[UnifiedDrawer] 页签事件委托已绑定到容器');
            }

            // 延迟绑定其他事件，确保DOM元素已创建
            setTimeout(() => {
                // 绑定补货管理器事件
                this.bindRestockEvents();
                this.bindSellEvents();
            }, 100);
        }

        setupRestockIntervalInputs() {
            const daysInput = document.getElementById('restock-days-input');
            const hoursInput = document.getElementById('restock-hours-input');
            const minutesInput = document.getElementById('restock-minutes-input');
            const secondsInput = document.getElementById('restock-seconds-input');

            if (daysInput && hoursInput && minutesInput && secondsInput) {
                // 初始化显示值
                this.updateRestockIntervalDisplay();

                // 自动进退位处理函数
                const normalizeTime = (days, hours, minutes, seconds) => {
                    // 确保天不小于0，HMS不小于-1
                    days = Math.max(0, days || 0);
                    hours = Math.max(-1, hours || 0);
                    minutes = Math.max(-1, minutes || 0);
                    seconds = Math.max(-1, seconds || 0);

                    // 直接转换成总秒数
                    let totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;

                    // 确保总秒数不小于0
                    totalSeconds = Math.max(0, totalSeconds);

                    // 从总秒数重新计算各个单位
                    const newDays = Math.floor(totalSeconds / (24 * 3600));
                    const newHours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
                    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
                    const newSeconds = totalSeconds % 60;

                    return {
                        days: newDays,
                        hours: newHours,
                        minutes: newMinutes,
                        seconds: newSeconds
                    };
                };

                // 绑定事件
                const updateInterval = () => {
                    let days = parseInt(daysInput.value) || 0;
                    let hours = parseInt(hoursInput.value) || 0;
                    let minutes = parseInt(minutesInput.value) || 0;
                    let seconds = parseInt(secondsInput.value) || 0;

                    // 自动进退位
                    const normalized = normalizeTime(days, hours, minutes, seconds);

                    // 更新显示
                    daysInput.value = normalized.days;
                    hoursInput.value = normalized.hours;
                    minutesInput.value = normalized.minutes;
                    secondsInput.value = normalized.seconds;

                    // 计算总毫秒数
                    const totalMs = (normalized.days * 24 * 3600 + normalized.hours * 3600 + normalized.minutes * 60 + normalized.seconds) * 1000;
                    this.restockManager.checkIntervalMs = Math.max(5000, totalMs);

                    this.restockManager.saveRestockToStorage();
                    this.restockManager.restartAutoCheck();
                };

                daysInput.addEventListener('change', updateInterval);
                hoursInput.addEventListener('change', updateInterval);
                minutesInput.addEventListener('change', updateInterval);
                secondsInput.addEventListener('change', updateInterval);
            }
        }

        updateRestockIntervalDisplay() {
            const daysInput = document.getElementById('restock-days-input');
            const hoursInput = document.getElementById('restock-hours-input');
            const minutesInput = document.getElementById('restock-minutes-input');
            const secondsInput = document.getElementById('restock-seconds-input');

            if (daysInput && hoursInput && minutesInput && secondsInput) {
                const totalSeconds = Math.floor(this.restockManager.checkIntervalMs / 1000);
                const days = Math.floor(totalSeconds / (24 * 3600));
                const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                daysInput.value = days;
                hoursInput.value = hours;
                minutesInput.value = minutes;
                secondsInput.value = seconds;
            }
        }

        bindRestockEvents() {
            // 检测间隔设置 - 时分秒格式
            this.setupRestockIntervalInputs();

            // 全选控制
            const selectAllCheckbox = document.getElementById('restock-select-all-checkbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', (e) => {
                    this.restockManager.allSelected = e.target.checked;
                    // 更新所有物品的选中状态
                    this.restockManager.items.forEach(item => {
                        item.selected = e.target.checked;
                    });
                    this.restockManager.updateSelectAllState();
                    this.restockManager.updateRestockDisplay();
                    this.restockManager.saveRestockToStorage();
                });
            }

            // 自动检测开关
            const toggleAutoBtn = document.getElementById('restock-toggle-auto');
            if (toggleAutoBtn) {
                toggleAutoBtn.textContent = this.restockManager.isEnabled ? '自动执行：开' : '自动执行：关';
                toggleAutoBtn.style.backgroundColor = this.restockManager.isEnabled ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)';

                toggleAutoBtn.addEventListener('click', () => {
                    this.restockManager.isEnabled = !this.restockManager.isEnabled;
                    toggleAutoBtn.textContent = this.restockManager.isEnabled ? '自动执行：开' : '自动执行：关';
                    toggleAutoBtn.style.backgroundColor = this.restockManager.isEnabled ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)';

                    // 保存状态到本地存储
                    this.restockManager.saveRestockToStorage();

                    if (this.restockManager.isEnabled) {
                        this.restockManager.startAutoCheck();
                    } else {
                        this.restockManager.stopAutoCheck();
                    }
                });
            }

            // 批量设置按钮
            const batchSetAskBtn = document.getElementById('restock-batch-set-ask');
            const batchSetBidBtn = document.getElementById('restock-batch-set-bid');
            if (batchSetAskBtn) {
                batchSetAskBtn.addEventListener('click', () => this.restockManager.batchSetPurchaseMode('ask'));
            }
            if (batchSetBidBtn) {
                batchSetBidBtn.addEventListener('click', () => this.restockManager.batchSetPurchaseMode('bid'));
            }

            // 执行补货按钮
            const executeBtn = document.getElementById('restock-execute-selected');
            if (executeBtn) {
                executeBtn.addEventListener('click', () => this.restockManager.executeSelectedRestocks());
            }

            // 清空按钮
            const clearBtn = document.getElementById('restock-clear-all');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.restockManager.clearRestock());
            }
        }

        setupSellIntervalInputs() {
            const daysInput = document.getElementById('sell-days-input');
            const hoursInput = document.getElementById('sell-hours-input');
            const minutesInput = document.getElementById('sell-minutes-input');
            const secondsInput = document.getElementById('sell-seconds-input');

            if (daysInput && hoursInput && minutesInput && secondsInput) {
                // 初始化显示值
                this.updateSellIntervalDisplay();

                // 自动进退位处理函数
                const normalizeTime = (days, hours, minutes, seconds) => {
                    // 确保天不小于0，HMS不小于-1
                    days = Math.max(0, days || 0);
                    hours = Math.max(-1, hours || 0);
                    minutes = Math.max(-1, minutes || 0);
                    seconds = Math.max(-1, seconds || 0);

                    // 直接转换成总秒数
                    let totalSeconds = days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds;

                    // 确保总秒数不小于0
                    totalSeconds = Math.max(0, totalSeconds);

                    // 从总秒数重新计算各个单位
                    const newDays = Math.floor(totalSeconds / (24 * 3600));
                    const newHours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
                    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
                    const newSeconds = totalSeconds % 60;

                    return {
                        days: newDays,
                        hours: newHours,
                        minutes: newMinutes,
                        seconds: newSeconds
                    };
                };

                // 绑定事件
                const updateInterval = () => {
                    let days = parseInt(daysInput.value) || 0;
                    let hours = parseInt(hoursInput.value) || 0;
                    let minutes = parseInt(minutesInput.value) || 0;
                    let seconds = parseInt(secondsInput.value) || 0;

                    // 自动进退位
                    const normalized = normalizeTime(days, hours, minutes, seconds);

                    // 更新显示
                    daysInput.value = normalized.days;
                    hoursInput.value = normalized.hours;
                    minutesInput.value = normalized.minutes;
                    secondsInput.value = normalized.seconds;

                    // 计算总毫秒数
                    const totalMs = (normalized.days * 24 * 3600 + normalized.hours * 3600 + normalized.minutes * 60 + normalized.seconds) * 1000;
                    this.sellManager.checkIntervalMs = Math.max(5000, totalMs);

                    this.sellManager.saveSellToStorage();
                    this.sellManager.restartAutoCheck();
                };

                daysInput.addEventListener('change', updateInterval);
                hoursInput.addEventListener('change', updateInterval);
                minutesInput.addEventListener('change', updateInterval);
                secondsInput.addEventListener('change', updateInterval);
            }
        }

        updateSellIntervalDisplay() {
            const daysInput = document.getElementById('sell-days-input');
            const hoursInput = document.getElementById('sell-hours-input');
            const minutesInput = document.getElementById('sell-minutes-input');
            const secondsInput = document.getElementById('sell-seconds-input');

            if (daysInput && hoursInput && minutesInput && secondsInput) {
                const totalSeconds = Math.floor(this.sellManager.checkIntervalMs / 1000);
                const days = Math.floor(totalSeconds / (24 * 3600));
                const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                daysInput.value = days;
                hoursInput.value = hours;
                minutesInput.value = minutes;
                secondsInput.value = seconds;
            }
        }

        bindSellEvents() {
            // 检测间隔设置 - 时分秒格式
            this.setupSellIntervalInputs();

            // 全选控制
            const selectAllCheckbox = document.getElementById('sell-select-all-checkbox');
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', (e) => {
                    this.sellManager.allSelected = e.target.checked;
                    // 更新所有物品的选中状态
                    this.sellManager.items.forEach(item => {
                        item.selected = e.target.checked;
                    });
                    this.sellManager.updateSelectAllState();
                    this.sellManager.updateSellDisplay();
                    this.sellManager.saveSellToStorage();
                });
            }

            // 自动检测开关
            const toggleAutoBtn = document.getElementById('sell-toggle-auto');
            if (toggleAutoBtn) {
                toggleAutoBtn.textContent = this.sellManager.isEnabled ? '自动执行：开' : '自动执行：关';
                toggleAutoBtn.style.backgroundColor = this.sellManager.isEnabled ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)';

                toggleAutoBtn.addEventListener('click', () => {
                    this.sellManager.isEnabled = !this.sellManager.isEnabled;
                    toggleAutoBtn.textContent = this.sellManager.isEnabled ? '自动执行：开' : '自动执行：关';
                    toggleAutoBtn.style.backgroundColor = this.sellManager.isEnabled ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)';

                    // 保存状态到本地存储
                    this.sellManager.saveSellToStorage();

                    if (this.sellManager.isEnabled) {
                        this.sellManager.startAutoCheck();
                    } else {
                        this.sellManager.stopAutoCheck();
                    }
                });
            }

            // 批量设置按钮
            const batchSetAskBtn = document.getElementById('sell-batch-set-ask');
            const batchSetBidBtn = document.getElementById('sell-batch-set-bid');
            if (batchSetAskBtn) {
                batchSetAskBtn.addEventListener('click', () => this.sellManager.batchSetSellMode('ask'));
            }
            if (batchSetBidBtn) {
                batchSetBidBtn.addEventListener('click', () => this.sellManager.batchSetSellMode('bid'));
            }

            // 执行出售按钮
            const executeBtn = document.getElementById('sell-execute-selected');
            if (executeBtn) {
                executeBtn.addEventListener('click', () => this.sellManager.executeSelectedSells());
            }

            // 清空按钮
            const clearBtn = document.getElementById('sell-clear-all');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.sellManager.clearSell());
            }
        }

        switchTab(tabName) {
            console.log('[UnifiedDrawer] 切换到页签:', tabName);
            this.currentTab = tabName;

            // 更新页签按钮状态
            const restockTab = document.getElementById('tab-restock');
            const sellTab = document.getElementById('tab-sell');
            const restockContent = document.getElementById('restock-content');
            const sellContent = document.getElementById('sell-content');

            console.log('[UnifiedDrawer] 页签元素:', {
                restockTab: !!restockTab,
                sellTab: !!sellTab,
                restockContent: !!restockContent,
                sellContent: !!sellContent
            });

            if (tabName === 'restock') {
                // 移除所有active类
                if (restockTab) restockTab.classList.add('active');
                if (sellTab) sellTab.classList.remove('active');
                if (restockContent) {
                    restockContent.classList.add('active');
                    restockContent.style.display = 'flex';
                }
                if (sellContent) {
                    sellContent.classList.remove('active');
                    sellContent.style.display = 'none';
                }
                console.log('[UnifiedDrawer] 切换到补货页签');
            } else {
                // 移除所有active类
                if (sellTab) sellTab.classList.add('active');
                if (restockTab) restockTab.classList.remove('active');
                if (sellContent) {
                    sellContent.classList.add('active');
                    sellContent.style.display = 'flex';
                }
                if (restockContent) {
                    restockContent.classList.remove('active');
                    restockContent.style.display = 'none';
                }
                console.log('[UnifiedDrawer] 切换到出售页签');
            }

            // 更新显示
            this.updateBadge();
        }

        updateBadge() {
            const countDisplay = document.getElementById('unified-count-display');

            const totalItems = this.restockManager.items.size + this.sellManager.items.size;

            if (countDisplay) {
                countDisplay.textContent = `${totalItems} 项`;
            }
        }

        setupTabDragAndClick() {
            const tab = document.getElementById('unified-tab');
            if (!tab) return;

            let isDragging = false;
            let startY, currentTopPercent;
            this.wasDragged = false;

            const handleStart = (e) => {
                isDragging = true;
                this.wasDragged = false;

                const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

                const currentTop = tab.style.top;
                if (currentTop.includes('%')) {
                    currentTopPercent = parseFloat(currentTop);
                } else if (currentTop.includes('px')) {
                    const containerHeight = this.container.offsetHeight;
                    const topPx = parseFloat(currentTop);
                    currentTopPercent = (topPx / containerHeight) * 100;
                } else {
                    currentTopPercent = 10;
                }

                startY = clientY;
                tab.style.transition = 'none';
                e.preventDefault();
                e.stopPropagation();
            };

            const handleMove = (e) => {
                if (!isDragging) return;

                const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
                const deltaY = clientY - startY;

                if (Math.abs(deltaY) > 5) {
                    this.wasDragged = true;
                }

                const containerHeight = this.container.offsetHeight;
                const deltaPercent = (deltaY / containerHeight) * 100;

                let newPercent = currentTopPercent + deltaPercent;
                newPercent = Math.max(5, Math.min(newPercent, 95));
                tab.style.top = newPercent + '%';
                this.tabPosition.y = newPercent + '%';
            };

            const handleEnd = () => {
                if (!isDragging) return;
                isDragging = false;

                tab.style.transition = 'all 0.3s ease';
                this.saveTabPosition();

                setTimeout(() => {
                    if (!isDragging) {
                        this.wasDragged = false;
                    }
                }, 100);
            };

            // 点击事件处理
            const handleClick = (e) => {
                if (!this.wasDragged) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle();
                }
                setTimeout(() => {
                    this.wasDragged = false;
                }, 100);
            };

            // 右键清空所有列表
            const handleContextMenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                if ((this.restockManager.items.size > 0 || this.sellManager.items.size > 0) && !this.wasDragged) {
                    if (confirm('确定要清空所有列表吗？')) {
                        this.restockManager.clearRestock();
                        this.sellManager.clearSell();
                    }
                }
            };

            // 鼠标事件
            tab.addEventListener('mousedown', handleStart);
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            tab.addEventListener('click', handleClick);
            tab.addEventListener('contextmenu', handleContextMenu);

            // 触摸事件
            tab.addEventListener('touchstart', handleStart, { passive: false });
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);
        }

        toggle() {
            this.isOpen ? this.close() : this.open();
        }

        open() {
            if (this.container) {
                this.container.style.transform = 'translateX(0)';
                this.isOpen = true;
            }
        }

        close() {
            if (this.container) {
                const translateX = Math.min(window.innerWidth, 450);
                this.container.style.transform = `translateX(${translateX}px)`;
                this.isOpen = false;
            }
        }

        cleanup() {
            if (this.restockManager) {
                this.restockManager.cleanup();
            }
            if (this.sellManager) {
                this.sellManager.cleanup();
            }
            if (this.container) {
                this.container.remove();
                this.container = null;
            }
        }
    }

    // ==================== 脚本初始化 ====================
    function initializeScript() {
        console.log('[WarehouseHelper] 初始化战斗仓库小助手...');

        // 等待MWI脚本加载
        const checkMWI = () => {
            const hasMWI = window.MWIModules && window.PGE;
            console.log('[WarehouseHelper] 检查MWI状态:', {
                MWIModules: !!window.MWIModules,
                PGE: !!window.PGE,
                hasMWI
            });
            return hasMWI;
        };

        if (!checkMWI()) {
            console.log('[WarehouseHelper] MWI未就绪，开始轮询...');
            const interval = setInterval(() => {
                if (checkMWI()) {
                    clearInterval(interval);
                    console.log('[WarehouseHelper] MWI已就绪，开始初始化');
                    startWarehouseHelper();
                }
            }, 1000);
        } else {
            console.log('[WarehouseHelper] MWI已就绪，直接初始化');
            startWarehouseHelper();
        }
    }

    function startWarehouseHelper() {
        try {
            console.log('[WarehouseHelper] 开始初始化组件...');

            // 初始化Toast和API
            if (!window.MWIModules.toast) {
                console.log('[WarehouseHelper] 创建Toast实例');
                window.MWIModules.toast = new Toast();
            }
            if (!window.MWIModules.api) {
                console.log('[WarehouseHelper] 创建API实例');
                window.MWIModules.api = new API();
            }

            // 初始化统一抽屉管理器
            console.log('[WarehouseHelper] 创建UnifiedDrawerManager实例');
            window.MWIModules.unifiedWarehouse = new UnifiedDrawerManager();

            // 添加测试方法
            window.testTabSwitch = () => {
                console.log('[Test] 测试页签切换功能');
                if (window.MWIModules.unifiedWarehouse) {
                    window.MWIModules.unifiedWarehouse.switchTab('sell');
                    setTimeout(() => {
                        window.MWIModules.unifiedWarehouse.switchTab('restock');
                    }, 1000);
                }
            };

            // 添加强制切换方法
            window.forceTabSwitch = (tabName) => {
                console.log('[Test] 强制切换到页签:', tabName);
                if (window.MWIModules.unifiedWarehouse) {
                    window.MWIModules.unifiedWarehouse.switchTab(tabName);
                }
            };

            // 添加倒计时调试方法
            window.debugCountdown = () => {
                console.log('[Debug] 补货管理器状态:', {
                    isEnabled: window.MWIModules.unifiedWarehouse?.restockManager?.isEnabled,
                    itemsSize: window.MWIModules.unifiedWarehouse?.restockManager?.items?.size,
                    checkInterval: window.MWIModules.unifiedWarehouse?.restockManager?.checkIntervalMs,
                    nextExecutionTime: window.MWIModules.unifiedWarehouse?.restockManager?.nextExecutionTime
                });
                console.log('[Debug] 出售管理器状态:', {
                    isEnabled: window.MWIModules.unifiedWarehouse?.sellManager?.isEnabled,
                    itemsSize: window.MWIModules.unifiedWarehouse?.sellManager?.items?.size,
                    checkInterval: window.MWIModules.unifiedWarehouse?.sellManager?.checkIntervalMs,
                    nextExecutionTime: window.MWIModules.unifiedWarehouse?.sellManager?.nextExecutionTime
                });
            };

            console.log('[WarehouseHelper] 战斗仓库小助手初始化完成');
            console.log('[WarehouseHelper] 使用 window.testTabSwitch() 测试页签切换功能');
        } catch (error) {
            console.error('[WarehouseHelper] 初始化失败:', error);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();
