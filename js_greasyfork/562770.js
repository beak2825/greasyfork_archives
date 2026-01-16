// ==UserScript==
// @name         YouTube Speed Control by Scroll
// @namespace    yt-speed-change-with-scroll
// @version      1.0.1
// @description  Change the speed of a YouTube video by scrolling the icon
// @author       Leyson
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562770/YouTube%20Speed%20Control%20by%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/562770/YouTube%20Speed%20Control%20by%20Scroll.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let video;
    let speedBtn;

    function waitForPlayer() {
        const v = document.querySelector('video');
        const controls = document.querySelector('.ytp-right-controls');
        if (!v || !controls) return false;

        video = v;

        if (document.getElementById('yt-speed-scroll-btn')) return true;

        speedBtn = document.createElement('div');
        speedBtn.id = 'yt-speed-scroll-btn';
        speedBtn.textContent = `${video.playbackRate}×`;

        speedBtn.style.cssText = `
            cursor: ns-resize;
            color: #fff;
            font-size: 20px;
            margin-right: 3px;
            margin-left: 15px;
            user-select: none;
            opacity: 0.85;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Scroll - change speed
        speedBtn.addEventListener('wheel', e => {
            e.preventDefault();

            const step = 0.1;
            let rate = video.playbackRate + (e.deltaY < 0 ? step : -step);

            rate = Math.min(16, Math.max(0.1, rate));
            video.playbackRate = +rate.toFixed(2);
            speedBtn.textContent = `${video.playbackRate}×`;
        });

        // Click - speed reset to 1x
        speedBtn.addEventListener('click', e => {
            e.preventDefault();
            video.playbackRate = 1;
            speedBtn.textContent = `1×`;
        });


        controls.prepend(speedBtn);

        video.addEventListener('ratechange', () => {
            speedBtn.textContent = `${video.playbackRate}×`;
        });

        return true;
    }

    const obs = new MutationObserver(() => waitForPlayer());
    obs.observe(document.body, { childList: true, subtree: true });
})();

// Made with AI