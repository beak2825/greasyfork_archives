// ==UserScript==
// @name         湖南IE附件全量打包下载 (Pro版)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  基于 GESP 架构移植，修复跨域打包失败问题。自动识别 hunanie.com 页面附件，一键下载并打包为 ZIP。
// @author       Y.V
// @match        http://www.hunanie.com/nd.jsp*
// @match        https://www.hunanie.com/nd.jsp*
// @connect      s21i.co99.net
// @connect      download.s21i.co99.net
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon         http://www.hunanie.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561022/%E6%B9%96%E5%8D%97IE%E9%99%84%E4%BB%B6%E5%85%A8%E9%87%8F%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%20%28Pro%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561022/%E6%B9%96%E5%8D%97IE%E9%99%84%E4%BB%B6%E5%85%A8%E9%87%8F%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%20%28Pro%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 配置项
     */
    const CONFIG = {
        // 使用 3.6.0 版本，最为稳定
        ZIP_CONFIG: {
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        },
        RETRY_LIMIT: 2, // 失败重试次数
        TIMEOUT: 30000  // 单个文件超时时间 (ms)
    };

    /**
     * 核心下载引擎
     */
    class DownloaderEngine {
        constructor() {
            this.tasks = [];
            this.zip = null;
            this.isProcessing = false;
        }

        /**
         * 初始化：扫描页面资源
         */
        init() {
            this.scanPage();
            if (this.tasks.length > 0) {
                console.log(`[HunanIE] 扫描到 ${this.tasks.length} 个可下载文件`);
                UI.renderButton(this.tasks.length, () => this.start());
            }
        }

        scanPage() {
            // 针对湖南IE网站的特定选择器
            const links = document.querySelectorAll('.news_detail_download_item_link');
            const seen = new Set();

            links.forEach(link => {
                let url = link.getAttribute('href');
                const name = link.getAttribute('title') || link.innerText.trim();

                // 处理协议相对路径
                if (url && url.startsWith('//')) {
                    url = window.location.protocol + url;
                }

                if (url && /\.(docx?|pdf|zip|rar|xlsx?|pptx?)$/i.test(url.split('?')[0])) {
                    if (!seen.has(url)) {
                        this.tasks.push({
                            url: url,
                            // 智能清洗文件名
                            filename: this.sanitizeName(name)
                        });
                        seen.add(url);
                    }
                }
            });
        }

        sanitizeName(name) {
            // 移除非法字符，如果文件名没有后缀，尝试保留原逻辑，这里简单处理
            return name.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
        }

        /**
         * 核心：使用 GM_xmlhttpRequest 替代 fetch 以解决跨域问题
         */
        downloadFile(url, retries = CONFIG.RETRY_LIMIT) {
            return new Promise((resolve, reject) => {
                const attempt = (remainingRetries) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        responseType: "arraybuffer", // 关键：获取二进制流
                        headers: {
                            "Referer": window.location.href, // 关键：防盗链伪装
                            "Origin": window.location.origin
                        },
                        timeout: CONFIG.TIMEOUT,
                        onload: (response) => {
                            if (response.status === 200) {
                                // 检查是否是空文件
                                if (response.response.byteLength === 0) {
                                    if (remainingRetries > 0) {
                                        console.warn(`文件为空，重试中... 剩余次数 ${remainingRetries}`);
                                        setTimeout(() => attempt(remainingRetries - 1), 1000);
                                    } else {
                                        reject(new Error("文件大小为0KB (服务器反爬或文件损坏)"));
                                    }
                                } else {
                                    resolve(response.response);
                                }
                            } else {
                                if (remainingRetries > 0) {
                                    setTimeout(() => attempt(remainingRetries - 1), 1000);
                                } else {
                                    reject(new Error(`HTTP ${response.status}`));
                                }
                            }
                        },
                        onerror: (err) => {
                            if (remainingRetries > 0) {
                                setTimeout(() => attempt(remainingRetries - 1), 1000);
                            } else {
                                reject(new Error("网络请求错误"));
                            }
                        },
                        ontimeout: () => {
                            if (remainingRetries > 0) {
                                setTimeout(() => attempt(remainingRetries - 1), 1000);
                            } else {
                                reject(new Error("请求超时"));
                            }
                        }
                    });
                };
                attempt(retries);
            });
        }

        async start() {
            if (this.isProcessing) return;
            this.isProcessing = true;

            const JSZip = window.JSZip;
            this.zip = new JSZip();

            UI.showOverlay();
            let successCount = 0;
            let failCount = 0;

            // 1. 串行下载阶段
            for (let i = 0; i < this.tasks.length; i++) {
                const task = this.tasks[i];
                // 进度条逻辑：前80%用于下载，后20%用于打包
                const progress = Math.floor(((i) / this.tasks.length) * 80);

                UI.updateProgress(progress, `正在下载 (${i + 1}/${this.tasks.length})`, task.filename);

                try {
                    const arrayBuffer = await this.downloadFile(task.url);

                    // 解决重名文件
                    let fileName = task.filename;
                    let dupCount = 1;
                    while (this.zip.file(fileName)) {
                        fileName = task.filename.replace(/(\.[^.]+)$/, `(${dupCount})$1`);
                        dupCount++;
                    }

                    this.zip.file(fileName, arrayBuffer);
                    successCount++;
                } catch (err) {
                    console.error(`下载失败: ${task.filename}`, err);
                    failCount++;
                }

                // 稍微暂停，防止UI卡死
                await new Promise(r => setTimeout(r, 50));
            }

            // 2. 打包阶段
            if (successCount === 0) {
                alert('所有文件下载失败！可能是脚本权限未通过（请在油猴弹窗中点击“总是允许”）。');
                UI.hideOverlay();
                this.isProcessing = false;
                return;
            }

            UI.updateProgress(90, '正在生成压缩包...', '请稍候，根据文件大小可能需要几秒');

            try {
                const zipBlob = await this.zip.generateAsync(CONFIG.ZIP_CONFIG);

                UI.updateProgress(100, '完成！正在启动下载', `成功: ${successCount}, 失败: ${failCount}`);

                // 获取网页标题作为文件名
                let pageTitle = document.title.replace(/[\\/:*?"<>|]/g, "_").trim() || "附件打包";
                saveAs(zipBlob, `${pageTitle}.zip`);

                setTimeout(() => {
                    UI.hideOverlay();
                    this.isProcessing = false;
                }, 2000);

            } catch (err) {
                alert(`打包失败: ${err.message}`);
                UI.hideOverlay();
                this.isProcessing = false;
            }
        }
    }

    /**
     * UI 管理器 (复刻 GESP 风格)
     */
    const UI = {
        renderButton(count, onClick) {
            const btn = document.createElement('button');
            btn.id = 'hunanie-dl-btn';
            btn.innerHTML = `
                <span class="icon">📥</span>
                <span class="text">打包下载全部附件 <small>(${count})</small></span>
            `;
            btn.onclick = onClick;
            document.body.appendChild(btn);
        },

        showOverlay() {
            let overlay = document.getElementById('hunanie-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'hunanie-overlay';
                overlay.innerHTML = `
                    <div class="dl-card">
                        <div class="dl-header">正在处理附件</div>
                        <div class="dl-progress-track">
                            <div class="dl-progress-fill" id="dl-fill"></div>
                        </div>
                        <div class="dl-status" id="dl-status">初始化中...</div>
                        <div class="dl-detail" id="dl-detail">请勿关闭页面</div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }
            overlay.classList.add('active');
        },

        updateProgress(percent, status, detail) {
            const fill = document.getElementById('dl-fill');
            const statusEl = document.getElementById('dl-status');
            const detailEl = document.getElementById('dl-detail');

            if (fill) fill.style.width = `${percent}%`;
            if (statusEl) statusEl.textContent = status;
            if (detailEl && detail) detailEl.textContent = detail;
        },

        hideOverlay() {
            const overlay = document.getElementById('hunanie-overlay');
            if (overlay) overlay.classList.remove('active');
        }
    };

    /**
     * 样式表
     */
    GM_addStyle(`
        /* 悬浮按钮 */
        #hunanie-dl-btn {
            position: fixed; bottom: 50px; right: 50px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white; border: none; padding: 12px 24px;
            border-radius: 50px; cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
            display: flex; align-items: center; gap: 8px;
            font-family: "Microsoft YaHei", system-ui, sans-serif;
            font-size: 15px; font-weight: 500;
            transition: all 0.3s ease;
            z-index: 9999;
        }
        #hunanie-dl-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }
        #hunanie-dl-btn:active { transform: translateY(0); }
        #hunanie-dl-btn small { opacity: 0.8; font-size: 0.9em; margin-left: 2px; }

        /* 全屏遮罩与卡片 */
        #hunanie-overlay {
            position: fixed; inset: 0;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(5px);
            display: flex; justify-content: center; align-items: center;
            z-index: 10000; opacity: 0; pointer-events: none;
            transition: opacity 0.3s;
        }
        #hunanie-overlay.active { opacity: 1; pointer-events: auto; }

        .dl-card {
            background: white; width: 380px; padding: 30px;
            border-radius: 16px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
            text-align: center;
            border: 1px solid rgba(0,0,0,0.05);
            font-family: "Microsoft YaHei", sans-serif;
        }

        .dl-header {
            font-size: 18px; font-weight: 600; color: #1f2937;
            margin-bottom: 20px;
        }

        .dl-progress-track {
            height: 8px; background: #f3f4f6; border-radius: 4px;
            overflow: hidden; margin-bottom: 12px;
        }

        .dl-progress-fill {
            height: 100%; background: #007bff; width: 0%;
            border-radius: 4px;
            transition: width 0.3s ease-out;
        }

        .dl-status {
            font-size: 15px; font-weight: 500; color: #374151;
            margin-bottom: 6px;
        }

        .dl-detail {
            font-size: 12px; color: #6c757d;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            max-width: 100%;
        }
    `);

    // 启动程序
    const app = new DownloaderEngine();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.init());
    } else {
        setTimeout(() => app.init(), 500);
    }

})();