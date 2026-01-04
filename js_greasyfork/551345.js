// ==UserScript==
// @name         Youtube H.264 60FPS + Disable Audio Normalization (Optimized 2025)
// @namespace    http://www.youtube.com
// @version      2.2.0
// @description  Force H.264, 60FPS and disable audio normalization with low CPU impact
// @match        *://youtube.com/*
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551345/Youtube%20H264%2060FPS%20%2B%20Disable%20Audio%20Normalization%20%28Optimized%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551345/Youtube%20H264%2060FPS%20%2B%20Disable%20Audio%20Normalization%20%28Optimized%202025%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Force H.264 safely ---
    const overrideVideoCodec = () => {
        try {
            const origCanPlayType = HTMLVideoElement.prototype.canPlayType;
            HTMLVideoElement.prototype.canPlayType = function(type) {
                if (type && (type.includes('vp8') || type.includes('vp9') || type.includes('webm') || type.includes('av01'))) {
                    return '';
                }
                return origCanPlayType.call(this, type);
            };
        } catch(e){}

        try {
            if (window.MediaSource) {
                const origIsTypeSupported = MediaSource.isTypeSupported;
                MediaSource.isTypeSupported = function(type) {
                    if (type && (type.includes('vp8') || type.includes('vp9') || type.includes('webm') || type.includes('av01'))) {
                        return false;
                    }
                    return origIsTypeSupported.call(this, type);
                };
            }
        } catch(e){}
    };

    overrideVideoCodec();

    // --- Disable audio normalization ---
    const disableAudioNormalization = (video) => {
        if (video.__yt_custom_processed) return;
        video.__yt_custom_processed = true;

        try {
            video.defaultPlaybackRate = 1.0;
            video.preservesPitch = true;

            if (video.audioTracks) {
                for (let i = 0; i < video.audioTracks.length; i++) {
                    try { video.audioTracks[i].enabled = true; } catch(e){}
                }
            }
        } catch(e){}
    };

    // Zamiast MutationObserver — event listener
    document.addEventListener("loadeddata", (e) => {
        const video = e.target;
        if (video && video.nodeName === "VIDEO") {
            disableAudioNormalization(video);
        }
    }, true);

    // --- Force 60FPS ---
    const force60FPS = () => {
        try {
            const descriptor = Object.getOwnPropertyDescriptor(window, 'ytInitialPlayerResponse');
            if (descriptor && descriptor.set) {
                Object.defineProperty(window, 'ytInitialPlayerResponse', {
                    configurable: true,
                    enumerable: true,
                    set: function(value) {
                        try {
                            if (value?.streamingData?.formats) {
                                value.streamingData.formats.forEach(f => {
                                    if (f.fps && f.fps < 60) {
                                        f.fps = 60;
                                    }
                                });
                            }
                        } catch(e){}
                        descriptor.set.call(this, value);
                    }
                });
            }
        } catch(e){}
    };

    force60FPS();

})();
