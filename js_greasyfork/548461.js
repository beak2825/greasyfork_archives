// ==UserScript==
// @name         W-实时统计面板
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  实时统计财务数据，包括CP出款比例、充提差、充值金额笔数、提现金额笔数等指标
// @author       Cisco
// @match        https://6i8127vmu9.cg.ink/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      6i8127vmu9.cg.ink
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://6i8127vmu9.cg.ink/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548461/W-%E5%AE%9E%E6%97%B6%E7%BB%9F%E8%AE%A1%E9%9D%A2%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/548461/W-%E5%AE%9E%E6%97%B6%E7%BB%9F%E8%AE%A1%E9%9D%A2%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NS = 'financeStats';
    
    // 控制面板样式
    GM_addStyle(`
        .${NS}-monitor-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            width: 320px;
            max-height: 90vh;
            overflow-y: auto;
            transition: all 0.3s ease;
        }
        .${NS}-monitor-panel.${NS}_collapsed {
            width: 40px;
            height: 40px;
            overflow: hidden;
            padding: 5px;
        }
        .${NS}-toggle-panel {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 30px;
            height: 30px;
            border: none;
            background: #f0f0f0;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            z-index: 10000;
        }
        .${NS}-toggle-panel:hover {
            background: #e0e0e0;
        }
        .${NS}_collapsed .${NS}-panel-content {
            display: none;
        }
        .monitor-header {
            margin: 0 0 15px 0;
            color: #409EFF;
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        
        /* 优化统计字段样式 */
        .${NS}-stat-container {
            background: #fafafa;
            border: 1px solid #eee;
            border-radius: 5px;
            padding: 12px;
            margin-bottom: 15px;
        }
        
        .${NS}-stat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 6px 8px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #409EFF;
            transition: all 0.2s ease;
        }
        
        .${NS}-stat-row:hover {
            background: #f5f7fa;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .${NS}-stat-row:nth-child(2) {
            border-left-color: #67C23A;
        }
        
        .${NS}-stat-row:nth-child(3) {
            border-left-color: #E6A23C;
        }
        
        .${NS}-stat-row:nth-child(4) {
            border-left-color: #909399;
        }
        
        .${NS}-stat-row:nth-child(5) {
            border-left-color: #F56C6C;
        }
        
        .${NS}-stat-row:nth-child(6) {
            border-left-color: #9b59b6;
        }
        
        .${NS}-stat-row span {
            font-size: 13px;
            color: #606266;
        }
        
        .${NS}-stat-row span.value {
            font-weight: bold;
            color: #303133;
            background: #f0f2f5;
            padding: 3px 8px;
            border-radius: 3px;
            min-width: 50px;
            text-align: center;
        }
        
        .button-container {
            display: flex;
            flex-direction: column;
            margin-bottom: 15px;
        }

        .${NS}-monitor-button {
            width: 100%;
            padding: 10px;
            color: white;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
            margin-bottom: 10px;
        }
        .${NS}-monitor-button:disabled {
            background: #C0C4CC;
            cursor: not-allowed;
        }
        .${NS}-monitor-button.start {
            background: #67C23A;
        }
        .${NS}-monitor-button.start:hover {
            background: #5daf34;
        }
        .${NS}-monitor-button.stop {
            background: #F56C6C;
        }
        .${NS}-monitor-button.stop:hover {
            background: #e05c5c;
        }
        .monitor-stats {
            margin-top: 15px;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .monitor-stat-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .monitor-progress-container {
            margin: 10px 0;
            height: 10px;
            background: #f0f0f0;
            border-radius: 5px;
            overflow: hidden;
        }
        .monitor-progress-bar {
            height: 100%;
            background: linear-gradient(to right, #67C23A, #409EFF);
            transition: width 0.3s;
        }
        #${NS}_statusText {
            font-weight: bold;
            color: #409EFF;
        }
        #${NS}_processedCount {
            font-weight: bold;
            color: #67C23A;
        }
        .${NS}-monitor-button.hidden {
            display: none;
        }
        
        /* 清理缓存按钮样式 */
        .${NS}-monitor-button.clear {
            background: #909399;
            margin-top: 5px;
        }
        
        .${NS}-monitor-button.clear:hover {
            background: #82848a;
        }

        /* 数据历史对比样式 */
        .${NS}-history-change {
            font-size: 11px;
            margin-left: 5px;
            padding: 1px 4px;
            border-radius: 3px;
        }
        .${NS}-history-change.positive {
            background: #f0f9eb;
            color: #67c23a;
        }
        .${NS}-history-change.negative {
            background: #fef0f0;
            color: #f56c6c;
        }
        .${NS}-history-change.neutral {
            background: #f4f4f5;
            color: #909399;
        }
    `);

    // 配置
    const CONFIG = {
        refreshInterval: 10000, // 10秒刷新一次
        timezoneOffset: -3 * 60 // UTC-3时区偏移（分钟）
    };

    // 存储当前数据和历史数据
    let currentData = {
        cpRatio: '--',
        depositWithdrawDiff: '--',
        totalDeposit: '--',
        totalDepositCount: '--',
        totalWithdraw: '--',
        totalWithdrawCount: '--',
        lastUpdate: null
    };

    let previousData = GM_getValue('previousData', null);
    let dataHistory = GM_getValue('dataHistory', []);

    // 存储API响应缓存（避免重复请求）
    let apiCache = {};
    let autoRefreshInterval = null;
    let isAutoRefreshEnabled = false; // 默认不自动开始

    // 存储从网站请求中捕获的headers
    let capturedHeaders = GM_getValue('capturedHeaders', null);
    let isHeadersCaptured = !!capturedHeaders;

    // 监听XMLHttpRequest请求来捕获headers
    function setupXHRInterceptor() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

        // 存储每个XHR实例的headers
        const xhrHeaders = new WeakMap();

        XMLHttpRequest.prototype.open = function(method, url) {
            this._method = method;
            this._url = url;
            this._headers = {};
            xhrHeaders.set(this, this._headers);
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
            // 强制重写 x-request-id
            if (name.toLowerCase() === 'x-request-id') {
                value = generateRequestId();
                console.log('🔄 重新生成 x-request-id:', value);
            }
            this._headers[name] = value;
            return originalSetRequestHeader.call(this, name, value);
        };

        XMLHttpRequest.prototype.send = function(data) {
            const url = this._url;
            
            // 只监听目标API的请求
            if (url && url.includes('/api/')) {
                const headers = {...this._headers};
                
                const originalOnReadyStateChange = this.onreadystatechange;
                const originalOnLoad = this.onload;
                
                this.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        // 请求完成时捕获headers
                        if (!isHeadersCaptured && hasRequiredHeaders(headers)) {
                            tryCapture(headers);
                        }
                    }
                    
                    if (originalOnReadyStateChange) {
                        return originalOnReadyStateChange.apply(this, arguments);
                    }
                };
                
                this.onload = function() {
                    // 请求完成时捕获headers
                    if (!isHeadersCaptured && hasRequiredHeaders(headers)) {
                        tryCapture(headers);
                    }
                    
                    if (originalOnLoad) {
                        return originalOnLoad.apply(this, arguments);
                    }
                };
            }
            
            return originalSend.apply(this, arguments);
        };

        console.log('XHR拦截器已设置，等待API请求...');
    }

    // 检查是否包含必要的headers
    function hasRequiredHeaders(headers) {
        const requiredHeaders = ['childSiteCode', 'companyCode', 'Device', 'siteCode'];
        return requiredHeaders.some(header => 
            headers[header] || 
            headers[header.toLowerCase()] || 
            headers[header.toUpperCase()] ||
            headers[header.replace(/-/g, '')]
        );
    }
    // 保存headers
    function tryCapture(headers) {
        if (!isHeadersCaptured && hasRequiredHeaders(headers)) {
            headers.cookie = document.cookie || '(无可读cookie)';
            capturedHeaders = headers;
            isHeadersCaptured = true;
            GM_setValue('capturedHeaders', capturedHeaders);
            console.log('✅ 成功捕获API请求头:', capturedHeaders);
            updateHeaderStatus();
        }
    }
    // 生成请求ID
    function generateRequestId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // 获取请求头信息
    function getRequestHeaders() {
        if (capturedHeaders) {
            return {...capturedHeaders};
        }
        
        // 尝试从页面中提取可能的header信息
        const basicHeaders = {
            'accept': 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'origin': window.location.origin,
            'referer': window.location.href,
            'user-agent': navigator.userAgent,
            'x-requested-with': 'XMLHttpRequest'
        };

        // 尝试从meta标签获取信息
        const metaTags = document.querySelectorAll('meta');
        metaTags.forEach(tag => {
            const name = tag.getAttribute('name') || tag.getAttribute('property');
            const content = tag.getAttribute('content');
            if (name && content) {
                const headerName = name.toLowerCase().replace(/_/g, '-');
                if (headerName.includes('childsite') || headerName.includes('company') || headerName.includes('device') || headerName.includes('sitecode')) {
                    basicHeaders[headerName] = content;
                }
            }
        });

        // 尝试从全局变量获取
        try {
            if (window.appConfig) {
                Object.assign(basicHeaders, window.appConfig.headers || {});
            }
            if (window.API_CONFIG) {
                Object.assign(basicHeaders, window.API_CONFIG.headers || {});
            }
            
            // 尝试从常见的全局变量中获取站点信息
            const globalVars = ['siteCode', 'childSiteCode', 'companyCode', 'deviceId'];
            globalVars.forEach(varName => {
                if (window[varName]) {
                    const headerName = varName.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2');
                    basicHeaders[headerName] = window[varName];
                }
            });
        } catch (e) {
            // 忽略错误
        }

        // 添加cookie
        if (document.cookie) {
            basicHeaders['cookie'] = document.cookie;
        }

        return basicHeaders;
    }

    // 获取今日写死时间范围（11:00:00开始，次日10:59:59结束）
    function getTodayTimeRange() {
        const now = new Date();
        
        // 计算时区差异：UTC+8 到 UTC-3 相差11小时
        const timezoneDiff = 11 * 60 * 60 * 1000; // 11小时的毫秒数
        
        // 转换为UTC-3时区的时间
        const utc3Now = new Date(now.getTime() - timezoneDiff);
        
        // 今日开始时间（UTC-3的11:00:00）
        const startOfDay = new Date(utc3Now);
        startOfDay.setHours(11, 0, 0, 0);
        
        // 今日结束时间（UTC-3的次日10:59:59）
        const endOfDay = new Date(utc3Now);
        endOfDay.setDate(endOfDay.getDate() + 1); // 加一天
        endOfDay.setHours(10, 59, 59, 999);
        
        // 转换回UTC时间戳（秒）
        const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
        const endTimestamp = Math.floor(endOfDay.getTime() / 1000);
        
        return { start: startTimestamp, end: endTimestamp };
    }
    // 获取时间范围（基于UTC-3时区的整点到59分59秒，正确处理跨天）
    // function getTodayTimeRange() {
    //     const now = new Date();
        
    //     // 计算时区差异：UTC+8 到 UTC-3 相差11小时
    //     const timezoneDiff = 11 * 60 * 60 * 1000; // 11小时的毫秒数
        
    //     // 转换为UTC-3时区的时间
    //     const utc3Now = new Date(now.getTime() - timezoneDiff);
        
    //     // 开始时间：UTC-3当前小时的整点
    //     const startTime = new Date(utc3Now);
    //     startTime.setMinutes(0, 0, 0); // 整点，分钟、秒、毫秒归零
        
    //     // 结束时间：UTC-3当前小时的59分59秒（可能是下一天）
    //     const endTime = new Date(utc3Now);
    //     endTime.setDate(endTime.getDate() + 1)  // 结束时间加一天
    //     endTime.setHours(endTime.getHours() - 1)  // 结束时间减1小时
    //     endTime.setMinutes(59, 59, 999); // 59分59秒999毫秒
        
    //     // 转换回UTC时间戳（秒）
    //     const startTimestamp = Math.floor(startTime.getTime() / 1000);
    //     const endTimestamp = Math.floor(endTime.getTime() / 1000);
        
    //     console.log('时间计算:', {
    //         '本地时间': now.toLocaleString('zh-CN'),
    //         'UTC-3时间': utc3Now.toLocaleString('zh-CN'),
    //         '开始时间(UTC-3)': new Date(startTimestamp * 1000).toLocaleString('zh-CN'),
    //         '结束时间(UTC-3)': new Date(endTimestamp * 1000).toLocaleString('zh-CN'),
    //         '开始时间戳': startTimestamp,
    //         '结束时间戳': endTimestamp
    //     });
        
    //     return { start: startTimestamp, end: endTimestamp };
    // }

    // 获取当前时间显示（UTC-3时区）
    function getCurrentUTCTime() {
        const now = new Date();
        const utc3Time = new Date(now.getTime() + (CONFIG.timezoneOffset * 60 * 1000));
        return utc3Time.toLocaleTimeString('zh-CN');
    }

    // 添加控制面板
    function addControlPanel() {
        const panel = document.createElement("div");
        panel.className = `${NS}-monitor-panel`;
        panel.id = `${NS}_autoWithdrawPanel`;

        // 添加收起/展开按钮
        const toggleBtn = document.createElement("button");
        toggleBtn.className = `${NS}-toggle-panel`;
        toggleBtn.innerHTML = "×";
        toggleBtn.title = "收起/展开控制面板";
        toggleBtn.addEventListener("click", togglePanel);

        // 面板内容
        const panelContent = document.createElement("div");
        panelContent.className = `${NS}-panel-content`;
        panelContent.innerHTML = `
            <h3 class="monitor-header">📊 数据实时统计</h3>
            
            <div class="stats-container">
                <div class="${NS}-stat-row"><span>今日CP出款比例</span><span class="value" id="${NS}_cpRatio">--</span></div>
                <div class="${NS}-stat-row"><span>今日充提差</span><span class="value" id="${NS}_diffRatio">--</span></div>
                <div class="${NS}-stat-row"><span>今日充值总金额</span><span class="value" id="${NS}_rechargeAmount">--</span></div>
                <div class="${NS}-stat-row"><span>今日充值笔数</span><span class="value" id="${NS}_rechargeUsers">--</span></div>
                <div class="${NS}-stat-row"><span>今日提现总金额</span><span class="value" id="${NS}_withdrawAmount">--</span></div>
                <div class="${NS}-stat-row"><span>今日提现笔数</span><span class="value" id="${NS}_withdrawUsers">--</span></div>
            </div>
            
            <div class="button-container">
                <button id="${NS}_startBtn" class="${NS}-monitor-button start ${isAutoRefreshEnabled ? 'hidden' : ''}">开始统计</button>
                <button id="${NS}_stopBtn" class="${NS}-monitor-button stop ${!isAutoRefreshEnabled ? 'hidden' : ''}">停止统计</button>
                <button id="${NS}_clearCacheBtn" class="${NS}-monitor-button clear">清理缓存</button>
            </div>

            <div class="monitor-stats">
                <div class="monitor-stat-row">
                    <span>📶 状态:</span>
                    <span id="${NS}_statusText">等待开始</span>
                </div>
                <div class="monitor-stat-row">
                    <span>🕒 最后更新:</span>
                    <span id="${NS}_lastUpdateTime">--</span>
                </div>
                <div class="monitor-stat-row">
                    <span>⏰ 下次更新:</span>
                    <span id="${NS}_nextUpdateTime">--</span>
                </div>
                <div class="monitor-stat-row">
                    <span>📡 头信息状态:</span>
                    <span id="${NS}_headerStatus">等待API请求...</span>
                </div>
            </div>
        `;

        panel.appendChild(toggleBtn);
        panel.appendChild(panelContent);
        document.body.appendChild(panel);

        // 事件监听
        document.getElementById(`${NS}_startBtn`).addEventListener("click", startAutoRefresh);
        document.getElementById(`${NS}_stopBtn`).addEventListener("click", stopAutoRefresh);
        document.getElementById(`${NS}_clearCacheBtn`).addEventListener("click", clearCache);

        // 恢复上次数据
        if (previousData) {
            updateControlPanelStats(previousData);
        }

        updateHeaderStatus();
    }

    // 更新按钮显示状态
    function updateButtonVisibility() {
        const startBtn = document.getElementById(`${NS}_startBtn`);
        const stopBtn = document.getElementById(`${NS}_stopBtn`);
        
        if (isAutoRefreshEnabled) {
            startBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');
        } else {
            startBtn.classList.remove('hidden');
            stopBtn.classList.add('hidden');
        }
    }

    // 更新头信息状态显示
    function updateHeaderStatus() {
        const statusElement = document.getElementById(`${NS}_headerStatus`);
        if (isHeadersCaptured) {
            statusElement.textContent = '已捕获 ✓';
            statusElement.style.color = '#67C23A';
        } else {
            statusElement.textContent = '等待API请求...';
            statusElement.style.color = '#E6A23C';
        }
    }

    // 收起/展开面板
    function togglePanel() {
        const panel = document.getElementById(`${NS}_autoWithdrawPanel`);
        const isCollapsed = panel.classList.contains(`${NS}_collapsed`);
        
        if (isCollapsed) {
            panel.classList.remove(`${NS}_collapsed`);
            this.innerHTML = "×";
        } else {
            panel.classList.add(`${NS}_collapsed`);
            this.innerHTML = "≡";
        }
    }

    // 计算数据变化
    function calculateDataChanges(newData, oldData) {
        if (!oldData) return null;

        const changes = {
            cpRatio: calculateChange(newData.cpRatio, oldData.cpRatio),
            depositWithdrawDiff: calculateChange(newData.depositWithdrawDiff, oldData.depositWithdrawDiff),
            totalDeposit: calculateChange(extractNumber(newData.totalDeposit), extractNumber(oldData.totalDeposit)),
            totalDepositCount: calculateChange(newData.totalDepositCount, oldData.totalDepositCount),
            totalWithdraw: calculateChange(extractNumber(newData.totalWithdraw), extractNumber(oldData.totalWithdraw)),
            totalWithdrawCount: calculateChange(newData.totalWithdrawCount, oldData.totalWithdrawCount)
        };

        return changes;
    }

    function calculateChange(newValue, oldValue) {
        if (newValue === '--' || oldValue === '--') return 0;
        const change = (newValue - oldValue);
        return change;
    }

    function extractNumber(value) {
        if (value === '--') return 0;
        return Number(value);
    }

    // 更新控制面板数据
    function updateControlPanelStats(data) {
        const changes = calculateDataChanges(data, previousData);

        // 更新CP出款比例
        updateStatElement(`${NS}_cpRatio`, data.cpRatio, changes?.cpRatio);
        
        // 更新充提差
        updateStatElement(`${NS}_diffRatio`, data.depositWithdrawDiff, changes?.depositWithdrawDiff);
        
        // 更新充值总金额
        updateStatElement(`${NS}_rechargeAmount`, data.totalDeposit, changes?.totalDeposit);
        
        // 更新充值笔数
        updateStatElement(`${NS}_rechargeUsers`, data.totalDepositCount, changes?.totalDepositCount);
        
        // 更新提现总金额
        updateStatElement(`${NS}_withdrawAmount`, data.totalWithdraw, changes?.totalWithdraw);
        
        // 更新提现笔数
        updateStatElement(`${NS}_withdrawUsers`, data.totalWithdrawCount, changes?.totalWithdrawCount);

        document.getElementById(`${NS}_lastUpdateTime`).textContent = new Date(Date.now()).toLocaleTimeString('zh-CN');
    }

    function updateStatElement(elementId, value, change) {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.textContent = value;

        // 移除旧的change元素
        // const oldChange = element.querySelector(`.${NS}-history-change`);
        // if (oldChange) {
        //     oldChange.remove();
        // }

        // // 添加变化指示器
        // if (change !== undefined && change !== 0) {
        //     const changeElement = document.createElement('span');
        //     changeElement.className = `${NS}-history-change ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}`;
        //     changeElement.textContent = change > 0 ? `+${change}` : change;
        //     changeElement.title = `较上次更新: ${change > 0 ? '增加' : '减少'} ${Math.abs(change)}`;
        //     element.appendChild(changeElement);
        // }
    }

    // 更新下次更新时间
    function updateNextUpdateTime() {
        if (isAutoRefreshEnabled) {
            const nextUpdate = new Date(Date.now() + CONFIG.refreshInterval);
            document.getElementById(`${NS}_nextUpdateTime`).textContent = nextUpdate.toLocaleTimeString('zh-CN');
        } else {
            document.getElementById(`${NS}_nextUpdateTime`).textContent = '--';
        }
    }

    // 页面上下文发送 API 请求
    function makeApiRequest(url, data, cacheKey) {
        return new Promise((resolve, reject) => {
            // 检查缓存
            if (apiCache[cacheKey] && (Date.now() - apiCache[cacheKey].timestamp) < 10000) {
                resolve(apiCache[cacheKey].data);
                return;
            }

            const timeRange = getTodayTimeRange();

            // 更新请求数据中的时间参数
            if (data.create_start_time !== undefined) {
                data.create_start_time = timeRange.start;
                data.create_end_time = timeRange.end;
            }
            if (data.startCreateTimeStr !== undefined) {
                data.startCreateTimeStr = timeRange.start;
                data.endCreateTimeStr = timeRange.end;
            }

            // 获取请求头
            const headers = getRequestHeaders();

            // 使用 fetch 发送请求（浏览器会自动带 cookie，Network 可见）
            fetch(window.location.origin + url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
                credentials: 'include' // 自动携带 cookie
            })
            .then(res => res.json())
            .then(result => {
                console.log('API请求:', url, '请求参数:', JSON.stringify(data), '请求头:', headers, '响应:', result);
                // 缓存结果
                apiCache[cacheKey] = {
                    data: result,
                    timestamp: Date.now()
                };
                resolve(result);
            })
            .catch(err => {
                console.error('请求错误:', err);
                reject(err);
            });
        });
    }


    // 获取提现数据
    async function getWithdrawData(params, cacheKey) {
        const data = {
            merch_id: params.merch_id,
            status: params.status,
            memberCurrency: "BRL",
            lockBySelf: false,
            current: 1,
            size: 100,
            timeType: 0,
            create_start_time: 0,
            create_end_time: 0,
            queryType: 3,
            isRefresh: false
        };

        return await makeApiRequest(
            '/api/finance/withdrawAll/index',
            data,
            cacheKey
        );
    }

    // 获取充值数据
    async function getDepositData(cacheKey) {
        const data = {
            memberCurrency: "BRL",
            payCurrency: "BRL",
            payKindId: 0,
            timeType: 0,
            payStatusStr: "2",
            current: 1,
            size: 100,
            startCreateTimeStr: 0,
            endCreateTimeStr: 0,
            isRefresh: false
        };

        return await makeApiRequest(
            '/api/finance/payOrderAll/list',
            data,
            cacheKey
        );
    }

    // 获取所有数据
    async function fetchAllData() {
        try {
            if (!isHeadersCaptured) {
                document.getElementById(`${NS}_statusText`).textContent = '等待头信息...';
                return;
            }

            document.getElementById(`${NS}_statusText`).textContent = '获取数据中...';

            // 保存当前数据为上一次数据
            previousData = {...currentData};

            // 1. 获取提现次数（有merch_id参数）
            const withdrawCountData = await getWithdrawData(
                { merch_id: 311329, status: "4" },
                'withdraw_count'
            );

            // 2. 获取充值次数
            const depositCountData = await getDepositData('deposit_count');

            // 3. 获取已付款总金额（无merch_id参数）
            const withdrawTotalAmountData = await getWithdrawData(
                { status: "4" },
                'withdraw_total_amount'
            );

            // 4. 获取coinpay已付款金额（有merch_id参数）
            const withdrawCoinpayData = await getWithdrawData(
                { merch_id: 311329, status: "4" },
                'withdraw_coinpay'
            );

            // 5. 获取充值成功总金额
            const depositTotalAmountData = await getDepositData('deposit_total_amount');

            // 计算各项指标
            const withdrawCount = withdrawCountData?.data?.total || 0;
            const depositCount = depositCountData?.data?.total || 0;
            const withdrawTotalAmount = withdrawTotalAmountData?.data?.amount || 0;
            const withdrawTotalCount = withdrawTotalAmountData?.data?.total || 0;
            const withdrawCoinpayAmount = withdrawCoinpayData?.data?.amount || 0;
            const depositTotalAmount = depositTotalAmountData?.data?.amount || 0;

            // 计算CP出款比例
            const cpRatio = depositCount > 0 ? (withdrawCount / depositCount * 100).toFixed(5) : 0;

            // 计算充提差
            let depositWithdrawDiff = '--';
            if (depositTotalAmount > 0) {
                const diff = (withdrawTotalAmount - withdrawCoinpayAmount) / depositTotalAmount * 100;
                depositWithdrawDiff = diff.toFixed(5);
            }

            // 更新当前数据
            currentData = {
                cpRatio: cpRatio + '%',
                depositWithdrawDiff: depositWithdrawDiff + '%',
                totalDeposit: Number(depositTotalAmount),
                totalDepositCount: depositCount,
                totalWithdraw: Number(withdrawTotalAmount),
                totalWithdrawCount: withdrawTotalCount,
                lastUpdate: new Date().toISOString()
            };

            // 保存历史数据
            dataHistory.push({
                timestamp: new Date().toISOString(),
                data: {...currentData}
            });
            
            // 只保留最近100条记录
            if (dataHistory.length > 100) {
                dataHistory = dataHistory.slice(-100);
            }
            
            GM_setValue('previousData', previousData);
            GM_setValue('dataHistory', dataHistory);

            // 更新界面
            updateControlPanelStats(currentData);
            document.getElementById(`${NS}_statusText`).textContent = '运行中';

            // 更新下次更新时间
            updateNextUpdateTime();

        } catch (error) {
            console.error('获取数据失败:', error);
            document.getElementById(`${NS}_statusText`).textContent = '获取失败: ' + error.message;
        }
    }

    // 开始自动刷新
    function startAutoRefresh() {
        if (!isHeadersCaptured) {
            GM_notification('请等待头信息捕获完成', '提示');
            return;
        }

        if (autoRefreshInterval) clearInterval(autoRefreshInterval);
        autoRefreshInterval = setInterval(fetchAllData, CONFIG.refreshInterval);
        isAutoRefreshEnabled = true;
        
        document.getElementById(`${NS}_statusText`).textContent = '运行中';
        updateButtonVisibility();
        
        // 立即执行一次
        fetchAllData();
        updateNextUpdateTime();
    }

    // 停止自动刷新
    function stopAutoRefresh() {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
        isAutoRefreshEnabled = false;
        
        document.getElementById(`${NS}_statusText`).textContent = '已停止';
        updateButtonVisibility();
        updateNextUpdateTime();
    }

    // 清理缓存
    function clearCache() {
        apiCache = {};
        GM_deleteValue('capturedHeaders');
        capturedHeaders = null;
        isHeadersCaptured = false;
        GM_notification('缓存已清理', '财务统计');
        document.getElementById(`${NS}_statusText`).textContent = '缓存已清理';
        setTimeout(() => {
            document.getElementById(`${NS}_statusText`).textContent = isAutoRefreshEnabled ? '运行中' : '已停止';
        }, 2000);
    }

    // 初始化
    setTimeout(() => {
        setupXHRInterceptor();
        addControlPanel();
        updateHeaderStatus();
        updateButtonVisibility();
        
        console.log('财务统计脚本已加载，等待API请求...');
    }, 2000);

})();