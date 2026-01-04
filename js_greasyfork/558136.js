// ==UserScript==
// @name         Twitter Reader
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  v1.6内核 + 强力渲染 + 划词弹窗 + 强力TTS + 句首翻译按钮 + 句末分析按钮 + 菜单回显最近分析 + 移动端防滚动修复
// @author       MoodHappy
// @match        https://twitter.com/*
// @match        https://x.com/*
// @connect      *
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558136/Twitter%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/558136/Twitter%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置与常量 ---
    const SETTINGS_KEY_PREFIX = 'twitter_ai_reader_config_';
    const CACHE_PREFIX = 'twitter_ai_cache_v2_';
    const LAST_ANALYSIS_KEY = 'twitter_ai_last_session_data'; // 新增：保存最后一次分析的 Key
    
    const DEFAULT_CONFIG = {
        apiUrl: "https://api.moonshot.cn/v1/chat/completions",
        apiKey: "",
        modelName: "moonshot-v1-8k",
        systemPrompt: `你是一位精通中英文的语言专家。请分析我提供的句子：
1. 判断难度等级 (A1-C2)。
2. 提供准确、优美的中文翻译。
3. 句中关键短语及例句、例句翻译。
请使用 Markdown 格式输出。`
    };

    function getConfig() {
        return {
            apiUrl: GM_getValue(SETTINGS_KEY_PREFIX + 'apiUrl', DEFAULT_CONFIG.apiUrl),
            apiKey: GM_getValue(SETTINGS_KEY_PREFIX + 'apiKey', DEFAULT_CONFIG.apiKey),
            modelName: GM_getValue(SETTINGS_KEY_PREFIX + 'modelName', DEFAULT_CONFIG.modelName),
            systemPrompt: GM_getValue(SETTINGS_KEY_PREFIX + 'systemPrompt', DEFAULT_CONFIG.systemPrompt)
        };
    }

    function saveConfig(config) {
        GM_setValue(SETTINGS_KEY_PREFIX + 'apiUrl', config.apiUrl);
        GM_setValue(SETTINGS_KEY_PREFIX + 'apiKey', config.apiKey);
        GM_setValue(SETTINGS_KEY_PREFIX + 'modelName', config.modelName);
        GM_setValue(SETTINGS_KEY_PREFIX + 'systemPrompt', config.systemPrompt);
    }

    // --- 2. 强力原生 Markdown 渲染引擎 ---
    function enhancedMarkdownParse(text) {
        if (!text) return '';
        let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html = html.replace(/^\s*---\s*$/gim, '<hr class="ai-hr">');
        html = html.replace(/^######\s+(.*$)/gim, '<h6>$1</h6>');
        html = html.replace(/^#####\s+(.*$)/gim, '<h5>$1</h5>');
        html = html.replace(/^####\s+(.*$)/gim, '<h4>$1</h4>');
        html = html.replace(/^###\s+(.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^##\s+(.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^#\s+(.*$)/gim, '<h1>$1</h1>');
        html = html.replace(/^\s*>\s+(.*$)/gim, '<blockquote>$1</blockquote>');
        html = html.replace(/^\s*[\*\-\+]\s+(.*$)/gim, '<div class="ai-list-item">$1</div>');
        html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<div class="ai-list-item ai-ordered">$1</div>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    // --- 3. 样式注入 ---
    const tippyStyles = `
        .tippy-box[data-animation=shift-away][data-state=hidden]{opacity:0}.tippy-box[data-animation=shift-away][data-state=visible]{opacity:1}.tippy-box[data-theme~=light-border]{background-color:#fff;color:#333;box-shadow:0 0 10px 4px rgba(0,0,0,.1);border:1px solid rgba(0,0,0,.1)}.tippy-box[data-theme~=light-border] .tippy-arrow{color:#fff}
    `;

    const styles = `
        ${tippyStyles}

        :root {
            --ai-bg-color: #fff;
            --ai-text-color: #222;
            --ai-modal-bg: rgba(0,0,0,0.6);
            --ai-content-bg: #fff;
            --ai-border-color: #eee;
            --ai-btn-color: #8b7355;
            --ai-tts-btn-color: #1d9bf0;
            --ai-trans-btn-color: #666;
            --ai-accent-color: #1d9bf0;
            --ai-quote-bg: #f7f9f9;
            --ai-code-bg: #f4f4f4;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --ai-bg-color: #1e1e1e;
                --ai-text-color: #e0e0e0;
                --ai-content-bg: #15202b;
                --ai-border-color: #38444d;
                --ai-btn-color: #ccc;
                --ai-tts-btn-color: #1d9bf0;
                --ai-trans-btn-color: #aaa;
                --ai-quote-bg: #1c2732;
                --ai-code-bg: #22303c;
            }
        }
        
        body.ai-scroll-locked { overflow: hidden !important; }
        
        /* 单词交互 */
        .anki-word { cursor: pointer; transition: all 0.2s ease; padding: 0 1px; border-radius: 3px; border-bottom: 1px dotted transparent; }
        .anki-word:hover, .anki-word[aria-expanded="true"] { background-color: #E3F2FD; border-bottom: 2px solid #2196F3; color: #1565C0 !important; }

        /* 查词弹窗 */
        .dict-popup { text-align: left; font-size: 14px; line-height: 1.4; max-width: 280px; color: #333; padding: 2px; font-family: sans-serif; }
        .dict-header-row { border-bottom: 1px solid #eee; padding-bottom: 6px; margin-bottom: 6px; }
        .dict-word-line { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .dict-head-word { font-weight: bold; color: #D32F2F; font-size: 18px; }
        .dict-ipa { font-family: "Lucida Sans Unicode", "Arial Unicode MS", sans-serif; color: #666; font-size: 13px; background: #f0f0f0; padding: 0 4px; border-radius: 4px; }
        .dict-speaker-btn { display: inline-flex; cursor: pointer; color: #1976D2; padding: 2px; border-radius: 50%; transition: background 0.2s; }
        .dict-speaker-btn:hover { background-color: rgba(25, 118, 210, 0.1); }
        .dict-speaker-btn.playing { color: #E91E63; animation: pulse 1s infinite; }
        .dict-speaker-btn svg { width: 16px; height: 16px; pointer-events: none; } 
        .dict-basic-trans { font-size: 14px; color: #444; }
        .dict-pos-block { margin-bottom: 4px; }
        .dict-pos-tag { font-style: italic; color: #1976D2; font-weight: bold; font-size: 12px; margin-right: 4px; }
        .dict-def-list { margin: 0; padding: 0; list-style: none; display: inline; }
        .dict-def-item { display: inline; }
        .dict-def-item::after { content: "; "; color: #999; }
        .dict-def-item:last-child::after { content: ""; }
        .dict-loading { color: #666; font-style: italic; font-size: 12px; display: flex; align-items: center; gap: 5px;}

        /* 原文区域样式 */
        .ai-original-box {
            background: rgba(128,128,128, 0.1); padding: 12px 18px; margin: 0;
            border-left: 3px solid var(--ai-accent-color); font-style: italic; font-size: 14px;
            max-height: 100px; overflow-y: auto; flex-shrink: 0;
            display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;
        }
        .ai-original-text-content { flex: 1; }
        .ai-original-play-btn {
            display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%;
            cursor: pointer; color: var(--ai-accent-color); background: rgba(29, 155, 240, 0.1); transition: all 0.2s; flex-shrink: 0;
        }
        .ai-original-play-btn:hover { background: rgba(29, 155, 240, 0.2); transform: scale(1.1); }
        .ai-original-play-btn.playing { color: #E91E63; animation: pulse 1s infinite; background: rgba(233, 30, 99, 0.1); }
        .ai-original-play-btn svg { width: 14px; height: 14px; fill: currentColor; }

        /* 按钮通用样式 */
        .ai-inline-btn {
            display: inline-flex; align-items: center; justify-content: center;
            border-radius: 50%; width: 18px; height: 18px; 
            cursor: pointer; vertical-align: text-bottom;
            font-size: 0; transition: all 0.2s; position: relative;
        }
        .ai-inline-btn:hover { transform: scale(1.15); }
        .ai-inline-btn svg { width: 10px; height: 10px; fill: currentColor; }
        .ai-inline-btn.loading { animation: spin 1s linear infinite; border-color: transparent !important; border-top-color: currentColor !important; }

        /* 1. AI 分析按钮 (句末) */
        .ai-analyze-btn {
            margin: 0 0 0 5px; 
            background-color: rgba(139, 115, 85, 0.15); 
            border: 1px solid rgba(139, 115, 85, 0.3);
            color: var(--ai-btn-color); 
        }
        .ai-analyze-btn:hover { background-color: rgba(139, 115, 85, 0.25); }

        /* 2. TTS 朗读按钮 (句末) */
        .ai-tts-btn {
            margin: 0 0 0 5px; 
            background-color: rgba(29, 155, 240, 0.15);
            border: 1px solid rgba(29, 155, 240, 0.3);
            color: var(--ai-tts-btn-color);
        }
        .ai-tts-btn:hover { background-color: rgba(29, 155, 240, 0.25); }
        .ai-tts-btn.playing { color: #E91E63; border-color: #E91E63; animation: pulse 1s infinite; background-color: rgba(233, 30, 99, 0.1); }

        /* 3. 翻译按钮 (句首) */
        .ai-trans-btn {
            margin: 0 5px 0 0; 
            background-color: rgba(128, 128, 128, 0.15);
            border: 1px solid rgba(128, 128, 128, 0.3);
            color: var(--ai-trans-btn-color);
        }
        .ai-trans-btn:hover { background-color: rgba(128, 128, 128, 0.25); color: #333; }
        .ai-trans-btn svg { width: 11px; height: 11px; }

        /* 行内翻译结果容器 */
        .ai-translation-block {
            display: block;
            margin-top: 10px;
            padding: 10px 14px;
            background-color: var(--ai-quote-bg);
            border-left: 3px solid #999;
            color: var(--ai-text-color);
            font-size: 15px;
            line-height: 1.5;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

        /* 弹窗部分 */
        .ai-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--ai-modal-bg); display: none; justify-content: center; align-items: center; z-index: 9999; backdrop-filter: blur(2px); }
        .ai-modal-content { background: var(--ai-content-bg); color: var(--ai-text-color); border-radius: 12px; width: 90%; max-width: 500px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.3); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 16px; user-select: text; }
        .ai-modal-header { padding: 15px 20px; border-bottom: 1px solid var(--ai-border-color); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .ai-modal-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
        .ai-close-btn { cursor: pointer; font-size: 20px; opacity: 0.6; padding: 5px; }
        .ai-modal-body { padding: 20px; overflow-y: auto; flex: 1; line-height: 1.6; word-wrap: break-word; }
        
        .ai-modal-body h1, .ai-modal-body h2, .ai-modal-body h3, .ai-modal-body h4 { color: var(--ai-text-color); font-weight: 700; margin-top: 1.2em; margin-bottom: 0.6em; line-height: 1.3; }
        .ai-modal-body h3, .ai-modal-body h4 { font-size: 1.1em; color: var(--ai-accent-color); border-bottom: 1px dashed var(--ai-border-color); padding-bottom: 5px; }
        .ai-list-item { position: relative; padding-left: 15px; margin-bottom: 6px; }
        .ai-list-item::before { content: "•"; position: absolute; left: 0; color: var(--ai-accent-color); font-weight: bold; }
        .ai-modal-body strong { color: var(--ai-accent-color); background: rgba(29, 155, 240, 0.1); padding: 0 4px; border-radius: 3px; font-weight: 600; }
        .ai-modal-body blockquote { margin: 10px 0; padding: 10px 15px; background: var(--ai-quote-bg); border-left: 3px solid #ccc; border-radius: 4px; color: rgba(128,128,128, 0.9); }
        .ai-modal-body code { font-family: monospace; background: var(--ai-code-bg); padding: 2px 5px; border-radius: 3px; font-size: 0.9em; }
        .ai-hr { border: 0; border-top: 1px solid var(--ai-border-color); margin: 15px 0; }

        .ai-form-group { margin-bottom: 15px; }
        .ai-form-group label { display: block; margin-bottom: 5px; font-size: 12px; opacity: 0.8; }
        .ai-form-group input, .ai-form-group textarea { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--ai-border-color); background: rgba(128,128,128,0.05); color: var(--ai-text-color); box-sizing: border-box; font-family: inherit; }
        #ai-cfg-prompt { resize: none; min-height: 80px; overflow: hidden; }
        .ai-btn-primary { background: #1d9bf0; color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; width: 100%; font-weight: bold; }

        @media (max-width: 600px) {
            .ai-modal { align-items: flex-end; }
            .ai-modal-content { width: 100%; max-width: 100%; border-radius: 20px 20px 0 0; max-height: 85vh; margin: 0; }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    `;
    GM_addStyle(styles);

    // --- 4. 工具函数 ---
    let savedScrollTop = 0;
    function toggleScrollLock(locked) {
        const body = document.body;
        if (locked) {
            savedScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            body.classList.add('ai-scroll-locked');
            body.style.position = 'fixed';
            body.style.top = `-${savedScrollTop}px`;
            body.style.width = '100%';
        } else {
            body.classList.remove('ai-scroll-locked');
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            window.scrollTo(0, savedScrollTop);
        }
    }

    // --- 5. 查词、翻译与 TTS 引擎 ---
    async function fetchTranslation(text) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
        return new Promise((resolve, reject) => {
             GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: (res) => { if(res.status === 200) resolve(JSON.parse(res.responseText)); else reject(); },
                onerror: reject
            });
        });
    }

    async function fetchPhonetics(text) {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`;
        return new Promise((resolve) => {
             GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data && data.length > 0) {
                            const phoneticObj = data[0].phonetics.find(p => p.text) || data[0];
                            resolve(phoneticObj.text || null);
                        } else resolve(null);
                    } catch(e) { resolve(null); }
                },
                onerror: () => resolve(null)
            });
        });
    }

    function playAudio(text, btnElement) {
        if (!text) return;
        if (btnElement) btnElement.classList.add('playing');

        const voice = "en-US-EricNeural"; 
        const apis = [
            { url: "https://ms-ra-forwarder-for-ifreetime-2.vercel.app/api/aiyue", type: "ms-ra" },
            { url: "https://libre-tts-nu.vercel.app/api/tts", type: "libre" },
            { url: "https://dict.youdao.com/dictvoice", type: "youdao" }
        ];

        let apiIndex = 0;
        function tryNextApi() {
            if (apiIndex >= apis.length) {
                if (btnElement) btnElement.classList.remove('playing');
                return;
            }
            const api = apis[apiIndex];
            let targetUrl = '';
            if (api.type === "ms-ra") {
                const params = new URLSearchParams({ text: text, voiceName: voice, speed: 0 });
                targetUrl = `${api.url}?${params.toString()}`;
            } else if (api.type === "libre") {
                const params = new URLSearchParams({ t: text, v: voice, r: 0, p: 0 });
                targetUrl = `${api.url}?${params.toString()}`;
            } else {
                targetUrl = `${api.url}?audio=${encodeURIComponent(text)}&type=2`;
            }

            GM_xmlhttpRequest({
                method: "GET", url: targetUrl, responseType: "blob", 
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const blobUrl = URL.createObjectURL(blob);
                        let existingAudio = document.getElementById('ai-reader-audio');
                        if (existingAudio) { existingAudio.pause(); existingAudio.remove(); }
                        const audio = new Audio(blobUrl);
                        audio.id = 'ai-reader-audio';
                        audio.onended = () => { if (btnElement) btnElement.classList.remove('playing'); URL.revokeObjectURL(blobUrl); };
                        audio.onerror = () => { URL.revokeObjectURL(blobUrl); apiIndex++; tryNextApi(); };
                        audio.play().catch(e => { apiIndex++; tryNextApi(); });
                    } else { apiIndex++; tryNextApi(); }
                },
                onerror: function() { apiIndex++; tryNextApi(); }
            });
        }
        tryNextApi();
    }

    function formatDictData(originalWord, transData, ipaText) {
        let html = `<div class="dict-popup">`;
        const basicTrans = transData[0] && transData[0][0] ? transData[0][0][0] : '';
        html += `<div class="dict-header-row">
                    <div class="dict-word-line">
                        <span class="dict-head-word">${originalWord}</span>
                        ${ipaText ? `<span class="dict-ipa">${ipaText}</span>` : ''}
                        <span class="dict-speaker-btn" data-word="${originalWord}" title="Pronounce">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                        </span>
                    </div>
                    <div class="dict-basic-trans">${basicTrans}</div>
                 </div>`;
        const dictEntries = transData[1];
        if (dictEntries && dictEntries.length > 0) {
            html += `<div class="dict-details">`;
            dictEntries.forEach(entry => {
                html += `<div class="dict-pos-block">
                            <span class="dict-pos-tag">${entry[0]}.</span>
                            <ul class="dict-def-list">`;
                entry[1].slice(0, 3).forEach(def => { html += `<li class="dict-def-item">${def}</li>`; });
                html += `</ul></div>`;
            });
            html += `</div>`;
        } else { if(!basicTrans) html += `<div style="padding:5px">No definition found.</div>`; }
        html += `</div>`;
        return html;
    }

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.dict-speaker-btn');
        if (btn) {
            e.stopPropagation();
            const word = btn.getAttribute('data-word');
            if (word) playAudio(word, btn);
        }
    }, true);

    function initDictionary(container) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        const nodesToProcess = [];
        while(walker.nextNode()) {
            const node = walker.currentNode;
            if (node.parentElement && (node.parentElement.tagName === 'CODE' || node.parentElement.tagName === 'A')) continue;
            if (node.nodeValue.trim().length > 0) nodesToProcess.push(node);
        }
        nodesToProcess.forEach(node => {
            const text = node.nodeValue;
            if (/[a-zA-Z]/.test(text)) {
                const fragment = document.createDocumentFragment();
                const parts = text.split(/([a-zA-Z][a-zA-Z'-]*)/g);
                parts.forEach(part => {
                    if (/^[a-zA-Z][a-zA-Z'-]*$/.test(part)) {
                        const span = document.createElement('span');
                        span.className = 'anki-word';
                        span.textContent = part;
                        fragment.appendChild(span);
                    } else { fragment.appendChild(document.createTextNode(part)); }
                });
                node.parentNode.replaceChild(fragment, node);
            }
        });
        if (window.tippy) {
            tippy('.anki-word', {
                trigger: 'click', interactive: true, theme: 'light-border', placement: 'bottom', animation: 'shift-away',
                appendTo: document.getElementById('ai-reader-modal') || document.body,
                allowHTML: true, maxWidth: 300, zIndex: 10000,
                onShow(instance) {
                    const word = instance.reference.innerText.trim();
                    instance.setContent('<div class="dict-popup"><span class="dict-loading">🔍 Analyzing...</span></div>');
                    Promise.all([fetchTranslation(word).catch(e => [[['Error']]]), fetchPhonetics(word)]).then(([transData, ipaText]) => {
                        instance.setContent(formatDictData(word, transData, ipaText));
                    });
                }
            });
        }
    }

    // --- 6. UI 构建 ---
    function autoResizeTextarea(el) { el.style.height = 'auto'; el.style.height = (el.scrollHeight) + 'px'; }
    function createModals() {
        if (document.getElementById('ai-reader-modal')) return;

        const resultModalHtml = `
            <div id="ai-reader-modal" class="ai-modal">
                <div class="ai-modal-content">
                    <div class="ai-modal-header">
                        <h3>🧠 AI 深度分析</h3>
                    </div>
                    <div id="ai-original-text" class="ai-original-box"></div>
                    <div id="ai-result-body" class="ai-modal-body"></div>
                    <div style="font-size:12px; text-align:center; color:#888; padding-bottom:10px; opacity:0.6;">点击单词查词 / 双击任意区域关闭</div>
                </div>
            </div>
        `;

        const settingsModalHtml = `
            <div id="ai-settings-modal" class="ai-modal">
                <div class="ai-modal-content">
                    <div class="ai-modal-header">
                        <h3>⚙️ AI 设置</h3>
                        <span class="ai-close-btn" id="ai-settings-close">×</span>
                    </div>
                    <div class="ai-modal-body">
                        <div class="ai-form-group">
                            <label>API URL</label> <input type="text" id="ai-cfg-url">
                        </div>
                        <div class="ai-form-group">
                            <label>API Key</label> <input type="password" id="ai-cfg-key">
                        </div>
                        <div class="ai-form-group">
                            <label>模型名称 (Model Name)</label> <input type="text" id="ai-cfg-model">
                        </div>
                        <div class="ai-form-group">
                            <label>分析指令 (System Prompt)</label> <textarea id="ai-cfg-prompt" rows="3"></textarea>
                        </div>
                        <button id="ai-save-btn" class="ai-btn-primary">保存设置</button>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = resultModalHtml + settingsModalHtml;
        document.body.appendChild(div);

        document.getElementById('ai-save-btn').addEventListener('click', () => {
            saveConfig({
                apiUrl: document.getElementById('ai-cfg-url').value.trim(),
                apiKey: document.getElementById('ai-cfg-key').value.trim(),
                modelName: document.getElementById('ai-cfg-model').value.trim(),
                systemPrompt: document.getElementById('ai-cfg-prompt').value.trim()
            });
            alert('✅ 设置已保存');
            document.getElementById('ai-settings-modal').style.display = 'none';
            toggleScrollLock(false);
        });

        document.getElementById('ai-settings-close').addEventListener('click', () => { document.getElementById('ai-settings-modal').style.display = 'none'; toggleScrollLock(false); });
        document.getElementById('ai-cfg-prompt').addEventListener('input', function() { autoResizeTextarea(this); });
        
        window.addEventListener('click', (e) => {
            if (e.target.id === 'ai-reader-modal') { e.target.style.display = 'none'; toggleScrollLock(false); }
            if (e.target.id === 'ai-settings-modal') { e.target.style.display = 'none'; toggleScrollLock(false); }
        });
        document.getElementById('ai-reader-modal').addEventListener('dblclick', (e) => {
            if (window.getSelection().toString().length > 0) return;
            if (e.target.closest('.tippy-box')) return;
            document.getElementById('ai-reader-modal').style.display = 'none';
            toggleScrollLock(false);
        });
    }

    function openSettings() {
        createModals();
        const config = getConfig();
        document.getElementById('ai-cfg-url').value = config.apiUrl;
        document.getElementById('ai-cfg-key').value = config.apiKey;
        document.getElementById('ai-cfg-model').value = config.modelName;
        const promptInput = document.getElementById('ai-cfg-prompt');
        promptInput.value = config.systemPrompt;
        document.getElementById('ai-settings-modal').style.display = 'flex';
        toggleScrollLock(true);
        setTimeout(() => autoResizeTextarea(promptInput), 0);
    }

    // --- 7. 新增：恢复最近一次分析弹窗 ---
    function renderAnalysisModal(text, mdContent) {
        createModals();
        const modal = document.getElementById('ai-reader-modal');
        const resultBody = document.getElementById('ai-result-body');
        const originalTextBody = document.getElementById('ai-original-text');

        // 1. 渲染原文区
        originalTextBody.innerHTML = '';
        const textSpan = document.createElement('div');
        textSpan.className = 'ai-original-text-content';
        textSpan.innerText = text;
        
        const playBtn = document.createElement('div');
        playBtn.className = 'ai-original-play-btn';
        playBtn.title = '朗读原文';
        playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
        playBtn.onclick = (e) => { e.stopPropagation(); playAudio(text, playBtn); };

        originalTextBody.appendChild(textSpan);
        originalTextBody.appendChild(playBtn);

        // 2. 渲染结果区
        resultBody.innerHTML = enhancedMarkdownParse(mdContent);
        initDictionary(resultBody); // 绑定划词功能

        // 3. 显示
        modal.style.display = 'flex';
        toggleScrollLock(true);
    }

    function showLastAnalysis() {
        const lastData = localStorage.getItem(LAST_ANALYSIS_KEY);
        if (!lastData) {
            alert('⚠️ 暂无最近分析记录');
            return;
        }
        try {
            const { text, content } = JSON.parse(lastData);
            if (!text || !content) throw new Error('Invalid Data');
            renderAnalysisModal(text, content);
        } catch(e) {
            alert('❌ 记录已损坏，无法恢复');
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand("📂 显示最近一次分析", showLastAnalysis);
    GM_registerMenuCommand("⚙️ 设置 AI 阅读助手", openSettings);


    // --- 8. 核心逻辑 ---

    // 缓存 Key 生成
    function generateCacheKey(text, prompt) {
        let str = text + "|" + prompt;
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i) | 0;
        return CACHE_PREFIX + Math.abs(hash);
    }

    async function handleInlineTranslation(btn, textContainer, textToTranslate) {
        const config = getConfig();
        if (!config.apiKey) {
             if(confirm('尚未配置 API Key。是否现在去设置？')) openSettings();
             return;
        }

        let transBlock = textContainer.querySelector('.ai-translation-block');
        if (transBlock) {
            transBlock.style.display = transBlock.style.display === 'none' ? 'block' : 'none';
            return;
        }

        transBlock = document.createElement('div');
        transBlock.className = 'ai-translation-block';
        transBlock.innerHTML = '<span style="color:#999;font-style:italic;">⏳ 正在翻译...</span>';
        textContainer.appendChild(transBlock);
        
        btn.classList.add('loading');

        const translatePrompt = "You are a professional translator. Translate the following text into Chinese (Simplified) directly. Do not include any explanations, just the translated text.";
        const cacheKey = generateCacheKey(textToTranslate, "translate_only_v1");
        
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
             const data = JSON.parse(cached);
             transBlock.innerHTML = data.content;
             btn.classList.remove('loading');
             return;
        }

        try {
            const responseText = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: config.apiUrl,
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.apiKey}` },
                    data: JSON.stringify({
                        model: config.modelName,
                        messages: [
                            { role: "system", content: translatePrompt },
                            { role: "user", content: textToTranslate }
                        ],
                        temperature: 0.3
                    }),
                    onload: (res) => (res.status >= 200 && res.status < 300) ? resolve(res.responseText) : reject(new Error(res.status)),
                    onerror: () => reject(new Error("Network Error"))
                });
            });

            const data = JSON.parse(responseText);
            const content = data.choices[0].message.content;
            transBlock.innerHTML = content.replace(/\n/g, '<br>');
            
            try { localStorage.setItem(cacheKey, JSON.stringify({ content: transBlock.innerHTML })); } catch(e) {}

        } catch (error) {
            transBlock.innerHTML = `<span style="color:red">❌ 翻译失败</span>`;
            console.error(error);
        } finally {
            btn.classList.remove('loading');
        }
    }

    async function handleAnalysis(btn, textToAnalyze) {
        const config = getConfig();
        if (!config.apiKey) {
            if(confirm('尚未配置 API Key。是否现在去设置？')) openSettings();
            return;
        }

        createModals();
        const modal = document.getElementById('ai-reader-modal');
        const resultBody = document.getElementById('ai-result-body');
        const originalTextBody = document.getElementById('ai-original-text');

        // 显示 Loading 状态
        originalTextBody.innerHTML = ''; 
        originalTextBody.innerText = textToAnalyze; // 简略显示原文
        resultBody.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">⏳ 正在连接 AI 大脑进行分析...</div>';
        modal.style.display = 'flex';
        toggleScrollLock(true);
        btn.classList.add('loading');

        const cacheKey = generateCacheKey(textToAnalyze, config.systemPrompt);
        const cached = localStorage.getItem(cacheKey);
        
        const onSuccess = (mdContent) => {
            renderAnalysisModal(textToAnalyze, mdContent);
            btn.classList.remove('loading');
            // 保存到“最近一次分析”
            localStorage.setItem(LAST_ANALYSIS_KEY, JSON.stringify({ text: textToAnalyze, content: mdContent }));
        };

        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < 86400000) { onSuccess(data.content); return; }
        }

        try {
            const responseText = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url: config.apiUrl,
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.apiKey}` },
                    data: JSON.stringify({
                        model: config.modelName,
                        messages: [
                            { role: "system", content: config.systemPrompt },
                            { role: "user", content: `请分析这段文本:\n"${textToAnalyze}"` }
                        ],
                        temperature: 0.7
                    }),
                    onload: (res) => (res.status >= 200 && res.status < 300) ? resolve(res.responseText) : reject(new Error(res.responseText)),
                    onerror: () => reject(new Error("Network Error"))
                });
            });

            const data = JSON.parse(responseText);
            const content = data.choices[0].message.content;
            
            try { localStorage.setItem(cacheKey, JSON.stringify({ content: content, timestamp: Date.now() })); } catch(e) {}
            onSuccess(content);

        } catch (error) {
            resultBody.innerHTML = `<p style="color:red;">❌ 分析失败: ${error.message}</p>`;
            btn.classList.remove('loading');
        }
    }

    function processTweetText(element) {
        if (element.getAttribute('data-ai-processed') === 'true') return;
        if (element.innerText.trim().length < 2) return;

        // 1. 创建行内翻译按钮 (句首)
        const transBtn = document.createElement('span');
        transBtn.className = 'ai-inline-btn ai-trans-btn';
        transBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>';
        transBtn.title = "AI 翻译此句";
        
        transBtn.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault();
            const clone = element.cloneNode(true);
            clone.querySelectorAll('.ai-inline-btn').forEach(b => b.remove());
            handleInlineTranslation(transBtn, element, clone.innerText);
        });

        if (element.firstChild) {
            element.insertBefore(transBtn, element.firstChild);
        } else {
            element.appendChild(transBtn);
        }

        // 2. TTS 按钮
        const ttsBtn = document.createElement('span');
        ttsBtn.className = 'ai-inline-btn ai-tts-btn';
        ttsBtn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        ttsBtn.title = "朗读此句";
        ttsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault();
            const clone = element.cloneNode(true);
            clone.querySelectorAll('.ai-inline-btn').forEach(b => b.remove());
            playAudio(clone.innerText, ttsBtn);
        });

        // 3. 分析按钮
        const aiBtn = document.createElement('span');
        aiBtn.className = 'ai-inline-btn ai-analyze-btn';
        aiBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>';
        aiBtn.title = "AI 分析此句";
        aiBtn.addEventListener('click', (e) => {
            e.stopPropagation(); e.preventDefault();
            const clone = element.cloneNode(true);
            clone.querySelectorAll('.ai-inline-btn').forEach(b => b.remove());
            handleAnalysis(aiBtn, clone.innerText);
        });

        element.appendChild(ttsBtn); 
        element.appendChild(aiBtn);
        element.setAttribute('data-ai-processed', 'true');
    }

    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const tweetTexts = node.querySelectorAll ? node.querySelectorAll('[data-testid="tweetText"]') : [];
                        tweetTexts.forEach(processTweetText);
                        if (node.getAttribute && node.getAttribute('data-testid') === 'tweetText') {
                            processTweetText(node);
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
        document.querySelectorAll('[data-testid="tweetText"]').forEach(processTweetText);
    }

    window.addEventListener('load', () => { createModals(); initObserver(); });
    setTimeout(initObserver, 1500);

})();
