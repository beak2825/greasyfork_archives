// ==UserScript==
// @name         泡泡玛特自提助手 (移动端)
// @namespace    http://tampermonkey.net/
// @version      3.9.4
// @description  自动查找有货的泡泡玛特自提门店并完成下单 (移动端版本) - 全选激进点击策略，多方式重试
// @author       You
// @match        https://m.popmart.com/hk/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554090/%E6%B3%A1%E6%B3%A1%E7%8E%9B%E7%89%B9%E8%87%AA%E6%8F%90%E5%8A%A9%E6%89%8B%20%28%E7%A7%BB%E5%8A%A8%E7%AB%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554090/%E6%B3%A1%E6%B3%A1%E7%8E%9B%E7%89%B9%E8%87%AA%E6%8F%90%E5%8A%A9%E6%89%8B%20%28%E7%A7%BB%E5%8A%A8%E7%AB%AF%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置参数 ====================
    const CONFIG = {
        // 等待元素超时时间（毫秒）
        ELEMENT_WAIT_TIMEOUT: 10000,
        // 页面切换延迟时间（毫秒）
        PAGE_SWITCH_DELAY: 1000,
        // 循环间隔时间（毫秒）
        LOOP_INTERVAL: 1000,
        // 支付页面加载完成后额外等待时间（毫秒）
        PAYMENT_PAGE_EXTRA_WAIT: 500,
        // 购物车页面加载超时时间（毫秒）
        CART_PAGE_LOAD_TIMEOUT: 5000,
        // 支付页面加载超时时间（毫秒）
        PAYMENT_PAGE_LOAD_TIMEOUT: 10000,
        // 支付提交检测超时时间（毫秒）
        PAYMENT_SUBMIT_CHECK_TIMEOUT: 5000,
        // 数量调整延迟时间（毫秒）
        QUANTITY_ADJUSTMENT_DELAY: 300,
        // 数量检查超时时间（毫秒）
        QUANTITY_CHECK_TIMEOUT: 5000,
        // 支付按钮点击间隔时间（毫秒）
        SUBMIT_SPEED: 1000,
        // 支付流程总执行时长（毫秒）
        SUBMIT_DURATION: 5000
    };

    // ==================== 全局变量 ====================
    let selectedStores = [];
    let currentStoreIndex = 0;
    let isRunning = false; // 默认停止状态
    let isExecuting = false; // 防止重复执行的锁
    let storeSelector = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let isCollapsed = false;
    let isFirstRunAfterClick = false; // 标记是否是点击运行后的第一次操作
    
    // 定时运行相关变量
    let isScheduledEnabled = false;
    let scheduledTime = { hour: 0, minute: 0, second: 0, millisecond: 0 };
    let scheduleInterval = null;
    
    // 自定义数量相关变量
    let isQuantityEnabled = false;
    let targetQuantity = 1;
    
    // 商品页面刷库存相关变量
    let isProductPageModeEnabled = false;

    // 动态加载的门店列表（需要同步）
    let ALL_STORES = [];
    
    // API检测相关变量
    let latestApiResponse = null;
    let apiResponseResolvers = [];
    
    // 购物车API响应变量
    let latestCartApiResponse = null;
    let cartApiResponseResolvers = [];

    // ==================== 店铺名称标准化 ====================
    function normalizeStoreName(name) {
        return name.replace(/^POP\s*MART\s*/i, '').trim();
    }

    // ==================== API拦截器 ====================
    // 拦截fetch和XMLHttpRequest来获取API响应（iOS兼容）
    function setupApiInterceptor() {
        console.log('🚀 初始化API拦截器（iOS兼容模式）');
        
        // 拦截fetch
        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);
            const url = args[0];
            
            // 检查是否是商品详情API
            if (typeof url === 'string' && url.includes('/store/v1/store/product/detail')) {
                console.log('✓ 拦截到商品详情API:', url);
                
                // 克隆响应以便读取
                const clonedResponse = response.clone();
                try {
                    const data = await clonedResponse.json();
                    console.log('✓ API返回数据:', data);
                    latestApiResponse = data;
                    
                    // 通知所有等待的resolver
                    apiResponseResolvers.forEach(resolve => resolve(data));
                    apiResponseResolvers = [];
                } catch (error) {
                    console.error('解析API响应失败:', error);
                }
            }
            
            // 检查是否是购物车API
            if (typeof url === 'string' && url.includes('/store/v1/store/cart/listByStore')) {
                console.log('✓ 拦截到购物车API:', url);
                
                // 使用正则提取storeId（iOS兼容性更好）
                const storeIdMatch = url.match(/storeId=(\d+)/);
                const storeId = storeIdMatch ? storeIdMatch[1] : null;
                
                // 克隆响应以便读取
                const clonedResponse = response.clone();
                try {
                    const data = await clonedResponse.json();
                    
                    // 直接解析库存信息（避免业务逻辑重复解析）
                    const cartItems = data?.data?.shoppingCartDataList;
                    let stock = 0;
                    let hasStock = false;
                    let reason = '未知';
                    
                    if (!cartItems || cartItems.length === 0) {
                        reason = '购物车为空';
                    } else {
                        const firstItem = cartItems[0];
                        stock = firstItem?.sku?.stock?.onlineStock || 0;
                        hasStock = stock > 0;
                        reason = hasStock ? `有货（库存:${stock}）` : '无货（库存为0）';
                    }
                    
                    console.log(`✓ 购物车API返回 [店铺${storeId}] ${reason}`);
                    
                    // 保存原始数据和解析结果
                    latestCartApiResponse = {
                        storeId: storeId,
                        data: data,
                        stock: stock,
                        hasStock: hasStock,
                        reason: reason,
                        timestamp: Date.now()
                    };
                    
                    // 通知所有等待的resolver
                    cartApiResponseResolvers.forEach(resolve => resolve(latestCartApiResponse));
                    cartApiResponseResolvers = [];
                } catch (error) {
                    console.error('解析购物车API响应失败:', error);
                }
            }
            
            return response;
        };
        
        // 拦截XMLHttpRequest
        const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalSend = unsafeWindow.XMLHttpRequest.prototype.send;
        
        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...rest]);
        };
        
        unsafeWindow.XMLHttpRequest.prototype.send = function(...args) {
            // 拦截商品详情API
            if (this._url && this._url.includes('/store/v1/store/product/detail')) {
                console.log('✓ 拦截到商品详情API (XHR):', this._url);
                
                this.addEventListener('load', function() {
                    try {
                        const data = JSON.parse(this.responseText);
                        console.log('✓ API返回数据 (XHR):', data);
                        latestApiResponse = data;
                        
                        // 通知所有等待的resolver
                        apiResponseResolvers.forEach(resolve => resolve(data));
                        apiResponseResolvers = [];
                    } catch (error) {
                        console.error('解析API响应失败 (XHR):', error);
                    }
                });
            }
            
            // 拦截购物车API
            if (this._url && this._url.includes('/store/v1/store/cart/listByStore')) {
                console.log('✓ 拦截到购物车API (XHR):', this._url);
                
                this.addEventListener('load', function() {
                    try {
                        const data = JSON.parse(this.responseText);
                        // 使用正则提取storeId（iOS兼容性更好）
                        const storeIdMatch = this._url.match(/storeId=(\d+)/);
                        const storeId = storeIdMatch ? storeIdMatch[1] : null;
                        
                        // 直接解析库存信息（避免业务逻辑重复解析）
                        const cartItems = data?.data?.shoppingCartDataList;
                        let stock = 0;
                        let hasStock = false;
                        let reason = '未知';
                        
                        if (!cartItems || cartItems.length === 0) {
                            reason = '购物车为空';
                        } else {
                            const firstItem = cartItems[0];
                            stock = firstItem?.sku?.stock?.onlineStock || 0;
                            hasStock = stock > 0;
                            reason = hasStock ? `有货（库存:${stock}）` : '无货（库存为0）';
                        }
                        
                        console.log(`✓ 购物车API返回 [店铺${storeId}] ${reason}`);
                        
                        // 保存原始数据和解析结果
                        latestCartApiResponse = {
                            storeId: storeId,
                            data: data,
                            stock: stock,
                            hasStock: hasStock,
                            reason: reason,
                            timestamp: Date.now()
                        };
                        
                        // 通知所有等待的resolver
                        cartApiResponseResolvers.forEach(resolve => resolve(latestCartApiResponse));
                        cartApiResponseResolvers = [];
                    } catch (error) {
                        console.error('解析购物车API响应失败 (XHR):', error);
                    }
                });
            }
            
            return originalSend.apply(this, args);
        };
        
        console.log('✅ API拦截器已启动（iOS兼容模式）');
    }
    
    // 等待API响应
    function waitForApiResponse(timeout = 10000) {
        return new Promise((resolve, reject) => {
            // 如果已经有最新的响应，直接返回
            if (latestApiResponse) {
                resolve(latestApiResponse);
                return;
            }
            
            // 否则等待新的响应
            apiResponseResolvers.push(resolve);
            
            // 设置超时
            setTimeout(() => {
                const index = apiResponseResolvers.indexOf(resolve);
                if (index > -1) {
                    apiResponseResolvers.splice(index, 1);
                }
                reject(new Error('等待API响应超时'));
            }, timeout);
        });
    }
    
    // 等待购物车API响应（简化版：不需要ID匹配，时序保证对应关系）
    // 返回完整的响应对象（包含解析好的 stock、hasStock、reason）
    function waitForCartApiResponse(timeout = 3000) {
        return new Promise((resolve, reject) => {
            // 如果已经有最新的响应，直接返回整个response对象
            if (latestCartApiResponse) {
                resolve(latestCartApiResponse);
                return;
            }
            
            // 否则等待新的响应
            cartApiResponseResolvers.push(resolve);
            
            // 设置超时
            setTimeout(() => {
                const index = cartApiResponseResolvers.indexOf(resolve);
                if (index > -1) {
                    cartApiResponseResolvers.splice(index, 1);
                }
                reject(new Error('等待购物车API响应超时'));
            }, timeout);
        });
    }
    
    // 获取页面价格
    function getPriceFromPage() {
        try {
            const priceElement = document.querySelector('.index_totalNum__0lVik');
            if (!priceElement) {
                return 0;
            }
            
            const priceText = priceElement.textContent.trim();
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            return isNaN(price) ? 0 : price;
        } catch (error) {
            console.error('[价格检测] 读取失败:', error);
            return 0;
        }
    }
    
    // 确保全选按钮已选中（通过价格判断）
    async function ensureSelectAllByPrice(maxRetries = 5, retryInterval = 100) {
        try {
            // 检查当前价格
            const currentPrice = getPriceFromPage();
            
            if (currentPrice > 0) {
                console.log(`[全选检测] 已选中（价格:¥${currentPrice}）`);
                return { success: true, price: currentPrice };
            }
            
            // 价格为0，需要点击全选（带重试机制）
            // API有货说明全选按钮一定存在，不判断直接点击
            console.log('[全选检测] 未选中（价格为0），开始尝试点击全选');
            
            // 重试循环（最多5次）
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                console.log(`[全选检测] 第${attempt}次尝试点击全选`);
                
                // 直接选择容器（不判断是否存在）
                const selectAllContainer = document.querySelector('.index_checkboxContainer__nQZ_a');
                
                // 多种方式尝试点击（使用可选链，即使元素不存在也不会报错）
                try {
                    // 方式1：点击容器本身
                    selectAllContainer?.click();
                    
                    // 方式2：点击复选框按钮
                    const checkboxButton = selectAllContainer?.querySelector('.index_checkbox__w_166');
                    checkboxButton?.click();
                    
                    // 方式3：点击选择文本
                    const selectText = selectAllContainer?.querySelector('.index_selectText___HDXz');
                    selectText?.click();
                    
                    // 方式4：模拟点击事件
                    if (selectAllContainer) {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        selectAllContainer.dispatchEvent(clickEvent);
                    }
                } catch (clickError) {
                    console.log(`[全选检测] 点击时出现异常:`, clickError.message);
                }
                
                // 等待价格更新
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // 验证价格
                const newPrice = getPriceFromPage();
                if (newPrice > 0) {
                    console.log(`[全选检测] ✓ 第${attempt}次尝试成功（价格:¥${newPrice}）`);
                    return { success: true, price: newPrice };
                }
                
                // 如果不是最后一次尝试，等待后重试
                if (attempt < maxRetries) {
                    console.log(`[全选检测] ✗ 第${attempt}次尝试失败，${retryInterval}ms后重试`);
                    await new Promise(resolve => setTimeout(resolve, retryInterval));
                } else {
                    console.log(`[全选检测] ✗ 已重试${maxRetries}次，全部失败`);
                }
            }
            
            return { success: false, reason: `全选重试${maxRetries}次均失败` };
        } catch (error) {
            console.error('[全选检测] 异常:', error);
            return { success: false, reason: '全选操作异常' };
        }
    }

    // ==================== 工具函数 ====================
    // 等待元素出现
    function waitForElement(selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) {
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

    // 等待元素消失
    function waitForElementDisappear(selector, timeout = CONFIG.ELEMENT_WAIT_TIMEOUT) {
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

    // 点击元素
    function clickElement(element) {
        if (element) {
            element.click();
            return true;
        }
        return false;
    }

    // ==================== 页面操作函数 ====================
    // 检查是否在"到店取"标签页
    function isPickupTabActive() {
        const activeTab = document.querySelector('.adm-tabs-tab-active');
        return activeTab && activeTab.textContent.includes('到店取');
    }

    // 切换到"到店取"标签页
    async function switchToPickupTab() {
        if (!isPickupTabActive()) {
            // 查找"到店取"标签页
            const pickupTabs = document.querySelectorAll('.adm-tabs-tab');
            for (let tab of pickupTabs) {
                if (tab.textContent.includes('到店取')) {
                    tab.click();
                    await new Promise(resolve => setTimeout(resolve, CONFIG.PAGE_SWITCH_DELAY));
                    break;
                }
            }
        }
    }

    // 检查商品是否有货
    function isProductInStock() {
        const totalContainer = document.querySelector('.index_totalNum__0lVik');
        if (totalContainer) {
            const priceText = totalContainer.textContent.trim();
            // 检查价格是否大于0
            const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
            return price > 0;
        }
        return false;
    }

    // 检查全选按钮是否存在（第一层检测）
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

    // 获取当前页面显示的店铺名称
    function getCurrentStoreName() {
        const storeElement = document.querySelector('.index_storeInfo__G9rTP');
        if (storeElement) {
            const fullText = storeElement.textContent.trim();
            // 提取门店名称（去掉"POP MART"前缀）
            const storeName = fullText.replace('POP MART', '').trim();
            return storeName;
        }
        return null;
    }

    // 根据当前页面显示的店铺设置起始索引
    function setStartingStoreIndex() {
        const currentStoreName = getCurrentStoreName();
        if (currentStoreName) {
            // 在选中的店铺中查找当前店铺
            for (let i = 0; i < selectedStores.length; i++) {
                const selectedIndex = selectedStores[i];
                if (selectedIndex < ALL_STORES.length && ALL_STORES[selectedIndex] === currentStoreName) {
                    // 找到当前店铺，设置起始索引为下一个店铺
                    currentStoreIndex = (i + 1) % selectedStores.length;
                    return;
                }
            }
        }
        // 如果没找到当前店铺，从第一个选中的店铺开始
        currentStoreIndex = 0;
    }

    // 等待购物车页面加载完成
    async function waitForCartPageLoad() {
        // 等待loading元素消失 并且 确认并支付按钮出现
        await Promise.all([
            waitForElementDisappear('.index_loading__ppHKz', CONFIG.CART_PAGE_LOAD_TIMEOUT),
            waitForElement('.index_checkoutContainer__5hRri', CONFIG.CART_PAGE_LOAD_TIMEOUT)
        ]);
    }

    // 等待支付页面加载完成
    async function waitForPaymentPageLoad() {
        // 首先等待支付页面加载元素出现
        await waitForElement('.index_loading__PKvd1', CONFIG.PAYMENT_PAGE_LOAD_TIMEOUT);
        // 然后等待该元素消失，表示加载完成
        await waitForElementDisappear('.index_loading__PKvd1', CONFIG.PAYMENT_PAGE_LOAD_TIMEOUT);
    }

    // 获取用户选择的门店
    function getUserSelectedStores() {
        return GM_getValue('popmart_mobile_selectedStores', []);
    }

    // 保存用户选择的门店
    function saveUserSelectedStores(stores) {
        GM_setValue('popmart_mobile_selectedStores', stores);
        selectedStores = [...stores];
        const storeNames = stores.map(index => ALL_STORES[index]);
        GM_setValue('popmart_mobile_selectedStoreNames', storeNames);
    }

    // 获取用户运行状态
    function getUserRunningState() {
        return GM_getValue('popmart_mobile_isRunning', false);
    }

    // 保存用户运行状态
    function saveUserRunningState(state) {
        GM_setValue('popmart_mobile_isRunning', state);
        isRunning = state;
    }

    // 获取定时设置
    function getUserScheduleSettings() {
        return GM_getValue('popmart_mobile_scheduleSettings', {
            enabled: false,
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        });
    }

    // 保存定时设置
    function saveUserScheduleSettings(settings) {
        GM_setValue('popmart_mobile_scheduleSettings', settings);
        isScheduledEnabled = settings.enabled;
        scheduledTime = {
            hour: settings.hour,
            minute: settings.minute,
            second: settings.second,
            millisecond: settings.millisecond
        };
    }

    // 获取商品数量设置
    function getUserQuantitySettings() {
        return GM_getValue('popmart_mobile_quantitySettings', {
            enabled: false,
            targetQuantity: 1
        });
    }

    // 保存商品数量设置
    function saveUserQuantitySettings(settings) {
        GM_setValue('popmart_mobile_quantitySettings', settings);
        isQuantityEnabled = settings.enabled;
        targetQuantity = settings.targetQuantity;
    }

    // 获取商品页面模式设置
    function getUserProductPageModeSettings() {
        return GM_getValue('popmart_mobile_productPageModeSettings', {
            enabled: false
        });
    }

    // 保存商品页面模式设置
    function saveUserProductPageModeSettings(settings) {
        GM_setValue('popmart_mobile_productPageModeSettings', settings);
        isProductPageModeEnabled = settings.enabled;
    }

    // ==================== 自定义数量功能 ====================
    
    // 获取当前数量
    function getCurrentQuantity() {
        const quantityInput = document.querySelector('.product_input__nuRUP input');
        if (quantityInput) {
            return parseInt(quantityInput.value) || 1;
        }
        return 1;
    }

    // 点击增加数量按钮
    function clickIncreaseButton() {
        const increaseButton = document.querySelector('.product_icon__5_Tgp:last-child');
        if (increaseButton && !increaseButton.classList.contains('disabled')) {
            increaseButton.click();
            return true;
        }
        return false;
    }

    // 点击减少数量按钮
    function clickDecreaseButton() {
        const decreaseButton = document.querySelector('.product_icon__5_Tgp:first-child');
        if (decreaseButton && !decreaseButton.classList.contains('disabled')) {
            decreaseButton.click();
            return true;
        }
        return false;
    }

    // 增加数量
    async function increaseQuantity() {
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 3;
        
        while (consecutiveFailures < maxConsecutiveFailures) {
            // 每次循环前都重新检查当前数量
            const currentQuantity = getCurrentQuantity();
            console.log(`当前数量: ${currentQuantity}, 目标数量: ${targetQuantity}`);
            
            // 如果已经达到或超过目标数量，停止增加
            if (currentQuantity >= targetQuantity) {
                console.log(`数量已达标: ${currentQuantity} >= ${targetQuantity}`);
                return { success: true, message: '数量已达标' };
            }
            
            const beforeQuantity = currentQuantity;
            clickIncreaseButton();
            
            await new Promise(resolve => setTimeout(resolve, CONFIG.QUANTITY_ADJUSTMENT_DELAY));
            
            const afterQuantity = getCurrentQuantity();
            
            if (afterQuantity > beforeQuantity) {
                consecutiveFailures = 0;
                console.log(`数量增加成功: ${beforeQuantity} -> ${afterQuantity}`);
                
                // 增加成功后再次检查是否达到目标
                if (afterQuantity >= targetQuantity) {
                    console.log(`增加后数量已达标: ${afterQuantity} >= ${targetQuantity}`);
                    return { success: true, message: '数量已达标' };
                }
            } else {
                consecutiveFailures++;
                console.log(`数量增加失败，连续失败次数: ${consecutiveFailures}`);
            }
        }
        
        if (consecutiveFailures >= maxConsecutiveFailures) {
            return { success: false, message: '无法增加数量，可能库存不足' };
        }
        
        return { success: true, message: '数量调整完成' };
    }

    // 减少数量
    async function decreaseQuantity() {
        let consecutiveFailures = 0;
        const maxConsecutiveFailures = 3;
        
        while (consecutiveFailures < maxConsecutiveFailures) {
            // 每次循环前都重新检查当前数量
            const currentQuantity = getCurrentQuantity();
            console.log(`当前数量: ${currentQuantity}, 目标数量: ${targetQuantity}`);
            
            // 如果已经达到或低于目标数量，停止减少
            if (currentQuantity <= targetQuantity) {
                console.log(`数量已达标: ${currentQuantity} <= ${targetQuantity}`);
                return { success: true, message: '数量已达标' };
            }
            
            const beforeQuantity = currentQuantity;
            clickDecreaseButton();
            
            await new Promise(resolve => setTimeout(resolve, CONFIG.QUANTITY_ADJUSTMENT_DELAY));
            
            const afterQuantity = getCurrentQuantity();
            
            if (afterQuantity < beforeQuantity) {
                consecutiveFailures = 0;
                console.log(`数量减少成功: ${beforeQuantity} -> ${afterQuantity}`);
                
                // 减少成功后再次检查是否达到目标
                if (afterQuantity <= targetQuantity) {
                    console.log(`减少后数量已达标: ${afterQuantity} <= ${targetQuantity}`);
                    return { success: true, message: '数量已达标' };
                }
            } else {
                consecutiveFailures++;
                console.log(`数量减少失败，连续失败次数: ${consecutiveFailures}`);
            }
        }
        
        if (consecutiveFailures >= maxConsecutiveFailures) {
            return { success: false, message: '无法减少数量' };
        }
        
        return { success: true, message: '数量调整完成' };
    }

    // 调整到固定数量
    async function adjustToFixedQuantity() {
        if (!isQuantityEnabled) {
            return { success: true, message: '自定义数量功能未启用' };
        }

        const currentQuantity = getCurrentQuantity();
        console.log(`当前数量: ${currentQuantity}, 目标数量: ${targetQuantity}`);

        if (currentQuantity === targetQuantity) {
            return { success: true, message: '数量已达标' };
        }

        if (currentQuantity < targetQuantity) {
            return await increaseQuantity();
        } else {
            return await decreaseQuantity();
        }
    }

    // 检查商品可用性（包括数量检查）
    async function checkProductAvailability() {
        if (!isQuantityEnabled) {
            return { success: true, message: '自定义数量功能未启用' };
        }

        console.log('开始检查商品可用性...');
        
        // 先清理可能存在的库存不足通知
        clearStockInsufficientNotification();
        
        const adjustResult = await adjustToFixedQuantity();
        
        if (!adjustResult.success) {
            console.log(`数量调整失败: ${adjustResult.message}`);
            return { success: false, message: adjustResult.message };
        }
        
        console.log(`数量调整成功: ${adjustResult.message}`);
        return { success: true, message: '商品可用且数量已调整' };
    }

    // 清理库存不足通知
    function clearStockInsufficientNotification() {
        const notification = document.querySelector('.adm-auto-center');
        if (notification && notification.textContent.includes('商品庫存不足')) {
            notification.remove();
            console.log('已清理库存不足通知');
        }
    }

    // ==================== 商品页面刷库存功能 ====================
    
    // 检测商品页面库存状态（基于API）
    async function getProductPageStockStatus() {
        console.log('========== 开始检测商品页面库存状态（API模式）==========');
        
        try {
            // 清空之前的API响应
            latestApiResponse = null;
            
            console.log('等待API响应...');
            const apiData = await waitForApiResponse(10000);
            
            console.log('✓ 收到API响应');
            
            // 检查API返回状态
            if (!apiData || !apiData.data) {
                console.error('API数据格式错误');
                return { status: 'unknown', element: null };
            }
            
            const data = apiData.data;
            
            // 判断库存状态
            const isAvailable = data.isAvailableInTheStore;
            const isSoldOut = data.isSoldOut;
            const hasStock = data.skus && data.skus.length > 0 && 
                            data.skus[0].stock && 
                            data.skus[0].stock.onlineStock > 0;
            
            console.log('库存信息:');
            console.log('  isAvailableInTheStore:', isAvailable);
            console.log('  isSoldOut:', isSoldOut);
            console.log('  hasStock:', hasStock);
            
            // 判定逻辑：店铺有货 且 未售罄 且 有库存
            if (isAvailable && !isSoldOut && hasStock) {
                console.log('✓ 最终结果：商品有货');
                console.log('='.repeat(50));
                return { status: 'in_stock', element: null };
            } else {
                console.log('✗ 最终结果：商品无货');
                console.log('='.repeat(50));
                return { status: 'out_of_stock', element: null };
            }
            
        } catch (error) {
            console.error('检测库存时出错:', error);
            console.log('='.repeat(50));
            return { status: 'unknown', element: null };
        }
    }

    // 简化的库存检测（兼容原有逻辑）
    async function isProductPageInStock() {
        const stockStatus = await getProductPageStockStatus();
        return stockStatus.status === 'in_stock';
    }

    // 获取商品页面数量
    function getProductPageQuantity() {
        const quantityInput = document.querySelector('.index_countInput__pvaLv input');
        if (quantityInput) {
            return parseInt(quantityInput.value) || 1;
        }
        return 1;
    }

    // 点击商品页面增加数量按钮
    function clickProductPageIncreaseButton() {
        const buttons = document.querySelectorAll('.index_countButton__R0q92');
        for (let button of buttons) {
            if (!button.classList.contains('index_disableBtn__v3vb5') && button.textContent.trim() === '+') {
                button.click();
                return true;
            }
        }
        return false;
    }

    // 调整商品页面数量
    async function adjustProductPageQuantity() {
        if (!isQuantityEnabled) {
            return { success: true, message: '自定义数量功能未启用' };
        }

        const currentQuantity = getProductPageQuantity();
        console.log(`商品页面当前数量: ${currentQuantity}, 目标数量: ${targetQuantity}`);

        if (currentQuantity === targetQuantity) {
            return { success: true, message: '数量已达标' };
        }

        if (currentQuantity < targetQuantity) {
            // 需要增加数量
            const needed = targetQuantity - currentQuantity;
            for (let i = 0; i < needed; i++) {
                if (!isRunning) return { success: false, message: '用户已停止' };
                clickProductPageIncreaseButton();
                await new Promise(resolve => setTimeout(resolve, CONFIG.QUANTITY_ADJUSTMENT_DELAY));
            }
        }

        return { success: true, message: '商品页面数量调整完成' };
    }

    // 点击加购按钮
    function clickAddToCartButton() {
        console.log('开始查找加购按钮...');
        
        // 首先尝试精确选择器
        const addToCartButton = document.querySelector('.index_usBtn__UUQYB.index_red__a9rce.index_btnFull__QK9IW');
        console.log('精确选择器结果:', addToCartButton);
        
        if (addToCartButton) {
            console.log('按钮文本:', addToCartButton.textContent);
            console.log('按钮HTML:', addToCartButton.innerHTML);
            
            if (addToCartButton.textContent.includes('加購') || addToCartButton.innerHTML.includes('加購')) {
                console.log('✓ 找到加购按钮，准备点击');
                addToCartButton.click();
                console.log('✓ 已点击加购按钮');
                return true;
            }
        }
        
        // 如果精确选择器没找到，尝试宽泛选择器
        console.log('尝试宽泛选择器...');
        const allRedButtons = document.querySelectorAll('.index_usBtn__UUQYB.index_red__a9rce');
        console.log('找到的红色按钮数量:', allRedButtons.length);
        
        for (let button of allRedButtons) {
            console.log('检查按钮:', button.textContent);
            if (button.textContent.includes('加購') || button.innerHTML.includes('加購')) {
                console.log('✓ 找到加购按钮（宽泛选择器），准备点击');
                button.click();
                console.log('✓ 已点击加购按钮');
                return true;
            }
        }
        
        console.error('✗ 未找到加购按钮');
        return false;
    }

    // 检查加购是否成功
    async function checkAddToCartSuccess() {
        try {
            await waitForElement('.adm-popup-body.index_addPupup__V6qOY', CONFIG.ELEMENT_WAIT_TIMEOUT);
            console.log('加购成功，弹窗已出现');
            return true;
        } catch (error) {
            console.log('加购失败或弹窗未出现');
            return false;
        }
    }

    // 点击查看购物车按钮
    function clickViewCartButton() {
        const viewCartButton = document.querySelector('.index_noticeFooterBtn__QXfNs:last-child');
        if (viewCartButton && viewCartButton.textContent.includes('查看')) {
            viewCartButton.click();
            return true;
        }
        return false;
    }

    // 在商品页面切换店铺
    async function switchStoreOnProductPage(storeIndex) {
        try {
            // 点击店铺信息打开弹窗
            const storeInfo = document.querySelector('.index_storeInfo__G9rTP');
            if (storeInfo) {
                storeInfo.click();
                await waitForElement('.index_storeListPop__fUlMQ', CONFIG.ELEMENT_WAIT_TIMEOUT);
                
                // 选择指定店铺
                const storeItems = document.querySelectorAll('.index_storeListItem__IF8Cz');
                if (storeItems[storeIndex]) {
                    storeItems[storeIndex].click();
                    await waitForElementDisappear('.index_storeListPop__fUlMQ', CONFIG.ELEMENT_WAIT_TIMEOUT);
                    return true;
                }
            }
        } catch (error) {
            console.error('商品页面切换店铺出错:', error);
        }
        return false;
    }

    // ==================== 统一的功能函数 ====================
    
    // 统一的店铺选择函数
    async function selectStore(mode, storeIndex) {
        if (mode === 'product_page') {
            return await switchStoreOnProductPage(storeIndex);
        } else {
            return await selectStoreByIndex(storeIndex);
        }
    }

    // 统一的页面加载等待函数
    async function waitForPageLoad(mode) {
        if (mode === 'product_page') {
            // 商品页面模式：不需要等待，API会自动被拦截
            console.log('商品页面模式：等待API拦截...');
            // 短暂延迟确保API请求已发出
            await new Promise(resolve => setTimeout(resolve, 100));
            return true;
        } else {
            // 购物车模式：等待购物车页面加载
            await waitForCartPageLoad();
            return true;
        }
    }

    // 统一的库存检查函数
    async function checkStock(mode) {
        if (mode === 'product_page') {
            // 商品页面模式：检查商品页面库存
            const stockStatus = await getProductPageStockStatus();
            return {
                available: stockStatus.status === 'in_stock',
                reason: stockStatus.status,
                status: stockStatus
            };
        } else {
            // 购物车模式：API优先检测
            console.log('[购物车库存检测] 开始检测库存');
            
            // 第一层：等待并获取购物车API响应（已包含解析好的库存信息）
            let apiResponse;
            try {
                console.log('[API检测] 等待购物车API响应...');
                apiResponse = await waitForCartApiResponse(3000);
                console.log(`[API检测] ✓ 收到API响应: ${apiResponse.reason}`);
            } catch (error) {
                console.log(`[API检测] ⚠️ API响应超时: ${error.message}`);
                // API超时，回退到DOM检测
                console.log('[DOM检测] API超时，回退到DOM检测方式');
                const hasSelectAll = await checkSelectAllButton();
                if (!hasSelectAll) {
                    return { available: false, reason: 'API超时且全选按钮不存在', status: null };
                }
                const priceCheck = isProductInStock();
                return {
                    available: priceCheck,
                    reason: priceCheck ? '有货（DOM检测）' : '无货（DOM检测，总价为0）',
                    status: null
                };
            }
            
            // 直接使用API拦截器解析好的结果
            if (!apiResponse.hasStock) {
                // API显示无货，立即返回
                return {
                    available: false,
                    reason: apiResponse.reason,
                    status: null
                };
            }
            
            // API显示有货，继续检测页面状态
            console.log('[API检测] ✓ API确认有货，继续检测页面状态');
            
            // 第二层：确保全选按钮已选中（通过价格判断）
            const selectAllResult = await ensureSelectAllByPrice();
            
            if (!selectAllResult.success) {
                console.log(`[全选检测] ✗ 全选失败: ${selectAllResult.reason}`);
                return {
                    available: false,
                    reason: `API有货但${selectAllResult.reason}`,
                    status: null
                };
            }
            
            console.log(`[全选检测] ✓ 全选成功（价格:¥${selectAllResult.price}）`);
            
            // 两层检测都通过
            return {
                available: true,
                reason: `有货（库存:${apiResponse.stock}，价格:¥${selectAllResult.price}）`,
                status: null
            };
        }
    }

    // 商品页面模式特有的中间步骤
    async function executeProductPageMiddleSteps() {
        console.log('执行商品页面中间步骤...');
        
        // 0. 等待加购按钮加载（使用完整选择器）
        console.log('等待加购按钮加载...');
        try {
            await waitForElement('.index_usBtn__UUQYB.index_red__a9rce.index_btnFull__QK9IW', CONFIG.ELEMENT_WAIT_TIMEOUT);
            console.log('✓ 加购按钮已加载');
        } catch (error) {
            console.warn('完整选择器未找到，尝试宽泛选择器...');
            try {
                await waitForElement('.index_usBtn__UUQYB.index_red__a9rce', CONFIG.ELEMENT_WAIT_TIMEOUT);
                console.log('✓ 加购按钮已加载（宽泛选择器）');
            } catch (error2) {
                console.error('✗ 加购按钮未加载');
                return { success: false, message: '加购按钮未加载' };
            }
        }
        
        // 额外等待确保按钮可点击
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 1. 点击加购按钮
        console.log('准备点击加购按钮...');
        if (!clickAddToCartButton()) {
            return { success: false, message: '无法点击加购按钮' };
        }
        
        // 2. 等待加购成功弹窗
        const addToCartSuccess = await checkAddToCartSuccess();
        if (!addToCartSuccess) {
            return { success: false, message: '加购失败' };
        }
        
        // 3. 点击查看购物车按钮
        if (!clickViewCartButton()) {
            return { success: false, message: '无法点击查看购物车按钮' };
        }
        
        // 4. 等待加购成功弹窗消失
        console.log('等待加购成功弹窗消失...');
        await waitForElementDisappear('.adm-popup-body.index_addPupup__V6qOY', CONFIG.ELEMENT_WAIT_TIMEOUT);
        
        return { success: true, message: '商品页面中间步骤完成' };
    }

    // 统一的支付流程（固定2次点击优化版）
    async function executeCheckoutProcess() {
        // 0. 支付前最后一次库存检查（双层检测）
        const hasSelectAll = await checkSelectAllButton();
        if (!hasSelectAll) {
            return { success: false, message: '库存检测失败' };
        }
        
        if (!isProductInStock()) {
            return { success: false, message: '库存检测失败' };
        }
        
        // 1. 点击确认并支付按钮
        clickCheckoutButton();

        // 2. 等待支付页面加载完成
        await waitForPaymentPageLoad();

        // 3. 等待额外时间确保页面稳定
        await new Promise(resolve => setTimeout(resolve, CONFIG.PAYMENT_PAGE_EXTRA_WAIT));

        // 4. 固定2次点击流程（优化后）
        console.log('开始支付流程（2次点击，间隔1秒）');
        
        try {
            // ========== 第1次点击 ==========
            console.log('→ 第1次点击');
            const payButton1 = document.querySelector('.index_placeOrderBtn__XDm4m');
            if (!payButton1) {
                console.log('✗ 支付按钮未找到');
                return { success: false, message: '支付按钮未找到' };
            }
            payButton1.click();
            
            // 立即检测确认弹窗（0ms延迟）
            const confirmPopup1 = document.querySelector('.adm-center-popup-body.index_pickUpStoreConfirm__nv0Mn');
            if (confirmPopup1) {
                console.log('检测到确认弹窗，开始处理...');
                const checkbox = confirmPopup1.querySelector('.index_unNoticeCheckbox__lebkx label');
                if (checkbox) {
                    checkbox.click();
                    console.log('✓ 已点击"无提示"');
                }
                const confirmBtn = confirmPopup1.querySelector('.index_pickUpStoreBtn__cf1_Z');
                if (confirmBtn) {
                    confirmBtn.click();
                    console.log('✓ 已点击"确认"');
                }
                try {
                    await waitForElementDisappear('.adm-center-popup-body.index_pickUpStoreConfirm__nv0Mn', 500);
                    console.log('✓ 确认弹窗已消失');
                } catch (e) {
                    console.log('⚠ 确认弹窗消失超时，继续流程');
                }
            }
            
            // 检测错误弹窗（3秒超时）
            try {
                const toast1 = await waitForElement('.adm-toast-main', 3000);
                if (toast1) {
                    const errorText = toast1.textContent || '未知错误';
                    console.log(`检测到错误: ${errorText}`);
                    // 删除弹窗
                    if (toast1.parentElement) {
                        toast1.parentElement.remove();
                    } else {
                        toast1.remove();
                    }
                }
            } catch (e) {
                // 没有错误弹窗，正常继续
            }
            
            // 检查按钮是否消失（成功）
            if (!document.querySelector('.index_placeOrderBtn__XDm4m')) {
                console.log('✓ 下单成功! 按钮已消失');
                return { success: true, message: '下单成功' };
            }
            
            // 等待1秒后第2次点击
            console.log('等待1000ms...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // ========== 第2次点击 ==========
            console.log('→ 第2次点击');
            const payButton2 = document.querySelector('.index_placeOrderBtn__XDm4m');
            if (!payButton2) {
                console.log('✓ 下单成功! 按钮已消失');
                return { success: true, message: '下单成功' };
            }
            payButton2.click();
            
            // 立即检测确认弹窗（0ms延迟）
            const confirmPopup2 = document.querySelector('.adm-center-popup-body.index_pickUpStoreConfirm__nv0Mn');
            if (confirmPopup2) {
                console.log('检测到确认弹窗，开始处理...');
                const checkbox = confirmPopup2.querySelector('.index_unNoticeCheckbox__lebkx label');
                if (checkbox) {
                    checkbox.click();
                    console.log('✓ 已点击"无提示"');
                }
                const confirmBtn = confirmPopup2.querySelector('.index_pickUpStoreBtn__cf1_Z');
                if (confirmBtn) {
                    confirmBtn.click();
                    console.log('✓ 已点击"确认"');
                }
                try {
                    await waitForElementDisappear('.adm-center-popup-body.index_pickUpStoreConfirm__nv0Mn', 500);
                    console.log('✓ 确认弹窗已消失');
                } catch (e) {
                    console.log('⚠ 确认弹窗消失超时，继续流程');
                }
            }
            
            // 检测错误弹窗（3秒超时）
            try {
                const toast2 = await waitForElement('.adm-toast-main', 3000);
                if (toast2) {
                    const errorText = toast2.textContent || '未知错误';
                    console.log(`检测到错误: ${errorText}`);
                    // 删除弹窗
                    if (toast2.parentElement) {
                        toast2.parentElement.remove();
                    } else {
                        toast2.remove();
                    }
                }
            } catch (e) {
                // 没有错误弹窗，正常继续
            }
            
            // 最终检查按钮是否消失
            if (!document.querySelector('.index_placeOrderBtn__XDm4m')) {
                console.log('✓ 下单成功! 按钮已消失');
                return { success: true, message: '下单成功' };
            } else {
                console.log('支付流程结束');
                return { success: false, message: '支付流程结束，结果待确认' };
            }
            
        } catch (error) {
            console.error('支付流程异常:', error);
            return { success: false, message: `支付异常: ${error.message}` };
        }
    }

    // 统一的错误处理和店铺切换
    function handleErrorAndSwitchStore(error, storeName) {
        console.error(`处理门店 ${storeName} 时出错:`, error);
        // 移动到下一个门店
        currentStoreIndex = (currentStoreIndex + 1) % selectedStores.length;
    }

    // 获取库存状态消息
    function getStockStatusMessage(stockResult) {
        if (stockResult.status) {
            switch (stockResult.status.status) {
                case 'in_stock': return '有货';
                case 'out_of_stock': return '无货';
                case 'subscribed': return '已订阅';
                case 'no_sales': return '此门店无销售';
                default: return '状态未知';
            }
        }
        return stockResult.reason;
    }

    // ==================== UI界面函数 ====================
    // 创建门店选择器界面
    function createStoreSelector() {
        // 移除已存在的选择器
        if (storeSelector) {
            storeSelector.remove();
        }

        storeSelector = document.createElement('div');
        storeSelector.id = 'store-selector-panel';
        storeSelector.innerHTML = `
            <div class="selector-header">
                <h3><span id="drag-handle">到店取助手</span></h3>
                <div class="controls">
                    <button id="toggle-collapse" class="collapse-button">-</button>
                    <button id="toggle-run" class="run-button">运行</button>
                </div>
            </div>
            <div class="selector-content">
                <div class="store-section">
                    <div class="store-header">
                        <label class="select-all-label">
                            <input type="checkbox" id="select-all-toggle">
                            <span id="select-count-text">0/0</span>
                        </label>
                        <button id="sync-store-list-btn" class="sync-btn-compact">同步</button>
                    </div>
                    <div class="store-list-container">
                        <div class="store-list" id="store-list">
                            <div class="empty-message">请先同步店铺列表</div>
                        </div>
                    </div>
                </div>
                <div class="schedule-section collapsible-section">
                    <div class="section-header">
                        <label>
                            <input type="checkbox" id="schedule-toggle">
                            <span>定时运行</span>
                        </label>
                        <button class="collapse-toggle" data-section="schedule">-</button>
                    </div>
                    <div class="section-content" id="schedule-content">
                        <div class="schedule-controls">
                            <input type="number" id="schedule-hour" min="0" max="23" placeholder="时">
                            <span>:</span>
                            <input type="number" id="schedule-minute" min="0" max="59" placeholder="分">
                            <span>:</span>
                            <input type="number" id="schedule-second" min="0" max="59" placeholder="秒">
                            <span>.</span>
                            <input type="number" id="schedule-millisecond" min="0" max="999" placeholder="毫秒">
                            <button id="schedule-save">保存</button>
                        </div>
                        <div class="schedule-info">
                            <div>当前时间: <span id="current-time">--:--:--.---</span></div>
                            <div>定时时间: <span id="scheduled-time">--:--:--.---</span></div>
                        </div>
                    </div>
                </div>
                <div class="quantity-section collapsible-section">
                    <div class="section-header">
                        <label>
                            <input type="checkbox" id="quantity-toggle">
                            <span>自定义数量</span>
                        </label>
                        <button class="collapse-toggle" data-section="quantity">-</button>
                    </div>
                    <div class="section-content" id="quantity-content">
                        <div class="quantity-controls">
                            <label>目标数量:</label>
                            <input type="number" id="target-quantity" min="1" placeholder="固定数量" value="1">
                            <button id="quantity-save">保存</button>
                        </div>
                        <div class="quantity-info">
                            <div>目标数量: <span id="target-quantity-display">1</span></div>
                            <div>当前数量: <span id="current-quantity-display">-</span></div>
                            <div>状态: <span id="quantity-status">未启用</span></div>
                        </div>
                    </div>
                </div>
                <div class="product-page-mode-section collapsible-section">
                    <div class="section-header">
                        <label>
                            <input type="checkbox" id="product-page-toggle">
                            <span>商品页面刷库存</span>
                        </label>
                        <button class="collapse-toggle" data-section="product-page">-</button>
                    </div>
                    <div class="section-content" id="product-page-content">
                        <div class="product-page-info">
                            <div>模式: <span id="mode-status">购物车模式</span></div>
                            <div>检测: <span id="stock-detection-status">-</span></div>
                        </div>
                    </div>
                </div>
                <div class="status-info">
                    <div>状态: <span id="status-text">已停止</span></div>
                    <div>当前: <span id="current-store">-</span></div>
                </div>
            </div>
        `;

        // 设置初始位置（默认在右上角）
        const position = GM_getValue('popmart_mobile_panelPosition', { top: 20, right: 20 });
        storeSelector.style.top = position.top + 'px';
        storeSelector.style.right = position.right + 'px';

        document.body.appendChild(storeSelector);

        // 绑定拖动事件（仅在"门店选择器"文字上）
        const dragHandle = storeSelector.querySelector('#drag-handle');
        dragHandle.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);

        // 绑定折叠事件
        document.getElementById('toggle-collapse').addEventListener('click', toggleCollapse);

        // 绑定其他事件
        document.getElementById('toggle-run').addEventListener('click', toggleRunning);
        
        // 绑定全选和同步事件
        const selectAllToggle = document.getElementById('select-all-toggle');
        if (selectAllToggle) {
            selectAllToggle.addEventListener('change', toggleSelectAll);
        }
        
        const syncStoreListBtn = document.getElementById('sync-store-list-btn');
        if (syncStoreListBtn) {
            syncStoreListBtn.addEventListener('click', syncStoreList);
        }
        
        // 绑定定时运行事件
        document.getElementById('schedule-toggle').addEventListener('change', toggleSchedule);
        document.getElementById('schedule-save').addEventListener('click', saveSchedule);
        
        // 绑定自定义数量事件
        document.getElementById('quantity-toggle').addEventListener('change', toggleQuantity);
        document.getElementById('quantity-save').addEventListener('click', saveQuantity);
        
        // 绑定商品页面模式事件
        document.getElementById('product-page-toggle').addEventListener('change', toggleProductPageMode);
        
        // 绑定折叠事件
        document.querySelectorAll('.collapse-toggle').forEach(button => {
            button.addEventListener('click', toggleSectionCollapse);
        });

        // 填充门店列表
        updateStoreList();
        updateRunButtonState();
        updateScheduleUI();
        updateQuantityUI();
        updateProductPageModeUI();

        // 开始更新时间显示
        updateTimeDisplay();
        setInterval(updateTimeDisplay, 100);
        
        // 开始更新数量显示
        updateQuantityDisplay();
        setInterval(updateQuantityDisplay, 1000);

        return storeSelector;
    }

    // 更新时间显示
    function updateTimeDisplay() {
        const now = new Date();
        const beijingTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
        const timeString = beijingTime.toTimeString().substring(0, 8) + '.' + String(beijingTime.getMilliseconds()).padStart(3, '0');
        
        const currentTimeElement = document.getElementById('current-time');
        if (currentTimeElement) {
            currentTimeElement.textContent = timeString;
        }
        
        const scheduledTimeElement = document.getElementById('scheduled-time');
        if (scheduledTimeElement) {
            scheduledTimeElement.textContent = 
                `${String(scheduledTime.hour).padStart(2, '0')}:${String(scheduledTime.minute).padStart(2, '0')}:${String(scheduledTime.second).padStart(2, '0')}.${String(scheduledTime.millisecond).padStart(3, '0')}`;
        }
    }

    // 更新运行按钮状态
    function updateRunButtonState() {
        if (!storeSelector) return;

        const button = document.getElementById('toggle-run');
        const statusText = document.getElementById('status-text');

        if (isRunning) {
            button.textContent = '停止';
            button.className = 'stop-button';
            statusText.textContent = '运行中';
        } else {
            button.textContent = '运行';
            button.className = 'run-button';
            statusText.textContent = '已停止';
        }
    }

    // 更新定时运行UI
    function updateScheduleUI() {
        if (!storeSelector) return;

        const scheduleToggle = document.getElementById('schedule-toggle');
        const hourInput = document.getElementById('schedule-hour');
        const minuteInput = document.getElementById('schedule-minute');
        const secondInput = document.getElementById('schedule-second');
        const millisecondInput = document.getElementById('schedule-millisecond');

        if (scheduleToggle) scheduleToggle.checked = isScheduledEnabled;
        if (hourInput) hourInput.value = scheduledTime.hour;
        if (minuteInput) minuteInput.value = scheduledTime.minute;
        if (secondInput) secondInput.value = scheduledTime.second;
        if (millisecondInput) millisecondInput.value = scheduledTime.millisecond;
    }

    // 更新自定义数量UI
    function updateQuantityUI() {
        if (!storeSelector) return;

        const quantityToggle = document.getElementById('quantity-toggle');
        const targetQuantityInput = document.getElementById('target-quantity');
        const targetQuantityDisplay = document.getElementById('target-quantity-display');
        const quantityStatus = document.getElementById('quantity-status');

        if (quantityToggle) quantityToggle.checked = isQuantityEnabled;
        if (targetQuantityInput) targetQuantityInput.value = targetQuantity;
        if (targetQuantityDisplay) targetQuantityDisplay.textContent = targetQuantity;
        if (quantityStatus) quantityStatus.textContent = isQuantityEnabled ? '已启用' : '未启用';
    }

    // 更新商品页面模式UI
    function updateProductPageModeUI() {
        if (!storeSelector) return;

        const productPageToggle = document.getElementById('product-page-toggle');
        const modeStatus = document.getElementById('mode-status');

        if (productPageToggle) productPageToggle.checked = isProductPageModeEnabled;
        if (modeStatus) modeStatus.textContent = isProductPageModeEnabled ? '商品页面模式' : '购物车模式';
    }

    // 更新数量显示
    function updateQuantityDisplay() {
        if (!storeSelector) return;

        const currentQuantityDisplay = document.getElementById('current-quantity-display');
        if (currentQuantityDisplay) {
            const currentQuantity = getCurrentQuantity();
            currentQuantityDisplay.textContent = currentQuantity;
        }
    }

    // 开启/关闭自定义数量
    function toggleQuantity() {
        const quantityToggle = document.getElementById('quantity-toggle');
        isQuantityEnabled = quantityToggle.checked;
        
        const settings = {
            enabled: isQuantityEnabled,
            targetQuantity: targetQuantity
        };
        
        saveUserQuantitySettings(settings);
        updateQuantityUI();
        
        console.log('自定义数量功能:', isQuantityEnabled ? '已开启' : '已关闭');
    }

    // 保存数量设置
    function saveQuantity() {
        const targetQuantityInput = document.getElementById('target-quantity');
        const quantity = parseInt(targetQuantityInput.value) || 1;
        
        if (quantity < 1) {
            alert('请输入有效的数量（大于0）');
            return;
        }
        
        targetQuantity = quantity;
        
        const settings = {
            enabled: isQuantityEnabled,
            targetQuantity: targetQuantity
        };
        
        saveUserQuantitySettings(settings);
        updateQuantityUI();
        console.log('数量设置已保存:', targetQuantity);
    }

    // 开启/关闭商品页面模式
    function toggleProductPageMode() {
        const productPageToggle = document.getElementById('product-page-toggle');
        isProductPageModeEnabled = productPageToggle.checked;
        
        const settings = {
            enabled: isProductPageModeEnabled
        };
        
        saveUserProductPageModeSettings(settings);
        updateProductPageModeUI();
        
        console.log('商品页面刷库存模式:', isProductPageModeEnabled ? '已开启' : '已关闭');
    }

    // 折叠/展开功能模块
    function toggleSectionCollapse(event) {
        const button = event.target;
        const sectionName = button.getAttribute('data-section');
        const content = document.getElementById(`${sectionName}-content`);
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            button.textContent = '-';
        } else {
            content.style.display = 'none';
            button.textContent = '+';
        }
    }

    // 开始拖动
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        const rect = storeSelector.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        dragOffset.x = touch.clientX - rect.left;
        dragOffset.y = touch.clientY - rect.top;
        storeSelector.style.cursor = 'grabbing';
    }

    // 拖动中
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX - dragOffset.x;
        const y = touch.clientY - dragOffset.y;

        // 限制在视窗范围内
        const maxX = window.innerWidth - storeSelector.offsetWidth;
        const maxY = window.innerHeight - storeSelector.offsetHeight;

        storeSelector.style.left = Math.max(0, Math.min(maxX, x)) + 'px';
        storeSelector.style.top = Math.max(0, Math.min(maxY, y)) + 'px';

        // 清除right样式以避免冲突
        storeSelector.style.right = 'auto';
    }

    // 停止拖动
    function stopDrag() {
        if (isDragging) {
            isDragging = false;
            storeSelector.style.cursor = 'default';

            // 保存位置
            const rect = storeSelector.getBoundingClientRect();
            GM_setValue('popmart_mobile_panelPosition', {
                top: rect.top,
                right: window.innerWidth - rect.right
            });
        }
    }


    // 折叠/展开面板
    function toggleCollapse() {
        isCollapsed = !isCollapsed;
        const content = storeSelector.querySelector('.selector-content');
        const button = document.getElementById('toggle-collapse');

        if (isCollapsed) {
            content.style.display = 'none';
            button.textContent = '+';
            storeSelector.classList.add('collapsed');
        } else {
            content.style.display = 'block';
            button.textContent = '-';
            storeSelector.classList.remove('collapsed');
        }
    }

    // 更新门店列表
    function updateStoreList() {
        const storeListContainer = document.getElementById('store-list');
        if (!storeListContainer) return;

        if (ALL_STORES.length === 0) {
            storeListContainer.innerHTML = '<div class="empty-message">请先同步店铺列表</div>';
            updateSelectStatusText();
            return;
        }

        const previouslySelected = getUserSelectedStores();

        storeListContainer.innerHTML = ALL_STORES.map((storeName, index) => `
            <label class="store-item">
                <input type="checkbox" value="${index}" ${previouslySelected.includes(index) ? 'checked' : ''}>
                <span class="store-name">${storeName}</span>
            </label>
        `).join('');

        // 绑定复选框事件
        bindStoreCheckboxEvents();

        // 更新全局selectedStores数组
        if (previouslySelected.length > 0) {
            selectedStores = [...previouslySelected];
        }
        
        updateSelectStatusText();
    }

    // 绑定店铺复选框事件
    function bindStoreCheckboxEvents() {
        const storeList = document.getElementById('store-list');
        if (storeList) {
            storeList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', handleStoreSelectionChange);
            });
        }
    }

    // 处理门店选择变更
    function handleStoreSelectionChange() {
        const checkboxes = document.querySelectorAll('#store-list input[type="checkbox"]:checked');
        const selectedIndices = Array.from(checkboxes).map(cb => parseInt(cb.value));
        saveUserSelectedStores(selectedIndices);
        updateSelectStatusText();
    }

    // 全选/取消全选
    function toggleSelectAll() {
        const selectAllToggle = document.getElementById('select-all-toggle');
        const isChecked = selectAllToggle ? selectAllToggle.checked : false;
        
        const checkboxes = document.querySelectorAll('#store-list input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = isChecked;
        });

        const newSelection = isChecked ? ALL_STORES.map((_, i) => i) : [];
        saveUserSelectedStores(newSelection);
        updateSelectStatusText();
    }

    // 更新选择状态文本
    function updateSelectStatusText() {
        const selectedCount = getUserSelectedStores().length;
        const totalCount = ALL_STORES.length;
        const countText = document.getElementById('select-count-text');
        const selectAllToggle = document.getElementById('select-all-toggle');
        
        if (countText) {
            countText.textContent = `${selectedCount}/${totalCount}`;
        }
        
        if (selectAllToggle) {
            selectAllToggle.checked = selectedCount === totalCount && totalCount > 0;
        }
    }

    // 同步店铺列表
    async function syncStoreList() {
        try {
            console.log('开始同步店铺列表...');
            
            let modal = document.querySelector('.index_storeListPop__fUlMQ');
            if (!modal) {
                const storeInfo = document.querySelector('.index_storeInfo__G9rTP');
                if (!storeInfo) {
                    alert('无法自动打开弹窗\n请手动打开店铺选择弹窗后再点击"同步"');
                    return;
                }
                storeInfo.click();
                await waitForElement('.index_storeListPop__fUlMQ', 5000);
                modal = document.querySelector('.index_storeListPop__fUlMQ');
            }
            
            const storeElements = modal.querySelectorAll('.index_name__BHfG4');
            if (storeElements.length === 0) {
                throw new Error('未找到店铺列表');
            }
            
            const storeList = [];
            storeElements.forEach(el => {
                const originalName = el.textContent.trim();
                const normalizedName = normalizeStoreName(originalName);
                storeList.push(normalizedName);
            });
            
            GM_setValue('popmart_mobile_storeList', storeList);
            ALL_STORES = storeList;
            
            // 关闭弹窗
            console.log('尝试关闭店铺选择弹窗...');
            
            // 方法1: 查找关闭图标按钮
            let closeBtn = document.querySelector('.adm-popup-close-icon.adm-plain-anchor');
            if (!closeBtn) {
                // 方法2: 只通过类名查找
                closeBtn = document.querySelector('.adm-popup-close-icon');
            }
            if (!closeBtn) {
                // 方法3: 通过aria-label查找
                closeBtn = document.querySelector('[aria-label="关闭"]');
            }
            
            if (closeBtn) {
                console.log('✓ 找到关闭按钮，点击关闭');
                closeBtn.click();
                // 等待弹窗关闭动画完成
                await new Promise(resolve => setTimeout(resolve, 300));
            } else {
                console.warn('⚠ 未找到关闭按钮，尝试点击遮罩层');
                // 点击遮罩层关闭
                const mask = document.querySelector('.adm-mask');
                if (mask) {
                    console.log('✓ 找到遮罩层，点击关闭');
                    mask.click();
                    await new Promise(resolve => setTimeout(resolve, 300));
                } else {
                    console.warn('⚠ 未找到遮罩层，弹窗可能需要手动关闭');
                }
            }
            
            updateStoreList();
            console.log(`✅ 同步成功! 共${storeList.length}家店铺`);
            alert(`同步成功!\n共${storeList.length}家店铺`);
        } catch (error) {
            console.error('同步店铺列表失败:', error);
            alert(`同步失败: ${error.message}`);
        }
    }

    // 开启/关闭定时运行
    function toggleSchedule() {
        const scheduleToggle = document.getElementById('schedule-toggle');
        isScheduledEnabled = scheduleToggle.checked;
        
        const settings = {
            enabled: isScheduledEnabled,
            hour: scheduledTime.hour,
            minute: scheduledTime.minute,
            second: scheduledTime.second,
            millisecond: scheduledTime.millisecond
        };
        
        saveUserScheduleSettings(settings);
        
        if (isScheduledEnabled) {
            startScheduleChecker();
            console.log('定时运行已开启');
        } else {
            stopScheduleChecker();
            console.log('定时运行已关闭');
        }
    }

    // 保存定时设置
    function saveSchedule() {
        const hourInput = document.getElementById('schedule-hour');
        const minuteInput = document.getElementById('schedule-minute');
        const secondInput = document.getElementById('schedule-second');
        const millisecondInput = document.getElementById('schedule-millisecond');
        
        const hour = parseInt(hourInput.value) || 0;
        const minute = parseInt(minuteInput.value) || 0;
        const second = parseInt(secondInput.value) || 0;
        const millisecond = parseInt(millisecondInput.value) || 0;
        
        // 验证输入范围
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59 || millisecond < 0 || millisecond > 999) {
            alert('请输入有效的时间范围：\n小时(0-23) 分钟(0-59) 秒(0-59) 毫秒(0-999)');
            return;
        }
        
        scheduledTime = { hour, minute, second, millisecond };
        
        const settings = {
            enabled: isScheduledEnabled,
            hour: scheduledTime.hour,
            minute: scheduledTime.minute,
            second: scheduledTime.second,
            millisecond: scheduledTime.millisecond
        };
        
        saveUserScheduleSettings(settings);
        console.log('定时设置已保存');
    }

    // 开始定时检查
    function startScheduleChecker() {
        if (scheduleInterval) {
            clearInterval(scheduleInterval);
        }
        
        scheduleInterval = setInterval(() => {
            if (!isScheduledEnabled) return;
            
            const now = new Date();
            const beijingTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000));
            const currentHour = beijingTime.getHours();
            const currentMinute = beijingTime.getMinutes();
            const currentSecond = beijingTime.getSeconds();
            const currentMillisecond = beijingTime.getMilliseconds();
            
            if (currentHour === scheduledTime.hour && 
                currentMinute === scheduledTime.minute && 
                currentSecond === scheduledTime.second &&
                currentMillisecond >= scheduledTime.millisecond &&
                !isRunning) {
                // 触发自动运行
                triggerScheduledRun();
            }
        }, 100); // 每100毫秒检查一次，确保能捕捉到设定的毫秒时间
    }

    // 停止定时检查
    function stopScheduleChecker() {
        if (scheduleInterval) {
            clearInterval(scheduleInterval);
            scheduleInterval = null;
        }
    }

    // 触发定时运行
    async function triggerScheduledRun() {
        if (isRunning) return;
        
        console.log('定时时间到达，开始自动运行');
        
        // 先检查是否在到店取页面，不是则先切换
        await switchToPickupTab();

        isRunning = true;
        isFirstRunAfterClick = true; // 标记为点击运行后的第一次操作
        saveUserRunningState(true);
        updateRunButtonState();
        
        // 如果有选中的门店，开始主循环
        if (selectedStores.length > 0) {
            // 根据当前页面显示的店铺设置起始索引
            setStartingStoreIndex();
            // 开始主循环
            runMainLoop();
        }
    }

    // ==================== 核心逻辑函数 ====================
    // 开始/停止运行
    async function toggleRunning() {
        // 检查当前状态
        if (isRunning) {
            // 当前正在运行，需要停止
            isRunning = false;
            isExecuting = false; // 立即清除执行标志，强制停止
            saveUserRunningState(false);
            updateRunButtonState();
            console.log('脚本已强制停止');
        } else {
            // 当前已停止，需要运行
            // 先检查是否在到店取页面，不是则先切换
            await switchToPickupTab();

            isRunning = true;
            isFirstRunAfterClick = true; // 标记为点击运行后的第一次操作
            saveUserRunningState(true);
            updateRunButtonState();
            console.log('脚本开始运行');

            // 如果有选中的门店，开始主循环
            if (selectedStores.length > 0) {
                // 根据当前页面显示的店铺设置起始索引
                setStartingStoreIndex();
                // 开始主循环
                runMainLoop();
            } else {
                console.log('未选择任何门店');
                alert('请至少选择一个门店');
                isRunning = false;
                saveUserRunningState(false);
                updateRunButtonState();
            }
        }
    }

    // 点击门店选择按钮打开弹窗
    async function openStoreSelection() {
        const storeInfo = document.querySelector('.index_storeInfo__G9rTP');
        if (storeInfo) {
            storeInfo.click();
            // 等待弹窗出现
            await waitForElement('.index_storeListPop__fUlMQ', CONFIG.ELEMENT_WAIT_TIMEOUT);
            return true;
        }
        return false;
    }

    // 选择指定索引的门店
    async function selectStoreByIndex(index) {
        try {
            // 确保弹窗已打开
            await openStoreSelection();

            const storeItems = document.querySelectorAll('.index_storeListItem__IF8Cz');
            if (storeItems[index]) {
                storeItems[index].click();
                // 等待弹窗关闭
                await waitForElementDisappear('.index_storeListPop__fUlMQ', CONFIG.ELEMENT_WAIT_TIMEOUT);
                return true;
            }
        } catch (error) {
            console.error('选择门店出错:', error);
        }
        return false;
    }

    // 点击确认并支付按钮
    function clickCheckoutButton() {
        const checkoutButton = document.querySelector('.index_checkoutContainer__5hRri');
        return clickElement(checkoutButton);
    }

    // 主循环函数
    async function runMainLoop() {
        // 检查是否应该继续运行
        if (!isRunning || selectedStores.length === 0) {
            isExecuting = false;
            return;
        }

        // 防止重复执行
        if (isExecuting) {
            return;
        }

        isExecuting = true;

        // 确定运行模式
        const mode = isProductPageModeEnabled ? 'product_page' : 'cart_page';
        
        // 获取当前要检查的门店索引
        const storeIndex = selectedStores[currentStoreIndex];
        const storeName = ALL_STORES[storeIndex] || '未知门店';

        // 更新状态显示
        document.getElementById('current-store').textContent = storeName;
        console.log(`正在检查门店: ${storeName} (${mode === 'product_page' ? '商品页面模式' : '购物车模式'})`);

        try {
            // 1. 选择门店前，清空旧的购物车API响应（确保时序对应）
            if (mode === 'cart_page') {
                console.log('[API缓存] 清空旧的购物车API响应');
                latestCartApiResponse = null;
            }
            
            console.log('选择门店');
            const selectResult = await selectStore(mode, storeIndex);
            if (!selectResult) {
                throw new Error('选择门店失败');
            }

            // 2. 等待页面加载
            console.log('等待页面加载');
            await waitForPageLoad(mode);

            // 3. 检查库存
            console.log('检查库存');
            const stockResult = await checkStock(mode);
            
            // 更新UI显示（商品页面模式）
            if (mode === 'product_page' && stockResult.status) {
                const stockDetectionStatus = document.getElementById('stock-detection-status');
                if (stockDetectionStatus) {
                    stockDetectionStatus.textContent = getStockStatusMessage(stockResult);
                }
            }

            if (!stockResult.available) {
                console.log(`门店 ${storeName} 无货: ${getStockStatusMessage(stockResult)}`);
                // 移动到下一个门店
                currentStoreIndex = (currentStoreIndex + 1) % selectedStores.length;
                // 再次检查运行状态
                if (isRunning) {
                    setTimeout(runMainLoop, CONFIG.LOOP_INTERVAL);
                }
                return;
            }

            // 4. 有货，执行相应流程
            console.log(`在门店 ${storeName} 找到有货商品`);

            if (mode === 'product_page') {
                // 商品页面模式：执行中间步骤
                const middleStepsResult = await executeProductPageMiddleSteps();
                if (!middleStepsResult.success) {
                    console.log(`商品页面中间步骤失败: ${middleStepsResult.message}`);
                    // 移动到下一个门店
                    currentStoreIndex = (currentStoreIndex + 1) % selectedStores.length;
                    // 再次检查运行状态
                    if (isRunning) {
                        setTimeout(runMainLoop, CONFIG.LOOP_INTERVAL);
                    }
                    return;
                }

                // 等待购物车页面加载
                await waitForCartPageLoad();
                
                // 清理库存不足通知
                clearStockInsufficientNotification();
                
                // 检查商品可用性（包括数量调整）
                const availabilityResult = await checkProductAvailability();
                if (!availabilityResult.success) {
                    console.log(`商品可用性检查失败: ${availabilityResult.message}`);
                    // 移动到下一个门店
                    currentStoreIndex = (currentStoreIndex + 1) % selectedStores.length;
                    // 再次检查运行状态
                    if (isRunning) {
                        setTimeout(runMainLoop, CONFIG.LOOP_INTERVAL);
                    }
                    return;
                }
            } else {
                // 购物车模式：检查商品可用性（包括数量调整）
                const availabilityResult = await checkProductAvailability();
                if (!availabilityResult.success) {
                    console.log(`商品可用性检查失败: ${availabilityResult.message}`);
                    // 移动到下一个门店
                    currentStoreIndex = (currentStoreIndex + 1) % selectedStores.length;
                    // 再次检查运行状态
                    if (isRunning) {
                        setTimeout(runMainLoop, CONFIG.LOOP_INTERVAL);
                    }
                    return;
                }
            }

            // 5. 执行支付流程
            console.log('开始执行支付流程');
            const checkoutResult = await executeCheckoutProcess();
            
            if (checkoutResult.success) {
                console.log('下单成功，停止脚本');
                // 停止自动运行
                isRunning = false;
                isExecuting = false;
                saveUserRunningState(false);
                updateRunButtonState();
                return;
            } else {
                console.log(`支付流程失败: ${checkoutResult.message}`);
            }

        } catch (error) {
            handleErrorAndSwitchStore(error, storeName);
        } finally {
            isExecuting = false;
        }

        // 移动到下一个门店
        currentStoreIndex = (currentStoreIndex + 1) % selectedStores.length;

        // 短暂延迟后继续循环（检查运行状态）
        if (isRunning) {
            setTimeout(runMainLoop, CONFIG.LOOP_INTERVAL);
        }
    }

    // 主流程函数
    async function init() {
        try {
            console.log('🎯 泡泡玛特自提助手(移动端) UI初始化');

            // 0. 加载店铺列表
            ALL_STORES = GM_getValue('popmart_mobile_storeList', []);

            // 1. 创建门店选择器（立即显示）
            createStoreSelector();

            // 2. 切换到"到店取"标签页
            await switchToPickupTab();

            // 3. 等待初始页面加载完成（根据当前页面类型决定）
            try {
                // 尝试等待购物车页面加载，如果失败则跳过
                await waitForCartPageLoad();
            } catch (error) {
                console.log('当前不在购物车页面，跳过购物车页面等待');
            }

            // 4. 恢复用户之前的状态
            const savedRunningState = getUserRunningState();
            isRunning = savedRunningState;
            updateRunButtonState();

            // 5. 恢复定时设置
            const savedScheduleSettings = getUserScheduleSettings();
            isScheduledEnabled = savedScheduleSettings.enabled;
            scheduledTime = {
                hour: savedScheduleSettings.hour,
                minute: savedScheduleSettings.minute,
                second: savedScheduleSettings.second,
                millisecond: savedScheduleSettings.millisecond
            };
            updateScheduleUI();

            // 6. 恢复自定义数量设置
            const savedQuantitySettings = getUserQuantitySettings();
            isQuantityEnabled = savedQuantitySettings.enabled;
            targetQuantity = savedQuantitySettings.targetQuantity;
            updateQuantityUI();

            // 7. 恢复商品页面模式设置
            const savedProductPageModeSettings = getUserProductPageModeSettings();
            isProductPageModeEnabled = savedProductPageModeSettings.enabled;
            updateProductPageModeUI();

            // 6. 如果定时功能开启，启动定时检查
            if (isScheduledEnabled) {
                startScheduleChecker();
            }

            // 7. 如果用户之前是运行状态，且有选中的门店，开始主循环
            if (isRunning && selectedStores.length > 0) {
                // 根据当前页面显示的店铺设置起始索引
                setStartingStoreIndex();
                // 开始主循环
                setTimeout(runMainLoop, CONFIG.LOOP_INTERVAL);
            }

            console.log('初始化完成，当前状态:', isRunning ? '运行中' : '已停止');
        } catch (error) {
            console.error('初始化过程中出错:', error);
        }
    }

    // ==================== 样式定义 ====================
    // 添加样式
    GM_addStyle(`
        #store-selector-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            padding: 12px;
            min-height: 40px;
        }

        #store-selector-panel.collapsed {
            height: 40px;
        }

        #store-selector-panel.collapsed .selector-header {
            margin-bottom: 0;
        }

        .selector-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        #drag-handle {
            margin: 0;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: move;
            user-select: none;
            flex-grow: 1;
        }

        .controls {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .collapse-button {
            width: 24px;
            height: 24px;
            padding: 0;
            border-radius: 4px;
            font-size: 12px;
            line-height: 1;
            background-color: #f0f0f0;
            color: #333;
            cursor: pointer;
            border: none;
        }

        .run-button {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            background-color: #52c41a;
            color: white;
        }

        .stop-button {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            background-color: #ff4d4f;
            color: white;
        }

        .selector-content {
            display: block;
        }

        .store-section {
            margin-bottom: 10px;
        }

        .store-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 4px 6px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }

        .select-all-label {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin: 0;
            font-size: 12px;
        }

        .select-all-label input {
            margin-right: 5px;
        }

        .sync-btn-compact {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            background-color: #52c41a;
            color: white;
        }

        .sync-btn-compact:hover {
            background-color: #73d13d;
        }

        .sync-btn-compact:active {
            background-color: #389e0d;
        }

        .empty-message {
            color: #999;
            text-align: center;
            padding: 20px 10px;
            font-size: 11px;
        }

        .store-list-container {
            max-height: 250px;
            overflow-y: auto;
            margin-bottom: 10px;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            padding: 6px;
        }

        .store-item {
            display: flex;
            align-items: center;
            padding: 6px 5px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
        }

        .store-item:last-child {
            border-bottom: none;
        }

        .store-item:hover {
            background-color: #f5f5f5;
        }

        .store-item input {
            margin-right: 8px;
        }

        .store-name {
            font-size: 12px;
            word-break: break-all;
        }

        .collapsible-section {
            margin-bottom: 8px;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            background-color: #f9f9f9;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            background-color: #f0f0f0;
            border-radius: 4px 4px 0 0;
        }

        .section-header label {
            display: flex;
            align-items: center;
            font-weight: bold;
            margin: 0;
            font-size: 12px;
        }

        .section-header input {
            margin-right: 5px;
        }

        .collapse-toggle {
            width: 20px;
            height: 20px;
            padding: 0;
            border: none;
            border-radius: 2px;
            background-color: #d9d9d9;
            color: #333;
            cursor: pointer;
            font-size: 12px;
            line-height: 1;
        }

        .section-content {
            padding: 6px 8px;
        }

        .schedule-section {
            margin-bottom: 8px;
        }

        .schedule-controls {
            display: flex;
            align-items: center;
            gap: 3px;
            margin-bottom: 5px;
            flex-wrap: wrap;
        }

        .schedule-controls input {
            width: 40px;
            padding: 3px;
            text-align: center;
        }

        .schedule-controls input[type="number"]#schedule-millisecond {
            width: 50px;
        }

        .schedule-controls button {
            padding: 3px 6px;
            border: none;
            border-radius: 3px;
            background-color: #1890ff;
            color: white;
            cursor: pointer;
            font-size: 12px;
        }

        .schedule-info {
            font-size: 11px;
        }

        .schedule-info div {
            margin-bottom: 2px;
        }

        .quantity-section {
            margin-bottom: 8px;
        }

        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 5px;
            flex-wrap: wrap;
        }

        .quantity-controls label {
            font-size: 11px;
            margin: 0;
        }

        .quantity-controls input {
            width: 60px;
            padding: 3px;
            text-align: center;
            font-size: 11px;
        }

        .quantity-controls button {
            padding: 3px 6px;
            border: none;
            border-radius: 3px;
            background-color: #1890ff;
            color: white;
            cursor: pointer;
            font-size: 11px;
        }

        .quantity-info {
            font-size: 11px;
        }

        .quantity-info div {
            margin-bottom: 2px;
        }

        .product-page-mode-section {
            margin-bottom: 8px;
        }

        .product-page-info {
            font-size: 11px;
        }

        .product-page-info div {
            margin-bottom: 2px;
        }

        .status-info {
            font-size: 11px;
            padding: 6px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }

        .status-info div {
            margin-bottom: 3px;
        }

        .status-info div:last-child {
            margin-bottom: 0;
        }

        @media (max-width: 768px) {
            #store-selector-panel {
                width: 200px;
                padding: 6px;
            }

            #drag-handle {
                font-size: 13px;
            }

            .store-name {
                font-size: 10px;
            }

            .status-info {
                font-size: 10px;
            }
            
            .schedule-controls input {
                width: 25px;
                font-size: 10px;
            }
            
            .schedule-controls input[type="number"]#schedule-millisecond {
                width: 35px;
            }

            .section-header {
                padding: 4px 6px;
            }

            .section-header label {
                font-size: 11px;
            }

            .section-content {
                padding: 4px 6px;
            }

            .quantity-controls input {
                width: 50px;
                font-size: 10px;
            }

            .quantity-controls button {
                font-size: 10px;
                padding: 2px 4px;
            }

            .collapse-toggle {
                width: 18px;
                height: 18px;
                font-size: 11px;
            }
        }
    `);

    // ==================== 脚本启动 ====================
    // 步骤1: 立即启动API拦截器（在页面脚本执行前）
    console.log('📡 步骤1: 启动API拦截器（document-start阶段）');
    setupApiInterceptor();
    
    // 步骤2: 等待DOM加载后启动UI
    if (document.readyState === 'loading') {
        // DOM还在加载中
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 步骤2: DOM加载完成，启动UI');
            setTimeout(init, CONFIG.PAGE_SWITCH_DELAY);
        });
    } else {
        // DOM已经加载完成（可能是晚加载的脚本）
        console.log('📄 步骤2: DOM已就绪，直接启动UI');
        setTimeout(init, CONFIG.PAGE_SWITCH_DELAY);
    }
})();