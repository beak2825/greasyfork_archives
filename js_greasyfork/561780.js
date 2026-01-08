// ==UserScript==
// @name         X Media Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download GIFs, images, and videos from X (Twitter)
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/561780/X%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561780/X%20Media%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .media-download-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.75);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            z-index: 10;
            transition: background 0.2s;
        }
        .media-download-btn:hover {
            background: rgba(0, 0, 0, 0.9);
        }
    `;
    document.head.appendChild(style);

    function downloadMedia(url, filename) {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
            })
            .catch(err => console.error('Download failed:', err));
    }

    function getMediaUrl(element) {
        // For images
        const img = element.querySelector('img[src*="media"]');
        if (img) {
            let src = img.src;
            // Get original quality by removing size parameters
            src = src.split('?')[0];
            if (src.includes('&name=')) {
                src = src.split('&name=')[0] + '&name=orig';
            } else {
                src = src + '?name=orig';
            }
            return { url: src, type: 'image', ext: 'jpg' };
        }

        // For videos/GIFs
        const video = element.querySelector('video');
        if (video) {
            const src = video.src || (video.querySelector('source') && video.querySelector('source').src);
            if (src) {
                const isGif = element.querySelector('[aria-label*="GIF"]') || 
                             element.querySelector('[data-testid*="gif"]');
                return { url: src, type: isGif ? 'gif' : 'video', ext: isGif ? 'mp4' : 'mp4' };
            }
        }

        return null;
    }

    function addDownloadButton(container) {
        if (container.querySelector('.media-download-btn')) return;

        const media = getMediaUrl(container);
        if (!media) return;

        const btn = document.createElement('button');
        btn.className = 'media-download-btn';
        btn.textContent = '⬇ Download';
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const timestamp = Date.now();
            const filename = `x_${media.type}_${timestamp}.${media.ext}`;
            downloadMedia(media.url, filename);
        };

        // Check if container already has positioning
        const currentPosition = window.getComputedStyle(container).position;
        if (currentPosition === 'static') {
            container.style.position = 'relative';
        }
        container.appendChild(btn);
    }

    function processMedia() {
        // Find all media containers
        const mediaContainers = document.querySelectorAll('[data-testid="tweetPhoto"], [data-testid="videoPlayer"]');
        
        mediaContainers.forEach(container => {
            addDownloadButton(container);
        });
    }

    // Initial processing
    processMedia();

    // Watch for new media being loaded
    const observer = new MutationObserver(() => {
        processMedia();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run on scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(processMedia, 300);
    });
})();