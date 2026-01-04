// ==UserScript==
// @name         顺德区教师在线研修(2倍速)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  登录，打开学习页面，将自动学习，每章节学习完后自动跳到下一个，并自动设置2倍速播放。
// @author       化名
// @match        https://zy.jsyx.sdedu.net/*
// @icon         https://zy.jsyx.sdedu.net/
// @grant        none

// @license      暂无
// @downloadURL https://update.greasyfork.org/scripts/556050/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%282%E5%80%8D%E9%80%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556050/%E9%A1%BA%E5%BE%B7%E5%8C%BA%E6%95%99%E5%B8%88%E5%9C%A8%E7%BA%BF%E7%A0%94%E4%BF%AE%282%E5%80%8D%E9%80%9F%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('⭐ 脚本启动！v1.10 - 1.5倍速 & 防 now 错误优化');

    // 时间字符串转秒数（fallback用）
    function timeToSeconds(timeStr) {
        if (!timeStr) return 0;
        timeStr = timeStr.replace(/[^0-9:]/g, '');
        var parts = timeStr.split(':').map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return parseInt(timeStr) || 0;
    }

    // 全局
    var isBuffered = false;
    var lastProgressCheck = 0;
    var CHECK_INTERVAL = 5000;
    var lastCurrentTime = 0;
    var noProgressCount = 0;
    var NO_PROGRESS_THRESHOLD = 10;
    var chapterCompleted = false;
    var jumpAttempted = false;

    function play(){
        try {  // play() 内捕获错误，防崩溃
            var now = Date.now();
            if (now % 10000 < 5000) console.log('🔍 检查进度... (时间: ' + new Date().toLocaleTimeString() + ')');

            if (chapterCompleted || jumpAttempted) {
                console.log('✅ 章节处理中，跳过检查');
                return;
            }

            var v = document.querySelector('video');
            if (!v) return;

            // 优先：视频API进度
            var current = v.currentTime;
            var duration = v.duration;
            var progress = 0;
            if (duration > 0 && !isNaN(duration)) {
                progress = (current / duration) * 100;
                var timeDelta = Math.abs(current - lastCurrentTime);
                lastCurrentTime = current;
                if (now % 20000 < 5000) console.log('📊 视频API进度: ' + progress.toFixed(1) + '% (Δt: ' + timeDelta.toFixed(1) + 's)');

                if (progress >= 95) {
                    chapterCompleted = true;
                    jumpAttempted = true;
                    var delay = (duration <= 90) ? 10000 : 6000;
                    console.log('🎯 已达结束，尝试跳转！延迟 ' + (delay/1000) + 's');
                    setTimeout(() => {
                        attemptJump();
                        setTimeout(() => {
                            chapterCompleted = false;
                            jumpAttempted = false;
                        }, 15000);
                    }, delay);
                    return;
                }

                // 卡顿检测：仅 <80%
                if (progress < 80 && timeDelta < 1 && isBuffered) {
                    noProgressCount++;
                    if (noProgressCount >= NO_PROGRESS_THRESHOLD && now % 10000 < 5000) console.log('⚠️ 卡顿计数: ' + noProgressCount);
                    if (noProgressCount >= NO_PROGRESS_THRESHOLD) {
                        console.log('🚨 卡顿超时，强制跳转');
                        chapterCompleted = true;
                        jumpAttempted = true;
                        attemptJump();
                        noProgressCount = 0;
                        return;
                    }
                } else {
                    noProgressCount = 0;
                }
            }

            // Fallback: DOM
            checkDOMAndJump();

            lastProgressCheck = now;
        } catch (e) {
            console.log('❌ play() 内错误: ' + e.message + ' - 继续运行');
        }
    }

    function checkDOMAndJump() {
        if (chapterCompleted || jumpAttempted) return;

        var promptElem = document.querySelector(".g-study-prompt p");
        if (promptElem && promptElem.innerText.indexOf("您已完成观看") >= 0) {
            console.log('✅ DOM完成提示，尝试跳转');
            chapterCompleted = true;
            jumpAttempted = true;
            setTimeout(attemptJump, 2000);
            return;
        }

        var timer1Elem = document.querySelector(".g-study-prompt p span");
        var timer2Elems = document.querySelectorAll(".g-study-prompt p span");
        var timer2Elem = timer2Elems[1] || timer2Elems[timer2Elems.length - 1];
        if (timer1Elem && timer2Elem) {
            var timer1 = timeToSeconds(timer1Elem.innerText);
            var timer2 = timeToSeconds(timer2Elem.innerText);
            if (Date.now() % 20000 < 5000) console.log('📊 DOM进度: ' + timer1 + '/' + timer2 + 's');
            if (timer2 > 0 && timer1 >= timer2) {
                console.log('🎯 DOM完成，尝试跳转');
                chapterCompleted = true;
                jumpAttempted = true;
                setTimeout(attemptJump, 3000);
                return;
            }
        }
    }

    // 鲁棒跳转函数
    function attemptJump() {
        console.log('🔄 尝试跳转按钮...');
        // 优先选择器
        var nextBtns = document.querySelectorAll("#studySelectAct a");
        var nextBtn = nextBtns[1] || nextBtns[nextBtns.length - 1] || document.querySelector("a[href*='next']") || document.querySelector("button, a[contains(text(), '下一章')]") || document.querySelector("a[contains(text(), '下一')]");
        if (!nextBtn) {
            // Fallback: 搜索文本含"下一"的链接
            var allLinks = document.querySelectorAll("a, button");
            for (var i = 0; i < allLinks.length; i++) {
                if (allLinks[i].textContent.includes('下一') || allLinks[i].textContent.includes('Next')) {
                    nextBtn = allLinks[i];
                    break;
                }
            }
        }

        if (nextBtn) {
            nextBtn.click();
            console.log('▶️ 成功点击跳转按钮: ' + nextBtn.textContent.trim());
            jumpAttempted = false;
        } else {
            console.log('❌ 未找到跳转按钮，重试5秒后...');
            setTimeout(attemptJump, 5000);
        }
    }

    // 初始化
    function init() {
        console.log('🚀 初始化视频...');
        var v = document.querySelector('video');
        if (!v) {
            console.log('❌ 视频未找到，等待...');
            return;
        }

        v.muted = true;
        lastCurrentTime = v.currentTime;
        chapterCompleted = false;
        jumpAttempted = false;

        // 缓冲监听
        v.addEventListener('progress', (e) => {
            if (v.buffered.length > 0 && v.duration > 0) {
                var buf = (v.buffered.end(0) / v.duration * 100).toFixed(1);
                if (parseFloat(buf) >= 30 && !isBuffered) {
                    isBuffered = true;
                    setTimeout(() => {
                        v.playbackRate = 1.5;  // ⭐⭐⭐ 改为1.5倍速
                        v.play().then(() => console.log('▶️ 播放启动 (缓冲30%)')).catch(e => console.log('❌ 播放失败: ' + e.message));
                    }, 1000);
                }
            }
        });

        v.addEventListener('ended', () => {
            console.log('🏁 视频结束，尝试跳转');
            chapterCompleted = true;
            setTimeout(attemptJump, 3000);
        });

        v.addEventListener('canplaythrough', () => {
            console.log('✅ 缓冲完成');
            isBuffered = true;
            setTimeout(() => {
                v.playbackRate = 1.5;  // ⭐⭐⭐ 改为1.5倍速
                v.play().then(() => console.log('▶️ 播放启动')).catch(e => console.log('❌ 播放失败: ' + e.message));
            }, 2000);
        });

        v.addEventListener('loadedmetadata', () => v.playbackRate = 1.5);  // ⭐⭐⭐ 改为1.5倍速

        // 强制初始播放
        setTimeout(() => {
            if (v.paused) {
                console.log('🔧 检测到暂停，强制播放');
                v.playbackRate = 1.5;  // ⭐⭐⭐ 改为1.5倍速
                v.play().then(() => console.log('▶️ 强制播放成功')).catch(e => console.log('❌ 强制失败: ' + e.message));
            }
        }, 3000);

        if (v.readyState >= 4) {
            isBuffered = true;
            setTimeout(() => {
                v.play();
                v.playbackRate = 1.5;  // ⭐⭐⭐ 改为1.5倍速
            }, 2000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // MutationObserver
    var mo = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length > 0 && document.querySelector('video'))) {
            console.log('🔄 页面变化，重置 (延迟3秒)');
            setTimeout(() => {
                isBuffered = false;
                noProgressCount = 0;
                lastCurrentTime = 0;
                chapterCompleted = false;
                jumpAttempted = false;
                init();
            }, 3000);
        }
    });
    mo.observe(document.body, {childList: true, subtree: true});

    // 主循环（修复 now：直接用 Date.now()）
    setInterval(() => {
        try {
            if (Date.now() % 10000 < 2000) console.log('🔄 运行中... (isBuffered: ' + isBuffered + ', completed: ' + chapterCompleted + ')');

            var v = document.querySelector('video');
            if (v && !chapterCompleted) {
                if (isBuffered) {
                    if (v.paused) v.play();
                    v.playbackRate = 1.5;  // ⭐⭐⭐ 改为1.5倍速
                }
            }

            if (!chapterCompleted && Date.now() - lastProgressCheck >= CHECK_INTERVAL) {
                play();
            }

            // 答题
            var responses = document.querySelectorAll("input[name='response']");
            if (responses.length > 0) {
                var idx = Math.floor(Math.random() * responses.length);
                responses[idx].checked = true;
                document.querySelector('.m-common-btn .m-reExam-btn a button')?.click();
                console.log('❓ 答题完成');
            }
        } catch (e) {
            console.log('❌ 循环错误: ' + e.message + ' - 继续运行');
        }
    }, 2000);
})();