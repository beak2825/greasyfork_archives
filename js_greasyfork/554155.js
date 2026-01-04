// ==UserScript==
// @name         Tumblr Video Autoplay Blocker + Keyboard Control
// @namespace    https://github.com/aeit/tampermonkey-tumblr-video-control
// @version      31.2.2
// @description  P — play with sound, O — muted, M — toggle mute. No autoplay.
// @author       aeit
// @match        *://*.tumblr.com/*
// @match        *://tumblr.com/*
// @homepageURL  https://github.com/aeit/tumblr-video-control
// @supportURL   https://github.com/aeit/tumblr-video-control/issues
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554155/Tumblr%20Video%20Autoplay%20Blocker%20%2B%20Keyboard%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/554155/Tumblr%20Video%20Autoplay%20Blocker%20%2B%20Keyboard%20Control.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const origPlay = HTMLMediaElement.prototype.play;
    let userInteractionFlag = false;

    // Intercept play()
    HTMLMediaElement.prototype.play = function(...args) {
        if (!this.dataset.userAllowed && !userInteractionFlag) {
            console.log('[TM] Blocked autoplay');
            this.dataset.tmBlocked = '1';
            return Promise.reject(new DOMException('Play request was interrupted', 'NotAllowedError'));
        }
        return origPlay.apply(this, args);
    };

    // Block event 'play'
    document.addEventListener('play', e => {
        const video = e.target;
        if (video.tagName === 'VIDEO' && !video.dataset.userAllowed && !userInteractionFlag) {
            e.stopImmediatePropagation();
            video.pause();
            video.dataset.tmBlocked = '1';
        }
    }, true);

    // New videos processing
    function processVideo(video) {
        if (!video.dataset.userAllowed && !video.dataset.tmBlocked) {
            video.dataset.tmBlocked = '1';
            if (!video.paused) {
                video.pause();
            }
        }
    }

    // Search video in viewport center
    function findCenterVideo() {
        const videos = Array.from(document.querySelectorAll('video'));
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;
        let closestVideo = null;
        let minDistance = Infinity;
        videos.forEach(video => {
            const rect = video.getBoundingClientRect();
            const videoCenter = rect.top + rect.height / 2;
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const distance = Math.abs(videoCenter - viewportCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestVideo = video;
                }
            }
        });
        return closestVideo;
    }

    // MutationObserver for new videos
    const observer = new MutationObserver(muts => {
        for (const m of muts) {
            for (const node of m.addedNodes) {
                if (node instanceof HTMLVideoElement) {
                    processVideo(node);
                } else if (node.nodeType === 1) {
                    node.querySelectorAll('video').forEach(processVideo);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Clicks processing
    document.addEventListener('click', e => {
        const video = e.target.closest('video');
        const videoContainer = e.target.closest('[aria-label="Video Player"]');
        if (video || videoContainer) {
            const actualVideo = video || videoContainer.querySelector('video');
            if (actualVideo && actualVideo.dataset.tmBlocked) {
                userInteractionFlag = true;
                actualVideo.dataset.userAllowed = '1';
                delete actualVideo.dataset.tmBlocked;
                actualVideo.muted = false;
                actualVideo.play().then(() => {
                    
                }).catch(err => {
                    console.warn('[TM] Play failed:', err);
                }).finally(() => {
                    userInteractionFlag = false;
                });
            }
        }
    }, true);
    // Keys control
    document.addEventListener('keydown', e => {
        // Doesn't work if focus is in a text field
        if (e.target.matches('input, textarea, [contenteditable="true"]')) {
            return;
        }

        // Key P - play/pause
        if (e.code === 'KeyP') {
            e.preventDefault();
            const closestVideo = findCenterVideo();

            if (closestVideo) {
                // If the video is blocked - allow it
                if (closestVideo.dataset.tmBlocked) {
                    userInteractionFlag = true;
                    closestVideo.dataset.userAllowed = '1';
                    delete closestVideo.dataset.tmBlocked;
                    closestVideo.muted = false;
                    userInteractionFlag = false;
                }
                // Mouse click emulation
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                closestVideo.dispatchEvent(clickEvent);
                requestAnimationFrame(() => {
                    closestVideo.muted = false;
                });
            }
        }

        // Key O - play/pause muted
        if (e.code === 'KeyO') {
            e.preventDefault();
            const closestVideo = findCenterVideo();

            if (closestVideo) {
                if (closestVideo.dataset.tmBlocked) {
                    userInteractionFlag = true;
                    closestVideo.dataset.userAllowed = '1';
                    delete closestVideo.dataset.tmBlocked;
                    userInteractionFlag = false;
                }
                // Mouse click emulation
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    button: 0
                });
                closestVideo.dispatchEvent(clickEvent);
                requestAnimationFrame(() => {
                    closestVideo.muted = true;
                });
            }

            if (!closestVideo.paused && !closestVideo.dataset.tmBlocked) {
                closestVideo.pause();
                return;
            }
        }

        // Key M - mute/unmute
        if (e.code === 'KeyM') {
            e.preventDefault();
            const closestVideo = findCenterVideo();

            if (closestVideo) {
                closestVideo.muted = !closestVideo.muted;
            }
        }
    });
    // Process existing videos when uploading
    setTimeout(() => {
        document.querySelectorAll('video').forEach(processVideo);
    }, 500);
    console.log('[TM] Tumblr Video Control initialized (P key for play/pause, M key for mute/unmute, O key for play/pause muted)');
})();