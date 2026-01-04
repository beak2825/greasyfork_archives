// ==UserScript==
// @name         Twitter Native Video Controls
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show native video controls on videos
// @author       ChatGPT
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559781/Twitter%20Native%20Video%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/559781/Twitter%20Native%20Video%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        document.querySelectorAll('video').forEach(video => {
            if (!video.hasAttribute('controls')) {
                video.setAttribute('controls', 'true'); // Add native controls
                video.style.pointerEvents = 'auto'; // Make sure it's interactable
                video.style.zIndex = '1'; // Avoid being blocked by overlays
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
