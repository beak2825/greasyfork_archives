// ==UserScript==
// @name         FDA PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  一键下载FDA药物审评报告中的所有PDF文件
// @author       longlong
// @license      MIT
// @match        https://www.accessdata.fda.gov/drugsatfda_docs/nda/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/562376/FDA%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562376/FDA%20PDF%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const downloadLog = [];

    function extractDrugInfo() {
        let drugName = '';
        let ndaNumber = '';
        let approvalDate = '';

        const titleElement = document.querySelector('h1.content-title');
        if (titleElement) {
            const titleText = titleElement.textContent;
            const match = titleText.match(/Drug Approval Package:\s*(.+)/);
            if (match) {
                drugName = match[1].trim();
            }
        }

        const panelBody = document.querySelector('.panel-body strong');
        if (panelBody) {
            const text = panelBody.innerHTML;
            const ndaMatch = text.match(/Application Number:\s*(\d+)/);
            if (ndaMatch) {
                ndaNumber = ndaMatch[1];
            }

            const dateMatch = text.match(/Approval Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
            if (dateMatch) {
                const dateParts = dateMatch[1].split('/');
                approvalDate = dateParts[2] + dateParts[0].padStart(2, '0') + dateParts[1].padStart(2, '0');
            }
        }

        return { drugName, ndaNumber, approvalDate };
    }

    function getPageKey() {
        return 'fdaDrugInfo_' + window.location.pathname;
    }

    function getOrInputDrugInfo() {
        const extractedInfo = extractDrugInfo();
        let drugName = extractedInfo.drugName;
        let ndaNumber = extractedInfo.ndaNumber;
        let approvalDate = extractedInfo.approvalDate;

        const pageKey = getPageKey();
        const savedInfo = sessionStorage.getItem(pageKey);
        if (savedInfo) {
            const parsed = JSON.parse(savedInfo);
            if (!drugName) drugName = parsed.drugName;
            if (!ndaNumber) ndaNumber = parsed.ndaNumber;
            if (!approvalDate) approvalDate = parsed.approvalDate;
        }

        const missingFields = [];
        if (!drugName) missingFields.push('药物名称');
        if (!ndaNumber) missingFields.push('NDA编号');
        if (!approvalDate) missingFields.push('批准日期');

        if (missingFields.length > 0) {
            alert(`未能从网页中提取到以下信息：\n${missingFields.join('、')}\n\n请手动输入。`);
        }

        if (!drugName) {
            drugName = prompt('请输入药物名称：', drugName || '');
            if (!drugName) return null;
        }

        if (!ndaNumber) {
            ndaNumber = prompt('请输入NDA编号：', ndaNumber || '');
            if (!ndaNumber) return null;
        }

        if (!approvalDate) {
            approvalDate = prompt('请输入批准日期（格式：MM/DD/YYYY）：', approvalDate || '');
            if (!approvalDate) return null;
            const dateParts = approvalDate.split('/');
            if (dateParts.length === 3) {
                approvalDate = dateParts[2] + dateParts[0].padStart(2, '0') + dateParts[1].padStart(2, '0');
            }
        }

        const info = { drugName, ndaNumber, approvalDate };
        sessionStorage.setItem(pageKey, JSON.stringify(info));

        const confirmMsg = `请确认以下信息：\n\n` +
            `药物名称：${drugName}\n` +
            `NDA编号：${ndaNumber}\n` +
            `批准日期：${approvalDate}\n\n` +
            `是否继续下载？`;

        if (!confirm(confirmMsg)) {
            return null;
        }

        return info;
    }

    function getPdfLinks() {
        const pdfLinks = [];
        const links = document.querySelectorAll('a[href$=".pdf"]');

        links.forEach(link => {
            const href = link.href;
            const text = link.textContent.trim();
            if (href && text) {
                pdfLinks.push({
                    url: href,
                    docName: text
                });
            }
        });

        return pdfLinks;
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
    }

    function downloadFile(url, filename, index, total) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                if (xhr.status === 200) {
                    const blob = xhr.response;
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);

                    const logEntry = {
                        index: index + 1,
                        total: total,
                        filename: filename,
                        url: url,
                        status: 'success',
                        size: blob.size,
                        timestamp: new Date().toISOString()
                    };
                    downloadLog.push(logEntry);

                    resolve();
                } else {
                    const logEntry = {
                        index: index + 1,
                        total: total,
                        filename: filename,
                        url: url,
                        status: 'failed',
                        error: `HTTP ${xhr.status}`,
                        timestamp: new Date().toISOString()
                    };
                    downloadLog.push(logEntry);
                    reject(new Error(`Failed to download: ${xhr.status}`));
                }
            };

            xhr.onerror = function() {
                const logEntry = {
                    index: index + 1,
                    total: total,
                    filename: filename,
                    url: url,
                    status: 'failed',
                    error: 'Network error',
                    timestamp: new Date().toISOString()
                };
                downloadLog.push(logEntry);
                reject(new Error('Network error'));
            };

            xhr.send();
        });
    }

    function generateLogFile(info) {
        const logContent = {
            downloadInfo: {
                drugName: info.drugName,
                ndaNumber: info.ndaNumber,
                approvalDate: info.approvalDate,
                startTime: downloadLog.length > 0 ? downloadLog[0].timestamp : new Date().toISOString(),
                endTime: downloadLog.length > 0 ? downloadLog[downloadLog.length - 1].timestamp : new Date().toISOString(),
                totalFiles: downloadLog.length,
                successCount: downloadLog.filter(log => log.status === 'success').length,
                failCount: downloadLog.filter(log => log.status === 'failed').length
            },
            downloadDetails: downloadLog
        };

        const logText = JSON.stringify(logContent, null, 2);
        const blob = new Blob([logText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${info.drugName}_${info.ndaNumber}_${info.approvalDate}_download_log.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    }

    async function downloadAllPdfs() {
        const info = getOrInputDrugInfo();
        if (!info) {
            return;
        }

        const pdfLinks = getPdfLinks();

        if (pdfLinks.length === 0) {
            alert('未找到PDF文件');
            return;
        }

        const button = document.getElementById('fda-download-btn');
        button.disabled = true;

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < pdfLinks.length; i++) {
            const pdf = pdfLinks[i];
            const filename = `${info.drugName}_${info.ndaNumber}_${info.approvalDate}_${sanitizeFilename(pdf.docName)}.pdf`;

            button.textContent = `下载中... ${i + 1}/${pdfLinks.length}`;

            try {
                await downloadFile(pdf.url, filename, i, pdfLinks.length);
                successCount++;
            } catch (error) {
                console.error(`下载失败: ${pdf.docName}`, error);
                failCount++;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        button.disabled = false;
        button.textContent = '下载所有PDF';

        generateLogFile(info);

        alert(`所有下载完成！\n\n成功: ${successCount}\n失败: ${failCount}\n\n日志文件已生成`);
    }

    function createDownloadButton() {
        const button = document.createElement('button');
        button.id = 'fda-download-btn';
        button.textContent = '下载所有PDF';
        button.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 9999;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;

        button.onmouseover = function() {
            this.style.backgroundColor = '#0056b3';
        };

        button.onmouseout = function() {
            this.style.backgroundColor = '#007bff';
        };

        button.onclick = downloadAllPdfs;

        document.body.appendChild(button);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDownloadButton);
    } else {
        createDownloadButton();
    }
})();
