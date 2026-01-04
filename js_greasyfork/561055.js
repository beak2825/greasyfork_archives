// ==UserScript==
// @name         123分享社区增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  123分享社区功能增强脚本，自动回复，链接检测，一键保存
// @author       Bao-qing
// @match        https://pan1.me/*
// @match        https://123panfx.com/*
// @match        https://*.123pan.com/*
// @match        https://*.123pan.cn/*
// @match        https://*.123684.com/*
// @match        https://*.123865.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561055/123%E5%88%86%E4%BA%AB%E7%A4%BE%E5%8C%BA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561055/123%E5%88%86%E4%BA%AB%E7%A4%BE%E5%8C%BA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
// Copyright (c) 2025 Bao-qing
// SPDX-License-Identifier: MIT

(function () {
    'use strict';

    const DEFAULT_OPTIONS = {
        defaultReplyContent: "好人一生平安，谢谢分享！",
        getShareInfoRetry: 3,
        checkLinkHost: 'www.123pan.com',
        shareApiHost: 'www.123865.com',
        panHosts: ["www.123pan.com", "www.123865.com", "www.123pan.cn"],
        floatButtonText: "记录"
    }

    /**
     * UI管理器类
     * @class UIManager
     * @param {Object} options - 配置选项
     * @param {string} options.defaultReplyContent - 默认回复内容
     * @param {string} options.styleId - 样式标签ID
     * @param {Object} options.defaultButtonOptions - 默认按钮选项
     * @param {Object} options.toastColors - Toast颜色配置
     * @param {Object} options.loadingMaskDefaults - Loading遮罩默认配置
     * @param {number} options.toastDuration - Toast显示时长（毫秒）
     */
    class UIManager {
        constructor(options = {}) {
            const defaultButtonOptions = {
                text: '按钮',
                onClick: () => console.log('点击'),
                id: '',
                className: '',
                style: '',
                type: 'default',
                size: 'medium',
                disabled: false,
                icon: ''
            };
            const toastColors = {
                success: '#16a34a',
                error: '#dc2626',
                warning: '#ea580c',
                info: '#2563eb'
            };
            const loadingMaskDefaults = {
                text: '加载中...',
                background: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                fullscreen: true
            };
            this.config = {
                defaultReplyContent: options.defaultReplyContent || DEFAULT_OPTIONS.defaultReplyContent,       // 默认回复内容
                styleId: options.styleId || 'ui-manager-styles',                                               // 样式标签ID
                defaultButtonOptions: {...defaultButtonOptions, ...(options.defaultButtonOptions || {})},
                toastColors: {...toastColors, ...(options.toastColors || {})},
                loadingMaskDefaults: {...loadingMaskDefaults, ...(options.loadingMaskDefaults || {})},
                toastDuration: options.toastDuration || 3000
            };
            this.loadingCount = 0;
            this.loadingMask = null;
        }

        init() {
            this.addStyles();
        }

        /**
         * 在指定位置添加按钮
         */
        addButton(parentElement, options = {}, position = 'beforeend') {
            const config = {...this.config.defaultButtonOptions, ...options};
            if (!parentElement) return null;

            const button = document.createElement('button');
            button.type = 'button';

            // 组装 Class
            const classes = ['ui-btn', `ui-btn-${config.type}`, `ui-btn-${config.size}`];
            if (config.disabled) classes.push('ui-btn-disabled');
            if (config.className) classes.push(config.className);
            button.className = classes.join(' ');

            if (config.id) button.id = config.id;
            if (config.style) button.style.cssText = config.style;
            button.disabled = config.disabled;

            // 图标与文本处理
            let content = '';
            if (config.icon) {
                const isImg = config.icon.match(/\.(png|jpg|jpeg|svg|gif|webp)|data:image/i);
                content += isImg ? `<img src="${config.icon}" class="ui-icon" alt="">` : `<span class="ui-icon ${config.icon}"></span>`;
            }
            content += `<span class="ui-text">${config.text}</span>`;
            button.innerHTML = content;

            if (!config.disabled) {
                button.addEventListener('click', config.onClick);
            }

            const positions = {
                'beforebegin': () => parentElement.before(button),
                'afterbegin': () => parentElement.prepend(button),
                'beforeend': () => parentElement.append(button),
                'afterend': () => parentElement.after(button)
            };
            (positions[position] || positions['beforeend'])();

            return button;
        }

        /**
         * 核心 CSS 样式（包含按钮、Loading、Toast）
         */
        addStyles() {
            if (document.getElementById(this.config.styleId)) return;
            const style = document.createElement('style');
            style.id = this.config.styleId;
            style.textContent = `
            :root {
                --ui-primary: #2563eb; --ui-success: #16a34a; --ui-warning: #ea580c;
                --ui-danger: #dc2626; --ui-info: #0891b2; --ui-gray: #f3f4f6;
            }
            /* 按钮基础样式 */
            .ui-btn {
                display: inline-flex; align-items: center; justify-content: center;
                gap: 8px; border-radius: 8px; font-weight: 500; cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                border: 1px solid transparent; outline: none; user-select: none;
                font-family: inherit; line-height: 1.5;
            }
            .ui-btn:active { transform: scale(0.96); }
            
            /* 尺寸 */
            .ui-btn-small { padding: 4px 10px; font-size: 13px; }
            .ui-btn-medium { padding: 8px 16px; font-size: 14px; }
            .ui-btn-large { padding: 12px 24px; font-size: 16px; }

            /* 类型配色 */
            .ui-btn-default { background: white; border-color: #d1d5db; color: #374151; }
            .ui-btn-default:hover { background: #f9fafb; border-color: #9ca3af; }
            .ui-btn-primary { background: var(--ui-primary); color: white; }
            .ui-btn-primary:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
            .ui-btn-success { background: var(--ui-success); color: white; }
            .ui-btn-danger { background: var(--ui-danger); color: white; }
            
            .ui-btn-disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
            .ui-icon { display: flex; align-items: center; width: 1.1em; height: 1.1em; }
            .ui-icon img { width: 100%; height: 100%; object-fit: contain; }

            /* Loading 遮罩 */
            .ui-mask {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                gap: 12px; transition: opacity 0.3s; backdrop-filter: blur(4px);
            }
            .ui-spinner {
                width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.3);
                border-radius: 50%; border-top-color: #fff; animation: ui-spin 0.8s linear infinite;
            }
            @keyframes ui-spin { to { transform: rotate(360deg); } }

            /* Toast 提示 */
            .ui-toast {
                position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
                z-index: 10001; padding: 10px 20px; border-radius: 10px;
                color: white; font-size: 14px; font-weight: 500;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                opacity: 0; transform: translate(-50%, -20px);
            }
            .ui-toast.show { opacity: 1; transform: translate(-50%, 0); }
        `;
            document.head.appendChild(style);
        }

        postReply(content = this.config.defaultReplyContent || "感谢分享！") {
            const pageIdMatch = document.location.href.match(/thread-(\d+)\.htm/);
            if (!pageIdMatch) return Promise.reject("Page ID not found");

            const pageId = pageIdMatch[1];
            const fullUrl = `${document.location.origin}${document.location.pathname}?post-create-${pageId}-1.htm=`;

            const data = new URLSearchParams({
                "doctype": "1", "return_html": "1", "quotepid": "0",
                "message": content, "quick_reply_message": "1"
            });

            return fetch(fullUrl, {
                method: 'POST',
                body: data,
                credentials: 'same-origin',
                headers: {"x-requested-with": "XMLHttpRequest"}
            }).then(res => res.text());
        }

        postReplyAndRefresh() {
            // 检查是否成功提交
            this.postReply().then(responseText => {
                const jsonData = JSON.parse(responseText);
                if (jsonData.code === "0") {
                    this.showToast("回复成功，页面即将刷新", "success");
                    setTimeout(() => location.reload(), 200);
                } else {
                    this.showToast(`回复失败：${jsonData.message || '未知错误'}`, "error");
                }
            })
        }

        changeLinkStyle(linkElement, type, message = "链接无效") {
            if (!linkElement) return;
            const color = type === "success" ? "#16a34a" : "#dc2626";
            const icon = type === "success" ? "✅ " : "❌ ";
            linkElement.style.color = color;
            linkElement.style.fontWeight = "bold";
            linkElement.innerHTML = icon + linkElement.innerHTML + (type === "error" ? ` (${message})` : "");
        }

        extractMultipleInfos(html) {
            const urlRegex = /https?:\/\/[^\s"<>]*\/s\/[A-Za-z0-9-]{4,}[^\s"<>?]*/g;

            let matches = [];
            let match;
            while ((match = urlRegex.exec(html)) !== null) {
                matches.push({
                    url: match[0].replace(/[?&]+$/, ''), // 去掉末尾的 ? 或 &
                    index: match.index,
                    length: match[0].length
                });
            }

            // 去重
            const uniqueMatches = [];
            matches.forEach(m => {
                const lastMatch = uniqueMatches[uniqueMatches.length - 1];

                // 判断是否是同一个链接的重复出现（距离阈值 300）
                if (lastMatch && lastMatch.url === m.url && (m.index - (lastMatch.index + lastMatch.length) < 300)) {
                    // 提取码在显示文本后面，从这里开始找。
                    uniqueMatches[uniqueMatches.length - 1] = m;
                } else {
                    uniqueMatches.push(m);
                }
            });

            // 3. 提取提取码
            const codeRegex = /(?:提取码|查询码|密码|访问码|码)[:：\s]*([a-zA-Z0-9]{4})/i;

            return uniqueMatches.map((m, i) => {
                // 搜索范围：从当前链接结束，到下一个链接开始
                const nextMatchIndex = uniqueMatches[i + 1] ? uniqueMatches[i + 1].index : html.length;
                const searchZone = html.substring(m.index + m.length, nextMatchIndex);

                const codeMatch = searchZone.match(codeRegex);

                return {
                    link: m.url,
                    code: codeMatch ? codeMatch[1] : null
                };
            });
        }


        showLoadingMask(options = {}) {
            const config = {...this.config.loadingMaskDefaults, ...options};
            if (this.loadingMask) {
                this.loadingCount++;
                return this.loadingMask;
            }

            // this.addLoadingMaskStyles(); // 确保样式存在

            const mask = document.createElement('div');
            mask.className = 'ui-mask';
            mask.style.backgroundColor = config.background;
            mask.style.position = config.fullscreen ? 'fixed' : 'absolute';

            mask.innerHTML = `
            <div class="ui-spinner"></div>
            <div style="color: ${config.color}; font-size: 14px;">${config.text}</div>
        `;

            const target = config.parentSelector ? document.querySelector(config.parentSelector) : document.body;
            if (!config.fullscreen && target) target.style.position = 'relative';

            target.appendChild(mask);
            setTimeout(() => mask.style.opacity = '1', 10);

            this.loadingMask = mask;
            this.loadingCount = 1;
            return mask;
        }

        hideLoadingMask(force = false) {
            this.loadingCount--;
            if ((force || this.loadingCount <= 0) && this.loadingMask) {
                this.loadingMask.style.opacity = '0';
                setTimeout(() => {
                    this.loadingMask?.remove();
                    this.loadingMask = null;
                    this.loadingCount = 0;
                }, 300);
            }
        }

        async withLoadingMask(asyncFunc, options = {}) {
            this.showLoadingMask(options);
            try {
                return await asyncFunc();
            } finally {
                this.hideLoadingMask();
            }
        }

        showToast(message, type = 'info', duration = this.config.toastDuration) {
            // this.addStyles();
            const toast = document.createElement('div');
            toast.className = `ui-toast`;

            const colors = this.config.toastColors;
            toast.style.backgroundColor = colors[type] || colors.info;
            toast.textContent = message;

            document.body.appendChild(toast);

            // 触发重绘以执行动画
            requestAnimationFrame(() => toast.classList.add('show'));

            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

    }

    /**
     * 链接管理器类
     * @class linkManager
     * @param {Object} options - 配置选项
     */
    class linkManager {
        constructor(options = {}) {
            const defaults = {
                host: DEFAULT_OPTIONS.checkLinkHost,                    // 链接检测api主机名 也可以是www.123865.com等
                checkPath: '/gsb/s/',                                   // 检查路径
                shareApiHost: DEFAULT_OPTIONS.shareApiHost,             // 分享API主机名
                shareGetPath: '/b/api/share/get',                       // 分享获取路径
                savePath: '/b/api/restful/goapi/v1/file/copy/save',     // 保存到网盘api路径
                shareGetLimit: '100',                                   // 分享获取单页限制，最大100
                requestRetry: DEFAULT_OPTIONS.getShareInfoRetry,        // 获取分享内容时的请求重试次数
                gmStorageKey: 'panLoginInfo',                           // GM存储键
                defaultParentFileId: '0'                                // 保存文件默认父文件ID，根目录为0，一般不会使用
            };
            this.config = {...defaults, ...options};
            this.host = this.config.host;
            this.check_path = this.config.checkPath;
        }

        // 生成签名函数
        getSign(path, platform = 'web') {
            function A(t, e = 10) {
                const n = (function () {
                    const t = [];
                    for (let e = 0; e < 256; e++) {
                        let n = e;
                        for (let r = 0; r < 8; r++)
                            n = 1 & n ? 3988292384 ^ (n >>> 1) : n >>> 1;
                        t[e] = n;
                    }
                    return t;
                })();
                const r = t.replace(/\r\n/g, "\n");
                let a = -1;
                for (let i = 0; i < r.length; i++)
                    a = (a >>> 8) ^ n[(255 & (a ^ r.charCodeAt(i)))];
                return ((-1 ^ a) >>> 0).toString(e);
            }

            function generateTimestamp() {
                return Math.round(((new Date).getTime() + 60 * (new Date).getTimezoneOffset() * 1e3 + 288e5) / 1e3).toString();
            }

            function adjustTimestamp(o, timestamp) {
                if (timestamp) {
                    var i = timestamp;
                    var m = i;
                    if (20 <= Math.abs(1e3 * o - 1e3 * m) / 1e3 / 60) {
                        return i;
                    }
                }
                return o;
            }

            function formatDate(t, e, n) {
                var r;
                n = 8
                t = 1000 * Number.parseInt(t);
                t += 60000 * new Date(t).getTimezoneOffset();
                var data = {
                    y: (r = new Date(t + 36e5 * n)).getFullYear(),
                    m: r.getMonth() + 1 < 10 ? "0".concat(r.getMonth() + 1) : r.getMonth() + 1,
                    d: r.getDate() < 10 ? "0".concat(r.getDate()) : r.getDate(),
                    h: r.getHours() < 10 ? "0".concat(r.getHours()) : r.getHours(),
                    f: r.getMinutes() < 10 ? "0".concat(r.getMinutes()) : r.getMinutes()
                }
                return data
            }

            function generateSignature(a, o, e, n, r) {
                var s = ["a", "d", "e", "f", "g", "h", "l", "m", "y", "i", "j", "n", "o", "p", "k", "q", "r", "s", "t", "u", "b", "c", "v", "w", "s", "z"];
                var u = formatDate(o);
                var h = u.y;
                var g = u.m;
                var l = u.d;
                var c = u.h;
                var u = u.f;
                var d = [h, g, l, c, u].join("");
                var f = [];
                for (var p in d) {
                    f.push(s[Number(d[p])]);
                }
                h = A(f.join(""));
                g = A("".concat(o, "|").concat(a, "|").concat(e, "|").concat(n, "|").concat(r, "|").concat(h));
                return [h, "".concat(o, "-").concat(a, "-").concat(g)];
            }

            var a = Math.round(1e7 * Math.random());
            var o = generateTimestamp();
            o = adjustTimestamp(o, new Date().getTime() / 1000);
            var r = 3;
            return generateSignature(a, o, path, platform, r);
        }


        buildUrl(url, params) {
            const resolvedParams = params || {};
            const signData = this.getSign(new URL(url).pathname, 'web');
            resolvedParams[signData[0]] = signData[1];
            const queryString = new URLSearchParams(resolvedParams).toString();
            return url + "?" + queryString;
        }

        /**
         * HTTP请求函数，自动加签，使用GM_xmlhttpRequest发送请求
         * @param {string} method - HTTP方法（GET, POST, PUT, DELETE等）
         * @param {string} url - 请求URL
         * @param {Object|string|null} data - 请求数据（可选）
         * @param {Object} options - 其他请求选项（可选）
         * @param {Object} options.params - URL查询参数对象
         * @param {Object} options.headers - 额外请求头对象
         * @param {string} options.responseType - 响应类型（'json', 'text', 'blob', 'arraybuffer', 'document'）
         * @param {number} options.timeout - 请求超时时间（毫秒）
         * @returns {Promise} 返回一个Promise，解析为响应数据
         */
        async sendRequest(method, url, data = null, options = {}) {
            return new Promise((resolve, reject) => {
                const params = options.params || {};
                url = this.buildUrl(url, params);
                const requestOptions = {
                    method: method,
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers // 允许覆盖或添加额外请求头
                    },
                    responseType: options.responseType || 'json', // 可选项：'json', 'text', 'blob', 'arraybuffer', 'document'
                    timeout: options.timeout || 30000, // 默认30秒超时
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            // 请求成功
                            if (options.responseType === 'json') {
                                try {
                                    const jsonResponse = JSON.parse(response.responseText);
                                    console.log(`Success (${response.status}):`, jsonResponse);
                                    resolve(jsonResponse);
                                } catch (error) {
                                    console.log(`Success (${response.status}, non-JSON):`, response.responseText);
                                    resolve(response.responseText);
                                }
                            } else if (options.responseType === 'text') {
                                resolve(response.responseText);
                            } else if (options.responseType === 'blob') {
                                resolve(new Blob([response.response]));
                            } else if (options.responseType === 'arraybuffer') {
                                resolve(response.response);
                            } else {
                                resolve(response.responseText);
                            }
                        } else {
                            // 请求失败（HTTP错误状态码）
                            console.error(`Request failed with status ${response.status}:`, response.responseText);
                            reject(new Error(`Request failed with status ${response.status}`));
                        }
                    },
                    onerror: function (error) {
                        console.error('Request network error:', error);
                        reject(new Error(`Network error: ${error}`));
                    },
                    ontimeout: function () {
                        console.error('Request timeout');
                        reject(new Error('Request timeout'));
                    },
                    onabort: function () {
                        console.error('Request aborted');
                        reject(new Error('Request aborted'));
                    }
                };

                // 如果有数据，添加到请求中
                if (data) {
                    if (typeof data === 'string') {
                        requestOptions.data = data;
                    } else {
                        requestOptions.data = JSON.stringify(data);
                    }
                }

                // 添加其他选项
                if (options.timeout) requestOptions.timeout = options.timeout;
                if (options.responseType) requestOptions.responseType = options.responseType;
                if (options.overrideMimeType) requestOptions.overrideMimeType = options.overrideMimeType;
                if (options.anonymous !== undefined) requestOptions.anonymous = options.anonymous;
                if (options.user !== undefined) requestOptions.user = options.user;
                if (options.password !== undefined) requestOptions.password = options.password;

                // 发送请求
                GM_xmlhttpRequest(requestOptions);
            });
        }

        async linkCheckByKey(shareId) {
            this.fullUrl = `https://${this.config.host}${this.config.checkPath}${shareId}`;
            const checkData = await this.sendRequest('GET', this.fullUrl, null, {responseType: 'json'});
            if (checkData == null) {
                console.log('Error:', checkData);
                return {
                    code: -1,
                    message: '请求失败'
                };
            }


            if (checkData.info.code !== 0) {
                console.error('链接失效:', checkData.message);
                return {
                    code: checkData.info.code,
                    message: checkData.info.message
                };
            } else {
                console.log('链接有效:', checkData);
                return {
                    code: 0,
                    message: '链接有效',
                    data: checkData.info.data
                }
            }
        }

        /**
         * 通过分享链接解析并检查链接有效性
         * @param {string} shareUrl - 分享链接URL
         * @returns {Object} 包含检查结果的对象，格式为 { code: number, message: string }
         * code: 0表示有效，-1表示无效或解析失败
         */
        async linkCheckByUrl(shareUrl) {
            const match = await this.linkParse(shareUrl);
            if (!match) {
                console.log("链接解析失败");
                return {
                    code: -1,
                    message: "链接解析失败"
                }
            }
            const host = match[1];        // www.123865.com
            const shareKey = match[2];     // NaGDVv-Mg6Y
            const password = match[3];    // 8888
            console.log({host, shareId: shareKey, password});

            // const shareId = shareIdMatch[1];
            console.log("提取到的分享ID:", shareKey);
            const result = await this.linkCheckByKey(shareKey);
            return result;

        }

        async linkParse(shareUrl) {
            const pattern = /https?:\/\/([^/]+)\/s\/([A-Za-z0-9_-]+)(?:\?pwd=([A-Za-z0-9_-]{4}))?/;
            const match = shareUrl.match(pattern);
            return match
        }

        async shareGetOnePage(shareKey, sharePwd, host, ParentFileId, page) {
            const resolvedHost = host || this.config.shareApiHost;
            const resolvedParentId = (ParentFileId ?? this.config.defaultParentFileId).toString();
            const resolvedPage = (page || 1).toString();
            const shareGetUrl = `https://${resolvedHost}${this.config.shareGetPath}`;
            const params = {
                limit: this.config.shareGetLimit.toString(),
                next: "0",
                orderBy: "file_name",
                orderDirection: "asc",
                shareKey,
                ParentFileId: resolvedParentId,
                Page: resolvedPage,
                event: "homeListFile",
                operateType: resolvedParentId === "0" ? "1" : "4",
                OrderId: "",
                superAdmin: "null",
                SharePwd: sharePwd
            };

            const resData = await this.sendRequest("get", shareGetUrl, null, {
                params,
                responseType: 'json'
            })
            if (resData.code !== 0) {
                console.log("获取文件列表错误", resData.message);
                return {
                    code: resData.code,
                    data: {},
                    message: resData.message
                }
            }
            return resData
            console.log(resData);
        }

        /**
         * 获取分享链接的所有文件列表，处理分页
         * @param {string} shareKey - 分享链接的Key
         * @param {string} sharePwd - 分享链接的密码（如果有）
         * @param {string} host - 服务器主机名
         * @returns {Object} 包含所有文件信息的对象，格式为 { code: number, data: Array, message: string , skipPage: number }
         * code: 0表示成功，-1表示失败,-2表示提取码错误
         * skipPage: 如果在获取过程中发生错误并跳过分页，则为1，否则为0
         *
         */
        async shareGetAllPages(shareKey, sharePwd, host) {
            let InfoList = [];
            let page = 1;
            let skipPage = 0;
            let nextPage = true;
            while (nextPage) {

                // 三次重试机制
                let attempt = 0;
                let resData = null;
                while (attempt < this.config.requestRetry) {
                    try {
                        resData = await this.shareGetOnePage(shareKey, sharePwd, host, "0", page);
                        if (resData.code !== 0) {
                            console.log("获取文件列表错误", resData.message);
                            if (resData.code == 5103) {
                                // 提取码错误，停止获取
                                skipPage = 1;
                                console.error("获取文件列表错误，提取码错误，停止获取", resData.message);
                                return {
                                    code: -2,
                                    data: {},
                                    message: resData.message,
                                    skipPage: skipPage
                                }
                            }
                            throw new Error(resData.message);
                        }
                        break; // 成功，跳出重试循环
                    } catch (error) {
                        attempt++;
                        console.log(`获取文件列表失败，正在重试 (${attempt}/3)...`, error);
                        if (attempt === this.config.requestRetry) {
                            resData = {
                                code: -1,
                                data: {},
                                message: "获取文件列表失败，已达最大重试次数"
                            };
                            skipPage = 1;
                            console.error("获取文件列表错误，已达最大重试次数", resData.message);
                        }
                    }
                }

                InfoList = InfoList.concat(resData.data.InfoList);
                // 如果不是最后一页，继续获取下一页 （不知道为什么123要叫这个“IsFirst”）
                // IsFirst = false 继续获取，null 或 true 停止获取
                nextPage = resData.data.IsFirst === false;
                page += 1;
            }
            return {
                code: 0,
                data: InfoList,
                message: "获取成功",
                skipPage: skipPage
            };
        };

        /**
         * 保存文件到用户网盘
         * @param {string} shareKey - 分享链接的Key
         * @param {string} sharePwd - 分享链接的密码（如果有）
         * @param {string} host - 服务器主机名
         * @param {Array} InfoList - 要保存的文件信息列表
         * @param {string} parentFileID - 保存到的目标文件夹ID
         * @param {string} authorization - 用户的Authorization令牌
         * @param {string} loginUuid - 用户的LoginUuid
         * @returns {Object} 保存结果对象，格式为 { code: number, message: string }
         * code: 0 表示成功，或 resData.code，来自123云盘api，具体含义暂不知
         */
        async saveFile(shareKey, sharePwd, host, InfoList, parentFileID, authorization, loginUuid) {
            const resolvedHost = host || this.config.shareApiHost;
            const saveUrl = `https://${resolvedHost}${this.config.savePath}`;
            let fileList = [];
            for (const info of InfoList) {
                fileList.push({
                    "fileID": info.FileId,
                    "size": info.Size,
                    "etag": info.Etag,
                    "type": info.Type,
                    "parentFileID": parentFileID,
                    "fileName": info.FileName,
                    "driveID": 0
                });
            }

            const fileData = {
                fileList: fileList,
                shareKey: shareKey,
                sharePwd: sharePwd,
                currentLevel: 0,
                superAdmin: null
            }

            const resData = await this.sendRequest("post", saveUrl, fileData, {
                responseType: 'json',
                headers: {
                    //'Content-Type': 'application/json'
                    Authorization: "Bearer " + authorization,
                    LoginUuid: loginUuid
                },
                data: fileData
            })
            if (resData.code !== 0) {
                console.log("保存文件错误", resData.message);
                return {
                    code: resData.code,
                    message: resData.message
                }
            }
            return {
                code: 0,
                message: "保存成功"
            }
        }

        /**
         * 保存分享链接的所有文件到用户网盘
         * */
        async saveAllFilesFromShareKey(shareKey, sharePwd, host, parentFileID, authorization, loginUuid) {
            const getRes = await this.shareGetAllPages(shareKey, sharePwd, host);
            if (getRes.code !== 0) {
                return {
                    code: getRes.code,
                    message: getRes.message
                }
            }
            const saveRes = await this.saveFile(shareKey, sharePwd, host, getRes.data, parentFileID, authorization, loginUuid);
            if (saveRes.code !== 0) {
                return {
                    code: saveRes.code,
                    message: saveRes.message
                }
            }
            return {
                code: 0,
                message: "保存成功"
            }
        }

        getAuthInfo() {
            const panlogInfo = GM_getValue(this.config.gmStorageKey);
            if (!panlogInfo) {
                return {
                    authorization: null,
                    loginUuid: null,
                    parentFileId: null
                }
            }

            return panlogInfo
        }

        /**
         * 保存分享链接的所有文件到用户网盘（通过分享链接URL）
         * @param {string} shareUrl - 分享链接的完整URL
         * @param {string} parentFileID - 保存到的目标文件夹ID
         * @returns {Object} 保存结果对象，格式为 { code: number, message: string }
         * code: 0 表示成功，-1 解析失败，-2 未找到授权信息，saveRes.code 来自保存文件的结果
         */
        async saveAllFilesFromShareUrl(shareUrl, parentFileID, authorization, loginUuid) {
            const parseRes = await this.linkParse(shareUrl);
            if (!parseRes) {
                return {
                    code: -1,
                    message: "链接解析失败"
                }
            }
            // 链接检查
            const checkRes = await this.linkCheckByKey(parseRes[2]);
            if (checkRes.code !== 0) {
                return {
                    code: checkRes.code,
                    message: checkRes.message
                }
            }
            const host = parseRes[1];
            const shareKey = parseRes[2];
            const sharePwd = parseRes[3] || null;
            // const panLogInfo = this.getAuthInfo();
            // const authorization = panLogInfo.authorization;
            // const loginUuid = panLogInfo.loginUuid;
            // const parentFileId = parentFileID || panLogInfo.parentFileId || "0";
            if (!authorization || !loginUuid) {
                return {
                    code: -2,
                    message: "未找到授权信息，请先前往设置"
                }
            }

            const saveRes = await this.saveAllFilesFromShareKey(shareKey, sharePwd, host, parentFileID, authorization, loginUuid);
            return saveRes;// 401：未授权，请检查Authorization和LoginUuid
        }

        async fastSave(shareUrl) {
            const panLogInfo = this.getAuthInfo();
            const authorization = panLogInfo.authorization;
            const loginUuid = panLogInfo.loginUuid;
            const parentFileId = panLogInfo.parentFileId;
            if (!authorization || !loginUuid || !parentFileId) {
                return {
                    code: -2,
                    message: "未初始化信息，请先前往设置"
                }
            }
            const saveRes = await this.saveAllFilesFromShareUrl(shareUrl, parentFileId, authorization, loginUuid);
            return saveRes;
        }
    }

    /**
     * 浮动按钮管理器类
     * @class panWebManager
     * @param {Object} options - 配置选项
     * @param {string} options.gmStorageKey - GM存储键
     * @param {Object} options.storageKeys - 存储键对象
     * @param {Object} options.button - 按钮配置对象
     */
    class panWebManager {
        constructor(options = {}) {
            const defaults = {
                gmStorageKey: 'panLoginInfo',
                storageKeys: {
                    authorization: 'authorToken',   // 存储Authorization的键
                    loginUuid: 'LoginUuid',         // 存储LoginUuid的键
                    filePath: 'filePath'            // 存储默认文件路径的键
                },
                button: {
                    text: DEFAULT_OPTIONS.floatButtonText,            // 按钮文本
                    successText: 'OK',      // 成功后文本
                    width: '50px',          // 按钮宽度
                    height: '50px',         // 按钮高度
                    idleColor: '#007bff',   // 空闲颜色
                    successColor: '#28a745',    // 成功颜色
                    shrinkDelay: 2000,       // 收缩延迟时间（毫秒）
                    initialTop: '20%',       // 初始顶部位置
                    errText: 'Err',          // 错误后文本
                    errColor: '#dc3545'      // 错误颜色
                }
            };
            this.config = {
                ...defaults,
                ...options,
                storageKeys: {...defaults.storageKeys, ...(options.storageKeys || {})},
                button: {...defaults.button, ...(options.button || {})}
            };
        }

        init() {
            this.addFloatingButton();
        }

        addFloatingButton() {
            const btnCfg = this.config.button;
            const button = document.createElement('div');
            button.id = 'pan-floating-button';
            button.innerText = btnCfg.text;
            Object.assign(button.style, {
                position: 'fixed',
                top: btnCfg.initialTop,
                right: '0px',
                width: btnCfg.width,
                height: btnCfg.height,
                backgroundColor: btnCfg.idleColor,
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'move',
                zIndex: '9999',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                userSelect: 'none',
                fontSize: '14px',
                transition: 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            });

            document.body.appendChild(button);

            let isDragging = false;
            let isHovering = false;
            let side = 'right'; // 记录在哪一侧: 'left' | 'right'

            // --- 功能函数：执行收缩 ---
            const shrink = () => {
                if (isDragging || isHovering) return;
                button.style.width = '30px';
                button.style.borderRadius = side === 'right' ? '20px 0 0 20px' : '0 20px 20px 0';
                button.style.opacity = '0.6';
                button.innerText = '';

                if (side === 'right') {
                    button.style.left = `${window.innerWidth - 15}px`; // 露出一半
                } else {
                    button.style.left = `-15px`;
                }
            };

            // --- 功能函数：执行展开 ---
            const expand = () => {
                button.style.width = btnCfg.width;
                button.style.borderRadius = '50%';
                button.style.opacity = '1';
                button.innerText = btnCfg.text;

                const rect = button.getBoundingClientRect();
                if (side === 'right') {
                    button.style.left = `${window.innerWidth - 60}px`;
                } else {
                    button.style.left = '10px';
                }
            };

            // --- 功能函数：吸附边界 ---
            const stickyAdsorb = () => {
                const rect = button.getBoundingClientRect();
                const threshold = window.innerWidth / 2;
                side = (rect.left + rect.width / 2 < threshold) ? 'left' : 'right';
                expand();
                // 3秒后如果没有操作则收缩
                setTimeout(shrink, btnCfg.shrinkDelay);
            };

            // 鼠标悬停处理
            button.addEventListener('mouseenter', () => {
                isHovering = true;
                expand();
            });
            button.addEventListener('mouseleave', () => {
                isHovering = false;
                setTimeout(shrink, 300);
            });

            // 拖拽逻辑
            button.addEventListener('mousedown', (e) => {
                let hasMoved = false;
                const startX = e.clientX;
                const startY = e.clientY;
                const initialRect = button.getBoundingClientRect();

                button.style.transition = 'none'; // 拖拽时关闭动画

                const onMouseMove = (moveEvent) => {
                    hasMoved = true;
                    isDragging = true;
                    button.style.left = `${initialRect.left + (moveEvent.clientX - startX)}px`;
                    button.style.top = `${initialRect.top + (moveEvent.clientY - startY)}px`;
                };

                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);

                    button.style.transition = 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
                    if (hasMoved) {
                        stickyAdsorb();
                    }
                    setTimeout(() => isDragging = false, 50);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });

            // 点击事件
            button.addEventListener('click', () => {
                if (!isDragging) {
                    let loginInfo = this.getInformation();
                    if (!loginInfo.authorization || !loginInfo.loginUuid) {
                        // 获取授权信息失败
                        button.innerText = btnCfg.errText;
                        button.style.backgroundColor = btnCfg.errColor;
                        setTimeout(() => {
                            button.innerText = btnCfg.text;
                            button.style.backgroundColor = btnCfg.idleColor;
                            shrink();
                        }, 1000);

                        return;
                    }
                    button.innerText = btnCfg.successText;
                    button.style.backgroundColor = btnCfg.successColor;
                    setTimeout(() => {
                        button.innerText = btnCfg.text;
                        button.style.backgroundColor = btnCfg.idleColor;
                        shrink();
                    }, 1000);
                }
            });

            // 初始化：先吸附再收缩
            setTimeout(stickyAdsorb, 500);
        }

        getParentFileId() {
            const filePathKey = this.config.storageKeys.filePath;
            try {
                const storageValue = sessionStorage[filePathKey];
                if (!storageValue) return "0";
                const homeFilePath = JSON.parse(storageValue).homeFilePath || [];
                return (homeFilePath[homeFilePath.length - 1] || 0).toString();
            } catch {
                return "0";
            }
        }

        getInformation() {
            const {authorization: authKey, loginUuid: loginKey} = this.config.storageKeys;
            const authorization = localStorage.getItem(authKey);
            const loginUuid = localStorage.getItem(loginKey);
            const parentFileId = this.getParentFileId();
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(this.config.gmStorageKey, {
                    authorization,
                    loginUuid,
                    parentFileId: parentFileId
                });
            }
            return {authorization, loginUuid, parentFileId}
        }
    }

    class mainController {
        constructor(options = {}) {
            const defaults = {
                panHosts: DEFAULT_OPTIONS.panHosts,
                linkManager: {},
                uiManager: {},
                panWebManager: {}
            };
            this.config = {
                ...defaults,
                ...options,
                linkManager: {...(defaults.linkManager || {}), ...(options.linkManager || {})},
                uiManager: {...(defaults.uiManager || {}), ...(options.uiManager || {})},
                panWebManager: {...(defaults.panWebManager || {}), ...(options.panWebManager || {})}
            };
        }

        async init() {
            const panHosts = this.config.panHosts;
            if (panHosts.includes(window.location.hostname)) {
                this.panWebManager = new panWebManager(this.config.panWebManager);
                this.panWebManager.init();
            }
            // 排除 分享页面
            if (window.location.pathname.startsWith('/s/')) {
                console.log("分享页面");
                return;
            }
            this.link_manager = new linkManager(this.config.linkManager);
            this.ui_manager = new UIManager(this.config.uiManager);
            this.ui_manager.init();

            const warningDivCollect = document.querySelectorAll(".alert.alert-warning[role='alert']");

            if (warningDivCollect.length > 0) {
                for (const warningDiv of warningDivCollect) {
                    console.log("找到了回复提示元素:", warningDiv);
                    // 添加快捷回复按钮
                    this.ui_manager.addButton(warningDiv, {
                        text: '回复',
                        type: 'success',
                        onClick: async () => {
                            // 使用withLoadingMask包装异步操作
                            await this.ui_manager.withLoadingMask(
                                () => this.ui_manager.postReplyAndRefresh(),
                                {
                                    text: '正在回复中...',
                                    spinnerType: 'circle'
                                }
                            );
                        },
                        size: "small"
                    });
                }
            }

            // 提取链接和验证码
            var extractedInfos;
            const cardBody = document.querySelector(".card-body");
            if (cardBody) {
                const htmlContent = cardBody.innerHTML;
                extractedInfos = this.ui_manager.extractMultipleInfos(htmlContent);
                console.log("提取的链接和提取码信息:", extractedInfos);
            }
            // 获取链接提示
            const successDivCollect = document.querySelectorAll(".alert.alert-success");

            if (successDivCollect.length > 0) {
                for (const successDiv of successDivCollect) {
                    console.log("找到了链接提示元素:", successDiv);
                    const linkElementCollect = successDiv.querySelectorAll("a");
                    if (linkElementCollect.length < 1) {
                        console.error("未找到链接元素");
                        continue;
                    }
                    for (const linkElement of linkElementCollect) {
                        const linkText = linkElement.href;
                        if (!linkText || linkText.length < 1) {
                            console.error("链接文本为空");
                            continue;
                        }
                        // 如果是空元素，跳过
                        if (linkElement.textContent.trim().length < 1) {
                            console.error("文本内容为空");
                            continue;
                        }
                        console.log("检查链接有效性:", linkText);
                        const result = await this.link_manager.linkCheckByUrl(linkText);
                        if (result.code === 0) {
                            this.ui_manager.changeLinkStyle(linkElement, "success");
                            this.ui_manager.showToast("链接有效！", "success");

                            // 找到提取码
                            //// 先从url中提取
                            let extractCode = null;
                            let urlWithPwd = null;
                            const urlObj = new URL(linkText);
                            extractCode = urlObj.searchParams.get("pwd");
                            // 如果url中没有，从提取的信息中找
                            if (!extractCode) {
                                for (const info of extractedInfos) {
                                    const urlObj_extract = new URL(info.link);
                                    if (urlObj_extract.path === urlObj.path && info.code) {
                                        extractCode = info.code;
                                        console.log("从提取信息中找到提取码:", extractCode);
                                        urlWithPwd = urlObj.origin + urlObj.pathname + "?pwd=" + extractCode;
                                        break;
                                    }
                                }
                            }
                            if (!urlWithPwd) {
                                urlWithPwd = linkText;
                            }

                            // 添加保存按钮
                            this.ui_manager.addButton(linkElement,
                                {
                                    text: '保存到网盘',
                                    type: 'primary',
                                    onClick: async () => {
                                        await this.ui_manager.withLoadingMask(
                                            async () => {
                                                const saveResult = await this.link_manager.fastSave(urlWithPwd);
                                                if (saveResult.code === 0) {
                                                    this.ui_manager.showToast("保存成功！", "success");
                                                } else {
                                                    this.ui_manager.showToast(`保存失败：${saveResult.message}`, "error");
                                                }
                                            },
                                            {
                                                text: '正在保存中...',
                                                spinnerType: 'circle'
                                            }
                                        );
                                    },
                                    size: "small",
                                    style: "margin-left: 10px;"
                                },
                                "afterend"
                            );

                        } else {
                            if (result.code === -1) {
                                // 解析失败，认为是无效链接
                                this.ui_manager.showToast("链接解析失败！", "error");
                                continue;
                            }
                            this.ui_manager.changeLinkStyle(linkElement, "error", result.message);
                            this.ui_manager.showToast(`链接失效：${result.message}`, "error");
                        }
                    }
                }
            }
        }
    }

    window.main_controller = new mainController();
    main_controller.init();
})();