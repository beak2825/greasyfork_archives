// ==UserScript==
// @name         论坛翻页时光机（尝鲜版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为 Discourse 论坛提供翻页导航和旧帖回溯功能
// @author       selaky
// @match        https://meta.appinn.net/*
// @match        https://linux.do/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558402/%E8%AE%BA%E5%9D%9B%E7%BF%BB%E9%A1%B5%E6%97%B6%E5%85%89%E6%9C%BA%EF%BC%88%E5%B0%9D%E9%B2%9C%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558402/%E8%AE%BA%E5%9D%9B%E7%BF%BB%E9%A1%B5%E6%97%B6%E5%85%89%E6%9C%BA%EF%BC%88%E5%B0%9D%E9%B2%9C%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置与常量 ---
    const CONFIG = {
        themeKey: 'ftm_theme_mode', // localStorage key
        openStateKey: 'ftm_is_open', // localStorage key
        validPaths: ['/', '/latest', '/top', '/c', '/tag', '/search'], // 允许显示的路径前缀
        invalidPaths: ['/t/', '/u/', '/my/'], // 明确禁止的路径前缀 (帖子详情、用户页)
    };

    // --- 状态管理 ---
    let state = {
        theme: localStorage.getItem(CONFIG.themeKey) || 'auto', // auto, day, night
        isOpen: localStorage.getItem(CONFIG.openStateKey) === 'true',
        currentUrl: window.location.href,
        context: null // 当前上下文 (category, tag, etc.)
    };

    // --- DOM 元素创建辅助 ---
    const html = (str) => str; // 仅用于语法高亮辅助
    const createElement = (tag, className, innerHTML = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    };

    // --- 样式定义 (CSS) ---
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --ftm-bg: #ffffff;
            --ftm-text: #333333;
            --ftm-border: #e0e0e0;
            --ftm-accent: #67b35d;
            --ftm-accent-hover: #5aa150;
            --ftm-panel-bg: rgba(255, 255, 255, 0.98);
            --ftm-shadow: 0 4px 12px rgba(0,0,0,0.15);
            --ftm-input-bg: #f5f5f5;
            --ftm-disable: #cccccc;
        }

        /* 夜间模式变量 */
        [data-ftm-theme="night"] {
            --ftm-bg: #222222;
            --ftm-text: #cccccc;
            --ftm-border: #444444;
            --ftm-accent: #4a8044;
            --ftm-accent-hover: #5aa150;
            --ftm-panel-bg: rgba(34, 34, 34, 0.98);
            --ftm-shadow: 0 4px 12px rgba(0,0,0,0.5);
            --ftm-input-bg: #333333;
            --ftm-disable: #555555;
        }

        /* 自动模式跟随系统 (媒体查询) */
        @media (prefers-color-scheme: dark) {
            [data-ftm-theme="auto"] {
                --ftm-bg: #222222;
                --ftm-text: #cccccc;
                --ftm-border: #444444;
                --ftm-accent: #4a8044;
                --ftm-accent-hover: #5aa150;
                --ftm-panel-bg: rgba(34, 34, 34, 0.98);
                --ftm-shadow: 0 4px 12px rgba(0,0,0,0.5);
                --ftm-input-bg: #333333;
                --ftm-disable: #555555;
            }
        }

        #ftm-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: var(--ftm-text);
        }

        /* 悬浮球 */
        #ftm-ball {
            width: 48px;
            height: 48px;
            background: var(--ftm-accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            box-shadow: var(--ftm-shadow);
            transition: transform 0.2s, opacity 0.2s;
            font-size: 20px;
        }
        #ftm-ball:hover { transform: scale(1.1); }
        #ftm-ball:active { transform: scale(0.95); }

        /* 主面板 */
        #ftm-panel {
            background: var(--ftm-panel-bg);
            border: 1px solid var(--ftm-border);
            border-radius: 12px;
            box-shadow: var(--ftm-shadow);
            width: 340px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            transform-origin: bottom right;
            /* 添加这行，让面板脱离文档流，不再挤压悬浮球的位置 */
            position: absolute;
            bottom: 0;
            right: 0;
        }

        #ftm-container.open #ftm-ball {
            opacity: 0;
            pointer-events: none;
            position: absolute; /* 防止占位 */
        }
        #ftm-container.open #ftm-panel {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* 顶部栏 */
        .ftm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--ftm-border);
            padding-bottom: 8px;
            margin-bottom: -8px; /* 调整间距 */
        }
        .ftm-title {
            font-weight: bold;
            font-size: 14px;
            color: var(--ftm-accent);
        }
        .ftm-controls span {
            cursor: pointer;
            margin-left: 10px;
            font-size: 12px;
            user-select: none;
            opacity: 0.7;
        }
        .ftm-controls span:hover { opacity: 1; }

        /* 通用组件样式 - 强制高度对齐 */
        .ftm-row {
            display: flex;
            align-items: center;
            gap: 8px;
            height: 36px; /* 强制行高 */
        }
        .ftm-btn {
            height: 32px;
            min-width: 32px;
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--ftm-border);
            background: var(--ftm-bg);
            color: var(--ftm-text);
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.1s;
            box-sizing: border-box;
            user-select: none;
        }
        .ftm-btn:hover:not(:disabled) {
            background: var(--ftm-input-bg);
            border-color: var(--ftm-accent);
            color: var(--ftm-accent);
        }
        .ftm-btn:active:not(:disabled) { transform: translateY(1px); }
        .ftm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: var(--ftm-input-bg);
        }
        .ftm-btn-primary {
            background: var(--ftm-accent);
            color: white;
            border: none;
        }
        .ftm-btn-primary:hover:not(:disabled) {
            background: var(--ftm-accent-hover);
            color: white;
        }

        .ftm-input {
            height: 32px;
            border: 1px solid var(--ftm-border);
            background: var(--ftm-input-bg);
            border-radius: 6px;
            padding: 0 8px;
            color: var(--ftm-text);
            box-sizing: border-box;
            outline: none;
            font-size: 13px;
        }
        .ftm-input:focus { border-color: var(--ftm-accent); }

        /* 翻页区特殊样式 */
        .ftm-pagination-display {
            flex: 1;
            text-align: center;
            font-weight: bold;
            font-size: 15px;
        }

        /* 搜索/回溯区 */
        .ftm-section-label {
            font-size: 12px;
            color: var(--ftm-text);
            opacity: 0.8;
            margin-bottom: 4px;
            display: block;
        }
        .ftm-tag-group {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
        .ftm-tag-btn {
            font-size: 12px;
            padding: 0 8px;
            height: 24px; /* 小按钮 */
        }

        /* 隐藏类 */
        .ftm-hidden { display: none !important; }

        /* 禁用覆盖层 */
        .ftm-disabled-overlay {
            position: relative;
        }
        .ftm-disabled-overlay::after {
            content: attr(data-reason);
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(var(--ftm-bg), 0.8);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: var(--ftm-text);
            z-index: 10;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);

    // --- UI 构建 ---
    const container = createElement('div', '');
    container.id = 'ftm-container';
    container.dataset.ftmTheme = state.theme;

    // 1. 悬浮球
    const ball = createElement('div', '', '🚀');
    ball.id = 'ftm-ball';
    ball.title = '打开论坛时光机';
    ball.onclick = togglePanel;

    // 2. 面板
    const panel = createElement('div', '');
    panel.id = 'ftm-panel';

    // 2.1 头部
    const header = createElement('div', 'ftm-header');
    header.innerHTML = `
        <div class="ftm-title">论坛翻页时光机</div>
        <div class="ftm-controls">
            <span id="ftm-theme-btn" title="切换主题">主题: 自动</span>
            <span id="ftm-close-btn" title="隐藏">✕</span>
        </div>
    `;

    // 2.2 翻页区域
    const paginationSection = createElement('div', 'ftm-section');
    paginationSection.id = 'ftm-pagination-area';

    // 翻页第一行：按钮组
    const pageRow1 = createElement('div', 'ftm-row');
    pageRow1.style.justifyContent = 'space-between';
    pageRow1.style.marginBottom = '8px';

    const btnPrev10 = createElement('button', 'ftm-btn', '◀◀');
    const btnPrev1 = createElement('button', 'ftm-btn', '◀');
    const pageDisplay = createElement('div', 'ftm-pagination-display', '第 1 页');
    const btnNext1 = createElement('button', 'ftm-btn', '▶');
    const btnNext10 = createElement('button', 'ftm-btn', '▶▶');

    // Tooltips
    btnPrev10.title = "向前 10 页";
    btnPrev1.title = "上一页";
    btnNext1.title = "下一页";
    btnNext10.title = "向后 10 页";

    pageRow1.append(btnPrev10, btnPrev1, pageDisplay, btnNext1, btnNext10);

    // 翻页第二行：指定跳转
    const pageRow2 = createElement('div', 'ftm-row');
    const inputPage = createElement('input', 'ftm-input');
    inputPage.type = 'number';
    inputPage.min = 1;
    inputPage.placeholder = '页码';
    inputPage.style.width = '100px';

    const btnJump = createElement('button', 'ftm-btn ftm-btn-primary', '跳转');
    btnJump.style.flex = '1';

    pageRow2.append(inputPage, btnJump);
    paginationSection.append(pageRow1, pageRow2);

    // 2.3 旧帖回溯区域
    const timeSection = createElement('div', 'ftm-section');
    timeSection.style.borderTop = '1px solid var(--ftm-border)';
    timeSection.style.paddingTop = '12px';

    const timeLabel = createElement('span', 'ftm-section-label', '查看指定时间点之前的主题：');

    // 时间行1：快捷按钮
    const timeRow1 = createElement('div', 'ftm-tag-group');
    timeRow1.style.marginBottom = '8px';
    const quickTimes = [
        { label: '昨天', days: 1 },
        { label: '上周', days: 7 },
        { label: '上月', days: 30 },
        { label: '半年前', days: 180 },
        { label: '去年', days: 365 }
    ];
    quickTimes.forEach(qt => {
        const btn = createElement('button', 'ftm-btn ftm-tag-btn', qt.label);
        btn.onclick = () => handleQuickTimeTravel(qt.days);
        timeRow1.appendChild(btn);
    });

    // 时间行2：日期选择
    const timeRow2 = createElement('div', 'ftm-row');
    const inputDate = createElement('input', 'ftm-input');
    inputDate.type = 'date';
    inputDate.style.flex = '1';

    const btnTimeTravel = createElement('button', 'ftm-btn ftm-btn-primary', '回溯');
    btnTimeTravel.onclick = () => handleDateTravel();

    timeRow2.append(inputDate, btnTimeTravel);
    timeSection.append(timeLabel, timeRow1, timeRow2);

    // 组装
    panel.append(header, paginationSection, timeSection);
    container.append(ball, panel);
    document.body.appendChild(container);

    // --- 核心逻辑 ---

    // 初始化：绑定顶部事件
    document.getElementById('ftm-close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel(false);
    });

    const themeBtn = document.getElementById('ftm-theme-btn');
    themeBtn.addEventListener('click', cycleTheme);
    updateThemeLabel(); // 初始化文字

    // 绑定翻页事件
    btnPrev10.onclick = () => changePage(-10);
    btnPrev1.onclick = () => changePage(-1);
    btnNext1.onclick = () => changePage(1);
    btnNext10.onclick = () => changePage(10);
    btnJump.onclick = () => jumpToPage();
    inputPage.addEventListener('keypress', (e) => { if(e.key === 'Enter') jumpToPage(); });


    // --- 逻辑功能函数 ---

    function togglePanel(forceState) {
        if (typeof forceState === 'boolean') {
            state.isOpen = forceState;
        } else {
            state.isOpen = !state.isOpen;
        }
        localStorage.setItem(CONFIG.openStateKey, state.isOpen);

        if (state.isOpen) {
            container.classList.add('open');
            updateUIState(); // 打开时刷新数据
        } else {
            container.classList.remove('open');
        }
    }

    function cycleTheme() {
        const modes = ['auto', 'day', 'night'];
        let idx = modes.indexOf(state.theme);
        state.theme = modes[(idx + 1) % modes.length];
        localStorage.setItem(CONFIG.themeKey, state.theme);
        container.dataset.ftmTheme = state.theme;
        updateThemeLabel();
    }

    function updateThemeLabel() {
        const map = { 'auto': '自动', 'day': '日间', 'night': '夜间' };
        themeBtn.innerText = `主题: ${map[state.theme]}`;
    }

    // 更新界面状态（页码、URL参数检查、显隐逻辑）
    function updateUIState() {
        const urlObj = new URL(window.location.href);
        const path = window.location.pathname;
        const searchParams = urlObj.searchParams;

        // 1. 全局显隐检查
        const isValidPage = CONFIG.validPaths.some(p => path === p || path.startsWith(p));
        const isInvalidPage = CONFIG.invalidPaths.some(p => path.startsWith(p));

        if (!isValidPage || isInvalidPage) {
            container.classList.add('ftm-hidden');
            return;
        } else {
            container.classList.remove('ftm-hidden');
        }

        // 2. 页码计算 (Discourse page 参数从 0 开始)
        let pageIdx = parseInt(searchParams.get('page'));
        if (isNaN(pageIdx)) pageIdx = 0; // 默认为第0页 (界面显示第1页)

        const displayPage = pageIdx + 1;
        pageDisplay.innerText = `第 ${displayPage} 页`;
        inputPage.value = displayPage;

        // 3. 按钮状态控制
        btnPrev1.disabled = pageIdx < 1;
        btnPrev10.disabled = pageIdx < 10;

        // 4. 判断是否在搜索页 (搜索页禁用翻页)
        const isSearchPage = path.startsWith('/search');
        if (isSearchPage) {
            paginationSection.classList.add('ftm-disabled-overlay');
            paginationSection.setAttribute('data-reason', '搜索页暂不支持翻页');
            // 锁定输入框和按钮
            [btnPrev10, btnPrev1, btnNext1, btnNext10, btnJump, inputPage].forEach(el => el.disabled = true);
        } else {
            paginationSection.classList.remove('ftm-disabled-overlay');
            paginationSection.removeAttribute('data-reason');
             // 恢复按钮 (Prev按钮需重新根据页码判断)
            [btnNext1, btnNext10, btnJump, inputPage].forEach(el => el.disabled = false);
            btnPrev1.disabled = pageIdx < 1;
            btnPrev10.disabled = pageIdx < 10;
        }

        // 5. 上下文识别 (每次打开面板或URL变动时更新)
        state.context = analyzeContext(urlObj);
    }

    function changePage(delta) {
        const urlObj = new URL(window.location.href);
        let currentPage = parseInt(urlObj.searchParams.get('page')) || 0;
        let newPage = currentPage + delta;
        if (newPage < 0) newPage = 0;

        urlObj.searchParams.set('page', newPage);
        window.location.href = urlObj.toString();

        // 视觉反馈 (防止刷新太快感觉没反应)
        pageDisplay.innerText = '跳转中...';
    }

    function jumpToPage() {
        const val = parseInt(inputPage.value);
        if (isNaN(val) || val < 1) return;

        const urlObj = new URL(window.location.href);
        // 用户输入 1 -> page=0
        urlObj.searchParams.set('page', val - 1);
        window.location.href = urlObj.toString();
        pageDisplay.innerText = '跳转中...';
    }

    // --- 回溯功能逻辑 ---

    /**
     * 分析当前上下文，生成 Search query 限定符
     */
    function analyzeContext(urlObj) {
        const path = urlObj.pathname;
        const parts = path.split('/').filter(p => p); // 去空

        // 情况A: 已经在搜索页
        if (path.startsWith('/search')) {
            const q = urlObj.searchParams.get('q') || '';
            return { type: 'search', query: q };
        }

        // 情况B: 分类页 /c/category-slug/id
        if (parts[0] === 'c' && parts[1]) {
            // Discourse 搜索通常用 category:slug (更安全) 或者 category:id
            // 路径可能是 /c/develop/frontend/6 (多级) -> 取 slug "frontend" 或 "develop"
            // 这里简单策略：取紧跟 /c/ 的那个，如果有ID则不做处理让Discourse模糊匹配，或者尝试提取slug
            // 观察URL: /c/discuss-and-share/6 -> parts[1] is slug.
            return { type: 'context', query: `category:${parts[1]}` };
        }

        // 情况C: 标签页 /tag/tag-name
        if (parts[0] === 'tag' && parts[1]) {
            return { type: 'context', query: `tag:${parts[1]}` };
        }

        // 情况D: 首页/Lastest/Top
        return { type: 'global', query: '' };
    }

    function handleQuickTimeTravel(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        performTimeTravel(dateStr);
    }

    function handleDateTravel() {
        const dateStr = inputDate.value;
        if (!dateStr) {
            alert('请先选择日期');
            return;
        }
        performTimeTravel(dateStr);
    }

    function performTimeTravel(dateStr) {
        // 构建查询语句
        // 核心语法: [context] before:YYYY-MM-DD order:latest
        const baseQuery = `before:${dateStr} order:latest`;
        let finalQuery = '';

        const ctx = state.context;

        if (ctx.type === 'search') {
            // 如果已经在搜索结果中，我们需要替换或追加 before 参数
            let existingQ = ctx.query;
            // 简单处理：如果已有 before:xxx，替换它；否则追加
            // 由于不想用复杂正则，这里直接追加，Discourse 可能会取最后一个或者合并，通常 Search String 追加是安全的
            // 为了更精确，可以先简单分割空格清洗一下
            const parts = existingQ.split(' ').filter(p => !p.startsWith('before:') && !p.startsWith('order:'));
            finalQuery = parts.join(' ') + ' ' + baseQuery;
        } else if (ctx.type === 'context') {
            // 在特定板块或标签下
            finalQuery = `${ctx.query} ${baseQuery}`;
        } else {
            // 全局
            finalQuery = baseQuery;
        }

        // 跳转到搜索页
        const searchUrl = new URL(window.location.origin + '/search');
        searchUrl.searchParams.set('q', finalQuery.trim());
        window.location.href = searchUrl.toString();
    }

    // --- 监听 URL 变化 (SPA 适配) ---
    // Discourse 修改 pushState，我们需要劫持或轮询
    let lastUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            updateUIState();
        }
    }, 500); // 0.5秒检查一次，性能开销极低

    // 首次运行
    // 恢复 open 状态
    if(state.isOpen) {
        container.classList.add('open');
    }
    updateThemeLabel();
    updateUIState();

})();
