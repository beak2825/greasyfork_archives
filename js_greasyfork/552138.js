// ==UserScript==
// @name         Wargaming商店货币转换器
// @namespace    http://tampermonkey.net/
// @version      3.6.7
// @description  Wargaming商店货币转换，悬浮汇率以及折扣显示
// @author       SundayRX
// @match        https://wargaming.net/shop/*
// @grant        GM_xmlhttpRequest
// @connect      api.exchangerate-api.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552138/Wargaming%E5%95%86%E5%BA%97%E8%B4%A7%E5%B8%81%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552138/Wargaming%E5%95%86%E5%BA%97%E8%B4%A7%E5%B8%81%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        discount: 0.87,
        highlightStyle: `
            .currency-conversion {
                background-color: #ffffcc;
                border-radius: 3px;
                padding: 2px 4px;
                margin-left: 5px;
                font-weight: bold;
                font-size: 0.9em;
                color: #d32f2f;
                display: inline-block;
            }
            .currency-processed {
                display: inline-flex;
                align-items: center;
            }
            #currency-float-panel {
                position: fixed !important;
                left: 20px !important; /* 改为左侧距离 */
                bottom: 20px !important; /* 改为底部距离（左下角核心） */
                /* 移除top和transform，避免垂直居中 */
                background-color: rgba(30, 30, 30, 0.98) !important;
                color: #fff !important;
                padding: 15px !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
                z-index: 9999999 !important;
                width: 220px !important;
                font-size: 14px !important;
                line-height: 1.6 !important;
                border: 1px solid #555 !important;
                margin: 0 !important;
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
                overflow: visible !important;
            }
            #currency-float-panel.hidden {
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
            #currency-float-panel .panel-title {
                font-weight: bold !important;
                margin-bottom: 8px !important;
                padding-bottom: 5px !important;
                border-bottom: 1px dashed #666 !important;
                color: #fff !important;
                font-size: 15px !important;
            }
            #currency-float-panel .rate-source {
                display: inline-flex !important; /* 改为inline-flex，支持垂直居中 */
                align-items: center !important; /* 内部内容垂直居中 */
                justify-content: center !important; /* 内部内容水平居中 */
                margin-top: 0 !important; /* 清除原margin-top，避免向上偏移 */
                margin-bottom: 0 !important;
                padding: 2px 6px !important; /* 微调内边距，与右侧元素垂直平齐 */
                border-radius: 4px !important; /* 核心：添加圆角，值可根据需求调整（如3px/5px） */
                font-size: 12px !important;
                background-color: #2196F3 !important;
                color: #fff !important;
            }
            #currency-float-panel .rate-source.fallback {
                background-color: #FF9800 !important;
                border-radius: 4px !important; /* 核心：添加圆角，值可根据需求调整（如3px/5px） */
            }
            #currency-float-panel .loading {
                color: #ccc !important;
                font-style: italic !important;
            }
            #currency-float-panel .panel-row {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin: 5px 0 !important;
            }
            #currency-float-panel .discount-text {
                color: #4CAF50 !important;
                font-weight: bold !important;
            }
            #currency-float-panel .rate-change {
                font-weight: 900 !important;
                font-size: 16px !important;
                margin: 0 !important;
                line-height: 1 !important; /* 箭头行高设为1，避免因字体大导致向上偏移 */
                vertical-align: middle !important; /* 额外保险：基于文本基线居中 */
            }
            .rate-change.up {
                color: #F44336 !important;
            }
            .rate-change.equal {
                color: #9E9E9E !important;
            }
            .rate-change.down {
                color: #4CAF50 !important;
            }
            #currency-float-panel .rate-row {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important; /* 强制整体垂直居中 */
                margin-top: 5px !important;
                line-height: 1.4 !important; /* 统一行高，避免文本偏移 */
            }
            #currency-float-panel .rate-right {
                display: flex !important;
                align-items: center !important; /* 强制数值与箭头垂直居中 */
                gap: 6px !important; /* 缩小间距，避免分散 */
                line-height: 1.4 !important; /* 与主容器行高统一 */
                font-size: 14px !important; /* 明确字体大小，避免与箭头差异 */
            }
        `,
    };

    class Currency {
        constructor(Type, ExchangeRateAPI, ExchangeRateFallBack, MatchRegex, Symbol = null) {
            this.Type = Type;
            this.ExchangeRateAPI = ExchangeRateAPI;
            this.ExchangeRateRemote = null;
            this.ExchangeRateFallBack = this.validateRate(ExchangeRateFallBack, false);
            this.MatchRegex = MatchRegex;
            this.Symbol = Symbol;
            this.requestStatus = 'idle'; // idle/pending/done
            this.pendingElements = [];
            console.log(`[Currency初始化] ${this.Type} 备用汇率: ${this.ExchangeRateFallBack}`);
        }

        validateRate(rate, isRemote = false) {
            if (typeof rate === 'number' && !isNaN(rate) && rate > 0) {
                return rate;
            }
            if (isRemote) {
                console.warn(`[${this.Type}] 远程汇率无效（值: ${rate}），将使用备用汇率`);
                return null;
            } else {
                console.warn(`[${this.Type}] 备用汇率无效（值: ${rate}），兜底为1`);
                return 1;
            }
        }

        fetchExchangeRate() {
            if (this.requestStatus !== 'idle') {
                console.log(`[${this.Type}] 跳过重复请求（当前状态: ${this.requestStatus}）`);
                return;
            }
            this.requestStatus = 'pending';
            console.log(`[${this.Type}] 开始请求汇率 API: ${this.ExchangeRateAPI}`);
            updateFloatPanel(this);

            // 超时保护：5秒未响应则强制结束请求
            const timeoutId = setTimeout(() => {
                console.error(`[${this.Type}] 汇率请求超时（5秒）`);
                this.requestStatus = 'done';
                this.triggerPendingElements();
                updateFloatPanel(this);
            }, 5000);

            GM_xmlhttpRequest({
                method: 'GET',
                url: this.ExchangeRateAPI,
                onload: (response) => {
                    clearTimeout(timeoutId); // 清除超时
                    console.log(`[${this.Type}] API响应状态: ${response.status}`);
                    try {

                        // 关键：检查API响应结构是否正确（exchangerate-api的正确结构）
                        if (response.status !== 200) {
                            console.error(`[${this.Type}] API返回失败: ${data.result || '未知错误'}`);
                            this.requestStatus = 'done';
                            this.triggerPendingElements();
                            updateFloatPanel(this);
                            return;
                        }
                        const data = JSON.parse(response.responseText);
                        const remoteRate = this.validateRate(data.rates?.CNY, true);
                        if (remoteRate) {
                            this.ExchangeRateRemote = remoteRate;
                            console.log(`[${this.Type}] 远程汇率有效: ${remoteRate}`);
                        }

                    } catch (e) {
                        console.error(`[${this.Type}] 解析响应失败:`, e);
                    } finally {
                        this.requestStatus = 'done';
                        this.triggerPendingElements();
                        updateFloatPanel(this);
                    }
                },
                onerror: (error) => {
                    clearTimeout(timeoutId); // 清除超时
                    console.error(`[${this.Type}] 请求失败:`, error);
                    this.requestStatus = 'done';
                    this.triggerPendingElements();
                    updateFloatPanel(this);
                }
            });
        }

        getFinalRate() {
            const rate = this.ExchangeRateRemote ?? this.ExchangeRateFallBack;
            console.log(`[${this.Type}] 最终使用汇率: ${rate}`);
            return rate;
        }

        getRateSource() {
            return this.ExchangeRateRemote ? '实时汇率' : '备用汇率';
        }

        addPendingElement(element) {
            if (!this.pendingElements.includes(element) && !element.classList.contains('currency-processed')) {
                this.pendingElements.push(element);
                console.log(`[${this.Type}] 暂存元素（累计: ${this.pendingElements.length}）`);
            }
        }

        triggerPendingElements() {
            console.log(`[${this.Type}] 开始处理暂存元素（数量: ${this.pendingElements.length}）`);
            this.pendingElements.forEach(element => {
                if (!element.isConnected) {
                    console.log(`[${this.Type}] 元素已被移除，跳过`);
                    return;
                }
                if (element.classList.contains('currency-processed')) {
                    console.log(`[${this.Type}] 元素已处理，跳过`);
                    return;
                }
                ProcessPriceElement(element, this.Type);
            });
            this.pendingElements = [];
        }
    }

    let CurrencyDict = [
        new Currency('ARS', 'https://api.exchangerate-api.com/v4/latest/ARS', 0.005, /([\d,]+(?:\.\d+)?)\s*(ARS)/i),//阿根廷
        new Currency('SGD', 'https://api.exchangerate-api.com/v4/latest/SGD', 5.500, /([\d,]+(?:\.\d+)?)\s*(SGD)/i),//新加坡 土耳其
        new Currency('HKD', 'https://api.exchangerate-api.com/v4/latest/HKD', 0.916, /([\d,]+(?:\.\d+)?)\s*(HKD)/i),//中国香港
        new Currency('TWD', 'https://api.exchangerate-api.com/v4/latest/TWD', 0.233, /([\d,]+(?:\.\d+)?)\s*(TWD)/i),//中国台湾
        new Currency('MOP', 'https://api.exchangerate-api.com/v4/latest/MOP', 0.891, /([\d,]+(?:\.\d+)?)\s*(MOP)/i),//中国澳门
        new Currency('CNY', 'https://api.exchangerate-api.com/v4/latest/CNY', 1.000, null, 'CNY'),//中国大陆
        new Currency('EUR', 'https://api.exchangerate-api.com/v4/latest/EUR', 8.260, null, 'EUR'),//欧盟地区(德国 俄罗斯)
        new Currency('USD', 'https://api.exchangerate-api.com/v4/latest/USD', 7.200, null, 'USD'),//美国
        new Currency('CAD', 'https://api.exchangerate-api.com/v4/latest/CAD', 5.000, null, 'CAD'),//加拿大
        new Currency('GBP', 'https://api.exchangerate-api.com/v4/latest/GBP', 9.500, null, 'GBP'),//英国
        new Currency('AUD', 'https://api.exchangerate-api.com/v4/latest/AUD', 4.650, null, 'AUD'),//澳洲
        new Currency('JPY', 'https://api.exchangerate-api.com/v4/latest/JPY', 0.050, null, 'JPY'),//日本

    ];

    let currentActiveCurrency = null;
    let isProcessing = false;
    let observer = null;
    let processedElements = new Set();
    let floatPanel = null;


    function createFloatPanel() {
        if (floatPanel) return;

        floatPanel = document.createElement('div');
        floatPanel.id = 'currency-float-panel';
        floatPanel.className = 'hidden';
        floatPanel.innerHTML = `
            <div class="panel-title">WG商店货币转换器(SundayRX)</div>
            <div class="panel-content"><span class="loading">加载中...</span></div>
        `;
        document.body.appendChild(floatPanel);
        console.log('[悬浮窗] 已创建右侧面板');

        // 防移除监听
        const panelObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.removedNodes.forEach(node => {
                    if (node.id === 'currency-float-panel') {
                        console.warn('[悬浮窗] 被移除，重建中...');
                        floatPanel = null;
                        createFloatPanel();
                        if (currentActiveCurrency) updateFloatPanel(currentActiveCurrency);
                    }
                });
            });
        });
        panelObserver.observe(document.body, { childList: true, subtree: true });

        // 样式保护
        setInterval(() => {
            if (!floatPanel) return;
            floatPanel.style.position = 'fixed';
            floatPanel.style.left = '20px';
            floatPanel.style.bottom = '20px';
            floatPanel.style.zIndex = '9999999';
        }, 300);
    }

    function updateFloatPanel(currency) {
        if (!floatPanel) createFloatPanel();

        if (!currency && currentActiveCurrency) {
            currency = currentActiveCurrency;
        }

        if (!currency) {
            floatPanel.classList.add('hidden');
            floatPanel.querySelector('.panel-content').innerHTML = '<span class="loading">无目标货币</span>';
            return;
        }

        floatPanel.classList.remove('hidden');
        const contentEl = floatPanel.querySelector('.panel-content');
        const finalRate = currency.getFinalRate();
        const rateSource = currency.getRateSource();
        const sourceClass = rateSource === '实时汇率' ? 'rate-source' : 'rate-source fallback';
        const discountPercent = `${(CONFIG.discount * 100).toFixed(0)}%`;

        // 涨跌箭头逻辑保持不变
        let rateChangeHtml = '';
        if (currency.ExchangeRateRemote) {
            const backupRate = currency.ExchangeRateFallBack;
            const realRate = currency.ExchangeRateRemote;
            const realRateFixed = parseFloat(realRate.toFixed(4));
            const backupRateFixed = parseFloat(backupRate.toFixed(4));

            if (realRateFixed > backupRateFixed) {
                rateChangeHtml = '<span class="rate-change up">↑</span>';
            } else if (realRateFixed === backupRateFixed) {
                rateChangeHtml = '<span class="rate-change equal">-</span>';
            } else {
                rateChangeHtml = '<span class="rate-change down">↓</span>';
            }
        }

        if (currency.requestStatus === 'pending') {
            // 加载中状态布局不变
            contentEl.innerHTML = `
                <div class="panel-row">
                    <div>商店货币：${currency.Type}</div>
                    <div class="discount-text">折扣：${discountPercent}</div>
                </div>
                <div class="loading">汇率获取中...</div>
            `;
        } else {
            const formattedRate = FormatRate(finalRate);
            contentEl.innerHTML = `
                <div class="panel-row">
                    <div>商店货币：${currency.Type}</div>
                    <div class="discount-text">折扣：${discountPercent}</div>
                </div>
                <div class="rate-row">
                    <span class="${sourceClass}">${rateSource}</span>
                    <div class="rate-right">
                        <span class="rate-text">1 ${currency.Type} = ${formattedRate} CNY</span>
                        ${rateChangeHtml}
                    </div>
                </div>
            `;
        }
    }

    function FormatRate(rate) {
        // 处理0值特殊情况
        if (rate === 0) return '0';

        // 转换为字符串，避免科学计数法（针对极小值）
        let rateStr = rate.toString();
        // 若包含科学计数法（如1e-5），转换为普通字符串
        if (rateStr.includes('e')) {
            const parts = rateStr.split('e');
            const base = parseFloat(parts[0]);
            const exponent = parseInt(parts[1], 10);
            // 处理负指数（小数）
            if (exponent < 0) {
                rateStr = '0.' + '0'.repeat(-exponent - 1) + base.toString().replace('.', '');
            }
        }

        // 分离整数和小数部分
        const [integerPart, decimalPart] = rateStr.split('.').concat(''); // 确保小数部分存在（空字符串）

        // 情况1：无小数部分（整数）
        if (!decimalPart) return integerPart;

        // 情况2：有小数部分，处理尾随零
        const trimmedDecimal = decimalPart.replace(/0+$/, ''); // 去掉末尾所有零
        if (!trimmedDecimal) return integerPart; // 若小数部分全是零，只返回整数

        // 情况3：根据数值大小动态调整显示位数
        const absRate = Math.abs(rate);
        let maxDecimalDigits;

        if (absRate >= 1) {
            // 大汇率（如USD 7.14）：最多保留4位，最少保留2位（避免1位小数）
            maxDecimalDigits = Math.max(2, Math.min(4, trimmedDecimal.length));
        } else if (absRate >= 0.01) {
            // 中等小数（如0.52）：最多保留4位
            maxDecimalDigits = 4;
        } else {
            // 极小汇率（如ARS 0.00525）：找到第一个非零数字后保留4位有效数字
            const firstNonZeroIndex = trimmedDecimal.search(/[1-9]/);
            if (firstNonZeroIndex === -1) return '0'; // 理论上不会触发
            // 第一个非零数字位置 + 4位有效数字
            maxDecimalDigits = firstNonZeroIndex + 5; // +5是因为索引从0开始
        }

        // 截取有效位数（不超过实际小数长度）
        const finalDecimal = trimmedDecimal.slice(0, Math.min(maxDecimalDigits, trimmedDecimal.length));
        return `${integerPart}.${finalDecimal}`;
    }
    function init() {
        console.log('=== WG商店货币转换器-初始化开始 ===');
        AddStyles();
        createFloatPanel();
        ConvertPageCurrencyValues();
        ObserveDOMChanges();
        console.log('=== WG商店货币转换器-初始化完成 ===');
    }

    function AddStyles() {
        const style = document.createElement('style');
        style.textContent = CONFIG.highlightStyle;
        document.head.insertBefore(style, document.head.firstChild);
        console.log('=== WG商店货币转换器-样式已添加 ===');
    }

    function ExtractCurrencyInfo(element) {
        if (processedElements.has(element) || element.closest('#currency-float-panel')) {
            return [null, null, null];
        }

        const priceWrap = element.querySelector('.product-price_wrap');
        const text = priceWrap ? priceWrap.textContent.trim() : element.textContent.trim();
        console.log(`[提取信息] 元素文本: ${text.substring(0, 50)}...`); // 限制长度，避免日志过长

        // 1. 处理Symbol类型（如EUR/USD）
        const currencyCodeEl = element.querySelector('.currency-code');
        if (currencyCodeEl) {
            const title = currencyCodeEl.getAttribute('title')?.trim();
            console.log(`[提取信息] 找到.currency-code，title: ${title}`);
            if (title) {
                const targetCurrency = CurrencyDict.find(c => c.Symbol === title);
                if (targetCurrency) {
                    const priceMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/);
                    console.log(`[提取信息] 价格匹配: ${priceMatch?.[1] || '无'}`);
                    if (priceMatch) {
                        const numericValue = parseFloat(priceMatch[1].replace(/,/g, ''));
                        if (!isNaN(numericValue)) {
                            console.log(`[提取成功] ${title} 数值: ${numericValue}`);
                            currentActiveCurrency = targetCurrency;
                            return [numericValue, title, targetCurrency];
                        }
                    }
                }
            }
        }

        // 2. 处理正则匹配类型（如ARS）
        for (let currency of CurrencyDict) {
            if (!currency.MatchRegex) continue;
            const match = text.match(currency.MatchRegex);
            if (match && match[1]) {
                console.log(`[提取信息] 正则匹配 ${currency.Type}: ${match[1]}`);
                const numericValue = parseFloat(match[1].replace(/,/g, ''));
                if (!isNaN(numericValue)) {
                    console.log(`[提取成功] ${currency.Type} 数值: ${numericValue}`);
                    currentActiveCurrency = currency;
                    return [numericValue, currency.Type, currency];
                }
            }
        }

        console.log(`[提取失败] 元素不含目标货币`);
        return [null, null, null];
    }

    function FindPriceElements() {
        const validElements = [];
        const allPriceEls = document.querySelectorAll('.product-price:not(.currency-processed)');
        console.log(`[查找元素] 找到${allPriceEls.length}个未处理.product-price`);

        allPriceEls.forEach(el => {
            const [_, __, targetCurrency] = ExtractCurrencyInfo(el);
            if (targetCurrency && !processedElements.has(el)) {
                validElements.push(el);
                console.log(`[查找元素] 加入有效元素列表`);
            }
        });

        console.log(`[查找元素] 有效元素总数: ${validElements.length}`);
        return validElements;
    }

    function FormatCurrency(value, currencyType) {
        const targetCurrency = CurrencyDict.find(c => c.Type === currencyType);
        if (!targetCurrency) {
            console.warn(`[格式化] 未知货币类型: ${currencyType}`);
            return `${value.toFixed(2)} (未知货币)`;
        }

        const finalRate = targetCurrency.getFinalRate();
        const originalCNY = (value * finalRate).toFixed(2);
        const discountedCNY = (originalCNY * CONFIG.discount).toFixed(2);
        console.log(`[格式化] ${value} ${currencyType} → 原始: ${originalCNY} CNY, 折扣后: ${discountedCNY} CNY`);
        return `${originalCNY} (${discountedCNY}) CNY`;
    }

    function ProcessPriceElement(element, currencyType) {
        if (element.classList.contains('currency-processed') || processedElements.has(element)) {
            console.log(`[处理元素] 已处理，跳过`);
            return;
        }

        const [priceValue, _, targetCurrency] = ExtractCurrencyInfo(element);
        if (!priceValue || !targetCurrency) {
            console.log(`[处理元素] 无效价格或货币，跳过`);
            return;
        }

        try {
            const formattedCNY = FormatCurrency(priceValue, currencyType);
            const conversionEl = document.createElement('span');
            conversionEl.className = 'currency-conversion';
            conversionEl.textContent = `≈${formattedCNY}`;
            console.log(`[处理元素] 生成转换标签: ${conversionEl.textContent}`);

            // 兼容多种插入位置，确保能插入
            let insertPoint = element.querySelector('.product-price_wrap')
                || element.querySelector('.price-wrap')
                || element.querySelector('.price')
                || element; // 最后 fallback 到元素自身

            insertPoint.appendChild(conversionEl);
            console.log(`[处理元素] 标签已插入到:`, insertPoint);

            element.classList.add('currency-processed');
            processedElements.add(element);
        } catch (e) {
            console.error(`[处理元素] 插入失败:`, e);
        }
    }

        function ConvertPageCurrencyValues() {
        if (isProcessing) {
            console.log(`[转换流程] 正在处理中，跳过`);
            return;
        }
        isProcessing = true;
        console.log(`=== 开始转换页面货币 ===`);

        if (observer) observer.disconnect();
        const validElements = FindPriceElements();

        // 无新元素，只要有活跃货币，就更新悬浮窗（不隐藏）
        if (validElements.length === 0) {
            console.log(`[转换流程] 无新元素，但保留活跃货币`);
            updateFloatPanel(currentActiveCurrency); // 用当前活跃货币更新，而非null
            isProcessing = false;
            if (observer) observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        // （货币分组处理逻辑保持不变）
        const currencyGroups = {};
        validElements.forEach(el => {
            const [_, currencyType, targetCurrency] = ExtractCurrencyInfo(el);
            if (targetCurrency) {
                if (!currencyGroups[currencyType]) {
                    currencyGroups[currencyType] = { currency: targetCurrency, elements: [] };
                }
                currencyGroups[currencyType].elements.push(el);
            }
        });

        Object.values(currencyGroups).forEach(group => {
            const { currency, elements } = group;
            switch (currency.requestStatus) {
                case 'idle':
                    elements.forEach(el => currency.addPendingElement(el));
                    currency.fetchExchangeRate();
                    break;
                case 'pending':
                    elements.forEach(el => currency.addPendingElement(el));
                    updateFloatPanel(currency);
                    break;
                case 'done':
                    elements.forEach(el => ProcessPriceElement(el, currency.Type));
                    updateFloatPanel(currency);
                    break;
            }
        });

        if (observer) {
            observer.observe(document.body, { childList: true, subtree: true });
        }
        isProcessing = false;
        console.log(`=== 转换流程结束 ===`);
    }

    function ObserveDOMChanges() {
        observer = new MutationObserver(mutations => {
            let hasValidNewElement = false;
            mutations.forEach(mutation => {
                if (mutation.type !== 'childList') return;
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE || node.id === 'currency-float-panel') return;

                    const [_, __, targetCurrency] = ExtractCurrencyInfo(node);
                    const hasChildValidEl = !!node.querySelector('.product-price:not(.currency-processed)')
                        && ExtractCurrencyInfo(node.querySelector('.product-price:not(.currency-processed)'))[2];

                    if (targetCurrency || hasChildValidEl) {
                        hasValidNewElement = true;
                        if (targetCurrency) currentActiveCurrency = targetCurrency;
                        console.log(`[DOM监听] 检测到新增有效元素`);
                    }
                });
            });

            if (hasValidNewElement && !isProcessing) {
                console.log(`[DOM监听] 触发延迟转换`);
                clearTimeout(window.currencyConversionTimeout);
                window.currencyConversionTimeout = setTimeout(ConvertPageCurrencyValues, 500);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log(`[DOM监听] 已开启`);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();