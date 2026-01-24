// ==UserScript==
// @name         Y2K Image Uploader
// @namespace    http://tampermonkey.net/
// @version      1.1
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

    // State
    let uploadMode = false;
    let dragCounter = 0; // To handle dragenter/dragleave bubbling
    let autoCloseTimer;

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
    `;

    function injectStyles() {
        if (document.getElementById('y2k-styles')) return;
        const style = document.createElement('style');
        style.id = 'y2k-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
    }

    // --- DOM ELEMENTS ---
    let modalBackdrop, modal, previewImg, modalTitle, modalText, progressBar, progressWrapper;
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

        // Close on backdrop click
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) hideModal();
        });
    }

    // --- MODAL CONTROLS ---
    function showModal(title, text, showProgress = false, imgSrc = null) {
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

        if (showProgress) {
            progressWrapper.style.display = 'block';
            progressBar.style.width = '0%';
        } else {
            progressWrapper.style.display = 'none';
        }
    }

    function updateProgress(percent) {
        progressBar.style.width = `${percent}%`;
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
        const file = files[0];
        if (file.type.indexOf('image') !== -1) {
            uploadImage(file);
        }
    }

    // Paste
    document.addEventListener('paste', (event) => {
        if (!uploadMode) return;
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                event.preventDefault();
                const file = items[i].getAsFile();
                if (file) uploadImage(file);
                return;
            }
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
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    });

    function uploadImage(file) {
        // 1. Show Preview Immediately
        const objUrl = URL.createObjectURL(file);
        showModal('Uploading...', '0%', true, objUrl);

        const token = getStoredToken();
        if (!token) {
            showModal('Auth Required', 'Please set your Token first (Alt + T)', false, null);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        GM_xmlhttpRequest({
            method: 'POST',
            url: UPLOAD_API,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
            upload: {
                onprogress: (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        updateProgress(percent);
                        modalText.textContent = `${percent}%`;
                    }
                }
            },
            onload: function (response) {
                try {
                    const res = JSON.parse(response.responseText);
                    if (res.success && res.data && res.data.url) {
                        let finalUrl = res.data.url;
                        if (finalUrl.startsWith('/')) finalUrl = SERVER_URL + finalUrl;

                        const md = `![Image](${finalUrl})`;

                        // Action
                        GM_setClipboard(md);
                        insertToEditor(md);

                        // Success Modal
                        showModal('Uploaded!', 'Link copied to clipboard.', false, objUrl);

                        // Cleanup
                        setTimeout(() => URL.revokeObjectURL(objUrl), 5000);
                        hideModalDelayed(2500); // Close after 2.5s
                    } else {
                        if (response.status === 401) {
                            showModal('Unauthorized', 'Token invalid or expired. Press Alt+T to reset.', false, null);
                        } else {
                            showModal('Error', res.error || 'Upload failed', false, null);
                        }
                    }
                } catch (e) {
                    if (response.status === 401) {
                        showModal('Unauthorized', 'Token required. Press Alt+T.', false, null);
                    } else {
                        showModal('Error', 'Invalid Server Response', false, null);
                    }
                }
            },
            onerror: function (err) {
                showModal('Network Error', 'Check console', false, null);
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