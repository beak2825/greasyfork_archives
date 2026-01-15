// ==UserScript==
// @name         摸鱼放置强化模拟器_1.63
// @namespace    http://tampermonkey.net/
// @version      1.63
// @description  支持搜索选择物品的强化模拟器
// @author       火龙果,江牛
// @match        *://*moyu-idle.com/*
// @match        *://www.moyu-idle.com/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/558408/%E6%91%B8%E9%B1%BC%E6%94%BE%E7%BD%AE%E5%BC%BA%E5%8C%96%E6%A8%A1%E6%8B%9F%E5%99%A8_163.user.js
// @updateURL https://update.greasyfork.org/scripts/558408/%E6%91%B8%E9%B1%BC%E6%94%BE%E7%BD%AE%E5%BC%BA%E5%8C%96%E6%A8%A1%E6%8B%9F%E5%99%A8_163.meta.js
// ==/UserScript==
 
(function () {
    //有什么关于本脚本的意见或建议 1群内找火龙果
    'use strict';
 
 
    // 从官方数据中提取插件需要的格式
    function processEnhanceInfo(allEnhanceInfo) {
        const result = {};
 
        for (const [key, data] of Object.entries(allEnhanceInfo)) {
            try {
                const success = data.enhanceSuccessTo;
                if (!success) continue;
 
                const [baseRes, levelStr] = success.split('+');
                const level = parseInt(levelStr, 10);
 
                if (!result[baseRes]) {
                    result[baseRes] = {
                        resId: baseRes,
                        pers: [],
                        protectes: [],
                        requires: []
                    };
                }
 
                const entry = result[baseRes];
 
                // 确保数组长度足够
                while (entry.pers.length < level) {
                    entry.pers.push(null);
                    entry.protectes.push(null);
                    entry.requires.push(null);
                }
 
                // 记录概率
                entry.pers[level - 1] = data.enhanceBasePercent;
 
                // 记录保护物品列表（只取基础名称）
                const protectList = (data.enhanceProtecteResourceIds || [])
                    .map(item => {
                        // 如果保护物品有+数字，只取基础名称
                        if (item.includes('+')) {
                            return item.split('+')[0];
                        }
                        return item;
                    });
                entry.protectes[level - 1] = protectList;
 
                // 记录需求材料
                const reqs = (data.enhanceRequireResource || [])
                    .map(req => ({
                        res: req.resourceId,
                        count: req.count
                    }));
                entry.requires[level - 1] = reqs;
 
            } catch (error) {
                console.warn('解析失败，跳过对象:', key, error);
                continue;
            }
        }
 
        // 清理空值
        for (const [key, value] of Object.entries(result)) {
            value.pers = value.pers.filter(p => p !== null);
            value.protectes = value.protectes.filter(p => p !== null);
            value.requires = value.requires.filter(r => r !== null);
        }
 
        return result;
    }
    // 轮询等待数据到来
    function waitFor(item) {
        return new Promise((resolve, reject) => {
            // 如果数据已经存在，直接返回
            if (unsafeWindow[item] && Object.keys(unsafeWindow[item]).length > 0) {
                resolve(unsafeWindow[item]);
                return;
            }
 
            // 否则开始轮询
            const maxWaitTime = 10000; // 10秒超时
            const checkInterval = 200;
            const startTime = Date.now();
 
            const checkData = () => {
                if (unsafeWindow[item] && Object.keys(unsafeWindow[item]).length > 0) {
                    resolve(unsafeWindow[item]);
                    return;
                }
 
                if (Date.now() - startTime > maxWaitTime) {
                    reject(new Error('等待强化数据超时'));
                    return;
                }
 
                setTimeout(checkData, checkInterval);
            };
 
            checkData();
        });
    }
    // 获取市场价格
    let ms = undefined;
    function fetchMarketData(url) {
        return new Promise((resolve, reject) => {
            // 如果是同源请求，可以直接用fetch
            if (window.location.origin === new URL(url, window.location.href).origin) {
                fetch(url, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        // 如果需要的话，添加其他headers
                    }
                })
                    .then(response => response.json())
                    .then(resolve)
                    .catch(reject);
            } else {
                // 跨域请求使用GM_xmlhttpRequest
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function (response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: reject
                });
            }
        });
    }
    async function getMarketPrice() {
        try {
            const data = await fetchMarketData("/api/game/market/price");
 
            console.log("市场数据:", data);
 
            if (data && data.data?.items) {
                ms = data.data.items || {};
                console.log("处理后的数据:", ms);
            }
        } catch (error) {
            console.error("获取市场数据失败:", error);
        }
    }
 
    let itemProbabilities = {};
    let allGameResource = {};
 
    function createReactiveState(initialValue, onUpdate) {
        let _value = initialValue;
 
        return {
            get value() {
                return _value;
            },
            set value(newValue) {
                if (_value !== newValue) {
                    _value = newValue;
                    onUpdate && onUpdate(newValue);
                }
            },
            // 可选：提供直接设置值的方法
            setValue(newValue) {
                this.value = newValue;
            },
            // 可选：获取当前值
            getValue() {
                return _value;
            }
        };
    }
 
    function id2name(id) { return allGameResource[id].name; }
 
    let selectedItem = createReactiveState(GM_getValue('selectedItem', "axe"), (newValue) => {
        const itemSearch = document.getElementById('itemSearch');
        GM_setValue('selectedItem', selectedItem.value);
        if (itemSearch) itemSearch.value = id2name(selectedItem.value);
    });
 
    // 强化等级
    let enhancementLevel = 0;
    // 幸运等级
    let luckLevel = 0;
    // 是否勾选强化专家
    let isEnhancementExpert = false;
    // 物品价格 物品:价格
    let resPrices = {};
    // 保护物品 物品:{等级:物品}
    let protectedItems = {};
    // 当前物品
    let itemInfo = {};
    // 当前使用的概率
    let currentProbabilities = {};
    let allRequireNames = new Set();
 
    // 拖动相关变量
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY; // 记录拖动开始位置
    let isClick = true; // 判断是否是点击事件
 
    // 窗口位置和状态
    let windowPosition = {
        x: GM_getValue('windowX', 20) > window.innerWidth - 40 ? window.innerWidth - 40 : GM_getValue('windowX', 20), // 默认右上角
        y: GM_getValue('windowY', 20) > window.innerHeight - 40 ? window.innerHeight - 40 : GM_getValue('windowY', 20),
        isMinimized: GM_getValue('isMinimized', false) // 默认不最小化
    };
 
    // 每级强化价格（金币）- 初始值
    let prices = GM_getValue("prices", [
        1,    // 0 → 1
        1,    // 1 → 2
        1,    // 2 → 3
        1,    // 3 → 4
        1,   // 4 → 5
        1,   // 5 → 6
        1,   // 6 → 7
        1,  // 7 → 8
        1,  // 8 → 9
        1   // 9 → 10
    ]);
 
    // 单次保护价格（金币）
    let protectPrices = GM_getValue("protectPrices", [
        0,    // 0 → 1
        0,    // 1 → 2
        0,    // 2 → 3
        0,    // 3 → 4
        0,   // 4 → 5
        0,   // 5 → 6
        0,   // 6 → 7
        0,  // 7 → 8
        0,  // 8 → 9
        0   // 9 → 10
    ]);
    // 是否使用妙妙工具
    let miaomiaoTools = false;
 
    // 添加完整CSS样式
    GM_addStyle(`
        #enhancement-simulator {
            position: fixed;
            right: auto;
            top: ${windowPosition.y}px;
            left: ${windowPosition.x}px;
            width: 80%;
            max-width: 1300px;
            background: rgba(30, 40, 80, 0.95);
            border-radius: 15px;
            padding: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            z-index: 10000;
            color: white;
            border: 1px solid #3498db;
            max-height: 90vh;
            overflow-y: auto;
            transition: transform 0.3s ease, height 0.3s ease;
            display: ${windowPosition.isMinimized ? 'none' : 'block'};
        }
 
        .simulator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #3498db;
            cursor: move; /* 显示拖动光标 */
        }
 
        .simulator-title {
            font-size: 1.6rem;
            font-weight: bold;
            color: #3498db;
        }
 
        .toolbar {
            display: flex;
            gap: 10px;
        }
 
        .toolbar-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }
 
        .toolbar-btn:hover {
            background: rgba(255,255,255,0.1);
        }
 
        .minimize-btn::before {
            content: '−';
        }
 
        .restore-btn {
            position: fixed;
            background: rgba(30, 40, 80, 0.95);
            color: white;
            border: 1px solid #3498db;
            border-radius: 50%;
            top: ${windowPosition.y}px;
            left: ${windowPosition.x}px;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transition: all 0.2s;
            z-index: 10001;
            display: ${windowPosition.isMinimized ? 'flex' : 'none'};
            cursor: move; /* 显示拖动光标 */
        }
 
        .restore-btn:hover {
            background: rgba(40, 50, 90, 0.95);
            transform: scale(1.05);
            zIndex:999999;
        }
 
        /* 拖动时的样式 */
        .simulator-header:active {
            cursor: grabbing;
        }
 
        /* 其他现有样式保持不变... */
        .control-group {
            margin-bottom: 15px;
        }
 
        .control-label {
            display: block;
            margin-bottom: 8px;
            font-size: 1rem;
            color: #bdc3c7;
        }
 
        /* 统一输入框高度 */
        .control-input {
            width: 100%;
            padding: 12px; /* 增加内边距，提高高度 */
            border: 1px solid #3498db;
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 1.05rem;
            height: 44px; /* 统一高度 */
            box-sizing: border-box;
        }
 
        /* 搜索下拉框样式 */
        .search-select {
            position: relative;
            width: 100%;
        }
 
        .search-input {
            width: 100%;
            padding: 12px;
            border: 1px solid #3498db;
            border-radius: 6px;
            background: rgba(255,255,255,0.1);
            color: white;
            font-size: 1.05rem;
            height: 44px;
            box-sizing: border-box;
            cursor: pointer;
        }
 
        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            background: rgba(30, 40, 80, 0.95);
            border: 1px solid #3498db;
            border-radius: 6px;
            margin-top: 4px;
            z-index: 100;
            display: none;
        }
 
        .search-result-item {
            padding: 10px;
            cursor: pointer;
            transition: background 0.2s;
            autocomplete :off
        }
 
        .search-result-item:hover {
            background: rgba(52, 152, 219, 0.1);
        }
 
        .search-result-item.selected {
            background: rgba(52, 152, 219, 0.2);
        }
 
        .search-protected {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            background: rgba(30, 40, 80, 0.95);
            border: 1px solid #3498db;
            border-radius: 6px;
            margin-top: 4px;
            z-index: 100;
            display: none;
        }
 
        .search-protected-item {
            padding: 10px;
            cursor: pointer;
            transition: background 0.2s;
            autocomplete :off
        }
 
        .search-protected-item:hover {
            background: rgba(52, 152, 219, 0.1);
        }
 
        .search-protected-item.selected {
            background: rgba(52, 152, 219, 0.2);
        }
 
        /* 下拉框样式 */
        select.control-input {
            padding: 12px; /* 增加内边距 */
            height: 44px; /* 统一高度 */
        }
 
        /* 下拉框选项样式 */
        select.control-input option {
            background: rgba(30, 40, 80, 0.95);
            color: white;
            border: none;
        }
 
        .btn-group {
            display: flex;
            gap: 15px;
            margin: 20px 0;
        }
 
        .simulator-btn {
            padding: 10px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1.05rem;
            font-weight: bold;
            transition: all 0.2s;
            min-width: 150px;
        }
 
        .btn-calculate {
            background: #3498db;
            color: white;
        }
 
        .btn-calculate:hover {
            background: #2980b9;
        }
 
        .result-section {
            width: 100%;
            margin: 25px 0;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
        }
 
        .result-title {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 15px;
            color: #3498db;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(52, 152, 219, 0.3);
        }
 
        .result-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 6px 0;
        }
 
        .result-item span:first-child {
            color: #bdc3c7;
        }
 
        .result-value {
            font-weight: bold;
            color: #ecf0f1;
        }
 
        .table-container {
            width: 100%;
            margin: 20px 0;
            overflow-x: auto;
        }
 
        .res-table {
            width: 100%;
            border-collapse: collapse;
        }
 
        .res-th, .res-td {
            padding: 10px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            min-width: 140px;
            width: auto;
        }
 
        .res-th {
            color: #3498db;
            font-weight: bold;
            position: sticky;
            top: 0;
            z-index: 10;
        }
 
        .res-tr:hover {
            background-color: #f9f9f9;
        }
 
        .scroll-indicator {
            width: 100%;
            height: 4px;
            background-color: #f1f1f1;
            margin-top: -2px;
            border-radius: 0 0 4px 4px;
        }
 
        .scroll-progress {
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            border-radius: 0 0 4px 4px;
        }
 
 
        .results-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
 
        .results-table th,
        .results-table td {
            padding: 14px;
            text-align: left;
            border-bottom: 1px solid rgba(52, 152, 219, 0.2);
        }
 
        .results-table th {
            background: rgba(52, 152, 219, 0.1);
            color: #3498db;
            font-weight: bold;
        }
 
        .results-table tr:nth-child(even) {
            background: rgba(255,255,255,0.03);
        }
 
        .results-table tr:hover {
            background: rgba(52, 152, 219, 0.05);
        }
 
        .expand-btn {
            background: none;
            border: none;
            color: #3498db;
            cursor: pointer;
            font-size: 1rem;
            text-decoration: underline;
        }
 
        .detail-row {
            display: none;
        }
 
        .detail-table {
            width: 100%;
            margin-top: 12px;
            border-collapse: collapse;
        }
 
        .detail-table th,
        .detail-table td {
            padding: 10px;
            border: 1px solid rgba(52, 152, 219, 0.2);
        }
 
        .detail-table th {
            background: rgba(52, 152, 219, 0.05);
            font-weight: normal;
            font-size: 1rem;
        }
 
        .enhancement-price {
            margin: 25px 0;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            border-radius: 10px;
        }
 
        .price-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
 
        .price-label {
            color: #bdc3c7;
            font-size: 1.05rem;
            white-space: nowrap;
        }
 
        .price-input {
            width: 100px;
            padding: 8px;
            border: 1px solid #3498db;
            border-radius: 5px;
            background: rgba(255,255,255,0.1);
            color: white;
            text-align: right;
            font-size: 1.05rem;
        }
 
        .highlight-row {
            background: rgba(46, 204, 113, 0.15) !important;
            border-left: 4px solid #2ecc71;
        }
 
        .flex-container {
            display: flex;
            gap: 25px;
            margin-bottom: 10px;
        }
 
        .flex-item {
 
            flex: 1;
        }
 
        .flex-item-large {
            flex: 2.5;
        }
 
        .control-group-inline {
            flex: 1;
            margin-right: 20px;
        }
 
        .btn-container {
            flex: 1.2;
            display: flex;
            align-items: flex-end;
        }
 
        #enhancement-simulator .refresh-icon {
            cursor: pointer;
            font-size: 18px;
            transition: all 0.2s ease;
            user-select: none;
        }
 
        /* 点击时的样式 */
        #enhancement-simulator .refresh-icon:active {
            transform: scale(0.9);
            opacity: 0.6;
            filter: brightness(0.7);
        }
 
        #enhancement-simulator .refresh-icon:hover {
            transform: rotate(15deg);
        }
 
        /* 移动端适配 - 小于768px */
        @media (max-width: 768px) {
            /* 布局调整为垂直排列 */
            .flex-container {
                flex-direction: column;
                gap: 15px;
            }
 
            .btn-container {
                margin-top: 15px;
            }
            /* 输入框和按钮宽度调整 */
            .control-input,
            .simulator-btn,
            select.control-input,
            .search-input {
                width: 100% !important;
                max-width: none !important;
                border: 1px solid #3498db;
            }
 
            /* 表格响应式处理 */
            .table-container {
                overflow-x: auto;
            }
 
            .results-table, .detail-table {
                min-width: 600px;
            }
 
            /* 工具栏和标题样式 */
            .simulator-title {
                font-size: 1.2rem;
            }
 
            .toolbar-btn {
                font-size: 1.2rem;
            }
 
            /* 结果区域样式 */
            .result-section, .enhancement-price {
                padding: 15px;
                margin: 15px 0;
            }
 
            /* 隐藏详细信息，默认只显示摘要 */
            .detail-row {
                display: none !important;
            }
 
            /* 价格输入区域样式 */
            .price-item {
                flex-wrap: wrap;
            }
 
            .price-label {
                flex-basis: 100%;
                margin-bottom: 5px;
            }
 
            .price-input {
                width: 100% !important;
                text-align: left;
            }
 
            /* 保护物品选择框样式 */
            .search-protected {
                width: 100%;
                max-width: none;
            }
        }
 
        /* 中等屏幕适配 - 768px到1024px */
        @media (min-width: 768px) and (max-width: 1024px) {
            #enhancement-simulator {
                width: 90%;
            }
 
            .flex-container {
                flex-wrap: wrap;
            }
 
            .flex-item, .flex-item-large {
                flex-basis: 100%;
            }
        }
    `);
 
 
    // 创建UI界面
    function createUI() {
        const container = document.createElement('div');
        container.id = 'enhancement-simulator';
        container.innerHTML = `
            <div class="simulator-header">
                <div class="simulator-title">摸鱼强化模拟器</div>
                <div class="toolbar">
                    <button class="toolbar-btn minimize-btn" id="minimize-simulator"></button>
                </div>
            </div>
 
            <div class="flex-container">
                <div class="control-group-inline">
                    <label class="control-label">选择物品</label>
                    <div class="search-select">
                        <input type="text" class="search-input" autocomplete="off" id="itemSearch" placeholder="搜索或选择物品" value="${id2name(selectedItem.value)}">
                        <div class="search-results" id="itemResults" >
                            ${Object.keys(itemProbabilities).map(item =>
            `<div class="search-result-item ${item === selectedItem.value ? 'selected' : ''}" data-item="${item}" >${id2name(item)}</div>`
        ).join('')}
                        </div>
                    </div>
                </div>
 
                <div class="control-group-inline">
                    <label class="control-label">强化等级</label>
                    <input type="number" class="control-input" id="enhancementLevel" value="${enhancementLevel}" min="0" max="100" step="1" style="width: 75%;">
                </div>
 
                <div class="control-group-inline">
                    <label class="control-label">幸运等级</label>
                    <input type="number" class="control-input" id="luckLevel" value="${luckLevel}" min="0" max="100" step="1" style="width: 75%;">
                </div>
 
                <div class="control-group-inline">
                    <label class="control-label">强化专家</label>
                    <input type="checkbox" id="isEnhancementExpertCheckbox" ${isEnhancementExpert ? 'checked' : ''}>
                </div>
 
                <div class="control-group-inline">
                    <label class="control-label">目标强化等级</label>
                    <select class="control-input" id="targetLevel" style="width: 75%;">
                        ${generateTargetLevelOptions()}
                    </select>
                </div>
 
                <div class="control-group-inline">
                    <label class="control-label">单次强化时间</label>
                    <input type="number" class="control-input" id="enhanceTime" value="2" min="0.1" step="0.1" style="width: 75%;">
                </div>
 
                <div class="btn-container">
                    <button class="simulator-btn btn-calculate" id="calculate-btn" style="width: 75%;">计算</button>
                </div>
            </div>
 
            <div class="flex-container" style="display: flex;">
                <div class="flex-item ">
                    <div class="enhancement-price">
                        <div class="result-title">
                        <span>材料价格及保护物品</span>
                        <span id="refresh-price-btn" class="refresh-icon">🔄</span>
                        </div>
                        <div id="priceList"></div>
                    </div>
                </div>
 
                <div class="flex-item-large">
                    <div class="result-section">
                        <div class="result-title">强化结果统计</div>
                        <div class="table-container" style="width: 880px;">
                            <table class="results-table res-table">
                                <thead id="resultsThead">
                                    <tr class="res-tr">
                                        <th class="res-th">保护等级</th>
                                        <th class="res-th">总金币</th>
                                        <th class="res-th">总次数</th>
                                        <th class="res-th">保护次数</th>
                                        <th class="res-th" >总时间(分)</th>
 
                                        <th class="res-th">详情</th>
                                    </tr>
                                </thead>
                                <tbody id="resultsBody">
                                    <!-- 结果将在这里显示 -->
                                </tbody>
                            </table>
                        </div>
                        <!--
                        <div class="scroll-indicator">
                             <div id="scrollIndicator" class="scroll-progress"></div>
                        </div>
                        -->
                    </div>
                </div>
            </div>
        `;
 
        document.body.appendChild(container);
 
        // 添加还原按钮
        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'restore-btn';
        restoreBtn.id = 'restore-simulator';
        restoreBtn.innerHTML = '↑';
        document.body.appendChild(restoreBtn);
 
        // 初始化UI
        document.getElementById('targetLevel').addEventListener('change', updatePriceList);
 
        // 物品搜索功能
        const itemSearch = document.getElementById('itemSearch');
        const itemResults = document.getElementById('itemResults');
 
        // 点击搜索框显示结果
        itemSearch.addEventListener('click', function (e) {
            e.stopPropagation();
            itemResults.style.display = 'block';
            filterItems(this.value, document.querySelectorAll('.search-result-item')); // 显示所有项目
        });
 
        // 输入搜索内容
        itemSearch.addEventListener('input', function () {
            filterItems(this.value, document.querySelectorAll('.search-result-item'));
        });
 
        // 点击选择项目
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', function () {
                selectedItem.value = this.getAttribute('data-item');
                itemInfo = itemProbabilities[selectedItem.value];
                currentProbabilities = itemInfo['pers'];
 
                // 更新目标等级下拉框
                const targetLevel = document.getElementById('targetLevel');
                targetLevel.innerHTML = generateTargetLevelOptions();
 
                // 更新价格列表
                updatePriceList();
 
                // 隐藏结果列表
                itemResults.style.display = 'none';
 
                // 更新选中状态
                document.querySelectorAll('.search-result-item').forEach(i => {
                    i.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
 
        // 点击页面其他地方关闭搜索结果
        document.addEventListener('click', function () {
            itemResults.style.display = 'none';
        });
 
        // 防止点击结果列表时关闭
        itemResults.addEventListener('click', function (e) {
            e.stopPropagation();
        });
 
        // 添加强化等级输入框事件
        document.getElementById('enhancementLevel').addEventListener('input', function () {
            enhancementLevel = parseInt(this.value) || 0;
            GM_setValue('enhancementLevel', enhancementLevel);
        });
 
        // 添加强化等级输入框事件
        document.getElementById('luckLevel').addEventListener('input', function () {
            luckLevel = parseFloat(this.value) || 0;
            GM_setValue('luckLevel', luckLevel);
        });
 
        // 添加强化专家勾选框事件
        const isEnhancementExpertCheckbox = document.getElementById('isEnhancementExpertCheckbox');
        isEnhancementExpertCheckbox.addEventListener('change', function () {
            isEnhancementExpert = this.checked;
            GM_setValue('isEnhancementExpert', isEnhancementExpert);
        });
 
        // 添加最小化事件监听器
        const minimizeBtn = document.getElementById('minimize-simulator')
        minimizeBtn.addEventListener('click', minimizeSimulator);
        minimizeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            minimizeSimulator();
        });
        // 修改还原按钮事件，只在点击时恢复，拖动时不恢复
        document.getElementById('restore-simulator').addEventListener('click', function (e) {
            // 只有当没有发生拖动时才执行恢复操作
            if (isClick) {
                restoreSimulator();
            }
            // 重置点击状态
            isClick = true;
        });
 
        // 添加计算按钮事件
        document.getElementById('calculate-btn').addEventListener('click', calculateAll);
 
        // 初始化拖动功能
        initDrag(container);
        initRestoreBtnDrag(restoreBtn); // 初始化还原按钮拖动功能
        // 为价格输入框添加实时更新
        for (let i = 0; i < prices.length; i++) {
            const inputId = `price-${i}`;
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', function () {
                    prices[i] = parseInt(this.value) || 0;
                    GM_setValue('prices', prices);
                });
            }
        }
 
        // 为价格输入框添加实时更新
        for (let i = 0; i < protectPrices.length; i++) {
            const inputId = `protectPrice-${i}`;
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', function () {
                    protectPrices[i] = parseInt(this.value) || 0;
                    GM_setValue('protectPrices', protectPrices);
                }, { passive: true });
            }
        }
 
        document.getElementById('refresh-price-btn').addEventListener('click', function () {
            updatePriceList();
        })
 
    }
 
    // 最小化模拟器
    function minimizeSimulator(e) {
 
        const container = document.getElementById('enhancement-simulator');
        const restoreBtn = document.getElementById('restore-simulator');
        const minimizeBtn = document.getElementById('minimize-simulator');
 
        // 获取最小化按钮的位置
        const minimizeBtnRect = minimizeBtn.getBoundingClientRect();
 
        // var width = minimizeBtnRect.left + window.scrollX - 20 > window.innerWidth? window.innerWidth - 20 : minimizeBtnRect.left + window.scrollX - 20;
        // var height = minimizeBtnRect.top + window.scrollY - 20 > window.innerHeight? window.innerHeight - 20 : minimizeBtnRect.top + window.scrollY - 20;
 
        // 设置还原按钮的位置为最小化按钮的位置
        restoreBtn.style.left = `${windowPosition.x}px`; // 居中调整
        restoreBtn.style.top = `${windowPosition.y}px`;  // 居中调整
 
        container.style.display = 'none';
        restoreBtn.style.display = 'flex';
 
        windowPosition.isMinimized = true;
        saveWindowState();
    }
 
    // 还原模拟器
    function restoreSimulator() {
        const container = document.getElementById('enhancement-simulator');
        const restoreBtn = document.getElementById('restore-simulator');
 
        container.style.display = 'block';
        restoreBtn.style.display = 'none';
 
        windowPosition.isMinimized = false;
        saveWindowState();
    }
 
    // 修改初始化拖动功能函数，添加触摸事件支持
    function initDrag(element) {
        const header = element.querySelector('.simulator-header');
 
        // 鼠标事件
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
 
        // 触摸事件
        header.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
 
        function startDrag(e) {
            // 阻止默认行为，防止页面滚动
            e.preventDefault();
 
            isDragging = true;
 
            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];
            offsetX = touch.clientX - element.getBoundingClientRect().left;
            offsetY = touch.clientY - element.getBoundingClientRect().top;
 
            // 提高z-index，确保拖动时在最上层
            element.style.zIndex = 10001;
        }
 
        function drag(e) {
            if (!isDragging) return;
 
            // 阻止默认行为，防止页面滚动
            e.preventDefault();
 
            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];
 
            // 计算新位置
            let newX = touch.clientX - offsetX;
            let newY = touch.clientY - offsetY;
 
            // 限制在视口内
            newX = Math.max(0, Math.min(newX, window.innerWidth - 40));
            newY = Math.max(0, Math.min(newY, window.innerHeight - 40));
 
            // 更新位置
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
 
            // 保存位置
            windowPosition.x = newX;
            windowPosition.y = newY;
        }
 
        function stopDrag() {
            if (!isDragging) return;
 
            isDragging = false;
            element.style.zIndex = 10000;
 
            // 保存窗口位置
            saveWindowState();
        }
    }
 
    // 同样修改还原按钮的拖动功能，添加触摸支持
    function initRestoreBtnDrag(element) {
        // 鼠标事件
        element.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
 
        // 触摸事件
        element.addEventListener('touchstart', startDrag, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
 
        function startDrag(e) {
            // 阻止默认行为，防止页面滚动
            e.preventDefault();
 
            isDragging = true;
 
            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];
            offsetX = touch.clientX - element.getBoundingClientRect().left;
            offsetY = touch.clientY - element.getBoundingClientRect().top;
            startX = touch.clientX;
            startY = touch.clientY;
 
            // 提高z-index，确保拖动时在最上层
            element.style.zIndex = 10002;
 
            // 阻止事件冒泡，防止触发点击事件
            e.stopPropagation();
        }
 
        function drag(e) {
            if (!isDragging) return;
 
            // 阻止默认行为，防止页面滚动
            e.preventDefault();
 
            // 获取触摸位置
            const touch = e.type.includes('mouse') ? e : e.touches[0];
 
            // 计算新位置
            let newX = touch.clientX - offsetX;
            let newY = touch.clientY - offsetY;
 
            // 限制在视口内
            newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight));
 
            // 更新位置
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto'; // 清除右侧定位
 
            // 保存还原按钮位置
            windowPosition.restoreBtnX = newX;
            windowPosition.restoreBtnY = newY;
 
            // 如果拖动距离超过阈值，则认为不是点击事件
            if (Math.abs(touch.clientX - startX) > 5 || Math.abs(touch.clientY - startY) > 5) {
                isClick = false;
            }
        }
 
        function stopDrag() {
            if (!isDragging) return;
 
            isDragging = false;
            element.style.zIndex = 10001;
 
            // 保存还原按钮位置
            saveRestoreBtnPosition();
        }
    }
 
    // 原有代码...
    // 初始化还原按钮拖动功能
    function initRestoreBtnDrag(element) {
        element.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
 
        function startDrag(e) {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            startX = e.clientX;
            startY = e.clientY;
 
            // 提高z-index，确保拖动时在最上层
            element.style.zIndex = 10002;
 
            // 阻止事件冒泡，防止触发点击事件
            e.stopPropagation();
        }
 
        function drag(e) {
            if (!isDragging) return;
 
            // 计算新位置
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
 
            // 限制在视口内
            newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight));
 
            // 更新位置
            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
            element.style.right = 'auto'; // 清除右侧定位
 
            // 保存还原按钮位置
            windowPosition.restoreBtnX = newX;
            windowPosition.restoreBtnY = newY;
 
            // 如果拖动距离超过阈值，则认为不是点击事件
            if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
                isClick = false;
            }
        }
 
        function stopDrag() {
            if (!isDragging) return;
 
            isDragging = false;
            element.style.zIndex = 10001;
 
            // 保存还原按钮位置
            saveRestoreBtnPosition();
        }
    }
 
    // 保存窗口状态
    function saveWindowState() {
        GM_setValue('windowX', windowPosition.x);
        GM_setValue('windowY', windowPosition.y);
        GM_setValue('isMinimized', windowPosition.isMinimized);
    }
 
    // 保存还原按钮位置
    function saveRestoreBtnPosition() {
        GM_setValue('restoreBtnX', windowPosition.restoreBtnX);
        GM_setValue('restoreBtnY', windowPosition.restoreBtnY);
    }
 
    // 生成目标等级选项
    function generateTargetLevelOptions() {
        const maxLevel = currentProbabilities.length || 0;
        let options = '';
 
        // 获取当前保存的目标等级
        const savedTargetLevel = GM_getValue('targetLevel', maxLevel);
        // 确保保存的等级不超过当前物品的最大等级
        const safeTargetLevel = Math.min(savedTargetLevel, maxLevel);
 
        for (let i = 1; i <= maxLevel; i++) {
            options += `<option value="${i}" ${i === safeTargetLevel ? 'selected' : ''}>${i}级</option>`;
        }
        return options;
    }
 
    // 过滤搜索结果
    function filterItems(keyword, items) {
        const lowerKeyword = keyword?.toLowerCase() || '';
 
        items.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            if (lowerKeyword === '' || itemText.includes(lowerKeyword)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
 
    // 更新价格列表，只显示到目标等级
    function updatePriceList() {
        getMarketPrice();
        let targetLevel = parseInt(document.getElementById('targetLevel').value) || 10;
        if (!targetLevel || targetLevel > itemInfo.pers.length) {
            targetLevel = itemInfo.pers.length
        }
        const priceList = document.getElementById('priceList');
        // 当前物品信息
        itemInfo = itemProbabilities[selectedItem.value];
        //材料列表
        let requires = itemInfo["requires"]
        //保护物品
        let protectes = itemInfo["protectes"]
 
        //历史选择
        let protectedItem = protectedItems[selectedItem.value]
        if (!protectedItem) {
            protectedItem = {}
            for (let i = 2; i < itemInfo.pers.length; i++) {
                protectedItem[i] = protectes[i].includes('starEssence') ? 'starEssence' : protectes[i][0]
            }
            protectedItems[selectedItem.value] = protectedItem
            GM_setValue("protectedItems", protectedItems)
        }
 
        priceList.innerHTML = '';
 
        // 强化材料
        allRequireNames = new Set();
        for (let i = 0; i < requires.length; i++) {
            requires[i].forEach(i => {
                if (i["res"]) {
                    allRequireNames.add(i["res"])
                }
            })
        }
 
        for (let protecteList of protectes) {
            for (let protecte of protecteList) {
                if (protecte) {
                    allRequireNames.add(protecte)
                }
            }
        }
 
        for (let requireName of allRequireNames) {
            let marketPrice = 0;
 
            if (miaomiaoTools) {
                marketPrice = unsafeWindow.marketPrices[unsafeWindow.itemCnEn[requireName]]?.sellOrders?.minPrice || 0
            }
            if (ms) {
                marketPrice = ms[requireName]?.sellOrders?.minPrice || 0
            }
 
            let resPrice = resPrices[requireName] || 0
            if ((marketPrice && marketPrice != resPrice) || !resPrice) {
                resPrice = marketPrice
                resPrices[requireName] = marketPrice
                GM_setValue('resPrices', resPrices);
            }
            const item = document.createElement('div');
            item.className = 'price-item';
            item.innerHTML = `
                    <span class="price-label">${id2name(requireName)}</span>
                    <input type="number" class="price-input" id="require-${requireName}" data-require="${requireName}" value="${resPrice}"  min="0" step="1">
            `;
            priceList.appendChild(item);
 
            // 为新添加的输入框添加事件监听器
            const input = document.getElementById(`require-${requireName}`);
            input.addEventListener('input', function () {
                resPrices[requireName] = parseInt(this.value) || 0;
                GM_setValue('resPrices', resPrices);
            });
 
        }
        //保护物品选择 protectes
        for (let i = 2; i < targetLevel; i++) {
            const item = document.createElement('div');
            item.className = 'price-item';
            const protecteList = protectes[i]
            item.innerHTML = `
                    <span class="price-label"   >${i}→${i + 1}保护</span>
                    <div class="search-select">
                        <input type="text" class="search-input" style="width: 140px; float:right;" autocomplete="off" id="protecte-${i}" placeholder="搜索或选择物品" value="${id2name(protectedItem[i])}">
                        <div class="search-protected" id="protecteItems-${i}" >
                            ${protecteList.map(item =>
                `<div class="search-protected-item search-protected-item-${i} ${item === protectedItem[i] ? 'selected' : ''}" data-item="${item}" >${id2name(item)}</div>`
            ).join('')}
                        </div>
                    </div>
            `;
            priceList.appendChild(item);
 
            // 物品搜索功能
            const protecteInput = document.getElementById(`protecte-${i}`);
            const protecteItems = document.getElementById(`protecteItems-${i}`);
 
            // 点击搜索框显示结果
            protecteInput.addEventListener('click', function (e) {
                e.stopPropagation();
                protecteItems.style.display = 'block';
                filterItems('', document.querySelectorAll(`.search-protected-item-${i}`)); // 显示所有项目
            });
 
            // 输入搜索内容
            protecteInput.addEventListener('input', function () {
                filterItems(this.value, document.querySelectorAll(`.search-protected-item-${i}`));
            });
 
            // 点击选择项目
            document.querySelectorAll(`.search-protected-item-${i}`).forEach(item => {
                item.addEventListener('click', function () {
                    const clickProtectedItem = this.getAttribute('data-item');
                    protecteInput.value = id2name(clickProtectedItem);
                    let protectedItem = protectedItems[selectedItem.value]
                    if (!protectedItem) {
                        protectedItem = {}
                        protectedItems[selectedItem.value] = protectedItem;
                    }
                    protectedItem[i] = clickProtectedItem || '';
                    GM_setValue('protectedItems', protectedItems);
                    // 隐藏结果列表
                    protecteItems.style.display = 'none';
                    // 更新选中状态
                    document.querySelectorAll(`.search-protected-item-${i}`).forEach(i => {
                        i.classList.remove('selected');
                    });
 
                    this.classList.add('selected');
                });
            })
 
            // 点击页面其他地方关闭搜索结果
            document.addEventListener('click', function () {
                protecteItems.style.display = 'none';
            });
 
            // 防止点击结果列表时关闭
            protecteItems.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }
 
    // 获取考虑强化等级的实际概率
    function getActualProbabilities() {
        return currentProbabilities.map((prob, index) => {
            return Math.min(1, (prob + (luckLevel - 1) * 0.002 + enhancementLevel * 0.00125) * (isEnhancementExpert ? 1.2 : 1));
        });
    }
    // 马尔可夫链计算函数
    function calculateEnhancement(p, protectLevel, targetLevel) {
        const actualProbabilities = p;
        const n = Math.min(targetLevel, actualProbabilities.length);
        const states = n + 1; // 0到n级
 
 
        // 构建状态转移矩阵
        const transitionMatrix = Array.from({ length: states }, () => new Array(states).fill(0));
 
        for (let i = 0; i < n; i++) {
            if (i === 0) {
                transitionMatrix[0][1] = actualProbabilities[0]; // 0→1成功率
                transitionMatrix[0][0] = 1 - actualProbabilities[0]; // 0级失败仍为0级
            } else if (i >= protectLevel) {
                transitionMatrix[i][i + 1] = actualProbabilities[i]; // 成功i→i+1
                transitionMatrix[i][i - 1] = 1 - actualProbabilities[i]; // 保护等级：失败降一级
            } else {
                transitionMatrix[i][i + 1] = actualProbabilities[i]; // 成功i→i+1
                transitionMatrix[i][0] = 1 - actualProbabilities[i]; // 非保护：失败回0级
            }
        }
        transitionMatrix[n][n] = 1; // 目标等级是吸收态
 
        // 计算从每个状态开始达到目标的期望尝试次数
        const E = new Array(states).fill(0);
        E[n] = 0; // 目标等级不需要尝试
 
        // 使用高斯-赛德尔迭代法求解线性方程组
        let maxIterations = 1000;
        let tolerance = 1e-6;
        let iter = 0;
        let diff = 0;
 
        do {
            diff = 0;
            for (let i = 0; i < n; i++) {
                let newE = 1; // 本次尝试
                for (let j = 0; j < states; j++) {
                    newE += transitionMatrix[i][j] * E[j];
                }
                diff = Math.max(diff, Math.abs(newE - E[i]));
                E[i] = newE;
            }
            iter++;
        } while (diff > tolerance && iter < maxIterations);
 
        // 构建基本矩阵 (I - Q)，其中Q是除吸收态外的转移矩阵
        const Q = [];
        for (let i = 0; i < states - 1; i++) {
            Q[i] = [];
            for (let j = 0; j < states - 1; j++) {
                Q[i][j] = transitionMatrix[i][j];
            }
        }
 
        // 构建单位矩阵
        const I = Array.from({ length: states - 1 }, (_, i) =>
            Array.from({ length: states - 1 }, (_, j) => i === j ? 1 : 0)
        );
 
        // 计算 (I - Q)
        const IminusQ = [];
        for (let i = 0; i < states - 1; i++) {
            IminusQ[i] = [];
            for (let j = 0; j < states - 1; j++) {
                IminusQ[i][j] = I[i][j] - Q[i][j];
            }
        }
 
        // 矩阵求逆函数
        function matrixInverse(matrix) {
            const n = matrix.length;
            const augmented = [];
 
            // 创建增广矩阵 [A | I]
            for (let i = 0; i < n; i++) {
                augmented[i] = [...matrix[i]];
                for (let j = 0; j < n; j++) {
                    augmented[i][j + n] = i === j ? 1 : 0;
                }
            }
 
            // 高斯-约旦消元法
            for (let i = 0; i < n; i++) {
                // 寻找主元
                let maxRow = i;
                for (let k = i + 1; k < n; k++) {
                    if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                        maxRow = k;
                    }
                }
 
                // 交换行
                [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
 
                // 检查矩阵是否可逆
                if (augmented[i][i] === 0) {
                    throw new Error("Matrix is singular and cannot be inverted.");
                }
 
                // 归一化主元行
                const pivot = augmented[i][i];
                for (let j = 0; j < 2 * n; j++) {
                    augmented[i][j] /= pivot;
                }
 
                // 消元
                for (let k = 0; k < n; k++) {
                    if (k !== i) {
                        const factor = augmented[k][i];
                        for (let j = 0; j < 2 * n; j++) {
                            augmented[k][j] -= factor * augmented[i][j];
                        }
                    }
                }
            }
 
            // 提取逆矩阵
            const inverse = [];
            for (let i = 0; i < n; i++) {
                inverse[i] = augmented[i].slice(n);
            }
 
            return inverse;
        }
 
        // 计算基本矩阵的逆 (I - Q)^-1
        const N = matrixInverse(IminusQ);
 
        // 计算状态访问次数
        const visits = new Array(states).fill(0);
        for (let i = 0; i < states - 1; i++) {
            visits[i] = N[0][i]; // 第一行表示从状态0开始的访问次数
        }
 
        // 计算各阶段统计数据
        const stats = [];
        let totalAttempts = 0;
        let protectedAttempts = 0;
        let totalCost = 0;
 
        const requiresMap = {}
        for (let i = 0; i < n; i++) {
            // 尝试次数 = 状态i的访问次数 × 从状态i转移出去的总概率
            let attempts;
            if (i === 0) {
                // 对于0级，直接使用访问次数作为尝试次数
                attempts = visits[i];
            } else {
                // 对于其他级别，使用原公式
                attempts = visits[i] / (1 - transitionMatrix[i][i]);
            }
            const successes = visits[i] * transitionMatrix[i][i + 1];
            const failures = visits[i] * (1 - transitionMatrix[i][i + 1]);
 
            // 计算包含保护价格的成本
            const isProtected = i >= protectLevel;
            if (i >= protectLevel) {
                let protectName = protectedItems[selectedItem.value][i]
                let protectNum = requiresMap[protectName] || 0
                requiresMap[protectName] = protectNum + attempts
            }
            //材料个数
            let requires = itemInfo['requires'][i]
            for (let require of requires) {
                let requireName = require['res']
                let requireNum = requiresMap[requireName] || 0
                requiresMap[requireName] = requireNum + require['count'] * attempts
            }
 
            stats.push({
                stage: `${i}→${i + 1}`,
                attempts: attempts,
                successes: successes,
                failures: failures,
                successRate: transitionMatrix[i][i + 1] * 100,
                isProtected: isProtected
            });
 
            totalAttempts += attempts;
 
            // 计算保护等级以上的尝试次数
            if (i >= protectLevel) {
                protectedAttempts += attempts;
            }
        }
 
        // 计算材料个数 价格
        Object.entries(requiresMap).forEach(([key, value]) => {
            totalCost += resPrices[key] * value;
        });
 
        return {
            expectedValue: E[0],
            stats: stats,
            totalAttempts: totalAttempts,
            protectedAttempts: protectedAttempts,
            requiresMap: requiresMap,
            totalCost: totalCost
        };
    }
 
    // 计算所有保护等级
    function calculateAll() {
        const enhanceTime = parseFloat(document.getElementById('enhanceTime').value) || 2;
        const targetLevel = parseInt(document.getElementById('targetLevel').value) || 10;
        const resultsBody = document.getElementById('resultsBody');
        const resultsThead = document.getElementById('resultsThead');
        resultsBody.innerHTML = '';
 
        // 保存设置
        saveSettings(enhanceTime, targetLevel);
 
        let minCost = Infinity;
        let minCostProtectLevel = -1;
        const results = [];
 
        const p = getActualProbabilities()
        // 先计算所有结果以找到最小消耗
        for (let protectLevel = 2; protectLevel <= targetLevel; protectLevel++) {
            const result = calculateEnhancement(p, protectLevel, targetLevel);
            results.push({ protectLevel, result });
 
            if (result.totalCost < minCost) {
                minCost = result.totalCost;
                minCostProtectLevel = protectLevel;
            }
 
        }
 
        //头加材料
        const tempTh = document.querySelectorAll('.temp-th')
        tempTh.forEach(th => th.remove())
        for (let require of allRequireNames) {
            const row = document.createElement('td');
            row.classList.add('res-th');
            row.classList.add('temp-th');
            row.textContent = id2name(require);
            resultsThead.firstElementChild.appendChild(row);
        }
 
        // 显示结果并高亮最小消耗
        results.forEach(({ protectLevel, result }) => {
            // 计算总时间（分钟）
            const totalTime = (result.totalAttempts * enhanceTime) / 60;
 
            const row = document.createElement('tr');
            row.className = protectLevel === minCostProtectLevel ? 'highlight-row' : '';
            row.innerHTML = `
                <td class="res-td">${protectLevel === targetLevel ? `${targetLevel}级（不保护）` : protectLevel + '级'}</td>
                <td class="res-td">${Math.round(result.totalCost).toLocaleString()}</td>
                <td class="res-td">${result.totalAttempts.toFixed(2)}</td>
                <td class="res-td">${result.protectedAttempts.toFixed(2)}</td>
                <td class="res-td">${totalTime.toFixed(2)}</td>
                <td class="res-td"><button class="expand-btn" data-protect="${protectLevel}">查看详情</button></td>
                    ${[...allRequireNames].map(item =>
                `<td class="res-td">${(result['requiresMap'][item] || 0).toFixed(2)}</td>`
            ).join('')}
            `;
            resultsBody.appendChild(row);
 
            // 添加详情行
            const detailRow = document.createElement('tr');
            detailRow.className = 'detail-row';
            detailRow.id = `detail-${protectLevel}`;
            detailRow.innerHTML = `
                <td colspan="6">
                    <div class="detail-table-container">
                        <table class="detail-table">
                            <thead>
                                <tr>
                                    <th>强化阶段</th>
                                    <th>尝试次数</th>
                                    <th>保护</th>
                                    <th>成功次数</th>
                                    <th>失败次数</th>
                                    <th>成功率(%)</th>
                                </tr>
                            </thead>
                            <tbody id="detail-body-${protectLevel}">
                                <!-- 详细数据将在这里显示 -->
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
            `;
            resultsBody.appendChild(detailRow);
 
            // 填充详细数据
            const detailBody = document.getElementById(`detail-body-${protectLevel}`);
            result.stats.forEach(stat => {
                const detailRow = document.createElement('tr');
                detailRow.innerHTML = `
                    <td>${stat.stage}</td>
                    <td>${stat.attempts.toFixed(2)}</td>
                    <td>${stat.isProtected ? '是' : '否'}</td>
                    <td>${stat.successes.toFixed(2)}</td>
                    <td>${stat.failures.toFixed(2)}</td>
                    <td>${stat.successRate.toFixed(2)}</td>
                `;
                detailBody.appendChild(detailRow);
            });
 
            //updateScrollIndicator()
        });
 
        // 添加展开/收起事件
        document.querySelectorAll('.expand-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const protectLevel = this.getAttribute('data-protect');
                const detailRow = document.getElementById(`detail-${protectLevel}`);
                const isExpanded = detailRow.style.display === 'table-row';
 
                detailRow.style.display = isExpanded ? 'none' : 'table-row';
                this.textContent = isExpanded ? '查看详情' : '收起详情';
            });
        });
 
        // 获取表格容器和滚动指示器
        const tableContainer = document.querySelector('.table-container');
        const scrollIndicator = document.getElementById('scrollIndicator');
        // 监听滚动事件
        //tableContainer.addEventListener('scroll', updateScrollIndicator);
        // 初始化
        //();
    }
 
    // 保存设置
    function saveSettings(enhanceTime, targetLevel) {
        GM_setValue('enhanceTime', enhanceTime);
        GM_setValue('targetLevel', targetLevel);
        GM_setValue('prices', prices);
        GM_setValue('selectedItem', selectedItem.value);
        GM_setValue('enhancementLevel', enhancementLevel);
    }
 
    // 加载设置
    function loadSettings() {
        miaomiaoTools = unsafeWindow.marketPrices && unsafeWindow.itemCnEn
        console.log(`强化模拟器${miaomiaoTools ? '已' : '未'}加载妙妙工具`)
 
        const enhanceTime = GM_getValue('enhanceTime', 2);
        const targetLevel = GM_getValue('targetLevel', 10);
        const savedPrices = GM_getValue('prices', null);
        const savedItem = GM_getValue('selectedItem', null);
        const savedEnhancementLevel = GM_getValue('enhancementLevel', null);
 
        document.getElementById('enhanceTime').value = enhanceTime;
        document.getElementById('targetLevel').value = targetLevel;
        document.getElementById('enhancementLevel').value = savedEnhancementLevel !== null ? savedEnhancementLevel : enhancementLevel;
 
        // 更新强化等级
        enhancementLevel = savedEnhancementLevel !== null ? savedEnhancementLevel : enhancementLevel;
 
        // 恢复保存的物品选择
        if (savedItem && itemProbabilities[savedItem]) {
            selectedItem.value = savedItem;
            itemInfo = itemProbabilities[selectedItem.value];
            currentProbabilities = itemInfo['pers'];
 
            // 更新选中状态
            document.querySelectorAll('.search-result-item').forEach(item => {
                if (item.getAttribute('data-item') === selectedItem.value) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }
 
        // 恢复保存的价格
        if (savedPrices && savedPrices.length === prices.length) {
            prices = savedPrices;
        }
 
        // 更新价格列表显示
        updatePriceList();
 
        // 恢复还原按钮位置
        const restoreBtn = document.getElementById('restore-simulator');
        const restoreBtnX = GM_getValue('restoreBtnX', null);
        const restoreBtnY = GM_getValue('restoreBtnY', null);
 
        if (restoreBtnX !== null && restoreBtnY !== null) {
            restoreBtn.style.left = `${restoreBtnX}px`;
            restoreBtn.style.top = `${restoreBtnY}px`;
            restoreBtn.style.right = 'auto'; // 清除右侧定位
        }
    }
 
    async function simulatorInit() {
        const enhanceInfo = await waitFor('tAllEnhanceInfo');
        allGameResource = await waitFor('tAllGameResource');
        itemProbabilities = processEnhanceInfo(enhanceInfo);
        enhancementLevel = parseInt(GM_getValue('enhancementLevel', 0));
        luckLevel = parseInt(GM_getValue('luckLevel', 0));
        isEnhancementExpert = GM_getValue('isEnhancementExpert', false);
        resPrices = GM_getValue('resPrices', {});
        protectedItems = GM_getValue('protectedItems', {});
        itemInfo = itemProbabilities[selectedItem.value];
        currentProbabilities = itemInfo.pers;
        createUI();
        getMarketPrice();
        loadSettings();
    }
 
    // 页面加载完成后创建UI
    window.addEventListener('load', function () {
        // 延迟创建以确保页面完全加载
        setTimeout(simulatorInit, 1000);
    });
})();