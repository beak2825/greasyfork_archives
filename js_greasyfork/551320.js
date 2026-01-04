// ==UserScript==
// @name         图片批量下载器 (索引续传版)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  从旧到新逆序下载，使用数字索引命名，支持从上次中断处智能续传并下载到指定目录。
// @author       You & Gemini
// @match        *://jimeng.jianying.com/ai-tool/asset
// @grant        GM_download
// @grant        GM_addStyle
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jimeng.jianying.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551320/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28%E7%B4%A2%E5%BC%95%E7%BB%AD%E4%BC%A0%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551320/%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28%E7%B4%A2%E5%BC%95%E7%BB%AD%E4%BC%A0%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局变量 ---
    let existingImageIds = new Map(); // 一个hashmap用来存储已经下载的图片ID，避免重复下载
    let isCheckingEnabled = false;
    let directoryHandle = null; // 新增：用于存储用户选择的目录句柄

    // --- 辅助函数 ---

    /**
     * 等待指定的元素出现在DOM中。
     * @param {string} selector - CSS选择器。
     * @param {number} timeout - 超时时间 (毫秒)。
     * @returns {Promise<Element>} - 找到的元素。
     */
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
                elapsedTime += intervalTime;
                if (elapsedTime >= timeout) {
                    clearInterval(interval);
                    reject(new Error(`等待元素 "${selector}" 超时`));
                }
            }, intervalTime);
        });
    }

    /**
     * 从图片URL中解析出ID部分。
     * @param {string} url - 图片的URL。
     * @returns {string|null} - 解析出的图片ID。
     */
    function parseImageIdFromUrl(url) {
        try {
            const path = new URL(url).pathname;
            const lastSegment = path.split('/').pop() || '';
            const idPart = lastSegment.split('~tplv-')[0];
            return idPart || null;
        } catch (e) {
            console.error("解析URL中的图片ID失败:", url, e);
            return null;
        }
    }

    /**
     * 清理字符串，使其适用于文件名。
     * @param {string} text - 原始文本。
     * @param {number} maxLength - 文件名允许的最大长度。
     * @returns {string} - 清理后的文件名。
     */
    function sanitizeFileName(text, maxLength = 250) {
        if (!text) return '';
        // 替换所有不被文件名允许的特殊字符
        const sanitized = text.replace(/[\\?%*:|"<>/\n\r]/g, '_');

        if (sanitized.length > maxLength) {
            const extensionIndex = sanitized.lastIndexOf('.');
            if (extensionIndex === -1 || sanitized.length - extensionIndex > 10) {
                return sanitized.substring(0, maxLength);
            }
            const namePart = sanitized.substring(0, extensionIndex);
            const extensionPart = sanitized.substring(extensionIndex);
            const maxNameLength = maxLength - extensionPart.length;
            const truncatedNamePart = namePart.substring(0, maxNameLength);
            return truncatedNamePart + extensionPart;
        }
        return sanitized;
    }

    // --- UI 界面创建 ---
    const controlPanel = document.createElement('div');
    GM_addStyle(`
        #controlPanel { position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); padding: 15px; display: flex; flex-direction: column; gap: 10px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        .panel-button { padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.2s; color: white; }
        .panel-button:disabled { background-color: #cccccc; cursor: not-allowed; }
        #selectDirBtn { background-color: #007BFF; }
        #selectDirBtn:hover { background-color: #0056b3; }
        #batchDownloadBtn { background-color: #28a745; }
        #batchDownloadBtn:hover { background-color: #218838; }
        #exportIdsBtn { background-color: #fd7e14; } /* 新按钮样式 */
        #exportIdsBtn:hover { background-color: #e66b02; } /* 新按钮悬停样式 */
        #statusText { font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 10px; margin-top: 5px; }
    `);
    controlPanel.id = 'controlPanel';
    document.body.appendChild(controlPanel);
    const selectDirBtn = document.createElement('button');
    selectDirBtn.textContent = '1. 选择目录以续传';
    selectDirBtn.id = 'selectDirBtn';
    selectDirBtn.className = 'panel-button';
    controlPanel.appendChild(selectDirBtn);
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '2. 开始下载';
    downloadBtn.id = 'batchDownloadBtn';
    downloadBtn.className = 'panel-button';
    controlPanel.appendChild(downloadBtn);

    const exportIdsBtn = document.createElement('button');
    exportIdsBtn.textContent = '导出本页ID';
    exportIdsBtn.id = 'exportIdsBtn';
    exportIdsBtn.className = 'panel-button';
    controlPanel.appendChild(exportIdsBtn);

    const statusText = document.createElement('p');
    statusText.id = 'statusText';
    statusText.textContent = '续传未开启，将从0开始编号。';
    controlPanel.appendChild(statusText);


    // --- 事件绑定 ---

    selectDirBtn.addEventListener('click', async () => {
        try {
            const dirHandle = await window.showDirectoryPicker();
            directoryHandle = dirHandle; // 存储目录句柄
            // 重置状态
            existingImageIds.clear();
            statusText.textContent = '正在扫描目录...';

            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file') {
                    const name = entry.name;
                    // 解析文件名，例如 "123-abcdef123~tplv-xyz-这是一个提示词.webp"
                    const match = name.match(/^(\d+)-([a-f0-9~_-]+)-/);
                    if (match) {
                        const index = parseInt(match[1], 10);
                        const imageId = match[2];
                        existingImageIds.set(imageId, index);
                    }
                }
            }
            isCheckingEnabled = true;
            statusText.textContent = `扫描完成！已下载 ${existingImageIds.size} 张图片。\n将下载至: ${directoryHandle.name}`;
            statusText.style.whiteSpace = 'pre-wrap'; // 允许换行
        } catch (err) {
            console.error("选择目录失败或用户取消:", err);
            statusText.textContent = '选择目录已取消。';
        }
    });

    // 新增：导出ID按钮的事件监听器
    exportIdsBtn.addEventListener('click', async () => {
        exportIdsBtn.disabled = true;

        const thumbnailCards = Array.from(document.querySelectorAll('.history-image-card')).reverse();
        if (thumbnailCards.length === 0) {
            alert('未在本页找到任何图片ID！');
            exportIdsBtn.disabled = false;
            return;
        }

        const ids = [];
        for (const card of thumbnailCards) {
            const img = card.querySelector('img');
            if (img && img.src) {
                const imageId = parseImageIdFromUrl(img.src);
                if (imageId) {
                    ids.push(imageId);
                }
            }
        }

        if (ids.length === 0) {
            alert('无法从任何图片中解析出ID。');
            exportIdsBtn.disabled = false;
            return;
        }

        const textContent = ids.join('\n');
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const fileName = `image_ids_${new Date().toISOString().slice(0, 10)}.txt`;

        
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: fileName,
            onload: () => {
                console.log(`ID文件 '${fileName}' 下载任务已提交。`);
                URL.revokeObjectURL(url); // 释放内存
                exportIdsBtn.disabled = false;
            },
            onerror: (err) => {
                console.error(`ID文件下载失败:`, err);
                URL.revokeObjectURL(url); // 释放内存
                alert('导出ID文件失败，详情请查看控制台。');
                exportIdsBtn.disabled = false;
            }
        });
    });

    downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        selectDirBtn.disabled = true;

        // 获取并倒序图片列表
        const thumbnailCards = Array.from(document.querySelectorAll('.history-image-card')).reverse();

        if (thumbnailCards.length === 0) {
            alert('未在本页找到任何图片！');
            downloadBtn.disabled = false;
            selectDirBtn.disabled = false;
            return;
        }

        // --- 1. 计划阶段：预分配索引并创建下载任务 ---
        const downloadTasks = [];
        let nextIndex = 0;
        let skippedCount = 0;

        for (const card of thumbnailCards) {
            const thumbImg = card.querySelector('img');
            if (!thumbImg) continue;

            const imageId = parseImageIdFromUrl(thumbImg.src);
            if (isCheckingEnabled && imageId && existingImageIds.has(imageId)) {
                nextIndex = existingImageIds.get(imageId) + 1;
                skippedCount++;
            } else {
                downloadTasks.push({ card: card, index: nextIndex });
                nextIndex++;
            }
        }

        // 检查

        // --- 2. 执行阶段：处理计划好的任务 ---
        alert(`发现 ${thumbnailCards.length} 张图片。\n计划下载: ${downloadTasks.length} 张\n因已存在而跳过: ${skippedCount} 张`);

        let downloadCount = 0;

        for (let i = 0; i < downloadTasks.length; i++) {
            const task = downloadTasks[i];
            const { card, index: currentIndex } = task; // 从任务中解构出卡片和预分配的索引
            const thumbImg = card.querySelector('img');
            if (!thumbImg) continue;

            downloadBtn.textContent = `下载中 (${i + 1}/${downloadTasks.length})...`;

            try {
                card.click();
                const modalContent = await waitForElement('.lv-modal-content .container-SuvKFi');

                let prompt = 'NoPrompt';
                const promptEl = modalContent.querySelector('.prompt-value-container-HNplhY');
                if (promptEl) prompt = promptEl.textContent.trim();

                const mediumResImage = await waitForElement('.preview-area-JNt7jt .image-C3mkAg');
                mediumResImage.click();

                const highResModal = await waitForElement('.enlarge-image-preview-modal-s7VwVP');
                const highResImage = highResModal.querySelector('img.preview-PUJmH2');
                const highResSrc = highResImage.src;

                const finalImageId = parseImageIdFromUrl(highResSrc);
                const rawFileName = `${currentIndex}-${finalImageId}-${prompt}.webp`;
                const fileName = sanitizeFileName(rawFileName);


                GM_download({ url: highResSrc, name: fileName });

                downloadCount++;
                console.log(`[${i + 1}] 下载任务已提交: ${fileName}`);

            } catch (error) {
                console.error(`处理第 ${i + 1} 张图片时出错 (索引 ${currentIndex}):`, error);
            } finally {
                // 确保弹窗总是会被关闭
                try {
                    const highResCloseBtn = document.querySelector('.enlarge-image-preview-modal-s7VwVP .lv-modal-close-icon');
                    if (highResCloseBtn) highResCloseBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const mediumResCloseBtn = document.querySelector('.lv-modal-wrapper .close-button-kyGUFo');
                    if (mediumResCloseBtn) mediumResCloseBtn.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (closeError) {
                    console.error("关闭弹窗时发生错误:", closeError);
                }
            }
        }

        alert(`处理完毕！\n成功下载: ${downloadCount} 张\n因已存在而跳过: ${skippedCount} 张`);
        downloadBtn.textContent = '2. 开始下载';
        downloadBtn.disabled = false;
        selectDirBtn.disabled = false;
    });

})();

