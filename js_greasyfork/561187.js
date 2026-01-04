// ==UserScript==
// @name         Steam之神 - 白嫖所有游戏 | 汇率自动转换 | 创意工坊增强 🚀
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  商店页与创意工坊增强：设置面板、下载清单、工坊分页与信息表前置。感谢 ManifestHub 开源作者，禁止倒卖狗。
// @author       Eachann
// @match        https://steamcommunity.com/id/*/myworkshopfiles/*
// @match        https://steamcommunity.com/profiles/*/myworkshopfiles/*
// @match        https://store.steampowered.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561187/Steam%E4%B9%8B%E7%A5%9E%20-%20%E7%99%BD%E5%AB%96%E6%89%80%E6%9C%89%E6%B8%B8%E6%88%8F%20%7C%20%E6%B1%87%E7%8E%87%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%20%7C%20%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E5%A2%9E%E5%BC%BA%20%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/561187/Steam%E4%B9%8B%E7%A5%9E%20-%20%E7%99%BD%E5%AB%96%E6%89%80%E6%9C%89%E6%B8%B8%E6%88%8F%20%7C%20%E6%B1%87%E7%8E%87%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2%20%7C%20%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E5%A2%9E%E5%BC%BA%20%F0%9F%9A%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎮 Steam 之神脚本已启动！');

    const SETTINGS_KEY = 'steam_god_settings_v1';
    const DEFAULT_SETTINGS = {
        workshopNumPerPage: 30,
        showWorkshopInfoPanel: true,
        enableManifestDownload: true,
        enableCurrencyConverter: true
    };

    function loadSettings() {
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            if (!raw) {
                return { ...DEFAULT_SETTINGS };
            }
            return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
        } catch (error) {
            return { ...DEFAULT_SETTINGS };
        }
    }

    function saveSettings(next) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    }

    function isStoreAppPage() {
        return /store\.steampowered\.com\/app\/\d+/.test(window.location.href);
    }

    /**
     * 检查当前URL是否为Steam创意工坊页面 🔍
     */
    function isSteamWorkshopPage() {
        const currentUrl = window.location.href;
        const workshopPatterns = [
            /steamcommunity\.com\/.*\/myworkshopfiles/,
            /steamcommunity\.com\/workshop\/browse/,
            /steamcommunity\.com\/app\/.*\/workshop/,
            /steamcommunity\.com\/sharedfiles\/browse/
        ];

        return workshopPatterns.some(pattern => pattern.test(currentUrl));
    }

    /**
     * 修改URL参数，设置numperpage=30 ⚙️
     */
    function updateNumPerPageParam(settings) {
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;
        const targetNum = String(settings.workshopNumPerPage || 30);

        // 检查是否已经是30页
        const currentNumPerPage = params.get('numperpage');
        if (currentNumPerPage === targetNum) {
            console.log('✅ 已经是目标分页显示，无需修改');
            return false;
        }

        // 设置或更新numperpage参数为30
        params.set('numperpage', targetNum);

        // 构建新的URL
        const newUrl = currentUrl.toString();

        console.log('🔄 正在将页面显示数量修改为30...');
        console.log('原URL:', window.location.href);
        console.log('新URL:', newUrl);

        return newUrl;
    }

    /**
     * 执行页面重定向 🚀
     */
    function redirectToNewUrl(newUrl) {
        if (newUrl && newUrl !== window.location.href) {
            console.log('🎯 正在重定向到30页显示模式...');
            window.location.replace(newUrl);
            return true;
        }
        return false;
    }

    /**
     * 检查是否为创意工坊首页 (不应自动添加 numperpage)
     */
    function isWorkshopHomePage() {
        const path = window.location.pathname;
        return /\/app\/\d+\/workshop\/?$/.test(path);
    }

    /**
     * 主要处理函数 🎮
     */
    function processWorkshopPage(settings) {
        // 检查是否为创意工坊页面
        if (!isSteamWorkshopPage()) {
            console.log('❌ 不是Steam创意工坊页面，脚本未执行');
            return;
        }

        console.log('🎪 检测到Steam创意工坊页面！');

        // 如果是首页，不强制添加分页参数
        if (isWorkshopHomePage()) {
            console.log('🏠 创意工坊首页，跳过自动分页参数拼接');
            return;
        }

        // 更新URL参数
        const newUrl = updateNumPerPageParam(settings);

        // 如果需要重定向，则执行重定向
        if (newUrl) {
            redirectToNewUrl(newUrl);
        } else {
            console.log('🎉 页面已经是最佳显示状态！');

            // 添加视觉提示
            addSuccessIndicator(settings);
        }
    }

    // --- 汇率转换模块 ---
    const CurrencyConverter = {
        CACHE_KEY: 'steam_god_rates_v1',
        API_URL: 'https://open.er-api.com/v6/latest/CNY', // 以 CNY 为基准
        RATE_EXPIRY: 24 * 60 * 60 * 1000, // 24小时

        async init() {
            try {
                const rates = await this.getRates();
                if (rates) {
                    this.convertPrices(rates);
                    this.observeMutations(rates);
                }
            } catch (e) {
                console.error('💸 汇率模块初始化失败:', e);
            }
        },

        getRates() {
            return new Promise((resolve) => {
                const cached = localStorage.getItem(this.CACHE_KEY);
                if (cached) {
                    const data = JSON.parse(cached);
                    if (Date.now() - data.timestamp < this.RATE_EXPIRY) {
                        resolve(data.rates);
                        return;
                    }
                }

                console.log('🔄正在获取最新汇率...');
                
                // 使用 GM_xmlhttpRequest 绕过 CSP
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: this.API_URL,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data && data.rates) {
                                    // 我们需要的是 外币 -> CNY 的汇率
                                    // API 返回的是 1 CNY = X 外币
                                    // 所以 1 外币 = 1 / X CNY
                                    const rates = {};
                                    for (const [currency, rate] of Object.entries(data.rates)) {
                                        rates[currency] = 1 / rate;
                                    }
                                    localStorage.setItem(this.CACHE_KEY, JSON.stringify({
                                        timestamp: Date.now(),
                                        rates: rates
                                    }));
                                    resolve(rates);
                                } else {
                                    resolve(null);
                                }
                            } catch (e) {
                                console.error('❌ 解析汇率数据失败:', e);
                                resolve(null);
                            }
                        },
                        onerror: (err) => {
                            console.error('❌ 请求汇率接口失败:', err);
                            resolve(null);
                        }
                    });
                } else {
                    console.error('❌ GM_xmlhttpRequest 未定义，无法绕过 CSP 获取汇率');
                    resolve(null);
                }
            });
        },

        parsePrice(text) {
            const cleanText = text.trim();
            
            // 如果已经是人民币 (¥ 且包含小数点通常是 CNY，或者有 CNY 字样)，跳过
            // Steam 上日元 (JPY) 通常写作 ¥ 1200 (无小数)，人民币写作 ¥ 12.00
            // 如果只有 ¥ 且我们无法区分，保守起见如果是中文环境通常是 CNY。
            // 但为了支持 JPY，我们可以看是否有 JPY 字样，或者依靠汇率数值差异巨大来判断？不，这里简单过滤
            if (cleanText.includes('CNY') || (cleanText.includes('¥') && cleanText.includes('.'))) {
                return null; 
            }

            // 1. 定义映射表 (符号/缩写 -> ISO 代码)
            // 按照长度排序会在逻辑中处理，这里列出常见的
            const currencyMap = {
                'CDN$': 'CAD', 'Mex$': 'MXN', 'A$': 'AUD', 'NT$': 'TWD', 'HK$': 'HKD',
                'NZ$': 'NZD', 'R$': 'BRL', 'S$': 'SGD', 'ARS$': 'ARS', 'CLP$': 'CLP',
                'COL$': 'COP', 'UYU$': 'UYU',
                '€': 'EUR', '£': 'GBP', '$': 'USD', 'USD': 'USD',
                '¥': 'JPY', 'JPY': 'JPY', // 假设没有小数点的 ¥ 是 JPY
                'KRW': 'KRW', '₩': 'KRW', 
                'RUB': 'RUB', 'pуб.': 'RUB', 'py6': 'RUB',
                '₹': 'INR', 'Rs': 'INR',
                'RM': 'MYR', 'Rp': 'IDR', '฿': 'THB', '₫': 'VND',
                'PHP': 'PHP', 'S/.': 'PEN', 'SR': 'SAR', 'AED': 'AED',
                'TL': 'TRY', 'TRY': 'TRY',
                'KZT': 'KZT', 'UAH': 'UAH', '₴': 'UAH',
                'ZAR': 'ZAR', 'Q': 'GTQ', 'L': 'HNL', '₡': 'CRC',
                'CHF': 'CHF', 'PLN': 'PLN', 'zł': 'PLN'
            };

            // 2. 将键按长度降序排序，防止 $ 匹配到 CDN$
            const keys = Object.keys(currencyMap).sort((a, b) => b.length - a.length);

            let detectedCode = null;

            // 3. 遍历匹配
            for (const key of keys) {
                if (cleanText.includes(key)) {
                    // 特殊情况：如果是 $，必须确保它不是 ARS$ 等的后缀（虽然长度排序解决了大部分，但双重保险）
                    // 比如 "ARS$ 100" -> 匹配 ARS$ 成功，循环 break
                    detectedCode = currencyMap[key];
                    break; 
                }
            }

            // 4. 如果没匹配到符号，尝试正则匹配 3位大写 ISO 代码 (e.g. KWD, IQD)
            if (!detectedCode) {
                const isoMatch = cleanText.match(/\b([A-Z]{3})\b/);
                if (isoMatch) {
                    detectedCode = isoMatch[1];
                }
            }

            if (detectedCode) {
                // 提取数字
                const val = this.extractNumber(cleanText);
                if (val > 0) {
                     // 再次过滤：如果是 JPY 但数值很小且有小数（不太可能），可能是误判，但 Steam JPY 通常无小数。
                     // 如果是 VND/IDR/KRW 这种通常也很大。
                     return { code: detectedCode, val: val };
                }
            }

            return null;
        },

        extractNumber(text) {
            const numStr = text.replace(/[^0-9.,]/g, '');
            if (!numStr) return 0;
            
            if (numStr.includes(',') && numStr.includes('.')) {
                if (numStr.lastIndexOf(',') > numStr.lastIndexOf('.')) {
                    return parseFloat(numStr.replace(/\./g, '').replace(',', '.'));
                } else {
                    return parseFloat(numStr.replace(/,/g, ''));
                }
            } else if (numStr.includes(',')) {
                 if (numStr.length - numStr.lastIndexOf(',') === 3) {
                     return parseFloat(numStr.replace(',', '.'));
                 }
                 return parseFloat(numStr.replace(/,/g, ''));
            }
            return parseFloat(numStr);
        },

        convertPrices(rates) {
            // 使用 TreeWalker 遍历所有文本节点，实现通用匹配
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // 跳过隐藏元素或特定标签
                        if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                        
                        // 关键修复：跳过设置模态框内部的内容，防止预览框被二次转换
                        if (node.parentElement.closest('#steam-god-modal')) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        const tag = node.parentElement.tagName;
                        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'CODE'].includes(tag)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        // 简单预筛选：必须包含数字
                        if (!/\d/.test(node.textContent)) {
                            return NodeFilter.FILTER_SKIP;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodesToConvert = [];

            while (walker.nextNode()) {
                const node = walker.currentNode;
                const parent = node.parentElement;

                // 防止重复处理
                if (parent.dataset.steamGodConverted) continue;
                if (parent.classList.contains('steam-god-price-cny')) continue;

                // 尝试解析
                const text = node.textContent;
                // 排除纯年份/日期 (简单过滤，防止 2025 这种被误判)
                // 但 extractNumber 很强力，主要靠 parsePrice 的符号匹配
                
                const priceData = this.parsePrice(text);
                if (priceData && priceData.code && rates[priceData.code]) {
                    nodesToConvert.push({
                        parent: parent,
                        val: priceData.val,
                        rate: rates[priceData.code],
                        isDiscountOriginal: parent.classList.contains('discount_original_price') || parent.style.textDecoration === 'line-through'
                    });
                }
            }

            // 批量更新 DOM
            nodesToConvert.forEach(item => {
                // 双重检查，防止在遍历过程中已经被处理
                if (item.parent.dataset.steamGodConverted) return;

                const cny = item.val * item.rate;
                const span = document.createElement('span');
                span.className = 'steam-god-price-cny';
                span.textContent = `(¥${Math.round(cny)})`;
                span.style.cssText = 'color: #ffeb3b; font-size: 0.85em; margin-left: 2px; display: inline-block; transform: scale(0.9); font-weight: normal;';
                
                if (item.isDiscountOriginal) {
                     span.style.color = '#888';
                     span.style.textDecoration = 'line-through';
                }

                item.parent.appendChild(span);
                item.parent.dataset.steamGodConverted = 'true';
            });
        },

        observeMutations(rates) {
            const observer = new MutationObserver((mutations) => {
                 // 简单的防抖或直接执行，这里直接执行，因为 convertPrices 内部有去重
                 this.convertPrices(rates);
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    };

    /**
     * 添加成功提示指示器 ✨
     */
    function addSuccessIndicator(settings) {
        if (!settings.showWorkshopInfoPanel) {
            return;
        }
        // 防止重复添加
        if (document.getElementById('workshop-30-indicator')) {
            return;
        }

        const indicator = document.createElement('div');
        indicator.id = 'workshop-30-indicator';
        indicator.innerHTML = `🎯 已启用${settings.workshopNumPerPage}页显示模式`;
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.5s ease-out;
        `;

        // 添加动画样式
        if (!document.getElementById('workshop-indicator-style')) {
            const style = document.createElement('style');
            style.id = 'workshop-indicator-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(indicator);

        // 3秒后自动隐藏
        setTimeout(() => {
            if (indicator && indicator.parentNode) {
                indicator.style.transition = 'all 0.5s ease-out';
                indicator.style.transform = 'translateX(100%)';
                indicator.style.opacity = '0';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 500);
            }
        }, 3000);
    }

    /**
     * 监听页面变化（处理单页应用导航） 👀
     */
    function setupPageObserver() {
        let lastUrl = window.location.href;
        const settings = loadSettings();

        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                console.log('🔄 检测到页面URL变化，重新处理...');
                setTimeout(() => {
                    processWorkshopPage(settings);
                    setupStoreFeatures(settings);
                    setupWorkshopFeatures(settings);
                }, 500); // 稍微延迟以确保页面加载完成
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 初始化脚本 🚀
     */
    function initScript() {
        console.log('🎮 Steam 之神脚本初始化中...');
        const settings = loadSettings();

        // 页面加载完成后处理
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                processWorkshopPage(settings);
                setupStoreFeatures(settings);
                setupWorkshopFeatures(settings);
                if (settings.enableCurrencyConverter) {
                    CurrencyConverter.init();
                }
            });
        } else {
            processWorkshopPage(settings);
            setupStoreFeatures(settings);
            setupWorkshopFeatures(settings);
            if (settings.enableCurrencyConverter) {
                CurrencyConverter.init();
            }
        }

        // 设置页面变化监听器
        setupPageObserver();

        // 监听浏览器前进后退
        window.addEventListener('popstate', () => {
            setTimeout(() => {
                const latestSettings = loadSettings();
                processWorkshopPage(latestSettings);
                setupStoreFeatures(latestSettings);
                setupWorkshopFeatures(latestSettings);
            }, 100);
        });

        console.log('✅ Steam 之神脚本初始化完成！');
    }

    // 启动脚本
    initScript();

    function getAppIdFromUrl() {
        const match = window.location.href.match(/store\.steampowered\.com\/app\/(\d+)/);
        return match ? match[1] : null;
    }

    function findActionButtonsContainer() {
        return document.querySelector('.apphub_OtherSiteInfo');
    }

    function createLightTrailStyle() {
        if (document.getElementById('steam-god-style')) {
            return;
        }
        const style = document.createElement('style');
        style.id = 'steam-god-style';
        style.textContent = `
            .apphub_OtherSiteInfo {
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .steam-god-btn {
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 0 15px;
                border-radius: 2px;
                font-size: 15px;
                line-height: 30px;
                letter-spacing: 0.2px;
                cursor: pointer;
                text-decoration: none;
                margin-left: 0;
                overflow: visible;
                color: #67c1f5 !important;
                background: rgba( 103, 193, 245, 0.2 );
                border: 1px solid rgba( 103, 193, 245, 0.2 );
            }
            .steam-god-btn:hover {
                color: #fff !important;
                background: #67c1f5;
                border-color: #67c1f5;
            }
            .steam-god-btn .trail {
                position: absolute;
                inset: -1px;
                border-radius: 4px;
                background: conic-gradient(from 0deg, transparent, rgba(102, 192, 244, 0.7), transparent 40%);
                animation: steam-god-trail 2.8s linear infinite;
                mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                mask-composite: exclude;
                padding: 1px;
                pointer-events: none;
            }
            @keyframes steam-god-trail {
                to { transform: rotate(360deg); }
            }
            .steam-god-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.55);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .steam-god-panel {
                width: 320px;
                background: linear-gradient(160deg, #1b2838, #15202c);
                border: 1px solid rgba(102, 192, 244, 0.35);
                box-shadow: 0 10px 22px rgba(0,0,0,0.45);
                padding: 14px 16px;
                color: #c6d4df;
                font-size: 12px;
                border-radius: 4px;
            }
            .steam-god-panel h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                color: #66c0f4;
            }
            .steam-god-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin: 6px 0;
            }
            .steam-god-row select {
                background: #17212e;
                color: #c6d4df;
                border: 1px solid rgba(102, 192, 244, 0.3);
                border-radius: 2px;
                padding: 2px 6px;
                height: 24px;
            }
            .steam-god-info-table {
                margin: 8px 0;
                background: rgba(23, 33, 46, 0.9);
                border: 1px solid rgba(102, 192, 244, 0.2);
                padding: 8px;
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 6px 10px;
                font-size: 12px;
            }
            .steam-god-info-table a {
                color: #66c0f4;
                text-decoration: none;
            }
            .steam-god-info-table a:hover {
                text-decoration: underline;
            }
            .steam-god-comment-btn-top {
                background: linear-gradient(45deg, #4CAF50, #8BC34A);
                color: white !important;
                border: none;
                box-shadow: 0 1px 2px rgba(0,0,0,0.3);
            }
            .steam-god-comment-btn-top:hover {
                background: linear-gradient(45deg, #66BB6A, #9CCC65);
                color: white !important;
                border: none;
            }
            .steam-god-close {
                float: right;
                cursor: pointer;
                color: #8f98a0;
            }
            .steam-god-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 6px;
            }
            .steam-god-row label {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                white-space: nowrap;
                flex-shrink: 0;
                width: 100%;
                cursor: pointer;
            }
            .steam-god-row label input[type="checkbox"] {
                margin: 0;
                padding: 0;
                vertical-align: middle;
            }
            .steam-god-ws-settings {
                float: right;
                margin-left: 10px;
            }
            .steam-god-desc {
                display: block;
                font-size: 11px;
                color: #8091a2;
                margin-top: 2px;
                margin-left: 20px;
                margin-bottom: 6px;
                line-height: 1.4;
            }
            .steam-god-preview-box {
                background: rgba(0, 0, 0, 0.2);
                padding: 8px 12px;
                border-radius: 4px;
                margin: 4px 0 10px 20px;
                border: 1px dashed #3c4857;
                display: flex;
                align-items: center;
                gap: 10px;
                width: fit-content;
            }
            .sg-discount-block {
                display: inline-flex;
                background: #000;
                height: 34px;
                line-height: 34px;
                font-family: Arial, sans-serif;
            }
            .sg-discount-pct {
                background: #4c6b22;
                color: #beee11;
                font-size: 18px;
                font-weight: bold;
                padding: 0 6px;
                display: flex;
                align-items: center;
            }
            .sg-discount-prices {
                background: #344654;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 8px;
                line-height: 14px;
                align-items: flex-end;
            }
            .sg-original {
                color: #738895;
                font-size: 11px;
                text-decoration: line-through;
            }
            .sg-final {
                color: #beee11;
                font-size: 13px;
            }
            .sg-cny {
                color: #ffeb3b;
                font-size: 11px;
                margin-left: 2px;
                text-decoration: none !important;
                display: inline-block;
                transform: scale(0.95);
            }
            .steam-god-row {
                flex-wrap: wrap;
            }
        `;
        document.head.appendChild(style);
    }

    function setupWorkshopFeatures(settings) {
        if (!isSteamWorkshopPage()) {
            return;
        }
        createLightTrailStyle();

        const titleContainer = document.querySelector('.section_title_ctn');
        if (!titleContainer) {
            return;
        }

        const ensureButtons = () => {
            if (!titleContainer.querySelector('.steam-god-btn.steam-god-settings')) {
                const modal = ensureSettingsModal();
                const settingsButton = createSettingsButton(settings, modal);
                settingsButton.classList.add('steam-god-settings', 'steam-god-ws-settings');
                // 创意工坊页面按钮可以小一点，或者调整样式
                settingsButton.style.lineHeight = '24px';
                settingsButton.style.fontSize = '12px';
                titleContainer.appendChild(settingsButton);
            }
        };

        ensureButtons();
        
        // 某些创意工坊页面是动态加载的，这里简单observe一下
        const observer = new MutationObserver(() => {
            if (!titleContainer.querySelector('.steam-god-btn')) {
                ensureButtons();
            }
        });
        observer.observe(titleContainer, { childList: true });
    }


    function createSettingsButton(settings, modal) {
        const button = document.createElement('button');
        button.className = 'steam-god-btn btnv6_blue_hoverfade btn_medium';
        button.type = 'button';
        button.setAttribute('aria-label', 'steam 之神设置');
        button.innerHTML = `<span class="trail"></span><span>steam 之神设置</span>`;

        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const next = loadSettings();
            select.value = String(next.workshopNumPerPage || 30);
            infoCheckbox.checked = !!next.showWorkshopInfoPanel;
            manifestCheckbox.checked = !!next.enableManifestDownload;
            currencyCheckbox.checked = !!next.enableCurrencyConverter;
            modal.style.display = 'flex';
        });

        const select = modal.querySelector('#steam-god-numperpage');
        const infoCheckbox = modal.querySelector('#steam-god-info-panel');
        const manifestCheckbox = modal.querySelector('#steam-god-manifest');
        const currencyCheckbox = modal.querySelector('#steam-god-currency');

        select.value = String(settings.workshopNumPerPage || 30);
        infoCheckbox.checked = !!settings.showWorkshopInfoPanel;
        manifestCheckbox.checked = !!settings.enableManifestDownload;
        currencyCheckbox.checked = !!settings.enableCurrencyConverter;

        select.addEventListener('change', () => {
            const next = loadSettings();
            next.workshopNumPerPage = Number(select.value);
            saveSettings(next);
            
            // 立即刷新页面以应用新的分页参数 (如果当前就在工坊页面)
            if (isSteamWorkshopPage()) {
                const newUrl = updateNumPerPageParam(next);
                if (newUrl) {
                    window.location.replace(newUrl);
                } else {
                    window.location.reload();
                }
            }
        });

        infoCheckbox.addEventListener('change', () => {
            const next = loadSettings();
            next.showWorkshopInfoPanel = infoCheckbox.checked;
            saveSettings(next);
            setupStoreFeatures(next);
        });

        manifestCheckbox.addEventListener('change', () => {
            const next = loadSettings();
            next.enableManifestDownload = manifestCheckbox.checked;
            saveSettings(next);
            setupStoreFeatures(next);
        });

        currencyCheckbox.addEventListener('change', () => {
            const next = loadSettings();
            next.enableCurrencyConverter = currencyCheckbox.checked;
            saveSettings(next);
            if (next.enableCurrencyConverter) {
                CurrencyConverter.init();
            } else {
                // 关闭需要刷新页面生效，简单提示或直接刷新
                if (confirm('关闭汇率转换需要刷新页面生效，是否刷新？')) {
                    window.location.reload();
                }
            }
        });

        return button;
    }

    function ensureSettingsModal() {
        let modal = document.getElementById('steam-god-modal');
        if (modal) {
            return modal;
        }
        
        // 检查权限
        const hasGMPermission = typeof GM_xmlhttpRequest !== 'undefined';

        modal = document.createElement('div');
        modal.id = 'steam-god-modal';
        modal.className = 'steam-god-modal';
        modal.innerHTML = `
            <div class="steam-god-panel">
                <div class="steam-god-close">×</div>
                <h4>steam 之神设置</h4>
                <div class="steam-god-grid">
                    <div class="steam-god-row">
                        <span>创意工坊分页</span>
                        <select id="steam-god-numperpage">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                    <span class="steam-god-desc">设置创意工坊列表每页显示的物品数量。</span>

                    <div class="steam-god-row">
                        <label>
                            <input type="checkbox" id="steam-god-info-panel">
                            信息表前置
                        </label>
                    </div>
                    <span class="steam-god-desc">在商店页面顶部显示“支持中文”、“局域网联机”等关键信息，无需滚动查找。</span>

                    <div class="steam-god-row">
                        <label>
                            <input type="checkbox" id="steam-god-manifest">
                            下载清单
                        </label>
                    </div>
                    <span class="steam-god-desc">在商店页添加 ManifestHub 链接，方便下载旧版本 Depots 清单。</span>

                    <div class="steam-god-row">
                        <label title="${hasGMPermission ? '开启后自动将外区价格转换为人民币' : '权限不足：请在油猴管理器中允许脚本访问跨域资源'}">
                            <input type="checkbox" id="steam-god-currency" ${!hasGMPermission ? 'disabled' : ''}>
                            汇率转换 (CNY)
                            ${!hasGMPermission ? '<span style="color:#ff6b6b;font-size:10px;margin-left:4px;">(缺权限)</span>' : ''}
                        </label>
                    </div>
                    <span class="steam-god-desc">
                        自动将全球各区货币（如美元、新币、里拉）转换为人民币参考价。
                        <br>支持商店页、搜索页、折扣列表等所有价格显示区域。
                    </span>
                    
                    <div class="steam-god-preview-box">
                        <div class="sg-discount-block">
                            <div class="sg-discount-pct">-20%</div>
                            <div class="sg-discount-prices">
                                <div class="sg-original">S$54.00 <span class="sg-cny" style="color:#888;text-decoration:line-through;">(¥294)</span></div>
                                <div class="sg-final">S$43.20 <span class="sg-cny">(¥235)</span></div>
                            </div>
                        </div>
                        <span style="font-size:11px;color:#66c0f4;">← 效果预览</span>
                    </div>

                    <div class="steam-god-row" style="color:#8f98a0;margin-top:10px;border-top:1px solid #ffffff1a;padding-top:10px;">
                        致谢 ManifestHub 开源作者，禁止倒卖狗
                    </div>
                </div>
            </div>
        `;
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        modal.querySelector('.steam-god-close').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        document.body.appendChild(modal);
        return modal;
    }





    function addManifestDownloadButton(container, appId, settings) {
        if (!settings.enableManifestDownload) {
            return;
        }
        if (container.querySelector('.steam-god-manifest')) {
            return;
        }
        const link = document.createElement('a');
        link.className = 'steam-god-btn steam-god-manifest btnv6_blue_hoverfade btn_medium';
        link.href = `https://github.com/SteamAutoCracks/ManifestHub/archive/refs/heads/${appId}.zip`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.innerHTML = '<span>下载清单</span>';
        link.title = '来自 ManifestHub 开源项目，作者禁止倒卖狗';
        container.appendChild(link);
    }



    function collectStoreInfo() {
        const info = [];
        const workshopLink = document.querySelector('a[href*="steamcommunity.com/app/"][href*="/workshop"]');
        if (workshopLink) {
            info.push({
                label: '是否支持创意工坊',
                value: '支持',
                href: workshopLink.href
            });
        } else {
            info.push({
                label: '是否支持创意工坊',
                value: '不支持'
            });
        }

        // 局域网合作检测 (优化版)
        let lanSupport = false;
        let lanUrl = null;
        const specs = document.querySelectorAll('.game_area_details_specs_ctn');
        for (const spec of specs) {
            const label = spec.querySelector('.label');
            if (label && label.textContent && label.textContent.includes('局域网合作')) {
                lanSupport = true;
                lanUrl = spec.href;
                break;
            }
        }

        info.push({
            label: '局域网合作',
            value: lanSupport ? '支持' : '不支持',
            href: lanUrl
        });

        const languageTable = document.querySelector('.game_language_options');
        let chineseInfo = '未知';
        if (languageTable) {
            const rows = Array.from(languageTable.querySelectorAll('tr'));
            const targetRow = rows.find(row => {
                const nameCell = row.querySelector('td');
                if (!nameCell) {
                    return false;
                }
                const name = nameCell.textContent.trim();
                return name.includes('简体中文') || name.includes('繁体中文');
            });
            if (targetRow) {
                const cols = targetRow.querySelectorAll('td.checkcol');
                const hasInterface = !!cols[0]?.querySelector('span');
                const hasAudio = !!cols[1]?.querySelector('span');
                if (hasInterface && hasAudio) {
                    chineseInfo = '中文+中文音频';
                } else if (hasInterface) {
                    chineseInfo = '中文(无中文音频)';
                } else {
                    chineseInfo = '不支持';
                }
            } else {
                chineseInfo = '不支持';
            }
        }
        info.push({
            label: '是否支持中文',
            value: chineseInfo
        });
        return info;
    }

    function renderInfoTable(container, settings) {
        if (!settings.showWorkshopInfoPanel) {
            const existing = document.getElementById('steam-god-info-table');
            if (existing) {
                existing.remove();
            }
            return;
        }
        if (document.getElementById('steam-god-info-table')) {
            return;
        }
        const info = collectStoreInfo();
        const table = document.createElement('div');
        table.className = 'steam-god-info-table';
        table.id = 'steam-god-info-table';
        info.forEach(item => {
            const label = document.createElement('div');
            label.textContent = item.label;
            const value = document.createElement(item.href ? 'a' : 'div');
            value.textContent = item.value;
            if (item.href) {
                value.href = item.href;
                value.target = '_blank';
                value.rel = 'noopener';
            }
            table.appendChild(label);
            table.appendChild(value);
        });
        container.prepend(table);
    }

    function setupStoreFeatures(settings) {
        if (!isStoreAppPage()) {
            return;
        }
        createLightTrailStyle();
        const container = findActionButtonsContainer();
        if (!container) {
            return;
        }
        const ensureButtons = () => {
            const appId = getAppIdFromUrl();
            if (appId) {
                addManifestDownloadButton(container, appId, settings);
            }
            if (!container.querySelector('.steam-god-btn.steam-god-settings')) {
                const modal = ensureSettingsModal();
                const settingsButton = createSettingsButton(settings, modal);
                settingsButton.classList.add('steam-god-settings');
                container.appendChild(settingsButton);
            }
            if (!container.querySelector('.steam-god-comment-btn-top')) {
                const commentBtn = document.createElement('a');
                commentBtn.className = 'steam-god-btn steam-god-comment-btn-top btnv6_blue_hoverfade btn_medium';
                commentBtn.href = '#app_reviews_hash';
                commentBtn.innerHTML = '<span>到评论</span>';
                container.appendChild(commentBtn);
            }
            const infoContainer = document.querySelector('.game_description_snippet')?.parentElement;
            if (infoContainer) {
                renderInfoTable(infoContainer, settings);
            }
        };
        ensureButtons();
        const observer = new MutationObserver(() => {
            if (!container.querySelector('.steam-god-btn')) {
                ensureButtons();
            }
        });
        observer.observe(container, { childList: true });
    }

})();
