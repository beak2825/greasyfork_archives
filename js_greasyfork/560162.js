// ==UserScript==
// @name         四川智慧教育全自动学习（纯净稳定版 + 2x）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动播放 / 自动下一节 / 后台不暂停 / 2倍速 / 异常自动恢复
// @match        *://*.sc.smartedu.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560162/%E5%9B%9B%E5%B7%9D%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%88%E7%BA%AF%E5%87%80%E7%A8%B3%E5%AE%9A%E7%89%88%20%2B%202x%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560162/%E5%9B%9B%E5%B7%9D%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%88%E7%BA%AF%E5%87%80%E7%A8%B3%E5%AE%9A%E7%89%88%20%2B%202x%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("📘 智慧教育自动学习脚本已启动（稳定版）");

    const CHECK_INTERVAL = 3000;
    const MAX_RETRY = 5;
    let retryCount = 0;

    // ================= 工具函数 =================
    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function getVideo() {
        return document.querySelector("video");
    }

    function getCurrentLesson() {
        return document.querySelector(".subsectionNameContent_fir.studying");
    }

    function getNextLesson() {
        const cur = getCurrentLesson();
        if (!cur) return null;

        const item = cur.closest(".subsectionNameContent");
        if (!item) return null;

        const next = item.nextElementSibling;
        if (next) return next;

        const chapter = item.closest(".chaptercell");
        return chapter?.nextElementSibling?.querySelector(".subsectionNameContent");
    }

    // ================= 核心播放 =================
    function forcePlay(reason = "") {
        const v = getVideo();
        if (!v) return;

        try {
            v.muted = true;
            v.playbackRate = 2.0;
            const p = v.play();
            if (p) p.catch(() => {});
            console.log("▶ 播放中", reason);
        } catch (e) {}
    }

    function bindVideoEvents() {
        const v = getVideo();
        if (!v) return;

        v.onended = async () => {
            console.log("✅ 当前视频播放完成");
            await sleep(1500);
            goNext();
        };

        v.onerror = () => {
            console.warn("⚠ 视频异常，尝试修复");
            retryPlay();
        };

        v.onpause = () => {
            setTimeout(() => {
                if (v.paused) forcePlay("pause-fix");
            }, 800);
        };
    }

    function retryPlay() {
        const v = getVideo();
        if (!v) return;

        if (retryCount >= MAX_RETRY) {
            console.warn("❌ 多次失败，刷新页面");
            location.reload();
            return;
        }

        retryCount++;
        v.load();
        setTimeout(() => forcePlay("retry"), 1000);
    }

    // ================= 自动下一节 =================
    function goNext() {
        const next = getNextLesson();
        if (!next) {
            console.log("🎉 所有课程播放完成");
            return;
        }

        const btn = next.querySelector(".subsectionStudy span");
        if (btn) {
            console.log("➡️ 进入下一节");
            btn.click();
            retryCount = 0;
        }
    }

    // ================= 防后台暂停 =================
    function antiBackgroundPause() {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) forcePlay("background");
        });

        setInterval(() => {
            const v = getVideo();
            if (v && v.paused) {
                forcePlay("interval");
            }
        }, CHECK_INTERVAL);
    }

    // ================= 启动 =================
    function start() {
        forcePlay("init");
        bindVideoEvents();
        antiBackgroundPause();
    }

    setTimeout(start, 3000);

})();
