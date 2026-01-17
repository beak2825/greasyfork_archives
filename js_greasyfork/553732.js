// ==UserScript==
// @name         泡泡玛特API拦截器
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  拦截购物车相关API,修改库存和价格显示(iOS兼容)
// @author       You
// @match        https://*.popmart.com/*/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553732/%E6%B3%A1%E6%B3%A1%E7%8E%9B%E7%89%B9API%E6%8B%A6%E6%88%AA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553732/%E6%B3%A1%E6%B3%A1%E7%8E%9B%E7%89%B9API%E6%8B%A6%E6%88%AA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('🎯 泡泡玛特API拦截器已启动');

    // ==================== API拦截功能 ====================
    // 拦截fetch请求
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(...args) {
        const [url, options] = args;
        
        // 检查是否是购物车API请求
        if (url && (url.includes('/store/v1/store/cart/listByStore') || url.includes('/store/v1/store/cart/update') || url.includes('/store/v1/store/calculateOrderAmountStore'))) {
            console.log('🎯 拦截到购物车API请求:', url);
            
            return originalFetch.apply(this, args).then(response => {
                // 克隆响应以便修改
                const clonedResponse = response.clone();
                
                // 检查响应是否为JSON
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return clonedResponse.json().then(data => {
                        console.log('📥 原始购物车数据:', data);
                        
                        // 修改响应数据
                        let modifiedData;
                        if (url.includes('/store/v1/store/cart/listByStore')) {
                            modifiedData = modifyCartData(data);
                            console.log('📤 修改后购物车数据:', modifiedData);
                        } else if (url.includes('/store/v1/store/cart/update')) {
                            modifiedData = modifyUpdateData(data);
                            console.log('📤 修改后更新数据:', modifiedData);
                        } else if (url.includes('/store/v1/store/calculateOrderAmountStore')) {
                            modifiedData = modifyCalculateOrderData(data, options);
                            console.log('📤 修改后计算订单数据:', modifiedData);
                        }
                        
                        // 创建新的响应
                        return new Response(JSON.stringify(modifiedData), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    }).catch(error => {
                        console.error('❌ 解析购物车API响应失败:', error);
                        return response;
                    });
                }
                
                return response;
            });
        }
        
        // 非购物车API，直接返回原始响应
        return originalFetch.apply(this, args);
    };

    // 拦截XMLHttpRequest
    const originalXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;

    unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...args]);
    };

    unsafeWindow.XMLHttpRequest.prototype.send = function(...args) {
        if (this._url && (this._url.includes('/store/v1/store/cart/listByStore') || this._url.includes('/store/v1/store/cart/update') || this._url.includes('/store/v1/store/calculateOrderAmountStore'))) {
            console.log('🎯 拦截到购物车XHR请求:', this._url);
            
            const originalOnReadyStateChange = this.onreadystatechange;
            
            this.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const contentType = this.getResponseHeader('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const originalData = JSON.parse(this.responseText);
                            console.log('📥 原始XHR购物车数据:', originalData);
                            
                            let modifiedData;
                            if (this._url.includes('/store/v1/store/cart/listByStore')) {
                                modifiedData = modifyCartData(originalData);
                                console.log('📤 修改后XHR购物车数据:', modifiedData);
                            } else if (this._url.includes('/store/v1/store/cart/update')) {
                                modifiedData = modifyUpdateData(originalData);
                                console.log('📤 修改后XHR更新数据:', modifiedData);
                            } else if (this._url.includes('/store/v1/store/calculateOrderAmountStore')) {
                                modifiedData = modifyCalculateOrderData(originalData, args[0]);
                                console.log('📤 修改后XHR计算订单数据:', modifiedData);
                            }
                            
                            // 修改响应文本
                            Object.defineProperty(this, 'responseText', {
                                value: JSON.stringify(modifiedData),
                                writable: false
                            });
                        }
                    } catch (error) {
                        console.error('❌ 修改XHR购物车响应失败:', error);
                    }
                }
                
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
        }
        
        return originalXHRSend.apply(this, args);
    };

    // ==================== 数据修改函数 ====================
    // 修改购物车数据
    function modifyCartData(data) {
        if (!data || !data.data || !data.data.shoppingCartDataList) {
            return data;
        }
        
        // 深拷贝数据
        const modifiedData = JSON.parse(JSON.stringify(data));
        
        // 处理购物车商品列表
        const cartItems = modifiedData.data.shoppingCartDataList;
        
        console.log(`🛒 发现 ${cartItems.length} 个购物车商品`);
        
        cartItems.forEach((item, index) => {
            if (item && item.spu && item.sku) {
                const productName = item.spu.title || `商品${index + 1}`;
                
                console.log(`📦 处理商品: ${productName}`);
                
                // 功能1: 无货商品变有货
                if (item.sku.stock) {
                    // 设置充足库存
                    item.sku.stock.onlineStock = 999;
                    item.sku.stock.onlineLockStock = 0;
                    console.log(`✅ 已设置库存: 999`);
                }
                
                // 设置SPU为未售罄
                if (item.spu.isSpuSoldOut) {
                    item.spu.isSpuSoldOut = false;
                    console.log(`✅ SPU售罄状态: false`);
                }
                
                // 设置SKU为未售罄
                if (item.sku.isSkuSoldOut) {
                    item.sku.isSkuSoldOut = false;
                    console.log(`✅ SKU售罄状态: false`);
                }
                
                // 功能2: 未开售商品变开售
                // 设置开售时间为很早的时间戳（确保已开售）
                item.spu.upTime = 1;
                console.log(`✅ 开售时间: 已设置`);
                
                // 确保商品已发布
                if (!item.spu.isPublish) {
                    item.spu.isPublish = true;
                    console.log(`✅ 发布状态: true`);
                }
                
                // 确保商品可用
                if (!item.spu.isAvailable) {
                    item.spu.isAvailable = true;
                    console.log(`✅ 可用状态: true`);
                }
                
                // 确保店内可用
                if (!item.spu.isAvailableInTheStore) {
                    item.spu.isAvailableInTheStore = true;
                    console.log(`✅ 店内可用: true`);
                }
                
                console.log(`🎉 商品 "${productName}" 状态修改完成`);
            }
        });
        
        console.log('🎉 所有购物车商品状态修改完成');
        return modifiedData;
    }

    // 修改更新API响应数据
    function modifyUpdateData(data) {
        if (!data) {
            return data;
        }
        
        // 深拷贝数据
        const modifiedData = JSON.parse(JSON.stringify(data));
        
        // 确保更新操作返回成功
        if (modifiedData.data) {
            modifiedData.data.success = true;
            console.log('✅ 更新操作状态: success = true');
        }
        
        // 确保响应码为成功
        if (modifiedData.code !== 'OK') {
            modifiedData.code = 'OK';
            console.log('✅ 响应码: OK');
        }
        
        if (modifiedData.ret !== 1) {
            modifiedData.ret = 1;
            console.log('✅ 返回码: 1');
        }
        
        console.log('🎉 更新API响应修改完成');
        return modifiedData;
    }

    // 修改计算订单金额API响应数据
    function modifyCalculateOrderData(data, requestBody) {
        if (!data) {
            return data;
        }
        
        // 深拷贝数据
        const modifiedData = JSON.parse(JSON.stringify(data));
        
        // 检查是否是未开售商品的错误响应
        if (modifiedData.code === '960103' || modifiedData.ret === 960103) {
            console.log('🔧 检测到未开售商品，开始修改响应');
            
            // 从请求体中计算正确的总金额
            let totalAmount = 0;
            
            try {
                // 解析请求体
                let requestData = null;
                if (typeof requestBody === 'string') {
                    requestData = JSON.parse(requestBody);
                } else if (requestBody && requestBody.body) {
                    requestData = JSON.parse(requestBody.body);
                } else if (requestBody) {
                    requestData = requestBody;
                }
                
                if (requestData && requestData.skuItem) {
                    // 计算商品价格
                    requestData.skuItem.forEach(item => {
                        if (item.discountPrice && item.count) {
                            totalAmount += item.discountPrice * item.count;
                        }
                    });
                    
                    // 计算额外费用（如运费、服务费等）
                    if (requestData.extraItems) {
                        requestData.extraItems.forEach(extra => {
                            if (extra.price && extra.count) {
                                totalAmount += extra.price * extra.count;
                            }
                        });
                    }
                }
                
                console.log(`💰 计算总金额: ${totalAmount}`);
            } catch (error) {
                console.warn('解析请求体失败，使用默认总金额:', error);
                totalAmount = 19100; // 默认值
            }
            
            // 修改为成功响应
            modifiedData.code = 'OK';
            modifiedData.ret = 1;
            modifiedData.message = '成功';
            
            // 构造正确的data结构
            modifiedData.data = {
                totalPrice: totalAmount,
                totalAmount: totalAmount,
                currency: 'HKD',
                items: []
            };
            
            console.log('✅ 已修改为成功响应，总金额:', totalAmount);
        }
        
        console.log('🎉 计算订单API响应修改完成');
        return modifiedData;
    }

    console.log('✅ API拦截器已安装 (Fetch + XHR)');
})();
