// ==UserScript==
// @name         Facebook Reels - Prevent Auto Replay
// @namespace    https://greasyfork.org/en/users/1317369-bishoy-asaad
// @version      1.1.0
// @description  Prevents Facebook Reels from automatically replaying after they finish playing
// @author       Bishoy
// @license      MIT
// @match        https://www.facebook.com/*
// @icon         https://www.facebook.com/favicon.ico
// @homepage     https://greasyfork.org/en/scripts/553664-facebook-reels-prevent-auto-replay
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/553664/Facebook%20Reels%20-%20Prevent%20Auto%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/553664/Facebook%20Reels%20-%20Prevent%20Auto%20Replay.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log('🚫 Facebook Reels No Auto-Replay script started');
    let lastVideo = null;
    let isReelsPage = false;

    // Check if current URL is a reels page
    function checkIfReelsPage() {
        const currentUrl = window.location.href;
        const wasReelsPage = isReelsPage;
        isReelsPage = currentUrl.includes('/reel/');
        
        if (isReelsPage && !wasReelsPage) {
            console.log('📍 Navigated to Reels page');
            // Reset video tracking when entering reels
            lastVideo = null;
        }
        
        return isReelsPage;
    }

    function preventAutoReplay(video) {
        if (!video || !checkIfReelsPage()) return;
        
        // Prevent duplicate listeners
        if (video.dataset.noReplayAttached === 'true') return;
        video.dataset.noReplayAttached = 'true';
        console.log('🎥 Attaching no-replay listener to video');
        
        // Remove the loop attribute if it exists
        video.removeAttribute('loop');
        video.loop = false;
        
        // Listen for the ended event
        video.addEventListener('ended', () => {
            console.log('🎬 Video ended - preventing replay');
            // Pause the video to prevent replay
            video.pause();
            // Set currentTime to the end to keep it there
            video.currentTime = video.duration;
            videoEndedAndPaused = true;
            // Show visual feedback (optional)
            console.log('✅ Auto-replay prevented');
        });
        
        // Track if video has played to near the end and if it's paused
        let hasReachedEnd = false;
        let videoEndedAndPaused = false;
        
        video.addEventListener('timeupdate', () => {
            // Mark when video is near the end (last 0.5 seconds)
            if (video.duration - video.currentTime < 0.5 && video.currentTime > 0) {
                hasReachedEnd = true;
            }
            
            // If video has reached end and suddenly jumps back to beginning while NOT manually restarted
            if (hasReachedEnd && video.currentTime < 1 && !video.paused && videoEndedAndPaused) {
                video.pause();
                video.currentTime = video.duration;
                console.log('🛑 Caught loop attempt - paused video');
                hasReachedEnd = false; // Reset flag
            }
        });
        
        // Allow manual replay by detecting user interaction
        video.addEventListener('play', () => {
            if (videoEndedAndPaused && video.currentTime < 1) {
                // User manually restarted the video
                console.log('▶️ Manual replay detected - allowing playback');
                videoEndedAndPaused = false;
                hasReachedEnd = false;
            }
        });
        
        // Ensure loop is always disabled
        const loopObserver = new MutationObserver(() => {
            if (video.loop === true) {
                video.loop = false;
                console.log('🔄 Disabled loop attribute');
            }
        });
        
        loopObserver.observe(video, {
            attributes: true,
            attributeFilter: ['loop']
        });
    }

    function watchForNewVideo() {
        const observer = new MutationObserver(() => {
            if (!checkIfReelsPage()) return;
            
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (video !== lastVideo) {
                    lastVideo = video;
                    preventAutoReplay(video);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Also attach to any existing videos on load
        if (checkIfReelsPage()) {
            const existingVideos = document.querySelectorAll('video');
            existingVideos.forEach(video => {
                lastVideo = video;
                preventAutoReplay(video);
            });
        }
    }

    // Monitor URL changes (for client-side navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log('🔄 URL changed:', currentUrl);
            checkIfReelsPage();
        }
    }).observe(document, { subtree: true, childList: true });

    // Also listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', () => {
        console.log('⬅️ Navigation detected (popstate)');
        checkIfReelsPage();
    });

    // Start watching for videos
    checkIfReelsPage();
    watchForNewVideo();
    console.log('✅ No Auto-Replay script initialized');
})();