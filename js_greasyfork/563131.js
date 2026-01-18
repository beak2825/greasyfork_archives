// ==UserScript==
// @name         YouTube Ad Muter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mute only YouTube ads, unmute after ads
// @author       K
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563131/YouTube%20Ad%20Muter.user.js
// @updateURL https://update.greasyfork.org/scripts/563131/YouTube%20Ad%20Muter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let video;
    let wasMutedByScript = false;

    function isAdPlaying() {
        return document.querySelector('.ad-showing');
    }

    function tryToDetectVideo() {
        video = document.querySelector('video');
    }

    setInterval(() => {
        if (!video || video.readyState === 0) {
            tryToDetectVideo();
            return;
        }

        if (isAdPlaying()) {
            if (!video.muted) {
                video.muted = true;
                wasMutedByScript = true;
                console.log('[Ad Muter] Ad detected. Muting video.');
            }
        } else {
            if (wasMutedByScript && video.muted) {
                video.muted = false;
                wasMutedByScript = false;
                console.log('[Ad Muter] Ad ended. Unmuting video.');
            }
        }
    }, 500);
})();
