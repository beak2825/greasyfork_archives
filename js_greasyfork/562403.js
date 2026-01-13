// ==UserScript==
// @name         YouTube Timestamp Copier (Mac + Overlay, zero-padded)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Copy YouTube timestamp like 02:37 using ⌘ + Shift + C and show overlay on video player on macOS.
// @author       cicero.elead.apollonius@gmail.com
// @match        https://www.youtube.com/watch*
// @grant        GM_setClipboard
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/562403/YouTube%20Timestamp%20Copier%20%28Mac%20%2B%20Overlay%2C%20zero-padded%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562403/YouTube%20Timestamp%20Copier%20%28Mac%20%2B%20Overlay%2C%20zero-padded%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function showOverlay(message) {
        let overlay = document.getElementById('timestamp-copy-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'timestamp-copy-overlay';
            Object.assign(overlay.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '18px',
                zIndex: 9999,
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.3s ease'
            });
            document.body.appendChild(overlay);
        }

        overlay.textContent = message;
        overlay.style.opacity = 1;

        // Fade out after 1.5s
        setTimeout(() => {
            overlay.style.opacity = 0;
        }, 1500);
    }

    document.addEventListener('keydown', function (e) {
        // macOS: ⌘ + Shift + C
        if (e.metaKey && e.shiftKey && e.code === 'KeyC') {
            const timeElement = document.querySelector('.ytp-time-current');
            if (!timeElement) return;

            let time = timeElement.textContent.trim();
            const parts = time.split(':').map(Number);

            // Zero-pad minutes and seconds
            if (parts.length === 2) {
                const [m, s] = parts;
                time = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            } else if (parts.length === 3) {
                const [h, m, s] = parts;
                time = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }

            GM_setClipboard(time);
            showOverlay(`⏱️ Copied timestamp: ${time}`);
            console.log(`Copied timestamp: ${time}`);
        }
    });
})();
