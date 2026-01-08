// ==UserScript==
// @name         Auto Scroll YouTube Shorts
// @namespace    facelook.hk
// @version      1.5
// @description  Automatically scrolls to the next YouTube short when the current one finishes or if a specific ad class is detected.
// @author       FacelookHK
// @match        https://www.youtube.com/shorts/*
// @match        https://www.facebook.com/reel/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559227/Auto%20Scroll%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/559227/Auto%20Scroll%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let moving = false;
    let lastCurrentTime = -1;
    let lastPlayedTime = 0;
    let lastVideoElement = null;
    let lastVideoSrc = "";
    let paused = false;

    function moveToNextShort() {
        // Reset state
        lastCurrentTime = -1;
        lastPlayedTime = 0;
        lastVideoElement = null;
        lastVideoSrc = "";

        if (moving) return;

        moving = true;
        paused = true; // Ensure we stay paused during the action

        const currentUrl = window.location.href;

        if (currentUrl.indexOf('youtube') != -1) {
            const nextButton = document.querySelector(
                'button.yt-spec-button-shape-next[aria-label="Next video"]'
            );
            if (nextButton) {
                nextButton.click();
                console.log("Moved to next video.");
            }
        } else if (currentUrl.indexOf('facebook') != -1) {
            const nextCard = document.querySelector('[aria-label="Next Card"]');
            if (nextCard) {
                nextCard.click();
                console.log("Moved to next video.");
            }
        }

        moving = false;
        // Keep paused for a moment after clicking to let the new video load
        setTimeout(() => { paused = false; }, 500);
    }

    function checkFacebookSliderProgress() {
        if (paused) return false;
        const slider = document.querySelector('[aria-label="Change Position"][role="slider"]');
        if (slider) {
            const currentPosition = parseFloat(slider.getAttribute('aria-valuenow'));
            const maxPosition = parseFloat(slider.getAttribute('aria-valuemax'));

            if (maxPosition - currentPosition <= 0.5) {
                console.log("Facebook video near end. Moving next.");
                paused = true; // BLOCK further checks immediately
                setTimeout(moveToNextShort, 500);
                return true;
            }
        }
        return false;
    }

    function checkYouTubeVideoProgress() {
        if (paused) return;

        // Get the active reel container first
        const activeReel = document.querySelector('ytd-reel-video-renderer[is-active]');

        if (!activeReel) return;

        // 0. Immediate Ad Class Detection
        // Checks if the specific ad component exists within the currently active reel
        const adComponent = activeReel.querySelector('.ytwReelsAdCardButtonedViewModelHostIsClickableAdComponent');
        if (adComponent) {
            console.log("Ad class detected. Moving next immediately.");
            paused = true;
            moveToNextShort();
            return;
        }

        // Check for sponsored badge
        const sponsoredBadge = activeReel.querySelector('div.yt-badge-shape__text');
        if (sponsoredBadge && sponsoredBadge.textContent.trim() === 'Sponsored') {
            console.log("Sponsored video detected. Moving next immediately.");
            paused = true;
            moveToNextShort();
            return;
        }

        const video = activeReel.querySelector('video');

        if (!video) return;

        // Detect new video
        if (video !== lastVideoElement || video.src !== lastVideoSrc) {
            console.log("New video detected. Resetting timers.");
            lastVideoElement = video;
            lastVideoSrc = video.src;
            lastPlayedTime = 0;
            lastCurrentTime = -1;
            return;
        }

        const duration = video.duration;
        const currentTime = video.currentTime;

        // 1. Duration Check (Video Finishing)
        if (!isNaN(duration) && duration > 0 && duration - currentTime <= 0.5) {
            console.log(`Video finishing (Time: ${currentTime}/${duration}). Moving next.`);
            paused = true; // BLOCK further checks immediately
            setTimeout(moveToNextShort, 500);
            return;
        }

        // 2. Loop Detection
        if (lastPlayedTime > 0 && currentTime < 0.5) {
            // Only skip if we were previously near the end (prevent seeking triggers)
            const wasNearEnd = (duration - lastPlayedTime < 1.5);

            if (wasNearEnd) {
                console.log(`Video looped (Last: ${lastPlayedTime}, Dur: ${duration}). Moving next.`);
                paused = true; // BLOCK further checks
                moveToNextShort(); // Move immediately for loops (no delay needed)
                return;
            } else if (lastPlayedTime > 5) {
                console.log(`Manual replay detected (Last: ${lastPlayedTime}). Not skipping.`);
                lastPlayedTime = currentTime;
                lastCurrentTime = currentTime;
                return;
            }
        }

        lastCurrentTime = currentTime;
        lastPlayedTime = currentTime;
    }

    if (window.location.href.indexOf('facebook') != -1) {
        setInterval(checkFacebookSliderProgress, 500);
    } else if (window.location.href.indexOf('youtube') != -1) {
        setInterval(checkYouTubeVideoProgress, 250);
    }
})();
