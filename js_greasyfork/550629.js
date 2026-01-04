// ==UserScript==
// @name         标注页面左右布局切换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  安全稳定的布局切换器，只修改目标元素
// @match        *://qlabel.tencent.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550629/%E6%A0%87%E6%B3%A8%E9%A1%B5%E9%9D%A2%E5%B7%A6%E5%8F%B3%E5%B8%83%E5%B1%80%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/550629/%E6%A0%87%E6%B3%A8%E9%A1%B5%E9%9D%A2%E5%B7%A6%E5%8F%B3%E5%B8%83%E5%B1%80%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加安全隔离的CSS样式
    GM_addStyle(`
        /* 只针对特定容器 */
        .layout-container-custom {
            display: block;
            width: 100%;
            transition: all 0.4s ease;
        }

        /* 横向布局 */
        .horizontal-layout-custom {
            display: flex !important;
            flex-wrap: nowrap !important;
            gap: 20px !important;
            align-items: flex-start !important;
        }

        .horizontal-layout-custom > #anchor-0,
        .horizontal-layout-custom > #anchor-1 {
            flex: 1 !important;
            min-width: 0 !important;
            max-width: calc(50% - 10px) !important;
            margin-bottom: 0 !important;
        }

        /* 纵向布局 */
        .vertical-layout-custom > #anchor-0,
        .vertical-layout-custom > #anchor-1 {
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 20px !important;
        }

        /* 切换按钮 - 安全定位 */
        .layout-toggle-custom {
            position: fixed !important;
            top: 300px !important;
            right: 5px !important;
            z-index: 10000 !important;
            background: linear-gradient(135deg, #3498db, #2c3e50) !important;
            color: white !important;
            border: none !important;
            border-radius: 30px !important;
            padding: 6px 6px !important;
            font-size: 10px !important;
            font-weight: 60 !important;
            cursor: pointer !important;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3) !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .layout-toggle-custom:hover {
            background: linear-gradient(135deg, #2980b9, #1a252f) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4) !important;
        }

        /* 响应式设计 */
        @media (max-width: 992px) {
            .horizontal-layout-custom {
                flex-direction: column !important;
            }

            .horizontal-layout-custom > #anchor-0,
            .horizontal-layout-custom > #anchor-1 {
                max-width: 100% !important;
                margin-bottom: 20px !important;
            }

            .layout-toggle-custom {
                padding: 10px 20px !important;
                font-size: 13px !important;
            }
        }

        @media (max-width: 768px) {
            .layout-toggle-custom {
                padding: 8px 15px !important;
                font-size: 12px !important;
            }

            .layout-toggle-custom .text {
                display: none !important;
            }
        }
    `);

    // 创建切换按钮
    const toggleButton = document.createElement('button');
    toggleButton.className = 'layout-toggle-custom';
    toggleButton.id = 'layoutToggleCustom';
    toggleButton.innerHTML = '<span class="icon">↔️</span>';
    document.body.appendChild(toggleButton);

    // 主功能函数
    function initLayout() {
        const anchor0 = document.getElementById('anchor-0');
        const anchor1 = document.getElementById('anchor-1');

        if (!anchor0 || !anchor1) {
            return;
        }

        const container = anchor0.parentElement;
        if (!container) return;

        // 添加自定义容器类
        container.classList.add('layout-container-custom', 'vertical-layout-custom');

        // 检查保存的布局偏好
        const savedLayout = GM_getValue('layoutPreference', 'vertical');

        if (savedLayout === 'horizontal') {
            applyHorizontalLayout();
        }

        // 添加按钮事件监听
        toggleButton.addEventListener('click', toggleLayout);

    }

    // 应用横向布局
    function applyHorizontalLayout() {
        const anchor0 = document.getElementById('anchor-0');
        const anchor1 = document.getElementById('anchor-1');
        if (!anchor0 || !anchor1) return;

        const container = anchor0.parentElement;
        if (!container) return;

        container.classList.remove('vertical-layout-custom');
        container.classList.add('horizontal-layout-custom');

        toggleButton.innerHTML = '<span class="icon">↕️</span>';
        GM_setValue('layoutPreference', 'horizontal');
    }

    // 应用纵向布局
    function applyVerticalLayout() {
        const anchor0 = document.getElementById('anchor-0');
        const anchor1 = document.getElementById('anchor-1');
        if (!anchor0 || !anchor1) return;

        const container = anchor0.parentElement;
        if (!container) return;

        container.classList.remove('horizontal-layout-custom');
        container.classList.add('vertical-layout-custom');

        toggleButton.innerHTML = '<span class="icon">↔️</span>';
        GM_setValue('layoutPreference', 'vertical');
    }

    // 切换布局
    function toggleLayout() {
        const anchor0 = document.getElementById('anchor-0');
        const anchor1 = document.getElementById('anchor-1');
        if (!anchor0 || !anchor1) return;

        const container = anchor0.parentElement;
        if (!container) return;

        if (container.classList.contains('horizontal-layout-custom')) {
            applyVerticalLayout();
        } else {
            applyHorizontalLayout();
        }
    }

    // 初始化
    setTimeout(initLayout, 1500);
})();