// ==UserScript==
// @name         YouTube MP3 Auto Downloader
// @namespace    Violentmonkey Scripts
// @version      3.1
// @description  Adds a floating button to YouTube pages to download audio as MP3 via a local server, with concurrent download support.
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551898/YouTube%20MP3%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/551898/YouTube%20MP3%20Auto%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const FLASK_URL = "http://localhost:8888";

    // --- UI Elements ---

    // 1. Container for all our UI
    const uiContainer = document.createElement('div');
    uiContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
    `;

    // 2. Container for status notifications
    const statusContainer = document.createElement('div');
    statusContainer.id = 'yt-dl-status-container';
    statusContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
    `;

    // 3. The main download button
    const mainBtn = document.createElement('button');
    mainBtn.id = 'yt-dl-main-btn';
    mainBtn.textContent = '下載 MP3';
    mainBtn.style.cssText = `
        background: #1DA1F2; /* Twitter Blue */
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: transform 0.2s ease-in-out, background-color 0.2s;
        width: 150px; /* Fixed width for consistent look */
        text-align: center;
    `;

    mainBtn.onmouseover = () => { mainBtn.style.transform = 'scale(1.05)'; };
    mainBtn.onmouseout = () => { mainBtn.style.transform = 'scale(1)'; };

    // --- Logic ---

    function createStatusElement(text) {
        const el = document.createElement('div');
        el.textContent = text;

        el.style.cssText = `
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.3s, transform 0.3s;
        `;
        statusContainer.appendChild(el);
        // Animate in
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }, 10);
        return el;
    }

    async function handleDownload(task_id, statusEl) {
        // Poll for status
        const pollInterval = setInterval(async () => {
            try {
                const statusResponse = await fetch(`${FLASK_URL}/status/${task_id}`);
                if (!statusResponse.ok) {
                    throw new Error(`狀態檢查失敗: ${statusResponse.statusText}`);
                }

                const { status, message: errorMessage, progress, title } = await statusResponse.json();

                // 更新進度顯示
                if (progress) {
                    statusEl.textContent = progress;

                    // 根據狀態更新背景顏色
                    if (status === 'downloading') {
                        statusEl.style.backgroundColor = 'rgba(0, 123, 255, 0.9)'; // Blue
                    } else if (status === 'converting') {
                        statusEl.style.backgroundColor = 'rgba(255, 193, 7, 0.9)'; // Yellow
                    }
                }

                if (status === 'done') {
                    clearInterval(pollInterval);
                    statusEl.textContent = '準備下載...';
                    statusEl.style.backgroundColor = '#28a745'; // Green

                    // Fetch the actual file
                    const fileResponse = await fetch(`${FLASK_URL}/get-file/${task_id}`);
                    if (!fileResponse.ok) throw new Error(`獲取檔案失敗: ${await fileResponse.text()}`);

                    const disposition = fileResponse.headers.get('Content-Disposition');
                    let filename = 'audio.mp3';
                    if (disposition && disposition.includes('attachment')) {
                        const filenameStarMatch = /filename\*=(?:.+?''(.+))/.exec(disposition);
                        if (filenameStarMatch && filenameStarMatch[1]) {
                            filename = decodeURIComponent(filenameStarMatch[1]);
                        } else {
                            const filenameMatch = /filename="([^"]+)"/.exec(disposition);
                            if (filenameMatch && filenameMatch[1]) filename = decodeURIComponent(filenameMatch[1]);
                        }
                    }

                    const blob = await fileResponse.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(downloadUrl);
                    a.remove();

                    statusEl.textContent = '✓ 下載完成!';
                    setTimeout(() => statusEl.remove(), 3000);

                } else if (status === 'error') {
                    clearInterval(pollInterval);
                    throw new Error(errorMessage || '伺服器發生未知錯誤。');
                }
            } catch (pollError) {
                clearInterval(pollInterval);
                console.error('Download failed:', pollError);
                statusEl.textContent = `✗ ${pollError.message.substring(0, 40)}`;
                statusEl.style.backgroundColor = '#dc3545'; // Red
                // Keep error message on screen longer
                setTimeout(() => statusEl.remove(), 10000);
            }
        }, 1000); // Poll every 1 second for smoother progress updates
    }

    mainBtn.onclick = async () => {
        const url = window.location.href;

        if (!url.includes('/watch?v=') && !url.includes('/shorts/')) {
            alert('請先進入一個 YouTube 影片或 Shorts 頁面。');
            return;
        }

        mainBtn.disabled = true;
        mainBtn.textContent = '請求中...';
        mainBtn.style.backgroundColor = '#ffc107'; // Yellow

        try {
            const startResponse = await fetch(`${FLASK_URL}/start-download?url=${encodeURIComponent(url)}`);
            if (!startResponse.ok) {
                const errorText = await startResponse.text();
                throw new Error(`啟動失敗: ${errorText}`);
            }
            const { task_id } = await startResponse.json();

            // Create a new status element for this task
            const statusEl = createStatusElement('處理中...');
            // Start polling for this specific task
            handleDownload(task_id, statusEl);

        } catch (initialError) {
            alert(`下載失敗！\n請確認伺服器已運行。\n\n錯誤: ${initialError.message}`);
        } finally {
            // Always re-enable the main button
            mainBtn.disabled = false;
            mainBtn.textContent = '下載 MP3';
            mainBtn.style.backgroundColor = '#1DA1F2';
        }
    };

    // Assemble the UI and add to the page
    uiContainer.appendChild(statusContainer);
    uiContainer.appendChild(mainBtn);
    document.body.appendChild(uiContainer);

})();
