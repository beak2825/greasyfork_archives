// ==UserScript==
// @name         91Porny High-Performance Player + Ad Blocker + Downloader
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Replace player with ArtPlayer, block ads, and download videos with multi-threaded progress
// @author       Antigravity
// @match        https://91porny.com/*
// @match        https://www.91porny.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-start
// @connect      *
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.12/hls.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/artplayer/5.1.1/artplayer.js
// @downloadURL https://update.greasyfork.org/scripts/560216/91Porny%20High-Performance%20Player%20%2B%20Ad%20Blocker%20%2B%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560216/91Porny%20High-Performance%20Player%20%2B%20Ad%20Blocker%20%2B%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 样式 ====================
    GM_addStyle(`
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
        #artplayer-container { background: #000; margin: 0 auto; display: block; width: 100%; height: 500px; }

        .video-download-btn {
            position: fixed; bottom: 20px; left: 20px; z-index: 99999;
            padding: 12px 20px; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            color: #e0e0e0; border: 1px solid #404040; border-radius: 8px;
            font-size: 14px; cursor: pointer; transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .video-download-btn:hover { background: linear-gradient(135deg, #3d3d3d 0%, #2a2a2a 100%); transform: translateY(-2px); }
        .video-download-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .download-progress-container {
            position: fixed; bottom: 70px; left: 20px; z-index: 99999;
            width: 300px; background: rgba(26, 26, 26, 0.95); border: 1px solid #404040;
            border-radius: 10px; padding: 16px; display: none; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }
        .download-progress-container.show { display: block; }
        .progress-title { color: #e0e0e0; font-size: 13px; margin-bottom: 12px; display: flex; justify-content: space-between; }
        .progress-close { background: none; border: none; color: #808080; cursor: pointer; font-size: 18px; line-height: 1; }
        .progress-bar-bg { width: 100%; height: 8px; background: #2d2d2d; border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #4a4a4a 0%, #6a6a6a 100%); width: 0%; transition: width 0.1s; }
        .progress-stats { display: flex; justify-content: space-between; font-size: 11px; color: #808080; }
        .progress-status { font-size: 12px; color: #606060; margin-top: 8px; text-align: center; }
        .progress-status.success { color: #6a9955; }
        .progress-status.error { color: #d16969; }
    `);

    // ==================== 下载器核心 ====================
    class M3U8Downloader {
        constructor(m3u8Url, filename) {
            this.m3u8Url = m3u8Url;
            this.filename = filename || 'video.ts';
            this.segments = [];
            this.downloadedSegments = [];
            this.concurrency = 6;
            this.onProgress = null;
            this.onStatus = null;
        }

        async start() {
            try {
                this.updateStatus('解析中...');
                const res = await this.fetchWithGM(this.m3u8Url);
                const baseUrl = this.m3u8Url.substring(0, this.m3u8Url.lastIndexOf('/') + 1);
                res.responseText.split('\n').forEach(line => {
                    if (line.trim() && !line.startsWith('#')) {
                        this.segments.push(line.startsWith('http') ? line : baseUrl + line);
                    }
                });

                this.downloadedSegments = new Array(this.segments.length).fill(null);
                let completed = 0;
                let index = 0;

                const worker = async () => {
                    while (index < this.segments.length) {
                        const i = index++;
                        try {
                            const data = await this.downloadSeg(this.segments[i]);
                            this.downloadedSegments[i] = data;
                            completed++;
                            if (this.onProgress) this.onProgress(Math.round((completed/this.segments.length)*100), completed, this.segments.length);
                        } catch (e) { index--; } // 简易重试
                    }
                };

                await Promise.all(Array(this.concurrency).fill(0).map(worker));
                this.updateStatus('合并并导出...');
                const totalSize = this.downloadedSegments.reduce((a, b) => a + (b ? b.byteLength : 0), 0);
                const combined = new Uint8Array(totalSize);
                let offset = 0;
                this.downloadedSegments.forEach(seg => { if(seg) { combined.set(new Uint8Array(seg), offset); offset += seg.byteLength; } });

                const url = URL.createObjectURL(new Blob([combined], { type: 'video/mp2t' }));
                const a = document.createElement('a');
                a.href = url; a.download = this.filename;
                a.click();
                this.updateStatus('下载完成', 'success');
            } catch (e) { this.updateStatus('失败: ' + e.message, 'error'); }
        }

        downloadSeg(url) {
            return new Promise((res, rej) => {
                GM_xmlhttpRequest({ method: 'GET', url, responseType: 'arraybuffer', onload: r => res(r.response), onerror: rej });
            });
        }

        fetchWithGM(url) { return new Promise((res, rej) => GM_xmlhttpRequest({ method: 'GET', url, onload: res, onerror: rej })); }
        updateStatus(m, t='normal') { if (this.onStatus) this.onStatus(m, t); }
    }

    function createUI(url, title) {
        document.querySelectorAll('.video-download-btn').forEach(e => e.remove());
        const btn = document.createElement('button');
        btn.className = 'video-download-btn'; btn.innerHTML = '⬇️ 下载视频';
        document.body.appendChild(btn);

        const prog = document.createElement('div');
        prog.className = 'download-progress-container';
        prog.innerHTML = `<div class="progress-title"><span>下载进度</span><button class="progress-close">×</button></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill"></div></div>
            <div class="progress-stats"><span class="ps-seg">0/0</span><span class="ps-per">0%</span></div>
            <div class="progress-status">准备就绪</div>`;
        document.body.appendChild(prog);

        btn.onclick = () => {
            btn.disabled = true; prog.classList.add('show');
            const dl = new M3U8Downloader(url, title + '.ts');
            dl.onProgress = (p, c, t) => {
                prog.querySelector('.progress-bar-fill').style.width = p + '%';
                prog.querySelector('.ps-seg').textContent = `${c}/${t}`;
                prog.querySelector('.ps-per').textContent = p + '%';
            };
            dl.onStatus = (m, t) => {
                prog.querySelector('.progress-status').textContent = m;
                prog.querySelector('.progress-status').className = 'progress-status ' + t;
                if (t === 'success' || t === 'error') { btn.disabled = false; }
            };
            dl.start();
        };
        prog.querySelector('.progress-close').onclick = () => prog.classList.remove('show');
    }

    // ==================== 播放器注入 ====================
    let videoId = (window.location.pathname.match(/\/view(?:hd)?\/([a-f0-9]+)/) || [])[1];
    let artInit = false;

    async function getUrl(id) {
        return new Promise((res) => {
            GM_xmlhttpRequest({
                method: "GET", url: `https://91porny.com/video/embed/${id}`,
                onload: r => {
                    const m = r.responseText.match(/data-src="(https:\/\/[^"]+index\.m3u8[^"]+)"/);
                    res(m ? m[1].replace(/&amp;/g, '&') : null);
                }
            });
        });
    }

    const obs = new MutationObserver(async () => {
        const op = document.querySelector('#video-play');
        if (op && !artInit && videoId) {
            artInit = true;
            const url = await getUrl(videoId);
            if (!url) return;
            op.innerHTML = '<div id="artplayer-container"></div>';
            const art = new Artplayer({
                container: '#artplayer-container', url, type: 'm3u8',
                customType: { m3u8: (v, u) => { if (Hls.isSupported()) { const h = new Hls(); h.loadSource(u); h.attachMedia(v); } } },
                fullscreen: true, autoplay: true, theme: '#808080',
            });
            art.on('ready', () => createUI(url, document.querySelector('h1')?.textContent.trim() || 'video'));
        }
        document.querySelectorAll('.modal, .modal-backdrop').forEach(e => e.remove());
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

})();