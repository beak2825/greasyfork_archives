// ==UserScript==
// @name         91Porny High-Performance Player + Ad Blocker + Downloader
// @namespace    https://github.com/Antigravity/scripts
// @version      3.1
// @description  替换 91Porny 播放器为 ArtPlayer，内置广告拦截与多线程 M3U8 下载器
// @author       Antigravity
// @license      MIT
// @match        *://91porny.com/*
// @match        *://www.91porny.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-start
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js
// @require      https://cdn.jsdelivr.net/npm/artplayer@5.1.0/dist/artplayer.js
// @downloadURL https://update.greasyfork.org/scripts/560219/91Porny%20High-Performance%20Player%20%2B%20Ad%20Blocker%20%2B%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560219/91Porny%20High-Performance%20Player%20%2B%20Ad%20Blocker%20%2B%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 样式注入 (广告屏蔽与UI) ====================
    GM_addStyle(`
        /* 屏蔽广告和干扰元素 */
        .modal, .modal-backdrop, .modal-dialog,
        [class*="modal"]:not(#artplayer-container):not(.art-video-player),
        [class*="popup"], .mobile-jsv, .jsv, .fixed-bottom, .fixed-top,
        [class*="ad-"], [class*="-ad"], [id*="ad-"], [id*="-ad"],
        .banner, [class*="banner"], marquee, .marquee,
        iframe:not([src*="91porny"]),
        div[style*="position: fixed"][style*="z-index: 9999"] {
            display: none !important;
            visibility: hidden !important;
            width: 0 !important; height: 0 !important;
        }

        html, body { overflow: auto !important; padding-right: 0 !important; }
        body.modal-open { overflow: auto !important; }

        /* 播放器容器 */
        #artplayer-container {
            width: 100%;
            height: 100%;
            background: #000;
            margin: 0 auto;
            display: block;
        }

        /* 下载按钮样式 */
        .video-download-btn {
            position: fixed; bottom: 20px; left: 20px; z-index: 99999;
            padding: 12px 20px; background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
            color: white; border: none; border-radius: 8px; font-weight: bold;
            font-size: 14px; cursor: pointer; transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .video-download-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .video-download-btn:disabled { background: #666; cursor: not-allowed; }

        /* 下载面板 */
        .download-progress-container {
            position: fixed; bottom: 80px; left: 20px; z-index: 99999;
            width: 300px; background: rgba(26, 26, 26, 0.95); border: 1px solid #444;
            border-radius: 10px; padding: 16px; display: none; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
            color: #fff; font-family: sans-serif;
        }
        .download-progress-container.show { display: block; }
        .progress-title { font-size: 14px; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .progress-close { background: none; border: none; color: #808080; cursor: pointer; font-size: 18px; }
        .progress-bar-bg { width: 100%; height: 8px; background: #333; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .progress-bar-fill { height: 100%; background: #ff4757; width: 0%; transition: width 0.2s; }
        .progress-stats { display: flex; justify-content: space-between; font-size: 12px; color: #aaa; }
        .progress-status { font-size: 12px; color: #ccc; margin-top: 8px; text-align: center; }
    `);

    // ==================== 下载器核心 (M3U8 多线程) ====================
    class M3U8Downloader {
        constructor(m3u8Url, filename) {
            this.m3u8Url = m3u8Url;
            this.filename = filename.replace(/[\\/:*?"<>|]/g, '_'); // 过滤非法字符
            this.segments = [];
            this.downloadedSegments = [];
            this.concurrency = 6; // 并发数
            this.onProgress = null;
            this.onStatus = null;
        }

        async start() {
            try {
                this.updateStatus('正在解析索引文件...');
                const res = await this.fetchWithGM(this.m3u8Url);
                const baseUrl = this.m3u8Url.substring(0, this.m3u8Url.lastIndexOf('/') + 1);

                res.responseText.split('\n').forEach(line => {
                    if (line.trim() && !line.startsWith('#')) {
                        this.segments.push(line.startsWith('http') ? line : baseUrl + line);
                    }
                });

                if (this.segments.length === 0) throw new Error('未找到视频分片');

                this.downloadedSegments = new Array(this.segments.length).fill(null);
                let completed = 0;
                let index = 0;

                const worker = async () => {
                    while (index < this.segments.length) {
                        const i = index++;
                        let retry = 3;
                        while (retry > 0) {
                            try {
                                const data = await this.downloadSeg(this.segments[i]);
                                this.downloadedSegments[i] = data;
                                completed++;
                                if (this.onProgress) this.onProgress(Math.round((completed / this.segments.length) * 100), completed, this.segments.length);
                                break;
                            } catch (e) {
                                retry--;
                                if (retry === 0) throw new Error(`分片 ${i} 下载失败`);
                            }
                        }
                    }
                };

                await Promise.all(Array(this.concurrency).fill(0).map(worker));

                this.updateStatus('正在合并导出 (请勿关闭页面)...');
                const totalSize = this.downloadedSegments.reduce((a, b) => a + (b ? b.byteLength : 0), 0);
                const combined = new Uint8Array(totalSize);
                let offset = 0;
                this.downloadedSegments.forEach(seg => {
                    if (seg) {
                        combined.set(new Uint8Array(seg), offset);
                        offset += seg.byteLength;
                    }
                });

                const url = URL.createObjectURL(new Blob([combined], { type: 'video/mp2t' }));
                const a = document.createElement('a');
                a.href = url;
                a.download = this.filename + '.ts';
                a.click();
                URL.revokeObjectURL(url);
                this.updateStatus('下载完成！', 'success');
            } catch (e) {
                console.error(e);
                this.updateStatus('错误: ' + e.message, 'error');
            }
        }

        downloadSeg(url) {
            return new Promise((res, rej) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    responseType: 'arraybuffer',
                    timeout: 30000,
                    onload: r => r.status === 200 ? res(r.response) : rej(),
                    onerror: rej
                });
            });
        }

        fetchWithGM(url) {
            return new Promise((res, rej) => {
                GM_xmlhttpRequest({ method: 'GET', url, onload: res, onerror: rej });
            });
        }

        updateStatus(m, t = 'normal') {
            if (this.onStatus) this.onStatus(m, t);
        }
    }

    // ==================== UI 创建 ====================
    function createUI(url, title) {
        document.querySelectorAll('.video-download-btn').forEach(e => e.remove());

        const btn = document.createElement('button');
        btn.className = 'video-download-btn';
        btn.innerHTML = '⬇️ 下载视频 (TS)';
        document.body.appendChild(btn);

        const prog = document.createElement('div');
        prog.className = 'download-progress-container';
        prog.innerHTML = `
            <div class="progress-title"><span>下载任务</span><button class="progress-close">×</button></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill"></div></div>
            <div class="progress-stats"><span class="ps-seg">0/0</span><span class="ps-per">0%</span></div>
            <div class="progress-status">准备就绪</div>
        `;
        document.body.appendChild(prog);

        btn.onclick = () => {
            btn.disabled = true;
            prog.classList.add('show');
            const dl = new M3U8Downloader(url, title || '91video');
            dl.onProgress = (p, c, t) => {
                prog.querySelector('.progress-bar-fill').style.width = p + '%';
                prog.querySelector('.ps-seg').textContent = `${c}/${t}`;
                prog.querySelector('.ps-per').textContent = p + '%';
            };
            dl.onStatus = (m, t) => {
                const statusEl = prog.querySelector('.progress-status');
                statusEl.textContent = m;
                statusEl.style.color = t === 'error' ? '#ff4757' : (t === 'success' ? '#2ed573' : '#ccc');
                if (t === 'success' || t === 'error') btn.disabled = false;
            };
            dl.start();
        };

        prog.querySelector('.progress-close').onclick = () => prog.classList.remove('show');
    }

    // ==================== 播放器注入逻辑 ====================
    let videoId = (window.location.pathname.match(/\/view(?:hd)?\/([a-f0-9]+)/) || [])[1];
    let artInit = false;

    async function getRealUrl(id) {
        return new Promise((res) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://91porny.com/video/embed/${id}`,
                onload: r => {
                    const m = r.responseText.match(/data-src="(https:\/\/[^"]+index\.m3u8[^"]+)"/);
                    res(m ? m[1].replace(/&amp;/g, '&') : null);
                },
                onerror: () => res(null)
            });
        });
    }

    const observer = new MutationObserver(async () => {
        const originalPlayer = document.querySelector('#video-play');
        if (originalPlayer && !artInit && videoId) {
            artInit = true;
            const m3u8Url = await getRealUrl(videoId);
            if (!m3u8Url) return;

            // 替换容器
            const container = originalPlayer.parentElement;
            container.innerHTML = '<div id="artplayer-container"></div>';

            const art = new Artplayer({
                container: '#artplayer-container',
                url: m3u8Url,
                type: 'm3u8',
                customType: {
                    m3u8: function(video, url) {
                        if (Hls.isSupported()) {
                            const hls = new Hls();
                            hls.loadSource(url);
                            hls.attachMedia(video);
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = url;
                        }
                    },
                },
                autoplay: true,
                fullscreen: true,
                fullscreenWeb: true,
                pip: true,
                setting: true,
                theme: '#ff4757',
            });

            art.on('ready', () => {
                const title = document.querySelector('h1')?.textContent.trim() || 'video';
                createUI(m3u8Url, title);
            });
        }

        // 持续移除弹窗广告
        document.querySelectorAll('.modal, .modal-backdrop').forEach(e => e.remove());
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();