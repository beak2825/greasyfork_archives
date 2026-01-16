// ==UserScript==
// @name         Ridibooks Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Downloads chapter images from Ridibooks by intercepting the 'generate' API.
// @author       ozler365
// @license      MIT
// @match        https://ridibooks.com/books/*/view*
// @icon         https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/48/bc/6d/48bc6d7a-faa6-3607-34b9-c5faee09d74e/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/400x400ia-75.webp
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562807/Ridibooks%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562807/Ridibooks%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedChapterData = null;
    let downloadBtn = null;
    let isDownloading = false;

    // --- Configuration ---
    const DELAY_BETWEEN_IMAGES = 200;
    const MAX_RETRIES = 3;
    const RETRY_WAIT = 2000;

    // --- Data Interception ---

    function findChapterData(obj, url) {
        if (!obj || typeof obj !== 'object') return null;

        // 1. Target the specific file: "generate"
        if (url && !url.includes('generate')) {
            return null;
        }

        console.log('[Ridibooks DL] Inspecting "generate" request:', url);

        // 2. Navigation: data -> pages
        if (!obj.data || !obj.data.pages) {
            return null;
        }

        const pages = obj.data.pages;
        if (!Array.isArray(pages) || pages.length === 0) return null;

        // 3. Extract Images
        const images = pages.map((page, index) => {
            let imgUrl = null;

            if (typeof page === 'string') {
                imgUrl = page;
            } else if (typeof page === 'object' && page !== null) {
                imgUrl = page.src || page.url || page.image || page.link;
            }

            if (imgUrl) {
                return {
                    ord: index + 1,
                    downloadUrl: imgUrl
                };
            }
            return null;
        }).filter(item => item !== null);

        if (images.length > 0) {
            const title = obj.data.book_title || document.title || 'Ridibooks Chapter';
            return {
                images: images,
                title: title
            };
        }

        return null;
    }

    // Hook into XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            if (url && url.toString().includes('generate')) {
                try {
                    const res = JSON.parse(this.responseText);
                    const found = findChapterData(res, url.toString());

                    if (found && found.images.length > 0) {
                        capturedChapterData = found;
                        console.log('[Ridibooks DL] Images found:', found.images.length);
                        updateButtonState();
                    }
                } catch (e) {}
            }
        });
        originalOpen.apply(this, arguments);
    };

    // Hook into Fetch API
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        try {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            if (url && url.includes('generate')) {
                const clone = response.clone();
                clone.json().then(data => {
                    const found = findChapterData(data, url);
                    if (found && found.images.length > 0) {
                        capturedChapterData = found;
                        updateButtonState();
                    }
                }).catch(() => {});
            }
        } catch (e) {}
        return response;
    };

    // --- UI Construction ---
    function createButton() {
        if (document.getElementById('ridi-dl-btn')) return;

        downloadBtn = document.createElement('button');
        downloadBtn.id = 'ridi-dl-btn';
        // Updated text as requested
        downloadBtn.innerText = 'Searching...'; 
        
        Object.assign(downloadBtn.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999',
            padding: '12px 24px', backgroundColor: '#5c5c5c', color: '#ffffff',
            border: 'none', borderRadius: '8px', cursor: 'not-allowed',
            fontWeight: 'bold', fontFamily: 'sans-serif',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
        });
        
        downloadBtn.disabled = true;
        downloadBtn.onclick = startDownload;
        document.body.appendChild(downloadBtn);
    }

    function updateButtonState() {
        if (!downloadBtn) createButton();

        if (capturedChapterData && !isDownloading) {
            downloadBtn.style.backgroundColor = '#0077d9'; // Ridibooks Blue
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.innerText = `Download: ${capturedChapterData.images.length} Pages`;
            downloadBtn.disabled = false;
        }
    }

    // --- Download Logic ---
    function startDownload() {
        if (!capturedChapterData || isDownloading) return;

        isDownloading = true;
        const images = capturedChapterData.images;
        const folderName = sanitizeFilename(capturedChapterData.title).trim();

        downloadBtn.innerText = `Starting...`;
        downloadBtn.disabled = true;
        downloadBtn.style.backgroundColor = '#f57c00';

        let completed = 0;
        let failed = 0;
        let currentIndex = 0;
        let currentRetries = 0;

        function downloadNext() {
            if (currentIndex >= images.length) {
                isDownloading = false;
                downloadBtn.style.backgroundColor = '#00cc00';
                downloadBtn.innerText = `✓ Done ${completed}/${images.length}`;
                downloadBtn.disabled = false;
                setTimeout(() => updateButtonState(), 4000);
                return;
            }

            const imgData = images[currentIndex];
            const url = imgData.downloadUrl;
            
            let ext = 'jpg';
            if (url.includes('.png')) ext = 'png';
            if (url.includes('.webp')) ext = 'webp';

            const filename = `${String(imgData.ord).padStart(3, '0')}.${ext}`;
            const fullPath = `${folderName}/${filename}`;

            const handleFailure = (reason) => {
                if (currentRetries < MAX_RETRIES) {
                    currentRetries++;
                    downloadBtn.innerText = `Retry ${currentRetries}...`;
                    setTimeout(downloadNext, RETRY_WAIT);
                } else {
                    failed++;
                    currentIndex++;
                    currentRetries = 0;
                    downloadBtn.innerText = `Skip...`;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                }
            };

            GM_download({
                url: url,
                name: fullPath,
                timeout: 15000,
                headers: { 'Referer': window.location.href },
                onload: function() {
                    completed++;
                    currentIndex++;
                    currentRetries = 0;
                    downloadBtn.innerText = `Downloading ${currentIndex}/${images.length}...`;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                },
                onerror: function() { handleFailure('Error'); },
                ontimeout: function() { handleFailure('Timeout'); }
            });
        }

        downloadNext();
    }

    function sanitizeFilename(name) {
        return name.replace(/[<>:"/\\|?*]/g, "").replace(/\s+/g, " ").trim().substring(0, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }
    window.addEventListener('load', createButton);

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            capturedChapterData = null;
            isDownloading = false;
            if (downloadBtn) {
                downloadBtn.style.backgroundColor = '#5c5c5c';
                downloadBtn.style.cursor = 'not-allowed';
                downloadBtn.innerText = 'Searching...';
                downloadBtn.disabled = true;
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();
