// ==UserScript==
// @name         Tappytoon Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Downloads chapter images from Tappytoon with smart retries and faster processing.
// @author       ozler365
// @license      MIT
// @match        https://www.tappytoon.com/*
// @icon         https://oopy.lazyrockets.com/api/rest/cdn/image/a8d14437-5e93-44a9-977e-268bbf37762b.png
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562783/Tappytoon%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562783/Tappytoon%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedChapterData = null;
    let downloadBtn = null;
    let isDownloading = false;

    // --- Configuration ---
    // Reduced delay to 200ms to make it feel faster while keeping it safe
    const DELAY_BETWEEN_IMAGES = 200; 
    const MAX_RETRIES = 3;            
    const RETRY_WAIT = 2000;          

    // --- Extract Episode ID from URL ---
    function getEpisodeIdFromUrl() {
        const match = window.location.pathname.match(/\/chapters\/(\d+)/);
        return match ? match[1] : null;
    }

    // --- Data Interception ---
    function findChapterData(obj, url) {
        if (!obj || typeof obj !== 'object') return null;

        const episodeId = getEpisodeIdFromUrl();
        // Check if URL contains the episode ID to ensure we grab the correct chapter
        if (episodeId && url && !url.includes(episodeId)) {
            return null;
        }

        if (obj.files && Array.isArray(obj.files)) {
            const validFiles = obj.files.filter(f => f.url && f.sortKey !== undefined);

            if (validFiles.length > 0) {
                const sortedImages = [...validFiles].sort((a, b) => a.sortKey - b.sortKey);

                return {
                    images: sortedImages.map(f => ({
                        ord: f.sortKey,
                        downloadUrl: f.url
                    })),
                    title: document.title || `Chapter ${episodeId}`,
                    episodeId: episodeId
                };
            }
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
        if (document.getElementById('tappy-dl-btn')) return;

        downloadBtn = document.createElement('button');
        downloadBtn.id = 'tappy-dl-btn';
        downloadBtn.innerText = 'Wait for Data...';
        Object.assign(downloadBtn.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999',
            padding: '10px 20px', backgroundColor: '#5c5c5c', color: '#ffffff',
            border: 'none', borderRadius: '5px', cursor: 'not-allowed',
            fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        });
        downloadBtn.disabled = true;
        downloadBtn.onclick = startDownload;
        document.body.appendChild(downloadBtn);
    }

    function updateButtonState() {
        if (!downloadBtn) createButton();

        if (capturedChapterData && !isDownloading) {
            downloadBtn.style.backgroundColor = '#ec407a'; // Tappytoon pink
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.innerText = `Download: ${capturedChapterData.images.length} pages`;
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
        downloadBtn.style.backgroundColor = '#ff6600';

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
                setTimeout(() => updateButtonState(), 3000);
                return;
            }

            const imgData = images[currentIndex];
            const url = imgData.downloadUrl;
            const ext = url.split('.').pop().split('?')[0] || 'jpg';
            const pageNum = imgData.ord || (currentIndex + 1);
            const filename = `${String(pageNum).padStart(3, '0')}.${ext}`;
            const fullPath = `${folderName}/${filename}`;

            // Helper to handle failure/retry
            const handleFailure = (reason) => {
                console.warn(`[Tappytoon] Failed: ${filename} (${reason})`);
                if (currentRetries < MAX_RETRIES) {
                    currentRetries++;
                    downloadBtn.innerText = `Retry ${currentRetries} for #${pageNum}...`;
                    setTimeout(downloadNext, RETRY_WAIT);
                } else {
                    failed++;
                    currentIndex++;
                    currentRetries = 0;
                    downloadBtn.innerText = `Skip #${pageNum}...`;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                }
            };

            GM_download({
                url: url,
                name: fullPath,
                timeout: 15000, // 15s timeout
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

    // --- Initialize ---
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
                downloadBtn.innerText = 'Download Chapter';
                downloadBtn.disabled = true;
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();
