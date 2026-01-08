// ==UserScript==
// @name         YouTube Kids Fullscreen Resize Fix (delayed aria check)
// @author       ZoltanZen
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Csak fullscreen belépéskor méretezi át a videót (F11 bug fix, késleltetett aria-label ellenőrzés)
// @match        *://*.youtubekids.com/*
// @match        *://youtubekids.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561856/YouTube%20Kids%20Fullscreen%20Resize%20Fix%20%28delayed%20aria%20check%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561856/YouTube%20Kids%20Fullscreen%20Resize%20Fix%20%28delayed%20aria%20check%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[TM] YTK Fullscreen Resize Fix loaded");

    function resizeVideo() {
        const video = document.querySelector("video.html5-main-video");
        if (!video) return;

        const aspect = video.videoWidth / video.videoHeight;
        if (!aspect || aspect === Infinity) return;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        let newW = screenW;
        let newH = newW / aspect;

        if (newH > screenH) {
            newH = screenH;
            newW = newH * aspect;
        }

        const left = (screenW - newW) / 2;
        const top = (screenH - newH) / 2;

        video.style.width = newW + "px";
        video.style.height = newH + "px";
        video.style.left = left + "px";
        video.style.top = top + "px";

        console.log("[TM] Video resized on fullscreen ENTER:", newW, "x", newH);
    }

    function waitForElement(selector, callback) {
        const obs = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                obs.disconnect();
                callback(el);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement("#player-fullscreen-button", (btn) => {
        console.log("[TM] Fullscreen gomb megtalálva");

        btn.addEventListener("click", () => {
            console.log("[TM] Fullscreen gomb megnyomva");

            // Várunk, hogy a YouTube átírja az aria-labelt
            setTimeout(() => {
                const label = btn.getAttribute("aria-label");

                if (label && (label.includes("Exit") || label.includes("Kilépés"))) {
                    console.log("[TM] Fullscreen ENTER detected");
                    setTimeout(resizeVideo, 200);
                } else {
                    console.log("[TM] Fullscreen EXIT detected — resize skipped");
                }
            }, 150);
        });
    });

})();
