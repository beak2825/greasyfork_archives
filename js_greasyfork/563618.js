// ==UserScript==
// @name         YouTube Auto HD
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Tự động đặt chất lượng video YouTube lên 1080p hoặc 720p
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563618/YouTube%20Auto%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/563618/YouTube%20Auto%20HD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function setQuality() {
        const player = document.querySelector('video');
        const ytPlayer = document.getElementById('movie_player');

        if (!ytPlayer || !ytPlayer.getAvailableQualityLevels) return;

        const levels = ytPlayer.getAvailableQualityLevels();

        if (levels.includes('hd1080')) {
            ytPlayer.setPlaybackQualityRange('hd1080');
        } else if (levels.includes('hd720')) {
            ytPlayer.setPlaybackQualityRange('hd720');
        } else if (levels.length > 0) {
            ytPlayer.setPlaybackQualityRange(levels[0]);
        }
    }

    // Đợi video load
    setInterval(setQuality, 2000);
})();
