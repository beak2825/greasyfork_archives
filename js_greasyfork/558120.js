// ==UserScript==
// @name          PressPlay PMS 下載器 v24.0
// @namespace     http://tampermonkey.net/
// @version       24.0
// @description   URL監聽下載，搭配FFmpeg合併輸出成影片。
// @author        Kevin Chang
// @license       None
// @match         https://www.pressplay.cc/*
// @match         https://media.pressplay.cc/*
// @icon          https://www.pressplay.cc/favicon.ico
// @grant         none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/558120/PressPlay%20PMS%20%E4%B8%8B%E8%BC%89%E5%99%A8%20v240.user.js
// @updateURL https://update.greasyfork.org/scripts/558120/PressPlay%20PMS%20%E4%B8%8B%E8%BC%89%E5%99%A8%20v240.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pmsUrls = new Set(); // 儲存所有已擷取的 URL (按插入時間順序)
    const downloadedUrls = new Set(); // 儲存已發送下載請求的 URL
    const CHECK_INTERVAL = 2000; // 每 2 秒檢查一次新片段
    const MAX_FILENAME_LENGTH = 219; // 檔名主體最大長度
    let panel;

    const isTopWindow = (window.self === window.top);

    // *** 輔助函數：執行 TXT 檔案下載到本地 ***
    function triggerDownload(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // *** 輔助函數：提取並截斷檔名 ***
    /**
     * 從完整的 URL 中提取檔名，並將檔名主體截斷至指定長度。
     * @param {string} url 完整的 PMS URL
     * @returns {string} 截斷後的檔名 (e.g., '截斷後的檔名.pms')
     */
    function extractAndTruncateFilename(url) {
        try {
            const pathname = new URL(url).pathname;
            const fullFilename = pathname.substring(pathname.lastIndexOf('/') + 1);

            if (!fullFilename || fullFilename.indexOf('.pms') === -1) {
                console.warn(`無法從 URL 提取有效 PMS 檔名: ${url}`);
                return fullFilename;
            }

            const parts = fullFilename.split('.');
            const extension = parts.pop();
            let basename = parts.join('.');

            // 截斷檔名主體
            if (basename.length > MAX_FILENAME_LENGTH) {
                basename = basename.substring(0, MAX_FILENAME_LENGTH);
            }

            return `${basename}.${extension}`;

        } catch (e) {
            console.error('處理 URL 錯誤:', e);
            return 'error_segment.pms';
        }
    }


    // *** 核心：檢查並下載新片段 (定時器觸發) ***
    function checkAndDownloadNewSegments() {
        const urlsToDownload = [];

        pmsUrls.forEach(url => {
            if (!downloadedUrls.has(url)) {
                urlsToDownload.push(url);
                downloadedUrls.add(url);
            }
        });

        if (urlsToDownload.length === 0) {
            return;
        }

        console.log(`%c[自動下載] 發現 ${urlsToDownload.length} 個新片段，即將下載...`, "color: #ff5555; font-weight: bold;");

        urlsToDownload.forEach((url, index) => {

            const segmentIndex = downloadedUrls.size - urlsToDownload.length + index + 1;

            setTimeout(() => {
                const a = document.createElement('a');
                // 單個檔案下載仍使用編號，確保下載穩定性
                const filename = `segment_${segmentIndex}.pms`;

                a.href = url;
                a.download = filename;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

            }, index * 250); // 每次下載間隔 250ms
        });

        console.log(`請留意瀏覽器彈出的 ${urlsToDownload.length} 個儲存對話框！`);
    }


    // 建立浮動面板
    function createControlPanel() {
        if (document.getElementById('pms-logger-panel') || !document.body) {
            return;
        }

        panel = document.createElement('div');
        panel.id = 'pms-logger-panel';

        panel.style.cssText = `
            position: fixed; top: 10px; right: 10px; left: auto; bottom: auto;
            background-color: #282c34; color: white; padding: 15px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7); z-index: 2147483647 !important;
            font-family: Arial, sans-serif; font-size: 14px; max-width: 300px; min-width: 250px; cursor: default;
        `;

        panel.innerHTML = `
            <h3 id="panel-handle" style="margin-top: 0; font-size: 16px; border-bottom: 1px solid #444; padding-bottom: 5px; cursor: move; user-select: none;">🎥 PMS URL 擷取器</h3>
            <p id="pms-count">已記錄片段總數: 0</p>
            <p style="font-size: 12px; margin-top: 5px; color: #50fa7b; font-weight: bold;">
                狀態：自動下載運行中 (每 ${CHECK_INTERVAL/1000} 秒檢查)
            </p>

            <button id="download-ffmpeg-btn" style="
                background-color: #61afef; color: black; border: none; padding: 10px 15px; margin-top: 10px;
                border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold;
            ">下載 FFmpeg 清單 (依時間序)</button>
        `;

        document.body.appendChild(panel);

        // 綁定 FFmpeg 事件
        document.getElementById('download-ffmpeg-btn').addEventListener('click', downloadFfmpegList);

        // 啟動拖動功能
        makeDraggable(panel, document.getElementById('panel-handle'));

        // *** 啟動持續監控定時器 ***
        setInterval(checkAndDownloadNewSegments, CHECK_INTERVAL);
    }

    // FFmpeg 合併清單下載 (嚴格依賴插入順序)
    function downloadFfmpegList() {
        if (pmsUrls.size === 0) {
            alert('尚未擷取到任何網址，請先播放影片。');
            return;
        }

        // 🚀 關鍵修正：直接從 Set 轉換為陣列，**不使用 .sort()**，
        // 確保嚴格依賴 Set 的插入順序 (即監聽到的時間順序)。
        const ffmpegListLines = Array.from(pmsUrls)
            .map(url => {
                const truncatedFilename = extractAndTruncateFilename(url);
                return `file '${truncatedFilename}'`;
            });

        const content = ffmpegListLines.join('\n');
        const filename = `pressplay_ffmpeg_list_timeorder_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;

        triggerDownload(content, filename);
        alert(`🎉 FFmpeg 清單（${pmsUrls.size} 個片段，已嚴格按照時間順序下載）已下載！`);
    }

    // 更新片段計數器
    function updateCount() {
        const countElement = document.getElementById('pms-count');
        if (countElement) {
            countElement.textContent = `已記錄片段總數: ${pmsUrls.size}`;
        }
    }

    // 拖動功能 (未變動)
    function makeDraggable(element, handle) {
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - element.offsetLeft;
            offset.y = e.clientY - element.offsetTop;
            element.style.bottom = 'auto';
            element.style.right = 'auto';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newLeft = e.clientX - offset.x;
            let newTop = e.clientY - offset.y;
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight));
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // 網路請求監聽 (XHR Hooking) - 確保按順序新增到 Set (未變動)
    const originalXhrOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (typeof url === 'string' && url.includes('.pms')) {
            let absoluteUrl;
            try {
                absoluteUrl = new URL(url, window.location.href).href;
            } catch (error) {
                return originalXhrOpen.apply(this, [method, url, ...args]);
            }

            if (absoluteUrl.startsWith('https://media-v2.pressplay.cc/')) {
                // 確保 XHR Hooking 穩定且持續更新 pmsUrls
                if (!pmsUrls.has(absoluteUrl)) {
                    // Set 會保證元素是按被監聽到並加入的順序排列
                    pmsUrls.add(absoluteUrl);
                    updateCount();
                }
            }
        }
        originalXhrOpen.apply(this, [method, url, ...args]);
    };

    // 執行流程：
    if (!isTopWindow) {
        window.addEventListener('load', createControlPanel);
    }
})();