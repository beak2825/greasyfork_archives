// ==UserScript==
// @name         TikTok Auto Promote My Videos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically likes, shares, and comments on your own TikTok videos to boost their visibility and engagement without payment.
// @author       You
// @match        https://www.tiktok.com/@yourusername/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553937/TikTok%20Auto%20Promote%20My%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/553937/TikTok%20Auto%20Promote%20My%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const LIKE_COUNT = 10; // Number of your videos to like
    const SHARE_COUNT = 10; // Number of your videos to share
    const COMMENT_COUNT = 5; // Number of your videos to comment on
    const COMMENT_TEXT = "Check out this awesome video! 🔥"; // Comment text

    // Function to like a video
    function likeVideo(videoElement) {
        const likeButton = videoElement.querySelector('button[data-e2e="like-button"]');
        if (likeButton) {
            likeButton.click();
            console.log('Liked a video');
        }
    }

    // Function to share a video
    function shareVideo(videoElement) {
        const shareButton = videoElement.querySelector('button[data-e2e="share-button"]');
        if (shareButton) {
            shareButton.click();
            console.log('Shared a video');
        }
    }

    // Function to comment on a video
    function commentVideo(videoElement) {
        const commentInput = videoElement.querySelector('textarea[placeholder="Add a comment..."]');
        if (commentInput) {
            commentInput.value = COMMENT_TEXT;
            const submitButton = videoElement.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
                console.log('Commented on a video');
            }
        }
    }

    // Function to process your videos
    function processMyVideos() {
        const videos = document.querySelectorAll('div[class*="video-item"]');
        let likedCount = 0;
        let sharedCount = 0;
        let commentedCount = 0;

        videos.forEach(video => {
            if (likedCount < LIKE_COUNT) {
                likeVideo(video);
                likedCount++;
            }
            if (sharedCount < SHARE_COUNT) {
                shareVideo(video);
                sharedCount++;
            }
            if (commentedCount < COMMENT_COUNT) {
                commentVideo(video);
                commentedCount++;
            }
            if (likedCount >= LIKE_COUNT && sharedCount >= SHARE_COUNT && commentedCount >= COMMENT_COUNT) {
                return;
            }
        });
    }

    // Observe the page for new videos
    const observer = new MutationObserver(() => {
        processMyVideos();
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial processing of videos
    processMyVideos();
})();