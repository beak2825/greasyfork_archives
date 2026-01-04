// ==UserScript==
// @name         Youtube Video Flip Toggle
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.1
// @description  Toggle horizontal flip on video elements
// @match        https://www.youtube.com/watch?v=*
// @grant        GM_registerMenuCommand
// @author       JRem
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555570/Youtube%20Video%20Flip%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/555570/Youtube%20Video%20Flip%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let flipped = false;
    let observer = null;

    function applyFlip(video) {
        video.style.transform = flipped ? 'scaleX(-1)' : 'scaleX(1)';
    }

    function toggleFlip() {
        const video = document.querySelector('video');
        if (!video) {
            alert("No <video> element found on this page.");
            return;
        }

        flipped = !flipped;
        applyFlip(video);

        if (flipped && !observer) {
            // Watch for style resets
            observer = new MutationObserver(() => {
                applyFlip(video);
            });
            observer.observe(video, { attributes: true, attributeFilter: ['style'] });
        } else if (!flipped && observer) {
            observer.disconnect();
            observer = null;
        }
    }

    GM_registerMenuCommand("Toggle Video Flip", toggleFlip);
})();