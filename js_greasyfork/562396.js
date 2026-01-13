// ==UserScript==
// @name         YouTube Jump to Time or Percentage
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Jump to a specific timestamp (e.g. 01:23) or percentage (e.g. 50%) in YouTube videos via hotkey Option+J (Alt+J on Windows/Linux).
// @author       cicero.elead.apollonius@gmail.com
// @match        https://www.youtube.com/watch*
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/562396/YouTube%20Jump%20to%20Time%20or%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/562396/YouTube%20Jump%20to%20Time%20or%20Percentage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function jumpTo(input) {
        const video = document.querySelector('video');
        if (!video) return;

        input = input.trim();

        if (input.endsWith('%')) {
            // Handle percentage
            const percent = parseFloat(input.slice(0, -1));
            if (!isNaN(percent) && percent >= 0 && percent <= 100) {
                video.currentTime = video.duration * (percent / 100);
            }
        } else {
            // Handle timestamp like HH:MM:SS or MM:SS
            const parts = input.split(':').map(Number);
            if (parts.some(isNaN)) return;

            let seconds = 0;
            if (parts.length === 3) {
                seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            } else if (parts.length === 2) {
                seconds = parts[0] * 60 + parts[1];
            } else if (parts.length === 1) {
                seconds = parts[0];
            }
            video.currentTime = Math.min(seconds, video.duration);
        }
    }

    // Hotkey: Option/Alt + J
    document.addEventListener('keydown', (e) => {
        if (!e.altKey && !e.shiftKey && !e.ctrlKey && e.metaKey && e.code === 'KeyJ') {
            const input = prompt("Examples: 1:02:03, 25%");
            if (input) jumpTo(input);
        }
    });
})();
