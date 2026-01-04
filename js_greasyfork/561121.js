// ==UserScript==
// @name         Bilibili CC字幕实时显示插件（含AI翻译）
// @name:en      Bilibili CC Subtitle Extractor with AI Translation - Initial Alignment
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在B站播放器中集成CC字幕列表，支持DeepSeek AI实时翻译，提供“双语双行”字幕渲染。
// @description:en  Integrate CC subtitle list in Bilibili video player with DeepSeek AI translation. Fixed "initial subtitle mismatch" caused by auto-resume when visiting a BVID without the P parameter.
// @author       Corde
// @match        *://*.bilibili.com/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561121/Bilibili%20CC%E5%AD%97%E5%B9%95%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E5%90%ABAI%E7%BF%BB%E8%AF%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561121/Bilibili%20CC%E5%AD%97%E5%B9%95%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6%EF%BC%88%E5%90%ABAI%E7%BF%BB%E8%AF%91%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试日志工具
    const Logger = {
        log: (...args) => console.log('%c[CC字幕插件]', 'color: #00a1d6; font-weight: bold;', ...args),
        error: (...args) => console.error('%c[CC字幕插件]', 'color: red; font-weight: bold;', ...args),
        warn: (...args) => console.warn('%c[CC字幕插件]', 'color: orange; font-weight: bold;', ...args)
    };

    // 获取真实的 window 对象
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // ==================== 配置管理模块 ====================
    const ConfigManager = {
        defaults: {
            apiKey: '',
            baseURL: 'https://api.deepseek.com',
            model: 'deepseek-chat',
            targetLanguage: 'Indonesian',
            enabled: false,
            dualMode: true,
            preload: true,
            floatingWindow: {
                visible: true,
                position: { x: 100, y: 100 },
                size: { width: 450, height: 120 }
            },
            promptTemplate: `将以下中文文本翻译成印尼语：

{text} `
        },

        get(key) {
            const value = GM_getValue(key);
            return value !== undefined ? value : this.defaults[key];
        },

        set(key, value) {
            GM_setValue(key, value);
        },

        getAll() {
            return {
                apiKey: this.get('apiKey'),
                baseURL: this.get('baseURL'),
                model: this.get('model'),
                targetLanguage: this.get('targetLanguage'),
                enabled: this.get('enabled'),
                dualMode: this.get('dualMode'),
                preload: this.get('preload'),
                floatingWindow: this.get('floatingWindow'),
                promptTemplate: this.get('promptTemplate')
            };
        },

        setAll(config) {
            Object.keys(config).forEach(key => {
                this.set(key, config[key]);
            });
        }
    };

    // ==================== 翻译服务模块 ====================
    const TranslationService = {
        cache: new Map(),
        pendingRequests: new Map(),
        requestQueue: [],
        isProcessingQueue: false,
        currentContextId: '',
        requestingIndices: new Set(),

        setContextId(id) {
            if (this.currentContextId !== id) {
                this.currentContextId = id;
                this.cache.clear();
                this.pendingRequests.clear();
                this.requestQueue = [];
                this.requestingIndices.clear();
                this.isProcessingQueue = false;
                Logger.log('>>> 上下文切换，翻译缓存已重置');
            }
        },

        generateCacheKey(text, language) {
            return `${this.currentContextId}_${language}:${text.substring(0, 50)}_${text.length}`;
        },

        async translate(text, config) {
            if (!text || !config.apiKey) return text;

            const cacheKey = this.generateCacheKey(text, config.targetLanguage);

            if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
            if (this.pendingRequests.has(cacheKey)) return this.pendingRequests.get(cacheKey);

            const prompt = config.promptTemplate.replace('{text}', text);

            const requestBody = {
                model: config.model,
                messages: [
                    { role: 'system', content: 'You are a professional translator. Keep translations concise.' },
                    { role: 'user', content: prompt }
                ],
                stream: false,
                temperature: 0.3,
                max_tokens: 1000
            };

            const translationPromise = (async () => {
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: `${config.baseURL}/v1/chat/completions`,
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${config.apiKey}`
                            },
                            data: JSON.stringify(requestBody),
                            onload: (res) => {
                                if (res.status >= 200 && res.status < 300) resolve(JSON.parse(res.responseText));
                                else reject(new Error(`API Error: ${res.status} ${res.statusText}`));
                            },
                            onerror: (err) => reject(err)
                        });
                    });

                    const translatedText = response.choices?.[0]?.message?.content?.trim();
                    if (!translatedText) throw new Error('Empty translation');

                    this.cache.set(cacheKey, translatedText);
                    return translatedText;
                } catch (error) {
                    Logger.warn(`翻译失败:`, error.message);
                    return null;
                } finally {
                    this.pendingRequests.delete(cacheKey);
                }
            })();

            this.pendingRequests.set(cacheKey, translationPromise);
            return translationPromise;
        },

        prefetch(subtitles, currentTime, config) {
            if (!config.enabled || !config.apiKey || !config.preload) return;

            const PRELOAD_WINDOW = 180;
            const endTime = currentTime + PRELOAD_WINDOW;

            const candidates = subtitles.body.filter((item, index) => {
                const inRange = item.from > currentTime && item.from <= endTime;
                if (!inRange) return false;
                const cacheKey = this.generateCacheKey(item.content, config.targetLanguage);
                return !this.cache.has(cacheKey) && !this.requestingIndices.has(index);
            });

            if (candidates.length === 0) return;

            candidates.forEach(item => {
                if (this.requestQueue.length < 30) {
                    const index = subtitles.body.indexOf(item);
                    if (!this.requestingIndices.has(index)) {
                        this.requestQueue.push({ item, index, config });
                        this.requestingIndices.add(index);
                    }
                }
            });

            if (this.requestQueue.length > 0) this.processQueue();
        },

        async processQueue() {
            if (this.isProcessingQueue) return;
            this.isProcessingQueue = true;

            while (this.requestQueue.length > 0) {
                const task = this.requestQueue.shift();
                const cacheKeyCheck = this.generateCacheKey(task.item.content, task.config.targetLanguage);
                if (!cacheKeyCheck.startsWith(this.currentContextId)) {
                     this.isProcessingQueue = false;
                     return;
                }
                try {
                    await this.translate(task.item.content, task.config);
                } catch (e) { /* ignore */ }
                finally {
                    this.requestingIndices.delete(task.index);
                    await new Promise(r => setTimeout(r, 200));
                }
            }
            this.isProcessingQueue = false;
        },

        async translateBatch(subtitles, config, onProgress) {
             if (!config.enabled || !config.apiKey) return null;
             const results = [];
             const batchSize = 5;
             const delay = 100;
             for (let i = 0; i < subtitles.body.length; i += batchSize) {
                 const batch = subtitles.body.slice(i, i + batchSize);
                 const batchPromises = batch.map(async (item) => {
                     const translated = await this.translate(item.content, config);
                     return { index: subtitles.body.indexOf(item), translated: translated || item.content };
                 });
                 const batchResults = await Promise.all(batchPromises);
                 results.push(...batchResults);
                 if (onProgress) onProgress(results.length, subtitles.body.length);
                 if (i + batchSize < subtitles.body.length) await new Promise(r => setTimeout(r, delay));
             }
             return results.sort((a, b) => a.index - b.index);
        }
    };

    // ==================== 视频信息获取模块 (增强版) ====================
    const VideoInfoFetcher = {
        // 核心修改：返回是否显式指定了 p 参数
        getUrlParams() {
            const url = window.location.href;
            const bvidMatch = url.match(/\/video\/(BV[a-zA-Z0-9]+)/);
            const bvid = bvidMatch ? bvidMatch[1] : null;
            const params = new URLSearchParams(window.location.search);
            const pParam = params.get('p');
            const p = parseInt(pParam || '1');
            return { bvid, p, isExplicitP: !!pParam };
        },

        async fetchWithRetry(url, retries = 3, resultParser = null) {
            for (let i = 0; i < retries; i++) {
                try {
                    return await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            onload: (res) => {
                                if (res.status === 200) {
                                    try {
                                        const json = JSON.parse(res.responseText);
                                        if (resultParser) resolve(resultParser(json));
                                        else {
                                            if (json.code === 0) resolve(json.data);
                                            else reject(new Error(`API Code: ${json.code}`));
                                        }
                                    } catch (e) { reject(e); }
                                } else reject(new Error(`HTTP ${res.status}`));
                            },
                            onerror: (e) => reject(e),
                            ontimeout: () => reject(new Error('Timeout'))
                        });
                    });
                } catch (e) {
                    if (i === retries - 1) throw e;
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        },

        // 新增：等待播放器就绪并返回实际 CID（用于解决隐式 P1 问题）
        async sniffPlayerCid(targetBvid, maxWaitMs = 5000) {
            const start = Date.now();
            while (Date.now() - start < maxWaitMs) {
                const player = win.player || win.bpxPlayer;
                if (player && typeof player.getVideoInfo === 'function') {
                    const info = player.getVideoInfo();
                    // 确保播放器 BVID 匹配，防止切页残留
                    if (info && info.bvid === targetBvid && info.cid) {
                        return info.cid;
                    }
                }
                await new Promise(r => setTimeout(r, 200));
            }
            return null;
        },

        async getVideoDetails(bvid, p, isExplicitP) {
            Logger.log(`>>> 解析视频信息: BVID=${bvid}, P=${p} (显式指定: ${isExplicitP})`);

            try {
                const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
                const data = await this.fetchWithRetry(apiUrl);

                let targetP = p;
                let targetCid = null;

                // 如果 URL 没有指定 P，B站可能会自动续播（如跳到 P5）
                // 此时我们需要等待播放器告诉我们真正的 CID
                if (!isExplicitP) {
                    Logger.log('URL未指定分P，进入首屏智能嗅探模式...');
                    const playerCid = await this.sniffPlayerCid(bvid);

                    if (playerCid) {
                        // 反查 API 数据找到对应的 P
                        const realPage = data.pages.find(pg => pg.cid === playerCid);
                        if (realPage) {
                            Logger.log(`嗅探成功! 播放器实际在播 P${realPage.page} (CID=${playerCid})`);
                            targetP = realPage.page;
                            targetCid = playerCid;
                        } else {
                            Logger.warn('播放器CID未在API列表中找到，回退到默认 P1');
                        }
                    } else {
                        Logger.warn('嗅探超时，假设为 P1');
                    }
                }

                // 如果嗅探没结果，或者不需要嗅探，使用 targetP 获取 CID
                if (!targetCid) {
                    const pageData = data.pages.find(page => page.page === targetP);
                    if (!pageData) throw new Error(`未找到分P: ${targetP}`);
                    targetCid = pageData.cid;
                }

                Logger.log(`最终锁定目标: P${targetP}, CID=${targetCid}`);

                return {
                    cid: targetCid,
                    aid: data.aid,
                    bvid: bvid,
                    title: data.title,
                    p: targetP,  // 返回实际使用的 P
                    pages: data.pages
                };
            } catch (e) {
                Logger.error('视频信息解析失败:', e);
                throw e;
            }
        },

        async getSubtitleConfig(cid, bvid, aid) {
            const urls = [
                `https://api.bilibili.com/x/player/v2?cid=${cid}&bvid=${bvid}`,
                `https://api.bilibili.com/x/v2/dm/view?aid=${aid}&oid=${cid}&type=1`
            ];

            for (const url of urls) {
                try {
                    const data = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: url,
                            headers: { "Referer": window.location.href },
                            onload: (res) => resolve(JSON.parse(res.responseText)),
                            onerror: () => reject()
                        });
                    });
                    if (data.code === 0 && data.data?.subtitle?.subtitles?.length > 0) return data.data.subtitle.subtitles;
                    if (data.code === 0 && data.data?.subtitles?.length > 0) return data.data.subtitles;
                } catch (e) { /* continue */ }
            }
            return null;
        },

        async getSubtitleContent(url) {
            if (url.startsWith('//')) url = 'https:' + url;
            if (url.startsWith('http://')) url = url.replace('http://', 'https://');
            return await this.fetchWithRetry(url, 3, (json) => {
                if (json.body) return json;
                throw new Error('Invalid Subtitle JSON: missing body');
            });
        }
    };

    // ==================== 视频画面渲染器 ====================
    const VideoSubtitleRenderer = {
        container: null,
        subtitleElement: null,

        init() {
            this.createOverlay();
            this.injectStyles();
        },

        createOverlay() {
            const videoArea = document.querySelector('.bpx-player-video-area') ||
                              document.querySelector('.player-video') ||
                              document.querySelector('video')?.parentElement;

            if (!videoArea || videoArea.querySelector('.video-subtitle-renderer')) return;

            const div = document.createElement('div');
            div.className = 'video-subtitle-renderer';
            div.style.cssText = `
                position: absolute; left: 0; top: 0; width: 100%; height: 100%;
                pointer-events: none; z-index: 100;
                display: flex; flex-direction: column; justify-content: flex-end; align-items: center;
                padding-bottom: 50px;
            `;

            const textDiv = document.createElement('div');
            textDiv.className = 'video-subtitle-content';
            textDiv.style.cssText = `
                text-align: center;
                background: rgba(0,0,0,0.6);
                padding: 6px 12px;
                border-radius: 6px;
                transition: opacity 0.2s;
                opacity: 0;
            `;

            div.appendChild(textDiv);
            videoArea.appendChild(div);

            this.container = div;
            this.subtitleElement = textDiv;
        },

        injectStyles() {
            if (document.getElementById('cc-video-style')) return;
            const style = document.createElement('style');
            style.id = 'cc-video-style';
            style.textContent = `
                .cc-primary-text { font-size: 24px; color: #fff; font-weight: bold; text-shadow: 1px 1px 2px #000; line-height: 1.4; margin-bottom: 2px; }
                .cc-secondary-text { font-size: 16px; color: #ddd; text-shadow: 1px 1px 2px #000; font-weight: normal; }
                .bpx-player-video-wrap:fullscreen .cc-primary-text { font-size: 32px; }
                .bpx-player-video-wrap:fullscreen .cc-secondary-text { font-size: 20px; }
            `;
            document.head.appendChild(style);
        },

        update(htmlContent) {
            if (!this.subtitleElement) this.createOverlay();
            if (!this.subtitleElement) return;

            if (htmlContent) {
                this.subtitleElement.innerHTML = htmlContent;
                this.subtitleElement.style.opacity = 1;
            } else {
                this.subtitleElement.style.opacity = 0;
            }
        },

        clear() {
             if (this.subtitleElement) {
                 this.subtitleElement.innerHTML = '';
                 this.subtitleElement.style.opacity = 0;
             }
        }
    };

    // ==================== SettingsUI ====================
    const SettingsUI = {
        element: null,

        show() {
            if (!this.element) this.create();
            this.updateFields();
            this.element.style.display = 'flex';
        },

        hide() {
            if (this.element) this.element.style.display = 'none';
        },

        create() {
            const div = document.createElement('div');
            div.className = 'cc-settings-overlay';
            div.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100001; display: none; align-items: center; justify-content: center;`;

            div.innerHTML = `
                <div class="cc-settings-box" style="background: white; width: 400px; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                    <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">字幕插件设置</h3>
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">功能开关</label>
                        <label style="margin-right: 15px;"><input type="checkbox" id="cc-cfg-enabled"> 启用 AI 翻译</label>
                        <label style="margin-right: 15px;"><input type="checkbox" id="cc-cfg-dual"> 双语字幕</label>
                        <label><input type="checkbox" id="cc-cfg-preload"> 智能预加载(3分钟)</label>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">API Key</label>
                        <input type="password" id="cc-cfg-apikey" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="sk-...">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">Base URL</label>
                        <input type="text" id="cc-cfg-baseurl" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">目标语言</label>
                        <select id="cc-cfg-lang" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="Chinese">中文 (Chinese)</option>
                            <option value="Indonesian">印尼语 (Indonesian)</option>
                            <option value="English">英语 (English)</option>
                        </select>
                    </div>
                    <div style="text-align: right; margin-top: 20px;">
                        <button id="cc-cfg-save" style="background: #00a1d6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">保存</button>
                        <button id="cc-cfg-close" style="background: #eee; color: #333; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-left: 10px;">关闭</button>
                    </div>
                </div>
            `;
            document.body.appendChild(div);
            this.element = div;
            div.querySelector('#cc-cfg-close').addEventListener('click', () => this.hide());
            div.querySelector('#cc-cfg-save').addEventListener('click', () => this.save());
        },
        updateFields() {
            const config = ConfigManager.getAll();
            this.element.querySelector('#cc-cfg-enabled').checked = config.enabled;
            this.element.querySelector('#cc-cfg-dual').checked = config.dualMode;
            this.element.querySelector('#cc-cfg-preload').checked = config.preload;
            this.element.querySelector('#cc-cfg-apikey').value = config.apiKey || '';
            this.element.querySelector('#cc-cfg-baseurl').value = config.baseURL || '';
            this.element.querySelector('#cc-cfg-lang').value = config.targetLanguage || 'Indonesian';
        },
        save() {
            const enabled = this.element.querySelector('#cc-cfg-enabled').checked;
            const dualMode = this.element.querySelector('#cc-cfg-dual').checked;
            const preload = this.element.querySelector('#cc-cfg-preload').checked;
            const apiKey = this.element.querySelector('#cc-cfg-apikey').value.trim();
            const baseURL = this.element.querySelector('#cc-cfg-baseurl').value.trim();
            const targetLanguage = this.element.querySelector('#cc-cfg-lang').value;
            ConfigManager.setAll({ enabled, dualMode, preload, apiKey, baseURL, targetLanguage });
            this.hide();
            alert('设置已保存');
        }
    };

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const FloatingWindow = {
        el: null,
        init() {
            if (this.el) return;
            const config = ConfigManager.get('floatingWindow');
            const div = document.createElement('div');
            div.className = 'cc-floating-window';
            div.style.cssText = `left:${config.position.x}px; top:${config.position.y}px; width:${config.size.width}px; height:${config.size.height}px;`;
            div.innerHTML = `
                <div class="cc-fw-header">
                    <span>AI 实时翻译</span>
                    <div class="cc-fw-ctrls">
                         <span class="cc-fw-btn settings-btn">⚙️</span>
                         <span class="cc-fw-btn close-btn">✕</span>
                    </div>
                </div>
                <div class="cc-fw-content">等待字幕...</div>
                <div class="cc-fw-resize"></div>
            `;
            document.body.appendChild(div);
            this.el = div;
            this.injectStyles();
            this.bindEvents(div);
            if (!ConfigManager.get('enabled')) this.hide();
        },
        injectStyles() {
            if (document.getElementById('cc-fw-style')) return;
            const style = document.createElement('style');
            style.id = 'cc-fw-style';
            style.textContent = `
                .cc-floating-window { position: fixed; z-index: 100000; background: rgba(0,0,0,0.85); color: #fff; border-radius: 8px; display: flex; flex-direction: column; backdrop-filter: blur(5px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); min-width: 200px; min-height: 60px; }
                .cc-fw-header { padding: 8px 12px; background: rgba(255,255,255,0.1); border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center; cursor: move; user-select: none; }
                .cc-fw-ctrls { display: flex; gap: 8px; }
                .cc-fw-btn { cursor: pointer; opacity: 0.7; }
                .cc-fw-btn:hover { opacity: 1; }
                .cc-fw-content { padding: 12px; flex: 1; overflow-y: auto; font-size: 16px; line-height: 1.5; white-space: pre-wrap; text-shadow: 1px 1px 2px black; }
                .cc-fw-resize { position: absolute; right: 0; bottom: 0; width: 15px; height: 15px; cursor: nwse-resize; }
                .fw-primary { font-size: 18px; color: #fff; font-weight: bold; margin-bottom: 4px; }
                .fw-secondary { font-size: 14px; color: #ccc; }
            `;
            document.head.appendChild(style);
        },
        bindEvents(el) {
            const header = el.querySelector('.cc-fw-header');
            let isDragging = false, startX, startY, initialLeft, initialTop;
            header.addEventListener('mousedown', (e) => {
                if(e.target.classList.contains('cc-fw-btn')) return;
                isDragging = true; startX = e.clientX; startY = e.clientY;
                initialLeft = el.offsetLeft; initialTop = el.offsetTop;
                e.preventDefault();
            });
            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                el.style.left = `${initialLeft + e.clientX - startX}px`;
                el.style.top = `${initialTop + e.clientY - startY}px`;
            });
            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    const cfg = ConfigManager.get('floatingWindow');
                    cfg.position = { x: el.offsetLeft, y: el.offsetTop };
                    ConfigManager.set('floatingWindow', cfg);
                }
            });
            el.querySelector('.close-btn').addEventListener('click', () => this.hide());
            el.querySelector('.settings-btn').addEventListener('click', () => SettingsUI.show());
        },
        show() { this.init(); this.el.style.display = 'flex'; ConfigManager.get('floatingWindow').visible = true; ConfigManager.set('floatingWindow', ConfigManager.get('floatingWindow')); },
        hide() { if (this.el) { this.el.style.display = 'none'; ConfigManager.get('floatingWindow').visible = false; ConfigManager.set('floatingWindow', ConfigManager.get('floatingWindow')); } },
        updateContent(html) { if (this.el) this.el.querySelector('.cc-fw-content').innerHTML = html; }
    };

    // 字幕列表UI
    const ListUI = {
        container: null,
        init(parent, currentP) {
            let existing = document.querySelector('.cc-subtitle-list');
            if (existing) {
                this.container = existing;
                const title = existing.querySelector('.cc-list-header span');
                if (title) title.innerHTML = `CC 字幕列表 <small style="color: #999;">(P${currentP})</small>`;
                if (!parent.contains(existing)) {
                    if (parent.firstChild) parent.insertBefore(existing, parent.firstChild);
                    else parent.appendChild(existing);
                }
                return;
            }
            const div = document.createElement('div');
            div.className = 'cc-subtitle-list';
            div.style.cssText = `margin-bottom: 10px; background: #fff; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); overflow: hidden;`;
            div.innerHTML = `
                <div class="cc-list-header" style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                    <span style="font-weight: bold; color: #333;">CC 字幕列表 <small style="color: #999;">(P${currentP})</small></span>
                    <button class="cc-ai-btn" style="background: #00a1d6; color: white; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer;">AI 翻译</button>
                </div>
                <div class="cc-list-body" style="height: 0px; overflow-y: auto; transition: height 0.3s;">
                    <div class="cc-list-content" style="padding: 5px 0;"></div>
                </div>
            `;
            if (parent.firstChild) parent.insertBefore(div, parent.firstChild);
            else parent.appendChild(div);
            this.container = div;

            const header = div.querySelector('.cc-list-header');
            const body = div.querySelector('.cc-list-body');
            const aiBtn = div.querySelector('.cc-ai-btn');
            let expanded = false;
            header.addEventListener('click', (e) => {
                if (e.target === aiBtn) return;
                expanded = !expanded;
                body.style.height = expanded ? '400px' : '0px';
            });
            aiBtn.addEventListener('click', () => {
                const cfg = ConfigManager.getAll();
                if (!cfg.enabled || !cfg.apiKey) SettingsUI.show();
                else FloatingWindow.show();
            });
        },
        render(subtitles) {
            if (!this.container) return;
            const content = this.container.querySelector('.cc-list-content');
            content.innerHTML = subtitles.body.map((item, idx) => `
                <div class="cc-item" data-idx="${idx}" data-from="${item.from}" style="padding: 6px 10px; cursor: pointer; display: flex; font-size: 13px; color: #333;">
                    <span style="color: #999; margin-right: 10px; min-width: 40px;">${formatTime(item.from)}</span>
                    <span class="cc-text">${item.content}</span>
                </div>
            `).join('');
            const items = content.querySelectorAll('.cc-item');
            items.forEach(el => {
                el.addEventListener('click', () => { if (win.player) win.player.seek(parseFloat(el.dataset.from)); });
                el.addEventListener('mouseenter', () => el.style.background = '#f4f4f4');
                el.addEventListener('mouseleave', () => el.style.background = 'transparent');
            });
        },
        highlight(time) {
            if (!this.container || !window.currentSubtitles) return;
            const item = window.currentSubtitles.body.find(i => time >= i.from && time < i.to);
            const content = this.container.querySelector('.cc-list-content');
            if (!content) return;
            const active = content.querySelector('.active');
            if (active) { active.style.background = 'transparent'; active.style.borderLeft = 'none'; active.classList.remove('active'); }
            if (item) {
                const idx = window.currentSubtitles.body.indexOf(item);
                const el = content.children[idx];
                if (el) {
                    el.classList.add('active');
                    el.style.background = 'rgba(0, 161, 214, 0.1)';
                    el.style.borderLeft = '3px solid #00a1d6';
                    const listBody = this.container.querySelector('.cc-list-body');
                    if (listBody && listBody.clientHeight > 0) {
                         const top = el.offsetTop - content.offsetTop;
                         if (top < listBody.scrollTop || top > listBody.scrollTop + listBody.clientHeight - 50) listBody.scrollTop = top - 100;
                    }
                }
            }
        },
        clear() {
            if (this.container) this.container.querySelector('.cc-list-content').innerHTML = '';
        }
    };

    // ==================== 主流程控制 ====================
    let syncInterval = null;
    let currentSubtitles = null;
    let globalVideoDetails = null; // 存储当前视频的完整分P信息用于纠错

    // 独立函数：通过 CID 查找并重载字幕 (用于纠错)
    async function reloadSubtitlesByCid(targetCid, targetAid, targetBvid) {
        Logger.log('>>> 触发CID智能纠错，重新加载字幕:', targetCid);

        try {
            const subs = await VideoInfoFetcher.getSubtitleConfig(targetCid, targetBvid, targetAid);

            if (!subs || subs.length === 0) {
                Logger.warn('纠错后发现该分P没有字幕');
                if (ListUI.container) ListUI.container.querySelector('.cc-list-content').innerHTML = '<div style="padding:10px;text-align:center;color:#999">当前分P无 CC 字幕</div>';
                window.currentSubtitles = null;
                currentSubtitles = null;
                return;
            }

            const subContent = await VideoInfoFetcher.getSubtitleContent(subs[0].subtitle_url);

            // 更新全局状态
            window.currentSubtitles = subContent;
            currentSubtitles = subContent;

            // 记录当前正确的 CID，避免重复纠错
            window.currentCorrectCid = targetCid;

            // 更新 UI
            ListUI.render(subContent);
            Logger.log('✅ 字幕纠错完成，已加载正确字幕');
            if (FloatingWindow.el) FloatingWindow.updateContent('字幕纠错完成');

        } catch (e) {
            Logger.error('字幕纠错失败:', e);
        }
    }

    async function loadVideo() {
        Logger.log('>>> 开始加载视频流程...');

        // 核心修复：清理所有状态
        if (syncInterval) { clearInterval(syncInterval); syncInterval = null; }
        window.currentSubtitles = null;
        currentSubtitles = null;
        window.currentCorrectCid = null; // 重置CID记录
        VideoSubtitleRenderer.clear();
        if (FloatingWindow.el) FloatingWindow.updateContent('...');

        // 解析 URL (获取显式和隐式信息)
        const { bvid, p, isExplicitP } = VideoInfoFetcher.getUrlParams();
        if (!bvid) return;

        TranslationService.setContextId(`${bvid}_${p}`);

        let danmakuBox =
            document.querySelector('.bui-collapse-wrap') ||
            document.querySelector('#danmukuBox') ||
            document.querySelector('.danmaku-box') ||
            document.querySelector('#reco_list') ||
            document.querySelector('.up-panel-container');

        if (!danmakuBox) {
            await new Promise(r => setTimeout(r, 1500));
            danmakuBox =
                document.querySelector('.bui-collapse-wrap') ||
                document.querySelector('#danmukuBox') ||
                document.querySelector('.danmaku-box') ||
                document.querySelector('#reco_list') ||
                document.querySelector('.up-panel-container');
        }

        if (danmakuBox) ListUI.init(danmakuBox, p);

        try {
            // 步骤1：获取视频详细信息（含智能嗅探逻辑）
            const details = await VideoInfoFetcher.getVideoDetails(bvid, p, isExplicitP);

            // 保存详情用于后续纠错
            globalVideoDetails = details;
            // 初始假设当前CID是正确的
            window.currentCorrectCid = details.cid;

            // 修正UI上的 P 数（如果发生了修正）
            if (details.p !== p && ListUI.container) {
                const title = ListUI.container.querySelector('.cc-list-header span');
                if (title) title.innerHTML = `CC 字幕列表 <small style="color: #999;">(P${details.p})</small>`;
            }

            const subs = await VideoInfoFetcher.getSubtitleConfig(details.cid, details.bvid, details.aid);

            if (!subs || subs.length === 0) {
                Logger.warn('该视频没有字幕');
                if (ListUI.container) ListUI.container.querySelector('.cc-list-content').innerHTML = '<div style="padding:10px;text-align:center;color:#999">无 CC 字幕</div>';
            } else {
                const subContent = await VideoInfoFetcher.getSubtitleContent(subs[0].subtitle_url);
                window.currentSubtitles = subContent;
                currentSubtitles = subContent;
                Logger.log('✅ 初始字幕已加载');
                ListUI.render(subContent);
            }

            VideoSubtitleRenderer.init();
            FloatingWindow.init();

            // 步骤2：开启同步与纠错循环
            syncInterval = setInterval(async () => {
                const player = win.player;
                if (!player) return;

                // --- 核心纠错逻辑 Start ---
                // 实时检查播放器实际播放的 CID (二次保障)
                try {
                    if (typeof player.getVideoInfo === 'function') {
                        const playerInfo = player.getVideoInfo();
                        if (playerInfo && playerInfo.cid) {
                            // 如果播放器的 CID 与我们当前加载字幕的 CID 不一致，说明串台了（自动续播等原因）
                            if (window.currentCorrectCid && playerInfo.cid !== window.currentCorrectCid) {
                                Logger.warn(`检测到 CID 不匹配! 当前: ${window.currentCorrectCid}, 实际: ${playerInfo.cid}`);
                                window.currentCorrectCid = playerInfo.cid;

                                if (FloatingWindow.el) FloatingWindow.updateContent('检测到分P跳转，正在同步字幕...');
                                await reloadSubtitlesByCid(playerInfo.cid, playerInfo.aid, playerInfo.bvid);
                                return;
                            }
                        }
                    }
                } catch(e) { /* ignore */ }
                // --- 核心纠错逻辑 End ---

                const time = player.getCurrentTime();
                ListUI.highlight(time);

                const config = ConfigManager.getAll();
                const cfg = config.floatingWindow;

                // 触发预加载
                if (currentSubtitles) {
                    TranslationService.prefetch(currentSubtitles, time, config);
                }

                // OSD 渲染
                if (currentSubtitles) {
                    const item = currentSubtitles.body.find(i => time >= i.from && time < i.to);
                    if (item) {
                        let originalText = item.content;
                        let translatedText = null;

                        if (config.enabled && config.apiKey) {
                            const cacheKey = TranslationService.generateCacheKey(originalText, config.targetLanguage);
                            if (TranslationService.cache.has(cacheKey)) {
                                translatedText = TranslationService.cache.get(cacheKey);
                            } else {
                                if (!item.requesting) {
                                    item.requesting = true;
                                    TranslationService.translate(originalText, config).then(() => item.requesting = false);
                                }
                            }
                        }

                        let finalHtml = '';
                        if (config.enabled && translatedText) {
                            if (config.dualMode) {
                                finalHtml = `<div class="cc-primary-text fw-primary">${translatedText}</div><div class="cc-secondary-text fw-secondary">${originalText}</div>`;
                            } else {
                                finalHtml = `<div class="cc-primary-text fw-primary">${translatedText}</div>`;
                            }
                        } else {
                            finalHtml = `<div class="cc-primary-text fw-primary">${originalText}</div>`;
                        }

                        VideoSubtitleRenderer.update(finalHtml);
                        if (cfg.visible) FloatingWindow.updateContent(finalHtml);
                    } else {
                        VideoSubtitleRenderer.update('');
                        if (cfg.visible) FloatingWindow.updateContent('...');
                    }
                }
            }, 200);

        } catch (e) {
            Logger.error('加载流程异常:', e);
            if (ListUI.container) ListUI.container.querySelector('.cc-list-content').innerHTML = `<div style="padding:10px;text-align:center;color:red">加载出错: ${e.message}</div>`;
        }
    }

    // 监听 URL 变化
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            Logger.log('URL变化，重新加载...');
            if (syncInterval) { clearInterval(syncInterval); syncInterval = null; }
            VideoSubtitleRenderer.clear();

            // 延迟一点，让B站播放器先反应
            setTimeout(loadVideo, 2000);
        }
    });
    observer.observe(document, { subtree: true, childList: true });

    setTimeout(loadVideo, 2500);

    window.SettingsUI = SettingsUI;

})();