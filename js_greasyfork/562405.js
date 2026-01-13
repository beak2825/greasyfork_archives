// ==UserScript==
// @name         YouTube Save Frame with More Identifiable Filename (Shift + Option + G)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Save current YouTube frame with title + timestamp filename. Supports Unicode (e.g. Chinese). Hotkey: Shift + Option + F. Also adds a button to player controls.
// @author       cicero.elead.apollonius@gmail.com
// @match        https://www.youtube.com/watch*
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/562405/YouTube%20Save%20Frame%20with%20More%20Identifiable%20Filename%20%28Shift%20%2B%20Option%20%2B%20G%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562405/YouTube%20Save%20Frame%20with%20More%20Identifiable%20Filename%20%28Shift%20%2B%20Option%20%2B%20G%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function formatFilename(title, timestamp) {
        return `videoframe_${title}_${timestamp}`
            .replace(/[:]/g, '-')                  // Replace colons
            .replace(/\s+/g, '_')                  // Replace spaces
            .replace(/[\\\/:*?"<>|]/g, '');        // Strip invalid filename characters
    }

    function getCurrentTimestamp(video) {
        const totalSeconds = Math.floor(video.currentTime);
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return [
            hrs > 0 ? String(hrs).padStart(2, '0') : null,
            String(mins).padStart(2, '0'),
            String(secs).padStart(2, '0')
        ].filter(Boolean).join('-');
    }

    function captureFrame() {
        const video = document.querySelector('video');
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const rawTitle = document.title.replace(" - YouTube", "").trim();
        const timestamp = getCurrentTimestamp(video);
        const filename = formatFilename(rawTitle, timestamp) + '.png';

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();

        showOverlay(`📸 Saved: ${timestamp}`);
    }

    function showOverlay(message) {
        let overlay = document.getElementById('frame-save-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'frame-save-overlay';
            Object.assign(overlay.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '16px',
                zIndex: 9999,
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.3s ease'
            });
            document.body.appendChild(overlay);
        }
        overlay.textContent = message;
        overlay.style.opacity = 1;
        setTimeout(() => {
            overlay.style.opacity = 0;
        }, 1500);
    }

    function addButton() {
        const controls = document.querySelector('.ytp-right-controls');
        if (!controls || document.getElementById('save-frame-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'save-frame-btn';
        btn.textContent = '📸 Frame';
        Object.assign(btn.style, {
            fontSize: '14px',
            marginLeft: '10px',
            cursor: 'pointer',
            background: 'none',
            color: 'white',
            border: '0px solid white',
            padding: '2px 6px',
            // borderRadius: '4px'
        });

        btn.addEventListener('click', captureFrame);
        controls.prepend(btn);
    }

    // Keyboard shortcut: Option/Alt + F
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.shiftKey && e.code === 'KeyG') {
            captureFrame();
        }
    });

    const observer = new MutationObserver(() => addButton());
    observer.observe(document.body, { childList: true, subtree: true });
})();
