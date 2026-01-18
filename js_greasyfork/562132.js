// ==UserScript==
// @name         含羞草
// @version      1.0.1
// @description  含羞草视频解锁观看及下载，无限制播放下载 | 官网：https://khsy.cc
// @author       khsy.cc
// @include           */pages/mianfei*
// @include 		  https://www.*.com/home
// @include 		  */play/video/*
// @include 		  *://*.*.*/*
// @include 		  *://*.*/*
// @include 		  *://*.*.*.*/*
// @include 		  */home/disposition/*
// @include 		  */smallVideo/index/*
// @include		      *://tools.thatwind.com/*
// @match        https://*.jfjd2.com/*
// @match        https://*.95agri.com/*
// @match        https://*/play/video/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @require      https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace    https://khsy.cc
// @connect      khsy.cc
// @connect      *.khsy.cc
// @antifeature  payment
// @downloadURL https://update.greasyfork.org/scripts/562132/%E5%90%AB%E7%BE%9E%E8%8D%89.user.js
// @updateURL https://update.greasyfork.org/scripts/562132/%E5%90%AB%E7%BE%9E%E8%8D%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置常量 ====================
    const CONFIG = {
        SERVER_BASE: 'https://khsy.cc',
        SCRIPT_VERSION: '1.0.1',
        THEME: {
            primary: '#8b5cf6',
            secondary: '#ec4899',
            success: '#4ade80',
            danger: '#ef4444'
        }
    };

    CONFIG.API_BASE = CONFIG.SERVER_BASE + '/api';
    CONFIG.SERVICE_BASE = CONFIG.SERVER_BASE + '/service';

    let encryptedParams = null;
    let currentVideoId = null;

    // ==================== 工具函数 ====================
    const Utils = {
        escapeHtml(str) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return String(str || '').replace(/[&<>"']/g, c => map[c]);
        },

        formatVipExpire(expireAt) {
            if (!expireAt) return '未开通';
            try {
                const exp = new Date(expireAt).getTime();
                const now = Date.now();
                if (exp <= now) return '已过期';
                const days = Math.ceil((exp - now) / (24 * 60 * 60 * 1000));
                if (days <= 0) return '今天到期';
                if (days === 1) return '明天到期';
                if (days <= 7) return `${days}天后到期`;
                return new Date(expireAt).toLocaleDateString('zh-CN');
            } catch {
                return '未知';
            }
        }
    };

    // ==================== 网络请求封装 ====================
    const Http = {
        request(url, opts = {}) {
            return new Promise((resolve) => {
                const method = (opts.method || 'GET').toUpperCase();
                const headers = Object.assign({}, opts.headers || {});
                const data = opts.body || opts.data;

                GM_xmlhttpRequest({
                    method,
                    url,
                    headers,
                    data,
                    timeout: opts.timeout || 20000,
                    onload: (res) => {
                        const ok = res.status >= 200 && res.status < 300;
                        const text = res.responseText || '';
                        resolve({
                            ok,
                            status: res.status,
                            statusText: res.statusText,
                            text: async () => text,
                            json: async () => {
                                try {
                                    return JSON.parse(text);
                                } catch {
                                    return null;
                                }
                            }
                        });
                    },
                    onerror: () => {
                        resolve({
                            ok: false,
                            status: 0,
                            statusText: 'Network Error',
                            text: async () => 'Network Error',
                            json: async () => ({ error: '网络连接失败' })
                        });
                    },
                    ontimeout: () => {
                        resolve({
                            ok: false,
                            status: 0,
                            statusText: 'Timeout',
                            text: async () => 'Timeout',
                            json: async () => ({ error: '请求超时' })
                        });
                    }
                });
            });
        },

        async api(path, opts = {}) {
            const headers = Object.assign({
                'Content-Type': 'application/json'
            }, opts.headers || {});

            if (Auth.token) {
                headers['Authorization'] = 'Bearer ' + Auth.token;
            }

            return await this.request(CONFIG.API_BASE + path, Object.assign({}, opts, { headers }));
        },

        async service(path, opts = {}) {
            const headers = Object.assign({}, opts.headers || {});
            if (Auth.token) {
                headers['Authorization'] = 'Bearer ' + Auth.token;
            }

            return await this.request(CONFIG.SERVICE_BASE + path, Object.assign({}, opts, { headers }));
        }
    };

    // ==================== 认证管理 ====================
    const Auth = {
        get token() {
            try {
                return GM_getValue('auth_token', '') || localStorage.getItem('khsy_token') || '';
            } catch {
                return '';
            }
        },
        set token(v) {
            try {
                GM_setValue('auth_token', v || '');
                localStorage.setItem('khsy_token', v || '');
            } catch {}
        },

        get username() {
            try {
                return localStorage.getItem('khsy_username') || '';
            } catch {
                return '';
            }
        },
        set username(v) {
            try {
                localStorage.setItem('khsy_username', v || '');
            } catch {}
        },

        get vip() {
            try {
                const stored = localStorage.getItem('khsy_vip');
                if (stored === 'true' || (stored && !isNaN(parseInt(stored)) && parseInt(stored) > 0)) {
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        },
        set vip(v) {
            try {
                if (typeof v === 'number') {
                    localStorage.setItem('khsy_vip', String(v));
                } else {
                    localStorage.setItem('khsy_vip', v ? 'true' : 'false');
                }
            } catch {}
        },

        get vipExpireAt() {
            try {
                return localStorage.getItem('khsy_vip_expire') || null;
            } catch {
                return null;
            }
        },
        set vipExpireAt(v) {
            try {
                localStorage.setItem('khsy_vip_expire', v || '');
            } catch {}
        },

        clear() {
            this.token = '';
            this.username = '';
            this.vip = false;
            this.vipExpireAt = null;
        },

        async login(username, password) {
            try {
                const res = await Http.request(CONFIG.API_BASE + '/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (res.ok) {
                    const data = await res.json();
                    this.token = data.accessToken || '';
                    await this.fetchUserInfo();
                    return { success: true };
                } else {
                    let errorMsg = '登录失败';
                    try {
                        const err = await res.json();
                        errorMsg = err.error || err.message || errorMsg;
                    } catch {
                        errorMsg = `登录失败 (${res.status})`;
                    }
                    return { success: false, error: errorMsg };
                }
            } catch (e) {
                return { success: false, error: '网络错误: ' + e.message };
            }
        },

        async fetchUserInfo() {
            try {
                const res = await Http.api('/user/me');

                if (res.ok) {
                    const data = await res.json();

                    this.username = data.username || '';

                    if (data.vip !== undefined) {
                        this.vip = typeof data.vip === 'number' ? data.vip : (data.vip ? 1 : 0);
                    }
                    if (data.vipLevel !== undefined) {
                        this.vip = data.vipLevel;
                    }
                    if (data.vipExpireAt) {
                        this.vipExpireAt = data.vipExpireAt;
                    }

                    return true;
                }
            } catch (e) {
                console.error('❌ 获取用户信息异常:', e);
            }
            return false;
        }
    };

    // ==================== UI组件 ====================
    const UI = {
        toast(text, duration = 2000) {
            try {
                let box = document.getElementById('hxc-toast-box');
                if (!box) {
                    box = document.createElement('div');
                    box.id = 'hxc-toast-box';
                    box.style.cssText = 'position:fixed;right:16px;top:60px;z-index:2147483646;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
                    document.body.appendChild(box);
                }
                const item = document.createElement('div');
                item.style.cssText = `
                    background: rgba(255, 255, 255, 0.95);
                    color: #333;
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 13px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(12px);
                    animation: hxc-slide-in 0.3s ease;
                    pointer-events: auto;
                `;
                item.textContent = String(text || '');
                box.appendChild(item);
                setTimeout(() => {
                    item.style.animation = 'hxc-slide-out 0.3s ease';
                    setTimeout(() => {
                        item.remove();
                        if (box && !box.children.length) box.remove();
                    }, 300);
                }, duration);
            } catch {}
        },

        createModal(title, content, actions = []) {
            const oldOverlays = document.querySelectorAll('.hxc-modal-overlay');
            oldOverlays.forEach(old => old.remove());

            const overlay = document.createElement('div');
            overlay.className = 'hxc-modal-overlay';
            overlay.innerHTML = `
                <div class="hxc-modal">
                    <div class="hxc-modal-header">
                        <div class="hxc-modal-title">${Utils.escapeHtml(title)}</div>
                        <button class="hxc-modal-close">×</button>
                    </div>
                    <div class="hxc-modal-body">${content}</div>
                    ${actions.length ? `<div class="hxc-modal-footer"></div>` : ''}
                </div>
            `;

            if (actions.length) {
                const footer = overlay.querySelector('.hxc-modal-footer');
                actions.forEach(action => {
                    const btn = document.createElement('button');
                    btn.className = action.primary ? 'hxc-btn hxc-btn-primary' : 'hxc-btn';
                    btn.textContent = action.text;
                    btn.onclick = () => {
                        if (action.onClick) action.onClick();
                        if (!action.keepOpen) overlay.remove();
                    };
                    footer.appendChild(btn);
                });
            }

            const closeBtn = overlay.querySelector('.hxc-modal-close');
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                overlay.remove();
            };

            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.remove();
            };

            const modalBox = overlay.querySelector('.hxc-modal');
            if (modalBox) {
                modalBox.onclick = (e) => e.stopPropagation();
            }

            // 🔥 重写remove方法，触发remove事件
            const originalRemove = overlay.remove.bind(overlay);
            overlay.remove = function() {
                overlay.dispatchEvent(new Event('remove'));
                originalRemove();
            };

            document.body.appendChild(overlay);
            return overlay;
        }
    };

    // ==================== 样式注入 ====================
    GM_addStyle(`
        @keyframes hxc-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes hxc-slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes hxc-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @keyframes hxc-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes hxc-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes hxc-modal-in {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .hxc-float-panel {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2147483645;
            display: flex;
            flex-direction: column;
            gap: 0;
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 24px;
            padding: 8px 0;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(20px);
            transition: all 0.3s ease;
        }

        .hxc-float-panel.minimized {
            padding: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            border: 2px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
        }

        .hxc-float-panel.minimized .hxc-float-btn:not(.hxc-toggle-btn) {
            display: none;
        }

        .hxc-float-panel.minimized .hxc-toggle-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: #fff !important;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: bold;
        }

        .hxc-float-panel.minimized .hxc-toggle-btn svg {
            display: none;
        }

        .hxc-float-panel.minimized .hxc-toggle-btn::before {
            content: '☰';
            display: block;
            line-height: 1;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            margin-left: -2px;
        }

        .hxc-float-panel:not(.minimized) .hxc-toggle-btn::before {
            display: none;
        }

        .hxc-float-btn {
            background: transparent;
            border: none;
            width: 48px;
            height: 48px;
            padding: 0;
            color: rgba(0, 0, 0, 0.7);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .hxc-float-btn:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        .hxc-float-btn svg {
            width: 20px;
            height: 20px;
            opacity: 1;
            flex-shrink: 0;
            stroke-width: 2.5;
        }

        .hxc-toggle-btn {
            color: rgba(0, 0, 0, 0.5) !important;
        }

        .hxc-ready-badge {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 10px;
            height: 10px;
            background: #10b981;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
            animation: hxc-pulse 2s infinite;
            z-index: 10;
        }

        .hxc-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            z-index: 2147483646;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: hxc-fade-in 0.2s ease;
        }

        .hxc-modal {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            max-width: 90vw;
            max-height: 85vh;
            width: 500px;
            display: flex;
            flex-direction: column;
            animation: hxc-modal-in 0.3s ease;
            backdrop-filter: blur(20px);
        }

        .hxc-modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .hxc-modal-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .hxc-modal-close {
            background: none;
            border: none;
            color: rgba(0, 0, 0, 0.5);
            font-size: 28px;
            cursor: pointer;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        .hxc-modal-close:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        .hxc-modal-body {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
            color: #333;
        }

        .hxc-modal-footer {
            padding: 16px 24px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        .hxc-btn {
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            font-size: 14px;
            cursor: pointer;
        }

        .hxc-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 1);
        }

        .hxc-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .hxc-btn-primary {
            background: #10b981;
            color: #fff;
            border-color: #10b981;
        }

        .hxc-btn-primary:hover:not(:disabled) {
            background: #059669;
            border-color: #059669;
        }

        .hxc-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 10px;
            color: #333;
            font-size: 14px;
        }

        .hxc-input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            background: #fff;
        }

        .hxc-input::placeholder {
            color: rgba(0, 0, 0, 0.4);
        }

        .hxc-vip-tag {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            color: #fff;
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }

        .hxc-loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-top-color: #10b981;
            border-radius: 50%;
            animation: hxc-spin 0.8s linear infinite;
        }

        .hxc-video-container {
            width: 100%;
            max-width: 1200px;
        }

        .hxc-video {
            width: 100%;
            aspect-ratio: 16/9;
            background: black;
            border-radius: 12px;
        }
    `);

    // ==================== 拦截加密参数 ====================
    ajaxHooker.protect();
    ajaxHooker.filter([
        {type: 'xhr', url: '/videos/getInfo', method: 'POST', async: true}
    ]);

    ajaxHooker.hook(request => {
        if (request.url.indexOf('/videos/getInfo') > -1) {
            try {
                const data = JSON.parse(request.data);
                if (data.endata && data.ents) {
                    encryptedParams = { endata: data.endata, ents: data.ents };
                }
            } catch (e) {
                console.error('❌ 解析请求数据失败:', e);
            }
        }
    });

    // ==================== 视频解析器 ====================
    const VideoResolver = {
        resolving: false,
        resolveCache: new Map(), // 缓存解析结果

        getVideoId() {
            try {
                const match = location.href.match(/\/video\/(\d+)(?:\/\d+)?/);
                if (match) {
                    return match[1];
                }
            } catch (e) {
                console.error('❌ 提取视频ID失败:', e);
            }
            return null;
        },

        // 检查缓存
        getCachedUrl(videoId) {
            const cached = this.resolveCache.get(String(videoId));
            if (cached && cached.url) {
                const age = Date.now() - cached.time;
                // 缓存30分钟有效
                if (age < 30 * 60 * 1000) {
                    return cached.url;
                } else {
                    this.resolveCache.delete(String(videoId));
                }
            }
            return null;
        },

        // 保存到缓存
        setCachedUrl(videoId, url) {
            this.resolveCache.set(String(videoId), {
                url: url,
                time: Date.now()
            });
        },

        async resolveFromServer(videoId) {
            if (!Auth.token) {
                FloatPanel.showLoginModal();
                return null;
            }

            if (!Auth.vip) {
                FloatPanel.showVipRequiredModal();
                return null;
            }

            if (!encryptedParams) {
                UI.toast('缺少加密参数，请刷新页面重试');
                return null;
            }

            try {
                const res = await Http.service('/hanxiucao/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        videoId: videoId,
                        pageUrl: window.location.href,
                        encryptedParams: encryptedParams
                    })
                });

                if (res.ok) {
                    const data = await res.json();

                    if (data.success && data.url) {
                        let url = data.url;

                        // 客户端修复URL格式
                        if (url.includes('.m3u8&')) {
                            url = url.replace(/\.m3u8&/g, '.m3u8?');
                        }

                        return url;
                    } else {
                        UI.toast('解析失败: ' + (data.error || '未知错误'));
                        return null;
                    }
                } else if (res.status === 401) {
                    UI.toast('登录已过期，请重新登录');
                    FloatPanel.showLoginModal();
                    return null;
                } else if (res.status === 403) {
                    UI.toast('需要VIP会员');
                    FloatPanel.showVipRequiredModal();
                    return null;
                } else {
                    const errorData = await res.json();
                    UI.toast(`解析失败: ${errorData.error || '服务器错误'}`);
                    return null;
                }
            } catch (e) {
                console.error('❌ 解析异常:', e);
                UI.toast('网络错误: ' + e.message);
                return null;
            }
        }
    };

    // ==================== 播放器模块 ====================
    const Player = {
        currentPlayer: null,
        hls: null,

        create(videoUrl, container) {
            try {
                this.destroy();

                const tip = document.createElement('div');
                tip.style.cssText = 'width:100%;margin-bottom:12px;padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;text-align:center;color:#666;font-size:12px;';
                tip.innerHTML = '💡 播放速度取决于您当前的网速';
                container.appendChild(tip);

                const video = document.createElement('video');
                video.id = 'hxc-player';
                video.controls = true;
                video.className = 'hxc-video';
                container.appendChild(video);
                this.currentPlayer = video;

                this.loadVideo(videoUrl, video);
            } catch (e) {
                UI.toast('播放器初始化失败: ' + e.message);
            }
        },

        loadVideo(url, video) {
            if (Hls.isSupported()) {
                this.hls = new Hls({
                    enableWorker: true
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch(data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                this.hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                this.hls.recoverMediaError();
                                break;
                            default:
                                UI.toast('播放失败: ' + data.type);
                                this.hls.destroy();
                                break;
                        }
                    }
                });

                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {
                        UI.toast('自动播放失败，请手动点击播放');
                    });
                });

                this.hls.loadSource(url);
                this.hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(() => {
                        UI.toast('自动播放失败，请手动点击播放');
                    });
                }, { once: true });
            }
        },

        destroy() {
            if (this.hls) {
                this.hls.destroy();
                this.hls = null;
            }
            if (this.currentPlayer) {
                this.currentPlayer.remove();
                this.currentPlayer = null;
            }
        }
    };

    // ==================== 悬浮控制面板 ====================
    const FloatPanel = {
        panel: null,
        loginModalOpen: false,
        videoModalOpen: false,

        create() {
            if (this.panel) return;

            const panel = document.createElement('div');
            panel.className = 'hxc-float-panel';
            panel.id = 'hxc-panel';

            const isMinimized = localStorage.getItem('hxc_panel_minimized') === 'true';
            if (isMinimized) {
                panel.classList.add('minimized');
            }

            panel.innerHTML = `
                <button class="hxc-float-btn" id="hxc-btn-account" title="账户中心">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/>
                    </svg>
                </button>
                <button class="hxc-float-btn" id="hxc-btn-resolve" title="解析视频">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                </button>
                <button class="hxc-float-btn" id="hxc-btn-download" title="下载视频">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </button>
                <button class="hxc-float-btn hxc-toggle-btn" id="hxc-btn-toggle" title="${isMinimized ? '展开面板' : '收起面板'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                        ${isMinimized ? '' : '<polyline points="9 18 15 12 9 6"/>'}
                    </svg>
                </button>
            `;

            document.body.appendChild(panel);
            this.panel = panel;

            document.getElementById('hxc-btn-toggle').addEventListener('click', () => this.toggleMinimize());
            document.getElementById('hxc-btn-account').addEventListener('click', () => this.showLoginModal());
            document.getElementById('hxc-btn-resolve').addEventListener('click', () => this.resolveVideo());
            document.getElementById('hxc-btn-download').addEventListener('click', () => this.showDownloadModal());

            this.updateAccountButton();
        },

        toggleMinimize() {
            const panel = this.panel;
            if (!panel) return;

            const isMinimized = panel.classList.toggle('minimized');
            localStorage.setItem('hxc_panel_minimized', isMinimized);

            const btn = document.getElementById('hxc-btn-toggle');
            btn.title = isMinimized ? '展开面板' : '收起面板';
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.innerHTML = isMinimized ? '' : '<polyline points="9 18 15 12 9 6"/>';
            }
        },

        updateAccountButton() {
            // 账户按钮状态更新逻辑
        },

        showLoginModal() {
            if (this.loginModalOpen) return;
            this.loginModalOpen = true;

            const isLoggedIn = !!Auth.username;
            const content = isLoggedIn ? this.getAccountContent() : this.getLoginContent();

            const modal = UI.createModal(
                isLoggedIn ? '账户中心' : '登录账户',
                content,
                []
            );

            const cleanup = () => {
                this.loginModalOpen = false;
            };

            modal.addEventListener('remove', cleanup);

            if (!isLoggedIn) {
                setTimeout(() => {
                    const loginBtn = document.getElementById('hxc-login-btn');
                    const errorBox = document.getElementById('hxc-login-error');

                    if (loginBtn) {
                        loginBtn.onclick = async () => {
                            const username = document.getElementById('hxc-username').value.trim();
                            const password = document.getElementById('hxc-password').value.trim();

                            if (!username || !password) {
                                if (errorBox) {
                                    errorBox.textContent = '请填写用户名和密码';
                                    errorBox.style.display = 'block';
                                }
                                return;
                            }

                            loginBtn.textContent = '登录中...';
                            loginBtn.disabled = true;

                            const result = await Auth.login(username, password);

                            if (result.success) {
                                if (errorBox) {
                                    errorBox.style.background = 'rgba(34,197,94,0.1)';
                                    errorBox.style.borderColor = 'rgba(34,197,94,0.3)';
                                    errorBox.style.color = '#86efac';
                                    errorBox.textContent = '登录成功！正在刷新页面...';
                                    errorBox.style.display = 'block';
                                }
                                setTimeout(() => {
                                    modal.remove();
                                    this.updateAccountButton();
                                    // 🔥 登录成功后刷新页面
                                    window.location.reload();
                                }, 800);
                            } else {
                                if (errorBox) {
                                    errorBox.textContent = result.error || '登录失败';
                                    errorBox.style.display = 'block';
                                }
                                loginBtn.textContent = '登录';
                                loginBtn.disabled = false;
                            }
                        };
                    }

                    const registerLink = document.getElementById('hxc-register-link');
                    if (registerLink) {
                        registerLink.onclick = () => {
                            window.open(CONFIG.SERVER_BASE, '_blank');
                        };
                    }
                }, 100);
            } else {
                setTimeout(() => {
                    const logoutBtn = document.getElementById('hxc-logout-btn');
                    if (logoutBtn) {
                        logoutBtn.onclick = () => {
                            if (confirm('确定要退出登录吗？')) {
                                Auth.clear();
                                UI.toast('已退出登录，正在刷新页面...');
                                modal.remove();
                                this.updateAccountButton();
                                // 🔥 退出登录后刷新页面
                                setTimeout(() => {
                                    window.location.reload();
                                }, 500);
                            }
                        };
                    }
                }, 100);
            }
        },

        getLoginContent() {
            return `
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div style="padding:12px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:8px;text-align:center;">
                        <div style="font-size:13px;color:#f59e0b;line-height:1.6;">
                            💡 请使用 <strong>khsy.cc</strong> 的账号登录<br>
                            登录后即可解析和播放视频<br>
                            只有少数加密视频不可播放
                        </div>
                    </div>
                    <div id="hxc-login-error" style="display:none;padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;color:#ef4444;font-size:13px;"></div>
                    <div>
                        <label style="display:block;margin-bottom:6px;color:#333;font-size:13px;">用户名</label>
                        <input type="text" id="hxc-username" class="hxc-input" placeholder="请输入用户名">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:6px;color:#333;font-size:13px;">密码</label>
                        <input type="password" id="hxc-password" class="hxc-input" placeholder="请输入密码">
                    </div>
                    <button class="hxc-btn hxc-btn-primary" id="hxc-login-btn">登录</button>
                    <div style="text-align:center;font-size:12px;color:#666;">
                        还没有账户？<a href="javascript:void(0)" id="hxc-register-link" style="color:#10b981;text-decoration:underline;">前往注册</a>
                    </div>
                </div>
            `;
        },

        getAccountContent() {
            const vipStatus = Auth.vip ? `
                <div style="padding:16px;background:linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1));border:1px solid rgba(251,191,36,0.3);border-radius:12px;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <span class="hxc-vip-tag">VIP会员</span>
                        <span style="color:#333;font-size:13px;">尊享特权</span>
                    </div>
                    <div style="font-size:12px;color:#666;">
                        到期时间：${Utils.formatVipExpire(Auth.vipExpireAt)}
                    </div>
                </div>
            ` : `
                <div style="padding:16px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;text-align:center;">
                    <div style="font-size:13px;color:#333;margin-bottom:8px;">您还不是VIP会员</div>
                    <a href="${CONFIG.SERVER_BASE}" target="_blank" class="hxc-btn hxc-btn-primary" style="display:inline-block;text-decoration:none;">立即开通VIP</a>
                </div>
            `;

            return `
                <div style="display:flex;flex-direction:column;gap:20px;">
                    <div>
                        <div style="font-size:13px;color:#666;margin-bottom:4px;">用户名</div>
                        <div style="font-size:16px;color:#333;font-weight:600;">${Utils.escapeHtml(Auth.username)}</div>
                    </div>
                    ${vipStatus}
                    <div style="display:flex;gap:8px;">
                        <a href="${CONFIG.SERVER_BASE}" target="_blank" class="hxc-btn" style="flex:1;text-align:center;text-decoration:none;">访问官网</a>
                        <button class="hxc-btn" id="hxc-logout-btn" style="flex:1;">退出登录</button>
                    </div>
                </div>
            `;
        },

        showVipRequiredModal() {
            const content = `
                <div style="text-align:center;padding:20px;">
                    <div style="margin-bottom:16px;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:64px;height:64px;margin:0 auto;color:#fbbf24;">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <div style="font-size:18px;font-weight:600;color:#333;margin-bottom:12px;">您还不是VIP会员</div>
                    <div style="font-size:14px;color:#666;margin-bottom:24px;line-height:1.6;">
                        观看完整视频需要开通VIP会员<br>
                        立即开通，畅享所有视频内容
                    </div>
                    <button class="hxc-btn hxc-btn-primary" id="hxc-goto-vip" style="width:100%;padding:14px;">
                        前往开通VIP
                    </button>
                </div>
            `;

            const modal = UI.createModal('VIP会员', content, []);

            setTimeout(() => {
                const gotoBtn = document.getElementById('hxc-goto-vip');
                if (gotoBtn) {
                    gotoBtn.onclick = () => {
                        window.open(CONFIG.SERVER_BASE, '_blank');
                        modal.remove();
                    };
                }
            }, 100);
        },

        async resolveVideo(autoResolve = false) {
            if (VideoResolver.resolving) {
                return null;
            }

            const videoId = VideoResolver.getVideoId();
            if (!videoId) {
                if (!autoResolve) {
                    UI.toast('请在视频详情页使用此功能');
                }
                return null;
            }

            // 检查缓存
            const cachedUrl = VideoResolver.getCachedUrl(videoId);
            if (cachedUrl) {
                if (!autoResolve) {
                    this.showVideoModal(cachedUrl);
                }
                this.showReadyBadge();
                return cachedUrl;
            }

            VideoResolver.resolving = true;

            if (!Auth.token) {
                VideoResolver.resolving = false;
                if (!autoResolve) {
                    UI.toast('请先登录 khsy.cc 账号', 2000);
                    this.showLoginModal();
                }
                return null;
            }

            // 验证Token有效性
            const isValid = await Auth.fetchUserInfo();
            if (!isValid) {
                Auth.clear();
                VideoResolver.resolving = false;
                if (!autoResolve) {
                    UI.toast('登录已过期，请重新登录', 3000);
                    this.showLoginModal();
                }
                this.updateAccountButton();
                return null;
            }

            if (!Auth.vip) {
                VideoResolver.resolving = false;
                if (!autoResolve) {
                    this.showVipRequiredModal();
                }
                return null;
            }

            try {
                if (!autoResolve) {
                    UI.toast('正在解析视频...', 2000);
                }

                const url = await VideoResolver.resolveFromServer(videoId);

                if (url) {
                    // 保存到缓存
                    VideoResolver.setCachedUrl(videoId, url);

                    if (!autoResolve) {
                        this.showVideoModal(url);
                        UI.toast('✅ 解析成功！', 1500);
                    }

                    this.showReadyBadge();
                    return url;
                } else {
                    return null;
                }
            } catch (e) {
                console.error('❌ 解析异常:', e);
                if (!autoResolve) {
                    UI.toast('解析失败: ' + e.message);
                }
                return null;
            } finally {
                setTimeout(() => {
                    VideoResolver.resolving = false;
                }, 1000);
            }
        },

        showReadyBadge() {
            const resolveBtn = document.getElementById('hxc-btn-resolve');
            if (resolveBtn && !resolveBtn.querySelector('.hxc-ready-badge')) {
                const badge = document.createElement('div');
                badge.className = 'hxc-ready-badge';
                resolveBtn.appendChild(badge);
            }
        },

        hideReadyBadge() {
            const resolveBtn = document.getElementById('hxc-btn-resolve');
            if (resolveBtn) {
                const badge = resolveBtn.querySelector('.hxc-ready-badge');
                if (badge) {
                    badge.remove();
                }
            }
        },

        showVideoModal(url) {
            if (this.videoModalOpen) return;
            this.videoModalOpen = true;

            const content = '<div id="hxc-video-container" style="width:100%;max-height:calc(85vh - 200px);overflow-y:auto;"></div>';

            const modal = UI.createModal(
                '视频播放',
                content,
                [
                    { text: '下载视频', onClick: () => this.downloadVideo(url) },
                    { text: '关闭', onClick: () => modal.remove() }
                ]
            );

            modal.addEventListener('remove', () => {
                this.videoModalOpen = false;
                Player.destroy();
            });

            requestAnimationFrame(() => {
                const container = document.getElementById('hxc-video-container');
                if (container && !container.querySelector('#hxc-player')) {
                    Player.create(url, container);
                }
            });
        },

        showDownloadModal() {
            const videoId = VideoResolver.getVideoId();
            if (!videoId) {
                UI.toast('请在视频详情页使用此功能');
                return;
            }

            // 🔥 检查是否已解析
            const cachedUrl = VideoResolver.getCachedUrl(videoId);
            if (!cachedUrl) {
                UI.toast('请先解析视频');
                return;
            }

            // 直接调用下载功能
            this.downloadVideo(cachedUrl);
        },

        downloadVideo(url) {
            const content = `
                <div style="text-align:center;padding:20px;">
                    <div style="margin-bottom:16px;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:48px;height:48px;margin:0 auto;color:#10b981;">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </div>
                    <div style="font-size:14px;color:#333;margin-bottom:16px;font-weight:600;">视频下载方式</div>

                    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
                        <button class="hxc-btn hxc-btn-primary" id="hxc-dl-play" style="width:100%;">▶️ 在新窗口播放</button>
                        <button class="hxc-btn" id="hxc-dl-copy" style="width:100%;">📋 复制视频链接</button>
                    </div>

                    <div style="padding:12px;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.3);border-radius:8px;text-align:left;">
                        <div style="font-size:12px;color:#f59e0b;line-height:1.8;">
                            <strong>💡 推荐下载方法：</strong><br><br>

                            <strong>方法1：浏览器插件（推荐）</strong><br>
                            • Chrome: Video DownloadHelper<br>
                            • Edge: Stream Video Downloader<br>
                            • Firefox: Video DownloadHelper<br>
                            安装后，播放视频时点击插件图标即可下载<br><br>

                            <strong>方法2：IDM下载器</strong><br>
                            1. 点击"在新窗口播放"<br>
                            2. IDM会自动检测并弹出下载窗口<br>
                            3. 选择保存位置开始下载<br><br>

                            <strong>方法3：录屏软件</strong><br>
                            使用OBS Studio或其他录屏软件录制播放画面<br><br>

                            <strong>⚠️ 注意：</strong><br>
                            视频链接包含时效性签名，M3U8下载器可能无法使用
                        </div>
                    </div>
                </div>
            `;

            const modal = UI.createModal('下载视频', content, []);

            setTimeout(() => {
                const playBtn = document.getElementById('hxc-dl-play');
                const copyBtn = document.getElementById('hxc-dl-copy');

                if (playBtn) {
                    playBtn.onclick = () => {
                        window.open(url, '_blank');
                        UI.toast('✅ 已在新窗口打开，可使用IDM或插件下载');
                    };
                }

                if (copyBtn) {
                    copyBtn.onclick = () => {
                        navigator.clipboard.writeText(url).then(() => {
                            UI.toast('✅ 链接已复制到剪贴板');
                            copyBtn.textContent = '✅ 已复制';
                            copyBtn.disabled = true;
                            setTimeout(() => {
                                copyBtn.textContent = '📋 复制视频链接';
                                copyBtn.disabled = false;
                            }, 2000);
                        }).catch(() => {
                            // 创建临时输入框复制
                            const textarea = document.createElement('textarea');
                            textarea.value = url;
                            textarea.style.position = 'fixed';
                            textarea.style.opacity = '0';
                            document.body.appendChild(textarea);
                            textarea.select();
                            try {
                                document.execCommand('copy');
                                UI.toast('✅ 链接已复制到剪贴板');
                            } catch (e) {
                                UI.toast('❌ 复制失败，请手动复制');
                            }
                            document.body.removeChild(textarea);
                        });
                    };
                }
            }, 100);
        }
    };

    // ==================== 移除VIP遮罩 ====================
    function removeVipMask() {
        if (location.href.match("/play/video/")) {
            let ads = document.querySelector("div.vip-mask");
            if (ads) ads.style.display = "none";
            ads = document.querySelector("div.overflow-hidden");
            if (ads) ads.style.display = "none";
        }
    }

    // ==================== 初始化 ====================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startUI);
        } else {
            startUI();
        }
    }

    function startUI() {
        try {
            FloatPanel.create();

            if (Auth.token) {
                Auth.fetchUserInfo().then((success) => {
                    if (success) {
                        FloatPanel.updateAccountButton();

                        // 自动解析视频（如果在视频详情页）
                        const videoId = VideoResolver.getVideoId();
                        if (videoId && Auth.vip) {
                            setTimeout(() => {
                                FloatPanel.resolveVideo(true);
                            }, 1500);
                        }
                    } else {
                        Auth.clear();
                        FloatPanel.updateAccountButton();
                        UI.toast('登录已过期，请重新登录', 3000);
                    }
                });
            }

            setInterval(removeVipMask, 1000);
        } catch (e) {
            console.error('❌ UI初始化失败:', e);
        }
    }

    // 启动脚本
    init();

    // 定时同步VIP状态
    setInterval(() => {
        if (Auth.token) {
            Auth.fetchUserInfo().catch(() => {});
        }
    }, 30000);

    // ==================== URL变化监控（隐藏绿色角标） ====================
    let lastUrl = window.location.href;
    const checkUrlChange = () => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;

            const isVideoPage = currentUrl.match(/\/video\/\d+/);

            if (!isVideoPage) {
                FloatPanel.hideReadyBadge();
            } else {
                const videoId = VideoResolver.getVideoId();
                if (videoId) {
                    const cachedUrl = VideoResolver.getCachedUrl(videoId);
                    if (cachedUrl) {
                        FloatPanel.showReadyBadge();
                    } else if (Auth.token && Auth.vip) {
                        setTimeout(() => {
                            FloatPanel.resolveVideo(true);
                        }, 1500);
                    }
                }
            }
        }
    };

    // 监听URL变化
    window.addEventListener('popstate', checkUrlChange);
    window.addEventListener('hashchange', checkUrlChange);

    // 劫持pushState和replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        checkUrlChange();
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        checkUrlChange();
    };

})();