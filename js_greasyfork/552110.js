// ==UserScript==
// @name         Gofile Bulk Downloader
// @namespace    https://github.com/xmtaha
// @version      2.0
// @description  Download all files from Gofile automatically by clicking download buttons
// @author       xmtaha
// @match        https://gofile.io/*
// @match        https://*.gofile.io/*
// @match        http://gofile.io/*
// @match        http://*.gofile.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552110/Gofile%20Bulk%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/552110/Gofile%20Bulk%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        clickDelay: 1500,
        autoCloseDelay: 5000
    };

    let isDownloading = false;

    const styles = `
        .gofile-bulk-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .bulk-download-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            overflow: hidden;
        }

        .bulk-download-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }

        .bulk-download-btn:active {
            transform: translateY(-1px);
        }

        .bulk-download-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }
    `;

    function injectStyles() {
        if (document.getElementById('gofile-bulk-styles')) return;
        const styleSheet = document.createElement('style');
        styleSheet.id = 'gofile-bulk-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function createMainContainer() {
        const container = document.createElement('div');
        container.className = 'gofile-bulk-container';
        container.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        `;

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'bulk-download-btn';
        downloadBtn.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border: none !important;
            padding: 15px 25px !important;
            border-radius: 12px !important;
            font-size: 16px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: all 0.3s ease !important;
        `;
        downloadBtn.innerHTML = `
            <span>Download All</span>
            <span id="fileCount"></span>
        `;
        downloadBtn.onclick = startBulkDownload;

        container.appendChild(downloadBtn);

        return container;
    }

    function findDownloadButtons() {
        const buttons = [];
        const itemDownloadBtns = document.querySelectorAll('button.item_download');

        itemDownloadBtns.forEach((btn, index) => {
            const isVisible = btn.offsetWidth > 0 && btn.offsetHeight > 0;
            const hasIcon = btn.querySelector('i.fas.fa-download');

            if (isVisible && hasIcon) {
                const fileName = getFileNameFromContext(btn) || `file_${index + 1}`;

                buttons.push({
                    element: btn,
                    name: fileName.replace(/[<>:"/\\|?*]/g, '_').trim(),
                    visible: isVisible
                });
            }
        });

        return buttons;
    }

    function getFileNameFromContext(element) {
        const sources = [
            () => element.getAttribute('data-filename'),
            () => element.getAttribute('title'),
            () => element.getAttribute('alt'),

            () => {
                const parent = element.closest('tr, .file-row, .file-item, .content-item');
                if (parent) {
                    const firstCell = parent.querySelector('td:first-child, .file-name, .filename, .name');
                    if (firstCell) {
                        const text = firstCell.textContent?.trim();
                        return text;
                    }
                }
                return null;
            },

            () => {
                let sibling = element.parentElement?.firstElementChild;
                while (sibling) {
                    if (sibling !== element) {
                        const text = sibling.textContent?.trim();
                        if (text && text.length > 3 &&
                            !text.toLowerCase().includes('download') &&
                            !text.toLowerCase().includes('size') &&
                            !text.toLowerCase().includes('date')) {
                            return text;
                        }
                    }
                    sibling = sibling.nextElementSibling;
                }
                return null;
            },

            () => {
                let prev = element.previousElementSibling;
                let attempts = 0;
                while (prev && attempts < 5) {
                    const text = prev.textContent?.trim();
                    if (text && text.length > 2 &&
                        !text.toLowerCase().includes('download') &&
                        !text.toLowerCase().includes('button')) {
                        return text;
                    }
                    prev = prev.previousElementSibling;
                    attempts++;
                }
                return null;
            },

            () => {
                const text = element.textContent?.trim();
                if (text && text !== 'Download' && text.length > 2) {
                    return text;
                }
                return null;
            }
        ];

        for (let i = 0; i < sources.length; i++) {
            try {
                const result = sources[i]();
                if (result && result.length > 2) {
                    return result;
                }
            } catch (e) {
                continue;
            }
        }

        return null;
    }

    async function startBulkDownload() {
        if (isDownloading) return;

        const downloadButtons = findDownloadButtons();

        if (downloadButtons.length === 0) {
            alert('No downloadable files found on this page!\n\nPlease wait for the page to fully load.');
            return;
        }

        const message = `${downloadButtons.length} files found.\n\n` +
                       `IMPORTANT: This script will click the download button for each file.\n` +
                       `Your browser may request download confirmation for each file.\n\n` +
                       `Do you want to continue?`;

        if (!confirm(message)) {
            return;
        }

        isDownloading = true;

        const progressDiv = document.createElement('div');
        progressDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 30px;
            border-radius: 15px;
            z-index: 999999;
            text-align: center;
            font-family: Arial, sans-serif;
        `;
        progressDiv.innerHTML = `
            <h3> Downloading Files</h3>
            <p id="clickProgress">0 / ${downloadButtons.length} buttons clicked</p>
            <p><small>Browser confirmation may be required for each file</small></p>
            <button onclick="this.parentElement.remove(); window.cancelBulkDownload = true;"
                    style="background: #ff4444; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; cursor: pointer;">
                Cancel
            </button>
        `;
        document.body.appendChild(progressDiv);

        window.cancelBulkDownload = false;
        let clickedCount = 0;

        try {
            for (let i = 0; i < downloadButtons.length; i++) {
                if (window.cancelBulkDownload) break;

                const button = downloadButtons[i];

                const progressText = document.getElementById('clickProgress');
                if (progressText) {
                    progressText.textContent = `${i + 1} / ${downloadButtons.length} buttons clicked - ${button.name}`;
                }

                try {
                    button.element.focus();
                    button.element.click();
                    clickedCount++;
                } catch (error) {
                    continue;
                }

                await new Promise(resolve => setTimeout(resolve, CONFIG.clickDelay));
            }

            if (progressDiv && progressDiv.parentElement) {
                const finalMessage = document.createElement('div');
                finalMessage.style.cssText = progressDiv.style.cssText;
                finalMessage.innerHTML = `
                    <h3>Process Completed!</h3>
                    <p>${clickedCount} download buttons clicked</p>
                    <p><small>Files should be in your Downloads folder</small></p>
                    <button onclick="this.parentElement.remove()"
                            style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-top: 15px; cursor: pointer;">
                        Close
                    </button>
                `;

                document.body.replaceChild(finalMessage, progressDiv);

                setTimeout(() => {
                    if (finalMessage.parentElement) {
                        finalMessage.remove();
                    }
                }, CONFIG.autoCloseDelay);
            }

        } catch (error) {
            alert('An error occurred during download: ' + error.message);
        } finally {
            isDownloading = false;

            if (progressDiv && progressDiv.parentElement) {
                progressDiv.remove();
            }
        }
    }

    function updateFileCount() {
        const buttons = findDownloadButtons();
        const countElement = document.getElementById('fileCount');
        if (countElement) {
            countElement.textContent = buttons.length > 0 ? `(${buttons.length})` : '';
        }
    }

    function initialize() {
        injectStyles();

        const checkForContent = () => {
            if (document.querySelector('.gofile-bulk-container')) {
                updateFileCount();
                return;
            }

            const isGofilePage = window.location.hostname.includes('gofile.io');

            if (isGofilePage) {
                const container = createMainContainer();
                document.body.appendChild(container);

                const buttons = findDownloadButtons();
                updateFileCount();

                setTimeout(() => {
                    const laterButtons = findDownloadButtons();
                    updateFileCount();
                }, 2000);
            }
        };

        const observer = new MutationObserver(() => {
            setTimeout(() => {
                checkForContent();
                updateFileCount();
            }, 500);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(checkForContent, 1000);
        setTimeout(checkForContent, 3000);
        setTimeout(checkForContent, 5000);
        setInterval(checkForContent, 10000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
