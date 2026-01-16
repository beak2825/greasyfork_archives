// ==UserScript==
// @name         Webnovel Comic Chapter Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Downloads chapter images from Webnovel by intercepting the getContent API.
// @author       ozler365
// @license      MIT
// @match        https://www.webnovel.com/comic/*
// @icon         https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/82/e4/53/82e453f3-7569-7fc1-05d1-ea20871c2241/Placeholder.mill/400x400bb-75.webp
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562799/Webnovel%20Comic%20Chapter%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562799/Webnovel%20Comic%20Chapter%20Downloader.meta.js
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

    // --- URL Parsing ---
    function getCurrentChapterSlug() {
        // URL format: .../comic/series-name_id/000-chapter-name_id
        // We want the last segment before any query params
        const path = window.location.pathname; 
        const segments = path.split('/').filter(s => s.length > 0);
        const lastSegment = segments[segments.length - 1]; // e.g., "000-only-i-level-up_4519..."
        
        if (!lastSegment) return null;

        // Remove the ID suffix (the part after the last underscore)
        // e.g., "000-only-i-level-up_4519..." -> "000-only-i-level-up"
        const underscoreIndex = lastSegment.lastIndexOf('_');
        if (underscoreIndex !== -1) {
            return lastSegment.substring(0, underscoreIndex).toLowerCase();
        }
        return lastSegment.toLowerCase();
    }

    // --- Data Interception ---

    function findChapterData(res, url) {
        if (!res || typeof res !== 'object') return null;

        // 1. Check strict API path (User specified "getContent")
        if (url && !url.includes('getContent')) return null;

        // 2. Navigation: data -> chapterInfo
        if (!res.data || !res.data.chapterInfo) return null;

        const info = res.data.chapterInfo;
        const pages = info.chapterPage;

        if (!Array.isArray(pages) || pages.length === 0) return null;

        // 3. Validation: Match URL slug with Chapter Info
        const currentSlug = getCurrentChapterSlug(); // e.g., "000-only-i-level-up"
        
        // We check if the chapter index (e.g. 0) or name is present in the URL slug
        // info.chapterIndex might be 0, info.chapterName might be "Only I Level Up"
        
        let isMatch = false;
        if (currentSlug) {
            // Check Index (e.g. "000" inside slug)
            if (info.chapterIndex !== undefined && currentSlug.includes(info.chapterIndex.toString())) {
                isMatch = true;
            }
            // Check Name (e.g. "only i level up" inside slug)
            else if (info.chapterName && currentSlug.includes(info.chapterName.toLowerCase().replace(/\s+/g, '-'))) {
                isMatch = true;
            }
            // Fallback: If URL contains the Chapter ID provided in info
            else if (info.chapterId && window.location.href.includes(info.chapterId)) {
                isMatch = true;
            }
        } else {
            // If we can't parse URL, assume it's a match if we hit the API
            isMatch = true;
        }

        if (!isMatch) {
            console.log('[Webnovel DL] Ignored data: Mismatch between URL and JSON info', info.chapterName);
            return null;
        }

        // 4. Extract Images
        const images = pages.map((page, index) => {
            let link = page.url || page; // structure can vary
            
            // Fix protocol relative URLs (//example.com -> https://example.com)
            if (link && link.startsWith('//')) {
                link = 'https:' + link;
            }

            return {
                ord: index + 1,
                downloadUrl: link
            };
        });

        return {
            images: images,
            title: info.chapterName || `Chapter ${info.chapterIndex}`,
            chapterId: info.chapterId
        };
    }

    // Hook into XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            try {
                // Only parse if it looks like the target API
                if (url.includes('getContent')) {
                    const res = JSON.parse(this.responseText);
                    const found = findChapterData(res, typeof url === 'string' ? url : url.toString());

                    if (found && found.images.length > 0) {
                        capturedChapterData = found;
                        console.log('[Webnovel DL] Captured chapter:', found.title);
                        updateButtonState();
                    }
                }
            } catch (e) {
                // Ignore errors
            }
        });
        originalOpen.apply(this, arguments);
    };

    // --- UI Construction ---
    function createButton() {
        if (document.getElementById('wn-dl-btn')) return;

        downloadBtn = document.createElement('button');
        downloadBtn.id = 'wn-dl-btn';
        downloadBtn.innerText = 'Wait for Data...';
        
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
            downloadBtn.style.backgroundColor = '#1976d2'; // Webnovel Blue
            downloadBtn.style.cursor = 'pointer';
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
        // Use document title or chapter info for folder
        const folderName = sanitizeFilename(document.title || capturedChapterData.title).trim();

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
            
            // Extension guess
            let ext = 'jpg';
            if (url.includes('.png')) ext = 'png';
            if (url.includes('.webp')) ext = 'webp';

            const filename = `${String(imgData.ord).padStart(3, '0')}.${ext}`;
            const fullPath = `${folderName}/${filename}`;

            const handleFailure = (reason) => {
                console.warn(`[Webnovel DL] Failed: ${filename} (${reason})`);
                if (currentRetries < MAX_RETRIES) {
                    currentRetries++;
                    downloadBtn.innerText = `Retry ${currentRetries} for #${imgData.ord}...`;
                    setTimeout(downloadNext, RETRY_WAIT);
                } else {
                    failed++;
                    currentIndex++;
                    currentRetries = 0;
                    downloadBtn.innerText = `Skip #${imgData.ord}...`;
                    setTimeout(downloadNext, DELAY_BETWEEN_IMAGES);
                }
            };

            GM_download({
                url: url,
                name: fullPath,
                timeout: 15000,
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

    // Watch for URL changes (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            // Clear data if URL changes significantly
            // But be careful: Webnovel might change URL hash/query without changing chapter
            if (!url.includes(getCurrentChapterSlug())) {
                capturedChapterData = null;
                isDownloading = false;
                if (downloadBtn) {
                    downloadBtn.style.backgroundColor = '#5c5c5c';
                    downloadBtn.style.cursor = 'not-allowed';
                    downloadBtn.innerText = 'Wait for Data...';
                    downloadBtn.disabled = true;
                }
            }
        }
    }).observe(document, {subtree: true, childList: true});

})();
