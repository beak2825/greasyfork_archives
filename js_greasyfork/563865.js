// ==UserScript==
// @name         Y2K Image Uploader
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Paste or Drag images to upload to your Y2K VPS and get Markdown links immediately.
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563865/Y2K%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/563865/Y2K%20Image%20Uploader.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Config - Change this to your VPS Domain
    const SERVER_URL = 'https://y2k.zrn.qzz.io';
    const UPLOAD_API = `${SERVER_URL}/api/images`;
    const BATCH_UPLOAD_API = `${SERVER_URL}/api/images/batch`;

    // State
    let uploadMode = false;
    let dragCounter = 0; // To handle dragenter/dragleave bubbling
    let autoCloseTimer;
    let pendingFiles = []; // Track files being uploaded
    let uploadResults = [];

    // --- AUTH HELPERS ---
    function getStoredToken() {
        return GM_getValue('y2k_token', '');
    }

    function setStoredToken(token) {
        GM_setValue('y2k_token', token.trim());
    }

    function promptToken() {
        const currentToken = getStoredToken();
        const newToken = prompt('Please enter your Supabase Auth Token (sb-access-token from your site storage):', currentToken);
        if (newToken !== null) {
            setStoredToken(newToken);
            if (newToken) {
                GM_notification({ text: 'Token saved!', title: 'Y2K Uploader', timeout: 2000 });
            }
        }
    }

    // --- UI & STYLES ---
    const STYLES = `
        /* MODAL SYSTEM */
        .y2k-modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .y2k-modal-backdrop.active {
            opacity: 1;
            pointer-events: auto;
        }
        .y2k-modal {
            background: rgba(20, 20, 20, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            border-radius: 12px;
            width: 320px;
            padding: 24px;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: white;
            font-family: -apple-system, sans-serif;
            position: relative;
        }
        .y2k-modal-backdrop.active .y2k-modal {
            transform: scale(1);
        }
        .y2k-preview-img {
            max-width: 100%;
            max-height: 150px;
            border-radius: 8px;
            margin-bottom: 16px;
            object-fit: contain;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: none;
        }
        .y2k-preview-img.show {
            display: block;
        }
        .y2k-modal-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        .y2k-modal-text {
            font-size: 14px;
            color: #aaa;
            margin-bottom: 16px;
            word-break: break-all;
        }
        /* PROGRESS BAR */
        .y2k-progress-wrapper {
            height: 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            margin: 10px 0;
            overflow: hidden;
            display: none;
        }
        .y2k-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #1890ff, #52c41a);
            width: 0%;
            transition: width 0.2s;
        }
        /* STATUS PILL (Mini) */
        .y2k-mini-stat {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            z-index: 999999;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            display: none;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .y2k-mini-stat.visible {
            display: block;
        }
        .y2k-mini-stat.active {
            opacity: 1;
            border-color: #52c41a;
            color: #52c41a;
        }
        /* BATCH UPLOAD LIST */
        .y2k-file-list {
            max-height: 200px;
            overflow-y: auto;
            margin: 12px 0;
            text-align: left;
        }
        .y2k-file-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 8px;
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
            margin-bottom: 6px;
            font-size: 12px;
        }
        .y2k-file-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .y2k-file-status {
            width: 14px;
            height: 14px;
            flex-shrink: 0;
        }
        .y2k-file-status.pending {
            width: 14px;
            height: 14px;
            border: 1px solid #666;
            border-radius: 50%;
        }
        .y2k-file-status.uploading {
            border: 2px solid #1890ff;
            border-top-color: transparent;
            border-radius: 50%;
            animation: y2k-spin 1s linear infinite;
        }
        .y2k-file-status.success {
            color: #4ade80;
        }
        .y2k-file-status.error {
            color: #ef4444;
        }
        @keyframes y2k-spin {
            to { transform: rotate(360deg); }
        }
        .y2k-summary {
            font-size: 11px;
            color: #aaa;
            margin-top: 8px;
        }
        .y2k-summary-text {
            color: #4ade80;
        }
        .y2k-summary-error {
            color: #ef4444;
        }
    `;

    function injectStyles() {
        if (document.getElementById('y2k-styles')) return;
        const style = document.createElement('style');
        style.id = 'y2k-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    // --- DOM ELEMENTS ---
    let modalBackdrop, modal, previewImg, modalTitle, modalText, progressBar, progressWrapper, fileListContainer, summaryText;
    let miniStat;

    function initUI() {
        injectStyles();

        // 1. Mini Status Indicator
        miniStat = document.createElement('div');
        miniStat.className = 'y2k-mini-stat';
        miniStat.innerHTML = '&#9679; Y2K Ready'; // Dot symbol
        document.body.appendChild(miniStat);

        // 2. Modal Structure
        modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'y2k-modal-backdrop';

        modalBackdrop.innerHTML = `
            <div class="y2k-modal">
                <img class="y2k-preview-img" id="y2k-preview">
                <div class="y2k-modal-title" id="y2k-title">Uploading...</div>
                <div class="y2k-modal-text" id="y2k-text">Please wait</div>
                <div class="y2k-progress-wrapper" id="y2k-progress-wrap">
                    <div class="y2k-progress-bar" id="y2k-progress"></div>
                </div>
                <div class="y2k-file-list" id="y2k-file-list"></div>
                <div class="y2k-summary" id="y2k-summary"></div>
            </div>
        `;
        document.body.appendChild(modalBackdrop);

        // Bind Elements
        modal = modalBackdrop.querySelector('.y2k-modal');
        previewImg = modalBackdrop.querySelector('#y2k-preview');
        modalTitle = modalBackdrop.querySelector('#y2k-title');
        modalText = modalBackdrop.querySelector('#y2k-text');
        progressWrapper = modalBackdrop.querySelector('#y2k-progress-wrap');
        progressBar = modalBackdrop.querySelector('#y2k-progress');
        fileListContainer = modalBackdrop.querySelector('#y2k-file-list');
        summaryText = modalBackdrop.querySelector('#y2k-summary');

        // Close on backdrop click
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) hideModal();
        });
    }

    // --- MODAL CONTROLS ---
    function showModal(title, text, showProgress = false, imgSrc = null, showFileList = false) {
        clearTimeout(autoCloseTimer);
        modalBackdrop.classList.add('active');

        modalTitle.textContent = title;
        modalText.innerHTML = text;

        if (imgSrc) {
            previewImg.src = imgSrc;
            previewImg.classList.add('show');
        } else {
            previewImg.classList.remove('show');
            previewImg.src = '';
        }

        if (showFileList) {
            progressWrapper.style.display = 'none';
            previewImg.classList.remove('show');
            fileListContainer.style.display = 'block';
        } else if (showProgress) {
            progressWrapper.style.display = 'block';
            progressBar.style.width = '0%';
            fileListContainer.style.display = 'none';
        } else {
            progressWrapper.style.display = 'none';
            fileListContainer.style.display = 'none';
        }
    }

    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
    }

    // Update file list display
    function updateFileList(files) {
        fileListContainer.innerHTML = '';
        files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'y2k-file-item';

            let statusHtml = '';
            if (file.status === 'pending') {
                statusHtml = '<div class="y2k-file-status pending"></div>';
            } else if (file.status === 'uploading') {
                statusHtml = '<div class="y2k-file-status uploading"></div>';
            } else if (file.status === 'success') {
                statusHtml = '<svg class="y2k-file-status success" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 17"></polyline><path d="m1 12 4-4 4 4 16"></path></svg>';
            } else if (file.status === 'error') {
                statusHtml = '<svg class="y2k-file-status error" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            }

            item.innerHTML = `
                ${statusHtml}
                <div class="y2k-file-name" title="${file.name}">${file.name}</div>
                <div class="y2k-file-size">${formatFileSize(file.size)}</div>
            `;
            fileListContainer.appendChild(item);
        });
    }

    function updateSummary(summary) {
        let html = '';
        if (summary.uploaded > 0) {
            html += `<span class="y2k-summary-text">✓ ${summary.uploaded} 上传成功</span>`;
        }
        if (summary.failed > 0) {
            html += ` <span class="y2k-summary-error">✗ ${summary.failed} 失败</span>`;
        }
        if (summary.copied > 0) {
            html += ` | 已复制 ${summary.copied} 个链接`;
        }
        summaryText.innerHTML = html;
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function hideModal() {
        modalBackdrop.classList.remove('active');
    }

    function hideModalDelayed(delay = 1500) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = setTimeout(() => {
            hideModal();
        }, delay);
    }

    // --- LOGIC ---

    function toggleMode() {
        uploadMode = !uploadMode;
        if (uploadMode) {
            miniStat.classList.add('visible', 'active');
            miniStat.innerHTML = '&#9679; Y2K Upload ON'; // Greenish
            showModal('Y2K Upload Mode', 'Activated<br>Paste or Drop images', false, null);
            hideModalDelayed(1000);
        } else {
            miniStat.classList.remove('active');
            miniStat.innerHTML = '&#9675; Y2K Upload OFF';
            setTimeout(() => miniStat.classList.remove('visible'), 2000);
            hideModal();
        }
    }

    initUI();

    // Key Listener
    document.addEventListener('keydown', (e) => {
        // Alt + U: Toggle Upload Mode
        if (e.altKey && e.code === 'KeyU') {
            toggleMode();
        }
        // Alt + T: Set Token
        if (e.altKey && e.code === 'KeyT') {
            promptToken();
        }
    });

    // Validates files and calls upload
    function handleFiles(files) {
        if (!files || !files.length) return;

        const validFiles = Array.from(files).filter(file => file.type.indexOf('image') !== -1);
        if (validFiles.length === 0) return;

        // Add to pending files with initial status
        pendingFiles = validFiles.map(file => ({
            file,
            status: 'pending'
        }));

        // Show modal with file list
        showModal('批量上传', `准备上传 ${pendingFiles.length} 个文件`, false, null, true);
        updateFileList(pendingFiles);

        // Start batch upload
        uploadBatchImages(pendingFiles);
    }

    // Paste
    document.addEventListener('paste', (event) => {
        if (!uploadMode) return;
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        const files = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                event.preventDefault();
                const file = items[i].getAsFile();
                if (file) files.push(file);
            }
        }
        if (files.length > 0) {
            handleFiles(files);
        }
    });

    // Drag Drop
    // We don't use a full overlay anymore, just the bubbling check
    document.addEventListener('dragover', (e) => {
        if (uploadMode) e.preventDefault();
    });
    document.addEventListener('drop', (e) => {
        if (!uploadMode) return;
        e.preventDefault();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });

    function uploadBatchImages(files) {
        const token = getStoredToken();
        if (!token) {
            showModal('需要认证', '请先设置 Token (Alt + T)', false, null, false);
            return;
        }

        // Mark all as uploading
        files.forEach(f => f.status = 'uploading');
        updateFileList(files);

        const formData = new FormData();
        files.forEach(f => {
            formData.append('images', f.file);
        });

        GM_xmlhttpRequest({
            method: 'POST',
            url: BATCH_UPLOAD_API,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            upload: {
                onprogress: (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        modalText.textContent = `上传中... ${percent}%`;
                    }
                }
            },
            onload: function (response) {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.success) {
                        // Process results
                        const results = res.data || [];
                        const errors = res.errors || [];
                        const summary = res.summary || {};

                        // Update file statuses
                        files.forEach((f, index) => {
                            const result = results.find(r => r.data.name === f.file.name);
                            const error = errors.find(e => e.filename === f.file.name);

                            if (error) {
                                f.status = 'error';
                            } else if (result) {
                                f.status = 'success';
                                f.url = SERVER_URL + result.data.url;
                            } else {
                                f.status = 'error';
                            }
                        });

                        updateFileList(files);

                        // Copy all successful URLs to clipboard
                        const successful = files.filter(f => f.status === 'success');
                        const markdownLinks = successful.map(f => `![${f.file.name}](${f.url})`).join('\n');
                        GM_setClipboard(markdownLinks);

                        // Insert into editor if available (always insert for batch)
                        if (successful.length >= 1) {
                            insertToEditor(markdownLinks);
                        }

                        // Show summary
                        updateSummary({
                            uploaded: summary.uploaded || 0,
                            failed: summary.failed || 0,
                            copied: successful.length
                        });

                        // Auto-close after success
                        hideModalDelayed(4000);
                    } else {
                        if (response.status === 401) {
                            showModal('认证失败', 'Token 无效或已过期。按 Alt+T 重置。', false, null, false);
                        } else {
                            showModal('错误', res.error || '批量上传失败', false, null, false);
                        }
                    }
                } catch (e) {
                    if (response.status === 401) {
                        showModal('认证失败', '请设置 Token。按 Alt+T。', false, null, false);
                    } else {
                        showModal('错误', '服务器响应无效', false, null, false);
                    }
                }
            },
            onerror: function (err) {
                showModal('网络错误', '请检查控制台', false, null, false);
                files.forEach(f => f.status = 'error');
                updateFileList(files);
            }
        });
    }

    function insertToEditor(md) {
        const cm = document.querySelector('.CodeMirror')?.CodeMirror;
        if (cm) {
            cm.replaceRange(`\n${md}\n`, cm.getCursor());
            return;
        }
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
            if (activeEl.tagName === 'TEXTAREA') {
                const val = activeEl.value;
                const start = activeEl.selectionStart;
                const end = activeEl.selectionEnd;
                activeEl.value = val.substring(0, start) + `\n${md}\n` + val.substring(end);
            } else {
                document.execCommand('insertText', false, `\n${md}\n`);
            }
        }
    }

})();