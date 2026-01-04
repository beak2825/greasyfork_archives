// ==UserScript==
// @name         Bilibili AI弹幕过滤器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  使用 AI (OpenAI/Ollama) 实时筛查 Bilibili 弹幕。
// @author       Yesaye
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @connect      api.openai.com
// @connect      localhost
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @downloadURL https://update.greasyfork.org/scripts/556759/Bilibili%20AI%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556759/Bilibili%20AI%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置与常量 ---
    const CACHE_LIMIT = 5000;
    const danmakuCache = new Map(); // Text -> Boolean

    const DEFAULT_CONFIG = {
        provider: 'openai',
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        model: 'gpt-3.5-turbo',
        prompt: '你是一个专业的弹幕审核员，你需要判断弹幕是否符合一下条件，若不符合则回复 BLOCK，否则回复 PASS：1. 弹幕内容应与剧情发展有关，不得讨论与剧情无关的话题。2. 不得是无意义的，无聊的，或者重复的内容。3. 不得包含任何形式的攻击性语言，侮辱，歧视，或不尊重他人的内容。',
        enableLog: true,
        showButton: true
    };

    let config = { ...DEFAULT_CONFIG, ...GM_getValue('ai_dm_config', {}) };
    let observer = null;

    // --- 注册油猴菜单 ---
    GM_registerMenuCommand("⚙️ 打开 AI 弹幕设置", () => {
        const panel = document.getElementById('ai-dm-settings');
        if (panel) panel.style.display = 'block';
    });

    // --- 日志系统 ---
    const LOG_STYLES = {
        PASS: 'color: #0f5132; background-color: #d1e7dd; padding: 2px 5px; border-radius: 4px; font-weight: bold;',
        BLOCK: 'color: #842029; background-color: #f8d7da; padding: 2px 5px; border-radius: 4px; font-weight: bold;',
        INFO: 'color: #055160; background-color: #cff4fc; padding: 2px 5px; border-radius: 4px;',
        ERR:  'color: #fff; background-color: #dc3545; padding: 2px 5px; border-radius: 4px;'
    };

    function log(type, msg, detail = '') {
        if (!config.enableLog) return;
        const style = LOG_STYLES[type] || '';
        console.log(`%c[${type}] ${msg}`, style, detail);
    }

    // --- UI 界面 (保持不变) ---
    const UI_HTML = `
        <div id="ai-dm-settings" style="display:none; position:fixed; bottom:50px; right:20px; width:340px; background:#1f1f1f; color:#e0e0e0; padding:15px; border-radius:8px; z-index:99999; font-family:'Segoe UI', sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.6); border: 1px solid #333;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:10px;">
                <h3 style="margin:0; font-size:16px; color:#00a1d6;">🤖 AI 弹幕过滤配置</h3>
                <span id="ai-dm-close" style="cursor:pointer; font-size:20px;">&times;</span>
            </div>

            <div style="font-size:12px; margin-bottom:10px;">
                <label>API 提供商:</label>
                <select id="ai-dm-provider" style="width:100%; padding:5px; margin-top:4px; background:#333; color:#fff; border:1px solid #555;">
                    <option value="openai">OpenAI (ChatGPT)</option>
                    <option value="ollama">Ollama (Local)</option>
                </select>
            </div>

            <div style="font-size:12px; margin-bottom:10px;">
                <label>API URL:</label>
                <input type="text" id="ai-dm-url" style="width:100%; padding:5px; margin-top:4px; background:#333; color:#fff; border:1px solid #555; box-sizing:border-box;">
            </div>

            <div style="font-size:12px; margin-bottom:10px;">
                <label>API Key (Ollama可空):</label>
                <input type="password" id="ai-dm-key" style="width:100%; padding:5px; margin-top:4px; background:#333; color:#fff; border:1px solid #555; box-sizing:border-box;">
            </div>

            <div style="font-size:12px; margin-bottom:10px;">
                <label>模型名称 (Model):</label>
                <input type="text" id="ai-dm-model" style="width:100%; padding:5px; margin-top:4px; background:#333; color:#fff; border:1px solid #555; box-sizing:border-box;">
            </div>

            <div style="font-size:12px; margin-bottom:10px;">
                <label>判断提示词 (System Prompt):</label>
                <textarea id="ai-dm-prompt" rows="3" style="width:100%; padding:5px; margin-top:4px; background:#333; color:#fff; border:1px solid #555; box-sizing:border-box; font-family:monospace;"></textarea>
            </div>

             <div style="font-size:12px; margin-bottom:15px; display:flex; align-items:center;">
                <input type="checkbox" id="ai-dm-show-btn" style="margin-right:5px;">
                <label for="ai-dm-show-btn">显示页面右下角悬浮按钮</label>
            </div>

            <button id="ai-dm-save" style="width:100%; padding:8px; background:#00a1d6; border:none; color:white; cursor:pointer; border-radius:4px; font-weight:bold;">💾 保存配置</button>
        </div>

        <button id="ai-dm-toggle-btn" style="display:none; position:fixed; bottom:20px; right:20px; z-index:99998; background:#00a1d6; color:white; border:none; padding:8px 12px; border-radius:20px; cursor:pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: transform 0.2s;">
            AI 🛡️
        </button>
    `;

    function initUI() {
        if(document.getElementById('ai-dm-settings')) return;
        const div = document.createElement('div');
        div.innerHTML = UI_HTML;
        document.body.appendChild(div);

        const panel = document.getElementById('ai-dm-settings');
        const btn = document.getElementById('ai-dm-toggle-btn');
        const closeBtn = document.getElementById('ai-dm-close');
        const saveBtn = document.getElementById('ai-dm-save');

        document.getElementById('ai-dm-provider').value = config.provider;
        document.getElementById('ai-dm-url').value = config.apiUrl;
        document.getElementById('ai-dm-key').value = config.apiKey;
        document.getElementById('ai-dm-model').value = config.model;
        document.getElementById('ai-dm-prompt').value = config.prompt;
        document.getElementById('ai-dm-show-btn').checked = config.showButton;

        if (config.showButton) btn.style.display = 'block';

        btn.onclick = () => panel.style.display = 'block';
        closeBtn.onclick = () => panel.style.display = 'none';

        document.getElementById('ai-dm-provider').onchange = (e) => {
            const urlInput = document.getElementById('ai-dm-url');
            if (e.target.value === 'ollama' && urlInput.value.includes('openai')) {
                urlInput.value = 'http://localhost:11434/api/chat';
            } else if (e.target.value === 'openai' && urlInput.value.includes('localhost')) {
                urlInput.value = 'https://api.openai.com/v1/chat/completions';
            }
        };

        saveBtn.onclick = () => {
            config.provider = document.getElementById('ai-dm-provider').value;
            config.apiUrl = document.getElementById('ai-dm-url').value;
            config.apiKey = document.getElementById('ai-dm-key').value;
            config.model = document.getElementById('ai-dm-model').value;
            config.prompt = document.getElementById('ai-dm-prompt').value;
            config.showButton = document.getElementById('ai-dm-show-btn').checked;

            GM_setValue('ai_dm_config', config);
            btn.style.display = config.showButton ? 'block' : 'none';
            danmakuCache.clear();
            log('INFO', '配置已保存，缓存已清空');
            panel.style.display = 'none';
        };
    }

    // --- AI 核心逻辑 ---
    let pendingRequests = 0;
    const MAX_CONCURRENT = 50;

    function checkDanmakuWithAI(rawText) {
        return new Promise((resolve) => {
            const text = rawText.replace(/\s+/g, ''); // 预处理：去空格

            if (!text) {
                resolve(true);
                return;
            }

            if (danmakuCache.has(text)) {
                const passed = danmakuCache.get(text);
                // 命中缓存时不需要重复打印日志，除非你想调试
                if (!passed) log('BLOCK', `缓存拦截: ${text}`);
                resolve(passed);
                return;
            }

            if (pendingRequests >= MAX_CONCURRENT) {
                log('PASS', `限流保护: ${text}`);
                resolve(true);
                return;
            }

            pendingRequests++;
            const headers = { "Content-Type": "application/json" };
            if (config.provider === 'openai') {
                headers["Authorization"] = `Bearer ${config.apiKey}`;
            }

            const data = {
                model: config.model,
                messages: [
                    { role: "system", content: config.prompt },
                    { role: "user", content: text }
                ],
                stream: false,
                temperature: 0.1
            };

            GM_xmlhttpRequest({
                method: "POST",
                url: config.apiUrl,
                headers: headers,
                data: JSON.stringify(data),
                onload: function (response) {
                    pendingRequests--;
                    try {
                        if (response.status !== 200) {
                            log('ERR', `API Error ${response.status}`);
                            resolve(true);
                            return;
                        }

                        const json = JSON.parse(response.responseText);
                        let aiReply = "";
                        if (json.choices && json.choices[0]?.message) {
                            aiReply = json.choices[0].message.content.trim();
                        } else if (json.message?.content) {
                            aiReply = json.message.content.trim();
                        }

                        const isBlock = aiReply.toUpperCase().includes("BLOCK");
                        const passed = !isBlock;

                        if (danmakuCache.size > CACHE_LIMIT) danmakuCache.delete(danmakuCache.keys().next().value);
                        danmakuCache.set(text, passed);

                        if (!passed) log('BLOCK', `${text}`, `AI回复: ${aiReply}`);
                        else log('PASS', `${text}`);

                        resolve(passed);
                    } catch (e) {
                        pendingRequests--;
                        resolve(true);
                    }
                },
                onerror: function (err) {
                    pendingRequests--;
                    resolve(true);
                }
            });
        });
    }

    // --- DOM 操作 (修改版) ---

    function processNode(node) {
        // 必须是元素节点
        if (node.nodeType !== 1) return;

        // 获取文本内容
        let rawText = node.innerText || node.textContent || "";
        if (!rawText.trim()) return;

        // 性能优化：如果该节点当前显示的文本已经检查过且通过，则跳过
        // 我们在节点上挂载一个自定义属性来记录上次检查的文本
        if (node.dataset.aiCheckedText === rawText) {
            return;
        }

        // 暂时隐藏 (使用 visibility 保持占位，或 opacity)
        // 注意：不要使用 display:none，这可能会导致B站计算弹幕位置错误
        node.style.visibility = 'hidden';

        checkDanmakuWithAI(rawText).then(allow => {
            // 记录当前检查通过的文本，防止重复检查
            node.dataset.aiCheckedText = rawText;

            if (allow) {
                node.style.visibility = 'visible';
                node.style.border = ''; // 清除可能残留的标记
            } else {
                // 核心修改：不 remove，而是隐藏。这样 DOM 结构还在，下次变动还能被检测。
                node.style.visibility = 'hidden';
                // 可选：给被屏蔽的弹幕加个标记方便调试
                // node.style.border = '1px solid red';
            }
        });
    }

    function handleMutations(mutations) {
        for (const mutation of mutations) {
            // 情况1: 新增的节点 (Added Nodes)
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.classList.contains('bili-danmaku-x-dm')) {
                            processNode(node);
                        } else if (node.querySelectorAll) {
                            const children = node.querySelectorAll('.bili-danmaku-x-dm');
                            children.forEach(processNode);
                        }
                    }
                }

                // 补充情况1.1: 现有节点的文本节点被替换 (例如 .innerText = "new")
                // 此时 target 是弹幕元素本身
                 if (mutation.target.nodeType === 1 &&
                     mutation.target.classList.contains('bili-danmaku-x-dm')) {
                     processNode(mutation.target);
                 }
            }

            // 情况2: 文本内容变化 (CharacterData)
            // 当文本节点的内容发生变化时，target 是文本节点，parentElement 是弹幕元素
            if (mutation.type === 'characterData') {
                const textNode = mutation.target;
                const parent = textNode.parentElement;
                if (parent && parent.nodeType === 1 && parent.classList.contains('bili-danmaku-x-dm')) {
                    processNode(parent);
                }
            }
        }
    }

    // --- 初始化 ---
    function start() {
        // 寻找弹幕容器 (通常是 .bpx-player-render-dm-wrap 或 .bilibili-player-video-danmaku)
        // 这里使用较为通用的选择器策略
        const container = document.querySelector('.bpx-player-render-dm-wrap') ||
                          document.querySelector('.bilibili-player-video-danmaku');

        if (!container) {
            // 如果还没加载出来，稍后重试
            setTimeout(start, 1000);
            return;
        }

        log('INFO', 'AI 弹幕监控器已启动 (支持动态变化)', container);

        if (observer) observer.disconnect();
        observer = new MutationObserver(handleMutations);

        // 核心修改：开启 characterData 和 subtree 以监听深层文本变化
        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true // 监听文本内容变动
        });
    }

    // 等待播放器框架加载
    const timer = setInterval(() => {
        if (document.querySelector('.bpx-player-video-wrap') || document.querySelector('video')) {
            clearInterval(timer);
            setTimeout(() => {
                initUI();
                start();
            }, 2000);
        }
    }, 1000);

})();