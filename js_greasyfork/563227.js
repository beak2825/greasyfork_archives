// ==UserScript==
// @name         YouTube Timestamp Saver
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Simple script that adds a button to YouTube, when clicked it will save watched time.
// @license      MIT
// @match        https://www.youtube.com/watch*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563227/YouTube%20Timestamp%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/563227/YouTube%20Timestamp%20Saver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const svgIcon = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path>
        </svg>
    `;

    function run() {
        if (document.getElementById('yt-native-saver-btn')) return;
        const controls = document.querySelector('.ytp-right-controls');
        if (!controls) return;

        const btn = document.createElement('button');
        btn.id = 'yt-native-saver-btn';
        btn.className = 'ytp-button';
        btn.title = 'Update URL with Timestamp';
        btn.innerHTML = svgIcon;

        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.width = '46px';
        btn.style.height = '40px';
        btn.style.padding = '0';
        btn.style.margin = '0';
        btn.style.opacity = '0.9';

        btn.onclick = function() {
            const video = document.querySelector('.html5-main-video');
            if (!video) return;
            const time = Math.floor(video.currentTime);
            const url = new URL(window.location.href);
            url.searchParams.set('t', time + 's');
            history.replaceState(null, '', url.toString());

            const path = btn.querySelector('path');
            if (path) {
                const originalFill = path.getAttribute('fill');
                path.setAttribute('fill', '#2ba640');
                setTimeout(() => {
                    path.setAttribute('fill', originalFill);
                }, 500);
            }
        };

        controls.prepend(btn);
    }

    let checkTimer = null;
    function startChecking() {
        if (checkTimer) return;
        checkTimer = setInterval(() => {
            if (document.querySelector('.ytp-right-controls')) {
                run();
                clearInterval(checkTimer);
                checkTimer = null;
            }
        }, 300);
    }

    const observer = new MutationObserver(startChecking);
    observer.observe(document.body, { childList: true, subtree: true });
    startChecking();
})();