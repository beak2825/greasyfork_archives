// ==UserScript==
// @name         Vlipsy Downloader
// @namespace    https://github.com/lamduck2005
// @version      1.0
// @description  Download Vlipsy videos from Grid and Detail pages. Auto-rename file. Skip ads wait
// @author       Lamduck
// @match        https://vlipsy.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vlipsy.com
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      CC-BY-4.0
// @downloadURL https://update.greasyfork.org/scripts/559525/Vlipsy%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/559525/Vlipsy%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btnStyles = `
        .vlipsy-dl-btn {
            position: absolute;
            z-index: 9999;
            background-color: #e11d48; color: #fff;
            border: 2px solid #fff; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 18px; cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.5);
            transition: transform 0.2s, background-color 0.2s;
        }
        .vlipsy-dl-btn:hover { transform: scale(1.1); background-color: #ff4069; }
        .vlipsy-dl-btn.loading {
            cursor: wait; background-color: #64748b; border-color: #94a3b8;
            animation: v-spin 0.8s linear infinite;
        }
        @keyframes v-spin { 100% { transform: rotate(360deg); } }
        .grid-view-btn { top: 8px; left: 8px; width: 32px; height: 32px; }
        .detail-view-btn { top: 15px; left: 15px; width: 40px; height: 40px; font-size: 20px; }
    `;
    GM_addStyle(btnStyles);

    function getFileNameFromUrl(url) {
        try {
            const urlObj = new URL(url);
            let slug = urlObj.pathname.split('/').filter(Boolean).pop();
            if (!slug || slug.length < 2) return `vlipsy_${Date.now()}.mp4`;
            return `${slug}.mp4`;
        } catch (e) {
            return `vlipsy_${Date.now()}.mp4`;
        }
    }

    function triggerDownload(url, filename, btn) {
        if (!url) {
            alert('Video source not found!');
            if(btn) btn.classList.remove('loading');
            return;
        }

        GM_download({
            url: url,
            name: filename,
            saveAs: true,
            onload: () => { if(btn) btn.classList.remove('loading'); },
            onerror: (err) => {
                console.error(err);
                alert('Download Error');
                if(btn) btn.classList.remove('loading');
            }
        });
    }

    function fetchSignedUrl(url, callback) {
        GM_xmlhttpRequest({
            method: "GET", url: url,
            onload: (res) => {
                if (res.status !== 200) return callback(null);
                const match = res.responseText.match(/https:\/\/cdn\.vlipsy\.com\/clips\/[a-zA-Z0-9_-]+\/md\.mp4\?[^"']+/);
                if (!match) {
                    const fallback = res.responseText.match(/property="og:video:secure_url" content="([^"]+)"/);
                    return callback(fallback ? fallback[1] : null);
                }
                callback(match[0]);
            },
            onerror: () => callback(null)
        });
    }

    function processGridItem(card) {
        if (card.dataset.vlipsyDl) return;
        card.dataset.vlipsyDl = 'true';

        const linkElem = card.querySelector('a[href^="/clips/"]');
        if (!linkElem) return;

        const btn = document.createElement('div');
        btn.className = 'vlipsy-dl-btn grid-view-btn';
        btn.innerHTML = '⬇';
        btn.title = 'Download';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (btn.classList.contains('loading')) return;

            btn.classList.add('loading');
            btn.innerHTML = '↻';

            fetchSignedUrl(linkElem.href, (realUrl) => {
                const name = getFileNameFromUrl(linkElem.href);
                triggerDownload(realUrl, name, btn);
            });
        });

        const container = card.querySelector('.relative.aspect-video') || card.querySelector('.tile') || card;
        if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
        container.appendChild(btn);
    }

    function processDetailPlayer() {
        const wrapper = document.getElementById('videoWrapper');
        if (!wrapper || wrapper.dataset.vlipsyDl) return;

        const video = wrapper.querySelector('video');
        if (!video || !video.src) return;

        wrapper.dataset.vlipsyDl = 'true';

        const btn = document.createElement('div');
        btn.className = 'vlipsy-dl-btn detail-view-btn';
        btn.innerHTML = '⬇';
        btn.title = 'Download';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            let videoUrl = video.currentSrc || video.src;
            const fileName = getFileNameFromUrl(window.location.href);
            if (videoUrl) {
                triggerDownload(videoUrl, fileName, btn);
            } else {
                alert("Please play video first!");
            }
        });

        wrapper.appendChild(btn);
    }

    function scanAll() {
        document.querySelectorAll('.grid-clip-item').forEach(processGridItem);
        processDetailPlayer();
    }

    const observer = new MutationObserver(() => scanAll());
    observer.observe(document.body, { childList: true, subtree: true });

    scanAll();

})();