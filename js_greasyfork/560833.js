// ==UserScript==
// @name         Safari AI Summary Pro
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Safari 专用 AI 页面总结工具，采用毛玻璃UI，支持暗黑模式，优化运行效率
// @author       Justin Ye
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @connect      api.openai.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/560833/Safari%20AI%20Summary%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/560833/Safari%20AI%20Summary%20Pro.meta.js
// ==/UserScript==

(function() {
'use strict';

// 兼容性处理：获取正确的 window 对象
let targetWindow = window;
try {
    if (typeof unsafeWindow !== 'undefined') targetWindow = unsafeWindow;
    else if (window.unsafeWindow) targetWindow = window.unsafeWindow;
} catch (e) {
    console.warn('unsafeWindow access failed, falling back to window', e);
}

// --- 核心工具函数 ---

    // 封装 GM_xmlhttpRequest 为 Promise，解决跨域问题
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
                        reject(new Error(`HTTP error! status: ${response.status} ${response.statusText || ''}`));
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

    // 配置管理
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

    const defaultConfig = {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        model: 'gpt-3.5-turbo',
        prompt: newPrompt,
        theme: 'auto', // auto, light, dark
        shortcut: 'Alt+A'
    };

    const GM = {
        setValue: (key, value) => {
            if (typeof GM_setValue !== 'undefined') GM_setValue(key, value);
            else localStorage.setItem(`safari_pro_${key}`, JSON.stringify(value));
        },
        getValue: (key, defaultValue) => {
            if (typeof GM_getValue !== 'undefined') return GM_getValue(key, defaultValue);
            const value = localStorage.getItem(`safari_pro_${key}`);
            return value ? JSON.parse(value) : defaultValue;
        }
    };

    let config = {
        apiUrl: GM.getValue('apiUrl', defaultConfig.apiUrl),
        apiKey: GM.getValue('apiKey', defaultConfig.apiKey),
        model: GM.getValue('model', defaultConfig.model),
        prompt: GM.getValue('prompt', defaultConfig.prompt),
        theme: GM.getValue('theme', defaultConfig.theme),
        shortcut: GM.getValue('shortcut', defaultConfig.shortcut)
    };

    // Lazy Load Marked.js
    let markedLoaded = false;
    const loadMarked = () => {
        // Check if already loaded in page
        if (typeof targetWindow.marked !== 'undefined') {
            markedLoaded = true;
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
            script.onload = () => {
                markedLoaded = true;
                // Configure marked in page context
                if (targetWindow.marked) {
                    targetWindow.marked.setOptions({ breaks: true, gfm: true });
                }
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    // --- UI 构建 (Glassmorphism) ---

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --glass-bg: rgba(255, 255, 255, 0.75);
            --glass-border: rgba(255, 255, 255, 0.5);
            --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            --text-primary: #333333;
            --text-secondary: #666666;
            --accent-color: #007AFF; /* Safari Blue */
            --accent-hover: #0056b3;
            --input-bg: rgba(255, 255, 255, 0.5);
            --radius-lg: 16px;
            --radius-md: 12px;
            --radius-sm: 8px;
            --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --glass-bg: rgba(30, 30, 30, 0.75);
                --glass-border: rgba(255, 255, 255, 0.1);
                --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                --text-primary: #f5f5f5;
                --text-secondary: #a0a0a0;
                --accent-color: #0A84FF;
                --accent-hover: #409CFF;
                --input-bg: rgba(0, 0, 0, 0.3);
            }
        }

        /* 强制主题覆盖 */
        [data-theme="light"] {
            --glass-bg: rgba(255, 255, 255, 0.75);
            --glass-border: rgba(255, 255, 255, 0.5);
            --text-primary: #333333;
            --text-secondary: #666666;
            --input-bg: rgba(255, 255, 255, 0.5);
        }
        [data-theme="dark"] {
            --glass-bg: rgba(30, 30, 30, 0.75);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text-primary: #f5f5f5;
            --text-secondary: #a0a0a0;
            --input-bg: rgba(0, 0, 0, 0.3);
        }

        .sas-glass {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            box-shadow: var(--glass-shadow);
        }

        .sas-container {
            position: fixed;
            z-index: 2147483647;
            font-family: var(--font-family);
            color: var(--text-primary);
            transition: all 0.3s ease;
        }

        /* 悬浮球 */
        .sas-fab {
            right: 24px;
            bottom: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            font-size: 24px;
            transition: transform 0.2s, opacity 0.2s;
        }
        .sas-fab:hover { transform: scale(1.05); }
        .sas-fab:active { transform: scale(0.95); }

        /* 主面板 */
        .sas-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            border-radius: var(--radius-lg);
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s, transform 0.2s;
        }
        .sas-panel.show {
            opacity: 1;
            pointer-events: auto;
            transform: translate(-50%, -50%) scale(1);
        }

        .sas-header {
            padding: 16px 20px;
            border-bottom: 1px solid var(--glass-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 18px;
        }

        .sas-close-btn, .sas-icon-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
            border-radius: 50%;
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
        }
        .sas-close-btn:hover, .sas-icon-btn:hover { background: rgba(128,128,128,0.1); }

        .sas-content {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        #sas-settings-panel {
            background: rgba(128,128,128,0.05);
            padding: 15px;
            border-radius: var(--radius-md);
            border: 1px solid var(--glass-border);
        }

        /* 表单元素 */
        .sas-input-group { margin-bottom: 16px; }
        .sas-label {
            display: block;
            font-size: 13px;
            color: var(--text-secondary);
            margin-bottom: 6px;
            font-weight: 500;
        }
        .sas-input, .sas-textarea, .sas-select {
            width: 100%;
            padding: 10px 12px;
            border-radius: var(--radius-md);
            border: 1px solid var(--glass-border);
            background: var(--input-bg);
            color: var(--text-primary);
            font-family: inherit;
            font-size: 14px;
            box-sizing: border-box;
            transition: border-color 0.2s;
        }
        .sas-input:focus, .sas-textarea:focus, .sas-select:focus {
            outline: none;
            border-color: var(--accent-color);
        }
        .sas-textarea { min-height: 100px; resize: vertical; }

        .sas-btn {
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: var(--radius-md);
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            font-size: 15px;
            transition: background 0.2s;
        }
        .sas-btn:hover { background: var(--accent-hover); }
        .sas-btn.secondary {
            background: transparent;
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
        }
        .sas-btn.secondary:hover { background: rgba(128,128,128,0.1); }

        /* Markdown 内容优化 */
        .sas-markdown {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
            line-height: 1.7;
            font-size: 15px;
            color: var(--text-primary);
            padding: 10px 0;
        }

        .sas-markdown h1, .sas-markdown h2 {
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
            font-weight: 600;
            line-height: 1.3;
            margin: 1.8em 0 1em;
            color: var(--text-primary);
            font-size: 1.6em;
            letter-spacing: -0.01em;
        }

        .sas-markdown h3 {
            font-size: 1.3em;
            margin: 1.5em 0 0.8em;
            color: var(--text-primary);
            font-weight: 600;
            line-height: 1.4;
        }

        .sas-markdown p {
            margin: 0.8em 0;
            line-height: 1.75;
            letter-spacing: 0.01em;
            text-align: left;
            color: var(--text-primary);
        }

        .sas-markdown ul {
            margin: 0.6em 0;
            padding-left: 0.5em;
            list-style: none;
        }

        .sas-markdown ul li {
            display: flex;
            align-items: baseline;
            margin: 0.4em 0;
            line-height: 1.6;
            letter-spacing: 0.01em;
        }

        .sas-markdown ul li .bullet {
            color: var(--text-secondary);
            margin-right: 0.7em;
            font-weight: normal;
            flex-shrink: 0;
        }

        .sas-markdown ul li .text {
            flex: 1;
        }

        .sas-markdown strong {
            color: var(--text-primary);
            font-weight: 600;
        }

        .sas-markdown blockquote {
            margin: 1.2em 0;
            padding: 0.8em 1.2em;
            background: rgba(128,128,128,0.05);
            border-left: 4px solid var(--accent-color);
            border-radius: 6px;
            color: var(--text-secondary);
            font-style: italic;
        }

        .sas-markdown code {
            font-family: "SF Mono", Menlo, Monaco, Consolas, monospace;
            font-size: 0.9em;
            background: rgba(128,128,128,0.15);
            border: 1px solid var(--glass-border);
            border-radius: 4px;
            padding: 0.2em 0.4em;
            color: var(--accent-color);
        }

        .sas-markdown pre {
            background: rgba(128,128,128,0.1);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 1.2em;
            overflow-x: auto;
            margin: 1.2em 0;
        }

        /* 底部操作栏 */
        .sas-actions {
            padding: 16px 20px;
            border-top: 1px solid var(--glass-border);
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        /* 动画 */
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .sas-loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(128,128,128,0.3);
            border-radius: 50%;
            border-top-color: var(--accent-color);
            animation: spin 1s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);

    // --- DOM 元素创建 ---

    // 悬浮按钮
    const fab = document.createElement('div');
    fab.className = 'sas-container sas-glass sas-fab';
    // 使用 SF Symbols 风格的 SVG 图标
    fab.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
            <path d="M7 7H17V9H7V7Z" fill="currentColor"/>
            <path d="M7 11H17V13H7V11Z" fill="currentColor"/>
            <path d="M7 15H14V17H7V15Z" fill="currentColor"/>
        </svg>
    `;
    fab.title = 'AI 页面总结 (右键设置)';
    document.body.appendChild(fab);

    // 主面板
    const panel = document.createElement('div');
    panel.className = 'sas-container sas-glass sas-panel';
    document.body.appendChild(panel);

    // --- 逻辑处理 ---

    let isPanelOpen = false;
    let isSettingsOpen = false;

    function applyTheme() {
        const theme = config.theme;
        if (theme === 'auto') {
            panel.removeAttribute('data-theme');
        } else {
            panel.setAttribute('data-theme', theme);
        }
    }

    function renderPanel() {
        applyTheme();
        
        // 如果没有 API Key，默认展开设置
        if (!config.apiKey) isSettingsOpen = true;

        const settingsHtml = `
            <div id="sas-settings-panel" style="display: ${isSettingsOpen ? 'block' : 'none'}">
                <div class="sas-input-group">
                    <label class="sas-label">API URL</label>
                    <input type="text" class="sas-input" id="sas-api-url" value="${config.apiUrl}">
                </div>
                <div class="sas-input-group">
                    <label class="sas-label">API Key</label>
                    <input type="password" class="sas-input" id="sas-api-key" value="${config.apiKey}" placeholder="sk-...">
                </div>
                <div class="sas-input-group">
                    <label class="sas-label">模型 (Model)</label>
                    <input type="text" class="sas-input" id="sas-model" value="${config.model}">
                </div>
                <div class="sas-input-group">
                    <label class="sas-label">提示词 (Prompt)</label>
                    <textarea class="sas-textarea" id="sas-prompt">${config.prompt}</textarea>
                </div>
                <div class="sas-input-group">
                    <label class="sas-label">快捷键 (Shortcut) - 点击输入，Backspace 清除</label>
                    <input type="text" class="sas-input" id="sas-shortcut" value="${config.shortcut}" placeholder="例如: Alt+A" readonly>
                </div>
                <div class="sas-input-group">
                    <label class="sas-label">主题</label>
                    <select class="sas-select" id="sas-theme">
                        <option value="auto" ${config.theme === 'auto' ? 'selected' : ''}>跟随系统</option>
                        <option value="light" ${config.theme === 'light' ? 'selected' : ''}>浅色</option>
                        <option value="dark" ${config.theme === 'dark' ? 'selected' : ''}>深色</option>
                    </select>
                </div>
                <button class="sas-btn" id="sas-save-settings">保存配置</button>
            </div>
        `;

        const resultHtml = `<div id="sas-result-area" class="sas-markdown"><p>点击下方按钮开始生成总结...</p></div>`;

        const pageTitle = document.title.length > 20 ? document.title.substring(0, 20) + '...' : document.title;

        panel.innerHTML = `
            <div class="sas-header">
                <span>${pageTitle}</span>
                <div style="display:flex; gap:8px;">
                    <button class="sas-icon-btn" id="sas-toggle-settings" title="设置">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </button>
                    <button class="sas-close-btn">×</button>
                </div>
            </div>
            <div class="sas-content">
                ${settingsHtml}
                ${resultHtml}
            </div>
            <div class="sas-actions">
                <button class="sas-btn" id="sas-start-summary">开始总结</button>
            </div>
        `;

        // 绑定事件
        panel.querySelector('.sas-close-btn').onclick = closePanel;
        document.getElementById('sas-toggle-settings').onclick = () => {
            isSettingsOpen = !isSettingsOpen;
            const settingsPanel = document.getElementById('sas-settings-panel');
            settingsPanel.style.display = isSettingsOpen ? 'block' : 'none';
        };

        document.getElementById('sas-save-settings').onclick = saveSettings;
        document.getElementById('sas-start-summary').onclick = startSummary;
        
        // 快捷键录入
        const shortcutInput = document.getElementById('sas-shortcut');
        shortcutInput.addEventListener('keydown', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 防止冲突

            if (e.key === 'Backspace' || e.key === 'Delete') {
                shortcutInput.value = '';
                return;
            }

            const keys = [];
            if (e.ctrlKey) keys.push('Ctrl');
            if (e.altKey) keys.push('Alt');
            if (e.shiftKey) keys.push('Shift');
            if (e.metaKey) keys.push('Meta');
            
            let key = e.key.toUpperCase();
            // 同样使用 e.code 处理
            if (e.code.startsWith('Key')) {
                key = e.code.slice(3).toUpperCase();
            } else if (e.code.startsWith('Digit')) {
                key = e.code.slice(5);
            }

            if (!['CONTROL', 'ALT', 'SHIFT', 'META', 'BACKSPACE', 'DELETE'].includes(key)) {
                keys.push(key);
            }
            
            if (keys.length > 0) {
                shortcutInput.value = keys.join('+');
            }
        });
    }

    function openPanel() {
        if (!panel.innerHTML) renderPanel(); // 初始化
        else {
             // 重新绑定事件或更新状态（如果需要）
             // 这里简单处理，每次打开都重新渲染以保证状态最新，或者只更新显示
             renderPanel();
        }
        panel.classList.add('show');
        isPanelOpen = true;
    }

    function closePanel() {
        panel.classList.remove('show');
        isPanelOpen = false;
    }

    function saveSettings() {
        config.apiUrl = document.getElementById('sas-api-url').value;
        config.apiKey = document.getElementById('sas-api-key').value;
        config.model = document.getElementById('sas-model').value;
        config.prompt = document.getElementById('sas-prompt').value;
        config.theme = document.getElementById('sas-theme').value;
        config.shortcut = document.getElementById('sas-shortcut').value;

        GM.setValue('apiUrl', config.apiUrl);
        GM.setValue('apiKey', config.apiKey);
        GM.setValue('model', config.model);
        GM.setValue('prompt', config.prompt);
        GM.setValue('theme', config.theme);
        GM.setValue('shortcut', config.shortcut);

        alert('配置已保存');
        applyTheme();
        // 保持设置面板打开或关闭取决于用户当前状态，这里不做改变
    }

    async function startSummary() {
        // 尝试从输入框获取最新配置（如果用户修改了但没点保存）
        const apiKeyInput = document.getElementById('sas-api-key');
        if (apiKeyInput) {
            config.apiKey = apiKeyInput.value;
            // 也可以顺便更新其他配置
            config.apiUrl = document.getElementById('sas-api-url').value;
            config.model = document.getElementById('sas-model').value;
            config.prompt = document.getElementById('sas-prompt').value;
        }

        if (!config.apiKey) {
            alert('请先配置 API Key');
            isSettingsOpen = true;
            renderPanel();
            return;
        }

        const resultArea = document.getElementById('sas-result-area');
        const startBtn = document.getElementById('sas-start-summary');
        
        startBtn.disabled = true;
        startBtn.innerHTML = '<span class="sas-loading"></span>生成中...';
        resultArea.innerHTML = '<p>正在分析页面内容，请稍候...</p>';

        try {
            // 1. 获取页面内容
            const pageContent = document.body.innerText.substring(0, 6000); // 增加字符限制

            // 2. 加载 marked.js
            await loadMarked();

            // 3. 调用 API
            const response = await gmFetch(config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: config.model,
                    messages: [
                        { role: 'system', content: config.prompt },
                        { role: 'user', content: pageContent }
                    ]
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0]) {
                let markdown = data.choices[0].message.content;

                // 移除可能存在的 Markdown 代码块包裹，确保渲染为阅读模式
                markdown = markdown.replace(/^```(markdown)?\s*/i, '').replace(/\s*```$/, '');

                // 使用 targetWindow.marked
                const markedFunc = targetWindow.marked ? targetWindow.marked.parse : (text) => text;
                resultArea.innerHTML = markedFunc(markdown);
                
                // 添加复制按钮
                const copyBtn = document.createElement('button');
                copyBtn.className = 'sas-btn secondary';
                copyBtn.style.marginTop = '10px';
                copyBtn.textContent = '复制结果';
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(markdown);
                    copyBtn.textContent = '已复制!';
                    setTimeout(() => copyBtn.textContent = '复制结果', 2000);
                };
                resultArea.appendChild(copyBtn);
            } else {
                throw new Error('API 返回格式异常');
            }

        } catch (error) {
            resultArea.innerHTML = `<p style="color: #ff3b30;">出错啦: ${error.message}</p>`;
            console.error(error);
        } finally {
            startBtn.disabled = false;
            startBtn.innerHTML = '重新总结';
        }
    }

    // --- 拖拽功能 ---
    let isDragging = false;
    let dragStartX, dragStartY;
    let initialRight, initialBottom;

    fab.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // 仅左键
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        const rect = fab.getBoundingClientRect();
        initialRight = window.innerWidth - rect.right;
        initialBottom = window.innerHeight - rect.bottom;

        const onMouseMove = (e) => {
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) isDragging = true;

            if (isDragging) {
                fab.style.right = `${initialRight - dx}px`;
                fab.style.bottom = `${initialBottom - dy}px`;
            }
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // --- 事件监听 ---

    fab.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        if (!isDragging) {
            if (isPanelOpen) closePanel();
            else openPanel();
        }
    });

    fab.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation(); // 阻止事件冒泡
        if (!isDragging) {
            isSettingsOpen = true;
            openPanel();
        }
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
        // 确保点击的不是面板内部或悬浮球
        if (isPanelOpen && !panel.contains(e.target) && !fab.contains(e.target)) {
            closePanel();
        }
    });
    
    // 阻止面板内部点击事件冒泡到 document
    panel.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // 全局快捷键监听
    document.addEventListener('keydown', (e) => {
        if (!config.shortcut) return;
        
        const keys = [];
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        if (e.metaKey) keys.push('Meta');
        
        // 使用 e.code 来获取物理按键，避免大小写和布局问题
        // e.key 可能会受到输入法影响
        let key = e.key.toUpperCase();
        
        // 特殊处理一些按键
        if (e.code.startsWith('Key')) {
            key = e.code.slice(3).toUpperCase();
        } else if (e.code.startsWith('Digit')) {
            key = e.code.slice(5);
        }

        if (!['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) {
            keys.push(key);
        }
        
        const currentShortcut = keys.join('+');
        if (currentShortcut === config.shortcut) {
            e.preventDefault();
            e.stopPropagation();
            if (isPanelOpen) {
                closePanel();
            } else {
                openPanel();
                // 快捷键直接开始总结
                startSummary();
            }
        }
    });

    // --- 菜单命令 ---
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("打开面板", () => openPanel());
    }

})();