// ==UserScript==
// @name         Facebook Reels - Auto Unmutes and Lowers Volume
// @version      1.0.1
// @description  This auto unmutes Facebook Reels and plays them at a lower volume.
// @author       makewebsitesbetter
// @namespace    userscripts
// @icon         https://i.postimg.cc/3NMLffrh/greenbox.png
// @match        *://*.facebook.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560016/Facebook%20Reels%20-%20Auto%20Unmutes%20and%20Lowers%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/560016/Facebook%20Reels%20-%20Auto%20Unmutes%20and%20Lowers%20Volume.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const TARGET_VOLUME = 0.04; // 4% volume (CHANGE THIS TO WHAT YOU WANT, ANYTHING BETWEEN 0.01 AND 0.99)

    function manageAudio() {
        // 1. Look for the volume button and click it first.
        // This is done first so that if clicking resets the volume to 100%, the code below catches it instantly.
        const unmuteButtons = document.querySelectorAll('[aria-label="Unmute"][role="button"]');

        unmuteButtons.forEach(btn => {
            // Only click if the video is visible so any hidden videos won't get unmuted.
            if (btn.offsetParent !== null) {
                btn.click();
                // console.log("Script: Clicked unmute button to fix icon");
            }
        });

        // 2. Look at the actual video player to ensure that the volume is correct.
        // This runs immediately after the click in the same millisecond.
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            // If the button click above set volume to 1.0 (full blast), this snaps it back to 4% instantly.
            if (video.volume === 1.0) {
                video.volume = TARGET_VOLUME;
            }

            // If the video is currently muted, set the volume low now so that when it un-mutes, it is already at 4%.
            if (video.muted) {
                video.volume = TARGET_VOLUME;
            }
        });
    }

    // Run this check 100 times a second (every 10ms) to catch the start immediately.
    setInterval(manageAudio, 10);

})     ();