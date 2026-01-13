// ==UserScript==
// @name         Jwplayer Seek Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  jwplayer 조작시 오버레이를 표시합니다.
// @author       코딩 파트너
// @match        *://*.avsee.ru/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562416/Jwplayer%20Seek%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/562416/Jwplayer%20Seek%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initOverlay() {
        const jwInstance = (typeof window.jwplayer === 'function') ? window.jwplayer() : null;
        if (!jwInstance || !jwInstance.getContainer()) return;

        const playerContainer = jwInstance.getContainer();

        function formatTimestamp(seconds) {
            if (isNaN(seconds) || seconds < 0) return "00:00";
            const hour = Math.floor(seconds / 3600);
            const min = Math.floor((seconds % 3600) / 60);
            const sec = Math.floor(seconds % 60);

            const paddedMin = min.toString().padStart(2, '0');
            const paddedSec = sec.toString().padStart(2, '0');

            return hour > 0
                ? `${hour}:${paddedMin}:${paddedSec}`
                : `${paddedMin}:${paddedSec}`;
        }

        function createOverlayElement(customStyle = {}) {
            const overlay = document.createElement('div');
            const defaultStyle = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#ffffff',
                fontSize: 'min(5.5vw, 44px)',
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                zIndex: '10000',
                display: 'none',
                opacity: '0',
                transition: 'opacity 0.2s ease-in-out',
                pointerEvents: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                padding: '20px 10px',
                borderRadius: '10px'
            };

            Object.assign(overlay.style, defaultStyle, customStyle);
            playerContainer.appendChild(overlay);
            return overlay;
        }

        const seekOverlay = createOverlayElement({ top: '90%' });
        const volumeOverlay = createOverlayElement();

        const activeTimers = {
            seek: null,
            volume: null
        };

        function triggerOverlay(overlayElement, type) {
            overlayElement.style.display = 'block';

            requestAnimationFrame(() => {
                overlayElement.style.opacity = '1';
            });

            clearTimeout(activeTimers[type]);

            activeTimers[type] = setTimeout(() => {
                overlayElement.style.opacity = '0';
                setTimeout(() => {
                    if (overlayElement.style.opacity === '0') {
                        overlayElement.style.display = 'none';
                    }
                }, 200);
            }, 300);
        }

        jwInstance.on('seek', (event) => {
            const currentTime = formatTimestamp(event.offset);
            const totalDuration = formatTimestamp(jwInstance.getDuration());

            seekOverlay.innerText = `${currentTime} / ${totalDuration}`;
            triggerOverlay(seekOverlay, 'seek');
        });

        jwInstance.on('volume', (event) => {
            volumeOverlay.innerText = `Vol: ${event.volume}%`;
            triggerOverlay(volumeOverlay, 'volume');
        });
    }

    if (document.readyState === 'complete') {
        initOverlay();
    } else {
        window.addEventListener('load', initOverlay);
    }
})();