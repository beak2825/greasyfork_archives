// ==UserScript==
// @name         Additional-Miniplayer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ✨This is a script that allows all videos on Chrome to have Miniplayer functionality✨
// @author       Cherry Fu
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551419/Additional-Miniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/551419/Additional-Miniplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let buttonCounter = 0;

    // Function to add miniplayer button to a video element
    function addMiniplayerButton(video) {
        // Check if button already exists for this video
        if (video.hasAttribute('data-miniplayer-added')) return;
        video.setAttribute('data-miniplayer-added', 'true');

        console.log('Adding miniplayer button to video:', video);

        // Create button element
        const button = document.createElement('button');
        button.className = 'miniplayer-btn';
        button.setAttribute('data-video-id', ++buttonCounter);
        button.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="10" height="8" rx="1" ry="1" fill="white" stroke="black" stroke-width="1.5"/>
            <rect x="6" y="6" width="8" height="6" rx="1" ry="1" fill="white" stroke="black" stroke-width="1.5"/>
        </svg>`; // Miniplayer icon with overlapping rectangles
        button.style.cssText = `
            position: fixed;
            z-index: 1000000;
            background: white;
            border: 1px solid #ccc;
            border-radius: 3px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
            pointer-events: auto;
        `;

        // Function to update button position
        function updatePosition() {
            if (!video.isConnected) {
                button.remove();
                return;
            }
            // Find the appropriate container for positioning
            let container = video.closest('#movie_player') || video.closest('#player') || video.closest('.html5-video-player') || video.parentNode;
            const rect = container.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                button.style.left = (rect.left + 5) + 'px';
                button.style.top = (rect.top + 5) + 'px';
                button.style.display = 'flex';
            } else {
                button.style.display = 'none';
            }
        }

        // Initial position
        updatePosition();

        // Update position on scroll and resize
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);

        // Also update on video events
        video.addEventListener('loadedmetadata', updatePosition);
        video.addEventListener('play', updatePosition);

        // Add click event
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else if (video.requestPictureInPicture) {
                video.requestPictureInPicture().catch(console.error);
            }
        });

        // Add to body
        document.body.appendChild(button);
    }

    // Function to process all videos on the page
    function processVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(addMiniplayerButton);
    }

    // Initial processing
    processVideos();

    // Delayed processing for dynamic content
    setTimeout(processVideos, 2000);
    setTimeout(processVideos, 5000);

    // Observe for new videos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'VIDEO') {
                        addMiniplayerButton(node);
                    } else {
                        const videos = node.querySelectorAll('video');
                        videos.forEach(addMiniplayerButton);
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();