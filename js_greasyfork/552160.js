// ==UserScript==
// @name         YouTube New Window Player
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击YouTube视频时自动在新窗口播放，并提供开关控制，支持中键显示/隐藏UI。
// @author       醉春风
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552160/YouTube%20New%20Window%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/552160/YouTube%20New%20Window%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_TOGGLE_KEY = 'youtubeNewWindowPlayerEnabled';
    const UI_VISIBLE_KEY = 'youtubeNewWindowPlayerUIVisible';
    let isEnabled = GM_getValue(SCRIPT_TOGGLE_KEY, true); // Default to enabled
    let isUIVisible = GM_getValue(UI_VISIBLE_KEY, true); // Default to UI visible

    // Add CSS for the button and its hidden state
    GM_addStyle(`
        #youtube-new-window-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 15px;
            background-color: ${isEnabled ? '#28a745' : '#dc3545'};
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease, opacity 0.3s ease;
        }
        #youtube-new-window-toggle.hidden {
            opacity: 0;
            pointer-events: none; /* Make it unclickable when hidden */
        }
    `);

    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'youtube-new-window-toggle';
        button.textContent = isEnabled ? '新窗口播放: 开' : '新窗口播放: 关';
        button.style.backgroundColor = isEnabled ? '#28a745' : '#dc3545';
        if (!isUIVisible) {
            button.classList.add('hidden');
        }

        button.addEventListener('click', () => {
            isEnabled = !isEnabled;
            GM_setValue(SCRIPT_TOGGLE_KEY, isEnabled);
            button.textContent = isEnabled ? '新窗口播放: 开' : '新窗口播放: 关';
            button.style.backgroundColor = isEnabled ? '#28a745' : '#dc3545';
            console.log('YouTube New Window Player is now ' + (isEnabled ? 'enabled' : 'disabled'));
        });

        document.body.appendChild(button);
    }

    function handleVideoClick(event) {
        // Allow middle-click to open in new tab by default browser behavior
        if (event.button === 1) { // Middle mouse button
            return;
        }

        if (!isEnabled) {
            return;
        }

        let target = event.target;
        let videoLink = null;

        // Traverse up the DOM to find the closest video link (a tag or element with href to /watch?v=)
        while (target && target !== document.body) {
            if (target.tagName === 'A' && target.href && target.href.includes('/watch?v=')) {
                videoLink = target;
                break;
            }
            // For elements that might not be <a> but contain a video link (e.g., div with data-yt-id)
            if (target.dataset && target.dataset.videoId) {
                videoLink = target;
                break;
            }
            target = target.parentElement;
        }

        if (videoLink) {
            let videoUrl = videoLink.href || `https://www.youtube.com/watch?v=${videoLink.dataset.videoId}`;

            if (videoUrl && videoUrl.includes('/watch?v=')) {
                event.preventDefault(); // Prevent default navigation
                event.stopPropagation(); // Stop event propagation to prevent other YouTube handlers
                window.open(videoUrl, '_blank', 'noopener,noreferrer'); // Add security features
            }
        }
    }

    function toggleUIButtonVisibility(event) {
        if (event.button === 1) { // Middle mouse button
            const button = document.getElementById('youtube-new-window-toggle');
            if (button) {
                isUIVisible = !isUIVisible;
                GM_setValue(UI_VISIBLE_KEY, isUIVisible);
                if (isUIVisible) {
                    button.classList.remove('hidden');
                } else {
                    button.classList.add('hidden');
                }
                console.log('YouTube New Window Player UI is now ' + (isUIVisible ? 'visible' : 'hidden'));
            }
        }
    }

    // Use document-start to attach event listener as early as possible
    document.addEventListener('click', handleVideoClick, true); // Use capture phase

    // Listen for middle mouse clicks on the document to toggle UI visibility
    document.addEventListener('mousedown', toggleUIButtonVisibility);

    // Ensure the button is created once the DOM is ready
    window.addEventListener('DOMContentLoaded', createToggleButton);

})();

