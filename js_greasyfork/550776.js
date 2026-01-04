// ==UserScript==
// @name         Ultimate Master Amazing Video Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add download button to video players
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550776/Ultimate%20Master%20Amazing%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550776/Ultimate%20Master%20Amazing%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create download button
    function createDownloadButton(video) {
        // Check if button already exists
        if (video.parentElement.querySelector('.video-download-btn')) {
            return;
        }

        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'video-download-btn';
        downloadBtn.innerHTML = '⬇';
        downloadBtn.title = 'Download Video';

        // Style the button
        downloadBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
            font-family: Arial, sans-serif;
        `;

        // Hover effect
        downloadBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        });

        downloadBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        });

        // Download functionality
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const videoSrc = video.currentSrc || video.src;
            if (!videoSrc) {
                // Try to find source element
                const sourceElement = video.querySelector('source');
                if (sourceElement) {
                    videoSrc = sourceElement.src;
                }
            }

            if (videoSrc) {
                // Create temporary link for download
                const link = document.createElement('a');
                link.href = videoSrc;
                link.download = getVideoFileName(videoSrc);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('Unable to find video source');
            }
        });

        // Position the button relative to video container
        const container = video.parentElement;
        if (container) {
            // Make container relative if it's not already positioned
            const containerStyle = window.getComputedStyle(container);
            if (containerStyle.position === 'static') {
                container.style.position = 'relative';
            }
            container.appendChild(downloadBtn);
        }
    }

    // Function to extract filename from URL
    function getVideoFileName(url) {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const filename = pathname.split('/').pop();

            // If filename has extension, use it; otherwise add .mp4
            if (filename && filename.includes('.')) {
                return filename;
            } else {
                return `video_${Date.now()}.mp4`;
            }
        } catch (e) {
            return `video_${Date.now()}.mp4`;
        }
    }

    // Function to process videos
    function processVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Only add button to videos with src or source elements
            if (video.src || video.querySelector('source')) {
                createDownloadButton(video);
            }
        });
    }

    // Initial processing
    processVideos();

    // Observer for dynamically loaded videos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    // Check if the added node is a video
                    if (node.tagName === 'VIDEO') {
                        if (node.src || node.querySelector('source')) {
                            createDownloadButton(node);
                        }
                    }
                    // Check if the added node contains videos
                    const videos = node.querySelectorAll && node.querySelectorAll('video');
                    if (videos) {
                        videos.forEach(video => {
                            if (video.src || video.querySelector('source')) {
                                createDownloadButton(video);
                            }
                        });
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also check when videos load their source
    document.addEventListener('loadstart', function(e) {
        if (e.target.tagName === 'VIDEO') {
            setTimeout(() => createDownloadButton(e.target), 100);
        }
    }, true);

})();