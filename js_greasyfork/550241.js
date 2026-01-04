// ==UserScript==
// @name         Ad Skipper(dooball)
// @namespace    http://tampermonkey.net/
// @version      17
// @description  The cleanest experience: Skips ads, removes all overlays AND the register link, then auto-plays the video.
// @author       Gemini & User
// @match        *://embed.theresmoremoney.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/550241/Ad%20Skipper%28dooball%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550241/Ad%20Skipper%28dooball%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ดัก fetch
    const origFetch = window.fetch;
    window.fetch = function(...args) {
        if (args[0] && args[0].toString().includes(".mp4")) {
            console.log("Blocked fetch .mp4:", args[0]);
            return new Promise(() => {}); // ไม่ resolve = ไม่โหลด
        }
        return origFetch.apply(this, args);
    };

    // ดัก XMLHttpRequest
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (url && url.toString().includes(".mp4")) {
            console.log("Blocked XHR .mp4:", url);
            return; // ไม่ส่ง request
        }
        return origOpen.call(this, method, url, ...rest);
    };

    // ลบ overlay + ข้ามโฆษณา
    function cleanup() {
        document.querySelectorAll('[id^="overlay"], #register, #info')
            .forEach(el => el.remove());
    }

    function skipAd() {
        const skipBtn = document.querySelector('#skip');
        if (skipBtn) {
            skipBtn.disabled = false;
            skipBtn.click();
            const video = document.querySelector('video');
            if (video) {
                video.autoplay = true;
                video.play().catch(()=>{});
            }
        }
    }

    const observer = new MutationObserver(() => {
        cleanup();
        skipAd();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    cleanup();
    skipAd();
})();