// ==UserScript==
// @name         Allow PiP in Teams meetings
// @namespace    https://rx.io/
// @version      0.2
// @description  Enable Firefox native Picture-in-Picture in Teams Web share/video windows
// @match        https://teams.microsoft.com/*
// @match        https://teams.cloud.microsoft/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552472/Allow%20PiP%20in%20Teams%20meetings.user.js
// @updateURL https://update.greasyfork.org/scripts/552472/Allow%20PiP%20in%20Teams%20meetings.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function enablePiP(video) {
        if (!video) return;
        try {
            video.removeAttribute('disablePictureInPicture');
            video.setAttribute('controls', 'true'); // exposes the native PiP button
            video.addEventListener('loadedmetadata', () => {
                video.removeAttribute('disablePictureInPicture');
            });
        } catch (e) {
            console.error('PiP enable failed:', e);
        }
    }

    function scan() {
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
            if (v.hasAttribute('disablePictureInPicture')) {
                enablePiP(v);
            }
        });
    }

    // initial + periodic scan
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
})();