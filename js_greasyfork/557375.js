// ==UserScript==
// @name         超星文档下载解锁助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  解锁超星学习通资料与课程中禁止下载的文档，突破下载限制，支持批量下载PDF、Word等课件资料
// @author       niechy
// @match        https://mooc2-ans.chaoxing.com/mooc2-ans/coursedata/*
// @match        https://mooc2-ans.chaoxing.com/ananas/modules/*
// @match        https://mooc1.chaoxing.com/ananas/modules/*
// @grant        GM_xmlhttpRequest
// @connect      d0.ananas.chaoxing.com
// @connect      d0.cldisk.com
// @connect      s3.ananas.chaoxing.com
// @connect      cs.ananas.chaoxing.com
// @connect      mooc2-ans.chaoxing.com
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557375/%E8%B6%85%E6%98%9F%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%E8%A7%A3%E9%94%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557375/%E8%B6%85%E6%98%9F%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%E8%A7%A3%E9%94%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断页面类型
    const PAGE_TYPE = {
        COURSEDATA: location.pathname.includes('/coursedata/'),  // 批量下载页面
        MODULES: location.pathname.includes('/ananas/modules/')   // 捕获页面
    };

    // 存储捕获到的下载信息
    let downloadList = [];

    // 批量下载状态
    let batchDownloading = false;
    let batchDownloadCancelled = false;

    // 扫描页面上的文件列表
    function scanPageFiles() {
        const files = [];
        const items = document.querySelectorAll('.dataBody_td[objectid]');
        items.forEach(item => {
            const objectid = item.getAttribute('objectid');
            const dataname = item.getAttribute('dataname');
            const type = item.getAttribute('type');
            if (objectid && dataname) {
                files.push({ objectid, filename: dataname, type });
            }
        });
        return files;
    }

    // 获取文件下载信息
    function fetchFileInfo(objectid) {
        return new Promise((resolve, reject) => {
            const url = `https://mooc2-ans.chaoxing.com/ananas/status/${objectid}?flag=normal&_dc=${Date.now()}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Referer': location.href
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.status === 'success' && data.download) {
                            resolve({
                                filename: data.filename,
                                download: data.download,
                                length: data.length,
                                objectid: data.objectid
                            });
                        } else {
                            reject(new Error('无下载链接'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    // 下载文件为 Blob
    function downloadFileAsBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: {
                    'Referer': location.href
                },
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error('下载失败: ' + response.status));
                    }
                },
                onerror: reject
            });
        });
    }

    // 批量下载
    async function batchDownload() {
        if (batchDownloading) {
            alert('正在下载中，请稍候...');
            return;
        }

        const pageFiles = scanPageFiles();
        if (pageFiles.length === 0) {
            alert('未在页面上找到可下载的文件');
            return;
        }

        batchDownloading = true;
        batchDownloadCancelled = false;
        const progressPanel = showProgressPanel(pageFiles.length);

        try {
            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < pageFiles.length; i++) {
                // 检查是否被取消
                if (batchDownloadCancelled) {
                    updateProgress(progressPanel, i, pageFiles.length, '',
                        `已取消! 成功: ${successCount}, 失败: ${failCount}`, true);
                    return;
                }

                const file = pageFiles[i];
                updateProgress(progressPanel, i + 1, pageFiles.length, file.filename, '获取下载链接...');

                try {
                    // 获取下载信息
                    const info = await fetchFileInfo(file.objectid);

                    // 再次检查是否被取消
                    if (batchDownloadCancelled) {
                        updateProgress(progressPanel, i + 1, pageFiles.length, '',
                            `已取消! 成功: ${successCount}, 失败: ${failCount}`, true);
                        return;
                    }

                    updateProgress(progressPanel, i + 1, pageFiles.length, info.filename, '下载中...');

                    // 下载文件
                    const blob = await downloadFileAsBlob(info.download);

                    // 再次检查是否被取消
                    if (batchDownloadCancelled) {
                        updateProgress(progressPanel, i + 1, pageFiles.length, '',
                            `已取消! 成功: ${successCount}, 失败: ${failCount}`, true);
                        return;
                    }

                    // 直接触发下载
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = info.filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);

                    successCount++;
                    updateProgress(progressPanel, i + 1, pageFiles.length, info.filename, '完成');
                } catch (e) {
                    console.error('[超星下载助手] 下载失败:', file.filename, e);
                    failCount++;
                    updateProgress(progressPanel, i + 1, pageFiles.length, file.filename, '失败');
                }

                // 添加延迟避免请求过快，也让浏览器有时间处理下载
                await new Promise(r => setTimeout(r, 800));
            }

            updateProgress(progressPanel, pageFiles.length, pageFiles.length, '',
                `完成! 成功: ${successCount}, 失败: ${failCount}`, true);

        } catch (e) {
            console.error('[超星下载助手] 批量下载错误:', e);
            alert('批量下载出错: ' + e.message);
        } finally {
            batchDownloading = false;
        }
    }

    // 显示进度面板
    function showProgressPanel(total) {
        const existingPanel = document.getElementById('cx-progress-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'cx-progress-panel';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 30px rgba(0,0,0,0.3);
            z-index: 1000000;
            width: 400px;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        panel.innerHTML = `
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">批量下载进度</div>
            <div id="cx-progress-bar-container" style="background: #eee; border-radius: 10px; height: 20px; overflow: hidden; margin-bottom: 10px;">
                <div id="cx-progress-bar" style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: 0%; transition: width 0.3s;"></div>
            </div>
            <div id="cx-progress-text" style="font-size: 13px; color: #666;">准备中...</div>
            <div id="cx-progress-file" style="font-size: 12px; color: #999; margin-top: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></div>
            <button id="cx-cancel-btn" style="margin-top: 15px; padding: 8px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">取消下载</button>
        `;
        document.body.appendChild(panel);

        // 绑定取消按钮事件
        const cancelBtn = panel.querySelector('#cx-cancel-btn');
        cancelBtn.onclick = () => {
            batchDownloadCancelled = true;
            cancelBtn.disabled = true;
            cancelBtn.textContent = '正在取消...';
            cancelBtn.style.background = '#999';
        };

        return panel;
    }

    // 更新进度
    function updateProgress(panel, current, total, filename, status, done = false) {
        const bar = panel.querySelector('#cx-progress-bar');
        const text = panel.querySelector('#cx-progress-text');
        const fileEl = panel.querySelector('#cx-progress-file');

        const percent = Math.round((current / total) * 100);
        bar.style.width = percent + '%';
        text.textContent = `${current}/${total} - ${status}`;
        fileEl.textContent = filename;

        if (done) {
            // 隐藏取消按钮
            const cancelBtn = panel.querySelector('#cx-cancel-btn');
            if (cancelBtn) {
                cancelBtn.style.display = 'none';
            }
            setTimeout(() => {
                panel.innerHTML += `<button id="cx-close-progress" style="margin-top: 15px; padding: 8px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; width: 100%;">关闭</button>`;
                panel.querySelector('#cx-close-progress').onclick = () => panel.remove();
            }, 500);
        }
    }

    // 创建下载按钮
    function createDownloadButton() {
        const btn = document.createElement('div');
        btn.id = 'cx-download-btn';
        btn.innerHTML = '📥 下载';
        btn.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            z-index: 999999;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            user-select: none;
        `;
        btn.onmouseover = () => btn.style.background = '#45a049';
        btn.onmouseout = () => btn.style.background = '#4CAF50';
        btn.onclick = showDownloadPanel;
        document.body.appendChild(btn);

        // 添加数量徽章
        const badge = document.createElement('span');
        badge.id = 'cx-download-badge';
        badge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            display: none;
        `;
        btn.style.position = 'fixed';
        btn.appendChild(badge);
    }

    // 更新徽章数量
    function updateBadge() {
        const badge = document.getElementById('cx-download-badge');
        if (badge) {
            if (downloadList.length > 0) {
                badge.textContent = downloadList.length;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    // 显示下载面板
    function showDownloadPanel() {
        // 移除已存在的面板
        const existingPanel = document.getElementById('cx-download-panel');
        if (existingPanel) {
            existingPanel.remove();
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'cx-download-panel';
        panel.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 80px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 999998;
            width: 320px;
            max-height: 400px;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px;
            background: ${PAGE_TYPE.COURSEDATA ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#4CAF50'};
            color: white;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `<span>${PAGE_TYPE.COURSEDATA ? '批量下载' : '捕获下载'}</span>`;
        panel.appendChild(header);

        // coursedata 页面：只显示批量下载
        if (PAGE_TYPE.COURSEDATA) {
            const batchArea = document.createElement('div');
            batchArea.style.cssText = `
                padding: 15px;
            `;
            const pageFiles = scanPageFiles();
            batchArea.innerHTML = `
                <div style="font-size: 13px; color: #666; margin-bottom: 12px; text-align: center;">
                    页面检测到 <strong style="color: #667eea; font-size: 18px;">${pageFiles.length}</strong> 个文件
                </div>
                <button id="cx-batch-download-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: bold;
                    transition: transform 0.2s, box-shadow 0.2s;
                ">
                    批量下载
                </button>
            `;
            panel.appendChild(batchArea);

            // 绑定批量下载事件
            setTimeout(() => {
                const batchBtn = document.getElementById('cx-batch-download-btn');
                if (batchBtn) {
                    batchBtn.onmouseover = () => {
                        batchBtn.style.transform = 'scale(1.02)';
                        batchBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    };
                    batchBtn.onmouseout = () => {
                        batchBtn.style.transform = 'scale(1)';
                        batchBtn.style.boxShadow = 'none';
                    };
                    batchBtn.onclick = () => {
                        panel.remove();
                        batchDownload();
                    };
                }
            }, 0);
        }

        // modules 页面：只显示捕获的文件列表
        if (PAGE_TYPE.MODULES) {
            const content = document.createElement('div');
            content.style.cssText = `
                max-height: 300px;
                overflow-y: auto;
                padding: 10px;
            `;

            if (downloadList.length === 0) {
                content.innerHTML = `
                    <div style="padding: 30px 15px; text-align: center; color: #999;">
                        <div style="font-size: 40px; margin-bottom: 10px;">📭</div>
                        <div style="font-size: 13px;">暂无已捕获文件</div>
                        <div style="font-size: 11px; margin-top: 5px;">浏览文档时会自动捕获下载链接</div>
                    </div>
                `;
            } else {
                downloadList.forEach((item) => {
                    const fileItem = document.createElement('div');
                    fileItem.style.cssText = `
                        padding: 10px;
                        border-bottom: 1px solid #eee;
                        cursor: pointer;
                        transition: background 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    `;
                    fileItem.onmouseover = () => fileItem.style.background = '#f5f5f5';
                    fileItem.onmouseout = () => fileItem.style.background = 'white';

                    const icon = item.filename.endsWith('.pdf') ? '📄' : '📝';
                    fileItem.innerHTML = `
                        <span style="font-size: 20px;">${icon}</span>
                        <div style="flex: 1; overflow: hidden;">
                            <div style="font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                ${item.filename}
                            </div>
                            <div style="font-size: 11px; color: #999;">
                                ${formatSize(item.length)}
                            </div>
                        </div>
                        <span style="color: #4CAF50; font-size: 18px;">⬇</span>
                    `;

                    fileItem.onclick = () => {
                        downloadFile(item.download, item.filename);
                    };

                    content.appendChild(fileItem);
                });
            }

            panel.appendChild(content);
        }

        // 关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            color: white;
            font-size: 18px;
        `;
        closeBtn.textContent = '✕';
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            panel.remove();
        };
        panel.appendChild(closeBtn);

        document.body.appendChild(panel);
    }

    // 格式化文件大小
    function formatSize(bytes) {
        if (!bytes) return '未知大小';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // 下载文件
    function downloadFile(url, filename) {
        console.log('[超星下载助手] 开始下载:', filename, url);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            headers: {
                'Referer': location.href
            },
            onload: function(response) {
                if (response.status === 200) {
                    // 创建 blob 并下载
                    const blob = response.response;
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                    console.log('[超星下载助手] 下载完成:', filename);
                } else {
                    console.error('[超星下载助手] 下载失败:', response.status);
                    alert('下载失败: ' + response.status + '\n尝试使用 window.open 方式...');
                    window.open(url);
                }
            },
            onerror: function(error) {
                console.error('[超星下载助手] 请求错误:', error);
                alert('请求错误，尝试使用 window.open 方式...');
                window.open(url);
            }
        });
    }

    // 处理捕获到的响应数据
    function handleResponse(data, url) {
        try {
            if (data && data.status === 'success' && data.download) {
                // 检查是否已存在
                const exists = downloadList.some(item => item.objectid === data.objectid);
                if (!exists) {
                    downloadList.push({
                        filename: data.filename || '未知文件',
                        download: data.download,
                        pdf: data.pdf,
                        length: data.length,
                        objectid: data.objectid
                    });
                    updateBadge();
                    console.log('[超星下载助手] 捕获到文件:', data.filename);
                }
            }
        } catch (e) {
            // 忽略解析错误
        }
    }

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        const url = args[0]?.url || args[0];

        if (typeof url === 'string' && url.includes('/ananas/status/')) {
            try {
                const clone = response.clone();
                const data = await clone.json();
                handleResponse(data, url);
            } catch (e) {
                // 忽略错误
            }
        }

        return response;
    };

    // 拦截 XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            if (this._url && this._url.includes('/ananas/status/')) {
                try {
                    const data = JSON.parse(this.responseText);
                    handleResponse(data, this._url);
                } catch (e) {
                    // 忽略错误
                }
            }
        });
        return originalXHRSend.apply(this, args);
    };

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDownloadButton);
    } else {
        createDownloadButton();
    }

    console.log('[超星下载助手] 已启动，等待捕获文档...');
})();
