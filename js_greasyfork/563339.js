// ==UserScript==
// @name         百度新版贴吧优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  1.侧栏当前页打开 2.隐藏头图开关 3.开启沉浸模式(隐藏侧栏+宽屏)
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

    const KEY_HIDE_HEADER = 'tieba_opt_hide_header';
    const KEY_FULL_WIDTH = 'tieba_opt_full_width';

    // ==========================================
    // 样式注入
    // ==========================================
    GM_addStyle(`
        /* --- 1. 沉浸宽屏模式 --- */

        /* 隐藏侧栏 */
        body.opt-full-width .left-content {
            display: none !important;
        }

        /* 强制主容器变宽 */
        /* 当开启沉浸模式时，内容占宽 93% */
        body.opt-full-width .frs-container,
        body.opt-full-width .frs-page-container {
            width: 93% !important;
            max-width: none !important;
        }

        /* 即使没开启隐藏侧栏，也可以稍微优化一下默认的宽屏体验(可选) */
        /* .frs-container { max-width: 1200px; } */

        /* 确保内容自适应 */
        .main-content {
            width: auto !important;
            flex: 1 !important;
        }

        /* --- 2. 头图控制 --- */
        body.opt-hide-header .head-pic-area {
            display: none !important;
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
            min-width: 60px;
        }
        .tieba-opt-btn:hover {
            background-color: rgba(0,0,0,0.8);
            transform: scale(1.05);
        }
        /* 激活状态 (蓝色) */
        .tieba-opt-btn.active {
            background-color: #4e6ef2;
        }
    `);

    // ==========================================
    // 功能: 侧栏点击拦截 (保持原有逻辑)
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
    // 功能: 按钮开关初始化
    // ==========================================
    function initOptions() {
        let isHideHeader = GM_getValue(KEY_HIDE_HEADER, false);
        let isFullWidth = GM_getValue(KEY_FULL_WIDTH, false);

        // 初始化状态
        if (isHideHeader) document.documentElement.classList.add('opt-hide-header');
        if (isFullWidth) document.documentElement.classList.add('opt-full-width');

        window.addEventListener('load', () => {
            // 二次确认 Body 类名
            if (isHideHeader) document.body.classList.add('opt-hide-header');
            if (isFullWidth) document.body.classList.add('opt-full-width');

            const btnContainer = document.createElement('div');
            btnContainer.className = 'tieba-opt-btns';

            // 按钮 1: 头图
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

            // 按钮 2: 沉浸模式 (侧栏开关)
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

            btnContainer.appendChild(btnSidebar);
            btnContainer.appendChild(btnHeader);
            document.body.appendChild(btnContainer);
        });
    }

    initOptions();

})();