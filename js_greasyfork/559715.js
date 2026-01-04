// ==UserScript==
// @name         ReadSense（Canary）
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  v6.6 代码重构：Twitter/X 模块深度集成 DeepRead 核心引擎，移除冗余弹窗逻辑，统一使用主界面进行分析；保留双仓库推送（HTML归档+MD笔记）与多AI切换功能。
// @author       Hal
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @connect      api.groq.com
// @connect      api.moonshot.cn
// @connect      open.bigmodel.cn
// @connect      api.deepseek.com
// @connect      api.openai.com
// @connect      api.github.com
// @connect      translate.googleapis.com
// @connect      api.dictionaryapi.dev
// @connect      dict.youdao.com
// @connect      libre-tts-nu.vercel.app
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.min.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559715/ReadSense%EF%BC%88Canary%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559715/ReadSense%EF%BC%88Canary%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // [0] 全局配置与默认值
    // =========================================================================
    const GLOBAL_CONFIG = {
        AI_TEMPLATES: {
            GROQ: { name: 'Groq', url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
            KIMI: { name: 'Kimi', url: 'https://api.moonshot.cn/v1/chat/completions', model: 'moonshot-v1-8k' },
            ZHIPU: { name: 'Zhipu', url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'GLM-4.5-Flash' },
            DEEPSEEK: { name: 'DeepSeek', url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
            OPENAI: { name: 'OpenAI', url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' }
        },
        XIAOBEI_CONFIG: {
            id: 'zh-CN-liaoning-XiaobeiNeural',
            api: "https://libre-tts-nu.vercel.app/api/tts",
            voice: "zh-CN-liaoning-XiaobeiNeural"
        },
        VOICES: {
            CN: [
                { id: 'zh-CN-XiaoxiaoNeural', name: '晓晓 (默认/温暖)' },
                { id: 'zh-CN-liaoning-XiaobeiNeural', name: '辽宁口音- 晓北(女)' },
                { id: 'zh-CN-YunxiNeural', name: '云希 (男声/稳重)' },
                { id: 'zh-CN-YunjianNeural', name: '云健 (男声/体育)' }
            ],
            EN: [
                { id: 'en-US-JennyNeural', name: 'Jenny (默认/亲切)' },
                { id: 'en-US-EricNeural', name: 'Eric (男声/通用)' },
                { id: 'en-US-GuyNeural', name: 'Guy (男声/新闻)' },
                { id: 'en-US-AnaNeural', name: 'Ana (女声/孩童)' },
                { id: 'en-US-ChristopherNeural', name: 'Christopher (男声/大师)' },
                { id: 'en-US-MichelleNeural', name: 'Michelle (女声/专业)' }
            ]
        }
    };

    // --- 核心工具：TTS 请求构建 ---
    function buildTTSRequest(serverUrl, text, voiceName, userToken) {
        if (!serverUrl) return null;
        const cleanUrl = serverUrl.replace(/\/$/, '');
        const isLibreType = cleanUrl.includes('/api/tts') || cleanUrl.includes('libre-tts');
        
        if (isLibreType) {
            const params = new URLSearchParams({ t: text, v: voiceName });
            return { url: `${cleanUrl}?${params.toString()}`, headers: {} };
        } else {
            const token = userToken && userToken.trim() !== '' ? userToken : "";
            const params = new URLSearchParams({ text: text, voiceName: voiceName, token: token, rate: '+0%', pitch: '0Hz' });
            let headers = {};
            if (cleanUrl.includes('vercel.app')) { headers = { "Referer": "https://read-aloud-123.vercel.app/" }; }
            return { url: `${cleanUrl}?${params.toString()}`, headers: headers };
        }
    }

    // --- 样式：字典弹窗 ---
    const DICT_SHADOW_CSS = `
        :host { all: initial; display: block; }
        .dict-popup { text-align: left; font-size: 14px; line-height: 1.4; max-width: 280px; color: #333; padding: 5px; font-family: sans-serif; background: #fff; }
        .dict-header-row { border-bottom: 1px solid #eee; padding-bottom: 6px; margin-bottom: 6px; }
        .dict-word-line { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .dict-head-word { font-weight: bold; color: #D32F2F; font-size: 18px; }
        .dict-ipa { font-family: "Lucida Sans Unicode", "Arial Unicode MS", sans-serif; color: #666; font-size: 13px; background: #f0f0f0; padding: 0 4px; border-radius: 4px; }
        .dict-speaker-btn { display: inline-flex; cursor: pointer; color: #1976D2; padding: 2px; border-radius: 50%; transition: background 0.2s; align-items: center; justify-content: center; }
        .dict-speaker-btn:hover { background-color: rgba(25, 118, 210, 0.1); }
        .dict-speaker-btn.playing { color: #E91E63; animation: pulse 1s infinite; }
        .dict-speaker-btn svg { width: 16px; height: 16px; pointer-events: none; }
        .dict-basic-trans { font-size: 14px; color: #444; margin-top: 4px;}
        .dict-details { margin-top: 8px; }
        .dict-pos-block { margin-bottom: 4px; }
        .dict-pos-tag { font-style: italic; color: #1976D2; font-weight: bold; font-size: 12px; margin-right: 4px; }
        .dict-def-list { margin: 0; padding: 0; list-style: none; display: inline; }
        .dict-def-item { display: inline; }
        .dict-def-item::after { content: "; "; color: #999; }
        .dict-def-item:last-child::after { content: ""; }
        .dict-loading { color: #666; font-style: italic; font-size: 12px; display: flex; align-items: center; gap: 5px;}
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
    `;

    // --- 共享字典帮助类 ---
    const DictHelper = {
        async fetchTranslation(text) {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url: url,
                    onload: (res) => { if (res.status === 200) resolve(JSON.parse(res.responseText)); else reject(); },
                    onerror: reject
                });
            });
        },
        async fetchPhonetics(text) {
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
                        } catch (e) { resolve(null); }
                    },
                    onerror: () => resolve(null)
                });
            });
        },
        playLocalTTS(text, onEndCallback, langHint) {
            if (!window.speechSynthesis) return false;
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            const isChinese = langHint === 'zh' || /[\u4e00-\u9fa5]/.test(text);
            u.lang = isChinese ? 'zh-CN' : 'en-US';
            u.rate = 1.0;
            u.onend = () => { if (onEndCallback) onEndCallback(); };
            u.onerror = () => { if (onEndCallback) onEndCallback(); };
            window.speechSynthesis.speak(u);
            return true;
        },
        playAudio(text, btnElement) {
            if (!text) return;
            if (btnElement) btnElement.classList.add('playing');
            const voice = GM_getValue('ttsVoiceEN', 'en-US-JennyNeural');
            window.TTSServiceInstance.play(text, false, () => {
                 if (btnElement) btnElement.classList.remove('playing');
            }, voice); 
        },
        formatDictData(originalWord, transData, ipaText) {
            let html = `<div class="dict-popup">`;
            const basicTrans = transData[0] && transData[0][0] ? transData[0][0][0] : '';
            html += `<div class="dict-header-row"><div class="dict-word-line"><span class="dict-head-word">${originalWord}</span>${ipaText ? `<span class="dict-ipa">${ipaText}</span>` : ''}<span class="dict-speaker-btn" data-word="${originalWord}" title="Pronounce"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span></div><div class="dict-basic-trans">${basicTrans}</div></div>`;
            const dictEntries = transData[1];
            if (dictEntries && dictEntries.length > 0) {
                html += `<div class="dict-details">`;
                dictEntries.forEach(entry => {
                    html += `<div class="dict-pos-block"><span class="dict-pos-tag">${entry[0]}.</span><ul class="dict-def-list">`;
                    entry[1].slice(0, 3).forEach(def => { html += `<li class="dict-def-item">${def}</li>`; });
                    html += `</ul></div>`;
                });
                html += `</div>`;
            } else { if (!basicTrans) html += `<div style="padding:5px">No definition found.</div>`; }
            html += `</div>`;
            return html;
        },
        initDictionary(container, parentModalId = null) {
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
            const nodesToProcess = [];
            while (walker.nextNode()) {
                const node = walker.currentNode;
                if (node.parentElement && (node.parentElement.tagName === 'CODE' || node.parentElement.tagName === 'A' || node.parentElement.tagName === 'BUTTON' || node.parentElement.className.includes('dict-'))) continue;
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
                            span.className = 'anki-word notranslate';
                            span.setAttribute('translate', 'no');
                            span.textContent = part;
                            fragment.appendChild(span);
                        } else {
                            fragment.appendChild(document.createTextNode(part));
                        }
                    });
                    node.parentNode.replaceChild(fragment, node);
                }
            });

            if (window.tippy) {
                tippy(container.querySelectorAll('.anki-word'), {
                    trigger: 'click',
                    interactive: true,
                    theme: 'light-border',
                    placement: 'bottom',
                    animation: 'shift-away',
                    appendTo: parentModalId ? (document.getElementById(parentModalId) || document.body) : document.body,
                    allowHTML: false,
                    maxWidth: 300,
                    zIndex: 100000,
                    onShow(instance) {
                        const word = instance.reference.innerText.trim();
                        const host = document.createElement('div');
                        const shadow = host.attachShadow({ mode: 'open' });
                        const style = document.createElement('style'); style.textContent = DICT_SHADOW_CSS; shadow.appendChild(style);
                        const contentContainer = document.createElement('div'); contentContainer.className = 'dict-popup'; contentContainer.innerHTML = '<span class="dict-loading">🔍 Analyzing...</span>'; shadow.appendChild(contentContainer);
                        instance.setContent(host);
                        Promise.all([
                            DictHelper.fetchTranslation(word).catch(e => [[['Error']]]),
                            DictHelper.fetchPhonetics(word)
                        ]).then(([transData, ipaText]) => {
                            contentContainer.innerHTML = DictHelper.formatDictData(word, transData, ipaText);
                            const speakerBtn = shadow.querySelector('.dict-speaker-btn');
                            if (speakerBtn) { speakerBtn.addEventListener('click', (e) => { e.stopPropagation(); DictHelper.playAudio(word, speakerBtn); }); }
                        });
                    }
                });
            }
        }
    };

    // =========================================================================
    // [1] MODULE: DeepRead (全网通用功能 & 统一设置中心)
    // =========================================================================
    function initDeepRead() {
        console.log('✅ DeepRead Module Loading (v6.5-DualRepo)...');

        // --- 常量配置 ---
        const CONSTANTS = {
            CACHE_PREFIX: 'deepread_v70_',
            HISTORY_KEY: 'deepread_last_text_pointer',
            CUSTOM_STYLES_KEY: 'deepread_custom_styles_list',
            AI_SERVICES_KEY: 'deepread_ai_services_list',
            ACTIVE_AI_ID_KEY: 'deepread_active_ai_id',
            // Task Allocation Keys
            TASK_ANALYSIS_ID: 'deepread_task_analysis_id',
            TASK_SUMMARY_ID: 'deepread_task_summary_id',
            TASK_TWITTER_ID: 'deepread_task_twitter_id',
            TASK_TRANSLATE_ID: 'deepread_task_translate_id',
            
            CACHE_EXPIRY: 24 * 60 * 60 * 1000,
            DEFAULT_STYLES: {
                SIMPLE: {
                    label: '📝 简练',
                    prompt: `Please summarize the content in English using simple words (CEFR B1 level). Start with "Title: ...". Structure with bullet points.`
                }
            }
        };

        const DEFAULT_SETTINGS = {
            enableFloatBtn: true,
            twitterTranslationType: 'AI',
            enableFailover: true,
            // GitHub Config 1 (MD Note)
            githubToken: '',
            githubUser: 'moodHappy',
            githubRepo: 'HelloWorld',
            githubPath: 'Notes/B1.md',
            // GitHub Config 2 (HTML Archive)
            githubUser2: 'moodHappy',
            githubRepo2: 'moodHappy.gitHub.io-nce',
            githubPath2: 'danmu/',

            ttsVoiceCN: 'zh-CN-XiaoxiaoNeural',
            ttsVoiceEN: 'en-US-JennyNeural',
            ttsSources: [], 
            defaultSummaryStyle: 'SIMPLE',
            twitterPrompt: `你是一位精通中英文的语言专家。请分析我提供的句子：\n1. 判断难度等级 (A1-C2)。\n2. 提供准确、优美的中文翻译。\n3. 句中关键短语及例句、例句翻译。\n请使用 Markdown 格式输出。`,
            promptAnalyze: `你是一个智能助手，请用中文分析下面的内容。请根据内容类型（单词或句子）按以下要求进行分析：\n\n如果是**句子或段落**，请：\n1. 给出难度等级（A1-C2）并解释\n2. 核心语法结构分析\n3. 准确翻译\n4. 重点短语及例句和例句翻译\n\n如果是**单词**，请：\n1. 音标及发音提示\n2. 详细释义及词性\n3. 常用搭配和例句\n4. 记忆技巧（如有）\n\n用 **加粗** 标出重点内容，保持回答简洁实用。`,
            promptSummaryCN: `You are a helpful assistant. Please summarize the following webpage content in Chinese. Use Simplified Chinese. Structure it clearly with headings (use ## Title) and bullet points.`
        };

        // --- 工具函数 ---
        const Utils = {
            getSetting(key) { return GM_getValue(key, DEFAULT_SETTINGS[key]); },
            setSetting(key, value) { GM_setValue(key, value); },
            getAllStyles() {
                const defaults = CONSTANTS.DEFAULT_STYLES;
                const customs = GM_getValue(CONSTANTS.CUSTOM_STYLES_KEY, []);
                let merged = {};
                for (let key in defaults) { merged[key] = defaults[key]; }
                if(Array.isArray(customs)) {
                    customs.forEach(style => { merged[style.id] = { label: '✨ ' + style.label, prompt: style.prompt, isCustom: true }; });
                }
                return merged;
            },
            getAIServices() { return GM_getValue(CONSTANTS.AI_SERVICES_KEY, []); },
            setAIServices(list) { GM_setValue(CONSTANTS.AI_SERVICES_KEY, list); },
            getActiveAIId() { return GM_getValue(CONSTANTS.ACTIVE_AI_ID_KEY, ''); },
            setActiveAIId(id) { GM_setValue(CONSTANTS.ACTIVE_AI_ID_KEY, id); },
            
            getServiceIdForTask(taskType) {
                const map = {
                    'ANALYSIS': CONSTANTS.TASK_ANALYSIS_ID,
                    'SUMMARY': CONSTANTS.TASK_SUMMARY_ID,
                    'TWITTER': CONSTANTS.TASK_TWITTER_ID,
                    'TRANSLATE': CONSTANTS.TASK_TRANSLATE_ID
                };
                return GM_getValue(map[taskType], '') || this.getActiveAIId();
            },

            cleanMarkdownForTTS(text) {
                if (!text) return '';
                return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1').replace(/[*#>`~-]/g, '').replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/\d+\.\s/g, '').replace(/\n+/g, '，').replace(/\s+/g, ' ').trim();
            },
            escapeHTML(str) {
                if (!str) return '';
                return str.replace(/[&<>"']/g, m => ({
                    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
                })[m]);
            },
            renderMarkdownToHTML(text) {
                if (!text) return '';
                let safeText = this.escapeHTML(text);
                return safeText
                    .replace(/\r\n/g, '\n')
                    .replace(/^###\s*(.*$)/gm, '<h4 style="margin:12px 0 6px; color:#444;">$1</h4>')
                    .replace(/^##\s*(.*$)/gm, '<h3 style="margin:18px 0 10px; color:#333; border-bottom:1px solid #eee; padding-bottom:5px;">$1</h3>')
                    .replace(/^#\s*(.*$)/gm, '<h2 style="font-size:1.3em; margin:15px 0;">$1</h2>')
                    .replace(/\*\*\s*(.*?)\s*\*\*/g, '<strong style="color: #d35400;">$1</strong>')
                    .replace(/\*\s*(.*?)\s*\*\*/g, '<em style="color: #2980b9;">$1</em>')
                    .replace(/^\s*[\-\*]\s+(.*$)/gm, '<div class="dr-list-row"><span class="dr-list-icon"></span><div class="dr-list-text">$1</div></div>')
                    .replace(/^\s*\d+\.\s+(.*$)/gm, '<div class="dr-list-header">$1</div>')
                    .replace(/\n/g, '<br>');
            },
            debounce(func, wait) {
                let timeout;
                return function (...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); };
            },
            getCacheKey(type, id) { return CONSTANTS.CACHE_PREFIX + type + '_' + btoa(encodeURIComponent(id)); },

            generateHTMLContent(title, url, summaryContent) {
                const date = new Date().toLocaleString();
                const htmlContent = this.renderMarkdownToHTML(summaryContent);
                return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHTML(title)} - ReadSense Archive</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
        h1 { border-bottom: 2px solid #3498db; padding-bottom: 10px; color: #2c3e50; }
        .meta { font-size: 14px; color: #7f8c8d; margin-bottom: 25px; background: #f9f9f9; padding: 10px; border-radius: 6px; }
        .meta a { color: #3498db; text-decoration: none; word-break: break-all; }
        .meta a:hover { text-decoration: underline; }
        .content { background: #fff; }
        h2, h3 { color: #2c3e50; margin-top: 25px; }
        .footer { margin-top: 40px; font-size: 12px; color: #bdc3c7; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <h1>${this.escapeHTML(title)}</h1>
    <div class="meta">
        <div>📅 归档时间: ${date}</div>
        <div>🔗 原文链接: <a href="${this.escapeHTML(url)}" target="_blank">${this.escapeHTML(url)}</a></div>
    </div>
    <div class="content">
        ${htmlContent}
    </div>
    <div class="footer">
        Generated by ReadSense UserScript
    </div>
</body>
</html>`;
            }
        };

        // --- 应用状态 ---
        const AppState = {
            currentAudio: null, isPlaying: false, isModalOpen: false, analysisText: '',
            lastScrollY: 0, currentSummaryLang: 'en', tempCustomStyles: [],
            tempDefaultStyle: 'SIMPLE', editingStyleId: null,
            tempAIServices: [], tempActiveAIId: '',
            tempTaskAllocations: { ANALYSIS: '', SUMMARY: '', TWITTER: '', TRANSLATE: '' }
        };

        // --- LLM API 服务 ---
        const LLMService = {
            async request(serviceConfig, messages) {
                if (!serviceConfig || !serviceConfig.key) throw new Error(`${serviceConfig.name || 'AI'} Key 未配置`);
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST', url: serviceConfig.url,
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${serviceConfig.key}` },
                        data: JSON.stringify({ model: serviceConfig.model, messages: messages, stream: false }),
                        timeout: 60000,
                        onload: (res) => {
                            if (res.status === 200) { try { resolve(JSON.parse(res.responseText).choices[0]?.message?.content || '无内容'); } catch (e) { reject(new Error('解析失败')); } }
                            else { reject(new Error(`HTTP ${res.status}: ${res.responseText}`)); }
                        },
                        onerror: () => reject(new Error('网络错误'))
                    });
                });
            },
            async analyzeWithFailover(text, systemPromptKey = 'promptAnalyze', preferredServiceId = null) {
                const services = Utils.getAIServices();
                const globalActiveId = Utils.getActiveAIId();
                if (!services || services.length === 0) throw new Error("请先在设置中添加 AI 服务");

                const sortedServices = services.sort((a, b) => {
                    if (preferredServiceId && a.id === preferredServiceId) return -1;
                    if (preferredServiceId && b.id === preferredServiceId) return 1;
                    if (a.id === globalActiveId) return -1;
                    if (b.id === globalActiveId) return 1;
                    return 0;
                });

                let lastError = null;
                for (const svc of sortedServices) {
                    if (!Utils.getSetting('enableFailover') && svc !== sortedServices[0]) break;
                    try {
                        UIManager.updateStatus(`🤖 ${svc.name} 思考中...`);
                        const messages = [{ role: 'system', content: Utils.getSetting(systemPromptKey) }, { role: 'user', content: text }];
                        const result = await this.request(svc, messages);
                        return { content: result, service: svc.name, serviceId: svc.id };
                    } catch (e) {
                        lastError = e;
                        UIManager.updateStatus(`⚠️ ${svc.name} 失败，尝试下一个...`);
                    }
                }
                throw lastError || new Error('所有 AI 服务均请求失败');
            }
        };

        // --- TTS 语音服务 (隐式绑定逻辑) ---
        const TTSService = {
            currentBlobUrl: null, 

            async play(text, isChinese, onFinishCallback = null, overrideVoice = null) {
                if (AppState.isPlaying) { this.stop(); return; }
                const cleanText = Utils.cleanMarkdownForTTS(text);
                if (!cleanText) return alert('无朗读内容');
                
                AppState.isPlaying = true; 
                UIManager.updateTTSButton(true);

                const selectedVoice = overrideVoice || (isChinese ? Utils.getSetting('ttsVoiceCN') : Utils.getSetting('ttsVoiceEN'));
                const isXiaobeiId = selectedVoice === GLOBAL_CONFIG.XIAOBEI_CONFIG.id;

                if (isChinese && isXiaobeiId) {
                     const api = GLOBAL_CONFIG.XIAOBEI_CONFIG.api;
                     const voiceId = GLOBAL_CONFIG.XIAOBEI_CONFIG.voice;
                     const params = new URLSearchParams({ t: cleanText, v: voiceId, r: 0, p: 0 });
                     
                     const audio = new Audio(`${api}?${params.toString()}`);
                     AppState.currentAudio = audio;
                     audio.onended = () => { this.stop(); if(onFinishCallback) onFinishCallback(); };
                     audio.onerror = (e) => { this.stop(); alert("晓北通道连接失败"); };
                     audio.play().catch(e => { this.stop(); });
                     return; 
                }

                const sources = Utils.getSetting('ttsSources') || [];
                if (sources.length === 0) {
                     this.fallbackToLocal(cleanText, isChinese, onFinishCallback);
                     return;
                }

                let sourceIndex = 0;
                const self = this;

                function tryNextSource() {
                    if (sourceIndex >= sources.length) { self.fallbackToLocal(cleanText, isChinese, onFinishCallback); return; }
                    const currentSource = sources[sourceIndex];
                    const requestConfig = buildTTSRequest(currentSource.url, cleanText.substring(0, 1000), selectedVoice, currentSource.token);
                    if (!requestConfig) { sourceIndex++; tryNextSource(); return; }

                    GM_xmlhttpRequest({
                        method: "GET", url: requestConfig.url, headers: requestConfig.headers, responseType: "blob", timeout: 8000,
                        onload: function (response) {
                            if (response.status === 200 && response.response instanceof Blob && response.response.size > 0) {
                                if (self.currentBlobUrl) { URL.revokeObjectURL(self.currentBlobUrl); }
                                
                                const blobUrl = URL.createObjectURL(response.response);
                                self.currentBlobUrl = blobUrl;
                                const audio = new Audio(blobUrl);
                                AppState.currentAudio = audio;
                                audio.onended = () => { self.stop(); if(onFinishCallback) onFinishCallback(); };
                                audio.onerror = () => { sourceIndex++; tryNextSource(); };
                                audio.play().catch(e => { sourceIndex++; tryNextSource(); });
                            } else { sourceIndex++; tryNextSource(); }
                        }, 
                        onerror: function () { sourceIndex++; tryNextSource(); },
                        ontimeout: function () { sourceIndex++; tryNextSource(); }
                    });
                }
                tryNextSource();
            },
            async quickTest(url, token, btnElement) {
                if (!url) { alert('❌ URL 不能为空'); return; }
                const originalText = btnElement.innerHTML;
                btnElement.innerHTML = '⏳'; btnElement.disabled = true;
                const testConfig = buildTTSRequest(url, "Test", "en-US-JennyNeural", token);
                GM_xmlhttpRequest({
                    method: "GET", url: testConfig.url, headers: testConfig.headers, responseType: "blob", timeout: 5000,
                    onload: (response) => {
                        if (response.status === 200 && response.response instanceof Blob && response.response.size > 100) {
                            const blobUrl = URL.createObjectURL(response.response);
                            const audio = new Audio(blobUrl);
                            audio.play().then(() => {
                                btnElement.innerHTML = '✅'; 
                                setTimeout(() => { btnElement.innerHTML = originalText; btnElement.disabled = false; }, 2000);
                                URL.revokeObjectURL(blobUrl);
                            }).catch(() => {
                                btnElement.innerHTML = '⚠️';
                                alert('连接成功但播放被浏览器阻挡，请检查音频权限。');
                                btnElement.disabled = false;
                            });
                        } else {
                            btnElement.innerHTML = '❌'; btnElement.disabled = false;
                            alert(`请求失败 (Status: ${response.status})`);
                        }
                    },
                    onerror: () => { btnElement.innerHTML = '❌'; btnElement.disabled = false; alert('网络请求错误'); },
                    ontimeout: () => { btnElement.innerHTML = '❌'; btnElement.disabled = false; alert('请求超时'); }
                });
            },
            fallbackToLocal(text, isChinese, onFinishCallback) {
                const success = DictHelper.playLocalTTS(text, () => { this.stop(); if (onFinishCallback) onFinishCallback(); }, isChinese ? 'zh' : 'en');
                if (!success) { alert('TTS 服务不可用'); this.stop(); if (onFinishCallback) onFinishCallback(); }
            },
            stop() {
                if (AppState.currentAudio) { AppState.currentAudio.pause(); AppState.currentAudio = null; }
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                if (this.currentBlobUrl) {
                    URL.revokeObjectURL(this.currentBlobUrl);
                    this.currentBlobUrl = null;
                }
                AppState.isPlaying = false; 
                UIManager.updateTTSButton(false);
            }
        };
        window.TTSServiceInstance = TTSService;

        // --- UI Manager ---
        GM_addStyle(`
            /* --- DeepRead UI Styles --- */
            .dr-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); z-index: 99999; display: flex; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.25s ease; align-items: center; }
            .dr-overlay.active { opacity: 1; pointer-events: auto; }
            .dr-modal { background: #fff; width: 600px; max-height: 80vh; border-radius: 16px; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.3); transform: scale(0.98); transition: transform 0.2s ease, opacity 0.2s ease; touch-action: none; }
            .dr-overlay.active .dr-modal { transform: scale(1); }
            @media (max-width: 640px) { .dr-overlay { align-items: flex-start; } .dr-modal { width: 100%; margin-top: 0; top: 0; height: auto; max-height: 80vh; border-radius: 0 0 20px 20px; } }
            .dr-header { padding: 15px 20px; background: #fff; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; border-radius: 16px 16px 0 0; }
            .dr-title { font-size: 18px; font-weight: 700; color: #333; margin: 0; }
            .dr-select { margin-left: 12px; padding: 4px 8px; border-radius: 6px; border: 1px solid #ddd; font-size: 12px; color: #555; background: #fdfdfd; outline: none; cursor: pointer; max-width: 140px; }
            .dr-body { flex: 1; overflow-y: auto; background: #fff; position: relative; -webkit-overflow-scrolling: touch; touch-action: pan-y; }
            #dr-original-box { position: sticky; top: 0; z-index: 10; background: #fdfdfd; border-bottom: 3px solid #f0f0f0; padding: 8px 20px; display: none; }
            #dr-original-label { font-style: italic; color: #c9a24d; font-size: 12px; margin: 6px 0; }
            #dr-result-content { padding: 20px; font-size: 16px; line-height: 1.7; color: #2c3e50; }
            .dr-footer { padding: 25px 20px 15px; border-top: 1px solid #eee; background: #fff; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; flex-shrink: 0; border-radius: 0 0 16px 16px; touch-action: none; user-select: none; position: relative; }
            .dr-btn { padding: 10px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 5px; }
            .dr-btn-primary { background: #3498db; }
            .dr-btn-success { background: #27ae60; }
            .dr-btn-gray { background: #95a5a6; }
            .dr-btn-danger { background: #e74c3c; padding: 4px 8px; font-size:12px; }
            .dr-btn-edit { background: #f39c12; padding: 4px 8px; font-size:12px; margin-right: 5px; }
            .dr-btn-black { background: #333; }
            #dr-float-btn { position: fixed; right: 15px; top: 65%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #3498db, #8e44ad); color: white; border: none; font-size: 22px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 99990; display: flex; justify-content: center; align-items: center; cursor: pointer; opacity: 0; pointer-events: none; transform: translateY(-50%) scale(0.8); transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
            #dr-float-btn.visible { opacity: 1; pointer-events: auto; transform: translateY(-50%) scale(1); }
            .dr-input-group { margin-bottom: 12px; padding: 0 20px; }
            .dr-input-group label { display:block; margin-bottom:5px; font-weight:600; color:#555; font-size:12px; }
            .dr-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
            textarea.dr-input { font-family: monospace; line-height: 1.4; resize: vertical; min-height: 60px; overflow-y: hidden; }
            select.dr-input { background: #fff; }
            .dr-section-title { font-size: 15px; font-weight: 700; color: #333; border-left: 4px solid #3498db; padding-left: 10px; margin: 25px 20px 15px; cursor: pointer; user-select: none; }
            .ai-service-row { display: flex; gap: 8px; background: #f9f9f9; padding: 10px; border-radius: 8px; margin-bottom: 8px; border: 1px solid #eee; align-items: center; flex-wrap: wrap; }
            .ai-service-row.active { border-color: #3498db; background: #e8f4fd; }
            .ai-radio-col { flex: 0 0 30px; display: flex; justify-content: center; align-items: center; padding-top: 0; }
            .ai-radio-btn { width: 18px; height: 18px; border: 2px solid #ccc; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            .ai-radio-btn.checked { border-color: #3498db; }
            .ai-radio-btn.checked::after { content: ''; width: 8px; height: 8px; background: #3498db; border-radius: 50%; display: block; }
            .ai-inputs-col { flex: 1; display: flex; gap: 8px; flex-wrap: wrap; min-width: 0; }
            .conf-api-host, .conf-api-key, .conf-model-name { flex: 1; min-width: 120px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; }
            .conf-api-host { flex-basis: 30%; } 
            .conf-api-key { flex-basis: 30%; }
            .conf-model-name { flex-basis: 20%; }
            @media (max-width: 480px) { .conf-api-host, .conf-api-key, .conf-model-name { flex-basis: 100%; } }
            .tts-source-row { display: flex; gap: 6px; margin-bottom: 8px; align-items: center; flex-wrap: wrap; background: #fdfdfd; padding: 6px; border: 1px solid #eee; border-radius: 6px; }
            .tts-url-input { flex: 2; min-width: 140px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; box-sizing: border-box; }
            .tts-token-input { flex: 1; min-width: 80px; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px; box-sizing: border-box; }
            .tts-btn-group { display: flex; gap: 4px; }
            .tts-del-btn, .tts-lightning-btn { border: none; border-radius: 4px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
            .tts-del-btn { background: #ffebee; color: #c62828; }
            .tts-lightning-btn { background: #fff8e1; color: #f57f17; font-weight: bold; }
            .tts-lightning-btn:hover { background: #ffecb3; }
            details { margin-bottom: 10px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
            details summary { list-style: none; outline: none; }
            details summary::-webkit-details-marker { display: none; }
            details summary .dr-section-title { margin: 10px 20px 5px; display: flex; align-items: center; justify-content: space-between; }
            details summary .dr-section-title::after { content: '▼'; font-size: 12px; color: #999; transition: transform 0.2s; }
            details[open] summary .dr-section-title::after { transform: rotate(180deg); }
            details .dr-input-group { padding-left: 20px; padding-right: 20px; }
            .dr-style-item { display:flex; justify-content:space-between; align-items:center; background:#f0f0f0; padding:8px 12px; margin-bottom:8px; border-radius:6px; font-size:13px; }
            .dr-style-item-left { display:flex; align-items:center; gap:8px; flex:1; }
            .dr-style-item-right { display:flex; align-items:center; }
            .dr-radio { accent-color: #3498db; width: 16px; height: 16px; cursor: pointer; }
            .dr-style-label { font-weight:600; color:#333; cursor: pointer; }
            .task-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            @media (max-width: 500px) { .task-grid { grid-template-columns: 1fr; } }
            .task-item { background: #fdfdfd; padding: 8px; border: 1px solid #eee; border-radius: 6px; }
        `);

        const UIManager = {
            elements: {}, autoHideTimer: null,
            init() {
                const floatBtn = document.createElement('button');
                floatBtn.id = 'dr-float-btn'; floatBtn.innerHTML = '💡';
                document.body.appendChild(floatBtn);
                this.elements.floatBtn = floatBtn;

                const overlay = document.createElement('div');
                overlay.className = 'dr-overlay';
                overlay.id = 'dr-modal-overlay';
                overlay.innerHTML = `
                    <div class="dr-modal">
                        <div class="dr-header">
                            <div style="display:flex; align-items:center;">
                                <h3 class="dr-title">ReadSense</h3>
                                <select id="dr-model-select" class="dr-select" style="display:none; margin-left:10px; min-width:80px;"></select>
                                <select id="dr-style-select" class="dr-select" style="display:none;"></select>
                            </div>
                        </div>
                        <div class="dr-body">
                            <div id="dr-original-box"><span id="dr-original-label">SELECTED TEXT</span><div id="dr-original-content"></div></div>
                            <div id="dr-result-content"></div>
                        </div>
                        <div class="dr-footer"></div>
                    </div>`;
                document.body.appendChild(overlay);

                this.elements.overlay = overlay;
                this.elements.modal = overlay.querySelector('.dr-modal');
                this.elements.title = overlay.querySelector('.dr-title');
                this.elements.modelSelect = overlay.querySelector('#dr-model-select');
                this.elements.styleSelect = overlay.querySelector('#dr-style-select');
                this.elements.originalBox = overlay.querySelector('#dr-original-box');
                this.elements.originalContent = overlay.querySelector('#dr-original-content');
                this.elements.resultContent = overlay.querySelector('#dr-result-content');
                this.elements.footer = overlay.querySelector('.dr-footer');

                overlay.addEventListener('click', (e) => { if (e.target === overlay) this.closeModal(); });
                this.elements.styleSelect.addEventListener('change', (e) => { CoreController.startSummary(AppState.currentSummaryLang, e.target.value); });
                this.elements.modelSelect.addEventListener('change', (e) => { if(e.target.value) CoreController.switchModel(e.target.value); });

                let clickCount = 0, clickTimer = null, pressTimer = null, isLongPress = false;
                const startPress = (e) => {
                    if (e.type === 'mousedown' && e.button !== 0) return;
                    isLongPress = false;
                    pressTimer = setTimeout(() => {
                        isLongPress = true;
                        if (navigator.vibrate) navigator.vibrate(50);
                        floatBtn.style.transform = 'translateY(-50%) scale(1.2)';
                        setTimeout(() => floatBtn.style.transform = 'translateY(-50%) scale(1)', 200);
                        CoreController.startSummary('zh');
                    }, 800);
                };
                const cancelPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };
                floatBtn.addEventListener('mousedown', startPress);
                floatBtn.addEventListener('touchstart', startPress, { passive: true });
                ['mouseup', 'mouseleave', 'touchend', 'touchmove'].forEach(evt => floatBtn.addEventListener(evt, cancelPress, { passive: true }));
                floatBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isLongPress) { isLongPress = false; clickCount = 0; return; }
                    clickCount++;
                    if (clickCount === 1) {
                        clickTimer = setTimeout(() => {
                            if (AppState.analysisText) CoreController.startAnalysis(AppState.analysisText);
                            else { const lastText = GM_getValue(CONSTANTS.HISTORY_KEY, null); if (lastText) CoreController.startAnalysis(lastText); else alert('请先选择文本'); }
                            clickCount = 0;
                        }, 250);
                    } else if (clickCount === 2) {
                        clearTimeout(clickTimer); clickCount = 0;
                        floatBtn.style.transform = 'translateY(-50%) scale(0.9)';
                        setTimeout(() => floatBtn.style.transform = 'translateY(-50%) scale(1)', 150);
                        CoreController.startSummary('en');
                    }
                });
                
                let startY = 0, currentMoveY = 0;
                this.elements.footer.addEventListener('touchstart', (e) => { startY = e.touches[0].clientY; currentMoveY = 0; this.elements.modal.style.transition = 'none'; }, { passive: true });
                this.elements.footer.addEventListener('touchmove', (e) => { const diff = e.touches[0].clientY - startY; if (diff < 0) { currentMoveY = diff; this.elements.modal.style.transform = `translateY(${diff}px)`; } }, { passive: true });
                this.elements.footer.addEventListener('touchend', () => {
                    this.elements.modal.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    if (currentMoveY < -50) { this.elements.modal.style.transform = `translateY(-100vh)`; this.elements.modal.style.opacity = '0'; setTimeout(() => { this.closeModal(); }, 300); } else { this.elements.modal.style = ''; }
                    currentMoveY = 0;
                });
            },
            updateModelDropdown(currentId) {
                const select = this.elements.modelSelect;
                select.innerHTML = '';
                const services = Utils.getAIServices();
                if(!services || services.length === 0) return;
                services.forEach(svc => {
                    const opt = document.createElement('option');
                    opt.value = svc.id;
                    opt.textContent = svc.name;
                    select.appendChild(opt);
                });
                select.value = currentId || Utils.getActiveAIId();
            },
            openModal(title, mode = 'ANALYSIS', lang = 'en', currentStyle = 'SIMPLE') {
                this.elements.title.textContent = title;
                this.elements.overlay.classList.add('active');
                AppState.isModalOpen = true;
                document.body.style.overflow = 'hidden';
                this.elements.styleSelect.style.display = 'none';
                this.elements.modelSelect.style.display = 'none';
                
                if (mode === 'SUMMARY' && lang === 'en') {
                    this.updateStyleDropdown();
                    this.elements.styleSelect.style.display = 'block';
                    this.elements.styleSelect.value = currentStyle;
                } else if (mode === 'ANALYSIS') {
                    this.updateModelDropdown();
                    this.elements.modelSelect.style.display = 'block';
                }
            },
            updateStyleDropdown() {
                const select = this.elements.styleSelect;
                select.innerHTML = '';
                const styles = Utils.getAllStyles();
                for (let key in styles) {
                    const opt = document.createElement('option');
                    opt.value = key; opt.textContent = styles[key].label; select.appendChild(opt);
                }
            },
            closeModal() {
                this.elements.overlay.classList.remove('active');
                setTimeout(() => { this.elements.modal.style = ''; }, 300);
                AppState.isModalOpen = false;
                document.body.style.overflow = '';
                TTSService.stop();
            },
            updateStatus(text) {
                this.elements.resultContent.innerHTML = `<div style="text-align:center; padding:40px; color:#999;"><div style="font-size:24px; margin-bottom:10px;">⏳</div>${text}</div>`;
            },
            renderAnalysisUI(originalText, aiContent, serviceName, serviceId = null) {
                this.elements.originalBox.style.display = 'block';
                this.elements.originalContent.textContent = originalText;
                const html = Utils.renderMarkdownToHTML(aiContent);
                this.elements.resultContent.innerHTML = html + `<div style="margin-top:20px; font-size:12px; color:#ccc; text-align:right;">by ${serviceName}</div>`;
                
                if (serviceId && this.elements.modelSelect) {
                    this.elements.modelSelect.value = serviceId;
                }

                DictHelper.initDictionary(this.elements.resultContent, 'dr-modal-overlay');
                this.buildFooter([
                    { text: '🔊 朗读', type: 'primary', id: 'dr-tts-btn', onClick: () => TTSService.play(originalText, false) },
                    { text: '📋 复制', type: 'success', onClick: () => { GM_setClipboard(aiContent); alert('已复制'); } }
                ]);
            },
            renderSummaryUI(content, isCached, serviceName) {
                this.elements.originalBox.style.display = 'none';
                const html = Utils.renderMarkdownToHTML(content);
                const suffix = isCached ? ' (⚡️Cache)' : '';
                this.elements.resultContent.innerHTML = html + `<div style="margin-top:20px; font-size:12px; color:#ccc; text-align:right;">${serviceName} Summary${suffix}</div>`;
                DictHelper.initDictionary(this.elements.resultContent, 'dr-modal-overlay');
                
                const showPushOptions = () => {
                    this.buildFooter([
                        { text: '📄 推送 1 (笔记)', type: 'primary', onClick: () => CoreController.pushGitHub(content, 'NOTE') },
                        { text: '🌏 推送 2 (归档)', type: 'black', onClick: () => CoreController.pushGitHub(content, 'ARCHIVE') },
                        { text: '🚀 全部推送', type: 'success', onClick: () => CoreController.pushGitHub(content, 'BOTH') },
                        { text: '↩️ 取消', type: 'gray', onClick: () => restoreDefaultFooter() }
                    ]);
                };

                const restoreDefaultFooter = () => {
                    this.buildFooter([
                        { text: '🔊 朗读', type: 'primary', id: 'dr-tts-btn', onClick: () => TTSService.play(content, true) },
                        { text: '⬆️ GitHub', type: 'gray', id: 'dr-gh-btn', onClick: showPushOptions },
                        { text: '📋 复制', type: 'success', onClick: () => { GM_setClipboard(content); alert('已复制'); } }
                    ]);
                };

                restoreDefaultFooter();
            },
            renderAiServiceList(container) {
                container.innerHTML = '';
                AppState.tempAIServices.forEach((svc, index) => {
                    const row = document.createElement('div');
                    const isActive = svc.id === AppState.tempActiveAIId;
                    row.className = `ai-service-row ${isActive ? 'active' : ''}`;
                    const radioCol = document.createElement('div'); radioCol.className = 'ai-radio-col';
                    const radioBtn = document.createElement('div');
                    radioBtn.className = `ai-radio-btn ${isActive ? 'checked' : ''}`;
                    radioBtn.title = "设为全局首选 (Global Primary)";
                    radioBtn.onclick = () => { AppState.tempActiveAIId = svc.id; this.renderAiServiceList(container); };
                    radioCol.appendChild(radioBtn);
                    const inputCol = document.createElement('div'); inputCol.className = 'ai-inputs-col';
                    const nameInput = document.createElement('input'); nameInput.className = 'conf-model-name'; nameInput.placeholder = '名称'; nameInput.value = svc.name || ''; nameInput.onchange = (e) => { svc.name = e.target.value; };
                    const urlInput = document.createElement('input'); urlInput.className = 'conf-api-host'; urlInput.placeholder = 'Host URL'; urlInput.value = svc.url || ''; urlInput.onchange = (e) => { svc.url = e.target.value; };
                    const keyInput = document.createElement('input'); keyInput.className = 'conf-api-key'; keyInput.placeholder = 'API Key'; keyInput.value = svc.key || ''; keyInput.type = 'password'; keyInput.onchange = (e) => { svc.key = e.target.value; };
                    const modelInput = document.createElement('input'); modelInput.className = 'conf-model-name'; modelInput.placeholder = 'Model'; modelInput.value = svc.model || ''; modelInput.style.flexBasis = "40%"; modelInput.onchange = (e) => { svc.model = e.target.value; };
                    inputCol.append(nameInput, urlInput, keyInput, modelInput);
                    const delBtn = document.createElement('button'); delBtn.className = 'tts-del-btn'; delBtn.innerHTML = '×';
                    delBtn.style.marginLeft = 'auto';
                    delBtn.onclick = () => {
                        AppState.tempAIServices.splice(index, 1);
                        if (isActive && AppState.tempAIServices.length > 0) AppState.tempActiveAIId = AppState.tempAIServices[0].id;
                        this.renderAiServiceList(container);
                    };
                    row.append(radioCol, inputCol, delBtn);
                    container.appendChild(row);
                });
                const controlsDiv = document.createElement('div');
                controlsDiv.style.display = 'flex'; controlsDiv.style.gap = '8px'; controlsDiv.style.flexWrap = 'wrap'; controlsDiv.style.marginTop = '10px';
                const addBtn = document.createElement('button');
                addBtn.className = 'dr-btn dr-btn-primary'; addBtn.style.padding = '6px 12px'; addBtn.style.fontSize = '12px';
                addBtn.innerHTML = '+ 自定义';
                addBtn.onclick = () => {
                    const newId = 'ai_' + Date.now();
                    AppState.tempAIServices.push({ id: newId, name: 'Custom AI', url: '', key: '', model: '' });
                    if (!AppState.tempActiveAIId) AppState.tempActiveAIId = newId;
                    this.renderAiServiceList(container);
                };
                controlsDiv.appendChild(addBtn);
                Object.keys(GLOBAL_CONFIG.AI_TEMPLATES).forEach(key => {
                    const tpl = GLOBAL_CONFIG.AI_TEMPLATES[key];
                    const tplBtn = document.createElement('button');
                    tplBtn.className = 'dr-btn dr-btn-gray'; tplBtn.style.padding = '6px 10px'; tplBtn.style.fontSize = '12px';
                    tplBtn.innerHTML = `+ ${tpl.name}`;
                    tplBtn.onclick = () => {
                        const newId = 'ai_' + Date.now();
                        AppState.tempAIServices.push({ id: newId, name: tpl.name, url: tpl.url, key: '', model: tpl.model });
                        if (!AppState.tempActiveAIId) AppState.tempActiveAIId = newId;
                        this.renderAiServiceList(container);
                    };
                    controlsDiv.appendChild(tplBtn);
                });
                container.appendChild(controlsDiv);
            },
            renderTaskAllocation(container) {
                container.innerHTML = '';
                const tasks = [
                    { id: 'ANALYSIS', label: '1. 深度分析 (Deep Analysis)' },
                    { id: 'SUMMARY', label: '2. 内容总结 (Summary)' },
                    { id: 'TWITTER', label: '3. 推特分析 (Twitter Analysis)' },
                    { id: 'TRANSLATE', label: '4. 智能翻译 (Twitter Translation)' }
                ];
                
                const services = AppState.tempAIServices;
                const generateOptions = (currentVal) => {
                    let html = `<option value="">🚀 使用全局首选 (Default)</option>`;
                    services.forEach(s => {
                         html += `<option value="${s.id}" ${s.id === currentVal ? 'selected' : ''}>${s.name}</option>`;
                    });
                    return html;
                };

                const grid = document.createElement('div');
                grid.className = 'task-grid';

                tasks.forEach(t => {
                    const item = document.createElement('div');
                    item.className = 'task-item';
                    const label = document.createElement('label');
                    label.textContent = t.label;
                    label.style.fontSize = '12px'; label.style.fontWeight='600'; label.style.color='#444';
                    
                    const select = document.createElement('select');
                    select.className = 'dr-input';
                    select.style.fontSize = '13px'; select.style.padding='4px';
                    select.innerHTML = generateOptions(AppState.tempTaskAllocations[t.id]);
                    select.onchange = (e) => { AppState.tempTaskAllocations[t.id] = e.target.value; };

                    item.append(label, select);
                    grid.appendChild(item);
                });
                container.appendChild(grid);
            },
            renderSourceList(container) {
                const sources = Utils.getSetting('ttsSources') || [];
                const createRow = (url = '', token = '') => {
                    const row = document.createElement('div'); row.className = 'tts-source-row';
                    const urlInput = document.createElement('input'); urlInput.className = 'tts-url-input'; urlInput.placeholder = 'TTS URL (e.g., .../api/tts)'; urlInput.value = url;
                    const tokenInput = document.createElement('input'); tokenInput.className = 'tts-token-input'; tokenInput.placeholder = 'Token (Opt)'; tokenInput.value = token;
                    const btnGroup = document.createElement('div'); btnGroup.className = 'tts-btn-group';
                    const testBtn = document.createElement('button'); testBtn.className = 'tts-lightning-btn'; testBtn.innerHTML = '⚡️'; testBtn.title = "立即测试连接";
                    testBtn.onclick = () => TTSService.quickTest(urlInput.value, tokenInput.value, testBtn);
                    const delBtn = document.createElement('button'); delBtn.className = 'tts-del-btn'; delBtn.innerHTML = '×'; 
                    delBtn.onclick = () => row.remove();
                    btnGroup.append(testBtn, delBtn);
                    row.append(urlInput, tokenInput, btnGroup);
                    return row;
                };
                sources.forEach(src => container.appendChild(createRow(src.url, src.token)));
                const addBtn = document.createElement('button'); addBtn.id = 'tts-add-btn'; addBtn.className="dr-btn dr-btn-gray"; addBtn.style.width="100%"; addBtn.style.justifyContent="center"; addBtn.style.marginTop="5px"; addBtn.textContent = '+ 添加新源'; addBtn.onclick = () => container.insertBefore(createRow(), addBtn);
                container.appendChild(addBtn);
            },
            renderSettings() {
                this.elements.originalBox.style.display = 'none';
                
                AppState.tempAIServices = Utils.getAIServices();
                AppState.tempActiveAIId = Utils.getActiveAIId();
                AppState.tempTaskAllocations = {
                    ANALYSIS: GM_getValue(CONSTANTS.TASK_ANALYSIS_ID, ''),
                    SUMMARY: GM_getValue(CONSTANTS.TASK_SUMMARY_ID, ''),
                    TWITTER: GM_getValue(CONSTANTS.TASK_TWITTER_ID, ''),
                    TRANSLATE: GM_getValue(CONSTANTS.TASK_TRANSLATE_ID, '')
                };

                if (AppState.tempAIServices.length === 0) {
                     const tpl = GLOBAL_CONFIG.AI_TEMPLATES.GROQ;
                     AppState.tempAIServices.push({ id: 'init_default', name: tpl.name, url: tpl.url, key: '', model: tpl.model });
                     AppState.tempActiveAIId = 'init_default';
                }

                AppState.tempCustomStyles = GM_getValue(CONSTANTS.CUSTOM_STYLES_KEY, []);
                AppState.tempDefaultStyle = Utils.getSetting('defaultSummaryStyle') || 'SIMPLE';

                const cnVoice = Utils.getSetting('ttsVoiceCN');
                const enVoice = Utils.getSetting('ttsVoiceEN');
                const cnOptions = GLOBAL_CONFIG.VOICES.CN.map(v => `<option value="${v.id}" ${cnVoice === v.id ? 'selected' : ''}>${v.name}</option>`).join('');
                const enOptions = GLOBAL_CONFIG.VOICES.EN.map(v => `<option value="${v.id}" ${enVoice === v.id ? 'selected' : ''}>${v.name}</option>`).join('');

                this.elements.resultContent.innerHTML = `
                    <div style="padding-top:10px;">
                        <div class="dr-section-title">✨ 功能开关</div>
                        <div class="dr-input-group" style="display:flex; align-items:center; gap:8px;">
                            <input type="checkbox" id="dr-enable-float-btn" class="dr-radio" ${Utils.getSetting('enableFloatBtn') ? 'checked' : ''}>
                            <label for="dr-enable-float-btn" style="margin:0; cursor:pointer;">显示 DeepRead 悬浮按钮</label>
                        </div>
                         <div class="dr-input-group" style="display:flex; align-items:center; gap:8px;">
                            <input type="checkbox" id="dr-enable-failover" class="dr-radio" ${Utils.getSetting('enableFailover') ? 'checked' : ''}>
                            <label for="dr-enable-failover" style="margin:0; cursor:pointer;">启用 AI 故障自动轮询 (Failover)</label>
                        </div>
                        
                        <div class="dr-input-group" style="background:#f0f8ff; padding:10px; border-radius:8px; margin-top:10px;">
                            <label style="color:#0056b3;">🐦 Twitter 翻译引擎</label>
                            <select class="dr-input" id="dr-tw-trans-type">
                                <option value="AI" ${Utils.getSetting('twitterTranslationType') === 'AI' ? 'selected' : ''}>🤖 AI 智能翻译 (使用下方配置)</option>
                                <option value="GOOGLE" ${Utils.getSetting('twitterTranslationType') === 'GOOGLE' ? 'selected' : ''}>🌏 Google 翻译 (免费/快速)</option>
                            </select>
                        </div>

                        <details open>
                            <summary><div class="dr-section-title">🧠 AI 服务配置</div></summary>
                            <div class="dr-input-group">
                                <div id="dr-ai-list-container"></div>
                                <div style="margin-top:15px; border-top:1px dashed #ddd; padding-top:10px;">
                                    <div style="font-weight:700; color:#333; margin-bottom:8px;">🤖 AI 任务分流 (Task Assignment)</div>
                                    <div style="font-size:12px; color:#666; margin-bottom:8px;">将不同功能分配给最擅长的模型。未指定则使用“全局首选”。</div>
                                    <div id="dr-task-allocation-container"></div>
                                </div>
                            </div>
                        </details>

                        <details>
                            <summary><div class="dr-section-title">🔊 TTS 语音配置</div></summary>
                            <div class="dr-input-group">
                                <label>🇨🇳 中文首选语音</label>
                                <select class="dr-input" id="sk-voice-cn">${cnOptions}</select>
                                <div style="font-size:12px; color:#666; margin-top:4px;">💡 提示：选中“晓北”将自动激活独立高速通道 (v1.4)。</div>
                            </div>
                            <div class="dr-input-group">
                                <label>🇺🇸 英文首选语音</label>
                                <select class="dr-input" id="sk-voice-en">${enOptions}</select>
                            </div>
                            <div class="dr-input-group">
                                <label style="margin-bottom:8px">TTS 源列表 (Fallback) <span style="color:#f57f17;font-weight:normal;font-size:12px">⚡️点击闪电图标测试</span></label>
                                <div id="tts-source-container"></div>
                            </div>
                        </details>

                        <details>
                            <summary><div class="dr-section-title">📝 Prompt 指令管理</div></summary>
                            <div class="dr-input-group"><label>🔍 深度分析指令</label><textarea class="dr-input" id="prompt-analyze" rows="4">${Utils.getSetting('promptAnalyze')}</textarea></div>
                            <div class="dr-input-group"><label>📑 中文总结指令</label><textarea class="dr-input" id="prompt-summary-cn" rows="3">${Utils.getSetting('promptSummaryCN')}</textarea></div>
                            <div class="dr-input-group"><label>🐦 Twitter 分析指令</label><textarea class="dr-input" id="tw-prompt" rows="3">${Utils.getSetting('twitterPrompt')}</textarea></div>
                        </details>

                        <details>
                            <summary><div class="dr-section-title">🎨 英文总结风格</div></summary>
                            <div class="dr-input-group" style="border:1px solid #eee; padding:15px; border-radius:8px;">
                                <div id="dr-styles-list" style="max-height:150px; overflow-y:auto; margin-bottom:10px;"></div>
                                <div style="background:#f9f9f9; padding:10px; border-radius:6px;">
                                    <input id="dr-new-style-name" class="dr-input" placeholder="名称" style="margin-bottom:5px;">
                                    <textarea id="dr-new-style-prompt" class="dr-input" placeholder="Prompt (English)..." style="margin-bottom:5px; min-height:50px;"></textarea>
                                    <button id="dr-add-style-btn" class="dr-btn dr-btn-primary" style="width:100%; justify-content:center; padding:6px;">➕ 添加新风格</button>
                                </div>
                            </div>
                        </details>

                        <details>
                            <summary><div class="dr-section-title">📦 GitHub 笔记同步</div></summary>
                            <div class="dr-input-group">
                                <div style="margin-bottom:10px;"><label>Personal Access Token</label><input class="dr-input" id="sk-gh" value="${Utils.getSetting('githubToken')}" placeholder="ghp_..."></div>
                                
                                <div style="background:#f9f9f9; padding:10px; border-radius:6px; margin-bottom:10px;">
                                    <label style="color:#27ae60;">📂 位置 1 (笔记覆盖 / Markdown)</label>
                                    <div style="display:flex; gap:5px; margin-bottom:5px;">
                                        <input class="dr-input" id="sk-u" value="${Utils.getSetting('githubUser')}" placeholder="User">
                                        <input class="dr-input" id="sk-r" value="${Utils.getSetting('githubRepo')}" placeholder="Repo">
                                    </div>
                                    <input class="dr-input" id="sk-p" value="${Utils.getSetting('githubPath')}" placeholder="Path (e.g., Notes/B1.md)">
                                </div>

                                <div style="background:#f9f9f9; padding:10px; border-radius:6px;">
                                    <label style="color:#2980b9;">🌏 位置 2 (网页归档 / HTML)</label>
                                    <div style="display:flex; gap:5px; margin-bottom:5px;">
                                        <input class="dr-input" id="sk-u2" value="${Utils.getSetting('githubUser2')}" placeholder="User">
                                        <input class="dr-input" id="sk-r2" value="${Utils.getSetting('githubRepo2')}" placeholder="Repo">
                                    </div>
                                    <input class="dr-input" id="sk-p2" value="${Utils.getSetting('githubPath2')}" placeholder="Path (e.g., danmu/)">
                                    <div style="font-size:11px; color:#666; margin-top:4px;">* 此模式将生成 .html 文件，文件名为当前时间戳，不会覆盖旧文件。</div>
                                </div>
                            </div>
                        </details>

                        <div class="dr-section-title">💾 备份与还原</div>
                        <div class="dr-input-group" style="display:flex; gap:10px; justify-content:center; padding-bottom:20px;">
                            <button id="dr-export-btn" class="dr-btn dr-btn-gray">📤 导出配置</button>
                            <button id="dr-import-btn" class="dr-btn dr-btn-gray">📥 导入配置</button>
                        </div>
                    </div>`;

                this.renderAiServiceList(document.getElementById('dr-ai-list-container'));
                this.renderTaskAllocation(document.getElementById('dr-task-allocation-container'));
                this.renderStylesList();
                this.renderSourceList(document.getElementById('tts-source-container'));
                
                setTimeout(() => {
                    const addBtn = document.getElementById('dr-add-style-btn');
                    addBtn.onclick = () => {
                        const nameInput = document.getElementById('dr-new-style-name'); const promptInput = document.getElementById('dr-new-style-prompt');
                        const name = nameInput.value.trim(); const prompt = promptInput.value.trim();
                        if (!name || !prompt) return alert('请填写名称和 Prompt');
                        if (AppState.editingStyleId) {
                            const idx = AppState.tempCustomStyles.findIndex(s => s.id === AppState.editingStyleId);
                            if (idx > -1) { AppState.tempCustomStyles[idx].label = name; AppState.tempCustomStyles[idx].prompt = prompt; }
                            AppState.editingStyleId = null; addBtn.textContent = '➕ 添加新风格'; addBtn.className = 'dr-btn dr-btn-primary';
                        } else { AppState.tempCustomStyles.push({ id: 'custom_' + Date.now(), label: name, prompt: prompt }); }
                        nameInput.value = ''; promptInput.value = ''; this.renderStylesList();
                    };
                    document.getElementById('dr-export-btn').onclick = () => {
                         const data = { 
                             settings: {}, 
                             aiServices: Utils.getAIServices(), 
                             activeAiId: Utils.getActiveAIId(), 
                             customStyles: GM_getValue(CONSTANTS.CUSTOM_STYLES_KEY, []),
                             taskAllocations: {
                                ANALYSIS: GM_getValue(CONSTANTS.TASK_ANALYSIS_ID, ''),
                                SUMMARY: GM_getValue(CONSTANTS.TASK_SUMMARY_ID, ''),
                                TWITTER: GM_getValue(CONSTANTS.TASK_TWITTER_ID, ''),
                                TRANSLATE: GM_getValue(CONSTANTS.TASK_TRANSLATE_ID, '')
                             }
                         };
                         for(let k in DEFAULT_SETTINGS) data.settings[k] = Utils.getSetting(k);
                         const blob = new Blob([JSON.stringify(data)], {type: "application/json"});
                         const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'ReadSense_Backup.json'; a.click();
                    };
                    document.getElementById('dr-import-btn').onclick = () => {
                        const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
                        input.onchange = (e) => {
                            const f = e.target.files[0]; if(!f)return;
                            const r = new FileReader(); r.onload=(ev)=>{ 
                                try{ 
                                    const d=JSON.parse(ev.target.result); 
                                    if(d.settings){ for(let k in d.settings)GM_setValue(k, d.settings[k]); } 
                                    if(Array.isArray(d.aiServices)) Utils.setAIServices(d.aiServices); 
                                    if(d.activeAiId) Utils.setActiveAIId(d.activeAiId); 
                                    if(Array.isArray(d.customStyles)) GM_setValue(CONSTANTS.CUSTOM_STYLES_KEY, d.customStyles);
                                    if(d.taskAllocations && typeof d.taskAllocations === 'object') {
                                        if(d.taskAllocations.ANALYSIS) GM_setValue(CONSTANTS.TASK_ANALYSIS_ID, d.taskAllocations.ANALYSIS);
                                        if(d.taskAllocations.SUMMARY) GM_setValue(CONSTANTS.TASK_SUMMARY_ID, d.taskAllocations.SUMMARY);
                                        if(d.taskAllocations.TWITTER) GM_setValue(CONSTANTS.TASK_TWITTER_ID, d.taskAllocations.TWITTER);
                                        if(d.taskAllocations.TRANSLATE) GM_setValue(CONSTANTS.TASK_TRANSLATE_ID, d.taskAllocations.TRANSLATE);
                                    }
                                    alert('✅ 导入成功'); location.reload(); 
                                }catch(err){alert('❌ 导入失败：格式错误或文件损坏');} 
                            }; r.readAsText(f);
                        }; input.click();
                    };
                }, 0);

                this.buildFooter([{
                    text: '💾 保存全部设置', type: 'success', onClick: () => {
                        Utils.setSetting('enableFloatBtn', document.getElementById('dr-enable-float-btn').checked);
                        Utils.setSetting('enableFailover', document.getElementById('dr-enable-failover').checked);
                        Utils.setSetting('twitterTranslationType', document.getElementById('dr-tw-trans-type').value);
                        
                        const validServices = AppState.tempAIServices.filter(s => s.url && s.key);
                        if (validServices.length === 0) return alert("❌ 请至少配置一个有效的 AI 服务 (需 URL 和 Key)");
                        Utils.setAIServices(validServices);
                        
                        const serviceIds = new Set(validServices.map(s => s.id));
                        
                        let safeActiveId = AppState.tempActiveAIId;
                        if (!serviceIds.has(safeActiveId)) { safeActiveId = validServices[0].id; }
                        Utils.setActiveAIId(safeActiveId);

                        GM_setValue(CONSTANTS.CUSTOM_STYLES_KEY, AppState.tempCustomStyles);
                        Utils.setSetting('defaultSummaryStyle', AppState.tempDefaultStyle);
                        
                        const validateTask = (id) => serviceIds.has(id) ? id : '';
                        
                        GM_setValue(CONSTANTS.TASK_ANALYSIS_ID, validateTask(AppState.tempTaskAllocations.ANALYSIS));
                        GM_setValue(CONSTANTS.TASK_SUMMARY_ID, validateTask(AppState.tempTaskAllocations.SUMMARY));
                        GM_setValue(CONSTANTS.TASK_TWITTER_ID, validateTask(AppState.tempTaskAllocations.TWITTER));
                        GM_setValue(CONSTANTS.TASK_TRANSLATE_ID, validateTask(AppState.tempTaskAllocations.TRANSLATE));

                        Utils.setSetting('githubToken', document.getElementById('sk-gh').value.trim());
                        // Config 1
                        Utils.setSetting('githubUser', document.getElementById('sk-u').value.trim());
                        Utils.setSetting('githubRepo', document.getElementById('sk-r').value.trim());
                        Utils.setSetting('githubPath', document.getElementById('sk-p').value.trim());
                        // Config 2
                        Utils.setSetting('githubUser2', document.getElementById('sk-u2').value.trim());
                        Utils.setSetting('githubRepo2', document.getElementById('sk-r2').value.trim());
                        Utils.setSetting('githubPath2', document.getElementById('sk-p2').value.trim());

                        Utils.setSetting('twitterPrompt', document.getElementById('tw-prompt').value.trim());
                        Utils.setSetting('promptAnalyze', document.getElementById('prompt-analyze').value.trim());
                        Utils.setSetting('promptSummaryCN', document.getElementById('prompt-summary-cn').value.trim());
                        
                        Utils.setSetting('ttsVoiceCN', document.getElementById('sk-voice-cn').value);
                        Utils.setSetting('ttsVoiceEN', document.getElementById('sk-voice-en').value);

                        const sourceContainer = document.getElementById('tts-source-container');
                        const rows = sourceContainer.querySelectorAll('.tts-source-row');
                        const newSources = [];
                        rows.forEach(row => {
                            const url = row.querySelector('.tts-url-input').value.trim();
                            const token = row.querySelector('.tts-token-input').value.trim();
                            if(url) newSources.push({ url, token });
                        });
                        Utils.setSetting('ttsSources', newSources);

                        alert(`✅ 设置已保存`);
                        this.closeModal();
                    }
                }]);
            },
            renderStylesList() {
                const container = document.getElementById('dr-styles-list');
                if (!container) return;
                container.innerHTML = '';
                const createRow = (id, label, prompt, isCustom) => {
                    const div = document.createElement('div'); div.className = 'dr-style-item';
                    const leftDiv = document.createElement('div'); leftDiv.className = 'dr-style-item-left';
                    const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'style-default-group'; radio.className = 'dr-radio'; radio.checked = (AppState.tempDefaultStyle === id); radio.onclick = () => { AppState.tempDefaultStyle = id; };
                    const span = document.createElement('span'); span.className = 'dr-style-label'; span.textContent = (isCustom ? '✨ ' : '📝 ') + label; span.onclick = () => { radio.checked = true; AppState.tempDefaultStyle = id; };
                    leftDiv.append(radio, span); div.appendChild(leftDiv);
                    if (isCustom) {
                        const rightDiv = document.createElement('div'); rightDiv.className = 'dr-style-item-right';
                        const editBtn = document.createElement('button'); editBtn.className = 'dr-btn dr-btn-edit'; editBtn.textContent = '✏️ 编辑';
                        editBtn.onclick = () => {
                            document.getElementById('dr-new-style-name').value = label; document.getElementById('dr-new-style-prompt').value = prompt;
                            AppState.editingStyleId = id; const addBtn = document.getElementById('dr-add-style-btn'); addBtn.textContent = '💾 保存修改'; addBtn.className = 'dr-btn dr-btn-success';
                        };
                        const delBtn = document.createElement('button'); delBtn.className = 'dr-btn dr-btn-danger'; delBtn.textContent = '删除';
                        delBtn.onclick = () => {
                            if (AppState.editingStyleId === id) { AppState.editingStyleId = null; document.getElementById('dr-new-style-name').value = ''; document.getElementById('dr-new-style-prompt').value = ''; const addBtn = document.getElementById('dr-add-style-btn'); addBtn.textContent = '➕ 添加新风格'; addBtn.className = 'dr-btn dr-btn-primary'; }
                            if (AppState.tempDefaultStyle === id) { AppState.tempDefaultStyle = 'SIMPLE'; }
                            const idx = AppState.tempCustomStyles.findIndex(s => s.id === id);
                            if (idx > -1) { AppState.tempCustomStyles.splice(idx, 1); this.renderStylesList(); }
                        };
                        rightDiv.append(editBtn, delBtn); div.appendChild(rightDiv);
                    }
                    return div;
                };
                container.appendChild(createRow('SIMPLE', '简练', '', false));
                AppState.tempCustomStyles.forEach(style => { container.appendChild(createRow(style.id, style.label, style.prompt, true)); });
            },
            buildFooter(btns) {
                this.elements.footer.innerHTML = '';
                btns.forEach(b => {
                    const btn = document.createElement('button'); btn.className = `dr-btn dr-btn-${b.type}`; btn.textContent = b.text;
                    if (b.id) btn.id = b.id;
                    btn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
                    btn.onclick = b.onClick;
                    this.elements.footer.appendChild(btn);
                });
            },
            updateTTSButton(playing) {
                const btn = document.getElementById('dr-tts-btn');
                if (btn) { btn.textContent = playing ? '🔇 停止' : '🔊 朗读'; btn.className = playing ? 'dr-btn dr-btn-gray' : 'dr-btn dr-btn-primary'; }
            },
            setFloatBtnVisible(visible) {
                if (!Utils.getSetting('enableFloatBtn')) { this.elements.floatBtn.classList.remove('visible'); return; }
                if (this.autoHideTimer) { clearTimeout(this.autoHideTimer); this.autoHideTimer = null; }
                if (visible) { this.elements.floatBtn.classList.add('visible'); this.autoHideTimer = setTimeout(() => { this.elements.floatBtn.classList.remove('visible'); }, 6000); } else { this.elements.floatBtn.classList.remove('visible'); }
            }
        };

        // --- Core Controller ---
        const CoreController = {
            async startAnalysis(targetText) {
                const text = targetText || AppState.analysisText;
                if (!text) return;
                GM_setValue(CONSTANTS.HISTORY_KEY, text);
                
                const activeId = Utils.getServiceIdForTask('ANALYSIS');
                UIManager.openModal('深度分析', 'ANALYSIS');
                UIManager.updateStatus('AI 思考中...');
                
                const specificCacheKey = Utils.getCacheKey('ana_' + activeId, text);
                const cached = GM_getValue(specificCacheKey);
                
                if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_EXPIRY) {
                    let cachedId = cached.serviceId;
                    if (!cachedId) {
                        const s = Utils.getAIServices().find(x => x.name === cached.service);
                        if(s) cachedId = s.id;
                    }
                    UIManager.renderAnalysisUI(text, cached.content, cached.service + '(Cache)', cachedId);
                    return;
                }
                
                try {
                    const res = await LLMService.analyzeWithFailover(text, 'promptAnalyze', activeId);
                    GM_setValue(specificCacheKey, { 
                        timestamp: Date.now(), 
                        content: res.content, 
                        service: res.service,
                        serviceId: res.serviceId 
                    });
                    UIManager.renderAnalysisUI(text, res.content, res.service, res.serviceId);
                } catch (e) {
                    UIManager.updateStatus(`❌ ${e.message}`);
                    UIManager.buildFooter([{ text: '⚙️ 配置 API', type: 'primary', onClick: () => UIManager.renderSettings() }]);
                }
            },
            async switchModel(serviceId) {
                const text = AppState.analysisText || GM_getValue(CONSTANTS.HISTORY_KEY);
                if (!text) return alert('请重新选择文本');
                
                const services = Utils.getAIServices();
                const targetService = services.find(s => s.id === serviceId);
                if (!targetService) return alert('无效的服务 ID');

                const cacheKey = Utils.getCacheKey('ana_' + serviceId, text);
                const cached = GM_getValue(cacheKey);
                
                if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_EXPIRY) {
                    UIManager.renderAnalysisUI(text, cached.content, cached.service + '(Cache)', serviceId);
                    return;
                }
                
                UIManager.updateStatus(`🤖 切换至 ${targetService.name} 分析中...`);
                try {
                    const messages = [{ role: 'system', content: Utils.getSetting('promptAnalyze') }, { role: 'user', content: text }];
                    const result = await LLMService.request(targetService, messages);
                    
                    GM_setValue(cacheKey, { 
                        timestamp: Date.now(), 
                        content: result, 
                        service: targetService.name,
                        serviceId: serviceId
                    });
                    
                    UIManager.renderAnalysisUI(text, result, targetService.name, serviceId);
                } catch (e) {
                    UIManager.updateStatus(`❌ ${targetService.name} 失败: ${e.message}`);
                    UIManager.buildFooter([{ text: '重试', type: 'primary', onClick: () => this.switchModel(serviceId) }]);
                }
            },
            async startSummary(lang, specificStyle = null) {
                AppState.currentSummaryLang = lang;
                let content = '';
                try {
                    if (typeof Readability !== 'undefined') { const article = new Readability(document.cloneNode(true)).parse(); content = article ? article.textContent : document.body.innerText; } else { content = document.body.innerText; }
                } catch (e) { content = document.body.innerText; }
                if (!content || content.length < 50) return alert('内容过短');
                
                let prompt = '';
                let cacheStyleKey = '';
                if (lang === 'zh') {
                    prompt = Utils.getSetting('promptSummaryCN'); cacheStyleKey = 'default';
                    UIManager.openModal('中文总结', 'SUMMARY', 'zh');
                } else {
                    const savedDefault = Utils.getSetting('defaultSummaryStyle') || 'SIMPLE';
                    const styleKey = specificStyle || savedDefault;
                    const allStyles = Utils.getAllStyles();
                    let styleObj = allStyles[styleKey];
                    if (!styleObj) { styleObj = allStyles['SIMPLE']; cacheStyleKey = 'SIMPLE'; } else { cacheStyleKey = styleKey; }
                    prompt = styleObj.prompt;
                    UIManager.openModal('Summary', 'SUMMARY', 'en', cacheStyleKey);
                }

                const activeId = Utils.getServiceIdForTask('SUMMARY');

                UIManager.updateStatus(`生成中...`);
                const urlId = window.location.pathname + window.location.search;
                const cacheKey = Utils.getCacheKey(`sum_${lang}_${cacheStyleKey}_${activeId}`, urlId);
                const cached = GM_getValue(cacheKey);
                if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_EXPIRY) {
                    UIManager.renderSummaryUI(cached.content, true, 'Cache');
                    return;
                }
                try {
                    const services = Utils.getAIServices();
                    const sortedServices = services.sort((a, b) => {
                         if (a.id === activeId) return -1;
                         if (b.id === activeId) return 1;
                         return 0;
                    });

                    let successRes = null;
                    let lastErr = null;
                    for (const svc of sortedServices) {
                        if (!Utils.getSetting('enableFailover') && svc.id !== activeId) break;
                        try {
                             UIManager.updateStatus(`🤖 ${svc.name} 总结中...`);
                             const res = await LLMService.request(svc, [{ role: 'system', content: prompt }, { role: 'user', content: content.slice(0, 15000) }]);
                             successRes = { content: res, service: svc.name };
                             break;
                        } catch(e) { lastErr = e; }
                    }

                    if (successRes) {
                        GM_setValue(cacheKey, { timestamp: Date.now(), content: successRes.content });
                        UIManager.renderSummaryUI(successRes.content, false, successRes.service);
                    } else { throw lastErr || new Error("All AI Failed"); }
                } catch (e) {
                    UIManager.updateStatus(`❌ ${e.message}`);
                    UIManager.buildFooter([{ text: '⚙️ 检查配置', type: 'primary', onClick: () => UIManager.renderSettings() }]);
                }
            },
            async pushGitHub(content, mode = 'BOTH') {
                const token = Utils.getSetting('githubToken');
                if (!token) return alert('请先设置 Token');
                
                const currentUrl = window.location.href;
                const pageTitle = document.title || 'Untitled';

                // Helper: Push Logic
                const pushFile = async (user, repo, path, fileContent, message, checkSha = false) => {
                    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
                    let sha = null;
                    
                    if (checkSha) {
                        try { 
                            const r = await new Promise((ok, no) => GM_xmlhttpRequest({ method: 'GET', url: apiUrl, headers: { Authorization: `Bearer ${token}` }, onload: ok, onerror: no })); 
                            if (r.status === 200) { const d = JSON.parse(r.responseText); sha = d.sha; } 
                        } catch (e) { }
                    }

                    const b64Content = btoa(unescape(encodeURIComponent(fileContent)));
                    return new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'PUT', url: apiUrl, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                            data: JSON.stringify({ message: message, content: b64Content, sha }),
                            onload: (r) => { if (r.status < 300) resolve(); else reject(`Code ${r.status}`); },
                            onerror: () => reject('Network Error')
                        });
                    });
                };

                const tasks = [];

                // 1. Push Note (Markdown) - Overwrite Mode
                if (mode === 'NOTE' || mode === 'BOTH') {
                    const user1 = Utils.getSetting('githubUser');
                    const repo1 = Utils.getSetting('githubRepo');
                    const path1 = Utils.getSetting('githubPath');
                    if (user1 && repo1 && path1) {
                        const mdContent = `# ${pageTitle}\n\n> 📅 ${new Date().toLocaleString()}\n> 🔗 ${currentUrl}\n\n${content}`;
                        tasks.push(pushFile(user1, repo1, path1, mdContent, `DeepRead Note: ${pageTitle}`, true)
                            .then(() => "✅ 笔记(MD)推送成功")
                            .catch(e => `❌ 笔记推送失败: ${e}`));
                    }
                }

                // 2. Push Archive (HTML) - New File Mode
                if (mode === 'ARCHIVE' || mode === 'BOTH') {
                    const user2 = Utils.getSetting('githubUser2');
                    const repo2 = Utils.getSetting('githubRepo2');
                    const basePath2 = Utils.getSetting('githubPath2'); // e.g. "danmu/"
                    
                    if (user2 && repo2 && basePath2) {
                        // Sanitize filename: Replace non-alphanumeric chars (except Chinese) with underscore
                        const safeTitle = pageTitle.replace(/[^\w\u4e00-\u9fa5]/g, '_').substring(0, 50);
                        const fileName = `${safeTitle}_${Date.now()}.html`;
                        const fullPath2 = (basePath2.endsWith('/') ? basePath2 : basePath2 + '/') + fileName;
                        
                        const htmlContent = Utils.generateHTMLContent(pageTitle, currentUrl, content);
                        
                        tasks.push(pushFile(user2, repo2, fullPath2, htmlContent, `DeepRead Archive: ${pageTitle}`, false)
                            .then(() => "✅ 归档(HTML)推送成功")
                            .catch(e => `❌ 归档推送失败: ${e}`));
                    }
                }

                if (tasks.length === 0) return alert("❌ 未配置相关仓库信息");

                const btn = document.querySelector('.dr-footer button'); // Just to give visual feedback on one button
                const originalText = btn ? btn.innerText : '';
                if (btn) { btn.innerText = '⏳ 推送中...'; btn.disabled = true; }

                Promise.all(tasks).then(results => {
                    alert(results.join('\n'));
                }).finally(() => {
                    if (btn) { btn.innerText = originalText; btn.disabled = false; }
                    // Reset UI to default state
                    UIManager.renderSummaryUI(content, true, 'Result'); 
                });
            }
        };
        
                // 【新增】将核心控制器暴露给全局，供 Twitter 模块调用
        window.DeepReadCore = CoreController;


        // --- 初始化 DeepRead ---
        UIManager.init();
        let selTimer;
        document.addEventListener('selectionchange', () => {
            if (AppState.isModalOpen) return;
            clearTimeout(selTimer);
            selTimer = setTimeout(() => {
                const txt = window.getSelection().toString().trim();
                if (txt.length > 1) { AppState.analysisText = txt; UIManager.setFloatBtnVisible(true); } else { AppState.analysisText = ''; }
            }, 200);
        });
        const handleScroll = Utils.debounce(() => {
            const currentScrollY = window.scrollY;
            if (AppState.analysisText) { UIManager.setFloatBtnVisible(true); }
            else { if (currentScrollY > AppState.lastScrollY && currentScrollY > 100) { UIManager.setFloatBtnVisible(false); } else { UIManager.setFloatBtnVisible(true); } }
            AppState.lastScrollY = currentScrollY;
        }, 100);
        window.addEventListener('scroll', handleScroll);
        GM_registerMenuCommand("⚙️ ReadSense 设置", () => { UIManager.openModal('⚙️ 设置', 'SETTINGS'); UIManager.renderSettings(); });
    }

    // =========================================================================
    // [2] MODULE: Twitter/X Reader (复用 DeepRead 核心)
    // =========================================================================
    function initTwitterReader() {
        if (!location.hostname.match(/(twitter|x)\.com/)) return;
        console.log('✅ Twitter/X Reader Module Loading (Lite Mode)...');

        // 仅保留行内翻译所需的样式，移除弹窗样式
        GM_addStyle(`
            .ai-inline-btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; vertical-align: text-bottom; font-size: 0; transition: all 0.2s; position: relative; margin-left: 4px; }
            .ai-inline-btn:hover { transform: scale(1.15); }
            .ai-inline-btn svg { width: 10px; height: 10px; fill: currentColor; }
            .ai-inline-btn.loading { animation: spin 1s linear infinite; border-color: transparent !important; border-top-color: currentColor !important; }
            .ai-analyze-btn { background-color: rgba(139, 115, 85, 0.15); border: 1px solid rgba(139, 115, 85, 0.3); color: #8b7355; }
            .ai-analyze-btn:hover { background-color: rgba(139, 115, 85, 0.25); }
            .ai-trans-btn { margin-right: 5px; background-color: rgba(128, 128, 128, 0.15); border: 1px solid rgba(128, 128, 128, 0.3); color: #666; }
            .ai-trans-btn:hover { background-color: rgba(128, 128, 128, 0.25); color: #333; }
            .ai-translation-block { display: block; margin-top: 10px; padding: 10px 14px; background-color: #f7f9f9; border-left: 3px solid #999; color: #333; font-size: 15px; line-height: 1.5; border-radius: 4px; width: 100%; box-sizing: border-box; animation: fadeIn 0.3s ease; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        `);

        // 获取翻译配置 (保留给行内翻译使用)
        function getTranslateConfig() {
            const services = GM_getValue('deepread_ai_services_list', []);
            if (!services.length) return null;
            const targetId = GM_getValue('deepread_task_translate_id', '') || GM_getValue('deepread_active_ai_id', '');
            const active = services.find(s => s.id === targetId) || services[0];
            return { apiUrl: active.url, apiKey: active.key, modelName: active.model };
        }

        function generateCacheKey(text, suffix) {
            let str = text + "|" + suffix; let hash = 0;
            for (let i = 0; i < str.length; i++) hash = ((hash << 5) - hash) + str.charCodeAt(i) | 0;
            return 'twitter_lite_' + Math.abs(hash);
        }

        // --- 核心改动：直接调用 DeepRead 的主控制器 ---
        function handleAnalysis(textToAnalyze) {
            if (window.DeepReadCore && typeof window.DeepReadCore.startAnalysis === 'function') {
                // 直接唤起 DeepRead 的主弹窗
                window.DeepReadCore.startAnalysis(textToAnalyze);
            } else {
                alert('DeepRead Core 未就绪，请刷新页面重试。');
            }
        }

        // --- 行内翻译逻辑 (保留，因为 DeepRead 主弹窗不适合做行内插入) ---
        async function handleInlineTranslation(btn, textContainer, textToTranslate) {
            const transType = GM_getValue('twitterTranslationType', 'AI');
            let transBlock = textContainer.querySelector('.ai-translation-block');
            if (transBlock) { transBlock.style.display = transBlock.style.display === 'none' ? 'block' : 'none'; return; }
            
            transBlock = document.createElement('div'); transBlock.className = 'ai-translation-block'; transBlock.innerHTML = '<span style="color:#999;font-style:italic;">⏳ 正在翻译...</span>';
            textContainer.appendChild(transBlock);
            btn.classList.add('loading');

            if (transType === 'GOOGLE') {
                const cacheKey = generateCacheKey(textToTranslate, "google");
                const cached = localStorage.getItem(cacheKey);
                if (cached) { transBlock.innerHTML = cached; btn.classList.remove('loading'); return; }
                
                GM_xmlhttpRequest({
                    method: "GET", url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(textToTranslate)}`,
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText); let result = ""; if (data && data[0]) data[0].forEach(item => { if (item[0]) result += item[0]; });
                            transBlock.innerHTML = result.replace(/\n/g, '<br>'); localStorage.setItem(cacheKey, transBlock.innerHTML);
                        } catch (e) { transBlock.innerHTML = "Google 解析失败"; }
                        btn.classList.remove('loading');
                    },
                    onerror: () => { transBlock.innerHTML = "网络错误"; btn.classList.remove('loading'); }
                });
            } else {
                // AI 翻译模式
                const config = getTranslateConfig();
                if (!config || !config.apiKey) { transBlock.innerHTML = "❌ 请在设置中配置 AI Key"; btn.classList.remove('loading'); return; }
                
                const cacheKey = generateCacheKey(textToTranslate, "ai_" + config.modelName);
                const cached = localStorage.getItem(cacheKey);
                if (cached) { transBlock.innerHTML = cached; btn.classList.remove('loading'); return; }

                try {
                    GM_xmlhttpRequest({
                        method: "POST", url: config.apiUrl,
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.apiKey}` },
                        data: JSON.stringify({ model: config.modelName, messages: [{ role: "system", content: "Translate to Chinese directly." }, { role: "user", content: textToTranslate }], temperature: 0.3 }),
                        onload: (res) => {
                            try {
                                const data = JSON.parse(res.responseText);
                                const content = data.choices[0].message.content.replace(/\n/g, '<br>') + `<div style="font-size:10px;color:#ccc;margin-top:5px;text-align:right">by ${config.modelName}</div>`;
                                transBlock.innerHTML = content; localStorage.setItem(cacheKey, content);
                            } catch(e) { transBlock.innerHTML = "AI 解析失败"; }
                            btn.classList.remove('loading');
                        },
                        onerror: () => { transBlock.innerHTML = "AI 请求失败"; btn.classList.remove('loading'); }
                    });
                } catch (e) { transBlock.innerHTML = "请求错误"; btn.classList.remove('loading'); }
            }
        }

        // --- DOM 处理 ---
        function processTweetText(element) {
            if (element.getAttribute('data-ai-processed') === 'true') return;
            if (element.innerText.trim().length < 2) return;
            
            // 1. 翻译按钮 (地球图标) - 保留原有行内逻辑
            const transBtn = document.createElement('span'); transBtn.className = 'ai-inline-btn ai-trans-btn';
            transBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>';
            transBtn.title = "行内翻译";
            transBtn.onclick = (e) => { e.stopPropagation(); e.preventDefault(); const clone = element.cloneNode(true); clone.querySelectorAll('.ai-inline-btn').forEach(b => b.remove()); handleInlineTranslation(transBtn, element, clone.innerText); };
            if (element.firstChild) element.insertBefore(transBtn, element.firstChild); else element.appendChild(transBtn);
            
            // 2. 分析按钮 (大脑图标) - 现在调用 DeepRead 统一弹窗
            const aiBtn = document.createElement('span'); aiBtn.className = 'ai-inline-btn ai-analyze-btn';
            aiBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>';
            aiBtn.title = "DeepRead 深度分析";
            aiBtn.onclick = (e) => { 
                e.stopPropagation(); e.preventDefault(); 
                const clone = element.cloneNode(true); 
                clone.querySelectorAll('.ai-inline-btn').forEach(b => b.remove()); 
                // 调用新的统一接口
                handleAnalysis(clone.innerText); 
            };
            element.appendChild(aiBtn);
            element.setAttribute('data-ai-processed', 'true');
        }

        function initObserver() {
            const debouncedProcess = (function(func, wait){ let t; return function(){ clearTimeout(t); t = setTimeout(func, wait); }; })(() => {
                document.querySelectorAll('[data-testid="tweetText"]').forEach(processTweetText);
            }, 500);

            const observer = new MutationObserver((mutations) => {
                if (mutations.some(m => m.addedNodes.length > 0)) debouncedProcess();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            document.querySelectorAll('[data-testid="tweetText"]').forEach(processTweetText);
        }
        
        GM_registerMenuCommand("🐦 Twitter 最近分析", () => {
            const lastText = GM_getValue('deepread_last_text_pointer', null);
            if (lastText && window.DeepReadCore) {
                window.DeepReadCore.startAnalysis(lastText);
            } else {
                alert('⚠️ 暂无最近分析记录');
            }
        });
        
        window.addEventListener('load', initObserver);
        setTimeout(initObserver, 1500);
    }
    // =========================================================================
    // [3] INITIALIZATION
    // =========================================================================
    initDeepRead();
    initTwitterReader();

})();
