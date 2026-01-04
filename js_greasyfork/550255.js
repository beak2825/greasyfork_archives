// ==UserScript==
// @name         Instagram Image Downloader
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Adds a download icon to download Instagram images in full resolution
// @license      MIT
// @author       nereids
// @icon         https://icons.duckduckgo.com/ip3/instagram.com.ico
// @match        https://www.instagram.com/*
// @grant        GM_xmlhttpRequest
// @connect      www.instagram.com
// @connect      *.fna.fbcdn.net
// @connect      *.scontent.cdninstagram.com
// @downloadURL https://update.greasyfork.org/scripts/550255/Instagram%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550255/Instagram%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Track image indices per post
    const imageIndices = new Map();

    // Function to create SVG download icon with customizable path
    function createDownloadIcon(customPath = 'M3.46447 3.46447C2 4.92893 2 7.28595 2 12c0 4.714 0 7.0711 1.46447 8.5355C4.92893 22 7.28595 22 12 22c4.714 0 7.0711 0 8.5355 -1.4645C22 19.0711 22 16.714 22 12c0 -4.71405 0 -7.07107 -1.4645 -8.53553C19.0711 2 16.714 2 12 2 7.28595 2 4.92893 2 3.46447 3.46447ZM12 7.25c0.4142 0 0.75 0.33579 0.75 0.75v6.1893l1.7197 -1.7196c0.2929 -0.2929 0.7677 -0.2929 1.0606 0 0.2929 0.2929 0.2929 0.7677 0 1.0606l-3 3c-0.1406 0.1407 -0.3314 0.2197 -0.5303 0.2197 -0.1989 0 -0.3897 -0.079 -0.5303 -0.2197l-3.00003 -3c-0.29289 -0.2929 -0.29289 -0.7677 0 -1.0606 0.29289 -0.2929 0.76777 -0.2929 1.06066 0L11.25 14.1893V8c0 -0.41421 0.3358 -0.75 0.75 -0.75Z') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'white');
        svg.setAttribute('fill-rule','evenodd')
        svg.setAttribute('clip-rule','evenodd')
        svg.style.position = 'absolute';
        svg.style.left = '5px';
        svg.style.top = '5px';
        //svg.style.left = '50%';
        //svg.style.transform = 'translateX(-50%)';
        svg.style.cursor = 'pointer';
        svg.style.zIndex = '1000';
        svg.style.opacity = '0.65'; // Set initial opacity

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', customPath); // Allow custom path
        svg.appendChild(path);

        return svg;
    }

    // Function to trigger download using blob
    function downloadImage(url, filename) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                const blob = response.response;
                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                a.download = filename || 'instagram-image.jpg';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(a.href);
                document.body.removeChild(a);
            },
            onerror: function(err) {
                console.error('Download failed:', err);
                alert('Failed to download image. Check console for details.');
            }
        });
    }

    // Function to get the highest resolution image URL
    function getHighResImageUrl(imgElement) {
        let highResUrl = imgElement.src;
      //if (highResUrl.includes('fna.fbcdn.net')) {
      //if (highResUrl.includes('scontent.cdninstagram.com')) {
        if (highResUrl.includes('fna.fbcdn.net') || highResUrl.includes('scontent.cdninstagram.com')) {
            highResUrl = highResUrl.replace(/&stp=dst-jpg(_e\d+)?(_p\d+x\d+)?(_tt\d+)?/, '&stp=dst-jpegr_e35');
            console.log('High-res URL:', highResUrl);
        }
        return highResUrl;
    }

    // Function to get profile name
    function getProfileName() {
        let profileName = document.querySelector('h2, h1')?.textContent.trim();
        if (!profileName) {
            profileName = document.querySelector('a[href*="/"] span, a[href*="/"] div')?.textContent.trim();
        }
        return profileName ? profileName.replace(/[^a-zA-Z0-9._]/g, '') : 'unknown';
    }

    // Function to get post date from DOM or by fetching the post page HTML
    async function getPostDate(imgElement) {
        const timeElement = imgElement.closest('article')?.querySelector('time');
        if (timeElement && timeElement.dateTime) {
            const date = new Date(timeElement.dateTime);
            return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }

        // Fetch the full post page if not found
        const postId = getPostId(imgElement);
        if (postId === 'unknown') return 'unknown';

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://www.instagram.com/p/${postId}/`,
                    onload: resolve,
                    onerror: reject
                });
            });
            const html = response.responseText;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const timeElementFetched = doc.querySelector('time');
            if (timeElementFetched && timeElementFetched.dateTime) {
                const date = new Date(timeElementFetched.dateTime);
                return date.toISOString().split('T')[0];
            }
        } catch (err) {
            console.error('Failed to fetch post page for date:', err);
        }
        return 'unknown'; // Return 'unknown' if no date is found
    }

    // Function to get post ID
    function getPostId(imgElement) {
        const postLink = imgElement.closest('a[href*="/p/"]')?.href || imgElement.closest('article')?.querySelector('a[href*="/p/"]')?.href;
        if (postLink) {
            const match = postLink.match(/\/p\/([^/?]+)/);
            return match ? match[1] : 'unknown';
        }
        // Fallback for thumbnails: extract from data attributes or parent link
        const thumbnailLink = imgElement.closest('a')?.getAttribute('href');
        if (thumbnailLink && thumbnailLink.includes('/p/')) {
            const thumbnailMatch = thumbnailLink.match(/\/p\/([^/?]+)/);
            return thumbnailMatch ? thumbnailMatch[1] : 'unknown';
        }
        return 'unknown';
    }

    // Function to get image index for the post
    function getImageIndex(postId, imgElement) {
        if (!imageIndices.has(postId)) {
            imageIndices.set(postId, 0);
        }
        const currentIndex = imageIndices.get(postId) + 1;
        imageIndices.set(postId, currentIndex);
        return currentIndex;
    }

    // Function to add download icon to images
    function addDownloadIcons() {
     // const images = document.querySelectorAll('img[src*="fna.fbcdn.net"]');
     // const images = document.querySelectorAll('img[src*="scontent.cdninstagram.com"]');
        const images = document.querySelectorAll('img[src*="fna.fbcdn.net"], img[src*="scontent.cdninstagram.com"]');
        console.log('Found images:', images.length);
        images.forEach(img => {
            if (img.naturalWidth < 200 || img.naturalHeight < 200) return;
            const container = img.parentElement;
            if (!container.querySelector('.download-icon')) {
                container.style.position = 'relative';
                const downloadIcon = createDownloadIcon(); // Use default path or custom one
                downloadIcon.classList.add('download-icon');
                downloadIcon.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const profileName = getProfileName();
                    const postDate = await getPostDate(img); // Await the async date fetch
                    const postId = getPostId(img);
                    const imageIndex = getImageIndex(postId, img);
                    const filename = `${profileName}-${postDate}_${postId}_${imageIndex}.jpg`;
                    const highResUrl = getHighResImageUrl(img);
                    console.log('Downloading:', highResUrl, 'as', filename);
                    downloadImage(highResUrl, filename);
                });
                container.appendChild(downloadIcon);
            }
        });
    }

    // Function to check for images with retry
    function checkForImages(retryCount = 0, maxRetries = 5) {
     // const images = document.querySelectorAll('img[src*="fna.fbcdn.net"]');
     // const images = document.querySelectorAll('img[src*="scontent.cdninstagram.com"]');
        const images = document.querySelectorAll('img[src*="fna.fbcdn.net"], img[src*="scontent.cdninstagram.com"]');
        if (images.length > 0) {
            addDownloadIcons();
        } else if (retryCount < maxRetries) {
            console.log(`No images found, retrying (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => checkForImages(retryCount + 1, maxRetries), 1000);
        }
    }

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                shouldCheck = true;
            }
        });
        if (shouldCheck) {
            setTimeout(addDownloadIcons, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check with retries
    setTimeout(() => checkForImages(), 2000);

    // Periodic check for dynamic content
    setInterval(addDownloadIcons, 3000);
})();