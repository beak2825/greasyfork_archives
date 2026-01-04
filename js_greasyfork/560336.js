// ==UserScript==
// @name         Mangabox Decoder Downloader (Beautiful UI)
// @namespace    mangabox-decoder
// @version      8.0.1
// @license MIT
// @description  Tải ảnh từ Mangabox, giải mã và đóng gói ZIP - UI đẹp
// @author       AI Support
// @match        https://www.mangabox.me/reader/*/episodes/*
// @grant        GM_xmlhttpRequest
// @connect      image-a.mangabox.me
// @connect      www.mangabox.me
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.min.js
// @downloadURL https://update.greasyfork.org/scripts/560336/Mangabox%20Decoder%20Downloader%20%28Beautiful%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560336/Mangabox%20Decoder%20Downloader%20%28Beautiful%20UI%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const epMatch = location.pathname.match(/episodes\/(\d+)/);
    const ep = epMatch ? epMatch[1] : null;
    if (!ep) return;

    if (typeof fflate === 'undefined') {
        alert("Lỗi: fflate chưa load!");
        return;
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function formatTime(seconds) {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*]/g, "_").trim();
    }

    // UI với thiết kế hiện đại
    const container = document.createElement("div");
    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            #mbx-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                width: 340px;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 20px;
                padding: 24px;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                box-shadow:
                    0 25px 50px -12px rgba(0, 0, 0, 0.5),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                color: #e2e8f0;
            }

            #mbx-panel * {
                box-sizing: border-box;
            }

            /* Header */
            #mbx-panel .header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
            }

            #mbx-panel .logo {
                width: 44px;
                height: 44px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            }

            #mbx-panel .header-text h1 {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
                background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            #mbx-panel .header-text span {
                font-size: 11px;
                color: #64748b;
                font-weight: 500;
            }

            /* Button */
            #mbx-panel .btn {
                width: 100%;
                padding: 16px 24px;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: #fff;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                font-weight: 600;
                font-size: 15px;
                font-family: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
                position: relative;
                overflow: hidden;
            }

            #mbx-panel .btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }

            #mbx-panel .btn:hover:not(:disabled)::before {
                left: 100%;
            }

            #mbx-panel .btn:hover:not(:disabled) {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
            }

            #mbx-panel .btn:active:not(:disabled) {
                transform: translateY(0);
            }

            #mbx-panel .btn:disabled {
                background: linear-gradient(135deg, #475569 0%, #64748b 100%);
                cursor: not-allowed;
                box-shadow: none;
            }

            #mbx-panel .btn svg {
                width: 20px;
                height: 20px;
            }

            /* Progress Section */
            #mbx-panel .progress-section {
                margin-top: 20px;
                display: none;
            }

            #mbx-panel .progress-section.active {
                display: block;
                animation: slideDown 0.3s ease;
            }

            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Info Cards */
            #mbx-panel .info-card {
                background: rgba(30, 41, 59, 0.5);
                border-radius: 12px;
                padding: 14px 16px;
                margin-bottom: 16px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            #mbx-panel .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
            }

            #mbx-panel .info-row:not(:last-child) {
                margin-bottom: 8px;
            }

            #mbx-panel .info-label {
                color: #94a3b8;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            #mbx-panel .info-value {
                color: #f1f5f9;
                font-weight: 600;
                max-width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            /* Progress Bar */
            #mbx-panel .progress-container {
                margin-bottom: 16px;
            }

            #mbx-panel .progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            #mbx-panel .progress-status {
                font-size: 13px;
                font-weight: 500;
                color: #e2e8f0;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            #mbx-panel .progress-percent {
                font-size: 14px;
                font-weight: 700;
                color: #a78bfa;
            }

            #mbx-panel .progress-bar {
                height: 10px;
                background: rgba(30, 41, 59, 0.8);
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            }

            #mbx-panel .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                border-radius: 10px;
                transition: width 0.3s ease;
                width: 0%;
                position: relative;
            }

            #mbx-panel .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(
                    90deg,
                    transparent 0%,
                    rgba(255,255,255,0.3) 50%,
                    transparent 100%
                );
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            /* Stats */
            #mbx-panel .stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 16px;
            }

            #mbx-panel .stat-item {
                background: rgba(30, 41, 59, 0.5);
                border-radius: 10px;
                padding: 12px;
                text-align: center;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            #mbx-panel .stat-value {
                font-size: 16px;
                font-weight: 700;
                color: #f1f5f9;
                display: block;
            }

            #mbx-panel .stat-label {
                font-size: 10px;
                color: #64748b;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 4px;
                display: block;
            }

            #mbx-panel .stat-item.success .stat-value { color: #4ade80; }
            #mbx-panel .stat-item.error .stat-value { color: #f87171; }
            #mbx-panel .stat-item.size .stat-value { color: #60a5fa; }

            /* Log */
            #mbx-panel .log-container {
                background: rgba(15, 23, 42, 0.6);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                overflow: hidden;
            }

            #mbx-panel .log-header {
                padding: 10px 14px;
                background: rgba(30, 41, 59, 0.5);
                font-size: 11px;
                font-weight: 600;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            #mbx-panel .log {
                max-height: 140px;
                overflow-y: auto;
                padding: 10px 14px;
                font-size: 11px;
                font-family: 'SF Mono', 'Fira Code', monospace;
                line-height: 1.6;
            }

            #mbx-panel .log::-webkit-scrollbar {
                width: 6px;
            }

            #mbx-panel .log::-webkit-scrollbar-track {
                background: transparent;
            }

            #mbx-panel .log::-webkit-scrollbar-thumb {
                background: rgba(148, 163, 184, 0.3);
                border-radius: 3px;
            }

            #mbx-panel .log-item {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-bottom: 6px;
                animation: fadeIn 0.2s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateX(-5px); }
                to { opacity: 1; transform: translateX(0); }
            }

            #mbx-panel .log-icon {
                flex-shrink: 0;
                width: 16px;
                height: 16px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
            }

            #mbx-panel .log-item.success .log-icon { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
            #mbx-panel .log-item.error .log-icon { background: rgba(248, 113, 113, 0.2); color: #f87171; }
            #mbx-panel .log-item.info .log-icon { background: rgba(96, 165, 250, 0.2); color: #60a5fa; }
            #mbx-panel .log-item.warning .log-icon { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }

            #mbx-panel .log-text {
                color: #cbd5e1;
                word-break: break-all;
            }

            #mbx-panel .log-item.success .log-text { color: #86efac; }
            #mbx-panel .log-item.error .log-text { color: #fca5a5; }

            /* Spinner */
            .spinner {
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            /* Success Animation */
            .checkmark {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #4ade80;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: popIn 0.3s ease;
            }

            @keyframes popIn {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        </style>

        <div id="mbx-panel">
            <!-- Header -->
            <div class="header">
                <div class="logo">📚</div>
                <div class="header-text">
                    <h1>Mangabox Downloader</h1>
                    <span>v8.0 • ZIP Export</span>
                </div>
            </div>

            <!-- Download Button -->
            <button class="btn" id="mbx-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Tải Chapter</span>
            </button>

            <!-- Progress Section -->
            <div class="progress-section" id="mbx-progress">
                <!-- Info Card -->
                <div class="info-card" id="mbx-info" style="display:none;">
                    <div class="info-row">
                        <span class="info-label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                            Manga
                        </span>
                        <span class="info-value" id="mbx-manga">-</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            Chapter
                        </span>
                        <span class="info-value" id="mbx-chapter">-</span>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="progress-container">
                    <div class="progress-header">
                        <span class="progress-status" id="mbx-status">
                            <div class="spinner"></div>
                            Đang chuẩn bị...
                        </span>
                        <span class="progress-percent" id="mbx-percent">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="mbx-fill"></div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats" id="mbx-stats" style="display:none;">
                    <div class="stat-item success">
                        <span class="stat-value" id="mbx-success">0</span>
                        <span class="stat-label">Thành công</span>
                    </div>
                    <div class="stat-item error">
                        <span class="stat-value" id="mbx-fail">0</span>
                        <span class="stat-label">Lỗi</span>
                    </div>
                    <div class="stat-item size">
                        <span class="stat-value" id="mbx-size">0 B</span>
                        <span class="stat-label">Dung lượng</span>
                    </div>
                </div>

                <!-- Log -->
                <div class="log-container">
                    <div class="log-header">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                        Console
                    </div>
                    <div class="log" id="mbx-log"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Elements
    const btn = document.getElementById("mbx-btn");
    const progressSection = document.getElementById("mbx-progress");
    const infoCard = document.getElementById("mbx-info");
    const statsCard = document.getElementById("mbx-stats");
    const fill = document.getElementById("mbx-fill");
    const percent = document.getElementById("mbx-percent");
    const status = document.getElementById("mbx-status");
    const log = document.getElementById("mbx-log");

    function updateProgress(pct, text, showSpinner = true) {
        fill.style.width = `${pct}%`;
        percent.textContent = `${Math.round(pct)}%`;

        if (pct >= 100) {
            status.innerHTML = `<div class="checkmark"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>${text}`;
        } else if (showSpinner) {
            status.innerHTML = `<div class="spinner"></div>${text}`;
        } else {
            status.textContent = text;
        }
    }

    function updateStats(success, fail, size) {
        document.getElementById("mbx-success").textContent = success;
        document.getElementById("mbx-fail").textContent = fail;
        document.getElementById("mbx-size").textContent = formatBytes(size);
    }

    function addLog(text, type = "info") {
        const icons = {
            success: "✓",
            error: "✕",
            info: "●",
            warning: "!"
        };

        const item = document.createElement("div");
        item.className = `log-item ${type}`;
        item.innerHTML = `
            <span class="log-icon">${icons[type]}</span>
            <span class="log-text">${text}</span>
        `;
        log.appendChild(item);
        log.scrollTop = log.scrollHeight;
        console.log(`[${type}] ${text}`);
    }

    btn.onclick = async () => {
        btn.disabled = true;
        btn.innerHTML = `<div class="spinner"></div><span>Đang xử lý...</span>`;
        progressSection.classList.add("active");
        log.innerHTML = "";
        infoCard.style.display = "none";
        statsCard.style.display = "none";

        updateProgress(0, "Đang lấy dữ liệu...");
        addLog("Bắt đầu tải chapter", "info");

        const startTime = Date.now();

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.mangabox.me/api/honshi/episode/${ep}/images`,
            responseType: "json",
            onload: async res => {
                try {
                    const apiData = res.response;
                    const list = apiData?.imageUrls;
                    const mask = apiData?.mask;

                    if (!list || !list.length) throw new Error("Không có ảnh!");

                    const mangaTitle = apiData.manga?.title || "Unknown";
                    const chapter = apiData.displayVolume || apiData.volume || `Ep_${ep}`;
                    const folderName = sanitizeFilename(`${mangaTitle} - ${chapter}`);

                    // Hiển thị info
                    infoCard.style.display = "block";
                    document.getElementById("mbx-manga").textContent = mangaTitle;
                    document.getElementById("mbx-chapter").textContent = chapter;

                    addLog(`Manga: ${mangaTitle}`, "info");
                    addLog(`Chapter: ${chapter}`, "info");
                    addLog(`Tổng: ${list.length} ảnh | Mask: ${mask}`, "info");

                    statsCard.style.display = "grid";
                    const zipFiles = {};
                    let successCount = 0;
                    let failCount = 0;
                    let totalSize = 0;

                    // Tải từng ảnh
                    for (let i = 0; i < list.length; i++) {
                        const num = i + 1;
                        const fileName = `${String(num).padStart(3, "0")}.png`;
                        const fullPath = `${folderName}/${fileName}`;
                        const pct = 5 + (num / list.length) * 70;

                        updateProgress(pct, `Đang tải ${num}/${list.length}...`);

                        try {
                            const raw = await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: list[i],
                                    responseType: "arraybuffer",
                                    timeout: 30000,
                                    onload: r => resolve(new Uint8Array(r.response)),
                                    onerror: reject,
                                    ontimeout: () => reject(new Error("Timeout"))
                                });
                            });

                            if (mask) {
                                for (let j = 0; j < raw.length; j++) raw[j] ^= mask;
                            }

                            const png = await new Promise((resolve, reject) => {
                                const blob = new Blob([raw], { type: "image/webp" });
                                const url = URL.createObjectURL(blob);
                                const img = new Image();

                                img.onload = () => {
                                    const c = document.createElement("canvas");
                                    c.width = img.naturalWidth;
                                    c.height = img.naturalHeight;
                                    c.getContext("2d").drawImage(img, 0, 0);

                                    c.toBlob(b => {
                                        URL.revokeObjectURL(url);
                                        if (!b) return reject(new Error("toBlob fail"));

                                        const r = new FileReader();
                                        r.onload = () => resolve(new Uint8Array(r.result));
                                        r.onerror = reject;
                                        r.readAsArrayBuffer(b);
                                    }, "image/png");
                                };
                                img.onerror = () => {
                                    URL.revokeObjectURL(url);
                                    reject(new Error("Load failed"));
                                };
                                img.src = url;
                            });

                            zipFiles[fullPath] = png;
                            totalSize += png.length;
                            successCount++;
                            updateStats(successCount, failCount, totalSize);
                            addLog(`${fileName} — ${formatBytes(png.length)}`, "success");

                        } catch (err) {
                            failCount++;
                            updateStats(successCount, failCount, totalSize);
                            addLog(`${fileName}: ${err.message}`, "error");
                        }

                        await sleep(100);
                    }

                    if (successCount === 0) throw new Error("Không có ảnh nào!");

                    // Đóng gói ZIP
                    updateProgress(80, "Đang đóng gói ZIP...");
                    addLog("Bắt đầu đóng gói ZIP", "warning");

                    const zipStart = Date.now();
                    const zipped = fflate.zipSync(zipFiles, { level: 0 });
                    const zipTime = ((Date.now() - zipStart) / 1000).toFixed(2);

                    addLog(`Đóng gói xong: ${formatBytes(zipped.length)} (${zipTime}s)`, "success");

                    // Tải xuống
                    updateProgress(95, "Đang lưu file...");

                    const blob = new Blob([zipped], { type: "application/zip" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${folderName}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    await sleep(1000);
                    URL.revokeObjectURL(url);

                    const totalTime = formatTime((Date.now() - startTime) / 1000);
                    updateProgress(100, `Hoàn tất! (${totalTime})`);
                    addLog(`Tải xuống thành công! Tổng thời gian: ${totalTime}`, "success");

                    btn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>Hoàn tất!</span>
                    `;
                    btn.style.background = "linear-gradient(135deg, #10b981 0%, #34d399 100%)";

                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <span>Tải Chapter</span>
                        `;
                        btn.style.background = "";
                        progressSection.classList.remove("active");
                    }, 5000);

                } catch (error) {
                    console.error("❌", error);
                    addLog(`LỖI: ${error.message}`, "error");
                    updateProgress(0, `Lỗi: ${error.message}`, false);
                    btn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        <span>Thử lại</span>
                    `;
                    btn.style.background = "linear-gradient(135deg, #ef4444 0%, #f87171 100%)";
                    btn.disabled = false;

                    setTimeout(() => {
                        btn.style.background = "";
                        btn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            <span>Tải Chapter</span>
                        `;
                    }, 3000);
                }
            },
            onerror: () => {
                addLog("Không thể kết nối API!", "error");
                btn.innerHTML = `<span>❌ Thử lại</span>`;
                btn.disabled = false;
            }
        });
    };
})();