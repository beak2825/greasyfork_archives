// ==UserScript==
// @name         YouTube Screenshot (Mobile)
// @namespace    https://greasyfork.org/en/scripts/551134-youtube-screenshot-mobile
// @version      1.0
// @description  Captures the current video frame on YouTube
// @author       Adam Jensen
// @license MIT
// @match        *://m.youtube.com/*
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551134/YouTube%20Screenshot%20%28Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551134/YouTube%20Screenshot%20%28Mobile%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const captureButton = document.createElement('button');
    captureButton.id = 'capture-frame-button-flotante';
    captureButton.innerText = '📸';
    captureButton.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 20px;
        z-index: 9999;
        padding: 10px;
        background-color: #0088AA;
        color: #fff;
        border: none;
        border-radius: 50%; 
        width: 45px;
        height: 45px;
        font-size: 20px;
        line-height: 0;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        cursor: pointer;
        display: none;
    `;

    document.body.appendChild(captureButton);

    const isVideoPage = () => {
        return window.location.pathname === '/watch' && window.location.search.includes('v=');
    };

    const getVideoElement = () => {
        return document.querySelector('video');
    };

    const getVideoId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    };

    function captureFrame() {
        const video = getVideoElement();

        if (!video) {
            alert('Video element not found.');
            return;
        }

        const wasPaused = video.paused;
        video.pause();

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || video.clientWidth;
        canvas.height = video.videoHeight || video.clientHeight;
        const ctx = canvas.getContext('2d');

        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        } catch (e) {
            console.error('Error drawing video to canvas (possible CORS issue):', e);
            alert('Capture error. The video might be CORS protected.');
            if (!wasPaused) video.play();
            return;
        }

        const dataURL = canvas.toDataURL('image/png');

        const videoId = getVideoId() || 'UNKNOWN_ID';
        const now = new Date();
        
        // Format: YYYYMMDD
        const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
        
        // Format: HHMMSS
        const timePart = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        
        const filename = `YouTube_Frame_${videoId}_${datePart}_${timePart}.png`;

        if (typeof GM_download === 'function') {
            GM_download({
                url: dataURL,
                name: filename,
                saveAs: true
            });
            console.log('Capture saved using GM_download.');
        } else {
            const a = document.createElement('a');
            a.href = dataURL;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log('Capture downloaded using fallback.');
        }

        if (!wasPaused) {
            video.play();
        }
    }

    captureButton.addEventListener('click', captureFrame);

    const updateButtonVisibility = () => {
        const shouldShow = isVideoPage() && getVideoElement();
        captureButton.style.display = shouldShow ? 'block' : 'none';

        const video = getVideoElement();
        if (video && (video.webkitDisplayingFullscreen || video.mozDisplayingFullscreen || document.fullscreenElement)) {
             captureButton.style.bottom = '20px';
        } else {
             captureButton.style.bottom = '120px';
        }
    };

    setInterval(updateButtonVisibility, 500);

    updateButtonVisibility();

})();