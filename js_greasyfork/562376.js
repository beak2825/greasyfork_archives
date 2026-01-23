// ==UserScript==
// @name         FDA PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  一键下载FDA药物审评报告中的所有PDF文件
// @description:en FDA PDF Downloader - One-click download all PDF files from FDA Drug Approval Package pages
// @author       longlong
// @match        https://www.accessdata.fda.gov/drugsatfda_docs/nda/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @updated      2026-01-22
// @history      2.4 - Removed NDA number association, simplified filename format to drugName_approvalDate_document.pdf
// @history:en   2.4 - Removed NDA number association, simplified filename format to drugName_approvalDate_document.pdf
// @history      2.3 - Fixed metadata format for Greasy Fork compliance
// @history:en   2.3 - Fixed metadata format for Greasy Fork compliance
// @history      2.2 - Added MIT license tag, improved drug name extraction, removed unused code, updated backup naming convention
// @history:en   2.2 - Added MIT license, improved drug name extraction algorithm, removed redundant code, updated backup naming convention
// @history      2.1 - Implemented PDF filtering, fixed drug name extraction, simplified information confirmation process
// @history:en   2.1 - Implemented PDF file filtering, fixed drug name extraction, simplified information confirmation process
// @history      2.0 - Removed generic name extraction from external pages, fixed async issues
// @history:en   2.0 - Removed external generic name extraction, fixed async/await issues
// @history      1.0 - Initial release with basic PDF download functionality
// @history:en   1.0 - Initial release with basic PDF download functionality
// @downloadURL https://update.greasyfork.org/scripts/562376/FDA%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562376/FDA%20PDF%20Downloader.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2026 longlong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const downloadLog = [];

    // Helper functions
    function trimAndClean(text) {
        return text.replace(/^[\s\n\r\t]+|[\s\n\r\t]+$/g, '').replace(/[\x00-\x1F\x7F]/g, '');
    }

    function parseDate(dateStr) {
        if (!dateStr) return null;
        
        const cleanDate = trimAndClean(dateStr);
        
        // Match MM/DD/YYYY format
        const mmddyyyyMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (mmddyyyyMatch) {
            const [, month, day, year] = mmddyyyyMatch;
            return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
        }
        
        // Match YYYY-MM-DD format
        const yyyymmddMatch = cleanDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (yyyymmddMatch) {
            const [, year, month, day] = yyyymmddMatch;
            return `${year}${month}${day}`;
        }
        
        // Match YYYY/MM/DD format
        const yyyymmddSlashMatch = cleanDate.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
        if (yyyymmddSlashMatch) {
            const [, year, month, day] = yyyymmddSlashMatch;
            return `${year}${month}${day}`;
        }
        
        return null;
    }

    // Extraction rules
    const extractionRules = {
        drugName: [
            {
                id: 'drugName_1',
                name: 'Drug Approval Package prefix',
                confidence: 0.95,
                extract: () => {
                    // Try to find the main title with drug name
                    const titles = document.querySelectorAll('h1, h2');
                    for (const title of titles) {
                        const text = title.textContent || '';
                        const match = text.match(/Drug Approval Package:\s*(.+)/i);
                        if (match) {
                            const drugName = trimAndClean(match[1]);
                            // Verify it's a valid drug name (not containing 'gov' or 'official')
                            if (drugName && !drugName.toLowerCase().includes('gov') && !drugName.toLowerCase().includes('official')) {
                                return drugName;
                            }
                        }
                    }
                    return null;
                }
            },
            {
                id: 'drugName_2',
                name: 'Bold headers',
                confidence: 0.8,
                extract: () => {
                    const boldHeaders = document.querySelectorAll('h1 strong, h2 strong, h3 strong');
                    for (const header of boldHeaders) {
                        const text = header.textContent || '';
                        const cleanText = trimAndClean(text);
                        if (cleanText && cleanText.length > 3 && !cleanText.includes(':') && !cleanText.includes('gov') && !cleanText.includes('official')) {
                            return cleanText;
                        }
                    }
                    return null;
                }
            },
            {
                id: 'drugName_3',
                name: 'drug-name CSS class',
                confidence: 0.95,
                extract: () => {
                    const elements = document.querySelectorAll('.drug-name, .drugName, .product-name, .productName');
                    for (const el of elements) {
                        const text = el.textContent || el.value || '';
                        if (text) {
                            return trimAndClean(text);
                        }
                    }
                    return null;
                }
            },
            {
                id: 'drugName_4',
                name: 'Table entries',
                confidence: 0.85,
                extract: () => {
                    const tables = document.querySelectorAll('table');
                    for (const table of tables) {
                        const rows = table.querySelectorAll('tr');
                        for (const row of rows) {
                            const cells = row.querySelectorAll('td, th');
                            if (cells.length >= 2) {
                                const headerText = (cells[0].textContent || '').toLowerCase();
                                if (headerText.includes('drug') && headerText.includes('name') || 
                                    headerText.includes('药品名称') || 
                                    headerText.includes('product name')) {
                                    return trimAndClean(cells[1].textContent);
                                }
                            }
                        }
                    }
                    return null;
                }
            }
        ],
        approvalDate: [
            {
                id: 'approvalDate_1',
                name: 'Approval Date prefix',
                confidence: 0.95,
                extract: () => {
                    const texts = document.body.innerText || '';
                    const match = texts.match(/Approval\s+Date:\s*([\d\/\-]+)/i);
                    if (match) {
                        return parseDate(match[1]);
                    }
                    return null;
                }
            },
            {
                id: 'approvalDate_2',
                name: 'Date pattern matching',
                confidence: 0.7,
                extract: () => {
                    const texts = document.body.innerText || '';
                    // Match MM/DD/YYYY or YYYY-MM-DD formats
                    const match = texts.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})|(\d{4})-(\d{2})-(\d{2})/);
                    if (match) {
                        return parseDate(match[0]);
                    }
                    return null;
                }
            },
            {
                id: 'approvalDate_3',
                name: 'Approval date element',
                confidence: 0.9,
                extract: () => {
                    const elements = document.querySelectorAll('[class*="approval-date"], [id*="approval-date"], [class*="date"][class*="approval"]');
                    for (const el of elements) {
                        const text = el.textContent || el.value || '';
                        if (text) {
                            const parsed = parseDate(text);
                            if (parsed) {
                                return parsed;
                            }
                        }
                    }
                    return null;
                }
            },
            {
                id: 'approvalDate_4',
                name: 'Table entries',
                confidence: 0.85,
                extract: () => {
                    const tables = document.querySelectorAll('table');
                    for (const table of tables) {
                        const rows = table.querySelectorAll('tr');
                        for (const row of rows) {
                            const cells = row.querySelectorAll('td, th');
                            if (cells.length >= 2) {
                                const headerText = (cells[0].textContent || '').toLowerCase();
                                if (headerText.includes('approval') && headerText.includes('date') || 
                                    headerText.includes('批准日期') || 
                                    headerText.includes('date of approval')) {
                                    const text = cells[1].textContent || '';
                                    const parsed = parseDate(text);
                                    if (parsed) {
                                        return parsed;
                                    }
                                }
                            }
                        }
                    }
                    return null;
                }
            }
        ]
    };

    function extractField(fieldName) {
        const rules = extractionRules[fieldName] || [];
        const results = [];

        for (const rule of rules) {
            try {
                const value = rule.extract();
                if (value) {
                    results.push({ value, confidence: rule.confidence });
                }
            } catch (error) {
                console.error(`Error in rule ${rule.id}:`, error);
            }
        }

        // Sort results by confidence descending
        results.sort((a, b) => b.confidence - a.confidence);
        
        return results.length > 0 ? results[0].value : null;
    }

    function extractDrugInfo() {
        const drugName = extractField('drugName');
        const approvalDate = extractField('approvalDate');

        return { drugName, approvalDate };
    }

    function getPageKey() {
        return 'fdaDrugInfo_' + window.location.pathname;
    }

    function getOrInputDrugInfo() {
        const extractedInfo = extractDrugInfo();
        let drugName = extractedInfo.drugName;
        let approvalDate = extractedInfo.approvalDate;

        const pageKey = getPageKey();
        const savedInfo = sessionStorage.getItem(pageKey);
        if (savedInfo) {
            const parsed = JSON.parse(savedInfo);
            if (!drugName) drugName = parsed.drugName;
            if (!approvalDate) approvalDate = parsed.approvalDate;
        }

        const missingFields = [];
        if (!drugName) missingFields.push('药物名称');
        if (!approvalDate) missingFields.push('批准日期');

        if (missingFields.length > 0) {
            alert(`未能从网页中提取到以下信息：\n${missingFields.join('、')}\n\n请手动输入。`);
        }

        if (!drugName) {
            drugName = prompt('请输入药物名称：', drugName || '');
            if (!drugName) return null;
        }

        if (!approvalDate) {
            approvalDate = prompt('请输入批准日期（格式：MM/DD/YYYY）：', approvalDate || '');
            if (!approvalDate) return null;
            approvalDate = parseDate(approvalDate);
        }

        sessionStorage.setItem(pageKey, JSON.stringify({ drugName, approvalDate }));

        const confirmMsg = `请确认以下信息：\n\n` +
            `药物名称：${drugName}\n` +
            `批准日期：${approvalDate}\n\n` +
            `是否继续下载？`;

        if (!confirm(confirmMsg)) {
            return null;
        }

        return { drugName, approvalDate };
    }

    function getPdfLinks() {
        const pdfLinks = [];
        const links = document.querySelectorAll('a[href$=".pdf"]');
        // Words to filter out from filenames
        const filterWords = ['Name', 'Employee', 'Quality', 'Chemistry', 'Microbiology'];

        links.forEach(link => {
            const href = link.href;
            const text = link.textContent.trim();
            if (href && text) {
                // Check if the text contains any of the filter words (case-insensitive)
                const lowerText = text.toLowerCase();
                const shouldFilter = filterWords.some(word => 
                    lowerText.includes(word.toLowerCase())
                );
                if (!shouldFilter) {
                    pdfLinks.push({
                        url: href,
                        docName: text
                    });
                }
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
                endTime: new Date().toISOString(),
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
        link.download = `${info.drugName}_${info.approvalDate}_download_log.txt`;
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
            const filename = `${info.drugName}_${info.approvalDate}_${sanitizeFilename(pdf.docName)}.pdf`;

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