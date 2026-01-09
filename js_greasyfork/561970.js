// ==UserScript==
// @name         DingXX HLTB
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 DingXX 游戏页面显示 HowLongToBeat 通关时长数据
// @author       You
// @match        https://dingxx.com/games/*
// @match        https://www.dingxx.com/games/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @connect      summer-queen-c430.3055632901.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/561970/DingXX%20HLTB.user.js
// @updateURL https://update.greasyfork.org/scripts/561970/DingXX%20HLTB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HLTB_API = 'https://summer-queen-c430.3055632901.workers.dev/search';

    GM_addStyle(`
        .hltb-widget {
            background: #ffffff;
            border-radius: 12px;
            padding: 16px 20px;
            margin: 16px 0;
            color: #111827;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #E5E7EB;
        }
        /* 深色模式支持 */
        html.dark .hltb-widget,
        .dark .hltb-widget {
            background: #1F2937;
            color: #F9FAFB;
            border-color: #374151;
        }
        .hltb-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #E5E7EB;
        }
        html.dark .hltb-header,
        .dark .hltb-header {
            border-bottom-color: #374151;
        }
        .hltb-cover {
            width: 60px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .hltb-info {
            flex: 1;
        }
        .hltb-game-title {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 4px;
        }
        html.dark .hltb-game-title,
        .dark .hltb-game-title {
            color: #F9FAFB;
        }
        .hltb-meta {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
        }
        .hltb-meta-item {
            font-size: 13px;
            color: #6B7280;
        }
        html.dark .hltb-meta-item,
        .dark .hltb-meta-item {
            color: #9CA3AF;
        }
        .hltb-score {
            background: linear-gradient(135deg, #F97316, #EA580C);
            color: #fff;
            padding: 2px 10px;
            border-radius: 6px;
            font-weight: 700;
            font-size: 13px;
        }
        .hltb-times-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 16px;
        }
        .hltb-time-card {
            background: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            padding: 14px 12px;
            text-align: center;
            transition: all 0.2s ease;
        }
        html.dark .hltb-time-card,
        .dark .hltb-time-card {
            background: #374151;
            border-color: #4B5563;
        }
        .hltb-time-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .hltb-time-icon {
            font-size: 20px;
            margin-bottom: 6px;
        }
        .hltb-time-label {
            font-size: 12px;
            color: #6B7280;
            margin-bottom: 6px;
        }
        html.dark .hltb-time-label,
        .dark .hltb-time-label {
            color: #9CA3AF;
        }
        .hltb-time-value {
            font-size: 20px;
            font-weight: 800;
            color: #F97316;
        }
        .hltb-stats {
            background: #F9FAFB;
            border-radius: 8px;
            padding: 12px 16px;
            border: 1px solid #E5E7EB;
        }
        html.dark .hltb-stats,
        .dark .hltb-stats {
            background: #374151;
            border-color: #4B5563;
        }
        .hltb-stats-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #E5E7EB;
        }
        html.dark .hltb-stats-row,
        .dark .hltb-stats-row {
            border-bottom-color: #4B5563;
        }
        .hltb-stats-row:last-child {
            border-bottom: none;
        }
        .hltb-stats-label {
            font-size: 13px;
            color: #6B7280;
            font-weight: 500;
        }
        html.dark .hltb-stats-label,
        .dark .hltb-stats-label {
            color: #9CA3AF;
        }
        .hltb-stats-values {
            display: flex;
            gap: 16px;
            font-size: 13px;
        }
        .hltb-stats-values span {
            color: #374151;
        }
        html.dark .hltb-stats-values span,
        .dark .hltb-stats-values span {
            color: #D1D5DB;
        }
        .hltb-stats-values .fastest { color: #10B981; }
        .hltb-stats-values .slowest { color: #EF4444; }
        .hltb-loading {
            text-align: center;
            padding: 32px;
            color: #6B7280;
        }
        .hltb-loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #E5E7EB;
            border-top-color: #F97316;
            border-radius: 50%;
            animation: hltb-spin 1s linear infinite;
            margin: 0 auto 12px;
        }
        @keyframes hltb-spin {
            to { transform: rotate(360deg); }
        }
        .hltb-error {
            text-align: center;
            padding: 24px;
            color: #EF4444;
        }
        .hltb-section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 15px;
            font-weight: 600;
            color: #F97316;
            margin-bottom: 12px;
        }
    `);

    function getGameName() {
        // 方法1: 从URL提取英文名 (如 god-of-war)
        const urlMatch = window.location.pathname.match(/\/games\/[^-]+-(.+)$/);
        if (urlMatch) {
            const slug = urlMatch[1].replace(/-/g, ' ');
            // 转换为标题格式
            const titleCase = slug.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            console.log('[HLTB] 从URL提取:', titleCase);
            return titleCase;
        }

        // 方法2: 从页面标题提取
        const pageTitle = document.title;
        if (pageTitle) {
            // 通常标题格式为 "游戏名 - DingXX"
            const match = pageTitle.match(/^(.+?)\s*[-|]/);
            if (match) {
                console.log('[HLTB] 从标题提取:', match[1]);
                return match[1].trim();
            }
        }

        // 方法3: 从H1标题提取
        const h1 = document.querySelector('h1');
        if (h1) {
            console.log('[HLTB] 从H1提取:', h1.innerText);
            return h1.innerText.trim();
        }

        return null;
    }

    function formatHours(hours) {
        if (!hours || hours <= 0) return '-';
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (h === 0) return `${m}分钟`;
        if (m > 0) return `${h}h ${m}m`;
        return `${h}h`;
    }

    function formatSeconds(seconds) {
        if (!seconds || seconds <= 0) return '-';
        return formatHours(seconds / 3600);
    }

    function createWidget(data) {
        const widget = document.createElement('div');
        widget.className = 'hltb-widget';

        if (!data.found) {
            widget.innerHTML = `<div class="hltb-error">❌ 未找到 "${data.searchName || '游戏'}" 的通关时长数据</div>`;
            return widget;
        }

        widget.innerHTML = `
            <div class="hltb-section-title">
                ⏱️ 通关时长
            </div>
            <div class="hltb-header">
                ${data.fullImageUrl ? `<img class="hltb-cover" src="${data.fullImageUrl}" alt="">` : ''}
                <div class="hltb-info">
                    <div class="hltb-game-title">${data.gameName}</div>
                    <div class="hltb-meta">
                        <span class="hltb-meta-item">🎮 ${data.profilePlatforms || 'PlayStation'}</span>
                        ${data.reviewScore ? `<span class="hltb-score">${data.reviewScore}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="hltb-times-grid">
                <div class="hltb-time-card">
                    <div class="hltb-time-icon">🎯</div>
                    <div class="hltb-time-label">主线剧情</div>
                    <div class="hltb-time-value">${formatHours(data.mainStoryHours)}</div>
                </div>
                <div class="hltb-time-card">
                    <div class="hltb-time-icon">⭐</div>
                    <div class="hltb-time-label">主线 + 额外</div>
                    <div class="hltb-time-value">${formatHours(data.mainExtraHours)}</div>
                </div>
                <div class="hltb-time-card">
                    <div class="hltb-time-icon">🏆</div>
                    <div class="hltb-time-label">白金通关</div>
                    <div class="hltb-time-value">${formatHours(data.completionistHours)}</div>
                </div>
            </div>

            <div class="hltb-stats">
                <div class="hltb-stats-row">
                    <span class="hltb-stats-label">🎯 主线平均</span>
                    <div class="hltb-stats-values">
                        <span>均 ${formatSeconds(data.compMainAvg)}</span>
                        <span class="fastest">快 ${formatSeconds(data.compMainLow)}</span>
                        <span class="slowest">慢 ${formatSeconds(data.compMainHigh)}</span>
                    </div>
                </div>
                <div class="hltb-stats-row">
                    <span class="hltb-stats-label">🏆 白金平均</span>
                    <div class="hltb-stats-values">
                        <span>均 ${formatSeconds(data.comp100Avg)}</span>
                        <span class="fastest">快 ${formatSeconds(data.comp100Low)}</span>
                        <span class="slowest">慢 ${formatSeconds(data.comp100High)}</span>
                    </div>
                </div>
            </div>
        `;
        return widget;
    }

    function findInsertionPoint() {
        // 方法1: 在导航标签栏(奖杯/评价/话题/排行)之后插入
        const tabsContainer = document.querySelector('div.bg-background.rounded-lg.border.flex.gap-1.overflow-x-auto');
        if (tabsContainer) {
            return { element: tabsContainer, position: 'after' };
        }

        // 方法2: 查找包含"奖杯"链接的导航栏
        const trophyLink = Array.from(document.querySelectorAll('a')).find(a =>
            a.textContent.includes('奖杯') && a.href.includes(window.location.pathname)
        );
        if (trophyLink) {
            const navContainer = trophyLink.closest('div.rounded-lg');
            if (navContainer) {
                return { element: navContainer, position: 'after' };
            }
        }

        // 方法3: 在H1标题之后插入
        const h1 = document.querySelector('h1');
        if (h1) {
            const container = h1.closest('div.flex') || h1.parentElement;
            if (container) {
                return { element: container, position: 'after' };
            }
        }

        // 方法4: 主内容区域
        const main = document.querySelector('main');
        if (main && main.children.length > 0) {
            // 跳过前面的头部区域，找到第一个内容卡片
            for (let i = 0; i < main.children.length; i++) {
                const child = main.children[i];
                if (child.classList.contains('bg-white') || child.querySelector('.bg-white')) {
                    return { element: child, position: 'before' };
                }
            }
            return { element: main.children[0], position: 'after' };
        }

        return null;
    }

    function init() {
        // 检查是否已经插入过组件
        if (document.querySelector('.hltb-widget')) {
            console.log('[HLTB] 组件已存在，跳过');
            return;
        }

        // 检查是否在游戏详情页
        if (!window.location.pathname.match(/\/games\/[^/]+$/)) {
            console.log('[HLTB] 非游戏详情页，跳过');
            return;
        }

        // 等待页面完全加载
        setTimeout(() => {
            // 再次检查（防止并发）
            if (document.querySelector('.hltb-widget')) return;

            const gameName = getGameName();
            if (!gameName) {
                console.log('[HLTB] 未能提取游戏名');
                return;
            }

            console.log('[HLTB] 开始查询:', gameName);

            const placeholder = document.createElement('div');
            placeholder.className = 'hltb-widget hltb-loading';
            placeholder.innerHTML = '<div class="hltb-loading-spinner"></div>正在获取通关时长数据...';

            const insertPoint = findInsertionPoint();
            if (insertPoint) {
                if (insertPoint.position === 'before') {
                    insertPoint.element.parentNode.insertBefore(placeholder, insertPoint.element);
                } else {
                    insertPoint.element.parentNode.insertBefore(placeholder, insertPoint.element.nextSibling);
                }
            } else {
                // 兜底：插入到body
                document.body.insertBefore(placeholder, document.body.firstChild);
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `${HLTB_API}?name=${encodeURIComponent(gameName)}`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        placeholder.replaceWith(createWidget(data));
                    } catch (e) {
                        placeholder.innerHTML = '<div class="hltb-error">数据解析失败</div>';
                    }
                },
                onerror: function () {
                    placeholder.innerHTML = '<div class="hltb-error">请求失败</div>';
                }
            });
        }, 1000); // 等待1秒让页面渲染完成
    }

    // 监听 URL 变化（支持 SPA 路由）
    let lastUrl = location.href;

    // 使用 MutationObserver 监听 DOM 变化来检测页面切换
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[HLTB] 检测到页面跳转:', location.href);
            // 移除旧的组件
            const oldWidget = document.querySelector('.hltb-widget');
            if (oldWidget) oldWidget.remove();
            // 延迟初始化，等待新页面渲染
            setTimeout(init, 500);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', () => {
        console.log('[HLTB] popstate 事件触发');
        const oldWidget = document.querySelector('.hltb-widget');
        if (oldWidget) oldWidget.remove();
        setTimeout(init, 500);
    });

    // 拦截 pushState 和 replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
        originalPushState.apply(this, args);
        console.log('[HLTB] pushState 触发');
        const oldWidget = document.querySelector('.hltb-widget');
        if (oldWidget) oldWidget.remove();
        setTimeout(init, 500);
    };

    history.replaceState = function (...args) {
        originalReplaceState.apply(this, args);
        console.log('[HLTB] replaceState 触发');
        const oldWidget = document.querySelector('.hltb-widget');
        if (oldWidget) oldWidget.remove();
        setTimeout(init, 500);
    };

    // 初始加载
    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();