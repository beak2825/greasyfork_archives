// ==UserScript==
// @name         YouTube Exponential Volume Slider
// @namespace    https://www.tampermonkey.net/
// @version      1.1.3
// @description  Makes the YouTube volume slider exponential so it's easier to select lower volumes.
// @author       Lukas Reinert
// @icon         https://www.youtube.com/img/favicon.ico
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555739/YouTube%20Exponential%20Volume%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/555739/YouTube%20Exponential%20Volume%20Slider.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const EXPONENT = 2.5;
 
    const storedOriginalVolumes = new WeakMap();
    const {get, set} = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'volume');
 
    Object.defineProperty(HTMLMediaElement.prototype, 'volume', {
        get() {
            const lowVolume = get.call(this);
            const storedOriginalVolume = storedOriginalVolumes.get(this);
            if (storedOriginalVolume !== undefined) return storedOriginalVolume;
            return Math.pow(lowVolume, 1 / EXPONENT);
        },
        set(originalVolume) {
            const adjustedVolume = Math.pow(originalVolume, EXPONENT);
            storedOriginalVolumes.set(this, originalVolume);
            set.call(this, adjustedVolume);
 
            console.log(`YouTube Volume: ${Math.round(originalVolume*100)}% (adjusted to ${(adjustedVolume * 100).toFixed(3)}%)`);
        }
    });
 
    // Ensure any videos already on the page get their volume adjusted
    const videos = document.getElementsByTagName('video');
    for (const video of videos) {
        if (!storedOriginalVolumes.has(video)) {
            const orig = video.volume;
            video.volume = orig; // triggers setter
        }
    }
 
})();