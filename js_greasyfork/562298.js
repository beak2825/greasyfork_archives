// ==UserScript==
// @name         肉丝上传助手
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  需要在上传页面强制刷新才能使用！当前只支持自动上传种子链接和图片链接。
// @author       Gemini
// @license      GPL-3.0 License
// @match        https://rousi.pro/upload*
// @match        https://rousi.pro/edit/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562298/%E8%82%89%E4%B8%9D%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/562298/%E8%82%89%E4%B8%9D%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Utilities ---

    // Wait for a DOM element to appear
    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    }

    // Fetch data bypassing CORS
    function fetchBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: (response) => {
                    if (response.status === 200) resolve(response.response);
                    else reject(new Error(`Status ${response.status}: ${response.statusText}`));
                },
                onerror: (err) => reject(err)
            });
        });
    }

    // Simulate a Drag-and-Drop event to trigger React Dropzone
    function triggerDropEvent(dropZoneElement, fileObj) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(fileObj);
        const dropEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
        });
        dropZoneElement.dispatchEvent(dropEvent);
    }

    // Debounce function for text inputs
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // --- Feature 1: Torrent URL Uploader ---

    async function setupTorrentUploader() {
        // Selector for the Torrent file input
        const selector = 'input[type="file"][accept=".torrent"]';
        const fileInput = await waitForElement(selector);
        if (!fileInput) return;

        const dropZone = fileInput.closest('label');
        const container = dropZone.parentElement; // The div wrapping the label

        // UI Creation
        const wrapper = document.createElement('div');
        wrapper.className = "mt-4 p-4 border border-dashed border-input rounded-lg bg-accent/20";

        const label = document.createElement('label');
        label.className = "text-sm font-medium mb-2 block";
        label.innerHTML = "🔗 通过 URL 上传种子 (Enter URL)";

        const input = document.createElement('input');
        input.type = "text";
        input.placeholder = "https://tracker.example.com/download/file.torrent";
        input.className = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

        const statusMsg = document.createElement('div');
        statusMsg.className = "text-xs text-muted-foreground mt-2";
        statusMsg.innerText = "输入链接并回车，自动下载并填入上方。";

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(statusMsg);
        container.appendChild(wrapper);

        // Logic
        input.addEventListener('change', async (e) => {
            const url = e.target.value.trim();
            if (!url) return;

            statusMsg.innerText = "⏳ 正在下载种子文件...";
            statusMsg.className = "text-xs text-blue-500 mt-2";
            input.disabled = true;

            try {
                const blob = await fetchBlob(url);

                const filename = `upload_${Date.now()}.torrent`;
                const file = new File([blob], filename, { type: "application/x-bittorrent" });

                // Trigger the upload
                triggerDropEvent(dropZone, file);

                statusMsg.innerText = "✅ 种子已加载: " + filename;
                statusMsg.className = "text-xs text-green-500 mt-2";
                input.value = ""; // Clear input for next use
            } catch (err) {
                console.error(err);
                statusMsg.innerText = "❌ 下载失败: " + err.message;
                statusMsg.className = "text-xs text-red-500 mt-2";
            } finally {
                input.disabled = false;
            }
        });
    }

    // --- Feature 2: Image Bulk Uploader ---

    async function setupImageUploader() {
        // Selector for the Screenshot file input
        const selector = 'input[type="file"][accept="image/*"][multiple]';
        const fileInput = await waitForElement(selector);
        if (!fileInput) return;

        const dropZone = fileInput.closest('label');
        const container = dropZone.parentElement;
        const uploadedUrls = new Set();

        // UI Creation
        const wrapper = document.createElement('div');
        wrapper.className = "mt-4";

        const label = document.createElement('label');
        label.className = "text-sm font-medium mb-2 block";
        label.innerText = "🖼️ 批量图片上传 (每行一个链接)";

        const textarea = document.createElement('textarea');
        textarea.placeholder = "https://img.example.com/1.jpg\nhttps://img.example.com/2.png";
        textarea.className = "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono text-xs min-h-[100px]";

        const statusMsg = document.createElement('div');
        statusMsg.className = "text-xs text-muted-foreground mt-1";
        statusMsg.innerText = "粘贴链接后自动提取。";

        wrapper.appendChild(label);
        wrapper.appendChild(textarea);
        wrapper.appendChild(statusMsg);
        container.appendChild(wrapper);

        // Logic
        textarea.addEventListener('input', debounce(async (e) => {
            const lines = e.target.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);

            for (const url of lines) {
                if (!uploadedUrls.has(url)) {
                    statusMsg.innerText = `⏳ 正在获取: ${url}...`;
                    try {
                        const blob = await fetchBlob(url);

                        let ext = 'jpg';
                        if (blob.type === 'image/png') ext = 'png';
                        if (blob.type === 'image/gif') ext = 'gif';

                        const filename = `remote_${Date.now()}.${ext}`;
                        const file = new File([blob], filename, { type: blob.type });

                        triggerDropEvent(dropZone, file);

                        uploadedUrls.add(url);
                        statusMsg.innerText = `✅ 已添加: ${url}`;

                        await new Promise(r => setTimeout(r, 200)); // Slight delay
                    } catch (err) {
                        statusMsg.innerText = `❌ 错误: ${url}`;
                    }
                }
            }
            if(lines.length === uploadedUrls.size) {
                 statusMsg.innerText = "等待输入...";
            }
        }, 800));
    }

    // --- Initialize ---

    function init() {
        setupTorrentUploader();
        setupImageUploader();
    }

    init();

})();