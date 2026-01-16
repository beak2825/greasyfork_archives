// ==UserScript==
// @name         Manta Comic Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Downloads chapter images from Manta.net with smart retries and modern UI.
// @author       ozler365
// @license      MIT
// @match        https://manta.net/en/*
// @match        https://manta.net/es/*
// @match        https://manta.net/fr/*
// @icon         https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4f/a4/ec/4fa4ec96-6f47-b728-7e23-82e451ad002b/Placeholder.mill/400x400bb-75.webp
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562775/Manta%20Comic%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562775/Manta%20Comic%20Chapter%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let capturedChapterData = null;
    let downloadBtn = null;
    let isDownloading = false;

    // --- Configuration ---
    const DELAY_BETWEEN_IMAGES = 200; // Consistent pacing to prevent browser throttling
    const MAX_RETRIES = 3;            // Retry failed images 3 times
    const RETRY_WAIT = 2000;          // Wait 2 seconds before retrying

    // --- Extract Episode ID from URL ---
    function getEpisodeIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('episodeId');
    }

    // --- Data Interception ---

    function findCutImagesAndTitle(obj, url) {
        if (!obj || typeof obj !== 'object') return null;

        const episodeId = getEpisodeIdFromUrl();
        // Manta API requests usually contain the episodeID
        if (episodeId && url && !url.includes(episodeId)) {
            return null;
        }

        // Navigate through data structure: response -> data -> cutImages
        let searchObj = obj;
        if (obj.data) {
            searchObj = obj.data;
        }

        if (searchObj.cutImages && Array.isArray(searchObj.cutImages)) {
            const sortedImages = [...searchObj.cutImages].sort((a, b) => (a.ord || 0) - (b.ord || 0));

            return {
                images: sortedImages.map(img => ({
                    ord: img.ord,
                    downloadUrl: img.url || img.downloadUrl
                })),
                title: searchObj.title || document.title,
                episodeId: episodeId
            };
        }
        return null;
    }

    // Hook into XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            try {
                const contentType = this.getResponseHeader('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const res = JSON.parse(this.responseText);
                    const found = findCutImagesAndTitle(res, typeof url === 'string' ? url : url.toString());

                    if (found && found.images.length > 0) {
                        capturedChapterData = found;
                        updateButtonState();
                    }
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
            const contentType = clone.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                clone.json().then(data => {
                    const found = findCutImagesAndTitle(data, url);
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
        if (document.getElementById('manta-dl-btn')) return;

        downloadBtn = document.createElement('button');
        downloadBtn.id = 'manta-dl-btn';
        downloadBtn.innerText = 'Wait for Data...';
        
        // Consistent styling with Tappytoon/WebComics scripts
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
            downloadBtn.style.backgroundColor = '#6200ea'; // Manta Purple
            downloadBtn.style.cursor = 'pointer';
            const title = capturedChapterData.title || 'Chapter';
            const count = capturedChapterData.images.length;
            downloadBtn.innerText = `Download: ${count} Pages`;
            downloadBtn.disabled = false;
        }
    }

    // --- Download Logic ---

    function startDownload() {
        if (!capturedChapterData || isDownloading) return;

        isDownloading = true;
        const images = capturedChapterData.images;
        const folderName = sanitizeFilename(document.title || capturedChapterData.title || 'Chapter').trim();

        downloadBtn.innerText = `Starting...`;
        downloadBtn.disabled = true;
        downloadBtn.style.backgroundColor = '#ff6600'; // Processing Orange

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

                setTimeout(() => {
                    updateButtonState();
                }, 4000);
                return;
            }

            const imgData = images[currentIndex];
            const url = imgData.downloadUrl;

            if (!url) {
                // Skip invalid urls
                failed++;
                currentIndex++;
                downloadNext();
                return;
            }

            const ext = url.split('.').pop().split('?')[0] || 'jpg';
            const pageNum = imgData.ord || (currentIndex + 1);
            const filename = `${String(pageNum).padStart(3, '0')}.${ext}`;
            const fullPath = `${folderName}/${filename}`;

            // Helper for retries
            const handleFailure = (reason) => {
                console.warn(`[Manta] Failed: ${filename} (${reason})`);
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
                timeout: 15000, // 15 seconds timeout
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

    // Monitor URL changes for SPA navigation
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
                downloadBtn.innerText = 'Wait for Data...';
                downloadBtn.disabled = true;
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();
