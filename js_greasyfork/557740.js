// ==UserScript==
// @name         Deep Read
// @namespace    http://tampermonkey.net/
// @version      1.3.8
// @description  v1.3.6升级：新增自定义风格“编辑”功能，无需删除即可微调Prompt；支持设置“默认总结风格”；保留所有历史功能。
// @author       DeepRead Dev
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
// @connect      api.github.com
// @connect      ms-ra-forwarder-for-ifreetime-beta-two.vercel.app
// @connect      ms-ra-forwarder-for-ifreetime-2.vercel.app
// @require      https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557740/Deep%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/557740/Deep%20Read.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 1. 配置与常量
    // ==========================================

    const CONSTANTS = {
        API_URLS: {
            GROQ: 'https://api.groq.com/openai/v1/chat/completions',
            KIMI: 'https://api.moonshot.cn/v1/chat/completions',
            ZHIPU: 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
        },
        TTS_DOMAINS: [
            'https://ms-ra-forwarder-for-ifreetime-2.vercel.app/api/aiyue',
            'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/api/aiyue'
        ],
        CACHE_PREFIX: 'deepread_v8_',
        HISTORY_KEY: 'deepread_last_text_pointer',
        CUSTOM_STYLES_KEY: 'deepread_custom_styles_list',
        CACHE_EXPIRY: 24 * 60 * 60 * 1000, 
        MODELS: {
            GROQ: 'llama-3.3-70b-versatile',
            KIMI: 'moonshot-v1-8k',
            ZHIPU: 'GLM-4.5-Flash'
        },
        PROMPTS: {
            ANALYZE: `你是一个智能助手，请用中文分析下面的内容。请根据内容类型（单词或句子）按以下要求进行分析：

如果是**句子或段落**，请：
1. 给出难度等级（A1-C2）并解释
2. 核心语法结构分析
3. 准确翻译
4. 重点短语及例句和例句翻译

如果是**单词**，请：
1. 音标及发音提示
2. 详细释义及词性
3. 常用搭配和例句
4. 记忆技巧（如有）

用 **加粗** 标出重点内容，保持回答简洁实用。`,
            // 中文总结标准 Prompt
            SUMMARY_CN: `You are a helpful assistant. Please summarize the following webpage content in Chinese. Use Simplified Chinese. Structure it clearly with headings (use ## Title) and bullet points.`
        },
        // 内置风格
        DEFAULT_STYLES: {
            SIMPLE: {
                label: '📝 简练', 
                prompt: `Please summarize the content in English using simple words (CEFR B1 level). Start with "Title: ...". Structure with bullet points.`
            }
        }
    };

    const DEFAULT_SETTINGS = {
        activeService: 'GROQ',
        enableFailover: true,
        groqKey: '',
        kimiKey: '',
        zhipuKey: '', 
        githubToken: '',
        githubUser: 'moodHappy',
        githubRepo: 'HelloWorld',
        githubPath: 'Notes/B1.md',
        ttsVoiceCN: 'zh-CN-XiaoxiaoNeural',
        ttsVoiceEN: 'en-US-JennyNeural',
        // 新增：默认风格设置，默认为简练
        defaultSummaryStyle: 'SIMPLE'
    };

    // ==========================================
    // 2. 工具类
    // ==========================================

    const Utils = {
        getSetting(key) { return GM_getValue(key, DEFAULT_SETTINGS[key]); },
        setSetting(key, value) { GM_setValue(key, value); },

        // 获取合并后的所有风格（内置 + 自定义）
        getAllStyles() {
            const defaults = CONSTANTS.DEFAULT_STYLES;
            const customs = GM_getValue(CONSTANTS.CUSTOM_STYLES_KEY, []);
            
            let merged = {};
            for (let key in defaults) {
                merged[key] = defaults[key];
            }
            customs.forEach(style => {
                merged[style.id] = { label: '✨ ' + style.label, prompt: style.prompt, isCustom: true };
            });
            return merged;
        },

        cleanMarkdownForTTS(text) {
            if (!text) return '';
            return text
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/[*#>`~-]/g, '')
                .replace(/\[(.*?)\]\(.*?\)/g, '$1')
                .replace(/\d+\.\s/g, '')
                .replace(/\n+/g, '，')
                .replace(/\s+/g, ' ')
                .trim();
        },

        renderMarkdownToHTML(text) {
            if (!text) return '';
            let html = text
                .replace(/\r\n/g, '\n')
                .replace(/^###\s*(.*$)/gm, '<h4 style="margin:12px 0 6px; color:#444;">$1</h4>')
                .replace(/^##\s*(.*$)/gm, '<h3 style="margin:18px 0 10px; color:#333; border-bottom:1px solid #eee; padding-bottom:5px;">$1</h3>')
                .replace(/^#\s*(.*$)/gm, '<h2 style="font-size:1.3em; margin:15px 0;">$1</h2>')
                .replace(/\*\*\s*(.*?)\s*\*\*/g, '<strong style="color: #d35400;">$1</strong>')
                .replace(/\*\s*(.*?)\s*\*\*/g, '<em style="color: #2980b9;">$1</em>')
                .replace(/^\s*[\-\*]\s+(.*$)/gm, '<div class="dr-list-row"><span class="dr-list-icon"></span><div class="dr-list-text">$1</div></div>')
                .replace(/^\s*\d+\.\s+(.*$)/gm, '<div class="dr-list-header">$1</div>')
                .replace(/\n/g, '<br>');
            return html;
        },

        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        
        getCacheKey(type, id) {
            return CONSTANTS.CACHE_PREFIX + type + '_' + btoa(encodeURIComponent(id));
        }
    };

    // ==========================================
    // 3. 状态与服务
    // ==========================================

    const AppState = {
        currentAudio: null,
        isPlaying: false,
        isModalOpen: false,
        analysisText: '',
        lastScrollY: 0,
        currentSummaryLang: 'en',
        tempCustomStyles: [],
        tempDefaultStyle: 'SIMPLE',
        editingStyleId: null // 新增：用于跟踪当前正在编辑的风格ID
    };

    const LLMService = {
        async request(service, messages) {
            const config = {
                GROQ: { url: CONSTANTS.API_URLS.GROQ, key: Utils.getSetting('groqKey'), model: CONSTANTS.MODELS.GROQ },
                KIMI: { url: CONSTANTS.API_URLS.KIMI, key: Utils.getSetting('kimiKey'), model: CONSTANTS.MODELS.KIMI },
                ZHIPU: { url: CONSTANTS.API_URLS.ZHIPU, key: Utils.getSetting('zhipuKey'), model: CONSTANTS.MODELS.ZHIPU }
            }[service];

            if (!config || !config.key) throw new Error(`${service} Key 未配置`);

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST', url: config.url,
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.key}` },
                    data: JSON.stringify({ model: config.model, messages: messages, stream: false }),
                    timeout: 60000,
                    onload: (res) => {
                        if (res.status === 200) {
                            try { resolve(JSON.parse(res.responseText).choices[0]?.message?.content || '无内容'); }
                            catch (e) { reject(new Error('解析失败')); }
                        } else { reject(new Error(`HTTP ${res.status}`)); }
                    },
                    onerror: () => reject(new Error('网络错误'))
                });
            });
        },

        async analyzeWithFailover(text) {
            const order = [...new Set([Utils.getSetting('activeService'), 'GROQ', 'ZHIPU', 'KIMI'])];
            let lastError = null;
            
            for (const service of order) {
                if (!Utils.getSetting('enableFailover') && service !== order[0]) break;
                const keyName = service.toLowerCase() + 'Key';
                if (!Utils.getSetting(keyName)) continue;

                try {
                    UIManager.updateStatus(`🤖 ${service} 分析中...`);
                    const messages = [{ role: 'system', content: CONSTANTS.PROMPTS.ANALYZE }, { role: 'user', content: text }];
                    const result = await this.request(service, messages);
                    return { content: result, service };
                } catch (e) {
                    lastError = e;
                    UIManager.updateStatus(`⚠️ ${service} 失败，切换...`);
                }
            }
            throw lastError || new Error('未配置有效的 Key');
        }
    };

    const TTSService = {
        async play(text, isChinese) {
            if (AppState.isPlaying) { this.stop(); return; }
            const cleanText = Utils.cleanMarkdownForTTS(text);
            if (!cleanText) return alert('无朗读内容');
            
            const voice = isChinese ? Utils.getSetting('ttsVoiceCN') : Utils.getSetting('ttsVoiceEN');
            const query = `?text=${encodeURIComponent(cleanText.substring(0, 1000))}&voiceName=${voice}&speed=0`;
            
            AppState.isPlaying = true;
            UIManager.updateTTSButton(true);

            for (const domain of CONSTANTS.TTS_DOMAINS) {
                try {
                    const audio = new Audio(domain + query);
                    AppState.currentAudio = audio;
                    await new Promise((resolve, reject) => {
                        audio.onended = resolve;
                        audio.onerror = reject;
                        audio.play().catch(reject);
                    });
                    this.stop(); return;
                } catch (e) { continue; }
            }
            this.stop(); alert('TTS 服务不可用');
        },
        stop() {
            if (AppState.currentAudio) { AppState.currentAudio.pause(); AppState.currentAudio = null; }
            AppState.isPlaying = false;
            UIManager.updateTTSButton(false);
        }
    };

    // ==========================================
    // 4. UI 样式
    // ==========================================

    GM_addStyle(`
        .dr-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
            z-index: 99999; display: flex; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
            align-items: center;
        }
        .dr-overlay.active { opacity: 1; pointer-events: auto; }

        .dr-modal {
            background: #fff; width: 600px; max-height: 80vh;
            border-radius: 16px; display: flex; flex-direction: column;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            transform: scale(0.98); transition: transform 0.2s ease, opacity 0.2s ease;
            touch-action: none; 
        }
        .dr-overlay.active .dr-modal { transform: scale(1); }

        @media (max-width: 640px) {
            .dr-overlay { align-items: flex-start; }
            .dr-modal {
                width: 100%; margin-top: 0; top: 0;
                height: auto; max-height: 80vh; 
                border-radius: 0 0 20px 20px;
            }
        }

        .dr-header {
            padding: 15px 20px; background: #fff; border-bottom: 1px solid #f0f0f0;
            display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
            border-radius: 16px 16px 0 0;
        }
        @media (max-width: 640px) { .dr-header { border-radius: 0; } }

        .dr-title { font-size: 18px; font-weight: 700; color: #333; margin: 0; }
        
        .dr-select {
            margin-left: 12px; padding: 4px 8px; border-radius: 6px;
            border: 1px solid #ddd; font-size: 12px; color: #555;
            background: #fdfdfd; outline: none; cursor: pointer;
            max-width: 140px;
        }

        .dr-body { 
            flex: 1; overflow-y: auto; background: #fff; position: relative; 
            -webkit-overflow-scrolling: touch; 
            touch-action: pan-y;
        }
        #dr-original-box {
            position: sticky; top: 0; z-index: 10;
            background: #fdfdfd; border-bottom: 3px solid #f0f0f0;
            padding: 12px 20px; display: none;
        }
        #dr-original-label { font-size: 11px; color: #3498db; font-weight: 800; letter-spacing: 1px; margin-bottom: 4px; display:block; }
        #dr-original-content { font-family: Georgia, serif; font-style: italic; color: #444; font-size: 15px; max-height: 100px; overflow-y: auto; }
        #dr-result-content { padding: 20px; font-size: 16px; line-height: 1.7; color: #2c3e50; }
        
        .dr-list-row { display: flex; align-items: baseline; margin-bottom: 8px; line-height: 1.6; }
        .dr-list-icon { display: inline-block; width: 6px; height: 6px; background-color: #3498db; border-radius: 50%; margin-right: 12px; flex-shrink: 0; position: relative; top: -2px; opacity: 0.8; }
        .dr-list-text { flex: 1; color: #2c3e50; word-wrap: break-word; }
        .dr-list-header { font-weight: 700; color: #2c3e50; margin-top: 12px; margin-bottom: 6px; }
        
        .dr-footer {
            padding: 25px 20px 15px; 
            border-top: 1px solid #eee; background: #fff;
            display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; flex-shrink: 0;
            border-radius: 0 0 16px 16px;
            touch-action: none;
            user-select: none;
            position: relative;
        }
        .dr-footer::before {
            content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
            width: 36px; height: 4px; background-color: #e0e0e0; border-radius: 2px; pointer-events: none;
        }
        @media (max-width: 640px) { .dr-footer { border-radius: 0 0 20px 20px; } }

        .dr-btn {
            padding: 10px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600;
            color: #fff; cursor: pointer; display: flex; align-items: center; gap: 5px;
        }
        .dr-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .dr-btn-primary { background: #3498db; }
        .dr-btn-success { background: #27ae60; }
        .dr-btn-gray { background: #95a5a6; }
        .dr-btn-danger { background: #e74c3c; padding: 4px 8px; font-size:12px; }
        .dr-btn-edit { background: #f39c12; padding: 4px 8px; font-size:12px; margin-right: 5px; }

        #dr-float-btn {
            position: fixed; right: 15px; top: 65%; transform: translateY(-50%);
            width: 48px; height: 48px; border-radius: 50%;
            background: linear-gradient(135deg, #3498db, #8e44ad);
            color: white; border: none; font-size: 22px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 99990;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer;
            opacity: 0; pointer-events: none; transform: translateY(-50%) scale(0.8);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        #dr-float-btn.visible { opacity: 1; pointer-events: auto; transform: translateY(-50%) scale(1); }
        
        .dr-input-group { margin-bottom: 12px; padding: 0 20px; }
        .dr-input-group label { display:block; margin-bottom:5px; font-weight:600; color:#555; font-size:12px; }
        .dr-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box; }
        textarea.dr-input { font-family: monospace; line-height: 1.4; resize: vertical; min-height: 60px; }
        select.dr-input { background: #fff; }
        
        /* 风格列表样式 */
        .dr-style-item { display:flex; justify-content:space-between; align-items:center; background:#f0f0f0; padding:8px 12px; margin-bottom:8px; border-radius:6px; font-size:13px; }
        .dr-style-item-left { display:flex; align-items:center; gap:8px; flex:1; }
        .dr-style-item-right { display:flex; align-items:center; }
        .dr-radio { accent-color: #3498db; width: 16px; height: 16px; cursor: pointer; }
        .dr-style-label { font-weight:600; color:#333; cursor: pointer; }
    `);

    // ==========================================
    // 5. UI 控制器
    // ==========================================

    const UIManager = {
        elements: {},
        autoHideTimer: null, 

        init() {
            const floatBtn = document.createElement('button');
            floatBtn.id = 'dr-float-btn';
            floatBtn.innerHTML = '💡';
            document.body.appendChild(floatBtn);
            this.elements.floatBtn = floatBtn;

            const overlay = document.createElement('div');
            overlay.className = 'dr-overlay';
            overlay.innerHTML = `
                <div class="dr-modal">
                    <div class="dr-header">
                        <div style="display:flex; align-items:center;">
                            <h3 class="dr-title">DeepRead</h3>
                            
                            <select id="dr-model-select" class="dr-select" style="display:none;">
                                <option value="GROQ">Groq</option>
                                <option value="ZHIPU">Zhipu</option>
                                <option value="KIMI">Kimi</option>
                            </select>

                            <select id="dr-style-select" class="dr-select" style="display:none;"></select>
                        </div>
                    </div>
                    <div class="dr-body">
                        <div id="dr-original-box">
                            <span id="dr-original-label">SELECTED TEXT</span>
                            <div id="dr-original-content"></div>
                        </div>
                        <div id="dr-result-content"></div>
                    </div>
                    <div class="dr-footer"></div>
                </div>
            `;
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

            // 绑定事件
            overlay.addEventListener('click', (e) => { if (e.target === overlay) this.closeModal(); });
            
            this.elements.modelSelect.addEventListener('change', (e) => {
                CoreController.switchModel(e.target.value);
            });

            this.elements.styleSelect.addEventListener('change', (e) => {
                const newStyle = e.target.value;
                // 注意：下拉框切换只是临时改变当前查看的风格，不影响全局默认
                CoreController.startSummary(AppState.currentSummaryLang, newStyle);
            });

            // 悬浮球事件
            let pressTimer = null, isLongPress = false, clickCount = 0, clickTimer = null;
            
            const startPress = (e) => {
                if (e.type === 'mousedown' && e.button !== 0) return;
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    if(navigator.vibrate) navigator.vibrate(50);
                    floatBtn.style.transform = 'translateY(-50%) scale(1.2)'; 
                    setTimeout(() => floatBtn.style.transform = 'translateY(-50%) scale(1)', 200);
                    // 长按 -> 中文总结
                    CoreController.startSummary('zh'); 
                }, 800);
            };
            
            const cancelPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; } };

            floatBtn.addEventListener('mousedown', startPress);
            floatBtn.addEventListener('touchstart', startPress, {passive: true});
            ['mouseup', 'mouseleave', 'touchend', 'touchmove'].forEach(evt => floatBtn.addEventListener(evt, cancelPress, {passive: true}));

            floatBtn.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                if (isLongPress) { isLongPress = false; clickCount = 0; return; }

                clickCount++;
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        // 单击 -> 深度分析
                        if (AppState.analysisText) CoreController.startAnalysis(AppState.analysisText);
                        else {
                            const lastText = GM_getValue(CONSTANTS.HISTORY_KEY, null);
                            if (lastText) CoreController.startAnalysis(lastText);
                            else alert('DeepRead: 请先选择文本进行分析');
                        }
                        clickCount = 0;
                    }, 250);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    floatBtn.style.transform = 'translateY(-50%) scale(0.9)'; 
                    setTimeout(() => floatBtn.style.transform = 'translateY(-50%) scale(1)', 150);
                    // 双击 -> 英文总结
                    CoreController.startSummary('en');
                }
            });

            // 手势关闭
            const footer = this.elements.footer;
            let startY = 0;
            let currentMoveY = 0;
            footer.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                currentMoveY = 0;
                this.elements.modal.style.transition = 'none';
            }, {passive: true});
            footer.addEventListener('touchmove', (e) => {
                const diff = e.touches[0].clientY - startY;
                if (diff < 0) {
                    currentMoveY = diff;
                    this.elements.modal.style.transform = `translateY(${diff}px)`;
                }
            }, {passive: true});
            footer.addEventListener('touchend', () => {
                this.elements.modal.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                if (currentMoveY < -50) {
                    this.elements.modal.style.transform = `translateY(-100vh)`;
                    this.elements.modal.style.opacity = '0';
                    setTimeout(() => { this.closeModal(); }, 300);
                } else {
                    this.elements.modal.style = '';
                }
                currentMoveY = 0;
            });
        },

        openModal(title, mode = 'ANALYSIS', lang = 'en', currentStyle = 'SIMPLE') {
            this.elements.title.textContent = title;
            this.elements.overlay.classList.add('active');
            AppState.isModalOpen = true;
            document.body.style.overflow = 'hidden';

            this.elements.modelSelect.style.display = 'none';
            this.elements.styleSelect.style.display = 'none';

            if (mode === 'ANALYSIS') {
                this.elements.modelSelect.style.display = 'block';
                this.elements.modelSelect.value = Utils.getSetting('activeService');
            } 
            else if (mode === 'SUMMARY') {
                if (lang === 'en') {
                    this.updateStyleDropdown();
                    this.elements.styleSelect.style.display = 'block';
                    // 显示当前使用的风格
                    this.elements.styleSelect.value = currentStyle;
                }
            }
        },

        updateStyleDropdown() {
            const select = this.elements.styleSelect;
            select.innerHTML = '';
            const styles = Utils.getAllStyles();
            for (let key in styles) {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = styles[key].label;
                select.appendChild(opt);
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
            this.elements.resultContent.innerHTML = `<div style="text-align:center; padding:40px; color:#999;">
                <div style="font-size:24px; margin-bottom:10px;">⏳</div>${text}
            </div>`;
        },

        renderAnalysisUI(originalText, aiContent, serviceName) {
            this.elements.originalBox.style.display = 'block';
            this.elements.originalContent.textContent = originalText;
            const html = Utils.renderMarkdownToHTML(aiContent);
            this.elements.resultContent.innerHTML = html + `<div style="margin-top:20px; font-size:12px; color:#ccc; text-align:right;">by ${serviceName}</div>`;
            this.buildFooter([
                { text: '🔊 朗读', type: 'primary', id: 'dr-tts-btn', onClick: () => TTSService.play(originalText, false) },
                { text: '📋 复制', type: 'success', onClick: () => { GM_setClipboard(aiContent); alert('已复制'); } }
            ]);
            
            const simpleService = serviceName.split('(')[0].trim().toUpperCase();
            if(['GROQ','ZHIPU','KIMI'].includes(simpleService)) {
                this.elements.modelSelect.value = simpleService;
            }
        },

        renderSummaryUI(content, isCached, serviceName) {
            this.elements.originalBox.style.display = 'none';
            const html = Utils.renderMarkdownToHTML(content);
            const suffix = isCached ? ' (⚡️Cache)' : '';
            this.elements.resultContent.innerHTML = html + `<div style="margin-top:20px; font-size:12px; color:#ccc; text-align:right;">${serviceName} Summary${suffix}</div>`;
            this.buildFooter([
                { text: '🔊 朗读', type: 'primary', id: 'dr-tts-btn', onClick: () => TTSService.play(content, true) },
                { text: '⬆️ GitHub', type: 'gray', id: 'dr-gh-btn', onClick: () => CoreController.pushGitHub(content) },
                { text: '📋 复制', type: 'success', onClick: () => { GM_setClipboard(content); alert('已复制'); } }
            ]);
        },

        // === 设置界面 ===
        renderSettings() {
            this.elements.originalBox.style.display = 'none';
            const active = Utils.getSetting('activeService');
            // 加载已有数据
            AppState.tempCustomStyles = GM_getValue(CONSTANTS.CUSTOM_STYLES_KEY, []);
            AppState.tempDefaultStyle = Utils.getSetting('defaultSummaryStyle') || 'SIMPLE';
            AppState.editingStyleId = null; // 重置编辑状态

            this.elements.resultContent.innerHTML = `
                <div style="padding-top:20px;">
                    <div class="dr-input-group" style="background:#f8f9fa; padding:15px 20px; margin-bottom:20px; border-radius:8px;">
                        <label>👉 首选 AI 服务</label>
                        <select class="dr-input" id="dr-active-service">
                            <option value="GROQ" ${active==='GROQ'?'selected':''}>Groq (Llama3)</option>
                            <option value="KIMI" ${active==='KIMI'?'selected':''}>Kimi (Moonshot)</option>
                            <option value="ZHIPU" ${active==='ZHIPU'?'selected':''}>Zhipu (GLM-4.5-Flash)</option>
                        </select>
                    </div>

                    <div class="dr-input-group" style="border:1px solid #eee; padding:15px; border-radius:8px; margin-bottom:20px;">
                        <label style="color:#2c3e50; font-size:14px; margin-bottom:10px;">🎨 英文总结风格管理 (选中圆圈设为默认)</label>
                        <div id="dr-styles-list" style="max-height:180px; overflow-y:auto; margin-bottom:10px;"></div>
                        
                        <div style="background:#f9f9f9; padding:10px; border-radius:6px;">
                            <input id="dr-new-style-name" class="dr-input" placeholder="风格名称 (如: 悬疑风格)" style="margin-bottom:5px;">
                            <textarea id="dr-new-style-prompt" class="dr-input" placeholder="Prompt (English)... 例如: Rewrite as a mystery novel." style="margin-bottom:5px; min-height:50px;"></textarea>
                            <button id="dr-add-style-btn" class="dr-btn dr-btn-primary" style="width:100%; justify-content:center; padding:6px;">➕ 添加新风格</button>
                        </div>
                    </div>

                    <div class="dr-input-group"><label>Groq Key</label><input class="dr-input" id="sk-groq" value="${Utils.getSetting('groqKey')}"></div>
                    <div class="dr-input-group"><label>Kimi Key</label><input class="dr-input" id="sk-kimi" value="${Utils.getSetting('kimiKey')}"></div>
                    <div class="dr-input-group"><label>Zhipu Key</label><input class="dr-input" id="sk-zhipu" value="${Utils.getSetting('zhipuKey')}"></div>
                    
                    <div class="dr-input-group" style="margin-top:20px; border-top:1px solid #eee; padding-top:15px;">
                        <label style="font-weight:700; color:#333;">📦 GitHub 笔记同步</label>
                        <div style="margin-bottom:10px;">
                            <label>Token</label>
                            <input class="dr-input" id="sk-gh" value="${Utils.getSetting('githubToken')}" placeholder="ghp_...">
                        </div>
                        <label>仓库信息 (User / Repo / Path)</label>
                        <div style="display:flex; gap:5px; margin-bottom:5px;">
                            <input class="dr-input" id="sk-u" value="${Utils.getSetting('githubUser')}" placeholder="用户名">
                            <input class="dr-input" id="sk-r" value="${Utils.getSetting('githubRepo')}" placeholder="仓库名">
                        </div>
                        <input class="dr-input" id="sk-p" value="${Utils.getSetting('githubPath')}" placeholder="文件路径 (如 Notes/B1.md)">
                    </div>
                </div>
            `;
            
            this.renderStylesList(); 

            setTimeout(() => {
                const addBtn = document.getElementById('dr-add-style-btn');
                addBtn.onclick = () => {
                    const nameInput = document.getElementById('dr-new-style-name');
                    const promptInput = document.getElementById('dr-new-style-prompt');
                    
                    const name = nameInput.value.trim();
                    const prompt = promptInput.value.trim();
                    
                    if(!name || !prompt) return alert('请填写名称和 Prompt');
                    
                    if (AppState.editingStyleId) {
                        // === 修改现有风格 ===
                        const idx = AppState.tempCustomStyles.findIndex(s => s.id === AppState.editingStyleId);
                        if (idx > -1) {
                            AppState.tempCustomStyles[idx].label = name;
                            AppState.tempCustomStyles[idx].prompt = prompt;
                        }
                        AppState.editingStyleId = null; // 退出编辑模式
                        
                        // 恢复按钮样式
                        addBtn.textContent = '➕ 添加新风格';
                        addBtn.className = 'dr-btn dr-btn-primary';
                    } else {
                        // === 添加新风格 ===
                        AppState.tempCustomStyles.push({
                            id: 'custom_' + Date.now(),
                            label: name,
                            prompt: prompt
                        });
                    }
                    
                    nameInput.value = '';
                    promptInput.value = '';
                    this.renderStylesList();
                };
            }, 0);

            this.buildFooter([{ text: '💾 保存全部设置', type: 'success', onClick: () => {
                Utils.setSetting('activeService', document.getElementById('dr-active-service').value);
                Utils.setSetting('groqKey', document.getElementById('sk-groq').value.trim());
                Utils.setSetting('kimiKey', document.getElementById('sk-kimi').value.trim());
                Utils.setSetting('zhipuKey', document.getElementById('sk-zhipu').value.trim());
                
                GM_setValue(CONSTANTS.CUSTOM_STYLES_KEY, AppState.tempCustomStyles);
                Utils.setSetting('defaultSummaryStyle', AppState.tempDefaultStyle); // 保存默认风格
                
                Utils.setSetting('githubToken', document.getElementById('sk-gh').value.trim());
                Utils.setSetting('githubUser', document.getElementById('sk-u').value.trim());
                Utils.setSetting('githubRepo', document.getElementById('sk-r').value.trim());
                Utils.setSetting('githubPath', document.getElementById('sk-p').value.trim());
                
                alert(`✅ 设置已保存`); 
                this.closeModal();
            }}]);
        },

        renderStylesList() {
            const container = document.getElementById('dr-styles-list');
            if(!container) return;
            container.innerHTML = '';
            
            // 辅助函数：创建行
            const createRow = (id, label, prompt, isCustom) => {
                const div = document.createElement('div');
                div.className = 'dr-style-item';
                
                const leftDiv = document.createElement('div');
                leftDiv.className = 'dr-style-item-left';
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'style-default-group';
                radio.className = 'dr-radio';
                radio.checked = (AppState.tempDefaultStyle === id);
                radio.onclick = () => { AppState.tempDefaultStyle = id; };
                
                const span = document.createElement('span');
                span.className = 'dr-style-label';
                span.textContent = (isCustom ? '✨ ' : '📝 ') + label;
                span.onclick = () => { radio.checked = true; AppState.tempDefaultStyle = id; };

                leftDiv.appendChild(radio);
                leftDiv.appendChild(span);
                div.appendChild(leftDiv);

                if(isCustom) {
                    const rightDiv = document.createElement('div');
                    rightDiv.className = 'dr-style-item-right';

                    // === 编辑按钮 ===
                    const editBtn = document.createElement('button');
                    editBtn.className = 'dr-btn dr-btn-edit';
                    editBtn.textContent = '✏️ 编辑';
                    editBtn.onclick = () => {
                        document.getElementById('dr-new-style-name').value = label;
                        document.getElementById('dr-new-style-prompt').value = prompt;
                        
                        AppState.editingStyleId = id;
                        
                        // 改变主按钮状态提示用户正在编辑
                        const addBtn = document.getElementById('dr-add-style-btn');
                        addBtn.textContent = '💾 保存修改';
                        addBtn.className = 'dr-btn dr-btn-success';
                    };
                    rightDiv.appendChild(editBtn);

                    // === 删除按钮 ===
                    const delBtn = document.createElement('button');
                    delBtn.className = 'dr-btn dr-btn-danger';
                    delBtn.textContent = '删除';
                    delBtn.onclick = () => {
                        // 如果正在编辑当前项，取消编辑状态
                        if (AppState.editingStyleId === id) {
                            AppState.editingStyleId = null;
                            document.getElementById('dr-new-style-name').value = '';
                            document.getElementById('dr-new-style-prompt').value = '';
                            const addBtn = document.getElementById('dr-add-style-btn');
                            addBtn.textContent = '➕ 添加新风格';
                            addBtn.className = 'dr-btn dr-btn-primary';
                        }

                        // 删除前判断：如果删的是当前选中的默认项，则重置为 SIMPLE
                        if(AppState.tempDefaultStyle === id) {
                            AppState.tempDefaultStyle = 'SIMPLE';
                        }
                        const idx = AppState.tempCustomStyles.findIndex(s => s.id === id);
                        if(idx > -1) {
                            AppState.tempCustomStyles.splice(idx, 1);
                            this.renderStylesList();
                        }
                    };
                    rightDiv.appendChild(delBtn);
                    
                    div.appendChild(rightDiv);
                }
                
                return div;
            };

            // 1. 渲染内置 Simple
            container.appendChild(createRow('SIMPLE', '简练', '', false));

            // 2. 渲染自定义
            AppState.tempCustomStyles.forEach(style => {
                container.appendChild(createRow(style.id, style.label, style.prompt, true));
            });
        },

        buildFooter(btns) {
            this.elements.footer.innerHTML = '';
            btns.forEach(b => {
                const btn = document.createElement('button');
                btn.className = `dr-btn dr-btn-${b.type}`;
                btn.textContent = b.text;
                if(b.id) btn.id = b.id;
                btn.addEventListener('touchstart', (e) => e.stopPropagation(), {passive: true});
                btn.onclick = b.onClick;
                this.elements.footer.appendChild(btn);
            });
        },

        updateTTSButton(playing) {
            const btn = document.getElementById('dr-tts-btn');
            if(btn) {
                btn.textContent = playing ? '🔇 停止' : '🔊 朗读';
                btn.className = playing ? 'dr-btn dr-btn-gray' : 'dr-btn dr-btn-primary';
            }
        },

        setFloatBtnVisible(visible) {
            if (this.autoHideTimer) { clearTimeout(this.autoHideTimer); this.autoHideTimer = null; }
            if (visible) {
                this.elements.floatBtn.classList.add('visible');
                this.autoHideTimer = setTimeout(() => { this.elements.floatBtn.classList.remove('visible'); }, 6000);
            } else {
                this.elements.floatBtn.classList.remove('visible');
            }
        }
    };

    // ==========================================
    // 6. 业务逻辑
    // ==========================================

    const CoreController = {
        async startAnalysis(targetText) {
            const text = targetText || AppState.analysisText;
            if (!text) return;

            GM_setValue(CONSTANTS.HISTORY_KEY, text);
            UIManager.openModal('深度分析', 'ANALYSIS');
            UIManager.updateStatus('AI 思考中...');

            const activeService = Utils.getSetting('activeService');
            const specificCacheKey = Utils.getCacheKey('ana_' + activeService, text);
            const cached = GM_getValue(specificCacheKey);
            
            if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_EXPIRY) {
                UIManager.renderAnalysisUI(text, cached.content, cached.service + '(Cache)');
                return;
            }

            try {
                const res = await LLMService.analyzeWithFailover(text);
                const resultCacheKey = Utils.getCacheKey('ana_' + res.service, text);
                GM_setValue(resultCacheKey, { timestamp: Date.now(), content: res.content, service: res.service });
                UIManager.renderAnalysisUI(text, res.content, res.service);
            } catch (e) {
                UIManager.updateStatus(`❌ ${e.message}`);
                UIManager.buildFooter([{text:'设置', type:'primary', onClick:()=>UIManager.renderSettings()}]);
            }
        },

        async switchModel(service) {
            const text = AppState.analysisText || GM_getValue(CONSTANTS.HISTORY_KEY);
            if(!text) return alert('请重新选择文本');
            
            const cacheKey = Utils.getCacheKey('ana_' + service, text);
            const cached = GM_getValue(cacheKey);

            if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_EXPIRY) {
                UIManager.renderAnalysisUI(text, cached.content, cached.service + '(Cache)');
                return;
            }
            
            UIManager.updateStatus(`🤖 切换至 ${service} 分析中...`);
            try {
                const messages = [{ role: 'system', content: CONSTANTS.PROMPTS.ANALYZE }, { role: 'user', content: text }];
                const result = await LLMService.request(service, messages);
                GM_setValue(cacheKey, { timestamp: Date.now(), content: result, service: service });
                UIManager.renderAnalysisUI(text, result, service);
            } catch (e) {
                UIManager.updateStatus(`❌ ${service} 失败: ${e.message}`);
                UIManager.buildFooter([{text:'重试', type:'primary', onClick:()=>this.switchModel(service)}]);
            }
        },

        async startSummary(lang, specificStyle = null) {
            AppState.currentSummaryLang = lang; 
            
            let content = '';
            try {
                if (typeof Readability !== 'undefined') {
                    const article = new Readability(document.cloneNode(true)).parse();
                    content = article ? article.textContent : document.body.innerText;
                } else {
                    content = document.body.innerText;
                }
            } catch (e) { content = document.body.innerText; }
            if (!content || content.length < 50) return alert('内容过短');
            
            const activeService = Utils.getSetting('activeService');
            
            let prompt = '';
            let cacheStyleKey = ''; 
            
            if (lang === 'zh') {
                prompt = CONSTANTS.PROMPTS.SUMMARY_CN;
                cacheStyleKey = 'default';
                UIManager.openModal('中文总结', 'SUMMARY', 'zh'); 
            } else {
                // 英文总结：
                // 1. 如果有 specificStyle (用户手动切换下拉框)，优先使用
                // 2. 否则使用 savedDefaultStyle (用户设置的默认值)
                // 3. 都没有则兜底 SIMPLE
                const savedDefault = Utils.getSetting('defaultSummaryStyle') || 'SIMPLE';
                const styleKey = specificStyle || savedDefault;
                
                // 检查该 styleKey 是否还存在（防止默认值被删了）
                const allStyles = Utils.getAllStyles();
                let styleObj = allStyles[styleKey];
                
                // 如果找不到（比如被删了），回退到 SIMPLE
                if(!styleObj) {
                    styleObj = allStyles['SIMPLE'];
                    cacheStyleKey = 'SIMPLE';
                    // 如果是默认值失效了，顺手更新一下设置防止下次还错（可选，这里暂不自动更新设置）
                } else {
                    cacheStyleKey = styleKey;
                }
                
                prompt = styleObj.prompt;
                // 打开模态框，选中当前的 style
                UIManager.openModal('Summary', 'SUMMARY', 'en', cacheStyleKey);
            }

            UIManager.updateStatus(`${activeService} 生成中...`);

            const urlId = window.location.pathname + window.location.search;
            const cacheKey = Utils.getCacheKey(`sum_${lang}_${cacheStyleKey}_${activeService}`, urlId);
            const cached = GM_getValue(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < CONSTANTS.CACHE_EXPIRY) {
                UIManager.renderSummaryUI(cached.content, true, activeService);
                return;
            }

            try {
                const res = await LLMService.request(activeService, [{role:'system', content:prompt}, {role:'user', content:content.slice(0,15000)}]);
                GM_setValue(cacheKey, { timestamp: Date.now(), content: res });
                UIManager.renderSummaryUI(res, false, activeService);
            } catch(e) {
                UIManager.updateStatus(`❌ ${e.message}`);
                UIManager.buildFooter([{text:'检查 Key', type:'primary', onClick:()=>UIManager.renderSettings()}]);
            }
        },

        async pushGitHub(content) {
            const token = Utils.getSetting('githubToken');
            if(!token) return alert('请先设置 Token');
            
            const btn = document.getElementById('dr-gh-btn');
            const originalText = btn ? btn.innerText : '⬆️ GitHub';
            if(btn) { btn.innerText = '⏳ 推送中...'; btn.disabled = true; }

            const url = `https://api.github.com/repos/${Utils.getSetting('githubUser')}/${Utils.getSetting('githubRepo')}/contents/${Utils.getSetting('githubPath')}`;
            
            try {
                let sha = null;
                try {
                    const r = await new Promise((ok, no) => GM_xmlhttpRequest({method:'GET', url, headers:{Authorization:`Bearer ${token}`}, onload:ok, onerror:no}));
                    if(r.status===200) { const d=JSON.parse(r.responseText); sha=d.sha; }
                } catch(e){}
                
                const formattedContent = `# ${document.title}\n\n> 📅 ${new Date().toLocaleString()}\n\n${content}`;
                const newC = btoa(unescape(encodeURIComponent(formattedContent)));
                
                GM_xmlhttpRequest({
                    method:'PUT', url,
                    headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'},
                    data:JSON.stringify({ message: `DeepRead: ${document.title}`, content: newC, sha }),
                    onload:(r)=>{
                        if(btn) { btn.innerText = originalText; btn.disabled = false; }
                        if(r.status < 300) alert('✅ 推送成功'); else alert(`❌ Code ${r.status}`);
                    },
                    onerror: () => { if(btn) btn.disabled = false; alert('❌ 网络错误'); }
                });
            } catch(e) { if(btn) btn.disabled = false; alert('❌ ' + e.message); }
        }
    };

    // ==========================================
    // 7. 启动
    // ==========================================

    function init() {
        UIManager.init();

        let selTimer;
        document.addEventListener('selectionchange', () => {
            if (AppState.isModalOpen) return;
            clearTimeout(selTimer);
            selTimer = setTimeout(() => {
                const txt = window.getSelection().toString().trim();
                if (txt.length > 1) {
                    AppState.analysisText = txt;
                    UIManager.setFloatBtnVisible(true); 
                } else {
                    AppState.analysisText = '';
                }
            }, 200);
        });

        const handleScroll = Utils.debounce(() => {
            const currentScrollY = window.scrollY;
            if (AppState.analysisText) {
                UIManager.setFloatBtnVisible(true); 
            } else {
                if (currentScrollY > AppState.lastScrollY && currentScrollY > 100) {
                    UIManager.setFloatBtnVisible(false);
                } else {
                    UIManager.setFloatBtnVisible(true);
                }
            }
            AppState.lastScrollY = currentScrollY;
        }, 100);

        window.addEventListener('scroll', handleScroll);

        GM_registerMenuCommand("📝 中文总结", () => CoreController.startSummary('zh'));
        GM_registerMenuCommand("📄 English Summary", () => CoreController.startSummary('en'));
        GM_registerMenuCommand("⚙️ 设置", () => { UIManager.openModal('⚙️ 设置', 'SETTINGS'); UIManager.renderSettings(); });
        
        console.log('DeepRead v1.3.6 Loaded');
    }

    init();
})();