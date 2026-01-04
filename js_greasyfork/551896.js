// ==UserScript==
// @name         Reset Scans Manga Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Downloads all images from a manga chapter on reset-scans.org
// @author       Baconana-chan
// @match        https://reset-scans.org/manga/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551896/Reset%20Scans%20Manga%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/551896/Reset%20Scans%20Manga%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to trigger download
    function downloadImage(url, filename) {
        GM_download({
            url: url,
            name: filename,
            saveAs: false,
            onload: () => console.log(`Downloaded: ${filename}`),
            onerror: () => console.error(`Failed to download: ${url}`)
        });
    }

    // Function to sanitize filename
    function sanitizeFilename(filename) {
        return filename.replace(/[^a-zA-Z0-9\-_\.]/g, '_').replace(/_+/g, '_');
    }

    // Main function to extract and download images
    function downloadMangaImages() {
        // Get manga title from breadcrumb or page header
        let mangaTitle = document.querySelector('#chapter-heading')?.textContent.trim() || 'Manga';
        const chapterMatch = mangaTitle.match(/Chapter\s*(\d+)/i);
        const chapterNumber = chapterMatch ? chapterMatch[1].padStart(2, '0') : 'Unknown';
        mangaTitle = mangaTitle.replace(/ - Chapter.*/, '').trim();

        // Sanitize manga title for filename
        const sanitizedMangaTitle = sanitizeFilename(mangaTitle);

        // Find all images in the reading-content div
        const images = document.querySelectorAll('.reading-content .page-break img.wp-manga-chapter-img');
        if (images.length === 0) {
            alert('No images found on this page!');
            return;
        }

        // Download each image
        images.forEach((img, index) => {
            const src = img.src;
            if (src) {
                // Construct filename: MangaTitle_ChapterXX_PageYY.jpg
                const pageNumber = (index + 1).toString().padStart(2, '0');
                const filename = `${sanitizedMangaTitle}_Chapter${chapterNumber}_Page${pageNumber}.jpg`;
                downloadImage(src, filename);
            }
        });

        alert(`Started downloading ${images.length} images for ${mangaTitle} Chapter ${chapterNumber}`);
    }

    // Create a button to trigger the download
    function addDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'Download All Images';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = downloadMangaImages;
        document.body.appendChild(button);
    }

    // Run when the page is fully loaded
    window.addEventListener('load', () => {
        addDownloadButton();
    });
})();