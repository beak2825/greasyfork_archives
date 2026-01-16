// ==UserScript==
// @name         WebComics Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Downloads chapter images from webcomicsapp.com with retries and stability fixes.
// @author       ozler365
// @license      MIT
// @match        https://webcomicsapp.com/*
// @icon         https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/c0/87/41/c08741e4-bfca-c565-e3e6-3ba1d5ccd853/Placeholder.mill/400x400bb-75.webp
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562787/WebComics%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562787/WebComics%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedChapterData = null;
    let downloadBtn = null;
    let isDownloading = false;

    // --- Configuration ---
    const DELAY_BETWEEN_IMAGES = 500; // 0.5 seconds (slower = safer)
    const MAX_RETRIES = 3;            // How many times to retry a failed image
    const RETRY_WAIT = 3000;          // Wait 3 seconds before retrying

    // --- Extract Episode/Chapter ID from URL ---
    function getChapterIdFromUrl() {
        const match = window.location.href.match(/([a-f0-9]{24})(?=-Ch)/i);
        if (!match) {
             const fallback = window.location.pathname.match(/\/([a-f0-9]{24})\b/i);
             return fallback ? fallback[1] : null;
        }
        return match ? match[1] : null;
    }

    // --- Data Interception ---
    function findChapterData(obj, url) {
        if (!obj || typeof obj !== 'object') return null;
        
        if (!obj.data || !obj.data.pages) return null;

        const chapterId = getChapterIdFromUrl();
        if (chapterId && url && !url.includes(chapterId)) return null;

        const pages = obj.data.pages;
        if (!Array.isArray(pages) || pages.length === 0) return null;

        const images = pages.map((page, index) => {
            let imgUrl = null;
            if (typeof page === 'string') {
                imgUrl = page;
            } else if (typeof page === 'object' && page !== null) {
                imgUrl = page.url || page.image || page.src || page.link || page.contentUrl;
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
            return {
                images: images,
                title: document.title || `Chapter ${chapterId}`,
                chapterId: chapterId
            };
        }
        return null;
    }

    // Hook into XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            try {
                const res = JSON.parse(this.responseText);
                const found = findChapterData(res, typeof url === 'string' ? url : url.toString());
                if (found && found.images.length > 0) {
                    capturedChapterData = found;
                    updateButtonState();
                }
            } catch (e) {}
        });
        originalOpen.apply(this, arguments);
    };

    // Hook into Fetch API
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);
        try {
            const url = typeof args[0] === 'string' ? args[0] : args[0].url;
            const clone = response.clone();
            clone.json().then(data => {
                const found = findChapterData(data, url);
                if (found && found.images.length > 0) {
                    capturedChapterData = found;
                    updateButtonState();
                }
            }).catch(() => {});
        } catch (e) {}
        return response;
    };

    // --- UI Construction ---
    function createButton() {
        if (document.getElementById('wc-dl-btn')) return;

        downloadBtn = document.createElement('button');
        downloadBtn.id = 'wc-dl-btn';
        downloadBtn.innerText = 'Wait for Data...';
        Object.assign(downloadBtn.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '10000',
            padding: '12px 24px', backgroundColor: '#444', color: '#fff',
            border: 'none', borderRadius: '8px', cursor: 'not-allowed',
            fontWeight: 'bold', fontFamily: 'sans-serif',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        });
        downloadBtn.disabled = true;
        downloadBtn.onclick = startDownload;
        document.body.appendChild(downloadBtn);
    }

    function updateButtonState() {
        if (!downloadBtn) createButton();
        if (capturedChapterData && !isDownloading) {
            downloadBtn.style.backgroundColor = '#ff5722';
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.innerText = `Download ${capturedChapterData.images.length} Images`;
            downloadBtn.disabled = false;
        }
    }

    // --- Download Logic ---
    function startDownload() {
        if (!capturedChapterData || isDownloading) return;

        isDownloading = true;
        const images = capturedChapterData.images;
        const folderName = sanitizeFilename(document.title).trim() || 'WebComic_Chapter';

        downloadBtn.innerText = `Starting...`;
        downloadBtn.disabled = true;
        downloadBtn.style.backgroundColor = '#f57c00';

        let completed = 0;
        let failed = 0;
        let currentIndex = 0;
        let currentRetries = 0; // Track retries for current image

        function downloadNext() {
            // Check if finished
            if (currentIndex >= images.length) {
                isDownloading = false;
                downloadBtn.style.backgroundColor = '#4caf50';
                downloadBtn.innerText = `✓ Done (${completed}/${images.length})`;
                downloadBtn.disabled = false;
                setTimeout(() => updateButtonState(), 4000);
                return;
            }

            const imgData = images[currentIndex];
            const url = imgData.downloadUrl;
            
            // Guess extension
            let ext = 'jpg';
            if (url.includes('.png')) ext = 'png';
            if (url.includes('.webp')) ext = 'webp';
            if (url.includes('.gif')) ext = 'gif';

            const filename = `${String(imgData.ord).padStart(3, '0')}.${ext}`;
            const fullPath = `${folderName}/${filename}`;

            // Helper to handle failure/retry
            const handleFailure = (reason) => {
                console.warn(`Failed: ${filename} (${reason})`);
                if (currentRetries < MAX_RETRIES) {
                    currentRetries++;
                    downloadBtn.innerText = `Retry ${currentRetries}/${MAX_RETRIES} for img ${currentIndex + 1}...`;
                    setTimeout(downloadNext, RETRY_WAIT); // Wait longer before retry
                } else {
                    // Give up on this one
                    failed++;
                    currentIndex++;
                    currentRetries = 0;
                    downloadBtn.innerText = `Skip ${currentIndex}/${images.length}...`;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                }
            };

            GM_download({
                url: url,
                name: fullPath,
                timeout: 15000, // 15 seconds timeout per image
                onload: function() {
                    completed++;
                    currentIndex++;
                    currentRetries = 0; // Reset retry counter
                    downloadBtn.innerText = `Downloading ${currentIndex}/${images.length}...`;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                },
                onerror: function(err) { handleFailure('Error'); },
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

    // Watch for URL changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            capturedChapterData = null;
            isDownloading = false;
            if (downloadBtn) {
                downloadBtn.style.backgroundColor = '#444';
                downloadBtn.style.cursor = 'not-allowed';
                downloadBtn.innerText = 'Wait for Data...';
                downloadBtn.disabled = true;
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();
