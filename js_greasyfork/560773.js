// ==UserScript==
// @name         SwipeSense Plus
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  移动端右滑英文段落，AI自动分析并添加中文短语注解 (使用 Shadow DOM 彻底屏蔽 Relingo 翻译干扰)
// @author       MoodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560773/SwipeSense%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/560773/SwipeSense%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        url: "https://api.chatanywhere.tech/v1/chat/completions",
        key: "",
        model: "gpt-5-nano-ca"
    };

    const CACHE_KEY = 'ai_annotation_cache';

    // ================= CSS 定义 =================

    // 1. 全局 CSS (用于配置面板) - 保持在主文档中
    GM_addStyle(`
        #ai-config-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 100000;
            display: flex; justify-content: center; align-items: center;
            backdrop-filter: blur(3px); opacity: 0; pointer-events: none;
            transition: opacity 0.2s;
        }
        #ai-config-modal.show { opacity: 1; pointer-events: auto; }
        .ai-config-card {
            background: white; width: 85%; max-width: 400px; padding: 20px;
            border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            font-family: sans-serif; position: relative;
        }
        .ai-config-card h3 { margin: 0 0 15px 0; color: #333; font-size: 18px; text-align: center; }
        .ai-form-group { margin-bottom: 12px; }
        .ai-form-group label { display: block; font-size: 12px; color: #666; margin-bottom: 4px; }
        .ai-form-group input {
            width: 100%; padding: 8px; box-sizing: border-box;
            border: 1px solid #ddd; border-radius: 6px; font-size: 14px; background: #f9f9f9;
        }
        .ai-btn-row { display: flex; gap: 10px; margin-top: 20px; }
        .ai-btn { flex: 1; padding: 10px; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; }
        .ai-btn-save { background: #0ea5e9; color: white; }
        .ai-btn-cancel { background: #e2e8f0; color: #333; }
        .ai-btn-clear { background: #ef4444; color: white; font-size: 12px; padding: 4px 8px; position: absolute; top: 20px; right: 20px; border-radius: 4px; cursor: pointer; border: none;}
    `);

    // 2. 隔离 CSS (用于 Shadow DOM 内部的笔记框)
    // 必须以字符串形式注入到 Shadow Root 里，否则样式不生效
    const SHADOW_CSS = `
        /* 基础容器 */
        :host {
            all: initial; /* 重置所有继承样式，防止页面 CSS 干扰 */
            display: block;
            font-family: sans-serif;
            font-size: 14px;
            margin: 8px 0 16px 0;
        }

        .ai-note-box {
            background-color: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            border-radius: 6px;
            line-height: 1.6;
            color: #334155;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            overflow: hidden;
            animation: fadeIn 0.3s ease-in-out;
        }

        .ai-note-main { padding: 12px; }
        .ai-note-loading { padding: 12px; color: #64748b; font-style: italic; font-size: 13px; display: flex; align-items: center; gap: 6px;}
        
        .ai-note-title { 
            font-weight: bold; color: #0369a1; margin-bottom: 6px; 
            font-size: 12px; text-transform: uppercase; display: flex; justify-content: space-between;
        }
        .ai-note-source { font-weight: normal; font-size: 10px; color: #94a3b8; }
        
        .ai-note-content ul { margin: 0; padding-left: 18px; }
        .ai-note-content li { margin-bottom: 5px; }
        
        /* 追问区域 */
        .ai-chat-section {
            background: #e0f2fe;
            border-top: 1px solid #bae6fd;
            padding: 10px;
        }
        .ai-chat-history { margin-bottom: 10px; font-size: 13px; display: flex; flex-direction: column; gap: 8px;}
        
        .ai-msg-user { align-self: flex-end; color: #555; font-size: 12px; max-width: 85%; }
        .ai-msg-user span {
            background: #fff; padding: 4px 8px; border-radius: 8px 8px 0 8px;
            display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        
        .ai-msg-ai { align-self: flex-start; color: #333; max-width: 95%; }
        .ai-msg-ai span {
            display: block; background: rgba(255,255,255,0.6);
            padding: 6px 8px; border-radius: 0 8px 8px 8px; border-left: 2px solid #0ea5e9;
        }
        
        .ai-input-wrapper { display: flex; gap: 6px; }
        .ai-chat-input {
            flex: 1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px;
            font-size: 13px; outline: none; background: white; color: #333;
        }
        .ai-chat-input:focus { border-color: #0ea5e9; }
        .ai-chat-btn {
            background: #0ea5e9; color: white; border: none; border-radius: 4px;
            padding: 0 12px; font-size: 13px; cursor: pointer;
        }
        .ai-chat-btn:disabled { background: #94a3b8; cursor: not-allowed; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
    `;

    // ================= 工具函数 =================
    function generateHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return "h" + Math.abs(hash);
    }

    // ================= UI 构建 (设置面板) =================
    function createUI() {
        const modal = document.createElement('div');
        modal.id = 'ai-config-modal';
        // 这里的 class="notranslate" 依然保留，防止设置面板本身被干扰
        modal.className = 'notranslate';
        modal.setAttribute('translate', 'no');
        
        modal.innerHTML = `
            <div class="ai-config-card">
                <h3>AI 配置</h3>
                <button id="ai-btn-clear-cache" class="ai-btn-clear">清除缓存</button>
                <div class="ai-form-group">
                    <label>API URL</label>
                    <input type="text" id="ai-input-url" placeholder="https://api.openai.com...">
                </div>
                <div class="ai-form-group">
                    <label>API Key</label>
                    <input type="password" id="ai-input-key" placeholder="sk-...">
                </div>
                <div class="ai-form-group">
                    <label>Model</label>
                    <input type="text" id="ai-input-model" placeholder="gpt-4o-mini">
                </div>
                <div class="ai-btn-row">
                    <button class="ai-btn ai-btn-cancel" id="ai-btn-close">取消</button>
                    <button class="ai-btn ai-btn-save" id="ai-btn-save">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('ai-btn-close').onclick = closeSettings;
        document.getElementById('ai-btn-save').onclick = saveSettings;
        document.getElementById('ai-btn-clear-cache').onclick = clearCache;
        modal.onclick = (e) => { if(e.target === modal) closeSettings(); };
    }

    function openSettings() {
        document.getElementById('ai-input-url').value = GM_getValue('url', DEFAULT_CONFIG.url);
        document.getElementById('ai-input-key').value = GM_getValue('key', DEFAULT_CONFIG.key);
        document.getElementById('ai-input-model').value = GM_getValue('model', DEFAULT_CONFIG.model);
        document.getElementById('ai-config-modal').classList.add('show');
    }

    function closeSettings() {
        document.getElementById('ai-config-modal').classList.remove('show');
    }

    function saveSettings() {
        const url = document.getElementById('ai-input-url').value.trim();
        const key = document.getElementById('ai-input-key').value.trim();
        const model = document.getElementById('ai-input-model').value.trim();
        if(!url || !key || !model) { alert("请完整填写所有信息！"); return; }
        GM_setValue('url', url); GM_setValue('key', key); GM_setValue('model', model);
        closeSettings(); GM_notification({ text: "设置已保存", timeout: 1500 });
    }

    function clearCache() {
        if(confirm('清除缓存？')) {
            GM_setValue(CACHE_KEY, {});
            GM_notification({ text: "缓存已清空", timeout: 1500 });
        }
    }

    createUI();
    GM_registerMenuCommand("⚙️ AI 配置设置", openSettings);


    // ================= 滑动交互逻辑 =================
    let touchStartX = 0, touchStartY = 0;
    const SWIPE_THRESHOLD = 80, Y_LIMIT = 60;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        handleSwipe(e.target, touchStartX, e.changedTouches[0].screenX, touchStartY, e.changedTouches[0].screenY);
    }, { passive: true });

    function handleSwipe(target, startX, endX, startY, endY) {
        if ((endX - startX) > SWIPE_THRESHOLD && Math.abs(endY - startY) < Y_LIMIT) {
            const paragraph = target.closest('p');
            if (paragraph && paragraph.textContent.trim().length > 20) {
                if (!GM_getValue('key')) { openSettings(); return; }
                toggleAnnotation(paragraph);
            }
        }
    }

    // ================= 注解逻辑 (Shadow DOM 核心) =================

    function toggleAnnotation(pElement) {
        // 1. 检查是否已经存在宿主元素
        const existingHost = pElement.nextElementSibling;
        if (existingHost && existingHost.tagName.toLowerCase() === 'ai-annotation-host') {
            existingHost.remove();
            return;
        }

        // 2. 创建自定义宿主元素 (Host)
        const host = document.createElement('ai-annotation-host');
        // 将宿主插入 DOM
        pElement.parentNode.insertBefore(host, pElement.nextSibling);

        // 3. 开启 Shadow Root (隔离层)
        const shadow = host.attachShadow({ mode: 'open' });

        // 4. 在 Shadow Root 内部注入样式和容器
        shadow.innerHTML = `<style>${SHADOW_CSS}</style><div class="ai-note-box"></div>`;
        const noteBox = shadow.querySelector('.ai-note-box');

        // 5. 数据处理逻辑
        const text = pElement.textContent.trim();
        const hash = generateHash(text);
        const cache = GM_getValue(CACHE_KEY, {});

        if (cache[hash]) {
            renderContent(shadow, noteBox, cache[hash], true, text);
        } else {
            noteBox.innerHTML = `<div class="ai-note-loading">⚡ AI 正在分析...</div>`;
            fetchAIExplanation(text, hash, (content) => {
                renderContent(shadow, noteBox, content, false, text);
            }, (err) => {
                noteBox.innerHTML = `<div class="ai-note-main" style="color:red">错误: ${err}</div>`;
            });
        }
    }

    // 渲染函数 (注意：事件绑定需要在 shadow root 范围内进行)
    function renderContent(shadowRoot, container, htmlContent, isCached, originalText) {
        const sourceBadge = isCached ? '<span class="ai-note-source">From Cache</span>' : '<span class="ai-note-source">From API</span>';
        
        container.innerHTML = `
            <div class="ai-note-main">
                <div class="ai-note-title"><span>📝 AI 笔记</span>${sourceBadge}</div>
                <div class="ai-note-content">${htmlContent}</div>
            </div>
            <div class="ai-chat-section">
                <div class="ai-chat-history"></div>
                <div class="ai-input-wrapper">
                    <input type="text" class="ai-chat-input" placeholder="追问...">
                    <button class="ai-chat-btn">发送</button>
                </div>
            </div>
        `;

        // 在 Shadow DOM 内部查找元素
        const input = container.querySelector('.ai-chat-input');
        const btn = container.querySelector('.ai-chat-btn');
        const historyDiv = container.querySelector('.ai-chat-history');

        const handleSend = () => {
            const question = input.value.trim();
            if(!question) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'ai-msg-user';
            userMsg.innerHTML = `<span>${question}</span>`;
            historyDiv.appendChild(userMsg);

            input.value = ''; input.disabled = true; btn.disabled = true; btn.textContent = '...';

            fetchFollowUp(originalText, question, (res) => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'ai-msg-ai';
                aiMsg.innerHTML = `<span>${res}</span>`;
                historyDiv.appendChild(aiMsg);
                input.disabled = false; btn.disabled = false; btn.textContent = '发送'; input.focus();
            });
        };

        btn.onclick = handleSend;
        input.onkeypress = (e) => { if(e.key === 'Enter') handleSend(); };
    }

    // ================= API 请求逻辑 =================
    
    function fetchAIExplanation(text, hash, onSuccess, onError) {
        const config = getConfig();
        const prompt = `Analyze this text. Identify 3-5 difficult idioms/words. Output HTML <ul><li><b>Word</b>: Chinese Meaning</li></ul>. Text: "${text}"`;
        
        callAI(config, [{ role: "user", content: prompt }], (content) => {
            // 写入缓存
            const cache = GM_getValue(CACHE_KEY, {});
            cache[hash] = content;
            GM_setValue(CACHE_KEY, cache);
            onSuccess(content);
        }, onError);
    }

    function fetchFollowUp(originalText, question, callback) {
        const config = getConfig();
        const prompt = `Context: "${originalText}". Question: "${question}". Answer briefly in Chinese.`;
        callAI(config, [{ role: "user", content: prompt }], callback, (err) => callback(`Error: ${err}`));
    }

    function callAI(config, messages, onSuccess, onError) {
        GM_xmlhttpRequest({
            method: "POST", url: config.url,
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.key}` },
            data: JSON.stringify({
                model: config.model,
                messages: [{ role: "system", content: "You are a helpful tutor." }, ...messages],
                temperature: 0.3
            }),
            onload: (res) => {
                if (res.status === 200) {
                    try {
                        let content = JSON.parse(res.responseText).choices[0].message.content;
                        onSuccess(content.replace(/```html|```/g, '').trim());
                    } catch(e) { onError("解析失败"); }
                } else { onError(`API Error ${res.status}`); }
            },
            onerror: () => onError("网络错误")
        });
    }

    function getConfig() {
        return {
            url: GM_getValue('url', DEFAULT_CONFIG.url),
            key: GM_getValue('key', ''),
            model: GM_getValue('model', DEFAULT_CONFIG.model)
        };
    }
})();
