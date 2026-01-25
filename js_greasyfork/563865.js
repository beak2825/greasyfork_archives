// ==UserScript==
// @name         Y2K Image Uploader
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Paste or Drag images to upload to your Y2K VPS and get Markdown links immediately.
// @author       You
// @match        *://www.nodeseek.com/*
// @match        *://nodeseek.com/*
// @match        *://y2k.zrn.qzz.io/*
// @match        *://*.y2k.zrn.qzz.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      y2k.zrn.qzz.io
// @connect      api.y2k.zrn.qzz.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563865/Y2K%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/563865/Y2K%20Image%20Uploader.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // ===== 全局配置 (Global Configuration) =====
    const APP = {
        api: {
            key: GM_getValue('y2k_apiKey', ''),
            setKey: key => {
                GM_setValue('y2k_apiKey', key);
                APP.api.key = key;
                UI.updateState();
            },
            clearKey: () => {
                GM_deleteValue('y2k_apiKey');
                APP.api.key = '';
                UI.updateState();
            },
            endpoints: {
                upload: 'https://y2k.zrn.qzz.io/api/images',
                batchUpload: 'https://y2k.zrn.qzz.io/api/images/batch',
                apiKey: 'https://y2k.zrn.qzz.io/api/auth/user/api-key'
            }
        },
        site: {
            url: 'https://y2k.zrn.qzz.io'
        },
        storage: {
            keys: {
                loginCheck: 'y2k_login_check',
                loginStatus: 'y2k_login_status',
                logout: 'y2k_logout'
            },
            get: key => localStorage.getItem(APP.storage.keys[key]),
            set: (key, value) => localStorage.setItem(APP.storage.keys[key], value),
            remove: key => localStorage.removeItem(APP.storage.keys[key])
        },
        retry: {
            max: 2,
            delay: 1000
        },
        statusTimeout: 2000,
        auth: {
            recentLoginGracePeriod: 30000,
            loginCheckInterval: 3000,
            loginCheckTimeout: 300000
        }
    };

    // State
    let uploadMode = true;
    let dragCounter = 0;
    let autoCloseTimer;
    let pendingFiles = [];
    let uploadResults = [];

    // ===== 工具函数 (Utility Functions) =====
    const Utils = {
        isY2KSite: () => /y2k\.zrn\.qzz\.io$/.test(window.location.hostname),
        delay: ms => new Promise(r => setTimeout(r, ms))
    };

    // ===== API通信 (API Communication) =====
    const API = {
        request: ({ url, method = 'GET', data = null, headers = {}, withAuth = false }) => {
            console.log(`[Y2K] [API] Request: ${method} ${url}`);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method,
                    url,
                    headers: {
                        'Accept': 'application/json',
                        ...(withAuth && APP.api.key ? { 'X-API-Key': APP.api.key } : {}),
                        ...headers
                    },
                    data,
                    withCredentials: true,
                    // 不使用 json 类型，手动解析以防万一
                    onload: response => {
                        console.log(`[Y2K] [API] Response ${response.status} for ${url}`);
                        try {
                            const resData = JSON.parse(response.responseText);
                            if (response.status >= 200 && response.status < 300) {
                                resolve(resData);
                            } else {
                                console.error(`[Y2K] [API] Error status ${response.status}:`, resData);
                                reject(resData);
                            }
                        } catch (e) {
                            console.error(`[Y2K] [API] Parse error for ${url}:`, response.responseText);
                            reject({ error: 'Invalid JSON response' });
                        }
                    },
                    onerror: err => {
                        console.error(`[Y2K] [API] Network Error for ${url}:`, err);
                        reject(err);
                    }
                });
            });
        },

        checkLoginAndGetKey: async () => {
            try {
                // 从 localStorage 获取 Supabase Token
                const projectRef = 'imldlbilfdrorglhpwnh';
                const storageKey = `sb-${projectRef}-auth-token`;
                const fallbackKey = 'sb-access-token';
                const tokenData = localStorage.getItem(storageKey) || localStorage.getItem(fallbackKey);

                if (!tokenData) {
                    return false;
                }

                let token = '';
                try {
                    // Supabase 存储可能是 JSON 字符串
                    const parsed = JSON.parse(tokenData);
                    token = parsed.access_token || parsed;
                } catch (e) {
                    token = tokenData; // 可能是原始字符串
                }

                if (!token) {
                    console.error('[Y2K] Sync Attempt: Extracted token is empty.');
                    return false;
                }

                console.log('[Y2K] Sync Attempt: Requesting API Key...');
                const response = await API.request({
                    url: APP.api.endpoints.apiKey,
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response && response.api_key) {
                    console.log('[Y2K] Sync Attempt: Success! API Key obtained.');
                    APP.api.setKey(response.api_key);
                    return true;
                }

                console.warn('[Y2K] Sync Attempt: API returned success but no key:', response);
                return false;
            } catch (error) {
                console.error('[Y2K] Sync Attempt: Critical error:', error);
                APP.api.clearKey();
                return false;
            }
        }
    };

    // ===== UI与状态管理 (UI & Status Management) =====
    const STATUS = {
        SUCCESS: { class: 'success', color: '#4ade80' },
        ERROR: { class: 'error', color: '#ef4444' },
        WARNING: { class: 'warning', color: '#e6a23c' },
        INFO: { class: 'info', color: '#1890ff' }
    };

    const MESSAGE = {
        READY: 'Y2K已就绪',
        UPLOADING: '正在上传...',
        UPLOAD_SUCCESS: '上传成功！',
        LOGIN_EXPIRED: '登录已失效',
        LOGOUT: '已退出登录',
        RETRY: (current, max) => `重试上传 (${current}/${max})`
    };

    // ===== 认证管理 (Authentication Management) =====
    const Auth = {
        checkLoginIfNeeded: async (forceCheck = false) => {
            if (APP.api.key && !forceCheck) {
                return true;
            }

            const isLoggedIn = await API.checkLoginAndGetKey();

            if (!isLoggedIn && APP.api.key) {
                setStatus(STATUS.WARNING.class, MESSAGE.LOGIN_EXPIRED);
            }

            UI.updateState();

            return isLoggedIn;
        },

        checkLogoutFlag: () => {
            if (APP.storage.get('logout') === 'true') {
                APP.api.clearKey();
                APP.storage.remove('logout');
                setStatus(STATUS.WARNING.class, MESSAGE.LOGOUT);
            }
        },

        checkRecentLogin: async () => {
            const lastLoginCheck = APP.storage.get('loginCheck');
            if (lastLoginCheck && (Date.now() - parseInt(lastLoginCheck) < APP.auth.recentLoginGracePeriod)) {
                await API.checkLoginAndGetKey();
                APP.storage.remove('loginCheck');
            }
        },

        setupStorageListener: () => {
            window.addEventListener('storage', event => {
                const { loginStatus, logout } = APP.storage.keys;

                if (event.key === loginStatus && event.newValue === 'login_success') {
                    API.checkLoginAndGetKey();
                    localStorage.removeItem(loginStatus);
                } else if (event.key === logout && event.newValue === 'true') {
                    APP.api.clearKey();
                    localStorage.removeItem(logout);
                }
            });
        },

        monitorLogout: () => {
            document.addEventListener('click', e => {
                const logoutButton = e.target.closest('#logoutBtn, .logout-btn');
                if (logoutButton || e.target.textContent?.match(/登出|注销|退出|logout|sign out/i)) {
                    APP.storage.set('logout', 'true');
                }
            });
        },

        startLoginStatusCheck: () => {
            const checkLoginInterval = setInterval(async () => {
                try {
                    const isLoggedIn = await API.checkLoginAndGetKey();

                    if (isLoggedIn) {
                        clearInterval(checkLoginInterval);

                        APP.storage.remove('loginStatus');
                        APP.storage.set('loginStatus', 'login_success');
                        APP.storage.set('loginCheck', Date.now().toString());
                    }
                } catch (error) { }
            }, APP.auth.loginCheckInterval);

            setTimeout(() => clearInterval(checkLoginInterval), APP.auth.loginCheckTimeout);
        },

        handleY2KSite: () => {
            console.log('[Y2K] Running on Y2K native site, forcing credentials sync...');
            Auth.checkLoginIfNeeded(true); // Force sync on Y2K site

            // 定期重试，以防 SPA 登录后延迟写入 localStorage
            const syncTimer = setInterval(async () => {
                if (!APP.api.key) {
                    console.log('[Y2K] Retrying credentials sync...');
                    await Auth.checkLoginIfNeeded(true);
                } else {
                    clearInterval(syncTimer);
                }
            }, 5000);

            setTimeout(() => clearInterval(syncTimer), 60000); // 1分钟后停止检查

            Auth.monitorLogout();
        }
    };

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
            background: rgba(20,20,20,0.9);
            color: #fff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 999999;
            opacity: 1;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(8px);
            animation: y2k-float 4s ease-in-out infinite;
        }
        @keyframes y2k-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
        }
        .y2k-mini-stat.success {
            border-color: rgba(74, 222, 128, 0.4);
            color: #4ade80;
        }
        .y2k-mini-stat.error {
            border-color: rgba(239, 68, 68, 0.4);
            color: #ef4444;
        }
        .y2k-mini-stat.warning {
            border-color: rgba(230, 162, 60, 0.4);
            color: #e6a23c;
        }
        .y2k-mini-stat-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: currentColor;
            box-shadow: 0 0 8px currentColor;
            animation: y2k-breathe 2s ease-in-out infinite;
        }
        @keyframes y2k-breathe {
            0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px currentColor; }
            50% { opacity: 0.6; transform: scale(1.2); box-shadow: 0 0 12px currentColor; }
        }
        /* Scanline Effect via Pseudo-element */
        .y2k-mini-stat::after,
        .y2k-modal::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to bottom,
                transparent,
                rgba(255, 255, 255, 0.05) 50%,
                transparent 50%
            );
            background-size: 100% 4px;
            pointer-events: none;
            opacity: 0.15;
            z-index: 1000;
            border-radius: inherit;
            animation: y2k-scan 8s linear infinite;
        }
        @keyframes y2k-scan {
            from { background-position: 0 0; }
            to { background-position: 0 100%; }
        }
        /* Login Button */
        .y2k-login-btn {
            position: fixed;
            bottom: 65px;
            left: 20px;
            cursor: pointer;
            color: #e6a23c;
            font-size: 12px;
            background: rgba(230, 162, 60, 0.1);
            padding: 6px 16px;
            border-radius: 20px;
            border: 1px solid rgba(230, 162, 60, 0.4);
            backdrop-filter: blur(8px);
            z-index: 999999;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .y2k-login-btn:hover {
            background: rgba(230, 162, 60, 0.2);
            transform: translateY(-2px);
        }
        .y2k-login-btn::before {
            content: '🔑';
            font-size: 10px;
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

    const DOM = {
        statusElements: new Set(),
        loginButtons: new Set()
    };

    function setStatus(cls, msg, ttl = 0) {
        DOM.statusElements.forEach(el => {
            el.className = `y2k-mini-stat ${cls}`;
            el.innerHTML = `<div class="y2k-mini-stat-dot"></div><span>${msg}</span>`;
        });
        if (ttl && miniStat) return Utils.delay(ttl).then(UI.updateState);
    }

    const UI = {
        updateState: () => {
            const isLoggedIn = Boolean(APP.api.key);

            DOM.loginButtons.forEach(btn => {
                btn.style.display = isLoggedIn ? 'none' : 'inline-block';
            });

            DOM.statusElements.forEach(el => {
                if (isLoggedIn) {
                    el.className = `y2k-mini-stat ${STATUS.SUCCESS.class}`;
                    el.innerHTML = `<div class="y2k-mini-stat-dot"></div><span>${MESSAGE.READY}</span>`;
                } else {
                    el.className = 'y2k-mini-stat';
                    el.innerHTML = `<div class="y2k-mini-stat-dot" style="background:#666"></div><span>未录入凭据</span>`;
                }
            });
        },

        openLogin: () => {
            APP.storage.set('loginStatus', 'login_pending');
            window.open(APP.site.url, '_blank');
        }
    };

    function initUI() {
        console.log('[Y2K] Initializing UI elements...');
        injectStyles();

        // 1. Mini Status Indicator
        miniStat = document.createElement('div');
        miniStat.className = 'y2k-mini-stat';
        miniStat.innerHTML = '<div class="y2k-mini-stat-dot"></div><span>Initializing...</span>';
        document.body.appendChild(miniStat);
        DOM.statusElements.add(miniStat);

        // 2. Login Button (for toolbar injection)
        const loginBtn = document.createElement('div');
        loginBtn.className = 'y2k-login-btn';
        loginBtn.textContent = '点击登录Y2K';
        loginBtn.addEventListener('click', UI.openLogin);
        loginBtn.style.display = 'none';
        document.body.appendChild(loginBtn);
        DOM.loginButtons.add(loginBtn);

        // 3. Modal Structure
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
                <div class="y2k-file-name" title="${file.file.name}">${file.file.name}</div>
                <div class="y2k-file-size">${formatFileSize(file.file.size)}</div>
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
        console.log('[Y2K] Toggling mode. Previous state:', uploadMode);
        uploadMode = !uploadMode;
        if (uploadMode) {
            setStatus(STATUS.SUCCESS.class, 'Y2K已就绪');
        } else {
            UI.updateState();
            hideModal();
        }
    }

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

    async function uploadBatchImages(files) {
        // 检查 API Key
        if (!APP.api.key || !(await Auth.checkLoginIfNeeded())) {
            showModal('需要认证', '请先登录 Y2K (点击页面左下角按钮)', false, null, false);
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
            url: APP.api.endpoints.batchUpload,
            headers: {
                'X-API-Key': APP.api.key
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
                                f.url = APP.site.url + result.data.url;
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
                            showModal('认证失败', 'API Key 无效或已过期。请重新登录 Y2K。', false, null, false);
                            APP.api.clearKey();
                            UI.updateState();
                        } else {
                            showModal('错误', res.error || '批量上传失败', false, null, false);
                        }
                    }
                } catch (e) {
                    if (response.status === 401) {
                        showModal('认证失败', 'API Key 无效。请重新登录 Y2K。', false, null, false);
                        APP.api.clearKey();
                        UI.updateState();
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

    // ===== 初始化 (Initialization) =====
    const init = async () => {
        // 初始化 UI（确保 DOM 已准备好）
        console.log('[Y2K] Initializing...');
        initUI();

        // （已取消 Alt+U 切换，默认有凭证即开启）

        // 如果在 Y2K 网站，则执行特定的登录/登出辅助逻辑
        if (Utils.isY2KSite()) {
            Auth.handleY2KSite();
        } else {
            // 在其他网站上的核心初始化流程
            // 页面重新获得焦点时，检查登录状态
            window.addEventListener('focus', () => Auth.checkLoginIfNeeded());

            // 监听粘贴和拖拽事件
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
            const handleDragEvent = (e) => {
                if (!uploadMode) return;

                // Check if it's a file drag
                const isFile = e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files');
                if (!isFile) return;

                e.preventDefault();
                e.stopImmediatePropagation();

                if (e.type === 'dragover') {
                    e.dataTransfer.dropEffect = 'copy';
                }

                if (e.type === 'drop') {
                    console.log('[Y2K] File dropped successfully.');
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFiles(e.dataTransfer.files);
                    }
                }
            };

            document.addEventListener('dragenter', handleDragEvent, true);
            document.addEventListener('dragover', handleDragEvent, true);
            document.addEventListener('drop', handleDragEvent, true);
        }

        // 启动时执行认证状态检查（所有网站都执行）
        Auth.checkLogoutFlag();
        Auth.setupStorageListener();
        await Auth.checkRecentLogin();
        await Auth.checkLoginIfNeeded();

        // 更新 UI 状态
        UI.updateState();
        console.log('[Y2K] Initialization complete.');
    };

    // 使用 DOMContentLoaded 而不是 load，确保更早执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM 已经加载完成，直接执行
        init();
    }

})();