// ==UserScript==
// @name         Mobile AI Summary (MD3)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  为移动端设计的AI页面总结工具，采用Material Design 3风格
// @author       Justin Ye
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/560365/Mobile%20AI%20Summary%20%28MD3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560365/Mobile%20AI%20Summary%20%28MD3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 封装 GM_xmlhttpRequest 为 Promise 形式，解决跨域问题
    function gmFetch(url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers,
                data: options.body,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve({
                            json: () => Promise.resolve(JSON.parse(response.responseText)),
                            text: () => Promise.resolve(response.responseText),
                            status: response.status
                        });
                    } else {
                        reject(new Error(`HTTP error! status: ${response.status} ${response.statusText || ''}\nResponse: ${response.responseText.substring(0, 100)}...`));
                    }
                },
                onerror: (error) => {
                    console.error('GM_xmlhttpRequest error:', error);
                    reject(new Error('Network error: Failed to fetch'));
                },
                ontimeout: () => {
                    reject(new Error('Request timeout'));
                }
            });
        });
    }

    // MD3 风格定义
    const md3Colors = {
        light: {
            primary: '#006492',
            onPrimary: '#ffffff',
            primaryContainer: '#cae6ff',
            onPrimaryContainer: '#001e30',
            surface: '#f8f9ff',
            onSurface: '#191c20',
            surfaceContainer: '#f0f4f8',
            outline: '#72777f',
            shadow: 'rgba(0, 0, 0, 0.2)',
            surfaceVariant: '#dde3ea',
            onSurfaceVariant: '#41484d'
        },
        dark: {
            primary: '#8ccceb',
            onPrimary: '#00344e',
            primaryContainer: '#004b6f',
            onPrimaryContainer: '#cae6ff',
            surface: '#111418',
            onSurface: '#e1e2e8',
            surfaceContainer: '#1d2024',
            outline: '#8c9199',
            shadow: 'rgba(0, 0, 0, 0.4)',
            surfaceVariant: '#41484d',
            onSurfaceVariant: '#c1c7ce'
        }
    };

    // 新的提示词
    const newPrompt = `你是一个专业的中文内容总结器。你的任务是分析提供的网页内容，**识别内容类型（例如：新闻报道、研究报告、普通文章、市场分析等）**，并在此基础上创建一个清晰、简洁、结构良好的中文总结。**总结必须严格依据原文内容，不得进行任何推测、假设或添加原文中未包含的信息。**

请严格遵守以下指南：

1.  **内容类型识别与结构确定:**
    *   首先识别原文的内容类型。
    *   根据内容类型，确定最合适的分段和总结重点。总结的结构应该逻辑清晰，反映原文的核心信息。
    *   你可以使用 **\`##\`** 作为主要分段的标题，例如：对于新闻可以使用“事件概述”、“关键进展”等，对于报告可以使用“主要发现”、“数据支持”等。不必拘泥于原文的固定分段，但要确保覆盖核心要点。

2.  **输出格式:**
    *   使用 **\`##\`** 表示主要段落标题。
    *   使用 **\`•\`** 表示段落内的关键点和细节。
    *   使用 **粗体** 突出重要术语、概念或关键信息。
    *   使用 **\`>\`** 表示引人注目的原文引述（如果适用）。

3.  **内容要求:**
    *   总结必须**严格忠于原文**，不允许加入任何个人观点、推测或假设。
    *   **识别并保留原文中的重要数据、数字、统计信息或关键事实。**
    *   根据识别的内容类型，调整总结的侧重点，但**所有信息必须来源于原文**。

4.  **写作风格:**
    *   语言清晰简洁。
    *   专业且客观的语调。
    *   逻辑流畅。
    *   易于理解。
    *   聚焦于原文的核心信息和重要细节。

5.  **重要规则:**
    *   **DO NOT show your reasoning process.** (不要显示你的思考过程或内部步骤。)`;

    // 默认配置
    const defaultConfig = {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        prompt: newPrompt,
        model: 'gpt-3.5-turbo',
        theme: 'auto' // auto, light, dark
    };

    // GM 函数兼容层
    const GM = {
        setValue: (key, value) => {
            try {
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(key, value);
                } else {
                    localStorage.setItem(`mobile_ai_summary_${key}`, JSON.stringify(value));
                }
            } catch (error) {
                console.error('保存配置失败:', error);
            }
        },
        getValue: (key, defaultValue) => {
            try {
                if (typeof GM_getValue !== 'undefined') {
                    return GM_getValue(key, defaultValue);
                }
                const value = localStorage.getItem(`mobile_ai_summary_${key}`);
                return value ? JSON.parse(value) : defaultValue;
            } catch (error) {
                console.error('获取配置失败:', error);
                return defaultValue;
            }
        }
    };

    // 获取配置
    let config = {
        apiUrl: GM.getValue('apiUrl', defaultConfig.apiUrl),
        apiKey: GM.getValue('apiKey', defaultConfig.apiKey),
        prompt: GM.getValue('prompt', defaultConfig.prompt),
        model: GM.getValue('model', defaultConfig.model),
        theme: GM.getValue('theme', defaultConfig.theme)
    };

    // 加载 marked.js
    let markedLoaded = false;
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    markedScript.onload = () => {
        markedLoaded = true;
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    };
    document.head.appendChild(markedScript);

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* Material Design 3 风格样式 */
        :root {
            --mas-primary: ${md3Colors.light.primary};
            --mas-on-primary: ${md3Colors.light.onPrimary};
            --mas-primary-container: ${md3Colors.light.primaryContainer};
            --mas-on-primary-container: ${md3Colors.light.onPrimaryContainer};
            --mas-surface: ${md3Colors.light.surface};
            --mas-on-surface: ${md3Colors.light.onSurface};
            --mas-surface-container: ${md3Colors.light.surfaceContainer};
            --mas-outline: ${md3Colors.light.outline};
            --mas-shadow: ${md3Colors.light.shadow};
            --mas-surface-variant: ${md3Colors.light.surfaceVariant};
            --mas-on-surface-variant: ${md3Colors.light.onSurfaceVariant};
        }

        [data-theme="dark"] {
            --mas-primary: ${md3Colors.dark.primary};
            --mas-on-primary: ${md3Colors.dark.onPrimary};
            --mas-primary-container: ${md3Colors.dark.primaryContainer};
            --mas-on-primary-container: ${md3Colors.dark.onPrimaryContainer};
            --mas-surface: ${md3Colors.dark.surface};
            --mas-on-surface: ${md3Colors.dark.onSurface};
            --mas-surface-container: ${md3Colors.dark.surfaceContainer};
            --mas-outline: ${md3Colors.dark.outline};
            --mas-shadow: ${md3Colors.dark.shadow};
            --mas-surface-variant: ${md3Colors.dark.surfaceVariant};
            --mas-on-surface-variant: ${md3Colors.dark.onSurfaceVariant};
        }

        /* Pixel 风格优化 */
        .mas-fab-container {
            position: fixed;
            left: 16px; /* 移到左侧 */
            bottom: 80px; /* 避开底部导航栏 */
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 16px;
            pointer-events: none; /* 允许点击穿透 */
        }

        .mas-fab {
            width: 48px; /* 缩小尺寸 */
            height: 48px;
            border-radius: 16px; /* 调整圆角以匹配新尺寸 */
            background-color: var(--mas-primary-container);
            color: var(--mas-on-primary-container);
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
            -webkit-tap-highlight-color: transparent;
        }

        .mas-fab:active {
            transform: scale(0.92);
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .mas-fab svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        /* Bottom Sheet 样式 */
        .mas-bottom-sheet {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--mas-surface-container);
            border-top-left-radius: 28px;
            border-top-right-radius: 28px;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
            z-index: 1000000;
            transform: translateY(100%);
            transition: transform 0.35s cubic-bezier(0.2, 0, 0, 1);
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            color: var(--mas-on-surface);
            font-family: 'Google Sans', system-ui, -apple-system, sans-serif; /* 尝试使用 Google Sans */
        }

        .mas-bottom-sheet.show {
            transform: translateY(0);
        }

        .mas-drag-handle {
            width: 32px;
            height: 4px;
            background-color: var(--mas-outline);
            opacity: 0.4;
            border-radius: 2px;
            margin: 16px auto 0;
            flex-shrink: 0;
        }

        .mas-sheet-content {
            padding: 24px;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        }

        .mas-sheet-header {
            font-size: 22px;
            font-weight: 400;
            margin-bottom: 24px;
            color: var(--mas-on-surface);
            font-weight: 500;
        }

        .mas-icon-btn {
            color: var(--mas-on-surface-variant);
            background: transparent;
            border: none;
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }

        .mas-icon-btn:hover {
            background-color: rgba(0, 0, 0, 0.08);
        }

        .mas-icon-btn:active {
            background-color: rgba(0, 0, 0, 0.12);
        }

        [data-theme="dark"] .mas-icon-btn:hover {
            background-color: rgba(255, 255, 255, 0.08);
        }

        [data-theme="dark"] .mas-icon-btn:active {
            background-color: rgba(255, 255, 255, 0.12);
        }

        /* 表单样式 */
        .mas-input-group {
            margin-bottom: 20px;
        }

        .mas-label {
            display: block;
            font-size: 12px;
            color: var(--mas-on-surface-variant);
            margin-bottom: 8px;
            font-weight: 500;
        }

        .mas-input, .mas-textarea, .mas-select {
            width: 100%;
            padding: 16px;
            border: 1px solid var(--mas-outline);
            border-radius: 12px; /* 更圆润的输入框 */
            background: var(--mas-surface);
            font-size: 16px;
            color: var(--mas-on-surface);
            box-sizing: border-box;
            transition: all 0.2s;
            font-family: inherit;
        }

        .mas-input:focus, .mas-textarea:focus, .mas-select:focus {
            outline: none;
            border-color: var(--mas-primary);
            background: var(--mas-surface-container);
            box-shadow: 0 0 0 2px var(--mas-primary-container);
        }

        .mas-textarea {
            min-height: 100px;
            resize: vertical;
            font-family: inherit;
        }

        /* 按钮样式 */
        .mas-btn {
            background-color: var(--mas-primary);
            color: var(--mas-on-primary);
            border: none;
            border-radius: 24px; /* 完全圆角 */
            padding: 0 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            height: 48px; /* 更高的点击区域 */
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            letter-spacing: 0.5px;
        }

        .mas-btn:active {
            opacity: 0.9;
            transform: scale(0.98);
        }

        .mas-btn-text {
            background: transparent;
            color: var(--mas-primary);
            margin-top: 8px;
        }

        /* 结果内容样式 */
        .mas-result-content {
            font-size: 16px;
            line-height: 1.6;
        }
        
        .mas-result-content h1, .mas-result-content h2, .mas-result-content h3 {
            margin-top: 1em;
            margin-bottom: 0.5em;
            color: var(--mas-on-surface);
        }

        .mas-result-content p {
            margin-bottom: 1em;
            color: var(--mas-on-surface-variant);
        }

        .mas-result-content ul {
            padding-left: 20px;
            margin-bottom: 1em;
            color: var(--mas-on-surface-variant);
        }

        .mas-result-content li {
            margin-bottom: 0.5em;
        }

        .mas-result-content strong {
            font-weight: 700;
            color: var(--mas-on-surface);
        }

        .mas-result-content blockquote {
            border-left: 4px solid var(--mas-primary);
            background-color: var(--mas-surface-variant);
            margin: 1em 0;
            padding: 12px 16px;
            border-radius: 0 12px 12px 0;
            color: var(--mas-on-surface-variant);
        }

        /* 遮罩层 */
        .mas-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.32);
            z-index: 999999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .mas-overlay.show {
            display: block;
            opacity: 1;
        }

        .mas-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
        }
    `;
    document.head.appendChild(style);

    // 创建 UI 元素
    const fabContainer = document.createElement('div');
    fabContainer.className = 'mas-fab-container';
    
    // 主 FAB (合并了总结和设置入口)
    const mainFab = document.createElement('button');
    mainFab.className = 'mas-fab';
    mainFab.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M19,3H5C3.89,3,3,3.89,3,5v14c0,1.1,0.89,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.89,20.11,3,19,3z M19,19H5V5h14V19z M7,7h10v2H7V7z M7,11h10v2H7V11z M7,15h7v2H7V15z"/>
        </svg>
    `;
    
    fabContainer.appendChild(mainFab);
    document.body.appendChild(fabContainer);

    // 遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'mas-overlay';
    document.body.appendChild(overlay);

    // 主面板 Bottom Sheet (包含首页、设置、结果)
    const mainSheet = document.createElement('div');
    mainSheet.className = 'mas-bottom-sheet';
    
    // 应用主题
    function applyTheme() {
        const theme = config.theme;
        if (theme === 'dark') {
            mainSheet.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            mainSheet.setAttribute('data-theme', 'light');
        } else {
            // Auto
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                mainSheet.setAttribute('data-theme', 'dark');
            } else {
                mainSheet.setAttribute('data-theme', 'light');
            }
        }
    }

    // 渲染主面板内容
    function renderSheetContent(view = 'home', data = null) {
        let content = '';
        applyTheme();
        
        if (view === 'home') {
            content = `
                <div class="mas-drag-handle"></div>
                <div class="mas-sheet-content">
                    <div class="mas-sheet-header">
                        <span>AI 页面总结</span>
                        <!-- Settings button removed from here -->
                    </div>
                    <div style="margin-bottom: 24px;">
                        <p style="margin-bottom: 8px; font-size: 14px; color: var(--mas-on-surface-variant);">当前页面：</p>
                        <p style="font-weight: 500; line-height: 1.4; color: var(--mas-on-surface);">${document.title}</p>
                    </div>
                    <button class="mas-btn" id="masStartSummary">
                        <svg style="width:20px;height:20px;margin-right:8px;fill:currentColor" viewBox="0 0 24 24">
                            <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                        </svg>
                        开始总结
                    </button>
                </div>
            `;
        } else if (view === 'settings') {
            content = `
                <div class="mas-drag-handle"></div>
                <div class="mas-sheet-content">
                    <div class="mas-sheet-header">
                        <span>设置</span>
                        <button class="mas-icon-btn" id="masBackHome">
                            <svg style="width:24px;height:24px;fill:currentColor" viewBox="0 0 24 24">
                                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                        </button>
                    </div>
                    <div class="mas-input-group">
                        <label class="mas-label">主题</label>
                        <select class="mas-select" id="masTheme">
                            <option value="auto" ${config.theme === 'auto' ? 'selected' : ''}>跟随系统</option>
                            <option value="light" ${config.theme === 'light' ? 'selected' : ''}>浅色模式</option>
                            <option value="dark" ${config.theme === 'dark' ? 'selected' : ''}>深色模式</option>
                        </select>
                    </div>
                    <div class="mas-input-group">
                        <label class="mas-label">API URL</label>
                        <input type="text" class="mas-input" id="masApiUrl" value="${config.apiUrl}">
                    </div>
                    <div class="mas-input-group">
                        <label class="mas-label">API Key</label>
                        <input type="password" class="mas-input" id="masApiKey" value="${config.apiKey}">
                    </div>
                    <div class="mas-input-group">
                        <label class="mas-label">模型</label>
                        <input type="text" class="mas-input" id="masModel" value="${config.model}">
                    </div>
                    <div class="mas-input-group">
                        <label class="mas-label">提示词</label>
                        <textarea class="mas-textarea" id="masPrompt">${config.prompt}</textarea>
                    </div>
                    <button class="mas-btn" id="masSaveConfig">保存并返回</button>
                </div>
            `;
        } else if (view === 'result') {
            content = `
                <div class="mas-drag-handle"></div>
                <div class="mas-sheet-content">
                    <div class="mas-sheet-header">
                        <span>总结结果</span>
                        <!-- 关闭按钮已移除 -->
                    </div>
                    <div id="masResultContent" class="mas-result-content">${data || '<p>正在生成...</p>'}</div>
                    <div class="mas-actions">
                        <button class="mas-btn" id="masCopyBtn">复制内容</button>
                    </div>
                </div>
            `;
        }
        
        mainSheet.innerHTML = content;
        bindEvents(view);
    }

    function bindEvents(view) {
        if (view === 'home') {
            // Settings button event removed
            document.getElementById('masStartSummary').addEventListener('click', startSummary);
        } else if (view === 'settings') {
            document.getElementById('masBackHome').addEventListener('click', () => {
                renderSheetContent('home');
            });
            document.getElementById('masSaveConfig').addEventListener('click', () => {
                config.apiUrl = document.getElementById('masApiUrl').value;
                config.apiKey = document.getElementById('masApiKey').value;
                config.prompt = document.getElementById('masPrompt').value;
                config.model = document.getElementById('masModel').value;
                config.theme = document.getElementById('masTheme').value;

                GM.setValue('apiUrl', config.apiUrl);
                GM.setValue('apiKey', config.apiKey);
                GM.setValue('prompt', config.prompt);
                GM.setValue('model', config.model);
                GM.setValue('theme', config.theme);
                
                applyTheme(); // 立即应用主题
                alert('配置已保存');
                renderSheetContent('home');
            });
        } else if (view === 'result') {
            // 移除关闭按钮事件绑定
            
            const copyBtn = document.getElementById('masCopyBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const text = document.getElementById('masResultContent').innerText;
                    navigator.clipboard.writeText(text).then(() => {
                        const originalText = copyBtn.innerText;
                        copyBtn.innerText = '已复制';
                        setTimeout(() => copyBtn.innerText = originalText, 2000);
                    });
                });
            }
        }
    }

    document.body.appendChild(mainSheet);

    // 交互逻辑
    function showOverlay() {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideOverlay() {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    // 点击遮罩关闭
    overlay.addEventListener('click', () => {
        mainSheet.classList.remove('show');
        hideOverlay();
        setTimeout(() => renderSheetContent('home'), 300);
    });

    // 主按钮交互：单击总结，长按设置
    let longPressTimer;
    let isLongPress = false;

    mainFab.addEventListener('touchstart', (e) => {
        isLongPress = false;
        longPressTimer = setTimeout(() => {
            isLongPress = true;
            // 触发振动反馈
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            renderSheetContent('settings');
            mainSheet.classList.add('show');
            showOverlay();
        }, 500); // 500ms 定义为长按
    });

    mainFab.addEventListener('touchend', (e) => {
        // Prevent the browser from firing a "ghost" click event after the touch ends.
        // This was causing the overlay to immediately close the panel.
        e.preventDefault();
        clearTimeout(longPressTimer);
        if (!isLongPress) {
            // 这是单击
            startSummary();
        }
    });
    
    mainFab.addEventListener('touchmove', () => {
        // 如果手指移动，取消长按计时器
        clearTimeout(longPressTimer);
    });

    // 为桌面端保留单击和右键单击行为
    mainFab.addEventListener('click', () => {
        // 在桌面端，单击直接总结
        if (!('ontouchstart' in window)) {
            startSummary();
        }
    });

    mainFab.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        // 在桌面端，右键单击打开设置
        if (!('ontouchstart' in window)) {
            renderSheetContent('settings');
            mainSheet.classList.add('show');
            showOverlay();
        }
    });

    // 开始总结逻辑
    async function startSummary() {
        if (!config.apiKey) {
            alert('请先配置 API Key');
            renderSheetContent('settings');
            mainSheet.classList.add('show');
            showOverlay();
            return;
        }

        renderSheetContent('result', '<p>正在分析页面内容...</p>');
        mainSheet.classList.add('show');
        showOverlay();
        
        const pageContent = document.body.innerText.substring(0, 5000);

        try {
            // 使用封装的 gmFetch 替代原生 fetch
            const response = await gmFetch(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: [
                        {
                            role: 'system',
                            content: config.prompt
                        },
                        {
                            role: 'user',
                            content: pageContent
                        }
                    ]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                const rawContent = data.choices[0].message.content;
                
                // 等待 marked 加载
                if (!markedLoaded) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                let htmlContent = rawContent;
                try {
                    htmlContent = marked.parse(rawContent);
                } catch (e) {
                    console.error('Markdown parse error', e);
                }
                
                // 更新结果视图内容
                const contentDiv = document.getElementById('masResultContent');
                if (contentDiv) {
                    contentDiv.innerHTML = htmlContent;
                }
            } else {
                throw new Error('API 返回数据异常');
            }
        } catch (error) {
            const contentDiv = document.getElementById('masResultContent');
            if (contentDiv) {
                contentDiv.innerHTML = `<p style="color: red;">出错啦: ${error.message}</p>`;
            }
        }
    }

    // 简单的拖拽支持 (FAB)
    let isDragging = false;
    let startY = 0;
    let startBottom = 100;

    fabContainer.addEventListener('touchstart', (e) => {
        if (e.target.closest('.mas-fab')) {
            isDragging = true;
            startY = e.touches[0].clientY;
            const style = window.getComputedStyle(fabContainer);
            startBottom = parseInt(style.bottom);
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // 防止滚动
        const deltaY = startY - e.touches[0].clientY;
        let newBottom = startBottom + deltaY;
        newBottom = Math.max(20, Math.min(newBottom, window.innerHeight - 100));
        fabContainer.style.bottom = `${newBottom}px`;
    }, { passive: false });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

})();