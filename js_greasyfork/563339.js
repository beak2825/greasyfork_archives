// ==UserScript==
// @name         百度新版贴吧优化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  1.侧栏当前页打开 2.隐藏头图开关 3.开启沉浸模式(隐藏侧栏+宽屏) 4.帖子页默认热门或最新开关；5、帖子内回复默认热门/正序/倒序开关；6、帖子列表中限制带图帖高度
// @author       User
// @match        https://tieba.baidu.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563339/%E7%99%BE%E5%BA%A6%E6%96%B0%E7%89%88%E8%B4%B4%E5%90%A7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563339/%E7%99%BE%E5%BA%A6%E6%96%B0%E7%89%88%E8%B4%B4%E5%90%A7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 配置键名
    // ==========================================
    const KEY_HIDE_HEADER = 'tieba_opt_hide_header';
    const KEY_FULL_WIDTH = 'tieba_opt_full_width';
    const KEY_FORUM_SORT = 'tieba_opt_forum_sort';
    const KEY_THREAD_SORT = 'tieba_opt_thread_sort';

    // ==========================================
    // 样式注入
    // ==========================================
    GM_addStyle(`
        /* --- 1. 沉浸宽屏模式 (V13.0 侧栏父容器清理版) --- */

        body.opt-full-width .left-content,
        body.opt-full-width .left-nav-wrapper,
        body.opt-full-width .drawer-body,
        body.opt-full-width .frs-page-container > div:first-child {
            width: 0 !important;
            min-width: 0 !important;
            flex-basis: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            overflow: hidden !important;
        }

        body.opt-full-width .left-nav-wrapper .main,
        body.opt-full-width .left-nav-wrapper .list-container-wrapper,
        body.opt-full-width .tb-home,
        body.opt-full-width .home-icon,
        body.opt-full-width .home-icon-min {
            display: none !important;
        }

        body.opt-full-width .home-left {
            position: fixed !important;
            top: 65px !important;
            left: 10px !important;
            z-index: 99999 !important;
            width: 40px !important;
            height: 40px !important;
            background: transparent !important;
            border: none !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
        }

        body.opt-full-width .home-left .left-bar {
            display: block !important;
            width: 24px !important;
            height: 24px !important;
            cursor: pointer !important;
        }

        body.opt-full-width .frs-container,
        body.opt-full-width .frs-page-container,
        body.opt-full-width .content-wrapper {
            width: 96% !important;
            max-width: none !important;
            display: flex !important;
        }

        body.opt-full-width .frs-right-sidebar {
            width: 240px !important;
            min-width: 240px !important;
            margin-left: 15px !important;
            margin-right: 0 !important;
        }
        .main-content, .frs-content {
            flex-grow: 1 !important;
            width: auto !important;
        }

        /* --- 2. 头图控制 --- */
        body.opt-hide-header .head-pic-area,
        body.opt-hide-header .forum-head-container {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        /* --- 3. 帖子列表预览图高度限制 (V14.0 新增) --- */
        /* 针对 .thread-image 容器内的 lazy-img-wrapper */
        /* 使用 vh 单位，限制为屏幕高度的 35% (约1/3) */

        .thread-image .lazy-img-wrapper,
        .thread-image img {
            max-height: 35vh !important; /* 限制最大高度 */
            width: auto !important;      /* 宽度自动，防止拉伸 */
            max-width: 100% !important;  /* 宽度不能超父容器 */
            object-fit: contain !important; /* 保持比例，显示全图 */
            margin: 0 auto !important;   /* 居中显示 */
            display: block !important;
        }

        /* 针对多图的情况，如果有 Grid 布局，也稍微限制一下 */
        .thread-card-wrapper .media-grid {
            max-height: 40vh !important;
            overflow: hidden !important;
        }

        /* --- 4. 悬浮按钮组样式 --- */
        .tieba-opt-btns {
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
        }
        .tieba-opt-btn {
            padding: 8px 12px;
            background-color: rgba(0,0,0,0.6);
            color: white;
            font-size: 13px;
            border-radius: 20px;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-family: sans-serif;
            min-width: 70px;
            backdrop-filter: blur(4px);
            display: block;
        }
        .tieba-opt-btn.hidden { display: none !important; }
        .tieba-opt-btn:hover {
            background-color: rgba(0,0,0,0.8);
            transform: scale(1.05);
        }
        .tieba-opt-btn.active {
            background-color: #4e6ef2;
            font-weight: bold;
        }
        .tieba-opt-btn.sort-asc { border-left: 3px solid #00ff00; }
        .tieba-opt-btn.sort-desc { border-left: 3px solid #ff0000; }
        .tieba-opt-btn.sort-hot { border-left: 3px solid #ffa500; }
    `);

    // ==========================================
    // 核心: SPA 路由监听
    // ==========================================
    const _historyPushState = history.pushState;
    const _historyReplaceState = history.replaceState;
    history.pushState = function(state, title, url) { _historyPushState.apply(this, arguments); onUrlChange(); };
    history.replaceState = function(state, title, url) { _historyReplaceState.apply(this, arguments); onUrlChange(); };
    window.addEventListener('popstate', onUrlChange);

    function getPageType() {
        const path = window.location.pathname;
        const search = window.location.search;
        if (path.startsWith('/p/')) return 'thread';
        if (path.indexOf('/f') !== -1 || search.indexOf('kw=') !== -1) return 'forum';
        return 'other';
    }

    function onUrlChange() {
        updateButtonsUI();
        const type = getPageType();
        if (type === 'forum') trySwitchForumSort();
        if (type === 'thread') trySwitchThreadSort();
    }

    // ==========================================
    // 逻辑功能模块
    // ==========================================

    // 1. 吧列表自动最新
    let forumSortTimer = null;
    function trySwitchForumSort() {
        if (!GM_getValue(KEY_FORUM_SORT, false)) return;
        if (forumSortTimer) clearInterval(forumSortTimer);
        let checkCount = 0;
        forumSortTimer = setInterval(() => {
            checkCount++;
            if (checkCount > 20) { clearInterval(forumSortTimer); return; }
            const tabs = document.querySelectorAll('.card-tab .tab-item');
            if (!tabs || tabs.length === 0) return;
            let newestTab = null, activeTab = null;
            tabs.forEach(tab => {
                if (tab.textContent.trim() === '最新') newestTab = tab;
                if (tab.classList.contains('active')) activeTab = tab;
            });
            if (newestTab) {
                if (activeTab !== newestTab) { newestTab.click(); console.log('UserScript: 已切换为[最新]'); }
                clearInterval(forumSortTimer);
            }
        }, 300);
    }

    // 2. 帖子内自动排序
    let threadSortTimer = null;
    function trySwitchThreadSort() {
        const targetMode = GM_getValue(KEY_THREAD_SORT, 'hot');
        const textMap = { 'hot': '热门', 'asc': '正序', 'desc': '倒序' };
        const targetText = textMap[targetMode];
        if (threadSortTimer) clearInterval(threadSortTimer);
        let checkCount = 0;
        threadSortTimer = setInterval(() => {
            checkCount++;
            if (checkCount > 25) { clearInterval(threadSortTimer); return; }
            const container = document.querySelector('.sub-tab-container');
            if (!container) return;
            const items = container.querySelectorAll('.sub-tab-item');
            let targetItem = null, activeItem = null;
            items.forEach(item => {
                const t = item.textContent.trim();
                if (t === targetText) targetItem = item;
                if (item.classList.contains('sub-tab-item-active')) activeItem = item;
            });
            if (targetItem) {
                if (activeItem !== targetItem) { targetItem.click(); console.log(`UserScript: 已切换为[${targetText}]`); }
                clearInterval(threadSortTimer);
            }
        }, 300);
    }

    // 3. 侧栏点击拦截
    document.addEventListener('click', function(e) {
        let target = e.target.closest('.forum-card-wrapper');
        if (!target || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
        let nameEl = target.querySelector('.forum-name');
        if (nameEl && nameEl.textContent.trim()) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            window.location.href = 'https://tieba.baidu.com/f?kw=' + encodeURIComponent(nameEl.textContent.trim());
        }
    }, true);

    // ==========================================
    // UI 初始化
    // ==========================================
    let btnForumSort, btnThreadSort;
    function updateButtonsUI() {
        const pageType = getPageType();
        if (btnForumSort) btnForumSort.classList.toggle('hidden', pageType !== 'forum');
        if (btnThreadSort) btnThreadSort.classList.toggle('hidden', pageType !== 'thread');
    }

    function initUI() {
        let isHideHeader = GM_getValue(KEY_HIDE_HEADER, false);
        let isFullWidth = GM_getValue(KEY_FULL_WIDTH, false);
        let isForumNew = GM_getValue(KEY_FORUM_SORT, false);
        let currentThreadMode = GM_getValue(KEY_THREAD_SORT, 'hot');

        // 静态样式应用
        if (isHideHeader) document.documentElement.classList.add('opt-hide-header');
        if (isFullWidth) document.documentElement.classList.add('opt-full-width');

        window.addEventListener('load', () => {
            if (isHideHeader) document.body.classList.add('opt-hide-header');
            if (isFullWidth) document.body.classList.add('opt-full-width');
            onUrlChange();

            if (document.getElementById('tieba-opt-container')) return;
            const btnContainer = document.createElement('div');
            btnContainer.id = 'tieba-opt-container';
            btnContainer.className = 'tieba-opt-btns';

            // 吧列表按钮
            btnForumSort = document.createElement('div');
            btnForumSort.className = `tieba-opt-btn ${isForumNew ? 'active' : ''}`;
            btnForumSort.textContent = isForumNew ? '默认最新' : '默认热门';
            btnForumSort.onclick = () => {
                isForumNew = !isForumNew;
                GM_setValue(KEY_FORUM_SORT, isForumNew);
                btnForumSort.textContent = isForumNew ? '默认最新' : '默认热门';
                btnForumSort.classList.toggle('active', isForumNew);
                if(isForumNew) trySwitchForumSort();
            };

            // 帖子排序按钮
            const threadModes = ['hot', 'asc', 'desc'];
            const threadNames = {'hot': '回复:热门', 'asc': '回复:正序', 'desc': '回复:倒序'};
            btnThreadSort = document.createElement('div');
            btnThreadSort.className = `tieba-opt-btn active sort-${currentThreadMode}`;
            btnThreadSort.textContent = threadNames[currentThreadMode];
            btnThreadSort.onclick = () => {
                let idx = threadModes.indexOf(currentThreadMode);
                currentThreadMode = threadModes[(idx + 1) % 3];
                GM_setValue(KEY_THREAD_SORT, currentThreadMode);
                btnThreadSort.textContent = threadNames[currentThreadMode];
                btnThreadSort.className = `tieba-opt-btn active sort-${currentThreadMode}`;
                trySwitchThreadSort();
            };

            // 沉浸模式按钮
            const btnSidebar = document.createElement('div');
            btnSidebar.className = `tieba-opt-btn ${isFullWidth ? 'active' : ''}`;
            btnSidebar.textContent = isFullWidth ? '显示侧栏' : '沉浸模式';
            btnSidebar.onclick = () => {
                isFullWidth = !isFullWidth;
                GM_setValue(KEY_FULL_WIDTH, isFullWidth);
                document.body.classList.toggle('opt-full-width', isFullWidth);
                btnSidebar.textContent = isFullWidth ? '显示侧栏' : '沉浸模式';
                btnSidebar.classList.toggle('active', isFullWidth);
            };

            // 头图按钮
            const btnHeader = document.createElement('div');
            btnHeader.className = `tieba-opt-btn ${isHideHeader ? 'active' : ''}`;
            btnHeader.textContent = isHideHeader ? '显示头图' : '隐藏头图';
            btnHeader.onclick = () => {
                isHideHeader = !isHideHeader;
                GM_setValue(KEY_HIDE_HEADER, isHideHeader);
                document.body.classList.toggle('opt-hide-header', isHideHeader);
                btnHeader.textContent = isHideHeader ? '显示头图' : '隐藏头图';
                btnHeader.classList.toggle('active', isHideHeader);
            };

            btnContainer.append(btnForumSort, btnThreadSort, btnSidebar, btnHeader);
            document.body.appendChild(btnContainer);
            updateButtonsUI();
        });
    }

    initUI();
})();