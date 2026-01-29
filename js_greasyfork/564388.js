// ==UserScript==
// @name         B站工房插件
// @name:zh-CN   B站工房插件
// @namespace    https://github.com/ml0975990
// @version      1.0.0
// @description  在B站UP主页面显示工房链接，支持悬浮窗口预览
// @author       ml0975990
// @match        https://www.bilibili.com/video/*
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564388/B%E7%AB%99%E5%B7%A5%E6%88%BF%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/564388/B%E7%AB%99%E5%B7%A5%E6%88%BF%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================ 配置部分 ================
    const CONFIG = {
        // 窗口尺寸 (9:21比例)
        WINDOW_WIDTH: 320,
        WINDOW_HEIGHT: 750,
        // 按钮设置
        BUTTON_SIZE: 48,
        BUTTON_COLOR: '#FB7299', // B站粉色
        BUTTON_HOVER_COLOR: '#FF9DB5',
        // 动画速度
        ANIMATION_SPEED: 300,
        // 存储前缀
        STORAGE_PREFIX: 'BILI_WORKSHOP_',
        // 工房URL模板
        WORKSHOP_URL: 'https://mall.bilibili.com/neul-next/detailshop/index.html?smallShopMid={UID}&noTitleBar=1&from=mall-up_search&page=detailshop_detail'
    };

    // ================ 全局变量 ================
    let currentUID = null;
    let floatingWindow = null;
    let isWindowVisible = false;
    let floatingButton = null;
    let isInitialized = false;

    // ================ 样式注入 ================
    GM_addStyle(`
        /* 悬浮按钮样式 */
        .bili-workshop-btn {
            position: fixed !important;
            right: -60px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            width: ${CONFIG.BUTTON_SIZE}px !important;
            height: ${CONFIG.BUTTON_SIZE}px !important;
            background-color: ${CONFIG.BUTTON_COLOR} !important;
            border-radius: 50% !important;
            box-shadow: 0 4px 12px rgba(251, 114, 153, 0.3) !important;
            cursor: pointer !important;
            z-index: 999998 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all ${CONFIG.ANIMATION_SPEED}ms ease !important;
            border: 2px solid white !important;
            opacity: 0;
            pointer-events: none;
        }

        .bili-workshop-btn.visible {
            right: 20px !important;
            opacity: 1 !important;
            pointer-events: all !important;
        }

        .bili-workshop-btn:hover {
            background-color: ${CONFIG.BUTTON_HOVER_COLOR} !important;
            transform: translateY(-50%) scale(1.1) !important;
            box-shadow: 0 6px 20px rgba(251, 114, 153, 0.4) !important;
        }

        .bili-workshop-btn-icon {
            width: 60% !important;
            height: 60% !important;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>') !important;
            background-size: contain !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
        }

        /* 悬浮窗口样式 */
        .bili-workshop-window {
            position: fixed !important;
            width: ${CONFIG.WINDOW_WIDTH}px !important;
            height: ${CONFIG.WINDOW_HEIGHT}px !important;
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
            z-index: 999999 !important;
            overflow: hidden !important;
            display: none !important;
            border: 12px solid #1c1c1c !important;
            resize: both !important;
            min-width: 240px !important;
            min-height: 500px !important;
            transition: opacity ${CONFIG.ANIMATION_SPEED}ms ease !important;
            opacity: 0;
        }

        .bili-workshop-window.visible {
            display: block !important;
            opacity: 1 !important;
        }

        /* 窗口标题栏 */
        .bili-workshop-header {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 50px !important;
            background: linear-gradient(135deg, ${CONFIG.BUTTON_COLOR}, ${CONFIG.BUTTON_HOVER_COLOR}) !important;
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 12px !important;
            font-weight: bold !important;
            font-size: 12px !important;
            cursor: move !important;
            z-index: 1000 !important;
        }

        .bili-workshop-title {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .bili-workshop-title-icon {
            width: 20px !important;
            height: 20px !important;
        }

        .bili-workshop-controls {
            display: flex !important;
            gap: 10px !important;
        }

        .bili-workshop-control-btn {
            background: rgba(255, 255, 255, 0.2) !important;
            border: none !important;
            width: 28px !important;
            height: 28px !important;
            border-radius: 50% !important;
            color: white !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 14px !important;
            transition: background 0.2s !important;
        }

        .bili-workshop-control-btn:hover {
            background: rgba(255, 255, 255, 0.3) !important;
        }

        /* 手机状态栏模拟 */
        .bili-workshop-status-bar {
            position: absolute !important;
            top: 50px !important;
            left: 0 !important;
            right: 0 !important;
            height: 30px !important;
            background: #1c1c1c !important;
            color: white !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 0 16px !important;
            font-size: 12px !important;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif !important;
        }

        .bili-workshop-time {
            font-weight: 600 !important;
        }

        .bili-workshop-signal {
            display: flex !important;
            align-items: center !important;
            gap: 4px !important;
        }

        .bili-workshop-battery {
            display: flex !important;
            align-items: center !important;
        }

        /* 内容区域 */
        .bili-workshop-content {
            position: absolute !important;
            top: 50px !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            border: none !important;
        }

        .bili-workshop-loading {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            text-align: center !important;
            color: #666 !important;
        }

        .bili-workshop-loading-spinner {
            width: 40px !important;
            height: 40px !important;
            border: 3px solid #f3f3f3 !important;
            border-top: 3px solid ${CONFIG.BUTTON_COLOR} !important;
            border-radius: 50% !important;
            animation: bili-workshop-spin 1s linear infinite !important;
            margin: 0 auto 10px !important;
        }

        @keyframes bili-workshop-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* 窗口手柄 */
        .bili-workshop-resize-handle {
            position: absolute !important;
            width: 20px !important;
            height: 20px !important;
            right: 0 !important;
            bottom: 0 !important;
            cursor: nwse-resize !important;
            z-index: 1001 !important;
        }
    `);

    // ================ 工具函数 ================
    function extractUIDFromURL() {
        const pathname = window.location.pathname;
        const videoMatch = pathname.match(/\/video\/[A-Za-z0-9]+\/(\d+)/);
        const spaceMatch = pathname.match(/\/space\.bilibili\.com\/(\d+)/);

        return videoMatch ? videoMatch[1] : (spaceMatch ? spaceMatch[1] : null);
    }

    function extractUIDFromAvatar() {
        const avatarLink = document.querySelector('.up-avatar-wrap a.up-avatar[href*="space.bilibili.com"]');
        if (avatarLink) {
            const href = avatarLink.getAttribute('href');
            const uidMatch = href.match(/space\.bilibili\.com\/(\d+)/);
            return uidMatch ? uidMatch[1] : null;
        }
        return null;
    }

    function extractUIDFromInfoItem() {
        const infoItems = document.querySelectorAll('.info-item');
        for (const item of infoItems) {
            const uidDiv = item.querySelector('.vui_ellipsis.multi-mode');
            if (uidDiv && /^\d+$/.test(uidDiv.textContent.trim())) {
                return uidDiv.textContent.trim();
            }
        }
        return null;
    }

    function getCurrentUID() {
        let uid = extractUIDFromURL();
        if (!uid) uid = extractUIDFromAvatar();
        if (!uid) uid = extractUIDFromInfoItem();

        console.log('获取到的UID:', uid);
        return uid;
    }

    // ================ 窗口控制函数 ================
    function createFloatingButton() {
        if (floatingButton) return floatingButton;

        floatingButton = document.createElement('div');
        floatingButton.className = 'bili-workshop-btn';
        floatingButton.title = 'B站工房';

        const icon = document.createElement('div');
        icon.className = 'bili-workshop-btn-icon';
        floatingButton.appendChild(icon);

        floatingButton.addEventListener('click', toggleFloatingWindow);

        document.body.appendChild(floatingButton);

        // 延迟显示按钮，确保页面加载完成
        setTimeout(() => {
            if (floatingButton) {
                floatingButton.classList.add('visible');
            }
        }, 1000);

        return floatingButton;
    }

    function updateFloatingButton(show = true) {
        if (!floatingButton) return;

        if (show && currentUID) {
            floatingButton.classList.add('visible');
        } else {
            floatingButton.classList.remove('visible');
        }
    }

    function createFloatingWindow() {
        if (floatingWindow) return floatingWindow;

        // 创建窗口容器
        floatingWindow = document.createElement('div');
        floatingWindow.className = 'bili-workshop-window';

        // 设置初始位置（屏幕中央）
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        floatingWindow.style.left = (screenWidth - CONFIG.WINDOW_WIDTH) / 2 + 'px';
        floatingWindow.style.top = (screenHeight - CONFIG.WINDOW_HEIGHT) / 2 + 'px';

        // 创建窗口内容
        floatingWindow.innerHTML = `
            <div class="bili-workshop-header">
                <div class="bili-workshop-title">
                    <span>B站工房</span>
                    <span id="bili-workshop-uid"></span>
                </div>
                <div class="bili-workshop-controls">
                    <button class="bili-workshop-control-btn" id="bili-workshop-refresh">⟳</button>
                    <button class="bili-workshop-control-btn" id="bili-workshop-newtab">↗</button>
                    <button class="bili-workshop-control-btn" id="bili-workshop-close">×</button>
                </div>
            </div>
            <div class="bili-workshop-content">
                <iframe id="bili-workshop-frame" style="width:100%;height:100%;border:none;"></iframe>
                <div class="bili-workshop-loading" id="bili-workshop-loading">
                    <div class="bili-workshop-loading-spinner"></div>
                    <div>正在加载工房页面...</div>
                </div>
            </div>
            <div class="bili-workshop-resize-handle"></div>
        `;

        document.body.appendChild(floatingWindow);

        // 添加事件监听
        setupWindowEvents();

        return floatingWindow;
    }

    function setupWindowEvents() {
        if (!floatingWindow) return;

        // 窗口拖拽功能
        const header = floatingWindow.querySelector('.bili-workshop-header');
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            if (e.target.classList.contains('bili-workshop-control-btn')) return;

            isDragging = true;
            const rect = floatingWindow.getBoundingClientRect();
            dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            floatingWindow.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function doDrag(e) {
            if (!isDragging) return;

            floatingWindow.style.left = (e.clientX - dragOffset.x) + 'px';
            floatingWindow.style.top = (e.clientY - dragOffset.y) + 'px';
        }

        function stopDrag() {
            isDragging = false;
            floatingWindow.style.cursor = '';
            saveWindowPosition();
        }

        // 窗口调整大小功能
        const resizeHandle = floatingWindow.querySelector('.bili-workshop-resize-handle');
        let isResizing = false;
        let startSize = { width: 0, height: 0 };
        let startPos = { x: 0, y: 0 };

        resizeHandle.addEventListener('mousedown', startResize);
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);

        function startResize(e) {
            isResizing = true;
            startSize = {
                width: floatingWindow.offsetWidth,
                height: floatingWindow.offsetHeight
            };
            startPos = {
                x: e.clientX,
                y: e.clientY
            };
            e.preventDefault();
        }

        function doResize(e) {
            if (!isResizing) return;

            const deltaX = e.clientX - startPos.x;
            const deltaY = e.clientY - startPos.y;

            const newWidth = Math.max(CONFIG.WINDOW_WIDTH * 0.75, startSize.width + deltaX);
            const newHeight = Math.max(CONFIG.WINDOW_HEIGHT * 0.75, startSize.height + deltaY);

            // 保持9:21比例
            const targetHeight = (newWidth / 9) * 21;
            if (Math.abs(newHeight - targetHeight) > 50) {
                floatingWindow.style.width = newWidth + 'px';
                floatingWindow.style.height = targetHeight + 'px';
            } else {
                floatingWindow.style.width = newWidth + 'px';
                floatingWindow.style.height = newHeight + 'px';
            }
        }

        function stopResize() {
            isResizing = false;
            saveWindowSize();
        }

        // 控制按钮功能
        floatingWindow.querySelector('#bili-workshop-refresh').addEventListener('click', () => {
            loadWorkshopPage();
        });

        floatingWindow.querySelector('#bili-workshop-newtab').addEventListener('click', () => {
            if (currentUID) {
                const url = CONFIG.WORKSHOP_URL.replace('{UID}', currentUID);
                window.open(url, '_blank');
            }
        });

        floatingWindow.querySelector('#bili-workshop-close').addEventListener('click', () => {
            hideFloatingWindow();
        });

        // iframe加载事件
        const iframe = floatingWindow.querySelector('#bili-workshop-frame');
        iframe.addEventListener('load', () => {
            const loading = floatingWindow.querySelector('#bili-workshop-loading');
            if (loading) loading.style.display = 'none';
        });
    }

    function loadWorkshopPage() {
        if (!currentUID || !floatingWindow) return;

        const iframe = floatingWindow.querySelector('#bili-workshop-frame');
        const loading = floatingWindow.querySelector('#bili-workshop-loading');
        const uidDisplay = floatingWindow.querySelector('#bili-workshop-uid');

        // 显示UID
        uidDisplay.textContent = ` (UID: ${currentUID})`;

        // 显示加载动画
        if (loading) loading.style.display = 'block';

        // 加载工房页面
        const url = CONFIG.WORKSHOP_URL.replace('{UID}', currentUID);
        iframe.src = url;

        console.log('加载工房页面:', url);
    }

    function showFloatingWindow() {
        if (!floatingWindow) createFloatingWindow();
        if (!currentUID) return;

        // 恢复保存的位置和大小
        const savedPosition = GM_getValue(CONFIG.STORAGE_PREFIX + 'window_position', null);
        const savedSize = GM_getValue(CONFIG.STORAGE_PREFIX + 'window_size', null);

        if (savedPosition) {
            floatingWindow.style.left = savedPosition.x + 'px';
            floatingWindow.style.top = savedPosition.y + 'px';
        }

        if (savedSize) {
            floatingWindow.style.width = savedSize.width + 'px';
            floatingWindow.style.height = savedSize.height + 'px';
        }

        floatingWindow.classList.add('visible');
        isWindowVisible = true;

        // 加载页面
        loadWorkshopPage();

        // 更新按钮状态
        updateFloatingButton(false);
    }

    function hideFloatingWindow() {
        if (!floatingWindow) return;

        floatingWindow.classList.remove('visible');
        isWindowVisible = false;

        // 显示按钮
        updateFloatingButton(true);

        // 延迟隐藏以完成动画
        setTimeout(() => {
            if (!isWindowVisible && floatingWindow) {
                floatingWindow.style.display = 'none';
            }
        }, CONFIG.ANIMATION_SPEED);
    }

    function toggleFloatingWindow() {
        if (isWindowVisible) {
            hideFloatingWindow();
        } else {
            showFloatingWindow();
        }
    }

    function saveWindowPosition() {
        if (!floatingWindow) return;

        const rect = floatingWindow.getBoundingClientRect();
        const position = {
            x: rect.left,
            y: rect.top
        };

        GM_setValue(CONFIG.STORAGE_PREFIX + 'window_position', position);
    }

    function saveWindowSize() {
        if (!floatingWindow) return;

        const size = {
            width: floatingWindow.offsetWidth,
            height: floatingWindow.offsetHeight
        };

        GM_setValue(CONFIG.STORAGE_PREFIX + 'window_size', size);
    }

    // ================ 初始化函数 ================
    function initialize() {
        if (isInitialized) return;

        console.log('B站工房插件初始化...');

        // 获取当前UID
        currentUID = getCurrentUID();

        if (currentUID) {
            console.log('检测到UID:', currentUID);

            // 创建悬浮按钮
            createFloatingButton();

            // 更新按钮状态
            updateFloatingButton(true);

            isInitialized = true;

            // 添加右键菜单
            GM_registerMenuCommand('打开B站工房', () => {
                if (currentUID) {
                    showFloatingWindow();
                }
            });

            GM_registerMenuCommand('在新标签页打开', () => {
                if (currentUID) {
                    const url = CONFIG.WORKSHOP_URL.replace('{UID}', currentUID);
                    window.open(url, '_blank');
                }
            });
        } else {
            console.log('未检测到UID');
        }
    }

    // ================ 页面监控 ================
    function monitorPageChanges() {
        // 监听URL变化（SPA应用）
        let lastURL = window.location.href;

        const observer = new MutationObserver(() => {
            if (window.location.href !== lastURL) {
                lastURL = window.location.href;
                console.log('页面URL变化，重新初始化...');

                // 重新获取UID
                const newUID = getCurrentUID();
                if (newUID !== currentUID) {
                    currentUID = newUID;

                    // 如果窗口已打开，更新内容
                    if (isWindowVisible && floatingWindow) {
                        loadWorkshopPage();
                    }

                    // 更新按钮状态
                    updateFloatingButton(!!newUID);
                }
            }
        });

        observer.observe(document, { subtree: true, childList: true });

        // 监听DOM变化，确保在动态加载的内容中也能找到UID
        const domObserver = new MutationObserver(() => {
            if (!currentUID) {
                const uid = getCurrentUID();
                if (uid && uid !== currentUID) {
                    currentUID = uid;
                    if (!isInitialized) {
                        initialize();
                    }
                }
            }
        });

        domObserver.observe(document.body, { childList: true, subtree: true });
    }

    // ================ 主函数 ================
    function main() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initialize, 1000);
            });
        } else {
            setTimeout(initialize, 1000);
        }

        // 启动页面监控
        monitorPageChanges();

        // 全局键盘快捷键 (Ctrl+Shift+B)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                toggleFloatingWindow();
            }

            // ESC键关闭窗口
            if (e.key === 'Escape' && isWindowVisible) {
                hideFloatingWindow();
            }
        });
    }

    // 启动脚本
    main();

})();