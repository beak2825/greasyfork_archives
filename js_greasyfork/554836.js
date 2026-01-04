// ==UserScript==
// @name         AI 划词助手
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  移动端优化：1.选中文本预览区固定顶部；2.原生级顶部抽屉(支持手势实时上推拖拽关闭)；3.悬浮球常驻：下滚隐藏/上滚显示，选中强制显示；4.支持自定义OpenAI接口。
// @author       FocusReader & 整合版 & GROQ/KIMI/ZHIPU (精简 by AI)
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      api.groq.com
// @connect      api.moonshot.cn
// @connect      open.bigmodel.cn
// @connect      *
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554836/AI%20%E5%88%92%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/554836/AI%20%E5%88%92%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 常量定义 ---
    const DEFAULT_TTS_URL = 'https://ms-ra-forwarder-for-ifreetime-2.vercel.app/api/aiyue?text=';
    const DEFAULT_VOICE_SUFFIX = '&voiceName=en-US-EricNeural';
    const CACHE_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;
    const MAX_CACHE_SIZE = 100;
    const DEBOUNCE_DELAY = 100;
    const SCROLL_DELAY = 50;

    const DEFAULT_INSTRUCTION = `你是一个智能语言助手。请分析用户提供的文本。

如果是**句子或段落**，请包含：
1. 【难度】评级（A1-C2）
2. 【语法】核心结构解析
3. 【翻译】准确流畅的中文翻译
4. 【重点】关键短语及例句

如果是**单词**，请包含：
1. 【音标】及发音要点
2. 【释义】详细含义及词性
3. 【搭配】常用词组
4. 【例句】中英对照

请使用 Markdown 格式，用 **加粗** 标出重点，保持回答简洁实用。`;

    const AI_SERVICES = {
        GROQ: { name: 'Groq', url: 'https://api.groq.com/openai/v1/chat/completions', defaultModel: 'llama3-8b-8192' },
        KIMI: { name: 'Kimi', url: 'https://api.moonshot.cn/v1/chat/completions', defaultModel: 'moonshot-v1-8k' },
        ZHIPU: { name: 'ChatGLM', url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', defaultModel: 'glm-4' },
        CUSTOM: { name: 'Custom', url: '', defaultModel: 'gpt-3.5-turbo' } // URL由用户配置
    };

    const AI_SERVICE_ORDER = ['GROQ', 'ZHIPU', 'KIMI', 'CUSTOM'];

    // --- 用户配置 ---
    let userSettings = {
        activeService: GM_getValue('activeService', 'GROQ'),
        // API Keys
        groqApiKey: GM_getValue('groqApiKey', ''),
        kimiApiKey: GM_getValue('kimiApiKey', ''),
        zhipuApiKey: GM_getValue('zhipuApiKey', ''),
        customApiKey: GM_getValue('customApiKey', ''),
        // Models
        groqModel: GM_getValue('groqModel', AI_SERVICES.GROQ.defaultModel),
        kimiModel: GM_getValue('kimiModel', AI_SERVICES.KIMI.defaultModel),
        zhipuModel: GM_getValue('zhipuModel', AI_SERVICES.ZHIPU.defaultModel),
        customModel: GM_getValue('customModel', AI_SERVICES.CUSTOM.defaultModel),
        // Custom URL
        customUrl: GM_getValue('customUrl', 'https://api.openai.com/v1/chat/completions'),
        // General
        customInstruction: GM_getValue('customInstruction', DEFAULT_INSTRUCTION),
        ttsUrl: GM_getValue('ttsUrl', DEFAULT_TTS_URL),
        enableFloatingButton: GM_getValue('enableFloatingButton', true)
    };

    // --- 辅助函数 ---
    function getServiceConfig(serviceKey) {
        const defaults = AI_SERVICES[serviceKey];
        let config = { key: '', model: '', name: defaults.name, url: defaults.url, serviceKey: serviceKey };
        
        if (serviceKey === 'GROQ') { 
            config.key = userSettings.groqApiKey; 
            config.model = userSettings.groqModel; 
        } else if (serviceKey === 'KIMI') { 
            config.key = userSettings.kimiApiKey; 
            config.model = userSettings.kimiModel; 
        } else if (serviceKey === 'ZHIPU') { 
            config.key = userSettings.zhipuApiKey; 
            config.model = userSettings.zhipuModel; 
        } else if (serviceKey === 'CUSTOM') {
            config.key = userSettings.customApiKey;
            config.model = userSettings.customModel;
            config.url = userSettings.customUrl; // 自定义URL
        }
        return config;
    }

    function getNextServiceKey(currentServiceKey) {
        let order = [userSettings.activeService, ...AI_SERVICE_ORDER.filter(k => k !== userSettings.activeService)];
        const idx = order.indexOf(currentServiceKey);
        return (idx !== -1 && idx < order.length - 1) ? order[idx + 1] : null;
    }

    // --- 状态管理 ---
    let appState = {
        isAiModalOpen: false,
        isSettingsModalOpen: false,
        lastScrollY: 0,
        lastAnalyzedText: '',
        isScrollingDown: false
    };

    // --- 缓存管理 ---
    class CacheManager {
        static getCache() { try { return JSON.parse(GM_getValue('aiExplainCache', '{}')); } catch { return {}; } }
        static setCache(cache) { GM_setValue('aiExplainCache', JSON.stringify(cache)); }
        static get(key) {
            const cache = this.getCache();
            if (!cache[key] || Date.now() - cache[key].timestamp > CACHE_EXPIRE_TIME) return null;
            return cache[key].data;
        }
        static set(key, data) {
            const cache = this.getCache();
            const now = Date.now();
            Object.keys(cache).forEach(k => { if (now - cache[k].timestamp > CACHE_EXPIRE_TIME) delete cache[k]; });
            const keys = Object.keys(cache);
            if (keys.length >= MAX_CACHE_SIZE) {
                keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
                delete cache[keys[0]];
            }
            cache[key] = { data, timestamp: now };
            this.setCache(cache);
        }
    }

    // --- 工具函数 ---
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function(...args) { clearTimeout(timeout); timeout = setTimeout(() => func.apply(this, args), wait); };
        },
        isValidText(text) { return text && text.trim().length > 0; },
        showToast(message, duration = 2000) {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.className = 'ai-toast';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), duration);
        }
    };

    // --- 样式注入 (CSS) ---
    GM_addStyle(`
        /* Toast 提示 */
        .ai-toast {
            position: fixed; top: 12%; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.85); color: #fff; padding: 10px 20px;
            border-radius: 25px; font-size: 14px; z-index: 100005;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: aiFadeIn 0.3s;
            pointer-events: none;
        }
        @keyframes aiFadeIn { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }

        /* 悬浮球 */
        #aiFloatBtn {
            position: fixed; right: 20px; top: 60%; 
            transform: translateY(-50%) translateX(0);
            width: 48px; height: 48px; border-radius: 50%;
            background: linear-gradient(135deg, #007AFF, #0056b3);
            color: white; border: none; font-size: 22px; cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,122,255,0.4); z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.4s cubic-bezier(0.2, 0, 0, 1), opacity 0.4s, box-shadow 0.3s;
            -webkit-tap-highlight-color: transparent;
        }
        #aiFloatBtn:active { transform: translateY(-50%) translateX(0) scale(0.9); box-shadow: 0 2px 8px rgba(0,122,255,0.3); }
        #aiFloatBtn.float-hidden { transform: translateY(-50%) translateX(150%); opacity: 0.6; }

        /* 模态框遮罩 */
        .ai-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 100000;
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(2px);
            opacity: 0; visibility: hidden; 
            transition: opacity 0.3s ease, visibility 0.3s;
        }
        .ai-overlay.active { opacity: 1; visibility: visible; }

        /* 模态框主体 */
        .ai-modal {
            background: #ffffff; color: #333; width: 500px; max-width: 90vw;
            max-height: 85vh; border-radius: 16px; display: flex; flex-direction: column;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3); overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            position: relative;
            transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* 移动端优化 */
        @media (max-width: 768px) {
            .ai-overlay { align-items: flex-start; }
            .ai-modal {
                width: 100% !important; max-width: 100% !important;
                height: 80vh !important; max-height: 80vh !important;
                border-radius: 0 0 24px 24px; top: 0;
                transform: translateY(-100%);
            }
            .ai-overlay.active .ai-modal { transform: translateY(0); }
        }

        /* 暗黑模式 */
        @media (prefers-color-scheme: dark) {
            .ai-modal { background: #1c1c1e; color: #e0e0e0; }
            .ai-header { border-bottom: 0.5px solid #38383a; background: #2c2c2e; }
            .ai-footer { border-top: 0.5px solid #38383a; background: #2c2c2e; }
            .ai-input, .ai-textarea { background: #2c2c2e; color: #fff; border-color: #444; }
            .ai-result-box { background: #1c1c1e; }
        }

        /* 头部 - 固定 */
        .ai-header {
            padding: 18px; font-weight: 600; font-size: 17px;
            display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0; user-select: none; position: relative; cursor: grab;
        }
        .ai-header::after {
            content: ''; position: absolute; bottom: 6px; left: 50%; transform: translateX(-50%);
            width: 36px; height: 4px; background: rgba(120, 120, 128, 0.3); border-radius: 2px;
        }

        /* 选中文本预览 */
        .ai-text-preview {
            font-size: 14px; color: #8e8e93; 
            padding: 12px; margin: 0 20px 10px 20px;
            background: rgba(120, 120, 128, 0.08); 
            border-radius: 12px; font-style: italic;
            max-height: 80px; overflow-y: auto;
            border-left: 3px solid #007AFF;
            flex-shrink: 0; display: none;
        }

        /* 内容区 */
        .ai-body { 
            padding: 5px 20px 20px 20px; overflow-y: auto; flex-grow: 1; -webkit-overflow-scrolling: touch; 
        }

        /* 底部 */
        .ai-footer { 
            padding: 16px; display: flex; flex-direction: column; gap: 12px; 
            flex-shrink: 0; padding-bottom: max(16px, env(safe-area-inset-bottom)); 
        }
        
        /* 按钮与组件 */
        .ai-btn-group { display: flex; flex-direction: row; gap: 12px; width: 100%; }
        .ai-status-text { font-size: 12px; color: #8e8e93; text-align: center; }
        .ai-btn {
            flex: 1; padding: 12px 0; border-radius: 10px; border: none; cursor: pointer;
            font-size: 15px; font-weight: 600; display: flex; align-items: center; justify-content: center;
            transition: opacity 0.2s; white-space: nowrap;
        }
        .ai-btn-primary { background: #007AFF; color: white; }
        .ai-btn-secondary { background: rgba(120, 120, 128, 0.12); color: #007AFF; }
        .ai-btn:active { opacity: 0.7; }

        .ai-result-box { font-size: 16px; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
        .ai-result-box strong { color: #007AFF; font-weight: 700; }
        
        .ai-spinner {
            width: 16px; height: 16px; border: 2px solid rgba(0,0,0,0.1);
            border-top: 2px solid #007AFF; border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .ai-form-group { margin-bottom: 20px; }
        .ai-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }
        .ai-input, .ai-textarea { width: 100%; padding: 12px; border: 1px solid rgba(0,0,0,0.1); border-radius: 10px; font-size: 16px; box-sizing: border-box; }
        .ai-textarea { min-height: 100px; resize: vertical; }
        .ai-radio-group { display: flex; gap: 15px; flex-wrap: wrap; }
    `);

    // --- UI 构建 ---
    let ui = {};

    function createUI() {
        const aiModalOverlay = document.createElement('div');
        aiModalOverlay.className = 'ai-overlay';
        aiModalOverlay.id = 'aiMainOverlay';
        aiModalOverlay.innerHTML = `
            <div class="ai-modal" role="dialog" id="aiMainModal">
                <div class="ai-header" id="aiModalHeader">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span>🤖 AI 助手</span>
                        <div id="aiLoading" style="display:none; align-items:center; gap:5px; font-size:12px; font-weight:normal; color:#8e8e93;">
                            <div class="ai-spinner"></div> 思考中...
                        </div>
                    </div>
                    <span style="font-size:22px; color:#8e8e93; cursor:pointer; padding:0 10px;" id="aiHeaderClose">×</span>
                </div>
                <div id="aiSelectedText" class="ai-text-preview" style="display:none;"></div>
                
                <div class="ai-body" id="aiModalBody">
                    <div id="aiEmptyTip" style="display:none; text-align:center; color:#999; margin-top:50px;">
                        👇 请输入文本或选择网页内容
                    </div>
                    <div id="aiContent" class="ai-result-box"></div>
                </div>
                <div class="ai-footer" id="aiModalFooter">
                    <div class="ai-btn-group">
                        <button id="aiBtnCopy" class="ai-btn ai-btn-secondary">📋 复制</button>
                        <button id="aiBtnPlay" class="ai-btn ai-btn-secondary">🔊 朗读</button>
                        <button id="aiBtnClose" class="ai-btn ai-btn-secondary" style="background:rgba(120,120,128,0.2); color:inherit;">关闭</button>
                    </div>
                    <div class="ai-status-text" id="aiStatusText"></div>
                </div>
            </div>
        `;

        const settingsModalOverlay = document.createElement('div');
        settingsModalOverlay.className = 'ai-overlay';
        settingsModalOverlay.id = 'aiSettingsOverlay';
        settingsModalOverlay.style.zIndex = '100006';
        settingsModalOverlay.innerHTML = `
            <div class="ai-modal">
                <div class="ai-header">⚙️ 助手设置</div>
                <div class="ai-body">
                    <div class="ai-form-group" style="background:rgba(0,0,0,0.03); padding:15px; border-radius:12px;">
                        <label class="ai-label">悬浮球设置</label>
                        <label style="display:flex; align-items:center; gap:10px; font-size:16px;">
                            <input type="checkbox" id="setFloatBtn" style="transform:scale(1.2)" ${userSettings.enableFloatingButton ? 'checked' : ''}>
                            启用悬浮球 (下滚隐藏/上滚显示)
                        </label>
                    </div>
                    <div class="ai-form-group">
                        <label class="ai-label">AI 服务商</label>
                        <div class="ai-radio-group">
                            <label><input type="radio" name="activeService" value="GROQ" ${userSettings.activeService==='GROQ'?'checked':''}> Groq</label>
                            <label><input type="radio" name="activeService" value="ZHIPU" ${userSettings.activeService==='ZHIPU'?'checked':''}> 智谱</label>
                            <label><input type="radio" name="activeService" value="KIMI" ${userSettings.activeService==='KIMI'?'checked':''}> Kimi</label>
                            <label><input type="radio" name="activeService" value="CUSTOM" ${userSettings.activeService==='CUSTOM'?'checked':''}> 自定义</label>
                        </div>
                    </div>
                    
                    <div id="serviceSettingsArea" style="background:rgba(0,122,255,0.03); padding:15px; border-radius:12px; border:1px solid rgba(0,122,255,0.1); margin-bottom:20px;"></div>

                    <div class="ai-form-group">
                        <label class="ai-label">自定义提示词 (Prompt)</label>
                        <textarea id="setInstruction" class="ai-textarea" placeholder="输入自定义指令...">${userSettings.customInstruction}</textarea>
                    </div>
                    <div class="ai-form-group">
                        <label class="ai-label">TTS 朗读源 URL</label>
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="setTtsUrl" class="ai-input" value="${userSettings.ttsUrl}">
                            <button id="btnTestTts" class="ai-btn ai-btn-secondary" style="flex:0 0 auto;">🔊</button>
                        </div>
                    </div>
                </div>
                <div class="ai-footer">
                    <div class="ai-btn-group">
                        <button id="btnCloseSettings" class="ai-btn ai-btn-secondary">取消</button>
                        <button id="btnSaveSettings" class="ai-btn ai-btn-primary">保存设置</button>
                    </div>
                </div>
            </div>
        `;

        const floatBtn = document.createElement('button');
        floatBtn.id = 'aiFloatBtn';
        floatBtn.innerHTML = '💡';
        if (!userSettings.enableFloatingButton) floatBtn.style.display = 'none';

        document.body.appendChild(aiModalOverlay);
        document.body.appendChild(settingsModalOverlay);
        document.body.appendChild(floatBtn);

        ui = {
            aiOverlay: aiModalOverlay,
            aiModal: aiModalOverlay.querySelector('.ai-modal'),
            settingsOverlay: settingsModalOverlay,
            floatBtn: floatBtn,
            content: document.getElementById('aiContent'),
            selectedText: document.getElementById('aiSelectedText'),
            emptyTip: document.getElementById('aiEmptyTip'),
            loading: document.getElementById('aiLoading'),
            status: document.getElementById('aiStatusText'),
            settingsArea: document.getElementById('serviceSettingsArea'),
            aiHeader: document.getElementById('aiModalHeader'),
            aiFooter: document.getElementById('aiModalFooter')
        };
        renderServiceInputs(userSettings.activeService);
    }

    // --- 动态渲染配置输入框 (统一命名) ---
    function renderServiceInputs(service) {
        let html = '';
        const configs = {
            GROQ: { k: userSettings.groqApiKey, m: userSettings.groqModel, p: 'gsk_...', u: null },
            KIMI: { k: userSettings.kimiApiKey, m: userSettings.kimiModel, p: 'sk-...', u: null },
            ZHIPU: { k: userSettings.zhipuApiKey, m: userSettings.zhipuModel, p: '...', u: null },
            CUSTOM: { k: userSettings.customApiKey, m: userSettings.customModel, p: 'sk-...', u: userSettings.customUrl }
        };
        const cfg = configs[service];
        
        if (cfg) {
            // 自定义服务显示 URL 输入框
            if (service === 'CUSTOM') {
                html += `
                <div style="margin-bottom:10px;">
                    <label class="ai-label">API URL (OpenAI Format)</label>
                    <input type="text" id="conf_api_host" class="ai-input" value="${cfg.u}" placeholder="https://api.openai.com/v1/chat/completions">
                </div>`;
            }

            html += `
                <div style="margin-bottom:10px;">
                    <label class="ai-label">${service} API Key</label>
                    <input type="text" id="conf_api_key" class="ai-input" value="${cfg.k}" placeholder="${cfg.p}">
                </div>
                <div>
                    <label class="ai-label">Model Name</label>
                    <input type="text" id="conf_model_name" class="ai-input" value="${cfg.m}">
                </div>
            `;
        }
        ui.settingsArea.innerHTML = html;
    }

    // --- 业务逻辑 ---
    function saveSettings() {
        const activeSvc = document.querySelector('input[name="activeService"]:checked').value;
        
        // 读取统一命名规范的输入框
        const elKey = document.getElementById('conf_api_key');
        const elModel = document.getElementById('conf_model_name');
        const elUrl = document.getElementById('conf_api_host'); // 仅 Custom 存在

        const key = elKey ? elKey.value.trim() : '';
        const model = elModel ? elModel.value.trim() : '';
        
        userSettings.activeService = activeSvc;
        userSettings.customInstruction = document.getElementById('setInstruction').value.trim() || DEFAULT_INSTRUCTION;
        userSettings.ttsUrl = document.getElementById('setTtsUrl').value.trim() || DEFAULT_TTS_URL;
        userSettings.enableFloatingButton = document.getElementById('setFloatBtn').checked;

        GM_setValue('activeService', activeSvc);
        GM_setValue('customInstruction', userSettings.customInstruction);
        GM_setValue('ttsUrl', userSettings.ttsUrl);
        GM_setValue('enableFloatingButton', userSettings.enableFloatingButton);

        if (activeSvc === 'GROQ') { GM_setValue('groqApiKey', key); GM_setValue('groqModel', model); userSettings.groqApiKey = key; userSettings.groqModel = model; }
        else if (activeSvc === 'KIMI') { GM_setValue('kimiApiKey', key); GM_setValue('kimiModel', model); userSettings.kimiApiKey = key; userSettings.kimiModel = model; }
        else if (activeSvc === 'ZHIPU') { GM_setValue('zhipuApiKey', key); GM_setValue('zhipuModel', model); userSettings.zhipuApiKey = key; userSettings.zhipuModel = model; }
        else if (activeSvc === 'CUSTOM') {
            const url = elUrl ? elUrl.value.trim() : '';
            GM_setValue('customApiKey', key); 
            GM_setValue('customModel', model);
            GM_setValue('customUrl', url);
            userSettings.customApiKey = key;
            userSettings.customModel = model;
            userSettings.customUrl = url;
        }

        utils.showToast('✅ 设置已保存');
        toggleOverlay(ui.settingsOverlay, false);
        appState.isSettingsModalOpen = false;
        
        if(userSettings.enableFloatingButton) {
            ui.floatBtn.style.display = 'flex';
            ui.floatBtn.classList.remove('float-hidden');
        } else {
            ui.floatBtn.style.display = 'none';
        }
    }

    function playTTS(text, isTest = false) {
        if (!text) return;
        let url = (isTest ? document.getElementById('setTtsUrl').value : userSettings.ttsUrl) + encodeURIComponent(text);
        if (url.includes('ms-ra-forwarder')) url += DEFAULT_VOICE_SUFFIX;
        try { new Audio(url).play().catch(() => utils.showToast('❌ 播放失败')); if (isTest) utils.showToast('🔊 测试请求发送'); } catch { utils.showToast('❌ 音频错误'); }
    }

    async function fetchAI(text) {
        ui.loading.style.display = 'flex';
        ui.content.innerHTML = '';
        ui.status.textContent = '连接中...';
        ui.emptyTip.style.display = 'none';
        
        appState.lastAnalyzedText = text;

        let serviceKey = userSettings.activeService;
        let attemptCount = 0;

        // 获取配置，如果是 Custom，url 为用户输入，否则为预设
        const currentConfig = getServiceConfig(serviceKey);

        // 如果是自定义且没有 URL，直接报错
        if (serviceKey === 'CUSTOM' && !currentConfig.url) {
             ui.content.innerHTML = '<span style="color:red">❌ 请在设置中配置自定义 API URL。</span>';
             ui.loading.style.display = 'none';
             return;
        }

        // 简单的轮询逻辑（注：Custom 模式通常不自动轮询其他服务，除非逻辑特殊需求，这里保持原逻辑）
        while (serviceKey && attemptCount < 4) {
            const config = getServiceConfig(serviceKey);
            ui.status.textContent = `正在咨询 ${config.name}...`;
            
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST", url: config.url,
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.key}` },
                        data: JSON.stringify({
                            model: config.model,
                            messages: [{ role: "system", content: userSettings.customInstruction }, { role: "user", content: `Analysis target:\n"${text}"` }]
                        }),
                        timeout: 60000,
                        onload: (res) => res.status === 200 ? resolve(JSON.parse(res.responseText)) : reject(new Error(`HTTP ${res.status}`)),
                        onerror: () => reject(new Error("Net Error")),
                        ontimeout: () => reject(new Error("Timeout"))
                    });
                });
                const reply = response.choices?.[0]?.message?.content;
                if (reply) {
                    ui.content.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#007AFF">$1</strong>');
                    ui.status.textContent = `来源: ${config.name}`;
                    CacheManager.set(text, reply);
                    ui.loading.style.display = 'none';
                    return;
                }
            } catch (e) { console.warn(`${config.name} err:`, e); }
            
            // 如果 Custom 失败，不建议轮询到预设服务，或者反之。此处保持原有的向下轮询逻辑
            serviceKey = getNextServiceKey(serviceKey);
            attemptCount++;
        }
        ui.content.innerHTML = '<span style="color:red">❌ 服务请求失败，请检查 API Key 或网络。</span>';
        ui.loading.style.display = 'none';
    }

    function toggleOverlay(overlayEl, show) {
        if (show) {
            overlayEl.style.display = 'flex'; 
            // eslint-disable-next-line no-unused-expressions
            overlayEl.offsetHeight; 
            overlayEl.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        } else {
            overlayEl.classList.remove('active');
            document.body.style.overflow = '';
            if (overlayEl === ui.aiOverlay) {
                ui.aiModal.style.transform = '';
                ui.aiModal.style.transition = '';
            }
            setTimeout(() => {
                if (!overlayEl.classList.contains('active')) overlayEl.style.display = 'none';
            }, 300);
        }
    }

    function openAiModal(text) {
        appState.isAiModalOpen = true;
        toggleOverlay(ui.aiOverlay, true);

        if (utils.isValidText(text)) {
            ui.selectedText.style.display = 'block';
            ui.selectedText.textContent = text;
            ui.emptyTip.style.display = 'none';
            const cached = CacheManager.get(text);
            if (cached) {
                ui.content.innerHTML = cached.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#007AFF">$1</strong>');
                ui.status.textContent = '来源: 本地缓存';
                ui.loading.style.display = 'none';
                appState.lastAnalyzedText = text;
            } else { fetchAI(text); }
        } else {
            ui.selectedText.style.display = 'none';
            ui.content.innerHTML = '';
            ui.emptyTip.style.display = 'block';
            ui.status.textContent = '待机中';
            ui.loading.style.display = 'none';
        }
    }

    function closeAiModal() {
        appState.isAiModalOpen = false;
        toggleOverlay(ui.aiOverlay, false);
        handleScroll(); 
    }

    // --- 核心：悬浮球逻辑 ---
    const checkSelection = utils.debounce(() => {
        if (!userSettings.enableFloatingButton) return;
        const selection = window.getSelection().toString().trim();
        if (selection.length > 0) {
            ui.floatBtn.classList.remove('float-hidden');
        } else {
            handleScroll();
        }
    }, DEBOUNCE_DELAY);

    const handleScroll = utils.debounce(() => {
        if (!userSettings.enableFloatingButton || appState.isAiModalOpen || appState.isSettingsModalOpen) return;
        
        const selection = window.getSelection().toString().trim();
        if (selection.length > 0) {
            ui.floatBtn.classList.remove('float-hidden');
            return;
        }

        const currentScrollY = window.scrollY;
        if (currentScrollY > appState.lastScrollY && currentScrollY > 100) {
            ui.floatBtn.classList.add('float-hidden');
        } else {
            ui.floatBtn.classList.remove('float-hidden');
        }
        appState.lastScrollY = currentScrollY;
    }, SCROLL_DELAY);

    // --- 核心：拖拽手势逻辑 ---
    function setupDraggableDrawer() {
        let startY = 0;
        let currentTranslate = 0;
        const modal = ui.aiModal;
        const triggerElements = [ui.aiHeader, ui.aiFooter];

        const onTouchStart = (e) => {
            if (!appState.isAiModalOpen) return;
            startY = e.touches[0].clientY;
            modal.style.transition = 'none';
        };

        const onTouchMove = (e) => {
            if (!appState.isAiModalOpen) return;
            const currentY = e.touches[0].clientY;
            const delta = currentY - startY;
            if (delta < 0) {
                e.preventDefault();
                currentTranslate = delta;
                modal.style.transform = `translateY(${delta}px)`;
            }
        };

        const onTouchEnd = (e) => {
            if (!appState.isAiModalOpen) return;
            modal.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
            if (currentTranslate < -80) closeAiModal();
            else modal.style.transform = '';
            currentTranslate = 0;
        };

        triggerElements.forEach(el => {
            if (el) {
                el.addEventListener('touchstart', onTouchStart, {passive: false});
                el.addEventListener('touchmove', onTouchMove, {passive: false});
                el.addEventListener('touchend', onTouchEnd);
            }
        });
    }

    function setupEvents() {
        document.addEventListener('selectionchange', checkSelection);
        document.addEventListener('mouseup', checkSelection);
        document.addEventListener('touchend', checkSelection);
        window.addEventListener('scroll', handleScroll, { passive: true });

        ui.floatBtn.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            const selection = window.getSelection().toString().trim();
            if (selection) {
                openAiModal(selection);
            } else {
                if (appState.lastAnalyzedText) openAiModal(appState.lastAnalyzedText);
                else utils.showToast('⚠️ 暂无最近分析记录，请先选中文本');
            }
        });

        document.getElementById('aiBtnClose').addEventListener('click', closeAiModal);
        document.getElementById('aiHeaderClose').addEventListener('click', closeAiModal);
        document.getElementById('aiBtnCopy').addEventListener('click', () => { 
            if(ui.content.innerText) { GM_setClipboard(ui.content.innerText); utils.showToast('📋 已复制'); }
        });
        document.getElementById('aiBtnPlay').addEventListener('click', () => {
            const txt = ui.selectedText.textContent || ui.content.innerText;
            if(txt) playTTS(txt);
        });
        
        ui.aiOverlay.addEventListener('mousedown', (e) => { if (e.target === ui.aiOverlay) closeAiModal(); });
        ui.aiOverlay.addEventListener('touchend', (e) => { if (e.target === ui.aiOverlay) { e.preventDefault(); closeAiModal(); } });

        document.getElementById('btnSaveSettings').addEventListener('click', saveSettings);
        document.getElementById('btnCloseSettings').addEventListener('click', () => { 
            toggleOverlay(ui.settingsOverlay, false);
            appState.isSettingsModalOpen = false; 
        });
        document.getElementById('btnTestTts').addEventListener('click', () => playTTS("Test TTS Service.", true));
        ui.settingsOverlay.querySelectorAll('input[name="activeService"]').forEach(r => r.addEventListener('change', (e) => renderServiceInputs(e.target.value)));

        setupDraggableDrawer();
    }

    function init() {
        createUI();
        setupEvents();
        GM_registerMenuCommand('⚙️ 助手设置', () => {
            appState.isSettingsModalOpen = true;
            toggleOverlay(ui.settingsOverlay, true);
            document.querySelector(`input[name="activeService"][value="${userSettings.activeService}"]`).checked = true;
            renderServiceInputs(userSettings.activeService);
        });
        console.log('AI 划词助手 (Custom增强版 v4.8) 已加载');
    }

    init();
})();
