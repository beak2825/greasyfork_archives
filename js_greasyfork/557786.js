// ==UserScript==
// @name         StreamSaver Video Sniffer
// @name:zh-CN   通用视频嗅探器
// @namespace    org.jw23.videosniffer
// @version      23.5
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

(function() {
    'use strict';

    // StreamSaver 代理配置
    streamSaver.mitm = 'https://xn--ghqr82bqvkxl7a.xn--10vm87c.xn--6qq986b3xl/connect';

    const Config = {
        scanInterval: 2000,
        uiId: 'gm-sniffer-stream-v23-fixed',
        get maxThreads() { return GM_getValue('max_threads', 3); },
        maxRetries: 5,
        retryDelay: 2000,
        colors: { primary: '#03a9f4', background: 'rgba(0, 0, 0, 0.9)', text: '#ffffff' }
    };

    GM_registerMenuCommand(`⚙️ 设置并发下载数 (当前: ${Config.maxThreads})`, () => {
        const val = parseInt(prompt('请输入并发数 (建议 2-5):', Config.maxThreads));
        if (val && val > 0 && val <= 16) {
            GM_setValue('max_threads', val);
            alert(`设置成功，刷新生效。`);
        }
    });

    const Utils = {
        request: (url, isBinary = false) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: isBinary ? 'arraybuffer' : 'text',
                    headers: { 'Referer': location.href, 'Origin': location.origin },
                    timeout: 60000,
                    onload: (res) => (res.status >= 200 && res.status < 300) ? resolve(res.response) : reject(new Error(`HTTP ${res.status}`)),
                    onerror: (err) => reject(err),
                    ontimeout: () => reject(new Error('Timeout'))
                });
            });
        },
        sleep: (ms) => new Promise(r => setTimeout(r, ms)),
        createElement: (tag, attrs = {}, children = []) => {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([k, v]) => {
                if (k === 'style') Object.assign(el.style, v);
                else if (k.startsWith('on')) el.addEventListener(k.substring(2).toLowerCase(), v);
                else el.setAttribute(k, v);
            });
            (Array.isArray(children) ? children : [children]).forEach(c => el.appendChild(c instanceof Node ? c : document.createTextNode(String(c))));
            return el;
        },
        getFilename: (url) => {
            let name = url.split('?')[0].split('/').pop();
            return (name && name.trim() !== '') ? decodeURIComponent(name) : `video_${Date.now()}.mp4`;
        },
        resolveUrl: (baseUrl, relativeUrl) => {
            if (relativeUrl.startsWith('http')) return relativeUrl;
            try { return new URL(relativeUrl, baseUrl).href; } catch { return relativeUrl; }
        }
    };

    const AESCrypto = {
        hexToBytes: (hex) => new Uint8Array(hex.replace(/^0x/i, '').match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
        sequenceToIV: (seq) => {
            const view = new DataView(new ArrayBuffer(16));
            view.setUint32(12, seq, false);
            return new Uint8Array(view.buffer);
        },
        decrypt: async (data, key, iv) => {
            try {
                const k = await window.crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['decrypt']);
                return new Uint8Array(await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, k, data));
            } catch (e) { console.error('Decryption failed', e); return null; }
        }
    };

    const Bus = {
        events: {},
        on(e, cb) { (this.events[e] = this.events[e] || []).push(cb); },
        emit(e, d) { (this.events[e] || []).forEach(cb => cb(d)); }
    };

    class Sniffer {
        constructor() {
            this.seen = new Set();
            this.rules = { m3u8: /\.m3u8($|\?)|application\/.*mpegurl/i, mp4: /\.mp4($|\?)|video\/mp4/i };
        }
        start() {
            this.hookFetch();
            this.hookXHR();
        }
        detect(url, type = '') {
            if (!url || url.match(/^data:|^blob:|\.(png|jpg|gif|css|js|woff|svg)/i)) return;
            const key = url.split('?')[0];
            if (this.seen.has(key)) return;
            
            for (const [k, r] of Object.entries(this.rules)) {
                if (r.test(url) || r.test(type.toLowerCase())) {
                    this.seen.add(key);
                    console.log(`[Sniffer] ${k}: ${url}`);
                    Bus.emit('video-found', { url, type: k });
                    break;
                }
            }
        }
        hookFetch() {
            const orig = unsafeWindow.fetch;
            unsafeWindow.fetch = async (...args) => {
                const res = await orig.apply(unsafeWindow, args);
                try { res.clone().headers.forEach((v, k) => k.toLowerCase() === 'content-type' && this.detect(res.url, v)); } catch {}
                return res;
            };
        }
        hookXHR() {
            const orig = unsafeWindow.XMLHttpRequest;
            const self = this;
            unsafeWindow.XMLHttpRequest = class extends orig {
                open(m, u, ...a) { this._url = u; super.open(m, u, ...a); }
                send(...a) {
                    this.addEventListener('readystatechange', () => {
                        if (this.readyState === 4) try { self.detect(this.responseURL || this._url, this.getResponseHeader('content-type')); } catch {}
                    });
                    super.send(...a);
                }
            };
        }
    }

    class StreamSaverWriter {
        async init(filename) {
            this.writer = streamSaver.createWriteStream(filename).getWriter();
        }
        async write(data) {
            if (this.writer) await this.writer.write(data);
        }
        async close() {
            if (this.writer) await this.writer.close();
        }
        async abort() {
            if (this.writer) await this.writer.abort();
        }
    }

    const downloadM3u8 = async (url, onProgress, writer) => {
        onProgress(0, '解析M3U8...');
        let content = await Utils.request(url);
        
        // 解析 Master Playlist
        if (content.includes('#EXT-X-STREAM-INF')) {
            const lines = content.split('\n');
            let best = 0, targetUrl = null;
            lines.forEach((l, i) => {
                if (l.startsWith('#EXT-X-STREAM-INF')) {
                    const bw = parseInt((l.match(/BANDWIDTH=(\d+)/) || [0,0])[1]);
                    if (bw > best && lines[i+1] && !lines[i+1].startsWith('#')) {
                        best = bw;
                        targetUrl = Utils.resolveUrl(url, lines[i+1].trim());
                    }
                }
            });
            if (targetUrl) {
                url = targetUrl;
                content = await Utils.request(url);
            }
        }

        const lines = content.split('\n');
        const segs = [];
        let key = null, iv = null, seq = 0;
        
        lines.forEach(line => {
            const l = line.trim();
            if (!l) return;
            if (l.startsWith('#EXT-X-KEY')) {
                const u = (l.match(/URI="([^"]+)"/) || [])[1];
                const i = (l.match(/IV=(0x[\da-f]+)/i) || [])[1];
                if (u) {
                    key = Utils.resolveUrl(url, u);
                    iv = i ? AESCrypto.hexToBytes(i) : null;
                }
            } else if (l.startsWith('#EXT-X-MEDIA-SEQUENCE')) {
                seq = parseInt(l.split(':')[1]);
            } else if (!l.startsWith('#')) {
                segs.push({ url: Utils.resolveUrl(url, l), key, iv, seq: seq++ });
            }
        });

        if (!segs.length) throw new Error('无分片');

        // 下载密钥
        const keyCache = new Map();
        const keys = [...new Set(segs.filter(s => s.key).map(s => s.key))];
        for (const kUrl of keys) {
            onProgress(0, '下载密钥...');
            keyCache.set(kUrl, new Uint8Array(await Utils.request(kUrl, true)));
        }

        // ==========================================
        // 核心修复 1: Mux.js 时间轴修复
        // ==========================================
        const transmuxer = new muxjs.mp4.Transmuxer();
        let bufferQueue = [];
        let hasWrittenHeader = false; // 标记是否写入过 initSegment

        transmuxer.on('data', (segment) => {
            // 只有第一次写入 initSegment (FTYP+MOOV)
            // 后续只写入 data (MOOF+MDAT)
            if (!hasWrittenHeader) {
                const data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                data.set(segment.initSegment, 0);
                data.set(segment.data, segment.initSegment.byteLength);
                bufferQueue.push(data);
                hasWrittenHeader = true;
                console.log('[Muxer] Writing Init Header');
            } else {
                bufferQueue.push(segment.data);
            }
        });

        let nextIdx = 0, doneCount = 0, writeIdx = 0;
        const dlMap = new Map();

        const worker = async () => {
            while (nextIdx < segs.length) {
                const idx = nextIdx++;
                const seg = segs[idx];
                let raw = null, retry = Config.maxRetries;

                while (!raw && retry-- > 0) {
                    try {
                        let d = await Utils.request(seg.url, true);
                        if (seg.key) {
                            d = (await AESCrypto.decrypt(d, keyCache.get(seg.key), seg.iv || AESCrypto.sequenceToIV(seg.seq))).buffer;
                        }
                        raw = d;
                    } catch { await Utils.sleep(Config.retryDelay); }
                }

                dlMap.set(idx, raw ? new Uint8Array(raw) : new Uint8Array(0));

                // 串行转码与写入
                while (dlMap.has(writeIdx)) {
                    const chunk = dlMap.get(writeIdx);
                    dlMap.delete(writeIdx);
                    bufferQueue = [];
                    
                    if (chunk.length > 0) {
                        try {
                            transmuxer.push(chunk);
                            transmuxer.flush(); // 这里的 flush 可能会导致问题，但在逐个处理时，如果不 flush 可能不出数据
                            // 由于我们上面加了 hasWrittenHeader 锁，所以即使 flush 导致重新生成 initSegment，我们也会忽略它
                        } catch (e) { console.warn('Mux error', e); }
                    }

                    for (const d of bufferQueue) await writer.write(d);
                    writeIdx++;
                }

                doneCount++;
                onProgress(((doneCount / segs.length) * 100).toFixed(1), `下载中 ${((doneCount / segs.length) * 100).toFixed(0)}%`);
            }
        };

        await Promise.all(Array(Math.min(Config.maxThreads, segs.length)).fill(null).map(worker));
    };

    const downloadMp4Stream = async (url, onProgress, writer) => {
        onProgress(0, '连接中...');
        const res = await fetch(url, { headers: { 'Referer': location.href } });
        if (!res.body) throw new Error('No body');
        const reader = res.body.getReader();
        const total = +res.headers.get('Content-Length');
        let loaded = 0;
        
        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            await writer.write(value);
            loaded += value.length;
            onProgress(total ? ((loaded/total)*100).toFixed(1) : 0, total ? `${((loaded/total)*100).toFixed(1)}%` : `${(loaded/1024/1024).toFixed(1)}MB`);
        }
    };

    const TaskRunner = async (url, type, btn) => {
        const origText = btn.textContent;
        let fname = Utils.getFilename(url);
        if (type === 'm3u8' && !fname.endsWith('.mp4')) fname += '.mp4';
        
        const writer = new StreamSaverWriter();
        try {
            await writer.init(fname);
            btn.textContent = '准备...';
            if (type === 'm3u8') await downloadM3u8(url, (p, t) => btn.textContent = t||p, writer);
            else await downloadMp4Stream(url, (p, t) => btn.textContent = t||p, writer);
            
            btn.textContent = '完成';
            await writer.close();
        } catch (e) {
            console.error(e);
            alert(`下载失败: ${e.message}`);
            await writer.abort();
            btn.textContent = '失败';
        } finally {
            setTimeout(() => btn.textContent = origText, 3000);
        }
    };

    class UI {
        constructor() {
            this.root = null;
            this.list = null;
            Bus.on('video-found', (d) => this.addItem(d));
        }
        init() {
            if (document.getElementById(Config.uiId)) return;
            const host = Utils.createElement('div', { id: Config.uiId, style: { position: 'fixed', top: '15%', right: '2%', zIndex: 999999 } });
            const shadow = host.attachShadow({ mode: 'open' });
            
            // ==========================================
            // 核心修复 2: 样式调整，默认 min 状态
            // ==========================================
            shadow.innerHTML = `
            <style>
                :host { font-family: sans-serif; font-size: 12px; }
                .box {
                    width: 220px; background: ${Config.colors.background}; color: ${Config.colors.text};
                    border: 1px solid ${Config.colors.primary}; border-radius: 6px;
                    backdrop-filter: blur(5px); display: flex; flex-direction: column;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5); transition: width 0.3s;
                }
                .head { padding: 8px; background: rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; cursor: move; }
                .title { font-weight: bold; color: ${Config.colors.primary}; }
                .list { max-height: 200px; overflow-y: auto; }
                .item { padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .row { display: flex; gap: 5px; align-items: center; margin-bottom: 5px; }
                .tag { background: ${Config.colors.primary}; color: #000; padding: 1px 3px; border-radius: 3px; font-weight: bold; font-size: 10px; }
                .name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
                .actions { display: flex; gap: 5px; }
                button { flex: 1; border: none; padding: 6px; border-radius: 3px; cursor: pointer; font-size: 12px; }
                .btn-copy { background: #555; color: white; }
                .btn-down { background: ${Config.colors.primary}; color: #000; font-weight: bold; }
                
                /* 最小化样式 */
                .box.min { width: 40px; height: 40px; border-radius: 50%; justify-content: center; align-items: center; overflow: hidden; cursor: pointer; }
                .box.min .list, .box.min .title { display: none; }
                .box.min .head { background: transparent; padding: 0; width: 100%; height: 100%; justify-content: center; }
                .toggle { font-size: 16px; font-weight: bold; }
            </style>
            `;

            // 默认加上 'min' class
            this.root = Utils.createElement('div', { class: 'box min' }); 
            this.list = Utils.createElement('div', { class: 'list' });
            
            // 初始图标为闪电
            const toggle = Utils.createElement('span', { class: 'toggle' }, '⚡');
            
            const head = Utils.createElement('div', { class: 'head' });
            head.appendChild(Utils.createElement('span', { class: 'title' }, '流式嗅探'));
            head.appendChild(toggle);

            // 点击切换逻辑
            const toggleAction = (e) => {
                e && e.stopPropagation();
                const isMin = this.root.classList.toggle('min');
                toggle.textContent = isMin ? '⚡' : '－';
            };

            // 在 min 状态下，点击整个头部或盒子都应该展开
            toggle.onclick = toggleAction;
            this.root.onclick = (e) => {
                if (this.root.classList.contains('min')) toggleAction(e);
            };

            this.root.appendChild(head);
            this.root.appendChild(this.list);
            shadow.appendChild(this.root);
            (document.body || document.documentElement).appendChild(host);

            // 拖拽逻辑 (保持不变)
            let isDrag = false, startX, startY, initRight, initTop;
            const onDown = (e) => {
                if(e.target === toggle && !this.root.classList.contains('min')) return;
                isDrag = true;
                const t = e.touches ? e.touches[0] : e;
                startX = t.clientX; startY = t.clientY;
                const rect = host.getBoundingClientRect();
                initRight = window.innerWidth - rect.right;
                initTop = rect.top;
            };
            const onMove = (e) => {
                if (!isDrag) return;
                if(e.preventDefault) e.preventDefault();
                const t = e.touches ? e.touches[0] : e;
                host.style.right = (initRight + (startX - t.clientX)) + 'px';
                host.style.top = (initTop + (t.clientY - startY)) + 'px';
            };
            head.addEventListener('mousedown', onDown);
            head.addEventListener('touchstart', onDown);
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, {passive: false});
            document.addEventListener('mouseup', () => isDrag=false);
            document.addEventListener('touchend', () => isDrag=false);
        }

        addItem({ url, type }) {
            this.init();
            
            // 移除了自动点击 toggle 展开的逻辑，保持默认收缩
            
            const item = Utils.createElement('div', { class: 'item' }, [
                Utils.createElement('div', { class: 'row' }, [
                    Utils.createElement('span', { class: 'tag' }, type),
                    Utils.createElement('span', { class: 'name', title: url }, Utils.getFilename(url))
                ]),
                Utils.createElement('div', { class: 'actions' }, [
                    Utils.createElement('button', { class: 'btn-copy', onclick: (e) => {
                        navigator.clipboard.writeText(url);
                        e.target.textContent = '已复制';
                        setTimeout(() => e.target.textContent = '复制', 1000);
                    }}, '复制'),
                    Utils.createElement('button', { class: 'btn-down', onclick: (e) => TaskRunner(url, type, e.target) }, '下载')
                ])
            ]);
            
            if (this.list.firstChild) this.list.insertBefore(item, this.list.firstChild);
            else this.list.appendChild(item);
        }
    }

    new Sniffer().start();
    new UI();
})();