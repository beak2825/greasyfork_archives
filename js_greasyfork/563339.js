// ==UserScript==
// @name         百度新版贴吧优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  1.侧栏当前页打开 2.隐藏头图开关 3.开启沉浸模式(隐藏侧栏+宽屏) 4.默认进入最新回复页
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

    // 配置键名
    const KEY_HIDE_HEADER = 'tieba_opt_hide_header';
    const KEY_FULL_WIDTH = 'tieba_opt_full_width';
    const KEY_DEFAULT_NEW = 'tieba_opt_default_new'; // 新增

    // ==========================================
    // 样式注入
    // ==========================================
    GM_addStyle(`
        /* --- 1. 沉浸宽屏模式 (V6.0 零宽策略) --- */

        /* 核心：将左侧栏宽度强制设为0，消除留白，让主内容左移 */
        body.opt-full-width .left-nav-wrapper,
        body.opt-full-width .drawer-body,
        body.opt-full-width .frs-page-container > div:first-child {
            width: 0 !important;
            min-width: 0 !important;
            flex-basis: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
        }

        /* 隐藏左侧内容，防止重叠 */
        body.opt-full-width .left-nav-wrapper .main,
        body.opt-full-width .left-nav-wrapper .list-container-wrapper {
            display: none !important;
        }

        /* 强制主容器变宽，填满屏幕 */
        body.opt-full-width .frs-container,
        body.opt-full-width .frs-page-container,
        body.opt-full-width .content-wrapper {
            width: 96% !important;
            max-width: none !important;
            display: flex !important;
        }

        /* 修复菜单键：沉浸模式下强制显示左上角菜单按钮 */
        body.opt-full-width .home-left {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important;
            top: 65px !important;
            left: 10px !important;
            z-index: 99999 !important;
            background: rgba(255,255,255,0.0) !important;
        }

        /* 右侧栏收缩贴边 */
        body.opt-full-width .frs-right-sidebar {
            width: 240px !important;
            min-width: 240px !important;
            margin-left: 15px !important;
            margin-right: 0 !important;
        }

        /* 主内容自适应 */
        .main-content, .frs-content {
            flex-grow: 1 !important;
            width: auto !important;
        }

        /* --- 2. 头图控制 (修复缝隙) --- */
        body.opt-hide-header .head-pic-area,
        body.opt-hide-header .forum-head-container {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        /* --- 3. 悬浮按钮组样式 --- */
        .tieba-opt-btns {
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end; /* 靠右对齐 */
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
            min-width: 70px; /* 统一宽度 */
            backdrop-filter: blur(4px);
        }
        .tieba-opt-btn:hover {
            background-color: rgba(0,0,0,0.8);
            transform: scale(1.05);
        }
        /* 激活状态 (蓝色) */
        .tieba-opt-btn.active {
            background-color: #4e6ef2;
            font-weight: bold;
        }
    `);

    // ==========================================
    // 功能: 侧栏点击拦截
    // ==========================================
    document.addEventListener('click', function(e) {
        let target = e.target.closest('.forum-card-wrapper');
        if (!target || e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;

        let nameEl = target.querySelector('.forum-name');
        if (nameEl) {
            let forumName = nameEl.textContent.trim();
            if (forumName) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                window.location.href = 'https://tieba.baidu.com/f?kw=' + encodeURIComponent(forumName);
            }
        }
    }, true);

    // ==========================================
    // 功能: 自动切换到"最新"
    // ==========================================
    function trySwitchToNewest() {
        // 1. 检查开关是否开启
        if (!GM_getValue(KEY_DEFAULT_NEW, false)) return;

        // 2. 轮询查找 DOM 元素 (Vue 动态加载需要等待)
        // 设置一个计时器，每300ms检查一次，最多检查 15次 (约4.5秒)
        let checkCount = 0;
        const maxChecks = 15;

        const timer = setInterval(() => {
            checkCount++;
            if (checkCount > maxChecks) {
                clearInterval(timer);
                return;
            }

            // 查找所有 Tab
            const tabs = document.querySelectorAll('.card-tab .tab-item');
            if (!tabs || tabs.length === 0) return;

            let newestTab = null;
            let currentActiveTab = null;

            // 遍历找到 "最新" 和 "当前激活的Tab"
            tabs.forEach(tab => {
                const text = tab.textContent.trim();
                if (text === '最新') {
                    newestTab = tab;
                }
                if (tab.classList.contains('active')) {
                    currentActiveTab = tab;
                }
            });

            // 逻辑判断
            if (newestTab) {
                // 如果当前已经是最新，停止
                if (currentActiveTab === newestTab) {
                    clearInterval(timer);
                    return;
                }

                // 否则点击它
                newestTab.click();
                console.log('UserScript: 已自动切换到[最新]');
                clearInterval(timer);
            }
        }, 300);
    }

    // ==========================================
    // 功能: 初始化逻辑
    // ==========================================
    function initOptions() {
        let isHideHeader = GM_getValue(KEY_HIDE_HEADER, false);
        let isFullWidth = GM_getValue(KEY_FULL_WIDTH, false);
        let isDefaultNew = GM_getValue(KEY_DEFAULT_NEW, false);

        // 1. 尽早应用 Class (防止闪烁)
        if (isHideHeader) document.documentElement.classList.add('opt-hide-header');
        if (isFullWidth) document.documentElement.classList.add('opt-full-width');

        // 2. 页面加载完成后
        window.addEventListener('load', () => {
            // 确保 Body 也加上 Class
            if (isHideHeader) document.body.classList.add('opt-hide-header');
            if (isFullWidth) document.body.classList.add('opt-full-width');

            // 尝试执行自动跳转最新
            trySwitchToNewest();

            // 创建按钮容器
            if (document.getElementById('tieba-opt-container')) return;
            const btnContainer = document.createElement('div');
            btnContainer.id = 'tieba-opt-container';
            btnContainer.className = 'tieba-opt-btns';

            // --- 按钮 1: 头图开关 ---
            const btnHeader = document.createElement('div');
            btnHeader.className = `tieba-opt-btn ${isHideHeader ? 'active' : ''}`;
            btnHeader.textContent = isHideHeader ? '显示头图' : '隐藏头图';
            btnHeader.onclick = () => {
                isHideHeader = !isHideHeader;
                GM_setValue(KEY_HIDE_HEADER, isHideHeader);
                if (isHideHeader) {
                    document.body.classList.add('opt-hide-header');
                    btnHeader.textContent = '显示头图';
                    btnHeader.classList.add('active');
                } else {
                    document.body.classList.remove('opt-hide-header');
                    btnHeader.textContent = '隐藏头图';
                    btnHeader.classList.remove('active');
                }
            };

            // --- 按钮 2: 沉浸模式 (宽屏+隐侧栏) ---
            const btnSidebar = document.createElement('div');
            btnSidebar.className = `tieba-opt-btn ${isFullWidth ? 'active' : ''}`;
            btnSidebar.textContent = isFullWidth ? '显示侧栏' : '沉浸模式';
            btnSidebar.onclick = () => {
                isFullWidth = !isFullWidth;
                GM_setValue(KEY_FULL_WIDTH, isFullWidth);
                if (isFullWidth) {
                    document.body.classList.add('opt-full-width');
                    btnSidebar.textContent = '显示侧栏';
                    btnSidebar.classList.add('active');
                } else {
                    document.body.classList.remove('opt-full-width');
                    btnSidebar.textContent = '沉浸模式';
                    btnSidebar.classList.remove('active');
                }
            };

            // --- 按钮 3: 默认最新 (新增) ---
            const btnDefaultNew = document.createElement('div');
            btnDefaultNew.className = `tieba-opt-btn ${isDefaultNew ? 'active' : ''}`;
            btnDefaultNew.textContent = isDefaultNew ? '默认最新' : '默认热门';
            btnDefaultNew.title = '开启后，进入吧内自动点击[最新]';
            btnDefaultNew.onclick = () => {
                isDefaultNew = !isDefaultNew;
                GM_setValue(KEY_DEFAULT_NEW, isDefaultNew);
                if (isDefaultNew) {
                    btnDefaultNew.textContent = '默认最新';
                    btnDefaultNew.classList.add('active');
                    // 立即试一下
                    trySwitchToNewest();
                } else {
                    btnDefaultNew.textContent = '默认热门';
                    btnDefaultNew.classList.remove('active');
                }
            };

            // 添加顺序：默认最新(最上) -> 沉浸模式 -> 头图(最下)
            btnContainer.appendChild(btnDefaultNew);
            btnContainer.appendChild(btnSidebar);
            btnContainer.appendChild(btnHeader);
            document.body.appendChild(btnContainer);
        });
    }

    initOptions();

})();