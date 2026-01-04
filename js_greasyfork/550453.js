// ==UserScript==
// @name         YouTube Comments Unlock After Watch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide YouTube comments until at least 50% of the video has been watched (without skipping), to improve focus. Also blocks other distractions like recommendations.
// @author       Adapted from Markus Dietl's script
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550453/YouTube%20Comments%20Unlock%20After%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/550453/YouTube%20Comments%20Unlock%20After%20Watch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let video = null;
    let watchedTime = 0;
    let prevTime = 0;
    let duration = 0;
    let unlocked = false;

    // Function to hide elements by class name
    function hideElementsByClass(className) {
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }

    // Function to hide an element by ID
    function hideElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    // Function to show an element by ID
    function showElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = '';
        }
    }

    // Setup video event listeners
    function setupVideo(v) {
        video = v;

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('seeked', handleSeeked);

        // If metadata already loaded
        if (video.duration && !isNaN(video.duration) && video.duration > 0) {
            handleLoadedMetadata();
        }
    }

    function handleLoadedMetadata() {
        duration = video.duration;
        watchedTime = 0;
        prevTime = 0;
        unlocked = false;
        hideElementById('comments');
    }

    function handleTimeUpdate() {
        if (unlocked || video.paused || isNaN(duration) || duration <= 0) return;

        const delta = video.currentTime - prevTime;
        if (delta > 0 && delta < 2) {
            watchedTime += delta;
        }
        prevTime = video.currentTime;

        if (watchedTime >= 0.5 * duration) {
            unlocked = true;
            showElementById('comments');
        }
    }

    function handleSeeked() {
        prevTime = video.currentTime;
    }

    // Create a mutation observer to monitor the DOM for changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Always hide recommendations
                hideElementsByClass('ytd-watch-next-secondary-results-renderer');

                // Hide comments if not unlocked
                if (!unlocked) {
                    hideElementById('comments');
                }

                // Check for added video element
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'VIDEO') {
                        setupVideo(node);
                    } else if (node.querySelector && node.querySelector('video')) {
                        setupVideo(node.querySelector('video'));
                    }
                });
            }
        });
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial checks
    hideElementsByClass('ytd-watch-next-secondary-results-renderer');
    hideElementById('comments');

    // Initial video check
    const initialVideo = document.querySelector('video');
    if (initialVideo) {
        setupVideo(initialVideo);
    }
})();