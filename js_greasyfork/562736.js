// ==UserScript==
// @name         FDA label letter downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一键下载FDA网站的NDA相关文件(label和letter)
// @author       longlong
// @license      MIT
// @match        https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @connect      accessdata.fda.gov
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562736/FDA%20label%20letter%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562736/FDA%20label%20letter%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        storageKey: 'fda_download_history',
        maxHistory: 100,
        downloadDelay: 500
    };

    let downloadQueue = [];
    let isDownloading = false;
    let downloadProgress = { current: 0, total: 0 };

    function getActiveIngredient() {
        const productTable = document.querySelector('#exampleProd');
        if (!productTable) return null;

        const rows = productTable.querySelectorAll('tbody tr');
        if (rows.length === 0) return null;

        const firstRow = rows[0];
        const cells = firstRow.querySelectorAll('td');
        if (cells.length >= 2) {
            return cells[1].textContent.trim();
        }
        return null;
    }

    function parseDate(dateStr) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }
        return dateStr;
    }

    function extractOriginalApprovals() {
        const files = [];
        const table = document.querySelector('#exampleApplOrig');
        if (!table) return files;

        const activeIngredient = getActiveIngredient();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 6) return;

            const actionDate = cells[0].textContent.trim();
            const linksCell = cells[5];
            const links = linksCell.querySelectorAll('a');

            links.forEach(link => {
                const text = link.textContent.trim();
                const href = link.getAttribute('href');
                if (!href) return;

                let fileType = null;
                if (text.includes('Label')) {
                    fileType = 'label';
                } else if (text.includes('Letter')) {
                    fileType = 'letter';
                }

                if (fileType && href.includes('.pdf')) {
                    const fileName = `${activeIngredient}_${parseDate(actionDate)}_${fileType}.pdf`;
                    files.push({
                        url: href,
                        fileName: fileName,
                        type: fileType,
                        date: actionDate,
                        source: 'Original Approval'
                    });
                }
            });
        });

        return files;
    }

    function extractSupplements() {
        const files = [];
        const table = document.querySelector('#exampleApplSuppl');
        if (!table) return files;

        const activeIngredient = getActiveIngredient();
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return;

            const actionDate = cells[0].textContent.trim();
            const supplementCategory = cells[2].textContent.trim();

            if (!supplementCategory.toLowerCase().includes('efficacy')) {
                return;
            }

            const linksCell = cells[3];
            const links = linksCell.querySelectorAll('a');

            links.forEach(link => {
                const text = link.textContent.trim();
                const href = link.getAttribute('href');
                if (!href) return;

                let fileType = null;
                if (text.includes('Label')) {
                    fileType = 'label';
                } else if (text.includes('Letter')) {
                    fileType = 'letter';
                }

                if (fileType && href.includes('.pdf')) {
                    const fileName = `${activeIngredient}_${parseDate(actionDate)}_${fileType}.pdf`;
                    files.push({
                        url: href,
                        fileName: fileName,
                        type: fileType,
                        date: actionDate,
                        source: 'Supplement'
                    });
                }
            });
        });

        return files;
    }

    function getAllFiles() {
        const originalFiles = extractOriginalApprovals();
        const supplementFiles = extractSupplements();
        return [...originalFiles, ...supplementFiles];
    }

    function downloadFile(fileInfo) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: fileInfo.url,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileInfo.fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        resolve(fileInfo);
                    } else {
                        reject(new Error(`Failed to download ${fileInfo.fileName}`));
                    }
                },
                onerror: function() {
                    reject(new Error(`Network error downloading ${fileInfo.fileName}`));
                }
            });
        });
    }

    async function processDownloadQueue() {
        if (isDownloading || downloadQueue.length === 0) return;

        isDownloading = true;
        downloadProgress = { current: 0, total: downloadQueue.length };
        updateProgressDisplay();

        const history = getDownloadHistory();

        while (downloadQueue.length > 0) {
            const file = downloadQueue.shift();
            try {
                await downloadFile(file);
                history.unshift({
                    ...file,
                    timestamp: new Date().toISOString(),
                    status: 'success'
                });
            } catch (error) {
                console.error(error);
                history.unshift({
                    ...file,
                    timestamp: new Date().toISOString(),
                    status: 'failed',
                    error: error.message
                });
                showNotification(`下载失败: ${file.fileName}`, 'error');
            }

            downloadProgress.current++;
            updateProgressDisplay();
            saveDownloadHistory(history);

            if (downloadQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, CONFIG.downloadDelay));
            }
        }

        isDownloading = false;
        showNotification('所有文件下载完成!', 'success');
        updateDownloadButtonState();
    }

    function startDownload() {
        const files = getAllFiles();
        if (files.length === 0) {
            showNotification('未找到可下载的文件', 'warning');
            return;
        }

        downloadQueue = [...files];
        processDownloadQueue();
    }

    function getDownloadHistory() {
        const history = GM_getValue(CONFIG.storageKey, '[]');
        return JSON.parse(history);
    }

    function saveDownloadHistory(history) {
        const trimmed = history.slice(0, CONFIG.maxHistory);
        GM_setValue(CONFIG.storageKey, JSON.stringify(trimmed));
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function createUI() {
        const fdaMasthead = document.querySelector('.fda-masthead');
        if (!fdaMasthead) {
            console.error('未找到FDA masthead元素');
            return;
        }

        const container = document.createElement('div');
        container.id = 'fda-downloader-container';
        container.style.cssText = `
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
            border-bottom: 2px solid #003366;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
        `;

        const logo = document.createElement('div');
        logo.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
        `;

        const title = document.createElement('div');
        title.textContent = 'FDA Label Letter Downloader';
        title.style.cssText = `
            color: white;
            font-size: 16px;
            font-weight: bold;
            flex: 1;
        `;

        const button = document.createElement('button');
        button.id = 'fda-download-btn';
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>一键下载</span>
        `;
        button.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 10px 24px;
            background: white;
            color: #0056b3;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        button.onmouseover = () => {
            button.style.background = '#f0f0f0';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        };
        button.onmouseout = () => {
            button.style.background = 'white';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        };
        button.onclick = startDownload;

        const progressContainer = document.createElement('div');
        progressContainer.id = 'fda-progress-container';
        progressContainer.style.cssText = `
            display: none;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            background: rgba(255,255,255,0.95);
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;

        const progressBar = document.createElement('div');
        progressBar.id = 'fda-progress-bar';
        progressBar.style.cssText = `
            width: 200px;
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
        `;

        const progressFill = document.createElement('div');
        progressFill.id = 'fda-progress-fill';
        progressFill.style.cssText = `
            height: 100%;
            background: #4CAF50;
            width: 0%;
            transition: width 0.3s ease;
        `;

        const progressText = document.createElement('div');
        progressText.id = 'fda-progress-text';
        progressText.style.cssText = `
            font-size: 12px;
            color: #333;
            white-space: nowrap;
            min-width: 100px;
        `;

        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);

        const historyButton = document.createElement('button');
        historyButton.innerHTML = '📋';
        historyButton.title = '查看历史记录';
        historyButton.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        `;
        historyButton.onmouseover = () => {
            historyButton.style.background = 'rgba(255,255,255,0.3)';
        };
        historyButton.onmouseout = () => {
            historyButton.style.background = 'rgba(255,255,255,0.2)';
        };
        historyButton.onclick = showHistory;

        container.appendChild(logo);
        container.appendChild(title);
        container.appendChild(button);
        container.appendChild(progressContainer);
        container.appendChild(historyButton);

        fdaMasthead.parentNode.insertBefore(container, fdaMasthead.nextSibling);
    }

    function updateProgressDisplay() {
        const progressContainer = document.getElementById('fda-progress-container');
        const progressFill = document.getElementById('fda-progress-fill');
        const progressText = document.getElementById('fda-progress-text');

        if (downloadProgress.total > 0) {
            progressContainer.style.display = 'block';
            const percentage = Math.round((downloadProgress.current / downloadProgress.total) * 100);
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `下载进度: ${downloadProgress.current}/${downloadProgress.total} (${percentage}%)`;
        } else {
            progressContainer.style.display = 'none';
        }
    }

    function updateDownloadButtonState() {
        const button = document.getElementById('fda-download-btn');
        if (isDownloading) {
            button.disabled = true;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }

    function showHistory() {
        const history = getDownloadHistory();
        if (history.length === 0) {
            showNotification('暂无下载历史', 'info');
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        const header = document.createElement('h3');
        header.textContent = '下载历史记录';
        header.style.cssText = 'margin-top: 0; color: #333;';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            float: right;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
        `;
        closeBtn.onclick = () => modal.remove();

        header.appendChild(closeBtn);
        content.appendChild(header);

        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        `;

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">文件名</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">类型</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">日期</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">状态</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">时间</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        history.forEach(item => {
            const row = document.createElement('tr');
            row.style.cssText = 'border-bottom: 1px solid #eee;';

            const statusColor = item.status === 'success' ? '#4CAF50' : '#f44336';
            const time = new Date(item.timestamp).toLocaleString('zh-CN');

            row.innerHTML = `
                <td style="padding: 10px;">${item.fileName}</td>
                <td style="padding: 10px;">${item.type}</td>
                <td style="padding: 10px;">${item.date}</td>
                <td style="padding: 10px; color: ${statusColor};">${item.status === 'success' ? '成功' : '失败'}</td>
                <td style="padding: 10px;">${time}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        content.appendChild(table);

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            createUI();
        }
    }

    init();
})();
