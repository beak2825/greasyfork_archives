// ==UserScript==
// @name         Holotower ImgOps Links
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Add "imgops" link after file information on Holotower boards (direct for images, litterbox for video frames)
// @author       slopffian
// @match        https://boards.holotower.org/*
// @match        http://boards.holotower.org/*
// @match        https://holotower.org/*
// @match        http://holotower.org/*
// @grant        GM_xmlhttpRequest
// @connect      litterbox.catbox.moe
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552932/Holotower%20ImgOps%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/552932/Holotower%20ImgOps%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== Configuration ====================
    const CONFIG = {
        VARIANCE_THRESHOLD: 100,      // For detecting blank video frames
        SEEK_INCREMENT: 0.1,           // Seconds between frame checks
        MAX_SEEK_TIME: 5,              // Maximum seconds to search for non-blank frame
        JPEG_QUALITY: 0.95,            // Quality for extracted video frames
        LITTERBOX_EXPIRY: '1h',        // Litterbox link expiry time
        LITTERBOX_API: 'https://litterbox.catbox.moe/resources/internals/api.php',
        IMGOPS_URL: 'https://imgops.com/'
    };

    // ==================== State ====================
    const litterboxCache = new WeakMap(); // Cache for storing litterbox URLs by link element

    // ==================== Utility Functions ====================

    /**
     * Check if a litterbox URL is still valid
     */
    async function isLitterboxUrlValid(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Update the visual state of an imgops link
     */
    function updateLinkState(link, text, cursor = 'pointer', color = null) {
        link.textContent = text;
        link.style.cursor = cursor;
        if (color) link.style.color = color;
    }

    /**
     * Extract filename from URL and optionally replace extension
     */
    function getFilenameFromUrl(url, newExtension = null) {
        let filename = url.split('/').pop().split('?')[0];
        if (newExtension) {
            filename = filename.replace(/\.(webm|mp4)$/i, newExtension);
        }
        return filename;
    }

    // ==================== Video Processing ====================

    /**
     * Check if a video frame is blank (uniform color or very low variation)
     */
    function isFrameBlank(canvas, ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let sumR = 0, sumG = 0, sumB = 0;
        let count = 0;

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) { // 40 = 10 pixels * 4 channels (RGBA)
            sumR += data[i];
            sumG += data[i + 1];
            sumB += data[i + 2];
            count++;
        }

        // Calculate average color
        const avgR = sumR / count;
        const avgG = sumG / count;
        const avgB = sumB / count;

        // Calculate variance (how much pixels differ from average)
        let varianceSum = 0;
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const diffR = r - avgR;
            const diffG = g - avgG;
            const diffB = b - avgB;

            varianceSum += (diffR * diffR + diffG * diffG + diffB * diffB);
        }

        const variance = varianceSum / count;
        return variance < CONFIG.VARIANCE_THRESHOLD;
    }

    /**
     * Extract first non-blank frame from video
     */
    async function extractFirstFrameFromVideo(videoUrl) {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.crossOrigin = 'anonymous';
            video.preload = 'metadata';

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let currentSeekTime = 0;

            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                video.currentTime = currentSeekTime;
            };

            video.onseeked = () => {
                try {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Check if we found a non-blank frame or reached limits
                    const reachedEnd = currentSeekTime > CONFIG.MAX_SEEK_TIME || currentSeekTime > video.duration;

                    if (!isFrameBlank(canvas, ctx) || reachedEnd) {
                        // Convert to blob and resolve
                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Failed to create blob from canvas'));
                            }
                        }, 'image/jpeg', CONFIG.JPEG_QUALITY);
                    } else {
                        // Try next frame
                        currentSeekTime += CONFIG.SEEK_INCREMENT;
                        video.currentTime = currentSeekTime;
                    }
                } catch (error) {
                    reject(error);
                }
            };

            video.onerror = () => reject(new Error('Failed to load video'));
            video.src = videoUrl;
        });
    }

    /**
     * Get thumbnail URL from post
     */
    function getThumbnailUrl(fileInfo) {
        const thumbnailImg = fileInfo.closest('.file').querySelector('img.post-image');
        if (!thumbnailImg || !thumbnailImg.src) {
            throw new Error('No thumbnail found');
        }
        return thumbnailImg.src;
    }

    // ==================== Litterbox Upload ====================

    /**
     * Upload blob to litterbox and return URL
     */
    async function uploadToLitterbox(blob, filename) {
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('time', CONFIG.LITTERBOX_EXPIRY);
        formData.append('fileToUpload', blob, filename);

        const uploadResponse = await fetch(CONFIG.LITTERBOX_API, {
            method: 'POST',
            body: formData
        });

        const litterboxUrl = await uploadResponse.text();

        if (!litterboxUrl || !litterboxUrl.startsWith('http')) {
            throw new Error('Invalid response from litterbox');
        }

        return litterboxUrl;
    }

    /**
     * Main imgops handler - direct for server images, litterbox for video frames
     */
    async function handleImgOpsClick(fileUrl, imgopsLink, fileInfo, useVideoThumbnail = false) {
        const isVideo = /\.(webm|mp4)$/i.test(fileUrl);

        try {
            // Case 1: Regular image - go directly to imgops
            if (!isVideo) {
                window.open(`${CONFIG.IMGOPS_URL}${fileUrl}`, '_blank');
                updateLinkState(imgopsLink, 'imgops ✓', 'pointer', 'green');
                return;
            }

            // Case 2: Video thumbnail - use server thumbnail URL directly
            if (useVideoThumbnail) {
                const thumbnailUrl = getThumbnailUrl(fileInfo);
                window.open(`${CONFIG.IMGOPS_URL}${thumbnailUrl}`, '_blank');
                updateLinkState(imgopsLink, 'imgops (thumb) ✓', 'pointer', 'green');
                return;
            }

            // Case 3: Video frame extraction - needs litterbox upload
            // Check cache first
            const cachedUrl = litterboxCache.get(imgopsLink);
            if (cachedUrl) {
                updateLinkState(imgopsLink, 'imgops (checking...)', 'wait');

                const isValid = await isLitterboxUrlValid(cachedUrl);
                if (isValid) {
                    window.open(`${CONFIG.IMGOPS_URL}${cachedUrl}`, '_blank');
                    updateLinkState(imgopsLink, 'imgops ✓', 'pointer', 'green');
                    return;
                }
            }

            // Extract frame and upload to litterbox
            updateLinkState(imgopsLink, 'imgops (loading...)', 'wait');

            const blob = await extractFirstFrameFromVideo(fileUrl);
            const filename = getFilenameFromUrl(fileUrl, '.jpg');
            const litterboxUrl = await uploadToLitterbox(blob, filename);

            // Cache and open
            litterboxCache.set(imgopsLink, litterboxUrl);
            window.open(`${CONFIG.IMGOPS_URL}${litterboxUrl}`, '_blank');
            updateLinkState(imgopsLink, 'imgops ✓', 'pointer', 'green');

        } catch (error) {
            console.error('Error processing for imgops:', error);
            const errorText = useVideoThumbnail ? 'imgops (thumb error)' : 'imgops (error)';
            updateLinkState(imgopsLink, errorText, 'pointer', 'red');

            if (!useVideoThumbnail) {
                alert('Failed to process image for imgops. Please try again.');
            }
        }
    }

    // ==================== DOM Manipulation ====================

    /**
     * Create an imgops link element
     */
    function createImgOpsLink(text, fileUrl, fileInfo, useVideoThumbnail = false) {
        const link = document.createElement('a');
        link.href = 'javascript:void(0)';
        link.textContent = text;
        link.className = useVideoThumbnail ? 'imgops-link imgops-thumb-link' : 'imgops-link';
        link.style.cursor = 'pointer';

        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleImgOpsClick(fileUrl, link, fileInfo, useVideoThumbnail);
        });

        return link;
    }

    /**
     * Check if imgops links already exist for this span
     */
    function hasImgOpsLinks(span) {
        let sibling = span.nextSibling;
        while (sibling) {
            if (sibling.nodeType === Node.ELEMENT_NODE &&
                sibling.classList &&
                sibling.classList.contains('imgops-link')) {
                return true;
            }
            // Only check immediate siblings
            if (sibling.nodeType === Node.ELEMENT_NODE &&
                !sibling.classList.contains('imgops-link')) {
                break;
            }
            sibling = sibling.nextSibling;
        }
        return false;
    }

    /**
     * Add imgops links to a file info element
     */
    function addImgOpsLinksToFile(span) {
        // Skip if already processed
        if (hasImgOpsLinks(span)) return;

        // Get file info
        const fileInfo = span.closest('.fileinfo');
        if (!fileInfo) return;

        const fileLink = fileInfo.querySelector('a[href*="/src/"]');
        if (!fileLink) return;

        const fileUrl = fileLink.href;
        const isVideo = /\.(webm|mp4)$/i.test(fileUrl);

        // Create main imgops link
        const imgopsLink = createImgOpsLink('imgops', fileUrl, fileInfo, false);

        // Insert links with brackets
        span.parentNode.insertBefore(document.createTextNode(' ['), span.nextSibling);
        span.parentNode.insertBefore(imgopsLink, span.nextSibling.nextSibling);

        // For videos, add thumbnail link
        if (isVideo) {
            span.parentNode.insertBefore(document.createTextNode(' | '), span.nextSibling.nextSibling.nextSibling);

            const thumbLink = createImgOpsLink('imgops (thumb)', fileUrl, fileInfo, true);
            span.parentNode.insertBefore(thumbLink, span.nextSibling.nextSibling.nextSibling.nextSibling);
            span.parentNode.insertBefore(document.createTextNode(']'), span.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling);
        } else {
            span.parentNode.insertBefore(document.createTextNode(']'), span.nextSibling.nextSibling.nextSibling);
        }
    }

    /**
     * Process all file info elements on the page
     */
    function addImgOpsLinks() {
        const fileInfoSpans = document.querySelectorAll('.fileinfo span.unimportant');
        fileInfoSpans.forEach(addImgOpsLinksToFile);
    }

    // ==================== Mutation Observer ====================

    /**
     * Check if mutation contains file info elements
     */
    function mutationHasFileInfo(mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                if (node.classList && node.classList.contains('fileinfo')) {
                    return true;
                }
                if (node.querySelector && node.querySelector('.fileinfo')) {
                    return true;
                }
            }
        }
        return false;
    }

    // ==================== Initialization ====================

    // Add links to existing posts
    addImgOpsLinks();

    // Watch for new posts
    const observer = new MutationObserver((mutations) => {
        if (mutationHasFileInfo(mutations)) {
            observer.disconnect();
            addImgOpsLinks();
            observer.observe(document.body, { childList: true, subtree: true });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();