// ==UserScript==
// @name         VOX Flow
// @namespace    http://tampermonkey.net/
// @version      5.92
// @description  基于 v5.91，新增“下载音频”功能，可将缓存的音频合并下载为 MP3。
// @author       Gemini & User
// @match        *://*/*
// @require      https://unpkg.com/@mozilla/readability@0.4.2/Readability.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @resource     SwalCSS https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559326/VOX%20Flow.user.js
// @updateURL https://update.greasyfork.org/scripts/559326/VOX%20Flow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 0. 初始化与样式资源
    // ==========================================

    const swalCssText = GM_getResourceText("SwalCSS");
    if (swalCssText) {
        GM_addStyle(swalCssText);
        // 增加 SweetAlert 在移动端的层级和适配
        GM_addStyle(`
            .swal2-container { z-index: 2147483647 !important; }
            .swal2-popup { font-size: 14px !important; }
            /* 移动端输入框适配 */
            @media (max-width: 640px) {
                .tts-config-row input { font-size: 12px !important; padding: 5px !important; }
            }
        `);
    }

    // --- 1. 语音库定义 ---
    const PRESET_VOICES_ZH = [
        { label: "🇨🇳 普通话 - 晓晓 (女/活泼)", value: "zh-CN-XiaoxiaoNeural" },
        { label: "🇨🇳 普通话 - 云希 (男/稳重)", value: "zh-CN-YunxiNeural" },
        { label: "🇨🇳 普通话 - 云健 (男/新闻)", value: "zh-CN-YunjianNeural" },
        { label: "🇨🇳 普通话 - 晓伊 (女/温柔)", value: "zh-CN-XiaoyiNeural" },
        { label: "🇨🇳 辽宁口音 - 晓北 (女)", value: "zh-CN-liaoning-XiaobeiNeural" },
        { label: "🇨🇳 陕西口音 - 晓妮 (女)", value: "zh-CN-shaanxi-XiaoniNeural" },
        { label: "🇹🇼 台湾 - 晓臻 (女)", value: "zh-TW-HsiaoChenNeural" },
        { label: "🇹🇼 台湾 - 云哲 (男)", value: "zh-TW-YunJheNeural" },
        { label: "🇭🇰 粤语 - 晓曼 (女)", value: "zh-HK-HiuMaanNeural" },
        { label: "🇭🇰 粤语 - 云龙 (男)", value: "zh-HK-WanLungNeural" }
    ];

    const PRESET_VOICES_EN = [
        { label: "🇺🇸 美式 - Eric (男)", value: "en-US-EricNeural" },
        { label: "🇺🇸 美式 - Ana (女)", value: "en-US-AnaNeural" },
        { label: "🇬🇧 英式 - Sonia (女)", value: "en-GB-SoniaNeural" },
        { label: "🇬🇧 英式 - Ryan (男)", value: "en-GB-RyanNeural" }
    ];

    // --- 2. 配置管理 ---
    
    const DEFAULT_TTS_CONFIG = [
        { url: "https://libre-tts-nu.vercel.app/api/tts", token: "" },
        { url: "https://read-aloud-123.vercel.app/api/synthesis", token: "^&GMxejwnSa8CKA" },
        { url: "https://read-aloud-bay.vercel.app/api/synthesis", token: "" }
    ];

    const DEFAULTS = {
        useSystem: false,
        voiceZh: "zh-CN-XiaoxiaoNeural",
        voiceEn: "en-US-EricNeural",
        speed: 0,
        lang: 'zh',
        isPanelHidden: false,
        highlightMode: true
    };

    let config = {
        useSystem: GM_getValue('useSystem', DEFAULTS.useSystem),
        voiceZh: GM_getValue('voiceZh', DEFAULTS.voiceZh),
        voiceEn: GM_getValue('voiceEn', DEFAULTS.voiceEn),
        speed: GM_getValue('speed', DEFAULTS.speed),
        lang: GM_getValue('last_lang', DEFAULTS.lang),
        isPanelHidden: GM_getValue('is_panel_hidden', DEFAULTS.isPanelHidden),
        highlightMode: GM_getValue('highlight_mode', DEFAULTS.highlightMode)
    };

    // ==========================================
    // API 管理模块
    // ==========================================

    function buildTTSRequestUrl(baseUrl, userToken, text, voiceName, speed) {
        const cleanBaseUrl = baseUrl.trim().split('?')[0].replace(/\/+$/, '');
        let params = new URLSearchParams();
        let rateStr = '+0%';
        if (speed !== 0) rateStr = (speed > 0 ? '+' : '') + speed + '%';

        const defaultToken = '^&GMxejwnSa8CKA';
        const finalToken = userToken && userToken.trim() !== "" ? userToken.trim() : defaultToken;

        if (cleanBaseUrl.endsWith('/api/tts')) {
            params.append('t', text); params.append('v', voiceName); params.append('r', speed);
        } else if (cleanBaseUrl.endsWith('/api/ra')) {
            params.append('text', text); params.append('voice', voiceName);
        } else {
            params.append('text', text); params.append('voiceName', voiceName);
            params.append('token', finalToken); params.append('rate', rateStr); params.append('pitch', '0Hz');
        }
        return `${cleanBaseUrl}?${params.toString()}`;
    }

    function openApiSettings() {
        let currentConfig = GM_getValue('ttsConfig', DEFAULT_TTS_CONFIG);
        if (typeof currentConfig === 'string') currentConfig = JSON.parse(currentConfig);
        if (!Array.isArray(currentConfig)) currentConfig = DEFAULT_TTS_CONFIG;

        // 生成行 HTML，优化移动端布局，增加 min-width:0 防止 flex 溢出
        const generateRows = (list) => list.map((item) => `
            <div class="tts-config-row" style="display:flex; gap:5px; margin-bottom:8px; align-items: center;">
                <input type="text" class="swal2-input url-input" value="${item.url}" placeholder="API URL" style="flex:2; margin:0; font-size:14px; min-width:0;">
                <input type="text" class="swal2-input token-input" value="${item.token || ''}" placeholder="Token (选填)" style="flex:1; margin:0; font-size:14px; min-width:0;">
                <button type="button" class="swal2-confirm swal2-styled tts-test-btn" style="width:36px; height:36px; margin:0; padding:0; min-width:unset; display:flex; align-items:center; justify-content:center; background-color:#17a2b8;" title="测试线路">⚡</button>
                <button type="button" class="swal2-deny swal2-styled tts-del-btn" style="width:36px; height:36px; margin:0; padding:0; min-width:unset; display:flex; align-items:center; justify-content:center;" title="删除">×</button>
            </div>
        `).join('');

        // 计算宽度：手机端 95%，电脑端 600px
        const popupWidth = window.innerWidth < 640 ? '95%' : '600px';

        Swal.fire({
            title: '🛠️ 自定义 TTS API 源',
            html: `
                <div style="font-size:12px; color:#666; margin-bottom:10px; text-align:left;">配置轮询列表。点击 ⚡ 可朗读测试 "Hello"。</div>
                <div id="tts-config-container" style="max-height:300px; overflow-y:auto; padding:2px; overflow-x:hidden;">${generateRows(currentConfig)}</div>
                <button type="button" id="tts-add-btn" class="swal2-confirm swal2-styled" style="width:100%; margin-top:10px; background-color:#6c757d;">+ 添加新源</button>
            `,
            width: popupWidth, 
            showCancelButton: true, 
            confirmButtonText: '保存并应用', 
            cancelButtonText: '取消',
            didOpen: () => {
                const container = document.getElementById('tts-config-container');
                
                container.addEventListener('click', (e) => {
                    // 删除逻辑
                    if (e.target.closest('.tts-del-btn')) {
                        e.target.closest('.tts-config-row').remove();
                    }
                    
                    // 测试逻辑 (包含朗读)
                    if (e.target.closest('.tts-test-btn')) {
                        const btn = e.target.closest('.tts-test-btn');
                        const row = btn.parentElement;
                        const url = row.querySelector('.url-input').value.trim();
                        const token = row.querySelector('.token-input').value.trim();

                        if (!url) {
                            const originalText = btn.textContent;
                            btn.textContent = '❓';
                            setTimeout(() => btn.textContent = originalText, 1000);
                            return;
                        }

                        // UI 状态：测试中
                        const originalText = btn.textContent;
                        const originalBg = btn.style.backgroundColor;
                        btn.textContent = '⏳';
                        btn.style.backgroundColor = '#ffc107'; 
                        btn.disabled = true;

                        // 1. 构造 "Hello" 测试请求
                        const testVoice = config.voiceEn || "en-US-EricNeural";
                        const testUrl = buildTTSRequestUrl(url, token, "Hello", testVoice, 0);

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: testUrl,
                            timeout: 8000,
                            responseType: "blob", 
                            onload: (res) => {
                                if (res.status === 200 && res.response && res.response.size > 0) {
                                    // 2. 成功：播放音频
                                    btn.textContent = '🔊'; // 显示喇叭图标
                                    btn.style.backgroundColor = '#28a745';
                                    
                                    try {
                                        const audioUrl = URL.createObjectURL(res.response);
                                        const audio = new Audio(audioUrl);
                                        audio.play();
                                        audio.onended = () => {
                                            URL.revokeObjectURL(audioUrl);
                                            // 播放完变回对号
                                            btn.textContent = '✅';
                                            setTimeout(() => {
                                                btn.disabled = false;
                                                btn.textContent = originalText; // 恢复闪电
                                                btn.style.backgroundColor = originalBg;
                                            }, 2000);
                                        };
                                        audio.onerror = () => {
                                            console.warn("Audio play error");
                                            btn.textContent = '⚠️'; // 格式对但播放失败
                                            setTimeout(() => { btn.disabled = false; btn.textContent = originalText; btn.style.backgroundColor = originalBg; }, 2000);
                                        };
                                    } catch(e) {
                                        console.error(e);
                                        btn.textContent = '⚠️';
                                        btn.disabled = false;
                                    }

                                } else {
                                    // 失败
                                    btn.textContent = '❌';
                                    btn.style.backgroundColor = '#dc3545';
                                    setTimeout(() => {
                                        btn.disabled = false;
                                        btn.textContent = originalText;
                                        btn.style.backgroundColor = originalBg;
                                    }, 2000);
                                }
                            },
                            onerror: (err) => {
                                btn.textContent = '❌';
                                btn.style.backgroundColor = '#dc3545';
                                setTimeout(() => {
                                    btn.disabled = false;
                                    btn.textContent = originalText;
                                    btn.style.backgroundColor = originalBg;
                                }, 2000);
                            },
                            ontimeout: () => {
                                btn.textContent = '⏱️';
                                btn.style.backgroundColor = '#dc3545';
                                setTimeout(() => {
                                    btn.disabled = false;
                                    btn.textContent = originalText;
                                    btn.style.backgroundColor = originalBg;
                                }, 2000);
                            }
                        });
                    }
                });

                document.getElementById('tts-add-btn').addEventListener('click', () => {
                    const div = document.createElement('div');
                    div.className = 'tts-config-row'; 
                    div.style.cssText = "display:flex; gap:5px; margin-bottom:8px; align-items: center;";
                    div.innerHTML = `
                        <input type="text" class="swal2-input url-input" placeholder="API URL" style="flex:2; margin:0; font-size:14px; min-width:0;">
                        <input type="text" class="swal2-input token-input" placeholder="Token" style="flex:1; margin:0; font-size:14px; min-width:0;">
                        <button type="button" class="swal2-confirm swal2-styled tts-test-btn" style="width:36px; height:36px; margin:0; padding:0; min-width:unset; display:flex; align-items:center; justify-content:center; background-color:#17a2b8;" title="测试线路">⚡</button>
                        <button type="button" class="swal2-deny swal2-styled tts-del-btn" style="width:36px; height:36px; margin:0; padding:0; min-width:unset; display:flex; align-items:center; justify-content:center;">×</button>
                    `;
                    container.appendChild(div);
                });
            },
            preConfirm: () => {
                const rows = document.querySelectorAll('#tts-config-container .tts-config-row');
                const newConfig = [];
                rows.forEach(row => {
                    const url = row.querySelector('.url-input').value.trim();
                    const token = row.querySelector('.token-input').value.trim();
                    if (url) newConfig.push({ url, token });
                });
                return newConfig;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                GM_setValue('ttsConfig', result.value);
                if(confirm('配置已保存。是否清空旧缓存以应用新源？')) {
                    IDB.clearStore().then(() => window.location.reload());
                }
            }
        });
    }

    // --- IndexedDB 工具 ---
    const DB_NAME = 'TTS_Cache_DB_V2';
    const STORE_NAME = 'audio_chunks';
    const DB_VERSION = 1;

    const IDB = {
        db: null,
        init: function() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                };
                request.onsuccess = (e) => {
                    this.db = e.target.result;
                    this.cleanExpired();
                    resolve();
                };
                request.onerror = (e) => reject(e);
            });
        },
        put: function(id, blob) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not init");
                const tx = this.db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                store.put({ id: id, blob: blob, timestamp: Date.now() });
                tx.oncomplete = () => resolve();
                tx.onerror = (e) => reject(e);
            });
        },
        get: function(id) {
            return new Promise((resolve) => {
                if (!this.db) return resolve(null);
                const tx = this.db.transaction([STORE_NAME], 'readonly');
                const store = tx.objectStore(STORE_NAME);
                const req = store.get(id);
                req.onsuccess = () => resolve(req.result ? req.result.blob : null);
                req.onerror = () => resolve(null);
            });
        },
        cleanExpired: function() {
            const ONE_DAY = 24 * 60 * 60 * 1000;
            const tx = this.db.transaction([STORE_NAME], 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => {
                const now = Date.now();
                if (req.result) {
                    req.result.forEach(item => {
                        if (now - item.timestamp > ONE_DAY) {
                            store.delete(item.id);
                        }
                    });
                }
            };
        },
        clearStore: function() {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not init");
                const tx = this.db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                const req = store.clear();
                req.onsuccess = () => resolve();
                req.onerror = (e) => reject(e);
            });
        }
    };

    // 运行时状态 (v5.7 Add failedCount)
    let runtime = {
        state: 'IDLE',
        audioQueue: [], 
        currentIndex: 0,
        currentAudio: null,
        currentUtterance: null,
        uiRoot: null,
        highlightSpan: null,
        highlightTimers: [],
        systemVoices: [],
        downloadQueue: [],
        downloadingIndices: new Set(),
        failedCount: 0, // 新增：失败计数
        bufferProgress: 0,
        currentUrlHash: window.location.pathname,
        timeline: [],
        totalEstimatedDuration: 0,
        articleTitle: document.title || "未知文章"
    };

    // --- 3. 高亮系统 ---
    GM_addStyle(`
        .tts-highlight-marker {
            background-color: #ffeb3b !important;
            color: #000 !important;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(255, 235, 59, 0.6);
            padding: 2px 0;
            transition: background-color 0.1s;
        }
        @media (prefers-color-scheme: dark) {
            .tts-highlight-marker { background-color: #fdd835 !important; color: #000 !important; }
        }
    `);

    function clearHighlight() {
        runtime.highlightTimers.forEach(t => clearTimeout(t));
        runtime.highlightTimers = [];
        if (runtime.highlightSpan && runtime.highlightSpan.parentNode) {
            const parent = runtime.highlightSpan.parentNode;
            while (runtime.highlightSpan.firstChild) parent.insertBefore(runtime.highlightSpan.firstChild, runtime.highlightSpan);
            parent.removeChild(runtime.highlightSpan);
            parent.normalize();
            runtime.highlightSpan = null;
        }
    }

    function doHighlight(textFragment) {
        if (!config.highlightMode || !textFragment) return;
        if (runtime.highlightSpan && runtime.highlightSpan.textContent === textFragment) return;

        if (runtime.highlightSpan && runtime.highlightSpan.parentNode) {
            const parent = runtime.highlightSpan.parentNode;
            while (runtime.highlightSpan.firstChild) parent.insertBefore(runtime.highlightSpan.firstChild, runtime.highlightSpan);
            parent.removeChild(runtime.highlightSpan);
            parent.normalize();
            runtime.highlightSpan = null;
        }

        const cleanFrag = textFragment.trim();
        if (cleanFrag.length < 1) return;

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    const p = node.parentElement;
                    if (!p || p.closest('#tts-plus-root') ||
                        ['SCRIPT','STYLE','NOSCRIPT','svg'].includes(p.tagName) ||
                        p.offsetParent === null) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while (node = walker.nextNode()) {
            const val = node.nodeValue;
            const index = val.indexOf(cleanFrag);
            if (index !== -1) {
                try {
                    const range = document.createRange();
                    range.setStart(node, index);
                    range.setEnd(node, index + cleanFrag.length);

                    const span = document.createElement('span');
                    span.className = 'tts-highlight-marker';
                    range.surroundContents(span);
                    runtime.highlightSpan = span;

                    const rect = span.getBoundingClientRect();
                    const vh = window.innerHeight;
                    if (rect.top < vh * 0.2 || rect.bottom > vh * 0.6) {
                        span.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                    return;
                } catch (e) {}
            }
        }
    }

    // --- 4. 文本处理与清洗增强 ---

    function cleanText(text) {
        if (!text) return "";
        let t = text.replace(/https?:\/\/[^\s]+/g, '')
                    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') 
                    .replace(/[\x00-\x1F\x7F]/g, '') 
                    .replace(/\s+/g, ' ')
                    .trim();
        return t;
    }

    function preCleanDoc(doc) {
        const garbageTags = ['sup', 'figcaption', 'script', 'style', 'noscript', 'iframe', 'svg'];
        garbageTags.forEach(tag => {
            doc.querySelectorAll(tag).forEach(el => el.remove());
        });
        const garbageClasses = [
            '.advertisement', '.ad-container', '.share-buttons', '.related-posts', 
            '.hidden', '.sr-only', '[aria-hidden="true"]', '.comment-section'
        ];
        garbageClasses.forEach(selector => {
            doc.querySelectorAll(selector).forEach(el => el.remove());
        });
    }

    function extractContent() {
        let rawText = "";
        const hostname = window.location.hostname;
        if (hostname.includes("nytimes.com") || hostname.includes("bbc.com")) {
            const els = document.querySelectorAll(".article-paragraph, .css-158dogj, article p");
            if(els.length > 0) rawText = Array.from(els).map(e=>e.innerText).join("\n");
        }
        if (!rawText) {
            const docClone = document.cloneNode(true);
            preCleanDoc(docClone);
            const article = new Readability(docClone).parse();
            if(article) runtime.articleTitle = article.title; 
            rawText = article ? (article.title + "。\n" + article.textContent) :
                Array.from(document.querySelectorAll('p')).filter(p=>p.innerText.length>20).map(p=>p.innerText).join("\n");
        }
        return cleanText(rawText);
    }

    function forceSplit(text, limit = 140) {
        if (text.length <= limit) return [text];
        const res = [];
        let i = 0;
        while (i < text.length) {
            let end = i + limit;
            if (end >= text.length) {
                res.push(text.slice(i));
                break;
            }
            let splitAt = text.lastIndexOf(' ', end);
            if (splitAt === -1 || splitAt < i + limit * 0.6) {
                 splitAt = text.lastIndexOf('，', end); 
            }
            if (splitAt === -1 || splitAt < i + limit * 0.6) {
                 splitAt = end;
            }
            res.push(text.slice(i, splitAt));
            i = splitAt;
            while(i < text.length && [' ', '，', ','].includes(text[i])) i++;
        }
        return res;
    }

    function smartSegmentText(text) {
        let segments = [];
        if (!('Intl' in window) || !Intl.Segmenter) {
            segments = text.match(/[^.?!。？！;；]+[.?!。？！;；]+/g) || [text];
        } else {
            const segmenter = new Intl.Segmenter(config.lang, { granularity: 'sentence' });
            const intlSegs = segmenter.segment(text);
            let buffer = "";
            const BUFFER_LIMIT = config.useSystem ? 800 : 220; 
            for (const seg of intlSegs) {
                const s = seg.segment;
                if (buffer.length + s.length > BUFFER_LIMIT) {
                    if (buffer) segments.push(buffer);
                    buffer = s;
                } else {
                    buffer += s;
                }
            }
            if (buffer) segments.push(buffer);
        }
        
        let safeSegments = [];
        const SAFE_MAX_LEN = 160; 
        segments.forEach(seg => {
            if (seg.length > SAFE_MAX_LEN) {
                safeSegments = safeSegments.concat(forceSplit(seg, SAFE_MAX_LEN));
            } else {
                safeSegments.push(seg);
            }
        });
        
        return safeSegments;
    }

    function calculateTimeline() {
        const charRate = config.lang === 'zh' ? 0.25 : 0.15;
        let currentTime = 0;
        runtime.timeline = [];
        runtime.audioQueue.forEach(text => {
            runtime.timeline.push(currentTime);
            currentTime += (text.length * charRate) + 0.5; 
        });
        runtime.totalEstimatedDuration = currentTime;
    }

    function batchSentences(text) {
        const rawParagraphs = text.split(/\n+/);
        let finalChunks = [];
        rawParagraphs.forEach(para => {
             const cleanPara = cleanText(para);
             if (cleanPara.length > 0) {
                 const chunks = smartSegmentText(cleanPara);
                 finalChunks = finalChunks.concat(chunks);
             }
        });

        let optimizedChunks = [];
        let temp = "";
        const MIN_MERGE_LEN = 50; 
        
        finalChunks.forEach(chunk => {
            if (temp.length + chunk.length < MIN_MERGE_LEN) {
                temp += (temp ? " " : "") + chunk;
            } else {
                if (temp) { optimizedChunks.push(temp); temp = ""; }
                if (chunk.length < MIN_MERGE_LEN) temp = chunk; 
                else optimizedChunks.push(chunk);
            }
        });
        if (temp) optimizedChunks.push(temp);
        
        const res = optimizedChunks.filter(c => c.trim().length > 0);
        runtime.audioQueue = res;
        calculateTimeline();
        return res;
    }

    function splitToPhrases(textBlock) {
        const regex = /([,，、\s.?!。？！;；()（）]+)/;
        const parts = textBlock.split(regex);
        let phrases = [], buffer = "";
        parts.forEach(p => {
            if (/^[,，、\s.?!。？！;；()（）]+$/.test(p)) { if (buffer) phrases.push(buffer + p); buffer = ""; }
            else { if (buffer.length + p.length > 15) { if(buffer) phrases.push(buffer); buffer = p; } else { buffer += p; } }
        });
        if (buffer) phrases.push(buffer);
        return phrases.filter(p => p.trim().length > 0);
    }

    function getWeight(text) {
        let w = 0;
        for (let char of text) {
            if (/[.?!。？！]/.test(char)) w += 3.5;
            else if (/[,;，；]/.test(char)) w += 2.0;
            else w += 1;
        }
        return w;
    }

    // --- 5. Media Session & 高亮调度 ---

    function setupMediaSession() {
        if (!('mediaSession' in navigator)) return;
        const currentText = runtime.audioQueue[runtime.currentIndex] || "";
        navigator.mediaSession.metadata = new MediaMetadata({
            title: runtime.articleTitle,
            artist: `正在朗读: ${currentText.substring(0, 20)}...`,
            album: `大声朗读 (${runtime.currentIndex + 1}/${runtime.audioQueue.length})`,
            artwork: [
                { src: 'https://cdn-icons-png.flaticon.com/512/26/26490.png', sizes: '96x96', type: 'image/png' },
                { src: 'https://cdn-icons-png.flaticon.com/512/26/26490.png', sizes: '128x128', type: 'image/png' },
            ]
        });

        navigator.mediaSession.setActionHandler('play', resumePlay);
        navigator.mediaSession.setActionHandler('pause', pausePlay);
        
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            if (runtime.currentIndex > 0) {
                stopInternal();
                runtime.currentIndex--;
                playCurrentIndex();
            }
        });
        
        navigator.mediaSession.setActionHandler('nexttrack', () => {
             stopInternal();
             runtime.currentIndex++; 
             playCurrentIndex();
        });

        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (config.useSystem) return; 
            const seekTime = details.seekTime;
            let targetIndex = runtime.timeline.findIndex(startTime => startTime > seekTime);
            if (targetIndex === -1) targetIndex = runtime.audioQueue.length - 1;
            else targetIndex = Math.max(0, targetIndex - 1);

            if (targetIndex !== runtime.currentIndex) {
                stopInternal();
                runtime.currentIndex = targetIndex;
                playCurrentIndex();
            } else {
                if (runtime.currentAudio) {
                    runtime.currentAudio.currentTime = 0; 
                    updatePositionState();
                }
            }
        });
    }

    function scheduleHighlightsFromPosition(phrases, durationSeconds, seekTimeSeconds) {
        clearHighlight();
        if (!config.highlightMode) return;
        if (!durationSeconds || isNaN(durationSeconds)) return;

        const totalWeight = phrases.reduce((acc, p) => acc + getWeight(p), 0);
        let accumulatedTimeMs = 0;
        const seekTimeMs = seekTimeSeconds * 1000;

        phrases.forEach((phrase) => {
            const weight = getWeight(phrase);
            const percent = weight / totalWeight;
            const phraseDurationMs = percent * durationSeconds * 1000;
            const phraseStartMs = accumulatedTimeMs;
            
            if (seekTimeMs >= phraseStartMs && seekTimeMs < phraseStartMs + phraseDurationMs) {
                 if (runtime.state === 'PLAYING') doHighlight(phrase);
            } else if (phraseStartMs > seekTimeMs) {
                let delay = phraseStartMs - seekTimeMs;
                const timer = setTimeout(() => {
                    if (runtime.state === 'PLAYING') doHighlight(phrase);
                }, delay);
                runtime.highlightTimers.push(timer);
            }
            accumulatedTimeMs += phraseDurationMs;
        });
    }

    function updatePositionState() {
        if (!('mediaSession' in navigator) || config.useSystem) return;
        
        const segmentStartTime = runtime.timeline[runtime.currentIndex] || 0;
        let currentSegmentProgress = 0;
        
        if (runtime.currentAudio && !isNaN(runtime.currentAudio.currentTime)) {
            currentSegmentProgress = runtime.currentAudio.currentTime;
        }
        
        const globalCurrentTime = segmentStartTime + currentSegmentProgress;
        
        try {
            navigator.mediaSession.setPositionState({
                duration: runtime.totalEstimatedDuration || 100, 
                playbackRate: 1.0,
                position: Math.min(globalCurrentTime, runtime.totalEstimatedDuration)
            });
        } catch(e) {}
    }

    // --- 6. 核心：缓冲与播放 ---

    function getCacheKey(index, text) {
        const voice = config.lang === 'zh' ? config.voiceZh : config.voiceEn;
        const textHash = text.length + text.substring(0,5);
        return `${runtime.currentUrlHash}_p${index}_${voice}_s${config.speed}_${textHash}`;
    }

    function fetchAudioBlob(text) {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        
        const getSources = () => {
            let userConfig = GM_getValue('ttsConfig', DEFAULT_TTS_CONFIG);
            if (!Array.isArray(userConfig) || userConfig.length === 0) userConfig = DEFAULT_TTS_CONFIG;
            return userConfig;
        };

        const tryDownload = (apiConfig, text) => {
            return new Promise((resolve, reject) => {
                const voiceName = config.lang === 'zh' ? config.voiceZh : config.voiceEn;
                const url = buildTTSRequestUrl(apiConfig.url, apiConfig.token, text, voiceName, config.speed);

                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { "Referer": "https://read-aloud-123.vercel.app/" },
                    responseType: "blob",
                    timeout: 15000, 
                    onload: (res) => {
                        if (res.status === 200 && res.response && res.response.size > 0) {
                            resolve(res.response);
                        } else {
                            reject(`HTTP ${res.status}`);
                        }
                    },
                    onerror: (e) => reject("Network Error"),
                    ontimeout: () => reject("Timeout")
                });
            });
        };

        return new Promise(async (resolve) => {
            if (runtime.state === 'IDLE') {
                resolve(null); return; 
            }

            const sources = getSources();
            for (let i = 0; i < sources.length; i++) {
                if (!sources[i].url) continue;
                try {
                    const blob = await tryDownload(sources[i], text);
                    resolve(blob);
                    return; 
                } catch (e) {
                    console.warn(`[TTS] Source ${i} failed:`, e);
                }
                
                if (runtime.state === 'IDLE') { resolve(null); return; }
                await sleep(200); 
            }

            console.error("[TTS] All sources failed for:", text);
            resolve(null);
        });
    }

    async function backgroundDownloader() {
        if (runtime.downloadQueue.length === 0) return;
        const CONCURRENCY = 1; 
        
        while (runtime.downloadQueue.length > 0 && runtime.state !== 'IDLE') {
            if (runtime.downloadingIndices.size >= CONCURRENCY) {
                await new Promise(r => setTimeout(r, 200)); 
                continue;
            }

            runtime.downloadQueue.sort((a, b) => Math.abs(a - runtime.currentIndex) - Math.abs(b - runtime.currentIndex));
            
            const index = runtime.downloadQueue.shift();
            if (index === undefined) break;

            runtime.downloadingIndices.add(index);
            const text = runtime.audioQueue[index];
            const key = getCacheKey(index, text);

            const blob = await fetchAudioBlob(text);
            
            if (blob) {
                await IDB.put(key, blob);
                runtime.downloadingIndices.delete(index);
                if (runtime.state === 'BUFFERING' && index === runtime.currentIndex) {
                    playCurrentIndex(); 
                }
            } else {
                // v5.7: 记录失败计数
                runtime.failedCount++;
                runtime.downloadingIndices.delete(index);
                // 如果当前正在等待这一段，则跳过
                if (runtime.state === 'BUFFERING' && index === runtime.currentIndex) {
                     runtime.currentIndex++;
                     playCurrentIndex();
                }
            }

            const total = runtime.audioQueue.length;
            const done = total - runtime.downloadQueue.length - runtime.downloadingIndices.size;
            const pct = Math.floor((done / total) * 100);
            updateProgress(pct);
            
            // v5.7: 队列清空后的最终反馈
            if (runtime.downloadQueue.length === 0 && runtime.downloadingIndices.size === 0) {
                 if (runtime.failedCount > 0) {
                     updateStatus(`⚠️ 完成 (跳过 ${runtime.failedCount} 段)`);
                 } else {
                     updateStatus("✅ 本文已完整下载");
                 }
            }
        }
    }

    async function checkCacheAndPlan() {
        const total = runtime.audioQueue.length;
        runtime.downloadQueue = [];
        let cachedCount = 0;
        
        // 重置失败计数
        runtime.failedCount = 0;

        for (let i = 0; i < total; i++) {
            const key = getCacheKey(i, runtime.audioQueue[i]);
            const blob = await IDB.get(key);
            if (!blob) {
                runtime.downloadQueue.push(i);
            } else {
                cachedCount++;
            }
        }
        return { total, cachedCount, missing: runtime.downloadQueue.length };
    }

    async function startLogic() {
        if (runtime.audioQueue.length === 0) {
             const text = extractContent();
             if (text.length < 5) { updateStatus("无内容"); return; }
             batchSentences(text);
             runtime.currentIndex = 0;
        }

        runtime.state = 'BUFFERING';
        setUIState();

        if (config.useSystem) {
            runtime.state = 'PLAYING';
            playSystem(runtime.audioQueue[0]);
            return;
        }

        updateStatus("检查缓存...");
        const plan = await checkCacheAndPlan();

        if (plan.missing > 0) {
            backgroundDownloader(); 
        } else {
            updateProgress(100);
            updateStatus("✅ 本文已完整下载");
        }
        playCurrentIndex();
    }

    async function playCurrentIndex() {
        if (runtime.state === 'IDLE') return;
        
        if (runtime.currentIndex >= runtime.audioQueue.length) {
            stopPlay();
            updateStatus("播放结束");
            return;
        }

        const text = runtime.audioQueue[runtime.currentIndex];
        
        if (config.useSystem) {
            updateStatus(`播放 (${runtime.currentIndex + 1}/${runtime.audioQueue.length})`);
            playSystem(text);
            return;
        }

        const key = getCacheKey(runtime.currentIndex, text);
        const blob = await IDB.get(key);

        if (blob) {
            runtime.state = 'PLAYING';
            updateStatus(`播放 (${runtime.currentIndex + 1}/${runtime.audioQueue.length})`);
            setUIState();
            playBlob(blob, text);
        } else {
            if (!runtime.downloadingIndices.has(runtime.currentIndex) && !runtime.downloadQueue.includes(runtime.currentIndex)) {
                // v5.7: 已知失败，跳过
                // 注意：这里通常由 backgroundDownloader 处理，但如果队列已空且无blob，说明之前失败了
                console.warn(`[TTS] Skipping index ${runtime.currentIndex} (Failed/Empty)`);
                runtime.currentIndex++;
                playCurrentIndex();
                return;
            }

            runtime.state = 'BUFFERING';
            updateStatus(`缓冲中... (${runtime.currentIndex + 1})`);
            setUIState();
            
            if (!runtime.downloadingIndices.has(runtime.currentIndex)) {
                 const qIdx = runtime.downloadQueue.indexOf(runtime.currentIndex);
                 if (qIdx > -1) runtime.downloadQueue.splice(qIdx, 1);
                 runtime.downloadQueue.unshift(runtime.currentIndex);
                 backgroundDownloader(); 
            }
        }
    }

    function playBlob(blob, text) {
        if (runtime.currentAudio) {
             runtime.currentAudio.pause();
             URL.revokeObjectURL(runtime.currentAudio.src);
        }

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        
        audio.onloadedmetadata = () => {
            if (runtime.state !== 'PLAYING') return;
            setupMediaSession(); 
            updatePositionState(); 
            
            const duration = audio.duration;
            const phrases = splitToPhrases(text);
            scheduleHighlightsFromPosition(phrases, duration, 0);
            
            audio.play().catch(e => {
                console.error("Play failed", e);
                updateStatus("播放被拦截，请点击");
            });
        };

        audio.ontimeupdate = () => {
            if (Math.abs(audio.currentTime % 1) < 0.2) updatePositionState();
        };
        
        audio.onended = () => {
            clearHighlight();
            runtime.currentIndex++;
            playCurrentIndex();
        };
        
        audio.onerror = () => {
             console.error("Audio error, skipping");
             runtime.currentIndex++;
             playCurrentIndex();
        };

        runtime.currentAudio = audio;
    }

    function playSystem(textBlock) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(textBlock);
        const targetVoice = config.lang === 'zh' ? config.voiceZh : config.voiceEn;
        const v = runtime.systemVoices.find(x => x.name === targetVoice);
        if (v) u.voice = v;
        
        let rate = 1.0;
        if (config.speed < 0) rate = 0.5 + (config.speed + 50) / 100;
        else rate = 1.0 + (config.speed / 50);
        u.rate = rate;

        u.onstart = () => {
            if (runtime.state !== 'PLAYING') { window.speechSynthesis.cancel(); return; }
            setupMediaSession();
            updatePositionState(); 
            const baseCharTime = config.lang === 'zh' ? 0.26 : 0.15;
            const estimatedDuration = (textBlock.length * baseCharTime) / rate;
            const phrases = splitToPhrases(textBlock);
            scheduleHighlightsFromPosition(phrases, estimatedDuration, 0);
        };

        u.onend = () => {
            clearHighlight();
            runtime.currentIndex++;
            playCurrentIndex();
        };

        runtime.currentUtterance = u;
        window.speechSynthesis.speak(u);
    }

    // --- 控制逻辑 ---
    function stopInternal() {
        if (runtime.currentAudio) { runtime.currentAudio.pause(); runtime.currentAudio = null; }
        if (window.speechSynthesis) { window.speechSynthesis.cancel(); }
        clearHighlight();
    }

    function stopPlay() {
        runtime.state = 'IDLE';
        stopInternal();
        updateStatus("已停止");
        setUIState();
        updateProgress(0);
        runtime.downloadQueue = []; 
    }

    function pausePlay() {
        runtime.state = 'PAUSED';
        if (runtime.currentAudio) runtime.currentAudio.pause();
        if (window.speechSynthesis) window.speechSynthesis.pause();
        updateStatus("已暂停");
        setUIState();
    }

    function resumePlay() {
        if (runtime.state === 'PAUSED') {
            runtime.state = 'PLAYING';
            updateStatus(`继续播放 (${runtime.currentIndex + 1})`);
            setUIState();
            if (config.useSystem) {
                window.speechSynthesis.resume();
            } else if (runtime.currentAudio) {
                runtime.currentAudio.play();
                const text = runtime.audioQueue[runtime.currentIndex];
                const phrases = splitToPhrases(text);
                scheduleHighlightsFromPosition(phrases, runtime.currentAudio.duration, runtime.currentAudio.currentTime);
            } else {
                playCurrentIndex();
            }
        } else {
            startLogic(); 
        }
    }

    function togglePlay() { 
        if(runtime.state === 'PLAYING' || runtime.state === 'BUFFERING') pausePlay();
        else resumePlay(); 
    }

    function loadSystemVoices() {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            runtime.systemVoices = voices;
            updateDropdowns(); 
        }
    }
    
    function reCacheCurrent() {
        if (runtime.audioQueue.length === 0) {
             const text = extractContent();
             if (text.length > 5) batchSentences(text);
        }
        if (runtime.audioQueue.length === 0) return alert("未找到文章内容");

        stopPlay();
        updateStatus("准备重新下载...");
        
        runtime.downloadQueue = runtime.audioQueue.map((_, i) => i);
        runtime.downloadingIndices.clear();
        runtime.failedCount = 0; // 重置失败计数
        runtime.state = 'BUFFERING'; 
        
        backgroundDownloader();
        updateStatus("正在重新缓存全部...");
    }

    // --- 7. UI 构建 ---
    function createUI() {
         if (document.getElementById('tts-plus-root')) return;
        const container = document.createElement('div');
        container.id = 'tts-plus-root';
        document.body.appendChild(container);
        const shadow = container.attachShadow({mode: 'open'});
        runtime.uiRoot = shadow;
        if (config.isPanelHidden) return;

        const style = document.createElement('style');
        style.textContent = `
            :host { all: initial; z-index: 2147483647; font-family: system-ui, -apple-system, sans-serif; }
            * { box-sizing: border-box; user-select: none; -webkit-tap-highlight-color: transparent; }
            .capsule {
                position: fixed; bottom: 30px; right: 20px;
                background: rgba(255, 255, 255, 0.94);
                backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.1);
                box-shadow: 0 4px 24px rgba(0,0,0,0.12);
                border-radius: 20px; padding: 10px 14px;
                display: flex; flex-direction: column; gap: 8px;
                width: 260px; transition: transform 0.3s;
            }
            @media (prefers-color-scheme: dark) { .capsule { background: rgba(30,30,30,0.94); border-color: rgba(255,255,255,0.1); color: #fff; } }
            
            .row-main { display: flex; align-items: center; gap: 10px; width: 100%; }
            .info-area { flex: 1; min-width: 0; }
            .status { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .sub-status { font-size: 10px; opacity: 0.6; }
            
            .btn-circle { width: 36px; height: 36px; border-radius: 50%; background: #f2f2f7; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: inherit; transition: 0.2s; flex-shrink: 0; }
            .btn-primary { background: #007AFF; color: white; box-shadow: 0 2px 10px rgba(0,122,255,0.3); }
            @media (prefers-color-scheme: dark) { .btn-circle { background: #3a3a3c; } }

            .progress-container { width: 100%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; overflow: hidden; display: flex; }
            .progress-bar { height: 100%; background: #34C759; width: 0%; transition: width 0.3s; }
            @media (prefers-color-scheme: dark) { .progress-container { background: rgba(255,255,255,0.1); } }

            .settings-panel {
                position: absolute; bottom: 105%; right: 0;
                width: 280px; background: rgba(255,255,255,0.98);
                backdrop-filter: blur(20px); border-radius: 20px;
                padding: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.25);
                display: none; flex-direction: column; gap: 12px;
                font-size: 13px; color: #333;
            }
            @media (prefers-color-scheme: dark) { .settings-panel { background: #1c1c1e; color: #fff; border: 1px solid #333; } }
            .settings-panel.show { display: flex; }
            select { width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #ddd; background: rgba(0,0,0,0.02); color: inherit; outline: none; }
            .slider-row { display: flex; align-items: center; gap: 10px; }
            input[type=range] { flex: 1; accent-color: #007AFF; }
            
            .btn-action {
                flex: 1; padding: 6px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1);
                background: rgba(0,0,0,0.05); cursor: pointer; font-size: 12px;
                text-align: center; color: inherit;
            }
            .btn-action:hover { background: rgba(0,0,0,0.1); }
            .btn-config { background: #e8f0fe; color: #1a73e8; border: 1px dashed #1a73e8; width: 100%; padding: 8px; margin-top:5px; border-radius: 8px; cursor: pointer; }
            @media (prefers-color-scheme: dark) { .btn-action { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); } }
        `;

        const html = `
            <div class="capsule" id="mainCapsule">
                <div class="row-main">
                    <button class="btn-circle" id="settingsBtn" style="width:30px;height:30px;opacity:0.7"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg></button>
                    <div class="info-area">
                        <div class="status" id="statusText">VOX Flow Ready</div>
                        <div class="sub-status">${config.lang==='zh'?'中文':'EN'} | Speed ${config.speed}</div>
                    </div>
                    <button class="btn-circle" id="langBtn" style="font-size:12px;font-weight:bold;">${config.lang==='zh'?'中':'EN'}</button>
                    <button class="btn-circle btn-primary" id="playBtn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" id="progressBar"></div>
                </div>

                <div class="settings-panel" id="settingsPanel">
                    <div class="slider-row"><span style="font-weight:bold;">设置</span><div id="closePermBtn" style="opacity:0.5;padding:5px;cursor:pointer;margin-left:auto;">✕</div></div>
                    <div><span style="font-size:11px;color:#888;">中文发音</span><select id="selZh"></select></div>
                    <div><span style="font-size:11px;color:#888;">英文发音</span><select id="selEn"></select></div>
                    <div><span style="font-size:11px;color:#888;">语速</span><div class="slider-row"><input type="range" id="rngSpeed" min="-50" max="50" step="5" value="${config.speed}"><span style="background:#007AFF;color:white;font-size:11px;padding:2px 6px;border-radius:4px;" id="speedValDisplay">${config.speed}</span></div></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;"><span>高亮跟随</span><input type="checkbox" id="chkHighlight" ${config.highlightMode?'checked':''}></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;"><span>使用系统合成</span><input type="checkbox" id="chkUseSystem" ${config.useSystem?'checked':''}></div>
                    
                    <div id="apiConfigArea" style="${config.useSystem ? 'display:none' : 'display:block'}">
                         <button id="btnConfigApi" class="btn-config">⚙️ 配置 API 源 (Token/Url)</button>
                    </div>

                    <div style="border-top:1px solid rgba(0,0,0,0.08); margin-top:6px; padding-top:10px; display:flex; gap:10px;">
                        <button id="btnRecache" class="btn-action">🔄 重下本页</button>
                        <button id="btnClearCache" class="btn-action" style="color:var(--red, #ff3b30);">🗑️ 清空缓存</button>
                    </div>
                     <button id="btnDownload" class="btn-action" style="width:100%; margin-top:5px; color:#28a745; font-weight:bold;">⬇️ 下载音频</button>
                </div>
            </div>
        `;
        shadow.appendChild(style);
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        shadow.appendChild(wrapper);

        const $ = (id) => shadow.getElementById(id);
        
        $('playBtn').onclick = togglePlay;
        $('langBtn').onclick = () => {
            config.lang = config.lang === 'zh' ? 'en' : 'zh';
            $('langBtn').textContent = config.lang === 'zh' ? '中' : 'EN';
            GM_setValue('last_lang', config.lang);
            stopPlay(); runtime.audioQueue = []; 
            runtime.uiRoot.querySelector('.sub-status').textContent = `${config.lang==='zh'?'中文':'EN'} | Speed ${config.speed}`;
        };
        $('settingsBtn').onclick = (e) => { e.stopPropagation(); $('settingsPanel').classList.toggle('show'); };
        document.addEventListener('click', (e) => { if (!container.contains(e.target)) $('settingsPanel').classList.remove('show'); });

        const rangeInput = $('rngSpeed');
        const valDisplay = $('speedValDisplay');
        rangeInput.oninput = (e) => { valDisplay.textContent = e.target.value; };

        const save = () => {
            config.voiceZh = $('selZh').value;
            config.voiceEn = $('selEn').value;
            config.speed = parseInt($('rngSpeed').value);
            config.highlightMode = $('chkHighlight').checked;
            config.useSystem = $('chkUseSystem').checked;
            
            GM_setValue('voiceZh', config.voiceZh);
            GM_setValue('voiceEn', config.voiceEn);
            GM_setValue('speed', config.speed);
            GM_setValue('highlight_mode', config.highlightMode);
            GM_setValue('useSystem', config.useSystem);
            
            $('apiConfigArea').style.display = config.useSystem ? 'none' : 'block';
            runtime.uiRoot.querySelector('.sub-status').textContent = `${config.lang==='zh'?'中文':'EN'} | Speed ${config.speed}`;
            updateDropdowns(); 
            stopPlay(); 
            runtime.audioQueue = []; 
        };

        ['selZh','selEn','rngSpeed','chkHighlight', 'chkUseSystem'].forEach(id => $(id).onchange = save);
        
        $('btnConfigApi').onclick = openApiSettings;

        $('closePermBtn').onclick = () => {
            $('mainCapsule').style.display = 'none';
            config.isPanelHidden = true;
            GM_setValue('is_panel_hidden', true);
        };
        
        $('btnRecache').onclick = () => {
            if(confirm("确定要强制重新下载本页所有音频吗？")) {
                reCacheCurrent();
            }
        };
        
        $('btnClearCache').onclick = () => {
            if(confirm("确定要删除所有已缓存的音频数据吗？")) {
                stopPlay();
                IDB.clearStore().then(() => {
                    alert("缓存已清空");
                    updateStatus("缓存已清空");
                }).catch(e => alert("清空失败: " + e));
            }
        };

        $('btnDownload').onclick = async () => {
            if (config.useSystem) {
                return alert("⚠️ 系统语音模式无法下载音频文件。请切换到在线 API 模式并等待缓存完成后再下载。");
            }
            if (runtime.audioQueue.length === 0) {
                 const text = extractContent();
                 if (text.length > 5) batchSentences(text);
                 else return alert("未检测到文章内容，无法下载。");
            }

            const btn = $('btnDownload');
            const originalText = btn.textContent;
            btn.textContent = '⏳ 正在合并...';
            btn.disabled = true;

            try {
                const blobs = [];
                let missingCount = 0;
                
                // 1. 检查并收集所有分段
                for (let i = 0; i < runtime.audioQueue.length; i++) {
                    const text = runtime.audioQueue[i];
                    const key = getCacheKey(i, text);
                    const blob = await IDB.get(key);
                    
                    if (blob) {
                        blobs.push(blob);
                    } else {
                        missingCount++;
                    }
                }

                if (missingCount > 0) {
                    alert(`⚠️ 当前有 ${missingCount} 个分段尚未缓存。\n请点击播放按钮，等待进度条走满（或显示“已完整下载”）后再尝试下载。`);
                } else {
                    // 2. 合并并下载
                    // 大多数 TTS API 返回的是 MP3 帧流，直接二进制拼接通常能被播放器识别
                    const mergedBlob = new Blob(blobs, { type: 'audio/mpeg' });
                    const url = URL.createObjectURL(mergedBlob);
                    
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    // 文件名：文章标题 或 默认名
                    let safeTitle = (runtime.articleTitle || 'article').replace(/[\\/:*?"<>|]/g, '_').substring(0, 50);
                    a.download = `${safeTitle}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 100);
                }

            } catch (e) {
                console.error(e);
                alert("下载失败: " + e.message);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
        };

        window.updateDropdowns = () => {
            const zhSelect = $('selZh');
            const enSelect = $('selEn');
            if(!zhSelect || !enSelect) return;

            let listZh = [], listEn = [];
            if (config.useSystem) {
                if (runtime.systemVoices.length === 0) loadSystemVoices();
                listZh = runtime.systemVoices.filter(v => v.lang.includes('zh') || v.lang.includes('CN')).map(v => ({ label: `💻 ${v.name}`, value: v.name }));
                listEn = runtime.systemVoices.filter(v => v.lang.includes('en')).map(v => ({ label: `💻 ${v.name}`, value: v.name }));
            } else {
                listZh = PRESET_VOICES_ZH;
                listEn = PRESET_VOICES_EN;
            }
            const render = (list, val) => list.map(x => `<option value="${x.value}" ${x.value === val ? 'selected' : ''}>${x.label}</option>`).join('');
            zhSelect.innerHTML = render(listZh, config.voiceZh);
            enSelect.innerHTML = render(listEn, config.voiceEn);
            
            if (listZh.length > 0 && !listZh.find(x => x.value === config.voiceZh)) zhSelect.value = listZh[0].value;
            if (listEn.length > 0 && !listEn.find(x => x.value === config.voiceEn)) enSelect.value = listEn[0].value;
        };
        updateDropdowns();
    }

    function setUIState() {
        if (!runtime.uiRoot) return;
        const btn = runtime.uiRoot.getElementById('playBtn');
        const isPlaying = runtime.state === 'PLAYING' || runtime.state === 'BUFFERING';
        btn.innerHTML = isPlaying ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="4" x2="10" y2="20"></line><line x1="14" y1="4" x2="14" y2="20"></line></svg>` : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }

    function updateStatus(text) { if (runtime.uiRoot) runtime.uiRoot.getElementById('statusText').textContent = text; }
    function updateProgress(pct) { if (runtime.uiRoot) runtime.uiRoot.getElementById('progressBar').style.width = pct + '%'; }

    GM_registerMenuCommand("📢 打开", () => {
        config.isPanelHidden = false;
        GM_setValue('is_panel_hidden', false);
        createUI();
        runtime.uiRoot.getElementById('mainCapsule').style.display = 'flex';
    });
    
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadSystemVoices;

    IDB.init().then(() => {
        setTimeout(createUI, 800);
    }).catch(console.error);

})();
