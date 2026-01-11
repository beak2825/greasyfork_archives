// ==UserScript==
// @name         海角社区
// @version      1.0.6
// @description  海角社区视频解锁观看及下载，无限制播放下载 | 官网：https://khsy.cc
// @author       khsy.cc
// @include      *://hj*.*/*
// @include      *://h*.top/*
// @include      *://*.h*.top/*
// @include      *://h*.xyz/*
// @include      *://*.h*.xyz/*
// @include      *://*haijiao.*/*
// @include      *://*.*haijiao.*/*
// @match        https://haijiao.com/*
// @match        https://*.haijiao.com/*
// @match        https://hj251101e0b.top/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.8/hls.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace    https://khsy.cc
// @connect      khsy.cc
// @connect      *.khsy.cc
// @connect      greasyfork.org
// @connect      *.greasyfork.org
// @connect      sleazyfork.org
// @connect      *.sleazyfork.org
// @connect      update.greasyfork.org
// @antifeature       payment
// @downloadURL https://update.greasyfork.org/scripts/557267/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557267/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置常量 ====================

    const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const IS_DESKTOP = !IS_MOBILE;

    const CONFIG = {
        SERVER_BASE: 'https://khsy.cc',
        SCRIPT_VERSION: '1.0.6',
        SCRIPT_ID: 557267,
        UPDATE_URL: 'https://www.tampermonkey.net/script_installation.php#url=https://update.sleazyfork.org/scripts/557267/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA.user.js',
        UPDATE_CHECK_INTERVAL: 12 * 60 * 60 * 1000,
        RESOLVE_COOLDOWN: 15000,
        THEME: {
            primary: '#8b5cf6',
            secondary: '#ec4899',
            accent: '#c4b5fd',
            success: '#4ade80',
            danger: '#ef4444',
            dark: '#0d0817',
            cardBg: 'rgba(26, 15, 46, 0.95)',
            modalBg: 'rgba(13, 8, 23, 0.98)',
            gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))',
            glow: 'rgba(236, 72, 153, 0.25)'
        }
    };

    CONFIG.API_BASE = CONFIG.SERVER_BASE + '/api';
    CONFIG.SERVICE_BASE = CONFIG.SERVER_BASE + '/service';

    // ==================== 版本更新检测 ====================
    const UpdateChecker = {
        latestVersion: null,
        hasUpdate: false,

        // 检查更新
        async checkUpdate() {
            try {
                // 尝试多个API端点
                const apiUrls = [
                    `https://greasyfork.org/zh-CN/scripts/${CONFIG.SCRIPT_ID}.json`,
                    `https://greasyfork.org/scripts/${CONFIG.SCRIPT_ID}.json`,
                    `https://sleazyfork.org/zh-CN/scripts/${CONFIG.SCRIPT_ID}.json`
                ];

                for (const apiUrl of apiUrls) {
                    try {
                        const res = await Http.request(apiUrl, {
                            method: 'GET',
                            timeout: 10000
                        });

                        if (res.ok) {
                            const data = await res.json();

                            // GreasyFork API返回的版本号在 version 字段中
                            this.latestVersion = data.version || null;

                            if (this.latestVersion && Utils.compareVersion(this.latestVersion, CONFIG.SCRIPT_VERSION) > 0) {
                                this.hasUpdate = true;
                                // 显示更新角标
                                this.showUpdateBadge();
                                return true;
                            } else if (this.latestVersion) {
                                // 已是最新版本
                                this.hasUpdate = false;
                                return false;
                            }
                        }
                    } catch (e) {
                        // 尝试下一个API
                        continue;
                    }
                }

                // 所有API都失败了
                this.latestVersion = null;
            } catch (e) {
                // 请求失败，设置为null表示检测失败
                this.latestVersion = null;
            }
            return false;
        },

        // 显示更新角标
        showUpdateBadge() {
            const updateBtn = document.getElementById('khsy-btn-update');
            if (updateBtn) {
                let badge = updateBtn.querySelector('.khsy-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'khsy-badge';
                    updateBtn.appendChild(badge);
                }
            }
        },

        // 隐藏更新角标
        hideUpdateBadge() {
            const updateBtn = document.getElementById('khsy-btn-update');
            if (updateBtn) {
                const badge = updateBtn.querySelector('.khsy-badge');
                if (badge) {
                    badge.remove();
                }
            }
        }
    };

    // ==================== 工具函数 ====================
    const Utils = {
        // 版本比较
        compareVersion(a, b) {
            const pa = String(a).split('.').map(x => parseInt(x, 10) || 0);
            const pb = String(b).split('.').map(x => parseInt(x, 10) || 0);
            const len = Math.max(pa.length, pb.length);
            for (let i = 0; i < len; i++) {
                const x = pa[i] || 0, y = pb[i] || 0;
                if (x > y) return 1;
                if (x < y) return -1;
            }
            return 0;
        },

        // HTML转义
        escapeHtml(str) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return String(str || '').replace(/[&<>"']/g, c => map[c]);
        },

        // 节流函数
        throttle(fn, wait) {
            let last = 0, tid = null;
            return function(...args) {
                const now = Date.now();
                const remain = last + wait - now;
                if (remain <= 0) {
                    last = now;
                    fn.apply(this, args);
                } else if (!tid) {
                    tid = setTimeout(() => {
                        tid = null;
                        last = Date.now();
                        fn.apply(this, args);
                    }, remain);
                }
            };
        },

        // 格式化日期
        formatDate(date) {
            try {
                return new Date(date).toLocaleString('zh-CN', {
                    hour12: false,
                    timeZone: 'Asia/Shanghai'
                });
            } catch {
                return '';
            }
        },

        // 格式化VIP到期时间
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
        // GM_xmlhttpRequest封装
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
                    onerror: (err) => {
                        resolve({
                            ok: false,
                            status: 0,
                            statusText: 'Network Error',
                            text: async () => 'Network Error',
                            json: async () => ({ error: '网络连接失败，请检查网络' })
                        });
                    },
                    ontimeout: () => {
                        resolve({
                            ok: false,
                            status: 0,
                            statusText: 'Timeout',
                            text: async () => 'Timeout',
                            json: async () => ({ error: '请求超时，请重试' })
                        });
                    }
                });
            });
        },

        // API请求（带认证）
        async api(path, opts = {}) {
            const headers = Object.assign({
                'Content-Type': 'application/json'
            }, opts.headers || {});

            if (Auth.token) {
                headers['Authorization'] = 'Bearer ' + Auth.token;
            }

            let res = await this.request(CONFIG.API_BASE + path, Object.assign({}, opts, { headers }));

            // Token过期自动刷新
            if (res.status === 401 && Auth.refreshToken) {
                const refreshed = await Auth.tryRefresh();
                if (refreshed) {
                    headers['Authorization'] = 'Bearer ' + Auth.token;
                    res = await this.request(CONFIG.API_BASE + path, Object.assign({}, opts, { headers }));
                }
            }

            return res;
        },

        // Service请求（视频解析）
        async service(path, opts = {}) {
            const headers = Object.assign({}, opts.headers || {});
            if (Auth.token) {
                headers['Authorization'] = 'Bearer ' + Auth.token;
            }

            let res = await this.request(CONFIG.SERVICE_BASE + path, Object.assign({}, opts, { headers }));

            if (res.status === 401 && Auth.refreshToken) {
                const refreshed = await Auth.tryRefresh();
                if (refreshed) {
                    headers['Authorization'] = 'Bearer ' + Auth.token;
                    res = await this.request(CONFIG.SERVICE_BASE + path, Object.assign({}, opts, { headers }));
                }
            }

            return res;
        }
    };

    // ==================== 认证管理 ====================
    const Auth = {
        get token() {
            try {
                return localStorage.getItem('khsy_token') || '';
            } catch {
                return '';
            }
        },
        set token(v) {
            try {
                localStorage.setItem('khsy_token', v || '');
            } catch {}
        },

        get refreshToken() {
            try {
                return localStorage.getItem('khsy_refresh') || '';
            } catch {
                return '';
            }
        },
        set refreshToken(v) {
            try {
                localStorage.setItem('khsy_refresh', v || '');
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


        get vipLevel() {
            try {
                const stored = localStorage.getItem('khsy_vip');
                if (stored && !isNaN(parseInt(stored))) return parseInt(stored);
                if (stored === 'true') return 1;
                return 0;
            } catch {
                return 0;
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

        // 清除所有认证信息
        clear() {
            this.token = '';
            this.refreshToken = '';
            this.username = '';
            this.vip = false;
            this.vipExpireAt = null;
        },

        // 刷新Token
        async tryRefresh() {
            if (!this.refreshToken) return false;
            try {
                const res = await Http.request(CONFIG.API_BASE + '/auth/refresh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken: this.refreshToken })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.accessToken) {
                        this.token = data.accessToken;
                        return true;
                    }
                }
            } catch {}
            return false;
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
                    this.refreshToken = data.refreshToken || '';


                    await this.fetchUserInfo();
                    return { success: true };
                } else {
                    let errorMsg = '登录失败';
                    try {
                        const err = await res.json();
                        errorMsg = err.error || err.message || errorMsg;
                    } catch (jsonErr) {
                        errorMsg = `登录失败 (${res.status})`;
                    }
                    return { success: false, error: errorMsg };
                }
            } catch (e) {
                let errMsg = '网络错误';
                if (e.message) {
                    errMsg += `: ${e.message}`;
                }
                errMsg += `\n\n服务器: ${CONFIG.SERVER_BASE}`;
                errMsg += '\n\n请确认：';
                errMsg += '\n1. 服务器是否正常运行';
                errMsg += '\n2. 网络连接是否正常';
                return { success: false, error: errMsg };
            }
        },


        async fetchUserInfo() {
            try {
                const res = await Http.api('/user/me');
                if (res.ok) {
                    const data = await res.json();
                    this.username = data.username || '';


                    if (data.vip !== undefined) {

                        if (typeof data.vip === 'number') {
                            this.vip = data.vip;
                        } else {

                            this.vip = data.vip ? 1 : 0;
                        }
                    }
                    if (data.vipLevel !== undefined) {
                        this.vip = data.vipLevel;
                    }
                    if (data.vipExpireAt) {
                        this.vipExpireAt = data.vipExpireAt;
                    }

                    return true;
                }
            } catch {}
            return false;
        }
    };

    // ==================== UI组件 ====================
    const UI = {
        // Toast提示
        toast(text, duration = 2000) {
            try {
                let box = document.getElementById('khsy-toast-box');
                if (!box) {
                    box = document.createElement('div');
                    box.id = 'khsy-toast-box';
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
                    animation: khsy-slide-in 0.3s ease;
                    pointer-events: auto;
                `;
                item.textContent = String(text || '');
                box.appendChild(item);
                setTimeout(() => {
                    item.style.animation = 'khsy-slide-out 0.3s ease';
                    setTimeout(() => {
                        item.remove();
                        if (box && !box.children.length) box.remove();
                    }, 300);
                }, duration);
            } catch {}
        },

        // 创建模态框
        createModal(title, content, actions = []) {
            // 🔥 先移除所有旧的模态框
            const oldOverlays = document.querySelectorAll('.khsy-modal-overlay');
            oldOverlays.forEach(old => {
                old.remove();
            });

            const overlay = document.createElement('div');
            overlay.className = 'khsy-modal-overlay';
            overlay.innerHTML = `
                <div class="khsy-modal">
                    <div class="khsy-modal-header">
                        <div class="khsy-modal-title">${Utils.escapeHtml(title)}</div>
                        <button class="khsy-modal-close">×</button>
                    </div>
                    <div class="khsy-modal-body">${content}</div>
                    ${actions.length ? `<div class="khsy-modal-footer"></div>` : ''}
                </div>
            `;

            // 添加动作按钮
            if (actions.length) {
                const footer = overlay.querySelector('.khsy-modal-footer');
                actions.forEach(action => {
                    const btn = document.createElement('button');
                    btn.className = action.primary ? 'khsy-btn khsy-btn-primary' : 'khsy-btn';
                    btn.textContent = action.text;
                    btn.onclick = () => {
                        if (action.onClick) action.onClick();
                        if (!action.keepOpen) {
                            overlay.remove();
                        }
                    };
                    footer.appendChild(btn);
                });
            }

            // 关闭按钮
            const closeBtn = overlay.querySelector('.khsy-modal-close');
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                overlay.remove();
            };

            // 点击遮罩关闭
            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            };

            // 阻止模态框内部点击冒泡
            const modalBox = overlay.querySelector('.khsy-modal');
            if (modalBox) {
                modalBox.onclick = (e) => {
                    e.stopPropagation();
                };
            }

            // 🔥 关键：重写remove方法，触发自定义remove事件
            const originalRemove = overlay.remove.bind(overlay);
            overlay.remove = () => {
                overlay.dispatchEvent(new Event('remove'));
                originalRemove();
            };

            document.body.appendChild(overlay);
            return overlay;
        }
    };

    // ==================== 样式注入 ====================
    GM_addStyle(`
        /* 动画 */
        @keyframes khsy-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes khsy-slide-out {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes khsy-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        @keyframes khsy-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* 悬浮控制面板 - 扁平简约风格 */
        .khsy-float-panel {
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

        .khsy-float-panel.minimized {
            padding: 0;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            border: 2px solid rgba(255, 255, 255, 0.9);
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
        }

        .khsy-float-panel.minimized .khsy-float-btn:not(.khsy-toggle-btn) {
            display: none;
        }

        .khsy-float-panel.minimized .khsy-toggle-btn {
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

        /* 收回状态隐藏SVG，显示文字 */
        .khsy-float-panel.minimized .khsy-toggle-btn svg {
            display: none;
        }

        /* 收回状态显示文字内容 */
        .khsy-float-panel.minimized .khsy-toggle-btn::before {
            content: '☰';
            display: block;
            line-height: 1;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            margin-left: -2px;
        }

        /* 展开状态的图标样式 */
        .khsy-float-panel:not(.minimized) .khsy-toggle-btn::before {
            display: none;
        }

        .khsy-float-btn {
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

        .khsy-float-btn svg {
            width: 20px;
            height: 20px;
            opacity: 1;
            flex-shrink: 0;
            stroke-width: 2.5;
        }

        .khsy-toggle-btn {
            color: rgba(0, 0, 0, 0.5) !important;
        }

        /* 🔥 绿色圆点角标（右上角） */
        .khsy-ready-badge {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 10px;
            height: 10px;
            background: #10b981;  /* 绿色 */
            border-radius: 50%;  /* 圆形 */
            border: 2px solid rgba(255, 255, 255, 0.9);  /* 白色边框 */
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);  /* 发光效果 */
            animation: khsy-pulse 2s infinite;  /* 脉冲动画 */
            z-index: 10;
        }

        /* 模态框 */
        .khsy-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(8px);
            z-index: 2147483646;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: khsy-fade-in 0.2s ease;
        }

        @keyframes khsy-fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .khsy-modal {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            max-width: 90vw;
            max-height: 85vh;
            width: 500px;
            display: flex;
            flex-direction: column;
            animation: khsy-modal-in 0.3s ease;
            backdrop-filter: blur(20px);
        }

        @keyframes khsy-modal-in {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .khsy-modal-header {
            padding: 20px 24px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .khsy-modal-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .khsy-modal-close {
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
        }

        .khsy-modal-body {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
            color: #333;
        }

        .khsy-modal-footer {
            padding: 16px 24px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }

        /* 按钮 */
        .khsy-btn {
            padding: 10px 20px;
            border-radius: 10px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            font-size: 14px;
            cursor: pointer;
        }

        .khsy-btn-primary {
            background: #10b981;
            color: #fff;
            border-color: #10b981;
        }

        /* 输入框 */
        .khsy-input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(0, 0, 0, 0.15);
            border-radius: 10px;
            color: #333;
            font-size: 14px;
        }

        .khsy-input:focus {
            outline: none;
            border-color: #10b981;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
            background: #fff;
        }

        .khsy-input::placeholder {
            color: rgba(0, 0, 0, 0.4);
        }

        /* 徽章 */
        .khsy-badge {
            position: absolute;
            right: -4px;
            top: -4px;
            width: 10px;
            height: 10px;
            background: #10b981;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.9);
            animation: khsy-pulse 2s infinite;
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
        }

        /* VIP标签 */
        .khsy-vip-tag {
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

        /* 加载动画 */
        .khsy-loading {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-top-color: ${CONFIG.THEME.primary};
            border-radius: 50%;
            animation: khsy-spin 0.8s linear infinite;
        }
    `);

    // ==================== 加密解密模块 ====================
    const Crypto = {
        b64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        b64re: /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,

        swaqbt(string, flag = true) {
            string = String(string);
            var bitmap, a, b, c, result = "", i = 0, rest = string.length % 3;
            for (; i < string.length;) {
                if ((a = string.charCodeAt(i++)) > 255 || (b = string.charCodeAt(i++)) > 255 || (c = string.charCodeAt(i++)) > 255) {
                    return "Failed to execute swaqbt"
                }
                bitmap = (a << 16) | (b << 8) | c;
                result += this.b64.charAt(bitmap >> 18 & 63) + this.b64.charAt(bitmap >> 12 & 63) +
                    this.b64.charAt(bitmap >> 6 & 63) + this.b64.charAt(bitmap & 63);
            }
            if (flag) return this.swaqbt(rest ? result.slice(0, rest - 3) + "===".substring(rest) : result, false);
            else return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
        },

        sfweccat(string, flag = true) {
            string = String(string).replace(/[\t\n\f\r ]+/g, "");
            if (!this.b64re.test(string)) {
                return 'Failed to execute sfweccat';
            }
            string += "==".slice(2 - (string.length & 3));
            var bitmap, result = "", r1, r2, i = 0;
            for (; i < string.length;) {
                bitmap = this.b64.indexOf(string.charAt(i++)) << 18 | this.b64.indexOf(string.charAt(i++)) << 12 |
                    (r1 = this.b64.indexOf(string.charAt(i++))) << 6 | (r2 = this.b64.indexOf(string.charAt(i++)));
                result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
                    r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
                    String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
            }
            if (flag) return this.sfweccat(result, false);
            else return result;
        },

        encode(s, plus) {
            const cfsed = encodeURIComponent;
            const csrdfd = unescape;
            return plus ? this.swaqbt(this.swaqbt(csrdfd(cfsed(s))), false) : this.swaqbt(this.swaqbt(s), false);
        },

        decode(s, plus) {
            const obj = {};
            const sfscc = 'wt' + Math.ceil(Math.random() * 100000000);
            obj[sfscc] = escape;
            return plus ? decodeURIComponent(obj[sfscc](this.sfweccat(this.sfweccat(s), false))) :
                decodeURIComponent(this.sfweccat(this.sfweccat(s), false));
        },

        // 🔥 修复被错误编码的UTF-8字符串
        fixUtf8(str) {
            try {
                // 检测是否需要修复（包含乱码特征）
                if (!str || !/[\u0080-\u00FF]/.test(str)) {
                    return str;  // 不需要修复
                }

                // 将错误编码的字符串转换回字节数组
                const bytes = [];
                for (let i = 0; i < str.length; i++) {
                    const code = str.charCodeAt(i);
                    if (code > 255) {
                        // 如果已经是正确的Unicode字符，直接返回原字符串
                        return str;
                    }
                    bytes.push(code);
                }

                // 使用TextDecoder正确解码UTF-8字节
                const uint8Array = new Uint8Array(bytes);
                const decoder = new TextDecoder('utf-8');
                return decoder.decode(uint8Array);
            } catch (e) {
                return str;
            }
        }
    };


    const VideoResolver = {
        currentTopicId: null,
        currentPageUrl: '',
        resolveCache: new Map(),
        resolving: false,
        hasShownToast: false,  // 🔥 记录是否已显示过提示
        contentTypeCache: new Map(),  // 🔥 内容类型缓存 {topicId: {hasVideo, hasImages, hasAudio}}

        getTopicId() {
            try {
                const url = new URL(window.location.href);


                const params = url.searchParams;
                const idParams = ['id', 'pid', 'tid'];
                for (const param of idParams) {
                    const value = params.get(param);
                    if (value && /^\d+$/.test(value)) {
                        return value;
                    }
                }


                const pathMatch = url.pathname.match(/\/topic\/(\d+)/);
                if (pathMatch) {
                    return pathMatch[1];
                }


                if (url.hash) {
                    const hashMatch = url.hash.match(/\/topic\/(\d+)/);
                    if (hashMatch) {
                        return hashMatch[1];
                    }
                }


                const lastNumMatch = url.pathname.match(/\b(\d{4,})\b(?!.*\d)/);
                if (lastNumMatch) {
                    return lastNumMatch[1];
                }


                const elem = document.querySelector('[data-topic-id]');
                if (elem) {
                    const topicId = elem.getAttribute('data-topic-id');
                    return topicId;
                }

            } catch (e) {
            }
            return null;
        },


        detectImagePage() {
            const topicId = this.getTopicId();
            if (topicId) {
                const cached = this.contentTypeCache.get(String(topicId));
                if (cached && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {
                    if (cached.hasVideo) {
                        return false;
                    } else if (cached.hasImages) {
                        return true;
                    }
                }
            }

            const videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                return false;
            }

            const playButtons = document.querySelectorAll('[class*="play"], [class*="video"], .vjs-big-play-button');
            if (playButtons.length > 0) {
                return false;
            }

            const pageText = document.body.innerText || '';
            const hasVideoDuration = /\[\d+分\d+秒\]/.test(pageText) ||
                                    /\d+:\d+/.test(pageText) ||
                                    /视频时长/.test(pageText);

            if (hasVideoDuration) {
                return false;
            }

            const urlText = window.location.href + (document.title || '');
            if (urlText.includes('video') || urlText.includes('视频')) {
                return false;
            }

            const images = document.querySelectorAll('img[src]:not([src*="avatar"]):not([src*="icon"])');
            let contentImageCount = 0;

            for (const img of images) {
                try {
                    const rect = img.getBoundingClientRect();
                    if (rect.width > 300 && rect.height > 200) {
                        contentImageCount++;
                    }
                } catch (e) {
                }
            }

            if (contentImageCount >= 2) {
                return true;
            }

            return false;
        },

        async extractM3u8FromDOM() {
            const topicId = this.getTopicId();
            if (topicId) {
                const cached = this.contentTypeCache.get(String(topicId));
                if (cached && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {  // 30分钟有效
                    if (cached.hasVideo) {
                        return false;  // 不是图片页
                    } else if (cached.hasImages) {
                        return true;  // 是图片页
                    }
                }
            }


            const videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                return false;  // 不是图片页
            }


            const playButtons = document.querySelectorAll('[class*="play"], [class*="video"], .vjs-big-play-button');
            if (playButtons.length > 0) {
                return false;  // 不是图片页
            }


            const pageText = document.body.innerText || '';
            const hasVideoDuration = /\[\d+分\d+秒\]/.test(pageText) ||     // [24分33秒]
                                    /\d+分\d+秒/.test(pageText) ||          // 24分33秒
                                    /时长[:\s]*\d+:\d+/.test(pageText) ||  // 时长: 24:33
                                    /播放时长/.test(pageText) ||
                                    /视频时长/.test(pageText);

            if (hasVideoDuration) {
                return false;  // 不是图片页
            }


            const urlText = window.location.href + (document.title || '');
            if (urlText.includes('video') || urlText.includes('视频')) {
                return false;  // 不是图片页
            }


            const images = document.querySelectorAll('img');
            let contentImageCount = 0;

            for (const img of images) {
                const src = img.src || '';
                const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
                const isImageUrl = imageExts.some(ext => src.toLowerCase().includes(ext));

                if (!isImageUrl) continue;

                const width = img.naturalWidth || img.width;
                const height = img.naturalHeight || img.height;

                // 只统计真正的内容图片（排除小图标、头像等）
                if (width > 300 && height > 300) {
                    contentImageCount++;
                }
            }


            if (contentImageCount >= 2) {
                return true;
            }


            return false;
        },


        async extractM3u8FromDOM() {
            let previewM3u8Url = null;


            const videos = document.querySelectorAll('video');
            for (const video of videos) {
                if (video.src && video.src.includes('.m3u8')) {
                    previewM3u8Url = video.src;
                    break;
                }
                // 检查source标签
                const sources = video.querySelectorAll('source');
                for (const source of sources) {
                    if (source.src && source.src.includes('.m3u8')) {
                        previewM3u8Url = source.src;
                        break;
                    }
                }
                if (previewM3u8Url) break;
            }


            if (!previewM3u8Url) {
                const allText = document.body.innerHTML;
                const m3u8Regex = /(https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*)/gi;
                const matches = allText.match(m3u8Regex);
                if (matches && matches.length > 0) {
                    // 优先选择包含preview的（说明是预览视频地址）
                    const previewUrls = matches.filter(url => url.includes('preview'));
                    previewM3u8Url = previewUrls.length > 0 ? previewUrls[0] : matches[0];
                }
            }


            if (!previewM3u8Url) {
                try {
                    const win = unsafeWindow || window;
                    const findM3u8InObject = (obj, depth = 0) => {
                        if (depth > 3) return null;
                        if (!obj || typeof obj !== 'object') return null;

                        for (const key in obj) {
                            try {
                                const value = obj[key];
                                if (typeof value === 'string' && value.includes('.m3u8')) {
                                    return value;
                                }
                                if (typeof value === 'object') {
                                    const found = findM3u8InObject(value, depth + 1);
                                    if (found) return found;
                                }
                            } catch (e) {}
                        }
                        return null;
                    };

                    const m3u8 = findM3u8InObject(win.__INITIAL_STATE__) ||
                                findM3u8InObject(win.__APP_DATA__) ||
                                findM3u8InObject(win.appData) ||
                                findM3u8InObject(win.pageData);

                    if (m3u8) {
                        previewM3u8Url = m3u8;
                    }
                } catch (e) {}
            }

            if (!previewM3u8Url) {
                return null;
            }


            if (!previewM3u8Url.includes('preview')) {
                return previewM3u8Url;
            }

            try {
                const res = await Http.service('/video/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        previewM3u8Url: previewM3u8Url,
                        pageUrl: window.location.href
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.fullM3u8Url) {
                        return data.fullM3u8Url;
                    }
                }

                return previewM3u8Url;
            } catch (e) {
                return previewM3u8Url;
            }
        },

        async recordLog(params) {
            try {
                const { topicId, resolved, message, durationMs = 0, errorCode = '', site = '', ua = '' } = params;
                const pageUrl = window.location.href;

                await Http.api('/logs/view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pageUrl,
                        topicId: String(topicId || ''),
                        resolved: !!resolved,
                        message: String(message || ''),
                        durationMs: Number(durationMs) || 0,
                        errorCode: String(errorCode || ''),
                        site: site || window.location.hostname,
                        ua: navigator.userAgent
                    })
                });
            } catch (e) {
            }
        },

        async inferFullM3u8(previewM3u8) {
            try {
                const res = await Http.service('/video/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        previewM3u8Url: previewM3u8,
                        pageUrl: window.location.href
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.fullM3u8Url) {
                        return data.fullM3u8Url;
                    }
                }
            } catch (e) {
            }

            const verifyM3U8 = async (url) => {
                try {
                    const res = await fetch(url, { method: 'HEAD' });
                    return res.ok;
                } catch {
                    return false;
                }
            };


            try {

                const match = previewM3u8.match(/\/(\d+)_i?_preview\.m3u8/);
                if (match) {
                    const attachmentId = match[1];
                    const topicId = this.getTopicId();

                    const origin = window.location.origin;
                    const attachmentUrl = `${origin}/api/attachment`;
                    const payload = {
                        id: attachmentId,
                        resource_type: 'topic',
                        resource_id: topicId,
                        line: 'normal1',
                        is_ios: 0
                    };

                    const attachRes = await fetch(attachmentUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    if (attachRes.ok) {
                        const attachData = await attachRes.json();


                        let fullUrl = null;
                        if (attachData.data) {
                            fullUrl = attachData.data.url || attachData.data.video || attachData.data.m3u8;

                            if (!fullUrl && attachData.data.preview) {
                                fullUrl = attachData.data.preview.replace(/_preview/g, '');
                            }
                        } else if (attachData.url || attachData.video || attachData.m3u8) {
                            fullUrl = attachData.url || attachData.video || attachData.m3u8;
                        }

                        if (fullUrl && fullUrl !== previewM3u8) {
                            return fullUrl;
                        }
                    }
                }
            } catch (e) {
            }


            try {
                const m3u8Res = await fetch(previewM3u8);
                if (m3u8Res.ok) {
                    const m3u8Text = await m3u8Res.text();


                    const lines = m3u8Text.split('\n');
                    const baseUrl = previewM3u8.substring(0, previewM3u8.lastIndexOf('/') + 1);

                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i].trim();


                        if (line.startsWith('#EXT-X-STREAM-INF')) {
                            const nextLine = lines[i + 1]?.trim();
                            if (nextLine && nextLine.endsWith('.m3u8')) {
                                const fullUrl = nextLine.startsWith('http') ? nextLine : baseUrl + nextLine;
                                if (!fullUrl.includes('preview')) {
                                    return fullUrl;
                                }
                            }
                        }


                        if (line.endsWith('.m3u8') && !line.startsWith('#')) {
                            const fullUrl = line.startsWith('http') ? line : baseUrl + line;
                            if (!fullUrl.includes('preview')) {
                                return fullUrl;
                            }
                        }
                    }
                }
            } catch (e) {
            }

            const guess1 = previewM3u8.replace(/_preview/ig, '');
            if (guess1 !== previewM3u8) {
                if (await verifyM3U8(guess1)) {
                    return guess1;
                }
            }

            const m = /(.*)_i_preview(\.m3u8.*)$/i.exec(previewM3u8);
            if (m) {
                const cand1 = m[1] + '_i' + m[2];
                if (await verifyM3U8(cand1)) {
                    return cand1;
                }

                const cand2 = m[1] + m[2];
                if (await verifyM3U8(cand2)) {
                    return cand2;
                }
            }

            try {
                const url = new URL(previewM3u8);
                const baseDir = url.href.substring(0, url.href.lastIndexOf('/') + 1);
                const candidates = [
                    'index.m3u8',
                    'master.m3u8',
                    'playlist.m3u8',
                    'main.m3u8',
                    'video.m3u8',
                    '720p.m3u8',
                    '1080p.m3u8'
                ];

                for (const name of candidates) {
                    const candidate = baseDir + name;
                    if (await verifyM3U8(candidate)) {
                        return candidate;
                    }
                }
            } catch (e) {
            }

            return previewM3u8;
        },

        async resolvePreview() {
            const topicId = this.getTopicId();
            if (!topicId) {
                UI.toast('无法获取视频ID');
                return null;
            }

            try {
                const res = await Http.service('/resolve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topicId, preview: true })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data && data.url) {
                        return data.url || data.videoUrl || null;
                    }
                } else {
                    let errorMsg = '解析失败';
                    try {
                        const err = await res.json();
                        errorMsg = (err && (err.error || err.message)) || `请求失败 (${res.status})`;
                    } catch (jsonErr) {
                        errorMsg = `请求失败 (${res.status})`;
                    }
                    throw new Error(errorMsg);
                }
            } catch (e) {
                UI.toast('预览解析失败: ' + e.message);
                return null;
            }
        },


        async resolveFull() {
            const topicId = this.getTopicId();
            if (!topicId) {
                UI.toast('无法获取视频ID');
                return null;
            }

            if (!Auth.vip) {
                UI.toast('需要VIP会员才能观看完整视频');
                FloatPanel.showLoginModal();
                return null;
            }

            try {
                this.resolving = true;
                this._resolveStartTime = Date.now(); // 记录开始时间
                FloatPanel.updateResolveButton('解析中...');


                const cached = this.contentTypeCache.get(String(topicId));
                if (cached && cached.videoAttachment && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {  // 30分钟有效

                    if (cached.videoAttachment.remoteUrl) {
                        const previewM3u8 = cached.videoAttachment.remoteUrl;


                        let finalM3u8 = previewM3u8;
                        if (previewM3u8.includes('preview')) {
                            finalM3u8 = await this.inferFullM3u8(previewM3u8);
                        }

                        this.resolveCache.set(topicId, { url: finalM3u8, time: Date.now() });
                        FloatPanel.updateResolveButton('播放');


                        await this.recordLog({
                            topicId,
                            resolved: true,
                            message: '视频解析成功(缓存)',
                            durationMs: Date.now() - (this._resolveStartTime || Date.now())
                        });

                        return finalM3u8;
                    }


                    if (cached.videoAttachment.id) {
                        try {
                            const attachRes = await fetch(`${window.location.origin}/api/attachment`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    id: cached.videoAttachment.id,
                                    resource_type: 'topic',
                                    resource_id: topicId,
                                    line: 'normal1',
                                }),
                            });

                            const attachData = await attachRes.json();

                            if (attachData.success && attachData.data) {
                                let videoInfo;
                                try {
                                    videoInfo = JSON.parse(Crypto.decode(attachData.data));
                                } catch {
                                    videoInfo = typeof attachData.data === 'object' ? attachData.data : JSON.parse(attachData.data);
                                }

                                const finalM3u8 = videoInfo.m3u8Url || videoInfo.url || videoInfo.videoUrl;
                                if (finalM3u8) {
                                    this.resolveCache.set(topicId, { url: finalM3u8, time: Date.now() });


                                    await this.recordLog({
                                        topicId,
                                        resolved: true,
                                        message: '视频解析成功(API)',
                                        durationMs: Date.now() - (this._resolveStartTime || Date.now())
                                    });

                                    return finalM3u8;
                                }
                            }
                        } catch (e) {
                        }
                    }
                }


                const topicRes = await fetch(`${window.location.origin}/api/topic/${topicId}`, {
                    credentials: 'include'
                });

                if (!topicRes.ok) {
                    throw new Error('获取视频信息失败');
                }

                const topicData = await topicRes.json();

                if (topicData.isEncrypted && typeof topicData.data === 'string') {

                    const cached = this.contentTypeCache.get(String(topicId));
                    if (cached && cached.videoAttachment && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {


                        const attachRes = await fetch(`${window.location.origin}/api/attachment`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: cached.videoAttachment.id,
                                resource_type: 'topic',
                                resource_id: topicId,
                                line: 'normal1',
                            }),
                        });

                        const attachData = await attachRes.json();

                        if (attachData.success && attachData.data) {
                            let videoInfo;
                            try {
                                videoInfo = JSON.parse(Crypto.decode(attachData.data));
                            } catch {
                                videoInfo = typeof attachData.data === 'object' ? attachData.data : JSON.parse(attachData.data);
                            }

                            const finalM3u8 = videoInfo.m3u8Url || videoInfo.url || videoInfo.videoUrl;
                            if (finalM3u8) {
                                this.resolveCache.set(topicId, { url: finalM3u8, time: Date.now() });


                                await this.recordLog({
                                    topicId,
                                    resolved: true,
                                    message: '视频解析成功(缓存方式)',
                                    durationMs: Date.now() - (this._resolveStartTime || Date.now())
                                });

                                return finalM3u8;
                            }
                        }
                    }


                    const isImagePage = this.detectImagePage();
                    if (isImagePage) {
                        throw new Error('此内容为图片，非视频');
                    }

                    const m3u8FromDOM = await this.extractM3u8FromDOM();
                    if (m3u8FromDOM) {

                        let finalM3u8 = m3u8FromDOM;
                        if (m3u8FromDOM.includes('preview')) {
                            finalM3u8 = await this.inferFullM3u8(m3u8FromDOM);
                        }

                        this.resolveCache.set(topicId, { url: finalM3u8, time: Date.now() });

                        await this.recordLog({
                            topicId,
                            resolved: true,
                            message: '视频解析成功(DOM提取)',
                            durationMs: Date.now() - (this._resolveStartTime || Date.now())
                        });

                        return finalM3u8;
                    }

                    throw new Error('当前页面未检测到视频，请手动点击页面中的播放');
                }

                const data = topicData.data || topicData;
                const attachments = data.attachments || [];

                if (attachments.length === 0) {
                    throw new Error('该帖子没有内容');
                }

                let hasVideo = false;
                let hasImage = false;
                let hasAudio = false;
                let videoAttachment = null;

                for (const attachment of attachments) {

                    if (attachment.category === 'video') {
                        hasVideo = true;
                        videoAttachment = attachment;
                        break;
                    }

                    if (attachment.category === 'images' || attachment.category === 'image') {
                        hasImage = true;
                        continue;
                    }

                    if (attachment.category === 'audio') {
                        hasAudio = true;
                        continue;
                    }
                }

                this.contentTypeCache.set(String(topicId), {
                    hasVideo: hasVideo,
                    hasImages: hasImage,
                    hasAudio: hasAudio,
                    timestamp: Date.now()
                });

                if (!hasVideo || !videoAttachment) {
                    if (hasImage) {
                        throw new Error('此内容为图片，非视频');
                    } else if (hasAudio) {
                        throw new Error('此内容为音频，非视频');
                    } else {
                        throw new Error('该帖子没有视频内容');
                    }
                }


                const attachRes = await fetch(`${window.location.origin}/api/attachment`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: videoAttachment.id,
                        resource_type: 'topic',
                        resource_id: topicId,
                        line: 'normal1',
                        is_ios: 0
                    }),
                    credentials: 'include'
                });

                if (!attachRes.ok) {
                    throw new Error('获取视频地址失败');
                }

                const attachData = await attachRes.json();


                let previewM3u8 = null;
                if (attachData.data && attachData.data.preview) {
                    previewM3u8 = attachData.data.preview;
                } else if (attachData.preview) {
                    previewM3u8 = attachData.preview;
                }

                if (!previewM3u8) {
                    throw new Error('无法获取视频预览地址');
                }


                const m3u8Url = await this.inferFullM3u8(previewM3u8);

                if (!m3u8Url) {
                    throw new Error('无法解析完整视频地址');
                }


                this.resolveCache.set(topicId, { url: m3u8Url, time: Date.now() });


                await this.recordLog({
                    topicId,
                    resolved: true,
                    message: '视频解析成功',
                    durationMs: Date.now() - (this._resolveStartTime || Date.now())
                });


                return m3u8Url;
            } catch (e) {


                await this.recordLog({
                    topicId,
                    resolved: false,
                    message: e.message || '解析失败',
                    durationMs: Date.now() - (this._resolveStartTime || Date.now()),
                    errorCode: e.code || 'RESOLVE_ERROR'
                });

                throw e;
            } finally {
                this.resolving = false;
                FloatPanel.updateResolveButton('解析视频');
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
                tip.style.cssText = 'width:100%;margin-bottom:12px;padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;text-align:center;color:#666;font-size:12px;line-height:1.6;word-break:break-word;white-space:normal;display:block;box-sizing:border-box;';
                tip.innerHTML = '💡 支持<b>长按倍速播放</b>、<b>左右拖动快进</b>，播放速度取决于您当前的网速';
                container.appendChild(tip);

                const video = document.createElement('video');
                video.id = 'khsy-player';
                video.controls = true;
                video.style.cssText = 'width:100%;max-height:50vh;height:auto;background:#000;border-radius:12px;object-fit:contain;display:block;';

                this.addDragAndLongPress(video);
                container.appendChild(video);
                this.currentPlayer = video;

                this.loadVideo(videoUrl, video);
            } catch (e) {
                UI.toast('播放器初始化失败: ' + e.message);
            }
        },

        loadVideo(url, video) {
            if (Hls.isSupported()) {
                const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

                this.hls = new Hls({
                    enableWorker: true,
                    xhrSetup: function(xhr, requestUrl) {
                        if (requestUrl && !requestUrl.startsWith('http')) {
                            const absoluteUrl = baseUrl + requestUrl;
                            // 注意：这里不能调用xhr.open，HLS.js会自己调用
                            // 我们需要修改xhr的URL，但HLS.js在xhrSetup之后才open
                            // 所以我们需要hook xhr.open
                            const originalOpen = xhr.open;
                            xhr.open = function(method, url, async) {
                                originalOpen.call(this, method, absoluteUrl, async);
                            };
                        }
                    }
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
                    video.play().catch(err => {
                        UI.toast('自动播放失败，请手动点击播放');
                    });
                });

                this.hls.loadSource(url);
                this.hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(err => {
                        UI.toast('自动播放失败，请手动点击播放');
                    });
                }, { once: true });
            }
        },

        // 添加拖动和长按功能
        addDragAndLongPress(video) {
            const dragState = {
                isDragging: false,
                hasMoved: false
            };

            this.enableDragSeek(video, dragState);
            this.enableSpeedControl(video, dragState);
        },

        // 启用拖拽快进（鼠标+触摸）- 按拖动距离增减秒数
        enableDragSeek(video, dragState) {
            let startX = 0;
            let startTime = 0;

            const handleStart = (e) => {
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                startX = clientX;
                startTime = video.currentTime;
                dragState.isDragging = true;
                dragState.hasMoved = false;
            };

            const handleMove = (e) => {
                if (!dragState.isDragging || !video.duration) return;

                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const deltaX = clientX - startX;

                // 只有移动超过5px才算真正拖动
                if (Math.abs(deltaX) > 5) {
                    dragState.hasMoved = true;

                    // 每拖动50px = 5秒
                    const deltaTime = (deltaX / 50) * 5;
                    const newTime = Math.max(0, Math.min(video.duration, startTime + deltaTime));

                    video.currentTime = newTime;
                }
            };

            const handleEnd = () => {
                dragState.isDragging = false;
                // 延迟重置hasMoved，让倍速检测到
                setTimeout(() => {
                    dragState.hasMoved = false;
                }, 100);
            };

            // 鼠标事件
            video.addEventListener('mousedown', handleStart);
            video.addEventListener('mousemove', handleMove);
            video.addEventListener('mouseup', handleEnd);
            video.addEventListener('mouseleave', handleEnd);

            // 触摸事件
            video.addEventListener('touchstart', handleStart);
            video.addEventListener('touchmove', handleMove);
            video.addEventListener('touchend', handleEnd);
            video.addEventListener('touchcancel', handleEnd);
        },

        // 启用长按倍速（鼠标+触摸）- 只在没有拖动时触发
        enableSpeedControl(video, dragState) {
            let speedTimer = null;
            let isSpeedMode = false;

            const startSpeedMode = () => {
                speedTimer = setTimeout(() => {
                    // 只在没有拖动时才触发倍速
                    if (!isSpeedMode && !dragState.hasMoved) {
                        video.playbackRate = 2.0;
                        isSpeedMode = true;
                        UI.toast('⚡ 2倍速播放中', 1000);
                    }
                }, 500);  // 长按500ms触发
            };

            const endSpeedMode = () => {
                clearTimeout(speedTimer);
                if (isSpeedMode) {
                    video.playbackRate = 1.0;
                    isSpeedMode = false;
                    UI.toast('✅ 恢复正常速度', 800);
                }
            };

            // 鼠标事件
            video.addEventListener('mousedown', startSpeedMode);
            video.addEventListener('mouseup', endSpeedMode);
            video.addEventListener('mouseleave', endSpeedMode);

            // 触摸事件
            video.addEventListener('touchstart', startSpeedMode);
            video.addEventListener('touchend', endSpeedMode);
            video.addEventListener('touchcancel', endSpeedMode);
        },

        // 销毁播放器
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
        messageModalOpen: false,
        announceModalOpen: false,
        updateModalOpen: false,
        resolving: false,  // 🔥 添加解析状态标志

        // 创建悬浮面板
        create() {
            if (this.panel) return;

            const panel = document.createElement('div');
            panel.className = 'khsy-float-panel';

            // 检查是否有保存的最小化状态
            const isMinimized = localStorage.getItem('khsy_panel_minimized') === 'true';
            if (isMinimized) {
                panel.classList.add('minimized');
            }

            panel.innerHTML = `
                <button class="khsy-float-btn" id="khsy-btn-account" title="账户中心">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"></path>
                    </svg>
                    <div class="khsy-badge" id="khsy-account-badge" style="display:none;"></div>
                </button>
                <button class="khsy-float-btn" id="khsy-btn-resolve" title="解析视频">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </button>
                <button class="khsy-float-btn" id="khsy-btn-download" title="下载助手">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>
                <button class="khsy-float-btn" id="khsy-btn-announce" title="最新公告">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                    </svg>
                </button>
                <button class="khsy-float-btn" id="khsy-btn-update" title="检查更新">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"></path>
                    </svg>
                </button>
                <button class="khsy-float-btn khsy-toggle-btn" id="khsy-btn-toggle" title="${isMinimized ? '展开面板' : '收起面板'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        ${isMinimized ? `` : `
                            <polyline points="9 18 15 12 9 6"></polyline>
                        `}
                    </svg>
                </button>
            `;

            document.body.appendChild(panel);
            this.panel = panel;

            // 绑定事件（使用addEventListener更安全）
            const btnToggle = document.getElementById('khsy-btn-toggle');
            const btnAccount = document.getElementById('khsy-btn-account');
            const btnResolve = document.getElementById('khsy-btn-resolve');
            const btnAnnounce = document.getElementById('khsy-btn-announce');
            const btnDownload = document.getElementById('khsy-btn-download');
            const btnUpdate = document.getElementById('khsy-btn-update');

            btnToggle.addEventListener('click', () => this.toggleMinimize());
            btnAccount.addEventListener('click', () => this.showLoginModal());
            btnResolve.addEventListener('click', () => {
                this.resolveVideo();
            });
            btnAnnounce.addEventListener('click', () => this.showAnnounceModal());
            btnDownload.addEventListener('click', () => this.showDownloadModal());
            btnUpdate.addEventListener('click', () => this.showUpdateModal());

            // 更新状态
            this.updateAccountButton();
            this.updateToggleButton();

            // 🔥 启动时检查更新
            setTimeout(() => {
                UpdateChecker.checkUpdate();
            }, 2000);
        },

        // 切换最小化状态
        toggleMinimize() {
            const panel = this.panel;
            if (!panel) return;

            const isMinimized = panel.classList.toggle('minimized');
            localStorage.setItem('khsy_panel_minimized', isMinimized);
            this.updateToggleButton();
        },

        // 更新收起/展开按钮
        updateToggleButton() {
            const btn = document.getElementById('khsy-btn-toggle');
            const panel = this.panel;
            if (!btn || !panel) return;

            const isMinimized = panel.classList.contains('minimized');
            const svg = btn.querySelector('svg');

            btn.title = isMinimized ? '展开面板' : '收起面板';

            // 更新图标
            if (svg) {
                // 添加圆角属性
                svg.setAttribute('stroke-linecap', 'round');
                svg.setAttribute('stroke-linejoin', 'round');

                if (isMinimized) {
                    // 收起状态使用CSS的::before显示文字，SVG隐藏
                    svg.innerHTML = '';
                } else {
                    // 展开状态显示箭头
                    svg.innerHTML = `
                        <polyline points="9 18 15 12 9 6"></polyline>
                    `;
                }
            }
        },

        // 更新账户按钮
        updateAccountButton() {
            const btn = document.getElementById('khsy-account-text');
            if (!btn) return;

            if (Auth.username) {
                btn.textContent = Auth.username;
                if (Auth.vip) {
                    btn.innerHTML = `${Auth.username} <span class="khsy-vip-tag">VIP</span>`;
                }
            } else {
                btn.textContent = '登录';
            }
        },

        // 更新解析按钮
        updateResolveButton(text) {
            const btn = document.getElementById('khsy-btn-resolve');
            if (btn) {
                const span = btn.querySelector('span:last-child');
                if (span) span.textContent = text;
            }
        },

        // 显示登录/账户模态框
        showLoginModal() {
            // 移除可能存在的旧弹窗
            const oldModal = document.querySelector('.khsy-modal-overlay');
            if (oldModal) {
                oldModal.remove();
                this.loginModalOpen = false;
            }

            if (this.loginModalOpen) return;
            this.loginModalOpen = true;

            const isLoggedIn = !!Auth.username;

            const content = isLoggedIn ? this.getAccountContent() : this.getLoginContent();

            const modal = UI.createModal(
                isLoggedIn ? '账户中心' : '登录账户',
                content,
                []
            );

            // 确保正确处理关闭事件
            const cleanup = () => {
                this.loginModalOpen = false;
            };

            modal.addEventListener('remove', cleanup);

            // 监听模态框的实际移除
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((node) => {
                        if (node === modal) {
                            cleanup();
                            observer.disconnect();
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true });

            if (!isLoggedIn) {
                // 绑定登录事件
                setTimeout(() => {
                    const loginBtn = document.getElementById('khsy-login-btn');
                    const errorBox = document.getElementById('khsy-login-error');

                    // 显示错误信息的辅助函数
                    const showError = (msg) => {
                        if (errorBox) {
                            errorBox.textContent = msg;
                            errorBox.style.display = 'block';
                        }
                    };

                    // 隐藏错误信息的辅助函数
                    const hideError = () => {
                        if (errorBox) {
                            errorBox.style.display = 'none';
                        }
                    };

                    if (loginBtn) {
                        loginBtn.onclick = async () => {
                            const username = document.getElementById('khsy-username').value.trim();
                            const password = document.getElementById('khsy-password').value.trim();

                            hideError();

                            if (!username || !password) {
                                showError('请填写用户名和密码');
                                return;
                            }

                            loginBtn.textContent = '登录中...';
                            loginBtn.disabled = true;

                            const result = await Auth.login(username, password);

                            if (result.success) {
                                hideError();
                                // 在框内显示成功提示
                                if (errorBox) {
                                    errorBox.style.background = 'rgba(34,197,94,0.1)';
                                    errorBox.style.borderColor = 'rgba(34,197,94,0.3)';
                                    errorBox.style.color = '#86efac';
                                    errorBox.textContent = '登录成功！';
                                    errorBox.style.display = 'block';
                                }
                                setTimeout(() => {
                                    modal.remove();
                                    this.updateAccountButton();
                                }, 500);
                            } else {
                                showError(result.error || '登录失败，请重试');
                                loginBtn.textContent = '登录';
                                loginBtn.disabled = false;
                            }
                        };
                    }

                    const registerLink = document.getElementById('khsy-register-link');
                    if (registerLink) {
                        registerLink.onclick = () => {
                            window.open(CONFIG.SERVER_BASE, '_blank');
                        };
                    }
                }, 100);
            } else {
                // 绑定退出登录事件
                setTimeout(() => {
                    const logoutBtn = document.getElementById('khsy-logout-btn');
                    if (logoutBtn) {
                        logoutBtn.onclick = () => {
                            if (confirm('确定要退出登录吗？')) {
                                Auth.clear();
                                UI.toast('已退出登录');
                                modal.remove();
                                this.updateAccountButton();
                            }
                        };
                    }
                }, 100);
            }
        },

        // 获取登录界面内容
        getLoginContent() {
            return `
                <div style="display:flex;flex-direction:column;gap:16px;">
                    <div id="khsy-login-error" style="display:none;padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;color:#ef4444;font-size:13px;"></div>
                    <div>
                        <label style="display:block;margin-bottom:6px;color:#333;font-size:13px;">用户名</label>
                        <input type="text" id="khsy-username" class="khsy-input" placeholder="请输入用户名">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:6px;color:#333;font-size:13px;">密码</label>
                        <input type="password" id="khsy-password" class="khsy-input" placeholder="请输入密码">
                    </div>
                    <button class="khsy-btn khsy-btn-primary" id="khsy-login-btn">登录</button>
                    <div style="text-align:center;font-size:12px;color:#666;">
                        还没有账户？<a href="javascript:void(0)" id="khsy-register-link" style="color:#10b981;text-decoration:underline;">前往注册</a>
                    </div>
                </div>
            `;
        },

        // 获取账户中心内容
        getAccountContent() {
            const vipStatus = Auth.vip ? `
                <div style="padding:16px;background:linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1));border:1px solid rgba(251,191,36,0.3);border-radius:12px;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <span class="khsy-vip-tag">VIP会员</span>
                        <span style="color:#333;font-size:13px;">尊享特权</span>
                    </div>
                    <div style="font-size:12px;color:#666;">
                        到期时间：${Utils.formatVipExpire(Auth.vipExpireAt)}
                    </div>
                </div>
            ` : `
                <div style="padding:16px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:12px;text-align:center;">
                    <div style="font-size:13px;color:#333;margin-bottom:8px;">您还不是VIP会员</div>
                    <a href="${CONFIG.SERVER_BASE}" target="_blank" class="khsy-btn khsy-btn-primary" style="display:inline-block;text-decoration:none;">立即开通VIP</a>
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
                        <a href="${CONFIG.SERVER_BASE}" target="_blank" class="khsy-btn" style="flex:1;text-align:center;text-decoration:none;">访问官网</a>
                        <button class="khsy-btn" id="khsy-logout-btn" style="flex:1;">退出登录</button>
                    </div>
                </div>
            `;
        },

        // 解析视频
        async resolveVideo() {

            if (this.resolving) {
                return;
            }

            this.resolving = true;

            const topicId = VideoResolver.getTopicId();
            if (!topicId) {
                UI.toast('请在视频详情页使用此功能');
                this.resolving = false;
                return;
            }

            // 🔥 先检查是否登录
            if (!Auth.token) {
                this.resolving = false;
                this.showLoginModal();
                return;
            }

            // 🔥 再检查VIP状态
            if (!Auth.vip) {
                this.resolving = false;
                this.showVipRequiredModal();
                return;
            }

            try {

                const cached = VideoResolver.contentTypeCache.get(String(topicId));
                if (cached && (Date.now() - cached.timestamp < 30 * 60 * 1000)) {
                    if (!cached.videoAttachment) {
                        // 没有视频附件，统一提示为免费贴
                        UI.toast('⚠️ 当前页面下没有找到视频（免费贴）');
                        this.resolving = false;
                        return;
                    }
                }

                UI.toast('正在解析视频...', 'info', 2000);

                const url = await VideoResolver.resolveFull();

                if (url) {
                    this.showVideoModal(url);
                }
            } catch (e) {

                UI.toast('解析失败: ' + e.message);
            } finally {
                setTimeout(() => {
                    this.resolving = false;
                }, 1000);  // 延长到1秒
            }
        },


        showVipRequiredModal() {
            const content = `
                <div style="text-align:center;padding:20px;">
                    <div style="margin-bottom:16px;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:64px;height:64px;margin:0 auto;color:#fbbf24;">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                    </div>
                    <div style="font-size:18px;font-weight:600;color:#333;margin-bottom:12px;">您还不是VIP会员</div>
                    <div style="font-size:14px;color:#666;margin-bottom:24px;line-height:1.6;">
                        观看完整视频需要开通VIP会员<br>
                        立即开通，畅享所有视频内容
                    </div>
                    <button class="khsy-btn khsy-btn-primary" id="khsy-goto-vip" style="width:100%;padding:14px;">
                        前往开通VIP
                    </button>
                </div>
            `;

            const modal = UI.createModal('VIP会员', content, []);

            setTimeout(() => {
                const gotoBtn = document.getElementById('khsy-goto-vip');
                if (gotoBtn) {
                    gotoBtn.onclick = () => {
                        window.open('https://khsy.cc', '_blank');
                        modal.remove();
                    };
                }
            }, 100);
        },

        // 显示视频播放模态框
        showVideoModal(url) {

            if (this.videoModalOpen) {
                return;
            }

            this.videoModalOpen = true;

            // 🔥 如果预加载没有添加圆点，这里再添加
            const btnResolve = document.getElementById('khsy-btn-resolve');
            if (btnResolve) {
                let badge = btnResolve.querySelector('.khsy-ready-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'khsy-ready-badge';
                    btnResolve.appendChild(badge);
                }
            }

            // 🔥 初始内容：如果url为null，显示加载中
            const initialContent = url ?
                '<div id="khsy-video-container" style="width:100%;max-height:calc(85vh - 200px);overflow-y:auto;display:block;"></div>' :
                `<div id="khsy-video-container" style="width:100%;min-height:300px;max-height:calc(85vh - 200px);display:flex;align-items:center;justify-content:center;overflow-y:auto;">
                    <div style="text-align:center;color:#666;">
                        <div style="font-size:32px;margin-bottom:12px;">⏳</div>
                        <div style="font-size:14px;white-space:nowrap;">视频正在全力解析中...</div>
                    </div>
                </div>`;

            // 🔥 按钮：如果url为null，暂时不显示下载按钮
            const buttons = url ? [
                { text: '下载视频', onClick: () => this.downloadVideo(url) },
                { text: '关闭', onClick: () => modal.remove() }
            ] : [
                { text: '关闭', onClick: () => modal.remove() }
            ];

            const modal = UI.createModal(
                '视频播放',
                initialContent,
                buttons
            );

            modal.addEventListener('remove', () => {
                this.videoModalOpen = false;
                Player.destroy();
            });

            if (url) {
                requestAnimationFrame(() => {
                    const container = document.getElementById('khsy-video-container');
                    if (!container) {
                        return;
                    }

                    if (container.querySelector('#khsy-player')) {
                        return;
                    }

                    Player.create(url, container);
                });
            }
        },

        // 更新播放器（解析完成后调用）
        updateVideoPlayer(url) {
            const container = document.getElementById('khsy-video-container');
            if (!container) {
                return;
            }

            container.innerHTML = '';

            Player.create(url, container);

            const modal = document.querySelector('.khsy-modal-overlay');
            if (modal) {
                const footer = modal.querySelector('.khsy-modal-footer');
                if (footer && footer.children.length === 1) {  // 只有关闭按钮
                    const downloadBtn = document.createElement('button');
                    downloadBtn.className = 'khsy-btn khsy-btn-primary';
                    downloadBtn.textContent = '下载视频';
                    downloadBtn.onclick = () => this.downloadVideo(url);
                    footer.insertBefore(downloadBtn, footer.firstChild);
                }
            }
        },


        // 显示更新模态框
        async showUpdateModal() {
            if (this.updateModalOpen) return;
            this.updateModalOpen = true;

            const currentVersion = CONFIG.SCRIPT_VERSION;

            // 🔥 先显示弹窗（使用缓存的数据或显示检测中）
            let latestVersion = UpdateChecker.latestVersion || '检测中...';
            let hasUpdate = UpdateChecker.hasUpdate;
            let checkFailed = UpdateChecker.latestVersion === null;
            let isChecking = UpdateChecker.latestVersion === null;

            const content = `
                <div style="padding:20px;">
                    <div style="display:flex;flex-direction:column;gap:16px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;">
                            <span style="color:#666;font-size:13px;">当前版本</span>
                            <span style="color:#333;font-size:14px;font-weight:600;">${currentVersion}</span>
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;">
                            <span style="color:#666;font-size:13px;">最新版本</span>
                            <span id="khsy-latest-version" style="color:${hasUpdate ? '#10b981' : (checkFailed ? '#ef4444' : '#333')};font-size:14px;font-weight:600;">${latestVersion}</span>
                        </div>
                        <div id="khsy-update-status">
                            ${hasUpdate ? `
                                <div style="padding:12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;text-align:center;">
                                    <div style="font-size:13px;color:#10b981;margin-bottom:8px;">🎉 发现新版本！</div>
                                    <button class="khsy-btn khsy-btn-primary" id="khsy-goto-update" style="width:100%;">
                                        立即更新
                                    </button>
                                </div>
                            ` : isChecking ? `
                                <div style="padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;text-align:center;color:#666;font-size:13px;">
                                    <div style="margin-bottom:8px;">⏳ 正在检测更新...</div>
                                </div>
                            ` : checkFailed ? `
                                <div style="padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;text-align:center;">
                                    <div style="font-size:13px;color:#ef4444;margin-bottom:8px;">⚠️ 检测失败</div>
                                    <div style="font-size:12px;color:#666;margin-bottom:8px;">无法连接到更新服务器</div>
                                    <button class="khsy-btn" id="khsy-retry-update" style="width:100%;">
                                        重新检测
                                    </button>
                                </div>
                            ` : `
                                <div style="padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;text-align:center;color:#666;font-size:13px;">
                                    ✅ 已是最新版本
                                </div>
                            `}
                        </div>
                        <div style="padding:12px;background:rgba(255,107,107,0.1);border:1px solid rgba(255,107,107,0.3);border-radius:8px;">
                            <div style="font-size:12px;color:#ef4444;line-height:1.6;text-align:center;">
                                <strong>⚠️ 注意：</strong>更新版本之后请删除原有版本，否则会因为同时启用导致脚本不可用！！！
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const modal = UI.createModal('版本更新', content, []);
            modal.addEventListener('remove', () => {
                this.updateModalOpen = false;
                // 隐藏角标
                if (!hasUpdate) {
                    UpdateChecker.hideUpdateBadge();
                }
            });

            // 🔥 如果还没检查过更新，在后台异步检测
            if (UpdateChecker.latestVersion === null) {
                UpdateChecker.checkUpdate().then(() => {
                    // 更新弹窗内容
                    const versionEl = document.getElementById('khsy-latest-version');
                    const statusEl = document.getElementById('khsy-update-status');

                    if (versionEl && statusEl) {
                        const newLatestVersion = UpdateChecker.latestVersion || '检测失败';
                        const newHasUpdate = UpdateChecker.hasUpdate;
                        const newCheckFailed = UpdateChecker.latestVersion === null;

                        versionEl.textContent = newLatestVersion;
                        versionEl.style.color = newHasUpdate ? '#10b981' : (newCheckFailed ? '#ef4444' : '#333');

                        if (newHasUpdate) {
                            statusEl.innerHTML = `
                                <div style="padding:12px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:8px;text-align:center;">
                                    <div style="font-size:13px;color:#10b981;margin-bottom:8px;">🎉 发现新版本！</div>
                                    <button class="khsy-btn khsy-btn-primary" id="khsy-goto-update" style="width:100%;">
                                        立即更新
                                    </button>
                                </div>
                            `;
                            const updateBtn = document.getElementById('khsy-goto-update');
                            if (updateBtn) {
                                updateBtn.onclick = () => {
                                    window.open(CONFIG.UPDATE_URL, '_blank');
                                    modal.remove();
                                };
                            }
                        } else if (newCheckFailed) {
                            statusEl.innerHTML = `
                                <div style="padding:12px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;text-align:center;">
                                    <div style="font-size:13px;color:#ef4444;margin-bottom:8px;">⚠️ 检测失败</div>
                                    <div style="font-size:12px;color:#666;margin-bottom:8px;">无法连接到更新服务器</div>
                                    <button class="khsy-btn" id="khsy-retry-update" style="width:100%;">
                                        重新检测
                                    </button>
                                </div>
                            `;
                            const retryBtn = document.getElementById('khsy-retry-update');
                            if (retryBtn) {
                                retryBtn.onclick = async () => {
                                    retryBtn.textContent = '检测中...';
                                    retryBtn.disabled = true;
                                    await UpdateChecker.checkUpdate();
                                    modal.remove();
                                    this.updateModalOpen = false;
                                    this.showUpdateModal();
                                };
                            }
                        } else {
                            statusEl.innerHTML = `
                                <div style="padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;text-align:center;color:#666;font-size:13px;">
                                    ✅ 已是最新版本
                                </div>
                            `;
                        }
                    }
                });
            } else {
                // 已有缓存数据，绑定按钮事件
                if (hasUpdate) {
                    setTimeout(() => {
                        const updateBtn = document.getElementById('khsy-goto-update');
                        if (updateBtn) {
                            updateBtn.onclick = () => {
                                window.open(CONFIG.UPDATE_URL, '_blank');
                                modal.remove();
                            };
                        }
                    }, 100);
                } else if (checkFailed) {
                    setTimeout(() => {
                        const retryBtn = document.getElementById('khsy-retry-update');
                        if (retryBtn) {
                            retryBtn.onclick = async () => {
                                retryBtn.textContent = '检测中...';
                                retryBtn.disabled = true;
                                await UpdateChecker.checkUpdate();
                                modal.remove();
                                this.updateModalOpen = false;
                                this.showUpdateModal();
                            };
                        }
                    }, 100);
                }
            }
        },

        // 显示公告模态框
        async showAnnounceModal() {
            if (this.announceModalOpen) return;
            this.announceModalOpen = true;

            const content = `
                <div id="khsy-announce-content" style="min-height:200px;padding:16px;background:rgba(0,0,0,0.02);border-radius:8px;">
                    <div style="text-align:center;color:#999;padding:40px;">加载中...</div>
                </div>
            `;

            const modal = UI.createModal('📢 官方公告', content, []);
            modal.addEventListener('remove', () => { this.announceModalOpen = false; });

            // 加载公告内容
            setTimeout(async () => {
                const contentEl = document.getElementById('khsy-announce-content');
                if (!contentEl) return;

                try {
                    const res = await Http.api('/settings/public');
                    if (res.ok) {
                        const data = await res.json();
                        let announceText = '暂无公告';
                        let announceTitle = '';

                        if (typeof data === 'string') {
                            announceText = data;
                        } else if (data && typeof data === 'object') {
                            announceText = data.announce || data.announcement || data.notice || data.message || '暂无公告';
                            announceTitle = data.title || data.siteName || '';
                        }

                        contentEl.innerHTML = `
                            ${announceTitle ? `<div style="font-size:14px;font-weight:600;color:#333;margin-bottom:10px;">${Utils.escapeHtml(announceTitle)}</div>` : ''}
                            <div style="font-size:13px;color:#333;line-height:1.6;white-space:pre-wrap;word-break:break-word;">${Utils.escapeHtml(announceText)}</div>
                            <div style="margin-top:16px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.1);">
                                <a href="${CONFIG.SERVER_BASE}" target="_blank" class="khsy-btn khsy-btn-primary" style="display:inline-block;text-decoration:none;">访问官网</a>
                            </div>
                        `;
                    } else {
                        contentEl.innerHTML = '<div style="text-align:center;color:#999;padding:40px;">加载失败</div>';
                    }
                } catch (e) {
                    contentEl.innerHTML = '<div style="text-align:center;color:#999;padding:40px;">加载失败</div>';
                }
            }, 100);
        },

        // 显示下载模态框
        async showDownloadModal() {
            const topicId = VideoResolver.getTopicId();
            if (!topicId) {
                UI.toast('请在视频详情页使用下载功能');
                return;
            }

            // 检查是否已解析
            let videoUrl = null;
            const cached = VideoResolver.resolveCache.get(topicId);
            if (cached && cached.url) {
                videoUrl = cached.url;
            }

            if (!videoUrl) {
                UI.toast('请先解析视频');
                setTimeout(() => this.resolveVideo(), 500);
                return;
            }

            this.downloadVideo(videoUrl);
        },

        // 下载视频
        downloadVideo(url) {
            try {
                // 🔥 显示下载选择弹窗
                const content = `
                    <div style="text-align:center;padding:20px;">
                        <div style="margin-bottom:16px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:48px;height:48px;margin:0 auto;color:#10b981;">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </div>
                        <div style="font-size:14px;color:#333;margin-bottom:16px;">选择下载方式：</div>
                        <div style="display:flex;flex-direction:column;gap:12px;">
                            <button class="khsy-btn khsy-btn-primary" id="khsy-dl-copy-and-go" style="width:100%;">复制链接并前往下载</button>
                            <button class="khsy-btn" id="khsy-dl-copy-only" style="width:100%;">仅复制下载链接</button>
                        </div>
                        <div style="margin-top:16px;padding:12px;background:rgba(0,0,0,0.02);border-radius:8px;">
                            <div style="font-size:11px;color:#666;line-height:1.6;">
                                提示：视频为M3U8格式，需使用专业下载工具
                            </div>
                        </div>
                    </div>
                `;

                const modal = UI.createModal('下载视频', content, []);

                setTimeout(() => {
                    const copyAndGoBtn = document.getElementById('khsy-dl-copy-and-go');
                    const copyOnlyBtn = document.getElementById('khsy-dl-copy-only');

                    if (copyAndGoBtn) {
                        copyAndGoBtn.onclick = () => {
                            this.copyAndJump(url);
                            modal.remove();
                        };
                    }

                    if (copyOnlyBtn) {
                        copyOnlyBtn.onclick = () => {
                            this.copyOnly(url);
                            modal.remove();
                        };
                    }
                }, 100);
            } catch (e) {
                UI.toast('操作失败: ' + e.message);
            }
        },

        // 复制并跳转
        copyAndJump(url) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    UI.toast('✅ 链接已复制，正在跳转到下载工具...');
                    setTimeout(() => {
                        window.open('https://www.yeyulingfeng.com/tools/m3u8-downloader/', '_blank');
                    }, 800);
                }).catch(() => {
                    this.fallbackCopyAndJump(url);
                });
            } else {
                this.fallbackCopyAndJump(url);
            }
        },

        // 仅复制
        copyOnly(url) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    UI.toast('✅ 链接已复制到剪贴板');
                }).catch(() => {
                    this.fallbackCopy(url);
                });
            } else {
                this.fallbackCopy(url);
            }
        },

        // 降级复制方法
        fallbackCopy(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                UI.toast('✅ 链接已复制到剪贴板');
            } catch (e) {
                UI.toast('复制失败，请手动复制链接');
            }
            document.body.removeChild(textarea);
        },

        // 降级复制并跳转方法
        fallbackCopyAndJump(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                UI.toast('✅ 链接已复制，正在跳转到下载工具...');
                setTimeout(() => {
                    window.open('https://www.yeyulingfeng.com/tools/m3u8-downloader/', '_blank');
                }, 800);
            } catch (e) {
                UI.toast('复制失败，请手动复制链接');
            }
            document.body.removeChild(textarea);
        }
    };

    // ==================== 视频预加载 ====================
    // 防重复预加载标志
    const preloadedVideos = new Set();

    async function preloadVideo() {

        const topicId = VideoResolver.getTopicId();
        if (!topicId) {
            return;
        }

        if (preloadedVideos.has(String(topicId))) {
            return;
        }

        const cached = VideoResolver.contentTypeCache.get(String(topicId));

        if (!cached || (cached.paymentType !== 'diamond' && cached.paymentType !== 'coin')) {
            return;
        }

        preloadedVideos.add(String(topicId));

        try {
            // 调用解析接口（不打开播放器）
            const url = await VideoResolver.resolveFull();

            if (url) {

                const btnResolve = document.getElementById('khsy-btn-resolve');

                if (btnResolve) {
                    let badge = btnResolve.querySelector('.khsy-ready-badge');
                    if (!badge) {
                        badge = document.createElement('div');
                        badge.className = 'khsy-ready-badge';
                        btnResolve.appendChild(badge);
                    }


                    if (!preloadedVideos.has(String(topicId) + '_toasted')) {
                        UI.toast('✅ 视频已解析，可直接播放', 'success', 2000);
                        preloadedVideos.add(String(topicId) + '_toasted');
                    }
                }
            }
        } catch (e) {
        }
    }


    // ==================== 初始化 ====================

    // 图片加载器 - 从attachments数据中提取并显示图片
    async function loadUnlockedImages() {
        try {
            // 检查是否在详情页
            const topicId = VideoResolver.getTopicId();
            if (!topicId) return;

            // 从缓存中获取帖子信息
            const cached = VideoResolver.contentTypeCache.get(String(topicId));
            if (!cached || !cached.attachments) return;

            // 提取所有图片附件
            const imageAttachments = cached.attachments.filter(att =>
                att.category === 'images' || att.category === 'image'
            );

            if (imageAttachments.length === 0) return;

            // 查找内容区域 - 尝试多种选择器
            let contentArea = null;
            const selectors = [
                '.topic-content',
                '.content',
                'article',
                '.post-content',
                '.detail-content',
                '.topic-detail',
                '.post-detail',
                '.main-content',
                '[class*="content"]',
                '[class*="detail"]',
                '[class*="topic"]',
                '[class*="post"]',
                'main',
                '.container',
                '#app',
                'body'
            ];

            for (const selector of selectors) {
                contentArea = document.querySelector(selector);
                if (contentArea) break;
            }

            // 如果还是找不到，尝试找#wt-resources-box或.sell-btn的父元素
            if (!contentArea) {
                const resourceBox = document.querySelector('#wt-resources-box');
                const sellBtn = document.querySelector('.sell-btn');
                if (resourceBox) {
                    contentArea = resourceBox;
                } else if (sellBtn) {
                    contentArea = sellBtn.parentElement;
                }
            }

            if (!contentArea) return;

            // 检查是否已经插入过图片
            if (contentArea.querySelector('.khsy-unlocked-images')) return;

            // 创建图片提示容器（因为图片无法加载）
            const imageContainer = document.createElement('div');
            imageContainer.className = 'khsy-unlocked-images';
            imageContainer.style.cssText = 'margin-top:20px;padding:20px;background:linear-gradient(135deg, rgba(255,107,107,0.05) 0%, rgba(238,90,111,0.05) 100%);border-radius:12px;border:1px solid rgba(255,107,107,0.2);';

            const imageCount = imageAttachments.length;
            imageContainer.innerHTML = `
                <div style="text-align:center;">
                    <div style="font-size:48px;margin-bottom:15px;">📷</div>
                    <div style="font-size:16px;color:#333;font-weight:500;margin-bottom:10px;">
                        此帖子包含 ${imageCount} 张图片
                    </div>
                    <div style="font-size:14px;color:#666;line-height:1.6;">
                        图片需要海角网站的真实VIP权限才能查看<br>
                        目前插件暂时无法解锁图片内容
                    </div>
                </div>
            `;

            // 插入到内容区域
            contentArea.appendChild(imageContainer);

        } catch (e) {
        }
    }


    // ==================== 广告移除功能 ====================
    function removeAds() {
        try {
            // 查找所有广告元素
            const adSelectors = [
                '.page-container',
                '.containeradvertising',
                '.van-overlay',
                '.topbanmer',
                '.bannerliststyle',
                '.custom_carousel'
            ];

            let removedCount = 0;

            // 移除所有匹配的广告元素
            adSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        element.remove();
                        removedCount++;
                    }
                });
            });

            // 特殊处理：移除ishide类（显示被隐藏的内容）
            const htmlBox = document.querySelector('.html-box');
            if (htmlBox && htmlBox.classList.contains('ishide')) {
                htmlBox.classList.remove('ishide');
                removedCount++;
            }

            // 移除底部HTML盒子
            const htmlBottomBox = document.querySelector('.html-bottom-box');
            if (htmlBottomBox) {
                htmlBottomBox.remove();
                removedCount++;
            }

            return removedCount;
        } catch (e) {
            // 忽略错误，避免影响主功能
            return 0;
        }
    }

    // 使用MutationObserver监听DOM变化，实时移除广告
    function startAdBlocker() {
        // 立即执行一次
        removeAds();

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver((mutations) => {
            // 检查是否有新增的节点
            let hasNewNodes = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    hasNewNodes = true;
                    break;
                }
            }

            // 如果有新节点，检查并移除广告
            if (hasNewNodes) {
                removeAds();
            }
        });

        // 开始观察整个文档的变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 前3秒内每500ms检查一次（快速移除初始广告）
        let quickCheckCount = 0;
        const quickCheckTimer = setInterval(() => {
            removeAds();
            quickCheckCount++;
            if (quickCheckCount >= 6) { // 3秒后停止快速检查
                clearInterval(quickCheckTimer);
            }
        }, 500);

        // 之后每5秒检查一次（兜底机制）
        const regularCheckTimer = setInterval(removeAds, 5000);

        // 页面卸载时清除定时器和观察器
        window.addEventListener('beforeunload', () => {
            clearInterval(quickCheckTimer);
            clearInterval(regularCheckTimer);
            observer.disconnect();
        });
    }

    // ==================== 初始化 ====================
    function init() {

        setupHttpInterceptor();

        // UI相关操作等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startUI);
        } else {
            startUI();
        }

        // 启动广告拦截器
        if (document.body) {
            startAdBlocker();
        } else {
            // 如果body还没加载，等待DOM加载完成
            document.addEventListener('DOMContentLoaded', startAdBlocker);
        }
    }

    // ==================== HTTP拦截器：隐藏金币图片 ====================

    // 处理单个帖子的付费信息
    function processSingleTopic(topic) {
        if (!topic) return;

        // 快速检查：如果已缓存，跳过处理
        const topicId = topic.topicId || topic.topic_id || topic.id;
        if (topicId && VideoResolver.contentTypeCache.has(String(topicId))) {
            return; // 已处理过，跳过
        }

        // 检测内容类型
        let hasVideo = -1;
        let hasImages = false;
        let hasAudio = false;

        // 检查是否有attachments字段（热门列表可能没有）
        const hasAttachmentsField = topic.attachments && Array.isArray(topic.attachments);

        // 如果有attachments字段，详细检测
        if (hasAttachmentsField) {
            topic.attachments.forEach((attachment, index) => {
                if (attachment.category === 'video') {
                    hasVideo = index;
                }
                if (attachment.category === 'images' || attachment.category === 'image') {
                    hasImages = true;
                }
                if (attachment.category === 'audio') {
                    hasAudio = true;
                }
            });
        } else {
            // 热门列表没有attachments，使用hasVideo/hasPic字段判断
            if (topic.hasVideo === true || topic.hasVideo === 1) {
                hasVideo = 0; // 假设第一个位置是视频
            }
            if (topic.hasPic === true || topic.hasPic === 1) {
                hasImages = true;
            }
            if (topic.hasAudio === true || topic.hasAudio === 1) {
                hasAudio = true;
            }
        }

        // 判断付费类型：使用money_type字段（0=免费, 1=金币, 2=钻石）
        let paymentType = 'free';
        let paymentAmount = 0;
        let originalSale = null;

        // 优先使用sale字段（帖子详情），因为它是真实的付费状态
        if (topic.sale) {
            originalSale = JSON.parse(JSON.stringify(topic.sale));
            paymentAmount = topic.sale.amount || 0;
            const moneyType = topic.sale.money_type;

            // 根据money_type判断帖子类型
            if (moneyType === 2) {
                paymentType = 'diamond';
            } else if (moneyType === 1) {
                paymentType = 'coin';
            } else if (moneyType === 0 || !moneyType) {
                paymentType = 'free';
            }
        }
        // 备用：使用顶层的money_type字段（热门帖子列表，但不太准确）
        else if ('money_type' in topic) {
            paymentAmount = topic.amount || 0;
            const moneyType = topic.money_type;

            if (moneyType === 2) {
                paymentType = 'diamond';
            } else if (moneyType === 1) {
                paymentType = 'coin';
            } else if (moneyType === 0 || !moneyType) {
                paymentType = 'free';
            }
        }

        // 保存到缓存
        if (topicId) {
            const videoAttachment = (hasVideo >= 0 && topic.attachments) ? topic.attachments[hasVideo] : null;

            VideoResolver.contentTypeCache.set(String(topicId), {
                hasVideo: hasVideo >= 0,
                hasImages: hasImages,
                hasAudio: hasAudio,
                videoAttachment: videoAttachment,
                paymentType: paymentType,
                paymentAmount: paymentAmount,
                originalSale: originalSale,
                attachments: topic.attachments || [],  // 🔥 缓存attachments数组供图片加载使用
                title: Crypto.fixUtf8(topic.title || ''),  // 修复UTF-8编码并保存标题
                timestamp: Date.now()
            });

            // 如果Auth.vip已确认（API响应晚于Auth.fetchUserInfo），立即触发预加载
            const currentTopicId = VideoResolver.getTopicId();
            const isPaidVideo = (paymentType === 'diamond' || paymentType === 'coin');

            if (String(currentTopicId) === String(topicId) && videoAttachment && Auth.vip && isPaidVideo) {
                setTimeout(() => {
                    preloadVideo();
                }, 500);
            }
        }
    }

    function setupHttpInterceptor() {
        // 保存Crypto模块引用，避免和window.Crypto冲突
        const CryptoModule = Crypto;

        const originOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            const isApiRequest = url.includes('/api/');

            if (isApiRequest) {
                const xhr = this;
                const getter = Object.getOwnPropertyDescriptor(
                    XMLHttpRequest.prototype,
                    "response"
                ).get;

                // 🔥 拦截海角网站的用户信息API，伪造海角网站的VIP状态（不拦截khsy.cc的API）
                const isHaijaoUserApi = (url.includes('/user/me') || url.includes('/user/current') || url.includes('/api/user/info'))
                                        && !url.includes('khsy.cc');

                if (isHaijaoUserApi) {
                    Object.defineProperty(xhr, "responseText", {
                        get: () => {
                            let result = getter.call(xhr);
                            try {
                                let res = JSON.parse(result);

                                // 🔥 处理被封禁用户的情况
                                if (res && res.success === false && res.message && (res.message.includes('禁') || res.message.includes('封'))) {
                                    // 提取用户ID
                                    const uidMatch = url.match(/\/api\/user\/info\/(\d+)/);
                                    const userId = uidMatch ? parseInt(uidMatch[1]) : 0;

                                    // 伪造一个被封禁用户的基本信息
                                    const bannedUserData = {
                                        id: userId,
                                        nickname: '被封禁用户',
                                        avatar: '',
                                        description: '该用户已被封禁',
                                        topicCount: 0,
                                        videoCount: 0,
                                        commentCount: 0,
                                        fansCount: 0,
                                        favoriteCount: 0,
                                        status: 0,
                                        sex: 0,
                                        vip: 0,
                                        vipExpiresTime: '0001-01-01 00:00:00',
                                        certified: false,
                                        forbidden: true,
                                        role: 0,
                                        popularity: 0,
                                        diamondConsume: 0,
                                        title: {
                                            id: 0,
                                            name: '',
                                            consume: 0,
                                            consumeEnd: 0,
                                            icon: ''
                                        }
                                    };

                                    // 构建完整的用户信息对象
                                    const fullUserData = {
                                        user: bannedUserData,
                                        isFavorite: false,
                                        likeCount: 0
                                    };

                                    // 返回成功的响应
                                    res.success = true;
                                    res.message = '';
                                    res.errorCode = 0;
                                    res.isEncrypted = true;

                                    // 加密数据
                                    try {
                                        res.data = CryptoModule.encode(JSON.stringify(fullUserData), true);
                                    } catch (e1) {
                                        try {
                                            res.data = CryptoModule.encode(JSON.stringify(fullUserData));
                                        } catch (e2) {
                                            res.data = fullUserData;
                                            res.isEncrypted = false;
                                        }
                                    }

                                    return JSON.stringify(res);
                                }

                                // 确保响应成功且有data字段
                                if (res && res.success !== false && res.data) {
                                    // 尝试解密用户信息
                                    let userData;
                                    try {
                                        userData = JSON.parse(CryptoModule.decode(res.data));
                                    } catch (e1) {
                                        try {
                                            userData = JSON.parse(CryptoModule.decode(res.data, true));
                                        } catch (e2) {
                                            // 如果解密失败，尝试直接解析
                                            if (typeof res.data === 'object') {
                                                userData = res.data;
                                            } else {
                                                return result;
                                            }
                                        }
                                    }

                                    // 🔥 伪造海角网站的VIP状态 - VIP4等级
                                    if (userData) {
                                        userData.vip = 4;           // VIP等级设置为4
                                        userData.vipStatus = 4;     // VIP状态设置为4
                                        userData.vipLevel = 4;      // VIP级别设置为4
                                        userData.vipGrade = 4;      // VIP档次设置为4
                                        userData.vipType = 4;       // VIP类型设置为4
                                        userData.memberLevel = 4;   // 会员级别设置为4
                                        userData.isVip = true;      // VIP标志
                                        userData.isPremium = true;  // 高级会员标志
                                        userData.isSuper = true;    // 超级会员标志
                                        // 设置一个很远的过期时间
                                        userData.vipExpireAt = '2099-12-31 23:59:59';
                                        userData.vipExpiresTime = '2099-12-31 23:59:59';

                                        // 重新加密数据
                                        try {
                                            const userDataStr = JSON.stringify(userData);
                                            // 尝试原加密方式
                                            try {
                                                res.data = CryptoModule.encode(userDataStr);
                                            } catch (e1) {
                                                try {
                                                    res.data = CryptoModule.encode(userDataStr, true);
                                                } catch (e2) {
                                                    res.data = userData;
                                                }
                                            }
                                            return JSON.stringify(res);
                                        } catch (encodeError) {
                                            return result;
                                        }
                                    }
                                }
                                return result;
                            } catch (error) {
                                return result;
                            }
                        },
                        configurable: true
                    });

                    // 同时设置response属性
                    Object.defineProperty(xhr, "response", {
                        get: () => {
                            return xhr.responseText;
                        },
                        configurable: true
                    });
                } else {
                    // 处理其他API请求（帖子内容解锁）
                    Object.defineProperty(xhr, "responseText", {
                        get: () => {
                            let result = getter.call(xhr);

                            // 安全第一：任何错误都返回原始数据
                            try {
                                let res = JSON.parse(result);

                                if (!res || !res.data) {
                                    return result;
                                }

                                // 解密数据
                                let body;
                                let isPlus = false;
                                try {
                                    body = JSON.parse(CryptoModule.decode(res.data));
                                } catch (e1) {
                                    try {
                                        body = JSON.parse(CryptoModule.decode(res.data, true));
                                        isPlus = true;
                                    } catch (e2) {
                                        return result;
                                    }
                                }

                                // 只处理详情页帖子（有attachments字段），列表数据跳过
                                if (!body || !body.attachments || !Array.isArray(body.attachments)) {
                                    return result;
                                }

                                // 处理单个帖子（缓存付费信息）
                                processSingleTopic(body);

                                // 🔥 图片功能已禁用（避免在其他页面误显示）
                                // setTimeout(() => {
                                //     loadUnlockedImages();
                                // }, 1500);

                                // 准备免费化所需的数据
                                let hasVideo = -1;
                                let hasImages = false;
                                let allImages = {};

                                body.attachments.forEach((attachment, index) => {
                                    if (attachment.category === 'video') {
                                        hasVideo = index;
                                    }
                                    if (attachment.category === 'images' || attachment.category === 'image') {
                                        hasImages = true;
                                        // 🔥 尝试多个可能的图片URL字段
                                        const imageUrl = attachment.remoteUrl || attachment.url || attachment.src || attachment.path;
                                        if (imageUrl) {
                                            allImages[attachment.id] = imageUrl;
                                        }
                                    }
                                });

                                // 免费化：将金币内容设置为已购买（放在检测之后）
                                if (body.sale) {
                                    body.sale.money_type = 0;
                                    body.sale.amount = 0;
                                    body.sale.is_buy = true;
                                }

                                // 处理内容显示
                                if (body.content && hasVideo >= 0) {
                                    // 只处理视频，不处理图片（图片在客户端DOM处理）
                                    const videoAttachment = body.attachments[hasVideo];
                                    const insertDom = `<div><video style="display:none" src="" data-id="${videoAttachment.id}"></video></div>`;

                                    try {
                                        const regRep = /class="sell_line2"\>[^\<]+<\/span>/.exec(body.content);
                                        if (regRep && regRep[0]) {
                                            body.content = body.content
                                                .replace('<span class="sell-btn"', '<div id="wt-resources-box"><div class="sell-btn "')
                                                .replace(regRep[0], regRep[0] + insertDom + '</div></div>');
                                        } else {
                                            body.content += insertDom;
                                        }
                                    } catch (e) {
                                        body.content += insertDom;
                                    }
                                } else if (body.content && hasImages && Object.keys(allImages).length > 0) {
                                    // 🔥 处理金币贴图片显示
                                    let imagesDom = '<div class="unlocked-images-container">';
                                    Object.entries(allImages).forEach(([id, url]) => {
                                        imagesDom += `<img src="${url}" data-id="${id}" style="max-width:100%; margin:10px 0;" />`;
                                    });
                                    imagesDom += '</div>';

                                    try {
                                        const regRep = /class="sell_line2"\>[^\<]+<\/span>/.exec(body.content);
                                        if (regRep && regRep[0]) {
                                            body.content = body.content
                                                .replace('<span class="sell-btn"', '<div id="wt-resources-box"><div class="sell-btn "')
                                                .replace(regRep[0], regRep[0] + imagesDom + '</div></div>');
                                        } else {
                                            body.content += imagesDom;
                                        }
                                    } catch (e) {
                                        body.content += imagesDom;
                                    }
                                }

                                // 重新加密
                                try {
                                    const bodyStr = JSON.stringify(body);
                                    if (isPlus) {
                                        res.data = CryptoModule.encode(bodyStr, true);
                                    } else {
                                        res.data = CryptoModule.encode(bodyStr);
                                    }
                                    return JSON.stringify(res);
                                } catch (encodeError) {
                                    return result;
                                }
                            } catch (error) {
                                return result;
                            }
                        },
                        configurable: true
                    });
                }
            }

            return originOpen.call(this, method, url, ...args);
        };

        // 🔥 拦截fetch API（用于处理被封禁用户）
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            return originalFetch.apply(this, arguments).then(async response => {
                // 只处理用户信息API
                if (typeof url === 'string' && url.includes('/api/user/info') && !url.includes('khsy.cc')) {
                    const clonedResponse = response.clone();
                    try {
                        const data = await clonedResponse.json();

                        // 检测被封禁用户
                        if (data && data.success === false && data.message && (data.message.includes('禁') || data.message.includes('封'))) {
                            // 提取用户ID
                            const uidMatch = url.match(/\/api\/user\/info\/(\d+)/);
                            const userId = uidMatch ? parseInt(uidMatch[1]) : 0;

                            // 伪造被封禁用户数据
                            const bannedUserData = {
                                id: userId,
                                nickname: '被封禁用户',
                                avatar: '',
                                description: '该用户已被封禁',
                                topicCount: 0,
                                videoCount: 0,
                                commentCount: 0,
                                fansCount: 0,
                                favoriteCount: 0,
                                status: 0,
                                sex: 0,
                                vip: 0,
                                vipExpiresTime: '0001-01-01 00:00:00',
                                certified: false,
                                forbidden: true,
                                role: 0,
                                popularity: 0,
                                diamondConsume: 0,
                                title: {
                                    id: 0,
                                    name: '',
                                    consume: 0,
                                    consumeEnd: 0,
                                    icon: ''
                                }
                            };

                            const fullUserData = {
                                user: bannedUserData,
                                isFavorite: false,
                                likeCount: 0
                            };

                            // 构造新的响应
                            const newData = {
                                success: true,
                                message: '',
                                errorCode: 0,
                                isEncrypted: true,
                                data: null
                            };

                            // 尝试加密
                            try {
                                newData.data = CryptoModule.encode(JSON.stringify(fullUserData), true);
                            } catch (e1) {
                                try {
                                    newData.data = CryptoModule.encode(JSON.stringify(fullUserData));
                                } catch (e2) {
                                    newData.data = fullUserData;
                                    newData.isEncrypted = false;
                                }
                            }

                            // 返回新的Response对象
                            return new Response(JSON.stringify(newData), {
                                status: 200,
                                statusText: 'OK',
                                headers: response.headers
                            });
                        }
                    } catch (e) {
                        // 解析失败，返回原始响应
                    }
                }

                return response;
            });
        };
    }

    // ==================== 脚本初始化 ====================
    function startUI() {
        try {

            FloatPanel.create();

            if (Auth.token) {
                // 🔥 从你的服务器(khsy.cc)获取真实的VIP状态
                Auth.fetchUserInfo().then(() => {
                    FloatPanel.updateAccountButton();

                    if (Auth.vip) {
                        const isVideoPage = window.location.href.includes('/video') ||
                                           window.location.href.includes('/post/details') ||
                                           window.location.hash.includes('/topic/');

                        if (isVideoPage) {
                            const topicId = VideoResolver.getTopicId();
                            const cached = VideoResolver.contentTypeCache.get(String(topicId));
                            const paymentType = cached?.paymentType;
                            const videoAttachment = cached?.videoAttachment;
                            const currentTopicId = VideoResolver.currentTopicId;

                            const isPaidVideo = (paymentType === 'diamond' || paymentType === 'coin');

                            if (String(currentTopicId) === String(topicId) && videoAttachment && Auth.vip && isPaidVideo) {
                                setTimeout(() => {
                                    preloadVideo();
                                }, 500);
                            } else {
                                if (!cached) {
                                    setTimeout(() => {
                                        const retryTopicId = VideoResolver.getTopicId();
                                        const retryCached = VideoResolver.contentTypeCache.get(String(retryTopicId));

                                        if (retryCached && retryCached.videoAttachment && (retryCached.paymentType === 'diamond' || retryCached.paymentType === 'coin')) {
                                            preloadVideo();
                                        }
                                    }, 1000);
                                }
                            }
                        }
                    }
                });
            }

            // 检测是否在视频详情页
            const isVideoPage = window.location.href.includes('/topic/') ||
                               window.location.href.includes('/post/details') ||
                               window.location.hash.includes('/topic/');

            // 🔥 视频预加载：自动请求视频链接并显示绿色角标
        } catch (e) {
        }
    }

    // 暴露到控制台便于调试
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.KHSY = {
            CONFIG,
            Auth,
            Http,
            UI,
            Utils,
            Crypto,
            VideoResolver,
            Player,
            FloatPanel
        };
    }

    // 🔥 注意：不在这里强制设置VIP，VIP状态由khsy.cc服务器决定

    // 移除控制台输出

    // 启动脚本
    init();

    // 🔥 定时器：每30秒从你的服务器(khsy.cc)同步真实VIP状态
    setInterval(() => {
        if (Auth.token) {
            Auth.fetchUserInfo().then(() => {
                // 更新UI显示
                if (typeof FloatPanel !== 'undefined' && FloatPanel.updateAccountButton) {
                    FloatPanel.updateAccountButton();
                }
            }).catch(() => {
                // 忽略错误
            });
        }
    }, 30000);  // 30秒同步一次

    // 🔥 监听URL变化，离开详情页时清除绿色角标，进入详情页时触发预加载
    let lastUrl = window.location.href;
    const checkUrlChange = () => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;

            const isVideoPage = currentUrl.includes('/topic/') ||
                               currentUrl.includes('/post/details') ||
                               currentUrl.includes('#/topic/');

            if (isVideoPage) {

                if (Auth.vip) {
                    setTimeout(() => {
                        const topicId = VideoResolver.getTopicId();
                        const cached = VideoResolver.contentTypeCache.get(String(topicId));

                        if (cached && cached.videoAttachment && (cached.paymentType === 'diamond' || cached.paymentType === 'coin')) {
                            preloadVideo();
                        }
                    }, 500);
                }

                // 图片功能已禁用
                // loadUnlockedImages();
            } else {
                const btnResolve = document.getElementById('khsy-btn-resolve');
                if (btnResolve) {
                    const badge = btnResolve.querySelector('.khsy-ready-badge');
                    if (badge) {
                        badge.remove();
                    }
                }
            }
        }
    };

    // 监听history变化（单页应用）
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