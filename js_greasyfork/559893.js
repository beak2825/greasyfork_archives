// ==UserScript==
// @name         HUST课程平台网课全自动刷课助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动播放、自动跳转下一节、防卡死。本脚本不含倍速功能（请配合其他加速插件使用）。
// @author       LZH
// @license      MIT
// @match        *://smartcourse-d.hust.edu.cn/*
// @match        *://*.hust.edu.cn/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559893/HUST%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E7%BD%91%E8%AF%BE%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559893/HUST%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E7%BD%91%E8%AF%BE%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ⚙️ 参数配置 ---
    var CONFIG = {
        wait: 10000,// 播完等待时间 (毫秒，建议15秒以同步成绩)
        interval: 1000// 检测频率 (毫秒)
    };
    // ------------------
    // 变量初始化
    var isWaiting = false; // 是否在等待跳转
    var lastTime = -1;// 上次进度
    var stuckCount = 0;// 卡顿次数

    // 辅助：跨框架找元素
    function find(selector) {
        var el = document.querySelector(selector);
        if (!el && window.parent) try { el = window.parent.document.querySelector(selector); } catch(e){}
        if (!el && window.top) try { el = window.top.document.querySelector(selector); } catch(e){}
        return el;
    }

    // 核心循环
    setInterval(function() {
        // ===================================
        // 1. 处理弹窗 (优先级最高)
        // ===================================
        var popBtn = find('.nextChapter');
        if (popBtn && popBtn.offsetParent) {
            console.log(">>> 🔨 发现任务点弹窗，暴力点击！");
            popBtn.click();
            // 模拟原生点击
            try { popBtn.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true})); } catch(e){}
            return;
        }

        // ===================================
        // 2. 视频控制
        // ===================================
        var video = document.querySelector('video') || document.getElementById('video_html5_api');

        if (video) {
            // A. 自动播放逻辑 (保持静音以确保自动播放成功)
            if (video.paused && !video.ended && !isWaiting) {
                console.log(">>> ⚡️ 检测到暂停，执行自动播放...");
                // 优先点击大播放按钮
                var bigPlayBtn = document.querySelector('.vjs-big-play-button');
                if (bigPlayBtn && bigPlayBtn.offsetParent) {
                    bigPlayBtn.click();
                } else {
                    // 强制静音并播放 (浏览器策略要求自动播放必须静音)
                    video.muted = true;
                    var playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(function(error) {
                            video.muted = true;
                            video.play();
                        });
                    }
                }
            }

            // B. (倍速代码已删除，请使用外部插件控制)

            // C. 防卡死检测
            if (!video.paused && !video.ended && !isWaiting) {
                // 如果进度没变 (差值小于0.1秒)
                if (Math.abs(video.currentTime - lastTime) < 0.1) {
                    stuckCount++;
                    if (stuckCount >= 3) {
                        console.warn(">>> 🔨 视频卡死，执行重启...");
                        video.pause();
                        setTimeout(function(){ video.play(); }, 200);
                        stuckCount = 0;
                    }
                } else {
                    stuckCount = 0;
                }
                lastTime = video.currentTime;
            }

            // D. 结束跳转逻辑
            if (video.ended) {
                if (!isWaiting) {
                    console.log(">>> 🛑 视频结束！");
                    console.log(">>> ⏳ 等待 " + (CONFIG.wait/1000) + " 秒同步成绩...");
                    isWaiting = true;

                    setTimeout(function() {
                        console.log(">>> ⏰ 时间到，跳转下一节！");
                        var nextBtn = find('#prevNextFocusNext');
                        if (nextBtn) {
                            nextBtn.click();
                            // 点击后延迟重置状态
                            setTimeout(function(){ isWaiting = false; }, 2000);
                        } else {
                            console.error(">>> ❌ 未找到按钮，请手动点击");
                            isWaiting = false;
                        }
                    }, CONFIG.wait);
                }
            }
        }
    }, CONFIG.interval);

})();