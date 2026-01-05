// ==UserScript==
// @name         Twitter/X 侧边栏隐藏器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  隐藏 Twitter/X 的左右侧边栏，只显示中间的推文和文章内容，支持自定义宽度
// @author       kiyans
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.twitter.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561475/TwitterX%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E9%9A%90%E8%97%8F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561475/TwitterX%20%E4%BE%A7%E8%BE%B9%E6%A0%8F%E9%9A%90%E8%97%8F%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认配置
    const DEFAULT_WIDTH = 1200;
    const MIN_WIDTH = 600;
    const MAX_WIDTH = 1800;

    // 获取保存的宽度设置
    let contentWidth = GM_getValue('contentWidth', DEFAULT_WIDTH);

    // 生成动态CSS
    function generateCSS(width) {
        return `
            /* 隐藏左侧边栏 (导航栏) */
            header[role="banner"] {
                display: none !important;
            }

            /* 隐藏右侧边栏 (搜索、趋势、推荐用户等) */
            div[data-testid="sidebarColumn"] {
                display: none !important;
            }

            /* 让主内容区域居中并扩展宽度 */
            main[role="main"] {
                margin-left: auto !important;
                margin-right: auto !important;
                max-width: ${width}px !important;
                width: 100% !important;
            }

            /* 核心修复：覆盖 primaryColumn 的硬编码宽度 */
            div[data-testid="primaryColumn"] {
                max-width: ${width}px !important;
                width: 100% !important;
                border-right: none !important;
            }

            /* 覆盖 primaryColumn 内部所有子元素的宽度限制 */
            div[data-testid="primaryColumn"] > div,
            div[data-testid="primaryColumn"] > div > div,
            div[data-testid="primaryColumn"] > div > div > div {
                max-width: none !important;
                width: 100% !important;
            }

            /* 时间线容器宽度 */
            section[role="region"] {
                max-width: none !important;
                width: 100% !important;
            }

            /* 推文列表容器 */
            div[aria-label*="Timeline"] > div,
            div[aria-label*="时间线"] > div {
                max-width: none !important;
                width: 100% !important;
            }

            /* 每条推文的容器 */
            div[data-testid="cellInnerDiv"] {
                max-width: none !important;
                width: 100% !important;
            }

            /* 推文内容本身 */
            article[data-testid="tweet"] {
                max-width: 100% !important;
                width: 100% !important;
            }

            /* 推文内部的各个部分 */
            article[data-testid="tweet"] > div,
            article[data-testid="tweet"] > div > div {
                max-width: 100% !important;
            }

            /* 推文文本内容 */
            div[data-testid="tweetText"] {
                max-width: 100% !important;
            }

            /* 推文中的媒体（图片/视频） */
            div[data-testid="tweetPhoto"],
            div[data-testid="videoPlayer"] {
                max-width: 100% !important;
            }

            /* 顶部标签栏（为你推荐/正在关注） */
            nav[role="navigation"] {
                max-width: ${width}px !important;
            }

            /* 移除可能存在的硬编码宽度类 */
            div[data-testid="primaryColumn"] [class*="r-1ye8kvj"],
            div[data-testid="primaryColumn"] [class*="r-16y2uox"] {
                max-width: none !important;
                width: 100% !important;
            }

            /* 隐藏底部导航栏 (移动端视图) */
            nav[aria-label="Bottom navigation"],
            div[data-testid="BottomBar"] {
                display: none !important;
            }

            /* 设置按钮样式 */
            #twitter-hider-settings-btn {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #1da1f2, #0d8ecf);
                color: white;
                border: none;
                cursor: pointer;
                font-size: 20px;
                box-shadow: 0 4px 15px rgba(29, 161, 242, 0.4);
                z-index: 999999;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            #twitter-hider-settings-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(29, 161, 242, 0.6);
            }

            /* 设置面板样式 */
            #twitter-hider-settings-panel {
                position: fixed;
                bottom: 80px;
                left: 20px;
                width: 320px;
                background: #15202b;
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
                z-index: 999999;
                padding: 20px;
                display: none;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            #twitter-hider-settings-panel.show {
                display: block;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            #twitter-hider-settings-panel h3 {
                color: #fff;
                margin: 0 0 20px 0;
                font-size: 18px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            #twitter-hider-settings-panel .setting-group {
                margin-bottom: 20px;
            }

            #twitter-hider-settings-panel label {
                color: #8899a6;
                font-size: 14px;
                display: block;
                margin-bottom: 10px;
            }

            #twitter-hider-settings-panel .width-display {
                color: #1da1f2;
                font-weight: 700;
                font-size: 24px;
                text-align: center;
                margin-bottom: 10px;
            }

            #twitter-hider-settings-panel input[type="range"] {
                width: 100%;
                height: 8px;
                border-radius: 4px;
                background: #38444d;
                outline: none;
                -webkit-appearance: none;
                appearance: none;
            }

            #twitter-hider-settings-panel input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #1da1f2;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(29, 161, 242, 0.5);
                transition: all 0.2s ease;
            }

            #twitter-hider-settings-panel input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.1);
            }

            #twitter-hider-settings-panel .preset-buttons {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 15px;
            }

            #twitter-hider-settings-panel .preset-btn {
                flex: 1;
                min-width: 60px;
                padding: 10px 12px;
                border: 1px solid #38444d;
                border-radius: 20px;
                background: transparent;
                color: #fff;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            #twitter-hider-settings-panel .preset-btn:hover {
                background: #1da1f2;
                border-color: #1da1f2;
            }

            #twitter-hider-settings-panel .preset-btn.active {
                background: #1da1f2;
                border-color: #1da1f2;
            }

            #twitter-hider-settings-panel .close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 30px;
                height: 30px;
                border: none;
                background: #38444d;
                border-radius: 50%;
                color: #fff;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            #twitter-hider-settings-panel .close-btn:hover {
                background: #e0245e;
            }
        `;
    }

    // 创建并插入样式元素
    let styleElement = null;
    function applyStyles(width) {
        if (styleElement) {
            styleElement.remove();
        }
        styleElement = document.createElement('style');
        styleElement.id = 'twitter-hider-styles';
        styleElement.textContent = generateCSS(width);
        (document.head || document.documentElement).appendChild(styleElement);
    }

    // 初始应用样式
    applyStyles(contentWidth);

    // 创建设置UI
    function createSettingsUI() {
        // 设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'twitter-hider-settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = '侧边栏隐藏器设置';

        // 设置面板
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'twitter-hider-settings-panel';
        settingsPanel.innerHTML = `
            <button class="close-btn">✕</button>
            <h3>⚙️ 侧边栏隐藏器</h3>
            <div class="setting-group">
                <label>内容区域宽度</label>
                <div class="width-display">${contentWidth}px</div>
                <input type="range" id="width-slider" min="${MIN_WIDTH}" max="${MAX_WIDTH}" value="${contentWidth}" step="50">
            </div>
            <div class="setting-group">
                <label>快速预设</label>
                <div class="preset-buttons">
                    <button class="preset-btn" data-width="800">窄 800px</button>
                    <button class="preset-btn" data-width="1000">中 1000px</button>
                    <button class="preset-btn" data-width="1200">宽 1200px</button>
                    <button class="preset-btn" data-width="1500">超宽 1500px</button>
                    <button class="preset-btn" data-width="${MAX_WIDTH}">全屏</button>
                </div>
            </div>
        `;

        document.body.appendChild(settingsBtn);
        document.body.appendChild(settingsPanel);

        // 切换面板显示
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('show');
        });

        // 关闭按钮
        settingsPanel.querySelector('.close-btn').addEventListener('click', () => {
            settingsPanel.classList.remove('show');
        });

        // 滑块事件
        const slider = settingsPanel.querySelector('#width-slider');
        const widthDisplay = settingsPanel.querySelector('.width-display');

        slider.addEventListener('input', (e) => {
            const newWidth = parseInt(e.target.value);
            widthDisplay.textContent = `${newWidth}px`;
            applyStyles(newWidth);
            updatePresetButtons(newWidth);
        });

        slider.addEventListener('change', (e) => {
            const newWidth = parseInt(e.target.value);
            contentWidth = newWidth;
            GM_setValue('contentWidth', newWidth);
        });

        // 预设按钮事件
        const presetBtns = settingsPanel.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const width = parseInt(btn.dataset.width);
                slider.value = width;
                widthDisplay.textContent = `${width}px`;
                contentWidth = width;
                applyStyles(width);
                GM_setValue('contentWidth', width);
                updatePresetButtons(width);
            });
        });

        // 更新预设按钮状态
        function updatePresetButtons(width) {
            presetBtns.forEach(btn => {
                const btnWidth = parseInt(btn.dataset.width);
                btn.classList.toggle('active', btnWidth === width);
            });
        }

        updatePresetButtons(contentWidth);

        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                settingsPanel.classList.remove('show');
            }
        });
    }

    // 等待DOM加载完成后创建UI
    if (document.body) {
        createSettingsUI();
    } else {
        document.addEventListener('DOMContentLoaded', createSettingsUI);
    }

    // 使用MutationObserver确保侧边栏持续被隐藏
    const observer = new MutationObserver(() => {
        const leftSidebar = document.querySelector('header[role="banner"]');
        const rightSidebar = document.querySelector('div[data-testid="sidebarColumn"]');

        if (leftSidebar) leftSidebar.style.display = 'none';
        if (rightSidebar) rightSidebar.style.display = 'none';
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // 注册油猴菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('⚙️ 打开设置', () => {
            const panel = document.getElementById('twitter-hider-settings-panel');
            if (panel) panel.classList.add('show');
        });
    }

    console.log('[Twitter Sidebar Hider] v2.0 已加载 - 当前宽度:', contentWidth + 'px');
})();
