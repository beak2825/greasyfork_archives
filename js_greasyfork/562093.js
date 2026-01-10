// ==UserScript==
// @name         谷歌移动端图片搜索
// @author       izumi0004
// @namespace    https://github.com/izumi0004
// @version      0.0.1
// @description  允许谷歌移动端网页直接使用图片搜索功能（不跳转app）
// @match        https://www.google.com/*
// @match        https://www.google.com.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562093/%E8%B0%B7%E6%AD%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%9B%BE%E7%89%87%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/562093/%E8%B0%B7%E6%AD%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%9B%BE%E7%89%87%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fileInput = null;
    let modal = null;

    // input for image upload
    function createFileInput() {
        if (fileInput) return;

        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadAndSearchImage(file);
            }
            fileInput.value = '';
        });

        document.body.appendChild(fileInput);
    }

    function createLensModal() {
        if (modal) return;

        modal = document.createElement('div');
        modal.id = 'tm-lens-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            width: 92%;
            max-width: 500px;
            max-height: 85vh;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            position: relative;
        `;

        const modal_style = `
            #tm-lens-modal * {
                box-sizing: border-box;
            }
            #tm-lens-modal .tm-modal-header {
                padding: 10px 20px;
                border-bottom: 1px solid #e8eaed;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
            }
            #tm-lens-modal .tm-modal-title {
                font-size: 16px;
                font-weight: 500;
                color: #202124;
                margin: 0;
                line-height: 1.4;
                padding-right: 8px;
            }
            #tm-lens-modal .tm-close-btn {
                background: none;
                border: none;
                font-size: 20px;
                color: #5f6368;
                cursor: pointer;
                padding: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                flex-shrink: 0;
                width: 36px;
                height: 36px;
            }
            #tm-lens-modal .tm-close-btn:hover {
                background: #f1f3f4;
            }
            #tm-lens-modal .tm-modal-body {
                padding: 24px 20px;
                max-height: calc(85vh - 76px);
                overflow-y: auto;
            }
            #tm-lens-modal .tm-drop-zone {
                border: 2px dashed #dadce0;
                border-radius: 12px;
                padding: 40px 16px;
                text-align: center;
                margin-bottom: 20px;
                cursor: pointer;
                transition: all 0.3s;
                background: #fafafa;
            }
            #tm-lens-modal .tm-drop-zone:hover {
                background: #f8f9fa;
                border-color: #1a73e8;
            }
            #tm-lens-modal .tm-drop-zone.dragging {
                background: #e8f0fe;
                border-color: #1a73e8;
            }
            #tm-lens-modal .tm-image-icon {
                width: 56px;
                height: 56px;
                margin: 0 auto 12px;
                background: #4285f4;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #tm-lens-modal .tm-image-icon svg {
                width: 32px;
                height: 32px;
                fill: white;
            }
            #tm-lens-modal .tm-drop-text {
                font-size: 15px;
                color: #202124;
                margin-bottom: 4px;
                line-height: 1.4;
            }
            #tm-lens-modal .tm-upload-link {
                color: #1a73e8;
                text-decoration: none;
                cursor: pointer;
            }
            #tm-lens-modal .tm-upload-link:hover {
                text-decoration: underline;
            }
            #tm-lens-modal .tm-divider {
                text-align: center;
                margin: 16px 0;
                color: #80868b;
                position: relative;
                font-size: 13px;
            }
            #tm-lens-modal .tm-divider::before,
            #tm-lens-modal .tm-divider::after {
                content: '';
                position: absolute;
                top: 50%;
                width: 40%;
                height: 1px;
                background: #dadce0;
            }
            #tm-lens-modal .tm-divider::before {
                left: 0;
            }
            #tm-lens-modal .tm-divider::after {
                right: 0;
            }
            #tm-lens-modal .tm-input-group {
                display: flex;
                gap: 4px;
                align-items: center;
            }
            #tm-lens-modal .tm-url-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #dadce0;
                border-radius: 24px;
                font-size: 14px;
                outline: none;
                transition: all 0.3s;
                background: white;
            }
            #tm-lens-modal .tm-url-input:focus {
                border-color: #1a73e8;
                box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
            }
            #tm-lens-modal .tm-url-input::placeholder {
                color: #9aa0a6;
            }
            #tm-lens-modal .tm-search-btn {
                background: #1a73e8;
                color: white;
                border: none;
                padding: 12px 28px;
                border-radius: 24px;
                font-size: 14px;
                cursor: pointer;
                flex-shrink: 0;
                transition: all 0.2s;
                white-space: nowrap;
            }
            #tm-lens-modal .tm-search-btn:hover {
                background: #1557b0;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }
            #tm-lens-modal .tm-loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 60px 20px;
            }
            #tm-lens-modal .tm-loading-spinner {
                width: 48px;
                height: 48px;
                border: 4px solid #e8eaed;
                border-top-color: #4285f4;
                border-radius: 50%;
                animation: tm-spin 1s linear infinite;
                margin-bottom: 20px;
            }
            @keyframes tm-spin {
                to { transform: rotate(360deg); }
            }
            #tm-lens-modal .tm-loading-text {
                font-size: 15px;
                color: #5f6368;
            }
        `
        modalContent.innerHTML = `
            <style>${modal_style}</style>
            <div class="tm-modal-header">
                <h2 class="tm-modal-title">搜索图片</h2>
                <button class="tm-close-btn" id="tm-close-modal">✕</button>
            </div>
            <div class="tm-modal-body">
                <div class="tm-drop-zone" id="tm-drop-zone">
                    <div class="tm-image-icon">
                        <svg viewBox="0 0 24 24">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                    </div>
                    <div class="tm-drop-text">上传图片</div>
                </div>
                <div class="tm-divider">或</div>
                <div class="tm-input-group">
                    <input type="text" class="tm-url-input" id="tm-url-input" placeholder="输入图片链接">
                    <button class="tm-search-btn" id="tm-search-btn">搜索</button>
                </div>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        setupModalEvents(modal);
    }

    function setupModalEvents(modal) {
        const dropZone = modal.querySelector('#tm-drop-zone');
        const urlInput = modal.querySelector('#tm-url-input');
        const searchBtn = modal.querySelector('#tm-search-btn');
        const closeBtn = modal.querySelector('#tm-close-modal');

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragging');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragging');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragging');

            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                uploadAndSearchImage(files[0]);
            }
        });

        searchBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                searchByImageUrl(url);
            }
        });

        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const url = urlInput.value.trim();
                if (url) {
                    searchByImageUrl(url);
                }
            }
        });
    }

    function showModal() {
        modal.style.display = 'flex';
        // clear previous url input
        const urlInput = modal.querySelector('#tm-url-input');
        if (urlInput) {
            urlInput.value = '';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function showLoadingState() {
        const modalBody = modal.querySelector('.tm-modal-body');
        modalBody.innerHTML = `
            <div class="tm-loading-container">
                <div class="tm-loading-spinner"></div>
                <div class="tm-loading-text">正在上传...</div>
            </div>
        `;
    }

    // navigate to image search url
    function searchByImageUrl(url) {
        showLoadingState();
        window.location.href = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(url)}`;
    }

    // upload image to Google Lens
    function uploadAndSearchImage(file) {
        showLoadingState();

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://lens.google.com/v3/upload';
        form.enctype = 'multipart/form-data';
        form.style.display = 'none';

        const fileInputElement = document.createElement('input');
        fileInputElement.type = 'file';
        fileInputElement.name = 'encoded_image';

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputElement.files = dataTransfer.files;

        form.appendChild(fileInputElement);
        document.body.appendChild(form);
        form.submit();
    }

    // hijack existing camera buttons
    function hijackCameraButton() {
        const links = document.querySelectorAll('a[href*="search.app.goo.gl"]');

        links.forEach(link => {
            if (link.dataset.tmHijacked) return;

            const newLink = link.cloneNode(true);
            newLink.dataset.tmHijacked = 'true';
            newLink.removeAttribute('href');

            newLink.addEventListener('click', () => {
                showModal();
            }, true);

            link.parentNode.replaceChild(newLink, link);
        });
    }

    function init() {
        createFileInput();
        createLensModal();
        hijackCameraButton();

        new MutationObserver(hijackCameraButton).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();