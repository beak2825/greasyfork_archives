// ==UserScript==
// @name         Instagram Reels Precision-Seek
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  Seek bar at bottom, time display injected exactly to the left of the Save icon.
// @author       arthiccc
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557528/Instagram%20Reels%20Precision-Seek.user.js
// @updateURL https://update.greasyfork.org/scripts/557528/Instagram%20Reels%20Precision-Seek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CSS = `
    .ghost-seek-bar {
        position: absolute; bottom: 0; left: 0; width: 100%; height: 3px;
        background: rgba(255, 255, 255, 0.2); z-index: 1000; cursor: pointer;
        transition: height 0.1s;
    }
    .ghost-seek-bar:hover { height: 6px; }
    .ghost-seek-fill {
        height: 100%; background: #fff; width: 0%;
    }
    .ghost-time-inline {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #f5f5f5; 
        font-size: 13px;
        font-weight: 400;
        vertical-align: middle;
        user-select: none;
    }
    `;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const formatTime = (s) => isFinite(s) ? new Date(s * 1000).toISOString().substr(14, 5) : "0:00";

    function injectUI(video) {
        if (video.dataset.ghostSeek) return;
        video.dataset.ghostSeek = "active";

        // 1. Locate the Save Icon container
        // We look for the section containing the action buttons (Like, Comment, etc)
        const postRoot = video.closest('article') || video.closest('div[role="presentation"]');
        if (!postRoot) return;

        const saveIcon = postRoot.querySelector('svg[aria-label*="Save"], svg[aria-label*="Simpan"]');
        const actionArea = saveIcon ? saveIcon.closest('div').parentElement : null;

        if (!actionArea) return;

        // 2. Create UI Elements
        const bar = document.createElement('div');
        bar.className = 'ghost-seek-bar';
        const fill = document.createElement('div');
        fill.className = 'ghost-seek-fill';
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'ghost-time-inline';
        timeDisplay.textContent = '0:00';

        // Add bar to video container
        const videoContainer = video.parentElement;
        bar.appendChild(fill);
        videoContainer.appendChild(bar);

        // Inject time next to Save icon (insert before the Save button's div)
        saveIcon.closest('div').parentElement.insertBefore(timeDisplay, saveIcon.closest('div'));

        // 3. Logic
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const pct = (video.currentTime / video.duration) * 100;
                fill.style.width = `${pct}%`;
                timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
            }
        });

        bar.addEventListener('click', (e) => {
            const rect = bar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        });

        // Shift + Arrows for seeking
        window.addEventListener('keydown', (e) => {
            if (!e.shiftKey) return;
            if (e.key === 'ArrowRight') video.currentTime += 5;
            if (e.key === 'ArrowLeft') video.currentTime -= 5;
        });
    }

    let scanTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(scanTimer);
        scanTimer = setTimeout(() => {
            document.querySelectorAll('video').forEach(injectUI);
        }, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();