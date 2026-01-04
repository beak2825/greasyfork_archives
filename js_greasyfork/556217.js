// ==UserScript==
// @name         HTML5 Video Speed Controls
// @namespace    https://github.com/lunagus/html5-video-speed-control
// @version      1.1
// @description  Simple keyboard controls for HTML5 video speed and frame-stepping
// @author       lunagus
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @licence
// @downloadURL https://update.greasyfork.org/scripts/556217/HTML5%20Video%20Speed%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/556217/HTML5%20Video%20Speed%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SPEED_STEP = 0.1;
    let activeVideo = null;

    // UI tooltip system
    let tooltipElement = null;
    let tooltipTimer = null;

    function showTooltip(message) {
        if (!tooltipElement) {
            tooltipElement = document.createElement('div');
            tooltipElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                padding: 8px 16px;
                border-radius: 4px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                z-index: 2147483647;
                pointer-events: none;
                transition: opacity 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            `;
            document.body.appendChild(tooltipElement);
        }

        tooltipElement.textContent = message;
        tooltipElement.style.opacity = '1';
        tooltipElement.style.display = 'block';

        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => {
            tooltipElement.style.opacity = '0';
            setTimeout(() => {
                tooltipElement.style.display = 'none';
            }, 300);
        }, 1500);
    }

    // Smart video detection
    function findBestVideo() {
        const videos = Array.from(document.querySelectorAll('video'));
        if (videos.length === 0) return null;
        if (videos.length === 1) return videos[0];

        const playing = videos.find(v => !v.paused);
        if (playing) return playing;

        return videos.reduce((best, current) => {
            const rect = current.getBoundingClientRect();
            const area = rect.width * rect.height;
            const bestRect = best.getBoundingClientRect();
            const bestArea = bestRect.width * bestRect.height;
            return area > bestArea ? current : best;
        });
    }

    function estimateFPS(video) {
        let fps = 30;
        try {
            const quality = video.getVideoPlaybackQuality();
            if (quality && video.currentTime > 0 && quality.totalVideoFrames > 0) {
                fps = quality.totalVideoFrames / video.currentTime;
            }
        } catch (err) {}
        return fps;
    }

    function stepFrame(video, direction) {
        if (!video || !video.duration) return;

        video.pause();
        const fps = estimateFPS(video);
        const frameDuration = 1 / fps;

        if (direction < 0) {
            video.currentTime = Math.max(0, video.currentTime - frameDuration);
        } else {
            video.currentTime = Math.min(video.duration, video.currentTime + frameDuration);
        }
    }

    function updateActiveVideo() {
        const newVideo = findBestVideo();
        if (newVideo) {
            activeVideo = newVideo;
        }
    }

    function handleKeyPress(e) {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' ||
                       target.tagName === 'TEXTAREA' ||
                       target.isContentEditable)) {
            return;
        }

        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
            return;
        }

        if (!activeVideo || !activeVideo.isConnected) {
            updateActiveVideo();
        }

        if (!activeVideo) return;

        let handled = false;
        let message = '';

        switch (e.key.toLowerCase()) {
            case 'x':
                activeVideo.playbackRate = Math.max(0.1, activeVideo.playbackRate - SPEED_STEP);
                message = `Speed: ${activeVideo.playbackRate.toFixed(1)}x`;
                handled = true;
                break;

            case 'c':
                activeVideo.playbackRate = Math.min(16, activeVideo.playbackRate + SPEED_STEP);
                message = `Speed: ${activeVideo.playbackRate.toFixed(1)}x`;
                handled = true;
                break;

            case 'z':
                activeVideo.playbackRate = 1.0;
                message = 'Speed: 1.0x (Reset)';
                handled = true;
                break;

            case 'q':
                stepFrame(activeVideo, -1);
                message = '◄ Previous Frame';
                handled = true;
                break;

            case 'e':
                stepFrame(activeVideo, 1);
                message = 'Next Frame ►';
                handled = true;
                break;
        }

        if (handled) {
            showTooltip(message);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function init() {
        updateActiveVideo();

        document.addEventListener('keydown', handleKeyPress, true);

        document.addEventListener('play', (e) => {
            if (e.target instanceof HTMLVideoElement) {
                activeVideo = e.target;
            }
        }, true);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) continue;

                    if (node.tagName === 'VIDEO') {
                        updateActiveVideo();
                    } else {
                        const videos = node.querySelectorAll?.('video');
                        if (videos && videos.length > 0) {
                            updateActiveVideo();
                        }
                    }
                }
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    if (document.body) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
