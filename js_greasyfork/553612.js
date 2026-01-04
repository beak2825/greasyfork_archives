// ==UserScript==
// @name         ChatReplay.stream Fullscreen Landscape on iPhone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a meta tag to make chatreplay.stream utilize the full screen in landscape mode on iPhones with a notch.
// @author       You
// @match        https://chatreplay.stream/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553612/ChatReplaystream%20Fullscreen%20Landscape%20on%20iPhone.user.js
// @updateURL https://update.greasyfork.org/scripts/553612/ChatReplaystream%20Fullscreen%20Landscape%20on%20iPhone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the viewport meta tag already exists
    let viewport = document.querySelector("meta[name=viewport]");

    if (viewport) {
        // If it exists, append viewport-fit=cover
        viewport.content += ", viewport-fit=cover";
    } else {
        // If it doesn't exist, create it
        viewport = document.createElement('meta');
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1, viewport-fit=cover";
        document.getElementsByTagName('head')[0].appendChild(viewport);
    }
})();