// ==UserScript==
// @name         Rawkuma Image Downloader
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Downloads all chapter images from rawkuma.net as individual files.
// @author       Baconana-chan
// @match        https://rawkuma.net/manga/*/chapter-*
// @grant        GM_xmlhttpRequest
// @connect      rcdn.kyut.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551844/Rawkuma%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/551844/Rawkuma%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the chapter title for naming the files
    let titleElem = document.querySelector('.font-semibold.text-gray-50.text-sm.flex.items-center.content-center');
    let chapterTitle = titleElem ? titleElem.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') : 'chapter';

    // Find the image section
    let imageSection = document.querySelector('section[data-image-data="1"]');
    if (!imageSection) {
        console.error('Image section not found.');
        alert('Image section not found on the page.');
        return;
    }

    // Get all image elements
    let images = imageSection.querySelectorAll('img');
    if (images.length === 0) {
        console.error('No images found in the section.');
        alert('No images found in the chapter.');
        return;
    }

    // Create a download button
    let button = document.createElement('button');
    button.textContent = 'Download All Images';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        let urls = Array.from(images).map(img => img.src);
        let loadedImages = 0;

        // Download each image with a slight delay to avoid overwhelming the browser
        urls.forEach((url, index) => {
            setTimeout(() => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    headers: {
                        'Referer': window.location.href
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            let filename = `${chapterTitle}_${String(index + 1).padStart(3, '0')}.jpg`;
                            let link = document.createElement('a');
                            link.href = URL.createObjectURL(response.response);
                            link.download = filename;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            console.log(`Downloaded image ${filename}`);
                            loadedImages++;
                            if (loadedImages === urls.length) {
                                alert(`All ${loadedImages} images downloaded successfully.`);
                            }
                        } else {
                            console.error(`Failed to load image ${url}: Status ${response.status}`);
                            if (index === urls.length - 1) {
                                alert(`Downloaded ${loadedImages} out of ${urls.length} images. Check console for details.`);
                            }
                        }
                    },
                    onerror: function(error) {
                        console.error(`Error fetching image ${url}:`, error);
                        if (index === urls.length - 1) {
                            alert(`Downloaded ${loadedImages} out of ${urls.length} images. Check console for details.`);
                        }
                    }
                });
            }, index * 1000); // Delay of 1 second between downloads
        });
    });
})();