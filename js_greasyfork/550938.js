// ==UserScript==
// @name         Auto Unmute Facebook Video (No Story)
// @namespace    CustomScripts
// @description  Automatically unmutes all Facebook videos and reels when they start playing, excluding Stories
// @author       Thnh01
// @match        *://*.facebook.com/*
// @version      1.1
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550938/Auto%20Unmute%20Facebook%20Video%20%28No%20Story%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550938/Auto%20Unmute%20Facebook%20Video%20%28No%20Story%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function attemptUnmute(video) {

        if (video.closest('[data-pagelet="Stories"]') ||
            video.closest('[aria-label="Stories"]')) {
            return;
        }

        if (video instanceof HTMLVideoElement && video.muted) {
            video.muted = false;
            video.volume = 1.0;

            if (video.audioTracks && video.audioTracks.length > 0) {
                for (let track of video.audioTracks) {
                    track.enabled = true;
                }
            }

            video.dispatchEvent(new Event('volumechange', { bubbles: true }));
        }
    }


    document.addEventListener('play', function(event) {
        attemptUnmute(event.target);
    }, true);


    document.addEventListener('click', function(event) {
        if (event.target.closest('[aria-label*="mute"]') ||
            event.target.closest('[aria-label*="sound"]') ||
            event.target.closest('[role="button"][aria-pressed]')) {

            setTimeout(() => {
                document.querySelectorAll('video').forEach(attemptUnmute);
            }, 100);
        }
    }, true);


    const checkInterval = setInterval(() => {
        document.querySelectorAll('video').forEach(attemptUnmute);
    }, 2000);


    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName === 'VIDEO') {
                        attemptUnmute(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(attemptUnmute);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    window.addEventListener('beforeunload', () => {
        clearInterval(checkInterval);
        observer.disconnect();
    });
})();
