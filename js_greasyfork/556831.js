// ==UserScript==
// @name         Rule34Video Auto-Download Highest Quality (Non-Favorited) - Uploader & Title
// @namespace    http://tampermonkey.net/
// @version      1.8 // Final version with robust Uploader Name extraction
// @description  Automatically downloads the highest quality file from rule34video.com if the video is not marked as a favorite, using robust resolution sorting, uploader name, and clean video title for the filename.
// @author       Gemini
// @match        https://rule34video.com/video/*
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556831/Rule34Video%20Auto-Download%20Highest%20Quality%20%28Non-Favorited%29%20-%20Uploader%20%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/556831/Rule34Video%20Auto-Download%20Highest%20Quality%20%28Non-Favorited%29%20-%20Uploader%20%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Favorite Status Check ---
    const removeFavLi = document.getElementById('delete_fav_0');
    // Logic: Download only if the "Remove from Favorites" element is hidden (video IS NOT favorited).
    const isFavorited = removeFavLi && !removeFavLi.classList.contains('hidden');

    if (isFavorited) {
        console.log('Video is favorited. Auto-download skipped.');
        return;
    }

    console.log('Video is NOT favorited. Proceeding to construct filename and find download link...');

    // --- 2. Construct Filename: [Uploader Name] Video Title ---

    let uploaderName = '';
    let baseTitle = 'video_download';
    const finalExtension = '.mp4';
    let uploaderLink = null;


    // A. Find the Uploader Name using DOM traversal to locate the adjacent element
    const labels = document.querySelectorAll('div.label');
    for (const label of labels) {
        if (label.textContent.trim() === 'Uploaded by') {
            // The uploader link is the next sibling element.
            uploaderLink = label.nextElementSibling;
            break;
        }
    }

    // B. Extract the Name and Title
    if (uploaderLink && uploaderLink.matches('a.item.btn_link')) {
        let foundName = false;

        // 1. Search child nodes for the bare text node (e.g., 'uglymoronic')
        for (const child of uploaderLink.childNodes) {
            if (child.nodeType === 3) {
                const text = child.textContent.trim();
                if (text.length > 0) {
                    uploaderName = text;
                    foundName = true;
                    break;
                }
            }
        }

        // 2. Fallback check: If the bare text failed, check the image alt text
        if (!foundName) {
            const img = uploaderLink.querySelector('img');
            if (img && img.alt && img.alt.trim().length > 0) {
                uploaderName = img.alt.trim();
            }
        }

        // Clean up the final name for filename safety
        uploaderName = uploaderName.replace(/[\[\]\/\\:*?"<>|]/g, '').trim();
    }

    // 3. Find the Video Title
    const titleElement = document.querySelector('h1.title_video');
    if (titleElement) {
        // Clean the title text
        baseTitle = titleElement.textContent.trim()
            .replace(/[\[\]\/\\:*?"<>|]/g, '')
            .replace(/[^\w\s]/g, '')
            .trim();
    }

    // C. Combine to form the final filename
    let finalFilename = '';
    if (uploaderName && uploaderName.length > 0) {
        // Filename format: [uploader] Title.mp4
        finalFilename = `[${uploaderName}] ${baseTitle}${finalExtension}`;
    } else {
        // Fallback: Title.mp4
        finalFilename = `${baseTitle}${finalExtension}`;
    }

    if (finalFilename.trim() === finalExtension.trim()) {
        finalFilename = 'downloaded_video' + finalExtension;
    }

    console.log(`Target filename: ${finalFilename}`);


    // --- 3. Robust Highest Quality Link Finder ---

    // Extract resolution and store in data attribute for robust sorting
    document.querySelectorAll('a.tag_item').forEach(a => {
        const resolutionMatch = a.textContent.match(/(\d+)(p)?/);
        if (resolutionMatch) {
            a.dataset.res = parseInt(resolutionMatch[1], 10);
        }
    });

    // Sort to find the highest resolution link
    const highestQualityLink = Array.from(document.querySelectorAll('a.tag_item[data-res]'))
        .sort((a, b) => b.dataset.res - a.dataset.res)[0];

    // --- 4. Initiate Download ---
    if (highestQualityLink) {
        const downloadURL = highestQualityLink.href;

        console.log(`Highest quality link found: ${highestQualityLink.textContent} (${downloadURL})`);

        GM_download({
            url: downloadURL,
            name: finalFilename,
            saveAs: false,
            onerror: (error) => {
                console.error('GM_download failed. Check browser console for network errors.', error);
            },
            onload: () => {
                console.log('Download process initiated successfully.');
            }
        });

    } else {
        console.log('No downloadable links found with resolution data.');
    }
})();