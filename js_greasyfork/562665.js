// ==UserScript==
// @name         YouTube Blur Mask Slider
// @version      0.1
// @namespace    http://tampermonkey.net/
// @description  Adds a blur mask slider that masks from the right side of the video (with a channel name filter -- check the code)
// @author       yclee126
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562665/YouTube%20Blur%20Mask%20Slider.user.js
// @updateURL https://update.greasyfork.org/scripts/562665/YouTube%20Blur%20Mask%20Slider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CHECK_INTERVAL_MS = 2000;

    // Add or remove target channel names to here
    // Empty list = target all channels
    const TARGET_CHANNELS = [];

    // Inject CSS for the hover logic
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide controls by default */
        #yt-blur-controls {
            opacity: 0 !important;
            transition: opacity 0.2s ease-in-out !important;
            pointer-events: none !important;
        }
        /* Show controls when the player is hovered */
        .html5-video-player:hover #yt-blur-controls {
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    function getChannelName() {
        // Look for the channel link/name in the video owner area
        const channelElement = document.querySelector('#upload-info #channel-name a') ||
                               document.querySelector('.ytd-video-owner-renderer #channel-name a');
        return channelElement ? channelElement.innerText.trim() : null;
    }

    function applyBlurMask() {
        // Get video element
        const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
        if (!player) return;

        // Filter out channels
        if (TARGET_CHANNELS.length > 0) {
            const currentChannel = getChannelName();
            const isTarget = TARGET_CHANNELS.includes(currentChannel);

            if (!isTarget) {
                player.querySelector('#yt-blur-mask-layer')?.remove();
                player.querySelector('#yt-blur-controls')?.remove();
                return;
            }
        }

        // Prevent duplicate injection
        if (player.querySelector('#yt-blur-controls')) return;

        // Create the Mask Layer
        const mask = document.createElement('div');
        mask.id = 'yt-blur-mask-layer';
        Object.assign(mask.style, {
            position: 'absolute',
            top: '0',
            right: '0',
            width: '0%',
            height: '100%',
            zIndex: '10',
            pointerEvents: 'none',
            backdropFilter: 'blur(20px)',
            webkitBackdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
        });

        // Create the Slider UI
        const controls = document.createElement('div');
        controls.id = 'yt-blur-controls';
        Object.assign(controls.style, {
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: '100',
            background: 'rgba(28, 28, 28, 0.9)',
            padding: '12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'white',
            fontSize: '13px',
            fontFamily: 'Roboto, Arial, sans-serif',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        });

        const label = document.createElement('span');
        label.innerText = 'Mask:';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'yt-blur-slider';
        slider.style.width = '200px';
        slider.style.direction = 'rtl'; // start slider from the right
        slider.min = 0;
        slider.max = 1000;
        slider.value = 0;

        // Update mask percentage
        slider.addEventListener('input', (e) => {
            mask.style.width = e.target.value / 10 + '%';
        });

        // inject mask and the slider
        controls.appendChild(label);
        controls.appendChild(slider);
        player.appendChild(mask);
        player.appendChild(controls);
    }

    setInterval(applyBlurMask, CHECK_INTERVAL_MS);
    applyBlurMask();
})();