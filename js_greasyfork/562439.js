// ==UserScript==
// @name        鲸落量子网页总结
// @namespace   http://tampermonkey.net/
// @version     0.3.3
// @description 自动调用AI总结网页内容，采用量子控制中心UI风格，移动端优化
// @author      AiCoder & 氚-Tritium
// @match       *://*/*
// @connect     *
// @license     MIT
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.jsdelivr.net/npm/turndown@7.1.1/dist/turndown.min.js
// @downloadURL https://update.greasyfork.org/scripts/562439/%E9%B2%B8%E8%90%BD%E9%87%8F%E5%AD%90%E7%BD%91%E9%A1%B5%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/562439/%E9%B2%B8%E8%90%BD%E9%87%8F%E5%AD%90%E7%BD%91%E9%A1%B5%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数 (保持原有逻辑不变)
    const CONFIG = {
        apiKey: 'YOUR_API_KEY_HERE',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7,
        uiPosition: 'bottom-right', 
        theme: 'light',
        autoSummarize: true,
        delay: 500,
        autoSummarizeDomains: ['juejin.cn', 'zhihu.com', 'csdn.net', 'jianshu.com'],
        blacklistDomains: ['*google.com', '*facebook.com', '*twitter.com', '*baidu.com', "*youtube.com", "*greasyfork.org"]
    };

    const savedConfig = GM_getValue('aiSummaryConfig');
    if (savedConfig) {
        Object.assign(CONFIG, JSON.parse(savedConfig));
    }

    // --- 样式定义 ---
    GM_addStyle(`
        :root {
            --primary: #4a90e2;
            --bg: #f4f7f9;
            --card: #ffffff;
            --text-main: #2d3748;
            --text-sub: #718096;
            --input-bg: #f1f5f9;
            --radius: 20px;
            --shadow: 0 10px 25px rgba(0,0,0,0.05);
            --ease: cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-theme="dark"] {
            --bg: #0f172a;
            --card: #1e293b;
            --text-main: #f1f5f9;
            --text-sub: #94a3b8;
            --input-bg: #334155;
            --shadow: 0 10px 25px rgba(0,0,0,0.3);
        }

        #ai-summary-container {
            position: fixed;
            width: 92%;
            max-width: 480px;
            max-height: 80vh;
            background: var(--card);
            color: var(--text-main);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            z-index: 9999;
            overflow: hidden;
            font-family: -apple-system, system-ui, sans-serif;
            transition: all 0.3s var(--ease);
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(0,0,0,0.02);
            left: 50%;
            transform: translateX(-50%);
            bottom: 20px;
        }

        /* 顶部标题栏 */
        #ai-summary-header {
            padding: 15px 20px;
            background: var(--card);
            border-bottom: 1px solid var(--input-bg);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #ai-summary-title {
            font-weight: 700;
            font-size: 16px;
            margin: 0;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* 左上角转圈动画 */
        .q-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid var(--input-bg);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: q-spin 0.8s linear infinite;
            display: none; /* 默认隐藏 */
        }
        @keyframes q-spin { to { transform: rotate(360deg); } }

        /* 操作按钮组 */
        #ai-summary-controls {
            display: flex;
            gap: 12px;
        }

        #ai-summary-controls button {
            background: var(--input-bg);
            border: none;
            cursor: pointer;
            width: 32px;
            height: 32px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            color: var(--text-sub);
        }

        #ai-summary-controls button:hover {
            background: var(--primary);
            color: #fff;
            transform: scale(1.05);
        }
        
        #ai-summary-controls button svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        /* 内容区域 */
        #ai-summary-content {
            padding: 20px;
            overflow-y: auto;
            min-height: 100px;
            max-height: 50vh;
            font-size: 14px;
            line-height: 1.6;
            color: var(--text-main);
            background: linear-gradient(to bottom, var(--card), var(--bg) 150%);
        }

        #ai-summary-content p {
            margin-bottom: 12px;
            text-align: justify;
        }

        /* 底部状态栏 */
        #ai-summary-footer {
            padding: 12px 20px;
            background: var(--input-bg);
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: var(--text-sub);
            border-top: 1px solid rgba(0,0,0,0.05);
        }

        .summary-toggle-btn {
            color: var(--primary);
            font-weight: 600;
            cursor: pointer;
        }

        /* 设置面板 */
        .settings-backdrop {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            z-index: 10000;
            display: none;
        }

        #ai-summary-settings {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 420px;
            background: var(--card);
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            z-index: 10001;
            display: none;
            flex-direction: column;
            max-height: 85vh;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -45%); }
            to { opacity: 1; transform: translate(-50%, -50%); }
        }

        .settings-header {
            padding: 20px;
            font-size: 18px;
            font-weight: 700;
            color: var(--text-main);
            border-bottom: 1px solid var(--input-bg);
            display: flex;
            justify-content: space-between;
        }

        .settings-scroll-area {
            padding: 20px;
            overflow-y: auto;
        }

        .settings-group {
            margin-bottom: 20px;
        }

        .settings-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 14px;
            color: var(--text-main);
        }

        .settings-group input[type="text"],
        .settings-group input[type="password"],
        .settings-group input[type="number"],
        .settings-group select,
        .settings-group textarea {
            width: 100%;
            padding: 14px 16px;
            border-radius: 12px;
            border: 2px solid transparent;
            background: var(--input-bg);
            color: var(--text-main);
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
            box-sizing: border-box;
            font-family: inherit;
        }

        .settings-group input:focus,
        .settings-group select:focus,
        .settings-group textarea:focus {
            background: var(--card);
            border-color: var(--primary);
        }

        /* 复选框样式优化 */
        .checkbox-wrapper {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 0;
        }
        .checkbox-wrapper input[type="checkbox"] {
            width: 20px;
            height: 20px;
            accent-color: var(--primary);
        }

        .settings-actions {
            padding: 20px;
            display: flex;
            gap: 15px;
            background: var(--card);
        }

        .btn-action {
            flex: 1;
            padding: 14px;
            border-radius: 12px;
            border: none;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        #save-settings {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }

        #cancel-settings {
            background: var(--input-bg);
            color: var(--text-sub);
        }

        .btn-action:active {
            transform: scale(0.98);
        }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 3px; }
    `);

    // SVG 图标
    const ICONS = {
        refresh: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
        settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
        minimize: '<svg viewBox="0 0 24 24"><path d="M6 19h12v2H6z"/></svg>',
        close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
    };

    // 辅助函数
    function domainMatchesPattern(domain, pattern) {
        try {
            const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
            const regex = new RegExp(`^${regexPattern}$`);
            return regex.test(domain);
        } catch (error) { return false; }
    }

    function isCurrentDomainBlacklisted() {
        const currentDomain = window.location.hostname;
        for (const pattern of CONFIG.blacklistDomains) {
            if (domainMatchesPattern(currentDomain, pattern)) return true;
        }
        return false;
    }

    // UI 创建逻辑
    function createUI() {
        if (CONFIG.theme === 'dark') document.body.setAttribute('data-theme', 'dark');
        
        const container = document.createElement('div');
        container.id = 'ai-summary-container';
        container.innerHTML = `
            <div id="ai-summary-header">
                <div id="ai-summary-title">
                    <div id="q-loading-icon" class="q-spinner"></div>
                    <span></span>
                </div>
                <div id="ai-summary-controls">
                    <button id="ai-summary-refresh" title="重新解析">${ICONS.refresh}</button>
                    <button id="ai-summary-settings-btn" title="系统设置">${ICONS.settings}</button>
                    <button id="ai-summary-minimize" title="最小化">${ICONS.minimize}</button>
                    <button id="ai-summary-close" title="关闭通道">${ICONS.close}</button>
                </div>
            </div>
            <div id="ai-summary-content">
                <div style="text-align:center; padding:20px; color:var(--text-sub);">
                    点击刷新按钮开始建立量子纠缠...
                </div>
            </div>
            <div id="ai-summary-footer">
                <span>POWER BY HAINACLOUD</span>
                <span id="ai-summary-toggle" class="summary-toggle-btn">自动解析: ${CONFIG.autoSummarize ? 'ON' : 'OFF'}</span>
            </div>
        `;
        document.body.appendChild(container);

        const backdrop = document.createElement('div');
        backdrop.className = 'settings-backdrop';
        document.body.appendChild(backdrop);

        // 设置面板：添加了自动总结和域名的设置项
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'ai-summary-settings';
        settingsPanel.innerHTML = `
            <div class="settings-header">
                <span>参数配置</span>
                <span class="close-settings" style="cursor:pointer;">${ICONS.close}</span>
            </div>
            <div class="settings-scroll-area">
                <div class="settings-group">
                    <label for="api-key">API 密钥</label>
                    <input type="password" id="api-key" value="${CONFIG.apiKey}" placeholder="sk-...">
                </div>
                <div class="settings-group">
                    <label for="api-endpoint">接口地址</label>
                    <input type="text" id="api-endpoint" value="${CONFIG.apiEndpoint}">
                </div>
                
                <div class="settings-group">
                    <div class="checkbox-wrapper">
                        <label for="auto-sum-switch" style="margin:0">启用自动解析</label>
                        <input type="checkbox" id="auto-sum-switch" ${CONFIG.autoSummarize ? 'checked' : ''}>
                    </div>
                </div>
                <div class="settings-group">
                    <label for="auto-domains">自动解析域名 (逗号或换行分隔)</label>
                    <textarea id="auto-domains" rows="3" placeholder="例如: zhihu.com, juejin.cn">${CONFIG.autoSummarizeDomains.join(', ')}</textarea>
                </div>

                <div class="settings-group">
                    <label for="model">模型名称</label>
                    <input type="text" id="model" value="${CONFIG.model}">
                </div>
                <div class="settings-group">
                    <label for="temperature">随机性 (0-2)</label>
                    <input type="range" id="temperature" value="${CONFIG.temperature}" min="0" max="2" step="0.1" style="width:100%">
                    <div style="text-align:right; font-size:12px; color:var(--text-sub)" id="temp-val">${CONFIG.temperature}</div>
                </div>
                <div class="settings-group">
                    <label for="theme">界面主题</label>
                    <select id="theme">
                        <option value="light" ${CONFIG.theme === 'light' ? 'selected' : ''}>极昼模式</option>
                        <option value="dark" ${CONFIG.theme === 'dark' ? 'selected' : ''}>深空模式</option>
                    </select>
                </div>
            </div>
            <div class="settings-actions">
                <button id="cancel-settings" class="btn-action">取消</button>
                <button id="save-settings" class="btn-action">保存配置</button>
            </div>
        `;
        document.body.appendChild(settingsPanel);

        if(window.innerWidth > 768 && typeof makeElementDraggable === 'function') {
            makeElementDraggable(container);
        }

        setTimeout(bindEventListeners, 0);
    }

    function updateTemperatureValue() {
        const temp = document.getElementById('temperature');
        document.getElementById('temp-val').textContent = temp.value;
    }

    function bindEventListeners() {
        document.getElementById('ai-summary-settings-btn').onclick = (e) => {
            e.stopPropagation();
            showSettings();
        };
        
        document.querySelector('.close-settings').onclick = hideSettings;
        document.getElementById('cancel-settings').onclick = hideSettings;
        document.querySelector('.settings-backdrop').onclick = hideSettings;
        document.getElementById('save-settings').onclick = saveSettings;
        document.getElementById('ai-summary-refresh').onclick = () => summarizeContent();
        document.getElementById('ai-summary-minimize').onclick = toggleMinimize;
        document.getElementById('ai-summary-close').onclick = () => {
            document.getElementById('ai-summary-container').style.display = 'none';
        };
        
        toggleMinimize();
        document.getElementById('ai-summary-toggle').onclick = toggleAutoSummarize;
        document.getElementById('temperature').oninput = updateTemperatureValue;
    }

    function showSettings() {
        // 更新开关状态
        const switchEl = document.getElementById('auto-sum-switch');
        if(switchEl) switchEl.checked = CONFIG.autoSummarize;

        document.querySelector('.settings-backdrop').style.display = 'block';
        document.getElementById('ai-summary-settings').style.display = 'flex';
    }

    function hideSettings() {
        document.querySelector('.settings-backdrop').style.display = 'none';
        document.getElementById('ai-summary-settings').style.display = 'none';
    }

    function toggleMinimize() {
        const content = document.getElementById('ai-summary-content');
        const footer = document.getElementById('ai-summary-footer');
        const btn = document.getElementById('ai-summary-minimize');
        const container = document.getElementById('ai-summary-container');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            footer.style.display = 'flex';
            container.style.width = '92%'; 
            btn.innerHTML = ICONS.minimize;
        } else {
            content.style.display = 'none';
            footer.style.display = 'none';
            container.style.width = 'auto';
            btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z"/></svg>';
        }
    }

    function toggleAutoSummarize() {
        CONFIG.autoSummarize = !CONFIG.autoSummarize;
        updateFooterState();
        saveConfig();
    }
    
    function updateFooterState() {
        document.getElementById('ai-summary-toggle').textContent = `自动解析: ${CONFIG.autoSummarize ? 'ON' : 'OFF'}`;
    }

    function saveSettings() {
        CONFIG.apiKey = document.getElementById('api-key').value;
        CONFIG.apiEndpoint = document.getElementById('api-endpoint').value;
        CONFIG.model = document.getElementById('model').value;
        CONFIG.temperature = parseFloat(document.getElementById('temperature').value) || 0.7;
        CONFIG.theme = document.getElementById('theme').value;
        
        // 保存新添加的自动总结设置
        CONFIG.autoSummarize = document.getElementById('auto-sum-switch').checked;
        const domainsRaw = document.getElementById('auto-domains').value;
        CONFIG.autoSummarizeDomains = domainsRaw.split(/[,，\n]/).map(d => d.trim()).filter(d => d);

        saveConfig();
        updateFooterState();
        
        if (CONFIG.theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }

        hideSettings();
        
        const contentElement = document.getElementById('ai-summary-content');
        contentElement.innerHTML = '<div style="text-align:center; padding:10px; color:var(--primary);">配置已更新，准备就绪。</div>';
    }

    function makeElementDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById('ai-summary-header');
        if (header) header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + 'px';
            element.style.left = (element.offsetLeft - pos1) + 'px';
            element.style.bottom = 'auto'; 
            element.style.transform = 'none';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function extractPageContent() {
        const title = document.title;
        const turndownService = new TurndownService();
        turndownService.addRule('removeAds', {
             filter: node => node.className && (node.className.includes('ad') || node.className.includes('sidebar')),
             replacement: () => ''
        });

        let htmlContent = '';
        const articleElements = document.querySelectorAll('article, .article, .post, .content, main, [role="main"]');
        if (articleElements.length > 0) {
            htmlContent = articleElements[0].innerHTML;
        } else {
            htmlContent = document.body.innerHTML; 
        }

        let content = turndownService.turndown(htmlContent);
        content = content.replace(/\n{3,}/g, '\n\n').trim();
        if (content.length > 10000) content = content.substring(0, 10000) + '...';
        return { title, content };
    }

    function summarizeContent(isAuto = false) {
        const contentElement = document.getElementById('ai-summary-content');
        // 显示加载状态：左上角Spinner + 文字提示
        document.getElementById('q-loading-icon').style.display = 'block';
        contentElement.innerHTML = '<div style="color:var(--primary); text-align:center;">正在建立纠缠通道...</div>';

        const { title, content } = extractPageContent();

        if (CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
            document.getElementById('q-loading-icon').style.display = 'none';
            contentElement.innerHTML = '<div style="color:var(--text-sub); text-align:center;">密钥缺失，请点击设置图标配置。</div>';
            return;
        }

        const requestData = {
            model: CONFIG.model,
            messages: [
                { role: 'system', content: '你是一个专业的内容总结助手。请简洁明了地总结以下网页内容的要点。' },
                { role: 'user', content: `网页标题: ${title}\n\n网页内容: ${content}\n\n请总结。` }
            ],
            temperature: CONFIG.temperature,
            stream: true
        };

        let summaryText = '';
        let lastResponseLength = 0;
        let isFirstChunk = true;

        GM_xmlhttpRequest({
            method: 'POST',
            url: CONFIG.apiEndpoint,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CONFIG.apiKey}` },
            data: JSON.stringify(requestData),
            timeout: 30000,
            onloadstart: function() {
                // 不在这里清空，而是在收到第一个数据包时清空，防止闪烁
            },
            onreadystatechange: function(response) {
                // 收到响应
                const responseText = response.responseText || '';
                if (responseText.length <= lastResponseLength) return;
                
                const newResponseText = responseText.substring(lastResponseLength);
                lastResponseLength = responseText.length;

                const lines = newResponseText.split('\n');
                let newContent = '';
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.choices?.[0]?.delta?.content) {
                                newContent += data.choices[0].delta.content;
                            }
                        } catch (e) {}
                    }
                }

                if (newContent) {
                    // 如果是第一块有效内容，清空容器并创建输出div
                    if (isFirstChunk) {
                         contentElement.innerHTML = ''; 
                         const p = document.createElement('div');
                         contentElement.appendChild(p);
                         isFirstChunk = false;
                    }

                    summaryText += newContent;
                    const div = contentElement.querySelector('div');
                    if (div) {
                        div.innerHTML = renderMarkdown(summaryText);
                    }
                    // 保持滚动在底部
                    contentElement.scrollTop = contentElement.scrollHeight;
                }
            },
            onload: function() {
                // 完成：隐藏转圈
                document.getElementById('q-loading-icon').style.display = 'none';
                if(isFirstChunk && !summaryText) {
                    contentElement.innerHTML = '<div style="text-align:center">未获取到有效内容，请检查Key或网络。</div>';
                }
            },
            onerror: function() {
                document.getElementById('q-loading-icon').style.display = 'none';
                contentElement.innerHTML = '连接中断，请检查网络。';
            }
        });
    }

    function renderMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    function isAutoSummarizeDomain() {
        const currentDomain = window.location.hostname;
        return CONFIG.autoSummarizeDomains.some(domain => currentDomain.includes(domain));
    }

    function saveConfig() {
        GM_setValue('aiSummaryConfig', JSON.stringify(CONFIG));
    }

    function initializeScript() {
        if (isCurrentDomainBlacklisted()) return;
        createUI();
        if (CONFIG.autoSummarize && isAutoSummarizeDomain()) {
            setTimeout(() => summarizeContent(true), CONFIG.delay);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }
})();
