// ==UserScript==
// @name         Autoplay Dynamic Feeds Fix
// @description  Forces muted autoplay on all videos, including new ones in feeds (Safari/iOS)
// @match        *://*/*  // Runs on all sites; edit to e.g., https://x.com/* for specific
// @grant        none
// @run-at       document-start
// @version 0.0.1.20251122130515
// @namespace https://greasyfork.org/users/1540459
// @downloadURL https://update.greasyfork.org/scripts/556573/Autoplay%20Dynamic%20Feeds%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/556573/Autoplay%20Dynamic%20Feeds%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableAutoplay(video) {
        if (!video || video.dataset.autoplayFixed) return;

        video.muted = true;
        video.volume = 0;
        video.playsInline = true;
        video.setAttribute('muted', 'muted');
        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('autoplay', 'autoplay');
        video.setAttribute('loop', 'loop');
        video.currentTime = 0;

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.warn('Autoplay retry:', e);
                setTimeout(() => video.play(), 200);
            });
        }

        video.dataset.autoplayFixed = 'true';
    }

    function scanVideos() {
        document.querySelectorAll('video').forEach(enableAutoplay);
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanVideos);
    } else {
        scanVideos();
    }

    // Watch for dynamic videos (scrolling feeds)
    const observer = new MutationObserver(scanVideos);
    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    // Event for loaded videos
    document.addEventListener('loadeddata', (e) => {
        if (e.target.tagName === 'VIDEO') enableAutoplay(e.target);
    }, true);

    // Backup scan every 800ms for stubborn sites
    setInterval(scanVideos, 800);

})();