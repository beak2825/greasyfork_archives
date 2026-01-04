// ==UserScript==
// @name         Redgifs Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Downloads Redgifs videos
// @match        *://*.redgifs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=redgifs.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557246/Redgifs%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/557246/Redgifs%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. STYLES
    // ==========================================
    GM_addStyle(`
        .rg-download-item {
            cursor: pointer;
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .rg-download-btn {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #EFEEF0;
            transition: transform 0.2s;
        }
        .rg-download-btn:hover {
            transform: scale(1.15);
        }
        .rg-download-btn:active {
            transform: scale(0.95);
        }
        .rg-download-btn svg {
            width: 28px;
            height: 28px;
            stroke: #EFEEF0;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            fill: none;
        }
        .rg-loading-spinner {
            animation: rg-spin 1s linear infinite;
        }
        @keyframes rg-spin {
            100% { transform: rotate(360deg); }
        }
    `);

    // ==========================================
    // 2. WORKER CODE (Embedded)
    // ==========================================
    const workerCode = `
    class MP4Processor {
        constructor() {
            this.initSegment = null;
            this.mediaSegments = [];
            this.totalSegments = 0;
            this.processedSegments = 0;
        }

        parseM3u8(manifest) {
            const lines = manifest.split('\\n');
            const segments = [];
            let initSegment = null;
            let currentSegment = null;

            for (let line of lines) {
                line = line.trim();
                if (line.startsWith('#EXT-X-MAP:')) {
                    const uriMatch = line.match(/URI="([^"]+)"/);
                    const byteRangeMatch = line.match(/BYTERANGE="([^"]+)"/);
                    if (uriMatch && byteRangeMatch) {
                        const [offset, length] = byteRangeMatch[1].split('@').reverse();
                        initSegment = {
                            url: uriMatch[1],
                            byteRange: { offset: parseInt(offset), length: parseInt(length) }
                        };
                    }
                } else if (line.startsWith('#EXT-X-BYTERANGE:')) {
                    const [length, offset] = line.split(':')[1].split('@');
                    if (currentSegment) {
                        currentSegment.byteRange = { offset: parseInt(offset || '0'), length: parseInt(length) };
                    }
                } else if (!line.startsWith('#') && line.length > 0 && currentSegment) {
                    currentSegment.url = line;
                    segments.push(currentSegment);
                    currentSegment = null;
                } else if (line.startsWith('#EXTINF:')) {
                    currentSegment = { duration: parseFloat(line.split(':')[1]) };
                }
            }
            this.totalSegments = segments.length;
            return { initSegment, segments };
        }

        processSegment(data, isInit) {
            if (isInit) {
                this.initSegment = new Uint8Array(data);
            } else {
                this.mediaSegments.push(new Uint8Array(data));
                this.processedSegments++;
            }
        }

        finalize() {
            const chunks = [this.initSegment];
            chunks.push(...this.mediaSegments);
            const totalSize = chunks.reduce((sum, chunk) => sum + (chunk ? chunk.length : 0), 0);
            const result = new Uint8Array(totalSize);
            let offset = 0;
            for (const chunk of chunks) {
                if(chunk) {
                    result.set(chunk, offset);
                    offset += chunk.length;
                }
            }
            return result;
        }
    }

    const processor = new MP4Processor();

    self.onmessage = async function(e) {
        const { type, data, manifest } = e.data;
        try {
            switch (type) {
                case 'PARSE_MANIFEST':
                    const result = processor.parseM3u8(manifest);
                    self.postMessage({ type: 'MANIFEST_PARSED', data: result });
                    break;
                case 'PROCESS_SEGMENT':
                    processor.processSegment(data.buffer, data.isInit);
                    self.postMessage({ type: 'PROGRESS', progress: (processor.processedSegments / processor.totalSegments) * 100 });
                    break;
                case 'FINALIZE':
                    const finalBuffer = processor.finalize();
                    self.postMessage({ type: 'COMPLETE', buffer: finalBuffer.buffer }, [finalBuffer.buffer]);
                    break;
            }
        } catch (error) {
            self.postMessage({ type: 'ERROR', error: error.message });
        }
    };
    `;

    const workerBlob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(workerBlob);

    // ==========================================
    // 3. MAIN LOGIC
    // ==========================================

    class RedgifsDownloader {
        constructor() {
            this.initObserver();
            setInterval(() => this.scanForButtons(), 1500);
        }

        initObserver() {
            const observer = new MutationObserver(() => this.scanForButtons());
            observer.observe(document.body, { childList: true, subtree: true });
        }

        scanForButtons() {
            const viewButtons = document.querySelectorAll('.ViewButton');
            viewButtons.forEach(viewBtn => {
                const sideBarItem = viewBtn.closest('.sideBarItem');
                if (!sideBarItem) return;

                const sideBar = sideBarItem.parentElement;
                if (!sideBar || !sideBar.classList.contains('sideBar')) return;

                if (sideBar.querySelector('.rg-download-btn')) return;

                this.injectButton(sideBar, sideBarItem);
            });
        }

        injectButton(sidebar, viewItem) {
            const li = document.createElement('li');
            li.className = 'sideBarItem rg-download-item';

            const iconSvg = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            `;

            const btn = document.createElement('button');
            btn.className = 'rg-download-btn';
            btn.innerHTML = iconSvg;
            btn.title = "Download Video";

            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleDownload(btn, sidebar);
            };

            li.appendChild(btn);
            sidebar.insertBefore(li, viewItem);
        }

        async handleDownload(btn, sidebar) {
            if (btn.classList.contains('downloading')) return;

            const originalHtml = btn.innerHTML;
            btn.classList.add('downloading');
            btn.innerHTML = `<svg class="rg-loading-spinner" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>`;

            try {
                // Try to get ID
                const videoId = this.getVideoId(sidebar);
                if (!videoId) {
                    console.error("[RG Debug] No ID found via DOM scan");
                    throw new Error("No ID");
                }

                console.log(`[RG Debug] Found ID: ${videoId}`);

                const manifestUrl = `https://api.redgifs.com/v2/gifs/${videoId}/hd.m3u8`;
                const manifest = await this.fetchText(manifestUrl);

                const worker = new Worker(workerUrl);
                worker.postMessage({ type: 'PARSE_MANIFEST', manifest });

                worker.onmessage = async (e) => {
                    const { type, data, buffer } = e.data;

                    if (type === 'ERROR') {
                        this.fallbackDownload(btn, originalHtml, videoId);
                        worker.terminate();
                    } else if (type === 'MANIFEST_PARSED') {
                        const { initSegment, segments } = data;
                        try {
                            if (initSegment) {
                                const initData = await this.fetchArrayBuffer(initSegment.url, initSegment.byteRange);
                                worker.postMessage({ type: 'PROCESS_SEGMENT', data: { buffer: initData, isInit: true } });
                            }
                            for (const segment of segments) {
                                const segData = await this.fetchArrayBuffer(segment.url, segment.byteRange);
                                worker.postMessage({ type: 'PROCESS_SEGMENT', data: { buffer: segData, isInit: false } });
                            }
                            worker.postMessage({ type: 'FINALIZE' });
                        } catch (err) {
                            this.fallbackDownload(btn, originalHtml, videoId);
                            worker.terminate();
                        }
                    } else if (type === 'COMPLETE') {
                        this.triggerBrowserDownload(buffer, `redgifs_${videoId}.mp4`);
                        this.resetButton(btn, originalHtml, false);
                        worker.terminate();
                    }
                };

            } catch (err) {
                console.log("[RG Debug] HD Method failed or No ID, checking fallback logic...", err);
                const fallbackId = this.getVideoId(sidebar);
                if (fallbackId) {
                     this.fallbackDownload(btn, originalHtml, fallbackId);
                } else {
                     this.resetButton(btn, originalHtml, true);
                }
            }
        }

        async fallbackDownload(btn, originalHtml, videoId) {
            try {
                 console.log(`[RG Debug] Attempting fallback for: ${videoId}`);
                 const capId = videoId.charAt(0).toUpperCase() + videoId.slice(1);

                 // Try both .mp4 and .m4s formats which Redgifs uses
                 const urlsToTry = [
                     `https://media.redgifs.com/${capId}.mp4`,
                     `https://media.redgifs.com/${capId}-mobile.mp4`
                 ];

                 let blob = null;
                 for (let url of urlsToTry) {
                     try {
                         await this.fetchText(url, 'HEAD');
                         blob = await this.fetchBlob(url);
                         break;
                     } catch(e) { continue; }
                 }

                 if (!blob) throw new Error("All fallback URLs failed");

                 const url = URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = `redgifs_${videoId}.mp4`;
                 a.click();
                 URL.revokeObjectURL(url);
                 this.resetButton(btn, originalHtml, false);

            } catch (fallbackErr) {
                console.error("[RG Debug] Fallback completely failed", fallbackErr);
                this.resetButton(btn, originalHtml, true);
            }
        }

        resetButton(btn, originalHtml, isError) {
            btn.classList.remove('downloading');
            if (isError) {
                btn.innerHTML = `<svg viewBox="0 0 24 24" stroke="#FF5252"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            } else {
                btn.innerHTML = `<svg viewBox="0 0 24 24" stroke="#4CAF50"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            }
            setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
        }

        // ==========================================
        // 4. ROBUST ID FINDER
        // ==========================================
        getVideoId(sidebar) {
            // 1. Traverse UP looking for a container that might hold the video
            let current = sidebar;
            let attempts = 0;

            // We search up to 7 levels high to find a common wrapper
            while (current && attempts < 7) {
                const id = this.scanElementForId(current);
                if (id) return id;
                current = current.parentElement;
                attempts++;
            }
            return null;
        }

        scanElementForId(element) {
            // Regex to find Redgifs IDs (Mixed Case, usually 10+ chars)
            // Matches: /WatchId-mobile.jpg OR /WatchId.mp4 OR /watch/WatchId
            const regex = /\/([a-zA-Z0-9]{5,})(?:-mobile|-small)?\.(?:jpg|png|mp4|webm|m4s)|redgifs\.com\/watch\/([a-zA-Z0-9]{5,})/;

            // Helper to check string
            const check = (str) => {
                if (!str) return null;
                const match = str.match(regex);
                if (match) return match[1] || match[2];
                return null;
            };

            // 1. Check Video Tags (poster or src)
            const videos = element.querySelectorAll('video');
            for (let v of videos) {
                let id = check(v.poster) || check(v.src);
                if (id) return id;

                // Check sources inside video
                const sources = v.querySelectorAll('source');
                for (let s of sources) {
                    id = check(s.src);
                    if (id) return id;
                }
            }

            // 2. Check Thumbnails (Img tags)
            const imgs = element.querySelectorAll('img');
            for (let img of imgs) {
                // Skip very small icons like avatars
                if (img.width > 0 && img.width < 50) continue;
                let id = check(img.src);
                if (id) return id;
            }

            // 3. Check Anchor Links (watch urls)
            const links = element.querySelectorAll('a[href*="/watch/"]');
            for (let link of links) {
                let id = check(link.href);
                if (id) return id;
            }

            return null;
        }

        triggerBrowserDownload(buffer, filename) {
            const blob = new Blob([buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        }

        // ==========================================
        // 5. NETWORK HELPERS
        // ==========================================

        fetchText(url, method = 'GET') {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) resolve(res.responseText);
                        else reject(new Error(`HTTP ${res.status}`));
                    },
                    onerror: reject
                });
            });
        }

        fetchBlob(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) resolve(res.response);
                        else reject(new Error(`HTTP ${res.status}`));
                    },
                    onerror: reject
                });
            });
        }

        fetchArrayBuffer(url, byteRange) {
            return new Promise((resolve, reject) => {
                const headers = {};
                if (byteRange) {
                    headers['Range'] = `bytes=${byteRange.offset}-${byteRange.offset + byteRange.length - 1}`;
                }

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: headers,
                    responseType: 'arraybuffer',
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) resolve(res.response);
                        else reject(new Error(`HTTP ${res.status}`));
                    },
                    onerror: reject
                });
            });
        }
    }

    new RedgifsDownloader();

})();