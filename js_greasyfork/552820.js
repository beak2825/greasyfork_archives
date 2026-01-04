// ==UserScript==
// @name         MissAV 切換視窗不暫停
// @name:en      MissAV Background Playback
// @namespace    https://greasyfork.org/users/1447528
// @version      1.2
// @description  防止 MissAV 切換視窗不暫停
// @description:en      Prevents MissAV videos from pausing when switching windows or tabs, enabling background playback
// @author       love8585962
// @license      MIT
// @match        https://missav.ws/*
// @match        https://*.missav.ws/*
// @match        https://*.missav123.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/552820/MissAV%20%E5%88%87%E6%8F%9B%E8%A6%96%E7%AA%97%E4%B8%8D%E6%9A%AB%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/552820/MissAV%20%E5%88%87%E6%8F%9B%E8%A6%96%E7%AA%97%E4%B8%8D%E6%9A%AB%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userInteracted = false;
    let wasPlaying = false;

    const initPlayer = () => {
        const mainVideo = document.querySelector('video.player');

        if(mainVideo) {
            ['click', 'touchstart', 'keydown'].forEach(eventType => {
                document.addEventListener(eventType, () => {
                    userInteracted = true;
                    setTimeout(() => {
                        userInteracted = false;
                    }, 500);
                }, true);
            });
            mainVideo.addEventListener('play', () => {
                wasPlaying = true;
            });
            mainVideo.addEventListener('pause', (e) => {
                if(userInteracted) {
                    wasPlaying = false;
                    return;
                }
                setTimeout(() => {
                    if(mainVideo.paused && !mainVideo.ended && wasPlaying) {
                        mainVideo.play();
                    }
                }, 150);
            }, true);
            setInterval(() => {
                if(!userInteracted && wasPlaying && mainVideo.paused && !mainVideo.ended) {
                    mainVideo.play();
                }
            }, 300);

        } else {
            setTimeout(initPlayer, 1000);
        }
    };
    try {
        Object.defineProperty(document, 'hidden', {
            get: () => false,
            configurable: true
        });
    } catch(e) {}

    try {
        Object.defineProperty(document, 'visibilityState', {
            get: () => 'visible',
            configurable: true
        });
    } catch(e) {}

    try {
        Object.defineProperty(document, 'hasFocus', {
            value: () => true,
            configurable: true
        });
    } catch(e) {}
    ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange',
     'blur', 'focusout', 'pagehide'].forEach(event => {
        window.addEventListener(event, e => {
            e.stopImmediatePropagation();
        }, true);
        document.addEventListener(event, e => {
            e.stopImmediatePropagation();
        }, true);
    });

    initPlayer();
})();