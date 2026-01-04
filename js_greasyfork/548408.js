// ==UserScript==
// @name         ADXRay 视频自动下载器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在ADXRay素材库页面，自动悬停视频封面，提取并下载视频，支持自动翻页和下载数量限制。文件名格式：[游戏名]_[序号]_[其他信息].mp4
// @author       YourName
// @match        https://adxray.dataeye.com/index/home*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548408/ADXRay%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/548408/ADXRay%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置 (Configuration) ---
    const CONFIG = {
        // Paths & Storage
        DOWNLOADED_URLS_KEY: 'adxray_downloaded_urls', // 用于GM_setValue/getValue的键

        // Scraper Settings
        HOVER_DURATION_SECONDS: 2,
        WAIT_TIMEOUT_SECONDS: 15,
        DELAY_BETWEEN_HOVERS_MS: 500, // 每次悬停之间的延迟
        DELAY_AFTER_PAGE_TURN_MS: 3000, // 翻页后的等待时间

        // Selectors
        VIDEO_ELEMENT: 'video',
        COVER_ELEMENT: '.E55yg',
        NEXT_PAGE: '//*[@id="container"]/div[1]/div[2]/div/div/div[2]/div[2]/ul/li[8]/a',
        TEXT_COMPONENT_1: '#container > div.WBfDm > div.mu2Li > div > div.NELjj > div > div > div.U9TXw > div.jA7JV > div.QEfjx > h3 > div',
        TEXT_COMPONENT_2: '#container > div.WBfDm > div.mu2Li > div > div:nth-child(3) > div.Zngi6 > div.jaCwH > div.Izo5l > div:nth-child(1) > div.XDite > div > div.o5cEK > div:nth-child(1) > div.c0Qix',
    };

    // --- 2. 全局状态变量 (Global State) ---
    let isRunning = false;
    let downloadedUrls = new Set();
    let videoCounter = 0; // 用于文件名编号 (历史总数)
    let sessionDownloadCount = 0; // 本次运行任务的下载计数
    let downloadLimit = 0; // 下载上限, 0表示无限制

    // --- 3. 核心功能函数 (Core Functions) ---

    /**
     * 清理字符串作为文件名的一部分
     * @param {string} text - 输入文本
     * @param {number} maxLen - 最大长度
     * @returns {string} 清理后的文本
     */
    function sanitizeFilenamePart(text, maxLen = 50) {
        if (!text) return "";
        return text.trim()
            .replace(/[\\/:*?"<>|. ]+/g, '_') // 替换无效字符和空格
            .replace(/_+/g, '_') // 合并多个下划线
            .replace(/^_+|_+$/g, '') // 去除首尾下划线
            .slice(0, maxLen);
    }

    /**
     * 异步延迟函数
     * @param {number} ms - 延迟的毫秒数
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 等待指定选择器的元素出现
     * @param {string} selector - CSS选择器
     * @param {number} timeout - 超时秒数
     * @returns {Promise<Element|null>}
     */
    function waitForElement(selector, timeout) {
        return new Promise((resolve) => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
                elapsedTime += intervalTime;
                if (elapsedTime >= timeout * 1000) {
                    clearInterval(interval);
                    resolve(null); // 超时返回 null
                }
            }, intervalTime);
        });
    }

    /**
     * 加载已下载的URL列表
     */
    async function loadDownloadedUrls() {
        const storedUrls = await GM_getValue(CONFIG.DOWNLOADED_URLS_KEY, []);
        downloadedUrls = new Set(storedUrls);
        videoCounter = downloadedUrls.size;
        updateStatus(`已加载 ${downloadedUrls.size} 条下载记录。`);
    }

    /**
     * 保存URL到持久化存储
     * @param {string} url - 要保存的视频URL
     */
    async function saveUrl(url) {
        if (downloadedUrls.has(url)) return;
        downloadedUrls.add(url);
        videoCounter++;
        await GM_setValue(CONFIG.DOWNLOADED_URLS_KEY, Array.from(downloadedUrls));
    }

    /**
     * 主处理逻辑：处理当前页面的所有视频
     */
    async function processCurrentPage() {
        updateStatus("正在处理当前页面...");
        logMessage("开始扫描当前页面...");

        const coverElements = document.querySelectorAll(CONFIG.COVER_ELEMENT);
        if (coverElements.length === 0) {
            logMessage("警告：当前页面未找到任何视频封面。");
            return;
        }

        logMessage(`发现 ${coverElements.length} 个视频封面。`);

        const text1 = document.querySelector(CONFIG.TEXT_COMPONENT_1)?.textContent || '';
        const text2 = document.querySelector(CONFIG.TEXT_COMPONENT_2)?.textContent || '';
        const pageContextName1 = sanitizeFilenamePart(text1, 30);
        const pageContextName2 = sanitizeFilenamePart(text2, 30);

        for (const cover of coverElements) {
            if (!isRunning) {
                logMessage("任务已暂停。");
                return;
            }

            cover.scrollIntoView({ block: 'center', behavior: 'smooth' });
            await sleep(CONFIG.DELAY_BETWEEN_HOVERS_MS);

            cover.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            cover.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));

            const videoElement = await waitForElement(CONFIG.VIDEO_ELEMENT, CONFIG.HOVER_DURATION_SECONDS + 2);

            if (videoElement && videoElement.src) {
                const videoUrl = videoElement.src;

                if (!downloadedUrls.has(videoUrl)) {
                    await saveUrl(videoUrl);

                    const baseFilename = new URL(videoUrl).pathname.split('/').pop();
                    const finalFilename = [
                        pageContextName1,
                        String(videoCounter).padStart(4, '0'),
                        pageContextName2,
                        sanitizeFilenamePart(baseFilename, 60)
                    ].filter(Boolean).join('_') + '.mp4';

                    logMessage(`[下载任务] -> ${finalFilename}`);
                    GM_download({
                        url: videoUrl,
                        name: finalFilename,
                        onerror: (err) => logMessage(`下载失败: ${finalFilename}, 原因: ${err.error}`),
                    });

                    // --- 新增：下载计数和上限检查 ---
                    sessionDownloadCount++;
                    updateStatus(`已下载 ${sessionDownloadCount} / ${downloadLimit > 0 ? downloadLimit : '∞'}`);

                    if (downloadLimit > 0 && sessionDownloadCount >= downloadLimit) {
                        logMessage(`已达到下载上限 (${downloadLimit})，任务自动暂停。`);
                        GM_notification({
                            text: `已达到 ${downloadLimit} 个视频的下载上限，任务已自动暂停。`,
                            title: 'ADXRay 下载器',
                            timeout: 5000
                        });
                        stopAutomation();
                        return; // 立即停止处理
                    }
                    // ------------------------------------

                }
            } else {
                 logMessage("悬停后未找到视频URL，跳过。");
            }

            cover.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
            cover.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

            await sleep(200);
        }
    }


    /**
     * 尝试翻到下一页
     * @returns {boolean} 是否成功翻页
     */
    function goToNextPage() {
        const getElementByXpath = (path) => {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        };
        const nextButton = getElementByXpath(CONFIG.NEXT_PAGE);

        if (nextButton && !nextButton.closest('li.disabled')) {
            logMessage("找到'下一页'按钮，正在翻页...");
            nextButton.click();
            return true;
        } else {
            logMessage("未找到'下一页'按钮或已是最后一页。");
            return false;
        }
    }

    /**
     * 完整的自动化流程
     */
    async function startAutomation() {
        if (isRunning) return;
        isRunning = true;
        sessionDownloadCount = 0; // 重置本次会话的下载计数
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('limitInput').disabled = true; // 运行时不允许修改
        updateStatus("任务已启动...");

        while (isRunning) {
            await processCurrentPage();

            if (!isRunning) break;

            const hasTurnedPage = goToNextPage();
            if (hasTurnedPage) {
                logMessage(`翻页成功，等待 ${CONFIG.DELAY_AFTER_PAGE_TURN_MS / 1000} 秒加载...`);
                await sleep(CONFIG.DELAY_AFTER_PAGE_TURN_MS);
            } else {
                logMessage("自动化流程完成：已到达最后一页。");
                GM_notification({
                    text: `所有页面处理完毕，共发现 ${videoCounter} 个视频。`,
                    title: 'ADXRay 下载器',
                    timeout: 5000
                });
                stopAutomation();
                break;
            }
        }
    }

    /**
     * 暂停自动化流程
     */
    function stopAutomation() {
        isRunning = false;
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('limitInput').disabled = false; // 暂停时允许修改
        updateStatus("任务已暂停。");
        logMessage("任务已手动暂停。");
    }

    // --- 4. UI 界面 (User Interface) ---
    function setupUI() {
        GM_addStyle(`
            #control-panel {
                position: fixed; bottom: 20px; right: 20px; width: 320px;
                background-color: #2c3e50; color: #ecf0f1; border: 1px solid #34495e;
                border-radius: 8px; padding: 15px; font-family: Arial, sans-serif;
                font-size: 14px; z-index: 9999; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            #control-panel h3 {
                margin: 0 0 10px 0; color: #3498db; text-align: center;
                border-bottom: 1px solid #34495e; padding-bottom: 5px;
            }
            #control-panel .status-bar {
                margin-bottom: 10px; background-color: #34495e; padding: 5px;
                border-radius: 4px; text-align: center;
            }
            #control-panel .buttons {
                display: flex; justify-content: space-around; margin-bottom: 15px;
            }
            #control-panel button {
                padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer;
                color: white; font-weight: bold; transition: background-color 0.3s;
            }
            #control-panel button:disabled { opacity: 0.5; cursor: not-allowed; }
            #startBtn { background-color: #27ae60; }
            #startBtn:hover:not(:disabled) { background-color: #2ecc71; }
            #pauseBtn { background-color: #e67e22; }
            #pauseBtn:hover:not(:disabled) { background-color: #f39c12; }
            #log-box {
                height: 150px; background-color: #1e2b38; border: 1px solid #34495e;
                overflow-y: scroll; padding: 8px; font-size: 12px;
                border-radius: 4px; color: #bdc3c7;
            }
            .setting-row {
                display: flex; justify-content: space-between; align-items: center;
                margin-bottom: 10px; padding: 5px; background-color: #34495e; border-radius: 4px;
            }
            .setting-row label { font-weight: bold; color: #95a5a6; }
            .setting-row input {
                width: 80px; background-color: #ecf0f1; color: #2c3e50; border: none;
                padding: 4px; border-radius: 3px; text-align: center;
            }
        `);

        const panel = document.createElement('div');
        panel.id = 'control-panel';
        panel.innerHTML = `
            <h3>ADXRay 视频下载器</h3>
            <div id="status-display" class="status-bar">准备就绪</div>
            <div class="setting-row">
                <label for="limitInput">本次下载上限 (0为无限制):</label>
                <input type="number" id="limitInput" value="0" min="0">
            </div>
            <div class="buttons">
                <button id="startBtn">开始/恢复</button>
                <button id="pauseBtn" disabled>暂停</button>
            </div>
            <div id="log-box"></div>
        `;
        document.body.appendChild(panel);

        document.getElementById('startBtn').addEventListener('click', startAutomation);
        document.getElementById('pauseBtn').addEventListener('click', stopAutomation);

        const limitInput = document.getElementById('limitInput');
        limitInput.addEventListener('input', (e) => {
            downloadLimit = parseInt(e.target.value, 10) || 0;
            if (downloadLimit < 0) {
                 downloadLimit = 0;
                 e.target.value = 0;
            }
            logMessage(`下载上限已设置为: ${downloadLimit > 0 ? downloadLimit : '无限制'}.`);
        });
    }

    function updateStatus(message) {
        document.getElementById('status-display').textContent = message;
    }

    function logMessage(message) {
        const logBox = document.getElementById('log-box');
        const time = new Date().toLocaleTimeString();
        logBox.innerHTML += `<div>[${time}] ${message}</div>`;
        logBox.scrollTop = logBox.scrollHeight;
    }

    // --- 5. 脚本初始化 (Initialization) ---
    window.addEventListener('load', () => {
        setupUI();
        loadDownloadedUrls();
    });

})();
