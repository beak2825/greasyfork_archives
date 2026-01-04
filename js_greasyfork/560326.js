// ==UserScript==
// @name         Poipiku Ripper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tải ảnh từ poipiku
// @author       Kaypi
// @match        https://poipiku.com/*
// @grant        GM_xmlhttpRequest
// @connect      cdn.poipiku.com
// @connect      poipiku.com
// @connect      *
// @run-at       document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/560326/Poipiku%20Ripper.user.js
// @updateURL https://update.greasyfork.org/scripts/560326/Poipiku%20Ripper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎨 Poipiku Downloader');

    const MIN_FILE_SIZE = 1024; // 1KB
    let convertToJPG = false;
    const imageCache = new Map();
    let lastProcessedOverlay = null;
    let isProcessing = false;

    const style = document.createElement('style');
    style.textContent = `
        .ppk-container {
            position: relative;
            z-index: 999;
            text-align: center;
            margin: 10px auto 15px;
            padding: 15px;
            background: linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%);
            border-radius: 15px;
            backdrop-filter: blur(10px);
            max-width: 500px;
        }
        .ppk-download-btn {
            padding: 14px 35px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-size: 15px;
            box-shadow: 0 5px 20px rgba(102,126,234,0.4);
            transition: all 0.3s;
        }
        .ppk-download-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(102,126,234,0.6);
        }
        .ppk-download-btn:disabled {
            opacity: 0.7;
            cursor: wait;
        }
        .ppk-download-btn.ready {
            background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { box-shadow: 0 5px 20px rgba(0,184,148,0.4); }
            50% { box-shadow: 0 5px 30px rgba(0,184,148,0.7); }
        }
        .ppk-option-btn {
            padding: 8px 18px;
            background: rgba(52, 73, 94, 0.8);
            color: white;
            border: 2px solid transparent;
            border-radius: 20px;
            cursor: pointer;
            font-size: 12px;
            margin: 5px;
            transition: all 0.3s;
        }
        .ppk-option-btn.active {
            background: rgba(39, 174, 96, 0.9);
            border-color: #27ae60;
        }
        .ppk-cache-status {
            margin-top: 10px;
            padding: 8px 15px;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            font-size: 13px;
            color: #fff;
        }
        .ppk-cache-status.caching { color: #fdcb6e; }
        .ppk-cache-status.ready { color: #00b894; }
        .ppk-cache-status.error { color: #e74c3c; }
        .ppk-progress {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 30px 50px;
            border-radius: 20px;
            z-index: 9999999;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            min-width: 320px;
        }
        .ppk-progress-bar {
            width: 100%;
            height: 10px;
            background: rgba(52, 73, 94, 0.8);
            border-radius: 5px;
            margin-top: 15px;
            overflow: hidden;
        }
        .ppk-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00b894, #00cec9, #0984e3);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
            border-radius: 5px;
            transition: width 0.3s;
        }
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        .ppk-options { margin-top: 12px; }
        .ppk-log { font-size: 12px; color: #74b9ff; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // =============================================
    // OBSERVER
    // =============================================
    const observer = new MutationObserver((mutations) => {
        if (isProcessing) return;

        const overlay = document.getElementById('DetailOverlay');
        if (!overlay) return;

        const isOpen = overlay.classList.contains('overlay-on');

        if (isOpen) {
            const overlayInner = document.getElementById('DetailOverlayInner');
            if (!overlayInner) return;

            const currentContent = overlayInner.innerHTML.substring(0, 200);
            if (lastProcessedOverlay === currentContent) return;

            setTimeout(() => {
                if (overlayInner.querySelector('.ppk-container')) return;

                isProcessing = true;
                lastProcessedOverlay = currentContent;

                initOverlay(overlayInner);

                isProcessing = false;
            }, 300);
        } else {
            lastProcessedOverlay = null;
            imageCache.clear(); // Clear cache khi đóng overlay
        }
    });

    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        childList: true,
        subtree: true
    });

    // =============================================
    // 🔥 LẤY URL THẬT
    // =============================================
    function getRealImageUrl(img) {
        // 1. data-lazy-src (lazy load URL thật)
        const lazySrc = img.getAttribute('data-lazy-src');
        if (lazySrc && lazySrc.startsWith('http')) {
            return lazySrc;
        }

        // 2. data-original-src (nếu là URL thật)
        const originalSrc = img.dataset.originalSrc;
        if (originalSrc && originalSrc.startsWith('http')) {
            return originalSrc;
        }

        // 3. src hiện tại (blob hoặc URL)
        if (img.src) {
            // Nếu là blob → site đã cache, cần lấy URL gốc từ attribute khác
            if (img.src.startsWith('blob:')) {
                // Thử tìm URL gốc đã lưu
                return img.dataset.realUrl || null;
            }
            if (img.src.startsWith('http')) {
                return img.src;
            }
        }

        return null;
    }

    // =============================================
    // INIT OVERLAY
    // =============================================
    async function initOverlay(overlayInner) {
        const images = overlayInner.querySelectorAll('img.DetailIllustItemImage');
        if (images.length === 0) return;

        // Collect valid URLs
        const imageData = [];
        images.forEach((img, idx) => {
            const url = getRealImageUrl(img);
            if (url) {
                imageData.push({ url, img, index: idx });
            }
        });

        console.log(`🔍 Tìm thấy ${imageData.length}/${images.length} ảnh có URL`);

        if (imageData.length === 0) return;

        // Tìm vị trí chèn
        const illustItemLink = overlayInner.querySelector('.DetailIllustItemLink');
        if (!illustItemLink) return;

        // 🔥 Hiển thị UI NGAY LẬP TỨC
        addDownloadUI(overlayInner, illustItemLink, imageData);

        // 🔥 Cache ảnh bằng GM_xmlhttpRequest (background)
        await cacheImagesWithGM(overlayInner, imageData);
    }

    // =============================================
    // 🔥 DOWNLOAD UI - Hiển thị ngay
    // =============================================
    function addDownloadUI(overlayInner, illustItemLink, imageData) {
        const container = document.createElement('div');
        container.className = 'ppk-container';
        container.innerHTML = `
            <button class="ppk-download-btn" id="ppk-dl-btn" disabled>
                ⏳ Đang chuẩn bị ${imageData.length} ảnh...
            </button>
            <div class="ppk-options">
                <button class="ppk-option-btn ${!convertToJPG ? 'active' : ''}" id="ppk-original">
                    📄 Giữ định dạng gốc
                </button>
                <button class="ppk-option-btn ${convertToJPG ? 'active' : ''}" id="ppk-convert">
                    🎨 Convert → JPG
                </button>
            </div>
            <div class="ppk-cache-status caching" id="ppk-cache-status">
                ⏳ Đang tải ảnh qua GM_xmlhttpRequest...
            </div>
        `;

        // 🔥 Chèn TRƯỚC ảnh (đầu tiên)
        illustItemLink.parentNode.insertBefore(container, illustItemLink);

        container.querySelector('#ppk-dl-btn').onclick = () => downloadAllImages();

        container.querySelector('#ppk-original').onclick = function() {
            convertToJPG = false;
            this.classList.add('active');
            container.querySelector('#ppk-convert').classList.remove('active');
        };

        container.querySelector('#ppk-convert').onclick = function() {
            convertToJPG = true;
            this.classList.add('active');
            container.querySelector('#ppk-original').classList.remove('active');
        };
    }

    // =============================================
    // 🔥 CACHE IMAGES VỚI GM_xmlhttpRequest
    // =============================================
    async function cacheImagesWithGM(container, imageData) {
        const statusEl = container.querySelector('#ppk-cache-status');
        const btn = container.querySelector('#ppk-dl-btn');

        let cached = 0;
        let skipped = 0;
        let failed = 0;

        for (let i = 0; i < imageData.length; i++) {
            const { url, img } = imageData[i];

            if (statusEl) {
                statusEl.textContent = `⏳ Đang cache ${i + 1}/${imageData.length}...`;
            }

            // Skip nếu đã cache
            if (imageCache.has(url)) {
                cached++;
                continue;
            }

            const result = await gmFetchImage(url);

            if (result.success) {
                if (result.blob.size >= MIN_FILE_SIZE) {
                    imageCache.set(url, {
                        blob: result.blob,
                        originalUrl: url,
                        originalExt: getFileExtension(url),
                        size: result.blob.size
                    });
                    cached++;
                    console.log(`✅ GM cached: ${getShortUrl(url)} → ${formatSize(result.blob.size)}`);
                } else {
                    skipped++;
                    console.log(`⏭️ Skipped (too small): ${formatSize(result.blob.size)}`);
                }
            } else {
                // Fallback to canvas
                console.log(`⚠️ GM failed, trying canvas...`);
                const canvasResult = await canvasFallback(url, img);
                if (canvasResult) {
                    cached++;
                } else {
                    failed++;
                }
            }
        }

        // Update UI
        if (btn) {
            if (cached > 0) {
                btn.disabled = false;
                btn.classList.add('ready');
                btn.textContent = `⬇️ Download ${cached} ảnh`;
            } else {
                btn.textContent = `❌ Không có ảnh`;
            }
        }

        if (statusEl) {
            statusEl.className = 'ppk-cache-status ready';
            let msg = `✅ Sẵn sàng! ${cached} ảnh`;
            if (skipped > 0) msg += ` (${skipped} bỏ qua)`;
            if (failed > 0) msg += ` (${failed} lỗi)`;
            statusEl.textContent = msg;
        }

        console.log(`📦 Cache done: ${cached} OK, ${skipped} skipped, ${failed} failed`);
    }

    // =============================================
    // 🔥 GM_xmlhttpRequest FETCH
    // =============================================
    function gmFetchImage(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: {
                    'Accept': 'image/*',
                    'Referer': 'https://poipiku.com/'
                },
                onload: function(response) {
                    if (response.status === 200 && response.response) {
                        resolve({ success: true, blob: response.response });
                    } else {
                        resolve({ success: false, error: `HTTP ${response.status}` });
                    }
                },
                onerror: function(error) {
                    resolve({ success: false, error: error });
                },
                ontimeout: function() {
                    resolve({ success: false, error: 'Timeout' });
                }
            });
        });
    }

    // =============================================
    // CANVAS FALLBACK
    // =============================================
    function canvasFallback(url, imgElement) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = function() {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;

                    if (canvas.width === 0 || canvas.height === 0) {
                        resolve(false);
                        return;
                    }

                    const ctx = canvas.getContext('2d');
                    const ext = getFileExtension(url);
                    let mimeType = 'image/jpeg';

                    if (ext === 'png' || ext === 'gif') {
                        mimeType = 'image/png';
                    } else {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob(function(blob) {
                        if (blob && blob.size >= MIN_FILE_SIZE) {
                            imageCache.set(url, {
                                blob: blob,
                                originalUrl: url,
                                originalExt: ext,
                                size: blob.size
                            });
                            console.log(`✅ Canvas cached: ${getShortUrl(url)} → ${formatSize(blob.size)}`);
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }, mimeType, 1.0);
                } catch (e) {
                    resolve(false);
                }
            };

            img.onerror = () => resolve(false);

            // Thử load từ src hiện tại của element (có thể là blob đã được site cache)
            if (imgElement && imgElement.src && imgElement.src.startsWith('blob:')) {
                img.src = imgElement.src;
            } else {
                img.src = url;
            }
        });
    }

    // =============================================
    // DOWNLOAD ALL
    // =============================================
    async function downloadAllImages() {
        const btn = document.getElementById('ppk-dl-btn');
        btn.disabled = true;
        btn.textContent = '⏳ Đang tải xuống...';

        const cachedImages = [...imageCache.values()].filter(d => d.size >= MIN_FILE_SIZE);

        if (cachedImages.length === 0) {
            alert('❌ Không có ảnh nào!');
            btn.disabled = false;
            btn.textContent = `⬇️ Download`;
            return;
        }

        const ids = extractPoipikuIds(cachedImages[0].originalUrl);
        const progress = createProgressUI(cachedImages.length);
        document.body.appendChild(progress);

        let completed = 0;
        let success = 0;

        for (let i = 0; i < cachedImages.length; i++) {
            const data = cachedImages[i];
            const ext = convertToJPG ? 'jpg' : data.originalExt;
            const filename = `${ids.userId}_${ids.postId}_${String(i + 1).padStart(3, '0')}.${ext}`;

            try {
                let blobToDownload = data.blob;

                // Convert to JPG if needed
                if (convertToJPG && data.originalExt !== 'jpg') {
                    blobToDownload = await convertBlobToJPG(data.blob);
                }

                if (blobToDownload && blobToDownload.size >= MIN_FILE_SIZE) {
                    downloadBlob(blobToDownload, filename);
                    success++;
                    updateProgress(completed + 1, cachedImages.length, progress, `✅ ${filename} (${formatSize(blobToDownload.size)})`);
                } else {
                    updateProgress(completed + 1, cachedImages.length, progress, `❌ ${filename}`);
                }
            } catch (e) {
                updateProgress(completed + 1, cachedImages.length, progress, `❌ ${filename}`);
            }

            completed++;
            await sleep(300);
        }

        showFinalResult(success, cachedImages.length, progress);
        btn.disabled = false;
        btn.classList.add('ready');
        btn.textContent = `⬇️ Download ${cachedImages.length} ảnh`;
    }

    // =============================================
    // CONVERT BLOB → JPG
    // =============================================
    function convertBlobToJPG(blob) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');

                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob(function(jpgBlob) {
                    URL.revokeObjectURL(img.src);
                    resolve(jpgBlob);
                }, 'image/jpeg', 1.0);
            };
            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                resolve(null);
            };
            img.src = URL.createObjectURL(blob);
        });
    }

    // =============================================
    // UTILITIES
    // =============================================
    function extractPoipikuIds(url) {
        if (!url) return { userId: 'poipiku', postId: Date.now().toString() };
        const match = url.match(/\/0*(\d+)\/+0*(\d+)/);
        if (match) return { userId: match[1], postId: match[2] };
        return { userId: 'poipiku', postId: Date.now().toString() };
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }

    function getShortUrl(url) {
        if (!url) return 'unknown';
        const match = url.match(/\/([^\/]+)$/);
        return match ? match[1].substring(0, 30) : url.substring(0, 35);
    }

    function getFileExtension(url) {
        if (!url) return 'jpg';
        const clean = url.split('?')[0].toLowerCase();
        if (clean.endsWith('.png')) return 'png';
        if (clean.endsWith('.gif')) return 'gif';
        if (clean.endsWith('.webp')) return 'webp';
        return 'jpg';
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function createProgressUI(total) {
        const progress = document.createElement('div');
        progress.className = 'ppk-progress';
        progress.innerHTML = `
            <div style="font-size: 28px; margin-bottom: 10px;">📥</div>
            <div id="ppk-status">⏳ Đang tải 0/${total}...</div>
            <div class="ppk-progress-bar">
                <div class="ppk-progress-fill" id="ppk-bar" style="width: 0%"></div>
            </div>
            <div class="ppk-log" id="ppk-log"></div>
        `;
        return progress;
    }

    function updateProgress(current, total, el, log) {
        el.querySelector('#ppk-status').textContent = `⏳ Đang tải ${current}/${total}...`;
        el.querySelector('#ppk-bar').style.width = `${(current / total * 100)}%`;
        if (log) el.querySelector('#ppk-log').textContent = log;
    }

    function showFinalResult(success, total, el) {
        const emoji = success === total ? '🎉' : '⚠️';
        el.querySelector('#ppk-status').innerHTML = `${emoji} Hoàn thành ${success}/${total} ảnh!`;
        el.querySelector('#ppk-bar').style.width = '100%';
        el.querySelector('#ppk-bar').style.background = success === total ?
            'linear-gradient(90deg, #00b894, #00cec9)' :
            'linear-gradient(90deg, #fdcb6e, #e17055)';
        setTimeout(() => el.remove(), 3000);
    }

    // Debug
    window.ppkDebug = () => {
        console.log('📊 Cache:', imageCache.size);
        imageCache.forEach((d, k) => console.log(`  ${getShortUrl(k)}: ${formatSize(d.size)}`));
    };

})();