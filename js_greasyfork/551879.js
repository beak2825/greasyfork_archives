// ==UserScript==
// @name         Bunkr .ts File Player
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a video player to Bunkr for .ts files, allowing you to stream them without needing to download first.
// @author       You
// @include      https://bunkr.*/f/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551879/Bunkr%20ts%20File%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/551879/Bunkr%20ts%20File%20Player.meta.js
// ==/UserScript==

(function() {
'use strict';

const LOG_PREFIX = '[Video Player]';
const GATEWAY_URL = "https://gateway.u4582180137.workers.dev/";

function main() {
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImageMeta) {
        return;
    }

    const thumbUrl = ogImageMeta.content;
    const videoUrl = thumbUrl.replace('/thumbs/', '/').replace(/\.png$|\.jpg$|\.jpeg$|\.webp$/, '');

    if (!videoUrl.endsWith('.ts')) {
        return;
    }

    const streamUrl = `${GATEWAY_URL}?url=${encodeURIComponent(videoUrl)}&referer=${encodeURIComponent(window.location.href)}`;

    const injectionPoint = document.querySelector('main.cont');
    if (!injectionPoint) {
        return;
    }

    const container = document.createElement('div');
    container.style.cssText = `
        position: relative;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto 1.5rem auto;
        border-radius: 0.5rem;
        overflow: hidden;
        background-color: #000;
    `;

    const videoPlayer = document.createElement('video');
    videoPlayer.id = 'bunkr-ts-player';
    videoPlayer.controls = true;
    videoPlayer.preload = 'auto';
    videoPlayer.playsInline = true;
    videoPlayer.style.cssText = `
        width: 100%;
        max-height: calc(100vh - 12rem);
        display: block;
        border-radius: 0.5rem;
        aspect-ratio: 16 / 9;
    `;

    const posterOverlay = document.createElement('div');
    posterOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background-image: url('${thumbUrl}');
        background-size: cover;
        background-position: center;
        z-index: 1;
        transition: opacity 0.2s ease-out;
    `;

    const playIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    playIcon.setAttribute('viewBox', '0 0 24 24');
    playIcon.setAttribute('width', '80');
    playIcon.setAttribute('height', '80');
    playIcon.style.cssText = `filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transition: transform 0.1s ease-in-out;`;
    playIcon.innerHTML = `<path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M9.5,16.5v-9l7,4.5L9.5,16.5z" fill="rgba(255, 255, 255, 0.8)"/>`;
    posterOverlay.appendChild(playIcon);

    posterOverlay.addEventListener('mouseover', () => playIcon.style.transform = 'scale(1.1)');
    posterOverlay.addEventListener('mouseout', () => playIcon.style.transform = 'scale(1)');
    posterOverlay.addEventListener('click', () => {
        posterOverlay.style.opacity = '0';
        setTimeout(() => { posterOverlay.style.display = 'none'; }, 200);
        videoPlayer.play().catch(e => console.error(`${LOG_PREFIX} Play failed:`, e));
    });

    container.appendChild(videoPlayer);
    container.appendChild(posterOverlay);
    injectionPoint.parentNode.insertBefore(container, injectionPoint.nextSibling);

    loadPlayer(videoPlayer, streamUrl);
}

function loadPlayer(video, streamUrl) {
    if (typeof mpegts === 'undefined') {
        const mpegtsScript = document.createElement('script');
        mpegtsScript.src = 'https://cdn.jsdelivr.net/npm/mpegts.js@1.7.3/dist/mpegts.min.js';
        mpegtsScript.async = true;
        mpegtsScript.onload = () => {
            initPlayer(video, streamUrl);
        };
        mpegtsScript.onerror = () => {
            console.error(`${LOG_PREFIX} Failed to load mpegts.js`);
        };
        document.head.appendChild(mpegtsScript);
    } else {
        initPlayer(video, streamUrl);
    }
}

let playerInstance = null;

function initPlayer(video, streamUrl) {
    if (!mpegts.getFeatureList().mseLivePlayback) {
        console.error(`${LOG_PREFIX} MSE not supported`);
        return;
    }

    const player = mpegts.createPlayer({
        type: 'mpegts',
        isLive: false,
        url: streamUrl,
    }, {
        enableWorker: false,
        enableStashBuffer: true,
        stashInitialSize: 128,
        isLive: false,
        autoCleanupSourceBuffer: false,
        fixAudioTimestampGap: true,
        lazyLoad: false,
        seekType: 'range',
        rangeLoadZeroStart: false,
        liveBufferLatencyChasing: false,
    });

    playerInstance = player;
    player.attachMediaElement(video);
    player.load();

    let errorCount = 0;
    const MAX_ERRORS = 3;
    let isSeeking = false;

    player.on(mpegts.Events.ERROR, (errorType, errorDetail, errorInfo) => {
        console.error(`${LOG_PREFIX} Player error:`, errorType, errorDetail, errorInfo);

        if (isSeeking) {
            console.warn(`${LOG_PREFIX} Ignoring error during seek`);
            return;
        }

        errorCount++;

        if (errorCount <= MAX_ERRORS) {
            console.warn(`${LOG_PREFIX} Attempting recovery (${errorCount}/${MAX_ERRORS})...`);

            const currentTime = video.currentTime;
            const wasPaused = video.paused;

            setTimeout(() => {
                try {
                    player.unload();
                    player.detachMediaElement();
                    player.destroy();

                    initPlayer(video, streamUrl);

                    video.addEventListener('loadedmetadata', function restorePosition() {
                        video.currentTime = currentTime;
                        if (!wasPaused) {
                            video.play();
                        }
                        video.removeEventListener('loadedmetadata', restorePosition);
                    }, { once: true });
                } catch (e) {
                    console.error(`${LOG_PREFIX} Recovery failed:`, e);
                }
            }, 1000);
        } else {
            console.error(`${LOG_PREFIX} Max recovery attempts reached. Please refresh.`);
        }
    });

    player.on(mpegts.Events.LOADING_COMPLETE, () => {
        errorCount = 0;
    });

    video.addEventListener('seeking', () => {
        isSeeking = true;
    });

    video.addEventListener('seeked', () => {
        setTimeout(() => {
            isSeeking = false;
        }, 500);
    });

    let stallTimeout;
    video.addEventListener('waiting', () => {
        clearTimeout(stallTimeout);
        stallTimeout = setTimeout(() => {
            if (video.readyState < 3 && !video.paused) {
                console.warn(`${LOG_PREFIX} Playback stalled, attempting to continue...`);
                video.play().catch(() => {});
            }
        }, 2000);
    });

    video.addEventListener('playing', () => {
        clearTimeout(stallTimeout);
    });

    video.addEventListener('error', (e) => {
        console.error(`${LOG_PREFIX} Video error:`, e);
    });

    window.addEventListener('beforeunload', () => {
        if (playerInstance) {
            playerInstance.pause();
            playerInstance.unload();
            playerInstance.detachMediaElement();
            playerInstance.destroy();
            playerInstance = null;
        }
    });
}

main();

})();