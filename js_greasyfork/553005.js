// ==UserScript==
// @name         r34 down
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  download
// @author       bmr
// @match        https://r34.app/*
// @grant        GM_xmlhttpRequest
// @connect      r34i.paheal-cdn.net
// @connect      api-cdn-mp4.rule34.xxx
// @connect      api-cdn.rule34.xxx
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553005/r34%20down.user.js
// @updateURL https://update.greasyfork.org/scripts/553005/r34%20down.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getFullImageUrl(imgSrc) {
        let hash = '';
        const thumbMatch = imgSrc.match(/_thumbs\/([a-f0-9]{32,})\//);

        if (thumbMatch && thumbMatch[1]) {
            hash = thumbMatch[1];
        } else {
            try {
                const url = new URL(imgSrc);
                const pathParts = url.pathname.split('/');
                hash = pathParts[pathParts.length - 1];
            } catch (e) {
                return null;
            }
        }

        if (hash && hash.length > 4) {
            const dir1 = hash.substring(0, 2);
            const dir2 = hash.substring(2, 4);
            return `https://r34i.paheal-cdn.net/${dir1}/${dir2}/${hash}`;
        }
        return null;
    }

    function instantDownload(url, filename) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                const blobUrl = URL.createObjectURL(response.response);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = filename || url.split('/').pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            },
            onerror: function(error) {
                alert(`Не удалось скачать файл: ${filename}`);
            }
        });
    }

    function addDownloadButtons() {
        if (!window.location.pathname.startsWith('/posts/')) {
            return;
        }

        document.querySelectorAll('li[data-index] figure').forEach(postElement => {
            const buttonContainer = postElement.querySelector('.flex.items-center.p-2');
            if (!buttonContainer || buttonContainer.querySelector('.instant-download-btn')) {
                return;
            }

            let mediaUrl = null;
            let filename = 'download';

            const videoElement = postElement.querySelector('video');
            if (videoElement && videoElement.src) {
                mediaUrl = videoElement.src;
                filename = mediaUrl.split('/').pop();
            } else {
                const imgElement = postElement.querySelector('img');
                if (imgElement && imgElement.src) {
                    mediaUrl = getFullImageUrl(imgElement.src);
                    const urlParts = imgElement.src.split('#filename=');
                    if (urlParts.length > 1) {
                        filename = decodeURIComponent(urlParts[1]);
                    } else if (mediaUrl) {
                        filename = mediaUrl.split('/').pop();
                    }
                }
            }

            if (!mediaUrl) {
                return;
            }

            const button = document.createElement('button');
            button.className = 'hover:hover-bg-util focus-visible:focus-outline-util group rounded-md px-1.5 py-1 instant-download-btn';
            button.setAttribute('aria-label', 'Instant Download');
            button.setAttribute('title', 'Моментально скачать');

            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="group-hover:hover-text-util text-base-content h-5 w-5" style="color: #25a0e8;">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 3.75 10.5 9.75h3l-3 6" stroke-width="2" />
                </svg>
            `;

            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                instantDownload(mediaUrl, filename);
            });

            const originalDownloadButton = buttonContainer.querySelector('button[aria-label="Download post"]');
            if (originalDownloadButton) {
                originalDownloadButton.after(button);
            } else {
                buttonContainer.prepend(button);
            }
        });
    }

    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(addDownloadButtons, 500);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(addDownloadButtons, 1000);
})();