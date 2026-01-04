// ==UserScript==
// @name         粉笔快速练习答案布局优化与视频删除
// @namespace    http://tampermonkey.net/
// @version      27.0
// @description  【底部边距修复版】分栏+自动修复+拖动调节+固定头部+强制展开+自定义宽度+修复底部遮挡。
// @author       ChatGPT / Gemini (Modified by User)
// @match        *://spa.fenbi.com/ti/exam/exercise/*
// @match        *://spa.fenbi.com/ti/exam/solution/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557928/%E7%B2%89%E7%AC%94%E5%BF%AB%E9%80%9F%E7%BB%83%E4%B9%A0%E7%AD%94%E6%A1%88%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96%E4%B8%8E%E8%A7%86%E9%A2%91%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/557928/%E7%B2%89%E7%AC%94%E5%BF%AB%E9%80%9F%E7%BB%83%E4%B9%A0%E7%AD%94%E6%A1%88%E5%B8%83%E5%B1%80%E4%BC%98%E5%8C%96%E4%B8%8E%E8%A7%86%E9%A2%91%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================

    // 1. 初始左侧分栏的宽度比例
    const DEFAULT_LEFT_WIDTH = '46%';

    // 2. 页面整体宽度 (控制左右边距)
    // 您可以修改这个值：'1200px'(原版), '90%'(宽屏), '95%', '100%'(铺满)
    const CUSTOM_PAGE_WIDTH = '93%';

    // ===========================================

    // ------------------------------------------------
    // 步骤一：CSS 样式定义
    // ------------------------------------------------
    GM_addStyle(`
        /* 定义全局 CSS 变量 */
        :root {
            --left-column-width: ${DEFAULT_LEFT_WIDTH};
            --custom-page-width: ${CUSTOM_PAGE_WIDTH};
        }

        /* =========== 页面整体宽度控制 & 底部边距修复 =========== */
        /* 覆盖粉笔默认的固定宽度容器 */
        app-solution > div,
        app-tis,
        .ant-layout-content,
        .ant-layout-content > div:not(.page-header) {
            max-width: var(--custom-page-width) !important;
            width: var(--custom-page-width) !important;
            margin-left: auto !important;
            margin-right: auto !important;

            /* 修复底部边距消失的问题 */
            margin-bottom: 60px !important;  /* 页面底部留出 60px 空白 */
            padding-bottom: 20px !important; /* 内容底部增加 20px 内边距 */
        }
        /* ==================================================== */

        /* =========== 强制展开所有解析 =========== */
        app-result-common .result-common-container {
            height: auto !important;
            overflow: visible !important;
        }

        /* =========== 标题栏高度：强制固定像素高度 =========== */
        body > app-root > app-solution > app-nav-header > header {
            height: 35px !important;
            min-height: 35px !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            align-items: center !important;
        }

        body > app-root > app-solution > app-nav-header > header > * {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }

        /* 1. 隐藏解析视频占位 */
        .result-common-section:has(app-solution-video),
        .result-common-section:has(.member-title-container) {
            display: none !important;
        }

        /* 2.1 强制共同父容器为 Flex */
        .solution-choice-container {
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: flex-start !important;
            gap: 0 !important;
            position: relative;
        }

        /* 2.2 左侧包裹容器 */
        .custom-left-wrapper {
            flex: 0 0 var(--left-column-width) !important;
            max-width: var(--left-column-width) !important;
            width: var(--left-column-width) !important;

            display: flex !important;
            flex-direction: column !important;
            gap: 15px !important;
            padding-right: 15px !important;
            box-sizing: border-box !important;
        }

        /* 2.3 中间拖拽条样式 */
        .resize-handle {
            flex: 0 0 10px !important;
            width: 10px !important;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: transparent;
            align-self: stretch;
            user-select: none;
            z-index: 10;
        }

        .resize-handle::after {
            content: "";
            width: 2px;
            height: 100%;
            background-color: #f0f0f0;
        }

        /* 2.4 右侧容器 (解析区) */
        app-result-common {
            flex: 1 1 auto !important;
            max-width: none !important;
            border-left: none !important;
            padding-left: 15px !important;
            box-sizing: border-box !important;
            order: 3 !important;
            margin-top: -15px !important;
            padding-top: 0 !important;
            position: sticky;
            top: 20px;
        }

        /* 2.5 内部元素适配 */
        app-question-choice, app-solution-overall {
            width: 100% !important;
            max-width: none !important;
        }

        body.resizing {
            user-select: none !important;
        }
    `);

    // ------------------------------------------------
    // 步骤二：拖拽逻辑实现 (防抖 + 锁定上下文)
    // ------------------------------------------------

    let isResizing = false;
    let initialMouseX = 0;
    let initialLeftWidthPx = 0;
    let activeContainer = null;

    function initResizeEvents() {
        document.addEventListener('mousemove', (e) => {
            if (!isResizing || !activeContainer) return;

            const containerWidth = activeContainer.getBoundingClientRect().width;
            if (containerWidth === 0) return;

            const deltaX = e.clientX - initialMouseX;
            let newLeftWidth = initialLeftWidthPx + deltaX;

            // 限制范围 (20% 到 80%)
            const minWidth = containerWidth * 0.2;
            const maxWidth = containerWidth * 0.8;

            if (newLeftWidth < minWidth) newLeftWidth = minWidth;
            if (newLeftWidth > maxWidth) newLeftWidth = maxWidth;

            const percentage = (newLeftWidth / containerWidth) * 100;
            document.documentElement.style.setProperty('--left-column-width', `${percentage}%`);
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                activeContainer = null;
                document.body.classList.remove('resizing');
                document.querySelectorAll('.resize-handle').forEach(h => h.classList.remove('active'));
            }
        });
    }

    initResizeEvents();

    // ------------------------------------------------
    // 步骤三：DOM 结构修改
    // ------------------------------------------------

    function wrapLeftElements() {
        const containers = document.querySelectorAll('.solution-choice-container');

        containers.forEach(parentContainer => {
            if (parentContainer.querySelector(':scope > .custom-left-wrapper')) {
                return;
            }

            const question = parentContainer.querySelector(':scope > app-question-choice');
            const overall = parentContainer.querySelector(':scope > app-solution-overall');
            const result = parentContainer.querySelector(':scope > app-result-common');
            const material = parentContainer.querySelector(':scope > app-question-material');

            if ((question || material) && result) {

                let leftWrapper = document.createElement('div');
                leftWrapper.className = 'custom-left-wrapper';

                if (material) leftWrapper.appendChild(material);
                if (question) leftWrapper.appendChild(question);
                if (overall) leftWrapper.appendChild(overall);

                let handle = document.createElement('div');
                handle.className = 'resize-handle';
                handle.style.order = '2';

                handle.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    activeContainer = parentContainer;

                    const currentLeftWrapper = activeContainer.querySelector('.custom-left-wrapper');

                    if (currentLeftWrapper) {
                        initialMouseX = e.clientX;
                        initialLeftWidthPx = currentLeftWrapper.getBoundingClientRect().width;

                        isResizing = true;
                        document.body.classList.add('resizing');
                        handle.classList.add('active');
                    }
                    e.preventDefault();
                });

                parentContainer.insertBefore(leftWrapper, result);
                parentContainer.insertBefore(handle, result);
            }
        });
    }

    // ------------------------------------------------
    // 步骤四：轮询机制
    // ------------------------------------------------

    setInterval(wrapLeftElements, 100);

})();