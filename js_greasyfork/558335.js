// ==UserScript==
// @name         智慧树全自动刷课脚本
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动下一集、自动静音播放、防暂停、跨页面持久运行
// @author       Gemini 3.0 Pro
// @match        *://*.zhihuishu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558335/%E6%99%BA%E6%85%A7%E6%A0%91%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/558335/%E6%99%BA%E6%85%A7%E6%A0%91%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log(">>> 脚本已注入，开始监视...");

    // 设置定时器，每 2 秒运行一次主逻辑
    setInterval(function() {
        var video = document.querySelector('video');
        var allListItems = document.querySelectorAll('.file-item');

        // 如果找不到视频，可能是页面还没加载完，直接返回
        if (!video) return;

        // --- 模块1：暴力自动播放 (解决刷新后暂停问题) ---
        // 只要视频暂停且未结束，就强制静音并播放
        if (video.paused && !video.ended) {
            console.log("监测到暂停，尝试自动恢复...");
            video.muted = true; // 必须静音才能通过浏览器的自动播放策略

            var playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // 忽略加载中的报错
                });
            }
        }

        // --- 模块2：自动跳转 (解决播放完卡住问题) ---
        if (video.ended) {
            console.log(">>> 本集结束，寻找下一集...");

            for (var i = 0; i < allListItems.length; i++) {
                // 找到当前高亮的那一行
                if (allListItems[i].classList.contains('active')) {
                    // 检查是否存在下一行
                    if (i + 1 < allListItems.length) {
                        var nextItem = allListItems[i + 1];
                        console.log(">>> 即将跳转：" + nextItem.innerText);

                        // 点击跳转 (这会导致页面刷新，脚本会由油猴插件自动在新页面重新加载)
                        nextItem.click();
                    } else {
                        console.log(">>> 已是最后一集，任务完成。");
                    }
                    break;
                }
            }
        }
    }, 2000);

})();