// ==UserScript==
// @name         ImmersionKit to Anki
// @namespace    immersionkit_anki_gui
// @version      0.1.2
// @description  利用底层原型链劫持 (Prototype Hook) 捕获音频，以原生方式打开 Anki 添加窗口，支持 Base64 图片预上传。
// @match        https://www.immersionkit.com/*
// @connect      127.0.0.1
// @connect      localhost
// @connect      linodeobjects.com
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557394/ImmersionKit%20to%20Anki.user.js
// @updateURL https://update.greasyfork.org/scripts/557394/ImmersionKit%20to%20Anki.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 0. 全局音频劫持 (AudioSniffer) - 核心修改
    // ==========================================
    const AudioSniffer = {
        latestUrl: null,
        isCapturing: false,

        init() {
            console.log('[AudioSniffer] 初始化原型链劫持...');

            // 1. 劫持 HTMLMediaElement (Audio/Video 标签)
            const originalMediaDesc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
            Object.defineProperty(HTMLMediaElement.prototype, 'src', {
                set: function(value) {
                    // 仅当开启捕获模式，且链接看起来像音频时记录
                    if (AudioSniffer.isCapturing && value && (typeof value === 'string')) {
                        if (value.includes('.mp3') || value.includes('.m4a') || value.includes('media/anime')) {
                            console.log('%c[AudioSniffer] 捕获到 URL:', 'color: green; font-weight: bold;', value);
                            AudioSniffer.latestUrl = value;

                            // 拿到 URL 后尝试静音/暂停，避免干扰用户（可选）
                            // this.pause();
                        }
                    }
                    return originalMediaDesc.set.call(this, value);
                },
                get: function() {
                    return originalMediaDesc.get.call(this);
                },
                configurable: true
            });

            // 2. 劫持 HTMLSourceElement (<source> 标签)
            const originalSourceDesc = Object.getOwnPropertyDescriptor(HTMLSourceElement.prototype, 'src');
            Object.defineProperty(HTMLSourceElement.prototype, 'src', {
                set: function(value) {
                    if (AudioSniffer.isCapturing && value && (typeof value === 'string')) {
                         if (value.includes('.mp3') || value.includes('.m4a') || value.includes('media/anime')) {
                            console.log('%c[AudioSniffer-Source] 捕获到 URL:', 'color: blue;', value);
                            AudioSniffer.latestUrl = value;
                        }
                    }
                    return originalSourceDesc.set.call(this, value);
                },
                get: function() {
                    return originalSourceDesc.get.call(this);
                },
                configurable: true
            });
        },

        // 触发捕获流程
        capture(triggerElement) {
            return new Promise((resolve) => {
                this.latestUrl = null;
                this.isCapturing = true;

                // 触发点击
                if (triggerElement) {
                    triggerElement.click();
                }

                // 轮询检测是否拿到 URL (最多等待 2 秒)
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    if (this.latestUrl) {
                        clearInterval(interval);
                        this.isCapturing = false;
                        resolve(this.latestUrl);
                    } else if (attempts > 20) { // 20 * 100ms = 2s
                        clearInterval(interval);
                        this.isCapturing = false;
                        console.warn('[AudioSniffer] 超时未捕获到音频');
                        resolve(null);
                    }
                }, 100);
            });
        }
    };

    // 立即初始化劫持
    AudioSniffer.init();


    // ==========================================
    // 1. 配置管理
    // ==========================================
    const DEFAULT_CONFIG = {
        ankiUrl: 'http://127.0.0.1:8765',
        deckName: 'Immersion Kit',
        modelName: null,
        useGui: true,
        fieldTemplates: {}
    };

    let config = { ...DEFAULT_CONFIG, ...GM_getValue('config', {}) };

    const PLACEHOLDERS = [
        { key: '{keyword}', label: '目标单词 (纯文本)' },
        { key: '{sentence}', label: '日文例句 (带 <b> 高亮)' },
        { key: '{sentence_plain}', label: '日文例句 (无高亮)' },
        { key: '{translation}', label: '英文翻译' },
        { key: '{screenshot}', label: '图片 (Img Tag)' },
        { key: '{audio}', label: '音频 (Audio Tag)' },
        { key: '{title}', label: '作品标题' },
        { key: '{url}', label: '来源链接' }
    ];

    // ==========================================
    // 2. 网络工具
    // ==========================================
    const Network = {
        downloadToBase64(url) {
            return new Promise((resolve, reject) => {
                if (!url) return resolve(null);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: (res) => {
                        if (res.status !== 200) return resolve(null);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64Data = reader.result.split(',')[1];
                            resolve(base64Data);
                        };
                        reader.onerror = () => resolve(null);
                        reader.readAsDataURL(res.response);
                    },
                    onerror: (err) => {
                        console.error('资源下载失败:', err);
                        resolve(null);
                    }
                });
            });
        }
    };

    // ==========================================
    // 3. AnkiConnect 交互
    // ==========================================
    const Anki = {
        async invoke(action, params = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: config.ankiUrl,
                    data: JSON.stringify({ action, version: 6, params }),
                    headers: { 'Content-Type': 'application/json' },
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            if (data.error) reject(data.error);
                            else resolve(data.result);
                        } catch (e) {
                            reject('Anki 响应解析失败');
                        }
                    },
                    onerror: () => reject('无法连接 AnkiConnect')
                });
            });
        },

        async getDeckNames() { return this.invoke('deckNames'); },
        async getModelNames() { return this.invoke('modelNames'); },
        async getModelFields(modelName) { return this.invoke('modelFieldNames', { modelName }); },

        async uploadMedia(url, filename) {
            if (!url) return null;
            try {
                // 必须使用 Base64 上传，解决 Anki 后台下载的 SSL 问题
                const base64Data = await Network.downloadToBase64(url);
                if (!base64Data) return null;

                await this.invoke('storeMediaFile', {
                    filename: filename,
                    data: base64Data
                });
                return filename;
            } catch (e) {
                console.error(`上传媒体失败: ${filename}`, e);
                return null;
            }
        },

        async sendToAnki(scrapedData) {
            // 1. 上传媒体 (并行处理)
            const uploads = [];

            if (scrapedData.screenshotUrl) {
                uploads.push(this.uploadMedia(scrapedData.screenshotUrl, scrapedData.screenshotName)
                    .then(name => scrapedData.finalScreenshotName = name));
            }

            if (scrapedData.audioUrl) {
                uploads.push(this.uploadMedia(scrapedData.audioUrl, scrapedData.audioName)
                    .then(name => scrapedData.finalAudioName = name));
            }

            await Promise.all(uploads);

            // 2. 准备字段内容
            const replacements = {
                '{keyword}': scrapedData.keyword || '',
                '{sentence}': scrapedData.sentenceHtml || scrapedData.sentencePlain || '',
                '{sentence_plain}': scrapedData.sentencePlain || '',
                '{translation}': scrapedData.translation || '',
                '{title}': scrapedData.title || '',
                '{url}': scrapedData.url || '',
                '{screenshot}': scrapedData.finalScreenshotName ? `<img src="${scrapedData.finalScreenshotName}">` : '',
                '{audio}': scrapedData.finalAudioName ? `[sound:${scrapedData.finalAudioName}]` : ''
            };

            const fields = {};
            for (const [ankiField, template] of Object.entries(config.fieldTemplates)) {
                if (!template) continue;
                let content = template;
                for (const [key, val] of Object.entries(replacements)) {
                    content = content.split(key).join(val);
                }
                fields[ankiField] = content;
            }

            const note = {
                deckName: config.deckName,
                modelName: config.modelName,
                fields: fields,
                tags: ['ImmersionKit']
            };

            if (config.useGui) {
                return this.invoke('guiAddCards', { note });
            } else {
                note.options = { allowDuplicate: false };
                return this.invoke('addNote', { note });
            }
        }
    };

    // ==========================================
    // 4. 页面解析 (DOM Scraper)
    // ==========================================
    const Scraper = {
        async extract(container, index) {
            // 1. 获取图片
            const imgEl = container.querySelector('img.clickableImage') || container.querySelector('img.ui.image');
            let screenshotUrl = imgEl ? imgEl.src : null;
            let screenshotName = null;
            if (screenshotUrl) {
                try {
                    const urlObj = new URL(screenshotUrl);
                    const ext = urlObj.pathname.split('.').pop() || 'jpg';
                    screenshotName = `ik_${Date.now()}_${index}.${ext}`;
                } catch(e) {
                    screenshotName = `ik_${Date.now()}_${index}.jpg`;
                }
            }

            // 2. 获取文本与高亮
            const headerEl = container.querySelector('.header');
            let sentencePlain = "";
            let sentenceHtml = "";
            let keyword = "";

            if (headerEl) {
                const clone = headerEl.cloneNode(true);
                clone.querySelectorAll('.icon').forEach(e => e.remove());

                sentencePlain = clone.textContent.trim();

                const highlightSpan = clone.querySelector('span[class*="HighlightedText"]');
                if (highlightSpan) {
                    keyword = highlightSpan.textContent.trim();
                    const bold = document.createElement('b');
                    bold.textContent = keyword;
                    highlightSpan.replaceWith(bold);
                } else {
                    const urlParam = new URLSearchParams(window.location.search).get('keyword');
                    if (urlParam) keyword = urlParam;
                }

                sentenceHtml = clone.innerHTML.trim();
            }

            const descEl = container.querySelector('.description');
            const translation = descEl ? descEl.textContent.trim() : "";

            const titleEl = container.querySelector('.extra .button');
            const title = titleEl ? titleEl.textContent.trim() : "";

            // 3. 获取音频 (使用 Prototype Hook)
            let audioUrl = null;
            let audioName = null;
            const audioIcon = container.querySelector('.sound.icon');
            // 找到可点击的按钮 (通常是 icon 的父级 button，或者 icon 本身)
            const audioTrigger = audioIcon ? (audioIcon.closest('button') || audioIcon) : null;

            if (audioTrigger) {
                console.log('[Scraper] 触发音频捕获...');
                // 调用全局劫持器，模拟点击并等待 URL
                audioUrl = await AudioSniffer.capture(audioTrigger);

                if (audioUrl) {
                    console.log('[Scraper] 成功拿到音频 URL:', audioUrl);
                    audioName = `ik_audio_${Date.now()}_${index}.mp3`;
                } else {
                    console.warn('[Scraper] 音频捕获超时');
                }
            }

            return {
                keyword, sentencePlain, sentenceHtml, translation, title,
                url: window.location.href,
                screenshotUrl, screenshotName,
                audioUrl, audioName,
                finalScreenshotName: null,
                finalAudioName: null
            };
        }
    };

    // ==========================================
    // 5. UI 界面
    // ==========================================
    const UI = {
        init() {
            GM_addStyle(`
                .ik-anki-float-btn {
                    background: #fff;
                    border: 1px solid #e0e1e2;
                    box-shadow: 0 1px 2px 0 rgba(34,36,38,.15);
                    color: rgba(0,0,0,.6);
                    border-radius: .28571429rem;
                    padding: .78571429em 1.5em .78571429em;
                    font-weight: 700;
                    line-height: 1em;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    margin-left: 10px;
                    transition: background .1s ease, box-shadow .1s ease, color .1s ease;
                    font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
                    font-size: 1rem;
                }
                .ik-anki-float-btn:hover { background: #f9fafb; color: rgba(0,0,0,.8); }
                .ik-anki-float-btn i.icon { margin-right: .75em; height: 1em; font-family: Icons; font-style: normal; }
                .ik-anki-float-btn.loading { cursor: wait; background: #f0f0f0; }
                .ik-anki-float-btn.success { border-color: #21ba45; color: #21ba45; box-shadow: none; }
                .ik-anki-float-btn.error { border-color: #db2828; color: #db2828; }

                #ik-anki-panel {
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: #1b1c1d; color: #fff; width: 680px; max-height: 85vh;
                    border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.5); z-index: 99999;
                    display: none; flex-direction: column;
                }
                .ik-header { padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
                .ik-body { padding: 20px; overflow-y: auto; }
                .ik-footer { padding: 15px 20px; border-top: 1px solid #333; text-align: right; background: #222; border-radius: 0 0 8px 8px; }

                .ik-input-group { margin-bottom: 15px; }
                .ik-label { display: block; color: #aaa; margin-bottom: 6px; font-size: 0.9em; }
                .ik-input { width: 100%; padding: 8px; background: #333; border: 1px solid #444; color: #fff; border-radius: 4px; box-sizing: border-box; }
                .ik-select { width: 100%; padding: 8px; background: #333; border: 1px solid #444; color: #fff; border-radius: 4px; }
                .ik-btn { padding: 8px 16px; border-radius: 4px; border: none; cursor: pointer; font-weight: bold; }
                .ik-btn.primary { background: #2185d0; color: #fff; }
                .ik-btn.secondary { background: #555; color: #ddd; margin-right: 10px; }
                .ik-mapping-row { display: flex; align-items: center; margin-bottom: 8px; }
                .ik-field-label { width: 120px; color: #ddd; font-weight: bold; overflow: hidden; text-overflow: ellipsis; }
                .ik-tags { margin-bottom: 10px; line-height: 1.5; }
                .ik-tag { display: inline-block; padding: 2px 8px; background: #444; border-radius: 10px; font-size: 12px; margin-right: 5px; cursor: pointer; border: 1px solid #555; }
                .ik-tag:hover { background: #555; border-color: #777; }
                .ik-toggle { display: flex; align-items: center; cursor: pointer; }
                .ik-toggle input { margin-right: 8px; }
            `);
            this.createOverlay();
        },

        createOverlay() {
            const html = `
                <div id="ik-anki-panel">
                    <div class="ik-header">
                        <h3 style="margin:0">Anki 连接设置</h3>
                        <span style="cursor:pointer;font-size:20px" onclick="document.getElementById('ik-anki-panel').style.display='none'">&times;</span>
                    </div>
                    <div class="ik-body">
                        <div class="ik-input-group">
                            <label class="ik-label">AnkiConnect 地址</label>
                            <div style="display:flex; gap:10px">
                                <input id="ik-url" class="ik-input" value="${config.ankiUrl}">
                                <button id="ik-connect-btn" class="ik-btn primary" style="width:100px">连接</button>
                            </div>
                        </div>
                        <div id="ik-settings-area" style="display:none">
                            <div class="ik-input-group">
                                <label class="ik-label">行为模式</label>
                                <label class="ik-toggle">
                                    <input type="checkbox" id="ik-use-gui" ${config.useGui ? 'checked' : ''}>
                                    <span>使用 guiAddCards (弹出 Anki 添加窗口，推荐)</span>
                                </label>
                            </div>
                            <div class="ik-input-group" style="display:grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div>
                                    <label class="ik-label">目标牌组</label>
                                    <select id="ik-deck" class="ik-select"></select>
                                </div>
                                <div>
                                    <label class="ik-label">笔记类型 (Note Type)</label>
                                    <select id="ik-model" class="ik-select"></select>
                                </div>
                            </div>
                            <div class="ik-input-group">
                                <label class="ik-label">字段映射 (点击上方标签插入变量)</label>
                                <div class="ik-tags">
                                    ${PLACEHOLDERS.map(p => `<span class="ik-tag" data-val="${p.key}">${p.key}</span>`).join('')}
                                </div>
                                <div id="ik-mapping-container" style="background:#222; padding:15px; border-radius:4px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="ik-footer">
                        <button class="ik-btn secondary" onclick="document.getElementById('ik-anki-panel').style.display='none'">关闭</button>
                        <button id="ik-save-btn" class="ik-btn primary">保存配置</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);

            document.getElementById('ik-connect-btn').onclick = () => this.connect();
            document.getElementById('ik-model').onchange = (e) => this.renderFields(e.target.value);
            document.getElementById('ik-save-btn').onclick = () => this.save();

            let activeInput = null;
            document.addEventListener('focusin', (e) => {
                if (e.target.classList.contains('ik-template-input')) activeInput = e.target;
            });
            document.querySelectorAll('.ik-tag').forEach(tag => {
                tag.onclick = () => {
                    if (activeInput) {
                        const val = tag.dataset.val;
                        const start = activeInput.selectionStart;
                        const text = activeInput.value;
                        activeInput.value = text.slice(0, start) + val + text.slice(activeInput.selectionEnd);
                        activeInput.focus();
                    }
                };
            });
        },

        show() {
            document.getElementById('ik-anki-panel').style.display = 'flex';
            if (config.modelName) this.connect();
        },

        async connect() {
            const btn = document.getElementById('ik-connect-btn');
            btn.textContent = '...';
            config.ankiUrl = document.getElementById('ik-url').value;
            try {
                const decks = await Anki.getDeckNames();
                const models = await Anki.getModelNames();

                const deckSel = document.getElementById('ik-deck');
                deckSel.innerHTML = decks.map(d => `<option value="${d}">${d}</option>`).join('');
                if (config.deckName) deckSel.value = config.deckName;

                const modelSel = document.getElementById('ik-model');
                modelSel.innerHTML = models.map(m => `<option value="${m}">${m}</option>`).join('');
                if (config.modelName) modelSel.value = config.modelName;

                document.getElementById('ik-settings-area').style.display = 'block';
                btn.textContent = '成功';
                this.renderFields(modelSel.value);
            } catch (e) {
                alert('连接失败: ' + e);
                btn.textContent = '重试';
            }
        },

        async renderFields(modelName) {
            const container = document.getElementById('ik-mapping-container');
            container.innerHTML = '加载中...';
            const fields = await Anki.getModelFields(modelName);

            let html = '';
            fields.forEach(f => {
                let val = config.fieldTemplates[f] || '';
                if (!val && config.modelName !== modelName) {
                    const low = f.toLowerCase();
                    if (low === 'word' || low === 'keyword') val = '{keyword}';
                    else if (low.includes('sentence') || low.includes('front')) val = '{sentence}';
                    else if (low.includes('meaning') || low.includes('back') || low.includes('translation')) val = '{translation}';
                    else if (low.includes('image') || low.includes('picture')) val = '{screenshot}';
                    else if (low.includes('audio') || low.includes('sound')) val = '{audio}';
                }
                html += `
                    <div class="ik-mapping-row">
                        <span class="ik-field-label">${f}</span>
                        <input class="ik-input ik-template-input" data-field="${f}" value="${val.replace(/"/g, '&quot;')}" placeholder="空">
                    </div>`;
            });
            container.innerHTML = html;
        },

        save() {
            config.ankiUrl = document.getElementById('ik-url').value;
            config.useGui = document.getElementById('ik-use-gui').checked;
            config.deckName = document.getElementById('ik-deck').value;
            config.modelName = document.getElementById('ik-model').value;
            config.fieldTemplates = {};
            document.querySelectorAll('.ik-template-input').forEach(input => {
                if (input.value) config.fieldTemplates[input.dataset.field] = input.value;
            });
            GM_setValue('config', config);
            document.getElementById('ik-anki-panel').style.display = 'none';
        }
    };

    function injectButtons() {
        const items = document.querySelectorAll('.item .ui.medium.image, .item .ui.small.image');
        items.forEach((imgDiv, idx) => {
            const container = imgDiv.closest('.item');
            if (!container) return;
            const metaDiv = container.querySelector('.meta');
            if (!metaDiv || metaDiv.querySelector('.ik-anki-float-btn')) return;

            const btn = document.createElement('div');
            btn.className = 'ik-anki-float-btn';
            btn.innerHTML = `<i aria-hidden="true" class="paper plane icon"></i> Anki`;

            btn.onclick = async (e) => {
                e.stopPropagation();
                if (!config.modelName) {
                    UI.show();
                    return;
                }
                const originalHtml = btn.innerHTML;
                btn.innerHTML = `<i class="spinner loading icon"></i> Waiting`;
                btn.classList.add('loading');
                try {
                    const data = await Scraper.extract(container, idx);
                    console.log('[Anki] Data:', data);
                    const result = await Anki.sendToAnki(data);
                    if (result) {
                        btn.innerHTML = `<i class="check icon"></i> Added`;
                        btn.classList.add('success');
                    }
                } catch (err) {
                    console.error(err);
                    btn.innerHTML = `<i class="times icon"></i> Error`;
                    btn.classList.add('error');
                    alert('添加失败: ' + err);
                } finally {
                    btn.classList.remove('loading');
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                        btn.classList.remove('success', 'error');
                    }, 2500);
                }
            };
            metaDiv.appendChild(btn);
        });
    }

    UI.init();
    GM_registerMenuCommand('设置 ImmersionKit → Anki', () => UI.show());
    const observer = new MutationObserver(() => injectButtons());
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(injectButtons, 2000);

})();