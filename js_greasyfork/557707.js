// ==UserScript==
// @name         YouTube Actual Time
// @namespace    https://nirewen.dev
// @version      2025.12.02
// @description  Display actual time and when a video ends
// @author       Nirewen
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557707/YouTube%20Actual%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/557707/YouTube%20Actual%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function secondsToDHMS(value) {
        const d = Math.floor(value / 86400);
        const h = Math.floor((value % 86400) / 3600);
        const m = Math.floor((value % 3600) / 60);
        const s = Math.floor(value % 60);

        const days = d > 0 ? d + ':' : ''
        const hours = h.toString().padStart(2,'0')
        const minutes = m.toString().padStart(2,'0')
        const seconds = s.toString().padStart(2,'0')

        return `${days}${hours}:${minutes}:${seconds}`;
    }

    function updateTimeDisplay() {
        const video = document.querySelector('.video-stream.html5-main-video');
        if (!video || isNaN(video.duration)) return;
        const times = document.querySelector('.ytp-time-contents') || document.querySelector('.ytp-time-display');

        const totalAtRate = video.duration / video.playbackRate;
        const actualTime = secondsToDHMS(totalAtRate);
        const rateText = video.playbackRate !== 1 ? ` (${actualTime} @ ${video.playbackRate}x)` : '';

        let actualTimeSpan = document.querySelector('.ytp-actual-time');
        if (!actualTimeSpan) {
            actualTimeSpan = document.createElement('span');
            actualTimeSpan.className = 'ytp-actual-time';
            times?.appendChild(actualTimeSpan);
        }
        actualTimeSpan.textContent = rateText;

        const remainingSec = (video.duration - video.currentTime) / video.playbackRate;
        const finishDate = new Date(Date.now() + remainingSec * 1000);
        const showDate = remainingSec >= 10 * 3600;

        let finishText = showDate
        ? finishDate.toLocaleDateString([], {month: 'short', day: 'numeric'}) + ' ' +
            finishDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        : finishDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

        let finishTimeSpan = document.querySelector('.ytp-finish-time');
        if (!finishTimeSpan) {
            finishTimeSpan = document.createElement('span');
            finishTimeSpan.className = 'ytp-finish-time';
            times?.appendChild(finishTimeSpan);
        }
        finishTimeSpan.textContent = ` ends at ${finishText}`;
    }

    function setupVideoListeners() {
        const video = document.querySelector('.video-stream.html5-main-video');
        if (!video) return;

        ['loadedmetadata', 'play', 'ratechange', 'seeked', 'timeupdate'].forEach(event => {
            video.addEventListener(event, updateTimeDisplay);
        });

        updateTimeDisplay();
    }

    function handleNavigation() {
        if (location.pathname !== '/watch') return;

        const interval = setInterval(() => {
            if (document.querySelector('.video-stream.html5-main-video')) {
                clearInterval(interval);
                setupVideoListeners();
            }
        }, 100);
    }

    window.addEventListener('yt-navigate-finish', handleNavigation);

    if (document.readyState === 'complete') {
        handleNavigation();
    } else {
        window.addEventListener('load', handleNavigation);
    }
})();