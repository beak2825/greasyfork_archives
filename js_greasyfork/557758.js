// ==UserScript==
// @name         Telegram Mobile Video Seek Buttons (Auto-Hide)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds 10s and 5s forward/rewind buttons to Telegram Web video player. Optimized for mobile with auto-hide.
// @author       You
// @match        https://web.telegram.org/*
// @icon         https://web.telegram.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557758/Telegram%20Mobile%20Video%20Seek%20Buttons%20%28Auto-Hide%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557758/Telegram%20Mobile%20Video%20Seek%20Buttons%20%28Auto-Hide%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const HIDE_DELAY = 3000; // Time in ms before buttons hide

    function attachControls(video) {
        const container = video.parentNode;

        // prevent duplicate buttons
        if (container.querySelector('.tm-mobile-controls')) return;

        // Force container relative for absolute positioning of our buttons
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        // Create Control Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'tm-mobile-controls';

        // --- COMPACT MOBILE STYLING ---
        wrapper.style.position = 'absolute';
        wrapper.style.bottom = '70px'; // Sits above the seekbar (usually ~50px high)
        wrapper.style.left = '50%';
        wrapper.style.transform = 'translateX(-50%)';
        wrapper.style.display = 'flex';
        wrapper.style.gap = '8px';
        wrapper.style.zIndex = '9999';
        wrapper.style.transition = 'opacity 0.3s ease'; // Smooth fade
        wrapper.style.opacity = '0'; // Hidden by default
        wrapper.style.pointerEvents = 'none'; // Click-through when hidden

        // Button Data
        const buttons = [
            { text: '«10', time: -10 },
            { text: '‹5',  time: -5 },
            { text: '5›',  time: 5 },
            { text: '10»', time: 10 }
        ];

        buttons.forEach(btnData => {
            const btn = document.createElement('button');
            btn.innerText = btnData.text;

            // Style individual buttons
            btn.style.background = 'rgba(0, 0, 0, 0.6)';
            btn.style.color = '#fff';
            btn.style.border = '1px solid rgba(255,255,255,0.2)';
            btn.style.borderRadius = '20px';
            btn.style.padding = '6px 12px'; // Touch-friendly padding
            btn.style.fontSize = '14px';
            btn.style.fontWeight = 'bold';
            btn.style.cursor = 'pointer';
            btn.style.pointerEvents = 'auto'; // Re-enable clicks on buttons
            btn.style.backdropFilter = 'blur(2px)';
            btn.style.minWidth = '40px'; // Minimum touch width

            // Action
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent pausing video
                e.stopImmediatePropagation();
                video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + btnData.time));
                showControls(); // Keep controls visible while interacting
            });

            // Touch support for mobile (faster response)
            btn.addEventListener('touchstart', (e) => {
                e.stopPropagation(); // Prevent touching video underneath
            }, { passive: false });

            wrapper.appendChild(btn);
        });

        container.appendChild(wrapper);

        // --- AUTO-HIDE LOGIC ---
        let hideTimer;

        function showControls() {
            wrapper.style.opacity = '1';
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
                wrapper.style.opacity = '0';
            }, HIDE_DELAY);
        }

        // Show buttons when user interacts with the VIDEO CONTAINER
        // We use 'touchstart' for mobile and 'mousemove' for PC
        const events = ['touchstart', 'click', 'mousemove'];
        events.forEach(evt => {
            container.addEventListener(evt, () => {
                showControls();
            }, { passive: true });
        });
    }

    // Scanner to find new videos (Telegram loads them dynamically)
    setInterval(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Only attach if video is actually visible in the DOM
            if (video.offsetParent !== null) {
                attachControls(video);
            }
        });
    }, 1000);

})();
