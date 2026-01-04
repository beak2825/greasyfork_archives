// ==UserScript==
// @name         海角社区—本地纯净版（回馈用户版）
// @version      1.0.0
// @description  ⚡纯本地端，无需登录账号，支持播放、下载、拖动快进、长按倍速⚡
// @author       Local
// @include      *://hj*.*/*
// @match        https://haijiao.com/*
// @match        https://*.haijiao.com/*
// @match        https://hj251101e0b.top/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1398711
// @downloadURL https://update.greasyfork.org/scripts/557903/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E2%80%94%E6%9C%AC%E5%9C%B0%E7%BA%AF%E5%87%80%E7%89%88%EF%BC%88%E5%9B%9E%E9%A6%88%E7%94%A8%E6%88%B7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557903/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E2%80%94%E6%9C%AC%E5%9C%B0%E7%BA%AF%E5%87%80%E7%89%88%EF%BC%88%E5%9B%9E%E9%A6%88%E7%94%A8%E6%88%B7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedM3u8Url = null;
    let capturedTsUrls = [];
    let currentHlsInstance = null;
    let currentPageUrl = window.location.href;
    let isDragging = false;
    let isCollapsed = false;
    let fullM3u8Url = null;

    const ec = {
        b64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        b64re: /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,

        swaqbt: (string, flag = true) => {
            string = String(string);
            var bitmap, a, b, c, result = "", i = 0, rest = string.length % 3;
            for (; i < string.length;) {
                if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string.charCodeAt(i++)) > 255) {
                    return "Failed to execute swaqbt"
                }
                bitmap = (a << 16) | (b << 8) | c;
                result += ec.b64.charAt(bitmap >> 18 & 63) + ec.b64.charAt(bitmap >> 12 & 63) +
                    ec.b64.charAt(bitmap >> 6 & 63) + ec.b64.charAt(bitmap & 63);
            }
            if (flag) return ec.swaqbt(rest ? result.slice(0, rest - 3) + "===".substring(rest) : result, false)
            else return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
        },

        sfweccat: (string, flag = true) => {
            string = String(string).replace(/[\t\n\f\r ]+/g, "");
            if (!ec.b64re.test(string)) {
                return 'Failed to execute sfweccat'
            }
            string += "==".slice(2 - (string.length & 3));
            var bitmap, result = "", r1, r2, i = 0;
            for (; i < string.length;) {
                bitmap = ec.b64.indexOf(string.charAt(i++)) << 18 | ec.b64.indexOf(string.charAt(i++)) << 12 |
                    (r1 = ec.b64.indexOf(string.charAt(i++))) << 6 | (r2 = ec.b64.indexOf(string.charAt(i++)));
                result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
                    r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
                    String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
            }
            if (flag) return ec.sfweccat(result, false)
            else return result
        }
    };

    const encode = function(s, plus) {
        const cfsed = encodeURIComponent;
        const csrdfd = unescape;
        return plus ? ec.swaqbt(ec.swaqbt(csrdfd(cfsed(s))), false) : ec.swaqbt(ec.swaqbt(s), false);
    }

    const decode = function(s, plus) {
        const obj = {};
        const sfscc = 'wt' + Math.ceil(Math.random() * 100000000);
        obj[sfscc] = escape;
        return plus ? decodeURIComponent(obj[sfscc](ec.sfweccat(ec.sfweccat(s), false))) :
            decodeURIComponent(ec.sfweccat(ec.sfweccat(s), false));
    }

    function modifyTopicResponse(responseText) {
        try {
            let res = JSON.parse(responseText);

            if (!res || !res.data) {
                return responseText;
            }

            let body;
            let isPlus = false;
            try {
                body = JSON.parse(decode(res.data));
            } catch {
                try {
                    body = JSON.parse(decode(res.data, true));
                    isPlus = true;
                } catch {
                    body = typeof res.data === 'object' ? res.data : JSON.parse(res.data);
                }
            }

            if (!body) {
                return responseText;
            }

            if (body.sale) {
                body.sale.money_type = 0;
                body.sale.amount = 0;
                body.sale.is_buy = true;
            }

            let hasVideo = -1;
            let allImages = {};

            if (body.attachments && body.attachments.length > 0) {
                body.attachments.forEach((attachment, index) => {
                    if (attachment.category === 'images') {
                        allImages[attachment.id] = attachment.remoteUrl;
                    }
                    if (attachment.category === 'video') {
                        hasVideo = index;
                    }
                });
            }


            if (body.content && hasVideo === -1 && Object.keys(allImages).length > 0) {
                let domElements = [];
                for (const [id, src] of Object.entries(allImages)) {
                    domElements.push(`<img src="${src}" data-id="${id}"/>`);
                }

                const selledImg = `[sell]` + '<p>' + domElements.join('</p><p>') + '</p>' + `[/sell]`;
                if (body.content.includes('sell-btn')) {
                    body.content = body.content.replace(/<span class="sell-btn"[\s\S]*?<\/span>/, selledImg);
                }
            } else if (body.content && hasVideo === -1 && Object.keys(allImages).length === 0) {

                if (body.content.includes('sell-btn')) {
                    body.content = body.content.replace(/<span class="sell-btn"[\s\S]*?<\/span>/, '');
                }
            }

            try {
                if (isPlus) {
                    res.data = encode(JSON.stringify(body), true);
                } else {
                    res.data = encode(JSON.stringify(body));
                }
                return JSON.stringify(res);
            } catch (encodeError) {
                return responseText;
            }
        } catch (error) {
            return responseText;
        }
    }

    function setupApiInterceptor() {
        const originOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (/\/api\/topic\/\d+/.test(url)) {
                const xhr = this;

                if (!xhr.__hj_intercepted) {
                    xhr.__hj_intercepted = true;

                    const responseGetter = Object.getOwnPropertyDescriptor(
                        XMLHttpRequest.prototype,
                        "response"
                    ).get;

                    Object.defineProperty(xhr, "response", {
                        get: () => {
                            let result = responseGetter.call(xhr);
                            try {
                                if (typeof result === 'string') {
                                    const modified = modifyTopicResponse(result);
                                    if (modified !== result) {
                                        return modified;
                                    }
                                }
                                return result;
                            } catch (e) {
                                return result;
                            }
                        },
                        configurable: true
                    });

                    Object.defineProperty(xhr, "responseText", {
                        get: () => {
                            let result = responseGetter.call(xhr);
                            try {
                                if (typeof result === 'string') {
                                    const modified = modifyTopicResponse(result);
                                    if (modified !== result) {
                                        return modified;
                                    }
                                }
                                return result;
                            } catch (e) {
                                return result;
                            }
                        },
                        configurable: true
                    });
                }
            }

            return originOpen.call(this, method, url, ...args);
        };
    }

    function showToast(text) {
        try {
            let box = document.getElementById('hj-toast-box');
            if (!box) {
                box = document.createElement('div');
                box.id = 'hj-toast-box';
                box.style.cssText = 'position:fixed;right:16px;top:16px;z-index:100000;display:flex;flex-direction:column;gap:8px;';
                document.body.appendChild(box);
            }
            const item = document.createElement('div');
            item.style.cssText = 'background:rgba(0,0,0,0.75);color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3);max-width:60vw;';
            item.textContent = String(text || '');
            box.appendChild(item);
            setTimeout(() => {
                item.remove();
                if (box && !box.children.length) box.remove();
            }, 2000);
        } catch (_) {}
    }

    function getTopicIdFromUrl() {
        try {
            const u = new URL(window.location.href);
            const qp = u.searchParams;
            const cand = [qp.get('id'), qp.get('pid'), qp.get('tid')].filter(Boolean);
            for (const v of cand) {
                if (/^\d+$/.test(v)) return v;
            }
            const m = u.pathname.match(/\b(\d{4,})\b(?!.*\d)/);
            if (m) return m[1];
        } catch (_) {}
        return null;
    }

    function probePreviewFromPreviewBtn() {
        try {
            if (capturedM3u8Url) return true;
            const btn = document.querySelector('span.preview-btn, .preview-btn');
            if (!btn) return false;
            const url = btn.getAttribute('data-url') || '';
            if (url && /\.m3u8(\?|$)/i.test(url)) {
                capturedM3u8Url = new URL(url, location.href).href;
                setTimeout(() => ensureTsSampleFromPreview(capturedM3u8Url), 0);
                updateButtonBadges();
                setTimeout(() => resolveFullVideoUrl(), 500);
                return true;
            }
        } catch (_) {}
        return false;
    }

    function triggerPreviewButtonClick() {
        try {
            const btn = document.querySelector('span.preview-btn, .preview-btn');
            if (!btn) return false;
            const rect = btn.getBoundingClientRect();
            try {
                btn.scrollIntoView({ block: 'center', inline: 'center' });
            } catch (_) {}
            const opts = { bubbles: true, cancelable: true, clientX: Math.floor(rect.left + 5), clientY: Math.floor(rect.top + 5) };
            btn.dispatchEvent(new MouseEvent('pointerdown', opts));
            btn.dispatchEvent(new MouseEvent('mousedown', opts));
            btn.dispatchEvent(new MouseEvent('mouseup', opts));
            btn.dispatchEvent(new MouseEvent('pointerup', opts));
            btn.dispatchEvent(new MouseEvent('click', opts));
            return true;
        } catch (_) {
            return false;
        }
    }

    async function probePreviewViaApi() {
        if (capturedM3u8Url) return true;
        const topicId = getTopicIdFromUrl();
        if (!topicId) return false;
        try {
            const res = await fetch(`${location.origin}/api/topic/${topicId}`, { credentials: 'include' });
            if (res.ok) {
                let data = await res.json();
                if (data && data.data) {
                    let body = null;
                    try {
                        body = JSON.parse(data.data);
                    } catch (_) {}
                    if (!body) {
                        try {
                            body = JSON.parse(atob(atob(atob(data.data))));
                        } catch (_) {}
                    }
                    if (!body) {
                        try {
                            body = JSON.parse(atob(atob(data.data)));
                        } catch (_) {}
                    }
                    if (!body && typeof data.data === 'object') body = data.data;
                    const atts = body && body.attachments || [];
                    for (const a of atts) {
                        if (a && a.category === 'video' && typeof a.remoteUrl === 'string' && /\.m3u8(\?|$)/i.test(a.remoteUrl)) {
                            capturedM3u8Url = a.remoteUrl;
                            updateButtonBadges();
                            setTimeout(() => resolveFullVideoUrl(), 500);
                            return true;
                        }
                    }
                }
            }
            triggerPreviewButtonClick();
        } catch (_) {}
        return false;
    }

    function setupHlsHook() {
        try {
            if (window.__hj_hls_hooked) return;
            const tryHook = () => {
                try {
                    const H = window.Hls;
                    if (!H || !H.prototype || !H.prototype.loadSource) return false;
                    const orig = H.prototype.loadSource;
                    H.prototype.loadSource = function(url) {
                        try {
                            if (url && typeof url === 'string') {
                                capturedM3u8Url = url;
                                updateButtonBadges();
                                setTimeout(() => resolveFullVideoUrl(), 500);
                            }
                        } catch (_) {}
                        return orig.apply(this, arguments);
                    };
                    window.__hj_hls_hooked = true;
                    return true;
                } catch (_) {
                    return false;
                }
            };
            if (!tryHook()) {
                let attempts = 0;
                const t = setInterval(() => {
                    attempts++;
                    if (tryHook() || attempts > 20) clearInterval(t);
                }, 300);
            }
        } catch (_) {}
    }

    async function ensureTsSampleFromPreview(previewUrl) {
        try {
            const res = await fetch(previewUrl, { method: 'GET', credentials: 'omit' });
            if (!res.ok) return null;
            const text = await res.text();
            const lines = text.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                const L = (lines[i] || '').trim();
                if (!L || L.startsWith('#')) continue;
                if (/\.ts(\?|$)/i.test(L)) {
                    const abs = new URL(L, previewUrl).href;
                    if (abs) {
                        if (!capturedTsUrls) capturedTsUrls = [];
                        if (!capturedTsUrls.includes(abs)) capturedTsUrls.push(abs);
                        return abs;
                    }
                }
            }
            return null;
        } catch (_) {
            return null;
        }
    }

    function autoTriggerVideoPreview() {
        try {
            if (capturedM3u8Url) return;
            if (probePreviewFromPreviewBtn()) return;
            setTimeout(() => probePreviewViaApi(), 500);
        } catch (_) {}
    }

    async function resolveFullVideoUrl() {
        if (fullM3u8Url) {
            return fullM3u8Url;
        }
        if (!capturedM3u8Url) {
            return null;
        }


        if (!/_preview/i.test(capturedM3u8Url)) {
            fullM3u8Url = capturedM3u8Url;
            updateButtonBadges();
            showToast('完整版已就绪');
            return capturedM3u8Url;
        }

        try {

            const response = await fetch(capturedM3u8Url);
            if (response.ok) {
                const m3u8Content = await response.text();

                const lines = m3u8Content.split('\n');
                for (let line of lines) {
                    line = line.trim();

                    if (line && !line.startsWith('#') && line.includes('.ts')) {
                        let tsMatch = line.match(/([^\/]+)_preview_?\d+\.ts/i);
                        if (tsMatch && tsMatch[1]) {
                            const realPrefix = tsMatch[1];

                            const basePath = capturedM3u8Url.substring(0, capturedM3u8Url.lastIndexOf('/') + 1);
                            const fullUrl = basePath + realPrefix + '.m3u8';

                            fullM3u8Url = fullUrl;
                            updateButtonBadges();
                            showToast('完整版已就绪');
                            return fullUrl;
                        }

                        tsMatch = line.match(/([a-zA-Z0-9]+_i)\d+\.ts/i);
                        if (tsMatch && tsMatch[1]) {
                            const realPrefix = tsMatch[1];

                            const basePath = capturedM3u8Url.substring(0, capturedM3u8Url.lastIndexOf('/') + 1);
                            const fullUrl = basePath + realPrefix + '.m3u8';

                            fullM3u8Url = fullUrl;
                            updateButtonBadges();
                            showToast('完整版已就绪');
                            return fullUrl;
                        }
                    }
                }
            }

            if (capturedTsUrls && capturedTsUrls.length > 0) {
                const tsUrl = capturedTsUrls[0];

                const tsMatch = tsUrl.match(/([^\/]+)_preview_\d+\.ts/i);
                if (tsMatch && tsMatch[1]) {
                    const realPrefix = tsMatch[1];
                    const basePath = capturedM3u8Url.substring(0, capturedM3u8Url.lastIndexOf('/') + 1);
                    const fullUrl = basePath + realPrefix + '.m3u8';

                    fullM3u8Url = fullUrl;
                    updateButtonBadges();
                    showToast('完整版已就绪');
                    return fullUrl;
                }
            }

            const simpleReplace = capturedM3u8Url.replace(/_preview/gi, '');

            fullM3u8Url = simpleReplace;
            updateButtonBadges();
            showToast('完整版已就绪');
            return simpleReplace;

        } catch (e) {
            return capturedM3u8Url;
        }
    }

    function destroyPlayer() {
        try {
            const video = document.getElementById('hls-video');
            if (video) {
                video.pause();
                video.src = '';
                video.load();
            }
        } catch (_) {}

        if (currentHlsInstance) {
            try {
                currentHlsInstance.stopLoad();
                currentHlsInstance.detachMedia();
                currentHlsInstance.destroy();
            } catch (_) {}
            currentHlsInstance = null;
        }

        const overlay = document.getElementById('video-player-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    function playVideoInPage(m3u8Url) {
        destroyPlayer();

        const overlay = document.createElement('div');
        overlay.id = 'video-player-overlay';
        overlay.style.zIndex = '1000000';
        const isPreview = /_preview/i.test(m3u8Url);
        const titleText = isPreview ? ' 视频播放 (预览版)' : ' 视频播放 (完整版)';
        const titleColor = isPreview ? '#ff6b6b' : '#51cf66';

        overlay.innerHTML = `
            <div class="video-player-container">
                <div class="video-header">
                    <h3 style="color: ${titleColor};">${titleText}</h3>
                    <button class="close-btn" id="close-player-btn">✕</button>
                </div>
                <div class="video-tips"> 支持拖动播放，长按倍速播放哦~</div>
                <video id="hls-video" controls autoplay style="width:100%;max-height:70vh;background:#000;">
                    您的浏览器不支持视频播放
                </video>
            </div>
        `;

        GM_addStyle(`
            #video-player-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 1000000 !important;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .video-player-container {
                background: white;
                border-radius: 15px;
                padding: 20px;
                max-width: 90%;
                box-shadow: 0 10px 50px rgba(0,0,0,0.5);
            }
            .video-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            .video-header h3 {
                margin: 0;
                color: #333;
                font-size: 16px;
                font-weight: 600;
            }
            .video-tips {
                font-size: 12px;
                color: #666;
                text-align: center;
                margin-bottom: 12px;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 8px;
                line-height: 1.5;
            }
            .close-btn {
                background: #ff4757;
                color: white;
                border: none;
                border-radius: 50%;
                width: 35px;
                height: 35px;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.2s;
            }
            .close-btn:hover {
                background: #ff3838;
                transform: scale(1.1);
            }
            #hls-video {
                cursor: pointer;
                user-select: none;
            }
        `);

        document.body.appendChild(overlay);
        const closeBtn = document.getElementById('close-player-btn');
        if (closeBtn) closeBtn.addEventListener('click', destroyPlayer);

        const videoElement = document.getElementById('hls-video');

        let isDraggingVideo = false;
        let startX = 0;
        let startTime = 0;

        videoElement.addEventListener('mousedown', (e) => {
            isDraggingVideo = true;
            startX = e.clientX;
            startTime = videoElement.currentTime;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingVideo) return;
            const deltaX = e.clientX - startX;
            const seekAmount = deltaX / 5;
            const newTime = Math.max(0, Math.min(videoElement.duration, startTime + seekAmount));
            videoElement.currentTime = newTime;
        });

        document.addEventListener('mouseup', () => {
            isDraggingVideo = false;
        });

        let longPressTimer = null;
        let longPressInterval = null;
        const speedUpRate = 0.5;

        videoElement.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            longPressTimer = setTimeout(() => {
                longPressInterval = setInterval(() => {
                    if (videoElement.currentTime < videoElement.duration) {
                        videoElement.currentTime += speedUpRate;
                    } else {
                        clearInterval(longPressInterval);
                    }
                }, 100);
            }, 500);
        });

        videoElement.addEventListener('mouseup', () => {
            clearTimeout(longPressTimer);
            clearInterval(longPressInterval);
        });

        videoElement.addEventListener('mouseleave', () => {
            clearTimeout(longPressTimer);
            clearInterval(longPressInterval);
        });

        let touchStartX = 0;
        let touchStartTime = 0;

        videoElement.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartTime = videoElement.currentTime;

            longPressTimer = setTimeout(() => {
                longPressInterval = setInterval(() => {
                    if (videoElement.currentTime < videoElement.duration) {
                        videoElement.currentTime += speedUpRate;
                    } else {
                        clearInterval(longPressInterval);
                    }
                }, 100);
            }, 500);
        });

        videoElement.addEventListener('touchmove', (e) => {
            const deltaX = e.touches[0].clientX - touchStartX;
            const seekAmount = deltaX / 5;
            const newTime = Math.max(0, Math.min(videoElement.duration, touchStartTime + seekAmount));
            videoElement.currentTime = newTime;

            clearTimeout(longPressTimer);
            clearInterval(longPressInterval);
        });

        videoElement.addEventListener('touchend', () => {
            clearTimeout(longPressTimer);
            clearInterval(longPressInterval);
        });

        if (Hls.isSupported()) {
            const video = document.getElementById('hls-video');
            const hls = new Hls();
            currentHlsInstance = hls;
            hls.loadSource(m3u8Url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    alert('视频加载失败，请尝试复制链接使用其他播放器');
                }
            });
        } else if (document.getElementById('hls-video').canPlayType('application/vnd.apple.mpegurl')) {
            document.getElementById('hls-video').src = m3u8Url;
        } else {
            alert('您的浏览器不支持HLS播放，请复制链接使用其他播放器');
        }
    }

    async function playFullVideo() {
        if (!capturedM3u8Url) {
            showToast('正在捕获视频链接...');
            await autoTriggerVideoPreview();
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (!capturedM3u8Url) {
            alert('❌ 未能捕获到视频链接，请稍后重试');
            return;
        }

        const fullUrl = await resolveFullVideoUrl();

        if (fullUrl && !/_preview/i.test(fullUrl)) {
            playVideoInPage(fullUrl);
        } else {
            playVideoInPage(capturedM3u8Url);
        }
    }

    function showDownloadModal(displayUrl) {
        const existed = document.querySelector('.hj-modal-overlay[data-type="download"]');
        if (existed) {
            existed.remove();
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'hj-modal-overlay';
        modal.setAttribute('data-type', 'download');
        modal.style.zIndex = '1000005';
        modal.innerHTML = `
            <div class="hj-modal" style="max-width: 600px;">
                <div class="hj-modal-title">📥 视频下载</div>
                <div class="hj-modal-content">
                    <div style="margin-bottom: 12px; color: rgba(255,255,255,0.9); font-size: 13px;">
                        💡 M3U8 是播放列表文件，需要使用专业工具下载完整视频
                    </div>
                    <div style="margin-bottom: 8px; color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 500;">
                        视频链接：
                    </div>
                    <textarea id="hj-download-url" readonly style="width:100%;min-height:80px;padding:10px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.3);border-radius:8px;color:#fff;font-size:12px;font-family:'Courier New',monospace;resize:vertical;word-break:break-all;outline:none;">${displayUrl || ''}</textarea>
                </div>
                <div class="hj-modal-actions" style="flex-direction:column;gap:10px;">
                    <button class="hj-modal-btn hj-modal-btn-primary" id="hj-download-copy" style="width:100%;">📋 复制链接</button>
                    <button class="hj-modal-btn hj-modal-btn-primary" id="hj-download-go" style="width:100%; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">🚀 复制并前往专业下载网站</button>
                    <button class="hj-modal-btn" id="hj-download-close" style="width:100%; background: rgba(255,255,255,0.2);">关闭</button>
                </div>
            </div>`;

        GM_addStyle(`
            .hj-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
                z-index: 1000005 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.2s;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .hj-modal {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 28px;
                min-width: 360px;
                max-width: 90vw;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                color: white;
                animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .hj-modal-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 20px;
                text-align: center;
            }
            .hj-modal-content {
                background: rgba(255, 255, 255, 0.15);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 20px;
            }
            .hj-modal-actions {
                display: flex;
                gap: 12px;
            }
            .hj-modal-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .hj-modal-btn-primary {
                background: rgba(255, 255, 255, 0.9);
                color: #667eea;
            }
            .hj-modal-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
        `);

        document.body.appendChild(modal);

        const closeAll = () => {
            modal.remove();
        };
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAll();
        });

        const copyBtn = document.getElementById('hj-download-copy');
        if (copyBtn) copyBtn.addEventListener('click', () => {
            const val = String(displayUrl || '');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(val).then(() => {
                    showToast('✓ 链接已复制');
                }).catch(() => {
                    showToast('复制失败，请手动复制');
                });
            }
        });

        const goBtn = document.getElementById('hj-download-go');
        if (goBtn) goBtn.addEventListener('click', () => {
            const val = String(displayUrl || '');
            if (navigator.clipboard) navigator.clipboard.writeText(val).catch(() => {});
            window.open('https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html', '_blank');
            closeAll();
        });

        const closeBtn = document.getElementById('hj-download-close');
        if (closeBtn) closeBtn.addEventListener('click', closeAll);
    }

    async function downloadVideo() {
        if (!capturedM3u8Url) {
            showToast('正在捕获视频链接...');
            await autoTriggerVideoPreview();
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (!capturedM3u8Url) {
            alert('❌ 未能捕获到视频链接，请稍后重试');
            return;
        }

        const fullUrl = await resolveFullVideoUrl();
        showDownloadModal(fullUrl || capturedM3u8Url);
    }

    function updateButtonBadges() {
        try {
            const playBadge = document.getElementById('hj-play-badge');
            const downloadBadge = document.getElementById('hj-download-badge');

            const hasVideo = !!(capturedM3u8Url || fullM3u8Url);

            if (playBadge) {
                playBadge.style.display = hasVideo ? 'block' : 'none';
            }
            if (downloadBadge) {
                downloadBadge.style.display = hasVideo ? 'block' : 'none';
            }
        } catch (_) {}
    }

    function createControlPanel() {
        if (document.querySelector('.hj-floating-panel')) return;

        GM_addStyle(`
            .hj-floating-panel {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 999999;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .hj-floating-panel.dragging {
                transition: none;
            }
            .hj-floating-panel.collapsed .hj-panel-content {
                opacity: 0;
                pointer-events: none;
                max-height: 0;
                margin: 0;
            }
            .hj-floating-panel.collapsed .hj-toggle-btn svg {
                transform: rotate(180deg);
            }
            .hj-panel-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
            .hj-toggle-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: move;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                transition: all 0.3s;
                padding: 0;
            }
            .hj-toggle-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
            }
            .hj-toggle-btn svg {
                width: 24px;
                height: 24px;
                color: white;
                transition: transform 0.3s;
            }
            .hj-panel-content {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                transition: all 0.3s;
                max-height: 500px;
                overflow: hidden;
            }
            .hj-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .hj-btn {
                border: none;
                border-radius: 12px;
                padding: 0;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                color: white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .hj-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
            }
            .hj-btn:active {
                transform: translateY(0);
            }
            .hj-btn svg {
                width: 20px;
                height: 20px;
            }
            .hj-btn-play {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            }
            .hj-btn-download {
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            }
            .hj-btn-badge {
                position: absolute;
                left: 8px;
                top: 8px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #22c55e;
                box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35), 0 0 8px rgba(34, 197, 94, 0.55);
                display: none;
                z-index: 10;
                animation: badgePulse 2s infinite;
            }
            @keyframes badgePulse {
                0%, 100% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.7;
                    transform: scale(1.15);
                }
            }
        `);

        const panel = document.createElement('div');
        panel.className = 'hj-floating-panel';
        panel.innerHTML = `
            <div class="hj-panel-container">
                <button class="hj-toggle-btn" id="hj-toggle-btn" title="拖动移动 | 点击最小化">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
                <div class="hj-panel-content">
                    <div class="hj-buttons">
                        <button class="hj-btn hj-btn-play" id="hj-btn-play" title="播放视频" style="position: relative;">
                            <span class="hj-btn-badge" id="hj-play-badge"></span>
                            <svg viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <button class="hj-btn hj-btn-download" id="hj-btn-download" title="下载视频" style="position: relative;">
                            <span class="hj-btn-badge" id="hj-download-badge"></span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        setupPanelEvents(panel);

        setTimeout(() => updateButtonBadges(), 100);
    }

    function setupPanelEvents(panel) {
        if (!panel || panel.dataset.bound === '1') return;
        panel.dataset.bound = '1';
        const toggleBtn = document.getElementById('hj-toggle-btn');

        let startX, startY, startRight, startTop;
        let hasMoved = false;

        if (toggleBtn) {
            toggleBtn.addEventListener('mousedown', (e) => {
                isDragging = true;
                hasMoved = false;
                startX = e.clientX;
                startY = e.clientY;

                const rect = panel.getBoundingClientRect();
                startRight = window.innerWidth - rect.right;
                startTop = rect.top;

                panel.classList.add('dragging');
                e.preventDefault();
            });
        }

        document.addEventListener('mousemove', (e) => {
            if (!isDragging || !toggleBtn) return;

            const deltaX = startX - e.clientX;
            const deltaY = startY - e.clientY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasMoved = true;
            }

            const newRight = startRight + deltaX;
            const newTop = startTop + deltaY;

            panel.style.right = Math.max(0, Math.min(window.innerWidth - 100, newRight)) + 'px';
            panel.style.top = Math.max(0, Math.min(window.innerHeight - 100, newTop)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging && !hasMoved) {
                isCollapsed = !isCollapsed;
                panel.classList.toggle('collapsed', isCollapsed);
            }
            isDragging = false;
            panel.classList.remove('dragging');
        });

        panel.addEventListener('click', async (e) => {
            const btn = e.target.closest('.hj-btn');
            if (!btn) return;

            if (btn.id === 'hj-btn-play') await playFullVideo();
            else if (btn.id === 'hj-btn-download') await downloadVideo();
        });
    }

    function onPageChange() {
        const newUrl = window.location.href;
        const changed = (newUrl !== currentPageUrl);
        if (!changed) return;
        currentPageUrl = newUrl;

        destroyPlayer();
        capturedTsUrls = [];
        capturedM3u8Url = null;
        fullM3u8Url = null;
        updateButtonBadges();

        setTimeout(() => {
            autoTriggerVideoPreview();
        }, 800);

        setupHlsHook();
    }

    function setupPageChangeListener() {
        window.addEventListener('hashchange', onPageChange);
        window.addEventListener('popstate', onPageChange);

        const observer = new MutationObserver(() => {
            onPageChange();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        setupApiInterceptor();

        setTimeout(() => {
            createControlPanel();
            setupHlsHook();
            setupPageChangeListener();
            autoTriggerVideoPreview();

            setInterval(() => {
                updateButtonBadges();
            }, 2000);
        }, 1000);
    }

    init();
})();
