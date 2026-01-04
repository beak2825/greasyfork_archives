// ==UserScript==
// @name         51job 职位列表聚焦模式 (Center Job List)
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  精简 51job (前程无忧) 职位搜索页面，屏蔽右侧广告与推荐，将职位列表居中显示，提供右下角“专注模式”开关。
// @author       Script Dev
// @license      MIT
// @match        https://we.51job.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558993/51job%20%E8%81%8C%E4%BD%8D%E5%88%97%E8%A1%A8%E8%81%9A%E7%84%A6%E6%A8%A1%E5%BC%8F%20%28Center%20Job%20List%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558993/51job%20%E8%81%8C%E4%BD%8D%E5%88%97%E8%A1%A8%E8%81%9A%E7%84%A6%E6%A8%A1%E5%BC%8F%20%28Center%20Job%20List%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置常量
    const STORAGE_KEY = '51job_focus_mode_active';
    const STYLE_ID = '51job-focus-style';

    /**
     * 定义专注模式的 CSS 样式
     * 使用 Flexbox 强制重排布局，覆盖原有的 float 布局
     */
    const focusCss = `
        /* 1. 隐藏右侧边栏 (为你优选等) */
        .rightbox,
        .bottombox .bmad,
        .tResult_bottom_roll {
            display: none !important;
        }

        /* 2. 重构主容器布局为 Flex 列布局，并居中对齐 */
        .j_result .in {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            float: none !important;
            min-width: 0 !important;
        }

        /* 3. 处理左侧职位列表容器 (原本是 float:left) */
        /* 选择 j_result 下包含 leftbox 的直接父级 div */
        .j_result .in > div {
            float: none !important;
            margin: 0 auto !important;
        }

        /* 修正顶部筛选/排序栏 (.j_tlc) 的宽度和位置，使其与职位列表对齐 */
        .j_tlc {
            width: 100% !important;
            max-width: 900px !important; /* 与职位列表默认宽度一致 */
            margin: 0 auto !important;
            float: none !important;
            display: flex !important;
            justify-content: space-between !important;
        }

        /* 4. 确保职位列表本身宽度适配 */
        .leftbox {
            width: 900px !important; /* 强制保持原有的舒适宽度 */
            margin: 0 auto !important;
        }

        /* 5. 针对底部翻页器的微调 */
        .bottom-page {
            width: 900px !important;
            margin: 20px auto !important;
            display: flex !important;
            justify-content: center !important;
        }
    `;

    /**
     * 工具函数：等待元素出现 (用于确保UI插入位置)
     */
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    /**
     * 核心逻辑：切换模式状态
     */
    function toggleMode() {
        const isActive = localStorage.getItem(STORAGE_KEY) === 'true';
        const newState = !isActive;

        if (newState) {
            enableFocusMode();
        } else {
            disableFocusMode();
        }

        // 保存状态
        localStorage.setItem(STORAGE_KEY, newState);
        updateButtonState(newState);
    }

    /**
     * 启用专注模式：注入 Style 标签
     */
    function enableFocusMode() {
        if (!document.getElementById(STYLE_ID)) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = focusCss;
            document.head.appendChild(style);
        }
    }

    /**
     * 禁用专注模式：移除 Style 标签
     */
    function disableFocusMode() {
        const style = document.getElementById(STYLE_ID);
        if (style) {
            style.remove();
        }
    }

    /**
     * UI逻辑：创建并插入控制按钮
     */
    async function initUI() {
        // 确保 body 已加载
        await waitForElement('body');

        const btnId = '51job-focus-toggle-btn';
        if (document.getElementById(btnId)) return;

        const btn = document.createElement('button');
        btn.id = btnId;
        btn.textContent = '⚡ 专注';

        // 按钮样式 (Glassmorphism 风格)
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            zIndex: '999999',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 108, 14, 0.85)', // 51job 的标志性橙色
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            outline: 'none'
        });

        // 鼠标悬停效果
        btn.onmouseenter = () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        };
        btn.onmouseleave = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        };

        // 点击事件
        btn.onclick = toggleMode;

        document.body.appendChild(btn);

        // 初始化时根据存储的状态设置样式
        const savedState = localStorage.getItem(STORAGE_KEY) === 'true';
        if (savedState) {
            enableFocusMode();
        }
        updateButtonState(savedState);
    }

    /**
     * 更新按钮文本/状态
     */
    function updateButtonState(isActive) {
        const btn = document.getElementById('51job-focus-toggle-btn');
        if (btn) {
            btn.textContent = isActive ? '⚡ 已开启' : '💤 已关闭';
            btn.style.background = isActive ? 'rgba(255, 108, 14, 0.9)' : 'rgba(128, 128, 128, 0.7)';
        }
    }

    // 启动脚本
    initUI();

})();