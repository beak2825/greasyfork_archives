// ==UserScript==
// @name         哔哩鼠标
// @namespace    http://tampermonkey.net/
// @version      2025-09-16
// @description  bilibili鼠标快捷键，通过鼠标侧键对b站视频播放、暂停、快五秒、慢五秒，二倍速
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549913/%E5%93%94%E5%93%A9%E9%BC%A0%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/549913/%E5%93%94%E5%93%A9%E9%BC%A0%E6%A0%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WS_URL = "ws://127.0.0.1:8765";
    const VIDEO_SELECTOR = "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div > video";

    function findVideo() {
        try {
            return document.querySelector(VIDEO_SELECTOR);
        } catch (e) {
            return null;
        }
    }

    function toggleVideo() {
        const v = findVideo();
        if (!v) {
            console.log("[TM] Video element not found for selector:", VIDEO_SELECTOR);
            return;
        }
        try {
            if (v.paused) {
                v.play().catch(err => {
                    console.warn("[TM] play() rejected:", err);
                });
            } else {
                v.pause();
            }
        } catch (e) {
            console.error("[TM] toggle error:", e);
        }
    }

    // 添加加5秒功能
    function add5Seconds() {
        const v = findVideo();
        if (!v) {
            console.log("[TM] Video element not found for selector:", VIDEO_SELECTOR);
            return;
        }
        try {
            v.currentTime += 5;
            console.log("[TM] Added 5 seconds, current time:", v.currentTime);
        } catch (e) {
            console.error("[TM] add5Seconds error:", e);
        }
    }

    // 添加减5秒功能
    function subtract5Seconds() {
        const v = findVideo();
        if (!v) {
            console.log("[TM] Video element not found for selector:", VIDEO_SELECTOR);
            return;
        }
        try {
            v.currentTime = Math.max(0, v.currentTime - 5); // 确保不会变成负数
            console.log("[TM] Subtracted 5 seconds, current time:", v.currentTime);
        } catch (e) {
            console.error("[TM] subtract5Seconds error:", e);
        }
    }

    // 添加设置播放速度功能
    function setPlaybackRate(rate) {
        const v = findVideo();
        if (!v) {
            console.log("[TM] Video element not found for selector:", VIDEO_SELECTOR);
            return;
        }
        try {
            v.playbackRate = rate;
            console.log("[TM] Set playback rate to:", rate);
        } catch (e) {
            console.error("[TM] setPlaybackRate error:", e);
        }
    }

    function setupWs() {
        let ws;
        try {
            ws = new WebSocket(WS_URL);
        } catch (e) {
            console.warn("[TM] WebSocket connect error:", e);
            return;
        }
        ws.onopen = function() {
            console.log("[TM] Connected to local WS:", WS_URL);
        };
        ws.onmessage = function(evt) {
            const text = String(evt.data || "");
            console.log("[TM] WS message:", text);
            switch (text) {
                case "toggle": toggleVideo(); break;
                case "add5": add5Seconds(); break;
                case "subtract5": subtract5Seconds(); break;
                case "x2": setPlaybackRate(2); break;
                case "r2": setPlaybackRate(1); break;
                default: console.log("未知指令: ${text}"); break;
            }
        };
        ws.onclose = function() {
            console.log("[TM] WS closed, retry in 2000ms");
            setTimeout(setupWs, 2000);
        };
        ws.onerror = function(err) {
            console.error("[TM] WS error:", err);
            try { ws.close(); } catch(e) {}
        };
    }

    // Try connect once DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupWs);
    } else {
        setupWs();
    }
})();