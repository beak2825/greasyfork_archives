// ==UserScript==
// @name         蓝湖界面优化+去广
// @namespace    https://lanhuapp.com/
// @version      1.3
// @description  蓝湖网站优化，去广告、主页紧凑化、结构卡片化、原型目录紧凑展示，组织对齐、标注紧凑展示更多内容、原型侧边栏展开折叠。插件设置面板可预览效果。
// @author       liteyais
// @match        https://lanhuapp.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iIzQ5NzJGMSIgZD0iTTI0LjUxMSA2Yy41MjEuMDI0LjU0Mi4wODIuNzI0LjE2OS43NjggMi41MTItMS4wODYgMy45MTUtMS41MjkgNS43MDggNC4wODggMy4zNDYgMi4yNDQgOS4wOTQgMy4zNzcgMTQuODc1LjQ2OCAxLjk5IDEuMDM2IDMuNzc5IDEuOTMgNS4wNjVsLjE1Ni4xODNIMi4zM2MuODI2LTEuMTU5IDEuNzAzLTIuMjU3IDIuMTU0LTQuMDQyLjczLTIuNzM4LjE1LTYuMTUuNjUxLTkuNDE1LjU1Ni0yLjc0OCAxLjU3OC00LjY1MyAyLjg4Ni02LjUxM0M3LjQ1NiAxMC41NDMgNS4yMDMgOC4wNzYgNi41IDZjLjQzNy4wMDUuNTM1LjAxNi43MTYuMTYxIDEuNDQuNzEgMS45MzMgMi42NjIgMy4zODUgMy40NTcgMS44MTUtLjQxMiAzLjQ3Ny0xLjg4MyA2LjAzLTEuNDQ3IDEuODE3LjI5IDMuMTI2IDEuMTE0IDQuNTAzIDEuMzY3QzIyLjQwNCA4LjQ2MSAyMy4zMSA2Ljk2MiAyNC41MTEgNiIvPjxjaXJjbGUgY3g9IjE2LjI2NiIgY3k9IjIxIiByPSI3IiBmaWxsPSIjZmZmIi8+PGNpcmNsZSBjeD0iMTkuMjM0IiBjeT0iMTkuNSIgcj0iMy41IiBmaWxsPSIjMDMwNDA4Ii8+PHBhdGggZmlsbD0iIzAwMCIgZD0iTTEwLjA2MyA5LjU5MmEuODE4LjgxOCAwIDAgMCAuNjAyIDEuMTc4YzMuMjI2LjUwNSA4LjMzIDEuMTc4IDkuMzk4LjgyMi41MjYtLjE3NSAxLjQ4MS0uNDEyIDIuNS0uNThhMjAgMjAgMCAwIDEtLjIzMi0xLjczN2MtMS43ODcuMTQ3LTguNjk2LS43MjgtMTEuOTI4LTEuMTgzLS4xMTEuNzI1LS4yMjcgMS4yNzQtLjM0IDEuNSIvPjxwYXRoIGZpbGw9IiNGRjJCMkIiIGQ9Ik0yMi42ODcgMy45MjRjLjE2Ny0uNDkuMDU2LTEuMDY3LS40MDItMS4zMS0yLjE1Mi0xLjE0My02LjM1OC0yLjIzLTEwLjU1NS0xLjIwM2EuOTYuOTYgMCAwIDAtLjcxOC44N2MtLjEzMyAxLjcxNy0uMzYgNC4xOTgtLjYwOSA1LjgxMSAzLjIzMi40NTUgMTAuMTQxIDEuMzMgMTEuOTI4IDEuMTgzLS4xNTUtMS42NzctLjE2Ni0zLjgxOS4zNTYtNS4zNTFNMTAuMDYzIDkuNTkyYy0xLS4zMzMtMy4yLS44LTQgMC0xIDEgLjUgMi41IDEuNSAzIC45MzUuNDY3IDguNTYyIDEuMjkgMTUuMjY4LjU4MmEzLjkgMy45IDAgMCAxIDIuNTc5LjYxYy4yMDMuMTM1LjQ2LjE2NC42ODQuMDY4Ljg3LS4zNyAyLjA3NS0xLjAzNSAxLjY0LTIuMjYtLjUzMy0xLjUtMy4yOC0uODk0LTUuMTctLjU4LTEuMDIuMTY4LTEuOTc1LjQwNS0yLjUuNTgtMS4wNjguMzU2LTYuMTczLS4zMTctOS4zOTgtLjgyMmEuODE4LjgxOCAwIDAgMS0uNjAzLTEuMTc4Ii8+PC9zdmc+
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @homepageURL  https://github.com/liteyais/lanhu_optimize-ad_removal
// @supportURL   https://github.com/liteyais/lanhu_optimize-ad_removal/issues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560066/%E8%93%9D%E6%B9%96%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%2B%E5%8E%BB%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/560066/%E8%93%9D%E6%B9%96%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%2B%E5%8E%BB%E5%B9%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        CSS_ENABLED_KEY: 'lanhu_css_enabled',
        PANEL_ENABLED_KEY: 'lanhu_panel_enabled',
        SIDEBAR_COLLAPSED_KEY: 'lanhu_sidebar_collapsed',
        STYLE_ID: 'lanhu-custom-css-style',
        PANEL_ID: 'lanhu-control-panel',
        TOGGLE_BUTTON_ID: 'lanhu-sidebar-toggle',
        OBSERVER_ID: 'lanhu-sidebar-observer'
    };

    // 状态变量
    let isCSSEnabled = GM_getValue(CONFIG.CSS_ENABLED_KEY, true);
    let isPanelEnabled = GM_getValue(CONFIG.PANEL_ENABLED_KEY, false);
    let isSidebarCollapsed = GM_getValue(CONFIG.SIDEBAR_COLLAPSED_KEY, false);
    let observer = null; // 用于监听侧边栏宽度变化

    // 你的CSS代码
    const customCSS = `
        /* 在这里添加你的CSS代码 */
        .n-material-square-transition {
            display: none !important;
        }
        .banner-container {
            display: none !important;
        }
        .discount {
            display: none !important;
        }
        img.icon-send {
            display: none !important;
        }
        .material-square {
            display: none !important;
        }

        .prototype-sidebar .directory-list .directory-list-item .tree-item-wrapper .tree-name {
            padding: 4px 2px 4px 0px !important;
            font-size: 14px !important;
            width: calc(100% - 16px) !important;
        }
        img.icon-arrow.visible-icon {
            width: 24px;

        }
        img.icon-arrow {

            margin-left: -6px;
        }
        .prototype-sidebar .directory-list .directory-list-item .tree-item-wrapper .icon-folder {
            content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjNjU2OTczIiBkPSJNOC40OTUgMWMuNTMgMCAxLjA0LjIxMSAxLjQxNC41ODZMMTIuMzIzIDRIMTguOWEyIDIgMCAwIDEgMiAydjMuMDAyYTEuOTUgMS45NSAwIDAgMSAxLjg2NyAyLjMxNGwtMS43MyA5LjA1OUEyIDIgMCAwIDEgMTkuMDczIDIySDNhMyAzIDAgMCAxLTMtM1YzYTIgMiAwIDAgMSAyLTJ6TTIgMTEuOTZsLjE3Ni0uNjk1QTMgMyAwIDAgMSA1LjA4NCA5SDE4LjlWNmgtNi41NzdhMiAyIDAgMCAxLTEuNDE0LS41ODZMOC40OTUgM0gyeiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMjR2MjRIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=")  !important;
            width: 16px !important;
            height: 16px !important;
            margin-right: 2px !important;
        }
        .icon-arrow{
            content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wMSIgZD0iTTAgMHYyNGgyNFYweiIvPjxwYXRoIGZpbGw9IiM5Nzk2OUYiIGQ9Ik0xNy4zNjQgOC4zNjNhLjkuOSAwIDAgMSAxLjI3MyAxLjI3NGwtNiA2YS45LjkgMCAwIDEtMS4yNzQgMGwtNi02YS45LjkgMCAwIDEgMS4yNzQtMS4yNzRMMTIgMTMuNzI3eiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMjR2MjRIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=")  !important;
            width: 16px !important;
            height: 16px !important;
            margin-right: 4px !important;
                
        }
        .prototype-page.doc-wrapper {
            background-color: #f2f3f4 !important;
        }
        .prototype-sidebar {
            z-index: 9;
            border-right: 1px solid #fff !important;
            margin: 8px;
            border-radius: 8px;
            overflow: hidden;
            height: calc(100% - 72px)!important;
            top: 56px!important;
            transition: all 0.1s ease !important; /* 缩短过渡时间 */
        }
        .doc-page .doc-wrapper {
            height: 100% !important;

        }
        .view-project .project-nav {
            border: none !important;
            margin: 8px !important;
            border-radius: 8px !important;
            width: calc(100% - 16px) !important;
            background: rgba(255, 255, 255, 0.80) !important;;
            backdrop-filter: blur(4px);
        }
        .activity-entry {
            display: none !important;
        }
        .prototype-page-wrapper {
            margin: 65px 8px 0 2px !important;
            border-radius: 8px !important;
            height: calc(100% - 72px)!important;
            transition: all 0.1s ease !important;
        }
        .top-toolbar {
            top: 7px !important;
        }
        #lan-mapping-iframe[data-v-76f87262] {
            border: none !important;
        }
        .tree-list-section-wrap {
            top: 56px !important;
            left: 8px !important;

        }
        .tree-list-section-wrap .nav-tree-conetnt-show {
                box-shadow: 0 8px 11px rgba(0, 0, 0, .04), 0 0 2px 0px rgb(0 0 0 / 8%) !important;
        }
        .header-space {
            height: 0px !important;
            margin: 0 !important;
        }
        .l-tree-node__content {
            height: 34px !important;
        }
        .mgai-icon-wrapper{
            width: 24px !important
        }
        .add-project .add-item{
            height: 44px !important;
            border: 1px solid #eaecf0 !important;
        }
        .add-project__icon {
            height: 44px !important;
            width: 44px !important;
        }
        .file-item .card[data-v-48018687] {
            border: 1px solid #eaecf0 !important;
            border-radius: 12px !important;

        }
        .lh-activity .search-container .n-input {
            border-radius: 200px;
            height: 38px !important;
        }

        .header-space .icon_btn {
            top: 8px !important;
        }
        .doc-page .doc-wrapper.fullScreen > .prototype-page-wrapper{
            margin: 0 !important;
            height: 100% !important;
        }
        .view-project .project-nav.fullScreen {
            top: -2px !important;
        }
        .bottom-toolbar .nav-item-tips {
            margin-right: 4px;
        }
        .nav-item-zoom[data-v-27ba8bc0] {
         padding: 0!important;
        }
        .bottom-toolbar {
            bottom: 10px !important;
            border-radius: 8px!important;
           right: 54px !important;
        }
        .help-center-wrap.di.close-pos {
            right: 8px !important;
            bottom: 8px !important;
        }
        .help-center-wrap .helpClass.di svg{
            font-size: 32px !important;
        }
        .help-center-wrap[data-v-2ba38895] {
            bottom: 8px !important;
        }
        .help-center-wrap .helpClass[data-v-2ba38895] {
            width: 26px !important;
            height: 26px !important;
            margin: 0 auto !important;
        }
        .help-center-wrap .sos-btn[data-v-2ba38895] {
            width: 30px !important;
            height: 30px !important;
            background: transparent !important;
        }
        .prototype-sidebar .directory-list {
            overflow-x: hidden !important;
        }
        .mgai-icon-wrapper {
            background: none !important;
        }
        /* 侧边栏折叠样式 */
        .lanhu-sidebar-collapsed {
            width: 0 !important;
            min-width: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            margin: 0 !important; /* 折叠时去掉margin */
            border-right: none !important;
        }
        .lanhu-sidebar-collapsed + .prototype-page-wrapper {
            margin-left: 8px !important;
        }
        .operation-wrap {
            border: none !important;
            margin: 8px !important;
            border-radius: 8px !important;
            width: calc(100% - 16px) !important;
            background: rgba(255, 255, 255, 0.80) !important;
            backdrop-filter: blur(4px);
        }
        .section-box {
            height: calc(100vh - 74px) !important;
            position: absolute;
            top: 66px !important;
            left: 8px !important;
            z-index: 11111;
            background: white;
            transition: left ease 0.5s;
            padding-right: 4px;
            border-radius: 8px !important;
        }
        #detail_container .info {
        top: 65px !important;
            right: 8px !important;
            border-radius: 8px !important;
            border: none !important;
            box-shadow: -4px 0px 32px 4px #cccccc2e !important;
            height: calc(100vh - 73px) !important;
        }
        /* 折叠按钮样式 - 新增折叠按钮class */
        #lanhu-sidebar-toggle.lanhu-btn-collapsed {
            /* 折叠后的按钮样式 - 您可以通过CSS自定义这个位置 */
            left: 0px !important;
            /* 示例：按钮向左移动并改变颜色 */
            background: #f0f0f0 !important;
            border-color: #ccc !important;
        }
        /* 标注紧凑面模板 */
        .annotation_container_b .annotation_container .annotation_item {
            padding: 8px 0 0 0 !important;
        }
        .annotation_container_b .annotation_container .annotation_item .subtitle {
            line-height: 24px !important;
            height: 24px !important;
            margin-bottom: 8px !important;
        }
        .annotation_container_b .annotation_container .annotation_item li {
            margin-bottom: 8px !important;
        }
        .annotation_container_b .annotation_container .annotation_item li .item_title {
            line-height: 32px !important;
            height: 32px !important;
        }
        .annotation_container_b .annotation_container .annotation_item li .item_one {
            line-height: 32px !important;
            height: 32px !important;
        }
        .code_detail pre {
            padding: 4px 24px !important;
        }
        .annotation_container_b .annotation_container .annotation_item li .layer_name {
            line-height: 32px !important;
        }
        .annotation_container_b .annotation_container .annotation_item li .item_align > div {
            line-height: 32px !important;
            height: 32px !important;
        }
        .annotation_container_b .annotation_container .annotation_item li .item_two {
            line-height: 32px !important;
            height: 32px !important;
            margin-right: 8px !important;
            width: 90px !important;
        }
    `;

    // ========== CSS管理函数 ==========

    // 注入CSS
    function injectCSS() {
        // 先移除可能存在的样式
        removeCSS();

        // 如果CSS开关关闭，不注入
        if (!isCSSEnabled) return;

        // 创建并添加样式
        const style = document.createElement('style');
        style.id = CONFIG.STYLE_ID;
        style.type = 'text/css';
        style.textContent = customCSS;
        document.head.appendChild(style);

        console.log('蓝湖优化CSS已注入');
    }

    // 移除CSS
    function removeCSS() {
        const style = document.getElementById(CONFIG.STYLE_ID);
        if (style) {
            style.remove();
            console.log('蓝湖优化CSS已移除');
        }
    }

    // 切换CSS开关
    function toggleCSS() {
        isCSSEnabled = !isCSSEnabled;
        GM_setValue(CONFIG.CSS_ENABLED_KEY, isCSSEnabled);

        if (isCSSEnabled) {
            injectCSS();
            // CSS注入后检查是否需要显示折叠按钮
            setTimeout(checkAndInitSidebarToggle, 100);
        } else {
            removeCSS();
            // 移除侧边栏折叠按钮
            const toggleBtn = document.getElementById(CONFIG.TOGGLE_BUTTON_ID);
            if (toggleBtn) toggleBtn.remove();
            // 停止监听侧边栏宽度变化
            stopObservingSidebar();
        }

        // 更新面板开关状态（如果面板存在）
        updatePanelSwitch();
    }

    // ========== 侧边栏折叠功能 ==========

    // 检查侧边栏是否存在并初始化折叠功能
    function checkAndInitSidebarToggle() {
        const sidebarSelector = '.doc-page .doc-wrapper .prototype-sidebar';
        const sidebar = document.querySelector(sidebarSelector);
        const toggleBtn = document.getElementById(CONFIG.TOGGLE_BUTTON_ID);

        // 如果侧边栏存在，初始化折叠功能
        if (sidebar) {
            if (!toggleBtn) {
                initSidebarToggle();
            }
        } else {
            // 如果侧边栏不存在，移除按钮
            if (toggleBtn) {
                toggleBtn.remove();
            }
            // 停止监听侧边栏宽度变化
            stopObservingSidebar();
        }
    }

    // 初始化侧边栏折叠功能
    function initSidebarToggle() {
        // 获取侧边栏元素
        const sidebar = document.querySelector('.doc-page .doc-wrapper .prototype-sidebar');
        if (!sidebar) {
            console.log('未找到左侧边栏，不显示折叠按钮');
            return;
        }

        // 创建折叠按钮
        function createToggleButton() {
            // 如果按钮已存在，先移除
            const existingBtn = document.getElementById(CONFIG.TOGGLE_BUTTON_ID);
            if (existingBtn) existingBtn.remove();

            // 创建按钮元素
            const toggleBtn = document.createElement('button');
            toggleBtn.id = CONFIG.TOGGLE_BUTTON_ID;
            toggleBtn.title = isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏';

            // 按钮样式 - 固定在左侧
            toggleBtn.style.cssText = `
                position: fixed;
                z-index: 1000;
                color: rgb(102, 102, 102);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
                box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
                transition: left 0.1s ease, background 0.3s ease !important; /* 快速响应 */
                user-select: none;
                top: 245px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                border: 0.5px solid rgb(238, 239, 241);
                background: rgb(255, 255, 255);
            `;

            // 设置按钮位置
            function updateButtonPosition(immediate = false) {
                if (!sidebar) return;
                
                const sidebarRect = sidebar.getBoundingClientRect();
                if (!isSidebarCollapsed && sidebarRect.width > 0) {
                    // 侧边栏展开时，按钮在侧边栏右侧
                    const buttonLeft = sidebarRect.right - 15; // 按钮中心在侧边栏右侧
                    if (immediate) {
                        // 立即更新，无过渡
                        toggleBtn.style.transition = 'none';
                        toggleBtn.style.left = `${buttonLeft}px`;
                        // 下一帧恢复过渡
                        requestAnimationFrame(() => {
                            toggleBtn.style.transition = 'left 0.1s ease, background 0.3s ease';
                        });
                    } else {
                        toggleBtn.style.left = `${buttonLeft}px`;
                    }
                }
            }

            // 初始化按钮位置
            updateButtonPosition();

            // 设置按钮图标
            function updateButtonIcon() {
                toggleBtn.innerHTML = isSidebarCollapsed ? '→' : '←';
                toggleBtn.title = isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏';
                
                // 根据折叠状态添加/移除class
                if (isSidebarCollapsed) {
                    toggleBtn.classList.add('lanhu-btn-collapsed');
                    // 折叠时立即移动到折叠位置
                    toggleBtn.style.transition = 'none';
                    toggleBtn.style.left = '0px'; // 默认位置，CSS可以覆盖
                } else {
                    toggleBtn.classList.remove('lanhu-btn-collapsed');
                    // 展开时恢复过渡效果
                    toggleBtn.style.transition = 'left 0.1s ease, background 0.3s ease';
                }
            }

            // 初始化按钮图标
            updateButtonIcon();

            // 点击事件 - 切换侧边栏状态
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleSidebar();
            });

            // 鼠标悬停效果
            toggleBtn.addEventListener('mouseenter', function() {
                this.style.background = isSidebarCollapsed ? '#e0e0e0' : '#f5f5f5';
                this.style.transform = 'scale(1.1)';
            });

            toggleBtn.addEventListener('mouseleave', function() {
                this.style.background = isSidebarCollapsed ? '#f0f0f0' : '#ffffff';
                this.style.transform = 'scale(1)';
            });

            // 添加到页面
            document.body.appendChild(toggleBtn);

            return { toggleBtn, updateButtonPosition };
        }

        // 切换侧边栏显示/隐藏
        function toggleSidebar() {
            const oldState = isSidebarCollapsed;
            isSidebarCollapsed = !isSidebarCollapsed;

            // 保存状态
            GM_setValue(CONFIG.SIDEBAR_COLLAPSED_KEY, isSidebarCollapsed);

            // 获取按钮
            const toggleBtn = document.getElementById(CONFIG.TOGGLE_BUTTON_ID);
            
            // 如果是展开操作（从折叠到展开）
            if (oldState && !isSidebarCollapsed) {
                // 先更新按钮图标和状态
                if (toggleBtn) {
                    updateButtonIcon(toggleBtn);
                }
                
                // 立即应用侧边栏展开状态
                applySidebarState();
                
                // 立即更新按钮位置（无过渡）
                setTimeout(() => {
                    if (toggleBtn && sidebarController && typeof sidebarController.updateButtonPosition === 'function') {
                        sidebarController.updateButtonPosition(true); // immediate=true
                    }
                }, 10); // 短暂延迟确保DOM已更新
            } 
            // 如果是折叠操作（从展开到折叠）
            else if (!oldState && isSidebarCollapsed) {
                // 更新按钮图标和状态
                if (toggleBtn) {
                    updateButtonIcon(toggleBtn);
                }
                
                // 应用折叠状态
                applySidebarState();
            }

            console.log('侧边栏状态:', isSidebarCollapsed ? '已折叠' : '已展开');
        }

        // 更新按钮图标和class
        function updateButtonIcon(button) {
            button.innerHTML = isSidebarCollapsed ? '→' : '←';
            button.title = isSidebarCollapsed ? '展开侧边栏' : '折叠侧边栏';
            
            // 根据折叠状态添加/移除class
            if (isSidebarCollapsed) {
                button.classList.add('lanhu-btn-collapsed');
            } else {
                button.classList.remove('lanhu-btn-collapsed');
            }
        }

        // 应用侧边栏状态
        function applySidebarState() {
            if (isSidebarCollapsed) {
                sidebar.classList.add('lanhu-sidebar-collapsed');
                // 折叠时设置margin为0
                sidebar.style.margin = '0 !important';
            } else {
                sidebar.classList.remove('lanhu-sidebar-collapsed');
                // 展开时恢复原来的margin
                sidebar.style.margin = '';
            }
        }

        // 启动监听侧边栏宽度变化
        function startObservingSidebar() {
            // 停止之前的监听
            stopObservingSidebar();
            
            observer = new ResizeObserver(() => {
                const toggleBtn = document.getElementById(CONFIG.TOGGLE_BUTTON_ID);
                if (toggleBtn && !isSidebarCollapsed) {
                    // 只有在侧边栏展开时才更新按钮位置
                    const sidebarRect = sidebar.getBoundingClientRect();
                    if (sidebarRect.width > 0) {
                        const buttonLeft = sidebarRect.right - 15;
                        toggleBtn.style.left = `${buttonLeft}px`;
                    }
                }
            });
            
            observer.observe(sidebar);
            console.log('开始监听侧边栏宽度变化');
            
            // 立即执行一次位置更新
            const toggleBtn = document.getElementById(CONFIG.TOGGLE_BUTTON_ID);
            if (toggleBtn && !isSidebarCollapsed) {
                const sidebarRect = sidebar.getBoundingClientRect();
                if (sidebarRect.width > 0) {
                    const buttonLeft = sidebarRect.right - 15;
                    toggleBtn.style.left = `${buttonLeft}px`;
                }
            }
        }
        
        // 停止监听侧边栏宽度变化
        function stopObservingSidebar() {
            if (observer) {
                observer.disconnect();
                observer = null;
                console.log('停止监听侧边栏宽度变化');
            }
        }

        // 初始化
        const { toggleBtn, updateButtonPosition } = createToggleButton();
        applySidebarState();
        
        // 启动宽度变化监听
        startObservingSidebar();

        console.log('侧边栏折叠功能已初始化');

        // 返回控制函数
        return {
            toggle: toggleSidebar,
            isCollapsed: () => isSidebarCollapsed,
            updateButtonPosition: updateButtonPosition
        };
    }

    // 停止监听侧边栏宽度变化
    function stopObservingSidebar() {
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log('停止监听侧边栏宽度变化');
        }
    }

    // ========== 控制面板函数 ==========

    // 创建控制面板
    function createControlPanel() {
        // 如果面板已存在，先移除
        const existingPanel = document.getElementById(CONFIG.PANEL_ID);
        if (existingPanel) {
            existingPanel.remove();
        }

        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = CONFIG.PANEL_ID;

        // 面板样式
        panel.style.cssText = `
            position: fixed;
            top: 66px;
            right: 8px;
            z-index: 999999;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            width: 260px;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        `;

        // 面板内容 - 只有优化开关
        panel.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 600; font-size: 15px; color: #333;">蓝湖优化（测一下）</div>
                    <button id="panel-close-btn" style="
                        background: none;
                        border: none;
                        color: #eb0000;
                        cursor: pointer;
                        font-size: 12px;
                        padding: 2px 8px;
                        border-radius: 3px;
                        transition: background 0.2s;
                    ">不再显示</button>
                </div>
            </div>

            <div style="padding: 8px 16px;">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;height: 24px;
                    
                ">
                    <div style="font-weight: 500; font-size: 14px; color: #333;">启用优化</div>
                    <div>
                        <label class="lanhu-switch">
                            <input type="checkbox" id="panel-css-switch" ${isCSSEnabled ? 'checked' : ''}>
                            <span class="lanhu-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加面板专属样式
        const panelStyle = document.createElement('style');
        panelStyle.textContent = `
            .lanhu-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
            }

            .lanhu-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .lanhu-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .3s;
                border-radius: 24px;
            }

            .lanhu-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }

            input:checked + .lanhu-slider {
                background-color: #4CAF50;
            }

            input:checked + .lanhu-slider:before {
                transform: translateX(20px);
            }

            #${CONFIG.PANEL_ID} {
                animation: panelFadeIn 0.3s ease forwards;
            }

            @keyframes panelFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(panelStyle);

        // 添加交互事件
        setupPanelEvents();

        // 显示面板动画
        setTimeout(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, 10);
    }

    // 设置面板事件监听
    function setupPanelEvents() {
        // 关闭按钮
        const closeBtn = document.getElementById('panel-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                hideControlPanel();
            });

            // 悬停效果
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = '#f5f5f5';
            });

            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.background = 'none';
            });
        }

        // 优化开关切换
        const cssSwitch = document.getElementById('panel-css-switch');
        if (cssSwitch) {
            cssSwitch.addEventListener('change', () => {
                toggleCSS();
            });
        }
    }

    // 更新面板开关状态
    function updatePanelSwitch() {
        const cssSwitch = document.getElementById('panel-css-switch');
        if (cssSwitch) {
            cssSwitch.checked = isCSSEnabled;
        }
    }

    // 显示控制面板
    function showControlPanel() {
        // 更新状态
        isPanelEnabled = true;
        GM_setValue(CONFIG.PANEL_ENABLED_KEY, true);

        // 创建并显示面板
        createControlPanel();

        console.log('控制面板已显示');
    }

    // 隐藏控制面板
    function hideControlPanel() {
        // 更新状态
        isPanelEnabled = false;
        GM_setValue(CONFIG.PANEL_ENABLED_KEY, false);

        // 隐藏面板
        const panel = document.getElementById(CONFIG.PANEL_ID);
        if (panel) {
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(-10px)';

            // 动画结束后移除
            setTimeout(() => {
                if (panel.parentNode) {
                    panel.remove();
                }
            }, 300);
        }

        console.log('控制面板已隐藏');
    }

    // 切换面板显示状态
    function toggleControlPanel() {
        const panel = document.getElementById(CONFIG.PANEL_ID);
        if (panel) {
            hideControlPanel();
        } else {
            showControlPanel();
        }
    }

    // ========== 油猴菜单命令 ==========

    // 注册菜单命令
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            // 唯一菜单命令：设置面板
            GM_registerMenuCommand('设置面板', toggleControlPanel);
        }
    }

    // ========== 初始化函数 ==========

    // 侧边栏折叠控制器
    let sidebarController = null;

    // 初始化
    function init() {
        // 1. 根据CSS开关状态注入CSS
        if (isCSSEnabled) {
            injectCSS();

            // 2. 检查并初始化侧边栏折叠功能
            setTimeout(() => {
                sidebarController = checkAndInitSidebarToggle();
            }, 500);
        }

        // 3. 根据面板开关状态显示面板
        if (isPanelEnabled) {
            // 延迟显示面板，确保页面加载完成
            setTimeout(() => {
                showControlPanel();
            }, 800);
        }

        // 4. 注册菜单命令
        registerMenuCommands();

        console.log('蓝湖优化脚本已初始化');
        console.log('- CSS状态:', isCSSEnabled ? '开启' : '关闭');
        console.log('- 面板状态:', isPanelEnabled ? '显示' : '隐藏');
        console.log('- 侧边栏状态:', isSidebarCollapsed ? '折叠' : '展开');
    }

    // 监听页面变化（针对单页应用）
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            // 检查我们的样式是否还在
            const style = document.getElementById(CONFIG.STYLE_ID);
            if (isCSSEnabled && !style) {
                // 如果开关开启但样式丢失，重新注入
                injectCSS();
            }

            // 检查侧边栏是否存在，动态显示/隐藏折叠按钮
            if (isCSSEnabled) {
                sidebarController = checkAndInitSidebarToggle();
            } else {
                // 如果CSS关闭，停止监听侧边栏宽度变化
                stopObservingSidebar();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ========== 启动脚本 ==========

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            observePageChanges();
        });
    } else {
        init();
        observePageChanges();
    }
})();