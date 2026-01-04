// ==UserScript==
// @name         speexx自动播放脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  speexx自动播放
// @author       cYx
// @match        https://portal.speexx.cn/articles/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555180/speexx%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555180/speexx%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the play button and click it
        var playButton = document.querySelector('.vjs-big-play-button');
        if (playButton) {
            playButton.click();
        }

        // Function to check remaining time and click overlay when video ends
        function checkVideoEnd() {
            var timeDisplay = document.querySelector('.vjs-remaining-time-display');
            if (timeDisplay && timeDisplay.textContent === '0:00') {
                var overlay = document.querySelector('.library-box-info');
                if (overlay) {
                    overlay.click();
                    console.log('Video ended, overlay clicked');
                }
            }
        }

        // Check every second if video has ended
        setInterval(checkVideoEnd, 1000);
    });

})();