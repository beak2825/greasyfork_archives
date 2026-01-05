// ==UserScript==
// @name         JavBus 影视追踪助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动检索JavBus页面影视列表，显示浏览状态、收藏状态和评分，点击时上报查看记录
// @author       You
// @match        https://www.javbus.com/*
// @match        https://javbus.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      qqq.bigorange.work
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561207/JavBus%20%E5%BD%B1%E8%A7%86%E8%BF%BD%E8%B8%AA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561207/JavBus%20%E5%BD%B1%E8%A7%86%E8%BF%BD%E8%B8%AA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        API_BASE: 'https://qqq.bigorange.work',
        CACHE_EXPIRY_DAYS: 30,
        BATCH_SIZE: 50,          // 每批次查询的番号数量
        DEBOUNCE_DELAY: 500,     // 防抖延迟（毫秒）
        OBSERVER_THROTTLE: 1000  // MutationObserver 节流时间（毫秒）
    };

    // ==================== 样式定义 ====================
    const STYLES = `
        .jt-badge-container {
            position: absolute;
            top: 5px;
            left: 5px;
            display: flex;
            flex-direction: column;
            gap: 3px;
            z-index: 100;
            pointer-events: none;
        }

        .jt-badge {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            white-space: nowrap;
        }

        .jt-badge-viewed {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .jt-badge-exists {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .jt-badge-score {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .jt-badge-score.high {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .jt-item-viewed {
            position: relative;
        }

        .jt-item-viewed::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(102, 126, 234, 0.15);
            pointer-events: none;
            border-radius: 4px;
        }

        .jt-item-exists::after {
            background: rgba(17, 153, 142, 0.15) !important;
        }

        /* 详情页样式 */
        .jt-detail-info {
            margin: 10px 0;
            padding: 10px 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }

        .jt-detail-info.exists {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .jt-detail-info .jt-info-row {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }

        .jt-detail-info .jt-info-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .jt-detail-info .jt-label {
            opacity: 0.8;
        }

        .jt-detail-info .jt-value {
            font-weight: bold;
        }

        .jt-loading {
            opacity: 0.5;
        }
    `;

    // ==================== 工具函数 ====================

    /**
     * 注入样式到页面
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    /**
     * 生成缓存键
     */
    function getCacheKey(code) {
        return `jt_cache_${code.toUpperCase()}`;
    }

    /**
     * 获取缓存数据
     */
    function getCache(code) {
        const key = getCacheKey(code);
        const cached = GM_getValue(key, null);

        if (!cached) return null;

        // 检查是否过期
        const expiry = CONFIG.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        if (Date.now() - cached.timestamp > expiry) {
            return null;
        }

        return cached.data;
    }

    /**
     * 设置缓存数据
     */
    function setCache(code, data) {
        const key = getCacheKey(code);
        GM_setValue(key, {
            timestamp: Date.now(),
            data: data
        });
    }

    /**
     * 清除指定番号的缓存（用于更新后刷新）
     */
    function clearCache(code) {
        const key = getCacheKey(code);
        GM_setValue(key, null);
    }

    /**
     * 发起API请求
     */
    function apiRequest(path, data) {
        const url = `${CONFIG.API_BASE}${path}`;
        console.log(`[JavBus Tracker] 请求: ${url}`, data);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(data),
                timeout: 30000,
                onload: (response) => {
                    console.log(`[JavBus Tracker] 响应状态: ${response.status}`, response);

                    // 检查HTTP状态码
                    if (response.status < 200 || response.status >= 300) {
                        console.error(`[JavBus Tracker] HTTP错误: ${response.status}`, response.responseText?.substring(0, 500));
                        reject(new Error(`HTTP Error: ${response.status}`));
                        return;
                    }

                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.code === 0) {
                            resolve(result.data);
                        } else {
                            reject(new Error(`API Error: ${result.code}`));
                        }
                    } catch (e) {
                        console.error('[JavBus Tracker] JSON解析失败:', response.responseText?.substring(0, 500));
                        reject(new Error(`JSON Parse Error: ${e.message}`));
                    }
                },
                onerror: (error) => {
                    console.error('[JavBus Tracker] 请求失败:', error);
                    reject(error);
                },
                ontimeout: () => {
                    console.error('[JavBus Tracker] 请求超时');
                    reject(new Error('Request timeout'));
                }
            });
        });
    }

    /**
     * 批量查询番号状态
     */
    async function batchQueryStatus(codes) {
        if (codes.length === 0) return [];

        try {
            const result = await apiRequest('/api/film/batch-status', { codes });
            return result.items || [];
        } catch (e) {
            console.error('[JavBus Tracker] 批量查询失败:', e);
            return [];
        }
    }

    /**
     * 上报查看记录
     */
    async function trackView(code) {
        try {
            const result = await apiRequest('/api/film/track', { code });
            // 清除缓存以便下次刷新状态
            clearCache(code);
            console.log(`[JavBus Tracker] 已上报查看: ${code}`);
            return result;
        } catch (e) {
            console.error('[JavBus Tracker] 上报失败:', e);
            return null;
        }
    }

    /**
     * 防抖函数
     */
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    /**
     * 节流函数
     */
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==================== 页面解析 ====================

    /**
     * 从URL或元素中提取番号
     */
    function extractCode(element) {
        // 尝试从链接中提取
        const link = element.querySelector('a[href]') || element.closest('a[href]');
        if (link) {
            const match = link.href.match(/\/([A-Za-z]+-\d+)/);
            if (match) return match[1].toUpperCase();
        }

        // 尝试从图片alt属性提取
        const img = element.querySelector('img[title]');
        if (img) {
            const code = img.title.split(' ')[0];
            if (/^[A-Za-z]+-\d+$/.test(code)) return code.toUpperCase();
        }

        // 尝试从文本中提取
        const text = element.textContent;
        const textMatch = text.match(/([A-Za-z]+-\d+)/);
        if (textMatch) return textMatch[1].toUpperCase();

        return null;
    }

    /**
     * 获取页面上所有影视项
     */
    function getMovieItems() {
        // JavBus 列表页的电影项选择器
        const selectors = [
            '#waterfall .item',           // 主列表
            '.movie-box',                  // 某些页面的格式
            '#waterfall > div.item',      // 瀑布流项
            '.photo-frame'                 // 图片框架
        ];

        const items = new Map(); // 使用Map去重

        for (const selector of selectors) {
            document.querySelectorAll(selector).forEach(el => {
                const code = extractCode(el);
                if (code && !items.has(code)) {
                    items.set(code, el);
                }
            });
        }

        return items;
    }

    /**
     * 获取当前详情页的番号
     */
    function getDetailPageCode() {
        // 从URL提取
        const urlMatch = window.location.pathname.match(/\/([A-Za-z]+-\d+)/);
        if (urlMatch) return urlMatch[1].toUpperCase();

        // 从页面标题提取
        const titleEl = document.querySelector('.container h3');
        if (titleEl) {
            const match = titleEl.textContent.match(/([A-Za-z]+-\d+)/);
            if (match) return match[1].toUpperCase();
        }

        return null;
    }

    /**
     * 判断是否为详情页
     */
    function isDetailPage() {
        return window.location.pathname.match(/^\/[A-Za-z]+-\d+/);
    }

    // ==================== UI渲染 ====================

    /**
     * 为单个影视项添加状态徽章
     */
    function renderItemBadges(element, status) {
        // 移除旧的徽章
        const oldBadges = element.querySelector('.jt-badge-container');
        if (oldBadges) oldBadges.remove();

        // 移除旧的样式类
        element.classList.remove('jt-item-viewed', 'jt-item-exists');

        // 确保元素有定位
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'static') {
            element.style.position = 'relative';
        }

        // 创建徽章容器
        const container = document.createElement('div');
        container.className = 'jt-badge-container';

        // 已浏览徽章
        if (status.viewed) {
            const badge = document.createElement('span');
            badge.className = 'jt-badge jt-badge-viewed';
            badge.textContent = '👁 已看';
            container.appendChild(badge);
            element.classList.add('jt-item-viewed');
        }

        // 已入库徽章
        if (status.exists) {
            const badge = document.createElement('span');
            badge.className = 'jt-badge jt-badge-exists';
            badge.textContent = '📁 已收藏';
            container.appendChild(badge);
            element.classList.add('jt-item-exists');
        }

        // 评分徽章
        if (status.score !== undefined && status.score > 0) {
            const badge = document.createElement('span');
            badge.className = 'jt-badge jt-badge-score' + (status.score >= 80 ? ' high' : '');
            badge.textContent = `⭐ ${status.score.toFixed(1)}`;
            container.appendChild(badge);
        }

        if (container.children.length > 0) {
            element.appendChild(container);
        }
    }

    /**
     * 渲染详情页信息
     */
    function renderDetailInfo(status) {
        // 移除旧的信息
        const oldInfo = document.querySelector('.jt-detail-info');
        if (oldInfo) oldInfo.remove();

        const container = document.createElement('div');
        container.className = 'jt-detail-info' + (status.exists ? ' exists' : '');

        const row = document.createElement('div');
        row.className = 'jt-info-row';

        // 收藏状态
        const existsItem = document.createElement('span');
        existsItem.className = 'jt-info-item';
        existsItem.innerHTML = `
            <span class="jt-label">收藏状态:</span>
            <span class="jt-value">${status.exists ? '✅ 已收藏' : '❌ 未收藏'}</span>
        `;
        row.appendChild(existsItem);

        // 浏览状态
        const viewedItem = document.createElement('span');
        viewedItem.className = 'jt-info-item';
        viewedItem.innerHTML = `
            <span class="jt-label">浏览状态:</span>
            <span class="jt-value">${status.viewed ? '👁 已浏览' : '🆕 首次访问'}</span>
        `;
        row.appendChild(viewedItem);

        // 查看时间
        if (status.view_time) {
            const timeItem = document.createElement('span');
            timeItem.className = 'jt-info-item';
            const date = new Date(status.view_time * 1000);
            timeItem.innerHTML = `
                <span class="jt-label">上次查看:</span>
                <span class="jt-value">${date.toLocaleString('zh-CN')}</span>
            `;
            row.appendChild(timeItem);
        }

        // 评分
        if (status.score !== undefined && status.score > 0) {
            const scoreItem = document.createElement('span');
            scoreItem.className = 'jt-info-item';
            scoreItem.innerHTML = `
                <span class="jt-label">评分:</span>
                <span class="jt-value">⭐ ${status.score.toFixed(1)}</span>
            `;
            row.appendChild(scoreItem);
        }

        container.appendChild(row);

        // 插入到页面
        const target = document.querySelector('.container .row.movie') ||
            document.querySelector('.container h3') ||
            document.querySelector('.container');

        if (target) {
            target.parentNode.insertBefore(container, target.nextSibling);
        }
    }

    // ==================== 核心逻辑 ====================

    // 已处理的番号集合
    const processedCodes = new Set();
    // 待查询的番号队列
    let pendingCodes = [];

    /**
     * 处理待查询队列
     */
    const processPendingQueue = debounce(async () => {
        if (pendingCodes.length === 0) return;

        // 获取需要查询的番号（排除已缓存的）
        const codesToQuery = [];
        const cachedResults = new Map();

        for (const code of pendingCodes) {
            const cached = getCache(code);
            if (cached) {
                cachedResults.set(code, cached);
            } else {
                codesToQuery.push(code);
            }
        }

        // 清空队列
        const currentBatch = [...pendingCodes];
        pendingCodes = [];

        // 应用缓存结果
        const movieItems = getMovieItems();
        for (const [code, status] of cachedResults) {
            const element = movieItems.get(code);
            if (element) {
                renderItemBadges(element, status);
            }
        }

        // 分批查询API
        if (codesToQuery.length > 0) {
            for (let i = 0; i < codesToQuery.length; i += CONFIG.BATCH_SIZE) {
                const batch = codesToQuery.slice(i, i + CONFIG.BATCH_SIZE);
                const results = await batchQueryStatus(batch);

                // 处理结果
                for (const item of results) {
                    const code = item.code.toUpperCase();

                    // 缓存结果
                    setCache(code, item);

                    // 渲染UI
                    const element = movieItems.get(code);
                    if (element) {
                        renderItemBadges(element, item);
                    }
                }
            }
        }

        // 标记为已处理
        currentBatch.forEach(code => processedCodes.add(code));

    }, CONFIG.DEBOUNCE_DELAY);

    /**
     * 扫描页面并处理新项目
     */
    function scanAndProcess() {
        const movieItems = getMovieItems();

        for (const [code, element] of movieItems) {
            if (!processedCodes.has(code) && !pendingCodes.includes(code)) {
                pendingCodes.push(code);

                // 添加点击事件监听
                const link = element.querySelector('a[href]') || element;
                if (!link.dataset.jtTracked) {
                    link.dataset.jtTracked = 'true';
                    link.addEventListener('click', () => {
                        trackView(code);
                    });
                }
            }
        }

        if (pendingCodes.length > 0) {
            processPendingQueue();
        }
    }

    /**
     * 处理详情页
     */
    async function handleDetailPage() {
        const code = getDetailPageCode();
        if (!code) return;

        console.log(`[JavBus Tracker] 详情页: ${code}`);

        // 先尝试显示缓存的状态
        const cached = getCache(code);
        if (cached) {
            renderDetailInfo(cached);
        }

        // 先查询之前的状态（在上报之前查询，这样显示的是历史记录）
        const results = await batchQueryStatus([code]);
        if (results.length > 0) {
            setCache(code, results[0]);
            renderDetailInfo(results[0]);
        }

        // 最后上报本次查看记录（不影响当前显示的状态）
        trackView(code);
    }

    /**
     * 设置 MutationObserver 监听动态内容
     */
    function setupObserver() {
        const throttledScan = throttle(scanAndProcess, CONFIG.OBSERVER_THROTTLE);

        const observer = new MutationObserver((mutations) => {
            let hasNewItems = false;

            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是影视项或包含影视项
                            if (node.matches?.('.item, .movie-box') ||
                                node.querySelector?.('.item, .movie-box')) {
                                hasNewItems = true;
                                break;
                            }
                        }
                    }
                }
                if (hasNewItems) break;
            }

            if (hasNewItems) {
                throttledScan();
            }
        });

        // 观察整个文档
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    /**
     * 设置滚动监听（备用方案）
     */
    function setupScrollListener() {
        const throttledScan = throttle(scanAndProcess, CONFIG.OBSERVER_THROTTLE);

        window.addEventListener('scroll', () => {
            // 检查是否接近底部
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= docHeight - 500) {
                throttledScan();
            }
        }, { passive: true });
    }

    // ==================== 初始化 ====================

    function init() {
        console.log('[JavBus Tracker] 初始化中...');

        // 注入样式
        injectStyles();

        if (isDetailPage()) {
            // 详情页处理
            handleDetailPage();
        } else {
            // 列表页处理
            scanAndProcess();
            setupObserver();
            setupScrollListener();
        }

        console.log('[JavBus Tracker] 初始化完成');
    }

    // 等待DOM完全加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
