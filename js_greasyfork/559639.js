// ==UserScript==
// @name         Instagram - Default Video Volume
// @description  Forces Instagram videos to play at a set volume by default
// @namespace    http://tampermonkey.net/
// @icon         https://cdn-icons-png.flaticon.com/128/15713/15713420.png
// @supportURL   https://github.com/5tratz/Tampermonkey-Scripts/issues
// @version      0.0.4
// @author       5tratz
// @match        https://www.instagram.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559639/Instagram%20-%20Default%20Video%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/559639/Instagram%20-%20Default%20Video%20Volume.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_VOLUME = 0.05;
    const processed = new WeakSet();

    function forceVolume(video) {
        if (!video) return;

        try {
            // Respect mute state
            if (!video.muted) {
                video.volume = TARGET_VOLUME;
            }
        } catch (e) {}
    }

    function hook(video) {
        if (processed.has(video)) return;
        processed.add(video);

        // Initial apply
        forceVolume(video);

        // When playback starts (including loops)
        video.addEventListener('play', () => {
            forceVolume(video);
        }, true);

        // When metadata reloads (recycled reels)
        video.addEventListener('loadedmetadata', () => {
            forceVolume(video);
        }, true);

        // When Instagram changes volume or mute internally
        video.addEventListener('volumechange', () => {
            // If UI says muted, enforce silence
            if (video.muted) {
                video.volume = 0;
            } else {
                video.volume = TARGET_VOLUME;
            }
        }, true);
    }

    function scan() {
        document.querySelectorAll('video').forEach(hook);
    }

    // Observe infinite scrolling / recycling
    const observer = new MutationObserver(scan);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Safety net for internal resets
    setInterval(scan, 500);

    // Initial run
    scan();

})();