// ==UserScript==
// @name               Bilibili 字幕复制助手
// @name:en            Bilibili Subtitle Copy Assistant
// @name:zh-CN         Bilibili 字幕复制助手
// @description        在 Bilibili 添加字幕复制相关按钮，一键复制字幕、标题、UP主、发布时间和简介
// @description:en     Copy Bilibili Subtitle
// @namespace          https://github.com/subtitle-copy
// @author             Subtitle Copy Assistant
// @version            0.06
// @match              http*://www.bilibili.com/video/*
// @match              http*://www.bilibili.com/bangumi/play/*
// @icon               https://www.bilibili.com/favicon.ico
// @license            MIT
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_registerMenuCommand
// @grant              GM_setClipboard
// @grant              GM_xmlhttpRequest
// @connect            api.bilibili.com
// @connect            *
// @downloadURL https://update.greasyfork.org/scripts/563641/Bilibili%20%E5%AD%97%E5%B9%95%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563641/Bilibili%20%E5%AD%97%E5%B9%95%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 工具函数 ==========

    // GM fetch（用于跨域请求）
    function gmFetch(url, options = {}) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                const headers = {
                    'Accept': '*/*',
                    'Accept-Language': (navigator.language || 'en-US'),
                    'Referer': window.location.href,
                    'User-Agent': navigator.userAgent,
                    ...options.headers
                };

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers,
                    anonymous: false,
                    onload: response => resolve({
                        ok: response.status >= 200 && response.status <= 299,
                        status: response.status,
                        text: () => Promise.resolve(response.responseText || ''),
                        json: () => {
                            if (!response.responseText) {
                                throw new Error('响应为空，无法解析 JSON');
                            }
                            try {
                                return JSON.parse(response.responseText);
                            } catch (e) {
                                throw new Error('JSON 解析失败: ' + e.message);
                            }
                        }
                    }),
                    onerror: error => reject(new Error('请求失败: ' + (error.message || '未知错误'))),
                    ontimeout: () => reject(new Error('请求超时')),
                    timeout: 30000
                });
            } else {
                fetch(url, options).then(resolve).catch(reject);
            }
        });
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        if (typeof GM_setClipboard !== 'undefined') {
            try {
                GM_setClipboard(text);
                return Promise.resolve(true);
            } catch (e) { }
        }

        if (navigator.clipboard?.writeText) {
            return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
        }
        return fallbackCopy(text);
    }

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            return true;
        } finally {
            document.body.removeChild(ta);
        }
    }

    // 显示提示
    function showToast(message, success = true) {
        const existing = document.getElementById('subtitle-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'subtitle-toast';
        toast.textContent = message;
        toast.style.cssText = `position:fixed;top:20px;right:20px;z-index:99999;background:${success ? '#52c41a' : '#ff4d4f'};color:white;padding:12px 20px;border-radius:6px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);animation:toastIn 0.3s ease`;

        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = '@keyframes toastIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // 设置按钮文本并自动恢复
    function setButtonText(btn, statusText, originalText, delay = 2500) {
        if (!btn) return;
        btn.textContent = statusText;
        if (statusText !== originalText) {
            setTimeout(() => {
                if (btn && document.body.contains(btn)) {
                    btn.textContent = originalText;
                }
            }, delay);
        }
    }

    // ========== 设置管理 ==========

    const Settings = {
        key: 'subtitleCopySettings_v2',
        defaults: {},

        get(key) {
            try {
                const data = typeof GM_getValue !== 'undefined'
                    ? GM_getValue(this.key, this.defaults)
                    : JSON.parse(localStorage.getItem(this.key) || 'null') || this.defaults;
                return key ? (data[key] ?? this.defaults[key]) : data;
            } catch (e) {
                return key ? this.defaults[key] : this.defaults;
            }
        },

        set(key, value) {
            try {
                const data = this.get();
                data[key] = value;
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(this.key, data);
                } else {
                    localStorage.setItem(this.key, JSON.stringify(data));
                }
                return true;
            } catch (e) {
                return false;
            }
        }
    };

    // 设置面板
    function showSettingsPanel() {
        const existing = document.getElementById('subtitle-settings');
        if (existing) {
            existing.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'subtitle-settings';
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: white; border-radius: 12px; padding: 20px; z-index: 100000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2); min-width: 300px; max-width: 380px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;

        // 遮罩
        const overlay = document.createElement('div');
        overlay.id = 'subtitle-settings-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 99999;
        `;
        overlay.onclick = () => { panel.remove(); overlay.remove(); };
        document.body.appendChild(overlay);

        // 标题
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #eee;';

        const title = document.createElement('div');
        title.textContent = '📋 字幕复制助手';
        title.style.cssText = 'font-weight: 600; font-size: 16px;';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'background: none; border: none; font-size: 24px; cursor: pointer; color: #666; line-height: 1;';
        closeBtn.onclick = () => { panel.remove(); overlay.remove(); };

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // 说明
        const info = document.createElement('div');
        info.style.cssText = 'font-size: 12px; color: #888; padding-top: 12px; border-top: 1px solid #eee;';
        info.textContent = '当前在 Bilibili 页面，字幕将从视频的官方字幕接口获取。';
        panel.appendChild(info);

        document.body.appendChild(panel);
    }

    // 注册菜单命令
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('⚙️ 设置', showSettingsPanel);
    }

    // ========== Bilibili 字幕复制 ==========

    const Bilibili = {
        subtitle: null,
        cid: null,
        aid: null,
        bvid: null,

        getInfo(name) {
            const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            return w[name]
                || w.__INITIAL_STATE__?.[name]
                || w.__INITIAL_STATE__?.epInfo?.[name]
                || w.__INITIAL_STATE__?.videoData?.[name];
        },

        getEpInfo() {
            const bvid = this.getInfo('bvid');
            const cidMap = this.getInfo('cidMap');
            const w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            const page = w.__INITIAL_STATE__?.p || 1;

            let ep = cidMap?.[bvid];
            if (ep) {
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                this.cid = ep.cids[page];
                return this.cid;
            }

            ep = w.__INITIAL_STATE__?.epInfo;
            if (ep) {
                this.cid = ep.cid;
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                return this.cid;
            }

            return null;
        },

        // 获取视频标题
        getVideoTitle() {
            const titleSelectors = [
                'h1.video-title',
                '.video-title',
                'h1[data-title]',
                '.video-info-title',
                '#viewbox_report h1',
                '.video-info .video-title'
            ];

            for (const sel of titleSelectors) {
                const titleEl = document.querySelector(sel);
                if (titleEl) {
                    const title = titleEl.getAttribute('data-title') ||
                        titleEl.getAttribute('title') ||
                        titleEl.textContent?.trim();
                    if (title && title.length > 0) {
                        return title;
                    }
                }
            }

            if (document.title && !document.title.includes('哔哩哔哩')) {
                return document.title.replace('_哔哩哔哩_bilibili', '').trim();
            }

            return '';
        },

        // 获取视频简介
        getVideoDescription() {
            const descSelectors = [
                '.video-desc-container .desc-info-text',
                '.video-desc-container .basic-desc-info',
                '#v_desc .desc-info-text',
                '#v_desc .basic-desc-info',
                '.video-desc-container',
                '#v_desc'
            ];

            for (const sel of descSelectors) {
                const descEl = document.querySelector(sel);
                if (descEl) {
                    const text = descEl.textContent?.trim() || descEl.innerText?.trim();
                    if (text && text.length > 0) {
                        return text;
                    }
                }
            }

            return '';
        },

        // 获取UP主名字
        getUploaderName() {
            const owner = this.getInfo('owner');
            if (owner && owner.name) {
                return owner.name;
            }
            const upData = this.getInfo('upData');
            if (upData && upData.name) {
                return upData.name;
            }

            const selectors = [
                '.up-name',
                '.up-detail .up-name',
                '.up-info .username',
                '.name-text',
                '.up-info-container .up-name',
                'a[href*="//space.bilibili.com/"]'
            ];

            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) {
                    const text = el.textContent?.trim();
                    if (text && text.length > 0) return text;
                }
            }
            return '';
        },

        // 获取发布时间
        getPublishDate() {
            const pubdate = this.getInfo('pubdate') || this.getInfo('ctime');
            if (pubdate) {
                const date = new Date(pubdate * 1000);
                const Y = date.getFullYear();
                const M = String(date.getMonth() + 1).padStart(2, '0');
                const D = String(date.getDate()).padStart(2, '0');
                const h = String(date.getHours()).padStart(2, '0');
                const m = String(date.getMinutes()).padStart(2, '0');
                const s = String(date.getSeconds()).padStart(2, '0');
                return `${Y}-${M}-${D} ${h}:${m}:${s}`;
            }

            const selectors = [
                '.pubdate-text',
                '.video-info-meta .pubdate',
                'span[class*="pubdate"]'
            ];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) {
                    const text = el.textContent?.trim();
                    if (text && text.length > 0) return text;
                }
            }

            const metas = document.querySelectorAll('.video-info-meta span, .video-data span');
            for (const meta of metas) {
                if (/\d{4}-\d{2}-\d{2}/.test(meta.textContent)) {
                    return meta.textContent.trim();
                }
            }

            return '';
        },

        // 获取评论区内容 (通过 API 静默获取，不触发页面跳转)
        async fetchComments() {
            if (!this.aid) return '';

            try {
                // sort: 2 为按热度排序 (热门评论)
                const url = `https://api.bilibili.com/x/v2/reply?type=1&oid=${this.aid}&sort=2&ps=20`;
                const res = await gmFetch(url);
                if (!res.ok) return '';

                const data = await res.json();
                if (data.code !== 0 || !data.data?.replies) return '';

                const comments = data.data.replies.map(reply => {
                    const user = reply.member?.uname || '匿名';
                    const content = reply.content?.message || '';
                    return `${user}: ${content}`;
                });

                return comments.join('\n');
            } catch (e) {
                console.log('[字幕] 获取评论API失败:', e.message);
                return '';
            }
        },

        async loadSubtitle() {
            this.getEpInfo();
            if (!this.cid || (!this.aid && !this.bvid)) return null;

            const url = `https://api.bilibili.com/x/player/wbi/v2?cid=${this.cid}${this.aid ? `&aid=${this.aid}` : `&bvid=${this.bvid}`}`;
            const res = await gmFetch(url);
            if (!res.ok) return null;

            const data = await res.json();
            if (data.code !== 0 || !data.data?.subtitle) return null;

            this.subtitle = data.data.subtitle;
            return this.subtitle;
        },

        async copyContent() {
            const btn = document.getElementById('bili-subtitle-done-btn');
            const textNode = btn?.querySelector('.video-toolbar-item-text');
            if (!textNode) return;

            const originalText = textNode.textContent;
            textNode.textContent = '⏳ 获取中...';

            try {
                let title = '';
                let uploader = '';
                let pubDate = '';
                let description = '';

                try { title = this.getVideoTitle(); } catch (e) { }
                try { uploader = this.getUploaderName(); } catch (e) { }
                try { pubDate = this.getPublishDate(); } catch (e) { }
                try { description = this.getVideoDescription(); } catch (e) { }

                // 1. 获取字幕内容
                let subtitleText = '';
                if (!this.subtitle?.subtitles?.length) {
                    await this.loadSubtitle();
                }

                if (this.subtitle?.subtitles?.length) {
                    const sub = this.subtitle.subtitles.find(s =>
                        s.lan?.startsWith('zh') || s.lan_doc?.includes('中文')
                    ) || this.subtitle.subtitles[0];

                    if (sub) {
                        try {
                            const res = await gmFetch(sub.subtitle_url);
                            const data = await res.json();
                            if (data.body?.length) {
                                let lines = [];
                                let currentText = '';
                                data.body.forEach(item => {
                                    // 清理原始文本末尾的标点符号，统一使用逗号拼接
                                    let content = item.content.trim().replace(/[，。？！；,.?!;、]$/, '');
                                    if (!content) return;

                                    if (currentText.length > 0) {
                                        currentText += '，' + content;
                                    } else {
                                        currentText = content;
                                    }

                                    // 当累积长度达到100字左右时换行
                                    if (currentText.length >= 100) {
                                        lines.push(currentText);
                                        currentText = '';
                                    }
                                });
                                if (currentText) lines.push(currentText);
                                subtitleText = lines.join('\n');
                            }
                        } catch (e) { }
                    }
                }

                // 2. 获取评论内容 (异步 API)
                let commentText = await this.fetchComments();

                const parts = [];
                if (title) parts.push(`标题：${title}`);
                if (uploader) parts.push(`UP主：${uploader}`);
                if (pubDate) parts.push(`发布时间：${pubDate}`);

                let combinedMetadata = parts.join('\n\n');
                let finalSections = [combinedMetadata];

                if (description) {
                    finalSections.push(`简介：\n${description}`);
                }

                if (subtitleText) {
                    finalSections.push(`字幕：\n${subtitleText}`);
                }

                if (commentText) {
                    finalSections.push(`评论：\n${commentText}`);
                }

                if (finalSections.length === 0 || (finalSections.length === 1 && !combinedMetadata)) {
                    setButtonText(textNode, '❌ 无内容', originalText);
                    showToast('未获取到有效内容', false);
                    return;
                }

                const combinedText = finalSections.join('\n\n\n');
                const ok = await copyToClipboard(combinedText);

                const copiedParts = [];
                if (title) copiedParts.push('标题');
                if (uploader) copiedParts.push('UP主');
                if (pubDate) copiedParts.push('时间');
                if (description) copiedParts.push('简介');
                if (subtitleText) copiedParts.push('字幕');
                if (commentText) copiedParts.push('评论');

                const successMsg = copiedParts.length > 0
                    ? `✅ 已复制${copiedParts.join('、')}`
                    : '✅ 已复制';

                setButtonText(textNode, ok ? successMsg : '❌ 复制失败', originalText);
            } catch (e) {
                setButtonText(textNode, '❌ 复制失败', originalText);
            }
        },

        addDoneButton() {
            if (document.getElementById('bili-subtitle-done-btn')) {
                return;
            }

            const leftSelectors = [
                '.video-toolbar-left-main',
                '.video-toolbar .video-toolbar-left-main',
                '.video-toolbar-left'
            ];
            let leftMain = null;
            for (const sel of leftSelectors) {
                leftMain = document.querySelector(sel);
                if (leftMain) break;
            }
            if (!leftMain) return;

            const shareInner = leftMain.querySelector('.video-share-wrap.video-toolbar-left-item');
            if (!shareInner) return;
            const shareWrap = shareInner.closest('.toolbar-left-item-wrap') || shareInner;
            const parent = shareWrap.parentNode;
            if (!parent) return;

            const wrap = document.createElement('div');
            wrap.className = 'toolbar-left-item-wrap';

            const activeStyle = 'background:#065fd4;color:white;border:none;border-radius:18px;padding:0 16px;height:36px;font-size:14px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;flex-shrink:0';
            const commentStyle = 'background:#FB7299;color:white;border:none;border-radius:18px;padding:0 16px;height:36px;font-size:14px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;flex-shrink:0';
            const disabledStyle = 'background:#999999;color:white;border:none;border-radius:18px;padding:0 16px;height:36px;font-size:14px;font-weight:500;cursor:not-allowed;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;flex-shrink:0;opacity:0.7';

            const doneBtn = document.createElement('div');
            doneBtn.id = 'bili-subtitle-done-btn';
            doneBtn.className = 'video-toolbar-left-item';
            doneBtn.title = '复制字幕';
            doneBtn.style.cssText = activeStyle;

            const textSpan = document.createElement('span');
            textSpan.className = 'video-toolbar-item-text';
            textSpan.textContent = '检测中...';

            doneBtn.appendChild(textSpan);
            doneBtn.onclick = () => {
                this.copyContent();
            };

            wrap.appendChild(doneBtn);

            try {
                parent.insertBefore(wrap, shareWrap.nextSibling);
                this.loadSubtitle().then(sub => {
                    const btn = document.getElementById('bili-subtitle-done-btn');
                    if (!btn) return;
                    const span = btn.querySelector('.video-toolbar-item-text');

                    if (sub?.subtitles?.length) {
                        btn.style.cssText = activeStyle;
                        btn.setAttribute('data-mode', 'subtitle');
                        if (span) span.textContent = '复制字幕';
                    } else {
                        btn.style.cssText = commentStyle; // 无字幕时使用粉色
                        btn.setAttribute('data-mode', 'comment');
                        if (span) span.textContent = '复制评论';
                    }
                }).catch(e => {
                    const btn = document.getElementById('bili-subtitle-done-btn');
                    if (!btn) return;
                    btn.style.cssText = commentStyle; // 出错（无字幕）时使用粉色
                    const span = btn.querySelector('.video-toolbar-item-text');
                    btn.setAttribute('data-mode', 'comment');
                    if (span) span.textContent = '复制评论';
                });
            } catch (e) { }
        },

        init() {
            let retryCount = 0;
            const maxRetries = 30;

            const tryAdd = () => {
                this.addDoneButton();
                const doneBtn = document.getElementById('bili-subtitle-done-btn');
                if (!doneBtn && retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(tryAdd, 1000);
                }
            };

            setTimeout(tryAdd, 1000);

            let lastUrl = location.href;
            const urlObserver = new MutationObserver(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    this.subtitle = null;
                    const doneBtn = document.getElementById('bili-subtitle-done-btn');
                    if (doneBtn) doneBtn.closest('.toolbar-left-item-wrap')?.remove();
                    retryCount = 0;
                    setTimeout(tryAdd, 1000);
                }
            });
            urlObserver.observe(document.body, { childList: true, subtree: true });
        }
    };

    // ========== 初始化入口 ==========

    if (location.hostname.includes('bilibili.com')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => Bilibili.init());
        } else {
            Bilibili.init();
        }
    }
})();