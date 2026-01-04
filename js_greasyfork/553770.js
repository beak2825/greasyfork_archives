// ==UserScript==
// @name         VkvideoCustomizableRewindVideo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the video rewind speed in VK videos. When you press the "right arrow" and "left arrow" keys, it changes from 10 to 5 seconds. When you press the "<" and ">" keys, it changes to 0.1 seconds.
// @author       Darkselia
// @match        https://vkvideo.ru/*
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/553770/VkvideoCustomizableRewindVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/553770/VkvideoCustomizableRewindVideo.meta.js
// ==/UserScript==

(function() {
    let TIME = 5;

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement('video.videoplayer_media_provider', (video) => {
        if (window.__speedControlKeyDown) {
            document.removeEventListener('keydown', window.__speedControlKeyDown, true);
            window.__speedControlKeyDown = undefined;
        }
        if (window.__speedControlKeyUp) {
            document.removeEventListener('keyup', window.__speedControlKeyUp, true);
            window.__speedControlKeyUp = undefined;
        }

        function seek(e, time){
            e.preventDefault();
            e.stopImmediatePropagation();

            const t = video.currentTime;
            const a = e.key === 'ArrowLeft' || e.keyCode === 188 ? -1 : 1;

            video.currentTime = Math.max(Math.min(video.duration, t + time*a), 0);
        }

        function handleKeyDown(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') seek(e, TIME);


            if (e.keyCode === 188 || e.keyCode === 190) seek(e, 0.1);
        }

        function handleKeyUp(e) {
            if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.keyCode !== 188 && e.keyCode !== 190) return;

            e.preventDefault();
            e.stopImmediatePropagation();
        }

        window.__speedControlKeyDown = handleKeyDown;
        window.__speedControlKeyUp = handleKeyUp;

        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keyup', handleKeyUp, true);
    });

})();
