// ==UserScript==
// @name         YouTube Jump to Time or Percentage
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Jump to a specific timestamp (e.g. 01:23, 00:26:45,600) or percentage (e.g. 50%) via Command+J.
// @author       cicero.elead.apollonius@gmail.com
// @match        https://www.youtube.com/watch*
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/562396/YouTube%20Jump%20to%20Time%20or%20Percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/562396/YouTube%20Jump%20to%20Time%20or%20Percentage.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function parseTimestamp(input) {
        // Normalize millisecond separator: "," → "."
        input = input.replace(',', '.');

        const parts = input.split(':');
        if (parts.some(p => p.trim() === '')) return null;

        let seconds = 0;

        if (parts.length === 3) {
            // HH:MM:SS(.mmm)
            seconds =
                Number(parts[0]) * 3600 +
                Number(parts[1]) * 60 +
                Number(parts[2]);
        } else if (parts.length === 2) {
            // MM:SS(.mmm)
            seconds =
                Number(parts[0]) * 60 +
                Number(parts[1]);
        } else if (parts.length === 1) {
            // SS(.mmm)
            seconds = Number(parts[0]);
        } else {
            return null;
        }

        return isNaN(seconds) ? null : seconds;
    }

    function jumpTo(input) {
        const video = document.querySelector('video');
        if (!video) return;

        input = input.trim();

        // Percentage
        if (input.endsWith('%')) {
            const percent = parseFloat(input.slice(0, -1));
            if (!isNaN(percent) && percent >= 0 && percent <= 100) {
                video.currentTime = video.duration * (percent / 100);
            }
            return;
        }

        // Timestamp
        const seconds = parseTimestamp(input);
        if (seconds !== null) {
            video.currentTime = Math.min(seconds, video.duration);
        }
    }

    // Hotkey: Command + J (macOS)
    document.addEventListener('keydown', (e) => {
        if (!e.altKey && !e.shiftKey && !e.ctrlKey && e.metaKey && e.code === 'KeyJ') {
            const input = prompt(
                "Examples:\n" +
                "  1:02:03\n" +
                "  00:26:45,600\n" +
                "  00:26:45.600\n" +
                "  25%"
            );
            if (input) jumpTo(input);
        }
    });
})();
