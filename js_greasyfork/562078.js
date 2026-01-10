// ==UserScript==
// @name         YouTube Shorts Seek +2s or -2s
// @namespace    nope
// @version      1.4
// @description  Fast forward/slow down for YouTube Shorts
// @author       N.O.P.E
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562078/YouTube%20Shorts%20Seek%20%2B2s%20or%20-2s.user.js
// @updateURL https://update.greasyfork.org/scripts/562078/YouTube%20Shorts%20Seek%20%2B2s%20or%20-2s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const seekAmount = 2;
    let timeoutId;

    const styleId = 'tm-seek-style-v4';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @keyframes seekPop {
                0% { transform: translateX(-50%) scale(0.9); opacity: 0.7; }
                50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
                100% { transform: translateX(-50%) scale(1); opacity: 1; }
            }
            .tm-seek-overlay {
                position: absolute !important; /* Dính vào khung video cha */
                bottom: 150px !important;      /* Cách đáy video 150px (trên phần tên kênh/mô tả) */
                left: 50% !important;
                transform: translateX(-50%) !important;
                background-color: rgba(0, 0, 0, 0.75);
                color: #fff;
                padding: 8px 20px;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                z-index: 2000;
                pointer-events: none; /* Không chặn click chuột */
                font-family: Roboto, Arial, sans-serif;
                text-align: center;
                backdrop-filter: blur(4px);
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: none;
                opacity: 0;
                user-select: none;
            }
            .tm-seek-animate {
                animation: seekPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
        `;
        document.head.appendChild(style);
    }

    function getOverlay(videoContainer) {
        let overlay = videoContainer.querySelector('.tm-seek-overlay');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'tm-seek-overlay';
            videoContainer.appendChild(overlay);
        }
        return overlay;
    }

    function showAnimation(overlay, text) {
        overlay.innerText = text;
        overlay.style.display = 'block';
        overlay.style.opacity = '1';
        overlay.classList.remove('tm-seek-animate');
        void overlay.offsetWidth;
        overlay.classList.add('tm-seek-animate');

        if (overlay.dataset.timeoutId) {
            clearTimeout(Number(overlay.dataset.timeoutId));
        }

        const id = setTimeout(() => {
            overlay.style.transition = 'opacity 0.3s ease';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                overlay.style.transition = '';
            }, 300);
        }, 800);

        overlay.dataset.timeoutId = id;
    }

    const handleKeyPress = (event) => {
        if (!window.location.href.includes('/shorts/')) return;

        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            const activeRenderer = document.querySelector('ytd-reel-video-renderer[is-active]');

            if (activeRenderer) {
                const video = activeRenderer.querySelector('video');
                if (video) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    const overlay = getOverlay(activeRenderer);

                    if (event.key === 'ArrowRight') {
                        video.currentTime = Math.min(video.currentTime + seekAmount, video.duration || Infinity);
                        showAnimation(overlay, `+${seekAmount}s`);
                    } else {
                        video.currentTime = Math.max(video.currentTime - seekAmount, 0);
                        showAnimation(overlay, `-${seekAmount}s`);
                    }
                }
            }
        }
    };

    window.addEventListener('keydown', handleKeyPress, true);

})();