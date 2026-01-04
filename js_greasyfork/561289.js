// ==UserScript==
// @name         Bilibili Special Frame Auto Skip
// @namespace    https://www.bilibili.com/
// @version      1.0
// @description  Detect special black frame and go to next video automatically
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561289/Bilibili%20Special%20Frame%20Auto%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/561289/Bilibili%20Special%20Frame%20Auto%20Skip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CHECK_INTERVAL_MS = 1000;     // how often to check frames
    const START_TIME = 8 * 60;          // 8 minutes
    const BLACK_THRESHOLD = 30;         // pixel brightness considered "black"
    const WHITE_THRESHOLD = 200;        // pixel brightness considered "white"
    const MIN_WHITE_RATIO = 0.002;      // a few white pixels
    const MAX_WHITE_RATIO = 0.05;       // but not too many
    const BLACK_RATIO_REQUIRED = 0.85;  // mostly black frame

    let triggered = false;

    function getVideoElement() {
        return document.querySelector('video');
    }

    function detectSpecialFrame(video) {
        const canvas = document.createElement('canvas');
        const width = 160;
        const height = 90;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        const data = ctx.getImageData(0, 0, width, height).data;

        let blackCount = 0;
        let whiteCount = 0;
        const totalPixels = width * height;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;

            if (brightness < BLACK_THRESHOLD) {
                blackCount++;
            } else if (brightness > WHITE_THRESHOLD) {
                whiteCount++;
            }
        }

        const blackRatio = blackCount / totalPixels;
        const whiteRatio = whiteCount / totalPixels;

        return (
            blackRatio > BLACK_RATIO_REQUIRED &&
            whiteRatio > MIN_WHITE_RATIO &&
            whiteRatio < MAX_WHITE_RATIO
        );
    }

    function gotoNextVideo() {
        console.log('gotoNextVideo');
        const video = document.querySelector('video');
        if (video) {
            video.currentTime = video.duration - 0.1;
        }
    }

    const titleEl = document.querySelector(
        '#viewbox_report > div.video-info-title > div > h1'
    );

    const REQUIRED_TEXT = '【4K】爱上女主播';
    if (titleEl && titleEl.textContent.includes(REQUIRED_TEXT)) {
       const interval = setInterval(() => {
           console.log('checking');
           if (triggered) {
               clearInterval(interval);
               return;
           }

           const video = getVideoElement();
           if (!video || video.currentTime < START_TIME || video.paused) {
               return;
           }

           if (detectSpecialFrame(video)) {
               if (gotoNextVideo()) {
                   triggered = true;
                   clearInterval(interval);
               }
           }
       }, CHECK_INTERVAL_MS);
    } else {
         console.log('skip do nothing');
    }

})();
