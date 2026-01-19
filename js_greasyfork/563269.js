// ==UserScript==
// @name         Telegra.ph Imgage UPLOAD / 图床即时上传脚本（乐观 UI 版）
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  零延迟体验：本地秒开预览 -> 后台静默上传 -> 自动替换直链
// @author       OSINT_Helper & AI Optimized
// @match        https://telegra.ph/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      imgbb.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563269/Telegraph%20Imgage%20UPLOAD%20%20%E5%9B%BE%E5%BA%8A%E5%8D%B3%E6%97%B6%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC%EF%BC%88%E4%B9%90%E8%A7%82%20UI%20%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563269/Telegraph%20Imgage%20UPLOAD%20%20%E5%9B%BE%E5%BA%8A%E5%8D%B3%E6%97%B6%E4%B8%8A%E4%BC%A0%E8%84%9A%E6%9C%AC%EF%BC%88%E4%B9%90%E8%A7%82%20UI%20%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        API_URL: "https://imgbb.com/json",
        MAIN_URL: "https://imgbb.com/",
        HEADERS: {
            "Origin": "https://imgbb.com",
            "Referer": "https://imgbb.com/",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": navigator.userAgent
        }
    };

    // --- State Management ---
    const State = {
        authToken: null,
        fetchPromise: null,

        init: function() {
            this.getToken();
        },

        getToken: function() {
            if (this.authToken) return Promise.resolve(this.authToken);
            if (this.fetchPromise) return this.fetchPromise;

            this.fetchPromise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: CONFIG.MAIN_URL,
                    headers: { "Cache-Control": "max-age=3600" },
                    onload: (res) => {
                        const match = res.responseText.match(/auth_token\s*=\s*"([a-f0-9]+)"/);
                        if (match && match[1]) {
                            this.authToken = match[1];
                            resolve(this.authToken);
                        } else {
                            reject("TOKEN_ERROR");
                        }
                    },
                    onerror: () => reject("NET_ERROR"),
                    onloadend: () => { this.fetchPromise = null; }
                });
            });
            return this.fetchPromise;
        }
    };

    // --- UI & Styling (CSS 注入) ---
    const UI = {
        injectStyle: () => {
            const css = `
                /* 上传中的图片状态：半透明 + 模糊 + 蓝色边框 */
                img[data-upload-status="uploading"] {
                    opacity: 0.6;
                    filter: grayscale(20%);
                    border: 2px solid #3498db;
                    transition: all 0.5s ease;
                    box-sizing: border-box;
                }
                /* 上传成功：恢复正常 */
                img[data-upload-status="done"] {
                    opacity: 1;
                    filter: none;
                    border: 2px solid transparent;
                }
                /* 上传失败：红色边框 */
                img[data-upload-status="error"] {
                    opacity: 0.8;
                    border: 3px solid #e74c3c;
                }

                /* 顶部通知栏 */
                #imgbb-toast {
                    position: fixed; top: 20px; right: 20px; z-index: 999999;
                    padding: 8px 16px; background: #2c3e50; color: #fff;
                    border-radius: 4px; font-size: 12px; font-weight: bold;
                    pointer-events: none; opacity: 0; transform: translateY(-10px);
                    transition: all 0.3s;
                }
                #imgbb-toast.show { opacity: 1; transform: translateY(0); }
            `;
            if (typeof GM_addStyle !== "undefined") {
                GM_addStyle(css);
            } else {
                const s = document.createElement('style');
                s.textContent = css;
                document.head.appendChild(s);
            }

            // 创建 Toast 容器
            const toast = document.createElement('div');
            toast.id = 'imgbb-toast';
            document.body.appendChild(toast);
        },

        toast: (msg) => {
            const t = document.getElementById('imgbb-toast');
            t.innerText = msg;
            t.classList.add('show');
            clearTimeout(t.timer);
            t.timer = setTimeout(() => t.classList.remove('show'), 2000);
        }
    };

    // --- Core Logic: Optimistic Upload ---
    const Core = {
        // 核心：处理单个文件的全生命周期
        processFile: async (file) => {
            // 1. 【瞬间反馈】创建本地 Blob URL
            const blobUrl = URL.createObjectURL(file);

            // 2. 【DOM操作】立即插入编辑器
            // 使用 execCommand 保证光标位置正确
            document.execCommand('insertImage', false, blobUrl);

            // 3. 【锁定元素】找到刚刚插入的那个 img 标签
            // 这是一个 tricky 但有效的方法：通过 src 属性反向查找 DOM 节点
            const imgNode = document.querySelector(`img[src="${blobUrl}"]`);
            if (!imgNode) {
                console.error("DOM 插入失败或被编辑器拦截");
                return;
            }

            // 4. 【标记状态】设置为“上传中”
            imgNode.setAttribute('data-upload-status', 'uploading');
            UI.toast("上传中...");

            try {
                // 5. 【后台上传】
                const token = await State.getToken();
                const remoteUrl = await Core.uploadRequest(file, token);

                // 6. 【原子替换】成功后，将 Blob 换成 ImgBB 直链
                imgNode.src = remoteUrl;
                imgNode.setAttribute('data-upload-status', 'done');
                // 释放本地内存
                URL.revokeObjectURL(blobUrl);
                UI.toast("上传完成");

            } catch (err) {
                // 7. 【错误回滚/提示】
                console.error(err);
                imgNode.setAttribute('data-upload-status', 'error');
                imgNode.title = "上传失败，请删除重试";
                UI.toast("上传失败");
            }
        },

        uploadRequest: (file, token) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("source", file);
                formData.append("type", "file");
                formData.append("action", "upload");
                formData.append("timestamp", Date.now());
                formData.append("auth_token", token);

                GM_xmlhttpRequest({
                    method: "POST",
                    url: CONFIG.API_URL,
                    data: formData,
                    headers: CONFIG.HEADERS,
                    onload: (res) => {
                        try {
                            const json = JSON.parse(res.responseText);
                            if (json.status_code === 200 && json.image?.url) {
                                resolve(json.image.url);
                            } else {
                                reject("API Error");
                            }
                        } catch(e) { reject("Parse Error"); }
                    },
                    onerror: () => reject("Network Error")
                });
            });
        },

        handleBatch: (fileList) => {
            const images = Array.from(fileList).filter(f => f.type.startsWith('image/'));
            // 并发处理所有图片，互不阻塞
            images.forEach(file => Core.processFile(file));
        }
    };

    // --- Event Interceptors ---
    function initEvents() {
        // 粘贴事件
        document.addEventListener('paste', (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            const files = [];
            for (let item of items) {
                if (item.kind === 'file' && item.type.startsWith('image/')) {
                    files.push(item.getAsFile());
                }
            }
            if (files.length > 0) {
                e.preventDefault(); // 阻止编辑器默认行为
                Core.handleBatch(files);
            }
        });

        // 拖拽事件
        const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };
        document.addEventListener('dragover', prevent, false);
        document.addEventListener('drop', (e) => {
            prevent(e);
            if (e.dataTransfer.files?.length > 0) {
                Core.handleBatch(e.dataTransfer.files);
            }
        }, false);
    }

    // --- Bootstrap ---
    State.init();    // 预热 Token
    UI.injectStyle(); // 注入样式
    initEvents();    // 启动拦截
    console.log("[Telegraph] Instant Uploader Loaded.");

})();