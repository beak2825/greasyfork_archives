// ==UserScript==
// @name         Seedhub-网盘二维码解析与检测
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解析二维码获取链接，可检测分享链接状态并获取文件列表
// @author       PM
// @match        https://www.seedhub.cc/link_start/*
// @icon         https://sh1.pcie.pppoe.top/static/img/favicon.ico
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @connect      pan.quark.cn
// @connect      drive-h.quark.cn
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563592/Seedhub-%E7%BD%91%E7%9B%98%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%A7%A3%E6%9E%90%E4%B8%8E%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563592/Seedhub-%E7%BD%91%E7%9B%98%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%A7%A3%E6%9E%90%E4%B8%8E%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .seedhub-quark-panel {
            margin: 20px auto;
            max-width: 800px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .seedhub-quark-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
        }
        .seedhub-quark-title {
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .seedhub-quark-status {
            font-size: 12px;
            padding: 4px 12px;
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
        }
        .seedhub-quark-content {
            padding: 24px;
        }
        .seedhub-quark-loading {
            text-align: center;
            padding: 30px;
            color: #666;
        }
        .seedhub-quark-spinner {
            display: inline-block;
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: seedhub-spin 1s linear infinite;
            margin-bottom: 15px;
        }
        @keyframes seedhub-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .seedhub-quark-success {
            color: #52c41a;
            padding: 12px;
            background: #f6ffed;
            border: 1px solid #b7eb8f;
            border-radius: 6px;
            margin-bottom: 16px;
        }
        .seedhub-quark-error {
            color: #ff4d4f;
            padding: 12px;
            background: #fff2f0;
            border: 1px solid #ffccc7;
            border-radius: 6px;
            margin-bottom: 16px;
        }
        .seedhub-quark-folder {
            margin: 4px 0;
        }
        .seedhub-quark-folder-header {
            padding: 10px 16px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s;
        }
        .seedhub-quark-folder-header:hover {
            background: #e9ecef;
        }
        .seedhub-quark-folder-header.open {
            background: #e7f3ff;
            border-color: #91d5ff;
        }
        .seedhub-quark-folder-toggle {
            margin-right: 8px;
            font-size: 12px;
            color: #666;
            transition: transform 0.2s;
            width: 14px;
            text-align: center;
        }
        .seedhub-quark-folder-toggle.open {
            transform: rotate(90deg);
        }
        .seedhub-quark-folder-icon {
            margin-right: 8px;
            color: #ffa500;
        }
        .seedhub-quark-folder-name {
            flex: 1;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }
        .seedhub-quark-folder-count {
            font-size: 12px;
            color: #666;
            background: white;
            padding: 2px 8px;
            border-radius: 10px;
            margin-left: 8px;
        }
        .seedhub-quark-folder-content {
            margin-left: 24px;
            padding-left: 12px;
            border-left: 2px dashed #dee2e6;
            display: none;
        }
        .seedhub-quark-folder-content.open {
            display: block;
        }
        .seedhub-quark-file-list {
            margin-top: 8px;
        }
        .seedhub-quark-file-item {
            padding: 8px 16px;
            margin: 4px 0;
            background: white;
            border: 1px solid #f0f0f0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            transition: all 0.2s;
        }
        .seedhub-quark-file-item:hover {
            background: #f8f9fa;
        }
        .seedhub-quark-file-icon {
            margin-right: 10px;
            color: #666;
            font-size: 14px;
            min-width: 20px;
        }
        .seedhub-quark-file-name {
            flex: 1;
            font-size: 14px;
            color: #333;
            word-break: break-all;
        }
        .seedhub-quark-file-size {
            margin-left: 12px;
            color: #666;
            font-size: 12px;
            white-space: nowrap;
        }
        .seedhub-quark-empty-folder {
            padding: 20px;
            text-align: center;
            color: #999;
            font-style: italic;
            font-size: 14px;
        }
        .seedhub-quark-loading-subfolder {
            padding: 10px 16px;
            color: #999;
            font-size: 12px;
            display: flex;
            align-items: center;
        }
        .seedhub-quark-loading-subfolder::before {
            content: "⟳";
            margin-right: 8px;
            animation: seedhub-spin 1s linear infinite;
            font-size: 10px;
        }
        .seedhub-quark-actions {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        .seedhub-quark-btn {
            padding: 8px 24px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .seedhub-quark-btn-primary {
            background: #1890ff;
            color: white;
        }
        .seedhub-quark-btn-primary:hover {
            background: #40a9ff;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(24,144,255,0.3);
        }
        .seedhub-quark-info {
            margin: 12px 0;
            padding: 12px;
            background: #e6f7ff;
            border: 1px solid #91d5ff;
            border-radius: 6px;
            color: #006d75;
        }
        .seedhub-quark-stats {
            margin-bottom: 12px;
            padding-left: 10px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 13px;
            color: #666;
        }
        #seedhub-control-panel {
            margin-top: 20px;
            padding: 18px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            font-family: -apple-system, system-ui, sans-serif;
        }
        
        .seedhub-btn {
            padding: 11px 22px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-width: 130px;
            user-select: none;
        }
        
        .seedhub-btn-primary {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
        }
        
        .seedhub-btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }
        
        .seedhub-btn-secondary {
            background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
            color: white;
            box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
        }
        
        .seedhub-btn-secondary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
        }
        
        .seedhub-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
        
        #seedhub-cooling {
            font-size: 13px;
            color: #64748b;
            padding: 8px 14px;
            background: #f1f5f9;
            border-radius: 6px;
            display: none;
            align-items: center;
            gap: 8px;
        }
        
        .cooling-spinner {
            width: 14px;
            height: 14px;
            border: 2px solid #64748b;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `);

    async function decodeQRCode(img) {
        return new Promise((resolve) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                resolve(code ? code.data : null);
            } catch (error) {
                resolve(null);
            }
        });
    }

    function extractPwdId(url) {
        const match = url.match(/pan\.quark\.cn\/s\/([a-f0-9]+)/);
        return match ? match[1] : null;
    }

    async function getShareToken(pwdId, passcode = '') {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://drive-h.quark.cn/1/clouddrive/share/sharepage/token?pr=ucpro&fr=pc&uc_param_str=',
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Origin': 'https://pan.quark.cn',
                    'Referer': 'https://pan.quark.cn/'
                },
                data: JSON.stringify({
                    "pwd_id": pwdId,
                    "passcode": passcode,
                    "support_visit_limit_private_share": true
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data && data.data.stoken) {
                            resolve({
                                success: true,
                                stoken: data.data.stoken,
                                title: data.data.title || '',
                                expired_at: data.data.expired_at || 0
                            });
                        } else {
                            resolve({
                                success: false,
                                error: data.message || '获取token失败'
                            });
                        }
                    } catch {
                        resolve({
                            success: false,
                            error: '解析响应失败'
                        });
                    }
                },
                onerror: function() {
                    resolve({
                        success: false,
                        error: '网络请求失败'
                    });
                },
                ontimeout: function() {
                    resolve({
                        success: false,
                        error: '请求超时'
                    });
                }
            });
        });
    }

    async function getFolderContents(stoken, pwdId, pdirFid = '0', folderName = '') {
        return new Promise((resolve) => {
            const url = `https://drive-h.quark.cn/1/clouddrive/share/sharepage/detail?pr=ucpro&fr=pc&uc_param_str=&ver=2&pwd_id=${pwdId}&stoken=${encodeURIComponent(stoken)}&pdir_fid=${pdirFid}&_page=1&_size=50&_fetch_total=1`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json, text/plain, */*',
                    'Referer': 'https://pan.quark.cn/'
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === 0 && data.data && data.data.list) {
                            const result = {
                                success: true,
                                folderName: folderName,
                                fid: pdirFid,
                                items: [],
                                subfolders: []
                            };
                            
                            data.data.list.forEach(item => {
                                const itemInfo = {
                                    name: item.file_name,
                                    is_dir: item.dir === true,
                                    size: item.size || 0,
                                    fid: item.fid,
                                    include_items: item.include_items || 0
                                };
                                
                                if (itemInfo.is_dir) {
                                    result.subfolders.push(itemInfo);
                                } else {
                                    result.items.push(itemInfo);
                                }
                            });
                            resolve(result);
                        } else {
                            resolve({
                                success: false,
                                error: data.message || '获取文件夹内容失败'
                            });
                        }
                    } catch {
                        resolve({
                            success: false,
                            error: '解析响应失败'
                        });
                    }
                },
                onerror: function() {
                    resolve({
                        success: false,
                        error: '网络请求失败'
                    });
                },
                ontimeout: function() {
                    resolve({
                        success: false,
                        error: '请求超时'
                    });
                }
            });
        });
    }

    function createResultPanel() {
        const panel = document.createElement('div');
        panel.className = 'seedhub-quark-panel';
        
        panel.innerHTML = `
            <div class="seedhub-quark-header">
                <div class="seedhub-quark-title">
                    <span>网盘链接检测</span>
                    <div class="seedhub-quark-status">检测中...</div>
                </div>
            </div>
            <div class="seedhub-quark-content">
                <div class="seedhub-quark-loading">
                    <div class="seedhub-quark-spinner"></div>
                    <div>正在检测分享链接...</div>
                </div>
            </div>
        `;
        
        return panel;
    }

    function updateResultPanel(panel, result) {
        const headerStatus = panel.querySelector('.seedhub-quark-status');
        
        if (result.status === 'valid') {
            if (headerStatus) headerStatus.textContent = '链接有效';
        } else if (result.status === 'invalid') {
            if (headerStatus) headerStatus.textContent = '已失效';
            const contentDiv = panel.querySelector('.seedhub-quark-content');
            if (contentDiv) {
                contentDiv.innerHTML = `
                    <div class="seedhub-quark-error">
                        <strong>❌ 分享链接已失效</strong>
                        <div style="margin-top: 8px; font-size: 14px;">
                            ${result.error || '该分享已过期或不存在'}
                        </div>
                    </div>
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${result.url}" target="_blank" 
                        class="seedhub-quark-btn seedhub-quark-btn-primary"
                        style="text-decoration: none; display: inline-block;">
                            🔗 打开链接
                        </a>
                    </div>
                `;
            }
        } else {
            if (headerStatus) headerStatus.textContent = '检测失败';
            const contentDiv = panel.querySelector('.seedhub-quark-content');
            if (contentDiv) {
                contentDiv.innerHTML = `
                    <div class="seedhub-quark-error">
                        <strong>⚠️ 检测失败</strong>
                        <div style="margin-top: 8px; font-size: 14px;">
                            ${result.error || '未知错误'}
                        </div>
                    </div>
                    <div style="margin-top: 20px; text-align: center;">
                        <a href="${result.url}" target="_blank" 
                        class="seedhub-quark-btn seedhub-quark-btn-primary"
                        style="text-decoration: none; display: inline-block;">
                            🔗 打开链接
                        </a>
                    </div>
                `;
            }
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function createFolderElement(folderData, getSubfolderCallback) {
        const folderDiv = document.createElement('div');
        folderDiv.className = 'seedhub-quark-folder';
        
        const isOpen = folderData.items.length > 0 || folderData.subfolders.length > 0;
        
        const folderHeader = document.createElement('div');
        folderHeader.className = `seedhub-quark-folder-header ${isOpen ? 'open' : ''}`;
        
        const toggleSpan = document.createElement('span');
        toggleSpan.className = `seedhub-quark-folder-toggle ${isOpen ? 'open' : ''}`;
        toggleSpan.textContent = '▶';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'seedhub-quark-folder-icon';
        iconSpan.textContent = '📁';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'seedhub-quark-folder-name';
        nameSpan.textContent = folderData.folderName;
        
        const countSpan = document.createElement('span');
        countSpan.className = 'seedhub-quark-folder-count';
        const fileCount = folderData.items.length;
        const folderCount = folderData.subfolders.length;
        let countText = '';
        if (fileCount > 0 && folderCount > 0) {
            countText = `${fileCount}文件 ${folderCount}文件夹`;
        } else if (fileCount > 0) {
            countText = `${fileCount}文件`;
        } else if (folderCount > 0) {
            countText = `${folderCount}文件夹`;
        } else {
            countText = '空';
        }
        countSpan.textContent = countText;
        
        folderHeader.appendChild(toggleSpan);
        folderHeader.appendChild(iconSpan);
        folderHeader.appendChild(nameSpan);
        folderHeader.appendChild(countSpan);
        
        const folderContent = document.createElement('div');
        folderContent.className = `seedhub-quark-folder-content ${isOpen ? 'open' : ''}`;
        
        if (folderData.items.length > 0) {
            const sortedItems = [...folderData.items].sort((a, b) => a.name.localeCompare(b.name));
            
            const fileListDiv = document.createElement('div');
            fileListDiv.className = 'seedhub-quark-file-list';
            fileListDiv.style.maxHeight = '200px';
            fileListDiv.style.overflowY = 'auto';
            fileListDiv.style.marginTop = '8px';
            
            sortedItems.forEach(item => {
                const fileItem = document.createElement('div');
                fileItem.className = 'seedhub-quark-file-item';
                fileItem.innerHTML = `
                    <div class="seedhub-quark-file-icon">📄</div>
                    <div class="seedhub-quark-file-name">${item.name}</div>
                    ${item.size > 0 ? `<div class="seedhub-quark-file-size">${formatFileSize(item.size)}</div>` : ''}
                `;
                fileListDiv.appendChild(fileItem);
            });
            
            folderContent.appendChild(fileListDiv);
        }

        if (folderData.subfolders.length > 0) {
            const sortedSubfolders = [...folderData.subfolders].sort((a, b) => a.name.localeCompare(b.name));
            
            sortedSubfolders.forEach(subfolder => {
                const placeholderDiv = document.createElement('div');
                placeholderDiv.className = 'seedhub-quark-subfolder-placeholder';
                placeholderDiv.setAttribute('data-fid', subfolder.fid);
                placeholderDiv.setAttribute('data-name', subfolder.name);
                folderContent.appendChild(placeholderDiv);
            });
        }
        
        if (folderData.items.length === 0 && folderData.subfolders.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'seedhub-quark-empty-folder';
            emptyDiv.textContent = '空文件夹';
            folderContent.appendChild(emptyDiv);
        }
        
        folderHeader.addEventListener('click', async () => {
            const isCurrentlyOpen = folderHeader.classList.contains('open');
            folderHeader.classList.toggle('open', !isCurrentlyOpen);
            toggleSpan.classList.toggle('open', !isCurrentlyOpen);
            folderContent.classList.toggle('open', !isCurrentlyOpen);
            
            if (!isCurrentlyOpen && folderData.subfolders.length > 0) {
                const placeholders = folderContent.querySelectorAll('.seedhub-quark-subfolder-placeholder');
                placeholders.forEach(async (placeholder) => {
                    const fid = placeholder.getAttribute('data-fid');
                    const name = placeholder.getAttribute('data-name');
                    
                    const subfolderData = await getSubfolderCallback(fid, name);
                    
                    if (subfolderData.success) {
                        const subfolderElement = createFolderElement(subfolderData, getSubfolderCallback);
                        placeholder.replaceWith(subfolderElement);
                    }
                });
            }
        });
        
        folderDiv.appendChild(folderHeader);
        folderDiv.appendChild(folderContent);
        
        if (isOpen && folderData.subfolders.length > 0) {
            setTimeout(async () => {
                const placeholders = folderContent.querySelectorAll('.seedhub-quark-subfolder-placeholder');
                for (const placeholder of placeholders) {
                    const fid = placeholder.getAttribute('data-fid');
                    const name = placeholder.getAttribute('data-name');
                    
                    const subfolderData = await getSubfolderCallback(fid, name);
                    
                    if (subfolderData.success) {
                        const subfolderElement = createFolderElement(subfolderData, getSubfolderCallback);
                        placeholder.replaceWith(subfolderElement);
                    }
                }
            }, 100);
        }
        
        return folderDiv;
    }

    async function processQrCode() {
        const mobilePan = document.querySelector('.mobile-pan');
        if (!mobilePan) return;

        const img = document.querySelector('#qrcode img');
        if (!img) return;
        
        if (!img.complete) {
            await new Promise(resolve => img.onload = resolve);
        }
        
        const url = await decodeQRCode(img);
        return url;
    }

    async function checkQuarkLink(url) {
        const pwdId = extractPwdId(url);
        if (!pwdId) return null;
        
        const urlObj = new URL(url);
        const passcode = urlObj.searchParams.get('pwd');

        const resultPanel = createResultPanel();
        const controlPanel = document.getElementById('seedhub-control-panel');
        controlPanel.insertAdjacentElement('afterend', resultPanel);
        
        try {
            const tokenResult = await getShareToken(pwdId, passcode);
            
            if (!tokenResult.success) {
                updateResultPanel(resultPanel, {
                    status: 'invalid',
                    error: tokenResult.error,
                    url: url
                });
                return;
            }
            
            const rootFolder = await getFolderContents(tokenResult.stoken, pwdId, '0');
            
            if (!rootFolder.success) {
                updateResultPanel(resultPanel, {
                    status: 'error',
                    error: rootFolder.error,
                    url: url
                });
                return;
            }
            
            const getSubfolderCallback = async (fid, folderName) => {
                return await getFolderContents(tokenResult.stoken, pwdId, fid, folderName);
            };
            
            const headerStatus = resultPanel.querySelector('.seedhub-quark-status');
            if (headerStatus) headerStatus.textContent = '链接有效';
            
            const contentDiv = resultPanel.querySelector('.seedhub-quark-content');
            if (contentDiv) {
                contentDiv.innerHTML = '';
                const statsDiv = document.createElement('div');
                statsDiv.className = 'seedhub-quark-stats';
                statsDiv.style.display = 'flex';
                statsDiv.style.justifyContent = 'space-between';
                statsDiv.style.alignItems = 'center';
                
                const statsText = document.createElement('div');
                statsText.textContent = '分享内容';
                statsDiv.appendChild(statsText);
                
                const linkBtn = document.createElement('button');
                linkBtn.className = 'seedhub-quark-btn seedhub-quark-btn-primary';
                linkBtn.innerHTML = '🔗 访问分享链接';
                linkBtn.onclick = () => window.open(url, '_blank');
                statsDiv.appendChild(linkBtn);
                
                contentDiv.appendChild(statsDiv);
                
                if (rootFolder.subfolders.length > 0) {
                    for (const folder of rootFolder.subfolders) {
                        const displayFolder = await getFolderContents(tokenResult.stoken, pwdId, folder.fid, folder.name);
                        if (displayFolder.success) {
                            const folderElement = createFolderElement(displayFolder, getSubfolderCallback);
                            contentDiv.appendChild(folderElement);
                        }
                    }
                } else if (rootFolder.items.length > 0) {
                    const fileListDiv = document.createElement('div');
                    fileListDiv.className = 'seedhub-quark-file-list';
                    rootFolder.items.forEach(item => {
                        const fileItem = document.createElement('div');
                        fileItem.className = 'seedhub-quark-file-item';
                        fileItem.innerHTML = `
                            <div class="seedhub-quark-file-icon">📄</div>
                            <div class="seedhub-quark-file-name">${item.name}</div>
                            ${item.size > 0 ? `<div class="seedhub-quark-file-size">${formatFileSize(item.size)}</div>` : ''}
                        `;
                        fileListDiv.appendChild(fileItem);
                    });
                    contentDiv.appendChild(fileListDiv);
                }
            }
            
        } catch (error) {
            updateResultPanel(resultPanel, {
                status: 'error',
                error: '处理过程发生异常',
                url: url
            });
        }
    }


    function addControlPanel() {
        const mobilePan = document.querySelector('.mobile-pan');
        if (!mobilePan) return;
        
        const controlPanel = document.createElement('div');
        controlPanel.id = 'seedhub-control-panel';
        
        const visitBtn = document.createElement('button');
        visitBtn.id = 'seedhub-visit-btn';
        visitBtn.className = 'seedhub-btn seedhub-btn-primary';
        visitBtn.textContent = '🔗 访问分享';
        
        const checkBtn = document.createElement('button');
        checkBtn.id = 'seedhub-check-btn';
        checkBtn.className = 'seedhub-btn seedhub-btn-secondary';
        checkBtn.textContent = '📋 获取状态';
        
        const coolingDiv = document.createElement('div');
        coolingDiv.id = 'seedhub-cooling';
        
        controlPanel.appendChild(visitBtn);
        controlPanel.appendChild(checkBtn);
        controlPanel.appendChild(coolingDiv);
        
        mobilePan.insertAdjacentElement('afterend', controlPanel);
        
        let isCooling = false;
        const COOLDOWN = 5000;
        let currentUrl = null;
        
        visitBtn.addEventListener('click', async () => {
            if (!currentUrl) {
                const url = await processQrCode();
                if (!url) {
                    alert('未找到有效链接');
                    return;
                }
                currentUrl = url;
            }
            
            if (currentUrl) {
                window.open(currentUrl, '_blank');
            }
        });
        
        checkBtn.addEventListener('click', async () => {
            if (isCooling) {
                alert('请等待5秒后再试');
                return;
            }
            const oldResult = document.querySelector('.seedhub-quark-panel');
            if (oldResult) oldResult.remove();
            
            isCooling = true;
            checkBtn.disabled = true;
            checkBtn.textContent = '检测中';
            coolingDiv.style.display = 'flex';
            
            let remaining = 5;
            const updateCooling = () => {
                coolingDiv.innerHTML = `<span class="cooling-spinner"></span> ${remaining}秒后可再次检测`;
                if (remaining > 0) {
                    remaining--;
                    setTimeout(updateCooling, 1000);
                }
            };
            updateCooling();
            
            try {
                const url = await processQrCode();
                if (url) {
                    currentUrl = url;
                    await checkQuarkLink(url);
                    checkBtn.textContent = '📋 获取状态';
                } else {
                    checkBtn.textContent = '⚠️ 无链接';
                }
            } catch {
                checkBtn.textContent = '❌ 出错';
            } finally {
                setTimeout(() => {
                    isCooling = false;
                    checkBtn.disabled = false;
                    coolingDiv.style.display = 'none';
                }, COOLDOWN);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addControlPanel();
        });
    } else {
        addControlPanel();
    }

})();