// ==UserScript==
// @name         智学网阅卷助手 - 快捷键版
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  智学网辅助阅卷工具，支持完全自定义快捷键、悬浮窗控制和快速回评功能
// @author       YourName
// @match        *://*.zhixue.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license       Elegy挽歌
// @downloadURL https://update.greasyfork.org/scripts/548652/%E6%99%BA%E5%AD%A6%E7%BD%91%E9%98%85%E5%8D%B7%E5%8A%A9%E6%89%8B%20-%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/548652/%E6%99%BA%E5%AD%A6%E7%BD%91%E9%98%85%E5%8D%B7%E5%8A%A9%E6%89%8B%20-%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 焦点控制标志
    let isFocusLocked = false;

    // 默认配置
    const defaultConfig = {
        scoreShortcuts: {
            '1': 0,   // 数字键1对应0分
            '2': 1,   // 数字键2对应1分
            '3': 2,   // 数字键3对应2分
            '4': 3,   // 数字键4对应3分
            '5': 4,   // 数字键5对应4分
            '6': 5,   // 数字键6对应5分
            '0': 0,   // 0键对应0分
            'q': 1,   // Q键对应1分
            'w': 2,   // W键对应2分
            'e': 3,   // E键对应3分
            'r': 4,   // R键对应4分
            't': 5,   // T键对应5分
        },
        prevShortcut: 'Backspace', // 回评上一份试卷的快捷键
        autoCheck: true,           // 是否自动勾选
        theme: 'dark',             // 默认主题
        focusLock: true            // 焦点锁定
    };

    // 加载用户配置
    let config = Object.assign({}, defaultConfig, GM_getValue('config', {}));

    // 添加全局样式
    GM_addStyle(`
        #assistant-container {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background: ${config.theme === 'dark' ? '#2d3748' : '#ffffff'};
            color: ${config.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 99999;
            overflow: hidden;
            transition: all 0.3s ease;
            font-family: 'Segoe UI', system-ui, sans-serif;
            border: 1px solid ${config.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
        }

        #assistant-header {
            background: ${config.theme === 'dark' ? '#1a202c' : '#f7fafc'};
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-bottom: 1px solid ${config.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
        }

        #assistant-title {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #assistant-title svg {
            width: 20px;
            height: 20px;
            fill: ${config.theme === 'dark' ? '#63b3ed' : '#4299e1'};
        }

        #assistant-controls {
            display: flex;
            gap: 10px;
        }

        .assistant-btn {
            background: none;
            border: none;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: ${config.theme === 'dark' ? '#cbd5e0' : '#718096'};
            transition: all 0.2s;
        }

        .assistant-btn:hover {
            background: ${config.theme === 'dark' ? '#4a5568' : '#edf2f7'};
            color: ${config.theme === 'dark' ? '#ffffff' : '#2d3748'};
        }

        #assistant-content {
            padding: 15px;
            max-height: 500px;
            overflow-y: auto;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .section-title svg {
            width: 16px;
            height: 16px;
            fill: ${config.theme === 'dark' ? '#63b3ed' : '#4299e1'};
        }

        .shortcut-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }

        .shortcut-item {
            background: ${config.theme === 'dark' ? '#4a5568' : '#edf2f7'};
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.2s;
            position: relative;
        }

        .shortcut-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .shortcut-key {
            width: 36px;
            height: 36px;
            background: ${config.theme === 'dark' ? '#63b3ed' : '#4299e1'};
            color: white;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 8px;
        }

        .shortcut-value {
            font-size: 14px;
        }

        .shortcut-delete {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 20px;
            height: 20px;
            background: #e53e3e;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .shortcut-item:hover .shortcut-delete {
            opacity: 1;
        }

        .divider {
            height: 1px;
            background: ${config.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
            margin: 15px 0;
        }

        .action-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: ${config.theme === 'dark' ? '#4a5568' : '#edf2f7'};
            border-radius: 8px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .action-item:hover {
            background: ${config.theme === 'dark' ? '#5a6578' : '#e2e8f0'};
        }

        .action-label {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .action-key {
            background: ${config.theme === 'dark' ? '#2d3748' : '#cbd5e0'};
            color: ${config.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #4299e1;
        }

        input:checked + .slider:before {
            transform: translateX(18px);
        }

        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: 8px;
            background-color: #48bb78;
        }

        .status-indicator.inactive {
            background-color: #e53e3e;
        }

        .theme-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
        }

        .theme-label {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .focus-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e53e3e;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100000;
            animation: fadeInOut 2.5s forwards;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; bottom: 10px; }
            10% { opacity: 1; bottom: 20px; }
            90% { opacity: 1; bottom: 20px; }
            100% { opacity: 0; bottom: 30px; }
        }

        .custom-shortcut-form {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }

        .key-input {
            flex: 1;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid ${config.theme === 'dark' ? '#4a5568' : '#cbd5e0'};
            background: ${config.theme === 'dark' ? '#1a202c' : '#f7fafc'};
            color: ${config.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
            outline: none;
        }

        .score-input {
            width: 60px;
            padding: 8px 12px;
            border-radius: 8px;
            border: 1px solid ${config.theme === 'dark' ? '#4a5568' : '#cbd5e0'};
            background: ${config.theme === 'dark' ? '#1a202c' : '#f7fafc'};
            color: ${config.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
            outline: none;
        }

        .add-btn {
            padding: 8px 15px;
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .add-btn:hover {
            background: #3182ce;
        }

        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 99998;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .key-modal {
            background: ${config.theme === 'dark' ? '#2d3748' : '#ffffff'};
            border-radius: 12px;
            padding: 20px;
            width: 300px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .modal-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            text-align: center;
        }

        .key-input-large {
            width: 100%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid ${config.theme === 'dark' ? '#4a5568' : '#cbd5e0'};
            background: ${config.theme === 'dark' ? '#1a202c' : '#f7fafc'};
            color: ${config.theme === 'dark' ? '#e2e8f0' : '#2d3748'};
            outline: none;
            font-size: 16px;
            text-align: center;
            margin-bottom: 15px;
        }

        .modal-buttons {
            display: flex;
            gap: 10px;
        }

        .modal-btn {
            flex: 1;
            padding: 10px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 500;
        }

        .confirm-btn {
            background: #4299e1;
            color: white;
        }

        .cancel-btn {
            background: ${config.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
            color: ${config.theme === 'dark' ? '#e2e8f0' : '#4a5568'};
        }

        .shortcut-help {
            font-size: 12px;
            color: ${config.theme === 'dark' ? '#a0aec0' : '#718096'};
            margin-top: 5px;
            text-align: center;
        }
    `);

    // 创建悬浮窗容器
    const container = document.createElement('div');
    container.id = 'assistant-container';
    container.innerHTML = `
        <div id="assistant-header">
            <div id="assistant-title">
                <svg viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                    <path d="M7 10h10v2H7zm0 4h5v2H7z"/>
                </svg>
                智学网阅卷助手By.挽歌
                <span class="status-indicator"></span>
            </div>
            <div id="assistant-controls">
                <button class="assistant-btn" id="minimize-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M19 13H5v-2h14v2z"/>
                    </svg>
                </button>
                <button class="assistant-btn" id="close-btn">
                    <svg viewBox="0 0 24 24" width="16" height="16">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div id="assistant-content">
            <div class="section">
                <div class="section-title">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
                    </svg>
                    评分快捷键配置
                </div>
                <div class="shortcut-grid" id="shortcut-grid"></div>

                <div class="custom-shortcut-form">
                    <input type="text" class="key-input" id="new-key" placeholder="输入按键" readonly>
                    <input type="number" class="score-input" id="new-score" min="0" max="100" placeholder="分数">
                    <button class="add-btn" id="add-shortcut-btn">添加</button>
                </div>
                <div class="shortcut-help">点击输入框后按任意键设置按键</div>
            </div>

            <div class="divider"></div>

            <div class="section">
                <div class="section-title">
                    <svg viewBox="0 0 24 24">
                        <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                    </svg>
                    功能快捷键
                </div>
                <div class="action-item" id="prev-paper-action">
                    <div class="action-label">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path d="M14 7l-5 5 5 5V7z"/>
                        </svg>
                        回评上一份试卷
                    </div>
                    <div class="action-key" id="prev-key">${config.prevShortcut}</div>
                </div>

                <div class="action-item" id="set-prev-key">
                    <div class="action-label">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                        </svg>
                        设置回评快捷键
                    </div>
                    <div class="action-key">点击设置</div>
                </div>
            </div>

            <div class="divider"></div>

            <div class="section">
                <div class="section-title">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    </svg>
                    焦点与显示设置
                </div>
                <div class="action-item">
                    <div class="action-label">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        焦点锁定功能
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="focus-lock-toggle" ${config.focusLock ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="action-item">
                    <div class="action-label">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                        自动勾选阅卷辅助
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="auto-check-toggle" ${config.autoCheck ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>

                <div class="theme-toggle">
                    <div class="theme-label">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
                        </svg>
                        界面主题
                    </div>
                    <div>
                        <button class="theme-btn ${config.theme === 'light' ? 'active' : ''}" data-theme="light">浅色</button>
                        <button class="theme-btn ${config.theme === 'dark' ? 'active' : ''}" data-theme="dark">深色</button>
                    </div>
                </div>
            </div>

            <div class="divider"></div>

            <div class="section">
                <div class="section-title">
                    <svg viewBox="0 0 24 24">
                        <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                    </svg>
                    使用说明
                </div>
                <div style="font-size:13px; line-height:1.5; color: ${config.theme === 'dark' ? '#a0aec0' : '#718096'}">
                    <p>1. 使用自定义快捷键快速打分</p>
                    <p>2. 按<span class="action-key">${config.prevShortcut}</span>回评上一份试卷</p>
                    <p>3. 打分后自动进入下一份试卷</p>
                    <p>4. 拖动顶部栏可移动悬浮窗</p>
                    <p>5. 启用"焦点锁定"防止输入框抢占焦点</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    // 渲染快捷键网格
    function renderShortcuts() {
        const shortcutGrid = container.querySelector('#shortcut-grid');
        shortcutGrid.innerHTML = '';

        for (let key in config.scoreShortcuts) {
            const score = config.scoreShortcuts[key];
            const shortcutItem = document.createElement('div');
            shortcutItem.className = 'shortcut-item';
            shortcutItem.innerHTML = `
                <div class="shortcut-key">${key}</div>
                <div class="shortcut-value">${score} 分</div>
                <div class="shortcut-delete" data-key="${key}">×</div>
            `;
            shortcutGrid.appendChild(shortcutItem);

            // 添加删除事件
            shortcutItem.querySelector('.shortcut-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                delete config.scoreShortcuts[e.target.dataset.key];
                saveConfig();
                renderShortcuts();
                showNotification(`已删除快捷键: ${e.target.dataset.key}`);
            });
        }
    }

    // 初始渲染快捷键
    renderShortcuts();

    // 添加主题按钮样式
    GM_addStyle(`
        .theme-btn {
            padding: 5px 12px;
            border: none;
            border-radius: 6px;
            background: ${config.theme === 'dark' ? '#4a5568' : '#e2e8f0'};
            color: ${config.theme === 'dark' ? '#e2e8f0' : '#4a5568'};
            cursor: pointer;
            font-size: 13px;
            margin-left: 8px;
            transition: all 0.2s;
        }

        .theme-btn.active {
            background: ${config.theme === 'dark' ? '#63b3ed' : '#4299e1'};
            color: white;
        }

        .theme-btn:hover {
            opacity: 0.9;
        }
    `);

    // 拖拽功能
    let isDragging = false;
    let offsetX, offsetY;
    const header = container.querySelector('#assistant-header');

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
        container.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 边界检查
            const maxX = window.innerWidth - container.offsetWidth;
            const maxY = window.innerHeight - container.offsetHeight;

            container.style.left = Math.min(Math.max(x, 10), maxX - 10) + 'px';
            container.style.top = Math.min(Math.max(y, 10), maxY - 10) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'default';
    });

    // 折叠功能
    let isMinimized = false;
    const minimizeBtn = container.querySelector('#minimize-btn');
    const content = container.querySelector('#assistant-content');

    minimizeBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        if (isMinimized) {
            content.style.display = 'none';
            minimizeBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
                </svg>
            `;
            container.style.height = 'auto';
        } else {
            content.style.display = 'block';
            minimizeBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                </svg>
            `;
        }
    });

    // 关闭按钮
    const closeBtn = container.querySelector('#close-btn');
    closeBtn.addEventListener('click', () => {
        container.style.display = 'none';
    });

    // 自动勾选功能
    const autoCheckToggle = container.querySelector('#auto-check-toggle');
    autoCheckToggle.addEventListener('change', () => {
        config.autoCheck = autoCheckToggle.checked;
        saveConfig();
        if (config.autoCheck) {
            checkElement();
        }
    });

    // 焦点锁定功能
    const focusLockToggle = container.querySelector('#focus-lock-toggle');
    focusLockToggle.addEventListener('change', () => {
        config.focusLock = focusLockToggle.checked;
        saveConfig();

        if (config.focusLock) {
            showNotification('焦点锁定已启用');
            lockFocus();
        } else {
            showNotification('焦点锁定已禁用');
        }
    });

    // 主题切换
    const themeButtons = container.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            config.theme = theme;
            saveConfig();
            location.reload(); // 重新加载以应用新主题
        });
    });

    // 保存配置
    function saveConfig() {
        GM_setValue('config', config);
    }

    // 自动勾选目标元素
    function checkElement() {
        const checkInterval = setInterval(() => {
            const targetElement = document.evaluate(
                '//*[@id="CalcPlattitle"]/span[2]/a',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (targetElement) {
                targetElement.click();
                clearInterval(checkInterval);
            }
        }, 500);
    }

    // 显示通知
    function showNotification(message) {
        const existingNote = document.querySelector('.focus-notification');
        if (existingNote) existingNote.remove();

        const notification = document.createElement('div');
        notification.className = 'focus-notification';
        notification.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            ${message}
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 2500);
    }

    // 焦点锁定功能
    function lockFocus() {
        // 监听焦点变化
        document.addEventListener('focusin', (e) => {
            if (!config.focusLock) return;

            const input = document.getElementById('txt_marking_2');
            if (input && e.target === input) {
                // 如果焦点被转移到输入框，立即移回body
                e.preventDefault();
                document.body.focus();
                showNotification('焦点已锁定到页面');
            }
        });

        // 初始设置焦点
        document.body.focus();
    }

    // 添加快捷键功能
    const newKeyInput = container.querySelector('#new-key');
    const newScoreInput = container.querySelector('#new-score');
    const addShortcutBtn = container.querySelector('#add-shortcut-btn');

    // 按键捕获功能
    newKeyInput.addEventListener('focus', () => {
        newKeyInput.value = '按下按键...';
        isFocusLocked = false; // 临时禁用焦点锁定
    });

    newKeyInput.addEventListener('keydown', (e) => {
        e.preventDefault();

        // 忽略功能键
        if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
            return;
        }

        const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
        newKeyInput.value = key;
        newScoreInput.focus();
        isFocusLocked = config.focusLock; // 恢复焦点锁定状态
    });

    // 添加新快捷键
    addShortcutBtn.addEventListener('click', () => {
        const key = newKeyInput.value;
        const score = parseInt(newScoreInput.value);

        if (!key || key === '按下按键...') {
            showNotification('请先设置按键');
            return;
        }

        if (isNaN(score) || score < 0 || score > 100) {
            showNotification('请输入0-100之间的分数');
            return;
        }

        // 添加或更新快捷键
        config.scoreShortcuts[key] = score;
        saveConfig();
        renderShortcuts();
        showNotification(`已添加快捷键: ${key} → ${score}分`);

        // 清空表单
        newKeyInput.value = '';
        newScoreInput.value = '';
    });

    // 设置回评快捷键
    const setPrevKeyBtn = container.querySelector('#set-prev-key');
    let keyModal = null;

    setPrevKeyBtn.addEventListener('click', () => {
        // 创建模态框
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';

        backdrop.innerHTML = `
            <div class="key-modal">
                <div class="modal-title">设置回评快捷键</div>
                <input type="text" class="key-input-large" id="modal-key-input" placeholder="按下按键..." readonly>
                <div class="shortcut-help">按下您想设置的快捷键</div>
                <div class="modal-buttons">
                    <button class="modal-btn cancel-btn" id="cancel-btn">取消</button>
                    <button class="modal-btn confirm-btn" id="confirm-btn">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(backdrop);
        keyModal = backdrop;

        const keyInput = backdrop.querySelector('#modal-key-input');
        keyInput.focus();

        // 按键捕获
        keyInput.addEventListener('keydown', (e) => {
            e.preventDefault();

            // 忽略功能键
            if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
                return;
            }

            const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
            keyInput.value = key;
        });

        // 确认按钮
        backdrop.querySelector('#confirm-btn').addEventListener('click', () => {
            const key = keyInput.value;

            if (!key || key === '按下按键...') {
                showNotification('请先设置按键');
                return;
            }

            config.prevShortcut = key;
            saveConfig();
            container.querySelector('#prev-key').textContent = key;
            showNotification(`回评快捷键已设置为: ${key}`);
            backdrop.remove();
        });

        // 取消按钮
        backdrop.querySelector('#cancel-btn').addEventListener('click', () => {
            backdrop.remove();
        });
    });

    // 初始化功能
    if (config.autoCheck) {
        setTimeout(checkElement, 1000);
    }

    if (config.focusLock) {
        lockFocus();
    }

    // 快捷键功能
    document.addEventListener('keydown', function(e) {
        // 忽略在输入框中的按键（如果焦点锁定已禁用）
        if (!config.focusLock && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
            return;
        }

        const key = e.key;

        // 检查是否为评分快捷键
        if (config.scoreShortcuts.hasOwnProperty(key)) {
            const score = config.scoreShortcuts[key];
            const scoreElement = document.evaluate(
                `//*[@id="platContent"]/a[${score + 1}]`,
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (scoreElement) {
                scoreElement.click();

                // 保持焦点在页面上
                setTimeout(() => {
                    document.body.focus();
                }, 100);
            }
            return;
        }

        // 检查是否为回评快捷键
        if (key === config.prevShortcut) {
            const prevElement = document.evaluate(
                '//*[@id="app"]/div/div[1]/div/div[2]/div/div[1]/div[1]/div[1]/div[3]/span[9]/a',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (prevElement) {
                prevElement.click();

                // 保持焦点在页面上
                setTimeout(() => {
                    document.body.focus();
                }, 100);
            }
        }
    });

    // 状态指示器
    const statusIndicator = container.querySelector('.status-indicator');
    setInterval(() => {
        statusIndicator.classList.toggle('inactive');
        setTimeout(() => {
            statusIndicator.classList.toggle('inactive');
        }, 500);
    }, 2000);

    // 回评按钮点击事件
    const prevPaperAction = container.querySelector('#prev-paper-action');
    prevPaperAction.addEventListener('click', () => {
        const prevElement = document.evaluate(
            '//*[@id="app"]/div/div[1]/div/div[2]/div/div[1]/div[1]/div[1]/div[3]/span[9]/a',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (prevElement) {
            prevElement.click();
        }
    });

    // 初始显示状态
    container.style.display = 'block';

    // 添加菜单命令
    GM_registerMenuCommand("显示/隐藏悬浮窗", function() {
        if (container.style.display === 'none') {
            container.style.display = 'block';
            showNotification('悬浮窗已显示');
        } else {
            container.style.display = 'none';
            showNotification('悬浮窗已隐藏');
        }
    });

    GM_registerMenuCommand("重新加载配置", function() {
        config = Object.assign({}, defaultConfig, GM_getValue('config', {}));
        location.reload();
    });

    GM_registerMenuCommand("重置为默认配置", function() {
        config = defaultConfig;
        saveConfig();
        location.reload();
    });
})();