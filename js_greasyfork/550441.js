// ==UserScript==
// @name         多多买菜平台助手 v2.14 Lite (商品销量统计精简版)
// @namespace    http://tampermonkey.net/
// @version      2.14.0
// @description  拦截API请求并统计商品销量、销售额数据（无图表，轻量级版本，自动修改pageSize=100，复制Excel数据，悬浮按钮，拖动边界限制，清新浅色主题，支持多场次数据累加）
// @author       MiniMax Agent
// @match        https://mc.pinduoduo.com/ddmc-mms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinduoduo.com
// @run-at       document-start
// @inject-into  page
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550441/%E5%A4%9A%E5%A4%9A%E4%B9%B0%E8%8F%9C%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B%20v214%20Lite%20%28%E5%95%86%E5%93%81%E9%94%80%E9%87%8F%E7%BB%9F%E8%AE%A1%E7%B2%BE%E7%AE%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550441/%E5%A4%9A%E5%A4%9A%E4%B9%B0%E8%8F%9C%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B%20v214%20Lite%20%28%E5%95%86%E5%93%81%E9%94%80%E9%87%8F%E7%BB%9F%E8%AE%A1%E7%B2%BE%E7%AE%80%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[API Monitor v2.14 Lite] 🚀 脚本已启动 - 自动修改pageSize参数为100');

    // 目标拦截接口
    const TARGET_API = 'https://mc.pinduoduo.com/cartman-mms/orderManagement/pageQueryDetail';

    // 数据存储
    const apiStats = {
        requests: [],
        startTime: Date.now(),
        totalCount: 0,
        successCount: 0,
        errorCount: 0,
        avgResponseTime: 0,
        statusCodes: {},
        // 商品统计数据
        products: new Map(),
        totalSalesVolume: 0,
        totalSalesAmount: 0
    };

    // ========== 拦截 fetch 请求 ==========
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const url = args[0];
        const startTime = Date.now();

        if (typeof url === 'string' && url.includes('pageQueryDetail')) {
            console.log('[API Monitor v2.14 Lite] ✅ 拦截到目标请求:', url);

            // 🔧 修改请求参数：将 pageSize 设置为 100
            try {
                let modifiedArgs = [...args];
                if (args[1] && args[1].body) {
                    const originalBody = args[1].body;
                    let bodyData;

                    // 解析请求体
                    if (typeof originalBody === 'string') {
                        try {
                            bodyData = JSON.parse(originalBody);
                        } catch (e) {
                            bodyData = originalBody;
                        }
                    } else {
                        bodyData = originalBody;
                    }

                    // 修改 pageSize 参数为 100
                    if (typeof bodyData === 'object' && bodyData !== null) {
                        const originalPageSize = bodyData.pageSize;
                        bodyData.pageSize = 100;
                        console.log(`[API Monitor v2.14 Lite] 🔧 修改请求参数: pageSize ${originalPageSize} -> 100`);

                        // 更新请求体
                        modifiedArgs[1] = {
                            ...args[1],
                            body: JSON.stringify(bodyData)
                        };
                    }
                }

                const response = await originalFetch.apply(this, modifiedArgs);
                const clonedResponse = response.clone();
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                // 读取响应数据
                const responseData = await clonedResponse.json();

                // 记录请求信息
                recordRequest({
                    url: url,
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    statusText: response.statusText,
                    responseTime: responseTime,
                    timestamp: new Date().toISOString(),
                    responseData: responseData,
                    success: response.ok
                });

                // 解析商品数据
                if (response.ok && responseData.success && responseData.result) {
                    parseProductData(responseData.result);
                }

                // 更新统计面板
                updateStatsPanel();

                return response;
            } catch (error) {
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                // 记录错误请求
                recordRequest({
                    url: url,
                    method: args[1]?.method || 'GET',
                    status: 0,
                    statusText: 'Network Error',
                    responseTime: responseTime,
                    timestamp: new Date().toISOString(),
                    error: error.message,
                    success: false
                });

                updateStatsPanel();
                throw error;
            }
        }

        return originalFetch.apply(this, args);
    };

    console.log('[API Monitor v2.14 Lite] ✅ fetch 拦截器已设置');

    // ========== 拦截 XMLHttpRequest ==========
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._apiMonitor = {
            url: url,
            method: method,
            startTime: null
        };
        return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._apiMonitor && this._apiMonitor.url.includes('pageQueryDetail')) {
            console.log('[API Monitor v2.14 Lite] ✅ XHR 拦截到目标请求:', this._apiMonitor.url);
            this._apiMonitor.startTime = Date.now();

            // 🔧 修改请求参数：将 pageSize 设置为 100
            if (args[0]) {
                try {
                    let bodyData;
                    if (typeof args[0] === 'string') {
                        bodyData = JSON.parse(args[0]);
                    } else {
                        bodyData = args[0];
                    }

                    if (typeof bodyData === 'object' && bodyData !== null) {
                        const originalPageSize = bodyData.pageSize;
                        bodyData.pageSize = 100;
                        console.log(`[API Monitor v2.14 Lite] 🔧 XHR 修改请求参数: pageSize ${originalPageSize} -> 100`);
                        args[0] = JSON.stringify(bodyData);
                    }
                } catch (e) {
                    console.warn('[API Monitor v2.14 Lite] ⚠️ 修改 XHR 请求参数失败:', e);
                }
            }

            this.addEventListener('load', function() {
                const endTime = Date.now();
                const responseTime = endTime - this._apiMonitor.startTime;

                try {
                    const responseData = JSON.parse(this.responseText);

                    recordRequest({
                        url: this._apiMonitor.url,
                        method: this._apiMonitor.method,
                        status: this.status,
                        statusText: this.statusText,
                        responseTime: responseTime,
                        timestamp: new Date().toISOString(),
                        responseData: responseData,
                        success: this.status >= 200 && this.status < 300
                    });

                    // 解析商品数据
                    if (this.status >= 200 && this.status < 300 && responseData.success && responseData.result) {
                        parseProductData(responseData.result);
                    }

                    updateStatsPanel();
                } catch (error) {
                    console.error('[API Monitor v2.14 Lite] 解析响应失败:', error);
                }
            });

            this.addEventListener('error', function() {
                const endTime = Date.now();
                const responseTime = endTime - this._apiMonitor.startTime;

                recordRequest({
                    url: this._apiMonitor.url,
                    method: this._apiMonitor.method,
                    status: 0,
                    statusText: 'Network Error',
                    responseTime: responseTime,
                    timestamp: new Date().toISOString(),
                    error: 'Network Error',
                    success: false
                });

                updateStatsPanel();
            });
        }

        return originalSend.apply(this, args);
    };

    console.log('[API Monitor v2.14 Lite] ✅ XHR 拦截器已设置');

    // 解析商品数据
    function parseProductData(resultData) {
        if (!resultData.resultList || !Array.isArray(resultData.resultList)) {
            console.warn('[API Monitor v2.14 Lite] ⚠️ 响应数据中没有 resultList');
            return;
        }

        // 🔧 新增：清空之前的商品数据，只保留最新一次请求的数据
        apiStats.products.clear();
        apiStats.totalSalesVolume = 0;
        apiStats.totalSalesAmount = 0;
        console.log('[API Monitor v2.14 Lite] 🗑️ 已清空旧数据，准备加载新数据');

        console.log('[API Monitor v2.14 Lite] 📦 解析商品数据，数量:', resultData.resultList.length);

        resultData.resultList.forEach(product => {
            const productId = product.productId;
            const productName = product.productName;
            const sellUnitName = product.sellUnitName || '件';
            const sessionDate = product.sessionDate;

            // 创建或获取商品记录
            if (!apiStats.products.has(productId)) {
                apiStats.products.set(productId, {
                    productId: productId,
                    productName: productName,
                    sellUnitName: sellUnitName,
                    totalSales: 0,
                    totalAmount: 0,
                    priceDetails: new Map(),
                    sessionCount: 0, // 场次数量
                    lastUpdate: Date.now()
                });
            }

            const productStats = apiStats.products.get(productId);
            productStats.lastUpdate = Date.now();
            productStats.sessionCount++; // 增加场次计数

            // 🔧 修复 v2.14：不再清空价格明细，而是累加多个场次的数据
            // productStats.priceDetails.clear(); // 删除此行，改为累加

            // 🔧 修复 v2.14：从价格明细累加计算本场次的销量和总销售额
            let sessionTotalSales = 0;
            let sessionTotalAmount = 0;

            if (product.specQuantityDetails && Array.isArray(product.specQuantityDetails)) {
                product.specQuantityDetails.forEach(spec => {
                    // 解析该规格下的价格明细
                    if (spec.priceDetail && Array.isArray(spec.priceDetail)) {
                        spec.priceDetail.forEach(priceItem => {
                            const price = priceItem.supplierPrice; // 价格（单位：分）
                            const sales = priceItem.total || 0;
                            const amount = (price * sales) / 100; // 转换为元

                            const priceKey = price.toString();
                            if (!productStats.priceDetails.has(priceKey)) {
                                productStats.priceDetails.set(priceKey, {
                                    price: price / 100, // 转换为元
                                    sales: 0,
                                    amount: 0
                                });
                            }

                            // 🔧 修复 v2.14：累加价格明细（支持多场次）
                            const priceStats = productStats.priceDetails.get(priceKey);
                            priceStats.sales += sales;
                            priceStats.amount += amount;

                            // 累加本场次的销量和金额
                            sessionTotalSales += sales;
                            sessionTotalAmount += amount;
                        });
                    }
                });
            }

            // 🔧 修复 v2.14：累加商品的总销量和总销售额（支持多场次）
            productStats.totalSales += sessionTotalSales;
            productStats.totalAmount += sessionTotalAmount;

            console.log(`[API Monitor v2.14 Lite] 📊 处理商品: ${productName}, 场次数: ${productStats.sessionCount}, 本场次销量: ${sessionTotalSales}, 累计总销量: ${productStats.totalSales}`);
        });

        // 计算总销量和总销售额
        apiStats.totalSalesVolume = 0;
        apiStats.totalSalesAmount = 0;
        apiStats.products.forEach(product => {
            apiStats.totalSalesVolume += product.totalSales;
            apiStats.totalSalesAmount += product.totalAmount;
        });

        console.log('[API Monitor v2.14 Lite] 📊 商品统计更新:', {
            商品种类: apiStats.products.size,
            总销量: apiStats.totalSalesVolume,
            总销售额: apiStats.totalSalesAmount.toFixed(2) + '元'
        });

        // 显示场次统计信息
        const multiSessionProducts = Array.from(apiStats.products.values()).filter(p => p.sessionCount > 1);
        if (multiSessionProducts.length > 0) {
            console.log(`[API Monitor v2.14 Lite] 📅 检测到 ${multiSessionProducts.length} 个商品包含多个场次数据:`);
            multiSessionProducts.forEach(p => {
                console.log(`  - ${p.productName}: ${p.sessionCount} 个场次, 总销量: ${p.totalSales}, 总销售额: ¥${p.totalAmount.toFixed(2)}`);
            });
        }
    }

    // 记录请求数据
    function recordRequest(requestInfo) {
        apiStats.requests.push(requestInfo);
        apiStats.totalCount++;

        if (requestInfo.success) {
            apiStats.successCount++;
        } else {
            apiStats.errorCount++;
        }

        // 统计状态码
        const statusKey = requestInfo.status.toString();
        apiStats.statusCodes[statusKey] = (apiStats.statusCodes[statusKey] || 0) + 1;

        // 计算平均响应时间
        const totalTime = apiStats.requests.reduce((sum, req) => sum + req.responseTime, 0);
        apiStats.avgResponseTime = Math.round(totalTime / apiStats.requests.length);

        // 只保留最近100条记录
        if (apiStats.requests.length > 100) {
            apiStats.requests.shift();
        }

        console.log('[API Monitor v2.14 Lite] 📝 请求记录已更新');
    }

    // 创建统计面板
    function createStatsPanel() {
        if (!document.body) {
            setTimeout(createStatsPanel, 50);
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'api-monitor-panel';
        panel.innerHTML = `
            <style>
                #api-monitor-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 480px;
                    max-height: 90vh;
                    background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%);
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.08);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: #1e293b;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                #api-monitor-header {
                    padding: 16px 20px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    user-select: none;
                    flex-shrink: 0;
                }
                #api-monitor-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
                #api-monitor-controls {
                    display: flex;
                    gap: 8px;
                }
                .control-btn {
                    background: rgba(255, 255, 255, 0.25);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    backdrop-filter: blur(10px);
                }
                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.35);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                #api-monitor-tabs {
                    display: flex;
                    background: #f8fafc;
                    padding: 12px 20px 0;
                    gap: 8px;
                    flex-shrink: 0;
                    border-bottom: 2px solid #e2e8f0;
                }
                .tab-btn {
                    padding: 10px 18px;
                    background: transparent;
                    border: none;
                    color: #64748b;
                    border-radius: 8px 8px 0 0;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s;
                    position: relative;
                }
                .tab-btn.active {
                    background: white;
                    color: #8b5cf6;
                    font-weight: 600;
                    box-shadow: 0 -2px 8px rgba(139, 92, 246, 0.1);
                }
                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #8b5cf6;
                }
                .tab-btn:hover:not(.active) {
                    background: #f1f5f9;
                    color: #475569;
                }
                #api-monitor-content {
                    padding: 20px;
                    overflow-y: auto;
                    flex: 1;
                    background: white;
                }
                #api-monitor-content.collapsed {
                    display: none;
                }
                .tab-content {
                    display: none;
                }
                .tab-content.active {
                    display: block;
                }
                .stat-item {
                    background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%);
                    padding: 14px 16px;
                    border-radius: 12px;
                    margin-bottom: 12px;
                    border: 1px solid #e9d5ff;
                    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.06);
                    transition: all 0.3s;
                }
                .stat-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.12);
                }
                .stat-label {
                    font-size: 12px;
                    color: #64748b;
                    margin-bottom: 6px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .stat-value {
                    font-size: 26px;
                    font-weight: 700;
                    color: #5b21b6;
                    line-height: 1;
                }
                .stat-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                .stat-row-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 12px;
                }
                .product-list {
                    margin-top: 16px;
                    max-height: 500px;
                    overflow-y: auto;
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                }
                .product-item {
                    padding: 14px;
                    margin-bottom: 10px;
                    background: white;
                    border-radius: 10px;
                    font-size: 13px;
                    border-left: 4px solid #a78bfa;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
                    transition: all 0.3s;
                }
                .product-item:hover {
                    transform: translateX(4px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                }
                .product-name {
                    font-weight: 600;
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #0f172a;
                }
                .product-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 6px;
                    color: #475569;
                }
                .product-price-detail {
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #e2e8f0;
                    font-size: 12px;
                    color: #64748b;
                }
                .price-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    padding: 4px 0;
                }
                .request-list {
                    margin-top: 16px;
                    max-height: 400px;
                    overflow-y: auto;
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                }
                .request-item {
                    padding: 10px;
                    margin-bottom: 8px;
                    background: white;
                    border-radius: 8px;
                    font-size: 12px;
                    border-left: 3px solid #a78bfa;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s;
                }
                .request-item:hover {
                    transform: translateX(4px);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                }
                .request-item.error {
                    border-left-color: #ef4444;
                }
                .request-time {
                    color: #94a3b8;
                    font-size: 11px;
                    margin-top: 4px;
                }
                .status-badge {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 600;
                    margin-left: 8px;
                }
                .status-success {
                    background: #d1fae5;
                    color: #059669;
                }
                .status-error {
                    background: #fee2e2;
                    color: #dc2626;
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .highlight {
                    color: #8b5cf6;
                    font-weight: 600;
                }
                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                    color: #94a3b8;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.9);
                    }
                }
            </style>
            <div id="api-monitor-header">
                <h3>📊 商品销量统计 v2.14 Lite</h3>
                <div id="api-monitor-controls">
                    <button class="control-btn" id="toggle-btn" title="折叠/展开">▼</button>
                    <button class="control-btn" id="export-btn" title="复制飞书数据">📋</button>
                    <button class="control-btn" id="clear-btn" title="清空数据">🗑</button>
                    <button class="control-btn" id="minimize-btn" title="关闭面板">✕</button>
                </div>
            </div>
            <div id="api-monitor-tabs">
                <button class="tab-btn active" data-tab="products">商品统计</button>
                <button class="tab-btn" data-tab="api">API监控</button>
            </div>
            <div id="api-monitor-content">
                <!-- 商品统计标签页 -->
                <div class="tab-content active" id="tab-products">
                    <div class="stat-row-3">
                        <div class="stat-item">
                            <div class="stat-label">商品种类</div>
                            <div class="stat-value" id="product-count">0</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">总销量</div>
                            <div class="stat-value" id="total-sales">0</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">总销售额</div>
                            <div class="stat-value" id="total-amount">¥0</div>
                        </div>
                    </div>
                    <div class="product-list" id="product-list">
                        <div class="empty-state">暂无商品数据<br><small style="font-size: 12px; opacity: 0.7;">请在页面中触发商品查询操作</small></div>
                    </div>
                </div>

                <!-- API监控标签页 -->
                <div class="tab-content" id="tab-api">
                    <div class="stat-row">
                        <div class="stat-item">
                            <div class="stat-label">总请求数</div>
                            <div class="stat-value" id="total-count">0</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">成功率</div>
                            <div class="stat-value" id="success-rate">0%</div>
                        </div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-item">
                            <div class="stat-label">平均响应时间</div>
                            <div class="stat-value" id="avg-time">0ms</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">错误次数</div>
                            <div class="stat-value" id="error-count">0</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">状态码统计</div>
                        <div id="status-codes-list" style="margin-top: 8px; font-size: 13px;">
                            <div class="empty-state" style="padding: 10px;">暂无数据</div>
                        </div>
                    </div>
                    <div class="request-list" id="request-list">
                        <div class="empty-state">暂无请求记录<br><small style="font-size: 12px; opacity: 0.7;">拦截到的请求将显示在这里</small></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);

        // 创建悬浮按钮
        const floatingBtn = document.createElement('div');
        floatingBtn.id = 'api-monitor-floating-btn';
        floatingBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
            border-radius: 50%;
            box-shadow: 0 6px 24px rgba(139, 92, 246, 0.35);
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: white;
            z-index: 999998;
            transition: all 0.3s ease;
            user-select: none;
            border: 3px solid white;
        `;
        floatingBtn.innerHTML = '📊';
        floatingBtn.title = '打开统计面板';

        // 悬浮按钮悬停效果
        floatingBtn.addEventListener('mouseenter', () => {
            floatingBtn.style.transform = 'scale(1.1) rotate(5deg)';
            floatingBtn.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.5)';
        });
        floatingBtn.addEventListener('mouseleave', () => {
            floatingBtn.style.transform = 'scale(1) rotate(0deg)';
            floatingBtn.style.boxShadow = '0 6px 24px rgba(139, 92, 246, 0.35)';
        });

        // 悬浮按钮点击事件
        floatingBtn.addEventListener('click', () => {
            panel.style.display = 'flex';
            floatingBtn.style.display = 'none';
        });

        document.body.appendChild(floatingBtn);

        // 按钮事件
        document.getElementById('toggle-btn').addEventListener('click', () => {
            const content = document.getElementById('api-monitor-content');
            const btn = document.getElementById('toggle-btn');
            content.classList.toggle('collapsed');
            btn.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
        });

        document.getElementById('export-btn').addEventListener('click', exportData);
        document.getElementById('clear-btn').addEventListener('click', () => {
            if (confirm('确定要清空所有统计数据吗？')) {
                clearStats();
            }
        });
        document.getElementById('minimize-btn').addEventListener('click', () => {
            panel.style.display = 'none';
            floatingBtn.style.display = 'flex';
        });

        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                switchTab(tabName);
            });
        });

        console.log('[API Monitor v2.14 Lite] ✅ UI面板已创建');
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    function exportData() {
        if (apiStats.products.size === 0) {
            alert('暂无数据可复制！');
            return;
        }

        // 生成 Excel 格式数据（制表符分隔）
        let excelData = '商品ID\t商品名称\t商品供价\t销售数量\t销售金额\n';

        // 按销售额排序
        const sortedProducts = Array.from(apiStats.products.values())
            .sort((a, b) => b.totalAmount - a.totalAmount);

        sortedProducts.forEach(product => {
            if (product.priceDetails.size > 0) {
                // 有价格明细，展开每个价格
                const sortedPrices = Array.from(product.priceDetails.values())
                    .sort((a, b) => a.price - b.price);

                sortedPrices.forEach(priceDetail => {
                    excelData += `${product.productId}\t`;
                    excelData += `${product.productName}\t`;
                    excelData += `${priceDetail.price.toFixed(2)}\t`;
                    excelData += `${priceDetail.sales}\t`;
                    excelData += `${priceDetail.amount.toFixed(2)}\n`;
                });
            } else {
                // 没有价格明细，显示总计
                excelData += `${product.productId}\t`;
                excelData += `${product.productName}\t`;
                excelData += `-\t`;
                excelData += `${product.totalSales}\t`;
                excelData += `${product.totalAmount.toFixed(2)}\n`;
            }
        });

        // 复制到剪贴板
        navigator.clipboard.writeText(excelData).then(() => {
            // 显示成功提示
            showToast('✅ 飞书数据已复制到剪贴板！\n可以直接粘贴到飞书中');
            console.log('[API Monitor v2.14 Lite] 📋 飞书数据已复制到剪贴板');
        }).catch(err => {
            console.error('[API Monitor v2.14 Lite] 复制失败:', err);
            alert('复制失败！请检查浏览器权限设置。');
        });
    }

    // 拖拽功能（带边界限制）
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('api-monitor-header');

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 计算新位置
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // 🔧 边界限制：确保面板不会超出页面范围
            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;

            // 限制上下边界
            if (newTop < 0) newTop = 0;
            if (newTop > maxTop) newTop = maxTop;

            // 限制左右边界
            if (newLeft < 0) newLeft = 0;
            if (newLeft > maxLeft) newLeft = maxLeft;

            // 应用新位置
            element.style.top = newTop + 'px';
            element.style.left = newLeft + 'px';
            element.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 更新统计面板
    function updateStatsPanel() {
        updateProductStats();
        updateAPIStats();
    }

    // 更新商品统计
    function updateProductStats() {
        document.getElementById('product-count').textContent = apiStats.products.size;
        document.getElementById('total-sales').textContent = apiStats.totalSalesVolume;
        document.getElementById('total-amount').textContent = '¥' + apiStats.totalSalesAmount.toFixed(2);

        // 更新商品列表
        updateProductList();
    }

    // 更新商品列表
    function updateProductList() {
        const listContainer = document.getElementById('product-list');

        if (apiStats.products.size === 0) {
            listContainer.innerHTML = '<div class="empty-state">暂无商品数据<br><small style="font-size: 12px; opacity: 0.7;">请在页面中触发商品查询操作</small></div>';
            return;
        }

        const sortedProducts = Array.from(apiStats.products.values())
            .sort((a, b) => b.totalAmount - a.totalAmount);

        listContainer.innerHTML = sortedProducts.map((product, index) => {
            const priceDetailsHtml = Array.from(product.priceDetails.values())
                .map(pd => `
                    <div class="price-item">
                        <span>单价 ¥${pd.price.toFixed(2)}</span>
                        <span>${pd.sales} ${product.sellUnitName} | ¥${pd.amount.toFixed(2)}</span>
                    </div>
                `).join('');

            return `
                <div class="product-item">
                    <div class="product-name">
                        <span style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 2px 8px; border-radius: 6px; font-size: 11px; margin-right: 6px; font-weight: 700;">TOP${index + 1}</span> ${product.productName}
                    </div>
                    <div class="product-stats">
                        <span>销量: <span class="highlight">${product.totalSales} ${product.sellUnitName}</span></span>
                        <span>销售额: <span class="highlight">¥${product.totalAmount.toFixed(2)}</span></span>
                    </div>
                    ${product.priceDetails.size > 0 ? `
                        <div class="product-price-detail">
                            <div style="margin-bottom: 4px; opacity: 0.8;">📊 价格销售明细：</div>
                            ${priceDetailsHtml}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    // 更新API统计
    function updateAPIStats() {
        document.getElementById('total-count').textContent = apiStats.totalCount;
        document.getElementById('error-count').textContent = apiStats.errorCount;
        document.getElementById('avg-time').textContent = apiStats.avgResponseTime + 'ms';

        const successRate = apiStats.totalCount > 0
            ? Math.round((apiStats.successCount / apiStats.totalCount) * 100)
            : 0;
        document.getElementById('success-rate').textContent = successRate + '%';

        // 更新状态码统计
        updateStatusCodes();

        // 更新请求列表
        updateRequestList();
    }

    // 更新状态码统计
    function updateStatusCodes() {
        const container = document.getElementById('status-codes-list');

        if (Object.keys(apiStats.statusCodes).length === 0) {
            container.innerHTML = '<div class="empty-state" style="padding: 10px;">暂无数据</div>';
            return;
        }

        const statusHtml = Object.entries(apiStats.statusCodes)
            .sort((a, b) => b[1] - a[1])
            .map(([code, count]) => {
                let label = code;
                let badgeClass = 'status-success';

                if (code === '200') {
                    label = '200 成功';
                } else if (code === '0') {
                    label = '网络错误';
                    badgeClass = 'status-error';
                } else if (code.startsWith('4') || code.startsWith('5')) {
                    badgeClass = 'status-error';
                }

                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span>${label}</span>
                        <span class="status-badge ${badgeClass}">${count} 次</span>
                    </div>
                `;
            }).join('');

        container.innerHTML = statusHtml;
    }

    // 更新请求列表
    function updateRequestList() {
        const listContainer = document.getElementById('request-list');
        const recentRequests = apiStats.requests.slice(-10).reverse();

        if (recentRequests.length === 0) {
            listContainer.innerHTML = '<div class="empty-state">暂无请求记录<br><small style="font-size: 12px; opacity: 0.7;">拦截到的请求将显示在这里</small></div>';
            return;
        }

        listContainer.innerHTML = recentRequests.map(req => {
            const time = new Date(req.timestamp).toLocaleTimeString('zh-CN');
            const statusClass = req.success ? '' : 'error';
            const statusBadge = req.success
                ? `<span class="status-badge status-success">${req.status}</span>`
                : `<span class="status-badge status-error">${req.status || '失败'}</span>`;
            return `
                <div class="request-item ${statusClass}">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span><strong>${req.method}</strong> ${statusBadge}</span>
                        <span style="color: #4ade80;">${req.responseTime}ms</span>
                    </div>
                    <div class="request-time">${time}</div>
                </div>
            `;
        }).join('');
    }

    // 显示 Toast 提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            font-size: 16px;
            z-index: 9999999;
            white-space: pre-line;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: fadeIn 0.3s ease-in-out;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        // 3秒后自动消失
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-in-out';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 清空统计数据
    function clearStats() {
        apiStats.requests = [];
        apiStats.totalCount = 0;
        apiStats.successCount = 0;
        apiStats.errorCount = 0;
        apiStats.avgResponseTime = 0;
        apiStats.statusCodes = {};
        apiStats.products.clear();
        apiStats.totalSalesVolume = 0;
        apiStats.totalSalesAmount = 0;
        apiStats.startTime = Date.now();
        updateStatsPanel();
        console.log('[API Monitor v2.14 Lite] 🗑️ 数据已清空');
    }

    // 页面加载完成后创建面板
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createStatsPanel);
    } else {
        createStatsPanel();
    }

    console.log('[API Monitor v2.14 Lite] ✅ 初始化完成，监控接口:', TARGET_API);
})();
