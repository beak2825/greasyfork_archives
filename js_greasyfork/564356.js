// ==UserScript==
// @name         ReadTheDocs Sidebar Toggle & Clean UI (侧边栏开关 & 净化)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Toggle ReadTheDocs sidebar with a floating button/shortcut. Hides "Ask AI" and version flyouts ONLY when sidebar is closed. (为 ReadTheDocs 文档添加侧边栏开关按钮。仅在隐藏侧边栏时，同时隐藏 "Ask AI" 和版本弹窗，开启时恢复原样。)
// @author       LLouice
// @license      MIT
// @match        *://*/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/564356/ReadTheDocs%20Sidebar%20Toggle%20%20Clean%20UI%20%28%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%BC%80%E5%85%B3%20%20%E5%87%80%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564356/ReadTheDocs%20Sidebar%20Toggle%20%20Clean%20UI%20%28%E4%BE%A7%E8%BE%B9%E6%A0%8F%E5%BC%80%E5%85%B3%20%20%E5%87%80%E5%8C%96%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // 1. 核心检测：只在 ReadTheDocs 或类似结构的文档站运行
    // =========================================================
    const wyNavSide = document.querySelector(".wy-nav-side");
    const isRTD = wyNavSide ||
          document.querySelector("readthedocs-flyout") ||
          document.getElementById("runllm-widget");

    if (!isRTD) return;

    console.log('ReadTheDocs Enhanced: Active on this page.');

    // =========================================================
    // 2. 注入 CSS：基于 body 的 class 来控制显隐
    //    只有当 body 拥有 "rtd-clean-mode" 类时，才隐藏组件
    // =========================================================
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
        /* 当处于“净化模式”时，隐藏 Ask AI (#runllm-widget) */
        body.rtd-clean-mode #runllm-widget,
        body.rtd-clean-mode .rllm-fixed {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }

        /* 当处于“净化模式”时，隐藏右下角版本选择器 (readthedocs-flyout) */
        body.rtd-clean-mode readthedocs-flyout,
        body.rtd-clean-mode .floating.container.bottom-right {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(styleSheet);


    // =========================================================
    // 3. 侧边栏切换功能
    // =========================================================
    // 如果没有侧边栏结构，就不执行后续的切换逻辑，只单纯通过 CSS 净化（如果手动加类的话）
    if (!wyNavSide) return;

    const wyNavContentWrap = document.querySelector(".wy-nav-content-wrap");
    const wyNavContent = document.querySelector(".wy-nav-content");

    if (!wyNavContentWrap) return;

    // 配置参数
    const CONFIG = {
        storageKey: 'rtd-sidebar-state',
        shortcutKey: '[',
        altShortcutKey: 'm',
        maxWidth: '1200px'
    };

    // 读取状态
    let isMenuClosed = localStorage.getItem(CONFIG.storageKey) === 'true';

    // 创建切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = "rtd-toggle-btn";

    toggleBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 2147483647;
        width: 40px;
        height: 40px;
        background: #2980b9;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        opacity: 0.3;
        transition: opacity 0.3s, transform 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        outline: none;
    `;

    toggleBtn.onmouseenter = () => { toggleBtn.style.opacity = '1'; toggleBtn.style.transform = 'scale(1.1)'; };
    toggleBtn.onmouseleave = () => { toggleBtn.style.opacity = '0.3'; toggleBtn.style.transform = 'scale(1)'; };

    document.body.appendChild(toggleBtn);

    // 更新布局函数
    function updateLayout() {
        if (isMenuClosed) {
            // >>> 状态：关闭菜单 (进入专注模式) <<<

            // 1. 给 body 添加特定 class，触发 CSS 隐藏 AI 和 Flyout
            document.body.classList.add('rtd-clean-mode');

            // 2. 隐藏侧边栏
            wyNavSide.style.display = 'none';
            wyNavContentWrap.style.marginLeft = '0';

            // 3. 优化宽屏阅读体验
            if (wyNavContent) {
                wyNavContent.style.maxWidth = CONFIG.maxWidth;
                wyNavContent.style.margin = '0 auto';
            }

            toggleBtn.innerHTML = '☰';
            toggleBtn.title = `Open Sidebar & Widgets (Press "${CONFIG.shortcutKey}")`;

        } else {
            // >>> 状态：打开菜单 (恢复默认模式) <<<

            // 1. 移除 class，Ask AI 和 Flyout 会自动恢复显示
            document.body.classList.remove('rtd-clean-mode');

            // 2. 恢复侧边栏
            wyNavSide.style.display = '';
            wyNavContentWrap.style.marginLeft = '';

            // 3. 恢复内容宽度
            if (wyNavContent) {
                wyNavContent.style.maxWidth = '';
                wyNavContent.style.margin = '';
            }

            toggleBtn.innerHTML = '×';
            toggleBtn.title = `Close Sidebar & Hide Widgets (Press "${CONFIG.shortcutKey}")`;
        }
    }

    function toggleMenu() {
        isMenuClosed = !isMenuClosed;
        localStorage.setItem(CONFIG.storageKey, isMenuClosed);
        updateLayout();
    }

    // 初始化
    setTimeout(updateLayout, 0);

    // 事件监听
    toggleBtn.addEventListener('click', toggleMenu);

    document.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement.tagName.toUpperCase();
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement.isContentEditable) {
            return;
        }
        if (e.key === CONFIG.shortcutKey || e.key === CONFIG.altShortcutKey) {
            toggleMenu();
        }
    });

})();