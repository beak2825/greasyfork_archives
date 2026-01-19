// ==UserScript==
// @name            YouTube Scroll Speed & Volume Controller
// @name:ja         YouTube Scroll Speed & Volume Controller
// @name:en         YouTube Scroll Speed & Volume Controller
// @description     Change Volume and PlaybackSpeed by scroll on YouTube (includes embed)
// @description:ja  YouTubeの動画の音量・再生速度をスクロールで変更できるようにします。
// @description:en  Change Volume and PlaybackSpeed by scroll on YouTube (includes embed)
// @match           https://www.youtube.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant           GM_addStyle
// @namespace       kyen_ytsvc
// @license         MIT
// @version         1.1
// @downloadURL https://update.greasyfork.org/scripts/563167/YouTube%20Scroll%20Speed%20%20Volume%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/563167/YouTube%20Scroll%20Speed%20%20Volume%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        volStep: 1,
        speedStep: 0.1,
        minSpeed: 0.1,
        maxSpeed: 16.0
    };
    let hudTimer;

    GM_addStyle(`
        .ytsvc-hud {
            position: absolute !important;
            top: 10% !important;
            left: 50% !important;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.6);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 2rem;
            z-index: 2147483647;
            opacity: 0;
            transition: opacity 0.2s;
            backdrop-filter: blur(3px);
            pointer-events: none;
            font-family: Roboto, Arial, sans-serif;
        }
        .ytsvc-hud.show {
            opacity: 1;
        }
        .ytsvc-embed-speed-control-container {
            align-items: center;
        }
        .ytsvc-speed-control-container  {
            align-items: center;
            display: flex !important;
            justify-content: center !important;
        }
    `);

    const showHud = (text) => {
        const player = document.querySelector('#movie_player') || document.querySelector('ytd-player');
        if (!player) return;

        let hud = player.querySelector('.ytsvc-hud');
        if (!hud) {
            hud = document.createElement('div');
            hud.className = 'ytsvc-hud';
            player.appendChild(hud);
        }
        hud.textContent = text;
        hud.classList.add('show');
        clearTimeout(hudTimer);
        hudTimer = setTimeout(() => hud.classList.remove('show'), 1000);
    };

    const updateSpeed = (video, newSpeed) => {
        const speed = Math.round(Math.max(config.minSpeed, Math.min(config.maxSpeed, newSpeed)) * 10) / 10;
        video.playbackRate = speed;
        showHud(`${speed.toFixed(1)}x`);
        const disp = document.querySelector('.ytsvc-speed-control-container') || document.querySelector('.ytsvc-embed-speed-control-container');
        if (disp) disp.textContent = `${speed.toFixed(1)}x`;
    };

    setInterval(() => {
        const rightControls = document.querySelector('.ytp-right-controls');
        const video = document.querySelector('video');
        if (!rightControls || !video || document.querySelector('.ytsvc-speed-control-container') || document.querySelector('.ytsvc-embed-speed-control-container')) return;

        const isEmbed = window.location.pathname.includes('/embed/') || document.querySelector('.ytp-embed');
        const container = document.createElement('div');

        container.className = isEmbed ? 'ytp-button ytsvc-embed-speed-control-container' : 'ytp-button ytsvc-speed-control-container';
        container.textContent = `${video.playbackRate.toFixed(1)}x`;

        // speed-control-container上でwheel -> ±0.1ずつ速度変更
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            updateSpeed(video, video.playbackRate + (e.deltaY < 0 ? config.speedStep : -config.speedStep));
        }, { passive: false });
        container.addEventListener('click', (e) => {
            e.preventDefault();
            updateSpeed(video, 1.0);
        }, true);

        rightControls.prepend(container);
    }, 1000);

    window.addEventListener('wheel', (e) => {
        const video = document.querySelector('video');
        const player = e.target.closest('#movie_player');
        if (!video || !player) return;

        // player上で shift+wheel -> 横スクロールの判定をブロックし、縦スクロールとしてreturn
        if (e.shiftKey) {
            e.preventDefault();
            window.scrollBy({
                top: e.deltaY,
                left: 0,
                behavior: 'auto'
            });
            return;
        }

        // player上で ctrl+wheel -> 速度変更
        if (e.ctrlKey) {
            e.preventDefault();
            updateSpeed(video, video.playbackRate + (e.deltaY < 0 ? config.speedStep : -config.speedStep));
            return;
        }

        // player上で wheel -> 音量変更
        if (!e.ctrlKey && !e.altKey) {
            if (player.classList.contains('ytp-settings-shown')) return;
            e.preventDefault();
            const currentVol = player.getVolume();
            const nextVol = Math.max(0, Math.min(100, currentVol + (e.deltaY < 0 ? config.volStep : -config.volStep)));
            player.setVolume(nextVol);
            if (nextVol > 0 && player.isMuted()) player.unMute();
            showHud(`${nextVol}%`);
        }
    }, { passive: false, capture: true });

    // player上で ctrl+click -> 1.0xにリセット
    window.addEventListener('click', (e) => {
        if (e.ctrlKey) {
            const video = document.querySelector('video');
            if (video) {
                e.preventDefault();
                updateSpeed(video, 1.0);
            }
        }
    }, { capture: true });

})();