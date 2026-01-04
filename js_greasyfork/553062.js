// ==UserScript==
// @name         NotebookLM YouTube Links Batch Import Assistant
// @name:zh-CN   NotebookLM YouTube 链接批量导入助手
// @namespace    https://greasyfork.org/users/697802-jeffers3n
// @version      1.0.0
// @description  高效批量导入多个 YouTube 链接到 Google NotebookLM，智能处理各种场景，包括新建笔记本时自动弹出的窗口，并支持链接去重和成功后自动关闭。
// @description:en Batch import multiple YouTube links into Google NotebookLM efficiently. Intelligently handles various scenarios, including the auto-opened window on new notebooks. Supports deduplication and auto-close on success.
// @author       定格
// @match        https://notebooklm.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notebooklm.google.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553062/NotebookLM%20YouTube%20Links%20Batch%20Import%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/553062/NotebookLM%20YouTube%20Links%20Batch%20Import%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;

    GM_addStyle(`
        #batch-importer-btn {
            position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px;
            background-color: #1a73e8; color: white; border-radius: 50%; border: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-size: 28px; cursor: pointer;
            display: flex; justify-content: center; align-items: center; z-index: 10001;
        }
        #importer-modal-backdrop {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.6); z-index: 10002;
            display: flex; justify-content: center; align-items: center;
        }
        #importer-modal-content {
            background-color: #fff; color: #333; padding: 25px; border-radius: 10px;
            width: 600px; max-width: 90%; max-height: 80vh;
            display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        body.dark-theme #importer-modal-content { background-color: #282828; color: #efefef; }
        #importer-modal-content h2 { margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
        body.dark-theme #importer-modal-content h2 { border-bottom-color: #555; }
        #importer-modal-content textarea { width: 100%; height: 250px; margin: 15px 0; padding: 10px; background-color: #f9f9f9; color: #333; border: 1px solid #ccc; border-radius: 5px; font-family: monospace; resize: vertical; box-sizing: border-box; }
        body.dark-theme #importer-modal-content textarea { background-color: #1e1e1e; color: #ccc; border-color: #555; }
        #importer-modal-buttons { display: flex; justify-content: flex-end; gap: 10px; }
        #importer-modal-buttons button { padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; background-color: #e0e0e0; color: #333; }
        body.dark-theme #importer-modal-buttons button { background-color: #444; color: #fff; }
        #importer-modal-buttons button#importer-start-btn { background-color: #1a73e8; color: white; }
        #importer-modal-buttons button:disabled { background-color: #ccc; cursor: not-allowed; }
        body.dark-theme #importer-modal-buttons button:disabled { background-color: #555; }
        #importer-status { margin-top: 15px; font-size: 0.9em; min-height: 40px; word-break: break-word; }
    `);

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const waitForElement = async (selector, timeout = 15000, rootNode = document) => {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = rootNode.querySelector(selector);
            if (element && element.offsetParent !== null) return element;
            await sleep(200);
        }
        throw new Error(`等待元素 "${selector}" 超时`);
    };

    const waitForElementToDisappear = async (selector, timeout = 90000, rootNode = document) => {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (!rootNode.querySelector(selector)) return true;
            await sleep(500);
        }
        return false;
    };

    async function addSingleLink(url, statusDiv) {
        try {
            let sourceDialog = document.querySelector('mat-dialog-container:has(mat-chip)');
            if (!sourceDialog || sourceDialog.offsetParent === null) {
                const addSourceBtn = await waitForElement('button[mattooltip="添加来源"]');
                addSourceBtn.click();
                sourceDialog = await waitForElement('mat-dialog-container:has(mat-chip)');
            } else {
                console.log("检测到“添加来源”窗口已打开，直接使用。");
            }

            const youtubeChip = Array.from(sourceDialog.querySelectorAll('mat-chip')).find(chip => chip.textContent.trim().includes('YouTube'));
            if (!youtubeChip) throw new Error("无法找到 'YouTube' 芯片按钮");
            youtubeChip.click();
            await sleep(500);

            const urlDialog = await waitForElement('mat-dialog-container:has(input[id^="mat-input-"])');
            const urlInput = await waitForElement('input[id^="mat-input-"]', 5000, urlDialog);
            urlInput.value = url;
            urlInput.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(1500);

            const insertBtn = Array.from(urlDialog.querySelectorAll('button')).find(btn => btn.textContent.trim().includes('插入'));
            if (!insertBtn || insertBtn.disabled) throw new Error("“插入”按钮不可用");
            insertBtn.click();

            statusDiv.textContent += '\n -> 正在处理...';
            await waitForElementToDisappear('mat-dialog-container', 30000);
            await waitForElementToDisappear('mat-spinner[role="progressbar"]', 90000);
            await sleep(1000);

            return true;
        } catch (error) {
            console.error(error);
            statusDiv.textContent = '';
            const errorSpan = document.createElement('span');
            errorSpan.style.color = 'red';
            errorSpan.textContent = `错误: ${error.message}`;
            statusDiv.appendChild(errorSpan);
            document.querySelectorAll('mat-dialog-container').forEach(dialog => {
                const closeBtn = Array.from(dialog.querySelectorAll('button')).find(b => b.textContent.trim().includes('取消') || b.textContent.trim().includes('关闭'));
                if (closeBtn) closeBtn.click();
            });
            await sleep(1000);
            return false;
        }
    }

    function createModalAndButton() {
        if (document.getElementById('batch-importer-btn')) return;
        const floatButton = document.createElement('button');
        floatButton.id = 'batch-importer-btn';
        floatButton.textContent = '+';
        floatButton.title = '批量导入链接';
        floatButton.onclick = () => {
            if (document.getElementById('importer-modal-backdrop')) return;
            const backdrop = document.createElement('div');
            backdrop.id = 'importer-modal-backdrop';
            const modal = document.createElement('div');
            modal.id = 'importer-modal-content';
            const title = document.createElement('h2');
            title.textContent = '批量导入来源';
            const description = document.createElement('p');
            description.textContent = '请在下方粘贴链接列表，每行一个。';
            const textarea = document.createElement('textarea');
            textarea.id = 'importer-textarea-links';
            textarea.placeholder = 'https://www.youtube.com/watch?v=...';
            const statusDiv = document.createElement('div');
            statusDiv.id = 'importer-status';
            const buttonsContainer = document.createElement('div');
            buttonsContainer.id = 'importer-modal-buttons';
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭';
            const startBtn = document.createElement('button');
            startBtn.id = 'importer-start-btn';
            startBtn.textContent = '开始导入';
            buttonsContainer.appendChild(closeBtn);
            buttonsContainer.appendChild(startBtn);
            modal.appendChild(title);
            modal.appendChild(description);
            modal.appendChild(textarea);
            modal.appendChild(statusDiv);
            modal.appendChild(buttonsContainer);
            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);
            const closeModal = () => { if (document.body.contains(backdrop)) document.body.removeChild(backdrop); };
            closeBtn.onclick = closeModal;
            backdrop.onclick = (e) => { if (e.target === backdrop) closeModal(); };

            startBtn.onclick = async () => {
                if (isProcessing) { statusDiv.textContent = '请等待当前导入任务完成。'; return; }
                const rawLinks = textarea.value.split('\n').map(link => link.trim()).filter(link => link);
                const uniqueLinks = [...new Set(rawLinks)];
                if (uniqueLinks.length === 0) { statusDiv.textContent = '错误：链接列表不能为空！'; return; }
                if (rawLinks.length !== uniqueLinks.length) {
                    statusDiv.textContent = '';
                    const warnSpan = document.createElement('span');
                    warnSpan.style.color = 'orange';
                    warnSpan.textContent = `警告：检测到 ${rawLinks.length - uniqueLinks.length} 个重复链接，已自动去重。`;
                    statusDiv.appendChild(warnSpan);
                    await sleep(3000);
                }
                isProcessing = true;
                startBtn.disabled = true; closeBtn.disabled = true; textarea.disabled = true;
                let successCount = 0;
                let userStopped = false;
                for (let i = 0; i < uniqueLinks.length; i++) {
                    statusDiv.textContent = `[${i + 1}/${uniqueLinks.length}] 正在处理:\n${uniqueLinks[i]}`;
                    const success = await addSingleLink(uniqueLinks[i], statusDiv);
                    if (success) { successCount++; } else {
                        if (!confirm(`处理第 ${i + 1} 个链接时发生错误。要继续处理剩余的链接吗？`)) {
                            statusDiv.textContent = `用户已停止。最终导入 ${successCount} 个链接。`;
                            userStopped = true;
                            break;
                        }
                    }
                }
                if (!userStopped) {
                    statusDiv.textContent = `完成！成功导入了 ${successCount} / ${uniqueLinks.length} 个链接。`;
                    if (successCount === uniqueLinks.length && uniqueLinks.length > 0) {
                        statusDiv.textContent += '\n窗口将在3秒后自动关闭...';
                        await sleep(3000);
                        closeModal();
                    } else {
                        startBtn.disabled = false; closeBtn.disabled = false; textarea.disabled = false;
                    }
                } else {
                    startBtn.disabled = false; closeBtn.disabled = false; textarea.disabled = false;
                }
                isProcessing = false;
            };
        };
        document.body.appendChild(floatButton);
        console.log('NotebookLM 批量导入助手 (V-FINAL) 已添加。');
    }

    setTimeout(createModalAndButton, 3000);

})();