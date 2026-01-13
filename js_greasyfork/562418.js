// ==UserScript==
// @name         ComicTop Pro Downloader + ZIP
// @namespace    http://tampermonkey.net/
// @version      5.0
// @license MIT
// @description  Professional comic downloader with ZIP support
// @match        https://comic-top.com/*
// @match        https://www.comic-top.com/*
// @icon         https://cdn.comic-top.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/562418/ComicTop%20Pro%20Downloader%20%2B%20ZIP.user.js
// @updateURL https://update.greasyfork.org/scripts/562418/ComicTop%20Pro%20Downloader%20%2B%20ZIP.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WORKER_PREFIX = "https://img.nihonkuni.com/?url=";

    /* ================= SIMPLE ZIP CREATOR ================= */

    class SimpleZip {
        constructor() {
            this.files = [];
        }

        addFile(name, data) {
            // data is Uint8Array
            this.files.push({ name, data });
        }

        generate() {
            const localFiles = [];
            const centralDir = [];
            let offset = 0;

            for (const file of this.files) {
                const nameBytes = new TextEncoder().encode(file.name);
                const localHeader = this._createLocalHeader(nameBytes, file.data);
                localFiles.push(localHeader, nameBytes, file.data);

                const centralHeader = this._createCentralHeader(nameBytes, file.data, offset);
                centralDir.push(centralHeader, nameBytes);

                offset += localHeader.byteLength + nameBytes.byteLength + file.data.byteLength;
            }

            const centralDirSize = centralDir.reduce((sum, arr) => sum + arr.byteLength, 0);
            const endRecord = this._createEndRecord(this.files.length, centralDirSize, offset);

            // Combine all parts
            const totalSize = offset + centralDirSize + endRecord.byteLength;
            const result = new Uint8Array(totalSize);
            let pos = 0;

            // Local files
            for (const part of localFiles) {
                result.set(new Uint8Array(part.buffer || part), pos);
                pos += part.byteLength;
            }

            // Central directory
            for (const part of centralDir) {
                result.set(new Uint8Array(part.buffer || part), pos);
                pos += part.byteLength;
            }

            // End record
            result.set(new Uint8Array(endRecord.buffer), pos);

            return new Blob([result], { type: 'application/zip' });
        }

        _createLocalHeader(nameBytes, data) {
            const header = new ArrayBuffer(30);
            const view = new DataView(header);

            view.setUint32(0, 0x04034b50, true);  // Local file header signature
            view.setUint16(4, 20, true);          // Version needed
            view.setUint16(6, 0, true);           // General purpose bit flag
            view.setUint16(8, 0, true);           // Compression method (STORE)
            view.setUint16(10, 0, true);          // Last mod time
            view.setUint16(12, 0, true);          // Last mod date
            view.setUint32(14, this._crc32(data), true);  // CRC-32
            view.setUint32(18, data.byteLength, true);    // Compressed size
            view.setUint32(22, data.byteLength, true);    // Uncompressed size
            view.setUint16(26, nameBytes.byteLength, true); // File name length
            view.setUint16(28, 0, true);          // Extra field length

            return new Uint8Array(header);
        }

        _createCentralHeader(nameBytes, data, offset) {
            const header = new ArrayBuffer(46);
            const view = new DataView(header);

            view.setUint32(0, 0x02014b50, true);  // Central directory signature
            view.setUint16(4, 20, true);          // Version made by
            view.setUint16(6, 20, true);          // Version needed
            view.setUint16(8, 0, true);           // General purpose bit flag
            view.setUint16(10, 0, true);          // Compression method
            view.setUint16(12, 0, true);          // Last mod time
            view.setUint16(14, 0, true);          // Last mod date
            view.setUint32(16, this._crc32(data), true);  // CRC-32
            view.setUint32(20, data.byteLength, true);    // Compressed size
            view.setUint32(24, data.byteLength, true);    // Uncompressed size
            view.setUint16(28, nameBytes.byteLength, true); // File name length
            view.setUint16(30, 0, true);          // Extra field length
            view.setUint16(32, 0, true);          // File comment length
            view.setUint16(34, 0, true);          // Disk number start
            view.setUint16(36, 0, true);          // Internal file attributes
            view.setUint32(38, 0, true);          // External file attributes
            view.setUint32(42, offset, true);     // Relative offset

            return new Uint8Array(header);
        }

        _createEndRecord(fileCount, centralDirSize, centralDirOffset) {
            const record = new ArrayBuffer(22);
            const view = new DataView(record);

            view.setUint32(0, 0x06054b50, true);  // End of central directory signature
            view.setUint16(4, 0, true);           // Disk number
            view.setUint16(6, 0, true);           // Disk number with central directory
            view.setUint16(8, fileCount, true);   // Number of entries on this disk
            view.setUint16(10, fileCount, true);  // Total number of entries
            view.setUint32(12, centralDirSize, true);     // Central directory size
            view.setUint32(16, centralDirOffset, true);   // Central directory offset
            view.setUint16(20, 0, true);          // Comment length

            return new Uint8Array(record);
        }

        _crc32(data) {
            let crc = 0xFFFFFFFF;
            const table = SimpleZip._crcTable || (SimpleZip._crcTable = this._makeCrcTable());

            for (let i = 0; i < data.length; i++) {
                crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
            }

            return (crc ^ 0xFFFFFFFF) >>> 0;
        }

        _makeCrcTable() {
            const table = new Uint32Array(256);
            for (let i = 0; i < 256; i++) {
                let c = i;
                for (let j = 0; j < 8; j++) {
                    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
                }
                table[i] = c;
            }
            return table;
        }
    }

    /* ================= STYLES ================= */

    const styles = document.createElement('style');
    styles.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .cdl-fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4), 0 8px 30px rgba(0,0,0,0.2);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: cdl-pulse 2s infinite;
        }

        .cdl-fab:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6), 0 12px 40px rgba(0,0,0,0.3);
        }

        .cdl-fab svg { width: 28px; height: 28px; fill: white; }

        @keyframes cdl-pulse {
            0%, 100% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4), 0 8px 30px rgba(0,0,0,0.2); }
            50% { box-shadow: 0 4px 25px rgba(102, 126, 234, 0.6), 0 8px 40px rgba(0,0,0,0.3); }
        }

        .cdl-panel {
            position: fixed;
            bottom: 110px;
            right: 30px;
            width: 360px;
            background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 20px;
            box-shadow: 0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
            z-index: 999998;
            font-family: 'Inter', -apple-system, sans-serif;
            overflow: hidden;
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            visibility: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cdl-panel.active {
            transform: translateY(0) scale(1);
            opacity: 1;
            visibility: visible;
        }

        .cdl-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            position: relative;
            overflow: hidden;
        }

        .cdl-header::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
            animation: cdl-shine 3s infinite;
        }

        @keyframes cdl-shine {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
        }

        .cdl-title {
            font-size: 18px;
            font-weight: 700;
            color: white;
            margin: 0;
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .cdl-title svg { width: 24px; height: 24px; }

        .cdl-subtitle {
            font-size: 12px;
            color: rgba(255,255,255,0.8);
            margin-top: 5px;
            position: relative;
        }

        .cdl-body { padding: 20px; }

        .cdl-info {
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid rgba(255,255,255,0.08);
        }

        .cdl-info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #a0a0a0;
            font-size: 13px;
        }

        .cdl-info-row + .cdl-info-row {
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.05);
        }

        .cdl-info-value { color: #fff; font-weight: 600; }

        .cdl-progress-container { margin-bottom: 20px; }

        .cdl-progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
        }

        .cdl-progress-label { color: #a0a0a0; }
        .cdl-progress-value { color: #667eea; font-weight: 600; }

        .cdl-progress-bar {
            height: 8px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            overflow: hidden;
        }

        .cdl-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
            background-size: 200% 100%;
            border-radius: 10px;
            width: 0%;
            transition: width 0.3s ease;
            animation: cdl-gradient 2s linear infinite;
        }

        @keyframes cdl-gradient {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        .cdl-status {
            text-align: center;
            padding: 12px;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
            color: #667eea;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 15px;
            border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .cdl-status.success { background: rgba(46, 213, 115, 0.1); color: #2ed573; border-color: rgba(46, 213, 115, 0.2); }
        .cdl-status.error { background: rgba(255, 71, 87, 0.1); color: #ff4757; border-color: rgba(255, 71, 87, 0.2); }

        .cdl-buttons { display: flex; flex-direction: column; gap: 10px; }

        .cdl-btn {
            padding: 14px 20px;
            border: none;
            border-radius: 12px;
            font-family: inherit;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .cdl-btn svg { width: 18px; height: 18px; }

        .cdl-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .cdl-btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .cdl-btn-secondary {
            background: rgba(255,255,255,0.08);
            color: #a0a0a0;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .cdl-btn-secondary:hover:not(:disabled) {
            background: rgba(255,255,255,0.12);
            color: white;
        }

        .cdl-btn-success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(56, 239, 125, 0.3);
        }

        .cdl-btn-success:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(56, 239, 125, 0.4);
        }

        .cdl-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
        }

        .cdl-log {
            max-height: 150px;
            overflow-y: auto;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            padding: 10px;
            margin-top: 15px;
            font-family: 'Fira Code', monospace;
            font-size: 11px;
        }

        .cdl-log::-webkit-scrollbar { width: 6px; }
        .cdl-log::-webkit-scrollbar-track { background: transparent; }
        .cdl-log::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }

        .cdl-log-item {
            padding: 4px 0;
            color: #666;
            border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .cdl-log-item:last-child { border-bottom: none; }
        .cdl-log-item.success { color: #2ed573; }
        .cdl-log-item.error { color: #ff4757; }
        .cdl-log-item.info { color: #667eea; }
        .cdl-log-item.warn { color: #ffa502; }

        .cdl-thumb-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 5px;
            margin-top: 15px;
            max-height: 80px;
            overflow-y: auto;
        }

        .cdl-thumb {
            aspect-ratio: 1;
            border-radius: 6px;
            overflow: hidden;
            background: rgba(255,255,255,0.05);
            position: relative;
        }

        .cdl-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .cdl-thumb.done::after {
            content: '✓';
            position: absolute; inset: 0;
            background: rgba(46, 213, 115, 0.8);
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 10px;
        }

        .cdl-thumb.error::after {
            content: '✗';
            position: absolute; inset: 0;
            background: rgba(255, 71, 87, 0.8);
            display: flex; align-items: center; justify-content: center;
            color: white; font-weight: bold; font-size: 10px;
        }

        .cdl-thumb.loading::after {
            content: '';
            position: absolute; inset: 0;
            background: rgba(102, 126, 234, 0.8);
            display: flex; align-items: center; justify-content: center;
        }

        .cdl-thumb.loading::before {
            content: '';
            position: absolute;
            top: 50%; left: 50%;
            width: 12px; height: 12px;
            margin: -6px 0 0 -6px;
            border: 2px solid white;
            border-top-color: transparent;
            border-radius: 50%;
            animation: cdl-spin 0.8s linear infinite;
            z-index: 1;
        }

        @keyframes cdl-spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styles);

    /* ================= UI ================= */

    const fab = document.createElement('button');
    fab.className = 'cdl-fab';
    fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.className = 'cdl-panel';
    panel.innerHTML = `
        <div class="cdl-header">
            <h3 class="cdl-title">
                <svg viewBox="0 0 24 24" fill="white"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                Comic Downloader Pro
            </h3>
            <p class="cdl-subtitle">Tải manga chất lượng cao</p>
        </div>
        <div class="cdl-body">
            <div class="cdl-info">
                <div class="cdl-info-row">
                    <span>📷 Tổng ảnh</span>
                    <span class="cdl-info-value" id="cdl-total">Đang quét...</span>
                </div>
                <div class="cdl-info-row">
                    <span>📊 Trạng thái</span>
                    <span class="cdl-info-value" id="cdl-state">Sẵn sàng</span>
                </div>
            </div>

            <div class="cdl-progress-container" style="display:none" id="cdl-progress-wrap">
                <div class="cdl-progress-header">
                    <span class="cdl-progress-label" id="cdl-progress-label">Tiến trình</span>
                    <span class="cdl-progress-value" id="cdl-percent">0%</span>
                </div>
                <div class="cdl-progress-bar">
                    <div class="cdl-progress-fill" id="cdl-progress"></div>
                </div>
            </div>

            <div class="cdl-status" id="cdl-status" style="display:none"></div>

            <div class="cdl-buttons">
                <button class="cdl-btn cdl-btn-success" id="cdl-zip">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10h-2v-2h-2v-2h2v-2h2v2h2v2h-2v2z"/></svg>
                    📦 Tải ZIP (Khuyến nghị)
                </button>
                <button class="cdl-btn cdl-btn-primary" id="cdl-batch">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    📥 Tải từng ảnh
                </button>
                <button class="cdl-btn cdl-btn-secondary" id="cdl-gallery">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg>
                    🖼️ Mở Gallery
                </button>
            </div>

            <div class="cdl-thumb-grid" id="cdl-thumbs"></div>
            <div class="cdl-log" id="cdl-log" style="display:none"></div>
        </div>
    `;
    document.body.appendChild(panel);

    const $ = id => document.getElementById(id);
    const $total = $('cdl-total');
    const $state = $('cdl-state');
    const $progressWrap = $('cdl-progress-wrap');
    const $progress = $('cdl-progress');
    const $percent = $('cdl-percent');
    const $progressLabel = $('cdl-progress-label');
    const $status = $('cdl-status');
    const $log = $('cdl-log');
    const $thumbs = $('cdl-thumbs');
    const $btnZip = $('cdl-zip');
    const $btnBatch = $('cdl-batch');
    const $btnGallery = $('cdl-gallery');

    /* ================= STATE ================= */

    let images = [];
    let isOpen = false;
    let isRunning = false;

    /* ================= EVENTS ================= */

    fab.onclick = () => {
        isOpen = !isOpen;
        panel.classList.toggle('active', isOpen);
        if (isOpen) scanImages();
    };

    $btnZip.onclick = () => startDownload('zip');
    $btnBatch.onclick = () => startDownload('batch');
    $btnGallery.onclick = openGallery;

    /* ================= FUNCTIONS ================= */

    function scanImages() {
        const imgs = [...document.querySelectorAll('.reader-area img')];
        images = imgs.map((img, i) => {
            let url = img.dataset.original || img.dataset.src || img.src || '';
            url = url.split('?')[0];
            if (url.startsWith('//')) url = 'https:' + url;
            return url ? { id: i + 1, url, thumb: img.src } : null;
        }).filter(Boolean);

        $total.textContent = images.length + ' ảnh';
        $thumbs.innerHTML = images.slice(0, 18).map(img =>
            `<div class="cdl-thumb" data-id="${img.id}"><img src="${img.thumb}" loading="lazy"></div>`
        ).join('');
    }

    function log(msg, type = '') {
        $log.style.display = 'block';
        const item = document.createElement('div');
        item.className = 'cdl-log-item ' + type;
        item.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        $log.appendChild(item);
        $log.scrollTop = $log.scrollHeight;
    }

    function setStatus(msg, type = '') {
        $status.style.display = 'block';
        $status.className = 'cdl-status ' + type;
        $status.textContent = msg;
    }

    function updateProgress(current, total, label = 'Tiến trình') {
        $progressWrap.style.display = 'block';
        const pct = Math.round(current / total * 100);
        $progress.style.width = pct + '%';
        $percent.textContent = pct + '%';
        $progressLabel.textContent = label;
        $state.textContent = `${current}/${total}`;
    }

    function markThumb(id, status) {
        const thumb = document.querySelector(`.cdl-thumb[data-id="${id}"]`);
        if (thumb) {
            thumb.classList.remove('loading', 'done', 'error');
            thumb.classList.add(status);
        }
    }

    function setButtons(enabled) {
        isRunning = !enabled;
        $btnZip.disabled = !enabled;
        $btnBatch.disabled = !enabled;
        $btnGallery.disabled = !enabled;
    }

    function getTitle() {
        return document.title.replace(/[\\/:*?"<>|]/g, '').trim().substring(0, 60) || 'comic';
    }

    /* ================= DOWNLOAD CORE ================= */

    function downloadBlob(url) {
        return new Promise((resolve, reject) => {
            const tryDownload = (targetUrl, isRetry = false) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: targetUrl,
                    responseType: 'arraybuffer',
                    timeout: 45000,
                    headers: { 'Referer': 'https://comic-top.com/' },
                    onload: (r) => {
                        if (r.status >= 200 && r.status < 300 && r.response && r.response.byteLength > 1000) {
                            resolve(new Uint8Array(r.response));
                        } else if (!isRetry) {
                            tryDownload(url, true); // Retry with original URL
                        } else {
                            reject(new Error(`HTTP ${r.status}`));
                        }
                    },
                    onerror: () => {
                        if (!isRetry) tryDownload(url, true);
                        else reject(new Error('Network error'));
                    },
                    ontimeout: () => reject(new Error('Timeout'))
                });
            };

            // Try proxy first
            tryDownload(WORKER_PREFIX + encodeURIComponent(url));
        });
    }

    /* ================= ZIP DOWNLOAD ================= */

    async function startDownload(mode) {
        if (!images.length) {
            setStatus('❌ Không tìm thấy ảnh!', 'error');
            return;
        }

        setButtons(false);
        $log.innerHTML = '';
        $status.style.display = 'none';

        const total = images.length;
        const pad = String(total).length;
        const title = getTitle();

        log(`🚀 Bắt đầu tải ${total} ảnh...`, 'info');

        if (mode === 'zip') {
            await downloadAsZip(total, pad, title);
        } else {
            await downloadBatch(total, pad, title);
        }

        setButtons(true);
    }

    async function downloadAsZip(total, pad, title) {
        const zip = new SimpleZip();
        let success = 0;
        let failed = 0;

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            markThumb(img.id, 'loading');
            updateProgress(i + 1, total, '📥 Đang tải');

            try {
                const data = await downloadBlob(img.url);
                const ext = detectImageType(data);
                const filename = `${String(img.id).padStart(pad, '0')}.${ext}`;

                zip.addFile(filename, data);
                success++;
                markThumb(img.id, 'done');
                log(`✓ ${filename} (${formatSize(data.byteLength)})`, 'success');

            } catch (e) {
                failed++;
                markThumb(img.id, 'error');
                log(`✗ Ảnh ${img.id}: ${e.message}`, 'error');
            }

            // Small delay to prevent overload
            await sleep(100);
        }

        if (success === 0) {
            setStatus('❌ Không tải được ảnh nào!', 'error');
            return;
        }

        // Generate ZIP
        log('📦 Đang tạo file ZIP...', 'info');
        updateProgress(100, 100, '📦 Đang nén');

        try {
            const zipBlob = zip.generate();
            log(`✓ ZIP: ${formatSize(zipBlob.size)}`, 'success');

            // Download
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title}.zip`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 5000);

            setStatus(`✅ Hoàn tất! ${success}/${total} ảnh`, 'success');
            log(`🎉 Đã tải ${title}.zip`, 'success');

        } catch (e) {
            console.error('ZIP Error:', e);
            setStatus('❌ Lỗi tạo ZIP: ' + e.message, 'error');
            log('❌ ' + e.message, 'error');
        }
    }

    async function downloadBatch(total, pad, title) {
        let success = 0;

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            markThumb(img.id, 'loading');
            updateProgress(i + 1, total, '📥 Đang tải');

            try {
                const data = await downloadBlob(img.url);
                const ext = detectImageType(data);
                const filename = `${title}_${String(img.id).padStart(pad, '0')}.${ext}`;

                const blob = new Blob([data]);
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);

                success++;
                markThumb(img.id, 'done');
                log(`✓ ${filename}`, 'success');

            } catch (e) {
                markThumb(img.id, 'error');
                log(`✗ Ảnh ${img.id}: ${e.message}`, 'error');
            }

            await sleep(400); // Longer delay for batch
        }

        setStatus(`✅ Hoàn tất! ${success}/${total} ảnh`, 'success');
    }

    /* ================= GALLERY ================= */

    async function openGallery() {
        if (!images.length) {
            setStatus('❌ Không tìm thấy ảnh!', 'error');
            return;
        }

        setButtons(false);
        const total = images.length;
        const loaded = [];

        log('🖼️ Đang tạo gallery...', 'info');

        for (let i = 0; i < images.length; i++) {
            markThumb(images[i].id, 'loading');
            updateProgress(i + 1, total, '🖼️ Đang tải');

            try {
                const data = await downloadBlob(images[i].url);
                const ext = detectImageType(data);
                const base64 = arrayBufferToBase64(data);
                loaded.push({ id: images[i].id, src: `data:image/${ext};base64,${base64}` });
                markThumb(images[i].id, 'done');
            } catch (e) {
                markThumb(images[i].id, 'error');
            }
        }

        const title = getTitle();
        const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#111;font-family:system-ui,sans-serif}
.header{position:sticky;top:0;background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;text-align:center;z-index:100}
.header h1{color:#fff;font-size:22px}
.header p{color:rgba(255,255,255,.8);font-size:13px;margin-top:5px}
.tip{background:rgba(255,255,255,.15);padding:8px 16px;border-radius:6px;margin-top:12px;display:inline-block;font-size:12px;color:#fff}
kbd{background:rgba(0,0,0,.3);padding:2px 6px;border-radius:3px;font-family:monospace}
.gallery{max-width:900px;margin:0 auto;padding:15px}
.gallery img{width:100%;display:block;margin-bottom:3px}
.num{text-align:center;color:#555;padding:8px;font-size:11px}
</style></head><body>
<div class="header"><h1>📚 ${title}</h1><p>${loaded.length} trang</p>
<div class="tip">💡 Nhấn <kbd>Ctrl+S</kbd> để lưu toàn bộ</div></div>
<div class="gallery">${loaded.map((img, i) => `<img src="${img.src}"><div class="num">${i + 1}</div>`).join('')}</div>
</body></html>`;

        const blob = new Blob([html], { type: 'text/html' });
        window.open(URL.createObjectURL(blob), '_blank');

        setStatus(`✅ Gallery: ${loaded.length} ảnh`, 'success');
        setButtons(true);
    }

    /* ================= UTILS ================= */

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(2) + ' MB';
    }

    function detectImageType(data) {
        if (data[0] === 0x89 && data[1] === 0x50) return 'png';
        if (data[0] === 0xFF && data[1] === 0xD8) return 'jpg';
        if (data[0] === 0x52 && data[1] === 0x49) return 'webp';
        if (data[0] === 0x47 && data[1] === 0x49) return 'gif';
        return 'jpg';
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /* ================= INIT ================= */

    setTimeout(scanImages, 1000);

})();