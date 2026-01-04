// ==UserScript==
// @name         Accelerate video on long press
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Accelerate video on long press on submeta.io videos, similar to youtube
// @match        https://iframe.cloudflarestream.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=submeta.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551007/Accelerate%20video%20on%20long%20press.user.js
// @updateURL https://update.greasyfork.org/scripts/551007/Accelerate%20video%20on%20long%20press.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function log(obj){
        return
        console.log(obj);
    }

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '25px';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.color = 'white';
    overlay.style.padding = '6px 18px';
    overlay.style.borderRadius = '20px';
    overlay.style.fontSize = '15px';
    overlay.style.fontWeight = 'bold';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.gap = '6px';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.1s';

    const speedText = document.createElement('span');
    speedText.textContent = '2x ▶▶'

    overlay.appendChild(speedText);
    document.body.appendChild(overlay);

    function showOverlay() {
        overlay.style.opacity = '1';
    }
    function hideOverlay() {
        overlay.style.opacity = '0';
    }

    function launch(){

        const video = document.querySelector('video');

        if (!video)
        {
            log('No video')
            return
        }
        log('Video found')

        let longPressTimer = null;

        // Duration (ms) to qualify as a long press
        const LONG_PRESS_DURATION = 500;

        function startLongPress() {
            if (longPressTimer) return;
            log('Starting long press')
            longPressTimer = setTimeout(() => {
                video.playbackRate = 2.0;
                showOverlay();
                log('Video accelerated!');
            }, LONG_PRESS_DURATION);
        }

        function cancelLongPress() {
            if (longPressTimer) {
                log('cancelling long press');
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            hideOverlay();
        }

        if (!video.parentElement.dataset.speedupListenersAttached)
        {
            log ('adding speedup listeners')
            // Mouse events
            video.parentElement.addEventListener('mousedown', startLongPress);
            video.parentElement.addEventListener('mouseup', cancelLongPress);
            video.parentElement.addEventListener('mouseleave', cancelLongPress);

            // Touch events for mobile
            video.parentElement.addEventListener('touchstart', startLongPress);
            video.parentElement.addEventListener('touchend', cancelLongPress);
            video.parentElement.addEventListener('touchcancel', cancelLongPress);

            // Optional: reset speed when press ends
            video.parentElement.addEventListener('mouseup', () => {video.playbackRate = 1.0});
            video.parentElement.addEventListener('touchend', () => {video.playbackRate = 1.0});

            video.parentElement.dataset.speedupListenersAttached = true;
        }
    }

    launch();

    const observer = new MutationObserver(() => launch());
    observer.observe(document.body, { childList: true, subtree: true });
})();
