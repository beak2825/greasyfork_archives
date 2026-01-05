// ==UserScript==
// @name         Vox Web
// @namespace    http://tampermonkey.net/
// @version      1.5.01
// @description  二合一朗读脚本：支持 Twitter/X 紧凑朗读 + 其他网站智能段落朗读。共用 TTS 源。移动端修复版：将朗读按钮移至推文顶部（右上角三个点旁边），彻底解决移动端显示不全和误触视频的问题。
// @author       DeepRead Combined
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      read-aloud-123.vercel.app
// @connect      read-aloud-bay.vercel.app
// @connect      libre-tts-nu.vercel.app
// @connect      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559336/Vox%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/559336/Vox%20Web.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // [0] 全局配置
    // =========================================================================

    const HOST = window.location.hostname;
    const IS_TWITTER = HOST.includes('twitter.com') || HOST.includes('x.com');

    // TTS 源
    const DEFAULT_SOURCES = [
        { url: "https://libre-tts-nu.vercel.app/api/tts", token: "" },
        { url: "https://read-aloud-123.vercel.app/api/synthesis", token: "" },
        { url: "https://read-aloud-bay.vercel.app/api/synthesis", token: "" }
    ];

    const ENGLISH_VOICES = [
        "en-US-AriaNeural", "en-US-GuyNeural", "en-US-JennyNeural",
        "en-US-DavisNeural", "en-US-AndrewNeural", "en-US-SaraNeural"
    ];

    const Cfg = {
        get: (key, def) => GM_getValue(key, def),
        set: (key, val) => GM_setValue(key, val)
    };

    const getRandomVoice = () => ENGLISH_VOICES[Math.floor(Math.random() * ENGLISH_VOICES.length)];

    function updateVisibility() {
        const isVisible = Cfg.get('showButtons', true);
        const styleId = 'tts-visibility-style';
        let styleTag = document.getElementById(styleId);

        if (!isVisible) {
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = styleId;
                styleTag.innerHTML = `.para-read-btn, .x-tts-header-btn { display: none !important; }`;
                document.head.appendChild(styleTag);
            }
        } else {
            if (styleTag) styleTag.remove();
        }
    }

    // =========================================================================
    // [1] CSS 样式 (适配顶部 Header)
    // =========================================================================
    
    const CSS_CODE = `
        /* --- 通用：段落朗读按钮 --- */
        .para-read-btn {
            display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; margin-left: 8px;
            cursor: pointer; color: #5f6368; transition: all 0.2s ease; vertical-align: middle; border-radius: 50%;
            background-color: rgba(0,0,0,0.05); user-select: none; -webkit-tap-highlight-color: transparent;
        }
        .para-read-btn:hover { background-color: rgba(0,0,0,0.1); color: #202124; transform: scale(1.05); }
        .para-read-btn svg { width: 16px; height: 16px; display: block; pointer-events: none; }
        
        /* --- Twitter/X：顶部 Header 按钮 --- */
        .x-tts-header-btn {
            display: inline-flex; align-items: center; justify-content: center;
            width: 32px; height: 32px; /* 足够大的触摸区域 */
            border-radius: 50%;
            cursor: pointer;
            color: #1d9bf0; /* 推特蓝 */
            transition: all 0.2s;
            margin-right: 2px; /* 与三个点保持微小距离 */
            background: transparent;
            border: none;
            outline: none;
            flex-shrink: 0;
            position: relative;
            z-index: 999;
        }
        .x-tts-header-btn:hover {
            background-color: rgba(29, 155, 240, 0.1);
            transform: scale(1.05);
        }
        .x-tts-header-btn svg {
            width: 18px; height: 18px;
            fill: currentColor;
            pointer-events: none;
        }

        /* --- 播放/加载状态 --- */
        .tts-playing { 
            color: #1a73e8 !important; 
            animation: tts-pulse 1.5s infinite; 
            background-color: rgba(29, 155, 240, 0.15) !important;
        }
        .tts-loading { opacity: 0.6; animation: tts-breathe 1.2s ease-in-out infinite; cursor: wait; }
        
        @keyframes tts-pulse {
            0% { box-shadow: 0 0 0 0 rgba(29, 155, 240, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(29, 155, 240, 0); }
            100% { box-shadow: 0 0 0 0 rgba(29, 155, 240, 0); }
        }
        @keyframes tts-breathe {
            0% { opacity: 0.5; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.5; transform: scale(0.9); }
        }

        /* --- 设置界面 (保持不变) --- */
        .tts-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483647; display: none; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
        .tts-modal { background: white; width: 90%; max-width: 520px; padding: 20px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: sans-serif; color: #333; display: flex; flex-direction: column; max-height: 80vh; }
        .tts-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
        .tts-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
        .tts-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #999; }
        .tts-body { overflow-y: auto; flex-grow: 1; padding-right: 5px; }
        .tts-switch-box { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px; display: flex; align-items: center; }
        .tts-switch-box label { display: flex; align-items: center; cursor: pointer; width: 100%; font-weight: 500; }
        .tts-switch-box input[type="checkbox"] { margin-right: 10px; width: 16px; height: 16px; accent-color: #1a73e8; }
        .tts-source-row { display: flex; gap: 8px; margin-bottom: 10px; align-items: center; }
        .tts-inp { padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; font-family: monospace; }
        .tts-url { flex: 1; }
        .tts-token { width: 80px; }
        .tts-btn { padding: 8px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.2s; }
        .tts-btn-add { background: #e8f5e9; color: #2e7d32; width: 100%; margin-bottom: 15px; border: 1px dashed #81c784; }
        .tts-btn-del { background: #ffebee; color: #c62828; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;}
        .tts-btn-test { background: #fff3e0; color: #ef6c00; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .test-ok { background: #e8f5e9 !important; color: #2e7d32 !important; }
        .test-err { background: #ffebee !important; color: #c62828 !important; }
        .tts-footer { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }
        .tts-save { background: #1a73e8; color: white; }
        .tts-cancel { background: #f1f3f4; color: #333; }
        
        @media (prefers-color-scheme: dark) {
            .tts-modal { background: #202124; color: #e8eaed; }
            .tts-header, .tts-footer { border-color: #3c4043; }
            .tts-switch-box { background: #303134; }
            .tts-inp { background: #303134; border-color: #5f6368; color: white; }
            .tts-btn-add { background: #303134; color: #81c784; border-color: #81c784; }
            .tts-btn-del { background: #451a1a; color: #ef9a9a; }
            .tts-btn-test { background: #4e342e; color: #ffb74d; }
            .test-ok { background: #1b5e20 !important; color: #a5d6a7 !important; }
            .test-err { background: #b71c1c !important; color: #ef9a9a !important; }
            .tts-cancel { background: #303134; color: #e8eaed; }
        }
    `;

    function injectStyles() {
        if (document.head) {
            const style = document.createElement('style');
            style.textContent = CSS_CODE;
            document.head.appendChild(style);
        } else {
            requestAnimationFrame(injectStyles);
        }
    }
    injectStyles();

    // =========================================================================
    // [2] TTS 核心
    // =========================================================================
    
    const TTSService = {
        audio: null,
        currentBtn: null, 

        stop() {
            if (this.audio) { this.audio.pause(); this.audio = null; }
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (this.currentBtn) {
                this.currentBtn.classList.remove('tts-playing', 'tts-loading', 'test-loading');
                this.currentBtn = null;
            }
        },

        _buildRequest(source, text) {
            const voice = getRandomVoice();
            const { url, token } = source;
            let finalUrl = "", headers = {};
            if (url.includes('/api/tts')) {
                const params = new URLSearchParams({ t: text, v: voice });
                finalUrl = `${url}?${params.toString()}`;
            } else {
                const params = new URLSearchParams({ text: text, voiceName: voice, rate: '+0%', pitch: '0Hz', token: token || "^&GMxejwnSa8CKA" });
                finalUrl = `${url}?${params.toString()}`;
                headers = { "Referer": "https://read-aloud-123.vercel.app/" };
            }
            return { url: finalUrl, headers };
        },

        _playLocal(text, btn) {
            if (!window.speechSynthesis) return;
            const u = new SpeechSynthesisUtterance(text);
            u.lang = /[\u4e00-\u9fa5]/.test(text) ? 'zh-CN' : 'en-US';
            u.onstart = () => { if(btn) btn.classList.replace('tts-loading', 'tts-playing'); };
            u.onend = () => this.stop();
            u.onerror = () => this.stop();
            window.speechSynthesis.speak(u);
        },

        test(source, btnElement) {
            this.stop(); 
            this.currentBtn = btnElement;
            btnElement.classList.remove('test-ok', 'test-err');
            btnElement.classList.add('test-loading');
            
            const req = this._buildRequest(source, "Test pass.");
            GM_xmlhttpRequest({
                method: "GET", url: req.url, headers: req.headers, responseType: 'blob', timeout: 5000,
                onload: (res) => {
                    if (res.status === 200 && res.response && res.response.size > 100) {
                        try {
                            const blobUrl = URL.createObjectURL(res.response);
                            const audio = new Audio(blobUrl);
                            this.audio = audio;
                            audio.oncanplaythrough = () => {
                                btnElement.classList.remove('test-loading');
                                btnElement.classList.add('test-ok');
                                audio.play();
                            };
                            audio.onended = () => { URL.revokeObjectURL(blobUrl); this.audio = null; this.currentBtn = null; };
                            audio.onerror = () => { btnElement.classList.remove('test-loading'); btnElement.classList.add('test-err'); };
                        } catch (e) { btnElement.classList.remove('test-loading'); btnElement.classList.add('test-err'); }
                    } else { btnElement.classList.remove('test-loading'); btnElement.classList.add('test-err'); }
                },
                onerror: () => { btnElement.classList.remove('test-loading'); btnElement.classList.add('test-err'); },
                ontimeout: () => { btnElement.classList.remove('test-loading'); btnElement.classList.add('test-err'); }
            });
        },

        play(text, btnElement) {
            const cleanText = text.trim();
            if (!cleanText) return;
            if (this.currentBtn === btnElement && btnElement.classList.contains('tts-playing')) { this.stop(); return; }
            
            this.stop();
            this.currentBtn = btnElement;
            btnElement.classList.add('tts-loading');

            let sources = Cfg.get('sourceList', DEFAULT_SOURCES);
            if (!Array.isArray(sources) || sources.length === 0) sources = DEFAULT_SOURCES;

            const trySource = (index) => {
                if (index >= sources.length) { this._playLocal(cleanText, btnElement); return; }
                const req = this._buildRequest(sources[index], cleanText);
                GM_xmlhttpRequest({
                    method: "GET", url: req.url, headers: req.headers, responseType: 'blob', timeout: 8000,
                    onload: (res) => {
                        if (res.status === 200 && res.response && res.response.size > 100) {
                            try {
                                const blobUrl = URL.createObjectURL(res.response);
                                if (this.currentBtn !== btnElement) { URL.revokeObjectURL(blobUrl); return; }
                                const audio = new Audio(blobUrl);
                                this.audio = audio;
                                audio.oncanplaythrough = () => {
                                    btnElement.classList.remove('tts-loading');
                                    btnElement.classList.add('tts-playing');
                                    audio.play();
                                };
                                audio.onended = () => { URL.revokeObjectURL(blobUrl); this.stop(); };
                                audio.onerror = () => { URL.revokeObjectURL(blobUrl); trySource(index + 1); };
                            } catch (e) { trySource(index + 1); }
                        } else { trySource(index + 1); }
                    },
                    onerror: () => trySource(index + 1), ontimeout: () => trySource(index + 1)
                });
            };
            trySource(0);
        }
    };

    // =========================================================================
    // [3] DOM 扫描与注入
    // =========================================================================

    const ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    const ICON_SVG_SOLID = `<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;

    // --- Twitter/X 顶部 Header 注入模式 (移动端/桌面端通用) ---
    function initTwitter() {
        console.log("TTS: Twitter Header Mode Activated (v1.9)");
        
        const processTweet = (article) => {
            // 1. 检查是否处理过
            if (article.getAttribute('data-tts-injected') === '1') return;
            
            // 2. 找到推文文本 (确保有内容可读)
            const textNode = article.querySelector('[data-testid="tweetText"]');
            if (!textNode) return;
            const text = textNode.innerText;
            if (!text || text.trim().length < 1) return;

            // 3. 找到顶部的“三个点”菜单 (Caret)
            // 这是推文右上角最稳定的元素，无论是移动端还是桌面端
            const caret = article.querySelector('[data-testid="caret"]');
            if (!caret) return;

            // 4. 创建按钮
            const btn = document.createElement('button');
            btn.className = 'x-tts-header-btn';
            btn.innerHTML = ICON_SVG_SOLID; 
            btn.title = '朗读推文';
            btn.setAttribute('aria-label', '朗读推文');

            // 5. 事件处理 (Capture 阶段，防止误触)
            const handleInteract = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                TTSService.play(text, btn);
            };

            btn.onclick = handleInteract;
            btn.ontouchend = handleInteract;

            // 6. 注入：插入到 Caret (三个点) 的前面
            // caret.parentNode 通常是 flex 布局的 header
            if (caret.parentNode) {
                // 确保父级允许插入
                caret.parentNode.insertBefore(btn, caret);
                article.setAttribute('data-tts-injected', '1');
            }
        };

        const observer = new MutationObserver(() => {
            document.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);
        });
        
        observer.observe(document.documentElement, { childList: true, subtree: true });

        setInterval(() => {
            document.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);
        }, 1200);
    }

    // --- 通用模式 (保持不变) ---
    function initGeneric() {
        console.log("TTS: Generic Mode Activated");
        const processPara = (p) => {
            if (p.querySelector('.para-read-btn') || p.getAttribute('data-tts') === '1') return;
            const text = p.innerText.trim();
            if (text.length < 15) return; 
            if (p.closest('nav, footer, script, style, .menu, .sidebar')) return; 

            const btn = document.createElement('span');
            btn.className = 'para-read-btn';
            btn.innerHTML = ICON_SVG; 
            btn.title = '朗读此段';
            
            const handleInteract = (e) => {
                e.preventDefault();
                e.stopPropagation();
                TTSService.play(text, btn);
            };

            btn.onclick = handleInteract;
            btn.ontouchend = handleInteract;

            p.appendChild(btn);
            p.setAttribute('data-tts', '1');
        };

        const scan = () => document.querySelectorAll('p, article p, .article-content p, blockquote').forEach(processPara);
        scan();
        setInterval(scan, 1500); 
    }

    // =========================================================================
    // [4] 设置菜单 UI
    // =========================================================================
    
    function createSettingsUI() {
        if (document.getElementById('tts-settings-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'tts-settings-overlay';
        overlay.className = 'tts-overlay';
        
        const sources = Cfg.get('sourceList', DEFAULT_SOURCES);
        const showButtons = Cfg.get('showButtons', true);
        
        let rowsHtml = '';
        sources.forEach(s => {
            rowsHtml += `
                <div class="tts-source-row">
                    <input type="text" class="tts-inp tts-url" placeholder="https://..." value="${s.url}">
                    <input type="text" class="tts-inp tts-token" placeholder="Token" value="${s.token || ''}">
                    <button class="tts-btn tts-btn-test" title="测试">⚡</button>
                    <button class="tts-btn tts-btn-del" title="删除">×</button>
                </div>
            `;
        });

        overlay.innerHTML = `
            <div class="tts-modal">
                <div class="tts-header"><h3>📢 TTS 脚本配置</h3><button class="tts-close" id="tts-ui-close">×</button></div>
                <div class="tts-body">
                    <div class="tts-switch-box">
                        <label><input type="checkbox" id="tts-ui-toggle" ${showButtons ? 'checked' : ''}> 显示页面播放按钮</label>
                    </div>
                    <button class="tts-btn tts-btn-add" id="tts-ui-add">+ 添加接口</button>
                    <div id="tts-ui-list">${rowsHtml}</div>
                </div>
                <div class="tts-footer">
                    <button class="tts-btn tts-cancel" id="tts-ui-cancel">取消</button>
                    <button class="tts-btn tts-save" id="tts-ui-save">保存</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        overlay.style.display = 'flex';

        const close = () => { overlay.remove(); TTSService.stop(); };
        const list = document.getElementById('tts-ui-list');
        document.getElementById('tts-ui-close').onclick = close;
        document.getElementById('tts-ui-cancel').onclick = close;
        
        list.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.classList.contains('tts-btn-del')) e.target.closest('.tts-source-row').remove();
            if (e.target.classList.contains('tts-btn-test')) {
                const row = e.target.closest('.tts-source-row');
                const url = row.querySelector('.tts-url').value.trim();
                const token = row.querySelector('.tts-token').value.trim();
                if (!url) { alert('输入地址'); return; }
                TTSService.test({ url, token }, e.target);
            }
        });

        document.getElementById('tts-ui-add').onclick = () => {
            const div = document.createElement('div');
            div.className = 'tts-source-row';
            div.innerHTML = `<input type="text" class="tts-inp tts-url" placeholder="https://..."><input type="text" class="tts-inp tts-token" placeholder="Token"><button class="tts-btn tts-btn-test">⚡</button><button class="tts-btn tts-btn-del">×</button>`;
            list.appendChild(div);
        };

        document.getElementById('tts-ui-save').onclick = () => {
            const newSources = [];
            list.querySelectorAll('.tts-source-row').forEach(row => {
                const u = row.querySelector('.tts-url').value.trim();
                const t = row.querySelector('.tts-token').value.trim();
                if (u) newSources.push({ url: u, token: t });
            });
            Cfg.set('sourceList', newSources);
            const isShow = document.getElementById('tts-ui-toggle').checked;
            Cfg.set('showButtons', isShow);
            updateVisibility();
            close();
        };
    }

    GM_registerMenuCommand("⚙️ 配置 TTS 接口", createSettingsUI);

    updateVisibility();
    if (IS_TWITTER) {
        initTwitter();
    } else {
        if (document.readyState === 'complete') initGeneric();
        else window.addEventListener('load', initGeneric);
    }

})();
