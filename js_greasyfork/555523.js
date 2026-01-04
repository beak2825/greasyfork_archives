// ==UserScript==
// @name         新时代研究生英语高级视听说教程刷课时，无答题
// @namespace    http://tampermonkey.net/
// @version      2025-11-10
// @description  视频静音自动播放，结束后自动点击下一页、防挂机检测（微课平台）
// @author       You
// @match        https://microlesson.rcgtjy.com/Adm/CourseStruct/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555523/%E6%96%B0%E6%97%B6%E4%BB%A3%E7%A0%94%E7%A9%B6%E7%94%9F%E8%8B%B1%E8%AF%AD%E9%AB%98%E7%BA%A7%E8%A7%86%E5%90%AC%E8%AF%B4%E6%95%99%E7%A8%8B%E5%88%B7%E8%AF%BE%E6%97%B6%EF%BC%8C%E6%97%A0%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/555523/%E6%96%B0%E6%97%B6%E4%BB%A3%E7%A0%94%E7%A9%B6%E7%94%9F%E8%8B%B1%E8%AF%AD%E9%AB%98%E7%BA%A7%E8%A7%86%E5%90%AC%E8%AF%B4%E6%95%99%E7%A8%8B%E5%88%B7%E8%AF%BE%E6%97%B6%EF%BC%8C%E6%97%A0%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Tampermonkey] 脚本已加载 ✅");

    // === 1. 定期检测视频并播放（静音） ===
    setInterval(() => {
        const video = document.querySelector('video.ke-video.video');
        if (video) {
            // 强制静音
            if (!video.muted) {
                video.muted = true;
                console.log("已强制静音 🎧");
            }

            // 自动播放
            if (video.paused) {
                console.log("尝试启动视频播放...");
                video.play().catch(() => {
                    console.log("播放被阻止，尝试模拟点击");
                    video.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                });
            }

            // 监听视频播放结束事件，点击下一页
            if (!video.hasAttribute('listener-added')) {
                video.setAttribute('listener-added', 'true');
                video.addEventListener('ended', () => {
                    console.log("视频播放结束，尝试点击下一页按钮...");
                    const nextBtn = document.querySelector('li[rightmenu="next"] a.dropdown-toggle');
                    if (nextBtn) {
                        nextBtn.click();
                        console.log("已点击下一页按钮 ✅");
                    } else {
                        console.log("未检测到下一页按钮 ❌");
                    }
                });
            }
        } else {
            console.log("未检测到视频元素");
        }
    }, 3000); // 每3秒检测一次

    // === 2. 最小滚动 + 回到页面顶部防挂机 ===
    setInterval(() => {
        const scrollDistance = 50; // 最小滚动距离
        window.scrollBy(0, scrollDistance);
        console.log("向下滚动最小距离以防挂机");
        setTimeout(() => {
            window.scrollTo(0, 0); // 回到页面顶部
            console.log("回到页面顶部");
        }, 500); // 延迟0.5秒再回顶部
    }, 20000); // 每10秒执行一次

})();
