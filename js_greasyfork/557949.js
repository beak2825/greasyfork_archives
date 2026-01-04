// ==UserScript==
// @name         HTML5 Video Fullscreen Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a fullscreen toggle button to HTML5 videos
// @author       r_hiland
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557949/HTML5%20Video%20Fullscreen%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/557949/HTML5%20Video%20Fullscreen%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Basic styling for the fullscreen button
    if (typeof GM_addStyle === 'function') {
        GM_addStyle(`
            .tm-fs-wrapper {
                position: relative !important;
            }
            .tm-fs-btn {
                position: absolute;
                bottom: 8px;
                right: 8px;
                padding: 4px 6px;
                font-size: 12px;
                line-height: 1;
                background: rgba(0,0,0,0.6);
                color: #fff;
                border: 1px solid rgba(255,255,255,0.8);
                border-radius: 4px;
                cursor: pointer;
                z-index: 999999;
                opacity: 0.8;
            }
            .tm-fs-btn:hover {
                opacity: 1;
            }
        `);
    }

    function toggleFullscreen(video) {
        const doc = document;

        // If already fullscreen, exit
        if (
            doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement
        ) {
            if (doc.exitFullscreen) doc.exitFullscreen();
            else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
            else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
            else if (doc.msExitFullscreen) doc.msExitFullscreen();
            return;
        }

        // Request fullscreen on the video element
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        else if (video.mozRequestFullScreen) video.mozRequestFullScreen();
        else if (video.msRequestFullscreen) video.msRequestFullscreen();
        // Some mobile browsers only support fullscreen via a special API:
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    }

    function addButtonToVideo(video) {
        // Avoid adding multiple buttons to the same video
        if (video.dataset.tmFsBound) return;
        video.dataset.tmFsBound = '1';

        // Make sure the parent can hold an absolutely positioned button
        const parent = video.parentElement;
        if (!parent) return;

        // Add a wrapper class so we can position the button cleanly
        parent.classList.add('tm-fs-wrapper');

        const btn = document.createElement('button');
        btn.textContent = '⛶'; // fullscreen icon-ish
        btn.className = 'tm-fs-btn';

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            toggleFullscreen(video);
        }, { passive: false });

        parent.appendChild(btn);
    }

    function scanForVideos() {
        document.querySelectorAll('video').forEach(addButtonToVideo);
    }

    // Initial scan
    scanForVideos();

    // Watch for videos added later (SPA sites, dynamically loaded content, etc.)
    const observer = new MutationObserver(() => {
        scanForVideos();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
