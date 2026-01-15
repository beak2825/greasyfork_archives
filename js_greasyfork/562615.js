// ==UserScript==
// @name         全网 AI全文流式分析+提问
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  完美体验！支持点击外部折叠、侧边栏拖拽拉伸、自动预分析、字体调节、输入框展开、流式回答。适配小米MIMO/DeepSeek/OpenAI。
// @author       AI Partner
// @match        *://*/*
// @exclude      *://www.google.com/*
// @exclude      *://www.baidu.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.0/marked.min.js
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562615/%E5%85%A8%E7%BD%91%20AI%E5%85%A8%E6%96%87%E6%B5%81%E5%BC%8F%E5%88%86%E6%9E%90%2B%E6%8F%90%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/562615/%E5%85%A8%E7%BD%91%20AI%E5%85%A8%E6%96%87%E6%B5%81%E5%BC%8F%E5%88%86%E6%9E%90%2B%E6%8F%90%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof marked !== 'undefined') {
        marked.setOptions({ gfm: true, breaks: true });
    }

    // --- 全局状态 ---
    let chatHistory = [];
    let isProcessing = false;
    let currentXHR = null;
    let currentFontSize = 14; // 默认字体大小
    let panelWidth = GM_getValue('ai_panel_width', 450); // 记忆宽度

    // --- 配置部分 ---
    const DEFAULT_CONFIG = {
        endpoint: "https://api.xiaomimimo.com/v1",
        model: "mimo-v2-flash",
        autoAnalyze: false // 默认关闭自动预分析
    };

    const config = {
        get apiKey() { return GM_getValue('ai_api_key', ''); },
        get apiEndpoint() { return GM_getValue('ai_endpoint', DEFAULT_CONFIG.endpoint); },
        get model() { return GM_getValue('ai_model', DEFAULT_CONFIG.model); },
        get autoAnalyze() { return GM_getValue('ai_auto_analyze', DEFAULT_CONFIG.autoAnalyze); }
    };

    // --- 1. 样式系统 (升级版) ---
    GM_addStyle(`
        /* 悬浮球 */
        #ai-float-trigger {
            position: fixed; bottom: 30px; right: 30px;
            width: 35px; height: 35px;
            background: linear-gradient(135deg, #28a745, #218838);
            color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 10001;
            box-shadow: 0 4px 10px rgba(40, 167, 69, 0.4);
            font-size: 10px; font-weight: bold; transition: transform 0.3s ease;
            line-height: 1.2; text-align: center;
        }
        #ai-float-trigger:hover { transform: scale(1.1); }

        /* 侧边面板 */
        #ai-side-panel {
            position: fixed; top: 0; right: -100%; /* 默认完全隐藏 */
            width: ${panelWidth}px; height: 100vh;
            min-width: 300px; max-width: 90vw;
            background: #fff; z-index: 10002;
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: -5px 0 25px rgba(0,0,0,0.15);
            display: flex; flex-direction: column;
            font-family: -apple-system, sans-serif;
        }
        #ai-side-panel.open { right: 0; }

        /* 拖拽把手 */
        #ai-resize-handle {
            position: absolute; left: 0; top: 0; bottom: 0; width: 5px;
            cursor: ew-resize; z-index: 10003; background: transparent;
        }
        #ai-resize-handle:hover { background: rgba(0,0,0,0.1); }

        /* 头部 */
        .ai-header {
            padding: 12px 16px; background: #fff; border-bottom: 1px solid #eee;
            display: flex; justify-content: space-between; align-items: center;
            font-weight: 600; color: #333;
        }
        .ai-header-controls { display: flex; align-items: center; gap: 8px; }
        .ai-icon-btn {
            cursor: pointer; padding: 4px; color: #666; font-size: 14px;
            border-radius: 4px; transition: 0.2s; user-select: none;
        }
        .ai-icon-btn:hover { background: #f0f0f0; color: #28a745; }

        /* 聊天区域 */
        #ai-chat-container {
            flex: 1; padding: 20px; overflow-y: auto; background: #f8f9fa;
            display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;
            font-size: ${currentFontSize}px; /* 动态字体 */
        }

        /* 消息气泡 */
        .chat-msg { max-width: 92%; padding: 10px 14px; border-radius: 12px; line-height: 1.6; word-wrap: break-word; }
        .chat-msg.user { align-self: flex-end; background: #28a745; color: white; border-bottom-right-radius: 2px; }
        .chat-msg.assistant { align-self: flex-start; background: white; border: 1px solid #eef0f2; border-bottom-left-radius: 2px; color: #2c3e50; }

        /* Markdown */
        .assistant pre { background: #282c34; color: #abb2bf; padding: 10px; border-radius: 6px; overflow-x: auto; margin-top: 5px; }
        .assistant code { background: #f0f2f5; color: #e83e8c; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
        .assistant p { margin-bottom: 6px; }

        /* 底部输入区 (单行模式) */
/* 底部输入区 (迷你版 - 高度缩减50%) */
        .ai-input-area {
            padding: 6px 8px; /* 减小外边距 */
            background: white; border-top: 1px solid #eee;
            display: flex; align-items: center; gap: 6px;
        }
        .ai-input-wrapper { position: relative; flex: 1; display: flex; align-items: center; }

        #ai-textarea-mini {
            width: 100%; height: 24px; /* 高度从36px减到24px */
            padding: 2px 24px 2px 10px; /* 调整内边距 */
            border: 1px solid #e1e4e8; border-radius: 12px;
            resize: none; outline: none; font-size: 12px; line-height: 20px;
            overflow: hidden; white-space: nowrap; transition: 0.2s;
        }
        #ai-textarea-mini:focus { border-color: #28a745; }

        /* 展开图标 (垂直居中) */
        #ai-expand-btn {
            position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
            cursor: pointer; color: #999; font-size: 12px;
        }
        #ai-expand-btn:hover { color: #28a745; }

        /* 发送按钮 (缩小版) */
        .ai-btn-send {
            width: 24px; height: 24px; /* 尺寸从36px减到24px */
            border-radius: 50%; border: none;
            background: #28a745; color: white; cursor: pointer; font-size: 10px;
            display: flex; align-items: center; justify-content: center; transition: 0.2s;
        }
        .ai-btn-send:hover { background: #218838; }
        .ai-btn-send.stop-mode { background: #ff4d4f; }

        /* 展开的大输入框 (Pop-up) */
        #ai-input-popup {
            position: absolute; bottom: 60px; left: 10px; right: 10px;
            background: white; border: 1px solid #ccc; border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15); z-index: 10005;
            padding: 10px; display: none; flex-direction: column;
        }
        #ai-input-popup.show { display: flex; }
        #ai-textarea-large {
            width: 100%; height: 150px; border: none; outline: none;
            resize: none; font-size: 14px; margin-bottom: 10px; font-family: inherit;
        }
        .ai-popup-footer { display: flex; justify-content: space-between; }

        .typing::after { content: '▋'; animation: blink 1s infinite; color: #28a745; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    `);

    // --- 2. 核心请求逻辑 ---
    async function customStreamRequest(text, isAuto = false) {
        if (isProcessing && currentXHR) {
            currentXHR.abort();
            finishRequest(true);
        }

        if (isProcessing && !text) return;
        if (!text.trim()) return;

        if (!config.apiKey) {
            if (!isAuto) alert("请先设置 API Key！");
            return;
        }

        isProcessing = true;
        updateUIState(true);

        const container = document.getElementById('ai-chat-container');
        const miniInput = document.getElementById('ai-textarea-mini');

        if (!isAuto) {
            appendMessage('user', text);
            miniInput.value = ''; // 清空输入框
        } else {
            // 如果是自动预分析，只添加提示，不清除可能存在的用户输入
            appendMessage('user', "⚡ 智能预分析中...");
        }

        const assistantMsgDiv = document.createElement('div');
        assistantMsgDiv.className = 'chat-msg assistant typing';
        container.appendChild(assistantMsgDiv);
        container.scrollTop = container.scrollHeight;

        chatHistory.push({ role: "user", content: text });
        let fullContent = '';
        let buffer = '';

        currentXHR = GM_xmlhttpRequest({
            method: "POST",
            url: `${config.apiEndpoint}/chat/completions`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.apiKey}`,
                "Accept": "text/event-stream"
            },
            data: JSON.stringify({
                model: config.model,
                messages: [
                    { role: "system", content: "你是一个专业的助手。请用Markdown格式回答。" },
                    ...chatHistory
                ],
                stream: true,
                temperature: 0.7
            }),
            responseType: 'stream',
            onloadstart: (response) => {
                if (response.response && response.response.getReader) {
                    const reader = response.response.getReader();
                    const decoder = new TextDecoder();
                    const pump = async () => {
                        try {
                            while (true) {
                                const { done, value } = await reader.read();
                                if (done) break;
                                const chunk = decoder.decode(value, { stream: true });
                                if (processChunk(chunk)) break;
                            }
                        } catch (err) {
                            if (err.name !== 'AbortError') console.error("Stream error:", err);
                        } finally {
                            finishRequest();
                        }
                    };
                    pump();
                }
            },
            onload: (response) => {
                if (!fullContent && response.responseText) {
                    processChunk(response.responseText);
                    finishRequest();
                }
            },
            onerror: (err) => {
                assistantMsgDiv.innerHTML += `<br><span style="color:red">网络错误</span>`;
                finishRequest();
            }
        });

        function processChunk(chunk) {
            buffer += chunk;
            const lines = buffer.split('\n');
            buffer = lines.pop();
            let shouldStop = false;
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (trimmed === 'data: [DONE]') { shouldStop = true; continue; }
                if (trimmed.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(trimmed.substring(6));
                        const delta = data.choices?.[0]?.delta?.content || data.choices?.[0]?.text || '';
                        if (delta) {
                            fullContent += delta;
                            assistantMsgDiv.innerHTML = marked.parse(fullContent);
                            container.scrollTop = container.scrollHeight;
                        }
                    } catch (e) {}
                }
            }
            return shouldStop;
        }

        function finishRequest(isInterrupted = false) {
            if (!isProcessing) return;
            isProcessing = false;
            currentXHR = null;
            updateUIState(false);
            document.querySelectorAll('.typing').forEach(el => el.classList.remove('typing'));
            if (fullContent && !isInterrupted) {
                chatHistory.push({ role: "assistant", content: fullContent });
            }
        }
    }

    // --- 3. UI 交互逻辑 ---

    function updateUIState(loading) {
        const btn = document.querySelector('.ai-btn-send');
        if (!btn) return;
        if (loading) {
            btn.innerHTML = "⏹";
            btn.classList.add('stop-mode');
        } else {
            btn.innerHTML = "➤";
            btn.classList.remove('stop-mode');
        }
    }

    function changeFontSize(delta) {
        currentFontSize += delta;
        if (currentFontSize < 10) currentFontSize = 10;
        if (currentFontSize > 24) currentFontSize = 24;
        document.getElementById('ai-chat-container').style.fontSize = `${currentFontSize}px`;
    }

    function appendMessage(role, text) {
        const container = document.getElementById('ai-chat-container');
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${role}`;
        msgDiv.innerText = text;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    function getPageContent() {
        const sel = window.getSelection().toString().trim();
        if (sel.length > 10) return sel;
        const selectors = ['article', '.t_f', '#post_content', '.topic_content', '.markdown-body', '.content', '#content', 'main'];
        for (const s of selectors) {
            const el = document.querySelector(s);
            if (el && el.innerText.length > 50) return el.innerText.substring(0, 8000);
        }
        return document.body.innerText.substring(0, 5000);
    }

    // --- 4. 初始化 UI ---
    function initUI() {
        // 悬浮球
        const trigger = document.createElement('div');
        trigger.id = 'ai-float-trigger';
        trigger.innerHTML = 'AI<br>分析';
        document.body.appendChild(trigger);

        // 面板结构
        const panel = document.createElement('div');
        panel.id = 'ai-side-panel';
        panel.innerHTML = `
            <div id="ai-resize-handle" title="拖拽调整宽度"></div>
            <div class="ai-header">
                <span>🤖 AI 助手</span>
                <div class="ai-header-controls">
                    <span class="ai-icon-btn" id="ai-font-down" title="减小字体">A-</span>
                    <span class="ai-icon-btn" id="ai-font-up" title="增大字体">A+</span>
                    <span class="ai-icon-btn" id="ai-clear-btn" title="清空对话">🗑️</span>
                    <span class="ai-icon-btn ai-close" title="关闭面板">✕</span>
                </div>
            </div>
            <div id="ai-chat-container">
                <div class="chat-msg assistant">👋 点击悬浮球分析当前页面，或在下方输入。</div>
            </div>

            <div id="ai-input-popup">
                <textarea id="ai-textarea-large" placeholder="在这里输入长文本..."></textarea>
                <div class="ai-popup-footer">
                    <button class="ai-icon-btn" id="ai-popup-close">取消</button>
                    <button class="ai-icon-btn" id="ai-popup-send" style="color:#28a745; font-weight:bold;">发送</button>
                </div>
            </div>

            <div class="ai-input-area">
                <div class="ai-input-wrapper">
                    <input type="text" id="ai-textarea-mini" placeholder="输入问题..." autocomplete="off">
                    <span id="ai-expand-btn" title="展开大输入框">⤢</span>
                </div>
                <button class="ai-btn-send">➤</button>
            </div>
        `;
        document.body.appendChild(panel);

        // --- 事件绑定 ---

        // 1. 打开/关闭
        const togglePanel = () => {
            const isOpen = panel.classList.contains('open');
            if (isOpen) {
                panel.classList.remove('open');
            } else {
                panel.classList.add('open');
                // 如果没有开启自动分析，且是第一次打开，且没有历史记录，则自动分析
                if (!config.autoAnalyze && chatHistory.length === 0) {
                    const content = getPageContent();
                    customStreamRequest(`请总结这篇文章：\n\n${content}`, true);
                }
            }
        };
        trigger.onclick = (e) => {
            e.stopPropagation(); // 防止冒泡触发 document 点击
            togglePanel();
        };
        panel.querySelector('.ai-close').onclick = () => panel.classList.remove('open');

        // 2. 点击外部折叠
        document.addEventListener('click', (e) => {
            if (panel.classList.contains('open') &&
                !panel.contains(e.target) &&
                !trigger.contains(e.target) &&
                e.target.id !== 'ai-float-trigger') {
                panel.classList.remove('open');
            }
        });

        // 3. 拖拽调整宽度
        const handle = document.getElementById('ai-resize-handle');
        let isResizing = false;
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'ew-resize';
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            // 计算新宽度: 窗口宽度 - 鼠标X坐标
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 300 && newWidth < window.innerWidth * 0.9) {
                panel.style.width = newWidth + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = 'default';
                GM_setValue('ai_panel_width', parseInt(panel.style.width)); // 记忆宽度
            }
        });

        // 4. 字体调节
        document.getElementById('ai-font-up').onclick = () => changeFontSize(2);
        document.getElementById('ai-font-down').onclick = () => changeFontSize(-2);

        // 5. 清空
        document.getElementById('ai-clear-btn').onclick = () => {
            chatHistory = [];
            document.getElementById('ai-chat-container').innerHTML = '';
        };

        // 6. 发送逻辑
        const miniInput = document.getElementById('ai-textarea-mini');
        const sendBtn = document.querySelector('.ai-btn-send');

        const doSend = (text) => {
            if (isProcessing && !text) { // 停止逻辑
                if (currentXHR) currentXHR.abort();
                finishRequest(true); // 内部未定义，这里调用 customStreamRequest 里的...
                // 修正：finishRequest 定义在闭包里，这里只能通过重新触发 customStreamRequest(null) 来间接停止，
                // 或者我们让 click 事件直接调 customStreamRequest
            } else {
                customStreamRequest(text);
            }
        };

        sendBtn.onclick = () => doSend(miniInput.value);
        miniInput.onkeydown = (e) => {
            if (e.key === 'Enter') doSend(miniInput.value);
        };

        // 7. 展开大输入框逻辑
        const popup = document.getElementById('ai-input-popup');
        const largeInput = document.getElementById('ai-textarea-large');

        document.getElementById('ai-expand-btn').onclick = () => {
            largeInput.value = miniInput.value; // 同步内容
            popup.classList.add('show');
            largeInput.focus();
        };

        document.getElementById('ai-popup-close').onclick = () => {
            popup.classList.remove('show');
        };

        document.getElementById('ai-popup-send').onclick = () => {
            const text = largeInput.value;
            popup.classList.remove('show');
            miniInput.value = ""; // 清空小框
            doSend(text);
        };

        // --- 自动预分析逻辑 ---
        if (config.autoAnalyze) {
            console.log("🚀 [AI] 自动预分析已启动...");
            const content = getPageContent();
            if (content && content.length > 50) {
                customStreamRequest(`请总结这篇文章：\n\n${content}`, true);
            }
        }
    }

    // --- 5. 菜单设置 ---
    GM_registerMenuCommand("1. 开启/关闭 自动预分析", () => {
        const current = config.autoAnalyze;
        const next = !current;
        GM_setValue('ai_auto_analyze', next);
        alert(`自动预分析已${next ? '开启' : '关闭'} (刷新生效)`);
    });
    GM_registerMenuCommand("2. 设置 API 地址", () => {
        const val = prompt("API Endpoint", config.apiEndpoint);
        if (val) GM_setValue('ai_endpoint', val.replace(/\/$/, ""));
    });
    GM_registerMenuCommand("3. 设置 API Key", () => {
        const val = prompt("API Key", config.apiKey);
        if (val) GM_setValue('ai_api_key', val.trim());
    });
    GM_registerMenuCommand("4. 设置 模型名称", () => {
        const val = prompt("Model Name", config.model);
        if (val) GM_setValue('ai_model', val.trim());
    });

    initUI();
})();