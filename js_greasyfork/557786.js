// ==UserScript==
// @name         StreamSaver Video Sniffer
// @name:zh-CN   通用视频嗅探器
// @namespace    org.jw23.videosniffer
// @version      24.1
// @description  Sniff video (m3u8/mp4) and download using StreamSaver (Low Memory).
// @description:zh-CN  专为安卓大文件设计：使用 StreamSaver 代理流式下载，几乎不占内存，支持 M3U8 转 MP4。
// @author       jw23 (Modified for StreamSaver)
// @license      MIT
// @match        *://*/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/mux.js@6.3.0/dist/mux.min.js
// @require      https://cdn.jsdelivr.net/npm/streamsaver@2.0.6/StreamSaver.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557786/StreamSaver%20Video%20Sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/557786/StreamSaver%20Video%20Sniffer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // StreamSaver 配置
    streamSaver.mitm = 'https://jimmywarting.github.io/StreamSaver.js/mitm.html?version=2.0.0';

    const I18N = {
        title: "视频嗅探助手",
        download: "下载",
        downloading: "下载中...",
        complete: "下载完成",
        error: "出错",
        no_video: "暂未发现视频",
        copy: "复制链接"
    };

    // 缓存队列：用于存放UI加载完成前嗅探到的视频
    const PENDING_ITEMS = [];
    const FOUND_URLS = new Set();
    let uiInstance = null;

    // ==========================================
    // 1. 核心 M3U8 下载逻辑 (保持 AES 修复版)
    // ==========================================
    function hex2buf(hex) {
        if (hex.startsWith('0x')) hex = hex.slice(2);
        return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
    }

    function seq2iv(seq) {
        const buffer = new ArrayBuffer(16);
        const view = new DataView(buffer);
        view.setUint32(12, seq, false);
        return new Uint8Array(buffer);
    }

    class M3U8Downloader {
        constructor(url, progressCallback) {
            this.masterUrl = url;
            this.onProgress = progressCallback || function(){};
            this.baseUrl = new URL(url, window.location.href).href.substring(0, new URL(url, window.location.href).href.lastIndexOf('/') + 1);
            this.aesKey = null;
            this.globalIv = null;
        }

        async start() {
            try {
                this.onProgress(0, "解析 M3U8...");
                const manifest = await this.fetchText(this.masterUrl);

                if (manifest.includes('#EXT-X-STREAM-INF')) {
                    const lines = manifest.split('\n');
                    for (let line of lines) {
                        if (line.trim() && !line.startsWith('#')) {
                            const subUrl = new URL(line.trim(), this.baseUrl).href;
                            const subDownloader = new M3U8Downloader(subUrl, this.onProgress);
                            return subDownloader.start();
                        }
                    }
                }

                const { segments, keyInfo, mediaSequence } = this.parseM3U8(manifest);
                if (segments.length === 0) throw new Error("未找到分片");

                if (keyInfo) {
                    this.onProgress(0, "获取密钥...");
                    await this.fetchKey(keyInfo);
                }

                const fileStream = streamSaver.createWriteStream('video_download.mp4');
                const writer = fileStream.getWriter();
                const transmuxer = new muxjs.mp4.Transmuxer();
                let initSegmentWritten = false;

                transmuxer.on('data', (segment) => {
                    let data;
                    if (segment.initSegment && !initSegmentWritten) {
                        data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                        data.set(segment.initSegment, 0);
                        data.set(segment.data, segment.initSegment.byteLength);
                        initSegmentWritten = true;
                    } else {
                        data = new Uint8Array(segment.data);
                    }
                    writer.write(data);
                });

                let count = 0;
                const total = segments.length;

                for (let i = 0; i < total; i++) {
                    const seg = segments[i];
                    const currentSeq = mediaSequence + i;
                    const segUrl = new URL(seg.uri, this.baseUrl).href;
                    
                    try {
                        let tsData = await this.fetchBuffer(segUrl);
                        if (this.aesKey) {
                            let iv;
                            if (seg.iv) iv = hex2buf(seg.iv);
                            else if (this.globalIv) iv = hex2buf(this.globalIv);
                            else iv = seq2iv(currentSeq);
                            tsData = await this.decrypt(tsData, iv);
                        }
                        transmuxer.push(new Uint8Array(tsData));
                        transmuxer.flush();
                    } catch (e) {
                        console.error(`片段 error`, e);
                    }
                    count++;
                    this.onProgress((count / total) * 100, `下载 ${count}/${total}`);
                }

                writer.close();
                this.onProgress(100, I18N.complete);
            } catch (err) {
                console.error(err);
                this.onProgress(0, "错误: " + err.message);
                alert("下载失败: " + err.message);
            }
        }

        parseM3U8(content) {
            const lines = content.split('\n');
            const segments = [];
            let keyInfo = null;
            let mediaSequence = 0;
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                if (!line) continue;
                if (line.startsWith('#EXT-X-MEDIA-SEQUENCE:')) mediaSequence = parseInt(line.split(':')[1]);
                else if (line.startsWith('#EXT-X-KEY')) {
                    const method = (line.match(/METHOD=([^,]+)/) || [])[1];
                    const uri = (line.match(/URI="([^"]+)"/) || [])[1];
                    const iv = (line.match(/IV=(0x[\da-fA-F]+)/) || [])[1];
                    if (method === 'AES-128') {
                        keyInfo = { uri, iv };
                        this.globalIv = iv;
                    }
                } else if (line.startsWith('#EXTINF')) {
                    let duration = parseFloat(line.split(':')[1]);
                    let uri = lines[i+1] ? lines[i+1].trim() : '';
                    if (uri && !uri.startsWith('#')) {
                        segments.push({ uri, duration, iv: null });
                        i++;
                    }
                } else if (!line.startsWith('#')) segments.push({ uri: line, duration: 0, iv: null });
            }
            return { segments, keyInfo, mediaSequence };
        }

        fetchText(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ method: "GET", url, onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : reject(new Error(r.statusText)), onerror: reject });
            });
        }
        fetchBuffer(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({ method: "GET", url, responseType: 'arraybuffer', onload: r => (r.status >= 200 && r.status < 300) ? resolve(r.response) : reject(new Error(r.statusText)), onerror: reject });
            });
        }
        async fetchKey(keyInfo) {
            const keyUrl = new URL(keyInfo.uri, this.baseUrl).href;
            const keyBuffer = await this.fetchBuffer(keyUrl);
            this.aesKey = await window.crypto.subtle.importKey("raw", keyBuffer, { name: "AES-CBC" }, false, ["decrypt"]);
        }
        async decrypt(data, iv) {
            return await window.crypto.subtle.decrypt({ name: "AES-CBC", iv: iv }, this.aesKey, data);
        }
    }

    // ==========================================
    // 2. UI 界面 (延迟加载机制)
    // ==========================================
    class FloatingUI {
        constructor() {
            this.init();
        }
        init() {
            this.createStyle();
            this.createBtn();
            this.createPanel();
            // 处理之前积压的视频
            this.processPending();
        }
        processPending() {
            while(PENDING_ITEMS.length > 0) {
                const item = PENDING_ITEMS.pop();
                this.addItem(item.url, item.type);
            }
        }
        createStyle() {
            GM_addStyle(`
                #vs-btn { position: fixed; bottom: 20px; right: 20px; width: 45px; height: 45px; background: #007bff; border-radius: 50%; color: #fff; text-align: center; line-height: 45px; cursor: pointer; z-index: 2147483647; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 24px; user-select: none; transition: transform 0.2s; }
                #vs-btn:hover { transform: scale(1.1); }
                #vs-panel { position: fixed; bottom: 80px; right: 20px; width: 320px; max-height: 500px; background: #fff; border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.2); z-index: 2147483647; display: none; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 13px; color: #333; }
                #vs-header { padding: 12px 15px; background: #f8f9fa; border-radius: 8px 8px 0 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
                #vs-list { flex: 1; overflow-y: auto; padding: 0; max-height: 400px; }
                .vs-item { padding: 12px 15px; border-bottom: 1px solid #f1f1f1; display: flex; flex-direction: column; gap: 8px; }
                .vs-meta { display: flex; align-items: center; gap: 8px; }
                .vs-tag { background: #6c757d; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; }
                .vs-url { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #666; font-size: 12px; }
                .vs-actions { display: flex; gap: 8px; }
                .vs-btn-dl { flex: 1; background: #28a745; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: background 0.2s; }
                .vs-btn-dl:hover { background: #218838; }
                .vs-btn-dl:disabled { background: #94d3a2; cursor: not-allowed; }
                .vs-btn-cp { background: #17a2b8; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
                .vs-progress-wrap { height: 4px; background: #e9ecef; border-radius: 2px; overflow: hidden; margin-top: 4px; display:none; }
                .vs-progress-bar { height: 100%; background: #007bff; width: 0%; transition: width 0.3s ease; }
            `);
        }
        createBtn() {
            // 确保 document.body 存在
            if (!document.body) return;
            const btn = document.createElement('div');
            btn.id = 'vs-btn';
            btn.textContent = '⬇';
            btn.onclick = () => {
                const p = document.getElementById('vs-panel');
                p.style.display = p.style.display === 'none' ? 'flex' : 'none';
            };
            document.body.appendChild(btn);
        }
        createPanel() {
            if (!document.body) return;
            const panel = document.createElement('div');
            panel.id = 'vs-panel';
            
            const header = document.createElement('div');
            header.id = 'vs-header';
            
            const title = document.createElement('span');
            title.textContent = I18N.title;
            const close = document.createElement('span');
            close.textContent = '✕';
            close.style.cursor = 'pointer';
            close.style.fontSize = '16px';
            close.onclick = () => { panel.style.display = 'none'; };

            header.appendChild(title);
            header.appendChild(close);
            
            const list = document.createElement('div');
            list.id = 'vs-list';
            list.innerHTML = `<div style="text-align:center;padding:20px;color:#adb5bd;">${I18N.no_video}</div>`;

            panel.appendChild(header);
            panel.appendChild(list);
            document.body.appendChild(panel);
            this.list = list;
        }
        addItem(url, type) {
            if (!this.list) return;
            // 清除"无视频"占位
            if (this.list.firstChild && this.list.firstChild.textContent === I18N.no_video) {
                this.list.innerHTML = '';
            }
            
            const item = document.createElement('div');
            item.className = 'vs-item';
            
            // Meta行
            const meta = document.createElement('div');
            meta.className = 'vs-meta';
            const tag = document.createElement('span');
            tag.className = 'vs-tag';
            tag.textContent = type.toUpperCase();
            const urlText = document.createElement('span');
            urlText.className = 'vs-url';
            urlText.textContent = url;
            urlText.title = url;
            meta.appendChild(tag);
            meta.appendChild(urlText);

            // 操作行
            const actions = document.createElement('div');
            actions.className = 'vs-actions';
            
            const dlBtn = document.createElement('button');
            dlBtn.className = 'vs-btn-dl';
            dlBtn.textContent = I18N.download;
            
            const cpBtn = document.createElement('button');
            cpBtn.className = 'vs-btn-cp';
            cpBtn.textContent = I18N.copy;
            cpBtn.onclick = () => {
                navigator.clipboard.writeText(url);
                cpBtn.textContent = "Copied!";
                setTimeout(() => cpBtn.textContent = I18N.copy, 1000);
            };

            actions.appendChild(dlBtn);
            actions.appendChild(cpBtn);

            // 进度条
            const pWrap = document.createElement('div');
            pWrap.className = 'vs-progress-wrap';
            const pBar = document.createElement('div');
            pBar.className = 'vs-progress-bar';
            pWrap.appendChild(pBar);

            // 下载逻辑绑定
            dlBtn.onclick = () => {
                dlBtn.disabled = true;
                dlBtn.textContent = I18N.downloading;
                pWrap.style.display = 'block';

                const update = (p, msg) => { 
                    pBar.style.width = p + '%'; 
                    if(msg) dlBtn.textContent = msg; 
                };
                
                if (type === 'mp4') {
                    GM_download({
                        url, 
                        name: `video_${Date.now()}.mp4`,
                        onprogress: (d) => {
                            if (d.total) update((d.loaded/d.total)*100);
                        },
                        onload: () => { update(100, I18N.complete); dlBtn.disabled = false; },
                        onerror: () => { update(0, I18N.error); dlBtn.disabled = false; }
                    });
                } else {
                    new M3U8Downloader(url, update).start()
                        .then(() => { dlBtn.disabled = false; })
                        .catch((e) => { 
                            console.error(e);
                            dlBtn.textContent = I18N.error; 
                            dlBtn.disabled = false; 
                        });
                }
            };

            item.appendChild(meta);
            item.appendChild(actions);
            item.appendChild(pWrap);
            
            this.list.insertBefore(item, this.list.firstChild);
        }
    }

    // ==========================================
    // 3. 嗅探与初始化 (解决时序问题)
    // ==========================================
    
    // 全局检查函数
    function check(url) {
        if (!url || url.startsWith('blob:') || FOUND_URLS.has(url)) return;
        
        let type = '';
        if (url.includes('.m3u8')) type = 'm3u8';
        else if (url.includes('.mp4')) type = 'mp4';
        
        if (type) {
            FOUND_URLS.add(url);
            // 如果UI已经初始化，直接添加
            if (uiInstance && uiInstance.list) {
                uiInstance.addItem(url, type);
            } else {
                // UI还没好，存入队列
                PENDING_ITEMS.push({ url, type });
            }
        }
    }

    // 立即Hook (在document-start时执行)
    const _fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async (...args) => {
        const url = args[0] instanceof Request ? args[0].url : args[0];
        check(url);
        return _fetch.apply(unsafeWindow, args);
    };

    const _open = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function (m, url) {
        check(url);
        return _open.apply(this, arguments);
    };

    // 延迟UI初始化 (等待DOM Ready)
    function tryInitUI() {
        if (document.body && !uiInstance) {
            uiInstance = new FloatingUI();
        }
    }

    // 1. 如果当前已经是 interactive 或 complete，直接初始化
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        tryInitUI();
    } else {
        // 2. 否则监听 DOMContentLoaded
        document.addEventListener('DOMContentLoaded', tryInitUI);
        // 3. 再加一层保险，监听 window load
        window.addEventListener('load', tryInitUI);
    }

})();