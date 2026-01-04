// ==UserScript==
// @name         Auto Pause Background Videos
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically pause videos when tab is in background and resume when returning
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554809/Auto%20Pause%20Background%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/554809/Auto%20Pause%20Background%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const videoStates = new Map(); // Track video playing states

    function getAllVideos() {
        return Array.from(document.querySelectorAll('video'));
    }

    function pauseAllVideos() {
        const videos = getAllVideos();
        console.log(`[Video Controller] Found ${videos.length} videos, pausing active ones...`);

        videos.forEach(video => {
            try {
                // Check if video is actually playing
                const isPlaying = !video.paused && !video.ended && video.readyState > 2;

                if (isPlaying) {
                    videoStates.set(video, true);
                    video.pause();
                    console.log('[Video Controller] Paused:', video.src || video.currentSrc || 'unknown source');
                } else if (!videoStates.has(video)) {
                    // Mark as not playing if we haven't tracked it yet
                    videoStates.set(video, false);
                }
            } catch (e) {
                console.error('[Video Controller] Error pausing video:', e);
            }
        });
    }

    function resumeVideos() {
        const videos = getAllVideos();
        console.log(`[Video Controller] Resuming previously playing videos...`);

        videos.forEach(video => {
            try {
                const wasPlaying = videoStates.get(video);

                if (wasPlaying === true) {
                    video.play().then(() => {
                        console.log('[Video Controller] Resumed:', video.src || video.currentSrc || 'unknown source');
                    }).catch(e => {
                        console.log('[Video Controller] Could not resume:', e.message);
                    });
                    videoStates.set(video, false); // Reset state
                }
            } catch (e) {
                console.error('[Video Controller] Error resuming video:', e);
            }
        });
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('[Video Controller] Tab hidden - pausing videos');
            pauseAllVideos();
        } else {
            console.log('[Video Controller] Tab visible - resuming videos');
            // Small delay to ensure page is ready
            setTimeout(resumeVideos, 100);
        }
    });

    // Also listen for blur/focus events as backup
    window.addEventListener('blur', function() {
        if (!document.hidden) {
            console.log('[Video Controller] Window blur - pausing videos');
            pauseAllVideos();
        }
    });

    window.addEventListener('focus', function() {
        if (!document.hidden) {
            console.log('[Video Controller] Window focus - resuming videos');
            setTimeout(resumeVideos, 100);
        }
    });

    // Watch for new videos being added
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'VIDEO') {
                    console.log('[Video Controller] New video detected');
                } else if (node.querySelectorAll) {
                    const newVideos = node.querySelectorAll('video');
                    if (newVideos.length > 0) {
                        console.log(`[Video Controller] ${newVideos.length} new video(s) detected`);
                    }
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[Video Controller] Auto Pause Background Videos loaded and active');
    console.log('[Video Controller] Initial videos found:', getAllVideos().length);
})();