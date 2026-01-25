// ==UserScript==
// @name         YouTube Gemini Video Summarizer
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  使用 Google Gemini AI 快速总结 YouTube 视频内容（支持桌面版和移动版）
// @author       You
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      generativelanguage.googleapis.com
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564030/YouTube%20Gemini%20Video%20Summarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/564030/YouTube%20Gemini%20Video%20Summarizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置管理 ====================
    const CONFIG = {
        API_KEY_STORAGE: 'gemini_api_key',
        API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
    };

    // 缓存已总结的视频（videoId -> summary）
    const summaryCache = new Map();

    // 请求状态锁，防止重复请求
    let isRequesting = false;

    // 获取保存的 API Key
    function getApiKey() {
        return GM_getValue(CONFIG.API_KEY_STORAGE, '');
    }

    // 保存 API Key
    function saveApiKey(key) {
        GM_setValue(CONFIG.API_KEY_STORAGE, key);
    }

    // ==================== 样式注入 ====================
    const styles = `
        .gemini-summarizer-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            margin-left: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 18px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .gemini-summarizer-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5);
        }

        .gemini-summarizer-btn:active {
            transform: translateY(0);
        }

        .gemini-summarizer-btn svg {
            width: 18px;
            height: 18px;
        }

        .gemini-sidebar {
            position: fixed;
            top: 0;
            right: -400px;
            width: 400px;
            height: 100vh;
            background: #1a1a1a;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
            transition: right 0.3s ease;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            font-family: 'Roboto', Arial, sans-serif;
        }

        .gemini-sidebar.active {
            right: 0;
        }

        .gemini-sidebar-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .gemini-sidebar-title {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .gemini-close-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .gemini-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .gemini-sidebar-content {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            color: #e0e0e0;
            font-size: 16px;
        }

        .gemini-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 20px;
            font-size: 16px;
        }

        .gemini-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(102, 126, 234, 0.2);
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .gemini-summary {
            line-height: 1.7;
            font-size: 16px;
        }

        .gemini-summary h3 {
            color: #667eea;
            margin: 20px 0 10px 0;
            font-size: 20px;
            font-weight: 600;
        }

        .gemini-summary h3:first-child {
            margin-top: 0;
        }

        .gemini-summary p {
            margin: 10px 0;
            font-size: 16px;
        }

        .gemini-summary ul {
            padding-left: 20px;
            margin: 10px 0;
        }

        .gemini-summary li {
            margin: 8px 0;
            font-size: 16px;
        }

        .gemini-actions {
            padding: 15px 20px;
            border-top: 1px solid #333;
            display: flex;
            gap: 10px;
        }

        .gemini-action-btn {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .gemini-copy-btn {
            background: #667eea;
            color: white;
        }

        .gemini-copy-btn:hover {
            background: #5568d3;
        }

        .gemini-settings-btn {
            background: #333;
            color: white;
        }

        .gemini-settings-btn:hover {
            background: #444;
        }

        .gemini-error {
            padding: 15px;
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            border-radius: 8px;
            color: #ff6b6b;
        }

        .gemini-settings {
            padding: 20px;
        }

        .gemini-settings label {
            display: block;
            margin-bottom: 8px;
            color: #e0e0e0;
            font-size: 14px;
        }

        .gemini-settings input {
            width: 100%;
            padding: 10px;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            margin-bottom: 15px;
        }

        .gemini-settings input:focus {
            outline: none;
            border-color: #667eea;
        }

        .gemini-settings-save {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }

        .gemini-settings-save:hover {
            background: #5568d3;
        }

        .gemini-settings-info {
            margin-top: 15px;
            padding: 12px;
            background: rgba(102, 126, 234, 0.1);
            border: 1px solid rgba(102, 126, 234, 0.3);
            border-radius: 6px;
            font-size: 12px;
            color: #b0b0b0;
        }

        .gemini-settings-info a {
            color: #667eea;
            text-decoration: none;
        }

        .gemini-settings-info a:hover {
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            .gemini-sidebar {
                width: 100%;
                right: -100%;
            }
        }
    `;

    // 注入样式
    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // ==================== UI 组件 ====================

    // 创建总结按钮
    function createSummarizeButton() {
        const button = document.createElement('button');
        button.className = 'gemini-summarizer-btn';

        // 创建 SVG 图标
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M13 2L3 14h8v8l10-12h-8z');

        svg.appendChild(path);

        // 创建文本
        const span = document.createElement('span');
        span.textContent = 'AI总结';

        button.appendChild(svg);
        button.appendChild(span);

        return button;
    }

    // 创建侧边栏
    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'gemini-sidebar';

        // 创建 header
        const header = document.createElement('div');
        header.className = 'gemini-sidebar-header';

        const title = document.createElement('div');
        title.className = 'gemini-sidebar-title';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        svg.style.width = '24px';
        svg.style.height = '24px';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M13 2L3 14h8v8l10-12h-8z');
        svg.appendChild(path);

        title.appendChild(svg);
        title.appendChild(document.createTextNode('Gemini 视频总结'));

        const closeBtn = document.createElement('button');
        closeBtn.className = 'gemini-close-btn';
        closeBtn.textContent = '✕';

        header.appendChild(title);
        header.appendChild(closeBtn);

        // 创建 content
        const content = document.createElement('div');
        content.className = 'gemini-sidebar-content';

        const loading = document.createElement('div');
        loading.className = 'gemini-loading';

        const spinner = document.createElement('div');
        spinner.className = 'gemini-spinner';

        const loadingText = document.createElement('div');
        loadingText.textContent = '正在分析视频...';

        loading.appendChild(spinner);
        loading.appendChild(loadingText);
        content.appendChild(loading);

        // 创建 actions
        const actions = document.createElement('div');
        actions.className = 'gemini-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'gemini-action-btn gemini-copy-btn';
        copyBtn.textContent = '复制总结';

        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'gemini-action-btn gemini-settings-btn';
        settingsBtn.textContent = '设置';

        actions.appendChild(copyBtn);
        actions.appendChild(settingsBtn);

        sidebar.appendChild(header);
        sidebar.appendChild(content);
        sidebar.appendChild(actions);

        document.body.appendChild(sidebar);
        return sidebar;
    }

    // ==================== 核心功能 ====================

    // 获取当前视频信息
    function getVideoInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        let videoId = urlParams.get('v');

        // 尝试从 URL 路径获取 (兼容 shorts 或其他格式)
        if (!videoId) {
            const match = window.location.pathname.match(/\/watch\/([a-zA-Z0-9_-]+)/) ||
                window.location.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
            if (match) {
                videoId = match[1];
            }
        }

        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // 标题获取尝试多种选择器
        let videoTitle = document.title;
        const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string') || // Desktop
            document.querySelector('.slim-video-metadata-title'); // Mobile

        if (titleEl) {
            videoTitle = titleEl.textContent;
        }

        return { videoId, videoUrl, videoTitle };
    }

    // 调用 Gemini API
    function callGeminiAPI(videoUrl, apiKey) {
        return new Promise((resolve, reject) => {
            const prompt = `请用中文总结这个视频的内容`;

            const requestData = {
                contents: [{
                    parts: [{
                        fileData: {
                            fileUri: videoUrl
                        },
                    }, {
                        text: prompt
                    }]
                }]
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.API_ENDPOINT}?key=${apiKey}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestData),
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                            resolve(data.candidates[0].content.parts[0].text);
                        } else if (data.error) {
                            reject(new Error(data.error.message || '生成失败'));
                        } else {
                            reject(new Error('无法解析响应'));
                        }
                    } catch (e) {
                        reject(new Error('响应解析失败: ' + e.message));
                    }
                },
                onerror: function () {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    // 显示设置界面
    function showSettings(contentDiv) {
        const currentKey = getApiKey();

        // 清空内容
        contentDiv.textContent = '';

        const settings = document.createElement('div');
        settings.className = 'gemini-settings';

        const label = document.createElement('label');
        label.setAttribute('for', 'gemini-api-key');
        label.textContent = 'Gemini API Key';

        const input = document.createElement('input');
        input.type = 'password';
        input.id = 'gemini-api-key';
        input.placeholder = '输入您的 API Key';
        input.value = currentKey;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'gemini-settings-save';
        saveBtn.textContent = '保存设置';

        const info = document.createElement('div');
        info.className = 'gemini-settings-info';
        info.textContent = '💡 ';

        const strong = document.createElement('strong');
        strong.textContent = '如何获取 API Key：';
        info.appendChild(strong);
        info.appendChild(document.createElement('br'));
        info.appendChild(document.createTextNode('1. 访问 '));

        const link = document.createElement('a');
        link.href = 'https://aistudio.google.com/apikey';
        link.target = '_blank';
        link.textContent = 'Google AI Studio';
        info.appendChild(link);
        info.appendChild(document.createElement('br'));
        info.appendChild(document.createTextNode('2. 点击 "Create API Key" 创建密钥'));
        info.appendChild(document.createElement('br'));
        info.appendChild(document.createTextNode('3. 复制密钥并粘贴到上方输入框'));
        info.appendChild(document.createElement('br'));
        info.appendChild(document.createElement('br'));
        info.appendChild(document.createTextNode('免费额度：每分钟 15 次请求，每天 1500 次请求'));

        settings.appendChild(label);
        settings.appendChild(input);
        settings.appendChild(saveBtn);
        settings.appendChild(info);

        contentDiv.appendChild(settings);

        saveBtn.addEventListener('click', () => {
            const key = input.value.trim();
            if (key) {
                saveApiKey(key);
                alert('API Key 已保存！');
            } else {
                alert('请输入有效的 API Key');
            }
        });
    }

    // 显示总结结果
    function showSummary(contentDiv, summary) {
        contentDiv.textContent = '';

        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'gemini-summary';

        // 简单的 Markdown 解析
        const lines = summary.split('\n');
        let currentList = null;

        lines.forEach(line => {
            if (line.startsWith('### ')) {
                const h3 = document.createElement('h3');
                h3.textContent = line.substring(4);
                summaryDiv.appendChild(h3);
                currentList = null;
            } else if (line.startsWith('- ')) {
                if (!currentList) {
                    currentList = document.createElement('ul');
                    summaryDiv.appendChild(currentList);
                }
                const li = document.createElement('li');
                li.textContent = line.substring(2);
                currentList.appendChild(li);
            } else if (line.trim()) {
                const p = document.createElement('p');
                // 处理加粗文本 **text**
                const parts = line.split(/\*\*(.+?)\*\*/);
                parts.forEach((part, i) => {
                    if (i % 2 === 1) {
                        const strong = document.createElement('strong');
                        strong.textContent = part;
                        p.appendChild(strong);
                    } else if (part) {
                        p.appendChild(document.createTextNode(part));
                    }
                });
                summaryDiv.appendChild(p);
                currentList = null;
            }
        });

        contentDiv.appendChild(summaryDiv);
    }

    // 显示错误信息
    function showError(contentDiv, error) {
        contentDiv.textContent = '';

        const errorDiv = document.createElement('div');
        errorDiv.className = 'gemini-error';

        const strong = document.createElement('strong');
        strong.textContent = '⚠️ 出错了';
        errorDiv.appendChild(strong);
        errorDiv.appendChild(document.createElement('br'));
        errorDiv.appendChild(document.createTextNode(error.message));
        errorDiv.appendChild(document.createElement('br'));
        errorDiv.appendChild(document.createElement('br'));

        if (error.message.includes('API')) {
            errorDiv.appendChild(document.createTextNode('请检查您的 API Key 是否正确，或点击下方"设置"按钮重新配置。'));
        }

        contentDiv.appendChild(errorDiv);
    }

    // 显示加载状态
    function showLoading(contentDiv) {
        contentDiv.textContent = '';

        const loading = document.createElement('div');
        loading.className = 'gemini-loading';

        const spinner = document.createElement('div');
        spinner.className = 'gemini-spinner';

        const text = document.createElement('div');
        text.textContent = '正在分析视频...';

        loading.appendChild(spinner);
        loading.appendChild(text);
        contentDiv.appendChild(loading);
    }

    // 主处理函数
    async function handleSummarize(sidebar) {
        const contentDiv = sidebar.querySelector('.gemini-sidebar-content');
        const apiKey = getApiKey();

        // 检查 API Key
        if (!apiKey) {
            showSettings(contentDiv);
            return;
        }

        // 获取视频信息
        const { videoId, videoUrl, videoTitle } = getVideoInfo();

        if (!videoId) {
            showError(contentDiv, new Error('无法获取视频 ID'));
            return;
        }

        // 检查缓存
        if (summaryCache.has(videoId)) {
            console.log('[Gemini Summarizer] Using cached summary for video:', videoId);
            const cachedSummary = summaryCache.get(videoId);
            showSummary(contentDiv, cachedSummary);
            sidebar.dataset.currentSummary = cachedSummary;
            return;
        }

        // 检查是否正在请求中
        if (isRequesting) {
            console.log('[Gemini Summarizer] Request already in progress, ignoring...');
            return;
        }

        // 显示加载状态
        showLoading(contentDiv);
        isRequesting = true;

        try {
            // 调用 API
            const summary = await callGeminiAPI(videoUrl, apiKey);
            showSummary(contentDiv, summary);

            // 存储当前总结用于复制
            sidebar.dataset.currentSummary = summary;

            // 缓存总结结果
            summaryCache.set(videoId, summary);
            console.log('[Gemini Summarizer] Summary cached for video:', videoId);
        } catch (error) {
            showError(contentDiv, error);
        } finally {
            // 释放请求锁
            isRequesting = false;
        }
    }

    // ==================== 初始化 ====================

    // ==================== 初始化 ====================

    function tryInjectButton() {
        // 如果按钮已存在，跳过
        if (document.querySelector('.gemini-summarizer-btn')) {
            return;
        }

        const { videoId } = getVideoInfo();
        if (!videoId) {
            // 不是视频页面
            return;
        }

        // 定义可能的注入目标 (Desktop, Mobile, etc.)
        const targets = [
            // Desktop: 视频下方的操作栏
            'ytd-watch-metadata ytd-menu-renderer #top-level-buttons-computed',
            // Mobile: 视频下方的操作栏
            '.slim-video-metadata-actions',
            'ytm-slim-video-metadata-section-renderer .slim-video-metadata-actions',
            // Fallback for some desktop layouts
            '#top-level-buttons-computed'
        ];

        let target = null;
        for (const selector of targets) {
            const el = document.querySelector(selector);
            if (el) {
                target = el;
                break;
            }
        }

        if (target) {
            console.log('[Gemini Summarizer] Target found:', target);

            // 创建并插入总结按钮
            const summarizeBtn = createSummarizeButton();

            // Mobile styling adjustments if needed
            if (window.location.hostname === 'm.youtube.com') {
                summarizeBtn.style.padding = '6px 12px';
                summarizeBtn.style.fontSize = '12px';
            }

            // 插入到开头或末尾，视情况而定
            // YouTube mobile actions often use flex, appending works fine
            target.appendChild(summarizeBtn);

            // 确保侧边栏已创建
            let sidebar = document.querySelector('.gemini-sidebar');
            if (!sidebar) {
                sidebar = createSidebar();
                // 绑定关闭按钮
                sidebar.querySelector('.gemini-close-btn').addEventListener('click', () => {
                    sidebar.classList.remove('active');
                });

                // 绑定复制按钮
                sidebar.querySelector('.gemini-copy-btn').addEventListener('click', () => {
                    const summary = sidebar.dataset.currentSummary;
                    if (summary) {
                        navigator.clipboard.writeText(summary).then(() => {
                            const btn = sidebar.querySelector('.gemini-copy-btn');
                            const originalText = btn.textContent;
                            btn.textContent = '✓ 已复制';
                            setTimeout(() => {
                                btn.textContent = originalText;
                            }, 2000);
                        });
                    }
                });

                // 绑定设置按钮
                sidebar.querySelector('.gemini-settings-btn').addEventListener('click', () => {
                    const contentDiv = sidebar.querySelector('.gemini-sidebar-content');
                    showSettings(contentDiv);
                });

                // 点击侧边栏外部关闭
                const handleOutsideClick = (e) => {
                    if (sidebar.classList.contains('active') &&
                        !sidebar.contains(e.target) &&
                        !summarizeBtn.contains(e.target) &&
                        !e.target.closest('.gemini-summarizer-btn')) { // Increased robustness
                        sidebar.classList.remove('active');
                    }
                };
                document.addEventListener('click', handleOutsideClick, true);
            }

            // 绑定按钮点击事件
            summarizeBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent navigation on mobile
                sidebar.classList.add('active');
                handleSummarize(sidebar);
            });

            console.log('[Gemini Summarizer] Button injected successfully.');
        }
    }

    function init() {
        console.log('[Gemini Summarizer] Initializing...');

        // 注入样式
        injectStyles();

        // 尝试首次注入
        tryInjectButton();

        // 持续监听 DOM 变化 (spa navigation & dynamic loading)
        // 使用 debounce 避免频繁触发
        let timeout = null;
        const observer = new MutationObserver((mutations) => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                tryInjectButton();
            }, 500); // 500ms debounce
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 监听 SPA 导航事件 (Desktop)
        window.addEventListener('yt-navigate-finish', () => {
            console.log('[Gemini Summarizer] Navigation finished');
            setTimeout(tryInjectButton, 1000);
        });

        // 针对老式 PJAX 或其他变体
        window.addEventListener('spfdone', () => {
            setTimeout(tryInjectButton, 1000);
        });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
