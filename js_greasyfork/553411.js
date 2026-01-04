// ==UserScript==
// @name         YouTube Music Exponential Volume
// @license      MIT
// @version      1.0
// @description  Makes YouTube Music volume exponential instead of linear, this makes it easier to control volume.
// @match        https://music.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1173187
// @downloadURL https://update.greasyfork.org/scripts/553411/YouTube%20Music%20Exponential%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/553411/YouTube%20Music%20Exponential%20Volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const exponent = 3; // change this: 2 = mild curve, 3 = stronger exponential
    let lastSet = -1;

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video && video.volume !== undefined) {
            if (lastSet === -1) lastSet = video.volume;
            Object.defineProperty(video, 'volume', {
                set(value) {
                    lastSet = Math.pow(value, exponent);
                    video.setAttribute('data-real-volume', value);
                    video._setVolume(lastSet);
                },
                get() {
                    return Math.pow(lastSet, 1 / exponent);
                }
            });
            video._setVolume = function(v) {
                HTMLMediaElement.prototype.__lookupSetter__('volume').call(this, v);
            };
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
