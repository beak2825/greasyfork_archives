// ==UserScript==
// @name         Motherless Download video fix 2025
// @namespace     Motherless Download video fix 2025
// @version      1.0
// @match        https://motherless.com/*
// @grant        none
// @description Instant download via <a download>, no GM_download, max speed
// @downloadURL https://update.greasyfork.org/scripts/558763/Motherless%20Download%20video%20fix%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/558763/Motherless%20Download%20video%20fix%202025.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findVideo() {
        return document.querySelector('video source[src*=".mp4"]');
    }

    function addButton(videoUrl) {
        if (document.getElementById('ml-fast-download')) return;

        const btn = document.createElement('a');
        btn.id = 'ml-fast-download';
        btn.href = videoUrl;
        btn.setAttribute('download', '');
        btn.textContent = '⬇ Скачать (MP4)';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background: #bb3424;
            color: #fff;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            text-decoration: none;
            box-shadow: 0 4px 10px rgba(0,0,0,.4);
        `;

        document.body.appendChild(btn);
    }

    const observer = new MutationObserver(() => {
        const src = findVideo();
        if (src && src.src) {
            addButton(src.src);
            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
