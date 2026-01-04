// ==UserScript==
// @name         POE2DB 多语言信息助手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动获取并显示POE2DB网站其他语言版本的信息，简体中文页面搜索繁体信息
// @author       维克牛
// @contact      https://nga.178.com/nuke.php?func=ucp&uid=6888984
// @match        https://poe2db.tw/*
// @match        https://poe2db.tw/*
// @match        https://poe2db.tw/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559966/POE2DB%20%E5%A4%9A%E8%AF%AD%E8%A8%80%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559966/POE2DB%20%E5%A4%9A%E8%AF%AD%E8%A8%80%E4%BF%A1%E6%81%AF%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        /* 主容器样式 */
        .multilingual-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            max-height: 80vh;
            overflow-y: auto;
            background: linear-gradient(135deg, rgba(26, 32, 44, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%);
            color: #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        /* 容器悬停效果 */
        .multilingual-container:hover {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
        }

        /* 头部样式 */
        .multilingual-header {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
            padding-bottom: 12px;
            position: relative;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* 关闭按钮样式 */
        .close-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            font-size: 18px;
            cursor: pointer;
            padding: 4px 8px;
            width: 28px;
            height: 28px;
            line-height: 1;
            border-radius: 6px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .close-btn:hover {
            background: rgba(239, 68, 68, 0.2);
            border-color: rgba(239, 68, 68, 0.5);
            color: #f87171;
            transform: scale(1.1);
        }

        /* 关闭按钮图标样式 */
        .close-icon {
            font-size: 20px;
            font-weight: bold;
            line-height: 1;
            color: inherit;
        }

        /* 搜索框样式 */
        .search-section {
            margin-bottom: 20px;
            padding: 0 4px;
            position: relative; /* 为下拉菜单定位 */
        }

        .search-container {
            display: flex;
            gap: 8px;
            position: relative;
        }

        .search-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            padding: 8px 12px;
            color: #e2e8f0;
            font-size: 13px;
            transition: all 0.2s ease;
            outline: none;
        }

        .search-input:focus {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .search-input.loading {
            background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>');
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 16px;
            animation: spin 1s linear infinite;
        }

        .search-btn {
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.3);
            color: #6366f1;
            border-radius: 6px;
            padding: 0 16px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .search-btn:hover {
            background: rgba(99, 102, 241, 0.3);
            border-color: rgba(99, 102, 241, 0.5);
            color: #818cf8;
        }

        /* 搜索结果下拉菜单样式 */
        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 8px;
            display: none;
            background: rgba(26, 32, 44, 0.98);
            border-radius: 6px;
            border: 1px solid rgba(99, 102, 241, 0.3);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
            z-index: 10010;
            backdrop-filter: blur(12px);
        }

        .search-results.active {
            display: block;
        }

        .search-result-item {
            padding: 8px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.1s ease;
        }

        .search-result-item:last-child {
            border-bottom: none;
        }

        .search-result-item:hover {
            background: rgba(99, 102, 241, 0.15);
        }

        .result-icon {
            width: 24px;
            height: 24px;
            object-fit: contain;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.3);
            flex-shrink: 0;
        }

        .result-info {
            flex: 1;
            min-width: 0;
        }

        .result-name {
            color: #e2e8f0;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .result-name .highlight {
            color: #818cf8;
            font-weight: 700;
        }

        .result-type {
            color: #94a3b8;
            font-size: 11px;
            display: flex;
            justify-content: space-between;
        }

        .no-results {
            padding: 12px;
            text-align: center;
            color: #94a3b8;
            font-size: 12px;
        }

        /* 语言区块样式 */
        .language-section {
            margin-bottom: 20px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: all 0.2s ease;
        }

        /* 语言区块悬停效果 */
        .language-section:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateX(4px);
        }

        /* 语言标题样式 */
        .language-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #6366f1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* 语言标题前的装饰点 */
        .language-title::before {
            content: '';
            width: 6px;
            height: 6px;
            background: #6366f1;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        /* 内容样式 */
        .language-content {
            font-size: 13px;
            line-height: 1.6;
        }

        /* 内容标题样式 */
        .content-title {
            font-weight: 600;
            color: #94a3b8;
            margin-bottom: 6px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        /* 内容文本样式 */
        .content-text {
            margin-bottom: 12px;
            color: #cbd5e1;
        }

        /* 标题行样式 */
        .title-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        /* 技能名称样式 */
        .skill-name {
            flex: 1;
            font-weight: 600;
            color: #cbd5e1;
            word-break: break-word;
        }

        /* 按钮容器 */
        .button-group {
            display: flex;
            gap: 4px;
        }

        /* 功能按钮样式 */
        .func-btn {
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.3);
            color: #6366f1;
            font-size: 12px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .func-btn:hover {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.5);
            color: #818cf8;
            transform: translateY(-1px);
        }

        /* 购买按钮特殊样式 */
        .buy-btn {
            background: rgba(52, 211, 153, 0.1);
            border: 1px solid rgba(52, 211, 153, 0.3);
            color: #34d399;
        }

        .buy-btn:hover {
            background: rgba(52, 211, 153, 0.2);
            border-color: rgba(52, 211, 153, 0.5);
            color: #6ee7b7;
        }

        /* 属性列表样式 */
        .attributes-list {
            margin-top: 10px;
        }

        /* 属性项样式 */
        .attribute-item {
            font-size: 12px;
            margin-bottom: 6px;
            color: #94a3b8;
            padding-left: 16px;
            position: relative;
            transition: color 0.2s ease;
        }

        /* 属性项悬停效果 */
        .attribute-item:hover {
            color: #e2e8f0;
        }

        /* 属性项前的装饰 */
        .attribute-item::before {
            content: '•';
            position: absolute;
            left: 6px;
            color: #6366f1;
            font-size: 14px;
        }

        /* 加载状态样式 */
        .loading {
            text-align: center;
            color: #94a3b8;
            font-style: italic;
            padding: 30px 0;
            font-size: 14px;
        }

        /* 加载动画 */
        .loading::after {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 10px;
            border: 2px solid rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            border-top-color: #6366f1;
            animation: spin 1s ease-in-out infinite;
        }

        /* 错误信息样式 */
        .error-message {
            color: #f87171;
            text-align: center;
            padding: 20px;
            background: rgba(239, 68, 68, 0.05);
            border-radius: 8px;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        /* 滚动条样式 */
        .multilingual-container::-webkit-scrollbar {
            width: 6px;
        }

        .multilingual-container::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .multilingual-container::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.5);
            border-radius: 3px;
            transition: background 0.2s ease;
        }

        .multilingual-container::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.7);
        }

        /* 动画定义 */
        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .multilingual-container {
                width: calc(100% - 40px);
                top: 10px;
                right: 10px;
                left: 10px;
                max-height: 70vh;
            }

            .button-group {
                flex-direction: column;
                gap: 2px;
            }

            .func-btn {
                font-size: 10px;
                padding: 3px 6px;
            }
        }

        /* 淡入动画 */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .multilingual-container {
            animation: fadeIn 0.4s ease-out forwards;
        }

        /* 开关按钮样式 */
        .toggle-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.3);
            color: #6366f1;
            font-size: 14px;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 20px;
            z-index: 9999;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .toggle-btn:hover {
            background: rgba(99, 102, 241, 0.3);
            border-color: rgba(99, 102, 241, 0.5);
            color: #818cf8;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        /* 复制成功提示 - 页面中间显示 */
        .copy-tooltip {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(52, 211, 153, 0.95);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            pointer-events: none;
            z-index: 10001;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            animation: fadeInOut 2s ease-out forwards;
        }

        /* 错误提示样式 */
        .copy-tooltip.error {
            background: rgba(239, 68, 68, 0.95);
        }

        /* 信息提示样式 */
        .copy-tooltip.info {
            background: rgba(99, 102, 241, 0.95);
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
    `);

    // 全局变量
    let infoContainer = null;
    let toggleButton = null;
    let autocompleteData = null; // 存储自动补全数据

    // 自动补全数据文件映射 (来自 poedb_header.js)
    const AUTOCOMPLETE_FILES = {
        'tw': 'autocompletecb_tw.5a0dfe2cc0f3a372.json',
        'cn': 'autocompletecb_cn.94ff324c68f35f2c.json',
        'us': 'autocompletecb_us.4a71e038c68657af.json'
    };

    // 获取自动补全数据URL - 强制使用繁体中文数据
    const getAutocompleteUrl = () => {
        // 用户需求：输入简体转繁体，去繁体页面搜索。因此必须加载繁体数据。
        const filename = AUTOCOMPLETE_FILES['tw'];
        return `https://cdn.poe2db.tw/json/${filename}`;
    };

    // 从当前URL获取语言
    const getCurrentLangFromUrl = () => {
        const url = window.location.href;
        const match = url.match(/https:\/\/poe2db\.tw\/(cn|tw|us)\//);
        return match ? match[1] : 'tw'; // 默认为 tw
    };

    // 加载自动补全数据
    const loadAutocompleteData = () => {
        const url = getAutocompleteUrl();
        console.log('正在加载自动补全数据:', url);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: (response) => {
                if (response.status === 200) {
                    try {
                        autocompleteData = JSON.parse(response.responseText);
                        console.log('自动补全数据加载成功, 条目数:', autocompleteData.length);
                    } catch (e) {
                        console.error('自动补全数据解析失败:', e);
                    }
                } else {
                    console.error('自动补全数据加载失败:', response.status);
                }
            },
            onerror: (err) => {
                console.error('自动补全数据请求错误:', err);
            }
        });
    };


    // 复制文本到剪贴板
    const copyToClipboard = (text, element) => {
        navigator.clipboard.writeText(text).then(() => {
            // 显示复制成功提示
            const tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = '已复制!';
            document.body.appendChild(tooltip);

            // 定位提示
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;

            // 2秒后移除提示
            setTimeout(() => {
                tooltip.remove();
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
        });
    };

    // 生成购买链接
    const generateBuyUrl = (itemName) => {
        // 基础购买链接
        const baseUrl = 'https://poe.game.qq.com/api/trade2/search/poe2/';
        // URL编码装备名称
        const encodedName = encodeURIComponent(itemName);
        return baseUrl + encodedName;
    };

    // 打开购买链接
    const openBuyUrl = (itemName) => {
        const buyUrl = generateBuyUrl(itemName);
        window.open(buyUrl, '_blank');
    };

    // 切换面板显示/隐藏
    const togglePanel = () => {
        if (infoContainer && infoContainer.parentNode) {
            // 关闭面板
            infoContainer.remove();
            infoContainer = null;
        } else {
            // 打开面板
            main();
        }
    };

    // 创建开关按钮
    const createToggleButton = () => {
        toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-btn';
        toggleButton.textContent = 'POE2DB 信息助手';
        toggleButton.onclick = togglePanel;
        document.body.appendChild(toggleButton);
    };

    // 获取当前页面的语言和路径
    const getCurrentLangAndPath = () => {
        const url = window.location.href;
        const match = url.match(/https:\/\/poe2db\.tw\/(cn|tw|us)\/(.*)/);
        if (match) {
            return {
                lang: match[1],
                path: match[2]
            };
        }
        return null;
    };

    // 获取其他语言版本的URL
    const getOtherLangUrls = (currentLang, path) => {
        const langs = ['cn', 'tw', 'us'];
        return langs
            .filter(lang => lang !== currentLang)
            .map(lang => `https://poe2db.tw/${lang}/${path}`);
    };

    // 从页面中提取信息
    const extractInfo = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 使用更通用的选择器获取技能名称（第一个字段）
        let field1 = '';
        try {
            // 尝试多种方式获取技能名称
            const skillNameSelectors = [
                '//*[contains(@id, "SkillGem")]/div[1]/div/div[1]/div[1]/div[1]/span',
                '.itemName .lc',
                'h1',
                'h3'
            ];

            for (const selector of skillNameSelectors) {
                if (selector.startsWith('//')) {
                    // XPath选择器
                    const xpathResult = doc.evaluate(
                        selector,
                        doc,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    );
                    if (xpathResult.singleNodeValue) {
                        field1 = xpathResult.singleNodeValue.textContent.trim();
                        if (field1) break;
                    }
                } else {
                    // CSS选择器
                    const element = doc.querySelector(selector);
                    if (element) {
                        field1 = element.textContent.trim();
                        if (field1) break;
                    }
                }
            }
        } catch (error) {
            console.error('Error extracting field 1:', error);
        }

        // 使用更通用的选择器获取第二个字段
        let field2 = '';
        try {
            // 尝试多种方式获取特定属性
            const attributeSelectors = [
                '//*[contains(@id, "SkillGem")]/div[1]/div/div[1]/div[2]/div[1]/div[10]',
                '//div[contains(@class, "Stats")]/div[10]',
                '//div[contains(@class, "explicitMod")][10]'
            ];

            for (const selector of attributeSelectors) {
                if (selector.startsWith('//')) {
                    // XPath选择器
                    const xpathResult = doc.evaluate(
                        selector,
                        doc,
                        null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE,
                        null
                    );
                    if (xpathResult.singleNodeValue) {
                        field2 = xpathResult.singleNodeValue.textContent.trim();
                        if (field2) break;
                    }
                }
            }
        } catch (error) {
            console.error('Error extracting field 2:', error);
        }

        // 构建标题（使用第一个字段）
        const title = field1 || 'N/A';

        // 构建内容（只显示这两个字段，更友好的格式）
        let content = '';
        if (field1) content += `技能名称: ${field1}\n`;
        if (field2) content += `特定属性: ${field2}`;
        if (!content) content = 'N/A';

        // 属性数组只包含这两个字段
        const attributes = [];
        if (field1) attributes.push(`技能名称: ${field1}`);
        if (field2) attributes.push(`特定属性: ${field2}`);

        return {
            title,
            content,
            attributes
        };
    };

    // 防抖函数
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // 简繁转换映射表 (常用字)
    const SC2TC_MAP = {
        '爱': '愛', '奥': '奧', '笔': '筆', '边': '邊', '变': '變', '别': '別', '补': '補',
        '才': '才', '参': '參', '仓': '倉', '层': '層', '产': '產', '长': '長', '尝': '嘗',
        '车': '車', '彻': '徹', '尘': '塵', '衬': '襯', '称': '稱', '惩': '懲', '迟': '遲',
        '齿': '齒', '冲': '衝', '丑': '醜', '出': '出', '处': '處', '触': '觸', '辞': '辭',
        '聪': '聰', '从': '從', '丛': '叢', '凑': '湊', '窜': '竄', '错': '錯', '达': '達',
        '带': '帶', '担': '擔', '胆': '膽', '淡': '淡', '当': '當', '档': '檔', '导': '導',
        '灯': '燈', '邓': '鄧', '敌': '敵', '籴': '糴', '递': '遞', '点': '點', '淀': '澱',
        '电': '電', '冬': '冬', '东': '東', '冻': '凍', '栋': '棟', '动': '動', '斗': '鬥',
        '独': '獨', '断': '斷', '对': '對', '队': '隊', '吨': '噸', '夺': '奪', '堕': '墮',
        '鹅': '鵝', '额': '額', '恶': '惡', '发': '發', '罚': '罰', '法': '法', '反': '反',
        '饭': '飯', '范': '範', '方': '方', '飞': '飛', '废': '廢', '费': '費', '分': '分',
        '丰': '豐', '风': '風', '妇': '婦', '复': '復', '盖': '蓋', '干': '乾', '赶': '趕',
        '个': '個', '巩': '鞏', '沟': '溝', '构': '構', '购': '購', '谷': '穀', '顾': '顧',
        '刮': '颳', '关': '關', '观': '觀', '柜': '櫃', '归': '歸', '国': '國', '过': '過',
        '哈': '哈', '骇': '駭', '汉': '漢', '号': '號', '合': '合', '轰': '轟', '后': '後',
        '胡': '胡', '护': '護', '壶': '壺', '户': '戶', '划': '劃', '画': '畫', '话': '話',
        '怀': '懷', '坏': '壞', '欢': '歡', '环': '環', '还': '還', '回': '回', '会': '會',
        '伙': '夥', '获': '獲', '击': '擊', '机': '機', '积': '積', '极': '極', '籍': '籍',
        '几': '幾', '济': '濟', '剂': '劑', '计': '計', '记': '記', '际': '際', '继': '繼',
        '家': '家', '价': '價', '艰': '艱', '检': '檢', '见': '見', '涧': '澗', '建': '建',
        '姜': '薑', '将': '將', '奖': '獎', '浆': '漿', '桨': '槳', '酱': '醬', '讲': '講',
        '交': '交', '阶': '階', '节': '節', '杰': '傑', '洁': '潔', '结': '結', '界': '界',
        '金': '金', '仅': '僅', '紧': '緊', '进': '進', '尽': '盡', '劲': '勁', '荆': '荊',
        '景': '景', '净': '淨', '竞': '競', '旧': '舊', '剧': '劇', '据': '據', '巨': '巨',
        '惧': '懼', '卷': '捲', '觉': '覺', '军': '軍', '俊': '俊', '开': '開', '凯': '凱',
        '颗': '顆', '壳': '殼', '课': '課', '肯': '肯', '垦': '墾', '恳': '懇', '库': '庫',
        '裤': '褲', '夸': '誇', '块': '塊', '宽': '寬', '矿': '礦', '旷': '曠', '况': '況',
        '亏': '虧', '腊': '臘', '蜡': '蠟', '来': '來', '赖': '賴', '蓝': '藍', '览': '覽',
        '懒': '懶', '烂': '爛', '滥': '濫', '捞': '撈', '劳': '勞', '乐': '樂', '雷': '雷',
        '类': '類', '厘': '釐', '离': '離', '里': '裡', '礼': '禮', '历': '歷', '丽': '麗',
        '励': '勵', '利': '利', '联': '聯', '练': '練', '粮': '糧', '梁': '樑', '两': '兩',
        '量': '量', '谅': '諒', '疗': '療', '辽': '遼', '了': '了', '猎': '獵', '临': '臨',
        '邻': '鄰', '灵': '靈', '龄': '齡', '岭': '嶺', '刘': '劉', '浏': '瀏', '龙': '龍',
        '楼': '樓', '娄': '婁', '录': '錄', '陆': '陸', '虏': '虜', '鲁': '魯', '禄': '祿',
        '虑': '慮', '滤': '濾', '驴': '驢', '吕': '呂', '铝': '鋁', '旅': '旅', '屡': '屢',
        '乱': '亂', '罗': '羅', '逻': '邏', '骆': '駱', '妈': '媽', '马': '馬', '买': '買',
        '卖': '賣', '麦': '麥', '脉': '脈', '猫': '貓', '蛮': '蠻', '门': '門', '猛': '猛',
        '梦': '夢', '弥': '彌', '秘': '祕', '面': '麵', '庙': '廟', '灭': '滅', '蔑': '蔑',
        '民': '民', '明': '明', '谬': '謬', '摸': '摸', '模': '模', '么': '麼', '摩': '摩',
        '磨': '磨', '魔': '魔', '抹': '抹', '莫': '莫', '墨': '墨', '默': '默', '谋': '謀',
        '亩': '畝', '幕': '幕', '墓': '墓', '慕': '慕', '暮': '暮', '目': '目', '睦': '睦',
        '穆': '穆', '拿': '拿', '纳': '納', '娜': '娜', '钠': '鈉', '乃': '乃', '奶': '奶',
        '耐': '耐', '男': '男', '南': '南', '难': '難', '囊': '囊', '挠': '撓', '脑': '腦',
        '恼': '惱', '闹': '鬧', '内': '內', '嫩': '嫩', '能': '能', '尼': '尼', '泥': '泥',
        '倪': '倪', '拟': '擬', '你': '你', '匿': '匿', '腻': '膩', '逆': '逆', '溺': '溺',
        '拈': '拈', '年': '年', '碾': '碾', '念': '念', '娘': '娘', '酿': '釀', '鸟': '鳥',
        '尿': '尿', '捏': '捏', '聂': '聶', '孽': '孽', '啮': '齧', '宁': '寧', '拧': '擰',
        '狞': '獰', '柠': '檸', '凝': '凝', '牛': '牛', '扭': '扭', '纽': '紐', '农': '農',
        '浓': '濃', '弄': '弄', '奴': '奴', '努': '努', '怒': '怒', '女': '女', '暖': '暖',
        '虐': '虐', '疟': '瘧', '挪': '挪', '懦': '懦', '糯': '糯', '诺': '諾', '哦': '哦',
        '欧': '歐', '殴': '毆', '偶': '偶', '呕': '嘔', '趴': '趴', '爬': '爬', '帕': '帕',
        '怕': '怕', '拍': '拍', '排': '排', '牌': '牌', '派': '派', '攀': '攀', '盘': '盤',
        '判': '判', '盼': '盼', '乓': '乓', '旁': '旁', '胖': '胖', '抛': '拋', '炮': '砲',
        '跑': '跑', '泡': '泡', '胚': '胚', '陪': '陪', '培': '培', '赔': '賠', '佩': '佩',
        '配': '配', '喷': '噴', '盆': '盆', '朋': '朋', '棚': '棚', '蓬': '蓬', '鹏': '鵬',
        '膨': '膨', '捧': '捧', '碰': '碰', '批': '批', '披': '披', '皮': '皮', '疲': '疲',
        '脾': '脾', '匹': '匹', '屁': '屁', '譬': '譬', '片': '片', '偏': '偏', '篇': '篇',
        '骗': '騙', '漂': '漂', '飘': '飄', '票': '票', '撇': '撇', '瞥': '瞥', '拼': '拚',
        '频': '頻', '贫': '貧', '品': '品', '聘': '聘', '乒': '乒', '平': '平', '评': '評',
        '凭': '憑', '瓶': '瓶', '坡': '坡', '泼': '潑', '颇': '頗', '婆': '婆', '破': '破',
        '魄': '魄', '剖': '剖', '仆': '僕', '扑': '撲', '铺': '鋪', '葡': '葡', '蒲': '蒲',
        '朴': '樸', '普': '普', '谱': '譜', '七': '七', '妻': '妻', '栖': '棲', '戚': '戚',
        '期': '期', '欺': '欺', '漆': '漆', '齐': '齊', '其': '其', '奇': '奇', '歧': '歧',
        '祈': '祈', '脐': '臍', '骑': '騎', '棋': '棋', '旗': '旗', '麒': '麒', '乞': '乞',
        '企': '企', '岂': '豈', '启': '啟', '起': '起', '气': '氣', '弃': '棄', '汽': '汽',
        '契': '契', '砌': '砌', '器': '器', '恰': '恰', '洽': '洽', '千': '千', '迁': '遷',
        '牵': '牽', '铅': '鉛', '谦': '謙', '签': '簽', '前': '前', '钱': '錢', '潜': '潛',
        '浅': '淺', '遣': '遣', '欠': '欠', '歉': '歉', '枪': '槍', '呛': '嗆', '腔': '腔',
        '羌': '羌', '墙': '牆', '蔷': '薔', '强': '強', '抢': '搶', '乔': '喬', '侨': '僑',
        '桥': '橋', '窍': '竅', '翘': '翹', '俏': '俏', '峭': '峭', '切': '切', '且': '且',
        '亲': '親', '侵': '侵', '钦': '欽', '芹': '芹', '勤': '勤', '寝': '寢', '沁': '沁',
        '青': '青', '轻': '輕', '氢': '氫', '倾': '傾', '清': '清', '晴': '晴', '情': '情',
        '顷': '頃', '请': '請', '庆': '慶', '琼': '瓊', '穷': '窮', '秋': '秋', '丘': '丘',
        '球': '球', '区': '區', '曲': '曲', '驱': '驅', '屈': '屈', '躯': '軀', '趋': '趨',
        '取': '取', '娶': '娶', '去': '去', '趣': '趣', '圈': '圈', '全': '全', '权': '權',
        '泉': '泉', '拳': '拳', '劝': '勸', '缺': '缺', '确': '確', '雀': '雀', '裙': '裙',
        '群': '群', '然': '然', '燃': '燃', '染': '染', '嚷': '嚷', '壤': '壤', '让': '讓',
        '饶': '饒', '扰': '擾', '绕': '繞', '热': '熱', '人': '人', '仁': '仁', '忍': '忍',
        '刃': '刃', '认': '認', '任': '任', '扔': '扔', '仍': '仍', '日': '日', '戎': '戎',
        '茸': '茸', '蓉': '蓉', '荣': '榮', '融': '融', '冗': '冗', '柔': '柔', '揉': '揉',
        '肉': '肉', '如': '如', '儒': '儒', '乳': '乳', '辱': '辱', '入': '入', '褥': '褥',
        '软': '軟', '锐': '銳', '瑞': '瑞', '润': '潤', '若': '若', '弱': '弱', '撒': '撒',
        '洒': '灑', '萨': '薩', '塞': '塞', '赛': '賽', '三': '三', '伞': '傘', '散': '散',
        '桑': '桑', '嗓': '嗓', '丧': '喪', '扫': '掃', '嫂': '嫂', '色': '色', '森': '森',
        '僧': '僧', '杀': '殺', '沙': '沙', '纱': '紗', '傻': '傻', '筛': '篩', '晒': '曬',
        '山': '山', '删': '刪', '杉': '杉', '衫': '衫', '珊': '珊', '闪': '閃', '陕': '陝',
        '扇': '扇', '善': '善', '缮': '繕', '伤': '傷', '商': '商', '赏': '賞', '上': '上',
        '尚': '尚', '烧': '燒', '勺': '勺', '少': '少', '绍': '紹', '奢': '奢', '赊': '賒',
        '蛇': '蛇', '舌': '舌', '舍': '捨', '设': '設', '社': '社', '射': '射', '涉': '涉',
        '摄': '攝', '申': '申', '伸': '伸', '身': '身', '深': '深', '神': '神', '审': '審',
        '婶': '嬸', '肾': '腎', '甚': '甚', '渗': '滲', '慎': '慎', '升': '升', '生': '生',
        '声': '聲', '牲': '牲', '胜': '勝', '绳': '繩', '省': '省', '圣': '聖', '盛': '盛',
        '剩': '剩', '尸': '屍', '失': '失', '师': '師', '诗': '詩', '施': '施', '湿': '濕',
        '十': '十', '什': '什', '石': '石', '时': '時', '识': '識', '实': '實', '拾': '拾',
        '蚀': '蝕', '食': '食', '史': '史', '使': '使', '始': '始', '驶': '駛', '士': '士',
        '氏': '氏', '世': '世', '市': '市', '示': '示', '式': '式', '事': '事', '侍': '侍',
        '势': '勢', '视': '視', '试': '試', '饰': '飾', '室': '室', '是': '是', '适': '適',
        '逝': '逝', '释': '釋', '誓': '誓', '收': '收', '手': '手', '守': '守', '首': '首',
        '寿': '壽', '受': '受', '兽': '獸', '售': '售', '授': '授', '瘦': '瘦', '书': '書',
        '叔': '叔', '殊': '殊', '梳': '梳', '舒': '舒', '输': '輸', '赎': '贖', '熟': '熟',
        '暑': '暑', '属': '屬', '鼠': '鼠', '术': '術', '述': '述', '树': '樹', '束': '束',
        '恕': '恕', '刷': '刷', '耍': '耍', '衰': '衰', '摔': '摔', '甩': '甩', '帅': '帥',
        '栓': '栓', '双': '雙', '霜': '霜', '爽': '爽', '谁': '誰', '水': '水', '税': '稅',
        '睡': '睡', '顺': '順', '舜': '舜', '说': '說', '烁': '爍', '斯': '斯', '撕': '撕',
        '思': '思', '私': '私', '司': '司', '丝': '絲', '死': '死', '四': '四', '寺': '寺',
        '似': '似', '饲': '飼', '松': '鬆', '耸': '聳', '送': '送', '宋': '宋', '讼': '訟',
        '诵': '誦', '搜': '搜', '苏': '蘇', '酥': '酥', '俗': '俗', '诉': '訴', '肃': '肅',
        '素': '素', '速': '速', '宿': '宿', '粟': '粟', '塑': '塑', '酸': '酸', '蒜': '蒜',
        '算': '算', '虽': '雖', '随': '隨', '岁': '歲', '碎': '碎', '遂': '遂', '穗': '穗',
        '孙': '孫', '损': '損', '笋': '筍', '缩': '縮', '所': '所', '索': '索', '锁': '鎖',
        '他': '他', '它': '它', '她': '她', '塌': '塌', '塔': '塔', '踏': '踏', '胎': '胎',
        '台': '台', '抬': '抬', '太': '太', '态': '態', '泰': '泰', '贪': '貪', '摊': '攤',
        '滩': '灘', '坛': '壇', '檀': '檀', '痰': '痰', '潭': '潭', '谈': '談', '坦': '坦',
        '毯': '毯', '叹': '嘆', '炭': '炭', '探': '探', '汤': '湯', '唐': '唐', '堂': '堂',
        '塘': '塘', '糖': '糖', '膛': '膛', '倘': '倘', '躺': '躺', '烫': '燙', '涛': '濤',
        '掏': '掏', '滔': '滔', '韬': '韜', '逃': '逃', '桃': '桃', '陶': '陶', '萄': '萄',
        '讨': '討', '套': '套', '特': '特', '藤': '藤', '腾': '騰', '疼': '疼', '梯': '梯',
        '剔': '剔', '踢': '踢', '题': '題', '提': '提', '体': '體', '替': '替', '天': '天',
        '田': '田', '甜': '甜', '填': '填', '挑': '挑', '条': '條', '跳': '跳', '贴': '貼',
        '铁': '鐵', '厅': '廳', '听': '聽', '廷': '廷', '亭': '亭', '庭': '庭', '停': '停',
        '挺': '挺', '艇': '艇', '通': '通', '同': '同', '桐': '桐', '铜': '銅', '童': '童',
        '统': '統', '桶': '桶', '筒': '筒', '痛': '痛', '偷': '偷', '头': '頭', '投': '投',
        '透': '透', '秃': '禿', '突': '突', '图': '圖', '徒': '徒', '涂': '塗', '途': '途',
        '屠': '屠', '土': '土', '吐': '吐', '兔': '兔', '团': '團', '推': '推', '腿': '腿',
        '退': '退', '蜕': '蛻', '褪': '褪', '吞': '吞', '屯': '屯', '托': '託', '拖': '拖',
        '脱': '脫', '驼': '駝', '妥': '妥', '拓': '拓', '唾': '唾', '挖': '挖', '哇': '哇',
        '蛙': '蛙', '娃': '娃', '瓦': '瓦', '袜': '襪', '歪': '歪', '外': '外', '弯': '彎',
        '湾': '灣', '丸': '丸', '完': '完', '玩': '玩', '顽': '頑', '挽': '挽', '晚': '晚',
        '碗': '碗', '万': '萬', '汪': '汪', '亡': '亡', '王': '王', '网': '網', '往': '往',
        '枉': '枉', '妄': '妄', '忘': '忘', '旺': '旺', '望': '望', '危': '危', '威': '威',
        '微': '微', '巍': '巍', '为': '為', '韦': '韋', '围': '圍', '违': '違', '维': '維',
        '伟': '偉', '伪': '偽', '尾': '尾', '纬': '緯', '委': '委', '卫': '衛', '未': '未',
        '位': '位', '味': '味', '胃': '胃', '谓': '謂', '喂': '餵', '慰': '慰', '魏': '魏',
        '温': '溫', '文': '文', '纹': '紋', '闻': '聞', '蚊': '蚊', '吻': '吻', '稳': '穩',
        '问': '問', '翁': '翁', '窝': '窩', '我': '我', '沃': '沃', '卧': '臥', '握': '握',
        '乌': '烏', '污': '汙', '呜': '嗚', '巫': '巫', '屋': '屋', '无': '無', '芜': '蕪',
        '梧': '梧', '五': '五', '午': '午', '伍': '伍', '武': '武', '侮': '侮', '舞': '舞',
        '勿': '勿', '务': '務', '物': '物', '误': '誤', '悟': '悟', '雾': '霧', '夕': '夕',
        '西': '西', '吸': '吸', '希': '希', '析': '析', '牺': '犧', '息': '息', '悉': '悉',
        '惜': '惜', '稀': '稀', '锡': '錫', '溪': '溪', '熙': '熙', '嘻': '嘻', '膝': '膝',
        '习': '習', '席': '席', '袭': '襲', '媳': '媳', '洗': '洗', '喜': '喜', '戏': '戲',
        '系': '系', '细': '細', '隙': '隙', '虾': '蝦', '瞎': '瞎', '峡': '峽', '狭': '狹',
        '辖': '轄', '霞': '霞', '下': '下', '吓': '嚇', '夏': '夏', '仙': '仙', '先': '先',
        '纤': '纖', '掀': '掀', '鲜': '鮮', '闲': '閒', '弦': '弦', '贤': '賢', '咸': '鹹',
        '衔': '銜', '嫌': '嫌', '显': '顯', '险': '險', '县': '縣', '现': '現', '线': '線',
        '限': '限', '宪': '憲', '陷': '陷', '馅': '餡', '羡': '羨', '献': '獻', '乡': '鄉',
        '相': '相', '香': '香', '箱': '箱', '详': '詳', '祥': '祥', '翔': '翔', '享': '享',
        '响': '響', '想': '想', '向': '向', '项': '項', '巷': '巷', '象': '象', '像': '像',
        '萧': '蕭', '销': '銷', '潇': '瀟', '小': '小', '晓': '曉', '孝': '孝', '效': '效',
        '校': '校', '笑': '笑', '啸': '嘯', '些': '些', '歇': '歇', '协': '協', '邪': '邪',
        '胁': '脅', '携': '攜', '写': '寫', '泄': '洩', '泻': '瀉', '谢': '謝', '屑': '屑',
        '薪': '薪', '心': '心', '芯': '芯', '辛': '辛', '欣': '欣', '锌': '鋅', '新': '新',
        '信': '信', '兴': '興', '星': '星', '腥': '腥', '刑': '刑', '形': '形', '型': '型',
        '醒': '醒', '杏': '杏', '姓': '姓', '幸': '幸', '性': '性', '凶': '兇', '兄': '兄',
        '匈': '匈', '胸': '胸', '雄': '雄', '熊': '熊', '休': '休', '修': '修', '羞': '羞',
        '朽': '朽', '秀': '秀', '绣': '繡', '袖': '袖', '锈': '鏽', '须': '須', '虚': '虛',
        '需': '需', '徐': '徐', '许': '許', '叙': '敘', '绪': '緒', '续': '續', '轩': '軒',
        '宣': '宣', '悬': '懸', '旋': '旋', '选': '選', '癣': '癬', '削': '削', '靴': '靴',
        '学': '學', '雪': '雪', '血': '血', '勋': '勳', '熏': '燻', '寻': '尋', '巡': '巡',
        '询': '詢', '驯': '馴', '训': '訓', '讯': '訊', '迅': '迅', '压': '壓', '押': '押',
        '鸦': '鴉', '鸭': '鴨', '牙': '牙', '芽': '芽', '崖': '崖', '哑': '啞', '雅': '雅',
        '亚': '亞', '讶': '訝', '烟': '煙', '盐': '鹽', '严': '嚴', '研': '研', '岩': '岩',
        '延': '延', '言': '言', '颜': '顏', '阎': '閻', '炎': '炎', '沿': '沿', '掩': '掩',
        '眼': '眼', '演': '演', '厌': '厭', '砚': '硯', '雁': '雁', '燕': '燕', '央': '央',
        '殃': '殃', '扬': '揚', '羊': '羊', '阳': '陽', '杨': '楊', '洋': '洋', '仰': '仰',
        '养': '養', '氧': '氧', '痒': '癢', '样': '樣', '妖': '妖', '腰': '腰', '邀': '邀',
        '窑': '窯', '谣': '謠', '摇': '搖', '遥': '遙', '瑶': '瑤', '咬': '咬', '药': '藥',
        '要': '要', '耀': '耀', '爷': '爺', '也': '也', '冶': '冶', '野': '野', '业': '業',
        '叶': '葉', '页': '頁', '夜': '夜', '液': '液', '一': '一', '伊': '伊', '衣': '衣',
        '医': '醫', '依': '依', '仪': '儀', '夷': '夷', '宜': '宜', '姨': '姨', '移': '移',
        '遗': '遺', '疑': '疑', '乙': '乙', '已': '已', '以': '以', '蚁': '蟻', '倚': '倚',
        '椅': '椅', '义': '義', '亿': '億', '忆': '憶', '艺': '藝', '议': '議', '亦': '亦',
        '异': '異', '役': '役', '译': '譯', '易': '易', '疫': '疫', '益': '益', '谊': '誼',
        '意': '意', '毅': '毅', '翼': '翼', '因': '因', '阴': '陰', '音': '音', '姻': '姻',
        '银': '銀', '引': '引', '饮': '飲', '隐': '隱', '印': '印', '应': '應', '英': '英',
        '婴': '嬰', '鹰': '鷹', '迎': '迎', '盈': '盈', '营': '營', '蝇': '蠅', '赢': '贏',
        '影': '影', '映': '映', '硬': '硬', '佣': '傭', '拥': '擁', '庸': '庸', '臃': '臃',
        '永': '永', '咏': '詠', '泳': '泳', '勇': '勇', '涌': '湧', '用': '用', '优': '優',
        '忧': '憂', '幽': '幽', '悠': '悠', '尤': '尤', '由': '由', '邮': '郵', '犹': '猶',
        '油': '油', '游': '遊', '友': '友', '有': '有', '又': '又', '右': '右', '幼': '幼',
        '诱': '誘', '于': '於', '余': '餘', '鱼': '魚', '娱': '娛', '渔': '漁', '愉': '愉',
        '愚': '愚', '与': '與', '予': '予', '屿': '嶼', '宇': '宇', '羽': '羽', '雨': '雨',
        '语': '語', '玉': '玉', '吁': '籲', '育': '育', '郁': '鬱', '狱': '獄', '浴': '浴',
        '预': '預', '域': '域', '欲': '慾', '喻': '喻', '寓': '寓', '御': '禦', '裕': '裕',
        '遇': '遇', '愈': '癒', '誉': '譽', '豫': '豫', '元': '元', '员': '員', '园': '園',
        '原': '原', '圆': '圓', '援': '援', '缘': '緣', '源': '源', '远': '遠', '怨': '怨',
        '院': '院', '愿': '願', '约': '約', '月': '月', '岳': '岳', '阅': '閱', '悦': '悅',
        '跃': '躍', '越': '越', '云': '雲', '匀': '勻', '允': '允', '陨': '隕', '孕': '孕',
        '运': '運', '晕': '暈', '韵': '韻', '蕴': '蘊', '杂': '雜', '灾': '災', '载': '載',
        '再': '再', '在': '在', '咱': '咱', '暂': '暫', '赞': '讚', '脏': '髒', '葬': '葬',
        '遭': '遭', '糟': '糟', '早': '早', '枣': '棗', '藻': '藻', '灶': '灶', '皂': '皂',
        '造': '造', '噪': '噪', '燥': '燥', '责': '責', '择': '擇', '泽': '澤', '贼': '賊',
        '怎': '怎', '曾': '曾', '增': '增', '赠': '贈', '扎': '紮', '渣': '渣', '札': '札',
        '轧': '軋', '闸': '閘', '眨': '眨', '栅': '柵', '榨': '榨', '斋': '齋', '债': '債',
        '沾': '沾', '毡': '氈', '粘': '黏', '展': '展', '盏': '盞', '崭': '嶄', '战': '戰',
        '站': '站', '占': '佔', '张': '張', '章': '章', '涨': '漲', '掌': '掌', '丈': '丈',
        '仗': '仗', '帐': '帳', '胀': '脹', '账': '賬', '障': '障', '招': '招', '昭': '昭',
        '找': '找', '沼': '沼', '赵': '趙', '照': '照', '罩': '罩', '兆': '兆', '肇': '肇',
        '折': '折', '哲': '哲', '者': '者', '这': '這', '浙': '浙', '针': '針', '侦': '偵',
        '珍': '珍', '真': '真', '诊': '診', '枕': '枕', '阵': '陣', '振': '振', '震': '震',
        '镇': '鎮', '争': '爭', '征': '徵', '挣': '掙', '睁': '睜', '筝': '箏', '蒸': '蒸',
        '整': '整', '正': '正', '证': '證', '郑': '鄭', '政': '政', '之': '之', '支': '支',
        '只': '只', '汁': '汁', '芝': '芝', '枝': '枝', '知': '知', '织': '織', '脂': '脂',
        '直': '直', '植': '植', '殖': '殖', '职': '職', '执': '執', '值': '值', '止': '止',
        '址': '址', '纸': '紙', '指': '指', '至': '至', '志': '志', '制': '製', '治': '治',
        '质': '質', '致': '致', '智': '智', '置': '置', '滞': '滯', '中': '中', '忠': '忠',
        '终': '終', '钟': '鐘', '肿': '腫', '种': '種', '众': '眾', '重': '重', '州': '州',
        '舟': '舟', '周': '週', '洲': '洲', '粥': '粥', '轴': '軸', '昼': '晝', '皱': '皺',
        '骤': '驟', '朱': '朱', '珠': '珠', '株': '株', '诸': '諸', '猪': '豬', '蛛': '蛛',
        '竹': '竹', '逐': '逐', '烛': '燭', '主': '主', '煮': '煮', '嘱': '囑', '住': '住',
        '助': '助', '注': '註', '驻': '駐', '柱': '柱', '祝': '祝', '著': '著', '筑': '築',
        '抓': '抓', '爪': '爪', '专': '專', '砖': '磚', '转': '轉', '赚': '賺', '庄': '莊',
        '装': '裝', '妆': '妝', '壮': '壯', '状': '狀', '准': '準', '捉': '捉', '桌': '桌',
        '浊': '濁', '兹': '茲', '资': '資', '姿': '姿', '滋': '滋', '子': '子', '紫': '紫',
        '字': '字', '自': '自', '宗': '宗', '综': '綜', '总': '總', '纵': '縱', '走': '走',
        '奏': '奏', '租': '租', '足': '足', '族': '族', '阻': '阻', '组': '組', '祖': '祖',
        '钻': '鑽', '嘴': '嘴', '最': '最', '罪': '罪', '醉': '醉', '尊': '尊', '遵': '遵',
        '昨': '昨', '左': '左', '作': '作', '坐': '坐', '座': '座', '做': '做'
    };

    // 简体转繁体函数
    const convertToTraditional = (text) => {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            result += SC2TC_MAP[char] || char;
        }
        return result;
    };

    // 简繁转换函数结束

    // 创建主容器
    const createContainer = () => {
        const container = document.createElement('div');
        container.className = 'multilingual-container';

        // 初始HTML结构 - 包含搜索框
        container.innerHTML = `
            <div class="multilingual-header">
                POE2DB 助手
                <div class="close-btn" title="关闭">×</div>
            </div>

            <div class="search-section">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="输入简体中文搜索台服...">
                    <button class="search-btn">搜索</button>
                </div>
                <div class="search-results"></div>
            </div>

            <div class="lang-content">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <div>正在初始化...</div>
                </div>
            </div>
        `;

        document.body.appendChild(container);

        // 添加关闭按钮事件
        const closeBtn = container.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            container.remove();
            infoContainer = null;
        });

        // 添加搜索相关事件
        const searchInput = container.querySelector('.search-input');
        const searchBtn = container.querySelector('.search-btn');
        const searchResults = container.querySelector('.search-results');

        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });

        // 搜索处理函数
        const doSearch = (isInstant = false) => {
            handleSearch(container, isInstant);
        };

        // 防抖搜索
        const debouncedSearch = debounce(() => doSearch(true), 500);

        // 输入事件
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val.length > 0) {
                debouncedSearch();
            } else {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
            }
        });

        // 聚焦事件
        searchInput.addEventListener('focus', () => {
            if (searchResults.children.length > 0) {
                searchResults.classList.add('active');
            }
        });

        // 按钮点击
        searchBtn.addEventListener('click', () => doSearch(false));

        // 回车搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                doSearch(false);
            }
        });

        return container;
    };

    // 过滤自动补全数据
    const filterAutocompleteData = (query) => {
        if (!autocompleteData) return [];

        // 转换为繁体用于匹配
        const tcQuery = convertToTraditional(query);
        const lowerQuery = query.toLowerCase();
        const lowerTcQuery = tcQuery.toLowerCase();

        return autocompleteData.filter(item => {
            const label = item.label || '';
            const value = item.value || '';
            const desc = item.desc || '';

            // 匹配逻辑: 标签、值或描述包含查询词
            return label.includes(query) ||
                   label.includes(tcQuery) ||
                   value.toLowerCase().includes(lowerQuery) ||
                   desc.includes(query) ||
                   desc.includes(tcQuery);
        }).slice(0, 20); // 限制返回前20条
    };

    // 渲染搜索结果
    const renderSearchResults = (results, container) => {
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">未找到相关结果</div>';
            container.classList.add('active');
            return;
        }

        results.forEach(item => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            // item结构: {label: "...", value: "...", desc: "...", class: "..."}

            // 处理图标 class
            const iconClass = item.class || '';

            div.innerHTML = `
                <div class="result-info">
                    <div class="result-name">${item.label}</div>
                    <div class="result-type">
                        <span>${item.desc || ''}</span>
                    </div>
                </div>
            `;

            div.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止冒泡

                // 跳转逻辑
                // 强制跳转到简体中文页面
                let targetUrl = item.value;

                if (targetUrl.startsWith('http')) {
                    // 如果是完整URL，尝试将 /tw/ 替换为 /cn/
                    targetUrl = targetUrl.replace('/tw/', '/cn/');
                } else {
                    // 如果是相对路径，直接拼接 /cn/
                    // 移除开头的 / 防止双斜杠
                    const path = targetUrl.startsWith('/') ? targetUrl.slice(1) : targetUrl;
                    targetUrl = `https://poe2db.tw/cn/${path}`;
                }

                console.log('跳转到:', targetUrl);
                window.location.href = targetUrl;
            });

            container.appendChild(div);
        });

        container.classList.add('active');
    };

    // 处理搜索逻辑
    const handleSearch = (container, isInstant = false) => {
        const input = container.querySelector('.search-input');
        const btn = container.querySelector('.search-btn');
        const resultsContainer = container.querySelector('.search-results');
        const searchText = input.value.trim();

        if (!searchText) {
            resultsContainer.classList.remove('active');
            return;
        }

        // 如果是即时搜索，显示加载状态
        if (isInstant) {
            input.classList.add('loading');
        } else {
            btn.disabled = true;
            btn.textContent = '搜索中...';
        }

        // 如果有本地数据，优先使用本地数据
        if (autocompleteData) {
            const results = filterAutocompleteData(searchText);
            renderSearchResults(results, resultsContainer);

            if (isInstant) input.classList.remove('loading');
            else {
                btn.disabled = false;
                btn.textContent = '搜索';
            }
            return;
        }

        // 如果没有本地数据（尚未加载完成），尝试加载或使用在线搜索（这里先尝试加载）
        if (!autocompleteData) {
            loadAutocompleteData();
            // 临时显示提示
            resultsContainer.innerHTML = '<div class="no-results">正在初始化搜索数据，请稍后重试...</div>';
            resultsContainer.classList.add('active');

            if (isInstant) input.classList.remove('loading');
            else {
                btn.disabled = false;
                btn.textContent = '搜索';
            }
            return;
        }
    };


    // 更新容器内容
    const updateContainer = (container, langInfoMap, currentPath) => {
        const contentArea = container.querySelector('.lang-content');
        if (!contentArea) return;

        let html = '';

        // 语言名称中文显示和排序
        const langNames = {
            'cn': '简体中文',
            'tw': '繁体中文',
            'us': '英文'
        };

        // 确保简体中文始终排在最上面
        const sortedLangs = Object.keys(langInfoMap).sort((a, b) => {
            if (a === 'cn') return -1;
            if (b === 'cn') return 1;
            // 其他语言按顺序排列
            const order = ['tw', 'us'];
            return order.indexOf(a) - order.indexOf(b);
        });

        // 按排序后的语言遍历
        sortedLangs.forEach(lang => {
            const info = langInfoMap[lang];

            html += `
                <div class="language-section">
                    <div class="language-title">${langNames[lang] || lang.toUpperCase()}</div>
                    <div class="language-content">
                        <div class="content-title">名称</div>
                        <div class="title-row">
                            <div class="skill-name" data-item-name="${info.title}">${info.title}</div>
                            <div class="button-group">
                                <button class="func-btn copy-btn" data-action="copy" data-item="${info.title}" data-lang="${lang}">复制</button>
                                <button class="func-btn buy-btn" data-action="buy" data-item="${info.title}" data-lang="${lang}">购买</button>
                                <button class="func-btn switch-btn" data-action="switch" data-path="${currentPath}">切换语言</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        contentArea.innerHTML = html;

        // 添加事件监听器
        contentArea.querySelectorAll('.func-btn').forEach(btn => {
            btn.addEventListener('click', handleButtonClick);
        });
    };

    // 处理按钮点击事件
    const handleButtonClick = (event) => {
        // 确保获取到的是按钮元素，而不是内部的子元素
        let btn = event.target;
        if (!btn.classList.contains('func-btn')) {
            btn = btn.closest('.func-btn');
        }

        if (!btn) return;

        const action = btn.dataset.action;
        const itemName = btn.dataset.item;
        const itemLang = btn.dataset.lang; // 物品名称的语言
        const path = btn.dataset.path;

        if (action === 'copy') {
            copyItemName(itemName, btn);
        } else if (action === 'buy') {
            buyItem(itemName, itemLang, btn); // 传递物品语言
        } else if (action === 'switch') {
            const currentLang = getCurrentLangFromUrl();
            // 直接调用showLanguageMenu，跳过switchLanguage函数，简化调用链
            const allLangs = ['cn', 'tw', 'us'];
            showLanguageMenu(allLangs, path, btn, currentLang);
        }

    };

    // 切换语言
    const switchLanguage = (currentLang, path, btn) => {
        // 获取所有语言版本，包括当前语言
        const allLangs = ['cn', 'tw', 'us'];

        // 显示所有语言选项，当前语言带有已选择标记
        showLanguageMenu(allLangs, path, btn, currentLang);
    };

    // 显示语言选择菜单
    const showLanguageMenu = (langs, path, btn, currentLang) => {
        // 移除已存在的菜单
        const existingMenu = document.querySelector('.language-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // 创建菜单
        const menu = document.createElement('div');
        menu.className = 'language-menu';
        menu.style.cssText = `
            position: absolute;
            background: rgba(26, 32, 44, 0.95);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            padding: 8px 0;
            z-index: 10002;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        `;

        // 语言名称映射
        const langNames = {
            'cn': '简体中文',
            'tw': '繁体中文',
            'us': '英文'
        };

        // 添加菜单选项
        langs.forEach(lang => {
            const menuItem = document.createElement('div');
            const isCurrent = lang === currentLang;

            menuItem.style.cssText = `
                padding: 8px 16px;
                cursor: ${isCurrent ? 'default' : 'pointer'};
                color: ${isCurrent ? '#6366f1' : '#e2e8f0'};
                font-size: 12px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
            `;

            // 语言名称和已选择标记
            menuItem.innerHTML = `
                <span>${langNames[lang] || lang.toUpperCase()}</span>
                ${isCurrent ? '<span style="font-size: 14px;">✓</span>' : ''}
            `;

            // 非当前语言添加点击事件
            if (!isCurrent) {
                menuItem.onclick = () => {
                    const targetUrl = `https://poe2db.tw/${lang}/${path}`;
                    window.location.href = targetUrl;
                    menu.remove();
                };

                // 悬停效果
                menuItem.onmouseenter = () => {
                    menuItem.style.background = 'rgba(99, 102, 241, 0.2)';
                    menuItem.style.color = '#818cf8';
                };

                menuItem.onmouseleave = () => {
                    menuItem.style.background = 'transparent';
                    menuItem.style.color = '#e2e8f0';
                };
            } else {
                // 当前语言添加特殊样式
                menuItem.style.fontWeight = '600';
            }

            menu.appendChild(menuItem);
        });

        // 定位菜单
        const rect = btn.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = rect.bottom + 5 + 'px';

        // 添加到文档
        document.body.appendChild(menu);

        // 点击外部关闭菜单
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    };

    // 复制物品名称
    const copyItemName = (itemName, btn) => {
        navigator.clipboard.writeText(itemName).then(() => {
            showNotification('已复制到剪贴板!', btn, 'success');
        }).catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败', btn, 'error');
        });
    };

    // 购买物品
    const buyItem = (itemName, itemLang, btn) => {
        // 先显示提示，确保用户能看到
        showNotification('已复制，正在跳转市集页', btn, 'success');

        // 复制物品名称
        navigator.clipboard.writeText(itemName).catch(err => {
            console.error('复制失败:', err);
        });

        let marketUrl = '';

        // 根据物品名称的语言选择对应市集
        switch (itemLang) {
            case 'us':
                // 英文物品：跳转到国际服市集，包含搜索词
                marketUrl = `https://www.pathofexile.com/trade2/search/poe2/${encodeURIComponent(itemName)}`;
                break;
            case 'tw':
                // 繁体中文物品：跳转到台服市集
                marketUrl = 'https://pathofexile.tw/trade2';
                break;
            case 'cn':
            default:
                // 简体中文物品：跳转到国服市集
                marketUrl = 'https://poe.game.qq.com/trade2/search/poe2/';
                break;
        }

        // 延迟1500毫秒（1.5秒）后跳转到市集页面，确保用户有足够时间看到提示
        setTimeout(() => {
            window.open(marketUrl, '_blank');
        }, 1500);
    };

    // 显示通知
    const showNotification = (message, btn, type) => {
        const notification = document.createElement('div');
        notification.className = `copy-tooltip ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 2秒后移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 2000);
    };

    // 主函数
    const main = () => {
        // 加载自动补全数据
        loadAutocompleteData();

        const current = getCurrentLangAndPath();

        if (!current) return;

        const otherLangUrls = getOtherLangUrls(current.lang, current.path);
        infoContainer = createContainer(); // 赋值给全局变量
        const langInfoMap = {};

        let completedRequests = 0;
        let hasError = false;

        otherLangUrls.forEach(url => {
            const lang = url.match(/https:\/\/poe2db\.tw\/(cn|tw|us)\//)[1];

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 5000,
                onload: (response) => {
                    try {
                        if (response.status === 200) {
                            const info = extractInfo(response.responseText);
                            langInfoMap[lang] = info;
                        } else {
                            langInfoMap[lang] = {
                                title: '加载失败',
                                content: `HTTP错误: ${response.status}`,
                                attributes: []
                            };
                            hasError = true;
                        }
                    } catch (error) {
                        langInfoMap[lang] = {
                            title: '解析错误',
                            content: '无法解析页面内容',
                            attributes: []
                        };
                        hasError = true;
                    } finally {
                        completedRequests++;
                        if (completedRequests === otherLangUrls.length) {
                            updateContainer(infoContainer, langInfoMap, current.path);
                        }
                    }
                },
                onerror: (error) => {
                    langInfoMap[lang] = {
                        title: '网络错误',
                        content: '无法获取该语言版本',
                        attributes: []
                    };
                    hasError = true;
                    completedRequests++;
                    if (completedRequests === otherLangUrls.length) {
                        updateContainer(infoContainer, langInfoMap, current.path);
                    }
                },
                ontimeout: () => {
                    langInfoMap[lang] = {
                        title: '超时错误',
                        content: '请求超时',
                        attributes: []
                    };
                    hasError = true;
                    completedRequests++;
                    if (completedRequests === otherLangUrls.length) {
                        updateContainer(infoContainer, langInfoMap, current.path);
                    }
                }
            });
        });
    };

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            createToggleButton();
            main();
        });
    } else {
        createToggleButton();
        main();
    }

})();
